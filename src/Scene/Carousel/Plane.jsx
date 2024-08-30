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
      },
      vertexShader: /* glsl */ `
        varying vec2 vUv;

        void main() {
          vUv = uv;
          vec4 modelPosition = modelMatrix * vec4(position, 1.0);
          vec4 viewPosition = viewMatrix * modelPosition;
          vec4 projectedPosition = projectionMatrix * viewPosition;
          gl_Position = projectedPosition;    
        }
      `,
      fragmentShader: /* glsl */ `

      uniform sampler2D uTexture;
uniform sampler2D uGrid;
varying vec2 vUv;

uniform vec2 uContainerResolution;
uniform float uDisplacement;
uniform vec2 uImageResolution;
uniform vec2 uRGBshift;

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
    return fract(sin(dot(st.xy,
                         vec2(12.9898, 78.233)))*
        43758.5453123);
}

// Hexagon shape function
float hexagon(vec2 uv, vec2 position, float scale) {
    vec3 k = vec3(0.8660254, 0.5, 0.5773503); // Constants for hexagon shape
    uv -= position;
    uv = abs(uv);
    uv -= 2.0 * min(dot(k.xy, uv), 0.0) * k.xy;
    uv -= vec2(clamp(uv.x, -k.z * scale, k.z * scale), scale);
    return 1.0 - smoothstep(scale - 0.01, scale + 0.01, length(uv) / scale);
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

void main() {
    vec2 newUvs = coverUvs(uImageResolution, uContainerResolution);
    vec2 shapeUvs = coverUvs(vec2(1.0), uContainerResolution);

    vec4 image = texture2D(uTexture, newUvs);
    vec4 displacement = texture2D(uGrid, shapeUvs);

    // Uncomment one of the following lines to use a different shape for displacement:

    // Square (default)
    // float shapeEffect = 1.0; // Default square shape effect

    // Hexagon displacement effect
    // float shapeEffect = hexagon(vUv, vec2(0.5), 0.3);

    // Star displacement effect
    float shapeEffect = star(vUv, vec2(0.5), 1.0, 0.05);
    
    // Noise-based displacement effect
     shapeEffect += noiseDisplacement(vUv);

    vec2 finalUvs = newUvs - displacement.rg * 0.01 * sin(shapeEffect);

    vec4 finalImage = texture2D(uTexture, finalUvs);

    // RGB shift logic
    vec2 shift = displacement.rg * 0.0015;

    float displacementStrength = length(displacement.rg);
    displacementStrength = clamp(displacementStrength, 0.0, 2.0);

    float redStrength = 1.0 + displacementStrength * 0.25;
    vec2 redUvs = finalUvs + shift * redStrength;

    float blueStrength = 1.0 + displacementStrength * 1.5;
    vec2 blueUvs = finalUvs + shift * blueStrength;

    float greenStrength = 1.0 + displacementStrength * 2.0;
    vec2 greenUvs = finalUvs + shift * greenStrength;

    float red = texture2D(uTexture, redUvs).r;
    float blue = texture2D(uTexture, blueUvs).b;
    float green = texture2D(uTexture, greenUvs).g;

    finalImage.r = red;
    finalImage.g = green;
    finalImage.b = blue;

    gl_FragColor = finalImage;
}

      `,
    }),
    [tex]
  );

  useFrame(() => {
    compute();
    $mesh.current.material.uniforms.uGrid.value = getTexture();
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
