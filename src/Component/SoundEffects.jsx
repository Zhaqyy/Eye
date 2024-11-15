import { Howl } from "howler";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import gsap from "gsap";

// Ambient sounds setup
const ambientSound = new Howl({ src: ["/Sounds/homeAmb.mp3"], loop: true, volume: 0 });

// Interaction sounds setup
const interactionSounds = {
  hover: {
    reverbed: [new Howl({ src: ["/Sounds/popH.mp3"], volume: 0.0025 }), new Howl({ src: ["/Sounds/popH2.mp3"], volume: 0.005 })],
    normal: [
      new Howl({ src: ["/Sounds/hover1.mp3"], volume: 0.25, rate: 0.35 }),
      new Howl({ src: ["/Sounds/hover2.mp3"], volume: 0.25, rate: 0.35 }),
    ],
  },
  click: {
    reverbed: [
      new Howl({ src: ["/Sounds/clickH.mp3"], volume: 0.005 }),
      // new Howl({ src: ['/Sounds/click_reverbed2.mp3'], volume: 1 }),
    ],
    normal: [
      new Howl({ src: ["/Sounds/click.mp3"], volume: 0.25, rate: 3.5 }),
      // new Howl({ src: ['/Sounds/click_normal2.mp3'], volume: 1 }),
    ],
  },
};

const getRandomSound = soundsArray => {
  const randomIndex = Math.floor(Math.random() * soundsArray.length);
  return soundsArray[randomIndex];
};

export const useSoundEffects = isMenuOpen => {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const isMuted = useRef(false);
  const currentAmbient = useRef(ambientSound);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [inProximity, setInProximity] = useState(false);

  // Play the appropriate ambient sound regardless of toggle state
  // const playAmbientSound = () => {
  //   const targetVolume = isHome ? 0.025 : 0.015; // Lower volume for non-home pages
  //   if (!currentAmbient.current.playing()) {
  //     currentAmbient.current.play();
  //     currentAmbient.current.fade(0, targetVolume, 1000); // fade in smoothly
  //   } else {
  //     currentAmbient.current.fade(0, targetVolume, 1000);
  //   }
  // };
  const playAmbientSound = () => {
    if (!currentAmbient.current.playing()) {
      currentAmbient.current.play();
      const targetVolume = isHome ? 0.025 : 0.015;
      currentAmbient.current.fade(0, targetVolume, 1000); // Fade in smoothly
    }
  };

  // Mute or unmute all sounds, including interaction sounds
  const toggleMute = () => {
    isMuted.current = !isMuted.current;
    const targetVolume = isMuted.current ? 0 : 1;
    gsap.to(Howler, {
      volume: targetVolume,
      duration: 1,
      //   onComplete: () => Howler.mute(isMuted.current),
    });
  };

  // Adjust ambient playback rate based on menu state
  useEffect(() => {
    if (currentAmbient.current) {
      const targetRate = isMenuOpen ? 0.65 : 0.75;
      gsap.to(currentAmbient.current, { rate: targetRate, duration: 0.5 });
    }
  }, [isMenuOpen]);

  // Detect tab visibility and fade sound out when hidden
  const handleVisibilityChange = () => {
    if (document.visibilityState === "hidden" && currentAmbient.current.playing()) {
      currentAmbient.current.fade(isHome ? 0.025 : 0.015, 0, 1000);
      setTimeout(() => currentAmbient.current.pause(), 1000);
    } else if (document.visibilityState === "visible" && !isMuted.current) {
      currentAmbient.current.play();
      currentAmbient.current.fade(0, isHome ? 0.025 : 0.015, 1000);
    }
  };

  //   add event to page and trigger ambient
  useEffect(() => {
    playAmbientSound();
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isHome]);

  // Play interaction sound with ID-based exclusion/inclusion
  useEffect(() => {
    const playInteractionSound = e => {
      if (isMuted.current) return;

      const excludedIds = ["exclude", "exclude"];
      const includedIds = ["bCrumb"];

      const target = e.target;
      const isButton = target instanceof Element && target.matches("button, a");
      const shouldPlaySound =
        isButton || (target instanceof Element && includedIds.includes(target.id) && !excludedIds.includes(target.id));

      if (shouldPlaySound) {
        const type = e.type === "mouseenter" ? "hover" : "click";
        const pageType = isHome ? "reverbed" : "normal";
        const sound = getRandomSound(interactionSounds[type][pageType]);
        sound.play();
      }
    };

    document.addEventListener("mouseenter", playInteractionSound, true);
    document.addEventListener("click", playInteractionSound, true);

    return () => {
      document.removeEventListener("mouseenter", playInteractionSound, true);
      document.removeEventListener("click", playInteractionSound, true);
    };
  }, [isHome]);

  //play sound for about page slides
  const playSlideSound = type => {
    if (!isMuted.current) {
      const pageType = isHome ? "reverbed" : "normal";
      const sound = getRandomSound(interactionSounds[type][pageType]);
      sound.play();
    }
  };

  // Fade out ambient sound and set transition flag
  const fadeOutSound = () => {
    setIsTransitioning(true);
    if (currentAmbient.current.playing()) {
      const volume = currentAmbient.current.volume();
      currentAmbient.current.fade(volume, 0, 1000);
      gsap.to(currentAmbient.current, { rate: 0.6, duration: 0.5 });
    }
  };

  // Fade in ambient sound post-transition, adjust based on page type
  const fadeInSound = () => {
    setIsTransitioning(false);
    const targetVolume = isHome ? 0.025 : 0.015;
    if (!currentAmbient.current.playing()) {
      currentAmbient.current.play();
      currentAmbient.current.fade(0, targetVolume, 1000);
    } else {
      gsap.to(currentAmbient.current, { volume: targetVolume, rate: 1, duration: 0.5 });
    }
  };

  // Update rate if in proximity and no transition
  const updateProximityRate = proximity => {
    if (!isTransitioning) {
      const targetRate = 0.75 + (1 - proximity) * 0.25;
      currentAmbient.current.rate(targetRate);
    }
  };

  return {
    toggleMute,
    playSlideSound,
    fadeOutSound,
    fadeInSound,
    updateProximityRate,
    setInProximity,
    currentAmbient,
  };
};
