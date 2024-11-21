import React, { useRef } from "react";
import Word from "../Component/SplitWord";
import "../Style/Home.css";
import { projectData } from "../Component/ProjectData";
import Breadcrumbs from "../Component/Breadcrumbs";
import { useSoundEffects } from "../Component/SoundEffects";
import { Link } from "react-router-dom";

function Home({ activeIndex, setActiveIndex }) {
  const containerRef = useRef(null);

  const { toggleMute } = useSoundEffects();
  return (
    <section className='hero'>
      <div className='main-hero'>
        <nav className='nav'>
          <ul>
            <li className='nav-item'>
              <Word word={"Overview"} url='/' />
            </li>
            <li className='nav-item'>
              <Word word={"About"} url='/About' />
            </li>
            <li className='nav-item'>
              <Word word={"Lab"} />
            </li>
          </ul>
        </nav>
        <div className='detail'>
          <div className='name'>
            <h1>Shuaib Abdulrazaq</h1>
            <h2>Creative Developer</h2>
          </div>
          <div className='project'>
            <h3>Project List</h3>
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
          <h5>Available for Work/Freelance</h5>
        </div>
      </div>

      <div className='titleMobile'>
        {/* Previous button */}
        <span
          className={"titleCtrl"}
          onClick={e => {
            e.preventDefault();
            setActiveIndex(prevIndex => (prevIndex - 1 + projectData.length) % projectData.length); // Decrement index with wrap-around
          }}
        >
          ⥒
        </span>

        <Link to={`/Work/${projectData[activeIndex].id}`}>{projectData[activeIndex].title}</Link>

        {/* Next button */}
        <span
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
            <a href='#'>LinkedIn</a>
          </li>
          <li>
            <a href='#'>Codepen</a>
          </li>
          <li>
            <a href='#'>Email</a>
          </li>
        </ul>
      </div>
    </section>
  );
}

export default Home;
