import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import "./styles/WorkModal.css";

type WorkProject = {
  title: string;
  tech: string;
  desc: string;
  descLong: string;
  status: string;
  gradient: [string, string];
  screenshot?: string;
  screenshots?: string[];
  logo?: string;
  logoPosition?: string;
  logoSize?: string;
};

type WorkModalProps = {
  project: WorkProject | null;
  onClose: () => void;
};

const statusLabel: Record<string, string> = {
  active: "Active",
  wip: "In Progress",
  shipped: "Shipped",
  completed: "Completed",
};

const WorkModal = ({ project, onClose }: WorkModalProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const scrollbarWidthRef = useRef(0);
  const savedScrollRef = useRef(0);

  useEffect(() => {
    if (!project || !overlayRef.current || !modalRef.current) return;

    // Save scroll position before locking body (prevents scroll jump on close)
    scrollbarWidthRef.current = window.innerWidth - document.documentElement.clientWidth;
    savedScrollRef.current = window.scrollY;
    document.body.style.overflow = "hidden";
    document.body.style.top = `-${savedScrollRef.current}px`;
    if (scrollbarWidthRef.current > 0) {
      document.body.style.paddingRight = `${scrollbarWidthRef.current}px`;
    }

    // Disable ScrollTrigger pin without resetting progress
    ScrollTrigger.getById("work-scroll")?.disable(false, false);

    // Animate in
    gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power2.out" });
    gsap.fromTo(modalRef.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.35, ease: "power3.out" });

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [project]);

  const handleClose = () => {
    if (!overlayRef.current || !modalRef.current) return;

    gsap.to(modalRef.current, { opacity: 0, y: 10, duration: 0.18, ease: "power2.in" });
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.22,
      ease: "power2.in",
      onComplete: () => {
        document.body.style.overflow = "";
        document.body.style.top = "";
        document.body.style.paddingRight = "";
        // Restore exact scroll position
        window.scrollTo({ top: savedScrollRef.current, behavior: "instant" });
        // Re-enable without resetting progress or refreshing
        ScrollTrigger.getById("work-scroll")?.enable(false, false);
        onClose();
      },
    });
  };

  if (!project) return null;

  return (
    <div className="work-modal-overlay" ref={overlayRef} onClick={handleClose}>
      <div className="work-modal" ref={modalRef} onClick={(e) => e.stopPropagation()}>
        <div
          className="work-modal-header"
          style={{ background: `linear-gradient(135deg, ${project.gradient[0]}, ${project.gradient[1]})` }}
        >
          {project.screenshots && project.screenshots.length > 1 ? (
            <div className="work-modal-screenshots-row">
              {project.screenshots.map((src, i) => (
                <img key={i} src={src} alt={`${project.title} ${i + 1}`} className="work-modal-screenshot-item" />
              ))}
            </div>
          ) : project.screenshots && project.screenshots.length === 1 ? (
            <img src={project.screenshots[0]} alt={project.title} className="work-modal-screenshot" />
          ) : project.screenshot ? (
            <img src={project.screenshot} alt={project.title} className="work-modal-screenshot" />
          ) : (
            <div className="work-modal-abbr">
              {project.title.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
            </div>
          )}
          <button className="work-modal-close" onClick={handleClose} aria-label="Close">
            ×
          </button>
        </div>
        <div className="work-modal-body">
          <div className="work-modal-meta">
            <span className={`work-modal-status work-status-${project.status}`}>
              {statusLabel[project.status] ?? project.status}
            </span>
            <span className="work-modal-tech">{project.tech}</span>
          </div>
          <h2 className="work-modal-title">{project.title}</h2>
          <p className="work-modal-desc">{project.descLong}</p>
        </div>
      </div>
    </div>
  );
};

export default WorkModal;
