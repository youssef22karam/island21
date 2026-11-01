// terrain.worker.js - part 1/9 (statements 2-20 of the original module).

function At(o) {
  let n = o >>> 0;
  return function () {
    n = (n + 1831565813) >>> 0;
    let e = n;
    return (
      (e = Math.imul(e ^ (e >>> 15), e | 1)),
      (e ^= e + Math.imul(e ^ (e >>> 7), e | 61)),
      ((e ^ (e >>> 14)) >>> 0) / 4294967296
    );
  };
}
var oe = [
    1, -1, 1, -1, 1, -1, 0, 0, 0.7071, -0.7071, 0.7071, -0.7071, 0.3827,
    -0.3827, 0.9239, -0.9239,
  ],
  re = [
    0, 0, 0, 0, 1, 1, 1, -1, 0.7071, 0.7071, -0.7071, -0.7071, 0.9239, 0.9239,
    0.3827, -0.3827,
  ],
  jt = class {
    p;
    constructor(n) {
      let e = At(n),
        r = new Uint8Array(256);
      for (let a = 0; a < 256; a++) r[a] = a;
      for (let a = 255; a > 0; a--) {
        let f = (e() * (a + 1)) | 0,
          t = r[a];
        ((r[a] = r[f]), (r[f] = t));
      }
      this.p = new Uint8Array(512);
      for (let a = 0; a < 512; a++) this.p[a] = r[a & 255];
    }
    n2(n, e) {
      let r = this.p,
        a = Math.floor(n),
        f = Math.floor(e),
        t = n - a,
        l = e - f,
        c = t * t * t * (t * (t * 6 - 15) + 10),
        p = l * l * l * (l * (l * 6 - 15) + 10),
        h = a & 255,
        i = f & 255,
        x = r[h] + i,
        M = r[h + 1] + i,
        g = r[x] & 15,
        w = r[M] & 15,
        y = r[x + 1] & 15,
        b = r[M + 1] & 15,
        v = oe[g] * t + re[g] * l,
        A = oe[w] * (t - 1) + re[w] * l,
        E = oe[y] * t + re[y] * (l - 1),
        H = oe[b] * (t - 1) + re[b] * (l - 1),
        R = v + (A - v) * c,
        D = E + (H - E) * c;
      return (R + (D - R) * p) * 1.4;
    }
    d = new Float64Array(3);
    nd(n, e) {
      let r = this.p,
        a = Math.floor(n),
        f = Math.floor(e),
        t = n - a,
        l = e - f,
        c = t * t * t * (t * (t * 6 - 15) + 10),
        p = l * l * l * (l * (l * 6 - 15) + 10),
        h = 30 * t * t * (t * (t - 2) + 1),
        i = 30 * l * l * (l * (l - 2) + 1),
        x = a & 255,
        M = f & 255,
        g = r[x] + M,
        w = r[x + 1] + M,
        y = r[g] & 15,
        b = r[w] & 15,
        v = r[g + 1] & 15,
        A = r[w + 1] & 15,
        E = oe[y],
        H = re[y],
        R = oe[b],
        D = re[b],
        z = oe[v],
        T = re[v],
        I = oe[A],
        B = re[A],
        W = E * t + H * l,
        G = R * (t - 1) + D * l,
        O = z * t + T * (l - 1),
        S = I * (t - 1) + B * (l - 1),
        L = W - G - O + S,
        Z = this.d;
      return (
        (Z[0] = (W + c * (G - W) + p * (O - W) + c * p * L) * 1.4),
        (Z[1] =
          (E +
            c * (R - E) +
            p * (z - E) +
            c * p * (E - R - z + I) +
            h * (G - W + p * L)) *
          1.4),
        (Z[2] =
          (H +
            c * (D - H) +
            p * (T - H) +
            c * p * (H - D - T + B) +
            i * (O - W + c * L)) *
          1.4),
        Z
      );
    }
    eroded(n, e, r = 7, a = 1.6, f = 0.5) {
      let t = 1,
        l = 0,
        c = 0,
        p = 0,
        h = 0;
      for (let i = 0; i < r; i++) {
        let x = this.nd(n, e);
        ((p += x[1] * t),
          (h += x[2] * t),
          (l += (t * x[0]) / (1 + a * (p * p + h * h))),
          (c += t),
          (t *= f));
        let M = 1.6 * n - 1.2 * e + 13.7,
          g = 1.2 * n + 1.6 * e + 5.3;
        ((n = M), (e = g));
      }
      return (l / c) * 1.6;
    }
    fbm(n, e, r = 5, a = 2.03, f = 0.5) {
      let t = 1,
        l = 0,
        c = 0;
      for (let p = 0; p < r; p++)
        ((l += t * this.n2(n, e)),
          (c += t),
          (t *= f),
          (n = n * a + 31.73),
          (e = e * a + 17.19));
      return l / c;
    }
    ridged(n, e, r = 6, a = 2.07, f = 0.5) {
      let t = 1,
        l = 0,
        c = 0,
        p = 1;
      for (let h = 0; h < r; h++) {
        let i = 1 - Math.abs(this.n2(n, e));
        ((i *= i),
          (i *= p),
          (p = Math.min(1, Math.max(0, i * 1.8))),
          (l += t * i),
          (c += t),
          (t *= f),
          (n = n * a + 11.31),
          (e = e * a + 7.97));
      }
      return l / c;
    }
    ridgedSoft(n, e, r = 6, a = 0.03, f = 2.07, t = 0.5) {
      let l = 1,
        c = 0,
        p = 0,
        h = 1,
        i = Math.sqrt(a);
      for (let x = 0; x < r; x++) {
        let M = this.n2(n, e),
          g = 1 - (Math.sqrt(M * M + a) - i);
        ((g = Math.max(g, 0)),
          (g *= g),
          (g *= h),
          (h = Math.min(1, Math.max(0, g * 1.8))),
          (c += l * g),
          (p += l),
          (l *= t),
          (n = n * f + 11.31),
          (e = e * f + 7.97));
      }
      return c / p;
    }
    billow(n, e, r = 4) {
      let a = 1,
        f = 0,
        t = 0;
      for (let l = 0; l < r; l++)
        ((f += a * Math.abs(this.n2(n, e))),
          (t += a),
          (a *= 0.5),
          (n = n * 2.11 + 5.3),
          (e = e * 2.11 + 9.1));
      return f / t;
    }
  },
  at = (o, n, e) => (o < n ? n : o > e ? e : o),
  bt = (o, n, e) => o + (n - o) * e,
  me = (o, n, e) => {
    let r = Math.max(e - Math.abs(o - n), 0) / e;
    return Math.min(o, n) - r * r * e * 0.25;
  },
  et = (o, n, e) => {
    let r = at((e - o) / (n - o || 1e-6), 0, 1);
    return r * r * (3 - 2 * r);
  };
var Nt = [1, 1, 0, -1, -1, -1, 0, 1],
  Qt = [0, 1, 1, 1, 0, -1, -1, -1];
function* un(o, n, e, r) {
  let a = n * n,
    f = 3,
    t = [],
    l = [],
    c = 0;
  for (let D = -f; D <= f; D++)
    for (let z = -f; z <= f; z++) {
      let T = Math.hypot(z, D);
      if (T > f) continue;
      let I = 1 - T / f;
      (t.push(D * n + z), l.push(I), (c += I));
    }
  for (let D = 0; D < l.length; D++) l[D] /= c;
  let p = Int32Array.from(t),
    h = Float32Array.from(l),
    i = r ?? Math.round(a * 0.26),
    x = 56,
    M = 0.065,
    g = 1.55,
    w = 0.022,
    y = 0.28,
    b = 0.38,
    v = 0.017,
    A = 10.5,
    E = new Float32Array(a);
  for (let D = 0; D < i; D++) {
    let z = 2 + e() * (n - 5),
      T = 2 + e() * (n - 5),
      I = 0,
      B = 0,
      W = 1,
      G = 1,
      O = 0;
    for (let S = 0; S < x; S++) {
      let L = z | 0,
        Z = T | 0,
        q = z - L,
        K = T - Z,
        V = Z * n + L,
        Y = V + 1,
        J = V + n,
        tt = J + 1,
        ct = o[V],
        st = o[Y],
        nt = o[J],
        pt = o[tt],
        ft = (st - ct) * (1 - K) + (pt - nt) * K,
        dt = (nt - ct) * (1 - q) + (pt - st) * q,
        j =
          ct * (1 - q) * (1 - K) +
          st * q * (1 - K) +
          nt * (1 - q) * K +
          pt * q * K;
      if (j < 1.6) break;
      ((E[V] += G), (I = I * M - ft * (1 - M)), (B = B * M - dt * (1 - M)));
      let u = Math.hypot(I, B);
      if (
        u < 1e-5 ||
        ((I /= u),
        (B /= u),
        (z += I),
        (T += B),
        z < 2 || z >= n - 3 || T < 2 || T >= n - 3)
      )
        break;
      let d = z | 0,
        s = T | 0,
        m = z - d,
        k = T - s,
        F = s * n + d,
        C = F + 1,
        P = F + n,
        _ = P + 1,
        U =
          o[F] * (1 - m) * (1 - k) +
          o[C] * m * (1 - k) +
          o[P] * (1 - m) * k +
          o[_] * m * k -
          j,
        $ = Math.max(-U, w) * W * G * g;
      if (U > 0 || O > $) {
        let N = U > 0 ? Math.min(O, U) : (O - $) * b;
        ((O -= N),
          (o[V] += N * (1 - q) * (1 - K)),
          (o[Y] += N * q * (1 - K)),
          (o[J] += N * (1 - q) * K),
          (o[tt] += N * q * K));
      } else {
        let N = Math.min(($ - O) * y, -U * 0.88);
        if (N > 0) {
          for (let ut = 0; ut < p.length; ut++) {
            let xt = V + p[ut];
            if (xt < 0 || xt >= a) continue;
            let mt = N * h[ut],
              wt = o[xt];
            wt > 1.5 && (o[xt] = wt - Math.min(mt, (wt - 1.3) * 0.28));
          }
          O += N;
        }
      }
      ((W = Math.sqrt(Math.max(0, W * W - U * A))), (G *= 1 - v));
    }
    (D & 4095) === 0 &&
      (yield { label: "Sculpting valleys and meadows", p: D / i });
  }
  for (let D = 2; D < n - 2; D++)
    for (let z = 2; z < n - 2; z++) {
      let T = D * n + z,
        I = o[T];
      if (I <= 1.4 || I > 175) continue;
      let B = (E[T] * 2 + E[T - 1] + E[T + 1] + E[T - n] + E[T + n]) / 6;
      if (B > 1.8) {
        let W = Math.min(0.46, Math.log1p(B - 1.5) * 0.11),
          G = 1.2 + Math.min(18, I * 0.18);
        o[T] = I - (I - G) * W;
      }
    }
  let H = new Float32Array(a),
    R = [-1, 1, -n, n];
  for (let D = 0; D < 4; D++) {
    H.fill(0);
    for (let z = 2; z < n - 2; z++)
      for (let T = 2; T < n - 2; T++) {
        let I = z * n + T,
          B = o[I];
        if (B < 12) continue;
        let W = B > 150 ? 6.2 : 4.3;
        for (let G of R) {
          let O = I + G,
            S = B - o[O] - W;
          if (o[O] > 2 && S > 0) {
            let L = Math.min(S * 0.028, 0.32);
            ((H[I] -= L), (H[O] += L));
          }
        }
      }
    for (let z = 0; z < a; z++) o[z] += H[z];
    yield { label: "Weathering cliffs and talus", p: (D + 1) / 4 };
  }
}
var ve = [
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
  we = ["ri", "nu", "va", "lo", "ka", "mai", "ora", "tea", "wen", "sa"],
  Te = class {
    idx;
    key;
    n = 0;
    constructor(n) {
      ((this.idx = new Int32Array(n)), (this.key = new Float32Array(n)));
    }
    clear() {
      this.n = 0;
    }
    push(n, e) {
      if (this.n >= this.idx.length) {
        let t = new Int32Array(this.idx.length * 2),
          l = new Float32Array(this.key.length * 2);
        (t.set(this.idx), l.set(this.key), (this.idx = t), (this.key = l));
      }
      let r = this.n++,
        a = this.idx,
        f = this.key;
      for (; r > 0;) {
        let t = (r - 1) >> 1;
        if (f[t] <= e) break;
        ((a[r] = a[t]), (f[r] = f[t]), (r = t));
      }
      ((a[r] = n), (f[r] = e));
    }
    pop() {
      let n = this.idx,
        e = this.key,
        r = n[0],
        a = n[--this.n],
        f = e[this.n],
        t = 0;
      for (;;) {
        let l = t * 2 + 1;
        if (
          l >= this.n ||
          (l + 1 < this.n && e[l + 1] < e[l] && l++, e[l] >= f)
        )
          break;
        ((n[t] = n[l]), (e[t] = e[l]), (t = l));
      }
      return ((n[t] = a), (e[t] = f), r);
    }
  };
function pe(o, n) {
  for (let e = 0; e < n; e++) {
    let r = [o[0], o[1]];
    for (let a = 0; a + 3 < o.length; a += 2) {
      let f = o[a],
        t = o[a + 1],
        l = o[a + 2],
        c = o[a + 3];
      r.push(
        f * 0.75 + l * 0.25,
        t * 0.75 + c * 0.25,
        f * 0.25 + l * 0.75,
        t * 0.25 + c * 0.75,
      );
    }
    (r.push(o[o.length - 2], o[o.length - 1]), (o = r));
  }
  return o;
}
function Oe(o, n, e = 1, r = 1) {
  let a = o.length / 2;
  if (a < 3 || n < 1) return o.slice();
  let f = [],
    t = 0;
  for (let c = -n; c <= n; c++) {
    let p = Math.exp(-(c * c) / (n * n * 0.5));
    (f.push(p), (t += p));
  }
  for (let c = 0; c < f.length; c++) f[c] /= t;
  let l = o.slice();
  for (let c = 0; c < e; c++) {
    let p = l.slice();
    for (let h = r; h < a - r; h++) {
      let i = 0,
        x = 0;
      for (let w = -n; w <= n; w++) {
        let y = h + w;
        (y < 0 && (y = -y),
          y > a - 1 && (y = 2 * (a - 1) - y),
          (y = Math.max(0, Math.min(a - 1, y))),
          (i += l[y * 2] * f[w + n]),
          (x += l[y * 2 + 1] * f[w + n]));
      }
      let M = Math.min(h - r + 1, a - r - h) / Math.max(1, n),
        g = Math.min(1, M);
      ((p[h * 2] = l[h * 2] + (i - l[h * 2]) * g),
        (p[h * 2 + 1] = l[h * 2 + 1] + (x - l[h * 2 + 1]) * g));
    }
    l = p;
  }
  return l;
}
function ke(o, n, e = 1, r = 1, a = 80) {
  let f = o.length / 2;
  if (f < 4) return o;
  let t = new Float32Array(f);
  for (let l = 0; l < a; l++) {
    for (let h = 1; h < f - 1; h++) {
      let i = o[(h - 1) * 2],
        x = o[(h - 1) * 2 + 1],
        M = o[h * 2],
        g = o[h * 2 + 1],
        w = o[(h + 1) * 2],
        y = o[(h + 1) * 2 + 1],
        b = (M - i) * (y - x) - (g - x) * (w - i),
        v =
          Math.hypot(M - i, g - x) *
          Math.hypot(w - M, y - g) *
          Math.hypot(w - i, y - x);
      t[h] = v < 1e-6 ? 0 : Math.abs((2 * b) / v);
    }
    let c = 0,
      p = o.slice();
    for (let h = Math.max(1, e); h < f - Math.max(1, r); h++) {
      let x = Math.max(t[h], t[h - 1] * 0.85, t[h + 1] * 0.85) * n(h);
      if (x <= 1) continue;
      c++;
      let M = Math.min(0.5, 0.18 + (x - 1) * 0.25),
        g = (o[(h - 1) * 2] + o[(h + 1) * 2]) * 0.5,
        w = (o[(h - 1) * 2 + 1] + o[(h + 1) * 2 + 1]) * 0.5;
      ((p[h * 2] = o[h * 2] + (g - o[h * 2]) * M),
        (p[h * 2 + 1] = o[h * 2 + 1] + (w - o[h * 2 + 1]) * M));
    }
    if (((o = p), !c)) break;
  }
  return o;
}
function ze(o, n) {
  let e = [o[0], o[1]],
    r = 0;
  for (let t = 0; t + 3 < o.length; t += 2) {
    let l = o[t],
      c = o[t + 1],
      p = o[t + 2] - l,
      h = o[t + 3] - c,
      i = Math.hypot(p, h);
    if (i < 1e-5) continue;
    let x = n - r;
    for (; x <= i;) (e.push(l + (p * x) / i, c + (h * x) / i), (x += n));
    r = i - (x - n);
  }
  let a = o[o.length - 2],
    f = o[o.length - 1];
  return (
    Math.hypot(a - e[e.length - 2], f - e[e.length - 1]) > 0.01 && e.push(a, f),
    e
  );
}
function Fe(o, n) {
  let e = n * n,
    r = new Float32Array(e),
    a = new Int32Array(e).fill(-1),
    f = new Float32Array(e),
    t = new Uint8Array(e),
    l = new Int32Array(e),
    c = new Te(e),
    p = 0.018;
  for (let i = 0; i < e; i++) {
    let x = i % n,
      M = (i / n) | 0;
    (o[i] <= 0 || x === 0 || M === 0 || x === n - 1 || M === n - 1) &&
      ((t[i] = 1), (r[i] = o[i] <= 0 ? 0 : o[i]), c.push(i, r[i]));
  }
  let h = 0;
  for (; c.n;) {
    let i = c.pop();
    l[h++] = i;
    let x = i % n,
      M = (i / n) | 0;
    for (let g = 0; g < 8; g++) {
      let w = x + Nt[g],
        y = M + Qt[g];
      if (w < 0 || y < 0 || w >= n || y >= n) continue;
      let b = y * n + w;
      t[b] ||
        ((t[b] = 1),
        (r[b] = o[b] <= 0 ? 0 : Math.max(o[b], r[i] + p)),
        (a[b] = i),
        c.push(b, r[b]));
    }
  }
  for (let i = 0; i < e; i++) {
    if (o[i] <= 0) continue;
    let x = i % n,
      M = (i / n) | 0,
      g = -1,
      w = 0;
    for (let y = 0; y < 8; y++) {
      let b = x + Nt[y],
        v = M + Qt[y];
      if (b < 0 || v < 0 || b >= n || v >= n) continue;
      let A = v * n + b,
        E = (r[i] - r[A]) * (y & 1 ? Math.SQRT1_2 : 1);
      E > w + 1e-6 && ((w = E), (g = A));
    }
    (g >= 0 && (a[i] = g), (f[i] = 1 + Math.min(1.2, Math.max(0, o[i]) / 320)));
  }
  for (let i = h - 1; i >= 0; i--) {
    let x = l[i],
      M = a[x];
    M >= 0 && (f[M] += f[x]);
  }
  return { filled: r, downstream: a, accumulation: f, order: l };
}
var Gt = {
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
function hn(o, n, e = 0.1) {
  if (o <= 0 || o >= n) return o;
  let r = o / n,
    a = -(1 - e),
    f = 2 * (1 - e);
  return n * (a * r * r * r + f * r * r + e * r);
}
function* fn(o, n, e, r, a) {
  let f = Math.max(1, Math.round(20 / r)),
    t = Math.floor(e / f),
    l = r * f,
    c = (e * r) / 2,
    p = t * t,
    h = new Float32Array(p),
    i = new Float32Array(p);
  for (let H = 0; H < t; H++)
    for (let R = 0; R < t; R++) {
      let D = 0,
        z = 0,
        T = 0;
      for (let I = 0; I < f; I++)
        for (let B = 0; B < f; B++) {
          let W = (H * f + I) * e + (R * f + B);
          ((D += o[W]), (z += n[W]), T++);
        }
      ((h[H * t + R] = D / T), (i[H * t + R] = z / T));
    }
  let x = h.slice(),
    M = new jt(a ^ 625341585);
  for (let H = 0; H < 3; H++) {
    let R = h.slice();
    for (let D = 1; D < t - 1; D++)
      for (let z = 1; z < t - 1; z++) {
        let T = D * t + z;
        if (R[T] <= 2) continue;
        let I =
          (4 * R[T] +
            2 * (R[T - 1] + R[T + 1] + R[T - t] + R[T + t]) +
            R[T - t - 1] +
            R[T - t + 1] +
            R[T + t - 1] +
            R[T + t + 1]) /
          16;
        h[T] = bt(R[T], I, 0.65 * et(2, 30, R[T]));
      }
  }
  let g = new Float32Array(p),
    w = new Float32Array(p),
    y = new Float32Array(p);
  for (let H = 0; H < t; H++)
    for (let R = 0; R < t; R++) {
      let D = H * t + R,
        z = (R + 0.5) * l - c,
        T = (H + 0.5) * l - c,
        I = M.fbm(z / Gt.province, T / Gt.province, 3),
        B = at(
          et(-0.28, 0.32, I) * 0.75 + i[D] * 0.35 - et(300, 700, h[D]) * 0.3,
          0,
          1,
        );
      ((g[D] = B),
        (w[D] = bt(Gt.kHard, Gt.kSoft, B)),
        (y[D] = bt(Gt.dHard, Gt.dSoft, B * B)));
    }
  let b = (H, R) => {
    let D = Math.max(2, Math.round(R / l)),
      z = H.slice(),
      T = new Float32Array(p);
    for (let I = 0; I < 3; I++) {
      for (let B = 0; B < t; B++) {
        let W = 0;
        for (let G = -D; G <= D; G++) W += z[B * t + at(G, 0, t - 1)];
        for (let G = 0; G < t; G++)
          ((T[B * t + G] = W / (2 * D + 1)),
            (W +=
              z[B * t + Math.min(t - 1, G + D + 1)] -
              z[B * t + Math.max(0, G - D)]));
      }
      for (let B = 0; B < t; B++) {
        let W = 0;
        for (let G = -D; G <= D; G++) W += T[at(G, 0, t - 1) * t + B];
        for (let G = 0; G < t; G++)
          ((z[G * t + B] = W / (2 * D + 1)),
            (W +=
              T[Math.min(t - 1, G + D + 1) * t + B] -
              T[Math.max(0, G - D) * t + B]));
      }
    }
    return z;
  };
  {
    let H = new Float32Array(p);
    for (let z = 0; z < p; z++) H[z] = Math.max(0, h[z]);
    let R = b(H, Gt.massifRadius),
      D = b(H, Gt.massifRadius * 0.45);
    for (let z = 0; z < t; z++)
      for (let T = 0; T < t; T++) {
        let I = z * t + T;
        if (h[I] <= 0.3) continue;
        let B = (T + 0.5) * l - c,
          W = (z + 0.5) * l - c,
          G = et(0.5, 14, h[I]),
          O = (R[I] * Gt.massifLift + D[I] * 0.22) * G,
          S =
            g[I] *
            Gt.hillHeight *
            G *
            (0.55 + 0.45 * M.eroded(B / 900 + 3.1, W / 900 - 1.7, 5, 1.3)) *
            (1 - et(150, 420, h[I])),
          L = 22,
          Z = O + S,
          q = at(0.5 + (0.5 * (h[I] - Z)) / L, 0, 1);
        h[I] = bt(Z, h[I], q) + L * q * (1 - q);
      }
  }
  let v = new Float32Array(p);
  for (let H = 0; H < Gt.iterations; H++) {
    let R = Fe(h, t),
      { order: D, downstream: z, accumulation: T } = R;
    for (let I = 0; I < p; I++) {
      let B = D[I],
        W = z[B];
      if (W < 0 || h[B] <= 0 || h[B] <= h[W]) continue;
      let O =
          B % t !== W % t && ((B / t) | 0) !== ((W / t) | 0)
            ? l * Math.SQRT2
            : l,
        S = T[B] * l * l,
        L = (w[B] * Math.pow(S, Gt.m)) / O,
        Z = (h[B] + L * h[W]) / (1 + L);
      h[B] = Math.max(Z, 0.3);
    }
    for (let I = 1; I < t - 1; I++)
      for (let B = 1; B < t - 1; B++) {
        let W = I * t + B,
          G = h[W];
        if (G <= 0) {
          v[W] = G;
          continue;
        }
        let O = h[W - 1] + h[W + 1] + h[W - t] + h[W + t] - 4 * G;
        v[W] = Math.max(0.3, G + y[W] * O);
      }
    for (let I = 1; I < t - 1; I++)
      for (let B = 1; B < t - 1; B++) {
        let W = I * t + B;
        h[W] > 0 && (h[W] = v[W]);
      }
    (H & 3) === 0 &&
      (yield { label: "Rivers incising the ranges", p: H / Gt.iterations });
  }
  let A = (H, R, D) => {
    ((R = at(R, 0, t - 1.001)), (D = at(D, 0, t - 1.001)));
    let z = R | 0,
      T = D | 0,
      I = R - z,
      B = D - T,
      W = T * t + z,
      G = Math.min(t - 1, z + 1) - z,
      O = (Math.min(t - 1, T + 1) - T) * t;
    return (
      H[W] * (1 - I) * (1 - B) +
      H[W + G] * I * (1 - B) +
      H[W + O] * (1 - I) * B +
      H[W + O + G] * I * B
    );
  };
  for (let H = 0; H < e; H++) {
    let R = (H + 0.5) / f - 0.5;
    for (let D = 0; D < e; D++) {
      let z = H * e + D;
      if (o[z] <= 0) continue;
      let T = (D + 0.5) / f - 0.5,
        I = A(x, T, R),
        B = A(h, T, R),
        W = Math.max(0, I - B),
        G = 0.16 * (1 - 0.8 * et(3, 42, W)),
        O = B + (o[z] - I) * G,
        L = (1 - A(g, T, R)) * et(110, 240, O);
      if (L > 0.01) {
        let Z = (D + 0.5) * r - c,
          q = (H + 0.5) * r - c,
          K =
            Gt.strataPeriod *
            (0.8 + 0.4 * (0.5 + 0.5 * M.fbm(Z / 1400, q / 1400, 2))),
          V = M.fbm(Z / 3e3 + 9, q / 3e3, 2) * 40,
          Y = (O + V) / K,
          J = Y - Math.floor(Y),
          tt = (Math.floor(Y) + et(0.28, 0.72, J)) * K - V;
        O = bt(O, tt, Gt.strataStrength * L);
      }
      o[z] = Math.max(O, 0.25);
    }
  }
  let E = new Float32Array(e * e);
  for (let H = 0; H < e; H++)
    for (let R = 0; R < e; R++)
      E[H * e + R] = 1 - A(g, (R + 0.5) / f - 0.5, (H + 0.5) / f - 0.5);
  return (
    He(o, e, r, E, { passes: 14, conserve: !0 }),
    yield { label: "Rivers incising the ranges", p: 1 },
    E
  );
}
function He(o, n, e, r, a) {
  let f = [1, -1, n, -n, n + 1, n - 1, -n + 1, -n - 1],
    t = [1, 1, 1, 1, Math.SQRT2, Math.SQRT2, Math.SQRT2, Math.SQRT2];
  for (let l = 0; l < a.passes; l++) {
    let c = (l & 1) === 1;
    for (let p = 1; p < n - 1; p++) {
      let h = c ? n - 1 - p : p;
      for (let i = 1; i < n - 1; i++) {
        let x = c ? n - 1 - i : i,
          M = h * n + x;
        if (o[M] <= 1 || (a.protect && a.protect[M])) continue;
        let g = bt(0.5, 0.62, et(40, 170, o[M])),
          w = bt(g, 1.15, r[M] * et(150, 320, o[M])),
          y = -1,
          b = 0;
        for (let A = 0; A < 8; A++) {
          let E = M + f[A],
            H = o[M] - o[E] - w * e * t[A];
          H > b && ((b = H), (y = E));
        }
        if (y < 0) continue;
        let v = b * 0.45;
        if (a.conserve) {
          if (o[y] <= 0 || (a.protect && a.protect[y])) continue;
          ((o[M] -= v), (o[y] += v));
        } else o[M] = Math.max(0.3, o[M] - v);
      }
    }
  }
}
function mn(o, n, e, r, a, f, t) {
  let l = r * r;
  {
    let p = (i) => ((i % r) + 0.5) * a - f,
      h = (i) => (((i / r) | 0) + 0.5) * a - f;
    for (let i = 0; i < l; i++) {
      if (n[i] !== 0) continue;
      let x = o[i],
        M = 1 - et(24, 46, x);
      if (M < 0.02) continue;
      let g = e[i];
      if (g >= 500) continue;
      let w = g / 500,
        y = (1 - et(0.06, 1, w)) * M;
      if (y < 0.02) continue;
      let b = 0.78 + 0.44 * t.n2(p(i) / 240, h(i) / 240),
        v = (14 * Math.pow(w, 1.35) + 1.2) * b,
        A = Math.max(Math.min(x, v), x - 15);
      o[i] = bt(x, A, y);
    }
  }
  for (let c = 0; c < 3; c++) {
    let p = (c & 1) !== 0,
      h = p ? r - 2 : 1,
      i = p ? 0 : r - 1,
      x = p ? -1 : 1,
      M = p ? r - 2 : 1,
      g = p ? 0 : r - 1,
      w = p ? -1 : 1;
    for (let y = h; y !== i; y += x)
      for (let b = M; b !== g; b += w) {
        let v = y * r + b;
        if (n[v] !== 1) continue;
        let A = o[v];
        for (let E = 0; E < 8; E++) {
          let H = (y + Qt[E]) * r + b + Nt[E],
            R = E & 1 ? 36 : 26;
          A = Math.max(A, o[H] - R);
        }
        A > o[v] && (o[v] = Math.min(A, -0.05));
      }
  }
  for (let c = 0; c < 10; c++) {
    let p = (c & 1) !== 0,
      h = p ? r - 2 : 1,
      i = p ? 0 : r - 1,
      x = p ? -1 : 1,
      M = p ? r - 2 : 1,
      g = p ? 0 : r - 1,
      w = p ? -1 : 1;
    for (let y = h; y !== i; y += x)
      for (let b = M; b !== g; b += w) {
        let v = y * r + b;
        if (n[v] !== 0) continue;
        let A = o[v];
        for (let E = 0; E < 8; E++) {
          let H = (y + Qt[E]) * r + b + Nt[E],
            R = E & 1 ? a * Math.SQRT2 : a;
          A = Math.min(A, o[H] + R * 1.75);
        }
        A < o[v] && (o[v] = Math.max(0.35, A));
      }
  }
}
function* pn(o, n, e) {
  let r = n * n,
    a = new Float32Array(r),
    f = 1e6;
  for (let h = 0; h < r; h++) a[h] = o[h] >= 0 ? 0 : f;
  let t = e,
    l = e * Math.SQRT2;
  for (let h = 0; h < n; h++) {
    for (let i = 0; i < n; i++) {
      let x = h * n + i;
      if (a[x] === 0) continue;
      let M = a[x];
      (i > 0 && (M = Math.min(M, a[x - 1] + t)),
        h > 0 &&
          ((M = Math.min(M, a[x - n] + t)),
          i > 0 && (M = Math.min(M, a[x - n - 1] + l)),
          i < n - 1 && (M = Math.min(M, a[x - n + 1] + l))),
        (a[x] = M));
    }
    (h & 127) === 0 &&
      (yield { label: "Measuring the coastline", p: (0.5 * h) / n });
  }
  for (let h = n - 1; h >= 0; h--) {
    for (let i = n - 1; i >= 0; i--) {
      let x = h * n + i;
      if (a[x] === 0) continue;
      let M = a[x];
      (i < n - 1 && (M = Math.min(M, a[x + 1] + t)),
        h < n - 1 &&
          ((M = Math.min(M, a[x + n] + t)),
          i < n - 1 && (M = Math.min(M, a[x + n + 1] + l)),
          i > 0 && (M = Math.min(M, a[x + n - 1] + l))),
        (a[x] = M));
    }
    (h & 127) === 0 &&
      (yield { label: "Measuring the coastline", p: 0.5 + 0.4 * (1 - h / n) });
  }
  for (let h = 0; h < r; h++) a[h] > 3e3 && (a[h] = 3e3);
  let c = new Float32Array(r),
    p = new Float32Array(r);
  for (let h = 0; h < n; h++)
    for (let i = 0; i < n; i++) {
      let x = h * n + i,
        M = Math.max(i - 1, 0),
        g = Math.min(i + 1, n - 1),
        w = Math.max(h - 1, 0),
        y = Math.min(h + 1, n - 1),
        b,
        v;
      o[x] < 0
        ? ((b = -(a[h * n + g] - a[h * n + M])),
          (v = -(a[y * n + i] - a[w * n + i])))
        : ((b = o[h * n + g] - o[h * n + M]),
          (v = o[y * n + i] - o[w * n + i]));
      let A = Math.hypot(b, v);
      A > 1e-6 && ((c[x] = b / A), (p[x] = v / A));
    }
  for (let h = 0; h < 3; h++) {
    let i = new Float32Array(r),
      x = new Float32Array(r);
    for (let M = 0; M < n; M++)
      for (let g = 0; g < n; g++) {
        let w = 0,
          y = 0;
        for (let A = -1; A <= 1; A++)
          for (let E = -1; E <= 1; E++) {
            let H = at(g + E, 0, n - 1),
              R = at(M + A, 0, n - 1),
              D = E === 0 && A === 0 ? 2 : 1;
            ((w += c[R * n + H] * D), (y += p[R * n + H] * D));
          }
        let b = Math.hypot(w, y),
          v = M * n + g;
        b > 1e-6 && ((i[v] = w / b), (x[v] = y / b));
      }
    (c.set(i), p.set(x));
  }
  return (
    yield { label: "Measuring the coastline", p: 1 },
    { tau: a, dirX: c, dirZ: p }
  );
}
var De = { beam: 2.3, length: 5.4, draft: 0.55 },
  Ct = { halfWidth: De.beam * 0.5 + 2.2, depth: De.draft + 0.85 },
  it = {
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
var ue = Math.PI * 2;
function Jt(o) {
  let n = 0;
  for (let e = 2; e < o.length; e += 2)
    n += Math.hypot(o[e] - o[e - 2], o[e + 1] - o[e - 1]);
  return n;
}
export { At, Ct, Fe, He, Jt, Nt, Oe, Qt, at, bt, et, fn, hn, it, jt, ke, me, mn, pe, pn, ue, un, ve, we, ze };
