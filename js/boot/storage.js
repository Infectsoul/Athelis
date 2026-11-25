'use strict';
window.Athelis=(()=>{
const DB_NAME='athelis',DB_VERSION=1,STORES=['k','assets','scripts'];
try{
 if(!localStorage.athelis_migrated){
  Object.keys(localStorage).filter(k=>k.indexOf('vde_')===0).forEach(k=>{const n='athelis_'+k.slice(4);if(localStorage[n]===undefined)localStorage[n]=localStorage[k]});
  localStorage.athelis_migrated='1'}
}catch(e){}
let dbp=null;
function db(){
 if(dbp)return dbp;
 dbp=new Promise(res=>{
  try{
   const r=indexedDB.open(DB_NAME,DB_VERSION);
   r.onupgradeneeded=()=>{const d=r.result;STORES.forEach(n=>{if(!d.objectStoreNames.contains(n))d.createObjectStore(n)})};
   r.onsuccess=()=>res(r.result);
   r.onerror=()=>res(null);
   r.onblocked=()=>res(null);
  }catch(e){res(null)}
 }).then(async d=>{if(d)await migrateLegacy(d);return d});
 return dbp}
async function migrateLegacy(d){
 try{
  if(!indexedDB.databases)return;
  if(await get('k','legacyDone',d))return;
  const list=await indexedDB.databases();
  if(list.some(x=>x.name==='vde_auto')&&!(await get('k','last',d))){
   const old=await new Promise(res=>{const r=indexedDB.open('vde_auto',1);r.onsuccess=()=>{try{const q=r.result.transaction('k').objectStore('k').get('last');q.onsuccess=()=>{r.result.close();res(q.result)};q.onerror=()=>{r.result.close();res(null)}}catch(e){res(null)}};r.onerror=()=>res(null)});
   if(old)await put('k','last',old,d)}
  await put('k','legacyDone',1,d)
 }catch(e){}}
async function get(store,key,d){
 d=d||await db();if(!d)return null;
 return new Promise(res=>{try{const q=d.transaction(store).objectStore(store).get(key);q.onsuccess=()=>res(q.result===undefined?null:q.result);q.onerror=()=>res(null)}catch(e){res(null)}})}
async function put(store,key,val,d){
 d=d||await db();if(!d)return 0;
 return new Promise(res=>{try{const t=d.transaction(store,'readwrite');t.objectStore(store).put(val,key);t.oncomplete=()=>res(1);t.onerror=()=>res(0);t.onabort=()=>res(0)}catch(e){res(0)}})}
async function clear(store){
 const d=await db();if(!d)return 0;
 return new Promise(res=>{try{const t=d.transaction(store,'readwrite');t.objectStore(store).clear();t.oncomplete=()=>res(1);t.onerror=()=>res(0)}catch(e){res(0)}})}
return{db,get,put,clear,STORES}})();
