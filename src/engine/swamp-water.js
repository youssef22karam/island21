/* =============================================================================
   Rebuilt Swamp Water System
   -----------------------------------------------------------------------------
   Dark, sediment-rich water with dense vegetation reflections, low visibility,
   floating debris layers and a subtle green-brown body colour that responds
   to weather and time of day. No bright turquoise here.
============================================================================= */

export const SWAMP_SHADER = /* glsl */ `
precision highp float;

uniform float uTime;
uniform float uTide;
uniform float uMist;
uniform float uStorm;
uniform float uHour;
uniform float uRain;

uniform sampler2D uNoise;
uniform sampler2D uDepthTex;

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

// Sediment turbidity: storm + rain increase brown-green opacity
vec3 swampBody(float depth, float storm, float rain, float mist) {
  // Base swamp colour: dark olive / brown-green
  vec3 base = mix(vec3(.05, .11, .07), vec3(.09, .16, .10), depth * .15);

  // Sediment load from weather
  float sediment = clamp(storm * .6 + rain * .8, 0., 1.);
  vec3 silt = vec3(.22, .19, .13);
  base = mix(base, base * silt, sediment * .7);

  // Mist / fog in swamp: dense morning fog
  float fogDensity = mist + storm * .3;
  float fog = 1. - exp(-fogDensity * 1.5);
  base = mix(base, vec3(.55, .58, .52), fog * .6);

  return base;
}

// Floating vegetation and debris layer
float swampVegetation(vec2 p, float time) {
  float v = 0.;
  // Large lily pads / duckweed clusters
  v += smoothstep(.55, .65, sn(p*.025 + time*.003)) * .6;
  v += smoothstep(.45, .55, sn(p*.08 + time*.008)) * .4;
  // Small floating debris
  v += smoothstep(.65, .75, sn(p*.4 + vec2(time*.015, time*.01))) * .3;
  return clamp(v, 0., 1.);
}

// Swamp water surface: very little chop, mostly glassy with subtle ripples
vec2 swampSlope(vec2 p, float time, float storm) {
  float chop = storm * .15 + .05;
  float ripple = .02 * sn(p * (.5 + storm * .3) + time * (.2 + storm * .1));
  return vec2(ripple, ripple) * chop;
}
`;

export const SWAMP_CONFIG = {
  visibility: 0.8,
  sedimentBase: 0.35,
  vegetationDensity: 0.6,
  floatingDebris: 0.25,
  fogBase: 0.15,
};
