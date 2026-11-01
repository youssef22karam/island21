// island.js - part 14/21 (statements 160-164 of the original module).
import * as Je from "three";
import * as fo from "three";
import TerrainWorker from "../terrain.worker.js?worker";
import { ne, re, ve } from "./part01.js";
import { Ge } from "./part02.js";
import { Ho, Jn, Wt, ao } from "./part04.js";
import { Ma, ho, no, nr, rr } from "./part05.js";
import { ir } from "./part06.js";
import { Jo, Sa, mr } from "./part07.js";
import { ta } from "./part08.js";
import { wr } from "./part09.js";
import { pn } from "./part10.js";
import { Ca, oa, zr } from "./part11.js";
import { Nr, Wr } from "./part12.js";
import { Ir, Mn, Or, Pr, Vr, ro } from "./part13.js";

var yn = class {
    spec;
    world = null;
    workerStart = 0;
    workerHeard = !1;
    terrainGen = null;
    floraGen = null;
    stage = 0;
    done = !1;
    progress = 0;
    label = "Raising the seabed";
    group = new Je.Group();
    terrain = null;
    water = null;
    mist = null;
    landTex = null;
    hydroTex = null;
    fullCount = 0;
    coarseCount = 0;
    highDetail = !0;
    chunks = [];
    casters = [];
    vegOn = !1;
    mats = [];
    fadeU = { value: 0 };
    growU = { value: 0 };
    vegVisible = !1;
    sim = null;
    scatter = null;
    worker = null;
    workerFailed = !1;
    instanceData = null;
    quality;
    constructor(e, t) {
      ((this.spec = e),
        (this.quality = t),
        this.group.position.set(e.cx, 0, e.cz));
    }
    contains(e, t) {
      return (
        Math.abs(e - this.spec.cx) < this.spec.half &&
        Math.abs(t - this.spec.cz) < this.spec.half
      );
    }
    sampleH(e, t) {
      return this.world
        ? Wt(this.world, e - this.spec.cx, t - this.spec.cz)
        : -40;
    }
    waterInfo(e, t) {
      return this.world
        ? Ho(this.world, e - this.spec.cx, t - this.spec.cz)
        : { type: 1, level: 0, depth: 40, bed: -40, body: Ge.SEA };
    }
    cellIndex(e, t) {
      return this.world
        ? ao(this.world, e - this.spec.cx, t - this.spec.cz)
        : -1;
    }
    step(e, t, r) {
      let s = performance.now();
      if (this.stage === 0) {
        if (
          (e > 1e8 &&
            this.worker &&
            (this.worker.terminate(),
            (this.worker = null),
            (this.workerFailed = !0)),
          !this.sim &&
            !this.worker &&
            !this.workerFailed &&
            !this.world &&
            typeof Worker < "u")
        )
          try {
            let c = globalThis;
            if (
              (c.__WORKER_SRC__ &&
                !c.__WORKER_URL__ &&
                (c.__WORKER_URL__ = URL.createObjectURL(
                  new Blob([c.__WORKER_SRC__], { type: "text/javascript" }),
                )),
              !c.__WORKER_URL__)
            )
              throw new Error("no worker");
            ((this.workerStart = performance.now()),
              (this.workerHeard = !1),
              (this.worker = new TerrainWorker()),
              (this.worker.onmessage = (a) => {
                let n = a.data;
                ((this.workerHeard = !0),
                  n.kind === "progress"
                    ? ((this.label = n.label ?? this.label),
                      (this.progress = n.p ?? this.progress))
                    : n.kind === "done" && n.world && n.out
                      ? ((this.world = n.world),
                        (this.instanceData = n.out),
                        this.worker?.terminate(),
                        (this.worker = null))
                      : n.kind === "error" &&
                        (this.worker?.terminate(),
                        (this.worker = null),
                        (this.workerFailed = !0)));
              }),
              (this.worker.onerror = () => {
                (this.worker?.terminate(),
                  (this.worker = null),
                  (this.workerFailed = !0));
              }),
              this.worker.postMessage({
                seed: this.spec.seed,
                N: this.spec.N,
                cell: this.spec.cell,
                isHome: this.spec.isHome,
              }));
          } catch {
            ((this.worker = null), (this.workerFailed = !0));
          }
        if (this.worker) {
          let c = performance.now() - this.workerStart;
          if ((!this.workerHeard && c > 12e3) || c > 12e4)
            (this.worker.terminate(),
              (this.worker = null),
              (this.workerFailed = !0));
          else return !1;
        }
        if (this.world)
          return (
            (this.stage = 1),
            (this.progress = 0.7),
            (this.label = "Shaping the shoreline"),
            !1
          );
        for (
          this.sim ||
          (this.sim = Ma({
            seed: this.spec.seed,
            N: this.spec.N,
            cell: this.spec.cell,
            isHome: this.spec.isHome,
          }));
          ;
        ) {
          let c = this.sim.next();
          if (c.done) {
            ((this.world = c.value),
              (this.sim = null),
              (this.stage = 1),
              (this.progress = 0.7),
              (this.label = "Shaping the shoreline"));
            break;
          }
          if (
            ((this.label = c.value.label),
            (this.progress = c.value.p * 0.68),
            performance.now() - s > e)
          )
            return !1;
        }
        return !1;
      }
      if (this.stage === 1) {
        for (
          this.terrainGen || (this.terrainGen = this.buildTerrainGen(t, r));
          ;
        ) {
          if (this.terrainGen.next().done) {
            ((this.terrainGen = null),
              (this.stage = 2),
              (this.progress = 0.74),
              (this.label = "Growing the forest"));
            break;
          }
          if (performance.now() - s > e) return !1;
        }
        return !1;
      }
      if (this.stage === 2) {
        if (!this.floraGen)
          if (this.instanceData)
            ((this.floraGen = this.buildFloraGen(
              { defs: r.species, out: this.instanceData },
              r,
            )),
              (this.instanceData = null));
          else
            for (
              this.scatter || (this.scatter = wr(this.world, 1, r.species));
              ;
            ) {
              let c = this.scatter.next();
              if (c.done) {
                ((this.floraGen = this.buildFloraGen(c.value, r)),
                  (this.scatter = null));
                break;
              }
              if (
                ((this.progress = 0.74 + c.value.p * 0.25),
                performance.now() - s > e)
              )
                return !1;
            }
        for (;;) {
          if (this.floraGen.next().done) {
            ((this.floraGen = null), (this.stage = 3));
            break;
          }
          if (performance.now() - s > e) return !1;
        }
        return !1;
      }
      return (
        this.spec.isHome &&
          ((this.fadeU.value = 1),
          (this.growU.value = 1),
          this.setVegVisible(!0)),
        (this.stage = 4),
        (this.done = !0),
        (this.progress = 1),
        (this.label = ""),
        !0
      );
    }
    *buildTerrainGen(e, t) {
      let r = this.world;
      ((this.landTex = nr(r, t.floatTex)),
        yield,
        (this.hydroTex = rr(r)),
        yield);
      let { geometry: s, fullCount: c, coarseCount: a } = ir(r);
      (yield, (this.fullCount = c), (this.coarseCount = a));
      let [n, i] = ho(r.seed),
        m = new Je.ShaderMaterial({
          uniforms: {
            ...t.U,
            uPeak: { value: r.maxHeight },
            uFade: this.fadeU,
            uHM: { value: this.landTex },
            uHydro: { value: this.hydroTex },
            uHB: {
              value: new Je.Vector4(
                this.spec.cx,
                this.spec.cz,
                this.spec.half,
                1,
              ),
            },
            uBiome: { value: new Je.Vector4(n, i, 0, 0) },
          },
          defines: { ...__PF.cfg(this.quality).terrain },
          vertexShader: Wr,
          fragmentShader: Nr,
          polygonOffset: !0,
          polygonOffsetFactor: 1,
          polygonOffsetUnits: 2,
        });
      (this.mats.push(m),
        (this.terrain = new Je.Mesh(s, m)),
        (this.terrain.frustumCulled = !1),
        this.group.add(this.terrain),
        yield,
        (r.lakes.length || r.rivers.length) &&
          ((this.water = Ir(r, { ...t.U, ...t.freshUniforms })),
          this.mats.push(this.water.material),
          this.group.add(this.water),
          yield,
          (this.mist = Pr(r, t.U)),
          this.mist &&
            (this.mats.push(this.mist.material), this.group.add(this.mist))),
        e.add(this.group));
    }
    *buildFloraGen(e, t) {
      let r = new Je.Matrix4(),
        s = new Je.Color();
      for (let c of Object.keys(e.out))
        for (let [a, n] of e.out[c].entries()) {
          let i = n.matrices.length / 16;
          if (!i) continue;
          let m = e.defs[c][a],
            h = { value: m.fade * __PF.cfg(this.quality).fade },
            l,
            u = null,
            d = !!m.cast && __PF.cfg(this.quality).shadow > 0;
          if (m.shader === "rock") {
            let v = {
              ...t.U,
              uGrow: this.growU,
              uFadeD: h,
              uKind: { value: m.kind ?? 0 },
              uLodOpacity: { value: 1 },
            };
            ((l = new Je.ShaderMaterial({
              uniforms: v,
              vertexShader: Jo,
              fragmentShader: Sa,
              vertexColors: !0,
            })),
              d &&
                (u = new Je.ShaderMaterial({
                  uniforms: v,
                  vertexShader: Jo,
                  fragmentShader: mr,
                  vertexColors: !0,
                })));
          } else {
            let v = {
              ...t.U,
              uMap: { value: m.map ? t.maps[m.map] : null },
              uUseMap: { value: m.map ? 1 : 0 },
              uLeaf: { value: m.leaf },
              uGrow: this.growU,
              uFadeD: h,
              uFloating: { value: 0 },
              uLodOpacity: { value: 1 },
            };
            ((l = new Je.ShaderMaterial({
              uniforms: v,
              vertexShader: oa,
              fragmentShader: Ca,
              defines:
                __PF.cfg(this.quality).shadow > 0 ? { PROP_SHADOWS: "" } : {},
              vertexColors: !0,
              side: Je.DoubleSide,
              alphaToCoverage: !!m.map,
            })),
              d &&
                (u = new Je.ShaderMaterial({
                  uniforms: v,
                  vertexShader: oa,
                  fragmentShader: zr,
                  vertexColors: !0,
                  side: Je.DoubleSide,
                })));
          }
          (this.mats.push(l), u && this.mats.push(u));
          let p = (v) => {
              u &&
                (v.layers.enable(pn),
                (v.userData.depthMat = u),
                this.casters.push(v));
            },
            x = new Map();
          for (let v = 0; v < i; v++) {
            if (
              m.shader !== "rock" &&
              (Math.imul(v, 2654435761) >>> 0) / 4294967296 >=
                __PF.cfg(this.quality).veg
            )
              continue;
            let b = n.matrices[v * 16 + 12],
              g = n.matrices[v * 16 + 14],
              M = Math.floor((b + this.spec.half) / Vr),
              E = Math.floor((g + this.spec.half) / Vr) * 4096 + M,
              k = x.get(E);
            k ? k.push(v) : x.set(E, [v]);
          }
          let f = m.fade * __PF.cfg(this.quality).fade;
          for (let [v, b] of x) {
            let g = b.length,
              M = new Je.InstancedMesh(m.geo, l, g),
              w = 1e9,
              E = -1e9,
              k = 1e9,
              R = -1e9,
              H = 1e9,
              C = -1e9;
            for (let q = 0; q < g; q++) {
              let N = b[q];
              (r.fromArray(n.matrices, N * 16),
                M.setMatrixAt(q, r),
                M.setColorAt(
                  q,
                  s.setRGB(
                    n.colors[N * 3],
                    n.colors[N * 3 + 1],
                    n.colors[N * 3 + 2],
                  ),
                ));
              let V = n.matrices[N * 16 + 12],
                G = n.matrices[N * 16 + 13],
                U = n.matrices[N * 16 + 14];
              (V < w && (w = V),
                V > E && (E = V),
                U < k && (k = U),
                U > R && (R = U),
                G < H && (H = G),
                G > C && (C = G));
            }
            ((M.instanceMatrix.needsUpdate = !0),
              M.instanceColor && (M.instanceColor.needsUpdate = !0));
            let W = m.geo.boundingSphere
                ? m.geo.boundingSphere.radius * 1.9
                : 30,
              T = (w + E) / 2,
              P = (k + R) / 2,
              L = (H + C) / 2,
              z = Math.hypot(E - w, R - k) / 2 + (C - H) / 2 + W;
            ((M.boundingSphere = new Je.Sphere(new Je.Vector3(T, L, P), z)),
              (M.frustumCulled = !0),
              (M.visible = !1),
              (M.onBeforeRender = (q, N, V, G, U) => {
                let K = U.uniforms?.uLodOpacity;
                K && (K.value = M.userData.lodOpacity ?? 1);
              }),
              this.group.add(M),
              p(M));
            let D = null;
            (m.lod &&
              ((D = new Je.InstancedMesh(m.lod, l, g)),
              (D.instanceMatrix = M.instanceMatrix),
              M.instanceColor && (D.instanceColor = M.instanceColor),
              (D.boundingSphere = M.boundingSphere.clone()),
              (D.frustumCulled = !0),
              (D.visible = !1),
              (D.onBeforeRender = (q, N, V, G, U) => {
                let K = U.uniforms?.uLodOpacity;
                K && (K.value = D.userData.lodOpacity ?? 1);
              }),
              this.group.add(D),
              p(D)),
              this.chunks.push({
                hi: M,
                lo: D,
                cx: T,
                cz: P,
                r: z,
                hiDist: m.hiDist,
                maxDist: f * 0.98,
                dither: m.shader !== "rock",
              }),
              yield);
          }
        }
    }
    setDetail(e) {
      !this.terrain ||
        e === this.highDetail ||
        (this.terrain.geometry.setDrawRange(
          e ? 0 : this.fullCount,
          e ? this.fullCount : this.coarseCount,
        ),
        (this.highDetail = e));
    }
    setVegVisible(e) {
      if (
        ((this.vegVisible = e),
        (this.vegOn = e && this.growU.value > 0.001),
        !this.vegOn)
      )
        for (let t of this.chunks)
          ((t.hi.visible = !1), t.lo && (t.lo.visible = !1));
    }
    updateVeg(e, t) {
      if (!this.vegOn) return;
      let r = this.spec.cx,
        s = this.spec.cz;
      for (let c of this.chunks) {
        let a = Math.max(
            0,
            Math.hypot(e - r - c.cx, t - s - c.cz) - c.r * 0.55,
          ),
          n = a < c.maxDist,
          i = re((c.hiDist + 22 - a) / 44, 0, 1),
          m = !c.lo || i > (c.dither ? 0 : 0.5);
        ((c.hi.visible = n && m),
          (c.hi.userData.lodOpacity = c.dither ? i : 1),
          c.lo &&
            ((c.lo.visible = n && (c.dither ? i < 1 : !m)),
            (c.lo.userData.lodOpacity = c.dither ? 1 - i : 1)));
      }
    }
    beachSpot(e) {
      let t = this.world;
      if (!t) return null;
      let r = [],
        s = [];
      for (let E = 0; E < 160; E++) {
        let k = (E / 160) * Math.PI * 2,
          R = Math.cos(k),
          H = Math.sin(k);
        for (let C = t.half * 0.78; C > t.half * 0.12; C -= 4) {
          let W = R * C,
            T = H * C,
            P = Wt(t, W, T);
          if (P > 1.1 && P < 2.8) {
            let L = Wt(t, W - R * 16, T - H * 16),
              z = Wt(t, W - R * 90, T - H * 90),
              D = ao(t, W, T);
            if (L > P && L < 6.5 && z > 4.5 && D >= 0 && t.type[D] === 0) {
              t.plain[D] > 0.42 ? r.push([W, T]) : s.push([W, T]);
              break;
            }
          }
        }
      }
      let c = r.length ? r : s;
      if (!c.length) return null;
      let a = c[Math.floor(e() * c.length)],
        n = a[0],
        i = a[1],
        m = Wt(t, n + 24, i) - Wt(t, n - 24, i),
        h = Wt(t, n, i + 24) - Wt(t, n, i - 24),
        l = Math.hypot(m, h) || 1,
        u = m / l,
        d = h / l,
        p = -d,
        x = u,
        f = Wt(
          t,
          n + (p * 0.65 + u * 0.75) * 65,
          i + (x * 0.65 + d * 0.75) * 65,
        ),
        v = Wt(
          t,
          n + (-p * 0.65 + u * 0.75) * 65,
          i + (-x * 0.65 + d * 0.75) * 65,
        ),
        b = f >= v ? 1 : -1,
        g = p * 0.62 * b + u * 0.78,
        M = x * 0.62 * b + d * 0.78,
        w = Math.hypot(g, M) || 1;
      return {
        x: n + this.spec.cx,
        z: i + this.spec.cz,
        lookX: n + this.spec.cx + (g / w) * 45,
        lookZ: i + this.spec.cz + (M / w) * 45,
      };
    }
    dispose(e) {
      (e.remove(this.group),
        this.worker?.terminate(),
        (this.worker = null),
        this.sim?.return(void 0),
        this.scatter?.return(void 0),
        (this.sim = null),
        (this.scatter = null),
        this.terrain?.geometry.dispose(),
        this.water?.geometry.dispose(),
        this.mist?.geometry.dispose(),
        this.landTex?.dispose(),
        this.hydroTex?.dispose());
      for (let t of this.chunks) (t.hi.dispose(), t.lo?.dispose());
      ((this.casters.length = 0), this.mats.forEach((t) => t.dispose()));
    }
  },
  sa = class {
    scene;
    shared;
    quality;
    worldSeed;
    islands = new Map();
    queue = [];
    lastHeavy = 0;
    vegDist;
    constructor(e, t, r, s, c, a, n = {}) {
      ((this.scene = e),
        (this.shared = {
          U: t,
          freshUniforms: n,
          maps: r,
          species: ta(),
          floatTex: a,
        }),
        (this.quality = s),
        (this.worldSeed = c),
        (this.vegDist = __PF.cfg(s).vegDist));
    }
    get(e, t) {
      if (!Or(e, t, this.worldSeed)) return null;
      let r = `${e},${t}`,
        s = this.islands.get(r);
      return (
        s ||
          ((s = new yn(Mn(e, t, this.worldSeed), this.quality)),
          this.islands.set(r, s),
          this.queue.push(s)),
        s
      );
    }
    get home() {
      return this.get(0, 0);
    }
    buildNow(e) {
      for (; !e.done;) e.step(1e9, this.scene, this.shared);
    }
    update(e, t, r, s, c) {
      let a = Math.floor(e / ro + 0.5),
        n = Math.floor(t / ro + 0.5);
      for (let i = -1; i <= 1; i++)
        for (let m = -1; m <= 1; m++) this.get(a + i, n + m);
      for (let [i, m] of this.islands)
        if (Math.abs(m.spec.ix - a) > 2 || Math.abs(m.spec.iz - n) > 2) {
          if (m === c) continue;
          (m.dispose(this.scene), this.islands.delete(i));
          let h = this.queue.indexOf(m);
          h >= 0 && this.queue.splice(h, 1);
        }
      if (
        ((this.queue = this.queue.filter((i) => !i.done)), this.queue.length)
      ) {
        let i = c && !c.done ? c : null;
        if (!i) {
          let m = 1 / 0;
          for (let h of this.queue) {
            let l = Math.hypot(h.spec.cx - e, h.spec.cz - t) - h.spec.half;
            (h.stage === 2 && l > this.vegDist) ||
              (l < m && ((m = l), (i = h)));
          }
        }
        if (i) {
          let m = i.stage === 1 && i !== c,
            h = performance.now();
          (!m || h - this.lastHeavy > 120) &&
            (m && (this.lastHeavy = h), i.step(s, this.scene, this.shared));
        }
      }
      for (let i of this.islands.values()) {
        let m = Math.hypot(i.spec.cx - e, i.spec.cz - t) - i.spec.half;
        if (
          (i.setDetail(m < 1400),
          i.stage >= 2 &&
            (i.fadeU.value = Math.min(1, i.fadeU.value + r / 1.5)),
          i.stage >= 3)
        ) {
          let h = m < this.vegDist;
          ((i.growU.value = re(i.growU.value + (h ? r / 1.2 : -r / 0.6), 0, 1)),
            i.setVegVisible(h || i.growU.value > 0),
            i.updateVeg(e, t));
        }
      }
    }
    casterList = [];
    shadowCasters(e, t, r) {
      let s = this.casterList;
      s.length = 0;
      for (let c of this.islands.values()) {
        if (!c.vegOn || !c.casters.length) continue;
        let a = Math.max(Math.abs(e - c.spec.cx) - c.spec.half, 0),
          n = Math.max(Math.abs(t - c.spec.cz) - c.spec.half, 0);
        if (!(a * a + n * n > r * r)) for (let i of c.casters) s.push(i);
      }
      return s;
    }
    freshObjects = [];
    freshwaterObjects() {
      let e = this.freshObjects;
      e.length = 0;
      for (let t of this.islands.values()) t.water && e.push(t.water);
      return e;
    }
    nearestReady(e, t, r) {
      let s = [];
      for (let c of this.islands.values()) c.landTex && s.push(c);
      return (
        s.sort(
          (c, a) =>
            Math.hypot(c.spec.cx - e, c.spec.cz - t) -
            Math.hypot(a.spec.cx - e, a.spec.cz - t),
        ),
        s.slice(0, r)
      );
    }
    islandAt(e, t) {
      for (let r of this.islands.values())
        if (r.world && r.contains(e, t)) return r;
      return null;
    }
    freshAt(e, t) {
      let r = this.islandAt(e, t);
      return r?.world ? no(r.world, e - r.spec.cx, t - r.spec.cz) : 0;
    }
    heightAt(e, t) {
      let r = this.islandAt(e, t);
      return r ? r.sampleH(e, t) : -40;
    }
    waterAt(e, t) {
      let r = this.islandAt(e, t);
      return r
        ? r.waterInfo(e, t)
        : { type: 1, level: 0, depth: 40, bed: -40, body: Ge.SEA };
    }
    bodyAt(e, t) {
      let r = this.islandAt(e, t);
      return r?.world ? Jn(r.world, e - r.spec.cx, t - r.spec.cz) : Ge.SEA;
    }
    isFreshAt(e, t) {
      let r = this.bodyAt(e, t);
      return (
        r === Ge.LAKE ||
        r === Ge.RIVER ||
        r === Ge.CREEK ||
        r === Ge.SWAMP ||
        r === Ge.ESTUARY
      );
    }
    nearestIsland(e, t) {
      let r = null,
        s = 1 / 0;
      for (let c of this.islands.values()) {
        let a = Math.hypot(c.spec.cx - e, c.spec.cz - t) - c.spec.half * 0.5;
        a < s && ((s = a), (r = c));
      }
      return r;
    }
    otherIsland(e, t, r, s) {
      let c = Math.floor(e / ro + 0.5),
        a = Math.floor(t / ro + 0.5),
        n = [];
      for (let m = -2; m <= 2; m++)
        for (let h = -2; h <= 2; h++) {
          let l = c + m,
            u = a + h;
          Or(l, u, this.worldSeed) &&
            ((r && r.spec.ix === l && r.spec.iz === u) || n.push([l, u]));
        }
      if (!n.length) return null;
      n.sort(
        (m, h) =>
          Math.hypot(m[0] - c, m[1] - a) - Math.hypot(h[0] - c, h[1] - a),
      );
      let i =
        n[
          Math.min(
            n.length - 1,
            Math.floor(Math.pow(s(), 1.6) * Math.min(n.length, 6)),
          )
        ];
      return this.get(i[0], i[1]);
    }
    dispose() {
      for (let e of this.islands.values()) e.dispose(this.scene);
      (this.islands.clear(), (this.queue.length = 0));
      for (let e of Object.values(this.shared.species))
        for (let t of e) (t.geo.dispose(), t.lod?.dispose());
    }
  };
function _r({
  U: o,
  P: e,
  camera: t,
  seabed: r,
  renderer: s,
  getStorm: c,
  getWeather: a,
  wind: n,
  swell: i,
}) {
  let m = (38 * Math.PI) / 180,
    h = -0.14,
    l = new fo.Color(1, 0.54, 0.28),
    u = new fo.Color(1, 0.36, 0.14),
    d = new fo.Color(1, 0.96, 0.87),
    p = new fo.Color(),
    x = new fo.Color(),
    f = 0;
  function v(k) {
    let R = ((k - 12.6) * Math.PI) / 12,
      H = Math.sin(m),
      C = Math.cos(m),
      W = Math.sin(h),
      T = Math.cos(h);
    return new fo.Vector3(
      -T * Math.sin(R),
      H * W + C * T * Math.cos(R),
      -(C * W - H * T * Math.cos(R)),
    ).normalize();
  }
  function b() {
    let k = c(),
      R = a(),
      H = e.hour,
      C = v(H),
      W = C.y,
      T = H > 12,
      P = ne(-0.1, 0.2, W),
      L = 1 - ne(-0.22, -0.05, W),
      z = T ? 0.32 : 0.25,
      D = Math.exp((-W * W) / (z * z)) * (1 - 0.5 * R);
    (o.uSun.value.copy(C),
      o.uMoon.value.copy(C).negate(),
      o.uTint.value.set(T ? "#ff6420" : "#ff9468"));
    let q = T ? u : l,
      N = o.uSunCol.value.copy(q).lerp(d, ne(0, 0.48, W));
    (p.setScalar(0.3 * N.r + 0.59 * N.g + 0.11 * N.b),
      N.lerp(p, R * 0.7).multiplyScalar(
        3.55 * (1 - 0.6 * R) * P * (1 + 0.62 * D * (T ? 1 : 0.45)),
      ),
      (o.uDay.value = P),
      (o.uNight.value = L),
      (o.uTwi.value = D),
      (o.uCov.value = e.cov),
      (o.uDens.value = e.dens),
      (o.uStorm.value = R));
    let V = (0.05 + 0.95 * ne(-0.1, 0.5, W)) * ve(1, 0.5, R);
    ((o.uLight.value = V),
      (s.toneMappingExposure =
        e.expo *
        (0.94 + 0.56 * (1 - ne(0, 0.9, Math.max(W, 0)))) *
        (1 - 0.65 * L) *
        (1 + 0.35 * D) *
        (1 + 0.5 * f)),
      o.uBody.value
        .copy(e.body)
        .lerp(x.copy(e.bodyNoon), ne(0.3, 0.85, W) * (1 - R)),
      (o.uClar.value =
        (e.clar * (1 - 0.28 * k) * (1 - 0.55 * R)) /
        (1 + 0.04 * Math.max(e.hs - 3, 0))),
      (o.uRough.value = e.rough),
      o.uFoam.value.set(
        ve(e.foamB, re(0.6 - 0.0185 * (e.hs - 10), 0.3, 0.6), k),
        e.foamS,
        e.foamC,
      ),
      (o.uFog.value = (16e-5 + 0.0018 * R + 12e-5 * k) * e.fog * 2),
      (o.uRain.value = ne(0.35, 0.8, R)));
    let G = (n.direction * Math.PI) / 180,
      U = (n.windSpeed / 19) * (0.42 + R * 0.25);
    (o.uWind.value.set(Math.cos(G) * U, Math.sin(G) * U),
      (o.uWindAmt.value = 0.12 + (n.windSpeed / 19) * 0.6 + R * 0.5),
      o.uWD.value.set(Math.cos(G), Math.sin(G)),
      (o.uHs.value = Math.max(e.hs, 0.3)));
    let K = (i.direction * Math.PI) / 180,
      X = Math.cos(K) * 0.65 + Math.cos(G) * 0.35,
      J = Math.sin(K) * 0.65 + Math.sin(G) * 0.35,
      se = Math.hypot(X, J) || 1;
    o.uSwDir.value.set(X / se, J / se);
    let te = Math.min(e.hs, 5);
    ((o.uShT.value = 6.4 + 1.15 * te),
      (o.uShH.value = Math.max(
        0.45,
        4.6 * Math.tanh((e.hs * 1.05 * e.shore) / 4.6),
      )),
      o.uRainCol.value.setRGB(0.8, 0.85, 0.95).multiplyScalar(0.1 + 0.9 * V),
      r.material.color.copy(o.uBody.value).multiplyScalar(V * ve(1, 0.4, R)));
  }
  let g = 6,
    M = [],
    w = 0;
  function E(k) {
    let R = a();
    if (R > 0.6 && (g -= k) <= 0) {
      let H = 0;
      ((M = Array.from(
        { length: 2 + Math.floor(Math.random() * 3) },
        () => (H += 0.05 + Math.random() * 0.12),
      )),
        (w = 0),
        (g = (6 + Math.random() * 11) * (1.6 - R * 0.7)));
    }
    ((f = 0),
      M.length &&
        ((w += k),
        M.forEach((H) => (f = Math.max(f, 1 - Math.abs(w - H) / 0.06))),
        w > M[M.length - 1] + 0.1 && (M = [])),
      (o.uFlash.value = f = re(f, 0, 1)));
  }
  return { updateSky: b, updateLightning: E };
}
var di = (o) => o * o * o * (o * (o * 6 - 15) + 10);
export { _r, di, sa };
