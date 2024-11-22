import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Link } from "react-router-dom";

const Word = ({ word, url = "#" }) => {
  let el = useRef();
  const { contextSafe } = useGSAP({ scope: el });

  const tl = gsap.timeline({ paused: true });

  useEffect(() => {
    if (el.current) {
      let q = gsap.utils.selector(el);
      let letters = q('.split');
      const numLetters = letters.length;

      if (letters.length) {
        tl.to(letters[0], {
          duration: 0.5,
          scaleX: 2.5,
          transformOrigin: "0 100%",
          ease: "back.out(1.7)",
        }).to(
          letters,
          {
            duration: 0.25,
            x: (index) => (index > 0 ? (numLetters - index) * 2 : 0),
            y: (index) => (index > 0 ? -(numLetters - index) * 0.25 : 0),
            rotation: (index) => (index > 0 ? Math.random() * 50 - 5 : 0),
            stagger: 0.05,
            ease: "back.out(1.7)",
          },
          '<'
        );
      }
    }
  }, [el, tl]);

  let hoverTimeout;

  const onHover = contextSafe(() => {
    clearTimeout(hoverTimeout);
    hoverTimeout = setTimeout(() => tl.play(), 50);
  });

  const unHover = contextSafe(() => {
    clearTimeout(hoverTimeout);
    hoverTimeout = setTimeout(() => tl.reverse(), 50);
  });

  return (
    <Link
      to={`${url}`}
      className="splitWrap"
      ref={el}
      onMouseOver={onHover}
      onMouseLeave={unHover}
    >
      {word.split("").map((char, index) => (
        <span className="split" key={index}>
          {char === " " ? <span>&nbsp;</span> : char}
        </span>
      ))}
    </Link>
  );
};

export default Word;
