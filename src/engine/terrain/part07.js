// terrain.worker.js - part 7/9 (statements 59-81 of the original module).
import { At } from "./part01.js";
import { Ae, Fn, Ke, Ot, Rn, Sn, Tn, Ye, _e, de, lt, rt, xe } from "./part06.js";

function Hn(o, n) {
  let e = At(o),
    r = new Ot(),
    a = 9 + e() * 6.5,
    f = 1.4 + e() * 0.85,
    t = (x) => lt(0.22, 0.21, 0.15).lerp(lt(0.28, 0.27, 0.18), x);
  r.tube(
    [
      new rt(0, f * 0.3, 0),
      new rt(0.12, a * 0.45, 0.05),
      new rt(0, a * 0.76, 0),
    ],
    [0.24, 0.17, 0.1],
    n ? 5 : 7,
    t,
    (x) => x * x * 0.01,
  );
  let l = 18;
  for (let x = 0; x < l; x++) {
    let M = (x / l) * Math.PI * 2 + e() * 0.38,
      g = 1.8 + e() * 2.2,
      w = f + e() * 1.5,
      y = Math.cos(M) * g,
      b = Math.sin(M) * g,
      v = new rt(y * 0.55, w + 0.35 + e() * 0.3, b * 0.55);
    ((!n || x % 2 === 0) &&
      r.tube(
        [
          new rt(Math.cos(M) * 0.12, w, Math.sin(M) * 0.12),
          v,
          new rt(y * 0.9, w * 0.35, b * 0.9),
          new rt(y, -0.7, b),
        ],
        [0.12, 0.09, 0.055, 0.035],
        n ? 3 : 6,
        () => lt(0.28, 0.25, 0.18),
        () => 0,
      ),
      !n &&
        x % 3 === 0 &&
        r.tube(
          [
            v,
            new rt(
              y * 0.92 - Math.sin(M) * 0.55,
              w * 0.36,
              b * 0.92 + Math.cos(M) * 0.55,
            ),
            new rt(y - Math.sin(M) * 0.85, -0.6, b + Math.cos(M) * 0.85),
          ],
          [0.055, 0.035, 0.018],
          4,
          () => lt(0.24, 0.21, 0.15),
          () => 0,
        ));
  }
  let c = new rt(0, a * 0.76, 0),
    p = a * (0.38 + e() * 0.1),
    h = p * 0.54,
    i = [{ c: new rt(0, c.y + h * 0.48, 0), r: p * 0.62 }];
  for (let x = 0; x < 6; x++) {
    let M = (x / 6) * Math.PI * 2 + e() * 0.7,
      g = p * (0.52 + 0.3 * e());
    i.push({
      c: new rt(
        Math.cos(M) * g,
        c.y + (e() - 0.25) * h * 0.55,
        Math.sin(M) * g,
      ),
      r: p * (0.44 + 0.15 * e()),
    });
  }
  return (
    Ae(
      r,
      e,
      i,
      new rt(0, c.y + h * 0.3, 0),
      h,
      15,
      4,
      n,
      lt(0.14, 0.27, 0.07),
      lt(0.45, 0.62, 0.21),
      1,
      0.025,
    ),
    r.build()
  );
}
function Dn(o) {
  let n = At(o),
    e = new Ot(),
    r = (o & 1) === 1,
    a = (f) => lt(0.56, 0.55, 0.48).lerp(lt(0.38, 0.39, 0.33), f);
  if (r) {
    let f = 3.8 + n() * 2.2;
    e.tube(
      [new rt(0, -0.6, 0), new rt(0.08, f * 0.5, 0), new rt(0.14, f, 0)],
      [0.28, 0.21, 0.17],
      7,
      a,
      () => 0,
    );
    let t = 5.2 + n() * 2.8,
      l = n() * Math.PI * 2,
      c = Math.cos(l) * t,
      p = Math.sin(l) * t;
    e.tube(
      [
        new rt(0.12, f - 0.15, 0),
        new rt(c * 0.52, f * 0.55, p * 0.52),
        new rt(c, 0.65, p),
      ],
      [0.16, 0.13, 0.08],
      7,
      a,
      () => 0,
    );
    for (let h = 0; h < 3; h++) {
      let i = l + (h - 1) * 0.65;
      e.tube(
        [
          new rt(c, 0.65, p),
          new rt(
            c + Math.cos(i) * 1.4,
            0.25 + (h & 1) * 0.6,
            p + Math.sin(i) * 1.4,
          ),
        ],
        [0.06, 0.02],
        5,
        a,
        () => 0,
      );
    }
  } else {
    let f = 5.5 + n() * 6.5,
      t = (n() - 0.5) * 0.8,
      l = (n() - 0.5) * 0.8;
    e.tube(
      [new rt(0, -0.65, 0), new rt(t * 0.3, f * 0.5, l * 0.3), new rt(t, f, l)],
      [0.25, 0.16, 0.06],
      7,
      a,
      () => 0,
    );
    let c = 3 + ((n() * 3) | 0);
    for (let p = 0; p < c; p++) {
      let h = 0.45 + n() * 0.42,
        i = n() * Math.PI * 2,
        x = f * (0.18 + n() * 0.22),
        M = new rt(t * h, f * h, l * h),
        g = new rt(
          M.x + Math.cos(i) * x,
          M.y + x * 0.65,
          M.z + Math.sin(i) * x,
        );
      e.tube([M, g], [0.08, 0.024], 5, a, () => 0);
    }
  }
  return e.build();
}
function jn(o) {
  let n = At(o),
    e = 8 + n() * 9;
  return { a: n() * Math.PI * 2, bend: (0.12 + n() * 0.24) * e };
}
var In = () => lt(0.2, 0.15, 0.1),
  $e = () => lt(0.12, 0.1, 0.075);
function Yn(o, n) {
  let e = At(o),
    r = new Ot(),
    a = 12 + e() * 10,
    f = (e() - 0.5) * 0.12 * a,
    t = e() * Math.PI * 2,
    l = Math.cos(t) * f,
    c = Math.sin(t) * f,
    p = a * 0.03,
    h = a * 0.74,
    i = (R) =>
      new rt(
        l * R * R + Math.sin(R * 5 + o) * 0.006 * a,
        -0.6 + (h + 0.6) * R,
        c * R * R,
      ),
    x = n ? 3 : 7,
    M = [],
    g = [];
  for (let R = 0; R <= x; R++) {
    let D = R / x;
    (M.push(i(D)),
      g.push(p * (1 - 0.58 * D) * (1 + 1.25 * Math.pow(1 - D, 6))));
  }
  r.tube(
    M,
    g,
    n ? 5 : 8,
    (R) => In().lerp($e(), R),
    (R) => R * R * 0.012,
  );
  let w = i(1),
    y = a * (0.27 + e() * 0.06),
    b = y * (0.78 + e() * 0.18),
    v = w.y - b * 0.05,
    A = new rt(w.x, v, w.z),
    E = [{ c: new rt(w.x, v + b * 0.5, w.z), r: y * 0.6 }],
    H = 6;
  for (let R = 0; R < H; R++) {
    let D = (R / H) * Math.PI * 2 + e() * 0.8,
      z = y * (0.52 + 0.26 * e()),
      T = new rt(
        w.x + Math.cos(D) * z,
        v + (e() - 0.4) * b * 0.85,
        w.z + Math.sin(D) * z,
      ),
      I = y * (0.46 + 0.18 * e());
    E.push({ c: T, r: I });
    let B = i(0.58 + 0.32 * e());
    if (!n) {
      let W = new rt().lerpVectors(B, T, 0.88),
        G = new rt().lerpVectors(B, W, 0.5);
      ((G.y += z * 0.16),
        r.tube(
          [B, G, W],
          [p * 0.4, p * 0.27, p * 0.12],
          5,
          (O) => In().lerp($e(), 0.3 + O * 0.4),
          (O) => 0.004 + O * 0.008,
        ));
    }
  }
  return (
    Ae(
      r,
      e,
      E,
      A,
      b,
      16,
      4,
      n,
      lt(0.2, 0.36, 0.1),
      lt(0.56, 0.76, 0.25),
      1,
      0.03,
    ),
    r.build()
  );
}
function _n(o, n) {
  let e = At(o),
    r = new Ot(),
    a = 8 + e() * 9,
    f = e() * Math.PI * 2,
    t = (0.12 + e() * 0.24) * a,
    l = [],
    c = [],
    p = n ? 4 : 10;
  for (let x = 0; x <= p; x++) {
    let M = x / p;
    (l.push(
      new rt(
        Math.cos(f) * t * M * M,
        -0.4 + (a + 0.4) * M,
        Math.sin(f) * t * M * M,
      ),
    ),
      c.push(
        0.27 *
          (1 - 0.38 * M) *
          (1 + 0.07 * Math.sin(M * 46)) *
          (1 + 0.75 * Math.pow(1 - M, 9)),
      ));
  }
  r.tube(
    l,
    c,
    n ? 5 : 8,
    (x) => lt(0.34, 0.28, 0.2).lerp(lt(0.24, 0.2, 0.14), x * 0.8),
    (x) => x * x * 0.028,
  );
  let h = l[p],
    i = 15;
  for (let x = 0; x < i; x++) {
    let g = (x / i) * Math.PI * 2 * 2.618 + e() * 0.25,
      w = Math.pow(e(), 0.75),
      y = 0.98 - 0.9 * w + (e() - 0.5) * 0.1,
      b = 0.6 + 1.35 * w,
      v = a * (0.36 + e() * 0.12) * (0.78 + 0.3 * w),
      A = lt(0.82, 0.95, 0.6).lerp(lt(1, 1.05, 0.7), e()),
      E = (e() - 0.5) * 0.6;
    r.frond(
      new rt(h.x, h.y - 0.15, h.z),
      g,
      v,
      v * 0.95,
      y,
      b,
      n ? 3 : 7,
      A,
      0.07,
      0.2,
      E,
    );
  }
  if (!n)
    for (let x = 0; x < 4; x++) {
      let M = e() * Math.PI * 2;
      r.frond(
        new rt(h.x, h.y - 0.5, h.z),
        M,
        a * 0.22,
        a * 0.2,
        -0.2,
        0.9,
        4,
        lt(0.55, 0.5, 0.28),
        0.05,
        0.1,
      );
    }
  if (!n)
    for (let x = 0; x < 5; x++) {
      let M = e() * Math.PI * 2;
      r.blob(
        h.x + Math.cos(M) * 0.42,
        h.y - 0.55,
        h.z + Math.sin(M) * 0.42,
        0.2,
        0.24,
        1,
        0.1,
        () => lt(0.38, 0.3, 0.12),
        o + x,
      );
    }
  return r.build();
}
function Kn(o, n) {
  let e = At(o),
    r = new Ot(),
    a = 10 + e() * 9;
  r.tube(
    [new rt(0, -0.5, 0), new rt(0.1, a * 0.5, 0), new rt(0, a, 0)],
    [a * 0.03, a * 0.016, a * 0.004],
    n ? 4 : 6,
    () => lt(0.2, 0.14, 0.1),
    () => 0,
  );
  let f = 9;
  for (let t = 0; t < f; t++) {
    let l = t / (f - 1),
      c = a * (0.2 + l * 0.78),
      p = a * 0.27 * Math.pow(1 - l, 0.9) + a * 0.035,
      h = 7;
    for (let i = 0; i < h; i++) {
      let x = (i / h) * Math.PI * 2 + t * 0.7 + e() * 0.3,
        M = lt(0.2, 0.34, 0.17)
          .lerp(lt(0.34, 0.5, 0.24), e() * 0.6)
          .multiplyScalar(0.7 + 0.5 * l),
        g = new rt(Math.cos(x) * 0.6, 0.55, Math.sin(x) * 0.6).normalize();
      r.plane(
        Math.cos(x) * p * 0.12,
        c,
        Math.sin(x) * p * 0.12,
        p * 0.95,
        -p * 1.25,
        x + Math.PI / 2,
        1 - 0.25 * l,
        M,
        0.004,
        0.02,
        g,
      );
    }
  }
  return r.build();
}
function $n(o, n) {
  let e = At(o),
    r = new Ot(),
    a = 1.1 + e() * 1.5,
    f = a * (0.55 + e() * 0.25),
    t = new rt(0, a * 0.45, 0),
    l = [{ c: new rt(0, a * 0.62, 0), r: a * 0.42 }],
    c = 4;
  for (let p = 0; p < c; p++) {
    let h = (p / c) * Math.PI * 2 + e() * 0.9,
      i = f * (0.45 + 0.3 * e()),
      x = a * (0.3 + 0.12 * e());
    (l.push({ c: new rt(Math.cos(h) * i, x * 0.95, Math.sin(h) * i), r: x }),
      n ||
        r.tube(
          [
            new rt(0, -0.15, 0),
            new rt(Math.cos(h) * i * 0.5, x * 0.6, Math.sin(h) * i * 0.5),
            new rt(Math.cos(h) * i * 0.85, x * 0.9, Math.sin(h) * i * 0.85),
          ],
          [0.045, 0.03, 0.015],
          4,
          () => $e(),
          () => 0.004,
        ));
  }
  return (
    Ae(
      r,
      e,
      l,
      t,
      a * 0.5,
      9,
      3,
      n,
      lt(0.17, 0.32, 0.09),
      lt(0.5, 0.72, 0.24),
      1.05,
      0.03,
    ),
    r.build()
  );
}
function Xn(o, n) {
  let e = At(o),
    r = new Ot(),
    a = 0.9 + e() * 0.7,
    f = 11;
  for (let t = 0; t < f; t++) {
    let l = (t / f) * Math.PI * 2 + (e() - 0.5) * 0.45,
      c = a * (0.85 + e() * 0.45),
      p = 0.82 + e() * 0.38,
      h = 1 + e() * 0.45,
      i = lt(0.8, 1, 0.55).lerp(lt(1, 1.1, 0.7), e()),
      x = (e() - 0.5) * 0.35;
    r.frond(
      new rt(Math.cos(l) * 0.04, 0, Math.sin(l) * 0.04),
      l,
      c,
      c * 0.4,
      p,
      h,
      n ? 2 : 5,
      i,
      0.06,
      0.1,
      x,
    );
  }
  return r.build();
}
function Zn(o) {
  let n = At(o),
    e = new Ot(),
    r = 4.2 + n() * 5.2,
    a = 0.24 + n() * 0.16,
    f = (n() - 0.5) * 0.7;
  e.tube(
    [new rt(-r / 2, 0.16, 0), new rt(0, 0.24, f), new rt(r / 2, 0.08, f * 0.4)],
    [a * 1.25, a, a * 0.68],
    7,
    (t) => lt(0.62, 0.66, 0.52).lerp(lt(0.45, 0.44, 0.36), t),
    () => 0,
  );
  for (let t = 0; t < 2; t++) {
    let l = -0.2 + t * 0.45,
      c = l * r,
      p = f * (1 - Math.abs(l)),
      h = (t ? 1 : -1) * (0.7 + n() * 0.5),
      i = 0.6 + n() * 0.8;
    e.tube(
      [
        new rt(c, 0.22, p),
        new rt(c + Math.cos(h) * i, 0.45 + n() * 0.35, p + Math.sin(h) * i),
      ],
      [a * 0.42, a * 0.16],
      5,
      () => lt(0.52, 0.5, 0.42),
      () => 0,
    );
  }
  return e.build();
}
function Se() {
  let o = (r, a, f, t, l, c = !0) =>
      a.map((p) => ({
        geo: r(p, !1),
        lod: r(p, !0),
        hiDist: l,
        map: f,
        leaf: 1,
        fade: t,
        cast: c,
      })),
    n = (r, a, f, t, l, c) => ({
      geo: r,
      lod: a,
      hiDist: f,
      map: null,
      leaf: 0,
      fade: t,
      shader: "rock",
      kind: l,
      cast: c,
    }),
    e = [211, 264, 317, 358];
  return {
    broadleaf: o(Yn, [101, 138, 175, 212], "leaf", 5800, 240),
    palm: o(_n, e, "frond", 5e3, 230).map((r, a) => ({ ...r, lean: jn(e[a]) })),
    pine: o(Kn, [401, 418], "needle", 5e3, 260),
    shrub: o($n, [601, 614, 627], "leaf", 1100, 100),
    fern: o(Xn, [701, 712, 733], "fern", 380, 85, !1),
    treefern: o(Tn, [1402, 1419, 1438, 1455], "fern", 4800, 220, !0),
    calamites: [1501, 1523, 1547].map((r) => ({
      geo: Ye(r, !1),
      lod: Ye(r, !0),
      hiDist: 105,
      map: null,
      leaf: 0.65,
      fade: 620,
      cast: !0,
    })),
    rock: [1009, 1040, 1071, 1102, 1133, 1164].map((r, a) => {
      let f = a % 3 === 2 ? de.block : de.boulder;
      return n(xe(r, f, 3), xe(r, f, 1), 150, 2600, 0, !0);
    }),
    slab: [2203, 2251, 2299].map((r) =>
      n(xe(r, de.slab, 3), xe(r, de.slab, 1), 140, 2200, 0, !0),
    ),
    pebble: [3301, 3317, 3343, 3371, 3389].map((r) =>
      n(xe(r, de.cobble, 1), void 0, 1e9, 115, 0, !1),
    ),
    driftwood: [4409, 4423, 4451].map((r) => n(Sn(r), void 0, 1e9, 1e3, 1, !0)),
    coconut: [5501, 5527].map((r) => n(Rn(r), void 0, 1e9, 150, 2, !1)),
    log: [0, 1, 2].map((r) => n(Zn(1103 + r * 7), void 0, 1e9, 1200, 1, !0)),
    reed: [801, 822, 847].map((r) => ({
      geo: _e(r, !1),
      lod: _e(r, !0),
      hiDist: 95,
      map: null,
      leaf: 0.6,
      fade: 560,
      cast: !1,
    })),
    sedge: [861, 879, 895].map((r) => ({
      geo: Ke(r, !1),
      lod: Ke(r, !0),
      hiDist: 80,
      map: null,
      leaf: 0.55,
      fade: 420,
      cast: !1,
    })),
    lily: [901, 933, 977].map((r) => ({
      geo: Fn(r),
      hiDist: 1e9,
      map: null,
      leaf: 0,
      fade: 340,
      cast: !1,
    })),
    mangrove: o(Hn, [1201, 1237, 1263], "leaf", 4200, 180),
    snag: [1301, 1318, 1335, 1352].map((r) =>
      n(Dn(r), void 0, 1e9, 2500, 1, !0),
    ),
  };
}
var Ze = 0.006666666666666667,
  Ne = 1 / 41,
  Qe = 1 / 5.3,
  Je = 1 / 1.9,
  tn = 1 / 90,
  mr = `
uniform vec4 uBiome;
uint bHash(uint x){x^=x>>16u;x*=0x7feb352du;x^=x>>15u;x*=0x846ca68bu;x^=x>>16u;return x;}
float bHash2(ivec2 c,uint s){uvec2 u=uvec2(c+ivec2(32768));return float(bHash((u.x*0x8da6b343u)^(u.y*0xd8163841u)^s))*2.3283064e-10;}
float bNoise(vec2 q,uint s){vec2 i=floor(q),f=q-i;ivec2 c=ivec2(i);f=f*f*(3.-2.*f);
 return mix(mix(bHash2(c,s),bHash2(c+ivec2(1,0),s),f.x),mix(bHash2(c+ivec2(0,1),s),bHash2(c+ivec2(1,1),s),f.x),f.y);}
// l = island-local metres + uBiome.xy, h = ground height, cd = distance to the sea, g = |grad h|,
// fr = proximity to fresh water (riverbanks and lake shores are green down to the waterline)
// returns (cover 0..1, vegetated patch 0..1)
vec2 vegCover(vec2 l,float h,float cd,float g,float fr){
 float n1=bNoise(l*${Ze},461845907u),n2=bNoise(l*${Ne},${3432918353}u);
 float vd=${(85).toFixed(1)}+70.*(n1-.5)+26.*(n2-.5);
 float covD=smoothstep(vd-30.,vd+40.,cd);
 float covH=smoothstep(13.,19.,h+6.*(n2-.5));
 float fb=fr*smoothstep(60.,170.,cd);
 float cov=max(max(covD,covH),fb*.95)*smoothstep(mix(2.3,.1,fb),mix(3.6,.32,fb),h)*(1.-smoothstep(.8,1.35,g));
 float clump=bNoise(l*${Qe},${3864292196}u)*.62+bNoise(l*${Je},${2246822507}u)*.38;
 float t=1.-cov*1.25;
 return vec2(cov,smoothstep(t-.07,t+.07,clump));
}
// distance from the water of the spring-tide wrack line (stranded weed and driftwood)
float wrackDist(vec2 l){return 22.+14.*(bNoise(l*${tn},668265263u)-.5);}
`,
  Le = Math.imul;
function Nn(o) {
  return (
    (o ^= o >>> 16),
    (o = Le(o, 2146121005)),
    (o ^= o >>> 15),
    (o = Le(o, 2221713035)),
    (o ^= o >>> 16),
    o >>> 0
  );
}
function We(o, n, e) {
  return (
    Nn((Le(o + 32768, 2376512323) ^ Le(n + 32768, 3625334849) ^ e) >>> 0) *
    23283064e-17
  );
}
function Re(o, n, e) {
  let r = Math.floor(o),
    a = Math.floor(n),
    f = o - r,
    t = n - a;
  ((f = f * f * (3 - 2 * f)), (t = t * t * (3 - 2 * t)));
  let l = We(r, a, e),
    c = We(r + 1, a, e),
    p = We(r, a + 1, e),
    h = We(r + 1, a + 1, e),
    i = l + (c - l) * f,
    x = p + (h - p) * f;
  return i + (x - i) * t;
}
var Me = (o, n, e) => {
    let r = Math.min(Math.max((e - o) / (n - o), 0), 1);
    return r * r * (3 - 2 * r);
  },
  Xe = [0, 0];
function Cn(o, n, e, r, a, f = 0) {
  let t = Re(o * Ze, n * Ze, 461845907),
    l = Re(o * Ne, n * Ne, 3432918353),
    c = 85 + 70 * (t - 0.5) + 26 * (l - 0.5),
    p = Me(c - 30, c + 40, r),
    h = Me(13, 19, e + 6 * (l - 0.5)),
    i = f * Me(60, 170, r),
    x =
      Math.max(p, h, i * 0.95) *
      Me(2.3 + (0.1 - 2.3) * i, 3.6 + (0.32 - 3.6) * i, e) *
      (1 - Me(0.8, 1.35, a)),
    M =
      Re(o * Qe, n * Qe, 3864292196) * 0.62 +
      Re(o * Je, n * Je, 2246822507) * 0.38,
    g = 1 - x * 1.25;
  return ((Xe[0] = x), (Xe[1] = Me(g - 0.07, g + 0.07, M)), Xe);
}
function Pn(o, n) {
  return 22 + 14 * (Re(o * tn, n * tn, 668265263) - 0.5);
}
function Wn(o) {
  let n = o >>> 0;
  return [(n % 1009) * 3.7 - 1866, ((n >>> 10) % 1013) * 3.3 - 1671];
}
function Be(o, n) {
  return o.h[n] < 0 ? o.tau[n] : -o.cdist[n];
}
function en(o, n, e) {
  let r = (n + o.half) / o.cell - 0.5,
    a = (e + o.half) / o.cell - 0.5,
    f = Math.min(Math.max(Math.floor(r), 0), o.N - 2),
    t = Math.min(Math.max(Math.floor(a), 0), o.N - 2),
    l = Math.min(Math.max(r - f, 0), 1),
    c = Math.min(Math.max(a - t, 0), 1),
    p = t * o.N + f,
    h = Be(o, p),
    i = Be(o, p + 1),
    x = Be(o, p + o.N),
    M = Be(o, p + o.N + 1),
    g = (h + (i - h) * l) * (1 - c) + (x + (M - x) * l) * c;
  return Math.max(-g, 0);
}
function ye(o, n, e, r) {
  let a = (e + o.half) / o.cell - 0.5,
    f = (r + o.half) / o.cell - 0.5,
    t = Math.min(Math.max(Math.floor(a), 0), o.N - 2),
    l = Math.min(Math.max(Math.floor(f), 0), o.N - 2),
    c = Math.min(Math.max(a - t, 0), 1),
    p = Math.min(Math.max(f - l, 0), 1),
    h = l * o.N + t;
  return (
    (n[h] + (n[h + 1] - n[h]) * c) * (1 - p) +
    (n[h + o.N] + (n[h + o.N + 1] - n[h + o.N]) * c) * p
  );
}
function nn(o, n, e) {
  return ye(o, o.fresh, n, e);
}
export { Cn, Pn, Se, Wn, en, nn, ye };
