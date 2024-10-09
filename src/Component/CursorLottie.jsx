import React, { useRef, useEffect, useState } from "react";
import Lottie from "lottie-react";
import gsap from "gsap";
import duck from "./Lottie/duck.json";

const CursorLottie = () => {
  const lottieRef = useRef();
  const ref = useRef();
  const [isMoving, setIsMoving] = useState(false);

  useEffect(() => {
    // Center the duck
    gsap.set(ref.current, { xPercent: -50, yPercent: -50 });

    // Setup the gsap quickTo for smooth movement
    const xTo = gsap.quickTo(ref.current, "x", { duration: 15, ease: "power3" });
    const yTo = gsap.quickTo(ref.current, "y", { duration: 15, ease: "power3" });
// console.log(lottieRef.current.getDuration());
    const handleMouseMove = e => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      // Get the current position of the duck
      const lottieX = gsap.getProperty(ref.current, "x");
      const lottieY = gsap.getProperty(ref.current, "y");
      const distance = Math.sqrt(Math.pow(mouseX - lottieX, 2) + Math.pow(mouseY - lottieY, 2));

      // Compute direction for rotation (flipping on Y axis)
      const dx = mouseX - lottieX;
      const dy = mouseY - lottieY;

      // Flip instantly on the Y-axis based on direction
      const rotationY = dx < 0 ? 180 : 0;

      // Calculate Z-axis rotation (only for up/down movement) and normalize based on Y-flip
      const rotationZ = Math.atan2(dy, Math.abs(dx)) * (180 / Math.PI) * (rotationY === 180 ? -1 : 1);

      // Apply rotation to the duck (separate Y and Z axes)
      gsap.to(ref.current, { rotationY, rotationZ, duration: 1.5, ease: "power3" });

      // Movement logic
      if (distance > 50) {
        if (!isMoving) {
          setIsMoving(true);
          lottieRef.current.goToAndPlay(0, true); // Play walking animation
        }

        // Move the duck towards the mouse smoothly
        xTo(mouseX);
        yTo(mouseY);
      } else {
        // Stop moving when within proximity
        if (isMoving) {
          setIsMoving(false);
          lottieRef.current.goToAndStop(0, true); // Stop animation
        }
      
      }
    };

    // Attach mousemove event listener
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isMoving]);

  return (
    <div ref={ref} style={{ height: 150, width: 150, position: "absolute", left: 0, top: 0, pointerEvents: 'none' }}>
      <Lottie lottieRef={lottieRef} animationData={duck} />
    </div>
  );
};

export default CursorLottie;
