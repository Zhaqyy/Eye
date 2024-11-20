import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler";
import { useFrame, useThree } from "@react-three/fiber";
import { cnoise } from "../Helper/cNoise.jsx";
import { MeshReflectorMaterial, Sparkles, useTexture, useTrailTexture } from "@react-three/drei";
import CustomSparkles from "../Helper/SampledParticles.jsx";
import SimplePointCloud from "../Helper/SampledParticles.jsx";
import useIsMobile from "../../Component/isMobile.jsx";

const Grass = () => {
  const meshRef = useRef(null);
  const { viewport, raycaster, pointer } = useThree(); // To get viewport width
  const n = useTexture("/Texture/n.jpg");
  const d = useTexture("/Texture/d.jpg");
  const c = useTexture("/Texture/rm.jpg");

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

  // useEffect(() => {
  //   // Fixed cone matrix
  //   meshRef.current.geometry.applyMatrix4(new THREE.Matrix4().makeRotationX(Math.PI / 2));
  //   meshRef.current.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, 0.25));

  //   updateMatrix();
  // }, [updateMatrix]);

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
  
  const isMobile = useIsMobile(800);

  return (
    <group
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -3.5, 1]}
      // onPointerMove={handleHover}
    >
      {!isMobile && (
        <mesh geometry={samplingGeometry} position={[0, 0, 0.15]}>
          <meshStandardMaterial
            color="#2b2b2b"
            normalMap={n}
            map={c}
            displacementMap={d}
            displacementScale={10}
          />
        </mesh>
      )}
      {/* <instancedMesh ref={meshRef} args={[undefined, undefined, amount]}>
        <coneGeometry args={[0.05, 0.8, 2, 20, false, 0, Math.PI]} />
        <shaderMaterial args={[shader]} side={THREE.DoubleSide} />
      </instancedMesh> */}
      <Ground />

      {/* Sparkles with Surface Sampling */}
      {!isMobile && <CustomSparkles segments={90} />}
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
  const [normal] = useTexture(["/Texture/wn.jpg"]);

  // const waterNormalMap = WaterNormalMap();

  // Reference to control distortion speed and add an animated flow
  const materialRef = useRef();
  const timeRef = useRef(0); // Reference to track time

  const [trailTexture, onMove] = useTrailTexture({
    size: 32,
    radius: 0.1,
    color: "white",
    decay: 0.75,
    opacity: 1,
    smoothing: 0,
    interpolate: 2,
  });
  return (
    <mesh position={[0, 0, 1.2]} onPointerMove={onMove}>
      <planeGeometry args={[10, 10]} />
      <MeshReflectorMaterial
        ref={materialRef}
        mixStrength={0.75}
        mirror={1}
        roughness={4}
        // aoMap={trailTexture}
        bumpMap={trailTexture}
        // bumpScale={2.5}
        roughnessMap={trailTexture} // Add trail effect as roughgness map
        normalMap={normal}
        // normalMap={trailTexture}
        // normalMap={waterNormalMap}
        normalScale={[0.5, 0.5]}
        distortionMap={trailTexture} // Trail as distortion map
        // map={rippleTexture}
        distortion={0.25}
        fog
        blur={[400, 400]}
        resolution={512}
        mixBlur={1}
        depthScale={1}
        minDepthThreshold={0.85}
        // metalnessMap={waterNormalMap}
        // metalness={1}
        // debug={3}
      />
    </mesh>
  );
}

function WaterNormalMap() {
  const { gl, size } = useThree();
  const renderTarget = useMemo(() => new THREE.WebGLRenderTarget(size.width, size.height), [size]);

  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        resolution: { value: new THREE.Vector2(size.width, size.height) },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform float time;
        uniform vec2 resolution;

        vec2 random2(vec2 st){
          st = vec2( dot(st,vec2(127.1,311.7)),
                    dot(st,vec2(269.5,183.3)) );
          return -1.0 + 2.0*fract(sin(st)*43758.5453123);
      }
      
      // Gradient Noise by Inigo Quilez - iq/2013
      // https://www.shadertoy.com/view/XdXGW8
      float noise(vec2 st) {
          vec2 i = floor(st);
          vec2 f = fract(st);
      
          vec2 u = f*f*(3.0-2.0*f);
      
          return mix( mix( dot( random2(i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ),
                           dot( random2(i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
                      mix( dot( random2(i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ),
                           dot( random2(i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
      }
      

        void main() {
          vec2 uv = vUv * 2.0 - 1.0;
          uv *= resolution.x / resolution.y;

          // Create animated water noise
          float n = noise(uv * 8.0 + time * 0.5) * 0.7 + noise(uv * 0.9 + time * 0.2) * 0.5;
          // n = smoothstep(0.2, 0.7, n); // Map values to smooth waves

          gl_FragColor = vec4(vec3(n), 1.0); // Output as grayscale for normal map
        }
      `,
    });
  }, [size]);

  useFrame((state, delta) => {
    shaderMaterial.uniforms.time.value += delta;
    gl.setRenderTarget(renderTarget);
    gl.render(new THREE.Mesh(new THREE.PlaneGeometry(), shaderMaterial), new THREE.Camera());
    gl.setRenderTarget(null);
  });

  return renderTarget.texture;
}
