// island.js - part 16/21 (statements 177-177 of the original module).
import { Zo, ft } from "./part06.js";
import { aa } from "./part11.js";
import { SEA_DEPTH_LIMIT, SEA_GRID_VERTEX } from "../sea-grid.js";

var En = `
uniform sampler2D uD0,uD1,uD2;
uniform sampler2D uSeaWake; uniform vec3 uSeaWakeBox; uniform float uSeaWakeStrength;
uniform vec3 uLS;
uniform float uTime,uHs,uTexels;
varying vec3 vP;
varying vec2 vUV;
varying float vSim,vWaveScale;
${SEA_GRID_VERTEX}
${SEA_DEPTH_LIMIT}
${Zo}
${aa}
vec3 waveLayer(sampler2D m,vec2 p,float L,float spacing){return textureLod(m,p/L,log2(max(2.*spacing/(L/uTexels),1.))).xyz;}
void main(){
 float spacing;
 vec2 p=seaGridPoint(spacing);
 WaterWorld w=waterWorld(p);
 float bed=w.land.x,depth=max(-bed,0.);
 float calm=1.-inlandOf(w);
  if(depth>35.&&calm>.985){
    vec3 disp=waveLayer(uD0,p,uLS.x,spacing)+waveLayer(uD1,p,uLS.y,spacing)+waveLayer(uD2,p,uLS.z,spacing);
    vWaveScale=seaDepthScale(disp.y,depth);
    vP=vec3(p.x,0.,p.y)+disp*vWaveScale;
    vec2 uv=(p-uSeaWakeBox.xy)/max(uSeaWakeBox.z,1.)+.5;
    float edge=1.-smoothstep(.4,.49,max(abs(uv.x-.5),abs(uv.y-.5)));
    vP.y+=texture2D(uSeaWake,uv).r*edge*uSeaWakeStrength;
    vUV=p;vSim=0.;gl_Position=projectionMatrix*viewMatrix*vec4(vP,1.);return;
  }
 SurfSample s=surfAt(p,spacing);
 float fftWeight=offshoreGate(depth)*(1.-s.w*.92)*calm;
 vec3 disp=(waveLayer(uD0,p,uLS.x,spacing)+waveLayer(uD1,p,uLS.y,spacing))*fftWeight;
 disp+=waveLayer(uD2,p,uLS.z,spacing)*fftWeight*smoothstep(.1,1.4,depth);
 // analytic swell carries the shore waves beyond the simulated window (band-limited)
 float yFar=swellFarBL(p,uTime,depth,spacing)*(1.-s.mask)*(1.-smoothstep(SURF_DCAP*1.25,SURF_DCAP*2.75,depth))*calm;
 // simulated surface; the thin swash sheet sits a hair above the sand
 float ySim=s.eta+.01*(1.-smoothstep(0.,.14,s.h));
  // Inland is a single level plane. Only the brackish mouth receives a fading
  // share of the surf displacement; open-sea swell never climbs the valley.
  vWaveScale=seaDepthScale(disp.y+yFar,depth);
  float y=mix((disp.y+yFar)*vWaveScale,ySim*calm,s.w);
 // breaking crests lean forward over their trough
  vec2 xz=disp.xz*vWaveScale*(1.-s.w)*smoothstep(1.,8.,depth)+s.lean*s.w*calm;
  y+=length(s.lean)*.35*s.w*calm;
  vUV=p;vSim=s.w*calm;
 vec2 wakeUV=(p-uSeaWakeBox.xy)/max(uSeaWakeBox.z,1.)+.5;
  float wakeEdge=1.-smoothstep(.38,.49,max(abs(wakeUV.x-.5),abs(wakeUV.y-.5)));
  y+=texture2D(uSeaWake,wakeUV).r*wakeEdge*calm*.5;
  vP=vec3(p.x+xz.x,y,p.y+xz.y);
 gl_Position=projectionMatrix*viewMatrix*vec4(vP,1.);
}`,
  Rn =
    ft +
    `
uniform sampler2D uD0,uD1,uD2,uF0,uF1,uF2;
uniform sampler2D uSeaWake; uniform vec3 uSeaWakeBox;
uniform sampler2D uReflection;
uniform mat4 uReflectionMatrix;
uniform float uReflectionActive,uReflectionLevel,uReflectionStrength;
#ifdef WATER_REFRACTION
uniform sampler2D uRefraction;
uniform mat4 uRefractionMatrix;
uniform float uRefractionActive;
#endif
uniform vec3 uLS,uBody,uFoam;
uniform vec2 uWD;
uniform float uClar,uRough,uFog,uHs,uWindAmt,uRain;
uniform sampler2D uFoamTex;
varying vec3 vP;
varying vec2 vUV;
varying float vSim,vWaveScale;
${Zo}
${aa}
vec3 specular(vec3 L,vec3 N,vec3 V,float roughness){
 vec3 H=normalize(L+V);
 float nv=max(dot(N,V),.02),nl=max(dot(N,L),0.),nh=max(dot(N,H),0.),vh=max(dot(V,H),0.);
 float a2=roughness*roughness,d=nh*nh*(a2-1.)+1.;
 float D=a2/(3.141593*d*d);
 float vis=.5/max(nl*sqrt(nv*nv*(1.-a2)+a2)+nv*sqrt(nl*nl*(1.-a2)+a2),.0001);
 return vec3(min(D*vis*(.0204+.9796*pow(1.-vh,5.))*nl,4.));
}
vec3 reflectedWorld(vec3 N,vec3 V,float level){
 vec3 R=reflect(-V,N);R.y=abs(R.y);
 vec3 c=sky(R);
 if(uReflectionActive>.5){
  vec4 q=uReflectionMatrix*vec4(vP.x,level,vP.z,1.);
  vec2 uv=q.xy/max(q.w,.001);
  uv+=N.xz*.025/(1.+length(cameraPosition-vP)*.008);
  float border=smoothstep(.005,.055,uv.x)*(1.-smoothstep(.945,.995,uv.x));
  border*=smoothstep(.005,.055,uv.y)*(1.-smoothstep(.945,.995,uv.y));
  float confidence=border*step(.0,q.w)*exp(-abs(level-uReflectionLevel)*1.1)*uReflectionStrength;
  c=mix(c,texture2D(uReflection,clamp(uv,.002,.998)).rgb,clamp(confidence,0.,1.));
 }
 return c;
}
vec2 rot2(vec2 p,float a){float c=cos(a),s=sin(a);return vec2(c*p.x-s*p.y,s*p.x+c*p.y);}
// Foam micro-structure that travels with the current. Two copies of the tileable
// structure map at an irrational scale ratio and different rotations (so the
// tile lattice can never line up into a visible grid of blobs), each advected
// for one cycle and cross-faded half a cycle apart (variance preserving).
float foamStructure(vec2 p,vec2 vel,out float relief){
 float T=2.4,c=uTime/T;
 float f0=fract(c),f1=fract(c+.5);
 float w0=1.-abs(2.*f0-1.),w1=1.-w0;
 float nrm=1./sqrt(w0*w0+w1*w1);
 vec2 o0=fract(vec2(.1317,.7131)*floor(c)),o1=fract(vec2(.5743,.2969)*floor(c+.5));
 vec2 pa=rot2(p,.61)/9.7,va=rot2(vel,.61)/9.7;
 vec2 pb=rot2(p,-1.07)/4.3+vec2(.37,.11),vb=rot2(vel,-1.07)/4.3;
 vec4 a=(texture2D(uFoamTex,pa-va*f0*T+o0)*w0+texture2D(uFoamTex,pa-va*f1*T+o1)*w1-.5)*nrm+.5;
 vec4 b=(texture2D(uFoamTex,pb-vb*f0*T+o1.yx)*w0+texture2D(uFoamTex,pb-vb*f1*T+o0.yx)*w1-.5)*nrm+.5;
 relief=mix(a.g,b.g,.45);
 return a.r*.58+b.r*.42;
}
// value noise with analytic gradient: (value, d/dx, d/dz)
vec3 nD(vec2 p){vec2 i=floor(p),f=p-i;vec2 u=f*f*(3.-2.*f),du=6.*f*(1.-f);
 float a=sh1(i),b=sh1(i+vec2(1.,0.)),c=sh1(i+vec2(0.,1.)),d=sh1(i+vec2(1.,1.));
 float k=a-b-c+d;
 return vec3(a+(b-a)*u.x+(c-a)*u.y+k*u.x*u.y,du*(vec2(b-a,c-a)+k*u.yx));}
// two-phase flow map: a pattern carried by the current without ever stretching
vec4 flowPhases(vec2 flow){
 float T=1.6,c=uTime/T;
 float f0=fract(c),f1=fract(c+.5);
 float w0=1.-abs(2.*f0-1.);
 return vec4(-flow*f0*T,w0,f1);
}
// flow-aligned ripples and micro turbulence of running water, carried by the current
vec2 flowSlope(vec2 p,vec2 flow,float spd,float pixel){
 vec4 ph=flowPhases(flow);
 vec2 o1=-flow*ph.w*1.6;
 float b1=1.-smoothstep(.22,.65,pixel),b2=1.-smoothstep(.07,.22,pixel);
 vec2 fd=flow/max(spd,1e-4),fn=vec2(-fd.y,fd.x);
 vec2 qa=p+ph.xy,qb=p+o1+vec2(17.3,5.1);
 // Anisotropic coordinates elongated along flow direction for V-ripples & flow streaks
 vec2 ra=vec2(dot(qa,fd)*.75,dot(qa,fn)*2.1),rb=vec2(dot(qb,fd)*.75,dot(qb,fn)*2.1);
 float A1=.0055+.015*spd,A2=.0022+.0055*spd;
 vec2 gL=(nD(ra).yz*vec2(.75,2.1)*ph.z+nD(rb).yz*vec2(.75,2.1)*(1.-ph.z))*A1*b1;
 if(b2>.01){
  vec2 ra2=vec2(dot(qa,fd)*2.2,dot(qa,fn)*4.8)+3.3,rb2=vec2(dot(qb,fd)*2.2,dot(qb,fn)*4.8)+3.3;
  gL+=(nD(ra2).yz*vec2(2.2,4.8)*ph.z+nD(rb2).yz*vec2(2.2,4.8)*(1.-ph.z))*A2*b2;
 }
 return fd*gL.x+fn*gL.y;
}
// wind ripples with travelling gusts (cat-s paws) and glassy calm between them
vec2 windSlope(vec2 p,float pixel,out float gust){
 vec2 d=uWD,n=vec2(-d.y,d.x);
 vec2 gp=p*.016-d*uTime*.11;
 gust=smoothstep(.34,.78,sn(gp)*.7+sn(gp*2.7+4.2)*.3);
 float amt=(.12+.88*gust)*(.15+1.25*uWindAmt)+.6*uRain;
 vec2 r=vec2(dot(p,d),dot(p,n));
 float b1=1.-smoothstep(.15,.45,pixel),b2=1.-smoothstep(.05,.16,pixel);
 vec2 g=vec2(0.);
 vec3 a=nD(r*vec2(1.9,.75)-vec2(uTime*1.7,0.));
 g+=a.yz*vec2(1.9,.75)*.011*b1;
 if(b2>.01){vec3 b=nD(r*vec2(5.3,2.1)+vec2(-uTime*2.9,7.7));g+=b.yz*vec2(5.3,2.1)*.004*b2;}
 return (d*g.x+n*g.y)*amt;
}
// raindrop rings on calm water
vec2 rainRings(vec2 p,float pixel){
 vec2 g=vec2(0.);
 float vis=1.-smoothstep(.02,.07,pixel);
 if(vis<.01||uRain<.01)return g;
 for(int L=0;L<3;L++){
  float fl=float(L);
  vec2 q=p*2.1+vec2(fl*7.31,fl*3.17);
  vec2 i=floor(q),f=q-i-.5;
  float hh=sh1(i+fl*19.7);
  if(hh>uRain*1.1)continue;
  vec2 c=(vec2(sh1(i+3.1+fl),sh1(i+5.7+fl))-.5)*.5;
  float t=fract(uTime*(.9+.4*hh)+hh*13.);
  vec2 dd=f-c;float r=length(dd);
  float x=(r-t*.48)*28.;
  float s=sin(x*1.6)*exp(-x*x*.35)*pow(1.-t,2.);
  g+=dd/max(r,1e-3)*s*.35;
 }
 return g*vis;
}



#define uWake uSeaWake
#define uWi uSeaWakeBox
uniform float uWN;uniform vec4 uBLp[3],uBLd[3];uniform float uBLk;
vec3 seaGlint(vec3 L,vec3 N,vec3 V,float a,float nv){
 vec3 H=normalize(L+V);float nh=max(dot(N,H),0.),nl=max(dot(N,L),0.),vh=max(dot(V,H),0.);
 float a2=a*a,d=nh*nh*(a2-1.)+1.,D=a2/(3.14159*d*d);
 float Vis=.5/(nl*sqrt(nv*nv*(1.-a2)+a2)+nv*sqrt(nl*nl*(1.-a2)+a2)+1e-4);   // GGX + Smith
 return vec3(min(D*Vis*(.02+.98*pow(1.-vh,5.))*nl,6.));}                    // clamped glint
void seaOffshore(){
 vec3 V=cameraPosition-vP;float dist=length(V);V/=dist;vec2 q=vUV;float ov=smoothstep(.25,.85,uStorm);
 float calm=1.-.55*smoothstep(300.,1600.,dist);                 // far swell slopes relax: calm horizon
 vec4 dv=texture(uF0,q/uLS.x)*calm+texture(uF1,q/uLS.y)*(.5+.5*calm)+texture(uF2,q/uLS.z);
 dv.xy*=pow(vWaveScale,5.);dv.zw*=vWaveScale;
 vec2 wu=(q-uWi.xy)/uWi.z+.5,we=abs(wu-.5);float wef=(1.-smoothstep(.4,.49,max(we.x,we.y)))*(1.-smoothstep(120.,300.,dist));
 vec4 wk=texture(uWake,wu);float wtx=1./uWN;
 vec2 wg=vec2(texture(uWake,wu+vec2(wtx,0.)).x-texture(uWake,wu-vec2(wtx,0.)).x,texture(uWake,wu+vec2(0.,wtx)).x-texture(uWake,wu-vec2(0.,wtx)).x)/(2.*uWi.z*wtx);   // wake slopes
 vec3 N=normalize(vec3(-dv.x/(1.+dv.z)-wg.x*wef,1.,-dv.y/(1.+dv.w)-wg.y*wef));       // slopes from the three derivative maps + the wake
 float nvr=dot(N,V);if(nvr<0.)N=normalize(N-V*nvr*1.02);           // no black back-facing sparkles
 float nv=clamp(dot(N,V),.02,1.);
 float rough=clamp(uRough+dist*.00006+uStorm*.04,.02,.5),ra=rough*.6+.02;   // rougher with distance: no mirror sea
 float F=.02+(max(1.-rough,.02)-.02)*pow(1.-nv,5.);
 vec3 R=reflect(-V,N);R.y=abs(R.y);
 vec3 spec=seaGlint(uSun,N,V,ra,nv)*uSunCol*smoothstep(0.,.06,uSun.y)*(1.-.92*ov)+seaGlint(uMoon,N,V,ra,nv)*vec3(.14,.17,.26)*uNight*smoothstep(0.,.06,uMoon.y);
 // see-through body: absorption grows with path length (1/cos), so it is clear looking down and murky at grazing angles
 float thk=max(vP.y+.4*uHs,0.)*smoothstep(1.5,5.,uHs);   // water depth above the trough: crests are thick, only the lower flanks stay see-through
 float aB=1.-exp(-(2.6*pow(1.-uClar,2.)+.04+.9*thk)/max(nv,.07));
 vec3 body=uBody*uLight*mix(1.,.4,uStorm);
 body+=vec3(.03,.24,.34)*pow(clamp(dot(uSun,-V),0.,1.),4.)*smoothstep(-.1*uHs,.45*uHs,vP.y)*uDay*uSunCol*.9*(1.-ov);   // crest scattering
 vec3 col=sky(R)*F+spec+body*(1.-F)*aB;                                      // premultiplied
 float al=F+(1.-F)*aB;
 if(uBLk>.01){vec3 lc=vec3(0.);   // the boat's own lights on the sea: a lit pool plus glitter on the waves
  for(int i=0;i<3;i++){vec3 d=uBLp[i].xyz-vP;float r=length(d);vec3 Lv=d/r;
   float cone=uBLd[i].w<-1.5?1.:smoothstep(uBLd[i].w-.05,uBLd[i].w,dot(-Lv,uBLd[i].xyz));
   float att=uBLp[i].w/(1.+.015*r*r),dif=max(dot(N,Lv),0.),spc=pow(max(dot(N,normalize(Lv+V)),0.),70.);
   lc+=att*cone*(vec3(.35,.65,.75)*dif*.35+vec3(1.,.95,.82)*spc*1.6);}
  col+=lc;al=max(al,clamp(dot(lc,vec3(.33))*2.,0.,1.));}
 float fp=length(fwidth(vUV))*uFoam.y,pat=0.,am=.5,fr=1.;
 vec2 qs=vec2(dot(q,uWD)*.4,dot(q,vec2(-uWD.y,uWD.x)));   // stretched along the wind: streaky foam
 for(int i=0;i<4;i++){float w=1.-smoothstep(.2,.8,fp*fr);pat+=am*mix(.5,vn(qs*uFoam.y*fr+uTime*.05*fr),w);fr*=2.1;am*=.5;}
 pat/=.9375;                                                                 // fine octaves fade to the mean
 float tb=1.+(texture(uD0,q/uLS.x).a-1.)+(texture(uD1,q/uLS.y).a-1.)*.8+(texture(uD2,q/uLS.z).a-1.)*.4;   // accumulated turbulence
 float raw=clamp((uFoam.x-tb)*3.2,0.,1.);
 float fo=clamp(smoothstep(1.-uFoam.z,1.,raw*(.55+pat))+raw*.15,0.,1.);
 fo=mix(fo,raw*.35*uFoam.z,smoothstep(250.,900.,dist));
 float tip=smoothstep(.34,.66,vP.y/uHs)*smoothstep(.12,.7,uStorm)*(1.-smoothstep(250.,800.,dist));   // storm whitecaps: foam only on the highest wave tips
 fo=max(fo,tip*smoothstep(.38,.62,pat+.2*tip));
 fo*=1.-.85*smoothstep(450.,1500.,dist);                        // no foam specks on the horizon
 fo=max(fo,smoothstep(.5,.72,wk.z*1.25+(pat-.5)*.9)*wef*.85);               // the boat's foam trail: breaks into lace as it ages, no smooth smear
 vec3 fc=vec3(.92,.95,.97)*(hzSoft()*.5+uSunCol*uDay*max(dot(N,uSun),0.)*.35*(1.-.75*ov)+(.04+1.5*uStorm)*uLight);  // lit by the smooth normal
 col+=vec3(.02,.18,.26)*uLight*smoothstep(0.,.6,raw*uFoam.z)*(1.-fo)*(1.-F)*.7;
 col+=vec3(.03,.27,.31)*uLight*smoothstep(0.,.5,wk.z)*(1.-fo)*(1.-F)*wef*.5;   // aerated, bubble-filled water under the trail   // turquoise bubble layer
 col=mix(col,fc,fo);al=mix(al,1.,fo);
 float fg=1.-exp(-dist*uFog);col=mix(col,horizon(),fg);al=mix(al,1.,fg);
 gl_FragColor=vec4(col,al);
#include <tonemapping_fragment>
#include <colorspace_fragment>
}
#undef uWake
#undef uWi

void main(){
 WaterWorld w=waterWorld(vUV);
 float bed=w.land.x,depth=max(-bed,0.);
 // ---- fresh water: inland-ness, the plume spreading into the sea, the current
 float inl=inlandOf(w);
 if(depth>35.&&inl<.015){
 #ifdef DEPTH_PREPASS
 gl_FragColor=vec4(0.);
 #else
 seaOffshore();
 #endif
 return;
 }
 // ---- single-surface contract --------------------------------------------
 // Inland water is drawn by the freshwater mesh (one SDF mask covering lakes,
 // rivers, creeks, swamps and the estuary). The ocean cross-fades out over the
 // same mask with the same ramp, so the two always sum to exactly one surface
 // and the waterline, colour and foam stay continuous through every mouth.
 float rawInl=w.water.r*step(w.land.x,0.);
 float freshTakeover=smoothstep(.42,.94,rawInl);
 if(freshTakeover>.985)discard;
 vec2 flow=w.water.ba*step(bed,.3);float fspd=length(flow);
 float plumeN=(sn(vUV*.011+vec2(uTime*.004,-uTime*.003))-.5)*.34+(sn(vUV*.047)-.5)*.14;
 float freshMix=max(inl,smoothstep(.12,.55,w.water.r*step(bed,.3)+plumeN));
 vec2 suv=surfUV(vUV);float mask=surfMask(suv);float wS=vSim;
 vec3 V=cameraPosition-vP;float distanceToEye=length(V);V/=max(distanceToEye,.001);
 // world-space footprint of this pixel and the matching simulation mip level
 float pixel=length(fwidth(vUV));
 float detail=1.-smoothstep(.6,3.,pixel);
 float simLod=log2(max(pixel/uSurfBox.z,1.));
 float simFar=smoothstep(.7,2.,simLod);

 // ---- shoreline simulation: smooth thickness, crisp (near) / filtered (far) slopes
 float hS=0.,rho=0.,murk=0.,foamD=0.;
 vec2 gradE=vec2(0.),gradH=vec2(0.),vel=vec2(0.);
 if(mask>0.){
  float R=uSurfBox.w;
  vec4 S=texCubic(uSurfS,suv,R);
  vec4 Gs=vec4(0.);
  if(simFar<.999)Gs=texCR(uSurfG,suv,R);
  if(simFar>.001)Gs=mix(Gs,textureLod(uSurfG,suv,simLod),simFar);
  vec4 Fs=textureLod(uSurfF,suv,simLod);
  hS=S.r;rho=S.a*(1.-simFar);vel=S.gb;foamD=Fs.r;murk=Fs.a;
  gradE=Gs.xy;gradH=Gs.zw;
 }
 float column=mix(vP.y-bed,hS,wS);
 // films thinner than 5 mm read as wet sand (terrain shader), not as water
  if(column<.005)discard;
 #ifdef DEPTH_PREPASS
  // Depth-only pass: lay down the nearest open-sea surface so the colour pass
  // draws only the front-most wave (no far crests bleeding through near ones).
  // Inland/plume water and razor-thin swash are skipped so the freshwater sheet
  // and the beach are never occluded by an invisible ocean fragment.
  if(freshTakeover>.01||column<.04)discard;
  gl_FragColor=vec4(0.);
  return;
 #endif

 // ---- surface slope: FFT offshore, simulated surface in the surf zone, fine wind ripples
 float fftWeight=offshoreGate(depth)*(1.-wS*.92)*(1.-inl);
  vec4 derivatives=vec4(0.);
  if(fftWeight>.002){
   derivatives=(texture2D(uF0,vUV/uLS.x)+texture2D(uF1,vUV/uLS.y))*fftWeight;
   derivatives+=texture2D(uF2,vUV/uLS.z)*fftWeight*smoothstep(.1,1.4,depth);
  }
 derivatives.xy*=pow(vWaveScale,5.);derivatives.zw*=vWaveScale;
 vec2 slope=vec2(derivatives.x/max(.2,1.+derivatives.z),derivatives.y/max(.2,1.+derivatives.w));
 slope+=clamp(gradE,vec2(-2.5),vec2(2.5))*wS;
 // ripples are only drawn where the pixel can resolve them; their lost slope
 // variance is handed to the roughness instead (no sparkle crawl at distance)
 float rip1=1.-smoothstep(.12,.45,pixel),rip2=1.-smoothstep(.04,.14,pixel);
 vec2 rp=vUV*vec2(2.3,1.9)+uWD*uTime*1.1;
 vec2 rp2=vUV*vec2(5.7,6.3)-uWD.yx*uTime*.7;
 float ripAmt=wS*smoothstep(.02,.25,column)*(.45+.18*min(uHs,4.))*(1.-inl);
 slope+=(vec2(sn(rp)-.5,sn(rp+7.3)-.5)*.11*rip1+vec2(sn(rp2)-.5,sn(rp2+3.1)-.5)*.05*rip2)*ripAmt;
 // ---- inland water body weights: open lake, running river, tannin swamp
 float swampish=clamp(w.water.g,0.,1.)*inl;
 float riverW=clamp(smoothstep(.065,.34,fspd)*(1.-swampish*.6),0.,1.)*inl;
 float lakeW=clamp((1.-riverW)*(1.-swampish),0.,1.)*inl;
 float still=1.-smoothstep(.06,.28,fspd);

 // ---- inland surface: glassy lakes, flow-aligned river ripples, nearly still swamps
 float gust=0.;
 if(freshMix>.002){
  vec2 fs=flowSlope(vUV,flow,fspd,pixel)*smoothstep(.02,.14,fspd+.03);
  // Calm glassy lakes (.38 wind) and nearly still swamps (.10 wind) for crisp tree reflections
  float calmWind=mix(1.,mix(.38,.10,clamp(swampish*1.3,0.,1.)),still);
  vec2 ws=windSlope(vUV,pixel,gust)*(1.-.55*smoothstep(.28,.85,fspd))*calmWind;
  slope+=(fs+ws)*freshMix*smoothstep(.01,.12,column);
 }
 slope+=rainRings(vUV,pixel)*(.35+.65*freshMix)*smoothstep(.02,.1,column);
 // thin swash film: it conforms to the sand, so its skin is broken by backwash
 // rills and grain-scale roughness instead of reading as a glassy white sheet
 float thinFilm=wS*(1.-smoothstep(.012,.09,column))*(1.-inl);
 if(thinFilm>.01){
  vec2 fdS=vel/max(length(vel),1e-3),fnS=vec2(-fdS.y,fdS.x);
  vec2 rq=vec2(dot(vUV,fdS)*.9,dot(vUV,fnS)*3.4)-vec2(uTime*.35,0.);
  float rv=1.-smoothstep(.05,.3,pixel);
  slope+=(vec2(sn(rq)-.5,sn(rq+5.2)-.5)*.16+vec2(sn(vUV*7.3)-.5,sn(vUV*7.3+2.7)-.5)*.06)*thinFilm*rv;
 }
 vec3 N=normalize(vec3(-slope.x,1.,-slope.y));
 // rounded leading edge: the meniscus curls outward and down onto the sand
 float edge=(1.-smoothstep(.006,.045,column))*wS*(1.-simFar);
 vec2 outward=-gradH/max(length(gradH),1e-4);
 N=normalize(mix(N,normalize(vec3(outward.x,.62,outward.y)),edge*.75));
 float nvr=dot(N,V);if(nvr<.01)N=normalize(N-V*min(nvr,0.));
 float nv=clamp(dot(N,V),.015,1.);
 // Fresnel reflection: slightly boosted on still glassy lakes and dark swamp mirrors
 float fBase=mix(.0204,.038,freshMix*(.65*lakeW+.85*swampish));
 float F=fBase+(1.-fBase)*pow(1.-nv,5.);
 // a film a few millimetres thick is no optical flat: its mirror breaks into patches
 F*=mix(1.,.45+.55*smoothstep(.25,.75,sn(vUV*2.3+vec2(3.7,1.9))),thinFilm*.85);
 float rough=uRough*.6+.025+distanceToEye*.000025+(.03*simFar+.035*(1.-rip1*.5-rip2*.5))*ripAmt;
 // Glassy lakes and still swamps have very low roughness so trees and peaks reflect crisply
 float roughF=.006+distanceToEye*.00001+.038*smoothstep(.35,1.,(.1+.9*gust)*uWindAmt)*(1.-swampish*.85)*smoothstep(.08,.4,pixel)+.035*uRain+.018*fspd*smoothstep(.1,.5,pixel);
 rough=mix(rough,roughF,freshMix);
 vec3 reflected=reflectedWorld(N,V,0.);
 float overcast=smoothstep(.25,.85,uStorm);
 vec3 sparkle=specular(uSun,N,V,rough)*uSunCol*(1.-.88*overcast)*smoothstep(0.,.06,uSun.y)*(1.-swampish*.55);
 sparkle+=specular(uMoon,N,V,rough)*vec3(.10,.13,.2)*uNight;

 // ---- body colour:
 //      \u2022 Open lakes: bright turquoise shallow littoral rim -> clear blue-teal -> deep dark teal
 //      \u2022 Rivers: sediment shallows -> olive green-brown -> deep river channel
 //      \u2022 Swamps: olive/tea bank shallows -> dark tannin-brown / nearly black in deep pockets (Ref C & D)
 float surfMurk=clamp(murk,0.,1.)*mask;
 float path=min(column,45.)/max(nv,.19);
 float extinction=.12+.6*pow(1.-uClar,2.);
 float absorption=0.;
 vec3 seaBody=mix(vec3(.07,.6,.7),uBody,smoothstep(1.6,24.,depth));
 seaBody=mix(seaBody,vec3(.28,.8,.8),smoothstep(2.6,.4,depth)*.42);
 seaBody=mix(seaBody,vec3(.46,.55,.44),surfMurk*.55);

 // 1) Lake colour: bright turquoise littoral rim fading into clear blue-teal then deep basin teal
 float shallowRim=1.-smoothstep(.35,3.2,depth);
 vec3 lakeCol=mix(vec3(.042,.225,.255),vec3(.011,.058,.085),smoothstep(2.4,16.,depth));
 lakeCol=mix(lakeCol,vec3(.17,.54,.52),shallowRim*.72);

 // 2) River colour: green-brown running water with warm sediment shallows
 vec3 riverCol=mix(vec3(.085,.152,.082),vec3(.028,.062,.038),smoothstep(1.1,6.5,depth));
 riverCol=mix(riverCol,vec3(.19,.205,.115),(1.-smoothstep(.15,1.3,depth))*.52);

 // 3) Swamp colour: olive-tea at the bank edge, dark tannin-brown/nearly black where deep (Ref C & D)
 vec3 swampCol=mix(vec3(.068,.078,.034),vec3(.007,.009,.006),smoothstep(.22,1.35,depth));

 vec3 freshBody=lakeCol*lakeW+riverCol*riverW+swampCol*swampish;
 float normW=max(lakeW+riverW+swampish,1e-4);
 freshBody/=normW;
 // Soft sediment-coloured shoreline rim right at the water edge (0..0.45 m)
 float shoreSed=(1.-smoothstep(.04,.48,column))*inl;
 freshBody=mix(freshBody,mix(vec3(.22,.21,.13),vec3(.11,.095,.055),swampish),shoreSed*.42);

 float silt=clamp(uRain*.75+uStorm*.3,0.,.85);
 freshBody=mix(freshBody,vec3(.26,.205,.14),silt);
 // Strong depth absorption: clear on lake shelves, medium in rivers, rapid dark tannin absorption in swamps
 float extLake=mix(.13,.24,smoothstep(1.8,9.,depth));
 float extRiver=.28;
 float extSwamp=mix(.85,1.65,smoothstep(.25,1.2,depth));
 float extF=((extLake*lakeW+extRiver*riverW+extSwamp*swampish)/normW)*(1.+1.8*silt);

 // the plume: river water spreading over the sea, a feathered front
 vec3 plumeBody=mix(seaBody,freshBody*1.6+vec3(.02,.06,.05),.55);
 seaBody=mix(seaBody,mix(plumeBody,freshBody,inl),freshMix);
 extinction=mix(extinction,extF,freshMix);
 absorption=max(1.-exp(-path*extinction),surfMurk*.5);
 vec3 body=seaBody*uLight*mix(1.,.5,uStorm);
 vec3 color=reflected*F+sparkle+body*(1.-F)*absorption;
 float alpha=F+(1.-F)*absorption;
  #ifdef WATER_REFRACTION
  if(uRefractionActive>.5&&freshMix>.5){
   vec2 bend=N.xz*min(column,3.)*.32*smoothstep(.05,.5,column);
   vec4 q=uRefractionMatrix*vec4(vP.x+bend.x,0.,vP.z+bend.y,1.);
   vec2 ruv=q.xy/max(q.w,.001);
   float valid=step(.005,ruv.x)*step(.005,ruv.y)*step(ruv.x,.995)*step(ruv.y,.995)*step(0.,q.w);
   vec3 through=texture2D(uRefraction,clamp(ruv,.005,.995)).rgb;
   color+=through*(1.-alpha)*valid;
   alpha=mix(alpha,1.,valid);
  }
  #endif
 // sunlight through steep, thin wave faces just before they break
 float spd=length(vel);vec2 dir=vel/max(spd,1e-3);
 float back=pow(max(dot(-V,uSun)*.5+.5,0.),3.);
 float waveFace=smoothstep(.1,.45,-dot(gradE,dir))*smoothstep(.4,1.6,column)*wS;
 color+=vec3(.03,.32,.27)*waveFace*(.25+1.2*back)*(uSunCol*.45+hzSoft()*.3*uLight)*(1.-F);
 // the sheet's own shadow line where it meets the sand
 color*=1.-.18*edge*smoothstep(.005,.02,column);

 // ---- foam: simulated density -> coverage. Near: advected lace / roller.
 //      Far: the footprint spans many bubbles, so draw the mean coverage.
 float coverage=0.,relief=.5;
 if(mask>0.){
  float dens=clamp(foamD,0.,1.2);
  float farCov=clamp(dens*.6,0.,.78)*smoothstep(.03,.14,dens);
  float structDetail=1.-smoothstep(.35,1.6,pixel);
  float nearCov=0.;
  if(structDetail>.001){
   float rel;
   float structure=foamStructure(vUV,vel*.9,rel)+(sn(vUV*.045+3.1)-.5)*.16;
   float aa=clamp(.085+pixel*.22,.085,.4);
   float d2=pow(clamp(dens,0.,1.),1.5)*.88;
   float residual=smoothstep(1.-d2-aa,1.-d2+aa,structure)*smoothstep(.06,.2,d2);
   float roller=smoothstep(.15,.7,rho)*smoothstep(.2,.5,structure+.35*rho);
   // soft (never dotted) wet rim on the advancing swash tongue
   float rim=(1.-smoothstep(.012,.05,column))*smoothstep(.005,.014,column)*smoothstep(.4,1.3,spd)*step(-1.5,bed);
   nearCov=max(max(residual*.94,roller*.9),rim*smoothstep(.35,.75,structure)*.5);
   // the uprush tongue: a bright, ragged lip of bubbles riding the leading edge
   vec2 outS=-gradH/max(length(gradH),1e-4);
   float onshore=smoothstep(.1,.55,dot(vel,outS));
   float lipBand=smoothstep(.003,.008,column)*(1.-smoothstep(.018,.055,column));
   float lace=smoothstep(.42,.68,structure+(sn(vUV*1.9+vec2(5.1,2.3))-.5)*.3);
   float lip=lipBand*onshore*lace*step(-1.5,bed);
   // translucent bubble veil beneath the lace: aerated water is milky, not paint
   float veil=smoothstep(.04,.5,dens)*(1.-residual)*.3;
   nearCov=max(nearCov,max(lip*.95,veil));
   relief=rel;
  }
  coverage=mix(farCov,nearCov,structDetail)*smoothstep(.006,.03,column)*mask;
 }
  float fftFoam=0.;
  if(fftWeight>.002){
   float turbulence=1.+(texture2D(uD0,vUV/uLS.x).a-1.)+.8*(texture2D(uD1,vUV/uLS.y).a-1.)+.4*(texture2D(uD2,vUV/uLS.z).a-1.);
   fftFoam=clamp((uFoam.x-turbulence)*2.,0.,1.)*fftWeight;
  }
  // ---- running water: gentle flow streaks, riffles, and soft shoreline foam;
  //      swamp & slow-water zones: patchy floating carpet (duckweed, water lettuce,
  //      lily-pad clusters) broken into clumps and open dark channels with contact darkening.
 float freshFoam=0.,floatMat=0.,floatShadow=0.,lettuce=0.,lilyClump=0.;
 if(freshMix>.01){
  vec4 ph=flowPhases(flow);
  vec2 qa=vUV+ph.xy,qb=vUV-flow*ph.w*1.6+vec2(11.,3.);
  float fd=1.-smoothstep(.3,1.4,pixel);
  vec2 fdir=flow/max(fspd,1e-4),fnrm=vec2(-fdir.y,fdir.x);
  // Flow-aligned coordinates for subtle longitudinal river streaks
  vec2 sa=vec2(dot(qa,fdir)*.32,dot(qa,fnrm)*1.85),sb=vec2(dot(qb,fdir)*.32,dot(qb,fnrm)*1.85);
  float fa=sn(sa)*.62+sn(qa*2.1)*.38,fb=sn(sb)*.62+sn(qb*2.1)*.38;
  float fn=mix(.5,fa*ph.z+fb*(1.-ph.z),fd);
  float riff=smoothstep(.26,.9,fspd)*(1.-smoothstep(.22,.9,column));
  freshFoam=smoothstep(.68-.28*riff,.84-.18*riff,fn)*riff*.88;
  // Subtle flow streaks along river current
  float streak=smoothstep(.12,.48,fspd)*smoothstep(.64,.82,fn)*.32;
  color+=mix(vec3(.04,.07,.05),vec3(.12,.16,.14),lakeW)*streak*uLight*inl*(1.-swampish);
  float lanes=smoothstep(.22,.62,fspd)*smoothstep(.79,.87,fn)*.42;
  // Soft shoreline foam / wet-sand rim on lakes and rivers
  float shoreRim=(1.-smoothstep(.02,.24,column))*smoothstep(.006,.025,column)*(1.-swampish*.75);
  float bankLine=shoreRim*(.22+.38*smoothstep(.12,.5,fspd))*smoothstep(.48,.74,sn(vUV*.24-flow*uTime*.06));
  freshFoam=max(max(freshFoam,lanes),bankLine)*inl;

  // ---- Floating vegetation layer (Ref D & C): patchy duckweed, water lettuce & lily-pad clusters
  //      with domain-warped noise masks so the carpet breaks into clumps and open dark channels.
  float slowZone=(1.-smoothstep(.08,.26,fspd))*inl*(1.-smoothstep(.8,2.8,depth));
  float vegHab=clamp(swampish*1.18+slowZone*.42,0.,1.)*smoothstep(.02,.14,column)*(1.-silt*.65);
  if(vegHab>.01){
   vec2 wp=vUV+vec2(sn(vUV*.032+1.7)-.5,sn(vUV*.032+8.3)-.5)*16.+flow*uTime*.025;
   // Open dark channels cut through the floating mat
   float chanField=abs(sn(wp*.024+vec2(4.1,-2.3))-.5);
   float openChan=smoothstep(.045,.15,chanField)*(1.-smoothstep(.11,.24,fspd));
   // Multi-scale clump mask: large rafts + smaller detached clusters
   float macroClump=sn(wp*.052)*.58+sn(wp*.13+5.7)*.42;
   float microClump=mix(.55,sn(vUV*1.4)*.6+sn(vUV*4.2+2.1)*.4,1.-smoothstep(.15,.85,pixel));
   float carpetField=macroClump*openChan*(.72+.28*microClump);
   // Soft contact shadow / darkening halo slightly wider than the plant clumps
   floatShadow=smoothstep(.34,.52,carpetField)*vegHab;
   floatMat=smoothstep(.44,.58,carpetField)*vegHab*(.82+.18*smoothstep(.35,.7,microClump));
   lettuce=smoothstep(.54,.72,sn(wp*.29+9.1))*floatMat;
   lilyClump=smoothstep(.60,.76,sn(wp*.19-4.4))*(1.-lettuce*.7)*floatMat;
  }
 }
 vec2 boatWakeUV=(vUV-uSeaWakeBox.xy)/max(uSeaWakeBox.z,1.)+.5;
 float boatWakeEdge=1.-smoothstep(.38,.49,max(abs(boatWakeUV.x-.5),abs(boatWakeUV.y-.5)));
 float boatFoam=texture2D(uSeaWake,boatWakeUV).b*boatWakeEdge*(1.-inl);
 float foam=max(max(max(fftFoam,coverage),freshFoam),boatFoam*.8)*mix(.72,1.,detail);
 foam*=1.-smoothstep(3200.,11000.,distanceToEye);
 // foam is a rough, bright, slightly translucent layer lit by sun and sky only
 float wrap=clamp((dot(N,uSun)+.3)/1.3,0.,1.);
 vec3 foamLit=vec3(.88,.91,.92)*(hzSoft()*(.42+.16*N.y)*uLight+uSunCol*wrap*.55+vec3(.015,.02,.03)*uNight)*(.82+.18*relief);
 color=mix(color,foamLit,foam);alpha=mix(alpha,1.,foam);

 // Contact darkening under and around the floating aquatic plant clumps
 if(floatShadow>.002){
  color*=1.-.46*floatShadow*(1.-floatMat*.55);
 }
 if(floatMat>.002){
  float microF=1.-smoothstep(.08,.45,pixel);
  float texG=mix(.5,sn(vUV*2.6)*.6+sn(vUV*7.8)*.4,microF);
  // Warm sunlit yellow-green duckweed base, ribbed lime water-lettuce rosettes, and deep-green lily pads
  vec3 duckCol=mix(vec3(.20,.34,.065),vec3(.34,.47,.115),texG);
  vec3 letCol=mix(vec3(.26,.42,.10),vec3(.39,.52,.15),texG);
  vec3 padCol=mix(vec3(.11,.24,.048),vec3(.21,.34,.082),texG);
  vec3 matAlbedo=mix(duckCol,letCol,lettuce);
  matAlbedo=mix(matAlbedo,padCol,lilyClump);
  // Subtle normal relief on plant clusters so low sunlight catches clump edges
  vec3 pN=normalize(vec3((texG-.5)*.28,1.,(sn(vUV*2.6+4.1)-.5)*.28));
  float pSun=max(dot(pN,uSun),0.);
  vec3 matLit=matAlbedo*(hzSoft()*(.36+.14*pN.y)*uLight+uSunCol*pSun*.64+vec3(.01,.015,.02)*uNight);
  // Contact shadow rim at the edge of each clump
  matLit*=.76+.24*smoothstep(.05,.45,floatMat);
  color=mix(color,matLit,clamp(floatMat*.92,0.,1.));
  alpha=mix(alpha,1.,clamp(floatMat*.95,0.,1.));
 }

 float edgeAA=max(fwidth(column)*.7,.0008);
 // Soft shoreline transparency grading smoothly over the shallowest 4 cm
 float shoreline=smoothstep(.005,.028+edgeAA,column);
 color*=shoreline;alpha*=shoreline;
  // Subtle atmospheric wetland mist at dawn/twilight and in low swamp basins
  float mistWisp=.65+.35*sn(vUV*.014+vec2(uTime*.012,-uTime*.008));
  float dawnMist=(uTwi*.0032+uDay*.00045)*(1.-uNight)*swampish*mistWisp*exp(-max(cameraPosition.y,0.)*.065);
  float fog=1.-exp(-distanceToEye*(uFog+dawnMist));
 color=mix(color,horizon(),fog);alpha=mix(alpha,1.,fog);
 alpha*=1.-freshTakeover;
 gl_FragColor=vec4(color/max(alpha,.0001),alpha);
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
 gl_FragColor.rgb*=gl_FragColor.a;
}`;
export { En, Rn };
