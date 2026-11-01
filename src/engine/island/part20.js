// island.js - part 20/21 (statements 211-211 of the original module).
import { IntegratedOcean, transitionSpectrum } from "../ocean.js";
import { createIntegratedBoat } from "../boat-runtime.js";
import * as et from "three";
import { OrbitControls as yi } from "three/addons/controls/OrbitControls.js";
import { Ie, ne, re, ve } from "./part01.js";
import { sr } from "./part05.js";
import { dn, fn, hn, mn } from "./part08.js";
import { Ha, Rr, Sr, yr } from "./part10.js";
import { gn } from "./part11.js";
import { Br } from "./part12.js";
import { _r, sa } from "./part14.js";
import { $r, Kr, Ur, Yr, po } from "./part15.js";
import { Jr, Xr, Zr, es } from "./part17.js";
import { Na, cs, hs, ia, is, kn, ls, ms, us } from "./part18.js";
import { Ba, Pa, Va, bs, ds, fs, vs, xs } from "./part19.js";

function gs(o, e) {
  let t = matchMedia("(pointer:coarse)").matches || "ontouchstart" in window,
    r = Ie(Date.now() & 16777215),
    s = new et.WebGLRenderer({
      antialias: !0,
      powerPreference: "high-performance",
      stencil: !1,
    }),
    c = new Va(s);
  __PF.fixUnits(s);
  if (!s.extensions.has("EXT_color_buffer_float"))
    throw (
      s.dispose(),
      new Error(
        "This GPU does not expose EXT_color_buffer_float, which the FFT ocean needs.",
      )
    );
  let a = s.extensions.has("OES_texture_float_linear");
  ((s.toneMapping = et.ACESFilmicToneMapping),
    (s.outputColorSpace = et.SRGBColorSpace),
    (s.domElement.style.cssText =
      "position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none;outline:none"),
    (s.domElement.tabIndex = 0),
    o.appendChild(s.domElement));
  let n = null;
  s.debug.onShaderError = (Q, Te, at, Ue) => {
    ((n =
      [Q.getProgramInfoLog(Te), Q.getShaderInfoLog(at), Q.getShaderInfoLog(Ue)]
        .filter(Boolean)
        .join(
          `
`,
        )
        .slice(0, 1200) ||
      "The water renderer could not compile on this graphics device."),
      V({ error: n }));
  };
  let i = new et.Scene(),
    m = new et.PerspectiveCamera(60, 1, 0.4, 3e4);
  m.position.set(0, 760, 2380);
  let h = new yi(m, s.domElement);
  Object.assign(h, {
    enableDamping: !0,
    dampingFactor: 0.06,
    enablePan: !1,
    minDistance: 3,
    maxDistance: 9e3,
    maxPolarAngle: Math.PI * 0.49,
  });
  let { P: l, windSea: u, swell: d } = ds(),
    p = [
      [u, "windSpeed", 19],
      [u, "scale", 1],
      [u, "fetch", 300],
      [d, "windSpeed", 12],
      [d, "fetch", 900],
      [l, "chop", 2],
    ],
    x = p.map(([Q, Te]) => Q[Te]),
    f = 0,
    v = 0,
    b = () => p.forEach(([Q, Te, at], Ue) => (Q[Te] = ve(x[Ue], at, f))),
    g = 0,
    M = 0,
    w = l.cov,
    E = () => {
      ((l.cov = ve(w, 0.95, g)),
        (l.dens = ve(0.42 + w * 0.5, 0.95, g)),
        (l.expo = ve(1, 0.68, g)));
    };
  E();
  let k = l.height,
    R = l.chop,
    H = {
      depth: 500,
      get choppiness() {
        return R;
      },
      get foamDecay() {
        return l.foamDecay * (1 - 0.3 * f);
      },
      get systems() {
        return [u, d];
      },
    },
    C = new IntegratedOcean(s, H, t ? 128 : 256),
    T = transitionSpectrum(C, H, t ? 2.5 : 1.5),
    P = bs(),
    L = fs(P.uniforms, l),
    z = yr(s, L),
    D = sr(),
    q = {
      uIsl0: { value: D },
      uIsl1: { value: D },
      uIsl2: { value: D },
      uIsl3: { value: D },
      uIslB: {
        value: [
          new et.Vector4(),
          new et.Vector4(),
          new et.Vector4(),
          new et.Vector4(),
        ],
      },
    },
    N = {
      loading: !0,
      label: "Waking the sea",
      progress: 0,
      mode: "survey",
      island: "",
      islandInfo: "",
      place: "Open water",
      hour: l.hour,
      playing: !1,
      fps: 60,
      frameMs: 0,
      gpuMs: null,
      drawCalls: 0,
      triangles: 0,
      depth: 0,
      water: "sea",
      altitude: 0,
      speed: 0,
      heading: 0,
      seed: 1,
      peak: 0,
      area: 0,
      storm: 0,
      weather: 0,
      waveHeight: l.height,
      surf: l.shore,
      foam: l.foam,
      spray: l.spray,
      wetness: l.wetness,
      rivers: 0,
      lakes: 0,
      wetlands: 0,
      windDirection: u.direction,
      windSpeed: u.windSpeed,
      hs: 0,
      generating: !1,
      perfLevel: 0,
      error: null,
    },
    V = (Q) => {
      (Object.assign(N, Q), e(Q));
    },
    G = Jr(L),
    U = es();
  i.add(G, U);
  let K = Sr(256);
  K.anisotropy = Math.min(8, s.capabilities.getMaxAnisotropy());
  let X = new et.WebGLRenderTarget(768, 512, {
      type: et.HalfFloatType,
      minFilter: et.LinearFilter,
      magFilter: et.LinearFilter,
      depthBuffer: !0,
      generateMipmaps: !1,
    }),
    { WU: J, water: se, update: updateSeaGrid, setQuality: setSeaGridQuality } = Zr({
      U: L,
      IU: q,
      fftSize: C.size,
      reflectRT: X,
      foamTex: K,
    });
  const seaWakeZero=new et.DataTexture(new Uint8Array([0,0,0,0]),1,1,et.RGBAFormat);seaWakeZero.needsUpdate=true;
  J.uSeaWake={value:seaWakeZero}; J.uSeaWakeBox={value:new et.Vector3(0,0,240)};
  Object.assign(se.material.uniforms,{uSeaWake:J.uSeaWake,uSeaWakeBox:J.uSeaWakeBox});
  i.add(se);
  let te = new Pa(s),
    me = Br(256);
  me.anisotropy = Math.min(4, s.capabilities.getMaxAnisotropy());
  let $ = { ...J, ...te.uniforms, uWaterTex: { value: me } },
    Z = Xr(L);
  Z.forEach((Q) => i.add(Q));
  let j = xs(s, i, m, () => [se, ...Z, ...Ee.freshwaterObjects()]);
  ((J.uRefraction.value = j.target.texture),
    (J.uRefractionMatrix.value = j.matrix),
    (__PF.units?.perStage ?? 16) >= 24 &&
      (se.material.defines.WATER_REFRACTION = ""));
  let S = { leaf: hn(), frond: mn(), fern: fn(), needle: dn() },
    F = null,
    y = null,
    A = createIntegratedBoat(L);
  i.add(A);
  let B = Yr({
    scene: i,
    camera: m,
    renderer: s,
    target: X,
    water: se,
    rain: Z,
    getGrass: () => [F?.group, y?.group].filter((Q) => !!Q),
    getFreshwater: () => Ee.freshwaterObjects(),
  });
  J.uReflectionMatrix.value = B.matrix;
  let I = new URLSearchParams(location.search).get("q"),
    O = __PF.isQ(I) ? I : null,
    _ = 0,
    ae = (Q) => ({ high: 0, medium: 1, low: 2, lower: 3, lowest: 4 })[Q] ?? 2,
    le = new ia(s, {
      ...kn[ae(O ?? (t ? "lower" : "medium"))],
      floatTex: a,
      U: L,
      IU: q,
    });
  function Y() {
    (le.dispose(),
      (le = new ia(s, { ...kn[ae(Ae)], floatTex: a, U: L, IU: q })));
  }
  let he = is(() => Ee),
    Me = he.surfView;
  function xe(Q) {
    let Te = _e.boatState,
      at = m.position,
      Ue = N.mode === "boat" ? Te.x : at.x,
      ge = N.mode === "boat" ? Te.z : at.z,
      bt = Ee.islandAt(Ue, ge),
      Et = bt?.cellIndex(Ue, ge) ?? -1;
    if (
      Ee.isFreshAt(Ue, ge) ||
      (N.mode !== "boat" &&
        at.y < 90 &&
        Et >= 0 &&
        !!bt?.world &&
        bt.world.inl[Et] > 0.97 &&
        bt.world.cdist[Et] > 260)
    ) {
      ((L.uSurfOn.value = 0),
        (le.probe = { eta: 0, u: 0, v: 0, h: 0, ok: !0 }),
        (He = !0));
      return;
    }
    (He && (le.reset(), (He = !1)),
      le.update(
        Q,
        L.uTime.value,
        m,
        Ee.heightAt(at.x, at.z),
        {
          x: Te.x,
          z: Te.z,
          heading: Te.heading,
          speed: Te.speed,
          on: N.mode === "boat" && A.visible,
        },
        !lt,
        Ee.waterAt(Ue, ge).bed,
      ));
  }
  let He = !1,
    Ae = O ?? (t ? "lower" : "medium"),
    Ee = new sa(i, L, S, Ae, 1, a, $),
    We = null,
    Ve = null,
    Se = new Set(),
    oe = 0,
    Be = -0.06,
    je = 0,
    Ke = 0,
    ke = !0,
    be = s.domElement,
    ce = (Q) => {
      (Q.preventDefault(),
        (n =
          "The graphics context was lost. The generated field atlas is still available; retry 3D on low detail."),
        V({ error: n }));
    };
  be.addEventListener("webglcontextlost", ce);
  __PF.field = () => Ee;
  let Fe = vs({
      el: be,
      keys: Se,
      coarse: t,
      getMode: () => N.mode,
      escape: () => Ce.setMode("survey"),
      look: (Q, Te) => {
        ((oe += Q), (Be = re(Be + Te, -1.3, 1.1)));
      },
    }),
    _e = $r({
      camera: m,
      getField: () => Ee,
      keys: Se,
      boat: A,
      P: l,
      U: L,
      el: be,
      getYaw: () => oe,
      setYaw: (Q) => {
        oe = Q;
      },
      getPitch: () => Be,
      setPitch: (Q) => {
        Be = Q;
      },
      getDrag: () => Fe.drag,
      onStats: (Q, Te) => {
        ((je = Q), (Ke = Te));
      },
      getSurface: () => le.probe, renderer: s, scene: i, waterUniforms: J, controls: h,
    }),
    Ce = Ur({
      camera: m,
      controls: h,
      getField: () => Ee,
      getCurrent: () => We,
      setCurrent: (Q) => {
        We = Q;
      },
      boat: A,
      state: N,
      push: V,
      rnd: r,
      el: be,
      getYaw: () => oe,
      setYaw: (Q) => {
        oe = Q;
      },
      getPitch: () => Be,
      setPitch: (Q) => {
        Be = Q;
      },
      movement: _e,
    }),
    Ye = {
      lowest: { pr: 1, rain: 0.2, rw: 32 },
      lower: { pr: 1.25, rain: 0.35, rw: 32 },
      low: { pr: 2, rain: 0.5, rw: 448 },
      medium: { pr: 1.5, rain: 0.75, rw: 640 },
      high: { pr: 2, rain: 1, rw: 896 },
    },
    Xe = __PF.scale;
  function st() {
    let Q = o.clientWidth || 1,
      Te = o.clientHeight || 1;
    (s.setPixelRatio(__PF.pr(devicePixelRatio, Ye[Ae].pr, Q, Te) * Xe),
      s.setSize(Q, Te, !1),
      (m.aspect = Q / Te),
      m.updateProjectionMatrix(),
      (L.uPx.value =
        (2 * Math.tan((m.fov * Math.PI) / 360)) / (Te * s.getPixelRatio())));
    let at = Math.round(Ye[Ae].rw * (_ > 1 ? 0.65 : 1));
    (X.setSize(at, Math.max(1, Math.round((at * Te) / Q))),
      j.target.setSize(at, Math.max(1, Math.round((at * Te) / Q))));
  }
  function it() {
    let Q = o.clientWidth || 1,
      Te = o.clientHeight || 1;
    (s.setPixelRatio(__PF.pr(devicePixelRatio, Ye[Ae].pr, Q, Te) * Xe),
      s.setSize(Q, Te, !1),
      (L.uPx.value =
        (2 * Math.tan((m.fov * Math.PI) / 360)) / (Te * s.getPixelRatio())));
  }
  function ot() {
    (__PF.apply(Ae),
      (l.reflections = __PF.q.refl),
      (L.uSkyLQ.value = __PF.q.sky));
    let Q = Ye[Ae];
    (setSeaGridQuality(Ae),
      Z.forEach(
        (Te) =>
          (Te.geometry.instanceCount = Math.floor(Te.userData.n * Q.rain)),
      ),
      F?.dispose(),
      (F = new Ha(Rr[Ae], L, () => Ee, __PF.q.grassSh)),
      y?.dispose(),
      (y = new Ba(Ae, L, () => Ee)),
      i.add(y.group),
      z.setSize(__PF.q.shadow),
      i.add(F.group),
      st());
  }
  let Mt = new ResizeObserver(st);
  (Mt.observe(o), ot());
  let { updateSky: Ct, updateLightning: Ot } = _r({
      U: L,
      P: l,
      camera: m,
      seabed: U,
      renderer: s,
      getStorm: () => f,
      getWeather: () => g,
      wind: u,
      swell: d,
    }),
    lt = !1;
  function _t(Q) {
    (Ee.dispose(),
      (Ee = new sa(i, L, S, Ae, Q >>> 0, a, $)),
      (We = Ve = null),
      (A.visible = !1),
      (h.enabled = !0),
      le.reset(),
      (lt = !0),
      V({
        loading: !0,
        progress: 0,
        label: "Raising the seabed",
        seed: Q,
        mode: "survey",
        island: "",
        islandInfo: "",
        rivers: 0,
        lakes: 0,
        wetlands: 0,
        error: n,
      }));
  }
  function Ut() {
    lt = !1;
    __PF.precompile(s, i, m);
    let Q = Ee.home;
    if (Ee.worldSeed === 504 && Q.world) Q.world.name = 'Valara Cay';
    We = Q;
    let Te = Ce.surveyView(Q);
    (m.position.copy(Te.pos),
      h.target.copy(Te.look),
      h.update(),
      V({ loading: !1, progress: 1, label: "", ...po(Q) }));
  }
  let It = performance.now(),
    qt = 60,
    Tt = 0,
    $t = 0,
    Dt = !1,
    jt = !1,
    ua = new et.Vector3(1e9, 0, 0),
    Vo = new URLSearchParams(location.search).get("fps"),
    Go = Vo ? (Number(Vo) >= 50 ? 0 : 28) : t ? 28 : 0,
    Eo = 0,
    go = 0,
    Kt = 0,
    Ro = 0,
    Jt = 0,
    Oo = 0;
  function Nn(Q) {
    let Te = performance.now();
    if (jt) {
      It = Q;
      return;
    }
    if (__PF.gate(Q, It, lt)) return;
    let at = Math.max((Q - It) / 1e3, 1e-4),
      Ue = Math.min(at, 0.1);
    if (
      ((It = Q),
      (qt = qt * 0.93 + Math.min(240, 1 / at) * 0.07),
      $t++,
      !lt && __PF.tick(at, Te) && ((Xe = __PF.scale), it(), !1))
    ) {
      let Ne = (Eo / go) * 1e3,
        qe = performance.now(),
        Lt = [1, 0.8, 0.64];
      (Ne > 42 && ++Ro >= 2 && Jt < Lt.length - 1
        ? (Jt++, (Ro = 0), (Kt = 0), (Oo = qe), (Xe = Lt[Jt]), it())
        : Ne <= 42 &&
          ((Ro = 0),
          Ne < 35 && Jt > 0 && qe - Oo > 25e3 && ++Kt >= 6
            ? (Jt--, (Kt = 0), (Xe = Lt[Jt]), it())
            : Ne >= 35 && (Kt = 0)),
        (Eo = 0),
        (go = 0));
    }
    if (((L.uTime.value += Ue), n)) return;
    if (lt) {
      let Ne = Ee.home,
        qe = Ne.step(32, i, Ee.shared);
      if ((V({ progress: Ne.progress, label: Ne.label }), !qe)) return;
      Ut();
    }
    (c.poll(),
      c.begin(),
      l.play && (l.hour = (l.hour + (Ue * 24) / (l.dayMin * 60)) % 24),
      Math.abs(v - f) > 5e-4
        ? ((f += (v - f) * (1 - Math.exp(-Ue / 5))), b(), (T.dirty = !0))
        : f !== v && ((f = v), b(), (T.dirty = !0)),
      g !== M &&
        ((g =
          Math.abs(M - g) > 5e-4 ? g + (M - g) * (1 - Math.exp(-Ue / 3)) : M),
        E()),
      (k += (l.height - k) * (1 - Math.exp(-Ue / 0.8))),
      Math.abs(l.height - k) > 0.004 && (T.dirty = !0),
      (u.scale = ve(x[1], 1, f) * k * k),
      (d.scale = 0.7 * k * k),
      (l.hs =
        4 *
        Math.sqrt(
          gn({ ...u, scale: ve(x[1], 1, f) }, k) + gn({ ...d, scale: 0.7 }, k),
        )),
      (R = l.chop / (1 + 0.08 * Math.max(l.hs - 3, 0))),
      T.update(Ue, L.uTime.value),
      C.update(L.uTime.value, Ue));
    for (let Ne = 0; Ne < 3; Ne++)
      ((J["uD" + Ne].value = C.displacement(Ne)),
        (J["uF" + Ne].value = C.derivatives(Ne)));
    (Ot(Ue), Ct());
    if(N.mode!=="boat")_e.seaBoat.idle(Ue,L.uTime.value);
    let ge = m.position;
    // The coastal probe guides navigation, not the global swell phase. Ct owns uSwDir.
    ((he.timer -= Ue) <= 0 && !lt && ((he.timer = 0.5), he.update(ge.x, ge.z)),
      lt ||
        Ee.update(ge.x, ge.z, Ue, N.mode === "fly" ? 12 : __PF.genBudget, Ve));
    let bt = Ee.nearestReady(ge.x, ge.z, 4);
    for (let Ne = 0; Ne < 4; Ne++) {
      let qe = bt[Ne];
      ((q["uIsl" + Ne].value = qe ? qe.landTex : D),
        q.uIslB.value[Ne].set(
          qe ? qe.spec.cx : 0,
          qe ? qe.spec.cz : 0,
          qe ? qe.spec.half : 1,
          qe ? 1 : 0,
        ));
    }
    if (!l.vegetation)
      for (let Ne of Ee.islands.values()) Ne.vegVisible && Ne.setVegVisible(!1);
    if (!lt) {
      if (N.mode === "fly") Ce.updateFly(Ue);
      else if (N.mode === "walk") _e.updateWalk(Ue);
      else if (N.mode === "boat") _e.updateBoat(Ue);
      else {
        if (ke && !Fe.drag) {
          let fa = Ue * 0.015,
            da = h.target,
            Vn = ge.x - da.x,
            Gn = ge.z - da.z;
          ((ge.x = da.x + Vn * Math.cos(fa) - Gn * Math.sin(fa)),
            (ge.z = da.z + Vn * Math.sin(fa) + Gn * Math.cos(fa)));
        }
        let qe = h.target,
          Lt = 0.5 + 0.2 * l.hs;
        (qe.y < Lt && (qe.y += (Lt - qe.y) * Math.min(1, Ue * 0.8)),
          h.update());
        let Uo = Ee.waterAt(ge.x, ge.z),
          qo = Math.max(
            Uo.bed + 1.7,
            Uo.level + (Uo.type === 1 ? 0.8 + 0.35 * l.hs : 1.25),
          );
        ge.y < qo && (ge.y = qo);
      }
      let Ne = Ee.islandAt(ge.x, ge.z);
      Ne && Ne !== We && N.mode !== "fly" && ((We = Ne), V(po(Ne)));
    }
    (U.position.set(ge.x, -Math.max(36, 1.3 * l.hs + 20), ge.z), xe(Ue));
    updateSeaGrid(m, l.hs);
    let Et = _e.boatState,
      _o = N.mode === "boat" && A.visible && Ee.isFreshAt(Et.x, Et.z);
    _o
      ? te.track(
          "boat",
          Et.x,
          Et.z,
          Math.cos(Et.heading) * Et.speed,
          Math.sin(Et.heading) * Et.speed,
          2.9,
          L.uTime.value,
        )
      : te.remove("boat");
    let ha = _o ? Et.x : ge.x,
      ma = _o ? Et.z : ge.z,
      wo = Ee.islandAt(ha, ma),
      So = wo?.cellIndex(ha, ma) ?? -1,
      Ds = So >= 0 && !!wo?.world && wo.world.wet[So] === 1,
      Ls = !lt && Ds && Ee.freshAt(ha, ma) > 0.13 && (_o || ge.y < 125);
    te.update(
      Ue,
      L.uTime.value,
      ha,
      ma,
      So >= 0 && wo?.world ? wo.world.flowX[So] : 0,
      So >= 0 && wo?.world ? wo.world.flowZ[So] : 0,
      Ls,
    );
    {
      let Ne = ge.y - Math.max(Ee.heightAt(ge.x, ge.z), 0),
        qe = re(Ne * 0.015, N.mode === "boat" ? 1.2 : 0.4, 8);
      Math.abs(qe - m.near) > m.near * 0.02 &&
        ((m.near = qe), m.updateProjectionMatrix());
    }
    (F &&
      ((F.group.visible = l.vegetation), l.vegetation && !lt && F.update(m)),
      y &&
        ((y.group.visible = l.vegetation), l.vegetation && !lt && y.update(m)));
    let In = 0,
      $a = Ee.freshAt(ge.x, ge.z) > 0.18 && ge.y < 220,
      ja = Ee.islandAt(ge.x, ge.z),
      Pn = ja?.cellIndex(ge.x, ge.z) ?? -1,
      Ka = $a && Pn >= 0 && ja?.world ? ja.world.nearLevel[Pn] : 0;
    if (
      l.reflections &&
      N.mode !== "fly" &&
      (N.mode !== "survey" || ge.y < 140)
    ) {
      let Ne = $a;
      if (!Ne) {
        for (let qe of Ee.islands.values())
          if (
            qe.stage >= 2 &&
            Math.hypot(ge.x - qe.spec.cx, ge.z - qe.spec.cz) - qe.spec.half <
              4500
          ) {
            Ne = !0;
            break;
          }
      }
      Ne &&
        ((J.uReflectionLevel.value = Ka),
        (!Dt || $t % __PF.reflEvery === 0) &&
          ((Dt = B.render(Ka)), ua.copy(ge)),
        (In = Dt ? 1 : 0));
    }
    ((J.uReflectionStrength.value = 0.94 - 0.38 * ne(1.2, 4.5, l.hs)),
      (J.uReflectionActive.value = In),
      (J.uRefractionActive.value = 0),
      $a &&
        __PF.q.refr &&
        ge.y < Ka + 45 &&
        N.mode !== "fly" &&
        (__PF.units?.perStage ?? 16) >= 24 &&
        (j.render(), (J.uRefractionActive.value = 1)));
    {
      let Ne = ge.y - Math.max(Ee.heightAt(ge.x, ge.z), 0),
        qe = L.uSun.value.y,
        Lt =
          l.vegetation && !lt && _ < 2 && N.mode !== "fly"
            ? ne(0.035, 0.14, qe) * (1 - ne(110, 180, Ne)) * (1 - 0.6 * g)
            : 0;
      ($t % __PF.q.shEvery === 0 || Lt <= 0.004) &&
        z.update(
          i,
          m,
          L.uSun.value,
          Lt > 0.004 ? Ee.shadowCasters(ge.x, ge.z, __PF.q.shRange) : [],
          Lt,
        );
    }
    if (
      (s.render(i, m),
      c.end(),
      (Tt += Ue),
      Tt > (t ? 0.75 : 0.2))
    ) {
      Tt = 0;
      let Ne = Ee.waterAt(ge.x, ge.z),
        qe = Ee.islandAt(ge.x, ge.z),
        Lt = qe?.cellIndex(ge.x, ge.z) ?? -1,
        Uo = Ne.type === 1 && Lt >= 0 && !!qe?.world && qe.world.inl[Lt] > 0.55;
      V({
        fps: Math.round(qt),
        hour: l.hour,
        speed: je,
        heading: N.mode === 'survey' ? (Math.atan2(m.getWorldDirection(new et.Vector3()).x,-m.getWorldDirection(new et.Vector3()).z)*180/Math.PI+360)%360 : Ke,
        frameMs: Math.round((performance.now() - Te) * 10) / 10,
        gpuMs: c.gpuMs === null ? null : Math.round(c.gpuMs * 10) / 10,
        drawCalls: s.info.render.calls,
        triangles: s.info.render.triangles,
        depth: Math.max(0, Ne.type === 1 ? -Ne.bed : 0),
        water: Ne.type === 1 ? (Uo ? "fresh" : "sea") : "land",
        altitude: ge.y,
        place: Kr(qe, ge.x, ge.z),
        storm: v,
        waveHeight: l.height,
        hs: l.hs,
        windDirection: u.direction,
        windSpeed: u.windSpeed,
        generating: Ee.queue.some((qo) => !qo.done && qo.stage < 2),
      });
    }
  }
  (s.setAnimationLoop(Nn),
    location.search.includes("debug") && (window.__ready = !0));
  let Cs = ls({
      state: N,
      camera: m,
      controls: h,
      boat: A,
      el: be,
      rnd: r,
      push: V,
      flight: Ce,
      movement: _e,
      surfView: Me,
      getField: () => Ee,
      getCurrent: () => We,
      setCurrent: (Q) => {
        We = Q;
      },
      setPending: (Q) => {
        Ve = Q;
      },
      setLook: (Q, Te) => {
        ((oe = Q), (Be = Te));
      },
      snapSurf: () => {
        ((he.snap = !0), le.reset());
      },
    }),
    Bn = hs({
      camera: m,
      controls: h,
      boat: A,
      push: V,
      flight: Ce,
      movement: _e,
      getField: () => Ee,
      setCurrent: (Q) => {
        We = Q;
      },
      setLook: (Q, Te) => {
        ((oe = Q), (Be = Te));
      },
    });
  return {
    get currentIsland() {
      return We;
    },
    get camera() {
      return m;
    },
    regenerate: _t,
    setMode: Ce.setMode,
    setCameraMode(Q) { _e.seaBoat.setCamera(Q); },
    rightBoat() { _e.seaBoat.right(); },
    getBoatState() { return _e.seaBoat.telemetry(); },
    setThrottle(Q) { _e.seaBoat.setThrottle(Q); },
    setMist(Q) { l.fog = re(Q, 0, 1) * 3.5; V({ mist: Q }); },
    capture() { updateSeaGrid(m, l.hs); s.render(i, m); return s.domElement.toDataURL('image/png'); },
    get renderer() { return s; },
    teleport: Cs,
    setPaused(Q) {
      ((jt = Q), Se.clear());
    },
    setKey(Q, Te) {
      Te ? Se.add(Q) : Se.delete(Q);
    },
    debugCapture() {
      (F?.update(m, 70), y?.update(m, 70));
      let Q = jt;
      return (
        (jt = !1),
        (Dt = !1),
        (Tt = 1),
        Nn(performance.now()),
        (jt = Q),
        {
          ...s.info.render,
          detail: y?.stats,
          reflections: J.uReflectionActive.value,
          refraction: J.uRefractionActive.value,
        }
      );
    },
    surveyAt(Q, Te) {
      ms({ island: We, field: Ee, boat: A, flight: Ce }, Q, Te);
    },
    debugView: Bn.debugView,
    debugBoat: Bn.debugBoat,
    debugSurf(Q = 28, Te = -8, at = 1.7) {
      let Ue = Ee.home;
      if (!Ue?.world) return null;
      let ge = Ue.beachSpot(Ie(7));
      if (!ge) return null;
      let bt = Me(ge.x, ge.z, (Q * Math.PI) / 180);
      return (
        this.debugView("walk", bt.x, bt.z, (bt.yaw * 180) / Math.PI, Te, at),
        (he.snap = !0),
        (he.timer = 0),
        le.reset(),
        { x: bt.x, z: bt.z, yaw: bt.yaw }
      );
    },
    debugWarm(Q) {
      let Te = Math.round(Q * 60);
      for (let at = 0; at < Te; at++) ((L.uTime.value += 1 / 60), xe(1 / 60));
    },
    debugStats() {
      return cs({
        surf: le,
        camera: m,
        onshore: he.valid ? he.dir : null,
        U: L,
        P: l,
      });
    },
    debugWaterState() {
      return {
        rain: L.uRain.value,
        windAmount: L.uWindAmt.value,
        windX: L.uWind.value.x,
        windZ: L.uWind.value.y,
        sky: L.uStorm.value,
        surfActive: L.uSurfOn.value,
      };
    },
    debugSea(Q, Te) {
      ((f = v = re(Q, 0, 1)),
        b(),
        (l.height = k = re(Te, 0.2, 2.5)),
        (T.dirty = !0),
        V({ storm: v, waveHeight: l.height }));
    },
    debugWeather(Q) {
      ((g = M = re(Q, 0, 1)), E(), V({ weather: g }));
    },
    get world() {
      return We?.world ?? null;
    },
    get shaderError() {
      return n;
    },
    getFreshwaterView(Q, Te) {
      return We?.world ? Na(We.world, Q, Te) : null;
    },
    get currentCenter() {
      return We ? { x: We.spec.cx, z: We.spec.cz } : null;
    },
    setHour(Q) {
      ((l.hour = ((Q % 24) + 24) % 24), V({ hour: l.hour }));
    },
    setPlaying(Q) {
      ((l.play = Q), V({ playing: Q }));
    },
    setCloud(Q) {
      ((w = re(Q, 0, 1)), E());
    },
    setWeather(Q) {
      ((M = re(Q, 0, 1)), V({ weather: M }));
    },
    setWindDirection(Q) {
      ((u.direction = re(Q, -180, 180)),
        (T.dirty = !0),
        V({ windDirection: u.direction }));
    },
    setStorm(Q) {
      ((v = M = re(Q, 0, 1)), V({ storm: v, weather: M }));
    },
    setWaveHeight(Q) {
      ((l.height = re(Q, 0.2, 2.5)),
        (T.dirty = !0),
        V({ waveHeight: l.height }));
    },
    setSurf(Q) {
      ((l.shore = re(Q, 0.35, 1.8)), V({ surf: l.shore }));
    },
    setFoam(Q) {
      ((l.foam = re(Q, 0.25, 2)),
        (L.uFoamGain.value = l.foam),
        V({ foam: l.foam }));
    },
    setSpray(Q) {
      ((l.spray = re(Q, 0, 2)),
        (L.uSprayGain.value = l.spray),
        V({ spray: l.spray }));
    },
    setWetness(Q) {
      ((l.wetness = re(Q, 0.2, 3)),
        (L.uWetDry.value = l.wetness),
        V({ wetness: l.wetness }));
    },
    setVegetation(Q) {
      l.vegetation = Q;
    },
    setWakeSource(Q, Te, at, Ue, ge, bt = 1.2) {
      te.track(Q, Te, at, Ue, ge, bt, L.uTime.value);
    },
    removeWakeSource(Q) {
      te.remove(Q);
    },
    setQuality(Q) {
      ((Ae = Q), ot(), Y(), _t(Ee.worldSeed));
    },
    setAutoOrbit(Q) {
      ke = Q;
    },
    getCamera() {
      return { x: m.position.x, y: m.position.y, z: m.position.z };
    },
    dispose() {
      (s.setAnimationLoop(null),
        seaWakeZero.dispose(),
        Fe.dispose(),
        _e.seaBoat.dispose(),
        Mt.disconnect(),
        be.removeEventListener("webglcontextlost", ce),
        z.dispose(),
        P.dispose(),
        y?.dispose(),
        j.dispose(),
        te.dispose(),
        c.dispose(),
        us({
          scene: i,
          renderer: s,
          controls: h,
          field: Ee,
          fft: C,
          reflectRT: X,
          surf: le,
          water: se,
          sky: G,
          seabed: U,
          rain: Z,
          grass: F,
          boat: A,
          emptyLand: D,
          foamTex: K,
          maps: S,
        }));
    },
  };
}
export { gs };
