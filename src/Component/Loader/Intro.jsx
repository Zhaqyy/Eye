import React, { useEffect, useRef } from "react";
import "../../Style/Component.css";

const Intro = ({ timeline }) => {
  const loaderRef = useRef(null);
  const progressRef = useRef(null);
  const progressNumberRef = useRef(null);

  useEffect(() => {
    if (timeline) {
      timeline
        .add(progressAnimation(progressRef, progressNumberRef), 0) // Progress bar animation
    }
  }, [timeline]);

  return (
    <div className={'loader__wrapper'}>
      <div className={'loader__progressWrapper'}>
        <div className={'loader__progress'} ref={progressRef}></div>
        <span className={'loader__progressNumber'} ref={progressNumberRef}>
          0
        </span>
      </div>
    </div>
  );
};

export default Intro;



export const progressAnimation = (progressRef, progressNumberRef) => {
};