import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import * as THREE from 'three';
import { createSeaGrid, SEA_GRID_VERTEX } from '../src/engine/sea-grid.js';
import { En } from '../src/engine/island/part16.js';

test('the active water shader has no eye-height cap or camera-following radial coordinates', () => {
  assert.ok(En.includes(SEA_GRID_VERTEX));
  assert.doesNotMatch(En, /camCap|cameraPosition|uGridO|uAng|farFade/);
  assert.match(En, /seaDepthScale\(disp.y,depth\)/);
  assert.match(En, /seaDepthScale\(disp.y\+yFar,depth\)/);
});

test('the render loop updates the tiled mesh and leaves swell direction to weather', async () => {
  const loop = await readFile(new URL('../src/engine/island/part20.js', import.meta.url), 'utf8');
  assert.match(loop, /updateSeaGrid\(m, l.hs\)/);
  assert.doesNotMatch(loop, /__PF.grid|L.uSwDir.value.copy|ie.lerp\(he.dir/);
});

test('tiles stay on a fixed world lattice at every quality, including far from the origin', () => {
  const grid = createSeaGrid();
  const camera = new THREE.PerspectiveCamera(60, 16 / 9, 0.4, 30000);
  for (const quality of ['lowest', 'lower', 'low', 'medium', 'high']) {
    grid.setQuality(quality);
    for (const eye of [[0, 1.7, 0], [75, 1.7, 0], [8123.5, 3, -8340.75], [-9000, 800, 7400]]) {
      camera.position.set(...eye);
      camera.lookAt(eye[0] + 100, eye[1] - 2, eye[2]);
      const count = grid.update(camera, 22);
      assert.ok(count > 0 && count < 4096, `${quality}: bounded nonempty tile list`);
      const tiles = grid.geometry.getAttribute('aTile');
      for (let i = 0; i < count; i++) {
        const size = tiles.getZ(i) * 8;
        for (const origin of [tiles.getX(i), tiles.getY(i)]) {
          assert.ok(Math.abs(origin / size - Math.round(origin / size)) < 1e-6, 'world-aligned tile origin');
        }
      }
      // The forward ray must remain covered through successive LOD transitions.
      if (eye[1] < 10) {
        for (const distance of [2, 8, 20, 50, 100, 250, 1000, 5000, 15000, 29000]) {
          const x = eye[0] + distance, z = eye[2];
          let covered = false;
          for (let i = 0; i < count; i++) {
            const size = tiles.getZ(i) * 8;
            if (x >= tiles.getX(i) && x <= tiles.getX(i) + size && z >= tiles.getY(i) && z <= tiles.getY(i) + size) covered = true;
          }
          assert.ok(covered, `${quality}: no hole ${distance}m ahead`);
        }
      }
    }
  }
  grid.geometry.dispose();
});