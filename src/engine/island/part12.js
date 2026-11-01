// island.js - part 12/21 (statements 146-151 of the original module).
import * as St from "three";
import { or } from "./part05.js";
import { ft } from "./part06.js";
import { Wo } from "./part10.js";
import { aa } from "./part11.js";

var Wr = `
varying vec3 vW,vN;varying float vH;varying vec2 vL;
void main(){vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;vL=position.xz;vN=normalize(mat3(modelMatrix)*normal);vH=position.y;gl_Position=projectionMatrix*viewMatrix*w;}`,
  Nr =
    ft +
    aa +
    or +
    Wo +
    `
uniform sampler2D uHM,uHydro;
uniform sampler2D uForestMap,uForestNormal,uGravelMap,uGravelNormal,uRockMap,uRockNormal;
uniform vec4 uHB;
uniform float uHs,uFog,uPeak,uFade;
varying vec3 vW,vN;
varying float vH;
varying vec2 vL;
#define WIND vec2(.8253,.5646)
vec2 islandUV(vec2 p){return (p-uHB.xy)/uHB.z*.5+.5;}
// the island texture holds the terrain (left half) and the fresh-water fields (right half)
vec4 HM(vec2 uv){return texture2D(uHM,vec2(uv.x*.5,uv.y));}
vec4 WM(vec2 uv){return texture2D(uHM,vec2(uv.x*.5+.5,uv.y));}
#ifdef SHCHEAP
#define SH_N 6
#define SH_A 3.
#define SH_B 8.
#elif defined(LOWQ)
#define SH_N 8
#define SH_A 2.1
#define SH_B 6.
#else
#define SH_N 14
#define SH_A 1.52
#define SH_B 4.
#endif
float sunShadow(vec3 p){
 if(uSun.y<.02)return 0.;
 float sh=1.,t=4.5;
 for(int i=0;i<SH_N;i++){
  vec3 q=p+uSun*t;
  vec2 uv=islandUV(q.xz);
  if(max(abs(uv.x-.5),abs(uv.y-.5))>.495)break;
  float d=q.y-HM(uv).r;
  // Crisp relief shadow edge so ridges cast sharp silhouettes across valleys and lakes
  sh=min(sh,smoothstep(-.35,2.4+t*.016,d));
  if(sh<.01)break;
  t=t*SH_A+SH_B;
  if(t>2400.)break;
 }
 return clamp(sh,0.,1.);
}
vec3 sampleRock(vec3 p,vec3 n,float pixel){
 vec3 tb=pow(abs(n),vec3(4.5));tb/=dot(tb,vec3(1.));
 float broad=fbm(p.yz*.012)*tb.x+fbm(p.xz*.012)*tb.y+fbm(p.xy*.012)*tb.z;
 float dA=1.-smoothstep(1.5,5.,pixel);
 #ifdef LOWQ
 dA=0.;
 #endif
 float detail=.5;
 if(dA>.01)detail=mix(.5,fbm(p.yz*.095)*tb.x+fbm(p.xz*.095)*tb.y+fbm(p.xy*.095)*tb.z,dA);
 float rockNoise=clamp(broad*.68+detail*.32,0.,1.);
 float strata=mix(.5,sin(p.y*.48+broad*5.8+detail*2.)*.5+.5,1.-smoothstep(2.,7.,pixel));
 // Crisp dark grey mountain rock with pale sunlit limestone/granite crest facets
 float altPale=smoothstep(65.,195.,p.y)*(.45+.55*max(dot(n,uSun),0.));
  vec3 darkSlate=mix(vec3(.075,.085,.09),vec3(.18,.19,.19),rockNoise);
  vec3 paleCrest=mix(vec3(.21,.22,.21),vec3(.35,.35,.32),rockNoise);
  vec3 baseRock=mix(darkSlate,paleCrest,altPale*.42);
  baseRock=mix(baseRock,baseRock*vec3(1.1,1.05,.94),strata*.14);
  vec3 scan=texture2D(uRockMap,p.yz*.10).rgb*tb.x
    +texture2D(uRockMap,p.xz*.10+vec2(.31,.73)).rgb*tb.y
    +texture2D(uRockMap,p.xy*.10+vec2(.57,.19)).rgb*tb.z;
  baseRock*=mix(vec3(1.),scan*2.2,.43*dA);
 float moss=smoothstep(.38,.78,n.y+broad*.25)*smoothstep(.44,.8,detail)*(1.-smoothstep(120.,220.,p.y));
 return mix(baseRock,vec3(.075,.14,.042),moss*.5);
}
// fade a [0,1] pattern of the given period to its mean once a pixel covers ~half a period
float bandLimit(float v,float mean,float period,float pixel){return mix(mean,v,1.-smoothstep(period*.25,period*.6,pixel));}

// sparse round grains on a jittered grid, exact integer hash (no float-hash lattice):
// x = coverage of a grain here, y = that grain's random id. aa = pixel size in cells.
vec2 grains(vec2 q,float density,float radius,float aa,uint seed){
 vec2 i=floor(q),f=q-i;ivec2 c=ivec2(i);
 float id=bHash2(c,seed);
 vec2 o=vec2(bHash2(c,seed^0x9e3779b9u),bHash2(c,seed^0x7f4a7c15u))*.56+.22;
 float r=radius*(.55+.9*fract(id*13.17));
 float d=length(f-o);
 return vec2((1.-smoothstep(r-aa,r+aa,d))*step(id,density),fract(id*7.31));
}
// aeolian ripples across the constant trade wind; warped so crests bend, fork and fade.
// returns (height, dh/dx, dh/dz) in metres
vec3 ripple(vec2 l,float lambda,float amp,float warp){
 vec2 wq=l*(.11/lambda);
 float w=(vn(wq)-.5+(vn(wq*2.3+19.3)-.5)*.5)*warp;
 float ph=fract(dot(l,WIND)/lambda+w)*6.2831853;
 float a=ph+.55*sin(ph);
 float s=sin(a),ds=cos(a)*(1.+.55*cos(ph))*6.2831853/lambda;
 return vec3(s,WIND*ds)*amp;
}
// wave-formed ripples on the lagoon floor, crests parallel to the local shore
// (three fixed orientations blended by the shore direction: no large-coordinate drift)
vec3 waveRipple(vec2 l,vec2 dir,float lambda,float amp){
 vec3 r=vec3(0.);float ws=0.;
 for(int k=0;k<3;k++){
  float a=float(k)*1.0471976;
  vec2 D=vec2(cos(a),sin(a));
  float wgt=pow(abs(dot(D,dir)),8.)+1e-4;
  float wv=(vn(l*.27+float(k)*7.1)-.5)*1.1;
  float ph=fract(dot(l,D)/lambda+wv)*6.2831853;
  float b=ph+.35*sin(ph);
  r+=vec3(sin(b),D*cos(b)*(1.+.35*cos(ph))*6.2831853/lambda)*wgt;ws+=wgt;
 }
 return r/ws*amp;
}
// animated caustic network: distance to the borders of drifting Voronoi cells
float causticCell(vec2 q,float t){
 vec2 i=floor(q),f=q-i;float d1=8.,d2=8.;
 for(int y=-1;y<=1;y++)for(int x=-1;x<=1;x++){
  vec2 g=vec2(float(x),float(y));
  vec2 hh=vec2(h12(i+g),h12(i+g+17.3));
  vec2 o=.5+.38*sin(t*(.7+.6*hh)+6.2831*hh.yx);
  vec2 r=g+o-f;float d=dot(r,r);
  if(d<d1){d2=d1;d1=d;}else if(d<d2)d2=d;
 }
 return sqrt(d2)-sqrt(d1);
}
float causticNet(vec2 l,float t){
 vec2 w=l+(vec2(vn(l*.37+t*.11),vn(l*.37-t*.09+5.2))-.5)*.9;
 float a=causticCell(w*1.15,t*1.1);
 float b=causticCell(w*1.6+9.7,-t*.9+3.);
 float la=1.-smoothstep(0.,.16,a),lb=1.-smoothstep(0.,.16,b);
 return la*.65+lb*.45+la*lb*.9;
}

void main(){
 vec2 p=vW.xz,uv=islandUV(p);
 vec2 l=vL+uBiome.xy;
 float h=vH;
 float pixel=length(fwidth(p));
 vec3 V=cameraPosition-vW;float dist=length(V);V/=max(dist,.001);
 vec3 Ng=normalize(vN);
 float slope=1.-Ng.y;
 float grad=sqrt(max(1.-Ng.y*Ng.y,0.))/max(Ng.y,.08);
 #ifdef FAR0
 // Far-field path (mobile): beyond FAR0 the island is a few pixels of colour, so skip the shadow
 // march, the noise stacks, rock/beach/lagoon detail and caustics. Blends in over FAR0..FAR1.
 vec3 farCol=vec3(0.);float farMix=smoothstep(FAR0,FAR1,dist);
 if(farMix>0.){
  vec4 fh=texture2D(uHydro,uv);
  float sl=1.-Ng.y;
  vec3 sandF=mix(vec3(.50,.43,.31),vec3(.26,.21,.15),1.-smoothstep(-.2,.9,h));
  float lowMeadow=(1.-smoothstep(28.,95.,h))*(1.-smoothstep(.09,.26,sl));
  vec3 grassF=mix(vec3(.075,.147,.032),vec3(.165,.265,.063),lowMeadow*.7);
  float vegF=smoothstep(1.6,6.,h)*(1.-smoothstep(.55,.85,sl));
  vec3 colF=mix(sandF,grassF,vegF);
  colF=mix(colF,vec3(.17,.20,.10),smoothstep(.46,.82,h/max(uPeak,80.))*vegF);
  float rockF=clamp(max(smoothstep(.78,1.05,sl),smoothstep(.42,.74,sl)*smoothstep(65.,150.,h)*.75),0.,1.);
  colF=mix(colF,mix(vec3(.12,.13,.13),vec3(.26,.27,.25),smoothstep(65.,195.,h)*.5),rockF);
  colF=mix(colF,vec3(.7,.74,.72),smoothstep(480.,650.,h)*(1.-smoothstep(.26,.62,sl))*.86);
  colF=mix(colF,vec3(.52,.47,.35),1.-smoothstep(-1.1,0.,h));
  float nlF=max(dot(Ng,uSun),0.);
  vec3 ambF=hzSoft()*(.17+.16*Ng.y)*uLight*(.72+.28*Ng.y)*fh.b+vec3(.016,.024,.039)*uNight;
  colF*=ambF+uSunCol*nlF*.66+vec3(.08,.11,.17)*uNight*max(dot(Ng,uMoon),0.);
  float fogF=1.-exp(-dist*uFog*1.12);
  vec3 aerF=mix(horizon(),mix(horizon(),vec3(.45,.61,.63)*uLight,.32),uDay*(1.-uStorm));
  colF=mix(colF,aerF,fogF);
  farCol=mix(horizon(),colF,uFade);
  if(farMix>.999){
   gl_FragColor=vec4(farCol,1.);
   #include <tonemapping_fragment>
   #include <colorspace_fragment>
   return;
  }
 }
 #endif
 float macro=fbm(p*.009);
 float meso=fbm(p*.038)*.5+.5;
 float fine=1.-smoothstep(.3,.9,pixel);
 vec4 coast=HM(uv);
  vec4 hydro=texture2D(uHydro,uv);
  float wetCell=hydro.g;
  float bankH=h-hydro.r;
 float cd=max(-coast.g,0.);
 vec4 wm=WM(uv);
  float fresh=max(hydro.a,mix(wm.g,wm.r,1.-smoothstep(-.12,.1,h)));
  float marsh=wetCell>.4?wm.g:h>0.?wm.r:wm.g;
  // Tidal mud continues to the delta; open beaches remain sand unless the
  // heightfield marks them as a wetland or a riparian bank.
  float freshSoil=max(fresh*smoothstep(22.,135.,cd),marsh*.88);
 vec2 bumpG=vec2(0.);

 // ---- shoreline simulation: wetness left by the swash, contact line and the lip's shadow
 float wet=0.,contact=0.,film=0.,lipShadow=0.;
 {
  vec2 suv=surfUV(p);float m=surfMask(suv);
  float wetFar=1.-smoothstep(-.08,mix(.16+.035*min(uShH,6.),.1,freshSoil),h);
  wet=wetFar;
  if(m>0.&&h<7.){
   float lod=log2(max(pixel/uSurfBox.z,1.));
   vec4 Fs=textureLod(uSurfF,suv,lod);
   float hs=texCubic(uSurfS,suv,uSurfBox.w).r;
   wet=mix(wetFar,Fs.g,m);
   float nearSim=1.-smoothstep(.7,2.,lod);
   film=smoothstep(.004,.02,hs)*m;
   contact=smoothstep(.003,.008,hs)*exp(-pow((hs-.02)/.026,2.))*(1.-smoothstep(.06,.16,hs))*m*nearSim;
   if(nearSim>.01){
    vec2 sd=uSun.xz/max(length(uSun.xz),1e-3);
    float reach=clamp(.05/max(uSun.y,.12),.05,.45);
    float hsun=texCubic(uSurfS,surfUV(p+sd*reach),uSurfBox.w).r;
    lipShadow=smoothstep(.012,.06,hsun-hs)*smoothstep(0.,.15,uSun.y)*m*nearSim;
   }
  }
 }
 wet=max(wet,1.-smoothstep(-.2,.04,h));
 // the damp margin of rivers and lakes: capillary-wet soil a little above the water
  wet=max(wet,freshSoil*(1.-smoothstep(.05,.45+.4*marsh,bankH))*.85);
 float wetDark=smoothstep(.02,.92,wet);
 float gloss=wet*wet*(.35+.65*film);

 // ---- plant cover: the shared field, band-limited to its mean far away
 // (cover is exactly zero below 2.3 m: the swash face and the lagoon skip the hashes)
 vec2 vc=h>.12?vegCover(l,h,cd,grad,fresh):vec2(0.);
 float cov=vc.x;
 float veg=mix(vc.y,smoothstep(.12,.72,cov),smoothstep(.5,2.4,pixel));
  if(wetCell>.35&&bankH<.12){cov=0.;veg=0.;}
 float margin=smoothstep(0.,.18,cov)*(1.-smoothstep(.5,.92,cov));
 float cliffMask=smoothstep(.78,1.05,slope+.08*(meso-.5));
 float sandW=(1.-veg)*(1.-cliffMask);

 // =============================== SAND ===============================
 vec3 sand=vec3(.5,.43,.31);float sparkle=0.;
 if(sandW>.002||h<.6){
  // broad tints drifting along the coast: warm coral, pale shell sand, grey volcanic grit
  float zone=vn(l*.0085+3.1)*.65+vn(l*.031+7.7)*.35;
  vec3 dry=mix(vec3(.50,.425,.305),vec3(.60,.53,.395),smoothstep(.28,.78,zone));
  dry=mix(dry,vec3(.43,.40,.35),smoothstep(.6,.9,vn(l*.011+11.))*.5);
  // wind streaks elongated along the trade wind, compaction mottling
  vec2 lw=vec2(dot(l,WIND),dot(l,vec2(-WIND.y,WIND.x)));
  float streak=bandLimit(vn(lw*vec2(.07,.75)),.5,1.3,pixel)*.55+vn(lw*vec2(.025,.2))*.45;
  float mott=bandLimit(vn(l*.43),.5,2.3,pixel)*.55+bandLimit(vn(l*1.7),.5,.6,pixel)*.45;
  dry*=(.9+.2*streak)*(.94+.12*mott);
  // loose dry sand up the beach is paler, the firm berm below it darker
  dry*=mix(.93,1.04,smoothstep(1.8,4.5,h));
  // ---- wind ripples: in drifting fields, never on the wet face or under plants
  float ripField=smoothstep(.3,.62,vn(l*.06+5.3))*(1.-smoothstep(.15,.6,wet))*(1.-smoothstep(.04,.3,cov))*smoothstep(1.6,2.6,h);
  float rA=(1.-smoothstep(.05,.17,pixel))*ripField;
  if(rA>.01){
   vec3 r=ripple(l,.46,.02,1.3);
   bumpG+=r.yz*rA;
   dry*=1.+r.x*2.2*rA;
  }
  float rB=(1.-smoothstep(.012,.04,pixel))*ripField;
  if(rB>.01){vec3 r=ripple(l+3.7,.13,.0045,1.6);bumpG+=r.yz*rB;}
  // ---- shell hash, coral rubble and dark grains (resolved near; their mean tint beyond)
  float gA=1.-smoothstep(.008,.024,pixel);
  dry*=mix(1.025,1.,gA);
  if(gA>.01){
   vec2 sh=grains(l*13.,.07,.16,pixel*13.,0x51ed270bu);
   vec3 shellC=mix(vec3(.80,.77,.70),vec3(.74,.54,.47),step(.72,sh.y));
   shellC=mix(shellC,vec3(.56,.52,.47),step(.9,sh.y));
   dry=mix(dry,shellC,sh.x*gA*smoothstep(1.2,2.4,h));
   vec2 dk=grains(l*29.+5.,.14,.2,pixel*29.,0x2545f491u);
   dry=mix(dry,vec3(.13,.12,.105),dk.x*gA*.75);
  }
  // ---- wrack line: stranded weed and bleached debris at the spring-tide limit
  float wd=wrackDist(l);
  float wrW=.7+.9*vn(l*.13+2.);
  float wrB=(1.-smoothstep(wrW*.35,wrW,abs(cd-wd+(vn(l*.19)-.5)*2.6)))*smoothstep(.35,.62,vn(l*.045+8.));
  float wr2=(1.-smoothstep(.15,.5,abs(cd-wd+6.5+(vn(l*.23+4.)-.5)*2.)))*smoothstep(.45,.7,vn(l*.05+1.))*.6;
  float wrack=max(wrB,wr2)*(1.-smoothstep(.5,.9,wet))*(1.-smoothstep(.1,.4,cov));
  if(wrack>.01){
   float wrF=1.-smoothstep(.02,.07,pixel);
   float bits=.34;
   vec3 weedC=vec3(.11,.095,.055);
   if(wrF>.01){
    vec2 wg=grains(l*9.,.62,.3,pixel*9.,0x68e31da4u);
    vec2 wg2=grains(l*21.+2.,.55,.28,pixel*21.,0xb5297a4du);
    bits=mix(bits,max(wg.x,wg2.x),wrF);
    weedC=mix(weedC,mix(vec3(.16,.13,.07),vec3(.07,.07,.045),wg.y),wrF);
    weedC=mix(weedC,vec3(.62,.58,.5),step(.86,wg2.y)*wg2.x*wrF);
   }
   dry*=1.-.14*wrack;
   dry=mix(dry,weedC,wrack*bits*.65);
  }
  // ---- swash marks: faint arcs of fine dark grains left at old run-up limits
  float swL=(1.-smoothstep(1.2,2.6,h))*(1.-smoothstep(.5,.85,wet))*(1.-smoothstep(.06,.25,pixel));
  if(swL>.01){
   float sl=abs(fract(cd*.29+vn(l*.07)*1.6)-.5);
   dry*=1.-.12*(1.-smoothstep(.02,.05,sl))*swL;
  }
  // ---- wet sand: darker and redder, smoothed by the swash
  vec3 wetS=mix(vec3(.24,.195,.14),vec3(.31,.255,.185),meso)*(.9+.14*mott);
  sand=mix(dry,wetS,wetDark);
  bumpG*=1.-.85*wetDark;
  // ---- glints: single quartz and shell facets catching the sun (very near only)
  float spA=(1.-smoothstep(.0035,.011,pixel))*(1.-wetDark*.6);
  if(spA>.01&&uSun.y>.04){
   ivec2 c=ivec2(floor(l*70.));
   vec3 fn=normalize(vec3(bHash2(c,0xa54ff53au)-.5,.55,bHash2(c,0x510e527fu)-.5));
   sparkle=pow(max(dot(fn,normalize(V+uSun)),0.),90.)*step(.9,bHash2(c,0x3c6ef372u))*spA*smoothstep(.04,.2,uSun.y);
  }
 }

 // ---- river and lake margins: silt, wet mud and peat instead of beach sand
 if(freshSoil>.01){
  float mn=vn(l*.21)*.6+bandLimit(vn(l*1.3),.5,.75,pixel)*.4;
  vec3 silt=mix(vec3(.25,.215,.15),vec3(.32,.275,.19),mn);
  // a mossy, algae-stained film on the damp mud nearest the water
   silt=mix(silt,vec3(.15,.17,.08),smoothstep(.6,.2,bankH)*.45);
  vec3 mud=mix(vec3(.13,.11,.075),vec3(.19,.16,.11),mn);
  vec3 peat=mix(vec3(.08,.075,.05),vec3(.13,.12,.07),mn);
  vec3 bank=mix(silt,mud,wetDark);
  bank=mix(bank,peat,marsh*.8);
   float textureFade=1.-smoothstep(.25,1.2,pixel);
   vec2 uvBank=l*.26;
   vec3 gravel=texture2D(uGravelMap,uvBank).rgb;
    float bar=(1.-smoothstep(.5,2.3,bankH))*(1.-marsh)*smoothstep(.32,.65,vn(l*.035+12.));
   bank=mix(bank,gravel*mix(.64,.95,1.-wetDark),bar*textureFade*.7);
   vec3 gravelN=texture2D(uGravelNormal,uvBank).rgb*2.-1.;
   bumpG+=gravelN.xy*bar*textureFade*.19;
    float undercut=freshSoil*(1.-smoothstep(.25,1.3,bankH))*smoothstep(.09,.4,grad);
   bank=mix(bank,vec3(.09,.075,.055),undercut*.36);
  // pebble and gravel strips at the waterline of running water
  float gv=1.-smoothstep(.015,.05,pixel);
   if(gv>.01){vec2 gr=grains(l*6.,.3,.32,pixel*6.,0x7b8f1d3fu);bank=mix(bank,mix(vec3(.25,.23,.2),vec3(.5,.46,.4),gr.y),gr.x*gv*(1.-smoothstep(.3,1.,bankH))*(1.-marsh));}
  sand=mix(sand,bank,freshSoil);
 }
 // ========================= PLANT-COVERED GROUND =========================
 float ce=8./(2.*uHB.z);
 float hc=coast.r;
 float hn=(HM(uv+vec2(ce,0.)).r+HM(uv-vec2(ce,0.)).r+HM(uv+vec2(0.,ce)).r+HM(uv-vec2(0.,ce)).r)*.25;
 float curv=clamp((hn-hc)/8.,-.65,.65);
 // Bare rock shows through on steep cliff faces AND sharp mountain ridge crests
 float crestRock=smoothstep(-.06,-.24,curv)*smoothstep(38.,115.,h);
 float rockExposure=clamp(max(cliffMask,crestRock*.88+smoothstep(.42,.74,slope)*smoothstep(65.,150.,h)*.75),0.,1.);

 float gTint=vn(p*.021)*.65+.35*vn(p*.13);
 float gDry=smoothstep(.56,.8,vn(p*.013+9.));
 float meadowPatch=smoothstep(.42,.76,fbm(p*.014+7.3));
 vec3 forestGreen=mix(vec3(.042,.108,.022),vec3(.105,.185,.042),gTint);
 // Bright, vivid valley-floor and floodplain greens (References 1, 2, 4)
 vec3 meadowGreen=mix(vec3(.11,.22,.048),vec3(.22,.31,.078),gTint);
 float isLowMeadow=(1.-smoothstep(28.,95.,h))*(1.-smoothstep(.09,.26,slope));
 float floodBasin=freshSoil*(1.-smoothstep(0.,14.,h))*(1.-smoothstep(.08,.22,slope));
 vec3 grass=mix(forestGreen,meadowGreen,clamp(meadowPatch*.55+isLowMeadow*.68+floodBasin*.45,0.,1.))*(.86+.25*macro);
 grass=mix(grass,vec3(.30,.28,.10),gDry*.36*(1.-floodBasin));
 // the seaward fringe: salt-burnt, yellower turf
 grass=mix(grass,mix(vec3(.19,.21,.075),vec3(.31,.29,.13),gTint),margin*.8*(1.-freshSoil));
 // lush riparian floodplain and marsh greens
 grass=mix(grass,mix(vec3(.09,.20,.038),vec3(.20,.29,.068),gTint),freshSoil*.65);
 grass=mix(grass,mix(vec3(.08,.125,.035),vec3(.15,.185,.058),gTint),marsh*.68);
 vec3 highland=mix(vec3(.13,.165,.078),vec3(.22,.23,.13),macro)*(.88+.22*meso);
 float highlandMask=smoothstep(.46,.82,h/max(uPeak,80.)+macro*.12);
 // sandy soil, straw litter and creepers where the cover thins out onto the sand
 vec3 soil=mix(vec3(.29,.24,.165),vec3(.22,.185,.12),meso);
 sand=mix(sand,soil,margin*.6*(1.-wetDark)*(1.-freshSoil));
 float vineN=vn(l*.19+(vec2(vn(l*.8),vn(l*.8+4.))-.5)*1.4);
 float vine=smoothstep(.6,.7,vineN)*margin*(1.-smoothstep(.3,.7,wet));
 vec3 vineC=mix(vec3(.07,.13,.04),vec3(.14,.21,.06),bandLimit(vn(l*3.1),.5,.32,pixel));
 float straw=smoothstep(.55,.82,vn(l*.33+13.))*margin;

 vec3 color=mix(sand,grass,veg);
 if(freshSoil>.1&&h>.1){
  float nearGround=(1.-smoothstep(.3,1.3,pixel))*freshSoil;
  float litter=veg*(.32+.44*smoothstep(.34,.7,vn(l*.05)));
  vec2 forestUV=l*.21;
  vec3 floorColor=texture2D(uForestMap,forestUV).rgb;
  color=mix(color,floorColor*mix(.68,1.03,smoothstep(.3,3.,h)),litter*nearGround);
  bumpG+=(texture2D(uForestNormal,forestUV).xy*2.-1.)*litter*nearGround*.17;
 }
 color=mix(color,vec3(.33,.29,.15),straw*.4*(1.-veg));
 color=mix(color,vineC,vine*(1.-veg)*.72);
 color=mix(color,highland,highlandMask*veg);
 if(rockExposure>.002)color=mix(color,sampleRock(vW,Ng,pixel),rockExposure);
  float snow=smoothstep(480.,650.,h+35.*(macro-.5))*(1.-smoothstep(.26,.62,slope));
  color=mix(color,mix(vec3(.57,.63,.64),vec3(.83,.86,.82),meso),snow*.86*(1.-wetCell));

 // =============================== LAGOON & FRESHWATER BED ===============================
  float bedH=wetCell>.35?bankH:h;
  if(bedH<.3){
   float depthB=max(-bedH,0.);
  vec2 sdir=normalize(coast.zw+vec2(1e-4));
  float cw=.12+min(pixel*.02,.2);
  float coral=smoothstep(.62-cw,.62+cw,fbm(p*.035+3.))*smoothstep(.4,2.6,depthB)*(1.-smoothstep(9.,22.,depthB));
  vec3 reef=mix(vec3(.38,.25,.16),vec3(.20,.31,.17),meso);
  vec3 lag=mix(vec3(.52,.47,.35),vec3(.64,.58,.44),meso)*(.92+.16*bandLimit(vn(l*.35),.5,2.9,pixel));
  // seagrass meadows
  float sg=smoothstep(.55,.66,fbm(l*.026+21.))*smoothstep(.7,1.8,depthB)*(1.-smoothstep(8.,15.,depthB));
  vec3 sgC=mix(vec3(.09,.15,.06),vec3(.17,.23,.09),bandLimit(vn(l*2.1),.5,.48,pixel));
  vec3 seabed=mix(lag,sgC,sg);
  seabed=mix(seabed,reef,coral);
  float heads=.1;
  float hd=1.-smoothstep(.35,1.2,pixel);
  if(hd>.01)heads=mix(.1,smoothstep(.7,.92,fbm(p*.13+9.)),hd);
  seabed=mix(seabed,vec3(.33,.19,.24),heads*coral*.7);
  // wave ripples on bare lagoon sand, crests along the beach
  float uwA=(1.-smoothstep(.06,.2,pixel))*(1.-sg)*(1.-coral)*smoothstep(.15,.8,depthB)*(1.-smoothstep(6.,12.,depthB));
  if(uwA>.01){vec3 r=waveRipple(l,sdir,.75,.035);bumpG+=r.yz*uwA;seabed*=1.+r.x*1.5*uwA;}
  // coral rubble and shells
  float rbA=1.-smoothstep(.01,.03,pixel);
  if(rbA>.01){vec2 rb=grains(l*8.,.08,.22,pixel*8.,0x1f83d9abu);seabed=mix(seabed,mix(vec3(.28,.26,.22),vec3(.7,.66,.58),rb.y),rb.x*rbA*(1.-sg));}
  // caustics: drawn where resolved, their mean brightness beyond (no lattice, no flicker)
  float cDetail=1.-smoothstep(.035,.14,pixel);
 #ifdef LOWQ
 cDetail=0.;
 #endif
  float caus=.2;
  if(cDetail>.01)caus=mix(.2,causticNet(l,uTime),cDetail);
  caus*=smoothstep(.04,.7,depthB)*(1.-smoothstep(4.,13.,depthB))*smoothstep(.02,.15,uSun.y);
  seabed*=1.+uSunCol*caus*.28;
  // ---- fresh-water beds: pale littoral marl/sand rim in lakes, gravel/cobbles in rivers, dark peat in swamps
   float inlB=max(smoothstep(.25,.9,wm.r)*(1.-step(.3,h)),wetCell*(1.-step(.3,bankH)));
  if(inlB>.001){
   vec2 fl=wm.ba;float fsp=length(fl);
   float run=smoothstep(.1,.45,fsp);
   float swBed=clamp(wm.g,0.,1.);
   float bn=vn(l*.4)*.6+bandLimit(vn(l*1.9),.5,.53,pixel)*.4;
   // Bright shallow littoral shelf on open lakes (0..2.2 m) fading into dark deep basin floor
   float litShelf=(1.-smoothstep(.25,2.4,depthB))*(1.-swBed*.85);
   vec3 shallowMarl=mix(vec3(.24,.34,.30),vec3(.34,.44,.38),bn);
   vec3 deepLakeBed=mix(vec3(.07,.10,.09),vec3(.13,.16,.13),bn);
   vec3 lakeBed=mix(deepLakeBed,shallowMarl,litShelf);
   float weed=smoothstep(.55,.7,fbm(l*.05+4.))*smoothstep(.45,1.4,depthB)*(1.-run);
   lakeBed=mix(lakeBed,mix(vec3(.05,.09,.03),vec3(.11,.15,.05),bandLimit(vn(l*2.7),.5,.37,pixel)),weed);
   vec3 rivBed=mix(vec3(.27,.23,.17),vec3(.36,.31,.23),bn);
    float scanFade=1.-smoothstep(.2,1.,pixel);
    rivBed=mix(rivBed,texture2D(uGravelMap,l*.26+fl*uTime*.00015).rgb*.72,scanFade*.78);
    bumpG+=(texture2D(uGravelNormal,l*.26).xy*2.-1.)*scanFade*run*.16;
   float cb=1.-smoothstep(.02,.07,pixel);
   if(cb>.01){
    vec2 c1=grains(l*2.2,.55,.36,pixel*2.2,0x9e3779b1u);
    vec2 c2=grains(l*5.5+1.7,.5,.34,pixel*5.5,0x85ebca77u);
    vec3 st1=mix(vec3(.2,.19,.16),vec3(.52,.47,.4),c1.y)*mix(1.,.6,step(.75,c1.y));
    vec3 st2=mix(vec3(.24,.21,.17),vec3(.46,.42,.36),c2.y);
    rivBed=mix(rivBed,st1,c1.x*cb*(.4+.6*run));
    rivBed=mix(rivBed,st2,c2.x*cb*.8);
    rivBed*=.85+.3*c1.x*cb;
   }
   // flow-aligned sand ripples where the current slackens
   float frA=(1.-smoothstep(.06,.2,pixel))*smoothstep(.05,.2,fsp)*(1.-smoothstep(.5,.9,fsp));
   if(frA>.01){vec3 r=waveRipple(l,normalize(fl+1e-4),.55,.03);bumpG+=r.yz*frA;rivBed*=1.+r.x*1.2*frA;}
   vec3 freshBed=mix(lakeBed,rivBed,run*.82+.18*(1.-smoothstep(.5,2.,depthB))*run);
   // Dark tea/peat bed in swamps
   freshBed=mix(freshBed,vec3(.035,.032,.02),swBed*.88);
   float fc=1.-smoothstep(.03,.12,pixel);
   #ifdef LOWQ
   fc=0.;
   #endif
   float fcaus=fc>.01?mix(.2,causticNet(l*1.3+fl*uTime*.6,uTime*1.3),fc):.2;
   freshBed*=1.+uSunCol*fcaus*.16*smoothstep(.02,.15,uSun.y)*(1.-smoothstep(.6,2.5,depthB))*(1.-swBed*.7);
   seabed=mix(seabed,freshBed,inlB);
  }
   color=mix(color,seabed,1.-smoothstep(-1.1,0.,bedH));
 }

 // fine sand grain right under the viewer (keeps the beach crisp instead of smeared)
 float g9=1.-smoothstep(.03,.1,pixel),g23=1.-smoothstep(.012,.04,pixel);
 float micro=bandLimit(vn(p*.75),.5,1.33,pixel);
 float grain=0.;
 if(g9>.01)grain=(vn(l*9.)-.5)*.10*g9+(g23>.01?(vn(l*23.)-.5)*.06*g23:0.);
 color*=1.+(micro-.5)*.12*fine+grain*sandW;

 // micro relief -> shading normal (ripples light up under a low sun)
 vec3 N=Ng;
 if(fine>.01)N+=vec3(vn(p*.8)-.5,0.,vn(p*.8+11.)-.5)*.1*fine;
 float grainFade=1.-smoothstep(.03,.1,pixel);
 if(grainFade>.01)N+=vec3(vn(l*6.3)-.5,0.,vn(l*6.3+5.)-.5)*.07*grainFade;
 N=normalize(N+vec3(-bumpG.x,0.,-bumpG.y));
  if(rockExposure>.15&&pixel<1.4){
   vec3 tb=pow(abs(Ng),vec3(4.));tb/=dot(tb,vec3(1.));
   vec3 nx=texture2D(uRockNormal,vW.yz*.10).rgb*2.-1.;
   vec3 ny=texture2D(uRockNormal,vW.xz*.10+vec2(.31,.73)).rgb*2.-1.;
   vec3 nz=texture2D(uRockNormal,vW.xy*.10+vec2(.57,.19)).rgb*2.-1.;
   vec3 rn=normalize(vec3(nx.z*tb.x+ny.x*tb.y+nz.x*tb.z,
     nx.x*tb.x+ny.z*tb.y+nz.y*tb.z,nx.y*tb.x+ny.y*tb.y+nz.z*tb.z));
   N=normalize(mix(N,rn,rockExposure*.37*(1.-smoothstep(.5,1.4,pixel))));
  }

 float nl=max(dot(N,uSun),0.);
 float shadow=1.;
 if(dot(Ng,uSun)>-.05)shadow=sunShadow(vW+Ng*.6);
 #ifdef PROP_SHADOWS
 shadow*=propShadow(vW+Ng*.04);
 #endif
 shadow*=1.-.35*lipShadow;
 // Valley & under-canopy ambient occlusion: darkens concave gullies and dense forest slopes while keeping open floodplains bright
 float cavity=1.-.62*clamp(curv*2.5,0.,1.)+.24*clamp(-curv*2.4,0.,1.);
 float canopyShade=1.-.22*veg*(1.-isLowMeadow*.78)*(1.-rockExposure);
  float ambientOcclusion=(.72+.28*N.y)*mix(1.,cavity,smoothstep(-.3,.6,h))*canopyShade*hydro.b;
 vec3 ambient=hzSoft()*(.17+.16*N.y)*uLight*ambientOcclusion+vec3(.016,.024,.039)*uNight;
 color*=ambient+uSunCol*nl*.66*shadow+vec3(.08,.11,.17)*uNight*max(dot(N,uMoon),0.);
 color*=1.-.3*contact;
 color+=uSunCol*sparkle*shadow*.9;

 float mistBand=exp(-pow((h-46.)/34.,2.))*(1.-smoothstep(.05,.3,slope));
 if(mistBand>.01){
  float mistConcave=max(0.,-curv)*1.4;
  vec2 mistP=p*vec2(.006,.009)+vec2(uTime*.0045,uTime*.0022);
  float mistTex=smoothstep(.48,.82,fbm(mistP)*.75+vn(mistP*3.1)*.35);
  float mist=mistBand*mistTex*(.34+.66*mistConcave)*uLight*(1.-uStorm*.7)*(1.-uNight);
  color=mix(color,hzSoft()*.86+vec3(.02)*uLight,mist*.2);
 }

 if(gloss>.002){
  float nv=clamp(dot(N,V),.02,1.);
  float sheen=(.02+.26*pow(1.-nv,5.))*gloss*.5;
  vec3 R=reflect(-V,N);R.y=abs(R.y);
  color=mix(color,sky(R)*.85,sheen);
  color+=uSunCol*pow(max(dot(R,uSun),0.),220.)*gloss*.05*shadow;
 }

 float dawnMist=uTwi*(1.-uNight)*marsh*exp(-max(h,0.)*.65)*exp(-max(cameraPosition.y,0.)*.07)*.0028;
 float fog=1.-exp(-dist*(uFog*1.12+dawnMist));
 vec3 aerialHz=mix(horizon(),mix(horizon(),vec3(.45,.61,.63)*uLight,.32),uDay*(1.-uStorm));
 color=mix(color,aerialHz,fog);
 color=mix(horizon(),color,uFade);
 #ifdef FAR0
 color=mix(color,farCol,farMix);
 #endif
 gl_FragColor=vec4(color,1.);
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
}`;
var na = 8;
function Br(o = 256) {
  let e = 2654435769,
    t = () => (
      (e ^= e << 13),
      (e ^= e >>> 17),
      (e ^= e << 5),
      (e >>> 0) / 4294967296
    ),
    r = (l) => {
      let u = new Float32Array(l * l);
      for (let x = 0; x < u.length; x++) u[x] = t();
      let d = new Float32Array(o * o),
        p = (x) => x * x * x * (x * (x * 6 - 15) + 10);
      for (let x = 0; x < o; x++)
        for (let f = 0; f < o; f++) {
          let v = (f / o) * l,
            b = (x / o) * l,
            g = Math.floor(v),
            M = Math.floor(b),
            w = p(v - g),
            E = p(b - M),
            k = g % l,
            R = (g + 1) % l,
            H = M % l,
            C = (M + 1) % l,
            W = u[H * l + k],
            T = u[H * l + R],
            P = u[C * l + k],
            L = u[C * l + R];
          d[x * o + f] = (W + (T - W) * w) * (1 - E) + (P + (L - P) * w) * E;
        }
      return d;
    },
    s = (l) => {
      let u = new Float32Array(o * o),
        d = 1,
        p = 0;
      for (let v = 0; v < 4; v++) {
        let b = r(l << v);
        for (let g = 0; g < u.length; g++) u[g] += b[g] * d;
        ((p += d), (d *= 0.5));
      }
      let x = 1e9,
        f = -1e9;
      for (let v = 0; v < u.length; v++)
        ((u[v] /= p), (x = Math.min(x, u[v])), (f = Math.max(f, u[v])));
      for (let v = 0; v < u.length; v++) u[v] = (u[v] - x) / (f - x);
      return u;
    },
    c = s(4),
    a = s(6),
    n = new Uint8Array(o * o * 4),
    i = (l, u) => c[((u + o) % o) * o + ((l + o) % o)],
    m = (l) =>
      Math.max(0, Math.min(255, Math.round(((l / na) * 0.5 + 0.5) * 255)));
  for (let l = 0; l < o; l++)
    for (let u = 0; u < o; u++) {
      let d = (l * o + u) * 4,
        p = (i(u + 1, l) - i(u - 1, l)) * 0.5 * o,
        x = (i(u, l + 1) - i(u, l - 1)) * 0.5 * o;
      ((n[d] = m(p * 0.045)),
        (n[d + 1] = m(x * 0.045)),
        (n[d + 2] = Math.round(c[l * o + u] * 255)),
        (n[d + 3] = Math.round(a[l * o + u] * 255)));
    }
  let h = new St.DataTexture(n, o, o, St.RGBAFormat, St.UnsignedByteType);
  return (
    (h.wrapS = h.wrapT = St.RepeatWrapping),
    (h.magFilter = St.LinearFilter),
    (h.minFilter = St.LinearMipmapLinearFilter),
    (h.generateMipmaps = !0),
    (h.colorSpace = St.NoColorSpace),
    (h.needsUpdate = !0),
    h
  );
}
var ui = 0.02;
export { Br, Nr, Wr, na, ui };
