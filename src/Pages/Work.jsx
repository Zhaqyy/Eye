import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { projectData } from "../Component/ProjectData";
import "../Style/Work.css";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";

gsap.registerPlugin(ScrollTrigger);

const Work = () => {
  const params = useParams();
  const id = params.id;
  const data = projectData.find(work => work.id === parseInt(id));

  // Refs to work and service section, and gallery images
  const workRef = useRef(null);
  const serviceRef = useRef(null);
  const imageRefs = useRef([]);

  if (!data) {
    return <h1>Work not found</h1>; // Handle case when any work is not found
  }

  useEffect(() => {
    const workElement = workRef.current;
    const serviceElement = serviceRef.current;
    const imgElements = imageRefs.current;

    // Main timeline for the whole sequence
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: workElement,
        start: "top top",
        end: "bottom bottom",
        pin: true, // Pin the work section on screen
        scrub: true, // Smooth animations linked with scrolling
        markers: true, // Debugging markers
        horizontal:true,
      },
    });

    // 2. Animate services out to the left and fade out
    tl.to(serviceElement, {
      x: -50,
      opacity: 0,
      duration: 1,
      ease: "power2.out",
      onComplete: () => {
        serviceElement.style.display = "none"; // Set display none on complete
      },
    });

    // 3. Rotate and shrink the work section
    tl.to(workElement, {
      rotationY: 360, // Full Y-axis rotation
      width: 300, // Shrink width to 300px
      duration: 2,
      ease: "power3.out",
    });

    // 4. Animate gallery images (rolling sequence)
    imgElements.forEach((img, index) => {
      gsap.fromTo(
        img,
        { scale: 0.8 }, // Initial scale (before entering the viewport)
        {
          scale: 1, // Scale up when entering viewport
          scrollTrigger: {
            trigger: img,
            start: "center center", // Start animation when image is in the center
            toggleActions: "play none none reverse",
            scrub: 1,
            horizontal:true,
          },
        }
      );

      // Rolling-out effect when scrolling out of view
      gsap.to(img, {
        scrollTrigger: {
          trigger: img,
          start: "center center", // Start rolling when the image starts leaving the viewport
          end: "bottom top", // End when it's completely out of view
          scrub: 1,
          horizontal:true,
        },
        rotationX: 45, // Rotate along the X-axis
        y: -100, // Translate upwards
        z: -200, // Move further away (depth effect)
        opacity: 0, // Fade out
        scale: 0.6, // Shrink to simulate moving away
        filter: "grayscale(100%)", // Apply grayscale
        duration: 2,
        ease: "power2.out",
      });
    });
  }, []);

  return (
    <div className="work-wrap" ref={workRef}>
      <section className="work">
        <div className="title">
          <h6>
            {data?.client} - {data?.year}
          </h6>
          <h1>{data?.title}</h1>
        </div>
        <div className="detail">
          <div className="desc">
            <p>{data?.detail}</p>
            <a href="#">Live View</a>
          </div>
          <div className="service" ref={serviceRef}>
            <div>
              <h4>Services</h4>
              <ul>
                {data?.role?.map((roleItem, index) => (
                  <li key={index}>
                    <p>{roleItem}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="stack">
              <h4>Stack/Tools</h4>
              <ul>
                {data?.stack?.map((stackItem, index) => (
                  <li key={index}>{stackItem}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section className="gallery">
        <div className="image-slider">
          {data?.gallery?.map((img, index) => (
            <img
              key={index}
              className="wImage"
              src={img}
              alt={`Work image ${index + 1}`}
              ref={el => (imageRefs.current[index] = el)} // Assign each image to the ref array
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Work;
