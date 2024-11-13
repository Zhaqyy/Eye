import { Howl } from "howler";
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import gsap from "gsap";

// Ambient sounds setup
const ambientSounds = {
  home: new Howl({ src: ["/Sounds/homeAmb.mp3"], loop: true, volume: 1 }),
  other: new Howl({ src: ["/Sounds/ambience.mp3"], loop: true, volume: 1 }),
};

// Interaction sounds setup
const interactionSounds = {
  hover: {
    reverbed: [new Howl({ src: ["/Sounds/popH.mp3"], volume: 0.005 }), new Howl({ src: ["/Sounds/popH2.mp3"], volume: 0.005 })],
    normal: [new Howl({ src: ["/Sounds/hover1.mp3"], volume: 0.25 }), new Howl({ src: ["/Sounds/hover2.mp3"], volume: 0.25 })],
  },
  click: {
    reverbed: [
      new Howl({ src: ["/Sounds/clickH.mp3"], volume: 0.005 }),
      // new Howl({ src: ['/Sounds/click_reverbed2.mp3'], volume: 1 }),
    ],
    normal: [
      new Howl({ src: ["/Sounds/click.mp3"], volume: 0.25 }),
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
  const currentAmbient = useRef(null);

  // Play the appropriate ambient sound regardless of toggle state
  const playAmbientSound = () => {
    const ambient = isHome ? ambientSounds.home : ambientSounds.other;
    if (currentAmbient.current && currentAmbient.current !== ambient) {
      currentAmbient.current.fade(isHome ? 0.025 : 0.25, 0, 2000);
      setTimeout(() => currentAmbient.current.pause(), 2000);
    }
    currentAmbient.current = ambient;
    ambient.play();
    ambient.fade(0, isHome ? 0.025 : 0.25, 2000);
  };

  // Mute or unmute all sounds, including interaction sounds
  const toggleMute = () => {
    isMuted.current = !isMuted.current;
    const targetVolume = isMuted.current ? 0 : 1;
    gsap.to(Howler, {
      volume: targetVolume,
      duration: 1,
      onComplete: () => Howler.mute(isMuted.current),
    });
  };

  // Adjust ambient playback rate based on menu state
  useEffect(() => {
    if (currentAmbient.current) {
      const targetRate = isMenuOpen ? 0.75 : 1;
      gsap.to(currentAmbient.current, { rate: targetRate, duration: 0.5 });
    }
  }, [isMenuOpen]);

  // Enhanced visibility change logic
  const handleVisibilityChange = () => {
    if (document.visibilityState === "hidden" && currentAmbient.current.playing()) {
      currentAmbient.current.fade(isHome ? 0.025 : 0.25, 0, 1000);
      setTimeout(() => currentAmbient.current.pause(), 1000);
    } else if (document.visibilityState === "visible" && !isMuted.current) {
      currentAmbient.current.play();
      currentAmbient.current.fade(0, isHome ? 0.025 : 0.25, 1000);
    }
  };

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
      const includedIds = ["header", "exclude"];
      const isButton = e.target.matches("button, a");
      const shouldPlaySound = isButton || (includedIds.includes(e.target.id) && !excludedIds.includes(e.target.id));

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

  return { toggleMute };
};
