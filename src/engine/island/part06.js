// island.js - part 6/21 (statements 70-83 of the original module).
import * as Oe from "three";
import * as ht from "three";
import { mergeVertices as cr } from "three/addons/utils/BufferGeometryUtils.js";
import { Ie } from "./part01.js";
import { Fo, Nt, an, ho } from "./part05.js";

function ir(o) {
  let { N: e, cell: t, half: r, h: s } = o,
    c = e * e,
    a = new Uint8Array(c),
    n = 0;
  for (let x = 0; x < e - 1; x++)
    for (let f = 0; f < e - 1; f++) {
      let v = x * e + f;
      an(o, v) && ((a[v] = 1), (n += 5));
    }
  let i = new Float32Array((c + n) * 3),
    m = new Float32Array((c + n) * 3);
  for (let x = 0; x < e; x++)
    for (let f = 0; f < e; f++) {
      let v = x * e + f;
      ((i[v * 3] = (f + 0.5) * t - r),
        (i[v * 3 + 1] = s[v]),
        (i[v * 3 + 2] = (x + 0.5) * t - r));
      let b = s[v - (f > 0 ? 1 : 0)],
        g = s[v + (f < e - 1 ? 1 : 0)],
        M = s[v - (x > 0 ? e : 0)],
        w = s[v + (x < e - 1 ? e : 0)],
        E = (b - g) / (2 * t),
        k = (M - w) / (2 * t),
        R = 1 / Math.sqrt(E * E + 1 + k * k);
      ((m[v * 3] = E * R), (m[v * 3 + 1] = R), (m[v * 3 + 2] = k * R));
    }
  let h = [],
    l = c;
  for (let x = 0; x < e - 1; x++)
    for (let f = 0; f < e - 1; f++) {
      let v = x * e + f,
        b = v + 1,
        g = v + e,
        M = g + 1;
      if (s[v] < -30 && s[b] < -30 && s[g] < -30 && s[M] < -30) continue;
      if (!a[v]) {
        h.push(v, g, b, b, g, M);
        continue;
      }
      let w = [v, -1, b, -1, -1, -1, g, -1, M];
      for (let E = 0; E < 3; E++)
        for (let k = 0; k < 3; k++) {
          let R = E * 3 + k;
          if (w[R] >= 0) continue;
          let H = k / 2,
            C = E / 2,
            W = l++;
          ((w[R] = W),
            (i[W * 3] = (f + 0.5 + H) * t - r),
            (i[W * 3 + 1] =
              (s[v] * (1 - H) + s[b] * H) * (1 - C) +
              (s[g] * (1 - H) + s[M] * H) * C),
            (i[W * 3 + 2] = (x + 0.5 + C) * t - r));
          for (let T = 0; T < 3; T++)
            m[W * 3 + T] =
              (m[v * 3 + T] * (1 - H) + m[b * 3 + T] * H) * (1 - C) +
              (m[g * 3 + T] * (1 - H) + m[M * 3 + T] * H) * C;
        }
      for (let E = 0; E < 2; E++)
        for (let k = 0; k < 2; k++) {
          let R = E * 3 + k;
          h.push(w[R], w[R + 3], w[R + 1], w[R + 1], w[R + 3], w[R + 4]);
        }
    }
  let u = [];
  for (let x = 0; x < e - 1; x += 4)
    for (let f = 0; f < e - 1; f += 4) {
      let v = x * e + f,
        b = x * e + Math.min(f + 4, e - 1),
        g = Math.min(x + 4, e - 1) * e + f,
        M = Math.min(x + 4, e - 1) * e + Math.min(f + 4, e - 1);
      (s[v] < -30 && s[b] < -30 && s[g] < -30 && s[M] < -30) ||
        u.push(v, g, b, b, g, M);
    }
  let d = new Uint32Array(h.length + u.length);
  (d.set(h), d.set(u, h.length));
  let p = new Oe.BufferGeometry();
  return (
    p.setAttribute("position", new Oe.BufferAttribute(i, 3)),
    p.setAttribute("normal", new Oe.BufferAttribute(m, 3)),
    p.setIndex(new Oe.BufferAttribute(d, 1)),
    p.setDrawRange(0, h.length),
    (p.boundingSphere = new Oe.Sphere(new Oe.Vector3(0, 0, 0), r * 1.5)),
    { geometry: p, fullCount: h.length, coarseCount: u.length }
  );
}
function lr(o, e = 6e4) {
  let t = (Math.PI * 2) / o,
    r = [0],
    s = 0.4;
  for (; s < e;) (r.push(s), (s *= s < 4e3 ? 1 + t : 1.08));
  r.push(e);
  let c = new Float32Array(r.length * o * 3),
    a = [],
    n = 0;
  for (let m of r)
    for (let h = 0; h < o; h++)
      ((c[n++] = Math.cos(h * t) * m),
        (c[n++] = 0),
        (c[n++] = Math.sin(h * t) * m));
  for (let m = 0; m < r.length - 1; m++)
    for (let h = 0; h < o; h++) {
      let l = (h + 1) % o,
        u = m * o,
        d = u + o;
      a.push(u + h, d + l, d + h, u + h, u + l, d + l);
    }
  let i = new Oe.BufferGeometry();
  return (
    i.setAttribute("position", new Oe.BufferAttribute(c, 3)),
    i.setIndex(new Oe.BufferAttribute(new Uint32Array(a), 1)),
    (i.boundingSphere = new Oe.Sphere(new Oe.Vector3(), 1e6)),
    i
  );
}
function Qo(o, e) {
  let { N: t, h: r, type: s, cell: c, cdist: a } = o,
    n = e.getContext("2d"),
    i = t;
  e.width = e.height = i;
  let m = t / i,
    h = n.createImageData(i, i),
    l = h.data,
    u = (D, q) =>
      r[Math.max(0, Math.min(t - 1, q)) * t + Math.max(0, Math.min(t - 1, D))],
    d = (D, q) => {
      let N = Math.sin(D * 12.9898 + q * 78.233 + o.seed * 1e-4) * 43758.5453;
      return N - Math.floor(N);
    },
    p = (D, q, N) => D + (q - D) * N,
    x = (D, q) => {
      let N = Math.max(0, Math.min(1, D)) * (q.length - 1),
        V = Math.min(q.length - 2, Math.floor(N)),
        G = N - V;
      return [
        p(q[V][0], q[V + 1][0], G),
        p(q[V][1], q[V + 1][1], G),
        p(q[V][2], q[V + 1][2], G),
      ];
    },
    [f, v] = ho(o.seed),
    b = o.half,
    g = [
      [46, 170, 156],
      [18, 112, 124],
      [9, 62, 92],
      [6, 32, 58],
    ],
    M = [
      [132, 226, 196],
      [58, 196, 168],
      [22, 146, 140],
    ];
  for (let D = 0; D < i; D++)
    for (let q = 0; q < i; q++) {
      let N = Math.min(t - 1, (q * m) | 0),
        V = Math.min(t - 1, (D * m) | 0),
        G = V * t + N,
        U = r[G],
        K = u(N - 2, V),
        X = u(N + 2, V),
        J = u(N, V - 2),
        se = u(N, V + 2),
        te = (K - X) / (4 * c),
        me = (J - se) / (4 * c),
        $ = Math.hypot(te, 1, me),
        Z = Math.max(0, (-te * 0.72 - me * 0.62 + 0.88) / $),
        j = Math.max(0, (te * 0.28 + me * 0.2 + 0.95) / $),
        S = 0.38 + Z * 0.92 + j * 0.14,
        F = Math.hypot(te, me),
        y = U - (K + X + J + se) * 0.25,
        A = 0.97 + d(q, D) * 0.06,
        B =
          Nt(N * 0.11, V * 0.11, 1779033703) * 0.7 +
          Nt(N * 0.31, V * 0.31, 3144134277) * 0.3,
        I,
        O,
        _,
        ae = o.inl[G];
      if (o.wet[G] || (U <= 0 && ae > 0.5)) {
        let Y = o.wet[G] ? o.level[G] - U : -U,
          ee = o.swamp[G],
          ie = Math.hypot(o.flowX[G], o.flowZ[G]),
          he = Math.max(0, 1 - Y / 2.6);
        ((I = p(102, 18, Math.min(Y / 12, 1))),
          (O = p(188, 76, Math.min(Y / 12, 1))),
          (_ = p(196, 108, Math.min(Y / 12, 1))),
          (I = p(I, 118, he * 0.45)),
          (O = p(O, 212, he * 0.45)),
          (_ = p(_, 214, he * 0.45)),
          (I = p(I, 98, ie * 0.42)),
          (O = p(O, 168, ie * 0.42)),
          (_ = p(_, 188, ie * 0.42)),
          (I = p(I, 56, ee * 0.75)),
          (O = p(O, 74, ee * 0.75)),
          (_ = p(_, 48, ee * 0.75)),
          (I *= A),
          (O *= A),
          (_ *= A));
      } else if (s[G] === 1 || U <= 0) {
        let Y = -U,
          ee = x((Y - 0.6) / 42, g);
        ((I = ee[0]), (O = ee[1]), (_ = ee[2]));
        let ie = Math.min(1, ae / 0.52);
        ((I = p(I, 117, ie * 0.28)),
          (O = p(O, 148, ie * 0.28)),
          (_ = p(_, 137, ie * 0.28)));
        let he =
          Math.max(0, Math.min(1, (Y - 0.8) / 2.4)) *
          (1 - Math.max(0, Math.min(1, (Y - 7) / 9)));
        ((I = p(I, M[0][0], he * 0.55)),
          (O = p(O, M[0][1], he * 0.55)),
          (_ = p(_, M[0][2], he * 0.55)));
        let Me = Math.max(0, B - 0.82) * he;
        ((I = p(I, 225, Me * 0.7)),
          (O = p(O, 242, Me * 0.7)),
          (_ = p(_, 232, Me * 0.7)));
        let xe = Math.abs((Y % 8) - 4),
          He = Y > 3 && xe < 0.16 ? 0.86 : 1;
        ((I *= He), (O *= He), (_ *= He), (I *= A), (O *= A), (_ *= A));
      } else {
        let Y = (N + 0.5) * c - b,
          ee = (V + 0.5) * c - b;
        if (Fo(Y + f, ee + v, U, a[G], F, o.fresh[G])[0] < 0.32) {
          let He = Math.max(0, Math.min(1, U / 14));
          ((I = p(226, 244, He)), (O = p(203, 226, He)), (_ = p(156, 183, He)));
          let Ae = Math.max(0, Math.min(1, (U - 0.4) / 2.6)) * 0.45;
          ((I = p(I, 196, Ae)), (O = p(O, 178, Ae)), (_ = p(_, 140, Ae)));
        } else {
          let He = Math.max(
              o.plain[G] *
                (1 - Math.max(0, (U - 28) / 55)) *
                (1 - Math.min(1, F / 0.25)),
              o.fresh[G] *
                (1 - Math.max(0, (U - 18) / 28)) *
                (1 - Math.min(1, F / 0.22)),
            ),
            Ae = x(U / 310, [
              [38, 86, 44],
              [48, 98, 48],
              [68, 112, 54],
              [128, 128, 96],
              [202, 192, 162],
            ]);
          ((I = Ae[0]),
            (O = Ae[1]),
            (_ = Ae[2]),
            (I = p(I, 94, Math.min(1, He * 0.88))),
            (O = p(O, 152, Math.min(1, He * 0.88))),
            (_ = p(_, 64, Math.min(1, He * 0.88))));
          let Ee = o.swamp[G];
          ((I = p(I, 56, Ee * 0.68)),
            (O = p(O, 88, Ee * 0.68)),
            (_ = p(_, 42, Ee * 0.68)));
          let Ve =
            (0.86 +
              (Nt(N * 0.09, V * 0.09, 1013904242) * 0.6 +
                Nt(N * 0.29, V * 0.29, 2773480762) * 0.4) *
                0.24) *
            (1 - He * 0.5);
          ((I *= p(1, Ve, 0.85)), (O *= p(1, Ve, 0.85)), (_ *= p(1, Ve, 0.85)));
          let Se =
              Math.max(0, Math.min(1, (y - 0.6) / 2.2)) *
              Math.min(1, Math.max(0, (U - 35) / 80)),
            oe = Math.max(
              Se,
              Math.max(0, Math.min(1, (F - 0.32) / 0.45)) * Math.min(1, U / 55),
            ),
            Be = Math.max(0, Math.min(1, (Z - 0.52) * 2.1)),
            je = p(138, 224, Be),
            Ke = p(132, 214, Be),
            ke = p(116, 182, Be);
          ((I = p(I, je, oe * 0.88)),
            (O = p(O, Ke, oe * 0.88)),
            (_ = p(_, ke, oe * 0.88)));
        }
        let he = Math.abs((U % 40) - 20),
          Me = U > 18 && he < 0.55 ? 0.88 : 1,
          xe = Math.max(0.36, Math.min(1.54, S));
        ((I *= xe * A * Me), (O *= xe * A * Me), (_ *= xe * A * Me));
      }
      let le = (D * i + q) * 4;
      ((l[le] = Math.min(255, I)),
        (l[le + 1] = Math.min(255, O)),
        (l[le + 2] = Math.min(255, _)),
        (l[le + 3] = 255));
    }
  n.putImageData(h, 0, 0);
  let w = i;
  if (!(
    typeof n.createRadialGradient == "function" &&
    typeof n.beginPath == "function"
  ))
    return;
  (n.save(),
    (n.globalAlpha = 0.16),
    (n.strokeStyle = "#dff6f2"),
    (n.lineWidth = Math.max(1, w / 900)));
  for (let D = 1; D < 4; D++)
    (n.beginPath(),
      n.moveTo((w * D) / 4, 0),
      n.lineTo((w * D) / 4, w),
      n.moveTo(0, (w * D) / 4),
      n.lineTo(w, (w * D) / 4),
      n.stroke());
  n.globalAlpha = 1;
  let k = n.createRadialGradient(w / 2, w / 2, w * 0.3, w / 2, w / 2, w * 0.72);
  (k.addColorStop(0, "rgba(2,12,22,0)"),
    k.addColorStop(1, "rgba(2,10,20,0.55)"),
    (n.fillStyle = k),
    n.fillRect(0, 0, w, w));
  let R = (D) => (D + b) / c;
  ((n.lineCap = "round"), (n.lineJoin = "round"));
  for (let D of o.rivers) {
    n.strokeStyle = "rgba(116,208,220,0.68)";
    for (let q = 2; q < D.pts.length; q += 2) {
      let N = R(D.pts[q - 2]),
        V = R(D.pts[q - 1]),
        G = R(D.pts[q]),
        U = R(D.pts[q + 1]),
        K = D.hw[Math.min(D.hw.length - 1, q >> 1)] ?? D.hw[0];
      (n.beginPath(),
        n.moveTo(N, V),
        n.lineTo(G, U),
        (n.lineWidth = Math.max(1.3, ((K * 2) / c) * 0.58)),
        n.stroke());
    }
  }
  for (let D of o.lakes)
    (n.beginPath(),
      n.arc(R(D.x), R(D.z), Math.max(5, (D.r / c) * 0.2), 0, Math.PI * 2),
      (n.strokeStyle = "rgba(219,244,229,0.85)"),
      (n.lineWidth = 2.4),
      n.stroke());
  for (let D of o.marshes)
    (n.beginPath(),
      n.arc(R(D.x), R(D.z), Math.max(4, (D.r / c) * 0.11), 0, Math.PI * 2),
      (n.strokeStyle = "rgba(216,205,154,0.8)"),
      (n.lineWidth = 2.4),
      n.stroke());
  let H = w - w * 0.095,
    C = w * 0.19,
    W = w * 0.042;
  ((n.fillStyle = "rgba(3,18,26,0.55)"),
    (n.strokeStyle = "rgba(226,242,238,0.6)"),
    (n.lineWidth = Math.max(1, w / 1e3)),
    n.beginPath(),
    n.arc(H, C, W, 0, Math.PI * 2),
    n.fill(),
    n.stroke(),
    (n.fillStyle = "rgba(252,225,164,0.95)"),
    n.beginPath(),
    n.moveTo(H, C - W * 0.86),
    n.lineTo(H + W * 0.28, C + W * 0.3),
    n.lineTo(H, C + W * 0.1),
    n.lineTo(H - W * 0.28, C + W * 0.3),
    n.closePath(),
    n.fill(),
    (n.fillStyle = "rgba(238,248,244,0.85)"),
    (n.font = `${Math.round(w * 0.037)}px ui-sans-serif, system-ui, sans-serif`),
    (n.textAlign = "center"),
    n.fillText("N", H, C + W * 1.55));
  let P = 1e3 * (w / t / c),
    L = w * 0.078,
    z = w - w * 0.085;
  ((n.strokeStyle = "rgba(226,242,238,0.8)"),
    (n.fillStyle = "rgba(226,242,238,0.85)"),
    (n.lineWidth = Math.max(1.4, w / 700)),
    n.beginPath(),
    n.moveTo(L, z),
    n.lineTo(L + P, z),
    n.moveTo(L, z - w * 0.018),
    n.lineTo(L, z + w * 0.008),
    n.moveTo(L + P, z - w * 0.018),
    n.lineTo(L + P, z + w * 0.008),
    n.moveTo(L + P / 2, z - w * 0.01),
    n.lineTo(L + P / 2, z + w * 0.004),
    n.stroke(),
    (n.font = `${Math.round(w * 0.032)}px ui-sans-serif, system-ui, sans-serif`),
    (n.textAlign = "left"),
    n.fillText("1 KM", L, z - w * 0.03),
    n.restore());
}
var ft = `
uniform vec3 uSun,uMoon,uSunCol,uTint;
uniform float uTime,uDay,uNight,uTwi,uCov,uDens,uStorm,uFlash,uLight,uSkyLQ;
float h12(vec2 p){vec3 q=fract(vec3(p.xyx)*.1031);q+=dot(q,q.yzx+33.33);return fract((q.x+q.y)*q.z);}
float vn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
 return mix(mix(h12(i),h12(i+vec2(1,0)),f.x),mix(h12(i+vec2(0,1)),h12(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float a=.5,s=0.;for(int i=0;i<4;i++){s+=a*vn(p);p=p*2.03+17.1;a*=.5;}return s/.9375;}
float fbm2(vec2 p){return (.5*vn(p)+.25*vn(p*2.03+17.1))/.75;}
vec3 dayHz(){return mix(vec3(.66,.78,.95),vec3(.32,1.18,2.2),smoothstep(.4,.9,uSun.y)*(1.-uStorm));}
vec3 horizon(){
 vec3 h=mix(vec3(.02,.03,.055),mix(dayHz(),vec3(.16,.17,.19),uStorm*.9),uDay);
 return mix(h,uTint*.85,uTwi*.55);}
vec3 hzSoft(){vec3 h=horizon();return mix(h,vec3(dot(h,vec3(.3,.59,.11))),.68*uDay*(1.-uTwi)*(1.-uStorm));}
vec3 sky(vec3 d){
 float y=max(d.y,0.),sd=max(dot(d,uSun),0.);
 vec3 hz=horizon();float ov=smoothstep(.25,.85,uStorm);
 vec3 zen=mix(vec3(.003,.007,.022),mix(mix(vec3(.09,.27,.68),vec3(.007,.35,1.73),smoothstep(.4,.9,uSun.y)*(1.-uStorm)),vec3(.04,.045,.055),uStorm*.9),uDay);
 vec3 c=mix(hz,zen,pow(y,.42));
 c+=uTint*uTwi*(.3+1.1*pow(sd,3.))*exp(-y*6.);
 c+=uSunCol*(pow(sd,10.)*.1+pow(sd,180.)*.5)*uDay*(1.-ov);
 float cl=0.,dn=0.;
 if(d.y>.002){
  vec2 p=d.xz/(d.y+.12)*.9+uTime*vec2(.012,.007);
  float fb=uSkyLQ>1.5?vn(p*1.5):(uSkyLQ>.5?fbm2(p):fbm(p)),up=smoothstep(0.,.1,d.y);
  dn=mix(smoothstep(.62-.3*uCov,.92-.25*uCov,fb),.55+.45*fb,ov);
  cl=mix(1.-exp(-uDens*2.8*dn),1.,ov)*up;
  if(uSkyLQ<.5){
   float ci=smoothstep(.55,.9,fbm(d.xz/(d.y+.3)*vec2(2.2,.7)+uTime*vec2(.03,.01)))*.3*(1.-uStorm)*smoothstep(0.,.2,d.y);
   cl=max(cl,ci);
  }
 }
 vec3 cc=hzSoft()*.55+vec3(.015,.02,.035)*uNight+uSunCol*uDay*(.18+.6*pow(sd,5.)+(1.-dn)*pow(sd,3.)*1.4);
 cc*=1.-.18*dn*uDay*(1.-uStorm);
 cc=cc*mix(1.,.45*(.55+.45*(1.-dn)),uStorm)+uFlash*vec3(.75,.82,1.)*(.4+dn);
 vec3 b=uSunCol*smoothstep(.99988,.99996,dot(d,uSun))*4.*uDay;
 if(d.y>0.&&uNight>.01){vec3 g=d*190.,q=floor(g);float h=h12(q.xy+q.z*37.7);
  vec3 jt=vec3(h12(q.yz+7.3),h12(q.zx+3.1),h12(q.xy+9.7))-.5;
  float dot2=1.-smoothstep(0.,.3,length(fract(g)-.5-jt*.5));
  b+=vec3(.9,.95,1.)*dot2*step(.992,h)*(.35+.65*fract(h*113.))*(.6+.4*sin(uTime*3.+h*80.))*uNight*smoothstep(0.,.12,d.y)*1.5;}
 float md=dot(d,uMoon);b+=vec3(.75,.85,1.)*(smoothstep(.9994,.99965,md)*2.+pow(max(md,0.),80.)*.12)*uNight;
 return mix(c,cc,cl)+b*(1.-cl);}
`,
  Zo = `
uniform sampler2D uIsl0,uIsl1,uIsl2,uIsl3;
uniform vec4 uIslB[4];
struct WaterWorld { vec4 land; vec4 water; };
void sampleWaterIsland(sampler2D landMap,vec4 b,vec2 p,inout WaterWorld w){
 if(b.w<.5)return;
 vec2 q=(p-b.xy)/b.z;
 if(max(abs(q.x),abs(q.y))>=.995)return;
 vec2 uv=q*.5+.5;
 w.land=textureLod(landMap,vec2(uv.x*.5,uv.y),0.);
 w.water=textureLod(landMap,vec2(uv.x*.5+.5,uv.y),0.);
}
WaterWorld waterWorld(vec2 p){
 WaterWorld w;w.land=vec4(-40.,300.,0.,0.);w.water=vec4(0.);
 sampleWaterIsland(uIsl0,uIslB[0],p,w);
 sampleWaterIsland(uIsl1,uIslB[1],p,w);
 sampleWaterIsland(uIsl2,uIslB[2],p,w);
 sampleWaterIsland(uIsl3,uIslB[3],p,w);
 return w;
}
float offshoreGate(float depth){return smoothstep(.18,2.2,depth);}
// Preserve the inland mask through the last bilinearly filtered shoreline
// texel. Its land neighbour stores fresh proximity in G instead of R; without
// this reconstruction ocean swell can leak into otherwise still riverbanks.
float inlandOf(WaterWorld w){
 float bank=smoothstep(30.,75.,-w.land.g)*step(.05,w.water.g);
 float inland=max(w.water.r,(w.water.r+w.water.g)*bank);
 return smoothstep(.25,.9,inland)*step(w.land.x,.3);
}
`,
  Bs = `
#define SURF_DCAP 8.0
#define SURF_G 9.81
vec2 swRot(vec2 d,float a){float c=cos(a),s=sin(a);return vec2(d.x*c-d.y*s,d.x*s+d.y*c);}
// three interfering trains travelling in the simulation's reference depth; returns (eta, ux, uz)
vec3 swellRef(vec2 p,float t){
 float cr=sqrt(SURF_G*SURF_DCAP);
 float T1=max(uShT,3.),T2=T1*.58,T3=T1*1.55;
 float w1=6.283185/T1,w2=6.283185/T2,w3=6.283185/T3;
 vec2 d1=uSwDir,d2=swRot(uSwDir,.42),d3=swRot(uSwDir,-.26);
 float A=uShH*.5;
 float ph1=w1*(dot(p,d1)/cr-t),ph2=w2*(dot(p,d2)/cr-t)+1.7,ph3=w3*(dot(p,d3)/cr-t)+4.1;
 float g1=.62+.38*sin(ph1/6.3+.5),g2=.6+.4*sin(ph2/4.7+2.);
 float e1=A*.72*g1*cos(ph1),e2=A*.26*g2*cos(ph2),e3=A*.28*cos(ph3);
 vec2 u=(e1*d1+e2*d2+e3*d3)*(cr/SURF_DCAP);
 return vec3(e1+e2+e3,u);
}
// far field (outside the simulated window): Green's law shoaling, capped at the breaking height
float swellFar(vec2 p,float t,float depth){
 if(depth<.15)return 0.;
 float e=swellRef(p,t).x;
 float shoal=pow(SURF_DCAP/clamp(depth,.6,SURF_DCAP),.25);
 float lim=.42*depth;
 return clamp(e*shoal,-lim*.8,lim)*smoothstep(.15,.6,depth);
}
float swellFarFoam(vec2 p,float t,float depth){
 if(depth<.15||depth>9.)return 0.;
 float e=swellRef(p,t).x*pow(SURF_DCAP/clamp(depth,.6,SURF_DCAP),.25);
 return smoothstep(.3,.5,e/max(depth,.2))*smoothstep(.15,.5,depth);
}
`,
  Dc = `
uniform sampler2D uSurfS,uSurfF,uSurfB;
uniform vec4 uSurfBox;
uniform float uSurfOn;
uniform vec2 uSwDir;
uniform float uShT,uShH;
${Bs}
float sh1(vec2 p){vec3 q=fract(vec3(p.xyx)*.1031);q+=dot(q,q.yzx+33.33);return fract((q.x+q.y)*q.z);}
float sn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(sh1(i),sh1(i+vec2(1,0)),f.x),mix(sh1(i+vec2(0,1)),sh1(i+vec2(1,1)),f.x),f.y);}
vec2 worley(vec2 p){vec2 i=floor(p),f=fract(p);float d1=9.,d2=9.;
 for(int y=-1;y<=1;y++)for(int x=-1;x<=1;x++){vec2 g=vec2(float(x),float(y));vec2 o=vec2(sh1(i+g),sh1(i+g+19.7));
  vec2 r=g+o-f;float d=dot(r,r);if(d<d1){d2=d1;d1=d;}else if(d<d2)d2=d;}
 return sqrt(vec2(d1,d2));}
vec2 surfUV(vec2 p){return ((p-uSurfBox.xy)/uSurfBox.z+.5)/uSurfBox.w;}
float surfMask(vec2 uv){vec2 e=min(uv,1.-uv);float m=min(e.x,e.y)*uSurfBox.w;return uSurfOn*smoothstep(28.,64.,m);}
vec4 cubicW(float v){vec4 n=vec4(1.,2.,3.,4.)-v;vec4 s=n*n*n;float x=s.x,y=s.y-4.*s.x,z=s.z-4.*s.y+6.*s.x,w=6.-x-y-z;return vec4(x,y,z,w)/6.;}
// smooth (B-spline) reconstruction of the simulation grid, 4 bilinear fetches
vec4 texCubic(sampler2D t,vec2 uv,float R){
 vec2 c=uv*R-.5;vec2 f=fract(c);c-=f;
 vec4 xc=cubicW(f.x),yc=cubicW(f.y);
 vec4 cc=c.xxyy+vec2(-.5,1.5).xyxy;
 vec4 ss=vec4(xc.xz+xc.yw,yc.xz+yc.yw);
 vec4 off=(cc+vec4(xc.yw,yc.yw)/ss)/R;
 vec4 s0=texture2D(t,off.xz),s1=texture2D(t,off.yz),s2=texture2D(t,off.xw),s3=texture2D(t,off.yw);
 float sx=ss.x/(ss.x+ss.y),sy=ss.z/(ss.z+ss.w);
 return mix(mix(s3,s2,sx),mix(s1,s0,sx),sy);}
// foam lace: dense whitewater breaks into a cellular web and specks as it thins
float foamLace(vec2 p,float dens,float scale){
 vec2 Fw=worley(p*scale);
 float web=1.-smoothstep(.0,.16+.3*dens,Fw.y-Fw.x);
 float speck=sn(p*2.4*scale/.35)*.6+sn(p*6.7*scale/.35)*.4;
 float lace=clamp(web*.85+speck*.3,0.,1.);
 return smoothstep(1.-dens,1.-dens+.22,lace)*smoothstep(.015,.1,dens);
}
struct SurfSample{float h;float eta;vec2 vel;float rho;float mask;float w;vec2 lean;};
SurfSample surfAt(vec2 p){
 SurfSample s;vec2 uv=surfUV(p);s.mask=surfMask(uv);
 s.h=0.;s.eta=0.;s.vel=vec2(0.);s.rho=0.;s.w=0.;s.lean=vec2(0.);
 if(s.mask<=0.)return s;
 vec4 S=textureLod(uSurfS,uv,0.);vec4 B=textureLod(uSurfB,uv,0.);
 s.h=S.r;s.eta=B.r+S.r;s.vel=S.gb;s.rho=S.a;
 float depth=max(-B.g,0.);
 s.w=s.mask*(1.-smoothstep(SURF_DCAP*1.25,SURF_DCAP*2.75,depth));
 if(s.rho>.03){
  float tx=1./uSurfBox.w;
  float eE=textureLod(uSurfS,uv+vec2(tx,0.),0.).r+textureLod(uSurfB,uv+vec2(tx,0.),0.).r;
  float eN=textureLod(uSurfS,uv+vec2(0.,tx),0.).r+textureLod(uSurfB,uv+vec2(0.,tx),0.).r;
  vec2 grad=vec2(eE-s.eta,eN-s.eta)/uSurfBox.z;
  float spd=length(s.vel);vec2 dir=s.vel/max(spd,1e-4);
  float st=-dot(grad,dir);
   float lean=min(s.rho,1.8)*smoothstep(.08,.34,st)*clamp(s.eta,0.,3.2)*.58;
   lean=min(lean,.55*max(depth,.3)+.25);
   s.lean=dir*lean;
 }
 return s;
}
`;
function Is(o, e, t, r) {
  let s =
    Math.imul(o, 2376512323) ^
    Math.imul(e, 3625334849) ^
    Math.imul(t, 3407524639) ^
    r;
  return (
    (s = Math.imul(s ^ (s >>> 15), 739982445)),
    (s = Math.imul(s ^ (s >>> 12), 695872825)),
    ((s ^ (s >>> 15)) >>> 0) / 4294967296
  );
}
function rn(o, e, t, r) {
  let s = Math.floor(o),
    c = Math.floor(e),
    a = Math.floor(t),
    n = o - s,
    i = e - c,
    m = t - a;
  ((n = n * n * (3 - 2 * n)),
    (i = i * i * (3 - 2 * i)),
    (m = m * m * (3 - 2 * m)));
  let h = (u, d, p) => u + (d - u) * p,
    l = (u, d, p) => Is(s + u, c + d, a + p, r);
  return h(
    h(h(l(0, 0, 0), l(1, 0, 0), n), h(l(0, 1, 0), l(1, 1, 0), n), i),
    h(h(l(0, 0, 1), l(1, 0, 1), n), h(l(0, 1, 1), l(1, 1, 1), n), i),
    m,
  );
}
function nn(o, e, t, r, s) {
  let c = 0.5,
    a = 0,
    n = 0;
  for (let i = 0; i < s; i++)
    ((a += c * rn(o, e, t, r + i * 101)),
      (n += c),
      (c *= 0.5),
      (o = o * 2.03 + 7.1),
      (e = e * 2.03 + 3.7),
      (t = t * 2.03 + 5.3));
  return a / n;
}
var Co = {
  boulder: {
    sx: 1,
    sy: 0.74,
    sz: 0.88,
    cuts: 5,
    hard: 0.55,
    rough: 0.16,
    grit: 0.035,
  },
  block: {
    sx: 1,
    sy: 0.8,
    sz: 0.82,
    cuts: 9,
    hard: 0.92,
    rough: 0.07,
    grit: 0.025,
  },
  slab: {
    sx: 1.25,
    sy: 0.42,
    sz: 0.95,
    cuts: 7,
    hard: 0.85,
    rough: 0.08,
    grit: 0.03,
  },
  cobble: {
    sx: 1,
    sy: 0.56,
    sz: 0.8,
    cuts: 2,
    hard: 0.4,
    rough: 0.12,
    grit: 0.02,
  },
};
function Do(o, e, t) {
  let r = Ie(o),
    s = [];
  for (let f = 0; f < e.cuts; f++) {
    let v = r() * 1.7 - 0.7,
      b = r() * Math.PI * 2,
      g = Math.sqrt(1 - Math.min(v * v, 1)),
      M = g * Math.cos(b),
      w = v,
      E = g * Math.sin(b),
      k = Math.sqrt((e.sx * M) ** 2 + (e.sy * w) ** 2 + (e.sz * E) ** 2);
    s.push([M, w, E, k * (0.6 + r() * 0.3)]);
  }
  let c = (o * 7919) | 0,
    a = new ht.IcosahedronGeometry(1, t);
  (a.deleteAttribute("normal"), a.deleteAttribute("uv"));
  let n = cr(a);
  a.dispose();
  let i = n.getAttribute("position"),
    m = i.count,
    h = new Float32Array(m * 3),
    l = 1e9,
    u = -1e9,
    d = 0;
  for (let f = 0; f < m; f++) {
    let v = i.getX(f),
      b = i.getY(f),
      g = i.getZ(f),
      M = 1 + e.rough * (nn(v * 1.5 + 3.1, b * 1.5, g * 1.5, c, 3) - 0.5) * 2;
    ((v *= M * e.sx), (b *= M * e.sy), (g *= M * e.sz));
    for (let H of s) {
      let C = v * H[0] + b * H[1] + g * H[2] - H[3];
      C > 0 &&
        ((v -= H[0] * C * e.hard),
        (b -= H[1] * C * e.hard),
        (g -= H[2] * C * e.hard));
    }
    let w = Math.hypot(v, b, g) || 1,
      E = 1 + e.grit * (nn(v * 5.2, b * 5.2, g * 5.2, c + 17, 2) - 0.5) * 2;
    ((v *= E),
      (b *= E),
      (g *= E),
      b < -0.3 * e.sy && (b = -0.3 * e.sy + (b + 0.3 * e.sy) * 0.35),
      i.setXYZ(f, v, b, g),
      (l = Math.min(l, b)),
      (u = Math.max(u, b)),
      (d = Math.max(d, Math.hypot(v, g))));
    let k =
        (0.82 + 0.3 * nn(v * 2.1, b * 2.1, g * 2.1, c + 5, 2)) *
        (0.78 + 0.22 * Math.min(1, Math.max(0, b / (e.sy * 0.6) + 0.5))),
      R = 0.96 + 0.08 * rn(v * 1.3, b * 1.3, g * 1.3, c + 9);
    ((h[f * 3] = k * R),
      (h[f * 3 + 1] = k),
      (h[f * 3 + 2] = k * (2 - R) * 0.97));
  }
  let p = u - l,
    x = 1 / (d * 2 || 1);
  for (let f = 0; f < m; f++)
    i.setXYZ(f, i.getX(f) * x, (i.getY(f) - l - 0.3 * p) * x, i.getZ(f) * x);
  return (
    n.setAttribute("color", new ht.BufferAttribute(h, 3)),
    n.computeVertexNormals(),
    n.computeBoundingSphere(),
    n
  );
}
function ur(o) {
  let e = Ie(o),
    t = [],
    r = [],
    s = [],
    c = [],
    a = (p, x, f, v) => {
      let b = -1,
        g = new ht.Vector3(),
        M = new ht.Vector3(),
        w = new ht.Vector3();
      for (let E = 0; E < p.length; E++) {
        (g
          .subVectors(p[Math.min(E + 1, p.length - 1)], p[Math.max(E - 1, 0)])
          .normalize(),
          M.set(0, 1, 0).cross(g),
          M.lengthSq() < 1e-6 && M.set(1, 0, 0),
          M.normalize(),
          w.crossVectors(g, M).normalize());
        let k = t.length / 3;
        for (let R = 0; R <= f; R++) {
          let H = (R / f) * Math.PI * 2,
            C =
              1 +
              0.12 * Math.sin(H * 3 + E * 1.7 + o) +
              0.06 * Math.sin(H * 7 + E * 0.9),
            W = M.x * Math.cos(H) + w.x * Math.sin(H),
            T = M.y * Math.cos(H) + w.y * Math.sin(H),
            P = M.z * Math.cos(H) + w.z * Math.sin(H),
            L = x[E] * C;
          (t.push(p[E].x + W * L, p[E].y + T * L, p[E].z + P * L),
            r.push(W, T, P));
          let z =
            v *
            (0.86 + 0.14 * Math.sin(H * 5 + E * 2.3)) *
            (E === 0 || E === p.length - 1 ? 0.8 : 1);
          s.push(z, z * 0.97, z * 0.92);
        }
        if (b >= 0)
          for (let R = 0; R < f; R++)
            c.push(b + R, k + R, b + R + 1, b + R + 1, k + R, k + R + 1);
        b = k;
      }
    },
    n = 3.2 + e() * 1.6,
    i = 0.16 + e() * 0.09,
    m = [],
    h = [],
    l = 9;
  for (let p = 0; p <= l; p++) {
    let x = p / l;
    (m.push(
      new ht.Vector3(
        -n / 2 + n * x,
        i * 0.75 + Math.sin(x * 5 + o) * 0.05,
        Math.sin(x * 3.3 + o * 0.7) * 0.22,
      ),
    ),
      h.push(i * (1 - 0.55 * x) * (1 + 0.9 * Math.pow(1 - x, 8))));
  }
  a(m, h, 9, 1);
  let u = 2 + ((e() * 2) | 0);
  for (let p = 0; p < u; p++) {
    let x = 0.3 + e() * 0.55,
      f = m[Math.round(x * l)],
      v = (e() < 0.5 ? 1 : -1) * (0.5 + e() * 0.6),
      b = 0.5 + e() * 0.9,
      g = new ht.Vector3(
        f.x + Math.cos(v) * b * 0.6,
        f.y + 0.1 + e() * 0.25,
        f.z + Math.sin(v) * b,
      );
    a(
      [f.clone(), f.clone().lerp(g, 0.5), g],
      [i * 0.45, i * 0.3, i * 0.14],
      6,
      0.95,
    );
  }
  let d = new ht.BufferGeometry();
  return (
    d.setAttribute("position", new ht.Float32BufferAttribute(t, 3)),
    d.setAttribute("normal", new ht.Float32BufferAttribute(r, 3)),
    d.setAttribute("color", new ht.Float32BufferAttribute(s, 3)),
    d.setIndex(c),
    d.computeBoundingSphere(),
    d
  );
}
function hr(o) {
  let e = new ht.IcosahedronGeometry(1, 2);
  (e.deleteAttribute("normal"), e.deleteAttribute("uv"));
  let t = cr(e);
  e.dispose();
  let r = t.getAttribute("position"),
    s = new Float32Array(r.count * 3);
  for (let c = 0; c < r.count; c++) {
    let a = r.getX(c),
      n = r.getY(c),
      i = r.getZ(c),
      m = 1 + 0.06 * Math.cos(Math.atan2(i, n) * 3) * (1 - Math.abs(a)),
      h = a > 0 ? 1 + 0.18 * a * a : 1;
    ((a *= 0.15 * h),
      (n *= 0.125 * m),
      (i *= 0.13 * m),
      r.setXYZ(c, a, n + 0.1, i));
    let l = 0.85 + 0.25 * rn(a * 30, n * 30, i * 30, o);
    ((s[c * 3] = l), (s[c * 3 + 1] = l), (s[c * 3 + 2] = l));
  }
  return (
    t.setAttribute("color", new ht.BufferAttribute(s, 3)),
    t.computeVertexNormals(),
    t.computeBoundingSphere(),
    t
  );
}
export { Co, Do, Zo, ft, hr, ir, lr, ur };
