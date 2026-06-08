import { useEffect } from "react";
import Navbar from "./Navbar";
import SocialIcons from "./SocialIcons";
import Landing from "./Landing";
import About from "./About";
import WhatIDo from "./WhatIDo";
import Career from "./Career";
import Work from "./Work";
import TechStack from "./TechStack";
import HireMe from "./HireMe";
import Cursor from "./Cursor";
import setSplitText from "./utils/splitText";

const MainContainer = () => {
  useEffect(() => {
    setSplitText();
    window.addEventListener("resize", setSplitText);
    return () => window.removeEventListener("resize", setSplitText);
  }, []);

  return (
    <>
      <Cursor />
      <Navbar />
      <SocialIcons />
      <main>
        <Landing />
        <About />
        <WhatIDo />
        <Career />
        <Work />
        <TechStack />
        <HireMe />
      </main>
    </>
  );
};

export default MainContainer;
