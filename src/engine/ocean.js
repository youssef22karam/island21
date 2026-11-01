import * as THREE from 'three';
const {BufferGeometry,Color,DataTexture,Float32BufferAttribute,FloatType,GLSL3,HalfFloatType,LinearFilter,LinearMipmapLinearFilter,Mesh,NearestFilter,OrthographicCamera,RepeatWrapping,RGBAFormat,Scene,ShaderMaterial,WebGLRenderTarget}=THREE;
var fullscreenVertex = (
  /* glsl */
  `
void main() {
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`
);
var common = (
  /* glsl */
  `
precision highp float;
precision highp int;

const float PI = 3.141592653589793;
const float GRAVITY = 9.81;

vec2 cmul(vec2 a, vec2 b) {
  return vec2(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
}

// Multiplies by i.
vec2 mulI(vec2 a) {
  return vec2(-a.y, a.x);
}
`
);
var timeSpectrumFragment = (
  /* glsl */
  `
${common}
uniform sampler2D uH0;
uniform sampler2D uH1;
uniform float uMix;
uniform float uTime;
uniform float uLengthScale;
uniform float uDepth;
uniform int uSize;

layout(location = 0) out vec4 outA;
layout(location = 1) out vec4 outB;

void main() {
  ivec2 p = ivec2(gl_FragCoord.xy);
  vec2 n = vec2(
    p.x < uSize / 2 ? p.x : p.x - uSize,
    p.y < uSize / 2 ? p.y : p.y - uSize
  );
  vec2 k = n * 2.0 * PI / uLengthScale;
  float kLength = max(length(k), 1e-6);
  float invK = 1.0 / kLength;

  vec4 h0 = mix(texelFetch(uH0, p, 0), texelFetch(uH1, p, 0), uMix);
  float omega = sqrt(GRAVITY * kLength * tanh(min(kLength * uDepth, 20.0)));
  float phase = omega * uTime;
  vec2 e = vec2(cos(phase), sin(phase));
  vec2 h = cmul(h0.xy, e) + cmul(h0.zw, vec2(e.x, -e.y));
  vec2 ih = mulI(h);

  // Horizontal displacement points towards crests (choppy waves).
  vec2 dx = ih * k.x * invK;
  vec2 dz = ih * k.y * invK;
  vec2 dy = h;
  vec2 dxz = -h * k.x * k.y * invK;
  vec2 dyx = ih * k.x;
  vec2 dyz = ih * k.y;
  vec2 dxx = -h * k.x * k.x * invK;
  vec2 dzz = -h * k.y * k.y * invK;

  outA = vec4(dx + mulI(dz), dy + mulI(dxz));
  outB = vec4(dyx + mulI(dyz), dxx + mulI(dzz));
}
`
);
var fftFragment = (
  /* glsl */
  `
${common}
uniform sampler2D uInputA;
uniform sampler2D uInputB;
uniform int uSize;
uniform int uSubSize;
uniform bool uHorizontal;

layout(location = 0) out vec4 outA;
layout(location = 1) out vec4 outB;

void main() {
  ivec2 p = ivec2(gl_FragCoord.xy);
  int index = uHorizontal ? p.x : p.y;
  int halfSub = uSubSize / 2;
  int evenIndex = (index / uSubSize) * halfSub + (index % halfSub);
  int oddIndex = evenIndex + uSize / 2;
  ivec2 pe = uHorizontal ? ivec2(evenIndex, p.y) : ivec2(p.x, evenIndex);
  ivec2 po = uHorizontal ? ivec2(oddIndex, p.y) : ivec2(p.x, oddIndex);

  float angle = 2.0 * PI * float(index % uSubSize) / float(uSubSize);
  vec2 twiddle = vec2(cos(angle), sin(angle));

  vec4 evenA = texelFetch(uInputA, pe, 0);
  vec4 oddA = texelFetch(uInputA, po, 0);
  vec4 evenB = texelFetch(uInputB, pe, 0);
  vec4 oddB = texelFetch(uInputB, po, 0);

  outA = vec4(evenA.xy + cmul(twiddle, oddA.xy), evenA.zw + cmul(twiddle, oddA.zw));
  outB = vec4(evenB.xy + cmul(twiddle, oddB.xy), evenB.zw + cmul(twiddle, oddB.zw));
}
`
);
var assembleFragment = (
  /* glsl */
  `
${common}
uniform sampler2D uInputA;
uniform sampler2D uInputB;
uniform sampler2D uPrevious;
uniform float uChoppiness;
uniform float uDeltaTime;
uniform float uFoamDecay;

layout(location = 0) out vec4 outDisplacement;
layout(location = 1) out vec4 outDerivatives;

void main() {
  ivec2 p = ivec2(gl_FragCoord.xy);
  vec4 a = texelFetch(uInputA, p, 0);
  vec4 b = texelFetch(uInputB, p, 0);

  float dx = a.x;
  float dz = a.y;
  float dy = a.z;
  float dxz = a.w;
  float dyx = b.x;
  float dyz = b.y;
  float dxx = b.z;
  float dzz = b.w;

  float l = uChoppiness;
  float jacobian = (1.0 + l * dxx) * (1.0 + l * dzz) - l * l * dxz * dxz;

  // Turbulence relaxes back towards 1 and is pulled down wherever the surface folds.
  float previous = texelFetch(uPrevious, p, 0).a;
  float turbulence = previous + uDeltaTime * uFoamDecay / max(jacobian, 0.5);
  turbulence = min(jacobian, turbulence);

  outDisplacement = vec4(l * dx, dy, l * dz, turbulence);
  outDerivatives = vec4(dyx, dyz, l * dxx, l * dzz);
}
`
);

// src/ocean/spectrum.ts
var GRAVITY = 9.81;
function prepare(system) {
  const fetch = system.fetch * 1e3;
  const wind = Math.max(system.windSpeed, 0.1);
  return {
    ...system,
    angle: system.direction * Math.PI / 180,
    alpha: 0.076 * Math.pow(GRAVITY * fetch / (wind * wind), -0.22),
    peakOmega: 22 * Math.pow(wind * fetch / (GRAVITY * GRAVITY), -0.33)
  };
}
function frequency(k, depth) {
  return Math.sqrt(GRAVITY * k * Math.tanh(Math.min(k * depth, 20)));
}
function frequencyDerivative(k, depth) {
  const th = Math.tanh(Math.min(k * depth, 20));
  const ch = Math.cosh(Math.min(k * depth, 20));
  return GRAVITY * (depth * k / ch / ch + th) / frequency(k, depth) / 2;
}
function tmaCorrection(omega, depth) {
  const omegaH = omega * Math.sqrt(depth / GRAVITY);
  if (omegaH <= 1) return 0.5 * omegaH * omegaH;
  if (omegaH < 2) return 1 - 0.5 * (2 - omegaH) * (2 - omegaH);
  return 1;
}
function jonswap(omega, depth, s) {
  const sigma = omega <= s.peakOmega ? 0.07 : 0.09;
  const d = omega - s.peakOmega;
  const r = Math.exp(-(d * d) / (2 * sigma * sigma * s.peakOmega * s.peakOmega));
  const ratio = s.peakOmega / omega;
  return s.scale * tmaCorrection(omega, depth) * s.alpha * GRAVITY * GRAVITY * Math.pow(omega, -5) * Math.exp(-1.25 * ratio ** 4) * Math.pow(Math.abs(s.peakEnhancement), r);
}
var LANCZOS = [
  676.5203681218851,
  -1259.1392167224028,
  771.3234287776531,
  -176.6150291621406,
  12.507343278686905,
  -0.13857109526572012,
  9984369578019572e-21,
  15056327351493116e-23
];
function logGamma(x) {
  if (x < 0.5) return Math.log(Math.PI / Math.abs(Math.sin(Math.PI * x))) - logGamma(1 - x);
  const z = x - 1;
  let a = 0.9999999999998099;
  const t = z + 7.5;
  for (const [i, c] of LANCZOS.entries()) a += c / (z + i + 1);
  return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(a);
}
function cos2sNormalisation(s) {
  return Math.exp(logGamma(s + 1) - logGamma(s + 0.5)) / (2 * Math.sqrt(Math.PI));
}
function spreadPower(omega, peakOmega) {
  const ratio = omega / peakOmega;
  return ratio > 1 ? 9.77 * Math.pow(ratio, -2.5) : 6.97 * Math.pow(ratio, 5);
}
function angleDifference(a, b) {
  let d = a - b;
  while (d > Math.PI) d -= 2 * Math.PI;
  while (d < -Math.PI) d += 2 * Math.PI;
  return d;
}
function directionSpectrum(theta, omega, s) {
  const power = spreadPower(omega, s.peakOmega) + 16 * Math.tanh(Math.min(omega / s.peakOmega, 20)) * s.swell * s.swell;
  const delta = angleDifference(theta, s.angle);
  const cos2s = cos2sNormalisation(power) * Math.pow(Math.abs(Math.cos(0.5 * delta)), 2 * power);
  const uniform = 1 / (2 * Math.PI);
  return uniform + (cos2s - uniform) * s.spreadBlend;
}
function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = a + 1831565813 >>> 0;
    let t = a;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function createGaussianNoise(size2, seed) {
  const random = mulberry32(seed);
  const noise = new Float32Array(size2 * size2 * 2);
  for (let i = 0; i < size2 * size2; i++) {
    const u1 = Math.max(random(), 1e-12);
    const u2 = random();
    const r = Math.sqrt(-2 * Math.log(u1));
    noise[i * 2] = r * Math.cos(2 * Math.PI * u2);
    noise[i * 2 + 1] = r * Math.sin(2 * Math.PI * u2);
  }
  return noise;
}
function buildInitialSpectrum(size2, range, systems, depth, noise) {
  const prepared = systems.map(prepare);
  const deltaK = 2 * Math.PI / range.lengthScale;
  const amplitude = new Float32Array(size2 * size2 * 2);
  for (let y = 0; y < size2; y++) {
    const ny = y < size2 / 2 ? y : y - size2;
    for (let x = 0; x < size2; x++) {
      const nx = x < size2 / 2 ? x : x - size2;
      const kx = nx * deltaK;
      const kz = ny * deltaK;
      const k = Math.hypot(kx, kz);
      const index = y * size2 + x;
      if (k <= range.cutoffLow || k > range.cutoffHigh) continue;
      const theta = Math.atan2(kz, kx);
      const omega = frequency(k, depth);
      const dOmegaDk = frequencyDerivative(k, depth);
      let spectrum = 0;
      for (const system of prepared) {
        const fade = Math.exp(-system.shortWavesFade * system.shortWavesFade * k * k);
        spectrum += jonswap(omega, depth, system) * directionSpectrum(theta, omega, system) * fade;
      }
      const variance = spectrum * dOmegaDk * deltaK * deltaK / k;
      const a = Math.sqrt(Math.max(variance, 0) / 4);
      amplitude[index * 2] = (noise[index * 2] ?? 0) * a;
      amplitude[index * 2 + 1] = (noise[index * 2 + 1] ?? 0) * a;
    }
  }
  const data = new Float32Array(size2 * size2 * 4);
  for (let y = 0; y < size2; y++) {
    for (let x = 0; x < size2; x++) {
      const index = y * size2 + x;
      const mirror = (size2 - y) % size2 * size2 + (size2 - x) % size2;
      data[index * 4] = amplitude[index * 2] ?? 0;
      data[index * 4 + 1] = amplitude[index * 2 + 1] ?? 0;
      data[index * 4 + 2] = amplitude[mirror * 2] ?? 0;
      data[index * 4 + 3] = -(amplitude[mirror * 2 + 1] ?? 0);
    }
  }
  return data;
}

// src/ocean/OceanSimulation.ts
var CASCADE_LENGTHS = [420, 61, 11];
var OceanSimulation = class {
  constructor(renderer2, settings, size2 = 256) {
    this.renderer = renderer2;
    this.settings = settings;
    this.size = size2;
    const geometry = new BufferGeometry();
    geometry.setAttribute(
      "position",
      new Float32BufferAttribute([-1, -1, 0, 3, -1, 0, -1, 3, 0], 3)
    );
    this.quad = new Mesh(geometry);
    this.quad.frustumCulled = false;
    this.scene.add(this.quad);
    const makeFftTarget = () => new WebGLRenderTarget(size2, size2, {
      count: 2,
      type: FloatType,
      format: RGBAFormat,
      minFilter: NearestFilter,
      magFilter: NearestFilter,
      depthBuffer: false,
      generateMipmaps: false
    });
    this.fftTargets = [makeFftTarget(), makeFftTarget()];
    const anisotropy = renderer2.capabilities.getMaxAnisotropy();
    const makeOutputTarget = () => {
      const target = new WebGLRenderTarget(size2, size2, {
        count: 2,
        type: HalfFloatType,
        format: RGBAFormat,
        minFilter: LinearMipmapLinearFilter,
        magFilter: LinearFilter,
        wrapS: RepeatWrapping,
        wrapT: RepeatWrapping,
        depthBuffer: false,
        generateMipmaps: true,
        anisotropy
      });
      for (const texture of target.textures) {
        texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;
        texture.minFilter = LinearMipmapLinearFilter;
        texture.generateMipmaps = true;
        texture.anisotropy = anisotropy;
      }
      return target;
    };
    const boundaries = CASCADE_LENGTHS.map((length) => 2 * Math.PI / length * 6);
    this.cascades = CASCADE_LENGTHS.map((lengthScale, i) => {
      const h0 = new DataTexture(
        new Float32Array(size2 * size2 * 4),
        size2,
        size2,
        RGBAFormat,
        FloatType
      );
      h0.minFilter = NearestFilter;
      h0.magFilter = NearestFilter;
      return {
        lengthScale,
        cutoffLow: i === 0 ? 1e-4 : boundaries[i] ?? 0,
        cutoffHigh: boundaries[i + 1] ?? Number.POSITIVE_INFINITY,
        h0,
        noise: createGaussianNoise(size2, 1337 + i * 7919),
        outputs: [makeOutputTarget(), makeOutputTarget()],
        current: 0
      };
    });
    const base = {
      glslVersion: GLSL3,
      vertexShader: fullscreenVertex,
      depthTest: false,
      depthWrite: false
    };
    this.timeMaterial = new ShaderMaterial({
      ...base,
      fragmentShader: timeSpectrumFragment,
      uniforms: {
        uH0: { value: null },
        uH1: { value: null },
        uMix: { value: 0 },
        uTime: { value: 0 },
        uLengthScale: { value: 1 },
        uDepth: { value: settings.depth },
        uSize: { value: size2 }
      }
    });
    this.fftMaterial = new ShaderMaterial({
      ...base,
      fragmentShader: fftFragment,
      uniforms: {
        uInputA: { value: null },
        uInputB: { value: null },
        uSize: { value: size2 },
        uSubSize: { value: 2 },
        uHorizontal: { value: true }
      }
    });
    this.assembleMaterial = new ShaderMaterial({
      ...base,
      fragmentShader: assembleFragment,
      uniforms: {
        uInputA: { value: null },
        uInputB: { value: null },
        uPrevious: { value: null },
        uChoppiness: { value: settings.choppiness },
        uDeltaTime: { value: 0 },
        uFoamDecay: { value: settings.foamDecay }
      }
    });
    this.resetFoam();
    this.updateSpectrum();
  }
  renderer;
  settings;
  size;
  cascades;
  camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
  scene = new Scene();
  quad;
  fftTargets;
  timeMaterial;
  fftMaterial;
  assembleMaterial;
  /** Recomputes h0(k) for every cascade. Call after changing wave systems or depth. */
  updateSpectrum() {
    for (const cascade of this.cascades) {
      const data = buildInitialSpectrum(
        this.size,
        cascade,
        this.settings.systems,
        this.settings.depth,
        cascade.noise
      );
      cascade.h0.image.data = data;
      cascade.h0.needsUpdate = true;
    }
  }
  displacement(index) {
    const cascade = this.cascade(index);
    return cascade.outputs[cascade.current].textures[0];
  }
  derivatives(index) {
    const cascade = this.cascade(index);
    return cascade.outputs[cascade.current].textures[1];
  }
  update(time, deltaTime) {
    const previousTarget = this.renderer.getRenderTarget();
    const log2Size = Math.log2(this.size);
    this.timeMaterial.uniforms.uDepth.value = this.settings.depth;
    this.assembleMaterial.uniforms.uChoppiness.value = this.settings.choppiness;
    this.assembleMaterial.uniforms.uFoamDecay.value = this.settings.foamDecay;
    this.assembleMaterial.uniforms.uDeltaTime.value = deltaTime;
    for (const cascade of this.cascades) {
      let read = 0;
      this.timeMaterial.uniforms.uH0.value = cascade.h0;
      this.timeMaterial.uniforms.uH1.value = cascade.h0b;
      this.timeMaterial.uniforms.uMix.value = this.mix;
      this.timeMaterial.uniforms.uTime.value = time;
      this.timeMaterial.uniforms.uLengthScale.value = cascade.lengthScale;
      this.draw(this.timeMaterial, this.fftTargets[read]);
      for (const horizontal of [true, false]) {
        for (let stage = 0; stage < log2Size; stage++) {
          const source = this.fftTargets[read];
          const destination = this.fftTargets[read === 0 ? 1 : 0];
          this.fftMaterial.uniforms.uInputA.value = source.textures[0];
          this.fftMaterial.uniforms.uInputB.value = source.textures[1];
          this.fftMaterial.uniforms.uSubSize.value = 2 << stage;
          this.fftMaterial.uniforms.uHorizontal.value = horizontal;
          this.draw(this.fftMaterial, destination);
          read = read === 0 ? 1 : 0;
        }
      }
      const previous = cascade.outputs[cascade.current];
      const next = cascade.current === 0 ? 1 : 0;
      this.assembleMaterial.uniforms.uInputA.value = this.fftTargets[read].textures[0];
      this.assembleMaterial.uniforms.uInputB.value = this.fftTargets[read].textures[1];
      this.assembleMaterial.uniforms.uPrevious.value = previous.textures[0];
      this.draw(this.assembleMaterial, cascade.outputs[next]);
      cascade.current = next;
    }
    this.renderer.setRenderTarget(previousTarget);
  }
  resetFoam() {
    const previousTarget = this.renderer.getRenderTarget();
    const clearColor = this.renderer.getClearColor(new Color());
    const clearAlpha = this.renderer.getClearAlpha();
    this.renderer.setClearColor(0, 1);
    for (const cascade of this.cascades) {
      for (const target of cascade.outputs) {
        this.renderer.setRenderTarget(target);
        this.renderer.clear(true, false, false);
      }
    }
    this.renderer.setClearColor(clearColor, clearAlpha);
    this.renderer.setRenderTarget(previousTarget);
  }
  cascade(index) {
    const cascade = this.cascades[index];
    if (!cascade) throw new Error(`No cascade ${index}`);
    return cascade;
  }
  draw(material, target) {
    this.quad.material = material;
    this.renderer.setRenderTarget(target);
    this.renderer.render(this.scene, this.camera);
  }
};


export class IntegratedOcean extends OceanSimulation {
  constructor(renderer, settings, size) {
    super(renderer, settings, size);
    this.bands = this.cascades;
    this.mix = 0;
    for (const band of this.bands) {
      band.h0b = new DataTexture(new Float32Array(size*size*4),size,size,RGBAFormat,FloatType);
      band.h0b.minFilter = band.h0b.magFilter = NearestFilter;
      band.h0b.needsUpdate = true;
    }
  }
  dispose() {
    for (const c of this.cascades) { c.h0.dispose(); c.h0b.dispose(); c.outputs.forEach(t=>t.dispose()); }
    this.fftTargets.forEach(t=>t.dispose()); this.quad.geometry.dispose();
    this.timeMaterial.dispose(); this.fftMaterial.dispose(); this.assembleMaterial.dispose();
  }
}
export function transitionSpectrum(sim, settings, duration=1.5) {
  let queue=[], fade=1, last=-9;
  const state={dirty:true,update(dt,time){
    if(queue.length){const c=sim.cascades[queue.shift()];c.h0b.image.data=buildInitialSpectrum(sim.size,c,settings.systems,settings.depth,c.noise);c.h0b.needsUpdate=true;if(!queue.length)fade=0;}
    else if(fade<1){fade=Math.min(1,fade+dt/duration);sim.mix=fade;if(fade>=1){sim.cascades.forEach(c=>[c.h0,c.h0b]=[c.h0b,c.h0]);sim.mix=0;}}
    else if(state.dirty&&time-last>duration){state.dirty=false;last=time;queue=[0,1,2];}
  }};
  return state;
}
export { buildInitialSpectrum, createGaussianNoise, CASCADE_LENGTHS };
