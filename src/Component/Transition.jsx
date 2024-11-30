import React, { useCallback, useEffect, useRef, useState } from "react";
import { SwitchTransition, Transition } from "react-transition-group";
import { useLocation, useNavigate } from "react-router-dom";
import gsap from "gsap";
import { useSoundEffects } from "./SoundEffects";

const Transitioner = ({ children, delayNavigation = false }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { fadeOutSound, fadeInSound } = useSoundEffects();
  const header = document.getElementById("header");
  const overlayRef = useRef(null);
  const [isNavigating, setIsNavigating] = useState(false); // Prevent double navigation

  const animateOverlayEnter = overlay => {
    if (!overlay) return;
    gsap.set(overlay, { clipPath: "inset(0 0 0% 0)", opacity: 1, display: "block" });
    return gsap.to(overlay, {
      clipPath: "inset(0 0 100% 0)",
      duration: 1.0,
      ease: "expo.inOut",
      delay: 0.5,
      onComplete: () => {
        gsap.set(overlay, { opacity: 0, display: "none" });
      },
    });
  };

  const animateOverlayExit = overlay => {
    if (!overlay) return;
    gsap.set(overlay, { clipPath: "inset(0 0 100% 0)", opacity: 1, display: "block" });
    return gsap.to(overlay, {
      clipPath: "inset(0 0 0% 0)",
      duration: 0.5,
      ease: "expo.inOut",
      delay: 0.5,
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
    // if (header) header.style.pointerEvents = "none";
  };

  useEffect(() => {
    const ctx = gsap.context(() => {}, overlayRef);

    return () => ctx.revert(); // Clean up animations on unmount
  }, []);

  const isProject = location.pathname.includes("/Project/");

  return (
    <SwitchTransition>
      <Transition
        key={location.pathname}
            timeout={{
          enter: 1000,
          exit: isProject ? 0 : 1000,
         }}
        onEnter={node => {
          const overlay = overlayRef.current;

          animateOverlayEnter(overlay);

          handleEnterTransition();
        }}
        onExit={node => {
          const overlay = overlayRef.current;

          animateOverlayExit(overlay);

          handleExitTransition();
        }}
        // unmountOnExit
      >
        <>
          <div
            id='overlay'
            ref={overlayRef}
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
