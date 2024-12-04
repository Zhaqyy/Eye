import React, { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, invalidate, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import {
  Center,
  Environment,
  Lightformer,
  MeshTransmissionMaterial,
  OrbitControls,
  OrthographicCamera,
  PerspectiveCamera,
  useTexture,
} from "@react-three/drei";
import { gsap } from "gsap";
import { Perf } from "r3f-perf";
import { useGSAP } from "@gsap/react";
import { easing } from "maath";

// function DynamicGrid() {
//   const meshRef = useRef();
//   const materialRef = useRef();
//   const transmissionMaterialRef = useRef();
//   const { viewport, camera, pointer } = useThree();

//   const cubeSize = 0.5;
//   const spacingFactor = 1.25;
//   const fullSize = -(cubeSize * spacingFactor) / 2;

//   const cubesX = Math.ceil(viewport.width / (cubeSize * spacingFactor));
//   const cubesY = Math.ceil(viewport.height / (cubeSize * spacingFactor));
//   const instanceCount = cubesX * cubesY;

//   const proximityRadius = 5; // Adjusted for better control
//   const depressionAmount = 5;

//   // Utility Functions
//   const distance = (x1, y1, x2, y2) => {
//     return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
//   };

//   const map = (value, start1, stop1, start2, stop2) => {
//     return ((value - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
//   };

//   // Update the grid layout
//   useEffect(() => {
//     const mesh = meshRef.current;
//     let index = 0;

//     for (let i = 0; i < cubesX; i++) {
//       for (let j = 0; j < cubesY; j++) {
//         const id = index++;

//         const position = new THREE.Vector3(
//           i * cubeSize * spacingFactor - viewport.width / 2 + (cubeSize * spacingFactor) / 2,
//           j * cubeSize * spacingFactor - viewport.height / 2 + (cubeSize * spacingFactor) / 2,
//           0
//         );

//         mesh.setMatrixAt(id, new THREE.Matrix4().makeTranslation(position.x, position.z, position.y));
//         // console.log(i, j);
//       }
//     }
//     mesh.instanceMatrix.needsUpdate = true;
//   }, [cubesX, cubesY, viewport.width, viewport.height]);

//   // for useframe
//   const mesh = meshRef.current;

//   const color = new THREE.Color(0xffffff); // Default color
//   const targetColor = new THREE.Color(0xe68989); // Initial target color
//   console.log(instanceCount);
//   const colorArray = new Float32Array(instanceCount * 3); // 3 for RGB
//   const colorAttribute = new THREE.InstancedBufferAttribute(colorArray, 3);
//   if (mesh) {
//     mesh.instanceColor = colorAttribute;
//     mesh.geometry.setAttribute("color", colorAttribute);
//   }

//   // Store the mouse position
//   const mouseRef = useRef(new THREE.Vector3(0, 0, 0));

//   useFrame((state, delta) => {
//     const mesh = meshRef.current;
//     // const { width, height } = viewport;

//     const x = (pointer.x * viewport.width) / 2;
//     const y = (pointer.y * viewport.height) / 2;

//     // Smooth the mouse position using damping
//     const mousePosition = new THREE.Vector3(
//       THREE.MathUtils.damp(mouseRef.current.y, y, 4, delta),
//       0,
//       THREE.MathUtils.damp(mouseRef.current.x, x, 5, delta)
//     );

//     // Store the last mouse position for the next frame
//     mouseRef.current.copy(mousePosition);

//     const matrix = new THREE.Matrix4();
//     const position = new THREE.Vector3();

//     for (let i = 0; i < instanceCount; i++) {
//       mesh.getMatrixAt(i, matrix);
//       position.setFromMatrixPosition(matrix);

//       // Calculate distance from the center to determine max scale

//       const distanceToMouse = position.distanceTo(mousePosition);
//       const depression =
//         distanceToMouse < proximityRadius ? THREE.MathUtils.mapLinear(distanceToMouse, 0, proximityRadius, -depressionAmount, 0) : 0;

//       position.y = depression;

//       matrix.setPosition(position);
//       mesh.setMatrixAt(i, matrix);

//       // Update material properties for items within proximity
//       const mat = mesh.material;

//       // Update color based on proximity
//       if (distanceToMouse < proximityRadius) {
//         targetColor.set(0xe68989); // Color when in proximity
//       } else {
//         targetColor.set(0xffffff); // Default color
//       }

//       // Set color for the instance
//       easing.dampC(color, targetColor, delta, 0.01);
//       colorAttribute.setXYZ(i, color.r, color.g, color.b);

//       mat.needsUpdate = true; // Ensure material is updated
//     }
//     const mat = mesh.material;
//     // Mark color attribute for update
//     mat.needsUpdate = true;
//     colorAttribute.needsUpdate = true;
//     mesh.instanceMatrix.needsUpdate = true;
//   });

// //   return (
// //     <group position={[0, 0, 0]}>
// //       <instancedMesh
// //         ref={meshRef}
// //         args={[null, null, instanceCount]}
// //         // material={material}
// //       >
// //         <boxGeometry args={[cubeSize, cubeSize, cubeSize]} />

// //         <meshBasicMaterial />
// //       </instancedMesh>
// //     </group>
// //   );
// // }

function DynamicGrid() {
  const meshRef = useRef();
  const sphereRef = useRef();
  const { camera, pointer, raycaster, scene, viewport } = useThree();

  const cubeSize = 0.5; // Size of each cube
  const spacingFactor = 1.25; // Spacing between cubes
  const proximityRadius = 5; // Mouse proximity radius
  const depressionAmount = 5; // Maximum depression amount

  const cubesX = Math.abs(Math.ceil((camera.left * 2) / camera.position.z / (cubeSize * spacingFactor)));
  const cubesY = Math.abs(Math.ceil((camera.top * 2) / camera.position.z / (cubeSize * spacingFactor)));
  const instanceCount = cubesX * cubesY;

  // const targetColor = new THREE.Color(0xe68989); // Target color
  // const whiteColor = new THREE.Color(0xffffff); // Default white color
  // const colorArray = new Float32Array(instanceCount * 3); // Color buffer for instanced mesh
  // const colorAttribute = new THREE.InstancedBufferAttribute(colorArray, 3);

  // Add a grid plane for raycasting
  const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

  // Smoothly interpolated mouse position
  const mousePosition = useRef(new THREE.Vector3(0, 0, 0));

  // Initialize grid positions and colors
  useEffect(() => {
    const mesh = meshRef.current;
    const matrix = new THREE.Matrix4();
    let index = 0;

    for (let i = 0; i < cubesX; i++) {
      for (let j = 0; j < cubesY; j++) {
        const x = i * cubeSize * spacingFactor - (cubesX * cubeSize * spacingFactor) / 2;
        const z = j * cubeSize * spacingFactor - (cubesY * cubeSize * spacingFactor) / 2;

        matrix.setPosition(x, 0, z);
        mesh.setMatrixAt(index++, matrix);
      }
    }
    mesh.instanceMatrix.needsUpdate = true;

    // Initialize all cubes to white color
    // for (let i = 0; i < instanceCount; i++) {
    //   whiteColor.toArray(colorArray, i * 3);
    // }
    // colorAttribute.needsUpdate = true;
  }, [cubesX, cubesY]);

  //   // for useframe
  const mesh = meshRef.current;

  const color = new THREE.Color(0xffffff); // Default color
  const targetColor = new THREE.Color(0xe68989); // Initial target color
  console.log(instanceCount);
  const colorArray = new Float32Array(instanceCount * 3); // 3 for RGB
  const colorAttribute = new THREE.InstancedBufferAttribute(colorArray, 3);
  if (mesh) {
    mesh.instanceColor = colorAttribute;
    mesh.geometry.setAttribute("color", colorAttribute);
  }

  // UseFrame: Update cube positions, colors, and sphere position
  useFrame((state, delta) => {
    const mesh = meshRef.current;
    const sphere = sphereRef.current;
    const matrix = new THREE.Matrix4();
    const position = new THREE.Vector3();

    // Raycasting to determine pointer position
    raycaster.setFromCamera(pointer, camera);
    const targetMousePosition = new THREE.Vector3();
    raycaster.ray.intersectPlane(plane, targetMousePosition);

    // Smoothly lerp the mouse position
    mousePosition.current.x = THREE.MathUtils.damp(mousePosition.current.x, targetMousePosition.x, 5, delta);
    mousePosition.current.z = THREE.MathUtils.damp(mousePosition.current.z, targetMousePosition.z, 5, delta);

    // Move the sphere to follow the lerped mouse position
    if (sphere) {
      sphere.position.copy(mousePosition.current);
    }

    for (let i = 0; i < instanceCount; i++) {
      mesh.getMatrixAt(i, matrix);
      position.setFromMatrixPosition(matrix);

      // Calculate distance from mouse to cube
      const distanceToMouse = position.distanceTo(mousePosition.current);

      // Apply depression based on proximity
      const targetDepression =
        distanceToMouse < proximityRadius ? THREE.MathUtils.mapLinear(distanceToMouse, 0, proximityRadius, -depressionAmount, 0) : 0;
      position.y = THREE.MathUtils.damp(position.y, targetDepression, 5, delta);

      // Smoothly update matrix
      matrix.setPosition(position);
      mesh.setMatrixAt(i, matrix);

      // Smooth color transition based on proximity
      const proximityFactor = distanceToMouse < proximityRadius ? THREE.MathUtils.mapLinear(distanceToMouse, 0, proximityRadius, 1, 0) : 0;

      // Update material properties for items within proximity
      const mat = mesh.material;

      // Update color based on proximity
      if (distanceToMouse < proximityRadius) {
        targetColor.set(0xe68989); // Color when in proximity
      } else {
        targetColor.set(0xffffff); // Default color
      }

      // Set color for the instance
      easing.dampC(color, targetColor, 0.005, delta);
      colorAttribute.setXYZ(i, color.r, color.g, color.b);

      mat.needsUpdate = true; // Ensure material is updated
    }
    const mat = mesh.material;
    mesh.instanceMatrix.needsUpdate = true;
    colorAttribute.needsUpdate = true;
    mat.needsUpdate = true;
  });
  const [map] = useTexture(["/Texture/10.jpg"]);
  return (
    <>
      <group>
        {/* Rolling Sphere */}
        <mesh ref={sphereRef} position={[0, 0, 0]}>
          <sphereGeometry args={[2.5, 32, 32]} />
          <meshPhongMaterial shininess={100} color={'#e68989'} specular={"#ffffff"} envMap={map} combine={THREE.AddOperation}/>
        </mesh>

        {/* Instanced Grid */}
        <instancedMesh ref={meshRef} args={[null, null, instanceCount]} geometry={new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize)}>
          <meshBasicMaterial />
        </instancedMesh>
      </group>
    </>
  );
}

const Gridder = () => {
  // Randomize Lightformer Colors
  const randomizeColor = () => {
    const colors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div id='grid' style={{ width: "100%", height: "100vh" }}>
      <Canvas
      // camera={{ position: [0, 0, 10], fov: 90 }}
      >
        <Perf position='top-right' minimal={true} />
        <OrthographicCamera
          makeDefault
          zoom={40}
          // top={300}
          // bottom={-300}
          // left={300}
          // right={-300}
          // near={0.1}
          // far={600}
          position={[10, 90, 20]}
        />
        {/* <Environment
          resolution={32}
          // background
        >
          <group rotation={[-Math.PI / 4, -0.3, 0]}>
            <Lightformer intensity={1} rotation-x={Math.PI / 2} position={[0, 1, -5]} scale={[10, 10, 1]} color={randomizeColor()} />
            <Lightformer intensity={1} rotation-y={Math.PI / 2} position={[-5, -1, -1]} scale={[20, 2, 1]} color={randomizeColor()} />
            <Lightformer intensity={1} rotation-y={-Math.PI / 2} position={[5, 1, 0]} scale={[20, 2, 1]} color={randomizeColor()} />
            <Lightformer
              type='ring'
              intensity={2}
              color={randomizeColor()}
              rotation-y={Math.PI / 2}
              position={[-0.1, -1, -5]}
              scale={20}
            />
          </group>
        </Environment> */}
        <ambientLight intensity={1} />
        <pointLight intensity={10} position={[0, 5, 0]}/>
        <DynamicGrid />
        <OrbitControls />
      </Canvas>
    </div>
  );
};
export default Gridder;
