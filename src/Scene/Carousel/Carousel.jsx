// import { useEffect, useRef, useState, useMemo } from "react";
// import { useFrame, useThree } from "@react-three/fiber";
// import { usePrevious } from "react-use";
// import gsap from "gsap";
// import PostProcessing from "./PostProcessing";
// import CarouselItem from "./CarouselItem";
// import Carousel from "react-multi-carousel";
// // import { lerp, getPiramidalIndex } from '../utils'
// import images from "./data/images";
// import { projectData } from "../../Component/ProjectData";

/*------------------------------
Plane Settings
------------------------------*/
// const planeSettings = {
//   width: 5.5,
//   height: 3,
//   gap: 10,
// };

/*------------------------------
Gsap Defaults
------------------------------*/
// gsap.defaults({
//   duration: 2.5,
//   ease: "power3.out",
// });

// /*------------------------------
// Lerp
// ------------------------------*/
// export const lerp = (v0, v1, t) => v0 * (1 - t) + v1 * t;

/*--------------------
Get Piramidal Index
--------------------*/
// Returns an array of decreasing index values in a pyramid shape, starting from the specified index with the highest value. These indices are often used to create overlapping effects among elements.
// export const getPiramidalIndex = (array, index) =>
//   array.map((_, i) =>
//     index === i ? array.length : array.length - Math.abs(index - i)
//   )

/*------------------------------
Carousel
------------------------------*/
// const CarouselWrap = () => {
//   //   const [$root, setRoot] = useState();
//   //   const $post = useRef();

//   //   const [activePlane, setActivePlane] = useState(null);
//   //   const prevActivePlane = usePrevious(activePlane);
//   //   const { viewport } = useThree();

//   //   /*--------------------
//   //   Vars
//   //   --------------------*/
//   //   const progress = useRef(0);
//   //   const startX = useRef(0);
//   //   const isDown = useRef(false);
//   //   const speedWheel = 0.01;
//   //   const speedDrag = -0.01;
//   //   const oldProgress = useRef(0);
//   //   const speed = useRef(0);
//   //   const $items = useMemo(() => {
//   //     if ($root) return $root.children;
//   //   }, [$root]);

//   // /*--------------------
//   //   Initial Position Setup
//   //   --------------------*/
//   //   useEffect(() => {
//   //     if ($items && $items.length > 0) {
//   //       const initialActive = Math.floor(progress.current / 100 * ($items.length - 1))
//   //       $items.forEach((item, index) => displayItems(item, index, initialActive))
//   //     }
//   //   }, [$items])

//   //   /*--------------------
//   //     Display Items (Start from Correct Position)
//   //     --------------------*/
//   //   const displayItems = (item, index, active) => {
//   //     const xPosition = (index - active) * (planeSettings.width + planeSettings.gap)

//   //     // Directly set the initial position, instead of animating from (0, 0, 0)
//   //     item.position.set(xPosition, 0, 0)

//   //     // If you still want animation on position change, use gsap to animate this if needed
//   //     gsap.to(item.position, {
//   //       x: xPosition,
//   //       // y: other adjustments (if needed)
//   //       duration: 5.5, // Adjust duration as needed
//   //       // overwrite: true // Avoid overlapping animations
//   //     })
//   //   }

//   //   /*--------------------
//   //   useFrame (Fixed for One Slide Move)
//   //   --------------------*/
//   // useFrame(() => {
//   //   const itemIndex = Math.round((progress.current / 100) * ($items.length - 1))

//   //   // Ensure progress is snapped to discrete item positions
//   //   progress.current = (itemIndex / ($items.length - 1)) * 100

//   //   // Update positions for all items
//   //   $items.forEach((item, index) => displayItems(item, index, itemIndex))

//   //   // Speed updates for smoothness (if needed for visual effects)
//   //   speed.current = lerp(
//   //     speed.current,
//   //     Math.abs(oldProgress.current - progress.current),
//   //     0.1
//   //   )

//   //   oldProgress.current = lerp(oldProgress.current, progress.current, 0.1)

//   //   if ($post.current) {
//   //     $post.current.thickness = speed.current
//   //   }
//   // })

//   //   // /*--------------------
//   //   // Handle Wheel
//   //   // --------------------*/
//   //   // const handleWheel = (e) => {
//   //   //   if (activePlane !== null) return
//   //   //   const isVerticalScroll = Math.abs(e.deltaY) > Math.abs(e.deltaX)
//   //   //   const wheelProgress = isVerticalScroll ? e.deltaY : e.deltaX
//   //   //   progress.current = progress.current + wheelProgress * speedWheel
//   //   // }

//   //   /*--------------------
//   //   Handle Wheel (Single Item Move)
//   //   --------------------*/
//   //   const handleWheel = e => {
//   //     if (activePlane !== null) return;
//   //     if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
//   //       // Vertical wheel scroll
//   //       if (e.deltaY > 0) {
//   //         progress.current = Math.min(progress.current + 100 / ($items.length - 1), 100)
//   //       } else {
//   //         progress.current = Math.max(progress.current - 100 / ($items.length - 1), 0)
//   //       }
//   //     }
//   //   };

//   //   /*--------------------
//   //   Handle Down
//   //   --------------------*/
//   //   const handleDown = e => {
//   //     if (activePlane !== null) return;
//   //     isDown.current = true;
//   //     startX.current = e.clientX || (e.touches && e.touches[0].clientX) || 0;
//   //   };

//   //   /*--------------------
//   //   Handle Up
//   //   --------------------*/
//   //   const handleUp = () => {
//   //     isDown.current = false;
//   //   };

//   //   // /*--------------------
//   //   // Handle Move
//   //   // --------------------*/
//   //   // const handleMove = (e) => {
//   //   //   if (activePlane !== null || !isDown.current) return
//   //   //   const x = e.clientX || (e.touches && e.touches[0].clientX) || 0
//   //   //   const mouseProgress = (x - startX.current) * speedDrag
//   //   //   progress.current = progress.current + mouseProgress
//   //   //   startX.current = x
//   //   // }
//   //   /*--------------------
//   //   Handle Move (Tuned for Single Item)
//   //   --------------------*/
//   //   const handleMove = e => {
//   //     if (activePlane !== null || !isDown.current) return;
//   //     const x = e.clientX || (e.touches && e.touches[0].clientX) || 0;
//   //     const delta = x - startX.current;
//   //     const threshold = viewport.width / 4; // Threshold for registering a swipe

//   //     if (Math.abs(delta) > threshold) {
//   //       if (delta > 0) {
//   //         progress.current = Math.max(progress.current - 100 / ($items.length - 1), 0);
//   //       } else {
//   //         progress.current = Math.min(progress.current + 100 / ($items.length - 1), 100);
//   //       }
//   //       startX.current = x; // Reset start point after each full swipe
//   //     }
//   //   };

//   //   /*--------------------
//   //   Mobile Touch Support (Swipe Gesture)
//   //   --------------------*/
//   //   const handleTouchStart = e => {
//   //     if (activePlane !== null) return;
//   //     isDown.current = true;
//   //     startX.current = e.touches[0].clientX;
//   //   };

//   //   const handleTouchMove = e => {
//   //     if (activePlane !== null || !isDown.current) return;
//   //     const x = e.touches[0].clientX;
//   //     const delta = x - startX.current;
//   //     const threshold = viewport.width / 4; // Adjust based on swipe sensitivity

//   //     if (Math.abs(delta) > threshold) {
//   //       if (delta > 0) {
//   //         progress.current = Math.max(progress.current - 100 / ($items.length - 1), 0);
//   //       } else {
//   //         progress.current = Math.min(progress.current + 100 / ($items.length - 1), 100);
//   //       }
//   //       startX.current = x; // Reset start point
//   //     }
//   //   };

//   //   const handleTouchEnd = () => {
//   //     isDown.current = false;
//   //   };

//   //   /*--------------------
//   //   Click
//   //   --------------------*/
//   //   useEffect(() => {
//   //     if (!$items) return;
//   //     if (activePlane !== null && prevActivePlane === null) {
//   //       progress.current = (activePlane / ($items.length - 1)) * 100; // Calculate the progress.current based on activePlane
//   //     }
//   //   }, [activePlane, $items]);

//   const [$root, setRoot] = useState(null); // Track the root container
//   const $post = useRef();
//   const { viewport } = useThree();

//   const [activeSlide, setActiveSlide] = useState(0); // Track the active slide
//   const slideCount = useRef(0); // Store the total number of slides
//   const startX = useRef(0); // Track the initial drag position
//   const isDragging = useRef(false); // Check if the user is dragging

//   // Make sure $items are populated correctly
//   const $items = useMemo(() => {
//     if ($root) {
//       return Array.from($root.children);
//     }
//     return [];
//   }, [$root]);
  
//   /*--------------------
//     Initialize Items
//   --------------------*/
//   useEffect(() => {
//     if ($items.length > 0) {
//       slideCount.current = $items.length;
//       positionSlides(activeSlide); // Set initial positions for the slides
//     }
//   }, [$items]);

//   /*--------------------
//     Position Slides Correctly from the Start
//   --------------------*/
//   const positionSlides = (active) => {
//     $items.forEach((item, index) => {
//       const xPosition = (index - active) * (planeSettings.width + planeSettings.gap);
//       item.position.set(xPosition, 0, 0); // Directly set the position on the 3D mesh
//     });
//   };

//   /*--------------------
//     Handle Wheel Event
//   --------------------*/
//   const handleWheel = (e) => {
//     if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
//       if (e.deltaY > 0) {
//         nextSlide(); // Scroll forward
//       } else {
//         prevSlide(); // Scroll backward
//       }
//     } else {
//       if (e.deltaX > 0) {
//         nextSlide(); // Swipe right
//       } else {
//         prevSlide(); // Swipe left
//       }
//     }
//   };

//   /*--------------------
//     Handle Drag (Mouse/Touch)
//   --------------------*/
//   const handlePointerDown = (e) => {
//     isDragging.current = true;
//     startX.current = e.clientX || (e.touches && e.touches[0].clientX) || 0;
//   };

//   const handlePointerMove = (e) => {
//     if (!isDragging.current) return;
//     const x = e.clientX || (e.touches && e.touches[0].clientX) || 0;
//     const deltaX = x - startX.current;
    
//     if (Math.abs(deltaX) > 50) { // Sensitivity threshold
//       if (deltaX < 0) nextSlide();
//       else prevSlide();
      
//       startX.current = x; // Reset startX after moving one slide
//     }
//   };

//   const handlePointerUp = () => {
//     isDragging.current = false;
//   };

//   /*--------------------
//     Slide Transitions
//   --------------------*/
//   const nextSlide = () => {
//     setActiveSlide((prev) => Math.min(prev + 1, slideCount.current - 1)); // Clamp to max
//   };

//   const prevSlide = () => {
//     setActiveSlide((prev) => Math.max(prev - 1, 0)); // Clamp to min
//   };

//   /*--------------------
//     Watch Active Slide Change
//   --------------------*/
//   useEffect(() => {
//     if ($items.length > 0) {
//       // Set the correct target x position based on activeSlide
//       $items.forEach((item, index) => {
//         const targetX = (index - activeSlide) * (planeSettings.width + planeSettings.gap);

//         // Move each item to its respective position without accumulating previous x position
//         gsap.to(item.position, {
//           x: targetX,  // Set directly based on target
//           duration: 0.5,
//           onComplete: () => console.log('Slide animation complete'),
//         });
//       });
//     }
//   }, [activeSlide, $items]);

//   /*--------------------
//   Render Plane Events
//   --------------------*/
//   const renderPlaneEvents = () => {
//     return (
//       <mesh
//         position={[0, 0, -0.01]}
//         onWheel={handleWheel}
//         onPointerDown={handlePointerDown}
//         onPointerMove={handlePointerMove}
//         onPointerUp={handlePointerUp}
//         onPointerLeave={handlePointerUp}
//         onPointerCancel={handlePointerUp}
//         visible={false}
//       >
//         <planeGeometry args={[viewport.width, viewport.height]} />
//         <meshBasicMaterial transparent={true} opacity={0} />
//       </mesh>
//     );
//   };

//   /*--------------------
//   Render Slider
//   --------------------*/
//   const renderSlider = () => {
//     return (
//       <group ref={setRoot}>
//         {projectData.map((item, i) => (
//           <CarouselItem
//             width={planeSettings.width}
//             height={planeSettings.height}
//             setActivePlane={setActiveSlide}
//             activePlane={activeSlide}
//             key={item.image}
//             item={item}
//             index={i}
//           />
//         ))}
       
//       </group>
//     );
//   };

//   return (
//     <group>
//       {renderPlaneEvents()}
//       {renderSlider()}
     
//       {/* <PostProcessing ref={$post} /> */}
//     </group>
//   );
// };

import { useRef, useState, useEffect, useMemo } from "react";
import { useFrame, useThree, extend } from "@react-three/fiber";
// import { ImageFadeMaterial } from "./ImageFadeMaterial"; // Assuming you have this as a separate shaderMaterial file
import { shaderMaterial, useTexture } from "@react-three/drei";
import gsap from "gsap";
import * as THREE from "three";
import { projectData } from "../../Component/ProjectData";

export const ImageFadeMaterial = shaderMaterial(
  {
    effectFactor: 0.5,
    dispFactor: 0,
    tex: undefined,
    tex2: undefined,
    disp: undefined
  },
  ` varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }`,
  ` varying vec2 vUv;
    uniform sampler2D tex;
    uniform sampler2D tex2;
    uniform sampler2D disp;
    uniform float _rot;
    uniform float dispFactor;
    uniform float effectFactor;
    void main() {
      vec2 uv = vUv;
      vec4 disp = texture2D(disp, uv);
      vec2 distortedPosition = vec2(uv.x + dispFactor * (disp.r*effectFactor), uv.y);
      vec2 distortedPosition2 = vec2(uv.x - (1.0 - dispFactor) * (disp.r*effectFactor), uv.y);
      vec4 _texture = texture2D(tex, distortedPosition);
      vec4 _texture2 = texture2D(tex2, distortedPosition2);
      vec4 finalTexture = mix(_texture, _texture2, dispFactor);
      gl_FragColor = finalTexture;
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }`
)

extend({ ImageFadeMaterial })

const planeSettings = {
  width: 5.5,
  height: 3,
  gap: 10,
};

const CarouselWrap = () => {
  const [activeSlide, setActiveSlide] = useState(0); // Track active slide
  const { viewport } = useThree();
  
  const planeRef = useRef();
  const textures = useTexture(projectData.map((item) => item.image)); // Load all textures from project data
  const dispTexture = useTexture("/Texture/10.jpg"); // Your displacement map
  
  const handleNext = () => {
    setActiveSlide((prev) => (prev + 1) % projectData.length);
  };
  
  const handlePrev = () => {
    setActiveSlide((prev) => (prev - 1 + projectData.length) % projectData.length);
  };

  useEffect(() => {
    const handleWheel = (e) => {
      if (e.deltaY > 0) handleNext();
      else handlePrev();
    };

    window.addEventListener("wheel", handleWheel);
    return () => window.removeEventListener("wheel", handleWheel);
  }, []);

  useFrame(() => {
    if (planeRef.current) {
      // Lerp the transition factor for smooth fade
      planeRef.current.material.uniforms.dispFactor.value = THREE.MathUtils.lerp(
        planeRef.current.material.uniforms.dispFactor.value,
        1, // Target value for fade effect
        0.075 // Smooth transition speed
      );
    }
  });

  return (
    <mesh ref={planeRef} position={[0, 0, 0]}>
      <planeGeometry args={[planeSettings.width, planeSettings.height]} />
      <imageFadeMaterial
        tex={textures[activeSlide]}
        tex2={textures[(activeSlide + 1) % projectData.length]}
        disp={dispTexture}
        toneMapped={false}
        dispFactor={0.5}
      />
    </mesh>
  );
};


export default CarouselWrap;
