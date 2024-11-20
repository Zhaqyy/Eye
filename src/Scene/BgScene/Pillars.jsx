import * as THREE from "three";
import React, { useRef, useState, useEffect, forwardRef, memo, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { EllipseCurve, CatmullRomCurve3, Vector3 } from "three";
import FakeGlowMaterial from "../Helper/FakeGlowMaterial.jsx";
import { Billboard, Shadow, Sparkles } from "@react-three/drei";
import { Depth, LayerMaterial } from "lamina";
import useIsMobile from "../../Component/isMobile.jsx";
function Pillar({ isMobile, ...props }) {
  const sphereRef = useRef();
  const lightRef = useRef();
  const { pointer, viewport } = useThree();
  const [mouseY, setMouseY] = useState(0);

  // Define a half-circle path
  const mobileRadius = viewport.width * 0.5;
  const halfEllipseCurve = useMemo(() => {
    // Use different dimensions based on the `isMobile` prop
    return isMobile
      ? new EllipseCurve(0, 0, mobileRadius, 1, 0, Math.PI, false, 0) // Mobile dimensions
      : new EllipseCurve(0, 0, 2, 1, 0, Math.PI, false, 0); // Desktop dimensions
  }, [isMobile, viewport]);

  const pathPoints = useMemo(() => halfEllipseCurve.getPoints(50).map(p => new Vector3(p.x, p.y, 0)), [halfEllipseCurve]);
  const curve = useMemo(() => new CatmullRomCurve3(pathPoints, false), [pathPoints]);

  // Tube height limits for clamping
  const minY = pathPoints[0].y; // Bottom of the tube
  const maxY = pathPoints[pathPoints.length - 1].y; // Top of the tube

  // Smooth the mouseY value using lerp
  useFrame(() => {
    const targetY = isMobile ? -pointer.x : pointer.y; // Use x-axis for mobile, y-axis for desktop
    const lerpedY = mouseY + (targetY - mouseY) * 0.02; // Apply lerp directly to mouseY state
    setMouseY(lerpedY); // Update state with interpolated value

    // Update sphere position along the path based on lerped mouseY
    if (sphereRef.current) {
      const pathPosition = (lerpedY + 1) / 2; // Normalized from -1 to 1
      const pointOnPath = curve.getPoint(pathPosition);

      // Apply an offset on x-axis for peeking effect
      sphereRef.current.position.set(pointOnPath.x, pointOnPath.y - 0.5, pointOnPath.z);
    }

    // Update point light position with clamped y-value
    if (lightRef.current) {
      const clampedY = Math.min(Math.max(lerpedY * (maxY - minY) + minY, minY), maxY);
      lightRef.current.position.set(0, lerpedY, -2); // Only updating y-axis, x and z remain constant
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

      {/* Moving point light */}
      <pointLight ref={lightRef} position={[0, 0, -2]} color='red' intensity={25} />
    </group>
  );
}

// Wrapper component for rendering two instances with unique keys and positioning
export default function Pillars() {
  const isMobile = useIsMobile(800);
  return (
    <>
      <Pillar
        key='pillar1'
        isMobile={isMobile}
        position={isMobile ? [0, 2, 0] : [3.5, 0, 0]}
        rotation={isMobile ? [Math.PI / 6 , 0, 0] : [0, -Math.PI / 6, -Math.PI / 2]}
        visible={true}
      />
      <Pillar key='pillar2' position={[-3.5, 0, 0]} rotation={[Math.PI, -Math.PI / 6, Math.PI / 2]} visible={!isMobile} />
    </>
  );
}

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
