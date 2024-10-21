import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React from "react";

const Pool = () => {
  return (
    <Canvas>
      <ambientLight intensity={1} />
      <mesh>
        <boxGeometry />
        <meshStandardMaterial />
      </mesh>
      {/* <OrbitControls /> */}
    </Canvas>
  );
};

export default Pool;
