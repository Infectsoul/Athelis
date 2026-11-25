'use strict';
(()=>{
const{TAU,cl,rad,lerp,circ,arc,ellR,u50,C100,E100,pp100,rot,norm,mirX,xf,thickLine,heartN,plus12,starPts,bulge,crClosed,crOpen,rng,bbox,mix,dk,lt,P,PS,pr,pb,ps,pc,when,RD,add,pathPts}=SL;
const cn=(n,d)=>{const old=Math.max(d||8,Math.round(n)),k=SL.SEGK.k;return k===1?old:Math.max(3,Math.min(720,Math.round(old*k)))};
const O=(l)=>l.map((t,i)=>[i,t]);
function cutRect(G,st,sz,n){const m=Math.min(G.W,G.H)/2,cx=Math.min(.98,sz/100*m/(G.W/2)),cy=Math.min(.98,sz/100*m/(G.H/2)),o=[];
 [[-1,-1],[1,-1],[1,1],[-1,1]].forEach(([sx,sy],i)=>{const K=[sx,sy],A=[[-1,-1+cy],[1-cx,-1],[1,1-cy],[-1+cx,1]][i],B=[[-1+cx,-1],[1,-1+cy],[1-cx,1],[-1,1-cy]][i];
  if(sz<=0){o.push(K);return}
  if(st===0){o.push(A,B)}
  else if(st===1){const a0=Math.atan2((A[1]-K[1])/cy,(A[0]-K[0])/cx);let da=Math.atan2((B[1]-K[1])/cy,(B[0]-K[0])/cx)-a0;while(da>Math.PI)da-=TAU;while(da<-Math.PI)da+=TAU;const k=cn(n/8,6);for(let j=0;j<=k;j++){const a=a0+da*j/k;o.push([K[0]+Math.cos(a)*cx,K[1]+Math.sin(a)*cy])}}
  else{const a=[A[0]-K[0],A[1]-K[1]],b=[B[0]-K[0],B[1]-K[1]];[[1,0,0,0],[1,0,.5,.5],[.5,.5,.5,.5],[.5,.5,0,1],[0,0,0,1]].forEach(([p,q,r,s2],j)=>{});
   [[a[0],a[1]],[a[0]+b[0]/2,a[1]+b[1]/2],[a[0]/2+b[0]/2,a[1]/2+b[1]/2],[a[0]/2+b[0],a[1]/2+b[1]],[b[0],b[1]]].forEach(q=>o.push([K[0]+q[0],K[1]+q[1]]))}});return o}
function scallop(k,depth,n){const s=Math.sin(Math.PI/k),rmin=s/(1+s),vd=rl=>{const c=1-rl,q=rl*rl-c*c*s*s;return 1-(c*Math.cos(Math.PI/k)+Math.sqrt(Math.max(0,q)))},maxd=vd(rmin+1e-6),want=depth*maxd;
 let a=rmin+1e-6,b=1;for(let i=0;i<40;i++){const m=(a+b)/2;if(vd(m)>want)a=m;else b=m}const rl=(a+b)/2,c=1-rl,rv=1-vd(rl),o=[],per=cn(n/k,6);
 for(let i=0;i<k;i++){const ph=-Math.PI/2+i*TAU/k,C=[Math.cos(ph)*c,Math.sin(ph)*c],vl=ph-Math.PI/k,vr=ph+Math.PI/k,L=[Math.cos(vl)*rv,Math.sin(vl)*rv],R=[Math.cos(vr)*rv,Math.sin(vr)*rv];
  const a0=Math.atan2(L[1]-C[1],L[0]-C[0]);let da=Math.atan2(R[1]-C[1],R[0]-C[0])-a0;while(da<0)da+=TAU;const mid=a0+da/2;let dm=Math.atan2(Math.sin(mid-ph),Math.cos(mid-ph));if(Math.abs(dm)>Math.PI/2)da-=TAU;
  for(let j=0;j<per;j++){const t=a0+da*j/per;o.push([C[0]+Math.cos(t)*rl,C[1]+Math.sin(t)*rl])}}return o}

add('tri','b','Triângulo',[pr('sk','Inclinação do pico',0,-100,100,5,'%'),pr('cv','Lados curvos',0,-60,60,5,'%','Positivo estufa os lados (triângulo de Reuleaux ≈ 58%); negativo afunda.'),RD()],(p,n)=>[P(bulge([[p.sk/100,-1],[1,1],[-1,1]],p.cv/100,cn(n/3,6)))],{seg:p=>Math.abs(p.cv)>=1});
add('rtri','b','Triângulo retângulo',[ps('c','Ângulo reto',0,O(['Embaixo à esquerda','Embaixo à direita','Em cima à esquerda','Em cima à direita'])),pr('cv','Hipotenusa curva',0,-60,60,5,'%'),RD()],p=>{const q=[[[-1,-1],[1,1],[-1,1]],[[1,-1],[1,1],[-1,1]],[[-1,-1],[1,-1],[-1,1]],[[-1,-1],[1,-1],[1,1]]][p.c];return[P(q)]});
add('dia','b','Losango',[pr('h','Altura da ponta lateral',50,15,85,5,'%'),pr('cv','Lados curvos',0,-70,40,5,'%','Negativo afunda os lados (estrela de 4 pontas / astroide).'),RD()],(p,n)=>[P(bulge([[0,-1],[1,p.h/50-1],[0,1],[-1,p.h/50-1]],p.cv/100,cn(n/4,6)))],{seg:p=>Math.abs(p.cv)>=1});
add('trap','b','Trapézio',[pr('t','Largura do topo',55,5,95,5,'%'),pr('sh','Deslocar o topo',0,-60,60,5,'%'),RD()],p=>[P([[-p.t/100+p.sh/100,-1],[p.t/100+p.sh/100,-1],[1,1],[-1,1]])]);
add('par','b','Paralelogramo',[pr('s','Inclinação',30,-80,80,5,'%'),RD()],p=>{const s=p.s/50;return[P([[-1+Math.max(0,s),-1],[1+Math.min(0,s),-1],[1-Math.max(0,s),1],[-1-Math.min(0,s),1]])]});
add('pol','b','Polígono',[pr('n','Lados',6,3,40),pr('cv','Lados curvos',0,-60,60,5,'%'),pr('ro','Giro',0,0,180,5,'°'),RD()],(p,n)=>[P(bulge(rot(circ(0,0,1,1,Math.round(p.n)),rad(p.ro)),p.cv/100,cn(n/p.n,4)))],{seg:p=>Math.abs(p.cv)>=1,n0:36});
add('poly2','b','Polígono estrelado',[pr('n','Pontas',7,5,24),pr('k','Salto',3,2,11,1,'','Une pontos saltando k posições: {7/3}, {8/3}, {5/2}… Se n e k têm divisor comum, vira composto (várias figuras).'),pb('fl','Preencher o centro',0)],p=>{const n=Math.round(p.n),k=Math.min(Math.round(p.k),Math.floor((n-1)/2)||2),V=circ(0,0,1,1,n),g=(function gcd(a,b){return b?gcd(b,a%b):a})(n,k),o=[];
 if(p.fl&&g===1){const pts=[];for(let i=0;i<n;i++)pts.push(V[(i*k)%n]);return[P(pts)]}
 for(let s=0;s<g;s++){const pts=[];for(let i=0;i<n/g;i++)pts.push(V[(s+i*k)%n]);o.push(P(pts,{sub:s>0?1:0}))}return o},{open:true,fit:false});
add('rrect','b','Retângulo de cantos',[ps('st','Estilo do canto',0,O(['Chanfro','Côncavo (cupom)','Degrau'])),pr('sz','Tamanho do canto',25,0,100,5,'%'),RD()],(p,n,G)=>[P(cutRect(G,p.st,p.sz,n))],{seg:p=>p.st===1});
add('arch','b','Arco / portal',[pr('r','Curva do topo',100,20,100,5,'%'),pr('fr','Moldura interna',0,0,40,2,'%','0 = sem moldura; senão faz o vão do portal.'),ps('bs','Base',0,O(['Reta','Arredondada'])),RD()],(p,n,G)=>{const r=p.r/100,m=cn(n/2,6),top=y=>[...arc(0,y+r-1+1-1,1,r,Math.PI,TAU,m)];
 const mk=(w,y0,rr)=>{const rt=rr;const pts=[[-w,1],[-w,y0+rt],...arc(0,y0+rt,w,rt,Math.PI,TAU,m).slice(1,-1),[w,y0+rt],[w,1]];return pts};
 const o=[P(mk(1,-1,r))];if(p.fr>0){const t=p.fr/50,w=1-t;o.push(P(mk(w,-1+t,Math.max(.05,r-t*.6)).map(q=>q),{sub:1}))}
 if(p.bs===1){const b=o[0].pts;const L=b.shift?b:b;const pts=[...b.slice(1,b.length-1),...arc(0,1-.15,1,.15,0,Math.PI,cn(6,3)).slice(1)];o[0]=P([[-1,.85],...pts.slice(0,pts.length-0)])}return o},{seg:true});
add('star','b','Estrela',[pr('n','Pontas',5,3,24),pr('ir','Raio interno',40,10,95,5,'%'),pr('cv','Curvatura dos lados',0,-100,100,5,'%'),pr('alt','Pontas alternadas',0,0,60,5,'%','Faz uma ponta sim, outra não, mais curta.'),RD()],(p,n)=>[P(starPts(Math.round(p.n),p.ir/100,p.cv/100,n,p.alt/100))],{seg:p=>Math.abs(p.cv)>=1,n0:48});
add('spark','b','Brilho',[pr('n','Pontas',4,3,12),pr('ir','Raio interno',30,5,70,1,'%'),pr('cv','Curvatura dos lados',45,-100,100,5,'%'),pr('sp','Faíscas extras',0,0,4,1,'','Pequenos brilhos ao redor.'),RD()],(p,n)=>{const o=[P(starPts(Math.round(p.n),p.ir/100,p.cv/100,n))];const sp=Math.round(p.sp);[[.78,-.7,.22],[-.8,.62,.17],[.72,.74,.12],[-.7,-.78,.1]].slice(0,sp).forEach(([x,y,s])=>o.push(P(starPts(4,.22,.55,32).map(q=>[q[0]*s+x,q[1]*s+y]))));return o},{seg:p=>Math.abs(p.cv)>=1,n0:48,fit:false});
add('seal','b','Selo / medalha',[pr('n','Pontas',16,6,60),pr('d','Profundidade',12,3,40,1,'%'),ps('st','Borda',0,O(['Serrilhada','Ondulada','Dente de serra'])),pr('fh','Furo central',0,0,80,5,'%'),RD()],(p,n)=>{const k=Math.round(p.n),v=[];
 if(p.st===1)return[P(scallop(k,p.d/40,n)),...(p.fh>0?[P(circ(0,0,p.fh/100,p.fh/100,cn(n/2,12)),{sub:1})]:[])];
 for(let i=0;i<k*2;i++){const a=-Math.PI/2+i*Math.PI/k,r=p.st===2?(i%2?1-p.d/100:1):(i%2?1-p.d/100:1);if(p.st===2&&i%2===0){v.push([Math.cos(a-Math.PI/k*.0)*1,Math.sin(a)*1])}else v.push([Math.cos(a)*r,Math.sin(a)*r])}
 if(p.st===2){const w=[];for(let i=0;i<k;i++){const a=-Math.PI/2+i*TAU/k,b=a+TAU/k*.999,r2=1-p.d/100;w.push([Math.cos(a)*r2,Math.sin(a)*r2],[Math.cos(b)*1,Math.sin(b)*1])}return[P(w),...(p.fh>0?[P(circ(0,0,p.fh/100,p.fh/100,cn(n/2,12)),{sub:1})]:[])]}
 return[P(v),...(p.fh>0?[P(circ(0,0,p.fh/100,p.fh/100,cn(n/2,12)),{sub:1})]:[])]},{seg:p=>p.st===1||p.fh>0});
add('hex','b','Casa simples',[pr('tel','Altura do telhado',45,15,85,5,'%'),pr('cw','Largura do corpo',80,40,100,5,'%'),pr('bei','Beiral',0,0,20,1,'%'),RD()],p=>{const y0=-1+2*p.tel/100,c=p.cw/100,b=p.bei/50;return[P([[0,-1],[1,y0+b*.35],[c+b,y0+b*.35],[c+b,y0+b*.35],[c,y0+b*.35],[c,1],[-c,1],[-c,y0+b*.35],[-c-b,y0+b*.35],[-1,y0+b*.35]].filter((q,i,a)=>i===0||q[0]!==a[i-1][0]||q[1]!==a[i-1][1]))]});
add('ring','b','Anel',[pr('t','Espessura',30,5,90,5,'%'),pr('seg','Partes (anel segmentado)',1,1,16),when(pr('gp','Vão entre as partes',10,2,80,2,'°'),v=>v.seg>1),pr('ec','Furo descentralizado',0,0,60,5,'%'),pr('ar','Abertura (arco)',0,0,300,10,'°','Abre o anel como um “C” (só vale com 1 parte).')],(p,n)=>{const t=p.t/100,ri=1-t,k=Math.round(p.seg),m=cn(n,12);
 if(k>1){const o=[],gp=rad(p.gp),w=TAU/k;for(let i=0;i<k;i++){const a0=-Math.PI/2+i*w+gp/2,a1=-Math.PI/2+(i+1)*w-gp/2,mm=Math.max(4,Math.round(m/k));o.push(P([...arc(0,0,1,1,a0,a1,mm),...arc(0,0,ri,ri,a1,a0,mm)],{sub:i>0?0:0}))}return o}
 if(p.ar>0){const a0=-Math.PI/2+rad(p.ar)/2,a1=-Math.PI/2+TAU-rad(p.ar)/2,mm=m;return[P([...arc(0,0,1,1,a0,a1,mm),...arc(0,0,ri,ri,a1,a0,mm)])]}
 return[P(circ(0,0,1,1,m)),P(circ(p.ec/100*(1-ri),0,ri,ri,m),{sub:1})]},{seg:true});
add('pie','b','Fatia / setor',[pr('a','Ângulo',270,10,350,5,'°'),pr('ih','Furo central',0,0,85,5,'%'),pr('k','Partes',1,1,12,1,'','Divide em fatias separadas (pizza).'),when(pr('gp','Vão entre as fatias',4,0,40,1,'°'),v=>v.k>1),RD()],(p,n)=>{const k=Math.round(p.k),a=rad(p.a),w=a/k,gp=k>1?rad(p.gp):0,ih=p.ih/100,o=[];
 for(let i=0;i<k;i++){const a0=-Math.PI/2+i*w+gp/2,a1=-Math.PI/2+(i+1)*w-gp/2,m=Math.max(4,Math.round(n*(a1-a0)/TAU));o.push(P(ih>0?[...arc(0,0,1,1,a0,a1,m),...arc(0,0,ih,ih,a1,a0,m)]:[[0,0],...arc(0,0,1,1,a0,a1,m)]))}return o},{seg:true});
add('cube','b','Cubo',[pr('tp','Inclinação do topo',50,20,90,5,'%'),pb('ed','Só as arestas',0)],p=>{const t=p.tp/100,h=1-t*.5+.0;const T=[[0,-1],[.87,-1+t],[0,-1+2*t],[-.87,-1+t]],Lf=[[-.87,-1+t],[0,-1+2*t],[0,1],[-.87,1-t]],R=[[.87,-1+t],[0,-1+2*t],[0,1],[.87,1-t]];return[P(T),P(Lf),P(R)]},{fit:true});
add('gem','b','Diamante',[pr('cr','Altura da coroa',30,15,60,5,'%'),pr('tb','Largura da mesa',50,20,90,5,'%'),pb('fc','Facetas',1)],p=>{const y=-1+2*p.cr/100,w=p.tb/100;const o=[P([[-w,-1],[w,-1],[1,y],[0,1],[-1,y]])];if(p.fc){o.push(P([[-1,y],[1,y]],{open:1,sub:1}),P([[-w,-1],[-w*.6,y],[0,1]],{open:1,sub:1}),P([[w,-1],[w*.6,y],[0,1]],{open:1,sub:1}),P([[-w*.6,y],[0,-1],[w*.6,y]],{open:1,sub:1}))}return o});
add('ribbon','b','Faixa / banner',[pr('nt','Entalhe',12,0,45,1,'%'),pr('cu','Curvatura',0,-30,30,2,'%','Curva a faixa para cima ou para baixo.'),pb('fo','Pontas dobradas',0),RD()],(p,n)=>{const k=1-p.nt/50,cu=p.cu/100,m=cn(n/3,6);
 if(p.fo){const o=[];const tails=(s)=>[[-1,-.35],[-.62,-.35],[-.62,.45],[-1,.45],[-.84,.05]].map(q=>[q[0]*s,q[1]+.3]);o.push(P([[-1,-.05],[-.55,-.05],[-.55,.62],[-1,.62],[-.8,.28]].map(q=>[q[0],q[1]])),P([[1,-.05],[.55,-.05],[.55,.62],[1,.62],[.8,.28]]));o.push(P([[-.7,-.68],[.7,-.68],[.7,.36],[-.7,.36]]));return o}
 const top=Array.from({length:m+1},(_,i)=>{const t=i/m*2-1;return[t,-.6+cu*(1-t*t)*1.1]}),bot=Array.from({length:m+1},(_,i)=>{const t=1-i/m*2;return[t,.6+cu*(1-t*t)*1.1]});return[P([...top,[k,0],...bot,[-k,0]])]},{fit:true});
add('target','b','Alvo',[pr('r','Anéis',3,2,10),ps('sp','Espaçamento',0,O(['Uniforme','Fechando para o centro','Abrindo para o centro'])),pb('cr','Mira (cruz)',0),pb('dt','Centro cheio',0)],(p,n)=>{const k=Math.round(p.r),o=[];for(let i=1;i<=k;i++){const t=i/k,r=p.sp===1?Math.sqrt(t):p.sp===2?t*t:t;o.push(P(circ(0,0,r,r,cn(n,12)),{sub:1}))}if(p.cr)o.push(P([[-1.12,0],[1.12,0]],{open:1,sub:1}),P([[0,-1.12],[0,1.12]],{open:1,sub:1}));if(p.dt)o.push(P(circ(0,0,.12,.12,cn(12,3))));return o},{open:true,seg:true,fit:false});
add('pill','b','Cápsula / pílula',[pr('h','Altura',55,20,100,5,'%'),pb('dv','Divisória no meio',0),RD(100)],p=>{const h=p.h/100,o=[P([[-1,-h],[1,-h],[1,h],[-1,h]])];if(p.dv)o.push(P([[0,-h],[0,h]],{open:1,sub:1}));return o});
add('frame','b','Moldura',[pr('t','Espessura',16,4,45,1,'%'),ps('st','Estilo',0,O(['Reta','Cantos recortados','Dupla borda'])),pr('cs','Tamanho do canto',25,5,60,5,'%')],(p,n,G)=>{const t=p.t/100*Math.min(G.W,G.H)/2,tx=t/(G.W/2),ty=t/(G.H/2);const o=[];
 if(p.st===1){o.push(P(cutRect(G,0,p.cs,n)));const q=cutRect(G,0,p.cs,n);o.push(P(q.map(([x,y])=>[x*(1-tx),y*(1-ty)]),{sub:1})) }
 else{o.push(P([[-1,-1],[1,-1],[1,1],[-1,1]]),P([[-1+tx,-1+ty],[1-tx,-1+ty],[1-tx,1-ty],[-1+tx,1-ty]],{sub:1}));if(p.st===2)o.push(P([[-1+tx*1.8,-1+ty*1.8],[1-tx*1.8,-1+ty*1.8],[1-tx*1.8,1-ty*1.8],[-1+tx*1.8,1-ty*1.8]],{sub:1}))}return o},{seg:p=>false});
add('tag','b','Etiqueta',[pr('pt','Ponta',45,15,80,5,'%'),pb('ho','Furo',1),pb('st','Cordão',0),RD()],(p,n)=>{const x=1-p.pt/50*1.1,o=[P([[-1,-.55],[x,-.55],[1,0],[x,.55],[-1,.55]])];if(p.ho)o.push(P(circ(-.62,0,.13,.13,cn(n/3,10)),{sub:1}));if(p.st)o.push(P([[-.62,0],[-1.1,-.7]],{open:1,sub:1}));return o},{seg:p=>!!p.ho,fit:p=>false});
add('lens','b','Lente / gota dupla',[pr('c','Curvatura',55,10,100,5,'%'),pb('v','Vertical',0)],(p,n)=>{const c=p.c/100,m=cn(n/2,10),a=arc(0,0,1,1,0,0,1);const top=Array.from({length:m+1},(_,i)=>{const t=i/m*2-1;return[t,-(1-t*t)*c]}),bot=Array.from({length:m+1},(_,i)=>{const t=1-i/m*2;return[t,(1-t*t)*c]});const pts=[...top,...bot.slice(1,-1)];return[P(p.v?pts.map(q=>[q[1],q[0]]):pts)]},{seg:true,fit:true});

add('arrow','s','Seta',[pr('th','Espessura do corpo',40,10,90,5,'%'),pr('hd','Tamanho da ponta',45,15,85,5,'%'),pr('sw','Largura da ponta',100,50,100,5,'%'),ps('tl','Cauda',0,O(['Reta','Entalhada (pena)','Redonda'])),RD()],(p,n)=>{const b=p.th/100,h=1-p.hd/50,w=p.sw/100,o=[[h,-b],[h,-w],[1,0],[h,w],[h,b]];let tail;if(p.tl===1)tail=[[-1,b],[-1+b*.9,0],[-1,-b]];else if(p.tl===2)tail=[...arc(-1+b,0,b,b,Math.PI/2,Math.PI*1.5,cn(n/6,6))].reverse().reverse();else tail=[[-1,b],[-1,-b]];if(p.tl===2)tail=arc(-1+b,0,b,b,Math.PI/2,Math.PI*1.5,cn(n/6,6));return[P([...tail.length&&p.tl===2?[]:[],[-1+(p.tl===2?b:0),-b],...o.slice(0),[-1+(p.tl===2?b:0),b],...(p.tl===1?[[-1,b],[-1+b*.9,0],[-1,-b]]:p.tl===2?arc(-1+b,0,b,b,Math.PI/2,Math.PI*1.5,cn(n/6,6)).slice(1,-1):[[-1,b],[-1,-b]])].filter((q,i,a)=>true))]},{seg:p=>p.tl===2});
add('darrow','s','Seta dupla',[pr('th','Espessura do corpo',35,10,90,5,'%'),pr('hd','Tamanho da ponta',35,15,60,5,'%'),pr('cv','Curvatura',0,0,60,5,'%','Curva a seta em arco (ex.: seta de retorno).'),RD()],(p,n)=>{const b=p.th/100,h=1-p.hd/50;if(p.cv<=0)return[P([[-1,0],[-h,-1],[-h,-b],[h,-b],[h,-1],[1,0],[h,1],[h,b],[-h,b],[-h,1]])];const k=p.cv/100*1.6,m=cn(n/2,10),line=Array.from({length:m+1},(_,i)=>{const t=i/m*2-1;return[t*.84,-k*.5*(1-t*t)*.6+.15]});return[P(thickLine(line,b*.34)),P([[-1,line[0][1]+.1],[-.68,line[0][1]-.42],[-.52,line[0][1]+.34]]),P([[1,line[m][1]+.1],[.68,line[m][1]-.42],[.52,line[m][1]+.34]])]},{seg:p=>p.cv>0,fit:true});
add('carrow','s','Seta circular',[pr('gap','Abertura',70,20,200,5,'°'),pr('t','Espessura',24,8,50,1,'%'),pb('db','Seta dupla (reciclar)',0),RD()],(p,n)=>{const t=p.t/100,m=Math.max(8,Math.round(n*.7));const one=(g0,g1)=>{const a0=g0,a1=g1,ha=Math.min(.7,(a1-a0)*.35),o=[],i2=[];for(let i=0;i<=m;i++){const a=a0+(a1-ha-a0)*i/m;o.push([Math.cos(a),Math.sin(a)]);i2.push([Math.cos(a)*(1-t),Math.sin(a)*(1-t)])}const bs=a1-ha;o.push([Math.cos(bs)*(1+t*.6),Math.sin(bs)*(1+t*.6)],[Math.cos(a1)*(1-t/2),Math.sin(a1)*(1-t/2)],[Math.cos(bs)*(1-t-t*.6),Math.sin(bs)*(1-t-t*.6)]);return P(o.concat(i2.reverse()))};
 if(p.db){const gp=rad(Math.min(p.gap,80))*.5;return[one(-Math.PI/2+gp,Math.PI/2-gp),one(Math.PI/2+gp,Math.PI*1.5-gp)]}return[one(-Math.PI/2+rad(p.gap)/2,Math.PI*1.5-rad(p.gap)/2)]},{seg:true});
add('chev','s','Divisa',[pr('t','Espessura',30,8,70,2,'%'),pr('k','Repetições',1,1,5,1,'','Várias divisas em sequência (>>>).'),pr('ln','Largura do ângulo',50,20,90,5,'%'),RD()],p=>{const k=Math.round(p.k),w=p.ln/100,sp=k>1?2/k:0,o=[];const sc=k>1?1/(1+(k-1)*.0):1;for(let i=0;i<k;i++){const dx=k>1?(-1+(i+.5)*2/k)*(1-w*.5/k*0)*.5:0;const wi=k>1?1/k:1;o.push(P(thickLine([[-w*.5*wi+dx,-1],[w*.5*wi+dx,0],[-w*.5*wi+dx,1]],p.t/100*.9*wi)))}return o},{fit:true});
add('plus','s','Cruz',[pr('t','Espessura',32,8,80,2,'%'),pr('ar','Braços diferentes',0,0,50,5,'%','Encurta o braço de baixo (cruz latina).'),RD()],p=>{const t=p.t/200,a=1;if(p.ar>0){const b=1-p.ar/50,y=-1+(2*b)*.0;return[P([[-t,-1],[t,-1],[t,-.38],[.62,-.38],[.62,-.38+t*2],[t,-.38+t*2],[t,1],[-t,1],[-t,-.38+t*2],[-.62,-.38+t*2],[-.62,-.38],[-t,-.38]])]}return[P(plus12(1,t))]});
add('x','s','X',[pr('t','Espessura',28,8,70,2,'%'),RD()],p=>[P(rot(plus12(1,p.t/200),Math.PI/4))],{fit:true});
add('check','s','Certo',[pr('t','Espessura',16,5,40,1,'%'),pr('b','Ramo curto',32,15,50,1,'%'),RD()],p=>[P(thickLine([[-.95,.05],[-.95+p.b/50*1.4,.7],[.95,-.7]],p.t/100*.9))],{fit:true});
add('speech','s','Balão de fala',[pr('tp','Posição da cauda',-45,-80,80,5,'%'),pr('tl','Tamanho da cauda',45,15,90,5,'%'),ps('sh','Formato',0,O(['Retângulo','Oval','Pensamento (nuvem)'])),RD(30)],(p,n)=>{const x=p.tp/100,h=p.tl/100*.5;if(p.sh===1){const m=cn(n,16),pts=[];for(let i=0;i<m;i++){const a=i/m*TAU+Math.PI/2;pts.push([Math.cos(a),Math.sin(a)*.75-.2])}const a0=Math.atan2(.45,x);return[P([...circ(0,-.2,1,.75,m,Math.PI/2+.5).slice(0,Math.round(m*.8)),[x+h*.2,.95],[x-h*.9,.4]].filter(q=>true))]}
 if(p.sh===2)return[P(circ(0,-.28,1,.62,cn(n*.8,16))),P(circ(x*.8,.52,.17,.13,cn(10,3))),P(circ(x*.8-.2,.8,.09,.07,cn(8,3)))];return[P([[-1,-1],[1,-1],[1,.4],[x+h*.9,.4],[x-h*.2,1],[x-h*.5,.4],[-1,.4]])]},{seg:p=>p.sh>0,fit:true});
add('pin','s','Pino de mapa',[pr('hf','Furo',37,0,70,1,'%'),pr('pt','Ponta',64,20,100,2,'%')],(p,n)=>{const R=.62,pt=.9;const m=cn(n,18),a0=Math.acos(R/(1+0)),pts=[];const hh=p.pt/100;const A=Math.asin(cl(.62/Math.max(.62,hh*.9),0,1));const arcPts=arc(0,-.38,R,R,Math.PI/2+1.05,Math.PI/2+TAU-1.05,m);const o=[[0,1],...arcPts.map(q=>q)];return[P([[0,1],...arc(0,-.36,.64,.64,Math.PI*.5+.95,Math.PI*2.5-.95,m)].map(q=>[q[0],q[1]])),...(p.hf>0?[P(circ(0,-.36,.64*p.hf/50,.64*p.hf/50,cn(n/2,10)),{sub:1})]:[])]},{seg:true});
add('gear','s','Engrenagem',[pr('n','Dentes',10,5,24),pr('pd','Profundidade dos dentes',22,8,45,1,'%'),pr('hf','Furo central',32,0,70,1,'%'),ps('tt','Dente',0,O(['Trapezoidal','Reto','Redondo'])),pr('sp','Raios (furos ao redor)',0,0,12,1,'','Aberturas redondas entre o miolo e a borda.'),RD()],(p,n)=>{const k=Math.round(p.n),ri=1-p.pd/100,o=[],w=TAU/k;for(let i=0;i<k;i++){const a=i*w;(p.tt===1?[[-.3,ri],[-.3,1],[.3,1],[.3,ri]]:p.tt===2?[[-.34,ri],[-.2,.5*(1+ri)],[-.08,1],[.08,1],[.2,.5*(1+ri)],[.34,ri]]:[[-.3,ri],[-.17,1],[.17,1],[.3,ri]]).forEach(([f,r])=>{const t=a+f*w;o.push([Math.cos(t)*r,Math.sin(t)*r])})}
 const out=[P(o)];if(p.hf>0)out.push(P(circ(0,0,p.hf/100,p.hf/100,cn(n*.7,12)),{sub:1}));const sp=Math.round(p.sp);for(let i=0;i<sp;i++){const a=i*TAU/sp,rr=(ri-.18+p.hf/100)/2;out.push(P(circ(Math.cos(a)*rr,Math.sin(a)*rr,Math.max(.05,(ri-.18-p.hf/100)/2*.78),Math.max(.05,(ri-.18-p.hf/100)/2*.78),12),{sub:1}))}return out},{seg:p=>p.hf>0||p.sp>0});
add('flag','s','Bandeira',[pr('wv','Ondulação',60,0,100,5,'%'),pr('hh','Altura do pano',55,25,80,5,'%'),ps('en','Ponta',0,O(['Reta','Rabo de andorinha','Triangular'])),pb('mp','Mastro',1)],(p,n)=>{const wv=p.wv/100*.14,hh=p.hh/100*2,m=cn(n/2,10),x0=-.62,x1=.9,y0=-.95,o=[],top=[],bot=[];for(let i=0;i<=m;i++){const t=i/m,x=x0+(x1-x0)*t,w=Math.sin(t*TAU*.9)*wv;top.push([x,y0+w]);bot.push([x1-(x1-x0)*t,y0+hh+Math.sin((1-t)*TAU*.9)*wv])}const tail=p.en===1?[[x1-.2,y0+hh*.5+Math.sin(0)*wv]]:p.en===2?[[x1+.08,y0+hh*.5]]:[];
 const pts=[...top,...(p.en===1?[[x1-.22,y0+hh/2]]:p.en===2?[[x1+.0,y0+hh/2]]:[]),...bot];const res=[P(pts)];if(p.mp)res.push(P([[-.7,-1],[-.62,-1],[-.62,1],[-.7,1]]));return res},{seg:true,fit:true});
add('bell','s','Sino',[pr('w','Abertura',100,70,120,5,'%'),pb('cl','Badalo',1)],(p,n)=>{const k=p.w/100;return[...PS('M50 6 C56 6 58 10 58 15 C72 19 80 32 80 50 C80 66 86 72 92 79 H8 C14 72 20 66 20 50 C20 32 28 19 42 15 C42 10 44 6 50 6 Z',n).map(x=>({...x,pts:x.pts.map(q=>[q[0]*k,q[1]])})),...(p.cl?[P(circ(0,.82,.16,.12,cn(n/2,10)))]:[])]},{seg:true});
add('key','s','Chave',[pr('d','Dentes',3,0,6),pb('hl','Furo da argola',1)],(p,n)=>{const d=Math.round(p.d),o=[[.0,-.12],[.9,-.12]];let bodyBottom=.28;const teeth=[];const pts=[[-.1,-.2],[1,-.2],[1,.2]];let x=1;for(let i=0;i<d;i++){const x1=1-i*.17-.0;teeth.push([x1,.2],[x1,.46],[x1-.1,.46],[x1-.1,.2])}const body=[[-.1,-.2],[1,-.2],[1,.46-.26],...(()=>{const a=[];let xx=1;for(let i=0;i<d;i++){a.push([xx,.2+.0],[xx,.5],[xx-.11,.5],[xx-.11,.2]);xx-=.2}return a})(),[-.1,.2]];
 const bw=PS('M53.24 44 H96 V72 H86 V60 H80 V72 H70 V56 H53.24 A24 24 0 1 1 53.24 44 Z',n);return[...bw,...(p.hl?[P(C100(30,50,10,cn(n/2,12)),{sub:1})]:[])]},{seg:true});
add('note','s','Nota musical',[ps('t','Tipo',0,O(['Colcheia','Semínima','Duas colcheias (ligadas)','Clave de sol (simplificada)']))],(p,n)=>{if(p.t===1)return[P(xf(E100(34,80,17,12,-20,cn(n/2,14)),1,1)),...PS('M44 78 H52 V8 H44 Z',n)];if(p.t===2)return[P(E100(26,80,15,11,-20,cn(n/2,14))),P(E100(72,70,15,11,-20,cn(n/2,14))),...PS('M36 78 H43 V22 H36 Z',n),...PS('M82 68 H89 V14 H82 Z',n),...PS('M36 22 L89 8 V20 L43 34 Z',n)];
 if(p.t===3)return[...PS('M52 4 C70 22 62 40 50 50 C34 60 30 80 44 84 C58 88 66 72 54 66 C44 62 38 70 44 74 M50 4 V90 C50 98 40 98 38 92',n,{sub:0})];return[...PS('M46 8 L84 20 V70 H76 V30 L54 24 V78 H46 Z',n),P(E100(34,80,17,12,-20,cn(n/2,14)))]},{seg:true});
add('qmark','s','Interrogação',[pr('t','Espessura',15,8,30,1,'%'),pr('c','Curvatura do gancho',100,60,140,5,'%')],(p,n)=>{const k=p.c/100;const c=pathPts(`M${50-24*k} 34 C${50-24*k} 6 ${50+24*k} 6 ${50+24*k} 34 C${50+24*k} 54 50 52 50 68`,Math.max(24,n))[0].pts;return[P(thickLine(c,p.t/50*.8)),P(C100(50,88,p.t/50*50*.62+3,12))]},{seg:true});
add('exclam','s','Exclamação',[pr('s','Haste',100,50,130,5,'%'),pb('dt','Ponto',1)],(p,n)=>[P(pp100('38 6 62 6 56 62 44 62').map(q=>[q[0],(q[1]+1)*(p.s/100)-1])),...(p.dt?[P(C100(50,86,9,14))]:[])],{seg:true,fit:true});
add('infin','s','Infinito',[pr('t','Espessura',14,6,30,1,'%'),pr('ls','Laços (nós)',1,1,3,1,'','2 = trevo (∞∞).')],(p,n)=>{const m=Math.max(40,n*2),L=[];for(let i=0;i<=m;i++){const t=i/m*TAU,d=1+Math.sin(t)*Math.sin(t);L.push([Math.cos(t)/d,Math.sin(t)*Math.cos(t)/d*1.35])}return[P(thickLine(L,p.t/100*.6))]},{seg:true});
add('bookm','s','Marcador',[pr('nt','Entalhe',55,0,95,5,'%'),RD()],p=>[P([[-.7,-1],[.7,-1],[.7,1],[0,1-p.nt/100*1.0],[-.7,1]])]);
add('lupa','s','Lupa',[pr('cb','Cabo',45,20,70,5,'%'),pr('t','Aro',22,8,40,1,'%'),pb('br','Brilho no vidro',0)],(p,n)=>{const R=.66,c=[-.3,-.3],m=cn(n,14),o=[P(circ(c[0],c[1],R,R,m)),P(circ(c[0],c[1],R*(1-p.t/100*1.4),R*(1-p.t/100*1.4),m),{sub:1}),P(thickLine([[c[0]+R*.72,c[1]+R*.72],[c[0]+R*.72+p.cb/100*.75,c[1]+R*.72+p.cb/100*.75]],.12))];if(p.br)o.push(P(arc(c[0],c[1],R*.55,R*.55,Math.PI*1.1,Math.PI*1.5,cn(8,3)),{open:1,sub:1}));return o},{seg:true,fit:true});
add('play','s','Play',[pr('cv','Lados curvos',0,-30,50,5,'%'),RD()],(p,n)=>[P(bulge([[-.7,-1],[1,0],[-.7,1]],p.cv/100,cn(n/3,6)))],{seg:p=>Math.abs(p.cv)>=1});
add('pause','s','Pausar',[pr('g','Vão',40,10,80,5,'%'),RD()],p=>{const g=p.g/100;return[P([[-1,-1],[-g/2,-1],[-g/2,1],[-1,1]]),P([[g/2,-1],[1,-1],[1,1],[g/2,1]])]});
add('skip','s','Avançar',[pb('db','Dupla',0),RD()],p=>p.db?[P([[-1,-1],[0,0],[-1,1]]),P([[0,-1],[1,0],[0,1]])]:[P([[-.9,-1],[.55,0],[-.9,1]]),P([[.7,-1],[1,-1],[1,1],[.7,1]])]);
add('minus','s','Menos',[pr('t','Espessura',30,8,80,2,'%'),RD()],p=>[P([[-1,-p.t/100],[1,-p.t/100],[1,p.t/100],[-1,p.t/100]])],{fit:true});
add('equal','s','Igual / diferente',[pr('t','Espessura',24,8,45,1,'%'),pb('ne','Diferente (≠)',0),RD()],p=>{const t=p.t/100,o=[P([[-1,-.62-t/2],[1,-.62-t/2],[1,-.62+t/2],[-1,-.62+t/2]]),P([[-1,.62-t/2],[1,.62-t/2],[1,.62+t/2],[-1,.62+t/2]])];if(p.ne)o.push(P(thickLine([[.5,-1.1],[-.5,1.1]],t*.55),{}));return o},{fit:true});
add('divide','s','Dividir',[pr('t','Espessura',24,8,45,1,'%'),pr('pt','Tamanho dos pontos',100,50,150,5,'%')],(p,n)=>{const t=p.t/100,r=t*.8*p.pt/100;return[P([[-1,-t/2],[1,-t/2],[1,t/2],[-1,t/2]]),P(circ(0,-.68,r,r,cn(n/3,10))),P(circ(0,.68,r,r,cn(n/3,10)))]},{seg:true});
add('wifi','s','Sinal',[pr('t','Espessura',15,6,30,1,'%'),pr('b','Barras',3,1,5),pr('op','Abertura',90,40,160,5,'°')],(p,n)=>{const t=p.t/100,k=Math.round(p.b),m=cn(n/2,10),a=rad(p.op)/2,o=[];for(let i=1;i<=k;i++){const r=i/k*1.35;o.push(P(thickLine(arc(0,.85,r,r,-Math.PI/2-a,-Math.PI/2+a,m),t)))}o.push(P(circ(0,.85,t*.85,t*.85,cn(n/3,8))));return o},{seg:true,fit:true});
add('power','s','Ligar / desligar',[pr('t','Espessura',16,6,30,1,'%'),pr('g','Abertura',38,10,70,2,'°')],(p,n)=>{const t=p.t/100,m=cn(n,14);return[P(thickLine(arc(0,.08,.82,.82,-Math.PI/2+rad(p.g),-Math.PI/2+TAU-rad(p.g),m),t)),P([[-t/2,-1],[t/2,-1],[t/2,.1],[-t/2,.1]])]},{seg:true});
add('pencilS','s','Lápis',[pr('pt','Ponta',30,10,50,2,'%'),pb('bo','Borracha',1)],p=>{const o=[P(pp100('68 6 94 32 38 88 8 94 12 64')),P(pp100('58 16 84 42'),{open:1,sub:1}),P(pp100('12 64 38 88'),{open:1,sub:1})];if(!p.bo)o[1]=P(pp100('58 16 84 42'),{open:1,sub:1});return o});

add('heart','n','Coração',[pr('w','Largura',100,60,130,5,'%'),pr('p','Ponta (afinar)',0,0,60,5,'%'),pb('in','Contorno interno',0),pr('sp','Corações menores',0,0,4,1,'','Pequenos corações flutuando.')],(p,n)=>{const H=heartN(Math.max(24,n*2)).map(q=>[q[0]*p.w/100,q[1]+(q[1]>0?q[1]*p.p/100*.5:0)]);const o=[P(H)];if(p.in)o.push(P(H.map(q=>[q[0]*.7,q[1]*.7+.04]),{sub:1}));[[.7,-.75,.16],[-.82,-.55,.11],[.85,.35,.1],[-.75,.5,.12]].slice(0,Math.round(p.sp)).forEach(([x,y,s])=>o.push(P(heartN(24).map(q=>[q[0]*s+x,q[1]*s+y]))));return o},{seg:true,fit:p=>false,fitIf:p=>p.sp===0});
add('flower','n','Flor',[pr('n','Pétalas',6,3,16),pr('d','Profundidade',55,10,90,5,'%'),ps('fm','Pétala',0,O(['Ondulada','Redonda (gota)','Pontuda'])),pb('c','Miolo',1),pr('cs','Tamanho do miolo',20,8,40,1,'%')],(p,n)=>{const k=Math.round(p.n),m=Math.max(k*8,n*2),pts=[];
 if(p.fm===1)return[...Array.from({length:k},(_,i)=>{const a=-Math.PI/2+i*TAU/k,rr=Math.sin(Math.PI/k)*.9*(1-p.d/200+.15);const c=1-rr;return P(circ(Math.cos(a)*c,Math.sin(a)*c,rr,rr,cn(n/4,12)))}),...(p.c?[P(circ(0,0,p.cs/100,p.cs/100,cn(n/2,10)),{sub:0})]:[])];
 for(let i=0;i<m;i++){const a=-Math.PI/2+i/m*TAU,q=Math.abs(Math.cos(k*(a+Math.PI/2)/2)),r=1-p.d/100*(1-(p.fm===2?Math.pow(q,.55):q));pts.push([Math.cos(a)*r,Math.sin(a)*r])}const o=[P(pts)];if(p.c)o.push(P(circ(0,0,p.cs/100,p.cs/100,cn(n/2,8)),{sub:1}));return o},{seg:true,fit:false});
add('clover','n','Trevo',[pr('l','Folhas',4,3,8),pr('f','Cheia das folhas',75,40,100,5,'%'),pb('st','Haste',0)],(p,n)=>{const L=Math.round(p.l),m=Math.max(L*10,n*2),o=[],e=p.f/100;for(let i=0;i<m;i++){const a=-Math.PI/2+i/m*TAU,r=Math.pow(Math.abs(Math.cos(L*(a+Math.PI/2)/2)),1-e*.75+.25);o.push([Math.cos(a)*r,Math.sin(a)*r])}const res=[P(o)];if(p.st)res.push(P([[0,0],[.25,1.1]],{open:1,sub:1}));return res},{seg:true,fit:false});
add('moon','n','Lua',[ps('ph','Fase',0,O(['Crescente','Quarto crescente','Gibosa crescente','Lua cheia','Gibosa minguante','Quarto minguante','Minguante','Lua nova (contorno)']),'Todas as fases da Lua. A parte iluminada é preenchida e a sombra fica só no contorno.'),pb('sh','Mostrar a parte escura (contorno)',1),pr('s','Espessura do crescente',60,15,150,5,'%')],(p,n)=>{
 const m=cn(n,16),ph=p.ph,full=P(circ(0,0,1,1,m*2),{sub:0});
 const lit=(side,k)=>{ const a=[],b=[];for(let i=0;i<=m;i++){const t=-Math.PI/2+i/m*Math.PI;a.push([side*Math.cos(t),Math.sin(t)])}for(let i=0;i<=m;i++){const t=Math.PI/2-i/m*Math.PI;b.push([side*k*Math.cos(t)*-1*-1,Math.sin(t)])}return[...a,...b.map(q=>[q[0]*(1)*(-1)*(-1),q[1]])]};
 const terminator=(side,k)=>{const o=[];for(let i=0;i<=m;i++){const t=-Math.PI/2+i/m*Math.PI;o.push([side*Math.cos(t),Math.sin(t)])}for(let i=0;i<=m;i++){const t=Math.PI/2-i/m*Math.PI;o.push([side*k*Math.cos(t),Math.sin(t)])}return o};
 if(ph===0){const sh=p.s/100,pa=Math.acos(cl(sh/2,-1,1));return[P([...arc(0,0,1,1,pa,TAU-pa,m),...arc(sh,0,1,1,Math.PI+pa,Math.PI-pa,m)])]}
 const o=[];const mkLit=(side,k)=>P(terminator(side,k));
 const dark=p.sh?[P(circ(0,0,1,1,m*2),{open:0,sub:0,dark:1})]:[];
 const table=[null,[ 1,0],[ 1,-.55],null,[-1,-.55],[-1,0],[-1,.7],null];
 if(ph===3)return[P(circ(0,0,1,1,m*2)),P(circ(-.3,-.25,.18,.18,cn(12,3)),{sub:1}),P(circ(.35,.2,.12,.12,cn(10,3)),{sub:1}),P(circ(-.1,.5,.09,.09,cn(10,3)),{sub:1})];
 if(ph===7){return[P(circ(0,0,1,1,m*2),{open:0}),P(circ(-.3,-.25,.14,.14,cn(12,3)),{sub:1}),P(circ(.3,.25,.1,.1,cn(10,3)),{sub:1})]}
 const cfg={1:[1,0],2:[1,-.5],4:[-1,-.5],5:[-1,0],6:[-1,.75]}[ph];const[side,k]=cfg;
 if(ph===6){const sh=.55,pa=Math.acos(cl(sh/2,-1,1));return[P([...arc(0,0,1,1,pa,TAU-pa,m),...arc(sh,0,1,1,Math.PI+pa,Math.PI-pa,m)].map(q=>[-q[0],q[1]]))]}
 o.push(mkLit(side,k));if(p.sh)o.push(P(circ(0,0,1,1,m*2),{sub:1,open:1,closed:true}));return o},{seg:true,fit:false});
add('cloud','n','Nuvem',[pr('l','Lóbulos',4,2,7),pr('h','Altura dos lóbulos',100,50,150,5,'%'),pr('w','Largura',100,60,140,5,'%'),pb('fl','Base reta',1)],(p,n)=>{const k=Math.round(p.l),H=p.h/100,W=p.w/100,yb=.5,cs=[];
 for(let i=0;i<k;i++){const t=k===1?.5:i/(k-1),edge=(i===0||i===k-1),r=(edge?.26:.34+.2*Math.sin(t*Math.PI))*(edge?1:.55+.45*H);cs.push([(t*2-1)*.7*W,yb-r,r])}
 if(k>2)cs.sort((a,b)=>a[0]-b[0]);const x0=cs[0][0]-cs[0][2],x1=cs[k-1][0]+cs[k-1][2],m=cn(n*2,60),top=[];
 for(let i=0;i<=m;i++){const x=x0+(x1-x0)*i/m;let y=1e9;cs.forEach(c=>{const d=c[2]*c[2]-(x-c[0])*(x-c[0]);if(d>=0)y=Math.min(y,c[1]-Math.sqrt(d))});if(y<1e8)top.push([x,y])}
 const L0=cs[0],R0=cs[k-1],q=cn(n/4,6),right=[],left=[];for(let i=1;i<=q;i++){const a=i/q*Math.PI/2;right.push([R0[0]+Math.cos(a)*R0[2],R0[1]+Math.sin(a)*R0[2]]);left.push([L0[0]-Math.cos(Math.PI/2-a)*L0[2]*1,L0[1]+Math.sin(Math.PI/2-a)*L0[2]])}
 const sag=p.fl?0:.12,bot=[];for(let i=1;i<q;i++){const t=i/q;bot.push([right[right.length-1][0]+(left[0][0]-right[right.length-1][0])*t,yb+Math.sin(t*Math.PI)*sag])}
 return[P([...top,...right,...bot,...left])]},{seg:true,fit:true});
add('drop','n','Gota',[pr('pt','Ponta',100,40,140,5,'%'),pb('bo','Brilho',0),pr('sp','Gotas menores',0,0,3,1)],(p,n)=>{const pt=p.pt/100,m=cn(n,16),R=.62,cy=.34,pts=[[0,-1*pt+(1-pt)*.0]];const a0=Math.asin(R/(R+.0+Math.max(.1,(cy+1*pt)*1)));const alpha=Math.acos(R/(cy+pt))||.9;const arcP=arc(0,cy,R,R,-Math.PI/2+alpha,-Math.PI/2+TAU-alpha,m);const o=[P([[0,-pt],...arcP])];if(p.bo)o.push(P(arc(0,cy,R*.62,R*.62,Math.PI*.75,Math.PI*1.1,cn(6,3)),{open:1,sub:1}));[[.78,-.2,.2],[-.8,.2,.15],[.7,.7,.12]].slice(0,Math.round(p.sp)).forEach(([x,y,s])=>{const sc=s;o.push(P([[x,y-sc*1.5],...arc(x,y+sc*.5,sc,sc,-Math.PI/2+.9,-Math.PI/2+TAU-.9,cn(8,3))]))});return o},{seg:true,fit:true});
add('leaf','n','Folha',[pr('w','Largura',52,25,80,1,'%'),pr('v','Nervuras laterais',3,0,6),pr('cv','Curvatura',0,-60,60,5,'%'),pb('st','Haste',1),ps('ed','Borda',0,O(['Lisa','Serrilhada']))],(p,n)=>{const w=p.w/100,m=Math.max(14,Math.round(n)),h=t=>w*Math.sin(Math.PI*Math.pow(t,.72))*(1-.18*t),y=t=>1-2*t,cv=p.cv/100*.5,sx=t=>cv*Math.sin(t*Math.PI),L=[],R=[];
 for(let i=0;i<=m;i++){const t=i/m;let e=h(t);if(p.ed===1&&t>.08&&t<.95)e*=1+.1*(i%2?1:-1);L.push([-e+sx(t),y(t)]);R.push([e+sx(t),y(t)])}const out=[P(L.concat(R.reverse().slice(1,-1)))];
 const nv=Math.round(p.v);out.push(P([[sx(0),y(0)+(p.st?.12:0)],...[.25,.5,.75,.9].map(t=>[sx(t),y(t)])],{open:1,sub:1}));
 for(let i=1;i<=nv;i++){const t=.14+.66*i/(nv+1),t2=Math.min(.97,t+.17),k=h(t2)*.86;out.push(P([[sx(t),y(t)],[-k+sx(t2),y(t2)]],{open:1,sub:1}),P([[sx(t),y(t)],[k+sx(t2),y(t2)]],{open:1,sub:1}))}
 if(p.st)out.push(P([[0,1],[0,1.18]],{open:1,sub:1}));return out},{seg:true});
add('sun','n','Sol',[pr('n','Raios',12,4,32),pr('rl','Comprimento dos raios',34,10,60,1,'%'),ps('rs','Raios',0,O(['Triangulares','Retos (linhas)','Ondulados'])),pb('fc','Rosto',0)],(p,n)=>{const k=Math.round(p.n),r0=1-p.rl/100,o=[P(circ(0,0,r0*.8,r0*.8,cn(n,12)))];for(let i=0;i<k;i++){const a=i*TAU/k,w=TAU/k*.2;if(p.rs===1)o.push(P([[Math.cos(a)*(r0+.08),Math.sin(a)*(r0+.08)],[Math.cos(a),Math.sin(a)]],{open:1}));else if(p.rs===2){const q=[];for(let j=0;j<=6;j++){const t=j/6,rr=r0+.08+(1-r0-.08)*t;q.push([Math.cos(a+Math.sin(t*TAU)*.07)*rr,Math.sin(a+Math.sin(t*TAU)*.07)*rr])}o.push(P(q,{open:1}))}else o.push(P([[Math.cos(a-w)*(r0+.06),Math.sin(a-w)*(r0+.06)],[Math.cos(a),Math.sin(a)],[Math.cos(a+w)*(r0+.06),Math.sin(a+w)*(r0+.06)]]))}
 if(p.fc){const f=r0*.8;o.push(P(circ(-f*.35,-f*.15,f*.09,f*.09,cn(8,3))),P(circ(f*.35,-f*.15,f*.09,f*.09,cn(8,3))),P(arc(0,f*.05,f*.45,f*.4,rad(25),rad(155),cn(8,3)),{open:1}))}return o},{fit:true,seg:true});
add('house','n','Casinha',[pr('tel','Altura do telhado',42,15,70,1,'%'),pr('bei','Beiral',6,0,20,1,'%'),pb('dr','Porta',1),pb('wn','Janela',1),pb('ch','Chaminé',0)],p=>{const y0=-.1-(p.tel/100)*1.5+.5,e=p.bei/100*2,o=[];const body=[[-.72,y0+.55],[-.72,1],[.72,1],[.72,y0+.55]];const roof=[[0,-1+.0],[1+e,y0+.62],[-1-e,y0+.62]];
 o.push(P([[0,-1],[1+e,y0+.7+0],[.78,y0+.7],[.78,1],[-.78,1],[-.78,y0+.7],[-1-e,y0+.7]]));if(p.ch)o.push(P([[.38,-.68],[.62,-.68],[.62,-.3],[.38,-.5]],{sub:0}));if(p.dr)o.push(P([[-.1,1],[-.1,.38],[.2,.38],[.2,1]],{sub:1,open:1}));if(p.wn)o.push(P([[-.58,.3],[-.32,.3],[-.32,.56],[-.58,.56]],{sub:1}));return o},{fit:true});
add('mount','n','Montanhas',[pr('k','Picos',3,1,5),pr('s','Semente',4,1,99),pr('v','Variação de altura',40,0,80,5,'%'),pb('sn','Neve nos picos',1),pb('su','Sol atrás',0),RD()],(p,n)=>{const k=Math.round(p.k),r=rng(p.s*5.3+1),pk=[];for(let i=0;i<k;i++){const x=k===1?50:12+76*i/(k-1)+(r()-.5)*10*(k>1),h=70-p.v/100*50*r()-(i%2?6:0);pk.push([x,100-h-(k===1?0:0)])}
 const pts=[[0,100]];pk.forEach((q,i)=>{if(i>0){const a=pk[i-1];pts.push([(a[0]+q[0])/2+(r()-.5)*4,Math.max(a[1],q[1])+Math.min(100-a[1],100-q[1])*.45])}pts.push(q)});pts.push([100,100]);
 const o=[P(pts.map(q=>[q[0]/50-1,q[1]/50-1]))];if(p.sn)pk.forEach(q=>{const w=Math.min(15,(100-q[1])*.28);o.push(P([[q[0]-w,q[1]+w*1.5],[q[0]-w*.45,q[1]+w*1.1],[q[0],q[1]+w*1.7],[q[0]+w*.5,q[1]+w*1.05],[q[0]+w,q[1]+w*1.5]].map(s=>[s[0]/50-1,s[1]/50-1]),{open:1,sub:1}))});
 if(p.su)o.push(P(C100(82,22,11,cn(n/3,14)),{sub:0}));return o},{fit:p=>!p.su,seg:p=>!!p.su});
add('pine','n','Pinheiro',[pr('t','Andares',3,1,6),pr('w','Largura',100,50,130,5,'%'),pb('tk','Tronco',1),RD()],p=>{const k=Math.round(p.t),w=p.w/100,L=[],R=[];for(let i=0;i<k;i++){const t0=i/k,t1=(i+1)/k,y0=-1+1.72*t0*.8,y1=-1+1.72*(t1*.86+.1)*1,wd=(.38+.62*t1)*w;L.push([-wd*.7,y1],[-wd*.35,y1]);R.push([wd*.7,y1],[wd*.35,y1])}
 const pts=[[0,-1]];for(let i=0;i<k;i++){const t1=(i+1)/k,y1=-1+1.78*(i+1)/k*.92+.0,wd=(.34+.66*t1)*w,ytop=-1+1.78*i/k*.92+.18*(i>0?1:0);pts.push([wd*.62,y1-.0]);if(i<k-1)pts.push([wd*.38,y1])}const trunk=p.tk?[[.16,.76],[.16,1],[-.16,1],[-.16,.76]]:[[0,.76]];const left=[];const pr2=pts.slice(1).map(q=>[-q[0],q[1]]).reverse();return[P([...pts,...trunk.slice(0,2).length&&p.tk?trunk.slice(0,2):[],...(p.tk?trunk.slice(2):[]),...pr2])]},{fit:true});
add('cactus','n','Cacto',[pr('b','Braços',2,0,4),pr('th','Espessura',22,12,38,1,'%'),pb('fl','Flor',0),RD(45)],(p,n)=>{const k=Math.round(p.b),t=p.th/100,o=[];const arms=[[-1,.05,-.18],[1,-.2,-.42],[-1,-.45,-.62],[1,.28,.1]].slice(0,k);const pts=[[-t,1],[-t,-1+t],...arc(0,-1+t,t,t,Math.PI,TAU,cn(8,3)).slice(1,-1),[t,-1+t],[t,1]];o.push(P(pts));arms.forEach(([s,y0,y1])=>{const x0=s*t,x1=s*(t+.34),yb=y0,yt=y1;o.push(P([[x0,yb],[x1,yb],[x1,yt+t*.8],...arc(x1+s*.0,yt+t*.8,t*.8,t*.8,s>0?0:Math.PI,s>0?-Math.PI/2*2:-Math.PI*2,cn(6,3)).slice(0,0)]));});return[P(pp100('40 98 40 70 20 70 20 40 32 40 32 58 40 58 40 8 60 8 60 48 68 48 68 28 80 28 80 60 60 60 60 98'))].slice(0,1)});
add('snow','n','Floco de neve',[pr('b','Tamanho dos ramos',32,10,50,1,'%'),pr('k','Pontas',6,4,12),pr('nb','Níveis de ramos',2,0,3),pb('dt','Cristal no centro',0),pr('ag','Ângulo dos ramos',45,20,70,5,'°')],p=>{const k=Math.round(p.k),o=[],lv=Math.round(p.nb),A=rad(p.ag);for(let i=0;i<k;i++){const a=-Math.PI/2+i*TAU/k,c=Math.cos(a),s=Math.sin(a);o.push(P([[0,0],[c,s]],{open:1,sub:1}));[.52,.76,.9].slice(0,lv).forEach((f,j)=>{const bl=p.b/100*(1-j*.28),px=c*f,py=s*f;[-1,1].forEach(sg=>{const ba=a+sg*A;o.push(P([[px,py],[px+Math.cos(ba)*bl,py+Math.sin(ba)*bl]],{open:1,sub:1}))})})}if(p.dt)o.push(P(circ(0,0,.12,.12,k,-Math.PI/2),{sub:1}));return o},{open:true,fit:true});
add('spiral','n','Espiral',[ps('ty','Tipo',0,O(['Arquimediana','Logarítmica','Quadrada','Dupla (S)'])),pr('t','Voltas',3,1,10,.5),pr('g','Abertura central',0,0,40,5,'%')],(p,n)=>{const k=p.t,m=Math.max(16,Math.round(n*k)),g=p.g/100;const pt=(t,s)=>{let a=t*k*TAU,r;if(p.ty===1)r=(Math.exp(t*2.2)-1)/(Math.exp(2.2)-1);else r=t;r=g+(1-g)*r;return[s*Math.cos(a)*r,s*Math.sin(a)*r]};
 if(p.ty===2){const pts=[[0,0]];let x=0,y=0,len=.0,step=1/(k*2+1)*1.0,dir=0;const dx=[1,0,-1,0],dy=[0,1,0,-1];let l=step;for(let i=0;i<k*4+1;i++){x+=dx[dir%4]*l*(.5+.5*Math.min(1,i/2));y+=dy[dir%4]*l*(.5+.5*Math.min(1,i/2));pts.push([x,y]);dir++;if(i%2===1)l+=step}return[P(pts,{open:1})]}
 if(p.ty===3){const a=[],b=[];for(let i=0;i<=m;i++){const t=i/m;a.push(pt(t,1))}return[P(a,{open:1}),P(a.map(q=>[-q[0],-q[1]]),{open:1,sub:1})]}
 const pts=[];for(let i=0;i<=m;i++)pts.push(pt(i/m,1));return[P(pts,{open:1})]},{open:true,seg:true,fit:true});
add('wave','n','Onda',[ps('ty','Tipo',0,O(['Senoidal','Triangular','Quadrada','Dente de serra'])),pr('n','Ondas',3,1,12),pr('a','Altura',35,5,100,5,'%'),pr('l','Linhas paralelas',1,1,5),pr('gp','Espaço entre linhas',30,10,80,5,'%')],(p,n)=>{const L=Math.round(p.l),mk=(dy)=>{const pts=[];const m=Math.max(12,Math.round(n*p.n));for(let i=0;i<=m;i++){const t=i/m,ph=t*p.n;let y;if(p.ty===1)y=1-4*Math.abs((ph%1+1)%1-.5)-.0,y=(Math.abs(((ph+.25)%1+1)%1-.5)*4-1)*-1;else if(p.ty===2)y=Math.sin(ph*TAU)>=0?1:-1;else if(p.ty===3)y=(((ph%1)+1)%1)*2-1;else y=Math.sin(ph*TAU);pts.push([t*2-1,y*p.a/100+dy])}
  if(p.ty===2){const q=[];const k=Math.round(p.n*2);for(let i=0;i<k;i++){const x0=-1+i*2/k,x1=-1+(i+1)*2/k,yy=(i%2?-1:1)*p.a/100+dy;q.push([x0,yy],[x1,yy])}return q}return pts};
 const o=[];for(let i=0;i<L;i++)o.push(P(mk((i-(L-1)/2)*p.gp/100),{open:1,sub:i>0?1:0}));return o},{fit:false,open:true,seg:true});

add('lobed','o','Lóbulos (roseta)',[pr('k','Lóbulos',8,3,24),pr('d','Profundidade',60,3,100,1,'%'),ps('st','Estilo',0,O(['Escalopado (círculos)','Ondulado','Pontudo','Pétalas em gota','Engrenagem arredondada'])),pr('fh','Furo central',0,0,80,5,'%'),pr('ro','Giro',0,0,180,5,'°')],(p,n)=>{const k=Math.round(p.k),m=cn(n*1.6,64),d=p.d/100;let pts;
 if(p.st===0)pts=scallop(k,d,m);
 else{pts=[];const N=Math.max(m,k*14);for(let i=0;i<N;i++){const t=i/N*TAU,c=Math.cos(k*t),f=(c+1)/2;let r;
  if(p.st===1)r=1-d*.55*(1-f);else if(p.st===2)r=1-d*.8*(1-Math.pow(f,.5)) ;else if(p.st===3)r=1-d*.8*(1-Math.pow(Math.sin(Math.PI*((k*t/TAU)%1)),.7));else r=1-d*.5*(1-Math.pow(f,.25)>.5?1:0)-d*.5*(1-f)*.0;
  if(p.st===4){const u=((k*t/TAU)%1+1)%1;r=1-d*.5*(u>.5?1:0)*(1-Math.sin(u*Math.PI)*.0);r=1-d*.55*(Math.abs(u-.5)<.25?0:1)}
  pts.push([Math.cos(t-Math.PI/2)*r,Math.sin(t-Math.PI/2)*r])}}
 if(p.ro)pts=rot(pts,rad(p.ro));const o=[P(pts)];if(p.fh>0)o.push(P(circ(0,0,p.fh/100,p.fh/100,cn(n/2,16)),{sub:1}));return o},{seg:true});
add('blob','o','Blob orgânico',[pr('s','Semente',12,1,999,1,'','Cada número gera um blob diferente.'),pr('k','Pontos de controle',8,3,16),pr('v','Irregularidade',48,0,80,1,'%'),pr('el','Alongamento',0,-60,60,5,'%'),ps('st','Estilo',0,O(['Macio','Pedra (facetado suave)','Ameba (pseudópodes)'])),pr('hl','Furos',0,0,3),pb('sat','Gotas ao redor',0)],(p,n)=>{const rr=rng(p.s*7.31+1),k=Math.round(p.k),v=p.v/100,ctl=[];
 for(let i=0;i<k;i++){const a=(i+(rr()-.5)*.5)/k*TAU;let r=p.st===2?.42+rr()*.58*(i%2?1:.7)*(.5+v):1-v*rr();ctl.push([Math.cos(a)*r,Math.sin(a)*r])}
 let sm=ctl.map((q,i)=>{const a=ctl[(i-1+k)%k],b=ctl[(i+1)%k];return[q[0]*.7+(a[0]+b[0])*.15,q[1]*.7+(a[1]+b[1])*.15]});if(p.st===2)sm=ctl;
 let pts;if(p.st===1){pts=sm;for(let it=0;it<3;it++){const o=[];pts.forEach((q,i)=>{const b=pts[(i+1)%pts.length];o.push([q[0]*.75+b[0]*.25,q[1]*.75+b[1]*.25],[q[0]*.25+b[0]*.75,q[1]*.25+b[1]*.75])});pts=o}}else pts=crClosed(sm,cn(n*1.2/k,8));
 const el=p.el/100;pts=pts.map(q=>[q[0]*(1+el),q[1]*(1-el*.55)]);const bb=bbox(pts),sc=Math.max(bb.w,bb.h)/2;pts=pts.map(q=>[(q[0]-bb.cx)/sc,(q[1]-bb.cy)/sc]);const o=[P(pts)];
 const hl=Math.round(p.hl);for(let i=0;i<hl;i++){const a=rr()*TAU,d=.2+rr()*.3,r=.1+rr()*.1;const h=crClosed(Array.from({length:6},(_,j)=>{const t=j/6*TAU,q=r*(.75+rr()*.5);return[Math.cos(a)*d+Math.cos(t)*q,Math.sin(a)*d+Math.sin(t)*q]}),6);o.push(P(h,{sub:1}))}
 if(p.sat){for(let i=0;i<3;i++){const a=rr()*TAU,d=1.2+rr()*.25,r=.07+rr()*.08;o.push(P(crClosed(Array.from({length:6},(_,j)=>{const t=j/6*TAU,q=r*(.8+rr()*.4);return[Math.cos(a)*d+Math.cos(t)*q,Math.sin(a)*d+Math.sin(t)*q]}),5)))}}return o},{seg:true,fit:p=>!p.sat});
add('splash','o','Respingo de tinta',[pr('s','Semente',5,1,999),pr('b','Gotas',8,0,20),pr('sp','Espalhamento',60,20,100,5,'%'),pr('v','Pontas do centro',8,4,16)],(p,n)=>{const rr=rng(p.s*3.7+2),k=Math.round(p.v),ctl=[],tips=[];for(let i=0;i<k*2;i++){const a=i/(k*2)*TAU,tip=i%2===0,r=tip?.66+rr()*.22:.4+rr()*.08;ctl.push([Math.cos(a)*r,Math.sin(a)*r]);if(tip)tips.push([a,r])}
 const o=[P(crClosed(ctl,cn(n/k/2,5)))],nb=Math.round(p.b);for(let i=0;i<nb;i++){const t=tips[i%tips.length]||[rr()*TAU,.7],a=t[0]+(rr()-.5)*.25,d=t[1]+.14+rr()*.28*p.sp/100,r=.035+rr()*.07*(1.1-d*.5),el=1.3+rr()*.6,q=[];for(let j=0;j<10;j++){const u=j/10*TAU;q.push([Math.cos(a)*d+Math.cos(a)*Math.cos(u)*r*el-Math.sin(a)*Math.sin(u)*r,Math.sin(a)*d+Math.sin(a)*Math.cos(u)*r*el+Math.cos(a)*Math.sin(u)*r])}o.push(P(q))}return o},{seg:true,fit:true});
add('rose','o','Rosácea matemática',[pr('n','Pétalas (numerador)',5,1,12),pr('d','Divisor',1,1,9,1,'','Razão n/d: 5/2 forma uma estrela de pétalas cruzadas.'),pr('sh','Pétala preenchida',0,0,0)],(p,n)=>{const k=p.n/p.d,m=Math.max(120,n*8),Tm=TAU*p.d,pts=[];for(let i=0;i<=m;i++){const t=i/m*Tm,r=Math.cos(k*t);pts.push([r*Math.cos(t),r*Math.sin(t)])}return[P(pts,{open:1})]},{open:true,fit:true,seg:true});
add('spiro','o','Espirógrafo',[pr('R','Anel externo',9,3,20),pr('r','Roda interna',4,1,19),pr('d','Distância do furo',70,10,150,5,'%'),ps('ty','Tipo',0,O(['Hipotrocoide (dentro)','Epitrocoide (fora)']))],(p,n)=>{const R=p.R,r=Math.min(p.r,R-1),d=r*p.d/100,g=(function gcd(a,b){return b?gcd(b,a%b):a})(Math.round(R),Math.round(r)),Tm=TAU*Math.round(r)/g,m=Math.max(300,n*12),pts=[];for(let i=0;i<=m;i++){const t=i/m*Tm;let x,y;if(p.ty===0){x=(R-r)*Math.cos(t)+d*Math.cos((R-r)/r*t);y=(R-r)*Math.sin(t)-d*Math.sin((R-r)/r*t)}else{x=(R+r)*Math.cos(t)-d*Math.cos((R+r)/r*t);y=(R+r)*Math.sin(t)-d*Math.sin((R+r)/r*t)}pts.push([x,y])}return[P(pts,{open:1})]},{open:true,fit:true,seg:true});
add('lissa','o','Lissajous',[pr('a','Frequência X',3,1,9),pr('b','Frequência Y',2,1,9),pr('ph','Fase',90,0,180,5,'°')],(p,n)=>{const m=Math.max(160,n*8),pts=[];for(let i=0;i<=m;i++){const t=i/m*TAU;pts.push([Math.sin(p.a*t+rad(p.ph)),Math.sin(p.b*t)])}return[P(pts,{open:1})]},{open:true,fit:true,seg:true});
add('nest','o','Polígonos encaixados',[pr('n','Lados',4,3,12),pr('l','Camadas',8,2,30),pr('tw','Giro entre camadas',10,1,45,1,'°'),pb('cv','Camadas arredondadas',0)],(p,n)=>{const o=[],L=Math.round(p.l),sd=Math.round(p.n),a0=Math.min(rad(p.tw),TAU/sd*.9),k=Math.cos(Math.PI/sd)/Math.cos(Math.PI/sd-a0);let r=1;for(let i=0;i<L;i++){const pts=circ(0,0,r,r,sd,-Math.PI/2+i*a0);o.push(P(p.cv?crClosed(pts,6):pts,{sub:1}));r*=k}return o},{open:true,fit:true});
add('flife','o','Flor da vida',[pr('r','Anéis',2,1,4),pb('ou','Círculo externo',1)],(p,n)=>{const R=Math.round(p.r),c=[[0,0]];for(let q=1;q<=R;q++)for(let i=0;i<6*q;i++){const s=Math.floor(i/q),j=i%q,a=[Math.cos(rad(60*s)),Math.sin(rad(60*s))],b=[Math.cos(rad(60*(s+1))),Math.sin(rad(60*(s+1)))];c.push([q*(a[0]*(1-j/q)+b[0]*j/q),q*(a[1]*(1-j/q)+b[1]*j/q)])}const sc=1/(R+1),o=c.map(q=>P(circ(q[0]*sc,q[1]*sc,sc,sc,cn(n/3,16)),{sub:1}));if(p.ou)o.push(P(circ(0,0,1,1,cn(n,24)),{sub:1}));return o},{open:true,fit:false,seg:true});
add('ringdots','o','Anel de pontos',[pr('n','Pontos',12,3,40),pr('s','Tamanho',22,5,60,1,'%'),pr('l','Anéis',1,1,4),pr('gr','Crescimento',0,0,100,10,'%','Pontos maiores para fora (ou 0 = iguais).')],(p,n)=>{const k=Math.round(p.n),L=Math.round(p.l),o=[];for(let l=0;l<L;l++){const rr=L===1?.78:.35+.55*(l+1)/L,sz=Math.min(.45,Math.PI*rr/k*(p.s/100)*2.2)*(1+p.gr/100*l*.35);for(let i=0;i<k;i++){const a=-Math.PI/2+i*TAU/k+(l%2?TAU/k/2:0);o.push(P(circ(Math.cos(a)*rr,Math.sin(a)*rr,sz,sz,cn(n/4,8))))}}return o},{fit:false,seg:true});

const COL=(a,b)=>[pc('ca','Cor A',a||'263238'),pc('cb','Cor B',b||'eceff1')];
const rc=(x0,y0,x1,y1)=>[[x0,y0],[x1,y0],[x1,y1],[x0,y1]];
const fp=(pts,f,l,x)=>P(pts,{fill:f,line:l===undefined?dk(f,.35):l,...(x||{})});
function clipBox(poly,x0,y0,x1,y1){const ed=[[q=>q[0]>=x0,(a,b)=>{const t=(x0-a[0])/(b[0]-a[0]);return[x0,a[1]+(b[1]-a[1])*t]}],[q=>q[0]<=x1,(a,b)=>{const t=(x1-a[0])/(b[0]-a[0]);return[x1,a[1]+(b[1]-a[1])*t]}],[q=>q[1]>=y0,(a,b)=>{const t=(y0-a[1])/(b[1]-a[1]);return[a[0]+(b[0]-a[0])*t,y0]}],[q=>q[1]<=y1,(a,b)=>{const t=(y1-a[1])/(b[1]-a[1]);return[a[0]+(b[0]-a[0])*t,y1]}]];let o=poly;ed.forEach(([ins,isect])=>{const inp=o;o=[];for(let i=0;i<inp.length;i++){const a=inp[i],b=inp[(i+1)%inp.length],ia=ins(a),ib=ins(b);if(ia&&ib)o.push(b);else if(ia&&!ib)o.push(isect(a,b));else if(!ia&&ib){o.push(isect(a,b),b)}}});return o}
const SEGP={dots:true,scales:true,waves:true,burst:true,hexmosaic:true,stars:v=>v.mo>0};
const pat=(id,n,params,g,x)=>{const x2=Object.assign({},x||{});if(x2.seg===undefined&&SEGP[id]!==undefined)x2.seg=SEGP[id];return add(id,'p',n,[...params,pr('rd','Arredondar cantos',0,0,100,5,'%')].filter((q,i,a)=>!(q.k==='rd'&&x&&x.noRD)),(p,nn,G)=>g(p,nn,G),Object.assign({col:true,fit:false,pat:true},x2))};
pat('checker','Xadrez',[...COL(),pr('c','Colunas',6,2,24),pr('r','Linhas',6,2,24),ps('st','Casas',0,O(['Quadradas','Círculos','Losangos','Estrelas'])),pb('bg','Fundo (cor B)',1),pb('iv','Inverter cores',0)],(p,n)=>{const c=Math.round(p.c),r=Math.round(p.r),o=[],w=2/c,h=2/r,A=p.iv?p.cb:p.ca,B=p.iv?p.ca:p.cb;if(p.bg)o.push(fp(rc(-1,-1,1,1),B,dk(B,.3)));
 const K=Math.SQRT1_2;
 if(p.st===2){const u=w/2,v=h/2;for(let j=-2;j<=2*r+2;j+=2)for(let i=-2;i<=2*c+2;i+=2){const cx=-1+i*u,cy=-1+j*v,q=clipBox([[cx,cy-v],[cx+u,cy],[cx,cy+v],[cx-u,cy]],-1,-1,1,1);if(q.length>=3)o.push(fp(q,A))}
  return o}
 for(let j=0;j<r;j++)for(let i=0;i<c;i++){if((i+j)%2)continue;const x0=-1+i*w,y0=-1+j*h,cx=x0+w/2,cy=y0+h/2;let q;
  if(p.st===1)q=circ(cx,cy,w*K,h*K,cn(n,24));
  else if(p.st===2)q=[[cx,cy-h],[cx+w,cy],[cx,cy+h],[cx-w,cy]];
  else if(p.st===3){const R=starPts(4,.42,0,10);q=R.map(s=>[cx+s[0]*w*K*1.0,cy+s[1]*h*K*1.0]);q=rot(starPts(4,.45,0,10).map(s=>[s[0]*w*K,s[1]*h*K]),Math.PI/4).map(s=>[cx+s[0],cy+s[1]])}
  else q=rc(x0,y0,x0+w,y0+h);
  q=clipBox(q,-1,-1,1,1);if(q.length>=3)o.push(fp(q,A))}return o},{seg:true});
pat('stripes','Listras',[...COL('e53935','ffffff'),pr('n','Listras',6,2,30),pr('a','Ângulo',45,0,175,5,'°'),pr('w','Espessura da listra',50,10,90,5,'%'),pb('bg','Fundo (cor B)',1),pb('ou','Contorno das listras',1)],p=>{const k=Math.round(p.n),a=rad(p.a),o=[],B=p.cb,A=p.ca;if(p.bg)o.push(fp(rc(-1,-1,1,1),B,dk(B,.3)));const step=2.9/k,th=step*p.w/100,ux=Math.cos(a),uy=Math.sin(a),nx=-uy,ny=ux;
 for(let i=0;i<k;i++){const c=(-1.45+step*(i+.5)),Lh=3,P0=[nx*(c-th/2)-ux*Lh,ny*(c-th/2)-uy*Lh],P1=[nx*(c-th/2)+ux*Lh,ny*(c-th/2)+uy*Lh],P2=[nx*(c+th/2)+ux*Lh,ny*(c+th/2)+uy*Lh],P3=[nx*(c+th/2)-ux*Lh,ny*(c+th/2)-uy*Lh];const q=clipBox([P0,P1,P2,P3],-1,-1,1,1);if(q.length>=3)o.push(fp(q,A))}return o});
pat('dots','Bolinhas',[...COL('e91e63','fff3e0'),pr('c','Colunas',5,1,20),pr('r','Linhas',5,1,20),pr('s','Tamanho',70,20,100,5,'%'),ps('st','Disposição',0,O(['Grade','Deslocada (colmeia)','Tamanhos crescentes'])),ps('fm','Forma',0,O(['Círculo','Quadrado','Losango','Coração','Estrela'])),pb('bg','Fundo (cor B)',0)],(p,n)=>{const c=Math.round(p.c),r=Math.round(p.r),o=[],w=2/c,h=2/r;if(p.bg)o.push(fp(rc(-1,-1,1,1),p.cb,dk(p.cb,.3)));
 for(let j=0;j<r;j++)for(let i=0;i<c;i++){const off=p.st===1&&j%2?w/2:0;if(p.st===1&&j%2&&i===c-1)continue;const cx=-1+w/2+i*w+(p.st===1?-w/4+off:0)*(p.st===1?1:0),cy=-1+h/2+j*h;let sz=p.s/100*.5;if(p.st===2)sz*=(.35+.65*(i+j)/Math.max(1,c+r-2));const rx=w*sz*(p.st===1?.95:1),ry=h*sz;let q;
  if(p.fm===1)q=rc(cx-rx,cy-ry,cx+rx,cy+ry);else if(p.fm===2)q=[[cx,cy-ry],[cx+rx,cy],[cx,cy+ry],[cx-rx,cy]];else if(p.fm===3)q=heartN(24).map(s=>[cx+s[0]*rx,cy+s[1]*ry]);else if(p.fm===4)q=starPts(5,.45,0,10).map(s=>[cx+s[0]*rx*1.1,cy+s[1]*ry*1.1]);else q=circ(cx,cy,rx,ry,cn(n/4,12));o.push(fp(q,p.ca))}return o});
pat('honey','Favo (hexágonos)',[...COL('ffb300','fff8e1'),pr('c','Colunas',5,2,14),pr('r','Linhas',5,2,14),pr('g','Espaço entre as células',10,0,40,2,'%'),ps('co','Cores',0,O(['Todas iguais','Alternadas em 2','Um sim, outro não (listras)'])),ps('or','Orientação',0,O(['Ponta para cima','Lado para cima']))],p=>{const c=Math.round(p.c),r=Math.round(p.r),o=[],rd=1,hexW=Math.sqrt(3)*rd,gap=1-p.g/100*.5;let cells=[];for(let j=0;j<r;j++)for(let i=0;i<c;i++)cells.push([i*hexW+(j%2?hexW/2:0),j*1.5*rd,i,j]);const pts=[];cells.forEach(q=>{const hx=circ(q[0],q[1],rd*gap,rd*gap,6,-Math.PI/2);pts.push(...hx)});const bb=bbox(pts),sc=Math.max(bb.w,bb.h)/2;
 cells.forEach(q=>{let hx=circ(q[0],q[1],rd*gap,rd*gap,6,-Math.PI/2).map(s=>[(s[0]-bb.cx)/sc,(s[1]-bb.cy)/sc]);if(p.or===1)hx=hx.map(s=>[s[1]*(bb.h/bb.w||1),s[0]]).map(s=>[s[0],s[1]]);const k=p.co===1?(q[2]+q[3])%2:p.co===2?q[2]%2:0;o.push(fp(hx,k?p.cb:p.ca))});return o},{fit:true});
pat('bricks','Tijolos',[...COL('b5502c','e8d7c3'),pr('c','Colunas',4,1,12),pr('r','Linhas',6,2,16),pr('g','Argamassa',12,0,40,2,'%'),pb('mx','Cores variadas',1),pb('bg','Fundo (argamassa)',1)],p=>{const c=Math.round(p.c),r=Math.round(p.r),o=[],h=2/r,w=2/c,g=Math.min(h,w)*p.g/100*.5,rr=rng(9);if(p.bg)o.push(fp(rc(-1,-1,1,1),p.cb,dk(p.cb,.3)));
 for(let j=0;j<r;j++){const off=j%2?w/2:0;for(let i=-1;i<=c;i++){let x0=-1+i*w+off+g/2,x1=x0+w-g,y0=-1+j*h+g/2,y1=y0+h-g;const q=clipBox(rc(x0,y0,x1,y1),-1,-1,1,1);if(q.length<3||Math.abs(q[2][0]-q[0][0])<.02)continue;o.push(fp(q,p.mx?mix(p.ca,'000000',rr()*.28):p.ca))}}return o});
pat('scales','Escamas',[...COL('26a69a','b2dfdb'),pr('c','Colunas',5,2,14),pr('r','Linhas',6,2,16),ps('st','Estilo',0,O(['Arco (peixe)','Pontudas (dragão)','Ogivas (art déco)'])),pb('gd','Cores em degradê',1)],(p,n)=>{const c=Math.round(p.c),r=Math.round(p.r),o=[],w=2/c,h=2/r;for(let j=0;j<r;j++){const off=j%2?w/2:0;for(let i=-1;i<=c;i++){const cx=-1+i*w+off+w/2,cy=-1+j*h*1;const rw=w/2,rh=h;let q;if(p.st===1)q=[[cx-rw,cy],[cx,cy+rh*1.3],[cx+rw,cy]];else if(p.st===2)q=[[cx-rw,cy],...arc(cx-rw,cy+rh*.9,rw,rh*.9,-Math.PI/2,0,cn(6,3)).slice(1).map(s=>[s[0],s[1]]).reverse().reverse().map((s,k,a)=>s),[cx,cy+rh*1.5],...arc(cx+rw,cy+rh*.9,rw,rh*.9,Math.PI,Math.PI*1.5,cn(6,3)).slice(0,-1).reverse().map(s=>s)].filter(s=>true);else q=[[cx-rw,cy],...arc(cx,cy,rw,rh*1.1,Math.PI,0,cn(n/4,8)).map(s=>[s[0],cy-(s[1]-cy)]).slice(1,-1),[cx+rw,cy]].map(s=>s);if(p.st===0)q=[...arc(cx,cy,rw,rh*1.1,0,Math.PI,cn(n/4,10))];if(p.st===2)q=[[cx-rw,cy],[cx-rw*.6,cy+rh*.7],[cx,cy+rh*1.4],[cx+rw*.6,cy+rh*.7],[cx+rw,cy]];const cq=clipBox(q,-1,-1,1,1);if(cq.length<3)continue;o.push(fp(cq,p.gd?mix(p.ca,p.cb,j/Math.max(1,r-1)*.8):((i+j)%2?p.ca:p.cb)))}}return o});
pat('argyle','Losangos (arlequim)',[...COL('7b1fa2','f3e5f5'),pr('c','Colunas',4,2,12),pr('r','Linhas',4,2,12),pb('ln','Linhas cruzadas',1),pr('s','Tamanho dos losangos',100,50,100,5,'%')],p=>{const c=Math.round(p.c),r=Math.round(p.r),o=[],w=2/c,h=2/r;o.push(fp(rc(-1,-1,1,1),p.cb,dk(p.cb,.3)));for(let j=0;j<r;j++)for(let i=0;i<c;i++){const cx=-1+w/2+i*w,cy=-1+h/2+j*h,k=p.s/100;if((i+j)%2===0)o.push(fp([[cx,cy-h/2*k],[cx+w/2*k,cy],[cx,cy+h/2*k],[cx-w/2*k,cy]],p.ca))}if(p.ln)for(let j=0;j<r;j++)for(let i=0;i<c;i++){const cx=-1+w/2+i*w,cy=-1+h/2+j*h;if((i+j)%2===1)o.push(P([[cx-w/2,cy],[cx,cy-h/2],[cx+w/2,cy],[cx,cy+h/2],[cx-w/2,cy]],{open:1,line:dk(p.ca,.0),t:.012}))}return o});
pat('zigzag','Zigue-zague',[...COL('1565c0','e3f2fd'),pr('n','Faixas',4,1,12),pr('z','Dentes',6,2,20),pr('a','Altura do dente',55,10,100,5,'%'),pr('t','Espessura',50,10,90,5,'%'),pb('bg','Fundo (cor B)',1)],p=>{const k=Math.round(p.n),z=Math.round(p.z),o=[],step=2/k,th=step*p.t/100*.5,am=step*p.a/100*.5;if(p.bg)o.push(fp(rc(-1,-1,1,1),p.cb,dk(p.cb,.3)));
 for(let j=0;j<k;j++){const cy=-1+step*(j+.5),L=[];for(let i=0;i<=z;i++)L.push([-1+2*i/z,cy+(i%2?am:-am)]);const t=thickLine(L,th);o.push(fp(clipBox(t,-1,-1,1,1),p.ca))}return o});
pat('waves','Ondas coloridas',[...COL('0288d1','b3e5fc'),pr('n','Faixas',5,2,12),pr('w','Ondas',3,1,8),pr('a','Altura',18,2,45,1,'%'),pb('gd','Degradê de cor',1)],(p,n)=>{const k=Math.round(p.n),o=[],m=cn(n*2,40);o.push(fp(rc(-1,-1,1,1),p.cb,dk(p.cb,.3)));for(let j=0;j<k;j++){const y0=-1+2*(j+.7)/(k+.2),top=[];for(let i=0;i<=m;i++){const t=i/m;top.push([t*2-1,y0+Math.sin(t*p.w*TAU+j*.9)*p.a/100*.5])}const q=[...top,[1,1],[-1,1]].map(s=>[s[0],Math.min(1,Math.max(-1,s[1]))]);o.push(fp(q,p.gd?mix(p.cb,p.ca,(j+1)/k):(j%2?p.cb:p.ca)))}return o});
pat('grid','Grade',[...COL('546e7a','eceff1'),pr('c','Colunas',6,1,24),pr('r','Linhas',6,1,24),pr('t','Espessura da linha',20,5,100,5,'%'),pb('dg','Diagonais (losangos)',0),pb('ds','Pontos nos cruzamentos',0),pb('bd','Borda externa',1)],(p,n)=>{const c=Math.round(p.c),r=Math.round(p.r),o=[],tt=.012*p.t/20*2;
 if(p.dg){const k=Math.max(c,r);for(let i=-k+1;i<k;i++){const d=i*2/k;let a0=Math.max(-1,-1-d),a1=Math.min(1,1-d);if(a1>a0)o.push(P([[a0,a0+d],[a1,a1+d]],{open:1,line:p.ca,t:tt}));a0=Math.max(-1,d-1);a1=Math.min(1,d+1);if(a1>a0)o.push(P([[a0,-a0+d],[a1,-a1+d]],{open:1,line:p.ca,t:tt}))}}
 else{for(let i=p.bd?0:1;i<=(p.bd?c:c-1);i++)o.push(P([[-1+2*i/c,-1],[-1+2*i/c,1]],{open:1,line:p.ca,t:tt}));for(let j=p.bd?0:1;j<=(p.bd?r:r-1);j++)o.push(P([[-1,-1+2*j/r],[1,-1+2*j/r]],{open:1,line:p.ca,t:tt}))}
 if(p.ds&&!p.dg)for(let i=0;i<=c;i++)for(let j=0;j<=r;j++)o.push(P(circ(-1+2*i/c,-1+2*j/r,.03*p.t/20+.02,.03*p.t/20+.02,cn(8,3)),{fill:p.ca,line:p.ca}));return o},{noRD:true});
pat('rings','Círculos concêntricos',[...COL('d81b60','fce4ec'),pr('n','Anéis',6,2,16),ps('fm','Formato',0,O(['Círculo','Quadrado','Losango','Estrela','Hexágono','Coração'])),pb('gd','Degradê',0),pb('sq','Giro progressivo',0)],(p,n)=>{const k=Math.round(p.n),o=[];for(let i=0;i<k;i++){const r=1-i/k,col=p.gd?mix(p.ca,p.cb,i/(k-1)):(i%2?p.cb:p.ca);let q;const rot2=p.sq?i*rad(8):0;if(p.fm===1)q=rot(rc(-r,-r,r,r),rot2);else if(p.fm===2)q=rot([[0,-r],[r,0],[0,r],[-r,0]],rot2);else if(p.fm===3)q=rot(starPts(5,.45,0,10).map(s=>[s[0]*r,s[1]*r]),rot2);else if(p.fm===4)q=rot(circ(0,0,r,r,6),rot2);else if(p.fm===5)q=heartN(40).map(s=>[s[0]*r,s[1]*r]);else q=circ(0,0,r,r,cn(n,16));o.push(fp(q,col))}return o},{noRD:true,seg:true});
pat('tris','Triângulos',[...COL('ff7043','ffe0b2'),pr('c','Colunas',6,2,20),pr('r','Linhas',4,2,16),ps('co','Cores',0,O(['Alternadas','Degradê','Só os de cima']))],p=>{const c=Math.round(p.c),r=Math.round(p.r),o=[],w=2/c,h=2/r;for(let j=0;j<r;j++)for(let i=-1;i<c;i++){const x0=-1+i*w,y0=-1+j*h,y1=y0+h;const col=p.co===1?mix(p.ca,p.cb,(i+j+1)/(c+r)):((i+j)%2?p.cb:p.ca),col2=p.co===1?mix(p.ca,p.cb,(i+j+1.5)/(c+r)):((i+j)%2?p.ca:p.cb);
 if(i>=0)o.push(fp([[x0,y1],[x0+w/2,y0],[x0+w,y1]],p.co===2?p.ca:col));if(p.co!==2){const dd=clipBox([[x0+w/2,y0],[x0+w*1.5,y0],[x0+w,y1]],-1,-1,1,1);if(dd.length>2)o.push(fp(dd,col2))}}return o});
pat('burst','Roleta / raios do sol',[...COL('fbc02d','e65100'),pr('n','Raios',16,4,48,2),pr('tw','Torção (catavento)',0,-100,100,5,'%'),ps('sh','Contorno',0,O(['Círculo','Quadrado'])),pr('hl','Furo central',0,0,60,5,'%','Furo de verdade: nada é desenhado no centro (dá para ver o que está atrás).')],(p,n)=>{const k=Math.round(p.n/2)*2,o=[],m=cn(n/k*2,6),tw=p.tw/100*Math.PI*.8,ri=p.hl/100,sq=p.sh===1;
 const outR=a=>sq?1/Math.max(Math.abs(Math.cos(a+tw)),Math.abs(Math.sin(a+tw))):1;
 const angs=(a0,a1)=>{const L=[];for(let j=0;j<=m;j++)L.push(a0+(a1-a0)*j/m);if(sq){for(let q=-8;q<=8;q++){const ac=Math.PI/4+q*Math.PI/2-tw;if(ac>a0+1e-6&&ac<a1-1e-6)L.push(ac)}}return L.sort((x,y)=>x-y)};
 const sector=(a0,a1)=>{const A=angs(a0,a1),q=[];A.forEach(a=>{const r=outR(a);q.push([Math.cos(a+tw)*r,Math.sin(a+tw)*r])});
  if(ri>0){for(let j=A.length-1;j>=0;j--){const a=A[j];q.push([Math.cos(a+tw)*ri,Math.sin(a+tw)*ri])}}else q.push([0,0]);return q};
 const base0=-Math.PI/2;
 if(ri<=0){o.push(fp(sq?rc(-1,-1,1,1):circ(0,0,1,1,cn(n,24)),p.cb))}
 for(let i=0;i<k;i++){const a0=base0+i*TAU/k,a1=a0+TAU/k,q=sector(a0,a1);if(i%2===0)o.push(fp(q,p.ca));else if(ri>0)o.push(fp(q,p.cb))}
 return o},{noRD:true,seg:true});
const clipHP=(poly,nx,ny,d)=>{const o=[];for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length],da=nx*a[0]+ny*a[1]-d,db=nx*b[0]+ny*b[1]-d;if(da<=0)o.push(a);if((da<0&&db>0)||(da>0&&db<0)){const t=da/(da-db);o.push([a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t])}}return o};
const centroid=q=>{let x=0,y=0;q.forEach(s=>{x+=s[0];y+=s[1]});return[x/q.length,y/q.length]};
const bgRect=(p,k)=>p.bg?[fp(rc(-1,-1,1,1),p[k||'cb'],dk(p[k||'cb'],.3))]:[];
pat('voronoi','Mosaico Voronoi (pedras)',[...COL('00897b','ffd54f'),pr('n','Pedras',24,5,80),pr('sd','Sorteio (semente)',3,1,99),pr('rx','Regularizar (relaxar)',1,0,4),pr('g','Espaço entre pedras',6,0,30,1,'%'),ps('co','Cores',0,O(['Sorteadas (A ↔ B)','Degradê horizontal','Degradê radial','Alternadas']))],p=>{
 const n=Math.round(p.n),r=rng(Math.round(p.sd)),S=[];for(let i=0;i<n;i++)S.push([r()*1.96-.98,r()*1.96-.98]);
 const cells=()=>S.map((s,i)=>{let q=rc(-1,-1,1,1);for(let j=0;j<n&&q.length>=3;j++){if(j===i)continue;const t=S[j];q=clipHP(q,t[0]-s[0],t[1]-s[1],(t[0]*t[0]+t[1]*t[1]-s[0]*s[0]-s[1]*s[1])/2)}return q});
 let C=cells();for(let k=0;k<Math.round(p.rx);k++){C.forEach((q,i)=>{if(q.length>=3)S[i]=centroid(q)});C=cells()}
 const rr=rng(Math.round(p.sd)+50),k=1-p.g/100*.6,o=[];
 C.forEach((q,i)=>{if(q.length<3)return;const c=centroid(q),q2=q.map(s=>[c[0]+(s[0]-c[0])*k,c[1]+(s[1]-c[1])*k]);
  const t=p.co===0?rr():p.co===1?(c[0]+1)/2:p.co===2?Math.min(1,Math.hypot(c[0],c[1])/1.3):i%2;o.push(fp(q2,mix(p.ca,p.cb,t)))});return o},{noRD:true});
pat('seigaiha','Ondas japonesas (seigaiha)',[...COL('1e5fa8','f1f8ff'),pr('c','Colunas',3,2,8),pr('k','Anéis por onda',3,2,6),pb('gd','Degradê por linha',1),pb('bg','Fundo (cor B)',1)],(p,n)=>{
 const c=Math.round(p.c),K=Math.round(p.k),R=1/c,o=[...bgRect(p)],rows=4*c+4,m=cn(n/2,14);
 for(let j=-1;j<rows;j++){const cy=-1+j*R/2,off=j%2?R:0;for(let i=-1;i<=c;i++){const cx=-1+i*2*R+off;
  for(let k=0;k<K;k++){const rr=R*(1-k/K),q=clipBox(circ(cx,cy,rr,rr,m),-1,-1,1,1);if(q.length<3)continue;
   const t=p.gd?Math.min(1,Math.max(0,(cy+1)/2)):0,col=k%2?p.cb:mix(p.ca,dk(p.ca,.45),t*.8);o.push(fp(q,col))}}}return o},{noRD:true,seg:true});
pat('cubes','Cubos isométricos',[...COL('7e57c2','ffca28'),pr('c','Colunas',4,2,10),ps('co','Cores',0,O(['Uma cor (3 tons)','Alternando A e B','Degradê vertical']))],p=>{
 const c=Math.round(p.c),R=2/(c*Math.sqrt(3)),W=Math.sqrt(3)*R,rows=Math.ceil(2/(1.5*R))+2,o=[];
 const V=(cx,cy,k)=>{const a=-Math.PI/2+k*Math.PI/3;return[cx+Math.cos(a)*R,cy+Math.sin(a)*R]};
 for(let j=-1;j<rows;j++)for(let i=-1;i<=c;i++){const cx=-1+i*W+(j%2?W/2:0),cy=-1+j*1.5*R;
  const base=p.co===1?((i+j)%2?p.cb:p.ca):p.co===2?mix(p.ca,p.cb,Math.min(1,Math.max(0,(cy+1)/2))):p.ca,
   F=[[[cx,cy],V(cx,cy,0),V(cx,cy,1),V(cx,cy,2)],[[cx,cy],V(cx,cy,2),V(cx,cy,3),V(cx,cy,4)],[[cx,cy],V(cx,cy,4),V(cx,cy,5),V(cx,cy,0)]],cols=[base,dk(base,.4),lt(base,.4)];
  F.forEach((q,k)=>{const cq=clipBox(q,-1,-1,1,1);if(cq.length>=3)o.push(fp(cq,cols[k]))})}return o},{noRD:true});
pat('truchet','Truchet (arcos)',[...COL('212121','ffeb3b'),pr('c','Colunas',6,2,16),pr('sd','Sorteio (semente)',4,1,99),ps('st','Estilo',0,O(['Quartos de círculo','Diagonais (labirinto)','Triângulos'])),pb('bg','Fundo (cor B)',1)],(p,n)=>{
 const c=Math.round(p.c),w=2/c,r=rng(Math.round(p.sd)),o=[...bgRect(p)],m=cn(n/4,6);
 for(let j=0;j<c;j++)for(let i=0;i<c;i++){const x=-1+i*w,y=-1+j*w,f=r()<.5;
  if(p.st===0){const cs=f?[[x,y,0],[x+w,y+w,Math.PI]]:[[x+w,y,Math.PI/2],[x,y+w,-Math.PI/2]];cs.forEach(([cx,cy,a0])=>o.push(fp([[cx,cy],...arc(cx,cy,w/2,w/2,a0,a0+Math.PI/2,m)],p.ca)))}
  else if(p.st===1){const t=w*.16,L=f?[[x,y],[x+w,y+w]]:[[x+w,y],[x,y+w]];const d=[L[1][0]-L[0][0],L[1][1]-L[0][1]],l=Math.hypot(d[0],d[1]),nx=-d[1]/l*t,ny=d[0]/l*t;o.push(fp(clipBox([[L[0][0]+nx,L[0][1]+ny],[L[1][0]+nx,L[1][1]+ny],[L[1][0]-nx,L[1][1]-ny],[L[0][0]-nx,L[0][1]-ny]],x,y,x+w,y+w),p.ca))}
  else o.push(fp(f?[[x,y],[x+w,y],[x,y+w]]:[[x+w,y],[x+w,y+w],[x,y+w]],p.ca))}return o},{noRD:true,seg:true});
pat('tartan','Xadrez escocês (tartan)',[...COL('b71c1c','1b5e20'),pr('c','Listras',6,3,16),pr('sd','Sorteio (semente)',2,1,99),pr('t','Largura das listras',30,10,60,5,'%'),pb('ln','Fios finos claros',1)],p=>{
 const k=Math.round(p.c),r=rng(Math.round(p.sd)),pos=[],w=2/k,o=[];const base=dk(p.cb,.2);
 const bands=[];for(let i=0;i<k;i++){const c0=-1+i*w,wd=w*(.25+r()*p.t/100*1.4);bands.push([c0,Math.min(1,c0+wd),r()<.5?p.ca:mix(p.ca,p.cb,.5)])}
 o.push(fp(rc(-1,-1,1,1),base,dk(base,.3)));
 bands.forEach(b=>{o.push(fp(rc(b[0],-1,b[1],1),mix(base,b[2],.55)));});
 bands.forEach(b=>{o.push(fp(rc(-1,b[0],1,b[1]),mix(base,b[2],.55)))});
 bands.forEach(a=>bands.forEach(b=>{o.push(fp(rc(a[0],b[0],a[1],b[1]),mix(base,mix(a[2],b[2],.5),.85)))}));
 if(p.ln)bands.forEach(b=>{o.push(P([[(b[0]+b[1])/2,-1],[(b[0]+b[1])/2,1]],{open:1,line:lt(p.cb,.7),t:.008}),P([[-1,(b[0]+b[1])/2],[1,(b[0]+b[1])/2]],{open:1,line:lt(p.cb,.7),t:.008}))});return o},{noRD:true});
pat('confetti','Confete',[...COL('e91e63','00bcd4'),pr('n','Quantidade',40,5,120),pr('sd','Sorteio (semente)',5,1,99),pr('s','Tamanho',30,10,70,5,'%'),pb('mx','Mais cores (arco-íris)',1),pb('bg','Fundo (cor B)',0)],(p,n)=>{
 const N=Math.round(p.n),r=rng(Math.round(p.sd)),o=[...bgRect(p)],pal=['e91e63','ffc107','00bcd4','8bc34a','7e57c2','ff7043'];
 for(let i=0;i<N;i++){const cx=r()*2-1,cy=r()*2-1,s=p.s/100*(.06+r()*.1),a=r()*TAU,ty=Math.floor(r()*4),col=p.mx?pal[Math.floor(r()*pal.length)]:mix(p.ca,p.cb,r());let q;
  if(ty===0)q=circ(0,0,s,s,cn(n/4,8));else if(ty===1)q=rc(-s,-s*.45,s,s*.45);else if(ty===2)q=[[0,-s],[s*.9,s*.7],[-s*.9,s*.7]];else q=starPts(5,.45,0,10).map(z=>[z[0]*s,z[1]*s]);
  q=rot(q,a).map(z=>[z[0]+cx,z[1]+cy]);q=clipBox(q,-1,-1,1,1);if(q.length>=3)o.push(fp(q,col))}return o},{noRD:true,seg:true});
pat('terrazzo','Terrazzo',[...COL('e57373','fff3e0'),pr('n','Pedaços',34,8,90),pr('sd','Sorteio (semente)',7,1,99),pr('s','Tamanho',55,20,100,5,'%'),pb('mx','Paleta variada',1)],p=>{
 const N=Math.round(p.n),r=rng(Math.round(p.sd)),o=[fp(rc(-1,-1,1,1),p.cb,dk(p.cb,.3))],pal=[p.ca,'455a64','ffb74d','80cbc4','9575cd','a1887f'];
 for(let i=0;i<N;i++){const cx=r()*2-1,cy=r()*2-1,R=p.s/100*(.05+r()*.12),k=5+Math.floor(r()*3),a0=r()*TAU,q=[];for(let j=0;j<k;j++){const a=a0+j*TAU/k+(r()-.5)*.7,rr=R*(.55+r()*.6);q.push([Math.cos(a)*rr+cx,Math.sin(a)*rr*(.7+r()*.3)+cy])}
  const cq=clipBox(q,-1,-1,1,1);if(cq.length>=3)o.push(fp(cq,p.mx?pal[Math.floor(r()*pal.length)]:mix(p.ca,'455a64',r()*.5)))}return o},{noRD:true});
const crescentPts=(R,r2,dx,m)=>{const x=(dx*dx+R*R-r2*r2)/(2*dx),y=Math.sqrt(Math.max(0,R*R-x*x)),t1=Math.atan2(y,x),o=[];
 for(let i=0;i<=m;i++){const a=t1+(TAU-2*t1)*i/m;o.push([Math.cos(a)*R,Math.sin(a)*R])}
 let f0=Math.atan2(-y,x-dx),f1=Math.atan2(y,x-dx);if(f0<0)f0+=TAU;if(f1<0)f1+=TAU;
 for(let i=1;i<m;i++){const a=f0+(f1-f0)*i/m;o.push([dx+Math.cos(a)*r2,Math.sin(a)*r2])}return o};
pat('stars','Céu estrelado',[...COL('ffee58','1a237e'),pr('n','Estrelas',22,4,80),pr('sd','Sorteio (semente)',3,1,99),pr('s','Tamanho',45,15,100,5,'%'),ps('fm','Forma',0,O(['Estrela de 5 pontas','Brilho (4 pontas)','Mistas'])),ps('mo','Lua',1,O(['Sem lua','Crescente','Cheia (com crateras)','Quarto'])),pr('mz','Tamanho da lua',100,50,160,5,'%'),pb('dt','Estrelinhas pontuais',1),pb('hl','Brilho em volta da lua',1)],(p,n)=>{
 const N=Math.round(p.n),r=rng(Math.round(p.sd)),o=[fp(rc(-1,-1,1,1),p.cb,dk(p.cb,.3))],m=cn(n,28),mz=p.mz/100,MC=[.52,-.5],MR=.27*mz,moonOn=p.mo>0;
 const moonCol=lt(p.ca,.55),glow=mix(p.cb,moonCol,.16),glow2=mix(p.cb,moonCol,.3);
 if(moonOn){
  if(p.hl){o.push(fp(circ(MC[0],MC[1],MR*1.9,MR*1.9,cn(n,24)),glow,null));o.push(fp(circ(MC[0],MC[1],MR*1.45,MR*1.45,cn(n,24)),glow2,null))}
  if(p.mo===1){const q=crescentPts(MR,MR*.86,MR*.62,m);o.push(fp(rot(q,-.5).map(z=>[z[0]+MC[0],z[1]+MC[1]]),moonCol,dk(moonCol,.2)))}
  else if(p.mo===3){const a=[];for(let i=0;i<=m;i++){const t=-Math.PI/2+Math.PI*i/m;a.push([Math.cos(t)*MR,Math.sin(t)*MR])}o.push(fp(rot([...a],-.35).map(z=>[z[0]+MC[0],z[1]+MC[1]]),moonCol,dk(moonCol,.2)))}
  else{o.push(fp(circ(MC[0],MC[1],MR,MR,cn(n,28)),moonCol,dk(moonCol,.2)));const cr=mix(moonCol,dk(p.cb,.0),.22);[[-.35,-.25,.2],[.28,-.1,.14],[-.05,.38,.17],[.4,.38,.08],[-.42,.22,.09]].forEach(([dx,dy,rr])=>o.push(fp(circ(MC[0]+dx*MR,MC[1]+dy*MR,rr*MR,rr*MR,cn(n/2,12)),cr,null)))}
 }
 for(let i=0;i<N;i++){const cx=r()*1.9-.95,cy=r()*1.9-.95,s=p.s/100*(.03+r()*.07),ty=p.fm===2?Math.floor(r()*2):p.fm,q=ty===0?starPts(5,.42,0,10):starPts(4,.22,0,8),a=r()*.6-.3;
  if(moonOn&&Math.hypot(cx-MC[0],cy-MC[1])<MR*2.1)continue;
  const qq=rot(q.map(z=>[z[0]*s,z[1]*s]),a).map(z=>[z[0]+cx,z[1]+cy]);if(qq.some(z=>Math.abs(z[0])>1||Math.abs(z[1])>1))continue;o.push(fp(qq,i%5===0?'ffffff':p.ca))}
 if(p.dt){const D=Math.round(N*1.6);for(let i=0;i<D;i++){const cx=r()*1.9-.95,cy=r()*1.9-.95,s=.008+r()*.012;if(moonOn&&Math.hypot(cx-MC[0],cy-MC[1])<MR*2.1)continue;o.push(fp(circ(cx,cy,s,s,6),mix(p.ca,'ffffff',.5),null))}}
 return o},{noRD:true});
function vorCells(N,seed,relax){const r=rng(seed),S=[];for(let i=0;i<N;i++)S.push([r()*1.96-.98,r()*1.96-.98]);
 const cells=()=>S.map((s,i)=>{let q=rc(-1,-1,1,1);for(let j=0;j<N&&q.length>=3;j++){if(j===i)continue;const t=S[j];q=clipHP(q,t[0]-s[0],t[1]-s[1],(t[0]*t[0]+t[1]*t[1]-s[0]*s[0]-s[1]*s[1])/2)}return q});
 let C=cells();for(let k=0;k<relax;k++){C.forEach((q,i)=>{if(q.length>=3)S[i]=centroid(q)});C=cells()}return C}
function spread(N,r,dmin,tries){const L=[];let t=0;while(L.length<N&&t++<N*tries){const x=r()*2.1-1.05,y=r()*2.1-1.05;if(L.every(q=>Math.hypot(q[0]-x,q[1]-y)>=dmin))L.push([x,y])}return L}
pat('spots','Manchas (vaca / leopardo)',[...COL('3e2723','ffe0b2'),pr('n','Manchas',9,2,30),pr('sd','Sorteio (semente)',4,1,99),pr('s','Tamanho',55,20,100,5,'%'),ps('st','Estilo',0,O(['Vaca (manchas cheias)','Leopardo (rosetas)','Girafa (poligonais)','Dálmata (pintinhas)']))],(p,n)=>{
 const N=Math.round(p.n),r=rng(Math.round(p.sd)),o=[fp(rc(-1,-1,1,1),p.cb,dk(p.cb,.3))],m=cn(n*1.5,28),sz=p.s/100;
 const blob=(cx,cy,R,amp,sx)=>{const ph=[r()*6.3,r()*6.3,r()*6.3,r()*6.3],q=[];for(let i=0;i<m;i++){const a=i/m*TAU,w=1+amp*(.55*Math.sin(2*a+ph[0])+.4*Math.sin(3*a+ph[1])+.22*Math.sin(4*a+ph[2])+.12*Math.sin(6*a+ph[3]));q.push([cx+Math.cos(a)*R*w*(sx||1),cy+Math.sin(a)*R*w])}return q};
 const add=(q,col)=>{const c=clipBox(q,-1,-1,1,1);if(c.length>=3)o.push(fp(c,col,null))};
 if(p.st===0){const R=sz*.46;spread(N,r,R*1.3,60).forEach(([x,y])=>{const big=r()<.35?1.25:.9;add(blob(x,y,R*big*(.75+r()*.5),.62,1.15),p.ca);if(r()<.4)add(blob(x+(r()-.5)*R*1.3,y+(r()-.5)*R*1.3,R*.3,.4),p.ca)})}
 else if(p.st===1){const R=sz*.36,ring=mix(p.ca,p.cb,.0),core=mix(p.cb,p.ca,.16);
  spread(N,r,R*1.75,80).forEach(([x,y])=>{const rr=R*(.85+r()*.3),gap=r()*TAU,gw=.5+r()*.45,A=[],B=[],M=Math.max(14,m),ph=r()*6,asp=.88+r()*.14,th=rr*.3;
   for(let i=0;i<=M;i++){const t=gap+gw+(TAU-gw*2)*i/M,e=Math.sin(Math.PI*i/M),w=1+.1*Math.sin(3*t+ph),ro=rr*w,ri=ro-th*(.55+.45*Math.min(1,e*2.2));A.push([x+Math.cos(t)*ro,y+Math.sin(t)*ro*asp]);B.push([x+Math.cos(t)*ri,y+Math.sin(t)*ri*asp])}
   add(circ(x,y,rr*.68,rr*.6,cn(n/2,14)),core);add([...A,...B.reverse()],ring)});
  const D=Math.round(N*4);for(let i=0;i<D;i++){const x=r()*2-1,y=r()*2-1;add(blob(x,y,R*.16*(.7+r()*.6),.3),p.ca)}}
 else if(p.st===2){const C=vorCells(Math.max(6,N*2),Math.round(p.sd)+7,2),k=1-.2*(1.1-sz*.7);C.forEach(q=>{if(q.length<3)return;const c=centroid(q),rr=r()*.25,col=mix(p.ca,p.cb,rr);add(q.map(s=>[c[0]+(s[0]-c[0])*k,c[1]+(s[1]-c[1])*k]),col)})}
 else{const R=sz*.085;spread(N*5,r,R*2.2,60).forEach(([x,y])=>{const rr=R*(.55+r()*.9);add(blob(x,y,rr,.12),p.ca)})}
 return o},{noRD:true,seg:true});
pat('arches','Arcos arco-íris (boho)',[...COL('e07a5f','f4f1de'),pr('c','Colunas',3,1,6),pr('r','Linhas',3,1,6),pr('k','Faixas',4,2,7),pb('gd','Degradê de cores',1),pb('bg','Fundo (cor B)',1)],(p,n)=>{
 const c=Math.round(p.c),r=Math.round(p.r),K=Math.round(p.k),w=2/c,h=2/r,o=[...bgRect(p)],m=cn(n/2,12);
 for(let j=0;j<r;j++)for(let i=0;i<c;i++){const cx=-1+w*(i+.5),R=Math.min(w/2,h*.9)*.92,by=-1+h*(j+1)-h*.04;
  for(let k=0;k<K;k++){const rr=R*(1-k/K),col=p.gd?mix(p.ca,'3d405b',k/K*.9):(k%2?p.cb:p.ca),q=[[cx-rr,by],...arc(cx,by,rr,rr,Math.PI,2*Math.PI,m).slice(1,-1),[cx+rr,by]];o.push(fp(q,col))}}return o},{noRD:true,seg:true});
pat('chevron','Chevron (espinha de peixe)',[...COL('00796b','ffffff'),pr('n','Faixas',7,2,20),pr('z','Dentes',4,1,10),pr('a','Altura do V',45,10,100,5,'%'),pb('bg','Fundo (cor B)',1),pb('gd','Degradê',0)],p=>{
 const k=Math.round(p.n),z=Math.round(p.z),o=[...bgRect(p)],step=2/k,am=step*p.a/100*1.2,th=step*.5;
 for(let j=-1;j<=k;j++){const cy=-1+step*(j+.5),L=[];for(let i=0;i<=z*2;i++)L.push([-1+i/z,cy+(i%2?am/2:-am/2)]);const q=clipBox(thickLine(L,th/2),-1,-1,1,1);if(q.length>=3)o.push(fp(q,p.gd?mix(p.ca,p.cb,Math.min(1,Math.max(0,j/k))):p.ca))}return o},{noRD:true});
pat('hexmosaic','Mosaico de pétalas (flor de hexágonos)',[...COL('ec407a','fce4ec'),pr('c','Colunas',4,2,9),pb('ou','Anel externo',1),pb('gd','Degradê',1)],(p,n)=>{
 const c=Math.round(p.c),R=2/(c*Math.sqrt(3)),W=Math.sqrt(3)*R,rows=Math.ceil(2/(1.5*R))+2,o=[fp(rc(-1,-1,1,1),p.cb,dk(p.cb,.3))];
 for(let j=-1;j<rows;j++)for(let i=-1;i<=c;i++){const cx=-1+i*W+(j%2?W/2:0),cy=-1+j*1.5*R,t=p.gd?Math.min(1,Math.max(0,(cy+1)/2)):((i+j)%2),hx=circ(cx,cy,R*.92,R*.92,6,-Math.PI/2),q=clipBox(hx,-1,-1,1,1);if(q.length>=3)o.push(fp(q,mix(p.ca,p.cb,t*.85)));
  if(p.ou){const q2=clipBox(circ(cx,cy,R*.45,R*.45,cn(n/4,10)),-1,-1,1,1);if(q2.length>=3)o.push(fp(q2,mix(p.ca,'ffffff',.35)))}}return o},{noRD:true});

pat('sunflower','Girassol (espiral áurea)',[...COL('f9a825','4e342e'),pr('n','Sementes',120,20,400,5),pr('s','Tamanho das sementes',60,20,100,5,'%'),ps('fm','Forma',0,O(['Círculo','Losango','Pétala'])),pb('gd','Degradê do centro à borda',1),pb('bg','Fundo (cor B)',1)],(p,n)=>{
 const N=Math.round(p.n),o=[...bgRect(p)],GA=Math.PI*(3-Math.sqrt(5)),R=.97,m=cn(n/4,8);
 for(let i=1;i<=N;i++){const rr=R*Math.sqrt(i/N),a=i*GA,cx=Math.cos(a)*rr,cy=Math.sin(a)*rr,sd=Math.min(.12,R*Math.sqrt(Math.PI/N)*.5*1.05)*p.s/100*1.6*Math.min(1,.45+.9*rr);
  let q;if(p.fm===1)q=rot([[0,-sd],[sd*.8,0],[0,sd],[-sd*.8,0]],a+Math.PI/2).map(z=>[z[0]+cx,z[1]+cy]);else if(p.fm===2)q=rot([[0,-sd*1.25],[sd*.65,0],[0,sd*1.25],[-sd*.65,0]].flatMap((z,k,A2)=>k%2?[z]:[z]),a+Math.PI/2).map(z=>[z[0]+cx,z[1]+cy]);else q=circ(cx,cy,sd,sd,m);
  o.push(fp(q,p.gd?mix(p.ca,lt(p.ca,.35),rr):mix(p.ca,p.cb,(i%2)*.4)))}return o},{noRD:true,seg:true});
pat('mandala','Mandala (rosácea)',[...COL('5e35b1','ffd54f'),pr('k','Pétalas',12,4,32,1),pr('l','Camadas',4,1,7),pb('gd','Degradê entre camadas',1),pb('ce','Miolo central',1),pb('bg','Fundo (cor B)',1)],(p,n)=>{
 const K=Math.round(p.k),L=Math.round(p.l),o=[...bgRect(p)],m=cn(n/3,8);
 for(let l=0;l<L;l++){const R=.98*(1-l/(L+.6)),rin=R*.18,col=p.gd?mix(p.ca,p.cb,l/Math.max(1,L-1)*.85):(l%2?p.cb:p.ca),off=(l%2?.5:0)*TAU/K;
  for(let i=0;i<K;i++){const a=-Math.PI/2+off+i*TAU/K,hw=Math.PI/K*.95,pts=[];for(let j=0;j<=m;j++){const t=j/m,w=Math.sin(Math.PI*t)**.8,rr=rin+(R-rin)*t,aa=a+(t<.5?-1:1)*0;pts.push([rr,w*hw*rr*.9])}
   const left=pts.map(z=>[z[0],-z[1]]),poly=[...pts.map(z=>[z[0],z[1]]),...left.reverse()].map(z=>[Math.cos(a)*z[0]-Math.sin(a)*z[1],Math.sin(a)*z[0]+Math.cos(a)*z[1]]);
   o.push(fp(poly,mix(col,'ffffff',l%2?.0:.12)))}}
 if(p.ce){o.push(fp(circ(0,0,.2,.2,cn(n/2,14)),p.cb));o.push(fp(circ(0,0,.1,.1,cn(n/3,10)),p.ca))}return o},{noRD:true,seg:true});
pat('sierp','Triângulo de Sierpinski',[...COL('d32f2f','fff3e0'),pr('d','Nível',3,1,5),pb('bg','Fundo (cor B)',1),pb('gd','Degradê por nível',0)],p=>{
 const D=Math.round(p.d),o=[...bgRect(p)],T0=[[-.98,.9],[.98,.9],[0,-.9]],mid=(a,b)=>[(a[0]+b[0])/2,(a[1]+b[1])/2];
 o.push(fp(T0,p.ca));
 const rec=(T,d)=>{if(d>D)return;const a=mid(T[0],T[1]),b=mid(T[1],T[2]),c=mid(T[2],T[0]);o.push(fp([a,b,c],p.gd?mix(p.cb,p.ca,(d-1)/D*.7):p.cb));if(d<D){rec([T[0],a,c],d+1);rec([a,T[1],b],d+1);rec([c,b,T[2]],d+1)}};
 rec(T0,1);return o},{noRD:true});
pat('memphis','Memphis anos 80',[...COL('ff4081','00e5ff'),pr('n','Formas',30,6,70),pr('sd','Sorteio (semente)',11,1,99),pr('s','Tamanho',50,20,100,5,'%'),pb('bg','Fundo (cor B)',1),pb('zz','Zigue-zagues',1)],(p,n)=>{
 const N=Math.round(p.n),r=rng(Math.round(p.sd)),o=[...bgRect(p)],pal=[p.ca,p.cb,'ffeb3b','7c4dff','212121','ffffff'],pts=[];
 for(let i=0;i<N;i++){const cx=r()*2-1,cy=r()*2-1,s=p.s/100*(.12+r()*.16),a=r()*TAU,col=pal[Math.floor(r()*pal.length)],ty=Math.floor(r()*(p.zz?6:5));let q,ln=false;
  if(ty===0)q=circ(0,0,s,s,cn(n/3,10));else if(ty===1)q=[[0,-s],[s*.95,s*.75],[-s*.95,s*.75]];else if(ty===2)q=rc(-s,-s*.5,s,s*.5);else if(ty===3)q=arc(0,0,s,s,0,Math.PI,cn(n/4,8));else if(ty===4)q=[[-s,0],[0,-s],[s,0],[0,s]];
  else{const L2=[];for(let j=0;j<=5;j++)L2.push([-s*1.2+j*s*.48,(j%2?s*.28:-s*.28)]);q=thickLine(L2,s*.16);}
  q=rot(q,a).map(z=>[z[0]+cx,z[1]+cy]);q=clipBox(q,-1,-1,1,1);if(q.length>=3)o.push(fp(q,col))}return o},{noRD:true,seg:true});
pat('octa','Mosaico de octógonos',[...COL('00838f','ffe082'),pr('c','Colunas',4,2,9),pr('g','Espaço entre as peças',6,0,30,1,'%'),ps('co','Cores',0,O(['Octógonos A, quadrados B','Alternando os octógonos','Com estrela dentro'])),pb('bg','Fundo (cor B)',1)],(p,n)=>{
 const c=Math.round(p.c),per=2/c,sd=per/(1+Math.SQRT2),k=1-p.g/100*.5,o=[...bgRect(p)];
 for(let j=-1;j<=c;j++)for(let i=-1;i<=c;i++){const cx=-1+per*(i+.5),cy=-1+per*(j+.5),ro=sd/2/Math.sin(Math.PI/8)*k;
  let q=clipBox(circ(cx,cy,ro,ro,8,-Math.PI/8-Math.PI/2+Math.PI/8*0).map((z,t)=>z),-1,-1,1,1);
  const oc=p.co===1?((i+j)%2?p.cb:p.ca):p.ca;if(q.length>=3)o.push(fp(q,oc));
  if(p.co===2){const st=clipBox(rot(starPts(8,.55,0,16),0).map(z=>[cx+z[0]*ro*.82,cy+z[1]*ro*.82]),-1,-1,1,1);if(st.length>=3)o.push(fp(st,p.cb))}
  const sx=cx+per/2,sy=cy+per/2,sr=sd/Math.SQRT2*k,sq=clipBox([[sx,sy-sr],[sx+sr,sy],[sx,sy+sr],[sx-sr,sy]],-1,-1,1,1);if(sq.length>=3)o.push(fp(sq,p.co===1?mix(p.ca,p.cb,.5):p.cb))}return o},{noRD:true});
pat('halftone','Meio-tom (halftone)',[...COL('212121','fff8e1'),pr('c','Colunas',10,4,24),pr('r','Linhas',10,4,24),ps('md','Gradiente',0,O(['Do canto (diagonal)','Do centro para fora','De cima para baixo','Da esquerda para a direita'])),pr('mn','Tamanho mínimo',10,0,60,5,'%'),pb('iv','Inverter',0),pb('bg','Fundo (cor B)',1)],(p,n)=>{
 const c=Math.round(p.c),r=Math.round(p.r),w=2/c,h=2/r,o=[...bgRect(p)],m=cn(n/3,10);
 for(let j=0;j<r;j++)for(let i=0;i<c;i++){const cx=-1+w*(i+.5),cy=-1+h*(j+.5);let t=p.md===0?((cx+cy)/4+.5):p.md===1?1-Math.min(1,Math.hypot(cx,cy)/1.3):p.md===2?(cy+1)/2:(cx+1)/2;if(p.iv)t=1-t;t=p.mn/100+(1-p.mn/100)*Math.min(1,Math.max(0,t));
  const rr=Math.min(w,h)/2*1.05*t;if(rr>.004)o.push(fp(circ(cx,cy,rr,rr,m),p.ca,null))}return o},{noRD:true,seg:true});

add('circle','b','Círculo / superelipse',[pr('e','Quadratura',0,0,100,5,'%','0 = círculo · 100 = quadrado de cantos suaves (squircle).'),pr('ov','Ovalado (inclinar o eixo)',0,0,100,5,'%','Estica um dos lados para formar um ovo/oval.')],(p,n)=>{const ex=2+p.e/100*6,m=cn(n,12),o=[];for(let i=0;i<m;i++){const t=i/m*TAU,c=Math.cos(t),s=Math.sin(t),x=Math.sign(c)*Math.pow(Math.abs(c),2/ex),y=Math.sign(s)*Math.pow(Math.abs(s),2/ex);o.push([x*(1-p.ov/100*.28*(y>0?0:-1)*0),y*(1+(y>0?-1:1)*p.ov/100*.12)*(1)+0])}return[P(o.map(q=>[q[0]*(1-p.ov/100*.22*Math.max(0,-q[1])),q[1]]))]},{seg:true});
add('semic','b','Segmento de círculo',[pr('h','Altura do segmento',50,10,100,5,'%'),pb('fl','Arco para baixo',0)],(p,n)=>{const h=p.h/100,m=cn(n*.7,10),R=(1+h*h)/(2*h),al=Math.asin(cl(1/R,-1,1));let pts=arc(0,R-h,R,R,-Math.PI/2-al,-Math.PI/2+al,m);if(h>1)pts=pts;return[P(p.fl?pts.map(q=>[q[0],-q[1]]):pts)]},{seg:true});
add('shield','s','Escudo',[ps('st','Estilo',0,O(['Heráldico','Medieval (liso)','Clássico (ponta alta)'])),ps('dv','Divisão',0,O(['Sem divisão','Cruz','Metade','Diagonal','Faixa central'])),pb('fr','Moldura interna',0)],(p,n)=>{const d=['M50 4 C62 12 78 14 92 14 V50 C92 76 70 90 50 98 C30 90 8 76 8 50 V14 C22 14 38 12 50 4 Z','M10 12 H90 V50 Q90 84 50 98 Q10 84 10 50 Z','M50 4 L90 16 V50 C90 76 70 90 50 98 C30 90 10 76 10 50 V16 Z'][p.st],o=PS(d,n);
 const O1=o[0].pts;if(p.fr)o.push(P(O1.map(q=>[q[0]*.8,(q[1]-.02)*.8]),{sub:1}));
 const ln=(a,b)=>P([a,b],{open:1,sub:1});if(p.dv===1)o.push(ln([0,-.9],[0,.9]),ln([-.86,-.15],[.86,-.15]));else if(p.dv===2)o.push(ln([0,-.9],[0,.96]));else if(p.dv===3)o.push(ln([-.86,-.8],[.86,.4]));else if(p.dv===4){o.push(ln([-.28,-.9],[-.28,.8]),ln([.28,-.9],[.28,.8]))}return o},{seg:true});
add('crown','s','Coroa',[pr('k','Pontas',5,3,9),pr('al','Altura das pontas',60,25,100,5,'%'),pb('bl','Bolinhas nas pontas',1),pb('jw','Joias na faixa',1),RD()],(p,n)=>{const k=Math.round(p.k),H=p.al/100,top=24+(1-H)*36,val=Math.min(72,top+40),xs=Array.from({length:k},(_,i)=>6+88*i/(k-1)),py=i=>top+Math.abs(i-(k-1)/2)/((k-1)/2)*10,pts=[[6,92]];
 xs.forEach((x,i)=>{if(i>0)pts.push([(xs[i-1]+x)/2,val]);pts.push([x,py(i)])});pts.push([94,92]);
 const o=[P(pts.map(q=>[q[0]/50-1,q[1]/50-1]))];if(p.bl)xs.forEach((x,i)=>o.push(P(C100(x,py(i)-5,5.5,12))));o.push(P(pp100('6 76 94 76'),{open:1,sub:1}));
 if(p.jw)xs.slice(0,k-1).forEach((x,i)=>o.push(P(C100((x+xs[i+1])/2,85,3.6,10),{sub:1})));return o},{seg:p=>!!p.bl,fit:true});
add('lock','s','Cadeado',[pr('h','Altura da argola',24,8,40,1,'%'),pb('op','Aberto',0),pb('kh','Buraco da chave',1),RD(20)],(p,n)=>{const h=p.h,t=60-h,body='M16 56 H84 Q90 56 90 62 V94 Q90 100 84 100 H16 Q10 100 10 94 V62 Q10 56 16 56 Z',sh=p.op?`M24 56 V${t} A26 26 0 0 1 76 ${t} V${t+14} H64 V${t} A14 14 0 0 0 36 ${t} V56 Z`:`M24 56 V${t} A26 26 0 0 1 76 ${t} V56 H64 V${t} A14 14 0 0 0 36 ${t} V56 Z`,o=[...PS(sh,n),...PS(body,n)];if(p.kh)o.push(P(C100(50,74,6.5,14),{sub:1}),P(pp100('46 78 54 78 56 90 44 90'),{sub:1}));return o},{seg:true,fit:true});
add('bolt','s','Raio (relâmpago)',[pr('w','Largura',100,50,130,5,'%'),pr('z','Inclinação',0,-30,30,5,'%'),RD()],p=>{const w=p.w/100,s=p.z/100;return[P(pp100('58 4 16 56 44 56 36 96 84 38 56 38').map(q=>[q[0]*w+s*(q[1]),q[1]]))]},{fit:true});

const redef=(id,cat,n,params,g,extra)=>{const i=SL.F.findIndex(s=>s.id===id),s=add(id,cat,n,params,g,extra);SL.F.pop();if(i>=0)SL.F[i]=s;else SL.F.push(s);return s};
function rdp(pts,tol){const n=pts.length;if(n<3)return pts.slice();const keep=new Array(n).fill(false);keep[0]=keep[n-1]=true;const st=[[0,n-1]];
 while(st.length){const[a,b]=st.pop();let md=0,mi=-1;const A=pts[a],B=pts[b],dx=B[0]-A[0],dy=B[1]-A[1],L=Math.hypot(dx,dy)||1e-9;for(let i=a+1;i<b;i++){const d=Math.abs((pts[i][0]-A[0])*dy-(pts[i][1]-A[1])*dx)/L;if(d>md){md=d;mi=i}}if(md>tol&&mi>0){keep[mi]=true;st.push([a,mi],[mi,b])}}
 return pts.filter((_,i)=>keep[i])}
function simpClosed(pts,tol){const n=pts.length;if(n<6)return pts;let j=0,bd=-1;for(let i=1;i<n;i++){const d=(pts[i][0]-pts[0][0])**2+(pts[i][1]-pts[0][1])**2;if(d>bd){bd=d;j=i}}
 const a=rdp(pts.slice(0,j+1),tol),b=rdp(pts.slice(j).concat([pts[0]]),tol);return a.concat(b.slice(1,-1))}
const tolOf=n=>Math.max(.0016,2.4/(n*n));
const cub=(a,b,c,d,k)=>Array.from({length:k+1},(_,i)=>{const t=i/k,u=1-t;return[u*u*u*a[0]+3*u*u*t*b[0]+3*u*t*t*c[0]+t*t*t*d[0],u*u*u*a[1]+3*u*u*t*b[1]+3*u*t*t*c[1]+t*t*t*d[1]]});
function ribbon(center,hw,bx0,by0,bx1,by1,step,closedC){
 const nx=Math.ceil((bx1-bx0)/step)+1,ny=Math.ceil((by1-by0)/step)+1,D=new Float32Array(nx*ny),S=[],nc=center.length;
 for(let i=0;i<(closedC?nc:nc-1);i++)S.push([center[i][0],center[i][1],center[(i+1)%nc][0],center[(i+1)%nc][1]]);
 for(let j=0;j<ny;j++)for(let i=0;i<nx;i++){const px=bx0+i*step,py=by0+j*step;let md=1e9;
  for(let s=0;s<S.length;s++){const q=S[s],dx=q[2]-q[0],dy=q[3]-q[1],L2=dx*dx+dy*dy||1e-12;let t=((px-q[0])*dx+(py-q[1])*dy)/L2;t=t<0?0:t>1?1:t;const ex=q[0]+dx*t-px,ey=q[1]+dy*t-py,d=ex*ex+ey*ey;if(d<md)md=d}
  D[j*nx+i]=Math.sqrt(md)-hw}
 const pos=new Map(),adj=new Map(),V=(i,j)=>D[j*nx+i];
 const hid=(i,j)=>j*nx+i,vid=(i,j)=>nx*ny+j*nx+i;
 const pt=(id)=>{if(pos.has(id))return;let i,j,i2,j2;if(id<nx*ny){j=Math.floor(id/nx);i=id%nx;i2=i+1;j2=j}else{const q=id-nx*ny;j=Math.floor(q/nx);i=q%nx;i2=i;j2=j+1}
  const a=V(i,j),b=V(i2,j2),t=a/(a-b);pos.set(id,[bx0+(i+(i2-i)*t)*step,by0+(j+(j2-j)*t)*step])};
 const link=(a,b)=>{pt(a);pt(b);if(!adj.has(a))adj.set(a,[]);if(!adj.has(b))adj.set(b,[]);adj.get(a).push(b);adj.get(b).push(a)};
 for(let j=0;j<ny-1;j++)for(let i=0;i<nx-1;i++){const a=V(i,j)<0,b=V(i+1,j)<0,c=V(i+1,j+1)<0,d=V(i,j+1)<0,m=(a?1:0)|(b?2:0)|(c?4:0)|(d?8:0);if(m===0||m===15)continue;
  const T=hid(i,j),B=hid(i,j+1),Lf=vid(i,j),R=vid(i+1,j),cen=(V(i,j)+V(i+1,j)+V(i+1,j+1)+V(i,j+1))/4<0;
  switch(m){case 1:case 14:link(Lf,T);break;case 2:case 13:link(T,R);break;case 3:case 12:link(Lf,R);break;case 4:case 11:link(R,B);break;case 6:case 9:link(T,B);break;case 7:case 8:link(Lf,B);break;
   case 5:if(cen){link(T,R);link(Lf,B)}else{link(Lf,T);link(R,B)}break;case 10:if(cen){link(Lf,T);link(R,B)}else{link(T,R);link(Lf,B)}break}}
 const seen=new Set(),loops=[];for(const[id]of adj){if(seen.has(id))continue;const lp=[];let cur=id,prev=-1;
  for(let g=0;g<200000;g++){seen.add(cur);lp.push(pos.get(cur));const nb=adj.get(cur);let nx2=nb[0]===prev?nb[1]:nb[0];if(nb.length<2||nx2===undefined)break;if(nx2===id)break;if(seen.has(nx2)&&nx2!==id)break;prev=cur;cur=nx2}
  if(lp.length>=4)loops.push(lp)}
 const area=Q=>Math.abs(area2(Q));loops.sort((a,b)=>area(b)-area(a));return loops}
const chaikin=(q,it)=>{let p=q;for(let k=0;k<it;k++){const o=[];for(let i=0;i<p.length;i++){const a=p[i],b=p[(i+1)%p.length];o.push([a[0]*.75+b[0]*.25,a[1]*.75+b[1]*.25],[a[0]*.25+b[0]*.75,a[1]*.25+b[1]*.75])}p=o}return p};
const area2=SL.area2;
function chord(poly,p,d){let tmin=1e9,tmax=-1e9;const n=poly.length;for(let i=0;i<n;i++){const a=poly[i],b=poly[(i+1)%n],e0=b[0]-a[0],e1=b[1]-a[1],den=d[0]*e1-d[1]*e0;if(Math.abs(den)<1e-9)continue;
  const t=((a[0]-p[0])*e1-(a[1]-p[1])*e0)/den,u=((a[0]-p[0])*d[1]-(a[1]-p[1])*d[0])/den;if(u>=0&&u<1){if(t<tmin)tmin=t;if(t>tmax)tmax=t}}
 return tmin>tmax?null:[[p[0]+d[0]*tmin,p[1]+d[1]*tmin],[p[0]+d[0]*tmax,p[1]+d[1]*tmax]]}

redef('rtri','b','Triângulo retângulo',[ps('c','Ângulo reto',0,O(['Embaixo à esquerda','Embaixo à direita','Em cima à esquerda','Em cima à direita'])),pr('cv','Hipotenusa curva',0,-60,60,5,'%','Positivo estufa a hipotenusa; negativo afunda.'),RD()],(p,n)=>{
 const T=[[[-1,1],[-1,-1],[1,1]],[[1,1],[1,-1],[-1,1]],[[-1,-1],[1,-1],[-1,1]],[[1,-1],[1,1],[-1,-1]]][p.c],R=T[0],A=T[1],B=T[2],cv=p.cv/100,pts=[R,A];
 if(Math.abs(cv)>=.004){const dx=B[0]-A[0],dy=B[1]-A[1],L=Math.hypot(dx,dy);let nx=dy/L,ny=-dx/L;const mx=(A[0]+B[0])/2,my=(A[1]+B[1])/2;if((mx-R[0])*nx+(my-R[1])*ny<0){nx=-nx;ny=-ny}
  const Q=[mx+nx*cv*L,my+ny*cv*L],m=cn(n/3,10);for(let j=1;j<m;j++){const t=j/m;pts.push([(1-t)*(1-t)*A[0]+2*(1-t)*t*Q[0]+t*t*B[0],(1-t)*(1-t)*A[1]+2*(1-t)*t*Q[1]+t*t*B[1]])}}
 pts.push(B);return[P(pts)]},{seg:p=>Math.abs(p.cv)>=1});

redef('poly2','b','Polígono estrelado',[pr('n','Pontas',7,5,24),pr('k','Salto',3,2,11,1,'','Une pontos saltando k posições: {7/3}, {8/3}, {5/2}… Se n e k têm divisor comum, vira composto (várias figuras).')],p=>{
 const n=Math.round(p.n),k=Math.min(Math.round(p.k),Math.floor((n-1)/2)||2),V=circ(0,0,1,1,n),g=(function gcd(a,b){return b?gcd(b,a%b):a})(n,k),o=[];
 for(let s=0;s<g;s++){const pts=[];for(let i=0;i<n/g;i++)pts.push(V[(s+i*k)%n]);o.push(P(pts,{sub:s>0?1:0}))}return o},{open:true,fit:false});

redef('arch','b','Arco / portal',[pr('r','Curva do topo',100,20,100,5,'%'),pr('fr','Moldura interna',0,0,40,2,'%','0 = sem moldura; senão faz o vão do portal.'),RD()],(p,n)=>{
 const r=p.r/100,m=cn(n/2,8),mk=(w,y0,rr)=>[[-w,1],[-w,y0+rr],...arc(0,y0+rr,w,rr,Math.PI,TAU,m).slice(1,-1),[w,y0+rr],[w,1]];
 const o=[P(mk(1,-1,r))];if(p.fr>0){const t=p.fr/50,w=1-t;o.push(P(mk(w,-1+t,Math.max(.05,r-t*.6)),{sub:1}))}return o},{seg:true});

redef('lock','s','Cadeado',[pr('h','Altura da argola',24,8,40,1,'%'),pr('t','Espessura da argola',11,6,18,1,'%'),pr('br','Cantos do corpo',12,0,30,1,'%'),pb('op','Aberto',0),pb('kh','Buraco da chave',1)],(p,n)=>{
 const th=p.t,R=26,cyc=50-p.h-(p.op?8:0),e=p.op?cyc+(50-cyc)*.3:50,r=p.br,x0=12,x1=88,y0=50,y1=96,
  sh=`M24 50 V${cyc} A${R} ${R} 0 0 1 76 ${cyc} V${e} H${76-th} V${cyc} A${R-th} ${R-th} 0 0 0 ${24+th} ${cyc} V50 Z`,
  body=r<=0?`M${x0} ${y0} H${x1} V${y1} H${x0} Z`:`M${x0+r} ${y0} H${x1-r} A${r} ${r} 0 0 1 ${x1} ${y0+r} V${y1-r} A${r} ${r} 0 0 1 ${x1-r} ${y1} H${x0+r} A${r} ${r} 0 0 1 ${x0} ${y1-r} V${y0+r} A${r} ${r} 0 0 1 ${x0+r} ${y0} Z`,
  o=[...PS(sh,n),...PS(body,n)];
 if(p.kh)o.push(...PS('M50 62 A7 7 0 0 1 54.2 74.6 L57 87 H43 L45.8 74.6 A7 7 0 0 1 50 62 Z',n,{sub:1}));return o},{seg:true,fit:true});

redef('circle','b','Círculo / superelipse',[pr('e','Quadratura',0,0,100,5,'%','0 = círculo · 100 = quadrado de cantos suaves (squircle).'),pr('ov','Ovalado (ovo)',0,0,100,5,'%','Afina o topo e deixa a base mais larga, como um ovo.')],(p,n)=>{
 const ex=2+p.e/100*6,k=p.ov/100*.38,N=360,o=[];for(let i=0;i<N;i++){const t=i/N*TAU,c=Math.cos(t),s=Math.sin(t),x=Math.sign(c)*Math.pow(Math.abs(c),2/ex),y=Math.sign(s)*Math.pow(Math.abs(s),2/ex),u=(y+1)/2;o.push([x*(1-k*Math.pow(1-u,1.15)),y])}
 return[P(simpClosed(o,tolOf(n)*.5))]},{seg:true});

redef('shield','s','Escudo',[ps('st','Estilo',0,O(['Heráldico','Medieval (liso)','Clássico (ponta alta)'])),ps('dv','Divisão',0,O(['Sem divisão','Cruz','Metade','Diagonal','Faixa central'])),pb('fr','Moldura interna',0)],(p,n)=>{
 const d=['M50 4 C62 12 78 14 92 14 V50 C92 76 70 90 50 98 C30 90 8 76 8 50 V14 C22 14 38 12 50 4 Z','M10 12 H90 V50 Q90 84 50 98 Q10 84 10 50 Z','M50 4 L90 16 V50 C90 76 70 90 50 98 C30 90 10 76 10 50 V16 Z'][p.st],o=PS(d,n),O1=o[0].pts;
 if(p.fr)o.push(P(O1.map(q=>[q[0]*.8,(q[1]-.02)*.8]),{sub:1}));
 const ln=(pp,dd)=>{const c=chord(O1,pp,dd);if(c)o.push(P(c,{open:1,sub:1}))};
 if(p.dv===1){ln([0,0],[0,1]);ln([0,-.15],[1,0])}else if(p.dv===2)ln([0,0],[0,1]);else if(p.dv===3)ln([0,-.2],[1,.6/1.72*1]);else if(p.dv===4){ln([-.28,0],[0,1]);ln([.28,0],[0,1])}return o},{seg:true});

redef('ring','b','Anel',[pr('t','Espessura',30,5,90,5,'%'),pr('seg','Partes (anel segmentado)',1,1,16),when(pr('gp','Vão entre as partes',10,2,80,2,'°'),v=>v.seg>1),pr('ar','Abertura (arco)',0,0,340,5,'°','Tira um pedaço do anel: 0° = anel completo; quanto maior, menor o arco (vale também para as partes).')],(p,n)=>{
 const t=p.t/100,ri=1-t,k=Math.round(p.seg),ar=rad(p.ar),S=TAU-ar,a0=-Math.PI/2+ar/2,gp=k>1?rad(p.gp):0,w=S/k,open=p.ar>0;
 if(k>1||open){const o=[];for(let i=0;i<k;i++){const s0=a0+i*w+((open&&i===0)?0:gp/2),s1=a0+(i+1)*w-((open&&i===k-1)?0:gp/2),mm=Math.max(4,Math.round(cn(n,12)*(s1-s0)/TAU));o.push(P([...arc(0,0,1,1,s0,s1,mm),...arc(0,0,ri,ri,s1,s0,mm)]))}return o}
 const m=cn(n,12);return[P(circ(0,0,1,1,m)),P(circ(0,0,ri,ri,m),{sub:1})]},{seg:true,fit:false});

SL.F.find(s=>s.id==='pie').fit=false;

(()=>{const s=SL.F.find(x=>x.id==='cube');s.P=s.P.filter(q=>q.k!=='ed')})();

redef('lens','b','Lente / gota dupla',[pr('c','Curvatura',100,10,100,5,'%','Quanto a lente se abre (altura em relação à largura).'),pb('v','Vertical',0)],(p,n)=>{
 const c=p.c/100,m=cn(n/2,10),top=Array.from({length:m+1},(_,i)=>{const t=i/m*2-1;return[t,-(1-t*t)*c]}),bot=Array.from({length:m+1},(_,i)=>{const t=1-i/m*2;return[t,(1-t*t)*c]});
 const pts=[...top,...bot.slice(1,-1)];return[P(p.v?pts.map(q=>[q[1],q[0]]):pts)]},{seg:true,fit:false});

redef('pill','b','Cápsula / pílula',[pr('h','Altura',55,20,100,5,'%'),pb('dv','Divisória no meio',0),RD(100)],p=>{
 const h=p.h/100,o=[P([[-1,-h],[1,-h],[1,h],[-1,h]])];if(p.dv)o.push(P([[0,-h],[0,h]],{open:1,sub:1}));return o},{fit:false});

redef('infin','s','Infinito',[pr('t','Espessura',14,6,30,1,'%')],(p,n)=>{
 const N=220,C=[],hw=p.t/100*.6;for(let i=0;i<N;i++){const t=i/N*TAU,d=1+Math.sin(t)*Math.sin(t);C.push([Math.cos(t)/d,Math.sin(t)*Math.cos(t)/d*1.35])}
 const lp=ribbon(C,hw,-1-hw-.06,-.7-hw,1+hw+.06,.7+hw,.011,true);if(!lp.length)return[P(C)];
 const tl=tolOf(n)*.7;return lp.map((q,i)=>P(simpClosed(chaikin(q,1),tl),{sub:i>0?1:0}))},{seg:true});

redef('splash','o','Respingo de tinta',[pr('s','Semente',5,1,999),pr('b','Gotas',8,0,20),pr('sp','Espalhamento',60,20,100,5,'%'),pr('v','Pontas do centro',8,4,16)],(p,n)=>{
 const rr=rng(p.s*3.7+2),k=Math.round(p.v),sp=[];
 for(let i=0;i<k;i++){const a=(i+(rr()-.5)*.55)/k*TAU;sp.push({a,L:.22+rr()*.36,w:.18+rr()*.12,pw:1.6+rr()*1.8})}
 const body=[],N=420;for(let j=0;j<N;j++){const th=j/N*TAU;let r=.46*(1+.07*Math.sin(3*th+p.s)+.05*Math.sin(5*th+2*p.s));
  sp.forEach(s=>{const d=Math.atan2(Math.sin(th-s.a),Math.cos(th-s.a)),u=Math.max(0,1-Math.abs(d)/s.w);r+=s.L*Math.pow(u,s.pw)});body.push([Math.cos(th)*r,Math.sin(th)*r])}
 const o=[P(simpClosed(body,tolOf(n)*.6))],nb=Math.round(p.b);
 for(let i=0;i<nb;i++){const s=sp[i%k],a=s.a+(rr()-.5)*.3,d=.46+s.L+.1+rr()*.32*p.sp/100,r=.03+rr()*.06*(1.15-d*.45),q=[],mm=16;
  for(let j=0;j<mm;j++){const f=j/mm*TAU,ro=r*(1+1.5*Math.pow(Math.max(0,Math.cos(f)),5)),ang=a+Math.PI+f;q.push([Math.cos(a)*d+Math.cos(ang)*ro,Math.sin(a)*d+Math.sin(ang)*ro])}o.push(P(q))}
 return o},{seg:true,fit:true});

redef('blob','o','Blob orgânico',[pr('s','Semente',12,1,999,1,'','Cada número gera um blob diferente.'),pr('k','Pontos de controle',8,3,16),pr('v','Irregularidade',48,0,80,1,'%'),pr('el','Alongamento',0,-60,60,5,'%'),ps('st','Estilo',0,O(['Macio','Pedra (facetado suave)','Ameba (pseudópodes)'])),pr('hl','Furos',0,0,3),pb('sat','Gotas ao redor',0)],(p,n)=>{
 const rr=rng(p.s*7.31+1),k=Math.round(p.k),v=p.v/100,N=300;
 const harm=(cx,cy,sc,vv,H,pw)=>{const ph=[],am=[];let S=0;for(let h=1;h<=H;h++){ph.push(rr()*TAU);const a=(.35+rr()*.65)/Math.pow(h,pw);am.push(a);S+=a}
  const q=[];for(let i=0;i<N;i++){const t=i/N*TAU;let f=0;for(let h=0;h<H;h++)f+=am[h]*Math.cos((h+1)*t+ph[h]);const r=Math.max(.28,1+vv*1.1*f/S);q.push([cx+Math.cos(t)*r*sc,cy+Math.sin(t)*r*sc])}return q};
 let pts;if(p.st===1){const ctl=[];for(let i=0;i<k;i++){const a=(i+(rr()-.5)*.5)/k*TAU,r=1-v*.7*rr();ctl.push([Math.cos(a)*r,Math.sin(a)*r])}pts=chaikin(ctl,3)}
 else if(p.st===2)pts=harm(0,0,1,v*.95,Math.max(3,Math.min(8,k)),.62);else pts=harm(0,0,1,v,Math.max(2,Math.min(6,Math.round(k/2))),1.05);
 const el=p.el/100;pts=pts.map(q=>[q[0]*(1+el),q[1]*(1-el*.55)]);const bb=bbox(pts),sc=Math.max(bb.w,bb.h)/2;pts=pts.map(q=>[(q[0]-bb.cx)/sc,(q[1]-bb.cy)/sc]);
 const o=[P(simpClosed(pts,tolOf(n)*.55))],hl=Math.round(p.hl);
 for(let i=0;i<hl;i++){const a=rr()*TAU,d=.18+rr()*.28,r=.1+rr()*.1;o.push(P(simpClosed(harm(Math.cos(a)*d,Math.sin(a)*d,r,.25,3,1),tolOf(n)*.8),{sub:1}))}
 if(p.sat)for(let i=0;i<3;i++){const a=rr()*TAU,d=1.2+rr()*.25,r=.07+rr()*.08;o.push(P(simpClosed(harm(Math.cos(a)*d,Math.sin(a)*d,r,.18,3,1),tolOf(n)*1.2)))}
 return o},{seg:true,fit:p=>!p.sat});

redef('mount','n','Montanhas',[pr('k','Picos',3,1,5),pr('s','Semente',4,1,99),pr('v','Variação de altura',40,0,80,5,'%'),pb('sn','Neve nos picos',1),RD()],(p,n)=>{
 const k=Math.round(p.k),r=rng(p.s*5.3+1),pk=[];for(let i=0;i<k;i++){const x=k===1?50:12+76*i/(k-1)+(r()-.5)*10*(k>1),h=70-p.v/100*50*r()-(i%2?6:0);pk.push([x,100-h])}
 const pts=[[0,100]];pk.forEach((q,i)=>{if(i>0){const a=pk[i-1];pts.push([(a[0]+q[0])/2+(r()-.5)*4,Math.max(a[1],q[1])+Math.min(100-a[1],100-q[1])*.45])}pts.push(q)});pts.push([100,100]);
 const o=[P(pts.map(q=>[q[0]/50-1,q[1]/50-1]))];
 if(p.sn)pk.forEach(q=>{const dep=Math.min(16,(100-q[1])*.3),y=q[1]+dep;if(dep<4)return;let xl=-1e9,xr=1e9;
  for(let i=0;i<pts.length;i++){const a=pts[i],b=pts[(i+1)%pts.length];if((a[1]-y)*(b[1]-y)>0||a[1]===b[1])continue;const x=a[0]+(b[0]-a[0])*(y-a[1])/(b[1]-a[1]);if(x<q[0]&&x>xl)xl=x;if(x>q[0]&&x<xr)xr=x}
  if(xl<-1e8||xr>1e8)return;const tn=3,zz=[[xl,y]];for(let j=0;j<tn;j++){const x0=xl+(xr-xl)*j/tn,x1=xl+(xr-xl)*(j+1)/tn;zz.push([x0+(x1-x0)*.5,y+dep*.55],[x1,y])}
  o.push(P(zz.map(s=>[s[0]/50-1,s[1]/50-1]),{open:1,sub:1}))});
 return o},{fit:true});

redef('pencilS','s','Lápis',[pr('pt','Ponta',30,10,50,2,'%','Comprimento do cone de madeira.'),pb('bo','Borracha',1)],p=>{
 const hw=.17,tl=2*p.pt/100,xt=1-tl,xf=xt+tl*.68,xe=p.bo?-.78:-1,o=[],R=a=>rot(a,rad(135));
 if(p.bo){o.push(P(R([[-1,-hw+.04],[-.9,-hw],[xe,-hw],[xe,hw],[-.9,hw],[-1,hw-.04]])));o.push(P(R([[xe,-hw],[-.68,-hw],[-.68,hw],[xe,hw]])))}
 o.push(P(R([[p.bo?-.68:-1,-hw],[xt,-hw],[xt,hw],[p.bo?-.68:-1,hw]])));
 o.push(P(R([[xt,-hw],[1,0],[xt,hw]])));o.push(P(R([[xf,-hw*.32],[1,0],[xf,hw*.32]])));
 o.push(P(R([[p.bo?-.62:-.94,0],[xt-.04,0]]),{open:1,sub:1}));return o},{fit:true});

function headSeq(cx,cy,rx,ry,deg,xb,w,m){const r=rad(deg),c=Math.cos(r),s=Math.sin(r),pts=[];for(let i=0;i<m;i++){const t=i/m*TAU,x=Math.cos(t)*rx,y=Math.sin(t)*ry;pts.push([cx+x*c-y*s,cy+x*s+y*c])}
 let ex=-1e9;pts.forEach(q=>{if(q[0]>ex)ex=q[0]});const XB=ex-.8,XA=XB-w;let sA=-1,sB=-1,A=null,B=null;
 for(let i=Math.floor(m/2);i<m;i++){const a=pts[i],b=pts[(i+1)%m];const cr=X=>(a[0]-X)*(b[0]-X)<=0&&a[0]!==b[0];
  if(sA<0&&cr(XA)){sA=i;A=[XA,a[1]+(b[1]-a[1])*(XA-a[0])/(b[0]-a[0])]}else if(sA>=0&&sB<0&&cr(XB)){sB=i;B=[XB,a[1]+(b[1]-a[1])*(XB-a[0])/(b[0]-a[0])]}}
 if(sA<0||sB<0)return null;const loop=[B];for(let i=sB+1;i<m;i++)loop.push(pts[i]);for(let i=0;i<=sA;i++)loop.push(pts[i]);loop.push(A);return{loop,A,B,XA,XB}}
const U=a=>a.map(q=>[q[0]/50-1,q[1]/50-1]);
redef('note','s','Nota musical',[ps('t','Tipo',0,O(['Colcheia','Semínima','Duas colcheias (ligadas)','Clave de sol (simplificada)'])),pr('hd','Tamanho da cabeça',100,70,130,5,'%')],(p,n)=>{
 const m=Math.max(28,n),hs=p.hd/100;
 if(p.t===3){const Q=[[41,90],[43,96],[50,96],[53,89],[52,76],[51,60],[51,44],[52,28],[56,12],[58,5],[65,12],[64,25],[55,35],[45,42],[37,54],[38,68],[48,77],[60,73],[65,61],[59,50],[49,50],[44,58],[48,65],[54,62]];
  const C=crOpen(Q,10),lp=ribbon(C.map(q=>[q[0]/50-1,q[1]/50-1]),.07,-.75,-1.1,.75,1.1,.012,false);return lp.map((q,i)=>P(simpClosed(chaikin(q,1),tolOf(n)*.8),{sub:i>0?1:0}))}
 if(p.t===2){const a=headSeq(26,80,15*hs,11*hs,-20,0,6.5,m),b=headSeq(72,70,15*hs,11*hs,-20,0,6.5,m);if(!a||!b)return[];const bw=11,t1=24,t2=10;
  return[P(U([...a.loop,[a.XA,t1],[b.XB,t2],...b.loop,[b.XA,t2+bw],[a.XB,t1+bw]]))]}
 const a=headSeq(34,80,17*hs,12*hs,-20,0,6.5,m);if(!a)return[];
 if(p.t===1)return[P(U([...a.loop,[a.XA,8],[a.XB,8]]))];
 const x=a.XB,fl=[...cub([x,8],[x+2,24],[x+31,30],[x+25,58],10),...cub([x+25,58],[x+20,42],[x+10,38],[x,36],8).slice(1)];
 return[P(U([...a.loop,[a.XA,8],...fl]))]},{seg:true,fit:true});

redef('key','s','Chave',[pr('d','Dentes',3,0,6),pb('hl','Furo da argola',1)],(p,n)=>{
 const d=Math.round(p.d),cx=28,cy=50,R=23,hh=6,jx=cx+Math.sqrt(R*R-hh*hh),tipX=97,pitch=d>0?Math.min(13,(tipX-jx-6)/(d+.2)):0,tw=pitch*.56,H=[15,10,14,9,13,8],pts=[[jx,cy-hh],[tipX,cy-hh],[tipX,cy+hh]];
 for(let i=0;i<d;i++){const xr=tipX-(i===0?0:i*pitch)-(i===0?0:0),xr2=i===0?tipX:tipX-i*pitch,xl=xr2-tw,h=H[i%6];pts.push([xr2,cy+hh],[xr2,cy+hh+h],[xl,cy+hh+h],[xl,cy+hh])}
 pts.push([jx,cy+hh]);const a0=Math.atan2(hh,jx-cx),a1=TAU-a0,mm=Math.max(10,Math.round(n*.7));for(let i=1;i<mm;i++){const a=a0+(a1-a0)*i/mm;pts.push([cx+Math.cos(a)*R,cy+Math.sin(a)*R])}
 const o=[P(U(pts))];if(p.hl)o.push(P(C100(cx,cy,9,cn(n/2,14)),{sub:1}));return o},{seg:true,fit:true});

redef('minus','s','Menos',[pr('t','Espessura',30,8,80,2,'%'),RD()],p=>[P([[-1,-p.t/100],[1,-p.t/100],[1,p.t/100],[-1,p.t/100]])],{fit:false});

redef('bell','s','Sino',[pr('w','Abertura',100,70,120,5,'%','Largura da boca (saia) do sino.'),pb('cl','Badalo',1)],(p,n)=>{
 const k=p.w/100,e=a=>50+a*k,d=`M50 6 C56 6 58 10 58 15 C72 19 80 32 80 50 C80 66 ${e(36)} 72 ${e(42)} 79 H${50-42*k} C${50-36*k} 72 20 66 20 50 C20 32 28 19 42 15 C42 10 44 6 50 6 Z`;
 return[...PS(d,n),...(p.cl?[P(circ(0,.82,.16,.12,cn(n/2,10)))]:[])]},{seg:true,fit:false});

redef('carrow','s','Seta circular',[pr('gap','Abertura',70,20,200,5,'°'),pr('t','Espessura',24,8,50,1,'%'),pb('db','Seta dupla (reciclar)',0),RD()],(p,n)=>{
 const t=p.t/100,m=Math.max(12,Math.round(n*.8)),k=1/(1+t*.55);
 const one=(a0,a1)=>{const ha=cl(t*2.3,.34,.95),bs=a1-ha,o=[],C=[Math.cos(a0)*(1-t/2),Math.sin(a0)*(1-t/2)],cr=t/2;
  for(let j=0;j<=8;j++){const f=a0+Math.PI+Math.PI*j/8;o.push([C[0]+Math.cos(f)*cr,C[1]+Math.sin(f)*cr])}
  for(let i=1;i<=m;i++){const a=a0+(bs-a0)*i/m;o.push([Math.cos(a),Math.sin(a)])}
  o.push([Math.cos(bs)*(1+t*.55),Math.sin(bs)*(1+t*.55)],[Math.cos(a1)*(1-t/2),Math.sin(a1)*(1-t/2)],[Math.cos(bs)*(1-t-t*.55),Math.sin(bs)*(1-t-t*.55)]);
  for(let i=m;i>=1;i--){const a=a0+(bs-a0)*i/m;o.push([Math.cos(a)*(1-t),Math.sin(a)*(1-t)])}
  return P(o.map(q=>[q[0]*k,q[1]*k]))};
 if(p.db){const gp=rad(Math.min(p.gap,80))*.5;return[one(-Math.PI/2+gp,Math.PI/2-gp),one(Math.PI/2+gp,Math.PI*1.5-gp)]}
 return[one(-Math.PI/2+rad(p.gap)/2,Math.PI*1.5-rad(p.gap)/2)]},{seg:true,fit:false});

pat('gingham','Vichy (gingham)',[...COL('d32f2f','ffffff'),pr('c','Quadrados',8,2,24),pr('k','Intensidade das faixas',45,15,85,5,'%')],(p,n)=>{
 const c=Math.round(p.c),w=2/c,o=[],mid=mix(p.cb,p.ca,p.k/100);
 for(let j=0;j<c;j++)for(let i=0;i<c;i++){const a=i%2===0,b=j%2===0;o.push(fp(rc(-1+i*w,-1+j*w,-1+(i+1)*w,-1+(j+1)*w),a&&b?p.ca:(a||b)?mid:p.cb))}
 return o});
pat('camo','Camuflagem',[...COL('556b2f','d2c29a'),pr('n','Manchas por camada',14,4,40),pr('k','Camadas',3,1,4),pr('s','Tamanho',50,20,100,5,'%'),pr('sd','Sorteio (semente)',4,1,99)],(p,n)=>{
 const r=rng(Math.round(p.sd)*5.3+1),K=Math.round(p.k),N=Math.round(p.n),m=cn(n/2,28),o=[fp(rc(-1,-1,1,1),p.cb,dk(p.cb,.3))];
 const cols=[mix(p.cb,p.ca,.5),p.ca,dk(p.ca,.5),dk(p.ca,.78)];
 const blob=(cx,cy,R)=>{const ph=[r()*6.3,r()*6.3,r()*6.3],asp=.5+r()*.5,rt=r()*Math.PI,q=[];for(let i=0;i<m;i++){const a=i/m*TAU,w=1+.34*Math.sin(2*a+ph[0])+.22*Math.sin(3*a+ph[1])+.12*Math.sin(5*a+ph[2]),x=Math.cos(a)*R*w,y=Math.sin(a)*R*w*asp;q.push([cx+x*Math.cos(rt)-y*Math.sin(rt),cy+x*Math.sin(rt)+y*Math.cos(rt)])}return q};
 for(let l=0;l<K;l++){const cnt=Math.round(N*(l?.8:1)),R=.4*p.s/100*(1-l*.1);for(let i=0;i<cnt;i++){const q=clipBox(blob(r()*2.2-1.1,r()*2.2-1.1,R*(.6+r()*.8)),-1,-1,1,1);if(q.length>=3)o.push(fp(q,cols[l]))}}
 return o},{noRD:true,seg:true});
pat('quatre','Quadrifólio (marroquino)',[...COL('1565c0','e3f2fd'),pr('c','Colunas',3,1,8),pr('l','Lóbulos',4,3,8),pr('v','Vinco entre lóbulos',55,0,100,5,'%'),pb('mi','Miolo central',1),pb('gp','Estrelas nos vãos',1),pb('bg','Fundo (cor B)',1)],(p,n)=>{
 const c=Math.round(p.c),L=Math.round(p.l),w=2/c,R=w/2*.985,o=[...bgRect(p)],s=Math.sin(Math.PI/L),M=cn(n*1.5,96);
 let rho=R*(.62-.2*p.v/100);rho=Math.min(Math.max(rho,R*s/(1+s)*1.03),R*.9);const d=R-rho;
 const quat=(cx,cy)=>{const q=[];for(let i=0;i<M;i++){const t=i/M*TAU;let best=0;for(let k=0;k<L;k++){const dl=t-(-Math.PI/2+k*TAU/L),sn=d*Math.sin(dl);if(Math.abs(sn)<=rho){const rr=d*Math.cos(dl)+Math.sqrt(rho*rho-sn*sn);if(rr>best)best=rr}}q.push([cx+Math.cos(t)*best,cy+Math.sin(t)*best])}return q};
 const put=(q,col)=>{const z=clipBox(q,-1,-1,1,1);if(z.length>=3)o.push(fp(z,col))};
 if(p.gp)for(let j=0;j<=c;j++)for(let i=0;i<=c;i++)put(starPts(4,.34,0,8).map(q=>[-1+i*w+q[0]*R*.62,-1+j*w+q[1]*R*.62]),mix(p.ca,p.cb,.55));
 for(let j=0;j<c;j++)for(let i=0;i<c;i++){const cx=-1+w*(i+.5),cy=-1+w*(j+.5);put(quat(cx,cy),p.ca);
  if(p.mi){put(circ(cx,cy,R*.34,R*.34,cn(n/3,18)),p.cb);put(circ(cx,cy,R*.15,R*.15,cn(n/4,12)),p.ca)}}
 return o},{noRD:true,seg:true});
pat('ogee','Arcos ogivais (escamas góticas)',[...COL('6a1b9a','f3e5f5'),pr('c','Colunas',4,2,10),pr('a','Altura do arco',150,90,220,5,'%'),pr('s','Ombro reto',25,0,60,5,'%'),ps('co','Cores',0,O(['Fileiras alternadas','Degradê vertical'])),pb('bg','Fundo (cor B)',1)],(p,n)=>{
 const c=Math.round(p.c),w=2/c,H=w*p.a/100,rh=H*.5,sh=H*p.s/100,m=cn(n/8,8),o=[...bgRect(p)];
 const tile=(cx,yb)=>{const q=[[cx-w/2,yb],[cx-w/2,yb-sh]];for(let t=1;t<m;t++){const u=t/m;q.push([cx-w/2*Math.pow(Math.cos(u*Math.PI/2),.85),yb-sh-u*(H-sh)])}q.push([cx,yb-H]);for(let t=m-1;t>=1;t--){const u=t/m;q.push([cx+w/2*Math.pow(Math.cos(u*Math.PI/2),.85),yb-sh-u*(H-sh)])}q.push([cx+w/2,yb-sh],[cx+w/2,yb]);return q};
 const rows=Math.ceil(2/rh)+3;
 for(let j=0;j<rows;j++){const yb=-1+H+j*rh-rh,off=(j%2)?w/2:0;
  for(let i=-1;i<=c+1;i++){const cx=-1+i*w+off,col=p.co===1?mix(p.ca,p.cb,Math.min(1,Math.max(0,(yb+1)/2))):((j%2)?p.cb:p.ca),q=clipBox(tile(cx,yb),-1,-1,1,1);if(q.length>=3)o.push(fp(q,col))}}
 return o},{noRD:true,seg:true});
pat('octagram','Estrelas islâmicas (octograma)',[...COL('00695c','ffd54f'),pr('c','Colunas',3,1,8),pr('d','Profundidade da estrela',45,15,80,5,'%'),pb('co','Miolo octogonal',1),pb('dm','Losangos nos vãos',1),pb('bg','Fundo (cor B)',1)],(p,n)=>{
 const c=Math.round(p.c),w=2/c,R=w/2,o=[...bgRect(p)],ir=p.d/100;
 const put=(q,col)=>{const z=clipBox(q,-1,-1,1,1);if(z.length>=3)o.push(fp(z,col))};
 if(p.dm)for(let j=0;j<=c;j++)for(let i=0;i<=c;i++){const x=-1+i*w,y=-1+j*w;put([[x,y-R*.5],[x+R*.5,y],[x,y+R*.5],[x-R*.5,y]],mix(p.ca,p.cb,.55))}
 for(let j=0;j<c;j++)for(let i=0;i<c;i++){const cx=-1+w*(i+.5),cy=-1+w*(j+.5),S=(k,sc)=>starPts(8,ir,0,16).map(q=>[cx+q[0]*R*sc,cy+q[1]*R*sc]);
  put(S(1,1),p.ca);put(S(0,.58),mix(p.ca,p.cb,.4));if(p.co)put(circ(cx,cy,R*.24,R*.24,8,Math.PI/8),p.cb)}
 return o},{noRD:true});
pat('pixels','Mosaico de pixels',[...COL('1e88e5','fdd835'),pr('c','Quadrados',10,3,24),ps('md','Modo',0,O(['Ruído suave','Aleatório','Degradê diagonal'])),pr('v','Variação de tom',70,0,100,5,'%'),pr('q','Níveis de cor',5,2,8),pr('sd','Sorteio (semente)',5,1,99)],(p,n)=>{
 const c=Math.round(p.c),w=2/c,o=[],r=rng(Math.round(p.sd)*2.7+3),ph=[r()*6.3,r()*6.3,r()*6.3],Q=Math.round(p.q)-1,v=p.v/100;
 for(let j=0;j<c;j++)for(let i=0;i<c;i++){let t;if(p.md===0)t=(Math.sin(i*.8+ph[0])+Math.sin(j*.9+ph[1])+Math.sin((i+j)*.55+ph[2])+3)/6;else if(p.md===1)t=r();else t=(i+j)/Math.max(1,2*c-2)+(r()-.5)*v*.35;
  t=p.md===2?t:.5+(t-.5)*v*1.4;t=Math.min(1,Math.max(0,Math.round(t*Q)/Q));o.push(fp(rc(-1+i*w,-1+j*w,-1+(i+1)*w,-1+(j+1)*w),mix(p.ca,p.cb,t)))}
 return o});
pat('leaves','Folhagem tropical',[...COL('2e7d32','e8f5e9'),pr('c','Colunas',3,1,6),pr('w','Largura da folha',42,20,70,2,'%'),ps('ar','Disposição',0,O(['Alternada em V','Escama (diagonal)','Espinha de peixe'])),pb('vn','Nervura central',1),pb('bg','Fundo (cor B)',1)],(p,n)=>{
 const c=Math.round(p.c),w=2/c,o=[...bgRect(p)],m=cn(n/3,14);
 const put=(q,col)=>{const z=clipBox(q,-1,-1,1,1);if(z.length>=3)o.push(fp(z,col))};
 const leaf=(cx,cy,len,ang,k)=>{const wd=len*p.w/100,top=[],bot=[],mid=[],ca=Math.cos(ang),sa=Math.sin(ang),T=(x,y)=>[cx+x*ca-y*sa,cy+x*sa+y*ca];
  for(let i=0;i<=m;i++){const t=i/m,x=(t-.5)*len,hw=wd/2*Math.pow(Math.sin(Math.PI*t),.8)*(1.12-.4*t),bd=wd*.14*Math.sin(Math.PI*t);top.push(T(x,-hw+bd));bot.push(T(x,hw+bd));mid.push(T(x,bd))}
  const col=mix(p.ca,lt(p.ca,.35),(k%3)/3*.9);put([...top,...bot.reverse()],col);
  if(p.vn)put(thickLine(mid.slice(1,-1),len*.011),lt(col,.55))};
 if(p.ar===2){const rows=c*2+1;for(let i=0;i<c;i++){const cx=-1+w*(i+.5),L=w*.5;put(rc(cx-.008,-1,cx+.008,1),dk(p.ca,.25));
   for(let j=0;j<rows;j++){const cy=-1+(j+.5)*2/rows;leaf(cx-L*.46,cy-L*.05,L,Math.PI+rad(38),j);leaf(cx+L*.46,cy-L*.05,L,-rad(38),j+1)}}}
 else for(let j=-1;j<=c;j++)for(let i=-1;i<=c;i++){const off=p.ar===1&&j%2?w/2:0,cx=-1+w*(i+.5)+off,cy=-1+w*(j+.5),ang=p.ar===1?rad(-45):(((i+j)%2+2)%2?rad(-50):rad(50));leaf(cx,cy,w*1.12,ang,i+j*2+8)}
 return o},{noRD:true,seg:true});
pat('bubbles','Bolhas',[...COL('29b6f6','e1f5fe'),pr('n','Bolhas',26,6,80),pr('s','Tamanho máximo',22,8,40,1,'%'),pr('sd','Sorteio (semente)',3,1,99),pb('br','Brilho',1),pb('bg','Fundo (cor B)',1)],(p,n)=>{
 const r=rng(Math.round(p.sd)*3.1+5),N=Math.round(p.n),L=[],o=[...bgRect(p)],mx=p.s/100;let tr=0;
 while(L.length<N&&tr++<N*90){const R=mx*(.22+.78*Math.pow(r(),1.7)),x=r()*2.2-1.1,y=r()*2.2-1.1;if(L.every(q=>Math.hypot(q[0]-x,q[1]-y)>q[2]+R+.012))L.push([x,y,R])}
 L.sort((a,b)=>b[2]-a[2]);const put=(q,col)=>{const z=clipBox(q,-1,-1,1,1);if(z.length>=3)o.push(fp(z,col))};
 L.forEach(([x,y,R])=>{const col=mix(p.ca,p.cb,Math.min(1,R/mx)*.55);put(circ(x,y,R,R,cn(n/2,24)),col);
  if(p.br&&R>.05){const a=[];for(let i=0;i<=10;i++){const t=rad(200+i*9);a.push([x+Math.cos(t)*R*.68,y+Math.sin(t)*R*.68])}put(thickLine(a,R*.07),lt(col,.8));put(circ(x+Math.cos(rad(168))*R*.68,y+Math.sin(rad(168))*R*.68,R*.07,R*.07,8),lt(col,.8))}});
 return o},{noRD:true,seg:true});

})();
