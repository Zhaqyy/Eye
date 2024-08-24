import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Plane } from '@react-three/drei';

const vertexShader = `precision highp float;

in vec3 position;
in vec2 uv;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

out vec2 vUv;

void main() {
  vUv = position.xy;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
}`;

const fragmentShader = `precision highp float;

in vec2 vUv;

uniform float time;

out vec4 color;

float fog(in vec2 uv) {
  vec2 q=2.0*uv;

  for(float i=1.0;i<40.0;i*=1.1){
    vec2 o=q;
    o.x+=(0.5/i)*cos(i*q.y+time*0.297+0.03*i)+1.3;		
    o.y+=(0.5/i)*cos(i*q.x+time*0.414+0.03*(i+10.0))+1.9;
    q=o;
  }

  vec3 col=vec3(0.5*sin(3.0*q.x)+0.5,0.5*sin(3.0*q.y)+0.5,sin(1.3*q.x+1.7*q.y));
  float f=0.43*(col.x+col.y+col.z);

  return length(col.rgb);
}

void main() {
  float a = 1. - .5 * length(vUv);
  a = clamp(a, 0., 1.);
  a = pow(a, 2.);
  color= vec4(1., 1., 1., a);
  color.rgb *= .5 + .5 * fog(vUv);
}`;

function Disc() {
  const materialRef = useRef();

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = clock.getElapsedTime();
    }
  });

  return (
    <Plane args={[4, 4]}>
      <rawShaderMaterial
        ref={materialRef}
        attach="material"
        uniforms={{ time: { value: 0 } }}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        glslVersion={THREE.GLSL3}
        transparent={true}
      />
    </Plane>
  );
}

export default Disc;