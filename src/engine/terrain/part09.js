// terrain.worker.js - part 9/9 (statements 84-84 of the original module).
import { kn } from "./part05.js";
import { Se } from "./part07.js";
import { Bn } from "./part08.js";

self.onmessage = (o) => {
  try {
    let n = kn(o.data),
      e = n.next();
    for (; !e.done;)
      ((e.value.p >= 0.99 || e.value.p < 0.03) &&
        self.postMessage({
          kind: "progress",
          label: e.value.label,
          p: e.value.p * 0.68,
        }),
        (e = n.next()));
    let r = e.value,
      a = Se(),
      f = Bn(r, 1, a),
      t = f.next();
    for (; !t.done;)
      ((t.value.p >= 0.99 || t.value.p < 0.03) &&
        self.postMessage({
          kind: "progress",
          label: t.value.label,
          p: 0.74 + t.value.p * 0.22,
        }),
        (t = f.next()));
    let l = {},
      c = [];
    for (let [p, h] of Object.entries(t.value.out))
      l[p] = h.map((i) => {
        let x = Float32Array.from(i.matrices),
          M = Float32Array.from(i.colors);
        return (c.push(x.buffer, M.buffer), { matrices: x, colors: M });
      });
    for (let p of Object.values(r)) ArrayBuffer.isView(p) && c.push(p.buffer);
    for (let p of Object.values(a))
      for (let h of p) (h.geo.dispose(), h.lod?.dispose());
    self.postMessage({ kind: "done", world: r, out: l }, c);
  } catch (n) {
    self.postMessage({
      kind: "error",
      message: n instanceof Error ? n.message : String(n),
    });
  }
};
