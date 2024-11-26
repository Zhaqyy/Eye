import React, { useEffect, useRef } from "react";
import Word from "../Component/SplitWord";
import "../Style/Home.css";
import { projectData } from "../Component/ProjectData";
import Breadcrumbs from "../Component/Breadcrumbs";
import { useSoundEffects } from "../Component/SoundEffects";
import { Link } from "react-router-dom";
import gsap from "gsap";

function Home({ activeIndex, setActiveIndex }) {
  const homeRef = useRef();
  const containerRef = useRef(null);

  const { toggleMute } = useSoundEffects();

  useEffect(() => {
    const context = gsap.context(() => {
      const tl = gsap.timeline();

      tl.add(animateHome(homeRef));
      tl.add(animateHomeFoot(containerRef), "-=90%");

    }, homeRef);

    return () => context.revert(); // Cleanup on unmount
  }, []);

  return (
    <section className='hero' ref={homeRef}>
      <div className='main-hero'>

        
        <div className='detail'>
          <div className='name'>
            <h1>Shuaib Abdulrazaq</h1>
            <h2>Creative Developer</h2>
          </div>
          <div className='project'>
            <h3>Selected Project</h3>
            <ul>
              {projectData.map((item, index) => (
                <li key={index} className={index === activeIndex ? "active" : ""}>
                  <a
                    onClick={e => {
                      e.preventDefault();
                      setActiveIndex(index); // Update activeIndex on click
                    }}
                  >
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <h5>Available for Project/Freelance</h5>
        </div>
      </div>

      <div className='titleMobile'>
        {/* Previous button */}
        <span
          id='ctrlBtn'
          className={"titleCtrl"}
          onClick={e => {
            e.preventDefault();
            setActiveIndex(prevIndex => (prevIndex - 1 + projectData.length) % projectData.length); // Decrement index with wrap-around
          }}
        >
          ⥒
        </span>

        <Link to={`/Project/${projectData[activeIndex].id}`}>{projectData[activeIndex].title}</Link>

        {/* Next button */}
        <span
          id='ctrlBtn'
          className={"titleCtrl"}
          onClick={e => {
            e.preventDefault();
            setActiveIndex(prevIndex => (prevIndex + 1) % projectData.length); // Increment index with wrap-around
          }}
        >
          ⥓
        </span>
      </div>

      <div className='hero-footer' ref={containerRef}>
        <button onClick={toggleMute} className='sound'>
          <span>S</span>
        </button>
        <Breadcrumbs activeIndex={activeIndex} setActiveIndex={setActiveIndex} ref={containerRef} />
        <ul className='contact'>
          <li>
          <Word word={"LinkedIn"} url="https://www.linkedin.com/in/abdulrazaq-shuaib-72a827263/" />
          </li>
          <li>
          <Word word={"Codepen"} url="https://codepen.io/zhaqyy"/>
          </li>
          <li>
          <Word word={"Email"} url="mailto:zaqrashyy7@gmail.com" />
          </li>
        </ul>
      </div>
    </section>
  );
}

export default Home;


// Animation function
export const animateHome = homeRef => {
  const tl = gsap.timeline();

  // Staggered clipPath animation for h1 elements
  tl.fromTo(
    homeRef.current.querySelector(".main-hero .name h1"),
    { clipPath: "inset(0 0 100% 0)",autoAlpha:0 },
    {
      clipPath: "inset(0 0 0% 0)",
      autoAlpha:1,
      duration: 1.5,
      ease: "expo.in",
    }
  );
  tl.fromTo(
    homeRef.current.querySelector(".main-hero .name h2"),
    { clipPath: "inset(0 0 100% 0)",autoAlpha:0 },
    {
      clipPath: "inset(0 0 0% 0)",
      autoAlpha:1,
      duration: 1.5,
      ease: "expo.in",
    },
    '-=1'
  );

  tl.fromTo(
    homeRef.current.querySelector(".main-hero .project h3"),
    { autoAlpha: 0 },
    {
      autoAlpha: 1,
      duration: 0.5,
      ease: "expo.out",
    },
    ">"
  );

  tl.fromTo(
    homeRef.current.querySelectorAll(".main-hero .project li"),
    { autoAlpha: 0 },
    {
      autoAlpha: 1,
      stagger: 0.25,
      duration: 1,
      ease: "expo.out",
    },
    ">"
  );
  tl.fromTo(
    homeRef.current.querySelector(".main-hero .detail h5"),
    { clipPath: "inset(0 100% 0 0)",autoAlpha:0 },
    {
      clipPath: "inset(0 0% 0 0)",
      autoAlpha: 1,
      duration: 1,
      ease: "expo.out",
    },
    ">"
  );



  return tl;
};
export const animateHomeFoot = containerRef => {
  const tl = gsap.timeline();

  tl.fromTo(
    containerRef.current.querySelector(".sound"),
    { autoAlpha: 0 },
    {
      autoAlpha: 1,
      duration: 0.5,
      ease: "expo.out",
    },
  );

  tl.fromTo(
    containerRef.current.querySelectorAll(".bCrumb li"),
    { autoAlpha: 0 },
    {
      autoAlpha: 1,
      stagger: 0.25,
      duration: 1,
      ease: "expo.out",
    },
    ">"
  );

  tl.fromTo(
    containerRef.current.querySelectorAll(".contact li"),
    { clipPath: "inset(0 100% 0 0)",autoAlpha:0 },
    {
      clipPath: "inset(0 0% 0 0)",
      autoAlpha: 1,
      stagger: 0.25,
      duration: 1,
      ease: "expo.out",
    },
    ">"
  );



  return tl;
};