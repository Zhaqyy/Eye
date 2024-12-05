import React, { useRef } from "react";
import { Backdrop, OrbitControls, OrthographicCamera, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

const Piano = () => {
  return (
    <Canvas>
      <OrthographicCamera makeDefault zoom={50} position={[0, 20, 5]} />
      <ambientLight intensity={1} />

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
      <Backdrop
        floor={0.25} // Stretches the floor segment, 0.25 by default
        segments={20} // Mesh-resolution, 20 by default
      >
        <meshStandardMaterial color='#353540' />
      </Backdrop>
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
