import React, { useEffect, useLayoutEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  const hit = useRef(null);
  const dragBounds = useRef(null);

  const navigate = useNavigate(); // To handle routing

  const nextProjectIndex = id % projectData.length || 0; // Circular logic for next project
  const nextProject = projectData[nextProjectIndex];

  // Reset draggable position when routing to a new page
  const resetDragPosition = () => {
    gsap.set(drag.current, { x: 0, scale: 1 });
  };

  const resetScrollPosition = () => {
    window.scrollTo(0, 0); // Scroll back to the top on routing
  };

  useGSAP(
    () => {
      // Pinning the `.work` section
      let st = ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        pin: workRef.current, // Pin the .work section
        pinSpacing: false, // Disable spacing when pinned
      });

      const slides = imageRefs.current;

      //  Scroll snapping and flip animation for each image
      slides.forEach((slide, index) => {
        // Create the scrolling animation with flip effect
        gsap.fromTo(
          slide,
          {
            scale: 1, // Start from normal scale
            // rotateX: 0,    // No initial rotation
            // y: 0,          // No initial Y movement
            // z: 0,          // No initial Z movement
            opacity: 1, // Fully visible
            filter: "grayscale(0%)", // No grayscale
          },
          {
            scale: 0.95, // Scale down as it scrolls out
            // rotateX: 90,   // Flip on the X-axis as it scrolls out
            // y: -100,       // Move up slightly
            // z: -200,       // Move away (depth)
            opacity: 0, // Fade out
            filter: "grayscale(100%)", // Turn grayscale as it fades
            ease: "power1.inOut",

            scrollTrigger: {
              trigger: slide,
              start: "top top",
              end: "bottom top",
              toggleActions: "restart pause reverse pause",
              scrub: true, // Scrubbing effect for smooth animation with scroll
              // snap: 1 / slides.length, // Snaps to each image
              // markers: true, // For debugging purposes
            },
          }
        );
      });

      // // Creating a scroll effect
      gsap.to(containerRef.current, {
        //for horizontal
        // xPercent: -100,
        yPercent: -100,
        ease: "none",
        scrollTrigger: {
          id: `gallery`,
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          toggleActions: "restart pause reverse pause",
          // pin: true,
          scrub: true,
          // snap: 1 / (slides.length + 1), // Snaps to each image
          // markers: true, // For debugging purposes
        },
      });

      const dragtoroute = Draggable.create(drag.current, {
        type: "x", // Only allow horizontal dragging
        bounds: dragBounds.current,
        edgeResistance: 1,
        lockAxis: true,
        // inertia: true,
        snap: {
          x: endX => {
            if (this.hitTest(hit.current, "50%")) {
              // Snap to the hit element's X position
              return gsap.getProperty(hit.current, "x");
            }
            return endX; // Otherwise, snap back to original position
          },
        },
        onDragEnd: function () {
          if (this.hitTest(hit.current, "50%")) {
            // Trigger routing if hit test is successful
            navigate(`/work/${nextProject.id}`);
            resetDragPosition();
            resetScrollPosition();
            // const gall = ScrollTrigger.getById("gallery");
            // if (gall) {
            //   gall.refresh();
            //   gall.kill({ reset: true });
            // } // Recalculate scroll positions
          } else {
            // Restore to original position on release if not snapped
            gsap.to(drag.current, {
              duration: 0.4,
              x: 0,
              y: 0,
              scale: 1,
              ease: "elastic.out(.45)",
            });
          }
        },
        onPress: () => {
          gsap.to(drag.current, { duration: 0.1, scale: 0.95 });
        },
      });

      return () => {
        st.kill();
        resetDragPosition();
        resetScrollPosition();
        dragtoroute[0].kill(); // Kill the Draggable instance
        // const gall = ScrollTrigger.getById("gallery");
        // if (gall) {
        //   gall.refresh();
        //   gall.kill({ reset: true });
        // }
      };
    },
    { dependencies: [nextProject, navigate], revertOnUpdate: true }
  );

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
          <div className="liveBtn">
            <span>⤏</span>
            <a href={data?.url}>Live View</a>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className='gallery' ref={containerRef}>
        {data?.gallery?.map((image, index) => (
          <img src={image} key={index} className='image-slide' alt={`Slide ${index}`} ref={el => (imageRefs.current[index] = el)} />
        ))}

        <div className='next'>
          <div className='pTitle'>
            <p>Next Project</p>
            <h2>{nextProject?.title}</h2>
          </div>
          <div ref={dragBounds} className='dragBounds'>
            <div ref={drag} className='drag'></div>
            <div ref={hit} className='hit'></div>
          </div>
          <img src={nextProject?.image} className='nextProjImg' alt={`project ${nextProject?.title}`} />
        </div>
      </section>
      {/* <VerticalGallery images={data?.gallery}/> */}
    </div>
  );
};

export default Work;
// useGSAP(() => {
// // Pinning the `.work` section
// let st = ScrollTrigger.create({
//   trigger: containerRef.current,
//   start: "top top",
//   end: "bottom bottom",
//   pin: workRef.current, // Pin the .work section
//   pinSpacing: false, // Disable spacing when pinned
// });

// const slides = imageRefs.current;

// //  Scroll snapping and flip animation for each image
// slides.forEach((slide, index) => {
//   // Create the scrolling animation with flip effect
//   gsap.fromTo(
//     slide,
//     {
//       // scale: 1,      // Start from normal scale
//       // rotateX: 0,    // No initial rotation
//       // y: 0,          // No initial Y movement
//       // z: 0,          // No initial Z movement
//       // opacity: 1,    // Fully visible
//       filter: "grayscale(0%)", // No grayscale
//     },
//     {
//       // scale: 0.8,    // Scale down as it scrolls out
//       // rotateX: 90,   // Flip on the X-axis as it scrolls out
//       // y: -100,       // Move up slightly
//       // z: -200,       // Move away (depth)
//       // opacity: 0,    // Fade out
//       filter: "grayscale(100%)", // Turn grayscale as it fades
//       ease: "power1.inOut",

//       scrollTrigger: {
//         trigger: slide,
//         start: "top top",
//         end: "bottom top",
//         toggleActions: "restart pause reverse pause",
//         scrub: true, // Scrubbing effect for smooth animation with scroll
//         // snap: 1 / slides.length, // Snaps to each image
//         // markers: true, // For debugging purposes
//       },
//     }
//   );
// });

// // Creating a scroll effect
// gsap.to(containerRef.current, {
//   x: -100,
//   ease: "none",
//   scrollTrigger: {
//     id: `gallery`,
//     trigger: containerRef.current,
//     start: "top top",
//     end: "bottom top",
//     toggleActions: "restart pause reverse pause",
//     pin: true,
//     scrub: true,
//     // snap: 1 / (slides.length + 1), // Snaps to each image
//     // markers: true, // For debugging purposes
//   },
// });

// const dragtoroute = Draggable.create(drag.current, {
//   type: "x", // Only allow horizontal dragging
//   bounds: dragBounds.current,
//   edgeResistance: 1,
//   lockAxis: true,
//   // inertia: true,
//   snap: {
//     x: endX => {
//       if (this.hitTest(hit.current, "50%")) {
//         // Snap to the hit element's X position
//         return gsap.getProperty(hit.current, "x");
//       }
//       return endX; // Otherwise, snap back to original position
//     },
//   },
//   onDragEnd: function () {
//     if (this.hitTest(hit.current, "50%")) {
//       // Trigger routing if hit test is successful
//       navigate(`/work/${nextProject.id}`);
//       const gall = ScrollTrigger.getById("gallery");
//       if (gall) {
//         gall.refresh();
//         gall.kill({ reset: true });
//       } // Recalculate scroll positions
//     } else {
//       // Restore to original position on release if not snapped
//       gsap.to(drag.current, {
//         duration: 0.4,
//         x: 0,
//         y: 0,
//         scale: 1,
//         ease: "elastic.out(.45)",
//       });
//     }
//   },
//   onPress: () => {
//     gsap.to(drag.current, { duration: 0.1, scale: 0.95 });
//   },
// });

// return () => {
//   st.kill();
//   const gall = ScrollTrigger.getById("gallery");
//   if (gall) {
//     gall.refresh();
//     gall.kill({ reset: true });
//   }
//   dragtoroute[0].kill(); // Kill the Draggable instance
// };
// }, [nextProject, navigate])

export const VerticalGallery = ({ images }) => {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const totalCards = images.length;

    // Define GSAP ScrollTrigger for snapping and animation
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: () => `+=${containerRef.current.offsetHeight}`, // adjust end dynamically
      snap: {
        snapTo: 1 / (totalCards - 1), // Snap to each card
        duration: 0.5,
        ease: "power1.inOut",
      },
      onUpdate: self => updateCards(self.progress),
    });

    // Function to dynamically adjust card height based on scroll
    const updateCards = progress => {
      const currentIndex = Math.round(progress * (totalCards - 1));

      // Animate the center card (current one) and the adjacent ones
      cardsRef.current.forEach((card, i) => {
        const distance = Math.abs(currentIndex - i); // Distance from the center

        if (distance === 0) {
          // Center card
          gsap.to(card, { height: "60vh", duration: 0.5 });
        } else if (distance === 1) {
          // Adjacent cards (before and after)
          gsap.to(card, { height: "10vh", duration: 0.5 });
        } else {
          // Other cards (invisible)
          gsap.to(card, { height: "0vh", duration: 0.5 });
        }
      });
    };
  }, [images]);

  return (
    <div className='gallery-container' ref={containerRef}>
      {/* {data?.gallery?.map((image, index) => (
          <img src={image} key={index} className='image-slide' alt={`Slide ${index}`} ref={el => (imageRefs.current[index] = el)} />
        ))} */}
      {images.map((image, index) => (
        <div key={index} className='gallery-card' ref={el => (cardsRef.current[index] = el)}>
          <img src={image} alt={`Gallery Image ${index}`} />
        </div>
      ))}
    </div>
  );
};
