'use strict';
(()=>{
const{TAU,pathPts,mirX}=SL;
const{rr,taper,eye,cheek}=globalThis.__E3;
const E=SL.E;
const put=(id,cat,name,g)=>{const i=E.findIndex(s=>s.id===id);SL.addE(id,cat,name,(R,p,nn)=>g(R));const s=E.pop();if(i>=0)E[i]=s;else E.push(s)};
const mir=a=>a.map(x=>({...x,pts:mirX(x.pts)}));
const rotD=(d,deg,cx,cy,mx)=>{const a=deg*Math.PI/180,c=Math.cos(a),s=Math.sin(a),t=d.match(/[MLCQZ]|-?\d*\.?\d+/g);let o='',i=0,buf=[];
 const flush=()=>{for(let k=0;k+1<buf.length;k+=2){let x=buf[k]-cx,y=buf[k+1]-cy;if(mx)x=-x;o+=(cx+x*c-y*s).toFixed(2)+' '+(cy+x*s+y*c).toFixed(2)+' '}buf=[]};
 for(const k of t){if(/[MLCQZ]/.test(k)){flush();o+=k+' '}else buf.push(+k)}flush();return o.trim()};
const FACE=(R,f,l)=>R.Ci(50,50,44,f||'ffd54f',l||'e6a700');
const BR='5d4037';
const eyeO=(R,x,y,rx,ry)=>[R.El(x,y,rx||5,ry||7,0,'4e342e',null),R.Ci(x+1.4,y-2.6,1.7,'ffffff',null)];
const drop=(cx,cy,w,h)=>`M${cx} ${cy-h} C${cx} ${cy-h} ${cx-w} ${cy-h*.2} ${cx-w} ${cy+h*.25} C${cx-w} ${cy+h*.75} ${cx-w*.5} ${cy+h} ${cx} ${cy+h} C${cx+w*.5} ${cy+h} ${cx+w} ${cy+h*.75} ${cx+w} ${cy+h*.25} C${cx+w} ${cy-h*.2} ${cx} ${cy-h} ${cx} ${cy-h} Z`;
const SK='ffca28',SKL='c79100',SKH='ffe082';

put('clover4','en','Trevo da sorte',R=>{
 const leaf='M50 46 C44 40 31 36 31 24 C31 14 44 10 50 21 C56 10 69 14 69 24 C69 36 56 40 50 46 Z';
 const inner='M50 42 C45 37 36 33 36 25 C36 19 44 17 50 25 C56 17 64 19 64 25 C64 33 55 37 50 42 Z';
 const out=[...R.Pl('M50 48 C52 66 44 80 46 97','2e7d32',.075),...R.Pl('M50 48 C52 66 44 80 46 97','43a047',.045)];
 [45,135,225,315].forEach(a=>{
  out.push(...R.Pf(rotD(leaf,a,50,46),'43a047','1b5e20'));
  out.push(...R.Pf(rotD(inner,a,50,46),'66bb6a',null));
  out.push(...R.Pl(rotD('M50 42 L50 26',a,50,46),'2e7d32',.025))});
 out.push(R.Ci(50,46,3.2,'2e7d32',null));return out});


})();
