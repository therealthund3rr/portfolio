import * as THREE from "three";

export const handleMouseMove = (
  event: MouseEvent,
  setMousePosition: (x: number, y: number) => void
) => {
  const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
  setMousePosition(mouseX, mouseY);
};

export const handleTouchMove = (
  event: TouchEvent,
  setMousePosition: (x: number, y: number) => void
) => {
  if (event.touches.length > 0) {
    const touch = event.touches[0];
    const mouseX = (touch.clientX / window.innerWidth) * 2 - 1;
    const mouseY = -(touch.clientY / window.innerHeight) * 2 + 1;
    setMousePosition(mouseX, mouseY);
  }
};

export const handleTouchEnd = (setMousePosition: (x: number, y: number) => void) => {
  setMousePosition(0, 0);
};

export const handleHeadRotation = (
  headBone: THREE.Object3D,
  mouseX: number,
  mouseY: number,
  interpX: number,
  interpY: number,
  lerp: (a: number, b: number, t: number) => number
) => {
  const targetY = mouseX * 0.28;
  const targetX = -mouseY * 0.18;
  headBone.rotation.y = lerp(interpX, targetY, 0.06);
  headBone.rotation.x = lerp(interpY, targetX, 0.06);
};
