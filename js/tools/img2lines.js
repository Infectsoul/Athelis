'use strict';
const I2L=(()=>{
let SRC=null,PC={key:'',d:null};
const clamp=(v,a,b)=>v<a?a:v>b?b:v,hex2=n=>(n<16?'0':'')+n.toString(16),hexc=(r,g,b)=>hex2(clamp(Math.round(r),0,255))+hex2(clamp(Math.round(g),0,255))+hex2(clamp(Math.round(b),0,255));
const qz=v=>clamp(Math.round(v/8)*8,0,255);
function fromImage(im,name){const M=2000,s=Math.min(1,M/Math.max(im.naturalWidth||im.width,im.naturalHeight||im.height)),w=Math.max(1,Math.round((im.naturalWidth||im.width)*s)),h=Math.max(1,Math.round((im.naturalHeight||im.height)*s)),c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d',{willReadFrequently:true});g.imageSmoothingQuality='high';g.drawImage(im,0,0,w,h);
 try{g.getImageData(0,0,1,1)}catch(e){throw new Error('cors')}SRC={cv:c,w,h,name:name||'imagem',id:Math.random()};PC.key='';return SRC}
function load(src,name){return new Promise((res,rej)=>{const im=new Image();if(!/^data:|^blob:/.test(src))im.crossOrigin='anonymous';im.onload=()=>{try{res(fromImage(im,name))}catch(e){rej(e)}};im.onerror=()=>rej(new Error('load'));im.src=src})}
async function loadURL(url){let blobUrl=null;try{const r=await fetch(url,{mode:'cors'});if(r.ok){const b=await r.blob();blobUrl=URL.createObjectURL(b)}}catch(e){}
 const nm=(url.split('?')[0].split('/').pop()||'link').slice(0,40);if(blobUrl)return load(blobUrl,nm);return load(url,nm)}
function boxBlur(src,w,h,r){const out=new Float32Array(w*h);if(r<1){out.set(src);return out}const tmp=new Float32Array(w*h),d=2*r+1;
 for(let y=0;y<h;y++){const o=y*w;let a=0;for(let x=-r;x<=r;x++)a+=src[o+clamp(x,0,w-1)];for(let x=0;x<w;x++){tmp[o+x]=a/d;a+=src[o+Math.min(w-1,x+r+1)]-src[o+Math.max(0,x-r)]}}
 for(let x=0;x<w;x++){let a=0;for(let y=-r;y<=r;y++)a+=tmp[clamp(y,0,h-1)*w+x];for(let y=0;y<h;y++){out[y*w+x]=a/d;a+=tmp[Math.min(h-1,y+r+1)*w+x]-tmp[Math.max(0,y-r)*w+x]}}return out}
function kmeans(px,n,k){let seed=987654321;const rnd=()=>(seed=(seed*1664525+1013904223)%4294967296)/4294967296,C=[],i0=Math.floor(rnd()*n);C.push([px[i0*3],px[i0*3+1],px[i0*3+2]]);const d2=new Float64Array(n).fill(1e18);
 for(let c=1;c<k;c++){const L=C[c-1];let sum=0;for(let i=0;i<n;i++){const dr=px[i*3]-L[0],dg=px[i*3+1]-L[1],db=px[i*3+2]-L[2],d=dr*dr+dg*dg+db*db;if(d<d2[i])d2[i]=d;sum+=d2[i]}if(sum<=0)break;let t=rnd()*sum,j=0;for(;j<n-1;j++){t-=d2[j];if(t<=0)break}C.push([px[j*3],px[j*3+1],px[j*3+2]])}
 const K=C.length,lab=new Uint8Array(n);for(let it=0;it<10;it++){const S=C.map(()=>[0,0,0,0]);for(let i=0;i<n;i++){let b=0,bd=1e18;for(let c=0;c<K;c++){const dr=px[i*3]-C[c][0],dg=px[i*3+1]-C[c][1],db=px[i*3+2]-C[c][2],d=dr*dr+dg*dg+db*db;if(d<bd){bd=d;b=c}}lab[i]=b;const s=S[b];s[0]+=px[i*3];s[1]+=px[i*3+1];s[2]+=px[i*3+2];s[3]++}
  let mv=0;for(let c=0;c<K;c++)if(S[c][3]){const nc=[S[c][0]/S[c][3],S[c][1]/S[c][3],S[c][2]/S[c][3]];mv+=Math.abs(nc[0]-C[c][0])+Math.abs(nc[1]-C[c][1])+Math.abs(nc[2]-C[c][2]);C[c]=nc}if(mv<.5)break}return C}
const LIN=Float32Array.from({length:256},(_,i)=>{const c=i/255;return c<=.04045?c/12.92:Math.pow((c+.055)/1.055,2.4)});
function lab3(r,g,b,o,j){const R=LIN[r],G=LIN[g],B=LIN[b],f=t=>t>.008856?Math.cbrt(t):7.787*t+16/116,fx=f((.4124*R+.3576*G+.1805*B)/.95047),fy=f(.2126*R+.7152*G+.0722*B),fz=f((.0193*R+.1192*G+.9505*B)/1.08883);o[j]=116*fy-16;o[j+1]=500*(fx-fy);o[j+2]=200*(fy-fz)}
function bilateral(R,G,B,w,h,r,sig){const N=w*h,oR=new Float32Array(N),oG=new Float32Array(N),oB=new Float32Array(N),k=1/(2*sig*sig),W=new Float32Array(768);for(let i=0;i<768;i++)W[i]=Math.exp(-i*i*k/9);
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=y*w+x,r0=R[i],g0=G[i],b0=B[i];let sr=0,sg=0,sb=0,sw=0;
  for(let yy=Math.max(0,y-r);yy<=Math.min(h-1,y+r);yy++)for(let xx=Math.max(0,x-r);xx<=Math.min(w-1,x+r);xx++){const j=yy*w+xx,d=Math.abs(R[j]-r0)+Math.abs(G[j]-g0)+Math.abs(B[j]-b0),q=W[d>767?767:d|0];sr+=R[j]*q;sg+=G[j]*q;sb+=B[j]*q;sw+=q}
  oR[i]=sr/sw;oG[i]=sg/sw;oB[i]=sb/sw}return[oR,oG,oB]}
function kmeansLab(px,n,k){const bins=new Map();for(let i=0;i<n;i++){const key=((px[i*3]/8)|0)*10000+(((px[i*3+1]+128)/8)|0)*100+(((px[i*3+2]+128)/8)|0);let b=bins.get(key);if(!b)bins.set(key,b={n:0,s:[0,0,0]});b.n++;b.s[0]+=px[i*3];b.s[1]+=px[i*3+1];b.s[2]+=px[i*3+2]}
 const cand=[...bins.values()].filter(b=>b.n>=Math.max(2,n*.0015)).map(b=>({n:b.n,c:[b.s[0]/b.n,b.s[1]/b.n,b.s[2]/b.n]})).sort((a,b)=>b.n-a.n),C=[];if(!cand.length)return[[50,0,0]];C.push(cand[0].c);
 const md=cand.map(b=>Math.hypot(b.c[0]-C[0][0],b.c[1]-C[0][1],b.c[2]-C[0][2]));
 while(C.length<k){let bi=-1,bv=2;for(let i=0;i<cand.length;i++)if(md[i]>bv){bv=md[i];bi=i}if(bi<0)break;const c=cand[bi].c;C.push(c);for(let i=0;i<cand.length;i++)md[i]=Math.min(md[i],Math.hypot(cand[i].c[0]-c[0],cand[i].c[1]-c[1],cand[i].c[2]-c[2]))}
 const K=C.length;for(let it=0;it<12;it++){const S=C.map(()=>[0,0,0,0]);for(let i=0;i<n;i++){let b=0,bd=1e18;for(let c=0;c<K;c++){const dl=px[i*3]-C[c][0],da=px[i*3+1]-C[c][1],db=px[i*3+2]-C[c][2],d=dl*dl+da*da+db*db;if(d<bd){bd=d;b=c}}const s=S[b];s[0]+=px[i*3];s[1]+=px[i*3+1];s[2]+=px[i*3+2];s[3]++}
  let mv=0;for(let c=0;c<K;c++)if(S[c][3]){const nc=[S[c][0]/S[c][3],S[c][1]/S[c][3],S[c][2]/S[c][3]];mv+=Math.abs(nc[0]-C[c][0])+Math.abs(nc[1]-C[c][1])+Math.abs(nc[2]-C[c][2]);C[c]=nc}if(mv<.3)break}return C}
function bgMask(rgb,al,w,h,mode,tol){const ign=new Uint8Array(w*h);if(mode==='none')return ign;
 if(mode==='alpha'){for(let i=0;i<w*h;i++)if(al[i]<128)ign[i]=1;return ign}
 const cs=[0,w-1,(h-1)*w,h*w-1].map(i=>[rgb[i*3],rgb[i*3+1],rgb[i*3+2]]),cr=cs.reduce((a,c)=>a+c[0],0)/4,cg=cs.reduce((a,c)=>a+c[1],0)/4,cb=cs.reduce((a,c)=>a+c[2],0)/4,t2=tol*tol,near=i=>{const dr=rgb[i*3]-cr,dg=rgb[i*3+1]-cg,db=rgb[i*3+2]-cb;return dr*dr+dg*dg+db*db<=t2||al[i]<128},st=[];
 const push=i=>{if(!ign[i]&&near(i)){ign[i]=1;st.push(i)}};for(let x=0;x<w;x++){push(x);push((h-1)*w+x)}for(let y=0;y<h;y++){push(y*w);push(y*w+w-1)}
 while(st.length){const i=st.pop(),x=i%w,y=(i-x)/w;if(x>0)push(i-1);if(x<w-1)push(i+1);if(y>0)push(i-w);if(y<h-1)push(i+w)}return ign}
function thin(M,w,h){const del=[];let ch=true;while(ch){ch=false;for(let pass=0;pass<2;pass++){del.length=0;
 for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){const i=y*w+x;if(!M[i])continue;const p2=M[i-w],p3=M[i-w+1],p4=M[i+1],p5=M[i+w+1],p6=M[i+w],p7=M[i+w-1],p8=M[i-1],p9=M[i-w-1],B=p2+p3+p4+p5+p6+p7+p8+p9;if(B<2||B>6)continue;
  const A=(!p2&&p3)+(!p3&&p4)+(!p4&&p5)+(!p5&&p6)+(!p6&&p7)+(!p7&&p8)+(!p8&&p9)+(!p9&&p2);if(A!==1)continue;
  if(pass===0){if(p2*p4*p6||p4*p6*p8)continue}else{if(p2*p4*p8||p2*p6*p8)continue}del.push(i)}
 if(del.length){ch=true;for(const i of del)M[i]=0}}}}
function tracePaths(M,w,h){const dx=[-1,0,1,1,1,0,-1,-1],dy=[-1,-1,-1,0,1,1,1,0],V=new Uint8Array(w*h),paths=[];
 const nb=(x,y)=>{const o=[];for(let d=0;d<8;d++){const X=x+dx[d],Y=y+dy[d];if(X<0||Y<0||X>=w||Y>=h||!M[Y*w+X])continue;if(!(d&1)&&(M[y*w+X]||M[Y*w+x]))continue;o.push(d)}return o};
 const walk=(x,y,d)=>{const p=[[x,y]];let cx=x,cy=y,dd=d;for(;;){V[cy*w+cx]|=1<<dd;const nx=cx+dx[dd],ny=cy+dy[dd];V[ny*w+nx]|=1<<((dd+4)&7);p.push([nx,ny]);cx=nx;cy=ny;const l=nb(cx,cy);if(l.length!==2)break;const back=(dd+4)&7;let nd=-1;for(const q of l)if(q!==back&&!(V[cy*w+cx]&(1<<q))){nd=q;break}if(nd<0)break;dd=nd}return p};
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){if(!M[y*w+x])continue;const l=nb(x,y);if(l.length===2||!l.length)continue;for(const d of l)if(!(V[y*w+x]&(1<<d)))paths.push(walk(x,y,d))}
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){if(!M[y*w+x])continue;for(const d of nb(x,y))if(!(V[y*w+x]&(1<<d)))paths.push(walk(x,y,d))}return paths}
function prep(o){const key=[SRC.id,o.style,o.w,o.res,o.k,o.thr,o.edge,o.blur,o.inv,o.bg,o.bgt,o.fill&&o.opt!==false?1:0,o.opt!==false?1:0,o.cmt].join('|');if(PC.key===key)return PC.d;
 const Wp=clamp(Math.round(o.w*o.res),16,1400),Hp=Math.max(8,Math.round(Wp*SRC.h/SRC.w)),c=document.createElement('canvas');c.width=Wp;c.height=Hp;const g=c.getContext('2d',{willReadFrequently:true});g.imageSmoothingQuality='high';g.drawImage(SRC.cv,0,0,Wp,Hp);
 const d=g.getImageData(0,0,Wp,Hp).data,N=Wp*Hp,al=new Uint8Array(N),R=new Float32Array(N),G=new Float32Array(N),B=new Float32Array(N);
 for(let i=0;i<N;i++){const a=d[i*4+3];al[i]=a;const f=a/255;R[i]=d[i*4]*f+255*(1-f);G[i]=d[i*4+1]*f+255*(1-f);B[i]=d[i*4+2]*f+255*(1-f)}
 const br=Math.round(o.blur),sm=o.style==='color'&&o.opt!==false&&br>0&&N<=1.6e6?bilateral(R,G,B,Wp,Hp,Math.min(3,br),22):null,rb=sm?sm[0]:boxBlur(R,Wp,Hp,br),gb=sm?sm[1]:boxBlur(G,Wp,Hp,br),bb=sm?sm[2]:boxBlur(B,Wp,Hp,br),rgb=new Uint8Array(N*3);for(let i=0;i<N;i++){rgb[i*3]=rb[i];rgb[i*3+1]=gb[i];rgb[i*3+2]=bb[i]}
 const ign=bgMask(rgb,al,Wp,Hp,o.bg,o.bgt),L=new Float32Array(N);for(let i=0;i<N;i++){const v=.299*rb[i]+.587*gb[i]+.114*bb[i];L[i]=o.inv?255-v:v}
 const D={Wp,Hp,sc:o.w/Wp,rgb,ign,L,style:o.style},PAD=1,W2=Wp+2,H2=Hp+2;
 const padMask=fn=>{const A=new Uint8Array(W2*H2);for(let y=0;y<Hp;y++)for(let x=0;x<Wp;x++){const i=y*Wp+x;if(!ign[i])A[(y+1)*W2+x+1]=fn(i)}return A};
 const lvl=(thr,A_)=>padMask(i=>clamp(127.5+(thr-L[i])*10,0,255));
 if(o.style==='color'){const k=o.k<=0?16:clamp(Math.round(o.k),2,24),S=Math.max(1,Math.floor(Math.sqrt(N/16000))),px=[],t3=new Float32Array(3),LAB=new Float32Array(N*3);
  for(let i=0;i<N;i++)if(!ign[i])lab3(rgb[i*3],rgb[i*3+1],rgb[i*3+2],LAB,i*3);
  for(let y=0;y<Hp;y+=S)for(let x=0;x<Wp;x+=S){const i=y*Wp+x;if(!ign[i])px.push(LAB[i*3],LAB[i*3+1],LAB[i*3+2])}
  const cen0=px.length>=3?kmeansLab(Float32Array.from(px),px.length/3,k):[[50,0,0]];let K=cen0.length,lab=new Uint8Array(N).fill(255);
  for(let i=0;i<N;i++){if(ign[i])continue;let b=0,bd=1e18;const l0=LAB[i*3],a0=LAB[i*3+1],b0=LAB[i*3+2];for(let c=0;c<K;c++){const dl=l0-cen0[c][0],da=a0-cen0[c][1],db=b0-cen0[c][2],dd=dl*dl+da*da+db*db;if(dd<bd){bd=dd;b=c}}lab[i]=b}
  if(br>0){const l2=lab.slice(),cnt=new Uint16Array(K);for(let y=1;y<Hp-1;y++)for(let x=1;x<Wp-1;x++){const i=y*Wp+x;if(lab[i]===255)continue;cnt.fill(0);let best=lab[i],bc=0;for(let yy=-1;yy<=1;yy++)for(let xx=-1;xx<=1;xx++){const q=lab[i+yy*Wp+xx];if(q===255)continue;if(++cnt[q]>bc){bc=cnt[q];best=q}}l2[i]=bc>=5?best:lab[i]}lab=l2}
  let cn=new Float64Array(K),sr=new Float64Array(K*3),sl=new Float64Array(K*3);for(let i=0;i<N;i++){const c=lab[i];if(c===255)continue;cn[c]++;for(let q=0;q<3;q++){sr[c*3+q]+=rgb[i*3+q];sl[c*3+q]+=LAB[i*3+q]}}
  const map=Array.from({length:K},(_,i)=>i),alive=[...Array(K).keys()].filter(c=>cn[c]>0),MT=o.opt!==false?(o.k<=0?Math.max(10,o.cmt||0):(o.cmt>0?o.cmt:8)):0;
  const cl=c=>[sl[c*3]/cn[c],sl[c*3+1]/cn[c],sl[c*3+2]/cn[c]];
  for(;MT>0&&alive.length>1;){let ba=-1,bb2=-1,bd=MT;for(let x=0;x<alive.length;x++)for(let y=x+1;y<alive.length;y++){const p=cl(alive[x]),q=cl(alive[y]),d=Math.hypot(p[0]-q[0],p[1]-q[1],p[2]-q[2]);if(d<bd){bd=d;ba=x;bb2=y}}if(ba<0)break;
   let A_=alive[ba],B_=alive[bb2];if(cn[B_]>cn[A_])[A_,B_]=[B_,A_];for(let q=0;q<3;q++){sr[A_*3+q]+=sr[B_*3+q];sl[A_*3+q]+=sl[B_*3+q]}cn[A_]+=cn[B_];cn[B_]=0;for(let c=0;c<K;c++)if(map[c]===B_)map[c]=A_;alive.splice(alive.indexOf(B_),1)}
  for(let i=0;i<N;i++)if(lab[i]!==255)lab[i]=map[lab[i]];
  const cen=Array.from({length:K},(_,c)=>cn[c]>0?[sr[c*3]/cn[c],sr[c*3+1]/cn[c],sr[c*3+2]/cn[c]]:[0,0,0]);
  const area=new Float64Array(K);for(let i=0;i<N;i++)if(lab[i]!==255)area[lab[i]]++;const order=[...Array(K).keys()].filter(c=>area[c]>0).sort((a,b)=>area[b]-area[a]);
  const stack=!!(o.fill&&o.opt!==false),rank=new Int16Array(256).fill(-1);order.forEach((c,r)=>rank[c]=r);
  D.stacked=stack;D.regions=order.map((c,r)=>{const A=padMask(i=>lab[i]===255?0:(stack&&r===0)||lab[i]===c?255:0),Sm=boxBlur(A,W2,H2,1),A2=new Uint8Array(W2*H2);for(let i=0;i<A2.length;i++)A2[i]=Sm[i]>=255?255:Math.round(Sm[i]);return{col:hexc(cen[c][0],cen[c][1],cen[c][2]),loops:Text.contours(A2,W2,H2)}})}
 else if(o.style==='tone'){const n=clamp(Math.round(o.k),1,12);D.levels=[];for(let i=1;i<=n;i++)D.levels.push({i,n,loops:Text.contours(lvl(255*i/(n+1)),W2,H2)})}
 else if(o.style==='lines'){const n=clamp(Math.round(o.k),1,40);D.levels=[];for(let i=0;i<n;i++){const thr=n===1?o.thr:255*(i+1)/(n+1);D.levels.push({i,n,thr,loops:Text.contours(lvl(thr),W2,H2)})}}
 else{const mag=new Float32Array(N);let mx=0;for(let y=1;y<Hp-1;y++)for(let x=1;x<Wp-1;x++){const i=y*Wp+x;if(ign[i])continue;const gx=-L[i-Wp-1]-2*L[i-1]-L[i+Wp-1]+L[i-Wp+1]+2*L[i+1]+L[i+Wp+1],gy=-L[i-Wp-1]-2*L[i-Wp]-L[i-Wp+1]+L[i+Wp-1]+2*L[i+Wp]+L[i+Wp+1],m=Math.hypot(gx,gy);mag[i]=m;if(m>mx)mx=m}
  const hist=new Float64Array(256);let tot=0;for(let i=0;i<N;i++)if(mag[i]>mx*.02){hist[Math.min(255,Math.floor(mag[i]/mx*255))]++;tot++}let acc=0,T=255;const want=tot*clamp(o.edge,1,40)/100;for(let b=255;b>=0;b--){acc+=hist[b];if(acc>=want){T=b;break}}
  const M=new Uint8Array(Wp*Hp);for(let i=0;i<N;i++)if(mag[i]>mx*.02&&Math.floor(mag[i]/mx*255)>=T)M[i]=1;thin(M,Wp,Hp);D.paths=tracePaths(M,Wp,Hp)}
 PC={key,d:D};return D}
const hexRGB=h=>[parseInt(h.substr(0,2),16),parseInt(h.substr(2,2),16),parseInt(h.substr(4,2),16)];
function optimize(segs,pal,dp,epsO,safe){const tolA=Math.max(dp===0?.5:.3,epsO>0?Math.min(1.2,epsO*.45):0),n0=segs.length;
 const seen=new Set();let S=[];for(const q of segs){const f=q[0]<q[2]||(q[0]===q[2]&&q[1]<=q[3]),k=q[4]+'|'+(f?q[0]+','+q[1]+','+q[2]+','+q[3]:q[2]+','+q[3]+','+q[0]+','+q[1]);if(seen.has(k))continue;seen.add(k);S.push(q.slice())}
 const cnt=new Array(pal.length).fill(0);S.forEach(q=>cnt[q[4]]++);const ord=pal.map((_,i)=>i).sort((a,b)=>cnt[b]-cnt[a]),map=pal.map((_,i)=>i),rgb=pal.map(p=>hexRGB(p.c));
 if(!safe)for(let a=0;a<ord.length;a++){const i=ord[a];if(map[i]!==i||!cnt[i])continue;for(let b=a+1;b<ord.length;b++){const j=ord[b];if(map[j]!==j||pal[j].w!==pal[i].w||!cnt[j])continue;const d=Math.hypot(rgb[i][0]-rgb[j][0],rgb[i][1]-rgb[j][1],rgb[i][2]-rgb[j][2]);if(d<=14)map[j]=i}}
 S.forEach(q=>q[4]=map[q[4]]);
 if(!safe){const CS=12,grid=new Map(),len=q=>Math.hypot(q[2]-q[0],q[3]-q[1]),order=S.map((_,i)=>i).sort((a,b)=>len(S[b])-len(S[a])),kept=[];
  const cellsOf=q=>{const x0=Math.floor((Math.min(q[0],q[2])-3)/CS),x1=Math.floor((Math.max(q[0],q[2])+3)/CS),y0=Math.floor((Math.min(q[1],q[3])-3)/CS),y1=Math.floor((Math.max(q[1],q[3])+3)/CS),o=[];if((x1-x0+1)*(y1-y0+1)>400)return null;for(let x=x0;x<=x1;x++)for(let y=y0;y<=y1;y++)o.push(x*100003+y);return o};
  const covered=(q)=>{const L=len(q);if(L<.5)return false;const cs=cellsOf(q);if(!cs)return false;const ux=(q[2]-q[0])/L,uy=(q[3]-q[1])/L,w=pal[q[4]].w,tol=.6*w;const seenK=new Set();
   for(const c of cs){const a=grid.get(c);if(!a)continue;for(const t of a){if(seenK.has(t))continue;seenK.add(t);if(pal[t[4]].w!==w)continue;const M=len(t);if(M<L*.999)continue;const vx=(t[2]-t[0])/M,vy=(t[3]-t[1])/M;if(Math.abs(ux*vx+uy*vy)<.985)continue;
     const d0=Math.abs((q[0]-t[0])*vy-(q[1]-t[1])*vx),d1=Math.abs((q[2]-t[0])*vy-(q[3]-t[1])*vx);if(d0>tol||d1>tol)continue;const p0=(q[0]-t[0])*vx+(q[1]-t[1])*vy,p1=(q[2]-t[0])*vx+(q[3]-t[1])*vy;if(Math.min(p0,p1)>=-tol&&Math.max(p0,p1)<=M+tol)return true}}return false};
  for(const i of order){const q=S[i];if(covered(q))continue;kept.push(q);const cs=cellsOf(q);if(cs)for(const c of cs){let a=grid.get(c);if(!a)grid.set(c,a=[]);a.push(q)}}
  S=kept}
 const key=(x,y,p)=>p+'|'+x+','+y,ends=new Map(),add=(k,q)=>{let a=ends.get(k);if(!a)ends.set(k,a=[]);a.push(q)},del=(k,q)=>{const a=ends.get(k);if(a){const i=a.indexOf(q);if(i>=0)a.splice(i,1)}};
 S.forEach(q=>{q.dead=false;add(key(q[0],q[1],q[4]),q);add(key(q[2],q[3],q[4]),q)});
 const dist=(px,py,ax,ay,bx,by)=>{const dx=bx-ax,dy=by-ay,L=Math.hypot(dx,dy);return L?Math.abs((px-ax)*dy-(py-ay)*dx)/L:Math.hypot(px-ax,py-ay)};
 for(const q of S){if(q.dead)continue;let ch=true;while(ch){ch=false;
  for(const end of[1,0]){const px=end?q[2]:q[0],py=end?q[3]:q[1],ox=end?q[0]:q[2],oy=end?q[1]:q[3],k=key(px,py,q[4]),a=ends.get(k)||[];if(a.length!==2)continue;const t=a[0]===q?a[1]:a[0];if(t===q||t.dead)continue;
   const tf=t[0]===px&&t[1]===py,fx=tf?t[2]:t[0],fy=tf?t[3]:t[1];
   if((px-ox)*(fx-px)+(py-oy)*(fy-py)<=0)continue;if(dist(px,py,ox,oy,fx,fy)>tolA)continue;
   del(key(t[0],t[1],t[4]),t);del(key(t[2],t[3],t[4]),t);del(k,q);
   if(end){q[2]=fx;q[3]=fy}else{q[0]=fx;q[1]=fy}t.dead=true;add(key(fx,fy,q[4]),q);ch=true;break}}}
 S=S.filter(q=>!q.dead);
 const live=new Map();S.forEach(q=>{const a=key(q[0],q[1],q[4]),b=key(q[2],q[3],q[4]);live.set(a,(live.get(a)||0)+1);live.set(b,(live.get(b)||0)+1)});
 if(!safe)S=S.filter(q=>Math.hypot(q[2]-q[0],q[3]-q[1])>=1.5||live.get(key(q[0],q[1],q[4]))>1||live.get(key(q[2],q[3],q[4]))>1);
 const rm=new Map(),np=[];S.forEach(q=>{let p=rm.get(q[4]);if(p===undefined){p=np.length;rm.set(q[4],p);np.push(pal[q[4]])}q[4]=p});
 return{is:S.map(q=>[q[0],q[1],q[2],q[3],q[4]]),pal:np,saved:n0-S.length}}
function kbOf(is,pal){let b=0;for(const q of is){const p=pal[q[4]];b+=34+String(p.w).length+(q[0]+','+q[1]).length+(q[2]+','+q[3]).length}return b/1024}
function polishLoop(P,lvl){const n=P.length;if(!(lvl>0)||n<8)return P;const k=3,cs=Math.cos(52*Math.PI/180),cor=new Uint8Array(n),at=i=>P[(i%n+n)%n];
 for(let i=0;i<n;i++){const a=at(i-k),b=P[i],c=at(i+k),ux=b[0]-a[0],uy=b[1]-a[1],vx=c[0]-b[0],vy=c[1]-b[1],l=Math.hypot(ux,uy)*Math.hypot(vx,vy);if(l>1e-9&&(ux*vx+uy*vy)/l<cs)cor[i]=1}
 let Q=P;const iters=lvl>=3?2:1,r=Math.min(6,Math.round(lvl)+1);
 for(let it=0;it<iters;it++){const R=Q.map(p=>p.slice());for(let i=0;i<n;i++){if(cor[i])continue;let l=0,rr=0;while(l<r&&!cor[((i-l-1)%n+n)%n])l++;while(rr<r&&!cor[(i+rr+1)%n])rr++;const m=Math.min(l,rr);if(m<1)continue;let sx=0,sy=0,sw=0;for(let j=-m;j<=m;j++){const w=m+1-Math.abs(j),q=Q[((i+j)%n+n)%n];sx+=q[0]*w;sy+=q[1]*w;sw+=w}R[i]=[sx/sw,sy/sw]}Q=R}
 return Q}
const rawArea=l=>{let a=0;for(let i=0;i<l.length;i++){const q=l[i],r=l[(i+1)%l.length];a+=q[0]*r[1]-r[0]*q[1]}return Math.abs(a)/2};
function emit(D,o,eps,spm,minA){const dp=o.dp,F=Math.pow(10,dp),rn=v=>Math.round(v*F)/F,sc=D.sc,Wp=D.Wp,Hp=D.Hp,palI=new Map(),pal=[],segs=[];
 const conv=(x,y)=>[(x-1+.5-Wp/2)*sc,(y-1+.5-Hp/2)*sc],convP=(x,y)=>[(x+.5-Wp/2)*sc,(y+.5-Hp/2)*sc];
 const add=(a,b,col,w)=>{const ax=rn(a[0]),ay=rn(a[1]),bx=rn(b[0]),by=rn(b[1]);if(ax===bx&&ay===by)return;const k=col+'|'+w;let p=palI.get(k);if(p===undefined){p=pal.length;pal.push({c:col,w});palI.set(k,p)}segs.push([ax,ay,bx,by,p])};
 const areaOf=p=>{let a=0;for(let i=0;i<p.length;i++){const q=p[i],r=p[(i+1)%p.length];a+=q[0]*r[1]-r[0]*q[1]}return Math.abs(a)/2};
 const adapt=loops=>{if(!o.smart)return 1;let A=0;loops.forEach(l=>A+=rawArea(l));const m=Math.sqrt(A)*sc;return clamp(.75+Math.log10(Math.max(1,m))*.2,.8,1.5)}; 
  const polysOf=(loops,e2)=>{const f=e2?1:adapt(loops),pl=o.pol>0?o.pol:0;return loops.map(l=>Text.simpClosed(pl?polishLoop(l,pl):l,Math.max(.05,(e2||eps*f)/sc)).map(q=>conv(q[0],q[1]))).filter(p=>p.length>=3&&areaOf(p)>=minA)};
 const sp=(n)=>o.auto?Math.max(.5,o.lw*o.af*(n||1))*spm:Math.max(.5,o.hs)*spm;
 const colOf=c=>o.cm==='fix'?o.col:c;
 const sample=(x,y)=>{const ix=clamp(Math.round(x),0,Wp-1),iy=clamp(Math.round(y),0,Hp-1),i=iy*Wp+ix;return hexc(qz(D.rgb[i*3]),qz(D.rgb[i*3+1]),qz(D.rgb[i*3+2]))};
 const hatch=(polys,ang,s,col,w,ins)=>{ins=ins||0;const t=[];Text.hatchPolys(polys,ang,s,ins,Math.max(1,w),t);if(o.fx)Text.hatchPolys(polys,ang+90,s,ins,Math.max(1,w),t);t.forEach(q=>add(q.a,q.b,col,w))};
 const ring=(p,col,w)=>{for(let i=0;i<p.length;i++)add(p[i],p[(i+1)%p.length],col,w)};
 if(D.style==='color'){D.regions.forEach(r=>{const P=polysOf(r.loops);if(!P.length)return;const col=colOf(r.col);let ow2=o.ow;if(o.fill){let wf=o.lw,ins=0;if(o.opt!==false&&o.auto){ const A=P.reduce((a,p)=>a+areaOf(p),0),Pm=P.reduce((a,p)=>a+p.reduce((s,q,i)=>s+Math.hypot(q[0]-p[(i+1)%p.length][0],q[1]-p[(i+1)%p.length][1]),0),0),T=Pm>0?2*A/Pm:0;wf=clamp(Math.round(Math.min(Math.sqrt(A)/9,T*.4)),o.lw,7);ins=(wf-o.lw)/2*.55;ow2=Math.max(o.ow,Math.ceil(wf*.6))}hatch(P,o.fa,wf===o.lw?sp(1):Math.max(.5,Math.min(wf*o.af,wf-(dp===0?1:.4)))*spm,col,wf,ins)}if(o.out){ const PO=ow2>2&&o.opt!==false?polysOf(r.loops,Math.max(eps,ow2*.3)):P;PO.forEach(p=>ring(p,col,ow2))}})}
 else if(D.style==='tone'){D.levels.forEach(lv=>{const P=polysOf(lv.loops);if(!P.length)return;const ang=o.fa+(lv.i-1)*(180/lv.n),s=o.auto?Math.max(.5,o.lw*o.af*lv.n*.9)*spm:Math.max(.5,o.hs)*spm;
  if(o.cm==='fix'){if(o.fill)hatch(P,ang,s,o.col,o.lw)}else if(o.fill){const t=[];Text.hatchPolys(P,ang,s,0,Math.max(1,o.lw),t);if(o.fx)Text.hatchPolys(P,ang+90,s,0,Math.max(1,o.lw),t);t.forEach(q=>{const m=[(q.a[0]+q.b[0])/2/sc+Wp/2-.5,(q.a[1]+q.b[1])/2/sc+Hp/2-.5];add(q.a,q.b,sample(m[0],m[1]),o.lw)})}
  if(o.out)P.forEach(p=>ring(p,o.cm==='fix'?o.col:sample(p[0][0]/sc+Wp/2-.5,p[0][1]/sc+Hp/2-.5),o.ow))})}
 else if(D.style==='lines'){D.levels.forEach(lv=>{const P=polysOf(lv.loops);P.forEach(p=>{const cc=o.cm==='fix'?o.col:sample(p[0][0]/sc+Wp/2-.5,p[0][1]/sc+Hp/2-.5);if(o.fill)hatch([p],o.fa,sp(1),cc,o.lw);if(o.out||!o.fill)ring(p,cc,o.lw)})})}
 else{const minLen=Math.max(2,Math.sqrt(minA)),sm=p=>{for(let it=0;it<2;it++){const q=p.map(v=>v.slice());for(let i=1;i<p.length-1;i++){q[i][0]=(p[i-1][0]+2*p[i][0]+p[i+1][0])/4;q[i][1]=(p[i-1][1]+2*p[i][1]+p[i+1][1])/4}p=q}return p};
  D.paths.forEach(pt=>{let p=pt,closed=false;if(p.length>3&&p[0][0]===p[p.length-1][0]&&p[0][1]===p[p.length-1][1]){closed=true;p=p.slice(0,-1)}if(p.length<2)return;p=sm(p);const e=Math.max(.05,eps/sc);
   p=closed?Text.simpClosed(p,e):Text.simpOpen(p,e);if(p.length<2)return;const w=p.map(q=>convP(q[0],q[1]));let len=0;for(let i=1;i<w.length;i++)len+=Math.hypot(w[i][0]-w[i-1][0],w[i][1]-w[i-1][1]);if(len<minLen)return;
   const m=Math.floor(p.length/2),cc=o.cm==='fix'?o.col:sample(p[m][0],p[m][1]);for(let i=0;i<w.length-1;i++)add(w[i],w[i+1],cc,o.lw);if(closed&&w.length>2)add(w[w.length-1],w[0],cc,o.lw)})}
 if(o.opt!==false){const r=optimize(segs,pal,dp,o.smart?eps:0);return{is:r.is,pal:r.pal,saved:r.saved}}return{is:segs,pal,saved:0}}
function run(o){if(!SRC)return null;const t0=performance.now(),D=prep(o);let eps=o.eps,spm=1,minA=o.min,r=emit(D,o,eps,spm,minA);
 const over=q=>(o.budget>0&&q.is.length>o.budget)||(o.kbb>0&&kbOf(q.is,q.pal)>o.kbb);
 for(let it=0;it<14&&over(r);it++){eps*=1.3;spm*=1.16;minA=minA*1.4+1;if(o.pol<3&&it>2)o={...o,pol:(o.pol||0)+1};r=emit(D,o,eps,spm,minA)}
 return{is:r.is,pal:r.pal,n:r.is.length,kb:kbOf(r.is,r.pal),saved:r.saved||0,w:o.w,h:D.Hp*D.sc,cols:r.pal.length,ms:Math.round(performance.now()-t0),spm:R2(spm),eps:R2(eps)}}
return{optimize,load,loadURL,run,get src(){return SRC}}})();
