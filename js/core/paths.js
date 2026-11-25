'use strict';
const PATHS=(()=>{
const $=id=>document.getElementById(id);
const R2=v=>Math.round(v*100)/100;
const K={mode:'line',gap:0,ext:true,target:'auto',tol:.1,keep:false};
const isShape=it=>it&&it.k==='h'&&it.o&&'PBSNQRE'.includes(it.t);
const ringOf=it=>{if(!isShape(it))return null;let r;try{r=BOOL.clean(T2.ringOf(it))}catch(e){return null}return r.length>=3&&Math.abs(BOOL.area(r))>1e-4?r:null};
const modeOf=it=>(it.o&&it.o.mode)||'o';
const isOcc=it=>modeOf(it)!=='o'&&(it.al==null||it.al>=.999);
const layerOf=it=>S.layers.find(l=>l.items.includes(it));
function keyhole(outer,holes){const area=Q=>{let a=0;for(let i=0;i<Q.length;i++){const p=Q[i],q=Q[(i+1)%Q.length];a+=p[0]*q[1]-q[0]*p[1]}return a/2};
 let ring=outer.map(q=>q.slice());const so=Math.sign(area(ring))||1;
 holes.forEach(h0=>{let h=h0.map(q=>q.slice());if(Math.sign(area(h))===so)h.reverse();let bi=0,bj=0,bd=1e18;
  for(let i=0;i<ring.length;i++)for(let j=0;j<h.length;j++){const d=(ring[i][0]-h[j][0])**2+(ring[i][1]-h[j][1])**2;if(d<bd){bd=d;bi=i;bj=j}}
  const hh=h.slice(bj).concat(h.slice(0,bj));hh.push(hh[0].slice());ring=ring.slice(0,bi+1).concat(hh,[ring[bi].slice()],ring.slice(bi+1))});return ring}
function mkItem(src,pts,over,sty){const it=clone(src);['cc','u','v','m','is','pal','tx','base'].forEach(k=>{delete it[k]});it.id=S.uid++;it.t='P';
 it.pts=pts.map(p=>[R2(p[0]),R2(p[1])]);it.o={...(src.o||{}),closed:true,...(over||{})};if(sty)Object.assign(it,sty);touch(it);return it}
function emit(src,groups,tol){const out=[],o=src.o||{},mode=modeOf(src),ocS=o.ocOn?{c:o.oc||src.c,w:o.ow||src.w}:{c:src.c,w:src.w},fcS=o.fcOn?{c:o.fc||src.c,w:o.fw||src.w}:{c:src.c,w:src.w};
 groups.forEach(g=>{const outer=BOOL.simplify(g.outer,tol),holes=g.holes.map(h=>BOOL.simplify(h,tol)).filter(h=>h.length>=3);if(outer.length<3)return;
  if(!holes.length){out.push(mkItem(src,outer));return}
  if(mode==='o'){out.push(mkItem(src,outer));holes.forEach(h=>out.push(mkItem(src,h)));return}
  const fl=()=>out.push(mkItem(src,keyhole(outer,holes),{mode:'f',fcOn:false,ocOn:false},mode==='b'?fcS:null));
  const ol=()=>{[outer,...holes].forEach(h=>out.push(mkItem(src,h,{mode:'o',ocOn:false,fcOn:false},ocS)))};
  if(mode==='f')fl();else if(o.top==='f'){ol();fl()}else{fl();ol()}});
 return out}
const same=(groups,ring)=>groups.length===1&&!groups[0].holes.length&&Math.abs(Math.abs(BOOL.area(groups[0].outer))-Math.abs(BOOL.area(ring)))<Math.max(.01,Math.abs(BOOL.area(ring))*1e-4);
const G=(ops,pred)=>BOOL.group(BOOL.bool(ops,pred));
const rg=g=>[g.outer,...g.holes];
function gather(){const arr=[];S.layers.forEach((l,li)=>l.items.forEach((it,ii)=>{if(S.sel.items.has(it)&&isShape(it)){const ring=ringOf(it);arr.push({it,l,li,ii,ring})}}));return arr}
function selInfo(){let n=0,bad=0;S.layers.forEach(l=>l.items.forEach(it=>{if(S.sel.items.has(it)){if(isShape(it)&&ringOf(it))n++;else bad++}}));return{n,bad}}
function compute(op,sel,tol){
 const n=sel.length,R=sel.map(x=>[x.ring]),plan=[],del=new Set();
 const some=f=>f.some(Boolean);
 const place=(anchor,src,groups)=>plan.push({anchor,l:layerOf(anchor),items:emit(src,groups,tol)});
 if(['union','diff','inter','excl','mask'].includes(op)){
  const pred={union:some,diff:f=>f[0]&&!f.slice(1).some(Boolean),inter:f=>f.every(Boolean),excl:f=>f.filter(Boolean).length%2===1,mask:f=>f.every(Boolean)}[op];
  const groups=G(R,pred);if(!groups.length)return{err:op==='diff'?'A diferença ficou vazia (o de cima cobre o de baixo)':'Resultado vazio: as formas não se cruzam'};
  if(op==='mask'){const top=sel[n-1];place(top.it,top.it,groups)}
  else{place(sel[0].it,sel[0].it,groups);sel.slice(1).forEach(x=>del.add(x.it))}
  return{plan,del}}
 if(op==='divide'){
  let regs=[];
  sel.forEach(x=>{const nr=[];
   regs.forEach(r=>{G([r.rings,[x.ring]],f=>f[0]&&f[1]).forEach(g=>nr.push({rings:rg(g),src:x.it}));G([r.rings,[x.ring]],f=>f[0]&&!f[1]).forEach(g=>nr.push({rings:rg(g),src:r.src}))});
   (regs.length?G([[x.ring],...regs.map(r=>r.rings)],f=>f[0]&&!f.slice(1).some(Boolean)):G([[x.ring]],f=>f[0])).forEach(g=>nr.push({rings:rg(g),src:x.it}));regs=nr});
  if(regs.length<=n&&regs.every(r=>r.rings.length===1)&&regs.length===n)return{err:'Nada para dividir: as formas não se sobrepõem'};
  const anchor=sel[0].it,items=[];regs.forEach(r=>items.push(...emit(r.src,BOOL.group(r.rings),tol)));
  plan.push({anchor,l:layerOf(anchor),items});sel.slice(1).forEach(x=>del.add(x.it));return{plan,del}}
 if(op==='trim'||op==='flat'){
  const res=sel.map((x,i)=>{const above=sel.slice(i+1).filter(y=>isOcc(y.it)),ops=[R[i],...above.map(y=>[y.ring])];return{x,groups:above.length?G(ops,f=>f[0]&&!f.slice(1).some(Boolean)):[{outer:x.ring,holes:[]}],changed:above.length>0}});
  if(op==='trim'){let any=false;res.forEach(r=>{if(!r.groups.length||!same(r.groups,r.x.ring))any=true;
    if(!r.groups.length){plan.push({anchor:r.x.it,l:r.x.l,items:[]});return}
    if(same(r.groups,r.x.ring))return;plan.push({anchor:r.x.it,l:r.x.l,items:emit(r.x.it,r.groups,tol)})});
   if(!any)return{err:'Nada para cortar: nenhuma forma tampa outra'};return{plan,del}}
  const sk=it=>{const o={...it.o};['closed','n','rr','rs'].forEach(k=>delete o[k]);return JSON.stringify([it.c,it.w,it.al,it.fg,o])};
  const buckets=new Map(),solo=[];
  res.forEach(r=>{if(!r.groups.length){plan.push({anchor:r.x.it,l:r.x.l,items:[]});return}
   if(modeOf(r.x.it)==='o'){if(!same(r.groups,r.x.ring))plan.push({anchor:r.x.it,l:r.x.l,items:emit(r.x.it,r.groups,tol)});return}
   const k=sk(r.x.it);(buckets.get(k)||buckets.set(k,[]).get(k)).push(r)});
  let merged=0;
  buckets.forEach(arr=>{if(arr.length===1){const r=arr[0];if(!same(r.groups,r.x.ring))plan.push({anchor:r.x.it,l:r.x.l,items:emit(r.x.it,r.groups,tol)});return}
   const ops=[];arr.forEach(r=>r.groups.forEach(g=>ops.push(rg(g))));const groups=G(ops,some);merged+=arr.length-1;
   plan.push({anchor:arr[0].x.it,l:arr[0].x.l,items:emit(arr[0].x.it,groups,tol)});arr.slice(1).forEach(r=>del.add(r.x.it))});
  if(!plan.length&&!del.size)return{err:'Nada para nivelar: não há sobreposição nem formas iguais para juntar'};return{plan,del}}
 if(op==='frac'){
  let any=false;
  sel.forEach((x,i)=>{let pieces=[rg({outer:x.ring,holes:[]})];
   sel.forEach((y,j)=>{if(i===j)return;const nx=[];pieces.forEach(pc=>{const a=G([pc,[y.ring]],f=>f[0]&&f[1]),b=G([pc,[y.ring]],f=>f[0]&&!f[1]);if(a.length&&b.length)any=true;[...a,...b].forEach(g=>nx.push(rg(g)))});pieces=nx});
   if(pieces.length<=1)return;const groups=[];pieces.forEach(r=>BOOL.group(r).forEach(g=>groups.push(g)));plan.push({anchor:x.it,l:x.l,items:emit(x.it,groups,tol)})});
  if(!any)return{err:'Nada para fraturar: as formas não se cruzam'};return{plan,del}}
 return{err:'Operação desconhecida'}}
function apply(res,keep,top){
 if(keep){res.plan.forEach(p=>{const l=p.l||layerOf(p.anchor);if(!l)return;const i=l.items.indexOf(p.anchor);l.items.splice(i<0?l.items.length:i+1,0,...p.items)});return}
 res.plan.forEach(p=>{const l=p.l||layerOf(p.anchor);if(!l)return;const i=l.items.indexOf(p.anchor);if(i<0)return;l.items.splice(i,1,...p.items)});
 if(res.del.size)S.layers.forEach(l=>{for(let i=l.items.length-1;i>=0;i--)if(res.del.has(l.items[i]))l.items.splice(i,1)})}
const NAMES={union:'União',diff:'Diferença',inter:'Interseção',excl:'Exclusão',divide:'Dividir',trim:'Cortar',frac:'Fraturar',flat:'Nivelar',mask:'Máscara'};
function run(op){if(S.mode!=='draw')return;const sel=gather(),info=selInfo();
 if(sel.length<2){toast('Selecione 2 ou mais formas fechadas (polilinha, curva, círculo, elipse, retângulo)');return}
 const tol=Math.max(0,+$('pa_tol').value||0);K.tol=tol;K.keep=$('pa_keep').checked;
 let res;const t0=performance.now();try{res=compute(op,sel,tol)}catch(e){console.error(e);toast('Erro na operação: '+e.message);return}
 if(res.err){toast(res.err);return}
 apply(res,K.keep&&op!=='mask');
 const all=[];res.plan.forEach(p=>all.push(...p.items));selClear();all.forEach(it=>S.sel.items.add(it));
 commit();const pts=all.reduce((a,i)=>a+i.pts.length,0);
 toast(`${NAMES[op]}: ${all.length} forma${all.length===1?'':'s'} · ${pts} pontos`+(info.bad?` · ${info.bad} item(ns) ignorado(s)`:'')+` · ${Math.round(performance.now()-t0)} ms`)}
const dist=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
function chaikin(P,it){let q=P;for(let k=0;k<it;k++){const o=[q[0]];for(let i=0;i<q.length-1;i++){const a=q[i],b=q[i+1];o.push([a[0]*.75+b[0]*.25,a[1]*.75+b[1]*.25],[a[0]*.25+b[0]*.75,a[1]*.25+b[1]*.75])}o.push(q[q.length-1]);q=o}return q}
function rdp(P,e){if(P.length<3)return P;let m=0,ix=0;const a=P[0],b=P[P.length-1],dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy)||1e-9;for(let i=1;i<P.length-1;i++){const d=Math.abs((P[i][0]-a[0])*dy-(P[i][1]-a[1])*dx)/L;if(d>m){m=d;ix=i}}return m>e?rdp(P.slice(0,ix+1),e).slice(0,-1).concat(rdp(P.slice(ix),e)):[a,b]}
function dirAt(C,atEnd){const n=C.length,e=atEnd?C[n-1]:C[0];for(let k=1;k<n;k++){const p=atEnd?C[n-1-k]:C[k];if(dist(e,p)>=3){const d=[e[0]-p[0],e[1]-p[1]],l=Math.hypot(d[0],d[1]);return[d[0]/l,d[1]/l]}}const p=atEnd?C[0]:C[n-1],d=[e[0]-p[0],e[1]-p[1]],l=Math.hypot(d[0],d[1])||1;return[d[0]/l,d[1]/l]}
function simplePath(C){const n=C.length-1;for(let i=0;i<n;i++)for(let j=i+2;j<n;j++){if(BOOL.segInt(C[i],C[i+1],C[j],C[j+1]))return false}return true}
function boxWalk(box,from,to,dir){const[cx,cy,H]=box,T=8*H,cs=[[cx-H,cy-H],[cx+H,cy-H],[cx+H,cy+H],[cx-H,cy+H]];
 const per=p=>{const e=1e-6*H+1e-6;if(Math.abs(p[1]-(cy-H))<e)return p[0]-(cx-H);if(Math.abs(p[0]-(cx+H))<e)return 2*H+p[1]-(cy-H);if(Math.abs(p[1]-(cy+H))<e)return 4*H+(cx+H-p[0]);return 6*H+(cy+H-p[1])};
 const a=per(from),b=per(to),out=[];const delta=dir>0?((b-a)%T+T)%T:((a-b)%T+T)%T,L=[];
 for(let k=0;k<4;k++){const off=dir>0?(((k*2*H-a)%T)+T)%T:(((a-k*2*H)%T)+T)%T;if(off>0&&off<delta)L.push([off,cs[k]])}
 L.sort((x,y)=>x[0]-y[0]);L.forEach(x=>out.push(x[1]));return out}
function rayBox(p,d,box){const[cx,cy,H]=box;let t=1e18;if(d[0]>1e-12)t=Math.min(t,(cx+H-p[0])/d[0]);else if(d[0]<-1e-12)t=Math.min(t,(cx-H-p[0])/d[0]);if(d[1]>1e-12)t=Math.min(t,(cy+H-p[1])/d[1]);else if(d[1]<-1e-12)t=Math.min(t,(cy-H-p[1])/d[1]);return[p[0]+d[0]*t,p[1]+d[1]*t]}
function cutSides(C,box){const d0=dirAt(C,false),d1=dirAt(C,true),P0=rayBox(C[0],d0,box),P1=rayBox(C[C.length-1],d1,box),path=[P0,...C,P1];
 const A=[...path,...boxWalk(box,P1,P0,+1)],B=[...path,...boxWalk(box,P1,P0,-1)];return{path,A,B,simple:simplePath(path)}}
function strip(path,gap){const h=gap/2,qs=[];for(let i=0;i<path.length-1;i++){const p=path[i],q=path[i+1],l=dist(p,q);if(l<1e-6)continue;const ux=(q[0]-p[0])/l,uy=(q[1]-p[1])/l,nx=-uy*h,ny=ux*h,ex=ux*h,ey=uy*h;qs.push([[p[0]-ex+nx,p[1]-ey+ny],[q[0]+ex+nx,q[1]+ey+ny],[q[0]+ex-nx,q[1]+ey-ny],[p[0]-ex-nx,p[1]-ey-ny]])}return qs}
const inRing=(ring,p)=>BOOL.inRings([ring],p[0],p[1]);
const slackOf=()=>16/(S.view&&S.view.z||1);
const extend=(p,d,l)=>[p[0]+d[0]*l,p[1]+d[1]*l];
function rayHits(ring,p,d,box){const q=rayBox(p,d,box);if(dist(p,q)<1e-6)return false;for(let j=0;j<ring.length;j++)if(BOOL.segInt(p,q,ring[j],ring[(j+1)%ring.length]))return true;return false}
function pathHits(P,ring){for(let i=0;i<P.length-1;i++)for(let j=0;j<ring.length;j++)if(BOOL.segInt(P[i],P[i+1],ring[j],ring[(j+1)%ring.length]))return true;return false}
const freeEnd=(ring,p,d,box)=>!inRing(ring,p)&&!rayHits(ring,p,d,box);
const areaSum=gs=>gs.reduce((a,g)=>a+Math.abs(BOOL.area(g.outer))-g.holes.reduce((b,h)=>b+Math.abs(BOOL.area(h)),0),0);
function cutRing(ring,C,box,ext,gap,loop){
 if(loop){const a=G([[ring],[C]],f=>f[0]&&f[1]),b=G([[ring],[C]],f=>f[0]&&!f[1]);return a.length&&b.length?[...a,...b]:null}
 const d0=dirAt(C,false),d1=dirAt(C,true),in0=inRing(ring,C[0]),in1=inRing(ring,C[C.length-1]),vs=[];
 if(ext){const P=C.slice();if(in0)P.unshift(rayBox(C[0],d0,box));if(in1)P.push(rayBox(C[C.length-1],d1,box));vs.push({P,only:false});
  const sl=slackOf();vs.push({P:[extend(C[0],d0,sl),...C,extend(C[C.length-1],d1,sl)],only:true})}
 else vs.push({P:C,only:false});
 const slit=Math.max(gap,.35),base=areaOf(ring);
 for(const{P,only}of vs){
  const e0=freeEnd(ring,P[0],dirAt(P,false),box),e1=freeEnd(ring,P[P.length-1],dirAt(P,true),box),through=e0&&e1;
  if(only&&!through)continue;
  if(through){if(!pathHits(P,ring))continue;const cs=cutSides(P,box);
   if(gap<=0&&cs.simple){const a=G([[ring],[cs.A]],f=>f[0]&&f[1]),b=G([[ring],[cs.B]],f=>f[0]&&f[1]);if(a.length&&b.length)return[...a,...b]}
   const gg=G([[ring],...strip(cs.path,Math.max(gap,.05)).map(q=>[q])],f=>f[0]&&!f.slice(1).some(Boolean));
   if(gg.length>=2)return gg;continue}
  const gg=G([[ring],...strip(P,slit).map(q=>[q])],f=>f[0]&&!f.slice(1).some(Boolean));
  if(gg.length>=2||(gg.length&&Math.abs(areaSum(gg)-base)>1e-3))return gg}
 return null}
function areaOf(ring){return Math.abs(BOOL.area(ring))}
function splitOpen(pts,C,box,ext,gap){
 const tryP=P=>{const hits=[];
  for(let i=0;i<pts.length-1;i++)for(let j=0;j<P.length-1;j++){const h=BOOL.segInt(pts[i],pts[i+1],P[j],P[j+1]);if(h&&h[0]>1e-6&&h[0]<1-1e-6)hits.push([i,h[0]])}
  return hits};
 let hits=tryP(C);
 if(!hits.length&&ext){const d0=dirAt(C,false),d1=dirAt(C,true),sl=slackOf();hits=tryP([extend(C[0],d0,sl),...C,extend(C[C.length-1],d1,sl)])}
 if(!hits.length)return null;hits.sort((a,b)=>a[0]-b[0]||a[1]-b[1]);
 const pieces=[];let cur=[pts[0]];let hi=0;
 for(let i=0;i<pts.length-1;i++){while(hi<hits.length&&hits[hi][0]===i){const t=hits[hi][1],p=[pts[i][0]+(pts[i+1][0]-pts[i][0])*t,pts[i][1]+(pts[i+1][1]-pts[i][1])*t];cur.push(p);pieces.push(cur);cur=[p];hi++}cur.push(pts[i+1])}
 pieces.push(cur);
 const trim=(pl,a,b)=>{let q=pl.slice();const cut=(arr,len)=>{let rest=len;while(arr.length>1&&rest>0){const d=dist(arr[0],arr[1]);if(d<=rest){rest-=d;arr.shift()}else{const t=rest/d;arr[0]=[arr[0][0]+(arr[1][0]-arr[0][0])*t,arr[0][1]+(arr[1][1]-arr[0][1])*t];rest=0}}return arr};
  if(a>0)q=cut(q,a);if(b>0)q=cut(q.reverse(),b).reverse();return q};
 const out=pieces.map((pl,i)=>gap>0?trim(pl,i>0?gap/2:0,i<pieces.length-1?gap/2:0):pl).filter(pl=>pl.length>=2&&dist(pl[0],pl[pl.length-1])+pl.length>1e-3);
 return out.length>=2?out:null}
function targets(){const out=[],sel=S.sel;
 const all=()=>{S.layers.forEach(l=>{if(!l.vis||l.lock)return;l.items.forEach(it=>out.push({it,l}))})};
 const picked=()=>{S.layers.forEach(l=>{if(!l.vis||l.lock)return;l.items.forEach(it=>{if(it.k==='h'?sel.items.has(it):(sel.pts.has(it.a)&&sel.pts.has(it.b)))out.push({it,l})})})};
 const t=K.target;
 if(t==='sel')picked();else if(t==='layer'){const l=S.layers[S.cur];if(l&&l.vis&&!l.lock)l.items.forEach(it=>out.push({it,l}))}else if(t==='all')all();
 else{picked();if(!out.length)all()}return out}
function knifeCut(C0,loop){
 let C=C0.slice();if(C.length<2)return;
 const T=targets();if(!T.length){toast('Nada para cortar: selecione formas ou mude o alvo');return}
 let X0=1e18,Y0=1e18,X1=-1e18,Y1=-1e18;const add=p=>{X0=Math.min(X0,p[0]);X1=Math.max(X1,p[0]);Y0=Math.min(Y0,p[1]);Y1=Math.max(Y1,p[1])};
 C.forEach(add);T.forEach(({it})=>{if(it.k==='s'){add(it.a);add(it.b)}else if(it.pts)it.pts.forEach(add);else if(it.cc){const r=Math.abs(it.u[0])+Math.abs(it.u[1])+Math.abs(it.v[0])+Math.abs(it.v[1]);add([it.cc[0]-r,it.cc[1]-r]);add([it.cc[0]+r,it.cc[1]+r])}});
 const diag=Math.hypot(X1-X0,Y1-Y0)+100,box=[(X0+X1)/2,(Y0+Y1)/2,diag*4];
 const tol=Math.max(0,K.tol),made=[];let cutN=0;const lays=new Map();
 T.forEach(({it,l})=>{
  if(it.k==='s'){const pcs=loop?null:splitOpen([it.a,it.b],C,box,K.ext,K.gap);if(!pcs)return;
   const items=pcs.map(pl=>({...clone(it),id:S.uid++,a:[R2(pl[0][0]),R2(pl[0][1])],b:[R2(pl[pl.length-1][0]),R2(pl[pl.length-1][1])]}));
   lays.set(it,{l,items});cutN++;return}
  if(!isShape(it))return;
  const closed=it.t==='R'||it.t==='E'||it.o.closed,ring=ringOf(it);if(!ring)return;
  if(closed){const g=cutRing(ring,C,box,K.ext,K.gap,loop);if(!g)return;lays.set(it,{l,items:emit(it,g,tol)});cutN++}
  else{const pcs=loop?null:splitOpen(ring,C,box,K.ext,K.gap);if(!pcs)return;
   lays.set(it,{l,items:pcs.map(pl=>{const n=mkItem(it,pl,{closed:false});return n})});cutN++}});
 if(!lays.size){toast('O traço não atravessou nenhuma forma'+(K.target==='auto'&&selCount()?' selecionada (deselecione para cortar tudo)':K.target==='sel'?' selecionada':''));return}
 selClear();lays.forEach(({l,items},it)=>{const i=l.items.indexOf(it);if(i>=0)l.items.splice(i,1,...items);items.forEach(n=>{if(n.k==='h')S.sel.items.add(n);else{S.sel.pts.add(n.a);S.sel.pts.add(n.b)}});made.push(...items)});
 commit();toast(`Faca: ${cutN} forma${cutN===1?'':'s'} cortada${cutN===1?'':'s'} em ${made.length} peça${made.length===1?'':'s'}`)}
function down(e,w,raw){if(e.button!==0)return true;const p=(K.mode==='line'?w:raw).slice();S.drag={t2:'knife',pts:[p,p.slice()],mode:K.mode,raw0:raw.slice()};return true}
function move(e,d,raw,w){if(d.mode==='line'){let q=w.slice();if(e.shiftKey){const a=d.pts[0],dx=q[0]-a[0],dy=q[1]-a[1],ang=Math.round(Math.atan2(dy,dx)/(Math.PI/4))*Math.PI/4,l=Math.hypot(dx,dy);q=[a[0]+Math.cos(ang)*l,a[1]+Math.sin(ang)*l]}d.pts[1]=q}
 else{const ev=(e.getCoalescedEvents&&e.getCoalescedEvents())||[];(ev.length?ev:[e]).forEach(x=>{const q=toW(x,false),L=d.pts[d.pts.length-1];if(dist(L,q)>=1.5/S.view.z)d.pts.push(q)})}dirty=1}
function up(e,d,raw,w){let C=d.pts,loop=false;if(d.mode==='curve'){if(C.length<2)return;const z=S.view.z;
  if(C.length>=8&&dist(C[0],C[C.length-1])<10/z){let len=0;for(let i=1;i<C.length;i++)len+=dist(C[i-1],C[i]);if(len>40/z){loop=true;C=C.slice(0,-1)}}
  C=rdp(C,1.1/z);C=C.length>2?chaikin(C,2):C;C=rdp(C,.25/z);if(loop&&C.length<3)return}
 if(!loop&&(C.length<2||dist(C[0],C[C.length-1])<2/S.view.z&&C.length<4)){dirty=1;return}
 knifeCut(C.map(p=>[R2(p[0]),R2(p[1])]),loop);dirty=1}
function draw(c,z){const d=S.drag;if(!d||d.t2!=='knife')return;let P=d.pts;if(d.mode==='curve'&&P.length>2)P=chaikin(rdp(P,1/z),2);if(P.length<2)return;
 c.save();c.lineCap='round';c.lineJoin='round';
 c.strokeStyle='#000';c.globalAlpha=.55;c.lineWidth=4/z;c.beginPath();P.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.stroke();
 c.globalAlpha=1;c.strokeStyle='#ff4081';c.lineWidth=2/z;c.setLineDash([7/z,5/z]);c.beginPath();P.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.stroke();c.setLineDash([]);
 if(K.ext&&d.mode==='line'){const a=P[0],b=P[1],l=dist(a,b);if(l>1){const ux=(b[0]-a[0])/l,uy=(b[1]-a[1])/l,L=4000;c.globalAlpha=.35;c.lineWidth=1/z;c.setLineDash([2/z,6/z]);c.beginPath();c.moveTo(a[0]-ux*L,a[1]-uy*L);c.lineTo(b[0]+ux*L,b[1]+uy*L);c.stroke()}}
 c.fillStyle='#fff';c.globalAlpha=1;[P[0],P[P.length-1]].forEach(p=>{c.beginPath();c.arc(p[0],p[1],3/z,0,7);c.fill()});c.restore()}
const TARGETS=[['auto','Automático (selecionados, ou tudo)'],['sel','Só selecionados'],['layer','Camada atual'],['all','Todas as camadas']];
function barHTML(field){return field(ic('git-commit-horizontal',14)+'Modo',`<select id="kb_mode"><option value="line">Reta</option><option value="curve">Curva (à mão livre)</option></select>`,'Reta: arraste entre dois pontos (Shift = 45°). Curva: traço livre, suavizado.')
 +field(ic('ruler',14)+'Folga',`<input type="number" id="kb_gap" min="0" max="60" step="0.5" value="${K.gap}">`,'Espaço entre as peças após o corte (px). 0 = corte limpo.')
 +field(ic('move-horizontal',14)+'Prolongar pontas',`<input type="checkbox" class="switch" id="kb_ext" ${K.ext?'checked':''}>`,'Ligado: pontas dentro da forma continuam até atravessá-la. Desligado: corta só onde o traço passa, inclusive por dentro.')
 +field(ic('crosshair',14)+'Alvo',`<select id="kb_tg">${TARGETS.map(([v,t])=>`<option value="${v}">${t}</option>`).join('')}</select>`,'Quais itens a faca corta.')
 +`<span class="topt-h">${ic('scissors',14)} Arraste sobre as formas para cortar</span>`}
function barBind(){const g=$,set=()=>{if(g('kb_mode'))g('kb_mode').value=K.mode;if(g('kb_tg'))g('kb_tg').value=K.target};set();
 const on=(id,fn,ev)=>{const e=g(id);if(e)e.addEventListener(ev||'input',fn)};
 on('kb_mode',e=>{K.mode=e.target.value;syncUI()},'change');on('kb_tg',e=>{K.target=e.target.value;syncUI()},'change');on('kb_gap',e=>{K.gap=Math.max(0,+e.target.value||0);syncUI()});on('kb_ext',e=>{K.ext=e.target.checked;syncUI()},'change')}
function syncUI(){const m=$('pa_kmode'),t=$('pa_ktg'),g=$('pa_kgap'),x=$('pa_kext'),on=$('pa_kon');if(!m)return;
 if(document.activeElement!==m)m.value=K.mode;if(document.activeElement!==t)t.value=K.target;if(document.activeElement!==g)g.value=K.gap;x.checked=K.ext;on.classList.toggle('on',S.tool==='J');
 ['kb_mode','kb_tg','kb_gap','kb_ext'].forEach(id=>{const e=$(id);if(!e)return;if(e.type==='checkbox')e.checked=id==='kb_ext'?K.ext:e.checked;else if(document.activeElement!==e)e.value=id==='kb_mode'?K.mode:id==='kb_tg'?K.target:K.gap})}
let lastSig='';
function refresh(){const w=$('w-paths');if(!w||w.hidden)return;const info=selInfo(),sig=info.n+'|'+info.bad+'|'+S.mode+'|'+S.tool;if(sig===lastSig)return;lastSig=sig;
 const ok=S.mode==='draw'&&info.n>=2;document.querySelectorAll('#pa_grid button').forEach(b=>b.disabled=!ok);
 $('pa_cnt').innerHTML=info.n>=2?`${ic('check',13)} <b>${info.n}</b> formas selecionadas${info.bad?` · ${info.bad} ignorada(s)`:''}`:`${ic('mouse-pointer-click',13)} Selecione <b>2 ou mais</b> formas fechadas`+(info.n===1?' (só 1 agora)':'');
 $('pa_kon').classList.toggle('on',S.tool==='J')}
function init(){const w=$('w-paths');if(!w)return;
 $('pa_grid').onclick=e=>{const b=e.target.closest('button[data-op]');if(b&&!b.disabled)run(b.dataset.op)};
 $('pa_tol').oninput=()=>{K.tol=Math.max(0,+$('pa_tol').value||0)};
 $('pa_kon').onclick=()=>{if(S.mode!=='draw'){toast('A faca é do modo Desenhar');return}setTool(S.tool==='J'?'V':'J');lastSig='';refresh()};
 $('pa_kmode').onchange=e=>{K.mode=e.target.value;syncUI()};$('pa_ktg').onchange=e=>{K.target=e.target.value;syncUI()};$('pa_kgap').oninput=e=>{K.gap=Math.max(0,+e.target.value||0);syncUI()};$('pa_kext').onchange=e=>{K.ext=e.target.checked;syncUI()};
 icons(w);syncUI();setInterval(()=>{refresh();syncUI()},300)}
return{init,run,down,move,up,draw,barHTML,barBind,K,knifeCut,compute,gather,cutRing,splitOpen}})();
if(typeof document!=='undefined'&&document.getElementById('w-paths'))PATHS.init();
