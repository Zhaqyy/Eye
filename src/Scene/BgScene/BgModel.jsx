import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";

export function BgModel(props) {
  const { nodes, materials } = useGLTF("/Model/f.glb");
  return (
    <group {...props} dispose={null}>
      <mesh castShadow receiveShadow geometry={nodes.support.geometry}>
        <meshPhongMaterial color={"#242424"} shininess={100} />
      </mesh>
    </group>
  );
}

useGLTF.preload("/Model/f.glb");
