import { useEffect, useState } from "react";
import "./styles/Work.css";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { config } from "../config";
import WorkModal from "./WorkModal";

gsap.registerPlugin(ScrollTrigger);

type WorkProject = (typeof config.work)[number];

const statusLabel: Record<string, string> = {
  active: "Active",
  wip: "In Progress",
  shipped: "Shipped",
  completed: "Completed",
};

const Work = () => {
  const [selected, setSelected] = useState<WorkProject | null>(null);

  useEffect(() => {
    const revealTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".work-section",
        start: "top 20%",
        toggleActions: "play none none none",
        id: "work-reveal",
      },
    });

    revealTl
      .to(".work-heading", { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, 0)
      .to(".work-count", { opacity: 1, duration: 0.4, ease: "power2.out" }, 0.15)
      .to(".work-card", {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
      }, 0.35);

    if (window.innerWidth <= 768) {
      return () => {
        revealTl.kill();
        ScrollTrigger.getById("work-reveal")?.kill();
      };
    }

    let translateX = 0;

    function setTranslateX() {
      const track = document.querySelector(".work-track") as HTMLElement;
      if (!track) return;
      translateX = track.scrollWidth - window.innerWidth;
      if (translateX < 0) translateX = 0;
    }

    setTranslateX();

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".work-section",
        start: "top top",
        end: () => `+=${translateX}`,
        scrub: 1,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        id: "work-scroll",
        invalidateOnRefresh: true,
      },
    });

    tl.to(".work-track", { x: -translateX, ease: "none" });

    ScrollTrigger.refresh();

    return () => {
      revealTl.kill();
      tl.kill();
      ScrollTrigger.getById("work-reveal")?.kill();
      ScrollTrigger.getById("work-scroll")?.kill();
    };
  }, []);

  return (
    <>
      <div className="work-section" id="work">
        <div className="work-header-row">
          <h2 className="work-heading">Selected Work</h2>
          <span className="work-count">{config.work.length} projects</span>
        </div>
        <div className="work-track">
          {config.work.map((project, i) => (
            <div
              className="work-card"
              key={i}
              onClick={() => setSelected(project)}
            >
              <div className="work-card-visual">
                <div
                  className="work-card-gradient"
                  style={{
                    background: `linear-gradient(135deg, ${project.gradient[0]}, ${project.gradient[1]})`,
                  }}
                />
                {project.logo ? (
                  project.logo.endsWith(".svg") ? (
                    <img
                      src={project.logo}
                      alt={project.title}
                      className="work-card-logo-svg"
                    />
                  ) : (
                    <div
                      className="work-card-logo-bg"
                      style={{
                        backgroundImage: `url(${project.logo})`,
                        backgroundPosition: project.logoPosition ?? "50% 50%",
                        backgroundSize: project.logoSize ?? "600%",
                        backgroundRepeat: "no-repeat",
                      }}
                    />
                  )
                ) : (
                  <div className="work-card-abbr">
                    {project.title.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                )}
                <span className={`work-card-status work-status-${project.status}`}>
                  {statusLabel[project.status]}
                </span>
              </div>
              <div className="work-card-info">
                <h3 className="work-card-title">{project.title}</h3>
                <p className="work-card-tech">{project.tech}</p>
                <p className="work-card-desc">{project.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <WorkModal project={selected} onClose={() => setSelected(null)} />
    </>
  );
};

export default Work;
