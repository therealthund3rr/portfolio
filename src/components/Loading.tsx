import { useEffect, useState } from "react";
import "./styles/Loading.css";
import { useLoading } from "../context/LoadingProvider";
import Marquee from "react-fast-marquee";

let _interval: ReturnType<typeof setInterval>;

export const setProgress = (setLoading: (value: number) => void) => {
  let percent = 0;

  // Phase 1: 0→62, random increments, ~1.5s
  _interval = setInterval(() => {
    if (percent < 62) {
      percent = Math.min(percent + Math.ceil(Math.random() * 4), 62);
      setLoading(percent);
    } else {
      clearInterval(_interval);
      // Phase 2: 62→88, slow drip, ~2s
      _interval = setInterval(() => {
        if (percent < 88) {
          percent += Math.round(Math.random() * 1.4);
          percent = Math.min(percent, 88);
          setLoading(percent);
        } else {
          clearInterval(_interval);
        }
      }, 180);
    }
  }, 55);

  function loaded() {
    return new Promise<number>((resolve) => {
      clearInterval(_interval);
      _interval = setInterval(() => {
        if (percent < 100) {
          percent++;
          setLoading(percent);
        } else {
          resolve(percent);
          clearInterval(_interval);
        }
      }, 15);
    });
  }

  function clear() {
    clearInterval(_interval);
  }

  return { loaded, percent, clear };
};

const Loading = ({ percent }: { percent: number }) => {
  const { setIsLoading } = useLoading();
  const [loaded, setLoaded] = useState(false);
  const [expanding, setExpanding] = useState(false);

  useEffect(() => {
    if (percent >= 100) {
      setTimeout(() => {
        setLoaded(true);
        setTimeout(() => {
          setExpanding(true);
          import("./utils/initialFX").then((module) => {
            setTimeout(() => {
              if (module.initialFX) module.initialFX();
              setIsLoading(false);
            }, 900);
          });
        }, 600);
      }, 400);
    }
  }, [percent]);

  return (
    <>
      <div className="loading-header">
        <span className="loader-name">NC</span>
        <span className="loader-location">Turin, IT</span>
      </div>
      <div className="loading-screen">
        <div className="loading-marquee">
          <Marquee speed={55} gradient={false} autoFill>
            <span className="loading-marquee-text">
              &nbsp;&nbsp; AI Engineer &nbsp;·&nbsp; Full Stack Developer &nbsp;·&nbsp; Design Engineer &nbsp;·&nbsp; Turin, Italy &nbsp;·&nbsp; Claude Code &nbsp;·&nbsp; React Native &nbsp;·&nbsp; Three.js &nbsp;·&nbsp; GSAP &nbsp;·&nbsp;
            </span>
          </Marquee>
        </div>
        <div className={`loading-wrap ${expanding ? "loading-expand" : ""}`}>
          <div className={`loading-bar-outer ${loaded ? "loading-complete" : ""}`}>
            <div className="loading-percent-text">
              {percent < 100 ? `${percent}%` : "Welcome"}
            </div>
            <div className="loading-bar-track">
              <div className="loading-bar-fill" style={{ width: `${percent}%` }} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Loading;
