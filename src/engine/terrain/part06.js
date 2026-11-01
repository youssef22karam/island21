// terrain.worker.js - part 6/9 (statements 44-58 of the original module).
import { mergeVertices as An } from "three/addons/utils/BufferGeometryUtils.js";
import * as Ut from "three";
import * as qt from "three";
import { At } from "./part01.js";
import { Un, zn } from "./part05.js";

function je(o, n, e, r) {
  let a = Math.floor(o),
    f = Math.floor(n),
    t = Math.floor(e),
    l = o - a,
    c = n - f,
    p = e - t;
  ((l = l * l * (3 - 2 * l)),
    (c = c * c * (3 - 2 * c)),
    (p = p * p * (3 - 2 * p)));
  let h = (x, M, g) => x + (M - x) * g,
    i = (x, M, g) => Un(a + x, f + M, t + g, r);
  return h(
    h(h(i(0, 0, 0), i(1, 0, 0), l), h(i(0, 1, 0), i(1, 1, 0), l), c),
    h(h(i(0, 0, 1), i(1, 0, 1), l), h(i(0, 1, 1), i(1, 1, 1), l), c),
    p,
  );
}
function Ue(o, n, e, r, a) {
  let f = 0.5,
    t = 0,
    l = 0;
  for (let c = 0; c < a; c++)
    ((t += f * je(o, n, e, r + c * 101)),
      (l += f),
      (f *= 0.5),
      (o = o * 2.03 + 7.1),
      (n = n * 2.03 + 3.7),
      (e = e * 2.03 + 5.3));
  return t / l;
}
var de = {
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
function xe(o, n, e) {
  let r = At(o),
    a = [];
  for (let y = 0; y < n.cuts; y++) {
    let b = r() * 1.7 - 0.7,
      v = r() * Math.PI * 2,
      A = Math.sqrt(1 - Math.min(b * b, 1)),
      E = A * Math.cos(v),
      H = b,
      R = A * Math.sin(v),
      D = Math.sqrt((n.sx * E) ** 2 + (n.sy * H) ** 2 + (n.sz * R) ** 2);
    a.push([E, H, R, D * (0.6 + r() * 0.3)]);
  }
  let f = (o * 7919) | 0,
    t = new qt.IcosahedronGeometry(1, e);
  (t.deleteAttribute("normal"), t.deleteAttribute("uv"));
  let l = An(t);
  t.dispose();
  let c = l.getAttribute("position"),
    p = c.count,
    h = new Float32Array(p * 3),
    i = 1e9,
    x = -1e9,
    M = 0;
  for (let y = 0; y < p; y++) {
    let b = c.getX(y),
      v = c.getY(y),
      A = c.getZ(y),
      E = 1 + n.rough * (Ue(b * 1.5 + 3.1, v * 1.5, A * 1.5, f, 3) - 0.5) * 2;
    ((b *= E * n.sx), (v *= E * n.sy), (A *= E * n.sz));
    for (let T of a) {
      let I = b * T[0] + v * T[1] + A * T[2] - T[3];
      I > 0 &&
        ((b -= T[0] * I * n.hard),
        (v -= T[1] * I * n.hard),
        (A -= T[2] * I * n.hard));
    }
    let H = Math.hypot(b, v, A) || 1,
      R = 1 + n.grit * (Ue(b * 5.2, v * 5.2, A * 5.2, f + 17, 2) - 0.5) * 2;
    ((b *= R),
      (v *= R),
      (A *= R),
      v < -0.3 * n.sy && (v = -0.3 * n.sy + (v + 0.3 * n.sy) * 0.35),
      c.setXYZ(y, b, v, A),
      (i = Math.min(i, v)),
      (x = Math.max(x, v)),
      (M = Math.max(M, Math.hypot(b, A))));
    let D =
        (0.82 + 0.3 * Ue(b * 2.1, v * 2.1, A * 2.1, f + 5, 2)) *
        (0.78 + 0.22 * Math.min(1, Math.max(0, v / (n.sy * 0.6) + 0.5))),
      z = 0.96 + 0.08 * je(b * 1.3, v * 1.3, A * 1.3, f + 9);
    ((h[y * 3] = D * z),
      (h[y * 3 + 1] = D),
      (h[y * 3 + 2] = D * (2 - z) * 0.97));
  }
  let g = x - i,
    w = 1 / (M * 2 || 1);
  for (let y = 0; y < p; y++)
    c.setXYZ(y, c.getX(y) * w, (c.getY(y) - i - 0.3 * g) * w, c.getZ(y) * w);
  return (
    l.setAttribute("color", new qt.BufferAttribute(h, 3)),
    l.computeVertexNormals(),
    l.computeBoundingSphere(),
    l
  );
}
function Sn(o) {
  let n = At(o),
    e = [],
    r = [],
    a = [],
    f = [],
    t = (g, w, y, b) => {
      let v = -1,
        A = new qt.Vector3(),
        E = new qt.Vector3(),
        H = new qt.Vector3();
      for (let R = 0; R < g.length; R++) {
        (A.subVectors(
          g[Math.min(R + 1, g.length - 1)],
          g[Math.max(R - 1, 0)],
        ).normalize(),
          E.set(0, 1, 0).cross(A),
          E.lengthSq() < 1e-6 && E.set(1, 0, 0),
          E.normalize(),
          H.crossVectors(A, E).normalize());
        let D = e.length / 3;
        for (let z = 0; z <= y; z++) {
          let T = (z / y) * Math.PI * 2,
            I =
              1 +
              0.12 * Math.sin(T * 3 + R * 1.7 + o) +
              0.06 * Math.sin(T * 7 + R * 0.9),
            B = E.x * Math.cos(T) + H.x * Math.sin(T),
            W = E.y * Math.cos(T) + H.y * Math.sin(T),
            G = E.z * Math.cos(T) + H.z * Math.sin(T),
            O = w[R] * I;
          (e.push(g[R].x + B * O, g[R].y + W * O, g[R].z + G * O),
            r.push(B, W, G));
          let S =
            b *
            (0.86 + 0.14 * Math.sin(T * 5 + R * 2.3)) *
            (R === 0 || R === g.length - 1 ? 0.8 : 1);
          a.push(S, S * 0.97, S * 0.92);
        }
        if (v >= 0)
          for (let z = 0; z < y; z++)
            f.push(v + z, D + z, v + z + 1, v + z + 1, D + z, D + z + 1);
        v = D;
      }
    },
    l = 3.2 + n() * 1.6,
    c = 0.16 + n() * 0.09,
    p = [],
    h = [],
    i = 9;
  for (let g = 0; g <= i; g++) {
    let w = g / i;
    (p.push(
      new qt.Vector3(
        -l / 2 + l * w,
        c * 0.75 + Math.sin(w * 5 + o) * 0.05,
        Math.sin(w * 3.3 + o * 0.7) * 0.22,
      ),
    ),
      h.push(c * (1 - 0.55 * w) * (1 + 0.9 * Math.pow(1 - w, 8))));
  }
  t(p, h, 9, 1);
  let x = 2 + ((n() * 2) | 0);
  for (let g = 0; g < x; g++) {
    let w = 0.3 + n() * 0.55,
      y = p[Math.round(w * i)],
      b = (n() < 0.5 ? 1 : -1) * (0.5 + n() * 0.6),
      v = 0.5 + n() * 0.9,
      A = new qt.Vector3(
        y.x + Math.cos(b) * v * 0.6,
        y.y + 0.1 + n() * 0.25,
        y.z + Math.sin(b) * v,
      );
    t(
      [y.clone(), y.clone().lerp(A, 0.5), A],
      [c * 0.45, c * 0.3, c * 0.14],
      6,
      0.95,
    );
  }
  let M = new qt.BufferGeometry();
  return (
    M.setAttribute("position", new qt.Float32BufferAttribute(e, 3)),
    M.setAttribute("normal", new qt.Float32BufferAttribute(r, 3)),
    M.setAttribute("color", new qt.Float32BufferAttribute(a, 3)),
    M.setIndex(f),
    M.computeBoundingSphere(),
    M
  );
}
function Rn(o) {
  let n = new qt.IcosahedronGeometry(1, 2);
  (n.deleteAttribute("normal"), n.deleteAttribute("uv"));
  let e = An(n);
  n.dispose();
  let r = e.getAttribute("position"),
    a = new Float32Array(r.count * 3);
  for (let f = 0; f < r.count; f++) {
    let t = r.getX(f),
      l = r.getY(f),
      c = r.getZ(f),
      p = 1 + 0.06 * Math.cos(Math.atan2(c, l) * 3) * (1 - Math.abs(t)),
      h = t > 0 ? 1 + 0.18 * t * t : 1;
    ((t *= 0.15 * h),
      (l *= 0.125 * p),
      (c *= 0.13 * p),
      r.setXYZ(f, t, l + 0.1, c));
    let i = 0.85 + 0.25 * je(t * 30, l * 30, c * 30, o);
    ((a[f * 3] = i), (a[f * 3 + 1] = i), (a[f * 3 + 2] = i));
  }
  return (
    e.setAttribute("color", new qt.BufferAttribute(a, 3)),
    e.computeVertexNormals(),
    e.computeBoundingSphere(),
    e
  );
}
var Q0 =
  zn +
  `
uniform float uFog,uKind,uShH;
varying vec3 vW,vN,vO,vC;
varying float vBase,vScale;
float n3(vec3 p){
 vec3 i=floor(p),f=p-i;f=f*f*(3.-2.*f);
 float k=i.z*37.17,k1=k+37.17;
 float a=mix(mix(h12(i.xy+k),h12(i.xy+vec2(1.,0.)+k),f.x),mix(h12(i.xy+vec2(0.,1.)+k),h12(i.xy+vec2(1.,1.)+k),f.x),f.y);
 float b=mix(mix(h12(i.xy+k1),h12(i.xy+vec2(1.,0.)+k1),f.x),mix(h12(i.xy+vec2(0.,1.)+k1),h12(i.xy+vec2(1.,1.)+k1),f.x),f.y);
 return mix(a,b,f.z);
}
void main(){
 vec3 V=cameraPosition-vW;float dist=length(V);V/=max(dist,.001);
 vec3 N=normalize(vN);
 float px=length(fwidth(vW));
 float d1=1.-smoothstep(.04,.18,px),d2=1.-smoothstep(.012,.05,px);
 vec3 o=vO;
 float big=n3(o*.9),mid=n3(o*3.1);
 float fineN=d1>.01?mix(.5,n3(o*11.),d1):.5;
 float grit=d2>.01?mix(.5,n3(o*37.),d2):.5;
 vec3 alb=vC;
 float wetL=0.,lift=vW.y-vBase;
 if(uKind<.5){
  alb*=(.72+.5*big)*(.86+.28*mid)*(.9+.2*fineN);
  // mineral speckles: dark mafic grains and pale feldspar
  alb=mix(alb,alb*.45,smoothstep(.68,.8,grit)*.7*d2);
  alb=mix(alb,min(alb*1.55,vec3(.7)),smoothstep(.3,.18,grit)*.45*d2);
  // weathering cracks
  float crack=1.-smoothstep(0.,.03+px*.4,abs(mid-.5));
  alb*=1.-.38*crack*d1;
  // lichen and moss on the tops of rocks out of the salt spray
  float up=smoothstep(.45,.9,N.y),inland=smoothstep(3.,8.,vW.y);
  float lich=up*smoothstep(.5,.68,big*.6+fineN*.4)*inland;
  alb=mix(alb,mix(vec3(.30,.31,.20),vec3(.10,.16,.05),step(.5,mid)),lich*.7);
  // wet band, then green algae and barnacles at sea level
  wetL=1.-smoothstep(.3,1.4+.3*uShH,vW.y);
  alb*=1.-.45*wetL;
  float algae=(1.-smoothstep(-.1,.55,vW.y))*smoothstep(-2.,-.3,vW.y);
  alb=mix(alb,vec3(.06,.10,.045),algae*.6);
  // drifted sand against the foot (beach) or soil (inland)
  float foot=1.-smoothstep(0.,(.1+.12*mid)*vScale+.03,lift);
  vec3 fill=mix(vec3(.48,.41,.30),vec3(.16,.13,.08),smoothstep(10.,20.,vW.y));
  alb=mix(alb,fill,foot*.8*up+foot*.35);
  N=normalize(N+(vec3(n3(o*6.),n3(o*6.+3.1),n3(o*6.+7.7))-.5)*.55*d1);
 }else if(uKind<1.5){
  // sun-bleached wood: silvery grain along the log, dark splits
  float gr=n3(o*vec3(.35,7.,7.))*.6+n3(o*vec3(1.2,22.,22.))*.4;
  alb*=.74+.42*gr;
  float split=1.-smoothstep(0.,.05+px*.5,abs(n3(o*vec3(.45,9.,9.))-.5));
  alb*=1.-.45*split*d1;
  wetL=(1.-smoothstep(.3,1.2+.3*uShH,vW.y))*.6;
  alb*=1.-.35*wetL;
 }else{
  alb*=.82+.3*n3(o*14.);
 }
 float nl=dot(N,uSun),dif=max(nl,0.);
 float ao=mix(.5,1.,smoothstep(0.,.32*vScale+.05,lift));
 vec3 amb=hzSoft()*(.26+.2*N.y)*uLight*ao+vec3(.02,.03,.05)*uNight;
 // warm bounce light from the sunlit ground below
 vec3 bounce=vec3(.5,.42,.3)*uSunCol*max(uSun.y,0.)*.07*clamp(.55-.45*N.y,0.,1.)*ao;
 vec3 col=alb*(uSunCol*dif*.62+amb+bounce+vec3(.08,.11,.17)*uNight*max(dot(N,uMoon),0.));
 vec3 R=reflect(-V,N);
 col+=uSunCol*pow(max(dot(R,uSun),0.),24.+90.*wetL)*(.025+.3*wetL)*step(0.,nl);
 col+=sky(vec3(R.x,abs(R.y),R.z))*.14*wetL*pow(1.-max(dot(N,V),0.),3.);
 float fg=1.-exp(-dist*uFog*1.1);col=mix(col,horizon(),fg);
 gl_FragColor=vec4(col,1.);
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
}`;
var rt = Ut.Vector3,
  En = (o) => Math.min(1, Math.max(0, o)),
  lt = (o, n, e) => new Ut.Color(o, n, e),
  Ot = class {
    pos = [];
    nor = [];
    uv = [];
    col = [];
    sway = [];
    card = [];
    idx = [];
    n = 0;
    v(n, e, r, a, f, t, l, c, p, h, i = 0, x = 0, M = 0) {
      return (
        this.pos.push(n, e, r),
        this.nor.push(a, f, t),
        this.uv.push(l, c),
        this.col.push(p.r, p.g, p.b),
        this.sway.push(h),
        this.card.push(i, x, M),
        this.n++
      );
    }
    quad(n, e, r, a) {
      this.idx.push(n, e, r, n, r, a);
    }
    plane(n, e, r, a, f, t, l, c, p, h, i) {
      let x = Math.cos(t),
        M = Math.sin(t),
        g = Math.cos(l),
        w = Math.sin(l),
        y = x * a * 0.5,
        b = M * a * 0.5,
        v = g * f,
        A = -M * w * f,
        E = x * w * f,
        H = i ? i.x : -M * g,
        R = i ? i.y : w,
        D = i ? i.z : x * g,
        z = this.v(n - y, e, r - b, H, R, D, 0, 0, c, p),
        T = this.v(n + y, e, r + b, H, R, D, 1, 0, c, p),
        I = this.v(n + y + A, e + v, r + b + E, H, R, D, 1, 1, c, h),
        B = this.v(n - y + A, e + v, r - b + E, H, R, D, 0, 1, c, h);
      this.quad(z, T, I, B);
    }
    leafCard(n, e, r, a, f, t, l, c) {
      let p = Math.cos(f),
        h = Math.sin(f),
        i = [];
      for (let [x, M, g, w] of [
        [-0.5, -0.5, 0, 0],
        [0.5, -0.5, 1, 0],
        [0.5, 0.5, 1, 1],
        [-0.5, 0.5, 0, 1],
      ])
        i.push(
          this.v(
            n,
            e,
            r,
            t.x,
            t.y,
            t.z,
            g,
            w,
            l,
            c,
            x * p - M * h,
            x * h + M * p,
            a,
          ),
        );
      this.quad(i[0], i[1], i[2], i[3]);
    }
    tube(n, e, r, a, f) {
      let t = null;
      for (let l = 0; l < n.length; l++) {
        let c = l / (n.length - 1),
          p = new rt()
            .subVectors(n[Math.min(l + 1, n.length - 1)], n[Math.max(l - 1, 0)])
            .normalize();
        p.lengthSq() < 1e-6 && p.set(0, 1, 0);
        let h = new rt(1, 0, 0).cross(p).normalize();
        h.lengthSq() < 1e-6 && h.set(1, 0, 0);
        let i = new rt().crossVectors(h, p).normalize(),
          x = [],
          M = a(c),
          g = f(c);
        for (let w = 0; w <= r; w++) {
          let y = (w / r) * Math.PI * 2,
            b = h.x * Math.cos(y) + i.x * Math.sin(y),
            v = h.y * Math.cos(y) + i.y * Math.sin(y),
            A = h.z * Math.cos(y) + i.z * Math.sin(y);
          x.push(
            this.v(
              n[l].x + b * e[l],
              n[l].y + v * e[l],
              n[l].z + A * e[l],
              b,
              v,
              A,
              2 + w / r,
              c,
              M,
              g,
            ),
          );
        }
        if (t)
          for (let w = 0; w < r; w++) this.quad(t[w], t[w + 1], x[w + 1], x[w]);
        t = x;
      }
    }
    frond(n, e, r, a, f, t, l, c, p, h = 0.16, i = 0) {
      let x = Math.cos(e),
        M = Math.sin(e),
        g = -M,
        w = x,
        y = n.clone(),
        b = r / l,
        v = [],
        A = new rt(0, 1, 0);
      for (let E = 0; E <= l; E++) {
        let H = E / l,
          R = f - t * Math.pow(H, 1.7),
          D = Math.cos(R),
          z = Math.sin(R),
          T = D * x,
          I = z,
          B = D * M,
          W = -w * I,
          G = w * T - g * B,
          O = g * I,
          S = Math.hypot(W, G, O) || 1;
        ((W /= S), (G /= S), (O /= S));
        let L = i * H,
          Z = g * Math.cos(L) + W * Math.sin(L),
          q = G * Math.sin(L),
          K = w * Math.cos(L) + O * Math.sin(L),
          V = a * 0.5,
          Y = h * V,
          J = W * 0.55 + A.x * 0.45,
          tt = G * 0.55 + 0.45,
          ct = O * 0.55 + A.z * 0.45,
          st = p * H * H,
          nt = c.clone().multiplyScalar(0.62 + 0.38 * Math.min(1, H * 1.4)),
          pt = this.v(
            y.x - Z * V + W * Y,
            y.y - q * V + G * Y,
            y.z - K * V + O * Y,
            J,
            tt,
            ct,
            0,
            H,
            nt,
            st,
          ),
          ft = this.v(y.x, y.y, y.z, J, tt, ct, 0.5, H, nt, st),
          dt = this.v(
            y.x + Z * V + W * Y,
            y.y + q * V + G * Y,
            y.z + K * V + O * Y,
            J,
            tt,
            ct,
            1,
            H,
            nt,
            st,
          );
        (v.push([pt, ft, dt]), (y.x += T * b), (y.y += I * b), (y.z += B * b));
      }
      for (let E = 0; E < l; E++) {
        let H = v[E],
          R = v[E + 1];
        (this.quad(H[0], H[1], R[1], R[0]), this.quad(H[1], H[2], R[2], R[1]));
      }
    }
    blob(n, e, r, a, f, t, l, c, p) {
      let h = new Ut.IcosahedronGeometry(1, t),
        i = h.getAttribute("position"),
        x = p * 0.37,
        M = this.n,
        g = (w, y, b) =>
          1 +
          l *
            (Math.sin(w * 2.9 + x) * Math.cos(y * 2.3 + x * 1.7) +
              0.6 *
                Math.sin(b * 4.1 + w * 3.3 + x * 0.6) *
                Math.cos(y * 3.7 - b * 2.1) +
              0.35 * Math.sin(w * 7.3 + b * 6.1 + x));
      for (let w = 0; w < i.count; w++) {
        let y = i.getX(w),
          b = i.getY(w),
          v = i.getZ(w),
          A = g(y, b, v);
        this.v(
          n + y * a * A,
          e + b * f * A,
          r + v * a * A,
          y,
          b,
          v,
          2,
          0.5,
          c(b, (b + 1) * 0.5),
          0,
        );
      }
      for (let w = 0; w < i.count; w += 3)
        this.idx.push(M + w, M + w + 1, M + w + 2);
      h.dispose();
    }
    build() {
      let n = new Ut.BufferGeometry();
      (n.setAttribute("position", new Ut.Float32BufferAttribute(this.pos, 3)),
        n.setAttribute("normal", new Ut.Float32BufferAttribute(this.nor, 3)),
        n.setAttribute("uv", new Ut.Float32BufferAttribute(this.uv, 2)),
        n.setAttribute("color", new Ut.Float32BufferAttribute(this.col, 3)),
        n.setAttribute("asway", new Ut.Float32BufferAttribute(this.sway, 1)),
        n.setAttribute("acard", new Ut.Float32BufferAttribute(this.card, 3)),
        n.setIndex(this.idx),
        n.computeBoundingSphere());
      let e = 0;
      for (let r = 2; r < this.card.length; r += 3)
        e = Math.max(e, this.card[r]);
      return (n.boundingSphere && (n.boundingSphere.radius += e * 0.71), n);
    }
  };
function Ae(o, n, e, r, a, f, t, l, c, p, h, i) {
  let x = new rt(),
    M = new rt(),
    g = new rt(),
    w = new rt();
  for (let y of e)
    for (let b = 0; b < f; b++) {
      let v = n() * 2 - 1,
        A = n() * Math.PI * 2,
        E = Math.sqrt(1 - v * v);
      x.set(E * Math.cos(A), v * 0.85, E * Math.sin(A)).normalize();
      let H = y.r * (0.5 + 0.5 * Math.sqrt(n()));
      (w.copy(y.c).addScaledVector(x, H),
        g.subVectors(w, r).normalize(),
        M.copy(x)
          .multiplyScalar(0.55)
          .addScaledVector(g, 0.45)
          .add(new rt(0, 0.22, 0))
          .normalize());
      let R = y.r * h * (0.85 + 0.35 * n()),
        D = n() * Math.PI * 2,
        z = En((w.y - (r.y - a)) / (2 * a)),
        T = En(0.18 + 0.5 * z + 0.32 * (H / y.r) + (n() - 0.5) * 0.22),
        I = c
          .clone()
          .lerp(p, T)
          .multiplyScalar(0.6 + 0.4 * T);
      (!l || b % t === 0) &&
        o.leafCard(
          w.x,
          w.y,
          w.z,
          l ? R * Math.sqrt(t) * 0.92 : R,
          D,
          M,
          I,
          i * (0.6 + 0.4 * z),
        );
    }
}
function Tn(o, n) {
  let e = At(o),
    r = new Ot(),
    a = (o & 1) === 0,
    f = a ? 14.5 + e() * 7.5 : 9.2 + e() * 5.5,
    t = e() * Math.PI * 2,
    l = (e() - 0.5) * 0.06 * f,
    c = Math.cos(t) * l,
    p = Math.sin(t) * l,
    h = a ? f * 0.026 : f * 0.034,
    i = n ? 4 : 9,
    x = [],
    M = [];
  for (let v = 0; v <= i; v++) {
    let A = v / i;
    x.push(new rt(c * A * A, -0.55 + (f + 0.55) * A, p * A * A));
    let E = 1 + (a ? 1.45 : 1.75) * Math.pow(1 - A, 5);
    M.push(h * (1 - 0.48 * A) * E);
  }
  let g = (v) => lt(0.22, 0.25, 0.16).lerp(lt(0.32, 0.35, 0.22), v);
  r.tube(x, M, n ? 5 : 8, g, (v) => v * v * 0.014);
  let w = 20,
    y = f * (a ? 0.22 : 0.28);
  for (let v = 0; v < w; v++) {
    let A = (v / w) * Math.PI * 2 + (e() - 0.5) * 0.28,
      E = h * (2.6 + e() * 2.1),
      H = y * (0.65 + e() * 0.45),
      R = E * (0.58 + e() * 0.18);
    (!n || v % 3 === 0) &&
      r.tube(
        [
          new rt(Math.cos(A) * h * 0.85, H, Math.sin(A) * h * 0.85),
          new rt(Math.cos(A + 0.08) * R, H * 0.45, Math.sin(A + 0.08) * R),
          new rt(Math.cos(A) * E, -0.55, Math.sin(A) * E),
        ],
        [0.045, 0.055, 0.03],
        n ? 3 : 4,
        (D) => lt(0.14, 0.13, 0.1).lerp(lt(0.08, 0.08, 0.06), D),
        () => 0,
      );
  }
  let b = x[i];
  if (a) {
    let A = f * (0.25 + e() * 0.05),
      E = A * 0.48;
    for (let R = 0; R < 6; R++) {
      let D = (R / 6) * Math.PI * 2 + e() * 0.45,
        z = A * (0.62 + e() * 0.25),
        T = b.x + Math.cos(D) * z,
        I = b.z + Math.sin(D) * z,
        B = b.y + E * (0.35 + e() * 0.25);
      n ||
        r.tube(
          [
            new rt(b.x, b.y - 0.4, b.z),
            new rt(
              b.x + Math.cos(D) * z * 0.5,
              b.y + E * 0.25,
              b.z + Math.sin(D) * z * 0.5,
            ),
            new rt(T, B, I),
          ],
          [h * 0.48, h * 0.3, h * 0.14],
          5,
          g,
          (W) => 0.01 + W * 0.015,
        );
      for (let W = 0; W < 3; W++) {
        let G = D + (W - 1) * 0.48 + (e() - 0.5) * 0.2,
          O = f * (0.18 + e() * 0.07),
          S = lt(0.68, 0.86, 0.42).lerp(lt(0.92, 1.02, 0.58), e());
        r.frond(
          new rt(T * 0.65 + b.x * 0.35, B - 0.15, I * 0.65 + b.z * 0.35),
          G,
          O,
          O * 0.46,
          0.45 + e() * 0.35,
          1.05 + e() * 0.45,
          n ? 3 : 6,
          S,
          0.05,
          0.16,
        );
      }
    }
    let H = 8;
    for (let R = 0; R < H; R++) {
      let D = (R / H) * Math.PI * 2 + e() * 0.3,
        z = f * (0.21 + e() * 0.06),
        T = lt(0.58, 0.78, 0.36).lerp(lt(0.84, 0.96, 0.52), e());
      r.frond(
        new rt(b.x, b.y - 0.3, b.z),
        D,
        z,
        z * 0.42,
        0.75 + e() * 0.25,
        1.35 + e() * 0.35,
        n ? 3 : 6,
        T,
        0.055,
        0.15,
      );
    }
  } else
    for (let A = 0; A < 20; A++) {
      let E = A / 20,
        H = E * Math.PI * 2 * 2.39996 + (e() - 0.5) * 0.18,
        R = E < 0.35 ? 0 : E < 0.75 ? 1 : 2,
        D =
          R === 0
            ? 1.05 + e() * 0.2
            : R === 1
              ? 0.55 + e() * 0.25
              : -0.05 + e() * 0.25,
        z =
          R === 0
            ? 0.75 + e() * 0.3
            : R === 1
              ? 1.15 + e() * 0.35
              : 1.35 + e() * 0.35,
        T = f * (R === 1 ? 0.38 : 0.31) * (0.88 + e() * 0.24),
        I = lt(0.68, 0.88, 0.42).lerp(
          lt(0.96, 1.08, 0.62),
          1 - R * 0.28 + (e() - 0.5) * 0.2,
        ),
        B = (e() - 0.5) * 0.35;
      r.frond(
        new rt(b.x, b.y - R * 0.18, b.z),
        H,
        T,
        T * 0.48,
        D,
        z,
        n ? 3 : 7,
        I,
        0.065,
        0.18,
        B,
      );
    }
  return r.build();
}
function Ye(o, n) {
  let e = At(o),
    r = new Ot(),
    a = n ? 5 : 11;
  for (let f = 0; f < a; f++) {
    let t = (f / a) * Math.PI * 2 + e() * 0.5,
      l = Math.sqrt(e()) * 0.72,
      c = Math.cos(t) * l,
      p = Math.sin(t) * l,
      h = 1.9 + e() * 2.4,
      i = (0.04 + e() * 0.14) * h,
      x = e() * Math.PI * 2,
      M = Math.cos(x) * i,
      g = Math.sin(x) * i,
      w = 0.042 + e() * 0.028,
      y = 5,
      b = [],
      v = [];
    for (let A = 0; A <= y; A++) {
      let E = A / y;
      (b.push(new rt(c + M * E * E, -0.15 + (h + 0.15) * E, p + g * E * E)),
        v.push(w * (1 - 0.58 * E)));
    }
    r.tube(
      b,
      v,
      n ? 4 : 6,
      (A) => lt(0.22, 0.34, 0.12).lerp(lt(0.36, 0.48, 0.18), A),
      (A) => 0.035 * A * A,
    );
    for (let A = 1; A <= y; A++) {
      let E = A / (y + 0.35),
        H = c + M * E * E,
        R = -0.15 + (h + 0.15) * E,
        D = p + g * E * E,
        z = n ? 4 : 8,
        T = (0.34 + 0.22 * (1 - Math.abs(E - 0.55) * 1.5)) * (h / 2.8);
      for (let I = 0; I < z; I++) {
        let B = (I / z) * Math.PI * 2 + A * 0.4 + e() * 0.2,
          W = lt(0.25, 0.42, 0.11).lerp(lt(0.46, 0.62, 0.2), E);
        r.frond(
          new rt(H, R, D),
          B,
          T,
          0.055,
          0.85,
          0.35,
          n ? 1 : 2,
          W,
          0.05 * E,
          0.1,
        );
      }
    }
  }
  return r.build();
}
function _e(o, n) {
  let e = At(o),
    r = new Ot(),
    a = n ? 10 : 28;
  for (let f = 0; f < a; f++) {
    let t = e() * Math.PI * 2,
      l = Math.sqrt(e()) * 0.58,
      c = Math.cos(t) * l,
      p = Math.sin(t) * l,
      h = (1.15 + e() * 1.45) * (n ? 1.1 : 1),
      i = 0.07 + e() * 0.28,
      x = e() * Math.PI * 2,
      M = (0.036 + e() * 0.032) * (n ? 2.2 : 1),
      g = e() * Math.PI,
      w = Math.cos(g) * M,
      y = Math.sin(g) * M,
      b = e() < 0.15,
      v = b ? lt(0.32, 0.29, 0.15) : lt(0.1, 0.18, 0.045),
      A = b
        ? lt(0.44, 0.38, 0.2)
        : lt(0.25, 0.38, 0.1).lerp(lt(0.35, 0.43, 0.15), e() * 0.5),
      E = n ? 2 : 4,
      H = [];
    for (let R = 0; R <= E; R++) {
      let D = R / E,
        z = i * D * D * h,
        T = c + Math.cos(x) * z,
        I = p + Math.sin(x) * z,
        B = h * D * (1 - 0.08 * D * D),
        W = 1 - D * 0.92,
        G = v.clone().lerp(A, D),
        O = -Math.sin(g),
        S = Math.cos(g);
      H.push(
        r.v(T - w * W, B, I - y * W, O, 0.35, S, 2, D, G, 0.05 * D * D),
        r.v(T + w * W, B, I + y * W, O, 0.35, S, 2, D, G, 0.05 * D * D),
      );
    }
    for (let R = 0; R < E; R++)
      r.quad(H[R * 2], H[R * 2 + 1], H[R * 2 + 3], H[R * 2 + 2]);
    if (!n && e() < 0.24) {
      let R = c + Math.cos(x) * i * h * 0.75,
        D = p + Math.sin(x) * i * h * 0.75;
      r.tube(
        [new rt(R, h * 0.78, D), new rt(R, h * 0.92, D)],
        [0.036, 0.036],
        5,
        () => lt(0.26, 0.15, 0.08),
        () => 0.04,
      );
    }
  }
  return r.build();
}
function Ke(o, n) {
  let e = At(o),
    r = new Ot(),
    a = n ? 8 : 19;
  for (let f = 0; f < a; f++) {
    let t = (f / a) * Math.PI * 2 + (e() - 0.5) * 0.42,
      l = Math.sqrt(e()) * 0.3,
      c = 0.55 + e() * 0.75,
      p = lt(0.24, 0.35, 0.12).lerp(lt(0.55, 0.48, 0.24), e() * 0.65);
    r.frond(
      new rt(Math.cos(t) * l, -0.04, Math.sin(t) * l),
      t,
      c,
      0.07 + e() * 0.035,
      1.05 + e() * 0.2,
      1.15 + e() * 0.5,
      n ? 2 : 4,
      p,
      0.09,
      0.18,
    );
  }
  return r.build();
}
function Fn(o) {
  let n = At(o),
    e = new Ot(),
    r = 9 + ((n() * 10) | 0);
  for (let a = 0; a < r; a++) {
    let f = n() * Math.PI * 2,
      t = Math.sqrt(n()) * 1.75,
      l = Math.cos(f) * t,
      c = Math.sin(f) * t,
      p = 0.15 + n() * 0.28,
      h = n() * Math.PI * 2,
      i = n() < 0.28,
      x = i
        ? lt(0.24, 0.42, 0.1).lerp(lt(0.38, 0.54, 0.16), n())
        : lt(0.12, 0.26, 0.06).lerp(lt(0.28, 0.4, 0.1), n());
    !i && n() < 0.14 && x.lerp(lt(0.4, 0.22, 0.12), 0.45);
    let M = 0.03 + n() * 0.012,
      g = e.v(l, M + (i ? 0.025 : 0.004), c, 0, 1, 0, 0.5, 0.5, x, 0),
      w = 12,
      y = i ? 0.05 : 0.5,
      b = [];
    for (let v = 0; v <= w; v++) {
      let A = y * 0.5 + (v / w) * (Math.PI * 2 - y),
        E =
          p *
          (i
            ? 0.72 + 0.28 * Math.abs(Math.sin(A * 4))
            : 0.94 + 0.06 * Math.sin(A * 5 + a)),
        H = i ? 0.045 * Math.abs(Math.sin(A * 4)) : 0.012 * Math.sin(A * 3);
      b.push(
        e.v(
          l + Math.cos(A + h) * E,
          M + H,
          c + Math.sin(A + h) * E,
          0,
          1,
          0,
          0.5,
          0.5,
          x.clone().multiplyScalar(0.85),
          0,
        ),
      );
    }
    for (let v = 0; v < w; v++) e.idx.push(g, b[v + 1], b[v]);
    if (!i && n() < 0.18) {
      let v = n() < 0.6 ? lt(0.95, 0.93, 0.88) : lt(0.95, 0.6, 0.72);
      for (let A = 0; A < 8; A++) {
        let E = (A / 8) * Math.PI * 2 + n() * 0.3;
        e.plane(
          l + Math.cos(E) * 0.03,
          M + 0.02,
          c + Math.sin(E) * 0.03,
          0.06,
          0.13,
          E - Math.PI / 2,
          0.75,
          v,
          0,
          0,
          new rt(Math.cos(E) * 0.4, 0.9, Math.sin(E) * 0.4).normalize(),
        );
      }
      e.blob(
        l,
        M + 0.05,
        c,
        0.025,
        0.02,
        1,
        0,
        () => lt(0.95, 0.75, 0.2),
        o + a,
      );
    }
  }
  return e.build();
}
export { Ae, Fn, Ke, Ot, Rn, Sn, Tn, Ye, _e, de, lt, rt, xe };
