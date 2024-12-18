import { Center, Html, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React from "react";
import "../../Style/Component.css";

const ContactCard = () => {
  return (
    // <Canvas>
    //   <ambientLight intensity={1} />
    //   {/* <mesh>
    //     <boxGeometry />
    //     <meshStandardMaterial />
    //   </mesh> */}
    //   <Center fillWidth>
    //     <Html position={[0, 0, 0]} style={{ pointerEvents: "none" }}>
    //       <div
    //         style={{
    //           width: "70vw",
    //           // height: "50vh",
    //           color: "#fff",
    //           backgroundColor: "#fff",
    //           padding: "10px",
    //           borderRadius: "24px",
    //           fontSize: "12px",
    //           whiteSpace: "nowrap",
    //           translate: '-50% -50%',
    //           aspectRatio: '2/1'
    //         }}
    //       ></div>
    //     </Html>
    //   </Center>
    //   {/* <OrbitControls /> */}
    // </Canvas>
    <section className='contactCard'>
      <div className='contCanv'></div>
      <div className='contDetail'>
        <h2>You can find me Here!</h2>
        <div className='header radialMenu'>
          <ul className='menu' 
          // ref={navRef} onClick={toggleMenu} onMouseEnter={handleHeaderHover} onMouseLeave={handleHeaderLeave}
          >
            <li className='menu-item'>
              <div>
               1
              </div>
            </li>
            <li className='menu-item'>
              <div>
               1
              </div>
            </li>
            <li className='menu-item'>
              <div>
               1
              </div>
            </li>
            {/* <li className='menu-item'>
              <div>
               1
              </div>
            </li>
            <li className='menu-item'>
              <div>
               1
              </div>
            </li> */}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default ContactCard;
