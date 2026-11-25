'use strict';
(()=>{
const{TAU,pathPts}=SL;
const E=SL.E;
const redefE=(id,g)=>{const i=E.findIndex(s=>s.id===id);if(i<0)return;const old=E[i];SL.addE(id,old.cat,old.n,(R,p,nn)=>g(R));const s=E.pop();E[i]=s};
const add=(id,cat,n,g)=>SL.addE(id,cat,n,(R,p,nn)=>g(R));
const rr=(x0,y0,x1,y1,r)=>`M${x0+r} ${y0} H${x1-r} Q${x1} ${y0} ${x1} ${y0+r} V${y1-r} Q${x1} ${y1} ${x1-r} ${y1} H${x0+r} Q${x0} ${y1} ${x0} ${y1-r} V${y0+r} Q${x0} ${y0} ${x0+r} ${y0} Z`;
const taper=(R,d,w0,w1,f,l,x)=>{const sp=pathPts(d,Math.max(24,R.n))[0].pts,n=sp.length,L=[],Rg=[];const cum=[0];for(let i=1;i<n;i++)cum.push(cum[i-1]+Math.hypot(sp[i][0]-sp[i-1][0],sp[i][1]-sp[i-1][1]));const T=cum[n-1]||1;
 for(let i=0;i<n;i++){const a=sp[Math.max(0,i-1)],b=sp[Math.min(n-1,i+1)];let dx=b[0]-a[0],dy=b[1]-a[1];const m=Math.hypot(dx,dy)||1;dx/=m;dy/=m;const w=(w0+(w1-w0)*cum[i]/T)/100;L.push([sp[i][0]-dy*w,sp[i][1]+dx*w]);Rg.push([sp[i][0]+dy*w,sp[i][1]-dx*w])}
 const e=sp[n-1],a=sp[n-2],ang=Math.atan2(e[1]-a[1],e[0]-a[0]),we=w1/100,cap=[];for(let k=1;k<10;k++){const t=ang-Math.PI/2+Math.PI*k/10;cap.push([e[0]+Math.cos(t)*we,e[1]+Math.sin(t)*we])}
 return R.fp([...L,...cap.reverse(),...Rg.reverse()],f,l,x)};
const eye=(R,x,y,r,pr)=>{const p=pr||r*.55;return[R.Ci(x,y,r,'ffffff','5d4037'),R.Ci(x+r*.12,y+r*.1,p,'3e2723',null),R.Ci(x+r*.12-p*.3,y+r*.1-p*.35,p*.3,'ffffff',null)]};
const cheek=(R,x,y,rx,ry,c)=>R.El(x,y,rx,ry,0,c||'ff8a80',null);
globalThis.__E3={rr,taper,eye,cheek,add,redefE};








const FACE=(R,f,l)=>R.Ci(50,50,44,f||'ffd54f',l||'e6a700');
const eyeO=(R,x,y,rx,ry,c)=>R.El(x,y,rx||5.2,ry||7.4,0,c||'4e342e',null);
const hp=(cx,cy,s)=>`M${cx} ${cy+s*.95} C${cx-s*1.45} ${cy-s*.05} ${cx-s*1.15} ${cy-s*1.0} ${cx-s*.45} ${cy-s*.98} C${cx-s*.2} ${cy-s*.96} ${cx} ${cy-s*.78} ${cx} ${cy-s*.5} C${cx} ${cy-s*.78} ${cx+s*.2} ${cy-s*.96} ${cx+s*.45} ${cy-s*.98} C${cx+s*1.15} ${cy-s*1.0} ${cx+s*1.45} ${cy-s*.05} ${cx} ${cy+s*.95} Z`;
const star=(cx,cy,Ro,ri,n,a0)=>{let d='';for(let i=0;i<n*2;i++){const a=(a0===undefined?-Math.PI/2:a0)+i*Math.PI/n,r=i%2?ri:Ro;d+=(i?'L':'M')+(cx+Math.cos(a)*r).toFixed(2)+' '+(cy+Math.sin(a)*r).toFixed(2)+' '}return d+'Z'};
const drop=(cx,cy,w,h)=>`M${cx} ${cy-h} C${cx} ${cy-h} ${cx-w} ${cy-h*.2} ${cx-w} ${cy+h*.25} C${cx-w} ${cy+h*.75} ${cx-w*.5} ${cy+h} ${cx} ${cy+h} C${cx+w*.5} ${cy+h} ${cx+w} ${cy+h*.75} ${cx+w} ${cy+h*.25} C${cx+w} ${cy-h*.2} ${cx} ${cy-h} ${cx} ${cy-h} Z`;
const BR='5d4037',MD='4e1f10';
globalThis.__E3.u={FACE,eyeO,hp,star,drop};

add('joy','ef','Carinha chorando de rir',R=>[
 FACE(R),
 ...R.Pl('M20 40 Q30 28 42 38','4e342e',.07),...R.Pl('M80 40 Q70 28 58 38','4e342e',.07),
 ...R.Pf('M22 54 Q50 50 78 54 C78 78 64 90 50 90 C36 90 22 78 22 54 Z',MD,null),
 ...R.Pf('M24 55 Q50 51 76 55 L75 62 Q50 58 25 62 Z','ffffff',null),
 ...R.Pf('M34 82 C38 72 62 72 66 82 C60 90 40 90 34 82 Z','ff6f7d',null),
 cheek(R,18,62,5,3.2),cheek(R,82,62,5,3.2),
 ...R.Pf(drop(12,50,5.6,9),'4fc3f7','0288d1'),...R.Pf(drop(88,50,5.6,9),'4fc3f7','0288d1')]);

add('hearteyes','ef','Carinha apaixonada (olhos de coração)',R=>[
 FACE(R),
 ...R.Pf(hp(33,40,10.5),'e53935','a8143f'),...R.Pf(hp(67,40,10.5),'e53935','a8143f'),
 R.Ci(29,35,2.2,'ffcdd2',null),R.Ci(63,35,2.2,'ffcdd2',null),
 ...R.Pf('M24 62 Q50 66 76 62 C74 80 62 90 50 90 C38 90 26 80 24 62 Z',MD,null),
 ...R.Pf('M26 63 Q50 67 74 63 L73 69 Q50 73 27 69 Z','ffffff',null),
 ...R.Pf('M36 84 C42 76 58 76 64 84 C58 90 42 90 36 84 Z','ff6f7d',null)]);

add('starstruck','ef','Carinha deslumbrada',R=>[
 FACE(R),
 ...R.Pf(star(32,40,15,6.4,5),'ffeb3b','f9a825'),...R.Pf(star(68,40,15,6.4,5),'ffeb3b','f9a825'),
 ...R.Pf('M24 62 Q50 66 76 62 C74 80 62 90 50 90 C38 90 26 80 24 62 Z',MD,null),
 ...R.Pf('M26 63 Q50 67 74 63 L73 69 Q50 73 27 69 Z','ffffff',null),
 ...R.Pf('M36 84 C42 76 58 76 64 84 C58 90 42 90 36 84 Z','ff6f7d',null)]);

add('pleading','ef','Carinha suplicante',R=>[
 FACE(R),
 ...R.Pl('M18 36 Q26 24 42 30','5d4037',.05),...R.Pl('M82 36 Q74 24 58 30','5d4037',.05),
 R.El(33,48,11,13,0,'4e342e',null),R.El(67,48,11,13,0,'4e342e',null),
 R.Ci(29,42,4.6,'ffffff',null),R.Ci(63,42,4.6,'ffffff',null),R.Ci(38,55,2.2,'ffffff',null),R.Ci(72,55,2.2,'ffffff',null),
 ...R.Pl('M42 78 Q46 74 50 77 Q54 74 58 78','5d4037',.04),
 cheek(R,17,64,5,3.2),cheek(R,83,64,5,3.2)]);


add('rage','ef','Carinha furiosa',R=>[
 FACE(R,'ef5350','b71c1c'),
 ...R.Pf('M20 30 L46 42 L44 50 L18 40 Z','4e342e',null),...R.Pf('M80 30 L54 42 L56 50 L82 40 Z','4e342e',null),
 R.El(34,52,5.4,6.2,0,'3e2723',null),R.El(66,52,5.4,6.2,0,'3e2723',null),
 ...R.Pl('M32 78 Q50 62 68 78','3e2723',.07)]);

add('hot','ef','Carinha com calor',R=>[
 FACE(R,'ff8a65','d84315'),
 ...R.Pl('M20 38 Q30 32 42 38','5d4037',.05),...R.Pl('M80 38 Q70 32 58 38','5d4037',.05),
 R.El(32,46,6,4.6,0,'ffffff','5d4037'),R.El(68,46,6,4.6,0,'ffffff','5d4037'),R.Ci(33,46,2.6,'3e2723',null),R.Ci(67,46,2.6,'3e2723',null),
 ...R.Pf('M28 62 Q50 58 72 62 C72 78 62 86 50 86 C38 86 28 78 28 62 Z',MD,null),
 ...R.Pf('M40 76 C40 70 60 70 60 76 L60 92 C60 98 40 98 40 92 Z','ff5c6a','c2185b'),...R.Pl('M50 76 V90','c2185b',.02),
 ...R.Pf(drop(10,36,4.6,7.5),'4fc3f7','0288d1'),...R.Pf(drop(92,52,4,6.5),'4fc3f7','0288d1'),...R.Pf(drop(17,62,3.6,6),'4fc3f7','0288d1')]);

add('cold','ef','Carinha com frio',R=>[
 FACE(R,'b3e5fc','4aa3d6'),
 ...R.Pl('M20 36 Q30 30 42 36','37719b',.05),...R.Pl('M80 36 Q70 30 58 36','37719b',.05),
 ...eye(R,34,46,8,4),...eye(R,66,46,8,4),
 ...R.Pf('M26 64 H74 V76 C74 80 70 82 66 82 H34 C30 82 26 80 26 76 Z','ffffff','4aa3d6'),
 ...R.Pl('M26 70 H74 M38 64 V82 M50 64 V82 M62 64 V82','4aa3d6',.02),
 cheek(R,17,58,5,3.2,'90caf9'),cheek(R,83,58,5,3.2,'90caf9')]);

add('money','ef','Carinha de dinheiro',R=>[
 FACE(R),
 ...R.Pl('M24 34 Q32 26 42 34','5d4037',.04),...R.Pl('M76 34 Q68 26 58 34','5d4037',.04),
 R.Ci(33,42,10.5,'66bb6a','2e7d32'),R.Ci(67,42,10.5,'66bb6a','2e7d32'),
 ...R.Pl('M36 37 C36 33 30 33 30 37 C30 41 36 41 36 45 C36 49 30 49 30 45','ffffff',.035),...R.Pl('M33 31 V51','ffffff',.03),
 ...R.Pl('M70 37 C70 33 64 33 64 37 C64 41 70 41 70 45 C70 49 64 49 64 45','ffffff',.035),...R.Pl('M67 31 V51','ffffff',.03),
 ...R.Pf('M26 62 Q50 68 74 62 C72 80 62 90 50 90 C38 90 28 80 26 62 Z',MD,null),
 ...R.Pf('M28 63 Q50 69 72 63 L71 69 Q50 75 29 69 Z','ffffff',null),
 ...R.Pf('M40 82 C40 76 60 76 60 82 L60 92 C60 98 40 98 40 92 Z','66bb6a','2e7d32'),...R.Pl('M50 82 V92','2e7d32',.02)]);


add('mask','ef','Carinha de máscara',R=>[
 FACE(R),
 ...R.Pl('M20 34 Q30 28 42 34','5d4037',.045),...R.Pl('M80 34 Q70 28 58 34','5d4037',.045),
 eyeO(R,35,42),eyeO(R,65,42),
 ...R.Pl('M18 62 Q10 58 8 50','90caf9',.025),...R.Pl('M82 62 Q90 58 92 50','90caf9',.025),
 ...R.Pf('M18 56 Q50 52 82 56 C84 74 70 90 50 90 C30 90 16 74 18 56 Z','90caf9','42a5f5'),
 ...R.Pl('M24 66 Q50 62 76 66','e3f2fd',.03),...R.Pl('M26 74 Q50 70 74 74','e3f2fd',.03),...R.Pl('M32 82 Q50 78 68 82','e3f2fd',.03)]);


add('clown','ef','Palhaço',R=>[
 R.Ci(11,36,12,'e53935','b71c1c'),R.Ci(89,36,12,'e53935','b71c1c'),R.Ci(24,22,10,'e53935','b71c1c'),R.Ci(76,22,10,'e53935','b71c1c'),
 R.Ci(50,52,43,'fafafa','9e9e9e'),
 ...R.Pf('M26 34 L36 24 L46 34 L36 44 Z','42a5f5','1565c0'),...R.Pf('M54 34 L64 24 L74 34 L64 44 Z','42a5f5','1565c0'),
 R.Ci(36,34,4.4,'3e2723',null),R.Ci(64,34,4.4,'3e2723',null),
 R.Ci(50,52,8.5,'e53935','b71c1c'),R.Ci(47,49,2.4,'ffcdd2',null),
 ...R.Pf('M22 62 Q50 96 78 62 Q50 76 22 62 Z','e53935','b71c1c')]);

add('poop','ef','Cocô sorridente',R=>[
 ...R.Pf('M14 88 C3 88 2 70 16 66 H84 C98 70 97 88 86 88 Z','8d5524','5d3a1a'),
 ...R.Pf('M22 68 C10 66 12 50 26 47 H74 C88 50 90 66 78 68 Z','8d5524','5d3a1a'),
 ...R.Pf('M32 49 C22 46 27 31 40 29 C45 21 53 18 56 8 C66 14 68 27 70 30 C78 34 80 46 68 49 Z','8d5524','5d3a1a'),
 ...R.Pl('M30 78 Q34 74 40 76','b57a3d',.03),...R.Pl('M34 58 Q38 55 44 57','b57a3d',.03),
 ...eye(R,38,56,6.2,3.2),...eye(R,62,56,6.2,3.2),
 ...R.Pl('M38 72 Q50 82 62 72','3e2723',.05)]);

add('cowboy','ef','Carinha de cowboy',R=>[
 R.Ci(50,58,38,'ffd54f','e6a700'),
 ...R.Pf('M30 30 C28 8 40 4 50 10 C60 4 72 8 70 30 Z','a1673a','6d4120'),
 ...R.Pf('M6 34 C14 44 86 44 94 34 C88 22 72 28 50 28 C28 28 12 22 6 34 Z','c58a50','6d4120'),
 ...R.Pl('M31 28 Q50 34 69 28','5d3a1a',.055),
 eyeO(R,36,52,4.6,6.4),eyeO(R,64,52,4.6,6.4),
 ...R.Pl('M30 68 Q50 88 70 68','5d4037',.055)]);

add('confused','ef','Carinha confusa',R=>[
 FACE(R),
 ...R.Pl('M20 34 Q30 30 42 36','5d4037',.045),...R.Pl('M58 30 Q69 24 80 30','5d4037',.045),
 eyeO(R,35,44),eyeO(R,65,44),
 ...R.Pl('M30 70 Q38 64 46 70 Q54 76 62 70 Q66 67 70 69','5d4037',.05)]);

add('worried','ef','Carinha preocupada',R=>[
 FACE(R),
 ...R.Pl('M20 36 Q30 34 42 26','5d4037',.045),...R.Pl('M80 36 Q70 34 58 26','5d4037',.045),
 eyeO(R,35,46),eyeO(R,65,46),R.Ci(31,43,2,'ffffff',null),R.Ci(61,43,2,'ffffff',null),
 ...R.Pl('M34 74 Q50 64 66 74','5d4037',.055)]);

add('slight','ef','Carinha levemente sorrindo',R=>[
 FACE(R),
 eyeO(R,35,40),eyeO(R,65,40),R.Ci(33,36,2,'8d6e63',null),R.Ci(63,36,2,'8d6e63',null),
 ...R.Pl('M30 64 Q50 80 70 64','5d4037',.055)]);

const heartC=(id,n,f,l,hl)=>add(id,'es',n,R=>[...R.Pf(hp(50,48,34),f,l),...R.Pl('M26 30 C28 24 33 21 38 22',hl,.05)]);
heartC('heartB','Coração azul','1e88e5','0d47a1','bbdefb');
heartC('heartG','Coração verde','43a047','1b5e20','c8e6c9');
heartC('heartY','Coração amarelo','fdd835','c79100','fff9c4');
heartC('heartP','Coração roxo','8e24aa','4a148c','e1bee7');
heartC('heartK','Coração preto','37474f','000000','90a4ae');
heartC('heartO','Coração laranja','fb8c00','bf5b00','ffe0b2');

const ring0=(cx)=>`M${cx} 34 C${cx-12} 34 ${cx-13} 42 ${cx-13} 54 C${cx-13} 66 ${cx-12} 74 ${cx} 74 C${cx+12} 74 ${cx+13} 66 ${cx+13} 54 C${cx+13} 42 ${cx+12} 34 ${cx} 34 Z`;
add('hundred','es','Cem pontos',R=>{const C='e53935',D='b71c1c',o=[];
 [['M12 46 L24 34 V74'],[ring0(46)],[ring0(76)]].forEach(([d])=>{o.push(...R.Pl(d,D,.125))});[['M12 46 L24 34 V74'],[ring0(46)],[ring0(76)]].forEach(([d])=>{o.push(...R.Pl(d,C,.095))});
 o.push(...R.Pl('M12 86 H90',D,.1),...R.Pl('M12 86 H90',C,.07),...R.Pl('M20 96 H82',D,.1),...R.Pl('M20 96 H82',C,.07));return o});

add('snowflake','en','Floco de neve',R=>{const arm=[...R.Pl('M50 50 V8','4fc3f7',.07),...R.Pl('M50 24 L38 12 M50 24 L62 12','4fc3f7',.05),...R.Pl('M50 38 L41 30 M50 38 L59 30','4fc3f7',.04)],o=[];
 for(let k=0;k<6;k++)arm.forEach(p=>o.push({...p,pts:SL.rot(p.pts,k*Math.PI/3)}));o.push(R.Ci(50,50,4.5,'e1f5fe','4fc3f7'));return o});

add('balloon','eo','Balão',R=>[
 ...R.Pl('M50 82 C44 88 56 92 50 99','9e9e9e',.025),
 ...R.Pf('M50 82 L44 90 H56 Z','c62828','7f1414'),
 ...R.Pf('M50 82 C28 74 14 56 14 38 C14 18 30 6 50 6 C70 6 86 18 86 38 C86 56 72 74 50 82 Z','ef5350','b71c1c'),
 ...R.Pl('M26 40 C26 28 32 20 42 15','ffcdd2',.05)]);

add('tada','eo','Festa (confete)',R=>[
 ...R.Pf('M10 92 L36 34 L66 64 Z','ffb300','c77800'),
 ...R.Pf('M10 92 L36 34 L40 38 L16 90 Z','ffd54f',null),
 ...R.Pl('M24 62 L46 74','e65100',.045),...R.Pl('M16 78 L36 90','e65100',.045),...R.Pl('M30 48 L54 62','e65100',.04),
 ...R.Pl('M44 28 C52 16 52 8 58 4','ec407a',.04),...R.Pl('M62 44 C72 40 80 44 90 38','42a5f5',.04),...R.Pl('M70 62 C78 62 84 66 94 62','66bb6a',.04),
 ...R.Pf(rr(54,14,64,22,2),'ffee58','c9b800'),...R.Pf(rr(76,22,84,30,2),'ec407a','a00037'),...R.Pf(rr(84,48,94,56,2),'66bb6a','2e7d32'),
 R.Ci(70,22,3.2,'42a5f5',null),R.Ci(88,12,3,'ffee58',null),R.Ci(50,8,3,'ab47bc',null)]);

add('soccer','eo','Bola de futebol',R=>{const pent=(cx,cy,r,a0)=>star(cx,cy,r,r*.809,5,a0).replace(/L/g,'L'),o=[R.Ci(50,50,44,'fafafa','37474f')],ang=-Math.PI/2;
 const pts=(cx,cy,r,a0)=>{const q=[];for(let i=0;i<5;i++){const a=a0+i*TAU/5;q.push([cx+Math.cos(a)*r,cy+Math.sin(a)*r])}return q},path=q=>'M'+q.map(p=>p[0].toFixed(2)+' '+p[1].toFixed(2)).join(' L')+' Z';
 const c=pts(50,50,13,ang);o.push(...R.Pf(path(c),'263238','263238'));
 c.forEach((p,i)=>{const a=ang+i*TAU/5,x1=50+Math.cos(a)*30,y1=50+Math.sin(a)*30;o.push(...R.Pl(`M${p[0].toFixed(2)} ${p[1].toFixed(2)} L${x1.toFixed(2)} ${y1.toFixed(2)}`,'37474f',.03));
  const o5=pts(50+Math.cos(a)*35.5,50+Math.sin(a)*35.5,7.2,a+Math.PI);o.push(...R.Pf(path(o5),'263238','263238'))});
 return o});

add('basketball','eo','Bola de basquete',R=>[
 R.Ci(50,50,44,'fb8c00','5d2f00'),
 ...R.Pl('M50 6 V94','5d2f00',.03),...R.Pl('M6 50 H94','5d2f00',.03),
 ...R.Pl('M18 18 C34 34 34 66 18 82','5d2f00',.03),...R.Pl('M82 18 C66 34 66 66 82 82','5d2f00',.03),
 ...R.Pl('M24 22 C32 14 40 10 48 8','ffcc80',.03)]);

add('speech','es','Balão de fala',R=>[
 ...R.Pf('M14 12 H86 C92 12 96 16 96 22 V58 C96 64 92 68 86 68 H52 L30 90 V68 H14 C8 68 4 64 4 58 V22 C4 16 8 12 14 12 Z','ffffff','90a4ae'),
 R.Ci(30,40,5.5,'607d8b',null),R.Ci(50,40,5.5,'607d8b',null),R.Ci(70,40,5.5,'607d8b',null)]);

add('thought','es','Balão de pensamento',R=>[
 ...R.Pf('M26 12 C14 12 8 22 12 32 C4 38 6 52 18 54 C20 66 40 68 50 62 C62 68 82 66 86 54 C98 50 96 36 88 32 C92 20 80 10 68 14 C60 6 36 4 26 12 Z','ffffff','90a4ae'),
 R.Ci(30,76,6,'ffffff','90a4ae'),R.Ci(20,90,4,'ffffff','90a4ae')]);

add('zzz','es','Sono (zzz)',R=>{const z=(x,y,s,w)=>`M${x} ${y} H${x+s} L${x} ${y+s} H${x+s}`;return[
 ...R.Pl(z(52,12,38),'1565c0',.13),...R.Pl(z(52,12,38),'42a5f5',.095),
 ...R.Pl(z(26,46,28),'1565c0',.12),...R.Pl(z(26,46,28),'64b5f6',.085),
 ...R.Pl(z(8,76,18),'1565c0',.11),...R.Pl(z(8,76,18),'90caf9',.075)]});

add('anger','es','Símbolo de raiva',R=>{const blade=R.Pf('M50 40 C44 28 30 20 14 18 C20 34 30 44 44 48 Z','e53935','b71c1c'),o=[];for(let k=0;k<4;k++)blade.forEach(p=>o.push({...p,pts:SL.rot(p.pts,k*Math.PI/2)}));return o});

add('collision','es','Explosão',R=>{const bur=(R0,r0,n,j)=>{let d='';for(let i=0;i<n*2;i++){const a=-Math.PI/2+i*Math.PI/n,r=i%2?r0*(1-j*((i/2|0)%2?.3:0)):R0*(1+j*(((i/2)|0)%3-1)*.12);d+=(i?'L':'M')+(50+Math.cos(a)*r).toFixed(2)+' '+(50+Math.sin(a)*r).toFixed(2)+' '}return d+'Z'};
 return[...R.Pf(bur(46,24,9,1),'ff7043','bf360c'),...R.Pf(bur(34,17,9,1),'ffca28','c79100'),...R.Pf(bur(20,10,9,1),'fff59d',null)]});

add('sweat','es','Gotas de suor',R=>[
 ...R.Pf(drop(30,34,14,22),'4fc3f7','0288d1'),R.El(24,28,3,6,20,'e1f5fe',null),
 ...R.Pf(drop(70,50,12,19),'4fc3f7','0288d1'),R.El(65,44,2.6,5.4,20,'e1f5fe',null),
 ...R.Pf(drop(46,78,9,14),'4fc3f7','0288d1')]);

add('eyesE','es','Olhos',R=>[
 R.El(30,52,20,30,0,'ffffff','78909c'),R.El(70,52,20,30,0,'ffffff','78909c'),
 R.El(36,58,9,13,0,'37474f',null),R.El(76,58,9,13,0,'37474f',null),R.Ci(34,52,3.2,'ffffff',null),R.Ci(74,52,3.2,'ffffff',null)]);

add('nogo','es','Proibido',R=>[
 ...R.Pl('M50 8 C27 8 8 27 8 50 C8 73 27 92 50 92 C73 92 92 73 92 50 C92 27 73 8 50 8 Z','b71c1c',.2),...R.Pl('M50 8 C27 8 8 27 8 50 C8 73 27 92 50 92 C73 92 92 73 92 50 C92 27 73 8 50 8 Z','e53935',.16),
 ...R.Pl('M23 23 L77 77','b71c1c',.2),...R.Pl('M23 23 L77 77','e53935',.16)]);

})();
