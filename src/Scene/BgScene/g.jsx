import { useCallback, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler";
import { useFrame, useThree } from "@react-three/fiber";
// import { useControls } from 'leva';
import { cnoise } from "../Helper/cNoise.jsx";

// const ModelPath = '../../assets/models/rabbit.glb';
// useGLTF.preload(ModelPath);

const SwayingGrass = () => {
  const meshRef = useRef(null);
  const { viewport } = useThree(); // To get viewport width

  // --------------------------------------------
  // sampling geometry (plane geometry with dynamic width)

  const samplingGeometry = useMemo(() => new THREE.PlaneGeometry(viewport.width, viewport.width), [viewport.width]);

  // Load the GLTF model and get the geometry of the rabbit
  // const { nodes } = useGLTF(ModelPath);
  // const samplingGeometry = nodes.Rabbit.geometry; // uncomment if using model geometry

  // --------------------------------------------
  // create sampler

  const sampler = useMemo(() => {
    const samplingMesh = new THREE.Mesh(samplingGeometry, new THREE.MeshBasicMaterial());
    const sampler = new MeshSurfaceSampler(samplingMesh).build();
    return sampler;
  }, [samplingGeometry]);

  // --------------------------------------------
  // initialize matrix

  const amount = 5000;
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
    meshRef.current.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, 0.5));

    updateMatrix();
  }, [updateMatrix]);

  // --------------------------------------------
  // create shader

  const shader = {
    uniforms: {
      u_time: { value: 0 },
      u_sway: { value: 0.5 },
    //   u_depressionRadius: { value: 5 },
    //   u_depressionStrength: { value: 0.5 },
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
  };

  useFrame(() => {
    shader.uniforms.u_time.value += 0.0005;
    // shader.uniforms.u_sway.value = 0.1;
    // shader.uniforms.u_depressionRadius.value = depressionRadius;
    // shader.uniforms.u_depressionStrength.value = depressionStrength;
  });

  return (
    <group rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 1]}>
      <mesh geometry={samplingGeometry}>
        <meshBasicMaterial color='#002f00' />
      </mesh>
      <instancedMesh ref={meshRef} args={[undefined, undefined, amount]}>
        <coneGeometry args={[0.05, 1.0, 2, 20, false, 0, Math.PI]} />
        <shaderMaterial args={[shader]} side={THREE.DoubleSide} />
      </instancedMesh>
    </group>
  );
};

// ========================================================
// shader

const vertexShader = `
uniform float u_time;
uniform float u_sway;
varying float v_pz;

${cnoise}

const float PI = 3.14159265358979;

void main() {
	vec3 pos = position.xyz;
	v_pz = pos.z;

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

// const vertexShader = `
// uniform float u_time;
// uniform float u_sway;
// uniform float u_depressionRadius;
// uniform float u_depressionStrength;
// varying float v_pz;

// ${cnoise}
// const float PI = 3.14159265358979;

// void main() {
// 	vec3 pos = position.xyz;
// 	v_pz = pos.z;

// 	// Calculate depression effect
// 	float dist = length(pos.xy);
// 	if (dist < u_depressionRadius) {
// 		float factor = (u_depressionRadius - dist) / u_depressionRadius;
// 		pos.z -= factor * u_depressionStrength;
// 	}

// 	// Sway effect
// 	vec3 base = vec3(pos.x, pos.y, 0.0);
// 	vec4 baseGP = instanceMatrix * vec4(base, 1.0);
// 	float noise = cnoise31(baseGP.xyz * vec3(0.1) + u_time * 0.5);
// 	noise = smoothstep(-1.0, 1.0, noise);

// 	float swingX = sin(u_time * 2.0 + noise * 2.0 * PI) * pow(v_pz, 2.0);
// 	float swingY = cos(u_time * 2.0 + noise * 2.0 * PI) * pow(v_pz, 2.0);
// 	pos.x += swingX * u_sway;
// 	pos.y += swingY * u_sway;

// 	vec4 globalPosition = instanceMatrix * vec4(pos, 1.0);
// 	vec4 mPos = modelMatrix * globalPosition;

// 	gl_Position = projectionMatrix * viewMatrix * mPos;
// }
// `;

// const fragmentShader = `
// varying float v_pz;

// void main() {
// 	vec3 color = mix(vec3(0.0), vec3(0.68, 0.89, 0.40), v_pz);

// 	gl_FragColor = vec4(color, 1.0);
// }
// `;

export default SwayingGrass;
