import React, { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import "../Style/About.css";
import Griddy from "../Scene/Grid";

const data = [
    {
      title: "Services",
      content: <ul><li>Web Development</li><li>Mobile Apps</li><li>Cloud Solutions</li></ul>,
    },
    {
      title: "Tools",
      content: <p>We use cutting-edge tools like React, GSAP, and more for building dynamic applications.</p>,
    },
    {
      title: "Awards",
      content: <div><h4>Best Design 2023</h4><p>Awarded for exceptional UI/UX design in global competition.</p></div>,
    },
    {
      title: "Contact",
      content: <p>Contact us via email at contact@example.com or follow us on social media.</p>,
    },
  ];

const About = () => {
    const slides = useRef([]);
    const [activeIndex, setActiveIndex] = useState(0);
  
    const addSlideRef = (el, index) => {
      slides.current[index] = el;
    };
  
    const animateSlides = (index) => {
      slides.current.forEach((slide, i) => {
        if (i === index) {
          // Active slide with squash/stretch effect
          gsap.to(slide, {
            width: 300,
            height: 320, // Slight increase in height for bounce
            duration: 0.6,
            ease: "elastic.out(1, 0.5)", // Adding bounce effect
          });
        } else {
          // Inactive slides shrink
          gsap.to(slide, {
            width: 100,
            height: 300,
            duration: 0.6,
            ease: "elastic.out(1, 0.5)",
          });
        }
      });
    };
  
    // Wheel event for switching slides
    const handleWheel = (e) => {
      if (e.deltaY > 0) {
        setActiveIndex((prev) => (prev + 1) % data.length);
      } else {
        setActiveIndex((prev) => (prev - 1 + data.length) % data.length);
      }
    };
  
    useEffect(() => {
      animateSlides(activeIndex);
    }, [activeIndex]);
  
  return (
    <div className="abt">
    <section className="abtInfo" onWheel={handleWheel}>
      <div className='abtHeader'>
        <div className='abtTitle'>
            <h1>Shuaib</h1>
            <h5>Creative Developer</h5>
            <h1>Abdulrazaq</h1>
        </div>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam optio qui voluptas iusto? Obcaecati delectus ipsam, excepturi a ea suscipit autem voluptatum tempore, incidunt et veritatis eius dolor sit minima.</p>
      </div>
      {/* <div className='detail'>
        <div>
          <h3>Creative Developer</h3>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam optio qui voluptas iusto? Obcaecati delectus ipsam, excepturi a ea suscipit autem voluptatum tempore, incidunt et veritatis eius dolor sit minima.</p>
        </div>
        <div>
            <h3>Services</h3>
            <ul>
                <li>Frontend Development</li>
                <li>No or Low-Code website Development</li>
                <li>3d Creative Development</li>
                <li>Web Design, Interaction and Experience Development</li>
            </ul>
        </div>
      </div> */}
      {/* <div className='infoSlider'>
        <div className="slide active">
            <h3>Services</h3>
        </div>
        <div className="slide">
            <h3>Tools</h3>
        </div>
        <div className="slide">
            <h3>Awards</h3>
        </div>
        <div className="slide">
            <h3>Contact</h3>
        </div>
      </div> */}
       <div className="infoSlider" >
       {data.map((item, index) => (
        <div
          className={`slide ${activeIndex === index ? "active" : ""}`}
          ref={(el) => addSlideRef(el, index)}
          onClick={() => setActiveIndex(index)}
          key={index}
        >
          <h3>{item.title}</h3>
          <div className="content">{activeIndex === index && item.content}</div>
        </div>
      ))}
      </div>
    </section>
    <section className="abtCanvas">
    <Griddy/>
    </section>
    </div>
  );
};

export default About;
