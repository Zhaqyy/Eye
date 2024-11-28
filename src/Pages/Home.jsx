import React, { useEffect, useRef } from "react";
import Word from "../Component/SplitWord";
import "../Style/Home.css";
import { projectData } from "../Component/ProjectData";
import Breadcrumbs from "../Component/Breadcrumbs";
import { useSoundEffects } from "../Component/SoundEffects";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { animateHome, animateHomeFoot } from "../Component/PageAnimations";

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
