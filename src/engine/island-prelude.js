
/* Island runtime helpers: console flood guard, frame pacing + adaptive resolution,
   stable water grid, reflection LOD, shader warm-up and the single-HTML exporter.
   Everything here is referenced by the patched engine as window.__PF. */
(() => {
  "use strict";

  /* 1) Console flood guard. three.js printed a texture-unit warning on every draw call; inside
        viewers that capture the console (e.g. the Claude app) that alone collapsed the frame rate. */
  const seen = new Map();
  ["warn", "error"].forEach((k) => {
    const orig = typeof console[k] === "function" ? console[k].bind(console) : null;
    if (!orig) return;
    console[k] = (...args) => {
      let key = k;
      try { for (const a of args) key += "|" + (typeof a === "string" ? a : a && a.message ? a.message : typeof a); } catch (e) {}
      key = key.slice(0, 240);
      const n = (seen.get(key) || 0) + 1;
      if (seen.size > 400) seen.clear();
      seen.set(key, n);
      if (n <= 2) return orig(...args);
      if (n === 3) orig("[island] identical message muted after 2 repeats: " + key.slice(k.length + 1, 150));
    };
  });

  const qs = new URLSearchParams(location.search);
  const touch = matchMedia("(pointer:coarse)").matches || "ontouchstart" in window;
  let pref = "60";
  try { pref = localStorage.getItem("island.pacing") || "60"; } catch (e) {}
  const fq = qs.get("fps");
  if (fq) pref = Number(fq) >= 50 ? "60" : "30";
  if (pref !== "60" && pref !== "30") pref = "auto";

  const S = (window.__PF = {
    touch,
    pref,
    lock30: pref === "30",
    scale: touch ? (pref === "30" ? 1 : 0.86) : 1,
    reflEvery: 1,
    genBudget: touch ? 3.5 : 7,
    adaptive: qs.get("adaptive") !== "0",
    avg: 0,
    field: null,
    renderer: null,
    units: null,
  });

  /* 1b) Render-detail presets, lowest -> high. All per-preset numbers live here so the engine patches stay
         tiny: the engine asks __PF.cfg(quality) (islands) or __PF.q (the active preset).
         lowest / lower are the 60 fps presets: no planar reflections, cheap procedural clouds, cheap prop
         shadows (small map, few taps, refreshed every 2nd frame), thinned vegetation and a small sea-surface
         (shallow-water) simulation window around the camera / boat. */
  const PRESETS = {
    lowest: {
      note: "No reflections · cheapest clouds · cheapest shadows · 60% vegetation · 154 m sea sim",
      refl: false, refr: false, sky: 2,
      shadow: 512, shMode: 2, shEvery: 2, shRange: 130, grassSh: false,
      veg: 0.6, fade: 0.6, vegDist: 2200,
      terrain: { PROP_SHADOWS: "", FAR0: "300.", FAR1: "520.", LOWQ: "", SHCHEAP: "" },
    },
    lower: {
      note: "No reflections · cheap clouds · cheap shadows · 75% vegetation · 192 m sea sim",
      refl: false, refr: false, sky: 1,
      shadow: 768, shMode: 1, shEvery: 2, shRange: 150, grassSh: true,
      veg: 0.75, fade: 0.7, vegDist: 2600,
      terrain: { PROP_SHADOWS: "", FAR0: "380.", FAR1: "650.", LOWQ: "" },
    },
    low: {
      note: "Mirror reflections · no prop shadows · full clouds",
      refl: true, refr: false, sky: 0,
      shadow: 0, shMode: 0, shEvery: 1, shRange: 260, grassSh: false,
      veg: 1, fade: 0.8, vegDist: 3200,
      terrain: { FAR0: "420.", FAR1: "720.", LOWQ: "" },
    },
    medium: {
      note: "Reflections · soft prop shadows · full clouds",
      refl: true, refr: true, sky: 0,
      shadow: 1024, shMode: 0, shEvery: 1, shRange: 260, grassSh: true,
      veg: 1, fade: 1, vegDist: 4200,
      terrain: { PROP_SHADOWS: "", FAR0: "800.", FAR1: "1300." },
    },
    high: {
      note: "Everything on",
      refl: true, refr: true, sky: 0,
      shadow: 2048, shMode: 0, shEvery: 1, shRange: 260, grassSh: true,
      veg: 1, fade: 1, vegDist: 5400,
      terrain: { PROP_SHADOWS: "" },
    },
  };
  S.cfg = (q) => PRESETS[q] || PRESETS.medium;
  S.isQ = (q) => Object.prototype.hasOwnProperty.call(PRESETS, q);
  S.q = PRESETS.medium;
  S.apply = (q) => {
    S.q = S.cfg(q);
    /* smaller per-frame streaming slice on the 60 fps presets so terrain/flora builds do not spike a frame */
    S.genBudget = S.touch ? (S.q.shMode > 0 ? 2.5 : 3.5) : 7;
    return S.q;
  };
  const st = { acc: 0, n: 0, slowN: 0, fastN: 0, changed: 0, t0: 0, ceil: 9, ceilT: 0, retry60: 0, backoff: 45000, probe: null, pending: 0 };
  const subs = new Set();
  S.on = (f) => { subs.add(f); return () => subs.delete(f); };
  const emit = () => subs.forEach((f) => { try { f(S); } catch (e) {} });
  const minScale = () => (S.touch ? (S.lock30 || S.pref === "60" ? 0.5 : 0.6) : 0.75);
  const syncRefl = () => { S.reflEvery = S.touch && !S.lock30 ? 2 : 1; };
  syncRefl();

  function set(v, now) {
    v = Math.round(Math.min(1, Math.max(minScale(), v)) * 100) / 100;
    if (Math.abs(v - S.scale) < 0.015) return 0;
    S.scale = v;
    st.changed = now;
    return v;
  }

  /* 2) Frame pacing. Touch: 60 fps target (120 Hz panels render every other vblank) or an even 30 fps
        lock. Desktop: uncapped like the original. Returns true to skip this vblank. */
  S.gate = (Q, last, loading) => {
    if (loading) return false;
    const d = Q - last;
    return S.lock30 ? d < 30.5 : S.touch && d < 9.5;
  };

  /* 3) Adaptive resolution with hysteresis. Returns a new render scale (engine calls it()) or 0. */
  S.tick = (dt, now) => {
    if (st.pending) { const v = set(st.pending, now); st.pending = 0; emit(); return v; }
    if (!st.t0) st.t0 = now;
    if (now - st.t0 < 3000 || dt > 0.25) return 0;
    st.acc += dt; st.n++;
    if (st.acc < 1) return 0;
    const avg = (st.acc / st.n) * 1000;
    st.acc = 0; st.n = 0;
    S.avg = avg;
    const r = S.adaptive ? decide(avg, now) : 0;
    emit();
    return r;
  };

  function decide(avg, now) {
    const lock = S.lock30, auto = S.pref === "auto";
    if (st.probe) {
      st.probe.bad = avg > 19.6 ? st.probe.bad + 1 : 0;
      if (st.probe.bad >= 2) {
        const back = st.probe.scale;
        st.probe = null;
        S.lock30 = true; syncRefl();
        st.backoff = Math.min(st.backoff * 2, 6e5);
        st.retry60 = now + st.backoff;
        st.slowN = st.fastN = 0;
        return set(back, now);
      }
      if (now - st.probe.t > 10000) st.probe = null;
      else return 0;
    }
    const slowT = lock ? 38 : 19.6, fastT = lock ? 35.2 : 17.6;
    st.slowN = avg > slowT ? st.slowN + 1 : 0;
    st.fastN = avg < fastT ? st.fastN + 1 : 0;
    if (st.slowN >= 2 && now - st.changed > 1800) {
      st.slowN = 0;
      if (!lock && auto && S.touch && (avg > 27.7 || S.scale <= minScale() + 0.005)) {
        S.lock30 = true; syncRefl();
        st.retry60 = now + st.backoff;
        st.changed = now;
        return set(S.scale * 1.15, now);
      }
      if (S.scale > minScale() + 0.005) {
        st.ceil = S.scale; st.ceilT = now;
        const k = Math.sqrt((lock ? 33.4 : 16.7) / avg);
        return set(S.scale * Math.min(0.93, Math.max(0.8, k)), now);
      }
      return 0;
    }
    if (st.fastN >= (lock ? 5 : 4) && now - st.changed > 4000) {
      st.fastN = 0;
      if (S.scale < 0.995) {
        const up = Math.min(1, S.scale * 1.06 + 0.01);
        if (up >= st.ceil - 0.005 && now - st.ceilT < 30000) return 0;
        return set(up, now);
      }
      if (lock && auto && S.touch && now > st.retry60) {
        st.probe = { t: now, scale: S.scale, bad: 0 };
        S.lock30 = false; syncRefl();
        st.changed = now;
        return set(S.scale * 0.9, now);
      }
    }
    return 0;
  }

  S.setPref = (v) => {
    S.pref = v;
    try { localStorage.setItem("island.pacing", v); } catch (e) {}
    st.probe = null; st.slowN = st.fastN = 0; st.backoff = 45000; st.retry60 = 0; st.ceil = 9;
    S.lock30 = v === "30"; syncRefl();
    if (v === "30" && S.touch) st.pending = 1;
    emit();
  };

  /* 4) Pixel ratio: phones may now reach 2x (was hard-capped at 1.25 and collapsed to 0.8), bounded by
        a pixel budget so tablets don't explode the fill rate. */
  S.pr = (dpr, cap, w, h) => {
    let p = Math.min(dpr || 1, cap);
    if (S.touch) p = Math.min(p, Math.sqrt(2.1e6 / Math.max(1, w * h)));
    return Math.max(0.5, p);
  };

  /* 5) three.js compares sampler units against MAX_TEXTURE_IMAGE_UNITS (per stage, 16 on phones) although
        units are a shared pool of MAX_COMBINED_TEXTURE_IMAGE_UNITS (>= 32 on every WebGL2 device). The
        ocean binds 17-19 samplers across both stages (each stage stays <= 16, otherwise it would not link),
        so the binding is valid; only the per-draw warning was wrong, and it fired every frame. */
  S.fixUnits = (r) => {
    S.renderer = r;
    try {
      const g = r.getContext();
      const comb = g.getParameter(g.MAX_COMBINED_TEXTURE_IMAGE_UNITS) | 0;
      S.units = { perStage: r.capabilities.maxTextures, combined: comb };
      if (comb > r.capabilities.maxTextures) r.capabilities.maxTextures = comb;
    } catch (e) {}
  };

  /* 6) Water grid anchor with a 0.75 m dead zone: the radial ocean grid used to slide with every
        centimetre of camera motion, re-sampling the sparse far vertices each frame. */
  S.grid = (v, p) => {
    const dx = p.x - v.x, dz = p.z - v.y, d2 = dx * dx + dz * dz;
    if (d2 > 2500) v.set(p.x, p.z);
    else if (d2 > 0.5625) { const k = 1 - 0.75 / Math.sqrt(d2); v.x += dx * k; v.y += dz * k; }
  };

  /* 7) Reflection pass on touch devices: vegetation chunks beyond half their LOD distance render their
        LOD mesh into the (low-res, wave-distorted) mirror texture instead of the full mesh. */
  const sw = [];
  S.reflPre = (cam) => {
    sw.length = 0;
    if (!S.touch || !S.field || !cam) return;
    let f;
    try { f = S.field(); } catch (e) { return; }
    if (!f || !f.islands) return;
    for (const isl of f.islands.values()) {
      if (!isl.vegOn || !isl.chunks) continue;
      const ox = cam.x - isl.spec.cx, oz = cam.z - isl.spec.cz;
      for (const c of isl.chunks) {
        if (!c.lo || !c.hi.visible) continue;
        const d = Math.hypot(ox - c.cx, oz - c.cz) - c.r * 0.55;
        if (!(d > c.hiDist * 0.5)) continue;
        sw.push(c, c.lo.visible, c.lo.userData.lodOpacity);
        c.hi.visible = false;
        c.lo.visible = true;
        c.lo.userData.lodOpacity = 1;
      }
    }
  };
  S.reflPost = () => {
    for (let i = 0; i < sw.length; i += 3) {
      const c = sw[i];
      c.hi.visible = true;
      c.lo.visible = sw[i + 1];
      c.lo.userData.lodOpacity = sw[i + 2];
    }
    sw.length = 0;
  };

  /* 8) Shader warm-up when the first island is ready, so turning toward the island or sailing into
        streaming vegetation no longer stalls on program compilation. */
  S.precompile = (r, scene, cam) => {
    if (S._pre) return;
    S._pre = true;
    const hidden = [];
    try {
      scene.traverse((o) => { if (!o.visible) { hidden.push(o); o.visible = true; } });
      if (r.compileAsync) r.compileAsync(scene, cam).catch(() => {});
      else r.compile(scene, cam);
    } catch (e) {
    } finally {
      for (const o of hidden) o.visible = false;
    }
  };

  /* 9) Single-HTML export: the patched worker + app inlined, the same CSS and this prelude. */
  S.buildSingle = () => {
    const src = window.__ISLAND_SRC || {
      worker: (document.getElementById("gen-worker") || {}).textContent || "",
      app: (document.getElementById("island-app") || {}).textContent || "",
    };
    if (!src.worker || !src.app) return null;
    const css = (document.getElementById("island-css") || {}).textContent || "";
    const pre = (document.getElementById("island-prelude") || {}).textContent || "";
    const js = (s) => s.replace(/<\/script/gi, "<\\/script").replace(/\x3C!--/g, "\\x3C!--");
    const SC = "script";
    const html = [
      "<!doctype html>",
      '<html lang="en">',
      "<head>",
      '<meta charset="UTF-8" />',
      '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />',
      '<meta name="theme-color" content="#0b2238" />',
      "<title>Island 09 · Living Shoreline</title>",
      '<link rel="modulepreload" href="https://cdn.jsdelivr.net/npm/three@0.186.1/+esm" crossorigin />',
      '<link rel="modulepreload" href="https://cdn.jsdelivr.net/npm/react@19.2.6/+esm" crossorigin />',
      "<" + SC + ' src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></' + SC + ">",
      '<style id="island-css">' + css + "</style>",
      "<" + SC + ' id="island-prelude">' + js(pre) + "</" + SC + ">",
      "</head>",
      '<body><div id="root"></div>',
      "<" + SC + ' type="text/plain" id="gen-worker">' + js(src.worker) + "</" + SC + ">",
      "<" + SC + ' type="module" id="island-app">' + js(src.app) + "</" + SC + ">",
      "</body>",
      "</html>",
    ].join("\n");
    return new Blob([html], { type: "text/html;charset=utf-8" });
  };

  /* ---------- tools UI ---------- */
  function buildUI() {
    if (document.querySelector(".ix-fab")) return;
    const fab = document.createElement("button");
    fab.type = "button";
    fab.className = "ix-fab";
    fab.setAttribute("aria-label", "Island tools");
    fab.setAttribute("aria-expanded", "false");
    fab.title = "Island tools: save as single HTML, frame pacing";
    fab.innerHTML = '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5M5 19.5h14"/></svg>';
    const panel = document.createElement("div");
    panel.className = "ix-panel";
    panel.hidden = true;
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-label", "Island tools");
    panel.innerHTML =
      '<div class="ix-h">Island tools</div>' +
      '<button type="button" class="ix-btn ix-save">Save as single HTML</button>' +
      '<button type="button" class="ix-btn ix-ghost ix-share" hidden>Share island.html…</button>' +
      '<p class="ix-sub">Bakes the pulled project and every fix into one self-contained <b>island.html</b> that runs from a file or any viewer.</p>' +
      '<div class="ix-h">Frame pacing</div>' +
      '<div class="ix-seg" role="group" aria-label="Frame pacing">' +
      '<button type="button" data-v="auto">Auto</button><button type="button" data-v="60">Smooth 60</button><button type="button" data-v="30">Crisp 30</button></div>' +
      '<div class="ix-stat">Starting…</div>' +
      '<details class="ix-fixes" hidden><summary></summary><ul></ul></details>' +
      '<div class="ix-note" aria-live="polite"></div>';
    document.body.append(fab, panel);

    const note = panel.querySelector(".ix-note");
    const stat = panel.querySelector(".ix-stat");
    const seg = panel.querySelectorAll(".ix-seg button");
    const shareBtn = panel.querySelector(".ix-share");
    let noteT = 0;
    const say = (t) => { note.textContent = t; clearTimeout(noteT); noteT = setTimeout(() => (note.textContent = ""), 6000); };

    const render = () => {
      seg.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.v === S.pref)));
      const r = S.renderer;
      const pr = r ? r.getPixelRatio() : 0;
      const fps = S.avg ? Math.round(1000 / S.avg) : 0;
      stat.textContent = (pr ? "render " + pr.toFixed(2) + "x" : "starting") + " · " + (S.lock30 ? "30 lock" : "60 target") + (fps ? " · " + fps + " fps" : "");
      const rep = window.__ISLAND_SRC && window.__ISLAND_SRC.report;
      const det = panel.querySelector(".ix-fixes");
      if (rep && det.hidden) {
        det.hidden = false;
        const okN = rep.filter((x) => x[0] === "✓").length;
        det.querySelector("summary").textContent = "Fixes applied " + okN + "/" + rep.length + " ▾";
        det.querySelector("ul").innerHTML = rep.map((x) => "<li>" + x.replace(/</g, "&lt;") + "</li>").join("");
      }
    };
    S.on(() => { if (!panel.hidden) render(); });

    try {
      if (navigator.canShare && navigator.canShare({ files: [new File(["x"], "island.html", { type: "text/html" })] })) shareBtn.hidden = false;
    } catch (e) {}

    const toggle = (open) => {
      panel.hidden = !open;
      fab.setAttribute("aria-expanded", String(open));
      if (open) render();
    };
    fab.addEventListener("click", () => toggle(panel.hidden));
    document.addEventListener("pointerdown", (e) => {
      if (!panel.hidden && !panel.contains(e.target) && !fab.contains(e.target)) toggle(false);
    }, true);
    addEventListener("keydown", (e) => { if (e.key === "Escape" && !panel.hidden) toggle(false); });

    seg.forEach((b) => b.addEventListener("click", () => { S.setPref(b.dataset.v); render(); }));

    panel.querySelector(".ix-save").addEventListener("click", () => {
      const blob = S.buildSingle();
      if (!blob) return say("Still pulling the island. Try again in a moment.");
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "island.html";
      document.body.appendChild(a);
      a.click();
      setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 8000);
      say("island.html saved (" + Math.round(blob.size / 1024) + " KB). If your browser blocked it, use Share.");
    });
    shareBtn.addEventListener("click", async () => {
      const blob = S.buildSingle();
      if (!blob) return say("Still pulling the island. Try again in a moment.");
      try {
        await navigator.share({ files: [new File([blob], "island.html", { type: "text/html" })], title: "Island 09 · Living Shoreline" });
      } catch (e) {
        if (e && e.name !== "AbortError") say("Sharing failed: " + (e.message || e));
      }
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", buildUI);
  else buildUI();
})();
