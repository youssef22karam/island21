// island.js - part 18/21 (statements 185-194 of the original module).
import * as No from "three";
import * as pt from "three";
import * as ze from "three";
import { re } from "./part01.js";
import { Ho, uo } from "./part04.js";
import { $e } from "./part05.js";
import { po } from "./part15.js";
import { as, ns, os, rs, ss, ts } from "./part17.js";

var La = 8,
  Wa = 9.81,
  Sn = [70, 180, 420, 1e3],
  xi = 2,
  kn = [
    { res: 768, cell0: 0.5 },
    { res: 512, cell0: 0.625 },
    { res: 384, cell0: 0.75 },
    { res: 256, cell0: 0.75, maxSub: 1 },
    { res: 192, cell0: 0.8, maxSub: 1 },
  ],
  ia = class {
    res;
    cell0;
    cell;
    ox = 0;
    oz = 0;
    probe = { eta: 0, u: 0, v: 0, h: 0, ok: !1 };
    level = 0;
    renderer;
    U;
    scene = new ze.Scene();
    camera = new ze.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    quad;
    SM;
    SC;
    F;
    B;
    GR;
    cur = 0;
    fcur = 0;
    momMat;
    contMat;
    foamMat;
    gradMat;
    bedMat;
    sim;
    remap = new ze.Vector3(0, 0, 1);
    needReset = !0;
    frame = 0;
    nSub = 1;
    probeBusy = !1;
    probeDisabled = !1;
    probeBuf;
    floatTex;
    constructor(e, t) {
      ((this.renderer = e),
        (this.res = t.res),
        (this.maxSub = t.maxSub || xi),
        (this.cell0 = t.cell0),
        (this.cell = t.cell0),
        (this.U = t.U),
        (this.floatTex = t.floatTex));
      let r = new ze.BufferGeometry();
      (r.setAttribute(
        "position",
        new ze.Float32BufferAttribute([-1, -1, 0, 3, -1, 0, -1, 3, 0], 3),
      ),
        (this.quad = new ze.Mesh(r)),
        (this.quad.frustumCulled = !1),
        this.scene.add(this.quad));
      let s = t.floatTex ? ze.FloatType : ze.HalfFloatType,
        c = (m, h, l, u, d = 1) =>
          new ze.WebGLRenderTarget(m, h, {
            count: d,
            type: l,
            format: ze.RGBAFormat,
            depthBuffer: !1,
            generateMipmaps: !1,
            minFilter: u ? ze.LinearFilter : ze.NearestFilter,
            magFilter: u ? ze.LinearFilter : ze.NearestFilter,
            wrapS: ze.ClampToEdgeWrapping,
            wrapT: ze.ClampToEdgeWrapping,
          }),
        a = (m) => (
          (m.generateMipmaps = !0),
          (m.minFilter = ze.LinearMipmapLinearFilter),
          m
        ),
        n = this.res;
      ((this.SM = c(n, n, s, !0)),
        (this.SC = [0, 1].map(() => {
          let m = c(n, n, s, !0, 2);
          return (a(m.textures[1]), m);
        })),
        (this.F = [
          c(n, n, ze.HalfFloatType, !0),
          c(n, n, ze.HalfFloatType, !0),
        ]),
        this.F.forEach((m) => a(m.texture)),
        (this.B = c(n, n, s, !0)),
        (this.GR = c(n, n, ze.HalfFloatType, !0)),
        a(this.GR.texture),
        (this.probeBuf = t.floatTex ? new Float32Array(4) : new Uint16Array(4)),
        (this.sim = {
          uBox: { value: new ze.Vector4(0, 0, this.cell, n * this.cell) },
          uRes: { value: n },
          uDt: { value: 1 / 60 },
          uTime: { value: 0 },
          uReset: { value: 1 },
          uDisp: { value: 0 },
          uRemap: { value: new ze.Vector3(0, 0, 1) },
          uSwDir: t.U.uSwDir,
          uShT: t.U.uShT,
          uShH: t.U.uShH,
          uWind: t.U.uWind,
          uFoamGain: t.U.uFoamGain,
          uWetDry: t.U.uWetDry,
          uBoat: { value: new ze.Vector4() },
          uBoatOn: { value: 0 },
          uS: { value: null },
          uF: { value: null },
          uE: { value: null },
          uB: { value: this.B.texture },
        }));
      let i = {
        glslVersion: ze.GLSL3,
        vertexShader: ts,
        depthTest: !1,
        depthWrite: !1,
      };
      ((this.momMat = new ze.ShaderMaterial({
        ...i,
        fragmentShader: as,
        uniforms: this.sim,
      })),
        (this.contMat = new ze.ShaderMaterial({
          ...i,
          fragmentShader: ns,
          uniforms: this.sim,
        })),
        (this.foamMat = new ze.ShaderMaterial({
          ...i,
          fragmentShader: rs,
          uniforms: this.sim,
        })),
        (this.gradMat = new ze.ShaderMaterial({
          ...i,
          fragmentShader: ss,
          uniforms: this.sim,
        })),
        (this.bedMat = new ze.ShaderMaterial({
          ...i,
          fragmentShader: os,
          uniforms: { ...t.IU, uBox: this.sim.uBox, uRes: this.sim.uRes },
        })),
        this.publish(),
        this.clearTargets());
    }
    publish() {
      ((this.U.uSurfS.value = this.SC[this.cur].textures[0]),
        (this.U.uSurfE.value = this.SC[this.cur].textures[1]),
        (this.U.uSurfF.value = this.F[this.fcur].texture),
        (this.U.uSurfB.value = this.B.texture),
        (this.U.uSurfG.value = this.GR.texture));
    }
    clearTargets() {
      let e = this.renderer.getRenderTarget(),
        t = this.renderer.getClearColor(new ze.Color()),
        r = this.renderer.getClearAlpha();
      this.renderer.setClearColor(0, 0);
      for (let s of [this.SM, ...this.SC, ...this.F, this.B, this.GR])
        (this.renderer.setRenderTarget(s), this.renderer.clear(!0, !1, !1));
      (this.renderer.setClearColor(t, r), this.renderer.setRenderTarget(e));
    }
    reset() {
      ((this.needReset = !0), (this.probe.ok = !1), this.clearTargets());
    }
    draw(e, t) {
      ((this.quad.material = e),
        this.renderer.setRenderTarget(t),
        this.renderer.render(this.scene, this.camera));
    }
    update(e, t, r, s, c, a, n) {
      let i = r.position,
        m = Math.max(i.y, 0);
      this.level < Sn.length && m > Sn[this.level] * 1.15
        ? this.level++
        : this.level > 0 && m < Sn[this.level - 1] * 0.85 && this.level--;
      let h = this.cell0 * Math.pow(2, this.level),
        l = this.res * 0.5,
        u = Math.round(i.x / h) * h - l * h,
        d = Math.round(i.z / h) * h - l * h,
        p = u !== this.ox || d !== this.oz || h !== this.cell;
      if (this.needReset) this.remap.set(0, 0, 1);
      else {
        let E = h / this.cell;
        this.remap.set(
          ((u - this.ox) / this.cell + 0.5 * (1 - E)) / this.res,
          ((d - this.oz) / this.cell + 0.5 * (1 - E)) / this.res,
          E,
        );
      }
      ((this.ox = u),
        (this.oz = d),
        (this.cell = h),
        this.sim.uBox.value.set(u, d, h, this.res * h),
        this.sim.uBoat.value.set(c.x, c.z, c.heading, c.speed),
        (this.sim.uBoatOn.value = c.on ? 1 : 0));
      let x = this.renderer.getRenderTarget();
      (p || this.needReset || this.frame % 24 === 0) &&
        this.draw(this.bedMat, this.B);
      let f = Math.min(e, 0.05),
        v = (0.45 * h) / Math.sqrt(Wa * (La + 3)),
        b = Math.min(this.maxSub, Math.max(1, Math.ceil(f / (v * 0.8))));
      b > this.nSub
        ? (this.nSub = b)
        : b < this.nSub &&
          Math.ceil(f / (v * 0.62)) < this.nSub &&
          (this.nSub = b);
      let g = this.nSub,
        M = Math.min(f / g, v),
        w = this.sim.uRemap.value;
      for (let E = 0; E < g; E++) {
        let k = E === 0;
        ((this.sim.uDt.value = M),
          (this.sim.uTime.value = t - (g - 1 - E) * M),
          k ? w.copy(this.remap) : w.set(0, 0, 1),
          (this.sim.uReset.value = k && this.needReset ? 1 : 0),
          (this.sim.uDisp.value = k && this.needReset ? 0 : 1),
          (this.sim.uS.value = this.SC[this.cur].textures[0]),
          (this.sim.uE.value = this.SC[this.cur].textures[1]),
          this.draw(this.momMat, this.SM),
          (this.sim.uS.value = this.SM.texture),
          this.draw(this.contMat, this.SC[1 - this.cur]),
          (this.cur = 1 - this.cur),
          !(E < g - 1) &&
            ((this.sim.uDt.value = f),
            (this.sim.uS.value = this.SC[this.cur].textures[0]),
            (this.sim.uE.value = this.SC[this.cur].textures[1]),
            (this.sim.uF.value = this.F[this.fcur].texture),
            this.draw(this.foamMat, this.F[1 - this.fcur]),
            (this.fcur = 1 - this.fcur)));
      }
      ((this.needReset = !1),
        w.set(0, 0, 1),
        (this.sim.uReset.value = 0),
        (this.sim.uS.value = this.SC[this.cur].textures[0]),
        this.draw(this.gradMat, this.GR),
        this.renderer.setRenderTarget(x),
        this.publish(),
        this.U.uSurfBox.value.set(u, d, h, this.res),
        (this.U.uSurfOn.value = a ? 1 : 0),
        this.frame++,
        this.requestProbe(c.on ? c.x : i.x, c.on ? c.z : i.z, n, t));
    }
    requestProbe(e, t, r, s) {
      let c = Math.round((e - this.ox) / this.cell),
        a = Math.round((t - this.oz) / this.cell);
      if (c < 1 || a < 1 || c >= this.res - 1 || a >= this.res - 1) {
        this.probe.ok = !1;
        return;
      }
      if (this.probeDisabled) {
        this.probe = { ...this.swellCPU(e, t, s, r), ok: !0 };
        return;
      }
      if (this.probeBusy) return;
      this.probeBusy = !0;
      let n = Math.max(r, -12);
      try {
        this.renderer
          .readRenderTargetPixelsAsync(
            this.SC[this.cur],
            c,
            a,
            1,
            1,
            this.probeBuf,
          )
          .then(() => {
            let i = this.probeBuf,
              m = (l) =>
                this.floatTex ? i[l] : ze.DataUtils.fromHalfFloat(i[l]),
              h = m(0);
            (Number.isFinite(h) &&
              (this.probe = { h, eta: n + h, u: m(1), v: m(2), ok: !0 }),
              (this.probeBusy = !1));
          })
          .catch(() => {
            ((this.probeDisabled = !0), (this.probeBusy = !1));
          });
      } catch {
        ((this.probeDisabled = !0), (this.probeBusy = !1));
      }
    }
    swellCPU(e, t, r, s) {
      if (s >= 0) return { eta: s, h: 0, u: 0, v: 0 };
      let c = this.U.uSwDir.value,
        a = Math.max(this.U.uShT.value, 3),
        n = this.U.uShH.value * 0.5,
        i = Math.sqrt(Wa * La),
        m = (2 * Math.PI) / a,
        h = (g) => [
          c.x * Math.cos(g) - c.y * Math.sin(g),
          c.x * Math.sin(g) + c.y * Math.cos(g),
        ],
        l = h(0.16),
        u = h(-0.1),
        d =
          n * 0.6 * Math.cos(m * ((e * c.x + t * c.y) / i - r)) +
          n *
            0.3 *
            Math.cos((m / 0.86) * ((e * l[0] + t * l[1]) / i - r) + 1.7) +
          n *
            0.3 *
            Math.cos((m / 1.17) * ((e * u[0] + t * u[1]) / i - r) + 4.1),
        p = Math.max(-s, 0.02),
        x = Math.pow(La / Math.min(La, Math.max(p, 0.65)), 0.25),
        f = 0.5 * p,
        v = Math.max(-f * 0.8, Math.min(f, d * x)),
        b =
          Math.min(0.8 * Math.sqrt(Wa * p), Math.abs(v) * Math.sqrt(Wa / p)) *
          Math.sign(v);
      return {
        eta: v,
        h: Math.max(v - Math.max(s, -12), 0),
        u: c.x * b,
        v: c.y * b,
      };
    }
    debugRead() {
      let e = this.res,
        t = new Float32Array(e * e * 4),
        r = new Float32Array(e * e * 4),
        s = new Uint16Array(e * e * 4);
      return (
        this.floatTex &&
          (this.renderer.readRenderTargetPixels(
            this.SC[this.cur],
            0,
            0,
            e,
            e,
            t,
          ),
          this.renderer.readRenderTargetPixels(this.B, 0, 0, e, e, r)),
        this.renderer.readRenderTargetPixels(this.F[this.fcur], 0, 0, e, e, s),
        { R: e, cell: this.cell, ox: this.ox, oz: this.oz, S: t, B: r, F: s }
      );
    }
    dispose() {
      for (let e of [this.SM, ...this.SC, ...this.F, this.B, this.GR])
        e.dispose();
      this.quad.geometry.dispose();
      for (let e of [
        this.momMat,
        this.contMat,
        this.foamMat,
        this.gradMat,
        this.bedMat,
      ])
        e.dispose();
    }
  };
function is(o) {
  let e = {
    dir: new No.Vector2(1, 0),
    valid: !1,
    timer: 0,
    snap: !0,
    last: new No.Vector2(1e9, 1e9),
    update(t, r) {
      let s = o(),
        c = 0,
        a = 0;
      for (let i of [45, 110])
        for (let m = 0; m < 16; m++) {
          let h = (m / 16) * Math.PI * 2,
            l = Math.cos(h),
            u = Math.sin(h),
            d = re((s.heightAt(t + l * i, r + u * i) + 4) / 5, 0, 1);
          ((c += l * d), (a += u * d));
        }
      let n = Math.hypot(c, a);
      ((e.valid = n > 2.56),
        e.valid && e.dir.set(c / n, a / n),
        Math.hypot(t - e.last.x, r - e.last.y) > 220 && (e.snap = !0),
        e.last.set(t, r));
    },
    surfView(t, r, s) {
      let c = o();
      e.update(t, r);
      let a = e.valid ? -e.dir.x : 1,
        n = e.valid ? -e.dir.y : 0,
        i = t,
        m = r;
      for (let p = 0; p < 60 && !(c.heightAt(i + a * 2, m + n * 2) < 0.9); p++)
        ((i += a * 2), (m += n * 2));
      let h = Math.atan2(n, a) + s,
        l = Math.max(c.heightAt(i, m), 0.3),
        u = new No.Vector3(i, l + 1.7, m),
        d = new No.Vector3(i + Math.cos(h) * 30, l + 1.2, m + Math.sin(h) * 30);
      return { x: i, z: m, yaw: h, eye: u, look: d };
    },
  };
  return e;
}
function Na(o, e, t) {
  let r = null,
    s = (a, n) => $e(o, a, n) - uo(o, o.nearLevel, a, n),
    c = (a, n, i, m, h, l = 0, u) => {
      if (u !== void 0 && Math.abs(uo(o, o.nearLevel, a, n) - u) > 2.2) return;
      let d = s(a, n),
        p = e === "swamp" ? 1.15 : 6.5;
      if (d < (e === "swamp" ? 0.18 : 1.6) || d > p) return;
      let f = Math.hypot(i - a, m - n) || 1,
        v = (i - a) / f,
        b = (m - n) / f,
        g = 0;
      for (let E of [6, 12, 20, 32, 48, 68]) {
        let k = Ho(o, a + v * E, n + b * E);
        k.depth > 0.06 && (u === void 0 || Math.abs(k.level - u) < 1.3) && g++;
      }
      if (g < 2) return;
      let M = 0;
      if (e === "swamp") {
        let E =
            (Ho(o, a + v * 10, n + b * 10).depth > 0.1 ? 1 : 0) +
            (Ho(o, a + v * 22, n + b * 22).depth > 0.1 ? 1 : 0),
          k = 0;
        for (let R of [42, 58, 76]) {
          let H = s(a + v * R, n + b * R);
          H > 0.2 &&
            H < 9 &&
            uo(o, o.fresh, a + v * R, n + b * R) > 0.35 &&
            k++;
        }
        M = E * 6 + k * 8 - Math.abs(d - 0.38) * 5;
      } else
        M =
          12 -
          Math.abs(d - (e === "lake" ? 3 : 2.5)) * 3.5 -
          uo(o, o.swamp, a, n) * 55;
      let w = g * 6.5 + M + l;
      (!r || w > r.score) &&
        (r = { x: a, z: n, lx: i, lz: m, name: h, score: w });
    };
  if (e === "river") {
    let a =
      o.rivers.find((i) => i.name === t) ??
      o.rivers.find((i) => i.kind === "main") ??
      o.rivers[0];
    if (!a) return null;
    let n = a.pts.length / 2;
    for (let i = Math.max(2, Math.floor(n * 0.22)); i < n * 0.8; i += 2) {
      let m = a.pts[(i + 1) * 2] - a.pts[(i - 1) * 2],
        h = a.pts[(i + 1) * 2 + 1] - a.pts[(i - 1) * 2 + 1],
        l = Math.hypot(m, h) || 1,
        u = m / l,
        d = h / l,
        p = Math.min(n - 1, i + 4),
        x = a.pts[i * 2],
        f = a.pts[i * 2 + 1];
      for (let v of [-1, 1])
        for (let b = a.hw[i] * 0.72; b < a.hw[i] + 42; b += 2)
          c(
            x - d * b * v,
            f + u * b * v,
            a.pts[p * 2],
            a.pts[p * 2 + 1],
            a.name,
            12 * (1 - uo(o, o.swamp, x, f)),
          );
    }
  } else if (e === "lake") {
    let a =
      o.lakes.find((n) => n.name === t) ??
      [...o.lakes].sort((n, i) => i.area - n.area)[0];
    if (!a) return null;
    for (let n = 0; n < 48; n++) {
      let i = (n / 48) * Math.PI * 2;
      for (let m = a.r * 0.65; m < a.r * 1.7; m += 3)
        c(
          a.x + Math.cos(i) * m,
          a.z + Math.sin(i) * m,
          a.x,
          a.z,
          a.name,
          Math.sin(i * 2) * 1.2,
          a.level,
        );
    }
  } else {
    let a =
      o.marshes.find((n) => n.name === t) ??
      [...o.marshes].sort((n, i) => i.area - n.area)[0];
    if (!a) return null;
    for (let n = a.z - a.r; n <= a.z + a.r; n += 8)
      for (let i = a.x - a.r; i <= a.x + a.r; i += 8)
        if (!(uo(o, o.swamp, i, n) < 0.45 || s(i, n) < 0.18 || s(i, n) > 1.3))
          for (let m = 0; m < 16; m++) {
            let h = (m * Math.PI) / 8;
            c(i, n, i + Math.cos(h) * 58, n + Math.sin(h) * 58, a.name);
          }
  }
  return r;
}
function ls(o) {
  let {
    state: e,
    camera: t,
    controls: r,
    boat: s,
    el: c,
    rnd: a,
    push: n,
    flight: i,
    movement: m,
  } = o;
  return function (l, u) {
    let d = o.getField(),
      p = o.surfView;
    if (e.loading) return;
    if (l === "next" || l === "home") {
      let v =
        l === "home"
          ? d.home
          : d.otherIsland(t.position.x, t.position.z, o.getCurrent(), a);
      if (!v) return;
      o.setPending(v);
      let b = i.surveyView(v);
      ((s.visible = !1),
        i.flyTo(
          b.pos,
          b.look,
          re(t.position.distanceTo(b.pos) / 520, 6, 16),
          () => {
            (v.world || d.buildNow(v),
              o.setCurrent(v),
              o.setPending(null),
              r.target.copy(b.look),
              (r.enabled = !0),
              n({ mode: "survey", ...po(v) }),
              r.update());
          },
        ));
      return;
    }
    let x = i.nearestIslandForMode();
    if (!x?.world) return;
    let f = x.world;
    if (l === "peak") {
      let v = 0,
        b = 0;
      for (let w = 0; w < f.N * f.N; w++) f.h[w] > v && ((v = f.h[w]), (b = w));
      let g = ((b % f.N) + 0.5) * f.cell - f.half + x.spec.cx,
        M = (Math.floor(b / f.N) + 0.5) * f.cell - f.half + x.spec.cz;
      i.flyTo(
        new pt.Vector3(g + 380, v + 260, M + 380),
        new pt.Vector3(g, v * 0.8, M),
        5,
      );
    } else if (l === "meadow") {
      let v = -1,
        b = Math.floor((f.N * f.N) / 2);
      for (let k = 0; k < f.N * f.N; k++) {
        let R = f.h[k];
        if (R < 6 || R > 42 || f.cdist[k] < 95) continue;
        let H = f.plain[k] * 2 - Math.abs(R - 18) * 0.02 + a() * 0.15;
        H > v && ((v = H), (b = k));
      }
      let g = ((b % f.N) + 0.5) * f.cell - f.half + x.spec.cx,
        M = (Math.floor(b / f.N) + 0.5) * f.cell - f.half + x.spec.cz,
        w = new pt.Vector3(g, Math.max(d.heightAt(g, M), 1) + 1.68, M),
        E = new pt.Vector3(
          x.spec.cx,
          Math.max(w.y + 8, f.maxHeight * 0.35),
          x.spec.cz,
        );
      i.flyTo(w, E, 4.5, () => {
        ((m.walkState.x = g),
          (m.walkState.z = M),
          (m.walkState.phase = 0),
          o.setLook(Math.atan2(E.z - w.z, E.x - w.x), 0.04),
          n({ mode: "walk" }),
          c.focus({ preventScroll: !0 }));
      });
    } else if (l === "surf") {
      let v = x.beachSpot(a);
      if (!v) return;
      let b = p(v.x, v.z, 0.5);
      i.flyTo(b.eye, b.look, 5, () => {
        ((m.walkState.x = b.x),
          (m.walkState.z = b.z),
          (m.walkState.phase = 0),
          o.setLook(b.yaw, -0.1),
          o.snapSurf(),
          n({ mode: "walk" }),
          c.focus({ preventScroll: !0 }));
      });
    } else if (l === "river" || l === "lake" || l === "swamp") {
      let v = x.spec.cx,
        b = x.spec.cz,
        g = Na(f, l, u),
        M = g ? { x: g.x + v, z: g.z + b, lx: g.lx + v, lz: g.lz + b } : null;
      if (!M && l === "river" && f.rivers.length)
        for (let W = 0; W < 12 && !M; W++) {
          let T =
              f.rivers.find((V) => V.name === u) ??
              f.rivers[Math.floor(a() * f.rivers.length)],
            P = T.pts.length / 2;
          if (P < 4) continue;
          let L = Math.floor(P * (0.3 + a() * 0.45)),
            z = T.pts[(L + 1) * 2] - T.pts[(L - 1) * 2],
            D = T.pts[(L + 1) * 2 + 1] - T.pts[(L - 1) * 2 + 1],
            q = Math.hypot(z, D) || 1,
            N = a() < 0.5 ? 1 : -1;
          for (let V = T.hw[L] + 2; V < T.hw[L] + 40; V += 2) {
            let G = T.pts[L * 2] - (D / q) * N * V + v,
              U = T.pts[L * 2 + 1] + (z / q) * N * V + b;
            if (d.waterAt(G, U).depth < 0.02 && d.heightAt(G, U) > -0.01) {
              let K = (z / q) * 0.85 + (D / q) * N * 0.5,
                X = (D / q) * 0.85 - (z / q) * N * 0.5;
              M = { x: G, z: U, lx: G + K * 40, lz: U + X * 40 };
              break;
            }
          }
        }
      else if (!M && l === "lake" && f.lakes.length) {
        let W =
          f.lakes.find((T) => T.name === u) ??
          f.lakes[Math.floor(a() * f.lakes.length)];
        for (let T = 0; T < 16 && !M; T++) {
          let P = a() * Math.PI * 2;
          for (let L = W.r * 0.4; L < W.r * 2.5; L += 4) {
            let z = W.x + Math.cos(P) * L + v,
              D = W.z + Math.sin(P) * L + b;
            if (d.waterAt(z, D).depth < 0.02 && d.heightAt(z, D) > 0.3) {
              M = { x: z, z: D, lx: W.x + v, lz: W.z + b };
              break;
            }
          }
        }
      } else if (!M && l === "swamp" && f.marshes.length) {
        let W =
          f.marshes.find((T) => T.name === u) ??
          f.marshes[Math.floor(a() * f.marshes.length)];
        for (let T = 0; T < 28 && !M; T++) {
          let P = a() * Math.PI * 2;
          for (let L = 8; L < W.r * 1.3; L += 4) {
            let z = W.x + Math.cos(P) * L + v,
              D = W.z + Math.sin(P) * L + b,
              q = x.cellIndex(z, D),
              N = d.heightAt(z, D);
            if (q < 0 || N < 0.25 || N > 2.4 || f.swamp[q] < 0.3) continue;
            let V = null;
            for (let G = 0; G < 12 && !V; G++) {
              let U = (G / 12) * Math.PI * 2;
              for (let K of [7, 13, 20]) {
                let X = z + Math.cos(U) * K,
                  J = D + Math.sin(U) * K;
                if (d.heightAt(X, J) < -0.1) {
                  V = { x: X, z: J };
                  break;
                }
              }
            }
            if (V) {
              M = { x: z, z: D, lx: V.x, lz: V.z };
              break;
            }
          }
        }
      }
      if (!M) return;
      let w = M,
        E = l === "swamp" ? 1.28 : 1.55,
        k = l === "swamp" ? 0.04 : l === "river" ? -0.02 : -0.05,
        R = new pt.Vector3(w.x, d.heightAt(w.x, w.z) + E, w.z),
        H = Math.hypot(w.lx - w.x, w.lz - w.z) || 40,
        C = new pt.Vector3(w.lx, R.y + Math.sin(k) * H, w.lz);
      i.flyTo(R, C, 5, () => {
        ((m.walkState.x = w.x),
          (m.walkState.z = w.z),
          (m.walkState.phase = 0),
          o.setLook(Math.atan2(C.z - R.z, C.x - R.x), k),
          n({ mode: "walk" }),
          c.focus({ preventScroll: !0 }));
      });
    } else if (l === "beach") {
      let v = x.beachSpot(a) ?? {
          x: x.spec.cx + x.spec.half * 0.6,
          z: x.spec.cz,
          lookX: x.spec.cx,
          lookZ: x.spec.cz,
        },
        b = new pt.Vector3(
          v.x,
          Math.max(d.heightAt(v.x, v.z), 0.3) + 1.68,
          v.z,
        ),
        g = new pt.Vector3(v.lookX, b.y + 0.9, v.lookZ);
      i.flyTo(b, g, 5, () => {
        ((m.walkState.x = v.x),
          (m.walkState.z = v.z),
          (m.walkState.phase = 0),
          o.setLook(Math.atan2(g.z - b.z, g.x - b.x), 0.02),
          n({ mode: "walk" }),
          c.focus({ preventScroll: !0 }));
      });
    }
  };
}
function cs(o) {
  let { surf: e, camera: t, onshore: r, U: s, P: c } = o,
    a = e.debugRead(),
    n = a.R,
    i = pt.DataUtils.fromHalfFloat,
    m = r ? -r.x : 1,
    h = r ? -r.y : 0,
    l = [];
  for (let b = -20; b <= 170; b += 5) {
    let g = t.position.x + m * b,
      M = t.position.z + h * b,
      w = Math.round((g - a.ox) / a.cell),
      E = Math.round((M - a.oz) / a.cell);
    if (w < 0 || E < 0 || w >= n || E >= n) continue;
    let k = (E * n + w) * 4,
      R = a.B[k + 1],
      H = a.S[k],
      C = a.B[k] + H;
    l.push(
      `${b}m bed ${R.toFixed(2)} h ${H.toFixed(3)} eta ${C.toFixed(2)} u ${Math.hypot(a.S[k + 1], a.S[k + 2]).toFixed(2)} rho ${a.S[k + 3].toFixed(2)} foam ${i(a.F[k]).toFixed(2)} wet ${i(a.F[k + 1]).toFixed(2)}`,
    );
  }
  let u = 0,
    d = 0,
    p = 0,
    x = -9,
    f = "",
    v = 0;
  for (let b = 0; b < n * n * 4; b += 4) {
    if (
      !Number.isFinite(a.S[b]) ||
      !Number.isFinite(a.S[b + 1]) ||
      !Number.isFinite(a.S[b + 2])
    ) {
      v++;
      continue;
    }
    if (a.S[b] > 0.003 && a.B[b + 1] > -10) {
      (u++, a.S[b + 3] > 0.2 && d++, i(a.F[b]) > 0.3 && p++);
      let g = a.B[b] + a.S[b];
      if (g > x) {
        let M = b / 4,
          w = M % n,
          E = Math.floor(M / n);
        ((x = g),
          (f = `i${w} j${E} bed ${a.B[b + 1].toFixed(2)} h ${a.S[b].toFixed(2)} edge ${Math.min(w, E, n - 1 - w, n - 1 - E)}`));
      }
    }
  }
  return {
    shH: s.uShH.value,
    shT: s.uShT.value,
    hs: c.hs,
    wetCells: u,
    nan: v,
    rhoFrac: d / Math.max(u, 1),
    foamFrac: p / Math.max(u, 1),
    maxEta: x,
    maxAt: f,
    rows: l,
  };
}
function us(o) {
  (o.controls.dispose(),
    o.field.dispose(),
    o.fft.dispose(),
    o.reflectRT.dispose(),
    o.surf.dispose(),
    o.grass?.dispose());
  let e = (r) => {
    (r.geometry.dispose(), r.material.dispose());
  };
  [o.water, o.sky, o.seabed, ...o.rain].forEach(e);
  let t = new Set();
  (o.boat.traverse((r) => {
    (r instanceof pt.Mesh || r instanceof pt.LineSegments) &&
      (r.geometry.dispose(), t.add(r.material));
  }),
    t.forEach((r) => r.dispose()),
    o.emptyLand.dispose(),
    o.foamTex.dispose(),
    Object.values(o.maps).forEach((r) => r.dispose()),
    o.renderer.dispose(),
    o.renderer.domElement.remove());
}
function hs(o) {
  let { camera: e, controls: t, boat: r, push: s, flight: c, movement: a } = o,
    n = (i, m) => {
      let h = o.getField(),
        l = h.islandAt(i, m) ?? h.nearestIsland(i, m);
      return l ? (l.done || h.buildNow(l), o.setCurrent(l), l) : null;
    };
  return {
    debugView(i, m, h, l, u, d = 1.7) {
      let p = n(m, h);
      if (!p) return;
      (document.exitPointerLock?.(), (r.visible = !1), (c.fly.done = null));
      let x = (l * Math.PI) / 180,
        f = (u * Math.PI) / 180;
      if ((o.setLook(x, f), i === "walk"))
        ((a.walkState.x = m),
          (a.walkState.z = h),
          (a.walkState.phase = 0),
          (t.enabled = !1),
          s({ mode: "walk", ...po(p) }),
          a.updateWalk(0.016),
          (e.position.y += d - 1.7));
      else {
        t.enabled = !0;
        let v = Math.max(o.getField().heightAt(m, h), 0);
        (e.position.set(m, v + d, h),
          t.target.set(
            m + Math.cos(x) * 120,
            v + d + Math.sin(f) * 120,
            h + Math.sin(x) * 120,
          ),
          s({ mode: "survey", ...po(p) }),
          t.update());
      }
    },
    debugBoat(i, m, h) {
      let l = n(i, m);
      if (!l) return;
      c.fly.done = null;
      let u = (h * Math.PI) / 180;
      (o.setLook(u, -0.08),
        (a.boatState.x = i),
        (a.boatState.z = m),
        (a.boatState.heading = u),
        (a.boatState.speed = 0),
        (r.visible = !0),
        (t.enabled = !1),
        e.position.set(i - Math.cos(u) * 10, 3.7, m - Math.sin(u) * 10),
        e.lookAt(i, 1, m),
        s({ mode: "boat", ...po(l) }));
    },
  };
}
function ms(o, e, t) {
  let { island: r, boat: s, flight: c } = o;
  if (!r?.world) return;
  let a = e + r.spec.cx,
    n = t + r.spec.cz,
    i = r.cellIndex(a, n),
    m = i >= 0 && r.world.swamp[i] > 0.3,
    h = m ? 55 : 165,
    l = m
      ? Math.max(195, r.sampleH(a, n) + 185)
      : Math.max(540, r.sampleH(a + h, n + h) + 360);
  ((s.visible = !1),
    c.flyTo(
      new pt.Vector3(a + h * 0.7, l, n + h),
      new pt.Vector3(a, 2, n),
      3.4,
    ));
}
export { Na, cs, hs, ia, is, kn, ls, ms, us };
