import * as THREE from "three";
import React, { useRef, useState, useEffect, forwardRef, memo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { EllipseCurve, CatmullRomCurve3, Vector3 } from "three";
import FakeGlowMaterial from "../Helper/FakeGlowMaterial.jsx";
import { Billboard, Shadow, Sparkles } from "@react-three/drei";
import { Depth, LayerMaterial } from "lamina";
function Pillar(props) {
  const sphereRef = useRef();
  const { pointer } = useThree();
  const [mouseY, setMouseY] = useState(0);

  // Define a half-circle path
  const halfEllipseCurve = new EllipseCurve(0, 0, 2, 1, 0, Math.PI, false, 0);
  const pathPoints = halfEllipseCurve.getPoints(50).map(p => new Vector3(p.x, p.y, 0));
  const curve = new CatmullRomCurve3(pathPoints, false);

  // Smooth the mouseY value using lerp
  useFrame(() => {
    const targetY = pointer.y; // Pointer's raw y position
    const lerpedY = mouseY + (targetY - mouseY) * 0.02; // Apply lerp directly to mouseY state
    setMouseY(lerpedY); // Update state with interpolated value

    // Update sphere position along the path based on lerped mouseY
    if (sphereRef.current) {
      const pathPosition = (lerpedY + 1) / 2; // Normalized from -1 to 1
      const pointOnPath = curve.getPoint(pathPosition);

      // Apply an offset on x-axis for peeking effect
      sphereRef.current.position.set(pointOnPath.x, pointOnPath.y - 0.5, pointOnPath.z);
    }
  });

  return (
    <group {...props}>
      {/* Half-circle tube */}
      <mesh>
        <tubeGeometry args={[curve, 16, 0.25, 5, false]} />
        <meshPhongMaterial color={"#242424"} shininess={100} />
      </mesh>

      {/* Circular end caps */}
      <mesh position={pathPoints[0]} rotation={[Math.PI / 2, 0, Math.PI / 2]}>
        <circleGeometry args={[0.25, 5]} />
        <meshPhongMaterial color={"#242424"} shininess={100} />
      </mesh>
      <mesh position={pathPoints[pathPoints.length - 1]} rotation={[Math.PI / 2, 0, Math.PI / 2]}>
        <circleGeometry args={[0.25, 5]} />
        <meshPhongMaterial color={"#242424"} shininess={100} />
      </mesh>
      {/* Sphere following the path */}
      <Sphere ref={sphereRef} color='#ff0000' amount={20} emissive='#ff0000' glow='#ff0000' size={0.25} />
    </group>
  );
}

// Wrapper component for rendering two instances with unique keys and positioning
export default function Pillars() {
  return (
    <>
      <Pillar key='pillar1' position={[3.5, 0, 0]} rotation={[0, -Math.PI / 6, -Math.PI / 2]} />
      <Pillar key='pillar2' position={[-3.5, 0, 0]} rotation={[Math.PI, -Math.PI / 6, Math.PI / 2]} />
    </>
  );
}

// <FakeGlowMaterial
//   falloff={0.25}
//   glowInternalRadius={1.0}
//   glowColor={"#ff0000"}
//   glowSharpness={1}
//   side={"THREE.FrontSide"}
//   opacity={1.0}
// />

// Sphere with memoization for improved performance
const Sphere = React.memo(
  forwardRef(({ size = 1, amount = 50, color = "white", emissive, glow, ...props }, ref) => (
    <mesh {...props} ref={ref}>
      <sphereGeometry args={[size, 64, 64]} />
      <meshStandardMaterial roughness={0} color={color} emissive={emissive || color} envMapIntensity={0.2} />
      <Glow scale={0.75} near={-25} color={glow || emissive || color} />
    </mesh>
  ))
);

// Glow with memoization
const Glow = memo(({ color, scale = 0.5, near = -2, far = 1.4 }) => (
  <Billboard>
    <mesh>
      <circleGeometry args={[2 * scale, 16]} />
      <LayerMaterial
        transparent
        depthWrite={false}
        blending={THREE.CustomBlending}
        blendEquation={THREE.AddEquation}
        blendSrc={THREE.SrcAlphaFactor}
        blendDst={THREE.DstAlphaFactor}
      >
        <Depth colorA={color} colorB='black' alpha={1} mode='normal' near={near * scale} far={far * scale} origin={[0, 0, 0]} />
        <Depth colorA={color} colorB='black' alpha={0.5} mode='add' near={-40 * scale} far={far * 1.2 * scale} origin={[0, 0, 0]} />
        <Depth colorA={color} colorB='black' alpha={1} mode='add' near={-15 * scale} far={far * 0.7 * scale} origin={[0, 0, 0]} />
        <Depth colorA={color} colorB='black' alpha={1} mode='add' near={-10 * scale} far={far * 0.68 * scale} origin={[0, 0, 0]} />
      </LayerMaterial>
    </mesh>
  </Billboard>
));
