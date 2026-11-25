'use strict';
function toSec(el){const wb=el&&el.closest('.wbody');if(!wb)return;const d=el.getBoundingClientRect().top-wb.getBoundingClientRect().top;wb.scrollTo({top:Math.max(0,wb.scrollTop+d-2),behavior:'smooth'})}
const SHP=(()=>{
const{TAU,cl,rad}=SL,ALL=[...SL.F,...SL.E];
const $=id=>document.getElementById(id);
const CATS={f:[['all','Todas'],['b','Básicas'],['s','Símbolos e setas'],['n','Natureza e cenário'],['o','Orgânicas e curvas'],['p','Padrões']],e:[['all','Todos'],['ef','Carinhas'],['ea','Animais'],['ec','Comidas'],['en','Natureza'],['eo','Objetos'],['es','Símbolos'],['et','Transformice']]};
const isCol=sh=>!!(sh.emoji||sh.col),isPat=sh=>!!sh.col&&!sh.emoji;
let cur=ALL[0],vals={},tab='f',cat={f:'all',e:'all'},q='',last=null,userMode='o';
const inTab=s=>tab==='e'?!!s.emoji:!s.emoji;
const defaults=sh=>{const v={};sh.P.forEach(p=>v[p.k]=p.d);return v};
const OVI={ow:'sh_ow',fw:'sh_fw',ha:'sh_ha',hs:'sh_hs',auto:'sh_auto',hx:'sh_hx',hi:'sh_hi'};let touched={};
const effMode=()=>cur.emoji?null:(cur.open&&!isPat(cur))?'o':$('sh_mode').value;
function ovVals(){const v={};Object.keys(OVI).forEach(k=>{if(!touched[k])return;const e=$(OVI[k]);if(!e)return;v[k]=e.type==='checkbox'?e.checked:(e.value===''?undefined:+e.value)});return v}
function syncOv(){if(typeof readOpts!=='function')return;let o,st;try{o=readOpts();st=style()}catch(e){return}const set=(k,v)=>{if(touched[k])return;const e=$(OVI[k]);if(!e)return;if(e.type==='checkbox')e.checked=!!v;else e.value=v};
 set('ow',st.w);set('fw',st.w);set('ha',o.ha);set('hs',o.hs);set('auto',o.auto);set('hx',o.hx);set('hi',o.hi)}
const gl=()=>({W:Math.max(4,+$('sh_w').value||100),H:Math.max(4,+$('sh_h').value||100),rot:rad(+$('sh_rot').value||0),n:Math.round(cl(+$('sh_n').value||24,4,120)),mode:$('sh_mode').value,orig:$('sh_orig').checked,edge:$('sh_edge').checked,eow:Math.max(0,Math.round(+$('sh_eow').value||0)),efw:Math.max(0,Math.round(+$('sh_efw').value||0)),ehi:Math.max(0,+$('sh_ehi').value||0),ov:ovVals()});
const fitOn=(sh,v)=>typeof sh.fit==='function'?!!sh.fit(v):sh.fit!==false;
function gen(sh,v,g){const G={W:g.W||100,H:g.H||100};let parts=sh.g(v,g.n,G).filter(p=>p&&p.pts&&p.pts.length>=2);
 if(!sh.emoji&&fitOn(sh,v)){let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;parts.forEach(p=>p.pts.forEach(q=>{x0=Math.min(x0,q[0]);x1=Math.max(x1,q[0]);y0=Math.min(y0,q[1]);y1=Math.max(y1,q[1])}));const w=x1-x0||1,h=y1-y0||1,cx=(x0+x1)/2,cy=(y0+y1)/2;sh.ar=w/h;parts=parts.map(p=>({...p,pts:p.pts.map(q=>[(q[0]-cx)/w*2,(q[1]-cy)/h*2])}))}
 if(v.rd>0&&!sh.emoji){const sx=G.W/2,sy=G.H/2,rr=v.rd/100*Math.min(sx,sy);parts=parts.map(p=>(!p.closed||p.open||p.pts.length<3||p.frame)?p:{...p,pts:roundPoly(p.pts.map(q=>[q[0]*sx,q[1]*sy]),rr,Math.max(3,Math.round(g.n/9))).map(q=>[q[0]/sx,q[1]/sy])})}
 return parts}
function roundPoly(q,rr,m0){const n=q.length,o=[];if(rr<=.01)return q;
 for(let i=0;i<n;i++){const a=q[(i-1+n)%n],b=q[i],c=q[(i+1)%n],v1=[a[0]-b[0],a[1]-b[1]],v2=[c[0]-b[0],c[1]-b[1]],l1=Math.hypot(v1[0],v1[1]),l2=Math.hypot(v2[0],v2[1]);
  if(l1<1e-6||l2<1e-6){o.push(b);continue}const u1=[v1[0]/l1,v1[1]/l1],u2=[v2[0]/l2,v2[1]/l2],ang=Math.acos(cl(u1[0]*u2[0]+u1[1]*u2[1],-1,1));
  if(Math.PI-ang<.42||ang<.02){o.push(b);continue}
  let t=rr/Math.tan(ang/2);t=Math.min(t,l1*.5,l2*.5);const r2=t*Math.tan(ang/2),E=[b[0]+u1[0]*t,b[1]+u1[1]*t],X=[b[0]+u2[0]*t,b[1]+u2[1]*t];
  let bx=u1[0]+u2[0],by=u1[1]+u2[1];const bl=Math.hypot(bx,by)||1;bx/=bl;by/=bl;const h=r2/Math.sin(ang/2),C=[b[0]+bx*h,b[1]+by*h],a0=Math.atan2(E[1]-C[1],E[0]-C[0]),a1=Math.atan2(X[1]-C[1],X[0]-C[0]);let da=a1-a0;while(da>Math.PI)da-=TAU;while(da<-Math.PI)da+=TAU;
  const m=Math.max(2,Math.ceil(m0*Math.abs(da)/(Math.PI/2)));for(let k=0;k<=m;k++){const t2=a0+da*k/m;o.push([C[0]+Math.cos(t2)*r2,C[1]+Math.sin(t2)*r2])}}
 return o}
function place(parts,g,cx,cy){const sx=g.W/2,sy=g.H/2,c=Math.cos(g.rot),s=Math.sin(g.rot);return parts.map(p=>({...p,pts:p.pts.map(q=>{const x=q[0]*sx,y=q[1]*sy;return[Math.round((x*c-y*s+cx)*100)/100,Math.round((x*s+y*c+cy)*100)/100]})}))}
function drawParts(cv,parts,size,col){const g=cv.getContext('2d'),d=2;cv.width=size*d;cv.height=size*d;cv.style.width=cv.style.height=size+'px';g.setTransform(d,0,0,d,0,0);g.clearRect(0,0,size,size);const k=size/2*.86,c=size/2;g.lineJoin='round';g.lineCap='round';
 parts.forEach(p=>{g.beginPath();p.pts.forEach((q,i)=>i?g.lineTo(c+q[0]*k,c+q[1]*k):g.moveTo(c+q[0]*k,c+q[1]*k));if(p.closed&&!p.open)g.closePath();
  if(p.fill){g.fillStyle='#'+p.fill;g.fill()}if(p.line||!p.fill){g.strokeStyle=p.line?'#'+p.line:col;g.lineWidth=p.t?Math.max(1,p.t*k):(p.fill?1:1.6);g.stroke()}})}
const themeCol=()=>getComputedStyle(document.documentElement).getPropertyValue('--tx').trim()||'#ddd';
let cardIO=null;const byId=new Map();ALL.forEach(s=>{if(!byId.has(s.id))byId.set(s.id,s)});
function paintCard(cv,col){const sh=byId.get(cv.dataset.id);if(!sh)return;try{drawParts(cv,gen(sh,defaults(sh),{n:sh.emoji?32:20,W:100,H:100}),46,col)}catch(e){}}
function paintCards(){const cvs=document.querySelectorAll('#sh_grid canvas[data-id]');if(cardIO){cardIO.disconnect();cardIO=null}
 if(!('IntersectionObserver' in window)||cvs.length<60){const col=themeCol();cvs.forEach(cv=>paintCard(cv,col));return}
 cardIO=new IntersectionObserver(es=>{const col=themeCol();es.forEach(e=>{if(e.isIntersecting){cardIO.unobserve(e.target);paintCard(e.target,col)}})},{rootMargin:'400px'});
 cvs.forEach(cv=>{cv.style.width=cv.style.height='46px';cardIO.observe(cv)})}
function paintPrev(){const cv=$('sh_pv');if(!cv)return;const g=gl();try{const parts=gen(cur,vals,g),r=Math.max(g.W,g.H),w=g.W/r,h=g.H/r,pp=parts.map(p=>({...p,pts:p.pts.map(q=>[q[0]*w,q[1]*h])})),tint=!g.orig&&isCol(cur),tc=(()=>{try{return String(style().c).replace('#','')}catch(e){return'8a93b8'}})(),md=isPat(cur)?g.mode:'b',pm=pp.map(p=>(!p.fill||!p.closed||p.open||p.frame)?p:md==='o'?{...p,fill:null,line:p.line||p.fill}:md==='f'?{...p,line:null}:p);drawParts(cv,tint?pm.map(p=>({...p,fill:p.fill?tc:null,line:p.line?tc:null})):pm,150,themeCol())}catch(e){}}
function listUI(){const items=ALL.filter(s=>inTab(s)),cs=CATS[tab],c=cat[tab],t=q.trim().toLowerCase();
 const shown=items.filter(s=>(c==='all'||s.cat===c)&&(!t||s.n.toLowerCase().includes(t)||(window.T?T(s.n):s.n).toLowerCase().includes(t)));
 $('sh_cats').innerHTML=cs.map(([k,n])=>{const cnt=k==='all'?items.length:items.filter(s=>s.cat===k).length;return`<button type="button" data-c="${k}" class="${k===c?'on':''}">${n}<small>${cnt}</small></button>`}).join('');
 $('sh_grid').innerHTML=shown.map(s=>`<button type="button" class="shcard${s===cur?' on':''}" data-id="${s.id}" title="${s.n} - clique para configurar"><canvas data-id="${s.id}"></canvas><i>${s.n}</i></button>`).join('')||'<div class="shnone">Nada encontrado</div>';
 $('sh_lt').textContent=tab==='e'?'Emojis':'Formas';$('sh_cnt').textContent=shown.length+' itens';paintCards()}
function setTab(t){tab=t;document.querySelectorAll('#sh_tabs button').forEach(b=>b.classList.toggle('on',b.dataset.t===t));q='';$('sh_q').value='';listUI();
 if(!inTab(cur)){const f=ALL.find(inTab);if(f)pick(f.id,true)}}
function natAspect(){const em=cur.emoji&&cur.ar>0;if(!em&&(cur.emoji||!fitOn(cur,vals))){const m=Math.max(+$('sh_w').value||100,+$('sh_h').value||100);$('sh_w').value=m;$('sh_h').value=m;$('sh_lock').dispatchEvent(new Event('change'));return}if(!em){try{gen(cur,vals,{n:24,W:100,H:100})}catch(e){return}}const ar=cur.ar;if(!(ar>0))return;const m=Math.max(+$('sh_w').value||100,+$('sh_h').value||100);let W=m,H=m;if(ar>=1)H=Math.max(4,Math.round(m/ar));else W=Math.max(4,Math.round(m*ar));$('sh_w').value=W;$('sh_h').value=H;$('sh_lock').dispatchEvent(new Event('change'))}
const segCache=new Map();
function segProbe(sh,v){const key=sh.id+JSON.stringify(v);if(segCache.has(key))return segCache.get(key);let r=false;try{const G={W:100,H:100},cnt=n=>{let c=0;for(const p of sh.g(v,n,G))if(p&&p.pts)c+=p.pts.length;return c};r=cnt(6)!==cnt(60)}catch(e){r=sh.seg===true}if(segCache.size>300)segCache.clear();segCache.set(key,r);return r}
const segOn=(sh,v)=>!!(sh.emoji||v.rd>0||segProbe(sh,v));
function visUI(){$('sh_n').closest('label').hidden=!segOn(cur,vals);$('sh_mode').closest('label').hidden=!!cur.emoji||(!!cur.open&&!isPat(cur));$('sh_orig_l').hidden=!isCol(cur);$('sh_emo').hidden=!cur.emoji;$('sh_pg').hidden=!cur.P.length;
 syncOv();const m=effMode(),fmv=$('o_fm').value,sh=(id,on)=>{const l=$(id);if(l)l.hidden=!on},hasO=m==='o'||m==='b',hasF=m==='f'||m==='b';$('sh_lines').hidden=!m;
 sh('shl_ow',hasO);sh('shl_fw',hasF);sh('shl_ha',hasF&&fmv==='h');sh('shl_hx',hasF&&fmv==='h');sh('shl_hs',hasF);sh('shl_auto',hasF);sh('shl_hi',hasF);$('shl_hit').textContent=fmv==='r'?'Recuo inicial':'Recuo das pontas';$('sh_hs').closest('label').classList.toggle('dis',hasF&&$('sh_auto').checked);
 cur.P.forEach(p=>{if(!p.w)return;const e=$('sh_params').querySelector(`[data-k="${p.k}"]`);const l=e&&e.closest('label');if(l)l.hidden=!p.w(vals)})}
function paramsUI(){$('sh_name').textContent=cur.n;
 $('sh_params').innerHTML=cur.P.map(p=>{const tip=p.h?` title="${p.h.replace(/"/g,'&quot;')}"`:'';
  if(p.t==='b')return`<label class="fr"${tip}><span class="fl"><i data-ic="check"></i>${p.l}</span><input type="checkbox" class="switch" data-k="${p.k}" ${vals[p.k]?'checked':''}></label>`;
  if(p.t==='s')return`<label class="fr"${tip}><span class="fl"><i data-ic="list"></i>${p.l}</span><select data-k="${p.k}">${p.o.map(([v,t])=>`<option value="${v}" ${+vals[p.k]===v?'selected':''}>${t}</option>`).join('')}</select></label>`;
  if(p.t==='c')return`<label class="fr"${tip}><span class="fl"><i data-ic="palette"></i>${p.l}</span><input type="color" data-k="${p.k}" value="#${vals[p.k]}"></label>`;
  return`<label class="fr"${tip}><span class="fl"><i data-ic="${p.k==='rd'?'circle-dot':'sliders-horizontal'}"></i>${p.l}${p.u?' ('+p.u+')':''}</span><input type="number" data-k="${p.k}" value="${vals[p.k]}" min="${p.min}" max="${p.max}" step="${p.step}"></label>`}).join('');
 icons($('sh_params'));visUI();paintPrev()}
function pick(id,quiet){const s=ALL.find(x=>x.id===id);if(!s)return;cur=s;touched={};vals=defaults(s);$('sh_n').value=s.n0||24;
 $('sh_mode').value=isPat(s)?'b':userMode;natAspect();
 document.querySelectorAll('#sh_grid .shcard').forEach(b=>b.classList.toggle('on',b.dataset.id===id));paramsUI();
 $('sh_info').textContent=`${s.n}: ajuste as configurações e clique em “Inserir no desenho”.`;
 if(!quiet){const c=$('sh_cfg');c.open=true;requestAnimationFrame(()=>toSec(c))}}
function keyhole(outer,holes){let ring=outer.map(q=>q.slice());const area=Q=>{let a=0;for(let i=0;i<Q.length;i++){const p=Q[i],q=Q[(i+1)%Q.length];a+=p[0]*q[1]-q[0]*p[1]}return a/2},so=Math.sign(area(ring))||1;
 holes.forEach(h0=>{let h=h0.map(q=>q.slice());if(Math.sign(area(h))===so)h.reverse();let bi=0,bj=0,bd=1e18;
  for(let i=0;i<ring.length;i++)for(let j=0;j<h.length;j++){const d=(ring[i][0]-h[j][0])**2+(ring[i][1]-h[j][1])**2;if(d<bd){bd=d;bi=i;bj=j}}
  const hh=h.slice(bj).concat(h.slice(0,bj));hh.push(hh[0].slice());ring=ring.slice(0,bi+1).concat(hh,[ring[bi].slice()],ring.slice(bi+1))});return ring}
function mkItems(parts,sh,g,lay){const base=readOpts(),st=style(),items=[],min=Math.min(g.W,g.H)/2;
 const ovr=(o,sty0)=>{const ov=g.ov||{},m=o.mode||'o',o2={...base,...o},s2={...(sty0||st)};if(sh.emoji||!Object.keys(ov).length)return[o2,s2];
  if(m==='o'){if(ov.ow>0)s2.w=Math.round(ov.ow)}else if(m==='f'){if(ov.fw>0)s2.w=Math.round(ov.fw)}
  else{ const pc=!!sh.col;if(ov.ow>0){o2.ocOn=true;o2.oc=(pc&&o.ocOn&&o.oc)?o.oc:(base.ocOn?base.oc:s2.c);o2.ow=Math.round(ov.ow)}if(ov.fw>0){o2.fcOn=true;o2.fc=(pc&&o.fc)?o.fc:(pc?s2.c:(base.fcOn?base.fc:s2.c));o2.fw=Math.round(ov.fw)}}
  if(m!=='o'){if(ov.ha!=null)o2.ha=ov.ha;if(ov.hx!=null)o2.hx=!!ov.hx;if(ov.hi!=null)o2.hi=Math.max(0,ov.hi);if(ov.auto!=null)o2.auto=!!ov.auto;if(ov.hs>0)o2.hs=ov.hs}
  return[o2,s2]};
 const mk=(pts,o,sty)=>{const[o2,s2]=ovr(o,sty),it={k:'h',id:S.uid++,t:'P',pts,o:o2,...s2};touch(it);items.push(it);return it};
 if(sh.emoji){
  parts.forEach(p=>{const closed=p.closed&&!p.open,orig=g.orig,hasFill=!!p.fill&&closed,fillc=orig?(p.fill||p.line):st.c,linec=orig?(p.line||p.fill):st.c;
   const xs=p.pts.map(q=>q[0]),ys=p.pts.map(q=>q[1]),sz=Math.min(Math.max(...xs)-Math.min(...xs),Math.max(...ys)-Math.min(...ys)),owB=Math.max(1,Math.round(min/28)),fwB=Math.max(1,Math.round(min/26));
   const ow=g.eow>0?g.eow:cl(Math.round(sz/10),1,owB),fw=g.efw>0?g.efw:cl(Math.round(sz/7),1,fwB);
   if(!hasFill){const w=p.t?Math.max(1,Math.round(p.t*min)):(closed?ow:Math.max(1,Math.round(Math.max(2,min/22))));{const it=mk(p.pts,{closed,mode:'o',top:'o',ocOn:false},{...st,c:linec,w});it.pp={f:fillc,l:linec,ow:w,fw,orig}}}
   else{const edge=g.edge,hi=g.ehi>0?g.ehi:(edge?Math.max(0,(fw-ow)/2):0);{const it=mk(p.pts,{closed:true,mode:edge?'b':'f',top:'o',ocOn:edge,oc:linec,ow,fcOn:false,auto:true,af:.95,fm:'h',ha:45,hx:false,hi},{...st,c:fillc,w:fw});it.pp={f:fillc,l:linec,ow,fw,orig}}}});
  return items}
 if(sh.col){ 
  const owB=Math.max(1,Math.round(min/28)),fwB=Math.max(1,Math.round(min/26));
  parts.forEach(p=>{const closed=p.closed&&!p.open,orig=g.orig,fillc=orig?(p.fill||p.line||st.c):st.c,linec=orig?(p.line||p.fill||st.c):st.c;
   const xs=p.pts.map(q=>q[0]),ys=p.pts.map(q=>q[1]),sz=Math.min(Math.max(...xs)-Math.min(...xs),Math.max(...ys)-Math.min(...ys)),
    ow=g.eow>0?g.eow:(p.t?Math.max(1,Math.round(p.t*min)):cl(Math.round(sz/10),1,owB)),fw=g.efw>0?g.efw:cl(Math.round(sz/7),1,fwB),
    FILL={auto:true,af:.95,fm:'h',ha:45,hx:false,fcOn:false,gm:'s'},pp={f:fillc,l:linec,ow,fw,orig},mkp=(pts,o,sty)=>{const it=mk(pts,{...o,gm:'s'},sty);it.pp=pp;return it};
   if(!closed||!p.fill){mkp(p.pts,{closed,mode:'o',top:'o',ocOn:false,fcOn:false},{...st,c:linec,w:p.t?Math.max(1,Math.round(p.t*min)):(closed?ow:Math.max(1,ow))});return}
   if(g.mode==='o')mkp(p.pts,{closed:true,mode:'o',top:'o',ocOn:false,fcOn:false},{...st,c:linec,w:ow});
   else if(g.mode==='f')mkp(p.pts,{closed:true,mode:'f',top:'o',ocOn:false,hi:0,...FILL},{...st,c:fillc,w:fw});
   else mkp(p.pts,{closed:true,mode:'b',top:'o',ocOn:true,oc:linec,ow,hi:Math.max(0,(fw-ow)/2),...FILL},{...st,c:fillc,w:fw})});
  return items}
 const mode0=sh.open?'o':g.mode,groups=[];let outer=null;
 parts.forEach(p=>{const closed=p.closed&&!p.open;if(p.sub&&closed&&outer&&mode0!=='o')outer.holes.push(p);else if(p.sub||p.open)groups.push({p,holes:[]});else{outer={p,holes:[]};groups.push(outer)}});
 groups.forEach(gr=>{const p=gr.p,closed=p.closed&&!p.open;
  if(!gr.holes.length){const m=(p.sub&&mode0!=='o')?'o':closed?mode0:'o';mk(p.pts,{closed,mode:m});return}
  const fl=()=>mk(keyhole(p.pts,gr.holes.map(h=>h.pts)),{closed:true,mode:'f'}),sty=base.ocOn?{...st,c:base.oc,w:base.ow}:st,ol=()=>{mk(p.pts,{closed:true,mode:'o'},sty);gr.holes.forEach(h=>mk(h.pts,{closed:true,mode:'o'},sty))};
  if(mode0==='f')fl();else if(base.top==='f'){ol();fl()}else{fl();ol()}});
 return items}
function target(sh){let l=L();if(isCol(sh)||!l||l.lock||!l.vis){l=newLayer(sh.n);S.layers.splice(S.cur+1,0,l);S.cur++;S.exp.add('L'+l.id)}return l}
const sig=items=>JSON.stringify(items.map(i=>i.pts));
function insert(){const sh=cur,g=gl(),[cx,cy]=centerW(),parts=place(gen(sh,vals,g),g,cx,cy),lay=target(sh),items=mkItems(parts,sh,g,lay);items.forEach(it=>lay.items.push(it));selClear();items.forEach(it=>S.sel.items.add(it));last={items,lay,sh,cx,cy,sig:sig(items)};commit();$('sh_info').textContent=`${sh.n}: ${items.length} elemento(s) · ${items.reduce((a,i)=>a+i.pts.length,0)} pontos`}
function live(fin){if(!last||!$('sh_live').checked)return;const l=last,exists=l.items.every(it=>S.layers.some(L2=>L2.items.includes(it)));if(!exists||sig(l.items)!==l.sig){last=null;return}
 const lay=S.layers.find(L2=>L2.items.includes(l.items[0]));if(!lay)return;const sh=l.sh,g=gl(),parts=place(gen(sh,vals,g),g,l.cx,l.cy),items=mkItems(parts,sh,g,lay),at=Math.max(0,lay.items.indexOf(l.items[0]));
 l.items.forEach(it=>{S.layers.forEach(L2=>{const i=L2.items.indexOf(it);if(i>=0)L2.items.splice(i,1)})});lay.items.splice(at,0,...items);selClear();items.forEach(it=>S.sel.items.add(it));last={items,lay,sh,cx:l.cx,cy:l.cy,sig:sig(items)};if(fin)commit();else{dirty=1;if(typeof layersUI==='function')layersUI()}}
function bind(){
 $('sh_tabs').onclick=e=>{const b=e.target.closest('[data-t]');if(b)setTab(b.dataset.t)};
 $('sh_cats').onclick=e=>{const b=e.target.closest('[data-c]');if(!b)return;cat[tab]=b.dataset.c;listUI()};
 $('sh_q').addEventListener('input',()=>{q=$('sh_q').value;listUI()});
 $('sh_grid').onclick=e=>{const b=e.target.closest('.shcard');if(b)pick(b.dataset.id)};
 $('sh_back').onclick=()=>toSec($('sh_list'));
 $('sh_ins').onclick=insert;
 const fire=fin=>{paintPrev();live(fin)};
 const rd=e=>{const k=e.target.dataset.k;if(!k)return false;const p=cur.P.find(x=>x.k===k);vals[k]=!p?0:p.t==='b'?(e.target.checked?1:0):p.t==='c'?e.target.value.slice(1):(+e.target.value);return true};
 $('sh_params').addEventListener('input',e=>{if(!rd(e))return;visUI();fire(false)});
 $('sh_params').addEventListener('change',e=>{if(e.target.dataset.k){rd(e);visUI();fire(true)}});
 let ratio=1;const lockOn=()=>$('sh_lock').checked;
 $('sh_w').addEventListener('input',()=>{if(lockOn())$('sh_h').value=Math.max(4,Math.round((+$('sh_w').value||4)/ratio));fire(false)});
 $('sh_h').addEventListener('input',()=>{if(lockOn())$('sh_w').value=Math.max(4,Math.round((+$('sh_h').value||4)*ratio));fire(false)});
 $('sh_lock').addEventListener('change',()=>{ratio=(+$('sh_w').value||1)/(+$('sh_h').value||1)});
 $('sh_mode').addEventListener('change',()=>{if(!isPat(cur))userMode=$('sh_mode').value;visUI()});
 Object.keys(OVI).forEach(k=>{const e=$(OVI[k]),mark=()=>{touched[k]=1;visUI()};e.addEventListener('input',mark);e.addEventListener('change',mark)});
 $('sh_cfg').addEventListener('focusin',()=>{syncOv()});$('o_fm').addEventListener('change',()=>{visUI();live(true)});
 ['sh_w','sh_h','sh_rot','sh_n','sh_mode','sh_orig','sh_edge','sh_eow','sh_efw','sh_ehi',...Object.values(OVI)].forEach(id=>$(id).addEventListener('change',()=>{visUI();live(true)}));
 ['sh_rot','sh_n','sh_mode','sh_orig','sh_edge','sh_eow','sh_efw','sh_ehi',...Object.values(OVI)].forEach(id=>$(id).addEventListener('input',()=>{visUI();fire(false)}));
 new MutationObserver(()=>{paintCards();paintPrev()}).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']})}
bind();listUI();pick('star',true);icons($('w-shapes'));
return{setTab,insert,get cur(){return cur},_dbg:{ALL,gen,drawParts,defaults,pick,setTab}}})();
