import * as THREE from "three";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function setCharTimeline(
  character: THREE.Object3D<THREE.Object3DEventMap> | null,
  camera: THREE.PerspectiveCamera
) {
  if (!character) return;

  const tl1 = gsap.timeline({
    scrollTrigger: {
      trigger: ".landing-section",
      start: "top top",
      end: "bottom top",
      scrub: true,
      invalidateOnRefresh: true,
    },
  });

  const tl2 = gsap.timeline({
    scrollTrigger: {
      trigger: ".about-section",
      start: "center 55%",
      end: "bottom top",
      scrub: true,
      invalidateOnRefresh: true,
    },
  });

  // tl3: character scrolls UP together with WhatIDo section (reference pattern)
  const tl3 = gsap.timeline({
    scrollTrigger: {
      trigger: ".whatido-section",
      start: "top top",
      end: "bottom top",
      scrub: true,
      invalidateOnRefresh: true,
    },
  });

  let screenLight: any = null;

  const monitorObj = character.getObjectByName("monitor") as THREE.Object3D;

  // Hide desk objects at startup
  ["monitor", "tabvolo", "ground", "Keyboard", "Sphere"].forEach((name) => {
    const obj = character.getObjectByName(name);
    if (!obj) return;
    obj.traverse((child: any) => {
      if (child.isMesh && child.material) {
        const mats = Array.isArray(child.material) ? child.material : [child.material];
        mats.forEach((mat: any) => {
          mat.transparent = true;
          mat.opacity = 0;
        });
      }
    });
  });

  character.children.forEach((object: any) => {
    if (object.name === "screenlight") {
      const mat = object.material as THREE.MeshStandardMaterial;
      if (mat) {
        mat.transparent = true;
        mat.opacity = 0;
        if (mat.emissive) mat.emissive.set("#0055ff");
        gsap.timeline({ repeat: -1, repeatRefresh: true }).to(mat, {
          emissiveIntensity: () => Math.random() * 8,
          duration: () => Math.random() * 0.6,
          delay: () => Math.random() * 0.1,
        });
        screenLight = object;
      }
    }
  });

  const neckBone = character.getObjectByName("spine005");

  if (window.innerWidth > 1024) {
    tl1
      .fromTo(character.rotation, { y: 0 }, { y: 0.7, duration: 1 }, 0)
      .to(camera.position, { z: 22 }, 0)
      .fromTo(".character-model", { x: 0 }, { x: "-25%", duration: 1 }, 0)
      .to(".landing-container", { opacity: 0, duration: 0.4 }, 0)
      .to(".landing-container", { y: "40%", duration: 0.8 }, 0)
      .fromTo(".about-me", { y: "-50%" }, { y: "0%" }, 0);

    tl2
      .to(camera.position, { z: 75, y: 8.4, duration: 6, delay: 2, ease: "power3.inOut" }, 0)
      .to(".about-section", { y: "30%", duration: 6 }, 0)
      .to(".about-section", { opacity: 0, delay: 3, duration: 2 }, 0)
      .fromTo(
        ".character-model",
        { pointerEvents: "inherit" },
        { pointerEvents: "none", x: "-12%", delay: 2, duration: 5 },
        0
      )
      .to(character.rotation, { y: 0.92, x: 0.12, delay: 3, duration: 3 }, 0)
      .to(
        ".character-rim",
        { opacity: 0, scale: 0, y: "-70%", duration: 5, delay: 2 },
        0.3
      );

    if (neckBone) {
      tl2.to(neckBone.rotation, { x: 0.6, delay: 2, duration: 3 }, 0);
    }

    // Reveal desk objects during about scroll
    ["monitor", "tabvolo", "ground", "Keyboard", "Sphere"].forEach((name) => {
      const obj = character.getObjectByName(name);
      if (!obj) return;
      obj.traverse((child: any) => {
        if (child.isMesh && child.material) {
          const mats = Array.isArray(child.material) ? child.material : [child.material];
          mats.forEach((mat: any) => {
            tl2.to(mat, { opacity: 1, duration: 0.8, delay: 3.2 }, 0);
          });
        }
      });
    });

    if (monitorObj) {
      tl2.fromTo(
        monitorObj.position,
        { y: monitorObj.position.y - 10, z: monitorObj.position.z + 2 },
        { y: monitorObj.position.y, z: monitorObj.position.z, delay: 1.5, duration: 3 },
        0
      );
    }

    if (screenLight) {
      tl2.to(screenLight.material, { opacity: 1, duration: 0.8, delay: 4.5 }, 0);
    }

    // tl3: character scrolls up together with WhatIDo section
    tl3
      .fromTo(".character-model", { y: "0%" }, { y: "-100%", duration: 1, ease: "none" }, 0)
      .to(character.rotation, { x: -0.04, duration: 0.5 }, 0);
  }
}

export function setAllTimeline() {
  // Career timeline animation (scrub, line grows, items fade in)
  const careerTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: ".career-section",
      start: "top 55%",
      end: "bottom 25%",
      scrub: 1.5,
      invalidateOnRefresh: true,
    },
  });

  careerTimeline
    .fromTo(".career-heading", { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" }, 0)
    .fromTo(".career-timeline", { scaleY: 0 }, { scaleY: 1, duration: 1, ease: "none", transformOrigin: "top center" }, 0)
    .fromTo(".career-item", { opacity: 0, x: -20 }, { opacity: 1, x: 0, stagger: 0.12, duration: 0.5 }, 0.1)
    .fromTo(".career-bar-fill", { width: "0%" }, { width: (i: number) => `${[65, 85, 78, 70, 60][i] ?? 60}%`, duration: 0.8, stagger: 0.12 }, 0.3);

  if (window.innerWidth > 1024) {
    careerTimeline.fromTo(".career-section", { y: 0 }, { y: "15%", duration: 0.5, delay: 0.2 }, 0);
  }
}
