import * as THREE from "three";
// import { shader as curl } from "../shaders/curl.js";

const particleVs = `precision highp float;

in vec3 position;

uniform sampler2D positions;
uniform sampler2D velocities;
uniform sampler2D gradient;
uniform float dpr;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

out vec3 vColor;
out float vLife;

float parabola(in float x, in float k) {
  return pow(4. * x * (1. - x), k);
}

void main() {
  vec2 coord = position.xy;
  vec4 pos = texture(positions, coord);
  vec4 vel = texture(velocities, coord);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos.xyz - .5, 1. );
  vLife = pos.w / 100.;
  vColor = texture(gradient, vec2(vLife, 0.)).rgb * vLife; 
  gl_PointSize = (2.5 * parabola(vLife, 1.)) * dpr / gl_Position.z;
}`;

const particleFs = `precision highp float;

in float vLife;
in vec3 vColor;

uniform float opacity;

out vec4 fragColor;

void main() {
  vec2 circCoord = 2.0 * gl_PointCoord - 1.0;
  float d = dot(circCoord, circCoord);
  if (d > 1.0) {
      discard;
  }
  vec3 c = vColor;
  fragColor = vec4(c, (1.-pow(d, 10.)) * opacity);
}`;

const simVs = `precision  highp float;

in vec3 position;
in vec2 uv;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

out vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
}`;

const simFs = `precision highp float;
precision highp sampler3D;

in vec2 vUv;

uniform sampler2D originalPos;
uniform sampler2D posTexture;
uniform sampler2D velTexture;
uniform bool positions;
uniform float dt;
uniform float noiseSpeed;
uniform float noiseScale;
uniform vec3 mousePosition;
uniform float modulo;
uniform float persistence;
uniform float time;
uniform float sphereRadius;
uniform float signDir;
uniform float value;

out vec4 fragColor;

float sdSphere(in vec3 p, in float r) {
  return length(p)-r;
}

// start of curl shader

vec4 mod289(vec4 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}
float mod289(float x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}
vec4 permute(vec4 x) {
    return mod289(((x*34.0)+1.0)*x);
}
float permute(float x) {
    return mod289(((x*34.0)+1.0)*x);
}
vec4 taylorInvSqrt(vec4 r) {
    return 1.79284291400159 - 0.85373472095314 * r;
}
float taylorInvSqrt(float r) {
    return 1.79284291400159 - 0.85373472095314 * r;
}
vec4 grad4(float j, vec4 ip) {
    const vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);
    vec4 p,s;
    p.xyz = floor( fract (vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;
    p.w = 1.5 - dot(abs(p.xyz), ones.xyz);
    s = vec4(lessThan(p, vec4(0.0)));
    p.xyz = p.xyz + (s.xyz*2.0 - 1.0) * s.www;
    return p;
}
#define F4 0.309016994374947451
vec4 simplexNoiseDerivatives (vec4 v) {
    const vec4  C = vec4( 0.138196601125011,0.276393202250021,0.414589803375032,-0.447213595499958);
    vec4 i  = floor(v + dot(v, vec4(F4)) );
    vec4 x0 = v -   i + dot(i, C.xxxx);
    vec4 i0;
    vec3 isX = step( x0.yzw, x0.xxx );
    vec3 isYZ = step( x0.zww, x0.yyz );
    i0.x = isX.x + isX.y + isX.z;
    i0.yzw = 1.0 - isX;
    i0.y += isYZ.x + isYZ.y;
    i0.zw += 1.0 - isYZ.xy;
    i0.z += isYZ.z;
    i0.w += 1.0 - isYZ.z;
    vec4 i3 = clamp( i0, 0.0, 1.0 );
    vec4 i2 = clamp( i0-1.0, 0.0, 1.0 );
    vec4 i1 = clamp( i0-2.0, 0.0, 1.0 );
    vec4 x1 = x0 - i1 + C.xxxx;
    vec4 x2 = x0 - i2 + C.yyyy;
    vec4 x3 = x0 - i3 + C.zzzz;
    vec4 x4 = x0 + C.wwww;
    i = mod289(i);
    float j0 = permute( permute( permute( permute(i.w) + i.z) + i.y) + i.x);
    vec4 j1 = permute( permute( permute( permute (
             i.w + vec4(i1.w, i2.w, i3.w, 1.0 ))
           + i.z + vec4(i1.z, i2.z, i3.z, 1.0 ))
           + i.y + vec4(i1.y, i2.y, i3.y, 1.0 ))
           + i.x + vec4(i1.x, i2.x, i3.x, 1.0 ));
    vec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0) ;
    vec4 p0 = grad4(j0,   ip);
    vec4 p1 = grad4(j1.x, ip);
    vec4 p2 = grad4(j1.y, ip);
    vec4 p3 = grad4(j1.z, ip);
    vec4 p4 = grad4(j1.w, ip);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    p4 *= taylorInvSqrt(dot(p4,p4));
    vec3 values0 = vec3(dot(p0, x0), dot(p1, x1), dot(p2, x2)); //value of contributions from each corner at point
    vec2 values1 = vec2(dot(p3, x3), dot(p4, x4));
    vec3 m0 = max(0.5 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.0); //(0.5 - x^2) where x is the distance
    vec2 m1 = max(0.5 - vec2(dot(x3,x3), dot(x4,x4)), 0.0);
    vec3 temp0 = -6.0 * m0 * m0 * values0;
    vec2 temp1 = -6.0 * m1 * m1 * values1;
    vec3 mmm0 = m0 * m0 * m0;
    vec2 mmm1 = m1 * m1 * m1;
    float dx = temp0[0] * x0.x + temp0[1] * x1.x + temp0[2] * x2.x + temp1[0] * x3.x + temp1[1] * x4.x + mmm0[0] * p0.x + mmm0[1] * p1.x + mmm0[2] * p2.x + mmm1[0] * p3.x + mmm1[1] * p4.x;
    float dy = temp0[0] * x0.y + temp0[1] * x1.y + temp0[2] * x2.y + temp1[0] * x3.y + temp1[1] * x4.y + mmm0[0] * p0.y + mmm0[1] * p1.y + mmm0[2] * p2.y + mmm1[0] * p3.y + mmm1[1] * p4.y;
    float dz = temp0[0] * x0.z + temp0[1] * x1.z + temp0[2] * x2.z + temp1[0] * x3.z + temp1[1] * x4.z + mmm0[0] * p0.z + mmm0[1] * p1.z + mmm0[2] * p2.z + mmm1[0] * p3.z + mmm1[1] * p4.z;
    float dw = temp0[0] * x0.w + temp0[1] * x1.w + temp0[2] * x2.w + temp1[0] * x3.w + temp1[1] * x4.w + mmm0[0] * p0.w + mmm0[1] * p1.w + mmm0[2] * p2.w + mmm1[0] * p3.w + mmm1[1] * p4.w;
    return vec4(dx, dy, dz, dw) * 49.0;
}
vec3 curlNoise(vec3 p, float t) {
  vec4 xNoisePotentialDerivatives = vec4(0.0);
  vec4 yNoisePotentialDerivatives = vec4(0.0);
  vec4 zNoisePotentialDerivatives = vec4(0.0);
  for (int i = 0; i < 3; ++i) {
      float scale = (1.0 / 2.0) * pow(2.0, float(i));
      float noiseScale = pow(persistence, float(i));
      if (persistence == 0.0 && i == 0) { //fix undefined behaviour
          noiseScale = 1.0;
      }
      xNoisePotentialDerivatives += simplexNoiseDerivatives(vec4(p * pow(2.0, float(i)), t)) * noiseScale * scale;
      yNoisePotentialDerivatives += simplexNoiseDerivatives(vec4((p + vec3(123.4, 129845.6, -1239.1)) * pow(2.0, float(i)), t)) * noiseScale * scale;
      zNoisePotentialDerivatives += simplexNoiseDerivatives(vec4((p + vec3(-9519.0, 9051.0, -123.0)) * pow(2.0, float(i)), t)) * noiseScale * scale;
  }
  vec3 noiseVelocity = vec3(
    zNoisePotentialDerivatives[1] - yNoisePotentialDerivatives[2],
    xNoisePotentialDerivatives[2] - zNoisePotentialDerivatives[0],
    yNoisePotentialDerivatives[0] - xNoisePotentialDerivatives[1] );
  return noiseVelocity;
}
//End of curl shader


void main() {
  if(positions == true) {
    vec4 pos = texture(posTexture, vUv);
    vec4 vel = texture(velTexture, vUv);
       
    pos.xyz = pos.xyz + vel.xyz * vel.w * dt;
    pos.w += vel.w * dt * 4.;
    
    if(pos.w>100.) {
      pos.w = 0.;
      pos.xyz = texture(originalPos, vUv).xyz + mousePosition + .5;
    }
    
    fragColor = pos; 
  } else {
    vec4 pos = texture(posTexture, vUv);
    vec4 vel = texture(velTexture, vUv);
    
    if(pos.w== 0.) {
      vel.xyz = vec3(0.);
    }

    vec2 size = vec2(textureSize(posTexture, 0));
    if(mod(round(vUv.x * size.x), 4.) == modulo) {
      float d = sdSphere((pos.xyz - .5)-mousePosition.xyz, sphereRadius);
      vel.xyz = noiseSpeed * curlNoise(noiseScale * pos.xyz / 2., time/10.) / 200.;

      if(d<0.) {
        vec3 n = normalize(pos.xyz - .5 - mousePosition.xyz);
        vec3 r = signDir * refract(n, normalize(vel.xyz), .85);
        vel.xyz += r/10. * vel.w;
      } else {
        vel.xyz /= 1. + pow(d, 2.);
      }
    }

    fragColor = vel;
  }
}`;

function getPoint(radius) {
  const u = Math.random();
  const v = Math.random();
  const theta = u * 2.0 * Math.PI;
  const phi = Math.acos(2.0 * v - 1.0);
  const r = radius * Math.cbrt(Math.random());
  const sinTheta = Math.sin(theta);
  const cosTheta = Math.cos(theta);
  const sinPhi = Math.sin(phi);
  const cosPhi = Math.cos(phi);
  const x = r * sinPhi * cosTheta;
  const y = r * sinPhi * sinTheta;
  const z = r * cosPhi;
  return { x: x, y: y, z: z };
}

class Simulation {
  constructor(width, height) {
    const posData = new Float32Array(width * height * 4);
    let ptr = 0;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const p = getPoint(0.5);
        posData[ptr] = p.x;
        posData[ptr + 1] = p.y;
        posData[ptr + 2] = p.z;
        posData[ptr + 3] = randomInRange(0, 100);
        ptr += 4;
      }
    }
    const posTexture = new THREE.DataTexture(posData, width, height, RGBAFormat, FloatType);

    const velData = new Float32Array(width * height * 4);
    ptr = 0;
    let r = 0.01;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        velData[ptr] = randomInRange(-r, r);
        velData[ptr + 1] = randomInRange(-r, r);
        velData[ptr + 2] = randomInRange(-r, r);
        velData[ptr + 3] = randomInRange(0.25, 0.5);
        ptr += 4;
      }
    }
    const velTexture = new THREE.DataTexture(velData, width, height, RGBAFormat, FloatType);

    this.shader = new THREE.RawShaderMaterial({
      uniforms: {
        positions: { value: posTexture },
        velocities: { value: velTexture },
        gradient: { value: null },
        dpr: { value: 1 },
        opacity: { value: 0.25 },
      },
      vertexShader: particleVs,
      fragmentShader: particleFs,
      glslVersion: GLSL3,
      transparent: true,
      depthWrite: false,
      depthTest: true,
      blending: AdditiveBlending,
    });
    const geo = new THREE.BufferGeometry();
    const vertices = new Float32Array(width * height * 3);
    ptr = 0;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        vertices[ptr] = x / width;
        vertices[ptr + 1] = y / width;
        vertices[ptr + 2] = 0;
        ptr += 3;
      }
    }
    geo.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    this.mesh = new Points(geo, this.shader);

    const options = {
      format: RGBAFormat,
      type: FloatType,
      minFilter: NearestFilter,
      magFilter: NearestFilter,
    };

    this.positionFBOs = [getFBO(width, height, options), getFBO(width, height, options)];
    this.velocityFBOs = [getFBO(width, height, options), getFBO(width, height, options)];

    this.simShader = new THREE.RawShaderMaterial({
      uniforms: {
        originalPos: { value: posTexture },
        posTexture: { value: posTexture },
        velTexture: { value: velTexture },
        mousePosition: { value: new THREE.Vector3() },
        signDir: { value: 1 },
        dt: { value: 1 },
        noiseScale: { value: 1 },
        persistence: { value: 1 },
        noiseSpeed: { value: 1 },
        positions: { value: false },
        time: { value: 0 },
        sphereRadius: { value: 0.5 },
        modulo: { value: 0 },
      },
      vertexShader: simVs,
      fragmentShader: simFs,
      glslVersion: GLSL3,
      depthTest: false,
      depthWrite: false,
    });

    this.simScene = new THREE.Scene();
    this.simCamera = new THREE.OrthographicCamera(-width / 2, width / 2, height / 2, -height / 2, 0.00001, 1000);
    const simQuad = new THREE.Mesh(new THREE.BufferGeometry(1, 1), this.simShader);
    simQuad.scale.set(width, height, 1);
    this.simScene.add(simQuad);

    this.current = 0;
  }

  simulate(renderer, dt, point) {
    this.simShader.uniforms.mousePosition.value.copy(point);
    this.simShader.uniforms.time.value += dt;
    this.simShader.uniforms.dt.value = dt / 0.016;
    this.shader.uniforms.dpr.value = renderer.getPixelRatio();

    this.simShader.uniforms.positions.value = false;
    renderer.setRenderTarget(this.velocityFBOs[1 - this.current]);
    renderer.render(this.simScene, this.simCamera);
    renderer.setRenderTarget(null);

    this.simShader.uniforms.velTexture.value = this.velocityFBOs[1 - this.current].texture;

    this.simShader.uniforms.positions.value = true;
    renderer.setRenderTarget(this.positionFBOs[1 - this.current]);
    renderer.render(this.simScene, this.simCamera);
    renderer.setRenderTarget(null);

    this.simShader.uniforms.posTexture.value = this.positionFBOs[1 - this.current].texture;

    this.shader.uniforms.positions.value = this.positionFBOs[1 - this.current].texture;
    this.shader.uniforms.velocities.value = this.velocityFBOs[1 - this.current].texture;
    //debug.material.map = this.positionFBOs[1 - this.current].texture;

    this.simShader.uniforms.modulo.value = (this.simShader.uniforms.modulo.value + 1) % 4;
    this.current = 1 - this.current;
  }
}

export default { Simulation };

function randomInRange(min, max) {
  return min + Math.random() * (max - min);
}
function getFBO(w, h, options = {}, antialiased = false) {
//   if (antialiased) {
//     return new WebGLMultisampleRenderTarget(w, h, {
//       wrapS: options.wrapS || ClampToEdgeWrapping,
//       wrapT: options.wrapT || ClampToEdgeWrapping,
//       minFilter: options.minFilter || LinearFilter,
//       magFilter: options.magFilter || LinearFilter,
//       format: options.format || RGBAFormat,
//       type: options.type || UnsignedByteType,
//       stencilBuffer: options.stencilBuffer || false,
//       depthBuffer: options.depthBuffer || true,
//     });
//   }
  return new THREE.WebGLRenderTarget(w, h, {
    wrapS: options.wrapS || ClampToEdgeWrapping,
    wrapT: options.wrapT || ClampToEdgeWrapping,
    minFilter: options.minFilter || LinearFilter,
    magFilter: options.magFilter || LinearFilter,
    format: options.format || RGBAFormat,
    type: options.type || UnsignedByteType,
    stencilBuffer: options.stencilBuffer || false,
    depthBuffer: options.depthBuffer || true,
  });
}

export { getFBO };
