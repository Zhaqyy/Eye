import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { ReactLenis } from "lenis/react";

import gsap from "gsap";

import CursorLottie from "./Component/CursorLottie";
import Router from "./Routes/Router";
import Header from "./Component/Header";
import { useSoundEffects } from './Component/SoundEffects';

const App = () => {
  const lenisRef = useRef();

  useEffect(() => {
    function update(time) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(update);
    };
  });

  const location = useLocation();

  // routes where <CursorLottie /> should not render
  const excludedRoutes = ["/"];

  return (
    <>
      <ReactLenis
        root
        ref={lenisRef}
        autoRaf={false}
        options={{
          // orientation: "horizontal",
          //  gestureOrientataion: "both",
          duration: 1.6,
          syncTouch: true,
          touchMultiplier: 0,
        }}
      >
        {/* Conditionally render CursorLottie based on the route */}
        {/* {!excludedRoutes.includes(location.pathname) && <CursorLottie />} */}
        <Header />
        <Router />
      </ReactLenis>
    </>
  );
};

export default App;
