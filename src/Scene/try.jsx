import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Plane, SpotLight, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';

const radians = (degrees) => degrees * Math.PI / 180;
const map = (value, start1, stop1, start2, stop2) => ((value - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
const distance = (x1, y1, x2, y2) => Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));

const RepulsionGrid = () => {
  const { size } = useThree();
  const groupRef = useRef();
  const [meshes, setMeshes] = useState([]);
  const mouse3D = useRef(new THREE.Vector2(0, 0));
  
  const grid = useMemo(() => {
    const cols = 15;
    const rows = 7;
    const gutter = 1.2;
    let gridMeshes = [];

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        gridMeshes.push({
          position: [col + col * gutter, row + row * gutter, 0],
          rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
          initialRotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
        });
      }
    }
    return gridMeshes;
  }, []);

  useEffect(() => {
    setMeshes(grid);
  }, [grid]);

  const onPointerMove = (e) => {
    const { width, height } = size;
    mouse3D.current.x = (e.clientX / width) * 2 - 1;
    mouse3D.current.y = -(e.clientY / height) * 2 + 1;
  };

  useFrame((state) => {
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse3D.current, state.camera);
    
    if (groupRef.current) {
      groupRef.current.children.forEach((mesh, idx) => {
        const [initialX, initialY, initialZ] = grid[idx].initialRotation;
        const [meshX, meshZ] = [mesh.position.x, mesh.position.y];
        
        const mouseDistance = distance(mouse3D.current.x, mouse3D.current.y, meshX, meshZ);
        const y = map(mouseDistance, 6, 0, 0, 10);
        const scaleFactor = y / 2.5;
        const scale = scaleFactor < 1 ? 1 : scaleFactor;

        gsap.to(mesh.position, {
          z: y < 1 ? 1 : y,
          duration: 0.2,
        });

        gsap.to(mesh.scale, {
          x: scale,
          y: scale,
          z: scale,
          duration: 0.4,
          ease: "expo.out",
        });

        gsap.to(mesh.rotation, {
          x: map(y, -1, 1, radians(45), initialX),
          y: map(y, -1, 1, radians(90), initialY),
          z: map(y, -1, 1, radians(-90), initialZ),
          duration: 0.5,
          ease: "expo.out",
        });
      });
    }
  });

  return (
    <group ref={groupRef} onPointerMove={onPointerMove}>
      {meshes.map((mesh, idx) => (
        <mesh
          key={idx}
          position={mesh.position}
          rotation={mesh.rotation}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#ff00ff" metalness={0.2} roughness={0.2} />
        </mesh>
      ))}
    </group>
  );
};

const Scene = () => {
  return (
    <>
      <ambientLight color={'#2900af'} intensity={1} />
      <SpotLight color={'#e000ff'} intensity={1} position={[0, 27, 0]} castShadow />
      {/* <pointLight color={0xfff000} intensity={1} position={[0, 10, -100]} />
      <pointLight color={0xfff000} intensity={1} position={[100, 10, 0]} />
      <pointLight color={0x00ff00} intensity={1} position={[20, 5, 20]} /> */}
      <RepulsionGrid />
      {/* <Plane args={[2000, 2000]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <shadowMaterial opacity={0.3} />
      </Plane> */}
      <OrbitControls />
    </>
  );
};

export default function Try() {
  return (
    <Canvas shadows camera={{ position: [0, 0, 50], fov: 45 }}>
      <Scene />
    </Canvas>
  );
}
