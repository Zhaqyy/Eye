import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const Word = ({ word, url = "#" }) => {
  let el = useRef();
  let q = gsap.utils.selector(el);
  const { contextSafe } = useGSAP({ scope: el });

  // animation for staggered trans up
  // let tl = gsap.timeline({ paused: true });

  // useEffect(() => {
  //   let q = gsap.utils.selector(el);
  //   // Animation for scaling up the first letter
  //   tl.to(q('.split'), {
  //     duration: 0.5,
  //     y: -10,
  //     stagger: 0.05,
  //     ease: 'power3.out',
  //   });
  // }, [tl]);

  
  // Create a timeline for complex animation
  const tl = gsap.timeline({ paused: true });
  useGSAP(() => {
    let q = gsap.utils.selector(el);
    let letters = q('.split');
    const numLetters = letters.length;

    // Scale up the first letter
    tl.to(letters[0], {
      duration: 0.5,
      scaleX: 2.5,
      transformOrigin: "0 100%",
      ease: "back.out(1.7)",
    });

    // Apply random rotation and translation to other letters
    tl.to(
      letters,
      {
        duration: 0.25,
          x: (index) => (index > 0 ? (numLetters - index) * 2 : 0), // Translate more for letters closer to the start
        y: (index) => (index > 0 ? -(numLetters - index) * 0.25 : 0), // Translate more for letters closer to the start
        rotation: (index) => (index > 0 ? Math.random() * 50 - 5 : 0), // Random rotation for letters except the first one
        stagger: 0.05,
        ease: "back.out(1.7)",
      },
      '<' // Start this animation at the same time as the first letter scaling
    );

  }, [contextSafe]);

  const onHover = contextSafe(() => {
    tl.play();
  });

  const unHover = contextSafe(() => {
    tl.reverse();
  });

  return (
    <a href={`${url}`} className='splitWrap' ref={el} onMouseOver={onHover} onMouseLeave={unHover}>
      {word.split("").map((char, index) => (
        <span className='split' key={index}>
          {char === " " ? "&nbsp;&nbsp;" : char}
        </span>
      ))}
    </a>
  );
};

export default Word;
