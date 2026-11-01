// island.js - part 13/21 (statements 152-159 of the original module).
import * as Qe from "three";
import { buildFreshwaterGeometry } from "../hydrology.js";
import { Ie, ne, re } from "./part01.js";
import { ft } from "./part06.js";
import { na, ui } from "./part12.js";

function hi(o) {
  let e = [],
    t = [],
    r = [],
    s = [],
    c = (u) => {
      (e.push(u.x, ui, u.z),
        t.push(u.fx, u.fz, u.depth, u.sed),
        r.push(re(u.mask, 0, 1) * ne(0, 1.1, u.depth)),
        s.push(u.river));
    },
    a = (u, d, p) => ({
      x: u.x + (d.x - u.x) * p,
      z: u.z + (d.z - u.z) * p,
      signed: 0,
      depth: u.depth + (d.depth - u.depth) * p,
      fx: u.fx + (d.fx - u.fx) * p,
      fz: u.fz + (d.fz - u.fz) * p,
      sed: u.sed + (d.sed - u.sed) * p,
      river: u.river + (d.river - u.river) * p,
      mask: u.mask + (d.mask - u.mask) * p,
    }),
    n = (u) => {
      let d = [];
      for (let p = 0; p < u.length; p++) {
        let x = u[p],
          f = u[(p + 1) % u.length];
        (x.signed >= 0 && d.push(x),
          x.signed >= 0 != f.signed >= 0 &&
            d.push(a(x, f, x.signed / (x.signed - f.signed))));
      }
      return d;
    },
    i = o.N,
    m = new Float32Array(i * i);
  for (let u = 0; u < i * i; u++)
    m[u] = o.wet[u] ? 1 : o.h[u] < 0 ? ne(0.42, 0.94, o.inl[u]) : 0;
  let h = (u) => {
    let d = -o.h[u],
      p = Math.hypot(o.flowX[u], o.flowZ[u]);
    return {
      x: ((u % i) + 0.5) * o.cell - o.half,
      z: (((u / i) | 0) + 0.5) * o.cell - o.half,
      signed: d,
      depth: Math.max(0, d),
      fx: o.flowX[u],
      fz: o.flowZ[u],
      sed: o.sed[u],
      river: re(ne(0.05, 0.42, p), 0, 1),
      mask: m[u],
    };
  };
  for (let u = 0; u < i - 1; u++)
    for (let d = 0; d < i - 1; d++) {
      let p = u * i + d,
        x = [p, p + i, p + 1, p + i + 1],
        f = 0;
      for (let b of x) f = Math.max(f, m[b]);
      if (f <= 0.02) continue;
      let v = x.map(h);
      for (let b of [
        [0, 1, 2],
        [2, 1, 3],
      ]) {
        let g = n(b.map((M) => v[M]));
        for (let M = 1; M + 1 < g.length; M++) (c(g[0]), c(g[M]), c(g[M + 1]));
      }
    }
  let l = new Qe.BufferGeometry();
  return (
    l.setAttribute("position", new Qe.Float32BufferAttribute(e, 3)),
    l.setAttribute("aWater", new Qe.Float32BufferAttribute(t, 4)),
    l.setAttribute("aEdge", new Qe.Float32BufferAttribute(r, 1)),
    l.setAttribute("aRiver", new Qe.Float32BufferAttribute(s, 1)),
    l.computeBoundingSphere(),
    l
  );
}
var mi = `
attribute vec4 aWater;
attribute float aEdge,aRiver;
uniform float uTime,uWindAmt,uWakeCell;
uniform vec2 uWind;
uniform sampler2D uWakeTexture;
uniform vec4 uWakeBox;
varying vec3 vP;
varying vec2 vFlow;
varying float vDepth,vEdge,vRiver,vSed,vLevel,vWake;
void main(){
  vec3 p=(modelMatrix*vec4(position,1.)).xyz;
  vLevel=p.y;vDepth=aWater.z;vFlow=aWater.xy;
  vSed=aWater.w;vEdge=aEdge;vRiver=aRiver;
  // No geometric swell on inland water: the mesh is the 10 m terrain grid, and
  // a 14 m sine sampled on it aliased into regular parallel bands across every
  // lake. Calm-water relief is carried entirely by the per-pixel ripple normal.
  vec2 p2=p.xz;
  vec2 uv=(p2-uWakeBox.xy)/max(uWakeBox.z,.001);
  float inside=step(0.,uv.x)*step(uv.x,1.)*step(0.,uv.y)*step(uv.y,1.)*uWakeBox.w;
  vec4 wake=texture2D(uWakeTexture,clamp(uv,.001,.999));
  vWake=wake.b*inside;
  p.y+=wake.r*inside*aEdge;
  vP=p;
  gl_Position=projectionMatrix*viewMatrix*vec4(p,1.);
}`,
  fi =
    ft +
    `
uniform sampler2D uReflection,uRefraction,uWaterTex,uWakeTexture;
uniform float uPx;
uniform mat4 uReflectionMatrix,uRefractionMatrix;
uniform float uReflectionActive,uReflectionLevel,uRefractionActive,uFog,uWindAmt,uRain,uWakeCell;
uniform vec4 uWakeBox;
uniform vec2 uWind;
varying vec3 vP;
varying vec2 vFlow;
varying float vDepth,vEdge,vRiver,vSed,vLevel,vWake;
vec2 rotateUV(vec2 p,float a){float c=cos(a),s=sin(a);return vec2(c*p.x-s*p.y,s*p.x+c*p.y);}
// Two-phase flow-advected lookup into the baked ripple map (no derivatives, no noise).
vec4 flowTex(vec2 p,vec2 velocity,float size,float angle){
  float phase=uTime/2.4;
  float f0=fract(phase),f1=fract(phase+.5);
  float weight=1.-abs(f0*2.-1.);
  vec4 ta=texture2D(uWaterTex,rotateUV(p-velocity*f0*2.4,angle)/size);
  vec4 tb=texture2D(uWaterTex,rotateUV(p-velocity*f1*2.4,angle)/size+vec2(.43,.23));
  return mix(tb,ta,weight);
}
void main(){
  vec3 eye=cameraPosition-vP;float distanceToEye=length(eye);vec3 V=eye/max(distanceToEye,.001);
  // Ground footprint of one pixel, analytic (smooth; screen-space fwidth is blocky).
  float pixel=distanceToEye*uPx/max(V.y,.06);
  vec2 flow=vFlow,wind=normalize(uWind+vec2(.0001));
  float speed=length(flow),running=smoothstep(.10,.62,speed)*vRiver;
  float detail=1.-smoothstep(.3,2.4,pixel);
  // Ripples are advected by the authored current field, so their direction
  // rotates continuously through every bend and every junction.
  float n1=.5,n2=.5,n3=.5;vec2 slope=vec2(0.);
  float lake=1.-vRiver;
  // beyond ~650 m the ripples are sub-pixel: skip every texture lookup and show flat water
  if(distanceToEye<650.){
    vec4 t1=flowTex(vP.xz,flow*.65+wind*.24,8.7,.43);
    vec4 t2=flowTex(vP.xz,flow*1.2-wind*.15,3.17,-1.08);
    n1=t1.b;n2=t2.b;n3=t2.a;
    vec2 g1=rotateUV((t1.rg*2.-1.)*${na.toFixed(1)},-.43)/8.7;
    vec2 g2=rotateUV((t2.rg*2.-1.)*${na.toFixed(1)},1.08)/3.17;
    slope=(g1*.68+g2*.4)*(.20+.34*running)*(.35+.65*detail)*8.;
    vec4 tw=texture2D(uWaterTex,vP.xz*.045+wind*uTime*.02);
    vec2 gw=(tw.rg*2.-1.)*${na.toFixed(1)};
    float gust=.5+.5*sin(dot(vP.xz,vec2(.021,.017))+uTime*.13)*sin(dot(vP.xz,vec2(-.013,.019))-uTime*.09);
    slope+=gw*lake*(.25+.75*gust)*(.45+uWindAmt*.5)*detail*.5;
    slope*=1.-smoothstep(450.,650.,distanceToEye);
  }
  vec2 wakeUV=(vP.xz-uWakeBox.xy)/max(uWakeBox.z,.001);
  if(uWakeBox.w>.5&&vWake>.0001&&min(min(wakeUV.x,wakeUV.y),min(1.-wakeUV.x,1.-wakeUV.y))>.005){
    float e=uWakeCell/max(uWakeBox.z,.001);
    float wr=texture2D(uWakeTexture,wakeUV+vec2(e,0.)).r;
    float wd=texture2D(uWakeTexture,wakeUV+vec2(0.,e)).r;
    float wc=texture2D(uWakeTexture,wakeUV).r;
    slope+=vec2(wr-wc,wd-wc)/max(uWakeCell,.01);
  }
  vec3 N=normalize(vec3(-slope.x,1.,-slope.y));
  float nv=clamp(dot(N,V),.015,1.);
  float fresnel=.0204+.9796*pow(1.-nv,5.);
  vec3 R=reflect(-V,N);R.y=abs(R.y);
  // Planar reflection first; the (expensive, fbm-based) procedural sky is only
  // evaluated for the part of the pixel the planar probe does not cover.
  vec3 planar=vec3(0.);float rvalid=0.;
  if(uReflectionActive>.5){
    vec4 projected=uReflectionMatrix*vec4(vP.x,vLevel,vP.z,1.);
    vec2 uv=projected.xy/max(projected.w,.001)+N.xz*.012/(1.+distanceToEye*.006);
    float valid=step(.01,uv.x)*step(.01,uv.y)*step(uv.x,.99)*step(uv.y,.99)
      *step(0.,projected.w)*exp(-abs(vLevel-uReflectionLevel)*1.1);
    rvalid=valid*.93;
    if(rvalid>.001)planar=texture2D(uReflection,clamp(uv,.01,.99)).rgb;
  }
  vec3 reflection=planar*rvalid;
  if(rvalid<.99)reflection+=sky(R)*(1.-rvalid);
  float rough=clamp(.068+pixel*.012+(.08*(1.-detail))*(.4+running)+uRain*.045,0.,.42);
  vec3 H=normalize(uSun+V);
  float nh=max(dot(N,H),0.),nl=max(dot(N,uSun),0.),vh=max(dot(V,H),0.);
  float a=max(rough*rough,.002),den=nh*nh*(a-1.)+1.;
  float spec=a/max(3.14159*den*den,.0001);
  spec*=nl/(.03+4.*max(nv,.05)*max(nl,.05));
  spec*=.0204+.9796*pow(1.-vh,5.);
  vec3 glitter=uSunCol*min(spec,4.)*(1.-uStorm*.85)*smoothstep(.02,.16,uSun.y);
  float depth=max(vDepth,.02);

  // ---- body colour from the baked suspended-sediment field -----------------
  // sed ~0.0 clear teal lake \xB7 ~0.45 green-brown river \xB7 ~0.6 tan turbid
  // estuary \xB7 ~0.8 near-black tannin creek. The field is continuous across
  // every junction, so two differently coloured flows meet in a soft,
  // flow-advected mixing line instead of a hard edge.
  float sed=clamp(vSed,0.,1.);
  float tannin=smoothstep(.62,.95,sed);
  float turbid=smoothstep(.22,.72,sed)*(1.-tannin);
  vec3 clearShallow=mix(vec3(.21,.47,.42),vec3(.11,.31,.33),smoothstep(.15,2.,depth));
  vec3 clearDeep=mix(vec3(.018,.12,.145),vec3(.008,.047,.065),smoothstep(3.,22.,depth));
  vec3 body=mix(clearShallow,clearDeep,smoothstep(.8,9.,depth));
  body=mix(body,mix(vec3(.30,.23,.145),vec3(.165,.125,.08),smoothstep(.4,3.5,depth)),turbid);
  body=mix(body,mix(vec3(.055,.048,.035),vec3(.021,.020,.016),smoothstep(.3,2.5,depth)),tannin);
  // A pale sandy point bar / sandbar shows through wherever it is shallow.
  float bar=(1.-smoothstep(.12,1.1,depth))*(.35+.5*turbid);
  body=mix(body,vec3(.46,.40,.29),bar*.55);
  body=mix(body,vec3(.115,.19,.12),running*.16+uRain*.1);
  vec3 extinction=mix(vec3(.7,.36,.23),vec3(2.8,3.1,3.6),sed*sed);
  extinction=mix(extinction,vec3(.40,.22,.17),running*.35);
  vec3 transmit=exp(-extinction*min(depth/max(nv,.25),65.));
  vec3 refracted=body*(1.-transmit)*uLight;
  float validRefract=0.;
  if(uRefractionActive>.5&&distanceToEye<250.){
    vec4 q=uRefractionMatrix*vec4(vP+vec3(N.x*.19,-min(depth,3.)*.28,N.z*.19),1.);
    vec2 uv=q.xy/max(q.w,.001);
    validRefract=step(.01,uv.x)*step(.01,uv.y)*step(uv.x,.99)*step(uv.y,.99)*step(0.,q.w);
    refracted+=texture2D(uRefraction,clamp(uv,.01,.99)).rgb*transmit*validRefract;
  }
  // Shallow caustics on the bed, strongest in clear water.
  float caustic=(1.-smoothstep(.1,2.6,depth))*(1.-sed)*max(uSun.y,0.);
  caustic*=pow(max(n2*.6+n3*.4,0.),3.)*1.6;
  refracted+=uSunCol*caustic*.12*(1.-fresnel);

  vec3 color=reflection*fresnel+glitter+refracted*(1.-fresnel);
  float alpha=max(.97,1.-(1.-fresnel)*dot(transmit,vec3(.28,.46,.26))*(1.-validRefract));
  // ---- foam: banks, wind and wake only. No slope-driven rapids anywhere. ---
  float shore=(1.-smoothstep(.02,.40,depth))*(.12+.26*running)*(n2*.65+n3*.35);
  float windFoam=smoothstep(.55,1.,uWindAmt)*lake*max(n1-.72,0.)*.5;
  float wakeFoam=vWake*smoothstep(.1,.7,n1+n2*.3);
  float foam=clamp(max(shore,windFoam)+wakeFoam,0.,.9)*(1.-smoothstep(1.,4.,pixel));
  vec3 foamColor=vec3(.77,.87,.85)*(uSunCol*.42+hzSoft()*.44*uLight+vec3(.01)*uNight);
  color=mix(color,foamColor,foam);
  alpha=mix(alpha,1.,foam);
  color+=vec3(.035,.18,.13)*lake*pow(1.-nv,3.)*(1.-fresnel)*uSunCol*.15*(1.-sed);
  float fog=1.-exp(-distanceToEye*(uFog+.00055*exp(-max(cameraPosition.y-vLevel,0.)*.08)));
  color=mix(color,horizon(),fog);
  alpha=mix(alpha,1.,fog);
  alpha*=vEdge;
  gl_FragColor=vec4(color/max(alpha,.0001),alpha);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
  gl_FragColor.rgb*=gl_FragColor.a;
}`;
function Ir(o, e) {
  let t = buildFreshwaterGeometry(o),
    r = new Qe.ShaderMaterial({
      uniforms: e,
      vertexShader: mi,
      fragmentShader: fi,
      transparent: !0,
      depthWrite: !1,
      side: Qe.DoubleSide,
      blending: Qe.CustomBlending,
      blendSrc: Qe.OneFactor,
      blendDst: Qe.OneMinusSrcAlphaFactor,
      blendEquation: Qe.AddEquation,
    }),
    s = new Qe.Mesh(t, r);
  return ((s.renderOrder = 2), (s.frustumCulled = !0), s);
}
function Pr(o, e) {
  let t = Ie(o.seed ^ 305874191),
    r = [],
    s = [],
    c = Math.max(2, Math.round(o.N / 160));
  for (let m = 1; m < o.N - 1; m += c)
    for (let h = 1; h < o.N - 1; h += c) {
      let l = m * o.N + h;
      if (!(!o.wet[l] || o.swamp[l] < 0.55) && !(t() > 0.22))
        for (let u = 0; u < 3; u++)
          (r.push(
            ((l % o.N) + t()) * o.cell - o.half,
            0.1 + t() * 1.1,
            (((l / o.N) | 0) + t()) * o.cell - o.half,
          ),
            s.push(t()));
    }
  if (!r.length) return null;
  let a = new Qe.BufferGeometry();
  (a.setAttribute("position", new Qe.Float32BufferAttribute(r, 3)),
    a.setAttribute("aSeed", new Qe.Float32BufferAttribute(s, 1)));
  let n = new Qe.ShaderMaterial({
      uniforms: e,
      transparent: !0,
      depthWrite: !1,
      blending: Qe.NormalBlending,
      vertexShader: `attribute float aSeed;uniform float uTime;varying float vFade;
      void main(){vec3 p=(modelMatrix*vec4(position,1.)).xyz;
        float phase=fract(uTime*(.03+aSeed*.03)+aSeed*13.);
        p.y+=phase*(.5+aSeed*1.1);p.xz+=vec2(sin(aSeed*49.+uTime*.07),cos(aSeed*73.+uTime*.05))*4.;
        vec4 clip=viewMatrix*vec4(p,1.);gl_Position=projectionMatrix*clip;
        gl_PointSize=min(180.,(45.+aSeed*65.)*180./max(-clip.z,1.));
        vFade=(1.-abs(phase*2.-1.))*smoothstep(4.,18.,-clip.z)*(1.-smoothstep(220.,460.,-clip.z));}`,
      fragmentShader: `varying float vFade;void main(){
      float d=length(gl_PointCoord-.5)*2.;float a=(1.-smoothstep(.1,1.,d))*vFade*.035;
      gl_FragColor=vec4(.85,.89,.86,a);}`,
    }),
    i = new Qe.Points(a, n);
  return ((i.renderOrder = 2.5), i);
}
var ro = 8e3,
  Vr = 400,
  Gr = 10;
function ra(o, e, t, r) {
  let s =
    (Math.imul(o | 0, 374761393) +
      Math.imul(e | 0, 668265263) +
      Math.imul(t | 0, 2246822519) +
      Math.imul(r | 0, 1597334677)) |
    0;
  return (
    (s = Math.imul(s ^ (s >>> 13), 1274126177)),
    (s ^= s >>> 16),
    (s >>> 0) / 4294967296
  );
}
function Or(o, e, t) {
  return (o === 0 && e === 0) || ra(o, e, 1, t) < 0.72;
}
function Mn(o, e, t) {
  let r = o === 0 && e === 0,
    s = [3200, 4e3, 4800, 5400],
    c = r ? 7200 : s[Math.floor(ra(o, e, 2, t) * s.length)],
    a = c / 2,
    n = Math.max(ro / 2 - a - 150, 0),
    i = (o + 0.5) * ro + (ra(o, e, 3, t) * 2 - 1) * n - ro / 2,
    m = (e + 0.5) * ro + (ra(o, e, 4, t) * 2 - 1) * n - ro / 2;
  return {
    ix: o,
    iz: e,
    key: `${o},${e}`,
    cx: i,
    cz: m,
    seed: Math.floor(ra(o, e, 9, t) * 1e9) ^ t,
    N: Math.round(c / Gr),
    cell: Gr,
    span: c,
    half: a,
    isHome: r,
  };
}
export { Ir, Mn, Or, Pr, Vr, ro };
