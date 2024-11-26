import React, { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { projectData } from "../Component/ProjectData";
import "../Style/Work.css";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Draggable } from "gsap/Draggable";
import useIsMobile from "../Component/isMobile";
import Word from "../Component/SplitWord";

gsap.registerPlugin(ScrollTrigger, Draggable, useGSAP);

const Work = () => {
  const params = useParams();
  const id = params.id;
  const data = projectData.find(work => work.id === parseInt(id));

  // Refs to work and service section, and gallery images
  const workRef = useRef(null);
  const serviceRef = useRef(null);
  const imageRefs = useRef([]);
  const imageWrapRefs = useRef([]);
  const containerRef = useRef(null);
  const drag = useRef(null);
  const hit = useRef(null);
  const dragBounds = useRef(null);

  const navigate = useNavigate(); // To handle routing

  const nextProjectIndex = id % projectData.length || 0; // Circular logic for next project
  const nextProject = projectData[nextProjectIndex];

  const isMobile = useIsMobile();
  ScrollTrigger.defaults({ ignoreMobileResize: true });
  // Reset draggable position when routing to a new page
  const resetDragPosition = () => {
    gsap.set(drag.current, { x: 0, scale: 1 });
  };

  const resetScrollPosition = () => {
    window.scrollTo(0, 0); // Scroll back to the top on routing
  };

  const dragToRouteTransition = useCallback(() => {
    const timeline = gsap.timeline();
    timeline.to(workRef.current, {
      opacity: 0,
      duration: 0.5,
      ease: "power1.inOut",
    });
    timeline.call(() => {
      navigate(`/Project/${nextProject.id}`);
      resetScrollPosition(); // Recalculate scroll positions
    });
    return timeline;
  }, [navigate, nextProject]);

  useGSAP(
    () => {
      if (!containerRef.current || !drag.current || !hit.current || !workRef.current) {
        return;
      }
      const ctx = gsap.context(() => {
        let st;

        const slides = imageRefs.current;
        ScrollTrigger.normalizeScroll(true);
        // Apply scroll-triggered animation with enter and exit effects
        slides.forEach((slide, index) => {
          if (!slide) return;

          let proxy = { skew: 0 },
            skewSetter = gsap.quickSetter(slide, "skewY", "deg"), // fast setter
            clamp = gsap.utils.clamp(-20, 20); // limit the skew range
          // Scroll velocity-based skew effect
          ScrollTrigger.create({
            onUpdate: self => {
              let skew = clamp(self.getVelocity() / -250);
              if (Math.abs(skew) > Math.abs(proxy.skew)) {
                proxy.skew = skew;
                gsap.to(proxy, {
                  skew: 0,
                  duration: 0.1,
                  ease: "power4",
                  overwrite: true,
                  onUpdate: () => skewSetter(proxy.skew),
                });
              }
            },
          });
          // Animate on entering the viewport
          gsap.fromTo(
            slide,
            {
              scale: 0.9, // Smaller scale when out of view
              opacity: 0, // Invisible initially
              filter: "grayscale(100%)", // Fully grayscale
            },
            {
              scale: 1, // Scale up to normal
              opacity: 1, // Fade in
              filter: "grayscale(0%)", // Remove grayscale
              ease: "power1",
              duration: 0.25,
              scrollTrigger: {
                trigger: slide,
                start: "top bottom",
                end: "top 75%",
                toggleActions: "play none none reverse", // Rewind on exit
                scrub: true,
                // markers: true,
                invalidateOnRefresh: true,
              },
            }
          );

          // Animate on exiting the viewport
          gsap.fromTo(
            slide,
            {
              scale: 1, // Start at normal scale
              opacity: 1, // Fully visible
              filter: "grayscale(0%)", // No grayscale
            },
            {
              scale: 0.9, // Scale down
              opacity: 0, // Fade out
              filter: "grayscale(100%)", // Add grayscale
              ease: "power1",
              duration: 0.25,
              scrollTrigger: {
                trigger: slide,
                start: isMobile ? "40% 10%" : "50% 15%", // Start exit animation
                end: "bottom top", // Complete exit animation
                toggleActions: "play none none reverse", // Rewind on entry
                scrub: true,
                // markers: { startColor: "white", endColor: "blue" },
                invalidateOnRefresh: true,
              },
            }
          );
        });

        // Drag to route logic
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
              // navigate(`/Project/${nextProject.id}`);
              dragToRouteTransition();
              resetDragPosition();
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
          onRelease: () => {
            gsap.to(drag.current, { duration: 0.25, scale: 1, ease: "elastic.out(.5, .15)" });
          },
        });

        return () => {
          // Only kill ScrollTrigger if it exists
          if (st) st.kill();

          // Check and reset the draggable instance
          if (drag.current) resetDragPosition();
          if (containerRef.current) resetScrollPosition();

          // Ensure `dragtoroute` exists before calling `kill`
          if (dragtoroute && dragtoroute[0]) dragtoroute[0].kill();
        };
      }, containerRef);

      return () => ctx.revert();
    },
    { dependencies: [nextProject, navigate], revertOnUpdate: true }
  );

  useEffect(() => {
    const context = gsap.context(() => {
      const tl = gsap.timeline();

      // Animate work section
      tl.add(animateWork(workRef));

      // Animate images with staggered timeline
      tl.add(animateImageIn(imageWrapRefs), "<");
      tl.add(animateImage(imageWrapRefs), "-=1");
    }, workRef);

    return () => context.revert(); // Cleanup on unmount
  }, []);

  return (
    <div>
      <div className='work-wrap' ref={workRef}>
        <section className='work'>
          <div className='title'>
            <h6>
              {data?.client} - {data?.year}
            </h6>
            <h1 data-hidden>{data?.title}</h1>
          </div>
          <div className='detail'>
            <div className='desc'>
              <p>{data?.detail}</p>
            </div>
            <div className='service' ref={serviceRef}>
              <div className='serviceList'>
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
            <div className='liveBtn'>
              <span></span>
              {/* <Word url={data?.url} word={'Live View'} /> */}
              <Link to={data?.url}>Live View</Link>
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section className='gallery' ref={containerRef}>
          {data?.gallery?.map((image, index) => (
            <span className='imgWrap' key={index} ref={el => (imageWrapRefs.current[index] = el)}>
              <img src={image} className='image-slide' alt={`Slide ${index}`} ref={el => (imageRefs.current[index] = el)} />
            </span>
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
    </div>
  );
};

export default Work;

// Animation function
export const animateWork = workRef => {
  const tl = gsap.timeline();

  // ClipPath animation for h5 (from left to right)
  tl.fromTo(
    workRef.current.querySelector(".work .title h6"),
    { clipPath: "inset(0 100% 0 0)", autoAlpha: 0 },
    {
      clipPath: "inset(0 0% 0 0)",
      autoAlpha: 1,
      duration: 0.5,
      ease: "expo.in",
    }
  );

  // Staggered clipPath animation for h1 elements
  tl.fromTo(
    workRef.current.querySelectorAll(".work .title h1"),
    { clipPath: "inset(0 0 100% 0)", autoAlpha: 0 },
    {
      clipPath: "inset(0 0 0% 0)",
      autoAlpha: 1,
      duration: 1.5,
      stagger: 0.5,
      ease: "expo.out",
    },
    "+=0.25"
  );

  // Fade-in animation for paragraph
  tl.fromTo(
    workRef.current.querySelector(".work .detail p"),
    { autoAlpha: 0 },
    {
      autoAlpha: 1,
      duration: 1.5,
      ease: "expo.out",
    },
    "<"
  );

  tl.fromTo(
    workRef.current.querySelector(".work .serviceList"),
    { autoAlpha: 0, y: 10 },
    {
      autoAlpha: 1,
      y: 0,
      duration: 1.5,
      ease: "expo.out",
    },
    "<"
  );
  tl.fromTo(
    workRef.current.querySelector(".work .stack"),
    { autoAlpha: 0, y: 10 },
    {
      autoAlpha: 1,
      y: 0,
      duration: 1.5,
      ease: "expo.out",
    },
    "<"
  );

  tl.fromTo(
    workRef.current.querySelector(".work .liveBtn"),
    { autoAlpha: 0, y: 10, rotate: 5 },
    {
      autoAlpha: 1,
      y: 0,
      rotate: 0,
      duration: 1.5,
      ease: "expo.out",
    },
    "-=1"
  );

  return tl;
};

export const animateImageIn = imageWrapRefs => {
  const tl = gsap.timeline({
    defaults: {
      ease: "power1.out",
      duration: 0.5,
    },
  });

  imageWrapRefs.current.forEach((imageWrap, index) => {
    tl.fromTo(
      imageWrap,
      {
        autoAlpha: 0,
      },
      {
        autoAlpha: 1,
      }
    );
  });

  return tl;
};

export const animateImage = imageWrapRefs => {
  const tl = gsap.timeline({
    defaults: {
      ease: "sine.in",
    },
  });

  imageWrapRefs.current.forEach((imageWrap, index) => {
    tl.to(imageWrap, {
      "--opac": 0,
      duration:0.35
    })
    .fromTo(imageWrap, {
      filter: "blur(2px)",
      // filter: "grayscale(100%)",
    },
    {
      filter: "blur(0px)",
      // filter: "grayscale(0%)",
      duration:0.5
    },'<'
    )
    
  });

  return tl;
};

// export const VerticalGallery = ({ images }) => {
//   const containerRef = useRef(null);
//   const cardsRef = useRef([]);

//   useEffect(() => {
//     const totalCards = images.length;

//     // Define GSAP ScrollTrigger for snapping and animation
//     ScrollTrigger.create({
//       trigger: containerRef.current,
//       start: "top top",
//       end: () => `+=${containerRef.current.offsetHeight}`, // adjust end dynamically
//       snap: {
//         snapTo: 1 / (totalCards - 1), // Snap to each card
//         duration: 0.5,
//         ease: "power1.inOut",
//       },
//       onUpdate: self => updateCards(self.progress),
//     });

//     // Function to dynamically adjust card height based on scroll
//     const updateCards = progress => {
//       const currentIndex = Math.round(progress * (totalCards - 1));

//       // Animate the center card (current one) and the adjacent ones
//       cardsRef.current.forEach((card, i) => {
//         const distance = Math.abs(currentIndex - i); // Distance from the center

//         if (distance === 0) {
//           // Center card
//           gsap.to(card, { height: "60vh", duration: 0.5 });
//         } else if (distance === 1) {
//           // Adjacent cards (before and after)
//           gsap.to(card, { height: "10vh", duration: 0.5 });
//         } else {
//           // Other cards (invisible)
//           gsap.to(card, { height: "0vh", duration: 0.5 });
//         }
//       });
//     };
//   }, [images]);

//   return (
//     <div className='gallery-container' ref={containerRef}>
//       {/* {data?.gallery?.map((image, index) => (
//           <img src={image} key={index} className='image-slide' alt={`Slide ${index}`} ref={el => (imageRefs.current[index] = el)} />
//         ))} */}
//       {images.map((image, index) => (
//         <div key={index} className='gallery-card' ref={el => (cardsRef.current[index] = el)}>
//           <img src={image} alt={`Gallery Image ${index}`} />
//         </div>
//       ))}
//     </div>
//   );
// };
