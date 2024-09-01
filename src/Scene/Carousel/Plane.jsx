import * as THREE from "three";
import { useEffect, useMemo, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
// import gsap from "gsap";
import useGPGPU from "./Gpgpu"; // Assuming this is where the hook is defined

const Plane = ({ texture, width, height, active, ...props }) => {
  const $mesh = useRef();
  const { viewport, gl: renderer } = useThree();
  const tex = useTexture(texture);

  // GPGPU params
  const gpgpuParams = useMemo(
    () => ({
      relaxation: 0.965,
      size: 64,
      distance: 0.25,
      strengh: 0.8,
    }),
    []
  );

  // Use GPGPU hook
  const { compute, getTexture, updateMouse } = useGPGPU({
    renderer,
    size: gpgpuParams.size,
    params: gpgpuParams,
  });

  // useEffect(() => {
  //   if ($mesh.current.material) {
  //     $mesh.current.material.uniforms.uZoomScale.value.x = viewport.width / width;
  //     $mesh.current.material.uniforms.uZoomScale.value.y = viewport.height / height;

  //     gsap.to($mesh.current.material.uniforms.uProgress, {
  //       value: active ? 1 : 0,
  //     });

  //     gsap.to($mesh.current.material.uniforms.uRes.value, {
  //       x: active ? viewport.width : width,
  //       y: active ? viewport.height : height,
  //     });
  //   }
  // }, [viewport, active]);

  const shaderArgs = useMemo(
    () => ({
      uniforms: {
        uTexture: { value: tex },
        uContainerResolution: { value: { x: 1, y: 1 } },
        uImageResolution: { value: { x: tex.source.data.width, y: tex.source.data.height } },
        uGrid: { value: new THREE.Vector4() },
        uTime: { value: 0 },
        uEdgeSplitStrength: { value: 0.1 },
      },
      vertexShader: /* glsl */ `
      uniform float uTime;
      uniform float uEdgeSplitStrength; // Control how much the edges should split
      uniform vec2 uContainerResolution;
      
      varying vec2 vUv; // Pass UVs to fragment shader
      
      // Random function to add randomness based on position
      float random(vec2 st) {
          return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
      }
      
      void main() {
          vUv = uv;
      
          vec3 pos = position; // Original vertex position
          float edgeThreshold = 0.01; // Define how close to the edge the effect should occur
      
          // Determine if the vertex is near the edge
          bool nearEdge = uv.x < edgeThreshold || uv.x > 1.0 - edgeThreshold || 
                          uv.y < edgeThreshold || uv.y > 1.0 - edgeThreshold;
      
          if (nearEdge) {
              float randValue = random(uv * uContainerResolution * (uTime * 0.001));
              pos.x -= (randValue - 0.5) * uEdgeSplitStrength; // Randomly displace X
              pos.y -= (randValue - 0.5) * uEdgeSplitStrength; // Randomly displace Y
          }
          // Calculate distance from the center of the plane (0.5, 0.5)
          float distFromCenter = distance(uv, vec2(0.5, 0.5));
      
          // Modify z-position to create a convex shape
          pos.z += (1.0 - distFromCenter) * 0.85;
          // Apply the new vertex position
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
      
      `,
      fragmentShader: /* glsl */ `
      uniform sampler2D uTexture;
      uniform sampler2D uGrid;
      varying vec2 vUv;
      
      uniform float uTime;
      uniform vec2 uContainerResolution;
      uniform float uDisplacement;
      uniform vec2 uImageResolution;
      
      vec2 coverUvs(vec2 imageRes, vec2 containerRes) {
          float imageAspectX = imageRes.x / imageRes.y;
          float imageAspectY = imageRes.y / imageRes.x;
      
          float containerAspectX = containerRes.x / containerRes.y;
          float containerAspectY = containerRes.y / containerRes.x;
      
          vec2 ratio = vec2(
              min(containerAspectX / imageAspectX, 1.0),
              min(containerAspectY / imageAspectY, 1.0)
          );
      
          vec2 newUvs = vec2(
              vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
              vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
          );
      
          return newUvs;
      }
      
      float random(vec2 st) {
          return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
      }
      
      // Star shape function
      float star(vec2 uv, vec2 center, float outerRadius, float innerRadius) {
          float angle = atan(uv.y - center.y, uv.x - center.x);
          float dist = length(uv - center);
          float radius = mix(outerRadius, innerRadius, step(0.5, abs(fract(10.0 * angle / (2.0 * 3.14159265)))));
          return 1.0 - smoothstep(radius - 0.01, radius + 0.01, dist);
      }
      
      // Noise-based displacement function
      float noiseDisplacement(vec2 uv) {
          return random(uv * 1.0); // Use random noise for displacement
      }
      
      // Chromatic aberration function
      vec4 applyChromaticAberration(vec2 uv, float strength) {
          // Slight offsets for each color channel
          float rOffset = strength * 0.02;
          float gOffset = strength * 0.01;
          float bOffset = strength * 0.015;
      
          // Sample the texture with slight offsets for each channel
          float r = texture2D(uTexture, uv + vec2(rOffset, 0.0)).r;
          float g = texture2D(uTexture, uv + vec2(0.0, gOffset)).g;
          float b = texture2D(uTexture, uv - vec2(bOffset, 0.0)).b;
      
          return vec4(r, g, b, 1.0);
      }
      
      void main() {
          vec2 newUvs = coverUvs(uImageResolution, uContainerResolution);
          vec2 shapeUvs = coverUvs(vec2(1.0), uContainerResolution);
      
          vec4 image = texture2D(uTexture, newUvs);
          vec4 displacement = texture2D(uGrid, shapeUvs);
      
          // Star displacement effect
          float shapeEffect = star(vUv, vec2(0.5), 1.0, 0.05);
          
          // Noise-based displacement effect
          shapeEffect += noiseDisplacement(vUv);
      
          vec2 finalUvs = newUvs - displacement.rg * 0.01 * sin(shapeEffect);
      
          vec4 finalImage = texture2D(uTexture, finalUvs);
      
          // Determine displacement strength for chromatic aberration
          float displacementStrength = length(displacement.rg);
          displacementStrength = clamp(displacementStrength, 0.0, 1.0);
      
          // Apply chromatic aberration to glitched edges
          vec4 chromaticAberrationImage = applyChromaticAberration(finalUvs, displacementStrength);
      
          // Mix the original image with chromatic aberration effect based on displacement strength
          finalImage = mix(finalImage, chromaticAberrationImage, displacementStrength);
      
          gl_FragColor = finalImage;
      }
      

      `,
    }),
    [tex]
  );

  useFrame(({clock}) => {
    compute();
    $mesh.current.material.uniforms.uGrid.value = getTexture();
    $mesh.current.material.uniforms.uTime.value = clock.getElapsedTime();
  });

  // Handle mouse move over the plane to update the GPGPU texture
  const handlePointerMove = event => {
    const uv = event.uv; // UV coordinates of the mouse over the plane
    if (uv) {
      updateMouse(uv); // Update GPGPU state with the mouse position
    }
  };

  return (
    <mesh ref={$mesh} {...props} onPointerMove={handlePointerMove} >
      <planeGeometry args={[width, height, 30, 30]} />
      <shaderMaterial args={[shaderArgs]} />
    </mesh>
  );
};

export default Plane;