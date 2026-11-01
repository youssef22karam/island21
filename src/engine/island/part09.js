// island.js - part 9/21 (statements 111-111 of the original module).
import * as Gt from "three";
import { Ht, Ie, ne, re } from "./part01.js";
import { $e, Fo, Vt, Xo, Xt, ar, ho, no } from "./part05.js";
import { ta } from "./part08.js";

function* wr(o, e, t = ta()) {
  let { N: r, cell: s, half: c } = o,
    a = Ie(o.seed ^ 1542469173),
    n = {};
  for (let N of Object.keys(t))
    n[N] = t[N].map(() => ({ matrices: [], colors: [] }));
  let [i, m] = ho(o.seed),
    h = new Gt.Matrix4(),
    l = new Gt.Quaternion(),
    u = new Gt.Euler(),
    d = new Gt.Vector3(),
    p = new Gt.Vector3(),
    x = new Gt.Color(),
    f = Math.PI * 2,
    v = (N, V, G, U, K, X, J, se, te, me, $, Z, j, S) => {
      (u.set(me, te, $),
        l.setFromEuler(u),
        d.set(G, K, U),
        p.set(X, J, se),
        h.compose(d, l, p));
      let F = n[N][Math.abs(V | 0) % n[N].length];
      for (let y = 0; y < 16; y++) F.matrices.push(h.elements[y]);
      F.colors.push(Z, j, S);
    },
    b = (N, V, G, U, K, X, J, se, te, me) => {
      (x.setHSL(se, te, me),
        v(
          N,
          V,
          G,
          U,
          K,
          X,
          X * (0.85 + a() * 0.3),
          X,
          a() * f,
          J * (a() - 0.5),
          J * (a() - 0.5),
          x.r,
          x.g,
          x.b,
        ));
    },
    g = new Ht(o.seed ^ 523124044),
    M = new Ht(o.seed ^ 2056368835),
    w = new Ht(o.seed ^ 739982445),
    E = (N, V) => ne(0.08, 0.5, w.fbm(N * 0.0024 + 7.7, V * 0.0024 - 3.1, 3)),
    k = 0.15 + 0.7 * a(),
    R = (N, V, G = !1) => {
      let U = (0.5 + 0.5 * w.fbm(N * 0.0017 - 11.3, V * 0.0017 + 5.9, 2)) * k,
        K = a(),
        X,
        J,
        se;
      if (K < U) {
        let te = 0.13 + 0.07 * a();
        ((X = te), (J = te * 0.97), (se = te * 0.93));
      } else if (K < U + (1 - U) * 0.25) {
        let te = 0.42 + 0.12 * a();
        ((X = te * 1.04), (J = te), (se = te * 0.88));
      } else {
        let te = 0.27 + 0.11 * a();
        ((X = te * 1.07), (J = te), (se = te * 0.87));
      }
      return (G && ((X *= 0.8), (J *= 0.82), (se *= 0.82)), [X, J, se]);
    },
    H = (N, V, G, U) => {
      for (let K = 0; K < U; K++) {
        let X = a() * f,
          J = G * Math.sqrt(a()),
          se = N + Math.cos(X) * J,
          te = V + Math.sin(X) * J,
          me = $e(o, se, te, -40);
        if (me < 0.35) continue;
        let $ = 0.06 + Math.pow(a(), 2.2) * 0.32,
          Z = a(),
          j,
          S,
          F;
        if (Z < 0.12) {
          let y = 0.14 + 0.07 * a();
          ((j = y), (S = y), (F = y * 0.96));
        } else if (Z < 0.47) {
          let y = 0.52 + 0.14 * a();
          ((j = y), (S = y * 0.96), (F = y * 0.88));
        } else {
          let y = 0.32 + 0.14 * a();
          ((j = y * 1.08), (S = y), (F = y * 0.84));
        }
        v(
          "pebble",
          a() * 8,
          se,
          te,
          me - $ * 0.06,
          $,
          $ * (0.55 + a() * 0.5),
          $ * (0.7 + a() * 0.5),
          a() * f,
          (a() - 0.5) * 0.3,
          (a() - 0.5) * 0.3,
          j,
          S,
          F,
        );
      }
    },
    C = (N, V, G, U = 0.6) => {
      let K = 1 + ((a() * 5.5) | 0),
        [X, J, se] = R(N, V);
      for (let te = 0; te < K; te++) {
        let me = a() * f,
          $ = te === 0 ? 0 : G * (0.55 + a() * 1.5),
          Z = N + Math.cos(me) * $,
          j = V + Math.sin(me) * $,
          S = te === 0 ? G : G * (0.22 + a() * 0.55),
          F = Xt(o, Z, j, S * 0.45, -40);
        if (F < U) continue;
        let y = 0.88 + a() * 0.24;
        (v(
          a() < 0.3 ? "slab" : "rock",
          a() * 12,
          Z,
          j,
          F - S * 0.04,
          S * (0.9 + a() * 0.3),
          S * (0.8 + a() * 0.45),
          S * (0.9 + a() * 0.3),
          a() * f,
          (a() - 0.5) * 0.4,
          (a() - 0.5) * 0.4,
          X * y,
          J * y,
          se * y,
        ),
          a() < 0.7 && H(Z, j, S * 1.4 + 0.6, 2 + ((a() * 7) | 0)));
      }
    },
    W = (N, V, G, U) => {
      let K = U + Math.PI / 2 + (a() - 0.5) * 1.1,
        X = 0.45 + a() * 0.9,
        J = 0.5 + 0.12 * a();
      v(
        "driftwood",
        a() * 6,
        N,
        V,
        G - 0.05 * X,
        X,
        X * (0.8 + a() * 0.4),
        X,
        -K,
        (a() - 0.5) * 0.1,
        (a() - 0.5) * 0.1,
        J * 1.02,
        J,
        J * 0.93,
      );
    },
    T = (N, V, G, U) => {
      if (a() < 0.4) return;
      let K = N + Math.cos(G) * U * 0.85,
        X = V + Math.sin(G) * U * 0.85,
        J = 1 + ((a() * 4) | 0);
      for (let se = 0; se < J; se++) {
        let te = a() * f,
          me = 0.3 + a() * 2.4,
          $ = K + Math.cos(te) * me,
          Z = X + Math.sin(te) * me,
          j = $e(o, $, Z, -40);
        if (j < 0.6) continue;
        let S = a() < 0.25,
          F = 0.85 + a() * 0.35;
        if (S)
          v(
            "coconut",
            a() * 4,
            $,
            Z,
            j - 0.02,
            F,
            F,
            F,
            a() * f,
            (a() - 0.5) * 0.6,
            (a() - 0.5) * 0.6,
            0.16,
            0.2,
            0.06,
          );
        else {
          let y = 0.13 + 0.06 * a();
          v(
            "coconut",
            a() * 4,
            $,
            Z,
            j - 0.02,
            F,
            F,
            F,
            a() * f,
            (a() - 0.5) * 0.6,
            (a() - 0.5) * 0.6,
            y * 1.35,
            y,
            y * 0.6,
          );
        }
      }
    },
    P = (N, V, G, U, K) => {
      let X = (a() * t.palm.length) | 0,
        J = t.palm[X].lean ?? { a: 0, bend: 0 },
        se = U + (a() - 0.5) * 1.2;
      (x.setHSL(0.23 + a() * 0.03, 0.4, 0.38 + a() * 0.06),
        v(
          "palm",
          X,
          N,
          V,
          G - 0.18,
          K,
          K * (0.85 + a() * 0.3),
          K,
          J.a - se,
          0.05 * (a() - 0.5),
          0.05 * (a() - 0.5),
          x.r,
          x.g,
          x.b,
        ),
        T(N, V, se, J.bend * K));
    },
    L = e >= 1 ? 1 : 2,
    z = e;
  for (let N = 1; N < r - 1; N += L) {
    for (let V = 1; V < r - 1; V += L) {
      let G = N * r + V,
        U = o.wet[G] ? 1 : o.type[G],
        K = o.h[G],
        X = o.h[G + 1] - o.h[G - 1],
        J = o.h[G + r] - o.h[G - r],
        se = Math.hypot(X, J) / (2 * s);
      if (U !== 0 && o.inl[G] > 0.5) {
        let S = (V + 0.5) * s - c + (a() - 0.5) * s * L,
          F = (N + 0.5) * s - c + (a() - 0.5) * s * L,
          y = $e(o, S, F, K),
          A = o.wet[G] ? o.nearLevel[G] : 0,
          B = A - y,
          I = o.tau[G],
          O = Math.hypot(o.flowX[G], o.flowZ[G]),
          _ = o.swamp[G],
          ae = o.cdist[G],
          le = a(),
          Y = 0.5 + 0.5 * M.fbm(S * 0.02 + 3.3, F * 0.02 - 8.1, 2),
          ee = ae < 165;
        if (_ > 0.34 && B < 1.25 && I < 34 && le < 0.25 * _ * z)
          ee || a() < 0.32
            ? b(
                "mangrove",
                a() * 6,
                S,
                F,
                y - 0.15,
                0.8 + a() * 0.65,
                0.06,
                0.25,
                0.36,
                0.33,
              )
            : b(
                "treefern",
                a() * 8,
                S,
                F,
                y - 0.12,
                0.78 + a() * 0.68,
                0.05,
                0.24 + a() * 0.03,
                0.38,
                0.42,
              );
        else if (
          _ > 0.28 &&
          B < 0.72 &&
          I < 24 &&
          O < 0.38 &&
          le < 0.34 * _ * z * Y
        )
          b(
            "calamites",
            a() * 6,
            S,
            F,
            y - 0.05,
            0.85 + a() * 0.55,
            0.05,
            0.23,
            0.4,
            0.38,
          );
        else if (
          B < 0.85 &&
          I < 22 &&
          O < 0.5 &&
          le < (0.42 + 0.32 * _) * z * Y
        )
          b(
            "reed",
            a() * 6,
            S,
            F,
            y - 0.05,
            0.85 + a() * 0.55,
            0.06,
            0.22,
            0.38,
            0.36,
          );
        else if (
          O < 0.15 &&
          B > 0.22 &&
          B < 2.8 &&
          I > 2 &&
          I < 85 &&
          le < (0.32 + 0.22 * _) * z * ne(0.42, 0.68, Y)
        )
          v(
            "lily",
            a() * 6,
            S,
            F,
            A,
            0.85 + a() * 0.75,
            1,
            0.85 + a() * 0.75,
            a() * f,
            0,
            0,
            1,
            1,
            1,
          );
        else if (B < 1.15 && O < 0.24 && le < 0.24 * z * Y)
          b(
            "sedge",
            a() * 6,
            S,
            F,
            y - 0.03,
            0.75 + a() * 0.5,
            0.07,
            0.24,
            0.3,
            0.31,
          );
        else if (_ > 0.28 && B < 1.65 && le < 0.038 * z)
          v(
            "snag",
            a() * 8,
            S,
            F,
            y - 0.18,
            0.85 + a() * 0.6,
            0.85 + a() * 0.65,
            0.85 + a() * 0.6,
            a() * f,
            (a() - 0.5) * 0.22,
            (a() - 0.5) * 0.22,
            0.82,
            0.8,
            0.74,
          );
        else if (_ > 0.28 && B < 1.1 && le < 0.052 * z) {
          let ie = 0.18 + 0.06 * a();
          v(
            "log",
            a() * 6,
            S,
            F,
            A - 0.08,
            0.85 + a() * 0.65,
            0.85 + a() * 0.4,
            0.85 + a() * 0.65,
            a() * f,
            (a() - 0.5) * 0.08,
            (a() - 0.5) * 0.08,
            ie * 1.15,
            ie * 1.2,
            ie * 0.82,
          );
        } else if (O > 0.22 && B < 1.4) {
          if (le < 0.035 * z) {
            let ie = 0.6 + a() * 1.2,
              [he, Me, xe] = R(S, F, !0);
            v(
              "rock",
              a() * 12,
              S,
              F,
              y - 0.1,
              ie,
              ie * (0.6 + a() * 0.4),
              ie,
              a() * f,
              (a() - 0.5) * 0.3,
              (a() - 0.5) * 0.3,
              he,
              Me,
              xe,
            );
          } else if (le < 0.22 * z)
            for (let ie = 0; ie < 4; ie++) {
              let he = S + (a() - 0.5) * 8,
                Me = F + (a() - 0.5) * 8,
                xe = $e(o, he, Me, y),
                He = 0.2 + a() * a() * 0.5,
                Ae = 0.3 + 0.25 * a();
              v(
                "pebble",
                a() * 8,
                he,
                Me,
                xe - He * 0.08,
                He,
                He * 0.6,
                He * 0.8,
                a() * f,
                0,
                0,
                Ae * 1.05,
                Ae,
                Ae * 0.88,
              );
            }
        }
        continue;
      }
      if (U !== 0) {
        if (K > -1.9 && K < -0.12) {
          let S = (V + 0.5) * s - c + (a() - 0.5) * s * L,
            F = (N + 0.5) * s - c + (a() - 0.5) * s * L,
            y = E(S, F);
          if (a() < 0.05 * z * y * y) {
            let A = Xt(o, S, F, 0.8, K),
              B = 1 + ((a() * 3) | 0);
            for (let I = 0; I < B; I++) {
              let O = a() * f,
                _ = I ? 1.5 + a() * 3 : 0,
                ae = S + Math.cos(O) * _,
                le = F + Math.sin(O) * _,
                Y = Math.min(Xt(o, ae, le, 0.6, A), -0.05),
                ee = (-Y + 0.25 + a() * 0.8) * (I ? 0.7 : 1),
                ie = ee * (1.25 + a() * 0.6),
                [he, Me, xe] = R(ae, le, !0);
              v(
                a() < 0.35 ? "slab" : "rock",
                a() * 12,
                ae,
                le,
                Y - 0.08,
                ie,
                ee * 1.4,
                ie * (0.8 + a() * 0.4),
                a() * f,
                (a() - 0.5) * 0.3,
                (a() - 0.5) * 0.3,
                he,
                Me,
                xe,
              );
            }
          }
        }
        continue;
      }
      let te = o.fresh[G];
      if (K - o.nearLevel[G] <= (te > 0.3 ? 0.06 : 0.5)) continue;
      let me = o.cdist[G],
        $ = o.plain[G],
        Z = Math.atan2(-o.dirZ[G], -o.dirX[G]),
        j = 1 + ((a() * 2.99) | 0);
      for (let S = 0; S < j; S++) {
        let F = (V + 0.5) * s - c + (a() - 0.5) * s * L * 1.8,
          y = (N + 0.5) * s - c + (a() - 0.5) * s * L * 1.8,
          A = Xt(o, F, y, 0.55, K),
          B = no(o, F, y),
          I = Vt(o, o.swamp, F, y),
          O = A - Vt(o, o.nearLevel, F, y);
        if (O <= (B > 0.3 ? 0.06 : 0.5)) continue;
        let _ = a(),
          ae = Xo(o, F, y),
          le = Fo(F + i, y + m, A, ae, se, B),
          Y = le[0],
          ee = le[1],
          ie = E(F, y),
          he = 0.5 + 0.5 * g.fbm(F * 0.00105, y * 98e-5, 3),
          Me = 0.5 + 0.5 * M.fbm(F * 0.0062 + 11.3, y * 0.0057 - 4.1, 3),
          xe = g.fbm(F * 0.014 + 51.2, y * 0.013 - 27.6, 2),
          He = re(he * 0.72 + Me * 0.42 - 0.06, 0, 1),
          Ae = re(Me * 0.7 + he * 0.5, 0, 1),
          Ee = ne(-0.25, 0.05, xe) * 0.5 + 0.5;
        if (se > 1.05) {
          _ < 0.05 * z && C(F, y, 0.9 + a() * 2.6);
          continue;
        }
        if (se > 0.55 && _ < 0.02 * z * (0.4 + ie)) {
          C(F, y, 0.8 + a() * 2.2);
          continue;
        }
        if (I > 0.26 && O < 4.2 && se < 0.34) {
          let ce = me < 185;
          if (_ < 0.22 * I * z)
            ce || a() < 0.25
              ? b(
                  "mangrove",
                  a() * 6,
                  F,
                  y,
                  A - 0.2,
                  0.8 + a() * 0.75,
                  0.05,
                  0.25,
                  0.36,
                  0.34,
                )
              : b(
                  "treefern",
                  a() * 8,
                  F,
                  y,
                  A - 0.18,
                  0.78 + a() * 0.72,
                  0.04,
                  0.24 + a() * 0.03,
                  0.38,
                  0.42,
                );
          else if (O < 1.8 && _ < 0.36 * z)
            b(
              "calamites",
              a() * 6,
              F,
              y,
              A - 0.06,
              0.8 + a() * 0.65,
              0.05,
              0.23 + a() * 0.03,
              0.38,
              0.38,
            );
          else if (O < 1.5 && _ < 0.5 * z)
            b(
              "reed",
              a() * 6,
              F,
              y,
              A - 0.05,
              0.8 + a() * 0.55,
              0.07,
              0.21 + a() * 0.04,
              0.36,
              0.36,
            );
          else if (O < 2.1 && _ < 0.62 * z)
            b(
              "sedge",
              a() * 6,
              F,
              y,
              A - 0.04,
              0.8 + a() * 0.5,
              0.08,
              0.22,
              0.3,
              0.34,
            );
          else if (_ < 0.72 * z)
            b(
              "fern",
              (_ * 31) | 0,
              F,
              y,
              A - 0.04,
              0.7 + a() * 0.6,
              0.09,
              0.26,
              0.4,
              0.36,
            );
          else if (_ < 0.755 * z)
            v(
              "snag",
              a() * 8,
              F,
              y,
              A - 0.25,
              0.75 + a() * 0.55,
              0.75 + a() * 0.6,
              0.75 + a() * 0.55,
              a() * f,
              (a() - 0.5) * 0.18,
              (a() - 0.5) * 0.18,
              0.84,
              0.82,
              0.76,
            );
          else if (_ < 0.785 * z && O < 1.6) {
            let Fe = 0.16 + 0.06 * a();
            v(
              "log",
              a() * 6,
              F,
              y,
              A - 0.02,
              0.8 + a() * 0.6,
              0.85 + a() * 0.35,
              0.8 + a() * 0.6,
              a() * f,
              (a() - 0.5) * 0.14,
              (a() - 0.5) * 0.14,
              Fe * 1.2,
              Fe * 1.18,
              Fe * 0.82,
            );
          }
          continue;
        }
        if (B > 0.42 && Y > 0.25 && O < 9 && se < 0.45) {
          O > 1.3 && _ < 0.075 * z
            ? a() < 0.35
              ? b(
                  "treefern",
                  a() * 8,
                  F,
                  y,
                  A - 0.2,
                  0.75 + a() * 0.65,
                  0.04,
                  0.24 + a() * 0.03,
                  0.36,
                  0.4,
                )
              : b(
                  "broadleaf",
                  (_ * 59) | 0,
                  F,
                  y,
                  A - 0.25,
                  0.8 + a() * 0.65,
                  0.06,
                  0.25 + a() * 0.04,
                  0.38,
                  0.32 + a() * 0.1,
                )
            : O < 1.1 && _ < 0.32 * B * z
              ? b(
                  "calamites",
                  a() * 6,
                  F,
                  y,
                  A - 0.05,
                  0.75 + a() * 0.55,
                  0.06,
                  0.23,
                  0.38,
                  0.37,
                )
              : O < 1.1 && _ < 0.52 * B * z
                ? b(
                    "reed",
                    a() * 6,
                    F,
                    y,
                    A - 0.05,
                    0.8 + a() * 0.5,
                    0.08,
                    0.21,
                    0.4,
                    0.37,
                  )
                : O < 2.2 && _ < 0.62 * z
                  ? b(
                      "sedge",
                      a() * 6,
                      F,
                      y,
                      A - 0.04,
                      0.7 + a() * 0.45,
                      0.08,
                      0.23,
                      0.32,
                      0.34,
                    )
                  : O < 1.3 && I < 0.25 && _ < 0.68 * z
                    ? H(F, y, 2 + a() * 3, 5 + ((a() * 8) | 0))
                    : O < 1.6 && _ < 0.705 * z
                      ? W(F, y, A, Z)
                      : _ < 0.16 * z * ee
                        ? b(
                            "shrub",
                            (_ * 29) | 0,
                            F,
                            y,
                            A - 0.08,
                            0.6 + a() * 0.8,
                            0.12,
                            0.24,
                            0.36,
                            0.36,
                          )
                        : _ < 0.24 * z &&
                          b(
                            "fern",
                            (_ * 31) | 0,
                            F,
                            y,
                            A - 0.04,
                            0.65 + a() * 0.55,
                            0.1,
                            0.26,
                            0.38,
                            0.36,
                          );
          continue;
        }
        if (Y < 0.1) {
          if (_ < (0.032 * ie * ie + 0.0015) * z) {
            C(F, y, 0.8 + a() * a() * 3.4);
            continue;
          }
          if (_ < (0.045 * ie + 0.004) * z && A < 4.5) {
            H(F, y, 1.6 + a() * 2.6, 6 + ((a() * 16) | 0));
            continue;
          }
          let ce = ar(F + i, y + m);
          if (Math.abs(ae - ce) < 6 && _ < 0.15 * z) {
            W(F, y, $e(o, F, y), Z);
            continue;
          }
          Y > 0.025 &&
            ae > ce + 18 &&
            _ < 0.012 * z &&
            P(F, y, A, Z, 0.9 + a() * 0.7);
          continue;
        }
        if (Y < 0.62) {
          let ce = ne(0.45, 0.8, Ae);
          if (_ < (0.03 + 0.07 * ce) * z && ee > 0.15) {
            P(F, y, A, Z, 0.95 + a() * 0.8);
            continue;
          }
          if (_ < 0.2 * z * ee) {
            b(
              "shrub",
              (_ * 29) | 0,
              F,
              y,
              A - 0.08,
              0.5 + a() * 0.7,
              0.12,
              0.2 + a() * 0.04,
              0.34,
              0.36,
            );
            continue;
          }
          if (_ < 0.215 * z && a() < 0.3 + ie) {
            C(F, y, 0.6 + a() * 1.6);
            continue;
          }
          continue;
        }
        if (Y < 0.85 && me < 420 && _ < 0.045 * z) {
          P(F, y, A, Z, 0.9 + a() * 0.8);
          continue;
        }
        let We = o.h[G - 1],
          Ve = o.h[G + 1],
          Se = o.h[G - r],
          oe = o.h[G + r],
          Be = K - (We + Ve + Se + oe) * 0.25;
        if ((K > 55 && Be > 1.35) || (K > 75 && se > 0.58)) {
          _ < 0.04 * z && C(F, y, 0.6 + a() * 1.6, 1);
          continue;
        }
        if (K > 180 + He * 70) {
          let ce = re(1 - (K - 180) / 280, 0.08, 1) * ne(0.72, 0.25, se);
          _ < 0.18 * z * ce
            ? b(
                "pine",
                (_ * 11) | 0,
                F,
                y,
                A - 0.15,
                0.68 + a() * 0.68,
                0.05,
                0.29 + a() * 0.03,
                0.32,
                0.28 + a() * 0.08,
              )
            : _ < 0.23 * z * ce
              ? b(
                  "shrub",
                  (_ * 23) | 0,
                  F,
                  y,
                  A - 0.08,
                  0.5 + a() * 0.6,
                  0.15,
                  0.22,
                  0.26,
                  0.32,
                )
              : _ < 0.26 * z && C(F, y, 0.6 + a() * 1.8, 1);
          continue;
        }
        if ($ > 0.48 && K < 52 && se < 0.22 && Ae < 0.72) {
          _ < 0.028 * z * Ee && A > 1.8
            ? b(
                "broadleaf",
                (_ * 59) | 0,
                F,
                y,
                A - 0.25,
                0.72 + a() * 0.62,
                0.05,
                0.26 + a() * 0.03,
                0.35 + a() * 0.15,
                0.34 + a() * 0.12,
              )
            : _ < 0.075 * z
              ? b(
                  "shrub",
                  (_ * 29) | 0,
                  F,
                  y,
                  A - 0.08,
                  0.55 + a() * 0.75,
                  0.1,
                  0.25,
                  0.36,
                  0.38,
                )
              : _ < 0.13 * z
                ? b(
                    "fern",
                    (_ * 31) | 0,
                    F,
                    y,
                    A - 0.04,
                    0.65 + a() * 0.55,
                    0.1,
                    0.26,
                    0.38,
                    0.38,
                  )
                : _ < 0.138 * z + 0.012 * ie && C(F, y, 0.5 + a() * 1.4, 1);
          continue;
        }
        let ke = (0.48 + 0.32 * He) * z * ne(0.95, 0.2, se) * Ee,
          be = re(ne(38, 155, K) * 0.58 + ne(0.22, 0.52, se) * 0.28, 0, 0.78);
        if (_ < ke && A > 1.2) {
          let ce = 0.68 + Math.pow(a(), 0.85) * 0.78;
          a() < be
            ? b(
                "pine",
                (_ * 37) | 0,
                F,
                y,
                A - 0.18,
                ce * 0.95,
                0.05,
                0.28 + a() * 0.03,
                0.3 + a() * 0.12,
                0.26 + a() * 0.12,
              )
            : b(
                "broadleaf",
                (_ * 59) | 0,
                F,
                y,
                A - 0.25,
                ce,
                0.06,
                0.25 + a() * 0.04,
                0.3 + a() * 0.2,
                0.29 + a() * 0.16,
              );
        } else if (_ < ke + 0.08 * z)
          b(
            "shrub",
            (_ * 29) | 0,
            F,
            y,
            A - 0.08,
            0.6 + a() * 0.9,
            0.12,
            0.24,
            0.32,
            0.34,
          );
        else if (_ < ke + 0.2 * z)
          b(
            "fern",
            (_ * 31) | 0,
            F,
            y,
            A - 0.04,
            0.7 + a() * 0.6,
            0.1,
            0.26,
            0.36,
            0.36,
          );
        else if (_ < ke + 0.22 * z) {
          let ce = 0.12 + 0.05 * a();
          v(
            "log",
            (_ * 7) | 0,
            F,
            y,
            A + 0.02,
            0.7 + a() * 0.6,
            0.8 + a() * 0.3,
            0.7 + a() * 0.6,
            a() * f,
            (a() - 0.5) * 0.12,
            (a() - 0.5) * 0.12,
            ce * 1.3,
            ce,
            ce * 0.75,
          );
        } else _ < ke + 0.24 * z && C(F, y, 0.5 + a() * 1.5, 1);
      }
    }
    (N & 31) === 0 && (yield { label: "Growing the forest", p: N / r });
  }
  let D = Ie(o.seed ^ 1120684009),
    q = 8.5;
  for (let N = -c + 15; N < c - 15; N += q) {
    for (let V = -c + 15; V < c - 15; V += q) {
      let G = V + (D() - 0.5) * q * 0.85,
        U = N + (D() - 0.5) * q * 0.85,
        K = no(o, G, U);
      if (K < 0.2) continue;
      let X = Vt(o, o.swamp, G, U),
        J = Xo(o, G, U),
        se = Xt(o, G, U, 0.7),
        te = se - Vt(o, o.nearLevel, G, U);
      if (
        te < -1.25 ||
        te > 24 ||
        Math.hypot(
          $e(o, G + 3, U) - $e(o, G - 3, U),
          $e(o, G, U + 3) - $e(o, G, U - 3),
        ) /
          6 >
          0.8
      )
        continue;
      let $ = 0.5 + 0.5 * M.fbm(G * 0.012, U * 0.012, 3),
        Z = D();
      if (X > 0.28 && te < 2.8) {
        let j = J < 175;
        Z < (0.28 + $ * 0.5) * X
          ? j && D() < 0.65
            ? b(
                "mangrove",
                D() * 6,
                G,
                U,
                se - 0.17,
                0.85 + D() * 0.95,
                0.04,
                0.23 + D() * 0.025,
                0.26,
                0.56,
              )
            : b(
                "treefern",
                D() * 8,
                G,
                U,
                se - 0.15,
                0.82 + D() * 0.95,
                0.04,
                0.23 + D() * 0.03,
                0.34,
                0.52,
              )
          : te > -0.6 && te < 1.4 && Z < 0.56
            ? b(
                "calamites",
                D() * 6,
                G,
                U,
                se - 0.06,
                0.9 + D() * 0.75,
                0.05,
                0.23,
                0.36,
                0.44,
              )
            : te > 0.12 && Z < 0.76
              ? b(
                  "shrub",
                  D() * 6,
                  G,
                  U,
                  se - 0.13,
                  0.9 + D() * 0.75,
                  0.07,
                  0.23,
                  0.3,
                  0.52,
                )
              : te > -0.9 &&
                te < 0.8 &&
                Z < 0.82 &&
                v(
                  "snag",
                  (D() * 8) | 0,
                  G,
                  U,
                  se - 0.2,
                  0.85 + D() * 0.5,
                  0.85 + D() * 0.55,
                  0.85 + D() * 0.5,
                  D() * f,
                  (D() - 0.5) * 0.15,
                  (D() - 0.5) * 0.15,
                  0.82,
                  0.8,
                  0.74,
                );
      } else
        te > 1.1 && Z < K * (0.22 + $ * 0.36)
          ? D() < 0.28
            ? b(
                "treefern",
                D() * 8,
                G,
                U,
                se - 0.2,
                0.75 + D() * 0.75,
                0.035,
                0.23 + D() * 0.025,
                0.32,
                0.5,
              )
            : b(
                "broadleaf",
                D() * 8,
                G,
                U,
                se - 0.24,
                0.7 + D() * 0.8,
                0.035,
                0.23 + D() * 0.025,
                0.25,
                0.57,
              )
          : te > 0.2 &&
            Z < K * 0.7 &&
            b(
              "shrub",
              D() * 6,
              G,
              U,
              se - 0.12,
              0.95 + D() * 0.8,
              0.06,
              0.24,
              0.28,
              0.56,
            );
    }
    (Math.floor((N + c) / q) & 15) === 0 &&
      (yield { label: "Growing the river corridors", p: 1 });
  }
  return { defs: t, out: n };
}
export { wr };
