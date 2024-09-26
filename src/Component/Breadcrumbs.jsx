import { useMemo, useEffect, useRef, forwardRef } from "react";
import { projectData } from "../Component/ProjectData";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

const Breadcrumbs = forwardRef(({ activeIndex, setActiveIndex },containerRef) => {
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

  const maxRotate = 90;
  const perspective = 25;
  const plane = useRef(null);
//   const containerRef = useRef(null);

//     const manageMouseMove = e => {
//       const x = e.clientX / window.innerWidth;
//       const y = e.clientY / window.innerHeight;
//       const perspective = 25
//       const rotateX = maxRotate * x - maxRotate / 2;
//       const rotateY = (maxRotate * y - maxRotate / 2) * -1;
//       if (firstLetterRef.current) {
//         firstLetterRef.current.style.transform = `rotateX(${rotateY}deg) rotateY(${rotateX}deg)`;
//       }
//     };

//   const { contextSafe } = useGSAP({ scope: containerRef });
// console.log(containerRef.current);
//   // Mouse move handler (wrapped in contextSafe to manage cleanup)
//   const handleMouseMove = contextSafe(e => {
//     const x = e.clientX / window.innerWidth;
//     const y = e.clientY / window.innerHeight;
//     const rotateX = maxRotate * x - maxRotate ;
//     const rotateY = (maxRotate * y - maxRotate / 2) * -1;

//     // Animate the rotation and perspective
//     gsap.to(firstLetterRef.current, {
//       rotateX: rotateY,
//       rotateY: rotateX,
//       perspective: `${perspective}vw`,
//       ease: "power3.out",
//       duration: 0.4,
//     });
//   });

//   // Mouse leave handler to reset the animation smoothly
//   const handleMouseLeave = contextSafe(() => {
//     gsap.to(firstLetterRef.current, {
//       rotateX: 0,
//       rotateY: 0,
//     //   perspective: 'none',
//       ease: "bounce.out",
//       duration: 0.8,
//     });
//   });

  return (
    <ul
     
      className='bCrumb'
        // onMouseMove={manageMouseMove}
    //   onMouseLeave={handleMouseLeave}
    >
      {projectData.map((item, index) => (
        <li key={index} className={index === activeIndex ? "active" : ""}>
          {index === activeIndex && <p ref={firstLetterRef}>{firstLetters[activeIndex]}</p>}
        </li>
      ))}
    </ul>
  );
});

export default Breadcrumbs;
