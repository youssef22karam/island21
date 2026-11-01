// island.js - part 21/21 (statements 212-212 of the original module).

var Ga = class {
  ctx = null;
  master = null;
  sea = null;
  wash = null;
  stream = null;
  wind = null;
  pulse = null;
  lfo = null;
  lowpass = null;
  sources = [];
  latest = {
    storm: 0,
    waveHeight: 1,
    hs: 0,
    mode: "survey",
    water: "sea",
    place: "",
  };
  noiseBuffer(e, t) {
    let r = e.sampleRate * 5,
      s = e.createBuffer(1, r, e.sampleRate),
      c = s.getChannelData(0),
      a = 0;
    for (let n = 0; n < r; n++) {
      let i = Math.random() * 2 - 1;
      t ? ((a = (a + i * 0.022) / 1.022), (c[n] = a * 3.2)) : (c[n] = i);
    }
    return s;
  }
  ensure() {
    if (this.ctx) return this.ctx;
    let e = new AudioContext();
    ((this.ctx = e),
      (this.master = e.createGain()),
      (this.master.gain.value = 0),
      this.master.connect(e.destination));
    let t = this.noiseBuffer(e, !0),
      r = this.noiseBuffer(e, !1),
      s = (i) => {
        let m = e.createBufferSource();
        return (
          (m.buffer = i),
          (m.loop = !0),
          m.start(),
          this.sources.push(m),
          m
        );
      };
    ((this.lowpass = e.createBiquadFilter()),
      (this.lowpass.type = "lowpass"),
      (this.lowpass.frequency.value = 720),
      (this.lowpass.Q.value = 0.45),
      (this.sea = e.createGain()),
      (this.sea.gain.value = 0.04),
      s(t).connect(this.lowpass).connect(this.sea).connect(this.master));
    let c = e.createBiquadFilter();
    ((c.type = "bandpass"),
      (c.frequency.value = 1050),
      (c.Q.value = 0.38),
      (this.wash = e.createGain()),
      (this.wash.gain.value = 0.02),
      s(r).connect(c).connect(this.wash).connect(this.master));
    let a = e.createBiquadFilter();
    ((a.type = "bandpass"),
      (a.frequency.value = 510),
      (a.Q.value = 0.65),
      (this.stream = e.createGain()),
      (this.stream.gain.value = 0),
      s(t).connect(a).connect(this.stream).connect(this.master));
    let n = e.createBiquadFilter();
    return (
      (n.type = "highpass"),
      (n.frequency.value = 1250),
      (this.wind = e.createGain()),
      (this.wind.gain.value = 0),
      s(r).connect(n).connect(this.wind).connect(this.master),
      (this.lfo = e.createOscillator()),
      (this.lfo.type = "sine"),
      (this.lfo.frequency.value = 0.13),
      (this.pulse = e.createGain()),
      (this.pulse.gain.value = 0.012),
      this.lfo.connect(this.pulse).connect(this.wash.gain),
      this.lfo.start(),
      this.update(this.latest),
      e
    );
  }
  async setMuted(e) {
    let t = this.ensure();
    (!e && t.state !== "running" && (await t.resume()),
      this.master &&
        this.master.gain.setTargetAtTime(e ? 0 : 0.7, t.currentTime, 0.08));
  }
  update(e) {
    if (
      ((this.latest = e),
      !this.ctx ||
        !this.sea ||
        !this.wash ||
        !this.stream ||
        !this.wind ||
        !this.lowpass ||
        !this.pulse ||
        !this.lfo)
    )
      return;
    let t = this.ctx.currentTime,
      r = Math.min(
        1.6,
        0.12 + e.storm * 0.72 + e.hs * 0.065 + (e.waveHeight - 1) * 0.18,
      ),
      s = e.mode === "walk" ? 1 : e.mode === "boat" ? 0.8 : 0.58,
      c =
        e.water === "fresh" ||
        /River|Creek|Lake|Marsh|Banks of|Shore of/.test(e.place),
      a = /River|Creek|Banks of/.test(e.place);
    (this.sea.gain.setTargetAtTime(
      (0.025 + r * 0.075) * s * (c ? 0.12 : 1),
      t,
      0.6,
    ),
      this.wash.gain.setTargetAtTime(
        (0.014 + r * 0.045) * s * (c ? 0.3 : 1),
        t,
        0.6,
      ),
      this.stream.gain.setTargetAtTime(c ? (a ? 0.052 : 0.022) * s : 0, t, 0.8),
      this.wind.gain.setTargetAtTime(0.003 + e.storm * e.storm * 0.105, t, 0.5),
      this.lowpass.frequency.setTargetAtTime(520 + r * 980, t, 0.4),
      this.pulse.gain.setTargetAtTime(0.007 + r * 0.022, t, 0.3));
    let n = 6.4 + 1.15 * Math.min(Math.max(e.hs, 0), 5);
    this.lfo.frequency.setTargetAtTime(1 / n, t, 0.5);
  }
  dispose() {
    for (let e of this.sources)
      try {
        e.stop();
      } catch {}
    this.sources = [];
    try {
      this.lfo?.stop();
    } catch {}
    (this.ctx?.close(), (this.ctx = null));
  }
};
export { Ga };
