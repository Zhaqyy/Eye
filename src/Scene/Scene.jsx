import { Cloud, Clouds, Environment, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import React, { Suspense, useEffect, useRef, useState } from "react";

import { Perf } from "r3f-perf";
import Carousel from "./Carousel/Carousel";

import Pillars from "./BgScene/Pillars";
import Grass from "./BgScene/Floor";
import VolLight from "./Helper/VolumetricLight";
import gsap from "gsap";

const Scene = ({ activeIndex, setActiveIndex }) => {
  const carouselRef = useRef();
  const [showCarousel, setShowCarousel] = useState(false);
 
  return (
    <div id='gl'>
      <Canvas camera={{ fov: 70, position: [0, 0, 5], far: 15 }} resize={{ debounce: 0 }} shadows={false}>
        {/* Scene & Utils */}
        {/* <Perf position='top-left' minimal={true} /> */}
        <color attach='background' args={["#050505"]} />
        <fog attach='fog' args={["#050505", 5, 10]} />

        {/* <OrbitControls /> */}
        {/* <Environment preset='night' environmentIntensity={1.5} /> */}

        {/* <Suspense fallback={null}> */}

        {/* Lights */}
        <LightHandler onTimelineComplete={() => setShowCarousel(true)} />

        <Clouds>
          <Cloud
            concentrate='inside'
            // seed={1}
            segments={1}
            color={"#6f95a2"}
            // color={"#ac8964"}
            bounds={5}
            volume={11}
            growth={1}
            opacity={1}
            position={[0, 0, 2]}
            speed={0.1}
          />
        </Clouds>

        {/* Main Scene */}
        <group ref={carouselRef} position={[0, 0, -1]}>
          <Pillars />
          {/* <CarouselMeshHandler carouselRef={carouselRef} /> */}
          {showCarousel && (
            <Carousel
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
              name="carousel" // Add a name for identification
            />
          )}
        </group>

        <Grass />
        {/* </Suspense> */}
      </Canvas>
    </div>
  );
};
export default Scene;


export const LightHandler = React.memo(({ onTimelineComplete }) => {
  const ambientLightRef = useRef();
  const pointLightRef = useRef();
  const volLightRef = useRef();
  const hasPlayed = useRef(false); // Ref to track if the animation has already run

  useEffect(() => {
    if (hasPlayed.current) return; // Skip if the animation has already run
    hasPlayed.current = true; // Mark as played

    if (ambientLightRef.current && pointLightRef.current) {
      const tl = gsap.timeline({});

      // Traverse the group to find the child (VolLight)
      const volLightChild = volLightRef.current.children[0]; // Assuming only one child
      if (volLightChild && volLightChild.material) {
        const { material } = volLightChild;
        if (material.uniforms.color) material.uniforms.glowColor.value.set("#000000");

        // Animate ambient light intensity
        tl.to(ambientLightRef.current, { intensity: 0.5, duration: 5, ease: "expo.in" });

        // Animate point light intensity
        tl.to(
          pointLightRef.current,
          {
            intensity: 10,
            duration: 2,
            ease: "expo.in",
            onComplete: () => {
              if (onTimelineComplete) {
                onTimelineComplete(); // Notify parent when animation is complete
              }
            },
          },
          "-=4"
        );

        tl.fromTo(
          material.uniforms.glowColor.value,
          {
            r: 0.0,
            g: 0.0,
            b: 0.0,
          },
          {
            r: 0.435, // Target color's RGB values (e.g., #6f95a2)
            g: 0.584,
            b: 0.635,
            duration: 1.5,
            ease: "expo.out",
          },
          "+=0.5"
        );
      }
    }
  }, [onTimelineComplete]); // Only runs once after mounting

  return (
    <>
      <ambientLight ref={ambientLightRef} intensity={0} />
      <pointLight ref={pointLightRef} position={[0, 5, 0]} color='white' intensity={0} />
      <group ref={volLightRef}>
        <VolLight position={[0, 7, -1.5]} rotation={[Math.PI / 15, 0, Math.PI]} color='#000000' opacity={0.6} length={15} />
      </group>
    </>
  );
});

