import "./styles/About.css";
import { config } from "../config";

const About = () => {
  return (
    <div className="about-section" id="about">
      <div className="about-me about-container section-container">
        <div className="about-text">
          <p className="about-label">About Me</p>
          {config.about.description.split("\n\n").map((para, i) => (
            <p key={i} className="para about-bio">{para}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
