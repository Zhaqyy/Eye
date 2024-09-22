import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { projectData } from "../Component/ProjectData";
import "../Style/Work.css";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Draggable } from "gsap/Draggable";

gsap.registerPlugin(ScrollTrigger, Draggable, useGSAP);

const Work = () => {
  const params = useParams();
  const id = params.id;
  const data = projectData.find(work => work.id === parseInt(id));

  // Refs to work and service section, and gallery images
  const workRef = useRef(null);
  const serviceRef = useRef(null);
  const imageRefs = useRef([]);
  const containerRef = useRef(null);
  const drag = useRef(null);
  const dragBounds = useRef(null);

  // useEffect(() => {
  //   const slides = imageRefs.current;

  //   // Pinning the `.work` section
  //   ScrollTrigger.create({
  //     trigger: containerRef.current,
  //     start: "top top",
  //     end: "bottom bottom",
  //     pin: workRef.current, // Pin the .work section
  //     pinSpacing: false,    // Disable spacing when pinned
  //   });

  //   // Scroll snapping and flip animation for each image
  //   slides.forEach((slide, index) => {
  //     // Create the scrolling animation with flip effect
  //     gsap.fromTo(slide,
  //       {
  //         scale: 1,      // Start from normal scale
  //         rotateX: 0,    // No initial rotation
  //         y: 0,          // No initial Y movement
  //         z: 0,          // No initial Z movement
  //         opacity: 1,    // Fully visible
  //         filter: "grayscale(0%)", // No grayscale
  //       },
  //       {
  //         // scale: 0.8,    // Scale down as it scrolls out
  //         // rotateX: 90,   // Flip on the X-axis as it scrolls out
  //         // y: -100,       // Move up slightly
  //         // z: -200,       // Move away (depth)
  //         // opacity: 0,    // Fade out
  //         filter: "grayscale(100%)", // Turn grayscale as it fades
  //         ease: "power1.inOut",
  //         // yPercent: -100 * (slides.length - 1), // Slide vertically by 100% for each image
  //         scrollTrigger: {
  //           trigger: slide,
  //           start: "top top",
  //           end: "bottom top",
  //           scrub: true,   // Scrubbing effect for smooth animation with scroll
  //           // snap: 1 / (slides.length - 1), // Snaps to each image
  //       markers: true, // For debugging purposes
  //         },
  //       }
  //     );
  //   });

  // }, []);

useGSAP(() => {
  const slides = imageRefs.current;

    // Pinning the `.work` section
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      pin: workRef.current, // Pin the .work section
      pinSpacing: false, // Disable spacing when pinned
    });

    // ScrollTrigger.create({
    //   // scroller: containerRef.current,
    //   trigger: slides,
    //   start: "top top",
    //   end: "bottom bottom",
    //   scrub: true,
    //     // snap: 1 / (slides.length - 1), // Snaps to each image
    //     markers: true, // For debugging purposes
    // });

    //  Scroll snapping and flip animation for each image
    slides.forEach((slide, index) => {
      // Create the scrolling animation with flip effect
      gsap.fromTo(
        slide,
        {
          // scale: 1,      // Start from normal scale
          // rotateX: 0,    // No initial rotation
          // y: 0,          // No initial Y movement
          // z: 0,          // No initial Z movement
          // opacity: 1,    // Fully visible
          filter: "grayscale(0%)", // No grayscale
        },
        {
          // scale: 0.8,    // Scale down as it scrolls out
          // rotateX: 90,   // Flip on the X-axis as it scrolls out
          // y: -100,       // Move up slightly
          // z: -200,       // Move away (depth)
          // opacity: 0,    // Fade out
          filter: "grayscale(100%)", // Turn grayscale as it fades
          ease: "power1.inOut",

          scrollTrigger: {
            trigger: slide,
            start: "top top",
            end: "bottom top",
            toggleActions: "restart pause reverse pause",
            scrub: true, // Scrubbing effect for smooth animation with scroll
            snap: 1 / slides.length, // Snaps to each image
            markers: true, // For debugging purposes
          },
        }
      );
    });

    // Creating a scroll effect
    gsap.to(containerRef.current, {
      yPercent: -100,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        pin: true,
        scrub: true,
        // snap: 1 / (slides.length + 1), // Snaps to each image
        markers: true, // For debugging purposes
      },
    });

  //   const xTo = gsap.quickTo(drag.current, "x", {duration: 0.5});
  //  let dragX = gsap.getProperty(drag.current, "x");

    Draggable.create(drag.current, {
      type: "x",
      trigger:drag.current,
      bounds: dragBounds,
      edgeResistance:1,
      // inertia: true,
      onDragEnd: function () {
        console.log("drag ended");
      },
      onPress:()=>{ // bring the item forward on press
        gsap.to(drag.current, {duration:0.1, scale:0.95})
      },
      // onThrowUpdate() {
      //   xTo(dragX);
      //        },
      onRelease:()=>{ // return the item on release
        gsap.to(drag.current, {duration:0.4, x:0, y:0, scale:1, ease:'elastic.out(.45)'})
      },
    });
}) 
  if (!data) {
    return <h1>Work not found</h1>; // Handle case when any work is not found
  }

  return (
    <div className='work-wrap' ref={workRef}>
      <section className='work'>
        <div className='title'>
          <h6>
            {data?.client} - {data?.year}
          </h6>
          <h1>{data?.title}</h1>
        </div>
        <div className='detail'>
          <div className='desc'>
            <p>{data?.detail}</p>
            <a href='#'>Live View</a>
          </div>
          <div className='service' ref={serviceRef}>
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
            <div className='stack'>
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

      {/* Gallery Section */}
      <section className='gallery-container' ref={containerRef}>
        {data?.gallery?.map((image, index) => (
          <img src={image} key={index} className='image-slide' alt={`Slide ${index}`} ref={el => (imageRefs.current[index] = el)} />
        ))}
        <div className='next'>
          <div>
            <p>Next Project</p>
            <h2>{data?.title}</h2>
          </div>
          <div ref={dragBounds} className='dragBounds'>
            <div ref={drag} className='drag'></div>
          </div>
          <img src={`${data?.image}`} className='nextProjImg' alt={`project ${data?.title}`} />
        </div>
      </section>
      {/* <section className="gallery">
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
      </section> */}
      {/* <VerticalGallery/> */}
    </div>
  );
};

export default Work;

// export const VerticalGallery = ({ images }) => {
//   const containerRef = useRef(null);
//   const imageRefs = useRef([]);

//   const params = useParams();
//   const id = params.id;
//   const data = projectData.find(work => work.id === parseInt(id));

//   useEffect(() => {
//     const slides = imageRefs.current;

//     // Creating a scroll snapping effect for each image
//     gsap.to(slides, {
//       yPercent: -100 * (slides.length - 1), // Slide vertically by 100% for each image
//       ease: "none",
//       scrollTrigger: {
//         trigger: containerRef.current,
//         start: "top top",
//         end: "bottom bottom", // Simulate an infinite scroll length
//         pin: true,
//         scrub: true,
//         snap: 1 / (slides.length - 1), // Snaps to each image
//         markers: true, // For debugging purposes
//       },
//     });
//   }, []);

//   return (
//     <div className="gallery-container" ref={containerRef}>
//       {data?.gallery?.map((image, index) => (
//           <img
//             src={image} key={index}
//             className="image-slide"
//             alt={`Slide ${index}`}
//             ref={(el) => (imageRefs.current[index] = el)}
//           />

//       ))}
//     </div>
//   );
// };
