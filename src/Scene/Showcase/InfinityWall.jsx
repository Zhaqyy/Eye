import { OrbitControls, useTexture } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import React, { useRef } from "react";
import * as THREE from "three";
import useIsMobile from "../../Component/isMobile";

const InfinityWall = () => {
  return (
    <Canvas camera={{ fov: 25 }}>
      <ambientLight intensity={1} />
      <fog attach='fog' args={["#050505", 25, 35]} />
      <Planes />
      <OrbitControls />
    </Canvas>
  );
};

export default InfinityWall;

const Planes = () => {
  const { viewport } = useThree();
  const h = viewport.height;
  const w = viewport.width;

  return (
    <>
      {/* Top Plane */}
      <Plane position={[0, h / 2, 0]} rotation={[Math.PI / 2.05, 0, 0]} size={[w * 8, h * 15]} />
      {/* Bottom Plane */}
      <Plane position={[0, -h / 2, 0]} rotation={[Math.PI / 1.95, Math.PI, 0]} size={[w * 8, h * 15]} />
    </>
  );
};

const Plane = ({ position, rotation, size }) => {
  const ref = useRef();
  const texture = useTexture("/Texture/text.png");

  // Set wrapping mode for infinite scroll
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  useFrame((state, delta) => {
    ref.current.material.map.offset.y -= delta / 2;
    ref.current.material.map.offset.x -= delta / 100;
  });

  // Adjust the origin to be the top-center
  const [planeWidth, planeHeight] = size;
  const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight);
  geometry.translate(0, -planeHeight / 2, 0);

  const isMobile = useIsMobile(500);
  return (
    <mesh ref={ref} position={position} rotation={rotation}>
      <primitive attach='geometry' object={geometry} />
      <meshBasicMaterial
        map={texture}
        map-anisotropy={128}
        map-repeat={isMobile ? [8, 30] : [15, 30]}
        toneMapped={false}
      />
    </mesh>
  );
};
