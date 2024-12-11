import React, { useEffect, useRef } from "react";
import { OrbitControls, PerspectiveCamera, PivotControls, RenderTexture, Text, TransformControls, useFBO } from "@react-three/drei";
import { Canvas, createPortal, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";

import { WiggleBone } from "wiggle";
import { DoubleSide, RepeatWrapping, Scene } from "three";
import { Perf } from "r3f-perf";

const Ribbons = () => {
  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      <Perf
        position='top-right'
        // minimal={true}
      />
      <ambientLight intensity={1} />
      {/* <TransformControls> */}
      <Model
        position={[-8.5, 0, 0]}
        //  scale={[0.5, 1, 1]}
        rotation={[0, 0, -Math.PI / 2]}
      />
      {/* </TransformControls> */}
      {/* <OrbitControls /> */}
    </Canvas>
  );
};

export default Ribbons;

export function Model(props) {
  const { nodes } = useGLTF("/Model/ribbon.glb");
  const wiggleBones = useRef([]);
  const ribbonRef = useRef();

  useEffect(() => {
    wiggleBones.current.length = 0;
    nodes.RootBone.traverse(bone => {
      if (bone.isBone && bone !== nodes.RootBone) {
        const wiggleBone = new WiggleBone(bone, {
          velocity: 0.1,
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
    const oscillation = Math.sin(time) * 0.95; // Controls the angle range (-0.1 to 0.1 radians)
    // ribbonRef.current.rotation.z = oscillation * 0.05;
    ribbonRef.current.rotation.y = oscillation * 0.25;
    ribbonRef.current.rotation.x = oscillation;
  });
  return (
    <group {...props} ref={ribbonRef} dispose={null}>
      <skinnedMesh geometry={nodes.Plane.geometry} skeleton={nodes.Plane.skeleton}>
        <meshStandardMaterial side={DoubleSide}>
          <RenderTexture attach='map' anisotropy={4} repeat={[1, 5]} wrapT={RepeatWrapping} wrapS={RepeatWrapping}>
            <PerspectiveCamera makeDefault manual position={[0, 0, 5]} />
            <color attach='background' args={["orange"]} />
            <ambientLight intensity={1} />
            {/* <OrbitControls /> */}
            <Text
              rotation={[Math.PI, 0, Math.PI / 2]}
              position={[0, -1.25, 0]}
              scale={[0.25, 1, 1]}
              fontSize={3}
              color='#555'
              anchorX='center'
              anchorY='middle'
            >
              HELLO
            </Text>
            <Text rotation={[Math.PI, 0, Math.PI / 2]} position={[0,1.1,0]} scale={[0.25, 1, 1]} fontSize={3} color='#fff' anchorX='center' anchorY='middle'>
              HELLO
            </Text>
          </RenderTexture>
        </meshStandardMaterial>
      </skinnedMesh>
      <primitive object={nodes.RootBone} />
    </group>
  );
}

useGLTF.preload("/Model/ribbon.glb");
