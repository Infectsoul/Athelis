'use strict';
const WM=(()=>{
const KEY='athelis_wm4',dockL=document.getElementById('dockL'),dockR=document.getElementById('dockR'),fl=document.getElementById('floats'),dz=document.getElementById('dz');
let st=JSON.parse(localStorage[KEY]||'{}'),Z=40,DEF={};const W={};
const save=()=>{localStorage[KEY]=JSON.stringify(st)};
const isOff=id=>!!(st._off&&st._off[id]);
const vis=()=>{[dockL,dockR].forEach(d=>{const any=[...d.querySelectorAll(':scope>.win')].some(w=>!w.hidden&&!w.classList.contains('off'));if(d===dockR){d.style.display='';d.classList.toggle('empty',!any&&!st._rail)}else d.style.display=any?'':'none'});rail()};
function updC(id){const w=W[id],s=st[id],b=w&&w.querySelector('.wh [data-wa="C"]');if(!b)return;b.innerHTML=ic(s.col?'chevron-right':'chevron-down',13);b.title=s.col?'Expandir':'Recolher'}
function place(id,idx,force){const w=W[id],s=st[id];w.classList.toggle('float',s.mode==='F');w.classList.toggle('col',!!s.col);w.classList.toggle('off',isOff(id));
 if(s.mode==='F'){fl.appendChild(w);w.style.left=(s.x??120)+'px';w.style.top=(s.y??90)+'px';w.style.width=(s.w||320)+'px';w.style.height=s.col?'':(s.h?s.h+'px':'');w.style.zIndex=++Z}
 else{const d=s.mode==='L'?dockL:dockR;w.style.left=w.style.top=w.style.zIndex='';w.style.width='';w.style.height=s.col?'':(s.dh?s.dh+'px':'');const kids=[...d.querySelectorAll(':scope>.win')];if(idx==null&&!force&&w.parentElement===d){ }else idx==null?d.appendChild(w):d.insertBefore(w,kids[idx]||null)}updC(id);vis()}
function anchorPos(){const xb=document.getElementById('xbar'),dr=dockR.getBoundingClientRect(),xr=xb.getBoundingClientRect();Object.keys(W).forEach(id=>{const s=st[id];if(!s||!s.anchor||s.mode!=='F')return;const w=W[id],ww=Math.min(s.w||340,innerWidth-dr.width-16),top=Math.max(46,dr.top+4),hh=Math.max(120,Math.min(s.h||340,xr.top-top));s.w=ww;s.h=hh;s.x=Math.max(8,Math.round(dr.left-ww));s.y=Math.round(xr.top-hh);w.style.width=ww+'px';w.style.height=s.col?'':hh+'px';w.style.left=s.x+'px';w.style.top=s.y+'px'})}
function init(defaults){DEF=defaults;if(!localStorage[KEY]){st._rail=true}document.querySelectorAll('.win').forEach(w=>{const id=w.id;W[id]=w;
  const head=document.createElement('div');head.className='wh';head.innerHTML=`<span class="wt">${ic(w.dataset.wic,14)}${w.dataset.title}</span><span class="wb"><button data-wa="L" title="Encaixar à esquerda">${ic('panel-left',13)}</button><button data-wa="F" title="Janela flutuante">${ic('app-window',13)}</button><button data-wa="R" title="Encaixar à direita">${ic('panel-right',13)}</button><button data-wa="C" title="Recolher / expandir">${ic('chevron-down',13)}</button></span>`;
  const body=document.createElement('div');body.className='wbody';while(w.firstChild)body.appendChild(w.firstChild);const ft=body.querySelector(':scope>.wfoot');w.append(head,body);if(ft)w.append(ft);
  const mkrz=(cls,tt,h,wd)=>{const d=document.createElement('div');d.className=cls;d.title=tt;d.onpointerdown=e=>{if(e.button!==0)return;e.preventDefault();e.stopPropagation();st[id].anchor=0;const r=w.getBoundingClientRect(),x0=e.clientX,y0=e.clientY;document.body.classList.add('rzing');
   const mv=ev=>{if(h)w.style.height=Math.max(80,Math.min(innerHeight*3,r.height+ev.clientY-y0))+'px';if(wd)w.style.width=Math.max(260,Math.min(innerWidth-20,r.width+ev.clientX-x0))+'px'};
   const up=()=>{removeEventListener('pointermove',mv);removeEventListener('pointerup',up);document.body.classList.remove('rzing');dispatchEvent(new Event('mouseup'))};addEventListener('pointermove',mv);addEventListener('pointerup',up)};w.appendChild(d)};
  mkrz('rz','Arraste para ajustar a altura',1,0);mkrz('rzr','Arraste para ajustar a largura',0,1);mkrz('rzc','Arraste para ajustar largura e altura',1,1);st[id]=st[id]||{...defaults[id]};
  head.onclick=e=>{const b=e.target.closest('[data-wa]');if(!b)return;const a=b.dataset.wa,s=st[id];if(a!=='C')s.anchor=0;if(a==='C'){s.col=!s.col;if(s.col)w.style.height='';else if(s.mode==='F'&&s.h)w.style.height=s.h+'px'}else{s.rail=0;if(a==='F'&&s.mode!=='F'){const r=w.getBoundingClientRect();s.x=Math.max(60,r.left-30);s.y=Math.max(50,r.top);s.w=Math.max(300,r.width);s.h=0}s.mode=a}place(id);save()};
  head.onpointerdown=e=>{if(e.target.closest('button'))return;const r=w.getBoundingClientRect(),ox=e.clientX-r.left,oy=e.clientY-r.top,x0=e.clientX,y0=e.clientY;let moved=0;
   const mv=ev=>{if(!moved&&Math.hypot(ev.clientX-x0,ev.clientY-y0)<5)return;if(!moved){moved=1;const s=st[id];s.anchor=0;if(s.mode!=='F'){s.mode='F';s.w=Math.max(300,r.width);s.h=0;s.x=r.left;s.y=r.top;place(id)}w.style.zIndex=++Z}
    w.style.left=Math.max(0,ev.clientX-ox)+'px';w.style.top=Math.max(0,ev.clientY-oy)+'px';const z=ev.clientX<80?'L':ev.clientX>innerWidth-80?'R':'';dz.className=z?'on '+z:''};
   const up=ev=>{removeEventListener('pointermove',mv);removeEventListener('pointerup',up);dz.className='';if(!moved)return;const s=st[id],z=ev.clientX<80?'L':ev.clientX>innerWidth-80?'R':'';
    if(z){s.mode=z;s.rail=0;const d=z==='L'?dockL:dockR;const kids=[...d.querySelectorAll(':scope>.win')].filter(k=>k!==w);let idx=kids.findIndex(k=>{const q=k.getBoundingClientRect();return ev.clientY<q.top+q.height/2});place(id,idx<0?null:idx)}else{s.x=parseFloat(w.style.left);s.y=parseFloat(w.style.top)}save()};
   addEventListener('pointermove',mv);addEventListener('pointerup',up)};
  w.addEventListener('pointerdown',()=>{if(st[id].mode==='F')w.style.zIndex=++Z});
  place(id)});
 mkBar();vis();anchorPos();addEventListener('resize',anchorPos);
 const dw=st._dock||{};if(dw.L)dockL.style.width=dw.L+'px';if(dw.R)dockR.style.width=dw.R+'px';
 const mainEl=document.querySelector('main'),spl=[];
 document.querySelectorAll('.dock>.split').forEach(sp=>{sp._d=sp.parentElement;mainEl.appendChild(sp);spl.push(sp)});
 const posSplit=()=>spl.forEach(sp=>{const d=sp._d,isL=d===dockL,off=d.classList.contains('rail')||d.classList.contains('empty')||!d.offsetWidth;sp.style.display=off?'none':'block';if(off)return;sp.style.left=(isL?d.offsetLeft+d.offsetWidth:d.offsetLeft-6)+'px'});
 try{const ro=new ResizeObserver(posSplit);ro.observe(dockL);ro.observe(dockR);ro.observe(mainEl);const mo=new MutationObserver(posSplit);[dockL,dockR].forEach(d=>mo.observe(d,{attributes:true,attributeFilter:['class','style']}))}catch(e){}
 addEventListener('resize',posSplit);posSplit();setTimeout(posSplit,300);
 document.querySelectorAll('.split').forEach(sp=>{sp.onpointerdown=e=>{e.preventDefault();const d=sp._d,isL=d===dockL,x0=e.clientX,w0=d.offsetWidth;const mv=ev=>{d.style.width=Math.max(220,Math.min(640,w0+(isL?ev.clientX-x0:x0-ev.clientX)))+'px';window.dispatchEvent(new Event('resize'))};const up=()=>{removeEventListener('pointermove',mv);removeEventListener('pointerup',up);st._dock={L:dockL.offsetWidth,R:dockR.offsetWidth};save()};addEventListener('pointermove',mv);addEventListener('pointerup',up)}});
 addEventListener('mouseup',()=>{let ch=0;Object.keys(W).forEach(id=>{const w=W[id],s=st[id];if(w.style.height&&!s.col){const h=parseFloat(w.style.height);if(s.mode==='F'){if(s.h!==h){s.h=h;ch=1}}else if(s.dh!==h){s.dh=h;ch=1}}if(s.mode==='F'&&w.style.width){const ww=parseFloat(w.style.width);if(s.w!==ww){s.w=ww;ch=1}}});if(ch)save()})}
function reset(){st={_rail:true};localStorage.removeItem(KEY);Object.keys(W).forEach(id=>{W[id].style.height=W[id].style.width='';st[id]={...DEF[id]};place(id,null,true)});dockL.style.width=dockR.style.width='';vis();anchorPos();save()}
function focus(id,pop){const s=st[id];if(!s)return;if(isOff(id)){if(!pop)return;delete st._off[id];W[id].classList.remove('off')}if(st._rail&&s.mode==='R'){if(!pop)return;railPop(id);return}s.col=0;const w=W[id];w.classList.remove('col');updC(id);w.style.height=s.mode==='F'?(s.h?s.h+'px':''):(s.dh?s.dh+'px':'');if(s.mode==='F')w.style.zIndex=++Z;save()}
function setHidden(id,h){const w=W[id];if(!w)return;w.hidden=h;vis()}
let bar=null,rl=null,tip=null,cfgBound=false;
function mkBar(){if(bar)return;bar=document.createElement('div');bar.className='dbar';
 bar.innerHTML=`<button type="button" class="dcol" data-d="C"></button><span class="dsp"></span><button type="button" class="dcfg" data-d="S" title="Configurar grupos: marcar/desmarcar quais janelas aparecem">${ic('settings',15)}</button>`;
 rl=document.createElement('div');rl.className='rlist';dockR.insertBefore(rl,dockR.firstChild);dockR.insertBefore(bar,dockR.firstChild);
 tip=document.createElement('div');tip.id='rtip';document.body.appendChild(tip);
 bar.onclick=e=>{const b=e.target.closest('[data-d]');if(!b)return;b.dataset.d==='C'?toggleRail():cfg()};
 rl.onclick=e=>{const b=e.target.closest('[data-id]');if(b){tip.classList.remove('on');railPop(b.dataset.id,b)}};
 rl.addEventListener('pointerover',e=>{const b=e.target.closest('[data-id]');if(!b)return;const r=b.getBoundingClientRect();tip.textContent=W[b.dataset.id].dataset.title;tip.style.top=(r.top+r.height/2)+'px';tip.style.right=(innerWidth-r.left+8)+'px';tip.classList.add('on')});
 rl.addEventListener('pointerleave',()=>tip.classList.remove('on'));
 rl.addEventListener('pointerout',e=>{if(!e.relatedTarget||!e.relatedTarget.closest||!e.relatedTarget.closest('[data-id]'))tip.classList.remove('on')})}
function rail(){if(!bar)return;const on=!!st._rail;dockR.classList.toggle('rail',on);
 const c=bar.querySelector('.dcol');c.innerHTML=on?ic('chevrons-left',17):ic('chevrons-right',15)+'<span>Recolher</span>';c.title=on?'Expandir o painel':'Recolher o painel (vira uma coluna de ícones)';c.classList.toggle('on',on);
 const ids=on?Object.keys(W).filter(id=>{const s=st[id],w=W[id];return s&&!w.hidden&&!isOff(id)&&(s.mode==='R'||s.rail)}):[];
 rl.innerHTML=ids.map(id=>`<button type=\"button\" data-id=\"${id}\" class=\"${st[id].rail&&st[id].mode==='F'?'on':''}\" aria-label=\"${W[id].dataset.title}\">${ic(W[id].dataset.wic,20)}</button>`).join('');rl.hidden=!on}
function railPop(id,btn){const s=st[id],w=W[id];if(!s||!w)return;
 if(s.mode==='F'&&s.rail){s.mode='R';s.rail=0;s.col=s.rc?1:0;place(id,Math.min(s.ri??1e3,dockR.querySelectorAll(':scope>.win').length),true);save();return}
 if(s.mode==='R'){const kids=[...dockR.querySelectorAll(':scope>.win')];s.ri=Math.max(0,kids.indexOf(w));s.rc=s.col?1:0;
  const r=(btn||dockR).getBoundingClientRect(),rw=dockR.getBoundingClientRect();s.mode='F';s.rail=1;s.col=0;s.w=Math.min(Math.max(s.w||0,340),innerWidth-rw.width-20);s.h=s.dh||0;
  s.x=Math.max(8,rw.left-s.w-8);s.y=Math.max(46,Math.min(r.top-8,innerHeight-320));place(id);save()}}
function toggleRail(){const on=!st._rail;st._rail=on;
 if(!on){Object.keys(W).filter(id=>st[id]&&st[id].rail).sort((a,b)=>(st[a].ri??99)-(st[b].ri??99)).forEach(id=>{const s=st[id];s.rail=0;s.mode='R';s.col=s.rc?1:0;place(id,Math.min(s.ri??1e3,dockR.querySelectorAll(':scope>.win').length),true)})}
 vis();anchorPos();save();dispatchEvent(new Event('resize'))}
function center(id,w,h){const s=st[id],el=W[id];if(!s||!el)return;if(isOff(id)){delete st._off[id]}
 const ww=Math.min(w||400,innerWidth-24),hh=Math.min(h||720,innerHeight-80);
 s.mode='F';s.rail=0;s.col=0;s.w=ww;s.h=hh;s.x=Math.max(8,Math.round((innerWidth-ww)/2));s.y=Math.max(46,Math.round((innerHeight-hh)/2+18));place(id);save()}
let cfgTab='win';
const tabsHTML=()=>`<div class="wtabs">${[['win','Janelas','layout-grid'],['tools','Ferramentas','wrench'],['keys','Atalho','keyboard']].map(([k,t,i])=>`<button type="button" data-tab="${k}" class="${cfgTab===k?'on':''}">${ic(i,14)}<span>${t}</span></button>`).join('')}</div>`;
function winHTML(){return`<p class="wcfgp">Marque os grupos que você usa. Os desmarcados ficam escondidos e deixam o painel mais limpo; você pode reativar aqui quando quiser.</p><div class="wcfg">${Object.keys(W).map(id=>{const w=W[id],off=isOff(id);return`<button type="button" class="wcard${off?'':' on'}" data-id="${id}" title="${off?'Mostrar':'Ocultar'}: ${w.dataset.title}"><span class="wci">${ic(w.dataset.wic,24)}</span><span class="wcn">${w.dataset.title}</span><span class="wck">${ic('check',12)}</span></button>`}).join('')}</div><div class="wcfgf"><button type="button" data-all="1">${ic('eye',14)}Mostrar todos</button><button type="button" data-all="0">${ic('eye-off',14)}Ocultar todos</button></div>`}
function cfgHTML(){const body=cfgTab==='win'?winHTML():typeof HK!=='undefined'?(cfgTab==='tools'?HK.toolsHTML():HK.keysHTML()):'';return tabsHTML()+`<div class="wtabbody">${body}</div>`}
function cfg(){if(typeof modal!=='function')return;if(typeof HK!=='undefined')HK.cancel();modal('Configurar grupos',cfgHTML());const mb=document.getElementById('mb');
 if(!cfgBound){cfgBound=true;mb.addEventListener('click',e=>{{const mt=document.getElementById('mt').textContent;if(mt!=='Configurar grupos'&&mt!==T('Configurar grupos'))return}
  const redraw=()=>{mb.innerHTML=cfgHTML()};
  const tb=e.target.closest('[data-tab]');if(tb){if(typeof HK!=='undefined')HK.cancel();cfgTab=tb.dataset.tab;redraw();return}
  if(cfgTab!=='win'){if(typeof HK!=='undefined')HK.cfgClick(e,redraw);return}
  const c=e.target.closest('.wcard'),a=e.target.closest('[data-all]');if(!c&&!a)return;st._off=st._off||{};
  if(c){const id=c.dataset.id;if(st._off[id])delete st._off[id];else st._off[id]=1}else Object.keys(W).forEach(id=>{if(a.dataset.all==='1')delete st._off[id];else st._off[id]=1});
  Object.keys(W).forEach(id=>W[id].classList.toggle('off',isOff(id)));vis();save();redraw()})}}
return{init,reset,focus,setHidden,center,cfg,toggleRail}})();

document.addEventListener('scroll',e=>{const t=e.target;
 if(t===document||t===document.documentElement||t===document.body){if(window.scrollX||window.scrollY)window.scrollTo(0,0);if(document.body.scrollTop)document.body.scrollTop=0;return}
 if(t&&t.classList&&(t.classList.contains('win')||t.classList.contains('wh')||t.id==='stage')){t.scrollTop=0;t.scrollLeft=0}},true);
