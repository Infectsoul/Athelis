'use strict';
const JT=(()=>{
let S=null,MR=null,gname=()=>'';
const TYPES=['JD','JP','JPL','JR'];
const COL={JD:'#4dd0e1',JP:'#81c784',JPL:'#ffb74d',JR:'#ba68c8'};
const ICN={JD:'ruler',JP:'move-horizontal',JPL:'hierarchy',JR:'rotate-cw'};
const TIP={JD:'Joint de distância (JD): mantém dois pontos a uma mesma distância',JP:'Joint prismática (JP): trava a rotação e pode limitar o movimento em um eixo',JPL:'Joint de polias (JPL): liga dois terrenos por uma polia',JR:'Joint de revolução (JR): permite girar um terreno em torno de um ponto'};
const KEYS=['M1','M2','P1','P2','P3','P4','AXIS','LIM1','LIM2','MV','A','R','HZ','AMP','c'];
const AXES=[['','Nenhum'],['0,-1','Baixo'],['0,1','Cima'],['-1,0','Direita'],['1,0','Esquerda'],['-1,-1','Diagonal inferior direita'],['1,-1','Diagonal inferior esquerda'],['-1,1','Diagonal superior direita'],['1,1','Diagonal superior esquerda']];
let MODE=0;
const num=(v,d=0)=>{v=parseFloat(v);return isNaN(v)?d:v};
const rnd=v=>Math.round(v*100)/100;
const fnum=(v,d=4)=>String(+(+v).toFixed(d));
const SPU=(()=>{let m={};try{m=JSON.parse(localStorage.athelis_spu||'{}')||{}}catch(e){}return{get:k=>m[k]==='u'?'u':'n',set:(k,v)=>{m[k]=v==='u'?'u':'n';try{localStorage.athelis_spu=JSON.stringify(m)}catch(e){}}}})();
const pt=s=>{if(s===undefined||s===null||s==='')return null;const p=String(s).split(','),x=parseFloat(p[0]),y=parseFloat(p[1]);return isNaN(x)||isNaN(y)?null:[x,y]};
const ptS=p=>rnd(p[0])+','+rnd(p[1]);
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
const gnd=k=>{const g=(S.map.S||[])[k|0];return g?[num(g.at.X),num(g.at.Y)]:null};
const zOf=(at,s)=>{const v=at['M'+s];return v===undefined||v===''?0:(parseInt(v,10)||0)};
function anchor(j,s){return pt(j.at['P'+s])||gnd(zOf(j.at,s))}
function groundAt(raw){if(S.mvis&&S.mvis.S===0)return -1;const l=S.map.S||[];for(let i=l.length-1;i>=0;i--)if(MR.hit('S',l[i],i,raw[0],raw[1]))return i;return -1}
function ends(j){const a=anchor(j,1),b=anchor(j,2);if(!a&&!b)return null;return[a||b,b||a]}
function pulley(j,A,B){return[pt(j.at.P3)||[A[0],A[1]-60],pt(j.at.P4)||[B[0],B[1]-60]]}
function rcenter(j){return pt(j.at.P1)||gnd(zOf(j.at,2))||gnd(zOf(j.at,1))}
function poly(j){const e=ends(j);if(!e)return[];if(j.tag==='JPL'){const q=pulley(j,e[0],e[1]);return[e[0],q[0],q[1],e[1]]}if(j.tag==='JR'){const c=rcenter(j),g=gnd(zOf(j.at,1));return c&&g?[c,g]:[]}return e}
function parts(j,on){const at=j.at,o=[];const e=ends(j);if(!e)return o;
 if(j.tag==='JR'){const c=rcenter(j);if(c&&(on||'P1' in at))o.push({k:'a1',p:c});return o}
 if(on||'P1' in at)o.push({k:'a1',p:e[0]});if(on||'P2' in at)o.push({k:'a2',p:e[1]});
 if(j.tag==='JPL'){const q=pulley(j,e[0],e[1]);o.push({k:'p3',p:q[0]},{k:'p4',p:q[1]})}return o}
function segD(p,a,b){const dx=b[0]-a[0],dy=b[1]-a[1],l=dx*dx+dy*dy;let t=l?((p[0]-a[0])*dx+(p[1]-a[1])*dy)/l:0;t=Math.max(0,Math.min(1,t));return Math.hypot(p[0]-a[0]-t*dx,p[1]-a[1]-t*dy)}
function hit(raw,z,selI){const L=S.map.J||[];if(!L.length||(S.mvis&&S.mvis.J===0))return null;const tol=9/z;
 const test=(i,on)=>{const j=L[i];for(const h of parts(j,on))if(Math.hypot(h.p[0]-raw[0],h.p[1]-raw[1])<=tol)return{i,part:h.k};const pl=poly(j);for(let k=0;k+1<pl.length;k++)if(segD(raw,pl[k],pl[k+1])<=6/z)return{i,part:'body'};return null};
 if(selI!=null&&L[selI]){const r=test(selI,true);if(r)return r}
 for(let i=L.length-1;i>=0;i--){const r=test(i,false);if(r)return r}return null}
function make(tag,t1,t2){const at={},p1=t1.p.map(Math.round),p2=t2.p.map(Math.round);
 if(t1.m>0)at.M1=String(t1.m);if(t2.m>0)at.M2=String(t2.m);if(!(MODE===0&&t1.m>=0))at.P1=ptS(p1);if(tag!=='JR'&&!(MODE===0&&t2.m>=0))at.P2=ptS(p2);
 if(tag==='JPL'){at.P3=ptS([p1[0],p1[1]-60]);at.P4=ptS([p2[0],p2[1]-60])}return{tag,at}}
function target(raw,w){return{m:groundAt(raw),p:[w[0],w[1]]}}
function place(P,w,raw,add){const t=target(raw,w);P.js.push(t);if(P.js.length<2)return false;const a=P.js[0],b=P.js[1];P.js=[];add(make(P.v,a,b));return true}
function snapshot(j){const o={};['P1','P2','P3','P4'].forEach(k=>{if(k in j.at)o[k]=pt(j.at[k])});return o}
function move(j,dx,dy){['P1','P2','P3','P4'].forEach(k=>{const p=pt(j.at[k]);if(p)j.at[k]=ptS([p[0]+dx,p[1]+dy])})}
function drag(d,raw,snapV){const j=d.j,at=j.at;const sp=p=>snapV?[snapV(p[0]),snapV(p[1])]:p,r=p=>[Math.round(p[0]),Math.round(p[1])];
 if(d.part==='body'){let dx=raw[0]-d.rs[0],dy=raw[1]-d.rs[1];const o=d.orig,k0=Object.keys(o)[0];if(snapV&&k0&&o[k0]){dx=snapV(o[k0][0]+dx)-o[k0][0];dy=snapV(o[k0][1]+dy)-o[k0][1]}Object.keys(o).forEach(k=>{if(o[k])at[k]=ptS(r([o[k][0]+dx,o[k][1]+dy]))});return}
 const p=r(sp(raw));
 if(d.part==='a1'){const old=at.P1;at.P1=ptS(p);if(j.tag==='JR'&&'P2' in at&&at.P2===old)at.P2=ptS(p)}
 else if(d.part==='a2')at.P2=ptS(p);else if(d.part==='p3')at.P3=ptS(p);else if(d.part==='p4')at.P4=ptS(p)}
function box(j){const pts=[];['P1','P2','P3','P4'].forEach(k=>{const p=pt(j.at[k]);if(p)pts.push(p)});if(!pts.length)poly(j).forEach(p=>pts.push(p));if(!pts.length)return null;const xs=pts.map(p=>p[0]),ys=pts.map(p=>p[1]);return[Math.min(...xs),Math.min(...ys),Math.max(...xs),Math.max(...ys)]}
const label=(j,i)=>{const a=zOf(j.at,1),b=zOf(j.at,2);return j.tag+' · Z'+a+' → Z'+b};
const sub=j=>{const a=anchor(j,1);return a?Math.round(a[0])+', '+Math.round(a[1]):''};
const icon=t=>ICN[t]||'link';
const motorSp=j=>{if(!('MV' in j.at))return 0;const q=String(j.at.MV).split(',');return q[1]===undefined||q[1]===''?0:num(q[1])};
const moving=j=>(j.tag==='JR'||(j.tag==='JP'&&!!j.at.AXIS))&&motorSp(j)!==0;
function live(){if(!S||(S.mvis&&S.mvis.J===0))return false;return(S.map.J||[]).some(moving)}
const flow=(j,z)=>{const sp=motorSp(j);if(!sp||!moving(j))return 0;const v=(sp<0?-1:1)*Math.min(300,Math.abs(sp)*12+8),d=-(performance.now()/1000*v)/z;return j.tag==='JR'?-d:d};
function setM(j,s,g){if(g>0)j.at['M'+s]=String(g);else delete j.at['M'+s]}
const cOf=at=>{const q=String(at.c||'').split(',');return{col:(q[0]||'ffffff').replace('#',''),w:q[1]===undefined||q[1]===''?3:+q[1],al:q[2]===undefined||q[2]===''?1:+q[2],fg:+q[3]?1:0}};
function lines(cx,fg,alpha){if(S.mvis&&S.mvis.J===0)return;const L=S.map.J||[];let any=false;
 for(const j of L){if(!('c' in j.at))continue;const c=cOf(j.at);if(c.fg!==fg)continue;const pl=j.tag==='JR'?(()=>{const e=ends(j);return e?[e[0],e[1]]:[]})():j.tag==='JPL'?poly(j):(ends(j)||[]);if(pl.length<2)continue;
  if(!any){cx.save();cx.lineCap='round';cx.lineJoin='round';any=true}
  cx.globalAlpha=c.al*alpha;cx.strokeStyle='#'+c.col;cx.lineWidth=c.w;cx.beginPath();pl.forEach((p,i)=>i?cx.lineTo(p[0],p[1]):cx.moveTo(p[0],p[1]));cx.stroke()}
 if(any)cx.restore()}
function one(cx,z,j,on){const at=j.at,e=ends(j);if(!e)return;const A=e[0],B=e[1],col=COL[j.tag]||'#fff',lw=(on?2.5:1.5)/z,r=(on?5.5:4)/z;
 cx.strokeStyle=col;cx.fillStyle=col;cx.lineWidth=lw;cx.setLineDash([]);
 const dot=(p,sq)=>{cx.beginPath();if(sq)cx.rect(p[0]-r,p[1]-r,2*r,2*r);else cx.arc(p[0],p[1],r,0,7);cx.fill();cx.strokeStyle='#fff';cx.lineWidth=1/z;cx.stroke();cx.strokeStyle=col;cx.lineWidth=lw};
 const arrow=(p,dx,dy,len)=>{const l=Math.hypot(dx,dy)||1,ux=dx/l,uy=dy/l,s=7/z;cx.beginPath();cx.moveTo(p[0]+ux*len,p[1]+uy*len);cx.lineTo(p[0]+ux*len-ux*s-uy*s*.5,p[1]+uy*len-uy*s+ux*s*.5);cx.lineTo(p[0]+ux*len-ux*s+uy*s*.5,p[1]+uy*len-uy*s-ux*s*.5);cx.closePath();cx.fill()};
 if(j.tag==='JPL'){const q=pulley(j,A,B);cx.save();cx.setLineDash([6/z,4/z]);cx.beginPath();cx.moveTo(A[0],A[1]);cx.lineTo(q[0][0],q[0][1]);cx.lineTo(q[1][0],q[1][1]);cx.lineTo(B[0],B[1]);cx.stroke();cx.restore();
  cx.save();cx.setLineDash([3/z,3/z]);q.forEach(p=>{cx.beginPath();cx.arc(p[0],p[1],r*2,0,7);cx.stroke()});cx.restore();dot(A,false);dot(B,false);dot(q[0],true);dot(q[1],true);
  if(on){cx.font=(11/z)+'px system-ui,sans-serif';cx.fillText('P3',q[0][0]+8/z,q[0][1]-6/z);cx.fillText('P4',q[1][0]+8/z,q[1][1]-6/z)}}
 else if(j.tag==='JR'){const c=rcenter(j),g=gnd(zOf(at,1))||c;if(!c)return;const rad=Math.hypot(g[0]-c[0],g[1]-c[1]),R=Math.max(rad,10/z);
  cx.save();cx.setLineDash([5/z,4/z]);cx.lineDashOffset=flow(j,z);cx.globalAlpha=.9;cx.lineWidth=2/z;cx.fillStyle=col+'30';cx.beginPath();cx.arc(c[0],c[1],R,0,7);cx.fill();cx.stroke();cx.restore();
  if(rad>0){cx.save();cx.globalAlpha=.7;cx.setLineDash([6/z,4/z]);cx.beginPath();cx.moveTo(c[0],c[1]);cx.lineTo(g[0],g[1]);cx.stroke();cx.restore();cx.beginPath();cx.arc(g[0],g[1],3/z,0,7);cx.fill()}
  if(('LIM1' in at||'LIM2' in at)&&rad>0){const th=Math.atan2(g[1]-c[1],g[0]-c[0]),l1=Math.abs(num(at.LIM1)),l2=Math.abs(num(at.LIM2));cx.save();cx.lineWidth=4/z;cx.globalAlpha=.85;cx.beginPath();cx.arc(c[0],c[1],R,th-l2,th+l1,false);cx.stroke();cx.restore()}
  dot(c,false)}
 else{cx.save();cx.setLineDash([6/z,4/z]);cx.beginPath();cx.moveTo(A[0],A[1]);cx.lineTo(B[0],B[1]);cx.stroke();cx.restore();
  if(j.tag==='JP'&&at.AXIS){const ax=pt(at.AXIS)||[0,0];if(ax[0]||ax[1]){const l=Math.hypot(ax[0],ax[1]),bx=-ax[0]/l,by=-ax[1]/l,ra=-num(at.A),cr=Math.cos(ra),sr=Math.sin(ra),ux=bx*cr-by*sr,uy=bx*sr+by*cr,hasL='LIM1' in at||'LIM2' in at,l1=num(at.LIM1,-1.3333),l2=num(at.LIM2,1.3333),a0=hasL?l1*30:-40,a1=hasL?l2*30:40;
   cx.save();cx.lineWidth=3/z;cx.globalAlpha=.55;if(moving(j)){cx.setLineDash([7/z,5/z]);cx.lineDashOffset=flow(j,z)}cx.beginPath();cx.moveTo(A[0]+ux*a0,A[1]+uy*a0);cx.lineTo(A[0]+ux*a1,A[1]+uy*a1);cx.stroke();cx.setLineDash([]);cx.globalAlpha=.9;arrow(A,ux,uy,a1);cx.restore()}}
  dot(A,false);dot(B,false)}
 if(on){cx.font='600 '+(11/z)+'px system-ui,sans-serif';cx.shadowColor='#000';cx.shadowBlur=3;cx.fillText(j.tag,A[0]+8/z,A[1]-8/z)}}
function draw(cx,z,sel){const L=S.map.J||[];if(!L.length||(S.mvis&&S.mvis.J===0))return;cx.save();cx.lineCap='round';cx.lineJoin='round';
 L.forEach((j,i)=>one(cx,z,j,!!sel&&sel.kind==='J'&&sel.i===i));cx.restore()}
function ghost(cx,z,P,cur){cx.save();const g=groundAt(cur);
 if(g>=0){const b=MR.bounds('S',S.map.S[g],g);if(b){cx.translate(b.x,b.y);cx.rotate((b.ang||0)*Math.PI/180);cx.strokeStyle='#00e5ff';cx.lineWidth=2/z;cx.setLineDash([5/z,3/z]);if(b.circ){cx.beginPath();cx.arc(0,0,b.w,0,7);cx.stroke()}else cx.strokeRect(b.ox,b.oy,b.w,b.h)}}
 cx.restore();cx.save();const col=COL[P.v]||'#fff';cx.strokeStyle=col;cx.fillStyle=col;cx.lineWidth=2/z;
 if(P.js.length){const a=P.js[0].p;cx.beginPath();cx.arc(a[0],a[1],5/z,0,7);cx.fill();cx.setLineDash([5/z,4/z]);cx.beginPath();cx.moveTo(a[0],a[1]);cx.lineTo(cur[0],cur[1]);cx.stroke()}
 cx.setLineDash([]);cx.beginPath();cx.arc(cur[0],cur[1],4/z,0,7);cx.fill();cx.restore()}
function xml(j,dec){const at=j.at,done=new Set();let s='<'+j.tag;const skip=k=>{if(k==='R'||k==='HZ'||k==='AMP'||k==='LIM1'||k==='LIM2'){if(!(parseFloat(at[k])||0))return true;if((k==='LIM1'||k==='LIM2')&&j.tag==='JP'&&!at.AXIS)return true}return false};const val=(k,v)=>{v=String(v);if(!dec&&/^P[1-4]$/.test(k)){const p=pt(v);if(p)v=Math.round(p[0])+','+Math.round(p[1])}return v};
 KEYS.forEach(k=>{if(skip(k)){done.add(k);return}if(at[k]!==undefined&&at[k]!==''){s+=' '+k+'="'+esc(val(k,at[k]))+'"';done.add(k)}});
 Object.keys(at).forEach(k=>{if(!done.has(k)&&at[k]!==undefined&&!skip(k))s+=' '+k+'="'+esc(at[k])+'"'});return s+' />'}
const isDraw=el=>el.tagName==='JD'&&el.hasAttribute('c')&&el.hasAttribute('P1')&&el.hasAttribute('P2')&&!el.hasAttribute('HZ')&&!el.hasAttribute('AMP');
function fromXML(el){const at={};[...el.attributes].forEach(a=>at[a.name]=a.value);return{tag:el.tagName,at}}
function fix(fn){(S.map.J||[]).forEach(j=>['M1','M2'].forEach(k=>{if(j.at[k]===undefined)return;const v=fn(parseInt(j.at[k],10)||0);if(v===undefined||v===0||v===null)delete j.at[k];else j.at[k]=String(v)}))}
const onRemoveS=d=>fix(v=>v===d?undefined:v>d?v-1:v);
const onMoveS=(a,b)=>fix(v=>v===a?b:(a<b&&v>a&&v<=b)?v-1:(a>b&&v>=b&&v<a)?v+1:v);
function fields(it,H){const at=it.at,t=it.tag,N=(S.map.S||[]).length;
 const opts=[];for(let k=0;k<Math.max(1,N);k++){const g=(S.map.S||[])[k];opts.push([k,'Z'+k+(g?' · '+T(gname(g)):'')+(k===0?' ('+T('padrão')+')':'')])}
 const ms=s=>()=>zOf(at,s);const mset=s=>v=>{if(+v>0)at['M'+s]=String(+v);else delete at['M'+s]};
 const hasOpt=s=>opts.some(o=>o[0]===zOf(at,s));[1,2].forEach(s=>{if(!hasOpt(s))opts.push([zOf(at,s),'Z'+zOf(at,s)])});
 H.sel('Geral','M1 (terreno 1)','anchor',opts,ms(1),mset(1),{pick:()=>H.pick(it,1),picking:()=>H.picking(it,1)});H.sel('Geral','M2 (terreno 2)','anchor',opts,ms(2),mset(2),{pick:()=>H.pick(it,2),picking:()=>H.picking(it,2)});
 const P=(key,lb)=>{H.b('Pontos',lb,'crosshair',()=>key in at,v=>{if(v){const a=anchor(it,key==='P1'?1:2)||[0,0];at[key]=ptS(a.map(Math.round))}else delete at[key]},{solo:1,brk:1});
  if(key in at){H.n('Pontos',lb+'X','move-horizontal',()=>(pt(at[key])||[0,0])[0],v=>{const p=pt(at[key])||[0,0];at[key]=ptS([Math.round(+v||0),p[1]])},{step:1});H.n('Pontos',lb+'Y','move-vertical',()=>(pt(at[key])||[0,0])[1],v=>{const p=pt(at[key])||[0,0];at[key]=ptS([p[0],Math.round(+v||0)])},{step:1})}};
 P('P1','P1');if(t!=='JR'||'P2' in at)P('P2','P2');else H.b('Pontos','P2','crosshair',()=>false,v=>{if(v){const a=anchor(it,2)||[0,0];at.P2=ptS(a.map(Math.round))}},{solo:1,brk:1});
 if(t==='JPL'){const e=ends(it)||[[0,0],[0,0]],q=pulley(it,e[0],e[1]);
  [['P3',q[0]],['P4',q[1]]].forEach(([k,d])=>{H.n('Polias',k+'X','move-horizontal',()=>(pt(at[k])||d)[0],v=>{const p=pt(at[k])||d;at[k]=ptS([Math.round(+v||0),p[1]])},{step:1,brk:1});H.n('Polias',k+'Y','move-vertical',()=>(pt(at[k])||d)[1],v=>{const p=pt(at[k])||d;at[k]=ptS([p[0],Math.round(+v||0)])},{step:1})});
  H.n('Polias','R (resistência)','gauge',()=>at.R===undefined?'':at.R,v=>{if(v===''||!+v)delete at.R;else at.R=fnum(v)},{step:'any',min:0,solo:1,brk:1})}
 if(t==='JD'){H.n('Física','HZ (frequência)','waves',()=>at.HZ===undefined?'':at.HZ,v=>{if(v===''||!+v)delete at.HZ;else at.HZ=fnum(v)},{step:'any',min:0});H.n('Física','AMP (amortecimento)','wind',()=>at.AMP===undefined?'':at.AMP,v=>{if(v===''||!+v)delete at.AMP;else at.AMP=fnum(v)},{step:'any',min:0})}
 const mv=()=>{const q=String(at.MV||'').split(',');return{st:q[0]===undefined||q[0]===''?'Infinity':q[0],sp:q[1]===undefined||q[1]===''?'0':q[1]}};
 const motor=()=>{H.b('Motor','Motor (MV)','zap',()=>'MV' in at,v=>{if(v)at.MV='Infinity,1';else delete at.MV});
  if('MV' in at){H.b('Motor','Força infinita','infinity',()=>mv().st==='Infinity',v=>{const o=mv();at.MV=(v?'Infinity':'1000')+','+o.sp});
   if(mv().st!=='Infinity')H.n('Motor','Força','weight',()=>mv().st,v=>{const o=mv();at.MV=fnum(+v||0)+','+o.sp},{step:'any',min:0});
   const un=t==='JP'?{k:30,l:'px/s'}:t==='JR'?{k:180/Math.PI,l:'deg/s'}:null,cv=()=>un&&SPU.get(t)==='u';
   H.n('Motor','Velocidade','gauge',()=>cv()?fnum(+mv().sp*un.k,4):mv().sp,v=>{const o=mv(),x=+v||0;at.MV=o.st+','+(cv()?fnum(x/un.k,6):fnum(x))},{step:'any',solo:1,units:un?{get:()=>SPU.get(t),set:x=>SPU.set(t,x),list:[['n','Normal'],['u',un.l]]}:undefined})}};
 if(t==='JP'){
  const cur=at.AXIS===undefined?'':at.AXIS,ax=AXES.some(a=>a[0]===cur)?AXES:AXES.concat([[cur,cur]]);
  H.sel('Movimento','Eixo (AXIS)','move',ax,()=>at.AXIS===undefined?'':at.AXIS,v=>{if(v==='')delete at.AXIS;else at.AXIS=v});
  if('AXIS' in at){const lp=(k,sg,lb)=>H.n('Movimento',lb,'ruler-measure',()=>at[k]===undefined?'':rnd(Math.abs(num(at[k]))*30),v=>{if(v===''||!+v)delete at[k];else at[k]=fnum(sg*Math.abs(+v)/30)},{step:1});lp('LIM1',-1,'Limite − (px)');lp('LIM2',1,'Limite + (px)');motor()}
  H.n('Movimento','A (ângulo °)','rotate-cw',()=>at.A===undefined?'':rnd(num(at.A)*180/Math.PI),v=>{if(v===''||!+v)delete at.A;else at.A=fnum((+v)*Math.PI/180)},{step:1})}
 if(t==='JR'){const lr=(k,sg,lb)=>H.n('Movimento',lb,'rotate-cw',()=>at[k]===undefined?'':rnd(num(at[k])*180/Math.PI),v=>{if(v===''||!+v)delete at[k];else at[k]=fnum(sg*Math.abs(+v||0)*Math.PI/180)},{step:1});
  lr('LIM1',-1,'Limite horário (°)');lr('LIM2',1,'Limite anti-horário (°)');motor()}
 H.b('Aparência','Visível (c)','eye',()=>'c' in at,v=>{if(v)at.c='ffffff,3,1,0';else delete at.c});
 if('c' in at){const set=o=>{at.c=[o.col,o.w,o.al,o.fg].join(',')};
  H.c('Aparência','Cor','palette',()=>cOf(at).col,v=>{const o=cOf(at);o.col=v.slice(1);set(o)});
  H.n('Aparência','Largura','minus',()=>cOf(at).w,v=>{const o=cOf(at);o.w=Math.max(1,Math.round(+v||1));set(o)},{step:1,min:1});
  H.n('Aparência','Transparência (0 a 1)','ghost',()=>cOf(at).al,v=>{const o=cOf(at);o.al=Math.max(0,Math.min(1,+v||0));set(o)},{step:.05,min:0});
  H.b('Aparência','Na frente','layers',()=>cOf(at).fg===1,v=>{const o=cOf(at);o.fg=v?1:0;set(o)})}}
return{TYPES,COL,TIP,ICN,live,setM,setMode:v=>{MODE=v?1:0},getMode:()=>MODE,bind:o=>{S=o.S;MR=o.MR;gname=o.gname||gname},make,place,groundAt,hit,draw,ghost,lines,drag,snapshot,move,box,label,sub,icon,xml,isDraw,fromXML,fields,onRemoveS,onMoveS,anchor}})();
