# Horizon Wave Fix

## Cause

The live renderer is `src/engine/island/part20.js`, which creates the sea through
`Zr` in `part17.js` and uses `En` / `Rn` in `part16.js`. The replacement shader
strings attached to globals by `App.tsx` are not the active rendering path.

The active vertex shader capped wave crests at `cameraPosition.y - 1.1` within a
camera-centred 10-70 m band. Approaching a crest therefore pushed it down while
leaving farther crests tall. A frozen 5 m test surface at one fixed world point
changed from 5 m to 1.2875 m simply because the camera moved closer. Raising the
camera also changed the water.

The radial mesh translated with the camera, resampling its sparse vertices as
the viewer moved. Separately, the render loop steered the global swell direction
towards the beach nearest the viewer, changing the phase of shoreline waves.

## Changes

- Removed the eye-height cap, camera-distance displacement fades, and viewer-based swell steering.
- Added `src/engine/sea-grid.js`: world-aligned, instanced LOD tiles with continuous coarse-grid morphing. Both colour and depth passes share the same geometry.
- Filtered FFT displacement by actual tile spacing instead of the old radial-grid estimate.
- Applied a smooth local-depth amplitude limit to both offshore and coastal FFT paths. Its crest-to-trough bound is `H <= 0.78 * depth`; shading slopes use the corresponding attenuation.
- Preserved the shallow-water simulation, swash, foam, wake textures, UI and weather controls. This is a renderer correction, not a global reduction of the wave-height slider.

## Verification

Run the source/grid checks:

```sh
node --test tests/sea-grid.test.mjs
```

The grid checks cover the forward view through 29 km at all five quality levels,
including world coordinates away from the origin.

The browser/GPU regression fixtures that originally accompanied this fix (Playwright
scripts and their generated reports) are not part of this trimmed copy. Full-scene
visual verification on a normal graphics device remains outstanding; the TypeScript
check and production build pass.
