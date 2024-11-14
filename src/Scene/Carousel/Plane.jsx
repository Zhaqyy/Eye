import * as THREE from "three";
import { useEffect, useMemo, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import useGPGPU from "./Gpgpu";
import { Howl } from "howler";

const hum = new Howl({
  src: ["/Sounds/hum.mp3"],
  loop: true, // Allows continuous play while the mouse moves
  volume: 0,
  rate: 0.9,
  preload: true,
});
const Plane = ({ texture, width, height, active, ...props }) => {
  const $mesh = useRef();
  const { viewport, gl: renderer } = useThree();
  const tex = useTexture(texture);
  const mouseIdleTime = useRef(0); // Track idle time
  const isMouseMoving = useRef(false); // Flag for mouse activity

  const previousMousePosition = useRef({ x: 0, y: 0 });
  const lastMovementTime = useRef(0);
  const inactivityTimer = useRef(null);
  let isFadingOut = false; 
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

  const shaderArgs = useMemo(
    () => ({
      uniforms: {
        uTexture: { value: tex },
        uContainerResolution: { value: { x: 1, y: 1 } },
        uImageResolution: { value: { x: tex.source.data.width, y: tex.source.data.height } },
        uGrid: { value: new THREE.Vector4() },
        uTime: { value: 0 },
        uEdgeSplitStrength: { value: 0.1 },
        uEdgeSplitLerp: { value: 1 }, // lerp uniform
      },
      vertexShader: /* glsl */ `
      uniform float uTime;
      uniform float uEdgeSplitStrength; // how much the edges should split
      uniform float uEdgeSplitLerp; // Lerp value for transition effect
      uniform vec2 uContainerResolution;
      
      varying vec2 vUv; // Pass UVs to fragment shader
      
      // Random function to add randomness based on position
      float random(vec2 st) {
          return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
      }
      
      void main() {
          vUv = uv;
      
          vec3 pos = position; // Original vertex position
          // float edgeThreshold = 0.01; 

          // Lerp the strength when mouse is idle
          float edgeThreshold = mix(0.01, 0.5, uEdgeSplitLerp); // Define how close to the edge the effect should occur

          // Determine if the vertex is near the edge
          bool nearEdge = uv.x < edgeThreshold || uv.x > 1.0 - edgeThreshold ||
                          uv.y < edgeThreshold || uv.y > 1.0 - edgeThreshold;

          if (nearEdge) {
            float randValue = random(uv * uContainerResolution * (uTime * 0.001));
            pos.x -= (randValue - 0.5) * mix(0.1, 0.5, uEdgeSplitLerp);
            pos.y -= (randValue - 0.5) * mix(0.1, 0.5, uEdgeSplitLerp);
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
      uniform float uEdgeSplitLerp;
      
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

          // Separate calculation for displacement strength based on interaction and transition
          float mouseDisplacementStrength = length(displacement.rg); // For chromatic aberration
          mouseDisplacementStrength = clamp(mouseDisplacementStrength, 0.0, 1.25);
      
          float transitionDisplacementStrength = clamp(mix(0.0, 3.0, uEdgeSplitLerp), 0.0, 3.0); // For transition
      
          // Blend mouse and transition displacements using uEdgeSplitLerp as weight
          float finalDisplacementStrength = mix(mouseDisplacementStrength, transitionDisplacementStrength, uEdgeSplitLerp);
      
          // Recalculate UVs with shapeEffect interaction
          vec2 finalUvs = newUvs - displacement.rg * 0.01 * sin(shapeEffect);
      
          // Apply chromatic aberration to glitched edges based on the recalculated UVs
          vec4 chromaticAberrationImage = applyChromaticAberration(finalUvs, finalDisplacementStrength);
      
          // Mix the original image with chromatic aberration effect based on displacement strength
          vec4 finalImage = mix(image, chromaticAberrationImage, finalDisplacementStrength);
      
          gl_FragColor = finalImage;

    //  cool effect
    //  finalImage -= mix(finalImage, chromaticAberrationImage, finalDisplacementStrength);

      }
      

      `,
    }),
    [tex]
  );

  // Start sound with fade-in when mouse enters
  const handlePointerEnter = () => {
    if (!hum.playing()) {
      hum.play();
    }
    hum.fade(hum.volume(), 0.15, 1000); // Fade in smoothly to full volume
    isFadingOut = false;
  };

  // Fade out to volume 0 on mouse leave to avoid popping
  const handlePointerLeave = () => {
    hum.fade(hum.volume(), 0, 1000); // Gradually fade out volume
    isFadingOut = true;
  };

  // Handle mouse move over the plane to update the GPGPU texture
  const handlePointerMove = event => {
    const uv = event.uv; // UV coordinates of the mouse over the plane
    if (uv) {
      updateMouse(uv); // Update GPGPU state with the mouse position

      const { x, y } = event.clientX;
      const now = performance.now();

      // Calculate mouse movement speed based on distance and time difference
      const dx = x - previousMousePosition.current.x;
      const dy = y - previousMousePosition.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const timeDelta = now - lastMovementTime.current || 1;
      // const speed = distance / timeDelta;

      // Calculate playback rate within specified range, with finite fallback
      // const rate = THREE.MathUtils.clamp(0.75 + speed * 0.05, 0.75, 2.5);
      // if (isFinite(rate)) {
      //   hum.rate(rate); // Only set if rate is finite
      // }

    // Fade in only if we’re in a fade-out state
    if (isFadingOut) {
      hum.fade(hum.volume(), 0.15, 1000); // Smooth fade-in
      isFadingOut = false; // Reset fade-out state
    }

    // Reset inactivity timer to fade out on inactivity
    clearTimeout(inactivityTimer.current);
    inactivityTimer.current = setTimeout(() => {
      hum.fade(hum.volume(), 0, 1000); // Fade out volume on inactivity
      isFadingOut = true; // Set fade-out state
    }, 250); // Adjust delay as needed

      // Update references for the next move event
      previousMousePosition.current = { x, y };
      lastMovementTime.current = now;

      // Ensure volume is at max on movement
      // hum.fade(hum.volume(), 1, 500);
    }
  };

  useEffect(() => {
    return () => hum.unload(); // Clean up sound when component unmounts
  }, [hum]);

  useFrame(({ clock }) => {
    compute();
    $mesh.current.material.uniforms.uGrid.value = getTexture();
    $mesh.current.material.uniforms.uTime.value = clock.getElapsedTime();

    if (!isMouseMoving.current) {
      // Smoothly interpolate back to default state over time
      shaderArgs.uniforms.uEdgeSplitLerp.value = THREE.MathUtils.lerp(
        shaderArgs.uniforms.uEdgeSplitLerp.value,
        0,
        0.05 // Lerp speed
      );
    }
  });

  return (
    <mesh ref={$mesh} {...props} onPointerMove={handlePointerMove} onPointerEnter={handlePointerEnter} onPointerLeave={handlePointerLeave}>
      <planeGeometry args={[width, height, 30, 30]} />
      <shaderMaterial args={[shaderArgs]} />
    </mesh>
  );
};

export default Plane;
