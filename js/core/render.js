'use strict';
const MR=(()=>{
const AS={},EXT={};let ver=0,onLoad=()=>{};
const num=(v,d=0)=>{v=parseFloat(v);return isNaN(v)?d:v},clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const hex6=s=>{s=String(s||'').replace('#','');return(s.length>6?s.slice(-6):s).padStart(6,'0')};
const TILE=40;
function info(path){let a=AS[path];if(a)return a;a=AS[path]={st:0,w:0,h:0,e:0,f:0,slots:[],R:{},txt:''};
 fetch(path).then(r=>{if(!r.ok)throw 0;return r.text()}).then(t=>{const head=(t.match(/<svg[^>]*>/)||[''])[0];a.w=num((head.match(/\swidth="([-\d.]+)/)||[])[1],1);a.h=num((head.match(/\sheight="([-\d.]+)/)||[])[1],1);const g=t.match(/<g\b[^>]*?\btransform\s*=\s*"matrix\(([^)]*)\)"/);if(g){const q=g[1].trim().split(/[\s,]+/).map(Number);a.e=q[4]||0;a.f=q[5]||0}
  const re=/id="Couleur(\d+)(?:_([0-9A-Fa-f]{6}))?"/g;let m;while(m=re.exec(t))if(a.slots[+m[1]]===undefined)a.slots[+m[1]]=(m[2]||'000000').toUpperCase();a.txt=t;a.st=1;ver++;onLoad()}).catch(()=>{a.st=-1;ver++;onLoad()});return a}
function build(a,cols,r){const d=new DOMParser().parseFromString(a.txt,'image/svg+xml'),svg=d.documentElement,NS='http://www.w3.org/2000/svg';svg.setAttribute('viewBox',`0 0 ${a.w} ${a.h}`);
 if(a.slots.length){let defs=d.querySelector('defs');if(!defs){defs=d.createElementNS(NS,'defs');svg.appendChild(defs)}const made={};
  d.querySelectorAll('[id^="Couleur"]').forEach(el=>{const m=el.getAttribute('id').match(/^Couleur(\d+)(?:_([0-9A-Fa-f]{6}))?/),i=+m[1],hx=hex6(cols[i]||m[2]||'000000'),fid='tn'+hx;
   if(!made[fid]){made[fid]=1;const v=[0,2,4].map(k=>(parseInt(hx.substr(k,2),16)/128).toFixed(4)),f=d.createElementNS(NS,'filter');f.setAttribute('id',fid);f.setAttribute('x','-50%');f.setAttribute('y','-50%');f.setAttribute('width','200%');f.setAttribute('height','200%');f.setAttribute('color-interpolation-filters','sRGB');
    const c=d.createElementNS(NS,'feColorMatrix');c.setAttribute('type','matrix');c.setAttribute('values',`${v[0]} 0 0 0 0 0 ${v[1]} 0 0 0 0 0 ${v[2]} 0 0 0 0 0 1 0`);f.appendChild(c);defs.appendChild(f)}
   el.setAttribute('filter','url(#'+fid+')')})}
 const im=new Image();im.onload=()=>{r.img=im;r.ok=1;ver++;onLoad()};im.onerror=()=>{r.ok=-1};im.src=URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(d)],{type:'image/svg+xml'}))}
function get(path,cols){const a=info(path);if(a.st!==1)return null;const k=(cols||[]).join(',');let r=a.R[k];if(!r){r=a.R[k]={ok:0,img:null};build(a,cols||[],r)}return r.ok===1?{a,img:r.img}:null}
let miss=false;
let CTX={dodue:false,theme:'',defilante:false};
const setMap=at=>{at=at||{};CTX={dodue:'dodue' in at,theme:at.theme||'',defilante:'defilante' in at}};
const DEFIMG={6:'https://www.transformice.com/images/defilante_plus.png',15:'https://www.transformice.com/images/defilante_mort.png',16:'https://www.transformice.com/images/defilante_saut.png',32:'https://www.transformice.com/images/defilante_vitesse.png'};
const DI={};function defI(u){let i=DI[u];if(!i){i=DI[u]=new Image();i.onload=()=>{ver++;onLoad()};i.src=u}return i}
const defUrl=it=>CTX.defilante?DEFIMG[num(it.at.C)|0]||null:null;
const defOk=u=>{const i=defI(u);return i.complete&&i.naturalWidth>0?i:null};
function put(c,path,x,y,sx,sy,cols){const g=get(path,cols);if(!g){miss=true;return false}sx=sx||1;sy=sy||1;c.drawImage(g.img,x-g.a.e*sx,y-g.a.f*sy,g.a.w*sx,g.a.h*sy);return true}
const tile=n=>`assets/ground/$T_${n}.svg`,has=n=>{const a=info(tile(n));return a.st===1};
function Rng(seed){let s=Math.abs(seed)%4294967296;const next=()=>{s=(s*1664525+1013904223)%4294967296;return s/4294967296};next();next();return{next,pick:o=>o[Math.floor(next()*o.length)%o.length]}}
const seedOf=(k,i)=>((i+1+(k==='D'?100000:k==='O'?200000:0))*2654435761)%4294967296;
const SPEC={3:{fill:[1,2,3]},5:{fill:[4,5]},7:{fill:[0,12]},9:{fill:[15,16]},15:{fill:[28]},
6:{fill:[4,5],top:[6,7],left:10,right:11,cTL:9,cTR:8},10:{fill:[17,18],top:[20],left:23,right:22,cTL:19,cTR:21,leftDx:-31,rightDx:31},
11:{fill:[4,5],top:[25,26],left:10,right:11,cTL:24,cTR:27},17:{fill:[4,5],top:[29,30],left:33,right:34,cTL:32,cTR:31},
18:{fill:[4,5],top:[35,36],left:39,right:40,cTL:38,cTR:37},19:{fill:[41,42],top:[43,44],left:47,right:48,cTL:46,cTR:45},20:{fill:[49,50],top:[51],left:54,right:55,cTL:53,cTR:52}};
const FB={0:'#8a5a2b',1:'#aee2f0',2:'#d8588c',3:'#d8501e',4:'#6b3a1c',5:'#7a5530',6:'#4f9a3a',7:'#d8c27a',8:'#ffffff',9:'#3a7fd0',10:'#8e8e8e',11:'#f4f8ff',15:'#e0e0e0',16:'#9a6a38',17:'#5aa84a',18:'#3f8a52',19:'#9ad43a',20:'#e8b830',21:'#6a3fa8'};
const simpleClass=t=>t===0?'$Sol_Dur':t===1?'$Glacon':t===2?'$Sol_Rebond':t===4?'$Sol_Chocolat':t===8?'$Transparent':t>=16?'$Sol_Dur':null;
function mk(w,h,fn){let sc=w*h*4<6e6?2:1;if(FAST){const need=Math.pow(2,Math.ceil(Math.log2(Math.max(.0625,(VIEWZ||1)*(typeof devicePixelRatio==='number'?devicePixelRatio:1)))));sc=Math.min(sc,need)}if(w*h>3e7)sc=Math.sqrt(3e7/(w*h));if(sc<.05)return null;const c=document.createElement('canvas');c.width=Math.ceil(w*sc);c.height=Math.ceil(h*sc);const x=c.getContext('2d');x.scale(sc,sc);x.translate(w/2,h/2);fn(x);return c}
function tintCv(c,hx,box){if(!hx)return;try{const x=c.getContext('2d'),bx=box?Math.max(0,Math.floor(box[0])):0,by=box?Math.max(0,Math.floor(box[1])):0,bw=box?Math.min(c.width,Math.ceil(box[2]))-bx:c.width,bh=box?Math.min(c.height,Math.ceil(box[3]))-by:c.height;if(bw<=0||bh<=0)return;const d=x.getImageData(bx,by,bw,bh),p=d.data,r=parseInt(hx.substr(0,2),16)/128,g=parseInt(hx.substr(2,2),16)/128,b=parseInt(hx.substr(4,2),16)/128;for(let i=0;i<p.length;i+=4){p[i]=Math.min(255,p[i]*r);p[i+1]=Math.min(255,p[i+1]*g);p[i+2]=Math.min(255,p[i+2]*b)}x.putImageData(d,bx,by)}catch(e){}}
function fallback(x,t,W,H){x.strokeStyle='rgba(0,0,0,.35)';x.fillStyle=FB[t]||'#8a8a8a';x.globalAlpha=t===8?.35:1;x.fillRect(-W/2,-H/2,W,H);x.globalAlpha=1;x.lineWidth=1;x.strokeRect(-W/2,-H/2,W,H)}
let TCL={},TBM={},FAST=false,VIEW=null,VIEWZ=1,CULL=null;
function cullFor(a){if(!FAST||!VIEW)return null;if(num((a.P||'').split(',')[4]))return null;const t=num(a.T)|0;if(t===13)return null;const X=num(a.X),Y=num(a.Y);return[VIEW[0]-X-80,VIEW[1]-Y-80,VIEW[2]-X+80,VIEW[3]-Y+80].map(Math.round)}
function put2(x,n,px,py){let g=TCL[n];if(!g){g=get(tile(n));if(!g){miss=true;return false}TCL[n]=g}
 if(CULL&&(px-g.a.e+g.a.w<CULL[0]||px-g.a.e>CULL[2]||py-g.a.f+g.a.h<CULL[1]||py-g.a.f>CULL[3]))return true;
 const m=x._fm||(x._fm=x.getTransform()),sc=m.a;
 if(FAST&&sc<=2&&m.b===0&&m.c===0){const X=(px-g.a.e)*sc+m.e,Y=(py-g.a.f)*sc+m.f,ix=Math.floor(X),iy=Math.floor(Y),fx=X-ix,fy=Y-iy,key=n+'|'+sc+'|'+fx.toFixed(4)+'|'+fy.toFixed(4)+'|'+g.img.src.length;
  let t=TBM[key];if(!t){const c=document.createElement('canvas');c.width=Math.ceil(g.a.w*sc+fx)+1;c.height=Math.ceil(g.a.h*sc+fy)+1;c.getContext('2d').drawImage(g.img,fx,fy,g.a.w*sc,g.a.h*sc);t=TBM[key]=c}
  x.setTransform(1,0,0,1,0,0);x.drawImage(t,ix,iy);x.setTransform(m);return true}
 x.drawImage(g.img,px-g.a.e,py-g.a.f,g.a.w,g.a.h);return true}
function sunOverlay(x,W,H){const g=get('assets/other/$E_1.svg');if(!g){miss=true;return}x.save();if(CULL){x.beginPath();x.rect(CULL[0],CULL[1],CULL[2]-CULL[0],CULL[3]-CULL[1]);x.clip()}x.globalCompositeOperation='overlay';x.drawImage(g.img,-W/2-g.a.e*W/g.a.w,-H/2-g.a.f*H/g.a.h,W,H);x.globalCompositeOperation='source-over';x.restore()}
function extImg(u){let i=EXT[u];if(!i){i=EXT[u]=new Image();i.crossOrigin='anonymous';i.onload=()=>{ver++;onLoad()};i.onerror=()=>{i._e=1;ver++;onLoad()};i.src=u}return i}
const imgUrl=u=>{u=String(u||'').trim();if(!u)return'';let h;try{h=new URL(u,'http://transformice.com/images/').href}catch(e){return''}return'https://images.weserv.nl/?url='+h};
const mImg=it=>{const u=imgUrl(it.at.U);if(!u)return null;const i=extImg(u);return i.complete&&i.naturalWidth>0?i:null};
function drawMapImg(c,it){const u=imgUrl(it.at.U);if(!u)return;const i=extImg(u),x=num(it.at.X),y=num(it.at.Y);if(i.complete&&i.naturalWidth>0)c.drawImage(i,x,y);else if(i._e){c.save();c.strokeStyle='#ff5252';c.lineWidth=2;c.setLineDash([5,4]);c.strokeRect(x,y,48,48);c.beginPath();c.moveTo(x,y);c.lineTo(x+48,y+48);c.moveTo(x+48,y);c.lineTo(x,y+48);c.stroke();c.restore()}}
function groundParts(at,seed){CULL=cullFor(at);try{return groundParts0(at,seed)}finally{CULL=null}}
const cullBox=(c,w,h)=>CULL?[(CULL[0]+w/2)*c.width/w,(CULL[1]+h/2)*c.height/h,(CULL[2]+w/2)*c.width/w,(CULL[3]+h/2)*c.height/h]:null;
function groundParts0(at,seed){const t=num(at.T)|0,W=clamp(num(at.L,10),10,10000),H=clamp(num(at.H,10),10,10000),circ=t===13,w=circ?W*2:W,h=circ?W*2:H,tint=at.tint?hex6(at.tint):'',inv='m' in at,color='o' in at?at.o:'',hc=t===12||t===13;
 const noVisual=t===14||(hc&&(color===''||/^f{8,}$/i.test(color))),rng=Rng(seed),parts=[],fg='N' in at||t===9||t===15||t===21,slot=fg?10:3,al=inv?.3:1;miss=false;TCL={};
 const img=()=>{};let main;
 const attach=x=>{if(at.i){const ip=at.i.split(','),ix=num(ip.shift()),iy=num(ip.shift()),u=ip.join(','),im=extImg(u);if(im.complete&&im.naturalWidth)x.drawImage(im,(circ?0:-W/2)+ix,(circ?0:-H/2)+iy)}};
 if(noVisual){main=mk(w,h,x=>{attach(x);x.strokeStyle='rgba(255,255,255,.55)';x.fillStyle='rgba(255,255,255,.1)';x.lineWidth=1;if(circ){x.beginPath();x.arc(0,0,W,0,7);x.fill();x.stroke()}else{x.fillRect(-W/2,-H/2,W,H);x.strokeRect(-W/2,-H/2,W,H)}});parts.push({slot,cv:main,w,h,a:al});return{parts,miss}}
 if(t===21){const cols=Math.ceil(W/TILE);if(!has(56)){info(tile(56));main=mk(W,H,x=>fallback(x,t,W,H));parts.push({slot,cv:main,w:W,h:H,a:al});return{parts,miss:true}}
  const rb=Rng(seed),rf=Rng(seed+77);const b=mk(W,H,x=>{for(let i=0;i<cols;i++)put2(x,rb.pick([56,58]),-W/2+i*TILE,-H/2)});tintCv(b,tint,cullBox(b,W,H));
  const f=mk(W,H,x=>{const top=-H/2;for(let k=0;k<cols;k++)put2(x,rf.pick([57,59]),-W/2+k*TILE,top);for(let y=top+40;y<H/2;y+=TILE)for(let c=0;c<cols;c++)put2(x,rf.pick([60,61]),-W/2+c*TILE,y)});tintCv(f,tint,cullBox(f,W,H));
  parts.push({slot:4,cv:b,w:W,h:H,a:al},{slot,cv:f,w:W,h:H,a:al});return{parts,miss}}
 main=mk(w,h,x=>{attach(x);
  if(t===12||t===13){x.fillStyle='#'+hex6(color);if(circ){x.beginPath();x.arc(0,0,W,0,7);x.fill()}else x.fillRect(-W/2,-H/2,W,H);return}
  const sp=SPEC[t];
  if(sp){const f0=tile(sp.fill[0]);const ai=info(f0);if(ai.st!==1){miss=ai.st===0;fallback(x,t,W,H);if(ai.st===0)miss=true;return}
   x.save();x.beginPath();x.rect(-W/2,-H/2,W,H);x.clip();const cols=Math.ceil(W/TILE),rows=Math.ceil(H/TILE);
   for(let r=0;r<rows;r++)for(let c=0;c<cols;c++)put2(x,rng.pick(sp.fill),-W/2+c*TILE,-H/2+r*TILE);
   if(sp.top){const edges=(W%TILE===0)&&cols>=1,x0=edges?1:0,x1=edges?cols-2:cols-1;for(let i=x0;i<=x1;i++)put2(x,rng.pick(sp.top),-W/2+i*TILE,-H/2);
    if(edges){const ldx=sp.leftDx||0,rdx=sp.rightDx||0;for(let r=1;r<rows;r++){put2(x,sp.left,-W/2+ldx,-H/2+r*TILE);put2(x,sp.right,W/2-TILE+rdx,-H/2+r*TILE)}put2(x,sp.cTL,-W/2,-H/2);put2(x,sp.cTR,W/2-TILE,-H/2)}}
   x.restore();return}
  const cn=simpleClass(t);if(!cn){fallback(x,t,W,H);return}
  const g=get(`assets/ground/${cn}.svg`);if(!g){miss=true;fallback(x,t,W,H);return}const sx=W/g.a.w,sy=H/g.a.h;x.drawImage(g.img,-W/2-g.a.e*sx,-H/2-g.a.f*sy,g.a.w*sx,g.a.h*sy)});
 if(main){tintCv(main,tint,cullBox(main,w,h));const dyn=(at.P||'').split(',')[0]==='1';if(SPEC[t]&&t!==9&&t!==15&&!dyn&&info(tile(SPEC[t].fill[0])).st===1)sunOverlay(main.getContext('2d'),W,H)}
 parts.push({slot,cv:main,w,h,a:al});return{parts,miss}}
const CACHE=new WeakMap();
function parts(kind,it,i){ 
 const a=it.at,sig=[a.T,a.L,a.H,a.o,a.tint,'m' in a,'N' in a,a.i,(a.P||'').split(',')[0],i].join('|'),c=CACHE.get(it);const vk=String(cullFor(it.at)||'')+'|'+(FAST?VIEWZ:'');if(c&&c.sig===sig&&(!c.miss||c.ver===ver)&&(!c.fast||(FAST&&c.vk===vk)))return c;const r=groundParts(it.at,seedOf('S',i));const n={sig,miss:r.miss,ver,fast:FAST,vk,parts:r.parts};CACHE.set(it,n);return n}
function decoPath(it){const t=it.tag;if(t==='P')return`assets/decoration/P_${num(it.at.T)|0}.svg`;if(t==='F')return CTX.dodue?(CTX.theme==='halloween'?'assets/other/$FromageDoduehalloween.svg':'assets/other/$FromageDodue.svg'):'assets/other/$Fromage.svg';if(t==='T')return'assets/other/$Trou_Souris.svg';if(t==='DS')return'assets/other/DS.svg';if(t==='DC2')return'assets/other/DC2.svg';return'assets/other/DC.svg'}
const objPath=(it,i)=>{let t=num(it.at.C)|0;if(t===28)t=28+Math.floor(seedOf('O',i))%4;return`assets/object/$Objet_${t}.svg`};
function colorsOf(at){return at.C?at.C.split(',').map(c=>c===''?'':hex6(c)):[]}
const decoFg=it=>it.tag==='P'?(it.at.P||'').split(',')[0]==='1':'D' in it.at;
function placeholder(c,txt,col){c.fillStyle=col;c.globalAlpha=.8;c.fillRect(-9,-9,18,18);c.globalAlpha=1;c.fillStyle='#000';c.font='bold 8px sans-serif';c.textAlign='center';c.fillText(txt,0,3)}
const LAST=new WeakMap();
function drawDeco(c,it,i,ed){const p=decoPath(it),a=info(p),x=num(it.at.X),y=num(it.at.Y),num_=it.tag==='P';c.save();
 if(a.st!==1){c.translate(x,y);if(a.st===-1)placeholder(c,num_?'P'+it.at.T:it.tag,'#f2b84b');c.restore();return}
 const cols=colorsOf(it.at),hasC=a.slots.length>0,r=num_?(num((it.at.P||'').split(',')[1])|0):0,flip=num_&&(r===1||(r===2&&(Math.floor(seedOf('D',i))&1)===1)),off=num_&&!hasC;
 c.translate(x+(off?(flip?-2:2):0),y+(off?1:0));if(flip)c.scale(-1,1);
 if(it.tag==='T'&&(it.at.CT==='1'||it.at.CT==='2')){c.shadowColor=it.at.CT==='1'?'#98E2EB':'#FEB1FC';c.shadowBlur=8}
 let g=get(p,cols);if(g)LAST.set(it,g);else g=LAST.get(it)||null;if(g)c.drawImage(g.img,-g.a.e,-g.a.f,g.a.w,g.a.h);c.restore()}
const GH=new WeakMap();
function ghostOf(img,w,h){let c=GH.get(img);if(c)return c;const k=2;c=document.createElement('canvas');c.width=Math.max(1,Math.round(w*k));c.height=Math.max(1,Math.round(h*k));const x=c.getContext('2d',{willReadFrequently:true});x.drawImage(img,0,0,c.width,c.height);
 try{const d=x.getImageData(0,0,c.width,c.height),p=d.data,f=.15;for(let i=0;i<p.length;i+=4){if(!p[i+3])continue;p[i]=Math.min(255,p[i]*(1-f)+128*f);p[i+1]=Math.min(255,p[i+1]*(1-f)+255*f);p[i+2]=Math.min(255,p[i+2]*(1-f)+128*f)}x.putImageData(d,0,0)}catch(e){}GH.set(img,c);return c}
function drawObj(c,it,i){const du=defUrl(it),P=(it.at.P||'').split(/[,%]/),ang=num(P[0]),ghost=P[1]==='1';c.save();c.translate(num(it.at.X),num(it.at.Y));c.rotate(ang*Math.PI/180);if(ghost)c.globalAlpha*=.5;
 if(du){const im=defOk(du);if(im){if(ghost)c.drawImage(ghostOf(im,im.naturalWidth,im.naturalHeight),-im.naturalWidth/2,-im.naturalHeight/2,im.naturalWidth,im.naturalHeight);else c.drawImage(im,-im.naturalWidth/2,-im.naturalHeight/2)}else placeholder(c,'O'+it.at.C,'#6fcf97');c.restore();return}
 const p=objPath(it,i),a=info(p);
 if(a.st===-1)placeholder(c,'O'+it.at.C,'#6fcf97');else{const g=get(p);if(g){if(ghost)c.drawImage(ghostOf(g.img,g.a.w,g.a.h),-g.a.e,-g.a.f,g.a.w,g.a.h);else c.drawImage(g.img,-g.a.e,-g.a.f,g.a.w,g.a.h)}}c.restore()}
function drawPart(c,p,X,Y,rot,view){const cv=p.cv,cw=cv.width,ch=cv.height;let sx=0,sy=0,sw=cw,sh=ch;const fx=cw/p.w,fy=ch/p.h;
 if(view&&cw*ch>2e6){const a=-rot*Math.PI/180,co=Math.cos(a),si=Math.sin(a);let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;
  for(const q of[[view[0],view[1]],[view[2],view[1]],[view[2],view[3]],[view[0],view[3]]]){const dx=q[0]-X,dy=q[1]-Y,lx=dx*co-dy*si,ly=dx*si+dy*co;if(lx<x0)x0=lx;if(lx>x1)x1=lx;if(ly<y0)y0=ly;if(ly>y1)y1=ly}
  sx=Math.max(0,Math.floor((x0+p.w/2)*fx)-2);sy=Math.max(0,Math.floor((y0+p.h/2)*fy)-2);const ex=Math.min(cw,Math.ceil((x1+p.w/2)*fx)+2),ey=Math.min(ch,Math.ceil((y1+p.h/2)*fy)+2);sw=ex-sx;sh=ey-sy;if(sw<=0||sh<=0)return}
 if(sx===0&&sy===0&&sw===cw&&sh===ch)c.drawImage(cv,-p.w/2,-p.h/2,p.w,p.h);else c.drawImage(cv,sx,sy,sw,sh,-p.w/2+sx/fx,-p.h/2+sy/fy,sw/fx,sh/fy)}
const outside=(v,x,y,r)=>v&&(x+r<v[0]||x-r>v[2]||y+r<v[1]||y-r>v[3]);
function drawOne(c,kind,it,i,alpha){c.save();c.globalAlpha=alpha;if(kind==='S'){const r=parts('S',it,i),rot=(num(it.at.T)|0)===9?0:num((it.at.P||'').split(',')[4]);r.parts.forEach(p=>{if(!p.cv)return;c.save();c.translate(num(it.at.X),num(it.at.Y));c.rotate(rot*Math.PI/180);c.globalAlpha*=p.a;c.drawImage(p.cv,-p.w/2,-p.h/2,p.w,p.h);c.restore()})}else if(kind==='O')drawObj(c,it,i);else if(kind==='I')drawMapImg(c,it);else drawDeco(c,it,i);c.restore()}
function isInvisGround(at){const t=num(at.T)|0,color='o' in at?at.o:'',hc=t===12||t===13;return 'm' in at||t===14||(hc&&(color===''||/^f{8,}$/i.test(color)))}
const PROF={};
function bgProfile(map,rbg,show,alpha,vis){const BASE=[0x6a,0x74,0x95],N=48;let bgF=-1;if(show&&(!vis||vis.bg)){bgF=map.at&&map.at.F!==undefined&&map.at.F!==''?num(map.at.F,-1):-1;if(bgF===-2)bgF=rbg===undefined?0:rbg}
 const bl=(0.2126*BASE[0]+0.7152*BASE[1]+0.0722*BASE[2])/255;if(bgF<0)return{n:1,l:[bl]};
 const g=get(`assets/background/$F_${bgF}.svg`);if(!g)return{n:1,l:[bl],wait:1};const mh=Math.max(1,map.h||400),mw=Math.max(1,map.w||800),k=bgF+'|'+alpha.toFixed(2)+'|'+mw+'x'+mh;if(PROF[k])return PROF[k];
 let l=[];try{const W=24,cv=document.createElement('canvas');cv.width=W;cv.height=N;const x=cv.getContext('2d',{willReadFrequently:true}),sc=(g.img.naturalWidth||g.a.w)/g.a.w;
  x.drawImage(g.img,g.a.e*sc,g.a.f*sc,mw*sc,mh*sc,0,0,W,N);const d=x.getImageData(0,0,W,N).data;
  for(let r=0;r<N;r++){let sr=0,sg=0,sb=0,sa=0;for(let c2=0;c2<W;c2++){const i=(r*W+c2)*4,a=d[i+3]/255;sr+=d[i]*a;sg+=d[i+1]*a;sb+=d[i+2]*a;sa+=a}
   const A=Math.min(1,alpha*(sa/W)),R=(sa?sr/sa:BASE[0])*A+BASE[0]*(1-A),G=(sa?sg/sa:BASE[1])*A+BASE[1]*(1-A),B=(sa?sb/sa:BASE[2])*A+BASE[2]*(1-A);l.push((0.2126*R+0.7152*G+0.0722*B)/255)}}catch(e){return{n:1,l:[bl],wait:1}}
 return PROF[k]={n:N,l}}
function render(c,map,o){VIEW=o.view||null;VIEWZ=o.z||1;try{return render0(c,map,o)}finally{VIEW=null}}
function render0(c,map,o){setMap(map.at);const sl=Array.from({length:11},()=>[]);const show=o.show;
 if(!show&&o.afterBg)o.afterBg();
 if(show){const V=o.vis||{bg:1,D:1,S:1,O:1};let bgF=V.bg?map.at&&map.at.F!==undefined&&map.at.F!==''?num(map.at.F,-1):-1:-1;if(bgF===-2)bgF=o.rbg===undefined?0:o.rbg;if(bgF>=0){c.save();c.globalAlpha=o.alpha;const g=get(`assets/background/$F_${bgF}.svg`);if(g)c.drawImage(g.img,-g.a.e,-g.a.f,g.a.w,g.a.h);c.restore()}
  if(o.afterBg)o.afterBg();
  if(V.I===undefined?V.D:V.I)(map.I||[]).forEach(it=>{const x=num(it.at.X),y=num(it.at.Y);if(o.view){const m=mImg(it),w=m?m.naturalWidth:48,h=m?m.naturalHeight:48;if(x+w<o.view[0]||x>o.view[2]||y+h<o.view[1]||y>o.view[3])return}sl[it.at.F==='1'?8:0].push(()=>drawMapImg(c,it))});
  (V.D?map.D:[]).forEach((it,i)=>{const mouse=it.tag==='DS'||it.tag==='DC'||it.tag==='DC2';if(o.view){const a=info(decoPath(it));if(a.st===1&&outside(o.view,num(it.at.X),num(it.at.Y),Math.hypot(Math.max(Math.abs(a.e),Math.abs(a.w-a.e)),Math.max(Math.abs(a.f),Math.abs(a.h-a.f)))+14))return}sl[mouse?5:decoFg(it)?9:1].push(()=>drawDeco(c,it,i))});
  (V.S?map.S:[]).forEach((it,i)=>{if(o.hideInvis&&isInvisGround(it.at))return;const X=num(it.at.X),Y=num(it.at.Y),W=clamp(num(it.at.L,10),10,10000),H=clamp(num(it.at.H,10),10,10000);if(outside(o.view,X,Y,(num(it.at.T)|0)===13?W+2:Math.hypot(W,H)/2+2))return;const r=parts('S',it,i);r.parts.forEach(p=>{if(!p.cv)return;const rot=(num(it.at.T)|0)===9?0:num((it.at.P||'').split(',')[4]);sl[p.slot].push(()=>{c.save();c.translate(X,Y);c.rotate(rot*Math.PI/180);c.globalAlpha*=p.a;drawPart(c,p,X,Y,rot,o.view);c.restore()})})});
  (V.O?map.O:[]).forEach((it,i)=>{if(o.view&&!defUrl(it)){const a=info(objPath(it,i));if(a.st===1&&outside(o.view,num(it.at.X),num(it.at.Y),Math.hypot(Math.max(Math.abs(a.e),Math.abs(a.w-a.e)),Math.max(Math.abs(a.f),Math.abs(a.h-a.f)))+4))return}sl[6].push(()=>drawObj(c,it,i))})}
 sl[2].push(()=>o.joints(0));sl[7].push(()=>o.joints(1));
 c.save();for(let s=0;s<11;s++){if(show&&(s===0||s===8||(s>=1&&!(s===2||s===7)))){c.globalAlpha=o.alpha}else c.globalAlpha=1;sl[s].forEach(f=>f())}c.restore();c.globalAlpha=1;
 if(show&&o.sel){const b=bounds(o.sel.kind,mapList(map,o.sel.kind)[o.sel.i],o.sel.i);if(b){c.save();c.translate(b.x,b.y);c.rotate((b.ang||0)*Math.PI/180);c.strokeStyle='#ffb300';c.lineWidth=2/o.z;c.setLineDash([5/o.z,3/o.z]);if(b.circ){c.beginPath();c.arc(0,0,b.w,0,7);c.stroke()}else c.strokeRect(b.ox,b.oy,b.w,b.h);c.restore()}}}
const mapList=(m,k)=>k==='S'?m.S:k==='O'?m.O:k==='I'?(m.I||(m.I=[])):m.D;
function bounds(kind,it,i){if(!it)return null;const x=num(it.at.X),y=num(it.at.Y);if(kind==='I'){const m=mImg(it);return m?{x,y,w:m.naturalWidth,h:m.naturalHeight,ox:0,oy:0,ang:0}:{x,y,w:48,h:48,ox:0,oy:0,ang:0}}if(kind==='S'){const t=num(it.at.T)|0,W=clamp(num(it.at.L,10),10,10000),H=clamp(num(it.at.H,10),10,10000),ang=t===9?0:num((it.at.P||'').split(',')[4]);return t===13?{x,y,w:W,h:W,circ:1,ang}:{x,y,w:W,h:H,ox:-W/2,oy:-H/2,ang}}
 if(kind==='O'){const du=defUrl(it);if(du){const im=defOk(du),ang0=num((it.at.P||'').split(/[,%]/)[0]);return im?{x,y,w:im.naturalWidth,h:im.naturalHeight,ox:-im.naturalWidth/2,oy:-im.naturalHeight/2,ang:ang0}:{x,y,w:24,h:24,ox:-12,oy:-12,ang:ang0}}}
 const p=kind==='O'?objPath(it,i):decoPath(it),a=info(p),ang=kind==='O'?num((it.at.P||'').split(/[,%]/)[0]):0;return a.st===1?{x,y,w:a.w,h:a.h,ox:-a.e,oy:-a.f,ang}:{x,y,w:20,h:20,ox:-10,oy:-10,ang}}
function hit(kind,it,i,wx,wy){const b=bounds(kind,it,i);if(!b)return false;const a=-(b.ang||0)*Math.PI/180,dx=wx-b.x,dy=wy-b.y,lx=dx*Math.cos(a)-dy*Math.sin(a),ly=dx*Math.sin(a)+dy*Math.cos(a);return b.circ?lx*lx+ly*ly<=b.w*b.w:(lx>=b.ox&&lx<=b.ox+b.w&&ly>=b.oy&&ly<=b.oy+b.h)}
return{imgUrl,bgProfile,isInvisGround,setFast:v=>{FAST=!!v},setMap,defUrl,render,drawOne,hit,bounds,info,get,slotsOf:p=>{const a=info(p);return a.st===1?a.slots:null},decoPath,objPath,colorsOf,set onload(f){onLoad=f},get ver(){return ver}}})();
