import React, { useState, useLayoutEffect } from "react";
import gsap from "gsap";
import Intro from "./Intro";

const Loader = ({ onComplete }) => {
  const [timeline, setTimeline] = useState(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          onComplete(); // Notify parent when the loader finishes
        },
      });
      setTimeline(tl);
    });

    return () => ctx.revert(); // Cleanup
  }, [onComplete]);

  return <Intro timeline={timeline} />;
};


export default Loader;
