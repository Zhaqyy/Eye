import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import "../Style/Component.css";
import { Link } from "react-router-dom";
import { useSoundEffects } from "./SoundEffects";
import {
  animateBars,
  animateHeader,
  animateLogoRot,
  animateLogoRot2,
  animateLogoRotVariant2,
  animateLogoRotVariant3,
  animateLogoRotVariant4,
  animateLogoWipe,
  animateNav,
} from "./PageAnimations";
import Logo from "./Logo";

const Header = () => {
  const navRef = useRef(null);
  const headerRef = useRef(null);
  const logoRef = useRef(null);
  const MenuTlRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false); // To track menu open state
  const { updateProximityRate, setInProximity, currentAmbient } = useSoundEffects();

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

  // Proximity Logic
  useEffect(() => {
    const element = navRef.current;
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
      if (navRef.current && !navRef.current.contains(e.target)) {
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

  //Menu Hover logic
  if (logoRef.current) {
    MenuTlRef.current = animateBars(logoRef)
  }

  const handleHeaderHover = () => {
    if (!isOpen) {
      MenuTlRef.current.play(); 
      // Dispatch interaction sound only when menu is closed
      document.querySelector("#header").dispatchEvent(new MouseEvent("mouseenter"));
    } else {
      MenuTlRef.current.reverse().pause(); 
    }
  };

  const handleHeaderLeave = () => {
    MenuTlRef.current.reverse();

  };

//Logo animation randomizer
const logoRotations = [
  { animation: animateLogoRot, weight: 50 }, // 50% chance
  { animation: animateLogoRotVariant2, weight: 50 },
  { animation: animateLogoRotVariant3, weight: 25 },
  { animation: animateLogoRotVariant4, weight: 25 },
];

const pickWeightedAnimation = (animations) => {
  const totalWeight = animations.reduce((sum, item) => sum + item.weight, 0);
  let random = Math.random() * totalWeight;

  for (const item of animations) {
    if (random < item.weight) {
      return item.animation;
    }
    random -= item.weight;
  }

  return animations[0].animation; // Fallback in case of edge cases
};


  //Intro Animation Logic
  useEffect(() => {
    const context = gsap.context(() => {
      const tl = gsap.timeline({
        delay: 2,
      });

      // animation for header
      tl.add(animateHeader(headerRef), "nav");
      tl.add(animateNav(navRef), "nav");
      tl.add(animateLogoWipe(logoRef), "intro", "nav>");

      // Randomize and add one of the logo rotation animations
    const randomLogoRot = pickWeightedAnimation(logoRotations);
    tl.add(randomLogoRot(headerRef), "logo", "intro>");

      tl.add(animateLogoRot2(logoRef), "logo+=1");

    }, headerRef);

    return () => context.revert(); // Cleanup on unmount
  }, []);

  return (
    <section className='header' ref={headerRef} data-hidden>
      {/* Radial gradient underlay */}
      <div className='underlay'></div>
      <div className='logo'>
        <Logo ref={logoRef} />
      </div>
      <ul id='header' className='menu' ref={navRef} onClick={toggleMenu} onMouseEnter={handleHeaderHover} onMouseLeave={handleHeaderLeave}>
        <li className='menu-item'>
          <div>
            <Link to={"/Project/1"}>Lab</Link>
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
