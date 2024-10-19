import React, { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import "../Style/About.css";
import Griddy from "../Scene/Grid";
import { useGSAP } from "@gsap/react";

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
    content: <p>Contact us via email at contact@example.com or follow us on social media.</p>,
  },
];

const About = () => {
  const slides = useRef([]);
  const infoSlider = useRef();

  const addSlideRef = (el, index) => {
    slides.current[index] = el;
  };

  gsap.defaults({
    ease: "sine.inOut",
  });

  const activeIndex = useRef(0); 
  const previousIndex = useRef(0); // To track the previous active slide index

const animateSlides = (index) => {
  slides.current.forEach((slide, i) => {
    if (i === index) {
      // Active slide animation
      gsap.timeline()
        .to(slide.querySelector(".title"), {
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
      gsap.timeline()
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
          // onComplete: () => {
            
          // },
        })
       
    }
  });

  previousIndex.current = index; // Update previous index
};

useEffect(() => {
  animateSlides(activeIndex.current); 
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
    animateSlides(activeIndex.current); // Trigger animation
  }
});


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
      <h3 className='title'>{item.title}</h3>
      <div className='content'>{item.content}</div> 
    </div>
  ))}
        </div>
      </section>
      <section className='abtCanvas'>
        <Griddy />
      </section>
    </div>
  );
};


// const About = () => {
//   const slides = useRef([]);
//   const infoSlider = useRef();
//   // const [activeIndex, setActiveIndex] = useState(0);

//   const addSlideRef = (el, index) => {
//     slides.current[index] = el;
//   };

//   gsap.defaults({
//     ease: "sine.inOut",
//   });

//   // const animateSlides = index => {
//   //   slides.current.forEach((slide, i) => {
//   //     if (i === index) {
//   //       // Active slide with squash/stretch effect
//   //       gsap.to(slide, {
//   //         width: 300,
//   //         duration: 0.6,
//   //         ease: "elastic.out(0.5, 0.5)", // Adding bounce effect
//   //         // stagger: 0.95,
//   //         onComplete: () => {
//   //           gsap.to(slide.querySelector(".content"), {
//   //             //  display: 'block',
//   //             opacity: 1,
//   //             duration: 0.25,
//   //           });
//   //         },
//   //       });
//   //       gsap.fromTo(
//   //         slide.querySelector(".title"),
//   //         {
//   //           opacity: 0,
//   //           x: 0,
//   //           y: -10,
//   //         },
//   //         {
//   //           opacity: 1,
//   //           x: 0,
//   //           y: 0,
//   //           duration: 0.25,
//   //         }
//   //       );
//   //     } else {
//   //       // Inactive slides shrink
//   //       gsap.to(slide, {
//   //         width: 70,
//   //         duration: 0.6,
//   //         ease: "elastic.out(0.5, 0.5)",
//   //       });
//   //       gsap.to(slide.querySelector(".content"), {
//   //         // display: 'none',
//   //         opacity: 0,
//   //         duration: 0.25,
//   //       });
//   //     }
//   //   });
//   // };

//   // const { contextSafe } = useGSAP({ scope: infoSlider });

//   // Wheel event for switching slides
//   // const handleWheel = contextSafe(e => {
//   //   if (e.deltaY > 0) {
//   //     setActiveIndex(prev => (prev + 1) % data.length);
//   //   } else {
//   //     setActiveIndex(prev => (prev - 1 + data.length) % data.length);
//   //   }
//   // });

//   const activeIndex = useRef(0); // Use ref instead of useState

//   const animateSlides = (index) => {
//     slides.current.forEach((slide, i) => {
//       if (i === index) {
//         gsap
//       .timeline()

//       .to(slide.querySelector(".title"), {
//         opacity: 0,
//         x: -25,
//         duration: 0.25,
//         onComplete: () => {
//           gsap.to(slide, {
//             width: 300,
//             duration: 0.5,
//             ease: "elastic.out(0.5, 0.5)",
//             stagger: 0.2,
//             onComplete: () => {
//               gsap.set(slide.querySelector(".title"), {
//                 writingMode: "horizontal-tb",
//                 textOrientation: "initial",
//                 letterSpacing: 0,
//               });
//               gsap.fromTo(
//                 slide.querySelector(".title"),
//                 {
//                   opacity: 0,
//                   x: 0,
//                   y: -10,
//                   // duration: 0.4,
//                 },
//                 {
//                   opacity: 1,
//                   x: 0,
//                   y: 0,
//                   duration: 0.4,
//                 }
//               );
//               gsap.to(slide.querySelector(".content"), {
//                 opacity: 1,
//                 display: "block",
//                 duration: 0.5,
//                 stagger: 0.2,
//               });
//             },
//           });
//         },
//       });
//         // Active slide logic
//         // gsap.to(slide, {
//         //   width: 300,
//         //   duration: 0.6,
//         //   ease: "elastic.out(0.5, 0.5)",
//         //   onComplete: () => {
//         //     gsap.to(slide.querySelector(".content"), {
//         //       display: 'block',
//         //       opacity: 1,
//         //       duration: 0.25,
//         //     });
//         //   },
//         // });
//         // gsap.fromTo(
//         //   slide.querySelector(".title"),
//         //   { opacity: 0, x: 0, y: -10 },
//         //   { opacity: 1, x: 0, y: 0, duration: 0.25 }
//         // );
//       } else {
//         gsap
//         .timeline()
//         .to(slide.querySelector(".content"), {
//           opacity: 0,
//           display: "none",
//           duration: 0.25,
//         })

//         .set(slide.querySelector(".title"), {
//           opacity: 0,
//           // y: -50,
//           duration: 0.25,
//         })
//         .to(slide.querySelector(".title"), {
//           opacity: 0,
//           // y: -50,
//           duration: 0.25,

//           onComplete: () => {
//             gsap.set(slide.querySelector(".title"), {
//               writingMode: "vertical-rl",
//               textOrientation: "upright",
//               letterSpacing: -5,
//             });
//           },
//         })
//         .to(slide, {
//           width: 70,
//           duration: 0.25,
//           ease: "elastic.out(0.5, 0.5)",
//           onComplete: () => {
//             gsap.fromTo(
//               slide.querySelector(".title"),
//               {
//                 opacity: 0,
//                 x: 25,
//                 // y:0,
//                 // duration: 0.5,
//               },
//               {
//                 opacity: 1,
//                 x: 0,
//                 // y:0,
//                 duration: 0.15,
//               }
//             );
//           },
//         });
//         // Inactive slide logic
//         // gsap.to(slide, {
//         //   width: 70,
//         //   duration: 0.6,
//         //   ease: "elastic.out(0.5, 0.5)",
//         // });
//         // gsap.to(slide.querySelector(".content"), {
//         //   display: 'none',
//         //   opacity: 0,
//         //   duration: 0.25,
//         // });
//       }
//     });
//   };
  
//   // Replace the useEffect with direct animation call
//   useEffect(() => {
//     animateSlides(activeIndex.current); // Use ref instead of state
//   }, []); // Run only on component mount
  
//   const scrollTimeout = useRef(null);

// const handleWheel = (e) => {
//   if (scrollTimeout.current) return; // Ignore event if throttle is active

//   scrollTimeout.current = setTimeout(() => {
//     scrollTimeout.current = null; // Reset throttle after 0.25s
//   }, 700);

//   if (e.deltaY > 0) {
//     activeIndex.current = (activeIndex.current + 1) % data.length;
//   } else {
//     activeIndex.current = (activeIndex.current - 1 + data.length) % data.length;
//   }

//   animateSlides(activeIndex.current);
// };

//   useEffect(() => {
//     animateSlides(activeIndex);
//   }, [activeIndex]);

//   // useGSAP(
//   //   () => {
//   //     animateSlides(activeIndex);
//   //   },
//   //   { dependencies: [activeIndex], scope: infoSlider }
//   // );

//   return (
//     <div className='abt'>
//       <section className='abtInfo' ref={infoSlider} onWheel={handleWheel}>
//         <div className='abtHeader'>
//           <div className='abtTitle'>
//             <h1>Shuaib</h1>
//             <h5>Creative Developer</h5>
//             <h1>Abdulrazaq</h1>
//           </div>
//           <p>
//             Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam optio qui voluptas iusto? Obcaecati delectus ipsam, excepturi a
//             ea suscipit autem voluptatum tempore, incidunt et veritatis eius dolor sit minima.
//           </p>
//         </div>
//         {/* <div className='detail'>
//         <div>
//           <h3>Creative Developer</h3>
//           <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam optio qui voluptas iusto? Obcaecati delectus ipsam, excepturi a ea suscipit autem voluptatum tempore, incidunt et veritatis eius dolor sit minima.</p>
//         </div>
//         <div>
//             <h3>Services</h3>
//             <ul>
//                 <li>Frontend Development</li>
//                 <li>No or Low-Code website Development</li>
//                 <li>3d Creative Development</li>
//                 <li>Web Design, Interaction and Experience Development</li>
//             </ul>
//         </div>
//       </div> */}
//         <div className='infoSlider'>
//           {data.map((item, index) => (
//             <div
//               className={`slide ${activeIndex === index ? "active" : ""}`}
//               ref={el => addSlideRef(el, index)}
//               onClick={() => setActiveIndex(index)}
//               key={index}
//             >
//               <h3 className='title'>{item.title}</h3>
//               <div className='content'>{activeIndex === index && item.content}</div>
//             </div>
//           ))}
//         </div>
//       </section>
//       <section className='abtCanvas'>
//         <Griddy />
//       </section>
//     </div>
//   );
// };



// previous but with issue
// const About = () => {
//   const slides = useRef([]);
//   const infoSlider = useRef();
//   const currentSlide = useRef(null);
//   const previousSlide = useRef(null);

//   const addSlideRef = (el, index) => {
//     slides.current[index] = el;
//   };

//   const animateSlides = (newIndex, prevIndex) => {
//     const newSlide = slides.current[newIndex];
//     const prevSlide = slides.current[prevIndex];
//     gsap.defaults({
//       ease: "sine.inOut",
//     });
//     // Entrance animation for new active slide
//     gsap
//       .timeline()

//       .to(newSlide.querySelector(".title"), {
//         opacity: 0,
//         x: -25,
//         duration: 0.25,
//         onComplete: () => {
//           gsap.to(newSlide, {
//             width: 300,
//             duration: 0.5,
//             ease: "elastic.out(0.5, 0.5)",
//             stagger: 0.2,
//             onComplete: () => {
//               gsap.set(newSlide.querySelector(".title"), {
//                 writingMode: "horizontal-tb",
//                 textOrientation: "initial",
//                 letterSpacing: 0,
//               });
//               gsap.fromTo(
//                 newSlide.querySelector(".title"),
//                 {
//                   opacity: 0,
//                   x: 0,
//                   y: -10,
//                   // duration: 0.4,
//                 },
//                 {
//                   opacity: 1,
//                   x: 0,
//                   y: 0,
//                   duration: 0.4,
//                 }
//               );
//               gsap.to(newSlide.querySelector(".content"), {
//                 opacity: 1,
//                 display: "block",
//                 duration: 0.5,
//                 stagger: 0.2,
//               });
//             },
//           });
//         },
//       });

//     // Exit animation for previous slide
//     if (prevSlide) {
//       gsap
//         .timeline()
//         .to(prevSlide.querySelector(".content"), {
//           opacity: 0,
//           display: "none",
//           duration: 0.25,
//         })

//         .set(prevSlide.querySelector(".title"), {
//           opacity: 0,
//           // y: -50,
//           duration: 0.25,
//         })
//         .to(prevSlide.querySelector(".title"), {
//           opacity: 0,
//           // y: -50,
//           duration: 0.25,

//           onComplete: () => {
//             gsap.set(prevSlide.querySelector(".title"), {
//               writingMode: "vertical-rl",
//               textOrientation: "upright",
//               letterSpacing: -5,
//             });
//           },
//         })
//         .to(prevSlide, {
//           width: 70,
//           duration: 0.25,
//           ease: "elastic.out(0.5, 0.5)",
//           onComplete: () => {
//             gsap.fromTo(
//               prevSlide.querySelector(".title"),
//               {
//                 opacity: 0,
//                 x: 25,
//                 // y:0,
//                 // duration: 0.5,
//               },
//               {
//                 opacity: 1,
//                 x: 0,
//                 // y:0,
//                 duration: 0.15,
//               }
//             );
//           },
//         });
//     }

//     previousSlide.current = newSlide;
//   };
// //   useGSAP(
// //     (context, contextSafe) => {

// //     },
// //     { scope: infoSlider }
// // );
//   const { contextSafe } = useGSAP({ scope: infoSlider });
//   const scrollTimeout = useRef(null);
//   // Wheel event for switching slides
//   const handleWheel = contextSafe((e) => {
//     let newIndex = currentSlide.current;
//     if (scrollTimeout.current) return; // Ignore event if throttle is active

//   scrollTimeout.current = setTimeout(() => {
//     scrollTimeout.current = null; // Reset throttle after 0.25s
//   }, 1000);

//     if (e.deltaY > 0) {
//       newIndex = (newIndex + 1) % slides.current.length;
//     } else {
//       newIndex = (newIndex - 1 + slides.current.length) % slides.current.length;
//     }

//     animateSlides(newIndex, currentSlide.current);
//     currentSlide.current = newIndex;
//   });

//   useGSAP(() => {
//    // Initial slide animation
//    animateSlides(0, null); // Start with first slide active
//    currentSlide.current = 0;

//   }, {dependencies: [currentSlide], revertOnUpdate: true })

//   // useEffect(() => {
//   //   // Initial slide animation
//   //   animateSlides(0, null); // Start with first slide active
//   //   currentSlide.current = 0;
//   // }, []);

//   return (
//     <div className='abt'>
//       <section className='abtInfo' ref={infoSlider} onWheel={handleWheel}>
//         <div className='abtHeader'>
//           <div className='abtTitle'>
//             <h1>Shuaib</h1>
//             <h5>Creative Developer</h5>
//             <h1>Abdulrazaq</h1>
//           </div>
//           <p>Lorem ipsum dolor sit amet consectetur adipisicing elit...</p>
//         </div>
//         <div className='infoSlider'>
//           {data.map((item, index) => (
//             <div
//               className='slide'
//               ref={el => addSlideRef(el, index)}
//               onClick={() => animateSlides(index, currentSlide.current)}
//               key={index}
//             >
//               <h3 className='title'>{item.title}</h3>
//               <div className='content'>{item.content}</div>
//             </div>
//           ))}
//         </div>
//       </section>
//       <section className='abtCanvas'>
//         <Griddy />
//       </section>
//     </div>
//   );
// };

export default About;
