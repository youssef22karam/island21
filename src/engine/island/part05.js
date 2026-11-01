// island.js - part 5/21 (statements 49-69 of the original module).
import * as Oe from "three";
import { $n, Ht, Ie, On, Un, ba, eo, ko, ne, qn, re, to, ve } from "./part01.js";
import { Ws, Xa } from "./part04.js";
import { sculptRiverWaterlines } from "../hydrology.js";

function* Ma(o) {
  let e = o.seed >>> 0,
    t = o.N,
    r = o.cell,
    s = t * t,
    c = t * r,
    a = c / 2,
    n = c / 7168,
    i = Ie(e * 2654435761 + 12345),
    m = new Ht(e),
    h = new Ht(e ^ 2654435769),
    l = new Float32Array(s),
    u = new Float32Array(s),
    d = (i() * 4) | 0,
    p = a * (0.45 + i() * 0.08) * (o.isHome ? 1.06 : 0.98),
    x = i() * Math.PI * 2,
    f = [],
    v = [],
    b = [],
    g = [],
    M = (j, S, F, y, A, B) => {
      f.push({
        x: j,
        z: S,
        rx: F,
        rz: y,
        ca: Math.cos(A),
        sa: Math.sin(A),
        ridgeBoost: B,
      });
    },
    w = (800 + i() * 360) * re(n * 1.1, 0.72, 1);
  if (d === 0) {
    let j = (1.25 + i() * 0.4) * Math.PI,
      S = p * (0.48 + i() * 0.12),
      F = 7;
    for (let y = 0; y < F; y++) {
      let A = y / (F - 1) - 0.5,
        B = x + A * j + (i() - 0.5) * 0.18,
        I = S * (0.85 + i() * 0.25),
        O = 1 - Math.abs(A) * 0.6,
        _ = p * (0.44 + 0.24 * O + i() * 0.14),
        ae = _ * (0.55 + i() * 0.35),
        le = Math.cos(B) * I,
        Y = Math.sin(B) * I,
        ee = y === 0 || y === F - 1 ? 0.25 : 0.65 + 0.35 * O;
      (M(le, Y, _, ae, B + Math.PI * 0.5 + (i() - 0.5) * 0.4, ee),
        y > 0 &&
          y < F - 1 &&
          b.push({
            x: le + (i() - 0.5) * _ * 0.35,
            z: Y + (i() - 0.5) * ae * 0.35,
            r: p * (0.28 + i() * 0.16),
            height: w * (0.68 + i() * 0.42),
          }));
    }
    v.push({
      x: Math.cos(x + Math.PI) * S * 0.28,
      z: Math.sin(x + Math.PI) * S * 0.28,
      r: p * (0.48 + i() * 0.12),
      strength: 0.46,
    });
  } else if (d === 1) {
    let j = p * (0.54 + i() * 0.12),
      S = Math.cos(x),
      F = Math.sin(x);
    (M(S * j, F * j, p * 0.72, p * 0.5, x + 0.28, 0.95),
      M(-S * j * 0.92, -F * j * 0.92, p * 0.64, p * 0.46, x - 0.35, 0.82),
      M(
        (i() - 0.5) * 70 * n,
        (i() - 0.5) * 70 * n,
        p * 0.68,
        p * 0.36,
        x,
        0.12,
      ),
      b.push(
        {
          x: S * j * 1.05,
          z: F * j * 1.05,
          r: p * 0.42,
          height: w * (0.95 + i() * 0.2),
        },
        {
          x: S * j * 0.65 - F * p * 0.22,
          z: F * j * 0.65 + S * p * 0.22,
          r: p * 0.3,
          height: w * 0.72,
        },
        {
          x: -S * j * 0.95,
          z: -F * j * 0.95,
          r: p * 0.38,
          height: w * (0.78 + i() * 0.2),
        },
      ));
    for (let y = 0; y < 4; y++) {
      let A = x + (i() - 0.5) * 2.8,
        B = p * (0.52 + i() * 0.45);
      M(
        Math.cos(A) * B,
        Math.sin(A) * B,
        p * (0.38 + i() * 0.2),
        p * (0.24 + i() * 0.14),
        A,
        0.22 + i() * 0.35,
      );
    }
    (v.push({ x: -F * p * 0.5, z: S * p * 0.5, r: p * 0.4, strength: 0.38 }),
      v.push({ x: F * p * 0.5, z: -S * p * 0.5, r: p * 0.38, strength: 0.35 }));
  } else if (d === 2) {
    (M(0, 0, p * 0.68, p * 0.52, x, 0.88),
      b.push({
        x: (i() - 0.5) * p * 0.25,
        z: (i() - 0.5) * p * 0.25,
        r: p * 0.4,
        height: w,
      }));
    let j = 5;
    for (let S = 0; S < j; S++) {
      let F = x + (S / j) * Math.PI * 2 + (i() - 0.5) * 0.38,
        y = p * (0.62 + i() * 0.38),
        A = p * (0.58 + i() * 0.2),
        B = p * (0.26 + i() * 0.12),
        I = Math.cos(F) * y * 0.56,
        O = Math.sin(F) * y * 0.56,
        _ = S % 2 === 0 ? 0.72 : 0.18;
      (M(I, O, A, B, F + (i() - 0.5) * 0.25, _),
        S % 2 === 0 &&
          b.push({
            x: I * 0.85,
            z: O * 0.85,
            r: p * 0.32,
            height: w * (0.65 + i() * 0.3),
          }));
      let ae = F + Math.PI / j;
      v.push({
        x: Math.cos(ae) * p * 0.62,
        z: Math.sin(ae) * p * 0.62,
        r: p * (0.34 + i() * 0.12),
        strength: 0.36,
      });
    }
  } else {
    let j = Math.cos(x),
      S = Math.sin(x);
    (M(
      -j * p * 0.26,
      -S * p * 0.26,
      p * 0.86,
      p * 0.54,
      x + Math.PI * 0.5,
      0.95,
    ),
      M(j * p * 0.38, S * p * 0.38, p * 0.82, p * 0.62, x + 0.15, 0.16));
    for (let F = -1; F <= 1; F++) {
      let y = -j * p * 0.28 - S * F * p * 0.36,
        A = -S * p * 0.28 + j * F * p * 0.36;
      b.push({
        x: y,
        z: A,
        r: p * (0.34 + i() * 0.12),
        height: w * (0.78 + i() * 0.28),
      });
    }
    for (let F = 0; F < 4; F++) {
      let y = x + (i() - 0.5) * Math.PI * 1.7,
        A = p * (0.48 + i() * 0.45);
      M(
        Math.cos(y) * A,
        Math.sin(y) * A,
        p * (0.42 + i() * 0.2),
        p * (0.28 + i() * 0.15),
        y + i() * 0.5,
        0.22 + i() * 0.4,
      );
    }
    v.push({
      x: Math.cos(x + 1.8) * p * 0.62,
      z: Math.sin(x + 1.8) * p * 0.62,
      r: p * 0.38,
      strength: 0.36,
    });
  }
  for (let j of b) j.r *= 1.55;
  let E = 3 + ((i() * 4) | 0);
  for (let j = 0; j < E; j++) {
    let S = x + i() * Math.PI * 2,
      F = p * (0.95 + i() * 0.35);
    g.push({
      x: Math.cos(S) * F,
      z: Math.sin(S) * F,
      r: (76 + i() * 96) * re(n * 1.15, 0.8, 1.35),
      height: 6 + i() * 18,
    });
  }
  let k = [],
    R = [],
    H = 2 + ((i() * 2) | 0);
  for (let j = 0; j < H; j++) {
    let S = x + j * (1.7 + i() * 1.1) + (i() - 0.5) * 0.6,
      F = 2 + ((i() * 3) | 0),
      y = p * (0.92 + i() * 0.22);
    for (let A = 0; A < F; A++) {
      let B = S + (A - 0.5) * (0.14 + i() * 0.16),
        I = (120 + i() * 270) * n * (1 - A * 0.16),
        O = I * (0.34 + i() * 0.36),
        _ = Math.min(y, a * 0.82 - Math.max(I, O)),
        ae = B + (i() - 0.5) * 1.1;
      (k.push({
        x: Math.cos(B) * _,
        z: Math.sin(B) * _,
        rx: I,
        rz: O,
        ca: Math.cos(ae),
        sa: Math.sin(ae),
        ridgeBoost: 0.25 + i() * 0.35,
      }),
        R.push(
          re((I + O) * 0.5 * (0.16 + i() * 0.26), 12, 150) * (1 - A * 0.12),
        ),
        (y += (I + O) * (0.85 + i() * 0.45)));
    }
  }
  let C = i() * 500,
    W = i() * 500,
    T = i() * 500,
    P = i() * 500,
    L = i() * 500,
    z = i() * 500;
  i();
  let D = 480 * n,
    q = x + (d === 3 ? 0 : (i() - 0.5) * 1.2),
    N = Math.cos(q),
    V = Math.sin(q);
  for (let j = 0; j < t; j++) {
    let S = (j + 0.5) * r - a;
    for (let F = 0; F < t; F++) {
      let y = (F + 0.5) * r - a,
        A = j * t + F,
        B = y + m.fbm(y / (1250 * n) + C, S / (1250 * n), 3) * D,
        I = S + m.fbm(y / (1250 * n), S / (1250 * n) + W, 3) * D,
        _ =
          (m.ridgedSoft(y / (700 * n) + T, S / (700 * n) + P, 4, 0.055) -
            0.44) *
            0.62 +
          (h.ridgedSoft(y / (250 * n) + z, S / (250 * n) + L, 3, 0.08) - 0.42) *
            0.34 +
          m.fbm(y / (95 * n) + W, S / (95 * n), 3) * 0.11,
        ae = -4,
        le = 0,
        Y = 0;
      for (let ke = 0; ke < f.length; ke++) {
        let be = f[ke],
          ce = B - be.x,
          Fe = I - be.z,
          _e = ce * be.ca + Fe * be.sa,
          Ce = -ce * be.sa + Fe * be.ca,
          Ye = Math.hypot(_e / be.rx, Ce / be.rz),
          Xe = 1 - Ye,
          st = 0.36,
          it = re(0.5 + (0.5 * (Xe - ae)) / st, 0, 1);
        ae = ve(ae, Xe, it) + st * it * (1 - it);
        let ot = Math.max(0, 1 - Ye * 0.9);
        ((le += ot * ot * be.ridgeBoost), (Y += ot * ot));
      }
      let ee = Y > 1e-4 ? le / Y : 0.35;
      for (let ke = 0; ke < v.length; ke++) {
        let be = v[ke],
          ce = Math.hypot(B - be.x, I - be.z) / be.r;
        if (ce < 1) {
          let Fe = (1 - ce * ce) * be.strength;
          ae -= Fe * ne(0.68, 0.04, ae);
        }
      }
      ae += _;
      let ie = -4,
        he = 22;
      for (let ke = 0; ke < k.length; ke++) {
        let be = k[ke],
          ce = B - be.x,
          Fe = I - be.z,
          _e = ce * be.ca + Fe * be.sa,
          Ce = -ce * be.sa + Fe * be.ca,
          Ye = 1 - Math.hypot(_e / be.rx, Ce / be.rz) + _ * 0.65,
          Xe = re(Math.min(be.rx, be.rz) / (p * 0.38), 0.22, 1),
          st = Ye >= 0 ? Ye : Ye * Xe;
        st > ie && ((ie = st), (he = R[ke]));
      }
      let Me = Math.max(ae, ie),
        xe = (y * N + S * V) / p,
        He =
          1 -
          ne(0.05, 0.38, Math.abs(m.n2(B / (820 * n) + L, I / (820 * n) + z))),
        Ae =
          1 -
          ne(0.04, 0.34, Math.abs(h.n2(B / (640 * n) - P, I / (640 * n) + T))),
        Ee = ne(0.18, 0.62, m.fbm(B / (1100 * n) + W, I / (1100 * n) - C, 3)),
        We = re(
          ne(
            -0.22,
            0.66,
            xe * 0.58 + m.fbm(y / 1450 + 40, S / 1450, 3) * 0.78 + 0.24,
          ) *
            0.64 +
            Math.max(He, Ae * 0.9) * 0.52 +
            Ee * 0.28 +
            (1 - ee) * 0.46,
          0,
          1,
        );
      u[A] = We;
      let Ve,
        Se = B + h.fbm(y / (420 * n) + P, S / (420 * n) - W, 3) * 195 * n,
        oe = I + h.fbm(y / (420 * n) - z, S / (420 * n) + C, 3) * 195 * n,
        Be = Se + m.fbm(Se / (180 * n) + T, oe / (180 * n) + L, 2) * 58 * n,
        je = oe + m.fbm(Se / (180 * n) - L, oe / (180 * n) + T, 2) * 58 * n;
      if (Me > 0) {
        let ke = ae > 0 ? ae : ie,
          be = ae > 0 ? 0.78 : 1.55,
          ce = 1 - We * 0.62,
          Fe = (11.5 + 6.5 * ce) * Math.pow(ne(0, be, ke), 1.65),
          _e =
            (m.fbm(y / 580 + 70, S / 580, 3) * 3.8 +
              h.fbm(y / 240 + 13, S / 240, 2) * 2.2 +
              3.8) *
            ne(0.08, 0.48, ke) *
            (0.42 + 0.58 * ce),
          Ce =
            1 - ne(-0.12, 0.3, h.fbm(y / (760 * n) + T, S / (760 * n) - P, 3)),
          Xe =
            ne(0.4, 0.78, m.fbm(y / (900 * n) + z, S / (900 * n) - L, 3)) *
            (0.3 + 0.7 * ee) *
            (1 - Ce * 0.95),
          st = 32 * Xe * ne(0, 0.05, ke);
        if (ae > 0) {
          let it = ne(0.12, 0.6, ae),
            ot = ne(0.03, 0.62, ae),
            Mt = 0;
          for (let go = 0; go < b.length; go++) {
            let Kt = b[go],
              Ro = B - Kt.x,
              Jt = I - Kt.z,
              Oo =
                Math.exp(-((Ro * Ro + Jt * Jt) / (Kt.r * Kt.r)) * 2.2) *
                Kt.height;
            Mt += Oo * Oo;
          }
          let Ct = w * (0.28 + 0.44 * ee) * Math.pow(ot, 1.12),
            Ot = Math.sqrt(Mt + Ct * Ct) * it,
            lt = m.eroded(Se / (1180 * n) + C, oe / (1180 * n) + W, 8, 2.15),
            _t = h.ridged(
              Se / (1550 * n) + L,
              oe / (1550 * n) + z,
              6,
              2.08,
              0.52,
            ),
            Ut = m.ridgedSoft(Be / (540 * n) + T, je / (540 * n) + P, 5, 0.003),
            It = h.ridged(Be / (240 * n) - W, je / (240 * n) + C, 4, 2.1, 0.48),
            qt =
              re(0.5 + 0.5 * lt, 0, 1) * 0.44 +
              _t * 0.34 +
              Ut * 0.14 +
              It * 0.08;
          qt = re(qt, 0, 1);
          let Tt = 1 - Math.max(He, Ae) * 0.68,
            $t = Math.pow(qt * (0.72 + 0.28 * Tt), 2.15) * 1.82,
            Dt = Ot * $t * (1 - We * 0.68),
            jt =
              it *
              (7 +
                22 *
                  (0.5 +
                    0.5 *
                      m.eroded(
                        Se / (520 * n) + T,
                        oe / (520 * n) + P,
                        5,
                        1.4,
                      ))) *
              (0.35 + 0.65 * ee) *
              Tt,
            ua = ve(Fe, st, Xe * (1 - We * 0.68)),
            Vo = ua + _e + jt + Dt,
            Go =
              ua * 0.55 +
              _e * 0.48 +
              it *
                (2.2 +
                  9.5 * (1 - We) * (0.5 + 0.5 * m.fbm(y / 460, S / 460, 2))),
            Eo = re(We * (1 - ne(48, 165, Dt)) * 0.92, 0, 0.9);
          Ve = ve(Vo, ko(Vo, Go, 18), Eo);
        } else {
          let it = ne(0.35, 1.15, ie),
            ot = m.eroded(Se / (420 * n) + T, oe / (420 * n) + P, 6, 1.6),
            Mt = h.ridgedSoft(Se / (520 * n) + L, oe / (520 * n) + z, 4, 0.01),
            Ct = re((0.5 + 0.5 * ot) * 0.6 + Mt * 0.4, 0, 1);
          Ve =
            ve(Fe, st * 0.8, Xe) +
            _e * 0.6 +
            he * Math.pow(it, 1.25) * (0.25 + 1.1 * Math.pow(Ct, 1.5));
        }
      } else {
        let ke = -Me,
          be =
            2.6 * ne(0, 0.075, ke) +
            16 * ne(0.055, 0.3, ke) +
            28 * ne(0.22, 0.75, ke),
          ce = ne(0.06, 0.19, ke) * (1 - ne(0.21, 0.38, ke)),
          Fe = 0.55 + 0.45 * h.fbm(y / (95 * n) + T, S / (95 * n) - C, 3);
        be = ve(
          be,
          (2.3 + 1.5 * Fe) * (0.78 + 0.22 * m.fbm(y / 420, S / 420, 2)),
          ce * 0.8,
        );
        let _e = ne(0.01, 0.065, ke) * (1 - ne(0.09, 0.19, ke));
        ((be = ve(be, 1.1 + 0.9 * m.fbm(y / 190 + 12, S / 190, 2), _e * 0.45)),
          (Ve = -Math.max(be, 0.35)),
          (Ve += m.fbm(y / 260, S / 260, 3) * 2.2 * ne(0, 0.32, ke)));
      }
      for (let ke = 0; ke < g.length; ke++) {
        let be = g[ke],
          ce = Se - be.x,
          Fe = oe - be.z,
          _e = (ce * ce + Fe * Fe) / (be.r * be.r);
        if (_e < 1.6) {
          let Ce = Math.sqrt(_e) + m.fbm(y / 25, S / 25, 2) * 0.18,
            Ye = ne(1.45, 0.62, Ce),
            Xe = be.height * (0.82 + 0.25 * m.fbm(y / 40 + 3, S / 40, 2));
          Ve = Math.max(Ve, ve(Ve, Xe, Ye));
        }
      }
      let Ke = ne(0.86, 0.995, Math.max(Math.abs(y), Math.abs(S)) / a);
      l[A] = ve(Ve, -40, Ke);
    }
    (j & 31) === 0 && (yield { label: "Raising the archipelago", p: j / t });
  }
  o.onStage?.("raised", l);
  let G = yield* Un(l, u, t, r, e);
  (o.onStage?.("evolved", l),
    yield* On(l, t, i, o.erosionDroplets),
    o.onStage?.("droplets", l));
  {
    let j = new Float32Array(s);
    for (let S = 0; S < 4; S++) {
      for (let F = 1; F < t - 1; F++)
        for (let y = 1; y < t - 1; y++) {
          let A = F * t + y,
            B = l[A];
          if (B < -1.5) {
            j[A] = B;
            continue;
          }
          let I =
              Math.hypot(l[A + 1] - l[A - 1], l[A + t] - l[A - t]) / (2 * r),
            O = (1 - ne(0.1, 0.32, I)) * (1 - ne(60, 160, B));
          O = ve(O, 1, u[A] * 0.55 * (1 - ne(25, 80, B)));
          let _ =
            (4 * B +
              2 * (l[A - 1] + l[A + 1] + l[A - t] + l[A + t]) +
              l[A - t - 1] +
              l[A - t + 1] +
              l[A + t - 1] +
              l[A + t + 1]) /
            16;
          j[A] = ve(B, _, 0.6 * O);
        }
      for (let F = 1; F < t - 1; F++)
        for (let y = 1; y < t - 1; y++) {
          let A = F * t + y;
          l[A] > -1.5 && (l[A] = j[A]);
        }
      (S & 1) === 0 &&
        (yield { label: "Smoothing meadows and slopes", p: S / 4 });
    }
  }
  (ba(l, t, r, G, { passes: 10, conserve: !0 }), o.onStage?.("smoothed", l));
  {
    let j = new Uint8Array(s),
      S = new Int32Array(s),
      F = 0,
      y = 0;
    for (let B = 0; B < t; B++)
      for (let I of [B, (t - 1) * t + B, B * t, B * t + t - 1])
        l[I] <= 0 && ((j[I] = 1), (S[y++] = I));
    for (; F < y;) {
      let B = S[F++],
        I = B % t,
        O = (B / t) | 0;
      for (let _ = 0; _ < 8; _++) {
        let ae = I + eo[_],
          le = O + to[_];
        if (ae < 0 || le < 0 || ae >= t || le >= t) continue;
        let Y = le * t + ae;
        !j[Y] && l[Y] <= 0.05 && ((j[Y] = 1), (S[y++] = Y));
      }
    }
    for (let B = 0; B < s; B++)
      !j[B] && l[B] < 0.45 && (l[B] = 0.45 + u[B] * 0.85);
    let A = new Float32Array(s);
    for (let B = 0; B < 3; B++) {
      for (let I = 1; I < t - 1; I++)
        for (let O = 1; O < t - 1; O++) {
          let _ = I * t + O,
            ae = l[_];
          if (ae <= 0 || ae > 45) {
            A[_] = ae;
            continue;
          }
          let le =
            (4 * ae +
              2 * (l[_ - 1] + l[_ + 1] + l[_ - t] + l[_ + t]) +
              l[_ - t - 1] +
              l[_ - t + 1] +
              l[_ + t - 1] +
              l[_ + t + 1]) /
            16;
          A[_] = Math.max(0.35, ve(ae, le, 0.68));
        }
      for (let I = 1; I < t - 1; I++)
        for (let O = 1; O < t - 1; O++) {
          let _ = I * t + O;
          l[_] > 0 && l[_] <= 45 && (l[_] = A[_]);
        }
    }
  }
  let U = new Uint8Array(s);
  for (let j = 0; j < s; j++) U[j] = l[j] <= 0 ? 1 : 0;
  let K = new Float32Array(s).fill(1e9);
  {
    for (let F = 0; F < s; F++) K[F] = U[F] === 1 ? 0 : 1e9;
    let j = r,
      S = r * Math.SQRT2;
    for (let F = 0; F < t; F++)
      for (let y = 0; y < t; y++) {
        let A = F * t + y,
          B = K[A];
        (y > 0 && (B = Math.min(B, K[A - 1] + j)),
          F > 0 && (B = Math.min(B, K[A - t] + j)),
          y > 0 && F > 0 && (B = Math.min(B, K[A - t - 1] + S)),
          y < t - 1 && F > 0 && (B = Math.min(B, K[A - t + 1] + S)),
          (K[A] = B));
      }
    for (let F = t - 1; F >= 0; F--)
      for (let y = t - 1; y >= 0; y--) {
        let A = F * t + y,
          B = K[A];
        (y < t - 1 && (B = Math.min(B, K[A + 1] + j)),
          F < t - 1 && (B = Math.min(B, K[A + t] + j)),
          y < t - 1 && F < t - 1 && (B = Math.min(B, K[A + t + 1] + S)),
          y > 0 && F < t - 1 && (B = Math.min(B, K[A + t - 1] + S)),
          (K[A] = B));
      }
    (qn(l, U, K, t, r, a, m), yield { label: "Measuring the coastline", p: 1 });
  }
  o.onStage?.("pre-hydrology", l);
  let X = yield* Xa(l, U, K, u, t, r, a, e, !!o.isHome);
  (ba(l, t, r, G, { passes: 10, conserve: !1, protect: X.wet }),
    o.onStage?.("hydrology", l));
  // smooth, sub-cell waterlines along every channel and lake (after all bank passes)
  sculptRiverWaterlines({ N: t, cell: r, half: a, h: l, rivers: X.rivers, body: X.body, lakeId: X.lakeId, wet: X.wet, lakeSD: X.lakeSD });
  for (let j = 0; j < s; j++) U[j] = l[j] <= 0 ? 1 : 0;
  let { tau: J, dirX: se, dirZ: te } = yield* $n(l, t, r),
    me = new Float32Array(s);
  for (let j = 0; j < t; j++)
    for (let S = 0; S < t; S++) {
      let F = j * t + S;
      if (l[F] < 0) {
        me[F] = 1;
        continue;
      }
      let y = 0;
      for (let A = 0; A < 8; A++) {
        let B = 0;
        for (let I of [2, 5, 11]) {
          let O = S + eo[A] * I,
            _ = j + to[A] * I;
          if (O < 0 || _ < 0 || O >= t || _ >= t) continue;
          let ae = l[_ * t + O] - l[F];
          B = Math.max(B, ae / (I * r * (A & 1 ? Math.SQRT2 : 1)));
        }
        y += Math.max(0, B);
      }
      me[F] = re(1 - y * 0.16, 0.53, 1);
    }
  let $ = 0,
    Z = 0;
  for (let j = 0; j < s; j++) (l[j] > $ && ($ = l[j]), l[j] > 0 && Z++);
  return (
    yield { label: "Charting the island", p: 1 },
    {
      seed: e,
      N: t,
      cell: r,
      size: c,
      half: a,
      h: l,
      type: U,
      cdist: K,
      plain: u,
      tau: J,
      dirX: se,
      dirZ: te,
      inl: X.inl,
      fresh: X.fresh,
      swamp: X.swamp,
      flowX: X.flowX,
      flowZ: X.flowZ,
      wet: X.wet,
      level: X.level,
      nearLevel: X.nearLevel,
      lakeId: X.lakeId,
      accumulation: X.accumulation,
      downstream: X.downstream,
      ao: me,
      sed: X.sed,
      body: X.body,
      bankDist: X.bankDist,
      navMask: X.navMask,
      netStats: X.netStats,
      rivers: X.rivers,
      lakes: X.lakes,
      marshes: X.marshes,
      maxHeight: $,
      landArea: Z * r * r,
      name: Ws(i, ["Isle", "Island", "Reach", "Cay", "Atoll"][(i() * 5) | 0]),
    }
  );
}
var Za = 0.006666666666666667,
  Ja = 1 / 41,
  en = 1 / 5.3,
  tn = 1 / 1.9,
  on = 1 / 90,
  or = `
uniform vec4 uBiome;
uint bHash(uint x){x^=x>>16u;x*=0x7feb352du;x^=x>>15u;x*=0x846ca68bu;x^=x>>16u;return x;}
float bHash2(ivec2 c,uint s){uvec2 u=uvec2(c+ivec2(32768));return float(bHash((u.x*0x8da6b343u)^(u.y*0xd8163841u)^s))*2.3283064e-10;}
float bNoise(vec2 q,uint s){vec2 i=floor(q),f=q-i;ivec2 c=ivec2(i);f=f*f*(3.-2.*f);
 return mix(mix(bHash2(c,s),bHash2(c+ivec2(1,0),s),f.x),mix(bHash2(c+ivec2(0,1),s),bHash2(c+ivec2(1,1),s),f.x),f.y);}
// l = island-local metres + uBiome.xy, h = ground height, cd = distance to the sea, g = |grad h|,
// fr = proximity to fresh water (riverbanks and lake shores are green down to the waterline)
// returns (cover 0..1, vegetated patch 0..1)
vec2 vegCover(vec2 l,float h,float cd,float g,float fr){
 float n1=bNoise(l*${Za},461845907u),n2=bNoise(l*${Ja},${3432918353}u);
 float vd=${(85).toFixed(1)}+70.*(n1-.5)+26.*(n2-.5);
 float covD=smoothstep(vd-30.,vd+40.,cd);
 float covH=smoothstep(13.,19.,h+6.*(n2-.5));
 float fb=fr*smoothstep(60.,170.,cd);
 float cov=max(max(covD,covH),fb*.95)*smoothstep(mix(2.3,.1,fb),mix(3.6,.32,fb),h)*(1.-smoothstep(.8,1.35,g));
 float clump=bNoise(l*${en},${3864292196}u)*.62+bNoise(l*${tn},${2246822507}u)*.38;
 float t=1.-cov*1.25;
 return vec2(cov,smoothstep(t-.07,t+.07,clump));
}
// distance from the water of the spring-tide wrack line (stranded weed and driftwood)
float wrackDist(vec2 l){return 22.+14.*(bNoise(l*${on},668265263u)-.5);}
`,
  Ra = Math.imul;
function Ns(o) {
  return (
    (o ^= o >>> 16),
    (o = Ra(o, 2146121005)),
    (o ^= o >>> 15),
    (o = Ra(o, 2221713035)),
    (o ^= o >>> 16),
    o >>> 0
  );
}
function Ea(o, e, t) {
  return (
    Ns((Ra(o + 32768, 2376512323) ^ Ra(e + 32768, 3625334849) ^ t) >>> 0) *
    23283064e-17
  );
}
function Nt(o, e, t) {
  let r = Math.floor(o),
    s = Math.floor(e),
    c = o - r,
    a = e - s;
  ((c = c * c * (3 - 2 * c)), (a = a * a * (3 - 2 * a)));
  let n = Ea(r, s, t),
    i = Ea(r + 1, s, t),
    m = Ea(r, s + 1, t),
    h = Ea(r + 1, s + 1, t),
    l = n + (i - n) * c,
    u = m + (h - m) * c;
  return l + (u - l) * a;
}
var Ao = (o, e, t) => {
    let r = Math.min(Math.max((t - o) / (e - o), 0), 1);
    return r * r * (3 - 2 * r);
  },
  Qa = [0, 0];
function Fo(o, e, t, r, s, c = 0) {
  let a = Nt(o * Za, e * Za, 461845907),
    n = Nt(o * Ja, e * Ja, 3432918353),
    i = 85 + 70 * (a - 0.5) + 26 * (n - 0.5),
    m = Ao(i - 30, i + 40, r),
    h = Ao(13, 19, t + 6 * (n - 0.5)),
    l = c * Ao(60, 170, r),
    u =
      Math.max(m, h, l * 0.95) *
      Ao(2.3 + (0.1 - 2.3) * l, 3.6 + (0.32 - 3.6) * l, t) *
      (1 - Ao(0.8, 1.35, s)),
    d =
      Nt(o * en, e * en, 3864292196) * 0.62 +
      Nt(o * tn, e * tn, 2246822507) * 0.38,
    p = 1 - u * 1.25;
  return ((Qa[0] = u), (Qa[1] = Ao(p - 0.07, p + 0.07, d)), Qa);
}
function ar(o, e) {
  return 22 + 14 * (Nt(o * on, e * on, 668265263) - 0.5);
}
function ho(o) {
  let e = o >>> 0;
  return [(e % 1009) * 3.7 - 1866, ((e >>> 10) % 1013) * 3.3 - 1671];
}
function zo(o, e) {
  return o.h[e] < 0 ? o.tau[e] : -o.cdist[e];
}
function Xo(o, e, t) {
  let r = (e + o.half) / o.cell - 0.5,
    s = (t + o.half) / o.cell - 0.5,
    c = Math.min(Math.max(Math.floor(r), 0), o.N - 2),
    a = Math.min(Math.max(Math.floor(s), 0), o.N - 2),
    n = Math.min(Math.max(r - c, 0), 1),
    i = Math.min(Math.max(s - a, 0), 1),
    m = a * o.N + c,
    h = zo(o, m),
    l = zo(o, m + 1),
    u = zo(o, m + o.N),
    d = zo(o, m + o.N + 1),
    p = (h + (l - h) * n) * (1 - i) + (u + (d - u) * n) * i;
  return Math.max(-p, 0);
}
function Vt(o, e, t, r) {
  let s = (t + o.half) / o.cell - 0.5,
    c = (r + o.half) / o.cell - 0.5,
    a = Math.min(Math.max(Math.floor(s), 0), o.N - 2),
    n = Math.min(Math.max(Math.floor(c), 0), o.N - 2),
    i = Math.min(Math.max(s - a, 0), 1),
    m = Math.min(Math.max(c - n, 0), 1),
    h = n * o.N + a;
  return (
    (e[h] + (e[h + 1] - e[h]) * i) * (1 - m) +
    (e[h + o.N] + (e[h + o.N + 1] - e[h + o.N]) * i) * m
  );
}
function no(o, e, t) {
  return Vt(o, o.fresh, e, t);
}
function an(o, e) {
  let t = o.N,
    r = o.h;
  return (
    Math.max(o.fresh[e], o.fresh[e + 1], o.fresh[e + t], o.fresh[e + t + 1]) >
      0.5 &&
    Math.min(r[e], r[e + 1], r[e + t], r[e + t + 1]) < 3 &&
    Math.max(r[e], r[e + 1], r[e + t], r[e + t + 1]) > -3
  );
}
function $e(o, e, t, r = -40) {
  let s = (e + o.half) / o.cell - 0.5,
    c = (t + o.half) / o.cell - 0.5;
  if (s < 0 || c < 0 || s >= o.N - 1 || c >= o.N - 1) return r;
  let a = s | 0,
    n = c | 0,
    i = s - a,
    m = c - n,
    h = o.N,
    l = o.h,
    u = n * h + a,
    d = l[u],
    p = l[u + 1],
    x = l[u + h],
    f = l[u + h + 1];
  if (an(o, u)) {
    let v = Math.min(1, Math.floor(i * 2)) / 2,
      b = Math.min(1, Math.floor(m * 2)) / 2,
      g = (C, W) => (d + (p - d) * C) * (1 - W) + (x + (f - x) * C) * W,
      M = g(v, b),
      w = g(v + 0.5, b),
      E = g(v, b + 0.5),
      k = g(v + 0.5, b + 0.5),
      R = (i - v) * 2,
      H = (m - b) * 2;
    return R + H <= 1
      ? M + (w - M) * R + (E - M) * H
      : k + (E - k) * (1 - R) + (w - k) * (1 - H);
  }
  return i + m <= 1
    ? d + (p - d) * i + (x - d) * m
    : f + (x - f) * (1 - i) + (p - f) * (1 - m);
}
function Xt(o, e, t, r, s = -40) {
  let c = $e(o, e, t, s);
  if (r <= 0) return c;
  for (let a = 0; a < 6; a++) {
    let n = (a / 6) * Math.PI * 2;
    c = Math.min(c, $e(o, e + Math.cos(n) * r, t + Math.sin(n) * r, s));
  }
  return c;
}
var Rt = Oe.DataUtils.toHalfFloat;
function nr(o, e) {
  let {
      N: t,
      h: r,
      dirX: s,
      dirZ: c,
      inl: a,
      fresh: n,
      swamp: i,
      flowX: m,
      flowZ: h,
    } = o,
    l = t * 2,
    u = new Uint16Array(l * t * 4);
  for (let p = 0; p < t; p++)
    for (let x = 0; x < t; x++) {
      let f = p * t + x,
        v = (p * l + x) * 4,
        b = v + t * 4;
      ((u[v] = Rt(r[f])),
        (u[v + 1] = Rt(zo(o, f))),
        (u[v + 2] = Rt(s[f])),
        (u[v + 3] = Rt(c[f])),
        (u[b] = Rt(o.wet[f] ? 1 : r[f] <= 0 ? a[f] : i[f])),
        (u[b + 1] = Rt(o.wet[f] || r[f] <= 0 ? i[f] : n[f])),
        (u[b + 2] = Rt(m[f])),
        (u[b + 3] = Rt(h[f])));
    }
  let d = new Oe.DataTexture(u, l, t, Oe.RGBAFormat, Oe.HalfFloatType);
  return (
    (d.minFilter = d.magFilter = Oe.LinearFilter),
    (d.wrapS = d.wrapT = Oe.ClampToEdgeWrapping),
    (d.generateMipmaps = !1),
    (d.needsUpdate = !0),
    d
  );
}
function rr(o) {
  let e = new Uint16Array(o.N * o.N * 4);
  for (let r = 0; r < o.h.length; r++) {
    let s = r * 4;
    ((e[s] = Rt(o.nearLevel[r])),
      (e[s + 1] = Rt(o.wet[r])),
      (e[s + 2] = Rt(o.ao[r])),
      (e[s + 3] = Rt(o.fresh[r])));
  }
  let t = new Oe.DataTexture(e, o.N, o.N, Oe.RGBAFormat, Oe.HalfFloatType);
  return (
    (t.minFilter = t.magFilter = Oe.LinearFilter),
    (t.wrapS = t.wrapT = Oe.ClampToEdgeWrapping),
    (t.generateMipmaps = !1),
    (t.needsUpdate = !0),
    t
  );
}
function sr() {
  let o = new Oe.DataTexture(
    new Uint16Array([Rt(-40), Rt(300), 0, 0, 0, 0, 0, 0]),
    2,
    1,
    Oe.RGBAFormat,
    Oe.HalfFloatType,
  );
  return ((o.needsUpdate = !0), o);
}
export { $e, Fo, Ma, Nt, Vt, Xo, Xt, an, ar, ho, no, nr, or, rr, sr };
