import { useEffect } from "react";
import "./styles/HireMe.css";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { FaGithub, FaInstagram, FaLinkedinIn } from "react-icons/fa6";
import { config } from "../config";

gsap.registerPlugin(ScrollTrigger);

const HireMe = () => {
  useEffect(() => {
    const section = document.querySelector(".hireme-section");
    if (!section) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 70%",
        toggleActions: "play none none reverse",
      },
    });

    tl.fromTo(
      ".hireme-pre",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }
    )
      .fromTo(
        ".hireme-heading",
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: "power3.out" },
        "-=0.3"
      )
      .fromTo(
        [".hireme-email", ".hireme-socials", ".hireme-footer"],
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out", stagger: 0.15 },
        "-=0.4"
      );

    // Hide fixed social icons when HireMe section is visible
    ScrollTrigger.create({
      trigger: section,
      start: "top 80%",
      end: "bottom top",
      id: "hireme-icons",
      onEnter: () => gsap.to(".icons-section", { opacity: 0, duration: 0.4, ease: "power2.out" }),
      onLeave: () => gsap.to(".icons-section", { opacity: 1, duration: 0.4, ease: "power2.out" }),
      onEnterBack: () => gsap.to(".icons-section", { opacity: 0, duration: 0.4, ease: "power2.out" }),
      onLeaveBack: () => gsap.to(".icons-section", { opacity: 1, duration: 0.4, ease: "power2.out" }),
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.vars.trigger === section) t.kill();
      });
    };
  }, []);

  return (
    <div className="hireme-section" id="contact">
      <div className="hireme-container">
        <p className="hireme-pre">Available for freelance & collaboration</p>
        <h2 className="hireme-heading">
          Let's build<br />
          <span className="hireme-accent">something</span>
        </h2>
        <div className="hireme-actions">
          <a
            href={`mailto:${config.social.email}`}
            className="hireme-email"
          >
            {config.social.email}
          </a>
          <div className="hireme-socials">
            <a href={config.social.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <FaGithub />
            </a>
            <a href={config.social.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <FaLinkedinIn />
            </a>
            <a href={config.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FaInstagram />
            </a>
          </div>
        </div>
        <div className="hireme-footer">
          <span>© {new Date().getFullYear()} {config.developer.fullName}</span>
          <span>Turin, IT</span>
        </div>
      </div>
    </div>
  );
};

export default HireMe;
