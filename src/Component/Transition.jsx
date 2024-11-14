import React, { useCallback, useRef, useState } from "react";
import { SwitchTransition, Transition } from "react-transition-group";
import { useLocation } from "react-router-dom";
import gsap from "gsap";
import { useSoundEffects } from "./SoundEffects";

const Transitioner = ({ children, isMenuOpen }) => {
  const location = useLocation();
  const { fadeOutSound, fadeInSound } = useSoundEffects();
  const header = document.getElementById("header");

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

  const handleEnterTransition = () => {
    fadeInSound();
    if (header) {
      setTimeout(() => {
        header.style.pointerEvents = "auto";
      }, 1000);
    }
  };

  const handleExitTransition = () => {
    fadeOutSound();
    if (header) header.style.pointerEvents = "none";
  };

  return (
    <SwitchTransition>
      <Transition
        key={location.pathname}
        timeout={1000}
        onEnter={node => {
          const overlay = document.getElementById("overlay");

          animateOverlayEnter(overlay, "inset(0 0 0 0)");

          handleEnterTransition();
        }}
        onExit={node => {
          const overlay = document.getElementById("overlay");

          animateOverlayExit(overlay, "inset(0 0 0% 0)");

          handleExitTransition();
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
