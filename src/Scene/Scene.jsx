import { Environment, Lightformer, MeshReflectorMaterial, OrbitControls, QuadraticBezierLine, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { Eye } from "./BgScene/Eye";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import Disc from "./Helper/NoiseFlow";
import Simulation from "./Helper/FlowOver";
import { Perf } from "r3f-perf";
import Carousel from "./Carousel/Carousel";
import CarouselWrap from "./Carousel/CarouselOld";

// import * as THREE from 'three';
import { extend } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import Grid from "./Grid";
import { BgModel } from "./BgScene/BgModel";
import Grass from "./BgScene/GrassFloor";
// import { useRef } from 'react';
// import { useControls } from 'leva';


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
      <Canvas camera={{ fov: 70, position: [0, 0, 5], far: 150 }} gl={{ localClippingEnabled: true }} >
        <Perf position='top-left' />
        <color attach='background' args={["#050505"]} />
        {/* <fog attach='fog' args={["#050505", 5, 10]} /> */}

        <Environment resolution={32} 
        // background
        >
          <group rotation={[-Math.PI / 4, -0.3, 0]}>
            <Lightformer intensity={1} rotation-x={Math.PI / 2} position={[0, 1, -5]} scale={[10, 10, 1]} />
            <Lightformer intensity={1} rotation-y={Math.PI} position={[-5, -1, -1]} scale={[20, 2, 1]} />
            <Lightformer intensity={1} rotation-y={-Math.PI / 2} position={[5, 1, 0]} scale={[20, 2, 1]} />
            <Lightformer type='ring' intensity={2} rotation-y={Math.PI / 2} position={[-0.1, -1, -5]} scale={20} />
          </group>
        </Environment>

        {/* <BgModel/> */}
        {/* <Simulation width={1024} height={1024} /> */}
        {/* <FBOParticles/> */}
        {/* <FlowOverlay/> */}
        {/* <Eye ref={eye} position={[0,1,0]} /> */}
        {/* {positions.map((pos, idx) => (
        <Tether key={idx} start={eye} end={pos} />
      ))} */}
        {/* <Tether start={eye} end={ghost} /> */}
        {/* <InstancedTether start={eye} positions={positions} /> */}
        {/* <ambientLight intensity={20} /> */}
        {/* <Disc/> */}
        {/* <Simulation width={1024} height={1024} /> */}
        {/* <Environment preset='night' environmentIntensity={1.5} /> */}
        <Grass/>
        {/* <Rig /> */}
        {/* <CarouselWrap /> */}
        {/* <Carousel activeIndex={activeIndex} setActiveIndex={setActiveIndex} /> */}
        <OrbitControls />

        {/* About Page */}
        {/* <Grid/> */}
      </Canvas>
    </>
  );
};
export default Scene;


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
