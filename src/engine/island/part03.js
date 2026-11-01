// island.js - part 3/21 (statements 38-40 of the original module).
import { ne, nt, re, ve, we } from "./part01.js";
import { Ge, ya } from "./part02.js";

function Xn(o) {
  let {
      N: e,
      cell: t,
      half: r,
      h: s,
      ocean: c,
      noise: a,
      lakeId: n,
      xOf: i,
      zOf: m,
      idxAt: h,
      net: l,
      basins: u,
      bed: d,
      wet: p,
      flowX: x,
      flowZ: f,
      sed: v,
      bankD: b,
      body: g,
      navMask: M,
      floorH: w,
      floorW: E,
    } = o,
    k = e * e;
  for (let R of l.oxbows)
    for (let H = 0; H + 1 < R.pts.length / 2; H++) {
      let C = R.pts[H * 2],
        W = R.pts[H * 2 + 1],
        T = R.hw + 4,
        P = Math.max(1, Math.floor((C - T + r) / t)),
        L = Math.min(e - 2, Math.ceil((C + T + r) / t)),
        z = Math.max(1, Math.floor((W - T + r) / t)),
        D = Math.min(e - 2, Math.ceil((W + T + r) / t));
      for (let q = z; q <= D; q++)
        for (let N = P; N <= L; N++) {
          let V = q * e + N;
          if (c[V] || n[V] >= 0) continue;
          let G = Math.hypot(i(V) - C, m(V) - W);
          G > R.hw ||
            ((d[V] = ya(d[V], 1.1 * (1 - (G / R.hw) ** 2) + 0.2, 0.8)),
            (p[V] = 1),
            (v[V] = Math.max(v[V], 0.8)),
            g[V] === Ge.LAND && (g[V] = Ge.SWAMP));
        }
    }
  for (let R = 0; R < k; R++)
    if (!c[R]) {
      if (E[R] > 0.001 && d[R] <= 0) {
        let H = ne(0, 1, E[R]);
        s[R] = ve(s[R], Math.min(s[R], w[R]), H * 0.92);
      }
      (d[R] > 0 && ((s[R] = Math.min(s[R], we.datum - d[R])), (p[R] = 1)),
        n[R] >= 0 && s[R] < we.datum && ((p[R] = 1), (g[R] = Ge.LAKE)));
    }
  for (let R of l.reaches) {
    if (R.parent >= 0) continue;
    let H = R.hw.length,
      C = R.pts[(H - 1) * 2],
      W = R.pts[(H - 1) * 2 + 1],
      T = Math.max(0, H - 4),
      P = C - R.pts[T * 2],
      L = W - R.pts[T * 2 + 1],
      z = Math.hypot(P, L) || 1;
    ((P /= z), (L /= z));
    let D = Math.max(nt.halfWidth + 3, R.hw[H - 1] * 0.45);
    for (let q = 0; q < 700; q += 5) {
      let N = C + P * q,
        V = W + L * q,
        G = h(N, V);
      if (G < 0 || (q > 60 && c[G] && s[G] < -3)) break;
      let U = Math.ceil(D / t) + 1,
        K = Math.round((N + r) / t - 0.5),
        X = Math.round((V + r) / t - 0.5);
      for (let J = -U; J <= U; J++)
        for (let se = -U; se <= U; se++) {
          let te = K + se,
            me = X + J;
          if (te < 1 || me < 1 || te >= e - 1 || me >= e - 1) continue;
          let $ = me * e + te;
          if (!c[$]) continue;
          let Z = Math.hypot(i($) - N, m($) - V) / D;
          if (Z > 1.6) continue;
          let j = -(nt.depth + 0.7) * (1 - ne(0.6, 1.6, Z)) - 0.05;
          (j < s[$] && (s[$] = j), Z < 0.75 && (M[$] = 1));
        }
    }
  }
  {
    let R = new Float32Array(k);
    for (let H = 0; H < 4; H++) {
      R.set(s);
      for (let C = 1; C < e - 1; C++)
        for (let W = 1; W < e - 1; W++) {
          let T = C * e + W;
          if (!p[T] || c[T] || n[T] >= 0) continue;
          let P = s[T] * 2,
            L = 2;
          for (let D of [T - 1, T + 1, T - e, T + e])
            p[D] && !c[D] && n[D] < 0 && ((P += s[D]), L++);
          let z = Math.min(P / L, -0.2);
          (M[T] && (z = Math.min(z, -(nt.depth + 0.05))), (R[T] = z));
        }
      s.set(R);
    }
  }
  for (let R = 0; R < 10; R++) {
    let H = (R & 1) === 1;
    for (let C = 1; C < e - 1; C++) {
      let W = H ? e - 1 - C : C;
      for (let T = 1; T < e - 1; T++) {
        let P = W * e + (H ? e - 1 - T : T);
        if (!(!p[P] || c[P] || n[P] >= 0))
          for (let L = 0; L < 8; L++) {
            let z =
              P +
              (L < 4
                ? [1, -1, e, -e][L]
                : [e + 1, e - 1, -e + 1, -e - 1][L - 4]);
            if (!p[z] || c[z] || n[z] >= 0) continue;
            let D = s[z] + 0.28 * t * (L < 4 ? 1 : Math.SQRT2);
            s[P] > D && (s[P] = D);
          }
      }
    }
  }
  for (let R of u) {
    let H = R.r,
      C = H * 3,
      W = Math.max(1, Math.floor((R.x - C + r) / t)),
      T = Math.min(e - 2, Math.ceil((R.x + C + r) / t)),
      P = Math.max(1, Math.floor((R.z - C + r) / t)),
      L = Math.min(e - 2, Math.ceil((R.z + C + r) / t));
    for (let z = P; z <= L; z++)
      for (let D = W; D <= T; D++) {
        let q = z * e + D;
        if (c[q] || p[q] || n[q] >= 0) continue;
        let N = Math.hypot(i(q) - R.x, m(q) - R.z) / H;
        if (N < 1.05 || N > 2.9) continue;
        let V = ne(6, 26, b[q]),
          G =
            (26 + 10 * a.fbm(i(q) / 160, m(q) / 160, 2)) *
            ne(1.08, 1.7, N) *
            (1 - ne(2.3, 2.9, N)) *
            V;
        G > s[q] && (s[q] = ve(s[q], G, 0.9));
      }
  }
  for (let R = 0; R < k; R++)
    c[R] ||
      p[R] ||
      (s[R] < we.datum &&
        ((p[R] = 1), (g[R] = Ge.SWAMP), (v[R] = Math.max(v[R], 0.6))));
  {
    let R = new Float32Array(k),
      H = new Float32Array(k),
      C = new Float32Array(k);
    for (let W = 0; W < 4; W++) {
      for (let T = 1; T < e - 1; T++)
        for (let P = 1; P < e - 1; P++) {
          let L = T * e + P;
          if (
            ((R[L] = x[L]),
            (H[L] = f[L]),
            (C[L] = v[L]),
            !p[L] || n[L] >= 0 || c[L])
          )
            continue;
          let z = x[L] * 2,
            D = f[L] * 2,
            q = v[L] * 2,
            N = 2;
          for (let U of [L - 1, L + 1, L - e, L + e])
            !p[U] ||
              c[U] ||
              n[U] >= 0 ||
              ((z += x[U]), (D += f[U]), (q += v[U]), N++);
          let V = Math.hypot(x[L], f[L]),
            G = Math.hypot(z, D) || 1;
          ((R[L] = (z / G) * V), (H[L] = (D / G) * V), (C[L] = q / N));
        }
      (x.set(R), f.set(H), v.set(C));
    }
  }
}
function Qn(o) {
  let {
      N: e,
      cell: t,
      isHome: r,
      h: s,
      cdist: c,
      ocean: a,
      noise: n,
      lakeId: i,
      xOf: m,
      zOf: h,
      name: l,
      net: u,
      basins: d,
      lakes: p,
      wet: x,
      flowX: f,
      flowZ: v,
      sed: b,
      bankD: g,
      body: M,
      navMask: w,
    } = o,
    E = e * e,
    k = d.map((z) => {
      let D = z.reach,
        q = z.node;
      for (
        ;
        q > 0 &&
        Math.hypot(D.pts[q * 2] - z.x, D.pts[q * 2 + 1] - z.z) < z.r * 0.92;
      )
        q--;
      let N = Math.max(0, q - 2),
        V = D.pts[q * 2] - D.pts[N * 2],
        G = D.pts[q * 2 + 1] - D.pts[N * 2 + 1],
        U = Math.hypot(V, G) || 1;
      return {
        x: D.pts[q * 2],
        z: D.pts[q * 2 + 1],
        dx: V / U,
        dz: G / U,
        k: q,
      };
    }),
    R = (z, D, q) => {
      let N = 1e18,
        V = z.hw[0];
      for (let G = 0; G < z.hw.length; G++) {
        let U = (z.pts[G * 2] - D) ** 2 + (z.pts[G * 2 + 1] - q) ** 2;
        U < N && ((N = U), (V = z.hw[G]));
      }
      return { d: Math.sqrt(N), w: V };
    },
    H = new Float64Array(p.length);
  for (let z = 0; z < E; z++) {
    let D = i[z];
    if (D < 0 || !x[z]) continue;
    {
      let X = d[D],
        J = k[D],
        se = m(z),
        te = h(z),
        me = se - J.x,
        $ = te - J.z,
        Z = Math.hypot(me, $),
        j = (me * J.dx + $ * J.dz) / Math.max(Z, 1),
        S = Math.exp(-Z / (X.r * 0.42)) * ne(-0.35, 0.4, j);
      if (S > 0.02) {
        let y = Math.atan2($, me) - Math.atan2(J.dz, J.dx),
          A = Math.pow(
            Math.abs(Math.sin(y * 3.2 + n.fbm(se / 70, te / 70, 2) * 2.2)),
            3,
          ),
          B = R(X.reach, se, te),
          I = 1 - ne(B.w * 0.7, B.w * 1.3, B.d),
          O = -(0.45 + 0.6 * (1 - S) + 1.5 * A * S),
          _ = Math.min(O, -(nt.depth + 0.6) * I),
          ae = ne(0.08, 0.6, S) * 0.9;
        ((s[z] = Math.min(-0.2, ve(s[z], Math.max(s[z], _), ae))),
          I > 0.5 && (s[z] = Math.min(s[z], -(nt.depth + 0.6))));
      }
      {
        let y = R(X.reach, se, te);
        y.d < Math.max(y.w * 0.62, nt.halfWidth + 1.5) &&
          ((s[z] = Math.min(s[z], -(nt.depth + 0.6))), (w[z] = 1));
      }
      let F = Math.exp(-Z / (X.r * 0.55)) * ne(-0.5, 0.3, j);
      ((b[z] = re(0.07 + 0.4 * F, 0, 1)),
        (f[z] += J.dx * 0.32 * F),
        (v[z] += J.dz * 0.32 * F));
    }
    let q = we.datum - s[z];
    if (q <= 0) continue;
    ((M[z] = Ge.LAKE),
      (p[D].area += t * t),
      (p[D].maxDepth = Math.max(p[D].maxDepth, q)),
      (H[D] += q * t * t),
      q >= nt.depth && (w[z] = 1));
    let N = d[D],
      V = N.reach.pts[(N.node + 1) * 2] - m(z),
      G = N.reach.pts[(N.node + 1) * 2 + 1] - h(z),
      U = Math.hypot(V, G) || 1,
      K = 0.14 * Math.exp(-U / 150);
    ((f[z] += (V / U) * K), (v[z] += (G / U) * K));
  }
  p.forEach((z, D) => {
    z.meanDepth = H[D] / Math.max(z.area, 1);
  });
  let C = [],
    W = new Map(),
    T = [...u.reaches].sort((z, D) => D.length - z.length);
  for (let z of T) {
    let D =
      z.kind === "creek"
        ? "Creek"
        : z.kind === "distributary"
          ? "Channel"
          : z.kind === "main" || z.kind === "secondary"
            ? "River"
            : "Brook";
    W.set(z.id, `${l()} ${D}`);
  }
  for (let z of u.reaches) {
    let D = z.hw.length,
      q = d.findIndex((V) => V.reach.id === z.id),
      N = z.navigable || z.kind === "main" || z.kind === "distributary";
    (C.push({
      name: W.get(z.id),
      pts: z.pts.slice(),
      levels: new Array(D).fill(we.datum),
      hw: z.hw.slice(),
      speeds: z.speed.slice(),
      depths: z.depth.slice(),
      foam: new Array(D).fill(0),
      sed: z.sed.slice(),
      order: z.strahler,
      q: z.q.slice(),
      joinAngle: z.joinAngle,
      navigable: N,
      tidal: z.tidal,
      kind:
        z.kind === "distributary"
          ? "secondary"
          : z.kind === "creek"
            ? "tributary"
            : z.kind,
      bodyKind:
        z.kind === "creek" ? Ge.CREEK : z.parent < 0 ? Ge.ESTUARY : Ge.RIVER,
      outlet: z.parent >= 0 ? W.get(z.parent) : "Sea",
      length: z.length,
      maxDepth: Math.max(...z.depth),
      cells: z.cells.slice(),
    }),
      q >= 0 && (p[q].outlet = W.get(z.id)));
  }
  for (let z of d) z.lake.outlet || (z.lake.outlet = W.get(z.reach.id));
  let P = new Float32Array(E),
    L = [];
  {
    for (let N = 0; N < E; N++) {
      if (a[N]) continue;
      let V = Math.exp(-g[N] / 85),
        G = 1 - ne(1.2, 7.5, Math.max(0, s[N] - we.datum)),
        U = 1 - ne(500, 2100, c[N]),
        K = 0.55 + 0.45 * ne(-0.2, 0.25, n.fbm(m(N) / 240, h(N) / 240, 3));
      ((P[N] = re(V * G * (0.35 + 0.65 * U) * K, 0, 1)),
        x[N] &&
          P[N] > 0.45 &&
          M[N] === Ge.SWAMP &&
          (b[N] = Math.max(b[N], 0.74)));
    }
    let z = new Uint8Array(E),
      D = [],
      q = [];
    for (let N = 0; N < E; N++) {
      if (z[N] || P[N] < 0.45 || a[N]) continue;
      ((D.length = 0), D.push(N), (z[N] = 1));
      let V = 0,
        G = 0,
        U = 0,
        K = 0;
      for (; D.length;) {
        let X = D.pop();
        ((V += m(X)),
          (G += h(X)),
          U++,
          x[X] && (K = Math.max(K, we.datum - s[X])));
        let J = X % e,
          se = (X / e) | 0;
        for (let [te, me] of [
          [1, 0],
          [-1, 0],
          [0, 1],
          [0, -1],
        ]) {
          let $ = J + te,
            Z = se + me;
          if ($ < 0 || Z < 0 || $ >= e || Z >= e) continue;
          let j = Z * e + $;
          z[j] || a[j] || P[j] < 0.45 || ((z[j] = 1), D.push(j));
        }
      }
      U * t * t > 24e3 &&
        q.push({ cx: V / U, cz: G / U, area: U * t * t, depth: K });
    }
    q.sort((N, V) => V.area - N.area);
    for (let N of q.slice(0, r ? 3 : 2))
      L.push({
        name: `${l()} Marsh`,
        x: N.cx,
        z: N.cz,
        r: Math.sqrt(N.area / Math.PI),
        level: we.datum,
        area: N.area,
        maxDepth: Math.min(N.depth, 3.4),
        meanDepth: Math.min(N.depth * 0.5, 1.6),
        outlet: C[0]?.name ?? "Sea",
      });
  }
  return { rivers: C, marshes: L, swamp: P };
}
function Zn(o, e) {
  let {
      N: t,
      cell: r,
      ocean: s,
      wet: c,
      flowX: a,
      flowZ: n,
      sed: i,
      body: m,
    } = o,
    h = t * t,
    l = new Float32Array(h),
    u = new Float32Array(h),
    d = new Float32Array(h),
    p = new Float32Array(h),
    x = new Float32Array(h);
  for (let v = 0; v < h; v++)
    (c[v] && !s[v] && (d[v] = 1), (x[v] = c[v] && !s[v] ? 0 : 1e9));
  let f = (v, b, g) => {
    let M = x[b] + g;
    M < x[v] && (x[v] = M);
  };
  for (let v = 1; v < t - 1; v++)
    for (let b = 1; b < t - 1; b++) {
      let g = v * t + b;
      (f(g, g - 1, r),
        f(g, g - t, r),
        f(g, g - t - 1, r * Math.SQRT2),
        f(g, g - t + 1, r * Math.SQRT2));
    }
  for (let v = t - 2; v > 0; v--)
    for (let b = t - 2; b > 0; b--) {
      let g = v * t + b;
      (f(g, g + 1, r),
        f(g, g + t, r),
        f(g, g + t + 1, r * Math.SQRT2),
        f(g, g + t - 1, r * Math.SQRT2));
    }
  for (let v = 0; v < h; v++)
    ((p[v] = Math.max(Math.exp(-x[v] / 80), e[v] * 0.85)),
      s[v]
        ? ((d[v] = re(Math.exp(-x[v] / 120) * 0.92, 0, 0.98)),
          (p[v] = 0),
          (a[v] = n[v] = 0),
          (m[v] = Ge.SEA),
          (i[v] = Math.max(i[v] * 0, re(Math.exp(-x[v] / 220) * 0.75, 0, 1))))
        : c[v] || (m[v] = Ge.LAND));
  {
    let v = new Float32Array(h);
    for (let b = 0; b < 8; b++) {
      v.set(i);
      for (let g = 1; g < t - 1; g++)
        for (let M = 1; M < t - 1; M++) {
          let w = g * t + M;
          if (!c[w] || s[w]) continue;
          let E = i[w] * 4,
            k = 4;
          for (let R of [w - 1, w + 1, w - t, w + t])
            c[R] && !s[R] && ((E += i[R] * 2), (k += 2));
          for (let R of [w - t - 1, w - t + 1, w + t - 1, w + t + 1])
            c[R] && !s[R] && ((E += i[R]), (k += 1));
          v[w] = E / k;
        }
      i.set(v);
    }
  }
  {
    let v = new Float32Array(h),
      b = new Float32Array(h);
    for (let g = 0; g < 8; g++) {
      (v.set(a), b.set(n));
      for (let M = 1; M < t - 1; M++)
        for (let w = 1; w < t - 1; w++) {
          let E = M * t + w;
          if (!s[E] || d[E] < 0.15) continue;
          let k = 0,
            R = 0,
            H = 0;
          for (let C of [E - 1, E + 1, E - t, E + t])
            ((k += a[C]), (R += n[C]), H++);
          ((v[E] = (k / H) * 0.9), (b[E] = (R / H) * 0.9));
        }
      (a.set(v), n.set(b));
    }
  }
  return { level: l, nearLevel: u, inl: d, fresh: p };
}
export { Qn, Xn, Zn };
