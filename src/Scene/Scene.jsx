import { Environment, MeshReflectorMaterial, OrbitControls, QuadraticBezierLine, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { Eye } from "./Eye";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import Disc from "./NoiseFlow";
import Simulation from "./FlowOver";
import { Perf } from "r3f-perf";
import Carousel from "./Carousel/Carousel";
import CarouselWrap from "./Carousel/CarouselOld";



// import * as THREE from 'three';
import { extend } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import Grid from "./Grid";
// import { useRef } from 'react';
// import { useControls } from 'leva';

// Extend BasicMaterial with a custom vertex shader
const BasicVertexMaterial = shaderMaterial(
  {
    uRadius: 1.0,         // Radius of the depression
    uDepth: 1.0,          // Depth of the depression
    uIrregularity: 0.2,   // Irregularity for natural bumpiness
  },
  // Vertex Shader
  `
    uniform float uRadius;
    uniform float uDepth;
    uniform float uIrregularity;

    varying vec2 vUv;

    // Simple 2D noise for irregularity
    float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
    }

    void main() {
      vUv = uv;

      vec3 pos = position;

      // Calculate distance from center of the plane (0.5, 0.5 in UV space)
      float dist = distance(uv, vec2(0.5, 0.5));

      // Smooth depression effect
      float depression = smoothstep(uRadius, 0.0, dist) * uDepth;

      // Add random irregularity near the center for natural elevation
      float irregularity = random(uv) * uIrregularity * (1.0 - dist);

      // Apply depression and irregularity to the z-coordinate
      pos.z -= depression;
      pos.z += irregularity;

      // Standard transformation
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  // Fragment Shader
  `
    varying vec2 vUv;

    void main() {
      // gl_FragColor = vec4(0.5); // Keep basic material appearance
      float x = gl_FragCoord.x / 500.0;
      vec3 color = vec3(x);
    
      gl_FragColor = vec4(color,1.0);
    }
  `
);

// Register the extended material with R3F
extend({ BasicVertexMaterial });

function DepressedPlane() {
  const meshRef = useRef();


  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[10, 10, 100, 100]} /> {/* Higher segments for smoother deformation */}
      <basicVertexMaterial
        uDepth={0.5}
        uRadius={0.5}
        uIrregularity={0.1}
      />
    </mesh>
  );
}


const Scene = ({ activeIndex, setActiveIndex }) => {
  const eye = useRef();

  // Define 6 different positions
  const positions = useMemo(
    () => [
      new THREE.Vector3(1, 4, -2),
      new THREE.Vector3(2, 4, -3),
      new THREE.Vector3(3, 4, -1),
      new THREE.Vector3(-1, 4, -2),
      new THREE.Vector3(-2, 4, 1),
      new THREE.Vector3(-3, 4, -3),
    ],
    []
  );

  return (
    <>
      <Canvas 
      camera={{ fov: 70, position: [0, 0, 5], far:15 }}
      >
        <Perf position='top-left' />
        <color attach='background' args={["#050505"]} />
        <fog attach='fog' args={["#050505", 5, 10]} />
        {/* <Simulation width={1024} height={1024} /> */}
        {/* <FBOParticles/> */}
        {/* <FlowOverlay/> */}
        {/* <Eye ref={eye} position={[0,1,0]} /> */}
      {/* {positions.map((pos, idx) => (
        <Tether key={idx} start={eye} end={pos} />
      ))} */}
        {/* <Tether start={eye} end={ghost} /> */}
        {/* <InstancedTether start={eye} positions={positions} /> */}
        <ambientLight intensity={2} />
        {/* <Disc/> */}
        {/* <Simulation width={1024} height={1024} /> */}
        <Environment preset='night' environmentIntensity={1.5} />
      {/* <DepressedPlane /> */}
        {/* <Ground /> */}
        {/* <Rig /> */}
        {/* <CarouselWrap /> */}
        <Carousel activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
        <OrbitControls />

        {/* About Page */}
        {/* <Grid/> */}
      </Canvas>
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
  const [vec] = useState(() => new THREE.Vector3());
  useFrame(state => {
    state.camera.position.lerp(vec.set(state.pointer.x * 2, 2 + state.pointer.y * 2, 5), 0.01);
    state.camera.lookAt(0, 0, 0);
  });
}
function Tether({ start, end, v1 = new THREE.Vector3(), v2 = new THREE.Vector3() }) {
  //   const [arm, normal, col, dis] = useTexture(["/Texture/arm.webp", "/Texture/n.webp", "/Texture/c.webp", "/Texture/d.webp"]);
  const ref = useRef();
  useFrame(
    () =>
      ref.current.setPoints(
        start.current.getWorldPosition(v1),
        //   end.current.getWorldPosition(v2)
        (v2 = end)
      ),
    []
  );
  return <QuadraticBezierLine ref={ref} lineWidth={5} color={"#7c2b26"} />;
}

function InstancedTether({ start, positions }) {
  const meshRef = useRef();
  const count = positions.length;

  const geometry = useMemo(() => new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3(1, 0, 0)]), []);
  const material = useMemo(() => new THREE.LineBasicMaterial({ color: "#ffffff" }), []);

  useFrame(() => {
    const startPos = start.current.getWorldPosition(new THREE.Vector3());

    for (let i = 0; i < count; i++) {
      const endPosition = positions[i];

      const line = new THREE.Line3(startPos, endPosition);

      // Create a matrix that transforms from start to end position
      const position = line.getCenter(new THREE.Vector3());
      const scale = line.distance();
      const orientation = new THREE.Matrix4().lookAt(startPos, endPosition, new THREE.Vector3(0, 1, 0));
      const scaleMatrix = new THREE.Matrix4().makeScale(scale, 1, 1);

      const matrix = new THREE.Matrix4().multiplyMatrices(orientation, scaleMatrix);
      matrix.setPosition(position);

      meshRef.current.setMatrixAt(i, matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return <instancedMesh ref={meshRef} args={[geometry, material, count]} />;
}
