// island.js - part 1/21 (statements 3-30 of the original module).

globalThis.__WORKER_URL__ = 'bundled';
function Ie(o) {
  let e = o >>> 0;
  return function () {
    e = (e + 1831565813) >>> 0;
    let t = e;
    return (
      (t = Math.imul(t ^ (t >>> 15), t | 1)),
      (t ^= t + Math.imul(t ^ (t >>> 7), t | 61)),
      ((t ^ (t >>> 14)) >>> 0) / 4294967296
    );
  };
}
var lo = [
    1, -1, 1, -1, 1, -1, 0, 0, 0.7071, -0.7071, 0.7071, -0.7071, 0.3827,
    -0.3827, 0.9239, -0.9239,
  ],
  co = [
    0, 0, 0, 0, 1, 1, 1, -1, 0.7071, 0.7071, -0.7071, -0.7071, 0.9239, 0.9239,
    0.3827, -0.3827,
  ],
  Ht = class {
    p;
    constructor(e) {
      let t = Ie(e),
        r = new Uint8Array(256);
      for (let s = 0; s < 256; s++) r[s] = s;
      for (let s = 255; s > 0; s--) {
        let c = (t() * (s + 1)) | 0,
          a = r[s];
        ((r[s] = r[c]), (r[c] = a));
      }
      this.p = new Uint8Array(512);
      for (let s = 0; s < 512; s++) this.p[s] = r[s & 255];
    }
    n2(e, t) {
      let r = this.p,
        s = Math.floor(e),
        c = Math.floor(t),
        a = e - s,
        n = t - c,
        i = a * a * a * (a * (a * 6 - 15) + 10),
        m = n * n * n * (n * (n * 6 - 15) + 10),
        h = s & 255,
        l = c & 255,
        u = r[h] + l,
        d = r[h + 1] + l,
        p = r[u] & 15,
        x = r[d] & 15,
        f = r[u + 1] & 15,
        v = r[d + 1] & 15,
        b = lo[p] * a + co[p] * n,
        g = lo[x] * (a - 1) + co[x] * n,
        M = lo[f] * a + co[f] * (n - 1),
        w = lo[v] * (a - 1) + co[v] * (n - 1),
        E = b + (g - b) * i,
        k = M + (w - M) * i;
      return (E + (k - E) * m) * 1.4;
    }
    d = new Float64Array(3);
    nd(e, t) {
      let r = this.p,
        s = Math.floor(e),
        c = Math.floor(t),
        a = e - s,
        n = t - c,
        i = a * a * a * (a * (a * 6 - 15) + 10),
        m = n * n * n * (n * (n * 6 - 15) + 10),
        h = 30 * a * a * (a * (a - 2) + 1),
        l = 30 * n * n * (n * (n - 2) + 1),
        u = s & 255,
        d = c & 255,
        p = r[u] + d,
        x = r[u + 1] + d,
        f = r[p] & 15,
        v = r[x] & 15,
        b = r[p + 1] & 15,
        g = r[x + 1] & 15,
        M = lo[f],
        w = co[f],
        E = lo[v],
        k = co[v],
        R = lo[b],
        H = co[b],
        C = lo[g],
        W = co[g],
        T = M * a + w * n,
        P = E * (a - 1) + k * n,
        L = R * a + H * (n - 1),
        z = C * (a - 1) + W * (n - 1),
        D = T - P - L + z,
        q = this.d;
      return (
        (q[0] = (T + i * (P - T) + m * (L - T) + i * m * D) * 1.4),
        (q[1] =
          (M +
            i * (E - M) +
            m * (R - M) +
            i * m * (M - E - R + C) +
            h * (P - T + m * D)) *
          1.4),
        (q[2] =
          (w +
            i * (k - w) +
            m * (H - w) +
            i * m * (w - k - H + W) +
            l * (L - T + i * D)) *
          1.4),
        q
      );
    }
    eroded(e, t, r = 7, s = 1.6, c = 0.5) {
      let a = 1,
        n = 0,
        i = 0,
        m = 0,
        h = 0;
      for (let l = 0; l < r; l++) {
        let u = this.nd(e, t);
        ((m += u[1] * a),
          (h += u[2] * a),
          (n += (a * u[0]) / (1 + s * (m * m + h * h))),
          (i += a),
          (a *= c));
        let d = 1.6 * e - 1.2 * t + 13.7,
          p = 1.2 * e + 1.6 * t + 5.3;
        ((e = d), (t = p));
      }
      return (n / i) * 1.6;
    }
    fbm(e, t, r = 5, s = 2.03, c = 0.5) {
      let a = 1,
        n = 0,
        i = 0;
      for (let m = 0; m < r; m++)
        ((n += a * this.n2(e, t)),
          (i += a),
          (a *= c),
          (e = e * s + 31.73),
          (t = t * s + 17.19));
      return n / i;
    }
    ridged(e, t, r = 6, s = 2.07, c = 0.5) {
      let a = 1,
        n = 0,
        i = 0,
        m = 1;
      for (let h = 0; h < r; h++) {
        let l = 1 - Math.abs(this.n2(e, t));
        ((l *= l),
          (l *= m),
          (m = Math.min(1, Math.max(0, l * 1.8))),
          (n += a * l),
          (i += a),
          (a *= c),
          (e = e * s + 11.31),
          (t = t * s + 7.97));
      }
      return n / i;
    }
    ridgedSoft(e, t, r = 6, s = 0.03, c = 2.07, a = 0.5) {
      let n = 1,
        i = 0,
        m = 0,
        h = 1,
        l = Math.sqrt(s);
      for (let u = 0; u < r; u++) {
        let d = this.n2(e, t),
          p = 1 - (Math.sqrt(d * d + s) - l);
        ((p = Math.max(p, 0)),
          (p *= p),
          (p *= h),
          (h = Math.min(1, Math.max(0, p * 1.8))),
          (i += n * p),
          (m += n),
          (n *= a),
          (e = e * c + 11.31),
          (t = t * c + 7.97));
      }
      return i / m;
    }
    billow(e, t, r = 4) {
      let s = 1,
        c = 0,
        a = 0;
      for (let n = 0; n < r; n++)
        ((c += s * Math.abs(this.n2(e, t))),
          (a += s),
          (s *= 0.5),
          (e = e * 2.11 + 5.3),
          (t = t * 2.11 + 9.1));
      return c / a;
    }
  },
  re = (o, e, t) => (o < e ? e : o > t ? t : o),
  ve = (o, e, t) => o + (e - o) * t,
  ko = (o, e, t) => {
    let r = Math.max(t - Math.abs(o - e), 0) / t;
    return Math.min(o, e) - r * r * t * 0.25;
  },
  ne = (o, e, t) => {
    let r = re((t - o) / (e - o || 1e-6), 0, 1);
    return r * r * (3 - 2 * r);
  };
var eo = [1, 1, 0, -1, -1, -1, 0, 1],
  to = [0, 1, 1, 1, 0, -1, -1, -1];
function* On(o, e, t, r) {
  let s = e * e,
    c = 3,
    a = [],
    n = [],
    i = 0;
  for (let k = -c; k <= c; k++)
    for (let R = -c; R <= c; R++) {
      let H = Math.hypot(R, k);
      if (H > c) continue;
      let C = 1 - H / c;
      (a.push(k * e + R), n.push(C), (i += C));
    }
  for (let k = 0; k < n.length; k++) n[k] /= i;
  let m = Int32Array.from(a),
    h = Float32Array.from(n),
    l = r ?? Math.round(s * 0.26),
    u = 56,
    d = 0.065,
    p = 1.55,
    x = 0.022,
    f = 0.28,
    v = 0.38,
    b = 0.017,
    g = 10.5,
    M = new Float32Array(s);
  for (let k = 0; k < l; k++) {
    let R = 2 + t() * (e - 5),
      H = 2 + t() * (e - 5),
      C = 0,
      W = 0,
      T = 1,
      P = 1,
      L = 0;
    for (let z = 0; z < u; z++) {
      let D = R | 0,
        q = H | 0,
        N = R - D,
        V = H - q,
        G = q * e + D,
        U = G + 1,
        K = G + e,
        X = K + 1,
        J = o[G],
        se = o[U],
        te = o[K],
        me = o[X],
        $ = (se - J) * (1 - V) + (me - te) * V,
        Z = (te - J) * (1 - N) + (me - se) * N,
        j =
          J * (1 - N) * (1 - V) +
          se * N * (1 - V) +
          te * (1 - N) * V +
          me * N * V;
      if (j < 1.6) break;
      ((M[G] += P), (C = C * d - $ * (1 - d)), (W = W * d - Z * (1 - d)));
      let S = Math.hypot(C, W);
      if (
        S < 1e-5 ||
        ((C /= S),
        (W /= S),
        (R += C),
        (H += W),
        R < 2 || R >= e - 3 || H < 2 || H >= e - 3)
      )
        break;
      let F = R | 0,
        y = H | 0,
        A = R - F,
        B = H - y,
        I = y * e + F,
        O = I + 1,
        _ = I + e,
        ae = _ + 1,
        Y =
          o[I] * (1 - A) * (1 - B) +
          o[O] * A * (1 - B) +
          o[_] * (1 - A) * B +
          o[ae] * A * B -
          j,
        ee = Math.max(-Y, x) * T * P * p;
      if (Y > 0 || L > ee) {
        let ie = Y > 0 ? Math.min(L, Y) : (L - ee) * v;
        ((L -= ie),
          (o[G] += ie * (1 - N) * (1 - V)),
          (o[U] += ie * N * (1 - V)),
          (o[K] += ie * (1 - N) * V),
          (o[X] += ie * N * V));
      } else {
        let ie = Math.min((ee - L) * f, -Y * 0.88);
        if (ie > 0) {
          for (let he = 0; he < m.length; he++) {
            let Me = G + m[he];
            if (Me < 0 || Me >= s) continue;
            let xe = ie * h[he],
              He = o[Me];
            He > 1.5 && (o[Me] = He - Math.min(xe, (He - 1.3) * 0.28));
          }
          L += ie;
        }
      }
      ((T = Math.sqrt(Math.max(0, T * T - Y * g))), (P *= 1 - b));
    }
    (k & 4095) === 0 &&
      (yield { label: "Sculpting valleys and meadows", p: k / l });
  }
  for (let k = 2; k < e - 2; k++)
    for (let R = 2; R < e - 2; R++) {
      let H = k * e + R,
        C = o[H];
      if (C <= 1.4 || C > 175) continue;
      let W = (M[H] * 2 + M[H - 1] + M[H + 1] + M[H - e] + M[H + e]) / 6;
      if (W > 1.8) {
        let T = Math.min(0.46, Math.log1p(W - 1.5) * 0.11),
          P = 1.2 + Math.min(18, C * 0.18);
        o[H] = C - (C - P) * T;
      }
    }
  let w = new Float32Array(s),
    E = [-1, 1, -e, e];
  for (let k = 0; k < 4; k++) {
    w.fill(0);
    for (let R = 2; R < e - 2; R++)
      for (let H = 2; H < e - 2; H++) {
        let C = R * e + H,
          W = o[C];
        if (W < 12) continue;
        let T = W > 150 ? 6.2 : 4.3;
        for (let P of E) {
          let L = C + P,
            z = W - o[L] - T;
          if (o[L] > 2 && z > 0) {
            let D = Math.min(z * 0.028, 0.32);
            ((w[C] -= D), (w[L] += D));
          }
        }
      }
    for (let R = 0; R < s; R++) o[R] += w[R];
    yield { label: "Weathering cliffs and talus", p: (k + 1) / 4 };
  }
}
var $o = [
    "Ama",
    "Velo",
    "Siri",
    "Tahu",
    "Mere",
    "Oru",
    "Kali",
    "Nava",
    "Rua",
    "Esu",
    "Lio",
    "Pana",
    "Wai",
    "Tiri",
  ],
  jo = ["ri", "nu", "va", "lo", "ka", "mai", "ora", "tea", "wen", "sa"],
  pa = class {
    idx;
    key;
    n = 0;
    constructor(e) {
      ((this.idx = new Int32Array(e)), (this.key = new Float32Array(e)));
    }
    clear() {
      this.n = 0;
    }
    push(e, t) {
      if (this.n >= this.idx.length) {
        let a = new Int32Array(this.idx.length * 2),
          n = new Float32Array(this.key.length * 2);
        (a.set(this.idx), n.set(this.key), (this.idx = a), (this.key = n));
      }
      let r = this.n++,
        s = this.idx,
        c = this.key;
      for (; r > 0;) {
        let a = (r - 1) >> 1;
        if (c[a] <= t) break;
        ((s[r] = s[a]), (c[r] = c[a]), (r = a));
      }
      ((s[r] = e), (c[r] = t));
    }
    pop() {
      let e = this.idx,
        t = this.key,
        r = e[0],
        s = e[--this.n],
        c = t[this.n],
        a = 0;
      for (;;) {
        let n = a * 2 + 1;
        if (
          n >= this.n ||
          (n + 1 < this.n && t[n + 1] < t[n] && n++, t[n] >= c)
        )
          break;
        ((e[a] = e[n]), (t[a] = t[n]), (a = n));
      }
      return ((e[a] = s), (t[a] = c), r);
    }
  };
function To(o, e) {
  for (let t = 0; t < e; t++) {
    let r = [o[0], o[1]];
    for (let s = 0; s + 3 < o.length; s += 2) {
      let c = o[s],
        a = o[s + 1],
        n = o[s + 2],
        i = o[s + 3];
      r.push(
        c * 0.75 + n * 0.25,
        a * 0.75 + i * 0.25,
        c * 0.25 + n * 0.75,
        a * 0.25 + i * 0.75,
      );
    }
    (r.push(o[o.length - 2], o[o.length - 1]), (o = r));
  }
  return o;
}
function Ya(o, e, t = 1, r = 1) {
  let s = o.length / 2;
  if (s < 3 || e < 1) return o.slice();
  let c = [],
    a = 0;
  for (let i = -e; i <= e; i++) {
    let m = Math.exp(-(i * i) / (e * e * 0.5));
    (c.push(m), (a += m));
  }
  for (let i = 0; i < c.length; i++) c[i] /= a;
  let n = o.slice();
  for (let i = 0; i < t; i++) {
    let m = n.slice();
    for (let h = r; h < s - r; h++) {
      let l = 0,
        u = 0;
      for (let x = -e; x <= e; x++) {
        let f = h + x;
        (f < 0 && (f = -f),
          f > s - 1 && (f = 2 * (s - 1) - f),
          (f = Math.max(0, Math.min(s - 1, f))),
          (l += n[f * 2] * c[x + e]),
          (u += n[f * 2 + 1] * c[x + e]));
      }
      let d = Math.min(h - r + 1, s - r - h) / Math.max(1, e),
        p = Math.min(1, d);
      ((m[h * 2] = n[h * 2] + (l - n[h * 2]) * p),
        (m[h * 2 + 1] = n[h * 2 + 1] + (u - n[h * 2 + 1]) * p));
    }
    n = m;
  }
  return n;
}
function Ko(o, e, t = 1, r = 1, s = 80) {
  let c = o.length / 2;
  if (c < 4) return o;
  let a = new Float32Array(c);
  for (let n = 0; n < s; n++) {
    for (let h = 1; h < c - 1; h++) {
      let l = o[(h - 1) * 2],
        u = o[(h - 1) * 2 + 1],
        d = o[h * 2],
        p = o[h * 2 + 1],
        x = o[(h + 1) * 2],
        f = o[(h + 1) * 2 + 1],
        v = (d - l) * (f - u) - (p - u) * (x - l),
        b =
          Math.hypot(d - l, p - u) *
          Math.hypot(x - d, f - p) *
          Math.hypot(x - l, f - u);
      a[h] = b < 1e-6 ? 0 : Math.abs((2 * v) / b);
    }
    let i = 0,
      m = o.slice();
    for (let h = Math.max(1, t); h < c - Math.max(1, r); h++) {
      let u = Math.max(a[h], a[h - 1] * 0.85, a[h + 1] * 0.85) * e(h);
      if (u <= 1) continue;
      i++;
      let d = Math.min(0.5, 0.18 + (u - 1) * 0.25),
        p = (o[(h - 1) * 2] + o[(h + 1) * 2]) * 0.5,
        x = (o[(h - 1) * 2 + 1] + o[(h + 1) * 2 + 1]) * 0.5;
      ((m[h * 2] = o[h * 2] + (p - o[h * 2]) * d),
        (m[h * 2 + 1] = o[h * 2 + 1] + (x - o[h * 2 + 1]) * d));
    }
    if (((o = m), !i)) break;
  }
  return o;
}
function Yo(o, e) {
  let t = [o[0], o[1]],
    r = 0;
  for (let a = 0; a + 3 < o.length; a += 2) {
    let n = o[a],
      i = o[a + 1],
      m = o[a + 2] - n,
      h = o[a + 3] - i,
      l = Math.hypot(m, h);
    if (l < 1e-5) continue;
    let u = e - r;
    for (; u <= l;) (t.push(n + (m * u) / l, i + (h * u) / l), (u += e));
    r = l - (u - e);
  }
  let s = o[o.length - 2],
    c = o[o.length - 1];
  return (
    Math.hypot(s - t[t.length - 2], c - t[t.length - 1]) > 0.01 && t.push(s, c),
    t
  );
}
function va(o, e) {
  let t = e * e,
    r = new Float32Array(t),
    s = new Int32Array(t).fill(-1),
    c = new Float32Array(t),
    a = new Uint8Array(t),
    n = new Int32Array(t),
    i = new pa(t),
    m = 0.018;
  for (let l = 0; l < t; l++) {
    let u = l % e,
      d = (l / e) | 0;
    (o[l] <= 0 || u === 0 || d === 0 || u === e - 1 || d === e - 1) &&
      ((a[l] = 1), (r[l] = o[l] <= 0 ? 0 : o[l]), i.push(l, r[l]));
  }
  let h = 0;
  for (; i.n;) {
    let l = i.pop();
    n[h++] = l;
    let u = l % e,
      d = (l / e) | 0;
    for (let p = 0; p < 8; p++) {
      let x = u + eo[p],
        f = d + to[p];
      if (x < 0 || f < 0 || x >= e || f >= e) continue;
      let v = f * e + x;
      a[v] ||
        ((a[v] = 1),
        (r[v] = o[v] <= 0 ? 0 : Math.max(o[v], r[l] + m)),
        (s[v] = l),
        i.push(v, r[v]));
    }
  }
  for (let l = 0; l < t; l++) {
    if (o[l] <= 0) continue;
    let u = l % e,
      d = (l / e) | 0,
      p = -1,
      x = 0;
    for (let f = 0; f < 8; f++) {
      let v = u + eo[f],
        b = d + to[f];
      if (v < 0 || b < 0 || v >= e || b >= e) continue;
      let g = b * e + v,
        M = (r[l] - r[g]) * (f & 1 ? Math.SQRT1_2 : 1);
      M > x + 1e-6 && ((x = M), (p = g));
    }
    (p >= 0 && (s[l] = p), (c[l] = 1 + Math.min(1.2, Math.max(0, o[l]) / 320)));
  }
  for (let l = h - 1; l >= 0; l--) {
    let u = n[l],
      d = s[u];
    d >= 0 && (c[d] += c[u]);
  }
  return { filled: r, downstream: s, accumulation: c, order: n };
}
var xt = {
  iterations: 22,
  kHard: 0.01,
  kSoft: 0.032,
  m: 0.45,
  dHard: 0.035,
  dSoft: 0.17,
  province: 2600,
  strataPeriod: 30,
  strataStrength: 0.32,
  massifRadius: 520,
  massifLift: 0.78,
  hillHeight: 46,
};
function _n(o, e, t = 0.1) {
  if (o <= 0 || o >= e) return o;
  let r = o / e,
    s = -(1 - t),
    c = 2 * (1 - t);
  return e * (s * r * r * r + c * r * r + t * r);
}
function* Un(o, e, t, r, s) {
  let c = Math.max(1, Math.round(20 / r)),
    a = Math.floor(t / c),
    n = r * c,
    i = (t * r) / 2,
    m = a * a,
    h = new Float32Array(m),
    l = new Float32Array(m);
  for (let w = 0; w < a; w++)
    for (let E = 0; E < a; E++) {
      let k = 0,
        R = 0,
        H = 0;
      for (let C = 0; C < c; C++)
        for (let W = 0; W < c; W++) {
          let T = (w * c + C) * t + (E * c + W);
          ((k += o[T]), (R += e[T]), H++);
        }
      ((h[w * a + E] = k / H), (l[w * a + E] = R / H));
    }
  let u = h.slice(),
    d = new Ht(s ^ 625341585);
  for (let w = 0; w < 3; w++) {
    let E = h.slice();
    for (let k = 1; k < a - 1; k++)
      for (let R = 1; R < a - 1; R++) {
        let H = k * a + R;
        if (E[H] <= 2) continue;
        let C =
          (4 * E[H] +
            2 * (E[H - 1] + E[H + 1] + E[H - a] + E[H + a]) +
            E[H - a - 1] +
            E[H - a + 1] +
            E[H + a - 1] +
            E[H + a + 1]) /
          16;
        h[H] = ve(E[H], C, 0.65 * ne(2, 30, E[H]));
      }
  }
  let p = new Float32Array(m),
    x = new Float32Array(m),
    f = new Float32Array(m);
  for (let w = 0; w < a; w++)
    for (let E = 0; E < a; E++) {
      let k = w * a + E,
        R = (E + 0.5) * n - i,
        H = (w + 0.5) * n - i,
        C = d.fbm(R / xt.province, H / xt.province, 3),
        W = re(
          ne(-0.28, 0.32, C) * 0.75 + l[k] * 0.35 - ne(300, 700, h[k]) * 0.3,
          0,
          1,
        );
      ((p[k] = W),
        (x[k] = ve(xt.kHard, xt.kSoft, W)),
        (f[k] = ve(xt.dHard, xt.dSoft, W * W)));
    }
  let v = (w, E) => {
    let k = Math.max(2, Math.round(E / n)),
      R = w.slice(),
      H = new Float32Array(m);
    for (let C = 0; C < 3; C++) {
      for (let W = 0; W < a; W++) {
        let T = 0;
        for (let P = -k; P <= k; P++) T += R[W * a + re(P, 0, a - 1)];
        for (let P = 0; P < a; P++)
          ((H[W * a + P] = T / (2 * k + 1)),
            (T +=
              R[W * a + Math.min(a - 1, P + k + 1)] -
              R[W * a + Math.max(0, P - k)]));
      }
      for (let W = 0; W < a; W++) {
        let T = 0;
        for (let P = -k; P <= k; P++) T += H[re(P, 0, a - 1) * a + W];
        for (let P = 0; P < a; P++)
          ((R[P * a + W] = T / (2 * k + 1)),
            (T +=
              H[Math.min(a - 1, P + k + 1) * a + W] -
              H[Math.max(0, P - k) * a + W]));
      }
    }
    return R;
  };
  {
    let w = new Float32Array(m);
    for (let R = 0; R < m; R++) w[R] = Math.max(0, h[R]);
    let E = v(w, xt.massifRadius),
      k = v(w, xt.massifRadius * 0.45);
    for (let R = 0; R < a; R++)
      for (let H = 0; H < a; H++) {
        let C = R * a + H;
        if (h[C] <= 0.3) continue;
        let W = (H + 0.5) * n - i,
          T = (R + 0.5) * n - i,
          P = ne(0.5, 14, h[C]),
          L = (E[C] * xt.massifLift + k[C] * 0.22) * P,
          z =
            p[C] *
            xt.hillHeight *
            P *
            (0.55 + 0.45 * d.eroded(W / 900 + 3.1, T / 900 - 1.7, 5, 1.3)) *
            (1 - ne(150, 420, h[C])),
          D = 22,
          q = L + z,
          N = re(0.5 + (0.5 * (h[C] - q)) / D, 0, 1);
        h[C] = ve(q, h[C], N) + D * N * (1 - N);
      }
  }
  let b = new Float32Array(m);
  for (let w = 0; w < xt.iterations; w++) {
    let E = va(h, a),
      { order: k, downstream: R, accumulation: H } = E;
    for (let C = 0; C < m; C++) {
      let W = k[C],
        T = R[W];
      if (T < 0 || h[W] <= 0 || h[W] <= h[T]) continue;
      let L =
          W % a !== T % a && ((W / a) | 0) !== ((T / a) | 0)
            ? n * Math.SQRT2
            : n,
        z = H[W] * n * n,
        D = (x[W] * Math.pow(z, xt.m)) / L,
        q = (h[W] + D * h[T]) / (1 + D);
      h[W] = Math.max(q, 0.3);
    }
    for (let C = 1; C < a - 1; C++)
      for (let W = 1; W < a - 1; W++) {
        let T = C * a + W,
          P = h[T];
        if (P <= 0) {
          b[T] = P;
          continue;
        }
        let L = h[T - 1] + h[T + 1] + h[T - a] + h[T + a] - 4 * P;
        b[T] = Math.max(0.3, P + f[T] * L);
      }
    for (let C = 1; C < a - 1; C++)
      for (let W = 1; W < a - 1; W++) {
        let T = C * a + W;
        h[T] > 0 && (h[T] = b[T]);
      }
    (w & 3) === 0 &&
      (yield { label: "Rivers incising the ranges", p: w / xt.iterations });
  }
  let g = (w, E, k) => {
    ((E = re(E, 0, a - 1.001)), (k = re(k, 0, a - 1.001)));
    let R = E | 0,
      H = k | 0,
      C = E - R,
      W = k - H,
      T = H * a + R,
      P = Math.min(a - 1, R + 1) - R,
      L = (Math.min(a - 1, H + 1) - H) * a;
    return (
      w[T] * (1 - C) * (1 - W) +
      w[T + P] * C * (1 - W) +
      w[T + L] * (1 - C) * W +
      w[T + L + P] * C * W
    );
  };
  for (let w = 0; w < t; w++) {
    let E = (w + 0.5) / c - 0.5;
    for (let k = 0; k < t; k++) {
      let R = w * t + k;
      if (o[R] <= 0) continue;
      let H = (k + 0.5) / c - 0.5,
        C = g(u, H, E),
        W = g(h, H, E),
        T = Math.max(0, C - W),
        P = 0.16 * (1 - 0.8 * ne(3, 42, T)),
        L = W + (o[R] - C) * P,
        D = (1 - g(p, H, E)) * ne(110, 240, L);
      if (D > 0.01) {
        let q = (k + 0.5) * r - i,
          N = (w + 0.5) * r - i,
          V =
            xt.strataPeriod *
            (0.8 + 0.4 * (0.5 + 0.5 * d.fbm(q / 1400, N / 1400, 2))),
          G = d.fbm(q / 3e3 + 9, N / 3e3, 2) * 40,
          U = (L + G) / V,
          K = U - Math.floor(U),
          X = (Math.floor(U) + ne(0.28, 0.72, K)) * V - G;
        L = ve(L, X, xt.strataStrength * D);
      }
      o[R] = Math.max(L, 0.25);
    }
  }
  let M = new Float32Array(t * t);
  for (let w = 0; w < t; w++)
    for (let E = 0; E < t; E++)
      M[w * t + E] = 1 - g(p, (E + 0.5) / c - 0.5, (w + 0.5) / c - 0.5);
  return (
    ba(o, t, r, M, { passes: 14, conserve: !0 }),
    yield { label: "Rivers incising the ranges", p: 1 },
    M
  );
}
function ba(o, e, t, r, s) {
  let c = [1, -1, e, -e, e + 1, e - 1, -e + 1, -e - 1],
    a = [1, 1, 1, 1, Math.SQRT2, Math.SQRT2, Math.SQRT2, Math.SQRT2];
  for (let n = 0; n < s.passes; n++) {
    let i = (n & 1) === 1;
    for (let m = 1; m < e - 1; m++) {
      let h = i ? e - 1 - m : m;
      for (let l = 1; l < e - 1; l++) {
        let u = i ? e - 1 - l : l,
          d = h * e + u;
        if (o[d] <= 1 || (s.protect && s.protect[d])) continue;
        let p = ve(0.5, 0.62, ne(40, 170, o[d])),
          x = ve(p, 1.15, r[d] * ne(150, 320, o[d])),
          f = -1,
          v = 0;
        for (let g = 0; g < 8; g++) {
          let M = d + c[g],
            w = o[d] - o[M] - x * t * a[g];
          w > v && ((v = w), (f = M));
        }
        if (f < 0) continue;
        let b = v * 0.45;
        if (s.conserve) {
          if (o[f] <= 0 || (s.protect && s.protect[f])) continue;
          ((o[d] -= b), (o[f] += b));
        } else o[d] = Math.max(0.3, o[d] - b);
      }
    }
  }
}
function qn(o, e, t, r, s, c, a) {
  let n = r * r;
  {
    let m = (l) => ((l % r) + 0.5) * s - c,
      h = (l) => (((l / r) | 0) + 0.5) * s - c;
    for (let l = 0; l < n; l++) {
      if (e[l] !== 0) continue;
      let u = o[l],
        d = 1 - ne(24, 46, u);
      if (d < 0.02) continue;
      let p = t[l];
      if (p >= 500) continue;
      let x = p / 500,
        f = (1 - ne(0.06, 1, x)) * d;
      if (f < 0.02) continue;
      let v = 0.78 + 0.44 * a.n2(m(l) / 240, h(l) / 240),
        b = (14 * Math.pow(x, 1.35) + 1.2) * v,
        g = Math.max(Math.min(u, b), u - 15);
      o[l] = ve(u, g, f);
    }
  }
  for (let i = 0; i < 3; i++) {
    let m = (i & 1) !== 0,
      h = m ? r - 2 : 1,
      l = m ? 0 : r - 1,
      u = m ? -1 : 1,
      d = m ? r - 2 : 1,
      p = m ? 0 : r - 1,
      x = m ? -1 : 1;
    for (let f = h; f !== l; f += u)
      for (let v = d; v !== p; v += x) {
        let b = f * r + v;
        if (e[b] !== 1) continue;
        let g = o[b];
        for (let M = 0; M < 8; M++) {
          let w = (f + to[M]) * r + v + eo[M],
            E = M & 1 ? 36 : 26;
          g = Math.max(g, o[w] - E);
        }
        g > o[b] && (o[b] = Math.min(g, -0.05));
      }
  }
  for (let i = 0; i < 10; i++) {
    let m = (i & 1) !== 0,
      h = m ? r - 2 : 1,
      l = m ? 0 : r - 1,
      u = m ? -1 : 1,
      d = m ? r - 2 : 1,
      p = m ? 0 : r - 1,
      x = m ? -1 : 1;
    for (let f = h; f !== l; f += u)
      for (let v = d; v !== p; v += x) {
        let b = f * r + v;
        if (e[b] !== 0) continue;
        let g = o[b];
        for (let M = 0; M < 8; M++) {
          let w = (f + to[M]) * r + v + eo[M],
            E = M & 1 ? s * Math.SQRT2 : s;
          g = Math.min(g, o[w] + E * 1.75);
        }
        g < o[b] && (o[b] = Math.max(0.35, g));
      }
  }
}
function* $n(o, e, t) {
  let r = e * e,
    s = new Float32Array(r),
    c = 1e6;
  for (let h = 0; h < r; h++) s[h] = o[h] >= 0 ? 0 : c;
  let a = t,
    n = t * Math.SQRT2;
  for (let h = 0; h < e; h++) {
    for (let l = 0; l < e; l++) {
      let u = h * e + l;
      if (s[u] === 0) continue;
      let d = s[u];
      (l > 0 && (d = Math.min(d, s[u - 1] + a)),
        h > 0 &&
          ((d = Math.min(d, s[u - e] + a)),
          l > 0 && (d = Math.min(d, s[u - e - 1] + n)),
          l < e - 1 && (d = Math.min(d, s[u - e + 1] + n))),
        (s[u] = d));
    }
    (h & 127) === 0 &&
      (yield { label: "Measuring the coastline", p: (0.5 * h) / e });
  }
  for (let h = e - 1; h >= 0; h--) {
    for (let l = e - 1; l >= 0; l--) {
      let u = h * e + l;
      if (s[u] === 0) continue;
      let d = s[u];
      (l < e - 1 && (d = Math.min(d, s[u + 1] + a)),
        h < e - 1 &&
          ((d = Math.min(d, s[u + e] + a)),
          l < e - 1 && (d = Math.min(d, s[u + e + 1] + n)),
          l > 0 && (d = Math.min(d, s[u + e - 1] + n))),
        (s[u] = d));
    }
    (h & 127) === 0 &&
      (yield { label: "Measuring the coastline", p: 0.5 + 0.4 * (1 - h / e) });
  }
  for (let h = 0; h < r; h++) s[h] > 3e3 && (s[h] = 3e3);
  let i = new Float32Array(r),
    m = new Float32Array(r);
  for (let h = 0; h < e; h++)
    for (let l = 0; l < e; l++) {
      let u = h * e + l,
        d = Math.max(l - 1, 0),
        p = Math.min(l + 1, e - 1),
        x = Math.max(h - 1, 0),
        f = Math.min(h + 1, e - 1),
        v,
        b;
      o[u] < 0
        ? ((v = -(s[h * e + p] - s[h * e + d])),
          (b = -(s[f * e + l] - s[x * e + l])))
        : ((v = o[h * e + p] - o[h * e + d]),
          (b = o[f * e + l] - o[x * e + l]));
      let g = Math.hypot(v, b);
      g > 1e-6 && ((i[u] = v / g), (m[u] = b / g));
    }
  for (let h = 0; h < 3; h++) {
    let l = new Float32Array(r),
      u = new Float32Array(r);
    for (let d = 0; d < e; d++)
      for (let p = 0; p < e; p++) {
        let x = 0,
          f = 0;
        for (let g = -1; g <= 1; g++)
          for (let M = -1; M <= 1; M++) {
            let w = re(p + M, 0, e - 1),
              E = re(d + g, 0, e - 1),
              k = M === 0 && g === 0 ? 2 : 1;
            ((x += i[E * e + w] * k), (f += m[E * e + w] * k));
          }
        let v = Math.hypot(x, f),
          b = d * e + p;
        v > 1e-6 && ((l[b] = x / v), (u[b] = f / v));
      }
    (i.set(l), m.set(u));
  }
  return (
    yield { label: "Measuring the coastline", p: 1 },
    { tau: s, dirX: i, dirZ: m }
  );
}
var xa = { beam: 2.3, length: 5.4, draft: 0.55 },
  nt = { halfWidth: xa.beam * 0.5 + 2.2, depth: xa.draft + 0.85 },
  we = {
    datum: 0,
    lakeRadius: 205,
    lakeDepth: 18,
    ridgeHeight: 128,
    shelfWidth: 26,
    widthK: 0.165,
    depthK: 0.205,
    minHalfWidth: 5.4,
    maxHalfWidth: 46,
    minBedDepth: 0.95,
    maxBedDepth: 9.5,
    widthNoise: 0.12,
    bankWidth: 16,
    accMountain: 62,
    accLowland: 24,
    creekDensity: 1,
    creekRecursion: 2,
    braidChance: 0.3,
    migrateSteps: 32,
    migrateRate: 0.22,
    lagWidths: 4,
    sinuosityMain: 1.6,
    sinuosityCreek: 1.65,
    minRadiusWidths: 2,
    maxStraightWidths: 8,
    minSeparationWidths: 3,
    estuaryLb: 240,
    estuaryReach: 3,
    valleyFloor: 3,
    maxChannelH: 100,
  };
var yo = Math.PI * 2;
function oo(o) {
  let e = 0;
  for (let t = 2; t < o.length; t += 2)
    e += Math.hypot(o[t] - o[t - 2], o[t + 1] - o[t - 1]);
  return e;
}
export { $n, $o, Ht, Ie, Ko, On, To, Un, Ya, Yo, _n, ba, eo, jo, ko, ne, nt, oo, qn, re, to, va, ve, we, yo };
