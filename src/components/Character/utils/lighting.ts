import * as THREE from "three";
import { RGBELoader } from "three-stdlib";
import { gsap } from "gsap";

const setLighting = (scene: THREE.Scene) => {
  // Key light — white, front-left, main face illumination
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0);
  directionalLight.intensity = 0;
  directionalLight.position.set(-0.47, -0.32, -1);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 1024;
  directionalLight.shadow.mapSize.height = 1024;
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 50;
  scene.add(directionalLight);

  // Fill light — white, straight front, softens shadows on face
  const fillLight = new THREE.DirectionalLight(0xffffff, 0);
  fillLight.position.set(0, 1, 6);
  scene.add(fillLight);

  // Neon blue rim — back-right, blue edge on body/shoulders
  const rimLight = new THREE.DirectionalLight(0x0055ff, 0);
  rimLight.position.set(3, 2, -2);
  scene.add(rimLight);

  // Hair light — neon blue from directly above, lights top of head and hair
  const hairLight = new THREE.PointLight(0x0077ff, 0, 15, 2);
  hairLight.position.set(0, 18, 2);
  scene.add(hairLight);

  // Back glow — blue from behind, creates halo/silhouette effect
  const backLight = new THREE.DirectionalLight(0x0044dd, 0);
  backLight.position.set(0, 3, -4);
  scene.add(backLight);

  // Neon blue point — driven by screenlight when at desk
  const pointLight = new THREE.PointLight(0x0055ff, 0, 100, 3);
  pointLight.position.set(3, 12, 4);
  pointLight.castShadow = true;
  scene.add(pointLight);

  // Ambient — very subtle cool white, no color cast
  const ambientLight = new THREE.AmbientLight(0xddeeff, 0);
  scene.add(ambientLight);

  // Load HDR only for reflections, keep intensity very low to avoid pink cast
  new RGBELoader()
    .setPath("/")
    .load("char_enviorment.hdr", function (texture) {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = texture;
      scene.environmentIntensity = 0;
      scene.environmentRotation.set(5.76, 85.85, 1);
    });

  function setPointLight(screenLight: any) {
    if (screenLight && screenLight.material && screenLight.material.opacity > 0.9) {
      pointLight.intensity = screenLight.material.emissiveIntensity * 20;
    } else {
      pointLight.intensity = 0;
    }
  }

  const duration = 2;
  const ease = "power2.inOut";

  function turnOnLights() {
    // HDR intensity kept very low — just enough for surface reflections, no pink cast
    gsap.to(scene, { environmentIntensity: 0, duration, ease });
    gsap.to(directionalLight, { intensity: 2.0, duration, ease });
    gsap.to(fillLight, { intensity: 1.2, duration, ease });
    gsap.to(rimLight, { intensity: 4.0, duration, ease });
    gsap.to(hairLight, { intensity: 5.0, duration, ease });
    gsap.to(backLight, { intensity: 3.0, duration, ease });
    gsap.to(ambientLight, { intensity: 0.8, duration, ease });
    gsap.to(".character-rim", {
      y: "55%",
      opacity: 0.9,
      delay: 0.2,
      duration: 2,
    });
  }

  return { setPointLight, turnOnLights };
};

export default setLighting;
