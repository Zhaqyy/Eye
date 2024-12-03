import React, { useEffect, useRef } from "react";
import "../../Style/Component.css";
import gsap from "gsap";

const Intro = ({ timeline, onComplete }) => {
  const loaderRef = useRef(null);
  const glowRef = useRef(null);
  const progressNumberRef = useRef(null);

  useEffect(() => {
    if (timeline) {
      timeline.add(
        progressAnimation(
          // progressRef,
          loaderRef,
          glowRef,
          progressNumberRef,
          onComplete
        ),
        0
      );
    }
  }, [timeline, onComplete]);
  return (
    <div className={"loaderWrapper"} ref={loaderRef}>
      <div className={"loaderProgressWrapper"}>
        <span className={"loaderProgressNumber"} ref={progressNumberRef}>
          0%
        </span>
        <span className={"loaderGlow"} ref={glowRef}></span>
      </div>
    </div>
  );
};

export default Intro;

export const progressAnimation = (
  loaderRef,
  glowRef,
  progressNumberRef,
  onComplete
) => {
  const tl = gsap.timeline();


  gsap.set([progressNumberRef.current, glowRef.current, loaderRef.current], {
    display: 'block'
   });

  tl.fromTo(
    progressNumberRef.current,
    {
      autoAlpha: 0,
      skewY: 5,
      filter: "blur(3px)",
    },
    {
      autoAlpha: 1,
      skewY: 0,
      filter: "blur(0px)",
      duration: 1.5,
      ease: "expo.out",
    },
    "<"
  );
  tl.to(
    progressNumberRef.current,
    {
      textContent: "100%",
      duration: 3,
      roundProps: "textContent",
      ease: "expo.out",
    },
    ">"
  );
  tl.fromTo(
    progressNumberRef.current,
    {
      // autoAlpha: 1,
      filter: "blur(0px)",
      clipPath: "polygon(0% 0%,100% 0%,100% 50%,0% 50%,0% 50%,100% 50%,100% 100%,0% 100%)",
    },
    {
      // autoAlpha: 0,
      filter: "blur(3px)",
      clipPath: "polygon(0% 50%,100% 50%,100% 50%,0% 50%,0% 50%,100% 50%,100% 50%,0% 50%)",
      duration: 1,
      ease: "expo.out",
      onComplete: () => {
        gsap.set(progressNumberRef.current, {
         display: 'none'
        });
      },
    },
    ">"
  )

    .fromTo(
      glowRef.current,
      {
        // boxShadow: "0px 0px 0px 0px black",
        autoAlpha: 0,
        scaleX:0,
      },
      {
        autoAlpha: 1,
        // boxShadow: "0px 0px 100px 1px black",
        scaleX:1,
        duration: 0.5,
        ease: "expo.out",
      },
      "-=0.25"
    )

    // .fromTo(
    //   glowRef.current,
    //   {
    //     autoAlpha: 1,
    //   },
    //   {
    //     autoAlpha: 0,
    //     duration: 0.5,
    //     ease: "sine.in",
    //   },
    //   ">"
    // )

    .call(onComplete, null, "-=0.25")

    .to(
      loaderRef.current,
      {
        // clipPath: 'polygon(0% 0%,0% 0%,0% 100%,100% 100%,100% 0%,100% 0%,100% 100%,0% 100%)',
        clipPath: "polygon(0% 0%,100% 0%,100% 0%,0% 0%,0% 100%,100% 100%,100% 100%,0% 100%)",
        duration: 1,
        ease: "expo.in",
        onComplete: () => {
          gsap.set(loaderRef.current, {
           display: 'none'
          });
          gsap.set(glowRef.current, {
            display: 'none'
           });
        },
      },
      "+=0.5"
    );

  return tl;
};
