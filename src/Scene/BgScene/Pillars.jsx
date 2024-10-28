import * as THREE from "three";
import React, { useRef, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { EllipseCurve, CatmullRomCurve3, Vector3 } from "three";

function Pillar(props) {
  const sphereRef = useRef();
  const { pointer } = useThree();
  const [mouseY, setMouseY] = useState(0);

  // Define a half-circle path
  const halfEllipseCurve = new EllipseCurve(0, 0, 2, 1, 0, Math.PI, false, 0);
  const pathPoints = halfEllipseCurve.getPoints(50).map((p) => new Vector3(p.x, p.y, 0));
  const curve = new CatmullRomCurve3(pathPoints, false);

  // Smooth the mouseY value using lerp
  useFrame(() => {
    const targetY = pointer.y;  // Pointer's raw y position
    const lerpedY = mouseY + (targetY - mouseY) * 0.02;  // Apply lerp directly to mouseY state
    setMouseY(lerpedY);  // Update state with interpolated value

    // Update sphere position along the path based on lerped mouseY
    if (sphereRef.current) {
      const pathPosition = (lerpedY + 1) / 2;  // Normalized from -1 to 1
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
        <meshStandardMaterial color={"#242424"} />
      </mesh>

      {/* Circular end caps */}
      <mesh position={pathPoints[0]} rotation={[Math.PI / 2, 0, Math.PI / 2]}>
        <circleGeometry args={[0.25, 5]} />
        <meshStandardMaterial color={"#242424"} />
      </mesh>
      <mesh position={pathPoints[pathPoints.length - 1]} rotation={[Math.PI / 2, 0, Math.PI / 2]}>
        <circleGeometry args={[0.25, 5]} />
        <meshStandardMaterial color={"#242424"} />
      </mesh>

      {/* Sphere following the path */}
      <mesh ref={sphereRef} position={[0, 0, 0]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color={"#ff6347"} emissive={"#ff6347"} emissiveIntensity={0.6} />
      </mesh>
    </group>
  );
}

// Wrapper component for rendering two instances with unique keys and positioning
export default function Pillars() {
  return (
    <>
      <Pillar key="pillar1"  position={[3.5, 0, 0]} rotation={[0, 0, -Math.PI / 2]}/>
      <Pillar key="pillar2" position={[-3.5, 0, 0]} rotation={[Math.PI , 0, Math.PI / 2]} />
    </>
  );
}
