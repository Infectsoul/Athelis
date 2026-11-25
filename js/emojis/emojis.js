'use strict';
(()=>{
const{TAU,cl,rad,circ,arc,ellR,u50,C100,E100,pp100,rot,norm,mirX,thickLine,heartPts,plus12,starPts,P,pathPts}=SL;
const CAT={};
'ef smile sad wink love cool laugh angry wow cry sleep kiss ghost alien skull'.split(' ').forEach((k,i,a)=>{if(i)CAT[k]='ef'});
'ea mouse cat bunny penguin bflyE fishE pawE'.split(' ').forEach((k,i)=>{if(i)CAT[k]='ea'});
'ec apple cherry banana pizza cupcake cookie cheese pumpkin egg2'.split(' ').forEach((k,i)=>{if(i)CAT[k]='ec'});
'en sunE moonE cloudE rainCloud fire dropE boltE flowerE tulip sunflower mushE rainbow acornE snowman'.split(' ').forEach((k,i)=>{if(i)CAT[k]='en'});
'eo gift trophy crownE bomb gemE coin keyE lockE bellE bulb rocket flagE die clock eyeE envelope'.split(' ').forEach((k,i)=>{if(i)CAT[k]='eo'});
'es heartR starY ok no warn yin sparkE'.split(' ').forEach((k,i)=>{if(i)CAT[k]='es'});
const NE=SL.addE;
const addE=(id,n,g)=>NE(id,CAT[id]||'es',n,(R,p,nn)=>g(p,nn));
function cloudRing(n){const cs=[[24,64,14],[42,45,19],[66,47,21],[84,64,14]],sp=Math.max(.9,60/Math.max(8,n)),out=[];
 const inter=(c1,c2)=>{const dx=c2[0]-c1[0],dy=c2[1]-c1[1],d=Math.hypot(dx,dy),a=(c1[2]*c1[2]-c2[2]*c2[2]+d*d)/(2*d),h=Math.sqrt(Math.max(0,c1[2]*c1[2]-a*a)),xm=c1[0]+a*dx/d,ym=c1[1]+a*dy/d,p1=[xm+h*dy/d,ym-h*dx/d],p2=[xm-h*dy/d,ym+h*dx/d];return p1[1]<p2[1]?p1:p2};
 const ang=(c,p)=>Math.atan2(p[1]-c[1],p[0]-c[0]);
 const arcTo=(c,a0,a1)=>{while(a1<=a0)a1+=TAU;const m=Math.max(2,Math.ceil(c[2]*(a1-a0)/sp));for(let i=0;i<=m;i++){const a=a0+(a1-a0)*i/m;out.push([c[0]+Math.cos(a)*c[2],c[1]+Math.sin(a)*c[2]])}};
 const I=[inter(cs[0],cs[1]),inter(cs[1],cs[2]),inter(cs[2],cs[3])];
 arcTo(cs[0],Math.PI/2,ang(cs[0],I[0]));arcTo(cs[1],ang(cs[1],I[0]),ang(cs[1],I[1]));arcTo(cs[2],ang(cs[2],I[1]),ang(cs[2],I[2]));arcTo(cs[3],ang(cs[3],I[2]),Math.PI/2+TAU*0);
 return out.filter((p,i)=>i===0||Math.hypot(p[0]-out[i-1][0],p[1]-out[i-1][1])>1e-6).map(p=>[p[0]/50-1,p[1]/50-1])}
const cloudParts=(n,cx,cy,sx,sy)=>[P(cloudRing(n).map(q=>[q[0]*sx+cx,q[1]*sy+cy]))];

const fill=(pts,f,l,x)=>P(pts,Object.assign({fill:f,line:l},x||{}));
const eye=(x,y,rx,ry,n)=>fill(circ(x,y,rx,ry,n),'4a2c00',null);
const face=(n)=>fill(circ(0,0,.96,.96,Math.max(16,n*2)),'ffcc33','c98a00');
const PF=(d,n,f,l,x)=>pathPts(d,n).map(s=>fill(s.pts,f,l,Object.assign({closed:s.closed,open:!s.closed},x||{})));
const PLN=(d,n,l,t)=>pathPts(d,n).map(s=>P(s.pts,{open:1,closed:false,line:l,t}));
const PLQ=(s,l,t)=>P(pp100(s),{open:1,closed:false,line:l,t});
const F100=(pts,f,l)=>fill(pts,f,l),cE=(cx,cy,r,f,l,n)=>fill(C100(cx,cy,r,n||16),f,l),eE=(cx,cy,rx,ry,deg,f,l,n)=>fill(E100(cx,cy,rx,ry,deg,n||16),f,l);
const hrt=(s,x,y,f,l)=>fill(norm(heartPts(24),0,-2.5,16.5).map(q=>[q[0]*s+x,q[1]*s+y]),f,l);
const smallFace=(n,f,l)=>fill(circ(0,0,.96,.96,Math.max(16,n*2)),f||'ffcc33',l||'c98a00');
const D='4a2c00';

addE('smile','Carinha feliz',(p,n)=>[face(n),eye(-.34,-.2,.1,.17,12),eye(.34,-.2,.1,.17,12),P(arc(0,.05,.55,.5,rad(22),rad(158),Math.max(6,n/2)),{open:1,line:'4a2c00',t:.07})]);
addE('sad','Carinha triste',(p,n)=>[face(n),eye(-.34,-.2,.1,.17,12),eye(.34,-.2,.1,.17,12),P(arc(0,.78,.5,.42,rad(205),rad(335),Math.max(6,n/2)),{open:1,line:'4a2c00',t:.07})]);
addE('wink','Carinha piscando',(p,n)=>[face(n),eye(-.34,-.2,.1,.17,12),P(arc(.34,-.2,.12,.08,rad(200),rad(340),6),{open:1,line:'4a2c00',t:.07}),P(arc(0,.05,.55,.5,rad(22),rad(158),Math.max(6,n/2)),{open:1,line:'4a2c00',t:.07})]);
addE('love','Carinha apaixonada',(p,n)=>[face(n),fill(norm(heartPts(24),0,-2.5,16.5).map(q=>[q[0]*.24-.36,q[1]*.24-.18]),'e0245e',null),fill(norm(heartPts(24),0,-2.5,16.5).map(q=>[q[0]*.24+.36,q[1]*.24-.18]),'e0245e',null),P(arc(0,.05,.55,.5,rad(22),rad(158),Math.max(6,n/2)),{open:1,line:'4a2c00',t:.07})]);
addE('cool','Carinha de óculos',(p,n)=>[face(n),fill([[-.8,-.3],[-.08,-.3],[-.12,.02],[-.5,.1],[-.72,.02]],'1c1c1c',null),fill([[.8,-.3],[.08,-.3],[.12,.02],[.5,.1],[.72,.02]],'1c1c1c',null),P(arc(0,.1,.5,.45,rad(25),rad(155),Math.max(6,n/2)),{open:1,line:'4a2c00',t:.07})]);
addE('heartR','Coração vermelho',(p,n)=>[fill(norm(heartPts(Math.max(24,n*2)),0,-2.5,16.5),'e0245e','a8143f')]);
addE('starY','Estrela amarela',()=>{const v=[];for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,r=i%2?.42:1;v.push([Math.cos(a)*r,Math.sin(a)*r])}return[fill(v,'ffd400','c79a00')]});
addE('sunE','Sol',(p,n)=>{const o=[];for(let i=0;i<12;i++){const a=i*TAU/12,w=.2;o.push(fill([[Math.cos(a-w)*.66,Math.sin(a-w)*.66],[Math.cos(a)*1,Math.sin(a)*1],[Math.cos(a+w)*.66,Math.sin(a+w)*.66]],'ff9f00',null))}o.push(fill(circ(0,0,.56,.56,Math.max(16,n)),'ffc400','e08a00'));return o});
addE('moonE','Lua',(p,n)=>{const sh=.6,ph=Math.acos(sh/2),m=Math.max(10,n);return[fill([...arc(0,0,1,1,ph,TAU-ph,m),...arc(sh,0,1,1,Math.PI+ph,Math.PI-ph,m)],'f5e08a','c9a93a')]});
addE('cheese','Queijo',(p,n)=>[fill([[-1,.5],[1,-.62],[1,.5],[.94,.7],[-.94,.7]].slice(0,5),'ffd23f','c99a00'),fill(circ(.45,.05,.14,.14,10),'f0b21a',null),fill(circ(.1,.35,.1,.1,10),'f0b21a',null),fill(circ(.62,.4,.09,.09,10),'f0b21a',null),fill(circ(-.45,.5,.08,.08,10),'f0b21a',null)]);
addE('mouse','Ratinho',(p,n)=>[fill(circ(-.62,-.58,.38,.38,Math.max(14,n/2)),'b6b6c0','7c7c86'),fill(circ(.62,-.58,.38,.38,Math.max(14,n/2)),'b6b6c0','7c7c86'),fill(circ(-.62,-.58,.22,.22,12),'f4a9c0',null),fill(circ(.62,-.58,.22,.22,12),'f4a9c0',null),fill(circ(0,.05,.86,.82,Math.max(20,n*2)),'b6b6c0','7c7c86'),eye(-.3,-.1,.09,.13,10),eye(.3,-.1,.09,.13,10),fill(circ(0,.32,.12,.09,10),'e85d8c',null),P([[-.1,.5],[0,.58],[.1,.5]],{open:1,line:'4a4a55',t:.05})]);
addE('boltE','Raio amarelo',(p,n)=>pathPts('M58 2 L16 56 L44 56 L36 98 L84 40 L56 40 Z',n).map(x=>fill(x.pts,'ffe000','c8a600')));
addE('dropE','Gota azul',(p,n)=>pathPts('M50 3 C50 3 14 45 14 64 C14 84 30 97 50 97 C70 97 86 84 86 64 C86 45 50 3 50 3 Z',n).map(x=>fill(x.pts,'3aa0ff','1c6fc4')));
addE('ok','Certo (verde)',(p,n)=>[fill(circ(0,0,.96,.96,Math.max(16,n*2)),'2fbf5b','1e8a3f'),fill(thickLine([[-.5,.02],[-.14,.4],[.52,-.36]],.1),'ffffff',null)]);
addE('no','Errado (vermelho)',(p,n)=>[fill(circ(0,0,.96,.96,Math.max(16,n*2)),'e5484d','a8262b'),fill(rot(plus12(.5,.1),Math.PI/4),'ffffff',null)]);
addE('warn','Atenção',()=>[fill([[0,-.95],[1,.85],[-1,.85]],'ffcc00','b08f00'),fill([[-.07,-.35],[.07,-.35],[.05,.3],[-.05,.3]],'2a2200',null),fill(circ(0,.55,.07,.07,10),'2a2200',null)]);

addE('flowerE','Margarida',(p,n)=>{const o=[];for(let i=0;i<12;i++){const a=i*30;o.push(eE(50+Math.cos(rad(a))*29,50+Math.sin(rad(a))*29,19,8.5,a,'ffffff','aab4c8',Math.max(12,n/2)))}o.push(cE(50,50,15.5,'ffc107','e08a00',Math.max(16,n)),cE(45,45,4.5,'ffe082',null,10));return o});
addE('cloudE','Nuvem azul',(p,n)=>[fill(cloudRing(n),'eef4ff','8aa4d6'),...PLN('M30 62 A11 11 0 0 1 36 52',n,'ffffff',.045)]);
addE('fire','Fogo',(p,n)=>[...PF('M50 2 C52 20 74 30 80 52 C86 74 72 96 50 96 C28 96 14 76 20 54 C22 44 28 38 34 32 C34 44 40 50 46 50 C40 34 44 14 50 2 Z',n,'ff5722','b23a00'),...PF('M50 40 C54 54 70 62 68 78 C66 90 58 94 50 94 C40 94 32 88 32 78 C32 66 44 58 50 40 Z',n,'ff9800',null),...PF('M50 64 C54 72 60 76 58 84 C57 90 53 92 50 92 C46 92 42 89 42 84 C42 76 48 72 50 64 Z',n,'ffeb3b',null)]);
addE('skull','Caveira',(p,n)=>[...PF('M50 4 C24 4 10 22 10 42 C10 56 16 64 26 70 V84 C26 90 30 94 36 94 H64 C70 94 74 90 74 84 V70 C84 64 90 56 90 42 C90 22 76 4 50 4 Z',n,'f3f0e4','4a4a4a'),eE(34,46,11,12.5,0,'1f1f1f',null,Math.max(14,n/2)),eE(66,46,11,12.5,0,'1f1f1f',null,Math.max(14,n/2)),...PF('M50 55 L43 68 Q50 65 57 68 Z',n,'1f1f1f',null),PLQ('40 82 40 94',  '4a4a4a',.03),PLQ('50 82 50 94','4a4a4a',.03),PLQ('60 82 60 94','4a4a4a',.03),PLQ('28 82 72 82','4a4a4a',.025)]);
addE('laugh','Carinha rindo',(p,n)=>[smallFace(n),...PLN('M22 42 Q31 30 40 42',n,D,.075),...PLN('M60 42 Q69 30 78 42',n,D,.075),...PF('M22 56 Q50 62 78 56 Q74 86 50 86 Q26 86 22 56 Z',n,'7a2f1e',D),...PF('M36 78 Q50 66 64 78 Q58 85 50 85 Q42 85 36 78 Z',n,'ff7a8a',null),...PF('M12 44 Q5 54 10 60 Q17 58 17 49 Z',n,'5ec8ff','2b86c5'),...PF('M88 44 Q95 54 90 60 Q83 58 83 49 Z',n,'5ec8ff','2b86c5')]);
addE('angry','Carinha brava',(p,n)=>[smallFace(n,'ff8a50','c2410c'),PLQ('18 30 42 44','7f1d1d',.09),PLQ('82 30 58 44','7f1d1d',.09),cE(33,54,6,D,null,12),cE(67,54,6,D,null,12),...PLN('M30 78 Q50 64 70 78',n,'7f1d1d',.075)]);
addE('wow','Carinha surpresa',(p,n)=>[smallFace(n),...PLN('M22 28 Q33 20 44 27',n,D,.06),...PLN('M56 27 Q67 20 78 28',n,D,.06),cE(34,44,7,D,null,12),cE(66,44,7,D,null,12),eE(50,72,10,13.5,0,'7a2f1e',D,Math.max(14,n/2))]);
addE('cry','Carinha chorando',(p,n)=>[smallFace(n),...PLN('M20 32 Q31 24 42 32',n,D,.06),...PLN('M58 32 Q69 24 80 32',n,D,.06),cE(31,46,6,D,null,12),cE(69,46,6,D,null,12),...PLN('M33 76 Q50 62 67 76',n,D,.075),...PF('M28 54 Q20 68 28 76 Q36 68 28 54 Z',n,'5ec8ff','2b86c5'),...PF('M72 54 Q64 68 72 76 Q80 68 72 54 Z',n,'5ec8ff','2b86c5')]);
addE('sleep','Carinha dormindo',(p,n)=>[smallFace(n),...PLN('M22 46 Q31 55 40 46',n,D,.07),...PLN('M60 46 Q69 55 78 46',n,D,.07),cE(50,70,5.5,'7a2f1e',D,12),PLQ('66 10 82 10 66 26 82 26','4a6fa5',.05)]);
addE('kiss','Carinha beijando',(p,n)=>[smallFace(n),cE(32,42,7,D,null,12),...PLN('M60 44 Q69 34 78 44',n,D,.07),hrt(.17,0,.4,'ff4d6d','b3123b'),...PLN('M28 24 Q34 18 40 24',n,D,.04)]);
addE('ghost','Fantasma',(p,n)=>[...PF('M16 94 V46 C16 22 32 6 50 6 C68 6 84 22 84 46 V94 L72 84 L61 94 L50 84 L39 94 L28 84 Z',n,'f7f9ff','8f9bbd'),eE(38,44,5.5,8,0,'3d4663',null,12),eE(62,44,5.5,8,0,'3d4663',null,12),eE(50,62,6,8,0,'3d4663',null,12),eE(27,58,6,3.8,0,'ffb3c1',null,12),eE(73,58,6,3.8,0,'ffb3c1',null,12)]);
addE('alien','Alienígena',(p,n)=>[...PF('M50 96 C30 96 10 70 8 42 C6 18 26 4 50 4 C74 4 94 18 92 42 C90 70 70 96 50 96 Z',n,'7ed957','3f8f24'),...PF('M14 38 C24 34 40 44 44 58 C34 62 18 54 14 38 Z',n,'1f2a1f',null),...PF('M86 38 C76 34 60 44 56 58 C66 62 82 54 86 38 Z',n,'1f2a1f',null),cE(28,46,3.5,'ffffff',null,10),cE(72,46,3.5,'ffffff',null,10),...PLN('M42 80 Q50 85 58 80',n,'2e6b1a',.04)]);
addE('cat','Gato',(p,n)=>[...PF('M12 40 L10 8 L36 22 C44 19 56 19 64 22 L90 8 L88 40 C94 54 90 74 74 86 C64 94 36 94 26 86 C10 74 6 54 12 40 Z',n,'ffb74d','a8601a'),...PF('M16 32 L15 17 L28 25 Z',n,'ffb3c1',null),...PF('M84 32 L85 17 L72 25 Z',n,'ffb3c1',null),eE(34,52,5,7,0,D,null,12),eE(66,52,5,7,0,D,null,12),...PF('M44 63 H56 L50 70 Z',n,'ff6f91',null),...PLN('M50 70 V75 M50 75 Q44 81 38 77 M50 75 Q56 81 62 77',n,D,.035),PLQ('6 60 30 64','5a3a1a',.025),PLQ('6 70 30 68','5a3a1a',.025),PLQ('94 60 70 64','5a3a1a',.025),PLQ('94 70 70 68','5a3a1a',.025)]);
addE('apple','Maçã',(p,n)=>[...PF('M50 28 C60 18 90 22 90 52 C90 78 72 96 60 94 C54 93 52 91 50 91 C48 91 46 93 40 94 C28 96 10 78 10 52 C10 22 40 18 50 28 Z',n,'e53935','8e1b17'),...PF('M20 46 C20 38 24 32 30 30 C26 38 26 46 28 52 Z',n,'ff8a80',null),...PLN('M50 28 C50 18 52 12 56 6',n,'6d4c41',.07),...PF('M54 24 C60 10 74 6 84 8 C82 22 68 30 54 24 Z',n,'43a047','1b5e20')]);
addE('cherry','Cerejas',(p,n)=>[...PLN('M30 54 C34 36 46 20 58 10',n,'5d7a2c',.05),...PLN('M70 50 C68 34 62 20 58 10',n,'5d7a2c',.05),...PF('M58 10 C66 2 82 4 90 12 C80 20 66 18 58 10 Z',n,'43a047','1b5e20'),cE(30,74,20,'d32f2f','7f1010',Math.max(18,n)),cE(70,70,20,'d32f2f','7f1010',Math.max(18,n)),eE(23,66,4,6,30,'ffffff',null,10),eE(63,62,4,6,30,'ffffff',null,10)]);
addE('banana','Banana',(p,n)=>[...PF('M12 34 C10 62 30 88 62 88 C80 88 92 78 94 66 C84 74 70 76 58 70 C40 62 30 46 28 28 C28 22 14 24 12 34 Z',n,'ffe135','a67c00'),...PLN('M30 42 C36 56 48 68 66 75',n,'e6b800',.03),...PF('M12 34 C12 28 16 25 21 25 L28 29 C24 27 18 25 12 34 Z',n,'6d4c41',null)]);
addE('pizza','Pizza',(p,n)=>[...PF('M14 34 C36 22 64 22 86 34 L50 96 Z',n,'ffc83d','b97f00'),...PF('M10 22 C34 8 66 8 90 22 L86 34 C64 22 36 22 14 34 Z',n,'e0a458','8a5a22'),cE(42,44,6.5,'d84315','8e2a0b',14),cE(62,46,5.5,'d84315','8e2a0b',14),cE(50,66,5.5,'d84315','8e2a0b',14)]);
addE('cupcake','Cupcake',(p,n)=>[...PF('M20 56 H80 L72 94 H28 Z',n,'a1887f','5d4037'),...PLN('M35 58 L38 92 M50 58 V92 M65 58 L62 92',n,'6d4c41',.03),...PF('M16 56 C6 56 10 38 26 40 C22 26 40 18 50 26 C60 18 78 26 74 40 C90 38 94 56 84 56 Z',n,'ff8fb1','b3195a'),cE(50,18,8,'e53935','8e1b17',14),PLQ('30 44 36 38','ffffff',.035),PLQ('62 36 68 42','ffeb3b',.035)]);
addE('gift','Presente',(p,n)=>[...PF('M12 40 H88 V94 H12 Z',n,'e53935','8e1b17'),...PF('M8 28 H92 V44 H8 Z',n,'ef5350','8e1b17'),...PF('M44 28 H56 V94 H44 Z',n,'ffd54f','a67c00'),...PF('M50 28 C34 2 12 12 24 26 C30 32 44 30 50 28 Z',n,'ffd54f','a67c00'),...PF('M50 28 C66 2 88 12 76 26 C70 32 56 30 50 28 Z',n,'ffd54f','a67c00')]);
addE('trophy','Troféu',(p,n)=>[...PF('M26 14 H12 C10 34 18 44 30 46 L28 38 C20 36 18 28 20 22 H26 Z',n,'ffca28','a67c00'),...PF('M74 14 H88 C90 34 82 44 70 46 L72 38 C80 36 82 28 80 22 H74 Z',n,'ffca28','a67c00'),...PF('M26 8 H74 V36 C74 56 62 64 50 64 C38 64 26 56 26 36 Z',n,'ffca28','a67c00'),...PF('M44 64 H56 V78 H44 Z',n,'ffb300','a67c00'),...PF('M30 78 H70 V92 H30 Z',n,'8d6e63','4e342e'),fill(starPts(5,.45,0,12).map(q=>[q[0]*.26,q[1]*.26-.4]),'fff59d','a67c00')]);
addE('crownE','Coroa',(p,n)=>[...PF('M8 78 V28 L30 52 L50 18 L70 52 L92 28 V78 Z',n,'ffca28','a67c00'),...PF('M8 78 H92 V92 H8 Z',n,'ffb300','a67c00'),cE(50,62,6,'e53935','8e1b17',12),cE(26,64,4.5,'29b6f6','01579b',10),cE(74,64,4.5,'66bb6a','1b5e20',10),cE(8,26,5,'fff59d','a67c00',10),cE(50,16,5,'fff59d','a67c00',10),cE(92,26,5,'fff59d','a67c00',10)]);
addE('bomb','Bomba',(p,n)=>[...PLN('M80 18 C86 10 92 12 94 6',n,'8d6e63',.05),...PF('M60 28 L74 14 L84 24 L70 38 Z',n,'607d8b','263238'),cE(46,60,36,'37474f','111c21',Math.max(20,n*1.4)),eE(34,46,9,5,-35,'90a4ae',null,12),fill(starPts(8,.45,0,16).map(q=>[q[0]*.14+.88,q[1]*.14-.88]),'ffeb3b','ff9800')]);
addE('gemE','Gema',(p,n)=>[...PF('M28 10 H72 L60 36 H40 Z',n,'b3ecff','2b86c5'),...PF('M28 10 L40 36 L4 36 Z',n,'7ccdf5','2b86c5'),...PF('M72 10 L96 36 L60 36 Z',n,'7ccdf5','2b86c5'),...PF('M4 36 H40 L50 94 Z',n,'4fb0e8','2b86c5'),...PF('M40 36 H60 L50 94 Z',n,'2f8fd0','2b86c5'),...PF('M60 36 H96 L50 94 Z',n,'4fb0e8','2b86c5')]);
addE('coin','Moeda',(p,n)=>[cE(50,50,46,'ffca28','a67c00',Math.max(20,n*1.4)),P(circ(0,0,.74,.74,Math.max(18,n)),{line:'e0a100'}),fill(starPts(5,.45,0,12).map(q=>[q[0]*.42,q[1]*.42]),'fff176','c79100')]);
addE('bflyE','Borboleta',(p,n)=>{const up=PF('M47 46 C44 26 30 6 12 10 C2 14 4 36 16 44 C26 50 38 50 47 46 Z',n,'7e57c2','4527a0'),lo=PF('M47 52 C34 52 18 58 16 72 C14 88 34 92 42 80 C46 74 47 62 47 52 Z',n,'ab47bc','6a1b9a'),m=a=>a.map(x=>({...x,pts:mirX(x.pts)}));return[...lo,...m(lo),...up,...m(up),cE(24,28,5,'ede7f6',null,10),cE(76,28,5,'ede7f6',null,10),eE(50,52,3.6,22,0,'3e2723',null,12),...PLN('M48 32 C46 22 40 16 35 14',n,'3e2723',.03),...PLN('M52 32 C54 22 60 16 65 14',n,'3e2723',.03)]});
addE('mushE','Cogumelo',(p,n)=>[...PF('M34 56 H66 V82 C66 90 60 94 50 94 C40 94 34 90 34 82 Z',n,'fff3e0','a8957a'),...PF('M6 56 C6 28 26 8 50 8 C74 8 94 28 94 56 Z',n,'e53935','8e1b17'),cE(28,38,8,'ffffff',null,12),cE(56,24,7,'ffffff',null,12),cE(74,44,8,'ffffff',null,12),cE(46,46,5,'ffffff',null,10)]);
addE('fishE','Peixe',(p,n)=>[...PF('M6 50 C22 18 58 16 78 40 L96 22 V78 L78 60 C58 84 22 82 6 50 Z',n,'ff9800','a85d00'),...PLN('M54 34 C47 44 47 56 54 66',n,'c76f00',.035),...PLN('M64 38 C58 46 58 54 64 62',n,'c76f00',.03),cE(24,44,5.5,'ffffff','5a3a00',12),cE(24,44,2.4,D,null,8)]);
addE('tulip','Tulipa',(p,n)=>[...PLN('M50 54 V97',n,'43a047',.06),...PF('M50 92 C32 88 24 70 26 58 C40 62 48 74 50 92 Z',n,'66bb6a','2e7d32'),...PF('M50 86 C68 82 76 64 74 52 C60 56 52 68 50 86 Z',n,'66bb6a','2e7d32'),...PF('M22 20 C22 44 34 58 50 58 C66 58 78 44 78 20 L64 32 L50 10 L36 32 Z',n,'e91e63','880e4f'),...PF('M50 10 L64 32 L50 58 L36 32 Z',n,'f06292',null)]);
addE('flagE','Bandeira',(p,n)=>[...PF('M10 4 H17 V98 H10 Z',n,'8d6e63','5d4037'),...PF('M17 8 C32 0 44 18 60 12 C70 8 80 8 92 14 V58 C80 52 70 52 60 58 C44 64 32 46 17 54 Z',n,'e53935','8e1b17')]);
addE('keyE','Chave',(p,n)=>[...PF('M53.24 44 H96 V72 H86 V60 H80 V72 H70 V56 H53.24 A24 24 0 1 1 53.24 44 Z',n,'ffca28','a67c00'),P(C100(30,50,10,18),{line:'a67c00'})]);
addE('lockE','Cadeado',(p,n)=>[...PF('M26 48 V34 C26 12 74 12 74 34 V48 H62 V34 C62 24 38 24 38 34 V48 Z',n,'b0bec5','546e7a'),...PF('M28 46 H72 Q82 46 82 56 V86 Q82 96 72 96 H28 Q18 96 18 86 V56 Q18 46 28 46 Z',n,'ffca28','a67c00'),cE(50,66,7,'4a3a00',null,12),...PF('M47 68 H53 L55 84 H45 Z',n,'4a3a00',null)]);
addE('bellE','Sino',(p,n)=>[...PF('M50 6 C56 6 58 10 58 15 C72 19 80 32 80 50 C80 66 86 72 92 79 H8 C14 72 20 66 20 50 C20 32 28 19 42 15 C42 10 44 6 50 6 Z',n,'ffca28','a67c00'),eE(50,88,8,6,0,'a67c00',null,12),...PLN('M30 40 C32 30 38 24 44 22',n,'fff59d',.04)]);
addE('bulb','Lâmpada',(p,n)=>[...PF('M34 84 H66 V90 H34 Z',n,'b0bec5','546e7a'),...PF('M36 90 H64 V96 H36 Z',n,'90a4ae','546e7a'),...PF('M50 6 C28 6 14 22 14 40 C14 54 22 62 28 70 C32 76 32 80 32 84 H68 C68 80 68 76 72 70 C78 62 86 54 86 40 C86 22 72 6 50 6 Z',n,'fff176','a67c00'),...PLN('M42 82 V56 L50 46 L58 56 V82',n,'c79100',.03)]);
addE('rocket','Foguete',(p,n)=>[...PF('M40 76 H60 L50 98 Z',n,'ffb300','e65100'),...PF('M34 56 L16 76 V90 L36 78 Z',n,'e53935','8e1b17'),...PF('M66 56 L84 76 V90 L64 78 Z',n,'e53935','8e1b17'),...PF('M50 4 C68 20 72 48 66 76 H34 C28 48 32 20 50 4 Z',n,'eceff1','78909c'),cE(50,36,10,'4fc3f7','0277bd',16)]);
addE('pawE','Pata',(p,n)=>{const q=Math.max(12,Math.round(n/2));return[eE(20,40,9,12,-22,'6d4c41','3e2723',q),eE(40,22,9,13,-6,'6d4c41','3e2723',q),eE(60,22,9,13,6,'6d4c41','3e2723',q),eE(80,40,9,12,22,'6d4c41','3e2723',q),...PF('M50 46 C66 46 80 64 80 78 C80 90 66 90 50 86 C34 90 20 90 20 78 C20 64 34 46 50 46 Z',n,'6d4c41','3e2723')]});
addE('rainbow','Arco-íris',(p,n)=>{const cols=['e53935','fb8c00','fdd835','43a047','1e88e5','8e24aa'],o=[],m=Math.max(16,n);cols.forEach((c,i)=>{const ro=.96-i*.1,ri=ro-.1;o.push(fill([...arc(0,.5,ro,ro,Math.PI,TAU,m),...arc(0,.5,ri,ri,TAU,Math.PI,m)],c,null))});return[...o,fill(circ(-.8,.52,.16,.16,12),'ffffff','b0bec5'),fill(circ(-.62,.62,.14,.14,12),'ffffff','b0bec5'),fill(circ(.8,.52,.16,.16,12),'ffffff','b0bec5'),fill(circ(.62,.62,.14,.14,12),'ffffff','b0bec5')]});
addE('die','Dado',(p,n)=>[...PF('M18 6 H82 Q94 6 94 18 V82 Q94 94 82 94 H18 Q6 94 6 82 V18 Q6 6 18 6 Z',n,'ffffff','455a64'),cE(28,28,7,'263238',null,12),cE(72,28,7,'263238',null,12),cE(50,50,7,'263238',null,12),cE(28,72,7,'263238',null,12),cE(72,72,7,'263238',null,12)]);
addE('clock','Relógio',(p,n)=>{const o=[cE(50,50,46,'ffffff','37474f',Math.max(20,n*1.4))];for(let i=0;i<12;i++){const a=i*30,c=Math.cos(rad(a)),s=Math.sin(rad(a)),r0=i%3?38:34;o.push(PLQ((50+c*r0)+' '+(50+s*r0)+' '+(50+c*42)+' '+(50+s*42),'37474f',i%3?.025:.04))}return[...o,PLQ('50 50 50 24','263238',.06),PLQ('50 50 70 58','263238',.05),cE(50,50,4,'e53935',null,10)]});
addE('eyeE','Olho',(p,n)=>[...PF('M4 50 C20 22 80 22 96 50 C80 78 20 78 4 50 Z',n,'ffffff','37474f'),cE(50,50,19,'29b6f6','0277bd',Math.max(16,n)),cE(50,50,8.5,'111111',null,14),cE(43,43,4,'ffffff',null,10)]);
addE('yin','Yin-yang',(p,n)=>[cE(50,50,48,'ffffff','263238',Math.max(24,n*1.4)),...PF('M50 2 A48 48 0 0 1 50 98 A24 24 0 0 1 50 50 A24 24 0 0 0 50 2 Z',n,'263238',null),cE(50,26,7,'263238',null,12),cE(50,74,7,'ffffff',null,12)]);
addE('pumpkin','Abóbora',(p,n)=>{const q=Math.max(18,n);return[eE(26,58,22,34,0,'ff9800','a85d00',q),eE(74,58,22,34,0,'ff9800','a85d00',q),eE(50,58,25,38,0,'ffa726','a85d00',q),...PF('M44 22 C44 12 48 8 52 4 L58 8 C54 12 54 16 56 22 Z',n,'5d7a2c','2f4a12'),...PF('M26 48 H40 L33 38 Z',n,'ffe082',null),...PF('M60 48 H74 L67 38 Z',n,'ffe082',null),...PF('M28 64 L38 74 L46 64 L54 74 L62 64 L72 64 L66 80 H34 Z',n,'ffe082',null)]});
addE('sparkE','Brilhos',()=>[[0,0,.6],[.62,-.55,.3],[-.6,.62,.24]].map(([x,y,s])=>fill(starPts(4,.22,.55,28).map(q=>[q[0]*s+x,q[1]*s+y]),'ffeb3b','f9a825')));

addE('egg2','Ovo',(p,n)=>[...PF('M50 4 C74 4 88 44 88 62 C88 82 71 96 50 96 C29 96 12 82 12 62 C12 44 26 4 50 4 Z',n,'fff3e0','b8956a'),...PLN('M34 30 C38 20 44 14 50 12',n,'ffffff',.05)]);
addE('acornE','Bolota',(p,n)=>[...PF('M24 42 H76 C76 70 64 92 50 97 C36 92 24 70 24 42 Z',n,'c68642','7a4a1b'),...PF('M16 42 C16 22 32 14 50 14 C68 14 84 22 84 42 Z',n,'7b4f2c','4a2e17'),...PLN('M50 14 V4',n,'4a2e17',.06)]);
addE('bunny','Coelho',(p,n)=>[eE(34,24,9,23,-8,'fafafa','9e9e9e',16),eE(66,24,9,23,8,'fafafa','9e9e9e',16),eE(34,26,4,15,-8,'f8bbd0',null,12),eE(66,26,4,15,8,'f8bbd0',null,12),eE(50,66,35,30,0,'fafafa','9e9e9e',Math.max(20,n)),cE(37,62,3.4,D,null,10),cE(63,62,3.4,D,null,10),...PF('M45 69 H55 L50 75 Z',n,'f48fb1',null),...PLN('M50 75 V79 M50 79 Q44 85 38 80 M50 79 Q56 85 62 80',n,D,.03),eE(28,74,6,4,0,'ffcdd2',null,10),eE(72,74,6,4,0,'ffcdd2',null,10)]);
addE('penguin','Pinguim',(p,n)=>[eE(50,56,32,40,0,'37474f','1c262b',Math.max(20,n)),eE(50,64,22,30,0,'ffffff',null,Math.max(18,n*.8)),cE(40,38,4.5,'ffffff',null,10),cE(60,38,4.5,'ffffff',null,10),cE(40,39,2.2,D,null,8),cE(60,39,2.2,D,null,8),...PF('M43 46 H57 L50 56 Z',n,'ff9800','b36b00'),...PF('M30 92 H46 L42 98 H24 Z',n,'ff9800','b36b00'),...PF('M70 92 H54 L58 98 H76 Z',n,'ff9800','b36b00')]);
addE('snowman','Boneco de neve',(p,n)=>[cE(50,76,22,'ffffff','90a4ae',Math.max(20,n)),cE(50,48,16,'ffffff','90a4ae',Math.max(18,n)),cE(50,26,12,'ffffff','90a4ae',Math.max(16,n)),...PF('M34 20 H66 V16 H60 V6 H40 V16 H34 Z',n,'37474f','1c262b'),...PF('M50 27 L63 30 L50 32 Z',n,'ff9800','b36b00'),cE(45,23,1.8,D,null,8),cE(55,23,1.8,D,null,8),cE(50,44,2,D,null,8),cE(50,52,2,D,null,8),cE(50,60,2,D,null,8)]);
addE('cookie','Biscoito',(p,n)=>[cE(50,50,45,'d9a066','8d5a2b',Math.max(24,n*1.4)),cE(34,36,6,'5d4037',null,10),cE(62,32,5,'5d4037',null,10),cE(70,58,6.5,'5d4037',null,10),cE(40,64,5.5,'5d4037',null,10),cE(54,78,4.5,'5d4037',null,10),cE(26,58,4,'5d4037',null,10)]);
addE('sunflower','Girassol',(p,n)=>{const o=[];for(let i=0;i<14;i++){const a=i*360/14;o.push(eE(50+Math.cos(rad(a))*30,50+Math.sin(rad(a))*30,17,8,a,'ffca28','b38600',Math.max(12,n/2)))}o.push(cE(50,50,19,'6d4c41','3e2723',Math.max(16,n)),cE(44,44,2,'8d6e63',null,6),cE(56,46,2,'8d6e63',null,6),cE(50,56,2,'8d6e63',null,6));return o});
addE('rainCloud','Nuvem de chuva',(p,n)=>[fill(cloudRing(n).map(q=>[q[0],q[1]-.25]),'cfd8dc','78909c'),...[[30,66],[48,72],[66,66]].map(([x,y])=>PLQ((x+4)+' '+y+' '+x+' '+(y+14),'4fc3f7',.06))]);
addE('envelope','Carta',(p,n)=>[...PF('M6 22 H94 V82 H6 Z',n,'fff8e1','8d6e3a'),...PLN('M6 22 L50 56 L94 22',n,'8d6e3a',.035)]);

const Y='ffd23f',YL='b7790a',MT='6d2a14',PK='ff7a8a',BL='5ec8ff';
const fce=(R,cy,r,f,l)=>R.Ci(50,cy===undefined?50:cy,r||47,f||Y,l||YL);
const eyes=(R,y,dx,rx,ry,f)=>R.Sy([R.El(50-dx,y,rx,ry,0,f||D,null)]);
const glint=(R,y,dx,r)=>R.Sy([R.Ci(50-dx+1.4,y-2,r||1.6,'ffffff',null)]);
const smileL=(R,d,t)=>R.Pl(d,D,t||.07);
const cheeks=(R,y,dx)=>R.Sy([R.El(50-dx,y,7,4.2,0,'ff8a80',null)]);
const faceE=(id,cat,n,g)=>NE(id,cat,n,(R,p,nn)=>g(R));

faceE('tree','en','Árvore',R=>[
 ...R.Pf('M43 58 H57 L60 84 Q60 92 68 96 H32 Q40 92 40 84 Z','8d5a2b'),
 ...R.Pl('M50 82 L41 70 M50 76 L59 66','5a3716',.03),
 ...R.Pf('M50 4 C64 4 74 12 76 24 C89 27 97 38 94 51 C91 64 80 70 68 70 H32 C20 70 9 64 6 51 C3 38 11 27 24 24 C26 12 36 4 50 4 Z','43a047'),
 ...R.Pf('M50 14 C60 14 66 20 67 28 C76 30 82 38 80 47 C78 56 70 60 62 60 H38 C30 60 22 56 20 47 C18 38 24 30 33 28 C34 20 40 14 50 14 Z','4caf50',null),
 R.Ci(36,34,8,'81c784',null),R.Ci(64,46,7,'81c784',null),R.Ci(30,54,5,'66bb6a',null),R.Ci(68,24,3.6,'a5d6a7',null),R.Ci(52,24,2.6,'c8e6c9',null)]);
faceE('brokenH','es','Coração partido',R=>{const m=48,H=SL.heartN(m),T=H[0],B=H[m>>1],zig=[];
 for(let i=1;i<7;i++){const t=i/7;zig.push([T[0]+(B[0]-T[0])*t+(i%2?.1:-.1),T[1]+(B[1]-T[1])*t])}
 const right=H.slice(0,(m>>1)+1).concat(zig.slice().reverse()),left=H.slice(m>>1).concat([H[0]]).concat(zig);
 const mv=(pts,dx,dy,a)=>{const c=Math.cos(a),s=Math.sin(a);return pts.map(q=>[(q[0]*c-q[1]*s)*.94+dx,(q[0]*s+q[1]*c)*.94+dy])};
 return[R.fp(mv(left,-.08,.03,-.12),'e53960','8c1233'),R.fp(mv(right,.08,-.03,.12),'f0446a','8c1233'),...R.Pl('M22 40 Q24 28 34 24','ffffff',.05),...R.Pl('M70 30 Q76 32 78 40','ffffff',.04)]});
faceE('bee','ea','Abelha',R=>[
 ...R.Sy([R.El(22,34,10,17,-35,'e3f2fd','7a98b0')]),
 R.Ci(50,54,34,'ffd54f','8a6200'),
 ...R.Pf('M16.5 60 L83.5 60 L81 68 L19 68 Z','3e2723',null),...R.Pf('M24 76 L76 76 L66 84 L34 84 Z','3e2723',null),
 ...R.Pl('M42 22 Q38 10 30 8 M58 22 Q62 10 70 8','3e2723',.035),R.Ci(30,8,2.8,'3e2723',null),R.Ci(70,8,2.8,'3e2723',null),
 ...R.Pf('M46 88 L50 97 L54 88 Z','3e2723',null),
 ...eyes(R,43,12,4.2,5.6),...glint(R,43,12,1.5),...cheeks(R,53,19),...smileL(R,'M42 52 Q50 58 58 52',.055),...R.Pl('M30 36 Q34 30 42 28','fff59d',.04)]);
faceE('ladybug','ea','Joaninha',R=>[
 ...R.Pl('M42 18 Q38 8 30 6 M58 18 Q62 8 70 6','263238',.035),R.Ci(30,6,2.6,'263238',null),R.Ci(70,6,2.6,'263238',null),
 R.Ci(50,58,38,'e53935','7f1010'),
 ...R.Pf('M20 36 Q22 8 50 8 Q78 8 80 36 Q66 44 50 44 Q34 44 20 36 Z','263238','000000'),
 ...R.Pl('M50 44 V95','263238',.04),
 R.Ci(30,62,7,'263238',null),R.Ci(70,62,7,'263238',null),R.Ci(36,82,5.5,'263238',null),R.Ci(64,82,5.5,'263238',null),R.Ci(50,70,0.01,'263238',null),
 R.Ci(36,22,6,'ffffff',null),R.Ci(64,22,6,'ffffff',null),R.Ci(37,23,2.6,'263238',null),R.Ci(65,23,2.6,'263238',null),
 ...R.Pl('M24 52 Q26 44 33 40','ff8a80',.05),...R.Pl('M40 34 Q50 38 60 34','ffffff',.03)]);
faceE('frog','ea','Sapo',R=>[
 R.El(50,66,42,30,0,'7cb342','33691e'),
 R.Ci(27,30,16,'7cb342','33691e'),R.Ci(73,30,16,'7cb342','33691e'),
 R.Ci(27,30,10,'ffffff','33691e'),R.Ci(73,30,10,'ffffff','33691e'),R.Ci(28,31,5.2,D,null),R.Ci(72,31,5.2,D,null),R.Ci(30,28.5,1.8,'ffffff',null),R.Ci(74,28.5,1.8,'ffffff',null),
 R.El(50,76,28,12,0,'aed581',null),
 ...R.Pl('M24 66 Q50 92 76 66','33691e',.05),
 R.Ci(41,60,2.2,'33691e',null),R.Ci(59,60,2.2,'33691e',null),R.El(24,68,6,3.6,0,'ff8a80',null),R.El(76,68,6,3.6,0,'ff8a80',null),
 ...R.Pl('M20 84 Q12 92 6 90 M80 84 Q88 92 94 90','33691e',.04)]);
faceE('duck','ea','Patinho',R=>[
 ...R.Pf('M10 64 C10 46 24 38 38 44 C38 24 54 12 70 18 C84 24 86 38 80 46 C86 52 88 60 84 68 C84 86 66 96 44 94 C24 92 10 82 10 64 Z','ffd93d'),
 ...R.Pf('M28 66 C34 80 52 82 62 70 C54 62 40 56 28 66 Z','f4b400','a67c00'),
 ...R.Pf('M80 36 C92 34 98 40 96 44 C92 50 84 50 80 46 Z','ff9800'),R.Ci(66,32,3.8,D,null),R.Ci(67,31,1.3,'ffffff',null),R.El(72,44,5,3.4,0,'ff8a80',null),
 ...R.Pl('M58 22 Q64 14 72 16','fff3a0',.04),...R.Pl('M20 52 Q22 46 28 44','fff3a0',.035)]);

faceE('grin','ef','Carinha sorridente',R=>[fce(R),...eyes(R,38,15,5,7),...glint(R,38,15,1.8),
 ...R.Pf('M24 56 Q50 68 76 56 Q72 84 50 84 Q28 84 24 56 Z',MT,'4a1a0a'),...R.Pf('M27 58 Q50 69 73 58 Q71 66 50 70 Q29 66 27 58 Z','ffffff',null),...R.Pf('M38 78 Q50 70 62 78 Q56 83 50 83 Q44 83 38 78 Z',PK,null),...cheeks(R,60,33).slice(0,0)]);
faceE('tongue','ef','Carinha de língua',R=>[fce(R),R.El(65,38,5.5,7.5,0,D,null),R.Ci(66.5,35,1.8,'ffffff',null),...R.Pl('M26 40 Q34 32 42 40',D,.07),
 ...R.Pl('M27 56 Q50 72 73 56',D,.07),...R.Pf('M41 64 H62 V78 Q62 90 51.5 90 Q41 90 41 78 Z','ff6f91','c2185b'),...R.Pl('M51.5 66 V80','c2185b',.03)]);
faceE('nerd','ef','Carinha nerd',R=>[fce(R),R.Ci(33,44,13,'ffffff','3e2723'),R.Ci(67,44,13,'ffffff','3e2723'),R.Ci(34,45,4,D,null),R.Ci(66,45,4,D,null),...R.Pl('M46 43 Q50 40 54 43','3e2723',.05),
 ...R.Pl('M20 41 L8 36 M80 41 L92 36','3e2723',.04),...R.Pl('M24 26 Q33 20 42 26',D,.05),...R.Pl('M58 26 Q67 20 76 26',D,.05),...R.Pl('M32 68 Q50 80 68 68',D,.07),...R.Pf('M45 72 H55 V82 Q50 84 45 82 Z','ffffff',D)]);
faceE('party','ef','Carinha de festa',R=>[fce(R,60,38),...R.Pf('M50 2 L74 36 Q50 44 26 36 Z','7e57c2'),...R.Pl('M40 20 L60 26 M34 30 L66 36','ffeb3b',.04),R.Ci(50,5,5,'ffeb3b','c79100'),
 ...R.Sy([R.El(38,56,4,6,0,D,null)]),...R.Pf('M32 70 Q50 88 68 70 Q50 74 32 70 Z',MT,'4a1a0a'),...R.Pf('M38 74 Q50 82 62 74 Q50 77 38 74 Z',PK,null),
 R.Ci(10,44,3.4,'e53935',null),R.Ci(92,30,3.4,'29b6f6',null),...R.Pf('M86 56 L93 60 L88 67 Z','66bb6a'),...R.Pf('M6 66 L13 64 L11 72 Z','ffa726'),R.Ci(94,78,3,'ab47bc',null)]);
faceE('blush','ef','Carinha corada',R=>[fce(R),...R.Pl('M26 42 Q34 33 42 42',D,.07),...R.Pl('M58 42 Q66 33 74 42',D,.07),...R.Pl('M30 58 Q50 78 70 58',D,.07),...cheeks(R,58,29).slice(0,2)]);
faceE('neutral','ef','Carinha neutra',R=>[fce(R),...eyes(R,40,14,4.6,6.6),...glint(R,40,14,1.6),...R.Pl('M34 66 H66',D,.07)]);
faceE('unamused','ef','Carinha desanimada',R=>[fce(R),...R.Pl('M26 45 H44',D,.07),...R.Pl('M56 45 H74',D,.07),R.Ci(31,51,3.4,D,null),R.Ci(61,51,3.4,D,null),...R.Pl('M24 34 L44 39',D,.06),...R.Pl('M76 34 L56 39',D,.06),...R.Pl('M36 70 Q50 62 64 70',D,.07)]);
faceE('sweat','ef','Carinha aliviada',R=>[fce(R),...eyes(R,42,15,4.6,6.4),...glint(R,42,15,1.6),...R.Pl('M24 30 Q32 25 42 29',D,.055),...R.Pl('M58 29 Q68 25 76 30',D,.055),
 ...R.Pf('M28 58 Q50 70 72 58 Q68 82 50 82 Q32 82 28 58 Z',MT,'4a1a0a'),...R.Pf('M31 60 Q50 71 69 60 Q66 66 50 68 Q34 66 31 60 Z','ffffff',null),
 ...R.Pf('M84 14 Q94 30 84 38 Q74 30 84 14 Z',BL,'2b86c5'),R.Ci(81,31,1.8,'ffffff',null)]);
faceE('dizzy','ef','Carinha tonta',R=>[fce(R),...R.Pl('M26 32 L44 50 M44 32 L26 50',D,.07),...R.Pl('M56 32 L74 50 M74 32 L56 50',D,.07),...R.Pl('M30 70 Q38 62 46 70 T62 70 T74 68',D,.07)]);
faceE('zany','ef','Carinha maluca',R=>[fce(R),R.Ci(34,40,11,'ffffff','4a2c00'),R.Ci(36,41,4.6,D,null),R.Ci(68,42,6.5,'ffffff','4a2c00'),R.Ci(69,43,2.8,D,null),...R.Pl('M22 26 Q32 20 44 25',D,.06),
 ...R.Pf('M24 62 Q50 82 76 62 Q50 70 24 62 Z',MT,'4a1a0a'),...R.Pf('M52 70 Q68 70 70 86 Q58 94 52 80 Z','ff6f91','c2185b')]);
faceE('angel','ef','Carinha angelical',R=>[...R.Pl('M26 14 Q50 -2 74 14','ffd54f',.1),...R.Pl('M26 14 Q50 24 74 14','ffe082',.07),fce(R,57,40),...R.Pl('M30 52 Q38 44 46 52',D,.07),...R.Pl('M54 52 Q62 44 70 52',D,.07),...R.Pl('M34 68 Q50 82 66 68',D,.07),...cheeks(R,66,26)]);
faceE('devil','ef','Carinha de diabinho',R=>[...R.Sy([R.Pf('M18 28 L10 2 L38 18 Z','e53935','8e1b17')[0]]),fce(R,56,40,'ab47bc','5e1670'),
 ...R.Pf('M28 46 Q36 40 44 50 Q36 52 28 46 Z','ffffff',D),...R.Pf('M72 46 Q64 40 56 50 Q64 52 72 46 Z','ffffff',D),R.Ci(38,47,2.6,D,null),R.Ci(62,47,2.6,D,null),...R.Pl('M26 38 L44 44 M74 38 L56 44',D,.06),
 ...R.Pf('M28 66 Q50 86 72 66 Q50 72 28 66 Z','2a0d33',null),...R.Pf('M34 68 L38 76 L42 70 Z M58 70 L62 76 L66 68 Z','ffffff',null)]);
faceE('robot','ef','Robô',R=>[...R.Pl('M50 22 V8',D,.045),R.Ci(50,8,5,'f44336','8e1b17'),...R.Pf('M10 44 H18 V66 H10 Z','90a4ae'),...R.Pf('M82 44 H90 V66 H82 Z','90a4ae'),
 ...R.Pf('M26 22 H74 Q84 22 84 32 V78 Q84 88 74 88 H26 Q16 88 16 78 V32 Q16 22 26 22 Z','cfd8dc','546e7a'),R.Ci(36,50,9,'263238','000000'),R.Ci(64,50,9,'263238','000000'),R.Ci(36,50,5.5,'29b6f6',null),R.Ci(64,50,5.5,'29b6f6',null),R.Ci(34,48,1.8,'ffffff',null),R.Ci(62,48,1.8,'ffffff',null),
 ...R.Pf('M32 68 H68 V80 H32 Z','455a64','263238'),...R.Pl('M41 68 V80 M50 68 V80 M59 68 V80','cfd8dc',.03)]);

const nose=(R,cx,cy,w,f)=>R.Pf(`M${cx-w} ${cy-w*.6} Q${cx} ${cy-w*1.1} ${cx+w} ${cy-w*.6} Q${cx+w*.8} ${cy+w*.7} ${cx} ${cy+w*.9} Q${cx-w*.8} ${cy+w*.7} ${cx-w} ${cy-w*.6} Z`,f||'3e2723',null);
faceE('dog','ea','Cachorro',R=>[...R.Sy(R.Pf('M26 22 Q4 24 6 56 Q8 70 22 66 Q36 60 34 38 Z','8d5a2b','4e2f14')),
 ...R.Pf('M50 14 C72 14 86 30 86 52 C86 76 70 90 50 90 C30 90 14 76 14 52 C14 30 28 14 50 14 Z','f3d3a3','a98550'),
 R.El(36,46,10,10,0,'8d5a2b',null),R.El(50,68,21,17,0,'ffffff','a98550'),...nose(R,50,59,8),
 R.Ci(36,46,4.4,D,null),R.Ci(64,46,4.4,D,null),R.Ci(37.4,44.6,1.4,'ffffff',null),R.Ci(65.4,44.6,1.4,'ffffff',null),...R.Pl('M50 62 V70 M50 70 Q42 80 35 74 M50 70 Q58 80 65 74','3e2723',.04),
 ...R.Pf('M44 76 H56 V86 Q50 93 44 86 Z','ff6f91','c2185b'),...R.Pl('M22 34 Q30 20 44 18','ffffff',.03)]);
faceE('pig','ea','Porquinho',R=>[...R.Sy(R.Pf('M26 22 L12 38 L38 34 Z','f48fb1','ad1457')),R.El(50,56,40,36,0,'f8a5b8','c2185b'),
 R.El(50,66,17,12,0,'f48fb1','c2185b'),R.El(43,66,2.8,4.4,0,'ad1457',null),R.El(57,66,2.8,4.4,0,'ad1457',null),
 R.Ci(32,46,4.4,D,null),R.Ci(68,46,4.4,D,null),R.Ci(33.4,44.6,1.4,'ffffff',null),R.Ci(69.4,44.6,1.4,'ffffff',null),R.El(22,58,6,4,0,'ff8a9d',null),R.El(78,58,6,4,0,'ff8a9d',null),...R.Pl('M24 38 Q30 30 38 28','ffd0de',.04)]);
faceE('panda','ea','Panda',R=>[...R.Sy([R.Ci(24,22,12,'263238','000000')]),R.El(50,56,40,36,0,'ffffff','90a4ae'),
 ...R.Sy([R.El(34,52,10,13,-22,'263238',null)]),...R.Sy([R.Ci(35,52,3.8,'ffffff',null),R.Ci(35.4,52.4,1.7,'263238',null)]),
 R.El(50,66,5.5,4,0,'263238',null),...R.Pl('M50 70 Q45 77 39 73 M50 70 Q55 77 61 73','263238',.04),...R.Sy([R.El(22,68,5,3.4,0,'ffb3c1',null)])]);
faceE('bear','ea','Ursinho',R=>[...R.Sy([R.Ci(24,24,12,'a1672e','5a3716'),R.Ci(24,24,5.5,'d7a46a',null)]),R.El(50,56,40,36,0,'a1672e','5a3716'),
 R.El(50,68,17,13,0,'ebcb97','8a5a22'),...nose(R,50,62,5.5),...R.Pl('M50 66 V72 M50 72 Q44 78 38 74 M50 72 Q56 78 62 74','3e2723',.035),
 R.Ci(34,48,4,D,null),R.Ci(66,48,4,D,null),R.Ci(35.3,46.7,1.3,'ffffff',null),R.Ci(67.3,46.7,1.3,'ffffff',null),R.El(22,60,5.5,3.6,0,'d9826b',null),R.El(78,60,5.5,3.6,0,'d9826b',null)]);
faceE('fox','ea','Raposa',R=>[...R.Pf('M12 6 L38 28 Q50 24 62 28 L88 6 L92 48 Q92 76 50 92 Q8 76 8 48 Z','ff8f2d','a84f00'),
 ...R.Sy(R.Pf('M17 18 L31 30 L15 40 Z','3e2723',null)),...R.Pf('M8 56 Q30 54 50 72 Q70 54 92 56 Q88 80 50 93 Q12 80 8 56 Z','ffffff','a84f00'),
 ...R.Sy(R.Pf('M24 46 Q34 40 43 50 Q34 52 24 46 Z','263238',null)),R.Ci(50,80,5,'263238',null),R.Ci(48.6,78.6,1.4,'ffffff',null),...R.Pl('M50 84 Q44 90 38 86 M50 84 Q56 90 62 86','263238',.03)]);
faceE('lion','ea','Leão',R=>{const m=[];for(let i=0;i<14;i++){const a=i*TAU/14;m.push(R.Ci(50+Math.cos(a)*35,52+Math.sin(a)*35,14,'c2791a','6b3f08'))}
 return[...m,R.Ci(50,52,38,'d98b1f',null),...R.Sy([R.Ci(24,30,9,'ffc766','8a5a10'),R.Ci(24,30,4,'ffa94d',null)]),R.El(50,54,28,28,0,'ffc766','8a5a10'),R.El(50,67,13,10,0,'ffe3a8','8a5a10'),...nose(R,50,60,6),
 ...R.Pl('M50 64 V70 M50 70 Q44 76 38 72 M50 70 Q56 76 62 72','3e2723',.035),R.Ci(38,48,3.8,D,null),R.Ci(62,48,3.8,D,null),R.Ci(39.2,46.8,1.2,'ffffff',null),R.Ci(63.2,46.8,1.2,'ffffff',null)]});
faceE('monkey','ea','Macaco',R=>[...R.Sy([R.Ci(11,50,10,'a1672e','5a3716'),R.Ci(11,50,5.5,'ffcc99',null)]),R.Ci(50,48,36,'a1672e','5a3716'),
 ...R.Pf('M50 40 C60 30 78 36 76 54 C74 70 64 86 50 86 C36 86 26 70 24 54 C22 36 40 30 50 40 Z','f6d3a5','b07a50'),
 R.Ci(40,52,4.2,D,null),R.Ci(60,52,4.2,D,null),R.Ci(41.2,50.8,1.3,'ffffff',null),R.Ci(61.2,50.8,1.3,'ffffff',null),R.El(46,64,1.8,2.6,0,'8a5a22',null),R.El(54,64,1.8,2.6,0,'8a5a22',null),...R.Pl('M38 72 Q50 82 62 72','8a5a22',.045)]);
faceE('chick','ea','Pintinho',R=>[...R.Pl('M42 86 V96 M58 86 V96 M36 96 H48 M52 96 H64','ff9800',.04),...R.Pf('M46 18 Q42 4 50 8 Q54 0 58 10 Q64 6 60 20 Z','ffd93d'),
 R.Ci(50,54,38,'ffe135','b89600'),...R.Sy([R.El(14,58,8,14,-14,'ffd400','b89600')]),R.Ci(36,46,4.4,D,null),R.Ci(64,46,4.4,D,null),R.Ci(37.4,44.6,1.4,'ffffff',null),R.Ci(65.4,44.6,1.4,'ffffff',null),
 ...R.Pf('M41 56 H59 L50 68 Z','ff9800','b36b00'),...R.Sy([R.El(26,60,6,4,0,'ff9e80',null)]),...R.Pl('M44 56 H56','ffb74d',.02)]);
faceE('owl','ea','Coruja',R=>[...R.Pf('M16 30 L8 10 L30 20 Q50 14 70 20 L92 10 L84 30 Q93 52 84 74 Q74 92 50 92 Q26 92 16 74 Q7 52 16 30 Z','8d6e63','4e342e'),
 ...R.Pf('M30 66 Q50 88 70 66 Q66 90 50 92 Q34 90 30 66 Z','d7b899',null),...R.Pl('M40 74 Q50 80 60 74 M42 82 Q50 86 58 82','8d6e63',.025),
 ...R.Sy([R.Ci(34,46,15,'ffe0b2','5d4037'),R.Ci(34,47,7,D,null),R.Ci(36,44.5,2.2,'ffffff',null)]),...R.Pf('M43 54 H57 L50 68 Z','ffb300','a66f00'),...R.Pl('M18 40 Q20 30 26 26 M82 40 Q80 30 74 26','5d4037',.03)]);
faceE('turtle','ea','Tartaruga',R=>[...R.Sy([R.El(18,36,10,7,-35,'8bc34a','33691e'),R.El(20,76,10,7,35,'8bc34a','33691e')]),...R.Pf('M46 86 L50 98 L54 86 Z','8bc34a','33691e'),
 R.Ci(50,16,12,'8bc34a','33691e'),R.Ci(45,13,2.2,D,null),R.Ci(55,13,2.2,D,null),...R.Pl('M45 20 Q50 23 55 20','33691e',.03),
 R.Ci(50,56,32,'66bb6a','2e7d32'),...R.Pf('M50 40 L62 47 V63 L50 70 L38 63 V47 Z','43a047','2e7d32'),...R.Pl('M50 40 V28 M62 47 L72 40 M62 63 L72 70 M50 70 V84 M38 63 L28 70 M38 47 L28 40','2e7d32',.03),...R.Pl('M34 40 Q40 32 48 29','a5d6a7',.04)]);
faceE('unicorn','ea','Unicórnio',R=>[...R.Sy(R.Pf('M30 24 Q4 32 8 66 Q12 78 22 72 Q18 52 36 36 Z','f06292','ad1457')),...R.Sy(R.Pf('M28 22 L22 4 L42 18 Z','ffffff','b0bec5')),
 ...R.Pf('M50 18 C70 18 78 34 78 54 C78 80 66 92 50 92 C34 92 22 80 22 54 C22 34 30 18 50 18 Z','ffffff','b0bec5'),
 ...R.Pf('M50 0 L57 28 H43 Z','ffd54f','b8860b'),...R.Pl('M46 20 L54 14 M45 12 L53 6','b8860b',.025),...R.Pf('M42 22 Q58 16 64 32 Q52 28 42 38 Z','ba68c8','6a1b9a'),
 R.El(50,78,16,11,0,'ffe3ec','e8a2b8'),...R.Sy([R.Ci(44,79,2,'ad1457',null)]),...R.Sy(R.Pl('M30 52 Q37 59 44 52',D,.045)),...R.Sy([R.El(27,64,5.4,3.4,0,'ffb3c1',null)]),...R.Pl('M44 86 Q50 90 56 86','ad1457',.03)]);

faceE('burger','ec','Hambúrguer',R=>[...R.Pf('M10 82 H90 Q90 94 78 94 H22 Q10 94 10 82 Z','e0a458','8a5a22'),...R.Pf('M8 60 H92 V74 Q92 80 84 80 H16 Q8 80 8 74 Z','6d4c41','3e2723'),
 ...R.Pf('M10 58 H90 L78 74 L66 62 L50 74 L38 62 L24 74 Z','ffca28','b38600'),...R.Pf('M8 50 Q18 42 28 50 Q38 58 50 50 Q62 42 72 50 Q82 58 92 50 V60 H8 Z','7cb342','33691e'),
 ...R.Pf('M10 46 Q10 12 50 12 Q90 12 90 46 Z','e8b062','8a5a22'),R.El(30,26,3.6,2,-30,'fff3e0',null),R.El(48,20,3.6,2,10,'fff3e0',null),R.El(66,26,3.6,2,30,'fff3e0',null),R.El(40,36,3.6,2,20,'fff3e0',null),R.El(60,36,3.6,2,-20,'fff3e0',null),...R.Pl('M20 34 Q24 22 36 16','fff3e0',.035)]);
faceE('donut','ec','Rosquinha',R=>[R.Ci(50,52,44,'e8b872','8a5a22'),...R.Pf('M50 14 C72 12 92 28 90 52 C88 76 70 90 50 90 C30 90 10 78 10 54 C10 28 30 16 50 14 Z','f48fb1','ad1457'),
 R.El(50,52,14,12,0,'7a5230','5d3a1a'),R.El(26,34,5,1.8,-30,'ffeb3b',null),R.El(64,24,5,1.8,20,'4fc3f7',null),R.El(78,50,5,1.8,70,'ffffff',null),R.El(72,74,5,1.8,-30,'ffeb3b',null),R.El(40,76,5,1.8,15,'66bb6a',null),R.El(24,58,5,1.8,80,'ffffff',null),R.El(48,28,5,1.8,-10,'ffffff',null),...R.Pl('M24 28 Q32 20 44 18','ffffff',.04)]);
faceE('strawberry','ec','Morango',R=>[...R.Pf('M50 96 C22 82 8 58 12 40 C16 26 34 24 50 30 C66 24 84 26 88 40 C92 58 78 82 50 96 Z','e53935','8e1b17'),
 ...[[32,46],[50,44],[68,46],[24,62],[42,60],[58,60],[76,62],[34,76],[50,76],[66,76],[50,90]].map(([x,y])=>R.El(x,y,2.2,3.2,0,'ffe082',null)),
 ...R.Pf('M50 34 L38 14 L46 28 L28 22 L42 36 L30 44 L50 40 L70 44 L58 36 L72 22 L54 28 L62 14 Z','43a047','1b5e20'),...R.Pl('M26 40 Q22 52 28 64','ff8a80',.04)]);
faceE('watermelon','ec','Melancia',R=>[...R.Pf('M4 34 H96 A46 46 0 0 1 4 34 Z','43a047','1b5e20'),...R.Pf('M9 34 H91 A41 41 0 0 1 9 34 Z','e8f5e9',null),...R.Pf('M13 34 H87 A37 37 0 0 1 13 34 Z','ef5350','b71c1c'),
 ...[[30,46,-20],[50,52,0],[70,46,20],[40,64,-10],[60,64,10]].map(([x,y,a])=>R.El(x,y,2.6,4.2,a,'263238',null)),...R.Pl('M18 38 Q50 44 82 38','ff8a80',.03)]);
faceE('grapes','ec','Uvas',R=>[...R.Pl('M50 20 Q52 10 60 6','6d4c41',.05),...R.Pf('M56 16 Q70 4 88 12 Q80 28 60 26 Z','66bb6a','2e7d32'),
 ...[[30,38],[50,36],[70,38],[40,54],[60,54],[30,70],[50,70],[70,70],[40,84],[60,84],[50,96]].slice(0,10).map(([x,y])=>R.Ci(x,y,11,'8e24aa','4a148c')),
 ...[[30,38],[50,36],[70,38],[40,54],[60,54],[30,70],[50,70],[70,70],[40,84],[60,84]].map(([x,y])=>R.Ci(x-3.5,y-3.5,2.6,'ce93d8',null))]);
faceE('lemon','ec','Limão',R=>[...R.Pf('M4 50 Q10 42 20 38 Q50 20 80 38 Q90 42 96 50 Q90 58 80 62 Q50 80 20 62 Q10 58 4 50 Z','ffeb3b','a68b00'),...R.Pl('M24 44 Q36 34 52 33','fff9c4',.05),...R.Pl('M30 64 Q50 72 70 62','f9a825',.04),
 ...R.Pf('M72 36 Q80 18 94 14 Q94 30 78 38 Z','66bb6a','2e7d32')]);
faceE('coffee','ec','Café',R=>[...R.Pl('M32 30 Q26 22 32 14 Q38 6 32 -2','b0bec5',.04).map(x=>({...x,pts:x.pts.map(q=>[q[0],Math.max(q[1],-1)])})),...R.Pl('M50 28 Q44 20 50 12','cfd8dc',.04),...R.Pl('M68 28 Q62 20 68 12','cfd8dc',.04),
 ...R.Pl('M74 48 Q94 46 92 62 Q90 78 72 76','78909c',.08),...R.Pf('M12 38 H78 V64 Q78 90 54 90 H36 Q12 90 12 64 Z','ffffff','78909c'),R.El(45,38,33,6,0,'6d4c41','3e2723'),R.El(45,38,24,3,0,'8d6e63',null),
 R.El(46,94,42,5,0,'cfd8dc','78909c'),...R.Pl('M20 52 Q22 70 32 78','e3f2fd',.04)]);
faceE('fries','ec','Batata frita',R=>[...[[22,24],[32,12],[42,20],[52,8],[62,18],[72,26]].map(([x,y],i)=>R.Pf(`M${x-5} ${y} L${x+5} ${y} L${x+5} 60 L${x-5} 60 Z`,i%2?'ffd54f':'ffca28','b38600')).flat(),
 ...R.Pf('M14 50 H86 L80 96 H20 Z','e53935','8e1b17'),...R.Pf('M32 50 H68 L66 96 H34 Z','ffeb3b','b38600',{}).slice(0,1),R.Ci(50,70,10,'e53935',null),...R.Pl('M44 66 Q50 60 56 66 Q50 78 44 66','ffeb3b',.03)]);
faceE('cake','ec','Fatia de bolo',R=>[...R.Pf('M12 50 H88 V90 Q88 94 84 94 H16 Q12 94 12 90 Z','f8bbd0','ad1457'),...R.Pf('M12 66 H88 V74 H12 Z','fff8e1',null),...R.Pf('M10 44 Q12 32 28 36 Q36 26 52 34 Q62 26 76 36 Q90 32 92 46 Q88 56 80 50 Q74 58 66 50 Q58 58 50 50 Q42 58 34 50 Q26 58 18 50 Q12 56 10 44 Z','fff3e0','b0956a'),
 R.Ci(50,26,8,'e53935','8e1b17'),...R.Pl('M50 20 Q52 12 58 8','43a047',.04),R.Ci(47,23,2,'ff8a80',null)]);

faceE('camera','eo','Câmera',R=>[...R.Pf('M8 32 Q8 26 14 26 H30 L36 16 H64 L70 26 H86 Q92 26 92 32 V82 Q92 88 86 88 H14 Q8 88 8 82 Z','607d8b','263238'),...R.Pf('M12 40 H88 V60 H12 Z','546e7a',null),
 R.Ci(50,56,24,'37474f','1c262b'),R.Ci(50,56,17,'29b6f6','01579b'),R.Ci(50,56,8,'01579b',null),R.Ci(43,49,3.4,'ffffff',null),...R.Pf('M16 34 H28 V40 H16 Z','ffeb3b','b38600'),R.Ci(78,36,3.4,'ef5350','8e1b17')]);
faceE('phone','eo','Celular',R=>[...R.Pf('M28 4 H72 Q80 4 80 12 V88 Q80 96 72 96 H28 Q20 96 20 88 V12 Q20 4 28 4 Z','37474f','102027'),...R.Pf('M26 14 H74 V80 H26 Z','4fc3f7','0277bd'),
 ...R.Pf('M31 22 H58 V32 H31 Z','ffffff',null),...R.Pf('M42 38 H69 V48 H42 Z','c8e6c9',null),...R.Pf('M31 54 H56 V64 H31 Z','ffffff',null),R.Ci(50,89,3.6,'78909c',null),R.El(50,9,5,1.6,0,'78909c',null)]);
faceE('book','eo','Livro',R=>[...R.Pf('M20 6 H80 Q86 6 86 12 V88 Q86 94 80 94 H20 Z','1e88e5','0d47a1'),...R.Pf('M20 6 H32 V94 H20 Z','1565c0',null),...R.Pf('M86 12 H92 V88 H86 Z','fff8e1','8d6e3a'),
 ...R.Pl('M44 28 H72 M44 38 H66','e3f2fd',.045),...R.Pf(SL.starPts(5,.45,0,10).map(q=>`${(58+q[0]*11).toFixed(1)} ${(66+q[1]*11).toFixed(1)}`).reduce((a,c,i)=>a+(i?' L':'M')+c,'')+' Z','ffd54f','b38600')]);
faceE('hammer','eo','Martelo',R=>[...R.Pf('M44 36 H56 V96 Q56 98 54 98 H46 Q44 98 44 96 Z','a1672e','5a3716'),...R.Pf('M12 14 H78 Q88 14 88 24 V30 Q88 38 78 38 H12 Z','90a4ae','37474f'),...R.Pf('M12 14 H26 V38 H12 Z','607d8b',null),...R.Pl('M32 20 H74','eceff1',.04)]);
faceE('magnet','eo','Ímã',R=>[...R.Pf('M16 10 H36 V56 Q36 66 50 66 Q64 66 64 56 V10 H84 V56 Q84 92 50 92 Q16 92 16 56 Z','e53935','8e1b17'),...R.Pf('M16 10 H36 V28 H16 Z','eceff1','78909c'),...R.Pf('M64 10 H84 V28 H64 Z','eceff1','78909c'),...R.Pl('M24 36 V56 Q24 78 40 84','ff8a80',.045)]);
faceE('hourglass','eo','Ampulheta',R=>[...R.Pf('M24 8 H76 V18 Q76 40 56 50 Q76 60 76 82 V92 H24 V82 Q24 60 44 50 Q24 40 24 18 Z','e1f5fe','546e7a'),...R.Pf('M32 18 H68 Q66 30 54 42 H46 Q34 30 32 18 Z','ffca28',null),...R.Pf('M34 90 H66 Q64 76 54 66 H46 Q36 76 34 90 Z','ffca28',null),
 ...R.Pf('M14 2 H86 V10 H14 Z','8d6e63','4e342e'),...R.Pf('M14 90 H86 V98 H14 Z','8d6e63','4e342e'),...R.Pl('M30 20 Q32 38 44 48','ffffff',.035)]);
faceE('compass','eo','Bússola',R=>[R.Ci(50,50,46,'cfd8dc','455a64'),R.Ci(50,50,38,'fff8e1','8d6e3a'),...R.Pl('M50 16 V22 M50 78 V84 M16 50 H22 M78 50 H84','8d6e3a',.04),...R.Pf('M50 18 L60 50 L50 45 L40 50 Z','e53935','8e1b17'),...R.Pf('M50 82 L60 50 L50 55 L40 50 Z','eceff1','455a64'),R.Ci(50,50,4,'455a64',null)]);
faceE('globe','eo','Globo',R=>[...R.Pf('M32 88 H68 V94 H32 Z','8d6e63','4e342e'),...R.Pl('M50 88 V80','8d6e63',.06),R.Ci(50,46,40,'4fc3f7','0277bd'),...R.Pf('M24 32 Q38 20 50 30 Q46 44 34 46 Q20 44 24 32 Z','66bb6a','2e7d32'),...R.Pf('M54 50 Q70 44 80 56 Q74 76 60 72 Q50 64 54 50 Z','66bb6a','2e7d32'),
 ...R.Pf('M30 62 Q38 58 42 68 Q38 78 30 72 Z','66bb6a','2e7d32'),...R.Pl('M14 38 Q50 28 86 38','e1f5fe',.025),...R.Pl('M22 22 Q30 8 44 8','ffffff',.04)]);
faceE('gamepad','eo','Controle',R=>[...R.Pf('M10 46 Q10 30 28 30 H72 Q90 30 90 46 L94 72 Q96 84 86 84 Q78 84 72 72 H28 Q22 84 14 84 Q4 84 6 72 Z','7e57c2','4527a0'),...R.Pf('M24 40 H30 V46 H36 V52 H30 V58 H24 V52 H18 V46 H24 Z','eceff1','455a64'),
 R.Ci(70,42,4.2,'ffeb3b','b38600'),R.Ci(78,50,4.2,'e53935','8e1b17'),R.Ci(62,50,4.2,'43a047','1b5e20'),R.Ci(70,58,4.2,'29b6f6','0277bd'),...R.Pl('M20 36 Q40 32 60 34','b39ddb',.035)]);
faceE('headphones','eo','Fones de ouvido',R=>[...R.Pl('M18 58 V50 Q18 14 50 14 Q82 14 82 50 V58','37474f',.13),...R.Sy(R.Pf('M8 52 Q8 44 18 44 H28 V88 H18 Q8 88 8 80 Z','e53935','8e1b17')),...R.Sy(R.Pf('M28 52 H34 V80 H28 Z','37474f',null)),...R.Sy(R.Pl('M14 54 V76','ff8a80',.04))]);
faceE('palette','eo','Paleta de tinta',R=>[...R.Pf('M50 8 C20 8 4 30 4 52 C4 76 24 92 44 92 C54 92 56 84 52 78 C48 70 56 62 66 64 C80 66 96 60 96 44 C96 22 76 8 50 8 Z','ffcc80','a87a3a'),
 R.Ci(28,64,6,'3e2723',null),R.Ci(30,34,7,'e53935','8e1b17'),R.Ci(52,24,7,'ffeb3b','b38600'),R.Ci(74,34,7,'43a047','1b5e20'),R.Ci(20,50,6,'1e88e5','0d47a1'),R.Ci(78,54,6,'ab47bc','6a1b9a')]);
faceE('potion','eo','Poção',R=>[...R.Pf('M36 4 H64 V14 H36 Z','a1887f','5d4037'),...R.Pf('M40 14 H60 V32 H40 Z','b0bec5','546e7a'),...R.Pf('M40 30 Q8 52 12 78 Q16 96 50 96 Q84 96 88 78 Q92 52 60 30 Z','e1f5fe','78909c'),
 ...R.Pf('M13 68 Q50 54 87 68 Q88 96 50 96 Q16 96 13 68 Z','ab47bc','6a1b9a'),R.Ci(36,78,4,'e1bee7',null),R.Ci(58,84,3,'e1bee7',null),R.Ci(64,72,2.4,'e1bee7',null),...R.Pl('M24 54 Q26 44 34 38','ffffff',.045)]);
faceE('swordE','eo','Espada',R=>[...R.Pf('M50 2 L60 14 V62 H40 V14 Z','cfd8dc','546e7a'),...R.Pl('M50 12 V58','90a4ae',.03),...R.Pf('M20 62 H80 V72 H20 Z','ffca28','a67c00'),...R.Pf('M44 72 H56 V90 H44 Z','8d5a2b','4e2f14'),R.Ci(50,94,5,'ffca28','a67c00')]);
faceE('shieldE','eo','Escudo',R=>[...R.Pf('M50 4 C62 12 78 14 92 14 V50 C92 76 70 90 50 98 C30 90 8 76 8 50 V14 C22 14 38 12 50 4 Z','1e88e5','0d47a1'),...R.Pf('M50 14 C60 20 72 22 82 22 V50 C82 70 66 80 50 88 C34 80 18 70 18 50 V22 C28 22 40 20 50 14 Z','eceff1',null),...R.Pf('M50 14 C60 20 72 22 82 22 V50 C82 70 66 80 50 88 Z','e53935',null).slice(0,0),
 ...R.Pf(SL.starPts(5,.45,0,10).map(q=>`${(50+q[0]*22).toFixed(1)} ${(52+q[1]*22).toFixed(1)}`).reduce((a,c,i)=>a+(i?' L':'M')+c,'')+' Z','ffca28','a67c00')]);
faceE('crystal','eo','Bola de cristal',R=>[...R.Pf('M24 86 Q50 76 76 86 L84 96 H16 Z','8d6e63','4e342e'),R.Ci(50,44,38,'b39ddb','4527a0'),R.Ci(50,48,28,'7e57c2',null),...R.Pl('M28 30 Q34 18 48 14','ffffff',.06),R.Ci(60,60,3,'ffffff',null),R.Ci(40,54,2,'e1bee7',null),R.Ci(66,40,2,'e1bee7',null)]);
faceE('candle','eo','Vela',R=>[...R.Pf('M50 4 Q66 22 60 34 Q56 40 50 40 Q44 40 40 34 Q34 22 50 4 Z','ff9800','e65100'),...R.Pf('M50 18 Q58 28 55 34 Q53 38 50 38 Q47 38 45 34 Q42 28 50 18 Z','ffeb3b',null),
 ...R.Pf('M34 44 H66 V90 Q66 96 58 96 H42 Q34 96 34 90 Z','fff8e1','b0956a'),...R.Pf('M34 44 Q50 52 66 44 V52 Q62 58 58 52 Q54 62 50 52 Q44 60 40 52 Q36 56 34 52 Z','f5e6c8',null),...R.Pl('M50 40 V44','3e2723',.04)]);
faceE('anchor','eo','Âncora',R=>[...R.Pl('M50 22 V86','78909c',.1),...R.Pl('M50 6 A8 8 0 1 0 50.1 6','78909c',.08),...R.Pl('M32 34 H68','78909c',.08),...R.Pl('M14 58 Q18 92 50 92 Q82 92 86 58','78909c',.09),...R.Pf('M4 62 L16 50 L24 66 Z','78909c',null),...R.Pf('M96 62 L84 50 L76 66 Z','78909c',null)]);

faceE('cactusE','en','Cacto',R=>[...R.Pf('M38 80 V30 Q38 12 50 12 Q62 12 62 30 V80 Z','43a047','1b5e20'),...R.Pf('M38 58 H28 Q18 58 18 48 V36 Q18 30 24 30 Q30 30 30 36 V48 H38 Z','43a047','1b5e20'),...R.Pf('M62 50 H72 Q82 50 82 40 V28 Q82 22 76 22 Q70 22 70 28 V40 H62 Z','43a047','1b5e20'),
 ...R.Pl('M44 20 V76 M50 16 V78 M56 20 V76','a5d6a7',.025),R.Ci(50,11,5,'ff4081','ad1457'),...R.Pf('M28 76 H72 L66 96 H34 Z','d2691e','8a4513'),...R.Pf('M26 74 H74 V82 H26 Z','e08a45','8a4513')]);
faceE('palmE','en','Palmeira',R=>[...R.Pf('M44 98 Q48 62 56 40 L66 42 Q58 66 62 98 Z','a1887f','5d4037'),...R.Pf('M60 40 Q40 14 8 26 Q36 28 60 40 Z','43a047','1b5e20'),...R.Pf('M62 40 Q84 14 96 34 Q80 28 62 40 Z','43a047','1b5e20'),...R.Pf('M60 40 Q50 18 62 4 Q70 22 62 40 Z','66bb6a','1b5e20'),
 ...R.Pf('M60 42 Q38 36 24 56 Q42 46 60 42 Z','66bb6a','1b5e20'),...R.Pf('M64 42 Q80 40 90 60 Q76 48 64 42 Z','66bb6a','1b5e20'),R.Ci(58,46,4,'6d4c41',null),R.Ci(66,48,4,'6d4c41',null)]);
faceE('maple','en','Folha de bordo',R=>[...R.Pf('M50 96 V72','8d5a2b','5a3716').slice(0,0),...R.Pl('M50 98 V72','8d5a2b',.05),...R.Pf('M50 76 L48 72 L28 78 L34 56 L12 50 L30 40 L22 20 L40 28 L50 6 L60 28 L78 20 L70 40 L88 50 L66 56 L72 78 L52 72 Z','e64a19','8e2a0a'),
 ...R.Pl('M50 72 V30 M50 62 L34 52 M50 62 L66 52 M50 46 L38 36 M50 46 L62 36','ffab91',.03)]);

faceE('qE','es','Interrogação',R=>[...R.Pf('M30 34 Q30 6 54 6 Q80 6 80 30 Q80 46 64 54 Q56 58 56 68 H40 Q40 52 54 44 Q66 38 66 30 Q66 20 54 20 Q44 20 44 34 Z','e53935','8e1b17'),R.Ci(48,86,8,'e53935','8e1b17')]);
faceE('exclE','es','Exclamação',R=>[...R.Pf('M36 6 H64 Q68 6 68 12 L60 66 H40 L32 12 Q32 6 36 6 Z','e53935','8e1b17'),R.Ci(50,86,9,'e53935','8e1b17')]);
faceE('musicE','es','Notas musicais',R=>[...R.Pf('M32 74 H40 V26 L84 14 V64 H76 V32 L48 40 V74 Z','5e35b1','311b92'),R.El(28,78,13,10,-20,'5e35b1','311b92'),R.El(72,68,13,10,-20,'5e35b1','311b92')]);
faceE('peace','es','Paz',R=>[R.Ci(50,50,44,'66bb6a','2e7d32'),R.Ci(50,50,35,'f1f8e9','2e7d32'),...R.Pl('M50 15 V85 M50 50 L26 74 M50 50 L74 74','2e7d32',.07)]);
})();
