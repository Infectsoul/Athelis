'use strict';
const $=id=>document.getElementById(id),cv=$('cv'),cx=cv.getContext('2d');
const newMap=()=>({w:800,h:400,at:{},S:[],D:[],O:[],I:[],J:[]});
const S={layers:[],cur:0,map:newMap(),imgs:[],mode:'draw',tool:'V',view:{x:40,y:40,z:1},sel:{pts:new Set(),items:new Set()},msel:null,mm:[],pts:[],cur2:null,drag:null,uid:1,exp:new Set(),lim:{},mvis:{bg:1,D:1,S:1,O:1,I:1,J:1},fonts:[],mgrp:new Set(),showFrame:true,mag:null,cat:{tab:'P',q:'',mfg:0},place:null,hover:false};
JT.bind({S,MR,gname:g=>GN[+g.at.T|0]||''});S.live=0;S.ptMode='m';S.pr=[];S.ctrl=false;S.shov=null;S.scaleW=false;S.lsel=new Set();
function wTargets(){const t=[];S.layers.forEach(l=>l.items.forEach(it=>{if(it.k==='s'){if(S.sel.pts.has(it.a)&&S.sel.pts.has(it.b))t.push(it)}else if(S.sel.items.has(it))t.push(it)}));return t}
function wSnap(){return wTargets().map(it=>({it,w:it.w,ow:it.o&&it.o.ow,fw:it.o&&it.o.fw,tf:it.tx&&it.tx.fw,to:it.tx&&it.tx.ow}))}
function wRest(ws){ws.forEach(r=>{const it=r.it;if(r.w!==undefined)it.w=r.w;if(r.ow!==undefined&&it.o)it.o.ow=r.ow;if(r.fw!==undefined&&it.o)it.o.fw=r.fw;if(r.tf!==undefined&&it.tx)it.tx.fw=r.tf;if(r.to!==undefined&&it.tx)it.tx.ow=r.to;touch(it)})}
function wApply(ws,k){if(!(k>0)||Math.abs(k-1)<1e-9)return;const f=v=>Math.max(1,Math.round(v*k));ws.forEach(r=>{const it=r.it;if(r.w!==undefined)it.w=f(r.w);if(r.ow!==undefined&&it.o)it.o.ow=f(r.ow);if(r.fw!==undefined&&it.o)it.o.fw=f(r.fw);if(r.tf!==undefined&&it.tx)it.tx.fw=f(r.tf);if(r.to!==undefined&&it.tx)it.tx.ow=f(r.to);touch(it)})}

const clone=o=>JSON.parse(JSON.stringify(o)),esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
let dirty=1,hist=[],hi=-1,space=0,pan=null;
const baseState={mapOn:localStorage.athelis_t_showmap!=='0',mapOp:localStorage.athelis_mapop!==undefined?(+localStorage.athelis_mapop||0):50,drawOn:localStorage.athelis_t_showdraw!=='0',drawOp:localStorage.athelis_drawop!==undefined?(+localStorage.athelis_drawop||0):100};
const nextLayerName=()=>{let m=0;(S.layers||[]).forEach(l=>{const r=/^Camada (\d+)$/.exec(l.name||'');if(r)m=Math.max(m,+r[1])});return'Camada '+(m+1)};
const newLayer=n=>({id:S.uid++,name:n||nextLayerName(),vis:1,lock:0,items:[]});
const L=()=>S.layers[S.cur];
const GC=new WeakMap(),GCD=new WeakMap(),HV=new WeakMap(),touch=it=>{GC.delete(it);GCD.delete(it)};
const draftSegs=it=>{G.setDraft(1);try{return G.shapeSegs(it)}finally{G.setDraft(0)}};
const HEAVY_MS=12,DRAFT_MS=45,APPROX=new Set(),SG0=new WeakMap(),GM=new Map();
const isHeavyShape=it=>!!it.o&&it.o.fm==='r'&&it.t!=='T'&&it.t!=='I';
const sigOf=it=>JSON.stringify([it.t,it.pts,it.cc,it.u,it.v,it.o,it.c,it.w,it.al,it.fg]);
const memoGet=it=>{if(!isHeavyShape(it))return null;const k=sigOf(it),g=GM.get(k);if(g){GM.delete(k);GM.set(k,g)}return{k,g}};
const memoPut=(m,g)=>{if(!m)return;GM.set(m.k,g);while(GM.size>24)GM.delete(GM.keys().next().value)};
const xfSegs=(sg,M)=>sg.map(q=>({...q,a:A.pt(M,q.a),b:A.pt(M,q.b)}));
const segsOf=it=>{if(it.k==='s')return[it];let g=GC.get(it);
 if(g&&APPROX.size&&!S.drag&&APPROX.has(it)){APPROX.delete(it);GC.delete(it);g=null}
 if(g)return g;
 if((S.drag||S.live)&&HV.get(it)>DRAFT_MS){let d=GCD.get(it);if(!d){d=draftSegs(it);GCD.set(it,d)}return d}
 const m=memoGet(it);if(m&&m.g){GC.set(it,m.g);return m.g}
 const t0=performance.now();g=G.shapeSegs(it);const dt=performance.now()-t0;if(dt>HEAVY_MS)HV.set(it,dt);else HV.delete(it);GC.set(it,g);if(dt>HEAVY_MS)memoPut(m,g);return g};
let liveT=0;function liveEdit(){S.live=1;clearTimeout(liveT);liveT=setTimeout(()=>{S.live=0;S.sel.items.forEach(it=>{if(HV.get(it)>DRAFT_MS)touch(it)});dirty=1},260)}
const SBB=new WeakMap();
function segsOut(sg,vw){let b=SBB.get(sg);if(!b){let x0=1e18,y0=1e18,x1=-1e18,y1=-1e18,mw=0;for(let i=0;i<sg.length;i++){const q=sg[i],a=q.a,c=q.b;if(a[0]<x0)x0=a[0];if(c[0]<x0)x0=c[0];if(a[0]>x1)x1=a[0];if(c[0]>x1)x1=c[0];if(a[1]<y0)y0=a[1];if(c[1]<y0)y0=c[1];if(a[1]>y1)y1=a[1];if(c[1]>y1)y1=c[1];if(q.w>mw)mw=q.w}const m=mw/2+1;b=[x0-m,y0-m,x1+m,y1+m];SBB.set(sg,b)}return b[2]<vw[0]||b[0]>vw[2]||b[3]<vw[1]||b[1]>vw[3]}
const selClear=()=>{S.sel.pts.clear();S.sel.items.clear()},selCount=()=>S.sel.pts.size+S.sel.items.size;
const iw=v=>Math.max(1,Math.round(+v||1)),style=()=>({c:$('col').value.slice(1),w:iw($('wid').value),al:+$('alp').value,fg:+$('fg').value});
const hint=t=>{$('hint').textContent=t};
function keepScroll(el,fn){const a=[];for(let n=el;n&&n!==document.documentElement;n=n.parentElement){if(n.scrollHeight>n.clientHeight&&/auto|scroll/.test(getComputedStyle(n).overflowY))a.push([n,n.scrollTop])}fn();a.forEach(([n,t])=>{n.scrollTop=t})}
let toT=0;function toast(m){const t=$('toast');t.textContent=m;t.classList.add('on');clearTimeout(toT);toT=setTimeout(()=>t.classList.remove('on'),1400)}
const stateStr=()=>JSON.stringify({l:S.layers,c:S.cur,m:S.map,u:S.uid});
let hsz=0,rev=0;function snap(){rev++;focusNew();hist=hist.slice(0,hi+1);hsz=hist.reduce((a,x)=>a+x.length,0);const t=CA.snapStr(stateStr);hist.push(t);hsz+=t.length;while(hist.length>100||(hsz>8e7&&hist.length>10))hsz-=hist.shift().length;hi=hist.length-1;if(window.__xmlReady)xmlSoon()}
function restore(i){rev++;const o=JSON.parse(hist[i]);S.layers=o.l;S.cur=Math.min(o.c,o.l.length-1);S.map=o.m;S.uid=Math.max(S.uid,o.u);S.snapUid=S.uid;selClear();S.msel=null;S.mm=[];ui(1)}
function commit(){snap();ui()}
function focusNew(){const u=S.snapUid;S.snapUid=S.uid;if(!S.lauto||u===undefined)return;let n=0,last=null,lay=null;S.layers.forEach(l=>l.items.forEach(it=>{if(it.id>=u&&!(l.id>=u&&l.items.length>1)){n++;last=it;lay=l}}));if(!last||n>5)return;[...S.exp].forEach(k=>{if(k[0]==='I')S.exp.delete(k)});S.exp.add('I'+last.id);S.exp.add('L'+lay.id);S.focusIt=last.id}
const BUILD='LPBSNQ',building=()=>S.mode==='draw'&&BUILD.includes(S.tool)&&S.pts.length>0;
function buildUndo(){if(!building())return false;S.pr.push(S.pts.pop());hint(S.pts.length?'Ponto desfeito · Ctrl+Y refaz · Enter conclui':'Construção desfeita · Ctrl+Y refaz');dirty=1;return true}
function buildRedo(){if(S.mode!=='draw'||!BUILD.includes(S.tool)||!S.pr.length)return false;S.pts.push(S.pr.pop());hint('Ponto refeito');dirty=1;return true}
$('undo').onclick=()=>{if(buildUndo())return;if(hi>0)restore(--hi)};$('redo').onclick=()=>{if(buildRedo())return;if(hi<hist.length-1)restore(++hi)};
const OPT={n:24,rr:0,mode:'o',hs:6,auto:false,af:.9,ha:45,hx:false,hi:0,fcOn:false,fc:'ffffff',fw:3,closed:false};
function addFree(a,b,st){const l=L();if(!l||l.lock||!l.vis){hint('Camada oculta ou travada');return null}if(Math.hypot(a[0]-b[0],a[1]-b[1])<.01)return null;const it={k:'s',id:S.uid++,a:[R2(a[0]),R2(a[1])],b:[R2(b[0]),R2(b[1])],...(st||style())};l.items.push(it);return it}
function mkShape(t,props){const l=L();if(!l||l.lock||!l.vis){hint('Camada oculta ou travada');return null}const it={k:'h',id:S.uid++,t,o:readOpts(),...style(),...props};l.items.push(it);touch(it);return it}
const selectOnly=it=>{selClear();S.sel.items.add(it)};
function size(){const r=cv.getBoundingClientRect(),d=devicePixelRatio||1;if(S._w){S.view.x+=(r.width-S._w)/2;S.view.y+=(r.height-S._h)/2}S._w=r.width;S._h=r.height;cv.width=Math.max(1,r.width*d);cv.height=Math.max(1,r.height*d);dirty=1}
new ResizeObserver(size).observe($('stage'));
const gridSize=()=>Math.max(1,+$('grid').value||20);
function toW(e,sn=true){const r=cv.getBoundingClientRect();let x=(e.clientX-r.left-S.view.x)/S.view.z,y=(e.clientY-r.top-S.view.y)/S.view.z;if(sn&&$('snap').checked){x=snapV(x);y=snapV(y)}return[x,y]}
const snapOn=()=>$('snap').checked,snapV=v=>{const g=gridSize();return R2(Math.round(v/g)*g)};
const bboxMin=()=>{const p=selPoints();let x=1e9,y=1e9;for(const q of p){if(q[0]<x)x=q[0];if(q[1]<y)y=q[1]}return[x,y]};
function snapItem(kind,it,x,y){if(kind!=='S')return[snapV(x),snapV(y)];const t=+it.at.T|0,ang=t===9?0:+getP(it.at,4,'0')||0;if(t===13||ang%360!==0)return[snapV(x),snapV(y)];const W=Math.max(10,+it.at.L||10),H=Math.max(10,+it.at.H||10);return[R2(snapV(x-W/2)+W/2),R2(snapV(y-H/2)+H/2)]}
const MAGT='LPBSNQF';
function magnetPts(exclude){const out=[];S.layers.forEach(l=>{if(!l.vis||l.lock)return;l.items.forEach(it=>{if(it.k==='s'){out.push(it.a,it.b)}
  else if(it.k==='h'&&it!==exclude&&it.pts&&'PBSNQ'.includes(it.t)&&!(it.o&&it.o.closed)){const n=it.pts.length;if(it.t==='Q'){if(n>=4)out.push(it.pts[0],it.pts[3*Math.floor((n-1)/3)])}else if(n>=2)out.push(it.pts[0],it.pts[it.t==='B'?3:n-1])}})});return out}
function magnetAt(raw,exclude){let best=null,bd=Math.max(1,+$('magr').value||12)/S.view.z;for(const p of magnetPts(exclude)){const d=Math.hypot(p[0]-raw[0],p[1]-raw[1]);if(d<=bd){bd=d;best=p}}return best}
const magOn=e=>S.mode==='draw'&&$('mag').checked&&!e.altKey;
function magnet(w,raw,e){if(!magOn(e)||(!MAGT.includes(S.tool)&&!(S.drag&&S.drag.ctl))||(S.drag&&(S.drag.qd||S.drag.t2&&S.drag.t2!=='brush'))){S.mag=null;return w}
 const best=magnetAt(raw,S.drag&&S.drag.ctl?S.drag.ctl.it:null);S.mag=best;return best?best.slice():w}
function fit(){const r=cv.getBoundingClientRect(),z=Math.min(1,(r.width-80)/S.map.w,(r.height-80)/S.map.h);S.view.z=Math.max(.05,z);S.view.x=(r.width-S.map.w*S.view.z)/2;S.view.y=(r.height-S.map.h*S.view.z)/2;dirty=1}
function zoomTo(nz,mx,my){const v=S.view;nz=Math.min(60,Math.max(.05,nz));v.x=mx-(mx-v.x)*nz/v.z;v.y=my-(my-v.y)*nz/v.z;v.z=nz;dirty=1}
const zc=()=>{const r=cv.getBoundingClientRect();return[r.width/2,r.height/2]};
let lastZ=0;function zoomUI(){const t=Math.round(S.view.z*100)+'%',b=$('zv');if(b.textContent!==t)b.textContent=t;b.classList.toggle('on',Math.abs(S.view.z-1)<.005)}
cv.addEventListener('wheel',e=>{e.preventDefault();const r=cv.getBoundingClientRect(),z=S.view.z;let nz=z*(e.deltaY<0?1.15:1/1.15);if((z<1&&nz>1)||(z>1&&nz<1))nz=1;zoomTo(nz,e.clientX-r.left,e.clientY-r.top)},{passive:false});
$('zin').onclick=()=>zoomTo(S.view.z*1.25,...zc());$('zout').onclick=()=>zoomTo(S.view.z/1.25,...zc());$('zv').onclick=()=>zoomTo(1,...zc());$('zfit').onclick=()=>fit();
S.outMode=Math.min(2,Math.max(0,+localStorage.athelis_outmode||0));
const OUTM=[['out-all','Fora do mapa: mostrando tudo'],['out-clip','Fora do mapa: oculto'],['out-half','Fora do mapa: 50% de opacidade']];
function paintZB(){const m=S.outMode,b=$('zclip'),h=!!S.hideCtl,c=$('zhide');
 if(b){b.innerHTML=ic(OUTM[m][0],16);b.title=OUTM[m][1]+': clique para alternar (tudo → oculto → 50%)';b.classList.toggle('on',m>0)}
 if(c){c.innerHTML=ic(h?'eye':'eye-off-ctl',16);c.title=h?'Mostrar pontos de controle':'Ocultar pontos de controle';c.classList.toggle('on',h)}}
$('zclip').onclick=()=>{S.outMode=(S.outMode+1)%3;localStorage.athelis_outmode=S.outMode;paintZB();dirty=1};
$('zhide').onclick=()=>{S.hideCtl=!S.hideCtl;paintZB();if(typeof paintHide==='function')paintHide();dirty=1};
paintZB();
const centerW=()=>[Math.round((cv.clientWidth/2-S.view.x)/S.view.z),Math.round((cv.clientHeight/2-S.view.y)/S.view.z)];
function selPoints(){const o=[];S.sel.pts.forEach(p=>o.push(p));S.sel.items.forEach(it=>segsOf(it).forEach(s=>o.push(s.a,s.b)));return o}
function frame(){const its=[...S.sel.items];if(its.length===1&&!S.sel.pts.size&&(its[0].t==='R'||its[0].t==='E')){const it=its[0];return{cx:it.cc[0],cy:it.cc[1],th:Math.atan2(it.u[1],it.u[0]),hw:Math.max(Math.hypot(it.u[0],it.u[1]),.5),hh:Math.max(Math.hypot(it.v[0],it.v[1]),.5)}}
 const p=selPoints();if(!p.length)return null;let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;for(const q of p){if(q[0]<x0)x0=q[0];if(q[0]>x1)x1=q[0];if(q[1]<y0)y0=q[1];if(q[1]>y1)y1=q[1]}return{cx:(x0+x1)/2,cy:(y0+y1)/2,th:0,hw:Math.max((x1-x0)/2,.5),hh:Math.max((y1-y0)/2,.5)}}
const HP=[[-1,-1],[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0]];
const toLoc=(f,p)=>{const dx=p[0]-f.cx,dy=p[1]-f.cy,c=Math.cos(f.th),s=Math.sin(f.th);return[dx*c+dy*s,-dx*s+dy*c]};
const toWld=(f,l)=>{const c=Math.cos(f.th),s=Math.sin(f.th);return[f.cx+l[0]*c-l[1]*s,f.cy+l[0]*s+l[1]*c]};
const rotHandleY=f=>-f.hh-26/S.view.z;
function frameHit(f,w){if(!f)return null;const r=9/S.view.z;const rp=toWld(f,[0,rotHandleY(f)]);if(Math.hypot(w[0]-rp[0],w[1]-rp[1])<=r)return{rot:1};
 for(let i=0;i<8;i++){const p=toWld(f,[HP[i][0]*f.hw,HP[i][1]*f.hh]);if(Math.hypot(w[0]-p[0],w[1]-p[1])<=r)return{h:i}}return null}
function scaleM(f,hs,l,alt,shift){let kx=1,ky=1,ax=alt?0:-hs[0]*f.hw,ay=alt?0:-hs[1]*f.hh;if(hs[0]!==0)kx=(l[0]-ax)/(hs[0]*f.hw-ax);if(hs[1]!==0)ky=(l[1]-ay)/(hs[1]*f.hh-ay);
 if(shift){const k=hs[0]!==0&&hs[1]!==0?Math.max(Math.abs(kx),Math.abs(ky)):Math.abs(hs[0]!==0?kx:ky);kx=Math.sign(kx||1)*k;ky=Math.sign(ky||1)*k;if(hs[0]===0)kx=ky;if(hs[1]===0)ky=kx}
 const aw=toWld(f,[ax,ay]);return A.about(A.mul(A.rot(f.th),A.mul(A.sc(kx,ky),A.rot(-f.th))),aw[0],aw[1])}
const geomOf=it=>({pts:it.pts&&it.pts.map(p=>p.slice()),cc:it.cc&&it.cc.slice(),u:it.u&&it.u.slice(),v:it.v&&it.v.slice(),m:it.m&&it.m.slice()});
function snapT(){const T={pts:[],sh:[],ws:S.scaleW?wSnap():null};S.sel.pts.forEach(p=>T.pts.push([p,p[0],p[1]]));S.sel.items.forEach(it=>{if(!it.g0&&(it.pts||it.cc||it.m))it.g0=geomOf(it);const c0=GC.get(it);if(c0&&HV.get(it)>HEAVY_MS&&!APPROX.has(it))SG0.set(it,c0);else SG0.delete(it);T.sh.push({it,d:geomOf(it)})});return T}
function restT(T){if(T.ws)wRest(T.ws);T.pts.forEach(([p,x,y])=>{p[0]=x;p[1]=y});T.sh.forEach(({it,d})=>{if(d.pts)it.pts=d.pts.map(p=>p.slice());if(d.cc){it.cc=d.cc.slice();it.u=d.u.slice();it.v=d.v.slice()}if(d.m)it.m=d.m.slice();touch(it)})}
function applyM(M,ws){S.sel.pts.forEach(p=>{const q=A.pt(M,p);p[0]=R2(q[0]);p[1]=R2(q[1])});const fast=S.drag&&!S.scaleW;S.sel.items.forEach(it=>{G.applyShape(it,M);const c0=fast&&SG0.get(it);if(c0){GC.set(it,xfSegs(c0,M));GCD.delete(it);APPROX.add(it)}else touch(it)});if(S.scaleW)wApply(ws||wSnap(),Math.sqrt(Math.abs(M[0]*M[3]-M[1]*M[2])));dirty=1}
function applyNow(M){applyM(M);commit()}
function segDist(p,a,b){const dx=b[0]-a[0],dy=b[1]-a[1],L2=dx*dx+dy*dy,t=L2?Math.max(0,Math.min(1,((p[0]-a[0])*dx+(p[1]-a[1])*dy)/L2)):0;return Math.hypot(p[0]-a[0]-t*dx,p[1]-a[1]-t*dy)}
function hitItem(w){const r=7/S.view.z;
 for(let li=S.layers.length-1;li>=0;li--){const l=S.layers[li];if(!l.vis||l.lock)continue;for(let i=l.items.length-1;i>=0;i--){const it=l.items[i];if(it.k!=='s')continue;for(const e of['a','b'])if(Math.hypot(w[0]-it[e][0],w[1]-it[e][1])<=r*1.15)return{it,l,end:e}}}
 for(let li=S.layers.length-1;li>=0;li--){const l=S.layers[li];if(!l.vis||l.lock)continue;for(let i=l.items.length-1;i>=0;i--){const it=l.items[i];if(it.k==='s'){if(segDist(w,it.a,it.b)<=r+it.w/2)return{it,l}}else for(const s of segsOf(it))if(segDist(w,s.a,s.b)<=r+s.w/2)return{it,l}}}return null}
function qChain(An,closed){const m=An.length,o=[],ho=a=>a.ho||[0,0],hout=a=>a.hn||ho(a);
 for(let i=0;i<m;i++){const p=An[i],h=hout(p);o.push([p[0],p[1]]);
  if(i<m-1){const q=An[i+1],hq=ho(q);o.push([p[0]+h[0],p[1]+h[1]]);o.push([q[0]-hq[0],q[1]-hq[1]])}
  else if(closed){const q=An[0],hq=ho(q);o.push([p[0]+h[0],p[1]+h[1]]);o.push([q[0]-hq[0],q[1]-hq[1]])}}
 return o}
const qClosedH=it=>{const n=it.pts.length;return!!(it.o&&it.o.closed)&&n%3===0&&n>=6};
function qNb(it,a){const n=it.pts.length,cl=qClosedH(it);let i=a>0?a-1:(cl?n-1:null),o=a+1<n?a+1:null;if(cl&&a===n-3)o=n-2;return{i,o}}
function qAnchorOf(it,i){const n=it.pts.length;return i%3===0?i:i%3===1?i-1:(i+1>=n?0:i+1)}
function qDrag(it,i,w,raw,e,d){const P=it.pts;
 if(i%3===0){const nb=qNb(it,i);if(e.altKey&&d.pull===undefined)d.pull=!nb.o&&!nb.i?false:true;
  if(d.pull){const hx=w[0]-P[i][0],hy=w[1]-P[i][1];if(nb.o!=null)P[nb.o]=[P[i][0]+hx,P[i][1]+hy];if(nb.i!=null)P[nb.i]=[P[i][0]-hx,P[i][1]-hy];return}
  const dx=w[0]-P[i][0],dy=w[1]-P[i][1];P[i]=[w[0],w[1]];[nb.i,nb.o].forEach(h=>{if(h!=null)P[h]=[P[h][0]+dx,P[h][1]+dy]});return}
 const a=qAnchorOf(it,i),ap=P[a],nb=qNb(it,a),other=(i===nb.o)?nb.i:nb.o;
 if(d.sm===undefined){d.sm=false;d.ol=0;if(other!=null){const u=[P[i][0]-ap[0],P[i][1]-ap[1]],v=[P[other][0]-ap[0],P[other][1]-ap[1]],lu=Math.hypot(u[0],u[1]),lv=Math.hypot(v[0],v[1]);d.sm=lu>.3&&lv>.3&&Math.abs(u[0]*v[1]-u[1]*v[0])/(lu*lv)<.05&&(u[0]*v[0]+u[1]*v[1])<0;d.ol=lv}else if(P[i][0]===ap[0]&&P[i][1]===ap[1]){}}
 let hx=snapOn()?snapV(raw[0]):raw[0],hy=snapOn()?snapV(raw[1]):raw[1];
 if(e.shiftKey){const dx=hx-ap[0],dy=hy-ap[1],an=Math.round(Math.atan2(dy,dx)/(Math.PI/4))*(Math.PI/4),r=Math.hypot(dx,dy);hx=ap[0]+Math.cos(an)*r;hy=ap[1]+Math.sin(an)*r}
 P[i]=[hx,hy];
 if(d.sm&&!e.altKey&&other!=null){const dx=hx-ap[0],dy=hy-ap[1],L=Math.hypot(dx,dy)||1;P[other]=[ap[0]-dx/L*d.ol,ap[1]-dy/L*d.ol]}}
function qRemove(ch){const it=ch.it,P=it.pts,n=P.length,a=ch.i;
 if(a%3!==0){P[a]=P[qAnchorOf(it,a)].slice();touch(it);commit();return}
 const cl=qClosedH(it),na=cl?n/3:Math.floor((n-1)/3)+1,min=cl?3:2;if(na<=min){toast('Mínimo de '+min+' pontos nesta forma');return}
 let rm;if(!cl)rm=a===0?[0,1,2]:a===n-1?[n-3,n-2,n-1]:[a-1,a,a+1];else rm=a===0?[n-1,0,1]:[a-1,a,a+1];
 let arr=P.filter((_,k)=>!rm.includes(k));if(cl&&a===0)arr=arr.slice(1).concat([arr[0]]);it.pts=arr;touch(it);commit()}
function qAdd(it,h){const P=it.pts,n=P.length,cs=G.qCubics(P,!!(it.o&&it.o.closed)),c=cs[h.i];if(!c)return null;const[L,R]=G.qSplit(c,h.t),m=Math.floor((n-1)/3),rd=v=>[R2(v[0]),R2(v[1])],ins=[rd(L[1]),rd(L[2]),rd(L[3]),rd(R[1]),rd(R[2])];let st;
 if(h.i<m)st=3*h.i+1;else if(n%3===0)st=n-2;else st=n;
 if(h.i<m||n%3===0)P.splice(st,2,...ins);else P.splice(st,0,...ins);touch(it);return{it,i:st+2}}
function drawQCtl(it,z){const P=it.pts,n=P.length,s=4.5/z,del=S.ctrl||S.ptMode==='d';cx.save();cx.setLineDash([4/z,3/z]);cx.strokeStyle='#ffffffaa';cx.lineWidth=1/z;cx.beginPath();const hs=[];
 for(let a=0;a<n;a+=3){const nb=qNb(it,a);[nb.i,nb.o].forEach(h=>{if(h!=null&&Math.hypot(P[h][0]-P[a][0],P[h][1]-P[a][1])>.3){cx.moveTo(P[a][0],P[a][1]);cx.lineTo(P[h][0],P[h][1]);hs.push(h)}})}cx.stroke();cx.setLineDash([]);cx.strokeStyle='#00e5ff';
 hs.forEach(h=>{cx.fillStyle='#ff4081';cx.beginPath();cx.arc(P[h][0],P[h][1],s*.78,0,7);cx.fill();cx.stroke()});
 for(let a=0;a<n;a+=3){cx.fillStyle=del?'#ff5252':'#fff';cx.beginPath();cx.rect(P[a][0]-s,P[a][1]-s,s*2,s*2);cx.fill();cx.stroke()}cx.restore()}
function toQ(it){const P=it.pts,n=P.length,cl=!!(it.o&&it.o.closed),mk=(x,y,hx,hy)=>{const a=[x,y];a.ho=[hx,hy];return a};let An=[],map=P.map((_,i)=>i);
 if(it.t==='P')An=P.map(p=>mk(p[0],p[1],0,0));
 else if(it.t==='S')An=P.map((p,i)=>{const a=cl?P[(i-1+n)%n]:P[Math.max(0,i-1)],b=cl?P[(i+1)%n]:P[Math.min(n-1,i+1)];return mk(p[0],p[1],(b[0]-a[0])/6,(b[1]-a[1])/6)});
 else if(it.t==='N'){const q=cl?[...P,P[0],P[1],P[2]]:[P[0],P[0],...P,P[n-1],P[n-1]],m=q.length-3,K=i=>[(q[i][0]+4*q[i+1][0]+q[i+2][0])/6,(q[i][1]+4*q[i+1][1]+q[i+2][1])/6],cnt=cl?m:m+1;
  for(let i=0;i<cnt;i++){const k=K(i);An.push(mk(k[0],k[1],(q[i+2][0]-q[i][0])/6,(q[i+2][1]-q[i][1])/6))}
  map=P.map((_,i)=>cl?(i-1+n)%n:i+1)}
 else return map;
 it.pts=qChain(An,cl).map(q=>[R2(q[0]),R2(q[1])]);it.t='Q';return map}
function togglePt(ch){const it=ch.it;let a=ch.i;
 if(it.t!=='Q'){const map=toQ(it);a=map[ch.i]*3}else a=qAnchorOf(it,a);
 const P=it.pts,n=P.length,cl=qClosedH(it),nb=qNb(it,a),hi=nb.i,ho=nb.o,ap=P[a];
 const curved=[hi,ho].some(h=>h!=null&&Math.hypot(P[h][0]-ap[0],P[h][1]-ap[1])>.3);
 if(curved){[hi,ho].forEach(h=>{if(h!=null)P[h]=[ap[0],ap[1]]})}
 else{const pa=a>0?a-3:(cl?n-3:null),na=a+3<n?a+3:(cl&&a+3===n?0:null);
  let prev=pa!=null?P[pa]:null,next=na!=null?P[na]:null,d;
  if(prev&&next)d=[next[0]-prev[0],next[1]-prev[1]];
  else{const o=next||prev,sg=next?1:-1,v=[(o[0]-ap[0])*sg,(o[1]-ap[1])*sg],c=Math.cos(.45),sn=Math.sin(.45);d=[v[0]*c-v[1]*sn,v[0]*sn+v[1]*c]}
  const L=Math.hypot(d[0],d[1])||1,u=[d[0]/L,d[1]/L];
  if(ho!=null&&next){const l=Math.hypot(next[0]-ap[0],next[1]-ap[1])/3;P[ho]=[R2(ap[0]+u[0]*l),R2(ap[1]+u[1]*l)]}
  if(hi!=null&&prev){const l=Math.hypot(prev[0]-ap[0],prev[1]-ap[1])/3;P[hi]=[R2(ap[0]-u[0]*l),R2(ap[1]-u[1]*l)]}}
 touch(it);commit()}
const ptElig=it=>!!it&&it.k==='h'&&!!it.pts&&'PSNQ'.includes(it.t);
const ptSel=()=>{if(S.mode!=='draw'||S.sel.items.size!==1||S.sel.pts.size)return null;const it=[...S.sel.items][0];return ptElig(it)?it:null};
function nearSeg(it,raw,r){if(it.t==='Q'){const h=G.qNear(it.pts,!!(it.o&&it.o.closed),raw);return h&&h.d<=r?{i:h.seg,t:h.t,p:h.p,q:1}:null}const n=it.pts.length,E=it.o.closed?n:n-1;let best=-1,bd=1e9;for(let i=0;i<E;i++){const d=segDist(raw,it.pts[i],it.pts[(i+1)%n]);if(d<bd){bd=d;best=i}}return best>=0&&bd<=r?{i:best}:null}
function projSeg(it,i,raw){const a=it.pts[i],b=it.pts[(i+1)%it.pts.length],dx=b[0]-a[0],dy=b[1]-a[1],L2=dx*dx+dy*dy||1,t=Math.max(0,Math.min(1,((raw[0]-a[0])*dx+(raw[1]-a[1])*dy)/L2));return[a[0]+dx*t,a[1]+dy*t]}
function addPtAt(raw){const it=ptSel();if(!it)return null;const h=nearSeg(it,raw,36/S.view.z);if(!h)return null;if(h.q)return qAdd(it,h);const p=projSeg(it,h.i,raw);it.pts.splice(h.i+1,0,[R2(p[0]),R2(p[1])]);touch(it);return{it,i:h.i+1}}
function removePt(ch){const it=ch.it;if(it.t==='Q'){qRemove(ch);return}const min=it.o&&it.o.closed?3:2;if(it.pts.length<=min){toast('Mínimo de '+min+' pontos nesta forma');return}it.pts.splice(ch.i,1);touch(it);commit()}
function ctlHit(w){if(S.mode!=='draw'||S.sel.items.size!==1||S.sel.pts.size)return null;const it=[...S.sel.items][0];if(!it.pts)return null;const r=9/S.view.z;if(it.t==='Q'){const Pq=it.pts,n=Pq.length;for(let i=0;i<n;i+=3)if(Math.hypot(w[0]-Pq[i][0],w[1]-Pq[i][1])<=r)return{it,i};for(let i=n-1;i>=0;i--){if(i%3===0)continue;const ap=Pq[qAnchorOf(it,i)];if(Math.hypot(Pq[i][0]-ap[0],Pq[i][1]-ap[1])<.3)continue;if(Math.hypot(w[0]-Pq[i][0],w[1]-Pq[i][1])<=r)return{it,i}}return null}for(let i=it.pts.length-1;i>=0;i--)if(Math.hypot(w[0]-it.pts[i][0],w[1]-it.pts[i][1])<=r)return{it,i};return null}
function selectHit(h,shift){if(h.it.k==='h'){if(shift){S.sel.items.has(h.it)?S.sel.items.delete(h.it):S.sel.items.add(h.it)}else if(!S.sel.items.has(h.it)){selClear();S.sel.items.add(h.it)}}
 else{const it=h.it;if(!shift&&!(S.sel.pts.has(it.a)&&S.sel.pts.has(it.b)&&!h.end)&&!(h.end&&S.sel.pts.has(it[h.end])))selClear();
  if(h.end){const q=it[h.end];S.layers.forEach(l=>{if(l.vis&&!l.lock)l.items.forEach(s=>{if(s.k==='s')['a','b'].forEach(e=>{if(s[e][0]===q[0]&&s[e][1]===q[1])S.sel.pts.add(s[e])})})})}else{S.sel.pts.add(it.a);S.sel.pts.add(it.b)}}
 const i=S.layers.indexOf(h.l);if(i>=0)S.cur=i}
function boxSelect(x0,y0,x1,y1,add){if(!add)selClear();const inb=p=>p[0]>=x0&&p[0]<=x1&&p[1]>=y0&&p[1]<=y1;S.layers.forEach(l=>{if(!l.vis||l.lock)return;l.items.forEach(it=>{if(it.k==='s'){if(inb(it.a))S.sel.pts.add(it.a);if(inb(it.b))S.sel.pts.add(it.b)}else if(segsOf(it).some(s=>inb(s.a)||inb(s.b)))S.sel.items.add(it)})});grpExpand()}
function delSel(){let n=0;S.layers.forEach(l=>{if(l.lock)return;const b=l.items.length;l.items=l.items.filter(it=>it.k==='s'?!(S.sel.pts.has(it.a)||S.sel.pts.has(it.b)):!S.sel.items.has(it));n+=b-l.items.length});selClear();if(n)commit();else ui(1)}
function dupSel(off=snapOn()?gridSize():10){const l=L();if(!l||l.lock)return;const ns=[];S.sel.items.forEach(it=>{const c=clone(it);c.id=S.uid++;ns.push(c)});l.items.forEach(it=>{if(it.k==='s'&&S.sel.pts.has(it.a)&&S.sel.pts.has(it.b)){const c=clone(it);c.id=S.uid++;ns.push(c)}});if(!ns.length)return;selClear();ns.forEach(c=>{l.items.push(c);if(c.k==='h')S.sel.items.add(c);else{S.sel.pts.add(c.a);S.sel.pts.add(c.b)}});applyM(A.tr(off,off));commit()}
let gridCol='#fff2';const readTheme=()=>{gridCol=getComputedStyle(document.documentElement).getPropertyValue('--grid').trim()||'#fff2'};
function drawFrame(f,z,col){cx.save();cx.translate(f.cx,f.cy);cx.rotate(f.th);cx.strokeStyle=col||'#00e5ff';cx.lineWidth=1/z;cx.strokeRect(-f.hw,-f.hh,f.hw*2,f.hh*2);const ry=rotHandleY(f);cx.beginPath();cx.moveTo(0,-f.hh);cx.lineTo(0,ry);cx.stroke();const s=4.5/z;cx.fillStyle='#fff';
 HP.forEach(h=>{cx.fillRect(h[0]*f.hw-s,h[1]*f.hh-s,s*2,s*2);cx.strokeRect(h[0]*f.hw-s,h[1]*f.hh-s,s*2,s*2)});cx.beginPath();cx.arc(0,ry,s,0,7);cx.fill();cx.stroke();cx.restore()}
function mapFrame(){const m=S.msel;if(!m||m.kind!=='S'||S.mm.length>1)return null;const it=S.map.S[m.i];if(!it)return null;const t=+it.at.T|0,Lw=Math.max(10,+it.at.L||10),H=Math.max(10,+it.at.H||10);return{cx:+it.at.X||0,cy:+it.at.Y||0,th:t===9?0:(+(it.at.P||'').split(',')[4]||0)*Math.PI/180,hw:t===13?Lw:Lw/2,hh:t===13?Lw:H/2,circ:t===13}}
const wantClose=(t,o)=>'PSN'.includes(t)&&!!(o.closed||S.shiftHeld);
let pvIt=null;
function previewSegs(fin){pvIt=null;const t=S.tool,c=S.cur2;if(!c)return null;const st={...style()};let it=null;
 const withC=arr=>{const l=arr[arr.length-1];return l&&Math.hypot(l[0]-c[0],l[1]-c[1])<.5?arr.map(p=>p.slice()):[...arr.map(p=>p.slice()),c.slice()]};
 if(fin){if(!(S.pts.length>=2&&'PSN'.includes(t)&&!S.drag&&wantClose(t,readOpts())))return null; it={k:'h',t,pts:withC(S.pts),o:{...readOpts(),closed:true},...st};it.c=it.c||st.c;if(it.pts.length<3)return null;pvIt=it;return G.shapeSegs(it)}
 if(S.drag&&S.drag.shape){const a=S.drag.a,sh=S.drag.sh;it=dragShape(t,a,c,S.shiftHeld);if(!it)return null}
 else if(S.drag&&S.drag.line)return[{a:S.drag.a,b:c}];
 else if(S.pts.length&&t==='Q'){const ps=(S.drag&&S.drag.qd)?S.pts:[...S.pts,c];if(ps.length<2)return null;it={k:'h',t:'Q',pts:qChain(ps,false),o:{...readOpts(),closed:0},...st}}
 else if(S.pts.length){const q=withC(S.pts);if(t==='L')return[{a:S.pts[0],b:c}];it={k:'h',t,pts:q.length<4&&t==='B'?[...q,...Array(4-q.length).fill(c)]:q,o:(()=>{const o=readOpts();if('PSN'.includes(t))o.closed=wantClose(t,o)&&q.length>=3;return o})(),...st}}
 else return null;it.c=it.c||st.c;pvIt=it;return S.drag?draftSegs(it):G.shapeSegs(it)}
function dragShape(t,a,b,sh){const st=style(),o=readOpts();if(t==='L')return{k:'h',t:'P',pts:[a,b],o:{...o,closed:0},...st};
 if(t==='C'){const r=Math.hypot(b[0]-a[0],b[1]-a[1]);return{k:'h',t:'E',cc:a,u:[r,0],v:[0,r],o,...st}}
 let w=b[0]-a[0],h=b[1]-a[1];if(sh){const d=Math.max(Math.abs(w),Math.abs(h));w=Math.sign(w||1)*d;h=Math.sign(h||1)*d}return{k:'h',t:t==='R'?'R':'E',cc:[a[0]+w/2,a[1]+h/2],u:[Math.abs(w)/2,0],v:[0,Math.abs(h)/2],o,...st}}
function draw(){MR.setFast(S.mode==='map'&&!!S.drag);const d=devicePixelRatio||1,W=cv.width,H=cv.height,v=S.view,z=v.z,vw=[-v.x/z,-v.y/z,(W/d-v.x)/z,(H/d-v.y)/z];if(z!==lastZ){lastZ=z;zoomUI()}cx.setTransform(1,0,0,1,0,0);cx.clearRect(0,0,W,H);cx.setTransform(z*d,0,0,z*d,v.x*d,v.y*d);
 cx.fillStyle='#6a7495';cx.fillRect(0,0,S.map.w,S.map.h);
 const drawGrid=()=>{const g=$('gridon').checked?gridSize():0;if(!(g>0&&g*z>4))return;
  const pf=MR.bgProfile(S.map,S.bgRand,baseState.mapOn||S.mode==='map',S.mode==='draw'?baseState.mapOp/100:1,S.mvis),N=pf.n,mh=S.map.h,mw=S.map.w;
  const dk=i=>pf.l[Math.max(0,Math.min(N-1,i))]>.5;
  const avg=pf.l.reduce((p,c)=>p+c,0)/Math.max(1,pf.l.length),dark=avg>.5;
  const P=new Path2D();
  const x0=Math.max(0,Math.floor(vw[0]/g)*g),x1=Math.min(mw,vw[2]),yA=Math.max(0,vw[1]),yB=Math.min(mh,vw[3]);
  for(let x=x0;x<=x1;x+=g){P.moveTo(x,yA);P.lineTo(x,yB)}
  for(let y=Math.max(0,Math.floor(vw[1]/g)*g),ye=yB;y<=ye;y+=g){P.moveTo(x0,y);P.lineTo(x1,y)}
  cx.save();cx.lineWidth=1/z;cx.strokeStyle=dark?'rgba(0,0,0,.4)':'rgba(255,255,255,.4)';cx.stroke(P);cx.restore()};
 const paintImg=(c2,im)=>{if(!im.vis||!im.el.complete)return;const b=imgBox(im);c2.save();c2.globalAlpha=im.op;c2.translate(b.cx,b.cy);c2.rotate(b.th);c2.drawImage(im.el,-b.W/2,-b.H/2,b.W,b.H);c2.restore()};
 S.imgs.forEach(im=>{if(!imgRel(im))paintImg(cx,im)});cx.globalAlpha=1;
 cx.strokeStyle='rgba(0,0,0,.45)';cx.lineWidth=2/z;cx.strokeRect(0,0,S.map.w,S.map.h);
 const GA=S.mode==='map'?baseState.drawOp/100:1,showD=S.mode!=='map'||baseState.drawOn;
 const J=fg=>{if(baseState.mapOn||S.mode==='map')JT.lines(cx,fg,GA);cx.lineCap='round';let pc=null,pw=0,open=false;const flush=()=>{if(open){cx.stroke();open=false}};
  const one=q=>{if(q.fg!==fg||!showD)return;const m=q.w/2+1;if(Math.max(q.a[0],q.b[0])+m<vw[0]||Math.min(q.a[0],q.b[0])-m>vw[2]||Math.max(q.a[1],q.b[1])+m<vw[1]||Math.min(q.a[1],q.b[1])-m>vw[3])return;
   if(q.al>=1){if(!open||q.c!==pc||q.w!==pw){flush();cx.globalAlpha=GA;cx.strokeStyle='#'+q.c;cx.lineWidth=q.w;cx.beginPath();open=true;pc=q.c;pw=q.w}cx.moveTo(q.a[0],q.a[1]);cx.lineTo(q.b[0],q.b[1])}
   else{flush();cx.globalAlpha=q.al*GA;cx.strokeStyle='#'+q.c;cx.lineWidth=q.w;cx.beginPath();cx.moveTo(q.a[0],q.a[1]);cx.lineTo(q.b[0],q.b[1]);cx.stroke()}};
  S.layers.forEach(l=>{if(fg===0){flush();S.imgs.forEach(im=>{if(im.rl===l.id&&im.rp==='b')paintImg(cx,im)})}if(l.vis)l.items.forEach(it=>{if(it.k==='s')one(it);else{const sg=segsOf(it);if(sg.length>16&&segsOut(sg,vw))return;for(const q of sg)one(q)}});if(fg===0){flush();S.imgs.forEach(im=>{if(im.rl===l.id&&im.rp!=='b')paintImg(cx,im)})}});flush();cx.globalAlpha=1};
 MR.render(cx,S.map,{afterBg:drawGrid,rbg:S.bgRand,show:baseState.mapOn||S.mode==='map',alpha:S.mode==='draw'?baseState.mapOp/100:1,joints:J,sel:S.mode==='map'&&S.msel&&S.msel.kind!=='J'?S.msel:null,z,vis:S.mvis,view:[vw[0]-8,vw[1]-8,vw[2]+8,vw[3]+8]});
 if(S.outMode){cx.save();cx.globalCompositeOperation='destination-out';cx.fillStyle='rgba(0,0,0,'+(S.outMode===1?1:.5)+')';cx.beginPath();cx.rect(vw[0]-60,vw[1]-60,vw[2]-vw[0]+120,vw[3]-vw[1]+120);cx.rect(0,0,S.map.w,S.map.h);cx.fill('evenodd');cx.restore()}
 spawnOverlay(z);drawGhost(z);drawI2L(z);
 if(S.mode==='draw'&&S.imgSel&&S.imgs.includes(S.imgSel)&&S.imgSel.vis)drawFrame(imgFrame(S.imgSel),z,'#ffb300');
 if(S.mode==='map'){const f=mapFrame();if(f&&S.showFrame)drawFrame({...f},z);JT.draw(cx,z,S.msel);mapOverlay(z);return}
 const hs=3/z;
 const HC=!!S.hideCtl;
 if(S.tool==='V'&&!HC){cx.fillStyle='#ffffff99';let n=0;S.layers.forEach(l=>{if(!l.vis||l.lock||n>6000)return;l.items.forEach(it=>{if(it.k==='s'){n++;cx.fillRect(it.a[0]-hs/2,it.a[1]-hs/2,hs,hs);cx.fillRect(it.b[0]-hs/2,it.b[1]-hs/2,hs,hs)}})})}
 if(!HC){cx.strokeStyle='#00e5ff';cx.lineWidth=1/z;S.sel.items.forEach(it=>{cx.beginPath();segsOf(it).forEach(s=>{cx.moveTo(s.a[0],s.a[1]);cx.lineTo(s.b[0],s.b[1])});cx.stroke()});
 cx.fillStyle='#ffb300';S.sel.pts.forEach(p=>cx.fillRect(p[0]-hs,p[1]-hs,hs*2,hs*2))}
 if(!HC&&S.sel.items.size===1&&!S.sel.pts.size){const it=[...S.sel.items][0];if(it.pts&&it.t==='Q')drawQCtl(it,z);else if(it.pts){cx.save();cx.setLineDash([4/z,3/z]);cx.strokeStyle='#ffffffaa';cx.lineWidth=1/z;cx.beginPath();if(it.t==='B'){cx.moveTo(...it.pts[0]);cx.lineTo(...it.pts[1]);cx.moveTo(...it.pts[3]);cx.lineTo(...it.pts[2])}else it.pts.forEach((p,i)=>i?cx.lineTo(p[0],p[1]):cx.moveTo(p[0],p[1]));cx.stroke();cx.restore();const s=4.5/z;it.pts.forEach((p,i)=>{cx.fillStyle=ptElig(it)&&(S.ctrl||S.ptMode==='d')?'#ff5252':it.t==='B'&&(i===1||i===2)?'#ff4081':'#fff';cx.strokeStyle='#00e5ff';cx.beginPath();cx.arc(p[0],p[1],s,0,7);cx.fill();cx.stroke()})}}
 if(S.ptMode==='a'&&S.hover&&S.cur2){const it=ptSel();if(it){const h=nearSeg(it,S.cur2,36/z);if(h){const p=h.q?h.p:projSeg(it,h.i,S.cur2);cx.fillStyle='#69f0ae';cx.strokeStyle='#fff';cx.lineWidth=1.5/z;cx.beginPath();cx.arc(p[0],p[1],5/z,0,7);cx.fill();cx.stroke()}}}
 {const fin=previewSegs(true),pv=fin&&fin.length?fin:previewSegs(),it0=pvIt;if(pv&&pv.length){
   cx.save();cx.lineCap='round';cx.lineJoin='round';
   const chain=(list,fn)=>{let pw=null,pc=null,pa=null,open=false,lx=null,ly=null;const fl=()=>{if(open){cx.stroke();open=false}};
    for(const q of list){const w=fn.w===null?0:q.w,c2=fn.w===null?0:q.c,al=fn.w===null?1:(q.al===undefined?1:q.al);if(!open||w!==pw||c2!==pc||al!==pa){fl();pw=w;pc=c2;pa=al;fn.set(q);cx.beginPath();open=true;lx=null}
     if(lx===null||Math.abs(lx-q.a[0])>1e-6||Math.abs(ly-q.a[1])>1e-6)cx.moveTo(q.a[0],q.a[1]);cx.lineTo(q.b[0],q.b[1]);lx=q.b[0];ly=q.b[1]}fl()};
   cx.setLineDash([2.4/z,4.2/z]);
   chain(pv.length>9000?pv.slice(0,9000):pv,{w:null,set:()=>{cx.globalAlpha=.95;cx.strokeStyle='#ff4081';cx.lineWidth=1.7/z}});
   cx.setLineDash([]);
   cx.restore();cx.fillStyle='#ff4081';S.pts.forEach(p=>cx.fillRect(p[0]-hs,p[1]-hs,hs*2,hs*2))}}
  if(S.tool==='Q'&&S.pts.length&&S.mode==='draw'){cx.save();cx.lineWidth=1/z;cx.strokeStyle='#ff4081';S.pts.forEach(p=>{if(!p.ho)return;const a=[p[0]+p.ho[0],p[1]+p.ho[1]],b=[p[0]-p.ho[0],p[1]-p.ho[1]];cx.beginPath();cx.moveTo(b[0],b[1]);cx.lineTo(a[0],a[1]);cx.stroke();cx.fillStyle='#fff';[a,b].forEach(q=>{cx.beginPath();cx.arc(q[0],q[1],3.5/z,0,7);cx.fill();cx.stroke()})});
  if(S.pts.length>=3&&S.cur2&&Math.hypot(S.cur2[0]-S.pts[0][0],S.cur2[1]-S.pts[0][1])<8/z){cx.strokeStyle='#69f0ae';cx.lineWidth=2/z;cx.beginPath();cx.arc(S.pts[0][0],S.pts[0][1],8/z,0,7);cx.stroke()}cx.restore()}
 if(S.mag){cx.strokeStyle='#ffb300';cx.fillStyle='#ffb30055';cx.lineWidth=2/z;cx.beginPath();cx.arc(S.mag[0],S.mag[1],7/z,0,7);cx.fill();cx.stroke()}
 if(S.smart&&S.tool==='V'&&S.mode==='draw'&&!S.drag&&$('sp_map').checked&&$('sp_mode').value==='smart'){try{const sc=smartCache(spOpts()),PAL=['#ff5252','#40c4ff','#ffd740','#69f0ae','#e040fb','#ff6e40','#18ffff','#b2ff59','#ff80ab','#7c4dff'],KC={scenery:'#9e9e9e'};cx.save();cx.lineCap='round';cx.lineWidth=Math.max(1.5/z,1.2);cx.globalAlpha=.9;
  (sc.list||[]).forEach((c,i)=>{cx.strokeStyle=KC[c.kind]||PAL[i%PAL.length];cx.beginPath();let n=0;for(const u of c.us)for(const s of u.segs){if(n++>4000)break;cx.moveTo(s.a[0],s.a[1]);cx.lineTo(s.b[0],s.b[1])}cx.stroke()});
  cx.globalAlpha=1;cx.font='600 '+(11/z)+'px system-ui,sans-serif';cx.shadowColor='#000';cx.shadowBlur=3;(sc.list||[]).forEach((c,i)=>{cx.fillStyle=KC[c.kind]||PAL[i%PAL.length];cx.fillText(c.nm||'',c.x0,c.y0-4/z)});cx.restore()}catch(e){}}
 if(S.shov&&S.smart&&S.tool==='V'&&S.mode==='draw'&&!S.drag){const sv=S.shov,col={character:'#ffb300',object:'#00e5ff',element:'#ff8a65',scenery:'#69f0ae',detail:'#b39ddb'}[sv.kind]||'#fff',b=sv.bb;const one=sv.n===1,pd=one?3/z:0;cx.save();cx.strokeStyle=col+'99';cx.fillStyle=col+'1c';cx.lineWidth=1.5/z; 
  cx.fillRect(b[0]-pd,b[1]-pd,b[2]-b[0]+pd*2,b[3]-b[1]+pd*2);if(!one){cx.setLineDash([6/z,4/z]);cx.strokeRect(b[0],b[1],b[2]-b[0],b[3]-b[1]);cx.setLineDash([])}
  if(sv.us){let n=0;cx.strokeStyle=col;cx.lineWidth=2.5/z;cx.lineCap='round';cx.globalAlpha=one?.5:.55;cx.beginPath();for(const u of sv.us){for(const s of u.segs){if(n++>5000)break;cx.moveTo(s.a[0],s.a[1]);cx.lineTo(s.b[0],s.b[1])}}cx.stroke();cx.globalAlpha=1}
  cx.font='600 '+(12/z)+'px system-ui,sans-serif';cx.fillStyle=col;cx.shadowColor='#000';cx.shadowBlur=3;cx.fillText(sv.nm,b[0],b[1]-5/z);cx.restore()}
 if(S.tool==='V'&&S.showFrame&&!HC){const f=frame();if(f)drawFrame(f,z)}
 if(S.drag&&S.drag.box){const b=S.drag.box;cx.strokeStyle='#ffb300';cx.lineWidth=1/z;cx.setLineDash([4/z,3/z]);cx.strokeRect(b[0],b[1],b[2]-b[0],b[3]-b[1]);cx.setLineDash([])}
 T2.draw(cx,z)}
function spawnOverlay(z){if(S.mode!=='map')return;const ds=dsGet();if(ds.t==='n')return;cx.save();cx.strokeStyle='#ff4081';cx.fillStyle='#ff408133';cx.lineWidth=2/z;cx.setLineDash([6/z,4/z]);
 if(ds.t==='r'){cx.fillRect(ds.r[0],ds.r[1],ds.r[2],ds.r[3]);cx.strokeRect(ds.r[0],ds.r[1],ds.r[2],ds.r[3])}
 else if(ds.t==='x'){cx.beginPath();cx.moveTo(0,ds.v);cx.lineTo(S.map.w,ds.v);cx.stroke()}
 else if(ds.t==='y'){cx.beginPath();cx.moveTo(ds.v,0);cx.lineTo(ds.v,S.map.h);cx.stroke()}
 else{cx.setLineDash([]);cx.fillStyle='#ff4081';ds.pts.forEach(p=>{cx.beginPath();cx.arc(p[0],p[1],5/z,0,7);cx.fill()})}cx.restore()}
function groundAt(P,s,e){const t=+P.v,circ=t===13;if(!s)return circ?{X:Math.round(e[0]),Y:Math.round(e[1]),L:20}:{X:Math.round(e[0]+20),Y:Math.round(e[1]+20),L:40,H:40};
 const dx=e[0]-s[0],dy=e[1]-s[1];if(circ)return{X:Math.round(s[0]),Y:Math.round(s[1]),L:Math.max(10,Math.round(Math.hypot(dx,dy)))};
 const L=Math.max(10,Math.round(Math.abs(dx))),H=Math.max(10,Math.round(Math.abs(dy)));return{X:Math.round(s[0]+(dx<0?-1:1)*L/2),Y:Math.round(s[1]+(dy<0?-1:1)*H/2),L,H}}
function groundAttrs(P,g){const t=+P.v,at={T:String(t),X:g.X,Y:g.Y,L:String(g.L),P:groundP(t)};if(t!==13)at.H=String(g.H);if(t===12||t===13)at.o='324650';return at}
function armPlace(kind,v){const P=S.place;if(P&&P.kind===kind&&P.v===v){cancelPlace();return}
 const n={kind,v,start:null};
 if(kind==='G')n.it={tag:'S',at:groundAttrs(n,{X:0,Y:0,L:40,H:40})};
 else if(kind==='P')n.it={tag:'P',at:{T:String(v),X:0,Y:0,P:'0,0'}};
 else if(kind==='O')n.it={tag:'O',at:{C:String(v),X:0,Y:0,P:'0,0'}};
 else if(kind==='X')n.it={tag:v,at:{X:0,Y:0}};
  else if(kind==='J')n.js=[];
 else if(kind==='M'){const m=MIM[v];if(!m)return;n.it={tag:'I',at:{U:m.u,X:0,Y:0,F:S.cat.mfg?'1':'0'}}}
 else{n.items=clone(assets[v].items||[]);n.segs=n.items.flatMap(it=>it.k==='s'?[it]:segsOf(it));if(!n.segs.length)return;let x=1e9,y=1e9;n.segs.forEach(q=>{x=Math.min(x,q.a[0],q.b[0]);y=Math.min(y,q.a[1],q.b[1])});n.min=[x,y]}
 S.place=n;S.drag=null;S.pts=[];cv.style.cursor='crosshair';hint(kind==='G'?'Terreno: clique no ponto inicial e arraste até o ponto final · Esc ou botão direito cancela':kind==='J'?'Joint: clique no 1º ponto (terreno ou espaço vazio) e depois no 2º · Esc ou botão direito cancela':'Clique para adicionar (pivô na ponta do mouse) · Esc ou botão direito cancela');markArmed();dirty=1}
function jPicking(j,k){return !!S.pickJ&&S.pickJ.j===j&&S.pickJ.k===k}
function jPickEnd(){if(!S.pickJ)return false;S.pickJ=null;document.body.classList.remove('pickT');return true}
function jPick(j,k){const on=jPicking(j,k);jPickEnd();if(!on){S.pickJ={j,k};document.body.classList.add('pickT');toast('Clique no terreno no mapa (Esc cancela)')}mprops()}
function jPickDown(raw){const P=S.pickJ,g=JT.groundAt(raw);if(g<0){toast('Nenhum terreno aqui');return}jPickEnd();JT.setM(P.j,P.k,g);snap();mapUI(0);mprops();xmlSoon();dirty=1}
function cancelPlace(){if(!S.place)return;S.place=null;cv.style.cursor=S.tool==='V'?'default':S.tool==='H'?'grab':'crosshair';hint(S.mode==='map'?'Mapa: clique num item para selecionar; arraste para mover; alças redimensionam o ground. Ctrl+D duplica.':HINT[S.tool]);markArmed();dirty=1}
function markArmed(){const P=S.place;document.querySelectorAll('#cgrid button[data-k]').forEach(b=>b.classList.toggle('armed',!!P&&P.kind===b.dataset.k&&String(P.v)===b.dataset.v));document.querySelectorAll('#assets .acard[data-i]').forEach(l=>l.classList.toggle('armed',!!P&&P.kind==='A'&&String(P.v)===l.dataset.i))}
function placeDown(w,raw){const P=S.place;if(P.kind==='J'){JT.place(P,w,raw||w,x=>addItem('J',x.tag,x.at));dirty=1;return}
 if(P.kind==='A'){const l=L();if(!l||l.lock||!l.vis){hint('Camada oculta ou travada');return}const dx=w[0]-P.min[0],dy=w[1]-P.min[1];selClear();
  P.items.forEach(t=>{const c=clone(t);c.id=S.uid++;if(c.k==='s'){c.a=[R2(c.a[0]+dx),R2(c.a[1]+dy)];c.b=[R2(c.b[0]+dx),R2(c.b[1]+dy)]}else G.applyShape(c,A.tr(dx,dy));l.items.push(c)});commit();return}
 if(P.kind==='G'){P.start=w.slice();S.drag={placeG:1};S.cur2=w;return}
 if(P.kind==='M'){addItem('I','I',{U:P.it.at.U,X:w[0],Y:w[1],F:S.cat.mfg?'1':'0'});return}
 const at=P.kind==='P'?{T:String(P.v),X:w[0],Y:w[1],P:'0,0'}:P.kind==='O'?{C:String(P.v),X:w[0],Y:w[1],P:'0,0'}:{X:w[0],Y:w[1]};
 addItem(P.kind==='O'?'O':'D',P.kind==='P'?'P':P.kind==='O'?'O':P.v,at)}
function drawGhost(z){const P=S.place;if(!P||!S.hover||!S.cur2)return;if((P.kind==='A')!==(S.mode==='draw'))return;const c=S.cur2;
 if(P.kind==='J'){JT.ghost(cx,S.view.z,P,c);return}
 cx.save();
 if(P.kind==='A'){cx.lineCap='round';cx.translate(c[0]-P.min[0],c[1]-P.min[1]);P.segs.forEach(q=>{cx.globalAlpha=.5*q.al;cx.strokeStyle='#'+q.c;cx.lineWidth=q.w;cx.beginPath();cx.moveTo(q.a[0],q.a[1]);cx.lineTo(q.b[0],q.b[1]);cx.stroke()})}
 else{const it=P.it;let x=c[0],y=c[1];
  if(P.kind==='G'){const g=groundAt(P,P.start,c);Object.assign(it.at,groundAttrs(P,g));MR.drawOne(cx,'S',it,S.map.S.length,.5);cx.strokeStyle='#ffffffaa';cx.lineWidth=1/z;cx.setLineDash([4/z,3/z]);if(+P.v===13){cx.beginPath();cx.arc(g.X,g.Y,g.L,0,7);cx.stroke()}else cx.strokeRect(g.X-g.L/2,g.Y-g.H/2,g.L,g.H)}
  else{it.at.X=x;it.at.Y=y;MR.drawOne(cx,P.kind==='O'?'O':P.kind==='M'?'I':'D',it,P.kind==='O'?S.map.O.length:S.map.D.length,.5)}}
 cx.restore();cx.save();cx.strokeStyle='#ffb300';cx.lineWidth=1.5/z;cx.beginPath();const k=6/z;cx.moveTo(c[0]-k,c[1]);cx.lineTo(c[0]+k,c[1]);cx.moveTo(c[0],c[1]-k);cx.lineTo(c[0],c[1]+k);cx.stroke();cx.restore()}
cv.addEventListener('pointerenter',()=>{S.hover=true;dirty=1});cv.addEventListener('pointerleave',()=>{S.hover=false;S.shov=null;dirty=1});
cv.addEventListener('contextmenu',e=>{if(S.pickJ){e.preventDefault();jPickEnd();mprops();return}if(S.place){e.preventDefault();cancelPlace()}});
const TOOLS=[['V','tl-select','Selecionar / transformar (V)'],['L','tl-line','Reta (L)'],['P','tl-poly','Polilinha (P)'],['Q','tl-pen','Caneta Bézier (Q): clique = reta · arraste = curva'],['B','tl-bezier','Bézier cúbica (B)'],['S','tl-catmull','Spline Catmull-Rom (S)'],['N','tl-bspline','B-Spline (N)'],['F','tl-pencil','Lápis vetorial (F): desenhe livremente e vira um vetor suave'],['C','tl-circle','Círculo (C)'],['E','tl-ellipse','Elipse (E)'],['R','tl-rect','Retângulo (R)'],['K','tl-bucket','Balde de tinta (K): pinta linhas / contorno / preenchimento · Ctrl = conta-gotas'],['J','tl-knife','Faca (J): corta formas com um traço reto ou em curva'],['H','tl-hand','Mover vista (H)']];
const HINT={J:'Faca: arraste sobre as formas para cortar (Reta ou Curva em Operações de caminho). Shift = 45°.',V:'Clique ou caixa seleciona. Arraste move. Alças redimensionam e giram. Shift soma. Del exclui. Duplo clique numa curva adiciona ponto.',L:'Arraste ou clique 2 pontos. O ímã gruda nas pontas (Alt desativa).',P:'Clique pontos. Enter ou duplo clique termina; o 1º ponto fecha. O ímã gruda nas pontas (Alt desativa).',B:'Clique 4 pontos: início, controle 1, controle 2, fim.',S:'Clique pontos de passagem. Enter termina.',N:'Clique pontos de controle. Enter termina.',C:'Arraste do centro para a borda.',E:'Arraste a caixa envolvente (Shift = círculo).',R:'Arraste a caixa (Shift = quadrado). Modo no painel.',H:'Arraste para mover a vista. Scroll = zoom.',Q:'Clique = ponto reto. Arraste = curva com alças. Ctrl alterna o próximo segmento entre reta e curva. Enter termina. Clique no 1º ponto fecha.',F:'Lápis vetorial: desenhe livremente. Ao soltar, o traço vira uma curva suave com poucos segmentos. Laço fechado preenche. O ímã gruda no início e no fim.',K:'Clique numa linha, contorno ou preenchimento para pintar com a cor atual. Ctrl = conta-gotas.'};
function finish(close){const t=S.tool,p=S.pts;let it=null;
 if((t==='P'||t==='S'||t==='N')&&p.length>=(t==='P'?2:2)){it=mkShape(t,{pts:p.map(q=>q.slice())});if(it&&close)it.o.closed=true}
 else if(t==='Q'&&p.length>=2){const cl=!!close&&p.length>=3;it=mkShape('Q',{pts:qChain(p,cl).map(q=>[R2(q[0]),R2(q[1])])});if(it&&cl)it.o.closed=true}
 else if(t==='B'&&p.length===4)it=mkShape('B',{pts:p.map(q=>q.slice())});
 S.pts=[];S.pr=[];if(it){selectOnly(it);commit()}dirty=1}
cv.addEventListener('pointerdown',e=>{cv.setPointerCapture(e.pointerId);let w=toW(e);const raw=toW(e,false);w=magnet(w,raw,e);
 if(e.button===1||space||S.tool==='H'){pan={x:e.clientX,y:e.clientY,vx:S.view.x,vy:S.view.y};return}if(e.button!==0)return;
 if(S.pickJ){jPickDown(raw);return}
 if(S.pickT){pickTerrain(raw);return}
 if(S.place&&((S.place.kind==='A')===(S.mode==='draw'))){placeDown(w,raw);return}
 if(S.mode==='draw'&&S.imgSel&&S.imgs.includes(S.imgSel)&&imgDown(raw,e))return;
 if(S.mode==='map'){mapDown(w,raw,e);return}
 if(T2.down(e,w,raw))return;
 const t=S.tool,ch=(S.tool==='L'||(S.pts.length&&BUILD.includes(S.tool)))?null:ctlHit(raw);
 if(ch){if(ptElig(ch.it)&&S.ptMode==='t'&&!e.ctrlKey){togglePt(ch);return}if(ptElig(ch.it)&&(e.ctrlKey||S.ptMode==='d')){removePt(ch);return}S.drag={ctl:ch,moved:0};return}
 if(S.ptMode==='a'&&!e.ctrlKey){const ad=addPtAt(raw);if(ad){S.drag={ctl:ad,moved:0,added:1};ui(1);return}}
 if(t==='V'){const f=S.showFrame?frame():null,fh=frameHit(f,raw);
  if(fh){S.drag={xf:fh,f,T:snapT(),start:raw,moved:0};return}
  const h=hitItem(raw);
  if(h){const tg=e.shiftKey||e.ctrlKey||e.metaKey,gl=h.l&&h.l.grp&&h.l.vis&&!h.l.lock?h.l:null;if(gl&&tg&&gl.items.every(itIn)){gl.items.forEach(itDel);const gi=S.layers.indexOf(gl);if(gi>=0)S.cur=gi}else{if(S.smart&&!S.place&&!e.altKey)smartSelect(h,tg,raw);else selectHit(h,tg);grpExpand()}S.drag={mv:1,rs:raw,o0:bboxMin(),T:snapT(),moved:0,grab:(h.end&&!S.sel.items.size)?h.it[h.end].slice():null};ui(1);return}
  S.drag={box:[raw[0],raw[1],raw[0],raw[1]],shift:e.shiftKey};if(!e.shiftKey){selClear();ui(1)}return}
 if('CER'.includes(t)){S.shiftHeld=e.shiftKey;S.drag={shape:1,a:w,sh:e.shiftKey};S.cur2=w;return}
 if(t==='L'){S.pr=[];if(S.pts.length===1){const a=S.pts[0];S.pts=[];const it=addFree(a,w);if(it){selClear();S.sel.pts.add(it.a);S.sel.pts.add(it.b);commit()}return}S.drag={line:1,a:w};S.cur2=w;return}
 if(t==='Q'){if(S.pts.length>=3&&Math.hypot(raw[0]-S.pts[0][0],raw[1]-S.pts[0][1])<8/S.view.z){finish(1);return}S.pr=[];const qp=w.slice();S.pts.push(qp);S.drag={qd:qp};S.cur2=w;dirty=1;return}
 if('PSN'.includes(t)&&S.pts.length>2&&Math.hypot(raw[0]-S.pts[0][0],raw[1]-S.pts[0][1])<8/S.view.z){finish(1);return}
 S.pr=[];S.pts.push(w);if(t==='B'&&S.pts.length===4)finish();dirty=1});
cv.addEventListener('pointermove',e=>{S.shiftHeld=e.shiftKey;let w=toW(e);const raw=toW(e,false);w=magnet(w,raw,e);$('coords').textContent=R2(w[0])+', '+R2(w[1]);S.cur2=w;smartHover(raw);
 if(pan){S.view.x=pan.vx+e.clientX-pan.x;S.view.y=pan.vy+e.clientY-pan.y}
 else if(S.drag){const d=S.drag;
  if(d.t2){T2.move(e,d,raw,w)}
  else if(d.qd){const p=d.qd;let hx=snapOn()?w[0]:raw[0],hy=snapOn()?w[1]:raw[1];if(e.shiftKey){const dx=hx-p[0],dy=hy-p[1],an=Math.round(Math.atan2(dy,dx)/(Math.PI/4))*(Math.PI/4),r=Math.hypot(dx,dy);hx=p[0]+Math.cos(an)*r;hy=p[1]+Math.sin(an)*r}if(Math.hypot(hx-p[0],hy-p[1])>3/S.view.z)p.ho=[hx-p[0],hy-p[1]];else delete p.ho;S.mag=null}
  else if(d.box){d.box[2]=raw[0];d.box[3]=raw[1]}
  else if(d.mv){restT(d.T);let dx=raw[0]-d.rs[0],dy=raw[1]-d.rs[1];if(snapOn()){dx=snapV(d.o0[0]+dx)-d.o0[0];dy=snapV(d.o0[1]+dy)-d.o0[1]}if(d.grab&&$('mag').checked&&!e.altKey){const g0=[d.grab[0]+dx,d.grab[1]+dy];let best=null,bd=Math.max(1,+$('magr').value||12)/S.view.z;S.layers.forEach(l=>{if(!l.vis||l.lock)return;l.items.forEach(it=>{if(it.k==='s')for(const q of['a','b']){const p=it[q];if(S.sel.pts.has(p))continue;const dd=Math.hypot(p[0]-g0[0],p[1]-g0[1]);if(dd<=bd){bd=dd;best=p}}})});if(best){dx=best[0]-d.grab[0];dy=best[1]-d.grab[1]}S.mag=best?best.slice():null}else if(d.grab)S.mag=null;
    applyM(A.tr(dx,dy));d.moved=1}
  else if(d.xf){restT(d.T);const f=d.f;let M;if(d.xf.rot){const a0=Math.atan2(d.start[1]-f.cy,d.start[0]-f.cx);let da=Math.atan2(raw[1]-f.cy,raw[0]-f.cx)-a0;if(e.shiftKey)da=Math.round(da/(Math.PI/12))*(Math.PI/12);M=A.about(A.rot(da),f.cx,f.cy)}else{const sr=snapOn()&&Math.abs(f.th)<1e-9?[snapV(raw[0]),snapV(raw[1])]:raw;M=scaleM(f,HP[d.xf.h],toLoc(f,sr),e.altKey,e.shiftKey)}applyM(M,d.T.ws);d.moved=1}
  else if(d.ctl){const cit=d.ctl.it;if(cit.t==='Q')qDrag(cit,d.ctl.i,w,raw,e,d);else cit.pts[d.ctl.i]=[w[0],w[1]];touch(cit);d.moved=1}
  else if(d.mi){const o=d.mi;let nx=d.x0+raw[0]-d.rs[0],ny=d.y0+raw[1]-d.rs[1];if(snapOn())[nx,ny]=snapItem(d.k,o,nx,ny);o.at.X=Math.round(nx);o.at.Y=Math.round(ny);d.moved=1}
  else if(d.mbox){d.mbox[2]=raw[0];d.mbox[3]=raw[1]}
  else if(d.mg){let dx=raw[0]-d.rs[0],dy=raw[1]-d.rs[1];if(snapOn()){const a=d.its[0];dx=snapV(a.x0+dx)-a.x0;dy=snapV(a.y0+dy)-a.y0}d.its.forEach(s=>{s.o.at.X=Math.round(s.x0+dx);s.o.at.Y=Math.round(s.y0+dy)});d.moved=1}
  else if(d.img){imgMove(d,raw,e)}
  else if(d.mh){mapHandleMove(d,raw,e);d.moved=1}
  else if(d.jh){JT.drag(d,raw,snapOn()?snapV:null);d.moved=1}}
 const D=S.drag;if(D&&(D.mv||D.xf||D.ctl||D.mi||D.mh||D.mg||D.jh))xmlSoon();if(D||pan||S.pts.length||S.place||S.mag||(S.tool!=='V'&&S.mode==='draw'))dirty=1});
cv.addEventListener('pointerup',e=>{let w=toW(e);const raw=toW(e,false);w=magnet(w,raw,e);pan=null;const d=S.drag;S.drag=null;S.mag=null;if(!d)return;
 if(d.t2){T2.up(e,d,raw,w);dirty=1;return}
 if(d.img){imgsUI();dirty=1;return}
 if(d.placeG){const P=S.place;if(P&&P.start){const mv=Math.hypot(w[0]-P.start[0],w[1]-P.start[1])>3/S.view.z,g=mv?groundAt(P,P.start,w):groundAt(P,null,P.start);P.start=null;addItem('S','S',groundAttrs(P,g))}dirty=1;return}
 if(d.box){boxSelect(Math.min(d.box[0],d.box[2]),Math.min(d.box[1],d.box[3]),Math.max(d.box[0],d.box[2]),Math.max(d.box[1],d.box[3]),d.shift);ui(1)}
 else if((d.mv||d.xf||d.ctl)&&(d.moved||d.added))commit();
 else if(d.mbox){const b=d.mbox,tiny=Math.hypot(b[2]-b[0],b[3]-b[1])<3/S.view.z;if(!tiny)mapBoxSelect(Math.min(b[0],b[2]),Math.min(b[1],b[3]),Math.max(b[0],b[2]),Math.max(b[1],b[3]),d.shift);else{mapUI();mprops()}}
 else if((d.mi||d.mh||d.mg||d.jh)&&d.moved){snap();mapUI(1);mprops();xmlSoon()}
 else if(d.shape){const moved=Math.hypot(w[0]-d.a[0],w[1]-d.a[1])>3/S.view.z;if(moved){const sh=dragShape(S.tool,d.a,w,e.shiftKey),it=mkShape(sh.t,{cc:sh.cc,u:sh.u,v:sh.v});if(it){selectOnly(it);commit()}}}
 else if(d.line){const moved=Math.hypot(w[0]-d.a[0],w[1]-d.a[1])>3/S.view.z;if(moved){const it=addFree(d.a,w);if(it){selClear();S.sel.pts.add(it.a);S.sel.pts.add(it.b);commit()}}else S.pts=[d.a]}
 dirty=1});
cv.addEventListener('dblclick',e=>{if(S.mode!=='draw')return;const raw=toW(e,false);
 if('PSNQ'.includes(S.tool)&&S.pts.length){S.pts.pop();finish(0);return}
 if(S.ptMode==='d'||S.ptMode==='a')return;if(addPtAt(raw))commit()});
addEventListener('keydown',e=>{if(/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;const k=e.key.toLowerCase();
 if(e.code==='Space'){space=1;e.preventDefault()}
 if(e.ctrlKey&&k==='0'){e.preventDefault();zoomTo(1,...zc())}
 else if(e.ctrlKey&&k==='a'&&S.mode==='draw'){S.layers.forEach(l=>{if(l.vis&&!l.lock)l.items.forEach(it=>{if(it.k==='h')S.sel.items.add(it);else{S.sel.pts.add(it.a);S.sel.pts.add(it.b)}})});ui(1);e.preventDefault()}
 else if(e.ctrlKey&&k==='d'){e.preventDefault();S.mode==='map'?$('mdup').click():dupSel()}
 else if(k==='enter'&&S.mode==='draw')finish(e.shiftKey);
 else if(k==='escape'){lgCancel();if(jPickEnd())mprops();if(S.imgSel){S.imgSel=null;imgsUI()}if(S.place)cancelPlace();S.pts=[];S.pr=[];S.drag=null;selClear();S.msel=null;S.mm=[];ui(1)}
 else if(k==='delete'||k==='backspace'){S.mode==='map'?$('mdel').click():delSel()}
 else if(k.startsWith('arrow')){const s=e.shiftKey?10:1,dx=k==='arrowleft'?-s:k==='arrowright'?s:0,dy=k==='arrowup'?-s:k==='arrowdown'?s:0;e.preventDefault();
  if(S.mode==='map'){const jm=S.msel&&S.msel.kind==='J'&&S.map.J[S.msel.i];if(jm)JT.move(jm,dx,dy);msItems().forEach(({o})=>{o.at.X=Math.round(+o.at.X+dx);o.at.Y=Math.round(+o.at.Y+dy)});if(S.msel){snap();mapUI(1);mprops()}}else if(selCount())applyNow(A.tr(dx,dy))}});
addEventListener('keyup',e=>{if(e.code==='Space')space=0});
function setTool(t){if(S.place)cancelPlace();S.tool=t;S.pts=[];S.pr=[];S.mag=null;if(t!=='V'&&t!=='H'&&t!=='J'&&S.sel.items.size===1&&!S.sel.pts.size&&TT[t]!==[...S.sel.items][0].t){selClear();ui()}document.querySelectorAll('#tools button').forEach(b=>b.classList.toggle('on',b.dataset.t===t));hint(HINT[t]);T2.setCursor();syncOptsVis();T2.toolChanged(t);dirty=1}
$('tools').innerHTML=TOOLS.map((t,i)=>([1,7,8,11,13].includes(i)?'<i class="hs"></i>':'')+`<button data-t="${t[0]}" title="${t[2]}">${ic(t[1],20)}<b>${t[0]}</b></button>`).join('');$('tools').onclick=e=>{const b=e.target.closest('button');if(b)setTool(b.dataset.t)};
let popT=null;const frameC=()=>{const f=frame();return f?[f.cx,f.cy]:null};
function openPop(kind){if(popT&&popT.kind===kind){closePop();return}const mp=S.mode==='map';if(mp?!msList().length:!selCount())return;const r=$('pop-r'),n=$('pop-n');popT=mp?{kind,map:1,T:mapSnap()}:{kind,T:snapT(),c:frameC()};
 if(kind==='rot'){$('pop-l').innerHTML=ic('rotate-cw',14);r.min=-180;r.max=180;r.step=1;r.value=n.value=0}else{$('pop-l').innerHTML=ic('scaling',14);r.min=10;r.max=400;r.step=1;r.value=n.value=100}$('pop').hidden=false}
function closePop(){popT=null;$('pop').hidden=true}
function popApply(v){if(!popT)return;if(popT.map){mapRestore({s:popT.T.s});mapXf(popT.T,popT.kind,v);mapUI(1);xmlSoon();dirty=1;return}restT(popT.T);const c=popT.c;applyM(popT.kind==='rot'?A.about(A.rot(v*Math.PI/180),c[0],c[1]):A.about(A.sc(v/100,v/100),c[0],c[1]),popT.T.ws);xmlSoon()}
$('pop-r').oninput=()=>{$('pop-n').value=$('pop-r').value;popApply(+$('pop-r').value)};$('pop-n').oninput=()=>{$('pop-r').value=$('pop-n').value;popApply(+$('pop-n').value)};
const popCommit=()=>{if(!popT)return;const k=popT.kind;if(popT.map){snap();mapUI(1);mprops();popT.T=mapSnap();$('pop-r').value=$('pop-n').value=k==='rot'?0:100;return}snap();ui();popT.T=snapT();popT.c=frameC();$('pop-r').value=$('pop-n').value=k==='rot'?0:100};$('pop-r').onchange=$('pop-n').onchange=popCommit;
$('sb-rot').onclick=()=>openPop('rot');$('sb-sc').onclick=()=>openPop('sc');
function exactPts(it){if(it.t==='T'){const b=Text.base(it),m=it.m||A.id();return b.segs.flatMap(s=>[A.pt(m,s.a),A.pt(m,s.b)])}
 if(it.t==='I'){const m=it.m||A.id();return it.is.flatMap(q=>[A.pt(m,[q[0],q[1]]),A.pt(m,[q[2],q[3]])])}
 return segsOf(it).flatMap(s=>[s.a,s.b])}
function exactCenter(){const its=[...S.sel.items];if(its.length===1&&!S.sel.pts.size&&(its[0].t==='R'||its[0].t==='E'))return its[0].cc.slice();
 let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;const add=p=>{if(p[0]<x0)x0=p[0];if(p[0]>x1)x1=p[0];if(p[1]<y0)y0=p[1];if(p[1]>y1)y1=p[1]};S.sel.pts.forEach(add);its.forEach(it=>exactPts(it).forEach(add));return x0>x1?null:[(x0+x1)/2,(y0+y1)/2]}
const flip=(x,y)=>{if(S.mode==='map'){mapFlip(x<0?'fx':'fy');return}const c=exactCenter();if(!c)return;applyM(A.about(A.sc(x,y),c[0],c[1]));const c1=exactCenter();if(c1&&(Math.abs(c1[0]-c[0])>.02||Math.abs(c1[1]-c[1])>.02))applyM(A.tr(c[0]-c1[0],c[1]-c1[1]));commit()}; 
function rotDiff(cur,org){const n=org.pts&&cur.pts&&org.pts.length===cur.pts.length?org.pts.length:0;
 if(n>=2){let ax=0,ay=0,bx=0,by=0;for(let i=0;i<n;i++){ax+=org.pts[i][0];ay+=org.pts[i][1];bx+=cur.pts[i][0];by+=cur.pts[i][1]}ax/=n;ay/=n;bx/=n;by/=n;let dot=0,crs=0,sxx=0,sxy=0,syx=0,syy=0;
  for(let i=0;i<n;i++){const px=org.pts[i][0]-ax,py=org.pts[i][1]-ay,qx=cur.pts[i][0]-bx,qy=cur.pts[i][1]-by;dot+=px*qx+py*qy;crs+=px*qy-py*qx;sxx+=px*qx;sxy+=px*qy;syx+=py*qx;syy+=py*qy}
  if(sxx*syy-sxy*syx<0)return 0; 
  if(Math.hypot(dot,crs)<1e-9)return 0;return Math.atan2(crs,dot)}
 if(org.u&&cur.u){const a0=Math.hypot(org.u[0],org.u[1])>1e-6?Math.atan2(org.u[1],org.u[0]):Math.atan2(org.v[1],org.v[0])-Math.PI/2,a1=Math.hypot(cur.u[0],cur.u[1])>1e-6?Math.atan2(cur.u[1],cur.u[0]):Math.atan2(cur.v[1],cur.v[0])-Math.PI/2;return a1-a0}
 if(org.m&&cur.m)return Math.atan2(cur.m[1],cur.m[0])-Math.atan2(org.m[1],org.m[0]);return 0}
function resetXf(){if(S.mode==='map'){mapReset();return}let n=0;
 S.sel.items.forEach(it=>{const d=it.g0;if(!d)return;const cur=geomOf(it);let a=rotDiff(cur,d);a=Math.atan2(Math.sin(a),Math.cos(a));if(Math.abs(a)<1e-4)return;
  const c=(it.t==='R'||it.t==='E')&&it.cc?it.cc.slice():(()=>{const p=[];segsOf(it).forEach(s=>p.push(s.a,s.b));if(!p.length)return null;let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;p.forEach(q=>{x0=Math.min(x0,q[0]);x1=Math.max(x1,q[0]);y0=Math.min(y0,q[1]);y1=Math.max(y1,q[1])});return[(x0+x1)/2,(y0+y1)/2]})();
  if(!c)return;G.applyShape(it,A.about(A.rot(-a),c[0],c[1]));touch(it);n++});
 if(n){closePop();commit()}else toast('Nenhuma rotação para resetar')}
$('sb-rs').onclick=resetXf;
$('sb-fx').onclick=$('tfx').onclick=()=>flip(-1,1);$('sb-fy').onclick=$('tfy').onclick=()=>flip(1,-1);
$('tmove').onclick=()=>applyNow(A.tr(+$('tx').value,+$('ty').value));
$('trotb').onclick=()=>{const c=frameC();if(c)applyNow(A.about(A.rot(+$('trot').value*Math.PI/180),c[0],c[1]))};
$('tscb').onclick=()=>{const c=frameC(),k=+$('tsc').value/100;if(c)applyNow(A.about(A.sc(k,k),c[0],c[1]))};
$('tdel').onclick=delSel;
function joinSel(){
 const tol=Math.min(14,Math.max(1.5,(+$('magr').value||12)/S.view.z)),dd=(p,q)=>Math.hypot(p[0]-q[0],p[1]-q[1]);
 const pathOf=it=>{ 
  if(it.k==='s')return[it.a.slice(),it.b.slice()];
  if(it.k!=='h'||!'PBSNQ'.includes(it.t))return null;const o=it.o||{};if(o.closed)return null;
  const sg=segsOf(it);if(!sg.length)return null;const P=[sg[0].a.slice()];
  for(const q of sg){if(dd(q.a,P[P.length-1])>.02)P.push(q.a.slice());P.push(q.b.slice())}
  return P.length>=2?P:null};
 let made=0,used=0,skipped=0;const out=[];
 S.layers.forEach(l=>{if(l.lock||!l.vis)return;
  const its=l.items.filter(it=>it.k==='h'?S.sel.items.has(it):(S.sel.pts.has(it.a)&&S.sel.pts.has(it.b)));if(its.length<2)return;
  let paths=[];its.forEach(it=>{const p=pathOf(it);if(p)paths.push({p,it});else skipped++});if(paths.length<2)return;
  const chains=[];
  while(paths.length){const cur=paths.shift();let P=cur.p,src=[cur.it],grow=true;
   while(grow){grow=false;let best=null;
    paths.forEach((q,i)=>{const h=P[0],t=P[P.length-1],a=q.p[0],b=q.p[q.p.length-1];
     [[dd(t,a),'t',0],[dd(t,b),'t',1],[dd(h,b),'h',0],[dd(h,a),'h',1]].forEach(([d,end,rev])=>{if(d<=tol&&(!best||d<best.d))best={d,end,rev,i}})});
    if(best){const q=paths.splice(best.i,1)[0];let Q=q.p.map(x=>x.slice());
     if(best.end==='t'){if(best.rev)Q.reverse();P=P.concat(Q.slice(1))}   
     else{if(best.rev)Q.reverse();P=Q.slice(0,-1).concat(P)}
     src.push(q.it);grow=true}}
   chains.push({P,src})}
  chains.forEach(ch=>{if(ch.src.length<2)return;
   let P=ch.P.filter((p,i)=>!i||dd(p,ch.P[i-1])>.005),closed=false;
   if(P.length>=3&&dd(P[0],P[P.length-1])<=tol){closed=true;P.pop()}
   P=P.map(p=>[R2(p[0]),R2(p[1])]);const f=ch.src[0],set=new Set(ch.src),idx=l.items.indexOf(f);
   const base={...readOpts(),...(f.o||{})},it={k:'h',id:S.uid++,t:'P',pts:P,o:{...base,closed,mode:base.mode||'o'},c:f.c,w:f.w,al:f.al,fg:f.fg};
   l.items=l.items.filter(x=>x===f||!set.has(x));l.items[l.items.indexOf(f)]=it;touch(it);out.push(it);made++;used+=ch.src.length})});
 if(!made){toast(skipped?'Nada para unir: selecione 2+ linhas/curvas abertas com pontas próximas':'Nenhuma ponta próxima o bastante ('+R2(tol)+' px)');return}
 selClear();out.forEach(it=>S.sel.items.add(it));commit();
 toast(used+' elementos → '+made+' forma'+(made>1?'s':'')+(out.some(o=>o.o.closed)?' (fechada)':''))}
$('sb-join').onclick=$('tjoin').onclick=joinSel;
const OF=[['n','o_n','n'],['rr','o_rr','n'],['mode','o_mode','s'],['top','o_top','s'],['ocOn','o_ocOn','b'],['oc','o_oc','c'],['ow','o_ow','i'],['oa','o_oa','n'],['ofg','o_ofg','s'],['fa','o_fa','n'],['ffg','o_ffg','s'],['fm','o_fm','s'],['hs','o_hs','n'],['auto','o_auto','b'],['af','o_af','n'],['ha','o_ha','n'],['hx','o_hx','b'],['hi','o_hi','n'],['rc','o_rc','n'],['rg','o_rg','n'],['rsOn','o_rsOn','b'],['rsn','o_rsn','i'],['fcOn','o_fcOn','b'],['fc','o_fc','c'],['fw','o_fw','i'],['closed','o_closed','b'],['gm','o_gm','s'],['gs','o_gs','j']];
const DEFO={n:24,rr:0,mode:'o',top:'o',ocOn:false,oc:'ffffff',ow:3,oa:1,ofg:'',fa:1,ffg:'',fm:'h',hs:6,auto:false,af:.9,ha:45,hx:false,hi:0,rc:0,rg:0,rsOn:false,rsn:12,fcOn:false,fc:'ffffff',fw:3,closed:false,gm:'s',gs:null};
const rv=(id,t)=>{const e=$(id);if(t==='j')return gsRead();return t==='b'?e.checked:t==='n'?(+e.value||0):t==='i'?iw(e.value):t==='c'?e.value.slice(1):e.value};
const GDEF=[{c:'ff8a3d',a:1},{c:'5b6cff',a:1}];
function gsRead(){let v=null;try{v=JSON.parse($('o_gs').value||'null')}catch(e){}if(!Array.isArray(v)||v.length<2)v=GDEF;return v.map(x=>({c:String((x&&x.c)||'ffffff').replace('#','').slice(0,6).padEnd(6,'0'),a:Math.max(0,Math.min(1,(x&&+x.a===+x.a)?+x.a:1))}))}
function gsWrite(v,fin){const e=$('o_gs');e.value=JSON.stringify(v);e.dispatchEvent(new Event('input'));if(fin)e.dispatchEvent(new Event('change'))}
const h2rgb=h=>[0,2,4].map(i=>parseInt(h.slice(i,i+2),16)||0);
function rgb2hsl(r,g,b){r/=255;g/=255;b/=255;const mx=Math.max(r,g,b),mn=Math.min(r,g,b),l=(mx+mn)/2;let h=0,s=0;if(mx!==mn){const d=mx-mn;s=l>.5?d/(2-mx-mn):d/(mx+mn);h=mx===r?(g-b)/d+(g<b?6:0):mx===g?(b-r)/d+2:(r-g)/d+4;h*=60}return[h,s,l]}
function hsl2hex(h,s,l){h=((h%360)+360)%360;const a=s*Math.min(l,1-l),f=n=>{const k=(n+h/30)%12,c=l-a*Math.max(-1,Math.min(k-3,9-k,1));return Math.round(255*c).toString(16).padStart(2,'0')};return f(0)+f(8)+f(4)}
function gradBar(st){const n=st.length,css=st.map((x,i)=>{const[r,g,b]=h2rgb(x.c);return`rgba(${r},${g},${b},${x.a}) ${n>1?Math.round(i/(n-1)*100):0}%`}).join(',');$('gr_bar').innerHTML=`<i style="background:linear-gradient(90deg,${css})"></i>`}
function gradUI(){const st=gsRead();$('gr_list').innerHTML=st.map((x,i)=>`<div class="grow" data-i="${i}"><input type="color" value="#${x.c}" title="Cor ${i+1}"><input type="range" min="0" max="100" step="1" value="${Math.round(x.a*100)}" title="Opacidade desta cor: o degradê também sobe ou desce de transparência"><span class="gpc" title="Opacidade desta cor">${Math.round(x.a*100)}%</span><button type="button" data-del="${i}" title="Remover esta cor" ${st.length<=2?'disabled':''}>${ic('x',14)}</button></div>`).join('');gradBar(st)}
function ensureFc(){const e=$('o_fcOn');if(!e.checked){e.checked=true;e.dispatchEvent(new Event('input'));e.dispatchEvent(new Event('change'))}}
function harmonic(n){const base=Math.random()*360,sch=[[0,30,60],[0,180],[0,120,240],[0,150,210],[0,90,180,270],[0,25,-25,50]][Math.floor(Math.random()*6)],s0=.55+Math.random()*.3,up=Math.random()<.5,out=[];
 for(let i=0;i<n;i++){const t=n>1?i/(n-1):.5,h=base+sch[i%sch.length]+Math.floor(i/sch.length)*14,l=(up?.34+.34*t:.68-.34*t),s=Math.min(.92,s0+(Math.random()-.5)*.15);out.push(hsl2hex(h,s,l))}return out}
$('o_gseg').addEventListener('click',e=>{const b=e.target.closest('[data-gm]');if(!b)return;ensureFc();const g=$('o_gm');g.value=b.dataset.gm;g.dispatchEvent(new Event('input'));g.dispatchEvent(new Event('change'))});
$('gr_list').addEventListener('input',e=>{const row=e.target.closest('.grow');if(!row)return;const i=+row.dataset.i,st=gsRead(),t=e.target;if(t.type==='color')st[i].c=t.value.slice(1);else{const v=Math.max(0,Math.min(100,+t.value||0));st[i].a=v/100;row.querySelector('.gpc').textContent=v+'%'}ensureFc();gsWrite(st,false);gradBar(st)});
$('gr_list').addEventListener('change',e=>{if(e.target.closest('.grow'))gsWrite(gsRead(),true)});
$('gr_list').addEventListener('click',e=>{const b=e.target.closest('[data-del]');if(!b)return;const st=gsRead();if(st.length<=2)return;st.splice(+b.dataset.del,1);ensureFc();gsWrite(st,true);gradUI()});
$('gr_add').onclick=()=>{const st=gsRead(),l=st[st.length-1],[r,g,b]=h2rgb(l.c),[h,s,li]=rgb2hsl(r,g,b);st.push({c:hsl2hex(h+40,Math.max(.45,s),Math.min(.7,Math.max(.35,li))),a:l.a});ensureFc();gsWrite(st,true);gradUI()};
$('gr_inv').onclick=()=>{const st=gsRead().reverse();ensureFc();gsWrite(st,true);gradUI()};
$('gr_rnd').onclick=()=>{const st=gsRead(),cs=harmonic(st.length);st.forEach((x,i)=>x.c=cs[i]);ensureFc();gsWrite(st,true);gradUI()};
function patFix(it){const pp=it.pp,o=it.o;if(!pp||!o)return;if(o.mode==='o'){it.c=pp.l;it.w=pp.ow;o.ocOn=false}else if(o.mode==='f'){it.c=pp.f;it.w=pp.fw;o.ocOn=false;o.hi=0}else{it.c=pp.f;it.w=pp.fw;o.ocOn=true;o.oc=pp.l;o.ow=pp.ow;o.hi=Math.max(0,(pp.fw-pp.ow)/2)}}
function patKeep(it,k){const pp=it.pp,o=it.o;if(!pp||!o)return;if(k==='ow')pp.ow=o.ow;else if(k==='fw')pp.fw=o.fw;else if(k==='oc')pp.l=o.oc;else if(k==='fc')pp.f=o.fc;
 if(!pp.orig)return;if(k!=='oc'&&o.ocOn)o.oc=pp.l;if(k!=='fc'&&o.fcOn){o.fc=pp.f}if(o.mode==='o'&&!o.ocOn)it.c=pp.l;else if(!o.fcOn)it.c=pp.f}
function readOpts(){const o={};OF.forEach(([k,id,t])=>o[k]=rv(id,t));return o}
function optsToUI(o){OF.forEach(([k,id,t])=>{const v=o[k]===undefined?DEFO[k]:o[k],e=$(id);if(t==='b')e.checked=!!v;else if(t==='c')e.value='#'+v;else if(t==='j')e.value=v?JSON.stringify(v):'';else e.value=v});gradUI()}
const TT={B:'B',S:'S',N:'N',P:'P',Q:'Q',C:'E',E:'E',R:'R',F:'Q'};
function ctxType(){if(S.sel.items.size===1&&!S.sel.pts.size)return[...S.sel.items][0].t;return TT[S.tool]||''}
function syncOptsVis(){const t=ctxType(),o=readOpts(),fillable='RE'.includes(t)&&t!==''||('PBSNQ'.includes(t)&&t!==''&&o.closed),mode=fillable?o.mode:'o',en=(id,on)=>{$(id).disabled=!on;const l=$(id).closest('label');if(l)l.classList.toggle('dis',!on)};
 document.querySelectorAll('#optgrid [data-for]').forEach(e=>e.hidden=!e.dataset.for.split(',').includes(t));
 $('sec-shape').hidden=!t||!'EBSNRPQ'.includes(t);$('g_mode').hidden=!fillable;$('l_top').hidden=mode!=='b';$('g_out').hidden=mode!=='b';$('g_fill').hidden=mode==='o';
 ['o_oc','o_ow','o_oa','o_ofg'].forEach(i=>en(i,o.ocOn));['o_fc','o_fw','o_fa','o_ffg'].forEach(i=>en(i,o.fcOn));$('g_ostyle').classList.toggle('off',!o.ocOn);$('g_fstyle').classList.toggle('off',!o.fcOn);en('o_af',o.auto);en('o_hs',!o.auto);en('o_rsn',o.rsOn);
 const hasSeg='EBSNQ'.includes(t)&&t!==''||(t==='R'&&o.rr>0);document.querySelectorAll('#g_fill [data-seg]').forEach(e=>e.hidden=!(o.fm==='r'&&hasSeg));
 document.querySelectorAll('#g_fill [data-fm]').forEach(e=>e.hidden=e.dataset.fm!==o.fm);$('l_hi').textContent=o.fm==='r'?'Recuo inicial':'Recuo das pontas';
 const gg=o.gm==='g';$('g_solid').hidden=gg;$('g_grad').hidden=!gg;document.querySelectorAll('#o_gseg [data-gm]').forEach(b=>b.classList.toggle('on',b.dataset.gm===(gg?'g':'s')))}
OF.forEach(([k,id,t])=>{const e=$(id),fn=()=>{const v=rv(id,t);S.sel.items.forEach(it=>{if(it.o){it.o[k]=t==='j'?JSON.parse(JSON.stringify(v)):v;if(k==='mode'&&it.pp)patFix(it);else if(it.pp)patKeep(it,k);touch(it)}});syncOptsVis();dirty=1;xmlSoon()};e.addEventListener('input',()=>{liveEdit();fn()});e.addEventListener('change',()=>{S.live=0;fn();snap();ui()})});
const SF={col:'c',wid:'w',alp:'al',fg:'fg'};
function applyStyle(k,v){liveEdit();S.sel.items.forEach(it=>{it[k]=v;touch(it)});S.layers.forEach(l=>l.items.forEach(it=>{if(it.k==='s'&&S.sel.pts.has(it.a)&&S.sel.pts.has(it.b))it[k]=v}));dirty=1;xmlSoon()}
Object.keys(SF).forEach(id=>{$(id).addEventListener('input',()=>applyStyle(SF[id],id==='col'?$(id).value.slice(1):id==='wid'?iw($(id).value):+$(id).value));$(id).addEventListener('change',()=>{S.live=0;snap();ui()})});
const PAL=['#ffffff','#d9d9d9','#a6a6a6','#737373','#404040','#000000','#ff4d4d','#ff8a4d','#ffc94d','#e8e84d','#a6e34d','#4de88a','#4de8d9','#4db8ff','#4d6aff','#8a4dff','#d94dff','#ff4da6','#6a7495','#8993b4','#3b4260','#c2a878','#8b5a2b','#5b3a1e','#2e7d32','#81c784','#fff59d','#ffcc80','#ef9a9a','#ce93d8','#90caf9','#80cbc4','#bcaaa4','#b0bec5','#263238','#f5f0e6'];
$('pal').innerHTML=PAL.map(c=>`<i style="background:${c}" data-c="${c}"></i>`).join('');$('pal').onclick=e=>{if(e.target.dataset.c){$('col').value=e.target.dataset.c;$('col').dispatchEvent(new Event('input'));$('col').dispatchEvent(new Event('change'))}};
let presets=JSON.parse(localStorage.athelis_presets||'[]');
function presUI(){$('presets').innerHTML=presets.map((p,i)=>`<button data-i="${i}" title="clique: aplicar · botão direito: apagar"><b style="background:#${p.c};opacity:${p.al}"></b>${esc(p.n)} ${p.w}px</button>`).join('');localStorage.athelis_presets=JSON.stringify(presets)}
$('prs').onclick=()=>{presets.push({n:$('prn').value||'Preset '+(presets.length+1),...style()});presUI()};
$('presets').onclick=e=>{const b=e.target.closest('button');if(!b)return;const p=presets[+b.dataset.i];$('col').value='#'+p.c;$('wid').value=p.w;$('alp').value=p.al;$('fg').value=p.fg;['col','wid','alp','fg'].forEach(id=>$(id).dispatchEvent(new Event('input')));snap();ui()};
$('presets').oncontextmenu=e=>{const b=e.target.closest('button');if(!b)return;e.preventDefault();presets.splice(+b.dataset.i,1);presUI()};
function syncProps(){let st=null;const f=[...S.sel.items][0];if(f)st=f;else S.layers.forEach(l=>l.items.forEach(it=>{if(!st&&it.k==='s'&&S.sel.pts.has(it.a)&&S.sel.pts.has(it.b))st=it}));
 if(st){$('col').value='#'+st.c;$('wid').value=st.w;$('alp').value=st.al;$('fg').value=st.fg}
 const single=S.sel.items.size===1&&!S.sel.pts.size?[...S.sel.items][0]:null;if(single&&single.o)optsToUI(single.o);syncOptsVis();
 if(single&&single.t==='T')writeTx(single.tx);txtInfo(single&&single.t==='T'?single:null)}
const NAME={P:'Polilinha',Q:'Caneta Bézier',B:'Bézier',S:'Spline',N:'B-Spline',R:'Retângulo',E:'Elipse',T:'Texto',I:'Imagem'};
let IDX=new Map();
const ITIC={s:'slash',P:'route',B:'pen-tool',S:'spline',N:'waves',R:'square',E:'ellipse',T:'type',I:'image'};
const ni=(f,v,t)=>`<input type="number" step="any" data-f="${f}" value="${v}" title="${t||''}">`;
const prow=(lb,fx,vx,fy,vy)=>`<div class="pr"><b>${lb}</b>${ni(fx,vx,'x')}${ni(fy,vy,'y')}</div>`;
const sf=it=>`<div class="g4"><label>cor<input type="color" data-f="c" value="#${it.c}"></label><label>larg.<input type="number" step="1" min="1" data-f="w" value="${it.w}"></label><label>alfa${ni('al',it.al)}</label><label>plano<select data-f="fg"><option value="0" ${it.fg?'':'selected'}>fundo</option><option value="1" ${it.fg?'selected':''}>frente</option></select></label></div>`;
function itemHTML(it){const open=S.exp.has('I'+it.id),line=it.k==='s',sel=line?S.sel.pts.has(it.a)&&S.sel.pts.has(it.b):S.sel.items.has(it),t=line?'s':it.t;
 const nm=line?`Linha <small>${R2(it.a[0])},${R2(it.a[1])} → ${R2(it.b[0])},${R2(it.b[1])}</small>`:`${NAME[it.t]}${it.t==='T'?': '+esc((it.tx.text||'').split('\n')[0].slice(0,14)):''} <small>${segsOf(it).length} linhas</small>`;
 let h=`<div class="it ${sel?'sel':''}" data-id="${it.id}"><div class="ih" data-act="isel"><button class="btn2 chev" data-act="ix" title="Detalhes">${ic(open?'chevron-down':'chevron-right',13)}</button><span class="ii">${ic(ITIC[t],13)}</span><span class="nm">${nm}</span><span class="acts">${line?'':`<button class="btn2" data-act="iexp" title="Converter em linhas livres">${ic('unlink',13)}</button>`}<button class="btn2 dn" data-act="idel" title="Excluir">${ic('trash-2',13)}</button></span></div>`;
 if(open){h+='<div class="det"><div class="dsec"><div class="dt">Geometria</div>';
  if(line)h+=prow('A','a.0',it.a[0],'a.1',it.a[1])+prow('B','b.0',it.b[0],'b.1',it.b[1]);
  else if(it.pts)it.pts.forEach((p,i)=>{h+=prow('P'+i,`pts.${i}.0`,R2(p[0]),`pts.${i}.1`,R2(p[1]))});
  else if(it.cc)h+=prow('C','cc.0',R2(it.cc[0]),'cc.1',R2(it.cc[1]))+prow('U','u.0',R2(it.u[0]),'u.1',R2(it.u[1]))+prow('V','v.0',R2(it.v[0]),'v.1',R2(it.v[1]));
  else if(it.m)h+=prow('Pos','m.4',R2(it.m[4]),'m.5',R2(it.m[5]))+`<div class="pr m4">${ni('m.0',R2(it.m[0]),'a')}${ni('m.1',R2(it.m[1]),'b')}${ni('m.2',R2(it.m[2]),'c')}${ni('m.3',R2(it.m[3]),'d')}</div>`;
  h+='</div><div class="dsec"><div class="dt">Estilo</div>'+sf(it)+'</div></div>'}
 return h+'</div>'}
const lgOn=l=>l.gid!==undefined&&String(l.gid).trim()!=='';
const lgIds=l=>{const a=String(l.gid).trim(),b=l.gid2!==undefined&&String(l.gid2).trim()!==''?String(l.gid2).trim():a;return[a,b]};
const lgAttr=l=>{if(!lgOn(l))return'';const[a,b]=lgIds(l);return` M1="${a}" M2="${b}"`};
function lgSet(l,v){v=String(v==null?'':v).trim();if(v===''||isNaN(+v)){delete l.gid;delete l.gid2}else{l.gid=String(Math.max(0,Math.round(+v)));delete l.gid2}}
function lgFix(fn){S.layers.forEach(l=>{if(!lgOn(l))return;const a=fn(+l.gid);if(a===undefined){delete l.gid;delete l.gid2;return}l.gid=String(a);if(l.gid2!==undefined&&String(l.gid2).trim()!==''){const b=fn(+l.gid2);if(b===undefined)delete l.gid2;else l.gid2=String(b)}})}
const lgOnRemoveS=d=>lgFix(v=>v===d?undefined:v>d?v-1:v),lgOnMoveS=(a,b)=>lgFix(v=>v===a?b:(a<b&&v>a&&v<=b)?v-1:(a>b&&v>=b&&v<a)?v+1:v);
function lgPick(lid){S.pickT=S.pickT===lid?null:lid;document.body.classList.toggle('pickT',!!S.pickT);$('layers')._h=null;layersUI();if(S.pickT)toast('Clique no terreno no mapa (Esc cancela)')}
function lgCancel(){if(S.pickT){S.pickT=null;document.body.classList.remove('pickT');$('layers')._h=null;layersUI()}}
function pickTerrain(raw){const l=S.layers.find(x=>x.id===S.pickT);if(!l){lgCancel();return}
 const list=S.map.S||[];let hit=-1;if(!(S.mvis&&S.mvis.S===0))for(let i=list.length-1;i>=0;i--)if(MR.hit('S',list[i],i,raw[0],raw[1])){hit=i;break}
 if(hit<0){toast('Nenhum terreno nesse ponto');return}
 lgSet(l,hit);S.pickT=null;document.body.classList.remove('pickT');S.lgOpen.add(l.id);commit();toast('Camada indexada ao terreno '+hit)}
function layerHTML(l,li){const open=S.exp.has('L'+l.id),lim=S.lim[l.id]||100;l.items.forEach(it=>IDX.set(it.id,{it,l}));
 let h=`<li data-l="${l.id}"><div class="lh ${li===S.cur?'on':''}${S.lsel.has(l.id)&&S.lsel.size>1?' msel':''}" data-act="lsel"><button class="btn2 chev" data-act="lx" title="Expandir/recolher">${ic(open?'chevron-down':'chevron-right',14)}</button><button class="btn2 ${l.vis?'':'off'}" data-act="lv" title="Visível">${ic(l.vis?'eye':'eye-off',14)}</button><button class="btn2 ${l.lock?'':'off'}" data-act="ll" title="Travar">${ic(l.lock?'lock':'lock-open',14)}</button><button class="btn2 ${l.grp?'':'off'}" data-act="lgrp" title="Tratar a camada como grupo no canvas: mover, girar e escalar seleciona a camada inteira (ativar/desativar)">${ic('box-select',14)}</button><span class="ln">${esc(l.name)}</span>${lgOn(l)?`<span class="lgb" title="Indexada ao terreno ${esc(lgIds(l)[0])}${lgIds(l)[0]!==lgIds(l)[1]?' / '+esc(lgIds(l)[1]):''}: cada linha sai com M1 e M2">T${esc(lgIds(l)[0])}${lgIds(l)[0]!==lgIds(l)[1]?'/'+esc(lgIds(l)[1]):''}</span>`:''}<button class="btn2 ${lgOn(l)||S.lgOpen.has(l.id)?'':'off'}" data-act="lg" title="Indexar a um terreno (M1/M2)">${ic('anchor',14)}</button><button class="btn2" data-act="lsa" title="Selecionar / desmarcar todos os elementos desta camada">${ic('square-check',14)}</button><span class="cnt">${l.items.length}</span></div>`;
 if(S.lgOpen.has(l.id))h+=`<div class="lgrow"><span class="lgl">${ic('anchor',13)}Terreno</span><input type="number" min="0" step="1" data-lg="${l.id}" value="${esc(l.gid===undefined?'':l.gid)}" placeholder="ID" title="ID do terreno (posição na lista de terrenos, começando em 0). Cada linha da camada leva M1 e M2 com este ID."><button class="btn2 ${S.pickT===l.id?'on':''}" data-act="lgpick" title="Clicar no terreno no mapa">${ic('crosshair',14)}</button><button class="btn2" data-act="lgclr" title="Remover o vínculo">${ic('x',14)}</button></div>`;
 if(open)h+='<div class="items">'+(l.items.length?l.items.slice(0,lim).map(itemHTML).join(''):'<div class="empty">Camada vazia</div>')+(l.items.length>lim?`<button data-act="more">Mostrar mais (${l.items.length-lim})</button>`:'')+'</div>';
 return h+'</li>'}
let lSig='';
function layersUI(){lselOk();{const sg=S.layers.map(l=>l.id+':'+l.name).join('|');if(sg!==lSig){lSig=sg;if(typeof imgsUI==='function'&&S.imgs.length)setTimeout(imgsUI,0)}}IDX=new Map();const out=[];for(let li=S.layers.length-1;li>=0;li--)out.push(layerHTML(S.layers[li],li));{const h=out.join(''),el=$('layers');if(el._h!==h){el._h=h;keepScroll(el,()=>{el.innerHTML=h})}}if(S.focusIt){const r=$('layers').querySelector('[data-id="'+S.focusIt+'"]');S.focusIt=0;if(r)r.scrollIntoView({block:'nearest'})}}
function relayer(i){const l=S.layers[i],el=$('layers').querySelector(`li[data-l="${l.id}"]`);$('layers')._h=null;if(!el)return layersUI();keepScroll($('layers'),()=>{el.outerHTML=layerHTML(l,i)})}
const setPath=(o,p,v)=>{const k=p.split('.');let t=o;for(let i=0;i<k.length-1;i++)t=t[k[i]];t[k[k.length-1]]=v};
S.lsel=new Set();S.lgOpen=new Set();S.pickT=null;S.lanch=0;S.lastIt=null;S.lauto=localStorage.athelis_lauto==='1';S.snapUid=S.uid;S.focusIt=0;
function lselOk(){const c=L();if(!c){S.lsel=new Set();return}S.lsel=new Set([...S.lsel].filter(id=>S.layers.some(l=>l.id===id)));if(!S.lsel.has(c.id))S.lsel=new Set([c.id])}
function selLayers(){lselOk();const r=S.layers.filter(l=>S.lsel.has(l.id));return r.length?r:[L()]}
function layerPick(i,e){lselOk();const l=S.layers[i];
 if(e.shiftKey){const an=Math.max(0,Math.min(S.layers.length-1,S.lanch)),a=Math.min(an,i),b=Math.max(an,i);S.lsel=new Set();for(let k=a;k<=b;k++)S.lsel.add(S.layers[k].id);S.cur=i}
 else if(e.ctrlKey||e.metaKey){if(S.lsel.has(l.id)&&S.lsel.size>1){S.lsel.delete(l.id);const last=S.layers.findIndex(x=>x.id===[...S.lsel].pop());S.cur=last<0?0:last}else{S.lsel.add(l.id);S.cur=i}S.lanch=i}
 else{S.lsel=new Set([l.id]);S.cur=i;S.lanch=i}
 ui()}
function togL(l,p){const g=selLayers(),t=g.includes(l)?g:[l],v=l[p]?0:1;t.forEach(x=>x[p]=v);commit()}
const itIn=it=>it.k==='h'?S.sel.items.has(it):(S.sel.pts.has(it.a)&&S.sel.pts.has(it.b));
const itAny=it=>it.k==='h'?S.sel.items.has(it):(S.sel.pts.has(it.a)||S.sel.pts.has(it.b));
const itAdd=it=>{if(it.k==='h')S.sel.items.add(it);else{S.sel.pts.add(it.a);S.sel.pts.add(it.b)}};
const itDel=it=>{if(it.k==='h')S.sel.items.delete(it);else{S.sel.pts.delete(it.a);S.sel.pts.delete(it.b)}};
const grpLayer=it=>{for(const l of S.layers)if(l.grp&&l.vis&&!l.lock&&l.items.includes(it))return l;return null};
function grpExpand(){for(const l of S.layers)if(l.grp&&l.vis&&!l.lock&&l.items.some(itAny))l.items.forEach(itAdd)}
function itemPick(o,e){const it=o.it,l=o.l,idx=l.items.indexOf(it),add=e.ctrlKey||e.metaKey;
 if(e.shiftKey&&S.lastIt&&S.lastIt.l===l){const a=Math.min(S.lastIt.i,idx),b=Math.max(S.lastIt.i,idx);if(!add)selClear();for(let k=a;k<=b;k++)itAdd(l.items[k])}
 else if(add){itIn(it)?itDel(it):itAdd(it);S.lastIt={l,i:idx}}
 else{selClear();itAdd(it);S.lastIt={l,i:idx}}
 S.cur=S.layers.indexOf(l);ui()}
function selAllLayer(l){if(l.lock||!l.vis){toast('Camada oculta ou travada');return}const all=l.items.length&&l.items.every(itIn);if(all)l.items.forEach(itDel);else l.items.forEach(itAdd);S.cur=S.layers.indexOf(l);ui();toast(all?'Elementos desmarcados':l.items.length+' elementos selecionados')}
$('layers').addEventListener('click',e=>{const b=e.target.closest('[data-act]');if(!b)return;const a=b.dataset.act,li=b.closest('li'),lid=+li.dataset.l,li_=S.layers.findIndex(l=>l.id===lid),l=S.layers[li_],row=b.closest('[data-id]'),o=row&&IDX.get(+row.dataset.id);e.stopPropagation();
 if(a==='lsel'){layerPick(li_,e)}else if(a==='lsa'){selAllLayer(l)}else if(a==='lx'){const k='L'+lid;S.exp.has(k)?S.exp.delete(k):S.exp.add(k);relayer(li_)}else if(a==='lg'){S.lgOpen.has(lid)?S.lgOpen.delete(lid):S.lgOpen.add(lid);if(S.pickT===lid)lgCancel();relayer(li_)}else if(a==='lgpick'){lgPick(lid)}else if(a==='lgclr'){lgSet(l,'');if(S.pickT===lid)lgCancel();commit()}else if(a==='lv'){togL(l,'vis')}else if(a==='lgrp'){togL(l,'grp')}else if(a==='ll'){togL(l,'lock')}
 else if(a==='more'){S.lim[lid]=(S.lim[lid]||100)+200;relayer(li_)}
 else if(o){const it=o.it;if(a==='ix'){const k='I'+it.id;S.exp.has(k)?S.exp.delete(k):S.exp.add(k);relayer(S.layers.indexOf(o.l))}
  else if(a==='isel'){itemPick(o,e)}
  else if(a==='idel'){o.l.items=o.l.items.filter(x=>x!==it);selClear();commit()}
  else if(a==='iexp'){const i=o.l.items.indexOf(it),ns=segsOf(it).map(s=>({k:'s',id:S.uid++,a:s.a.slice(),b:s.b.slice(),c:s.c,w:s.w,al:s.al,fg:s.fg}));o.l.items.splice(i,1,...ns);selClear();commit()}}});
$('layers').addEventListener('dblclick',e=>{const h=e.target.closest('.lh');if(!h||e.target.closest('button'))return;const l=S.layers.find(x=>x.id===+h.closest('li').dataset.l),n=prompt('Nome da camada',l.name);if(n){l.name=n;commit()}});
const conv=t=>t.type==='color'?t.value.slice(1):(t.type==='number'||t.tagName==='SELECT')?+t.value:t.value;
$('layers').addEventListener('input',e=>{const t=e.target,f=t.dataset.f;if(!f)return;const o=IDX.get(+t.closest('[data-id]').dataset.id);if(!o)return;setPath(o.it,f,f==='w'?iw(t.value):conv(t));liveEdit();touch(o.it);dirty=1;xmlSoon()});
$('layers').addEventListener('change',e=>{if(e.target.dataset.f){snap();syncProps();layersUI()}else if(e.target.dataset.lg){const l=S.layers.find(x=>x.id===+e.target.dataset.lg);if(l){lgSet(l,e.target.value);commit()}}});
$('lren').onclick=()=>{const l=L(),n=prompt('Nome da camada',l.name);if(n){l.name=n;commit()}};
$('lauto').classList.toggle('on',S.lauto);$('lauto').onclick=()=>{S.lauto=!S.lauto;try{localStorage.athelis_lauto=S.lauto?'1':'0'}catch(e){}$('lauto').classList.toggle('on',S.lauto);toast(S.lauto?'Detalhe automático ligado':'Detalhe automático desligado')};
$('lexp').onclick=()=>{S.layers.forEach(l=>S.exp.add('L'+l.id));layersUI()};$('lcol').onclick=()=>{S.exp.clear();layersUI()};
$('ladd').onclick=()=>{const l=newLayer();S.layers.splice(S.cur+1,0,l);S.cur++;S.exp.add('L'+l.id);commit()};
$('ldel').onclick=()=>{const g=selLayers();if(S.layers.length<=g.length){g.forEach(l=>{l.items=[]});selClear();commit();toast('Conteúdo da camada apagado');return}const lo=Math.min(...g.map(x=>S.layers.indexOf(x)));S.layers=S.layers.filter(l=>!g.includes(l));S.cur=Math.max(0,Math.min(S.layers.length-1,lo-1));S.lsel=new Set();selClear();commit()};
$('lup').onclick=()=>{const g=new Set(selLayers()),c=L();let ch=0;for(let i=S.layers.length-2;i>=0;i--)if(g.has(S.layers[i])&&!g.has(S.layers[i+1])){[S.layers[i],S.layers[i+1]]=[S.layers[i+1],S.layers[i]];ch=1}if(ch){S.cur=S.layers.indexOf(c);commit()}};
$('ldn').onclick=()=>{const g=new Set(selLayers()),c=L();let ch=0;for(let i=1;i<S.layers.length;i++)if(g.has(S.layers[i])&&!g.has(S.layers[i-1])){[S.layers[i],S.layers[i-1]]=[S.layers[i-1],S.layers[i]];ch=1}if(ch){S.cur=S.layers.indexOf(c);commit()}};
$('ldup').onclick=()=>{const g=selLayers().slice().sort((a,b)=>S.layers.indexOf(b)-S.layers.indexOf(a)),ns=[];g.forEach(src=>{const l=clone(src);l.id=S.uid++;l.name+=' cópia';l.items.forEach(it=>{it.id=S.uid++});S.layers.splice(S.layers.indexOf(src)+1,0,l);ns.push(l)});S.lsel=new Set(ns.map(l=>l.id));S.cur=S.layers.indexOf(ns[0]);commit()};
const imgRel=im=>!!(im.rl&&S.layers.some(l=>l.id===im.rl));
function imgBox(im){const W=im.el.width*im.s,H=im.el.height*(im.sy||im.s);return{W,H,cx:im.x+W/2,cy:im.y+H/2,th:(im.r||0)*Math.PI/180}}
const imgFrame=im=>{const b=imgBox(im);return{cx:b.cx,cy:b.cy,th:b.th,hw:Math.max(b.W/2,.5),hh:Math.max(b.H/2,.5)}};
function imgDown(raw,e){if(e.altKey)return false;const im=S.imgSel,f=imgFrame(im),fh=frameHit(f,raw),init={x:im.x,y:im.y,s:im.s,sy:im.sy||im.s,r:im.r||0};
 if(fh){S.drag={img:1,im,f,fh,init,start:raw,moved:0};return true}
 if(S.tool==='V'||S.tool==='H'){const l=toLoc(f,raw);if(Math.abs(l[0])<=f.hw&&Math.abs(l[1])<=f.hh){S.drag={img:1,im,f,mvi:1,init,start:raw,moved:0};return true}}return false}
function imgMove(d,raw,e){const im=d.im,i0=d.init;
 if(d.mvi){let dx=raw[0]-d.start[0],dy=raw[1]-d.start[1];if(snapOn()){dx=snapV(i0.x+dx)-i0.x;dy=snapV(i0.y+dy)-i0.y}im.x=R2(i0.x+dx);im.y=R2(i0.y+dy)}
 else if(d.fh.rot){const f=d.f,a0=Math.atan2(d.start[1]-f.cy,d.start[0]-f.cx);let da=Math.atan2(raw[1]-f.cy,raw[0]-f.cx)-a0;if(e.shiftKey)da=Math.round(da/(Math.PI/12))*(Math.PI/12);im.r=R2(i0.r+da*180/Math.PI)}
 else{const f=d.f,hs=HP[d.fh.h],corner=hs[0]!==0&&hs[1]!==0,M=scaleM(f,hs,toLoc(f,raw),e.altKey,corner&&!e.shiftKey),ux=[Math.cos(f.th),Math.sin(f.th)],uy=[-Math.sin(f.th),Math.cos(f.th)],mx=A.lin(M,ux),my=A.lin(M,uy),
   kx=Math.max(.02,mx[0]*ux[0]+mx[1]*ux[1]),ky=Math.max(.02,my[0]*uy[0]+my[1]*uy[1]),c=A.pt(M,[f.cx,f.cy]),W=f.hw*2*kx,H=f.hh*2*ky;im.s=i0.s*kx;im.sy=i0.sy*ky;im.x=R2(c[0]-W/2);im.y=R2(c[1]-H/2)}
 d.moved=1}
function selImg(im){S.imgSel=im||null;if(im){if(S.mode!=='draw')toast('Volte ao modo Desenhar para editar a imagem');else toast('Arraste para mover · alças redimensionam/giram (Shift = livre/15°) · Alt+clique ignora a imagem · Esc solta')}imgsUI();dirty=1}
$('imgadd').onchange=e=>{[...e.target.files].forEach(f=>{const r=new FileReader();r.onload=()=>addImg(f.name,r.result);r.readAsDataURL(f)});e.target.value=''};
function addImg(name,src,o){const el=new Image();el.onload=()=>{dirty=1};el.src=src;const im={name,src,el,x:0,y:0,s:1,op:.5,vis:1,r:0,...o};S.imgs.push(im);if(!o)S.imgSel=im;imgsUI()}
function imgsUI(){$('imgs').innerHTML=S.imgs.map((m,i)=>`<li class="${S.imgSel===m?'selimg':''}"><img src="${m.src}" alt=""><span>${esc(m.name)}</span><button class="btn2 ${S.imgSel===m?'on':''}" data-a="s" data-i="${i}" title="Selecionar no canvas (mover, girar, redimensionar)">${ic('mouse-pointer-2',14)}</button><button class="btn2 ${m.vis?'':'off'}" data-a="v" data-i="${i}" title="Visível">${ic(m.vis?'eye':'eye-off',14)}</button><button class="btn2" data-a="u" data-i="${i}" title="Subir">${ic('chevron-up',14)}</button><button class="btn2" data-a="d" data-i="${i}" title="Descer">${ic('chevron-down',14)}</button><button class="btn2 dn" data-a="x" data-i="${i}" title="Remover">${ic('trash-2',14)}</button>
<div class="ip"><input type="range" min="0" max="1" step=".05" value="${m.op}" data-k="op" data-i="${i}" title="opacidade"><input type="number" data-k="x" value="${R2(m.x)}" data-i="${i}" title="x"><input type="number" data-k="y" value="${R2(m.y)}" data-i="${i}" title="y"><input type="number" step=".05" data-k="s" value="${R2(m.s)}" data-i="${i}" title="escala"><input type="number" data-k="r" value="${R2(m.r||0)}" data-i="${i}" title="rotação (°)"></div><div class="ip rel"><span class="rl2" title="Posição em relação a uma camada de desenho">${ic('layers-2',13)}</span><select data-k="rp" data-i="${i}" title="Fica acima ou abaixo da camada escolhida" ${imgRel(m)?'':'disabled'}><option value="a" ${m.rp!=='b'?'selected':''}>Acima de</option><option value="b" ${m.rp==='b'?'selected':''}>Abaixo de</option></select><select data-k="rl" data-i="${i}" title="Camada de desenho de referência"><option value="0">- atrás de todas as camadas -</option>${S.layers.slice().reverse().map(l=>`<option value="${l.id}" ${m.rl===l.id?'selected':''}>${esc(l.name)}</option>`).join('')}</select></div></li>`).join('')||'<li class="empty" style="cursor:default;display:block">Nenhuma imagem</li>'}
$('imgs').onclick=e=>{const b=e.target.closest('button');if(!b)return;const i=+b.dataset.i,a=b.dataset.a,l=S.imgs;if(a==='s'){selImg(S.imgSel===l[i]?null:l[i]);return}if(a==='v')l[i].vis^=1;else if(a==='x'){if(S.imgSel===l[i])S.imgSel=null;l.splice(i,1)}else if(a==='u'&&i<l.length-1)[l[i],l[i+1]]=[l[i+1],l[i]];else if(a==='d'&&i>0)[l[i],l[i-1]]=[l[i-1],l[i]];imgsUI();dirty=1};
$('imgs').oninput=e=>{const t=e.target;if(!t.dataset.k)return;const m=S.imgs[+t.dataset.i];if(t.dataset.k==='rp'){m.rp=t.value;dirty=1;return}if(t.dataset.k==='rl'){m.rl=+t.value||0;if(!m.rp)m.rp='a';imgsUI();dirty=1;return}m[t.dataset.k]=+t.value;if(t.dataset.k==='s')m.sy=m.s;dirty=1};
let assets=JSON.parse(localStorage.athelis_assets||'[]'),afolders=JSON.parse(localStorage.athelis_afold||'[]');
const fid=()=>'f'+Date.now().toString(36)+Math.floor(Math.random()*1e4).toString(36);
function makeThumb(items,size=128){const segs=(items||[]).flatMap(it=>it.k==='s'?[it]:segsOf(it));if(!segs.length)return'';let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;segs.forEach(q=>{const m=q.w/2;x0=Math.min(x0,q.a[0]-m,q.b[0]-m);x1=Math.max(x1,q.a[0]+m,q.b[0]+m);y0=Math.min(y0,q.a[1]-m,q.b[1]-m);y1=Math.max(y1,q.a[1]+m,q.b[1]+m)});
 const bw=Math.max(1,x1-x0),bh=Math.max(1,y1-y0),pad=6,s=Math.min((size-pad*2)/bw,(size-pad*2)/bh,4),c=document.createElement('canvas');c.width=Math.max(1,Math.ceil(bw*s+pad*2));c.height=Math.max(1,Math.ceil(bh*s+pad*2));const g=c.getContext('2d');g.translate(pad-x0*s,pad-y0*s);g.scale(s,s);g.lineCap='round';
 [0,1].forEach(fg=>segs.forEach(q=>{if(q.fg!==fg)return;g.globalAlpha=q.al;g.strokeStyle='#'+q.c;g.lineWidth=Math.max(q.w,1/s);g.beginPath();g.moveTo(q.a[0],q.a[1]);g.lineTo(q.b[0],q.b[1]);g.stroke()}));try{return c.toDataURL('image/png')}catch(e){return''}}
assets.forEach(a=>{if(!a.thumb)a.thumb=makeThumb(a.items)});
const folderOf=id=>afolders.find(f=>f.id===id),isDesc=(id,anc)=>{for(let f=folderOf(id);f;f=folderOf(f.p)){if(f.id===anc)return true}return false};
function aHTML(pid,depth){let h='';afolders.filter(f=>(f.p||null)===pid).forEach(f=>{const n=assets.filter(a=>a.g===f.id).length,op=f.open!==false;
  h+=`<div class="afo ${S.afo===f.id?'sel':''}" data-fid="${f.id}" draggable="true" style="margin-left:${depth*10}px"><span data-act="ftog" class="chev">${ic(op?'chevron-down':'chevron-right',13)}</span>${ic(op?'folder-open-2':'folder',15)}<b>${esc(f.n)}</b><span class="cnt">${n}</span><button class="btn2" data-act="fren" title="Renomear">${ic('pencil',12)}</button><button class="btn2 dn" data-act="fdel" title="Excluir pasta (o conteúdo sobe um nível)">${ic('trash-2',12)}</button></div>`;if(op)h+=aHTML(f.id,depth+1)});
 const as=assets.map((a,i)=>[a,i]).filter(([a])=>(a.g||null)===pid);
 if(as.length)h+=`<div class="agrid ${pid?'':'root'}" style="margin-left:${pid?depth*10+4:0}px">`+as.map(([a,i])=>`<div class="acard" data-i="${i}" draggable="true" title="${esc(a.n)} - clique e depois no desenho; Shift+clique insere como camada"><div class="tb">${a.thumb?`<img src="${a.thumb}" alt="">`:ic('layers-2',24)}</div><div class="an">${esc(a.n)}</div><small>${(a.items||[]).length} itens</small><div class="acts"><button class="btn2" data-act="aadd" title="Inserir como camada">${ic('plus',13)}</button><button class="btn2" data-act="aren" title="Renomear">${ic('pencil',12)}</button><button class="btn2 dn" data-act="adel" title="Excluir">${ic('trash-2',12)}</button></div></div>`).join('')+'</div>';
 return h}
function assetsUI(){const f=folderOf(S.afo);if(!f)S.afo=null;$('asfn').textContent='Salvando em: '+(f?f.n:'raiz');
 $('assets').innerHTML=(afolders.length||assets.length)?`<div class="aroot" data-root="1">${aHTML(null,0)}</div>`:'<div class="empty">Nenhum asset salvo.<br>Salve uma camada ou a seleção; crie pastas para organizar.</div>';
 try{localStorage.athelis_assets=JSON.stringify(assets);localStorage.athelis_afold=JSON.stringify(afolders)}catch(e){toast('Armazenamento do navegador cheio: exporte os assets')}markArmed()}
const selItems=()=>{const o=[];S.layers.forEach(l=>l.items.forEach(it=>{if(it.k==='h'?S.sel.items.has(it):(S.sel.pts.has(it.a)&&S.sel.pts.has(it.b)))o.push(it)}));return o};
function saveAsset(items,nm){if(!items.length){toast('Nada para salvar');return}const its=clone(items);assets.push({n:nm||'Asset '+(assets.length+1),items:its,thumb:makeThumb(its),g:S.afo||null});$('asn').value='';assetsUI()}
$('assave').onclick=()=>saveAsset(L().items,$('asn').value||L().name);$('assel').onclick=()=>saveAsset(selItems(),$('asn').value||'Seleção');
$('asfold').onclick=()=>{const n=prompt('Nome da pasta','Nova pasta');if(!n)return;const f={id:fid(),n,p:S.afo||null,open:true};afolders.push(f);S.afo=f.id;assetsUI()};
$('assets').onclick=e=>{const b=e.target.closest('button'),card=e.target.closest('.acard'),fo=e.target.closest('.afo');
 if(card){const i=+card.dataset.i;if(b){const a=b.dataset.act;e.stopPropagation();if(a==='adel'){if(S.place&&S.place.kind==='A')cancelPlace();assets.splice(i,1);assetsUI()}else if(a==='aren'){const n=prompt('Nome do asset',assets[i].n);if(n){assets[i].n=n;assetsUI()}}else if(a==='aadd')insertAssetLayer(i);return}
  if(e.shiftKey){insertAssetLayer(i);return}if(S.mode!=='draw'){toast('Volte ao modo Desenhar para posicionar o asset');return}armPlace('A',i);return}
 if(fo){const id=fo.dataset.fid,f=folderOf(id),a=b&&b.dataset.act||(e.target.closest('[data-act=ftog]')?'ftog':'');
  if(a==='fdel'){afolders.forEach(x=>{if(x.p===id)x.p=f.p||null});assets.forEach(x=>{if(x.g===id)x.g=f.p||null});afolders=afolders.filter(x=>x!==f);if(S.afo===id)S.afo=f.p||null}
  else if(a==='fren'){const n=prompt('Nome da pasta',f.n);if(n)f.n=n}else if(a==='ftog')f.open=f.open===false;else{S.afo=S.afo===id?null:id}assetsUI();return}
 if(e.target.closest('.aroot')&&!card){S.afo=null;assetsUI()}};
function insertAssetLayer(i){const l=newLayer(assets[i].n);l.items=clone(assets[i].items||[]);l.items.forEach(it=>it.id=S.uid++);S.layers.splice(S.cur+1,0,l);S.cur++;commit()}
let adr=null;const aclr=()=>$('assets').querySelectorAll('.over').forEach(x=>x.classList.remove('over'));
$('assets').addEventListener('dragstart',e=>{const c=e.target.closest('.acard'),f=e.target.closest('.afo');adr=c?{a:+c.dataset.i}:f?{f:f.dataset.fid}:null;if(adr){e.dataTransfer.setData('text/plain','athelis');e.dataTransfer.effectAllowed='move';(c||f).classList.add('drag')}});
$('assets').addEventListener('dragend',()=>{adr=null;aclr();$('assets').querySelectorAll('.drag').forEach(x=>x.classList.remove('drag'))});
$('assets').addEventListener('dragover',e=>{if(!adr)return;const t=e.target.closest('.afo')||e.target.closest('.aroot');if(!t)return;e.preventDefault();aclr();t.classList.add('over')});
$('assets').addEventListener('drop',e=>{if(!adr)return;const fo=e.target.closest('.afo'),dst=fo?fo.dataset.fid:null;e.preventDefault();
 if(adr.a!==undefined)assets[adr.a].g=dst;else if(adr.f&&adr.f!==dst&&!(dst&&isDesc(dst,adr.f)))folderOf(adr.f).p=dst;adr=null;assetsUI()});
$('asexp').onclick=()=>dl('athelis-assets.json',JSON.stringify({v:2,folders:afolders,assets}));
$('asimp').onclick=()=>pick(t=>{let o;try{o=JSON.parse(t)}catch(e){alert('Arquivo inválido');return}const list=Array.isArray(o)?o:(o.assets||[]),fl=Array.isArray(o)?[]:(o.folders||[]),map={};
 fl.forEach(f=>{map[f.id]=fid()});fl.forEach(f=>afolders.push({id:map[f.id],n:f.n,p:f.p?map[f.p]||null:null,open:true}));
 list.forEach(a=>{a.g=a.g&&map[a.g]?map[a.g]:null;if(!a.thumb)a.thumb=makeThumb(a.items);assets.push(a)});assetsUI();toast(list.length+' assets importados')});
function ssDist(a,b,c,d){const d1=(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]),d2=(b[0]-a[0])*(d[1]-a[1])-(b[1]-a[1])*(d[0]-a[0]),d3=(d[0]-c[0])*(a[1]-c[1])-(d[1]-c[1])*(a[0]-c[0]),d4=(d[0]-c[0])*(b[1]-c[1])-(d[1]-c[1])*(b[0]-c[0]);
 if(d1*d2<0&&d3*d4<0)return 0;return Math.min(segDist(a,c,d),segDist(b,c,d),segDist(c,a,b),segDist(d,a,b))}
const spOpts=()=>({mode:$('sp_mode').value,tol:Math.max(0,+$('sp_tol').value||0),min:Math.max(1,Math.round(+$('sp_min').value||1)),coh:cclamp((+$('sp_coh').value||0)/100,0,1),det:cclamp((+$('sp_det').value||0)/100,0,.5),scn:$('sp_scn')?$('sp_scn').value:'parts',ct:cclamp(+$('sp_ct').value||0,0,80),fth:Math.max(14,(+$('sp_ct').value||0)*2.5)});
function collectUnits(layers){const U=[];layers.forEach(l=>{if(!l||!l.vis||l.lock)return;l.items.forEach(it=>{const sg=it.k==='s'?[it]:segsOf(it);if(sg.length)U.push({it,l,segs:sg,z:S.layers.indexOf(l)*1e6+U.length})})});return U}
const dsu=n=>{const p=Int32Array.from({length:n},(_,i)=>i),find=x=>{while(p[x]!==x){p[x]=p[p[x]];x=p[x]}return x};return{find,uni:(a,b)=>{a=find(a);b=find(b);if(a!==b)p[a]=b}}};
function contactPairs(A,tol,cb){const cs=Math.max(16,tol*2+16),grid=new Map(),big=[];
 A.forEach((s,i)=>{const m=tol+s.w/2+1,x0=Math.floor((Math.min(s.a[0],s.b[0])-m)/cs),x1=Math.floor((Math.max(s.a[0],s.b[0])+m)/cs),y0=Math.floor((Math.min(s.a[1],s.b[1])-m)/cs),y1=Math.floor((Math.max(s.a[1],s.b[1])+m)/cs);
  if((x1-x0+1)*(y1-y0+1)>900){big.push(i);return}for(let x=x0;x<=x1;x++)for(let y=y0;y<=y1;y++){const k=(x+32768)*65536+(y+32768);let c=grid.get(k);if(!c)grid.set(k,c=[]);c.push(i)}});
 const test=(i,j)=>{const s=A[i],t=A[j];if(ssDist(s.a,s.b,t.a,t.b)<=tol+(s.w+t.w)/2)cb(i,j)},seen=new Set();
 grid.forEach(c=>{for(let i=0;i<c.length;i++)for(let j=i+1;j<c.length;j++){const a=c[i]<c[j]?c[i]:c[j],b=c[i]<c[j]?c[j]:c[i],k=a*A.length+b;if(seen.has(k))continue;seen.add(k);test(a,b)}});
 big.forEach(i=>{for(let j=0;j<A.length;j++)if(j!==i)test(i,j)})}
const bbOf=us=>{let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9,n=0;us.forEach(u=>{n+=u.segs.length;u.segs.forEach(q=>{x0=Math.min(x0,q.a[0],q.b[0]);x1=Math.max(x1,q.a[0],q.b[0]);y0=Math.min(y0,q.a[1],q.b[1]);y1=Math.max(y1,q.a[1],q.b[1])})});return{n,x0,y0,x1,y1}};
const smartAnalyze=(U,o)=>SmartVec.analyze(U,o);
function colorMapFor(U,tol){const cs=[],ws=[];U.forEach(u=>u.segs.forEach(q=>{cs.push(q.c);ws.push(Math.hypot(q.a[0]-q.b[0],q.a[1]-q.b[1])*q.w+1)}));const r=SmartSeg.colorClasses(cs,ws,tol);return{id:c=>r.map.get(c),hex:c=>r.leaders[r.map.get(c)].c}}
function clusterUnits(U,o){if(o.mode==='smart')return smartAnalyze(U,o);const n=U.length,D=dsu(n),cm=colorMapFor(U,o.ct||0);
 if(o.mode==='color'||o.mode==='style'){const m=new Map();U.forEach((u,i)=>{const q=u.segs[0],k=o.mode==='color'?cm.id(q.c):cm.id(q.c)+'|'+q.w;if(m.has(k))D.uni(i,m.get(k));else m.set(k,i)})}
 else{const same=o.mode==='colorconn',A=[],own=[];U.forEach((u,ui)=>u.segs.forEach(s=>{A.push(s);own.push(ui)}));contactPairs(A,o.tol,(i,j)=>{if(own[i]===own[j])return;if(same&&cm.id(A[i].c)!==cm.id(A[j].c))return;D.uni(own[i],own[j])})}
 const g=new Map();U.forEach((u,i)=>{const r=D.find(i);(g.get(r)||g.set(r,[]).get(r)).push(u)});
 const out=[...g.values()].map(us=>({us,...bbOf(us),lc:cm.hex(us[0].segs[0].c)}));out.sort((a,b)=>(Math.round(a.y0/20)-Math.round(b.y0/20))||(a.x0-b.x0));return out}
const segCopy=(q,id)=>({k:'s',id,a:q.a.slice(),b:q.b.slice(),c:q.c,w:q.w,al:q.al,fg:q.fg});
function explodeLayers(ls,kinds){ls.forEach(l=>{if(l&&!l.lock)l.items=l.items.flatMap(it=>it.k==='s'||(kinds&&!kinds.includes(it.t))?[it]:segsOf(it).map(q=>segCopy(q,S.uid++)))})}
function splitElements(){const o=spOpts(),cur=L(),scope=$('sp_src').value==='all'?S.layers.filter(l=>l.vis&&!l.lock):[cur];if(!cur||!scope.length||(scope.length===1&&(cur.lock||!cur.vis))){hint('Camada oculta ou travada');return}
 if($('sp_expl').checked)explodeLayers(scope);else if(o.mode==='smart')explodeLayers(scope,['I','T']);
 const cl=clusterUnits(collectUnits(scope),o),ok=cl.filter(c=>c.n>=o.min);
 if(ok.length<2){toast(cl.length<2?'Só existe 1 elemento, nada para separar':'Elementos pequenos demais (reduza "Mín. de linhas")');commit();return}
 if(ok.length>150&&!confirm('Isso vai criar '+ok.length+' camadas. Continuar?'))return;
 const moved=new Set(),nl=[];ok.forEach((c,i)=>{const q=c.us[0].segs[0],l=newLayer(c.nm||(o.mode==='color'||o.mode==='style'?'Cor #'+(c.lc||q.c)+(o.mode==='style'?' · '+q.w+'px':''):'Elemento '+(i+1)));c.us.forEach(u=>{l.items.push(u.it);moved.add(u.it)});nl.push(l)});
 scope.forEach(l=>{l.items=l.items.filter(it=>!moved.has(it))});const at=S.layers.indexOf(cur)+1;S.layers.splice(at,0,...(o.mode==='smart'?nl:nl.reverse()));
 for(let i=S.layers.length-1;i>=0;i--){const l=S.layers[i];if(scope.includes(l)&&!l.items.length&&S.layers.length>1)S.layers.splice(i,1)}
 S.cur=Math.max(0,Math.min(S.layers.length-1,S.layers.indexOf(nl[o.mode==='smart'?nl.length-1:0])));selClear();S.smartC=null;commit();toast(ok.length+' elementos separados em camadas'+(o.mode==='smart'?' ('+ok.filter(c=>c.kind==='scenery').length+' cenário)':''))}
$('lsplit').onclick=splitElements;
const selUnit=u=>{if(u.it.k==='h')S.sel.items.add(u.it);else{S.sel.pts.add(u.it.a);S.sel.pts.add(u.it.b)}};
const unitSel=u=>u.it.k==='h'?S.sel.items.has(u.it):(S.sel.pts.has(u.it.a)&&S.sel.pts.has(u.it.b));
function smartCache(o){const key=rev+'|'+o.mode+'|'+o.tol+'|'+o.coh+'|'+o.det+'|'+o.scn+'|'+o.ct+'|'+S.layers.length;
 if(!S.smartC||S.smartC.key!==key){const map=new Map(),cmp=new Map();const U=collectUnits(S.layers);const res=clusterUnits(U,o);res.forEach(c=>c.us.forEach(u=>map.set(u.it,c)));if(o.mode==='smart')new Set(map.values()).forEach(c=>{let a=cmp.get(c.comp);if(!a)cmp.set(c.comp,a=[]);a.push(c)});S.smartC={key,o,map,cmp,res,lv:[{map,list:[...new Set(map.values())]},null,null],list:[...new Set(map.values())]}}
 return S.smartC}
const LVF=[1,.72,.48],LVN=['elemento','grupo maior','grupo amplo'];
function smartLevel(k){const C=S.smartC;if(!C.lv[k]){const base=C.res,out=(base&&base.lvl)?base.lvl(base.thr*LVF[k]):(k?clusterUnits(collectUnits(S.layers),{...C.o,coh:C.o.coh*[1,.85,.7][k]}):base),map=new Map();out.forEach(c=>c.us.forEach(u=>map.set(u.it,c)));C.lv[k]={map,list:out}}return C.lv[k]}
let shT=0;
function smartHover(raw){if(!S.smart||S.tool!=='V'||S.mode!=='draw'||S.drag||S.place||!$('sp_hov').checked){if(S.shov){S.shov=null;dirty=1}return}
 const now=performance.now();if(now-shT<60)return;shT=now;const h=hitItem(raw);if(!h){if(S.shov){S.shov=null;dirty=1}return}
 const o=spOpts(),it=h.it;let sv=null;
 if(o.mode==='smart'&&it.k==='h'&&(it.t==='I'||it.t==='T')){let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;segsOf(it).forEach(s=>{x0=Math.min(x0,s.a[0],s.b[0]);x1=Math.max(x1,s.a[0],s.b[0]);y0=Math.min(y0,s.a[1],s.b[1]);y1=Math.max(y1,s.a[1],s.b[1])});sv={bb:[x0,y0,x1,y1],kind:'element',nm:(it.t==='I'?'Imagem':'Texto')+': clique para converter em linhas'}}
 else{const c=smartCache(o).map.get(it);if(c)sv={bb:[c.x0,c.y0,c.x1,c.y1],kind:c.kind||'element',nm:(c.nm||'Elemento')+' · '+c.n+(c.n===1?' linha':' linhas'),us:c.us,n:c.n}}
 S.shov=sv;dirty=1}
function smartSelect(h,shift,raw){const o=spOpts();let it=h.it;
 if(o.mode==='smart'&&it.k==='h'&&(it.t==='I'||it.t==='T')&&h.l&&!h.l.lock){explodeLayers([h.l],[it.t]);S.smartC=null;snap();const h2=raw?hitItem(raw):null;if(!h2){ui();return}h=h2;it=h.it;toast('Imagem/texto convertido em linhas livres para selecionar o elemento')}
 smartCache(o);
 const c0=S.smartC.map.get(it);if(!c0){selectHit(h,shift);return}
 const i=S.layers.indexOf(h.l);
 if(o.mode!=='smart'){const all=c0.us.every(unitSel)&&!shift;if(!shift)selClear();c0.us.forEach(selUnit);toast((c0.nm?c0.nm+': ':'Elemento: ')+c0.n+' linhas');if(i>=0)S.cur=i;return}
 if(shift){c0.us.forEach(selUnit);toast((c0.nm||'Elemento')+': '+c0.n+' linhas (somado)');if(i>=0)S.cur=i;return}
 let pick=null,pk=0,prev=-1;
 for(let k=0;k<3;k++){const ck=smartLevel(k).map.get(it);if(!ck)break;if(ck.us.length===prev)continue;prev=ck.us.length;if(!ck.us.every(unitSel)){pick=ck;pk=k;break}}
 if(pick){selClear();pick.us.forEach(selUnit);toast((pick.nm||'Elemento')+' · '+pick.n+' linhas · '+LVN[pk]+(pk<2?', clique de novo para crescer':', clique de novo para o conjunto'))}
 else{const grp=S.smartC.cmp.get(c0.comp);selClear();if(grp&&grp.length>=1){let n=0;grp.forEach(e=>e.us.forEach(u=>{selUnit(u);n+=u.segs.length}));toast('Conjunto conectado: '+grp.length+' elementos · '+n+' linhas')}}
 if(i>=0)S.cur=i}
$('lsmart').onclick=()=>{S.smart=!S.smart;S.shov=null;$('lsmart').classList.toggle('on',S.smart);if(S.smart){if(S.tool!=='V')setTool('V');toast('Seletor inteligente ligado: clique numa linha (V). Clique de novo para expandir ao conjunto.')}};
function ctReadout(){const e=$('sp_ctn');if(!e)return;try{const cur=L(),scope=$('sp_src').value==='all'?S.layers.filter(l=>l.vis&&!l.lock):(cur?[cur]:[]),U=collectUnits(scope),raw=new Set();U.forEach(u=>u.segs.forEach(q=>raw.add(q.c)));if(!raw.size){e.textContent='';return}const cm=colorMapFor(U,cclamp(+$('sp_ct').value||0,0,80)),g=new Set();raw.forEach(c=>g.add(cm.id(c)));e.textContent=raw.size+' cores diferentes → '+g.size+' grupo'+(g.size===1?'':'s')+' com essa tolerância'}catch(_){e.textContent=''}}
$('sp_mode').onchange=()=>{const m=$('sp_mode').value;document.querySelectorAll('#w-layers [data-sm]').forEach(e=>e.hidden=m!=='smart');document.querySelectorAll('#w-layers [data-ct]').forEach(e=>e.hidden=!(m==='smart'||m==='color'||m==='style'||m==='colorconn'));S.smartC=null;ctReadout();dirty=1};$('sp_mode').onchange();
$('sp_ct').addEventListener('input',()=>{S.smartC=null;ctReadout();dirty=1});$('sp_src').addEventListener('change',ctReadout);$('sp_map').addEventListener('change',()=>{dirty=1});$('sp_coh').addEventListener('input',()=>{S.smartC=null;dirty=1});$('sp_det').addEventListener('input',()=>{S.smartC=null;dirty=1});
['sp_tol','sp_coh','sp_det','sp_scn'].forEach(id=>$(id).addEventListener('change',()=>{S.smartC=null}));
$('lmove').onclick=()=>{const nl=newLayer('Seleção');let n=0;S.layers.forEach(l=>{if(l.lock)return;const mv=l.items.filter(it=>it.k==='h'?S.sel.items.has(it):(S.sel.pts.has(it.a)&&S.sel.pts.has(it.b)));if(!mv.length)return;const set=new Set(mv);l.items=l.items.filter(it=>!set.has(it));nl.items.push(...mv);n+=mv.length});
 if(!n){toast('Selecione algo primeiro');return}S.layers.splice(S.cur+1,0,nl);S.cur++;S.exp.add('L'+nl.id);commit();toast(n+' itens movidos para uma nova camada')};
function ptGroupUpd(){const it=ptSel();$('sb-pts').hidden=!it;if(!it)S.ptMode='m';['m','a','d','t'].forEach(k=>$('sb-p'+k).classList.toggle('on',S.ptMode===k))}
['m','a','d','t'].forEach(k=>$('sb-p'+k).onclick=()=>{S.ptMode=k;ptGroupUpd();hint(k==='a'?'Adicionar ponto: clique na linha (ou duplo clique)':k==='t'?'Reta/curva: clique num ponto para alternar entre ponto reto e ponto curvo':k==='d'?'Remover pontos: clique num ponto da forma (Ctrl+clique também remove)':HINT[S.tool]);dirty=1});
addEventListener('keydown',e=>{if(e.key==='Control'&&!S.ctrl&&S.mode==='draw'&&S.tool==='Q'&&S.pts.length){const la=S.pts[S.pts.length-1];if(la.ho&&Math.hypot(la.ho[0],la.ho[1])>.01&&!(S.drag&&S.drag.qd)){if(la.hn)delete la.hn;else la.hn=[0,0];dirty=1;hint(la.hn?'Próximo segmento reto (Ctrl volta a curvar)':'Próximo segmento curvo (Ctrl deixa reto)')}}if(e.key==='Control'&&!S.ctrl){S.ctrl=true;if(ptSel()){dirty=1;hint('Ctrl: clique num ponto para removê-lo')}}});addEventListener('keyup',e=>{if(e.key==='Control'){S.ctrl=false;dirty=1;if(ptSel())hint(HINT[S.tool])}});addEventListener('blur',()=>{S.ctrl=false});
function selbarUpd(){const has=(S.mode==='draw'&&selCount()>0)||(S.mode==='map'&&msList().length>0);$('selbar').hidden=!has;$('sb-join').hidden=S.mode!=='draw';$('sb-join').previousElementSibling.hidden=S.mode!=='draw';if(!has)closePop();ptGroupUpd();return has}
function ui(){const has=selbarUpd();$('selc').textContent=selCount()?`(${S.sel.items.size} formas, ${S.sel.pts.size} pts)`:'';layersUI();syncProps();mapUI(1);xmlSoon();CA.sync();dirty=1}
let xT=0; 
window.__xmlReady=1;let xHeavy=0;function xmlSoon(){if(xT)return;xT=setTimeout(()=>{xT=0;if(S.drag&&xHeavy>40){xmlSoon();return}const t0=performance.now();xml();xHeavy=performance.now()-t0},110)}
const TF=[['text','t_text','s'],['font','t_font','s'],['size','t_size','n'],['lh','t_lh','n'],['align','t_align','s'],['out','t_out','b'],['ow','t_ow','i'],['oc','t_oc','c'],['eps','t_eps','n'],['fill','t_fill','b'],['fw','t_fw','i'],['fa','t_fa','n'],['auto','t_auto','b'],['af','t_af','n'],['hs','t_hs','n'],['fx','t_fx','b'],['inset','t_inset','n'],['min','t_min','n'],['budget','t_budget','n'],['sys','t_sys','s'],['top','t_top','s'],['dp','t_dp','n'],['rd','t_rd','n'],['rn','t_rn','n'],['ls','t_ls','n'],['fm','t_fm','s'],['fc','t_fc','c'],['pol','t_pol','b'],['ca','t_ca','n'],['lf','t_lf','s']];
const fcUser=()=>$('t_fc').dataset.u==='1';
function fcFollow(){if(!fcUser()){$('t_fc').value=$('t_lc').value=$('col').value}}
$('t_fc').addEventListener('input',()=>{$('t_fc').dataset.u='1';$('t_lc').value=$('t_fc').value});
$('t_lc').addEventListener('input',()=>{$('t_fc').value=$('t_lc').value;$('t_fc').dispatchEvent(new Event('input'))});
$('t_lc').addEventListener('change',()=>$('t_fc').dispatchEvent(new Event('change')));
$('col').addEventListener('input',fcFollow);
const readTx=()=>{const o={};TF.forEach(([k,id,t])=>o[k]=rv(id,t));if(!fcUser())o.fc='';return o};
function writeTx(tx){tx={...Text.DEF,...tx};if(tx.fc){$('t_fc').dataset.u='1';$('t_fc').value=$('t_lc').value='#'+tx.fc}else{delete $('t_fc').dataset.u;fcFollow()}TF.forEach(([k,id,t])=>{if(k==='fc'||tx[k]===undefined)return;const e=$(id);if(k==='font'&&![...e.options].some(o=>o.value===tx.font))e.add(new Option(tx.font,tx.font));if(t==='b')e.checked=!!tx[k];else if(t==='c')e.value='#'+tx[k];else e.value=tx[k]});tSync()}
const txtTarget=()=>{if(S.sel.items.size===1&&!S.sel.pts.size){const it=[...S.sel.items][0];if(it.t==='T')return it}return null};
function txtInfo(it){$('t_info').textContent=it?(()=>{const r=Text.base(it);return`Editando texto selecionado · ${r.n} linhas · ≈${(r.n*.056).toFixed(1)} KB`+(it.tx.sys==='l'?'':` · ε ${R2(r.eps)} px · espaç. ${R2(r.sp)} px`)})():'Selecione um texto na camada para editar (as mudanças são ao vivo).'}
const FONTS=['Arial','Georgia','Impact','Courier New','Comic Sans MS','Times New Roman','Verdana','Trebuchet MS','Tahoma','Palatino Linotype','Lucida Console'];
function fillFonts(extra){const s=$('t_font'),cur=s.value;s.innerHTML='';[...FONTS,...S.fonts.map(f=>f.name),...(extra||[])].filter((v,i,a)=>a.indexOf(v)===i).forEach(f=>s.add(new Option(f,f)));s.value=cur||'Arial'}
function tSync(){$('t_rdv').textContent=$('t_rd').value+'%';const sys=$('t_sys').value,en=(id,on)=>{$(id).disabled=!on;const l=$(id).closest('label');if(l)l.classList.toggle('dis',!on)};
 document.querySelectorAll('#w-text [data-sys]').forEach(e=>e.hidden=e.dataset.sys!==sys);$('t_owl').textContent=sys==='l'?'Tamanho':'Largura';
 $('t_ow').closest('label').title=sys==='l'?'Tamanho do contorno: soma à largura da linha. O contorno fica no fundo, com a mesma forma da letra e outra cor.':'Largura das linhas do contorno da fonte.';
 const out=$('t_out').checked,fill=$('t_fill').checked,au=$('t_auto').checked;en('t_ow',out);en('t_oc',out);en('t_eps',out||fill);['t_fw','t_fa','t_auto','t_fx','t_inset'].forEach(i=>en(i,fill||i==='t_fw'));en('t_af',fill&&au);en('t_fc',fill);en('t_fm',fill);en('t_ca',$('t_pol').checked);en('t_hs',fill&&!au);en('t_top',out&&fill)}
let tT=0;TF.forEach(([k,id])=>{const fn=()=>{tSync();const tg=txtTarget();if(!tg)return;clearTimeout(tT);tT=setTimeout(()=>{tg.tx=readTx();touch(tg);dirty=1;txtInfo(tg);xmlSoon()},180)};$(id).addEventListener('input',fn);$(id).addEventListener('change',()=>{fn();setTimeout(()=>{snap();layersUI()},260)})});
$('t_preset').onchange=()=>{const p={q:{eps:.12,af:.8,dp:2},b:{eps:.3,af:.95,dp:1},e:{eps:.8,af:1.15,dp:0}}[$('t_preset').value];if(!p)return;$('t_eps').value=p.eps;$('t_af').value=p.af;$('t_dp').value=p.dp;$('t_auto').checked=true;['t_eps','t_af','t_dp'].forEach(i=>$(i).dispatchEvent(new Event('input')))};
$('t_go').onclick=()=>{const[x,y]=centerW(),it=mkShape('T',{tx:readTx(),m:A.tr(x,y)});if(!it)return;selectOnly(it);commit()};
async function regFont(name,data){const ff=new FontFace(name,`url(${data})`);await ff.load();document.fonts.add(ff)}
$('t_fontfile').onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=async()=>{const name='F'+Date.now().toString(36),data=r.result;await regFont(name,data);S.fonts.push({name,label:f.name,data});fillFonts();$('t_font').add(new Option(f.name,name));$('t_font').value=name;$('t_font').dispatchEvent(new Event('input'))};r.readAsDataURL(f);e.target.value=''};
$('t_local').onclick=async()=>{try{const l=await queryLocalFonts();fillFonts([...new Set(l.map(f=>f.family))].sort())}catch(e){alert('Seu navegador não permite listar fontes instaladas (use Chrome/Edge) ou carregue o arquivo da fonte.')}};
const IF=[['style','i_style','s'],['w','i_w','n'],['res','i_res','n'],['k','i_k','n'],['thr','i_thr','n'],['edge','i_edge','n'],['blur','i_blur','n'],['min','i_min','n'],['eps','i_eps','n'],['inv','i_inv','b'],['bg','i_bg','s'],['bgt','i_bgt','n'],['lw','i_lw','i'],['cm','i_cm','s'],['col','i_col','c'],['out','i_out','b'],['ow','i_ow','i'],['fill','i_fill','b'],['fa','i_fa','n'],['fx','i_fx','b'],['auto','i_auto','b'],['af','i_af','n'],['hs','i_hs','n'],['budget','i_budget','n'],['dp','i_dp','n'],['opt','i_opt','b'],['smart','i_smart','b'],['pol','i_pol','n'],['cmt','i_cmt','n'],['kbb','i_kbb','n']];
const readI=()=>{const o={};IF.forEach(([k,id,t])=>o[k]=rv(id,t));return o};
const setI=p=>{Object.entries(p).forEach(([k,v])=>{const f=IF.find(x=>x[0]===k),e=$(f[1]);if(f[2]==='b')e.checked=!!v;else if(f[2]==='c')e.value='#'+v;else e.value=v});iSync()};
function iSync(){const st=$('i_style').value,en=(id,on)=>{$(id).disabled=!on;const l=$(id).closest('label');if(l)l.classList.toggle('dis',!on)};
 document.querySelectorAll('#w-i2l [data-st]').forEach(e=>e.hidden=e.dataset.st!==st);$('i_kl').textContent=st==='color'?'Cores':'Níveis';$('i_k').closest('label').hidden=st==='edge';
 en('i_ow',$('i_out').checked);en('i_cmt',$('i_opt').checked);en('i_af',$('i_auto').checked);en('i_hs',!$('i_auto').checked);en('i_col',$('i_cm').value==='fix');en('i_bgt',$('i_bg').value==='corner');en('i_fa',$('i_fill').checked);en('i_fx',$('i_fill').checked);en('i_fill',st!=='edge');en('i_out',st==='color'||st==='tone'||st==='lines')}
const IPRE={logo:{style:'color',k:6,blur:1,min:6,eps:.6,cm:'img',out:true,ow:2,fill:true,fa:45,fx:false,auto:true,af:.95,lw:2,bg:'alpha',w:260},
 foto:{style:'tone',k:5,blur:2,min:10,eps:.8,cm:'img',out:false,fill:true,fa:45,fx:false,auto:true,af:.95,lw:2,bg:'alpha',w:300},
 desenho:{style:'edge',edge:9,blur:1,min:12,eps:.7,cm:'fix',col:'ffffff',lw:2,bg:'none',w:300},
 sil:{style:'lines',k:1,thr:128,blur:1,min:12,eps:.6,cm:'fix',col:'ffffff',out:true,fill:true,fa:45,auto:true,af:.95,lw:2,ow:2,bg:'alpha',w:260},
 topo:{style:'lines',k:8,blur:3,min:20,eps:.9,cm:'img',fill:false,out:true,lw:2,bg:'none',w:300}};
$('i_preset').onchange=()=>{const p=IPRE[$('i_preset').value];if(p){setI(p);iSoon(true)}};
let iRes=null,iT=0;
function iPrev(){const c=$('i_pv'),g=c.getContext('2d'),src=I2L.src;g.clearRect(0,0,c.width,c.height);if(!src)return;const s=Math.min(c.width/src.w,c.height/src.h);c.width=Math.max(1,Math.round(src.w*s));c.height=Math.max(1,Math.round(src.h*s));c.getContext('2d').drawImage(src.cv,0,0,c.width,c.height)}
function iRun(){if(!I2L.src){toast('Carregue uma imagem primeiro');return null}const o=readI();try{iRes=I2L.run(o)}catch(e){console.error(e);$('i_info').textContent='Erro ao processar: '+e.message;return null}
 const[cx0,cy0]=centerW();iRes.cx=cx0;iRes.cy=cy0;S.i2l=iRes;$('i_info').textContent=`${iRes.n} linhas · ≈${iRes.kb.toFixed(1)} KB · ${iRes.cols} estilos de linha · ${iRes.ms} ms`+(iRes.saved>0?` · otimização: −${iRes.saved} linhas`:'')+((o.budget>0||o.kbb>0)&&iRes.spm>1?' · simplificado pelo orçamento (ε '+iRes.eps+')':'');dirty=1;return iRes}
function iSoon(force){if(!I2L.src||(!force&&!$('i_live').checked))return;clearTimeout(iT);iT=setTimeout(iRun,force?30:380)}
document.querySelector('#w-i2l').addEventListener('input',e=>{if(e.target.closest('#i_file,#i_url,#i_preset'))return;iSync();iSoon(false)});
document.querySelector('#w-i2l').addEventListener('change',e=>{if(e.target.closest('#i_file,#i_url,#i_preset'))return;iSync();iSoon(false)});
function iLoaded(sr){iPrev();$('i_src').textContent=`${sr.name} · ${sr.w}×${sr.h}px`;S.i2l=null;iSoon(true)}
const iFail=e=>toast(e&&e.message==='cors'?'O site bloqueou o acesso (CORS). Baixe a imagem e use "Do computador" ou cole com Ctrl+V.':'Não foi possível carregar a imagem');
const iFile=f=>{if(!f)return;const r=new FileReader();r.onload=()=>I2L.load(r.result,f.name).then(iLoaded).catch(iFail);r.readAsDataURL(f)};
$('i_file').onchange=e=>{iFile(e.target.files[0]);e.target.value=''};
$('i_load').onclick=()=>{const u=$('i_url').value.trim();if(!u)return;toast('Carregando…');I2L.loadURL(u).then(iLoaded).catch(iFail)};$('i_url').addEventListener('keydown',e=>{if(e.key==='Enter')$('i_load').click()});
$('i_paste').onclick=async()=>{try{const it=await navigator.clipboard.read();for(const x of it){const t=x.types.find(t=>t.startsWith('image/'));if(t){iFile(new File([await x.getType(t)],'colada.png'));return}}toast('Nenhuma imagem na área de transferência')}catch(e){toast('Use Ctrl+V com o editor em foco')}};
addEventListener('paste',e=>{if(/INPUT|TEXTAREA/.test(e.target.tagName))return;const f=[...(e.clipboardData?e.clipboardData.files:[])].find(f=>f.type.startsWith('image/'));if(f){e.preventDefault();iFile(f);toast('Imagem colada em "Imagem → linhas"')}});
$('i_run').onclick=()=>iRun();
$('i_clr').onclick=()=>{S.i2l=null;$('i_info').textContent='Prévia limpa.';dirty=1};
$('i_make').onclick=()=>{const r=(S.i2l&&I2L.src)?S.i2l:iRun();if(!r||!r.n){toast('Nada para criar');return}const l=newLayer('Imagem: '+I2L.src.name.slice(0,18)),it={k:'h',t:'I',id:S.uid++,is:r.is,pal:r.pal,m:A.tr(r.cx,r.cy),c:'ffffff',w:1,al:1,fg:0};l.items.push(it);S.layers.splice(S.cur+1,0,l);S.cur++;S.exp.add('L'+l.id);selClear();S.sel.items.add(it);S.i2l=null;commit();toast(r.n+' linhas criadas')};
function drawI2L(z){const r=S.i2l;if(!r||S.mode!=='draw')return;cx.save();cx.translate(r.cx,r.cy);cx.lineCap='round';const by=new Map();r.is.forEach(q=>{let a=by.get(q[4]);if(!a)by.set(q[4],a=[]);a.push(q)});
 by.forEach((a,pi)=>{const p=r.pal[pi];cx.strokeStyle='#'+p.c;cx.lineWidth=p.w;cx.beginPath();a.forEach(q=>{cx.moveTo(q[0],q[1]);cx.lineTo(q[2],q[3])});cx.stroke()});cx.strokeStyle='#ff4081';cx.setLineDash([4/z,3/z]);cx.lineWidth=1/z;cx.strokeRect(-r.w/2,-r.h/2,r.w,r.h);cx.restore()}
const mapList=k=>k==='S'?S.map.S:k==='O'?S.map.O:k==='I'?(S.map.I||(S.map.I=[])):k==='J'?(S.map.J||(S.map.J=[])):S.map.D;
const getP=(at,i,d='0')=>{const v=(at.P||'').split(',')[i];return v===undefined||v===''?d:v};
const setP=(at,i,v,def)=>{const a=(at.P||def).split(',');while(a.length<=i)a.push('0');a[i]=String(v);at.P=a.join(',')};
const DEFP={S:'0,0,0.3,0.2,0,0,0,0',D:'0,0',O:'0,0'};
function showMT(t){document.querySelectorAll('[data-mt]').forEach(b=>b.classList.toggle('on',b.dataset.mt===t));['cfg','item','lay'].forEach(k=>$('mt-'+k).hidden=k!==t)}
document.querySelector('.tabs2').onclick=e=>{const b=e.target.closest('[data-mt]');if(b)showMT(b.dataset.mt)};
$('modes').onclick=e=>{const b=e.target.closest('button');if(!b)return;cancelPlace();S.mode=b.dataset.m;document.querySelectorAll('#modes button').forEach(x=>x.classList.toggle('on',x===b));S.pts=[];closePop();baseUI();applyModeWins();if(S.mode==='map'){WM.focus('w-map');WM.focus('w-cat')}hint(S.mode==='map'?'Mapa: clique num item para selecionar; arraste para mover; alças redimensionam o ground. Ctrl+D duplica.':HINT[S.tool]);ui()};
const DRAW_WINS=['w-props','w-layers','w-text','w-i2l','w-shapes','w-paths','w-color','w-opt','w-imgs','w-assets'];
function applyModeWins(){const m=S.mode==='map';DRAW_WINS.forEach(id=>WM.setHidden(id,m));WM.setHidden('w-cat',!m);WM.setHidden('w-map',false)}
function attrsUI(){const at=S.map.at;$('mattrs').innerHTML=Object.keys(at).filter(k=>!CFG_KEYS.includes(k)).map(k=>`<div class="row"><input class="ak" value="${esc(k)}" style="max-width:70px"><input class="av" value="${esc(at[k])}"><button class="btn2" data-x>${ic('x',13)}</button></div>`).join('')}
function attrsRead(){const n={};CFG_KEYS.forEach(k=>{if(k in S.map.at)n[k]=S.map.at[k]});$('mattrs').querySelectorAll('.row').forEach(r=>{const k=r.querySelector('.ak').value.trim();if(k&&!CFG_KEYS.includes(k)&&k!=='L'&&k!=='H')n[k]=r.querySelector('.av').value});S.map.at=n}
$('mattrs').onchange=()=>{attrsRead();snap();xmlSoon()};$('mattrs').onclick=e=>{if(e.target.closest('[data-x]')){e.target.closest('.row').remove();attrsRead();snap();attrsUI();xmlSoon()}};
$('mattr-add').onclick=()=>$('mattrs').insertAdjacentHTML('beforeend',`<div class="row"><input class="ak" placeholder="nome" style="max-width:70px"><input class="av" placeholder="valor"><button class="btn2" data-x>${ic('x',13)}</button></div>`);
const BGN=[['','None'],['-2','Random'],['0','Daylight'],['1','Dawn'],['2','Twilight'],['3','Full moon'],['4','Halloween'],['5','Christmas'],['6',"Valentine's Day"],['7','Storm clouds'],['8','Storm clouds 2'],['9','Desert 1'],['10','Desert 2'],['11','Ocean']];
const RAND_BG=[0,1,2,7],rollBg=()=>{S.bgRand=RAND_BG[Math.floor(Math.random()*RAND_BG.length)]};rollBg();
const CFG_KEYS=['F','defilante','dodue','theme','G','N','DS','P','C','A','Ca','mc','bh','aie','conju','mgoc','shaman_tools'];
const CFG_ORDER=['L','H',...CFG_KEYS];
const defOn=()=>'defilante' in S.map.at;
const ci=v=>Math.round(+v||0),cclamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const dfGet=()=>{const p=(S.map.at.defilante||'').split(',');return[0,1,2,3].map(i=>p[i]===undefined||p[i]===''?'0':p[i])};
const dfSet=(i,v)=>{const a=dfGet();a[i]=String(v);S.map.at.defilante=a.join(',')};
const gwGet=()=>{const p=(S.map.at.G||'').split(',');const w=p[0]===undefined||p[0]===''||isNaN(+p[0])?0:ci(p[0]),g=p[1]===undefined||p[1]===''||isNaN(+p[1])?10:ci(p[1]);return[w,g]};
const gwSet=(w,g)=>{if(w===0&&g===10)delete S.map.at.G;else S.map.at.G=w+','+g};
const nGet=()=>{const p=(S.map.at.N||'').split(',');return[p[0]===undefined||p[0]===''||isNaN(+p[0])?150:ci(p[0]),p[1]===undefined||p[1]===''||isNaN(+p[1])?0:ci(p[1])]};
const nSet=(d,t)=>{S.map.at.N=d+','+t};
function dsGet(){const v=S.map.at.DS;if(v===undefined||v==='')return{t:'n'};const m=v.match(/^([mxyr]);(.*)$/);if(!m)return{t:'n'};const nums=m[2].split(',').map(x=>+x||0);
 if(m[1]==='m'){const pts=[];for(let i=0;i<nums.length;i+=2)pts.push([nums[i],nums[i+1]||0]);return{t:'m',pts}}if(m[1]==='r')return{t:'r',r:[nums[0]||0,nums[1]||0,nums[2]||0,nums[3]||0]};return{t:m[1],v:nums[0]||0}}
function dsSet(o){const at=S.map.at;if(o.t==='n')delete at.DS;else if(o.t==='m')at.DS='m;'+o.pts.map(p=>ci(p[0])+','+ci(p[1])).join(',');else if(o.t==='r')at.DS='r;'+o.r.map(ci).join(',');else at.DS=o.t+';'+ci(o.v)}
const CF_BOOL=[['P','Portals','door-open','Portais'],['C','Mouse collisions','users','Colisão entre ratos'],['A','Soul mate','heart','Alma gêmea'],['Ca','Hide offscreen','image-off','Ocultar o que está fora da tela'],['mc','Hide anchors','anchor','Ocultar âncoras'],['bh','Cannonballs to shoot up','arrow-up','Bolas de canhão atiram para cima'],['aie','Aie','zap','Aie'],['conju','Conjuration','sparkles','Conjuração']];
const frow=(icn,lbl,ctl,tip,show)=>`<label class="fr"${show?` data-show="${show}"`:''} title="${tip||''}"><span class="fl">${ic(icn,14)}${lbl}</span>${ctl}</label>`;
const cnum=(k,x='')=>`<input type="number" step="1" data-c="${k}" ${x}>`,csw=k=>`<input type="checkbox" class="switch" data-c="${k}">`;
const csec=(icn,t,body,open=true)=>`<details class="sec" ${open?'open':''}><summary><span>${ic(icn,15)}</span>${t}</summary><div class="sbody">${body}</div></details>`;
function cfgHTML(){return[
 csec('ruler','Dimensões',frow('move-horizontal','Largura',cnum('w','min="800" max="1600"'),'Largura do mapa: 800 a 1600 (com defilante ativo: até 4800). 800 é o padrão e não aparece no XML.')+frow('move-vertical','Altura',cnum('h','min="400" max="800"'),'Altura do mapa: 400 a 800. 400 é o padrão e não aparece no XML.')+'<div class="hintp" id="c_dimh"></div>'),
 csec('wind','Defilante',frow('infinity','Defilante',csw('def'),'Ativa o mapa defilante: defilante="velocidade inicial, aceleração, velocidade máxima, rolagem livre". Libera largura até 4800 e troca as imagens dos objetos 6, 15, 16 e 32.')+frow('gauge','Velocidade inicial',cnum('dv0','step="any"'),'Primeiro valor do atributo defilante.','def')+frow('timer','Aceleração',cnum('dv1','step="any"'),'Segundo valor do atributo defilante.','def')+frow('zap','Velocidade máxima',cnum('dv2','step="any"'),'Terceiro valor do atributo defilante.','def')+frow('move-horizontal','Rolagem livre',csw('dv3'),'Quarto valor: 0 desativado, 1 ativado.','def')),
 csec('image','Fundo',frow('image','Fundo (F)',`<span class="fc"><select data-c="bg">${BGN.map(o=>`<option value="${o[0]}">${o[1]}</option>`).join('')}</select><button class="btn2" data-c="reroll" title="Sortear de novo (só na prévia)" data-show="rnd">${ic('dice-5',14)}</button></span>`,'Random grava F="-2": o jogo sorteia entre Daylight, Dawn, Twilight e Storm clouds.')+'<div class="hintp" id="c_bgh"></div>'),
 csec('gauge','Física e clima',frow('arrow-up','Gravity',cnum('grav'),'Gravidade (padrão 10). O XML usa G="Wind,Gravity" e só aparece se algum dos dois não for o padrão.')+frow('wind','Wind',cnum('wind'),'Vento (padrão 0).')),
 csec('moon','Night Mode',frow('moon','Night Mode',csw('night'),'Ativa N="diâmetro,tipo".')+frow('circle','Diameter',cnum('nd','min="1"'),'Diâmetro da luz (padrão 150).','night')+frow('users','Type',`<select data-c="nt"><option value="0">Shaman &amp; mice</option><option value="1">Shaman</option><option value="2">Mice</option></select>`,'0 = shaman e ratos, 1 = shaman, 2 = ratos.','night')),
 csec('map-pin','Mice spawn',frow('map-pin','Tipo',`<select data-c="dst"><option value="n">Normal</option><option value="m">Multiple</option><option value="x">Random X</option><option value="y">Random Y</option><option value="r">Rectangle</option></select>`,'Normal usa o item DS do mapa (sem atributo). Multiple: DS="m;x,y,x,y…" · Random X: DS="x;y" · Random Y: DS="y;x" · Rectangle: DS="r;x,y,w,h".')+frow('move-vertical','Y',cnum('dsx'),'Random X: o Y fixo onde os ratos nascem.','dsx')+frow('move-horizontal','X',cnum('dsy'),'Random Y: o X fixo onde os ratos nascem.','dsy')+['X','Y','W','H'].map((l,i)=>frow(i%2?'move-vertical':'move-horizontal',l==='W'?'Largura':l==='H'?'Altura':l,cnum('dsr'+i),'Retângulo de spawn.','dsr')).join('')+`<div data-show="dsm"><div id="c_dsm"></div><div class="row"><button data-c="dsadd" data-ic="plus">Ponto</button></div></div>`),
 csec('flag','Opções do mapa',CF_BOOL.map(([k,l,icn,tip])=>frow(icn,l,csw('b_'+k),tip+' ('+k+'="")')).join(''),true),
 csec('sparkles','Queijo e tema',frow('sparkles','Dodue',csw('dodue'),'Queijo triplo (dodue=""). Os queijos usam $FromageDodue.svg.')+frow('tag','Tema',`<select data-c="theme"><option value="">None</option><option value="halloween">Halloween</option></select>`,'theme="halloween". Com Dodue ativo os queijos usam $FromageDoduehalloween.svg.')),
 csec('wrench','Shaman',frow('weight','Shaman objects Mass',cnum('mgoc','min="-1"'),'mgoc: 0 = nenhum (não aparece no XML); aceita -1.')+frow('wrench','Shaman Tools',`<button data-c="tools" class="toolbtn"><span id="c_tools">0</span>${ic('chevron-right',13)}</button>`,'Abre a seleção de objetos de shaman (shaman_tools="2,6,28…").')),
].join('')}
function cfgSync(){const root=$('cfgroot');if(!root.firstChild){root.innerHTML=cfgHTML();icons(root)}
 const at=S.map.at,set=(k,v)=>{const e=root.querySelector(`[data-c="${k}"]`);if(!e||e===document.activeElement)return;if(e.type==='checkbox')e.checked=!!v;else e.value=v};
 const df=defOn(),dg=dfGet(),gw=gwGet(),nn=nGet(),ds=dsGet();
 set('w',S.map.w);set('h',S.map.h);set('def',df);dg.slice(0,3).forEach((v,i)=>set('dv'+i,v));set('dv3',dg[3]==='1');
 set('bg',at.F===undefined||at.F===''?'':String(at.F));set('grav',gw[1]);set('wind',gw[0]);set('night','N' in at);set('nd',nn[0]);set('nt',nn[1]);
 set('dst',ds.t);if(ds.t==='x')set('dsx',ds.v);if(ds.t==='y')set('dsy',ds.v);if(ds.t==='r')ds.r.forEach((v,i)=>set('dsr'+i,v));
 CF_BOOL.forEach(([k])=>set('b_'+k,k in at));set('dodue','dodue' in at);set('theme',at.theme||'');set('mgoc',at.mgoc===undefined?0:ci(at.mgoc));
 const show={def:df,rnd:at.F==='-2',night:'N' in at,dsx:ds.t==='x',dsy:ds.t==='y',dsr:ds.t==='r',dsm:ds.t==='m'};
 root.querySelectorAll('[data-show]').forEach(e=>{e.hidden=!show[e.dataset.show]});
 $('c_dimh').textContent=df?'Largura 800–4800 (defilante) · altura 400–800':'Largura 800–1600 · altura 400–800';
 root.querySelector('[data-c="w"]').max=df?4800:1600;
 $('c_bgh').textContent=at.F==='-2'?'Prévia: '+BGN.find(o=>+o[0]===S.bgRand&&o[0]!=='-2')[1]+' (o jogo sorteia entre Daylight, Dawn, Twilight e Storm clouds)':'';
 const dm=$('c_dsm');if(ds.t==='m'&&!(dm.contains(document.activeElement)&&document.activeElement.tagName==='INPUT')){const h=ds.pts.map((p,i)=>`<div class="row"><span class="rl">${i+1}</span><input type="number" step="1" data-dm="${i}" data-ax="0" value="${p[0]}" title="X"><input type="number" step="1" data-dm="${i}" data-ax="1" value="${p[1]}" title="Y"><button class="btn2" data-dmx="${i}" title="Remover ponto">${ic('x',13)}</button></div>`).join('');if(dm._h!==h){dm._h=h;dm.innerHTML=h}}
 const tl=(at.shaman_tools||'').split(',').filter(x=>x!=='');$('c_tools').textContent=tl.length?tl.join(','):'Nenhum (clique para escolher)'}
function cfgApply(el,fin){const k=el.dataset.c,v=el.type==='checkbox'?el.checked:el.value,at=S.map.at;if(k===undefined)return;let done=true;
 const bk=k.startsWith('b_')?k.slice(2):null;
 if(bk){if(v)at[bk]='';else delete at[bk]}
 else if(k==='w'||k==='h'){if(!fin)return;const n=ci(v)||(k==='w'?800:400);S.map[k]=k==='w'?cclamp(n,800,defOn()?4800:1600):cclamp(n,400,800)}
 else if(k==='def'){if(v){if(!at.defilante)at.defilante='0,0,0,0'}else{delete at.defilante;if(S.map.w>1600)S.map.w=1600}catUI();mapUI(1)}
 else if(/^dv[0-3]$/.test(k)){const i=+k[2];dfSet(i,i===3?(v?1:0):(v===''?0:v))}
 else if(k==='bg'){if(v==='')delete at.F;else{at.F=v;if(v==='-2')rollBg()}}
 else if(k==='grav'||k==='wind'){const g=gwGet();if(k==='grav')g[1]=ci(v===''?10:v);else g[0]=ci(v);gwSet(g[0],g[1])}
 else if(k==='night'){if(v)nSet(150,0);else delete at.N}
 else if(k==='nd'||k==='nt'){const n=nGet();if(k==='nd')n[0]=Math.max(1,ci(v)||150);else n[1]=ci(v);nSet(n[0],n[1])}
 else if(k==='dst'){dsSet(v==='n'?{t:'n'}:v==='m'?{t:'m',pts:[[100,200]]}:v==='r'?{t:'r',r:[100,100,200,100]}:{t:v,v:v==='x'?298:498})}
 else if(k==='dsx'||k==='dsy'){dsSet({t:k==='dsx'?'x':'y',v:ci(v)})}
 else if(/^dsr[0-3]$/.test(k)){const d=dsGet();if(d.t==='r'){d.r[+k[3]]=ci(v);dsSet(d)}}
 else if(k==='dodue'){if(v)at.dodue='';else delete at.dodue}
 else if(k==='theme'){if(v)at.theme=v;else delete at.theme}
 else if(k==='mgoc'){const n=ci(v);if(n===0)delete at.mgoc;else at.mgoc=String(n)}
 else done=false;
 if(!done)return;dirty=1;if(fin){snap();mapUI(1);if(k==='w'||k==='h'||k==='def')fit()}else{cfgSync();xmlSoon()}}
$('cfgroot').addEventListener('input',e=>{const t=e.target;if(t.dataset.dm!==undefined){const d=dsGet();if(d.t==='m'){d.pts[+t.dataset.dm][+t.dataset.ax]=ci(t.value);dsSet(d);dirty=1;xmlSoon()}return}if(t.dataset.c&&t.type!=='checkbox'&&t.tagName!=='SELECT')cfgApply(t,false)});
$('cfgroot').addEventListener('change',e=>{const t=e.target;if(t.dataset.dm!==undefined){snap();mapUI(1);return}if(t.dataset.c)cfgApply(t,true)});
$('cfgroot').addEventListener('click',e=>{const b=e.target.closest('button[data-c],button[data-dmx]');if(!b)return;
 if(b.dataset.dmx!==undefined){const d=dsGet();if(d.t==='m'&&d.pts.length>1){d.pts.splice(+b.dataset.dmx,1);dsSet(d);b.blur();snap();$('c_dsm')._h=null;dirty=1;mapUI(1);xmlSoon()}return}
 const k=b.dataset.c;if(k==='reroll'){rollBg();dirty=1;cfgSync()}
 else if(k==='dsadd'){const d=dsGet();if(d.t==='m'){const l=d.pts[d.pts.length-1]||[100,200];d.pts.push([l[0]+30,l[1]]);dsSet(d);b.blur();snap();$('c_dsm')._h=null;dirty=1;mapUI(1);xmlSoon()}}
 else if(k==='tools')toolsModal()});
function toolsModal(){let sel=(S.map.at.shaman_tools||'').split(',').filter(x=>x!=='').map(x=>+x).filter(x=>!isNaN(x));
 const src=i=>MR.defUrl({at:{C:String(i)}})||`assets/object/$Objet_${i}.svg`;
 const paint=()=>{const g=$('mb').querySelector('.tgrid'),ch=$('mb').querySelector('.tchips'),pv=$('mb').querySelector('.tprev');
  g.querySelectorAll('button').forEach(b=>{const i=sel.indexOf(+b.dataset.id);b.classList.toggle('on',i>=0);b.querySelector('em').textContent=i>=0?i+1:''});
  ch.innerHTML=sel.length?sel.map((id,i)=>`<span class="chip">${id}<button data-rm="${i}" title="Remover">${ic('x',11)}</button></span>`).join(''):'<span class="hintp">Nenhum objeto selecionado.</span>';pv.textContent=sel.length?'shaman_tools="'+sel.join(',')+'"':'(sem shaman_tools)'};
 modal('Shaman Tools: objetos do shaman',`<div class="tools"><div class="tgrid">${OBJ.map(i=>`<button data-id="${i}" title="Objeto ${i}"><img loading="lazy" src="${src(i)}" alt=""><i>${i}</i><em></em></button>`).join('')}</div><div class="tchips"></div><div class="row"><input type="number" id="t_idn" placeholder="ID sem desenho (ex.: 96)" min="0"><button id="t_ida" data-ic="plus" title="Adicionar ID">Adicionar</button></div><code class="tprev"></code><div class="actbar"><button id="t_clr" data-ic="trash-2">Limpar</button><span class="sp"></span><button id="t_ok" class="pri" data-ic="check">Aplicar</button></div></div>`);
 const mb=$('mb');paint();
 mb.querySelector('.tgrid').onclick=e=>{const b=e.target.closest('button[data-id]');if(!b)return;const id=+b.dataset.id,i=sel.indexOf(id);if(i>=0)sel.splice(i,1);else sel.push(id);paint()};
 mb.querySelector('.tchips').onclick=e=>{const b=e.target.closest('[data-rm]');if(b){sel.splice(+b.dataset.rm,1);paint()}};
 $('t_ida').onclick=()=>{const v=$('t_idn').value;if(v===''||isNaN(+v))return;sel.push(Math.round(+v));$('t_idn').value='';paint()};
 $('t_clr').onclick=()=>{sel=[];paint()};
 $('t_ok').onclick=()=>{if(sel.length)S.map.at.shaman_tools=sel.join(',');else delete S.map.at.shaman_tools;$('modal').hidden=true;snap();mapUI(1);xmlSoon()}}

function addItem(kind,tag,at){if(at.X!==undefined)at.X=Math.round(+at.X);if(at.Y!==undefined)at.Y=Math.round(+at.Y);const l=mapList(kind);l.push({tag,at});S.msel={kind,i:l.length-1};snap();showMT('item');ui()}
function addGround(t){const[x,y]=centerW(),at={T:String(t),X:x,Y:y,L:t===13?'40':'240',P:groundP(t)};if(t!==13)at.H='40';if(t===12||t===13)at.o='324650';addItem('S','S',at)}
function addCat(k,v){const[x,y]=centerW();if(k==='G')addGround(v);else if(k==='P')addItem('D','P',{T:String(v),X:x,Y:y,P:'0,0'});else if(k==='O')addItem('O','O',{C:String(v),X:x,Y:y,P:'0,0'});else addItem('D',v,{X:x,Y:y})}

const msList=()=>{if(!S.msel)return[];const l=S.mm.length>1?S.mm:[S.msel];return l.filter(m=>mapList(m.kind)[m.i])};
const msItems=()=>msList().filter(m=>m.kind!=='J').map(m=>({m,o:mapList(m.kind)[m.i]}));
const msHas=(k,i)=>msList().some(m=>m.kind===k&&m.i===i);
function ensureG0(o){if(!o.g0)o.g0={L:o.at.L,H:o.at.H,P:o.at.P}}
function mapBox(kind,it,i){const b=MR.bounds(kind,it,i);if(!b)return null;const a=(b.ang||0)*Math.PI/180,co=Math.cos(a),si=Math.sin(a);let xs,ys;if(b.circ){xs=[b.x-b.w,b.x+b.w];ys=[b.y-b.w,b.y+b.w]}else{const c=[[b.ox,b.oy],[b.ox+b.w,b.oy],[b.ox+b.w,b.oy+b.h],[b.ox,b.oy+b.h]].map(p=>[b.x+p[0]*co-p[1]*si,b.y+p[0]*si+p[1]*co]);xs=c.map(p=>p[0]);ys=c.map(p=>p[1])}return[Math.min(...xs),Math.min(...ys),Math.max(...xs),Math.max(...ys)]}
function mapBoxSelect(x0,y0,x1,y1,shift){const out=shift?msList().slice():[];['S','D','O','I'].forEach(k=>{if(S.mvis&&S.mvis[k]===0)return;mapList(k).forEach((it,i)=>{const b=mapBox(k,it,i);if(b&&b[2]>=x0&&b[0]<=x1&&b[3]>=y0&&b[1]<=y1&&!out.some(m=>m.kind===k&&m.i===i))out.push({kind:k,i})})});
 S.mm=out.length>1?out:[];S.msel=out.length?out[out.length-1]:null;if(S.msel)showMT('item');mapUI();mprops();dirty=1}
function mapCenter(its){let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;its.forEach(({m,o})=>{const b=mapBox(m.kind,o,m.i);if(b){x0=Math.min(x0,b[0]);y0=Math.min(y0,b[1]);x1=Math.max(x1,b[2]);y1=Math.max(y1,b[3])}});return x0>x1?[0,0]:[(x0+x1)/2,(y0+y1)/2]}
const bcOf=(m,o)=>{const b=mapBox(m.kind,o,m.i);return b?[(b[0]+b[2])/2,(b[1]+b[3])/2]:[+o.at.X||0,+o.at.Y||0]};
function mapSnap(){const its=msItems();its.forEach(x=>ensureG0(x.o));return{c:its.length===1?[+its[0].o.at.X||0,+its[0].o.at.Y||0]:mapCenter(its),s:its.map(({m,o})=>({o,k:m.kind,X:+o.at.X||0,Y:+o.at.Y||0,L:o.at.L,H:o.at.H,P:o.at.P,bc:bcOf(m,o)}))}}
function mapRestore(T){T.s.forEach(s=>{s.o.at.X=s.X;s.o.at.Y=s.Y;if(s.L!==undefined)s.o.at.L=s.L;else delete s.o.at.L;if(s.H!==undefined)s.o.at.H=s.H;else delete s.o.at.H;if(s.P!==undefined)s.o.at.P=s.P;else delete s.o.at.P})}
const mAng=(k,at)=>k==='S'?((+at.T|0)===9?0:+getP(at,4,'0')||0):k==='O'?+((at.P||'0').split(/[,%]/)[0])||0:0;
function mSetAng(k,at,v){v=R2(v);if(k==='S'){if((+at.T|0)!==9)setP(at,4,v,groundP(+at.T|0))}else if(k==='O')at.P=String(v)+(at.P||'0,0').replace(/^[^,%]*/,'')}
function mapXf(T,type,v){const c=T.c;T.s.forEach(s=>{const at=s.o.at,dx=s.X-c[0],dy=s.Y-c[1];let nx=s.X,ny=s.Y;
  if(type==='rot'){const r=v*Math.PI/180,co=Math.cos(r),si=Math.sin(r);nx=c[0]+dx*co-dy*si;ny=c[1]+dx*si+dy*co;mSetAng(s.k,at,mAng(s.k,{...at,P:s.P,T:at.T})+v)}
  else if(type==='sc'){const k=v/100;nx=c[0]+dx*k;ny=c[1]+dy*k;if(s.k==='S'){at.L=String(Math.max(10,Math.round((+s.L||10)*k)));if(s.H!==undefined)at.H=String(Math.max(10,Math.round((+s.H||10)*k)))}}
  else{const fx=type==='fx',cf=T.s.length===1&&s.bc?s.bc:c,bx=s.bc?s.bc[0]:s.X,by=s.bc?s.bc[1]:s.Y;if(fx)nx=s.X+2*(cf[0]-bx);else ny=s.Y+2*(cf[1]-by);mSetAng(s.k,at,-mAng(s.k,{...at,P:s.P,T:at.T}));if(fx&&s.k==='D'&&s.o.tag==='P'){const r=+getP(at,1,'0');if(r===0||r===1)setP(at,1,1-r,'0,0')}}
  at.X=Math.round(nx);at.Y=Math.round(ny)})}
function mapFlip(type){if(!msList().length)return;const T=mapSnap();mapXf(T,type,0);snap();mapUI(1);mprops();xmlSoon();dirty=1}
function mapReset(){const its=msItems();let n=0;its.forEach(({m,o})=>{if(!o.g0)return;const g=o.g0,a0=mAng(m.kind,{T:o.at.T,P:g.P});if(Math.abs(mAng(m.kind,o.at)-a0)<1e-6)return;mSetAng(m.kind,o.at,a0);n++});if(n){snap();mapUI(1);mprops();xmlSoon();dirty=1}}
function mapOverlay(z){const its=msItems();if(its.length>1){cx.save();cx.lineWidth=1.5/z;cx.strokeStyle='#00e5ff';its.forEach(({m,o})=>{const b=mapBox(m.kind,o,m.i);if(b)cx.strokeRect(b[0],b[1],b[2]-b[0],b[3]-b[1])});if(S.showFrame){const c=mapCenter(its),bb=its.map(({m,o})=>mapBox(m.kind,o,m.i)).filter(Boolean),x0=Math.min(...bb.map(b=>b[0])),y0=Math.min(...bb.map(b=>b[1])),x1=Math.max(...bb.map(b=>b[2])),y1=Math.max(...bb.map(b=>b[3]));cx.setLineDash([5/z,4/z]);cx.strokeStyle='#ffb300';cx.strokeRect(x0,y0,x1-x0,y1-y0);cx.setLineDash([]);cx.fillStyle='#ffb300';cx.beginPath();cx.arc(c[0],c[1],3/z,0,7);cx.fill()}cx.restore()}
 const d=S.drag;if(d&&d.mbox){const b=d.mbox;cx.save();cx.strokeStyle='#ffb300';cx.fillStyle='#ffb30018';cx.lineWidth=1/z;cx.setLineDash([4/z,3/z]);cx.fillRect(b[0],b[1],b[2]-b[0],b[3]-b[1]);cx.strokeRect(b[0],b[1],b[2]-b[0],b[3]-b[1]);cx.restore()}}
function mapDown(w,raw,e){const f=mapFrame();if(f){const fh=frameHit(f,raw);if(fh){ensureG0(S.map.S[S.msel.i]);S.drag={mh:1,f,h:fh.h,rot:fh.rot,item:S.map.S[S.msel.i],moved:0};return}}
 if(!e.altKey){const jh=JT.hit(raw,S.view.z,S.msel&&S.msel.kind==='J'?S.msel.i:null);if(jh){S.mm=[];S.msel={kind:'J',i:jh.i};S.drag={jh:1,j:S.map.J[jh.i],part:jh.part,rs:raw,orig:JT.snapshot(S.map.J[jh.i]),moved:0};showMT('item');mapUI();dirty=1;return}}
 let best=null;for(const k of['O','D','S','I']){if(S.mvis&&S.mvis[k]===0)continue;const l=mapList(k);for(let i=l.length-1;i>=0;i--)if(MR.hit(k,l[i],i,raw[0],raw[1])){best={kind:k,i};break}if(best)break}
 if(!best){S.drag={mbox:[raw[0],raw[1],raw[0],raw[1]],shift:e.shiftKey,moved:0};if(!e.shiftKey){S.msel=null;S.mm=[]}mapUI();dirty=1;return}
 if(e.shiftKey){const l=msList().slice(),j=l.findIndex(m=>m.kind===best.kind&&m.i===best.i);if(j>=0)l.splice(j,1);else l.push(best);S.mm=l.length>1?l:[];S.msel=l.length?l[l.length-1]:null;if(S.msel)showMT('item');mapUI();mprops();dirty=1;return}
 if(S.mm.length>1&&msHas(best.kind,best.i)){S.msel=best;const its=msItems();its.forEach(x=>ensureG0(x.o));S.drag={mg:1,rs:raw,its:its.map(({m,o})=>({o,k:m.kind,x0:+o.at.X||0,y0:+o.at.Y||0})),moved:0};showMT('item');mapUI();dirty=1;return}
 S.mm=[];S.msel=best;const mo=mapList(best.kind)[best.i];ensureG0(mo);S.drag={mi:mo,k:best.kind,x0:+mo.at.X,y0:+mo.at.Y,rs:raw,moved:0};showMT('item');mapUI();dirty=1}
function mapHandleMove(d,raw,e){const f=d.f,it=d.item;if(d.rot){let a=Math.atan2(raw[1]-f.cy,raw[0]-f.cx)*180/Math.PI+90;if(e.shiftKey)a=Math.round(a/15)*15;setP(it.at,4,R2(a),groundP(+it.at.T|0));return}
 const sn=snapOn(),g=gridSize(),sr=sn&&Math.abs(f.th)<1e-9?[snapV(raw[0]),snapV(raw[1])]:raw,l=toLoc(f,sr),hs=HP[d.h],gs=v=>Math.max(10,Math.round(v/g)*g);if(f.circ){const r=Math.hypot(l[0],l[1]);it.at.L=String(sn?R2(gs(r)):Math.max(10,Math.round(r)));return}
 let x0=-f.hw,x1=f.hw,y0=-f.hh,y1=f.hh;if(hs[0]<0)x0=Math.min(l[0],x1-10);else if(hs[0]>0)x1=Math.max(l[0],x0+10);if(hs[1]<0)y0=Math.min(l[1],y1-10);else if(hs[1]>0)y1=Math.max(l[1],y0+10);
 if(sn&&Math.abs(f.th)>=1e-9){if(hs[0]<0)x0=x1-gs(x1-x0);else if(hs[0]>0)x1=x0+gs(x1-x0);if(hs[1]<0)y0=y1-gs(y1-y0);else if(hs[1]>0)y1=y0+gs(y1-y0)}
 const c=toWld(f,[(x0+x1)/2,(y0+y1)/2]),q=v=>String(sn?R2(v):Math.round(v));it.at.X=Math.round(c[0]);it.at.Y=Math.round(c[1]);it.at.L=String(Math.max(10,Math.round(x1-x0)));it.at.H=String(Math.max(10,Math.round(y1-y0)))}
const LBL={I:'Imagem',S:'Ground',O:'Objeto',P:'Decoração',F:'Queijo',T:'Toca',DS:'Rato DS',DC:'Rato DC',DC2:'Rato DC2'};
const GRP=[['S','Terrenos','mountain'],['D','Decorações','sparkles'],['O','Objetos','box'],['J','Joints','link'],['I','Imagens','image']],GRPN={S:'Terreno',D:'Decoração',O:'Objeto',I:'Imagem',J:'Joint'};
function mapThumb(kind,it){const a=it.at;if(kind==='I')return MR.imgUrl(a.U);if(kind==='O')return MR.defUrl(it)||`assets/object/$Objet_${+a.C|0}.svg`;if(kind==='S'){const t=+a.T|0;return GT0[t]!==undefined?`assets/ground/$T_${GT0[t]}.svg`:GCL[t]?`assets/ground/${GCL[t]}.svg`:''}return MR.decoPath(it)}
const timg=src=>src?`<img loading="lazy" src="${src}" alt="" onerror="this.style.visibility='hidden'">`:'';
const eyeB=k=>`<button class="btn2 ${S.mvis[k]?'':'off'}" data-act="vis" data-v="${k}" title="Mostrar/ocultar">${ic(S.mvis[k]?'eye':'eye-off',14)}</button>`;
function mapUI(light){if(window.__xmlReady)xmlSoon();selbarUpd();MR.setMap(S.map.at);cfgSync();if(!$('mattrs').contains(document.activeElement))attrsUI();
 let h=`<div class="gh bgrow" data-act="vis" data-v="bg"><span class="gi">${ic('image',14)}</span><b>Fundo do mapa</b>${eyeB('bg')}</div>`;
 GRP.forEach(([kd,nm,icn])=>{const list=mapList(kd),col=S.mgrp.has(kd);
  h+=`<div class="gh" data-act="gx" data-g="${kd}"><span class="chev">${ic(col?'chevron-right':'chevron-down',14)}</span><span class="gi">${ic(icn,14)}</span><b>${nm}</b><span class="cnt">${list.length}</span>${eyeB(kd)}</div>`;
  if(!col)h+='<div class="gi2">'+(list.length?list.map((o,i)=>`<div class="mi ${S.msel&&S.msel.kind===kd&&S.msel.i===i?'on':''}" data-k="${kd}" data-i="${i}"><span class="tb">${kd==='S'?gThumb(i,30):kd==='J'?ic(JT.icon(o.tag),18):timg(mapThumb(kd,o))}</span><span class="nm">${kd==='J'?JT.label(o,i):kd==='I'?esc(String(o.at.U||'').split('/').pop()||'Imagem')+(o.at.F==='1'?' · frente':' · fundo'):(kd==='S'?'#'+i+' · ':'')+(LBL[o.tag]||o.tag)+' '+(o.at.T??o.at.C??'')}</span><small>${kd==='J'?JT.sub(o):Math.round(+o.at.X)+', '+Math.round(+o.at.Y)}</small><button class="btn2 dn" data-act="mdel" title="Excluir">${ic('trash-2',13)}</button></div>`).join(''):'<div class="empty">Vazio. Use o catálogo</div>')+'</div>'});
 if($('mapitems')._h!==h){$('mapitems')._h=h;keepScroll($('mapitems'),()=>{$('mapitems').innerHTML=h});paintThumbs()}
 if(!(light&&$('mprops').contains(document.activeElement)))mprops();dirty=1}
$('mapitems').onclick=e=>{const b=e.target.closest('[data-act]'),mi=e.target.closest('.mi');
 if(b){const a=b.dataset.act;if(a==='vis'){S.mvis[b.dataset.v]^=1;e.stopPropagation();mapUI(1);return}
  if(a==='gx'){const g=b.dataset.g;S.mgrp.has(g)?S.mgrp.delete(g):S.mgrp.add(g);mapUI(1);return}
  if(a==='mdel'&&mi){mapList(mi.dataset.k).splice(+mi.dataset.i,1);if(mi.dataset.k==='S'){JT.onRemoveS(+mi.dataset.i);lgOnRemoveS(+mi.dataset.i)}S.msel=null;commit();return}}
 if(mi){S.msel={kind:mi.dataset.k,i:+mi.dataset.i};showMT('item');mapUI()}};
const GN=['Madeira','Gelo','Trampolim','Lava','Chocolate','Terra','Grama','Areia','Nuvem','Água','Pedra','Neve','Retângulo','Círculo','Invisível','Teia','Madeira 2','Grama 2','Grama 3','Ácido','Mel','Galáxia'];
const GPD=t=>{let f=.3,r=.2;if(t===1)f=0;else if(t===4)f=20;else if(t===7)f=.1;else if(t===11){f=.05;r=.1}else if(t===2){f=0;r=1.2}else if(t===3){f=0;r=20}else if(t===10||t===19)r=0;else if(t===20){f=.1;r=.3}else if(t===21){f=0;r=0}return[f,r]};
const groundP=t=>{if(t===9)return'0,0,0,0,0,0,0,0';const d=GPD(t);return'0,0,'+d[0]+','+d[1]+',0,0,0,0'};
const fnum=(v,d=4)=>String(+(+v).toFixed(d));
const gP=(at,t,i)=>{const d=GPD(t),def=['0','0',String(d[0]),String(d[1]),'0','0','0','0'][i];return getP(at,i,def)};
const sP=(at,t,i,v)=>{if(!at.P){const d=GPD(t);at.P=['0','0',d[0],d[1],'0','0','0','0'].join(',')}setP(at,i,v,at.P)};
const gC=(at,t)=>{if('c' in at){const c=ci(at.c);return c===1||c===0?[true,true]:c===2?[false,true]:c===3?[true,false]:[false,false]}return t===8?[false,true]:[true,true]};
const sC=(at,t,mice,obj)=>{const cv=4-(mice?1:0)-(obj?2:0);if(cv===(t===8?2:1))delete at.c;else at.c=String(cv)};
function honeyGet(at,t){if('friction' in at){const v=String(at.friction);if(v==='#')return{t:'glitched',v:100,d:5};const p=v.split(','),l=parseFloat(p[0]),r=parseFloat(p[1]);if(!isNaN(l)&&!isNaN(r)){const st=l>=0;return{t:st?'sticky':'slippery',v:st?l*5:-l,d:r!==0?l/r:5}}return{t:'glitched',v:100,d:5}}return t===20?{t:'sticky',v:100,d:5}:{t:'none',v:100,d:5}}
function honeySet(at,t,h){if(h.t==='none')delete at.friction;else if(h.t==='glitched')at.friction='#';else{const l=(h.t==='sticky'?.2:-1)*h.v,hs=fnum(l)+','+fnum(l/(h.d===0?1:h.d));if(t===20&&hs==='20,4')delete at.friction;else at.friction=hs}}
const SECIC={'Pontos':'crosshair','Polias':'hierarchy','Movimento':'move','Motor':'zap','Geral':'shapes','Aparência':'palette','Física':'gauge','Mel':'droplet','Água / Teia':'waves','Galáxia':'sparkles','Avançado':'sliders-horizontal','Posição':'move','Tipo':'shapes','Cores':'palette','Opções':'sliders-horizontal'};
function mprops(){const m=S.msel,box=$('mprops'),hd=$('mhead');const it=m&&mapList(m.kind)[m.i];
 zSync();
 if(!it){hd.innerHTML='';box.innerHTML='<div class="empty">Nenhum item selecionado.<br>Clique num item no mapa ou na aba Camadas.</div>';return}
 hd.innerHTML=`<span class="th">${m.kind==='J'?ic(JT.icon(it.tag),30):m.kind==='S'?gThumb(m.i,52):timg(mapThumb(m.kind,it))}</span><div><b>${m.kind==='J'?JT.label(it,m.i):m.kind==='I'?esc(String(it.at.U||'').split('/').pop()||'Imagem'):(LBL[it.tag]||it.tag)+' '+(it.at.T??it.at.C??'')}${m.kind==='S'?' · '+T(GN[+it.at.T|0]||''):''}</b><small>${GRPN[m.kind]}${m.kind==='J'?' · '+JT.sub(it):' · '+Math.round(+it.at.X)+', '+Math.round(+it.at.Y)}</small></div>`;paintThumbs();
 const at=it.at,F=[],ord=[];const add=(sec,t,l,icn,g,s,o)=>{F.push({sec,t,l,icn,g,s,o:o||{}});if(!ord.includes(sec))ord.push(sec)};
 const n=(sec,l,icn,g,s,o)=>add(sec,'n',l,icn,g,s,o),b=(sec,l,icn,g,s,o)=>add(sec,'b',l,icn,g,s,o),c=(sec,l,icn,g,s,o)=>add(sec,'c',l,icn,g,s,o),sel=(sec,l,icn,opt,g,s,o)=>add(sec,'s',l,icn,g,s,{...(o||{}),opt}),tx=(sec,l,icn,g,s,o)=>add(sec,'t',l,icn,g,s,o);
 const posXY=sec=>{n(sec,'X','move-horizontal',()=>Math.round(+at.X||0),v=>at.X=String(Math.round(+v||0)),{step:1});n(sec,'Y','move-vertical',()=>Math.round(+at.Y||0),v=>at.Y=String(Math.round(+v||0)),{step:1})};
 if(m.kind==='S'){const t=+at.T|0,water=t===9||t===15,solid=!water;
  sel('Geral','Tipo','shapes',GN.map((nm,i)=>[i,i+' · '+T(nm)]),()=>t,v=>{const nt=+v;at.T=String(nt);if(at.P){const d=GPD(nt);sP(at,nt,2,d[0]);sP(at,nt,3,d[1])}if((nt===12||nt===13)&&!at.o)at.o='324650';if(nt===13)delete at.H;else if(!at.H)at.H='40'});
  posXY('Geral');n('Geral',t===13?'Raio':'Largura',t===13?'circle':'move-horizontal',()=>Math.round(+at.L||10),v=>at.L=String(cclamp(Math.round(+v||10),10,10000)),{step:1,min:10});
  if(t!==13)n('Geral','Altura','move-vertical',()=>Math.round(+at.H||10),v=>at.H=String(cclamp(Math.round(+v||10),10,10000)),{step:1,min:10});
  if(t!==9)n('Geral','Rotação °','rotate-cw',()=>gP(at,t,4),v=>sP(at,t,4,v),{step:5});
  if(solid&&t!==21)b('Aparência','Foreground (N)','layers',()=>'N' in at,v=>{if(v)at.N='';else delete at.N});
  b('Aparência','Invisível (m)','eye-off',()=>'m' in at,v=>{if(v)at.m='';else delete at.m});
  if(t===12||t===13)c('Aparência','Cor','palette',()=>(at.o||'ffffff').slice(-6),v=>at.o=v.slice(1));
  add('Aparência','tint','Tint','droplet',()=>at.tint,v=>{if(v===null)delete at.tint;else at.tint=v});
  b('Aparência','Imagem anexada (i)','image',()=>'i' in at,v=>{if(v)at.i='0,0,';else delete at.i});
  if('i' in at){const ip=()=>{const q=String(at.i).split(',');return[q[0]||'0',q[1]||'0',q.slice(2).join(',')]};
   tx('Aparência','URL / caminho','link',()=>ip()[2],v=>{const q=ip();at.i=q[0]+','+q[1]+','+v});
   n('Aparência','Img X','move-horizontal',()=>ip()[0],v=>{const q=ip();at.i=Math.round(+v||0)+','+q[1]+','+q[2]},{step:1});n('Aparência','Img Y','move-vertical',()=>ip()[1],v=>{const q=ip();at.i=q[0]+','+Math.round(+v||0)+','+q[2]},{step:1})}
  if(solid){b('Física','Dinâmico','move',()=>gP(at,t,0)==='1',v=>sP(at,t,0,v?1:0));n('Física','Massa','weight',()=>gP(at,t,1),v=>sP(at,t,1,v),{min:0,step:'any'});n('Física','Fricção','gauge',()=>gP(at,t,2),v=>sP(at,t,2,v),{step:'any'});n('Física','Restituição','arrow-up',()=>gP(at,t,3),v=>sP(at,t,3,v),{step:'any'});
   b('Física','Rotação fixa','anchor',()=>gP(at,t,5)==='1',v=>sP(at,t,5,v?1:0));n('Física','Amortec. linear','wind',()=>gP(at,t,6),v=>sP(at,t,6,v),{min:0,step:'any'});n('Física','Amortec. angular','rotate-cw',()=>gP(at,t,7),v=>sP(at,t,7,v),{min:0,step:'any'});
   n('Física','Escala de gravidade','arrow-up',()=>at.grav===undefined?1:at.grav,v=>{if(+v===1||v==='')delete at.grav;else at.grav=String(+v)},{step:.1});
   b('Física','Colide com ratos','users',()=>gC(at,t)[0],v=>sC(at,t,v,gC(at,t)[1]));b('Física','Colide com objetos','package',()=>gC(at,t)[1],v=>sC(at,t,gC(at,t)[0],v));b('Física','Colisão por toque (col)','target',()=>'col' in at,v=>{if(v)at.col='';else delete at.col});
   n('Física','Sumir (ms)','timer',()=>at.v||0,v=>{const x=Math.max(0,Math.round(+v||0));if(x)at.v=String(x);else delete at.v},{min:0,step:1});
   const h=()=>honeyGet(at,t);sel('Mel','Tipo de mel','droplet',[['none','Nenhum'],['sticky','Grudento'],['slippery','Escorregadio'],['glitched','Bugado (#)']],()=>h().t,v=>{const o=h();o.t=v;honeySet(at,t,o)});
   if(['sticky','slippery'].includes(h().t)){n('Mel','Valor','gauge',()=>fnum(h().v,2),v=>{const o=h();o.v=+v||0;honeySet(at,t,o)},{step:'any'});n('Mel','Duração','timer',()=>fnum(h().d,2),v=>{const o=h();o.d=+v||0;honeySet(at,t,o)},{step:'any'})}}
  else{[['archAcc',.1],['archCheeseMax',.25],['archMax',.5],['linDampAcc',0],['linDampMax',0],['angDampAcc',0],['angDampMax',0]].forEach(([k,d])=>n('Água / Teia',k,'waves',()=>at[k]===undefined?d:at[k],v=>{if(+v===d||v==='')delete at[k];else at[k]=fnum(v)},{step:.01}))}
  if(t===21){tx('Galáxia','Nome','tag',()=>at.name||'',v=>{if(v)at.name=v;else delete at.name});tx('Galáxia','Alvo','target',()=>at.target||'',v=>{if(v)at.target=v;else delete at.target});
   n('Galáxia','Bônus de entrada','arrow-up',()=>at.inputSpeedBonus||0,v=>{if(+v)at.inputSpeedBonus=String(+v);else delete at.inputSpeedBonus},{step:'any'});n('Galáxia','Bônus de saída','arrow-up',()=>at.outputSpeedBonus||0,v=>{if(+v)at.outputSpeedBonus=String(+v);else delete at.outputSpeedBonus},{step:'any'});
   b('Galáxia','Somar vel. do chão','plus',()=>'addInputGroundSpeed' in at&&at.addInputGroundSpeed!=='0',v=>{if(v)at.addInputGroundSpeed='1';else delete at.addInputGroundSpeed});b('Galáxia','Inverter ponto de saída','rotate-ccw',()=>'invertOutputPoint' in at&&at.invertOutputPoint!=='0',v=>{if(v)at.invertOutputPoint='1';else delete at.invertOutputPoint})}
  b('Avançado','nosync','zap',()=>'nosync' in at,v=>{if(v)at.nosync='';else delete at.nosync});tx('Avançado','Lua (id)','scroll-text',()=>at.lua||'',v=>{if(v)at.lua=v;else delete at.lua})}
 else if(m.kind==='J'){JT.fields(it,{n,b,c,sel,tx,pick:jPick,picking:jPicking})}
 else if(m.kind==='I'){tx('Geral','URL (XML)','link',()=>at.U||'',v=>{at.U=String(v).trim().replace(/^https?:\/\/(www\.)?transformice\.com\/images\//i,'').replace(/^\/+/,'')},{lazy:1});posXY('Geral');sel('Geral','Posição','layers',[['0','Fundo (D)'],['1','Frente (d)']],()=>at.F==='1'?'1':'0',v=>{at.F=v==='1'?'1':'0'})}
 else if(m.kind==='O'){n('Geral','Tipo (C)','shapes',()=>at.C,v=>at.C=v,{solo:1});posXY('Geral');n('Geral','Ângulo °','rotate-cw',()=>getP(at,0),v=>setP(at,0,v,DEFP.O),{solo:1});b('Aparência','Fantasma','ghost',()=>getP(at,1)==='1',v=>setP(at,1,v?1:0,DEFP.O))}
 else{if(it.tag==='P')n('Geral','Tipo (T)','shapes',()=>at.T,v=>{at.T=v;delete at.C},{solo:1});posXY('Geral');
  if(it.tag==='P'){b('Aparência','Frente','layers',()=>getP(at,0)==='1',v=>setP(at,0,v?1:0,DEFP.D));sel('Aparência','Espelhar','flip-horizontal-2',[[0,'Normal'],[1,'Espelhado'],[2,'Aleatório']],()=>getP(at,1),v=>setP(at,1,v,DEFP.D));
   const sl=MR.slotsOf(MR.decoPath(it));if(sl){const cur=MR.colorsOf(at);sl.forEach((d,i)=>{if(d!==undefined)c('Cores','Couleur '+i,'palette',()=>cur[i]||d,v=>{const cc=sl.map((x,k)=>cur[k]||x||'000000');cc[i]=v.slice(1).toUpperCase();at.C=cc.join(',');cur[i]=cc[i]})})}}
  else if(it.tag==='T')sel('Aparência','Brilho (CT)','sparkles',[['','Nenhum'],['1','Azul'],['2','Rosa']],()=>at.CT||'',v=>{if(v==='')delete at.CT;else at.CT=v})}
 const fld=(f,i)=>{const v=f.g?f.g():'',o=f.o,cell=(f.t==='n'||f.t==='c'||f.t==='b')&&!o.solo,lab=(ctl,cls='')=>`<label class="fr ${cell?'cell '+(f.t==='b'?'bool':''):''} ${cls}" title="${esc(f.l)}"><span class="fl">${ic(f.icn||'minus',14)}${f.l}</span>${ctl}</label>`;
  if(f.t==='b')return lab(`<input type="checkbox" class="switch" data-f="${i}" ${v?'checked':''}>`);
  if(f.t==='s'){const sl=`<select data-f="${i}">${o.opt.map(q=>`<option value="${q[0]}" ${String(q[0])===String(v)?'selected':''}>${q[1]}</option>`).join('')}</select>`;if(!o.pick)return lab(sl);return lab(`<span class="fc">${`<button type="button" class="btn2 pk ${o.picking&&o.picking()?'on':''}" data-f="${i}" data-act="pick" title="Selecionar terreno no mapa">${ic('crosshair',14)}</button>`}${sl}</span>`)}
  if(f.t==='c')return lab(`<input type="color" data-f="${i}" value="#${String(v).replace('#','').slice(-6).padStart(6,'0')}">`);
  if(f.t==='tint'){const has=v!==undefined&&v!==null&&v!=='';return `<div class="fr tintrow"><span class="fl">${ic(f.icn,14)}${f.l}</span>${has?`<span class="tintctl"><input type="color" data-f="${i}" value="#${String(v).replace('#','').slice(-6).padStart(6,'0')}"><button class="btn2" data-f="${i}" data-act="rm" title="Remover tint">${ic('x',13)}</button></span>`:`<button class="addtint" data-f="${i}" data-act="add" title="Multiplica a cor do sprite">${ic('plus',13)}Adicionar</button>`}</div>`}
  if(f.t==='t')return lab(`<input type="text" data-f="${i}" value="${esc(v)}">`);
  const un=o.units?`<div class="useg">${o.units.list.map(q=>`<button type="button" data-f="${i}" data-act="unit" data-u="${q[0]}" class="${o.units.get()===q[0]?'on':''}">${q[1]}</button>`).join('')}</div>`:'';
  return un+lab(`<input type="number" step="${o.step===undefined?'any':o.step}" ${o.min!==undefined?`min="${o.min}"`:''} data-f="${i}" value="${v}">`)};
 box.innerHTML=ord.map(sn=>{const fs=F.map((f,i)=>[f,i]).filter(([f])=>f.sec===sn);let body='',grp='';const flush=()=>{if(grp){body+=`<div class="pgrid">${grp}</div>`;grp=''}};
  fs.forEach(([f,i])=>{if(f.o.brk)flush();if((f.t==='n'||f.t==='c'||f.t==='b')&&!f.o.solo)grp+=fld(f,i);else{flush();body+=fld(f,i)}});flush();return`<div class="psec"><div class="pt">${ic(SECIC[sn]||'minus',14)}${sn}</div>${body}</div>`}).join('');
 const apply=(el,commitIt)=>{if(el.dataset.f===undefined)return;const f=F[+el.dataset.f];if(el.dataset.act==='pick'){f.o.pick();return}if(el.dataset.act==='unit'){f.o.units.set(el.dataset.u);mapUI(0);return}if(f.t==='tint'){if(el.dataset.act==='rm')f.s(null);else if(el.dataset.act==='add')f.s('808080');else f.s(el.value.slice(1))}else f.s(f.t==='b'?el.checked:el.value);dirty=1;if(commitIt){snap();mapUI(0);xmlSoon()}else xmlSoon()};
 box.oninput=e=>{if(e.target.type!=='checkbox'&&e.target.tagName!=='SELECT'&&e.target.tagName!=='BUTTON'){const ff=F[+e.target.dataset.f];if(ff&&ff.o.lazy)return;apply(e.target,0)}};box.onchange=e=>apply(e.target,1);box.onclick=e=>{const bt=e.target.closest('button[data-f]');if(bt)apply(bt,1)}}
$('mdel').onclick=()=>{const l=msList();if(!l.length)return;l.slice().sort((a,b)=>b.i-a.i).forEach(m=>{mapList(m.kind).splice(m.i,1);if(m.kind==='S'){JT.onRemoveS(m.i);lgOnRemoveS(m.i)}});S.msel=null;S.mm=[];commit()};
$('mdup').onclick=()=>{const src=msList();if(!src.length)return;const go=snapOn()?gridSize():10,nw=[];src.forEach(m=>{const l=mapList(m.kind),c=clone(l[m.i]);if(m.kind==='J')JT.move(c,go,go);else{c.at.X=Math.round(+c.at.X+go);c.at.Y=Math.round(+c.at.Y+go)}l.push(c);nw.push({kind:m.kind,i:l.length-1})});S.msel=nw[nw.length-1];S.mm=nw.length>1?nw:[];commit()};
function zSync(){const m=S.msel,l=m&&mapList(m.kind),it=l&&l[m.i],z=$('mz'),row=$('mzrow'),one=!!it&&S.mm.length<=1;z.disabled=!one;row.classList.toggle('dis',!one);if(!one){z.value='';z.removeAttribute('max');$('mzmax').textContent='';return}z.min=0;z.max=l.length-1;z.value=m.i;$('mzmax').textContent='(0–'+(l.length-1)+')'}
let zD=0;function zMove(v,fin){const m=S.msel;if(!m||S.mm.length>1){zSync();return}const l=mapList(m.kind);if(!l[m.i]){zSync();return}let j=Math.round(+v);if(isNaN(j))j=m.i;j=Math.max(0,Math.min(l.length-1,j));if(j!==m.i){const[it]=l.splice(m.i,1);l.splice(j,0,it);if(m.kind==='S'){JT.onMoveS(m.i,j);lgOnMoveS(m.i,j)}m.i=j;zD=1}if(fin){if(zD){zD=0;commit()}else zSync()}else if(zD){ui()}}
$('mz').addEventListener('input',e=>{if(e.fromStep)zMove($('mz').value,false)});$('mz').addEventListener('change',()=>zMove($('mz').value,true));
const modal=(t,h)=>{$('mt').textContent=t;$('mb').innerHTML=h;$('modal').hidden=false;icons($('mb'))};$('mx').onclick=()=>$('modal').hidden=true;$('modal').onmousedown=e=>{if(e.target===$('modal'))$('modal').hidden=true};

const CATIT={},CPLX=[6,10,11,17,18,19,20,21];
function thumbIt(t,L,H,o,tint){const k=[t,L,H,o||'',tint||''].join('|');return CATIT[k]||(CATIT[k]={tag:'S',at:Object.assign({T:String(t),X:0,Y:0,L:String(L),P:groundP(t)},t===13?{}:{H:String(H)},o?{o}:{},tint?{tint}:{})})}
function paintGround(cv,it,i,w,h,bw,bh,smax,ox,oy,rot){const d=2,a=(rot||0)*Math.PI/180,W=Math.abs(w*Math.cos(a))+Math.abs(h*Math.sin(a)),H=Math.abs(w*Math.sin(a))+Math.abs(h*Math.cos(a)),s=Math.min(bw/W,bh/H,smax),cw=Math.max(1,Math.round(W*s)),ch=Math.max(1,Math.round(H*s));
 cv.width=cw*d;cv.height=ch*d;cv.style.width=cw+'px';cv.style.height=ch+'px';const c=cv.getContext('2d');c.setTransform(d*s,0,0,d*s,cw*d/2,ch*d/2);c.translate(-ox,-oy);try{MR.drawOne(c,'S',it,i,1)}catch(e){}}
function paintThumbs(){document.querySelectorAll('canvas.th').forEach(cv=>{
 if(cv.dataset.t!==undefined){const t=+cv.dataset.t,circ=t===13,col=t===12||t===13?'324650':'',L=circ?20:40,H=40,it=thumbIt(t,L,H,col);paintGround(cv,it,0,40,40,64,48,1,0,0,0)}
 else if(cv.dataset.mk==='S'){const i=+cv.dataset.i,it=S.map.S[i];if(!it)return;const a=it.at,t=+a.T|0,circ=t===13,bx=+cv.dataset.box||30,col=t===12||t===13?(a.o||''):'',sm=thumbIt(t,circ?20:40,40,col,a.tint);paintGround(cv,sm,0,40,40,bx-2,bx-2,4,0,0,0)}})}
let thT=0;const thumbSoon=()=>{clearTimeout(thT);thT=setTimeout(paintThumbs,120)};
const gThumb=(i,box)=>{const a=S.map.S[i].at;return`<canvas class="th" data-mk="S" data-i="${i}" data-box="${box}" data-sg="${[a.T,a.L,a.H,a.o,a.tint,a.P].join('|')}"></canvas>`};
const OBJ=[0,1,2,3,4,6,7,10,11,12,13,14,15,16,17,18,19,20,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,89,90,91,92,93,94,95,96,97];
const GT0={3:1,5:4,6:4,7:0,9:15,10:17,11:4,15:28,17:4,18:4,19:41,20:49,21:60},GCL={0:'$Sol_Dur',1:'$Glacon',2:'$Sol_Rebond',4:'$Sol_Chocolat',8:'$Transparent',16:'$Sol_Dur'};
const CATS=[['P','Decorações','sparkles'],['O','Objetos','box'],['G','Terrenos','mountain'],['X','Outros','target']],CNT={P:312,O:OBJ.length,G:22,X:9};
const OTH=[['F','Queijo','$Fromage'],['T','Toca','$Trou_Souris'],['DS','Rato DS','DS'],['DC','Rato DC','DC'],['DC2','Rato DC2','DC2']];
function catList(tab){if(tab==='P')return Array.from({length:312},(_,i)=>({k:'P',v:i,l:'P'+i,src:`assets/decoration/P_${i}.svg`}));
 if(tab==='O')return OBJ.map(i=>({k:'O',v:i,l:'O'+i,src:MR.defUrl({at:{C:String(i)}})||`assets/object/$Objet_${i}.svg`}));
 if(tab==='G')return Array.from({length:22},(_,i)=>({k:'G',v:i,l:'T'+i,n:GN[i],src:GT0[i]!==undefined?`assets/ground/$T_${GT0[i]}.svg`:GCL[i]?`assets/ground/${GCL[i]}.svg`:'',col:i===12||i===13?'#6a7495':'#555',circ:i===13}));
 return OTH.map(o=>({k:'X',v:o[0],l:o[1],src:`assets/other/${o[2]}.svg`}))}
let MIM=[];try{MIM=JSON.parse(localStorage.athelis_mimgs||'[]').filter(m=>m&&m.u)}catch(e){}
const mimSave=()=>{try{localStorage.athelis_mimgs=JSON.stringify(MIM)}catch(e){}};
const normImgU=v=>String(v||'').trim().replace(/^https:\/\/images\.weserv\.nl\/\?url=/i,'').replace(/^https?:\/\/(www\.)?transformice\.com\/images\//i,'').replace(/^\/+/,'');
function jointsHTML(){return`<div class="cgrp"><div class="cgh">${ic('link',14)}<b>Joints</b></div><div class="cgcards">${JT.TYPES.map(t=>`<button data-k="J" data-v="${t}" title="${JT.TIP[t]}"><span class="pv" style="color:${JT.COL[t]}">${ic(JT.icon(t),30)}</span><i class="lb">${t}</i></button>`).join('')}</div>
 <div class="cgseg" title="Padrão: ao clicar num terreno, o ponto (P1/P2) vem desativado. Dinâmico: P1 e P2 sempre vêm ativados."><button data-jm="0" class="${JT.getMode()?'':'on'}">Padrão</button><button data-jm="1" class="${JT.getMode()?'on':''}">Dinâmico</button></div></div>`}
function mimHTML(){const fg=S.cat.mfg?1:0;return`<div class="cgrp"><div class="cgh">${ic('image',14)}<b>Imagens do mapa</b></div>
 <div class="cgadd"><input type="text" id="mim_u" placeholder="x_transformice/x_aventure/x_banniere/x_8.jpg" spellcheck="false" title="url_de_xml: caminho relativo a transformice.com/images/ (../ sobe um nível)"><button data-ma="add" title="Cadastrar imagem">${ic('plus',15)}</button></div>
 <div class="cgseg" title="Onde a imagem entra ao ser adicionada ao mapa"><button data-mfg="0" class="${fg?'':'on'}">${ic('image',13)}Fundo (D)</button><button data-mfg="1" class="${fg?'on':''}">${ic('layers',13)}Frente (d)</button></div>
 <div class="cgcards">${MIM.length?MIM.map((m,i)=>`<button data-k="M" data-v="${i}" title="${esc(m.u)}"><span class="pv"><img loading="lazy" src="${MR.imgUrl(m.u)}" alt="" onerror="this.style.visibility='hidden'"></span><i class="lb">${esc(m.u.split('/').pop())}</i><span class="cgx" data-ma="del" data-i="${i}" title="Remover card">${ic('x',11)}</span></button>`).join(''):''}</div></div>`}
function catUI(){const C=S.cat;$('ctabs').innerHTML=CATS.map(([k,n,i])=>`<button data-tab="${k}" class="${k===C.tab?'on':''}" title="${n}">${ic(i,16)}${n}<small>${CNT[k]}</small></button>`).join('');
 const q=C.q.trim().toLowerCase(),all=catList(C.tab),list=q?all.filter(x=>x.l.toLowerCase().includes(q)||String(x.v)===q||(x.n&&(x.n.toLowerCase().includes(q)||T(x.n).toLowerCase().includes(q)))):all;$('ccount').textContent=q?list.length+' / '+all.length:all.length+' itens';
 $('cgrid').innerHTML=list.length?list.map(x=>`<button class="${x.k==='G'?'g':''}" data-k="${x.k}" data-v="${x.v}" title="${x.l}${x.n?' · '+T(x.n):''}"><span class="pv">${x.k==='G'?`<canvas class="th" data-t="${x.v}"></canvas>`:`<img loading="lazy" src="${x.src}" alt="">`}</span><i class="lb">${x.l}</i></button>`).join('')+(C.tab==='X'&&!q?jointsHTML()+mimHTML():''):(C.tab==='X'&&!q?jointsHTML()+mimHTML():'<div class="none">Nada encontrado</div>');markArmed();paintThumbs()}
$('cgrid').addEventListener('keydown',e=>{if(e.target.id==='mim_u'&&e.key==='Enter'){e.preventDefault();const b=$('cgrid').querySelector('[data-ma="add"]');if(b)b.click()}});
$('ctabs').onclick=e=>{const b=e.target.closest('[data-tab]');if(b){S.cat.tab=b.dataset.tab;catUI();$('cgrid').scrollTop=0}};

$('cgrid').onclick=e=>{const ma=e.target.closest('[data-ma]');if(ma){e.stopPropagation();const a=ma.dataset.ma;if(a==='add'){const u=normImgU($('mim_u').value);if(!u){toast('Informe a url_de_xml da imagem');return}if(!MIM.some(m=>m.u===u))MIM.push({u});mimSave();catUI();toast('Card cadastrado')}else if(a==='del'){const i=+ma.dataset.i;if(S.place&&S.place.kind==='M')cancelPlace();MIM.splice(i,1);mimSave();catUI()}return}
 const jm=e.target.closest('[data-jm]');if(jm){JT.setMode(+jm.dataset.jm);document.querySelectorAll('#cgrid [data-jm]').forEach(x=>x.classList.toggle('on',+x.dataset.jm===JT.getMode()));return}
 const sg=e.target.closest('[data-mfg]');if(sg){S.cat.mfg=+sg.dataset.mfg;if(S.place&&S.place.kind==='M')S.place.it.at.F=S.cat.mfg?'1':'0';document.querySelectorAll('#cgrid [data-mfg]').forEach(x=>x.classList.toggle('on',+x.dataset.mfg===S.cat.mfg));return}
 const b=e.target.closest('button[data-k]');if(!b)return;const k=b.dataset.k;armPlace(k,k==='X'||k==='J'?b.dataset.v:+b.dataset.v);if(S.place)toast('Clique no mapa para adicionar: '+b.title)};
let xmode='l',xedit=false;
const xn=v=>$('xdec').checked?v:Math.round(v),xv=(k,v)=>(!$('xdec').checked&&/^[XYLH]$/.test(k)&&v!==''&&!isNaN(+v))?String(Math.round(+v)):v;
function xmlLines(){const M=S.map,o=[[0,'<C>']];const pa={};if(M.w!==800)pa.L=M.w;if(M.h!==400)pa.H=M.h;CFG_ORDER.slice(2).forEach(k=>{if(k in M.at)pa[k]=M.at[k]});Object.keys(M.at).forEach(k=>{if(!(k in pa)&&k!=='L'&&k!=='H'&&k!=='D'&&k!=='d')pa[k]=M.at[k]});
 [['D','0'],['d','1']].forEach(([k,fg])=>{const v=(M.I||[]).filter(it=>(it.at.F==='1'?'1':'0')===fg&&it.at.U).reverse().map(it=>`${it.at.U},${Math.round(+it.at.X)||0},${Math.round(+it.at.Y)||0}`).join(';');if(v)pa[k]=v});const at=Object.entries(pa).map(([k,v])=>`${k}="${xv(k,v)}"`).join(' ');o.push([1,at?`<P ${at} />`:'<P />'],[1,'<Z>']);
 const grp=(n,items)=>{o.push([2,`<${n}>`]);items.forEach(it=>{const a={...it.at};if(it.tag==='P'){const sl=MR.slotsOf(MR.decoPath(it));if(sl&&sl.length){const cur=MR.colorsOf(a);a.C=sl.map((d,i)=>cur[i]||d||'000000').join(',')}}o.push([3,`<${it.tag} ${Object.entries(a).map(([k,v])=>`${k}="${xv(k,v)}"`).join(' ')} />`])});o.push([2,`</${n}>`])};
 grp('S',M.S);grp('D',M.D);grp('O',M.O);o.push([2,'<L>']);let n=0;for(const fg of[0,1])S.layers.forEach(l=>{if(l.vis)l.items.forEach(it=>segsOf(it).forEach(s=>{if(s.fg===fg){n++;o.push([3,`<JD P1="${xn(s.a[0])},${xn(s.a[1])}" P2="${xn(s.b[0])},${xn(s.b[1])}" c="${s.c},${s.w},${s.al},${s.fg}"${lgAttr(l)} />`])}}))});
 const jl=M.J||[];jl.forEach(j=>o.push([3,JT.xml(j,$('xdec').checked)]));
o.push([2,'</L>'],[1,'</Z>'],[0,'</C>']);return{o,n,nj:jl.length}}
const hl=s=>esc(s).replace(/(&lt;\/?)(\w+)|(\w+)="([^"]*)"|(\/?&gt;)/g,(m,a,b,c,d,e)=>a?`<span class="p">${a}</span><span class="t">${b}</span>`:c?`<span class="a">${c}</span><span class="p">=</span><span class="v">"${d}"</span>`:`<span class="p">${e}</span>`);
function xml(){const{o,n,nj}=xmlLines(),single=o.map(l=>l[1]).join(''),ascii=!/[^\x00-\x7f]/.test(single),kb=(ascii?single.length:new Blob([single]).size)/1024;let ex=0;o.forEach(l=>ex+=l[0]+1);const prettyKb=(single.length+ex-1)/1024;
 $('kb').textContent=kb.toFixed(2)+' KB · '+n+' JD'+(nj?' + '+nj+' joints':'');$('xinfo').textContent=`${kb.toFixed(2)} KB (linha única) · ${prettyKb.toFixed(2)} KB (organizado) · ${n} JD`+(nj?` + ${nj} joints`:'');
 if(xmode==='l'){if(!xedit)$('xta').value=single}else $('xout').innerHTML=o.map(l=>'\t'.repeat(l[0])+hl(l[1])).join('\n')}
$('xmode').onclick=()=>{xmode=xmode==='l'?'p':'l';$('xbar').classList.toggle('pretty',xmode==='p');$('xta').hidden=xmode==='p';$('xout').hidden=xmode==='l';$('xmode').innerHTML=ic(xmode==='l'?'list':'braces');xml()};
$('xdec').onchange=()=>{xedit=false;$('xapply').classList.remove('dirty');localStorage.athelis_xdec=$('xdec').checked?1:0;xml()};
$('xta').addEventListener('input',()=>{xedit=true;$('xapply').classList.add('dirty')});
$('xta').addEventListener('paste',()=>setTimeout(()=>{if($('xta').value.trim().startsWith('<'))applyXML()},40));
$('xta').addEventListener('keydown',e=>{if(e.ctrlKey&&e.key==='Enter')applyXML()});
function applyXML(){const t=$('xta').value;if(!t.trim())return;loadXML(t)}$('xapply').onclick=applyXML;
$('xcopy').onclick=()=>navigator.clipboard.writeText(xmlLines().o.map(l=>l[1]).join(''));$('xdl').onclick=()=>dl('mapa.xml',xmlLines().o.map(l=>'\t'.repeat(l[0])+l[1]).join('\n'));
$('xfile').onclick=()=>pick(t=>{$('xta').value=t;loadXML(t)});
$('xres').onpointerdown=e=>{e.preventDefault();const y0=e.clientY,h0=$('xout').offsetHeight,mv=ev=>{$('xout').style.height=Math.max(100,Math.min(innerHeight*.8,h0-(ev.clientY-y0)))+'px'},up=()=>{removeEventListener('pointermove',mv);removeEventListener('pointerup',up)};addEventListener('pointermove',mv);addEventListener('pointerup',up)};
const parseXML=t=>{const P=x=>new DOMParser().parseFromString(x,'text/xml');let d=P(t);if(d.querySelector('parsererror')){d=P('<R>'+t+'</R>');if(d.querySelector('parsererror'))return null}return d};
const attrsOf=el=>{const o={};[...el.attributes].forEach(a=>o[a.name]=a.value);return o};
function resetAll(map,layers){S.map=map||newMap();if(!layers){S.uid=1;S.layers=[]}S.layers=layers||[newLayer('Camada 1')];S.cur=Math.min(S.cur,S.layers.length-1);S.cur=0;selClear();S.msel=null;S.pts=[];S.drag=null;S.exp=new Set(['L'+S.layers[0].id]);S.lim={};xedit=false;$('xapply').classList.remove('dirty');closePop()}
function loadXML(t){const d=parseXML(t.trim());if(!d){alert('XML inválido');return}const root=d.documentElement,C=root.tagName==='C'?root:d.querySelector('C');let map=null;
 if(C){map=newMap();const P=[...C.children].find(e=>e.tagName==='P');if(P){const at=attrsOf(P);map.w=+at.L||800;map.h=+at.H||400;delete at.L;delete at.H;map.at=at;rollBg()}
  const Z=[...C.children].find(e=>e.tagName==='Z');if(Z){const rd=n=>{const g=[...Z.children].find(e=>e.tagName===n);return g?[...g.children].map(c=>({tag:c.tagName,at:attrsOf(c)})):[]};map.S=rd('S').filter(i=>i.tag==='S');map.D=rd('D');map.O=rd('O').filter(i=>i.tag==='O')}
  map.I=[];[['D',0],['d',1]].forEach(([k,fg])=>{if(map.at[k]===undefined)return; const L=[];String(map.at[k]).split(';').forEach(q=>{const p=q.split(','),u=(p[0]||'').trim();if(!u)return;L.push({tag:'I',at:{U:u,X:String(Math.round(+p[1])||0),Y:String(Math.round(+p[2])||0),F:fg?'1':'0'}})});map.I.push(...L.reverse());delete map.at[k]})}
 const lays=new Map(),getL=(m1,m2)=>{const a=m1||m2,b=m2||m1,key=a+'|'+b;let l=lays.get(key);if(!l){l=newLayer(a===''?'Importado':'Importado · terreno '+(a===b?a:a+'/'+b));if(a!==''){l.gid=a;if(b!==a)l.gid2=b}lays.set(key,l)}return l};
 const jl=[];d.querySelectorAll('JD,JP,JPL,JR').forEach(j=>{if(!JT.isDraw(j)){jl.push(JT.fromXML(j));return}const p1=(j.getAttribute('P1')||'0,0').split(',').map(Number),p2=(j.getAttribute('P2')||'0,0').split(',').map(Number),c=(j.getAttribute('c')||'ffffff,3,1,0').split(',');getL((j.getAttribute('M1')||'').trim(),(j.getAttribute('M2')||'').trim()).items.push({k:'s',id:S.uid++,a:p1,b:p2,c:(c[0]||'ffffff').replace('#',''),w:+c[1]||3,al:c[2]===undefined||c[2]===''?1:+c[2],fg:+c[3]?1:0})});
 const lsI=[...lays.values()],tm=map||S.map;tm.J=jl;resetAll(tm,lsI.length?[...lsI,newLayer('Camada 1')]:null);snap();ui();fit()}
function newMapAll(){if(!confirm('Criar novo mapa? Isso apaga o mapa e todos os desenhos.'))return;resetAll(newMap(),null);snap();ui();fit()}$('xnew').onclick=newMapAll;
function dl(n,t,type){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([t],{type:type||'text/plain'}));a.download=n;a.click()}
function pick(cb){const f=$('fpick');f.value='';f.onchange=()=>{const r=new FileReader();r.onload=()=>cb(r.result);f.files[0]&&r.readAsText(f.files[0])};f.click()}
$('saveproj').onclick=()=>dl('project.athelis.json',JSON.stringify({app:'Athelis',v:4,layers:S.layers,cur:S.cur,map:S.map,uid:S.uid,imgs:S.imgs.map(({el,...r})=>r),presets,assets,afolders,fonts:S.fonts,mim:MIM,bgRand:S.bgRand}));
$('loadproj').onclick=()=>pick(async t=>{let o;try{o=JSON.parse(t)}catch(e){alert('Arquivo de projeto inválido');return}if(!o||typeof o!=='object'||(!o.layers&&!o.map)){alert('Arquivo de projeto inválido');return}if(o.bgRand!==undefined)S.bgRand=o.bgRand;if(Array.isArray(o.mim)){MIM=o.mim.filter(m=>m&&m.u);mimSave();catUI()}for(const f of o.fonts||[]){await regFont(f.name,f.data);if(!S.fonts.some(x=>x.name===f.name))S.fonts.push(f)}fillFonts();
 const layers=(o.layers||[]).map(l=>{if(l.segs&&!l.items)l.items=l.segs.map(s=>({k:'s',...s}));delete l.segs;l.items.forEach(it=>{if(!it.id)it.id=++S.uid});return l});S.uid=Math.max(S.uid,o.uid||0,...layers.flatMap(l=>[l.id||0,...l.items.map(i=>i.id)]))+1;layers.forEach(l=>{if(!l.id)l.id=S.uid++});
 S.imgs=[];(o.imgs||[]).forEach(m=>addImg(m.name,m.src,m));if(o.presets){presets=o.presets;presUI()}if(o.assets){assets=o.assets;assets.forEach(a=>{if(!a.thumb)a.thumb=makeThumb(a.items)});afolders=o.afolders||[];assetsUI()}resetAll(o.map||newMap(),layers.length?layers:null);S.cur=Math.min(o.cur||0,S.layers.length-1);snap();ui();fit()});
const thI=()=>{$('theme').innerHTML=ic(document.documentElement.dataset.theme==='dark'?'sun':'moon')};
$('theme').onclick=()=>{const h=document.documentElement;h.dataset.theme=h.dataset.theme==='dark'?'light':'dark';localStorage.athelis_theme=h.dataset.theme;thI();readTheme();dirty=1};
if(localStorage.athelis_theme)document.documentElement.dataset.theme=localStorage.athelis_theme;
$('wmreset').onclick=()=>WM.reset();$('fitb').onclick=fit;
$('grid').oninput=()=>dirty=1;
function syncFr(){S.showFrame=$('showfr').checked;$('sb-fr').classList.toggle('on',S.showFrame);dirty=1}$('sb-fr').onclick=()=>$('showfr').click();
[['gridon',0],['snap',0],['mag',1],['showfr',1]].forEach(([id,def])=>{const e=$(id),k='athelis_t_'+id,v=localStorage[k];e.checked=v===undefined?!!def:v==='1';e.addEventListener('change',()=>{localStorage[k]=e.checked?'1':'0';if(id==='showfr')syncFr();dirty=1})});
$('xdec').checked=localStorage.athelis_xdec!=='0';syncFr();
function baseUI(){const m=S.mode==='map',cb=$('showmap'),rg=$('mapop'),lab=cb.closest('label'),sp=lab.querySelector('span'),em=sp.querySelector('em');
 cb.checked=m?baseState.drawOn:baseState.mapOn;rg.value=m?baseState.drawOp:baseState.mapOp;em.textContent=m?'Desenho':'Mapa';
 const sv=sp.querySelector('svg');if(sv)sv.outerHTML=ic(m?'pencil':'map',16);
 lab.title=m?'Mostrar/ocultar o desenho (camadas de linhas) no modo Mapa':'Mostrar/ocultar mapa base';
 rg.title=m?'Opacidade do desenho no modo Mapa: '+rg.value+'%':'Opacidade do mapa base no modo Desenhar: '+rg.value+'%'}
$('showmap').addEventListener('change',()=>{if(S.mode==='map'){baseState.drawOn=$('showmap').checked;localStorage.athelis_t_showdraw=baseState.drawOn?'1':'0'}else{baseState.mapOn=$('showmap').checked;localStorage.athelis_t_showmap=baseState.mapOn?'1':'0'}dirty=1});
$('mapop').addEventListener('input',()=>{const v=+$('mapop').value||0;if(S.mode==='map'){baseState.drawOp=v;localStorage.athelis_drawop=v}else{baseState.mapOp=v;localStorage.athelis_mapop=v}baseUI();dirty=1});
icons();baseUI();thI();readTheme();fillFonts();tSync();iSync();
WM.init({'w-cat':{mode:'L',dh:540},'w-map':{mode:'R',col:1},'w-props':{mode:'L'},'w-layers':{mode:'F',anchor:1,w:340,h:360,x:0,y:0},'w-text':{mode:'R',col:1},'w-imgs':{mode:'R',col:1},'w-assets':{mode:'R',col:1},'w-i2l':{mode:'R',col:1},'w-color':{mode:'R',col:1},'w-opt':{mode:'R',col:1},'w-shapes':{mode:'R',col:1},'w-paths':{mode:'R',col:1}});
applyModeWins();catUI();
MR.onload=()=>{dirty=1;thumbSoon()};
if(location.protocol==='file:'){const w=document.createElement('div');w.id='warn';w.textContent='Abra via servidor local (start.bat / start.sh) para carregar os SVGs da pasta assets.';$('stage').appendChild(w)}
S.layers.push(newLayer('Camada 1'));S.exp.add('L'+S.layers[0].id);presUI();assetsUI();imgsUI();setTool('V');showMT('cfg');
(function loop(){if(S.mode==='map'&&JT.live())dirty=1;if(dirty){dirty=0;draw()}requestAnimationFrame(loop)})();
size();fit();snap();ui();

function exportCanvas(o){const W=Math.max(1,Math.round(S.map.w||800)),H=Math.max(1,Math.round(S.map.h||400)),sc=Math.max(.1,Math.min(o.scale,16000/Math.max(W,H))),c=document.createElement('canvas');c.width=Math.max(1,Math.round(W*sc));c.height=Math.max(1,Math.round(H*sc));
 const ex=c.getContext('2d');ex.setTransform(sc,0,0,sc,0,0);
 if(o.solid){ex.fillStyle=o.solid;ex.fillRect(0,0,W,H)}
 const paint=im=>{if(!im.vis||!im.el.complete||!im.el.naturalWidth)return;const b=imgBox(im);ex.save();ex.globalAlpha=im.op;ex.translate(b.cx,b.cy);ex.rotate(b.th);ex.drawImage(im.el,-b.W/2,-b.H/2,b.W,b.H);ex.restore()};
 if(o.imgs)S.imgs.forEach(im=>{if(!imgRel(im))paint(im)});
 const J=fg=>{if(o.map)JT.lines(ex,fg,1);ex.lineCap='round';ex.lineJoin='round';ex.globalAlpha=1;let pc=null,pw=0,open=false;const flush=()=>{if(open){ex.stroke();open=false}};
  const one=q=>{if(q.fg!==fg)return;
   if(q.al>=1){if(!open||q.c!==pc||q.w!==pw){flush();ex.globalAlpha=1;ex.strokeStyle='#'+q.c;ex.lineWidth=q.w;ex.beginPath();open=true;pc=q.c;pw=q.w}ex.moveTo(q.a[0],q.a[1]);ex.lineTo(q.b[0],q.b[1])}
   else{flush();ex.globalAlpha=q.al;ex.strokeStyle='#'+q.c;ex.lineWidth=q.w;ex.beginPath();ex.moveTo(q.a[0],q.a[1]);ex.lineTo(q.b[0],q.b[1]);ex.stroke()}};
  S.layers.forEach(l=>{if(fg===0){flush();if(o.imgs)S.imgs.forEach(im=>{if(im.rl===l.id&&im.rp==='b')paint(im)})}if(l.vis)l.items.forEach(it=>{if(it.k==='s')one(it);else for(const q of segsOf(it))one(q)});if(fg===0){flush();if(o.imgs)S.imgs.forEach(im=>{if(im.rl===l.id&&im.rp!=='b')paint(im)})}});flush();ex.globalAlpha=1};
 ex.save();ex.beginPath();ex.rect(0,0,W,H);ex.clip();
 MR.render(ex,S.map,{rbg:S.bgRand,show:o.map,hideInvis:!!o.hideInv,alpha:o.mapA,joints:J,sel:null,z:sc,vis:S.mvis,view:[-8,-8,W+8,H+8]});
 ex.restore();return c}
function openExport(){const W=Math.round(S.map.w||800),H=Math.round(S.map.h||400),hasImg=S.imgs.some(i=>i.vis);
 modal('Salvar mapa como imagem',`<div class="exp"><div class="exp-pv"><canvas id="ex_pv"></canvas></div><div class="exp-c">
 <label class="fr"><span class="fl"><i data-ic="image"></i>Formato</span><select id="ex_f"><option value="png" selected>PNG (sem perdas)</option><option value="jpeg">JPEG</option><option value="webp">WEBP</option></select></label>
 <label class="fr" id="ex_qr"><span class="fl"><i data-ic="sliders-horizontal"></i>Qualidade</span><span class="exq"><input type="range" id="ex_q" min="1" max="100" value="92"><b id="ex_qv">92</b></span></label>
 <label class="fr"><span class="fl"><i data-ic="scaling"></i>Escala</span><select id="ex_s"><option value="1" selected>1× (${W}×${H})</option><option value="2">2×</option><option value="3">3×</option><option value="4">4×</option><option value="0.5">0,5×</option></select></label>
 <label class="fr"><span class="fl"><i data-ic="paint-bucket"></i>Fundo</span><select id="ex_b"><option value="cur" selected>Atual (cor do canvas)</option><option value="tr">Transparente</option><option value="col">Cor sólida…</option></select></label>
 <label class="fr" id="ex_cr" hidden><span class="fl"><i data-ic="palette"></i>Cor do fundo</span><input type="color" id="ex_c" value="#ffffff"></label>
 <label class="fr"><span class="fl"><i data-ic="map"></i>Incluir mapa base</span><input type="checkbox" class="switch" id="ex_m" ${baseState.mapOn?'checked':''}></label>
 <label class="fr" id="ex_hr"><span class="fl"><i data-ic="eye-off-2"></i>Ocultar terrenos invisíveis</span><input type="checkbox" class="switch" id="ex_h" checked></label>
 <label class="fr"><span class="fl"><i data-ic="image"></i>Imagens de referência</span><input type="checkbox" class="switch" id="ex_i" ${hasImg?'checked':''}></label>
 <label class="fr"><span class="fl"><i data-ic="pencil"></i>Nome</span><input id="ex_n" value="mapa"></label>
 <div class="hintp" id="ex_info"></div>
 <div class="actbar"><button id="ex_save" class="pri" data-ic="download">Salvar</button><button id="ex_copy" data-ic="copy">Copiar</button></div></div></div>`);
 const g=id=>$(id),MT={png:'image/png',jpeg:'image/jpeg',webp:'image/webp'};
 const opts=(sc)=>{const bg=g('ex_b').value,f=g('ex_f').value;let solid=null;if(bg==='cur')solid='#6a7495';else if(bg==='col')solid=g('ex_c').value;else if(f==='jpeg')solid='#ffffff';return{scale:sc,solid,map:g('ex_m').checked,mapA:1,imgs:g('ex_i').checked,hideInv:g('ex_m').checked&&g('ex_h').checked}};
 const sync=()=>{const f=g('ex_f').value;g('ex_hr').hidden=!g('ex_m').checked;g('ex_qr').hidden=f==='png';g('ex_cr').hidden=g('ex_b').value!=='col';g('ex_qv').textContent=g('ex_q').value;const tr=g('ex_b').value==='tr'&&f==='jpeg';g('ex_info').textContent=tr?'JPEG não tem transparência: o fundo sai branco.':'';};
 let pt=0;const pv=()=>{sync();clearTimeout(pt);pt=setTimeout(()=>{const sc=Math.min(1,520/Math.max(W,1)),c=exportCanvas({...opts(sc)}),p=g('ex_pv');if(!p)return;p.width=c.width;p.height=c.height;p.getContext('2d').drawImage(c,0,0);p.parentNode.classList.toggle('chk',g('ex_b').value==='tr');const k=+g('ex_s').value;g('ex_info').textContent=(g('ex_info').textContent?g('ex_info').textContent+' ':'')+'Saída: '+Math.round(W*k)+' × '+Math.round(H*k)+' px'},40)};
 ['ex_f','ex_q','ex_s','ex_b','ex_c','ex_m','ex_h','ex_i'].forEach(id=>g(id).addEventListener('input',pv));pv();
 const blob=()=>new Promise((res,rej)=>{const f=g('ex_f').value,c=exportCanvas(opts(+g('ex_s').value));c.toBlob(b=>b?res(b):rej(new Error('Falha ao gerar a imagem (tamanho grande demais?)')),MT[f],f==='png'?undefined:(+g('ex_q').value)/100)});
 const fname=()=>((g('ex_n').value||'mapa').replace(/[\\/:*?"<>|]+/g,'_'))+'.'+(g('ex_f').value==='jpeg'?'jpg':g('ex_f').value);
 g('ex_save').onclick=async()=>{try{const b=await blob(),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=fname();a.click();setTimeout(()=>URL.revokeObjectURL(a.href),4000);toast('Imagem salva ('+Math.max(1,Math.round(b.size/1024))+' KB)')}catch(err){toast(err.message)}};
 g('ex_copy').onclick=async()=>{try{if(!navigator.clipboard||!window.ClipboardItem){toast('Este navegador não permite copiar imagens (use Salvar)');return}const c=exportCanvas(opts(+g('ex_s').value)),pb=new Promise((res,rej)=>c.toBlob(b=>b?res(b):rej(new Error('Falha ao gerar a imagem')),'image/png'));await navigator.clipboard.write([new ClipboardItem({'image/png':pb})]);toast('Imagem copiada'+(g('ex_f').value==='png'?'':' (como PNG: a área de transferência só aceita PNG)'))}catch(err){toast('Não foi possível copiar: '+(err.message||err))}}}
$('shot').onclick=openExport;

['scw','scw2'].forEach(id=>$(id).addEventListener('change',e=>{S.scaleW=e.target.checked;$('scw').checked=$('scw2').checked=S.scaleW;const T=popT&&!popT.map?popT:null;if(T)T.T.ws=S.scaleW?wSnap():null;toast(S.scaleW?'Redimensionar também muda a largura das linhas':'Redimensionar só move as coordenadas')}));
T2.init();CA.init();
const AS={db:null,saved:-1,ready:false};
const asOpen=()=>Athelis.db();
const asGet=db=>Athelis.get('k','last');
const asPut=(db,v)=>Athelis.put('k','last',v);
function asSave(){if(!AS.ready||!AS.db||AS.saved===rev||S.drag||CA.pending())return;const r=rev;let v;try{v=JSON.stringify({v:3,t:Date.now(),layers:S.layers,cur:S.cur,map:S.map,uid:S.uid,imgs:S.imgs.map(({el,...x})=>x),fonts:S.fonts,bgRand:S.bgRand})}catch(e){return}asPut(AS.db,v).then(ok=>{if(ok)AS.saved=r})}
(async()=>{AS.db=await asOpen();const v=AS.db?await asGet(AS.db):null;let ok=true;
 if(v){try{const o=JSON.parse(v);if((o.layers&&o.layers.length)||o.map){
  for(const f of o.fonts||[]){await regFont(f.name,f.data);if(!S.fonts.some(x=>x.name===f.name))S.fonts.push(f)}fillFonts();
  const layers=(o.layers||[]).map(l=>{if(l.segs&&!l.items)l.items=l.segs.map(s=>({k:'s',...s}));delete l.segs;l.items.forEach(it=>{if(!it.id)it.id=++S.uid});return l});
  S.uid=Math.max(S.uid,o.uid||0,...layers.flatMap(l=>[l.id||0,...l.items.map(i=>i.id)]))+1;layers.forEach(l=>{if(!l.id)l.id=S.uid++});
  if(o.bgRand!==undefined)S.bgRand=o.bgRand;S.imgs=[];(o.imgs||[]).forEach(m=>addImg(m.name,m.src,m));resetAll(o.map||newMap(),layers.length?layers:null);S.cur=Math.min(o.cur||0,S.layers.length-1);snap();ui();fit();toast('Último mapa restaurado')}}
  catch(e){ok=false;console.error('autosave',e);toast('Não foi possível restaurar o último mapa (salvamento automático pausado)')}}
 if(ok){AS.saved=rev;AS.ready=true}
 setInterval(asSave,4000);addEventListener('visibilitychange',()=>{if(document.hidden)asSave()});addEventListener('pagehide',asSave)})();


;['keydown','keyup'].forEach(ev=>document.addEventListener(ev,e=>{if(e.key==='Shift'&&S.shiftHeld!==(ev==='keydown')){S.shiftHeld=ev==='keydown';if(S.pts.length||(S.drag&&S.drag.shape))dirty=1}}));
document.addEventListener('selectstart',e=>{const t=e.target&&e.target.nodeType===1?e.target:e.target&&e.target.parentElement;if(t&&t.closest&&t.closest('input,textarea,select,#xout'))return;e.preventDefault()});

addEventListener('langchange',()=>{catUI();mapUI();mprops()});
