import * as THREE from 'three';

const CELLS = 8;
const RANGE_FACTOR = 3.2;
const FAR_DISTANCE = 32000;
const SPACING = { high: 0.25, medium: 0.375, low: 0.5, lower: 0.75, lowest: 1 };

export const SEA_GRID_VERTEX = /* glsl */ `
uniform vec4 uLod;
uniform vec3 uLodCam;
attribute vec4 aTile;
vec2 seaGridPoint(out float spacing){
  float cell=aTile.z,level=aTile.w;
  vec2 grid=position.xz*uLod.y;
  vec2 p=aTile.xy+grid*cell;
  float end=uLod.x*exp2(level);
  float previous=level>.5?end*.5:0.;
  float morph=smoothstep(mix(previous,end,.62),end*.97,distance(uLodCam,vec3(p.x,0.,p.y)));
  // Collapse fine vertices onto the same global lattice as their coarse neighbours.
  p-=fract(grid*.5)*2.*cell*morph;
  spacing=cell*(1.+morph);
  return p;
}
`;

export function createSeaGrid() {
  const geometry = new THREE.InstancedBufferGeometry();
  const positions = [], indices = [];
  for (let z = 0; z <= CELLS; z++) {
    for (let x = 0; x <= CELLS; x++) positions.push(x / CELLS, 0, z / CELLS);
  }
  for (let z = 0; z < CELLS; z++) {
    for (let x = 0; x < CELLS; x++) {
      const a = z * (CELLS + 1) + x, b = a + 1, c = a + CELLS + 1, d = c + 1;
      indices.push(a, c, b, b, c, d);
    }
  }
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  let tiles = new THREE.InstancedBufferAttribute(new Float32Array(4096 * 4), 4);
  tiles.setUsage(THREE.DynamicDrawUsage);
  geometry.setAttribute('aTile', tiles);
  geometry.instanceCount = 0;
  geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1e7);
  const uniforms = {
    uLod: { value: new THREE.Vector4() },
    uLodCam: { value: new THREE.Vector3() },
  };
  let baseSpacing = SPACING.medium;
  const frustum = new THREE.Frustum(), matrix = new THREE.Matrix4(), box = new THREE.Box3();

  return {
    geometry,
    uniforms,
    setQuality(quality) { baseSpacing = SPACING[quality] ?? SPACING.medium; },
    update(camera, waveHeight = 16) {
      const eye = camera.position;
      const nodeSize = (level) => 2 * CELLS * baseSpacing * 2 ** level;
      const range = (level) => RANGE_FACTOR * nodeSize(level);
      const distance = (x, z, size) => Math.hypot(
        Math.max(x - eye.x, 0, eye.x - x - size),
        Math.max(z - eye.z, 0, eye.z - z - size),
        eye.y,
      );
      camera.updateMatrixWorld();
      matrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
      frustum.setFromProjectionMatrix(matrix);
      uniforms.uLod.value.set(range(0), CELLS, 0, 0);
      uniforms.uLodCam.value.copy(eye);
      const height = Math.max(24, waveHeight * 2);
      let count = 0;
      const push = (x, z, level) => {
        const cell = baseSpacing * 2 ** level, size = CELLS * cell;
        box.min.set(x - cell, -height, z - cell);
        box.max.set(x + size + cell, height, z + size + cell);
        if (!frustum.intersectsBox(box)) return;
        if (count === tiles.count) {
          const next = new THREE.InstancedBufferAttribute(new Float32Array(tiles.array.length * 2), 4);
          next.setUsage(THREE.DynamicDrawUsage);
          next.array.set(tiles.array);
          tiles = next;
          geometry.setAttribute('aTile', tiles);
        }
        tiles.array.set([x, z, cell, level], count++ * 4);
      };
      const visit = (x, z, level) => {
        const size = nodeSize(level), half = size * 0.5;
        if (distance(x, z, size) > FAR_DISTANCE) return;
        if (level === 0 || distance(x, z, size) > range(level - 1)) {
          push(x, z, level); push(x + half, z, level);
          push(x, z + half, level); push(x + half, z + half, level);
          return;
        }
        for (let i = 0; i < 4; i++) {
          const cx = x + (i & 1) * half, cz = z + (i >> 1) * half;
          if (distance(cx, cz, half) <= range(level - 1)) visit(cx, cz, level - 1);
          else push(cx, cz, level);
        }
      };
      const maxLevel = Math.max(1, Math.ceil(Math.log2(FAR_DISTANCE / range(0))));
      const rootSize = nodeSize(maxLevel);
      for (let z = Math.floor((eye.z - FAR_DISTANCE) / rootSize); z <= Math.floor((eye.z + FAR_DISTANCE) / rootSize); z++) {
        for (let x = Math.floor((eye.x - FAR_DISTANCE) / rootSize); x <= Math.floor((eye.x + FAR_DISTANCE) / rootSize); x++) {
          visit(x * rootSize, z * rootSize, maxLevel);
        }
      }
      geometry.instanceCount = count;
      tiles.clearUpdateRanges();
      tiles.addUpdateRange(0, count * 4);
      tiles.needsUpdate = true;
      return count;
    },
  };
}

// The breaker limit depends on the bed, never on the observer's height or distance.
export const SEA_DEPTH_LIMIT = /* glsl */ `
float seaDepthScale(float eta,float depth){
  float ratio=eta/max(.39*depth,.008);
  float r2=ratio*ratio;
  return inversesqrt(sqrt(1.+r2*r2));
}
`;