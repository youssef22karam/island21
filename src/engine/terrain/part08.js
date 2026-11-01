// terrain.worker.js - part 8/9 (statements 83-83 of the original module).
import * as Kt from "three";
import { At, at, et, jt } from "./part01.js";
import { Yt, be } from "./part05.js";
import { Cn, Pn, Se, Wn, en, nn, ye } from "./part07.js";

function* Bn(o, n, e = Se()) {
  let { N: r, cell: a, half: f } = o,
    t = At(o.seed ^ 1542469173),
    l = {};
  for (let q of Object.keys(e))
    l[q] = e[q].map(() => ({ matrices: [], colors: [] }));
  let [c, p] = Wn(o.seed),
    h = new Kt.Matrix4(),
    i = new Kt.Quaternion(),
    x = new Kt.Euler(),
    M = new Kt.Vector3(),
    g = new Kt.Vector3(),
    w = new Kt.Color(),
    y = Math.PI * 2,
    b = (q, K, V, Y, J, tt, ct, st, nt, pt, ft, dt, j, u) => {
      (x.set(pt, nt, ft),
        i.setFromEuler(x),
        M.set(V, J, Y),
        g.set(tt, ct, st),
        h.compose(M, i, g));
      let d = l[q][Math.abs(K | 0) % l[q].length];
      for (let s = 0; s < 16; s++) d.matrices.push(h.elements[s]);
      d.colors.push(dt, j, u);
    },
    v = (q, K, V, Y, J, tt, ct, st, nt, pt) => {
      (w.setHSL(st, nt, pt),
        b(
          q,
          K,
          V,
          Y,
          J,
          tt,
          tt * (0.85 + t() * 0.3),
          tt,
          t() * y,
          ct * (t() - 0.5),
          ct * (t() - 0.5),
          w.r,
          w.g,
          w.b,
        ));
    },
    A = new jt(o.seed ^ 523124044),
    E = new jt(o.seed ^ 2056368835),
    H = new jt(o.seed ^ 739982445),
    R = (q, K) => et(0.08, 0.5, H.fbm(q * 0.0024 + 7.7, K * 0.0024 - 3.1, 3)),
    D = 0.15 + 0.7 * t(),
    z = (q, K, V = !1) => {
      let Y = (0.5 + 0.5 * H.fbm(q * 0.0017 - 11.3, K * 0.0017 + 5.9, 2)) * D,
        J = t(),
        tt,
        ct,
        st;
      if (J < Y) {
        let nt = 0.13 + 0.07 * t();
        ((tt = nt), (ct = nt * 0.97), (st = nt * 0.93));
      } else if (J < Y + (1 - Y) * 0.25) {
        let nt = 0.42 + 0.12 * t();
        ((tt = nt * 1.04), (ct = nt), (st = nt * 0.88));
      } else {
        let nt = 0.27 + 0.11 * t();
        ((tt = nt * 1.07), (ct = nt), (st = nt * 0.87));
      }
      return (V && ((tt *= 0.8), (ct *= 0.82), (st *= 0.82)), [tt, ct, st]);
    },
    T = (q, K, V, Y) => {
      for (let J = 0; J < Y; J++) {
        let tt = t() * y,
          ct = V * Math.sqrt(t()),
          st = q + Math.cos(tt) * ct,
          nt = K + Math.sin(tt) * ct,
          pt = Yt(o, st, nt, -40);
        if (pt < 0.35) continue;
        let ft = 0.06 + Math.pow(t(), 2.2) * 0.32,
          dt = t(),
          j,
          u,
          d;
        if (dt < 0.12) {
          let s = 0.14 + 0.07 * t();
          ((j = s), (u = s), (d = s * 0.96));
        } else if (dt < 0.47) {
          let s = 0.52 + 0.14 * t();
          ((j = s), (u = s * 0.96), (d = s * 0.88));
        } else {
          let s = 0.32 + 0.14 * t();
          ((j = s * 1.08), (u = s), (d = s * 0.84));
        }
        b(
          "pebble",
          t() * 8,
          st,
          nt,
          pt - ft * 0.06,
          ft,
          ft * (0.55 + t() * 0.5),
          ft * (0.7 + t() * 0.5),
          t() * y,
          (t() - 0.5) * 0.3,
          (t() - 0.5) * 0.3,
          j,
          u,
          d,
        );
      }
    },
    I = (q, K, V, Y = 0.6) => {
      let J = 1 + ((t() * 5.5) | 0),
        [tt, ct, st] = z(q, K);
      for (let nt = 0; nt < J; nt++) {
        let pt = t() * y,
          ft = nt === 0 ? 0 : V * (0.55 + t() * 1.5),
          dt = q + Math.cos(pt) * ft,
          j = K + Math.sin(pt) * ft,
          u = nt === 0 ? V : V * (0.22 + t() * 0.55),
          d = be(o, dt, j, u * 0.45, -40);
        if (d < Y) continue;
        let s = 0.88 + t() * 0.24;
        (b(
          t() < 0.3 ? "slab" : "rock",
          t() * 12,
          dt,
          j,
          d - u * 0.04,
          u * (0.9 + t() * 0.3),
          u * (0.8 + t() * 0.45),
          u * (0.9 + t() * 0.3),
          t() * y,
          (t() - 0.5) * 0.4,
          (t() - 0.5) * 0.4,
          tt * s,
          ct * s,
          st * s,
        ),
          t() < 0.7 && T(dt, j, u * 1.4 + 0.6, 2 + ((t() * 7) | 0)));
      }
    },
    B = (q, K, V, Y) => {
      let J = Y + Math.PI / 2 + (t() - 0.5) * 1.1,
        tt = 0.45 + t() * 0.9,
        ct = 0.5 + 0.12 * t();
      b(
        "driftwood",
        t() * 6,
        q,
        K,
        V - 0.05 * tt,
        tt,
        tt * (0.8 + t() * 0.4),
        tt,
        -J,
        (t() - 0.5) * 0.1,
        (t() - 0.5) * 0.1,
        ct * 1.02,
        ct,
        ct * 0.93,
      );
    },
    W = (q, K, V, Y) => {
      if (t() < 0.4) return;
      let J = q + Math.cos(V) * Y * 0.85,
        tt = K + Math.sin(V) * Y * 0.85,
        ct = 1 + ((t() * 4) | 0);
      for (let st = 0; st < ct; st++) {
        let nt = t() * y,
          pt = 0.3 + t() * 2.4,
          ft = J + Math.cos(nt) * pt,
          dt = tt + Math.sin(nt) * pt,
          j = Yt(o, ft, dt, -40);
        if (j < 0.6) continue;
        let u = t() < 0.25,
          d = 0.85 + t() * 0.35;
        if (u)
          b(
            "coconut",
            t() * 4,
            ft,
            dt,
            j - 0.02,
            d,
            d,
            d,
            t() * y,
            (t() - 0.5) * 0.6,
            (t() - 0.5) * 0.6,
            0.16,
            0.2,
            0.06,
          );
        else {
          let s = 0.13 + 0.06 * t();
          b(
            "coconut",
            t() * 4,
            ft,
            dt,
            j - 0.02,
            d,
            d,
            d,
            t() * y,
            (t() - 0.5) * 0.6,
            (t() - 0.5) * 0.6,
            s * 1.35,
            s,
            s * 0.6,
          );
        }
      }
    },
    G = (q, K, V, Y, J) => {
      let tt = (t() * e.palm.length) | 0,
        ct = e.palm[tt].lean ?? { a: 0, bend: 0 },
        st = Y + (t() - 0.5) * 1.2;
      (w.setHSL(0.23 + t() * 0.03, 0.4, 0.38 + t() * 0.06),
        b(
          "palm",
          tt,
          q,
          K,
          V - 0.18,
          J,
          J * (0.85 + t() * 0.3),
          J,
          ct.a - st,
          0.05 * (t() - 0.5),
          0.05 * (t() - 0.5),
          w.r,
          w.g,
          w.b,
        ),
        W(q, K, st, ct.bend * J));
    },
    O = n >= 1 ? 1 : 2,
    S = n;
  for (let q = 1; q < r - 1; q += O) {
    for (let K = 1; K < r - 1; K += O) {
      let V = q * r + K,
        Y = o.wet[V] ? 1 : o.type[V],
        J = o.h[V],
        tt = o.h[V + 1] - o.h[V - 1],
        ct = o.h[V + r] - o.h[V - r],
        st = Math.hypot(tt, ct) / (2 * a);
      if (Y !== 0 && o.inl[V] > 0.5) {
        let u = (K + 0.5) * a - f + (t() - 0.5) * a * O,
          d = (q + 0.5) * a - f + (t() - 0.5) * a * O,
          s = Yt(o, u, d, J),
          m = o.wet[V] ? o.nearLevel[V] : 0,
          k = m - s,
          F = o.tau[V],
          C = Math.hypot(o.flowX[V], o.flowZ[V]),
          P = o.swamp[V],
          _ = o.cdist[V],
          ot = t(),
          U = 0.5 + 0.5 * E.fbm(u * 0.02 + 3.3, d * 0.02 - 8.1, 2),
          $ = _ < 165;
        if (P > 0.34 && k < 1.25 && F < 34 && ot < 0.25 * P * S)
          $ || t() < 0.32
            ? v(
                "mangrove",
                t() * 6,
                u,
                d,
                s - 0.15,
                0.8 + t() * 0.65,
                0.06,
                0.25,
                0.36,
                0.33,
              )
            : v(
                "treefern",
                t() * 8,
                u,
                d,
                s - 0.12,
                0.78 + t() * 0.68,
                0.05,
                0.24 + t() * 0.03,
                0.38,
                0.42,
              );
        else if (
          P > 0.28 &&
          k < 0.72 &&
          F < 24 &&
          C < 0.38 &&
          ot < 0.34 * P * S * U
        )
          v(
            "calamites",
            t() * 6,
            u,
            d,
            s - 0.05,
            0.85 + t() * 0.55,
            0.05,
            0.23,
            0.4,
            0.38,
          );
        else if (
          k < 0.85 &&
          F < 22 &&
          C < 0.5 &&
          ot < (0.42 + 0.32 * P) * S * U
        )
          v(
            "reed",
            t() * 6,
            u,
            d,
            s - 0.05,
            0.85 + t() * 0.55,
            0.06,
            0.22,
            0.38,
            0.36,
          );
        else if (
          C < 0.15 &&
          k > 0.22 &&
          k < 2.8 &&
          F > 2 &&
          F < 85 &&
          ot < (0.32 + 0.22 * P) * S * et(0.42, 0.68, U)
        )
          b(
            "lily",
            t() * 6,
            u,
            d,
            m,
            0.85 + t() * 0.75,
            1,
            0.85 + t() * 0.75,
            t() * y,
            0,
            0,
            1,
            1,
            1,
          );
        else if (k < 1.15 && C < 0.24 && ot < 0.24 * S * U)
          v(
            "sedge",
            t() * 6,
            u,
            d,
            s - 0.03,
            0.75 + t() * 0.5,
            0.07,
            0.24,
            0.3,
            0.31,
          );
        else if (P > 0.28 && k < 1.65 && ot < 0.038 * S)
          b(
            "snag",
            t() * 8,
            u,
            d,
            s - 0.18,
            0.85 + t() * 0.6,
            0.85 + t() * 0.65,
            0.85 + t() * 0.6,
            t() * y,
            (t() - 0.5) * 0.22,
            (t() - 0.5) * 0.22,
            0.82,
            0.8,
            0.74,
          );
        else if (P > 0.28 && k < 1.1 && ot < 0.052 * S) {
          let N = 0.18 + 0.06 * t();
          b(
            "log",
            t() * 6,
            u,
            d,
            m - 0.08,
            0.85 + t() * 0.65,
            0.85 + t() * 0.4,
            0.85 + t() * 0.65,
            t() * y,
            (t() - 0.5) * 0.08,
            (t() - 0.5) * 0.08,
            N * 1.15,
            N * 1.2,
            N * 0.82,
          );
        } else if (C > 0.22 && k < 1.4) {
          if (ot < 0.035 * S) {
            let N = 0.6 + t() * 1.2,
              [ut, xt, mt] = z(u, d, !0);
            b(
              "rock",
              t() * 12,
              u,
              d,
              s - 0.1,
              N,
              N * (0.6 + t() * 0.4),
              N,
              t() * y,
              (t() - 0.5) * 0.3,
              (t() - 0.5) * 0.3,
              ut,
              xt,
              mt,
            );
          } else if (ot < 0.22 * S)
            for (let N = 0; N < 4; N++) {
              let ut = u + (t() - 0.5) * 8,
                xt = d + (t() - 0.5) * 8,
                mt = Yt(o, ut, xt, s),
                wt = 0.2 + t() * t() * 0.5,
                St = 0.3 + 0.25 * t();
              b(
                "pebble",
                t() * 8,
                ut,
                xt,
                mt - wt * 0.08,
                wt,
                wt * 0.6,
                wt * 0.8,
                t() * y,
                0,
                0,
                St * 1.05,
                St,
                St * 0.88,
              );
            }
        }
        continue;
      }
      if (Y !== 0) {
        if (J > -1.9 && J < -0.12) {
          let u = (K + 0.5) * a - f + (t() - 0.5) * a * O,
            d = (q + 0.5) * a - f + (t() - 0.5) * a * O,
            s = R(u, d);
          if (t() < 0.05 * S * s * s) {
            let m = be(o, u, d, 0.8, J),
              k = 1 + ((t() * 3) | 0);
            for (let F = 0; F < k; F++) {
              let C = t() * y,
                P = F ? 1.5 + t() * 3 : 0,
                _ = u + Math.cos(C) * P,
                ot = d + Math.sin(C) * P,
                U = Math.min(be(o, _, ot, 0.6, m), -0.05),
                $ = (-U + 0.25 + t() * 0.8) * (F ? 0.7 : 1),
                N = $ * (1.25 + t() * 0.6),
                [ut, xt, mt] = z(_, ot, !0);
              b(
                t() < 0.35 ? "slab" : "rock",
                t() * 12,
                _,
                ot,
                U - 0.08,
                N,
                $ * 1.4,
                N * (0.8 + t() * 0.4),
                t() * y,
                (t() - 0.5) * 0.3,
                (t() - 0.5) * 0.3,
                ut,
                xt,
                mt,
              );
            }
          }
        }
        continue;
      }
      let nt = o.fresh[V];
      if (J - o.nearLevel[V] <= (nt > 0.3 ? 0.06 : 0.5)) continue;
      let pt = o.cdist[V],
        ft = o.plain[V],
        dt = Math.atan2(-o.dirZ[V], -o.dirX[V]),
        j = 1 + ((t() * 2.99) | 0);
      for (let u = 0; u < j; u++) {
        let d = (K + 0.5) * a - f + (t() - 0.5) * a * O * 1.8,
          s = (q + 0.5) * a - f + (t() - 0.5) * a * O * 1.8,
          m = be(o, d, s, 0.55, J),
          k = nn(o, d, s),
          F = ye(o, o.swamp, d, s),
          C = m - ye(o, o.nearLevel, d, s);
        if (C <= (k > 0.3 ? 0.06 : 0.5)) continue;
        let P = t(),
          _ = en(o, d, s),
          ot = Cn(d + c, s + p, m, _, st, k),
          U = ot[0],
          $ = ot[1],
          N = R(d, s),
          ut = 0.5 + 0.5 * A.fbm(d * 0.00105, s * 98e-5, 3),
          xt = 0.5 + 0.5 * E.fbm(d * 0.0062 + 11.3, s * 0.0057 - 4.1, 3),
          mt = A.fbm(d * 0.014 + 51.2, s * 0.013 - 27.6, 2),
          wt = at(ut * 0.72 + xt * 0.42 - 0.06, 0, 1),
          St = at(xt * 0.7 + ut * 0.5, 0, 1),
          Vt = et(-0.25, 0.05, mt) * 0.5 + 0.5;
        if (st > 1.05) {
          P < 0.05 * S && I(d, s, 0.9 + t() * 2.6);
          continue;
        }
        if (st > 0.55 && P < 0.02 * S * (0.4 + N)) {
          I(d, s, 0.8 + t() * 2.2);
          continue;
        }
        if (F > 0.26 && C < 4.2 && st < 0.34) {
          let Q = pt < 185;
          if (P < 0.22 * F * S)
            Q || t() < 0.25
              ? v(
                  "mangrove",
                  t() * 6,
                  d,
                  s,
                  m - 0.2,
                  0.8 + t() * 0.75,
                  0.05,
                  0.25,
                  0.36,
                  0.34,
                )
              : v(
                  "treefern",
                  t() * 8,
                  d,
                  s,
                  m - 0.18,
                  0.78 + t() * 0.72,
                  0.04,
                  0.24 + t() * 0.03,
                  0.38,
                  0.42,
                );
          else if (C < 1.8 && P < 0.36 * S)
            v(
              "calamites",
              t() * 6,
              d,
              s,
              m - 0.06,
              0.8 + t() * 0.65,
              0.05,
              0.23 + t() * 0.03,
              0.38,
              0.38,
            );
          else if (C < 1.5 && P < 0.5 * S)
            v(
              "reed",
              t() * 6,
              d,
              s,
              m - 0.05,
              0.8 + t() * 0.55,
              0.07,
              0.21 + t() * 0.04,
              0.36,
              0.36,
            );
          else if (C < 2.1 && P < 0.62 * S)
            v(
              "sedge",
              t() * 6,
              d,
              s,
              m - 0.04,
              0.8 + t() * 0.5,
              0.08,
              0.22,
              0.3,
              0.34,
            );
          else if (P < 0.72 * S)
            v(
              "fern",
              (P * 31) | 0,
              d,
              s,
              m - 0.04,
              0.7 + t() * 0.6,
              0.09,
              0.26,
              0.4,
              0.36,
            );
          else if (P < 0.755 * S)
            b(
              "snag",
              t() * 8,
              d,
              s,
              m - 0.25,
              0.75 + t() * 0.55,
              0.75 + t() * 0.6,
              0.75 + t() * 0.55,
              t() * y,
              (t() - 0.5) * 0.18,
              (t() - 0.5) * 0.18,
              0.84,
              0.82,
              0.76,
            );
          else if (P < 0.785 * S && C < 1.6) {
            let gt = 0.16 + 0.06 * t();
            b(
              "log",
              t() * 6,
              d,
              s,
              m - 0.02,
              0.8 + t() * 0.6,
              0.85 + t() * 0.35,
              0.8 + t() * 0.6,
              t() * y,
              (t() - 0.5) * 0.14,
              (t() - 0.5) * 0.14,
              gt * 1.2,
              gt * 1.18,
              gt * 0.82,
            );
          }
          continue;
        }
        if (k > 0.42 && U > 0.25 && C < 9 && st < 0.45) {
          C > 1.3 && P < 0.075 * S
            ? t() < 0.35
              ? v(
                  "treefern",
                  t() * 8,
                  d,
                  s,
                  m - 0.2,
                  0.75 + t() * 0.65,
                  0.04,
                  0.24 + t() * 0.03,
                  0.36,
                  0.4,
                )
              : v(
                  "broadleaf",
                  (P * 59) | 0,
                  d,
                  s,
                  m - 0.25,
                  0.8 + t() * 0.65,
                  0.06,
                  0.25 + t() * 0.04,
                  0.38,
                  0.32 + t() * 0.1,
                )
            : C < 1.1 && P < 0.32 * k * S
              ? v(
                  "calamites",
                  t() * 6,
                  d,
                  s,
                  m - 0.05,
                  0.75 + t() * 0.55,
                  0.06,
                  0.23,
                  0.38,
                  0.37,
                )
              : C < 1.1 && P < 0.52 * k * S
                ? v(
                    "reed",
                    t() * 6,
                    d,
                    s,
                    m - 0.05,
                    0.8 + t() * 0.5,
                    0.08,
                    0.21,
                    0.4,
                    0.37,
                  )
                : C < 2.2 && P < 0.62 * S
                  ? v(
                      "sedge",
                      t() * 6,
                      d,
                      s,
                      m - 0.04,
                      0.7 + t() * 0.45,
                      0.08,
                      0.23,
                      0.32,
                      0.34,
                    )
                  : C < 1.3 && F < 0.25 && P < 0.68 * S
                    ? T(d, s, 2 + t() * 3, 5 + ((t() * 8) | 0))
                    : C < 1.6 && P < 0.705 * S
                      ? B(d, s, m, dt)
                      : P < 0.16 * S * $
                        ? v(
                            "shrub",
                            (P * 29) | 0,
                            d,
                            s,
                            m - 0.08,
                            0.6 + t() * 0.8,
                            0.12,
                            0.24,
                            0.36,
                            0.36,
                          )
                        : P < 0.24 * S &&
                          v(
                            "fern",
                            (P * 31) | 0,
                            d,
                            s,
                            m - 0.04,
                            0.65 + t() * 0.55,
                            0.1,
                            0.26,
                            0.38,
                            0.36,
                          );
          continue;
        }
        if (U < 0.1) {
          if (P < (0.032 * N * N + 0.0015) * S) {
            I(d, s, 0.8 + t() * t() * 3.4);
            continue;
          }
          if (P < (0.045 * N + 0.004) * S && m < 4.5) {
            T(d, s, 1.6 + t() * 2.6, 6 + ((t() * 16) | 0));
            continue;
          }
          let Q = Pn(d + c, s + p);
          if (Math.abs(_ - Q) < 6 && P < 0.15 * S) {
            B(d, s, Yt(o, d, s), dt);
            continue;
          }
          U > 0.025 &&
            _ > Q + 18 &&
            P < 0.012 * S &&
            G(d, s, m, dt, 0.9 + t() * 0.7);
          continue;
        }
        if (U < 0.62) {
          let Q = et(0.45, 0.8, St);
          if (P < (0.03 + 0.07 * Q) * S && $ > 0.15) {
            G(d, s, m, dt, 0.95 + t() * 0.8);
            continue;
          }
          if (P < 0.2 * S * $) {
            v(
              "shrub",
              (P * 29) | 0,
              d,
              s,
              m - 0.08,
              0.5 + t() * 0.7,
              0.12,
              0.2 + t() * 0.04,
              0.34,
              0.36,
            );
            continue;
          }
          if (P < 0.215 * S && t() < 0.3 + N) {
            I(d, s, 0.6 + t() * 1.6);
            continue;
          }
          continue;
        }
        if (U < 0.85 && pt < 420 && P < 0.045 * S) {
          G(d, s, m, dt, 0.9 + t() * 0.8);
          continue;
        }
        let Ht = o.h[V - 1],
          kt = o.h[V + 1],
          yt = o.h[V - r],
          X = o.h[V + r],
          Rt = J - (Ht + kt + yt + X) * 0.25;
        if ((J > 55 && Rt > 1.35) || (J > 75 && st > 0.58)) {
          P < 0.04 * S && I(d, s, 0.6 + t() * 1.6, 1);
          continue;
        }
        if (J > 180 + wt * 70) {
          let Q = at(1 - (J - 180) / 280, 0.08, 1) * et(0.72, 0.25, st);
          P < 0.18 * S * Q
            ? v(
                "pine",
                (P * 11) | 0,
                d,
                s,
                m - 0.15,
                0.68 + t() * 0.68,
                0.05,
                0.29 + t() * 0.03,
                0.32,
                0.28 + t() * 0.08,
              )
            : P < 0.23 * S * Q
              ? v(
                  "shrub",
                  (P * 23) | 0,
                  d,
                  s,
                  m - 0.08,
                  0.5 + t() * 0.6,
                  0.15,
                  0.22,
                  0.26,
                  0.32,
                )
              : P < 0.26 * S && I(d, s, 0.6 + t() * 1.8, 1);
          continue;
        }
        if (ft > 0.48 && J < 52 && st < 0.22 && St < 0.72) {
          P < 0.028 * S * Vt && m > 1.8
            ? v(
                "broadleaf",
                (P * 59) | 0,
                d,
                s,
                m - 0.25,
                0.72 + t() * 0.62,
                0.05,
                0.26 + t() * 0.03,
                0.35 + t() * 0.15,
                0.34 + t() * 0.12,
              )
            : P < 0.075 * S
              ? v(
                  "shrub",
                  (P * 29) | 0,
                  d,
                  s,
                  m - 0.08,
                  0.55 + t() * 0.75,
                  0.1,
                  0.25,
                  0.36,
                  0.38,
                )
              : P < 0.13 * S
                ? v(
                    "fern",
                    (P * 31) | 0,
                    d,
                    s,
                    m - 0.04,
                    0.65 + t() * 0.55,
                    0.1,
                    0.26,
                    0.38,
                    0.38,
                  )
                : P < 0.138 * S + 0.012 * N && I(d, s, 0.5 + t() * 1.4, 1);
          continue;
        }
        let Mt = (0.48 + 0.32 * wt) * S * et(0.95, 0.2, st) * Vt,
          ht = at(et(38, 155, J) * 0.58 + et(0.22, 0.52, st) * 0.28, 0, 0.78);
        if (P < Mt && m > 1.2) {
          let Q = 0.68 + Math.pow(t(), 0.85) * 0.78;
          t() < ht
            ? v(
                "pine",
                (P * 37) | 0,
                d,
                s,
                m - 0.18,
                Q * 0.95,
                0.05,
                0.28 + t() * 0.03,
                0.3 + t() * 0.12,
                0.26 + t() * 0.12,
              )
            : v(
                "broadleaf",
                (P * 59) | 0,
                d,
                s,
                m - 0.25,
                Q,
                0.06,
                0.25 + t() * 0.04,
                0.3 + t() * 0.2,
                0.29 + t() * 0.16,
              );
        } else if (P < Mt + 0.08 * S)
          v(
            "shrub",
            (P * 29) | 0,
            d,
            s,
            m - 0.08,
            0.6 + t() * 0.9,
            0.12,
            0.24,
            0.32,
            0.34,
          );
        else if (P < Mt + 0.2 * S)
          v(
            "fern",
            (P * 31) | 0,
            d,
            s,
            m - 0.04,
            0.7 + t() * 0.6,
            0.1,
            0.26,
            0.36,
            0.36,
          );
        else if (P < Mt + 0.22 * S) {
          let Q = 0.12 + 0.05 * t();
          b(
            "log",
            (P * 7) | 0,
            d,
            s,
            m + 0.02,
            0.7 + t() * 0.6,
            0.8 + t() * 0.3,
            0.7 + t() * 0.6,
            t() * y,
            (t() - 0.5) * 0.12,
            (t() - 0.5) * 0.12,
            Q * 1.3,
            Q,
            Q * 0.75,
          );
        } else P < Mt + 0.24 * S && I(d, s, 0.5 + t() * 1.5, 1);
      }
    }
    (q & 31) === 0 && (yield { label: "Growing the forest", p: q / r });
  }
  let L = At(o.seed ^ 1120684009),
    Z = 8.5;
  for (let q = -f + 15; q < f - 15; q += Z) {
    for (let K = -f + 15; K < f - 15; K += Z) {
      let V = K + (L() - 0.5) * Z * 0.85,
        Y = q + (L() - 0.5) * Z * 0.85,
        J = nn(o, V, Y);
      if (J < 0.2) continue;
      let tt = ye(o, o.swamp, V, Y),
        ct = en(o, V, Y),
        st = be(o, V, Y, 0.7),
        nt = st - ye(o, o.nearLevel, V, Y);
      if (
        nt < -1.25 ||
        nt > 24 ||
        Math.hypot(
          Yt(o, V + 3, Y) - Yt(o, V - 3, Y),
          Yt(o, V, Y + 3) - Yt(o, V, Y - 3),
        ) /
          6 >
          0.8
      )
        continue;
      let ft = 0.5 + 0.5 * E.fbm(V * 0.012, Y * 0.012, 3),
        dt = L();
      if (tt > 0.28 && nt < 2.8) {
        let j = ct < 175;
        dt < (0.28 + ft * 0.5) * tt
          ? j && L() < 0.65
            ? v(
                "mangrove",
                L() * 6,
                V,
                Y,
                st - 0.17,
                0.85 + L() * 0.95,
                0.04,
                0.23 + L() * 0.025,
                0.26,
                0.56,
              )
            : v(
                "treefern",
                L() * 8,
                V,
                Y,
                st - 0.15,
                0.82 + L() * 0.95,
                0.04,
                0.23 + L() * 0.03,
                0.34,
                0.52,
              )
          : nt > -0.6 && nt < 1.4 && dt < 0.56
            ? v(
                "calamites",
                L() * 6,
                V,
                Y,
                st - 0.06,
                0.9 + L() * 0.75,
                0.05,
                0.23,
                0.36,
                0.44,
              )
            : nt > 0.12 && dt < 0.76
              ? v(
                  "shrub",
                  L() * 6,
                  V,
                  Y,
                  st - 0.13,
                  0.9 + L() * 0.75,
                  0.07,
                  0.23,
                  0.3,
                  0.52,
                )
              : nt > -0.9 &&
                nt < 0.8 &&
                dt < 0.82 &&
                b(
                  "snag",
                  (L() * 8) | 0,
                  V,
                  Y,
                  st - 0.2,
                  0.85 + L() * 0.5,
                  0.85 + L() * 0.55,
                  0.85 + L() * 0.5,
                  L() * y,
                  (L() - 0.5) * 0.15,
                  (L() - 0.5) * 0.15,
                  0.82,
                  0.8,
                  0.74,
                );
      } else
        nt > 1.1 && dt < J * (0.22 + ft * 0.36)
          ? L() < 0.28
            ? v(
                "treefern",
                L() * 8,
                V,
                Y,
                st - 0.2,
                0.75 + L() * 0.75,
                0.035,
                0.23 + L() * 0.025,
                0.32,
                0.5,
              )
            : v(
                "broadleaf",
                L() * 8,
                V,
                Y,
                st - 0.24,
                0.7 + L() * 0.8,
                0.035,
                0.23 + L() * 0.025,
                0.25,
                0.57,
              )
          : nt > 0.2 &&
            dt < J * 0.7 &&
            v(
              "shrub",
              L() * 6,
              V,
              Y,
              st - 0.12,
              0.95 + L() * 0.8,
              0.06,
              0.24,
              0.28,
              0.56,
            );
    }
    (Math.floor((q + f) / Z) & 15) === 0 &&
      (yield { label: "Growing the river corridors", p: 1 });
  }
  return { defs: e, out: l };
}
export { Bn };
