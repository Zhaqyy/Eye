import React, { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrthographicCamera, OrbitControls, Text, GradientTexture, useCursor, Sparkles } from "@react-three/drei";
import { useGLTF } from "@react-three/drei";
import { Howl } from "howler";
import gsap from "gsap";
import { Box3, ShaderMaterial, Vector3 } from "three";

const Piano = () => {

  return (
    <Canvas shadows camera={{ fov: 75, position: [0, 0, 10] }}>
      <color attach='background' args={["#efe5d9"]} />
      {/* <OrthographicCamera makeDefault zoom={50} position={[0, 20, 5]} /> */}
      <ambientLight intensity={1} />
      <pointLight intensity={10} position={[0, 5, 0]} />
      <Model rotation={[Math.PI * 0.5, 0, 0]} />
      <OrbitControls />
    </Canvas>
  );
};

export default Piano;

export function Model(props) {
  const { nodes } = useGLTF("/Model/piano.glb");
  const [hoveringKey, setHoveringKey] = useState(false);
  const [sparkles, setSparkles] = useState([]); // State to manage active sparkles
  const keyRefs = useRef({});
  useCursor(hoveringKey);

  // Default gradient colors
  const gradientColors = {
    C: ["#ff9a9e", "#fad0c4", "#fbc2eb", "#a18cd1", "#fbc2eb"],
    D: ["#f6d365", "#fda085", "#fbc2eb", "#a6c1ee", "#fad0c4"],
    E: ["#d4fc79", "#96e6a1", "#d4fc79", "#fbc2eb", "#a6c1ee"],
    F: ["#a8edea", "#fed6e3", "#fad0c4", "#d4fc79", "#fbc2eb"],
    G: ["#fbc2eb", "#a6c1ee", "#a8edea", "#96e6a1", "#fad0c4"],
    ZA: ["#cfd9df", "#e2ebf0", "#f6d365", "#fda085", "#d4fc79"],
    ZB: ["#89f7fe", "#66a6ff", "#fad0c4", "#fbc2eb", "#fda085"],
  };

  // Sound setup
  const sounds = {
    C: new Howl({ src: ["/Sounds/Piano/Cdo.mp3"] }),
    D: new Howl({ src: ["/Sounds/Piano/Dre.mp3"] }),
    E: new Howl({ src: ["/Sounds/Piano/Emi.mp3"] }),
    F: new Howl({ src: ["/Sounds/Piano/Ffa.mp3"] }),
    G: new Howl({ src: ["/Sounds/Piano/Gsol.mp3"] }),
    ZA: new Howl({ src: ["/Sounds/Piano/Ala.mp3"] }),
    ZB: new Howl({ src: ["/Sounds/Piano/B.mp3"] }),
  };

  const keyNames = ["C", "D", "E", "F", "G", "ZA", "ZB"]; // List of key meshes

  const handleKeyPress = (event) => {
    const keyMap = { 1: "C", 2: "D", 3: "E", 4: "F", 5: "G", 6: "ZA", 7: "ZB" };
    const keyName = keyMap[event.key];
  setTimeout(() => {
      if (keyName) playNote(keyName);
  }, 500);
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  const playNote = keyName => {
    const keyRef = keyRefs.current[keyName];
    if (!keyRef) return;

    // Animate key depression
    gsap.to(keyRef.position, { y: -0.1, duration: 0.1 });
    gsap.to(keyRef.position, { y: 0, duration: 0.25, delay: 0.1 });

    // Play sound
    sounds[keyName]?.stop();
    sounds[keyName]?.play();

    // Add sparkles
    setSparkles(prev => [...prev, { id: Date.now(), keyRef }]);
  };

  const computeTextPosition = mesh => {
    if (!mesh) return [0, -9, 0];
    const bbox = new Box3().setFromObject(mesh);
    const center = new Vector3();
    bbox.getCenter(center); // Center of the key
    return [center.x, 0.1, -3]; // Slight offset above the key
  };
  const computeSparkPosition = mesh => {
    if (!mesh) return [0, -9, 0];
    const bbox = new Box3().setFromObject(mesh);
    const center = new Vector3();
    bbox.getCenter(center); // Center of the key
    return [center.x, 0.1, -3]; // Slight offset above the key
  };

  // Gradient ShaderMaterial
  const gradientShader = new ShaderMaterial({
    uniforms: {
      uGradient: { value: 0 }, // Uniform to blend between white (0) and gradient (1)
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uGradient;
      varying vec2 vUv;
 
      void main() {
        vec3 white = vec3(1.0);
        vec3 gradient = mix(
          vec3(1.0, 0.7, 0.8),
          vec3(0.5, 0.7, 1.0),
          vUv.x
        );
        gl_FragColor = vec4(mix(white, gradient, uGradient), 1.0);
      }
    `,
  });


  useFrame(() => {
    // Remove sparkles after a timeout
    setSparkles((prev) =>
      prev.filter((sparkle) => Date.now() - sparkle.id < 1000)
    );
    gradientShader.uniforms.uGradient = gradientShader.uniforms.uGradient
    gradientShader.needsUpdate = true;
  });

  return (
    <group {...props} dispose={null}>
      {keyNames.map(keyName => {
        const node = nodes[keyName];
        if (!node) return null;
// console.log(gradientShader.uniforms.uGradient);
        return (
          <group
            key={keyName}
            ref={ref => {
              keyRefs.current[keyName] = ref;
            }}
          >
            <mesh
              castShadow
              receiveShadow
              geometry={nodes[keyName]?.geometry}
              material={gradientShader}

              onPointerOver={() => {
                setHoveringKey(true);
                gsap.to(gradientShader.uniforms.uGradient, { value: 1, duration: 0.3 });
              }}
              onPointerOut={() => {
                setHoveringKey(false);
                gsap.to(gradientShader.uniforms.uGradient, { value: 0, duration: 0.3 });
              }}
              onClick={() => playNote(keyName)}
            >
            </mesh>

            <Text
              position={computeTextPosition(keyRefs.current[keyName])}
              rotation={[Math.PI * -0.5, 0, 0]}
              fontSize={0.3}
              color='black'
              anchorX='center'
              anchorY='middle'
            >
              {keyName}
            </Text>
            {/* Sparkles */}
            {/* {sparkles.map(({ id, keyRef }) => (
              <Sparkles
                key={id}
                count={10}
                size={2}
                position={computeSparkPosition(keyRef)}
                color={'#ff0000'}
                speed={0.1}
                scale={1}
              />
            ))} */}
          </group>
        );
      })}


      <mesh name='Plane' receiveShadow geometry={nodes.Plane.geometry}>
        <meshBasicMaterial color={"#d4b99a"} />
      </mesh>
    </group>
  );
}
