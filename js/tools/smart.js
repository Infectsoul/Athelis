'use strict';
let SV_DEBUG=typeof process!=='undefined'&&process.env&&process.env.SVD;
const SmartVec=(()=>{
const LABC=new Map();
function lab(c){let v=LABC.get(c);if(v)return v;const r=parseInt(c.slice(0,2),16)/255,g=parseInt(c.slice(2,4),16)/255,b=parseInt(c.slice(4,6),16)/255;
 if(isNaN(r+g+b)){v=[50,0,0];LABC.set(c,v);return v}
 const li=x=>x<=.04045?x/12.92:Math.pow((x+.055)/1.055,2.4),R=li(r),G=li(g),B=li(b),
  X=(R*.4124+G*.3576+B*.1805)/.95047,Y=R*.2126+G*.7152+B*.0722,Z=(R*.0193+G*.1192+B*.9505)/1.08883,f=t=>t>.008856?Math.cbrt(t):7.787*t+16/116,fx=f(X),fy=f(Y),fz=f(Z);
 v=[116*fy-16,500*(fx-fy),200*(fy-fz)];LABC.set(c,v);return v}
const dE=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1],a[2]-b[2]);

function colorClasses(colors,weights,tol){const m=new Map();colors.forEach((c,i)=>m.set(c,(m.get(c)||0)+weights[i]));
 const ds=[...m.entries()].sort((a,b)=>b[1]-a[1]),leaders=[],map=new Map();
 for(const[c]of ds){let k=-1;if(tol>0){const lc=lab(c);for(let j=0;j<leaders.length;j++)if(dE(lc,leaders[j].lab)<=tol){k=j;break}}else{for(let j=0;j<leaders.length;j++)if(leaders[j].c===c){k=j;break}}
  if(k<0){k=leaders.length;leaders.push({c,lab:lab(c)})}map.set(c,k)}
 return{map,leaders}}

function louvain(n,eu,ev,ew,gamma){
 let node2c=Int32Array.from({length:n},(_,i)=>i);let N=n,U=eu,V=ev,W=ew,SELF=new Float64Array(n);
 for(let level=0;level<12;level++){
  const nb=Array.from({length:N},()=>[]),wt=Array.from({length:N},()=>[]);
  for(let e=0;e<U.length;e++){const a=U[e],b=V[e],w=W[e];if(a===b){SELF[a]+=w;continue}nb[a].push(b);wt[a].push(w);nb[b].push(a);wt[b].push(w)}
  const k=new Float64Array(N);let m2=0;for(let i=0;i<N;i++){let s=2*SELF[i];const w=wt[i];for(let j=0;j<w.length;j++)s+=w[j];k[i]=s;m2+=s}
  if(m2<=0)break;
  const c=Int32Array.from({length:N},(_,i)=>i),tot=Float64Array.from(k);let moved=false;
  for(let pass=0;pass<30;pass++){let ch=0;
   for(let i=0;i<N;i++){const ci=c[i],ni=nb[i],wi=wt[i];if(!ni.length)continue;const acc=new Map();for(let j=0;j<ni.length;j++){const cj=c[ni[j]];acc.set(cj,(acc.get(cj)||0)+wi[j])}
    tot[ci]-=k[i];let best=ci,bg=(acc.get(ci)||0)-gamma*k[i]*tot[ci]/m2;
    acc.forEach((w,cc)=>{const g=w-gamma*k[i]*tot[cc]/m2;if(g>bg+1e-12){bg=g;best=cc}});
    tot[best]+=k[i];if(best!==ci){c[i]=best;ch++}}
   if(!ch)break;moved=true}
  if(!moved)break;
  const ren=new Map();for(let i=0;i<N;i++)if(!ren.has(c[i]))ren.set(c[i],ren.size);
  for(let i=0;i<n;i++)node2c[i]=ren.get(c[node2c[i]]);
  const NN=ren.size,ns=new Float64Array(NN),acc=new Map();for(let i=0;i<N;i++)ns[ren.get(c[i])]+=SELF[i];
  for(let e=0;e<U.length;e++){const a=ren.get(c[U[e]]),b=ren.get(c[V[e]]);if(a===b){ns[a]+=W[e];continue}const key=a<b?a*NN+b:b*NN+a;acc.set(key,(acc.get(key)||0)+W[e])}
  const nu=[],nv=[],nw=[];acc.forEach((w,key)=>{nu.push(Math.floor(key/NN));nv.push(key%NN);nw.push(w)});
  if(NN===N)break;N=NN;U=nu;V=nv;W=nw;SELF=ns}
 return node2c}

function capsuleRows(ax,ay,bx,by,r,H,fn){
 const dx=bx-ax,dy=by-ay,L=Math.hypot(dx,dy),ymin=Math.max(0,Math.floor(Math.min(ay,by)-r)),ymax=Math.min(H-1,Math.ceil(Math.max(ay,by)+r));
 const ux=L>1e-9?dx/L:1,uy=L>1e-9?dy/L:0;
 for(let y=ymin;y<=ymax;y++){const yc=y+.5;let lo=1e18,hi=-1e18;
  for(let e=0;e<2;e++){const cx=e?bx:ax,cy=e?by:ay,d=yc-cy;if(d<=r&&d>=-r){const h=Math.sqrt(r*r-d*d);if(cx-h<lo)lo=cx-h;if(cx+h>hi)hi=cx+h}}
  if(L>1e-9){let xl=-1e18,xr=1e18,ok=true;
   const lim=(k,c,mn,mx)=>{if(k<1e-12&&k>-1e-12){if(c<mn||c>mx)ok=false;return}let p=(mn-c)/k,q=(mx-c)/k;if(p>q){const t=p;p=q;q=t}if(p>xl)xl=p;if(q<xr)xr=q};
   lim(-uy,uy*ax+ux*(yc-ay),-r,r);lim(ux,uy*(yc-ay)-ux*ax,0,L);
   if(ok&&xl<=xr){if(xl<lo)lo=xl;if(xr>hi)hi=xr}}
  if(hi>=lo)fn(y,lo,hi)}}

function prepare(U,o){
 const n=U.length;if(!n)return null;
 const nodes=[];let X0=1e9,Y0=1e9,X1=-1e9,Y1=-1e9,nseg=0;
 U.forEach((u,i)=>{let ink=0,al=0,x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;const cw=new Map();
  u.segs.forEach(q=>{const h=q.w/2,L=Math.hypot(q.a[0]-q.b[0],q.a[1]-q.b[1]),w=L*q.w+q.w*q.w;ink+=w;al+=w*(q.al===undefined?1:q.al);cw.set(q.c,(cw.get(q.c)||0)+w);
   x0=Math.min(x0,q.a[0]-h,q.b[0]-h);x1=Math.max(x1,q.a[0]+h,q.b[0]+h);y0=Math.min(y0,q.a[1]-h,q.b[1]-h);y1=Math.max(y1,q.a[1]+h,q.b[1]+h);nseg++});
  let bc='ffffff',bw=-1;cw.forEach((w,c)=>{if(w>bw){bw=w;bc=c}});
  const a=ink>0?al/ink:1;nodes.push({i,u,ink,al:a,fx:a<.9,c:bc,x0,y0,x1,y1,ns:u.segs.length});
  if(a>=.9||true){X0=Math.min(X0,x0);X1=Math.max(X1,x1);Y0=Math.min(Y0,y0);Y1=Math.max(Y1,y1)}});
 return{n,nodes,X0,Y0,X1,Y1,nseg}}

function raster(P){
 const{n,nodes}=P;let X0=1e9,Y0=1e9,X1=-1e9,Y1=-1e9;nodes.forEach(d=>{if(d.fx)return;X0=Math.min(X0,d.x0);X1=Math.max(X1,d.x1);Y0=Math.min(Y0,d.y0);Y1=Math.max(Y1,d.y1)});
 if(X1<X0){X0=P.X0;X1=P.X1;Y0=P.Y0;Y1=P.Y1}
 const TW=Math.max(1,X1-X0),TH=Math.max(1,Y1-Y0),sc=Math.min(2,1100/Math.max(TW,TH),Math.sqrt(1600000/(TW*TH))),W=Math.ceil(TW*sc)+2,H=Math.ceil(TH*sc)+2,id=new Int32Array(W*H).fill(-1);
 const paint=(d,fn)=>d.u.segs.forEach(q=>{capsuleRows((q.a[0]-X0)*sc+1,(q.a[1]-Y0)*sc+1,(q.b[0]-X0)*sc+1,(q.b[1]-Y0)*sc+1,Math.max(.6,q.w*sc/2),H,(y,l,r)=>{const xa=Math.max(0,Math.ceil(l-.5)),xb=Math.min(W-1,Math.floor(r-.5));if(xb>=xa)fn(y*W,xa,xb)})});
 nodes.forEach(d=>{if(d.fx)return;const i=d.i;paint(d,(row,xa,xb)=>{for(let x=xa;x<=xb;x++)id[row+x]=i})});
 const area=new Float64Array(n),pairs=new Map(),emp=new Float64Array(n),per=new Float64Array(n);
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){const p=id[y*W+x];if(p<0)continue;area[p]++;
  const nbs=[x+1<W?id[y*W+x+1]:-2,y+1<H?id[(y+1)*W+x]:-2,x>0?id[y*W+x-1]:-2,y>0?id[(y-1)*W+x]:-2];
  for(let k=0;k<4;k++){const q=nbs[k];if(q===p)continue;if(q===-2){emp[p]++;per[p]++;continue}if(q<0){emp[p]++;per[p]++;continue}per[p]++;if(k<2){const key=p<q?p*n+q:q*n+p;pairs.set(key,(pairs.get(key)||0)+1)}}}
 return{id,W,H,sc,X0,Y0,TW,TH,area,pairs,emp,per}}

function pieceScore(P,Q,B,TOT,rx){
 const rng=p=>{const a=p.z,m=a.length;return[a[Math.floor(.05*(m-1))],a[Math.ceil(.95*(m-1))]]},inside=(A,lo,hi)=>{let c=0;for(const z of A)if(z>=lo&&z<=hi)c++;return c/A.length};
 const share=B/Math.max(1e-6,Math.min(P.per,Q.per)),[pl,ph]=rng(P),[ql,qh]=rng(Q),zint=Math.max(inside(Q.z,pl,ph),inside(P.z,ql,qh)),
  gap=Math.max(1,Math.max(pl-qh,ql-ph)),seq=Math.exp(-(gap-1)/(10*rx));
 const big=P.area>=Q.area?P:Q,sm=big===P?Q:P,ratio=big.area/Math.max(1,sm.area),gr=(big.area/big.z.length)/Math.max(1e-6,sm.area/sm.z.length),enc=B/Math.max(1e-6,sm.per);
  const g=Math.max(0,Math.min(1,(share-.08/rx)/(.35/rx)));
 if(zint>=.5&&share>=.06)return .5+.5*Math.max(g,zint*.6);
 return seq*g}
function mergePieces(pcs,th,TOT,rx){rx=rx||1;
 const alive=new Map(),S=new Map(),key=(a,b)=>a<b?a+'|'+b:b+'|'+a,byId=new Map();pcs.forEach(p=>byId.set(p.id,p));
 pcs.forEach(p=>alive.set(p.id,{id:p.id,nodes:p.nodes.slice(),area:p.area,per:p.per,parts:[p.id],nb:new Map()}));
 pcs.forEach(p=>p.nb.forEach((B,j)=>{if(p.id<j){const s=pieceScore(p,byId.get(j),B,TOT,rx),k=key(p.id,j);S.set(k,{B,SB:B*s});alive.get(p.id).nb.set(j,1);alive.get(j).nb.set(p.id,1)}}));
 const GL=.07,blocked=(k,v)=>{const[a,b]=k.split('|').map(Number),A=alive.get(a),Bq=alive.get(b),ga=A.area/TOT>=GL,gb=Bq.area/TOT>=GL;if(ga===gb)return false;const sm=ga?Bq:A,bg=ga?A:Bq,enc=v.B/Math.max(1e-6,sm.per);return !(enc>=.85&&sm.area<=.2*bg.area)};
 while(S.size){let bk=null,bs=th;S.forEach((v,k)=>{const s=v.SB/v.B;if(s>=bs&&!blocked(k,v)){bs=s;bk=k}});if(!bk)break;
  const[a,b]=bk.split('|').map(Number),A=alive.get(a),Bq=alive.get(b);if(SV_DEBUG){const f=x=>x.nodes.length+'n a'+Math.round(x.area/(TOT/100)*10)/10+'%';console.log('merge',a,b,bs.toFixed(2),'z',byId.get(a).z[0]+'|'+f(A),byId.get(b).z[0]+'|'+f(Bq))}
  A.nodes.push(...Bq.nodes);A.area+=Bq.area;A.per+=Bq.per;A.parts.push(...Bq.parts);S.delete(bk);
  Bq.nb.forEach((_,j)=>{if(j===a)return;const J=alive.get(j),kb=key(b,j),ka=key(a,j),vb=S.get(kb);S.delete(kb);J.nb.delete(b);if(!vb)return;const va=S.get(ka);if(va){va.B+=vb.B;va.SB+=vb.SB}else S.set(ka,{B:vb.B,SB:vb.SB});A.nb.set(j,1);J.nb.set(a,1)});
  A.nb.delete(b);alive.delete(b)}
 return alive}
function analyze(U,o){
 o=o||{};const P=prepare(U,o);if(!P)return[];
 const R=raster(P),{n,nodes}=P,sc=R.sc,tau=o.zt||6,g1=o.g1||1,TA=R.TW*R.TH;
 let TOT=0;for(let i=0;i<n;i++)TOT+=R.area[i];
 const adj=Array.from({length:n},()=>[]);R.pairs.forEach((c,k)=>{const i=Math.floor(k/n),j=k%n;adj[i].push([j,c]);adj[j].push([i,c])});
 const vis=nodes.map(d=>!d.fx&&R.area[d.i]>0),rep=Int32Array.from({length:n},(_,i)=>i),fnd=x=>{while(rep[x]!==x){rep[x]=rep[rep[x]];x=rep[x]}return x},garea=Float64Array.from(R.area),detA=(o.dA===undefined?.0012:o.dA)*TOT;
 const ord=[];for(let i=0;i<n;i++)if(vis[i]&&R.area[i]<=detA)ord.push(i);ord.sort((x,y)=>R.area[x]-R.area[y]);
 for(const i of ord){if(fnd(i)!==i)continue;let bj=-1,bv=0;const hs=new Map();adj[i].forEach(([j,c])=>{if(!vis[j])return;const h=fnd(j);if(h===i)return;hs.set(h,(hs.get(h)||0)+c)});hs.forEach((c,h)=>{if(c>bv){bv=c;bj=h}});
  if(bj<0||bv/Math.max(1,R.per[i])<.6||garea[i]>.35*garea[bj]||garea[bj]/TOT>=.035)continue;rep[i]=bj;garea[bj]+=garea[i]}
 const ridx=new Int32Array(n).fill(-1),reps=[];for(let i=0;i<n;i++)if(vis[i]&&fnd(i)===i){ridx[i]=reps.length;reps.push(i)}
 const cu=new Map();R.pairs.forEach((c,k)=>{const i=Math.floor(k/n),j=k%n;if(!vis[i]||!vis[j])return;const a=ridx[fnd(i)],b=ridx[fnd(j)];if(a===b)return;const kk=a<b?a*reps.length+b:b*reps.length+a;cu.set(kk,(cu.get(kk)||0)+c)});
 const eu=[],ev=[],ew=[];cu.forEach((c,kk)=>{const a=Math.floor(kk/reps.length),b=kk%reps.length,dz=reps[b]-reps[a];eu.push(a);ev.push(b);ew.push(c/(1+(dz/tau)*(dz/tau)))});
 const labR=louvain(reps.length,eu,ev,ew,g1),lab1=new Int32Array(n).fill(-1);for(let i=0;i<n;i++)if(vis[i])lab1[i]=labR[ridx[fnd(i)]];
 const pm=new Map();nodes.forEach(d=>{if(!vis[d.i])return;const k=lab1[d.i];let p=pm.get(k);if(!p)pm.set(k,p={id:k,nodes:[],area:0,per:0,n:0,z:[],nb:new Map()});p.nodes.push(d.i);p.area+=R.area[d.i];p.per+=R.per[d.i];p.n++;if(fnd(d.i)===d.i)p.z.push(d.i)});
 R.pairs.forEach((c,k)=>{const i=Math.floor(k/n),j=k%n;if(!vis[i]||!vis[j])return;const a=lab1[i],b=lab1[j];if(a===b){const p=pm.get(a);p.per-=2*c;return}const A=pm.get(a),B=pm.get(b);A.nb.set(b,(A.nb.get(b)||0)+c);B.nb.set(a,(B.nb.get(a)||0)+c)});
 const pcs=[...pm.values()];pcs.forEach(p=>p.z.sort((x,y)=>x-y));
 const cohv=o.coh===undefined?.25:o.coh,thr=o.th===undefined?.2+.8*cohv:o.th;
 const pbyid=new Map();pcs.forEach(p=>pbyid.set(p.id,p));
 const build=th=>{
  const rx=Math.max(1,thr/Math.max(.05,th));let al=[...mergePieces(pcs,th,TOT,rx).values()];
  const out2=[];al.forEach(E=>{if(E.parts.length<4||(E.area/TOT<.07&&E.nodes.length<60)){out2.push(E);return}
   const set=new Set(E.parts),sub=E.parts.map(id=>{const p=pbyid.get(id),nb=new Map();p.nb.forEach((w,j)=>{if(set.has(j))nb.set(j,w)});return{...p,nb}});
   mergePieces(sub,Math.min(.97,th+.38),TOT,rx).forEach(x=>out2.push(x))});
  const el=[],own=new Int32Array(n).fill(-1);
  out2.forEach(E=>{const idx=el.length;el.push({nodes:E.nodes.slice(),area:E.area,per:E.per,pcs:E.parts.slice(),nb:null});E.nodes.forEach(i=>own[i]=idx)});
  return finish(P,R,el,own,adj,o,vis)};
 const out=build(thr);out.thr=thr;out.lvl=th=>build(th);return out}

function finish(P,R,el,own,adj,o,vis){
 const{n,nodes}=P,sc=R.sc,{W,H,id}=R;
 const foot=(d,fn)=>d.u.segs.forEach(q=>capsuleRows((q.a[0]-R.X0)*sc+1,(q.a[1]-R.Y0)*sc+1,(q.b[0]-R.X0)*sc+1,(q.b[1]-R.Y0)*sc+1,Math.max(.6,q.w*sc/2),H,(y,l,r)=>{const xa=Math.max(0,Math.ceil(l-.5)),xb=Math.min(W-1,Math.floor(r-.5));for(let x=xa;x<=xb;x++)fn(id[y*W+x])}));
 nodes.forEach(d=>{if(vis[d.i]||d.fx)return;const h=new Map();foot(d,k=>{if(k>=0)h.set(k,(h.get(k)||0)+1)});let best=-1,bs=0;h.forEach((c,k)=>{const s=c/(1+Math.abs(k-d.i)/8);if(s>bs){bs=s;best=k}});
  if(best>=0&&own[best]>=0)own[d.i]=own[best];else{let bz=1e9;nodes.forEach(e=>{if(own[e.i]>=0&&Math.abs(e.i-d.i)<bz){bz=Math.abs(e.i-d.i);best=e.i}});if(best>=0)own[d.i]=own[best]}});
 const fxs=[];nodes.forEach(d=>{if(!d.fx)return;const h=new Map();let tot=0;foot(d,k=>{if(k>=0&&own[k]>=0){h.set(own[k],(h.get(own[k])||0)+1);tot++}});let best=-1,bs=0;h.forEach((c,k)=>{if(c>bs){bs=c;best=k}});
  let all=0;foot(d,()=>all++);
  if(tot>0&&bs>=.7*tot&&tot>=.25*all)own[d.i]=best;else fxs.push(d)});
 if(fxs.length){const D=Array.from({length:fxs.length},(_,i)=>i),find=x=>{while(D[x]!==x){D[x]=D[D[x]];x=D[x]}return x};
  for(let a=0;a<fxs.length;a++)for(let b=a+1;b<fxs.length;b++){const A=fxs[a],B=fxs[b];if(A.c!==B.c)continue;const ox=Math.min(A.x1,B.x1)-Math.max(A.x0,B.x0),oy=Math.min(A.y1,B.y1)-Math.max(A.y0,B.y0);if(ox>0&&oy>0)D[find(a)]=find(b)}
  const gm=new Map();fxs.forEach((d,i)=>{const r=find(i);(gm.get(r)||gm.set(r,[]).get(r)).push(d)});
  gm.forEach(g=>{const idx=el.length;el.push({nodes:g.map(d=>d.i),area:0,per:1,pcs:[],nb:new Map(),fx:true});g.forEach(d=>own[d.i]=idx)})}
 const used=new Map();el.forEach((e,i)=>{if(own.includes(i))used.set(i,used.size)});
 const E=[];used.forEach((_,i)=>E.push({...el[i],nodes:[],nb:null,old:i}));own.forEach((o2,i)=>{if(o2>=0)E[used.get(o2)].nodes.push(i)});
 const own2=new Int32Array(n).fill(-1);E.forEach((e,k)=>e.nodes.forEach(i=>own2[i]=k));
 const TW=R.TW,TH=R.TH,dd=(o.det===undefined?.04:o.det)*Math.max(TW,TH);
 const bb=e=>{let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;e.nodes.forEach(i=>{const d=nodes[i];x0=Math.min(x0,d.x0);y0=Math.min(y0,d.y0);x1=Math.max(x1,d.x1);y1=Math.max(y1,d.y1)});e.x0=x0;e.y0=y0;e.x1=x1;e.y1=y1};
 E.forEach(bb);
 const edgeB=(A,B)=>{let s=0;A.nodes.forEach(i=>adj[i].forEach(([j,c])=>{if(own2[j]===B)s+=c}));return s};
 let changed=true,guard=0;while(changed&&guard++<20){changed=false;
  for(let a=0;a<E.length;a++){const e=E[a];if(!e||e.fx||Math.hypot(e.x1-e.x0,e.y1-e.y0)>=dd)continue;
   const tot=new Map();let per=0;e.nodes.forEach(i=>{per+=R.per[i];adj[i].forEach(([j,c])=>{const k=own2[j];if(k!==a&&k>=0)tot.set(k,(tot.get(k)||0)+c)})});
   let bk=-1,bv=0;tot.forEach((v,k)=>{if(v>bv){bv=v;bk=k}});if(bk<0)continue;const T=E[bk],big=(T.x1-T.x0)*(T.y1-T.y0)>=.1*R.TW*R.TH;
   const need=big?.85:.5;if(bv/Math.max(1,per)>=need){T.nodes.push(...e.nodes);e.nodes.forEach(i=>own2[i]=bk);E[a]=null;bb(T);changed=true}}}
 const F=E.filter(Boolean);own2.fill(-1);F.forEach((e,k)=>e.nodes.forEach(i=>own2[i]=k));
 const detPx=dd,multi=F.length>1,cc=P.cc;
 F.forEach(e=>{e.nodes.sort((x,y)=>x-y);e.us=e.nodes.map(i=>P.nodes[i].u);let ns=0;e.us.forEach(u=>ns+=u.segs.length);e.n=ns;
  e.area=0;e.nodes.forEach(i=>e.area+=R.area[i]);e.area/=sc*sc;
  const w=e.x1-e.x0,h=e.y1-e.y0,ba=Math.min(1,e.area/Math.max(1,TW*TH)),asp=Math.max(w,h)/Math.max(1,Math.min(w,h));
  const side=(a,b,t)=>Math.abs(a-b)<=t;const ts=.02*Math.max(TW,TH);
  e.edges=(side(e.x0,R.X0,ts)?1:0)+(side(e.x1,R.X0+TW,ts)?1:0)+(side(e.y0,R.Y0,ts)?1:0)+(side(e.y1,R.Y0+TH,ts)?1:0);
  e.gran=e.area/Math.max(1,e.nodes.length);
  const cm=new Map();e.nodes.forEach(i=>cm.set(nodes[i].c,(cm.get(nodes[i].c)||0)+R.area[i]));let nc=0,tt=0;cm.forEach(v=>tt+=v);cm.forEach(v=>{if(v>=.03*tt)nc++});e.nc=nc;
  let holds=0;e.nodes.forEach(i=>{if(R.area[i]/sc/sc>.015*e.area||R.area[i]===0)return;let bj=-1,bv=0;adj[i].forEach(([j,c])=>{if(c>bv){bv=c;bj=j}});if(bj>=0&&own2[bj]===own2[i]&&bv/Math.max(1,R.per[i])>=.8)holds++});e.holds=holds;
  e.asp=asp;e.ba=ba;e.strip=Math.max(w,h)>=5*Math.max(1,Math.min(w,h));e.span=w>=.7*TW||h>=.7*TH;
  let s=0;if(e.nodes.length>=12)s+=1;if(nc>=3)s+=1;else if(nc>=2)s+=.5;if(holds>=2)s+=1.5;else if(holds>=1)s+=.5;if(asp<=3.5)s+=.5;if(ba>=.003&&ba<=.35)s+=.5;if(e.strip)s-=2;e.score=s;
  const big=ba>=.22||(e.span&&(ba>=.03||e.strip))||(e.edges>=2&&ba>=.07&&e.gran>.004*TW*TH);
  e.kind=e.fx?'effect':multi&&big?'scenery':Math.hypot(w,h)<detPx?'detail':(s>=3.5?'character':(e.nodes.length>=2||holds>=1?'object':'element'));e.bg=e.kind==='scenery'});
 const par=Array.from({length:F.length},(_,i)=>i),fd=x=>{while(par[x]!==x){par[x]=par[par[x]];x=par[x]}return x};
 R.pairs.forEach((c,k)=>{const i=Math.floor(k/n),j=k%n,a=own2[i],b=own2[j];if(a<0||b<0||a===b)return;if(F[a].kind==='scenery'||F[b].kind==='scenery')return;par[fd(a)]=fd(b)});
 F.forEach((e,k)=>{e.comp=F[e.kind==='scenery'?k:fd(k)].kind==='scenery'?'s'+k:'c'+fd(k)});
 F.sort((a,b)=>(a.kind==='scenery'?0:1)-(b.kind==='scenery'?0:1)||a.nodes[0]-b.nodes[0]);
 let ne=0,nd=0,ns=0,nc=0,nl=0,nf=0;const nch=F.filter(e=>e.kind==='character').length;
 F.forEach(e=>{e.nm=e.kind==='scenery'?(++ns>1?'Cenário '+ns:'Cenário'):e.kind==='effect'?'Efeito '+(++nf):e.kind==='detail'?'Detalhe '+(++nd):e.kind==='character'?(nch>1?'Personagem '+(++nc):'Personagem'):e.kind==='object'?'Objeto '+(++ne):'Elemento '+(++nl);e.lc=P.nodes[e.nodes[0]].c;e.np=e.nodes.length});
 return F}

return{analyze,lab,dE,colorClasses,louvain,capsuleRows,prepare,raster}})();
const SmartSeg=SmartVec;
if(typeof module!=='undefined')module.exports=SmartVec;
