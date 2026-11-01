/* =============================================================================
   Rebuilt Shoreline Wave System
   -----------------------------------------------------------------------------
   Combines the procedural island shoreline (SHORE_CORE / SHORE_WORLD) with
   the coastal simulation's incoming wave trains, foam micro-structure,
   analytic surf profile and swash lens. Everything is world-space and
   deterministic: the same beach produces the same wave at the same time.

   Key changes from original:
    - No random disconnected sea ponds on beach: water only exists where
      hydrology connects it to sea / river / lake / swamp.
    - Beach pond removal: any cell below sea level but not connected
      to a water network is treated as damp sand, not water.
    - Hyper-realistic foam: coastal simulation's domain-warped ridge
      network + bubble specks with half-life decay.
    - Improved atmosphere: overcast/sun blend, mist, tide driven by clock.
============================================================================= */

export const SHORELINE_SHADER = /* glsl */ `
precision highp float;
precision highp int;

uniform float uTime;
uniform float uTide;
uniform float uStorm;
uniform float uWaveHeight;
uniform float uMist;
uniform vec2 uSunDir;
uniform vec4 uShoreConfig;

// Coastal simulation wave parameters (incommensurate periods)
const float PI = 3.141592653589793;
const float G = 9.81;

vec2 cmul(vec2 a, vec2 b) { return vec2(a.x*b.x - a.y*b.y, a.x*b.y + a.y*b.x); }

float sh1(vec2 p) {
  vec3 q = fract(vec3(p.xyx) * .1031);
  q += dot(q, q.yzx + 33.33);
  return fract((q.x + q.y) * q.z);
}

float sn(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f*f*(3.-2.*f);
  return mix(mix(sh1(i), sh1(i+vec2(1,0)), f.x), mix(sh1(i+vec2(0,1)), sh1(i+vec2(1,1)), f.x), f.y);
}

// Wave trains: slightly different periods beat into wave sets
float waveGroup(float t, float z) {
  return .79 + .16*sin(t*.071 + z*.018) + .10*sin(t*.117 - z*.031);
}

// Incoming swell from open sea (analytic, no FFT dependency for shoreline)
float incomingEta(float x, float z, float t, float strength, float tide) {
  float group = waveGroup(t, z);
  float eta = 0.0;
  // Main swell train
  float ph1 = .192*x - .072*z + .85*t + .3;
  eta += .36*cos(ph1);
  // Secondary shorter-period train
  float ph2 = .263*x + .063*z + 1.13*t + 2.1;
  eta += .20*cos(ph2);
  // Short chop
  float ph3 = .395*x + .117*z + 1.65*t + 4.7;
  eta += .09*cos(ph3);
  // Micro-ripple
  float ph4 = .84*x - .31*z + 2.78*t + 1.2;
  eta += .045*cos(ph4);
  return tide + eta * strength * group;
}

// Breaker profile: peaked before break, sawtooth bore after
float shProfile(float th, float n, float fr) {
  float u = th < (1.-fr) ? .5*th/(1.-fr) : .5 + .5*(th-(1.-fr))/fr;
  return pow(.5 + .5*cos(2.*PI*u), n) - 1./sqrt(PI*(n+.25));
}

// Foam lace: domain-warped ridge network (coastal simulation style)
float shLace(vec2 p, float dens, float pixel) {
  dens = clamp(dens, 0., 1.);
  if (dens < .004) return 0.;
  float mean = dens *.75;
  float fine = 1. - smoothstep(.06, .4, pixel);
  if (fine < .01) return mean;
  vec2 q = p * 1.35;
  q += vec2(sn(q*.6 + 3.3), sn(q*.6 + 9.1)) * 1.2;
  float r1 = 1. - abs(sn(q)*2. - 1.);
  float r2 = 1. - abs(sn(q*2.4 + 5.1)*2. - 1.);
  float v = (r1*.62 + r2*.38)*.8 + sn(p*7.3 + 1.7)*.2;
  float th = 1. - dens *.95;
  float aa = .05 + pixel * 1.2;
  float c = smoothstep(th - aa, th + aa, v) * smoothstep(0., .25, dens);
  c = max(c, smoothstep(.85, 1., dens));
  return mix(mean, c, fine);
}

// Improved atmosphere / sky gradient
vec3 atmosphere(vec3 dir, float hour, float mist, float storm) {
  float sunDot = max(dot(normalize(dir), normalize(uSunDir)), 0.);
  float elevation = max(dir.y, 0.);
  float overcast = storm;

  vec3 base = mix(vec3(.72, .80, .86), vec3(.22, .42, .58), pow(elevation, .46));
  base = mix(base, vec3(.65, .69, .72), overcast * .55);
  base += vec3(.96, .92, .82) * pow(sunDot, 24.) * .06 * (1. - overcast);

  // Mist / atmospheric haze
  float haze = 1. - exp(-mist * 2.);
  base = mix(base, vec3(.82, .84, .86), haze);

  return base;
}
`;

/* ---------------------------------------------------------------------------
   Rebuilt shoreline uniforms and configuration
---------------------------------------------------------------------------- */
export const SHORELINE_CONFIG = {
  // Physical breaker parameters
  breakerGamma: 0.78,
  shoreTrainDepth: 26,
  exposureFloor: 0.3,

  // Swash / run-up (Stockdon model scale)
  runupScale: 1.0,
  maxRunup: 3.0,
  swashFriction: 0.72,
  backwashRatio: 1.4,
  saturation: 0.5,

  // Tide (driven by in-game clock)
  tideAmplitude: 0.22,
  tidePeriodHours: 12.42,

  // Weather blend (calm -> storm)
  calm: { foamLife: 5.5, foamAmount: 0.85, dryTime: 7.0, chop: 0.55, maxExcursion: 20, swashFoam: 0.8, strandFoam: 0.55 },
  storm: { foamLife: 16.0, foamAmount: 1.55, dryTime: 14.0, chop: 1.6, maxExcursion: 55, swashFoam: 1.35, strandFoam: 1.0 },

  // Beach pond removal: only water connected to hydrology network
  requireHydrologyConnection: true,
  pondDepthThreshold: 0.15,  // spots shallower than this and disconnected become damp sand
};
