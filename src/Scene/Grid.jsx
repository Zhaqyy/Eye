import React, { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, invalidate, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Center, Environment, Lightformer, MeshTransmissionMaterial, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { gsap } from "gsap";
import { Perf } from "r3f-perf";
import { useGSAP } from "@gsap/react";
import { easing } from "maath";
// import { MeshTransmissionMaterial } from "./MeshTransmissionMaterial";
// import { MeshTransmissionMaterial } from "./MeshTransmissionMaterial2";

// function DynamicGrid() {
//   const meshRef = useRef();
//   const { viewport, pointer, size, mouse } = useThree();

//   // Define cube size and spacing
//   const cubeSize = 0.4;
//   const spacingFactor = 4; // Multiply by cubeSize to add spacing between cubes
//   const fullSize = -(cubeSize * spacingFactor) / 2;
//   // Calculate number of cubes based on screen size
//   const cubesX = Math.ceil(viewport.width / (cubeSize * spacingFactor)); // Adjusted for spacing
//   const cubesY = Math.ceil(viewport.height / (cubeSize * spacingFactor)); // Adjusted for spacing

//   const instanceCount = cubesX * cubesY;

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

//         mesh.setMatrixAt(id, new THREE.Matrix4().makeTranslation(position.x, position.y, position.z));
//       }
//     }

//     mesh.instanceMatrix.needsUpdate = true;
//   }, [cubesX, cubesY, viewport.width, viewport.height]);

//   const materialRef = useRef();
//   const transmissionMaterialRef = useRef();
//   const { contextSafe } = useGSAP();

//   //   const tl = useRef(gsap.timeline({ paused: true}));
//   //   const handleHover = contextSafe(() => {
//   //     //   console.log(meshRef.current.material.transmission);
//   //     // Animate material from plain to transmission
//   //     invalidate(); // Trigger a re-render
//   //     gsap.to(meshRef.current.material, {
//   //       duration: 0.5,
//   //       transmission: 1,
//   //       ease: "power2.out",
//   //     });
//   //   });

//   //   const handleOut = contextSafe(() => {
//   //     // Animate material back to plain
//   //     invalidate(); // Trigger a re-render
//   //     gsap.to(meshRef.current.material, {
//   //       duration: 0.5,
//   //       transmission: 0,
//   //       ease: "power2.in",
//   //     });
//   //   });

//   //   const handlePointerMove = contextSafe(event => {
//   //     const { clientX, clientY } = event;
//   //     const rect = event.target.getBoundingClientRect();
//   //     const mouseX = (clientX / rect.width) * 2 - 1;
//   //     const mouseY = -(clientY / rect.height) * 2 + 1;

//   //     const thresholdDistance = 2; // The distance radius in which the effect will apply

//   //     meshRef.current.getMatrixAt(0, new THREE.Matrix4()); // Example getting one matrix, adjust to get the closest instanced boxes
//   //     // Calculate distance and scale or apply the material changes based on proximity
//   //   });

//   // const handleHover = contextSafe(() => {
//   //     invalidate(); // Trigger a re-render on hover
//   //     gsap.to(meshRef.current.material, {
//   //       duration: 0.5,
//   //       transmission: 1,
//   //       ease: "power2.out",
//   //       onComplete: () => {
//   //               meshRef.current.material.needsUpdate
//   //             },
//   //     });
//   //   });

//   //   // Hover out
//   //   const handleOut = contextSafe(() => {
//   //     invalidate(); // Trigger a re-render when hover ends
//   //     gsap.to(meshRef.current.material, {
//   //       duration: 0.5,
//   //       transmission: 0,
//   //       ease: "power2.in",
//   //     });
//   //   });

//   const proximityRadius = 2;
//   const scaleCube = cubeSize * (cubeSize / 2);

// //   useFrame(() => {
// //     const mesh = meshRef.current;
// //     const mousePosition = new THREE.Vector2(pointer.x * viewport.width, pointer.y * viewport.height);

// //     for (let i = 0; i < instanceCount; i++) {
// //       const matrix = new THREE.Matrix4();
// //       mesh.getMatrixAt(i, matrix);
// //       const position = new THREE.Vector3();
// //       position.setFromMatrixPosition(matrix);

// //       // Calculate distance to mouse
// //       const distance = position.distanceTo(new THREE.Vector3(mousePosition.x, mousePosition.y, 0));

// //       let scaleFactor = 1;
// //       let transmission = 0;

// //       if (distance < proximityRadius) {
// //         // Lerp scale up to scaleCube size
// //         scaleFactor = lerp(1, scaleCube, (proximityRadius - distance) / proximityRadius);
// //         // Lerp transmission to make it more transparent
// //         transmission = lerp(0, 1, (proximityRadius - distance) / proximityRadius);
// //       } else {
// //         // Lerp back to normal size and transmission
// //         scaleFactor = lerp(scaleFactor, 1, 0.1);
// //         transmission = lerp(transmission, 0, 0.1);
// //       }

// //       // Apply scale back to the matrix
// //       matrix.scale(new THREE.Vector3(scaleFactor, scaleFactor, scaleFactor));
// //       mesh.setMatrixAt(i, matrix);

// //       // Get material and update transmission
// //       const m = mesh.material;
// //       m.transmission = lerp(m.transmission, transmission, 0.1); // Lerp transmission

// //       // Update instance matrix and material
// //       mesh.instanceMatrix.needsUpdate = true;
// //       mesh.material.needsUpdate = true;
// //     }
// //   });

// // Function to convert screen space mouse coordinates to world space
// const screenToWorldPosition = (mouse, viewport, size) => {
//     return new THREE.Vector3(
//       (mouse.x * viewport.width) / 2,
//       (mouse.y * viewport.height) / 2,
//       0
//     );
//   };

//   useFrame(() => {
//     const mesh = meshRef.current;
//     const mousePosition = screenToWorldPosition(mouse, viewport, size);

//     const matrix = new THREE.Matrix4();
//     const position = new THREE.Vector3();
//     for (let i = 0; i < instanceCount; i++) {
//       mesh.getMatrixAt(i, matrix);
//       position.setFromMatrixPosition(matrix);

//       // Calculate distance from the mouse to each cube
//       const distance = position.distanceTo(mousePosition);

//     //   // Scale and transmission lerp based on proximity
//     //   let targetScale = 1;
//     // //   let targetTransmission = 0;

//     //   if (distance < proximityRadius) {
//     //     const scaleFactor = (proximityRadius - distance) / proximityRadius;
//     //     targetScale = lerp(cubeSize, scaleCube, 0.05);
//     //     // targetTransmission = lerp(0, 1, scaleFactor);
//     //   } else {
//     //     targetScale = lerp(scaleCube, cubeSize, 0.05); // Lerp back to original size
//     //     // targetTransmission = lerp(targetTransmission, 0, 0.1); // Lerp back to original transmission
//     //   }

//     let targetScale = 1;
//     //   let targetTransmission = 0;

//       if (distance < proximityRadius) {
//         const scaleFactor = (proximityRadius - distance) / proximityRadius;
//         targetScale = lerp(1, 1.01, 0.1);
//         // targetTransmission = lerp(0, 1, scaleFactor);
//       } else {
//         targetScale = lerp(targetScale, 1, 0.1); // Lerp back to original size
//         // targetTransmission = lerp(targetTransmission, 0, 0.1); // Lerp back to original transmission
//       }

//       // Apply scale back to the matrix
//       matrix.scale(new THREE.Vector3(targetScale, targetScale, targetScale));
//       mesh.setMatrixAt(i, matrix);

//       console.log(targetScale);
//       // Get the material and update transmission
//     //   const material = mesh.material;
//     //   material.transmission = lerp(material.transmission, targetTransmission, 0.1); // Lerp transmission
//     }

//     // console.log(meshRef.current.material.transmission);
//     // Ensure mesh updates are applied
//     mesh.instanceMatrix.needsUpdate = true;
//     // mesh.material.needsUpdate = true;
//   });

// const handleHover = () => {
//     meshRef.current.material.transmission = lerp(0,1, 0.2)
//   };

//   const handleOut = () => {
//     meshRef.current.material.transmission = lerp(1,0, 0.2)
//   };
// return (
//     <group position={[fullSize, 0, 0]}>
//       <instancedMesh
//       ref={meshRef}
//       args={[null, null, instanceCount]}
//     //   onPointerOver={handleHover} onPointerOut={handleOut}
//     // onPointerOver={(event) => {
//     //     const material = meshRef.current.material;
//     //     material.transmission = lerp(material.transmission, 1, 0.9); // Lerp to 1 on hover
//     //     meshRef.current.material.needsUpdate = true;
//     //   }}
//     //   onPointerOut={(event) => {
//     //     const material = meshRef.current.material;
//     //     material.transmission = lerp(material.transmission, 0, 0.9); // Lerp to 0 on hover out
//     //     meshRef.current.material.needsUpdate = true;
//     //   }}
//       >
//         <boxGeometry args={[cubeSize, cubeSize, cubeSize]} />
//         <MeshTransmissionMaterial
//           ref={transmissionMaterialRef}
//           thickness={0.95}
//           anisotropy={0.1}
//           chromaticAberration={2}
//           backside={true}
//           backsideThickness={0.15}
//           samples={16}
//           resolution={1024}
//           // _transmission={1}
//           transmission={1}
//           clearcoat={1}
//           clearcoatRoughness={0.0}
//           roughness={0.0}
//           distortion={0.95}
//           distortionScale={0.5}
//           temporalDistortion={0.1}
//           ior={1.25}
//           color='white'
//           shadow='#94cbff'
//         />
//         {/* <meshStandardMaterial ref={materialRef} color={"orange"} emissive={"orange"} roughness={0.5} /> */}
//       </instancedMesh>
//     </group>
//   );
// }

//
//
// perfect mouse implem
// function DynamicGrid() {
//   const meshRef = useRef();
//   const materialRef = useRef();
//   const { viewport, mouse } = useThree();

//   // Define cube size and spacing
//   const cubeSize = 0.4;
//   const spacingFactor = 4;
//   const fullSize = -(cubeSize * spacingFactor) / 2;

//   const cubesX = Math.ceil(viewport.width / (cubeSize * spacingFactor));
//   const cubesY = Math.ceil(viewport.height / (cubeSize * spacingFactor));
//   const instanceCount = cubesX * cubesY;

//   const proximityRadius = 1;
//   const scaleCube = cubeSize * (cubeSize / 2);
//   const maxScale = 1.5; // Maximum scale factor
//   const minScale = 1.0; // Minimum scale factor

//   // Define the material using MeshPhysicalMaterial
//   const material = new THREE.MeshPhysicalMaterial({
//     // color: 0xffffff,
//     // thickness: 1.0,
//     // reflectivity: 0.5,
//     // roughness: 0.5,
//     // clearcoat: 0.1,
//     // transmission: 0.0,
//     // ior: 1.5,
//     // iridescence: 1,
//     // iridescenceIOR: 1.3,
//     dispersion: 5,
//     iridescence :1,
//     iridescenceIOR :2,
//   });

//   // Update the instances in the grid using useEffect
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

//         mesh.setMatrixAt(id, new THREE.Matrix4().makeTranslation(position.x, position.y, position.z));
//       }
//     }

//     mesh.instanceMatrix.needsUpdate = true;
//   }, [cubesX, cubesY, viewport.width, viewport.height]);

//   // Function to convert screen space mouse coordinates to world space
//   // const screenToWorldPosition = (pointer, viewport) => {
//   //   useFrame(({ viewport, camera, pointer }, delta) => {
//   //     const { width, height } = viewport.getCurrentViewport(camera, [0, 0, 3])
//   //     // easing.damp3(ref.current.position, [(pointer.x * width) / 2, (pointer.y * height) / 2, 3], store.open ? 0 : 0.1, delta)
//   //     // easing.damp3(ref.current.scale, store.open ? 4 : 0.01, store.open ? 0.5 : 0.2, delta)
//   //     // easing.dampC(ref.current.material.color, store.open ? '#f0f0f0' : '#ccc', 0.1, delta)
//   //     x = (pointer.x * width) / 2
//   //     y = (pointer.y * height) / 2
//   //     console.log(x, y)
//   //   })
//   //   // const { width, height } = viewport.getCurrentViewport(camera, [0, 0, 3])
//   //   return new THREE.Vector3(
//   //     // (pointer.x * width) / 2, (pointer.y * height) / 2,
//   //     // (mouse.x * viewport.width) / 2,
//   //     // (mouse.y * viewport.height) / 2,
//   //     x, y,0
//   //   );
//   // };

//   // useFrame logic to scale and update the material based on proximity
//   useFrame(({ viewport, camera, pointer }) => {
//     const mesh = meshRef.current;
//     // const mousePosition = screenToWorldPosition(mouse, viewport);
//     const { width, height } = viewport.getCurrentViewport(camera, [0, 0, 0])

//    const x = (pointer.x * width) / 2
//    const y = (pointer.y * height) / 2

//    const mousePosition = new THREE.Vector3(x, y,0)
//   //  console.log(mousePosition)

//     const matrix = new THREE.Matrix4();
//     const position = new THREE.Vector3();

//     for (let i = 0; i < instanceCount; i++) {
//       mesh.getMatrixAt(i, matrix);
//       position.setFromMatrixPosition(matrix);

//       const distance = position.distanceTo(mousePosition);
//     // Scale logic
//     let targetScale = minScale;
//     if (distance < proximityRadius) {
//       const scaleFactor = (proximityRadius - distance) / proximityRadius;
//       targetScale = Math.min(lerp(minScale, maxScale, 0.1), maxScale);
//     } else {
//       targetScale = lerp(targetScale, minScale, 0.1);
//     }

//     // Apply scale to the instance matrix
//     matrix.scale(new THREE.Vector3(targetScale, targetScale, targetScale));
//     mesh.setMatrixAt(i, matrix);
//   }

//   mesh.instanceMatrix.needsUpdate = true;

//   // Apply the material properties to the whole mesh
//   const mat = materialRef.current;
//   if (mat) {
//     mat.color.lerp(new THREE.Color(0xe68989), 0.9);
//     mat.thickness = lerp(mat.thickness, 5, 0.9);
//     mat.reflectivity = lerp(mat.reflectivity, 0.5, 0.9);
//     mat.roughness = lerp(mat.roughness, 0.1, 0.9);
//     mat.clearcoat = lerp(mat.clearcoat, 0.1, 0.9);
//     mat.transmission = lerp(mat.transmission, 1.0, 0.9);
//     mat.ior = lerp(mat.ior, 2.1, 0.9);
//     mat.needsUpdate = true; // Ensure material is updated
//   }

//     mesh.instanceMatrix.needsUpdate = true;
//     meshRef.current.material.needsUpdate = true;
//     // console.log(meshRef.current.material);
//   });

//   return (
//     <group position={[0, 0, 0]}>
//       <instancedMesh
//         ref={meshRef}
//         args={[null, null, instanceCount]}
//         material={material}
//       >
//         <boxGeometry args={[cubeSize, cubeSize, cubeSize]} />
//       </instancedMesh>
//     </group>
//   );
// }
function DynamicGrid() {
  const meshRef = useRef();
  const materialRef = useRef();
  const transmissionMaterialRef = useRef();
  const { viewport, camera, pointer } = useThree();

  const cubeSize = 0.4;
  const spacingFactor = 4;
  const fullSize = -(cubeSize * spacingFactor) / 2;

  const cubesX = Math.ceil(viewport.width / (cubeSize * spacingFactor));
  const cubesY = Math.ceil(viewport.height / (cubeSize * spacingFactor));
  const instanceCount = cubesX * cubesY;

  const proximityRadius = 5; // Adjusted for better control
  const maxScale = 2; // Maximum scale for the cubes
  const minScale = 1.0; // Minimum scale for the cubes

  // Utility Functions
  const distance = (x1, y1, x2, y2) => {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
  };

  const map = (value, start1, stop1, start2, stop2) => {
    return ((value - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
  };

  function easeOutElastic(x) {
    const c4 = (2 * Math.PI) / 3;

    return x === 0 ? 0 : x === 1 ? 1 : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
  }

  // Define the material using MeshPhysicalMaterial
  // const material = useMemo(
  //   () =>
  //     new THREE.MeshPhysicalMaterial({
  //       color: 0xffffff,
  //       thickness: 1.0,
  //       reflectivity: 0.25,
  //       roughness: 0.0,
  //       clearcoat: 0.1,
  //       transmission: 1.0,
  //       ior: 1.5,
  //       iridescence: 1,
  //       iridescenceIOR: 1.3,
  //     }),
  //   []
  // );

  // const material = Object.assign(new MeshTransmissionMaterial(10), {
  //   clearcoat: 1,
  //   clearcoatRoughness: 0,
  //   transmission: 1,
  //   chromaticAberration: 2,
  //   // anisotrophy: 0.1,
  //   // backsideThickness: 0.15,
  //   // backside:true,
  //   // Set to > 0 for diffuse roughness
  //   roughness: 0,
  //   thickness: 0.95,
  //   ior: 1.25,
  //   // Set to > 0 for animation
  //   distortion: 1.95,
  //   distortionScale: 0.95,
  //   temporalDistortion: 0.95
  // })

  // Update the grid layout
  useEffect(() => {
    const mesh = meshRef.current;
    let index = 0;

    for (let i = 0; i < cubesX; i++) {
      for (let j = 0; j < cubesY; j++) {
        const id = index++;

        const position = new THREE.Vector3(
          i * cubeSize * spacingFactor - viewport.width / 2 + (cubeSize * spacingFactor) / 2,
          j * cubeSize * spacingFactor - viewport.height / 2 + (cubeSize * spacingFactor) / 2,
          0
        );

        mesh.setMatrixAt(id, new THREE.Matrix4().makeTranslation(position.x, position.y, position.z));
      }
    }

    mesh.instanceMatrix.needsUpdate = true;
  }, [cubesX, cubesY, viewport.width, viewport.height]);

  // for useframe
  const mesh = meshRef.current;

  const color = new THREE.Color(0xffffff); // Default color
  const targetColor = new THREE.Color(0xffffff); // Initial target color

  const colorArray = new Float32Array(instanceCount * 3); // 3 for RGB
  const colorAttribute = new THREE.InstancedBufferAttribute(colorArray, 3);
  if (mesh) {
    mesh.instanceColor = colorAttribute;
    mesh.geometry.setAttribute("color", colorAttribute);
  }

  // Store the mouse position
  const mouseRef = useRef(new THREE.Vector3(0, 0, 0));
  const pointLightRef = useRef();

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    const { width, height } = viewport.getCurrentViewport(camera, [0, 0, 0]);

    const x = (pointer.x * width) / 2;
    const y = (pointer.y * height) / 2;

// Smoothly move the light using lerp
pointLightRef.current.position.lerp(new THREE.Vector3(x, y, 0), 0.1);

    // Smooth the mouse position using damping
    const mousePosition = new THREE.Vector3(
      THREE.MathUtils.damp(mouseRef.current.x, x, 5, delta),
      THREE.MathUtils.damp(mouseRef.current.y, y, 4, delta),
      0
    );

    // Store the last mouse position for the next frame
    mouseRef.current.copy(mousePosition);

    const matrix = new THREE.Matrix4();
    const position = new THREE.Vector3();
    const scale = new THREE.Vector3();

    for (let i = 0; i < instanceCount; i++) {
      mesh.getMatrixAt(i, matrix);
      position.setFromMatrixPosition(matrix);

      // Calculate 2D distance from mouse to grid element
      const mouseDistance = distance(position.x, position.y, mousePosition.x, mousePosition.y);

      // Calculate distance from the center to determine max scale
      const distanceFromCenter = position.distanceTo(mousePosition);
      const maxCenterScale = map(distanceFromCenter, 0, proximityRadius, maxScale, minScale);

      // Map distance to scale range
      const targetScale = mouseDistance < proximityRadius ? maxCenterScale : minScale;

      // Get current scale, and apply easing.damp3 for smooth transition
      matrix.decompose(new THREE.Vector3(), new THREE.Quaternion(), scale);

      easing.damp3(scale, new THREE.Vector3(targetScale, targetScale, targetScale), delta, 0.01); // Smooth transition for scaling

      // Apply bounce effect when leaving proximity using a spring effect manually
      // if (targetScale === minScale && scale.x > minScale) {
      //   scale.set(
      //     Math.max(scale.x * 1.1, minScale), // More pronounced bounce down
      //     Math.max(scale.y * 1.1, minScale),
      //     Math.max(scale.z * 1.1, minScale)
      //   );
      // }
      // Apply new scale to matrix
      matrix.compose(position, new THREE.Quaternion(), scale);
      mesh.setMatrixAt(i, matrix);

      // Update material properties for items within proximity
      const mat = mesh.material;
      // console.log(mat);
      // if (mouseDistance < proximityRadius) {
      //   mat.color = new THREE.Color(0xe68989)
      //   // easing.dampC(mat.color, new THREE.Color(0xe68989), delta, 0.001); // Smooth color change
      //   // easing.dampC(ref.current.material.color, store.open ? '#f0f0f0' : '#ccc', 0.1, delta)
      //   mat.thickness =THREE.MathUtils.damp(mat.thickness, 5, 0.001, delta);
      //   // mat.reflectivity =THREE.MathUtils.damp(mat.reflectivity, 0.5, delta, 0.001);
      //   // mat.roughness =THREE.MathUtils.damp(mat.roughness, 0.1, delta, 0.001);
      //   // mat.clearcoat =THREE.MathUtils.damp(mat.clearcoat, 0.1, delta, 0.001);
      //   // mat.transmission =THREE.MathUtils.damp(mat.transmission, 1.0, delta, 0.001);
      //   // mat.ior =THREE.MathUtils.damp(mat.ior, 2.1, delta, 0.001);
      //   mat.needsUpdate = true;
      // } else {
      //   // Reset material properties when leaving proximity
      //   // easing.dampC(mat.color, new THREE.Color(0xffffff), delta, 0.001); // Smooth color reset
      //   // mat.thickness = THREE.MathUtils.damp(mat.thickness, 1, delta, 0.001);
      //   // mat.reflectivity = THREE.MathUtils.damp(mat.reflectivity, 0.5, delta, 0.001);
      //   // mat.roughness = THREE.MathUtils.damp(mat.roughness, 0.5, delta, 0.001);
      //   // mat.clearcoat = THREE.MathUtils.damp(mat.clearcoat, 0.1, delta, 0.001);
      //   // mat.transmission = THREE.MathUtils.damp(mat.transmission, 0.0, delta, 0.001);
      //   // mat.ior = THREE.MathUtils.damp(mat.ior, 1.5, delta, 0.001);
      //   mat.needsUpdate = true;
      // }

      // Change color only for items within proximity
      // if (mouseDistance < proximityRadius) {
      //   // Change color for this specific instance
      //   const instanceColor = new THREE.Color(0xe68989);
      //   mat.color.set(instanceColor);
      //   mat.needsUpdate = true; // Ensure material is updated
      // } else {
      //   // Reset color for this specific instance (optional)
      //   const defaultColor = new THREE.Color(0xffffff);
      //   mat.color.set(defaultColor);
      //   mat.needsUpdate = true; // Ensure material is updated
      // }
      // Update color based on proximity
      // const color = mouseDistance < proximityRadius ? new THREE.Color(0xe68989) : new THREE.Color(0xffffff);
      // Update color based on proximity
      if (mouseDistance < proximityRadius) {
        targetColor.set(0xe68989); // Color when in proximity
      } else {
        targetColor.set(0xffffff); // Default color
      }

      // Set color for the instance
      easing.dampC(color, targetColor, delta, 0.01);
      // color.lerp(targetColor, 0.1);
      colorAttribute.setXYZ(i, color.r, color.g, color.b);

      // Update material properties based on proximity
      // if (mouseDistance < proximityRadius) {
      //   // Example of animating roughness based on proximity
      //   mat.roughness = THREE.MathUtils.lerp(mat.roughness, 1.0, 0.1); // Smoothly reduce roughness
      //   // mat.clearcoat = THREE.MathUtils.lerp(mat.clearcoat, 1.0, 0.1); // Smoothly increase clearcoat
      // } else {
      //   // Reset material properties when leaving proximity
      //   mat.roughness = THREE.MathUtils.lerp(mat.roughness, 0, 0.1); // Smoothly increase roughness
      //   // mat.clearcoat = THREE.MathUtils.lerp(mat.clearcoat, 0.0, 0.1); // Smoothly decrease clearcoat
      // }

      mat.needsUpdate = true; // Ensure material is updated
    }
    const mat = mesh.material;
    // Mark color attribute for update
    mat.needsUpdate = true;
    colorAttribute.needsUpdate = true;
    mesh.instanceMatrix.needsUpdate = true;
  });

// Function to randomly change the light color
function randomColor() {
  return Math.random() * 0xffffff;
}

useEffect(() => {
  const interval = setInterval(() => {
    // Change the light color to a random color
    gsap.to(pointLightRef.current.color, {
      r: Math.random(),
      g: Math.random(),
      b: Math.random(),
      duration: 2, // Smooth color transition
      ease: "power2.inOut"
    });
  }, 3000); // Change color every 3 seconds

  return () => clearInterval(interval); // Cleanup on unmount
}, []);


  return (
    <group position={[0, 0, 0]}>
      <instancedMesh
        ref={meshRef}
        args={[null, null, instanceCount]}
        // material={material}
      >
        <boxGeometry args={[cubeSize, cubeSize, cubeSize]} />
        <MeshTransmissionMaterial
          ref={transmissionMaterialRef}
          thickness={0.95}
          anisotropy={0.1}
          chromaticAberration={2}
          backside={true}
          backsideThickness={0.15}
          samples={16}
          resolution={256}
          // _transmission={1}
          transmission={1}
          clearcoat={1}
          clearcoatRoughness={0.0}
          roughness={0.0}
          distortion={0.95}
          distortionScale={0.5}
          temporalDistortion={0.1}
          ior={1.25}
          // color='white'
          // shadow='#94cbff'
        />
      </instancedMesh>
      <pointLight ref={pointLightRef} intensity={500} />
    </group>
  );
}

const Griddy = () => {
  const ringRef = useRef();

  // Randomize Lightformer Colors
  const randomizeColor = () => {
    const colors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // useEffect(() => {
  //   // const lightformers = document.querySelectorAll('Lightformer');
  //   // lightformers.forEach(light => {
  //   //   light.material.color.set(randomizeColor());
  //   // });
  //   ringRef.current.color.set(randomizeColor())
  //   console.log(ringRef.current);
  // }, []);

  // Animate the ring rotation
  // useFrame(() => {
  //   ringRef.current.rotation.x += 0.01; // Rotate around X axis
  //   ringRef.current.rotation.y += 0.02; // Rotate around Y axis
  // });

  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 90 }}>
      <Perf position='top-right' />
      {/* <Environment preset='city' environmentIntensity={2.5} /> */}
      <Environment resolution={32} 
      // background
      >
        <group rotation={[-Math.PI / 4, -0.3, 0]}>
          <Lightformer intensity={1} rotation-x={Math.PI / 2} position={[0, 1, -5]} scale={[10, 10, 1]} color={randomizeColor()} />
          <Lightformer intensity={1} rotation-y={Math.PI / 2} position={[-5, -1, -1]} scale={[20, 2, 1]} color={randomizeColor()} />
          <Lightformer intensity={1} rotation-y={-Math.PI / 2} position={[5, 1, 0]} scale={[20, 2, 1]} color={randomizeColor()} />
          <Lightformer
            ref={ringRef}
            type='ring'
            intensity={2}
            color={randomizeColor()}
            rotation-y={Math.PI / 2}
            position={[-0.1, -1, -5]}
            scale={20}
          />
        </group>
      </Environment>
      <ambientLight intensity={1.5} />

      <DynamicGrid />
      {/* <OrbitControls /> */}
    </Canvas>
  );
};
export default Griddy;
// const { camera } = useThree();
// const [isFlat, setIsFlat] = useState(true);

//   //   Initial camera setup to give the 2D illusion
//   useEffect(() => {
//       camera.position.set(0, 0, 200);
//       camera.zoom = 40;
//       camera.updateProjectionMatrix();
//       setIsFlat(false);
//     }, [camera]);

// const tl = useRef(gsap.timeline({ paused: true, onUpdate: () => camera.updateProjectionMatrix() }));

// const handleHover = () => {
//   setIsFlat(false);

//   // Animate camera to transition into 3D mode
//   tl.current.clear().to(camera.position, {
//     duration: 0.5,
//     x: 0,
//     y: 0,
//     z: 5,
//     ease: "expo.out",
//   }).to(camera, {
//     duration: 0.5,
//     zoom: 1,
//     ease: "expo.out",
//     onUpdate: () => camera.updateProjectionMatrix(),
//   }).play();

//   // Animate material from plain to transmission
//   gsap.to(materialRef.current, {
//     duration: 0.5,
//     opacity: 0,
//     onComplete: () => {
//       meshRef.current.material = transmissionMaterialRef.current;
//     },
//   });
// };

// const handleOut = () => {
//   setIsFlat(true);

//   // Animate camera back to flat 2D illusion
//   tl.current.clear().to(camera.position, {
//     duration: 0.5,
//     x: 0,
//     y: 0,
//     z: 200,
//     ease: "expo.in",
//   }).to(camera, {
//     duration: 0.5,
//     zoom: 40,
//     ease: "expo.in",
//     onUpdate: () => camera.updateProjectionMatrix(),
//   }).play();

//   // Animate material back to plain
//   gsap.to(materialRef.current, {
//     duration: 0.5,
//     opacity: 1,
//     onComplete: () => {
//       meshRef.current.material = materialRef.current;
//     },
//   });
// };

// physical mesh working
// import React, { useRef, useState } from "react";
// import { Canvas, useFrame, useThree } from "@react-three/fiber";
// import { OrbitControls, useGLTF, useCubeTexture, MeshTransmissionMaterial } from "@react-three/drei";
// import { MeshPhysicalMaterial, Vector2, Raycaster } from "three";

// function Pickable({ geometry, material, position }) {
//   const meshRef = useRef();
//   const [hovered, setHovered] = useState(false);
//   const [clicked, setClicked] = useState(false);

//   useFrame((state, delta) => {
//     const mesh = meshRef.current;
//     if (mesh) {
//       mesh.rotation.x += delta;
//       mesh.rotation.y += delta;

//       const mat = mesh.material;
//       if (hovered) {
//         mat.color.lerp(new MeshPhysicalMaterial({ color: 0xff2244 }).color, 0.1);
//         mat.thickness = lerp(mat.thickness, 3, 0.1);
//         mat.reflectivity = lerp(mat.reflectivity, 1, 0.1);
//         mat.roughness = lerp(mat.roughness, 0.1, 0.1);
//         mat.clearcoat = lerp(mat.clearcoat, 0.1, 0.1);
//         mat.transmission = lerp(mat.transmission, 0.99, 0.1);
//         mat.ior = lerp(mat.ior, 1.1, 0.1);
//       } else {
//         mat.color.lerp(new MeshPhysicalMaterial({ color: material.color }).color, 0.1);
//         mat.thickness = lerp(mat.thickness, 0, 0.1);
//         mat.reflectivity = lerp(mat.reflectivity, 0, 0.1);
//         mat.roughness = lerp(mat.roughness, 1.0, 0.1);
//         mat.clearcoat = lerp(mat.clearcoat, 0, 0.1);
//         mat.transmission = lerp(mat.transmission, 0, 0.1);
//         mat.ior = lerp(mat.ior, 1.5, 0.1);
//       }

//       mesh.scale.set(
//         lerp(mesh.scale.x, clicked ? 1.5 : 1.0, 0.1),
//         lerp(mesh.scale.y, clicked ? 1.5 : 1.0, 0.1),
//         lerp(mesh.scale.z, clicked ? 1.5 : 1.0, 0.1)
//       );
//     }
//   });

//   const handlePointerOver = () => setHovered(true);
//   const handlePointerOut = () => setHovered(false);
//   const handleClick = () => setClicked(!clicked);

//   return (
//     <mesh
//       ref={meshRef}
//       geometry={geometry}
//       material={material}
//       position={position}
//       castShadow
//       onPointerOver={handlePointerOver}
//       onPointerOut={handlePointerOut}
//       onClick={handleClick}
//     />
//   );
// }

// function Scene() {
//   const { gl, scene, camera } = useThree();

//   // Geometry and Material Definitions
//   const cubeGeometry = new THREE.BoxGeometry();
//   const cubeMaterial = new MeshPhysicalMaterial({ color: 0xff8800 });

//   //   const cylinderGeometry = new THREE.CylinderGeometry(0.66, 0.66);
//   //   const cylinderMaterial = new MeshTransmissionMaterial({ color: 0x008800 });

//   const pyramidGeometry = new THREE.TetrahedronGeometry();
//   const pyramidMaterial = new MeshPhysicalMaterial({ color: 0x0088ff });

//   const mat = new MeshPhysicalMaterial({ color: 0xffffff,
//     dispersion: 5,
//     iridescence :1,
//     iridescenceIOR :2,

// });

//   const ref = useRef();
//   const [clicked, setClicked] = useState(false);

//   useFrame(({ viewport, camera, pointer }, delta) => {

//     ref.current.scale.set(
//       lerp(ref.current.scale.x, clicked ? 1.5 : 1.0, 0.1),
//       lerp(ref.current.scale.y, clicked ? 1.5 : 1.0, 0.1),
//       lerp(ref.current.scale.z, clicked ? 1.5 : 1.0, 0.1)
//     );

//     if (!clicked) {
//       mat.color.lerp(new MeshPhysicalMaterial({ color: 0xe68989 }).color, 0.1);
//       mat.thickness = lerp(mat.thickness, 5, 0.1);
//       mat.reflectivity = lerp(mat.reflectivity, 0.5, 0.1);
//       mat.roughness = lerp(mat.roughness, 0.1, 0.1);
//       mat.clearcoat = lerp(mat.clearcoat, 0.1, 0.1);
//       mat.transmission = lerp(mat.transmission, 1.0, 0.1);
//       mat.ior = lerp(mat.ior, 2.1, 0.1);
//     } else {e68989
//       mat.color.lerp(new MeshPhysicalMaterial({ color: mat.color }).color, 0.1);
//       mat.thickness = lerp(mat.thickness, 0, 0.1);
//       mat.reflectivity = lerp(mat.reflectivity, 0, 0.1);
//       mat.roughness = lerp(mat.roughness, 1.0, 0.1);
//       mat.clearcoat = lerp(mat.clearcoat, 0, 0.1);
//       mat.transmission = lerp(mat.transmission, 0, 0.1);
//       mat.ior = lerp(mat.ior, 1.5, 0.1);
//     }
//   });
//   const handleClick = () => {
//     setClicked(!clicked);
//   };
//   return (
//     <>
//       <ambientLight intensity={1.3} />
//       <spotLight
//         position={[5, 5, 5]}
//         angle={0.3}
//         penumbra={0.5}
//         castShadow
//         shadow-mapSize-width={512}
//         shadow-mapSize-height={512}
//         shadow-bias={-0.001}
//       />

//       {/* <Pickable geometry={cubeGeometry} material={cubeMaterial} position={[-2, 0, 0]} /> */}
//       {/* <Pickable geometry={cylinderGeometry} material={cylinderMaterial} /> */}
//       {/* <Pickable geometry={pyramidGeometry} material={pyramidMaterial} position={[2, 0, 0]} /> */}

//       <mesh
//         ref={ref}
//         onClick={handleClick}
//         material={mat}
//       >
//         <boxGeometry args={[1, 1, 1]} />

//       </mesh>

//       <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.25, 0]} receiveShadow>
//         <planeGeometry args={[10, 10]} />
//         <meshPhysicalMaterial color={"#f8dda2"} />
//       </mesh>

//       <OrbitControls enableDamping />
//     </>
//   );
// }

// function App() {
//   return (
//     <Canvas
//       camera={{ position: [0, 2, 4], fov: 75 }}
//       shadows
//       onCreated={({ gl }) => {
//         gl.shadowMap.enabled = true;
//         gl.shadowMap.type = THREE.VSMShadowMap;
//       }}
//     >
//       <Scene />
//     </Canvas>
//   );
// }

// export default App;
