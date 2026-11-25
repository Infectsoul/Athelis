'use strict';
const STP=(()=>{
const dec=n=>{const s=String(n);const i=s.indexOf('.');return i<0?0:Math.min(8,s.length-i-1)};
function stepOf(el){let s=el.step;if(!s||s==='any'){const v=el.value;const d=v.indexOf('.')>=0?dec(v):0;return d?Math.pow(10,-Math.min(d,2)):1}return parseFloat(s)||1}
function bump(el,dir,mult){if(el.disabled||el.readOnly)return false;const st=stepOf(el)*mult,min=el.min!==''?parseFloat(el.min):-Infinity,max=el.max!==''?parseFloat(el.max):Infinity;
 let v=parseFloat(el.value);if(isNaN(v))v=isFinite(min)&&min>0?min:0;
 const p=Math.max(dec(st),dec(v),dec(el.step&&el.step!=='any'?el.step:'1'));let n=v+dir*st;n=+n.toFixed(Math.min(8,p));if(n<min)n=min;if(n>max)n=max;
 if(String(n)===String(v)&&el.value!=='')return false;el.value=String(n);const ev=new Event('input',{bubbles:true});ev.fromStep=true;el.dispatchEvent(ev);return true}
function wrap(el){if(el.dataset.nostep||el.closest('.nstep')||(el.type!=='number'&&!el.dataset.numx))return;
 const w=document.createElement('span');w.className='nstep'+(el.classList.contains('mini')?' mini':'');
 const mk=(d,ic_,t)=>{const b=document.createElement('button');b.type='button';b.className='ns '+(d<0?'ns-l':'ns-r');b.tabIndex=-1;b.title=t;b.setAttribute('aria-label',t);b.innerHTML=ic(ic_,12);b.dataset.d=d;return b};
 el.parentNode.insertBefore(w,el);w.append(mk(-1,'minus','Diminuir (Shift ×10 · Alt ×0,1)'),el,mk(1,'plus','Aumentar (Shift ×10 · Alt ×0,1)'))}
let held=null;
function stop(){if(!held)return;clearTimeout(held.t1);clearInterval(held.t2);const h=held;held=null;if(h.changed)h.el.dispatchEvent(new Event('change',{bubbles:true}))}
document.addEventListener('pointerdown',e=>{const b=e.target.closest&&e.target.closest('.nstep>button.ns');if(!b||e.button!==0)return;e.preventDefault();
 const el=b.parentNode.querySelector('input');if(!el||el.disabled)return;stop();const d=+b.dataset.d,mult=e.shiftKey?10:e.altKey?.1:1;
 held={el,changed:false};if(bump(el,d,mult))held.changed=true;
 held.t1=setTimeout(()=>{held&&(held.t2=setInterval(()=>{if(bump(el,d,mult))held.changed=true},55))},380)});
['pointerup','pointercancel','blur'].forEach(t=>addEventListener(t,stop));
function scan(root){(root.querySelectorAll?root.querySelectorAll('input[type=number],input[data-numx]'):[]).forEach(wrap);if(root.matches&&root.matches('input[type=number],input[data-numx]'))wrap(root)}
scan(document);
new MutationObserver(ms=>{for(const m of ms)m.addedNodes.forEach(n=>{if(n.nodeType===1&&!(n.classList&&n.classList.contains('nstep')))scan(n)})}).observe(document.body,{childList:true,subtree:true});
return{scan,wrap}})();
