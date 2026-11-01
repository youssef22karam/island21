// island.js - part 10/21 (statements 114-140 of the original module).
import * as Bt from "three";
import * as rt from "three";
import * as tt from "three";
import { ao } from "./part04.js";
import { $e, Fo, Xo, ho, no } from "./part05.js";
import { ft } from "./part06.js";

var pn = 5,
  Wo = `
uniform sampler2D uShadowMap;
uniform mat4 uShadowMatrix;
uniform vec4 uShadowInfo; // x strength, y texel size (uv), z depth bias
float propShadow(vec3 wp){
 if(uShadowInfo.x<.004)return 1.;
 vec3 c=(uShadowMatrix*vec4(wp,1.)).xyz;
 vec2 e=min(c.xy,1.-c.xy);
 float edge=smoothstep(0.,.08,min(e.x,e.y));
 if(edge<=0.||c.z>=1.)return 1.;
 float z=c.z-uShadowInfo.z;
 float t=uShadowInfo.y;
 if(uShadowInfo.w>1.5)return mix(1.,step(z,textureLod(uShadowMap,c.xy,0.).r),uShadowInfo.x*edge);
 if(uShadowInfo.w>.5){
  vec2 q2=c.xy/t-.5,f2=q2-floor(q2),b2=(floor(q2)+.5)*t;
  float s00=step(z,textureLod(uShadowMap,b2,0.).r),s10=step(z,textureLod(uShadowMap,b2+vec2(t,0.),0.).r);
  float s01=step(z,textureLod(uShadowMap,b2+vec2(0.,t),0.).r),s11=step(z,textureLod(uShadowMap,b2+vec2(t,t),0.).r);
  return mix(1.,mix(mix(s00,s10,f2.x),mix(s01,s11,f2.x),f2.y),uShadowInfo.x*edge);
 }
 vec2 q=c.xy/t-.5,fl=floor(q),fr=q-fl;
 vec2 b=(fl+.5)*t;
 float s=0.;
 for(int j=-1;j<=2;j++){
  float wy=j==-1?1.-fr.y:(j==2?fr.y:1.);
  for(int i=-1;i<=2;i++){
   float wx=i==-1?1.-fr.x:(i==2?fr.x:1.);
   s+=wx*wy*step(z,textureLod(uShadowMap,b+vec2(float(i),float(j))*t,0.).r);
  }
 }
 return mix(1.,s/9.,uShadowInfo.x*edge);
}
`,
  $s = new rt.Matrix4().set(
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
function yr(o, e) {
  let s = 0,
    c = null,
    a = new rt.OrthographicCamera(-86, 86, 86, -86, 1, 420 * 2);
  a.layers.set(pn);
  let n = new rt.Vector3(),
    i = new rt.Vector3(),
    m = new rt.Vector3(),
    h = new rt.Vector3(),
    l = [],
    u = e.uShadowInfo.value;
  function d(x) {
    if (x !== s) {
      if ((c?.dispose(), (c = null), (s = x), x > 0)) {
        let f = new rt.DepthTexture(x, x);
        ((f.type = rt.UnsignedIntType),
          (f.minFilter = f.magFilter = rt.NearestFilter),
          (c = new rt.WebGLRenderTarget(x, x, {
            depthTexture: f,
            depthBuffer: !0,
            format: rt.RedFormat,
            type: rt.UnsignedByteType,
            generateMipmaps: !1,
            minFilter: rt.NearestFilter,
            magFilter: rt.NearestFilter,
          })),
          (e.uShadowMap.value = f));
      } else e.uShadowMap.value = null;
      u.set(0, x > 0 ? 1 / x : 1, 4e-5, __PF.q.shMode | 0);
    }
  }
  function p(x, f, v, b, g) {
    if (!c || g < 0.004 || !b.length || v.y < 0.02) {
      u.x = 0;
      return;
    }
    (f.getWorldDirection(i),
      (i.y = 0),
      i.lengthSq() < 1e-6 && i.set(1, 0, 0),
      i.normalize(),
      n.copy(f.position).addScaledVector(i, 86 * 0.42),
      a.position.copy(n).addScaledVector(v, 420),
      a.up.set(0, 1, 0),
      Math.abs(v.y) > 0.98 && a.up.set(1, 0, 0),
      a.lookAt(n),
      a.updateMatrixWorld(!0));
    let M = a.matrixWorld.elements;
    (m.set(M[0], M[1], M[2]), h.set(M[4], M[5], M[6]));
    let w = 172 / s,
      E = a.position.dot(m),
      k = a.position.dot(h);
    (a.position
      .addScaledVector(m, Math.round(E / w) * w - E)
      .addScaledVector(h, Math.round(k / w) * w - k),
      a.updateMatrixWorld(!0),
      e.uShadowMatrix.value
        .multiplyMatrices($s, a.projectionMatrix)
        .multiply(a.matrixWorldInverse),
      (l.length = 0));
    for (let H of b) {
      let C = H.userData.depthMat;
      !H.visible ||
        !C ||
        ((H.userData.mat0 = H.material), (H.material = C), l.push(H));
    }
    let R = o.getRenderTarget();
    try {
      (o.setRenderTarget(c), o.render(x, a));
    } finally {
      o.setRenderTarget(R);
      for (let H of l) H.material = H.userData.mat0;
    }
    u.set(g, 1 / s, 4e-5 * Math.max(1, 1024 / s), __PF.q.shMode | 0);
  }
  return {
    setSize: d,
    update: p,
    dispose: () => {
      (c?.dispose(), (c = null));
    },
    get size() {
      return s;
    },
  };
}
var Rr = {
    lowest: { spacing: 0.6, blades: 3, radius: 46, chunk: 16, cache: 240 },
    lower: { spacing: 0.53, blades: 4, radius: 56, chunk: 16, cache: 260 },
    low: { spacing: 0.46, blades: 5, radius: 66, chunk: 16, cache: 280 },
    medium: { spacing: 0.46, blades: 5, radius: 66, chunk: 16, cache: 280 },
    high: { spacing: 0.46, blades: 5, radius: 66, chunk: 16, cache: 280 },
  },
  js =
    ft +
    `
attribute vec4 aTuft;   // chunk-local x, ground y, chunk-local z, height scale
attribute vec3 aRnd;    // yaw, tint, kind (0 turf, 1 tall dune grass)
attribute float aT,aR;
uniform float uBladeH,uWindAmt,uRadius;
uniform vec2 uWind;
varying vec3 vColor,vWorld,vN;
varying float vT;
void main(){
 vec3 base=(modelMatrix*vec4(aTuft.xyz,1.)).xyz;
 float dist=distance(cameraPosition,base);
 float edge=1.-smoothstep(uRadius*.72,uRadius*.985,dist);
 float dune=aRnd.z;
 float H=uBladeH*aTuft.w*edge*(1.+.55*dune);
 if(H<.004){gl_Position=vec4(2.,2.,2.,1.);vColor=vec3(0.);vWorld=vec3(0.);vN=vec3(0.,1.,0.);vT=0.;return;}
 float yaw=aRnd.x*6.2831853;
 float cy=cos(yaw),sy=sin(yaw);
 mat2 R=mat2(cy,sy,-sy,cy);
 vec3 pos=position;
 float t=aT,t2=t*t;
 pos.xz=R*pos.xz*(1.-.3*dune);
 pos.y*=H;
 // gentle sway from wind and time only (never from the viewer)
 vec2 wd=normalize(uWind+vec2(.0001));
 float gust=vn(base.xz*.045-uWind*uTime*2.4);
 float osc=sin(uTime*(1.5+aR*.8)+dot(base.xz,vec2(.17,.13))+aR*6.2831);
 float amt=.14+uWindAmt*1.2;
 vec2 push=(wd*(gust*1.05+.18)+vec2(-wd.y,wd.x)*osc*.05+wd*osc*.06)*amt*H*.55*t2;
 pos.xz+=push;
 pos.y-=length(push)*.35*t;
 vec3 world=base+pos;
 vec3 n=normal;n.xz=R*n.xz;
 vN=n;vT=t;vWorld=world;
 float tint=vn(base.xz*.021)*.65+aRnd.y*.35;
 vec3 c0=mix(vec3(.07,.15,.024),vec3(.21,.31,.065),tint);
 float dry=smoothstep(.56,.8,vn(base.xz*.013+9.));
 c0=mix(c0,vec3(.34,.32,.095),dry*.5);
 // dune grass: wiry, salt-bleached straw with green bases
 vec3 duneC=mix(vec3(.25,.25,.09),vec3(.40,.36,.16),aRnd.y);
 c0=mix(c0,duneC,dune*(.55+.45*t));
 c0*=.78+.44*aR;
 vColor=c0;
 gl_Position=projectionMatrix*viewMatrix*vec4(world,1.);
}`,
  Ks =
    ft +
    Wo +
    `
uniform float uFog;
varying vec3 vColor,vWorld,vN;
varying float vT;
void main(){
 vec3 toEye=cameraPosition-vWorld;float dist=length(toEye);vec3 V=toEye/max(dist,.001);
 float t=vT;
 vec3 N=normalize(mix(vec3(0.,1.,0.),normalize(vN),.42));
 float sunVis=smoothstep(-.02,.2,uSun.y)*(1.-.75*uStorm);
 #ifdef PROP_SHADOWS
 sunVis*=propShadow(vWorld);
 #endif
 float dif=clamp(dot(N,uSun)*.5+.5,0.,1.);dif*=dif;
 float back=max(dot(-V,uSun),0.);
 float trans=pow(back,3.)*smoothstep(.15,1.,t)*.85;
 float ao=mix(.24,1.,smoothstep(0.,.75,t));
 vec3 amb=hzSoft()*(.32+.22*N.y)*uLight+vec3(.02,.03,.05)*uNight;
 vec3 albedo=vColor*mix(.5,1.35,pow(t,.85));
 albedo=mix(albedo,albedo*vec3(1.3,1.22,.72),smoothstep(.72,1.,t)*.5);
 vec3 col=albedo*ao*(amb+uSunCol*(dif*.62+trans*.9)*sunVis+vec3(.08,.11,.17)*uNight*max(dot(N,uMoon),0.));
 vec3 R=reflect(-V,N);
 col+=uSunCol*pow(max(dot(R,uSun),0.),24.)*.05*t*sunVis;
 float fg=1.-exp(-dist*uFog*1.1);col=mix(col,horizon(),fg);
 gl_FragColor=vec4(col,1.);
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
}`;
function Qt(o, e, t) {
  let r =
    Math.imul(o | 0, 668265261) ^
    Math.imul(e | 0, 374761393) ^
    Math.imul(t | 0, 625341585);
  return (
    (r = Math.imul(r ^ (r >>> 15), 2246822507)),
    (r = Math.imul(r ^ (r >>> 13), 3266489909)),
    ((r ^ (r >>> 16)) >>> 0) / 4294967296
  );
}
function Mr(o, e) {
  let t = Math.floor(o),
    r = Math.floor(e),
    s = o - t,
    c = e - r;
  ((s = s * s * (3 - 2 * s)), (c = c * c * (3 - 2 * c)));
  let a = Qt(t, r, 7),
    n = Qt(t + 1, r, 7),
    i = Qt(t, r + 1, 7),
    m = Qt(t + 1, r + 1, 7);
  return (a + (n - a) * s) * (1 - c) + (i + (m - i) * s) * c;
}
var Ta = (o, e, t) => {
  let r = Math.min(Math.max((t - o) / (e - o), 0), 1);
  return r * r * (3 - 2 * r);
};
function Ys(o, e = 11) {
  let t = e >>> 0,
    r = () => {
      t = (t + 1831565813) >>> 0;
      let h = t;
      return (
        (h = Math.imul(h ^ (h >>> 15), h | 1)),
        (h ^= h + Math.imul(h ^ (h >>> 7), h | 61)),
        ((h ^ (h >>> 14)) >>> 0) / 4294967296
      );
    },
    s = [],
    c = [],
    a = [],
    n = [],
    i = [],
    m = [0, 0.32, 0.64];
  for (let h = 0; h < o; h++) {
    let l = r() * Math.PI * 2,
      u = 0.2 * Math.sqrt(r()),
      d = Math.cos(l) * u,
      p = Math.sin(l) * u,
      x = r() * Math.PI,
      f = Math.cos(x),
      v = Math.sin(x),
      b = -v,
      g = f,
      M = 0.58 + 0.42 * r(),
      w = (0.12 + 0.4 * r()) * (r() < 0.5 ? 1 : -1),
      E = 0.03 + 0.022 * r(),
      k = r(),
      R = s.length / 3,
      H = (C, W) => {
        let T = b * w * C * C,
          P = g * w * C * C;
        for (let L of W > 0 ? [-1, 1] : [0]) {
          s.push(
            d + T + f * W * L,
            M * C * (1 - 0.1 * C * C),
            p + P + v * W * L,
          );
          let z = 0.35 + 0.4 * C,
            D = Math.hypot(b, z, g);
          (c.push((b * Math.sign(w)) / D, z / D, (g * Math.sign(w)) / D),
            a.push(C),
            n.push(k));
        }
      };
    for (let C of m) H(C, E * (1 - 0.55 * C * C));
    (H(1, 0),
      i.push(R, R + 1, R + 2, R + 2, R + 1, R + 3),
      i.push(R + 2, R + 3, R + 4, R + 4, R + 3, R + 5),
      i.push(R + 4, R + 5, R + 6));
  }
  return {
    position: new tt.Float32BufferAttribute(s, 3),
    normal: new tt.Float32BufferAttribute(c, 3),
    aT: new tt.Float32BufferAttribute(a, 1),
    aR: new tt.Float32BufferAttribute(n, 1),
    index: new tt.Uint16BufferAttribute(i, 1),
  };
}
var Er = ["position", "normal", "aT", "aR"],
  Ha = class {
    constructor(e, t, r, s = !1) {
      this.tier = e;
      this.getField = r;
      ((this.n = Math.max(1, Math.round(e.chunk / e.spacing))),
        (this.tpl = Ys(e.blades, 11)),
        (this.material = new tt.ShaderMaterial({
          uniforms: {
            ...t,
            uBladeH: { value: 0.85 },
            uRadius: { value: e.radius },
          },
          vertexShader: js,
          fragmentShader: Ks,
          side: tt.DoubleSide,
          defines: s ? { PROP_SHADOWS: "" } : {},
        })),
        (this.group.name = "grass"));
    }
    tier;
    getField;
    group = new tt.Group();
    material;
    tpl;
    cache = new Map();
    fieldRef = null;
    frame = 0;
    n;
    todo = [];
    key(e, t) {
      return (e + 32768) * 65536 + (t + 32768);
    }
    update(e, t = 2.5) {
      let r = this.getField();
      r !== this.fieldRef && (this.clear(), (this.fieldRef = r));
      let s = ++this.frame,
        c = this.tier.chunk,
        a = this.tier.radius,
        n = e.position,
        i = Math.floor((n.x - a) / c),
        m = Math.floor((n.x + a) / c),
        h = Math.floor((n.z - a) / c),
        l = Math.floor((n.z + a) / c),
        u = this.todo;
      if (((u.length = 0), n.y - Math.max(r.heightAt(n.x, n.z), 0) > a)) {
        for (let d of this.cache.values()) d.mesh && (d.mesh.visible = !1);
        return;
      }
      for (let d = h; d <= l; d++)
        for (let p = i; p <= m; p++) {
          let x = p * c,
            f = d * c,
            v = Math.max(x - n.x, 0, n.x - x - c),
            b = Math.max(f - n.z, 0, n.z - f - c),
            g = Math.hypot(v, b);
          if (g > a) continue;
          let M = this.cache.get(this.key(p, d));
          if (M) {
            if (((M.used = s), M.mesh)) {
              let w = Math.max(M.minY - n.y, 0, n.y - M.maxY - 2);
              M.mesh.visible = Math.hypot(g, w) < a;
            }
          } else u.push([g, p, d]);
        }
      for (let d of this.cache.values())
        d.used !== s && d.mesh && (d.mesh.visible = !1);
      if (u.length) {
        u.sort((p, x) => p[0] - x[0]);
        let d = performance.now();
        for (let p = 0; p < u.length; p++) {
          let [x, f, v] = u[p],
            b = this.build(r, f, v);
          if (b) {
            if (((b.used = s), b.mesh)) {
              let g = Math.max(b.minY - n.y, 0, n.y - b.maxY - 2);
              b.mesh.visible = Math.hypot(x, g) < a;
            }
            if ((this.cache.set(this.key(f, v), b), performance.now() - d > t))
              break;
          }
        }
      }
      this.cache.size > this.tier.cache && (s & 15) === 0 && this.evict(s);
    }
    islandFor(e, t, r) {
      for (let s of e.islands.values())
        if (s.contains(t, r)) return s.world ? s : void 0;
      return null;
    }
    build(e, t, r) {
      let s = this.tier.chunk,
        c = this.n,
        a = s / c,
        n = t * s,
        i = r * s,
        m = { mesh: null, used: 0, minY: 0, maxY: 0 },
        h = this.islandFor(e, n + s * 0.5, i + s * 0.5);
      if (h === void 0) return;
      if (h === null) return m;
      let l = h.world,
        u = h.spec.cx,
        d = h.spec.cz,
        [p, x] = ho(l.seed),
        f = 1e9,
        v = -1e9;
      for (let H = 0; H <= 2; H++)
        for (let C = 0; C <= 2; C++) {
          let W = $e(l, n + C * s * 0.5 - u, i + H * s * 0.5 - d);
          ((f = Math.min(f, W)), (v = Math.max(v, W)));
        }
      if (v < 0.12 || f > 330) return m;
      let b = [],
        g = 1e9,
        M = -1e9;
      for (let H = 0; H < c; H++)
        for (let C = 0; C < c; C++) {
          let W = t * c + C,
            T = r * c + H,
            P = Qt(W, T, 1),
            L = Qt(W, T, 2),
            z = (C + P) * a,
            D = (H + L) * a,
            q = n + z - u,
            N = i + D - d,
            V = $e(l, q, N);
          if (V < 0.12 || V > 312) continue;
          let G = ao(l, q, N);
          if (G >= 0 && l.wet[G] && V < l.nearLevel[G] + 0.12) continue;
          let U = $e(l, q + 3, N) - $e(l, q - 3, N),
            K = $e(l, q, N + 3) - $e(l, q, N - 3),
            X = Math.hypot(U, K) / 6,
            J = Fo(q + p, N + x, V, Xo(l, q, N), X, no(l, q, N)),
            se = J[0],
            te = J[1],
            me = n + z,
            $ = i + D,
            Z = Qt(W, T, 3),
            j = 0,
            S = 0,
            F = Ta(0.3, 0.75, te + (P - 0.5) * 0.12) * (1 - Ta(0.5, 0.85, X));
          if (F > 0.03) {
            let y =
              0.72 +
              0.6 * Mr(me * 0.045, $ * 0.045) +
              0.18 * Mr(me * 0.2, $ * 0.2);
            j =
              Ta(0.03, 0.5, F) *
              (0.62 + 0.75 * Z) *
              y *
              (0.7 + 0.3 * Ta(0.3, 0.8, se));
          } else if (se > 0.01 && se < 0.7 && Qt(W, T, 6) < 0.035 + 0.12 * se)
            ((S = 1), (j = 0.75 + 0.6 * Z));
          else continue;
          (b.push(z, V - 0.03 - X * 0.08, D, j, Qt(W, T, 4), Qt(W, T, 5), S),
            V < g && (g = V),
            V > M && (M = V));
        }
      if (!b.length) return m;
      let w = new tt.InstancedBufferGeometry();
      for (let H of Er) w.setAttribute(H, this.tpl[H]);
      w.setIndex(this.tpl.index);
      let E = new tt.InstancedInterleavedBuffer(new Float32Array(b), 7, 1);
      (w.setAttribute("aTuft", new tt.InterleavedBufferAttribute(E, 4, 0)),
        w.setAttribute("aRnd", new tt.InterleavedBufferAttribute(E, 3, 4)),
        (w.instanceCount = b.length / 7));
      let k = (M - g) * 0.5 + 2;
      w.boundingSphere = new tt.Sphere(
        new tt.Vector3(s * 0.5, (g + M) * 0.5 + 0.6, s * 0.5),
        Math.sqrt(s * s * 0.5 + k * k),
      );
      let R = new tt.Mesh(w, this.material);
      return (
        R.position.set(n, 0, i),
        R.updateMatrix(),
        (R.matrixAutoUpdate = !1),
        (R.frustumCulled = !0),
        (R.renderOrder = 0),
        this.group.add(R),
        { mesh: R, used: 0, minY: g, maxY: M }
      );
    }
    disposeChunk(e) {
      if (!e.mesh) return;
      this.group.remove(e.mesh);
      let t = e.mesh.geometry;
      t.setIndex(null);
      for (let r of Er) t.deleteAttribute(r);
      (t.dispose(), (e.mesh = null));
    }
    evict(e) {
      let t = [];
      for (let s of this.cache) s[1].used !== e && t.push(s);
      t.sort((s, c) => s[1].used - c[1].used);
      let r = this.cache.size - Math.floor(this.tier.cache * 0.85);
      for (let [s, c] of t) {
        if (r-- <= 0) break;
        (this.disposeChunk(c), this.cache.delete(s));
      }
    }
    clear() {
      for (let e of this.cache.values()) this.disposeChunk(e);
      this.cache.clear();
    }
    dispose() {
      (this.clear(), this.group.removeFromParent(), this.material.dispose());
    }
  };
var Aa = (o, e, t) => {
  let r = Math.min(Math.max((t - o) / (e - o), 0), 1);
  return r * r * (3 - 2 * r);
};
function Sr(o = 256) {
  let e = 625341585,
    t = () => (
      (e ^= e << 13),
      (e ^= e >>> 17),
      (e ^= e << 5),
      (e >>> 0) / 4294967296
    ),
    r = (b) => {
      let g = new Float32Array(b * b * 2);
      for (let E = 0; E < g.length; E++) g[E] = t();
      let M = new Float32Array(o * o),
        w = new Float32Array(o * o);
      for (let E = 0; E < o; E++)
        for (let k = 0; k < o; k++) {
          let R = ((k + 0.5) / o) * b,
            H = ((E + 0.5) / o) * b,
            C = Math.floor(R),
            W = Math.floor(H),
            T = 9,
            P = 9;
          for (let L = -1; L <= 1; L++)
            for (let z = -1; z <= 1; z++) {
              let D = C + z,
                q = W + L,
                N = ((D % b) + b) % b,
                G = ((((q % b) + b) % b) * b + N) * 2,
                U = D + g[G] - R,
                K = q + g[G + 1] - H,
                X = U * U + K * K;
              X < T ? ((P = T), (T = X)) : X < P && (P = X);
            }
          ((M[E * o + k] = Math.sqrt(T)), (w[E * o + k] = Math.sqrt(P)));
        }
      return { f1: M, f2: w };
    },
    s = (b) => {
      let g = new Float32Array(b * b);
      for (let w = 0; w < g.length; w++) g[w] = t();
      let M = new Float32Array(o * o);
      for (let w = 0; w < o; w++)
        for (let E = 0; E < o; E++) {
          let k = (E / o) * b,
            R = (w / o) * b,
            H = Math.floor(k),
            C = Math.floor(R),
            W = k - H,
            T = R - C;
          ((W = W * W * (3 - 2 * W)), (T = T * T * (3 - 2 * T)));
          let P = H % b,
            L = (H + 1) % b,
            z = C % b,
            D = (C + 1) % b,
            q = g[z * b + P],
            N = g[z * b + L],
            V = g[D * b + P],
            G = g[D * b + L];
          M[w * o + E] = (q + (N - q) * W) * (1 - T) + (V + (G - V) * W) * T;
        }
      return M;
    },
    c = r(5),
    a = r(13),
    n = r(29),
    i = s(4),
    m = s(9),
    h = s(22),
    l = o * o,
    u = new Float32Array(l),
    d = new Float32Array(l),
    p = new Float32Array(l);
  for (let b = 0; b < l; b++) {
    let g = 1 - Aa(0, 0.16, c.f2[b] - c.f1[b]),
      M = 1 - Aa(0, 0.11, a.f2[b] - a.f1[b]),
      w = 1 - Aa(0, 0.09, n.f2[b] - n.f1[b]),
      E = Aa(0.18, 0.55, a.f1[b]),
      k = i[b] * 0.55 + m[b] * 0.3 + h[b] * 0.15;
    ((u[b] = k * 0.5 + g * 0.46 + M * 0.42 + w * 0.12 - E * 0.1 + t() * 0.01),
      (d[b] = Math.pow(1 - Math.min(a.f1[b] / 0.7, 1), 2) * 0.75 + w * 0.25),
      (p[b] = w));
  }
  let x = Array.from(u.keys()).sort((b, g) => u[b] - u[g]),
    f = new Uint8Array(l * 4);
  for (let b = 0; b < l; b++) f[x[b] * 4] = Math.round((b / (l - 1)) * 255);
  for (let b = 0; b < l; b++)
    ((f[b * 4 + 1] = Math.round(Math.min(d[b], 1) * 255)),
      (f[b * 4 + 2] = Math.round(p[b] * 255)),
      (f[b * 4 + 3] = 255));
  let v = new Bt.DataTexture(f, o, o, Bt.RGBAFormat, Bt.UnsignedByteType);
  return (
    (v.wrapS = v.wrapT = Bt.RepeatWrapping),
    (v.magFilter = Bt.LinearFilter),
    (v.minFilter = Bt.LinearMipmapLinearFilter),
    (v.generateMipmaps = !0),
    (v.needsUpdate = !0),
    v
  );
}
var bn = `
precision highp float;
precision highp int;
const float PI = 3.141592653589793;
const float GRAVITY = 9.81;
vec2 cmul(vec2 a, vec2 b) { return vec2(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x); }
vec2 mulI(vec2 a) { return vec2(-a.y, a.x); }
`,
  Xs = "void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }",
  Qs = `
${bn}
uniform sampler2D uH0; uniform sampler2D uH1; uniform float uMix; uniform float uTime; uniform float uLengthScale; uniform float uDepth; uniform int uSize;
layout(location = 0) out vec4 outA;
layout(location = 1) out vec4 outB;
void main() {
  ivec2 p = ivec2(gl_FragCoord.xy);
  vec2 n = vec2(p.x < uSize / 2 ? p.x : p.x - uSize, p.y < uSize / 2 ? p.y : p.y - uSize);
  vec2 k = n * 2.0 * PI / uLengthScale;
  float kLength = max(length(k), 1e-6);
  float invK = 1.0 / kLength;
  vec4 h0 = mix(texelFetch(uH0, p, 0), texelFetch(uH1, p, 0), uMix);
  float omega = sqrt(GRAVITY * kLength * tanh(min(kLength * uDepth, 20.0)));
  float phase = omega * uTime;
  vec2 e = vec2(cos(phase), sin(phase));
  vec2 h = cmul(h0.xy, e) + cmul(h0.zw, vec2(e.x, -e.y));
  vec2 ih = mulI(h);
  vec2 dx = ih * k.x * invK;
  vec2 dz = ih * k.y * invK;
  vec2 dy = h;
  vec2 dxz = -h * k.x * k.y * invK;
  vec2 dyx = ih * k.x;
  vec2 dyz = ih * k.y;
  vec2 dxx = -h * k.x * k.x * invK;
  vec2 dzz = -h * k.y * k.y * invK;
  outA = vec4(dx + mulI(dz), dy + mulI(dxz));
  outB = vec4(dyx + mulI(dyz), dxx + mulI(dzz));
}`,
  Zs = `
${bn}
uniform sampler2D uInputA; uniform sampler2D uInputB; uniform int uSize; uniform int uSubSize; uniform bool uHorizontal;
layout(location = 0) out vec4 outA;
layout(location = 1) out vec4 outB;
void main() {
  ivec2 p = ivec2(gl_FragCoord.xy);
  int index = uHorizontal ? p.x : p.y;
  int halfSub = uSubSize / 2;
  int evenIndex = (index / uSubSize) * halfSub + (index % halfSub);
  int oddIndex = evenIndex + uSize / 2;
  ivec2 pe = uHorizontal ? ivec2(evenIndex, p.y) : ivec2(p.x, evenIndex);
  ivec2 po = uHorizontal ? ivec2(oddIndex, p.y) : ivec2(p.x, oddIndex);
  float angle = 2.0 * PI * float(index % uSubSize) / float(uSubSize);
  vec2 twiddle = vec2(cos(angle), sin(angle));
  vec4 evenA = texelFetch(uInputA, pe, 0); vec4 oddA = texelFetch(uInputA, po, 0);
  vec4 evenB = texelFetch(uInputB, pe, 0); vec4 oddB = texelFetch(uInputB, po, 0);
  outA = vec4(evenA.xy + cmul(twiddle, oddA.xy), evenA.zw + cmul(twiddle, oddA.zw));
  outB = vec4(evenB.xy + cmul(twiddle, oddB.xy), evenB.zw + cmul(twiddle, oddB.zw));
}`,
  Js = `
${bn}
uniform sampler2D uInputA; uniform sampler2D uInputB; uniform sampler2D uPrevious; uniform float uChoppiness; uniform float uDeltaTime; uniform float uFoamDecay;
layout(location = 0) out vec4 outDisplacement;
layout(location = 1) out vec4 outDerivatives;
void main() {
  ivec2 p = ivec2(gl_FragCoord.xy);
  vec4 a = texelFetch(uInputA, p, 0);
  vec4 b = texelFetch(uInputB, p, 0);
  float dx = a.x, dz = a.y, dy = a.z, dxz = a.w, dyx = b.x, dyz = b.y, dxx = b.z, dzz = b.w;
  float l = uChoppiness;
  float jacobian = (1.0 + l * dxx) * (1.0 + l * dzz) - l * l * dxz * dxz;
  float previous = texelFetch(uPrevious, p, 0).a;
  float turbulence = previous + uDeltaTime * uFoamDecay / max(jacobian, 0.5);
  turbulence = min(jacobian, turbulence);
  outDisplacement = vec4(l * dx, dy, l * dz, turbulence);
  outDerivatives = vec4(dyx, dyz, l * dxx, l * dzz);
}`,
  mo = 9.81;
function ei(o) {
  let e = o.fetch * 1e3,
    t = Math.max(o.windSpeed, 0.1);
  return {
    ...o,
    angle: (o.direction * Math.PI) / 180,
    alpha: 0.076 * Math.pow((mo * e) / (t * t), -0.22),
    peakOmega: 22 * Math.pow((t * e) / (mo * mo), -0.33),
  };
}
var Tr = (o, e) => Math.sqrt(mo * o * Math.tanh(Math.min(o * e, 20)));
function ti(o, e) {
  let t = Math.tanh(Math.min(o * e, 20)),
    r = Math.cosh(Math.min(o * e, 20));
  return (mo * ((e * o) / r / r + t)) / Tr(o, e) / 2;
}
function oi(o, e) {
  let t = o * Math.sqrt(e / mo);
  return t <= 1 ? 0.5 * t * t : t < 2 ? 1 - 0.5 * (2 - t) * (2 - t) : 1;
}
function ai(o, e, t) {
  let r = o <= t.peakOmega ? 0.07 : 0.09,
    s = o - t.peakOmega,
    c = Math.exp(-(s * s) / (2 * r * r * t.peakOmega * t.peakOmega)),
    a = t.peakOmega / o;
  return (
    t.scale *
    oi(o, e) *
    t.alpha *
    mo *
    mo *
    Math.pow(o, -5) *
    Math.exp(-1.25 * a ** 4) *
    Math.pow(Math.abs(t.peakEnhancement), c)
  );
}
var kr = [
  676.5203681218851, -1259.1392167224028, 771.3234287776531, -176.6150291621406,
  12.507343278686905, -0.13857109526572012, 9984369578019572e-21,
  15056327351493116e-23,
];
function vn(o) {
  if (o < 0.5)
    return Math.log(Math.PI / Math.abs(Math.sin(Math.PI * o))) - vn(1 - o);
  let e = o - 1,
    t = 0.9999999999998099,
    r = e + 7.5;
  for (let s = 0; s < kr.length; s++) t += kr[s] / (e + s + 1);
  return (
    0.5 * Math.log(2 * Math.PI) + (e + 0.5) * Math.log(r) - r + Math.log(t)
  );
}
var ni = (o) => Math.exp(vn(o + 1) - vn(o + 0.5)) / (2 * Math.sqrt(Math.PI));
function ri(o, e) {
  let t = o / e;
  return t > 1 ? 9.77 * Math.pow(t, -2.5) : 6.97 * Math.pow(t, 5);
}
function si(o, e) {
  let t = o - e;
  for (; t > Math.PI;) t -= 2 * Math.PI;
  for (; t < -Math.PI;) t += 2 * Math.PI;
  return t;
}
function ii(o, e, t) {
  let r =
      ri(e, t.peakOmega) +
      16 * Math.tanh(Math.min(e / t.peakOmega, 20)) * t.swell * t.swell,
    s = si(o, t.angle),
    c = ni(r) * Math.pow(Math.abs(Math.cos(0.5 * s)), 2 * r),
    a = 1 / (2 * Math.PI);
  return a + (c - a) * t.spreadBlend;
}
function li(o) {
  let e = o >>> 0;
  return () => {
    e = (e + 1831565813) >>> 0;
    let t = e;
    return (
      (t = Math.imul(t ^ (t >>> 15), t | 1)),
      (t ^= t + Math.imul(t ^ (t >>> 7), t | 61)),
      ((t ^ (t >>> 14)) >>> 0) / 4294967296
    );
  };
}
function ci(o, e) {
  let t = li(e),
    r = new Float32Array(o * o * 2);
  for (let s = 0; s < o * o; s++) {
    let c = Math.max(t(), 1e-12),
      a = t(),
      n = Math.sqrt(-2 * Math.log(c));
    ((r[s * 2] = n * Math.cos(2 * Math.PI * a)),
      (r[s * 2 + 1] = n * Math.sin(2 * Math.PI * a)));
  }
  return r;
}
function xn(o, e, t, r, s) {
  let c = t.map(ei),
    a = (2 * Math.PI) / e.lengthScale,
    n = new Float32Array(o * o * 2);
  for (let m = 0; m < o; m++) {
    let h = m < o / 2 ? m : m - o;
    for (let l = 0; l < o; l++) {
      let u = (l < o / 2 ? l : l - o) * a,
        d = h * a,
        p = Math.hypot(u, d),
        x = m * o + l;
      if (p <= e.cutoffLow || p > e.cutoffHigh) continue;
      let f = Math.atan2(d, u),
        v = Tr(p, r),
        b = ti(p, r),
        g = 0;
      for (let E of c) {
        let k = Math.exp(-E.shortWavesFade * E.shortWavesFade * p * p);
        g += ai(v, r, E) * ii(f, v, E) * k;
      }
      let M = (g * b * a * a) / p,
        w = Math.sqrt(Math.max(M, 0) / 4);
      ((n[x * 2] = s[x * 2] * w), (n[x * 2 + 1] = s[x * 2 + 1] * w));
    }
  }
  let i = new Float32Array(o * o * 4);
  for (let m = 0; m < o; m++)
    for (let h = 0; h < o; h++) {
      let l = m * o + h,
        u = ((o - m) % o) * o + ((o - h) % o);
      ((i[l * 4] = n[l * 2]),
        (i[l * 4 + 1] = n[l * 2 + 1]),
        (i[l * 4 + 2] = n[u * 2]),
        (i[l * 4 + 3] = -n[u * 2 + 1]));
    }
  return i;
}
export { Ha, Js, Qs, Rr, Sr, Wo, Xs, Zs, ci, pn, xn, yr };
