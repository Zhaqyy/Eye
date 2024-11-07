import React, { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import Lottie from "lottie-react";
import { useGSAP } from "@gsap/react";
import "../Style/About.css";
import Griddy from "../Scene/Grid";
import Pool from "../Scene/Pool";
import plus from "../Component/Lottie/plus.json";
import enlarge from "../Component/Lottie/enlarge.json";

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
  const plusRef = useRef([]);

  const addSlideRef = (el, index) => {
    slides.current[index] = el;
  };

  const addPlusRef = (lottie, index) => {
    plusRef.current[index] = lottie;
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
        gsap.timeline().to(slide.querySelector(".title"), {
          opacity: 0,
          x: -25,
          duration: 0.25,

          onComplete: () => {
            gsap.to(slide, {
              width: 300,
              duration: 0.25,
              // ease: "elastic.out(0.5, 0.5)",
              stagger: 0.2,
              onComplete: () => {
                gsap.set(slide.querySelector(".title"), {
                  writingMode: "horizontal-tb",
                  textOrientation: "initial",
                  letterSpacing: 0,
                });
                gsap.to(slide.querySelector(".slideLottie"), { opacity: 0, duration: 0.2 }); // Fade out Lottie
                gsap.set(slide.querySelector(".slideCtrl"), { opacity: 1, display: "flex" }); // Make buttons visible
                gsap.to(slide.querySelector(".slideCtrl"), {
                  opacity: 1,
                  columnGap:'50px',
                  autoRound: false,
                  // stagger: 0.1,
                  duration: 0.3,
                  ease: "elastic.out(0.5, 0.5)",
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
          },
        });
      } else if (i === previousIndex.current) {
        // Animate only the previous slide (instead of all other slides)
        gsap
          .timeline()
          .to(slide.querySelector(".content"), {
            opacity: 0,
            display: "none", // Hide the content for the previous slide
            duration: 0.25,
          })
          .set(slide.querySelector(".title"), {
            opacity: 0,
            duration: 0.25,
          })
          .to(slide.querySelector(".title"), {
            opacity: 0,
            duration: 0.25,
            onComplete: () => {
              gsap.set(slide.querySelector(".title"), {
                writingMode: "vertical-rl",
                textOrientation: "upright",
                letterSpacing: -5,
              });
              gsap.fromTo(
                slide.querySelector(".title"),
                {
                  opacity: 0,
                  x: 25,
                },
                {
                  opacity: 1,
                  x: 0,
                  duration: 0.25,
                }
              );
            },
          })
          .to(slide, {
            width: 70,
            duration: 0.95,
            ease: "elastic.out(0.5, 0.45)",
          });
      }
    });

    previousIndex.current = index; // Update previous index
  };

  const resetSlides = () => {
    slides.current.forEach(slide => {
      gsap.set(slide, { width: 70 }); // Reset all slides to their default size
      gsap.set(slide.querySelector(".content"), { opacity: 0, display: "none" }); // Hide all content
      gsap.set(slide.querySelector(".title"), { opacity: 1, x: 0 }); // Reset title position and visibility
    });
  };

  useEffect(() => {
    resetSlides();
    // Reset the activeIndex to 0 on any re-render or mount
    activeIndex.current = 0;
    previousIndex.current = null; // Clear previous index

    // Animate to the first slide (or reset the slider state)
    animateSlides(activeIndex.current);
    // if (plusRef.current) {
    //   console.log(plusRef.current.getDuration())
    //   plusRef.current.pause();
    //   // plusRef.current.goToAndStop(1, true);
    // }
    // Pause all Lotties on mount
    plusRef.current.forEach(ref => {
      if (ref) ref.play();
    });
  }, []);

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
      previousIndex.current = activeIndex.current; // Track previous index
      activeIndex.current = index; // Update active index

      // Reset the Lottie animation for the previously active slide
      // if (previousIndex.current !== null && plusRef.current[previousIndex.current]) {
      //   plusRef.current[previousIndex.current].goToAndStop(1, true);
      // }

      // Play the Lottie animation for the newly active slide
      if (plusRef.current[index]) {
        // plusRef.current[index].play();
        console.log(plusRef.current[index].getDuration());
        plusRef.current[index].goToAndPlay(0, true);
      }

      animateSlides(activeIndex.current); // Trigger animation
    }
  });

  const handleButtonClick = direction => {
    previousIndex.current = activeIndex.current;

    if (direction === "prev") {
      activeIndex.current = (activeIndex.current - 1 + data.length) % data.length;
    } else {
      activeIndex.current = (activeIndex.current + 1) % data.length;
    }

    animateSlides(activeIndex.current);
  };
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
              ref={el => addSlideRef(el, index)}
              onClick={() => handleClick(index)} // Update to handle click
              key={index}
            >
              {/* <div className='slideIcon'>
                <Lottie lottieRef={(ref) => addPlusRef(ref, index)} animationData={plus} loop={false} autoplay={false} style={{ width: 30 }} />
              </div> */}
              <div className='slideIcon1'>
                <Lottie
                  className='slideLottie'
                  lottieRef={ref => addPlusRef(ref, index)}
                  animationData={enlarge}
                  loop={1}
                  autoplay={false}
                />
              </div>
              <div className='slideCtrl' style={{ display: "none" }}>
                <span className='prevSlide' onClick={() => handleButtonClick("prev")}>
                  🡐
                </span>
                <span className='nextSlide' onClick={() => handleButtonClick("next")}>
                  🡒
                </span>
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
    component: Pool, // This refers to your <Pool /> component
    type: "Experiences",
  },
  {
    name: "Griddy",
    description:
      "Welcome to the grid, where sharp lines and bold edges create a world of control and precision. 'Griddy' is a showcase of structure and clarity, balancing creativity with order. It’s the perfect way to demonstrate how organized chaos can form something beautifully intricate.",
    component: Griddy, // This refers to your <Griddy /> component
    type: "3D Animations",
  },
];

const AbtCanvas = () => {
  const abtCanvas = useRef();

  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const activeScene = scenesData[activeSceneIndex];

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

  const handleWheel = contextSafe(e => {
    if (scrollTimeout.current) return; // Ignore event if throttle is active

    scrollTimeout.current = setTimeout(() => {
      scrollTimeout.current = null; // Reset throttle after 1s
    }, 600);

    randomizeWords();

    // Fade up/down animations depending on scroll direction
    const direction = e.deltaY > 0 ? 1 : -1;

    gsap.fromTo(
      ".Lword",
      {
        y: direction * 5,
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
        y: -direction * 5,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.25,
      }
    );

    // Blurring the "type" part
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

    // transition effect for scene info

    gsap.fromTo(".sceneInfo", { opacity: 0 }, { opacity: 1, duration: 0.5 });

    if (e.deltaY > 0) {
      setActiveSceneIndex(prevIndex => (prevIndex + 1) % scenesData.length); // Next scene
    } else {
      setActiveSceneIndex(prevIndex => (prevIndex === 0 ? scenesData.length - 1 : prevIndex - 1)); // Previous scene
    }
  });

  useEffect(() => {
    gsap.fromTo(
      ".canv",
      { opacity: 0 }, // Fade in new scene
      { opacity: 1, duration: 0.5 }
    );
  }, [activeSceneIndex]);

  return (
    <section className='abtCanvas' ref={abtCanvas} onWheel={handleWheel}>
      <span className='type'>
        <p>
          I <strong className='Lword'>{lWord}</strong> <em className='Rword'>{rWord}</em>{" "}
          <span className='type-word'>{activeScene.type}</span>
        </p>
      </span>
      <div className='canv'>{React.createElement(activeScene.component)}</div>
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
