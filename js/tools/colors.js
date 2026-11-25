'use strict';
const CA=(()=>{
const clamp=(v,a,b)=>v<a?a:v>b?b:v;
const hx=c=>String(c==null?'ffffff':c).replace('#','').toLowerCase().padStart(6,'0').slice(-6);
const h2rgb=h=>{h=hx(h);return[parseInt(h.substr(0,2),16),parseInt(h.substr(2,2),16),parseInt(h.substr(4,2),16)]};
const rgb2h=(r,g,b)=>[r,g,b].map(v=>Math.round(clamp(v,0,255)).toString(16).padStart(2,'0')).join('');
const s2l=c=>{c/=255;return c<=.04045?c/12.92:Math.pow((c+.055)/1.055,2.4)};
const l2s=c=>{c=clamp(c,0,1);return 255*(c<=.0031308?12.92*c:1.055*Math.pow(c,1/2.4)-.055)};
function rgb2lab(r,g,b){const R=s2l(r),G=s2l(g),B=s2l(b),X=(R*.4124564+G*.3575761+B*.1804375)/.95047,Y=R*.2126729+G*.7151522+B*.072175,Z=(R*.0193339+G*.119192+B*.9503041)/1.08883,f=t=>t>216/24389?Math.cbrt(t):(24389/27*t+16)/116;return[116*f(Y)-16,500*(f(X)-f(Y)),200*(f(Y)-f(Z))]}
function lab2rgb(L,a,b){const fy=(L+16)/116,fx=fy+a/500,fz=fy-b/200,fi=t=>t>6/29?t*t*t:3*(6/29)*(6/29)*(t-4/29),X=fi(fx)*.95047,Y=fi(fy),Z=fi(fz)*1.08883;
 return[l2s(3.2404542*X-1.5371385*Y-.4985314*Z),l2s(-.969266*X+1.8760108*Y+.041556*Z),l2s(.0556434*X-.2040259*Y+1.0572252*Z)]}
function rgb2hsl(r,g,b){r/=255;g/=255;b/=255;const mx=Math.max(r,g,b),mn=Math.min(r,g,b),l=(mx+mn)/2,d=mx-mn;let h=0,s=0;if(d>1e-9){s=l>.5?d/(2-mx-mn):d/(mx+mn);h=mx===r?((g-b)/d+(g<b?6:0)):mx===g?(b-r)/d+2:(r-g)/d+4;h*=60}return[h,s,l]}
function hsl2rgb(h,s,l){h=((h%360)+360)%360/360;const q=l<.5?l*(1+s):l+s-l*s,p=2*l-q,f=t=>{t=(t%1+1)%1;return t<1/6?p+(q-p)*6*t:t<.5?q:t<2/3?p+(q-p)*(2/3-t)*6:p};return s===0?[l*255,l*255,l*255]:[f(h+1/3)*255,f(h)*255,f(h-1/3)*255]}
const dE=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1],a[2]-b[2]);
function gamutOK(L,a,b){const fy=(L+16)/116,fx=fy+a/500,fz=fy-b/200,fi=t=>t>6/29?t*t*t:3*(6/29)*(6/29)*(t-4/29),X=fi(fx)*.95047,Y=fi(fy),Z=fi(fz)*1.08883,r=3.2404542*X-1.5371385*Y-.4985314*Z,g=-.969266*X+1.8760108*Y+.041556*Z,bb=.0556434*X-.2040259*Y+1.0572252*Z;return r>=-.001&&r<=1.001&&g>=-.001&&g<=1.001&&bb>=-.001&&bb<=1.001}
function fitLCH(L,C,h){const rad=h*Math.PI/180;let c=C;for(let i=0;i<48;i++){const a=Math.cos(rad)*c,b=Math.sin(rad)*c;if(gamutOK(L,a,b))return lab2rgb(L,a,b);c*=.92}return lab2rgb(L,0,0)}
const lab2rgbFit=(L,a,b)=>fitLCH(L,Math.hypot(a,b),Math.atan2(b,a)*180/Math.PI);
const LABC=new Map();const labH=h=>{let v=LABC.get(h);if(!v){v=rgb2lab(...h2rgb(h));if(LABC.size>60000)LABC.clear();LABC.set(h,v)}return v};

const DEF={hue:0,sat:0,vib:0,bri:0,con:0,exp:0,gam:0,tmp:0,tnt:0,sha:0,hil:0,bp:0,wp:100,gray:0,sepia:0,inv:0,post:0,mixA:0,uni:0};
function adjust(rgb,P){let[r,g,b]=rgb;
 if(P.exp||P.tmp||P.tnt){let R=s2l(r),G=s2l(g),B=s2l(b);const e=Math.pow(2,P.exp/50);R*=e*(1+P.tmp*.004);G*=e*(1-P.tnt*.004);B*=e*(1-P.tmp*.004);r=l2s(R);g=l2s(G);b=l2s(B)}
 if(P.hue||P.sat||P.vib){let[h,s,l]=rgb2hsl(r,g,b);if(s>0)h+=P.hue;
  if(P.sat)s=clamp(s*(1+P.sat/100),0,1);
  if(P.vib){const v=P.vib/100;s=clamp(v>=0?s*(1+v*1.6*(1-s)):s*(1+v*.9),0,1)}
  [r,g,b]=hsl2rgb(h,s,l)}
 let[L,A,B]=rgb2lab(r,g,b);
 if(P.bp>0||P.wp<100)L=(L-P.bp)/Math.max(1,P.wp-P.bp)*100;
 if(P.gam)L=100*Math.pow(clamp(L,0,100)/100,Math.pow(2,-P.gam/50));
 if(P.bri)L+=P.bri*.5;
 if(P.con)L=(L-50)*(1+P.con/100)+50;
 if(P.sha)L+=P.sha*.3*clamp(1-L/50,0,1);
 if(P.hil)L+=P.hil*.3*clamp((L-50)/50,0,1);
 L=clamp(L,0,100);
 if(P.gray){const k=1-P.gray/100;A*=k;B*=k}
 if(P.sepia){const k=P.sepia/100;A=A*(1-k)+12*k;B=B*(1-k)+26*k}
 [r,g,b]=lab2rgb(L,A,B);
 if(P.inv){const k=P.inv/100;r=r*(1-k)+(255-r)*k;g=g*(1-k)+(255-g)*k;b=b*(1-k)+(255-b)*k}
 if(P.post>=2){const n=P.post-1,q=v=>Math.round(v/255*n)/n*255;r=q(clamp(r,0,255));g=q(clamp(g,0,255));b=q(clamp(b,0,255))}
 if(P.mixA>0&&P.mixC){const k=P.mixA/100,m=h2rgb(P.mixC);r+=(m[0]-r)*k;g+=(m[1]-g)*k;b+=(m[2]-b)*k}
 return[clamp(r,0,255),clamp(g,0,255),clamp(b,0,255)]}

const MODES=[
 {id:'none',n:'Sem paleta',ic:'ban',d:'Só os ajustes acima, sem trocar por cores da paleta.'},
 {id:'fiel',n:'Fiel à paleta',ic:'pipette',d:'Usa a paleta: troca cada cor pela cor mais próxima dela (distância perceptual em Lab). Com “Manter luz original” o claro/escuro de cada cor continua.',keep:100},
 {id:'luz',n:'Mapa de luz',ic:'sun',d:'Partes escuras recebem as cores escuras da paleta e as claras recebem as claras. Mantém o sombreado, com transições suaves.',keep:0},
 {id:'cel',n:'Cel shading',ic:'layers',d:'Mapa de luz em degraus (2 a 8 faixas): visual de desenho animado, sem transições suaves.',keep:0},
 {id:'matiz',n:'Matiz da paleta',ic:'palette',d:'Troca só o matiz pelo matiz mais próximo da paleta; saturação e luz originais permanecem.'},
 {id:'matizmap',n:'Mapa de matiz',ic:'rainbow',d:'Espalha a roda de cores pela paleta: cada matiz do desenho vira uma cor da paleta (em ordem de matiz), mantendo a luz e a vivacidade de cada cor. Resultado estilizado, com cores sempre combinando entre si; cinzas ficam como estão.',keep:100},
 {id:'ciclo',n:'Ciclos',ic:'infinity',d:'A luz percorre a paleta várias vezes, indo e voltando: surgem faixas de cor repetidas, estilo solarização / pôster psicodélico, seguindo cada sombra do desenho.',keep:0}];
function makeMapper(mode,pal,o,adjList){
 if(mode==='none'||!pal.length)return null;
 const pl=pal.map(h=>{const rgb=h2rgb(h);return{rgb,lab:rgb2lab(...rgb),hsl:rgb2hsl(...rgb)}}),srt=pl.slice().sort((a,b)=>a.lab[0]-b.lab[0]),keep=o.keep/100;
 let Lmin=0,Lmax=100;
 if(o.norm&&adjList.length){let lo=1e9,hi=-1e9;adjList.forEach(c=>{const L=rgb2lab(...c)[0];if(L<lo)lo=L;if(L>hi)hi=L});if(hi-lo>=3){Lmin=lo;Lmax=hi}}
 const toT=L=>{let t=clamp((L-Lmin)/(Lmax-Lmin),0,1);if(o.dist)t=Math.pow(t,Math.pow(2,-o.dist/50));return t};
 const sample=t=>{if(srt.length===1)return srt[0].lab;const u=clamp(t,0,1)*(srt.length-1),i=Math.min(srt.length-2,Math.floor(u)),f=u-i,a=srt[i].lab,b=srt[i+1].lab;return[a[0]+(b[0]-a[0])*f,a[1]+(b[1]-a[1])*f,a[2]+(b[2]-a[2])*f]};
 const chroma=pl.filter(p=>p.hsl[1]>.06),hsrt=chroma.slice().sort((a,b)=>a.hsl[0]-b.hsl[0]);
 return rgb=>{
  if(mode==='matizmap'){const[h,s]=rgb2hsl(...rgb);if(s<.05||!hsrt.length)return rgb;const lab=rgb2lab(...rgb),n=hsrt.length,u=h/360*n,i=Math.floor(u)%n,f=u-Math.floor(u),A=hsrt[i].lab,B=hsrt[(i+1)%n].lab,T=[A[0]+(B[0]-A[0])*f,A[1]+(B[1]-A[1])*f,A[2]+(B[2]-A[2])*f],k=clamp(s/.55,.4,1.15);return lab2rgbFit(T[0]+(lab[0]-T[0])*keep,T[1]*k,T[2]*k)}
  if(mode==='ciclo'){const lab=rgb2lab(...rgb);let u=toT(lab[0])*Math.max(1,o.cyc||3);u=u%2;if(u>1)u=2-u;const T=sample(u);return lab2rgbFit(T[0]+(lab[0]-T[0])*keep,T[1],T[2])}
  if(mode==='matiz'){const[h,s,l]=rgb2hsl(...rgb);if(!chroma.length||s<.04)return rgb;let best=chroma[0].hsl[0],bd=1e9;chroma.forEach(p=>{let d=Math.abs(p.hsl[0]-h);d=Math.min(d,360-d);if(d<bd){bd=d;best=p.hsl[0]}});const out=hsl2rgb(best,s,l);return out}
  const lab=rgb2lab(...rgb);let t;
  if(mode==='fiel'){let bd=1e9;pl.forEach(p=>{const d=dE(lab,p.lab);if(d<bd){bd=d;t=p.lab}})}
  else if(mode==='luz')t=sample(toT(lab[0]));
  else{const N=Math.max(2,Math.round(o.bands)),k=Math.min(N-1,Math.floor(toT(lab[0])*N));t=sample(k/(N-1))}
  return lab2rgb(t[0]+(lab[0]-t[0])*keep,t[1],t[2])}}
function unify(out,counts,tol){const agg=new Map();out.forEach((v,k)=>agg.set(v,(agg.get(v)||0)+(counts.get(k)||1)));
 const ks=[...agg].sort((a,b)=>b[1]-a[1]).map(x=>x[0]),lead=[],to=new Map();
 ks.forEach(h=>{const lb=labH(h);let f=null;for(const l of lead){if(dE(lb,labH(l))<=tol){f=l;break}}if(!f){lead.push(h);f=h}to.set(h,f)});
 out.forEach((v,k)=>out.set(k,to.get(v)||v))}
function buildMap(counts,P,mode,pal,o){const keys=[...counts.keys()],adj=new Map(),list=[];
 keys.forEach(k=>{const r=adjust(h2rgb(k),P);adj.set(k,r);list.push(r)});
 const mp=makeMapper(mode,pal,o,list),t=o.int/100,out=new Map();
 keys.forEach(k=>{let r=adj.get(k);if(mp){const m=mp(r);r=[r[0]+(m[0]-r[0])*t,r[1]+(m[1]-r[1])*t,r[2]+(m[2]-r[2])*t]}out.set(k,rgb2h(r[0],r[1],r[2]))});
 if(P.uni>0)unify(out,counts,P.uni);return out}
function extract(counts,k){const arr=[...counts].map(([h,c])=>({c,lab:labH(h)})).sort((a,b)=>b.c-a.c).slice(0,3000);if(!arr.length)return[];k=Math.max(1,Math.min(k,arr.length));
 const cen=[arr[0].lab.slice()];while(cen.length<k){let best=null,bd=-1;arr.forEach(p=>{let d=1e9;cen.forEach(c=>{d=Math.min(d,dE(p.lab,c))});const sc=d*Math.sqrt(p.c);if(sc>bd){bd=sc;best=p}});if(!best||bd<=0)break;cen.push(best.lab.slice())}
 for(let it=0;it<12;it++){const sum=cen.map(()=>[0,0,0,0]);arr.forEach(p=>{let bi=0,bd=1e9;cen.forEach((c,i)=>{const d=dE(p.lab,c);if(d<bd){bd=d;bi=i}});const s=sum[bi];s[0]+=p.lab[0]*p.c;s[1]+=p.lab[1]*p.c;s[2]+=p.lab[2]*p.c;s[3]+=p.c});sum.forEach((s,i)=>{if(s[3])cen[i]=[s[0]/s[3],s[1]/s[3],s[2]/s[3]]})}
 const out=[];cen.sort((a,b)=>a[0]-b[0]).forEach(c=>{const h=rgb2h(...lab2rgb(...c));if(!out.includes(h))out.push(h)});return out}
const HARM=[['auto','Aleatória'],['ana','Análoga'],['comp','Complementar'],['split','Compl. dividida'],['tri','Tríade'],['tetra','Tétrade'],['mono','Monocromática']];
const MOODS=[{n:'eq',L0:[18,30],L1:[88,96],C:[40,64]},{n:'pastel',L0:[56,68],L1:[92,97],C:[18,34]},{n:'vivid',L0:[24,36],L1:[84,92],C:[64,92]},{n:'dark',L0:[8,16],L1:[68,82],C:[30,56]},{n:'earth',L0:[20,30],L1:[88,95],C:[22,42],hue:[12,100]}];
function anchors(k,h){switch(k){case'ana':return[h,h+30,h-30,h+60,h-60];case'comp':return[h,h+180,h+22,h+202,h-22];case'split':return[h,h+150,h+210,h+16,h+196];case'tri':return[h,h+120,h+240,h+22,h+142];case'tetra':return[h,h+90,h+180,h+270,h+16];default:return[h,h+7,h-7,h+14,h-14]}}
function genPalette(N,harm,prev){const rnd=(a,b)=>a+Math.random()*(b-a),pick=a=>a[Math.floor(Math.random()*a.length)];
 N=clamp(Math.round(N)||5,3,8);const kinds=['ana','comp','split','tri','tetra','mono'];
 for(let attempt=0;attempt<8;attempt++){
  const kind=harm==='auto'?pick(kinds):harm,md=pick(MOODS),h0=md.hue?rnd(md.hue[0],md.hue[1]):rnd(0,360),H=anchors(kind,h0).sort(()=>Math.random()-.5),
   L0=rnd(...md.L0),L1=rnd(...md.L1),Cb=rnd(...md.C)*(kind==='mono'?.8:1),acc=Math.round((N-1)*rnd(.35,.72)),out=[];
  for(let i=0;i<N;i++){const t=N>1?i/(N-1):.5;let L=L0+(L1-L0)*t+rnd(-2.5,2.5),h=H[i%H.length]+(t-.5)*rnd(10,26)+rnd(-5,5),
    C=Cb*(.3+.7*Math.pow(Math.sin(Math.PI*(.1+.8*t)),.9))*rnd(.85,1.1);if(i===acc){C*=1.3;h=H[(i+1)%H.length]}
   if(md.n==='earth')C*=.9;out.push({L:clamp(L,5,98),C,h})}
  out.sort((a,b)=>a.L-b.L);
  for(let i=1;i<out.length;i++){const a=out[i-1],b=out[i];const da=Math.hypot(b.L-a.L,(Math.cos(b.h*Math.PI/180)*b.C-Math.cos(a.h*Math.PI/180)*a.C),(Math.sin(b.h*Math.PI/180)*b.C-Math.sin(a.h*Math.PI/180)*a.C));if(da<14)b.L=Math.min(98,a.L+(14-da)*.8+4)}
  const hexes=out.map(c=>rgb2h(...fitLCH(clamp(c.L,5,98),c.C,((c.h%360)+360)%360)));const u=[...new Set(hexes)];
  if(u.length>=Math.min(N,3)&&!(prev&&u.join()===prev.join()))return u}
 return PRESETS[Math.floor(Math.random()*PRESETS.length)].c.slice()}
function parsePal(txt){const out=[];String(txt||'').split(/[\s,;|]+/).forEach(t=>{t=t.replace(/^#|^0x/i,'');if(/^[0-9a-f]{3}$/i.test(t))t=t.split('').map(c=>c+c).join('');if(/^[0-9a-f]{6}$/i.test(t)&&out.length<32)out.push(t.toLowerCase())});return out}
const PRESETS=[
 ['Rosado suave','6d6875,b5838d,e5989b,ffb4a2,ffcdb2'],['Pôr do sol','264653,2a9d8f,e9c46a,f4a261,e76f51'],['Oceano','03045e,0077b6,00b4d8,90e0ef,caf0f8'],
 ['Floresta','1b4332,2d6a4f,40916c,74c69d,d8f3dc'],['Vinho','22223b,4a4e69,9a8c98,c9ada7,f2e9e4'],['Neon','f72585,b5179e,7209b7,3a0ca3,4cc9f0'],
 ['Terra','582f0e,7f4f24,936639,b6ad90,c2c5aa'],['Pastel','ffadad,ffd6a5,fdffb6,caffbf,9bf6ff,a0c4ff,bdb2ff,ffc6ff'],['Arco-íris','ff595e,ffca3a,8ac926,1982c4,6a4c93'],
 ['Ciano noturno','0b132b,1c2541,3a506b,5bc0be,6fffe9'],['Game Boy','0f380f,306230,8bac0f,9bbc0f'],['Sépia','2b1d0e,5a3e22,8c6a43,c4a77d,efe0c4'],
 ['P&B 5 tons','000000,404040,808080,c0c0c0,ffffff'],['Outono','780000,c1121f,fdf0d5,003049,669bbc'],['Candy','ff99c8,fcf6bd,d0f4de,a9def9,e4c1f9'],
 ['Athelis','1a1a1a,3b4260,6a7495,a9b3d6,eef1fb'],['Fogo','03071e,370617,6a040f,d00000,e85d04,faa307,ffba08'],['Gelo','1d3557,457b9d,a8dadc,f1faee'],
 ['Lavanda','2e1a47,5b3a8c,8e6cc9,c3a6f0,ece1ff'],['Vintage','3d405b,81b29a,f2cc8f,e07a5f,f4f1de'],['Menta','084c41,1b9a85,5fd3b5,b8f2dc,f2fff9'],['Café','1e1410,4b2e1e,8a5a3b,c79a6b,f1dfc4'],
 ['Crepúsculo','10002b,240046,3c096c,5a189a,7b2cbf,9d4edd,c77dff,e0aaff'],['Aurora boreal','0b1d3a,0e4d64,1b998b,7ae582,d9ed92'],['Algodão-doce','ffcad4,f4acb7,9d8189,d8e2dc,ffe5d9'],
 ['Argila','7f5539,9c6644,b08968,ddb892,ede0d4'],['Lagoa','012a4a,013a63,01497c,2a6f97,61a5c2,a9d6e5'],['Sakura','590d22,800f2f,a4133c,c9184a,ff4d6d,ff758f,ff8fa3,ffb3c1'],
 ['Matcha','132a13,31572c,4f772d,90a955,ecf39e'],['Cobre','1b1b1e,3d2c2e,6b4226,b87333,e8b98a'],['Noite estrelada','0d1b2a,1b263b,415a77,778da9,e0e1dd'],
 ['Dopamina','ff006e,fb5607,ffbe0b,8338ec,3a86ff'],['Pêssego','ffe5d4,ffcbb0,ff9e7d,e5634d,a63d40'],['Oliva','283618,606c38,fefae0,dda15e,bc6c25'],
 ['Tulipa','5f0f40,9a031e,fb8b24,e36414,0f4c5c'],['Mel','3d2b1f,7a4e2d,c08a3e,f2c14e,fff1c1'],['Grafite','212529,343a40,495057,adb5bd,f8f9fa'],
 ['Magenta noir','1a0b2e,3d1a5c,8a2d8f,e0529c,ffc4d6'],['Tropical','00a896,02c39a,f0f3bd,ffd166,ef476f'],['Anoitecer','2b2d42,8d99ae,edf2f4,ef233c,d90429'],
 ['Praia','f6bd60,f7ede2,f5cac3,84a59d,f28482'],['Safira','0a0908,22333b,5e503f,c6ac8f,eae0d5'],['Ametista','231942,5e548e,9f86c0,be95c4,e0b1cb'],
 ['Cítrico','5b8e7d,bc4b51,8cb369,f4e285,f4a259'],['Brasa','000000,1a0a0a,5c1a1b,b3260e,f77f00,fcbf49'],['Orvalho','d8f3dc,b7e4c7,95d5b2,74c69d,52b788,2d6a4f'],
 ['Rosa quartzo','f8edeb,f9dcc4,fec89a,fcd5ce,fae1dd'],['Cosmos','0b0c10,1f2833,45a29e,66fcf1,c5c6c7'],['Outono dourado','432818,6f1d1b,99582a,bb9457,ffe6a7'],
 ['Sorvete','cdb4db,ffc8dd,ffafcc,bde0fe,a2d2ff'],['Pergaminho','2f2a24,5b4b3a,8c7a5b,c9b78e,f0e6cc'],['Gótico','0b090a,161a1d,660708,a4161a,e5383b,f5f3f4'],
 ['Mediterrâneo','264653,2a9d8f,e9c46a,e76f51,f1faee'],['Deserto','edae49,d1495b,00798c,30638e,003d5b'],['Alvorada','03071e,3d348b,7678ed,f7b801,f18701,f35b04'],
 ['Cerejeira','2d1e2f,5d2e46,b5446e,eb8fa0,fbe4e0'],['Musgo','1b2a1f,2f4a37,5a7d5a,a3b18a,dad7cd'],['Ártico','051923,003554,0582ca,00a6fb,e0f4ff'],
 ['Ouro velho','1c1a14,433a23,8a7434,d4af37,f5e6a8'],['Pôr do sol rosa','3a0ca3,7209b7,b5179e,f72585,ff8fab,ffd6e0'],['Vinil','111111,2d2d34,6c6ea0,f0a6ca,efc3e6,f0e7f7']].map(([n,s])=>({n,c:s.split(',')}));

const st={scope:'sel',mode:'none',live:true,pal:PRESETS[0].c.slice(),P:{...DEF,mixC:'ff8a5c'},o:{keep:100,int:100,bands:4,dist:0,norm:true,ext:5,cyc:3,rn:5,harm:'auto'}};
let backup=null,bkItems=null,active=false,sig='',root=null,raf=0,ready=false;
const neutral=()=>st.mode==='none'&&Object.keys(DEF).every(k=>st.P[k]===DEF[k]);
function scopeItems(){const out=[],sc=st.scope;
 if(sc==='sel')S.layers.forEach(l=>{if(l.lock)return;l.items.forEach(it=>{if(it.k==='h'?S.sel.items.has(it):(S.sel.pts.has(it.a)&&S.sel.pts.has(it.b)))out.push(it)})});
 else if(sc==='layers')selLayers().forEach(l=>{if(l&&!l.lock)l.items.forEach(it=>out.push(it))});
 else S.layers.forEach(l=>{if(!l.lock)l.items.forEach(it=>out.push(it))});
 return out}
const isS=v=>typeof v==='string'&&v.length>0;
function slotsOf(it){const r=[];
 if(it.k==='s'){if(isS(it.c))r.push([it,'c']);return r}
 if(isS(it.c))r.push([it,'c']);
 if(it.t==='I')(it.pal||[]).forEach(e=>{if(isS(e.c))r.push([e,'c'])});
 else if(it.t==='T'){const tx=it.tx||{};if(isS(tx.oc))r.push([tx,'oc']);if(isS(tx.fc))r.push([tx,'fc'])}
 else if(it.o){if(it.o.ocOn&&isS(it.o.oc))r.push([it.o,'oc']);if(it.o.fcOn&&isS(it.o.fc))r.push([it.o,'fc']);
  if(it.o.fcOn&&it.o.gm==='g'&&Array.isArray(it.o.gs))it.o.gs.forEach(g=>{if(g&&isS(g.c))r.push([g,'c'])})}
 return r}
function gather(items){const counts=new Map(),slots=[];items.forEach(it=>slotsOf(it).forEach(([o,k])=>{const h=hx(o[k]);counts.set(h,(counts.get(h)||0)+1);slots.push([o,k,o[k],it])}));return{counts,slots}}
function revertRaw(){if(backup)for(let i=backup.length-1;i>=0;i--){const b=backup[i];b[0][b[1]]=b[2]}}
function revert(){if(!backup)return;revertRaw();const t=bkItems;backup=null;bkItems=null;if(t)t.forEach(it=>{if(it.k==='h')touch(it)});dirty=1;xmlSoon()}
function run(){revert();const items=scopeItems();if(!items.length||neutral())return 0;
 const{counts,slots}=gather(items),map=buildMap(counts,st.P,st.mode,st.pal,st.o);
 backup=[];bkItems=new Set();
 slots.forEach(([o,k,old,it])=>{const nv=map.get(hx(old));if(nv!==undefined&&nv!==hx(old)){backup.push([o,k,old]);o[k]=nv;bkItems.add(it)}});
 bkItems.forEach(it=>{if(it.k==='h')touch(it)});dirty=1;xmlSoon();return backup.length}
function pending(){return!!(backup&&backup.length)}
function snapStr(fn){if(!pending())return fn();const cur=backup.map(b=>b[0][b[1]]);revertRaw();let s;try{s=fn()}finally{backup.forEach((b,i)=>{b[0][b[1]]=cur[i]})}return s}
function stale(){if(!bkItems||!bkItems.size)return false;const all=new Set();S.layers.forEach(l=>l.items.forEach(it=>all.add(it)));for(const it of bkItems)if(!all.has(it))return true;return false}
function curSig(){if(st.scope==='sel')return'S'+S.sel.items.size+'|'+S.sel.pts.size+'|'+[...S.sel.items].slice(0,40).map(i=>i.id).join(',');if(st.scope==='layers')return'L'+[...S.lsel].join(',');return'A'+S.layers.length}
function schedule(){if(raf)return;raf=requestAnimationFrame(()=>{raf=0;update()})}
function update(){
 if(neutral()){active=false;revert()}else{active=true;if(st.live)run();else revert()}
 sig=curSig();paintStat()}
function sync(){if(!root||!ready)return;countBadges();if(!active)return;
 if(stale()){backup=null;bkItems=null;active=false;return}
 const s=curSig();if(s!==sig){sig=s;if(st.live){run()}paintStat()}}
function resetParams(){st.P={...DEF,mixC:st.P.mixC};st.mode='none';active=false;sig='';render()}
function apply(){if(!scopeItems().length){toast(st.scope==='sel'?'Selecione elementos (ou escolha outro escopo)':'Nada no escopo');return}
 if(neutral()){toast('Mova algum ajuste ou escolha um modo de paleta');return}
 const n=run();if(!n){toast('Nenhuma cor mudou');return}
 backup=null;bkItems=null;active=false;commit();toast(n+' cores alteradas');resetParams()}
function discard(){revert();resetParams();toast('Ajustes descartados')}

const $=id=>document.getElementById(id);
const SL=[
 ['b','hue','Matiz','palette',-180,180,'Gira todas as cores no círculo cromático (graus).'],['b','sat','Saturação','droplet',-100,100,'Intensidade das cores. -100 = tudo cinza.'],
 ['b','vib','Vibração','sparkles',-100,100,'Como a saturação, mas protege as cores que já são vivas e realça as apagadas.'],['b','bri','Brilho','sun',-100,100,'Clareia ou escurece (na luminosidade perceptual, em Lab).'],
 ['b','con','Contraste','contrast',-100,100,'Afasta claros e escuros do meio-tom.'],['b','exp','Exposição','zap',-100,100,'Como abrir ou fechar o diafragma (em luz linear).'],['b','gam','Meios-tons','gauge',-100,100,'Clareia/escurece só os tons médios, sem mexer em pretos e brancos.'],
 ['c','tmp','Temperatura','sliders-horizontal',-100,100,'Negativo = mais frio (azul) · positivo = mais quente (laranja).'],['c','tnt','Tonalidade','sliders-vertical',-100,100,'Negativo = mais verde · positivo = mais magenta.'],
 ['c','sha','Sombras','moon',-100,100,'Clareia ou escurece só as partes escuras.'],['c','hil','Realces','sun',-100,100,'Clareia ou escurece só as partes claras.'],
 ['c','bp','Ponto preto','square',0,50,'Tudo abaixo desta luminosidade vira preto (níveis).'],['c','wp','Ponto branco','square',50,100,'Tudo acima desta luminosidade vira branco (níveis).'],
 ['e','gray','Tons de cinza','eye',0,100,'Remove a cor mantendo a luz.'],['e','sepia','Sépia','image',0,100,'Tinge de marrom antigo mantendo a luz.'],['e','inv','Inverter','rotate-ccw',0,100,'Negativo das cores.'],
 ['e','post','Posterizar','layers',0,16,'Número de níveis por canal (0 = desligado). Cores chapadas, poucos tons.'],['e','mixA','Misturar com cor','paintbrush',0,100,'Tinge tudo com a cor escolhida ao lado.'],['e','uni','Unificar tons','focus',0,40,'Junta cores muito próximas (ΔE em Lab) numa só: menos estilos e menos KB.']];
const row=([g,k,l,i,mn,mx,t])=>`<div class="crow" data-k="${k}" title="${t}"><span class="cl">${ic(i,14)}${l}</span><button type="button" class="cs" data-d="-1" title="Diminuir (Shift ×10)" tabindex="-1">${ic('minus',12)}</button><input type="range" min="${mn}" max="${mx}" step="1" value="${st.P[k]}"><button type="button" class="cs" data-d="1" title="Aumentar (Shift ×10)" tabindex="-1">${ic('plus',12)}</button><input type="number" data-nostep="1" class="cn" min="${mn}" max="${mx}" step="1" value="${st.P[k]}"><button class="cz" title="Zerar" tabindex="-1">${ic('rotate-ccw',11)}</button></div>`;
const oRow=(k,l,i,mn,mx,t,show)=>`<div class="crow" data-o="${k}" data-m="${show}" title="${t}"><span class="cl">${ic(i,14)}${l}</span><button type="button" class="cs" data-d="-1" title="Diminuir (Shift ×10)" tabindex="-1">${ic('minus',12)}</button><input type="range" min="${mn}" max="${mx}" step="1" value="${st.o[k]}"><button type="button" class="cs" data-d="1" title="Aumentar (Shift ×10)" tabindex="-1">${ic('plus',12)}</button><input type="number" data-nostep="1" class="cn" min="${mn}" max="${mx}" step="1" value="${st.o[k]}"><button class="cz" title="Padrão" tabindex="-1">${ic('rotate-ccw',11)}</button></div>`;
function mount(){const sec=$('w-color');if(!sec||root)return;
 const grp=g=>SL.filter(x=>x[0]===g).map(row).join('');
 sec.insertAdjacentHTML('afterbegin',`<div class="cbox">
 <div class="cscope"><div class="seg3" id="c_sc"><button data-sc="sel" title="Só os elementos selecionados no canvas">${ic('mouse-pointer-2',14)}<span>Seleção</span><em></em></button><button data-sc="layers" title="Todos os elementos da(s) camada(s) selecionada(s) na lista de camadas (Ctrl/Shift para várias)">${ic('layers-2',14)}<span>Camada(s)</span><em></em></button><button data-sc="all" title="Todos os elementos de todas as camadas (menos as travadas)">${ic('layers',14)}<span>Todas</span><em></em></button></div>
 <label class="fr" title="Mostra o resultado no canvas enquanto você ajusta. Nada entra no histórico até clicar em Aplicar; Reverter volta tudo."><span class="fl">${ic('eye',14)}Pré-visualizar ao vivo</span><input type="checkbox" class="switch" id="c_live" checked></label>
 <button type="button" class="chide" id="c_hide" title="Oculta pontos de controle, contornos de seleção e alças das linhas para você ver só o resultado das cores. Clique de novo para voltar a editar."></button></div>
 <details class="sec" open><summary><span>${ic('sliders-horizontal',14)}</span>Básico</summary><div class="sbody">${grp('b')}</div></details>
 <details class="sec"><summary><span>${ic('thermometer',14)}</span>Cor e tons</summary><div class="sbody">${grp('c')}</div></details>
 <details class="sec"><summary><span>${ic('wand-sparkles',14)}</span>Efeitos</summary><div class="sbody">${grp('e')}<label class="fr" title="Cor usada em “Misturar com cor”."><span class="fl">${ic('palette',14)}Cor da mistura</span><input type="color" id="c_mix" value="#${st.P.mixC}"></label></div></details>
 <details class="sec" open><summary><span>${ic('palette',14)}</span>Paleta e modo</summary><div class="sbody">
  <div class="cmodes" id="c_modes">${MODES.map(m=>`<button data-md="${m.id}" title="${m.d}">${ic(m.ic,15)}<span>${m.n}</span></button>`).join('')}</div>
  <p class="cdesc" id="c_desc"></p>
  ${oRow('keep','Luz original','sun',0,100,'100% = o claro/escuro de cada cor original é mantido (só a cor muda). 0% = a luz também vem da paleta.','fiel,luz,cel,matizmap,ciclo')}
  ${oRow('int','Intensidade','sliders-horizontal',0,100,'Quanto do resultado da paleta é aplicado (0 = só os ajustes, 100 = totalmente com a paleta).','fiel,luz,cel,matiz,matizmap,ciclo')}
  ${oRow('cyc','Ciclos','infinity',1,12,'Quantas vezes a luz percorre a paleta (indo e voltando).','ciclo')}
  ${oRow('bands','Faixas','layers',2,8,'Número de degraus de luz do cel shading.','cel')}
  ${oRow('dist','Distribuição','gauge',-50,50,'Desloca onde a luz muda de faixa/cor: negativo = mais área escura, positivo = mais área clara.','luz,cel,ciclo')}
  <label class="fr" data-m="luz,cel,ciclo" title="Ligado: a luz das cores do escopo é esticada para usar a paleta inteira, do mais escuro ao mais claro. Desligado: usa a luz absoluta."><span class="fl">${ic('scan',14)}Normalizar luz</span><input type="checkbox" class="switch" id="c_norm" ${st.o.norm?'checked':''}></label>
  <div class="cramp" id="c_ramp" hidden></div>
  <div class="chead"><b>Cores da paleta</b><span id="c_cnt"></span><span class="sp"></span><button id="c_sort" title="Ordenar do mais escuro ao mais claro">${ic('arrow-up-down',13)}</button><button id="c_rev" title="Inverter a ordem">${ic('refresh-cw',13)}</button><button id="c_copy" title="Copiar as cores (hex separados por vírgula)">${ic('copy',13)}</button><button id="c_clr" class="dng" title="Limpar a paleta">${ic('trash-2',13)}</button></div>
  <div class="cpal" id="c_pal"></div>
  <div class="chexrow"><input type="text" id="c_hex" spellcheck="false" placeholder="6d6875,b5838d,e5989b,ffb4a2,ffcdb2" title="Cole cores em hex separadas por vírgula, espaço ou ponto e vírgula (com ou sem #, 3 ou 6 dígitos)"><button id="c_use" class="pri" title="Usar estas cores como paleta">${ic('check',14)}</button></div>
  <div class="chexrow crnd"><button type="button" id="c_rnd" title="Gera uma paleta harmônica e elegante (esquema de matizes + rampa de luz + acento). Clique de novo para outra.">${ic('dices',15)}Gerar paleta</button><select id="c_harm" title="Esquema de harmonia">${HARM.map(h=>`<option value="${h[0]}"${h[0]===st.o.harm?' selected':''}>${h[1]}</option>`).join('')}</select><input type="number" id="c_rn" class="mini" min="3" max="8" value="${st.o.rn}" title="Quantidade de cores da paleta gerada"></div>
  <div class="chexrow"><button id="c_ext" title="Extrai da seleção/escopo as cores mais representativas e usa como paleta">${ic('wand-sparkles',14)}Extrair do escopo</button><input type="number" id="c_extn" class="mini" min="2" max="16" value="${st.o.ext}" title="Quantidade de cores a extrair"></div>
  <div class="chead"><b>Paletas prontas</b></div>
  <div class="cpre" id="c_pre">${PRESETS.map((p,i)=>`<button data-pi="${i}" title="${p.n}: ${p.c.join(', ')}"><span class="pn">${p.n}</span><span class="ps">${p.c.map(c=>`<i style="background:#${c}"></i>`).join('')}</span></button>`).join('')}</div>
 </div></details></div>`);
 sec.insertAdjacentHTML('beforeend',`<div class="wfoot cfoot"><div id="c_stat">Pronto</div><div class="cbtns"><button id="c_apply" class="pri" title="Aplica os ajustes de verdade (entra no Ctrl+Z)">${ic('check',14)}Aplicar</button><button id="c_rv" title="Descarta os ajustes e volta às cores originais">${ic('rotate-ccw',14)}Reverter</button></div></div>`);
 root=sec;wire();render()}
function chipsHTML(){return st.pal.map((c,i)=>`<span class="cchip" data-i="${i}" style="background:#${c}" title="#${c} - clique para trocar"><input type="color" value="#${c}"><button class="cx" title="Remover">×</button></span>`).join('')+(st.pal.length<32?`<button class="cadd" id="c_add" title="Adicionar cor">${ic('plus',14)}</button>`:'')}
function rampHTML(){const m=st.mode;if(!(m==='luz'||m==='cel'||m==='ciclo'||m==='matizmap')||st.pal.length<1)return'';
 const srt=st.pal.map(c=>({c,L:labH(c)[0]})).sort((a,b)=>a.L-b.L).map(x=>x.c);
 const samp=t=>{if(srt.length===1)return srt[0];const u=clamp(t,0,1)*(srt.length-1),i=Math.min(srt.length-2,Math.floor(u)),f=u-i,a=labH(srt[i]),b=labH(srt[i+1]);return rgb2h(...lab2rgb(a[0]+(b[0]-a[0])*f,a[1]+(b[1]-a[1])*f,a[2]+(b[2]-a[2])*f))};
 if(m==='luz'){const s=[];for(let i=0;i<=16;i++)s.push('#'+samp(i/16));return`linear-gradient(90deg,${s.join(',')})`}
 if(m==='ciclo'){const s=[],K=64,cy=Math.max(1,st.o.cyc||3);for(let i=0;i<=K;i++){let u=(i/K*cy)%2;if(u>1)u=2-u;s.push('#'+samp(u))}return`linear-gradient(90deg,${s.join(',')})`}
 if(m==='matizmap'){const hs=st.pal.map(c=>({c,h:rgb2hsl(...h2rgb(c))[0]})).sort((a,b)=>a.h-b.h).map(x=>'#'+x.c);if(hs.length<2)return'';return`linear-gradient(90deg,${hs.concat(hs[0]).join(',')})`}
 const N=Math.round(st.o.bands),s=[];for(let k=0;k<N;k++){const c='#'+samp(N>1?k/(N-1):0);s.push(`${c} ${k/N*100}%`,`${c} ${(k+1)/N*100}%`)}return`linear-gradient(90deg,${s.join(',')})`}
function render(){if(!root)return;
 root.querySelectorAll('#c_sc button').forEach(b=>b.classList.toggle('on',b.dataset.sc===st.scope));
 root.querySelectorAll('#c_modes button').forEach(b=>b.classList.toggle('on',b.dataset.md===st.mode));
 const md=MODES.find(m=>m.id===st.mode);$('c_desc').textContent=md.d;
 root.querySelectorAll('[data-m]').forEach(e=>e.hidden=!e.dataset.m.split(',').includes(st.mode));
 root.querySelectorAll('.crow[data-k]').forEach(r=>{const v=st.P[r.dataset.k];r.querySelector('input[type=range]').value=v;r.querySelector('.cn').value=v;r.classList.toggle('chg',v!==DEF[r.dataset.k])});
 root.querySelectorAll('.crow[data-o]').forEach(r=>{const v=st.o[r.dataset.o];r.querySelector('input[type=range]').value=v;r.querySelector('.cn').value=v});
 $('c_pal').innerHTML=chipsHTML();$('c_cnt').textContent=st.pal.length?'('+st.pal.length+')':'';$('c_hex').value=st.pal.join(',');
 $('c_norm').checked=!!st.o.norm;$('c_live').checked=st.live;$('c_mix').value='#'+st.P.mixC;
 const rp=$('c_ramp'),g=rampHTML();rp.hidden=!g;if(g)rp.style.background=g;paintHide();$('c_harm').value=st.o.harm;$('c_rn').value=st.o.rn;
 root.querySelectorAll('.cpre button').forEach(b=>b.classList.toggle('on',PRESETS[+b.dataset.pi].c.join()===st.pal.join()));
 if(ready){countBadges();paintStat()}}
function countBadges(){if(!root||!ready)return;const keep=st.scope;
 const cnt={sel:0,layers:0,all:0};
 S.layers.forEach(l=>{if(l.lock)return;cnt.all+=l.items.length;if(S.lsel.has(l.id))cnt.layers+=l.items.length;l.items.forEach(it=>{if(it.k==='h'?S.sel.items.has(it):(S.sel.pts.has(it.a)&&S.sel.pts.has(it.b)))cnt.sel++})});
 root.querySelectorAll('#c_sc button').forEach(b=>{const e=b.querySelector('em');if(e)e.textContent=cnt[b.dataset.sc]})}
function paintStat(){const s=$('c_stat');if(!s||!ready)return;const n=scopeItems().length;
 if(!n){s.innerHTML=st.scope==='sel'?`${ic('mouse-pointer-2',13)} Selecione elementos no canvas (ou escolha outro escopo)`:`${ic('layers',13)} Nada neste escopo`;return}
 const ch=pending()?backup.length:0;
 s.innerHTML=`${ic('layers',13)} <b>${n}</b> elemento${n>1?'s':''} no escopo`+(active?` · ${st.live?`<b>${ch}</b> cor${ch===1?'':'es'} alterada${ch===1?'':'s'} (prévia)`:'prévia desligada'}`:'')}
function setP(k,v){const r=SL.find(x=>x[1]===k);v=clamp(Math.round(+v||0),r[4],r[5]);if(k==='bp')v=Math.min(v,st.P.wp-1);if(k==='wp')v=Math.max(v,st.P.bp+1);st.P[k]=v}
function wire(){
 let hold=0,hold2=0;const stopHold=()=>{clearTimeout(hold);clearInterval(hold2);hold=hold2=0};
 const bumpRange=(b,sh)=>{const r=b.closest('.crow'),rg=r&&r.querySelector('input[type=range]');if(!rg)return;const mn=+rg.min,mx=+rg.max,v=Math.min(mx,Math.max(mn,Math.round(+rg.value||0)+(+b.dataset.d)*(sh?10:1)));if(String(v)===rg.value)return;rg.value=v;rg.dispatchEvent(new Event('input',{bubbles:true}))};
 root.addEventListener('pointerdown',e=>{const b=e.target.closest('.cs');if(!b||e.button)return;e.preventDefault();stopHold();bumpRange(b,e.shiftKey);hold=setTimeout(()=>{hold2=setInterval(()=>bumpRange(b,e.shiftKey),70)},380)});
 ['pointerup','pointerleave','pointercancel','blur'].forEach(ev=>root.addEventListener(ev,stopHold,true));
 root.addEventListener('input',e=>{const r=e.target.closest('.crow');
  if(r&&(e.target.type==='range'||e.target.classList.contains('cn'))){if(r.dataset.k){setP(r.dataset.k,e.target.value);const v=st.P[r.dataset.k];r.querySelector('input[type=range]').value=v;if(e.target.type==='range')r.querySelector('.cn').value=v;r.classList.toggle('chg',v!==DEF[r.dataset.k])}
   else{const rr=root.querySelector(`.crow[data-o="${r.dataset.o}"]`),mn=+e.target.min,mx=+e.target.max;st.o[r.dataset.o]=clamp(Math.round(+e.target.value||0),mn,mx);r.querySelector('input[type=range]').value=st.o[r.dataset.o];if(e.target.type==='range')r.querySelector('.cn').value=st.o[r.dataset.o];if(r.dataset.o==='bands')paintRamp()}
   schedule();return}
  if(e.target.id==='c_mix'){st.P.mixC=hx(e.target.value);schedule()}
  if(e.target.closest('.cchip')&&e.target.type==='color'){const i=+e.target.closest('.cchip').dataset.i;st.pal[i]=hx(e.target.value);e.target.closest('.cchip').style.background='#'+st.pal[i];$('c_hex').value=st.pal.join(',');paintRamp();schedule()}});
 root.addEventListener('change',e=>{
  if(e.target.id==='c_live'){st.live=e.target.checked;schedule()}
  if(e.target.id==='c_norm'){st.o.norm=e.target.checked;schedule()}
  if(e.target.id==='c_harm')st.o.harm=e.target.value;
  if(e.target.id==='c_rn')st.o.rn=clamp(Math.round(+e.target.value||5),3,8);
  if(e.target.id==='c_extn')st.o.ext=clamp(Math.round(+e.target.value||5),2,16);
  if(e.target.id==='c_hex')useHex();
  if(e.target.closest('.cchip')&&e.target.type==='color'){render()}});
 root.addEventListener('dblclick',e=>{const r=e.target.closest('.crow');if(r&&e.target.type==='range')resetRow(r)});
 root.addEventListener('keydown',e=>{if(e.target.id==='c_hex'&&e.key==='Enter'){e.preventDefault();useHex()}});
 root.addEventListener('click',e=>{const t=e.target;let b;
  if(b=t.closest('.cz')){resetRow(b.closest('.crow'));return}
  if(b=t.closest('#c_sc button')){st.scope=b.dataset.sc;sig='';render();update();return}
  if(b=t.closest('#c_modes button')){st.mode=b.dataset.md;const m=MODES.find(x=>x.id===st.mode);if(m.keep!==undefined)st.o.keep=m.keep;render();update();return}
  if(b=t.closest('.cx')){const i=+b.closest('.cchip').dataset.i;st.pal.splice(i,1);render();schedule();e.preventDefault();return}
  if(t.closest('#c_add')){const c=hx(document.getElementById('col')?document.getElementById('col').value:'ffffff');st.pal.push(c);render();schedule();return}
  if(b=t.closest('#c_pre button')){st.pal=PRESETS[+b.dataset.pi].c.slice();if(st.mode==='none')st.mode='fiel',st.o.keep=MODES[1].keep;render();update();return}
  if(t.closest('#c_hide')){S.hideCtl=!S.hideCtl;dirty=1;paintHide();return}
  if(t.closest('#c_rnd')){const p=genPalette(st.o.rn,st.o.harm,st.pal);st.pal=p;if(st.mode==='none')st.mode='fiel',st.o.keep=MODES[1].keep;render();update();toast('Paleta gerada: '+p.map(c=>'#'+c).join(' '));return}
  if(t.closest('#c_use')){useHex();return}
  if(t.closest('#c_sort')){st.pal.sort((a,b)=>labH(a)[0]-labH(b)[0]);render();schedule();return}
  if(t.closest('#c_rev')){st.pal.reverse();render();schedule();return}
  if(t.closest('#c_clr')){st.pal=[];render();schedule();return}
  if(t.closest('#c_copy')){const s=st.pal.join(',');(navigator.clipboard?navigator.clipboard.writeText(s):Promise.reject()).then(()=>toast('Paleta copiada: '+s),()=>{$('c_hex').select();toast('Copie com Ctrl+C')});return}
  if(t.closest('#c_ext')){const it=scopeItems();if(!it.length){toast('Nada no escopo');return}const{counts}=gather(it),p=extract(counts,st.o.ext);if(!p.length){toast('Sem cores no escopo');return}st.pal=p;if(st.mode==='none')st.mode='fiel',st.o.keep=MODES[1].keep;render();update();toast(p.length+' cores extraídas');return}
  if(t.closest('#c_apply')){apply();return}
  if(t.closest('#c_rv')){discard();return}});}
function paintHide(){if(typeof paintZB==='function')paintZB();const b=$('c_hide');if(!b)return;const h=typeof S!=='undefined'&&!!S.hideCtl;b.classList.toggle('on',h);b.innerHTML=ic(h?'eye':'eye-off-ctl',14)+'<span>'+(h?'Mostrar pontos de controle':'Ocultar pontos de controle')+'</span>'}
function paintRamp(){const rp=$('c_ramp'),g=rampHTML();rp.hidden=!g;if(g)rp.style.background=g}
function resetRow(r){if(!r)return;if(r.dataset.k){st.P[r.dataset.k]=DEF[r.dataset.k]}else{const k=r.dataset.o,d={keep:(MODES.find(m=>m.id===st.mode)||{}).keep??100,int:100,bands:4,dist:0,cyc:3};st.o[k]=d[k]}render();schedule()}
function useHex(){const p=parsePal($('c_hex').value);if(!p.length){toast('Nenhuma cor válida. Ex.: 6d6875,b5838d,e5989b');$('c_hex').value=st.pal.join(',');return}st.pal=p;if(st.mode==='none')st.mode='fiel',st.o.keep=MODES[1].keep;render();update()}
function open(sc,center){if(typeof S!=='undefined'&&S.mode==='map'){if(typeof toast==='function')toast('Ajustar cores é do modo Desenhar');return}if(sc)st.scope=sc;if(typeof WM!=='undefined'){if(center)WM.center('w-color',430,800);else WM.focus('w-color',true)}sig='';render();if(active)update()}
function init(){mount();ready=true;render();const b=$('colwin');if(b)b.onclick=()=>open();const s=$('sb-col');if(s)s.onclick=()=>open('sel',true);}
return{mount,init,sync,pending,snapStr,open,engine:{genPalette,adjust,buildMap,makeMapper,extract,parsePal,rgb2lab,lab2rgb,PRESETS,DEF,unify}}})();

if(typeof document!=='undefined'&&document.getElementById('w-color'))CA.mount();
