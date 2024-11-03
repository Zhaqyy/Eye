// VolLight.js
import React from "react";
import * as THREE from "three";
import FakeGlowMaterial from "./FakeGlowMaterial";

/**
 * VolLight Component
 * A versatile volumetric light component for Three.js and React Three Fiber.
 * By default, it creates a circular volumetric light, but if custom child geometry
 * is provided, it will use that instead.
 *
 * @param {string} color - Color of the volumetric light glow.
 * @param {number} opacity - Opacity of the volumetric light effect.
 * @param {number} length - Length of the default circular light geometry.
 * @param {number} radius - Radius for alternative geometries (like cones).
 * @param {...object} prop - Additional properties for the mesh.
 */
const VolLight = ({
  color = "white",
  opacity = 0.5,
  fallOff = 0.85,
  glowSharpness = -0.25,
  length = 10,
  radius = 1,
  children,
  ...prop
}) => {
  return (
    <mesh {...prop}>
      {/* Conditional geometry rendering:
          If no children (custom geometry) is passed, use the default circleGeometry.
          Otherwise, render the child geometry as a volumetric light. */}
      {!children ? <circleGeometry args={[length, 4, 0, Math.PI]} /> : children}

      {/* FakeGlowMaterial for creating a glowing volumetric effect
          Using a custom material that takes color, falloff, and other properties */}
      <FakeGlowMaterial
        falloff={fallOff} // Controls the rate of fading
        glowColor={color} // Sets the color of the glow
        glowSharpness={glowSharpness} // Controls the sharpness of the glow effect
        opacity={opacity} // Controls transparency
        // side={THREE.FrontSide} // Ensures the light renders only on the front side
        depthTest={true} // Allows proper depth sorting
      />
    </mesh>
  );
};

export default VolLight;
