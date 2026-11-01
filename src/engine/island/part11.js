// island.js - part 11/21 (statements 141-145 of the original module).
import * as Le from "three";
import { ft } from "./part06.js";
import { Js, Qs, Wo, Xs, Zs, ci, xn } from "./part10.js";

var za = [420, 61, 11],
  Fa = class {
    renderer;
    settings;
    size;
    bands;
    mix = 0;
    camera = new Le.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    scene = new Le.Scene();
    quad;
    fftTargets;
    timeMaterial;
    fftMaterial;
    assembleMaterial;
    constructor(e, t, r = 256) {
      ((this.renderer = e), (this.settings = t), (this.size = r));
      let s = new Le.BufferGeometry();
      (s.setAttribute(
        "position",
        new Le.Float32BufferAttribute([-1, -1, 0, 3, -1, 0, -1, 3, 0], 3),
      ),
        (this.quad = new Le.Mesh(s)),
        (this.quad.frustumCulled = !1),
        this.scene.add(this.quad));
      let c = () =>
        new Le.WebGLRenderTarget(r, r, {
          count: 2,
          type: Le.FloatType,
          format: Le.RGBAFormat,
          minFilter: Le.NearestFilter,
          magFilter: Le.NearestFilter,
          depthBuffer: !1,
          generateMipmaps: !1,
        });
      this.fftTargets = [c(), c()];
      let a = e.capabilities.getMaxAnisotropy(),
        n = () => {
          let l = new Le.WebGLRenderTarget(r, r, {
            count: 2,
            type: Le.HalfFloatType,
            format: Le.RGBAFormat,
            minFilter: Le.LinearMipmapLinearFilter,
            magFilter: Le.LinearFilter,
            wrapS: Le.RepeatWrapping,
            wrapT: Le.RepeatWrapping,
            depthBuffer: !1,
            generateMipmaps: !0,
            anisotropy: a,
          });
          for (let u of l.textures)
            ((u.wrapS = u.wrapT = Le.RepeatWrapping),
              (u.minFilter = Le.LinearMipmapLinearFilter),
              (u.generateMipmaps = !0),
              (u.anisotropy = a));
          return l;
        },
        i = za.map((l) => ((2 * Math.PI) / l) * 6),
        m = () => {
          let l = new Le.DataTexture(
            new Float32Array(r * r * 4),
            r,
            r,
            Le.RGBAFormat,
            Le.FloatType,
          );
          return (
            (l.minFilter = l.magFilter = Le.NearestFilter),
            (l.needsUpdate = !0),
            l
          );
        };
      this.bands = za.map((l, u) => ({
        lengthScale: l,
        cutoffLow: u === 0 ? 1e-4 : i[u],
        cutoffHigh: i[u + 1] ?? Number.POSITIVE_INFINITY,
        h0: m(),
        h0b: m(),
        noise: ci(r, 1337 + u * 7919),
        outputs: [n(), n()],
        current: 0,
      }));
      let h = {
        glslVersion: Le.GLSL3,
        vertexShader: Xs,
        depthTest: !1,
        depthWrite: !1,
      };
      ((this.timeMaterial = new Le.ShaderMaterial({
        ...h,
        fragmentShader: Qs,
        uniforms: {
          uH0: { value: null },
          uH1: { value: null },
          uMix: { value: 0 },
          uTime: { value: 0 },
          uLengthScale: { value: 1 },
          uDepth: { value: t.depth },
          uSize: { value: r },
        },
      })),
        (this.fftMaterial = new Le.ShaderMaterial({
          ...h,
          fragmentShader: Zs,
          uniforms: {
            uInputA: { value: null },
            uInputB: { value: null },
            uSize: { value: r },
            uSubSize: { value: 2 },
            uHorizontal: { value: !0 },
          },
        })),
        (this.assembleMaterial = new Le.ShaderMaterial({
          ...h,
          fragmentShader: Js,
          uniforms: {
            uInputA: { value: null },
            uInputB: { value: null },
            uPrevious: { value: null },
            uChoppiness: { value: t.choppiness },
            uDeltaTime: { value: 0 },
            uFoamDecay: { value: t.foamDecay },
          },
        })),
        this.resetFoam(),
        this.updateSpectrum());
    }
    updateSpectrum() {
      for (let e of this.bands)
        ((e.h0.image.data = xn(
          this.size,
          e,
          this.settings.systems,
          this.settings.depth,
          e.noise,
        )),
          (e.h0.needsUpdate = !0));
    }
    displacement(e) {
      let t = this.bands[e];
      return t.outputs[t.current].textures[0];
    }
    derivatives(e) {
      let t = this.bands[e];
      return t.outputs[t.current].textures[1];
    }
    update(e, t) {
      let r = this.renderer.getRenderTarget(),
        s = Math.log2(this.size);
      ((this.timeMaterial.uniforms.uDepth.value = this.settings.depth),
        (this.assembleMaterial.uniforms.uChoppiness.value =
          this.settings.choppiness),
        (this.assembleMaterial.uniforms.uFoamDecay.value =
          this.settings.foamDecay),
        (this.assembleMaterial.uniforms.uDeltaTime.value = t));
      for (let c of this.bands) {
        let a = 0;
        ((this.timeMaterial.uniforms.uH0.value = c.h0),
          (this.timeMaterial.uniforms.uH1.value = c.h0b),
          (this.timeMaterial.uniforms.uMix.value = this.mix),
          (this.timeMaterial.uniforms.uTime.value = e),
          (this.timeMaterial.uniforms.uLengthScale.value = c.lengthScale),
          this.draw(this.timeMaterial, this.fftTargets[a]));
        for (let m of [!0, !1])
          for (let h = 0; h < s; h++) {
            let l = this.fftTargets[a],
              u = this.fftTargets[a === 0 ? 1 : 0];
            ((this.fftMaterial.uniforms.uInputA.value = l.textures[0]),
              (this.fftMaterial.uniforms.uInputB.value = l.textures[1]),
              (this.fftMaterial.uniforms.uSubSize.value = 2 << h),
              (this.fftMaterial.uniforms.uHorizontal.value = m),
              this.draw(this.fftMaterial, u),
              (a = a === 0 ? 1 : 0));
          }
        let n = c.outputs[c.current],
          i = c.current === 0 ? 1 : 0;
        ((this.assembleMaterial.uniforms.uInputA.value =
          this.fftTargets[a].textures[0]),
          (this.assembleMaterial.uniforms.uInputB.value =
            this.fftTargets[a].textures[1]),
          (this.assembleMaterial.uniforms.uPrevious.value = n.textures[0]),
          this.draw(this.assembleMaterial, c.outputs[i]),
          (c.current = i));
      }
      this.renderer.setRenderTarget(r);
    }
    resetFoam() {
      let e = this.renderer.getRenderTarget(),
        t = this.renderer.getClearColor(new Le.Color()),
        r = this.renderer.getClearAlpha();
      this.renderer.setClearColor(0, 1);
      for (let s of this.bands)
        for (let c of s.outputs)
          (this.renderer.setRenderTarget(c), this.renderer.clear(!0, !1, !1));
      (this.renderer.setClearColor(t, r), this.renderer.setRenderTarget(e));
    }
    draw(e, t) {
      ((this.quad.material = e),
        this.renderer.setRenderTarget(t),
        this.renderer.render(this.scene, this.camera));
    }
    dispose() {
      for (let e of this.bands)
        (e.h0.dispose(),
          e.h0b.dispose(),
          e.outputs.forEach((t) => t.dispose()));
      (this.fftTargets.forEach((e) => e.dispose()),
        this.quad.geometry.dispose(),
        this.timeMaterial.dispose(),
        this.fftMaterial.dispose(),
        this.assembleMaterial.dispose());
    }
  };
function gn(o, e) {
  let t = Math.max(o.windSpeed, 0.1),
    r = o.fetch * 1e3,
    s = 22 * Math.pow((t * r) / 96.2, -0.33);
  return (
    (1.3 *
      o.scale *
      e *
      e *
      0.076 *
      Math.pow((9.81 * r) / (t * t), -0.22) *
      96.2) /
    (5 * s ** 4)
  );
}
var Hr = `
varying vec3 vD;
void main(){vD=position;gl_Position=projectionMatrix*viewMatrix*vec4(position+cameraPosition,1.);}`,
  Ar =
    ft +
    `
varying vec3 vD;
void main(){gl_FragColor=vec4(sky(normalize(vD)),1.);
#include <tonemapping_fragment>
#include <colorspace_fragment>
}`,
  oa = `
attribute float asway;
attribute vec3 acard;
uniform float uTime,uGrow,uFadeD,uStorm,uWindAmt;uniform vec2 uWind;
varying vec3 vC,vN,vW;varying vec2 vUv;
void main(){
 mat4 M=modelMatrix*instanceMatrix;
 vec3 ip=(M*vec4(0.,0.,0.,1.)).xyz;
 float dc=distance(cameraPosition,ip);
 float f=uGrow*(1.-smoothstep(uFadeD*.7,uFadeD,dc));
 vec3 wp=(M*vec4(position*f,1.)).xyz;
 mat3 basis=mat3(M);
 vec3 scale2=vec3(dot(basis[0],basis[0]),dot(basis[1],basis[1]),dot(basis[2],basis[2]));
 vec3 nW=normalize(basis*(normal/max(scale2,vec3(.0001))));
 float ph=uTime*1.6+dot(ip.xz,vec2(.21,.17));
 if(acard.z>0.){
  // view-aligned axes: robust from every angle (incl. straight down in survey)
  vec3 ax=vec3(viewMatrix[0][0],viewMatrix[1][0],viewMatrix[2][0]);
  vec3 ay=vec3(viewMatrix[0][1],viewMatrix[1][1],viewMatrix[2][1]);
  wp+=(ax*acard.x+ay*acard.y)*acard.z*sqrt(scale2.x)*f;
  ph+=dot(position,vec3(.71,.53,.89));
 }
 float s=(sin(ph)+.6*sin(ph*2.7+1.3))*asway*(1.+3.1*max(uWindAmt-.2,0.));
 wp.xz+=uWind*s*1.4+vec2(sin(ph*.9+ip.x),cos(ph*1.1+ip.z))*asway*.1;
 vC=color;
 #ifdef USE_INSTANCING_COLOR
 vC*=instanceColor;
 #endif
 vN=nW;vW=wp;vUv=uv;
 gl_Position=projectionMatrix*viewMatrix*vec4(wp,1.);}`,
  Ca =
    ft +
    Wo +
    `
uniform sampler2D uMap;uniform float uUseMap,uLeaf,uFog,uLodOpacity;
varying vec3 vC,vN,vW;varying vec2 vUv;
void main(){
  float dither=fract(sin(dot(floor(vW*1.35),vec3(12.9898,78.233,37.719)))*43758.5453);
  if(dither>uLodOpacity)discard;
 vec3 V=cameraPosition-vW;float dist=length(V);V/=max(dist,.001);
 // sampled in uniform control flow so the derivatives are well defined everywhere
 vec4 texel=texture2D(uMap,vUv);
 float fw=max(fwidth(texel.a),1e-4);
 vec3 texColor=vec3(1.);float alpha=1.;
 if(uUseMap>.5&&vUv.x<1.5){
  // alpha-to-coverage with a sharpened edge: crisp, anti-aliased, shimmer-free
  // leaf outlines; the threshold relaxes with distance so crowns stay full
  float cut=mix(.45,.2,smoothstep(50.,420.,dist));
  alpha=(texel.a-cut)/fw+.5;
  if(alpha<.02)discard;
    texColor=mix(vec3(.42),texel.rgb,.8)*1.1;
 }
 vec3 N=normalize(vN);
 if(uLeaf<.5&&dot(N,V)<0.)N=-N;
 float nl=dot(N,uSun);
 float dif=mix(max(nl,0.),clamp((nl+.55)/1.55,0.,1.),uLeaf);
 float tr=uLeaf*pow(max(dot(-V,uSun),0.),5.)*.6*uDay;
 vec3 amb=hzSoft()*(.26+.16*N.y)*uLight+vec3(.02,.03,.05)*uNight;
  vec3 albedo=vC*texColor*.9;
 if(uUseMap>.5&&vUv.x>1.5){
  float bark=vn(vec2(vUv.x*68.+vn(vW.yz*.2)*3.,vW.y*.9));
  // Diamond leaf-cushion scale pattern (Lepidodendron / tree-fern trunk texture) + vertical bark furrows
  float uScale=vUv.x*52.,vScale=vW.y*9.5;
  float dia=abs(sin(uScale+vScale)*sin(uScale-vScale));
  float scales=smoothstep(.18,.68,dia);
  float ridges=pow(abs(sin(vUv.x*160.+bark*3.)),5.);
  albedo*=.58+.34*bark+.22*scales+.12*ridges;
  // Mossy green-olive staining on flared bases and lower trunks near water
  albedo=mix(albedo,albedo*vec3(.56,.74,.46),(1.-smoothstep(.2,2.6,vW.y))*.72);
 }
 float shade=1.;
 #ifdef PROP_SHADOWS
 shade=propShadow(vW+N*.05);
 #endif
 // Canopy ambient occlusion darkening on lower/inner foliage & valleys
 float canopyAO=clamp(.72+.28*smoothstep(.5,12.,vW.y),0.,1.);
 vec3 col=albedo*(uSunCol*(dif*.64+tr*.48)*mix(.24,1.,shade)+amb*canopyAO+vec3(.14,.17,.26)*uNight*max(dot(N,uMoon),0.)*.5);
 // Soft blue-green aerial perspective haze fading distant canopies into atmospheric depth (Ref C)
  float hazeFactor=1.-exp(-dist*(uFog*1.05+.00016*uDay*(1.-uStorm)));
  vec3 canopyHaze=mix(horizon(),mix(horizon(),vec3(.17,.30,.26)*uLight,.4),uDay*(1.-uStorm));
 col=mix(col,canopyHaze,clamp(hazeFactor,0.,1.));
 gl_FragColor=vec4(col,clamp(alpha,0.,1.));
#include <tonemapping_fragment>
#include <colorspace_fragment>
}`,
  zr = `
uniform sampler2D uMap;uniform float uUseMap;
varying vec2 vUv;
void main(){
 float a=texture2D(uMap,vUv).a;
 if(uUseMap>.5&&vUv.x<1.5&&a<.45)discard;
 gl_FragColor=vec4(1.);
}`,
  Fr = `
varying vec3 vColor; varying vec3 vNormal; varying vec3 vWorld;
void main(){
 vColor=color;
 vec4 wp=modelMatrix*vec4(position,1.);
 vWorld=wp.xyz;
 vNormal=normalize(mat3(modelMatrix)*normal);
 gl_Position=projectionMatrix*viewMatrix*wp;
}`,
  Cr =
    ft +
    `
uniform float uFog;
varying vec3 vColor; varying vec3 vNormal; varying vec3 vWorld;
void main(){
 vec3 N=normalize(vNormal);
 float dist=length(cameraPosition-vWorld);
 vec3 V=(cameraPosition-vWorld)/max(dist,.001);
 float ndl=max(dot(N,uSun),0.);
 vec3 R=reflect(-V,N);R.y=abs(R.y);
 vec3 amb=hzSoft()*(.25+.2*N.y)*uLight+vec3(.02,.03,.05)*uNight;
 vec3 col=vColor*(amb+uSunCol*ndl*.6);
 col+=sky(R)*.08*pow(1.-max(dot(N,V),0.),3.);
 float fg=1.-exp(-dist*uFog*1.1);col=mix(col,horizon(),fg);
 gl_FragColor=vec4(col,1.);
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
}`,
  Dr = `
attribute vec4 aS;uniform float uBox,uLen,uWid,uOp,uSpd,uTime,uRain,uPx;uniform vec2 uWind;varying float vA,vU;
void main(){
 vec3 vel=normalize(vec3(uWind.x,-1.,uWind.y));
 vec3 q=mod(aS.xyz*uBox+vel*uSpd*uTime-cameraPosition+uBox*.5,uBox)-uBox*.5;
 vec3 head=cameraPosition+q+vec3(0.,uBox*.3,0.);
 vec4 a=viewMatrix*vec4(head,1.);float dep=-a.z;
 vec4 b=viewMatrix*vec4(head-vel*(dep*uLen),1.);
 vec3 sd=normalize(cross(b.xyz-a.xyz,a.xyz)+1e-6);
 float w=dep*uPx*uWid;
 gl_Position=projectionMatrix*vec4(mix(a.xyz,b.xyz,position.y)+sd*position.x*w,1.);
 vA=uOp*step(aS.w,uRain)*smoothstep(uBox*.04,uBox*.12,dep)*smoothstep(0.,3.,head.y)*(1.-smoothstep(.38,.5,length(q)/uBox));
 vU=position.x+.5;}`,
  Lr = `
uniform vec3 uRainCol;varying float vA,vU;
void main(){float e=smoothstep(0.,.5,1.-abs(vU*2.-1.));gl_FragColor=vec4(uRainCol,vA*e);
#include <tonemapping_fragment>
#include <colorspace_fragment>
}`;
var wn = `
#define SURF_DCAP 8.0
#define SURF_G 9.81
vec2 swRot(vec2 d,float a){float c=cos(a),s=sin(a);return vec2(d.x*c-d.y*s,d.x*s+d.y*c);}
// Long-crested swell at the reference depth: three components close in period and
// direction (their beating makes sets of bigger waves) plus a little wind chop.
// Returns (eta, ux, uz).
vec3 swellRef(vec2 p,float t){
 float cr=sqrt(SURF_G*SURF_DCAP);
 float T1=max(uShT,3.);
 float A=uShH*.5;
 vec2 d1=uSwDir,d2=swRot(uSwDir,.16),d3=swRot(uSwDir,-.1),d4=swRot(uSwDir,.5);
 float w1=6.2831853/T1,w2=w1/.86,w3=w1/1.17,w4=w1/.46;
 float ph1=w1*(dot(p,d1)/cr-t);
 float ph2=w2*(dot(p,d2)/cr-t)+1.7;
 float ph3=w3*(dot(p,d3)/cr-t)+4.1;
 float ph4=w4*(dot(p,d4)/(cr*.6)-t)+2.3;
 float e1=A*.6*cos(ph1),e2=A*.3*cos(ph2),e3=A*.3*cos(ph3),e4=A*.1*cos(ph4);
 vec2 u=(e1*d1+e2*d2+e3*d3+e4*d4*.6)*(cr/SURF_DCAP);
 return vec3(e1+e2+e3+e4,u);
}
`,
  aa = `
uniform sampler2D uSurfS,uSurfF,uSurfB,uSurfG,uSurfE;
uniform vec4 uSurfBox;
uniform float uSurfOn;
uniform vec2 uSwDir;
uniform float uShT,uShH;
${wn}
// same swell, but every component the mesh cannot carry (wavelength < ~4 vertex
// spacings) is faded out instead of aliasing into crawling, flickering crests
float swellEtaBL(vec2 p,float t,float spacing){
 float cr=sqrt(SURF_G*SURF_DCAP);
 float T1=max(uShT,3.);
 float A=uShH*.5;
 vec2 d1=uSwDir,d2=swRot(uSwDir,.16),d3=swRot(uSwDir,-.1),d4=swRot(uSwDir,.5);
 float w1=6.2831853/T1,w2=w1/.86,w3=w1/1.17,w4=w1/.46;
 float L=cr*T1*.86,Lc=cr*.6*T1*.46;
 float kMain=1.-smoothstep(L*.12,L*.3,spacing);
 float kChop=1.-smoothstep(Lc*.12,Lc*.3,spacing);
 float e=A*.6*cos(w1*(dot(p,d1)/cr-t))+A*.3*cos(w2*(dot(p,d2)/cr-t)+1.7)+A*.3*cos(w3*(dot(p,d3)/cr-t)+4.1);
 return e*kMain+A*.1*cos(w4*(dot(p,d4)/(cr*.6)-t)+2.3)*kChop;
}
// far field outside the simulated window: Green's-law shoaling, depth limited
float swellFarBL(vec2 p,float t,float depth,float spacing){
 if(depth<.15)return 0.;
 float e=swellEtaBL(p,t,spacing);
 float shoal=pow(SURF_DCAP/clamp(depth,.6,SURF_DCAP),.25);
 float lim=.42*depth;
 return clamp(e*shoal,-lim*.8,lim)*smoothstep(.15,.6,depth);
}
float sh1(vec2 p){vec3 q=fract(vec3(p.xyx)*.1031);q+=dot(q,q.yzx+33.33);return fract((q.x+q.y)*q.z);}
float sn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(sh1(i),sh1(i+vec2(1,0)),f.x),mix(sh1(i+vec2(0,1)),sh1(i+vec2(1,1)),f.x),f.y);}
vec2 surfUV(vec2 p){return ((p-uSurfBox.xy)/uSurfBox.z+.5)/uSurfBox.w;}
float surfMask(vec2 uv){vec2 e=min(uv,1.-uv);float m=min(e.x,e.y)*uSurfBox.w;return uSurfOn*smoothstep(24.,56.,m);}
vec4 cubicW(float v){vec4 n=vec4(1.,2.,3.,4.)-v;vec4 s=n*n*n;float x=s.x,y=s.y-4.*s.x,z=s.z-4.*s.y+6.*s.x,w=6.-x-y-z;return vec4(x,y,z,w)/6.;}
// smooth B-spline reconstruction of the simulation grid (4 bilinear fetches)
vec4 texCubic(sampler2D t,vec2 uv,float R){
 vec2 c=uv*R-.5;vec2 f=fract(c);c-=f;
 vec4 xc=cubicW(f.x),yc=cubicW(f.y);
 vec4 cc=c.xxyy+vec2(-.5,1.5).xyxy;
 vec4 ss=vec4(xc.xz+xc.yw,yc.xz+yc.yw);
 vec4 off=(cc+vec4(xc.yw,yc.yw)/ss)/R;
 vec4 s0=textureLod(t,off.xz,0.),s1=textureLod(t,off.yz,0.),s2=textureLod(t,off.xw,0.),s3=textureLod(t,off.yw,0.);
 float sx=ss.x/(ss.x+ss.y),sy=ss.z/(ss.z+ss.w);
 return mix(mix(s3,s2,sx),mix(s1,s0,sx),sy);}
// sharp, interpolating Catmull-Rom reconstruction (9 bilinear fetches)
vec4 texCR(sampler2D t,vec2 uv,float R){
 vec2 sp=uv*R;vec2 tc=floor(sp-.5)+.5;vec2 f=sp-tc;
 vec2 w0=f*(-.5+f*(1.-.5*f));
 vec2 w1=1.+f*f*(-2.5+1.5*f);
 vec2 w2=f*(.5+f*(2.-1.5*f));
 vec2 w3=f*f*(-.5+.5*f);
 vec2 w12=w1+w2;vec2 o12=w2/w12;
 vec2 t0=(tc-1.)/R,t3=(tc+2.)/R,t12=(tc+o12)/R;
 vec4 r=textureLod(t,vec2(t0.x,t0.y),0.)*w0.x*w0.y;
 r+=textureLod(t,vec2(t12.x,t0.y),0.)*w12.x*w0.y;
 r+=textureLod(t,vec2(t3.x,t0.y),0.)*w3.x*w0.y;
 r+=textureLod(t,vec2(t0.x,t12.y),0.)*w0.x*w12.y;
 r+=textureLod(t,vec2(t12.x,t12.y),0.)*w12.x*w12.y;
 r+=textureLod(t,vec2(t3.x,t12.y),0.)*w3.x*w12.y;
 r+=textureLod(t,vec2(t0.x,t3.y),0.)*w0.x*w3.y;
 r+=textureLod(t,vec2(t12.x,t3.y),0.)*w12.x*w3.y;
 r+=textureLod(t,vec2(t3.x,t3.y),0.)*w3.x*w3.y;
 return r;}
struct SurfSample{float h;float eta;vec2 vel;float rho;float mask;float w;vec2 lean;};
// spacing = distance between neighbouring mesh vertices (m)
SurfSample surfAt(vec2 p,float spacing){
 SurfSample s;vec2 uv=surfUV(p);s.mask=surfMask(uv);
 s.h=0.;s.eta=0.;s.vel=vec2(0.);s.rho=0.;s.w=0.;s.lean=vec2(0.);
 if(s.mask<=0.)return s;
 vec4 S=textureLod(uSurfS,uv,0.),B=textureLod(uSurfB,uv,0.);
 s.h=S.r;s.eta=B.r+S.r;s.vel=S.gb;s.rho=S.a;
 float depth=max(-B.g,0.);
 s.w=s.mask*(1.-smoothstep(SURF_DCAP*1.25,SURF_DCAP*2.75,depth));
 // Band limit: a vertex lattice only carries wavelengths longer than ~2 spacings.
 // Bores and breaking crests are a single sim cell sharp, so as soon as the
 // spacing exceeds one cell the surface is read from the wet-normalised,
 // pre-filtered pyramid with a footprint a little wider than the spacing.
 // Point-sampling them made every crest crossing the lattice obliquely alias
 // into a row of triangular teeth along the shore.
 float lod=log2(max(spacing/uSurfBox.z,1.));
 float far=smoothstep(.05,1.,lod);
 float wetV=step(.003,s.h);
 if(far>0.&&wetV>0.){
  vec4 E=textureLod(uSurfE,uv,lod+.75);
  float etaF=E.r/max(E.g,.02);
  s.eta=mix(s.eta,etaF,far*smoothstep(.15,.6,E.g));
 }
 // Dry vertex: never lift the sheet onto the land (eta = bed tilted whole
 // triangles up the beach into spikes and ghost sheets over the sand). Carry
 // the neighbouring water level across and tuck it just under the sand, so
 // the terrain clips the surface exactly at the simulated waterline.
 if(wetV<.5){
  vec4 Ew=textureLod(uSurfE,uv,max(lod,1.)+2.);
  float lvl=Ew.g>.01?Ew.r/Ew.g:B.r;
  s.eta=min(B.r,lvl)-.04-.03*spacing;
 }
 // a breaking crest throws its lip forward over its own trough (near field only)
 float near=1.-far;
 if(s.rho>.02&&near>0.&&wetV>0.){
  vec4 G=textureLod(uSurfG,uv,0.);
  float spd=length(s.vel);vec2 dir=s.vel/max(spd,1e-3);
  float st=-dot(G.xy,dir);
  float lean=min(s.rho,1.2)*smoothstep(.12,.5,st)*clamp(s.eta+.2,0.,3.)*.42;
  s.lean=dir*min(lean,.38*max(-B.r,.3)+.12)*near;
 }
 return s;
}
`;
export { Ar, Ca, Cr, Dr, Fr, Hr, Lr, aa, gn, oa, wn, za, zr };
