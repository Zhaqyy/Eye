import { OrbitControls, OrthographicCamera, useFBO } from "@react-three/drei";
import { Canvas, useFrame, createPortal, extend } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { Vector2 } from "three";
import "./scene.css";

import getFullscreenTriangle from "./getFullscreenTriangle";
import GlitchMaterial from "./GlitchMaterial";
import ChromaticAberrationMaterial from "./ChromaticAberrationMaterial";

extend({ GlitchMaterial, ChromaticAberrationMaterial });

const finalFragmentShader = `
precision highp float;

uniform vec2 resolution;
uniform sampler2D inputTexture;

uniform sampler2D blur0Texture;
uniform sampler2D blur1Texture;
uniform sampler2D blur2Texture;
uniform sampler2D blur3Texture;
uniform sampler2D blur4Texture;

uniform float vignetteBoost;
uniform float vignetteReduction;

uniform float time;

in vec2 vUv;

out vec4 fragColor;

// start of vignette
float vignette(vec2 uv, float boost, float reduction) {
    vec2 position = vUv - .5;
    return boost - length(position) * reduction;
  }
// end of vignette

// start of noise
float hash(vec2 p) {
    p  = 50.0*fract( p*0.3183099 + vec2(0.71,0.113));
    return -1.0+2.0*fract( p.x*p.y*(p.x+p.y) );
  }
  
  float noise( in vec2 p ) {
    vec2 i = floor( p );
    vec2 f = fract( p );
  
  vec2 u = f*f*(3.0-2.0*f);
  
    return mix( mix( hash( i + vec2(0.0,0.0) ), 
                     hash( i + vec2(1.0,0.0) ), u.x),
                mix( hash( i + vec2(0.0,1.0) ), 
                     hash( i + vec2(1.0,1.0) ), u.x), u.y);
  }
// end of noise

// start of screen
vec4 screen(vec4 base, vec4 blend, float opacity) {
    vec4 color = 1. - (1.-base) * (1.-blend);
    color = color * opacity + base * ( 1. - opacity );
    return color;
  }
  
  vec3 screen(vec3 base, vec3 blend, float opacity) {
    vec3 color = 1. - (1.-base) * (1.-blend);
    color = color * opacity + base * ( 1. - opacity );
    return color;
  }
// end of screen


void main() {
  vec4 b0 = texture(blur0Texture, vUv);
  vec4 b1 = texture(blur1Texture, vUv);
  vec4 b2 = texture(blur2Texture, vUv);
  vec4 b3 = texture(blur3Texture, vUv);
  vec4 b4 = texture(blur4Texture, vUv);
  
  vec4 color = texture(inputTexture, vUv);

  vec4 b =  b0 / 40.;
  b +=  2.*b1 / 40.;
  b +=  4.*b2 / 40.;
  b +=  8.*b3 / 40.;
  b +=  16.*b4 / 40.;

  fragColor = screen(color, b,1.);
  fragColor *= vignette(vUv, vignetteBoost, vignetteReduction);
  fragColor += .01 * noise(gl_FragCoord.xy + vec2(time, 0.));
}
`;

const colorFragmentShader = `precision highp float;

uniform sampler2D inputTexture;

in vec2 vUv;

out vec4 fragColor;

// start of chromaticAberration
vec2 barrelDistortion(vec2 coord, float amt) {
    vec2 cc = coord - 0.5;
    float dist = dot(cc, cc);
    return coord + cc * dist * amt;
  }
  
  float sat( float t ){
    return clamp( t, 0.0, 1.0 );
  }
  
  float linterp( float t ) {
    return sat( 1.0 - abs( 2.0*t - 1.0 ) );
  }
  
  float remap( float t, float a, float b ) {
    return sat( (t - a) / (b - a) );
  }
  
  vec4 spectrum_offset( float t ) {
    vec4 ret;
    float lo = step(t,0.5);
    float hi = 1.0-lo;
    float w = linterp( remap( t, 1.0/6.0, 5.0/6.0 ) );
    ret = vec4(lo,1.0,hi, 1.) * vec4(1.0-w, w, 1.0-w, 1.);
    return pow( ret, vec4(1.0/2.2) );
  }
  
  const float max_distort = 2.2;
  const int num_iter = 8;
  const float reci_num_iter_f = 1.0 / float(num_iter);
  
  vec4 chromaticAberration(sampler2D inputTexture, vec2 uv, float amount, vec2 dir) {
    vec4 sumcol = vec4(0.0);
    vec4 sumw = vec4(0.0);
    for ( int i=0; i<num_iter;++i ) {
      float t = float(i) * reci_num_iter_f;
      vec4 w = spectrum_offset( t );
      sumw += w;
      sumcol += w * texture(inputTexture, barrelDistortion(uv, amount * max_distort*t ) );
    }
    return sumcol / sumw;
  }
// end of chromaticAberration


void main() {
  vec2 uv = .8 * (vUv - .5) + .5;
  fragColor = chromaticAberration(inputTexture, uv, .5, (vUv-.5) );
}`;

const orthoVertexShader = `
precision highp float;

in vec3 position;
in vec2 uv;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

out vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1. );
}`;

const FinalMaterial = {
  uniforms: {
    resolution: { value: new Vector2(1, 1) },
    vignetteBoost: { value: 1 },
    vignetteReduction: { value: 0.2 },
    inputTexture: { value: null },
    blur0Texture: { value: null },
    blur1Texture: { value: null },
    blur2Texture: { value: null },
    blur3Texture: { value: null },
    blur4Texture: { value: null },
    time: { value: 0 },
  },
  vertexShader: orthoVertexShader,
  fragmentShader: finalFragmentShader, 
  glslVersion: THREE.GLSL3,
};

const ColorMaterial = {
  uniforms: {
    inputTexture: { value: null },
  },
  vertexShader: orthoVertexShader,
  fragmentShader: colorFragmentShader, 
  glslVersion: THREE.GLSL3,
};

const PostProcessing = () => {
  const colorFBO = useFBO();
  const screenMesh = useRef();
  const finalMaterialRef = useRef();
  const colorMaterialRef = useRef();

  useFrame(state => {
    const { gl, scene, camera } = state;

    // Render to color FBO
    gl.setRenderTarget(colorFBO);
    gl.render(scene, camera);

    // Apply color material (Chromatic Aberration)
    colorMaterialRef.current.uniforms.inputTexture.value = colorFBO.texture;
    screenMesh.current.material = colorMaterialRef.current;

    // Apply final material with vignette and noise
    finalMaterialRef.current.uniforms.inputTexture.value = screenMesh.current.material.map;
    gl.setRenderTarget(null); // Render to screen
    gl.render(screenMesh.current, camera);
  });

  return (
    <>
      <OrbitControls />
      <mesh ref={screenMesh} geometry={getFullscreenTriangle()} frustumCulled={false} />
      <shaderMaterial ref={colorMaterialRef} attach='material' args={[ColorMaterial]} />
      <shaderMaterial ref={finalMaterialRef} attach='material' args={[FinalMaterial]} />
    </>
  );
};

export default PostProcessing;
