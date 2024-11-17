import { useMemo, useEffect, useRef, forwardRef } from "react";
import { projectData } from "../Component/ProjectData";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

const Breadcrumbs = forwardRef(({ activeIndex, setActiveIndex }, containerRef) => {
  // Memoize the first letters to avoid recomputation on every render
  const firstLetters = useMemo(() => {
    return projectData.map(item => item.title[0]);
  }, [projectData]);

  const firstLetterRef = useRef(null);

  useEffect(() => {
    if (firstLetterRef.current) {
      // Animate the first letter of the active item when it changes
      gsap.fromTo(
        firstLetterRef.current,
        { opacity: 0, y: 10 }, // Starting state (offscreen)
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" } // Animate to visible
      );
    }
  }, [activeIndex]); // Re-run animation when activeIndex changes

  const { contextSafe } = useGSAP();

  const handleRoll = contextSafe(() => {
    // Generate random rotations for X, Y, and Z axes
    const randomRotationX = (Math.random() - 0.5) * 720; // Range: -360 to 360 degrees
    const randomRotationY = (Math.random() - 0.5) * 720; // Range: -360 to 360 degrees
    const randomRotationZ = (Math.random() - 0.5) * 720; // Range: -360 to 360 degrees

    // Animate the random 3D rotation with GSAP
    gsap.to(firstLetterRef.current, {
      rotateX: randomRotationX,
      rotateY: randomRotationY,
      rotateZ: randomRotationZ,
      ease: "power3.out",
      duration: 0.5, // Duration of the rotation
      onComplete: () => {
        // Reset the rotation to 0 for all axes
        gsap.to(firstLetterRef.current, {
          rotateX: 0,
          rotateY: 0,
          rotateZ: 0,
          ease: "elastic.out(.95)",
          duration: 1.0, // Duration of the reset animation
        });
      },
    });
  });
  // Event handler setup
  const roll = contextSafe(index => {
    if (index === activeIndex) {
      handleRoll();
    }
  });

  return (
    <ul className='bCrumb'>
      {projectData.map((item, index) => (
        <li
          key={index}
          onMouseEnter={() => roll(index)}
          className={index === activeIndex ? "active" : ""}
          id={index === activeIndex ? "bCrumb" : ""}
        >
          {index === activeIndex && <p ref={firstLetterRef}>{firstLetters[activeIndex]}</p>}
        </li>
      ))}
    </ul>
  );
});

export default Breadcrumbs;
