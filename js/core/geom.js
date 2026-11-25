'use strict';
const R2=n=>Math.round(n*100)/100;
const A={id:()=>[1,0,0,1,0,0],
 mul:(m,n)=>[m[0]*n[0]+m[2]*n[1],m[1]*n[0]+m[3]*n[1],m[0]*n[2]+m[2]*n[3],m[1]*n[2]+m[3]*n[3],m[0]*n[4]+m[2]*n[5]+m[4],m[1]*n[4]+m[3]*n[5]+m[5]],
 pt:(m,p)=>[m[0]*p[0]+m[2]*p[1]+m[4],m[1]*p[0]+m[3]*p[1]+m[5]],lin:(m,p)=>[m[0]*p[0]+m[2]*p[1],m[1]*p[0]+m[3]*p[1]],
 rot:a=>{const c=Math.cos(a),s=Math.sin(a);return[c,s,-s,c,0,0]},sc:(x,y)=>[x,0,0,y,0,0],tr:(x,y)=>[1,0,0,1,x,y],
 about(m,x,y){return A.mul(A.tr(x,y),A.mul(m,A.tr(-x,-y)))}};
const G=(()=>{
const bez=(p,n)=>{const o=[];for(let i=0;i<=n;i++){const t=i/n,u=1-t;o.push([0,1].map(k=>p[0][k]*u*u*u+3*p[1][k]*u*u*t+3*p[2][k]*u*t*t+p[3][k]*t*t*t))}return o};
function cr(q,i0,i1,n,o){for(let i=i0;i<i1;i++)for(let j=0;j<n;j++){const t=j/n,t2=t*t,t3=t2*t;o.push([0,1].map(k=>.5*(2*q[i][k]+(-q[i-1][k]+q[i+1][k])*t+(2*q[i-1][k]-5*q[i][k]+4*q[i+1][k]-q[i+2][k])*t2+(-q[i-1][k]+3*q[i][k]-3*q[i+1][k]+q[i+2][k])*t3)))}}
function catmull(p,n,closed){if(p.length<3)return p.slice();const o=[];if(closed){const L=p.length,q=[p[L-1],...p,p[0],p[1]];cr(q,1,L+1,n,o);o.push(o[0].slice())}else{const q=[p[0],...p,p[p.length-1]];cr(q,1,q.length-2,n,o);o.push(p[p.length-1])}return o}
function bs(q,i,n,o){for(let j=0;j<n;j++){const t=j/n,t2=t*t,t3=t2*t;o.push([0,1].map(k=>(((-q[i][k]+3*q[i+1][k]-3*q[i+2][k]+q[i+3][k])*t3+(3*q[i][k]-6*q[i+1][k]+3*q[i+2][k])*t2+(-3*q[i][k]+3*q[i+2][k])*t+(q[i][k]+4*q[i+1][k]+q[i+2][k]))/6)))}}
function bspl(p,n,closed){if(p.length<4&&!closed)return p.slice();const o=[];if(closed){if(p.length<3)return p.slice();const q=[...p,p[0],p[1],p[2]];for(let i=0;i<p.length;i++)bs(q,i,n,o);o.push(o[0].slice())}else{const q=[p[0],p[0],...p,p[p.length-1],p[p.length-1]];for(let i=0;i<q.length-3;i++)bs(q,i,n,o);o.push(p[p.length-1])}return o}
const mk=(a,b,s)=>Math.hypot(a[0]-b[0],a[1]-b[1])<.005?null:{a:[R2(a[0]),R2(a[1])],b:[R2(b[0]),R2(b[1])],c:s.c,w:s.w,al:s.al,fg:s.fg};
function hatch(a,b,kind,ang,hs,inset){const out=[],th=ang*Math.PI/180,dx=Math.cos(th),dy=Math.sin(th),nx=-dy,ny=dx;hs=Math.max(.3,hs);const ext=kind==='R'?a*Math.abs(nx)+b*Math.abs(ny):Math.hypot(a*nx,b*ny);let k=0;
 for(let o=-ext+hs/2;o<ext;o+=hs,k++){let t0,t1;
  if(kind==='R'){t0=-1e9;t1=1e9;for(const[d,s,l]of[[dx,nx*o,a],[dy,ny*o,b]]){if(Math.abs(d)<1e-9){if(Math.abs(s)>l){t0=1;t1=0}}else{const q0=(-l-s)/d,q1=(l-s)/d;t0=Math.max(t0,Math.min(q0,q1));t1=Math.min(t1,Math.max(q0,q1))}}}
  else{const x0=nx*o,y0=ny*o,A_=(dx/a)**2+(dy/b)**2,B=2*(x0*dx/(a*a)+y0*dy/(b*b)),C=(x0/a)**2+(y0/b)**2-1,D=B*B-4*A_*C;if(D<=0)continue;const sq=Math.sqrt(D);t0=(-B-sq)/(2*A_);t1=(-B+sq)/(2*A_)}
  t0+=inset;t1-=inset;if(t1-t0<.3)continue;let p=[nx*o+dx*t0,ny*o+dy*t0],q=[nx*o+dx*t1,ny*o+dy*t1];if(k&1)[p,q]=[q,p];out.push([p,q])}return out}
function hatchPoly(polys,ang,hs,inset,start,minrun){const th=ang*Math.PI/180,c=Math.cos(th),s=Math.sin(th),edges=[];let y0=1e9,y1=-1e9;hs=Math.max(.3,hs);minrun=minrun===undefined?.3:minrun;
 for(const p of polys){const n=p.length;for(let i=0;i<n;i++){const a=p[i],b=p[(i+1)%n],ax=a[0]*c+a[1]*s,ay=-a[0]*s+a[1]*c,bx=b[0]*c+b[1]*s,by=-b[0]*s+b[1]*c;if(ay<y0)y0=ay;if(ay>y1)y1=ay;if(ay===by)continue;edges.push(ay<by?[ax,ay,bx,by]:[bx,by,ax,ay])}}
 const out=[];let k=0;for(let y=start===undefined?y0+hs/2:start;y<y1;y+=hs,k++){const xs=[];for(const e of edges)if(e[1]<=y&&y<e[3])xs.push(e[0]+(y-e[1])*(e[2]-e[0])/(e[3]-e[1]));xs.sort((a,b)=>a-b);
  for(let i=0;i+1<xs.length;i+=2){let xa=xs[i]+inset,xb=xs[i+1]-inset;if(xb-xa<minrun)continue;if(k&1)[xa,xb]=[xb,xa];out.push([[xa*c-y*s,xa*s+y*c],[xb*c-y*s,xb*s+y*c]])}}return out}
function insetPoly(p,d){let P=[];for(const q of p)if(!P.length||Math.hypot(q[0]-P[P.length-1][0],q[1]-P[P.length-1][1])>1e-6)P.push(q);if(P.length>2&&Math.hypot(P[0][0]-P[P.length-1][0],P[0][1]-P[P.length-1][1])<1e-6)P.pop();
 let n=P.length;if(n<3)return null;let A=0;for(let i=0;i<n;i++){const a=P[i],b=P[(i+1)%n];A+=a[0]*b[1]-b[0]*a[1]}if(Math.abs(A)<1e-6)return null;const sg=A>0?1:-1;
 let E=[];for(let i=0;i<n;i++){const a=P[i],b=P[(i+1)%n],dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy);E.push({a,dx:dx/L,dy:dy/L,nx:-dy/L*sg,ny:dx/L*sg})}
 for(let g=0;g<64;g++){const m=E.length;if(m<3)return null;const q=[];
  for(let i=0;i<m;i++){const e0=E[(i+m-1)%m],e1=E[i],cr=e0.dx*e1.dy-e0.dy*e1.dx,px=e1.a[0]+e1.nx*d,py=e1.a[1]+e1.ny*d;if(Math.abs(cr)<1e-6){q.push([px,py]);continue}
   const qx=e0.a[0]+e0.nx*d,qy=e0.a[1]+e0.ny*d,t=((px-qx)*e1.dy-(py-qy)*e1.dx)/cr;q.push([qx+e0.dx*t,qy+e0.dy*t])}
  let rev=-1;for(let i=0;i<m;i++){const a=q[i],b=q[(i+1)%m];if((b[0]-a[0])*E[i].dx+(b[1]-a[1])*E[i].dy<=1e-9){rev=i;break}}
  if(rev<0){let B=0;for(let i=0;i<m;i++){const a=q[i],b=q[(i+1)%m];B+=a[0]*b[1]-b[0]*a[1]}return B*A>0&&Math.abs(B)>1e-3?q:null}
  E.splice(rev,1)}return null}

const convex=p=>{let sg=0,tot=0;const n=p.length;for(let i=0;i<n;i++){const a=p[i],b=p[(i+1)%n],c=p[(i+2)%n],ux=b[0]-a[0],uy=b[1]-a[1],vx=c[0]-b[0],vy=c[1]-b[1],z=ux*vy-uy*vx;if(Math.abs(z)<1e-9)continue;const s=z>0?1:-1;if(!sg)sg=s;else if(s!==sg)return false;tot+=Math.atan2(z,ux*vx+uy*vy)}return Math.abs(Math.abs(tot)-2*Math.PI)<.05};
function edt1(f,n,d,v,z){let k=0;v[0]=0;z[0]=-1e20;z[1]=1e20;for(let q=1;q<n;q++){let s=((f[q]+q*q)-(f[v[k]]+v[k]*v[k]))/(2*q-2*v[k]);while(s<=z[k]){k--;s=((f[q]+q*q)-(f[v[k]]+v[k]*v[k]))/(2*q-2*v[k])}k++;v[k]=q;z[k]=s;z[k+1]=1e20}k=0;for(let q=0;q<n;q++){while(z[k+1]<q)k++;d[q]=(q-v[k])*(q-v[k])+f[v[k]]}}
let DRAFT=0;
function distField(polys,wHint){let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;for(const p of polys)for(const q of p){x0=Math.min(x0,q[0]);x1=Math.max(x1,q[0]);y0=Math.min(y0,q[1]);y1=Math.max(y1,q[1])}
 const bw=x1-x0,bh=y1-y0;if(!(bw>0&&bh>0))return null;
 let sc=Math.min(DRAFT?1.4:Math.max(1.6,Math.min(5,1/(.14*(wHint||1)+.06))),Math.max(.1,(DRAFT?420:1500)/Math.max(bw,bh)));while((bw*sc+8)*(bh*sc+8)>(DRAFT?9e5:3e6)&&sc>.03)sc*=.88;
 const w=Math.ceil(bw*sc)+8,h=Math.ceil(bh*sc)+8,rows=new Array(h);
 for(const p of polys){const n=p.length;for(let i=0;i<n;i++){const a=p[i],b=p[(i+1)%n];let ax=(a[0]-x0)*sc+4,ay=(a[1]-y0)*sc+4,bx=(b[0]-x0)*sc+4,by=(b[1]-y0)*sc+4;if(ay===by)continue;if(ay>by){let t=ax;ax=bx;bx=t;t=ay;ay=by;by=t}
  const ya=Math.max(0,Math.ceil(ay-.5)),yb=Math.min(h-1,Math.ceil(by-.5)-1),k=(bx-ax)/(by-ay);for(let y=ya;y<=yb;y++)(rows[y]||(rows[y]=[])).push(ax+(y+.5-ay)*k)}}
 const f=new Float64Array(w*h),n=Math.max(w,h),dd=new Float64Array(n),v=new Int32Array(n),z=new Float64Array(n+1),col=new Float64Array(n);
 for(let y=0;y<h;y++){const xs=rows[y];if(!xs)continue;xs.sort((a,b)=>a-b);for(let i=0;i+1<xs.length;i+=2){const xa=Math.max(0,Math.ceil(xs[i]-.5)),xb=Math.min(w-1,Math.ceil(xs[i+1]-.5)-1);for(let x=xa;x<=xb;x++)f[y*w+x]=1e9}}
 for(let x=0;x<w;x++){for(let y=0;y<h;y++)col[y]=f[y*w+x];edt1(col,h,dd,v,z);for(let y=0;y<h;y++)f[y*w+x]=dd[y]}
 const row=new Float64Array(w);for(let y=0;y<h;y++){for(let x=0;x<w;x++)row[x]=f[y*w+x];edt1(row,w,dd,v,z);for(let x=0;x<w;x++)f[y*w+x]=dd[x]}
 const F=new Float32Array(w*h);for(let i=0;i<w*h;i++)F[i]=f[i]>0?Math.max(0,(Math.sqrt(f[i])-.5)/sc):0;
 return{F,w,h,sc,x0,y0,win:[0,w-2,0,h-2]}}
function bandInit(DF){const{F,w,h}=DF,N=w*h,mn=new Float32Array(N),mx=new Float32Array(N);let maxV=0,cnt=0;
 for(let y=0;y<h-1;y++){const r0=y*w,r1=r0+w;for(let x=0;x<w-1;x++){const a=F[r0+x],b=F[r0+x+1],c=F[r1+x+1],d=F[r1+x];let lo=a,hi=a;if(b<lo)lo=b;if(b>hi)hi=b;if(c<lo)lo=c;if(c>hi)hi=c;if(d<lo)lo=d;if(d>hi)hi=d;const i=r0+x;mn[i]=lo;mx[i]=hi;if(hi>0){cnt++;if(hi>maxV)maxV=hi}}}
 const nb=1024,bw=(maxV+1e-6)/nb,cntB=new Int32Array(nb+1);
 for(let i=0;i<N;i++)if(mx[i]>0){let k=Math.floor(mn[i]/bw);if(k>=nb)k=nb-1;cntB[k+1]++}
 for(let k=0;k<nb;k++)cntB[k+1]+=cntB[k];
 const order=new Int32Array(cnt),pos=cntB.slice(0,nb);
 for(let i=0;i<N;i++)if(mx[i]>0){let k=Math.floor(mn[i]/bw);if(k>=nb)k=nb-1;order[pos[k]++]=i}
 DF.band={mn,mx,bw,nb,cntB,order,act:new Int32Array(Math.max(16,cnt>>2)),na:0,nextBin:0,added:new Uint8Array(N),lastL:-1}}
function bandCells(DF,L){let B=DF.band;if(!B||L<B.lastL){bandInit(DF);B=DF.band}B.lastL=L;
 const{mn,mx,bw,nb,cntB,order}=B;let act=B.act,na=B.na;
 const push=i=>{if(na>=act.length){const t=new Int32Array(act.length*2);t.set(act);act=t}act[na++]=i};
 while(B.nextBin<nb&&(B.nextBin+1)*bw<=L){const k=B.nextBin;for(let j=cntB[k];j<cntB[k+1];j++){const i=order[j];if(!B.added[i]){B.added[i]=1;push(i)}}B.nextBin++}
 if(B.nextBin<nb){const k=B.nextBin;for(let j=cntB[k];j<cntB[k+1];j++){const i=order[j];if(!B.added[i]&&mn[i]<L){B.added[i]=1;push(i)}}}
 let m=0;for(let q=0;q<na;q++){const i=act[q];if(mx[i]>=L)act[m++]=i}
 na=m;B.act=act;B.na=na;const out=act.slice(0,na);out.sort();return out}
function isoLoops(DF,L,tol,minA,cellsIn){const{F,w,h,sc,x0,y0}=DF,W1=w+1,sa=[],sb=[],NV=(h+1)*W1*2;
 let NA=DF.nA,NB=DF.nB;if(!NA||NA.length!==NV){NA=DF.nA=new Int32Array(NV).fill(-1);NB=DF.nB=new Int32Array(NV).fill(-1)}
 const add=(a,b)=>{const i=sa.length;sa.push(a);sb.push(b);if(NA[a]<0)NA[a]=i;else NB[a]=i;if(NA[b]<0)NA[b]=i;else NB[b]=i};
 const cells=cellsIn||bandCells(DF,L);
 for(let q=0;q<cells.length;q++){const id=cells[q],x=id%w,y=(id-x)/w,r0=id,r1=id+w;const c=(F[r0]>=L?8:0)|(F[r0+1]>=L?4:0)|(F[r1+1]>=L?2:0)|(F[r1]>=L?1:0);if(c===0||c===15)continue;
  const Tp=(y*W1+x)*2,B=((y+1)*W1+x)*2,Lf=(y*W1+x)*2+1,R=(y*W1+x+1)*2+1;
  switch(c){case 1:case 14:add(Lf,B);break;case 2:case 13:add(B,R);break;case 3:case 12:add(Lf,R);break;case 4:case 11:add(Tp,R);break;case 5:add(Tp,Lf);add(B,R);break;case 6:case 9:add(Tp,B);break;case 7:case 8:add(Tp,Lf);break;case 10:add(Tp,R);add(Lf,B);break}}
 const pt=id=>{const v=id&1,i=id>>1,x=i%W1,y=(i-x)/W1;let px,py;if(!v){const a=F[y*w+x],b=F[y*w+x+1];px=x+(L-a)/(b-a);py=y}else{const a=F[y*w+x],b=F[(y+1)*w+x];px=x;py=y+(L-a)/(b-a)}return[x0+(px+.5-4)/sc,y0+(py+.5-4)/sc]};
 const used=new Uint8Array(sa.length),out=[];let bx0=1e9,bx1=-1,by0=1e9,by1=-1;
 for(let s=0;s<sa.length;s++){if(used[s])continue;used[s]=1;const ids=[sa[s]];let cur=sb[s];for(;;){ids.push(cur);let nx=-1,q=NA[cur];if(q>=0&&!used[q])nx=q;else{q=NB[cur];if(q>=0&&!used[q])nx=q}if(nx<0)break;used[nx]=1;cur=sa[nx]===cur?sb[nx]:sa[nx]}
  if(ids.length<4)continue;if(ids[0]===ids[ids.length-1])ids.pop();ids.forEach(id=>{const i=id>>1,x=i%W1,y=(i-x)/W1;if(x<bx0)bx0=x;if(x>bx1)bx1=x;if(y<by0)by0=y;if(y>by1)by1=y});
  let lp=ids.map(pt);if(minA<0){if(lp.length>=3)out.push(lp);continue}lp=Text.simpClosed(lp,Math.max(tol||.16,.6/sc));if(lp.length>=3){let A_=0;for(let i=0;i<lp.length;i++){const a=lp[i],b=lp[(i+1)%lp.length];A_+=a[0]*b[1]-b[0]*a[1]}if(Math.abs(A_)/2>(minA===undefined?.3:minA))out.push(lp)}}
 for(let i=0;i<sa.length;i++){NA[sa[i]]=-1;NB[sa[i]]=-1;NA[sb[i]]=-1;NB[sb[i]]=-1}
 if(bx1>=0)DF.win=[Math.max(0,bx0-2),Math.min(w-2,bx1+2),Math.max(0,by0-2),Math.min(h-2,by1+2)];else DF.win=[0,-1,0,-1];return out}
const inPoly=(P,p)=>{let c=false;for(let i=0,j=P.length-1;i<P.length;j=i++){const a=P[i],b=P[j];if((a[1]>p[1])!==(b[1]>p[1])&&p[0]<(b[0]-a[0])*(p[1]-a[1])/(b[1]-a[1])+a[0])c=!c}return c};
function dropLast(q){if(q.length>2&&Math.hypot(q[0][0]-q[q.length-1][0],q[0][1]-q[q.length-1][1])<1e-6)q=q.slice(0,-1);return q}

function qCubics(pts,closed){const n=pts.length,out=[];if(n<4)return out;const m=Math.floor((n-1)/3);
 for(let i=0;i<m;i++)out.push([pts[3*i],pts[3*i+1],pts[3*i+2],pts[3*i+3]]);
 if(closed){if(n%3===0&&n>=6)out.push([pts[n-3],pts[n-2],pts[n-1],pts[0]]);else{const a=pts[3*m],b=pts[0];out.push([a,[a[0]+(b[0]-a[0])/3,a[1]+(b[1]-a[1])/3],[a[0]+(b[0]-a[0])*2/3,a[1]+(b[1]-a[1])*2/3],b])}}
 return out}
function cubicFlat(c){const[p0,p1,p2,p3]=c,dx=p3[0]-p0[0],dy=p3[1]-p0[1],L=Math.hypot(dx,dy);let d1,d2;
 if(L<1e-9){d1=Math.hypot(p1[0]-p0[0],p1[1]-p0[1]);d2=Math.hypot(p2[0]-p0[0],p2[1]-p0[1])}
 else{d1=Math.abs((p1[0]-p0[0])*dy-(p1[1]-p0[1])*dx)/L;d2=Math.abs((p2[0]-p0[0])*dy-(p2[1]-p0[1])*dx)/L}return Math.max(d1,d2)}
function flatCubic(c,tol,o,depth){if(depth>=10||cubicFlat(c)<=tol){o.push(c[3]);return}
 const[p0,p1,p2,p3]=c,m=(a,b)=>[(a[0]+b[0])/2,(a[1]+b[1])/2],p01=m(p0,p1),p12=m(p1,p2),p23=m(p2,p3),a=m(p01,p12),b=m(p12,p23),mid=m(a,b);
 flatCubic([p0,p01,a,mid],tol,o,depth+1);flatCubic([mid,b,p23,p3],tol,o,depth+1)}
function qcurve(pts,closed,n){const cs=qCubics(pts,closed);if(!cs.length)return pts.slice();const tol=Math.max(.01,.35*Math.pow(24/Math.max(2,n),2)),o=[cs[0][0]];cs.forEach(c=>flatCubic(c,tol,o,0));return o}
function qSplit(c,t){const L=(a,b)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t],[p0,p1,p2,p3]=c,a=L(p0,p1),b=L(p1,p2),d=L(p2,p3),e=L(a,b),f=L(b,d),m=L(e,f);return[[p0,a,e,m],[m,f,d,p3]]}
function qNear(pts,closed,w){const cs=qCubics(pts,closed);let best=null;cs.forEach((c,si)=>{const N=32;let prev=c[0],pt=0;for(let k=1;k<=N;k++){const t=k/N,u=1-t,q=[0,1].map(i=>c[0][i]*u*u*u+3*c[1][i]*u*u*t+3*c[2][i]*u*t*t+c[3][i]*t*t*t);
  const dx=q[0]-prev[0],dy=q[1]-prev[1],L2=dx*dx+dy*dy||1e-9,s=Math.max(0,Math.min(1,((w[0]-prev[0])*dx+(w[1]-prev[1])*dy)/L2)),px=prev[0]+dx*s,py=prev[1]+dy*s,d=Math.hypot(w[0]-px,w[1]-py);
  if(!best||d<best.d)best={d,seg:si,t:pt+(t-pt)*s,p:[px,py]};prev=q;pt=t}});return best}
function shapeSegs(it){const o=it.o||{},sty=(c,w,al,fg)=>({c,w,al:al==null?it.al:al,fg:fg==null?it.fg:fg}),st=sty(it.c,it.w),O=[],F=[],mode=o.mode||'o',n=Math.max(2,Math.round(o.n||24));
 const poly=(pts,closed,s,dst)=>{for(let i=0;i<pts.length-1;i++){const m=mk(pts[i],pts[i+1],s);if(m)dst.push(m)}if(closed&&pts.length>2){const m=mk(pts[pts.length-1],pts[0],s);if(m)dst.push(m)}};
 const both=mode==='b',os=both&&o.ocOn?sty(o.oc||it.c,o.ow||it.w,o.oa,(o.ofg===''||o.ofg==null)?null:+o.ofg):st,fs=o.fcOn?sty(o.fc||it.c,o.fw||it.w,o.fa,(o.ffg===''||o.ffg==null)?null:+o.ffg):st,front=o.top==='f'?'f':'o';
 const marks=[],gOn=!!o.fcOn&&o.gm==='g'&&Array.isArray(o.gs)&&o.gs.length>=2;
 const grad=()=>{if(!gOn||!F.length)return;const gs=o.gs.map(x=>{const h=String(x.c||'ffffff').replace('#','').padEnd(6,'0');return{r:parseInt(h.slice(0,2),16)||0,g:parseInt(h.slice(2,4),16)||0,b:parseInt(h.slice(4,6),16)||0,a:Math.max(0,Math.min(1,+x.a===+x.a?+x.a:1))}}),K=gs.length-1,hx=v=>Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,'0');
  const at=t=>{t=Math.max(0,Math.min(1,t))*K;const i=Math.min(K-1,Math.floor(t)),f=t-i,A=gs[i],B=gs[i+1];return{c:hx(A.r+(B.r-A.r)*f)+hx(A.g+(B.g-A.g)*f)+hx(A.b+(B.b-A.b)*f),a:Math.round((A.a+(B.a-A.a)*f)*100)/100}};
  const T=new Array(F.length);
  if(o.fm==='r'&&marks.length){let k=0;const last=Math.max(1,marks.length-1);for(let i=0;i<F.length;i++){while(k+1<marks.length&&marks[k+1]<=i)k++;T[i]=k/last}}
  else{const th=(o.ha||0)*Math.PI/180,nx=-Math.sin(th),ny=Math.cos(th);let lo=1e18,hi=-1e18;const P=F.map(m=>{const a=m.a[0]*nx+m.a[1]*ny,b=m.b[0]*nx+m.b[1]*ny;lo=Math.min(lo,a,b);hi=Math.max(hi,a,b);return(a+b)/2});const sp=hi-lo||1;for(let i=0;i<F.length;i++)T[i]=(P[i]-lo)/sp}
  F.forEach((m,i)=>{const q=at(T[i]);m.c=q.c;m.al=q.a})},
 join=()=>{grad();return front==='o'?[...F,...O]:[...O,...F]},own=!!o.rsOn&&o.fm==='r',rsn=Math.max(2,Math.round(o.rsn||12));
 const repeat=ring=>{const af=o.af||.9,cnt=o.rc>0?Math.min(400,Math.round(o.rc)):400,wk=k=>Math.max(1,Math.round(fs.w+k*(o.rg||0)));
  let prevW=mode==='f'?null:os.w,DF=null,cur=ring,off=0,cv=convex(ring);
  const tolOf=(w,k)=>Math.min(1.1,(.14+.1*w)*(1+Math.min(1.3,k*.035))),seen=new Set();
  const ridgeEmit=(lp,w)=>{let q=lp.length>=5?Text.simpClosed(lp,w*.34+.15):lp;if(q.length<2)return;const n=q.length;for(let i=0;i<n;i++){const a=q[i],b=q[(i+1)%n];if(n===2&&i===1)break;const ka=a[0].toFixed(1)+','+a[1].toFixed(1),kb=b[0].toFixed(1)+','+b[1].toFixed(1),key=ka<kb?ka+'|'+kb:kb+'|'+ka;if(seen.has(key))continue;seen.add(key);const m=mk(a,b,sty(fs.c,w,fs.al,fs.fg));if(m)F.push(m)}};
  const area=lp=>{let A=0,P=0;for(let i=0;i<lp.length;i++){const a=lp[i],b=lp[(i+1)%lp.length];A+=a[0]*b[1]-b[0]*a[1];P+=Math.hypot(b[0]-a[0],b[1]-a[1])}return[Math.abs(A)/2,P]};
  const level=(L,w,k,thinOnly)=>{const raw=isoLoops(DF,L,0,-1),thick=[];let any=raw.length>0;
   raw.forEach(lp=>{const[A,P]=area(lp),tau=P>0?2*A/P:0;if(tau<.95*w)ridgeEmit(lp,w);else if(!thinOnly){const q=Text.simpClosed(lp,Math.max(tolOf(w,k),.6/DF.sc));if(q.length>=3&&area(q)[0]>Math.max(.3,w*w*.35))thick.push(q)}});return{thick,any}};
  const rdp=(P,e)=>{if(P.length<3)return P;let m=0,ix=0;const a=P[0],b=P[P.length-1],dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy)||1e-9;for(let i=1;i<P.length-1;i++){const d=Math.abs((P[i][0]-a[0])*dy-(P[i][1]-a[1])*dx)/L;if(d>m){m=d;ix=i}}return m>e?rdp(P.slice(0,ix+1),e).slice(0,-1).concat(rdp(P.slice(ix),e)):[a,b]};
  const wmax=(p,r)=>{const gx=(p[0]-DF.x0)*DF.sc+3.5,gy=(p[1]-DF.y0)*DF.sc+3.5,Fd=DF.F,W=DF.w;let m=0;for(let y=Math.max(0,Math.floor(gy-r));y<=Math.min(DF.h-1,Math.ceil(gy+r));y++)for(let x=Math.max(0,Math.floor(gx-r));x<=Math.min(W-1,Math.ceil(gx+r));x++){const dx=x-gx,dy=y-gy;if(dx*dx+dy*dy<=r*r){const v=Fd[y*W+x];if(v>m)m=v}}return m};
  const allBelow=(raw,r,thr)=>{if(!(thr>0))return()=>false;const W=DF.w,H=DF.h,Fd=DF.F,rr=r*r;let built=false,P=null,ra=0;
   const build=()=>{built=true;let lo=1e9,hi=-1e9;for(const lp of raw)for(const p of lp){const gy=(p[1]-DF.y0)*DF.sc+3.5;if(gy<lo)lo=gy;if(gy>hi)hi=gy}ra=Math.max(0,Math.floor(lo-r));const rb=Math.min(H-1,Math.ceil(hi+r));if(rb<ra)return;const need=(rb-ra+1)*(W+1);if(!DF.pf||DF.pf.length<need)DF.pf=new Int32Array(need);P=DF.pf;
    for(let y=ra;y<=rb;y++){const o=(y-ra)*(W+1),fo=y*W;let c=0;P[o]=0;for(let x=0;x<W;x++){if(Fd[fo+x]>=thr)c++;P[o+x+1]=c}}};
   return p=>{if(!built)build();if(!P)return true;const gx=(p[0]-DF.x0)*DF.sc+3.5,gy=(p[1]-DF.y0)*DF.sc+3.5,y1=Math.min(H-1,Math.ceil(gy+r));
    for(let y=Math.max(0,Math.floor(gy-r));y<=y1;y++){const dy=y-gy,lim=rr-dy*dy;if(lim<0)continue;const s=Math.sqrt(lim),inn=x=>{const dx=x-gx;return dx*dx+dy*dy<=rr};let xl=Math.ceil(gx-s),xr=Math.floor(gx+s);
     while(inn(xl-1))xl--;while(xl<=xr&&!inn(xl))xl++;while(inn(xr+1))xr++;while(xr>=xl&&!inn(xr))xr--;
     const a=Math.max(xl,0),b=Math.min(xr,W-1);if(a>b)continue;const o=(y-ra)*(W+1);if(P[o+b+1]-P[o+a]>0)return false}
    return true}};
  const dPoly=(p,Q)=>{let b=1e9;for(let i=0;i<Q.length-1;i++){const a=Q[i],c=Q[i+1],dx=c[0]-a[0],dy=c[1]-a[1],L2=dx*dx+dy*dy||1e-9;let t=((p[0]-a[0])*dx+(p[1]-a[1])*dy)/L2;t=t<0?0:t>1?1:t;const d=Math.hypot(p[0]-a[0]-t*dx,p[1]-a[1]-t*dy);if(d<b)b=d}return b};
  const halfRidge=(Lh,Ln,w)=>{const raw=isoLoops(DF,Lh,0,-1);if(!raw.length)return;const r=Math.max(1.5,w*.85*DF.sc),done=[];
   const far=allBelow(raw,r,Ln-.001);
   raw.forEach(lp=>{const n=lp.length,ok=lp.map(far);if(!ok.some(Boolean))return;let st=ok.findIndex(v=>!v);const runs=[];
    if(st<0){runs.push(lp.concat([lp[0]]))}else{let run=null;for(let q=1;q<=n;q++){const i=(st+q)%n;if(ok[i]){(run=run||[]).push(lp[i])}else if(run){runs.push(run);run=null}}if(run)runs.push(run)}
    runs.forEach(rn=>{if(rn.length<2)return;const sm=rdp(rn,w*.3+.1);let near=0;sm.forEach(p=>{if(done.some(Q=>dPoly(p,Q)<=w*.45))near++});if(near>=sm.length*.8&&sm.length>1)return;done.push(sm);
     for(let i=0;i<sm.length-1;i++){const a=sm[i],b=sm[i+1],ka=a[0].toFixed(1)+','+a[1].toFixed(1),kb=b[0].toFixed(1)+','+b[1].toFixed(1),key=ka<kb?ka+'|'+kb:kb+'|'+ka;if(seen.has(key))continue;seen.add(key);const m=mk(a,b,sty(fs.c,w,fs.al,fs.fg));if(m)F.push(m)}})})};
  for(let k=0;k<cnt;k++){marks.push(F.length);const w=wk(k),step=o.auto?((prevW===null?w:(prevW+w)/2)*af):Math.max(.3,o.hs||6),d=(k===0?(mode==='f'?0:step)+(o.hi||0):step);let loops;
   if(d===0&&k===0){loops=[ring];if(!cv){DF=distField([ring],fs.w);if(!DF)break}}
   else if(cv){const n2=insetPoly(cur,d);if(!n2){const mid=insetPoly(cur,d*.5);if(mid)ridgeEmit(mid,w);break}cur=n2;loops=[cur]}
   else{off+=d;if(!DF){DF=distField([ring],fs.w);if(!DF)break}const r=level(off,w,k,false);if(!r.any)break;loops=r.thick}
   loops.forEach(lp=>poly(lp,true,sty(fs.c,w,fs.al,fs.fg),F));prevW=w;
   if(!cv&&DF)halfRidge(off+step*.5,off+step,w)}};
 switch(it.t){
 case'P':case'B':case'S':case'N':case'Q':{if((it.t==='B'||it.t==='Q')&&it.pts.length<4)return O;const straight=it.t==='P'||it.t==='B',curveN=nn=>it.t==='P'?it.pts:it.t==='B'?bez(it.pts,nn):it.t==='Q'?qcurve(it.pts,o.closed,nn):it.t==='S'?G.catmull(it.pts,Math.max(2,Math.round(nn/4)),o.closed):G.bspl(it.pts,Math.max(2,Math.round(nn/4)),o.closed),curve=curveN(n),fill=o.closed&&mode!=='o';
  if(!fill){poly(curve,straight&&o.closed,st,O);return O}
  const ring=it.t==='P'?it.pts:dropLast(curve);if(mode!=='f')poly(curve,straight,os,O);
  if(ring.length>=3){if(o.fm==='r')repeat(own&&it.t!=='P'?dropLast(curveN(rsn)):ring);else{const hs=o.auto?fs.w*(o.af||.9):o.hs||6,pol=[ring],passes=[o.ha||0];if(o.hx)passes.push((o.ha||0)+90);passes.forEach(an=>hatchPoly(pol,an,hs,o.hi||0).forEach(([p,q])=>{const m=mk(p,q,fs);if(m)F.push(m)}))}}
  return join()}
 case'R':case'E':{const c=it.cc,u=it.u,v=it.v;
  const cs=[[-1,-1],[1,-1],[1,1],[-1,1]].map(([x,y])=>[c[0]+u[0]*x+v[0]*y,c[1]+u[1]*x+v[1]*y]);
  const rpOf=nn=>{let RP=null;if(it.t==='R'&&o.rr>0){const a_=Math.hypot(u[0],u[1]),b_=Math.hypot(v[0],v[1]);if(a_>.1&&b_>.1){const r=Math.min(o.rr,a_,b_),k=Math.max(1,Math.min(Math.round(nn/4),Math.ceil(r/2))),ux_=[u[0]/a_,u[1]/a_],vy_=[v[0]/b_,v[1]/b_];RP=[];
   [[1,1,0],[-1,1,1],[-1,-1,2],[1,-1,3]].forEach(([sx,sy,q])=>{const cx=sx*(a_-r),cy=sy*(b_-r);for(let j=0;j<=k;j++){const t=(q*90+90*j/k)*Math.PI/180,px=cx+r*Math.cos(t),py=cy+r*Math.sin(t);RP.push([c[0]+ux_[0]*px+vy_[0]*py,c[1]+ux_[1]*px+vy_[1]*py])}});
   }}return RP},
   ellOf=nn=>{const q=[];for(let i=0;i<nn;i++){const t=i/nn*Math.PI*2;q.push([c[0]+u[0]*Math.cos(t)+v[0]*Math.sin(t),c[1]+u[1]*Math.cos(t)+v[1]*Math.sin(t)])}return q},RP=rpOf(n),
   W=(RP?RP:it.t==='E'?ellOf(n):cs),Wr=own&&it.t==='E'?ellOf(rsn):own&&RP?rpOf(rsn):W;
  if(mode!=='f'){let pts=W;if(it.t==='R'&&!RP){pts=[];cs.forEach((p,i)=>{const q=cs[(i+1)%4],d=Math.hypot(q[0]-p[0],q[1]-p[1]),k=o.rs>0?Math.max(1,Math.round(d/o.rs)):1;for(let j=0;j<k;j++)pts.push([p[0]+(q[0]-p[0])*j/k,p[1]+(q[1]-p[1])*j/k])})}poly(pts,1,os,O)}
  if(mode!=='o'){if(o.fm==='r')repeat(Wr);else{const a=Math.hypot(u[0],u[1]),b=Math.hypot(v[0],v[1]);if(a>.1&&b>.1){const ux=[u[0]/a,u[1]/a],vy=[v[0]/b,v[1]/b],hs=o.auto?fs.w*(o.af||.9):o.hs||6,inset=o.hi||0,passes=[o.ha||0];if(o.hx)passes.push((o.ha||0)+90);
   const toW=(p)=>[c[0]+ux[0]*p[0]+vy[0]*p[1],c[1]+ux[1]*p[0]+vy[1]*p[1]];
   passes.forEach(an=>{let L;if(it.t==='R'&&RP){const th=an*Math.PI/180,nx=-Math.sin(th),ny=Math.cos(th),ext=a*Math.abs(nx)+b*Math.abs(ny),loc=RP.map(p=>{const dx=p[0]-c[0],dy=p[1]-c[1];return[dx*ux[0]+dy*ux[1],dx*vy[0]+dy*vy[1]]});L=hatchPoly([loc],an,hs,inset,-ext+hs/2)}else if(it.t==='R')L=hatch(a,b,'R',an,hs,inset);else{ const th=an*Math.PI/180,nx=-Math.sin(th),ny=Math.cos(th),ext=Math.hypot(a*nx,b*ny),loc=[];for(let i=0;i<n;i++){const t=i/n*Math.PI*2;loc.push([a*Math.cos(t),b*Math.sin(t)])}L=hatchPoly([loc],an,hs,inset,-ext+hs/2)}
    L.forEach(([p,q])=>{const m=mk(toW(p),toW(q),fs);if(m)F.push(m)})})}}}
  return join()}
 case'I':{const m=it.m||A.id(),pal=it.pal,out=[];it.is.forEach(q=>{const p=pal[q[4]],k=mk(A.pt(m,[q[0],q[1]]),A.pt(m,[q[2],q[3]]),{c:p.c,w:p.w,al:it.al,fg:it.fg});if(k)out.push(k)});return out}
 case'T':{const base=Text.base(it),m=it.m||A.id(),tx=it.tx,f=Math.pow(10,tx.dp===undefined?2:tx.dp),rn=v=>Math.round(v*f)/f,out=[];
  base.segs.forEach(s=>{const a=A.pt(m,s.a),b=A.pt(m,s.b),k=mk(f===100?a:[rn(a[0]),rn(a[1])],f===100?b:[rn(b[0]),rn(b[1])],s.r==='o'?{c:tx.oc,w:s.w!==undefined?s.w:tx.ow,al:it.al,fg:it.fg}:{c:tx.fc||it.c,w:s.w!==undefined?s.w:tx.fw,al:it.al,fg:it.fg});if(k)out.push(k)});return out}
 }return O}
function applyShape(it,M){if(it.pts)it.pts=it.pts.map(p=>A.pt(M,p));if(it.cc){it.cc=A.pt(M,it.cc);it.u=A.lin(M,it.u);it.v=A.lin(M,it.v)}if(it.t==='T'||it.t==='I')it.m=A.mul(M,it.m||A.id())}
return{bez,catmull,bspl,qCubics,qcurve,qSplit,qNear,shapeSegs,applyShape,mk,hatchPoly,insetPoly,distField,isoLoops,convex,setDraft:v=>{DRAFT=v}}})();
