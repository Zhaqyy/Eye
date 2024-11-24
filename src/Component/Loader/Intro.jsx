import React, { useEffect, useRef } from "react";
import "../../Style/Component.css";
import gsap from "gsap";

const Intro = ({ timeline }) => {
  const loaderRef = useRef(null);
  const progressRef = useRef(null);
  const progressNumberRef = useRef(null);

  useEffect(() => {
    if (timeline) {
      timeline.add(progressAnimation(progressRef, progressNumberRef), 0); // Progress bar animation
    }
  }, [timeline]);

  return (
    <div className={"loaderWrapper"}>
      <div className={"loaderProgressWrapper"}>
        <div className={"loaderProgress"} ref={progressRef}></div>
        <span className={"loaderProgressNumber"} ref={progressNumberRef}>
          0
        </span>
      </div>
    </div>
  );
};

export default Intro;

export const progressAnimation = (progressRef, progressNumberRef) => {
  const tl = gsap.timeline();

  tl.to(progressRef.current, {
    scaleX: 1,
    duration: 5,
    ease: "power3.inOut",
  })
    .to(
      progressNumberRef.current,
      {
        x: "100vw",
        duration: 5,
        ease: "power3.inOut",
      },
      "<"
    )
    .to(
      progressNumberRef.current,
      {
        textContent: "100",
        duration: 5,
        roundProps: "textContent",
      },
      "<"
    )
    .to(progressNumberRef.current, {
      y: 50,
      autoAlpha: 0,
    });

  return tl;
};
