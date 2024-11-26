import { Cloud, Clouds, Environment, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";

import { Perf } from "r3f-perf";
import Carousel from "./Carousel/Carousel";

import Pillars from "./BgScene/Pillars";
import Grass from "./BgScene/Floor";
import VolLight from "./Helper/VolumetricLight";
import gsap from "gsap";

const Scene = ({ activeIndex, setActiveIndex }) => {
  const [showCarousel, setShowCarousel] = useState(false); // Toggle for Carousel rendering

  return (
    <div id='gl'>
      <Canvas camera={{ fov: 70, position: [0, 0, 5], far: 15 }} resize={{ debounce: 0 }} shadows={false}>
        {/* Scene & Utils */}
        <Perf position='top-left' minimal={true} />
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
        <group position={[0, 0, -1]}>
          <Pillars />
          {showCarousel && <Carousel activeIndex={activeIndex} setActiveIndex={setActiveIndex} />}
        </group>

        <Grass />
        {/* </Suspense> */}
      </Canvas>
    </div>
  );
};
export default Scene;

export const LightHandler = ({ onTimelineComplete }) => {
  const ambientLightRef = useRef();
  const pointLightRef = useRef();


  const [volLightOpacity, setVolLightOpacity] = useState(0); // Opacity variable

  useEffect(() => {
    if (ambientLightRef.current && pointLightRef.current) {
      const tl = gsap.timeline({
        onComplete: () => {
          if (onTimelineComplete) {
            onTimelineComplete(); // Notify parent when animation is complete
          }
        },
      });

      // Animate ambient light intensity
      tl.to(ambientLightRef.current, { intensity: 1, duration: 5, ease: "expo.in" });

      // Animate point light intensity
      tl.to(pointLightRef.current, { intensity: 50, duration: 2, ease: "expo.in" }, "-=4");

      // Animating a variable for VolLight opacity
      tl.to(
        { value: 0 },
        {
          value: 0.9,
          duration: 1,
          ease: "sine.in",
          onUpdate: function () {
            setVolLightOpacity(this.targets()[0].value);
          },
        },
        "<"
      );
    }
  }, [onTimelineComplete]);

  useFrame(() => {
    // Keeps lights updated dynamically if needed
    if (ambientLightRef.current) {
      ambientLightRef.current.intensity = ambientLightRef.current.intensity;
    }
    if (pointLightRef.current) {
      pointLightRef.current.intensity = pointLightRef.current.intensity;
    }

  });
// console.log(volLightColorRef.current);
  return (
    <>
      <ambientLight ref={ambientLightRef} intensity={0} />
      <pointLight ref={pointLightRef} position={[0, 5, 0]} color='white' intensity={0} />
      <VolLight position={[0, 7, -1.5]} rotation={[Math.PI / 15, 0, Math.PI]} color='#6f95a2'  opacity={volLightOpacity} length={15} />
    </>
  );
};
// export const LightHandler = ({ onTimelineComplete }) => {
//   const ambientLightRef = useRef();
//   const pointLightRef = useRef();


//   const volLightColorRef = useRef(new THREE.Color("#000000")); // Directly use THREE.Color

//   useEffect(() => {
//     if (ambientLightRef.current && pointLightRef.current) {
//       const tl = gsap.timeline({
//         onComplete: () => {
//           if (onTimelineComplete) {
//             onTimelineComplete(); // Notify parent when animation is complete
//           }
//         },
//       });

//       // Animate ambient light intensity
//       tl.to(ambientLightRef.current, { intensity: 1, duration: 3, ease: "expo.in" });

//       // Animate point light intensity
//       tl.to(pointLightRef.current, { intensity: 50, duration: 2, ease: "expo.inOut" }, ">");

//       // Use GSAP to lerp the VolLight color directly
//       const startColor = new THREE.Color("#000000");
//       const endColor = new THREE.Color("#6f95a2");
//       tl.to(
//         { progress: 0 },
//         {
//           progress: 1,
//           duration: 2,
//           ease: "expo.inOut",
//           onUpdate: function () {
//             volLightColorRef.current.copy(startColor).lerp(endColor, this.targets()[0].progress);
//           },
//         },
//         "<"
//       );
//     }
//   }, [onTimelineComplete]);

//   useFrame(() => {
//     // Keeps lights updated dynamically if needed
//     if (ambientLightRef.current) {
//       ambientLightRef.current.intensity = ambientLightRef.current.intensity;
//     }
//     if (pointLightRef.current) {
//       pointLightRef.current.intensity = pointLightRef.current.intensity;
//     }
//     if (volLightColorRef.current) {
//       if (pointLightRef.current) pointLightRef.current.color.copy(volLightColorRef.current); // Sync point light color
//     }
//   });
// // console.log(volLightColorRef.current);
//   return (
//     <>
//       <ambientLight ref={ambientLightRef} intensity={0} />
//       <pointLight ref={pointLightRef} position={[0, 5, 0]} color='white' intensity={0} />
//       <VolLight position={[0, 7, -1.5]} rotation={[Math.PI / 15, 0, Math.PI]} color={`${volLightColorRef.current}`}  opacity={0.9} length={15} />
//     </>
//   );
// };
