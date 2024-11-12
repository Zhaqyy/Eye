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
  
    let distance = 0;
    let mouseX = 0;
    let mouseY = 0;
  
    const calculateDistance = () => {
      const lottieX = gsap.getProperty(ref.current, "x");
      const lottieY = gsap.getProperty(ref.current, "y");
      distance = Math.sqrt(Math.pow(mouseX - lottieX, 2) + Math.pow(mouseY - lottieY, 2));
    };
  
    const handleMouseMove = e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Calculate distance and rotation on each mouse move
      calculateDistance();
  
      // Compute direction for rotation (flipping on Y axis)
      const dx = mouseX - gsap.getProperty(ref.current, "x");
      const dy = mouseY - gsap.getProperty(ref.current, "y");
  
      const rotationY = dx < 0 ? 180 : 0;
      const rotationZ = Math.atan2(dy, Math.abs(dx)) * (180 / Math.PI) * (rotationY === 180 ? -1 : 1);
  
      gsap.to(ref.current, { rotationY, rotationZ, duration: 1.5, ease: "power3" });
  
      // Move the duck if beyond the proximity distance
      if (distance > 50) {
        if (!isMoving) {
          setIsMoving(true);
          lottieRef.current.goToAndPlay(0, true); // Play walking animation
        }
        xTo(mouseX);
        yTo(mouseY);
      }
    };
  
    const ticker = gsap.ticker.add(() => {
      calculateDistance(); // Update distance on every tick
  
      if (distance < 50 && isMoving) {
        setIsMoving(false);
        lottieRef.current.goToAndStop(0, true); // Stop animation
      }
    });
  
    // Attach mousemove event listener
    window.addEventListener("mousemove", handleMouseMove);
  
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      gsap.ticker.remove(ticker);
    };
  }, [isMoving]);
  
  return (
    <div ref={ref} style={{ height: 150, width: 150, position: "absolute", left: 0, top: 0, pointerEvents: "none", zIndex: 6969 }}>
      <Lottie lottieRef={lottieRef} animationData={duck} />
    </div>
  );
};

export default CursorLottie;
