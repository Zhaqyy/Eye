import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { Points, useHelper, useTexture } from "@react-three/drei";



// const SampledPointCloud = ({ segments = 100 }) => {
//   const pointCloudRef = useRef();
//   const { viewport, raycaster, camera, pointer, scene } = useThree();
//   const planeSize = viewport.width;

//   // Load displacement texture
//   const displacementTexture = useTexture("/Texture/d.jpg");
//   const interactionRadius = 1.25;

//   // Create a plane to use for raycasting
//   const [intersectionPoint, setIntersectionPoint] = useState(new THREE.Vector2(0, 0));
//   const planeMeshRef = useRef();
  
//   // Handle mouse move to update intersection point on the plane
//   const handleMouseMove = () => {
//     if (!planeMeshRef.current) return;
    
//     // Set up a ray from the camera to the pointer
//     raycaster.setFromCamera(pointer, camera);
    
//     // Check for intersection with the invisible plane mesh
//     const intersects = raycaster.intersectObject(planeMeshRef.current);
    
//     if (intersects.length > 0) {
//       const { point } = intersects[0];
//       setIntersectionPoint(new THREE.Vector2(point.x, -point.z));
//     }
//   };

//   // Create the geometry for the points based on a plane
//   const geometry = useMemo(() => {
//     const planeGeometry = new THREE.PlaneGeometry(planeSize, planeSize, segments, segments);
//     const pointsGeometry = new THREE.BufferGeometry();
//     pointsGeometry.setAttribute("position", planeGeometry.getAttribute("position"));
//     pointsGeometry.setAttribute("uv", planeGeometry.getAttribute("uv"));
//     return pointsGeometry;
//   }, [planeSize, segments]);

//   // Shader material with mouse interaction
//   const material = useMemo(() => {
//     return new THREE.ShaderMaterial({
//       uniforms: {
//         u_displacement: { value: displacementTexture },
//         u_planeSize: { value: new THREE.Vector2(planeSize, planeSize) },
//         u_mouse: { value: new THREE.Vector2(0, 0) },
//         u_time: { value: 0 },
//         u_radius: { value: interactionRadius },
//         u_minHeight: { value: 1.2 }, // Height threshold below which points are not visible
//       },
//       vertexShader: `
//         uniform sampler2D u_displacement;
//         uniform vec2 u_planeSize;
//         uniform vec2 u_mouse;
//         uniform float u_time;
//         uniform float u_radius;
//         uniform float u_minHeight;

//         varying float v_visibility;
//         varying vec3 vColor;

//         void main() {
//           vec3 pos = position;
//           pos.z = position.z + 0.25;

//           // Slight random offset for more natural look
//           pos.x += (fract(sin(dot(pos.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) * 0.1;
//           pos.y += (fract(sin(dot(pos.yz, vec2(93.9898, 67.345))) * 37598.5453) - 0.5) * 0.1;
//           pos.z += (fract(sin(dot(pos.xz, vec2(12.3456, 78.654))) * 45612.1234) - 0.5) * 0.1;

//           // Calculate UVs and sample displacement texture
//           vec2 uv = (pos.xy / u_planeSize) + 0.5;
//           float displacement = texture2D(u_displacement, uv).r * 10.0;
//           pos.z += displacement;

//           // Apply height threshold
//           if (pos.z < u_minHeight) {
//             v_visibility = 0.0;
//             gl_Position = vec4(0.0); // Discard this point
//             return;
//           }

//           // Distance from mouse in world space
//           vec3 mouseWorld = vec3(u_mouse, 0.0);
//           float distanceFromMouse = length(pos.xy - mouseWorld.xy);

//           // Smoothly transition visibility and floating effect based on mouse proximity
//           float proximityFactor = smoothstep(u_radius, 0.0, distanceFromMouse);
//           v_visibility = proximityFactor;

//           // Float effect with time and lerp
//           pos.z += sin(u_time * 2.0) * 0.05 * proximityFactor;

//           // Final positioning
//           gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
//           gl_PointSize = 20.0 * proximityFactor; // Adjust size based on proximity
//         }
//       `,
//       fragmentShader: `
//         varying float v_visibility;

//         void main() {
//           float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
//           float strength = 0.1 / distanceToCenter - 0.1;

//           // Final color with visibility lerp
//           vec3 color = mix(vec3(0.0), vec3(1.0, 0.5, 0.2), v_visibility); // Color lerp to orange
//           gl_FragColor = vec4(color * strength, strength * v_visibility); // Adjust opacity based on proximity
//         }
//       `,
//       transparent: true,
//     });
//   }, [displacementTexture, planeSize, interactionRadius]);

//   // Update uniforms on each frame
//   useFrame(({ clock }) => {
//     material.uniforms.u_time.value = clock.elapsedTime;
//     material.uniforms.u_mouse.value.set(intersectionPoint.x, intersectionPoint.y);
//   });

//   return (
//     <>
//       {/* Invisible plane for raycasting */}
//       <mesh
//         ref={planeMeshRef}
//         position={[0, 0, 2]}
//         // rotation={[-Math.PI / 2, 0, 0]}
//         onPointerMove={handleMouseMove}
//         visible={false} // Make this plane invisible
//         // visible={true} // Make this plane invisible
//       >
//         <planeGeometry args={[planeSize, planeSize]} />
//       </mesh>

//       {/* Point cloud */}
//       <points ref={pointCloudRef} geometry={geometry} material={material} />
//     </>
//   );
// };


const SampledPointCloud = ({ segments = 100 }) => {
    const pointCloudRef = useRef();
    const { viewport, raycaster, camera, pointer } = useThree();
    const planeSize = viewport.width;
    const interactionRadius = 1.25;
  
    // Load displacement texture
    const displacementTexture = useTexture("/Texture/d.jpg");
  
    // Create a plane to use for raycasting
    const [targetIntersection, setTargetIntersection] = useState(new THREE.Vector2(0, 0));
    const [currentIntersection, setCurrentIntersection] = useState(new THREE.Vector2(0, 0));
    const planeMeshRef = useRef();
  
    // Handle mouse move to update intersection point on the plane
    const handleMouseMove = () => {
      if (!planeMeshRef.current) return;
      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObject(planeMeshRef.current);
      if (intersects.length > 0) {
        const { point } = intersects[0];
        setTargetIntersection(new THREE.Vector2(point.x, -point.z));
      }
    };
  
    // Smooth transition of mouse position
    useFrame(() => {
      // Lerp the intersection point towards the target for smooth animation
      currentIntersection.lerp(targetIntersection, 0.01);
    });
  
    // Create the geometry for the points based on a plane
    const geometry = useMemo(() => {
      const planeGeometry = new THREE.PlaneGeometry(planeSize, planeSize, segments, segments);
      const pointsGeometry = new THREE.BufferGeometry();
      pointsGeometry.setAttribute("position", planeGeometry.getAttribute("position"));
      pointsGeometry.setAttribute("uv", planeGeometry.getAttribute("uv"));
      return pointsGeometry;
    }, [planeSize, segments]);
  
    // Shader material with mouse interaction
    const material = useMemo(() => {
      return new THREE.ShaderMaterial({
        uniforms: {
          u_displacement: { value: displacementTexture },
          u_planeSize: { value: new THREE.Vector2(planeSize, planeSize) },
          u_mouse: { value: new THREE.Vector2(0, 0) },
          u_time: { value: 0 },
          u_radius: { value: interactionRadius },
          u_minHeight: { value: 1.2 },
        },
        vertexShader: `
          uniform sampler2D u_displacement;
          uniform vec2 u_planeSize;
          uniform vec2 u_mouse;
          uniform float u_time;
          uniform float u_radius;
          uniform float u_minHeight;
  
          varying float v_visibility;
          varying vec3 vColor;
  
          void main() {
            vec3 pos = position;
            pos.z += 0.25;
  
            // Randomize point positions slightly for natural look
            pos.x += (fract(sin(dot(pos.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) * 0.1;
            pos.y += (fract(sin(dot(pos.yz, vec2(93.9898, 67.345))) * 37598.5453) - 0.5) * 0.1;
            pos.z += (fract(sin(dot(pos.xz, vec2(12.3456, 78.654))) * 45612.1234) - 0.5) * 0.1;
  
            // Calculate UVs and sample displacement texture
            vec2 uv = (pos.xy / u_planeSize) + 0.5;
            float displacement = texture2D(u_displacement, uv).r * 10.0;
            pos.z += displacement;
  
            // Apply height threshold
            if (pos.z < u_minHeight) {
              v_visibility = 0.0;
              gl_Position = vec4(0.0); // Discard this point
              return;
            }
  
            // Distance from mouse in world space
            vec3 mouseWorld = vec3(u_mouse, 0.0);
            float distanceFromMouse = length(pos.xy - mouseWorld.xy);
  
            // Smoothly transition visibility and floating effect based on mouse proximity
            float proximityFactor = smoothstep(u_radius, 0.0, distanceFromMouse);
            v_visibility = proximityFactor;
  
            // Float effect with time and lerp
            pos.z += sin(u_time * 2.0) * 0.05 * proximityFactor;
  
            // Final positioning
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = 20.0 * proximityFactor;
          }
        `,
        fragmentShader: `
          varying float v_visibility;
  
          void main() {
            float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
            float strength = 0.1 / distanceToCenter - 0.1;
  
            // Randomly transition colors over time
            vec3 baseColor = vec3(0.0, 0.5, 1.0);
            vec3 targetColor = vec3(1.0, 0.5, 0.2);
            vec3 color = mix(baseColor, targetColor, v_visibility * abs(sin(v_visibility)));
  
            gl_FragColor = vec4(color * strength, strength * v_visibility);
          }
        `,
        transparent: true,
      });
    }, [displacementTexture, planeSize, interactionRadius]);
  
    // Update uniforms on each frame
    useFrame(({ clock }) => {
      material.uniforms.u_time.value = clock.elapsedTime;
      material.uniforms.u_mouse.value.set(currentIntersection.x, currentIntersection.y);
    });
  
    return (
      <>
        {/* Invisible plane for raycasting */}
        <mesh
          ref={planeMeshRef}
          position={[0, 0, 2]}
          onPointerMove={handleMouseMove}
          visible={false}
        >
          <planeGeometry args={[planeSize, planeSize]} />
        </mesh>
  
        {/* Point cloud */}
        <points ref={pointCloudRef} geometry={geometry} material={material} />
      </>
    );
  };
  
export default SampledPointCloud;
