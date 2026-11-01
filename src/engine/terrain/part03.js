// terrain.worker.js - part 3/9 (statements 28-30 of the original module).
import { Ct, at, bt, et, it } from "./part01.js";
import { Pe, Wt } from "./part02.js";

function Mn(o) {
  let {
      N: n,
      cell: e,
      half: r,
      h: a,
      ocean: f,
      noise: t,
      lakeId: l,
      xOf: c,
      zOf: p,
      idxAt: h,
      net: i,
      basins: x,
      bed: M,
      wet: g,
      flowX: w,
      flowZ: y,
      sed: b,
      bankD: v,
      body: A,
      navMask: E,
      floorH: H,
      floorW: R,
    } = o,
    D = n * n;
  for (let z of i.oxbows)
    for (let T = 0; T + 1 < z.pts.length / 2; T++) {
      let I = z.pts[T * 2],
        B = z.pts[T * 2 + 1],
        W = z.hw + 4,
        G = Math.max(1, Math.floor((I - W + r) / e)),
        O = Math.min(n - 2, Math.ceil((I + W + r) / e)),
        S = Math.max(1, Math.floor((B - W + r) / e)),
        L = Math.min(n - 2, Math.ceil((B + W + r) / e));
      for (let Z = S; Z <= L; Z++)
        for (let q = G; q <= O; q++) {
          let K = Z * n + q;
          if (f[K] || l[K] >= 0) continue;
          let V = Math.hypot(c(K) - I, p(K) - B);
          V > z.hw ||
            ((M[K] = Pe(M[K], 1.1 * (1 - (V / z.hw) ** 2) + 0.2, 0.8)),
            (g[K] = 1),
            (b[K] = Math.max(b[K], 0.8)),
            A[K] === Wt.LAND && (A[K] = Wt.SWAMP));
        }
    }
  for (let z = 0; z < D; z++)
    if (!f[z]) {
      if (R[z] > 0.001 && M[z] <= 0) {
        let T = et(0, 1, R[z]);
        a[z] = bt(a[z], Math.min(a[z], H[z]), T * 0.92);
      }
      (M[z] > 0 && ((a[z] = Math.min(a[z], it.datum - M[z])), (g[z] = 1)),
        l[z] >= 0 && a[z] < it.datum && ((g[z] = 1), (A[z] = Wt.LAKE)));
    }
  for (let z of i.reaches) {
    if (z.parent >= 0) continue;
    let T = z.hw.length,
      I = z.pts[(T - 1) * 2],
      B = z.pts[(T - 1) * 2 + 1],
      W = Math.max(0, T - 4),
      G = I - z.pts[W * 2],
      O = B - z.pts[W * 2 + 1],
      S = Math.hypot(G, O) || 1;
    ((G /= S), (O /= S));
    let L = Math.max(Ct.halfWidth + 3, z.hw[T - 1] * 0.45);
    for (let Z = 0; Z < 700; Z += 5) {
      let q = I + G * Z,
        K = B + O * Z,
        V = h(q, K);
      if (V < 0 || (Z > 60 && f[V] && a[V] < -3)) break;
      let Y = Math.ceil(L / e) + 1,
        J = Math.round((q + r) / e - 0.5),
        tt = Math.round((K + r) / e - 0.5);
      for (let ct = -Y; ct <= Y; ct++)
        for (let st = -Y; st <= Y; st++) {
          let nt = J + st,
            pt = tt + ct;
          if (nt < 1 || pt < 1 || nt >= n - 1 || pt >= n - 1) continue;
          let ft = pt * n + nt;
          if (!f[ft]) continue;
          let dt = Math.hypot(c(ft) - q, p(ft) - K) / L;
          if (dt > 1.6) continue;
          let j = -(Ct.depth + 0.7) * (1 - et(0.6, 1.6, dt)) - 0.05;
          (j < a[ft] && (a[ft] = j), dt < 0.75 && (E[ft] = 1));
        }
    }
  }
  {
    let z = new Float32Array(D);
    for (let T = 0; T < 4; T++) {
      z.set(a);
      for (let I = 1; I < n - 1; I++)
        for (let B = 1; B < n - 1; B++) {
          let W = I * n + B;
          if (!g[W] || f[W] || l[W] >= 0) continue;
          let G = a[W] * 2,
            O = 2;
          for (let L of [W - 1, W + 1, W - n, W + n])
            g[L] && !f[L] && l[L] < 0 && ((G += a[L]), O++);
          let S = Math.min(G / O, -0.2);
          (E[W] && (S = Math.min(S, -(Ct.depth + 0.05))), (z[W] = S));
        }
      a.set(z);
    }
  }
  for (let z = 0; z < 10; z++) {
    let T = (z & 1) === 1;
    for (let I = 1; I < n - 1; I++) {
      let B = T ? n - 1 - I : I;
      for (let W = 1; W < n - 1; W++) {
        let G = B * n + (T ? n - 1 - W : W);
        if (!(!g[G] || f[G] || l[G] >= 0))
          for (let O = 0; O < 8; O++) {
            let S =
              G +
              (O < 4
                ? [1, -1, n, -n][O]
                : [n + 1, n - 1, -n + 1, -n - 1][O - 4]);
            if (!g[S] || f[S] || l[S] >= 0) continue;
            let L = a[S] + 0.28 * e * (O < 4 ? 1 : Math.SQRT2);
            a[G] > L && (a[G] = L);
          }
      }
    }
  }
  for (let z of x) {
    let T = z.r,
      I = T * 3,
      B = Math.max(1, Math.floor((z.x - I + r) / e)),
      W = Math.min(n - 2, Math.ceil((z.x + I + r) / e)),
      G = Math.max(1, Math.floor((z.z - I + r) / e)),
      O = Math.min(n - 2, Math.ceil((z.z + I + r) / e));
    for (let S = G; S <= O; S++)
      for (let L = B; L <= W; L++) {
        let Z = S * n + L;
        if (f[Z] || g[Z] || l[Z] >= 0) continue;
        let q = Math.hypot(c(Z) - z.x, p(Z) - z.z) / T;
        if (q < 1.05 || q > 2.9) continue;
        let K = et(6, 26, v[Z]),
          V =
            (26 + 10 * t.fbm(c(Z) / 160, p(Z) / 160, 2)) *
            et(1.08, 1.7, q) *
            (1 - et(2.3, 2.9, q)) *
            K;
        V > a[Z] && (a[Z] = bt(a[Z], V, 0.9));
      }
  }
  for (let z = 0; z < D; z++)
    f[z] ||
      g[z] ||
      (a[z] < it.datum &&
        ((g[z] = 1), (A[z] = Wt.SWAMP), (b[z] = Math.max(b[z], 0.6))));
  {
    let z = new Float32Array(D),
      T = new Float32Array(D),
      I = new Float32Array(D);
    for (let B = 0; B < 4; B++) {
      for (let W = 1; W < n - 1; W++)
        for (let G = 1; G < n - 1; G++) {
          let O = W * n + G;
          if (
            ((z[O] = w[O]),
            (T[O] = y[O]),
            (I[O] = b[O]),
            !g[O] || l[O] >= 0 || f[O])
          )
            continue;
          let S = w[O] * 2,
            L = y[O] * 2,
            Z = b[O] * 2,
            q = 2;
          for (let Y of [O - 1, O + 1, O - n, O + n])
            !g[Y] ||
              f[Y] ||
              l[Y] >= 0 ||
              ((S += w[Y]), (L += y[Y]), (Z += b[Y]), q++);
          let K = Math.hypot(w[O], y[O]),
            V = Math.hypot(S, L) || 1;
          ((z[O] = (S / V) * K), (T[O] = (L / V) * K), (I[O] = Z / q));
        }
      (w.set(z), y.set(T), b.set(I));
    }
  }
}
function yn(o) {
  let {
      N: n,
      cell: e,
      isHome: r,
      h: a,
      cdist: f,
      ocean: t,
      noise: l,
      lakeId: c,
      xOf: p,
      zOf: h,
      name: i,
      net: x,
      basins: M,
      lakes: g,
      wet: w,
      flowX: y,
      flowZ: b,
      sed: v,
      bankD: A,
      body: E,
      navMask: H,
    } = o,
    R = n * n,
    D = M.map((S) => {
      let L = S.reach,
        Z = S.node;
      for (
        ;
        Z > 0 &&
        Math.hypot(L.pts[Z * 2] - S.x, L.pts[Z * 2 + 1] - S.z) < S.r * 0.92;
      )
        Z--;
      let q = Math.max(0, Z - 2),
        K = L.pts[Z * 2] - L.pts[q * 2],
        V = L.pts[Z * 2 + 1] - L.pts[q * 2 + 1],
        Y = Math.hypot(K, V) || 1;
      return {
        x: L.pts[Z * 2],
        z: L.pts[Z * 2 + 1],
        dx: K / Y,
        dz: V / Y,
        k: Z,
      };
    }),
    z = (S, L, Z) => {
      let q = 1e18,
        K = S.hw[0];
      for (let V = 0; V < S.hw.length; V++) {
        let Y = (S.pts[V * 2] - L) ** 2 + (S.pts[V * 2 + 1] - Z) ** 2;
        Y < q && ((q = Y), (K = S.hw[V]));
      }
      return { d: Math.sqrt(q), w: K };
    },
    T = new Float64Array(g.length);
  for (let S = 0; S < R; S++) {
    let L = c[S];
    if (L < 0 || !w[S]) continue;
    {
      let tt = M[L],
        ct = D[L],
        st = p(S),
        nt = h(S),
        pt = st - ct.x,
        ft = nt - ct.z,
        dt = Math.hypot(pt, ft),
        j = (pt * ct.dx + ft * ct.dz) / Math.max(dt, 1),
        u = Math.exp(-dt / (tt.r * 0.42)) * et(-0.35, 0.4, j);
      if (u > 0.02) {
        let s = Math.atan2(ft, pt) - Math.atan2(ct.dz, ct.dx),
          m = Math.pow(
            Math.abs(Math.sin(s * 3.2 + l.fbm(st / 70, nt / 70, 2) * 2.2)),
            3,
          ),
          k = z(tt.reach, st, nt),
          F = 1 - et(k.w * 0.7, k.w * 1.3, k.d),
          C = -(0.45 + 0.6 * (1 - u) + 1.5 * m * u),
          P = Math.min(C, -(Ct.depth + 0.6) * F),
          _ = et(0.08, 0.6, u) * 0.9;
        ((a[S] = Math.min(-0.2, bt(a[S], Math.max(a[S], P), _))),
          F > 0.5 && (a[S] = Math.min(a[S], -(Ct.depth + 0.6))));
      }
      {
        let s = z(tt.reach, st, nt);
        s.d < Math.max(s.w * 0.62, Ct.halfWidth + 1.5) &&
          ((a[S] = Math.min(a[S], -(Ct.depth + 0.6))), (H[S] = 1));
      }
      let d = Math.exp(-dt / (tt.r * 0.55)) * et(-0.5, 0.3, j);
      ((v[S] = at(0.07 + 0.4 * d, 0, 1)),
        (y[S] += ct.dx * 0.32 * d),
        (b[S] += ct.dz * 0.32 * d));
    }
    let Z = it.datum - a[S];
    if (Z <= 0) continue;
    ((E[S] = Wt.LAKE),
      (g[L].area += e * e),
      (g[L].maxDepth = Math.max(g[L].maxDepth, Z)),
      (T[L] += Z * e * e),
      Z >= Ct.depth && (H[S] = 1));
    let q = M[L],
      K = q.reach.pts[(q.node + 1) * 2] - p(S),
      V = q.reach.pts[(q.node + 1) * 2 + 1] - h(S),
      Y = Math.hypot(K, V) || 1,
      J = 0.14 * Math.exp(-Y / 150);
    ((y[S] += (K / Y) * J), (b[S] += (V / Y) * J));
  }
  g.forEach((S, L) => {
    S.meanDepth = T[L] / Math.max(S.area, 1);
  });
  let I = [],
    B = new Map(),
    W = [...x.reaches].sort((S, L) => L.length - S.length);
  for (let S of W) {
    let L =
      S.kind === "creek"
        ? "Creek"
        : S.kind === "distributary"
          ? "Channel"
          : S.kind === "main" || S.kind === "secondary"
            ? "River"
            : "Brook";
    B.set(S.id, `${i()} ${L}`);
  }
  for (let S of x.reaches) {
    let L = S.hw.length,
      Z = M.findIndex((K) => K.reach.id === S.id),
      q = S.navigable || S.kind === "main" || S.kind === "distributary";
    (I.push({
      name: B.get(S.id),
      pts: S.pts.slice(),
      levels: new Array(L).fill(it.datum),
      hw: S.hw.slice(),
      speeds: S.speed.slice(),
      depths: S.depth.slice(),
      foam: new Array(L).fill(0),
      sed: S.sed.slice(),
      order: S.strahler,
      q: S.q.slice(),
      joinAngle: S.joinAngle,
      navigable: q,
      tidal: S.tidal,
      kind:
        S.kind === "distributary"
          ? "secondary"
          : S.kind === "creek"
            ? "tributary"
            : S.kind,
      bodyKind:
        S.kind === "creek" ? Wt.CREEK : S.parent < 0 ? Wt.ESTUARY : Wt.RIVER,
      outlet: S.parent >= 0 ? B.get(S.parent) : "Sea",
      length: S.length,
      maxDepth: Math.max(...S.depth),
      cells: S.cells.slice(),
    }),
      Z >= 0 && (g[Z].outlet = B.get(S.id)));
  }
  for (let S of M) S.lake.outlet || (S.lake.outlet = B.get(S.reach.id));
  let G = new Float32Array(R),
    O = [];
  {
    for (let q = 0; q < R; q++) {
      if (t[q]) continue;
      let K = Math.exp(-A[q] / 85),
        V = 1 - et(1.2, 7.5, Math.max(0, a[q] - it.datum)),
        Y = 1 - et(500, 2100, f[q]),
        J = 0.55 + 0.45 * et(-0.2, 0.25, l.fbm(p(q) / 240, h(q) / 240, 3));
      ((G[q] = at(K * V * (0.35 + 0.65 * Y) * J, 0, 1)),
        w[q] &&
          G[q] > 0.45 &&
          E[q] === Wt.SWAMP &&
          (v[q] = Math.max(v[q], 0.74)));
    }
    let S = new Uint8Array(R),
      L = [],
      Z = [];
    for (let q = 0; q < R; q++) {
      if (S[q] || G[q] < 0.45 || t[q]) continue;
      ((L.length = 0), L.push(q), (S[q] = 1));
      let K = 0,
        V = 0,
        Y = 0,
        J = 0;
      for (; L.length;) {
        let tt = L.pop();
        ((K += p(tt)),
          (V += h(tt)),
          Y++,
          w[tt] && (J = Math.max(J, it.datum - a[tt])));
        let ct = tt % n,
          st = (tt / n) | 0;
        for (let [nt, pt] of [
          [1, 0],
          [-1, 0],
          [0, 1],
          [0, -1],
        ]) {
          let ft = ct + nt,
            dt = st + pt;
          if (ft < 0 || dt < 0 || ft >= n || dt >= n) continue;
          let j = dt * n + ft;
          S[j] || t[j] || G[j] < 0.45 || ((S[j] = 1), L.push(j));
        }
      }
      Y * e * e > 24e3 &&
        Z.push({ cx: K / Y, cz: V / Y, area: Y * e * e, depth: J });
    }
    Z.sort((q, K) => K.area - q.area);
    for (let q of Z.slice(0, r ? 3 : 2))
      O.push({
        name: `${i()} Marsh`,
        x: q.cx,
        z: q.cz,
        r: Math.sqrt(q.area / Math.PI),
        level: it.datum,
        area: q.area,
        maxDepth: Math.min(q.depth, 3.4),
        meanDepth: Math.min(q.depth * 0.5, 1.6),
        outlet: I[0]?.name ?? "Sea",
      });
  }
  return { rivers: I, marshes: O, swamp: G };
}
function gn(o, n) {
  let {
      N: e,
      cell: r,
      ocean: a,
      wet: f,
      flowX: t,
      flowZ: l,
      sed: c,
      body: p,
    } = o,
    h = e * e,
    i = new Float32Array(h),
    x = new Float32Array(h),
    M = new Float32Array(h),
    g = new Float32Array(h),
    w = new Float32Array(h);
  for (let b = 0; b < h; b++)
    (f[b] && !a[b] && (M[b] = 1), (w[b] = f[b] && !a[b] ? 0 : 1e9));
  let y = (b, v, A) => {
    let E = w[v] + A;
    E < w[b] && (w[b] = E);
  };
  for (let b = 1; b < e - 1; b++)
    for (let v = 1; v < e - 1; v++) {
      let A = b * e + v;
      (y(A, A - 1, r),
        y(A, A - e, r),
        y(A, A - e - 1, r * Math.SQRT2),
        y(A, A - e + 1, r * Math.SQRT2));
    }
  for (let b = e - 2; b > 0; b--)
    for (let v = e - 2; v > 0; v--) {
      let A = b * e + v;
      (y(A, A + 1, r),
        y(A, A + e, r),
        y(A, A + e + 1, r * Math.SQRT2),
        y(A, A + e - 1, r * Math.SQRT2));
    }
  for (let b = 0; b < h; b++)
    ((g[b] = Math.max(Math.exp(-w[b] / 80), n[b] * 0.85)),
      a[b]
        ? ((M[b] = at(Math.exp(-w[b] / 120) * 0.92, 0, 0.98)),
          (g[b] = 0),
          (t[b] = l[b] = 0),
          (p[b] = Wt.SEA),
          (c[b] = Math.max(c[b] * 0, at(Math.exp(-w[b] / 220) * 0.75, 0, 1))))
        : f[b] || (p[b] = Wt.LAND));
  {
    let b = new Float32Array(h);
    for (let v = 0; v < 8; v++) {
      b.set(c);
      for (let A = 1; A < e - 1; A++)
        for (let E = 1; E < e - 1; E++) {
          let H = A * e + E;
          if (!f[H] || a[H]) continue;
          let R = c[H] * 4,
            D = 4;
          for (let z of [H - 1, H + 1, H - e, H + e])
            f[z] && !a[z] && ((R += c[z] * 2), (D += 2));
          for (let z of [H - e - 1, H - e + 1, H + e - 1, H + e + 1])
            f[z] && !a[z] && ((R += c[z]), (D += 1));
          b[H] = R / D;
        }
      c.set(b);
    }
  }
  {
    let b = new Float32Array(h),
      v = new Float32Array(h);
    for (let A = 0; A < 8; A++) {
      (b.set(t), v.set(l));
      for (let E = 1; E < e - 1; E++)
        for (let H = 1; H < e - 1; H++) {
          let R = E * e + H;
          if (!a[R] || M[R] < 0.15) continue;
          let D = 0,
            z = 0,
            T = 0;
          for (let I of [R - 1, R + 1, R - e, R + e])
            ((D += t[I]), (z += l[I]), T++);
          ((b[R] = (D / T) * 0.9), (v[R] = (z / T) * 0.9));
        }
      (t.set(b), l.set(v));
    }
  }
  return { level: i, nearLevel: x, inl: M, fresh: g };
}
export { Mn, gn, yn };
