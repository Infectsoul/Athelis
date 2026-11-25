'use strict';
const SL=(()=>{
const TAU=Math.PI*2,cl=(v,a,b)=>v<a?a:v>b?b:v,rad=d=>d*Math.PI/180,lerp=(a,b,t)=>a+(b-a)*t;
function bez3(p0,p1,p2,p3,tol,out){ const rec=(a,b,c,d,dep)=>{const dx=d[0]-a[0],dy=d[1]-a[1],L=Math.hypot(dx,dy)||1e-9,d1=Math.abs((b[0]-a[0])*dy-(b[1]-a[1])*dx)/L,d2=Math.abs((c[0]-a[0])*dy-(c[1]-a[1])*dx)/L;
  if(dep>=14||Math.max(d1,d2)<=tol){out.push(d);return}const ab=[(a[0]+b[0])/2,(a[1]+b[1])/2],bc=[(b[0]+c[0])/2,(b[1]+c[1])/2],cd=[(c[0]+d[0])/2,(c[1]+d[1])/2],abc=[(ab[0]+bc[0])/2,(ab[1]+bc[1])/2],bcd=[(bc[0]+cd[0])/2,(bc[1]+cd[1])/2],m=[(abc[0]+bcd[0])/2,(abc[1]+bcd[1])/2];rec(a,ab,abc,m,dep+1);rec(m,bcd,cd,d,dep+1)};rec(p0,p1,p2,p3,0)}
function arcToBez(x1,y1,rx,ry,phi,fa,fs,x2,y2){if(rx===0||ry===0)return[[x1,y1,x1,y1,x2,y2,x2,y2]];rx=Math.abs(rx);ry=Math.abs(ry);const ph=phi*Math.PI/180,c=Math.cos(ph),s=Math.sin(ph),dx=(x1-x2)/2,dy=(y1-y2)/2,x1p=c*dx+s*dy,y1p=-s*dx+c*dy;let lam=x1p*x1p/(rx*rx)+y1p*y1p/(ry*ry);if(lam>1){const q=Math.sqrt(lam);rx*=q;ry*=q}
 const sg=fa===fs?-1:1,nn=Math.max(0,(rx*rx*ry*ry-rx*rx*y1p*y1p-ry*ry*x1p*x1p)/(rx*rx*y1p*y1p+ry*ry*x1p*x1p)),co=sg*Math.sqrt(nn),cxp=co*rx*y1p/ry,cyp=-co*ry*x1p/rx,cx_=c*cxp-s*cyp+(x1+x2)/2,cy_=s*cxp+c*cyp+(y1+y2)/2;
 const ang=(ux,uy,vx,vy)=>{const a=Math.atan2(ux*vy-uy*vx,ux*vx+uy*vy);return a},t1=ang(1,0,(x1p-cxp)/rx,(y1p-cyp)/ry);let dt=ang((x1p-cxp)/rx,(y1p-cyp)/ry,(-x1p-cxp)/rx,(-y1p-cyp)/ry);if(!fs&&dt>0)dt-=2*Math.PI;else if(fs&&dt<0)dt+=2*Math.PI;
 const n=Math.max(1,Math.ceil(Math.abs(dt)/(Math.PI/2)-1e-9)),d=dt/n,k=4/3*Math.tan(d/4),out=[];let a0=t1;for(let i=0;i<n;i++){const a1=a0+d,c0=Math.cos(a0),s0=Math.sin(a0),c1=Math.cos(a1),s1=Math.sin(a1),
  P=(ex,ey)=>[c*rx*ex-s*ry*ey+cx_,s*rx*ex+c*ry*ey+cy_],p0=P(c0,s0),p3=P(c1,s1),p1=P(c0-k*s0,s0+k*c0),p2=P(c1+k*s1,s1-k*c1);out.push([p0[0],p0[1],p1[0],p1[1],p2[0],p2[1],p3[0],p3[1]]);a0=a1}
 return out}
function parsePath(d,tol){const tk=d.match(/[a-zA-Z]|[-+]?(?:\d*\.\d+|\d+\.?)(?:[eE][-+]?\d+)?/g)||[],subs=[];let i=0,cmd='',x=0,y=0,sx=0,sy=0,cur=null,lc=null,lq=null,pc='';
 const num=()=>parseFloat(tk[i++]),flag=()=>{const t=tk[i];if(t&&t.length>1&&/^[01]/.test(t)&&!/\./.test(t)){tk[i]=t.slice(1);return+t[0]}i++;return+t};
 const start=(X,Y)=>{cur={pts:[[X,Y]],closed:false};subs.push(cur)};
 while(i<tk.length){if(/[a-zA-Z]/.test(tk[i])){cmd=tk[i++];}else if(cmd==='M')cmd='L';else if(cmd==='m')cmd='l';else if(cmd==='z'||cmd==='Z'){i++;continue}
  const rel=cmd===cmd.toLowerCase(),C=cmd.toUpperCase();
  if(C==='Z'){if(cur){cur.closed=true;x=sx;y=sy;cur=null}lc=lq=null;pc='Z';continue}
  if(!cur&&C!=='M'){start(x,y)}
  if(C==='M'){const nx=num()+(rel?x:0),ny=num()+(rel?y:0);x=sx=nx;y=sy=ny;start(x,y);lc=lq=null}
  else if(C==='L'){const nx=num()+(rel?x:0),ny=num()+(rel?y:0);x=nx;y=ny;cur.pts.push([x,y]);lc=lq=null}
  else if(C==='H'){x=num()+(rel?x:0);cur.pts.push([x,y]);lc=lq=null}
  else if(C==='V'){y=num()+(rel?y:0);cur.pts.push([x,y]);lc=lq=null}
  else if(C==='C'){const a=[num()+(rel?x:0),num()+(rel?y:0)],b=[num()+(rel?x:0),num()+(rel?y:0)],e=[num()+(rel?x:0),num()+(rel?y:0)];bez3([x,y],a,b,e,tol,cur.pts);x=e[0];y=e[1];lc=b;lq=null}
  else if(C==='S'){const a=lc?[2*x-lc[0],2*y-lc[1]]:[x,y],b=[num()+(rel?x:0),num()+(rel?y:0)],e=[num()+(rel?x:0),num()+(rel?y:0)];bez3([x,y],a,b,e,tol,cur.pts);x=e[0];y=e[1];lc=b;lq=null}
  else if(C==='Q'){const q=[num()+(rel?x:0),num()+(rel?y:0)],e=[num()+(rel?x:0),num()+(rel?y:0)];bez3([x,y],[x+2/3*(q[0]-x),y+2/3*(q[1]-y)],[e[0]+2/3*(q[0]-e[0]),e[1]+2/3*(q[1]-e[1])],e,tol,cur.pts);x=e[0];y=e[1];lq=q;lc=null}
  else if(C==='T'){const q=lq?[2*x-lq[0],2*y-lq[1]]:[x,y],e=[num()+(rel?x:0),num()+(rel?y:0)];bez3([x,y],[x+2/3*(q[0]-x),y+2/3*(q[1]-y)],[e[0]+2/3*(q[0]-e[0]),e[1]+2/3*(q[1]-e[1])],e,tol,cur.pts);x=e[0];y=e[1];lq=q;lc=null}
  else if(C==='A'){const rx=num(),ry=num(),ph=num(),fa=flag(),fs=flag(),e=[num()+(rel?x:0),num()+(rel?y:0)];arcToBez(x,y,rx,ry,ph,fa,fs,e[0],e[1]).forEach(b=>bez3([b[0],b[1]],[b[2],b[3]],[b[4],b[5]],[b[6],b[7]],tol,cur.pts));x=e[0];y=e[1];lc=lq=null}
  else{i++}pc=C}
 return subs.filter(s=>s.pts.length>=2||s.closed)}

const pathPts=(d,n)=>{const tol=Math.max(.05,9/Math.max(4,n||24));return parsePath(d,tol).map(s=>({pts:s.pts.map(p=>[p[0]/50-1,p[1]/50-1]),closed:s.closed}))};
const circ=(cx,cy,rx,ry,n,a0)=>Array.from({length:n},(_,i)=>{const a=(a0===undefined?-Math.PI/2:a0)+i*TAU/n;return[cx+Math.cos(a)*rx,cy+Math.sin(a)*ry]});
const arc=(cx,cy,rx,ry,a0,a1,n)=>Array.from({length:n+1},(_,i)=>{const a=a0+(a1-a0)*i/n;return[cx+Math.cos(a)*rx,cy+Math.sin(a)*ry]});
const ellR=(cx,cy,rx,ry,r,n)=>Array.from({length:n},(_,i)=>{const t=i/n*TAU,x=Math.cos(t)*rx,y=Math.sin(t)*ry,c=Math.cos(r),s=Math.sin(r);return[cx+x*c-y*s,cy+x*s+y*c]});
const u50=v=>v/50-1,C100=(cx,cy,r,n)=>circ(u50(cx),u50(cy),r/50,r/50,n),E100=(cx,cy,rx,ry,deg,n)=>ellR(u50(cx),u50(cy),rx/50,ry/50,rad(deg),n);
const pp100=s=>{const a=s.trim().split(/[\s,]+/).map(Number),o=[];for(let i=0;i+1<a.length;i+=2)o.push([a[i]/50-1,a[i+1]/50-1]);return o};
const rot=(pts,a)=>{const c=Math.cos(a),s=Math.sin(a);return pts.map(p=>[p[0]*c-p[1]*s,p[0]*s+p[1]*c])};
const norm=(pts,cx,cy,k)=>pts.map(p=>[(p[0]-cx)/k,(p[1]-cy)/k]);
const mirX=pts=>pts.map(q=>[-q[0],q[1]]);
const xf=(pts,sx,sy,dx,dy)=>pts.map(q=>[q[0]*sx+(dx||0),q[1]*(sy===undefined?sx:sy)+(dy||0)]);
const area2=Q=>{let a=0;for(let i=0;i<Q.length;i++){const p=Q[i],q=Q[(i+1)%Q.length];a+=p[0]*q[1]-q[0]*p[1]}return a/2};
const thickLine=(pts,t)=>{const L=[],R=[],n=pts.length;for(let i=0;i<n;i++){const a=pts[Math.max(0,i-1)],b=pts[i],c=pts[Math.min(n-1,i+1)];let d1=[b[0]-a[0],b[1]-a[1]],d2=[c[0]-b[0],c[1]-b[1]];const n1=Math.hypot(...d1)||1,n2=Math.hypot(...d2)||1;d1=[d1[0]/n1,d1[1]/n1];d2=[d2[0]/n2,d2[1]/n2];if(i===0)d1=d2;if(i===n-1)d2=d1;let nx=-(d1[1]+d2[1]),ny=d1[0]+d2[0];const l=Math.hypot(nx,ny)||1;nx/=l;ny/=l;const dot=nx*(-d1[1])+ny*d1[0],k=t/Math.max(.35,Math.abs(dot));L.push([b[0]+nx*k,b[1]+ny*k]);R.push([b[0]-nx*k,b[1]-ny*k])}return L.concat(R.reverse())};
const heartPts=n=>Array.from({length:n},(_,i)=>{const t=i/n*TAU;return[16*Math.pow(Math.sin(t),3),-(13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t))]});
const heartN=n=>norm(heartPts(Math.max(24,n)),0,-2.5,16.5);
const plus12=(a,t)=>[[-t,-a],[t,-a],[t,-t],[a,-t],[a,t],[t,t],[t,a],[-t,a],[-t,t],[-a,t],[-a,-t],[-t,-t]];
const starPts=(k,ir,cv,n,alt)=>{const v=[];for(let i=0;i<k*2;i++){const a=-Math.PI/2+i*Math.PI/k;let r=i%2?ir:1;if(!(i%2)&&alt&&(i/2)%2===1)r=1-alt;v.push([Math.cos(a)*r,Math.sin(a)*r])}
 if(Math.abs(cv||0)<.01)return v;const per=Math.max(4,Math.round((n||48)/(k*2))),o=[];for(let i=0;i<v.length;i++){const a=v[i],b=v[(i+1)%v.length],m=[(a[0]+b[0])/2*(1-cv),(a[1]+b[1])/2*(1-cv)];for(let j=0;j<per;j++){const t=j/per;o.push([(1-t)*(1-t)*a[0]+2*(1-t)*t*m[0]+t*t*b[0],(1-t)*(1-t)*a[1]+2*(1-t)*t*m[1]+t*t*b[1]])}}return o};
const bulge=(v,cv,m)=>{if(Math.abs(cv)<.004)return v;const N=v.length,o=[];let cx=0,cy=0;v.forEach(q=>{cx+=q[0];cy+=q[1]});cx/=N;cy/=N;
 for(let i=0;i<N;i++){const a=v[i],b=v[(i+1)%N],dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy)||1;let nx=dy/L,ny=-dx/L;const mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2;if((mx-cx)*nx+(my-cy)*ny<0){nx=-nx;ny=-ny}
  const q=[mx+nx*cv*L,my+ny*cv*L];for(let j=0;j<m;j++){const t=j/m;o.push([(1-t)*(1-t)*a[0]+2*(1-t)*t*q[0]+t*t*b[0],(1-t)*(1-t)*a[1]+2*(1-t)*t*q[1]+t*t*b[1]])}}return o};
const crClosed=(pts,per)=>{const n=pts.length,o=[];for(let i=0;i<n;i++){const p0=pts[(i-1+n)%n],p1=pts[i],p2=pts[(i+1)%n],p3=pts[(i+2)%n];for(let j=0;j<per;j++){const t=j/per,t2=t*t,t3=t2*t;o.push([0,1].map(k=>.5*(2*p1[k]+(-p0[k]+p2[k])*t+(2*p0[k]-5*p1[k]+4*p2[k]-p3[k])*t2+(-p0[k]+3*p1[k]-3*p2[k]+p3[k])*t3)))}}return o};
const crOpen=(pts,per)=>{const n=pts.length,o=[];for(let i=0;i<n-1;i++){const p0=pts[Math.max(0,i-1)],p1=pts[i],p2=pts[i+1],p3=pts[Math.min(n-1,i+2)];for(let j=0;j<per;j++){const t=j/per,t2=t*t,t3=t2*t;o.push([0,1].map(k=>.5*(2*p1[k]+(-p0[k]+p2[k])*t+(2*p0[k]-5*p1[k]+4*p2[k]-p3[k])*t2+(-p0[k]+3*p1[k]-3*p2[k]+p3[k])*t3)))}}o.push(pts[n-1].slice());return o};
const rng=s=>{let a=(Math.floor(s*2654435761)>>>0)||1;return()=>{a=(a+0x6D2B79F5)|0;let t=Math.imul(a^(a>>>15),1|a);t=(t+Math.imul(t^(t>>>7),61|t))^t;return((t^(t>>>14))>>>0)/4294967296}};
const bbox=pts=>{let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;pts.forEach(q=>{x0=Math.min(x0,q[0]);x1=Math.max(x1,q[0]);y0=Math.min(y0,q[1]);y1=Math.max(y1,q[1])});return{x0,y0,x1,y1,w:x1-x0,h:y1-y0,cx:(x0+x1)/2,cy:(y0+y1)/2}};
const rgb=h=>[parseInt(h.substr(0,2),16),parseInt(h.substr(2,2),16),parseInt(h.substr(4,2),16)],hx2=n=>(n<16?'0':'')+Math.round(cl(n,0,255)).toString(16);
const mix=(a,b,t)=>{const A=rgb(a),B=rgb(b);return hx2(A[0]+(B[0]-A[0])*t)+hx2(A[1]+(B[1]-A[1])*t)+hx2(A[2]+(B[2]-A[2])*t)};
const dk=(h,k)=>mix(h,'000000',k===undefined?.42:k),lt=(h,k)=>mix(h,'ffffff',k===undefined?.4:k);
const P=(pts,o)=>Object.assign({pts,closed:true},o||{});
const PS=(d,n,x)=>pathPts(d,n).map(s=>P(s.pts,Object.assign({closed:s.closed,open:!s.closed},x||{})));
const pr=(k,l,d,mn,mx,st,u,h)=>({k,l,d,min:mn,max:mx,step:st||1,u:u||'',h:h||''}),pb=(k,l,d,h)=>({k,l,d:d?1:0,t:'b',h:h||''}),ps=(k,l,d,o,h)=>({k,l,d,t:'s',o,h:h||''}),pc=(k,l,d,h)=>({k,l,d,t:'c',h:h||''});
const when=(q,f)=>(q.w=f,q);
const RD=(d,h)=>pr('rd','Arredondar cantos',d||0,0,100,5,'%',h||'Transforma cada canto vivo em um arco de círculo.');
const F=[],E=[];
const SEGK={k:1};
const segWrap=s=>{const g0=s.g,ref=s.n0||24;s.g=(p,nn,G)=>{const k=SEGK.k;SEGK.k=(nn||ref)/ref;try{return g0(p,ref,G)}finally{SEGK.k=k}};return s};
const add=(id,cat,n,params,g,extra)=>{const s=segWrap(Object.assign({id,cat,n,P:params||[],g},extra||{}));F.push(s);return s};
const addE=(id,cat,n,g,x)=>{const s=Object.assign({id,cat,n,P:[],g:(p,nn)=>[].concat(g(kit(nn||24),p,nn||24)).flat(Infinity),emoji:1,fit:false},x||{});E.push(s);return s};
function kit(n){const segC=v=>Math.max(n>=24?10:Math.max(5,Math.round(10*n/24)),Math.round(Math.min(Math.max(48,n*2),160,v)));
 const fp=(pts,f,l,x)=>({pts,closed:true,fill:f,line:l===undefined?dk(f):(l||null),...(x||{})});
 const Pf=(d,f,l,x)=>pathPts(d,n).map(s=>fp(s.pts,f,l,{closed:s.closed,open:!s.closed,...(x||{})}));
 const Pl=(d,l,t,x)=>pathPts(d,n).map(s=>P(s.pts,{open:1,closed:false,line:l,t:t||.04,...(x||{})}));
 const Ci=(cx,cy,r,f,l,x)=>fp(C100(cx,cy,r,segC(6+r*n/22)),f,l,x);
 const El=(cx,cy,rx,ry,deg,f,l,x)=>fp(E100(cx,cy,rx,ry,deg||0,segC(6+Math.max(rx,ry)*n/22)),f,l,x);
 const Sy=a=>a.concat(a.map(x=>({...x,pts:mirX(x.pts)})));
 const Pn=(s,f,l,x)=>fp(pp100(s),f,l,x);
 return{Pf,Pl,Ci,El,Sy,Pn,fp,n}}
return{TAU,cl,rad,lerp,pathPts,parsePath,circ,arc,ellR,u50,C100,E100,pp100,rot,norm,mirX,xf,area2,thickLine,heartPts,heartN,plus12,starPts,bulge,crClosed,crOpen,rng,bbox,mix,dk,lt,P,PS,pr,pb,ps,pc,when,RD,F,E,add,addE,kit,SEGK}})();
