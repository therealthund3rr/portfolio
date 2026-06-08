import * as THREE from "three";
import { GLTF, GLTFLoader } from "three-stdlib";
import { setCharTimeline } from "../../utils/GsapScroll";

const setCharacter = (
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera
) => {
  const loader = new GLTFLoader();

  const loadCharacter = (): Promise<GLTF | null> => {
    return new Promise<GLTF | null>(async (resolve, reject) => {
      try {
        loader.load(
          "/character.glb",
          async (gltf) => {
            let character = gltf.scene;
            // Debug: identify object names and animations
            const allNames: string[] = [];
            character.traverse((obj) => { if (obj.name) allNames.push(obj.name); });
            console.log("[GLB] Direct children:", character.children.map((c: any) => c.name).join(", "));
            console.log("[GLB] All objects:", allNames.join(", "));
            console.log("[GLB] Animations:", gltf.animations.map((a) => a.name).join(", "));
            character.position.y = -1;
            await renderer.compileAsync(character, camera, scene);
            character.traverse((child: any) => {
              if (child.isMesh) {
                const mesh = child as THREE.Mesh;
                child.castShadow = false;
                child.receiveShadow = false;
                mesh.frustumCulled = true;
                if (mesh.material && !Array.isArray(mesh.material)) {
                  (mesh.material as THREE.ShaderMaterial).precision = "mediump";
                }
              }
            });
            resolve(gltf);
            setCharTimeline(character, camera);
          },
          undefined,
          (error) => {
            console.error("[character] GLB load error:", error);
            reject(error);
          }
        );
      } catch (err) {
        console.error("[character] error:", err);
        reject(err);
      }
    });
  };

  return { loadCharacter };
};

export default setCharacter;
