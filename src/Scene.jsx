import { Environment, MeshReflectorMaterial, useTexture } from "@react-three/drei";
import * as THREE from 'three'
import { Eye } from "./Eye";
import { useFrame } from "@react-three/fiber";
import { useState } from "react";

const Scene = () => {
  return (
    <>
      <Eye />
      <ambientLight intensity={2} />
      {/* <Environment preset='night' environmentIntensity={1.5} /> */}
      <Ground />
      {/* <Rig /> */}
    </>
  );
};
export default Scene;

function Ground() {
  const [floor, normal] = useTexture(["/Texture/si-col.webp", "/Texture/si-norm.webp"]);
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[10, 10]} />
      <MeshReflectorMaterial
        blur={[400, 100]}
        resolution={512}
        mixBlur={2}
        mixStrength={1.5}
        mirror={1}
        roughness={4}
        roughnessMap={floor}
        depthScale={1.2}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        // color="#050505"
        metalness={0}
        reflectorOffset={-0.2}
        normalMap={normal}
        normalScale={[3, 3]}
        fog
      />
    </mesh>
  );
}
function Rig() {

    const [vec] = useState(() => new THREE.Vector3())
     useFrame((state) => {
      state.camera.position.lerp(vec.set(state.pointer.x * 2, 2 + state.pointer.y * 2, 5), 0.01)
      state.camera.lookAt(0, 0, 0)
    })
  
}
