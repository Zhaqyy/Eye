import React, { useRef } from "react";
import { Backdrop, Environment, Lightformer, OrbitControls, OrthographicCamera, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

const Piano = () => {
    // Randomize Lightformer Colors
    const randomizeColor = () => {
      const colors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff"];
      return colors[Math.floor(Math.random() * colors.length)];
    };
  
  return (
    <Canvas>
      <color attach='background' args={["#606060"]} />
      <OrthographicCamera makeDefault zoom={50} position={[0, 20, 5]} />
      <ambientLight intensity={1} />
      <pointLight intensity={10} position={[0, 5, 0]} />
      {/* <Environment resolution={32}>
          <group rotation={[-Math.PI / 4, -0.3, 0]}>
            <Lightformer intensity={1} rotation-x={Math.PI / 2} position={[0, 1, -5]} scale={[10, 10, 1]} color={randomizeColor()} />
            <Lightformer intensity={1} rotation-y={Math.PI / 2} position={[-5, -1, -1]} scale={[20, 2, 1]} color={randomizeColor()} />
            <Lightformer intensity={1} rotation-y={-Math.PI / 2} position={[5, 1, 0]} scale={[20, 2, 1]} color={randomizeColor()} />
            <Lightformer type='ring' intensity={2} color={randomizeColor()} rotation-y={Math.PI / 2} position={[-0.1, -1, -5]} scale={20} />
          </group>
        </Environment> */}
      {/* <mesh>
        <planeGeometry args={} />
        <meshStandardMaterial />
      </mesh> */}
      <Model />
      <OrbitControls />
    </Canvas>
  );
};

export default Piano;

export function Model(props) {
  const { nodes, materials } = useGLTF("/Model/piano.glb");
  return (
    <group {...props} dispose={null}>
      <mesh name='C' geometry={nodes.C.geometry} material={nodes.C.material} />
      <mesh name='D' geometry={nodes.D.geometry} material={nodes.D.material} />
      <mesh name='E' geometry={nodes.E.geometry} material={nodes.E.material} />
      <mesh name='G' geometry={nodes.G.geometry} material={nodes.G.material} />
      <mesh name='ZA' geometry={nodes.ZA.geometry} material={nodes.ZA.material} />
      <mesh name='ZB' geometry={nodes.ZB.geometry} material={nodes.ZB.material} />
      <mesh name='F' geometry={nodes.F.geometry} material={nodes.F.material} />
    </group>
  );
}

useGLTF.preload("/Model/piano.glb");
