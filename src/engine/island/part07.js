// island.js - part 7/21 (statements 84-97 of the original module).
import * as gt from "three";
import { Ie } from "./part01.js";
import { ft } from "./part06.js";

var Jo = `
uniform float uGrow,uFadeD;
varying vec3 vW,vN,vO,vC;
varying float vBase,vScale;
void main(){
 mat4 M=modelMatrix*instanceMatrix;
 vec3 ip=(M*vec4(0.,0.,0.,1.)).xyz;
 float dc=distance(cameraPosition,ip);
 float f=uGrow*(1.-smoothstep(uFadeD*.7,uFadeD,dc));
 vec3 wp=(M*vec4(position*f,1.)).xyz;
 mat3 B=mat3(M);
 vec3 s2=vec3(dot(B[0],B[0]),dot(B[1],B[1]),dot(B[2],B[2]));
 vN=normalize(B*(normal/max(s2,vec3(1e-6))));
 vO=position*sqrt(s2)+vec3(fract(ip.x*.137)*31.,fract(ip.z*.291)*17.,fract((ip.x+ip.z)*.0731)*23.);
 vW=wp;vBase=ip.y;vScale=sqrt(s2.y);
 vC=color;
 #ifdef USE_INSTANCING_COLOR
 vC*=instanceColor;
 #endif
 gl_Position=projectionMatrix*viewMatrix*vec4(wp,1.);
}`,
  Sa =
    ft +
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
}`,
  mr = "void main(){gl_FragColor=vec4(1.);}";
var fe = gt.Vector3,
  fr = (o) => Math.min(1, Math.max(0, o)),
  ye = (o, e, t) => new gt.Color(o, e, t),
  dt = class {
    pos = [];
    nor = [];
    uv = [];
    col = [];
    sway = [];
    card = [];
    idx = [];
    n = 0;
    v(e, t, r, s, c, a, n, i, m, h, l = 0, u = 0, d = 0) {
      return (
        this.pos.push(e, t, r),
        this.nor.push(s, c, a),
        this.uv.push(n, i),
        this.col.push(m.r, m.g, m.b),
        this.sway.push(h),
        this.card.push(l, u, d),
        this.n++
      );
    }
    quad(e, t, r, s) {
      this.idx.push(e, t, r, e, r, s);
    }
    plane(e, t, r, s, c, a, n, i, m, h, l) {
      let u = Math.cos(a),
        d = Math.sin(a),
        p = Math.cos(n),
        x = Math.sin(n),
        f = u * s * 0.5,
        v = d * s * 0.5,
        b = p * c,
        g = -d * x * c,
        M = u * x * c,
        w = l ? l.x : -d * p,
        E = l ? l.y : x,
        k = l ? l.z : u * p,
        R = this.v(e - f, t, r - v, w, E, k, 0, 0, i, m),
        H = this.v(e + f, t, r + v, w, E, k, 1, 0, i, m),
        C = this.v(e + f + g, t + b, r + v + M, w, E, k, 1, 1, i, h),
        W = this.v(e - f + g, t + b, r - v + M, w, E, k, 0, 1, i, h);
      this.quad(R, H, C, W);
    }
    leafCard(e, t, r, s, c, a, n, i) {
      let m = Math.cos(c),
        h = Math.sin(c),
        l = [];
      for (let [u, d, p, x] of [
        [-0.5, -0.5, 0, 0],
        [0.5, -0.5, 1, 0],
        [0.5, 0.5, 1, 1],
        [-0.5, 0.5, 0, 1],
      ])
        l.push(
          this.v(
            e,
            t,
            r,
            a.x,
            a.y,
            a.z,
            p,
            x,
            n,
            i,
            u * m - d * h,
            u * h + d * m,
            s,
          ),
        );
      this.quad(l[0], l[1], l[2], l[3]);
    }
    tube(e, t, r, s, c) {
      let a = null;
      for (let n = 0; n < e.length; n++) {
        let i = n / (e.length - 1),
          m = new fe()
            .subVectors(e[Math.min(n + 1, e.length - 1)], e[Math.max(n - 1, 0)])
            .normalize();
        m.lengthSq() < 1e-6 && m.set(0, 1, 0);
        let h = new fe(1, 0, 0).cross(m).normalize();
        h.lengthSq() < 1e-6 && h.set(1, 0, 0);
        let l = new fe().crossVectors(h, m).normalize(),
          u = [],
          d = s(i),
          p = c(i);
        for (let x = 0; x <= r; x++) {
          let f = (x / r) * Math.PI * 2,
            v = h.x * Math.cos(f) + l.x * Math.sin(f),
            b = h.y * Math.cos(f) + l.y * Math.sin(f),
            g = h.z * Math.cos(f) + l.z * Math.sin(f);
          u.push(
            this.v(
              e[n].x + v * t[n],
              e[n].y + b * t[n],
              e[n].z + g * t[n],
              v,
              b,
              g,
              2 + x / r,
              i,
              d,
              p,
            ),
          );
        }
        if (a)
          for (let x = 0; x < r; x++) this.quad(a[x], a[x + 1], u[x + 1], u[x]);
        a = u;
      }
    }
    frond(e, t, r, s, c, a, n, i, m, h = 0.16, l = 0) {
      let u = Math.cos(t),
        d = Math.sin(t),
        p = -d,
        x = u,
        f = e.clone(),
        v = r / n,
        b = [],
        g = new fe(0, 1, 0);
      for (let M = 0; M <= n; M++) {
        let w = M / n,
          E = c - a * Math.pow(w, 1.7),
          k = Math.cos(E),
          R = Math.sin(E),
          H = k * u,
          C = R,
          W = k * d,
          T = -x * C,
          P = x * H - p * W,
          L = p * C,
          z = Math.hypot(T, P, L) || 1;
        ((T /= z), (P /= z), (L /= z));
        let D = l * w,
          q = p * Math.cos(D) + T * Math.sin(D),
          N = P * Math.sin(D),
          V = x * Math.cos(D) + L * Math.sin(D),
          G = s * 0.5,
          U = h * G,
          K = T * 0.55 + g.x * 0.45,
          X = P * 0.55 + 0.45,
          J = L * 0.55 + g.z * 0.45,
          se = m * w * w,
          te = i.clone().multiplyScalar(0.62 + 0.38 * Math.min(1, w * 1.4)),
          me = this.v(
            f.x - q * G + T * U,
            f.y - N * G + P * U,
            f.z - V * G + L * U,
            K,
            X,
            J,
            0,
            w,
            te,
            se,
          ),
          $ = this.v(f.x, f.y, f.z, K, X, J, 0.5, w, te, se),
          Z = this.v(
            f.x + q * G + T * U,
            f.y + N * G + P * U,
            f.z + V * G + L * U,
            K,
            X,
            J,
            1,
            w,
            te,
            se,
          );
        (b.push([me, $, Z]), (f.x += H * v), (f.y += C * v), (f.z += W * v));
      }
      for (let M = 0; M < n; M++) {
        let w = b[M],
          E = b[M + 1];
        (this.quad(w[0], w[1], E[1], E[0]), this.quad(w[1], w[2], E[2], E[1]));
      }
    }
    blob(e, t, r, s, c, a, n, i, m) {
      let h = new gt.IcosahedronGeometry(1, a),
        l = h.getAttribute("position"),
        u = m * 0.37,
        d = this.n,
        p = (x, f, v) =>
          1 +
          n *
            (Math.sin(x * 2.9 + u) * Math.cos(f * 2.3 + u * 1.7) +
              0.6 *
                Math.sin(v * 4.1 + x * 3.3 + u * 0.6) *
                Math.cos(f * 3.7 - v * 2.1) +
              0.35 * Math.sin(x * 7.3 + v * 6.1 + u));
      for (let x = 0; x < l.count; x++) {
        let f = l.getX(x),
          v = l.getY(x),
          b = l.getZ(x),
          g = p(f, v, b);
        this.v(
          e + f * s * g,
          t + v * c * g,
          r + b * s * g,
          f,
          v,
          b,
          2,
          0.5,
          i(v, (v + 1) * 0.5),
          0,
        );
      }
      for (let x = 0; x < l.count; x += 3)
        this.idx.push(d + x, d + x + 1, d + x + 2);
      h.dispose();
    }
    build() {
      let e = new gt.BufferGeometry();
      (e.setAttribute("position", new gt.Float32BufferAttribute(this.pos, 3)),
        e.setAttribute("normal", new gt.Float32BufferAttribute(this.nor, 3)),
        e.setAttribute("uv", new gt.Float32BufferAttribute(this.uv, 2)),
        e.setAttribute("color", new gt.Float32BufferAttribute(this.col, 3)),
        e.setAttribute("asway", new gt.Float32BufferAttribute(this.sway, 1)),
        e.setAttribute("acard", new gt.Float32BufferAttribute(this.card, 3)),
        e.setIndex(this.idx),
        e.computeBoundingSphere());
      let t = 0;
      for (let r = 2; r < this.card.length; r += 3)
        t = Math.max(t, this.card[r]);
      return (e.boundingSphere && (e.boundingSphere.radius += t * 0.71), e);
    }
  };
function ea(o, e, t, r, s, c, a, n, i, m, h, l) {
  let u = new fe(),
    d = new fe(),
    p = new fe(),
    x = new fe();
  for (let f of t)
    for (let v = 0; v < c; v++) {
      let b = e() * 2 - 1,
        g = e() * Math.PI * 2,
        M = Math.sqrt(1 - b * b);
      u.set(M * Math.cos(g), b * 0.85, M * Math.sin(g)).normalize();
      let w = f.r * (0.5 + 0.5 * Math.sqrt(e()));
      (x.copy(f.c).addScaledVector(u, w),
        p.subVectors(x, r).normalize(),
        d
          .copy(u)
          .multiplyScalar(0.55)
          .addScaledVector(p, 0.45)
          .add(new fe(0, 0.22, 0))
          .normalize());
      let E = f.r * h * (0.85 + 0.35 * e()),
        k = e() * Math.PI * 2,
        R = fr((x.y - (r.y - s)) / (2 * s)),
        H = fr(0.18 + 0.5 * R + 0.32 * (w / f.r) + (e() - 0.5) * 0.22),
        C = i
          .clone()
          .lerp(m, H)
          .multiplyScalar(0.6 + 0.4 * H);
      (!n || v % a === 0) &&
        o.leafCard(
          x.x,
          x.y,
          x.z,
          n ? E * Math.sqrt(a) * 0.92 : E,
          k,
          d,
          C,
          l * (0.6 + 0.4 * R),
        );
    }
}
function dr(o, e) {
  let t = Ie(o),
    r = new dt(),
    s = (o & 1) === 0,
    c = s ? 14.5 + t() * 7.5 : 9.2 + t() * 5.5,
    a = t() * Math.PI * 2,
    n = (t() - 0.5) * 0.06 * c,
    i = Math.cos(a) * n,
    m = Math.sin(a) * n,
    h = s ? c * 0.026 : c * 0.034,
    l = e ? 4 : 9,
    u = [],
    d = [];
  for (let b = 0; b <= l; b++) {
    let g = b / l;
    u.push(new fe(i * g * g, -0.55 + (c + 0.55) * g, m * g * g));
    let M = 1 + (s ? 1.45 : 1.75) * Math.pow(1 - g, 5);
    d.push(h * (1 - 0.48 * g) * M);
  }
  let p = (b) => ye(0.22, 0.25, 0.16).lerp(ye(0.32, 0.35, 0.22), b);
  r.tube(u, d, e ? 5 : 8, p, (b) => b * b * 0.014);
  let x = 20,
    f = c * (s ? 0.22 : 0.28);
  for (let b = 0; b < x; b++) {
    let g = (b / x) * Math.PI * 2 + (t() - 0.5) * 0.28,
      M = h * (2.6 + t() * 2.1),
      w = f * (0.65 + t() * 0.45),
      E = M * (0.58 + t() * 0.18);
    (!e || b % 3 === 0) &&
      r.tube(
        [
          new fe(Math.cos(g) * h * 0.85, w, Math.sin(g) * h * 0.85),
          new fe(Math.cos(g + 0.08) * E, w * 0.45, Math.sin(g + 0.08) * E),
          new fe(Math.cos(g) * M, -0.55, Math.sin(g) * M),
        ],
        [0.045, 0.055, 0.03],
        e ? 3 : 4,
        (k) => ye(0.14, 0.13, 0.1).lerp(ye(0.08, 0.08, 0.06), k),
        () => 0,
      );
  }
  let v = u[l];
  if (s) {
    let g = c * (0.25 + t() * 0.05),
      M = g * 0.48;
    for (let E = 0; E < 6; E++) {
      let k = (E / 6) * Math.PI * 2 + t() * 0.45,
        R = g * (0.62 + t() * 0.25),
        H = v.x + Math.cos(k) * R,
        C = v.z + Math.sin(k) * R,
        W = v.y + M * (0.35 + t() * 0.25);
      e ||
        r.tube(
          [
            new fe(v.x, v.y - 0.4, v.z),
            new fe(
              v.x + Math.cos(k) * R * 0.5,
              v.y + M * 0.25,
              v.z + Math.sin(k) * R * 0.5,
            ),
            new fe(H, W, C),
          ],
          [h * 0.48, h * 0.3, h * 0.14],
          5,
          p,
          (T) => 0.01 + T * 0.015,
        );
      for (let T = 0; T < 3; T++) {
        let P = k + (T - 1) * 0.48 + (t() - 0.5) * 0.2,
          L = c * (0.18 + t() * 0.07),
          z = ye(0.68, 0.86, 0.42).lerp(ye(0.92, 1.02, 0.58), t());
        r.frond(
          new fe(H * 0.65 + v.x * 0.35, W - 0.15, C * 0.65 + v.z * 0.35),
          P,
          L,
          L * 0.46,
          0.45 + t() * 0.35,
          1.05 + t() * 0.45,
          e ? 3 : 6,
          z,
          0.05,
          0.16,
        );
      }
    }
    let w = 8;
    for (let E = 0; E < w; E++) {
      let k = (E / w) * Math.PI * 2 + t() * 0.3,
        R = c * (0.21 + t() * 0.06),
        H = ye(0.58, 0.78, 0.36).lerp(ye(0.84, 0.96, 0.52), t());
      r.frond(
        new fe(v.x, v.y - 0.3, v.z),
        k,
        R,
        R * 0.42,
        0.75 + t() * 0.25,
        1.35 + t() * 0.35,
        e ? 3 : 6,
        H,
        0.055,
        0.15,
      );
    }
  } else
    for (let g = 0; g < 20; g++) {
      let M = g / 20,
        w = M * Math.PI * 2 * 2.39996 + (t() - 0.5) * 0.18,
        E = M < 0.35 ? 0 : M < 0.75 ? 1 : 2,
        k =
          E === 0
            ? 1.05 + t() * 0.2
            : E === 1
              ? 0.55 + t() * 0.25
              : -0.05 + t() * 0.25,
        R =
          E === 0
            ? 0.75 + t() * 0.3
            : E === 1
              ? 1.15 + t() * 0.35
              : 1.35 + t() * 0.35,
        H = c * (E === 1 ? 0.38 : 0.31) * (0.88 + t() * 0.24),
        C = ye(0.68, 0.88, 0.42).lerp(
          ye(0.96, 1.08, 0.62),
          1 - E * 0.28 + (t() - 0.5) * 0.2,
        ),
        W = (t() - 0.5) * 0.35;
      r.frond(
        new fe(v.x, v.y - E * 0.18, v.z),
        w,
        H,
        H * 0.48,
        k,
        R,
        e ? 3 : 7,
        C,
        0.065,
        0.18,
        W,
      );
    }
  return r.build();
}
function sn(o, e) {
  let t = Ie(o),
    r = new dt(),
    s = e ? 5 : 11;
  for (let c = 0; c < s; c++) {
    let a = (c / s) * Math.PI * 2 + t() * 0.5,
      n = Math.sqrt(t()) * 0.72,
      i = Math.cos(a) * n,
      m = Math.sin(a) * n,
      h = 1.9 + t() * 2.4,
      l = (0.04 + t() * 0.14) * h,
      u = t() * Math.PI * 2,
      d = Math.cos(u) * l,
      p = Math.sin(u) * l,
      x = 0.042 + t() * 0.028,
      f = 5,
      v = [],
      b = [];
    for (let g = 0; g <= f; g++) {
      let M = g / f;
      (v.push(new fe(i + d * M * M, -0.15 + (h + 0.15) * M, m + p * M * M)),
        b.push(x * (1 - 0.58 * M)));
    }
    r.tube(
      v,
      b,
      e ? 4 : 6,
      (g) => ye(0.22, 0.34, 0.12).lerp(ye(0.36, 0.48, 0.18), g),
      (g) => 0.035 * g * g,
    );
    for (let g = 1; g <= f; g++) {
      let M = g / (f + 0.35),
        w = i + d * M * M,
        E = -0.15 + (h + 0.15) * M,
        k = m + p * M * M,
        R = e ? 4 : 8,
        H = (0.34 + 0.22 * (1 - Math.abs(M - 0.55) * 1.5)) * (h / 2.8);
      for (let C = 0; C < R; C++) {
        let W = (C / R) * Math.PI * 2 + g * 0.4 + t() * 0.2,
          T = ye(0.25, 0.42, 0.11).lerp(ye(0.46, 0.62, 0.2), M);
        r.frond(
          new fe(w, E, k),
          W,
          H,
          0.055,
          0.85,
          0.35,
          e ? 1 : 2,
          T,
          0.05 * M,
          0.1,
        );
      }
    }
  }
  return r.build();
}
function ln(o, e) {
  let t = Ie(o),
    r = new dt(),
    s = e ? 10 : 28;
  for (let c = 0; c < s; c++) {
    let a = t() * Math.PI * 2,
      n = Math.sqrt(t()) * 0.58,
      i = Math.cos(a) * n,
      m = Math.sin(a) * n,
      h = (1.15 + t() * 1.45) * (e ? 1.1 : 1),
      l = 0.07 + t() * 0.28,
      u = t() * Math.PI * 2,
      d = (0.036 + t() * 0.032) * (e ? 2.2 : 1),
      p = t() * Math.PI,
      x = Math.cos(p) * d,
      f = Math.sin(p) * d,
      v = t() < 0.15,
      b = v ? ye(0.32, 0.29, 0.15) : ye(0.1, 0.18, 0.045),
      g = v
        ? ye(0.44, 0.38, 0.2)
        : ye(0.25, 0.38, 0.1).lerp(ye(0.35, 0.43, 0.15), t() * 0.5),
      M = e ? 2 : 4,
      w = [];
    for (let E = 0; E <= M; E++) {
      let k = E / M,
        R = l * k * k * h,
        H = i + Math.cos(u) * R,
        C = m + Math.sin(u) * R,
        W = h * k * (1 - 0.08 * k * k),
        T = 1 - k * 0.92,
        P = b.clone().lerp(g, k),
        L = -Math.sin(p),
        z = Math.cos(p);
      w.push(
        r.v(H - x * T, W, C - f * T, L, 0.35, z, 2, k, P, 0.05 * k * k),
        r.v(H + x * T, W, C + f * T, L, 0.35, z, 2, k, P, 0.05 * k * k),
      );
    }
    for (let E = 0; E < M; E++)
      r.quad(w[E * 2], w[E * 2 + 1], w[E * 2 + 3], w[E * 2 + 2]);
    if (!e && t() < 0.24) {
      let E = i + Math.cos(u) * l * h * 0.75,
        k = m + Math.sin(u) * l * h * 0.75;
      r.tube(
        [new fe(E, h * 0.78, k), new fe(E, h * 0.92, k)],
        [0.036, 0.036],
        5,
        () => ye(0.26, 0.15, 0.08),
        () => 0.04,
      );
    }
  }
  return r.build();
}
function cn(o, e) {
  let t = Ie(o),
    r = new dt(),
    s = e ? 8 : 19;
  for (let c = 0; c < s; c++) {
    let a = (c / s) * Math.PI * 2 + (t() - 0.5) * 0.42,
      n = Math.sqrt(t()) * 0.3,
      i = 0.55 + t() * 0.75,
      m = ye(0.24, 0.35, 0.12).lerp(ye(0.55, 0.48, 0.24), t() * 0.65);
    r.frond(
      new fe(Math.cos(a) * n, -0.04, Math.sin(a) * n),
      a,
      i,
      0.07 + t() * 0.035,
      1.05 + t() * 0.2,
      1.15 + t() * 0.5,
      e ? 2 : 4,
      m,
      0.09,
      0.18,
    );
  }
  return r.build();
}
function pr(o) {
  let e = Ie(o),
    t = new dt(),
    r = 9 + ((e() * 10) | 0);
  for (let s = 0; s < r; s++) {
    let c = e() * Math.PI * 2,
      a = Math.sqrt(e()) * 1.75,
      n = Math.cos(c) * a,
      i = Math.sin(c) * a,
      m = 0.15 + e() * 0.28,
      h = e() * Math.PI * 2,
      l = e() < 0.28,
      u = l
        ? ye(0.24, 0.42, 0.1).lerp(ye(0.38, 0.54, 0.16), e())
        : ye(0.12, 0.26, 0.06).lerp(ye(0.28, 0.4, 0.1), e());
    !l && e() < 0.14 && u.lerp(ye(0.4, 0.22, 0.12), 0.45);
    let d = 0.03 + e() * 0.012,
      p = t.v(n, d + (l ? 0.025 : 0.004), i, 0, 1, 0, 0.5, 0.5, u, 0),
      x = 12,
      f = l ? 0.05 : 0.5,
      v = [];
    for (let b = 0; b <= x; b++) {
      let g = f * 0.5 + (b / x) * (Math.PI * 2 - f),
        M =
          m *
          (l
            ? 0.72 + 0.28 * Math.abs(Math.sin(g * 4))
            : 0.94 + 0.06 * Math.sin(g * 5 + s)),
        w = l ? 0.045 * Math.abs(Math.sin(g * 4)) : 0.012 * Math.sin(g * 3);
      v.push(
        t.v(
          n + Math.cos(g + h) * M,
          d + w,
          i + Math.sin(g + h) * M,
          0,
          1,
          0,
          0.5,
          0.5,
          u.clone().multiplyScalar(0.85),
          0,
        ),
      );
    }
    for (let b = 0; b < x; b++) t.idx.push(p, v[b + 1], v[b]);
    if (!l && e() < 0.18) {
      let b = e() < 0.6 ? ye(0.95, 0.93, 0.88) : ye(0.95, 0.6, 0.72);
      for (let g = 0; g < 8; g++) {
        let M = (g / 8) * Math.PI * 2 + e() * 0.3;
        t.plane(
          n + Math.cos(M) * 0.03,
          d + 0.02,
          i + Math.sin(M) * 0.03,
          0.06,
          0.13,
          M - Math.PI / 2,
          0.75,
          b,
          0,
          0,
          new fe(Math.cos(M) * 0.4, 0.9, Math.sin(M) * 0.4).normalize(),
        );
      }
      t.blob(
        n,
        d + 0.05,
        i,
        0.025,
        0.02,
        1,
        0,
        () => ye(0.95, 0.75, 0.2),
        o + s,
      );
    }
  }
  return t.build();
}
function vr(o, e) {
  let t = Ie(o),
    r = new dt(),
    s = 9 + t() * 6.5,
    c = 1.4 + t() * 0.85,
    a = (u) => ye(0.22, 0.21, 0.15).lerp(ye(0.28, 0.27, 0.18), u);
  r.tube(
    [
      new fe(0, c * 0.3, 0),
      new fe(0.12, s * 0.45, 0.05),
      new fe(0, s * 0.76, 0),
    ],
    [0.24, 0.17, 0.1],
    e ? 5 : 7,
    a,
    (u) => u * u * 0.01,
  );
  let n = 18;
  for (let u = 0; u < n; u++) {
    let d = (u / n) * Math.PI * 2 + t() * 0.38,
      p = 1.8 + t() * 2.2,
      x = c + t() * 1.5,
      f = Math.cos(d) * p,
      v = Math.sin(d) * p,
      b = new fe(f * 0.55, x + 0.35 + t() * 0.3, v * 0.55);
    ((!e || u % 2 === 0) &&
      r.tube(
        [
          new fe(Math.cos(d) * 0.12, x, Math.sin(d) * 0.12),
          b,
          new fe(f * 0.9, x * 0.35, v * 0.9),
          new fe(f, -0.7, v),
        ],
        [0.12, 0.09, 0.055, 0.035],
        e ? 3 : 6,
        () => ye(0.28, 0.25, 0.18),
        () => 0,
      ),
      !e &&
        u % 3 === 0 &&
        r.tube(
          [
            b,
            new fe(
              f * 0.92 - Math.sin(d) * 0.55,
              x * 0.36,
              v * 0.92 + Math.cos(d) * 0.55,
            ),
            new fe(f - Math.sin(d) * 0.85, -0.6, v + Math.cos(d) * 0.85),
          ],
          [0.055, 0.035, 0.018],
          4,
          () => ye(0.24, 0.21, 0.15),
          () => 0,
        ));
  }
  let i = new fe(0, s * 0.76, 0),
    m = s * (0.38 + t() * 0.1),
    h = m * 0.54,
    l = [{ c: new fe(0, i.y + h * 0.48, 0), r: m * 0.62 }];
  for (let u = 0; u < 6; u++) {
    let d = (u / 6) * Math.PI * 2 + t() * 0.7,
      p = m * (0.52 + 0.3 * t());
    l.push({
      c: new fe(
        Math.cos(d) * p,
        i.y + (t() - 0.25) * h * 0.55,
        Math.sin(d) * p,
      ),
      r: m * (0.44 + 0.15 * t()),
    });
  }
  return (
    ea(
      r,
      t,
      l,
      new fe(0, i.y + h * 0.3, 0),
      h,
      15,
      4,
      e,
      ye(0.14, 0.27, 0.07),
      ye(0.45, 0.62, 0.21),
      1,
      0.025,
    ),
    r.build()
  );
}
function br(o) {
  let e = Ie(o),
    t = new dt(),
    r = (o & 1) === 1,
    s = (c) => ye(0.56, 0.55, 0.48).lerp(ye(0.38, 0.39, 0.33), c);
  if (r) {
    let c = 3.8 + e() * 2.2;
    t.tube(
      [new fe(0, -0.6, 0), new fe(0.08, c * 0.5, 0), new fe(0.14, c, 0)],
      [0.28, 0.21, 0.17],
      7,
      s,
      () => 0,
    );
    let a = 5.2 + e() * 2.8,
      n = e() * Math.PI * 2,
      i = Math.cos(n) * a,
      m = Math.sin(n) * a;
    t.tube(
      [
        new fe(0.12, c - 0.15, 0),
        new fe(i * 0.52, c * 0.55, m * 0.52),
        new fe(i, 0.65, m),
      ],
      [0.16, 0.13, 0.08],
      7,
      s,
      () => 0,
    );
    for (let h = 0; h < 3; h++) {
      let l = n + (h - 1) * 0.65;
      t.tube(
        [
          new fe(i, 0.65, m),
          new fe(
            i + Math.cos(l) * 1.4,
            0.25 + (h & 1) * 0.6,
            m + Math.sin(l) * 1.4,
          ),
        ],
        [0.06, 0.02],
        5,
        s,
        () => 0,
      );
    }
  } else {
    let c = 5.5 + e() * 6.5,
      a = (e() - 0.5) * 0.8,
      n = (e() - 0.5) * 0.8;
    t.tube(
      [new fe(0, -0.65, 0), new fe(a * 0.3, c * 0.5, n * 0.3), new fe(a, c, n)],
      [0.25, 0.16, 0.06],
      7,
      s,
      () => 0,
    );
    let i = 3 + ((e() * 3) | 0);
    for (let m = 0; m < i; m++) {
      let h = 0.45 + e() * 0.42,
        l = e() * Math.PI * 2,
        u = c * (0.18 + e() * 0.22),
        d = new fe(a * h, c * h, n * h),
        p = new fe(
          d.x + Math.cos(l) * u,
          d.y + u * 0.65,
          d.z + Math.sin(l) * u,
        );
      t.tube([d, p], [0.08, 0.024], 5, s, () => 0);
    }
  }
  return t.build();
}
function Ps(o) {
  let e = Ie(o),
    t = 8 + e() * 9;
  return { a: e() * Math.PI * 2, bend: (0.12 + e() * 0.24) * t };
}
var xr = () => ye(0.2, 0.15, 0.1),
  un = () => ye(0.12, 0.1, 0.075);
function Vs(o, e) {
  let t = Ie(o),
    r = new dt(),
    s = 12 + t() * 10,
    c = (t() - 0.5) * 0.12 * s,
    a = t() * Math.PI * 2,
    n = Math.cos(a) * c,
    i = Math.sin(a) * c,
    m = s * 0.03,
    h = s * 0.74,
    l = (E) =>
      new fe(
        n * E * E + Math.sin(E * 5 + o) * 0.006 * s,
        -0.6 + (h + 0.6) * E,
        i * E * E,
      ),
    u = e ? 3 : 7,
    d = [],
    p = [];
  for (let E = 0; E <= u; E++) {
    let k = E / u;
    (d.push(l(k)),
      p.push(m * (1 - 0.58 * k) * (1 + 1.25 * Math.pow(1 - k, 6))));
  }
  r.tube(
    d,
    p,
    e ? 5 : 8,
    (E) => xr().lerp(un(), E),
    (E) => E * E * 0.012,
  );
  let x = l(1),
    f = s * (0.27 + t() * 0.06),
    v = f * (0.78 + t() * 0.18),
    b = x.y - v * 0.05,
    g = new fe(x.x, b, x.z),
    M = [{ c: new fe(x.x, b + v * 0.5, x.z), r: f * 0.6 }],
    w = 6;
  for (let E = 0; E < w; E++) {
    let k = (E / w) * Math.PI * 2 + t() * 0.8,
      R = f * (0.52 + 0.26 * t()),
      H = new fe(
        x.x + Math.cos(k) * R,
        b + (t() - 0.4) * v * 0.85,
        x.z + Math.sin(k) * R,
      ),
      C = f * (0.46 + 0.18 * t());
    M.push({ c: H, r: C });
    let W = l(0.58 + 0.32 * t());
    if (!e) {
      let T = new fe().lerpVectors(W, H, 0.88),
        P = new fe().lerpVectors(W, T, 0.5);
      ((P.y += R * 0.16),
        r.tube(
          [W, P, T],
          [m * 0.4, m * 0.27, m * 0.12],
          5,
          (L) => xr().lerp(un(), 0.3 + L * 0.4),
          (L) => 0.004 + L * 0.008,
        ));
    }
  }
  return (
    ea(
      r,
      t,
      M,
      g,
      v,
      16,
      4,
      e,
      ye(0.2, 0.36, 0.1),
      ye(0.56, 0.76, 0.25),
      1,
      0.03,
    ),
    r.build()
  );
}
export { Jo, Ps, Sa, Vs, br, cn, dr, dt, ea, fe, ln, mr, pr, sn, un, vr, ye };
