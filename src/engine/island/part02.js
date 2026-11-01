// island.js - part 2/21 (statements 31-37 of the original module).
import { Ko, To, Ya, Yo, ko, ne, nt, oo, re, ve, we, yo } from "./part01.js";

function ga(o) {
  let e = Math.hypot(o[o.length - 2] - o[0], o[o.length - 1] - o[1]);
  return e < 0.001 ? 1 : oo(o) / e;
}
function Yt(o) {
  let e = o.length / 2,
    t = new Float32Array(e);
  for (let r = 1; r < e - 1; r++) {
    let s = o[(r - 1) * 2],
      c = o[(r - 1) * 2 + 1],
      a = o[r * 2],
      n = o[r * 2 + 1],
      i = o[(r + 1) * 2],
      m = o[(r + 1) * 2 + 1],
      h = (a - s) * (m - c) - (n - c) * (i - s),
      l =
        Math.hypot(a - s, n - c) *
        Math.hypot(i - a, m - n) *
        Math.hypot(i - s, m - c);
    t[r] = l < 1e-6 ? 0 : (2 * h) / l;
  }
  return ((t[0] = t[1]), (t[e - 1] = t[e - 2]), t);
}
function wa(o, e, t, r, s, c, a = 1) {
  let n = Math.max(6, e * 0.75),
    i = Yo(o, n);
  if (i.length < 10) return i;
  {
    let u = i.length / 2,
      d = s() * yo,
      p = s() * yo,
      x = Math.max(6, ((10 + s() * 4) * e) / n);
    for (let f = 1; f < u - 1; f++) {
      let v = Math.sin((f / (u - 1)) * Math.PI),
        b = Math.max(0, f - 1) * 2,
        g = Math.min(u - 1, f + 1) * 2,
        M = i[g] - i[b],
        w = i[g + 1] - i[b + 1],
        E = Math.hypot(M, w) || 1,
        k =
          (Math.sin((f / x) * yo + d) * 1 +
            Math.sin((f / (x * 0.41)) * yo + p) * 0.28) *
          e *
          2.95 *
          v *
          a;
      ((i[f * 2] += (-w / E) * k), (i[f * 2 + 1] += (M / E) * k));
    }
  }
  let m = Math.max(2, Math.round((we.lagWidths * e) / n)),
    h = new Float32Array(m),
    l = 0;
  for (let u = 0; u < m; u++) ((h[u] = Math.exp(-u / (m * 0.45))), (l += h[u]));
  for (let u = 0; u < m; u++) h[u] /= l;
  for (let u = 0; u < t; u++) {
    let d = i.length / 2;
    if (d < 8 || ga(i) >= r) break;
    let p = Yt(i),
      x = i.slice();
    for (let g = 1; g < d - 1; g++) {
      let M = 0;
      for (let z = 0; z < m; z++) M += h[z] * p[Math.max(0, g - z)];
      let w = Math.abs(M) > 1e-9 ? 1 / Math.abs(M) : 1e9,
        E = re(w / (e * we.minRadiusWidths), 0, 1),
        k = Math.sin((g / (d - 1)) * Math.PI) ** 0.75,
        R = -M * e * e * we.migrateRate * E * k,
        H = re(R, -0.16 * e, 0.16 * e),
        C = (g - 1) * 2,
        W = (g + 1) * 2,
        T = i[W] - i[C],
        P = i[W + 1] - i[C + 1],
        L = Math.hypot(T, P) || 1;
      ((x[g * 2] += (-P / L) * H), (x[g * 2 + 1] += (T / L) * H));
    }
    if (((i = Yo(x, n)), c.length >= 2)) continue;
    let f = i.length / 2,
      v = e * 1.05,
      b = Math.max(14, Math.round((e * 9) / n));
    e: for (let g = 1; g < f - b - 1; g++)
      for (let M = g + b; M < f - 1; M++) {
        let w = i[M * 2] - i[g * 2],
          E = i[M * 2 + 1] - i[g * 2 + 1];
        if (w * w + E * E > v * v) continue;
        let k = i.slice(g * 2, M * 2 + 2);
        (oo(k) > e * 14 && c.push(k),
          (i = i.slice(0, g * 2 + 2).concat(i.slice(M * 2))),
          (i = Yo(i, n)));
        break e;
      }
  }
  for (let u = 0; u < 220 && ga(i) > r * 1.1; u++) {
    let d = i.length / 2,
      p = i.slice();
    for (let x = 1; x < d - 1; x++)
      ((p[x * 2] = i[x * 2] * 0.76 + (i[(x - 1) * 2] + i[(x + 1) * 2]) * 0.12),
        (p[x * 2 + 1] =
          i[x * 2 + 1] * 0.76 +
          (i[(x - 1) * 2 + 1] + i[(x + 1) * 2 + 1]) * 0.12));
    i = p;
  }
  ga(i) > r * 1.6 && (i = Yo(To(o, 2), n));
  for (let u = 0; u < 3; u++) {
    let d = i.length / 2,
      p = Yt(i),
      x = i.slice(),
      f = !1;
    for (let v = 1; v < d - 1; v++)
      Math.abs(p[v]) * e * we.minRadiusWidths <= 1 ||
        ((f = !0),
        (x[v * 2] = (i[(v - 1) * 2] + 2 * i[v * 2] + i[(v + 1) * 2]) * 0.25),
        (x[v * 2 + 1] =
          (i[(v - 1) * 2 + 1] + 2 * i[v * 2 + 1] + i[(v + 1) * 2 + 1]) * 0.25));
    if (((i = x), !f)) break;
  }
  return i;
}
function jn(o) {
  let {
      N: e,
      h: t,
      ocean: r,
      noise: s,
      rnd: c,
      reaches: a,
      cutoffPool: n,
      idxAt: i,
      nearOther: m,
      stampOcc: h,
    } = o,
    l = a.filter(
      (f) => f.tidal && f.hw[f.hw.length >> 1] > we.minHalfWidth * 1.02,
    ),
    u = 0,
    d = (f, v, b) => {
      if (u++ > 2200) return;
      let g = f.hw.length,
        M = Math.max(0, v - 1),
        w = Math.min(g - 1, v + 1),
        E = f.pts[w * 2] - f.pts[M * 2],
        k = f.pts[w * 2 + 1] - f.pts[M * 2 + 1],
        R = Math.hypot(E, k) || 1;
      ((E /= R), (k /= R));
      let H = (((50 + c() * 20) * Math.PI) / 180) * (c() < 0.5 ? 1 : -1),
        C = -(E * Math.cos(H) - k * Math.sin(H)),
        W = -(E * Math.sin(H) + k * Math.cos(H)),
        T = f.pts[v * 2],
        P = f.pts[v * 2 + 1],
        L = Math.max(we.minHalfWidth * 0.62, f.hw[v] * (0.32 + c() * 0.18)),
        z = (110 + c() * 380) / (b + 1),
        D = Math.max(8, L * 1.6),
        q = [T, P],
        N = [L * 1.7],
        V = c() * 1e3,
        G = c() * 1e3,
        U = a.length,
        K = 0,
        X = !1;
      for (let B = 0; B < 400 && K < z; B++) {
        let I = (s.fbm(K / 95 + V, G, 3) - 0.5) * 0.34,
          O = Math.cos(I),
          _ = Math.sin(I),
          ae = C * O - W * _,
          le = C * _ + W * O,
          Y = Math.hypot(ae, le) || 1;
        ((C = ae / Y), (W = le / Y));
        let ee = T + C * D,
          ie = P + W * D,
          he = i(ee, ie);
        if (he < 0 || r[he] || t[he] > 42) {
          X = !0;
          break;
        }
        let Me = ve(L, we.minHalfWidth * 0.52, re(K / z, 0, 1) ** 0.8);
        if (m(ee, ie, Me * we.minSeparationWidths * 2, U, f.id) >= 0) {
          X = !0;
          break;
        }
        ((T = ee), (P = ie), (K += D), q.push(T, P), N.push(Me));
      }
      if (q.length < 8) return;
      let J = [],
        se = [];
      for (let B = q.length / 2 - 1; B >= 0; B--)
        (J.push(q[B * 2], q[B * 2 + 1]), se.push(N[B]));
      let te = [],
        me = wa(To(J, 2), se[0] * 2.2, 22, we.sinuosityCreek, c, te, 0.6);
      for (let B of te) n.push(B);
      ((me[me.length - 2] = f.pts[v * 2]),
        (me[me.length - 1] = f.pts[v * 2 + 1]));
      let $ = me.length / 2;
      if ($ < 6) return;
      let Z = [],
        j = [],
        S = [],
        F = [],
        y = [];
      for (let B = 0; B < $; B++) {
        let I = B / ($ - 1),
          O = ve(we.minHalfWidth * 0.52, L * (1 + 0.9 * I * I), I ** 0.7);
        (Z.push(O),
          j.push(re(0.5 + 2.2 * I, 0.45, 3.4)),
          S.push(ve(0.82, 0.45, I)),
          F.push(ve(0.05, 0.3, I)),
          y.push(ve(4, f.q[v] * 0.08, I)));
      }
      let A = {
        id: U,
        pts: me,
        hw: Z,
        depth: j,
        sed: S,
        speed: F,
        q: y,
        curv: Array.from(Yt(me)),
        cells: [],
        strahler: 1,
        parent: f.id,
        joinNode: v,
        joinAngle: Math.abs((H * 180) / Math.PI),
        kind: "creek",
        navigable: !1,
        tidal: !0,
        lake: -1,
        length: oo(me),
      };
      a.push(A);
      for (let B = 0; B < $; B++) h(me[B * 2], me[B * 2 + 1], Z[B], U);
      if (b < we.creekRecursion && $ > 14) {
        let B = 1 + (c() < 0.55 ? 1 : 0);
        for (let I = 0; I < B; I++) {
          let O = Math.floor(ve($ * 0.35, $ * 0.85, c()));
          O > 2 && O < $ - 2 && d(A, O, b + 1);
        }
      }
    },
    p = Math.round(re(e * 0.7, 120, 440) * we.creekDensity),
    x = a.length;
  for (let f of l) {
    if (a.length - x >= p) break;
    let v = f.hw.length,
      b = Math.round(re(f.length / 240, 1, 7) * we.creekDensity);
    for (let g = 0; g < b; g++) {
      let M = Math.floor(ve(v * 0.12, v * 0.9, (g + 0.35 + c() * 0.3) / b));
      if (a.length - x >= p) break;
      M > 1 && M < v - 2 && d(f, M, 0);
    }
  }
}
function Kn(o, e, t, r) {
  let s = o.reduce((d, p) => Math.max(d, p.strahler), 1),
    c = new Array(s + 1).fill(0),
    a = new Array(s + 1).fill(0),
    n = new Array(s + 1).fill(0),
    i = new Uint8Array(o.length);
  for (let d of o)
    d.parent >= 0 && o[d.parent].strahler === d.strahler && (i[d.parent] = 1);
  for (let d of o)
    ((a[d.strahler] += d.length),
      (d.parent < 0 || o[d.parent].strahler !== d.strahler) &&
        (n[d.strahler] += (d.q[d.q.length - 1] * r * r) / 1e6),
      i[d.id] || c[d.strahler]++);
  let m = (d) => {
      let p = 0,
        x = 0;
      for (let f = 1; f < s; f++) {
        let v = d(f),
          b = d(f + 1);
        v > 0 && b > 0 && ((p += v / b), x++);
      }
      return x ? p / x : 0;
    },
    h = 0;
  for (let d of o) h += d.length;
  let l = 0;
  for (let d = 0; d < t; d++) e[d] || l++;
  return { areaKm: (l * r * r) / 1e6, counts: c, ratio: m, totalLen: h };
}
function Yn(o) {
  let {
      h: e,
      ocean: t,
      plain: r,
      cdist: s,
      N: c,
      cell: a,
      half: n,
      drainage: i,
      rnd: m,
      noise: h,
    } = o,
    l = c * c,
    u = i.accumulation,
    d = i.downstream,
    p = i.order,
    x = (S) => ((S % c) + 0.5) * a - n,
    f = (S) => (((S / c) | 0) + 0.5) * a - n,
    v = (S, F) => {
      let y = Math.round((S + n) / a - 0.5),
        A = Math.round((F + n) / a - 0.5);
      return y < 1 || A < 1 || y >= c - 1 || A >= c - 1 ? -1 : A * c + y;
    },
    b = new Uint8Array(l),
    g = (S) =>
      S < c || S >= l - c || S % c === 0 || S % c === c - 1
        ? 1
        : Math.hypot(e[S + 1] - e[S - 1], e[S + c] - e[S - c]) / (2 * a);
  for (let S = 0; S < l; S++) {
    if (t[S]) continue;
    let F =
        re(1 - ne(0.015, 0.11, g(S)), 0, 1) * re(1 - ne(60, 190, e[S]), 0, 1),
      y = ve(we.accMountain, we.accLowland, F * (0.4 + 0.6 * r[S]));
    u[S] >= y / we.creekDensity && (b[S] = 1);
  }
  for (let S = 0; S < l; S++) {
    let F = p[S];
    if (!b[F]) continue;
    let y = d[F];
    for (let A = 0; A < l && y >= 0 && !t[y] && !b[y]; A++)
      ((b[y] = 1), (y = d[y]));
  }
  let M = new Uint8Array(l);
  for (let S = 0; S < l; S++) {
    if (!b[S]) continue;
    let F = d[S];
    F >= 0 && b[F] && M[F] < 255 && M[F]++;
  }
  let w = new Uint8Array(l),
    E = new Uint8Array(l),
    k = new Uint8Array(l);
  for (let S = l - 1; S >= 0; S--) {
    let F = p[S];
    if (!b[F]) continue;
    w[F] = M[F] === 0 ? 1 : k[F] >= 2 ? E[F] + 1 : E[F];
    let y = d[F];
    y < 0 ||
      !b[y] ||
      (w[F] > E[y] ? ((E[y] = w[F]), (k[y] = 1)) : w[F] === E[y] && k[y]++);
  }
  let R = new Map(),
    H = [];
  for (let S = l - 1; S >= 0; S--) {
    let F = p[S];
    if (!b[F] || M[F] === 1) continue;
    let y = [F],
      A = d[F],
      B = 0;
    for (; A >= 0 && B++ < l && (y.push(A), !(t[A] || !b[A] || M[A] !== 1));)
      A = d[A];
    let I = y[y.length - 1];
    y.length < 2 ||
      (R.set(F, H.length),
      H.push({ cells: y, endJunction: b[I] && !t[I] ? I : -1 }));
  }
  let C = (() => {
    let S = new Map();
    H.forEach((Y, ee) => S.set(Y.cells[0], ee));
    let F = 1,
      y = H.map((Y) => {
        let ee = w[Y.cells[0]] || 1;
        return ((F = Math.max(F, ee)), ee);
      }),
      A = new Array(F + 1).fill(0),
      B = new Array(F + 1).fill(0),
      I = new Array(F + 1).fill(0),
      O = 0;
    H.forEach((Y, ee) => {
      let ie = 0;
      for (let xe = 1; xe < Y.cells.length; xe++)
        ie += Math.hypot(
          x(Y.cells[xe]) - x(Y.cells[xe - 1]),
          f(Y.cells[xe]) - f(Y.cells[xe - 1]),
        );
      O += ie;
      let he = Y.endJunction >= 0 ? S.get(Y.endJunction) : void 0,
        Me = he === void 0 || y[he] !== y[ee];
      ((B[y[ee]] += ie),
        Me && (I[y[ee]] += (u[Y.cells[Y.cells.length - 1]] * a * a) / 1e6));
    });
    let _ = new Uint8Array(H.length);
    (H.forEach((Y, ee) => {
      let ie = Y.endJunction >= 0 ? S.get(Y.endJunction) : void 0;
      ie !== void 0 && y[ie] === y[ee] && (_[ie] = 1);
    }),
      H.forEach((Y, ee) => {
        _[ee] || A[y[ee]]++;
      }));
    let ae = (Y) => {
        let ee = 0,
          ie = 0;
        for (let he = 1; he < F; he++) {
          let Me = Y(he),
            xe = Y(he + 1);
          Me > 0 && xe > 0 && ((ee += Me / xe), ie++);
        }
        return ie ? ee / ie : 0;
      },
      le = (Y) => {
        let ee = 0,
          ie = 0;
        for (let he = 1; he < F; he++) {
          let Me = Y(he),
            xe = Y(he + 1);
          Me > 0 && xe > 0 && ((ee += xe / Me), ie++);
        }
        return ie ? ee / ie : 0;
      };
    return {
      bifurcation: ae((Y) => A[Y]),
      lengthRatio: le((Y) => (A[Y] ? B[Y] / A[Y] : 0)),
      areaRatio: le((Y) => (A[Y] ? I[Y] / A[Y] : 0)),
      totalLen: O,
      counts: A.slice(1),
      orders: Array.from({ length: F }, (Y, ee) => ee + 1),
    };
  })();
  for (let S of H) S.start = S.cells[0];
  for (let S = H.length - 1; S >= 0; S--) {
    let F = H[S].cells,
      y = 0;
    for (; y < F.length && e[F[y]] >= we.maxChannelH;) y++;
    if (F.length - y < 6) {
      H.splice(S, 1);
      continue;
    }
    y > 0 && (H[S].cells = F.slice(y));
  }
  let W = Math.round(re(c * 0.36, 90, 230));
  (H.sort(
    (S, F) => u[F.cells[F.cells.length - 1]] - u[S.cells[S.cells.length - 1]],
  ),
    H.length > W && (H.length = W),
    R.clear());
  for (let S = 0; S < H.length; S++) R.set(H[S].start, S);
  let T = [],
    P = [],
    L = [],
    z = Math.max(8, a),
    D = Math.ceil((c * a) / z) + 2,
    q = new Int32Array(D * D).fill(-1),
    N = new Float32Array(D * D),
    V = (S, F, y, A) => {
      let B = Math.floor((S + n) / z),
        I = Math.floor((F + n) / z),
        O = Math.max(1, Math.ceil(y / z));
      for (let _ = -O; _ <= O; _++)
        for (let ae = -O; ae <= O; ae++) {
          let le = B + ae,
            Y = I + _;
          if (le < 0 || Y < 0 || le >= D || Y >= D) continue;
          let ee = Y * D + le;
          (q[ee] < 0 || N[ee] < y) && ((q[ee] = A), (N[ee] = y));
        }
    },
    G = (S, F, y, A, B) => {
      let I = Math.floor((S + n) / z),
        O = Math.floor((F + n) / z),
        _ = Math.max(1, Math.ceil(y / z));
      for (let ae = -_; ae <= _; ae++)
        for (let le = -_; le <= _; le++) {
          let Y = I + le,
            ee = O + ae;
          if (Y < 0 || ee < 0 || Y >= D || ee >= D) continue;
          let ie = q[ee * D + Y];
          if (ie >= 0 && ie !== A && ie !== B) return ie;
        }
      return -1;
    },
    U = (S) =>
      re(
        we.widthK * Math.sqrt(Math.max(S, 1)),
        we.minHalfWidth,
        we.maxHalfWidth,
      ),
    K = (S) =>
      re(
        we.depthK * Math.pow(Math.max(S, 1), 0.4),
        we.minBedDepth,
        we.maxBedDepth,
      ),
    X = new Map();
  for (let S = 0; S < H.length; S++) {
    let { cells: F, endJunction: y } = H[S],
      A = u[F[F.length - 1]],
      B = U(A),
      I = [];
    for (let oe of F) I.push(x(oe), f(oe));
    let O = To(Ya(I, 3, 2, 1), 3),
      _ = w[H[S].start] || 1,
      ae = ve(we.sinuosityCreek, we.sinuosityMain, re((_ - 1) / 3, 0, 1)),
      le = 0;
    for (let oe = 0; oe < F.length; oe += 3) {
      let Be = F[oe];
      le += re(1 - ne(0.02, 0.13, g(Be)), 0, 1) * (0.45 + 0.55 * r[Be]);
    }
    le = re(le / Math.max(1, Math.ceil(F.length / 3)), 0.12, 1);
    let Y = [],
      ee = wa(O, B * 2, we.migrateSteps, ae, m, Y, 0.35 + 0.95 * le);
    for (let oe of Y) L.push(oe);
    ((ee[0] = I[0]),
      (ee[1] = I[1]),
      (ee[ee.length - 2] = I[I.length - 2]),
      (ee[ee.length - 1] = I[I.length - 1]));
    {
      let oe = Math.min(140, Math.max(26, B * 4.2));
      ee = Ko(ee, () => oe, 1, 1, 90);
    }
    let ie = ee.length / 2;
    if (ie < 6) continue;
    let he = [],
      Me = [],
      xe = [],
      He = [],
      Ae = [],
      Ee = m() * yo,
      We = 0;
    for (let oe = 0; oe < ie; oe++) {
      oe &&
        (We += Math.hypot(
          ee[oe * 2] - ee[oe * 2 - 2],
          ee[oe * 2 + 1] - ee[oe * 2 - 1],
        ));
      let Be = oe / (ie - 1),
        je = Math.max(
          0,
          u[F[Math.min(F.length - 1, Math.round(Be * (F.length - 1)))]],
        ),
        Ke = 1 + we.widthNoise * Math.sin((We / (B * 18)) * yo + Ee);
      (he.push(je),
        Me.push(U(je) * Ke),
        xe.push(K(je)),
        Ae.push(
          re(0.18 + 0.52 * Math.pow(Math.max(je, 1) / 900, 0.22), 0.16, 1.45),
        ),
        He.push(0));
    }
    let Ve = Array.from(Yt(ee)),
      Se = T.length;
    (X.set(H[S].start, Se),
      T.push({
        id: Se,
        pts: ee,
        hw: Me,
        depth: xe,
        sed: He,
        speed: Ae,
        q: he,
        curv: Ve,
        cells: F,
        strahler: _,
        parent: -1,
        joinNode: -1,
        joinAngle: 0,
        kind: "tributary",
        navigable: !1,
        tidal: !1,
        lake: -1,
        length: We,
      }),
      (T[Se]._end = y));
  }
  let J = new Map();
  for (let S of T)
    for (let F = 0; F < S.cells.length - 1; F++) {
      let y = S.cells[F];
      J.has(y) || J.set(y, S.id);
    }
  for (let S of T) {
    let F = S,
      y = S.cells[S.cells.length - 1];
    if (t[y]) {
      F._end = -1;
      continue;
    }
    if (F._end >= 0 && X.has(F._end) && X.get(F._end) !== S.id) continue;
    let A = [],
      B = d[y],
      I = -1;
    for (let ae = 0; ae < 4e3 && B >= 0; ae++) {
      let le = J.get(B);
      if (le !== void 0 && le !== S.id) {
        I = B;
        break;
      }
      if ((A.push(B), t[B])) break;
      B = d[B];
    }
    let O = S.hw.length - 1,
      _ = S.q[O];
    for (let ae of A) _ = Math.max(_, u[ae]);
    I >= 0 && A.push(I);
    for (let ae of A) {
      let le = ae === I ? _ : Math.max(S.q[S.q.length - 1], u[ae]);
      (S.pts.push(x(ae), f(ae)),
        S.hw.push(S.hw[O]),
        S.depth.push(S.depth[O]),
        S.sed.push(S.sed[O]),
        S.speed.push(S.speed[O]),
        S.q.push(le),
        S.cells.push(ae));
    }
    if (A.length >= 2) {
      let ae = Math.max(0, O - 8),
        le = S.pts.slice(ae * 2),
        Y = Ya(le, 3, 3, 1),
        ee = Math.min(140, Math.max(26, S.hw[O] * 4.2));
      Y = Ko(Y, () => ee, 1, 1, 90);
      for (let ie = 0; ie < Y.length; ie++) S.pts[ae * 2 + ie] = Y[ie];
    }
    ((S.curv = Array.from(Yt(S.pts))),
      (S.length = oo(S.pts)),
      (F._end = I >= 0 ? I : -1));
  }
  for (let S of T) {
    let F = S._end;
    if (F < 0) continue;
    let y = X.get(F) ?? J.get(F);
    if (y === void 0 || y === S.id) continue;
    S.parent = y;
    let A = T[y],
      B = S.pts[S.pts.length - 2],
      I = S.pts[S.pts.length - 1],
      O = 0,
      _ = 1 / 0;
    for (let ce = 0; ce < A.hw.length; ce++) {
      let Fe = (A.pts[ce * 2] - B) ** 2 + (A.pts[ce * 2 + 1] - I) ** 2;
      Fe < _ && ((_ = Fe), (O = ce));
    }
    ((S.joinNode = O),
      (S.pts[S.pts.length - 2] = A.pts[O * 2]),
      (S.pts[S.pts.length - 1] = A.pts[O * 2 + 1]));
    let ae = Math.max(0, O - 1),
      le = Math.min(A.hw.length - 1, O + 1),
      Y = A.pts[le * 2] - A.pts[ae * 2],
      ee = A.pts[le * 2 + 1] - A.pts[ae * 2 + 1],
      ie = Math.hypot(Y, ee) || 1,
      he = Y / ie,
      Me = ee / ie,
      xe = S.hw.length,
      He = S.pts[(xe - 1) * 2] - S.pts[(xe - 4) * 2],
      Ae = S.pts[(xe - 1) * 2 + 1] - S.pts[(xe - 4) * 2 + 1],
      Ee = Math.hypot(He, Ae) || 1;
    ((He /= Ee), (Ae /= Ee));
    let We = Math.acos(re(He * he + Ae * Me, -1, 1)),
      Ve = (45 * Math.PI) / 180,
      Se = (75 * Math.PI) / 180,
      oe = S.hw.length,
      Be = (ce) => {
        let Fe = Math.min(4, oe - 3),
          _e = Math.min(oe - 2, Fe + 10),
          Ce = S.pts[(oe - 1) * 2],
          Ye = S.pts[(oe - 1) * 2 + 1];
        for (let ot = oe - 2; ot >= Math.max(0, oe - 1 - _e); ot--) {
          let Mt = oe - 1 - ot,
            Ot = (1 - ne(Fe, _e, Mt)) * ce,
            lt = Math.cos(Ot),
            _t = Math.sin(Ot),
            Ut = S.pts[ot * 2] - Ce,
            It = S.pts[ot * 2 + 1] - Ye;
          ((S.pts[ot * 2] = Ce + Ut * lt - It * _t),
            (S.pts[ot * 2 + 1] = Ye + Ut * _t + It * lt));
        }
        let Xe = S.pts[(oe - 1) * 2] - S.pts[(oe - 4) * 2],
          st = S.pts[(oe - 1) * 2 + 1] - S.pts[(oe - 4) * 2 + 1],
          it = Math.hypot(Xe, st) || 1;
        return (
          (Xe /= it),
          (st /= it),
          Math.acos(re(Xe * he + st * Me, -1, 1))
        );
      };
    if (oe > 6) {
      let ce = 1;
      for (let Fe = 0; Fe < 7; Fe++) {
        let Ce = re(We, Ve, Se) - We;
        if (Math.abs(Ce) < 0.02) break;
        let Ye = Be(Ce * ce);
        Math.abs(re(Ye, Ve, Se) - Ye) > Math.abs(Ce)
          ? (Be(-Ce * ce), (ce = -ce))
          : (We = Ye);
      }
    }
    let je = 0;
    S.joinAngle = (We * 180) / Math.PI;
    let Ke = Math.max(3, Math.round((S.hw[xe - 1] * 2.2) / 8));
    for (let ce = xe - Ke; ce < xe; ce++) {
      if (ce < 1) continue;
      let Fe = (ce - (xe - Ke)) / Ke;
      ((S.hw[ce] *= 1 + 0.8 * Fe * Fe),
        (S.depth[ce] = Math.max(
          S.depth[ce],
          ve(S.depth[ce], A.depth[O] * 1.08, Fe),
        )),
        (S.sed[ce] = Math.max(S.sed[ce], 0.25 * Fe)));
    }
    let ke = Math.min(xe - 1, 14);
    for (let ce = xe - ke; ce < xe; ce++) {
      let Fe = ne(0, 1, (ce - (xe - ke)) / ke);
      S.depth[ce] = Math.max(S.depth[ce], ve(S.depth[ce], A.depth[O], Fe));
    }
    let be = A.hw.length;
    for (let ce = Math.max(0, O - 1); ce < Math.min(be, O + 2); ce++)
      A.depth[ce] += S.depth[xe - 1] * 0.22;
    for (let ce = Math.min(be - 1, O + 3); ce < Math.min(be, O + 7); ce++)
      A.depth[ce] *= 0.88;
  }
  let se = T.filter((S) => S.parent < 0);
  if (
    (se.sort((S, F) => F.q[F.q.length - 1] - S.q[S.q.length - 1]), se.length)
  ) {
    se[0].kind = "main";
    for (let S = 1; S < se.length; S++) se[S].kind = "secondary";
  }
  for (let S of T) {
    let F = Math.floor(S.hw.length / 2),
      y = v(S.pts[0], S.pts[1]),
      A = v(S.pts[F * 2], S.pts[F * 2 + 1]);
    ((S.tidal =
      (y >= 0 && s[y] < 1300 && e[y] < 30) ||
      (A >= 0 && s[A] < 1100 && e[A] < 22)),
      (S.navigable =
        Math.min(...S.hw) >= nt.halfWidth && Math.min(...S.depth) >= nt.depth));
    for (let B = 0; B < S.hw.length; B++)
      V(S.pts[B * 2], S.pts[B * 2 + 1], S.hw[B], S.id);
  }
  for (let S of T) {
    if (S.parent >= 0) continue;
    let F = S.hw.length,
      y = we.estuaryLb,
      A = 0,
      B = new Array(F).fill(0);
    for (let I = F - 2; I >= 0; I--)
      ((A += Math.hypot(
        S.pts[I * 2 + 2] - S.pts[I * 2],
        S.pts[I * 2 + 3] - S.pts[I * 2 + 1],
      )),
        (B[I] = A));
    for (let I = 0; I < F; I++) {
      let O = y * we.estuaryReach - B[I];
      if (O <= 0) continue;
      let _ = Math.exp(O / y) / Math.exp(we.estuaryReach);
      ((S.hw[I] = Math.max(S.hw[I], S.hw[I] * (1 + 2.6 * _))),
        (S.depth[I] = Math.max(S.depth[I], ve(S.depth[I], nt.depth + 2.4, _))),
        (S.sed[I] = Math.max(S.sed[I], 0.55 * _)));
    }
    for (let I = F - 2; I >= 0; I--)
      B[I] < y * we.estuaryReach && (S.hw[I] = Math.min(S.hw[I], S.hw[I + 1]));
  }
  jn({
    N: c,
    h: e,
    ocean: t,
    noise: h,
    rnd: m,
    reaches: T,
    cutoffPool: L,
    idxAt: v,
    nearOther: G,
    stampOcc: V,
  });
  let te = T.find((S) => S.kind === "main");
  if (te && te.hw.length > 26 && m() < 0.85) {
    let S = te.hw.length,
      F = Math.max(3, S - 1 - Math.round(12 + m() * 8)),
      y = S - 1,
      A = [],
      B = [],
      I = [],
      O = [],
      _ = [],
      ae = [],
      le = m() < 0.5 ? 1 : -1;
    for (let Y = F; Y <= y; Y++) {
      let ee = (Y - F) / Math.max(1, y - F),
        ie = Math.sin(ee * Math.PI) * te.hw[Y] * (2.4 + m() * 0),
        he = Math.max(0, Y - 1),
        Me = Math.min(S - 1, Y + 1),
        xe = te.pts[Me * 2] - te.pts[he * 2],
        He = te.pts[Me * 2 + 1] - te.pts[he * 2 + 1],
        Ae = Math.hypot(xe, He) || 1;
      (A.push(
        te.pts[Y * 2] - (He / Ae) * ie * le,
        te.pts[Y * 2 + 1] + (xe / Ae) * ie * le,
      ),
        B.push(te.hw[Y] * ve(0.42, 0.62, Math.sin(ee * Math.PI))),
        I.push(Math.max(nt.depth * 0.9, te.depth[Y] * 0.62)),
        O.push(0.5),
        _.push(te.speed[Y] * 0.7),
        ae.push(te.q[Y] * 0.33));
    }
    A.length >= 12 &&
      T.push({
        id: T.length,
        pts: A,
        hw: B,
        depth: I,
        sed: O,
        speed: _,
        q: ae,
        curv: Array.from(Yt(A)),
        cells: [],
        strahler: te.strahler,
        parent: te.id,
        joinNode: F,
        joinAngle: 32,
        kind: "distributary",
        navigable: !0,
        tidal: !0,
        lake: -1,
        length: oo(A),
      });
  }
  for (let S of L) {
    if (S.length < 10) continue;
    let F = 0,
      y = 0;
    for (let B = 0; B < S.length; B += 2) ((F += S[B]), (y += S[B + 1]));
    let A = S.length / 2;
    P.push({ x: F / A, z: y / A, pts: S, hw: 7 + m() * 5 });
  }
  let { areaKm: me, counts: $, ratio: Z, totalLen: j } = Kn(T, t, l, a);
  return {
    reaches: T,
    oxbows: P,
    stats: {
      bifurcation: C.bifurcation,
      lengthRatio: C.lengthRatio,
      areaRatio: C.areaRatio,
      density: me > 0 ? C.totalLen / 1e3 / me : 0,
      orders: C.orders,
      counts: C.counts,
      wetBifurcation: Z((S) => $[S]),
      wetDensity: me > 0 ? j / 1e3 / me : 0,
      wetCounts: $.slice(1),
    },
  };
}
var Ge = { LAND: 0, SEA: 1, LAKE: 2, RIVER: 3, CREEK: 4, SWAMP: 5, ESTUARY: 6 },
  ya = (o, e, t) => -ko(-o, -e, t);
export { Ge, Yn, Yt, ya };
