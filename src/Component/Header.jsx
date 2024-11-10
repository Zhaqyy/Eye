import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import "../Style/Component.css";
import { Link } from "react-router-dom";

const Header = () => {
  const headerRef = useRef(null);

//   useEffect(() => {
//     const element = headerRef.current;
//     const minRange = 50; // Minimum range for maximum scale (closest distance)
//     const maxRange = 100; // Maximum range for minimum scale (furthest distance)

//     const onMouseMove = e => {
//       const rect = element.getBoundingClientRect();
//       const elementX = rect.left + rect.width / 2;
//       const elementY = rect.top + rect.height / 2;

//       // Calculate the distance between the mouse and the center of the element
//       const dx = e.clientX - elementX;
//       const dy = e.clientY - elementY;
//       const distance = Math.sqrt(dx * dx + dy * dy);

//       // Normalize the distance within the min and max range
//       const clampedDistance = Math.min(Math.max(distance, minRange), maxRange);
//       const proximity = 1 - (clampedDistance - minRange) / (maxRange - minRange);

//       // Animate the width, height, and background color based on proximity
//       gsap.to(element, {
//         width: `${100 + proximity * 20}px`, // From 5vw to 10vw based on proximity
//         height: `${50 + proximity * 10}px`, // From 5vh to 10vh based on proximity
//         backgroundColor: `rgba(255, 255, 255, ${proximity})`, // From transparent to white
//         color: `rgb(${255 - proximity * 255}, ${255 - proximity * 255}, ${255 - proximity * 255})`,
//         duration: 0.1, // Duration for a smooth animation
//         ease: "power3.Out",
//       });
//     };

//     // Add mousemove event listener
//     window.addEventListener("mousemove", onMouseMove);

//     // Cleanup the event listener on component unmount
//     return () => {
//       window.removeEventListener("mousemove", onMouseMove);
//     };
//   }, []);

//   useEffect(() => {
//     const items = headerRef.current.querySelectorAll(".menu-item");
//     items.forEach((item, index) => {
//       // Set initial position based on index
// const radian = 60
//       const angle = -radian + index * radian;
//       const xPos = radian + index * 1 * -radian;
//       const yPos = 20 + (index % 2) * 40;

//       gsap.set(item, {
//         rotation: angle,
//         x: xPos,
//         y: yPos,
//         skewY: -radian
//         // transformOrigin: '3.5vh -3.5vw', // Adjust distance from center
//       });

//       // Add hover animation
//       //   item.addEventListener('mouseenter', () => {
//       //     gsap.to(item, {
//       //       scale: 1.2,
//       //       duration: 0.3,
//       //       ease: 'power3.out',
//       //     });
//       //   });
//       //   item.addEventListener('mouseleave', () => {
//       //     gsap.to(item, {
//       //       scale: 1,
//       //       duration: 0.3,
//       //       ease: 'power3.out',
//       //     });
//       //   });
//     });
//   }, []);
  return (
    <section className='header'>
      <ul className='menu' ref={headerRef}>
        {/* <h1>Z</h1> */}
        <li className='menu-item'><div><Link to={'/'}>Home</Link></div></li>
        <li className='menu-item'><div><Link to={'/About'}>About</Link></div></li>
        <li className='menu-item'><div><Link to={'#'}>Lab</Link></div></li>
      </ul>
    </section>
  );
};

export default Header;
