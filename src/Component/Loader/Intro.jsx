import React, { useEffect, useRef } from "react";
import "../../Style/Component.css";
import gsap from "gsap";
import Logo from "../Logo";

const Intro = ({ timeline, onComplete }) => {
  const loaderRef = useRef(null);
  const glowRef = useRef(null);
  const eyeRef = useRef(null);
  const progressNumberRef = useRef(null);


  useEffect(() => {
    const context = gsap.context(() => {
      if (timeline) {
        timeline.add(progressAnimation(loaderRef, glowRef, progressNumberRef, eyeRef, onComplete), 0);
      }
    }, loaderRef);

    return () => context.revert(); // Cleanup on unmount
  }, [timeline, onComplete]);

  return (
    <div className={"loaderWrapper"} ref={loaderRef}>
      <span className={"loaderProgressNumber"} ref={progressNumberRef}>
        0%
      </span>
      <div className={"loaderText"}>
        <Logo ref={eyeRef} />
      </div>
    </div>
  );
};

export default Intro;

export const progressAnimation = (loaderRef, glowRef, progressNumberRef, eyeRef, onComplete) => {
  const tl = gsap.timeline();

  gsap.set([progressNumberRef.current, glowRef.current, loaderRef.current, eyeRef.current], {
    display: "block",
  });

  tl.set("#dot1", { y: "200%", x: "100%", transformOrigin: "center" }).set("#dot2", { y: "-200%", x: "-100%", transformOrigin: "center" });
  tl.set("#bow1", { y: "-270%", transformOrigin: "center" }).set("#bow2", { y: "270%", transformOrigin: "center" });

  tl.fromTo(
    [progressNumberRef.current, eyeRef.current],
    {
      autoAlpha: 0,
      // skewY: 5,
      filter: "blur(3px)",
    },
    {
      autoAlpha: 1,
      // skewY: 0,
      filter: "blur(0px)",
      duration: 1.5,
      ease: "expo.out",
    },
    ">"
  );
  // tl.to("#bow1", { y: "-250%", transformOrigin: "center", duration: 1, ease: "elastic.Out(.95)" }, "<").to(
  //   "#bow2",
  //   { y: "250%", transformOrigin: "center", duration: 1, ease: "elastic.Out(.95)" },
  //   "<"
  // );
  // tl.fromTo(["#dot1", "#dot2"], {scale: 0.5,}, { scale: 1, duration: 0.5, ease: "elastic.Out(.95)" }, "<");

  tl.to("#dot1", { x: "0%", duration: 3, ease: "expo.out" }, "+=0.5").to("#dot2", { x: "0%", duration: 3, ease: "expo.out" }, "<");

  tl.to(
    progressNumberRef.current,
    {
      textContent: "100%",
      duration: 3,
      roundProps: "textContent",
      ease: "expo.out",
    },
    "<"
  );
  tl.fromTo(
    progressNumberRef.current,
    {
      // autoAlpha: 1,
      // filter: "blur(0px)",
      clipPath: "polygon(50% 0%,0% 0%,0% 100%,50% 100%,50% 0%,100% 0%,100% 100%,50% 100%)",
    },
    {
      // autoAlpha: 0,
      // filter: "blur(3px)",
      clipPath: "polygon(50% 0%, 50% 0%, 50% 100%, 50% 100%, 50% 0%, 50% 0%, 50% 100%, 50% 100%)",
      duration: 1.5,
      ease: "expo.out",
      onComplete: () => {
        gsap.set(progressNumberRef.current, {
          display: "none",
        });
      },
    },
    ">"
  )
    .to("#dot1", { y: "-30%", duration: 1, ease: "back.inOut(.95)" }, "<")
    .to("#dot2", { y: "30%", duration: 1, ease: "back.inOut(.95)" }, "<")

    .call(onComplete, null, "-=0.25")

    .fromTo(
      loaderRef.current,
      {
        mask: "radial-gradient(0vw,#0000 100%,#000) 0 0",
      },
      {
        //horizontal
        // clipPath: "polygon(0% 0%,0% 0%,0% 100%,100% 100%,100% 0%,100% 0%,100% 100%,0% 100%)",
        //vertical
        // clipPath: "polygon(0% 0%,100% 0%,100% 0%,0% 0%,0% 100%,100% 100%,100% 100%,0% 100%)",
        mask: "radial-gradient(150vw,#0000 100%,#000) 0 0",
        duration: 1,
        ease: "sine.in",
        onComplete: () => {
          gsap.set(loaderRef.current, {
            display: "none",
          });
          gsap.set(glowRef.current, {
            display: "none",
          });
          gsap.set(eyeRef.current, {
            display: "none",
          });
        },
      },
      "+=0.5"
    );

  return tl;
};
