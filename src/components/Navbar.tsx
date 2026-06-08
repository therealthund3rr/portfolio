import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap } from "gsap";
import Lenis from "lenis";
import "./styles/Navbar.css";
import { config } from "../config";

gsap.registerPlugin(ScrollTrigger);
export let lenis: Lenis | null = null;

const Navbar = () => {
  useEffect(() => {
    lenis = new Lenis({
      duration: 1.7,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.7,
      touchMultiplier: 2,
      infinite: false,
    });

    lenis.stop();

    function raf(time: number) {
      lenis?.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.lagSmoothing(0);

    const links = document.querySelectorAll(".header ul a");
    links.forEach((elem) => {
      const element = elem as HTMLAnchorElement;
      element.addEventListener("click", (e) => {
        if (window.innerWidth > 1024) {
          e.preventDefault();
          const target = element.getAttribute("data-href");
          if (target && lenis) {
            const el = document.querySelector(target) as HTMLElement;
            if (el) lenis.scrollTo(el, { offset: 0, duration: 1.5 });
          }
        }
      });
    });

    window.addEventListener("resize", () => lenis?.resize());

    return () => {
      lenis?.destroy();
      lenis = null;
    };
  }, []);

  return (
    <>
      <div className="header">
        <a href="/#" className="navbar-title nav-fade" data-cursor="disable">
          NC
        </a>
        <a
          href={`mailto:${config.social.email}`}
          className="navbar-connect nav-fade"
          data-cursor="disable"
        >
          {config.social.email}
        </a>
        <ul>
          <li>
            <a data-href="#about" href="#about" className="nav-fade">
              ABOUT
            </a>
          </li>
          <li>
            <a data-href="#work" href="#work" className="nav-fade">
              WORK
            </a>
          </li>
          <li>
            <a data-href="#contact" href="#contact" className="nav-fade">
              CONTACT
            </a>
          </li>
        </ul>
      </div>
      <div className="nav-fade-line"></div>
    </>
  );
};

export default Navbar;
