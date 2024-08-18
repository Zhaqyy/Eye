import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stats } from "@react-three/drei";
import Scene from "./Scene";


const App = () => {
  return (
    <Canvas camera={{ fov: 70, position: [0, 1, 5] }}>
      <color attach="background" args={['#050505']} />
      <fog attach="fog" args={['#050505', 5, 10]} />

      <OrbitControls />
      <Stats showPanel={0} className="stats" />
      <Scene />
    </Canvas>
  );
};

export default App;
