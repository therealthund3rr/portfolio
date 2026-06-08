import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import setCharacter from "./utils/character";
import setLighting from "./utils/lighting";
import { useLoading } from "../../context/LoadingProvider";
import handleResize from "./utils/resizeUtils";
import {
  handleMouseMove,
  handleTouchEnd,
  handleHeadRotation,
  handleTouchMove,
} from "./utils/mouseUtils";
import setAnimations from "./utils/animationUtils";
import { setProgress } from "../Loading";

const Scene = () => {
  const canvasDiv = useRef<HTMLDivElement | null>(null);
  const hoverDivRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef(new THREE.Scene());
  const { setLoading } = useLoading();
  const [character, setChar] = useState<THREE.Object3D | null>(null);

  useEffect(() => {
    if (canvasDiv.current) {
      let rect = canvasDiv.current.getBoundingClientRect();
      let container = { width: rect.width, height: rect.height };
      const aspect = container.width / container.height;
      const scene = sceneRef.current;

      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: window.devicePixelRatio < 2,
        powerPreference: "high-performance",
      });
      renderer.setSize(container.width, container.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.6;
      canvasDiv.current.appendChild(renderer.domElement);

      const camera = new THREE.PerspectiveCamera(14.5, aspect, 0.1, 1000);
      camera.position.z = 10;
      camera.position.set(0, 13.1, 24.7);
      camera.zoom = 1.1;
      camera.updateProjectionMatrix();

      const light = setLighting(scene);
      let progress = setProgress((value) => setLoading(value));
      const { loadCharacter } = setCharacter(renderer, scene, camera);

      const mouse = { x: 0, y: 0 };
      const interpolation = { x: 0, y: 0 };
      let headBone: THREE.Object3D | null = null;
      let screenLight: THREE.Object3D | null = null;
      const clock = new THREE.Clock();
      let mixer: THREE.AnimationMixer | null = null;
      let debounce: ReturnType<typeof setTimeout>;
      let onResize: (() => void) | null = null;
      let headEnabled = false;

      const onMouseMove = (event: MouseEvent) => {
        handleMouseMove(event, (x, y) => {
          mouse.x = x;
          mouse.y = y;
        });
      };

      const onTouchMove = (e: TouchEvent) =>
        handleTouchMove(e, (x, y) => {
          mouse.x = x;
          mouse.y = y;
        });

      const onTouchEnd = () =>
        handleTouchEnd((x, y) => {
          mouse.x = x;
          mouse.y = y;
        });

      loadCharacter()
        .then((gltf) => {
          if (gltf) {
            const animations = setAnimations(gltf);
            hoverDivRef.current && animations.hover(gltf, hoverDivRef.current);
            mixer = animations.mixer;
            let char = gltf.scene;
            setChar(char);
            scene.add(char);
            headBone = char.getObjectByName("spine006") || null;
            screenLight = char.getObjectByName("screenlight") || null;

            // Attach glasses to head bone so they follow mouse head rotation
            const glasses = char.getObjectByName("occhiali");
            if (glasses && headBone && !(glasses instanceof THREE.SkinnedMesh)) {
              glasses.updateWorldMatrix(true, false);
              const wPos = new THREE.Vector3();
              const wQuat = new THREE.Quaternion();
              const wScale = new THREE.Vector3();
              glasses.matrixWorld.decompose(wPos, wQuat, wScale);
              glasses.removeFromParent();
              headBone.add(glasses);
              headBone.updateWorldMatrix(true, false);
              const headInverse = new THREE.Matrix4().copy(headBone.matrixWorld).invert();
              const localMat = new THREE.Matrix4().compose(wPos, wQuat, wScale).premultiply(headInverse);
              localMat.decompose(glasses.position, glasses.quaternion, glasses.scale);
            }
            progress.loaded().then(() => {
              setTimeout(() => {
                light.turnOnLights();
                animations.startIntro();
                headEnabled = true;
              }, 2500);
            });
            onResize = () => handleResize(renderer, camera, canvasDiv, char);
            window.addEventListener("resize", onResize);
          }
        })
        .catch((err) => {
          console.error("[Scene] loadCharacter failed:", err);
          progress.loaded();
        });

      document.addEventListener("mousemove", (event) => {
        onMouseMove(event);
      });
      const landingDiv = document.getElementById("landingDiv");
      if (landingDiv) {
        landingDiv.addEventListener("touchmove", onTouchMove);
        landingDiv.addEventListener("touchend", onTouchEnd);
      }

      const animate = () => {
        requestAnimationFrame(animate);
        if (headBone && headEnabled) {
          handleHeadRotation(
            headBone,
            mouse.x,
            mouse.y,
            interpolation.x,
            interpolation.y,
            THREE.MathUtils.lerp
          );
          interpolation.x = THREE.MathUtils.lerp(interpolation.x, mouse.x * 0.28, 0.06);
          interpolation.y = THREE.MathUtils.lerp(interpolation.y, -mouse.y * 0.18, 0.06);
          light.setPointLight(screenLight);
        }
        const delta = clock.getDelta();
        if (mixer) {
          mixer.update(delta);
        }
        renderer.render(scene, camera);
      };
      animate();

      return () => {
        clearTimeout(debounce);
        scene.clear();
        renderer.dispose();
        if (onResize) window.removeEventListener("resize", onResize);
        if (canvasDiv.current) {
          canvasDiv.current.removeChild(renderer.domElement);
        }
        if (landingDiv) {
          document.removeEventListener("mousemove", onMouseMove);
          landingDiv.removeEventListener("touchmove", onTouchMove);
          landingDiv.removeEventListener("touchend", onTouchEnd);
        }
      };
    }
  }, []);

  return (
    <>
      <div className="character-container">
        <div className="character-model" ref={canvasDiv}>
          <div className="character-rim"></div>
          <div className="character-hover" ref={hoverDivRef}></div>
        </div>
      </div>
    </>
  );
};

export default Scene;
