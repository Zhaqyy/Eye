import * as THREE from "three";
import React, { useRef, useMemo, useState } from "react";
import { createNoise2D } from "../Helper/simplex-noise.js";
import { useFrame, useLoader, Canvas, useThree } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import bladeDiffuse from "/Texture/blade_diffuse.jpg";
import bladeAlpha from "/Texture/blade_alpha.jpg";
import "../Helper/GrassMaterial.jsx";

const noise2D = createNoise2D();

export default function Grass({ options = { bW: 0.1, bH: 1, joints: 5 }, width = 100, instances = 5000, ...props }) {
  const { bW, bH, joints } = options;
  const { viewport } = useThree();
  const materialRef = useRef();
  const [texture, alphaMap] = useLoader(THREE.TextureLoader, [bladeDiffuse, bladeAlpha]);

  // Dynamically calculate width based on viewport dimensions with extra buffer space
  const dynamicWidth = viewport.width * 1.25;
  const dynamicBW = options.bW * (viewport.width / 12); // Scale bW relative to the viewport width
  const dynamicBH = options.bH * (viewport.height / 15); // Scale bH relative to the viewport height

  const attributeData = useMemo(() => getAttributeData(instances, dynamicWidth), [instances, dynamicWidth]);
  // Generate base geometry for grass blades with dynamic dimensions
  const baseGeom = useMemo(
    () => new THREE.PlaneGeometry(dynamicBW, dynamicBH, 1, options.joints).translate(0, dynamicBH / 2, 0),
    [dynamicBW, dynamicBH, options.joints]
  );

  const groundGeo = useMemo(() => {
    const geo = new THREE.PlaneGeometry(dynamicWidth, dynamicWidth, 32, 32);
    geo.lookAt(new THREE.Vector3(0, 1, 0));
    const positionAttribute = geo.getAttribute("position");
    positionAttribute.needsUpdate = true;

    for (let i = 0; i < positionAttribute.count; i++) {
      const x = positionAttribute.getX(i);
      const z = positionAttribute.getZ(i);
      const y = getYPosition(x, z);

      positionAttribute.setY(i, y);
    }
    geo.computeVertexNormals();
    return geo;
  }, [dynamicWidth]);

  useFrame(({ clock, pointer }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = clock.elapsedTime * 0.25;
      const x = pointer.x;
      const y = pointer.y;
      materialRef.current.uniforms.mousePosition.value.set(x, y);
    }
  });

  return (
    <group position={[0, -3, -2]} rotation={[0,degreesToRadians(153),0]} {...props}>
      <mesh>
        <instancedBufferGeometry
          index={baseGeom.index}
          attributes-position={baseGeom.attributes.position}
          attributes-uv={baseGeom.attributes.uv}
        >
          <instancedBufferAttribute attach={"attributes-offset"} args={[new Float32Array(attributeData.offsets), 3]} />
          <instancedBufferAttribute attach={"attributes-orientation"} args={[new Float32Array(attributeData.orientations), 4]} />
          <instancedBufferAttribute attach={"attributes-stretch"} args={[new Float32Array(attributeData.stretches), 1]} />
          <instancedBufferAttribute attach={"attributes-halfRootAngleSin"} args={[new Float32Array(attributeData.halfRootAngleSin), 1]} />
          <instancedBufferAttribute attach={"attributes-halfRootAngleCos"} args={[new Float32Array(attributeData.halfRootAngleCos), 1]} />
        </instancedBufferGeometry>
        <grassMaterial ref={materialRef} map={texture} alphaMap={alphaMap} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0, 0]} geometry={groundGeo}>
        <meshStandardMaterial color='#000f00' />
      </mesh>
      {/* <GlowingPoints width={width} getYPosition={getYPosition} /> */}
    </group>
  );
}

const degreesToRadians = (degrees) => (degrees * Math.PI) / 180;

function getAttributeData(instances, width) {
  const offsets = [];
  const orientations = [];
  const stretches = [];
  const halfRootAngleSin = [];
  const halfRootAngleCos = [];

  let quaternion_0 = new THREE.Vector4();
  let quaternion_1 = new THREE.Vector4();

  const min = -0.25;
  const max = 0.25;

  for (let i = 0; i < instances; i++) {
    const offsetX = Math.random() * width - width / 2;
    const offsetZ = Math.random() * width - width / 2;
    const offsetY = getYPosition(offsetX, offsetZ);
    offsets.push(offsetX, offsetY, offsetZ);

    let angle = Math.PI - Math.random() * (2 * Math.PI);
    halfRootAngleSin.push(Math.sin(0.5 * angle));
    halfRootAngleCos.push(Math.cos(0.5 * angle));

    let RotationAxis = new THREE.Vector3(0, 1, 0);
    let x = RotationAxis.x * Math.sin(angle / 2.0);
    let y = RotationAxis.y * Math.sin(angle / 2.0);
    let z = RotationAxis.z * Math.sin(angle / 2.0);
    let w = Math.cos(angle / 2.0);
    quaternion_0.set(x, y, z, w).normalize();

    angle = Math.random() * (max - min) + min;
    RotationAxis = new THREE.Vector3(1, 0, 0);
    x = RotationAxis.x * Math.sin(angle / 2.0);
    y = RotationAxis.y * Math.sin(angle / 2.0);
    z = RotationAxis.z * Math.sin(angle / 2.0);
    w = Math.cos(angle / 2.0);
    quaternion_1.set(x, y, z, w).normalize();

    quaternion_0 = multiplyQuaternions(quaternion_0, quaternion_1);

    angle = Math.random() * (max - min) + min;
    RotationAxis = new THREE.Vector3(0, 0, 1);
    x = RotationAxis.x * Math.sin(angle / 2.0);
    y = RotationAxis.y * Math.sin(angle / 2.0);
    z = RotationAxis.z * Math.sin(angle / 2.0);
    w = Math.cos(angle / 2.0);
    quaternion_1.set(x, y, z, w).normalize();

    quaternion_0 = multiplyQuaternions(quaternion_0, quaternion_1);

    orientations.push(quaternion_0.x, quaternion_0.y, quaternion_0.z, quaternion_0.w);

    if (i < instances / 3) {
      stretches.push(Math.random() * 1.8);
    } else {
      stretches.push(Math.random());
    }
  }

  return {
    offsets,
    orientations,
    stretches,
    halfRootAngleCos,
    halfRootAngleSin,
  };
}

function multiplyQuaternions(q1, q2) {
  const x = q1.x * q2.w + q1.y * q2.z - q1.z * q2.y + q1.w * q2.x;
  const y = -q1.x * q2.z + q1.y * q2.w + q1.z * q2.x + q1.w * q2.y;
  const z = q1.x * q2.y - q1.y * q2.x + q1.z * q2.w + q1.w * q2.z;
  const w = -q1.x * q2.x - q1.y * q2.y - q1.z * q2.z + q1.w * q2.w;
  return new THREE.Vector4(x, y, z, w);
}
const newX = 3;
const newZ = 5;
function getYPosition(newX, newZ) {
  var y = 2 * noise2D(newX / 50, newZ / 50);
  y += 4 * noise2D(newX / 100, newZ / 100);
  y += 0.2 * noise2D(newX / 10, newZ / 10);
  return y;
}

function GlowingPoints({ width, getYPosition }) {
  const pointsRef = useRef();
  const [hovered, setHover] = useState(false);
  const points = useMemo(() => {
    const pointsArray = [];
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * width - width / 2;
      const z = Math.random() * width - width / 2;
      const y = getYPosition(x, z) + 0.5;
      pointsArray.push(new THREE.Vector3(x, y, z));
    }
    return pointsArray;
  }, [width, getYPosition]);
  // useFrame(state => {
  //   if (hovered !== null) {
  //     // pointsRef.current.geometry.attributes.itemSize.needsUpdate = true;
  //     pointsRef.current.geometry.attributes.itemSize.array[hovered] = 20;
  //   }
  // });
  if (pointsRef.current) {
    console.log(pointsRef.current.geometry.attributes);
  }
  return (
    <points
      ref={pointsRef}
      color={hovered ? "hotpink" : "orange"}
      onPointerOver={e => (e.stopPropagation(), setHover(true))}
      onPointerOut={e => setHover(false)}
    >
      <bufferGeometry attach='geometry'>
        <bufferAttribute
          attach='attributes-position'
          array={new Float32Array(points.flatMap(point => point.toArray()))}
          count={points.length}
          itemSize={3}
        />
      </bufferGeometry>
      <PointMaterial size={1} transparent sizeAttenuation color='blue' />
    </points>
  );
}
