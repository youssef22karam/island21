// island.js - part 15/21 (statements 165-175 of the original module).
import { createSeaBoatRuntime } from "../boat-runtime.js";
import * as qr from "three";
import * as vt from "three";
import * as wt from "three";
import { re } from "./part01.js";
import { di } from "./part14.js";

function Ur(o) {
  let {
      camera: e,
      controls: t,
      getField: r,
      getCurrent: s,
      setCurrent: c,
      boat: a,
      state: n,
      push: i,
      rnd: m,
      el: h,
      movement: l,
    } = o,
    u = {
      p0: new wt.Vector3(),
      p1: new wt.Vector3(),
      l0: new wt.Vector3(),
      l1: new wt.Vector3(),
      t: 0,
      T: 1,
      arc: 0,
      done: null,
    },
    d = new wt.Vector3(),
    p = new wt.Vector3();
  function x() {
    return n.mode === "survey"
      ? t.target.clone()
      : e.getWorldDirection(d).multiplyScalar(60).add(e.position);
  }
  function f(w, E, k, R) {
    (u.l0.copy(x()),
      u.p0.copy(e.position),
      u.p1.copy(w),
      u.l1.copy(E),
      (u.T = k),
      (u.t = 0),
      (u.arc = Math.min(320, u.p0.distanceTo(u.p1) * 0.12)),
      (u.done = R ?? null),
      i({ mode: "fly" }),
      (t.enabled = !1),
      (a.visible = !1),
      document.exitPointerLock?.());
  }
  function v(w) {
    let E = w.world,
      k = E?.maxHeight ?? 260;
    if (E?.lakes.length) {
      let P = E.lakes.reduce((U, K) => (U.area > K.area ? U : K)),
        L = E.rivers.find((U) => U.name === P.outlet),
        z = L
          ? Math.min(
              L.hw.length - 1,
              Math.max(3, Math.floor(L.hw.length * 0.36)),
            )
          : -1,
        D =
          z >= 0
            ? Math.atan2(L.pts[z * 2 + 1] - P.z, L.pts[z * 2] - P.x)
            : Math.atan2(
                e.position.z - w.spec.cz - P.z,
                e.position.x - w.spec.cx - P.x,
              ),
        q = P.r * 2.65 + 460,
        N = D,
        V = 390,
        G = -1 / 0;
      for (let U of [-0.9, -0.6, -0.3, 0, 0.3, 0.6, 0.9]) {
        let K = D + U,
          X = P.x + Math.cos(K) * q,
          J = P.z + Math.sin(K) * q,
          se = Math.max(0, w.sampleH(X + w.spec.cx, J + w.spec.cz)),
          te = Math.max(335, se + 175, k * 0.55),
          me = 0;
        for (let j = 1; j <= 9; j++) {
          let S = j / 10,
            F = X + (P.x - X) * S,
            y = J + (P.z - J) * S,
            A = te + (25 - te) * S;
          me += Math.max(0, w.sampleH(F + w.spec.cx, y + w.spec.cz) - A + 14);
        }
        let $ = w.cellIndex(X + w.spec.cx, J + w.spec.cz),
          Z =
            -me * 2 -
            se * 0.08 -
            Math.abs(U) * 15 +
            ($ >= 0 ? E.fresh[$] * 18 + E.plain[$] * 8 : -8);
        Z > G && ((G = Z), (N = K), (V = te));
      }
      return {
        pos: new wt.Vector3(
          w.spec.cx + P.x + Math.cos(N) * q,
          V,
          w.spec.cz + P.z + Math.sin(N) * q,
        ),
        look: new wt.Vector3(w.spec.cx + P.x, 24, w.spec.cz + P.z),
      };
    }
    let R =
      Math.atan2(e.position.z - w.spec.cz, e.position.x - w.spec.cx) +
      (m() - 0.5) * 0.5;
    if (E) {
      let P = -1e9;
      for (let L = 0; L < 24; L++) {
        let z = (L / 24) * Math.PI * 2,
          D = Math.cos(z) * E.half * 0.34,
          q = Math.sin(z) * E.half * 0.34,
          N = w.cellIndex(w.spec.cx + D, w.spec.cz + q);
        if (N < 0) continue;
        let V = E.h[N],
          U =
            E.plain[N] * 35 + (V > -4 && V < 32 ? 25 : -Math.abs(V - 14) * 0.3);
        U > P && ((P = U), (R = z));
      }
    }
    let H = w.spec.half * 0.82,
      C = w.spec.cx + Math.cos(R) * H,
      W = w.spec.cz + Math.sin(R) * H,
      T = E ? Math.max(0, w.sampleH(C, W)) : 0;
    return {
      pos: new wt.Vector3(C, Math.max(T + 150, H * 0.34 + k * 0.28, 320), W),
      look: new wt.Vector3(
        w.spec.cx - Math.cos(R) * w.spec.half * 0.06,
        Math.max(16, k * 0.14),
        w.spec.cz - Math.sin(R) * w.spec.half * 0.06,
      ),
    };
  }
  function b() {
    let w = r(),
      E = s(),
      k =
        E &&
        Math.hypot(E.spec.cx - e.position.x, E.spec.cz - e.position.z) <
          E.spec.half * 2.5
          ? E
          : w.nearestIsland(e.position.x, e.position.z);
    return (k && !k.done && w.buildNow(k), k);
  }
  function g(w) {
    if (n.loading) return;
    if (w === "survey") {
      (i({ mode: "survey" }), (a.visible = !1), document.exitPointerLock?.());
      let k = r(),
        R = e.getWorldDirection(d),
        H = p.copy(e.position).addScaledVector(R, 50);
      ((H.y = Math.max(
        k.heightAt(H.x, H.z) + 1,
        k.waterAt(H.x, H.z).level + 0.4,
      )),
        t.target.copy(H),
        (t.enabled = !0),
        t.update());
      return;
    }
    let E = b();
    if (E) {
      if ((c(E), w === "walk")) {
        let k = r(),
          R = E.beachSpot(m) ?? {
            x: E.spec.cx,
            z: E.spec.cz,
            lookX: E.spec.cx + 30,
            lookZ: E.spec.cz,
          },
          H = new wt.Vector3(
            R.x,
            Math.max(k.heightAt(R.x, R.z), 0.3) + 1.68,
            R.z,
          ),
          C = new wt.Vector3(R.lookX, H.y + 0.9, R.lookZ);
        f(H, C, re(e.position.distanceTo(H) / 320, 2.2, 8), () => {
          ((l.walkState.x = R.x),
            (l.walkState.z = R.z),
            (l.walkState.phase = 0),
            o.setYaw(Math.atan2(C.z - H.z, C.x - H.x)),
            o.setPitch(0.02),
            i({ mode: "walk" }),
            h.focus({ preventScroll: !0 }));
        });
        return;
      }
      if (w === "boat") {
        let k = m() * Math.PI * 2,
          R = E.spec.cx + Math.cos(k) * E.spec.half * 0.98,
          H = E.spec.cz + Math.sin(k) * E.spec.half * 0.98,
          C = k + Math.PI,
          W = r(),
          T = E.world;
        if (
          T &&
          e.position.y < 180 &&
          W.freshAt(e.position.x, e.position.z) > 0.35
        ) {
          let z = !1;
          for (let D of [8, 14, 22, 36, 55, 80, 120]) {
            if (z) break;
            for (let q = 0; q < 24; q++) {
              let N = (q / 24) * Math.PI * 2,
                V = e.position.x + Math.cos(N) * D,
                G = e.position.z + Math.sin(N) * D,
                U = E.cellIndex(V, G);
              if (U < 0 || T.inl[U] < 0.55 || W.waterAt(V, G).depth < 1.2)
                continue;
              let X =
                Math.hypot(T.flowX[U], T.flowZ[U]) > 0.16
                  ? Math.atan2(T.flowZ[U], T.flowX[U])
                  : N;
              if (
                !(
                  W.waterAt(V + Math.cos(X) * 7, G + Math.sin(X) * 7).depth <
                  0.7
                )
              ) {
                ((R = V), (H = G), (C = X), (z = !0));
                break;
              }
            }
          }
        }
        let P = 0,
          L = new wt.Vector3(
            R - Math.cos(C) * 10,
            P + 3.6,
            H - Math.sin(C) * 10,
          );
        f(
          L,
          new wt.Vector3(R, P + 1, H),
          re(e.position.distanceTo(L) / 300, 1.8, 8),
          () => {
            ((l.boatState.x = R),
              (l.boatState.z = H),
              (l.boatState.heading = C),
              (l.boatState.speed = 0),
              o.setYaw(C),
              o.setPitch(-0.08),
              (a.visible = !0),
              i({ mode: "boat" }),
              h.focus({ preventScroll: !0 }));
          },
        );
      }
    }
  }
  function M(w) {
    let E = r();
    u.t += w;
    let k = di(re(u.t / u.T, 0, 1));
    (e.position.lerpVectors(u.p0, u.p1, k),
      (e.position.y += Math.sin(k * Math.PI) * u.arc));
    let R = Math.max(E.heightAt(e.position.x, e.position.z) + 2, 1.6);
    if (
      (e.position.y < R && (e.position.y = R),
      e.lookAt(d.lerpVectors(u.l0, u.l1, k)),
      u.t >= u.T)
    ) {
      let H = u.done;
      ((u.done = null),
        H
          ? H()
          : (t.target.copy(u.l1),
            (t.enabled = !0),
            i({ mode: "survey" }),
            t.update()));
    }
  }
  return {
    surveyView: v,
    nearestIslandForMode: b,
    setMode: g,
    flyTo: f,
    updateFly: M,
    fly: u,
  };
}
function $r(o) {
  const seaBoat = createSeaBoatRuntime(o);
  let e = { x: 0, z: 0, heading: 0, speed: 0, bob: 0 },
    t = { x: 0, z: 0, phase: 0, moving: 0 },
    r = new qr.Vector3(),
    s = 0,
    c = 0,
    a = 0,
    n = 0;
  function i(h) { seaBoat.update(h, o.U.uTime.value, e); }
  function m(h) {
    let l = o.getField(),
      { keys: u, camera: d } = o,
      p = o.getYaw(),
      x = o.getPitch(),
      f =
        (u.has("KeyW") || u.has("ArrowUp") ? 1 : 0) -
        (u.has("KeyS") || u.has("ArrowDown") ? 1 : 0),
      v =
        (u.has("KeyD") || u.has("ArrowRight") ? 1 : 0) -
        (u.has("KeyA") || u.has("ArrowLeft") ? 1 : 0),
      b = u.has("ShiftLeft") || u.has("ShiftRight") ? 2.6 : 1,
      g = l.waterAt(t.x, t.z),
      w = (g.depth > 1.4 ? 1.4 : 2.6) * b,
      E = (Math.cos(p) * f - Math.sin(p) * v) * w * h,
      k = (Math.sin(p) * f + Math.cos(p) * v) * w * h,
      R = t.x + E,
      H = t.z + k,
      C = l.heightAt(R, H),
      W = l.heightAt(t.x, t.z),
      T = l.waterAt(R, H),
      P = C - Math.max(W, g.level - 1.4);
    ((T.depth < 1.4 && P < 1.3) || (T.depth >= 1.4 && T.depth < 60)) &&
      ((t.x = R), (t.z = H));
    let L = l.heightAt(t.x, t.z),
      z = l.waterAt(t.x, t.z),
      D = o.getSurface();
    n += ((D.ok ? re(D.eta, -3, 6) : 0) - n) * (1 - Math.exp(-h * 5));
    let q = z.level > 0.5 ? z.level : n,
      N = Math.max(L, (z.depth > 1.3 ? q : z.level) - 1.3),
      V = Math.hypot(E, k) > 1e-4 ? 1 : 0;
    ((t.moving += (V - t.moving) * Math.min(1, h * 5)),
      (t.phase += Math.hypot(E, k) * 2.3));
    let G =
      N +
      1.68 +
      Math.sin(t.phase) * 0.045 * t.moving +
      (z.depth > 1.3 ? Math.sin(o.U.uTime.value * 1.3) * 0.08 : 0);
    d.position.set(t.x, G, t.z);
    let U = Math.cos(x);
    (d.lookAt(t.x + Math.cos(p) * U, G + Math.sin(x), t.z + Math.sin(p) * U),
      o.onStats(
        (Math.hypot(E, k) / Math.max(h, 1e-4)) * 3.6,
        ((((p * 180) / Math.PI + 90) % 360) + 360) % 360,
      ));
  }
  return { boatState: e, walkState: t, updateBoat: i, updateWalk: m, seaBoat };
}
function pi(o, e, t) {
  let r = "",
    s = 1 / 0;
  for (let c of o.rivers)
    for (let a = 0; a < c.pts.length; a += 2) {
      let n = Math.hypot(c.pts[a] - e, c.pts[a + 1] - t);
      n < s && ((s = n), (r = c.name));
    }
  return { name: r, d: s };
}
function jr(o, e, t) {
  let r = "",
    s = 1 / 0;
  for (let c of o) {
    let a = Math.hypot(c.x - e, c.z - t) - c.r;
    a < s && ((s = a), (r = c.name));
  }
  return { name: r, d: s };
}
function vi(o, e, t, r) {
  let s = Math.hypot(o.flowX[e], o.flowZ[e]),
    c = pi(o, t, r),
    a = jr(o.lakes, t, r),
    n = jr(o.marshes, t, r);
  if (o.h[e] <= 0 && o.inl[e] > 0.5)
    return o.swamp[e] > 0.4 && n.name
      ? n.name
      : s > 0.12 && c.name && c.d < 160
        ? c.name
        : a.name && a.d < 120
          ? a.name
          : c.name || "Backwater";
  if (o.swamp[e] > 0.4 && n.name) return n.name;
  if (o.fresh[e] > 0.5) {
    if (c.name && c.d < Math.max(a.d, 0) + 40) return `Banks of the ${c.name}`;
    if (a.name) return `Shore of ${a.name}`;
  }
  return o.h[e] <= 0 && o.inl[e] > 0.2 && c.name ? `${c.name} mouth` : null;
}
function Kr(o, e, t) {
  if (!o?.world) return "Open ocean";
  let r = o.world,
    s = o.cellIndex(e, t);
  if (s < 0) return "Open ocean";
  let c = r.type[s],
    a = r.h[s],
    n = vi(r, s, e - o.spec.cx, t - o.spec.cz);
  return (
    n ||
    (c === 1 || a <= 0
      ? r.cdist[s] > 600
        ? "Open ocean"
        : a < -8
          ? "Offshore"
          : "Coastal shallows"
      : a > r.maxHeight * 0.75
        ? "Mountain summit"
        : a > r.maxHeight * 0.55
          ? "The high ridge"
          : a > 220
            ? "Cloud forest"
            : r.cdist[s] < 60 && a < 4
              ? "The strand"
              : r.plain[s] > 0.62 && a < 22
                ? "Coastal plain"
                : r.plain[s] > 0.52 && a < 65
                  ? "Sunlit meadow"
                  : a < 55
                    ? "Lowland forest"
                    : "Rainforest interior")
  );
}
function po(o) {
  if (!o?.world)
    return {
      island: "Open sea",
      islandInfo: "",
      peak: 0,
      area: 0,
      rivers: 0,
      lakes: 0,
      wetlands: 0,
    };
  let e = o.world;
  return {
    island: e.name,
    islandInfo: `${Math.round(e.maxHeight)} m peak \xB7 ${(e.landArea / 1e6).toFixed(1)} km\xB2 \xB7 ${e.rivers.length} rivers \xB7 ${e.lakes.length} lakes \xB7 ${e.marshes.length} wetlands`,
    peak: Math.round(e.maxHeight),
    area: e.landArea / 1e6,
    rivers: e.rivers.length,
    lakes: e.lakes.length,
    wetlands: e.marshes.length,
  };
}
var bi = new vt.Matrix4().set(
  0.5,
  0,
  0,
  0.5,
  0,
  0.5,
  0,
  0.5,
  0,
  0,
  0.5,
  0.5,
  0,
  0,
  0,
  1,
);
function Yr({
  scene: o,
  camera: e,
  renderer: t,
  target: r,
  water: s,
  rain: c,
  getGrass: a,
  getFreshwater: n,
}) {
  let i = new vt.Matrix4(),
    m = new vt.PerspectiveCamera(),
    h = new vt.Vector3(0, 1, 0),
    l = new vt.Plane(),
    u = new vt.Vector4(),
    d = new vt.Vector4(),
    p = new vt.Vector3(),
    x = new vt.Vector3(),
    f = new vt.Vector3();
  function v(b) {
    if (e.position.y < b + 0.12) return !1;
    (e.updateMatrixWorld(),
      e.getWorldDirection(x),
      p.copy(e.position).add(x),
      (p.y = 2 * b - p.y),
      m.position.copy(e.position),
      (m.position.y = 2 * b - e.position.y),
      f.set(0, 1, 0).applyQuaternion(e.quaternion).reflect(h),
      m.up.copy(f),
      m.lookAt(p),
      (m.near = e.near),
      (m.far = e.far),
      m.updateMatrixWorld(),
      m.projectionMatrix.copy(e.projectionMatrix),
      i.copy(bi).multiply(m.projectionMatrix).multiply(m.matrixWorldInverse),
      l
        .setFromNormalAndCoplanarPoint(h, new vt.Vector3(0, b + 0.025, 0))
        .applyMatrix4(m.matrixWorldInverse),
      d.set(l.normal.x, l.normal.y, l.normal.z, l.constant));
    let g = m.projectionMatrix.elements;
    u.set(
      (Math.sign(d.x) + g[8]) / g[0],
      (Math.sign(d.y) + g[9]) / g[5],
      -1,
      (1 + g[10]) / g[14],
    );
    let M = d.dot(u);
    if (Math.abs(M) < 1e-6) return !1;
    (d.multiplyScalar(2 / M),
      (g[2] = d.x),
      (g[6] = d.y),
      (g[10] = d.z + 1 - 3e-4),
      (g[14] = d.w),
      m.projectionMatrixInverse.copy(m.projectionMatrix).invert());
    let w = [s, ...c, ...a(), ...(n?.() ?? [])],
      E = w.map((R) => R.visible);
    w.forEach((R) => (R.visible = !1));
    let k = t.getRenderTarget();
    return (
      t.setRenderTarget(r),
      t.clear(),
      (() => {
        __PF.reflPre(e.position);
        try {
          t.render(o, m);
        } finally {
          __PF.reflPost();
        }
      })(),
      t.setRenderTarget(k),
      w.forEach((R, H) => (R.visible = E[H])),
      !0
    );
  }
  return { matrix: i, render: v };
}
export { $r, Kr, Ur, Yr, po };
