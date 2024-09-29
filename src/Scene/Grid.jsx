import React, { useEffect, useRef, useState } from "react";
import { Canvas, invalidate, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Center, Environment, Lightformer, MeshTransmissionMaterial, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { gsap } from "gsap";
import { Perf } from "r3f-perf";
import { useGSAP } from "@gsap/react";

function lerp(x, y, a) {
  const r = (1 - a) * x + a * y;
  return r < 0.001 ? 0 : r;
}

function DynamicGrid() {
  const meshRef = useRef();
  const { viewport, pointer, size, mouse } = useThree();

  // Define cube size and spacing
  const cubeSize = 0.4;
  const spacingFactor = 4; // Multiply by cubeSize to add spacing between cubes
  const fullSize = -(cubeSize * spacingFactor) / 2;
  // Calculate number of cubes based on screen size
  const cubesX = Math.ceil(viewport.width / (cubeSize * spacingFactor)); // Adjusted for spacing
  const cubesY = Math.ceil(viewport.height / (cubeSize * spacingFactor)); // Adjusted for spacing

  const instanceCount = cubesX * cubesY;

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

  const materialRef = useRef();
  const transmissionMaterialRef = useRef();
  const { contextSafe } = useGSAP();

  //   const tl = useRef(gsap.timeline({ paused: true}));
  //   const handleHover = contextSafe(() => {
  //     //   console.log(meshRef.current.material.transmission);
  //     // Animate material from plain to transmission
  //     invalidate(); // Trigger a re-render
  //     gsap.to(meshRef.current.material, {
  //       duration: 0.5,
  //       transmission: 1,
  //       ease: "power2.out",
  //     });
  //   });

  //   const handleOut = contextSafe(() => {
  //     // Animate material back to plain
  //     invalidate(); // Trigger a re-render
  //     gsap.to(meshRef.current.material, {
  //       duration: 0.5,
  //       transmission: 0,
  //       ease: "power2.in",
  //     });
  //   });

  //   const handlePointerMove = contextSafe(event => {
  //     const { clientX, clientY } = event;
  //     const rect = event.target.getBoundingClientRect();
  //     const mouseX = (clientX / rect.width) * 2 - 1;
  //     const mouseY = -(clientY / rect.height) * 2 + 1;

  //     const thresholdDistance = 2; // The distance radius in which the effect will apply

  //     meshRef.current.getMatrixAt(0, new THREE.Matrix4()); // Example getting one matrix, adjust to get the closest instanced boxes
  //     // Calculate distance and scale or apply the material changes based on proximity
  //   });

  // const handleHover = contextSafe(() => {
  //     invalidate(); // Trigger a re-render on hover
  //     gsap.to(meshRef.current.material, {
  //       duration: 0.5,
  //       transmission: 1,
  //       ease: "power2.out",
  //       onComplete: () => {
  //               meshRef.current.material.needsUpdate
  //             },
  //     });
  //   });

  //   // Hover out
  //   const handleOut = contextSafe(() => {
  //     invalidate(); // Trigger a re-render when hover ends
  //     gsap.to(meshRef.current.material, {
  //       duration: 0.5,
  //       transmission: 0,
  //       ease: "power2.in",
  //     });
  //   });

  const proximityRadius = 2;
  const scaleCube = cubeSize * (cubeSize / 2);

//   useFrame(() => {
//     const mesh = meshRef.current;
//     const mousePosition = new THREE.Vector2(pointer.x * viewport.width, pointer.y * viewport.height);

//     for (let i = 0; i < instanceCount; i++) {
//       const matrix = new THREE.Matrix4();
//       mesh.getMatrixAt(i, matrix);
//       const position = new THREE.Vector3();
//       position.setFromMatrixPosition(matrix);

//       // Calculate distance to mouse
//       const distance = position.distanceTo(new THREE.Vector3(mousePosition.x, mousePosition.y, 0));

//       let scaleFactor = 1;
//       let transmission = 0;

//       if (distance < proximityRadius) {
//         // Lerp scale up to scaleCube size
//         scaleFactor = lerp(1, scaleCube, (proximityRadius - distance) / proximityRadius);
//         // Lerp transmission to make it more transparent
//         transmission = lerp(0, 1, (proximityRadius - distance) / proximityRadius);
//       } else {
//         // Lerp back to normal size and transmission
//         scaleFactor = lerp(scaleFactor, 1, 0.1);
//         transmission = lerp(transmission, 0, 0.1);
//       }

//       // Apply scale back to the matrix
//       matrix.scale(new THREE.Vector3(scaleFactor, scaleFactor, scaleFactor));
//       mesh.setMatrixAt(i, matrix);

//       // Get material and update transmission
//       const m = mesh.material;
//       m.transmission = lerp(m.transmission, transmission, 0.1); // Lerp transmission

//       // Update instance matrix and material
//       mesh.instanceMatrix.needsUpdate = true;
//       mesh.material.needsUpdate = true;
//     }
//   });

// Function to convert screen space mouse coordinates to world space
const screenToWorldPosition = (mouse, viewport, size) => {
    return new THREE.Vector3(
      (mouse.x * viewport.width) / 2,
      (mouse.y * viewport.height) / 2,
      0
    );
  };

  useFrame(() => {
    const mesh = meshRef.current;
    // const mousePosition = screenToWorldPosition(mouse, viewport, size);

    // const matrix = new THREE.Matrix4();
    // const position = new THREE.Vector3();
    // for (let i = 0; i < instanceCount; i++) {
    //   mesh.getMatrixAt(i, matrix);
    //   position.setFromMatrixPosition(matrix);

    //   // Calculate distance from the mouse to each cube
    //   const distance = position.distanceTo(mousePosition);

    //   // Scale and transmission lerp based on proximity
    //   let targetScale = scaleCube;
    //   let targetTransmission = 0;

    //   if (distance < proximityRadius) {
    //     const scaleFactor = (proximityRadius - distance) / proximityRadius;
    //     targetScale = lerp(cubeSize, scaleCube, 0.05);
    //     targetTransmission = lerp(0, 1, scaleFactor);
    //   } else {
    //     targetScale = lerp(scaleCube, cubeSize, 0.05); // Lerp back to original size
    //     targetTransmission = lerp(targetTransmission, 0, 0.1); // Lerp back to original transmission
    //   }

    //   // Apply scale back to the matrix
    //   matrix.scale(new THREE.Vector3(targetScale, targetScale, targetScale));
    //   mesh.setMatrixAt(i, matrix);

    //   // Get the material and update transmission
    //   const material = mesh.material;
    //   material.transmission = lerp(material.transmission, targetTransmission, 0.1); // Lerp transmission
    // }

    console.log(meshRef.current.material.transmission);
    // Ensure mesh updates are applied
    // mesh.instanceMatrix.needsUpdate = true;
    mesh.material.needsUpdate = true;
  });

const handleHover = () => {
    meshRef.current.material.transmission = lerp(0,1, 0.2)
  };

  const handleOut = () => {
    meshRef.current.material.transmission = lerp(1,0, 0.2)
  };
return (
    <group position={[fullSize, 0, 0]}>
      <instancedMesh 
      ref={meshRef} 
      args={[null, null, instanceCount]} 
    //   onPointerOver={handleHover} onPointerOut={handleOut}
    // onPointerOver={(event) => {
    //     const material = meshRef.current.material;
    //     material.transmission = lerp(material.transmission, 1, 0.9); // Lerp to 1 on hover
    //     meshRef.current.material.needsUpdate = true;
    //   }}
    //   onPointerOut={(event) => {
    //     const material = meshRef.current.material;
    //     material.transmission = lerp(material.transmission, 0, 0.9); // Lerp to 0 on hover out
    //     meshRef.current.material.needsUpdate = true;
    //   }}
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
          resolution={1024}
          transmission={1}
          clearcoat={1}
          clearcoatRoughness={0.0}
          roughness={0.0}
          distortion={0.95}
          distortionScale={0.5}
          temporalDistortion={0.1}
          ior={1.25}
          color='white'
          shadow='#94cbff'
        />
        {/* <meshStandardMaterial ref={materialRef} color={"orange"} emissive={"orange"} roughness={0.5} /> */}
      </instancedMesh>
    </group>
  );
}

function Griddy() {
  const ringRef = useRef();

  // Randomize Lightformer Colors
  const randomizeColor = () => {
    const colors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  //   useEffect(() => {
  //     const lightformers = document.querySelectorAll('Lightformer');
  //     lightformers.forEach(light => {
  //       light.material.color.set(randomizeColor());
  //     });
  //   }, []);

  // Animate the ring rotation
  //   useFrame(() => {
  //     ringRef.current.rotation.x += 0.01; // Rotate around X axis
  //     ringRef.current.rotation.y += 0.02; // Rotate around Y axis
  //   });

  return (
    <Canvas>
      <Perf position='top-left' />
      {/* <Environment preset='night' environmentIntensity={1.5} /> */}
      <Environment resolution={32}>
        <group rotation={[-Math.PI / 4, -0.3, 0]}>
          <Lightformer intensity={20} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={[10, 10, 1]} />
          <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={[10, 2, 1]} />
          <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-5, -1, -1]} scale={[10, 2, 1]} />
          <Lightformer intensity={2} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={[20, 2, 1]} />
          <Lightformer
            ref={ringRef}
            type='ring'
            intensity={2}
            color={randomizeColor()}
            rotation-y={Math.PI / 2}
            position={[-0.1, -1, -5]}
            scale={10}
          />
        </group>
      </Environment>
      <ambientLight intensity={1.5} />
      {/* <directionalLight position={[5, 5, 5]} /> */}
      {/* debug */}
      {/* <mesh>
      <boxGeometry args={[1, 1, 1]} />
        <MeshTransmissionMaterial
        //   ref={transmissionMaterialRef}
          thickness={0.2}
          anisotropy={0.1}
          chromaticAberration={0.04}
          backside={true}
          backsideThickness={0.15}
          samples={16}
          resolution={1024}
          transmission={1}
          clearcoat={1}
          clearcoatRoughness={0.0}
          roughness={0.5}
          distortion={0.5}
          distortionScale={0.1}
          temporalDistortion={0}
          ior={1.25}
          color='white'
          shadow='#94cbff'
        />
      </mesh> */}
      <DynamicGrid />
      <OrbitControls />
    </Canvas>
  );
}
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
