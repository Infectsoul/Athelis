'use strict';
(()=>{
const IDX={br:0,en:1,es:2},LANGS=[['br','BR','Português (BR)','pt-BR'],['en','GB','English','en'],['es','ES','Español','es']];
const D=window.I18N_DATA||{};
let cur=(()=>{try{const v=localStorage.athelis_lang;return v in IDX?v:'br'}catch(e){return'br'}})();
const norm=s=>s.replace(/\s+/g,' ').trim();
const esc=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const exact=new Map(),pats=[],frag=[];
for(const k in D){
 if(/\{\d+\}/.test(k)){const nums=[],parts=k.split(/\{(\d+)\}/);let re='^';parts.forEach((p,i)=>{if(i%2)nums.push(+p),re+='([\\s\\S]*?)';else re+=esc(p)});pats.push({re:new RegExp(re+'$'),nums,v:D[k],len:k.length})}
 else{exact.set(k,D[k]);if(k.length>=5)frag.push(k)}
}
pats.sort((a,b)=>b.len-a.len);
frag.sort((a,b)=>b.length-a.length);
let FR=null;
try{const A='(?<![\\p{L}\\p{N}])',Z='(?![\\p{L}\\p{N}])',isL=ch=>/[\p{L}\p{N}]/u.test(ch);
 FR=new RegExp(frag.map(k=>(isL(k[0])?A:'')+esc(k)+(isL(k[k.length-1])?Z:'')).join('|'),'gu')}catch(e){FR=null}
const cache=[null,new Map(),new Map()];
function core(c,l){
 const ca=cache[l];let r=ca.get(c);if(r!==undefined)return r;
 const e=exact.get(c);
 if(e)r=e[l-1];
 else{
  r=c;
  for(const p of pats){const m=p.re.exec(c);if(m){r=p.v[l-1].replace(/\{(\d+)\}/g,(x,n)=>{const i=p.nums.indexOf(+n);return i<0?x:trl(m[i+1],l)});break}}
  if(r===c){const hm=/^(.{2,40}?): ((?:#?[0-9a-fA-F]{3,8}(?:, ?)?)+)$/.exec(c);if(hm&&exact.has(hm[1]))r=exact.get(hm[1])[l-1]+': '+hm[2]}
  if(r===c&&FR){r=c.replace(FR,x=>{const q=exact.get(x);return q?q[l-1]:x})}
 }
 ca.set(c,r);return r;
}
function tr(s,lang){return trl(s,IDX[lang||cur])}
function trl(s,l){
 if(!l||s==null||typeof s!=='string')return s;
 const m=/^(\s*)([\s\S]*?)(\s*)$/.exec(s),c=norm(m[2]);
 if(!c||!/[A-Za-zÀ-ÿ]/.test(c))return s;
 const r=core(c,l);return r===c?s:m[1]+r+m[3];
}
const ATTRS=['title','placeholder','aria-label','alt','data-title','data-off','data-on'],ASEL='[title],[placeholder],[aria-label],[alt],[data-title],[data-off],[data-on]';
const SKIPTAG=new Set(['SCRIPT','STYLE','TEXTAREA','CANVAS','NOSCRIPT','CODE']),SKIPSEL='[data-noi18n],#xout,#xta';
const TN=new WeakMap(),AN=new WeakMap();
function skip(el){return !el||SKIPTAG.has(el.nodeName)||(el.closest&&el.closest(SKIPSEL))}
function doText(n){
 const p=n.parentNode;if(!p||skip(p))return;
 let r=TN.get(n);const v=n.data;
 if(!r||v!==r.out){r={pt:v,out:v};TN.set(n,r)}
 const o=tr(r.pt);if(o!==v)n.data=o;r.out=o;
}
function doAttr(el,a){
 const v=el.getAttribute(a);if(v==null||skip(el))return;
 let m=AN.get(el);if(!m){m={};AN.set(el,m)}
 let r=m[a];if(!r||v!==r.out){r={pt:v,out:v};m[a]=r}
 const o=tr(r.pt);if(o!==v)el.setAttribute(a,o);r.out=o;
}
function scan(root){
 if(!root)return;
 if(root.nodeType===3){doText(root);return}
 if(root.nodeType!==1&&root.nodeType!==9&&root.nodeType!==11)return;
 if(root.nodeType===1){if(skip(root))return;ATTRS.forEach(a=>{if(root.hasAttribute(a))doAttr(root,a)})}
 const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT|NodeFilter.SHOW_ELEMENT,{acceptNode:n=>n.nodeType===1&&SKIPTAG.has(n.nodeName)?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT});
 let n;while(n=w.nextNode()){if(n.nodeType===3)doText(n);else if(n.hasAttributes())ATTRS.forEach(a=>{if(n.hasAttribute(a))doAttr(n,a)})}
}
const mo=new MutationObserver(ms=>{
 for(const m of ms){
  if(m.type==='childList')m.addedNodes.forEach(scan);
  else if(m.type==='characterData')doText(m.target);
  else if(m.type==='attributes')doAttr(m.target,m.attributeName);
 }
});
let on=false;
function observe(){if(on)return;on=true;mo.observe(document.documentElement,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:ATTRS})}
function unobserve(){if(!on)return;on=false;mo.disconnect()}
const _al=window.alert.bind(window),_co=window.confirm.bind(window),_pr=window.prompt.bind(window);
window.alert=m=>_al(tr(String(m)));
window.confirm=m=>_co(tr(String(m)));
window.prompt=(m,d)=>_pr(tr(String(m)),d);
window.T=s=>tr(s);
function flags(){
 document.querySelectorAll('#langbox button').forEach(b=>b.classList.toggle('on',b.dataset.lang===cur));
}
function set(l){
 if(!(l in IDX))return;
 cur=l;try{localStorage.athelis_lang=l}catch(e){}
 const L=LANGS.find(x=>x[0]===l);document.documentElement.lang=L[3];
 if(l==='br'){scan(document.documentElement);unobserve()}
 else{unobserve();scan(document.documentElement);observe()}
 flags();
 dispatchEvent(new CustomEvent('langchange',{detail:l}));
}
function build(){
 const hg=document.getElementById('theme')&&document.getElementById('theme').parentNode;if(!hg||document.getElementById('langbox'))return;
 const box=document.createElement('div');box.className='hg';box.id='langbox';box.setAttribute('data-noi18n','');
 LANGS.forEach(([k,f,name])=>{
  const b=document.createElement('button');b.type='button';b.dataset.lang=k;b.title=name;b.setAttribute('aria-label',name);
  const im=new Image();im.alt=f==='GB'?'EN':f;im.src='assets/language/'+f+'.png';im.draggable=false;
  im.onerror=()=>{const s=document.createElement('span');s.textContent=im.alt;s.className='lgtx';im.replaceWith(s)};
  b.appendChild(im);b.onclick=()=>set(k);box.appendChild(b)
 });
 hg.parentNode.insertBefore(box,hg);
 const sep=document.createElement('i');sep.className='vs';hg.parentNode.insertBefore(sep,hg);
 flags();
}
window.I18N={get lang(){return cur},set,tr,langs:LANGS};
document.documentElement.lang=LANGS.find(x=>x[0]===cur)[3];
if(cur!=='br')observe();
const init=()=>{build();if(cur!=='br')scan(document.documentElement)};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
