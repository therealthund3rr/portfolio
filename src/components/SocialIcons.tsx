import { FaGithub, FaInstagram, FaLinkedinIn } from "react-icons/fa6";
import "./styles/SocialIcons.css";
import { config } from "../config";
import { useEffect } from "react";

const SocialIcons = () => {
  useEffect(() => {
    const social = document.getElementById("social") as HTMLElement;
    if (!social) return;

    social.querySelectorAll<HTMLElement>("span").forEach((item) => {
      const link = item.querySelector("a") as HTMLElement;
      if (!link) return;

      const rect = item.getBoundingClientRect();
      let mouseX = rect.width / 2;
      let mouseY = rect.height / 2;
      let currentX = 0;
      let currentY = 0;

      const updatePosition = () => {
        currentX += (mouseX - currentX) * 0.1;
        currentY += (mouseY - currentY) * 0.1;
        link.style.setProperty("--siLeft", `${currentX}px`);
        link.style.setProperty("--siTop", `${currentY}px`);
        requestAnimationFrame(updatePosition);
      };

      const onMouseMove = (e: MouseEvent) => {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        if (x < 40 && x > 10 && y < 40 && y > 5) {
          mouseX = x;
          mouseY = y;
        } else {
          mouseX = rect.width / 2;
          mouseY = rect.height / 2;
        }
      };

      document.addEventListener("mousemove", onMouseMove);
      updatePosition();
    });
  }, []);

  return (
    <div className="icons-section" aria-hidden="false">
      <div className="social-icons" data-cursor="icons" id="social">
        <span>
          <a href={config.social.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <FaGithub />
          </a>
        </span>
        <span>
          <a href={config.social.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <FaLinkedinIn />
          </a>
        </span>
        <span>
          <a href={config.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <FaInstagram />
          </a>
        </span>
      </div>
    </div>
  );
};

export default SocialIcons;
