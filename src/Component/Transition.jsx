import React from 'react';
import { SwitchTransition, Transition } from 'react-transition-group';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';

const Transitioner = ({ children }) => {
  const location = useLocation();
  return (
    <SwitchTransition>
      <Transition
        key={location.pathname}
        timeout={500}
        onEnter={(node) => {
          gsap.set(node, { autoAlpha: 0, 
            // scale: 0.8, 
            opacity:0,
            xPercent: -100 });
          gsap
            .timeline({ paused: true })
            .to(node, { autoAlpha: 1, xPercent: 0, duration: 0.25 })
            .to(node, { 
              // scale: 1, 
              opacity:1,
              duration: 0.25 })
            .play();

            // console.log('enter');
        }}
        onExit={(node) => {
          gsap
            .timeline({ paused: true })
            .to(node, { 
              // scale: 0.8, 
              opacity:0,
              duration: 0.2 })
            .to(node, { xPercent: 100, autoAlpha: 0, duration: 0.2 })
            .play();

            // console.log('exit');
        }}
      >
        {children}
      </Transition>
    </SwitchTransition>
  );
};

export default Transitioner;
