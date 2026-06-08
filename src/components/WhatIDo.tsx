import { useEffect, useRef } from "react";
import "./styles/WhatIDo.css";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    index: "01",
    title: "AI-First Development",
    subtitle: "From spec to shipped product",
    desc: "Building AI-powered tools from scratch using Claude Code, Claude API, and MCP. Spec → working product, no filler.",
    tools: ["Claude Code", "Claude API", "MCP", "Node.js", "Python"],
  },
  {
    index: "02",
    title: "Mobile Development",
    subtitle: "Cross-platform, native feel",
    desc: "React Native and Expo for iOS and Android. Real apps with Supabase backends, smooth animations, and proper UX.",
    tools: ["React Native", "Expo", "Supabase", "TypeScript"],
  },
  {
    index: "03",
    title: "UI/UX Design",
    subtitle: "Interfaces that earn trust",
    desc: "Design systems, component libraries, and interactive prototypes. Self-taught but pixel-precise — taste over templates.",
    tools: ["Three.js", "GSAP", "CSS", "Figma", "Alpine.js"],
  },
  {
    index: "04",
    title: "Automation & Bots",
    subtitle: "If it can run itself, it should",
    desc: "Node.js scripting, WhatsApp bots, scheduled tasks, scrapers. Built and deployed tools that run 24/7 without babysitting.",
    tools: ["Node.js", "open-wa", "Task Scheduler", "Cloudflare Workers"],
  },
];

const WhatIDo = () => {
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const isTouchDevice = ScrollTrigger.isTouch === 1;

    if (isTouchDevice) {
      itemsRef.current.forEach((item) => {
        if (!item) return;
        item.addEventListener("click", () => toggleItem(item));
      });
    }

    // Entrance animation
    const section = document.querySelector(".whatido-section");
    if (!section) return;

    const heading = section.querySelector(".whatido-heading");
    const items = section.querySelectorAll(".whatido-item");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 65%",
        end: "top 20%",
        toggleActions: "play none none reverse",
      },
    });

    tl.fromTo(
      heading,
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
    ).fromTo(
      items,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power2.out", stagger: 0.1 },
      "-=0.4"
    );

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.vars.trigger === section) t.kill();
      });
    };
  }, []);

  const toggleItem = (item: HTMLDivElement) => {
    const isActive = item.classList.contains("whatido-item-active");
    itemsRef.current.forEach((el) => {
      if (el) el.classList.remove("whatido-item-active");
    });
    if (!isActive) item.classList.add("whatido-item-active");
  };

  return (
    <div className="whatido-section" id="whatido">
      <div className="whatido-layout">
        <div className="whatido-left">
          <h2 className="whatido-heading title">
            W<span className="whatido-hat">HAT</span>
            <div>
              &nbsp;I<span className="whatido-do"> DO</span>
            </div>
          </h2>
        </div>
        <div className="whatido-right">
          {services.map((s, i) => (
            <div
              key={s.index}
              className="whatido-item"
              ref={(el) => { itemsRef.current[i] = el; }}
            >
              <div className="whatido-item-header">
                <span className="whatido-index">{s.index}</span>
                <div className="whatido-item-titles">
                  <h3 className="whatido-title">{s.title}</h3>
                  <h4 className="whatido-subtitle">{s.subtitle}</h4>
                </div>
              </div>
              <div className="whatido-item-body">
                <p className="whatido-desc">{s.desc}</p>
                <div className="whatido-tags">
                  {s.tools.map((tool) => (
                    <span key={tool} className="whatido-tag">{tool}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhatIDo;
