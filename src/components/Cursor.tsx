import { useEffect, useRef } from "react";
import "./styles/Cursor.css";
import gsap from "gsap";

const Cursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current!;
    const mousePos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const cursorPos = { x: mousePos.x, y: mousePos.y };
    let hover = false;

    gsap.set(cursor, { xPercent: -50, yPercent: -50 });

    const onMove = (e: MouseEvent) => {
      mousePos.x = e.clientX;
      mousePos.y = e.clientY;
    };
    document.addEventListener("mousemove", onMove);

    requestAnimationFrame(function loop() {
      if (!hover) {
        cursorPos.x += (mousePos.x - cursorPos.x) / 6;
        cursorPos.y += (mousePos.y - cursorPos.y) / 6;
        gsap.set(cursor, { x: cursorPos.x, y: cursorPos.y });
      }
      requestAnimationFrame(loop);
    });

    document.querySelectorAll<HTMLElement>("[data-cursor]").forEach((el) => {
      const type = el.getAttribute("data-cursor");

      el.addEventListener("mouseenter", () => {
        if (type === "icons") {
          const spans = el.querySelectorAll<HTMLElement>("span");
          const fr = spans[0]?.getBoundingClientRect();
          const lr = spans[spans.length - 1]?.getBoundingClientRect();
          if (fr && lr) {
            const totalH = lr.bottom - fr.top;
            cursor.style.setProperty("--cursorH", `${totalH + 20}px`);
            gsap.set(cursor, {
              xPercent: 0,
              yPercent: 0,
              x: fr.left + fr.width / 2 - 15,
              y: fr.top,
            });
          }
          hover = true;
          cursor.classList.add("cursor-icons");
        } else if (type === "disable") {
          cursor.classList.add("cursor-disable");
        }
      });

      el.addEventListener("mouseleave", () => {
        cursor.classList.remove("cursor-icons", "cursor-disable");
        if (hover) {
          gsap.set(cursor, { xPercent: -50, yPercent: -50 });
          hover = false;
        }
      });
    });

    return () => {
      document.removeEventListener("mousemove", onMove);
    };
  }, []);

  return <div className="cursor-main" ref={cursorRef}></div>;
};

export default Cursor;
