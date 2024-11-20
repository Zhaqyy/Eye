import * as THREE from "three";
import { useRef, useEffect, useMemo } from "react";
import { GPUComputationRenderer } from "three/addons/misc/GPUComputationRenderer.js";

const fragmentShader = `
uniform vec2 uMouse;
uniform vec2 uDeltaMouse;
uniform float uMouseMove;
uniform float uGridSize;
uniform float uRelaxation;
uniform float uDistance;


void main()
{
    vec2 uv = gl_FragCoord.xy/resolution.xy;

    vec4 color = texture(uGrid,uv);

    float dist = distance(uv,uMouse);
    dist = 1.-(smoothstep(0.,uDistance/uGridSize,dist));


    vec2 delta = uDeltaMouse;

    color.rg+=delta*dist;
    color.rg*=min(uRelaxation,uMouseMove);
    

    gl_FragColor = color;
}
`;

const useGPGPU = ({ renderer, size, params }) => {
  const gpgpuRef = useRef(null);
  const variableRef = useRef(null);
  const debugPlaneRef = useRef(null);
  const sizeRef = useRef(Math.ceil(Math.sqrt(size)));
  const timeRef = useRef(0);
  const dataTextureRef = useRef(null);

  useEffect(() => {
    // Initialize GPUComputationRenderer
    const gpgpuRenderer = new GPUComputationRenderer(sizeRef.current, sizeRef.current, renderer);
    gpgpuRef.current = gpgpuRenderer;

    // Create initial DataTexture
    const dataTexture = gpgpuRenderer.createTexture();
    dataTextureRef.current = dataTexture;

    // Add variable
    const variable = gpgpuRenderer.addVariable("uGrid", fragmentShader, dataTexture);
    variable.material.uniforms.uTime = { value: 0 };
    variable.material.uniforms.uRelaxation = { value: params.relaxation };
    variable.material.uniforms.uGridSize = { value: sizeRef.current };
    variable.material.uniforms.uMouse = { value: new THREE.Vector2(0, 0) };
    variable.material.uniforms.uDeltaMouse = { value: new THREE.Vector2(0, 0) };
    variable.material.uniforms.uMouseMove = { value: 0 };
    variable.material.uniforms.uDistance = { value: params.distance * 10 };

    variableRef.current = variable;

    // Set dependencies and initialize
    gpgpuRenderer.setVariableDependencies(variable, [variable]);
    gpgpuRenderer.init();

    return () => {
      // Clean up resources if necessary
      gpgpuRenderer.dispose();
    };
  }, [renderer, size, params]);

  const updateMouse = uv => {
    if (!variableRef.current) return;

    variableRef.current.material.uniforms.uMouseMove.value = 1;
    const current = variableRef.current.material.uniforms.uMouse.value;
    current.subVectors(uv, current).multiplyScalar(params.strengh * 100);
    variableRef.current.material.uniforms.uDeltaMouse.value = current;
    variableRef.current.material.uniforms.uMouse.value = uv;
  };


  const compute = () => {
    if (gpgpuRef.current) {
      gpgpuRef.current.compute();
    }
    
    if (variableRef.current && variableRef.current.material) {
      variableRef.current.material.uniforms.uMouseMove.value *= 0.95;
      variableRef.current.material.uniforms.uDeltaMouse.value.multiplyScalar(
        variableRef.current.material.uniforms.uRelaxation.value
      );
    } 
  };
  
  const getTexture = () => {
    if (gpgpuRef.current) {
      return gpgpuRef.current.getCurrentRenderTarget(variableRef.current).texture;
    }
    return null;
  };

  return {
    updateMouse,
    compute,
    getTexture,
  };
};

export default useGPGPU;
