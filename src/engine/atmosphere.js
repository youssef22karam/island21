/* =============================================================================
   Rebuilt Atmosphere System
   -----------------------------------------------------------------------------
   Hyper-realistic sky with layered clouds, sun/moon glint, atmospheric
   scattering, mist/haze driven by weather and time, and a softened
   overcast blend. The sky responds to storm intensity, fog density,
   and the position of the sun.
============================================================================= */

export const ATMOSPHERE_SHADER = /* glsl */ `
precision highp float;

uniform float uTime;
uniform float uHour;        // 0..24
uniform float uStorm;       // 0..1
uniform float uMist;        // 0..1
uniform float uCloudCover;  // 0..1
uniform vec3 uSunDir;
uniform vec3 uMoonDir;
uniform float uMoonPhase;

// Atmospheric scattering coefficients (Rayleigh-like approximation)
const vec3 SKY_BLUE = vec3(.42, .65, .82);
const vec3 SKY_HORIZON = vec3(.75, .80, .85);
const vec3 STORM_GREY = vec3(.55, .58, .63);
const vec3 SUNSET_ORANGE = vec3(.96, .45, .22);

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

// Layered cloud field (two layers at different speeds and scales)
float cloudDensity(vec2 p, float time) {
  float c1 = smoothstep(.55, .75, sn(p * .015 + vec2(time * .002, time * .001)));
  float c2 = smoothstep(.45, .65, sn(p * .035 - vec2(time * .003, time * .0025)));
  float c3 = smoothstep(.50, .70, sn(p * .008 + vec2(time * .0015, 0.)));
  return min(1., c1 + c2 * .6 + c3 * .4);
}

// Sun disc with atmospheric glare
float sunDisc(vec3 viewDir, vec3 sunDir) {
  float sunDot = max(dot(normalize(viewDir), normalize(sunDir)), 0.);
  float disc = smoothstep(.99985, .99997, sunDot);
  float glare = exp(-pow(sunDot - 1., 2.) * 40.) * .15;
  return disc + glare;
}

// Fog / haze density based on mist and storm
float hazeDensity(float mist, float storm, float distance) {
  float base = mist * 1.5 + storm * .8;
  return 1. - exp(-base * distance * .001);
}

// Sky gradient based on elevation and sun position
vec3 skyGradient(vec3 dir, float hour, float mist, float storm, float cloudCover) {
  float elevation = max(dir.y, 0.);
  float sunDot = max(dot(normalize(dir), normalize(uSunDir)), 0.);

  // Base gradient
  vec3 color = mix(vec3(.20, .35, .48), SKY_BLUE, pow(elevation, .46));
  color = mix(color, SKY_HORIZON, smoothstep(.02, .15, elevation));

  // Sunset / sunrise tint based on sun elevation
  float sunElevation = max(uSunDir.y, 0.);
  float sunset = smoothstep(.0, .12, sunElevation) * (1. - smoothstep(.12, .35, sunElevation));
  color = mix(color, mix(color, SUNSET_ORANGE, sunset * .7), sunset * cloudCover * .3);

  // Overcast blend
  float overcast = storm;
  color = mix(color, STORM_GREY, overcast * .6);
  color = mix(color, mix(STORM_GREY, color, .4), overcast * cloudCover * .5);

  // Mist / haze
  float haze = hazeDensity(mist, storm, 1.);
  color = mix(color, SKY_HORIZON * .9, haze * .3);

  // Clouds
  float clouds = cloudDensity(dir.xz * .8 + vec2(uTime * .001, 0.), uTime);
  clouds = mix(clouds, cloudDensity(dir.xz * 2. + vec2(0., uTime * .002), uTime), .5);
  float cloudMask = smoothstep(.5 - cloudCover * .2, .5 + cloudCover * .2, clouds);
  vec3 cloudColor = mix(vec3(.9, .92, .96), vec3(.55, .58, .62), overcast);
  color = mix(color, cloudColor, cloudMask * cloudCover);

  return color;
}
`;

export const ATMOSPHERE_CONFIG = {
  sunColor: [1.0, 0.95, 0.85],
  moonColor: [0.85, 0.88, 0.95],
  cloudLayers: 2,
  hazeBase: 0.12,
  mistMax: 0.8,
};
