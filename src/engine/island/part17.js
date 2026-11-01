// island.js - part 17/21 (statements 178-184 of the original module).
import * as de from "three";
import { Zo, ft } from "./part06.js";
import { Ar, Cr, Dr, Fr, Hr, Lr, wn, za } from "./part11.js";
import { En, Rn } from "./part16.js";
import { createSeaGrid } from "../sea-grid.js";

function Xr(o) {
  return [
    [14, 700, 0.05, 1.4, 0.34, 9],
    [40, 900, 0.04, 1.3, 0.3, 10],
    [110, 1100, 0.032, 1.2, 0.26, 11],
    [260, 1300, 0.026, 1.1, 0.22, 12],
  ].map(([e, t, r, s, c, a]) => {
    let n = new de.InstancedBufferGeometry();
    (n.setAttribute(
      "position",
      new de.BufferAttribute(
        new Float32Array([-0.5, 0, 0, 0.5, 0, 0, -0.5, 1, 0, 0.5, 1, 0]),
        3,
      ),
    ),
      n.setIndex([0, 1, 2, 2, 1, 3]),
      n.setAttribute(
        "aS",
        new de.InstancedBufferAttribute(
          Float32Array.from({ length: t * 4 }, Math.random),
          4,
        ),
      ),
      (n.boundingSphere = new de.Sphere(new de.Vector3(), 1e6)));
    let i = new de.Mesh(
      n,
      new de.ShaderMaterial({
        transparent: !0,
        depthWrite: !1,
        side: de.DoubleSide,
        uniforms: {
          ...o,
          uBox: { value: e },
          uLen: { value: r },
          uWid: { value: s },
          uOp: { value: c },
          uSpd: { value: a },
        },
        vertexShader: Dr,
        fragmentShader: Lr,
      }),
    );
    return ((i.frustumCulled = !1), (i.renderOrder = 3), (i.userData.n = t), i);
  });
}
function Qr(o) {
  let e = new de.Group(),
    t = new de.Shape();
  (t.moveTo(0, 2.9),
    t.bezierCurveTo(0.95, 1.6, 1.15, -0.6, 0.85, -2.5),
    t.lineTo(-0.85, -2.5),
    t.bezierCurveTo(-1.15, -0.6, -0.95, 1.6, 0, 2.9));
  let r = new de.ExtrudeGeometry(t, {
    depth: 1.15,
    bevelEnabled: !0,
    bevelSize: 0.12,
    bevelThickness: 0.1,
    bevelSegments: 2,
    steps: 1,
  });
  (r.rotateX(-Math.PI / 2), r.translate(0, -0.45, 0));
  let s = (x, f) => {
    let v = x.getAttribute("position"),
      b = [];
    for (let g = 0; g < v.count; g++) b.push(...f(v.getY(g)));
    x.setAttribute("color", new de.Float32BufferAttribute(b, 3));
  };
  s(r, (x) =>
    x > 0.25
      ? [0.86, 0.85, 0.82]
      : x > -0.1
        ? [0.1, 0.22, 0.24]
        : [0.06, 0.12, 0.14],
  );
  let c = new de.ShaderMaterial({
    uniforms: o,
    vertexShader: Fr,
    fragmentShader: Cr,
    vertexColors: !0,
  });
  e.add(new de.Mesh(r, c));
  let a = new de.BoxGeometry(1.35, 1.1, 1.8);
  (a.translate(0, 0.95, -0.2),
    s(a, () => [0.84, 0.84, 0.8]),
    e.add(new de.Mesh(a, c)));
  let n = new de.CylinderGeometry(0.05, 0.06, 2.2, 6);
  (n.translate(0, 2.3, -0.4),
    s(n, () => [0.3, 0.3, 0.3]),
    e.add(new de.Mesh(n, c)));
  let i = [],
    m = (x, f) => {
      let v = (x - 0.5) * 1.42 * (1 - f * 0.12),
        b = 0.72 + f * 1.52,
        g =
          0.48 - Math.sin(x * Math.PI) * 0.16 + Math.sin(f * 7 + x * 4) * 0.025;
      return [v, g, b];
    },
    h = (x, f) => i.push(...x, ...f),
    l = 11,
    u = 9;
  for (let x = 0; x <= l; x++)
    for (let f = 0; f < u; f++) h(m(x / l, f / u), m(x / l, (f + 1) / u));
  for (let x = 0; x <= u; x++)
    for (let f = 0; f < l; f++) h(m(f / l, x / u), m((f + 1) / l, x / u));
  let d = new de.BufferGeometry();
  d.setAttribute("position", new de.Float32BufferAttribute(i, 3));
  let p = new de.LineSegments(
    d,
    new de.ShaderMaterial({
      uniforms: o,
      vertexShader:
        "varying vec3 vW;void main(){vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}",
      fragmentShader:
        ft +
        `uniform float uFog;varying vec3 vW;void main(){vec3 c=vec3(.36,.31,.22)*(hzSoft()*.55*uLight+uSunCol*.32+vec3(.02,.025,.035)*uNight);float fg=1.-exp(-length(cameraPosition-vW)*uFog*1.1);c=mix(c,horizon(),fg);gl_FragColor=vec4(c,1.);
#include <tonemapping_fragment>
#include <colorspace_fragment>
}`,
    }),
  );
  e.add(p);
  for (let x = 0; x < 5; x++) {
    let f = m(x / 4, 1),
      v = new de.SphereGeometry(0.055, 6, 4);
    (v.translate(f[0], f[1] + 0.025, f[2]),
      s(v, () => [0.58, 0.42, 0.19]),
      e.add(new de.Mesh(v, c)));
  }
  return ((e.visible = !1), e);
}
function Zr(o) {
  const grid = createSeaGrid();
  let { U: e, IU: t, fftSize: r, reflectRT: s, foamTex: c } = o,
    a = {
      ...grid.uniforms,
      uD0: { value: null },
      uD1: { value: null },
      uD2: { value: null },
      uF0: { value: null },
      uF1: { value: null },
      uF2: { value: null },
      uLS: { value: new de.Vector3(...za) },
      uTexels: { value: r },
      uReflection: { value: s.texture },
      uReflectionMatrix: { value: new de.Matrix4() },
      uReflectionActive: { value: 0 },
      uReflectionLevel: { value: 0 },
      uReflectionStrength: { value: 0.94 },
      uRefraction: { value: null },
      uRefractionMatrix: { value: new de.Matrix4() },
      uRefractionActive: { value: 0 },
      uFoamTex: { value: c },
      uSeaWakeStrength:{value:.55},uWN:{value:512},uBLp:{value:[new de.Vector4(),new de.Vector4(),new de.Vector4()]},uBLd:{value:[new de.Vector4(),new de.Vector4(),new de.Vector4()]},uBLk:{value:0},
    },
    n = new de.Mesh(
      grid.geometry,
      new de.ShaderMaterial({
        uniforms: { ...e, ...t, ...a },
        vertexShader: En,
        fragmentShader: Rn,
        transparent: !0,
        depthWrite: !1,
        side: de.DoubleSide,
        polygonOffset: !0,
        polygonOffsetFactor: -1,
        polygonOffsetUnits: -4,
        blending: de.CustomBlending,
        blendSrc: de.OneFactor,
        blendDst: de.OneMinusSrcAlphaFactor,
        blendEquation: de.AddEquation,
      }),
    );
  ((n.frustumCulled = !1), (n.renderOrder = 1));
  let i = new de.Mesh(
    n.geometry,
    new de.ShaderMaterial({
      uniforms: n.material.uniforms,
      vertexShader: En,
      fragmentShader: Rn,
      defines: { DEPTH_PREPASS: "" },
      transparent: !0,
      colorWrite: !1,
      depthWrite: !0,
      depthTest: !0,
      side: de.DoubleSide,
      polygonOffset: !0,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -2,
    }),
  );
  return (
    (i.frustumCulled = !1),
    (i.renderOrder = 0.99),
    n.add(i),
    (n.userData.depthPass = i),
    { WU: a, water: n, setQuality: grid.setQuality, update: grid.update }
  );
}
function Jr(o) {
  let e = new de.Mesh(
    new de.SphereGeometry(9e3, 24, 12),
    new de.ShaderMaterial({
      uniforms: { ...o },
      side: de.BackSide,
      depthWrite: !1,
      depthTest: !1,
      vertexShader: Hr,
      fragmentShader: Ar,
    }),
  );
  return ((e.frustumCulled = !1), (e.renderOrder = -10), e);
}
function es() {
  let o = new de.Mesh(
    new de.PlaneGeometry(9e3, 9e3).rotateX(-Math.PI / 2),
    new de.MeshBasicMaterial({ color: 666163, depthTest: !1, depthWrite: !1 }),
  );
  return ((o.renderOrder = -5), (o.position.y = -38), o);
}
var Da = `
precision highp float;
precision highp int;
uniform vec4 uBox;
uniform float uRes,uDt,uTime,uReset,uDisp;
uniform vec3 uRemap;
uniform vec2 uSwDir;
uniform float uShT,uShH;
uniform vec4 uBoat;
uniform float uBoatOn;
uniform vec2 uWind;
uniform float uFoamGain,uWetDry;
uniform sampler2D uB;
#define EPS 0.003
${wn}
vec2 worldAt(vec2 uv){return uBox.xy+(uv*uRes-.5)*uBox.z;}
bool outside(vec2 q){return q.x<0.||q.y<0.||q.x>1.||q.y>1.;}
vec2 boatLocal(vec2 p){vec2 r=p-uBoat.xy;float c=cos(uBoat.z),s=sin(uBoat.z);return vec2(r.x*c+r.y*s,-r.x*s+r.y*c);}
float hashS(vec2 p){vec3 q=fract(vec3(p.xyx)*.1031);q+=dot(q,q.yzx+33.33);return fract((q.x+q.y)*q.z);}
float noiseS(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hashS(i),hashS(i+vec2(1,0)),f.x),mix(hashS(i+vec2(0,1)),hashS(i+vec2(1,1)),f.x),f.y);}
// incident swell for fresh cells and the relaxation rim: Green's-law shoaling, depth limited
vec4 synthAt(vec2 uv,float b){
 if(b>=0.)return vec4(0.);
 vec2 p=worldAt(uv);
 // rivers, lakes and swamps: no incident swell (only wakes and what enters through the mouth)
 float calm=1.-smoothstep(.15,.85,textureLod(uB,uv,0.).b);
 vec3 s=swellRef(p,uTime)*calm;
 float d=max(-b,.02);
 float shoal=pow(SURF_DCAP/clamp(d,.65,SURF_DCAP),.25);
 float lim=.5*d;
 float eta=clamp(s.x*shoal,-lim*.8,lim);
 vec2 vel=s.yz*min(shoal*sqrt(SURF_DCAP/max(d,.65)),2.4)*smoothstep(.02,.35,d);
 float vl=.8*sqrt(SURF_G*d);
 vel*=min(1.,vl/max(length(vel),1e-3));
 return vec4(max(eta-b,0.),vel,0.);
}
// moving hull as a surface pressure: bow overpressure, stern suction (metres of head)
float hull(vec2 p){
 if(uBoatOn<.5)return 0.;
 vec2 l=boatLocal(p);float sp=abs(uBoat.w);
 float A=.12+.16*min(sp/6.,1.5);
 float bow=exp(-pow((l.x-1.5)/1.3,2.)-l.y*l.y/.55);
 float stern=exp(-pow((l.x+1.6)/1.6,2.)-l.y*l.y/.8);
 return A*(bow-.55*stern);
}
// propeller wash: water accelerated astern
vec2 jet(vec2 p){
 if(uBoatOn<.5)return vec2(0.);
 vec2 l=boatLocal(p);float sp=abs(uBoat.w);
 float m=exp(-pow((l.x+2.85)/1.25,2.)-l.y*l.y/(.34+.025*sp));
 return -vec2(cos(uBoat.z),sin(uBoat.z))*uBoat.w*.72*m;
}
`,
  ts = "void main(){gl_Position=vec4(position.xy,0.,1.);}",
  os = `
precision highp float;
precision highp int;
layout(location=0) out vec4 outB;
uniform vec4 uBox;
uniform float uRes;
${Zo}
void main(){
 vec2 uv=gl_FragCoord.xy/uRes;
 vec2 p=uBox.xy+(uv*uRes-.5)*uBox.z;
 WaterWorld w=waterWorld(p);
 outB=vec4(max(w.land.x,-12.),w.land.x,inlandOf(w),0.);
}`,
  as =
    Da +
    `
layout(location=0) out vec4 outS;
uniform sampler2D uS,uE;
float bedAt(vec2 uv){return textureLod(uB,uv,0.).r;}
vec4 readS(vec2 uv){
 vec2 q=uv*uRemap.z+uRemap.xy;
 if(uReset>.5||outside(q))return synthAt(uv,bedAt(uv));
 return textureLod(uS,q,0.);
}
// wet-normalised surface elevation blurred over 2^lod cells
float etaBlur(vec2 uv,float lod){
 vec2 e=textureLod(uE,uv*uRemap.z+uRemap.xy,lod).rg;
 return e.x/max(e.y,.02);
}
float pressureDiff(vec2 uvL,vec2 uvR,float depth,float d0){
 if(uDisp<.5)return d0;
 float M=log2(max(depth,1e-3)/uBox.z);
 if(M<=0.)return d0;
 float acc=d0,ws=1.;
 for(int i=1;i<=4;i++){
  float fi=float(i);
  float w=exp2(fi)*clamp(M-fi+1.,0.,1.);
  if(w<=0.)break;
  acc+=w*(etaBlur(uvR,fi)-etaBlur(uvL,fi));
  ws+=w;
 }
 return acc/ws;
}
float faceVel(float u0,vec4 sL,float bL,vec4 sR,float bR,float pL,float pR,float jv,vec2 uvL,vec2 uvR,float adv){
 float hL=sL.r,hR=sR.r;
 bool wL=hL>EPS,wR=hR>EPS;
 if(!wL&&!wR)return 0.;
 float eL=bL+hL,eR=bR+hR;
 if(!wR&&bR>eL)return 0.;
 if(!wL&&bL>eR)return 0.;
 float dEta=eR-eL;
 if(wL&&wR)dEta=pressureDiff(uvL,uvR,-.5*(bL+bR),dEta);
 float u=u0-uDt*adv-SURF_G*uDt*(dEta+pR-pL)/uBox.z+jv*uDt;
 float hf=max(u>0.?hL:hR,0.),hff=max(hf,.015);
  float upstream=smoothstep(.72,.98,max(textureLod(uB,uvL,0.).b,textureLod(uB,uvR,0.).b));
  u/=1.+uDt*(SURF_G*.0009*abs(u)/pow(hff,1.3333)+upstream*3.5);
 u*=exp(-uDt*(.9*max(sL.a,sR.a)+.003));
 float um=2.*sqrt(SURF_G*hff)+.4;
 return clamp(u,-um,um);
}
void main(){
 vec2 uv=gl_FragCoord.xy/uRes;
 float tx=1./uRes,dx=uBox.z;
 vec4 sC=readS(uv),sE=readS(uv+vec2(tx,0.)),sW=readS(uv-vec2(tx,0.)),sN=readS(uv+vec2(0.,tx)),sS=readS(uv-vec2(0.,tx));
 vec4 sSE=readS(uv+vec2(tx,-tx)),sNW=readS(uv+vec2(-tx,tx));
 float bC=bedAt(uv),bE=bedAt(uv+vec2(tx,0.)),bN=bedAt(uv+vec2(0.,tx));
 vec2 p=worldAt(uv);
 float pC=hull(p),pE=hull(p+vec2(dx,0.)),pN=hull(p+vec2(0.,dx));
 // momentum advection, first-order upwind on the staggered grid: the uprush
 // carries its momentum up the beach instead of creeping like a diffusion front
 float uC=sC.g,vC=sC.b;
 float vU=.25*(sC.b+sE.b+sS.b+sSE.b);
 float advU=(uC*(uC>0.?uC-sW.g:sE.g-uC)+vU*(vU>0.?uC-sS.g:sN.g-uC))/dx;
 float uV=.25*(sC.g+sW.g+sN.g+sNW.g);
 float advV=(uV*(uV>0.?vC-sW.b:sE.b-vC)+vC*(vC>0.?vC-sS.b:sN.b-vC))/dx;
 float uE=faceVel(uC,sC,bC,sE,bE,pC,pE,jet(p+vec2(dx*.5,0.)).x,uv,uv+vec2(tx,0.),advU);
 float vN=faceVel(vC,sC,bC,sN,bN,pC,pN,jet(p+vec2(0.,dx*.5)).y,uv,uv+vec2(0.,tx),advV);
 outS=vec4(sC.r,uE,vN,sC.a);
}`,
  ns =
    Da +
    `
layout(location=0) out vec4 outS;
layout(location=1) out vec4 outE;
uniform sampler2D uS;
float bedAt(vec2 uv){return textureLod(uB,uv,0.).r;}
float fdepth(float u,float hL,float hR){if(hL>EPS&&hR>EPS)return .5*(hL+hR);return max(u>0.?hL:hR,0.);}
float nuOf(vec4 s){return (.006+.22*min(s.a,1.2))*sqrt(SURF_G*max(s.r,.04))*uBox.z;}
float shockNu(float de,float hA,float hB){return .18*smoothstep(.25,.8,abs(de)/uBox.z)*sqrt(SURF_G*max(.5*(hA+hB),.04))*uBox.z;}
void main(){
 vec2 uv=gl_FragCoord.xy/uRes;
 float tx=1./uRes,dx=uBox.z,dt=uDt;
 vec4 sC=textureLod(uS,uv,0.),sE=textureLod(uS,uv+vec2(tx,0.),0.),sW=textureLod(uS,uv-vec2(tx,0.),0.),sN=textureLod(uS,uv+vec2(0.,tx),0.),sS=textureLod(uS,uv-vec2(0.,tx),0.);
 float bC=bedAt(uv),bE=bedAt(uv+vec2(tx,0.)),bW=bedAt(uv-vec2(tx,0.)),bN=bedAt(uv+vec2(0.,tx)),bS=bedAt(uv-vec2(0.,tx));
 // ---- continuity: total-depth fluxes, centred between wet cells, upwind at wet/dry fronts
 float uE=sC.g,uW=sW.g,vN=sC.b,vS=sS.b;
 float qE=uE*min(fdepth(uE,sC.r,sE.r),SURF_DCAP);
 float qW=uW*min(fdepth(uW,sW.r,sC.r),SURF_DCAP);
 float qN=vN*min(fdepth(vN,sC.r,sN.r),SURF_DCAP);
 float qS=vS*min(fdepth(vS,sS.r,sC.r),SURF_DCAP);
 float h=sC.r-dt*(qE-qW+qN-qS)/dx;
 // ---- breaking: crest too high for the depth, or front face too steep, on a wave
 //      that is running into shallower water. The roller then rides on the crest.
 float eC=bC+sC.r;
 float eE=sE.r>EPS?bE+sE.r:eC,eW=sW.r>EPS?bW+sW.r:eC,eN=sN.r>EPS?bN+sN.r:eC,eS=sS.r>EPS?bS+sS.r:eC;
 vec2 grad=vec2(eE-eW,eN-eS)/(2.*dx);
 vec2 vel=vec2(uE+uW,vN+vS)*.5;float spd=length(vel);
 vec2 dir=vel/max(spd,1e-4);
 vec2 bedSlope=vec2(bE-bW,bN-bS)/(2.*dx);
 float shoreward=smoothstep(-.004,.012,dot(dir,bedSlope));
 float d=max(-bC,0.);
 float gamma=max(eC,0.)/max(d,.12);
 float st=-dot(grad,dir);
 float cph=min(max(sqrt(SURF_G*min(sC.r,SURF_DCAP)),spd),9.);
 float rhoIn=textureLod(uS,uv-dir*cph*dt/(dx*uRes),0.).a;
 float body=smoothstep(.025,.11,sC.r);
 float onset=max(smoothstep(.42,.62,gamma)*step(.06,d),smoothstep(.3,.55,st));
 float persist=smoothstep(.07,.2,st)*smoothstep(.04,.2,rhoIn);
 float brk=max(onset,persist)*shoreward*body*smoothstep(.25,.9,spd);
 float fresh=onset*shoreward*body*(1.-smoothstep(.04,.3,rhoIn));
 float prod=brk*(1.+2.*fresh);
 float rho=min(rhoIn*exp(-dt/1.1)+dt*prod,1.5);
 // roller eddy viscosity + light shock capturing, conservative flux form
 float nC=nuOf(sC),nE=nuOf(sE),nW=nuOf(sW),nN=nuOf(sN),nS=nuOf(sS);
 float lim=.2*dx*dx/dt;
 float wC=step(EPS,sC.r);
 float kE=min(.5*(nC+nE)+shockNu(eE-eC,sC.r,sE.r),lim)*step(EPS,sE.r)*wC;
 float kW=min(.5*(nC+nW)+shockNu(eW-eC,sC.r,sW.r),lim)*step(EPS,sW.r)*wC;
 float kN=min(.5*(nC+nN)+shockNu(eN-eC,sC.r,sN.r),lim)*step(EPS,sN.r)*wC;
 float kS=min(.5*(nC+nS)+shockNu(eS-eC,sC.r,sS.r),lim)*step(EPS,sS.r)*wC;
 h=max(h+dt*(kE*(eE-eC)+kW*(eW-eC)+kN*(eN-eC)+kS*(eS-eC))/(dx*dx),0.);
 // ---- relaxation rim: generate the incident swell, absorb outgoing waves
 vec2 e=min(uv,1.-uv);float m=min(e.x,e.y)*uRes;
 float wr=1.-smoothstep(0.,24.,m);wr*=wr;
 vec4 tgt=synthAt(uv,bC);
 float k=1.-exp(-wr*dt*25.);
 h=mix(h,tgt.r,k);
 float uOut=mix(uE,tgt.g,k),vOut=mix(vN,tgt.b,k);
  float upstream=smoothstep(.72,.98,textureLod(uB,uv,0.).b);
  h=mix(h,max(-bC,0.),upstream*(1.-exp(-dt*2.5)));
  uOut*=1.-upstream*(1.-exp(-dt*3.5));
  vOut*=1.-upstream*(1.-exp(-dt*3.5));
 rho*=1.-wr;prod*=1.-wr;
 float wet=step(EPS,h);
 outS=vec4(h,uOut,vOut,rho);
 outE=vec4((bC+h)*wet,wet,prod,0.);
}`,
  rs =
    Da +
    `
layout(location=0) out vec4 outF;
uniform sampler2D uS,uF,uE;
void main(){
 vec2 uv=gl_FragCoord.xy/uRes;
 float tx=1./uRes,dx=uBox.z,dt=uDt;
 vec4 sC=textureLod(uS,uv,0.),sW=textureLod(uS,uv-vec2(tx,0.),0.),sS=textureLod(uS,uv-vec2(0.,tx),0.);
 float bC=textureLod(uB,uv,0.).r;
 float prod=textureLod(uE,uv,0.).b;
 float h=sC.r;vec2 vel=vec2(sC.g+sW.g,sC.b+sS.b)*.5;float spd=length(vel);
 vec2 p=worldAt(uv);bool dry=h<.006;
 // ground moisture is Eulerian: it never smears along with the current
 vec2 gq=uv*uRemap.z+uRemap.xy;
 vec4 g0=(uReset>.5||outside(gq))?vec4(0.):textureLod(uF,gq,0.);
 float wet=g0.g;
 // foam and stirred sand ride on the water while it is afloat
 vec2 adv=vel*smoothstep(.004,.04,h);
 vec2 q=(uv-adv*dt/(dx*uRes))*uRemap.z+uRemap.xy;
 bool lost=uReset>.5||outside(q);
 vec4 f=lost?vec4(0.):textureLod(uF,q,0.);
 float foam=f.r,murk=f.a;
 if(!lost){
  // bounded anti-diffusion keeps foam edges crisp without creating new peaks
  float fN=textureLod(uF,q+vec2(tx,0.),0.).r,fS=textureLod(uF,q-vec2(tx,0.),0.).r;
  float fE=textureLod(uF,q+vec2(0.,tx),0.).r,fW=textureLod(uF,q-vec2(0.,tx),0.).r;
  float lo=min(min(min(fN,fS),min(fE,fW)),f.r),hi=max(max(max(fN,fS),max(fE,fW)),f.r);
  foam=clamp(f.r+.12*(f.r-.25*(fN+fS+fE+fW)),lo,hi);
 }
 // sources: the roller and the breaking front, the racing uprush tongue, the boat
 float rho=sC.a;
 foam+=dt*(.62*rho+.45*prod)*uFoamGain;
 float uprush=smoothstep(.004,.03,h)*(1.-smoothstep(.1,.35,h))*smoothstep(.45,1.6,spd)*step(-1.5,bC);
 foam+=dt*.5*uprush*uFoamGain;
 if(uBoatOn>.5){
  vec2 l=boatLocal(p);float sp=abs(uBoat.w);
  float bow=exp(-pow((l.x-2.25)/.85,2.)-l.y*l.y/.42);
  float stern=exp(-pow((l.x+2.85)/1.55,2.)-l.y*l.y/(.3+.025*sp));
  foam+=dt*sp*(.62*stern+.22*bow)*uFoamGain;
  
 }
 // bubbles rise and burst: dense whitewater thins into patches within one wave period;
 // foam stranded on the sand drains away in about half a second and leaves moisture
 float life=dry?.5:mix(1.,2.5,smoothstep(.02,.12,h));
 if(dry)wet=max(wet,min(foam,1.)*.5);
 foam*=exp(-dt/(life*clamp(uFoamGain,.4,1.6)));
 foam=min(foam,1.4);
 // the sand darkens wherever water reached it and dries slowly in broad patches
 float dryTime=(30.+12.*noiseS(p*.13))*max(uWetDry,.1);
 wet=max(wet*exp(-dt/dryTime),smoothstep(.001,.018,h));
 
 
 murk=min(murk*exp(-dt/5.5)+dt*(.45*rho+.25*uprush),1.2);
 outF=vec4(foam,clamp(wet,0.,1.),0.,murk);
}`,
  ss =
    Da +
    `
layout(location=0) out vec4 outG;
uniform sampler2D uS;
void main(){
 vec2 uv=gl_FragCoord.xy/uRes;float tx=1./uRes,dx=uBox.z;
 vec4 sC=textureLod(uS,uv,0.),sE=textureLod(uS,uv+vec2(tx,0.),0.),sW=textureLod(uS,uv-vec2(tx,0.),0.),sN=textureLod(uS,uv+vec2(0.,tx),0.),sS=textureLod(uS,uv-vec2(0.,tx),0.);
 float bC=textureLod(uB,uv,0.).r,bE=textureLod(uB,uv+vec2(tx,0.),0.).r,bW=textureLod(uB,uv-vec2(tx,0.),0.).r,bN=textureLod(uB,uv+vec2(0.,tx),0.).r,bS=textureLod(uB,uv-vec2(0.,tx),0.).r;
 float eC=bC+sC.r;
 float eE=sE.r>EPS?bE+sE.r:eC,eW=sW.r>EPS?bW+sW.r:eC,eN=sN.r>EPS?bN+sN.r:eC,eS=sS.r>EPS?bS+sS.r:eC;
 outG=vec4(vec2(eE-eW,eN-eS)/(2.*dx),vec2(sE.r-sW.r,sN.r-sS.r)/(2.*dx));
}`;
export { Jr, Xr, Zr, as, es, ns, os, rs, ss, ts };
