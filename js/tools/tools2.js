'use strict';
const T2=(()=>{
const O={hq:true,smooth:60,corners:true,close:true,tol:12,scope:'conn',keep:false,keepAmt:100,qsize:18,qsim:false,qtol:14,qtop:false,qpts:false,target:'auto'};
let bar=null,hov=null,hovKey='',ctrlDown=false,altDown=false,shiftDown=false;
const dist=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
const hex=c=>String(c||'ffffff').replace('#','').toLowerCase().padStart(6,'0').slice(-6);
const labOf=c=>SmartVec.lab(hex(c)),dEc=(a,b)=>SmartVec.dE(labOf(a),labOf(b));
const eachItem=fn=>S.layers.forEach(l=>{if(!l.vis||l.lock)return;l.items.forEach(it=>fn(it,l))});
const BB=new WeakMap();
function bboxOf(it){if(it.k==='s'){const h=it.w/2;return[Math.min(it.a[0],it.b[0])-h,Math.min(it.a[1],it.b[1])-h,Math.max(it.a[0],it.b[0])+h,Math.max(it.a[1],it.b[1])+h]}
 const sg=segsOf(it);let r=BB.get(sg);if(r)return r;let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;sg.forEach(q=>{const h=q.w/2;x0=Math.min(x0,q.a[0]-h,q.b[0]-h);x1=Math.max(x1,q.a[0]+h,q.b[0]+h);y0=Math.min(y0,q.a[1]-h,q.b[1]-h);y1=Math.max(y1,q.a[1]+h,q.b[1]+h)});r=[x0,y0,x1,y1];BB.set(sg,r);return r}
const itemColor=it=>it.k==='s'?it.c:(it.c||(it.pal&&it.pal[0]&&it.pal[0].c)||'ffffff');
function inPoly(P,x,y){let c=false;for(let i=0,j=P.length-1;i<P.length;j=i++){const a=P[i],b=P[j];if((a[1]>y)!==(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])c=!c}return c}
const selAdd=it=>{const g=grpLayer(it);(g?g.items:[it]).forEach(x=>{if(x.k==='h')S.sel.items.add(x);else{S.sel.pts.add(x.a);S.sel.pts.add(x.b)}})};
const selDel=it=>{const g=grpLayer(it);(g?g.items:[it]).forEach(x=>{if(x.k==='h')S.sel.items.delete(x);else{S.sel.pts.delete(x.a);S.sel.pts.delete(x.b)}})};

const CUR={};
function cur(name,paths,hx,hy){if(CUR[name])return CUR[name];const body=paths.replace(/PW/g,'1.7'),svg=`<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round"><g stroke="#000" stroke-width="4.2" opacity=".85">${body}</g><g stroke="#fff" stroke-width="2">${body}</g></svg>`;
 return CUR[name]=`url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}") ${hx} ${hy}, crosshair`}
const curBucket=()=>cur('bucket','<path d="m19 11-8-8-8.6 8.6a2 2 0 0 0 0 2.8l5.2 5.2c.8.8 2 .8 2.8 0L19 11Z"/><path d="m5 2 5 5"/><path d="M2 13h15"/><path d="M22 20a2 2 0 1 1-4 0c0-1.6 1.7-2.4 2-4 .3 1.6 2 2.4 2 4Z"/>',2,13);
const curPipette=()=>cur('pipette','<path d="m2 22 1-1h3l9-9"/><path d="M3 21v-3l9-9"/><path d="m15 6 3.4-3.4a2.1 2.1 0 1 1 3 3L18 9l.4.4a2.1 2.1 0 1 1-3 3l-3.8-3.8a2.1 2.1 0 1 1 3-3l.4.4Z"/>',2,22);
const curBrush=()=>cur('pencil','<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/>',2,22);
function setCursor(){const t=S.tool;let c='default';
 if(S.mode!=='draw')c='default';
 else if(S.fdrop)c=curPipette();
 else if(t==='V')c=S.selTool==='lasso'?'crosshair':S.selTool==='qsel'?'none':'default';
 else if(t==='H')c='grab';
 else if(t==='K')c=ctrlDown?curPipette():curBucket();
 else if(t==='F')c=curBrush();
 else if(t==='J')c='crosshair';
 else c='crosshair';
 cv.style.cursor=c}
function toolChanged(t){if(S.fdrop)fdropSet(false);if(t!=='V'&&S.selTool){S.selTool=null;syncSelButtons()}renderBar();hov=null}

function syncSelButtons(){const l=document.getElementById('llasso'),q=document.getElementById('lqsel');if(l)l.classList.toggle('on',S.selTool==='lasso');if(q)q.classList.toggle('on',S.selTool==='qsel');setCursor()}
function field(label,html,title){return `<label class="topt-f" title="${title||''}"><span>${label}</span>${html}</label>`}
function renderBar(){if(!bar)return;const t=S.tool,mode=S.mode;let h='';
 if(mode!=='draw'){bar.hidden=true;return}
 if(t==='F'){h=field(ic('wand-sparkles',14)+'Suavidade',`<input type="range" id="to_sm" min="0" max="100" value="${O.smooth}"><b id="to_smv">${O.smooth}</b>`,'Quanto maior, mais o traço é alisado e simplificado (menos segmentos Bézier, curvas mais limpas). Quanto menor, mais fiel ao movimento da mão.')
  +field(ic('sparkles',14)+'Alto nível',`<input type="checkbox" class="switch" id="to_hq" ${O.hq?'checked':''}>`,'Lápis de alto nível: remove o tremor da mão sem perder os detalhes, ajusta o MENOR número de curvas Bézier possível (comprimento máximo por segmento, juntas suaves), refina cantos, e transforma círculos/elipses e retas desenhados à mão em formas exatas e limpas.')
  +field(ic('square',14)+'Cantos',`<input type="checkbox" class="switch" id="to_co" ${O.corners?'checked':''}>`,'Detecta cantos vivos (quinas) e os mantém pontudos dentro da MESMA curva (um só item, que aceita preenchimento), em vez de arredondar tudo.')
  +field(ic('circle',14)+'Fechar laço',`<input type="checkbox" class="switch" id="to_cl" ${O.close?'checked':''}>`,'Se o traço termina perto de onde começou, vira uma curva fechada (que aceita preenchimento).')}
 else if(t==='K'){h=field(ic('sliders-horizontal',14)+'Tolerância ΔE',`<input type="number" id="to_tol" min="0" max="100" step="1" value="${O.tol}">`,'Linhas com cor parecida com a da linha clicada (diferença ΔE em CIELAB até esse valor) também são pintadas. 0 = só cores idênticas.')
  +field(ic('layers',14)+'Escopo',`<select id="to_sc"><option value="conn">Linhas conectadas</option><option value="layer">Toda a camada</option><option value="all">Todas as camadas</option><option value="one">Só a linha clicada</option></select>`,'Quais linhas de cor parecida são pintadas. Em formas, objetos, texto e imagem o balde acerta o contorno OU o preenchimento, conforme o ponto clicado.')
  +field(ic('crosshair',14)+'Alvo',`<select id="to_tg"><option value="auto">Automático (o que clicar)</option><option value="o">Só contorno</option><option value="f">Só preenchimento</option><option value="b">Contorno + preenchimento</option></select>`,'O que o balde pinta em formas com contorno + preenchimento e nos escopos Toda a camada / Todas as camadas. Automático: perto da borda pinta o CONTORNO, no miolo pinta o PREENCHIMENTO. Segure Alt = contorno · Shift = preenchimento.')
  +field(ic('palette',14)+'Manter tonalidades',`<input type="checkbox" class="switch" id="to_kp" ${O.keep?'checked':''}>`,'Pinta as linhas parecidas PRESERVANDO as variações de tom: cada linha recebe a nova cor com a mesma diferença (claro/escuro/matiz) que tinha em relação à linha clicada. Use com tolerância alta.')
  +field('%',`<input type="number" id="to_ka" min="0" max="200" step="5" value="${O.keepAmt}" ${O.keep?'':'disabled'}>`,'Intensidade das variações de tom mantidas (100 = igual ao original, 0 = tudo da mesma cor).')
  +`<span class="topt-h">${ic('pipette',14)} Ctrl = conta-gotas · Alt = contorno · Shift = preenchimento</span>`}
 else if(t==='J'){h=PATHS.barHTML(field)}
 else if(t==='V'&&S.selTool==='qsel'){h=field(ic('circle-dot',14)+'Tamanho',`<input type="range" id="to_qs" min="4" max="160" value="${O.qsize}"><b id="to_qsv">${O.qsize}</b>`,'Raio do pincel de seleção (px do desenho).')
  +field(ic('palette',14)+'Só cor parecida',`<input type="checkbox" class="switch" id="to_qm" ${O.qsim?'checked':''}>`,'Seleciona só as linhas com cor parecida à da primeira linha tocada.')
  +field('ΔE',`<input type="number" id="to_qt" min="0" max="100" value="${O.qtol}">`,'Tolerância de cor da seleção rápida.')
  +field(ic('layers-top',14)+'Só linhas do topo',`<input type="checkbox" class="switch" id="to_qtop" ${O.qtop?'checked':''}>`,'Seleciona só o que está VISÍVEL sob o pincel (a linha que fica por cima). Passe por cima de um personagem sem pegar o cenário que está atrás dele.')
  +field(ic('dot-point',14)+'Só se tocar um ponto',`<input type="checkbox" class="switch" id="to_qpt" ${O.qpts?'checked':''}>`,'Seleciona a linha apenas se o pincel passar por um dos PONTOS dela (pontas de linhas, pontos de polilinhas/curvas), e não pelo corpo da linha.')
  +`<span class="topt-h">Shift soma · Alt subtrai</span>`}
 else if(t==='V'&&S.selTool==='lasso'){h=`<span class="topt-h">${ic('lasso',14)} Desenhe ao redor das linhas · Shift soma · Alt subtrai</span>`}
 bar.innerHTML=h;bar.hidden=!h;
 const g=id=>document.getElementById(id);
 if(t==='F'){g('to_sm').oninput=e=>{O.smooth=+e.target.value;g('to_smv').textContent=O.smooth};g('to_hq').onchange=e=>O.hq=e.target.checked;g('to_co').onchange=e=>O.corners=e.target.checked;g('to_cl').onchange=e=>O.close=e.target.checked}
 if(t==='K'){g('to_tol').oninput=e=>{O.tol=Math.max(0,Math.min(100,+e.target.value||0));hovKey=''};g('to_tg').value=O.target;g('to_tg').onchange=e=>{O.target=e.target.value;hovKey='';dirty=1};g('to_sc').value=O.scope;g('to_sc').onchange=e=>{O.scope=e.target.value;hovKey='';dirty=1};g('to_kp').onchange=e=>{O.keep=e.target.checked;g('to_ka').disabled=!O.keep};g('to_ka').oninput=e=>{O.keepAmt=Math.max(0,Math.min(200,+e.target.value||0))}}
 if(t==='J')PATHS.barBind();
 if(t==='V'&&S.selTool==='qsel'){g('to_qs').oninput=e=>{O.qsize=+e.target.value;g('to_qsv').textContent=O.qsize;dirty=1};g('to_qm').onchange=e=>O.qsim=e.target.checked;g('to_qt').oninput=e=>O.qtol=Math.max(0,+e.target.value||0);g('to_qtop').onchange=e=>O.qtop=e.target.checked;g('to_qpt').onchange=e=>O.qpts=e.target.checked}}

function lassoApply(P,add,sub){let n=0;const xs=P.map(p=>p[0]),ys=P.map(p=>p[1]),x0=Math.min(...xs),x1=Math.max(...xs),y0=Math.min(...ys),y1=Math.max(...ys);
 eachItem(it=>{const b=bboxOf(it);if(b[2]<x0||b[0]>x1||b[3]<y0||b[1]>y1)return;let hit=false;
  if(it.k==='s'){let c=0;if(inPoly(P,it.a[0],it.a[1]))c++;if(inPoly(P,it.b[0],it.b[1]))c++;if(inPoly(P,(it.a[0]+it.b[0])/2,(it.a[1]+it.b[1])/2))c++;hit=c>=2}
  else{const sg=segsOf(it);if(!sg.length)return;let c=0;for(const q of sg)if(inPoly(P,(q.a[0]+q.b[0])/2,(q.a[1]+q.b[1])/2))c++;hit=c>=sg.length*.5}
  if(hit){(sub?selDel:selAdd)(it);n++}});return n}

function itemPoints(it){if(it.k==='s')return[it.a,it.b];
 if(it.pts&&'PSNQB'.includes(it.t)){if(it.t==='Q')return it.pts.filter((_,i)=>i%3===0);if(it.t==='B')return[it.pts[0],it.pts[3]].filter(Boolean);if(it.t==='N')return[it.pts[0],it.pts[it.pts.length-1]];return it.pts}return null}
function nearPoint(it,p,R){const P=itemPoints(it);if(P)return P.some(q=>dist(p,q)<=R+(it.k==='s'?it.w/2:0));for(const s of segsOf(it)){if(dist(p,s.a)<=R||dist(p,s.b)<=R)return true}return false}
let pkc=null,pkx=null;
function pickVisible(p,cands){const R=O.qsize,s=Math.max(1,Math.min(2,200/R)),N=Math.max(8,Math.ceil(2*R*s));
 if(!pkc){pkc=document.createElement('canvas');pkx=pkc.getContext('2d',{willReadFrequently:true})}
 if(pkc.width!==N||pkc.height!==N){pkc.width=N;pkc.height=N}
 pkx.setTransform(1,0,0,1,0,0);pkx.clearRect(0,0,N,N);pkx.setTransform(s,0,0,s,-(p[0]-R)*s,-(p[1]-R)*s);pkx.lineCap='round';pkx.globalAlpha=1;
 const order=cands.slice().sort((a,b)=>a.li-b.li||a.ii-b.ii),codeOf=i=>((i+1)*0x9E3779B1)&0xFFFFFF,byCode=new Map();
 order.forEach((c,i)=>byCode.set(codeOf(i),c.it));
 for(let fg=0;fg<2;fg++)order.forEach((c,i)=>{const k=codeOf(i);pkx.strokeStyle='rgb('+(k&255)+','+((k>>8)&255)+','+((k>>16)&255)+')';
  const sg=c.it.k==='s'?[c.it]:segsOf(c.it);for(const q of sg){if((q.fg|0)!==fg)continue;if(segDist(p,q.a,q.b)>R+q.w/2+1)continue;pkx.lineWidth=Math.max(q.w,1.5/s);pkx.beginPath();pkx.moveTo(q.a[0],q.a[1]);pkx.lineTo(q.b[0],q.b[1]);pkx.stroke()}});
 const d=pkx.getImageData(0,0,N,N).data,seen=new Set(),h=N/2,r2=R*s*R*s;
 for(let y=0;y<N;y++)for(let x=0;x<N;x++){const k=(y*N+x)*4;if(d[k+3]!==255)continue;const dx=x+.5-h,dy=y+.5-h;if(dx*dx+dy*dy>r2)continue;const it=byCode.get(d[k]|(d[k+1]<<8)|(d[k+2]<<16));if(it)seen.add(it)}
 return seen}
function qselAt(p,sub,ctx){const R=O.qsize;let n=0;const cands=[];
 S.layers.forEach((l,li)=>{if(!l.vis)return;l.items.forEach((it,ii)=>{const b=bboxOf(it);if(p[0]<b[0]-R||p[0]>b[2]+R||p[1]<b[1]-R||p[1]>b[3]+R)return;let body=false;
  if(it.k==='s')body=segDist(p,it.a,it.b)<=R+it.w/2;else for(const q of segsOf(it)){if(segDist(p,q.a,q.b)<=R+q.w/2){body=true;break}}
  if(body)cands.push({it,l,li,ii})})});
 if(!cands.length)return 0;let list=cands;
 if(O.qtop){const vis=pickVisible(p,cands);list=list.filter(c=>vis.has(c.it))}
 if(O.qpts)list=list.filter(c=>nearPoint(c.it,p,R));
 list.forEach(c=>{if(c.l.lock)return;const it=c.it;
  if(O.qsim&&!sub){if(ctx.seed===null)ctx.seed=itemColor(it);else if(dEc(ctx.seed,itemColor(it))>O.qtol)return}
  (sub?selDel:selAdd)(it);ctx.n++;n++;ctx.layer=c.l});return n}

const vsub=(a,b)=>[a[0]-b[0],a[1]-b[1]],vadd=(a,b)=>[a[0]+b[0],a[1]+b[1]],vmul=(a,s)=>[a[0]*s,a[1]*s],vdot=(a,b)=>a[0]*b[0]+a[1]*b[1],vnorm=a=>{const l=Math.hypot(a[0],a[1])||1;return[a[0]/l,a[1]/l]};
function smoothPts(P,passes,closed){for(let k=0;k<passes;k++){const n=P.length,Q=P.map(p=>p.slice());for(let i=0;i<n;i++){if(!closed&&(i===0||i===n-1))continue;const a=P[(i-1+n)%n],b=P[i],c=P[(i+1)%n];Q[i]=[(a[0]+2*b[0]+c[0])/4,(a[1]+2*b[1]+c[1])/4]}P=Q}return P}
function resample(P,d){const out=[P[0].slice()];let a=P[0],acc=0;
 for(let i=1;i<P.length;i++){const b=P[i];let seg=dist(a,b);while(seg>0&&acc+seg>=d){const t=(d-acc)/seg,p=[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];out.push(p);a=p;seg=dist(a,b);acc=0}acc+=seg;a=b}
 const L=P[P.length-1];if(out.length>1&&dist(out[out.length-1],L)<d*.4)out[out.length-1]=L.slice();else out.push(L.slice());return out}
const polyLen=P=>{let s=0;for(let i=1;i<P.length;i++)s+=dist(P[i-1],P[i]);return s};
function bezAt(c,t){const u=1-t;return[0,1].map(k=>c[0][k]*u*u*u+3*c[1][k]*u*u*t+3*c[2][k]*u*t*t+c[3][k]*t*t*t)}
function bezD1(c,t){const u=1-t;return[0,1].map(k=>3*u*u*(c[1][k]-c[0][k])+6*u*t*(c[2][k]-c[1][k])+3*t*t*(c[3][k]-c[2][k]))}
function bezD2(c,t){const u=1-t;return[0,1].map(k=>6*u*(c[2][k]-2*c[1][k]+c[0][k])+6*t*(c[3][k]-2*c[2][k]+c[1][k]))}
function chordParam(P){const u=[0];for(let i=1;i<P.length;i++)u.push(u[i-1]+dist(P[i],P[i-1]));const L=u[u.length-1]||1;return u.map(v=>v/L)}
function genBezier(P,u,t1,t2){const p0=P[0],p3=P[P.length-1];let C00=0,C01=0,C11=0,X0=0,X1=0;
 for(let i=0;i<P.length;i++){const t=u[i],b=1-t,B0=b*b*b,B1=3*b*b*t,B2=3*b*t*t,B3=t*t*t,A1=vmul(t1,B1),A2=vmul(t2,B2);
  C00+=vdot(A1,A1);C01+=vdot(A1,A2);C11+=vdot(A2,A2);const tmp=vsub(P[i],vadd(vmul(p0,B0+B1),vmul(p3,B2+B3)));X0+=vdot(A1,tmp);X1+=vdot(A2,tmp)}
 const det=C00*C11-C01*C01,seg=dist(p0,p3);let a1=0,a2=0;if(Math.abs(det)>1e-12){a1=(X0*C11-X1*C01)/det;a2=(C00*X1-C01*X0)/det}
 if(!isFinite(a1)||!isFinite(a2)||a1<1e-6*seg||a2<1e-6*seg||a1>seg*2.5||a2>seg*2.5){a1=a2=seg/3}
 return[p0,vadd(p0,vmul(t1,a1)),vadd(p3,vmul(t2,a2)),p3]}
function reparam(c,P,u){return u.map((t,i)=>{const d=vsub(bezAt(c,t),P[i]),d1=bezD1(c,t),d2=bezD2(c,t),num=vdot(d,d1),den=vdot(d1,d1)+vdot(d,d2);return Math.abs(den)<1e-12?t:Math.max(0,Math.min(1,t-num/den))})}
function maxErr(c,P,u){let m=0,at=Math.floor(P.length/2);for(let i=1;i<P.length-1;i++){const d=dist(bezAt(c,u[i]),P[i]);if(d>=m){m=d;at=i}}return{m,at}}
function fitCubic(P,t1,t2,err,out,depth){
 if(P.length===2){const d=dist(P[0],P[1])/3;out.push([P[0],vadd(P[0],vmul(t1,d)),vadd(P[1],vmul(t2,d)),P[1]]);return}
 let u=chordParam(P),c=genBezier(P,u,t1,t2),e=maxErr(c,P,u);if(e.m<err){out.push(c);return}
 if(e.m<err*8){for(let k=0;k<6;k++){u=reparam(c,P,u);c=genBezier(P,u,t1,t2);e=maxErr(c,P,u);if(e.m<err){out.push(c);return}}}
 if(depth>30||P.length<4){out.push(c);return}
 const sp=Math.max(1,Math.min(P.length-2,e.at)),tc=vnorm(vsub(P[sp-1],P[sp+1]));
 fitCubic(P.slice(0,sp+1),t1,tc,err,out,depth+1);fitCubic(P.slice(sp),vmul(tc,-1),t2,err,out,depth+1)}
function devToChord(R){const a=R[0],b=R[R.length-1],dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy);let m=0;for(const p of R){const d=L<1e-9?dist(p,a):Math.abs((p[0]-a[0])*dy-(p[1]-a[1])*dx)/L;if(d>m)m=d}return m}
function fitRun(R,err,t1,t2){if(R.length<2)return[];
 if(devToChord(R)<=err*.7){const a=R[0],b=R[R.length-1];return[[a,[a[0]+(b[0]-a[0])/3,a[1]+(b[1]-a[1])/3],[a[0]+(b[0]-a[0])*2/3,a[1]+(b[1]-a[1])*2/3],b]]}
 const k=Math.max(1,Math.min(4,Math.floor(R.length/4))),T1=t1||vnorm(vsub(R[k],R[0])),T2=t2||vnorm(vsub(R[R.length-1-k],R[R.length-1])),out=[];fitCubic(R,T1,T2,err,out,0);return out}
function tanAt(D,j,k){const n=D.length;return vnorm(vsub(D[Math.min(n-1,j+k)],D[Math.max(0,j-k)]))}
function fitOne(R,t1,t2,err){const u0=chordParam(R);let u=u0,c=genBezier(R,u,t1,t2),e=maxErr(c,R,u);for(let k=0;k<5&&e.m>=err;k++){u=reparam(c,R,u);c=genBezier(R,u,t1,t2);e=maxErr(c,R,u)}return{c,e:e.m}}
function fitGreedy(D,err,T1,T2){const n=D.length,cubs=[];if(n<2)return cubs;
 if(devToChord(D)<=err*.6){const a=D[0],b=D[n-1];return[[a,[a[0]+(b[0]-a[0])/3,a[1]+(b[1]-a[1])/3],[a[0]+(b[0]-a[0])*2/3,a[1]+(b[1]-a[1])*2/3],b]]}
 const kk=Math.max(1,Math.min(4,Math.floor(n/5)));let i=0,tin=T1||tanAt(D,0,kk);
 while(i<n-1){const mk=j=>{const tout=(j===n-1)?(T2||vmul(tanAt(D,j,kk),-1)):vmul(tanAt(D,j,kk),-1);const R=D.slice(i,j+1);if(R.length<3){const d=dist(R[0],R[R.length-1])/3;return{c:[R[0],vadd(R[0],vmul(tin,d)),vadd(R[R.length-1],vmul(tout,d)),R[R.length-1]],e:0,tout}}const f=fitOne(R,tin,tout,err);f.tout=tout;return f};
  let ok=Math.min(n-1,i+2),okf=mk(ok),step=4;
  while(ok<n-1){const j=Math.min(n-1,ok+step),f=mk(j);if(f.e<err){ok=j;okf=f;step*=2}else{let lo=ok,hi=j;while(hi-lo>1){const m=(lo+hi)>>1,g=mk(m);if(g.e<err){lo=m;okf=g}else hi=m}ok=lo;if(lo===j)okf=f;break}}
  if(okf.e>=err&&ok>i+2){ok=i+2;okf=mk(ok)}
  cubs.push(okf.c);tin=vmul(okf.tout,-1);i=ok}
 return cubs}
function ellipseSnap(D){const n=D.length;let cx=0,cy=0;D.forEach(p=>{cx+=p[0];cy+=p[1]});cx/=n;cy/=n;let sxx=0,sxy=0,syy=0;D.forEach(p=>{const x=p[0]-cx,y=p[1]-cy;sxx+=x*x;sxy+=x*y;syy+=y*y});sxx/=n;sxy/=n;syy/=n;
 const tr=sxx+syy,dt=Math.sqrt(Math.max(0,(sxx-syy)*(sxx-syy)/4+sxy*sxy)),l1=tr/2+dt,l2=tr/2-dt;if(l2<=1e-6)return null;const th=.5*Math.atan2(2*sxy,sxx-syy),ca=Math.cos(th),sa=Math.sin(th),a=Math.sqrt(2*l1),b=Math.sqrt(2*l2);
 if(a/b>6)return null;let m=0,s2=0;D.forEach(p=>{const x=p[0]-cx,y=p[1]-cy,X=(x*ca+y*sa)/a,Y=(-x*sa+y*ca)/b,r=Math.hypot(X,Y);m+=Math.abs(r-1);s2+=(r-1)*(r-1)});if(Math.sqrt(s2/n)>.075||m/n>.06)return null;
 const k=.5522847498,P=(X,Y)=>[cx+X*ca-Y*sa,cy+X*sa+Y*ca],q=[[a,0],[a,b*k],[a*k,b],[0,b],[-a*k,b],[-a,b*k],[-a,0],[-a,-b*k],[-a*k,-b],[0,-b],[a*k,-b],[a,-b*k],[a,0]].map(v=>P(v[0]*1,v[1]*1));
 const c=[];for(let i=0;i<4;i++)c.push([q[i*3],q[i*3+1],q[i*3+2],q[i*3+3]]);return c}
function chainOf(cubs){const ch=[];cubs.forEach((c,i)=>{if(i===0)ch.push(c[0]);ch.push(c[1],c[2],c[3])});return ch}
function brushFinish(raw){
 const l=L();if(!l||l.lock||!l.vis){hint('Camada oculta ou travada');return}
 const z=S.view.z;let P=[raw[0]];for(let i=1;i<raw.length;i++)if(dist(P[P.length-1],raw[i])>=.4/z)P.push(raw[i]);
 const len0=polyLen(P);if(P.length<2||len0<3/z)return;
 const sm=O.smooth/100,hq=!!O.hq,err=hq?Math.max(.38,(.5+sm*2.4)/z):Math.max(.45,(.7+sm*3.2)/z),step=Math.max(1,(hq?1.5:2)/z);
 let D=resample(P,step);D=smoothPts(D,hq?3+Math.round(sm*8):2+Math.round(sm*10),false);if(D.length<2)return;
 D[0]=P[0].slice();D[D.length-1]=P[P.length-1].slice(); 
 const len=polyLen(D);let closed=false;
 if(O.close&&len>24/z&&dist(D[0],D[D.length-1])<=Math.max(8/z,(hq?.16:.12)*len)){closed=true;D=D.slice();D[D.length-1]=D[0].slice()}
 let corners=[];
 if(O.corners&&D.length>14){const Ds=smoothPts(D,3,false),k=6,ang=[];
  for(let i=k;i<Ds.length-k;i++){const a=[Ds[i][0]-Ds[i-k][0],Ds[i][1]-Ds[i-k][1]],b=[Ds[i+k][0]-Ds[i][0],Ds[i+k][1]-Ds[i][1]],la=Math.hypot(...a),lb=Math.hypot(...b);if(la<1e-6||lb<1e-6){ang.push(0);continue}
   ang.push(Math.acos(Math.max(-1,Math.min(1,(a[0]*b[0]+a[1]*b[1])/(la*lb)))))}
  const th=(62-sm*14)*Math.PI/180;
  for(let i=0;i<ang.length;i++){if(ang[i]<th)continue;let ok=true;for(let j=Math.max(0,i-k);j<=Math.min(ang.length-1,i+k);j++)if(ang[j]>ang[i]||(ang[j]===ang[i]&&j<i)){ok=false;break}if(ok)corners.push(i+k)}
  corners=corners.filter(c=>c>=4&&c<=D.length-5)}
 let cubs=[];const FR=hq?fitGreedy:fitRun;
 if(!corners.length){
  if(closed){const k=Math.max(1,Math.min(4,Math.floor(D.length/6))),t1=vnorm(vsub(D[k],D[D.length-1-k]));cubs=hq&&ellipseSnap(D.slice(0,-1))||FR(D,err,t1,vmul(t1,-1))}
  else cubs=FR(D,err)}
 else{let cs=corners.slice();
  if(closed){const f=cs[0];D=D.slice(f,D.length-1).concat(D.slice(0,f+1));cs=cs.map(c=>(c-f+(D.length-1))%(D.length-1)).sort((a,b)=>a-b);cs=cs.filter(c=>c>0);cs.unshift(0);cs.push(D.length-1)}
  else{cs.unshift(0);cs.push(D.length-1)}
  for(let i=0;i<cs.length-1;i++){if(cs[i+1]-cs[i]<2)continue;cubs=cubs.concat(FR(D.slice(cs[i],cs[i+1]+1),err))}}
 if(!cubs.length)return;
 if(!closed&&cubs.length===1&&devToChord(D)<=err*.7){const it=addFree(D[0],D[D.length-1]);if(it){selClear();selAdd(it);commit();toast('Lápis: reta')}return}
 let ch=chainOf(cubs);if(closed){ch=ch.slice(0,ch.length-1)} 
 ch=ch.map(p=>[R2(p[0]),R2(p[1])]);
 if(ch.length<4)return;
 const it=mkShape('Q',{pts:ch,o:{...readOpts(),closed}});if(!it)return;
 selClear();selAdd(it);commit();toast('Lápis: '+cubs.length+(cubs.length===1?' segmento Bézier':' segmentos Bézier')+(closed?' · curva fechada':''))}

function nearestSeg(it,w){let best=null,bd=1e9;for(const s of segsOf(it)){const d=segDist(w,s.a,s.b)-s.w/2;if(d<bd){bd=d;best=s}}return best}
function outlineOnly(it){return G.shapeSegs({...it,o:{...it.o,mode:'o'}})}
function ringOf(it){const sg=outlineOnly(it);return sg.map(s=>s.a)}
const gradOn=it=>!!(it.o&&it.o.fcOn&&it.o.gm==='g'&&Array.isArray(it.o.gs)&&it.o.gs.length>=2);
const gradStops=it=>it.o.gs.map((x,i)=>({part:'g',gi:i,color:hex(x.c),kind:'f'}));
function gradPick(it,w){let best=null,bd=1e9;try{for(const s of G.shapeSegs({...it,o:{...it.o,mode:'f'}})){const d=segDist(w,s.a,s.b);if(d<bd){bd=d;best=s}}}catch(e){}
 const gs=it.o.gs;if(!best)return 0;const c=labOf(hex(best.c));let bi=0,bv=1e9;gs.forEach((x,i)=>{const v=SmartVec.dE(c,labOf(hex(x.c)));if(v<bv){bv=v;bi=i}});return bi}
const fillable=it=>it.k==='h'&&it.o&&('RE'.includes(it.t)||('PBSNQ'.includes(it.t)&&it.o.closed))&&(it.o.mode||'o')!=='o';
function fillHit(w){for(let li=S.layers.length-1;li>=0;li--){const l=S.layers[li];if(!l.vis||l.lock)continue;for(let i=l.items.length-1;i>=0;i--){const it=l.items[i];if(!fillable(it))continue;const b=bboxOf(it);if(w[0]<b[0]||w[0]>b[2]||w[1]<b[1]||w[1]>b[3])continue;const r=ringOf(it);if(r.length>=3&&inPoly(r,w[0],w[1]))return{it,l}}}return null}
const tgtMode=()=>altDown?'o':shiftDown?'f':O.target;
const ocW=it=>{const o=it.o||{};return o.mode==='b'&&o.ocOn?(o.ow||it.w):it.w};
function partAt(w){let h=hitItem(w);const f=fillHit(w);
 if(f&&(!h||S.layers.indexOf(f.l)>S.layers.indexOf(h.l)||(f.l===h.l&&f.l.items.indexOf(f.it)>f.l.items.indexOf(h.it))))h=f;
 if(!h)return null;const it=h.it;
 if(it.k==='s')return{it,l:h.l,part:'s',color:it.c};
 if(it.t==='I'){const s=nearestSeg(it,w);return{it,l:h.l,part:'I',color:s?s.c:itemColor(it)}}
 if(it.t==='T'){const s=nearestSeg(it,w),tx=it.tx||{},oc=hex(tx.oc),fc=hex(tx.fc||it.c),sc=s?hex(s.c):fc,isO=sc===oc&&sc!==fc;return{it,l:h.l,part:isO?'to':'tf',color:isO?tx.oc:(tx.fc||it.c)}}
 const o=it.o||{},mode=o.mode||'o',T=tgtMode();
 const oP=()=>({it,l:h.l,part:'o',color:mode==='b'&&o.ocOn?o.oc:it.c}),fP=()=>{if(gradOn(it)){const gi=gradPick(it,w);return{it,l:h.l,part:'g',gi,color:hex(it.o.gs[gi].c)}}return{it,l:h.l,part:'f',color:o.fcOn?o.fc:it.c}};
 if(mode==='o'||!fillable(it))return oP();
 if(mode==='f')return fP();
 if(T==='o')return oP();if(T==='f')return fP();
 const tolW=Math.max(ocW(it)/2,7/S.view.z)+.5;
 for(const s of outlineOnly(it)){if(segDist(w,s.a,s.b)<=tolW)return oP()}
 return fP()}
function lineGroup(seed,l){const tol=O.tol,c0=labOf(seed.c),ok=it=>it.k==='s'&&SmartVec.dE(c0,labOf(it.c))<=tol;
 if(O.scope==='one')return[seed];
 const pool=[];(O.scope==='all'?S.layers.filter(x=>x.vis&&!x.lock):[l]).forEach(L2=>{if(!L2||L2.lock||!L2.vis)return;L2.items.forEach(it=>{if(ok(it))pool.push(it)})});
 if(O.scope==='layer'||O.scope==='all')return pool;
 const cs=24,grid=new Map(),cells=it=>{const m=it.w/2+1,x0=Math.floor((Math.min(it.a[0],it.b[0])-m)/cs),x1=Math.floor((Math.max(it.a[0],it.b[0])+m)/cs),y0=Math.floor((Math.min(it.a[1],it.b[1])-m)/cs),y1=Math.floor((Math.max(it.a[1],it.b[1])+m)/cs);const r=[];if((x1-x0+1)*(y1-y0+1)>400)return null;for(let x=x0;x<=x1;x++)for(let y=y0;y<=y1;y++)r.push(x*100003+y);return r},big=[];
 pool.forEach((it,i)=>{const cc=cells(it);if(!cc){big.push(i);return}cc.forEach(k=>{let a=grid.get(k);if(!a)grid.set(k,a=[]);a.push(i)})});
 const touch=(a,b)=>ssDist(a.a,a.b,b.a,b.b)<=(a.w+b.w)/2+1,start=pool.indexOf(seed);if(start<0)return[seed];
 const seen=new Uint8Array(pool.length),q=[start];seen[start]=1;const out=[];
 while(q.length){const i=q.pop(),it=pool[i];out.push(it);const cc=cells(it);const cand=new Set(big);if(cc)cc.forEach(k=>(grid.get(k)||[]).forEach(j=>cand.add(j)));else pool.forEach((_,j)=>cand.add(j));
  cand.forEach(j=>{if(seen[j])return;if(touch(it,pool[j])){seen[j]=1;q.push(j)}})}
 return out}
function rgb2lab(h){const r=parseInt(h.substr(0,2),16)/255,g=parseInt(h.substr(2,2),16)/255,b=parseInt(h.substr(4,2),16)/255,lin=c=>c<=.04045?c/12.92:Math.pow((c+.055)/1.055,2.4),R=lin(r),G=lin(g),B=lin(b),
 X=(R*.4124564+G*.3575761+B*.1804375)/.95047,Y=R*.2126729+G*.7151522+B*.072175,Z=(R*.0193339+G*.119192+B*.9503041)/1.08883,f=t=>t>216/24389?Math.cbrt(t):(24389/27*t+16)/116;return[116*f(Y)-16,500*(f(X)-f(Y)),200*(f(Y)-f(Z))]}
function lab2hex(L,a,b){const fy=(L+16)/116,fx=fy+a/500,fz=fy-b/200,fi=t=>t>6/29?t*t*t:3*(6/29)*(6/29)*(t-4/29),X=fi(fx)*.95047,Y=fi(fy),Z=fi(fz)*1.08883,
 r=3.2404542*X-1.5371385*Y-.4985314*Z,g=-.969266*X+1.8760108*Y+.041556*Z,bb=.0556434*X-.2040259*Y+1.0572252*Z,gm=c=>{c=Math.max(0,Math.min(1,c));return c<=.0031308?12.92*c:1.055*Math.pow(c,1/2.4)-.055};
 return[r,g,bb].map(c=>Math.round(gm(c)*255).toString(16).padStart(2,'0')).join('')}
function tonedColor(ci,c0,cn){const a=hex(ci),b=hex(c0),n=hex(cn);if(a===b||!O.keep)return n;const k=O.keepAmt/100,A=rgb2lab(a),B=rgb2lab(b),C=rgb2lab(n);return lab2hex(C[0]+(A[0]-B[0])*k,C[1]+(A[1]-B[1])*k,C[2]+(A[2]-B[2])*k)}
function partsOf(it){
 if(it.k==='s')return[{part:'s',color:it.c,kind:'o'}];
 if(it.t==='I')return(it.pal||[]).map(e=>({part:'I',e,color:e.c,kind:'*'}));
 if(it.t==='T'){const tx=it.tx||{},r=[];if(tx.oc)r.push({part:'to',color:tx.oc,kind:'o'});const f=tx.fc||it.c;if(f)r.push({part:'tf',color:f,kind:'f'});return r}
 if(!it.o||!'PBSNQRE'.includes(it.t))return[];
 const o=it.o,mode=o.mode||'o';
 if(mode==='o'||!fillable(it))return[{part:'o',color:it.c,kind:'o'}];
 if(mode==='f')return gradOn(it)?gradStops(it):[{part:'f',color:o.fcOn?o.fc:it.c,kind:'f'}];
 return[{part:'o',color:o.ocOn?o.oc:it.c,kind:'o'},...(gradOn(it)?gradStops(it):[{part:'f',color:o.fcOn?o.fc:it.c,kind:'f'}])]}
function setPart(q,col){const it=q.it,part=q.part,o=it.o||{},mode=o.mode||'o';
 if(part==='s'){it.c=col;return}
 if(part==='g'){if(gradOn(it)&&o.gs[q.gi]){o.gs=o.gs.map((x,i)=>i===q.gi?{...x,c:col}:x);touch(it)}return}
 if(part==='I'){q.e.c=col;touch(it);return}
 if(part==='to'){it.tx.oc=col;touch(it);return}
 if(part==='tf'){it.tx.fc=col;touch(it);return}
 if(part==='o'){if(mode==='o'||!o.closed&&!'RE'.includes(it.t))it.c=col;else if(mode==='b'){if(o.ocOn)o.oc=col;else{o.ocOn=true;o.oc=col;o.ow=it.w}}else it.c=col;touch(it);return}
 if(part==='f'){if(o.fcOn){o.fc=col;if(o.gm==='g')o.gm='s'}else if(mode==='b'){o.fcOn=true;o.fc=col;o.fw=it.w}else it.c=col;touch(it)}}
function targets(p){const seed=labOf(p.color),tol=O.tol,sc=O.scope,same=q=>SmartVec.dE(seed,labOf(q.color))<=tol;
 if(p.part==='s'&&(sc==='conn'||sc==='one'))return lineGroup(p.it,p.l).map(x=>({it:x,part:'s',color:x.c}));
 if(sc==='one'||sc==='conn'){if(p.part==='I')return partsOf(p.it).filter(same).map(q=>({it:p.it,...q}));return[{it:p.it,part:p.part,gi:p.gi,color:p.color}]}
 const T=tgtMode(),sk=(p.part==='s'||p.part==='o'||p.part==='to')?'o':p.part==='I'?'*':'f',want=T==='auto'?sk:T==='b'?'*':T;
 const out=[],layers=sc==='all'?S.layers.filter(x=>x.vis&&!x.lock):[p.l];
 layers.forEach(L2=>{if(!L2||L2.lock||!L2.vis)return;L2.items.forEach(it=>{for(const q of partsOf(it)){if(!(q.kind==='*'||want==='*'||q.kind===want))continue;if(same(q))out.push({it,...q})}})});
 if(!out.some(x=>x.it===p.it&&x.part===p.part&&x.gi===p.gi))out.unshift({it:p.it,part:p.part,gi:p.gi,color:p.color});
 return out}
function applyPaint(p,col){const list=targets(p),c0=p.color;
 const per=new Map();list.forEach(q=>{let a=per.get(q.it);if(!a)per.set(q.it,a=[]);a.push(q)});
 let n=0;per.forEach((qs,it)=>{const o=it.o;
  if(it.k==='h'&&o&&(o.mode||'o')==='b'&&qs.length===2&&qs[0].part!==qs[1].part&&!o.ocOn&&!o.fcOn&&'PBSNQRE'.includes(it.t)){it.c=tonedColor(it.c,c0,col);touch(it);n+=2;return}
  qs.forEach(q=>{setPart(q,tonedColor(q.color,c0,col));n++})});
 return n}
const PN={g:'Cor do degradê',s:'Linha',o:'Contorno',f:'Preenchimento',to:'Contorno do texto',tf:'Preenchimento do texto',I:'Cor da imagem'};
function previewOf(p){const k=(p.it.id||0)+'|'+(p.it.a?p.it.a.join(','):'')+'|'+p.part+'|'+(p.gi===undefined?'':p.gi)+'|'+p.color+'|'+O.scope+'|'+O.tol+'|'+tgtMode()+'|'+rev;
 if(k===hovKey&&hov)return hov.pv;hovKey=k;
 const lines=[],polys=[];let cnt=0;
 for(const q of targets(p)){if(cnt++>1500)break;const it=q.it;
  if(q.part==='s'){lines.push([it.a,it.b])}
  else if(q.part==='o'&&it.k==='h'){const sg=outlineOnly(it);for(const s of sg)lines.push([s.a,s.b])}
  else if(q.part==='f'||q.part==='g'){const r=ringOf(it);if(r.length>=3)polys.push(r)}
  else if(q.part==='to'||q.part==='tf'){const hc=hex(q.color);for(const s of segsOf(it))if(hex(s.c)===hc)lines.push([s.a,s.b])}
  else if(q.part==='I'){const hc=hex(q.color);for(const s of segsOf(it))if(hex(s.c)===hc)lines.push([s.a,s.b])}}
 hov={pv:{lines,polys},p};return hov.pv}

const FD_SKIP=new Set(['n','rr','closed']);
function fdropSet(on){S.fdrop=!!on;const b=document.getElementById('o_drop');if(b)b.classList.toggle('on',S.fdrop);setCursor();if(S.fdrop)toast('Conta-gotas: clique numa forma para copiar (Shift mantém ativo · Esc cancela)');dirty=1}
function fdropPick(raw,keep){const p=partAt(raw);if(!p||p.it.k!=='h'||!p.it.o||p.it.t==='I'||p.it.t==='T'){toast('Clique numa forma (polilinha, curva, círculo, elipse, retângulo…)');return}
 const src=p.it,fire=(id,ev)=>document.getElementById(id).dispatchEvent(new Event(ev||'input'));
 OF.forEach(([k,id,t])=>{if(FD_SKIP.has(k))return;const v=src.o[k]===undefined?DEFO[k]:src.o[k],e=document.getElementById(id);if(t==='b')e.checked=!!v;else if(t==='c')e.value='#'+v;else if(t==='j')e.value=v?JSON.stringify(v):'';else e.value=v;fire(id)});
 if(typeof gradUI==='function')gradUI();
 let st='';const ck=document.getElementById('o_dropst');
 if(ck&&ck.checked){[['col',src.c,'c'],['wid',src.w,'w'],['alp',src.al,'a'],['fg',src.fg,'f']].forEach(([id,v,t])=>{if(v===undefined||v===null)return;const e=document.getElementById(id);if(!e)return;e.value=t==='c'?'#'+String(v).replace('#',''):v;fire(id)});st=' + estilo'}
 fire('o_mode','change');const o=src.o,mn={o:'só contorno',f:'só preenchimento',b:'contorno + preenchimento'}[o.mode||'o']||'';
 const n=[...S.sel.items].filter(it=>it.o&&it!==src).length;toast('Forma copiada ('+mn+st+')'+(n?' → '+n+' selecionada'+(n>1?'s':''):' → próximas formas'));
 if(!keep)fdropSet(false)}
function down(e,w,raw){if(S.mode!=='draw'||S.place)return false;const t=S.tool;
 if(S.fdrop){if(e.button===0)fdropPick(raw,e.shiftKey);return true}
 if(t==='J')return PATHS.down(e,w,raw);
 if(t==='F'){const l=L();if(!l||l.lock||!l.vis){hint('Camada oculta ou travada');return true}const m0=magOn(e)?magnetAt(raw,null):null;S.drag={t2:'brush',pts:[(m0||raw).slice()]};S.cur2=raw;return true}
 if(t==='K'){altDown=e.altKey;shiftDown=e.shiftKey;const p=partAt(raw);
  if(e.ctrlKey||e.metaKey){if(!p){toast('Nada sob o cursor');return true}const c=hex(p.color);document.getElementById('col').value='#'+c;toast('Cor copiada: #'+c);return true}
  if(!p){toast('Clique sobre uma linha, contorno ou preenchimento');return true}
  const col=hex(document.getElementById('col').value),n=applyPaint(p,col);if(n){commit();toast(n>1?n+' elementos pintados'+(O.keep?' (tonalidades mantidas)':''):PN[p.part]+' pintado')}return true}
 if(t==='V'&&S.selTool){
  if(S.sel.items.size||S.sel.pts.size){ 
   const f=S.showFrame?frame():null;if(f&&frameHit(f,raw))return false;const h=hitItem(raw);if(h&&(h.it.k==='h'?S.sel.items.has(h.it):(S.sel.pts.has(h.it.a)&&S.sel.pts.has(h.it.b)))&&!e.shiftKey&&!e.altKey)return false}
  const sub=e.altKey,add=e.shiftKey||sub;if(!add){selClear();ui(1)}
  if(S.selTool==='lasso')S.drag={t2:'lasso',P:[raw.slice()],sub};
  else{const ctx={seed:null,n:0,layer:null};S.drag={t2:'qsel',sub,ctx,trail:[raw.slice()]};qselAt(raw,sub,ctx)}
  return true}
 return false}
function move(e,d,raw,w){
 if(d.t2==='brush'){const ev=(e.getCoalescedEvents&&e.getCoalescedEvents())||[];const list=ev.length?ev:[e];list.forEach(x=>{const q=toW(x,false);if(dist(d.pts[d.pts.length-1],q)>=.3)d.pts.push(q)});S.cur2=raw}
 else if(d.t2==='knife')PATHS.move(e,d,raw,w);
 else if(d.t2==='lasso'){const L2=d.P[d.P.length-1];if(dist(L2,raw)>=2/S.view.z)d.P.push(raw.slice())}
 else if(d.t2==='qsel'){const last=d.trail[d.trail.length-1],step=Math.max(2,O.qsize*.35)/1;const n=Math.ceil(dist(last,raw)/step);for(let i=1;i<=n;i++){const q=[last[0]+(raw[0]-last[0])*i/n,last[1]+(raw[1]-last[1])*i/n];qselAt(q,d.sub,d.ctx)}d.trail.push(raw.slice());if(d.trail.length>400)d.trail.splice(0,200);ui(1)}
 dirty=1}
function up(e,d,raw,w){
 if(d.t2==='brush'){const m1=magOn(e)?magnetAt(raw,null):null;if(m1)d.pts.push(m1.slice());brushFinish(d.pts)}
 else if(d.t2==='knife')PATHS.up(e,d,raw,w);
 else if(d.t2==='lasso'){if(d.P.length>=3){const n=lassoApply(d.P,!d.sub,d.sub);ui(1);toast(n?(d.sub?n+' removidos da seleção':n+' selecionados'):'Nada dentro do laço')}}
 else if(d.t2==='qsel'){ui(1);toast(d.ctx.n?(d.sub?'Seleção reduzida':selCount()+' selecionados'):'Nada sob o pincel')}
 dirty=1}

function draw(c,z){if(S.mode!=='draw')return;const d=S.drag,t=S.tool;
 if(d&&d.t2==='knife')PATHS.draw(c,z);
 if(d&&d.t2==='brush'&&d.pts.length>1){const st=style();c.save();c.lineCap='round';c.lineJoin='round';c.globalAlpha=Math.max(.35,st.al*.85);c.strokeStyle='#'+st.c;c.lineWidth=st.w;c.beginPath();d.pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.stroke();c.restore()}
 if(d&&d.t2==='lasso'&&d.P.length>1){c.save();c.setLineDash([5/z,4/z]);c.lineWidth=1.5/z;c.strokeStyle=d.sub?'#ff5252':'#00e5ff';c.fillStyle=d.sub?'#ff525222':'#00e5ff22';c.beginPath();d.P.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();c.fill();c.stroke();c.restore()}
 if(t==='V'&&S.selTool==='qsel'&&S.hover&&S.cur2){const p=S.cur2;c.save();c.lineWidth=1.5/z;c.strokeStyle=(d&&d.sub)?'#ff5252':'#00e5ff';c.fillStyle=(d&&d.sub)?'#ff525218':'#00e5ff18';c.beginPath();c.arc(p[0],p[1],O.qsize,0,7);c.fill();c.stroke();c.restore()}
 if(t==='F'&&S.hover&&S.cur2&&!d){const p=S.cur2,st=style();c.save();c.globalAlpha=.55;c.strokeStyle='#'+st.c;c.lineWidth=1.2/z;c.beginPath();c.arc(p[0],p[1],Math.max(.5,st.w/2),0,7);c.stroke();c.restore()}
 if(t==='K'&&S.hover&&S.cur2&&!ctrlDown&&!d){const p=partAt(S.cur2);if(p){const pv=previewOf(p);c.save();c.lineCap='round';c.lineJoin='round';
  if(pv.polys.length){c.globalAlpha=.3;c.fillStyle='#fff';c.beginPath();for(const r of pv.polys){r.forEach((q,i)=>i?c.lineTo(q[0],q[1]):c.moveTo(q[0],q[1]));c.closePath()}c.fill('evenodd');c.globalAlpha=.9;c.setLineDash([5/z,4/z]);c.lineWidth=1.5/z;c.strokeStyle='#fff';c.shadowColor='#000';c.shadowBlur=3;c.stroke();c.setLineDash([])}
  if(pv.lines.length){c.globalAlpha=.85;c.lineWidth=2.5/z;c.strokeStyle='#ffffff';c.shadowColor='#000';c.shadowBlur=4;c.beginPath();let n=0;for(const l of pv.lines){if(n++>3000)break;c.moveTo(l[0][0],l[0][1]);c.lineTo(l[1][0],l[1][1])}c.stroke()}
  c.restore()}}}

function init(){
 const st=document.getElementById('stage');bar=document.createElement('div');bar.id='topt';bar.hidden=true;st.appendChild(bar);
 const lasso=document.getElementById('llasso'),q=document.getElementById('lqsel');
 const toggle=k=>{if(S.mode!=='draw'){toast('Disponível no modo de desenho');return}S.selTool=S.selTool===k?null:k;if(S.selTool){S.smart=false;S.shov=null;document.getElementById('lsmart').classList.remove('on');if(S.tool!=='V')setTool('V');toast(k==='lasso'?'Laço: desenhe ao redor das linhas (Shift soma, Alt subtrai)':'Pincel de seleção: pinte sobre as linhas. Shift soma, Alt subtrai. Tamanho na barra do topo.')}syncSelButtons();renderBar();dirty=1};
 lasso.onclick=()=>toggle('lasso');q.onclick=()=>toggle('qsel');
 document.getElementById('lsmart').addEventListener('click',()=>{if(S.smart&&S.selTool){S.selTool=null;syncSelButtons();renderBar()}});
 addEventListener('keydown',e=>{if(e.key==='Control'||e.key==='Meta'){ctrlDown=true;if(S.tool==='K'){setCursor();dirty=1}}if(e.key==='Alt'||e.key==='Shift'){if(e.key==='Alt')altDown=true;else shiftDown=true;hovKey='';if(S.tool==='K')dirty=1}});
 addEventListener('keyup',e=>{if(e.key==='Control'||e.key==='Meta'){ctrlDown=false;if(S.tool==='K'){setCursor();dirty=1}}if(e.key==='Alt'||e.key==='Shift'){if(e.key==='Alt')altDown=false;else shiftDown=false;hovKey='';if(S.tool==='K')dirty=1}});
 addEventListener('blur',()=>{ctrlDown=false;altDown=false;shiftDown=false;setCursor()});
 document.querySelectorAll('#modes button').forEach(b=>b.addEventListener('click',()=>setTimeout(renderBar,0)));
 cv.addEventListener('pointermove',()=>{if(S.tool==='K'||(S.tool==='V'&&S.selTool==='qsel')||S.tool==='F')dirty=1});
 {const sb=document.getElementById('o_dropb'),sk=document.getElementById('o_dropst');if(sb&&sk)sb.onclick=()=>{sk.checked=!sk.checked;sb.classList.toggle('on',sk.checked)};const b=document.getElementById('o_drop');if(b)b.onclick=()=>{if(S.mode!=='draw'){toast('Disponível no modo de desenho');return}if(S.place)cancelPlace();fdropSet(!S.fdrop)};addEventListener('keydown',e=>{if(e.key==='Escape'&&S.fdrop)fdropSet(false)})}
 renderBar();setCursor()}
return{init,down,move,up,draw,setCursor,toolChanged,O,renderBar,ringOf,fitRun,fitGreedy,chainOf,devToChord}})();
