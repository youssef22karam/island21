// terrain.worker.js - part 2/9 (statements 21-27 of the original module).
import { Ct, Jt, Oe, at, bt, et, it, ke, me, pe, ue, ze } from "./part01.js";

function Ie(o) {
  let n = Math.hypot(o[o.length - 2] - o[0], o[o.length - 1] - o[1]);
  return n < 0.001 ? 1 : Jt(o) / n;
}
function Zt(o) {
  let n = o.length / 2,
    e = new Float32Array(n);
  for (let r = 1; r < n - 1; r++) {
    let a = o[(r - 1) * 2],
      f = o[(r - 1) * 2 + 1],
      t = o[r * 2],
      l = o[r * 2 + 1],
      c = o[(r + 1) * 2],
      p = o[(r + 1) * 2 + 1],
      h = (t - a) * (p - f) - (l - f) * (c - a),
      i =
        Math.hypot(t - a, l - f) *
        Math.hypot(c - t, p - l) *
        Math.hypot(c - a, p - f);
    e[r] = i < 1e-6 ? 0 : (2 * h) / i;
  }
  return ((e[0] = e[1]), (e[n - 1] = e[n - 2]), e);
}
function Ce(o, n, e, r, a, f, t = 1) {
  let l = Math.max(6, n * 0.75),
    c = ze(o, l);
  if (c.length < 10) return c;
  {
    let x = c.length / 2,
      M = a() * ue,
      g = a() * ue,
      w = Math.max(6, ((10 + a() * 4) * n) / l);
    for (let y = 1; y < x - 1; y++) {
      let b = Math.sin((y / (x - 1)) * Math.PI),
        v = Math.max(0, y - 1) * 2,
        A = Math.min(x - 1, y + 1) * 2,
        E = c[A] - c[v],
        H = c[A + 1] - c[v + 1],
        R = Math.hypot(E, H) || 1,
        D =
          (Math.sin((y / w) * ue + M) * 1 +
            Math.sin((y / (w * 0.41)) * ue + g) * 0.28) *
          n *
          2.95 *
          b *
          t;
      ((c[y * 2] += (-H / R) * D), (c[y * 2 + 1] += (E / R) * D));
    }
  }
  let p = Math.max(2, Math.round((it.lagWidths * n) / l)),
    h = new Float32Array(p),
    i = 0;
  for (let x = 0; x < p; x++) ((h[x] = Math.exp(-x / (p * 0.45))), (i += h[x]));
  for (let x = 0; x < p; x++) h[x] /= i;
  for (let x = 0; x < e; x++) {
    let M = c.length / 2;
    if (M < 8 || Ie(c) >= r) break;
    let g = Zt(c),
      w = c.slice();
    for (let A = 1; A < M - 1; A++) {
      let E = 0;
      for (let S = 0; S < p; S++) E += h[S] * g[Math.max(0, A - S)];
      let H = Math.abs(E) > 1e-9 ? 1 / Math.abs(E) : 1e9,
        R = at(H / (n * it.minRadiusWidths), 0, 1),
        D = Math.sin((A / (M - 1)) * Math.PI) ** 0.75,
        z = -E * n * n * it.migrateRate * R * D,
        T = at(z, -0.16 * n, 0.16 * n),
        I = (A - 1) * 2,
        B = (A + 1) * 2,
        W = c[B] - c[I],
        G = c[B + 1] - c[I + 1],
        O = Math.hypot(W, G) || 1;
      ((w[A * 2] += (-G / O) * T), (w[A * 2 + 1] += (W / O) * T));
    }
    if (((c = ze(w, l)), f.length >= 2)) continue;
    let y = c.length / 2,
      b = n * 1.05,
      v = Math.max(14, Math.round((n * 9) / l));
    t: for (let A = 1; A < y - v - 1; A++)
      for (let E = A + v; E < y - 1; E++) {
        let H = c[E * 2] - c[A * 2],
          R = c[E * 2 + 1] - c[A * 2 + 1];
        if (H * H + R * R > b * b) continue;
        let D = c.slice(A * 2, E * 2 + 2);
        (Jt(D) > n * 14 && f.push(D),
          (c = c.slice(0, A * 2 + 2).concat(c.slice(E * 2))),
          (c = ze(c, l)));
        break t;
      }
  }
  for (let x = 0; x < 220 && Ie(c) > r * 1.1; x++) {
    let M = c.length / 2,
      g = c.slice();
    for (let w = 1; w < M - 1; w++)
      ((g[w * 2] = c[w * 2] * 0.76 + (c[(w - 1) * 2] + c[(w + 1) * 2]) * 0.12),
        (g[w * 2 + 1] =
          c[w * 2 + 1] * 0.76 +
          (c[(w - 1) * 2 + 1] + c[(w + 1) * 2 + 1]) * 0.12));
    c = g;
  }
  Ie(c) > r * 1.6 && (c = ze(pe(o, 2), l));
  for (let x = 0; x < 3; x++) {
    let M = c.length / 2,
      g = Zt(c),
      w = c.slice(),
      y = !1;
    for (let b = 1; b < M - 1; b++)
      Math.abs(g[b]) * n * it.minRadiusWidths <= 1 ||
        ((y = !0),
        (w[b * 2] = (c[(b - 1) * 2] + 2 * c[b * 2] + c[(b + 1) * 2]) * 0.25),
        (w[b * 2 + 1] =
          (c[(b - 1) * 2 + 1] + 2 * c[b * 2 + 1] + c[(b + 1) * 2 + 1]) * 0.25));
    if (((c = w), !y)) break;
  }
  return c;
}
function bn(o) {
  let {
      N: n,
      h: e,
      ocean: r,
      noise: a,
      rnd: f,
      reaches: t,
      cutoffPool: l,
      idxAt: c,
      nearOther: p,
      stampOcc: h,
    } = o,
    i = t.filter(
      (y) => y.tidal && y.hw[y.hw.length >> 1] > it.minHalfWidth * 1.02,
    ),
    x = 0,
    M = (y, b, v) => {
      if (x++ > 2200) return;
      let A = y.hw.length,
        E = Math.max(0, b - 1),
        H = Math.min(A - 1, b + 1),
        R = y.pts[H * 2] - y.pts[E * 2],
        D = y.pts[H * 2 + 1] - y.pts[E * 2 + 1],
        z = Math.hypot(R, D) || 1;
      ((R /= z), (D /= z));
      let T = (((50 + f() * 20) * Math.PI) / 180) * (f() < 0.5 ? 1 : -1),
        I = -(R * Math.cos(T) - D * Math.sin(T)),
        B = -(R * Math.sin(T) + D * Math.cos(T)),
        W = y.pts[b * 2],
        G = y.pts[b * 2 + 1],
        O = Math.max(it.minHalfWidth * 0.62, y.hw[b] * (0.32 + f() * 0.18)),
        S = (110 + f() * 380) / (v + 1),
        L = Math.max(8, O * 1.6),
        Z = [W, G],
        q = [O * 1.7],
        K = f() * 1e3,
        V = f() * 1e3,
        Y = t.length,
        J = 0,
        tt = !1;
      for (let k = 0; k < 400 && J < S; k++) {
        let F = (a.fbm(J / 95 + K, V, 3) - 0.5) * 0.34,
          C = Math.cos(F),
          P = Math.sin(F),
          _ = I * C - B * P,
          ot = I * P + B * C,
          U = Math.hypot(_, ot) || 1;
        ((I = _ / U), (B = ot / U));
        let $ = W + I * L,
          N = G + B * L,
          ut = c($, N);
        if (ut < 0 || r[ut] || e[ut] > 42) {
          tt = !0;
          break;
        }
        let xt = bt(O, it.minHalfWidth * 0.52, at(J / S, 0, 1) ** 0.8);
        if (p($, N, xt * it.minSeparationWidths * 2, Y, y.id) >= 0) {
          tt = !0;
          break;
        }
        ((W = $), (G = N), (J += L), Z.push(W, G), q.push(xt));
      }
      if (Z.length < 8) return;
      let ct = [],
        st = [];
      for (let k = Z.length / 2 - 1; k >= 0; k--)
        (ct.push(Z[k * 2], Z[k * 2 + 1]), st.push(q[k]));
      let nt = [],
        pt = Ce(pe(ct, 2), st[0] * 2.2, 22, it.sinuosityCreek, f, nt, 0.6);
      for (let k of nt) l.push(k);
      ((pt[pt.length - 2] = y.pts[b * 2]),
        (pt[pt.length - 1] = y.pts[b * 2 + 1]));
      let ft = pt.length / 2;
      if (ft < 6) return;
      let dt = [],
        j = [],
        u = [],
        d = [],
        s = [];
      for (let k = 0; k < ft; k++) {
        let F = k / (ft - 1),
          C = bt(it.minHalfWidth * 0.52, O * (1 + 0.9 * F * F), F ** 0.7);
        (dt.push(C),
          j.push(at(0.5 + 2.2 * F, 0.45, 3.4)),
          u.push(bt(0.82, 0.45, F)),
          d.push(bt(0.05, 0.3, F)),
          s.push(bt(4, y.q[b] * 0.08, F)));
      }
      let m = {
        id: Y,
        pts: pt,
        hw: dt,
        depth: j,
        sed: u,
        speed: d,
        q: s,
        curv: Array.from(Zt(pt)),
        cells: [],
        strahler: 1,
        parent: y.id,
        joinNode: b,
        joinAngle: Math.abs((T * 180) / Math.PI),
        kind: "creek",
        navigable: !1,
        tidal: !0,
        lake: -1,
        length: Jt(pt),
      };
      t.push(m);
      for (let k = 0; k < ft; k++) h(pt[k * 2], pt[k * 2 + 1], dt[k], Y);
      if (v < it.creekRecursion && ft > 14) {
        let k = 1 + (f() < 0.55 ? 1 : 0);
        for (let F = 0; F < k; F++) {
          let C = Math.floor(bt(ft * 0.35, ft * 0.85, f()));
          C > 2 && C < ft - 2 && M(m, C, v + 1);
        }
      }
    },
    g = Math.round(at(n * 0.7, 120, 440) * it.creekDensity),
    w = t.length;
  for (let y of i) {
    if (t.length - w >= g) break;
    let b = y.hw.length,
      v = Math.round(at(y.length / 240, 1, 7) * it.creekDensity);
    for (let A = 0; A < v; A++) {
      let E = Math.floor(bt(b * 0.12, b * 0.9, (A + 0.35 + f() * 0.3) / v));
      if (t.length - w >= g) break;
      E > 1 && E < b - 2 && M(y, E, 0);
    }
  }
}
function dn(o, n, e, r) {
  let a = o.reduce((M, g) => Math.max(M, g.strahler), 1),
    f = new Array(a + 1).fill(0),
    t = new Array(a + 1).fill(0),
    l = new Array(a + 1).fill(0),
    c = new Uint8Array(o.length);
  for (let M of o)
    M.parent >= 0 && o[M.parent].strahler === M.strahler && (c[M.parent] = 1);
  for (let M of o)
    ((t[M.strahler] += M.length),
      (M.parent < 0 || o[M.parent].strahler !== M.strahler) &&
        (l[M.strahler] += (M.q[M.q.length - 1] * r * r) / 1e6),
      c[M.id] || f[M.strahler]++);
  let p = (M) => {
      let g = 0,
        w = 0;
      for (let y = 1; y < a; y++) {
        let b = M(y),
          v = M(y + 1);
        b > 0 && v > 0 && ((g += b / v), w++);
      }
      return w ? g / w : 0;
    },
    h = 0;
  for (let M of o) h += M.length;
  let i = 0;
  for (let M = 0; M < e; M++) n[M] || i++;
  return { areaKm: (i * r * r) / 1e6, counts: f, ratio: p, totalLen: h };
}
function xn(o) {
  let {
      h: n,
      ocean: e,
      plain: r,
      cdist: a,
      N: f,
      cell: t,
      half: l,
      drainage: c,
      rnd: p,
      noise: h,
    } = o,
    i = f * f,
    x = c.accumulation,
    M = c.downstream,
    g = c.order,
    w = (u) => ((u % f) + 0.5) * t - l,
    y = (u) => (((u / f) | 0) + 0.5) * t - l,
    b = (u, d) => {
      let s = Math.round((u + l) / t - 0.5),
        m = Math.round((d + l) / t - 0.5);
      return s < 1 || m < 1 || s >= f - 1 || m >= f - 1 ? -1 : m * f + s;
    },
    v = new Uint8Array(i),
    A = (u) =>
      u < f || u >= i - f || u % f === 0 || u % f === f - 1
        ? 1
        : Math.hypot(n[u + 1] - n[u - 1], n[u + f] - n[u - f]) / (2 * t);
  for (let u = 0; u < i; u++) {
    if (e[u]) continue;
    let d =
        at(1 - et(0.015, 0.11, A(u)), 0, 1) * at(1 - et(60, 190, n[u]), 0, 1),
      s = bt(it.accMountain, it.accLowland, d * (0.4 + 0.6 * r[u]));
    x[u] >= s / it.creekDensity && (v[u] = 1);
  }
  for (let u = 0; u < i; u++) {
    let d = g[u];
    if (!v[d]) continue;
    let s = M[d];
    for (let m = 0; m < i && s >= 0 && !e[s] && !v[s]; m++)
      ((v[s] = 1), (s = M[s]));
  }
  let E = new Uint8Array(i);
  for (let u = 0; u < i; u++) {
    if (!v[u]) continue;
    let d = M[u];
    d >= 0 && v[d] && E[d] < 255 && E[d]++;
  }
  let H = new Uint8Array(i),
    R = new Uint8Array(i),
    D = new Uint8Array(i);
  for (let u = i - 1; u >= 0; u--) {
    let d = g[u];
    if (!v[d]) continue;
    H[d] = E[d] === 0 ? 1 : D[d] >= 2 ? R[d] + 1 : R[d];
    let s = M[d];
    s < 0 ||
      !v[s] ||
      (H[d] > R[s] ? ((R[s] = H[d]), (D[s] = 1)) : H[d] === R[s] && D[s]++);
  }
  let z = new Map(),
    T = [];
  for (let u = i - 1; u >= 0; u--) {
    let d = g[u];
    if (!v[d] || E[d] === 1) continue;
    let s = [d],
      m = M[d],
      k = 0;
    for (; m >= 0 && k++ < i && (s.push(m), !(e[m] || !v[m] || E[m] !== 1));)
      m = M[m];
    let F = s[s.length - 1];
    s.length < 2 ||
      (z.set(d, T.length),
      T.push({ cells: s, endJunction: v[F] && !e[F] ? F : -1 }));
  }
  let I = (() => {
    let u = new Map();
    T.forEach((U, $) => u.set(U.cells[0], $));
    let d = 1,
      s = T.map((U) => {
        let $ = H[U.cells[0]] || 1;
        return ((d = Math.max(d, $)), $);
      }),
      m = new Array(d + 1).fill(0),
      k = new Array(d + 1).fill(0),
      F = new Array(d + 1).fill(0),
      C = 0;
    T.forEach((U, $) => {
      let N = 0;
      for (let mt = 1; mt < U.cells.length; mt++)
        N += Math.hypot(
          w(U.cells[mt]) - w(U.cells[mt - 1]),
          y(U.cells[mt]) - y(U.cells[mt - 1]),
        );
      C += N;
      let ut = U.endJunction >= 0 ? u.get(U.endJunction) : void 0,
        xt = ut === void 0 || s[ut] !== s[$];
      ((k[s[$]] += N),
        xt && (F[s[$]] += (x[U.cells[U.cells.length - 1]] * t * t) / 1e6));
    });
    let P = new Uint8Array(T.length);
    (T.forEach((U, $) => {
      let N = U.endJunction >= 0 ? u.get(U.endJunction) : void 0;
      N !== void 0 && s[N] === s[$] && (P[N] = 1);
    }),
      T.forEach((U, $) => {
        P[$] || m[s[$]]++;
      }));
    let _ = (U) => {
        let $ = 0,
          N = 0;
        for (let ut = 1; ut < d; ut++) {
          let xt = U(ut),
            mt = U(ut + 1);
          xt > 0 && mt > 0 && (($ += xt / mt), N++);
        }
        return N ? $ / N : 0;
      },
      ot = (U) => {
        let $ = 0,
          N = 0;
        for (let ut = 1; ut < d; ut++) {
          let xt = U(ut),
            mt = U(ut + 1);
          xt > 0 && mt > 0 && (($ += mt / xt), N++);
        }
        return N ? $ / N : 0;
      };
    return {
      bifurcation: _((U) => m[U]),
      lengthRatio: ot((U) => (m[U] ? k[U] / m[U] : 0)),
      areaRatio: ot((U) => (m[U] ? F[U] / m[U] : 0)),
      totalLen: C,
      counts: m.slice(1),
      orders: Array.from({ length: d }, (U, $) => $ + 1),
    };
  })();
  for (let u of T) u.start = u.cells[0];
  for (let u = T.length - 1; u >= 0; u--) {
    let d = T[u].cells,
      s = 0;
    for (; s < d.length && n[d[s]] >= it.maxChannelH;) s++;
    if (d.length - s < 6) {
      T.splice(u, 1);
      continue;
    }
    s > 0 && (T[u].cells = d.slice(s));
  }
  let B = Math.round(at(f * 0.36, 90, 230));
  (T.sort(
    (u, d) => x[d.cells[d.cells.length - 1]] - x[u.cells[u.cells.length - 1]],
  ),
    T.length > B && (T.length = B),
    z.clear());
  for (let u = 0; u < T.length; u++) z.set(T[u].start, u);
  let W = [],
    G = [],
    O = [],
    S = Math.max(8, t),
    L = Math.ceil((f * t) / S) + 2,
    Z = new Int32Array(L * L).fill(-1),
    q = new Float32Array(L * L),
    K = (u, d, s, m) => {
      let k = Math.floor((u + l) / S),
        F = Math.floor((d + l) / S),
        C = Math.max(1, Math.ceil(s / S));
      for (let P = -C; P <= C; P++)
        for (let _ = -C; _ <= C; _++) {
          let ot = k + _,
            U = F + P;
          if (ot < 0 || U < 0 || ot >= L || U >= L) continue;
          let $ = U * L + ot;
          (Z[$] < 0 || q[$] < s) && ((Z[$] = m), (q[$] = s));
        }
    },
    V = (u, d, s, m, k) => {
      let F = Math.floor((u + l) / S),
        C = Math.floor((d + l) / S),
        P = Math.max(1, Math.ceil(s / S));
      for (let _ = -P; _ <= P; _++)
        for (let ot = -P; ot <= P; ot++) {
          let U = F + ot,
            $ = C + _;
          if (U < 0 || $ < 0 || U >= L || $ >= L) continue;
          let N = Z[$ * L + U];
          if (N >= 0 && N !== m && N !== k) return N;
        }
      return -1;
    },
    Y = (u) =>
      at(
        it.widthK * Math.sqrt(Math.max(u, 1)),
        it.minHalfWidth,
        it.maxHalfWidth,
      ),
    J = (u) =>
      at(
        it.depthK * Math.pow(Math.max(u, 1), 0.4),
        it.minBedDepth,
        it.maxBedDepth,
      ),
    tt = new Map();
  for (let u = 0; u < T.length; u++) {
    let { cells: d, endJunction: s } = T[u],
      m = x[d[d.length - 1]],
      k = Y(m),
      F = [];
    for (let X of d) F.push(w(X), y(X));
    let C = pe(Oe(F, 3, 2, 1), 3),
      P = H[T[u].start] || 1,
      _ = bt(it.sinuosityCreek, it.sinuosityMain, at((P - 1) / 3, 0, 1)),
      ot = 0;
    for (let X = 0; X < d.length; X += 3) {
      let Rt = d[X];
      ot += at(1 - et(0.02, 0.13, A(Rt)), 0, 1) * (0.45 + 0.55 * r[Rt]);
    }
    ot = at(ot / Math.max(1, Math.ceil(d.length / 3)), 0.12, 1);
    let U = [],
      $ = Ce(C, k * 2, it.migrateSteps, _, p, U, 0.35 + 0.95 * ot);
    for (let X of U) O.push(X);
    (($[0] = F[0]),
      ($[1] = F[1]),
      ($[$.length - 2] = F[F.length - 2]),
      ($[$.length - 1] = F[F.length - 1]));
    {
      let X = Math.min(140, Math.max(26, k * 4.2));
      $ = ke($, () => X, 1, 1, 90);
    }
    let N = $.length / 2;
    if (N < 6) continue;
    let ut = [],
      xt = [],
      mt = [],
      wt = [],
      St = [],
      Vt = p() * ue,
      Ht = 0;
    for (let X = 0; X < N; X++) {
      X &&
        (Ht += Math.hypot(
          $[X * 2] - $[X * 2 - 2],
          $[X * 2 + 1] - $[X * 2 - 1],
        ));
      let Rt = X / (N - 1),
        Tt = Math.max(
          0,
          x[d[Math.min(d.length - 1, Math.round(Rt * (d.length - 1)))]],
        ),
        Ft = 1 + it.widthNoise * Math.sin((Ht / (k * 18)) * ue + Vt);
      (ut.push(Tt),
        xt.push(Y(Tt) * Ft),
        mt.push(J(Tt)),
        St.push(
          at(0.18 + 0.52 * Math.pow(Math.max(Tt, 1) / 900, 0.22), 0.16, 1.45),
        ),
        wt.push(0));
    }
    let kt = Array.from(Zt($)),
      yt = W.length;
    (tt.set(T[u].start, yt),
      W.push({
        id: yt,
        pts: $,
        hw: xt,
        depth: mt,
        sed: wt,
        speed: St,
        q: ut,
        curv: kt,
        cells: d,
        strahler: P,
        parent: -1,
        joinNode: -1,
        joinAngle: 0,
        kind: "tributary",
        navigable: !1,
        tidal: !1,
        lake: -1,
        length: Ht,
      }),
      (W[yt]._end = s));
  }
  let ct = new Map();
  for (let u of W)
    for (let d = 0; d < u.cells.length - 1; d++) {
      let s = u.cells[d];
      ct.has(s) || ct.set(s, u.id);
    }
  for (let u of W) {
    let d = u,
      s = u.cells[u.cells.length - 1];
    if (e[s]) {
      d._end = -1;
      continue;
    }
    if (d._end >= 0 && tt.has(d._end) && tt.get(d._end) !== u.id) continue;
    let m = [],
      k = M[s],
      F = -1;
    for (let _ = 0; _ < 4e3 && k >= 0; _++) {
      let ot = ct.get(k);
      if (ot !== void 0 && ot !== u.id) {
        F = k;
        break;
      }
      if ((m.push(k), e[k])) break;
      k = M[k];
    }
    let C = u.hw.length - 1,
      P = u.q[C];
    for (let _ of m) P = Math.max(P, x[_]);
    F >= 0 && m.push(F);
    for (let _ of m) {
      let ot = _ === F ? P : Math.max(u.q[u.q.length - 1], x[_]);
      (u.pts.push(w(_), y(_)),
        u.hw.push(u.hw[C]),
        u.depth.push(u.depth[C]),
        u.sed.push(u.sed[C]),
        u.speed.push(u.speed[C]),
        u.q.push(ot),
        u.cells.push(_));
    }
    if (m.length >= 2) {
      let _ = Math.max(0, C - 8),
        ot = u.pts.slice(_ * 2),
        U = Oe(ot, 3, 3, 1),
        $ = Math.min(140, Math.max(26, u.hw[C] * 4.2));
      U = ke(U, () => $, 1, 1, 90);
      for (let N = 0; N < U.length; N++) u.pts[_ * 2 + N] = U[N];
    }
    ((u.curv = Array.from(Zt(u.pts))),
      (u.length = Jt(u.pts)),
      (d._end = F >= 0 ? F : -1));
  }
  for (let u of W) {
    let d = u._end;
    if (d < 0) continue;
    let s = tt.get(d) ?? ct.get(d);
    if (s === void 0 || s === u.id) continue;
    u.parent = s;
    let m = W[s],
      k = u.pts[u.pts.length - 2],
      F = u.pts[u.pts.length - 1],
      C = 0,
      P = 1 / 0;
    for (let Q = 0; Q < m.hw.length; Q++) {
      let gt = (m.pts[Q * 2] - k) ** 2 + (m.pts[Q * 2 + 1] - F) ** 2;
      gt < P && ((P = gt), (C = Q));
    }
    ((u.joinNode = C),
      (u.pts[u.pts.length - 2] = m.pts[C * 2]),
      (u.pts[u.pts.length - 1] = m.pts[C * 2 + 1]));
    let _ = Math.max(0, C - 1),
      ot = Math.min(m.hw.length - 1, C + 1),
      U = m.pts[ot * 2] - m.pts[_ * 2],
      $ = m.pts[ot * 2 + 1] - m.pts[_ * 2 + 1],
      N = Math.hypot(U, $) || 1,
      ut = U / N,
      xt = $ / N,
      mt = u.hw.length,
      wt = u.pts[(mt - 1) * 2] - u.pts[(mt - 4) * 2],
      St = u.pts[(mt - 1) * 2 + 1] - u.pts[(mt - 4) * 2 + 1],
      Vt = Math.hypot(wt, St) || 1;
    ((wt /= Vt), (St /= Vt));
    let Ht = Math.acos(at(wt * ut + St * xt, -1, 1)),
      kt = (45 * Math.PI) / 180,
      yt = (75 * Math.PI) / 180,
      X = u.hw.length,
      Rt = (Q) => {
        let gt = Math.min(4, X - 3),
          Et = Math.min(X - 2, gt + 10),
          vt = u.pts[(X - 1) * 2],
          Dt = u.pts[(X - 1) * 2 + 1];
        for (let Pt = X - 2; Pt >= Math.max(0, X - 1 - Et); Pt--) {
          let _t = X - 1 - Pt,
            te = (1 - et(gt, Et, _t)) * Q,
            se = Math.cos(te),
            ae = Math.sin(te),
            ee = u.pts[Pt * 2] - vt,
            he = u.pts[Pt * 2 + 1] - Dt;
          ((u.pts[Pt * 2] = vt + ee * se - he * ae),
            (u.pts[Pt * 2 + 1] = Dt + ee * ae + he * se));
        }
        let It = u.pts[(X - 1) * 2] - u.pts[(X - 4) * 2],
          Bt = u.pts[(X - 1) * 2 + 1] - u.pts[(X - 4) * 2 + 1],
          Lt = Math.hypot(It, Bt) || 1;
        return (
          (It /= Lt),
          (Bt /= Lt),
          Math.acos(at(It * ut + Bt * xt, -1, 1))
        );
      };
    if (X > 6) {
      let Q = 1;
      for (let gt = 0; gt < 7; gt++) {
        let vt = at(Ht, kt, yt) - Ht;
        if (Math.abs(vt) < 0.02) break;
        let Dt = Rt(vt * Q);
        Math.abs(at(Dt, kt, yt) - Dt) > Math.abs(vt)
          ? (Rt(-vt * Q), (Q = -Q))
          : (Ht = Dt);
      }
    }
    let Tt = 0;
    u.joinAngle = (Ht * 180) / Math.PI;
    let Ft = Math.max(3, Math.round((u.hw[mt - 1] * 2.2) / 8));
    for (let Q = mt - Ft; Q < mt; Q++) {
      if (Q < 1) continue;
      let gt = (Q - (mt - Ft)) / Ft;
      ((u.hw[Q] *= 1 + 0.8 * gt * gt),
        (u.depth[Q] = Math.max(
          u.depth[Q],
          bt(u.depth[Q], m.depth[C] * 1.08, gt),
        )),
        (u.sed[Q] = Math.max(u.sed[Q], 0.25 * gt)));
    }
    let Mt = Math.min(mt - 1, 14);
    for (let Q = mt - Mt; Q < mt; Q++) {
      let gt = et(0, 1, (Q - (mt - Mt)) / Mt);
      u.depth[Q] = Math.max(u.depth[Q], bt(u.depth[Q], m.depth[C], gt));
    }
    let ht = m.hw.length;
    for (let Q = Math.max(0, C - 1); Q < Math.min(ht, C + 2); Q++)
      m.depth[Q] += u.depth[mt - 1] * 0.22;
    for (let Q = Math.min(ht - 1, C + 3); Q < Math.min(ht, C + 7); Q++)
      m.depth[Q] *= 0.88;
  }
  let st = W.filter((u) => u.parent < 0);
  if (
    (st.sort((u, d) => d.q[d.q.length - 1] - u.q[u.q.length - 1]), st.length)
  ) {
    st[0].kind = "main";
    for (let u = 1; u < st.length; u++) st[u].kind = "secondary";
  }
  for (let u of W) {
    let d = Math.floor(u.hw.length / 2),
      s = b(u.pts[0], u.pts[1]),
      m = b(u.pts[d * 2], u.pts[d * 2 + 1]);
    ((u.tidal =
      (s >= 0 && a[s] < 1300 && n[s] < 30) ||
      (m >= 0 && a[m] < 1100 && n[m] < 22)),
      (u.navigable =
        Math.min(...u.hw) >= Ct.halfWidth && Math.min(...u.depth) >= Ct.depth));
    for (let k = 0; k < u.hw.length; k++)
      K(u.pts[k * 2], u.pts[k * 2 + 1], u.hw[k], u.id);
  }
  for (let u of W) {
    if (u.parent >= 0) continue;
    let d = u.hw.length,
      s = it.estuaryLb,
      m = 0,
      k = new Array(d).fill(0);
    for (let F = d - 2; F >= 0; F--)
      ((m += Math.hypot(
        u.pts[F * 2 + 2] - u.pts[F * 2],
        u.pts[F * 2 + 3] - u.pts[F * 2 + 1],
      )),
        (k[F] = m));
    for (let F = 0; F < d; F++) {
      let C = s * it.estuaryReach - k[F];
      if (C <= 0) continue;
      let P = Math.exp(C / s) / Math.exp(it.estuaryReach);
      ((u.hw[F] = Math.max(u.hw[F], u.hw[F] * (1 + 2.6 * P))),
        (u.depth[F] = Math.max(u.depth[F], bt(u.depth[F], Ct.depth + 2.4, P))),
        (u.sed[F] = Math.max(u.sed[F], 0.55 * P)));
    }
    for (let F = d - 2; F >= 0; F--)
      k[F] < s * it.estuaryReach && (u.hw[F] = Math.min(u.hw[F], u.hw[F + 1]));
  }
  bn({
    N: f,
    h: n,
    ocean: e,
    noise: h,
    rnd: p,
    reaches: W,
    cutoffPool: O,
    idxAt: b,
    nearOther: V,
    stampOcc: K,
  });
  let nt = W.find((u) => u.kind === "main");
  if (nt && nt.hw.length > 26 && p() < 0.85) {
    let u = nt.hw.length,
      d = Math.max(3, u - 1 - Math.round(12 + p() * 8)),
      s = u - 1,
      m = [],
      k = [],
      F = [],
      C = [],
      P = [],
      _ = [],
      ot = p() < 0.5 ? 1 : -1;
    for (let U = d; U <= s; U++) {
      let $ = (U - d) / Math.max(1, s - d),
        N = Math.sin($ * Math.PI) * nt.hw[U] * (2.4 + p() * 0),
        ut = Math.max(0, U - 1),
        xt = Math.min(u - 1, U + 1),
        mt = nt.pts[xt * 2] - nt.pts[ut * 2],
        wt = nt.pts[xt * 2 + 1] - nt.pts[ut * 2 + 1],
        St = Math.hypot(mt, wt) || 1;
      (m.push(
        nt.pts[U * 2] - (wt / St) * N * ot,
        nt.pts[U * 2 + 1] + (mt / St) * N * ot,
      ),
        k.push(nt.hw[U] * bt(0.42, 0.62, Math.sin($ * Math.PI))),
        F.push(Math.max(Ct.depth * 0.9, nt.depth[U] * 0.62)),
        C.push(0.5),
        P.push(nt.speed[U] * 0.7),
        _.push(nt.q[U] * 0.33));
    }
    m.length >= 12 &&
      W.push({
        id: W.length,
        pts: m,
        hw: k,
        depth: F,
        sed: C,
        speed: P,
        q: _,
        curv: Array.from(Zt(m)),
        cells: [],
        strahler: nt.strahler,
        parent: nt.id,
        joinNode: d,
        joinAngle: 32,
        kind: "distributary",
        navigable: !0,
        tidal: !0,
        lake: -1,
        length: Jt(m),
      });
  }
  for (let u of O) {
    if (u.length < 10) continue;
    let d = 0,
      s = 0;
    for (let k = 0; k < u.length; k += 2) ((d += u[k]), (s += u[k + 1]));
    let m = u.length / 2;
    G.push({ x: d / m, z: s / m, pts: u, hw: 7 + p() * 5 });
  }
  let { areaKm: pt, counts: ft, ratio: dt, totalLen: j } = dn(W, e, i, t);
  return {
    reaches: W,
    oxbows: G,
    stats: {
      bifurcation: I.bifurcation,
      lengthRatio: I.lengthRatio,
      areaRatio: I.areaRatio,
      density: pt > 0 ? I.totalLen / 1e3 / pt : 0,
      orders: I.orders,
      counts: I.counts,
      wetBifurcation: dt((u) => ft[u]),
      wetDensity: pt > 0 ? j / 1e3 / pt : 0,
      wetCounts: ft.slice(1),
    },
  };
}
var Wt = { LAND: 0, SEA: 1, LAKE: 2, RIVER: 3, CREEK: 4, SWAMP: 5, ESTUARY: 6 },
  Pe = (o, n, e) => -me(-o, -n, e);
export { Pe, Wt, Zt, xn };
