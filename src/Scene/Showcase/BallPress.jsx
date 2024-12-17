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
import useIsMobile from "../../Component/isMobile";

function DynamicGrid() {
  const meshRef = useRef();
  const sphereRef = useRef();
  const { camera, pointer, raycaster } = useThree();
  const isMobile = useIsMobile(700);
  const cubeSize = 0.5; // Size of each cube
  const spacingFactor = 1.25; // Spacing between cubes
  const proximityRadius = isMobile ? 2 : 5; // Mouse proximity radius
  const depressionAmount = 10; // Maximum depression amount

  const cubesX = Math.abs(Math.ceil((camera.left * 2) / camera.position.z / (cubeSize * spacingFactor)));
  const cubesY = Math.abs(Math.ceil((camera.top * 2) / camera.position.z / (cubeSize * spacingFactor)));
  const instanceCount = cubesX * cubesY;

  // Add a grid plane for raycasting
  const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

  // Smoothly interpolated mouse position
  const mousePosition = useRef(new THREE.Vector3(0, 0, 0));

  // Pastel color palette
  const pastelColors = [0xffd1dc, 0xffc8a2, 0xfff5ba, 0xe3ffc4, 0xc4fff9, 0xc4dfff, 0xd0bcff, 0xf4c4ff, 0xffb6c1, 0xb5eadd];

  const randomizeColor = () => pastelColors[Math.floor(Math.random() * pastelColors.length)];
  const tagCol = randomizeColor();

  // Precompute colors
  const targetColor = new THREE.Color(tagCol);
  const defaultColor = new THREE.Color(0x000000);

  // Color attribute array
  const colorArray = new Float32Array(instanceCount * 3); // RGB values
  const colorAttribute = new THREE.InstancedBufferAttribute(colorArray, 3);

  useEffect(() => {
    const mesh = meshRef.current;
    const matrix = new THREE.Matrix4();
    let index = 0;

    // Initialize instance positions and colors
    for (let i = 0; i < cubesX; i++) {
      for (let j = 0; j < cubesY; j++) {
        const x = i * cubeSize * spacingFactor - (cubesX * cubeSize * spacingFactor) / 2;
        const z = j * cubeSize * spacingFactor - (cubesY * cubeSize * spacingFactor) / 2;

        matrix.setPosition(x, 0, z);
        mesh.setMatrixAt(index, matrix);

        // Set default color to all cubes
        defaultColor.toArray(colorArray, index * 3);
        index++;
      }
    }

    mesh.instanceMatrix.needsUpdate = true;
    colorAttribute.needsUpdate = true;

    // Attach color attribute to geometry
    mesh.geometry.setAttribute("color", colorAttribute);
  }, [cubesX, cubesY]);

  // Update cube positions, colors, and sphere position
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

      // Update color based on proximity
      const proximityFactor = distanceToMouse < proximityRadius ? THREE.MathUtils.mapLinear(distanceToMouse, 0, proximityRadius, 1, 0) : 0;
      const blendedColor = defaultColor.clone().lerp(targetColor, proximityFactor);
      blendedColor.toArray(colorArray, i * 3);
    }

    mesh.instanceMatrix.needsUpdate = true;
    colorAttribute.needsUpdate = true;
  });

  return (
    <group>
      {/* Rolling Sphere */}
      <mesh ref={sphereRef} position={[0, 0, 0]}>
        <sphereGeometry args={[isMobile ? 1 : 2.5, 32, 32]} />
        <meshPhongMaterial shininess={100} color={tagCol} specular={"#ffffff"} combine={THREE.AddOperation} />
      </mesh>

      {/* Instanced Grid */}
      <instancedMesh ref={meshRef} args={[null, null, instanceCount]} geometry={new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize)}>
        <meshStandardMaterial vertexColors roughness={0.5} metalness={0} />
      </instancedMesh>
    </group>
  );
}

const BallPress = () => {
  // Randomize Lightformer Colors
  const randomizeColor = () => {
    const colors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
      <Canvas>
        <color attach='background' args={["#606060"]} />
        <OrthographicCamera makeDefault zoom={40} position={[10, 90, 20]} />
        <Environment resolution={32}>
          <group rotation={[-Math.PI / 4, -0.3, 0]}>
            <Lightformer intensity={1} rotation-x={Math.PI / 2} position={[0, 1, -5]} scale={[10, 10, 1]} color={randomizeColor()} />
            <Lightformer intensity={1} rotation-y={Math.PI / 2} position={[-5, -1, -1]} scale={[20, 2, 1]} color={randomizeColor()} />
            <Lightformer intensity={1} rotation-y={-Math.PI / 2} position={[5, 1, 0]} scale={[20, 2, 1]} color={randomizeColor()} />
            <Lightformer type='ring' intensity={2} color={randomizeColor()} rotation-y={Math.PI / 2} position={[-0.1, -1, -5]} scale={20} />
          </group>
        </Environment>
        <ambientLight intensity={1} />
        <pointLight intensity={10} position={[0, 5, 0]} />
        <DynamicGrid />
        <OrbitControls enabled={false} enableZoom={false} enablePan={false} enableRotate={false} />
      </Canvas>
  );
};
export default BallPress;
