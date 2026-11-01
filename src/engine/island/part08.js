// island.js - part 8/21 (statements 98-110 of the original module).
import * as Lo from "three";
import { Ie } from "./part01.js";
import { Co, Do, hr, ur } from "./part06.js";
import { Ps, Vs, br, cn, dr, dt, ea, fe, ln, pr, sn, un, vr, ye } from "./part07.js";

function Gs(o, e) {
  let t = Ie(o),
    r = new dt(),
    s = 8 + t() * 9,
    c = t() * Math.PI * 2,
    a = (0.12 + t() * 0.24) * s,
    n = [],
    i = [],
    m = e ? 4 : 10;
  for (let u = 0; u <= m; u++) {
    let d = u / m;
    (n.push(
      new fe(
        Math.cos(c) * a * d * d,
        -0.4 + (s + 0.4) * d,
        Math.sin(c) * a * d * d,
      ),
    ),
      i.push(
        0.27 *
          (1 - 0.38 * d) *
          (1 + 0.07 * Math.sin(d * 46)) *
          (1 + 0.75 * Math.pow(1 - d, 9)),
      ));
  }
  r.tube(
    n,
    i,
    e ? 5 : 8,
    (u) => ye(0.34, 0.28, 0.2).lerp(ye(0.24, 0.2, 0.14), u * 0.8),
    (u) => u * u * 0.028,
  );
  let h = n[m],
    l = 15;
  for (let u = 0; u < l; u++) {
    let p = (u / l) * Math.PI * 2 * 2.618 + t() * 0.25,
      x = Math.pow(t(), 0.75),
      f = 0.98 - 0.9 * x + (t() - 0.5) * 0.1,
      v = 0.6 + 1.35 * x,
      b = s * (0.36 + t() * 0.12) * (0.78 + 0.3 * x),
      g = ye(0.82, 0.95, 0.6).lerp(ye(1, 1.05, 0.7), t()),
      M = (t() - 0.5) * 0.6;
    r.frond(
      new fe(h.x, h.y - 0.15, h.z),
      p,
      b,
      b * 0.95,
      f,
      v,
      e ? 3 : 7,
      g,
      0.07,
      0.2,
      M,
    );
  }
  if (!e)
    for (let u = 0; u < 4; u++) {
      let d = t() * Math.PI * 2;
      r.frond(
        new fe(h.x, h.y - 0.5, h.z),
        d,
        s * 0.22,
        s * 0.2,
        -0.2,
        0.9,
        4,
        ye(0.55, 0.5, 0.28),
        0.05,
        0.1,
      );
    }
  if (!e)
    for (let u = 0; u < 5; u++) {
      let d = t() * Math.PI * 2;
      r.blob(
        h.x + Math.cos(d) * 0.42,
        h.y - 0.55,
        h.z + Math.sin(d) * 0.42,
        0.2,
        0.24,
        1,
        0.1,
        () => ye(0.38, 0.3, 0.12),
        o + u,
      );
    }
  return r.build();
}
function Os(o, e) {
  let t = Ie(o),
    r = new dt(),
    s = 10 + t() * 9;
  r.tube(
    [new fe(0, -0.5, 0), new fe(0.1, s * 0.5, 0), new fe(0, s, 0)],
    [s * 0.03, s * 0.016, s * 0.004],
    e ? 4 : 6,
    () => ye(0.2, 0.14, 0.1),
    () => 0,
  );
  let c = 9;
  for (let a = 0; a < c; a++) {
    let n = a / (c - 1),
      i = s * (0.2 + n * 0.78),
      m = s * 0.27 * Math.pow(1 - n, 0.9) + s * 0.035,
      h = 7;
    for (let l = 0; l < h; l++) {
      let u = (l / h) * Math.PI * 2 + a * 0.7 + t() * 0.3,
        d = ye(0.2, 0.34, 0.17)
          .lerp(ye(0.34, 0.5, 0.24), t() * 0.6)
          .multiplyScalar(0.7 + 0.5 * n),
        p = new fe(Math.cos(u) * 0.6, 0.55, Math.sin(u) * 0.6).normalize();
      r.plane(
        Math.cos(u) * m * 0.12,
        i,
        Math.sin(u) * m * 0.12,
        m * 0.95,
        -m * 1.25,
        u + Math.PI / 2,
        1 - 0.25 * n,
        d,
        0.004,
        0.02,
        p,
      );
    }
  }
  return r.build();
}
function _s(o, e) {
  let t = Ie(o),
    r = new dt(),
    s = 1.1 + t() * 1.5,
    c = s * (0.55 + t() * 0.25),
    a = new fe(0, s * 0.45, 0),
    n = [{ c: new fe(0, s * 0.62, 0), r: s * 0.42 }],
    i = 4;
  for (let m = 0; m < i; m++) {
    let h = (m / i) * Math.PI * 2 + t() * 0.9,
      l = c * (0.45 + 0.3 * t()),
      u = s * (0.3 + 0.12 * t());
    (n.push({ c: new fe(Math.cos(h) * l, u * 0.95, Math.sin(h) * l), r: u }),
      e ||
        r.tube(
          [
            new fe(0, -0.15, 0),
            new fe(Math.cos(h) * l * 0.5, u * 0.6, Math.sin(h) * l * 0.5),
            new fe(Math.cos(h) * l * 0.85, u * 0.9, Math.sin(h) * l * 0.85),
          ],
          [0.045, 0.03, 0.015],
          4,
          () => un(),
          () => 0.004,
        ));
  }
  return (
    ea(
      r,
      t,
      n,
      a,
      s * 0.5,
      9,
      3,
      e,
      ye(0.17, 0.32, 0.09),
      ye(0.5, 0.72, 0.24),
      1.05,
      0.03,
    ),
    r.build()
  );
}
function Us(o, e) {
  let t = Ie(o),
    r = new dt(),
    s = 0.9 + t() * 0.7,
    c = 11;
  for (let a = 0; a < c; a++) {
    let n = (a / c) * Math.PI * 2 + (t() - 0.5) * 0.45,
      i = s * (0.85 + t() * 0.45),
      m = 0.82 + t() * 0.38,
      h = 1 + t() * 0.45,
      l = ye(0.8, 1, 0.55).lerp(ye(1, 1.1, 0.7), t()),
      u = (t() - 0.5) * 0.35;
    r.frond(
      new fe(Math.cos(n) * 0.04, 0, Math.sin(n) * 0.04),
      n,
      i,
      i * 0.4,
      m,
      h,
      e ? 2 : 5,
      l,
      0.06,
      0.1,
      u,
    );
  }
  return r.build();
}
function qs(o) {
  let e = Ie(o),
    t = new dt(),
    r = 4.2 + e() * 5.2,
    s = 0.24 + e() * 0.16,
    c = (e() - 0.5) * 0.7;
  t.tube(
    [new fe(-r / 2, 0.16, 0), new fe(0, 0.24, c), new fe(r / 2, 0.08, c * 0.4)],
    [s * 1.25, s, s * 0.68],
    7,
    (a) => ye(0.62, 0.66, 0.52).lerp(ye(0.45, 0.44, 0.36), a),
    () => 0,
  );
  for (let a = 0; a < 2; a++) {
    let n = -0.2 + a * 0.45,
      i = n * r,
      m = c * (1 - Math.abs(n)),
      h = (a ? 1 : -1) * (0.7 + e() * 0.5),
      l = 0.6 + e() * 0.8;
    t.tube(
      [
        new fe(i, 0.22, m),
        new fe(i + Math.cos(h) * l, 0.45 + e() * 0.35, m + Math.sin(h) * l),
      ],
      [s * 0.42, s * 0.16],
      5,
      () => ye(0.52, 0.5, 0.42),
      () => 0,
    );
  }
  return t.build();
}
function ta() {
  let o = (r, s, c, a, n, i = !0) =>
      s.map((m) => ({
        geo: r(m, !1),
        lod: r(m, !0),
        hiDist: n,
        map: c,
        leaf: 1,
        fade: a,
        cast: i,
      })),
    e = (r, s, c, a, n, i) => ({
      geo: r,
      lod: s,
      hiDist: c,
      map: null,
      leaf: 0,
      fade: a,
      shader: "rock",
      kind: n,
      cast: i,
    }),
    t = [211, 264, 317, 358];
  return {
    broadleaf: o(Vs, [101, 138, 175, 212], "leaf", 5800, 240),
    palm: o(Gs, t, "frond", 5e3, 230).map((r, s) => ({ ...r, lean: Ps(t[s]) })),
    pine: o(Os, [401, 418], "needle", 5e3, 260),
    shrub: o(_s, [601, 614, 627], "leaf", 1100, 100),
    fern: o(Us, [701, 712, 733], "fern", 380, 85, !1),
    treefern: o(dr, [1402, 1419, 1438, 1455], "fern", 4800, 220, !0),
    calamites: [1501, 1523, 1547].map((r) => ({
      geo: sn(r, !1),
      lod: sn(r, !0),
      hiDist: 105,
      map: null,
      leaf: 0.65,
      fade: 620,
      cast: !0,
    })),
    rock: [1009, 1040, 1071, 1102, 1133, 1164].map((r, s) => {
      let c = s % 3 === 2 ? Co.block : Co.boulder;
      return e(Do(r, c, 3), Do(r, c, 1), 150, 2600, 0, !0);
    }),
    slab: [2203, 2251, 2299].map((r) =>
      e(Do(r, Co.slab, 3), Do(r, Co.slab, 1), 140, 2200, 0, !0),
    ),
    pebble: [3301, 3317, 3343, 3371, 3389].map((r) =>
      e(Do(r, Co.cobble, 1), void 0, 1e9, 115, 0, !1),
    ),
    driftwood: [4409, 4423, 4451].map((r) => e(ur(r), void 0, 1e9, 1e3, 1, !0)),
    coconut: [5501, 5527].map((r) => e(hr(r), void 0, 1e9, 150, 2, !1)),
    log: [0, 1, 2].map((r) => e(qs(1103 + r * 7), void 0, 1e9, 1200, 1, !0)),
    reed: [801, 822, 847].map((r) => ({
      geo: ln(r, !1),
      lod: ln(r, !0),
      hiDist: 95,
      map: null,
      leaf: 0.6,
      fade: 560,
      cast: !1,
    })),
    sedge: [861, 879, 895].map((r) => ({
      geo: cn(r, !1),
      lod: cn(r, !0),
      hiDist: 80,
      map: null,
      leaf: 0.55,
      fade: 420,
      cast: !1,
    })),
    lily: [901, 933, 977].map((r) => ({
      geo: pr(r),
      hiDist: 1e9,
      map: null,
      leaf: 0,
      fade: 340,
      cast: !1,
    })),
    mangrove: o(vr, [1201, 1237, 1263], "leaf", 4200, 180),
    snag: [1301, 1318, 1335, 1352].map((r) =>
      e(br(r), void 0, 1e9, 2500, 1, !0),
    ),
  };
}
function ka(o, e = 256) {
  let t = document.createElement("canvas");
  t.width = t.height = e;
  let r = t.getContext("2d");
  o(r, e);
  let s = new Lo.CanvasTexture(t);
  return (
    (s.anisotropy = 8),
    (s.colorSpace = Lo.SRGBColorSpace),
    (s.generateMipmaps = !0),
    (s.minFilter = Lo.LinearMipmapLinearFilter),
    s
  );
}
function hn() {
  return ka((o, e) => {
    let t = Ie(99);
    o.clearRect(0, 0, e, e);
    let r = e / 2,
      s = e / 2,
      c = (n, i, m) =>
        `rgb(${Math.min(255, n) | 0},${Math.min(255, i) | 0},${Math.min(255, m) | 0})`;
    o.lineCap = "round";
    for (let n = 0; n < 11; n++) {
      let i = t() * Math.PI * 2,
        m = e * (0.2 + t() * 0.17),
        h = (t() - 0.5) * 0.6;
      ((o.strokeStyle = "rgba(74,56,34,0.9)"),
        (o.lineWidth = e * (0.006 + t() * 0.004)),
        o.beginPath(),
        o.moveTo(r, s),
        o.quadraticCurveTo(
          r + Math.cos(i + h) * m * 0.55,
          s + Math.sin(i + h) * m * 0.55,
          r + Math.cos(i) * m,
          s + Math.sin(i) * m,
        ),
        o.stroke());
    }
    let a = 240;
    for (let n = 0; n < a; n++) {
      let i = n / a,
        m = t() * Math.PI * 2,
        h = 0.8 + 0.2 * Math.sin(m * 3 + 1.3) * Math.cos(m * 2 - 0.4),
        l = e * (0.042 + t() * 0.038),
        u = l * (0.36 + t() * 0.14),
        d = Math.min(
          Math.pow(t(), 0.6) * e * 0.44 * h * (0.5 + 0.5 * i),
          e * 0.47 - l,
        ),
        p = r + Math.cos(m) * d,
        x = s + Math.sin(m) * d,
        f = 0.58 + 0.42 * i + (t() - 0.5) * 0.18,
        v = (128 + t() * 62) * f,
        b = v * (0.46 + t() * 0.16),
        g = v * (0.17 + t() * 0.12);
      (o.save(), o.translate(p, x), o.rotate(m + (t() - 0.5) * 1.5));
      let M = o.createLinearGradient(0, -u, 0, u);
      (M.addColorStop(0, c(b * 1.32, v * 1.26, g * 1.15)),
        M.addColorStop(1, c(b * 0.62, v * 0.72, g * 0.66)),
        (o.fillStyle = M),
        o.beginPath(),
        o.moveTo(0, 0),
        o.bezierCurveTo(l * 0.28, -u * 1.12, l * 0.74, -u * 0.92, l, 0),
        o.bezierCurveTo(l * 0.74, u * 0.92, l * 0.28, u * 1.12, 0, 0),
        o.fill(),
        (o.strokeStyle = "rgba(196,226,140,0.32)"),
        (o.lineWidth = Math.max(1, e * 0.0022)),
        o.beginPath(),
        o.moveTo(l * 0.06, 0),
        o.lineTo(l * 0.9, 0),
        o.stroke(),
        o.restore());
    }
  }, 512);
}
function gr(o, e, t, r, s, c, a, n, i) {
  let m = e + Math.cos(c) * r,
    h = t + Math.sin(c) * r,
    l = e + Math.cos(c + a) * r * 0.55,
    u = t + Math.sin(c + a) * r * 0.55,
    d = -Math.sin(c) * s,
    p = Math.cos(c) * s,
    x = o.createLinearGradient(e, t, m, h);
  (x.addColorStop(0, n),
    x.addColorStop(1, i),
    (o.fillStyle = x),
    o.beginPath(),
    o.moveTo(e + d * 0.5, t + p * 0.5),
    o.quadraticCurveTo(l + d, u + p, m, h),
    o.quadraticCurveTo(l - d, u - p, e - d * 0.5, t - p * 0.5),
    o.fill());
}
function mn() {
  return ka((o, e) => {
    let t = Ie(7);
    o.clearRect(0, 0, e, e);
    let r = 46;
    for (let s = 0; s < r; s++) {
      let c = s / (r - 1),
        a = e * (0.985 - c * 0.95),
        n = Math.pow(
          Math.sin(Math.PI * Math.min(1, 0.1 + 0.9 * Math.pow(c, 0.85))),
          0.9,
        ),
        i = e * 0.485 * Math.max(0.1, n) * (0.9 + t() * 0.2),
        m = 0.62 + 0.45 * c + (t() - 0.5) * 0.1;
      for (let h of [-1, 1]) {
        let l = 0.8 + t() * 0.35,
          u = h < 0 ? Math.PI + m : -m,
          d = `rgb(${(46 * l) | 0},${(104 * l) | 0},${(30 * l) | 0})`,
          p = `rgb(${(112 * l) | 0},${(172 * l) | 0},${(54 * l) | 0})`;
        gr(o, e * 0.5, a, i, e * 0.0058, u, h * 0.12, d, p);
      }
    }
    ((o.strokeStyle = "#35561f"),
      (o.lineWidth = e * 0.011),
      (o.lineCap = "round"),
      o.beginPath(),
      o.moveTo(e * 0.5, e),
      o.quadraticCurveTo(e * 0.5, e * 0.45, e * 0.5, e * 0.02),
      o.stroke(),
      (o.strokeStyle = "rgba(160,190,90,0.6)"),
      (o.lineWidth = e * 0.0035),
      o.beginPath(),
      o.moveTo(e * 0.5 - 1, e),
      o.quadraticCurveTo(e * 0.5, e * 0.45, e * 0.5, e * 0.02),
      o.stroke());
  }, 512);
}
function fn() {
  return ka((o, e) => {
    let t = Ie(31);
    o.clearRect(0, 0, e, e);
    let r = 52;
    for (let s = 0; s < r; s++) {
      let c = s / (r - 1),
        a = e * (0.99 - c * 0.96),
        n = Math.pow(
          Math.sin(Math.PI * Math.min(1, 0.06 + 0.94 * Math.pow(c, 0.8))),
          0.72,
        ),
        i = e * 0.48 * Math.max(0.06, n),
        m = 0.78 + 0.42 * c;
      for (let h of [-1, 1]) {
        let l = 0.82 + t() * 0.32,
          u = h < 0 ? Math.PI + m : -m,
          d = e * 0.5,
          p = 8,
          x = Math.cos(u),
          f = Math.sin(u);
        for (let v = 0; v < p; v++) {
          let b = (v + 0.45) / p,
            g = d + x * i * b,
            M = a + f * i * b,
            w = i * 0.18 * (1 - b * 0.72);
          for (let E of [-1, 1]) {
            let k = u + E * 0.98;
            gr(
              o,
              g,
              M,
              w,
              e * 0.0056,
              k,
              0.12 * E,
              `rgb(${(44 * l) | 0},${(116 * l) | 0},${(28 * l) | 0})`,
              `rgb(${(132 * l) | 0},${(202 * l) | 0},${(62 * l) | 0})`,
            );
          }
        }
        ((o.strokeStyle = "rgba(42,92,28,0.92)"),
          (o.lineWidth = e * 0.0042),
          o.beginPath(),
          o.moveTo(d, a),
          o.lineTo(d + x * i, a + f * i),
          o.stroke());
      }
    }
    ((o.strokeStyle = "#386824"),
      (o.lineWidth = e * 0.012),
      (o.lineCap = "round"),
      o.beginPath(),
      o.moveTo(e * 0.5, e),
      o.lineTo(e * 0.5, e * 0.02),
      o.stroke());
  }, 512);
}
function dn() {
  return ka((o, e) => {
    let t = Ie(21);
    o.clearRect(0, 0, e, e);
    let r = o.createRadialGradient(e / 2, e / 2, 0, e / 2, e / 2, e * 0.45);
    (r.addColorStop(0, "rgba(20,44,22,0.95)"),
      r.addColorStop(1, "rgba(20,44,22,0)"),
      (o.fillStyle = r),
      o.fillRect(0, 0, e, e));
    for (let s = 0; s < 520; s++) {
      let c = t() * e,
        a = t() * e,
        n = Math.hypot(c - e / 2, a - e / 2) / (e * 0.5);
      if (n > 0.97 || t() < n * n * 0.8) continue;
      let i = 70 + t() * 80;
      ((o.strokeStyle = `rgb(${(i * 0.45) | 0},${i | 0},${(i * 0.45) | 0})`),
        (o.lineWidth = 1.4 + t() * 1.4));
      let m = Math.atan2(a - e / 2, c - e / 2) + (t() - 0.5) * 1.2,
        h = e * (0.035 + t() * 0.06);
      (o.beginPath(),
        o.moveTo(c, a),
        o.lineTo(c + Math.cos(m) * h, a + Math.sin(m) * h),
        o.stroke());
    }
  }, 256);
}
export { dn, fn, hn, mn, ta };
