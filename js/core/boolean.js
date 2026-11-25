'use strict';
const BOOL=(()=>{
const EPS=1e-9;
const key=p=>Math.round(p[0]*1e5)+','+Math.round(p[1]*1e5);
function clean(r){const o=[];for(const p of r){const q=o[o.length-1];if(!q||Math.abs(q[0]-p[0])>1e-7||Math.abs(q[1]-p[1])>1e-7)o.push([p[0],p[1]])}while(o.length>1&&Math.abs(o[0][0]-o[o.length-1][0])<1e-7&&Math.abs(o[0][1]-o[o.length-1][1])<1e-7)o.pop();return o}
function area(r){let a=0;for(let i=0;i<r.length;i++){const p=r[i],q=r[(i+1)%r.length];a+=p[0]*q[1]-q[0]*p[1]}return a/2}
function inRings(rings,x,y){let c=false;for(const P of rings){for(let i=0,j=P.length-1;i<P.length;j=i++){const a=P[i],b=P[j];if((a[1]>y)!==(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])c=!c}}return c}
function bbox(rings){let x0=1e18,y0=1e18,x1=-1e18,y1=-1e18;for(const P of rings)for(const p of P){if(p[0]<x0)x0=p[0];if(p[0]>x1)x1=p[0];if(p[1]<y0)y0=p[1];if(p[1]>y1)y1=p[1]}return[x0,y0,x1,y1]}
function segInt(a,b,c,d){const r=[b[0]-a[0],b[1]-a[1]],s=[d[0]-c[0],d[1]-c[1]],den=r[0]*s[1]-r[1]*s[0];
 if(Math.abs(den)<EPS)return null;const qp=[c[0]-a[0],c[1]-a[1]],t=(qp[0]*s[1]-qp[1]*s[0])/den,u=(qp[0]*r[1]-qp[1]*r[0])/den;
 if(t<-1e-9||t>1+1e-9||u<-1e-9||u>1+1e-9)return null;return[t,u]}
function polish(r){let p=clean(r);if(p.length<3)return p;
 for(let rd=0;rd<3;rd++){const st=[];let ch=false;
  const test=()=>{while(st.length>=3){const c=st[st.length-1],b=st[st.length-2],a=st[st.length-3],lac=Math.hypot(c[0]-a[0],c[1]-a[1]);
   if(lac<3e-4){st.splice(st.length-2,1);ch=true;continue}
   const d=Math.abs((b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]))/lac,dot=(b[0]-a[0])*(c[0]-b[0])+(b[1]-a[1])*(c[1]-b[1]);
   if(d<2e-4&&dot>0){st.splice(st.length-2,1);ch=true;continue}break}};
  for(const q of p){st.push(q);test()}
  while(st.length>=3){const n=st.length,a=st[n-1],b=st[0],c=st[1],lac=Math.hypot(c[0]-a[0],c[1]-a[1]);
   if(lac<3e-4){st.shift();ch=true;continue}
   const d=Math.abs((b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]))/lac,dot=(b[0]-a[0])*(c[0]-b[0])+(b[1]-a[1])*(c[1]-b[1]);
   if(d<2e-4&&dot>0){st.shift();ch=true;continue}
   const e=st[n-2],f=st[n-1],g=st[0],lg=Math.hypot(g[0]-e[0],g[1]-e[1]);
   if(lg<3e-4){st.pop();ch=true;continue}
   const d2=Math.abs((f[0]-e[0])*(g[1]-e[1])-(f[1]-e[1])*(g[0]-e[0]))/lg,dt2=(f[0]-e[0])*(g[0]-f[0])+(f[1]-e[1])*(g[1]-f[1]);
   if(d2<2e-4&&dt2>0){st.pop();ch=true;continue}break}
  p=clean(st);if(!ch||p.length<3)break}
 return p}
function perim(r){let s=0;for(let i=0;i<r.length;i++){const p=r[i],q=r[(i+1)%r.length];s+=Math.hypot(q[0]-p[0],q[1]-p[1])}return s}
function bool(ops,pred){
 const rings=ops.map(o=>o.map(r=>polish(r)).filter(r=>r.length>=3&&Math.abs(area(r))>1e-9)),
  bbs=rings.map(bbox),edges=[];
 rings.forEach((o,oi)=>o.forEach(r=>{for(let i=0;i<r.length;i++)edges.push({a:r[i],b:r[(i+1)%r.length],op:oi,ts:[0,1]})}));
 const E=edges.length;
 const ex=edges.map(e=>[Math.min(e.a[0],e.b[0]),Math.max(e.a[0],e.b[0]),Math.min(e.a[1],e.b[1]),Math.max(e.a[1],e.b[1])]),ord=[...Array(E).keys()].sort((i,j)=>ex[i][0]-ex[j][0]);
 for(let ii=0;ii<E;ii++){const i=ord[ii],A=edges[i];for(let jj=ii+1;jj<E;jj++){const j=ord[jj];if(ex[j][0]>ex[i][1]+1e-6)break;const B=edges[j];
  if(ex[j][2]>ex[i][3]+1e-6||ex[j][3]<ex[i][2]-1e-6)continue;
  const h=segInt(A.a,A.b,B.a,B.b);
  if(h){A.ts.push(h[0]);B.ts.push(h[1])}
  const r=[A.b[0]-A.a[0],A.b[1]-A.a[1]],L=r[0]*r[0]+r[1]*r[1];if(L<1e-18)continue;
  const ln=Math.sqrt(L),cr=(B.a[0]-A.a[0])*r[1]-(B.a[1]-A.a[1])*r[0],cr2=(B.b[0]-A.a[0])*r[1]-(B.b[1]-A.a[1])*r[0];
  if(Math.abs(cr)/ln<2e-4&&Math.abs(cr2)/ln<2e-4){[B.a,B.b].forEach(p=>{const t=((p[0]-A.a[0])*r[0]+(p[1]-A.a[1])*r[1])/L;if(t>1e-9&&t<1-1e-9)A.ts.push(t)});
   const r2=[B.b[0]-B.a[0],B.b[1]-B.a[1]],L2=r2[0]*r2[0]+r2[1]*r2[1];if(L2<1e-18)continue;[A.a,A.b].forEach(p=>{const t=((p[0]-B.a[0])*r2[0]+(p[1]-B.a[1])*r2[1])/L2;if(t>1e-9&&t<1-1e-9)B.ts.push(t)})}
  else if(!h){const nearA=p=>{const t=((p[0]-A.a[0])*r[0]+(p[1]-A.a[1])*r[1])/L;if(t<=1e-9||t>=1-1e-9)return -1;const x=A.a[0]+r[0]*t,y=A.a[1]+r[1]*t;return Math.hypot(p[0]-x,p[1]-y)<2e-4?t:-1};
   [B.a,B.b].forEach(p=>{const t=nearA(p);if(t>0)A.ts.push(t)});
   const r2=[B.b[0]-B.a[0],B.b[1]-B.a[1]],L2=r2[0]*r2[0]+r2[1]*r2[1];if(L2>=1e-18)[A.a,A.b].forEach(p=>{const t=((p[0]-B.a[0])*r2[0]+(p[1]-B.a[1])*r2[1])/L2;if(t<=1e-9||t>=1-1e-9)return;const x=B.a[0]+r2[0]*t,y=B.a[1]+r2[1]*t;if(Math.hypot(p[0]-x,p[1]-y)<2e-4)B.ts.push(t)})}}}
 const SN=2e-4,cells=new Map(),vs=[];
 const canon=p=>{const cx=Math.floor(p[0]/SN),cy=Math.floor(p[1]/SN);for(let i=-1;i<=1;i++)for(let j=-1;j<=1;j++){const l=cells.get((cx+i)+','+(cy+j));if(l)for(const id of l){const v=vs[id];if(Math.abs(v[0]-p[0])<=SN&&Math.abs(v[1]-p[1])<=SN)return id}}
  vs.push([p[0],p[1]]);const k=cx+','+cy;(cells.get(k)||cells.set(k,[]).get(k)).push(vs.length-1);return vs.length-1};
 const subs=new Map();
 edges.forEach(e=>{const ts=[...new Set(e.ts.map(t=>Math.round(t*1e9)/1e9))].sort((a,b)=>a-b);
  const P=ts.map(t=>t<=0?e.a:t>=1?e.b:[e.a[0]+(e.b[0]-e.a[0])*t,e.a[1]+(e.b[1]-e.a[1])*t]),ids=P.map(canon);
  for(let i=0;i<ids.length-1;i++){const ia=ids[i],ib=ids[i+1];if(ia===ib)continue;const k=ia<ib?ia+'|'+ib:ib+'|'+ia;if(!subs.has(k))subs.set(k,[ia,ib])}});
 let X0=1e18,Y0=1e18,X1=-1e18,Y1=-1e18;bbs.forEach(b=>{if(b[0]<X0)X0=b[0];if(b[1]<Y0)Y0=b[1];if(b[2]>X1)X1=b[2];if(b[3]>Y1)Y1=b[3]});
 const sc=Math.max(1,Math.min(X1-X0,Y1-Y0)||1),eps=Math.min(Math.max(sc*1e-5,2e-4),5e-3);
 const out=[];
 const flags=(x,y)=>rings.map((o,i)=>{const b=bbs[i];if(x<b[0]||x>b[2]||y<b[1]||y>b[3])return false;return inRings(o,x,y)});
 for(const[ia,ib]of subs.values()){const p=vs[ia],q=vs[ib],dx=q[0]-p[0],dy=q[1]-p[1],L=Math.hypot(dx,dy);if(L<1e-9)continue;
  const nx=-dy/L,ny=dx/L,mx=(p[0]+q[0])/2,my=(p[1]+q[1])/2,e=Math.min(eps,L*.25+1e-6);
  const fl=pred(flags(mx+nx*e,my+ny*e)),fr=pred(flags(mx-nx*e,my-ny*e));
  if(fl===fr)continue;out.push(fl?[ia,ib]:[ib,ia])}
 const from=new Map();out.forEach((s,i)=>{(from.get(s[0])||from.set(s[0],[]).get(s[0])).push(i)});
 const used=new Uint8Array(out.length),res=[];
 const ang=s=>Math.atan2(vs[s[1]][1]-vs[s[0]][1],vs[s[1]][0]-vs[s[0]][0]);
 for(let i=0;i<out.length;i++){if(used[i])continue;const ids=[out[i][0]];let cur=i,guard=0,closed=false;
  while(guard++<out.length+2){used[cur]=1;const e=out[cur];ids.push(e[1]);
   if(e[1]===ids[0]){closed=true;break}
   const cand=(from.get(e[1])||[]).filter(j=>!used[j]);if(!cand.length)break;
   if(cand.length===1)cur=cand[0];else{const a0=ang(e);let best=cand[0],bv=1e9;cand.forEach(j=>{let d=ang(out[j])-a0;while(d<=-Math.PI)d+=2*Math.PI;while(d>Math.PI)d-=2*Math.PI;if(d<bv){bv=d;best=j}});cur=best}}
  if(!closed)continue;ids.pop();const r=polish(ids.map(id=>vs[id]));
  if(r.length<3)continue;const A=Math.abs(area(r));if(A<1e-4||2*A/Math.max(perim(r),1e-9)<1e-3)continue;res.push(r)}
 return res}
function simplify(r,tol){if(r.length<4||!(tol>0))return r;
 const rdp=(P,e)=>{if(P.length<3)return P;let m=0,ix=0;const a=P[0],b=P[P.length-1],dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy);for(let i=1;i<P.length-1;i++){const d=L<1e-12?Math.hypot(P[i][0]-a[0],P[i][1]-a[1]):Math.abs((P[i][0]-a[0])*dy-(P[i][1]-a[1])*dx)/L;if(d>m){m=d;ix=i}}return m>e?rdp(P.slice(0,ix+1),e).slice(0,-1).concat(rdp(P.slice(ix),e)):[a,b]};
 let k=0,bd=-1;r.forEach((p,i)=>{const d=Math.hypot(p[0]-r[0][0],p[1]-r[0][1]);if(d>bd){bd=d;k=i}});
 const A=r.slice(0,k+1),B=r.slice(k).concat([r[0]]),s=rdp(A,tol).slice(0,-1).concat(rdp(B,tol).slice(0,-1));return s.length>=3?s:r}
function group(rs){const n=rs.length,ar=rs.map(r=>Math.abs(area(r))),bb=rs.map(r=>bbox([r])),depth=new Array(n).fill(0),par=new Array(n).fill(-1);
 const samples=r=>{const o=[],m=Math.min(r.length,6);for(let k=0;k<m;k++){const i=Math.floor(k*r.length/m),a=r[i],b=r[(i+1)%r.length],t=k%2?.37:.61;o.push([a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t])}return o},sm=rs.map(samples);
 const inside=(i,j)=>{const b=bb[i],c=bb[j];if(b[0]<c[0]-1e-6||b[1]<c[1]-1e-6||b[2]>c[2]+1e-6||b[3]>c[3]+1e-6)return false;let ok=0;for(const p of sm[i]){if(inRings([rs[j]],p[0],p[1]))ok++}return ok>=Math.ceil(sm[i].length*.6)};
 for(let i=0;i<n;i++){let best=-1;for(let j=0;j<n;j++){if(i===j||ar[j]<=ar[i])continue;if(inside(i,j)&&(best<0||ar[j]<ar[best]))best=j}par[i]=best}
 for(let i=0;i<n;i++){let d=0,j=par[i];while(j>=0){d++;j=par[j]}depth[i]=d}
 const gs=[];const idx=new Map();for(let i=0;i<n;i++)if(depth[i]%2===0){const g={outer:rs[i],holes:[]};gs.push(g);idx.set(i,g)}
 for(let i=0;i<n;i++)if(depth[i]%2===1){const g=idx.get(par[i]);if(g)g.holes.push(rs[i])}
 return gs}
return{bool,simplify,group,area,clean,polish,inRings,bbox,segInt}})();
if(typeof module!=='undefined')module.exports=BOOL;
