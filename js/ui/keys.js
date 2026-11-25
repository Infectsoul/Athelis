'use strict';
const HK=(()=>{
const LS='athelis_keys3',TL='athelis_tools_off',MAP_TOOLS=['V','H'],$=id=>document.getElementById(id);
let custom={},off={},rec=null,redraw=null,cache=null;
try{custom=JSON.parse(localStorage[LS]||'{}')||{}}catch(e){custom={}}
try{off=JSON.parse(localStorage[TL]||'{}')||{}}catch(e){off={}}
const save=()=>{try{localStorage[LS]=JSON.stringify(custom);localStorage[TL]=JSON.stringify(off)}catch(e){}};
const toolName=t=>t[2].replace(/\s*\(.*$/,'');
function list(){if(cache)return cache;const A=[];
 TOOLS.forEach(t=>A.push({id:'tool:'+t[0],g:'Ferramentas',n:toolName(t),ic:t[1],def:[t[0]],run:()=>{if(toolHidden(t[0]))return;setTool(t[0])}}));
 A.push({id:'undo',g:'Edição',n:'Desfazer',ic:'undo-2',def:['Ctrl+Z'],run:()=>$('undo').click()});
 A.push({id:'redo',g:'Edição',n:'Refazer',ic:'redo-2',def:['Ctrl+Y','Ctrl+Shift+Z'],run:()=>$('redo').click()});
 A.push({id:'mode',g:'Visualização',n:'Alternar Desenhar / Mapa',ic:'map',def:['M'],run:()=>{const b=document.querySelector('#modes button:not(.on)');if(b)b.click()}});
 A.push({id:'base',g:'Visualização',n:'Mostrar/ocultar o mapa (no Desenhar) ou o desenho (no Mapa)',ic:'eye',def:['Shift+M'],run:()=>$('showmap').click()});
 A.push({id:'grid',g:'Visualização',n:'Mostrar/ocultar grade',ic:'grid-3x3',def:['G'],run:()=>$('gridon').click()});
 A.push({id:'fit',g:'Visualização',n:'Enquadrar mapa',ic:'focus',def:[],run:()=>$('fitb').click()});
 A.push({id:'theme',g:'Visualização',n:'Alternar tema claro / escuro',ic:'sun',def:[],run:()=>$('theme').click()});
 A.push({id:'cfg',g:'Visualização',n:'Configurar grupos',ic:'settings',def:[],run:()=>WM.cfg()});
 document.querySelectorAll('.win').forEach(w=>{const id=w.id;A.push({id:'win:'+id,g:'Janelas',n:w.dataset.title,ic:w.dataset.wic,def:id==='w-color'?['Ctrl+Shift+C']:id==='w-opt'?['Alt+O']:[],
  run:()=>{if(w.hidden)return;if(id==='w-color'&&typeof CA!=='undefined')CA.open(selCount()?'sel':undefined);else if(id==='w-opt'&&typeof SO!=='undefined')SO.open(selCount()?'sel':undefined);else WM.focus(id,true)}})});
 cache=A;return A}
const keysOf=a=>custom[a.id]!==undefined?custom[a.id]:a.def;
function index(){const m=new Map();list().forEach(a=>keysOf(a).forEach(k=>m.set(k,a)));return m}
function evKey(e){const k=e.key;if(!k||['Control','Shift','Alt','Meta'].includes(k))return null;
 const p=[];if(e.ctrlKey||e.metaKey)p.push('Ctrl');if(e.altKey)p.push('Alt');if(e.shiftKey)p.push('Shift');
 let n=k.length===1?k.toUpperCase():k;if(n===' ')n='Space';
 if(k.length===1&&e.shiftKey&&!/[a-zA-Z]/.test(k)){p.splice(p.indexOf('Shift'),1)}
 p.push(n);return p.join('+')}
function toolHidden(t){return !!off[t]||(S.mode==='map'&&!MAP_TOOLS.includes(t))}
function applyTools(){const box=$('tools');if(!box)return;let seen=false,grp=false,lastHs=null;
 [...box.children].forEach(c=>{if(c.classList.contains('hs')){c.hidden=true;lastHs=c;grp=false;return}
  const h=toolHidden(c.dataset.t);c.hidden=h;if(!h){if(lastHs&&seen&&!grp)lastHs.hidden=false;grp=true;seen=true}});
 if(S.tool&&toolHidden(S.tool)){const f=[...box.querySelectorAll('button')].find(b=>!b.hidden);if(f&&f.dataset.t!==S.tool)setTool(f.dataset.t)}}
function badges(){const m={};list().forEach(a=>{if(a.id.startsWith('tool:'))m[a.id.slice(5)]=keysOf(a)[0]||''});
 document.querySelectorAll('#tools button').forEach(b=>{const e=b.querySelector('b');if(e){const k=m[b.dataset.t]||'';e.textContent=k.length>3?'':k}})}
function setKeys(id,arr){custom[id]=arr;save();badges()}
function assign(id,key){list().forEach(a=>{const k=keysOf(a);if(a.id!==id&&k.includes(key))setKeys(a.id,k.filter(x=>x!==key))});const a=list().find(x=>x.id===id),k=keysOf(a);if(!k.includes(key))setKeys(id,k.concat([key]))}
addEventListener('keydown',e=>{
 if(rec){e.preventDefault();e.stopImmediatePropagation();if(e.key==='Escape'){rec=null}else{const k=evKey(e);if(!k)return;assign(rec,k);rec=null}if(redraw)redraw();return}
 const t=e.target;if(t&&(/INPUT|TEXTAREA|SELECT/.test(t.tagName)||t.isContentEditable))return;
 const md=$('modal');if(md&&!md.hidden)return;
 const k=evKey(e);if(!k)return;const a=index().get(k);if(!a)return;
 e.preventDefault();e.stopImmediatePropagation();a.run()},true);
const chip=k=>`<span class="kchip" data-k="${k}">${k}<button type="button" data-kdel="${k}" title="Remover atalho">×</button></span>`;
function keysHTML(){const gs=[];list().forEach(a=>{let g=gs.find(x=>x.n===a.g);if(!g)gs.push(g={n:a.g,l:[]});g.l.push(a)});
 return`<p class="wcfgp">Clique em + e pressione a tecla ou combinação (Ctrl, Alt, Shift). Cada comando aceita vários atalhos. Esc cancela. Se a combinação já existir em outro comando, ela passa para este.</p>`+gs.map(g=>`<div class="kgrp"><div class="kgt">${g.n}</div>${g.l.map(a=>{const ks=keysOf(a);return`<div class="krow" data-a="${a.id}"><span class="kn">${ic(a.ic,14)}<span>${a.n}</span></span><span class="kk">${ks.length?ks.map(chip).join(''):'<em class="knone">Sem atalho</em>'}<button type="button" class="kadd${rec===a.id?' rec':''}" data-kadd="${a.id}" title="Adicionar atalho">${rec===a.id?'Pressione uma tecla…':ic('plus',13)}</button></span></div>`}).join('')}</div>`).join('')+`<div class="wcfgf"><button type="button" data-kreset="1">${ic('rotate-ccw',14)}Restaurar padrões</button></div>`}
function toolsHTML(){return`<p class="wcfgp">Marque as ferramentas que aparecem no painel da esquerda. As desmarcadas ficam escondidas. No modo Mapa só aparecem as que funcionam nele.</p><div class="wcfg">${TOOLS.map(t=>{const o=!!off[t[0]];return`<button type="button" class="wcard${o?'':' on'}" data-tool="${t[0]}" title="${o?'Mostrar':'Ocultar'}: ${toolName(t)}"><span class="wci">${ic(t[1],24)}</span><span class="wcn">${toolName(t)}</span><span class="wck">${ic('check',12)}</span></button>`}).join('')}</div><div class="wcfgf"><button type="button" data-tall="1">${ic('eye',14)}Mostrar todas</button><button type="button" data-tall="0">${ic('eye-off',14)}Ocultar todas</button></div>`}
function cfgClick(e,rd){redraw=rd;const t=e.target;let b;
 if(b=t.closest('[data-kadd]')){rec=rec===b.dataset.kadd?null:b.dataset.kadd;rd();return true}
 if(rec){rec=null;rd()}
 if(b=t.closest('[data-kdel]')){const id=b.closest('.krow').dataset.a,a=list().find(x=>x.id===id);setKeys(id,keysOf(a).filter(x=>x!==b.dataset.kdel));rd();return true}
 if(t.closest('[data-kreset]')){custom={};save();badges();rd();return true}
 if(b=t.closest('[data-tool]')){const k=b.dataset.tool;if(off[k])delete off[k];else off[k]=1;save();applyTools();rd();return true}
 if(b=t.closest('[data-tall]')){TOOLS.forEach(x=>{if(b.dataset.tall==='1')delete off[x[0]];else off[x[0]]=1});save();applyTools();rd();return true}
 return false}
function cancel(){rec=null}
function init(){applyTools();badges();$('modes').addEventListener('click',()=>setTimeout(applyTools,0));if(typeof SO!=='undefined')SO.init()}
return{init,list,toolsHTML,keysHTML,cfgClick,cancel,applyTools}})();
if(typeof document!=='undefined'&&document.getElementById('tools'))HK.init();
