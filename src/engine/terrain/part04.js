// terrain.worker.js - part 4/9 (statements 31-33 of the original module).
import { refineRiverNetwork } from "../hydrology.js";
import { At, Ct, Fe, Jt, at, bt, et, hn, it, jt, ke, me, ve, we } from "./part01.js";
import { Pe, Wt, Zt, xn } from "./part02.js";
import { Mn, gn, yn } from "./part03.js";

function* Ve(o, n, e, r, a, f, t, l, c) {
  let p = a * a,
    h = At(l ^ 1799596469),
    i = new jt(l ^ 1369957329),
    x = new Uint8Array(p);
  for (let s = 0; s < p; s++) x[s] = n[s] === 1 ? 1 : 0;
  let M = (s) => ((s % a) + 0.5) * f - t,
    g = (s) => (((s / a) | 0) + 0.5) * f - t,
    w = (s, m) => {
      let k = Math.round((s + t) / f - 0.5),
        F = Math.round((m + t) / f - 0.5);
      return k < 0 || F < 0 || k >= a || F >= a ? -1 : F * a + k;
    },
    y = new Set(),
    b = () => {
      for (let F = 0; F < 24; F++) {
        let C = ve[(h() * ve.length) | 0] + we[(h() * we.length) | 0];
        if (!y.has(C)) return (y.add(C), C);
      }
      let s = ve[(h() * ve.length) | 0] + we[(h() * we.length) | 0],
        m = 2,
        k = `${s} ${m}`;
      for (; y.has(k);) k = `${s} ${++m}`;
      return (y.add(k), k);
    };
  for (let s = 0; s < p; s++) {
    if (x[s]) continue;
    let m = M(s),
      k = g(s),
      F = 1 - et(200, 1250, e[s]);
    if (F <= 0.001) continue;
    let C = bt(24, 70, at(0.5 + 0.6 * i.fbm(m / 1300, k / 1300, 3), 0, 1)) * F;
    if (C < 6) continue;
    let P = i.fbm(m / 140, k / 140, 3) * 1.4;
    o[s] = Math.max(0.3, hn(o[s], C, 0.06) + P * (1 - et(0, C, o[s])) * F);
  }
  yield { label: "Flooding the coastal lowland", p: 0.08 };
  let v = Fe(o, a);
  yield { label: "Tracing catchments", p: 0.16 };
  let LSD_ = new Float32Array(p).fill(1e9),
    A = new Int16Array(p).fill(-1),
    E = xn({
      h: o,
      ocean: x,
      plain: r,
      cdist: e,
      lakeId: A,
      lakeCount: 0,
      N: a,
      cell: f,
      half: t,
      drainage: v,
      rnd: h,
      noise: i,
      isHome: c,
    });
  refineRiverNetwork(E);
  yield { label: "Growing the river network", p: 0.38 };
  let H = [],
    R = c ? 3 : a >= 480 ? 2 : 1,
    D = at(a / 600, 0.72, 1.06),
    z = [],
    T = E.reaches
      .filter(
        (s) =>
          s.kind === "main" ||
          s.kind === "secondary" ||
          (s.kind === "tributary" && s.strahler >= 2),
      )
      .sort((s, m) => m.length - s.length);
  for (let s = 0; s < R; s++) {
    let m = it.lakeRadius * D * (s === 0 ? 1.1 : s === 1 ? 0.84 : 0.7),
      k = null,
      F = -1 / 0;
    for (let C = 0; C < 4 && !k; C++, m *= 0.92) {
      let P = m * (C < 2 ? 2.8 : 2),
        _ = m * (C < 1 ? 2.9 : C < 3 ? 2.5 : 2);
      for (let ot of T) {
        let U = ot.hw.length;
        if (!(ot.length < P))
          for (let $ = Math.round(U * 0.22); $ < Math.round(U * 0.78); $ += 3) {
            let N = ot.pts[$ * 2],
              ut = ot.pts[$ * 2 + 1],
              xt = w(N, ut);
            if (
              xt < 0 ||
              x[xt] ||
              e[xt] < _ ||
              z.some(
                (yt) => Math.hypot(N - yt.x, ut - yt.z) < m + yt.r + 320,
              ) ||
              H.some(() => !1)
            )
              continue;
            let mt = 0,
              wt = 0,
              St = 0;
            for (let yt = 0; yt < 16; yt++) {
              let X = Math.cos((yt * Math.PI) / 8),
                Rt = Math.sin((yt * Math.PI) / 8),
                Tt = w(N + X * m * 1.55, ut + Rt * m * 1.55);
              Tt >= 0 && !x[Tt] && ((mt += o[Tt]), wt++);
              let Ft = w(N + X * m * 2.8, ut + Rt * m * 2.8);
              Ft >= 0 && !x[Ft] && St++;
            }
            if (wt < (C < 2 ? 15 : 13) || St < (C < 3 ? 15 : 13)) continue;
            let Vt = mt / wt - o[xt],
              Ht = 0;
            for (let yt of E.reaches)
              if (!(yt.id === ot.id || yt.parent === ot.id))
                for (let X = 0; X < yt.hw.length; X += 3)
                  Math.hypot(yt.pts[X * 2] - N, yt.pts[X * 2 + 1] - ut) <
                    m * 2.6 && Ht++;
            let kt =
              Vt * 0.3 +
              e[xt] / 140 +
              r[xt] * 6 +
              ot.strahler * 4 +
              h() * 5 -
              Ht * 0.8;
            kt > F &&
              ((F = kt),
              (k = { x: N, z: ut, r: m, reach: ot, node: $, lake: null }));
          }
      }
    }
    k &&
      ((k.lake = {
        name: `Lake ${b()}`,
        x: k.x,
        z: k.z,
        r: m,
        level: it.datum,
        area: 0,
        maxDepth: 0,
        meanDepth: 0,
      }),
      z.push(k),
      H.push(k.lake));
  }
  for (let s = 0; s < z.length; s++) {
    let m = z[s],
      k = m.r,
      F = m.reach.hw.length,
      C = Math.max(0, m.node - 2),
      P = Math.min(F - 1, m.node + 2),
      _ = m.reach.pts[P * 2] - m.reach.pts[C * 2],
      ot = m.reach.pts[P * 2 + 1] - m.reach.pts[C * 2 + 1],
      U = Math.hypot(_, ot) || 1,
      $ = _ / U,
      N = ot / U,
      ut = k * 3.1,
      xt = Math.max(1, Math.floor((m.x - ut + t) / f)),
      mt = Math.min(a - 2, Math.ceil((m.x + ut + t) / f)),
      wt = Math.max(1, Math.floor((m.z - ut + t) / f)),
      St = Math.min(a - 2, Math.ceil((m.z + ut + t) / f)),
      Vt = h() * 60,
      Ht = it.lakeDepth * (0.84 + h() * 0.3);
    for (let kt = wt; kt <= St; kt++)
      for (let yt = xt; yt <= mt; yt++) {
        let X = kt * a + yt;
        if (x[X]) continue;
        let Rt = M(X),
          Tt = g(X),
          Ft = Rt - m.x,
          Mt = Tt - m.z,
          ht = Math.hypot(Ft, Mt) / k;
        if (ht < 1.04 || ht > 3.05) continue;
        let Q = 1e9;
        for (let Bt = 0; Bt < F; Bt += 2) {
          let Lt = m.reach.pts[Bt * 2] - Rt,
            Pt = m.reach.pts[Bt * 2 + 1] - Tt,
            _t = Lt * Lt + Pt * Pt;
          _t < Q && (Q = _t);
        }
        Q = Math.sqrt(Q);
        let gt =
            1 -
            et(45 + m.reach.hw[m.node] * 1.6, 210 + m.reach.hw[m.node] * 3, Q),
          Et = et(1.03, 2, ht) * (1 - et(2.3, 3, ht)),
          vt = i.ridged((Rt + s * 97) / 400, (Tt - s * 79) / 400, 5),
          Dt = i.fbm(Rt / 150 + s * 13, Tt / 150, 3),
          It =
            0.55 + 0.45 * et(-0.25, 0.22, i.fbm(Rt / 460 + s * 7, Tt / 460, 3));
        o[X] += Et * (46 + it.ridgeHeight * vt + 22 * Dt) * It * (1 - gt);
      }
    for (let kt = wt; kt <= St; kt++)
      for (let yt = xt; yt <= mt; yt++) {
        let X = kt * a + yt;
        if (x[X] || A[X] >= 0) continue;
        let Rt = M(X),
          Tt = g(X),
          Ft = Rt - m.x,
          Mt = Tt - m.z,
          ht = (Ft * $ + Mt * N) / k,
          Q = (-Ft * N + Mt * $) / k,
          gt = i.fbm(ht * 4.7 + Vt, Q * 4.7, 3) * 0.14,
          Et =
            Math.min(
              Math.hypot(ht / 1.15, (Q + 0.1 * Math.sin(ht * 2.6)) / 0.8),
              Math.hypot((ht - 0.56) / 0.6, (Q - 0.3) / 0.6),
              Math.hypot((ht + 0.7) / 0.56, (Q + 0.2) / 0.52),
            ) + gt;
        if (((LSD_[X] = Math.min(LSD_[X], (Et - 1) * k)), Et < 1)) {
          let vt = (1 - Et) * k,
            Dt = 0.35 + 1.6 * et(0, it.shelfWidth, vt),
            It = Ht * Math.pow(et(12, k * 0.78, vt), 0.86);
          ((o[X] = Math.min(o[X], it.datum - Dt - It)), (A[X] = s));
        } else if (Et < 1.8) {
          let vt = (Et - 1) * k,
            Dt =
              it.datum +
              0.2 +
              0.07 * Math.min(vt, 26) +
              0.3 * Math.max(0, vt - 26),
            It = 1 - et(k * 0.55, k * 0.74, vt);
          o[X] = bt(o[X], Math.min(o[X], Dt), It);
        }
      }
    ((m.lake.outletCell = w(
      m.reach.pts[(F - 1) * 2],
      m.reach.pts[(F - 1) * 2 + 1],
    )),
      yield {
        label: "Drowning the lake basins",
        p: 0.4 + (0.08 * (s + 1)) / Math.max(1, z.length),
      });
  }
  for (let s of z) {
    let m = s.reach,
      k = m.hw.length,
      F = 0;
    for (let C = s.node + 1; C < k; C++) {
      if (
        ((F += Math.hypot(
          m.pts[C * 2] - m.pts[C * 2 - 2],
          m.pts[C * 2 + 1] - m.pts[C * 2 - 1],
        )),
        F < 150)
      )
        continue;
      let P = m.pts[C * 2] - s.x,
        _ = m.pts[C * 2 + 1] - s.z,
        ot = Math.hypot(P, _) || 1,
        U = s.r * 1.35;
      if (ot >= U) continue;
      let $ = (U - ot) * et(150, 420, F);
      ((m.pts[C * 2] += (P / ot) * $), (m.pts[C * 2 + 1] += (_ / ot) * $));
    }
    ((m.pts = ke(
      m.pts,
      (C) => Math.min(140, Math.max(26, m.hw[C] * 4.2)),
      2,
      2,
      90,
    )),
      (m.curv = Array.from(Zt(m.pts))),
      (m.length = Jt(m.pts)));
  }
  let I = new Set(),
    B = (s) => {
      for (let m = 0; s && m < 64; m++)
        (I.add(s.id), (s = s.parent >= 0 ? E.reaches[s.parent] : void 0));
    };
  B(E.reaches.find((s) => s.kind === "main"));
  for (let s of z) B(s.reach);
  for (let s of E.reaches) s.kind === "distributary" && I.add(s.id);
  for (let s of I) {
    let m = E.reaches[s];
    m.navigable = !0;
    for (let k = 0; k < m.hw.length; k++)
      ((m.hw[k] = Math.max(m.hw[k], Ct.halfWidth + 2.6)),
        (m.depth[k] = Math.max(m.depth[k], Ct.depth + 0.6)));
  }
  let W = (s, m) =>
    s.kind === "creek" ? 0.72 : 0.42 + 0.3 * at(s.q[m] / 2500, 0, 1);
  for (let s of z) {
    let m = s.reach,
      k = m.hw.length,
      F = 0;
    for (let C = 0; C < k; C++) {
      let P = Math.hypot(m.pts[C * 2] - s.x, m.pts[C * 2 + 1] - s.z) / s.r,
        _ = 1 - et(0.85, 1.95, P);
      ((m.hw[C] *= 1 + 1.35 * _ * _),
        (m.depth[C] = Math.max(m.depth[C], bt(m.depth[C], Ct.depth + 1.2, _))),
        C < s.node
          ? (m.sed[C] = Math.max(m.sed[C] || W(m, C), 0.46))
          : (C > s.node &&
              (F += Math.hypot(
                m.pts[C * 2] - m.pts[C * 2 - 2],
                m.pts[C * 2 + 1] - m.pts[C * 2 - 1],
              )),
            (m.sed[C] = bt(0.1, W(m, C), et(0, 900, F) * (1 - _)))));
    }
  }
  for (let s of E.reaches) {
    if (s.parent >= 0) continue;
    let m = 0;
    for (
      let k = s.hw.length - 2;
      k >= 0 &&
      ((m += Math.hypot(
        s.pts[k * 2 + 2] - s.pts[k * 2],
        s.pts[k * 2 + 3] - s.pts[k * 2 + 1],
      )),
      !(m > it.estuaryLb * it.estuaryReach));
      k--
    )
      s.hw[k] = Math.min(s.hw[k], s.hw[k + 1]);
  }
  let G = new Float32Array(p),
    O = new Uint8Array(p),
    S = new Float32Array(p),
    L = new Float32Array(p),
    Z = new Float32Array(p),
    q = new Float32Array(p),
    K = new Float32Array(p).fill(1e9),
    V = new Uint8Array(p),
    Y = new Uint8Array(p),
    J = new Float32Array(p),
    tt = new Float32Array(p),
    ct = (s) => {
      let m = s.hw.length,
        k = s.parent < 0;
      for (let F = 0; F + 1 < m; F++) {
        let C = s.pts[F * 2],
          P = s.pts[F * 2 + 1],
          _ = s.pts[F * 2 + 2],
          ot = s.pts[F * 2 + 3],
          U = _ - C,
          $ = ot - P,
          N = U * U + $ * $ || 1,
          ut = Math.sqrt(N),
          mt = Math.max(s.hw[F], s.hw[F + 1]) + it.bankWidth + 34,
          wt = Math.max(1, Math.floor((Math.min(C, _) - mt + t) / f)),
          St = Math.min(a - 2, Math.ceil((Math.max(C, _) + mt + t) / f)),
          Vt = Math.max(1, Math.floor((Math.min(P, ot) - mt + t) / f)),
          Ht = Math.min(a - 2, Math.ceil((Math.max(P, ot) + mt + t) / f));
        for (let kt = Vt; kt <= Ht; kt++)
          for (let yt = wt; yt <= St; yt++) {
            let X = kt * a + yt;
            if (x[X] || A[X] >= 0) continue;
            let Rt = M(X),
              Tt = g(X),
              Ft = at(((Rt - C) * U + (Tt - P) * $) / N, 0, 1),
              Mt = C + U * Ft,
              ht = P + $ * Ft,
              Q = ((Rt - Mt) * $ - (Tt - ht) * U) / ut,
              gt = Math.hypot(Rt - Mt, Tt - ht),
              Et = bt(s.hw[F], s.hw[F + 1], Ft),
              vt = Math.max(Et, f * 0.75),
              Dt = bt(s.depth[F], s.depth[F + 1], Ft),
              It = bt(s.curv[F], s.curv[F + 1], Ft),
              Bt = at(It * vt * 26, -0.42, 0.42),
              Lt = Q / vt - Bt,
              Pt = Math.max(0, 1 - Lt * Lt),
              _t = 1 + 0.35 * Math.sign(It) * at(Q / vt, -1, 1),
              $t = Dt * Math.pow(Pt, 1.25) * at(_t, 0.55, 1.4),
              te = I.has(s.id) && Math.abs(Q) < Et * 0.62;
            if ((te && ($t = Math.max($t, Ct.depth + 0.35)), gt < vt)) {
              ((G[X] = Pe(G[X], Math.max($t, 0.22), 1.1)), (O[X] = 1));
              let ne =
                bt(s.speed[F], s.speed[F + 1], Ft) *
                Math.pow(Math.max(Pt, 0.05), 0.3);
              ne > Math.hypot(S[X], L[X]) &&
                ((S[X] = (U / ut) * ne), (L[X] = ($ / ut) * ne));
              let ce = at(-Math.sign(It) * (Q / vt), 0, 1),
                ie = bt(s.sed[F], s.sed[F + 1], Ft) || W(s, F);
              vt >= q[X] && ((Z[X] = at(ie - ce * 0.22, 0, 1)), (q[X] = vt));
              let Ee =
                s.kind === "creek"
                  ? Wt.CREEK
                  : k && Ft > 0 && e[X] < 420
                    ? Wt.ESTUARY
                    : Wt.RIVER;
              ((V[X] === Wt.LAND || Ee === Wt.RIVER) && (V[X] = Ee),
                (te || (Et >= Ct.halfWidth && $t >= Ct.depth)) && (Y[X] = 1));
            }
            K[X] = Math.min(K[X], Math.max(0, gt - vt));
            let se = 1 - et(10, 75, o[X]),
              ae = bt(0.3, 1, se),
              ee = (it.bankWidth + 18 + vt * 2.2) * ae,
              he = ee + (35 + 35 * se) + vt * 2.5 * ae,
              fe = 1 - et(vt + ee * 0.6, vt + he, gt);
            if (fe > 0.001) {
              let ne = et(vt, vt + it.bankWidth, gt),
                ce = Math.max(0, gt - vt - ee),
                ie =
                  it.datum +
                  0.22 +
                  ne * it.valleyFloor +
                  ce * ce * 0.0065 +
                  ce * 0.06;
              ((tt[X] = J[X] > 0 ? me(tt[X], ie, 4) : ie),
                (J[X] = Math.max(J[X], fe)));
            }
          }
      }
    };
  refineRiverNetwork(E);
  for (let s of E.reaches) ct(s);
  yield { label: "Carving drowned valleys", p: 0.62 };
  let st = {
    N: a,
    cell: f,
    half: t,
    isHome: c,
    h: o,
    cdist: e,
    ocean: x,
    noise: i,
    lakeId: A,
    xOf: M,
    zOf: g,
    idxAt: w,
    name: b,
    net: E,
    basins: z,
    lakes: H,
    bed: G,
    wet: O,
    flowX: S,
    flowZ: L,
    sed: Z,
    bankD: K,
    body: V,
    navMask: Y,
    floorH: tt,
    floorW: J,
  };
  (Mn(st), yield { label: "Setting every surface to the datum", p: 0.72 });
  let { rivers: nt, marshes: pt, swamp: ft } = yn(st);
  yield { label: "Spreading mangrove wetland", p: 0.86 };
  let { level: dt, nearLevel: j, inl: u, fresh: d } = gn(st, ft);
  return (
    yield { label: "Mapping banks, currents and sediment", p: 1 },
    {
      lakeSD: LSD_,
      inl: u,
      fresh: d,
      swamp: ft,
      flowX: S,
      flowZ: L,
      wet: O,
      level: dt,
      nearLevel: j,
      lakeId: A,
      accumulation: v.accumulation,
      downstream: v.downstream,
      rivers: nt,
      lakes: H,
      marshes: pt,
      sed: Z,
      body: V,
      bankDist: K,
      navMask: Y,
      netStats: E.stats,
    }
  );
}
var vn = [
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
  wn = [
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
function On(o, n) {
  let e = vn[(o() * vn.length) | 0] + wn[(o() * wn.length) | 0];
  return n ? `${e} ${n}` : e;
}
export { On, Ve };
