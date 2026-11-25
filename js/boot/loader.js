'use strict';
(()=>{
const TTL=14*24*60*60*1000;
const MANIFEST=[
['js/i18n/i18n-data.js',1],['js/i18n/i18n.js',0],
['js/ui/icons.js',1],['js/ui/stepper.js',0],
['js/core/render.js',0],['js/core/geom.js',0],
['js/text/lfonts.js',1],['js/text/text.js',0],
['js/tools/img2lines.js',0],['js/tools/smart.js',0],
['js/ui/wm.js',0],['js/core/boolean.js',0],
['js/tools/tools2.js',0],['js/tools/colors.js',0],['js/tools/optimize.js',0],
['js/map/joints.js',0],['js/app/app.js',0],
['js/shapes/shapelib.js',1],['js/shapes/shapedefs.js',1],
['js/emojis/emojis.js',1],['js/emojis/emojis2.js',1],['js/emojis/emojis3.js',1],['js/emojis/emojis4.js',1],['js/emojis/emojis5.js',1],['js/emojis/emojis6.js',1],['js/emojis/emojisT.js',1],
['js/shapes/shapes.js',1],['js/ui/palettes.js',0],['js/core/paths.js',0],['js/ui/keys.js',0],['js/ui/numfmt.js',0]
];
const CV='r5',q=new URLSearchParams(location.search);
async function texts(){
 const out={},A=window.Athelis;
 if(q.has('nocache'))await A.clear('scripts');
 await Promise.all(MANIFEST.filter(m=>m[1]).map(async([p])=>{
  let r=await A.get('scripts',p+'#'+CV);
  if(!r||Date.now()-r.t>TTL){
   try{const res=await fetch(p,{cache:'no-store'});if(res.ok){r={text:await res.text(),t:Date.now()};A.put('scripts',p+'#'+CV,r)}}catch(e){}
  }
  if(r)out[p]=r.text}));
 return out}
function inject(p,text){return new Promise(res=>{
 const s=document.createElement('script');
 if(text!==undefined){s.textContent=text+'\n//# sourceURL='+p;document.body.appendChild(s);res()}
 else{s.src=p;s.onload=s.onerror=()=>res();document.body.appendChild(s)}})}
async function boot(){
 const T=await texts();
 for(const[p]of MANIFEST)await inject(p,T[p]);
 registerSW()}
function registerSW(){
 if(!('serviceWorker' in navigator))return;
 navigator.serviceWorker.register('sw.js').then(()=>navigator.serviceWorker.ready).then(()=>{
  const seen=performance.getEntriesByType('resource').map(r=>r.name).filter(u=>u.indexOf('/assets/')>=0);
  seen.forEach(u=>fetch(u).catch(()=>{}))}).catch(()=>{})}
boot();
})();
