import React, { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { projectData } from "../Component/ProjectData";
import "../Style/Work.css";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Draggable } from "gsap/Draggable";
import useIsMobile from "../Component/isMobile";
import { animateImage, animateImageIn, animateWork } from "../Component/PageAnimations";

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
  const textRef = useRef(null);

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
    setTimeout(() => {

      window.scroll({ top: -1, left: 0, behavior: "smooth" });
  
  }, 10);  // Scroll back to the top on routing
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
      const textElement = textRef.current;
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
            clamp = gsap.utils.clamp(-20, 20),
            vel = isMobile ? -250 : -850; // limit the skew range
          // Scroll velocity-based skew effect
          ScrollTrigger.create({
            onUpdate: self => {
              let skew = clamp(self.getVelocity() / vel);
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
              if (this.hitTest(hit.current, "0%")) {
                // Snap to the hit element's X position
                return gsap.getProperty(hit.current, "x");
              }
              return endX; // Otherwise, snap back to original position
            },
          },
          onDrag: function () {
            // Calculate the percentage of drag completion
            const progress = this.x / this.maxX + 0.2;
            console.log(progress);
            // Update the mask gradient dynamically
            const gradientPosition = Math.min(100, progress * 100); // Clamp to 100%
            textElement.style.maskImage = `linear-gradient(to right, transparent ${gradientPosition}%, black ${gradientPosition + 10}%)`;
            textElement.style.webkitMaskImage = `linear-gradient(to right, transparent ${gradientPosition}%, black ${
              gradientPosition + 10
            }%)`;
            if (progress > 0.9) {
              hit.current.style.opacity = 1;
            } else {
              hit.current.style.opacity = 0;
            }
          },
          onDragEnd: function () {
            if (this.hitTest(hit.current, "0%")) {
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
              textElement.style.maskImage = `none`;
              textElement.style.webkitMaskImage = `none`;

              hit.current.style.opacity = 0;
            }
          },
          onPress: () => {
            gsap.to(drag.current, { duration: 0.1, scale: 0.95 });
            // gsap.to(dragBounds.current, { duration: 0.1, boxShadow: "inset 8px 8px 16px #debcab, inset -8px -8px 16px #ffdcc9" });
          },
          onRelease: () => {
            gsap.to(drag.current, { duration: 0.25, scale: 1, ease: "elastic.out(.5, .15)" });
            // gsap.to(dragBounds.current, { duration: 0.1, boxShadow:'inherit' });
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
      const tl = gsap.timeline({ delay: 1 });

      // Animate work section
      tl.add(animateWork(workRef));

      // Animate images with staggered timeline
      tl.add(animateImageIn(imageWrapRefs), "<");
      tl.add(animateImage(imageWrapRefs), "-=1");
    }, workRef);

    return () => context.revert(); // Cleanup on unmount
  }, []);

  if (!data) {
    return null;
  }
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
            <div className='desc'>{data?.detail}</div>
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
              
              {/* <Word url={data?.url} word={'Live View'} /> */}
              <Link to={data?.url} target='_blank' rel='noopener noreferrer'><span></span>
                Live View
              </Link>
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section className='gallery' ref={containerRef}>
          {data?.gallery?.map((media, index) => {
            const isVideo = /\.(mp4|webm|ogg)$/i.test(media);

            // Get the preceding image as a poster, or fallback to the default poster from data
            const poster =
              isVideo &&
              (index > 0 && /\.(jpg|jpeg|png|gif|webp)$/i.test(data?.gallery[index - 1]) ? data?.gallery[index - 1] : data?.poster || "");

            // Set preload attribute based on whether the video is the first in the gallery
            const preload = index === 0 && isVideo ? "auto" : "none";

            return (
              <span className='imgWrap' key={index} ref={el => (imageWrapRefs.current[index] = el)}>
                {isVideo ? (
                  // Render video tag for video files
                  <video
                    className='media-slide'
                    autoPlay
                    loop
                    muted
                    preload={preload}
                    poster={poster}
                    ref={el => (imageRefs.current[index] = el)}
                  >
                    <source src={media} type={`video/${media.split(".").pop()}`} />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  // Render image tag for image files
                  <img
                    src={media}
                    className='media-slide'
                    alt={`${data?.title} Slide ${index}`}
                    ref={el => (imageRefs.current[index] = el)}
                  />
                )}
              </span>
            );
          })}

          <div className='next'>
            <div className='pTitle'>
              <p>Next Project</p>
              <h2>{nextProject?.title}</h2>
            </div>
            <div ref={dragBounds} className='dragBounds'>
              <div ref={drag} className='drag'></div>
              <p ref={textRef} className='placeholder'>
                {" "}
                &gt;&gt; Slide For Next page{" "}
              </p>
              <div ref={hit} className='hit'>
                ➤
              </div>
            </div>
            <img src={nextProject?.image} className='nextProjImg' alt={`project ${nextProject?.title}`} />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Work;
