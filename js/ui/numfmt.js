'use strict';
const NUMFMT=(()=>{
const isEn=()=>typeof I18N!=='undefined'&&I18N.lang==='en';
function toText(el){if(el.type==='number'){el.dataset.numx='1';el.type='text';el.inputMode='decimal';el.autocomplete='off'}}
function toNum(el){if(el.dataset.numx&&el.type==='text'){el.type='number';el.removeAttribute('inputmode')}}
function apply(root){const en=isEn();(root||document).querySelectorAll(en?'input[type=number]':'input[data-numx]').forEach(en?toText:toNum)}
function clean(v){let s=v.replace(/,/g,'.').replace(/[^0-9.\-]/g,'');const i=s.indexOf('.');if(i>=0)s=s.slice(0,i+1)+s.slice(i+1).replace(/\./g,'');s=s.charAt(0)==='-'?'-'+s.slice(1).replace(/-/g,''):s.replace(/-/g,'');return s}
document.addEventListener('input',e=>{const el=e.target;if(!el||!el.dataset||!el.dataset.numx||el.type!=='text')return;const c=clean(el.value);if(c!==el.value){const p=el.selectionStart;el.value=c;try{el.setSelectionRange(p,p)}catch(x){}}},true);
document.addEventListener('keydown',e=>{const el=e.target;if(!el||!el.dataset||!el.dataset.numx||el.type!=='text'||e.ctrlKey||e.metaKey||e.altKey||e.key.length!==1)return;if(!/[0-9.,\-]/.test(e.key))e.preventDefault()},true);
addEventListener('langchange',()=>apply());
new MutationObserver(ms=>{if(!isEn())return;for(const m of ms)m.addedNodes.forEach(n=>{if(n.nodeType===1)apply(n)})}).observe(document.body,{childList:true,subtree:true});
apply();
return{apply}})();
