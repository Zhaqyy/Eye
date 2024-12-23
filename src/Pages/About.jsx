import React, { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import "../Style/About.css";
import Griddy from "../Scene/Showcase/Grid";
import Pool from "../Scene/Showcase/Pool";
import { useSoundEffects } from "../Component/SoundEffects";
import useIsMobile from "../Component/isMobile";
import { animateAbtCanvas, animateAbtElements } from "../Component/PageAnimations";
import BallPress from "../Scene/Showcase/BallPress";
import Ribbons from "../Scene/Showcase/Ribbons";
import ContactCard from "../Scene/Showcase/ContactCard";
import InfinityWall from "../Scene/Showcase/InfinityWall";

const data = [
  {
    title: "Services",
    content: (
      <ul>
        <li>Web Development</li>
        <li>3D Web Experiences</li>
        <li>UI/Design Prototyping</li>
        <li>Creative Consulting</li>
      </ul>
    ),
  },
  {
    title: "Tools",
    content: (
      <ul>
        <li>ReactJS</li>
        <li>GSAP, Framer Motion, React-Spring</li>
        <li>Three.js, R3F, WebGL, Shader Development (GLSL)</li>
        <li>Blender, Figma, AfterEffect, Illustrator</li>
      </ul>
    ),
  },
  {
    title: "Awards",
    content: (
      <ul>
        <li>Good Boy - My Mum</li>
        <li>Nice Shirt! - Random guy on a bus 4 years ago</li>
        <li>Nothing Yet Sadly, But hey, I got some cool recognitions above</li>
      </ul>
    ),
  },
  {
    title: "Contact",
    content: (
      <ul className='abtCont'>
        <li>
          <a href='https://www.linkedin.com/in/abdulrazaq-shuaib-72a827263' target='_blank' rel='noopener noreferrer'>
            LinkedIn
          </a>
        </li>
        <li>
          <a href='https://x.com/Zharqyy' target='_blank' rel='noopener noreferrer'>
            Twitter
          </a>
        </li>
        <li>
          <a href='https://codepen.io/zhaqyy' target='_blank' rel='noopener noreferrer'>
            Codepen
          </a>
        </li>
        <li>
          <a href='https://github.com/Zhaqyy' target='_blank' rel='noopener noreferrer'>
            GitHub
          </a>
        </li>
      </ul>
    ),
  },
];

const About = () => {
  const slides = useRef([]);
  const infoSlider = useRef();
  const { playSlideSound } = useSoundEffects();
  const isMobile = useIsMobile(500);

  const addSlideRef = (el, index) => {
    slides.current[index] = el;
  };

  gsap.defaults({
    ease: "sine.inOut",
  });

  const activeIndex = useRef(0);
  const previousIndex = useRef(0); // To track the previous active slide index

  const animateSlides = index => {
    slides.current.forEach((slide, i) => {
      if (i === index) {
        // Active slide animation
        // Animate the title out First, then when its out, start others
        const titleProps = isMobile ? { y: 25, duration: 0.25 } : { x: -25, duration: 0.25 };
        gsap.timeline().to(slide.querySelector(".title"), {
          opacity: 0,
          ...titleProps,

          onComplete: () => {
            gsap.set(slide, { flexDirection: "column", justifyContent: "center" });

            const animationProps = isMobile
              ? { height: "300px", duration: 0.25 } // Animate height for mobile
              : { width: 300, duration: 0.25 }; // Animate width for desktop

            gsap.to(slide, {
              ...animationProps,
              stagger: 0.2,
              onComplete: () => {
                gsap.set(slide.querySelector(".title"), {
                  writingMode: "horizontal-tb",
                  textOrientation: "initial",
                  letterSpacing: 0,
                  width: "100%",
                  textAlign: "left",
                });
                gsap.fromTo(
                  slide.querySelector(".title"),
                  {
                    opacity: 0,
                    x: 0,
                    y: -10,
                  },
                  {
                    opacity: 1,
                    x: 0,
                    y: 0,
                    duration: 0.4,
                  }
                );
                gsap.to(slide.querySelector(".content"), {
                  opacity: 1,
                  display: "block", // Make sure the content is displayed
                  duration: 0.5,
                  stagger: 0.2,
                });
              },
            });
            gsap.to(slide.querySelector(".slideIcon"), { opacity: 0, display: "none", duration: isMobile ? 0 : 0.2 }); // Fade out icon
          },
        });
      } else if (i === previousIndex.current) {
        // Animate only the previous slide (instead of all other slides)
        // CLose animation
        gsap
          .timeline()
          .to(slide.querySelector(".content"), {
            opacity: 0,
            display: "none", // Hide the content for the previous slide
            duration: isMobile ? 0 : 0.25,
          })
          .set(slide.querySelector(".title"), {
            opacity: 0,
            duration: isMobile ? 0 : 0.25,
          })
          .to(slide.querySelector(".title"), {
            opacity: 0,
            duration: isMobile ? 0 : 0.25,
            onComplete: () => {
              const orienttitleProps = isMobile
                ? { writingMode: "horizontal-tb", textOrientation: "initial", letterSpacing: 0, width: "100%" }
                : { writingMode: "vertical-rl", textOrientation: "upright", letterSpacing: -5, width: "auto" };

              gsap.set(slide.querySelector(".title"), {
                textAlign: "center",
                ...orienttitleProps,
              });
              const fromtitleProps = isMobile ? { y: -25 } : { x: 25 };
              const totitleProps = isMobile ? { y: 0 } : { x: 0 };
              gsap.fromTo(
                slide.querySelector(".title"),
                {
                  opacity: 0,
                  ...fromtitleProps,
                },
                {
                  opacity: 1,
                  ...totitleProps,
                  duration: 0.25,
                }
              );
              gsap.to(slide.querySelector(".slideIcon"), { opacity: 1, display: "flex", duration: 0.2 }); // Fade in icon
              const slideProps = isMobile
                ? { flexDirection: "row", justifyContent: "space-between" }
                : { flexDirection: "column", justifyContent: "center" };
              gsap.set(slide, { ...slideProps });
              const animationProps = isMobile
                ? { height: "70px", duration: 0.95, ease: "elastic.out(0.5, 0.45)" } // Animate height for mobile
                : { width: 70, duration: 0.95, ease: "elastic.out(0.5, 0.45)" }; // Animate width for desktop

              gsap.to(slide, { ...animationProps });
            },
          });
      }
    });

    previousIndex.current = index; // Update previous index
  };

  const resetSlides = () => {
    slides.current.forEach(slide => {
      if (isMobile) {
        gsap.set(slide, { width: "100%", height: "70px" });
      } else {
        gsap.set(slide, { width: 70, height: 300 });
      } // Reset all slides to their default size
      gsap.set(slide.querySelector(".content"), { opacity: 0, display: "none" }); // Hide all content
      gsap.set(slide.querySelector(".title"), { opacity: 1, x: 0, y: 0 }); // Reset title position and visibility
    });
  };

  // Throttle scroll event
  const { contextSafe } = useGSAP({ scope: infoSlider });

  const scrollTimeout = useRef(null);

  const handleWheel = contextSafe(e => {
    if (scrollTimeout.current) return; // Ignore event if throttle is active

    scrollTimeout.current = setTimeout(() => {
      scrollTimeout.current = null; // Reset throttle after 1s
    }, 1000);

    previousIndex.current = activeIndex.current; // Track the previous active slide

    if (e.deltaY > 0) {
      activeIndex.current = (activeIndex.current + 1) % data.length;
    } else {
      activeIndex.current = (activeIndex.current - 1 + data.length) % data.length;
    }

    animateSlides(activeIndex.current);
  });

  const handleClick = contextSafe(index => {
    if (index !== activeIndex.current) {
      if (scrollTimeout.current) return; // Ignore event if throttle is active

      scrollTimeout.current = setTimeout(() => {
        scrollTimeout.current = null; // Reset throttle after 1s
      }, 1000);

      playSlideSound("click");

      previousIndex.current = activeIndex.current; // Track previous index
      activeIndex.current = index; // Update active index

      animateSlides(activeIndex.current); // Trigger animation
    }
  });

  const handleHoverEnter = contextSafe(index => {
    const targetClass = `.slideIcon-${index}`;

    if (scrollTimeout.current) return; // Ignore event if throttle is active

    scrollTimeout.current = setTimeout(() => {
      scrollTimeout.current = null; // Reset throttle after 1s
    }, 200);

    playSlideSound("hover");

    // Squash and stretch effect
    gsap.to(targetClass, {
      scaleX: 1.2,
      scaleY: 0.8,
      duration: 0.25,
      ease: "power3.out", // Creates a fast squash
    });
    gsap.to(targetClass, {
      scaleX: 1,
      scaleY: 1,
      duration: 0.95,
      ease: "elastic.out(1, 0.3)",
      delay: 0.2, // Delay to make the animation follow smoothly
    });
  });

  // Intro Animation
  const abtRef = useRef(null);

  useEffect(() => {
    const context = gsap.context(() => {
      // timeline for the animation
      const tl = gsap.timeline({ delay: 1.25 });

      // animation for abt elements
      tl.add(animateAbtElements(abtRef), "abtSection", 1);

      // callback to reset slides after animation completes
      tl.call(
        () => {
          resetSlides();
          activeIndex.current = 0;
          previousIndex.current = null;
          animateSlides(activeIndex.current);
        },
        null,
        ">"
      );
    }, abtRef);

    return () => context.revert(); // Cleanup on unmount
  }, [isMobile]);

  return (
    <div className='abt' ref={abtRef}>
      <section className='abtInfo' ref={infoSlider} onWheel={handleWheel}>
        <div className='abtHeader'>
          <div className='abtTitle'>
            <h1 data-hidden>Shuaib</h1>
            <h5 data-hidden>Creative Developer</h5>
            <h1 data-hidden>Abdulrazaq</h1>
          </div>
          <p data-hidden>
            Hi there! I'm a creative developer hopelessly addicted to design, animation, and turning everything interactive (show me an
            element, and I'll give you 10 ways to make it irresistible).
            <br />
            With 3+ years of crafting immersive digital experiences and an unhealthy Pinterest habit (seriously, send help)—I can’t stop,
            won’t stop. Whether it's a jaw-dropping website or a button so satisfying you’ll click it twice, I’m your go-to code wizard.
          </p>
        </div>

        <div className='infoSlider' data-hidden>
          {data.map((item, index) => (
            <div
              className='slide'
              id='slide'
              ref={el => addSlideRef(el, index)}
              onClick={() => handleClick(index)} // Update to handle click
              onMouseEnter={() => handleHoverEnter(index)}
              onTouchEnd={() => handleClick(index)}
              key={index}
            >
              <div className='slideIconWrap'>
                <span className={`slideIcon slideIcon-${index}`}>↔</span>
              </div>

              <h3 className='title'>{item.title}</h3>
              <div className='content'>{item.content}</div>
            </div>
          ))}
        </div>
      </section>
      <AbtCanvas />
    </div>
  );
};

export default About;

const scenesData = [
  {
    name: "BallPress",
    description:
      "I apologize, I couldn’t come up with a better name but I always loved balls...errr I mean optical illusions. Here’s one I created: follow the balls with your eyes, and watch the scene become brighter and blurrier. Enjoy the mesmerizing effect, and... my balls!",
    component: BallPress,
    type: "3D Experiences / Interaction",
    mobile: true,
  },
  {
    name: "Ribbons",
    description:
      "A vibrant scene of colorful ribbons that dance to your touch. It’s like petting digital spaghetti or like a group of acrobatic tapeworms at a rave - oddly satisfying, endlessly mesmerizing, and completely calorie-free if you enjoy eating tapeworms.",
    component: Ribbons,
    type: "3D Experiences / Interaction",
    mobile: true,
  },
  {
    name: "Contact Card",
    description:
      "A contact card with an unorthodox radial menu and a 3D WebGL banner. It’s an scene that says, ‘Call me, You Peasant!.’ It’s a prototype designed to make ordinary contact sections feel insecure.",
    component: ContactCard,
    type: "UI+WebGL Prototypes",
    mobile: true,
  },
  {
    name: "Infinity Wall",
    description:
      "Be mesmerized and mildly hypnotized; no? alright then... This WebGL experiment proves that words truly have no end. Warning: prolonged staring may result in temporary unstable vision.",
    component: InfinityWall,
    type: "WebGL Experiments",
    mobile: true,
  },
  {
    name: "Griddy",
    description:
      "Welcome to the grid, where sharp lines and bold edges create a world of control and precision. It’s the perfect way to demonstrate how organized chaos can form something beautifully intricate.",
    component: Griddy,
    type: "3D Animations",
    mobile: false,
  },
  {
    name: "Nothing",
    description:
      "Dive into the depths of Nothing. It’s designed to show how basic fluidity and tranquility can transform digital...Naah, Just kidding, I just use this one as control test and got too lazy to remove it.",
    component: Pool, // This refers to the <Pool /> component
    type: "Experiences",
    mobile: true, // Visible on mobile
  },
  // {
  //   name: "Pool",
  //   description:
  //     "Dive into the depths of serenity with 'Pool'. It’s designed to show how fluidity and tranquility can transform digital spaces into something truly immersive.",
  //   component: Pool, // This refers to the <Pool /> component
  //   type: "Experiences",
  //   mobile: true, // Visible on mobile
  // },
];

const AbtCanvas = () => {
  const abtCanvas = useRef();

  const isMobile = useIsMobile(800);

  // Filter scenes based on the `mobile` property
  const filteredScenes = scenesData.filter(scene => (isMobile ? scene.mobile : true));

  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const activeScene = filteredScenes[activeSceneIndex];

  gsap.defaults({
    ease: "sine.inOut",
  });

  const LWord = ["Craft", "Build", "Design", "Shape", "Compose", "Engineer", "Innovate", "Conjure", "Construct", "Develop"];
  const RWord = ["Adaptive", "Interactive", "Fluid", "Dynamic", "Unique", "Engaging", "Seamless", "Mind-Blowing", "Weird", "Intricate"];

  // Randomize word selection
  const [lWord, setLWord] = useState(LWord[0]);
  const [rWord, setRWord] = useState(RWord[0]);

  const randomizeWords = () => {
    setLWord(LWord[Math.floor(Math.random() * LWord.length)]);
    setRWord(RWord[Math.floor(Math.random() * RWord.length)]);
  };

  // Throttle scroll event
  const { contextSafe } = useGSAP({ scope: abtCanvas });
  const scrollTimeout = useRef(null);

  const triggerAnimation = direction => {
    randomizeWords();

    const sign = direction > 0 ? 1 : -1;

    gsap.fromTo(
      ".Lword",
      {
        y: sign * 5,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.25,
      }
    );

    gsap.fromTo(
      ".Rword",
      {
        y: -sign * 5,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.25,
      }
    );

    gsap.fromTo(
      ".type-word",
      {
        filter: "blur(2px)",
        opacity: 0,
      },
      {
        filter: "blur(0px)",
        opacity: 1,
        duration: 0.5,
      }
    );

    gsap.fromTo(".sceneInfo", { opacity: 0 }, { opacity: 1, duration: 0.5 });
  };

  const switchScene = direction => {
    if (scrollTimeout.current) return;

    scrollTimeout.current = setTimeout(() => {
      scrollTimeout.current = null;
    }, 600);

    triggerAnimation(direction);

    if (direction > 0) {
      setActiveSceneIndex(prevIndex => (prevIndex + 1) % filteredScenes.length);
    } else {
      setActiveSceneIndex(prevIndex => (prevIndex === 0 ? filteredScenes.length - 1 : prevIndex - 1));
    }
  };

  const handleWheel = contextSafe(e => {
    if (scrollTimeout.current) return; // Ignore event if throttle is active

    scrollTimeout.current = setTimeout(() => {
      scrollTimeout.current = null; // Reset throttle after 600ms
    }, 600);

    // Determine direction (1 for down, -1 for up)
    const direction = e.deltaY > 0 ? 1 : -1;

    // Use the existing scene switch method
    switchScene(direction);
  });

  const handleHoverEnter = contextSafe(e => {
    const target = e.currentTarget;

    // Squash and stretch effect
    gsap.to(target, {
      scaleX: 1.1,
      scaleY: 0.9,
      duration: 0.25,
      ease: "power3.out", // Creates a fast squash
    });
    gsap.to(target, {
      scaleX: 1,
      scaleY: 1,
      duration: 0.95,
      ease: "elastic.out(1, 0.3)",
      delay: 0.2, // Delay to make the animation follow smoothly
    });
  });

  useEffect(() => {
    const context = gsap.context(() => {
      // timeline for the animation
      const tl = gsap.timeline({ delay: 1.25 });

      // animation for abt cancas
      tl.add(animateAbtCanvas(abtCanvas), "abtSection");
    }, abtCanvas);

    return () => context.revert(); // Cleanup on unmount
  }, []);

  return (
    <section className='abtCanvas' ref={abtCanvas}>
      <span className='type' data-hidden>
        <p>
          I <strong className='Lword'>{lWord}</strong> <em className='Rword'>{rWord}</em>{" "}
          <span className='type-word'>{activeScene.type}</span>
        </p>
      </span>

      <div className='canv' onWheel={handleWheel} data-hidden>
        <div className={"canvIcon"}>
          <span
            id='ctrlBtn'
            className={"canvPrev"}
            onMouseEnter={handleHoverEnter}
            onClick={() => switchScene(-1)} // Trigger previous scene
          >
            ⥒
          </span>
          <span
            id='ctrlBtn'
            className={"canvNext"}
            onMouseEnter={handleHoverEnter}
            onClick={() => switchScene(1)} // Trigger next scene
          >
            ⥓
          </span>
        </div>
        <div style={{ width: "100%", height: "100%", touchAction: "none" }}>{React.createElement(activeScene.component)}</div>
      </div>
      <div className='sceneInfo' data-hidden>
        <div className='sceneInfoTitle'>
          <div>
            <strong>
              <h6>Title</h6>
            </strong>
            <h3>{activeScene.name}</h3>
          </div>
          <div>
            <strong>
              <h6>Type</h6>
            </strong>
            <h4>{activeScene.type}</h4>
          </div>
        </div>
        <p>{activeScene.description}</p>
      </div>
    </section>
  );
};
