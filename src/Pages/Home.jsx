import React from "react";
import Word from "../Component/SplitWord";
import "../Style/Home.css";
import { projectData } from "../Component/ProjectData";

function Home({ activeIndex, setActiveIndex }) {
  return (
    <section className='hero'>
      <div className='main-hero'>
        <nav className='nav'>
          <ul>
            <li className='nav-item'>
              <Word word={"Overview"} />
            </li>
            <li className='nav-item'>
              <Word word={"About"} />
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
                  {/* <a href={item.url='#'}>{item.title}</a> */}
                  <p
                    onClick={e => {
                      e.preventDefault();
                      setActiveIndex(index); // Update activeIndex on click
                    }}
                  >
                    {item.title}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <h5>Available for Work/Freelance</h5>
        </div>
      </div>
      <div className='hero-footer'>
        <span className='sound'>S</span>
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
