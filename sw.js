'use strict';
const CACHE='athelis-static-v3',DB_NAME='athelis',DB_VERSION=1,STORES=['k','assets','scripts'];
function openDB(){return new Promise(res=>{try{const r=indexedDB.open(DB_NAME,DB_VERSION);r.onupgradeneeded=()=>{const d=r.result;STORES.forEach(n=>{if(!d.objectStoreNames.contains(n))d.createObjectStore(n)})};r.onsuccess=()=>res(r.result);r.onerror=()=>res(null)}catch(e){res(null)}})}
async function idbGet(key){const d=await openDB();if(!d)return null;return new Promise(res=>{try{const q=d.transaction('assets').objectStore('assets').get(key);q.onsuccess=()=>{d.close();res(q.result||null)};q.onerror=()=>{d.close();res(null)}}catch(e){res(null)}})}
async function idbPut(key,val){const d=await openDB();if(!d)return;return new Promise(res=>{try{const t=d.transaction('assets','readwrite');t.objectStore('assets').put(val,key);t.oncomplete=()=>{d.close();res()};t.onerror=()=>{d.close();res()}}catch(e){res()}})}
async function asset(req){
 const key=new URL(req.url).pathname,hit=await idbGet(key);
 if(hit)return new Response(hit.buf,{headers:{'Content-Type':hit.type}});
 const res=await fetch(req);
 if(res.ok&&res.status===200){const type=res.headers.get('Content-Type')||'application/octet-stream',buf=await res.clone().arrayBuffer();idbPut(key,{type,buf,t:Date.now()})}
 return res}
async function staleWhileRevalidate(req){
 const c=await caches.open(CACHE),hit=await c.match(req);
 const net=fetch(req).then(res=>{if(res&&res.ok)c.put(req,res.clone());return res}).catch(()=>null);
 return hit||(await net)||Response.error()}
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil((async()=>{for(const k of await caches.keys())if(k.indexOf('athelis-static-')===0&&k!==CACHE)await caches.delete(k);await self.clients.claim()})()));
self.addEventListener('fetch',e=>{
 const req=e.request,u=new URL(req.url);
 if(req.method!=='GET'||u.origin!==location.origin)return;
 if(u.pathname.indexOf('/assets/')>=0){e.respondWith(asset(req));return}
 if(req.cache==='no-store')return;
 if(/\.(js|css)$/.test(u.pathname)||/\/$|\.html$/.test(u.pathname))e.respondWith(staleWhileRevalidate(req))});
