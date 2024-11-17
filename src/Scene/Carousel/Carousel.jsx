import { useEffect, useRef, useState, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
// import gsap from "gsap";
import { useNavigate } from "react-router-dom";
import PostProcessing from "./PostProcessing";
import { projectData } from "../../Component/ProjectData";
import Plane from "./Plane";

/*------------------------------
Plane Settings
------------------------------*/
const planeSettings = {
  width: 5.5,
  height: 3,
};

/*------------------------------
Lerp
------------------------------*/
export const lerp = (v0, v1, t) => v0 * (1 - t) + v1 * t;

/*------------------------------
Sound
------------------------------*/
const slideSound = new Howl({
  src: ["/Sounds/swing2.mp3"],
  volume: 0.005,
  rate: 2.5,
});
const clickSound = new Howl({
  src: ["/Sounds/swing.mp3"],
  volume: 0.0025,
  rate: 4.5,
});

/*------------------------------
Carousel
------------------------------*/
const Carousel = ({ activeIndex, setActiveIndex }) => {
  //   const [activeIndex, setActiveIndex] = useState(0); // Active image index
  const [isTransitioning, setIsTransitioning] = useState(false); // Prevent multiple transitions
  const slideCount = useMemo(() => projectData.length, []); // Number of slides
  const { viewport } = useThree();
  const isDragging = useRef(false); // Track if dragging
  const startX = useRef(0); // Track drag start position
  // Add a delay between transitions (e.g., 0.5s after the transition)
  const delayBetweenTransitions = 750;

  /*--------------------
  Handle click navigation
  --------------------*/
  const navigate = useNavigate();

  const handleNavigation = () => {
    clickSound.play();
    navigate(`/Work/${projectData[activeIndex].id}`);
  };

  /*--------------------
    Handle Wheel Event
  --------------------*/
  const handleWheel = e => {
    if (isTransitioning) return;
    if (e.deltaY > 0) {
      nextSlide(); // Scroll forward
    } else {
      prevSlide(); // Scroll backward
    }
  };

  /*--------------------
    Handle Drag (Mouse/Touch)
  --------------------*/
  const handlePointerDown = e => {
    isDragging.current = true;
    startX.current = e.clientX || (e.touches && e.touches[0].clientX) || 0;
  };

  const handlePointerMove = e => {
    if (!isDragging.current || isTransitioning) return;
    const x = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const deltaX = x - startX.current;

    if (Math.abs(deltaX) > 50) {
      if (deltaX < 0) nextSlide();
      else prevSlide();

      startX.current = x; // Reset startX after moving one slide
    }
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  /*--------------------
    Slide Transitions
  --------------------*/
  const nextSlide = () => {
    if (isTransitioning) return; // Prevent slide changes while transitioning
    setIsTransitioning(true); // Lock transitions

    slideSound.play();

    setActiveIndex(prev => (prev + 1) % slideCount); // Move to the next slide

    // Unlock transitions after a delay
    setTimeout(() => {
      setIsTransitioning(false);
    }, delayBetweenTransitions); // Transition lock period
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    slideSound.play();

    setActiveIndex(prev => (prev - 1 + slideCount) % slideCount); // Move to the previous slide

    setTimeout(() => {
      setIsTransitioning(false);
    }, delayBetweenTransitions);
  };

  /*--------------------
  Render Plane Events
  --------------------*/
  const renderPlaneEvents = () => {
    return (
      <mesh
        position={[0, 0, -0.01]}
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onPointerCancel={handlePointerUp}
        visible={false}
      >
        <planeGeometry args={[viewport.width, viewport.height]} />
        <meshBasicMaterial transparent={true} opacity={0} />
      </mesh>
    );
  };

  /*--------------------
  Render Slider
  --------------------*/
  const renderSlider = () => {
    return (
      <group>
        <Plane
          texture={projectData[activeIndex].image} // Pass active texture
          width={planeSettings.width}
          height={planeSettings.height}
          onClick={handleNavigation} // Handle plane click
        />
      </group>
    );
  };

  return (
    <group>
      {renderPlaneEvents()}
      {renderSlider()}

      {/* <PostProcessing ref={$post} /> */}
    </group>
  );
};

export default Carousel;
