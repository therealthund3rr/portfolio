import "./styles/Career.css";
import { config } from "../config";

const Career = () => {
  return (
    <div className="career-section" id="career">
      <div className="career-container">
        <h2 className="career-heading">
          Career <span className="career-amp">&</span>
          <br />
          Experiences
        </h2>
        <div className="career-timeline-wrap">
          <div className="career-timeline">
            <div className="career-dot" />
          </div>
          <div className="career-items">
            {config.career.map((entry, i) => (
              <div key={i} className={`career-item career-type-${entry.type}`}>
                <div className="career-item-header">
                  <div className="career-item-info">
                    <h4 className="career-title">{entry.title}</h4>
                    <h5 className="career-company">{entry.company}</h5>
                  </div>
                  <span className="career-period">{entry.period === "Now" ? "NOW" : entry.period}</span>
                </div>
                {"desc" in entry && entry.desc && (
                  <p className="career-desc">{entry.desc}</p>
                )}
                <div className="career-bar-track">
                  <div className="career-bar-fill" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
