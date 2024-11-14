import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import "../Style/Component.css";
import { Link } from "react-router-dom";
import { useSoundEffects } from "./SoundEffects";

const Header = () => {
  const headerRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false); // To track menu open state

  const {
    updateProximityRate,
    setInProximity,
    currentAmbient,
  } = useSoundEffects();


  // Toggle menu open state on click
  const toggleMenu = () => {
    setIsOpen(prev => !prev);

    // Animate menu items' entrance
    if (!isOpen) {
      gsap.fromTo(
        ".menu-item",
        { opacity: 0, display: "none" },
        { opacity: 1, display: "block", stagger: 0.1, ease: "back.out(0.25)", duration: 0.5 }
      );
      // Animate the radial gradient underlay
      gsap.to(".underlay", {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: "power2.out",
      });
    } else {
      gsap.to(".menu-item", { opacity: 0, display: "none", duration: 0.35, ease: "power1.out", stagger: 0.1 });
      gsap.to(".underlay", {
        opacity: 0,
        scale: 0,
        duration: 0.5,
        delay: 0.25,
        ease: "power1.out",
      });
    }
  };

  useEffect(() => {
    const element = headerRef.current;
    const minRange = 50; // Minimum range for maximum scale (closest distance)
    const maxRange = 100; // Maximum range for minimum scale (furthest distance)

    const onMouseMove = e => {
      // Only animate proximity if the menu is closed
      if (!isOpen) {
        const rect = element.getBoundingClientRect();
        const elementX = rect.left + rect.width / 2;
        const elementY = rect.top + rect.height / 2;

        // Calculate the distance between the mouse and the center of the element
        const dx = e.clientX - elementX;
        const dy = e.clientY - elementY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Normalize the distance within the min and max range
        const clampedDistance = Math.min(Math.max(distance, minRange), maxRange);
        const proximity = 1 - (clampedDistance - minRange) / (maxRange - minRange);

        // Animate the size based on proximity
        gsap.to(element, {
          scale: 1 + proximity * 0.1,
          boxShadow: `0px 0px ${5 + proximity * 20}px ${-5 + proximity * -5}px rgba(0, 0, 0, ${0.1 + proximity * 0.5})`,
          duration: 0.25, // Duration for a smooth animation
          ease: "power1.out",
        });

        updateProximityRate(proximity);
        setInProximity(proximity > 0); // Set proximity state
      }
    };

    const handleOutsideClick = e => {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setIsOpen(false);
        gsap.to(".menu-item", { opacity: 0, display: "none", duration: 0.35, ease: "power1.out", stagger: 0.1 });
        gsap.to(".underlay", {
          opacity: 0,
          scale: 0,
          duration: 0.5,
          delay: 0.25,
          ease: "power1.out",
        });
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, updateProximityRate, currentAmbient]);

  const handleHeaderHover = () => {
    if (!isOpen) {
      // Play interaction sound only when menu is closed
      document.querySelector('#header').dispatchEvent(new MouseEvent('mouseenter'));
    }
  };

  return (
    <section className='header' >
      {/* Radial gradient underlay */}
      <div className='underlay'></div>
      <h1>Z</h1>
      <ul id="header" className='menu' ref={headerRef} onClick={toggleMenu} onMouseEnter={handleHeaderHover}>
        <li className='menu-item'>
          <div>
            <Link to={"/Work/1"}>Lab</Link>
          </div>
        </li>
        <li className='menu-item'>
          <div>
            <Link to={"/"}>Home</Link>
          </div>
        </li>
        <li className='menu-item'>
          <div>
            <Link to={"/About"}>About</Link>
          </div>
        </li>
      </ul>
    </section>
  );
};

export default Header;
