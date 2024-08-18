import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Box, Environment, OrbitControls } from "@react-three/drei";
import { Eye } from "./Eye";

const Scene = () => {

  return (
    <>
      <Eye/>
      <ambientLight />
      <Environment
            preset='city'
            environmentIntensity={0.5}
          />
    </>
  );
};

const App = () => {
  return (
    <Canvas camera={{ fov: 70, position: [0, 0, 3] }}>
      <OrbitControls />
      <Scene />
    </Canvas>
  );
};

export default App;
