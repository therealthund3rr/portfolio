import { useEffect } from "react";
import "./styles/TechStack.css";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { config } from "../config";
import type { IconType } from "react-icons";
import {
  SiReact,
  SiTypescript,
  SiThreedotjs,
  SiNodedotjs,
  SiPython,
  SiSupabase,
  SiAlpinedotjs,
  SiJavascript,
  SiVite,
  SiGithub,
  SiWhatsapp,
  SiAnthropic,
  SiOpenai,
} from "react-icons/si";
import { TbBrandFigma } from "react-icons/tb";

gsap.registerPlugin(ScrollTrigger);

const logoMap: Record<string, IconType> = {
  "Claude Code": SiAnthropic,
  "React": SiReact,
  "React Native": SiReact,
  "TypeScript": SiTypescript,
  "Three.js": SiThreedotjs,
  "Node.js": SiNodedotjs,
  "Python": SiPython,
  "Supabase": SiSupabase,
  "Alpine.js": SiAlpinedotjs,
  "JavaScript": SiJavascript,
  "Vite": SiVite,
  "Git / GitHub": SiGithub,
  "WhatsApp Auto": SiWhatsapp,
  "UI/UX Design": TbBrandFigma,
  "ChatGPT": SiOpenai,
};

const TechStack = () => {
  useEffect(() => {
    const section = document.querySelector(".techstack-section");
    if (!section) return;

    const heading = section.querySelector(".techstack-heading");
    const cells = section.querySelectorAll(".techstack-cell");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 60%",
        toggleActions: "play none none reverse",
      },
    });

    tl.fromTo(
      heading,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" }
    ).fromTo(
      cells,
      { scale: 0.8, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        ease: "back.out(1.4)",
        stagger: { amount: 0.8, from: "random" },
      },
      "-=0.3"
    );

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.vars.trigger === section) t.kill();
      });
    };
  }, []);

  return (
    <div className="techstack-section" id="techstack">
      <div className="techstack-bg" aria-hidden="true">
        <div className="techstack-bg-grid" />
        <video
          className="techstack-bg-video"
          autoPlay
          muted
          loop
          playsInline
          src="/tech-bg.mp4"
        />
      </div>
      <div className="techstack-content">
        <h2 className="techstack-heading title">Tech Stack</h2>
        <p className="techstack-sub">The elements I work with</p>
        <div className="techstack-grid">
          {config.techStack.map((tech) => {
            const Logo = logoMap[tech.name];
            return (
              <div
                key={tech.symbol}
                className="techstack-cell"
                style={{ "--tech-color": tech.color } as React.CSSProperties}
              >
                {Logo && (
                  <span className="techstack-logo-bg" aria-hidden="true">
                    <Logo />
                  </span>
                )}
                <span className="techstack-number">{tech.number}</span>
                <span className="techstack-symbol">{tech.symbol}</span>
                <span className="techstack-name">{tech.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TechStack;
