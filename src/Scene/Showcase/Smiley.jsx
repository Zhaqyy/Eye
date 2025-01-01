import React, { useEffect, useState } from "react";
import { gsap } from "gsap";
// import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";

// gsap.registerPlugin(MorphSVGPlugin);

const Smiley = ({ size = 150 }) => {
  const [circleCount, setCircleCount] = useState([]);

  useEffect(() => {
    const updateGrid = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const cols = Math.floor(width / size);
      const rows = Math.floor(height / size);
      const totalCircles = cols * rows;
      // console.log(width, height, cols, rows);
      setCircleCount(Array.from({ length: totalCircles }, (_, index) => index));
    };

    updateGrid();
    window.addEventListener("resize", updateGrid);
    return () => window.removeEventListener("resize", updateGrid);
  }, [size]);

  const handleMouseEnter = e => {
    gsap.to(e.target, {
      // scale: 1,
      backgroundColor: "rgb(49, 145, 231)",
      boxShadow: "inset -25px -15px 40px rgba(0,0,0,.3)",
      backgroundImage: "linear-gradient(-45deg, rgba(255,255,220,.3) 0%, transparent 100%)",
      duration: 0.5,
      ease: "sine.inOut",
    });

    const svg = e.target.querySelector("#sad");
    if (!svg) return;

    gsap.to(svg, {
      duration: 0.5,
      attr: {
        d: `M29.062,9.086c0-4.797,3.904-8.701,8.703-8.701c4.797,0,8.701,3.903,8.701,8.701c0,1.381-1.119,2.5-2.5,2.5 s-2.5-1.119-2.5-2.5c0-2.041-1.66-3.701-3.701-3.701c-2.042,0-3.703,1.66-3.703,3.701c0,1.381-1.119,2.5-2.5,2.5 S29.062,10.466,29.062,9.086z M1.339,9.059c0-4.797,3.904-8.701,8.703-8.701c4.797,0,8.701,3.903,8.701,8.701 c0,1.381-1.119,2.5-2.5,2.5c-1.381,0-2.5-1.119-2.5-2.5c0-2.041-1.66-3.701-3.701-3.701c-2.042,0-3.703,1.66-3.703,3.701 c0,1.381-1.119,2.5-2.5,2.5S1.339,10.44,1.339,9.059z M0.23,31.41c-0.636-1.53,0.089-3.286,1.62-3.921 c0.376-0.156,0.766-0.23,1.15-0.23c1.176,0,2.292,0.696,2.771,1.851c2.777,6.685,9.655,11.004,17.523,11.004 c7.69,0,14.528-4.321,17.421-11.011c0.658-1.521,2.424-2.223,3.943-1.563c1.521,0.658,2.221,2.423,1.563,3.944 C42.38,40.37,33.38,46.112,23.294,46.112C12.993,46.113,3.94,40.342,0.23,31.41z`,
      },
      ease: "sine.inOut",
    });
  };

  const handleMouseMove = (e) => {
    const rect = e.target.getBoundingClientRect();
    const centerX = rect.left + rect.width / 4;
    const centerY = rect.top + rect.height / 4;

    const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
    gsap.to(e.target.querySelector("svg"), {
      rotationY: angle * -0.5, // Create a 3D look with CSS rotation
      rotationX: angle * 0.5,
      transformOrigin: "50% 50%",
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = e => {
    gsap.to(e.target, {
      // scale: 1,
      backgroundColor: "rgb(49, 145, 231)",
      // boxShadow: 'unset',
      // backgroundImage: 'unset',
      boxShadow: "inset -25px -15px 40px rgba(0,0,0,.0)",
      backgroundImage: "linear-gradient(-45deg, rgba(255,255,220,.0) 0%, transparent 100%)",
      duration: 0.5,
      ease: "sine.inOut",
    });

    const svg = e.target.querySelector("#sad");
    if (!svg) return;
    gsap.to(svg, {
      duration: 0.5,
      attr: {
        d: `M28.062,9.322c0-4.797,3.904-8.701,8.703-8.701c4.797,0,8.701,3.903,8.701,8.701c0,1.381-1.119,2.5-2.5,2.5 s-2.5-1.119-2.5-2.5c0-2.041-1.66-3.701-3.701-3.701c-2.042,0-3.703,1.66-3.703,3.701c0,1.381-1.119,2.5-2.5,2.5 S28.062,10.702,28.062,9.322z M0.339,9.295c0-4.797,3.904-8.701,8.703-8.701c4.797,0,8.701,3.903,8.701,8.701 c0,1.381-1.119,2.5-2.5,2.5c-1.381,0-2.5-1.119-2.5-2.5c0-2.041-1.66-3.701-3.701-3.701c-2.042,0-3.703,1.66-3.703,3.701 c0,1.381-1.119,2.5-2.5,2.5S0.339,10.676,0.339,9.295z M0.23,41.726c3.71-8.933,12.764-14.703,23.064-14.703 c10.084,0,19.084,5.742,22.927,14.63c0.658,1.521-0.041,3.286-1.563,3.943c-1.52,0.66-3.284-0.042-3.942-1.562 c-2.895-6.689-9.731-11.012-17.421-11.012c-7.868,0-14.747,4.319-17.523,11.004C5.292,45.18,4.175,45.875,3,45.875 c-0.384,0-0.773-0.073-1.15-0.229C0.319,45.012-0.406,43.256,0.23,41.726z`,
      },
      rotationX: 0,
      rotationY: 0,
      ease: "sine.inOut",
    });
  };
  
{/* <svg fill="#000000" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="150px" height="150px" viewBox="0 0 46.47 46.469" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M28.062,9.322c0-4.797,3.904-8.701,8.703-8.701c4.797,0,8.701,3.903,8.701,8.701c0,1.381-1.119,2.5-2.5,2.5 s-2.5-1.119-2.5-2.5c0-2.041-1.66-3.701-3.701-3.701c-2.042,0-3.703,1.66-3.703,3.701c0,1.381-1.119,2.5-2.5,2.5 S28.062,10.702,28.062,9.322z M0.339,9.295c0-4.797,3.904-8.701,8.703-8.701c4.797,0,8.701,3.903,8.701,8.701 c0,1.381-1.119,2.5-2.5,2.5c-1.381,0-2.5-1.119-2.5-2.5c0-2.041-1.66-3.701-3.701-3.701c-2.042,0-3.703,1.66-3.703,3.701 c0,1.381-1.119,2.5-2.5,2.5S0.339,10.676,0.339,9.295z M0.23,41.726c3.71-8.933,12.764-14.703,23.064-14.703 c10.084,0,19.084,5.742,22.927,14.63c0.658,1.521-0.041,3.286-1.563,3.943c-1.52,0.66-3.284-0.042-3.942-1.562 c-2.895-6.689-9.731-11.012-17.421-11.012c-7.868,0-14.747,4.319-17.523,11.004C5.292,45.18,4.175,45.875,3,45.875 c-0.384,0-0.773-0.073-1.15-0.229C0.319,45.012-0.406,43.256,0.23,41.726z"></path> </g> </g></svg> */}
  return (
    <section style={{ display: "grid", justifyContent: 'center', alignContent:'center', gridTemplateColumns: `repeat(auto-fill, ${size}px)` }}>
      {circleCount.map((_, index) => (
        <div
          key={index}
          className='circle'
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          // onMouseMove={handleMouseMove}
          style={{
            width: size,
            height: size,
            position: 'relative',
            borderRadius: "50%",
            background: "rgb(49, 145, 231)",
            margin: "auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <svg
            fill='#000000'
            version='1.1'
            id='smile'
            width='40%'
            height='40%'
            // viewBox='0 0 50.048 50.048'
            xmlSpace='preserve'
            style={{
              pointerEvents: 'none',
              transformOrigin: 'center',
            }}
          >
            {/* <g>
              <path
                d='M3.147,14.327h13.372c1.738,0,3.147-1.409,3.147-3.147c0-1.738-1.409-3.147-3.147-3.147H3.147C1.409,8.033,0,9.441,0,11.18
		C0,12.917,1.409,14.327,3.147,14.327z'
              />
              <path
                d='M38.529,14.328H51.9c1.738,0,3.147-1.409,3.147-3.147S53.639,8.034,51.9,8.034H38.529c-1.737,0-3.147,1.409-3.147,3.147
		S36.792,14.328,38.529,14.328z'
              />
              <path
                d='M4.919,43.538c0,1.921,1.558,3.478,3.479,3.478h38.258c1.922,0,3.479-1.557,3.479-3.478s-1.558-3.478-3.479-3.478H8.397
		C6.476,40.06,4.919,41.617,4.919,43.538z'
              />
            </g> */}
            <g>
	<path id='sad' d="M0.952,16.282c-1.212-1.133-1.274-3.033-0.142-4.246c1.132-1.213,3.018-1.291,4.247-0.143
		c3.251,3.053,6.589,0.242,6.959-0.088c1.105-0.99,2.741-1.012,3.867-0.119c0.133,0.104,0.259,0.223,0.376,0.354
		c1.106,1.236,1.001,3.135-0.235,4.242C13.36,18.667,6.816,21.767,0.952,16.282z M57.765,12.004
		c1.106,1.236,1.001,3.135-0.235,4.242c-2.663,2.385-9.208,5.484-15.071,0c-1.212-1.133-1.274-3.033-0.143-4.246
		s3.019-1.291,4.247-0.143c3.251,3.053,6.589,0.242,6.959-0.088c1.105-0.99,2.741-1.012,3.867-0.119
		C57.521,11.754,57.646,11.874,57.765,12.004z M53.279,43.301c0.658,1.521-0.041,3.287-1.562,3.945
		c-1.521,0.66-3.285-0.041-3.943-1.562c-2.894-6.689-9.73-11.013-17.422-11.013c-7.867,0-14.746,4.32-17.522,11.007
		c-0.479,1.151-1.596,1.85-2.771,1.85c-0.383,0-0.773-0.074-1.149-0.23c-1.53-0.637-2.255-2.393-1.62-3.922
		C11,34.443,20.053,28.672,30.353,28.672C40.438,28.672,49.438,34.414,53.279,43.301z"/>
</g>
          </svg>
          {/* <svg fill="#000000" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="150px" height="150px" viewBox="0 0 46.47 46.469" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M29.062,9.086c0-4.797,3.904-8.701,8.703-8.701c4.797,0,8.701,3.903,8.701,8.701c0,1.381-1.119,2.5-2.5,2.5 s-2.5-1.119-2.5-2.5c0-2.041-1.66-3.701-3.701-3.701c-2.042,0-3.703,1.66-3.703,3.701c0,1.381-1.119,2.5-2.5,2.5 S29.062,10.466,29.062,9.086z M1.339,9.059c0-4.797,3.904-8.701,8.703-8.701c4.797,0,8.701,3.903,8.701,8.701 c0,1.381-1.119,2.5-2.5,2.5c-1.381,0-2.5-1.119-2.5-2.5c0-2.041-1.66-3.701-3.701-3.701c-2.042,0-3.703,1.66-3.703,3.701 c0,1.381-1.119,2.5-2.5,2.5S1.339,10.44,1.339,9.059z M0.23,31.41c-0.636-1.53,0.089-3.286,1.62-3.921 c0.376-0.156,0.766-0.23,1.15-0.23c1.176,0,2.292,0.696,2.771,1.851c2.777,6.685,9.655,11.004,17.523,11.004 c7.69,0,14.528-4.321,17.421-11.011c0.658-1.521,2.424-2.223,3.943-1.563c1.521,0.658,2.221,2.423,1.563,3.944 C42.38,40.37,33.38,46.112,23.294,46.112C12.993,46.113,3.94,40.342,0.23,31.41z"></path> </g> </g></svg> */}
        </div>
      ))}
    </section>
  );
};

export default Smiley;
