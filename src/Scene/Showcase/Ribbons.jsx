import React, { useEffect, useMemo, useRef } from "react";
import { OrbitControls, PresentationControls, useMatcapTexture, useTexture } from "@react-three/drei";
import { Canvas, useFrame, useGraph, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils";

import { WiggleBone } from "wiggle";
import { DoubleSide, RepeatWrapping } from "three";
import { Perf } from "r3f-perf";
import useIsMobile from "../../Component/isMobile";

const Ribbons = () => {
  const isMobile = useIsMobile(600);

  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      {/* <Perf
        position='top-right'
        // minimal={true}
      /> */}
      <ambientLight intensity={1} />

      <PresentationControls
        global
        config={{ mass: 2, tension: 500 }}
        snap={{ mass: 4, tension: 1500 }}
        rotation={[0, isMobile ? 0.05 : 0.3, 0]}
        polar={[-Math.PI / 6, Math.PI / 6]}
        azimuth={[-Math.PI / 20, Math.PI / 6]}
      >
        <Ribs />
      </PresentationControls>
    </Canvas>
  );
};

export default Ribbons;

export const Ribs = () => {
  const lightRef = useRef();
  const groupRef = useRef();
  const { pointer, viewport } = useThree();
  const isMobile = useIsMobile();

  useFrame(state => {
    // Smooth mouse tracking
    const x = pointer.x * viewport.width * 0.5;
    const y = pointer.y * viewport.height * 0.5;
    lightRef.current.position.lerp({ x, y, z: 0 }, 0.05);

    if (groupRef.current) {
      groupRef.current.rotation.y = y * 0.01;
      groupRef.current.rotation.x = x * 0.01;
    }
  });

  return (
    <>
      <group ref={groupRef}>
        {Array.from({ length: 10 }).map((_, index) => (
          <>
            <group
              key={index}
              position={[-8.5, Math.random() * 8 - 4, isMobile ? -4 : 0]}
              rotation={[(Math.PI / Math.random()) * 1 - 0.5, 0, -Math.PI / 2]}
            >
              <Model key={index} />
            </group>
          </>
        ))}
      </group>
      <pointLight intensity={5} distance={20} ref={lightRef} />
    </>
  );
};

export function Model({ ...props }) {
  const { scene } = useGLTF("/Model/ribbon.glb");
  const wiggleBones = useRef([]);
  const ribbonRef = useRef();

  // Skinned meshes cannot be re-used in threejs without cloning them
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  // useGraph creates two flat object collections for nodes and materials
  const { nodes } = useGraph(clone);

  useEffect(() => {
    wiggleBones.current.length = 0;
    nodes.RootBone.traverse(bone => {
      if (bone.isBone && bone !== nodes.RootBone) {
        const wiggleBone = new WiggleBone(bone, {
          velocity: 0.25,
        });
        wiggleBones.current.push(wiggleBone);
      }
    });
    return () => {
      wiggleBones.current.forEach(wiggleBone => {
        wiggleBone.reset();
        wiggleBone.dispose();
      });
    };
  }, [nodes]);

  useFrame(state => {
    wiggleBones.current.forEach(wiggleBone => {
      wiggleBone.update();
    });

    const time = state.clock.getElapsedTime();
    const oscillation = Math.sin(time) * 0.95;

    ribbonRef.current.rotation.z = oscillation * 0.25;
    ribbonRef.current.rotation.y = oscillation * 0.25;
    ribbonRef.current.rotation.x = oscillation * 0.05;
  });

  const randomColor = useMemo(() => {
    const colors = ["#F2D35A", "#D36A1B", "#FF6B6B", "#96D38C", "#8E8EDE", "#F2A2E8", "#C9F2E4", "#E6D5B8", "#E3B505", "#FFB347"];
    return colors[Math.floor(Math.random() * colors.length)];
  }, []);

  const m = useTexture("/Texture/text.png");
  m.wrapS = m.wrapT = RepeatWrapping;
  m.repeat.set(3, 1);
  return (
    <group {...props} ref={ribbonRef} dispose={null}>
      <skinnedMesh geometry={nodes.Plane.geometry} skeleton={nodes.Plane.skeleton}>
        <meshStandardMaterial side={DoubleSide} metalness={0.4} color={randomColor} roughness={0.6} map={m} />
      </skinnedMesh>
      <primitive object={nodes.RootBone} />
    </group>
  );
}

useGLTF.preload("/Model/ribbon.glb");
