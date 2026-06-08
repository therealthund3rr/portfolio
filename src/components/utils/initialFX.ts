import { TextSplitter } from "../../utils/textSplitter";
import gsap from "gsap";
import { lenis } from "../Navbar";

export function initialFX() {
  document.body.style.overflowY = "auto";
  if (lenis) lenis.start();

  const main = document.getElementsByTagName("main")[0];
  if (main) main.classList.add("main-active");

  gsap.to("body", {
    backgroundColor: "#080808",
    duration: 0.5,
    delay: 1,
  });

  // Animate landing heading chars (Hello! I'm / NICOLÒ / CELENTANO)
  const headingSelectors = [".landing-info h3", ".landing-intro h2", ".landing-intro h1"];
  const headingElements = headingSelectors.flatMap((sel) =>
    Array.from(document.querySelectorAll(sel))
  );
  const landingHeading = new TextSplitter(headingElements, {
    type: "chars,lines",
    linesClass: "split-line",
  });
  gsap.fromTo(
    landingHeading.chars,
    { opacity: 0, y: 80, filter: "blur(5px)" },
    {
      opacity: 1,
      duration: 1.2,
      filter: "blur(0px)",
      ease: "power3.inOut",
      y: 0,
      stagger: 0.025,
      delay: 0.3,
    }
  );

  // Animate static subtitle rows (AI Engineer / Full Stack Developer)
  const TextProps = { type: "chars,lines", linesClass: "split-h2" };
  const landingTitle = new TextSplitter(".landing-h2-1", TextProps);
  const landingSub = new TextSplitter(".landing-h2-info", TextProps);

  gsap.fromTo(
    [...landingTitle.chars, ...landingSub.chars],
    { opacity: 0, y: 80, filter: "blur(5px)" },
    {
      opacity: 1,
      duration: 1.2,
      filter: "blur(0px)",
      ease: "power3.inOut",
      y: 0,
      stagger: 0.025,
      delay: 0.4,
    }
  );

  gsap.fromTo(
    ".landing-info-h2",
    { opacity: 0, y: 30 },
    { opacity: 1, duration: 1.2, ease: "power1.inOut", y: 0, delay: 0.8 }
  );

  // Fade in navbar + social icons
  gsap.fromTo(
    [".header", ".icons-section", ".nav-fade"],
    { opacity: 0 },
    { opacity: 1, duration: 1.2, ease: "power1.inOut", delay: 0.1 }
  );
}
