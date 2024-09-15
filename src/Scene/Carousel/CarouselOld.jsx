import { useEffect, useRef, useState, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { usePrevious } from "react-use";
import gsap from "gsap";
import PostProcessing from "./PostProcessing";
import CarouselItem from "./CarouselItem";
// import { lerp, getPiramidalIndex } from '../utils'
import images from "./data/images";
import { projectData } from "../../Component/ProjectData";
import Plane from "./Plane";

/*------------------------------
Plane Settings
------------------------------*/
const planeSettings = {
  width: 5.5,
  height: 3,
  gap: 10,
};

/*------------------------------
Gsap Defaults
------------------------------*/
gsap.defaults({
  duration: 2.5,
  ease: "power3.out",
});

/*------------------------------
Lerp
------------------------------*/
export const lerp = (v0, v1, t) => v0 * (1 - t) + v1 * t;

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
const CarouselWrap = () => {
    const [$root, setRoot] = useState();
    const $post = useRef();

    const [activePlane, setActivePlane] = useState(null);
    const prevActivePlane = usePrevious(activePlane);
    const { viewport } = useThree();

    /*--------------------
    Vars
    --------------------*/
    const progress = useRef(0);
    const startX = useRef(0);
    const isDown = useRef(false);
    const speedWheel = 0.01;
    const speedDrag = -0.01;
    const oldProgress = useRef(0);
    const speed = useRef(0);
    const $items = useMemo(() => {
      if ($root) return $root.children;
    }, [$root]);

  /*--------------------
    Initial Position Setup
    --------------------*/
    useEffect(() => {
      if ($items && $items.length > 0) {
        const initialActive = Math.floor(progress.current / 100 * ($items.length - 1))
        $items.forEach((item, index) => displayItems(item, index, initialActive))
      }
    }, [$items])

    /*--------------------
      Display Items (Start from Correct Position)
      --------------------*/
    const displayItems = (item, index, active) => {
      const xPosition = (index - active) * (planeSettings.width + planeSettings.gap)

      // Directly set the initial position, instead of animating from (0, 0, 0)
      item.position.set(xPosition, 0, 0)

      // If you still want animation on position change, use gsap to animate this if needed
      gsap.to(item.position, {
        x: xPosition,
        // y: other adjustments (if needed)
        duration: 5.5, // Adjust duration as needed
        // overwrite: true // Avoid overlapping animations
      })
    }

    /*--------------------
    useFrame (Fixed for One Slide Move)
    --------------------*/
  useFrame(() => {
    const itemIndex = Math.round((progress.current / 100) * ($items.length - 1))

    // Ensure progress is snapped to discrete item positions
    progress.current = (itemIndex / ($items.length - 1)) * 100

    // Update positions for all items
    $items.forEach((item, index) => displayItems(item, index, itemIndex))

    // Speed updates for smoothness (if needed for visual effects)
    speed.current = lerp(
      speed.current,
      Math.abs(oldProgress.current - progress.current),
      0.1
    )

    oldProgress.current = lerp(oldProgress.current, progress.current, 0.1)

    if ($post.current) {
      $post.current.thickness = speed.current
    }
  })

    // /*--------------------
    // Handle Wheel
    // --------------------*/
    // const handleWheel = (e) => {
    //   if (activePlane !== null) return
    //   const isVerticalScroll = Math.abs(e.deltaY) > Math.abs(e.deltaX)
    //   const wheelProgress = isVerticalScroll ? e.deltaY : e.deltaX
    //   progress.current = progress.current + wheelProgress * speedWheel
    // }

    /*--------------------
    Handle Wheel (Single Item Move)
    --------------------*/
    const handleWheel = e => {
      if (activePlane !== null) return;
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        // Vertical wheel scroll
        if (e.deltaY > 0) {
          progress.current = Math.min(progress.current + 100 / ($items.length - 1), 100)
        } else {
          progress.current = Math.max(progress.current - 100 / ($items.length - 1), 0)
        }
      }
    };

    /*--------------------
    Handle Down
    --------------------*/
    const handleDown = e => {
      if (activePlane !== null) return;
      isDown.current = true;
      startX.current = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    };

    /*--------------------
    Handle Up
    --------------------*/
    const handleUp = () => {
      isDown.current = false;
    };

    // /*--------------------
    // Handle Move
    // --------------------*/
    // const handleMove = (e) => {
    //   if (activePlane !== null || !isDown.current) return
    //   const x = e.clientX || (e.touches && e.touches[0].clientX) || 0
    //   const mouseProgress = (x - startX.current) * speedDrag
    //   progress.current = progress.current + mouseProgress
    //   startX.current = x
    // }
    /*--------------------
    Handle Move (Tuned for Single Item)
    --------------------*/
    const handleMove = e => {
      if (activePlane !== null || !isDown.current) return;
      const x = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const delta = x - startX.current;
      const threshold = viewport.width / 4; // Threshold for registering a swipe

      if (Math.abs(delta) > threshold) {
        if (delta > 0) {
          progress.current = Math.max(progress.current - 100 / ($items.length - 1), 0);
        } else {
          progress.current = Math.min(progress.current + 100 / ($items.length - 1), 100);
        }
        startX.current = x; // Reset start point after each full swipe
      }
    };

    /*--------------------
    Mobile Touch Support (Swipe Gesture)
    --------------------*/
    const handleTouchStart = e => {
      if (activePlane !== null) return;
      isDown.current = true;
      startX.current = e.touches[0].clientX;
    };

    const handleTouchMove = e => {
      if (activePlane !== null || !isDown.current) return;
      const x = e.touches[0].clientX;
      const delta = x - startX.current;
      const threshold = viewport.width / 4; // Adjust based on swipe sensitivity

      if (Math.abs(delta) > threshold) {
        if (delta > 0) {
          progress.current = Math.max(progress.current - 100 / ($items.length - 1), 0);
        } else {
          progress.current = Math.min(progress.current + 100 / ($items.length - 1), 100);
        }
        startX.current = x; // Reset start point
      }
    };

    const handleTouchEnd = () => {
      isDown.current = false;
    };

    /*--------------------
    Click
    --------------------*/
    useEffect(() => {
      if (!$items) return;
      if (activePlane !== null && prevActivePlane === null) {
        progress.current = (activePlane / ($items.length - 1)) * 100; // Calculate the progress.current based on activePlane
      }
    }, [activePlane, $items]);


  /*--------------------
  Render Plane Events
  --------------------*/
  const renderPlaneEvents = () => {
    return (
      <mesh
        position={[0, 0, -0.01]}
        onWheel={handleWheel}
        onPointerDown={handleDown}
        onPointerUp={handleUp}
        onPointerMove={handleMove}
        onPointerLeave={handleUp}
        onPointerCancel={handleUp}
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
      <group ref={setRoot}>
        {projectData.map((item, i) => (
          <CarouselItem
            width={planeSettings.width}
            height={planeSettings.height}
            setActivePlane={setActivePlane}
            activePlane={activePlane}
            key={item.image}
            item={item}
            index={i}
          />
        ))}

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


export default CarouselWrap;
