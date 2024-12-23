import { Center, Grid, Html, OrbitControls, Text, View, useTexture } from "@react-three/drei";
import { Canvas, extend, useFrame } from "@react-three/fiber";
import React, { useRef } from "react";
import * as THREE from "three";
import { easing } from "maath";
import Lottie from "lottie-react";
import "../../Style/Component.css";
import luxo from "../../Component/Lottie/luxo.json";
import { Icon } from "../../Component/icon";
import useIsMobile from "../../Component/isMobile";

const ContactCard = () => {
  const lottieRef = useRef();
  const isMobile = useIsMobile(1000);
  const isSMobile = useIsMobile(800);

  return (
    <Canvas camera={{ position: [0, 0, isMobile ? 10 : 25], fov: 75 }}>
      {/* <color attach="background" args={['#867899']} /> */}
      <ambientLight intensity={1} />
      <Rig />
      <Grid
        position={[0, -9, -1]}
        rotation={[Math.PI / 2.5, 0, 0]}
        args={[10, 10]}
        cellColor='#B6D6F6'
        sectionColor='#867899'
        sectionSize={2.5}
        cellSize={0.5}
        sectionThickness={2}
        cellThickness={1}
        infiniteGrid
        fadeDistance={35}
        fadeStrength={1}
      />
      <Banner scale={isSMobile ? [10, 3, 3] : isMobile ? [8, 3, 3] : [15, 5, 5]} position={[0, -3, 0]} rotation={[Math.PI * 0.15, 0, 0]} />
      <Html position={[0, 0, 0]} distanceFactor={isSMobile ? 15 : null} transform occlude='blending'>
        <section className='contactCard'>
          <div className='contCanv'>
            <Lottie lottieRef={lottieRef} animationData={luxo} />
          </div>
          <div className='contDetail'>
            <h2>You can find me Here!</h2>
            <div className='header radialMenu'>
              <ul className='menu'>
                <li className='menu-item'>
                  <div>
                    <a href={"https://codepen.io/zhaqyy"} target='_blank' rel='noopener noreferrer'>
                      <Icon name={"codepen"} />
                    </a>
                  </div>
                </li>
                <li className='menu-item'>
                  <div>
                    <a href={"/"} target='_blank' rel='noopener noreferrer'>
                      <Icon name={"site"} />
                    </a>
                  </div>
                </li>
                <li className='menu-item'>
                  <div>
                    <a href={"https://x.com/Zharqyy"} target='_blank' rel='noopener noreferrer'>
                      <Icon name={"twitter"} />
                    </a>
                  </div>
                </li>
                <li className='menu-item'>
                  <div>
                    <a href={"https://github.com/Zhaqyy"} target='_blank' rel='noopener noreferrer'>
                      <Icon name={"github"} />
                    </a>
                  </div>
                </li>
                <li className='menu-item'>
                  <div>
                    <a href={"mailto:zaqrashyy7@gmail.com"} target='_blank' rel='noopener noreferrer'>
                      <Icon name={"email"} />
                    </a>
                  </div>
                </li>
                <li className='menu-item'>
                  <div>
                    <a href={"https://www.linkedin.com/in/abdulrazaq-shuaib-72a827263"} target='_blank' rel='noopener noreferrer'>
                      <Icon name={"linkedin"} />
                    </a>
                  </div>
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
  const isMobile = useIsMobile(1000);
  useFrame((state, delta) => {
    state.events.update(); // Raycasts every frame rather than on pointer-move
    easing.damp3(state.camera.position, [-state.pointer.x * 0.35, state.pointer.y + 0.5, isMobile ? 18 : 25], 0.95, delta); // Move camera
    state.camera.lookAt(0, 0, 0); // Look at center
  });
  return <group ref={ref} {...props} />;
}

function Banner(props) {
  const ref = useRef();
  const texture = useTexture("/Texture/cont.png");
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  useFrame((state, delta) => {
    ref.current.material.time.value += 0.005;
    ref.current.material.map.offset.x += delta / 4;
  });
  return (
    <mesh ref={ref} {...props}>
      <cylinderGeometry args={[1.6, 1.6, 0.35, 128, 16, true]} />
      <meshSineMaterial
        map={texture}
        map-anisotropy={16}
        map-repeat={[30, 1]}
        color={"#B6D6F6"}
        side={THREE.DoubleSide}
        toneMapped={false}
      />
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
