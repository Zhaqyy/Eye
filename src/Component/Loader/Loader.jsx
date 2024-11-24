import React, { useState, useLayoutEffect } from "react";
import gsap from "gsap";
import Intro from "./Intro";

// const Loader = ({ children }) => {
//   const [loaderFinished, setLoaderFinished] = useState(false);
//   const [timeline, setTimeline] = useState(null);

//   useLayoutEffect(() => {
//     const context = gsap.context(() => {
//       const tl = gsap.timeline({
//         onComplete: () => setLoaderFinished(true), // Trigger completion
//       });
//       setTimeline(tl); // Pass timeline to the Intro component
//     });

//     return () => context.revert(); // Cleanup on unmount
//   }, []);

//   return (
//     <main>
//       {!loaderFinished ? (
//         <Intro timeline={timeline} /> // Show loader animation
//       ) : (
//         children // Show page content after loader
//       )}
//     </main>
//   );
// };

const Loader = ({ onComplete }) => {
  const [timeline, setTimeline] = useState(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          onComplete(); // Notify parent when the loader finishes
        },
      });
      setTimeline(tl);
    });

    return () => ctx.revert(); // Cleanup
  }, [onComplete]);

  return <Intro timeline={timeline} />;
};


export default Loader;
