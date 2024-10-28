import { useCallback, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler";
import { useFrame, useThree } from "@react-three/fiber";
import { cnoise } from "../Helper/cNoise.jsx";
import { MeshReflectorMaterial, useTexture } from "@react-three/drei";


const Grass = () => {
  const meshRef = useRef(null);
  const { viewport, raycaster, pointer } = useThree(); // To get viewport width
  const n = useTexture("/Texture/n.jpg");
  const d = useTexture("/Texture/d.jpg");

  // --------------------------------------------
  // sampling geometry (plane geometry with dynamic width)

  const samplingGeometry = useMemo(() => new THREE.PlaneGeometry(viewport.width, viewport.width, 20, 20), [viewport.width]);

  
  // --------------------------------------------
  // create sampler

  const sampler = useMemo(() => {
    const samplingMesh = new THREE.Mesh(samplingGeometry, new THREE.MeshBasicMaterial());
    const sampler = new MeshSurfaceSampler(samplingMesh).build();
    return sampler;
  }, [samplingGeometry]);

  // --------------------------------------------
  // initialize matrix

  const amount = 20000;
  const updateMatrix = useCallback(() => {
    const object = new THREE.Object3D();
    const samplingPosition = new THREE.Vector3();
    const samplingNormal = new THREE.Vector3();

    for (let i = 0; i < amount; i++) {
      sampler.sample(samplingPosition, samplingNormal);
      object.position.copy(samplingPosition);
      object.lookAt(samplingNormal.add(samplingPosition));
      object.updateMatrix();

      meshRef.current.setMatrixAt(i, object.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [amount, sampler]);

  useEffect(() => {
    // Fixed cone matrix
    meshRef.current.geometry.applyMatrix4(new THREE.Matrix4().makeRotationX(Math.PI / 2));
    meshRef.current.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, 0.25));

    updateMatrix();
  }, [updateMatrix]);

  // --------------------------------------------
  // add fireflies

  // const fireflyRef = useRef();

  // const fireflies = useMemo(() => new Fireflies({ count: 1000 }), []);

  // const handleHover = event => {
  //   raycaster.setFromCamera(pointer, event.camera);
  //   const intersects = raycaster.intersectObject(meshRef.current);

  //   if (intersects.length > 0) {
  //     const { point } = intersects[0];
  //     // Check each firefly's distance to the cursor
  //     fireflyRef.current.children.forEach(firefly => {
  //       const distance = firefly.position.distanceTo(point);
  //       if (distance < 1) {
  //         firefly.material.opacity = 1; // Make firefly visible
  //         firefly.position.y += 0.01; // Simple "fly up" effect
  //       }
  //     });
  //   }
  // };

  // --------------------------------------------
  // create shader

  const shader = {
    uniforms: {
      u_time: { value: 0 },
      u_sway: { value: 0.5 },
      u_displacement: { value: d },
      u_planeSize: { value: new THREE.Vector2(viewport.width, viewport.width) },
      u_minHeight: { value: 1.2 }, // Minimum height threshold
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
  };

  useFrame(() => {
    shader.uniforms.u_time.value += 0.0005;
  });

  return (
    <group
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -3, -2]}
      // onPointerMove={handleHover}
    >
      <mesh
        geometry={samplingGeometry}
        position={[0, 0, 0.15]}
      >
        <meshStandardMaterial color='#002f00' 
        normalMap={n} 
        // aoMap={ao} 
        displacementMap={d} displacementScale={10} />
      </mesh>
      <instancedMesh ref={meshRef} args={[undefined, undefined, amount]}>
        <coneGeometry args={[0.05, 0.8, 2, 20, false, 0, Math.PI]} />
        <shaderMaterial args={[shader]} side={THREE.DoubleSide} />
      </instancedMesh>
      {/* {fireflies} */}
      {/* <Fireflies count={1000} /> */}
      <Ground/>
    </group>
  );
};

// ========================================================
// shader

const vertexShader = `
uniform float u_time;
uniform float u_sway;
uniform sampler2D u_displacement;
uniform vec2 u_planeSize;
uniform float u_minHeight; // Minimum height threshold
varying float v_pz;

${cnoise}

const float PI = 3.14159265358979;

void main() {
    vec3 pos = position.xyz;
    v_pz = pos.z;

    // Calculate UVs based on the plane size and instance position
    vec2 uv = (instanceMatrix * vec4(pos, 1.0)).xy / u_planeSize + 0.5;
    
    // Sample the displacement map with UVs
    float displacement = texture2D(u_displacement, uv).r * 10.0; // Adjust multiplier as needed

    // Apply displacement to the z position
    pos.z += displacement;

    // Check if the position is below the threshold
    if (pos.z < u_minHeight) {
        // Discard this instance if it's below the minimum height
        gl_Position = vec4(0.0);
        return;
    }

    vec3 base = vec3(pos.x, pos.y, 0.0);
    vec4 baseGP = instanceMatrix * vec4(base, 1.0);
    float noise = cnoise31(baseGP.xyz * vec3(0.1) + u_time * 0.5);
    noise = smoothstep(-1.0, 1.0, noise);

    float swingX = sin(u_time * 2.0 + noise * 2.0 * PI) * pow(v_pz, 2.0);
    float swingY = cos(u_time * 2.0 + noise * 2.0 * PI) * pow(v_pz, 2.0);
    pos.x += swingX * u_sway;
    pos.y += swingY * u_sway;

    vec4 globalPosition = instanceMatrix * vec4(pos, 1.0);
    vec4 mPos = modelMatrix * globalPosition;

    gl_Position = projectionMatrix * viewMatrix * mPos;
}


`;

const fragmentShader = `
varying float v_pz;

void main() {
	vec3 color = mix(vec3(0.0), vec3(0.68, 0.89, 0.40), v_pz);

	gl_FragColor = vec4(color, 1.0);
}
`;

export default Grass;

function Ground() {
  const [floor, normal] = useTexture(["/Texture/si-col.webp", "/Texture/si-norm.webp"]);
  return (
    <mesh position={[0, 0, 1.2]}>
      <planeGeometry args={[10, 10]} />
      <MeshReflectorMaterial
        blur={[400, 100]}
        resolution={512}
        mixBlur={2}
        mixStrength={1.5}
        mirror={1}
        roughness={4}
        roughnessMap={floor}
        depthScale={1.2}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        // color="#050505"
        metalness={0}
        reflectorOffset={-0.2}
        normalMap={normal}
        normalScale={[3, 3]}
        fog
      />
    </mesh>
  );
}

// const Fireflies = ({ count = 100 }) => {
//   const pointsRef = useRef();
//   const { viewport, pointer, raycaster, camera } = useThree();

//   const fireflyPositions = useMemo(() => {
//     const positions = [];
//     for (let i = 0; i < count; i++) {
//       positions.push((Math.random() - 0.5) * viewport.width, (Math.random() - 0.5) * viewport.width, Math.random() * 0.5);
//     }
//     return new Float32Array(positions);
//   }, [count, viewport]);

//   useFrame(state => {
//     if (pointsRef.current) {
//       // Fireflies float effect
//       const positions = pointsRef.current.geometry.attributes.position.array;
//       // for (let i = 0; i < count; i++) {
//       //   const zIndex = i * 3 + 2; // Z-axis position
//       //   positions[zIndex] += Math.sin(state.clock.elapsedTime + i) * 0.01;
//       // }
//       pointsRef.current.geometry.attributes.position.needsUpdate = true;
//     }
//   });

//   const handleHover = useCallback(
//     event => {
//       raycaster.setFromCamera(pointer, camera);
//       const intersects = raycaster.intersectObject(pointsRef.current);

//       if (intersects.length > 0) {
//         const { point } = intersects[0];
//         for (let i = 0; i < fireflyPositions.length; i += 3) {
//           const fireflyPos = new THREE.Vector3(fireflyPositions[i], fireflyPositions[i + 1], fireflyPositions[i + 2]);

//           if (fireflyPos.distanceTo(point) < 1) {
//             // Trigger animation on nearby fireflies
//             fireflyPositions[i + 2] += 0.5; // Fly up effect
//             pointsRef.current.geometry.attributes.position.needsUpdate = true;
//           }
//         }
//       }
//     },
//     [fireflyPositions]
//   );

//   return (
//     <points ref={pointsRef} onPointerMove={handleHover}>
//       <bufferGeometry>
//         <bufferAttribute attach='attributes-position' count={fireflyPositions.length / 3} array={fireflyPositions} itemSize={3} />
//       </bufferGeometry>
//       <pointsMaterial size={0.1} color='yellow' transparent opacity={0.6} />
//     </points>
//   );
// };

// const Fireflies = ({ count = 100 }) => {
//   const pointsRef = useRef();
//   const { viewport } = useThree();
//   const fireflyPositions = useMemo(() => {
//     const positions = [];
//     for (let i = 0; i < count; i++) {
//       positions.push((Math.random() - 0.5) * viewport.width, (Math.random() - 0.5) * viewport.width, Math.random() * 0.5);
//     }
//     return new Float32Array(positions);
//   }, [count, viewport]);

//   useFrame(state => {
//     if (pointsRef.current) {
//       const positions = pointsRef.current.geometry.attributes.position.array;
//       for (let i = 0; i < count; i++) {
//         const zIndex = i * 3 + 2; // Z-axis position
//         positions[zIndex] += Math.sin(state.clock.elapsedTime + i) * 0.01; // Simple up/down float
//       }
//       pointsRef.current.geometry.attributes.position.needsUpdate = true;
//     }
//   });

//   return (
//     <points ref={pointsRef}>
//       <bufferGeometry>
//         <bufferAttribute attach='attributes-position' count={fireflyPositions.length / 3} array={fireflyPositions} itemSize={3} />
//       </bufferGeometry>
//       <pointsMaterial size={0.1} color='yellow' transparent opacity={0.6} />
//     </points>
//   );
// };
