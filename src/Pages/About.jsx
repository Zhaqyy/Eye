import React, { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import "../Style/About.css";
import Griddy from "../Scene/Grid";
import Pool from "../Scene/Pool";
import { useSoundEffects } from "../Component/SoundEffects";
import useIsMobile from "../Component/isMobile";

const data = [
  {
    title: "Services",
    content: (
      <ul>
        <li>Web Development</li>
        <li>Mobile Apps</li>
        <li>Cloud Solutions</li>
      </ul>
    ),
  },
  {
    title: "Tools",
    content: <p>We use cutting-edge tools like React, GSAP, and more for building dynamic applications.</p>,
  },
  {
    title: "Awards",
    content: (
      <div>
        <h4>Best Design 2023</h4>
        <p>Awarded for exceptional UI/UX design in global competition.</p>
      </div>
    ),
  },
  {
    title: "Contact",
    content: (
      <ul>
        <li>LinkedIn</li>
        <li>Twitter</li>
        <li>Codepen</li>
        <li>GitHub</li>
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
                ? { writingMode: "horizontal-tb", textOrientation: "initial", letterSpacing: 0 }
                : { writingMode: "vertical-rl", textOrientation: "upright", letterSpacing: -5 };

              gsap.set(slide.querySelector(".title"), {
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
        gsap.set(slide, { width:"100%", height: "70px" });
      } else {
        gsap.set(slide, { width: 70,height:300 });
      } // Reset all slides to their default size
      gsap.set(slide.querySelector(".content"), { opacity: 0, display: "none" }); // Hide all content
      gsap.set(slide.querySelector(".title"), { opacity: 1, x: 0, y: 0 }); // Reset title position and visibility
    });
  };

  useEffect(() => {
    resetSlides();
    // Reset the activeIndex to 0 on any re-render or mount
    activeIndex.current = 0;
    previousIndex.current = null; // Clear previous index

    // Animate to the first slide (or reset the slider state)
    animateSlides(activeIndex.current);
  }, [isMobile]);

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

  return (
    <div className='abt'>
      <section className='abtInfo' ref={infoSlider} onWheel={handleWheel}>
        <div className='abtHeader'>
          <div className='abtTitle'>
            <h1>Shuaib</h1>
            <h5>Creative Developer</h5>
            <h1>Abdulrazaq</h1>
          </div>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam optio qui voluptas iusto? Obcaecati delectus ipsam, excepturi a
            ea suscipit autem voluptatum tempore, incidunt et veritatis eius dolor sit minima.
          </p>
        </div>

        <div className='infoSlider'>
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
    name: "Pool",
    description:
      "Dive into the depths of serenity with 'Pool'. This scene is an oasis of calm where shimmering waters meet reflective skies. It’s designed to show how fluidity and tranquility can transform digital spaces into something truly immersive. If you’re looking for a place to float in your thoughts, this is it!",
    component: Pool, // This refers to the <Pool /> component
    type: "Experiences",
    mobile: true, // Visible on mobile
  },
  {
    name: "Angel",
    description:
      "Dive into the depths of serenity with 'Pool'. This scene is an oasis of calm where shimmering waters meet reflective skies.",
    component: Pool,
    type: "UI Prototypes",
    mobile: true,
  },
  {
    name: "Griddy",
    description:
      "Welcome to the grid, where sharp lines and bold edges create a world of control and precision. 'Griddy' is a showcase of structure and clarity, balancing creativity with order. It’s the perfect way to demonstrate how organized chaos can form something beautifully intricate.",
    component: Griddy,
    type: "3D Animations",
    mobile: false,
  },
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

  useEffect(() => {
    gsap.fromTo(
      ".canv",
      { opacity: 0 }, // Fade in new scene
      { opacity: 1, duration: 0.5 }
    );
  }, [activeSceneIndex]);

  return (
    <section className='abtCanvas' ref={abtCanvas}>
      <span className='type'>
        <p>
          I <strong className='Lword'>{lWord}</strong> <em className='Rword'>{rWord}</em>{" "}
          <span className='type-word'>{activeScene.type}</span>
        </p>
      </span>

      <div className='canv' onWheel={handleWheel}>
        <div className={"canvIcon"}>
          <span
            id='ctrlBtn'
            className={"canvPrev"}
            onClick={() => switchScene(-1)} // Trigger previous scene
          >
            ⥒
          </span>
          <span
            id='ctrlBtn'
            className={"canvNext"}
            onClick={() => switchScene(1)} // Trigger next scene
          >
            ⥓
          </span>
        </div>
        {React.createElement(activeScene.component)}
      </div>
      <div className='sceneInfo'>
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
