'use strict';
const Text=(()=>{
const RCM=new Map();
const DEF={sys:'f',text:'Texto',font:'Arial',size:64,lh:1.15,align:'center',fill:true,auto:true,af:.95,hs:4,fw:3,fa:45,fx:false,inset:0,min:2,out:true,ow:2,oc:'ffd54f',eps:.3,budget:0,top:'o',dp:0,rd:0,rn:3,ls:0,fc:'',fm:'a',pol:true,ca:38,lf:'std'};
function raster(tx){const ls=+tx.ls||0,key=[tx.text,tx.font,tx.size,tx.lh,tx.align,ls].join('|');let c=RCM.get(key);if(c){RCM.delete(key);RCM.set(key,c);return c}
 const lines=tx.text.split('\n'),fs=tx.size,pad=fs*.25,c0=document.createElement('canvas').getContext('2d');c0.font=`${fs}px "${tx.font}"`;
 const chs=lines.map(l=>[...l]),ws=lines.map((l,i)=>c0.measureText(l).width+Math.max(0,chs[i].length-1)*ls),W=Math.max(1,...ws)+pad*2,H=lines.length*fs*tx.lh+pad*2,K=Math.min(8,Math.max(1,3000/Math.max(W,H)));
 const cv=document.createElement('canvas');cv.width=Math.ceil(W*K);cv.height=Math.ceil(H*K);const g=cv.getContext('2d',{willReadFrequently:true});g.font=`${fs*K}px "${tx.font}"`;g.fillStyle='#000';g.textBaseline='alphabetic';
 lines.forEach((l,i)=>{const w=ws[i]*K,x=tx.align==='left'?pad*K:tx.align==='right'?cv.width-pad*K-w:(cv.width-w)/2;const y=pad*K+i*fs*tx.lh*K+fs*K*.82;if(!ls)g.fillText(l,x,y);else chs[i].forEach((ch,j)=>g.fillText(ch,x+g.measureText(chs[i].slice(0,j).join('')).width+j*ls*K,y))});
 const w=cv.width,h=cv.height,d=g.getImageData(0,0,w,h).data,A=new Uint8Array(w*h);for(let i=0;i<A.length;i++)A[i]=d[i*4+3];
 c={key,w,h,K,loops:contours(A,w,h)};RCM.set(key,c);if(RCM.size>8)RCM.delete(RCM.keys().next().value);return c}
function contoursM(A,w,h){const T=127.5,sa=[],sb=[],adj=new Map(),W1=w+1;
 const hid=(x,y)=>(y*W1+x)*2,vid=(x,y)=>(y*W1+x)*2+1,add=(a,b)=>{const i=sa.length;sa.push(a);sb.push(b);(adj.get(a)||adj.set(a,[]).get(a)).push(i);(adj.get(b)||adj.set(b,[]).get(b)).push(i)};
 for(let y=0;y<h-1;y++)for(let x=0;x<w-1;x++){const c=(A[y*w+x]>=T?8:0)|(A[y*w+x+1]>=T?4:0)|(A[(y+1)*w+x+1]>=T?2:0)|(A[(y+1)*w+x]>=T?1:0);if(c===0||c===15)continue;
  const Tp=hid(x,y),B=hid(x,y+1),L=vid(x,y),R=vid(x+1,y);
  switch(c){case 1:case 14:add(L,B);break;case 2:case 13:add(B,R);break;case 3:case 12:add(L,R);break;case 4:case 11:add(Tp,R);break;case 5:add(Tp,L);add(B,R);break;case 6:case 9:add(Tp,B);break;case 7:case 8:add(Tp,L);break;case 10:add(Tp,R);add(L,B);break}}
 const pt=id=>{const v=id&1,i=id>>1,x=i%W1,y=(i-x)/W1;if(!v){const a=A[y*w+x],b=A[y*w+x+1];return[x+(T-a)/(b-a),y]}const a=A[y*w+x],b=A[(y+1)*w+x];return[x,y+(T-a)/(b-a)]};
 const used=new Uint8Array(sa.length),loops=[];
 for(let s=0;s<sa.length;s++){if(used[s])continue;used[s]=1;const lp=[pt(sa[s])];let cur=sb[s];for(;;){lp.push(pt(cur));const l=adj.get(cur);let nx=-1;for(const q of l)if(!used[q]){nx=q;break}if(nx<0)break;used[nx]=1;cur=sa[nx]===cur?sb[nx]:sa[nx]}
  if(lp.length>3){const a=lp[0],b=lp[lp.length-1];if(Math.abs(a[0]-b[0])<1e-6&&Math.abs(a[1]-b[1])<1e-6)lp.pop();loops.push(lp)}}
 return loops}
function contours(A,w,h){const N=(w+1)*(h+1)*2;return N<=6e6?contoursT(A,w,h,N):contoursM(A,w,h)}
function contoursT(A,w,h,N){const T=127.5,sa=[],sb=[],s1=new Int32Array(N).fill(-1),s2=new Int32Array(N).fill(-1),W1=w+1;
 const hid=(x,y)=>(y*W1+x)*2,vid=(x,y)=>(y*W1+x)*2+1,add=(a,b)=>{const i=sa.length;sa.push(a);sb.push(b);if(s1[a]<0)s1[a]=i;else s2[a]=i;if(s1[b]<0)s1[b]=i;else s2[b]=i};
 for(let y=0;y<h-1;y++)for(let x=0;x<w-1;x++){const c=(A[y*w+x]>=T?8:0)|(A[y*w+x+1]>=T?4:0)|(A[(y+1)*w+x+1]>=T?2:0)|(A[(y+1)*w+x]>=T?1:0);if(c===0||c===15)continue;
  const Tp=hid(x,y),B=hid(x,y+1),L=vid(x,y),R=vid(x+1,y);
  switch(c){case 1:case 14:add(L,B);break;case 2:case 13:add(B,R);break;case 3:case 12:add(L,R);break;case 4:case 11:add(Tp,R);break;case 5:add(Tp,L);add(B,R);break;case 6:case 9:add(Tp,B);break;case 7:case 8:add(Tp,L);break;case 10:add(Tp,R);add(L,B);break}}
 const pt=id=>{const v=id&1,i=id>>1,x=i%W1,y=(i-x)/W1;if(!v){const a=A[y*w+x],b=A[y*w+x+1];return[x+(T-a)/(b-a),y]}const a=A[y*w+x],b=A[(y+1)*w+x];return[x,y+(T-a)/(b-a)]};
 const used=new Uint8Array(sa.length),loops=[];
 for(let s=0;s<sa.length;s++){if(used[s])continue;used[s]=1;const lp=[pt(sa[s])];let cur=sb[s];for(;;){lp.push(pt(cur));let nx=-1;const q1=s1[cur],q2=s2[cur];if(q1>=0&&!used[q1])nx=q1;else if(q2>=0&&!used[q2])nx=q2;if(nx<0)break;used[nx]=1;cur=sa[nx]===cur?sb[nx]:sa[nx]}
  if(lp.length>3){const a=lp[0],b=lp[lp.length-1];if(Math.abs(a[0]-b[0])<1e-6&&Math.abs(a[1]-b[1])<1e-6)lp.pop();loops.push(lp)}}
 return loops}
function rdp(p,e){const n=p.length;if(n<3)return p;const keep=new Uint8Array(n),e2=e*e;keep[0]=keep[n-1]=1;const st=[[0,n-1]];
 while(st.length){const[i,j]=st.pop();let m=0,k=-1;const a=p[i],b=p[j],ax=a[0],ay=a[1],dx=b[0]-ax,dy=b[1]-ay,L=dx*dx+dy*dy;
  for(let q=i+1;q<j;q++){const px=p[q][0]-ax,py=p[q][1]-ay;let d2;if(L===0)d2=px*px+py*py;else{let t=(px*dx+py*dy)/L;t=t<0?0:t>1?1:t;const ex=px-t*dx,ey=py-t*dy;d2=ex*ex+ey*ey}if(d2>m){m=d2;k=q}}
  if(m>e2&&k>0){keep[k]=1;st.push([i,k],[k,j])}}return p.filter((_,i)=>keep[i])}
function simpClosedRDP(p,e){if(p.length<5)return p;let k=0,m=0;for(let i=1;i<p.length;i++){const d=(p[i][0]-p[0][0])**2+(p[i][1]-p[0][1])**2;if(d>m){m=d;k=i}}
 return[...rdp(p.slice(0,k+1),e).slice(0,-1),...rdp([...p.slice(k),p[0]],e).slice(0,-1)]}
const dseg2=(p,a,b)=>{const ax=a[0],ay=a[1],dx=b[0]-ax,dy=b[1]-ay,L=dx*dx+dy*dy,px=p[0]-ax,py=p[1]-ay;if(!L)return px*px+py*py;let t=(px*dx+py*dy)/L;t=t<0?0:t>1?1:t;const ex=px-t*dx,ey=py-t*dy;return ex*ex+ey*ey},dseg=(p,a,b)=>Math.sqrt(dseg2(p,a,b));
function minLink(q,E){const m=q.length,E2=E*E,dp=new Int32Array(m).fill(1e9),fr=new Int32Array(m).fill(-1);dp[0]=0;
 for(let j=1;j<m;j++){for(let i=j-1;i>=0;i--){if(dp[i]>=1e9||dp[i]+1>dp[j])continue;let ok=true;for(let k=i+1;k<j;k++)if(dseg2(q[k],q[i],q[j])>E2){ok=false;break}
   if(ok&&(dp[i]+1<dp[j]||i<fr[j])){dp[j]=dp[i]+1;fr[j]=i}}
  if(fr[j]<0){dp[j]=dp[j-1]+1;fr[j]=j-1}}
 const o=[];for(let j=m-1;j>=0;j=fr[j]){o.push(q[j]);if(j===0)break}return o.reverse()}

function momentsOf(q){const m=q.length,P=new Float64Array((m+1)*5);for(let i=0;i<m;i++){const x=q[i][0],y=q[i][1],o=i*5,n=o+5;P[n]=P[o]+x;P[n+1]=P[o+1]+y;P[n+2]=P[o+2]+x*x;P[n+3]=P[o+3]+x*y;P[n+4]=P[o+4]+y*y}return P}
function lineFit(P,i,j,q){ const n=j-i+1,a=i*5,b=(j+1)*5,sx=P[b]-P[a],sy=P[b+1]-P[a+1],mx=sx/n,my=sy/n,sxx=(P[b+2]-P[a+2])/n-mx*mx,sxy=(P[b+3]-P[a+3])/n-mx*my,syy=(P[b+4]-P[a+4])/n-my*my;
 let th=.5*Math.atan2(2*sxy,sxx-syy),dx=Math.cos(th),dy=Math.sin(th);const e=q[j],f=q[i];if((e[0]-f[0])*dx+(e[1]-f[1])*dy<0){dx=-dx;dy=-dy}return{x:mx,y:my,dx,dy}}
const dLine=(L,p)=>Math.abs((p[0]-L.x)*L.dy-(p[1]-L.y)*L.dx);
function minLinkFree(q,E,closed){const m=q.length,P=momentsOf(q),dp=new Int32Array(m).fill(1e9),fr=new Int32Array(m).fill(-1);dp[0]=0;
 for(let j=1;j<m;j++){for(let i=j-1;i>=0;i--){if(dp[i]>=1e9||dp[i]+1>dp[j])continue;let ok=true;if(j-i>1){const L=lineFit(P,i,j,q);for(let k=i;k<=j;k++)if(dLine(L,q[k])>E){ok=false;break}}
   if(ok&&(dp[i]+1<dp[j]||i<fr[j])){dp[j]=dp[i]+1;fr[j]=i}}
  if(fr[j]<0){dp[j]=dp[j-1]+1;fr[j]=j-1}}
 const idx=[];for(let j=m-1;j>=0;j=fr[j]){idx.push(j);if(j===0)break}idx.reverse();
 const Ls=[];for(let s=0;s<idx.length-1;s++)Ls.push(idx[s+1]-idx[s]>1?lineFit(P,idx[s],idx[s+1],q):null);
 const V=[],nL=Ls.length,proj=(L,p)=>{const t=(p[0]-L.x)*L.dx+(p[1]-L.y)*L.dy;return[L.x+L.dx*t,L.y+L.dy*t]};
 const meet=(A,B,p)=>{if(!A&&!B)return p;if(!A)return proj(B,p);if(!B)return proj(A,p);const cr=A.dx*B.dy-A.dy*B.dx;if(Math.abs(cr)<.12)return[(proj(A,p)[0]+proj(B,p)[0])/2,(proj(A,p)[1]+proj(B,p)[1])/2];
  const t=((B.x-A.x)*B.dy-(B.y-A.y)*B.dx)/cr,r=[A.x+A.dx*t,A.y+A.dy*t];return Math.hypot(r[0]-p[0],r[1]-p[1])>2.2*E?[(proj(A,p)[0]+proj(B,p)[0])/2,(proj(A,p)[1]+proj(B,p)[1])/2]:r};
 for(let s=0;s<idx.length;s++){const p=q[idx[s]];if(s===0)V.push(closed?meet(Ls[nL-1],Ls[0],p):(Ls[0]?proj(Ls[0],p):p));else if(s===idx.length-1)V.push(closed?V[0]:(Ls[nL-1]?proj(Ls[nL-1],p):p));else V.push(meet(Ls[s-1],Ls[s],p))}
 return{V,idx}}
function polyErr(q,V,closed){let mx=0;const n=V.length,segN=closed?n:n-1;for(const p of q){let b=1e9;for(let i=0;i<segN;i++){const d=dseg2(p,V[i],V[(i+1)%n]);if(d<b)b=d;if(b<mx)break}if(b>mx)mx=b}return Math.sqrt(mx)}
function minLinkRef(q,E,closed){if(q.length<4)return null;const r=minLinkFree(q,E,closed);let V=r.V;if(closed)V=V.slice(0,-1);
 const T2=E*1.2*E*1.2;for(let s=0;s<V.length;s++){let b=1e9;for(let i=0;i<q.length-1;i++){const d=dseg2(V[s],q[i],q[i+1]);if(d<b)b=d;if(b<=T2)break}if(b>T2)V[s]=q[r.idx[s]]}if(V.length<(closed?3:2))return null;
 if(polyErr(q,V,closed)>E*1.04)return null;return V}

const vA=(a,b)=>[a[0]+b[0],a[1]+b[1]],vS=(a,b)=>[a[0]-b[0],a[1]-b[1]],vM=(a,k)=>[a[0]*k,a[1]*k],vD=(a,b)=>a[0]*b[0]+a[1]*b[1],vL=a=>Math.hypot(a[0],a[1]),vN=a=>{const l=Math.hypot(a[0],a[1])||1;return[a[0]/l,a[1]/l]};
function resampleP(p,h,closed){const n=p.length,N=closed?n:n-1,L=[0];for(let i=0;i<N;i++){const a=p[i],b=p[(i+1)%n];L.push(L[i]+Math.hypot(b[0]-a[0],b[1]-a[1]))}
 const T=L[N];if(T<1e-9)return p.slice();const M=Math.max(closed?8:2,Math.round(T/h)),o=[];let k=0;for(let m=0;m<(closed?M:M+1);m++){const t=T*m/M;while(k<N-1&&L[k+1]<t)k++;const a=p[k],b=p[(k+1)%n],s=(L[k+1]-L[k])||1,u=Math.min(1,Math.max(0,(t-L[k])/s));o.push([a[0]+(b[0]-a[0])*u,a[1]+(b[1]-a[1])*u])}return o}
const bzAt=(b,t)=>{const u=1-t,a=u*u*u,c=3*u*u*t,d=3*u*t*t,e=t*t*t;return[a*b[0][0]+c*b[1][0]+d*b[2][0]+e*b[3][0],a*b[0][1]+c*b[1][1]+d*b[2][1]+e*b[3][1]]};
const bz1=(b,t)=>{const u=1-t,a=3*u*u,c=6*u*t,d=3*t*t;return[a*(b[1][0]-b[0][0])+c*(b[2][0]-b[1][0])+d*(b[3][0]-b[2][0]),a*(b[1][1]-b[0][1])+c*(b[2][1]-b[1][1])+d*(b[3][1]-b[2][1])]};
const bz2=(b,t)=>{const u=1-t,a=6*u,c=6*t;return[a*(b[2][0]-2*b[1][0]+b[0][0])+c*(b[3][0]-2*b[2][0]+b[1][0]),a*(b[2][1]-2*b[1][1]+b[0][1])+c*(b[3][1]-2*b[2][1]+b[1][1])]};
function chordU(P){const u=[0];for(let i=1;i<P.length;i++)u.push(u[i-1]+vL(vS(P[i],P[i-1])));const T=u[u.length-1]||1;return u.map(x=>x/T)}
function genBez(P,u,t1,t2){const n=P.length,p0=P[0],p3=P[n-1];let c00=0,c01=0,c11=0,x0=0,x1=0;
 for(let i=0;i<n;i++){const t=u[i],m=1-t,b0=m*m*m,b1=3*m*m*t,b2=3*m*t*t,b3=t*t*t,a1=vM(t1,b1),a2=vM(t2,b2),tmp=vS(P[i],vA(vM(p0,b0+b1),vM(p3,b2+b3)));c00+=vD(a1,a1);c01+=vD(a1,a2);c11+=vD(a2,a2);x0+=vD(a1,tmp);x1+=vD(a2,tmp)}
 const det=c00*c11-c01*c01,seg=vL(vS(p3,p0));let al=0,ar=0;if(Math.abs(det)>1e-12){al=(x0*c11-x1*c01)/det;ar=(c00*x1-c01*x0)/det}
 if(al<1e-6*seg||ar<1e-6*seg){al=ar=seg/3}
 return[p0,vA(p0,vM(t1,al)),vA(p3,vM(t2,ar)),p3]}
function bezErr(P,b,u){let m=0,k=Math.floor(P.length/2);for(let i=1;i<P.length-1;i++){const q=bzAt(b,u[i]),dx=q[0]-P[i][0],dy=q[1]-P[i][1],d=dx*dx+dy*dy;if(d>=m){m=d;k=i}}return[m,k]}
function reparamU(P,b,u){return u.map((t,i)=>{const q=bzAt(b,t),d1=bz1(b,t),d2=bz2(b,t),df=vS(q,P[i]),nu=vD(df,d1),de=vD(d1,d1)+vD(df,d2);if(Math.abs(de)<1e-12)return t;const r=t-nu/de;return r<0?0:r>1?1:r})}
function fitCurve(P,t1,t2,err2,out){const n=P.length;if(n<2)return;if(n===2){const d=vL(vS(P[1],P[0]))/3;out.push([P[0],vA(P[0],vM(t1,d)),vA(P[1],vM(t2,d)),P[1]]);return}
 let u=chordU(P),b=genBez(P,u,t1,t2),[e,sp]=bezErr(P,b,u);if(e<err2){out.push(b);return}
 if(e<err2*16)for(let it=0;it<6;it++){u=reparamU(P,b,u);b=genBez(P,u,t1,t2);[e,sp]=bezErr(P,b,u);if(e<err2){out.push(b);return}}
 sp=Math.max(1,Math.min(n-2,sp));const tc=vN(vS(P[sp-1],P[sp+1]));fitCurve(P.slice(0,sp+1),t1,tc,err2,out);fitCurve(P.slice(sp),vM(tc,-1),t2,err2,out)}
function flatBez(b,tol,out){const t2=tol*tol;let n=1;
 for(;n<80;n++){let ok=true;for(let k=1;k<=n&&ok;k++){const t0=(k-1)/n,t1=k/n,a=bzAt(b,t0),c=bzAt(b,t1);for(const f of[.25,.5,.75]){const p=bzAt(b,t0+(t1-t0)*f);if(dseg2(p,a,c)>t2){ok=false;break}}}if(ok)break}
 for(let k=1;k<=n;k++)out.push(k===n?b[3]:bzAt(b,k/n))}
function cornerIdx(q,m,thr){const M=q.length,ang=new Float32Array(M);for(let i=0;i<M;i++){const a=q[(i-m+M)%M],b=q[i],c=q[(i+m)%M],x1=b[0]-a[0],y1=b[1]-a[1],x2=c[0]-b[0],y2=c[1]-b[1];ang[i]=Math.abs(Math.atan2(x1*y2-y1*x2,x1*x2+y1*y2))}
 const cs=[];for(let i=0;i<M;i++){if(ang[i]<=thr)continue;let ok=true;for(let j=1;j<=m;j++){if(ang[(i+j)%M]>ang[i]||ang[(i-j+M)%M]>=ang[i]){ok=false;break}}if(ok)cs.push(i)}return cs}
function polishLoop(l,E,K,ca){if(l.length<10)return null;const h=Math.max(1,K*.12),q=resampleP(l,h,true),M=q.length;if(M<12)return null;
 const m=Math.max(2,Math.min(Math.floor(M/6),Math.round(.7*K/h))),thr=(ca||38)*Math.PI/180,cs=cornerIdx(q,m,thr),e2=Math.pow(E*.4,2),tol=E*.06,w=Math.max(2,Math.min(m,6));
 const tanAt=(i,sgn)=>{let a=0,b=0;for(let j=1;j<=w;j++){a+=q[(i+sgn*j+M*2)%M][0]-q[i][0];b+=q[(i+sgn*j+M*2)%M][1]-q[i][1]}return vN([a,b])};
 const shift=(pts,closed)=>{const n=pts.length,o=pts.map(p=>p.slice());for(let i=closed?0:1;i<(closed?n:n-1);i++){const a=pts[(i+n-1)%n],b=pts[(i+1)%n],v=pts[i],mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2;o[i]=[v[0]+(v[0]-mx)/8,v[1]+(v[1]-my)/8]}return o};
 const flatRun=bs=>{const pts=[bs[0][0]];bs.forEach(b=>flatBez(b,tol,pts));return pts};
 const out=[];
 if(!cs.length){const t=vN(vS(q[1%M],q[(M-1)%M])),bs=[];fitCurve(q.concat([q[0]]),t,vM(t,-1),e2,bs);const pts=flatRun(bs);pts.pop();return pts}
 for(let k=0;k<cs.length;k++){const a=cs[k];let b=cs[(k+1)%cs.length];if(b<=a)b+=M;const P=[];for(let i=a;i<=b;i++)P.push(q[i%M]);if(P.length<2)continue;
  const bs=[];fitCurve(P,tanAt(a%M,1),tanAt(b%M,-1),e2,bs);const pts=flatRun(bs);pts.pop();pts.forEach(p=>out.push(p))}
 return out.length>=3?out:null}
function simpOpen(p,e){if(p.length<3)return p;const q=rdp(p,e*.12);if(q.length<3||q.length>700)return rdp(p,e);const A=minLink(q,e*.88),B=minLinkRef(q,e*.88,false);return B&&B.length<A.length?B:A}
function simpClosed(p,e){if(p.length<5)return p;const q=simpClosedRDP(p,e*.12);const n=q.length;if(n<4||n>700)return simpClosedRDP(p,e);
 let k=0,bt=-1;for(let i=0;i<n;i++){const a=q[(i+n-1)%n],b=q[i],c=q[(i+1)%n],t=Math.abs(Math.atan2((b[0]-a[0])*(c[1]-b[1])-(b[1]-a[1])*(c[0]-b[0]),(b[0]-a[0])*(c[0]-b[0])+(b[1]-a[1])*(c[1]-b[1])));if(t>bt){bt=t;k=i}}
 const s=[...q.slice(k),...q.slice(0,k),q[k]],r=minLink(s,e*.88);r.pop();const B=minLinkRef(s,e*.88,true);if(B&&B.length>=3&&B.length<r.length)return B;return r.length>=3?r:q}
function hatchPolys(polys,ang,hs,inset,minrun,out){const th=ang*Math.PI/180,c=Math.cos(th),s=Math.sin(th),R=polys.map(p=>p.map(q=>[q[0]*c+q[1]*s,-q[0]*s+q[1]*c])),edges=[];let y0=1e9,y1=-1e9;
 R.forEach(p=>{for(let i=0;i<p.length;i++){const a=p[i],b=p[(i+1)%p.length];y0=Math.min(y0,a[1]);y1=Math.max(y1,a[1]);if(a[1]===b[1])continue;edges.push(a[1]<b[1]?[a[0],a[1],b[0],b[1]]:[b[0],b[1],a[0],a[1]])}});
 let k=0;for(let y=y0+hs/2+1e-3;y<y1;y+=hs,k++){const xs=[];for(const e of edges)if(e[1]<=y&&y<e[3])xs.push(e[0]+(y-e[1])*(e[2]-e[0])/(e[3]-e[1]));xs.sort((a,b)=>a-b);
  for(let i=0;i+1<xs.length;i+=2){let xa=xs[i]+inset,xb=xs[i+1]-inset;if(xb-xa<minrun)continue;if(k&1)[xa,xb]=[xb,xa];out.push({a:[xa*c-y*s,xa*s+y*c],b:[xb*c-y*s,xb*s+y*c],r:'f'})}}}


const areaAbs=p=>{let a=0;for(let i=0;i<p.length;i++){const q=p[i],r=p[(i+1)%p.length];a+=q[0]*r[1]-r[0]*q[1]}return Math.abs(a)/2};
const inPoly=(pt,p)=>{let c=false;for(let i=0,j=p.length-1;i<p.length;j=i++){const a=p[i],b=p[j];if((a[1]>pt[1])!==(b[1]>pt[1])&&pt[0]<(b[0]-a[0])*(pt[1]-a[1])/(b[1]-a[1])+a[0])c=!c}return c};
function blobs(polys){const n=polys.length,A=polys.map(areaAbs),par=new Array(n).fill(-1),dep=new Array(n).fill(0);
 for(let i=0;i<n;i++){let best=-1;for(let j=0;j<n;j++){if(i===j||A[j]<=A[i])continue;if(inPoly(polys[i][0],polys[j])){dep[i]++;if(best<0||A[j]<A[best])best=j}}par[i]=best}
 const g=new Map(),root=i=>{while(dep[i]%2===1&&par[i]>=0)i=par[i];return i};
 for(let i=0;i<n;i++){const r=root(i);(g.get(r)||g.set(r,[]).get(r)).push(polys[i])}return[...g.values()]}
function midline(lp){const n=lp.length;if(n<4)return null;let a=0,b=0,bd=-1;for(let i=0;i<n;i++){const d=Math.hypot(lp[i][0]-lp[0][0],lp[i][1]-lp[0][1]);if(d>bd){bd=d;a=i}}bd=-1;for(let i=0;i<n;i++){const d=Math.hypot(lp[i][0]-lp[a][0],lp[i][1]-lp[a][1]);if(d>bd){bd=d;b=i}}
 if(a>b)[a,b]=[b,a];const C1=lp.slice(a,b+1),C2=[...lp.slice(b),...lp.slice(0,a+1)].reverse();
 const res=(c,M)=>{const L=[0];for(let i=1;i<c.length;i++)L.push(L[i-1]+Math.hypot(c[i][0]-c[i-1][0],c[i][1]-c[i-1][1]));const T=L[L.length-1]||1,o=[];let k=0;for(let m=0;m<=M;m++){const t=T*m/M;while(k<c.length-2&&L[k+1]<t)k++;const s=(L[k+1]-L[k])||1,u=Math.min(1,Math.max(0,(t-L[k])/s));o.push([c[k][0]+(c[k+1][0]-c[k][0])*u,c[k][1]+(c[k+1][1]-c[k][1])*u])}return o};
 const M=Math.max(6,Math.min(80,Math.round(Math.max(C1.length,C2.length)))),r1=res(C1,M),r2=res(C2,M),mid=r1.map((p,i)=>[(p[0]+r2[i][0])/2,(p[1]+r2[i][1])/2]);return simpOpen(mid,.25)}
function ringFill(group,w,step,ow,out){const DF=G.distField(group);if(!DF)return null;let thr=w*.6;const segs=[],ring=lp=>{for(let i=0;i<lp.length;i++)segs.push({a:lp[i],b:lp[(i+1)%lp.length],r:'f'})},
 thin=lp=>{const P=lp.reduce((s,q,i)=>s+Math.hypot(q[0]-lp[(i+1)%lp.length][0],q[1]-lp[(i+1)%lp.length][1]),0);return P>0&&2*areaAbs(lp)/P<thr},
 emit=lp=>{if(thin(lp)){const m=midline(lp);if(m&&m.length>1){for(let i=0;i<m.length-1;i++)segs.push({a:m[i],b:m[i+1],r:'f'});return}}ring(lp)};
 let d=out?(ow+w)/2*.96:w*.49,last=-1;for(let k=0;k<400;k++){const L=G.isoLoops(DF,d);if(!L.length)break;L.forEach(emit);last=d;d+=step}
 thr=w*.98;const cover=(last<0?(out?ow/2:0):last)+(last<0?0:w/2);DF.win=[0,DF.w-2,0,DF.h-2];const core=G.isoLoops(DF,cover+.05);core.forEach(lp=>{if(thin(lp)||last<0)emit(lp);else ring(lp)});
 try{const c=document.createElement('canvas');c.width=DF.w;c.height=DF.h;const g=c.getContext('2d',{willReadFrequently:true}),X=q=>(q[0]-DF.x0)*DF.sc+4,Y=q=>(q[1]-DF.y0)*DF.sc+4;g.lineCap='round';g.lineJoin='round';g.strokeStyle='#000';
  if(out){g.lineWidth=ow*DF.sc;g.beginPath();group.forEach(p=>{p.forEach((q,i)=>i?g.lineTo(X(q),Y(q)):g.moveTo(X(q),Y(q)));g.closePath()});g.stroke()}
  g.lineWidth=w*DF.sc;g.beginPath();segs.forEach(s=>{g.moveTo(X(s.a),Y(s.a));g.lineTo(X(s.b),Y(s.b))});g.stroke();
  const got=g.getImageData(0,0,DF.w,DF.h).data;let tot=0,miss=0;for(let i=0;i<DF.w*DF.h;i++){if(DF.F[i]>1.1){tot++;if(got[i*4+3]<100)miss++}}if(tot&&miss/tot>.09)return null}catch(e){}
 return segs}

const GA={'\u2019':"'",'\u2018':"'",'\u201C':'"','\u201D':'"','\u2013':'-','\u2014':'-'};
const MK={'\u0301':'-0.6,1.2 0.8,0','\u0300':'-0.7,0 0.6,1.2','\u0302':'-1,1.2 0,0 1,1.2','\u0303':'-1.2,1 -0.4,0.1 0.4,1 1.2,0.1','\u0308':'-0.8,0.6|0.8,0.6','\u030A':'-0.6,0 0.6,0 0.6,1.2 -0.6,1.2 z','\u030C':'-1,0 0,1.2 1,0','\u0304':'-1,0.6 1,0.6','\u0327':'0,6 0.2,7 -0.7,7.8','\u0307':'0,0.5','\u0328':'0.8,6 0.4,7 1.1,7.6','\u030B':'-1,1.2 0.1,0|0.3,1.2 1.4,0','\u0306':'-1,0 -0.5,0.9 0.5,0.9 1,0'};
const GC={};
function tidy(paths){const eq=(a,b)=>Math.abs(a[0]-b[0])<1e-6&&Math.abs(a[1]-b[1])<1e-6;
 paths.forEach(p=>{if(p.pts.length<3)return;const o=[p.pts[0]];for(let i=1;i<p.pts.length;i++){const q=p.pts[i];if(eq(q,o[o.length-1]))continue;if(o.length>1){const a=o[o.length-2],b=o[o.length-1];if(Math.abs((b[0]-a[0])*(q[1]-b[1])-(b[1]-a[1])*(q[0]-b[0]))<1e-9&&((b[0]-a[0])*(q[0]-b[0])+(b[1]-a[1])*(q[1]-b[1]))>0)o.pop()}o.push(q)}p.pts=o});
 for(let i=0;i<paths.length;i++)for(let j=i+1;j<paths.length;j++){const A=paths[i],B=paths[j];if(A.z||B.z||A.sm||B.sm||A.pts.length<2||B.pts.length<2)continue;const a0=A.pts[0],a1=A.pts[A.pts.length-1],b0=B.pts[0],b1=B.pts[B.pts.length-1];
  if(eq(a1,b0)){A.pts=A.pts.concat(B.pts.slice(1))}else if(eq(a1,b1)){A.pts=A.pts.concat(B.pts.slice(0,-1).reverse())}else if(eq(a0,b1)){A.pts=B.pts.concat(A.pts.slice(1))}else continue;paths.splice(j,1);j=i}return paths}
function parseG(s){const k=s.indexOf(';'),w=parseFloat(s.slice(0,k)),paths=tidy(s.slice(k+1).split('|').filter(Boolean).map(p=>{p=p.trim();const sm=p[0]==='~';if(sm)p=p.slice(1);const t=p.trim().split(/\s+/).filter(Boolean),z=t[t.length-1]==='z';if(z)t.pop();return{z,sm,pts:t.map(q=>q.split(',').map(Number))}}));return{w,paths}}
const upCh=c=>c!==c.toLowerCase()&&c===c.toUpperCase();
function glyph(ch,fid){const F=LF.get(fid),key=fid+'\u0001'+ch,hit=GC[key];if(hit!==undefined)return hit;const a=GA[ch]||ch,look=m=>m[a]||(F.up&&m[a.toUpperCase()])||null;let d=look(F.g)||look(LF.STD),g;
 if(d)g=parseG(d);else{const nf=a.normalize('NFD'),base=nf[0],marks=nf.slice(1);let bs=(F.up&&(F.g[base.toUpperCase()]||null))||F.g[base]||LF.STD[base];if(bs&&marks&&[...marks].every(m=>MK[m])){if(base==='i'&&(F.g['\u0131']||LF.STD['\u0131']))bs=F.g['\u0131']||LF.STD['\u0131'];const b=parseG(bs),up=F.up||upCh(base),cx=b.w/2,paths=b.paths.slice();
   for(const m of marks){for(const p of MK[m].split('|')){const t=p.trim().split(/\s+/),z=t[t.length-1]==='z';if(z)t.pop();const below=m==='\u0327'||m==='\u0328',dy=below?0:up?-2.4:.2;paths.push({z,pts:t.map(q=>{const v=q.split(',').map(Number);return[v[0]+cx,v[1]+dy]})})}}g={w:b.w,paths}}else g=null}
 return GC[key]=g}
function smoothPts(q,z,rn){const n=q.length;if(n<3)return q.slice();const P=i=>z?q[((i%n)+n)%n]:q[Math.max(0,Math.min(n-1,i))],N=z?n:n-1,out=[q[0]];
 for(let i=0;i<N;i++){const p0=P(i-1),p1=P(i),p2=P(i+1),p3=P(i+2),c1=[p1[0]+(p2[0]-p0[0])/6,p1[1]+(p2[1]-p0[1])/6],c2=[p2[0]-(p3[0]-p1[0])/6,p2[1]-(p3[1]-p1[1])/6],
  a1=Math.atan2(c1[1]-p1[1],c1[0]-p1[0]),a2=Math.atan2(p2[1]-c2[1],p2[0]-c2[0]),ch=Math.atan2(p2[1]-p1[1],p2[0]-p1[0]),df=(x,y)=>{let d=Math.abs(x-y)%(2*Math.PI);return d>Math.PI?2*Math.PI-d:d},
  turn=Math.max(df(a1,ch)+df(ch,a2),df(a1,a2)),segs=Math.max(1,Math.ceil(turn/((Math.PI/2)/rn)-.05));
  for(let k=1;k<=segs;k++){const t=k/segs,u=1-t,A=u*u*u,B=3*u*u*t,C=3*u*t*t,D=t*t*t;out.push([A*p1[0]+B*c1[0]+C*c2[0]+D*p2[0],A*p1[1]+B*c1[1]+C*c2[1]+D*p2[1]])}}
 if(z)out.pop();return out}
function roundPts(p,closed,rd,rn){const n=p.length;if(rd<=0||n<3)return p;const k=rd/100,out=[];
 for(let i=0;i<n;i++){const v=p[i];if(!closed&&(i===0||i===n-1)){out.push(v);continue}const a=p[(i+n-1)%n],b=p[(i+1)%n],d1=Math.hypot(a[0]-v[0],a[1]-v[1]),d2=Math.hypot(b[0]-v[0],b[1]-v[1]);
  if(d1<1e-6||d2<1e-6){out.push(v);continue}const ux=(a[0]-v[0])/d1,uy=(a[1]-v[1])/d1,wx=(b[0]-v[0])/d2,wy=(b[1]-v[1])/d2,dot=ux*wx+uy*wy;if(dot<-.9995){out.push(v);continue}
  const al=Math.acos(Math.max(-1,Math.min(1,dot)))*180/Math.PI,ac=Math.max(0,Math.min(1,(108-al)/68)),kk=2/3+ac*2/3,r=k*Math.min(d1,d2)/2,P0=[v[0]+ux*r,v[1]+uy*r],P2=[v[0]+wx*r,v[1]+wy*r],
   B1=[P0[0]+(v[0]-P0[0])*kk,P0[1]+(v[1]-P0[1])*kk],B2=[P2[0]+(v[0]-P2[0])*kk,P2[1]+(v[1]-P2[1])*kk];
  for(let j=0;j<=rn;j++){const t=j/rn,u=1-t,c0=u*u*u,c1=3*u*u*t,c2=3*u*t*t,c3=t*t*t;out.push([c0*P0[0]+c1*B1[0]+c2*B2[0]+c3*P2[0],c0*P0[1]+c1*B1[1]+c2*B2[1]+c3*P2[1]])}}
 return out}
function strokeGeo(tx){const F=LF.get(tx.lf),fid=tx.lf||'std',u=tx.size*.72/6,gap=F.gap,fw=Math.max(1,tx.fw),rn=Math.max(1,Math.round(tx.rn||1)),rd=Math.min(100,Math.max(0,tx.rd||0)),lines=String(tx.text).split('\n'),pitch=tx.size*tx.lh,H=lines.length*pitch,capH=6*u,sl=F.slant||0;
 const rows=lines.map(l=>{const gs=[...l].map(ch=>({ch,g:glyph(ch,fid)||glyph(' ',fid)})),adv=gs.map(o=>(o.g.w+gap)*u+tx.ls),w=Math.max(0,adv.reduce((a,b)=>a+b,0)-(gap*u+tx.ls)*(gs.length?1:0));return{gs,adv,w}});
 const MW=Math.max(1,...rows.map(r=>r.w)),front=[],dot=Math.max(.15*u,1),ow=tx.out?Math.max(1,tx.ow):0,rnd=k=>{const v=Math.sin(k*12.9898+78.233)*43758.5453;return v-Math.floor(v)};
 rows.forEach((r,li)=>{let x=tx.align==='left'?-MW/2:tx.align==='right'?MW/2-r.w:-r.w/2;const y0=li*pitch+(pitch-capH)/2-H/2;
  r.gs.forEach((o,gi)=>{let ja=0,js=1,jx=0,jy=0;if(F.jit){const k=li*977+gi*31+o.ch.charCodeAt(0);ja=(rnd(k)-.5)*.1;js=1+(rnd(k+1)-.5)*.08;jx=(rnd(k+2)-.5)*.3;jy=(rnd(k+3)-.5)*.4}
   const cx=o.g.w/2,cs=Math.cos(ja),sn=Math.sin(ja),T=v=>{const X=(v[0]-cx)*js,Y=(v[1]-4)*js,x2=X*cs-Y*sn+cx+jx,y2=X*sn+Y*cs+4+jy;return[x2+(6-y2)*sl,y2]};
   o.g.paths.forEach(p=>{let q=p.pts;if(q.length===1){const t=T(q[0]),X=x+t[0]*u,Y=y0+t[1]*u;front.push({a:[X,Y],b:[X,Y+dot]});return}
    q=p.sm?smoothPts(q,p.z,rn):roundPts(q,p.z,rd,rn);const P=q.map(v=>{const t=T(v);return[x+t[0]*u,y0+t[1]*u]});for(let i=0;i<P.length-1;i++)front.push({a:P[i],b:P[i+1]});if(p.z&&P.length>2)front.push({a:P[P.length-1],b:P[0]})});x+=r.adv[gi]})});
 const segs=[];if(ow)front.forEach(s=>segs.push({a:s.a,b:s.b,r:'o',w:fw+ow}));front.forEach(s=>segs.push({a:s.a,b:s.b,r:'f',w:fw}));
 return{segs,eps:0,sp:fw,n:segs.length}}
function fontGeo(tx){const r=raster(tx);let eps=Math.max(tx.eps,tx.dp===0?.42:tx.dp===1?.1:0),af=tx.af,hs=tx.hs,res;
 for(let it=0;it<14;it++){const E=Math.max(.02,eps)*r.K,pol=tx.pol!==false,polys=r.loops.map(l=>(()=>{const d=pol?polishLoop(l,E,r.K,tx.ca):null;return simpClosed(d||l,E)})()).filter(p=>p.length>=3&&areaAbs(p)>.12*r.K*r.K).map(p=>p.map(q=>[(q[0]-r.w/2)/r.K,(q[1]-r.h/2)/r.K])),O=[],F=[];
  if(tx.out)polys.forEach(p=>{for(let i=0;i<p.length;i++)O.push({a:p[i],b:p[(i+1)%p.length],r:'o'})});
  if(tx.fill){const sp=tx.auto?Math.max(.3,tx.fw*af):Math.max(.3,hs),solid=tx.auto&&af<=1.05&&!tx.fx,fm=tx.fm||'a',hatchOf=g=>{const o=[];hatchPolys(g,tx.fa,sp,tx.inset,tx.min,o);if(tx.fx)hatchPolys(g,tx.fa+90,sp,tx.inset,tx.min,o);return o};
   if(fm==='h'||!solid)F.push(...hatchOf(polys));
   else blobs(polys).forEach(g=>{const H=fm==='r'?null:hatchOf(g);if(H&&H.length<=6){F.push(...H);return}const R=ringFill(g,tx.fw,sp,tx.out?tx.ow:0,tx.out);F.push(...(R&&(!H||R.length<H.length*.9)?R:H||hatchOf(g)))})}
  const segs=tx.top==='f'?O.concat(F):F.concat(O);
  res={segs,eps,sp:tx.auto?tx.fw*af:hs,n:segs.length};if(!tx.budget||segs.length<=tx.budget)break;eps*=1.3;af*=1.1;hs*=1.1}
 return res}
function geometry(tx){tx={...DEF,...tx};return tx.sys==='l'?strokeGeo(tx):fontGeo(tx)}
const BC=new WeakMap();
function base(it){const key=JSON.stringify(it.tx),c=BC.get(it);if(c&&c.key===key)return c.res;const res=geometry(it.tx);BC.set(it,{key,res});return res}
return{DEF,polishLoop,geometry,base,contours,rdp,simpClosed,simpOpen,hatchPolys,midline,ringFill,blobs}})();
