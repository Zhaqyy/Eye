import React, { useEffect, useRef } from "react";
import "../../Style/Component.css";
import gsap from "gsap";
import Logo from "../Logo";
import useIsMobile from "../isMobile";
import bowser from "bowser";

const Intro = ({ timeline, onComplete }) => {
  const loaderRef = useRef(null);
  const eyeRef = useRef(null);
  const progressNumberRef = useRef(null);
  const isMobile = useIsMobile(800);

  // Detect Safari/iOS
  const parser = bowser.getParser(window.navigator.userAgent);
  const isSafari = parser.getBrowserName() === "Safari" || parser.getOS().name === "iOS";

  useEffect(() => {
    const context = gsap.context(() => {
      if (timeline) {
        timeline.add(progressAnimation(loaderRef, progressNumberRef, eyeRef, onComplete, isMobile, isSafari), 0);
      }
    }, loaderRef);

    return () => context.revert(); // Cleanup on unmount
  }, [timeline, onComplete, isMobile, isSafari]);

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

export const progressAnimation = (loaderRef, progressNumberRef, eyeRef, onComplete, isMobile, isSafari) => {
  const tl = gsap.timeline();

  gsap.set([progressNumberRef.current, loaderRef.current, eyeRef.current], {
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
      clipPath: isMobile
        ? "polygon(0% 0%, 100% 0%, 100% 50%, 0% 50%, 0% 50%, 100% 50%, 100% 100%, 0% 100%)"
        : "polygon(50% 0%,0% 0%,0% 100%,50% 100%,50% 0%,100% 0%,100% 100%,50% 100%)",
    },
    {
      // autoAlpha: 0,
      // filter: "blur(3px)",
      clipPath: isMobile
        ? "polygon(0% 50%,100% 50%,100% 50%,0% 50%,0% 50%,100% 50%,100% 50%,0% 50%)"
        : "polygon(50% 0%, 50% 0%, 50% 100%, 50% 100%, 50% 0%, 50% 0%, 50% 100%, 50% 100%)",
      duration: 1,
      ease: "expo.out",
      onComplete: () => {
        gsap.set(progressNumberRef.current, {
          display: "none",
        });
      },
    },
    ">"
  )
    .to("#dot1", { y: "-30%", duration: 1, ease: isMobile ? "expo.out" : "back.inOut(.95)" }, "<")
    .to("#dot2", { y: "30%", duration: 1, ease: isMobile ? "expo.out" : "back.inOut(.95)" }, "<")

    .call(onComplete, null, "-=0.25");

  // Conditional animation based on browser
  if (isSafari) {
    // Fade out animation for Safari
    tl.fromTo(
      loaderRef.current,
      { clipPath: "circle(150% at 50% 50%)" },
      { clipPath: "circle(0% at 50% 50%)", duration: 1, ease: "sine.in" },
      "+=0.5"
    );
  } else {
    //  mask animation for other browsers
    tl.fromTo(
      loaderRef.current,
      { "--Loadermask": "0vw" },
      {
        "--Loadermask": "150vw",
        "duration": 1,
        "ease": "sine.in",
      },
      "+=0.5"
    );
  }

  tl.set(
    loaderRef.current,
    {
      display: "none",
    },
    ">"
  );
  tl.set(progressNumberRef.current, {
    display: "none",
  });
  tl.set(eyeRef.current, {
    display: "none",
  });

  return tl;
};
