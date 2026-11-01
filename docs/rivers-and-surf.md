# Natural Rivers & Shoreline Surf Fix

## Rivers: blocky 90° channels → smooth natural curves

### Causes
1. **Grid staircase on the waterline.** Carving marked a cell wet when its *centre*
   was inside the channel. It then forced that cell ≥ 0.2 m below datum and held the
   bank ≥ 0.2 m above it. The h = 0 contour (the rendered waterline, in both the
   terrain and the freshwater mesh) therefore always fell halfway between cell centres,
   so it traced the 10 m wet mask as 0/45/90° steps.
2. **Kinked centrelines.** Reaches that did not reach the sea were extended downstream
   with raw D8 cell centres. `refineRiverNetwork` fitted a Catmull-Rom curve through
   *every* point (stride 1), which reproduces a staircase exactly.

### Changes (`src/engine/hydrology.js`)
- `refineRiverNetwork` now resamples each reach at a uniform arc-length spacing tied to
  its width. It then applies Taubin λ|μ low-pass smoothing, which removes grid zig-zags
  without shrinking meanders. Straight runs get gentle free meanders: wavelength
  ≈ 11 channel widths, amplitude ≈ 1 width, tapered so mouths and confluences stay put.
  Bends are curvature-limited to R ≥ ~2 widths. Parents are processed before children,
  and each child mouth is snapped onto its parent's final centreline.
- New `sculptRiverWaterlines` runs after every other terrain pass. This is worker
  `terrain/part05.js` and main-thread `island/part05.js`. It:
  - softens the carved channel core,
  - makes heights within ~1.2 cells of each river and lake edge an exact linear function
    of the true signed distance to that edge, with the same slope on both sides.

  Linear interpolation then places the waterline with sub-cell accuracy.
- Lakes export a signed distance (`lakeSD`) from their implicit shape so their shorelines
  get the same treatment (`terrain/part04.js`, `island/part04.js`).

## Surf: triangular "teeth", ghost sheets, and the swash on the sand

### Causes (`island/part11.js` → `surfAt`)
1. The bed texture is unclamped above sea level, so dry sea-mesh vertices got
   `eta = bed`, i.e. full terrain height. Triangles straddling the waterline tilted up
   the beach into tall slivers. These showed as a sawtooth row of teeth, plus
   translucent ghost sheets over the sand where the fade masks were partial.
2. Wet vertices point-sampled one-cell-sharp bores until the vertex spacing reached
   3 sim cells. Crests that crossed the lattice obliquely aliased into rows of triangles.

### Changes
- Dry vertices take the nearby wet-normalised water level and are tucked just below the
  sand. The terrain then clips the surface exactly at the simulated waterline.
- Wet vertices read the pre-filtered surface pyramid once the spacing exceeds one sim
  cell, with a footprint a little wider than the spacing. The breaking-lip "lean" is
  limited to wet near-field vertices.
- Swash (`island/part16.js`):
  - the thin film's skin is broken by flow-aligned backwash rills and grain-scale
    roughness, and its mirror breaks into patches instead of a glassy white sheet;
  - a ragged, bubbly lip now rides the uprush tongue;
  - a translucent bubble veil sits beneath the foam lace;
  - foam edges near the camera are softer.

## Verify
`node --test tests/sea-grid.test.mjs` and `npm run build` both pass. Running the
generator headless and rendering the heightfield's h = 0 contour shows smooth, curved
banks on every creek, tributary and the main stem, where before there were 10 m steps.
