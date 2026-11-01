// terrain.worker.js - part 5/9 (statements 34-43 of the original module).
import { At, He, Nt, Qt, at, bt, et, fn, jt, me, mn, pn, un } from "./part01.js";
import { On, Ve } from "./part04.js";
import { sculptRiverWaterlines } from "../hydrology.js";

function* kn(o) {
  let n = o.seed >>> 0,
    e = o.N,
    r = o.cell,
    a = e * e,
    f = e * r,
    t = f / 2,
    l = f / 7168,
    c = At(n * 2654435761 + 12345),
    p = new jt(n),
    h = new jt(n ^ 2654435769),
    i = new Float32Array(a),
    x = new Float32Array(a),
    M = (c() * 4) | 0,
    g = t * (0.45 + c() * 0.08) * (o.isHome ? 1.06 : 0.98),
    w = c() * Math.PI * 2,
    y = [],
    b = [],
    v = [],
    A = [],
    E = (j, u, d, s, m, k) => {
      y.push({
        x: j,
        z: u,
        rx: d,
        rz: s,
        ca: Math.cos(m),
        sa: Math.sin(m),
        ridgeBoost: k,
      });
    },
    H = (800 + c() * 360) * at(l * 1.1, 0.72, 1);
  if (M === 0) {
    let j = (1.25 + c() * 0.4) * Math.PI,
      u = g * (0.48 + c() * 0.12),
      d = 7;
    for (let s = 0; s < d; s++) {
      let m = s / (d - 1) - 0.5,
        k = w + m * j + (c() - 0.5) * 0.18,
        F = u * (0.85 + c() * 0.25),
        C = 1 - Math.abs(m) * 0.6,
        P = g * (0.44 + 0.24 * C + c() * 0.14),
        _ = P * (0.55 + c() * 0.35),
        ot = Math.cos(k) * F,
        U = Math.sin(k) * F,
        $ = s === 0 || s === d - 1 ? 0.25 : 0.65 + 0.35 * C;
      (E(ot, U, P, _, k + Math.PI * 0.5 + (c() - 0.5) * 0.4, $),
        s > 0 &&
          s < d - 1 &&
          v.push({
            x: ot + (c() - 0.5) * P * 0.35,
            z: U + (c() - 0.5) * _ * 0.35,
            r: g * (0.28 + c() * 0.16),
            height: H * (0.68 + c() * 0.42),
          }));
    }
    b.push({
      x: Math.cos(w + Math.PI) * u * 0.28,
      z: Math.sin(w + Math.PI) * u * 0.28,
      r: g * (0.48 + c() * 0.12),
      strength: 0.46,
    });
  } else if (M === 1) {
    let j = g * (0.54 + c() * 0.12),
      u = Math.cos(w),
      d = Math.sin(w);
    (E(u * j, d * j, g * 0.72, g * 0.5, w + 0.28, 0.95),
      E(-u * j * 0.92, -d * j * 0.92, g * 0.64, g * 0.46, w - 0.35, 0.82),
      E(
        (c() - 0.5) * 70 * l,
        (c() - 0.5) * 70 * l,
        g * 0.68,
        g * 0.36,
        w,
        0.12,
      ),
      v.push(
        {
          x: u * j * 1.05,
          z: d * j * 1.05,
          r: g * 0.42,
          height: H * (0.95 + c() * 0.2),
        },
        {
          x: u * j * 0.65 - d * g * 0.22,
          z: d * j * 0.65 + u * g * 0.22,
          r: g * 0.3,
          height: H * 0.72,
        },
        {
          x: -u * j * 0.95,
          z: -d * j * 0.95,
          r: g * 0.38,
          height: H * (0.78 + c() * 0.2),
        },
      ));
    for (let s = 0; s < 4; s++) {
      let m = w + (c() - 0.5) * 2.8,
        k = g * (0.52 + c() * 0.45);
      E(
        Math.cos(m) * k,
        Math.sin(m) * k,
        g * (0.38 + c() * 0.2),
        g * (0.24 + c() * 0.14),
        m,
        0.22 + c() * 0.35,
      );
    }
    (b.push({ x: -d * g * 0.5, z: u * g * 0.5, r: g * 0.4, strength: 0.38 }),
      b.push({ x: d * g * 0.5, z: -u * g * 0.5, r: g * 0.38, strength: 0.35 }));
  } else if (M === 2) {
    (E(0, 0, g * 0.68, g * 0.52, w, 0.88),
      v.push({
        x: (c() - 0.5) * g * 0.25,
        z: (c() - 0.5) * g * 0.25,
        r: g * 0.4,
        height: H,
      }));
    let j = 5;
    for (let u = 0; u < j; u++) {
      let d = w + (u / j) * Math.PI * 2 + (c() - 0.5) * 0.38,
        s = g * (0.62 + c() * 0.38),
        m = g * (0.58 + c() * 0.2),
        k = g * (0.26 + c() * 0.12),
        F = Math.cos(d) * s * 0.56,
        C = Math.sin(d) * s * 0.56,
        P = u % 2 === 0 ? 0.72 : 0.18;
      (E(F, C, m, k, d + (c() - 0.5) * 0.25, P),
        u % 2 === 0 &&
          v.push({
            x: F * 0.85,
            z: C * 0.85,
            r: g * 0.32,
            height: H * (0.65 + c() * 0.3),
          }));
      let _ = d + Math.PI / j;
      b.push({
        x: Math.cos(_) * g * 0.62,
        z: Math.sin(_) * g * 0.62,
        r: g * (0.34 + c() * 0.12),
        strength: 0.36,
      });
    }
  } else {
    let j = Math.cos(w),
      u = Math.sin(w);
    (E(
      -j * g * 0.26,
      -u * g * 0.26,
      g * 0.86,
      g * 0.54,
      w + Math.PI * 0.5,
      0.95,
    ),
      E(j * g * 0.38, u * g * 0.38, g * 0.82, g * 0.62, w + 0.15, 0.16));
    for (let d = -1; d <= 1; d++) {
      let s = -j * g * 0.28 - u * d * g * 0.36,
        m = -u * g * 0.28 + j * d * g * 0.36;
      v.push({
        x: s,
        z: m,
        r: g * (0.34 + c() * 0.12),
        height: H * (0.78 + c() * 0.28),
      });
    }
    for (let d = 0; d < 4; d++) {
      let s = w + (c() - 0.5) * Math.PI * 1.7,
        m = g * (0.48 + c() * 0.45);
      E(
        Math.cos(s) * m,
        Math.sin(s) * m,
        g * (0.42 + c() * 0.2),
        g * (0.28 + c() * 0.15),
        s + c() * 0.5,
        0.22 + c() * 0.4,
      );
    }
    b.push({
      x: Math.cos(w + 1.8) * g * 0.62,
      z: Math.sin(w + 1.8) * g * 0.62,
      r: g * 0.38,
      strength: 0.36,
    });
  }
  for (let j of v) j.r *= 1.55;
  let R = 3 + ((c() * 4) | 0);
  for (let j = 0; j < R; j++) {
    let u = w + c() * Math.PI * 2,
      d = g * (0.95 + c() * 0.35);
    A.push({
      x: Math.cos(u) * d,
      z: Math.sin(u) * d,
      r: (76 + c() * 96) * at(l * 1.15, 0.8, 1.35),
      height: 6 + c() * 18,
    });
  }
  let D = [],
    z = [],
    T = 2 + ((c() * 2) | 0);
  for (let j = 0; j < T; j++) {
    let u = w + j * (1.7 + c() * 1.1) + (c() - 0.5) * 0.6,
      d = 2 + ((c() * 3) | 0),
      s = g * (0.92 + c() * 0.22);
    for (let m = 0; m < d; m++) {
      let k = u + (m - 0.5) * (0.14 + c() * 0.16),
        F = (120 + c() * 270) * l * (1 - m * 0.16),
        C = F * (0.34 + c() * 0.36),
        P = Math.min(s, t * 0.82 - Math.max(F, C)),
        _ = k + (c() - 0.5) * 1.1;
      (D.push({
        x: Math.cos(k) * P,
        z: Math.sin(k) * P,
        rx: F,
        rz: C,
        ca: Math.cos(_),
        sa: Math.sin(_),
        ridgeBoost: 0.25 + c() * 0.35,
      }),
        z.push(
          at((F + C) * 0.5 * (0.16 + c() * 0.26), 12, 150) * (1 - m * 0.12),
        ),
        (s += (F + C) * (0.85 + c() * 0.45)));
    }
  }
  let I = c() * 500,
    B = c() * 500,
    W = c() * 500,
    G = c() * 500,
    O = c() * 500,
    S = c() * 500;
  c();
  let L = 480 * l,
    Z = w + (M === 3 ? 0 : (c() - 0.5) * 1.2),
    q = Math.cos(Z),
    K = Math.sin(Z);
  for (let j = 0; j < e; j++) {
    let u = (j + 0.5) * r - t;
    for (let d = 0; d < e; d++) {
      let s = (d + 0.5) * r - t,
        m = j * e + d,
        k = s + p.fbm(s / (1250 * l) + I, u / (1250 * l), 3) * L,
        F = u + p.fbm(s / (1250 * l), u / (1250 * l) + B, 3) * L,
        P =
          (p.ridgedSoft(s / (700 * l) + W, u / (700 * l) + G, 4, 0.055) -
            0.44) *
            0.62 +
          (h.ridgedSoft(s / (250 * l) + S, u / (250 * l) + O, 3, 0.08) - 0.42) *
            0.34 +
          p.fbm(s / (95 * l) + B, u / (95 * l), 3) * 0.11,
        _ = -4,
        ot = 0,
        U = 0;
      for (let Mt = 0; Mt < y.length; Mt++) {
        let ht = y[Mt],
          Q = k - ht.x,
          gt = F - ht.z,
          Et = Q * ht.ca + gt * ht.sa,
          vt = -Q * ht.sa + gt * ht.ca,
          Dt = Math.hypot(Et / ht.rx, vt / ht.rz),
          It = 1 - Dt,
          Bt = 0.36,
          Lt = at(0.5 + (0.5 * (It - _)) / Bt, 0, 1);
        _ = bt(_, It, Lt) + Bt * Lt * (1 - Lt);
        let Pt = Math.max(0, 1 - Dt * 0.9);
        ((ot += Pt * Pt * ht.ridgeBoost), (U += Pt * Pt));
      }
      let $ = U > 1e-4 ? ot / U : 0.35;
      for (let Mt = 0; Mt < b.length; Mt++) {
        let ht = b[Mt],
          Q = Math.hypot(k - ht.x, F - ht.z) / ht.r;
        if (Q < 1) {
          let gt = (1 - Q * Q) * ht.strength;
          _ -= gt * et(0.68, 0.04, _);
        }
      }
      _ += P;
      let N = -4,
        ut = 22;
      for (let Mt = 0; Mt < D.length; Mt++) {
        let ht = D[Mt],
          Q = k - ht.x,
          gt = F - ht.z,
          Et = Q * ht.ca + gt * ht.sa,
          vt = -Q * ht.sa + gt * ht.ca,
          Dt = 1 - Math.hypot(Et / ht.rx, vt / ht.rz) + P * 0.65,
          It = at(Math.min(ht.rx, ht.rz) / (g * 0.38), 0.22, 1),
          Bt = Dt >= 0 ? Dt : Dt * It;
        Bt > N && ((N = Bt), (ut = z[Mt]));
      }
      let xt = Math.max(_, N),
        mt = (s * q + u * K) / g,
        wt =
          1 -
          et(0.05, 0.38, Math.abs(p.n2(k / (820 * l) + O, F / (820 * l) + S))),
        St =
          1 -
          et(0.04, 0.34, Math.abs(h.n2(k / (640 * l) - G, F / (640 * l) + W))),
        Vt = et(0.18, 0.62, p.fbm(k / (1100 * l) + B, F / (1100 * l) - I, 3)),
        Ht = at(
          et(
            -0.22,
            0.66,
            mt * 0.58 + p.fbm(s / 1450 + 40, u / 1450, 3) * 0.78 + 0.24,
          ) *
            0.64 +
            Math.max(wt, St * 0.9) * 0.52 +
            Vt * 0.28 +
            (1 - $) * 0.46,
          0,
          1,
        );
      x[m] = Ht;
      let kt,
        yt = k + h.fbm(s / (420 * l) + G, u / (420 * l) - B, 3) * 195 * l,
        X = F + h.fbm(s / (420 * l) - S, u / (420 * l) + I, 3) * 195 * l,
        Rt = yt + p.fbm(yt / (180 * l) + W, X / (180 * l) + O, 2) * 58 * l,
        Tt = X + p.fbm(yt / (180 * l) - O, X / (180 * l) + W, 2) * 58 * l;
      if (xt > 0) {
        let Mt = _ > 0 ? _ : N,
          ht = _ > 0 ? 0.78 : 1.55,
          Q = 1 - Ht * 0.62,
          gt = (11.5 + 6.5 * Q) * Math.pow(et(0, ht, Mt), 1.65),
          Et =
            (p.fbm(s / 580 + 70, u / 580, 3) * 3.8 +
              h.fbm(s / 240 + 13, u / 240, 2) * 2.2 +
              3.8) *
            et(0.08, 0.48, Mt) *
            (0.42 + 0.58 * Q),
          vt =
            1 - et(-0.12, 0.3, h.fbm(s / (760 * l) + W, u / (760 * l) - G, 3)),
          It =
            et(0.4, 0.78, p.fbm(s / (900 * l) + S, u / (900 * l) - O, 3)) *
            (0.3 + 0.7 * $) *
            (1 - vt * 0.95),
          Bt = 32 * It * et(0, 0.05, Mt);
        if (_ > 0) {
          let Lt = et(0.12, 0.6, _),
            Pt = et(0.03, 0.62, _),
            _t = 0;
          for (let qe = 0; qe < v.length; qe++) {
            let ge = v[qe],
              an = k - ge.x,
              cn = F - ge.z,
              ln =
                Math.exp(-((an * an + cn * cn) / (ge.r * ge.r)) * 2.2) *
                ge.height;
            _t += ln * ln;
          }
          let $t = H * (0.28 + 0.44 * $) * Math.pow(Pt, 1.12),
            te = Math.sqrt(_t + $t * $t) * Lt,
            se = p.eroded(yt / (1180 * l) + I, X / (1180 * l) + B, 8, 2.15),
            ae = h.ridged(
              yt / (1550 * l) + O,
              X / (1550 * l) + S,
              6,
              2.08,
              0.52,
            ),
            ee = p.ridgedSoft(Rt / (540 * l) + W, Tt / (540 * l) + G, 5, 0.003),
            he = h.ridged(Rt / (240 * l) - B, Tt / (240 * l) + I, 4, 2.1, 0.48),
            fe =
              at(0.5 + 0.5 * se, 0, 1) * 0.44 +
              ae * 0.34 +
              ee * 0.14 +
              he * 0.08;
          fe = at(fe, 0, 1);
          let ne = 1 - Math.max(wt, St) * 0.68,
            ce = Math.pow(fe * (0.72 + 0.28 * ne), 2.15) * 1.82,
            ie = te * ce * (1 - Ht * 0.68),
            Ee =
              Lt *
              (7 +
                22 *
                  (0.5 +
                    0.5 *
                      p.eroded(
                        yt / (520 * l) + W,
                        X / (520 * l) + G,
                        5,
                        1.4,
                      ))) *
              (0.35 + 0.65 * $) *
              ne,
            rn = bt(gt, Bt, It * (1 - Ht * 0.68)),
            sn = rn + Et + Ee + ie,
            Ln =
              rn * 0.55 +
              Et * 0.48 +
              Lt *
                (2.2 +
                  9.5 * (1 - Ht) * (0.5 + 0.5 * p.fbm(s / 460, u / 460, 2))),
            qn = at(Ht * (1 - et(48, 165, ie)) * 0.92, 0, 0.9);
          kt = bt(sn, me(sn, Ln, 18), qn);
        } else {
          let Lt = et(0.35, 1.15, N),
            Pt = p.eroded(yt / (420 * l) + W, X / (420 * l) + G, 6, 1.6),
            _t = h.ridgedSoft(yt / (520 * l) + O, X / (520 * l) + S, 4, 0.01),
            $t = at((0.5 + 0.5 * Pt) * 0.6 + _t * 0.4, 0, 1);
          kt =
            bt(gt, Bt * 0.8, It) +
            Et * 0.6 +
            ut * Math.pow(Lt, 1.25) * (0.25 + 1.1 * Math.pow($t, 1.5));
        }
      } else {
        let Mt = -xt,
          ht =
            2.6 * et(0, 0.075, Mt) +
            16 * et(0.055, 0.3, Mt) +
            28 * et(0.22, 0.75, Mt),
          Q = et(0.06, 0.19, Mt) * (1 - et(0.21, 0.38, Mt)),
          gt = 0.55 + 0.45 * h.fbm(s / (95 * l) + W, u / (95 * l) - I, 3);
        ht = bt(
          ht,
          (2.3 + 1.5 * gt) * (0.78 + 0.22 * p.fbm(s / 420, u / 420, 2)),
          Q * 0.8,
        );
        let Et = et(0.01, 0.065, Mt) * (1 - et(0.09, 0.19, Mt));
        ((ht = bt(ht, 1.1 + 0.9 * p.fbm(s / 190 + 12, u / 190, 2), Et * 0.45)),
          (kt = -Math.max(ht, 0.35)),
          (kt += p.fbm(s / 260, u / 260, 3) * 2.2 * et(0, 0.32, Mt)));
      }
      for (let Mt = 0; Mt < A.length; Mt++) {
        let ht = A[Mt],
          Q = yt - ht.x,
          gt = X - ht.z,
          Et = (Q * Q + gt * gt) / (ht.r * ht.r);
        if (Et < 1.6) {
          let vt = Math.sqrt(Et) + p.fbm(s / 25, u / 25, 2) * 0.18,
            Dt = et(1.45, 0.62, vt),
            It = ht.height * (0.82 + 0.25 * p.fbm(s / 40 + 3, u / 40, 2));
          kt = Math.max(kt, bt(kt, It, Dt));
        }
      }
      let Ft = et(0.86, 0.995, Math.max(Math.abs(s), Math.abs(u)) / t);
      i[m] = bt(kt, -40, Ft);
    }
    (j & 31) === 0 && (yield { label: "Raising the archipelago", p: j / e });
  }
  o.onStage?.("raised", i);
  let V = yield* fn(i, x, e, r, n);
  (o.onStage?.("evolved", i),
    yield* un(i, e, c, o.erosionDroplets),
    o.onStage?.("droplets", i));
  {
    let j = new Float32Array(a);
    for (let u = 0; u < 4; u++) {
      for (let d = 1; d < e - 1; d++)
        for (let s = 1; s < e - 1; s++) {
          let m = d * e + s,
            k = i[m];
          if (k < -1.5) {
            j[m] = k;
            continue;
          }
          let F =
              Math.hypot(i[m + 1] - i[m - 1], i[m + e] - i[m - e]) / (2 * r),
            C = (1 - et(0.1, 0.32, F)) * (1 - et(60, 160, k));
          C = bt(C, 1, x[m] * 0.55 * (1 - et(25, 80, k)));
          let P =
            (4 * k +
              2 * (i[m - 1] + i[m + 1] + i[m - e] + i[m + e]) +
              i[m - e - 1] +
              i[m - e + 1] +
              i[m + e - 1] +
              i[m + e + 1]) /
            16;
          j[m] = bt(k, P, 0.6 * C);
        }
      for (let d = 1; d < e - 1; d++)
        for (let s = 1; s < e - 1; s++) {
          let m = d * e + s;
          i[m] > -1.5 && (i[m] = j[m]);
        }
      (u & 1) === 0 &&
        (yield { label: "Smoothing meadows and slopes", p: u / 4 });
    }
  }
  (He(i, e, r, V, { passes: 10, conserve: !0 }), o.onStage?.("smoothed", i));
  {
    let j = new Uint8Array(a),
      u = new Int32Array(a),
      d = 0,
      s = 0;
    for (let k = 0; k < e; k++)
      for (let F of [k, (e - 1) * e + k, k * e, k * e + e - 1])
        i[F] <= 0 && ((j[F] = 1), (u[s++] = F));
    for (; d < s;) {
      let k = u[d++],
        F = k % e,
        C = (k / e) | 0;
      for (let P = 0; P < 8; P++) {
        let _ = F + Nt[P],
          ot = C + Qt[P];
        if (_ < 0 || ot < 0 || _ >= e || ot >= e) continue;
        let U = ot * e + _;
        !j[U] && i[U] <= 0.05 && ((j[U] = 1), (u[s++] = U));
      }
    }
    for (let k = 0; k < a; k++)
      !j[k] && i[k] < 0.45 && (i[k] = 0.45 + x[k] * 0.85);
    let m = new Float32Array(a);
    for (let k = 0; k < 3; k++) {
      for (let F = 1; F < e - 1; F++)
        for (let C = 1; C < e - 1; C++) {
          let P = F * e + C,
            _ = i[P];
          if (_ <= 0 || _ > 45) {
            m[P] = _;
            continue;
          }
          let ot =
            (4 * _ +
              2 * (i[P - 1] + i[P + 1] + i[P - e] + i[P + e]) +
              i[P - e - 1] +
              i[P - e + 1] +
              i[P + e - 1] +
              i[P + e + 1]) /
            16;
          m[P] = Math.max(0.35, bt(_, ot, 0.68));
        }
      for (let F = 1; F < e - 1; F++)
        for (let C = 1; C < e - 1; C++) {
          let P = F * e + C;
          i[P] > 0 && i[P] <= 45 && (i[P] = m[P]);
        }
    }
  }
  let Y = new Uint8Array(a);
  for (let j = 0; j < a; j++) Y[j] = i[j] <= 0 ? 1 : 0;
  let J = new Float32Array(a).fill(1e9);
  {
    for (let d = 0; d < a; d++) J[d] = Y[d] === 1 ? 0 : 1e9;
    let j = r,
      u = r * Math.SQRT2;
    for (let d = 0; d < e; d++)
      for (let s = 0; s < e; s++) {
        let m = d * e + s,
          k = J[m];
        (s > 0 && (k = Math.min(k, J[m - 1] + j)),
          d > 0 && (k = Math.min(k, J[m - e] + j)),
          s > 0 && d > 0 && (k = Math.min(k, J[m - e - 1] + u)),
          s < e - 1 && d > 0 && (k = Math.min(k, J[m - e + 1] + u)),
          (J[m] = k));
      }
    for (let d = e - 1; d >= 0; d--)
      for (let s = e - 1; s >= 0; s--) {
        let m = d * e + s,
          k = J[m];
        (s < e - 1 && (k = Math.min(k, J[m + 1] + j)),
          d < e - 1 && (k = Math.min(k, J[m + e] + j)),
          s < e - 1 && d < e - 1 && (k = Math.min(k, J[m + e + 1] + u)),
          s > 0 && d < e - 1 && (k = Math.min(k, J[m + e - 1] + u)),
          (J[m] = k));
      }
    (mn(i, Y, J, e, r, t, p), yield { label: "Measuring the coastline", p: 1 });
  }
  o.onStage?.("pre-hydrology", i);
  let tt = yield* Ve(i, Y, J, x, e, r, t, n, !!o.isHome);
  (He(i, e, r, V, { passes: 10, conserve: !1, protect: tt.wet }),
    o.onStage?.("hydrology", i));
  // smooth, sub-cell waterlines along every channel and lake (after all bank passes)
  sculptRiverWaterlines({ N: e, cell: r, half: t, h: i, rivers: tt.rivers, body: tt.body, lakeId: tt.lakeId, wet: tt.wet, lakeSD: tt.lakeSD });
  for (let j = 0; j < a; j++) Y[j] = i[j] <= 0 ? 1 : 0;
  let { tau: ct, dirX: st, dirZ: nt } = yield* pn(i, e, r),
    pt = new Float32Array(a);
  for (let j = 0; j < e; j++)
    for (let u = 0; u < e; u++) {
      let d = j * e + u;
      if (i[d] < 0) {
        pt[d] = 1;
        continue;
      }
      let s = 0;
      for (let m = 0; m < 8; m++) {
        let k = 0;
        for (let F of [2, 5, 11]) {
          let C = u + Nt[m] * F,
            P = j + Qt[m] * F;
          if (C < 0 || P < 0 || C >= e || P >= e) continue;
          let _ = i[P * e + C] - i[d];
          k = Math.max(k, _ / (F * r * (m & 1 ? Math.SQRT2 : 1)));
        }
        s += Math.max(0, k);
      }
      pt[d] = at(1 - s * 0.16, 0.53, 1);
    }
  let ft = 0,
    dt = 0;
  for (let j = 0; j < a; j++) (i[j] > ft && (ft = i[j]), i[j] > 0 && dt++);
  return (
    yield { label: "Charting the island", p: 1 },
    {
      seed: n,
      N: e,
      cell: r,
      size: f,
      half: t,
      h: i,
      type: Y,
      cdist: J,
      plain: x,
      tau: ct,
      dirX: st,
      dirZ: nt,
      inl: tt.inl,
      fresh: tt.fresh,
      swamp: tt.swamp,
      flowX: tt.flowX,
      flowZ: tt.flowZ,
      wet: tt.wet,
      level: tt.level,
      nearLevel: tt.nearLevel,
      lakeId: tt.lakeId,
      accumulation: tt.accumulation,
      downstream: tt.downstream,
      ao: pt,
      sed: tt.sed,
      body: tt.body,
      bankDist: tt.bankDist,
      navMask: tt.navMask,
      netStats: tt.netStats,
      rivers: tt.rivers,
      lakes: tt.lakes,
      marshes: tt.marshes,
      maxHeight: ft,
      landArea: dt * r * r,
      name: On(c, ["Isle", "Island", "Reach", "Cay", "Atoll"][(c() * 5) | 0]),
    }
  );
}
function Vn(o, n) {
  let e = o.N,
    r = o.h;
  return (
    Math.max(o.fresh[n], o.fresh[n + 1], o.fresh[n + e], o.fresh[n + e + 1]) >
      0.5 &&
    Math.min(r[n], r[n + 1], r[n + e], r[n + e + 1]) < 3 &&
    Math.max(r[n], r[n + 1], r[n + e], r[n + e + 1]) > -3
  );
}
function Yt(o, n, e, r = -40) {
  let a = (n + o.half) / o.cell - 0.5,
    f = (e + o.half) / o.cell - 0.5;
  if (a < 0 || f < 0 || a >= o.N - 1 || f >= o.N - 1) return r;
  let t = a | 0,
    l = f | 0,
    c = a - t,
    p = f - l,
    h = o.N,
    i = o.h,
    x = l * h + t,
    M = i[x],
    g = i[x + 1],
    w = i[x + h],
    y = i[x + h + 1];
  if (Vn(o, x)) {
    let b = Math.min(1, Math.floor(c * 2)) / 2,
      v = Math.min(1, Math.floor(p * 2)) / 2,
      A = (I, B) => (M + (g - M) * I) * (1 - B) + (w + (y - w) * I) * B,
      E = A(b, v),
      H = A(b + 0.5, v),
      R = A(b, v + 0.5),
      D = A(b + 0.5, v + 0.5),
      z = (c - b) * 2,
      T = (p - v) * 2;
    return z + T <= 1
      ? E + (H - E) * z + (R - E) * T
      : D + (R - D) * (1 - z) + (H - D) * (1 - T);
  }
  return c + p <= 1
    ? M + (g - M) * c + (w - M) * p
    : y + (w - y) * (1 - c) + (g - y) * (1 - p);
}
function be(o, n, e, r, a = -40) {
  let f = Yt(o, n, e, a);
  if (r <= 0) return f;
  for (let t = 0; t < 6; t++) {
    let l = (t / 6) * Math.PI * 2;
    f = Math.min(f, Yt(o, n + Math.cos(l) * r, e + Math.sin(l) * r, a));
  }
  return f;
}
var zn = `
uniform vec3 uSun,uMoon,uSunCol,uTint;
uniform float uTime,uDay,uNight,uTwi,uCov,uDens,uStorm,uFlash,uLight;
float h12(vec2 p){vec3 q=fract(vec3(p.xyx)*.1031);q+=dot(q,q.yzx+33.33);return fract((q.x+q.y)*q.z);}
float vn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
 return mix(mix(h12(i),h12(i+vec2(1,0)),f.x),mix(h12(i+vec2(0,1)),h12(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float a=.5,s=0.;for(int i=0;i<4;i++){s+=a*vn(p);p=p*2.03+17.1;a*=.5;}return s/.9375;}
vec3 dayHz(){return mix(vec3(.66,.78,.95),vec3(.32,1.18,2.2),smoothstep(.4,.9,uSun.y)*(1.-uStorm));}
vec3 horizon(){
 vec3 h=mix(vec3(.02,.03,.055),mix(dayHz(),vec3(.16,.17,.19),uStorm*.9),uDay);
 return mix(h,uTint*.85,uTwi*.55);}
vec3 hzSoft(){vec3 h=horizon();return mix(h,vec3(dot(h,vec3(.3,.59,.11))),.68*uDay*(1.-uTwi)*(1.-uStorm));}
vec3 sky(vec3 d){
 float y=max(d.y,0.),sd=max(dot(d,uSun),0.);
 vec3 hz=horizon();float ov=smoothstep(.25,.85,uStorm);
 vec3 zen=mix(vec3(.003,.007,.022),mix(mix(vec3(.09,.27,.68),vec3(.007,.35,1.73),smoothstep(.4,.9,uSun.y)*(1.-uStorm)),vec3(.04,.045,.055),uStorm*.9),uDay);
 vec3 c=mix(hz,zen,pow(y,.42));
 c+=uTint*uTwi*(.3+1.1*pow(sd,3.))*exp(-y*6.);
 c+=uSunCol*(pow(sd,10.)*.1+pow(sd,180.)*.5)*uDay*(1.-ov);
 float cl=0.,dn=0.;
 if(d.y>.002){
  vec2 p=d.xz/(d.y+.12)*.9+uTime*vec2(.012,.007);
  float fb=fbm(p),up=smoothstep(0.,.1,d.y);
  dn=mix(smoothstep(.62-.3*uCov,.92-.25*uCov,fb),.55+.45*fb,ov);
  cl=mix(1.-exp(-uDens*2.8*dn),1.,ov)*up;
  float ci=smoothstep(.55,.9,fbm(d.xz/(d.y+.3)*vec2(2.2,.7)+uTime*vec2(.03,.01)))*.3*(1.-uStorm)*smoothstep(0.,.2,d.y);
  cl=max(cl,ci);
 }
 vec3 cc=hzSoft()*.55+vec3(.015,.02,.035)*uNight+uSunCol*uDay*(.18+.6*pow(sd,5.)+(1.-dn)*pow(sd,3.)*1.4);
 cc*=1.-.18*dn*uDay*(1.-uStorm);
 cc=cc*mix(1.,.45*(.55+.45*(1.-dn)),uStorm)+uFlash*vec3(.75,.82,1.)*(.4+dn);
 vec3 b=uSunCol*smoothstep(.99988,.99996,dot(d,uSun))*4.*uDay;
 if(d.y>0.&&uNight>.01){vec3 g=d*190.,q=floor(g);float h=h12(q.xy+q.z*37.7);
  vec3 jt=vec3(h12(q.yz+7.3),h12(q.zx+3.1),h12(q.xy+9.7))-.5;
  float dot2=1.-smoothstep(0.,.3,length(fract(g)-.5-jt*.5));
  b+=vec3(.9,.95,1.)*dot2*step(.992,h)*(.35+.65*fract(h*113.))*(.6+.4*sin(uTime*3.+h*80.))*uNight*smoothstep(0.,.12,d.y)*1.5;}
 float md=dot(d,uMoon);b+=vec3(.75,.85,1.)*(smoothstep(.9994,.99965,md)*2.+pow(max(md,0.),80.)*.12)*uNight;
 return mix(c,cc,cl)+b*(1.-cl);}
`;
var Gn = `
#define SURF_DCAP 8.0
#define SURF_G 9.81
vec2 swRot(vec2 d,float a){float c=cos(a),s=sin(a);return vec2(d.x*c-d.y*s,d.x*s+d.y*c);}
// three interfering trains travelling in the simulation's reference depth; returns (eta, ux, uz)
vec3 swellRef(vec2 p,float t){
 float cr=sqrt(SURF_G*SURF_DCAP);
 float T1=max(uShT,3.),T2=T1*.58,T3=T1*1.55;
 float w1=6.283185/T1,w2=6.283185/T2,w3=6.283185/T3;
 vec2 d1=uSwDir,d2=swRot(uSwDir,.42),d3=swRot(uSwDir,-.26);
 float A=uShH*.5;
 float ph1=w1*(dot(p,d1)/cr-t),ph2=w2*(dot(p,d2)/cr-t)+1.7,ph3=w3*(dot(p,d3)/cr-t)+4.1;
 float g1=.62+.38*sin(ph1/6.3+.5),g2=.6+.4*sin(ph2/4.7+2.);
 float e1=A*.72*g1*cos(ph1),e2=A*.26*g2*cos(ph2),e3=A*.28*cos(ph3);
 vec2 u=(e1*d1+e2*d2+e3*d3)*(cr/SURF_DCAP);
 return vec3(e1+e2+e3,u);
}
// far field (outside the simulated window): Green's law shoaling, capped at the breaking height
float swellFar(vec2 p,float t,float depth){
 if(depth<.15)return 0.;
 float e=swellRef(p,t).x;
 float shoal=pow(SURF_DCAP/clamp(depth,.6,SURF_DCAP),.25);
 float lim=.42*depth;
 return clamp(e*shoal,-lim*.8,lim)*smoothstep(.15,.6,depth);
}
float swellFarFoam(vec2 p,float t,float depth){
 if(depth<.15||depth>9.)return 0.;
 float e=swellRef(p,t).x*pow(SURF_DCAP/clamp(depth,.6,SURF_DCAP),.25);
 return smoothstep(.3,.5,e/max(depth,.2))*smoothstep(.15,.5,depth);
}
`,
  _0 = `
uniform sampler2D uSurfS,uSurfF,uSurfB;
uniform vec4 uSurfBox;
uniform float uSurfOn;
uniform vec2 uSwDir;
uniform float uShT,uShH;
${Gn}
float sh1(vec2 p){vec3 q=fract(vec3(p.xyx)*.1031);q+=dot(q,q.yzx+33.33);return fract((q.x+q.y)*q.z);}
float sn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(sh1(i),sh1(i+vec2(1,0)),f.x),mix(sh1(i+vec2(0,1)),sh1(i+vec2(1,1)),f.x),f.y);}
vec2 worley(vec2 p){vec2 i=floor(p),f=fract(p);float d1=9.,d2=9.;
 for(int y=-1;y<=1;y++)for(int x=-1;x<=1;x++){vec2 g=vec2(float(x),float(y));vec2 o=vec2(sh1(i+g),sh1(i+g+19.7));
  vec2 r=g+o-f;float d=dot(r,r);if(d<d1){d2=d1;d1=d;}else if(d<d2)d2=d;}
 return sqrt(vec2(d1,d2));}
vec2 surfUV(vec2 p){return ((p-uSurfBox.xy)/uSurfBox.z+.5)/uSurfBox.w;}
float surfMask(vec2 uv){vec2 e=min(uv,1.-uv);float m=min(e.x,e.y)*uSurfBox.w;return uSurfOn*smoothstep(28.,64.,m);}
vec4 cubicW(float v){vec4 n=vec4(1.,2.,3.,4.)-v;vec4 s=n*n*n;float x=s.x,y=s.y-4.*s.x,z=s.z-4.*s.y+6.*s.x,w=6.-x-y-z;return vec4(x,y,z,w)/6.;}
// smooth (B-spline) reconstruction of the simulation grid, 4 bilinear fetches
vec4 texCubic(sampler2D t,vec2 uv,float R){
 vec2 c=uv*R-.5;vec2 f=fract(c);c-=f;
 vec4 xc=cubicW(f.x),yc=cubicW(f.y);
 vec4 cc=c.xxyy+vec2(-.5,1.5).xyxy;
 vec4 ss=vec4(xc.xz+xc.yw,yc.xz+yc.yw);
 vec4 off=(cc+vec4(xc.yw,yc.yw)/ss)/R;
 vec4 s0=texture2D(t,off.xz),s1=texture2D(t,off.yz),s2=texture2D(t,off.xw),s3=texture2D(t,off.yw);
 float sx=ss.x/(ss.x+ss.y),sy=ss.z/(ss.z+ss.w);
 return mix(mix(s3,s2,sx),mix(s1,s0,sx),sy);}
// foam lace: dense whitewater breaks into a cellular web and specks as it thins
float foamLace(vec2 p,float dens,float scale){
 vec2 Fw=worley(p*scale);
 float web=1.-smoothstep(.0,.16+.3*dens,Fw.y-Fw.x);
 float speck=sn(p*2.4*scale/.35)*.6+sn(p*6.7*scale/.35)*.4;
 float lace=clamp(web*.85+speck*.3,0.,1.);
 return smoothstep(1.-dens,1.-dens+.22,lace)*smoothstep(.015,.1,dens);
}
struct SurfSample{float h;float eta;vec2 vel;float rho;float mask;float w;vec2 lean;};
SurfSample surfAt(vec2 p){
 SurfSample s;vec2 uv=surfUV(p);s.mask=surfMask(uv);
 s.h=0.;s.eta=0.;s.vel=vec2(0.);s.rho=0.;s.w=0.;s.lean=vec2(0.);
 if(s.mask<=0.)return s;
 vec4 S=textureLod(uSurfS,uv,0.);vec4 B=textureLod(uSurfB,uv,0.);
 s.h=S.r;s.eta=B.r+S.r;s.vel=S.gb;s.rho=S.a;
 float depth=max(-B.g,0.);
 s.w=s.mask*(1.-smoothstep(SURF_DCAP*1.25,SURF_DCAP*2.75,depth));
 if(s.rho>.03){
  float tx=1./uSurfBox.w;
  float eE=textureLod(uSurfS,uv+vec2(tx,0.),0.).r+textureLod(uSurfB,uv+vec2(tx,0.),0.).r;
  float eN=textureLod(uSurfS,uv+vec2(0.,tx),0.).r+textureLod(uSurfB,uv+vec2(0.,tx),0.).r;
  vec2 grad=vec2(eE-s.eta,eN-s.eta)/uSurfBox.z;
  float spd=length(s.vel);vec2 dir=s.vel/max(spd,1e-4);
  float st=-dot(grad,dir);
   float lean=min(s.rho,1.8)*smoothstep(.08,.34,st)*clamp(s.eta,0.,3.2)*.58;
   lean=min(lean,.55*max(depth,.3)+.25);
   s.lean=dir*lean;
 }
 return s;
}
`;
function Un(o, n, e, r) {
  let a =
    Math.imul(o, 2376512323) ^
    Math.imul(n, 3625334849) ^
    Math.imul(e, 3407524639) ^
    r;
  return (
    (a = Math.imul(a ^ (a >>> 15), 739982445)),
    (a = Math.imul(a ^ (a >>> 12), 695872825)),
    ((a ^ (a >>> 15)) >>> 0) / 4294967296
  );
}
export { Un, Yt, be, kn, zn };
