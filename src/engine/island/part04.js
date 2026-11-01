// island.js - part 4/21 (statements 41-48 of the original module).
import { refineRiverNetwork } from "../hydrology.js";
import { $o, Ht, Ie, Ko, _n, jo, ko, ne, nt, oo, re, va, ve, we } from "./part01.js";
import { Ge, Yn, Yt, ya } from "./part02.js";
import { Qn, Xn, Zn } from "./part03.js";

function* Xa(o, e, t, r, s, c, a, n, i) {
  let m = s * s,
    h = Ie(n ^ 1799596469),
    l = new Ht(n ^ 1369957329),
    u = new Uint8Array(m);
  for (let y = 0; y < m; y++) u[y] = e[y] === 1 ? 1 : 0;
  let d = (y) => ((y % s) + 0.5) * c - a,
    p = (y) => (((y / s) | 0) + 0.5) * c - a,
    x = (y, A) => {
      let B = Math.round((y + a) / c - 0.5),
        I = Math.round((A + a) / c - 0.5);
      return B < 0 || I < 0 || B >= s || I >= s ? -1 : I * s + B;
    },
    f = new Set(),
    v = () => {
      for (let I = 0; I < 24; I++) {
        let O = $o[(h() * $o.length) | 0] + jo[(h() * jo.length) | 0];
        if (!f.has(O)) return (f.add(O), O);
      }
      let y = $o[(h() * $o.length) | 0] + jo[(h() * jo.length) | 0],
        A = 2,
        B = `${y} ${A}`;
      for (; f.has(B);) B = `${y} ${++A}`;
      return (f.add(B), B);
    };
  for (let y = 0; y < m; y++) {
    if (u[y]) continue;
    let A = d(y),
      B = p(y),
      I = 1 - ne(200, 1250, t[y]);
    if (I <= 0.001) continue;
    let O = ve(24, 70, re(0.5 + 0.6 * l.fbm(A / 1300, B / 1300, 3), 0, 1)) * I;
    if (O < 6) continue;
    let _ = l.fbm(A / 140, B / 140, 3) * 1.4;
    o[y] = Math.max(0.3, _n(o[y], O, 0.06) + _ * (1 - ne(0, O, o[y])) * I);
  }
  yield { label: "Flooding the coastal lowland", p: 0.08 };
  let b = va(o, s);
  yield { label: "Tracing catchments", p: 0.16 };
  let LSD_ = new Float32Array(m).fill(1e9),
    g = new Int16Array(m).fill(-1),
    M = Yn({
      h: o,
      ocean: u,
      plain: r,
      cdist: t,
      lakeId: g,
      lakeCount: 0,
      N: s,
      cell: c,
      half: a,
      drainage: b,
      rnd: h,
      noise: l,
      isHome: i,
    });
  refineRiverNetwork(M);
  yield { label: "Growing the river network", p: 0.38 };
  let w = [],
    E = i ? 3 : s >= 480 ? 2 : 1,
    k = re(s / 600, 0.72, 1.06),
    R = [],
    H = M.reaches
      .filter(
        (y) =>
          y.kind === "main" ||
          y.kind === "secondary" ||
          (y.kind === "tributary" && y.strahler >= 2),
      )
      .sort((y, A) => A.length - y.length);
  for (let y = 0; y < E; y++) {
    let A = we.lakeRadius * k * (y === 0 ? 1.1 : y === 1 ? 0.84 : 0.7),
      B = null,
      I = -1 / 0;
    for (let O = 0; O < 4 && !B; O++, A *= 0.92) {
      let _ = A * (O < 2 ? 2.8 : 2),
        ae = A * (O < 1 ? 2.9 : O < 3 ? 2.5 : 2);
      for (let le of H) {
        let Y = le.hw.length;
        if (!(le.length < _))
          for (
            let ee = Math.round(Y * 0.22);
            ee < Math.round(Y * 0.78);
            ee += 3
          ) {
            let ie = le.pts[ee * 2],
              he = le.pts[ee * 2 + 1],
              Me = x(ie, he);
            if (
              Me < 0 ||
              u[Me] ||
              t[Me] < ae ||
              R.some(
                (Se) => Math.hypot(ie - Se.x, he - Se.z) < A + Se.r + 320,
              ) ||
              w.some(() => !1)
            )
              continue;
            let xe = 0,
              He = 0,
              Ae = 0;
            for (let Se = 0; Se < 16; Se++) {
              let oe = Math.cos((Se * Math.PI) / 8),
                Be = Math.sin((Se * Math.PI) / 8),
                je = x(ie + oe * A * 1.55, he + Be * A * 1.55);
              je >= 0 && !u[je] && ((xe += o[je]), He++);
              let Ke = x(ie + oe * A * 2.8, he + Be * A * 2.8);
              Ke >= 0 && !u[Ke] && Ae++;
            }
            if (He < (O < 2 ? 15 : 13) || Ae < (O < 3 ? 15 : 13)) continue;
            let Ee = xe / He - o[Me],
              We = 0;
            for (let Se of M.reaches)
              if (!(Se.id === le.id || Se.parent === le.id))
                for (let oe = 0; oe < Se.hw.length; oe += 3)
                  Math.hypot(Se.pts[oe * 2] - ie, Se.pts[oe * 2 + 1] - he) <
                    A * 2.6 && We++;
            let Ve =
              Ee * 0.3 +
              t[Me] / 140 +
              r[Me] * 6 +
              le.strahler * 4 +
              h() * 5 -
              We * 0.8;
            Ve > I &&
              ((I = Ve),
              (B = { x: ie, z: he, r: A, reach: le, node: ee, lake: null }));
          }
      }
    }
    B &&
      ((B.lake = {
        name: `Lake ${v()}`,
        x: B.x,
        z: B.z,
        r: A,
        level: we.datum,
        area: 0,
        maxDepth: 0,
        meanDepth: 0,
      }),
      R.push(B),
      w.push(B.lake));
  }
  for (let y = 0; y < R.length; y++) {
    let A = R[y],
      B = A.r,
      I = A.reach.hw.length,
      O = Math.max(0, A.node - 2),
      _ = Math.min(I - 1, A.node + 2),
      ae = A.reach.pts[_ * 2] - A.reach.pts[O * 2],
      le = A.reach.pts[_ * 2 + 1] - A.reach.pts[O * 2 + 1],
      Y = Math.hypot(ae, le) || 1,
      ee = ae / Y,
      ie = le / Y,
      he = B * 3.1,
      Me = Math.max(1, Math.floor((A.x - he + a) / c)),
      xe = Math.min(s - 2, Math.ceil((A.x + he + a) / c)),
      He = Math.max(1, Math.floor((A.z - he + a) / c)),
      Ae = Math.min(s - 2, Math.ceil((A.z + he + a) / c)),
      Ee = h() * 60,
      We = we.lakeDepth * (0.84 + h() * 0.3);
    for (let Ve = He; Ve <= Ae; Ve++)
      for (let Se = Me; Se <= xe; Se++) {
        let oe = Ve * s + Se;
        if (u[oe]) continue;
        let Be = d(oe),
          je = p(oe),
          Ke = Be - A.x,
          ke = je - A.z,
          be = Math.hypot(Ke, ke) / B;
        if (be < 1.04 || be > 3.05) continue;
        let ce = 1e9;
        for (let st = 0; st < I; st += 2) {
          let it = A.reach.pts[st * 2] - Be,
            ot = A.reach.pts[st * 2 + 1] - je,
            Mt = it * it + ot * ot;
          Mt < ce && (ce = Mt);
        }
        ce = Math.sqrt(ce);
        let Fe =
            1 -
            ne(45 + A.reach.hw[A.node] * 1.6, 210 + A.reach.hw[A.node] * 3, ce),
          _e = ne(1.03, 2, be) * (1 - ne(2.3, 3, be)),
          Ce = l.ridged((Be + y * 97) / 400, (je - y * 79) / 400, 5),
          Ye = l.fbm(Be / 150 + y * 13, je / 150, 3),
          Xe =
            0.55 + 0.45 * ne(-0.25, 0.22, l.fbm(Be / 460 + y * 7, je / 460, 3));
        o[oe] += _e * (46 + we.ridgeHeight * Ce + 22 * Ye) * Xe * (1 - Fe);
      }
    for (let Ve = He; Ve <= Ae; Ve++)
      for (let Se = Me; Se <= xe; Se++) {
        let oe = Ve * s + Se;
        if (u[oe] || g[oe] >= 0) continue;
        let Be = d(oe),
          je = p(oe),
          Ke = Be - A.x,
          ke = je - A.z,
          be = (Ke * ee + ke * ie) / B,
          ce = (-Ke * ie + ke * ee) / B,
          Fe = l.fbm(be * 4.7 + Ee, ce * 4.7, 3) * 0.14,
          _e =
            Math.min(
              Math.hypot(be / 1.15, (ce + 0.1 * Math.sin(be * 2.6)) / 0.8),
              Math.hypot((be - 0.56) / 0.6, (ce - 0.3) / 0.6),
              Math.hypot((be + 0.7) / 0.56, (ce + 0.2) / 0.52),
            ) + Fe;
        if (((LSD_[oe] = Math.min(LSD_[oe], (_e - 1) * B)), _e < 1)) {
          let Ce = (1 - _e) * B,
            Ye = 0.35 + 1.6 * ne(0, we.shelfWidth, Ce),
            Xe = We * Math.pow(ne(12, B * 0.78, Ce), 0.86);
          ((o[oe] = Math.min(o[oe], we.datum - Ye - Xe)), (g[oe] = y));
        } else if (_e < 1.8) {
          let Ce = (_e - 1) * B,
            Ye =
              we.datum +
              0.2 +
              0.07 * Math.min(Ce, 26) +
              0.3 * Math.max(0, Ce - 26),
            Xe = 1 - ne(B * 0.55, B * 0.74, Ce);
          o[oe] = ve(o[oe], Math.min(o[oe], Ye), Xe);
        }
      }
    ((A.lake.outletCell = x(
      A.reach.pts[(I - 1) * 2],
      A.reach.pts[(I - 1) * 2 + 1],
    )),
      yield {
        label: "Drowning the lake basins",
        p: 0.4 + (0.08 * (y + 1)) / Math.max(1, R.length),
      });
  }
  for (let y of R) {
    let A = y.reach,
      B = A.hw.length,
      I = 0;
    for (let O = y.node + 1; O < B; O++) {
      if (
        ((I += Math.hypot(
          A.pts[O * 2] - A.pts[O * 2 - 2],
          A.pts[O * 2 + 1] - A.pts[O * 2 - 1],
        )),
        I < 150)
      )
        continue;
      let _ = A.pts[O * 2] - y.x,
        ae = A.pts[O * 2 + 1] - y.z,
        le = Math.hypot(_, ae) || 1,
        Y = y.r * 1.35;
      if (le >= Y) continue;
      let ee = (Y - le) * ne(150, 420, I);
      ((A.pts[O * 2] += (_ / le) * ee), (A.pts[O * 2 + 1] += (ae / le) * ee));
    }
    ((A.pts = Ko(
      A.pts,
      (O) => Math.min(140, Math.max(26, A.hw[O] * 4.2)),
      2,
      2,
      90,
    )),
      (A.curv = Array.from(Yt(A.pts))),
      (A.length = oo(A.pts)));
  }
  let C = new Set(),
    W = (y) => {
      for (let A = 0; y && A < 64; A++)
        (C.add(y.id), (y = y.parent >= 0 ? M.reaches[y.parent] : void 0));
    };
  W(M.reaches.find((y) => y.kind === "main"));
  for (let y of R) W(y.reach);
  for (let y of M.reaches) y.kind === "distributary" && C.add(y.id);
  for (let y of C) {
    let A = M.reaches[y];
    A.navigable = !0;
    for (let B = 0; B < A.hw.length; B++)
      ((A.hw[B] = Math.max(A.hw[B], nt.halfWidth + 2.6)),
        (A.depth[B] = Math.max(A.depth[B], nt.depth + 0.6)));
  }
  let T = (y, A) =>
    y.kind === "creek" ? 0.72 : 0.42 + 0.3 * re(y.q[A] / 2500, 0, 1);
  for (let y of R) {
    let A = y.reach,
      B = A.hw.length,
      I = 0;
    for (let O = 0; O < B; O++) {
      let _ = Math.hypot(A.pts[O * 2] - y.x, A.pts[O * 2 + 1] - y.z) / y.r,
        ae = 1 - ne(0.85, 1.95, _);
      ((A.hw[O] *= 1 + 1.35 * ae * ae),
        (A.depth[O] = Math.max(A.depth[O], ve(A.depth[O], nt.depth + 1.2, ae))),
        O < y.node
          ? (A.sed[O] = Math.max(A.sed[O] || T(A, O), 0.46))
          : (O > y.node &&
              (I += Math.hypot(
                A.pts[O * 2] - A.pts[O * 2 - 2],
                A.pts[O * 2 + 1] - A.pts[O * 2 - 1],
              )),
            (A.sed[O] = ve(0.1, T(A, O), ne(0, 900, I) * (1 - ae)))));
    }
  }
  for (let y of M.reaches) {
    if (y.parent >= 0) continue;
    let A = 0;
    for (
      let B = y.hw.length - 2;
      B >= 0 &&
      ((A += Math.hypot(
        y.pts[B * 2 + 2] - y.pts[B * 2],
        y.pts[B * 2 + 3] - y.pts[B * 2 + 1],
      )),
      !(A > we.estuaryLb * we.estuaryReach));
      B--
    )
      y.hw[B] = Math.min(y.hw[B], y.hw[B + 1]);
  }
  let P = new Float32Array(m),
    L = new Uint8Array(m),
    z = new Float32Array(m),
    D = new Float32Array(m),
    q = new Float32Array(m),
    N = new Float32Array(m),
    V = new Float32Array(m).fill(1e9),
    G = new Uint8Array(m),
    U = new Uint8Array(m),
    K = new Float32Array(m),
    X = new Float32Array(m),
    J = (y) => {
      let A = y.hw.length,
        B = y.parent < 0;
      for (let I = 0; I + 1 < A; I++) {
        let O = y.pts[I * 2],
          _ = y.pts[I * 2 + 1],
          ae = y.pts[I * 2 + 2],
          le = y.pts[I * 2 + 3],
          Y = ae - O,
          ee = le - _,
          ie = Y * Y + ee * ee || 1,
          he = Math.sqrt(ie),
          xe = Math.max(y.hw[I], y.hw[I + 1]) + we.bankWidth + 34,
          He = Math.max(1, Math.floor((Math.min(O, ae) - xe + a) / c)),
          Ae = Math.min(s - 2, Math.ceil((Math.max(O, ae) + xe + a) / c)),
          Ee = Math.max(1, Math.floor((Math.min(_, le) - xe + a) / c)),
          We = Math.min(s - 2, Math.ceil((Math.max(_, le) + xe + a) / c));
        for (let Ve = Ee; Ve <= We; Ve++)
          for (let Se = He; Se <= Ae; Se++) {
            let oe = Ve * s + Se;
            if (u[oe] || g[oe] >= 0) continue;
            let Be = d(oe),
              je = p(oe),
              Ke = re(((Be - O) * Y + (je - _) * ee) / ie, 0, 1),
              ke = O + Y * Ke,
              be = _ + ee * Ke,
              ce = ((Be - ke) * ee - (je - be) * Y) / he,
              Fe = Math.hypot(Be - ke, je - be),
              _e = ve(y.hw[I], y.hw[I + 1], Ke),
              Ce = Math.max(_e, c * 0.75),
              Ye = ve(y.depth[I], y.depth[I + 1], Ke),
              Xe = ve(y.curv[I], y.curv[I + 1], Ke),
              st = re(Xe * Ce * 26, -0.42, 0.42),
              it = ce / Ce - st,
              ot = Math.max(0, 1 - it * it),
              Mt = 1 + 0.35 * Math.sign(Xe) * re(ce / Ce, -1, 1),
              Ct = Ye * Math.pow(ot, 1.25) * re(Mt, 0.55, 1.4),
              Ot = C.has(y.id) && Math.abs(ce) < _e * 0.62;
            if ((Ot && (Ct = Math.max(Ct, nt.depth + 0.35)), Fe < Ce)) {
              ((P[oe] = ya(P[oe], Math.max(Ct, 0.22), 1.1)), (L[oe] = 1));
              let Tt =
                ve(y.speed[I], y.speed[I + 1], Ke) *
                Math.pow(Math.max(ot, 0.05), 0.3);
              Tt > Math.hypot(z[oe], D[oe]) &&
                ((z[oe] = (Y / he) * Tt), (D[oe] = (ee / he) * Tt));
              let $t = re(-Math.sign(Xe) * (ce / Ce), 0, 1),
                Dt = ve(y.sed[I], y.sed[I + 1], Ke) || T(y, I);
              Ce >= N[oe] && ((q[oe] = re(Dt - $t * 0.22, 0, 1)), (N[oe] = Ce));
              let jt =
                y.kind === "creek"
                  ? Ge.CREEK
                  : B && Ke > 0 && t[oe] < 420
                    ? Ge.ESTUARY
                    : Ge.RIVER;
              ((G[oe] === Ge.LAND || jt === Ge.RIVER) && (G[oe] = jt),
                (Ot || (_e >= nt.halfWidth && Ct >= nt.depth)) && (U[oe] = 1));
            }
            V[oe] = Math.min(V[oe], Math.max(0, Fe - Ce));
            let lt = 1 - ne(10, 75, o[oe]),
              _t = ve(0.3, 1, lt),
              Ut = (we.bankWidth + 18 + Ce * 2.2) * _t,
              It = Ut + (35 + 35 * lt) + Ce * 2.5 * _t,
              qt = 1 - ne(Ce + Ut * 0.6, Ce + It, Fe);
            if (qt > 0.001) {
              let Tt = ne(Ce, Ce + we.bankWidth, Fe),
                $t = Math.max(0, Fe - Ce - Ut),
                Dt =
                  we.datum +
                  0.22 +
                  Tt * we.valleyFloor +
                  $t * $t * 0.0065 +
                  $t * 0.06;
              ((X[oe] = K[oe] > 0 ? ko(X[oe], Dt, 4) : Dt),
                (K[oe] = Math.max(K[oe], qt)));
            }
          }
      }
    };
  refineRiverNetwork(M);
  for (let y of M.reaches) J(y);
  yield { label: "Carving drowned valleys", p: 0.62 };
  let se = {
    N: s,
    cell: c,
    half: a,
    isHome: i,
    h: o,
    cdist: t,
    ocean: u,
    noise: l,
    lakeId: g,
    xOf: d,
    zOf: p,
    idxAt: x,
    name: v,
    net: M,
    basins: R,
    lakes: w,
    bed: P,
    wet: L,
    flowX: z,
    flowZ: D,
    sed: q,
    bankD: V,
    body: G,
    navMask: U,
    floorH: X,
    floorW: K,
  };
  (Xn(se), yield { label: "Setting every surface to the datum", p: 0.72 });
  let { rivers: te, marshes: me, swamp: $ } = Qn(se);
  yield { label: "Spreading mangrove wetland", p: 0.86 };
  let { level: Z, nearLevel: j, inl: S, fresh: F } = Zn(se, $);
  return (
    yield { label: "Mapping banks, currents and sediment", p: 1 },
    {
      lakeSD: LSD_,
      inl: S,
      fresh: F,
      swamp: $,
      flowX: z,
      flowZ: D,
      wet: L,
      level: Z,
      nearLevel: j,
      lakeId: g,
      accumulation: b.accumulation,
      downstream: b.downstream,
      rivers: te,
      lakes: w,
      marshes: me,
      sed: q,
      body: G,
      bankDist: V,
      navMask: U,
      netStats: M.stats,
    }
  );
}
function uo(o, e, t, r, s = 0) {
  let c = (t + o.half) / o.cell - 0.5,
    a = (r + o.half) / o.cell - 0.5;
  if (c < 0 || a < 0 || c >= o.N - 1 || a >= o.N - 1) return s;
  let n = c | 0,
    i = a | 0,
    m = c - n,
    h = a - i,
    l = i * o.N + n;
  return (
    e[l] * (1 - m) * (1 - h) +
    e[l + 1] * m * (1 - h) +
    e[l + o.N] * (1 - m) * h +
    e[l + o.N + 1] * m * h
  );
}
function Wt(o, e, t) {
  return uo(o, o.h, e, t, -40);
}
function ao(o, e, t) {
  let r = Math.round((e + o.half) / o.cell - 0.5),
    s = Math.round((t + o.half) / o.cell - 0.5);
  return r < 0 || s < 0 || r >= o.N || s >= o.N ? -1 : s * o.N + r;
}
function Ho(o, e, t) {
  let r = Wt(o, e, t),
    s = ao(o, e, t),
    c = s >= 0 ? o.body[s] : r <= 0 ? Ge.SEA : Ge.LAND;
  return r <= 0
    ? { type: 1, level: 0, depth: -r, bed: r, body: c === Ge.LAND ? Ge.SEA : c }
    : { type: 0, level: 0, depth: 0, bed: r, body: Ge.LAND };
}
function Jn(o, e, t) {
  let r = ao(o, e, t);
  return r < 0 ? Ge.SEA : o.h[r] > 0 ? Ge.LAND : o.body[r];
}
var er = [
    "Vei",
    "Kara",
    "Oma",
    "Sel",
    "Tala",
    "Mor",
    "Anu",
    "Rhi",
    "Esk",
    "Vala",
    "Ner",
    "Suru",
    "Ilo",
    "Haka",
    "Pel",
    "Tava",
    "Noa",
    "Keri",
  ],
  tr = [
    "ra",
    "mar",
    "noa",
    "thea",
    "ven",
    "dura",
    "sae",
    "lin",
    "kai",
    "wen",
    "tor",
    "mina",
    "lua",
    "ssa",
  ];
function Ws(o, e) {
  let t = er[(o() * er.length) | 0] + tr[(o() * tr.length) | 0];
  return e ? `${t} ${e}` : t;
}
export { Ho, Jn, Ws, Wt, Xa, ao, uo };
