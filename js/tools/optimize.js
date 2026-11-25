'use strict';
const SO=(()=>{
const $=id=>document.getElementById(id),R2=v=>Math.round(v*100)/100,dist=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
const st={scope:'sel',mode:'opt',tol:1.5,otol:.5,curves:true,nfit:true,tiny:0};
let root=null,ready=false,raf=0;
const isShape=it=>it&&it.k==='h'&&it.o&&'PBSNQRE'.includes(it.t);
const inSel=it=>it.k==='h'?S.sel.items.has(it):(S.sel.pts.has(it.a)&&S.sel.pts.has(it.b));
function scopeItems(){const out=[],add=l=>{if(!l||l.lock)return;l.items.forEach(it=>out.push({it,l}))};
 if(st.scope==='sel')S.layers.forEach(l=>{if(l.lock)return;l.items.forEach(it=>{if(inSel(it))out.push({it,l})})});
 else if(st.scope==='layers')selLayers().forEach(add);else S.layers.forEach(add);return out}
function cnt(it){if(it.k==='s')return 1;if(!isShape(it))return 0;try{return G.shapeSegs(it).length}catch(e){return 0}}
function dSeg(p,a,b){const dx=b[0]-a[0],dy=b[1]-a[1],L=dx*dx+dy*dy;let t=L?((p[0]-a[0])*dx+(p[1]-a[1])*dy)/L:0;t=t<0?0:t>1?1:t;return Math.hypot(p[0]-a[0]-dx*t,p[1]-a[1]-dy*t)}
function devPts(pts,segs){const step=pts.length>800?Math.ceil(pts.length/800):1;let m=0;for(let i=0;i<pts.length;i+=step){const p=pts[i];let b=1e9;for(let j=0;j<segs.length;j++){const d=dSeg(p,segs[j][0],segs[j][1]);if(d<b){b=d;if(b<=m)break}}if(b>m)m=b}return m}
function rdp(P,e){if(P.length<3)return P;let m=0,ix=0;const a=P[0],b=P[P.length-1];for(let i=1;i<P.length-1;i++){const d=dSeg(P[i],a,b);if(d>m){m=d;ix=i}}return m>e?rdp(P.slice(0,ix+1),e).slice(0,-1).concat(rdp(P.slice(ix),e)):[a,b]}
function thin(P,tol){if(P.length<3)return P;const out=[P[0]];let a=0;
 while(a<P.length-1){let b=a+1;
  while(b+1<P.length){let ok=true;for(let k=a+1;k<=b;k++){if(dSeg(P[k],P[a],P[b+1])>tol){ok=false;break}}
   const dx=P[b+1][0]-P[a][0],dy=P[b+1][1]-P[a][1];
   if(ok){let mono=true;for(let k=a+1;k<=b;k++){if((P[k][0]-P[a][0])*dx+(P[k][1]-P[a][1])*dy<0){mono=false;break}}ok=mono}
   if(!ok)break;b++}
  out.push(P[b]);a=b}
 return out}
function simpClosed(P,tol,fn){if(P.length<4)return P;const r=BOOL.simplify(P,tol);return fn?fn(r):r}
function fitN(it,tol){const n0=Math.max(2,Math.round(it.o.n||24));if(n0<=2||it.t==='P'||it.t==='R')return null;
 let ref;try{ref=G.shapeSegs(it)}catch(e){return null}const c0=ref.length;if(c0<4)return null;
 const pts=[];ref.forEach(s=>{pts.push(s.a,[(s.a[0]+s.b[0])/2,(s.a[1]+s.b[1])/2])});
 const refSeg=ref.map(s=>[s.a,s.b]);const probe=n=>{let sg;try{sg=G.shapeSegs({...it,o:{...it.o,n}})}catch(e){return{ok:false,c:c0}}const cs=sg.map(s=>[s.a,s.b]),cp=[];sg.forEach(s=>{cp.push(s.a,[(s.a[0]+s.b[0])/2,(s.a[1]+s.b[1])/2])});return{n,c:sg.length,ok:devPts(pts,cs)<=tol&&devPts(cp,refSeg)<=tol}};
 let lo=2,hi=n0;while(lo<hi){const mid=(lo+hi)>>1;if(probe(mid).ok)hi=mid;else lo=mid+1}
 if(lo>=n0)return null;const r=probe(lo);return r.ok&&r.c<c0?{n:lo,c:r.c}:null}
function dense(it){const t={...it,o:{...it.o,mode:'o',n:Math.max(Math.round(it.o.n||24),48)}};let sg;try{sg=G.shapeSegs(t)}catch(e){return null}if(!sg.length)return null;
 const pts=sg.map(s=>s.a);pts.push(sg[sg.length-1].b);return pts}
function fitCurve(D,closed,err){
 let P=D.map(p=>p.slice());if(closed&&dist(P[0],P[P.length-1])>1e-6)P.push(P[0].slice());
 const n=P.length;if(n<4)return null;const k=2,corners=[];
 const ang=[];for(let i=0;i<n;i++)ang.push(0);
 for(let i=k;i<n-k;i++){const a=[P[i][0]-P[i-k][0],P[i][1]-P[i-k][1]],b=[P[i+k][0]-P[i][0],P[i+k][1]-P[i][1]],la=Math.hypot(a[0],a[1]),lb=Math.hypot(b[0],b[1]);if(la<1e-6||lb<1e-6)continue;ang[i]=Math.acos(Math.max(-1,Math.min(1,(a[0]*b[0]+a[1]*b[1])/(la*lb))))}
 const th=50*Math.PI/180;
 for(let i=k;i<n-k;i++){if(ang[i]<th)continue;let ok=true;for(let j=Math.max(0,i-k);j<=Math.min(n-1,i+k);j++)if(ang[j]>ang[i]||(ang[j]===ang[i]&&j<i)){ok=false;break}if(ok)corners.push(i)}
 let cubs=[];
 if(!corners.length){if(closed){const t1=(()=>{const a=P[1],b=P[n-2],d=[a[0]-b[0],a[1]-b[1]],l=Math.hypot(d[0],d[1])||1;return[d[0]/l,d[1]/l]})();cubs=T2.fitGreedy(P,err,t1,[-t1[0],-t1[1]])}else cubs=T2.fitGreedy(P,err)}
 else{let cs=corners.slice();
  if(closed){const f=cs[0];P=P.slice(f,n-1).concat(P.slice(0,f+1));cs=cs.map(c=>(c-f+(n-1))%(n-1)).sort((a,b)=>a-b).filter(c=>c>0);cs.unshift(0);cs.push(P.length-1)}
  else{cs.unshift(0);cs.push(n-1)}
  for(let i=0;i<cs.length-1;i++){if(cs[i+1]-cs[i]<1)continue;cubs=cubs.concat(T2.fitGreedy(P.slice(cs[i],cs[i+1]+1),err))}}
 if(!cubs.length)return null;let ch=T2.chainOf(cubs);if(closed)ch=ch.slice(0,ch.length-1);ch=ch.map(p=>[R2(p[0]),R2(p[1])]);return ch.length>=4?ch:null}
function bboxDiag(pts){let x0=1e18,y0=1e18,x1=-1e18,y1=-1e18;pts.forEach(p=>{x0=Math.min(x0,p[0]);x1=Math.max(x1,p[0]);y0=Math.min(y0,p[1]);y1=Math.max(y1,p[1])});return Math.hypot(x1-x0,y1-y0)}
const styleKey=it=>[it.c,it.w,it.al,it.fg].join('|');
function chains(segs,q){const kf=p=>Math.round(p[0]/q)+','+Math.round(p[1]/q),seen=new Set(),list=[];
 segs.forEach(s=>{const a=kf(s.it.a),b=kf(s.it.b);if(a===b)return;const k=a<b?a+'|'+b:b+'|'+a;if(seen.has(k))return;seen.add(k);list.push({s,a,b,used:false})});
 const adj=new Map();list.forEach((e,i)=>{[e.a,e.b].forEach(k=>(adj.get(k)||adj.set(k,[]).get(k)).push(i))});
 const out=[];
 const walk=(i,from)=>{const pts=[],items=[];let cur=i,node=from;const e0=list[i];pts.push(node===e0.a?e0.s.it.a:e0.s.it.b);
  while(true){const e=list[cur];e.used=true;items.push(e.s);const other=node===e.a?e.b:e.a,po=node===e.a?e.s.it.b:e.s.it.a;pts.push(po);
   const l=adj.get(other);if(l.length!==2)return{pts,items,closed:false};
   const nx=l[0]===cur?l[1]:l[0];if(list[nx].used)return{pts,items,closed:other===kf(pts[0])};cur=nx;node=other}};
 list.forEach((e,i)=>{if(e.used)return;[e.a,e.b].forEach(k=>{if(e.used)return;if(adj.get(k).length!==2)out.push(walk(i,k))})});
 list.forEach((e,i)=>{if(e.used)return;const r=walk(i,e.a);out.push(r)});
 return out}
function newShape(src,t,pts,closed,n){const o={...readOpts(),mode:'o',closed:!!closed,ocOn:false,fcOn:false};if(n)o.n=n;return{k:'h',id:0,t,pts,o,c:src.c,w:src.w,al:src.al,fg:src.fg}}
function newSeg(src,a,b){const it=clone(src.it);it.id=0;it.a=[R2(a[0]),R2(a[1])];it.b=[R2(b[0]),R2(b[1])];return it}
const lineB=(q,l)=>`<JD P1="${xn(q.a[0])},${xn(q.a[1])}" P2="${xn(q.b[0])},${xn(q.b[1])}" c="${q.c},${q.w},${q.al},${q.fg}"${lgAttr(l)} />`.length;
function measure(it,l){if(!l.vis)return{n:0,b:0};let sg;try{sg=it.k==='s'?[it]:G.shapeSegs(it)}catch(e){return{n:0,b:0}}let b=0;for(const q of sg)b+=lineB(q,l);return{n:sg.length,b}}
function merged(it,set){const c={...it,...set};if(set.t==='Q'||set.pts){delete c.cc;delete c.u;delete c.v}return c}
function totals(){const{o,n}=xmlLines(),single=o.map(l=>l[1]).join('');return{n,b:!/[^\x00-\x7f]/.test(single)?single.length:new Blob([single]).size}}
function plan(){
 const sc=scopeItems(),ops=[];
  const simp=st.mode==='simp',tol=simp?st.tol:st.otol;
 const byLayer=new Map();sc.forEach(x=>{if(x.it.k==='s'){const m=byLayer.get(x.l)||byLayer.set(x.l,new Map()).get(x.l),k=styleKey(x.it);(m.get(k)||m.set(k,[]).get(k)).push(x)}});
 byLayer.forEach((m,l)=>m.forEach(arr=>{
  chains(arr,.02).forEach(ch=>{const oldC=ch.items.length;let pts=ch.pts;
   if(ch.closed&&dist(pts[0],pts[pts.length-1])>1e-6)pts=pts.concat([pts[0]]);
   if(!simp){const nt=thin(pts,tol);if(nt.length-1<oldC){const add=[];for(let i=0;i<nt.length-1;i++)add.push(newSeg(ch.items[0],nt[i],nt[i+1]));ops.push({l,rm:ch.items.map(x=>x.it),add,oldC,newC:add.length})}return}
   const diag=bboxDiag(pts);
   if(st.tiny>0&&diag<st.tiny){ops.push({l,rm:ch.items.map(x=>x.it),add:[],oldC,newC:0});return}
   let rd=ch.closed?simpClosed(pts.slice(0,-1),tol).concat([]):rdp(pts,tol);if(ch.closed)rd=rd.concat([rd[0]]);
   const lines=rd.length-1;
   if(st.curves&&pts.length>=6){const D=pts,fit=fitCurve(ch.closed?D.slice(0,-1):D,ch.closed,tol);
    if(fit){const n=Math.max(2,Math.min(24,Math.round(24*Math.sqrt(.35/Math.max(tol,.05)))));const cand=newShape(ch.items[0].it,'Q',fit,ch.closed,n);const c=cnt(cand);if(c<Math.min(oldC,lines)||(c<oldC&&c<=lines)){ops.push({l,rm:ch.items.map(x=>x.it),add:[cand],oldC,newC:c});return}}}
   if(lines<oldC){if(lines===1&&!ch.closed){ops.push({l,rm:ch.items.map(x=>x.it),add:[newSeg(ch.items[0],rd[0],rd[1])],oldC,newC:1});return}
    const add=[newShape(ch.items[0].it,'P',rd.slice(0,ch.closed?-1:undefined).map(p=>[R2(p[0]),R2(p[1])]),ch.closed)];ops.push({l,rm:ch.items.map(x=>x.it),add,oldC,newC:cnt(add[0])})}})}));
 sc.forEach(({it,l})=>{if(!isShape(it))return;const oldC=cnt(it);if(!oldC)return;
  if(simp&&st.tiny>0){const d=dense(it);if(d&&bboxDiag(d)<st.tiny){ops.push({l,rm:[it],add:[],oldC,newC:0});return}}
  if(it.t==='P'){const closed=!!it.o.closed;let np;
   if(simp)np=closed?simpClosed(it.pts,tol):rdp(it.pts,tol);else{np=thin(closed?it.pts.concat([it.pts[0]]):it.pts,tol);if(closed)np=np.slice(0,-1)}
   if(simp&&st.curves&&it.pts.length>=8){const fit=fitCurve(it.pts,closed,tol);if(fit){const cand={...it,t:'Q',pts:fit,o:{...it.o,n:Math.max(2,Math.min(24,Math.round(24*Math.sqrt(.35/Math.max(tol,.05)))))}};const c=cnt(cand);if(c<oldC&&c<=cnt({...it,pts:np})){ops.push({it,l,set:{t:'Q',pts:fit,o:cand.o},oldC,newC:c});return}}}
   const need=closed?3:2;if(np.length>=need&&np.length<it.pts.length){const c=np.length-(closed?0:1);ops.push({it,l,set:{pts:np.map(p=>[R2(p[0]),R2(p[1])])},oldC,newC:Math.min(oldC,c)});return}
   return}
  if(simp&&'BSNQ'.includes(it.t)){const D=dense(it),closed=!!it.o.closed;
   if(D&&D.length>=6){const fit=fitCurve(closed?D.slice(0,-1):D,closed,tol);
    if(fit&&(fit.length<it.pts.length||it.t!=='Q')){const n=Math.max(2,Math.min(Math.round(it.o.n||24),Math.round(24*Math.sqrt(.35/Math.max(tol,.05)))));const o2={...it.o,n},cand={...it,t:'Q',pts:fit,o:o2},c=cnt(cand);if(c<oldC&&devPts(D.filter((_,i)=>i%2===0),(()=>{try{return G.shapeSegs({...cand,o:{...o2,mode:'o'}}).map(s=>[s.a,s.b])}catch(e){return[]}})())<=tol*1.5){ops.push({it,l,set:{t:'Q',pts:fit,o:o2},oldC,newC:c});return}}}}
  if(st.nfit||simp){const r=fitN(it,tol);if(r)ops.push({it,l,set:{o:{...it.o,n:r.n}},oldC,newC:r.c})}});

 const fin=[];let dn=0,db=0;
 ops.forEach(o=>{let a={n:0,b:0},d={n:0,b:0};
  if(o.set){a=measure(o.it,o.l);d=measure(merged(o.it,o.set),o.l)}
  else{o.rm.forEach(x=>{const m=measure(x,o.l);a.n+=m.n;a.b+=m.b});o.add.forEach(x=>{const m=measure(x,o.l);d.n+=m.n;d.b+=m.b})}
  if(d.n<a.n||(d.n===a.n&&d.b<a.b)){o.a=a;o.d=d;dn+=d.n-a.n;db+=d.b-a.b;fin.push(o)}});
 const tot=totals();
 return{ops:fin,n:sc.length,before:tot.n,after:Math.max(0,tot.n+dn),kb0:tot.b/1024,kb1:Math.max(0,tot.b+db)/1024}}
function apply(){const pl=plan();if(!pl.n){toast('Nada no escopo');return}if(!pl.ops.length){toast('Nada a reduzir: já está enxuto');return}
 selClear();
 pl.ops.forEach(o=>{
  if(o.set){const c=merged(o.it,o.set);Object.keys(o.it).forEach(k=>{if(!(k in c))delete o.it[k]});Object.assign(o.it,c);touch(o.it);S.sel.items.add(o.it);return}
  const l=o.l,first=l.items.indexOf(o.rm[0]);if(first<0)return;
  o.add.forEach(it=>{it.id=S.uid++;if(it.k==='h')touch(it)});
  l.items.splice(first,1,...o.add);o.rm.slice(1).forEach(it=>{const i=l.items.indexOf(it);if(i>=0)l.items.splice(i,1)});
  o.add.forEach(it=>{if(it.k==='h')S.sel.items.add(it);else{S.sel.pts.add(it.a);S.sel.pts.add(it.b)}})});
 commit();const sv=pl.before-pl.after;toast(`${st.mode==='simp'?'Simplificado':'Otimizado'}: ${pl.before} → ${pl.after} linhas (−${pl.before?Math.round(sv/pl.before*100):0}%)`);schedule()}
const fk=v=>v>=100?v.toFixed(0):v.toFixed(2),pct=(a,b)=>a?Math.round((a-b)/a*100):0;
function paint(){if(!root||!ready)return;const s=$('o_stat');if(!s)return;
 const pl=plan();
 const cnts={sel:0,layers:0,all:0};
 S.layers.forEach(l=>{if(l.lock)return;cnts.all+=l.items.length;if(S.lsel.has(l.id))cnts.layers+=l.items.length;l.items.forEach(it=>{if(inSel(it))cnts.sel++})});
 root.querySelectorAll('#o_sc button').forEach(b=>{const e=b.querySelector('em');if(e)e.textContent=cnts[b.dataset.sc]});
 if(!pl.n){s.innerHTML=`${ic('mouse-pointer-2',13)} ${st.scope==='sel'?'Selecione elementos no canvas (ou escolha outro escopo)':'Nada neste escopo'}`;$('o_apply').disabled=true;return}
 s.innerHTML=`${ic('layers',13)} <b>${pl.n}</b> <span>${pl.n>1?'elementos no escopo':'elemento no escopo'}</span><br>${ic('scissors',13)} <b>${pl.before}</b> → <b>${pl.after}</b> <span>linhas</span> <i class="pc">−${pct(pl.before,pl.after)}%</i><br>${ic('zap',13)} <b>${fk(pl.kb0)}</b> → <b>${fk(pl.kb1)}</b> <span>KB</span> <i class="pc">−${pct(pl.kb0,pl.kb1)}%</i>${pl.ops.length?'':'<br><em class="onone">Sem ganho com estes ajustes</em>'}`;
 $('o_apply').disabled=!pl.ops.length}
function schedule(){clearTimeout(raf);raf=setTimeout(()=>{raf=0;paint()},120)}
const rowN=(id,ic_,l,t,mn,mx,sp,v)=>`<label class="fr" title="${t}"><span class="fl">${ic(ic_,14)}${l}</span><input type="number" id="${id}" min="${mn}" max="${mx}" step="${sp}" value="${v}"></label>`;
const rowR=(id,mn,mx,sp,v)=>`<input type="range" class="orng" id="${id}" min="${mn}" max="${mx}" step="${sp}" value="${v}">`;
const rowB=(id,ic_,l,t,v)=>`<label class="fr" title="${t}"><span class="fl">${ic(ic_,14)}${l}</span><input type="checkbox" class="switch" id="${id}" ${v?'checked':''}></label>`;
const DESC={simp:'Reduz formas, curvas e linhas para diminuir o número de linhas e KB. Aceita uma pequena diferença visual, controlada pela tolerância.',opt:'Não muda o resultado: junta retas alinhadas, tira pontos e amostras desnecessários e mantém o desenho idêntico com menos linhas e KB.'};
const on=(k,v)=>(k==='sc'?st.scope:st.mode)===v?' class="on"':'';
function body(){const sim=st.mode==='simp';return`<div class="obox"><div class="cscope"><div class="seg3" id="o_sc"><button data-sc="sel"${on('sc','sel')} title="Só os elementos selecionados no canvas">${ic('mouse-pointer-2',14)}<span>Seleção</span><em></em></button><button data-sc="layers"${on('sc','layers')} title="Todos os elementos da(s) camada(s) selecionada(s) na lista de camadas (Ctrl/Shift para várias)">${ic('layers-2',14)}<span>Camada(s)</span><em></em></button><button data-sc="all"${on('sc','all')} title="Todos os elementos de todas as camadas (menos as travadas)">${ic('layers',14)}<span>Todas</span><em></em></button></div></div>
 <div class="osw" id="o_md"><button data-md="simp"${on('md','simp')} title="Simplifica formas e curvas aceitando pequena diferença">${ic('simplify',15)}<span>Simplificar</span></button><button data-md="opt"${on('md','opt')} title="Reduz linhas e KB sem mudar o resultado">${ic('zap',15)}<span>Otimizar</span></button></div>
 <p class="cdesc" id="o_desc">${DESC[st.mode]}</p>
 <div class="sbody">${sim?rowN('o_tol','spline','Tolerância (px)','Quanto a forma pode se afastar do original. Maior = menos linhas e mais diferença.',.1,10,.1,st.tol)+rowR('o_tol_r',.1,10,.1,st.tol)+rowB('o_cur','spline','Refazer como curvas','Ajusta curvas Bézier suaves sobre linhas e polilinhas (menos pontos e linhas).',st.curves)+rowN('o_tiny','ruler','Remover detalhes menores (px)','Apaga elementos cujo tamanho total é menor que isto. 0 = não apaga nada.',0,50,.5,st.tiny):rowN('o_otol','ruler','Precisão (px)','Desvio máximo permitido. Quanto menor, mais fiel ao original; quanto maior, menos linhas.',.01,2,.01,st.otol)+rowR('o_otol_r',.01,2,.01,st.otol)+rowB('o_nfit','gauge','Reduzir amostragem das curvas','Usa o menor número de amostras que ainda reproduz a curva com a precisão escolhida.',st.nfit)}</div></div>`}
function mount(){const sec=$('w-opt');if(!sec||root)return;
 sec.insertAdjacentHTML('afterbegin',body());
 sec.insertAdjacentHTML('beforeend',`<div class="wfoot cfoot"><div id="o_stat">Pronto</div><div class="cbtns"><button id="o_apply" class="pri" title="Aplica de verdade (entra no Ctrl+Z)">${ic('check',14)}Aplicar</button></div></div>`);
 root=sec;wire()}
function rebuild(){const b=root.querySelector('.obox');if(!b)return;const t=document.createElement('div');t.innerHTML=body();b.replaceWith(t.firstChild);paint()}
function wire(){
 root.addEventListener('click',e=>{const t=e.target;let b;
  if(b=t.closest('#o_sc button')){st.scope=b.dataset.sc;root.querySelectorAll('#o_sc button').forEach(x=>x.classList.toggle('on',x===b));paint();return}
  if(b=t.closest('#o_md button')){st.mode=b.dataset.md;rebuild();return}
  if(t.closest('#o_apply'))apply()});
 root.addEventListener('input',e=>{const t=e.target,n=+t.value,sync=(a,b)=>{const o=$(b);if(o&&o!==t)o.value=a};
  if((t.id==='o_tol'||t.id==='o_tol_r')&&n>0){st.tol=n;sync(n,t.id==='o_tol'?'o_tol_r':'o_tol')}
  else if((t.id==='o_otol'||t.id==='o_otol_r')&&n>0){st.otol=n;sync(n,t.id==='o_otol'?'o_otol_r':'o_otol')}
  else if(t.id==='o_tiny')st.tiny=Math.max(0,n||0);else return;schedule()});
 root.addEventListener('change',e=>{const t=e.target;if(t.id==='o_cur')st.curves=t.checked;else if(t.id==='o_nfit')st.nfit=t.checked;else return;schedule()});
 }
let sig='';
function sync(){if(!root||!ready||root.closest('.win').hidden)return;const s=(st.scope==='sel'?S.sel.items.size+'|'+S.sel.pts.size:st.scope==='layers'?[...S.lsel].join(','):S.layers.length)+'|'+S.layers.reduce((a,l)=>a+l.items.length,0)+'|'+S.mode;if(s!==sig){sig=s;schedule()}}
function open(sc,center){if(S.mode==='map'){toast('Simplificar / Otimizar é do modo Desenhar');return}if(sc)st.scope=sc;if(center)WM.center('w-opt',400,560);else WM.focus('w-opt',true);if(root){root.querySelectorAll('#o_sc button').forEach(x=>x.classList.toggle('on',x.dataset.sc===st.scope));paint()}}
function init(){if(!root)mount();if(!root)return;ready=true;setInterval(sync,400);paint()}
return{init,mount,sync,open,plan,apply,st}})();
if(typeof document!=='undefined'&&document.getElementById('w-opt'))SO.mount();
