// island.js - part 19/21 (statements 196-210 of the original module).
import * as Mo from "three";
import * as Tn from "three";
import * as Ze from "three";
import * as mt from "three";
import * as vo from "three";
import * as yt from "three";
import { Ie } from "./part01.js";
import { ao } from "./part04.js";
import { $e, Nt, Vt, Xt, no } from "./part05.js";
import { Jo, Sa } from "./part07.js";
import { xn } from "./part10.js";
import { Ca, oa } from "./part11.js";

function fs(o, e) {
  return {
    ...o,
    uSun: { value: new mt.Vector3(0, 1, 0) },
    uMoon: { value: new mt.Vector3(0, -1, 0) },
    uSunCol: { value: new mt.Color() },
    uTint: { value: new mt.Color() },
    uTime: { value: 0 },
    uDay: { value: 1 },
    uNight: { value: 0 },
    uTwi: { value: 0 },
    uCov: { value: 0.3 },
    uSkyLQ: { value: 0 },
    uDens: { value: 0.6 },
    uStorm: { value: 0 },
    uFlash: { value: 0 },
    uLight: { value: 1 },
    uBody: { value: new mt.Color() },
    uFoam: { value: new mt.Vector3() },
    uClar: { value: 0.6 },
    uRough: { value: 0.05 },
    uFog: { value: 5e-4 },
    uHs: { value: 1 },
    uWD: { value: new mt.Vector2() },
    uRain: { value: 0 },
    uPx: { value: 0.001 },
    uWind: { value: new mt.Vector2() },
    uWindAmt: { value: 0.3 },
    uRainCol: { value: new mt.Color() },
    uSwDir: { value: new mt.Vector2(1, 0) },
    uShT: { value: 9 },
    uShH: { value: 1 },
    uSurfS: { value: null },
    uSurfF: { value: null },
    uSurfB: { value: null },
    uSurfG: { value: null },
    uSurfE: { value: null },
    uSurfBox: { value: new mt.Vector4(0, 0, 0.5, 1024) },
    uSurfOn: { value: 0 },
    uFoamGain: { value: e.foam },
    uSprayGain: { value: e.spray },
    uWetDry: { value: e.wetness },
    uShadowMap: { value: null },
    uShadowMatrix: { value: new mt.Matrix4() },
    uShadowInfo: { value: new mt.Vector4(0, 1 / 2048, 4e-5, 0) },
  };
}
function ds() {
  return {
    P: {
      hour: 16.4,
      play: !1,
      dayMin: 10,
      cov: 0.16,
      dens: 0.5,
      expo: 1,
      chop: 0.9,
      height: 1,
      hs: 0,
      foamDecay: 0.3,
      foamB: 0.82,
      foamS: 0.6,
      foamC: 0.65,
      clar: 0.28,
      rough: 0.07,
      fog: 0.72,
      body: new Tn.Color("#0a3d56"),
      bodyNoon: new Tn.Color("#245c9a"),
      shore: 1.05,
      foam: 1,
      spray: 1,
      wetness: 1,
      reflections: !0,
      vegetation: !0,
    },
    windSea: {
      scale: 1,
      windSpeed: 11,
      direction: -20,
      fetch: 120,
      spreadBlend: 0.85,
      swell: 0.2,
      peakEnhancement: 3.3,
      shortWavesFade: 0.02,
    },
    swell: {
      scale: 0.7,
      windSpeed: 6,
      direction: -60,
      fetch: 600,
      spreadBlend: 1,
      swell: 1,
      peakEnhancement: 3.3,
      shortWavesFade: 0.05,
    },
  };
}
function ps(o, e, t) {
  let r = [],
    s = 1,
    c = -9,
    a = {
      dirty: !0,
      update(n, i) {
        if (r.length) {
          let m = o.bands[r.shift()];
          ((m.h0b.image.data = xn(o.size, m, e.systems, e.depth, m.noise)),
            (m.h0b.needsUpdate = !0),
            r.length || (s = 0));
        } else
          s < 1
            ? ((s = Math.min(1, s + n / t)),
              (o.mix = s),
              s >= 1 &&
                (o.bands.forEach((m) => {
                  let h = m.h0;
                  ((m.h0 = m.h0b), (m.h0b = h));
                }),
                (o.mix = 0)))
            : a.dirty &&
              i - c > t &&
              ((a.dirty = !1), (c = i), (r = [0, 1, 2]));
      },
    };
  return a;
}
function vs(o) {
  let { el: e, keys: t, coarse: r } = o,
    s = null,
    c = (h) => {
      h.target?.closest?.("input,button,select,textarea") ||
        (t.add(h.code),
        [
          "KeyW",
          "KeyA",
          "KeyS",
          "KeyD",
          "Space",
          "ShiftLeft",
          "ArrowUp",
          "ArrowDown",
          "ArrowLeft",
          "ArrowRight",
        ].includes(h.code) &&
          o.getMode() !== "survey" &&
          h.preventDefault(),
        h.code === "Escape" && o.getMode() !== "survey" && o.escape());
    },
    a = (h) => t.delete(h.code),
    n = () => t.clear(),
    i = (h) => {
      document.pointerLockElement === e &&
        o.look(h.movementX * 0.0022, -h.movementY * 0.002);
    };
  (addEventListener("keydown", c),
    addEventListener("keyup", a),
    addEventListener("blur", n),
    document.addEventListener("mousemove", i),
    e.addEventListener("pointerdown", (h) => {
      let l = o.getMode();
      if (!(l === "survey" || l === "fly")) {
        if (h.pointerType === "mouse" && !r)
          try {
            e.requestPointerLock?.()?.catch?.(() => {});
          } catch {}
        ((s = { id: h.pointerId, x: h.clientX, y: h.clientY }),
          e.setPointerCapture(h.pointerId));
      }
    }),
    e.addEventListener("pointermove", (h) => {
      !s ||
        h.pointerId !== s.id ||
        document.pointerLockElement === e ||
        (o.look((h.clientX - s.x) * 0.0036, -(h.clientY - s.y) * 0.003),
        (s.x = h.clientX),
        (s.y = h.clientY));
    }));
  let m = (h) => {
    s && h.pointerId === s.id && (s = null);
  };
  return (
    e.addEventListener("pointerup", m),
    e.addEventListener("pointercancel", m),
    {
      get drag() {
        return s;
      },
      dispose() {
        (removeEventListener("keydown", c),
          removeEventListener("keyup", a),
          removeEventListener("blur", n),
          document.removeEventListener("mousemove", i));
      },
    }
  );
}
function bs() {
  let o = {
      forest: [58, 74, 38, 40],
      riverbed: [128, 118, 100, 55],
      rock: [112, 108, 104, 60],
    },
    e = (r, s) => {
      let a = document.createElement("canvas");
      a.width = a.height = 256;
      let n = a.getContext("2d"),
        i = n.createImageData(256, 256),
        [m, h, l, u] = o[r.split("-")[0]],
        d = (f, v, b) => {
          let g = (f * 374761393 + v * 668265263 + b * 1274126177) | 0;
          return (
            (g = (g ^ (g >>> 13)) * 1274126177),
            ((g ^ (g >>> 16)) >>> 0) / 4294967295
          );
        },
        p = (f, v) => {
          let b = 0,
            g = 0.5,
            M = 8;
          for (let w = 0; w < 4; w++) {
            let E = (f / 256) * M,
              k = (v / 256) * M,
              R = Math.floor(E),
              H = Math.floor(k),
              C = E - R,
              W = k - H,
              T = (z, D) => d(((z % M) + M) % M, ((D % M) + M) % M, w),
              P = C * C * (3 - 2 * C),
              L = W * W * (3 - 2 * W);
            ((b +=
              g *
              ((T(R, H) * (1 - P) + T(R + 1, H) * P) * (1 - L) +
                (T(R, H + 1) * (1 - P) + T(R + 1, H + 1) * P) * L)),
              (g *= 0.5),
              (M *= 2));
          }
          return b;
        };
      for (let f = 0; f < 256; f++)
        for (let v = 0; v < 256; v++) {
          let b = (f * 256 + v) * 4;
          if (s) {
            let g = (p(v, f) - 0.5) * 2 * u;
            ((i.data[b] = m + g),
              (i.data[b + 1] = h + g),
              (i.data[b + 2] = l + g * 0.7));
          } else {
            let g = p((v + 1) % 256, f) - p((v + 256 - 1) % 256, f),
              M = p(v, (f + 1) % 256) - p(v, (f + 256 - 1) % 256);
            ((i.data[b] = 128 - g * 380),
              (i.data[b + 1] = 128 - M * 380),
              (i.data[b + 2] = 245));
          }
          i.data[b + 3] = 255;
        }
      n.putImageData(i, 0, 0);
      let x = new vo.CanvasTexture(a);
      return (
        (x.wrapS = x.wrapT = vo.RepeatWrapping),
        (x.colorSpace = s ? vo.SRGBColorSpace : vo.NoColorSpace),
        (x.anisotropy = 8),
        (x.needsUpdate = !0),
        x
      );
    },
    t = [
      e("forest-color", !0),
      e("forest-normal", !1),
      e("riverbed-color", !0),
      e("riverbed-normal", !1),
      e("rock-color", !0),
      e("rock-normal", !1),
    ];
  return {
    uniforms: {
      uForestMap: { value: t[0] },
      uForestNormal: { value: t[1] },
      uGravelMap: { value: t[2] },
      uGravelNormal: { value: t[3] },
      uRockMap: { value: t[4] },
      uRockNormal: { value: t[5] },
    },
    dispose() {
      t.forEach((r) => r.dispose());
    },
  };
}
var kt = 28,
  gi = {
    lowest: { radius: 90, keep: 130, density: 0.6 },
    lower: { radius: 110, keep: 160, density: 0.75 },
    low: { radius: 140, keep: 210, density: 1 },
    medium: { radius: 140, keep: 210, density: 1 },
    high: { radius: 140, keep: 210, density: 1 },
  },
  Ba = class {
    constructor(e, t, r) {
      this.U = t;
      this.getField = r;
      ((this.tier = gi[e]), (this.group.name = "Riparian understory"));
    }
    U;
    getField;
    group = new yt.Group();
    chunks = new Map();
    materials = new Map();
    field = null;
    frame = 0;
    lastCell = "";
    pending = [];
    tier;
    update(e, t = 2.5) {
      let r = this.getField();
      r !== this.field && (this.clear(), (this.field = r));
      let s = e.position,
        c = ++this.frame,
        a = this.tier.radius,
        n = s.y - Math.max(r.heightAt(s.x, s.z), 0) > 110;
      if (((this.group.visible = !n), n)) return;
      let i = Math.floor(s.x / kt),
        m = Math.floor(s.z / kt),
        h = `${i}:${m}`;
      if (h !== this.lastCell) {
        ((this.lastCell = h), (this.pending = []));
        let u = Math.ceil(a / kt);
        for (let d = m - u; d <= m + u; d++)
          for (let p = i - u; p <= i + u; p++) {
            let x = Math.hypot((p + 0.5) * kt - s.x, (d + 0.5) * kt - s.z);
            x < a + kt &&
              !this.chunks.has(`${p}:${d}`) &&
              this.pending.push([x, p, d]);
          }
        this.pending.sort((d, p) => p[0] - d[0]);
      }
      let l = performance.now();
      for (; this.pending.length && performance.now() - l < t;) {
        let [, u, d] = this.pending.pop(),
          p = this.build(r, u, d);
        (this.chunks.set(`${u}:${d}`, p), this.group.add(p.group));
      }
      for (let [u, d] of this.chunks) {
        let [p, x] = u.split(":").map(Number),
          f = Math.hypot((p + 0.5) * kt - s.x, (x + 0.5) * kt - s.z);
        if (((d.group.visible = f < a + kt * 0.6), d.group.visible)) {
          d.last = c;
          for (let v of d.meshes)
            ((v.hi.visible = !v.lo || f < 52),
              v.lo && (v.lo.visible = f >= 52));
        }
      }
      if (this.chunks.size > this.tier.keep) {
        let u = [...this.chunks]
          .filter(([, d]) => !d.group.visible)
          .sort((d, p) => d[1].last - p[1].last);
        for (let [d, p] of u)
          if (
            (this.release(p),
            this.chunks.delete(d),
            this.chunks.size <= this.tier.keep)
          )
            break;
      }
    }
    build(e, t, r) {
      let s = { group: new yt.Group(), last: this.frame, meshes: [] },
        c = t * kt,
        a = r * kt,
        n = e.islandAt(c + kt / 2, a + kt / 2);
      if (!n?.world) return s;
      let i = n.world,
        m = n.spec.cx,
        h = n.spec.cz,
        l = Ie(i.seed ^ Math.imul(t, 73856093) ^ Math.imul(r, 19349663)),
        u = new Map(),
        d = new yt.Object3D(),
        p = (v, b, g, M, w, E = 1) => {
          (d.position.set(b - c, M, g - a),
            d.rotation.set(0, l() * Math.PI * 2, 0),
            d.scale.set(
              w * (0.8 + l() * 0.35),
              v === "lily" ? 1 : w,
              w * (0.8 + l() * 0.35),
            ),
            d.updateMatrix(),
            u.has(v) || u.set(v, { matrices: [], colors: [] }));
          let k = u.get(v);
          (k.matrices.push(d.matrix.clone()),
            k.colors.push(
              new yt.Color().setRGB(
                E * (0.88 + l() * 0.15),
                E,
                E * (0.78 + l() * 0.15),
              ),
            ));
        },
        x = 12,
        f = kt / x;
      for (let v = 0; v < x; v++)
        for (let b = 0; b < x; b++) {
          let g = c + (b + 0.15 + l() * 0.7) * f,
            M = a + (v + 0.15 + l() * 0.7) * f,
            w = g - m,
            E = M - h,
            k = no(i, w, E),
            R = l();
          if (k < 0.36 || R > this.tier.density) continue;
          let H = $e(i, w, E),
            C = Vt(i, i.swamp, w, E),
            W = Vt(i, i.nearLevel, w, E),
            T = H - W;
          if (T < -3.5 || T > 12) continue;
          let P = ao(i, w, E),
            L = P >= 0 && i.wet[P] && T < -0.08,
            z = Math.hypot(Vt(i, i.flowX, w, E), Vt(i, i.flowZ, w, E)),
            D = l(),
            q = Nt(w * 0.043, E * 0.043, i.seed ^ 7544229);
          if (L) {
            let V =
              $e(i, w + 1.8, E) < W - 0.08 &&
              $e(i, w - 1.8, E) < W - 0.08 &&
              $e(i, w, E + 1.8) < W - 0.08 &&
              $e(i, w, E - 1.8) < W - 0.08;
            !(P >= 0 && i.navMask[P] === 1) &&
            V &&
            z < 0.22 &&
            T > -2.8 &&
            q > 0.54 &&
            D < (C > 0.28 ? 0.48 : 0.25)
              ? p("lily", g, M, W, 0.75 + l() * 0.65, 0.92)
              : T > -0.65 && C > 0.25 && D < 0.26
                ? p("calamites", g, M, H - 0.04, 0.8 + l() * 0.6, 1.05)
                : T > -0.85 && D < 0.48
                  ? p("reed", g, M, H - 0.04, 0.9 + l() * 0.7, 1.12)
                  : T > -1.4 && z < 0.35 && D < 0.62
                    ? p("sedge", g, M, H - 0.03, 0.6 + l() * 0.45, 0.95)
                    : T > -1.1 &&
                      z > 0.3 &&
                      D < 0.27 &&
                      p(
                        "pebble",
                        g,
                        M,
                        H - 0.02,
                        0.18 + l() * 0.45,
                        0.5 + l() * 0.35,
                      );
            continue;
          }
          if (
            !(
              Math.hypot(
                $e(i, w + 1.5, E) - $e(i, w - 1.5, E),
                $e(i, w, E + 1.5) - $e(i, w, E - 1.5),
              ) /
                3 >
              1
            )
          )
            if (T < 1.1 && C > 0.24 && D < 0.2)
              p("calamites", g, M, H - 0.05, 0.8 + l() * 0.65, 1.06);
            else if (T < 1.05 && D < 0.32 + C * 0.2)
              p("reed", g, M, H - 0.06, 0.85 + l() * 0.7, 1.12);
            else if (T < 2.4 && D < 0.56)
              p("sedge", g, M, H - 0.04, 0.7 + l() * 0.6, 1.1);
            else if (T > 0.25 && D < 0.68)
              p("fern", g, M, Xt(i, w, E, 0.35) - 0.05, 0.7 + l() * 0.68, 0.92);
            else if (D < 0.81 && C < 0.65) {
              let V = 0.35 + l() * 1.2;
              p(
                "rock",
                g,
                M,
                Xt(i, w, E, V * 0.3) - V * 0.09,
                V,
                0.37 + l() * 0.32,
              );
              for (let G = 0; G < 3; G++) {
                let U = g + (l() - 0.5) * 2,
                  K = M + (l() - 0.5) * 2;
                p(
                  "pebble",
                  U,
                  K,
                  $e(i, U - m, K - h) - 0.04,
                  0.12 + l() * 0.26,
                  0.5 + l() * 0.3,
                );
              }
            } else
              D > 0.985 &&
                T < 2.8 &&
                p(
                  C > 0.3 ? "log" : "driftwood",
                  g,
                  M,
                  Xt(i, w, E, 1.2) - 0.08,
                  0.65 + l() * 0.6,
                  0.68,
                );
        }
      s.group.position.set(c, 0, a);
      for (let [v, b] of u) {
        let g =
            e.shared.species[v][Math.abs((t + r) % e.shared.species[v].length)],
          M = this.materials.get(v);
        M ||
          ((M = new yt.ShaderMaterial({
            uniforms: {
              ...this.U,
              uGrow: { value: 1 },
              uFadeD: { value: this.tier.radius + 16 },
              uMap: { value: g.map ? e.shared.maps[g.map] : null },
              uUseMap: { value: g.map ? 1 : 0 },
              uLeaf: { value: g.leaf },
              uKind: { value: g.kind ?? 0 },
              uLodOpacity: { value: 1 },
            },
            vertexShader: g.shader === "rock" ? Jo : oa,
            fragmentShader: g.shader === "rock" ? Sa : Ca,
            defines: { PROP_SHADOWS: "" },
            vertexColors: !0,
            side: g.shader === "rock" ? yt.FrontSide : yt.DoubleSide,
            alphaToCoverage: !!g.map,
          })),
          this.materials.set(v, M));
        let w = (E) => {
          let k = new yt.InstancedMesh(E, M, b.matrices.length);
          return (
            b.matrices.forEach((R, H) => {
              (k.setMatrixAt(H, R), k.setColorAt(H, b.colors[H]));
            }),
            k.computeBoundingSphere(),
            k.boundingSphere && (k.boundingSphere.radius += 4),
            s.group.add(k),
            k
          );
        };
        s.meshes.push({ hi: w(g.geo), lo: g.lod ? w(g.lod) : null });
      }
      return s;
    }
    release(e) {
      e.group.removeFromParent();
      for (let t of e.meshes) (t.hi.dispose(), t.lo?.dispose());
    }
    get stats() {
      let e = 0,
        t = 0;
      for (let r of this.chunks.values())
        if (r.group.visible) {
          t++;
          for (let s of r.meshes) e += s.hi.count;
        }
      return { instances: e, visibleChunks: t, cachedChunks: this.chunks.size };
    }
    clear() {
      for (let e of this.chunks.values()) this.release(e);
      (this.chunks.clear(), (this.pending = []), (this.lastCell = ""));
    }
    dispose() {
      (this.clear(), this.group.removeFromParent());
      for (let e of this.materials.values()) e.dispose();
    }
  };
var wi = new Mo.Matrix4().set(
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
function xs(o, e, t, r) {
  let s = new Mo.WebGLRenderTarget(640, 400, {
      type: Mo.HalfFloatType,
      depthBuffer: !0,
      generateMipmaps: !1,
    }),
    c = new Mo.Matrix4();
  return {
    target: s,
    matrix: c,
    render() {
      let a = typeof r == "function" ? r() : r,
        n = o.getRenderTarget(),
        i = a.map((m) => m.visible);
      (t.updateMatrixWorld(),
        c.copy(wi).multiply(t.projectionMatrix).multiply(t.matrixWorldInverse));
      try {
        (a.forEach((m) => {
          m.visible = !1;
        }),
          o.setRenderTarget(s),
          o.render(e, t));
      } finally {
        (o.setRenderTarget(n),
          a.forEach((m, h) => {
            m.visible = i[h];
          }));
      }
    },
    dispose() {
      s.dispose();
    },
  };
}
var Ia = 256,
  Io = 0.68,
  la = Ia * Io,
  Bo = 8,
  Pa = class {
    constructor(e) {
      this.renderer = e;
      let t = () =>
        new Ze.WebGLRenderTarget(Ia, Ia, {
          type: Ze.HalfFloatType,
          format: Ze.RGBAFormat,
          minFilter: Ze.LinearFilter,
          magFilter: Ze.LinearFilter,
          depthBuffer: !1,
          stencilBuffer: !1,
        });
      ((this.targets = [t(), t()]),
        (this.uniforms = {
          uWakeTexture: { value: this.targets[0].texture },
          uWakeBox: { value: new Ze.Vector4(0, 0, la, 0) },
          uWakeCell: { value: Io },
        }),
        (this.material = new Ze.ShaderMaterial({
          depthWrite: !1,
          depthTest: !1,
          uniforms: {
            uPrevious: { value: this.targets[0].texture },
            uBox: { value: this.simulationBox },
            uOldBox: { value: this.previousBox },
            uReset: { value: 1 },
            uDt: { value: 1 / 60 },
            uFlow: { value: new Ze.Vector2() },
            uCount: { value: 0 },
            uEmit: { value: this.emit },
            uHeading: { value: this.heading },
          },
          vertexShader:
            "varying vec2 vUv;void main(){vUv=position.xy*.5+.5;gl_Position=vec4(position,1.);}",
          fragmentShader: `
        uniform sampler2D uPrevious;
        uniform vec4 uBox,uOldBox,uEmit[${Bo}];
        uniform vec2 uHeading[${Bo}],uFlow;
        uniform float uReset,uDt;
        uniform int uCount;
        varying vec2 vUv;
        vec4 sampleOld(vec2 p){
          vec2 uv=(p-uOldBox.xy)/max(uOldBox.z,.001);
          if(uReset>.5||min(min(uv.x,uv.y),min(1.-uv.x,1.-uv.y))<.003)return vec4(0.);
          return texture2D(uPrevious,uv);
        }
        void main(){
          float size=uBox.z,cell=size/${Ia.toFixed(1)};
          vec2 p=uBox.xy+vUv*size;
          vec2 advected=p-uFlow*uDt;
          vec4 old=sampleOld(advected);
          float h=old.r,prior=old.g;
          float lap=sampleOld(advected+vec2(cell,0.)).r+sampleOld(advected-vec2(cell,0.)).r
            +sampleOld(advected+vec2(0.,cell)).r+sampleOld(advected-vec2(0.,cell)).r-4.*h;
          float c=min(.24,3.8*uDt/cell);
          float next=(2.*h-prior+c*c*lap)*exp(-uDt*.65);
          float foam=old.b*exp(-uDt*1.5);
          for(int i=0;i<${Bo};i++){
            if(i>=uCount)break;
            vec4 source=uEmit[i];
            vec2 forward=uHeading[i],side=vec2(-forward.y,forward.x);
            float radius=max(source.z,.5),power=min(source.w/12.,1.5);
            vec2 bow=p-source.xy-forward*radius*.8;
            vec2 stern=p-source.xy+forward*radius*1.2;
            vec2 left=stern-side*radius*.72,right=stern+side*radius*.72;
            float crest=exp(-dot(bow,bow)/(radius*radius*.6));
            float trough=exp(-dot(stern,stern)/(radius*radius*.85));
            float arms=exp(-dot(p-left,p-left)/(radius*radius*.34))
              +exp(-dot(p-right,p-right)/(radius*radius*.34));
            float pressure=(crest*.75-trough*.42+arms*.26)*power;
            next+=pressure*uDt*.85;
            foam=max(foam,clamp((arms*.23+crest*.13)*power,0.,.85));
          }
          next=clamp(next,-.3,.3);
          gl_FragColor=vec4(next,h,foam,1.);
        }`,
        })));
      let r = new Ze.BufferGeometry();
      (r.setAttribute(
        "position",
        new Ze.Float32BufferAttribute([-1, -1, 0, 3, -1, 0, -1, 3, 0], 3),
      ),
        (this.quad = new Ze.Mesh(r, this.material)),
        (this.quad.frustumCulled = !1),
        this.scene.add(this.quad));
    }
    renderer;
    uniforms;
    targets;
    scene = new Ze.Scene();
    camera = new Ze.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    quad;
    material;
    current = 0;
    initialized = !1;
    sources = new Map();
    idle = 0;
    emit = Array.from({ length: Bo }, () => new Ze.Vector4());
    heading = Array.from({ length: Bo }, () => new Ze.Vector2(1, 0));
    previousBox = new Ze.Vector4();
    simulationBox = new Ze.Vector4();
    track(e, t, r, s, c, a, n) {
      let i = this.sources.get(e);
      i
        ? Object.assign(i, { x: t, z: r, vx: s, vz: c, radius: a, updated: n })
        : this.sources.set(e, {
            x: t,
            z: r,
            vx: s,
            vz: c,
            radius: a,
            updated: n,
          });
    }
    remove(e) {
      this.sources.delete(e);
    }
    update(e, t, r, s, c, a, n) {
      let i = this.uniforms.uWakeBox.value;
      if (!n) {
        ((i.w = 0), (this.initialized = !1));
        return;
      }
      this.previousBox.copy(i);
      let m = Math.round((r - la / 2) / Io) * Io,
        h = Math.round((s - la / 2) / Io) * Io;
      this.simulationBox.set(m, h, la, 1);
      let l = 0;
      for (let [d, p] of this.sources) {
        if (t - p.updated > 0.35) {
          this.sources.delete(d);
          continue;
        }
        let x = Math.hypot(p.vx, p.vz);
        if (
          !(x < 0.15 || Math.hypot(p.x - r, p.z - s) > la * 0.6) &&
          (this.emit[l].set(p.x, p.z, p.radius, x),
          this.heading[l].set(p.vx / x, p.vz / x),
          ++l === Bo)
        )
          break;
      }
      if (
        ((this.idle = l === 0 ? this.idle + e : 0),
        l === 0 && this.idle > 6 && this.initialized)
      )
        return;
      ((this.material.uniforms.uPrevious.value =
        this.targets[this.current].texture),
        (this.material.uniforms.uCount.value = l),
        (this.material.uniforms.uDt.value = Math.min(e, 1 / 30)),
        (this.material.uniforms.uReset.value = this.initialized ? 0 : 1),
        this.material.uniforms.uFlow.value.set(c, a));
      let u = this.renderer.getRenderTarget();
      (this.renderer.setRenderTarget(this.targets[1 - this.current]),
        this.renderer.render(this.scene, this.camera),
        this.renderer.setRenderTarget(u),
        (this.current = 1 - this.current),
        (this.uniforms.uWakeTexture.value = this.targets[this.current].texture),
        i.copy(this.simulationBox),
        (this.initialized = !0));
    }
    dispose() {
      (this.targets.forEach((e) => e.dispose()),
        this.quad.geometry.dispose(),
        this.material.dispose(),
        this.sources.clear());
    }
  };
var Va = class {
  gl;
  extension;
  pending = [];
  spare = [];
  active = null;
  gpuMs = null;
  constructor(e) {
    ((this.gl = e.getContext()),
      (this.extension = /[?&](profile|debug)/.test(location.search)
        ? this.gl.getExtension("EXT_disjoint_timer_query_webgl2")
        : null));
  }
  begin() {
    !this.extension ||
      this.pending.length >= 3 ||
      ((this.active = this.spare.pop() ?? this.gl.createQuery()),
      this.active &&
        this.gl.beginQuery(this.extension.TIME_ELAPSED_EXT, this.active));
  }
  end() {
    !this.extension ||
      !this.active ||
      (this.gl.endQuery(this.extension.TIME_ELAPSED_EXT),
      this.pending.push(this.active),
      (this.active = null));
  }
  poll() {
    if (!this.extension || !this.pending.length) return;
    let e = this.pending[0];
    this.gl.getQueryParameter(e, this.gl.QUERY_RESULT_AVAILABLE) &&
      (this.pending.shift(),
      this.gl.getParameter(this.extension.GPU_DISJOINT_EXT) ||
        (this.gpuMs = this.gl.getQueryParameter(e, this.gl.QUERY_RESULT) / 1e6),
      this.spare.push(e));
  }
  dispose() {
    this.active &&
      this.extension &&
      this.gl.endQuery(this.extension.TIME_ELAPSED_EXT);
    for (let e of [
      ...this.pending,
      ...this.spare,
      ...(this.active ? [this.active] : []),
    ])
      this.gl.deleteQuery(e);
    ((this.pending.length = this.spare.length = 0), (this.active = null));
  }
};
export { Ba, Pa, Va, bs, ds, fs, vs, xs };
