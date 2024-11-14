import React, { useCallback, useRef, useState } from "react";
import { SwitchTransition, Transition } from "react-transition-group";
import { useLocation } from "react-router-dom";
import gsap from "gsap";
import { useSoundEffects } from "./SoundEffects";

const Transitioner = ({ children, isMenuOpen }) => {
  const location = useLocation();
  const {
    fadeOutSound,
    fadeInSound,
  } = useSoundEffects();

  const animateOverlayEnter = (overlay, clipPathEnd) => {
    // Animation to reveal the new page
    gsap.set(overlay, { clipPath: clipPathEnd, opacity: 1, display: "block" });
    return gsap.to(overlay, {
      clipPath: "inset(0 0 100% 0)",
      duration: 1.0,
      ease: "power1.Out",
      delay: 0.5,
      onComplete: () => {
        gsap.set(overlay, {
          opacity: 0,
          display: "none",
        });
      },
    });
  };

  const animateOverlayExit = (overlay, clipPathStart) => {
    // Animation to cover the current page
    gsap.set(overlay, { clipPath: "inset(0 0 100% 0)", opacity: 1, display: "block" });
    return gsap.to(overlay, {
      clipPath: clipPathStart,
      duration: 0.5,
      delay: 0.5,
      ease: "power1.Out",
    });
  };

  // const fadeOutSound = () => {
  //   if (currentAmbient.current && currentAmbient.current.playing()) {
  //     // currentAmbient.current.fade(currentAmbient.current.volume(), 0, 1000);
  //     gsap.to(currentAmbient.current, { rate: 0.6, duration: 0.5 });
  //   }
  // };

  // const fadeInSound = () => {
  //   // playAmbientSound(); 
  //   if (currentAmbient.current) {
  //     // currentAmbient.current.fade(0, location.pathname === "/" ? 0.025 : 0.015, 1000);
  //     gsap.to(currentAmbient.current, { rate: 1, duration: 0.5 });
  //   }
  // };


  return (
    <SwitchTransition>
      <Transition
        key={location.pathname}
        timeout={1000}
        onEnter={node => {
          const overlay = document.getElementById("overlay");

          animateOverlayEnter(overlay, "inset(0 0 0 0)");

          fadeInSound;
        }}
        onExit={node => {
          const overlay = document.getElementById("overlay");

          animateOverlayExit(overlay, "inset(0 0 0% 0)");

          fadeOutSound;
        }}
      >
        <>
          <div
            id='overlay'
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "black",
              display: "none",
              zIndex: 999,
              transformOrigin: "top center",
              // pointerEvents: 'none',
            }}
          />
          {children}
        </>
      </Transition>
    </SwitchTransition>
  );
};

export default Transitioner;
