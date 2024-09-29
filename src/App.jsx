import React, { useEffect, useRef, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { ReactLenis, useLenis } from "lenis/react";
// import './Style/main.css'
// import 'lenis/dist/lenis.css'

import Home from "./Pages/Home";
import Scene from "./Scene/Scene";
import Work from "./Pages/Work";
import gsap from "gsap";
import Griddy from "./Scene/Grid";

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
            syncTouch: true 
          }}
      >
        <Routes>
          <Route index exact path='/' element={<Main />} />
          {/* <Route path='/Work/:id' element={<Work />} /> */}
        </Routes>
      </ReactLenis>
    </>
  );
};

export default App;

const Main = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <>
    <Griddy/>
      {/* <Scene activeIndex={activeIndex} setActiveIndex={setActiveIndex} /> */}
      {/* <Home activeIndex={activeIndex} setActiveIndex={setActiveIndex} /> */}
    </>
  );
};
