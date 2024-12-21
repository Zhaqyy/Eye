import { Center, Html, OrbitControls, Text, View, useTexture } from "@react-three/drei";
import { Canvas, extend, useFrame } from "@react-three/fiber";
import React, { useRef } from "react";
import * as THREE from "three";
import { easing } from "maath";
import { Perf } from "r3f-perf";
import Lottie from "lottie-react";
import gsap from "gsap";
import "../../Style/Component.css";
import luxo from "../../Component/Lottie/luxo.json";

const ContactCard = () => {
  const lottieRef = useRef();
  return (
    <Canvas
      camera={{ position: [0, 0, 15] }}
      // eventSource={document.getElementById('show')}
    >
      <ambientLight intensity={1} />
      <Perf
        position='top-right'
        // minimal={true}
      />
      {/* <View.Port /> */}
      <Rig />
      <Banner scale={[9, 3, 3]} position={[0, -3, 0]} rotation={[Math.PI * 0.15, 0, 0]} />
      <Html center position={[0, 0, 0]} transform occlude='blending'>
        <section className='contactCard'>
          <div className='contCanv'>
            <Lottie lottieRef={lottieRef} animationData={luxo} />
          </div>
          <div className='contDetail'>
            <h2>You can find me Here!</h2>
            <div className='header radialMenu'>
              <ul
                className='menu'
                // ref={navRef} onClick={toggleMenu} onMouseEnter={handleHeaderHover} onMouseLeave={handleHeaderLeave}
              >
                <li className='menu-item'>
                  <div>1</div>
                </li>
                <li className='menu-item'>
                  <div>1</div>
                </li>
                <li className='menu-item'>
                  <div>1</div>
                </li>
                <li className='menu-item'>
                  <div>1</div>
                </li>
                <li className='menu-item'>
                  <div>1</div>
                </li>
                <li className='menu-item'>
                  <div>1</div>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </Html>
      {/* <OrbitControls /> */}
    </Canvas>
  );
};

export default ContactCard;

function Rig(props) {
  const ref = useRef();
  // const scroll = useScroll()
  useFrame((state, delta) => {
    // ref.current.rotation.y = (Math.PI * 2) // Rotate contents
    state.events.update(); // Raycasts every frame rather than on pointer-move
    easing.damp3(state.camera.position, [-state.pointer.x * 0.5, state.pointer.y + 1, 15], 0.95, delta); // Move camera
    state.camera.lookAt(0, 0, 0); // Look at center
  });
  return <group ref={ref} {...props} />;
}

function Banner(props) {
  const ref = useRef();
  const texture = useTexture("/Texture/text.png");
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  useFrame((state, delta) => {
    ref.current.material.time.value += 0.005;
    ref.current.material.map.offset.x += delta / 4;
  });
  return (
    <mesh ref={ref} {...props}>
      <cylinderGeometry args={[1.6, 1.6, 0.35, 128, 16, true]} />
      <meshSineMaterial map={texture} map-anisotropy={16} map-repeat={[10, 1]} side={THREE.DoubleSide} toneMapped={false} />
    </mesh>
  );
}

class MeshSineMaterial extends THREE.MeshBasicMaterial {
  constructor(parameters = {}) {
    super(parameters);
    this.setValues(parameters);
    this.time = { value: 0 };
  }
  onBeforeCompile(shader) {
    shader.uniforms.time = this.time;
    shader.vertexShader = `
      uniform float time;
      ${shader.vertexShader}
    `;
    shader.vertexShader = shader.vertexShader.replace(
      "#include <begin_vertex>",
      `vec3 transformed = vec3(position.x, position.y + sin(time + uv.x * PI * 4.0) / 1.0, position.z);`
    );
  }
}

extend({ MeshSineMaterial });
