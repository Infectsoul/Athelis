(()=>{
const $=id=>document.getElementById(id);
const P=(cat,n,s)=>({cat,n,c:s.split(/[ ,]+/).map(x=>x.replace('#','').toLowerCase())});
const LIB=[
P('Básicas','Padrão','ffffff d9d9d9 a6a6a6 737373 404040 000000 ff4d4d ff8a4d ffc94d e8e84d a6e34d 4de88a 4de8d9 4db8ff 4d6aff 8a4dff d94dff ff4da6 6a7495 8993b4 3b4260 c2a878 8b5a2b 5b3a1e 2e7d32 81c784 fff59d ffcc80 ef9a9a ce93d8 90caf9 80cbc4 bcaaa4 b0bec5 263238 f5f0e6'),
P('Básicas','Cinzas','ffffff f2f2f2 e0e0e0 cccccc b3b3b3 999999 808080 666666 4d4d4d 333333 1a1a1a 000000'),
P('Básicas','Arco-íris','ff0000 ff7f00 ffff00 7fff00 00ff00 00ff7f 00ffff 007fff 0000ff 7f00ff ff00ff ff007f'),
P('Básicas','Primárias','e63946 f77f00 fcbf49 2a9d8f 457b9d 1d3557 f1faee a8dadc'),
P('Básicas','Web seguras','000000 333333 666666 999999 cccccc ffffff ff0000 ff6600 ffcc00 99cc00 00cc66 00cccc 0066ff 6600ff cc00cc ff0066'),
P('Estações','Verão','ff6b6b ffa94d ffd93d 6bcB77 4d96ff 00c2d1 ff8fab fff3b0 f9844a 2ec4b6 ffbf69 cbf3f0'),
P('Estações','Outono','8c2f1b b5541c d97d2a e8a33d c9a227 7a6a2f 5c4a1e 3b2a1a a63d2f d4a373 8a5a44 f2d0a4'),
P('Estações','Inverno','f1f7fb dbe9f4 b6d0e8 8fb3d9 5e8cbf 3b5f8a 25405f 14263d 9db4c0 6b7f8f e8eef2 3a4a5a'),
P('Estações','Primavera','ffb7c5 ff9ebb f7c8e0 d8f3c4 a8e6a3 6fcf97 ffe66d fff1b8 b9e4f7 8fd3f4 c3b1e1 fdf0d5'),
P('Estações','Pastéis','ffd1dc ffdfba ffffba baffc9 bae1ff e0bbe4 d4a5a5 c9e4de f7d9c4 c6def1 dbcdf0 faedcb'),
P('Estações','Vibrantes','ff1744 ff6d00 ffea00 76ff03 00e676 00e5ff 2979ff 651fff d500f9 f50057 ffffff 111111'),
P('Estações','Neon','ff00ff 00ffff ffff00 39ff14 ff3131 ff6700 bc13fe 04d9ff 0aff99 fe019a f5ff00 1b1b1b'),
P('Estações','Quentes','fff1c9 ffd166 ffb347 ff8c42 f4511e e53935 c62828 8e1b1b 5d1010 3b0a0a'),
P('Estações','Frias','e0fbfc c2dfe3 9db4c0 5c6b73 253237 caf0f8 90e0ef 00b4d8 0077b6 03045e'),
P('Natureza','Floresta','1b4332 2d6a4f 40916c 52b788 74c69d 95d5b2 b7e4c7 d8f3dc 3d2b1f 6f4e37 a47148 d4a373'),
P('Natureza','Oceano','03045e 023e8a 0077b6 0096c7 00b4d8 48cae4 90e0ef ade8f4 caf0f8 e0f7fa 264653 2a9d8f'),
P('Natureza','Deserto','f4e1c1 e9c46a f4a261 e76f51 c1666b 9c6644 7f5539 5c4033 d4a373 faedcd ccd5ae e9edc9'),
P('Natureza','Pôr do sol','ffbe0b fb5607 ff006e 8338ec 3a86ff ff9e00 ff5400 c9184a 7b2cbf 3c096c 240046 10002b'),
P('Natureza','Aurora','0b132b 1c2541 3a506b 5bc0be 6fffe9 80ed99 57cc99 38a3a5 22577a c77dff 9d4edd 7b2cbf'),
P('Natureza','Terra','3e2723 4e342e 5d4037 6d4c41 795548 8d6e63 a1887f bcaaa4 d7ccc8 efebe9 827717 9e9d24'),
P('Natureza','Céu','001d3d 003566 0a4d8c 1e78c8 4fa3e0 87ceeb b8e0f5 e6f4fc fff4cc ffd166 ff9a8b ffc2b3'),
P('Natureza','Fogo','fff7ae ffe066 ffc233 ff9f1c ff7b00 f4511e d62828 9d0208 6a040f 370617 1a0a0a 000000'),
P('Natureza','Gelo','ffffff f0fbff dff5ff c6ecff a5dcf7 7cc8ee 55b0e0 3a92c9 2a72a8 1d5486 123a63 0a2540'),
P('Natureza','Pedra / metal','f5f5f5 d6d6d6 b0b0b0 8a8a8a 6b6b6b 4f4f4f 36393d 24262a 8d99ae 5c677d 2b2d42 edf2f4'),
P('Natureza','Madeira','f1e0c5 e0c097 c9a070 b08057 966a45 7b5436 61402a 4a301f 36231a 24160f c2a878 8b5a2b'),
P('Natureza','Pele','ffe5d0 ffd9b8 f5c9a0 e8b78a d9a077 c68a5f b07448 8d5a35 6f4325 543320 3a2316 2a190f'),
P('Natureza','Cabelo','0d0d0d 2b1b12 4a2f1d 6b4226 8c5a2e b5834a d9ad6b f2d49b e8e0cf c7c7c7 8a8a8a b0402a'),
P('Estilos','Retrô 80s','ff6ec7 ff9a8b ffd23f 5ef38c 3ad0ff 7a5cff c946f0 2b0a3d 1a1a40 f72585 4cc9f0 4361ee'),
P('Estilos','Vintage','f4ecd8 e6d5b8 d4b996 c19a6b a67c52 7b5e3b 5a4630 3d3023 b85c38 8c3b2a 5c7a6b 3f5b52'),
P('Estilos','Doce / candy','ffc8dd ffafcc bde0fe a2d2ff cdb4db ffd6a5 fdffb6 caffbf 9bf6ff ffc6ff fffffc ff99c8'),
P('Estilos','Gelato','fde2e4 fad2e1 e2ece9 bee1e6 f0efeb dfe7fd cddafd ffe5d9 ffcad4 f4acb7 9d8189 d8e2dc'),
P('Estilos','Noturno','0b0c10 1f2833 2e3a4a 45a29e 66fcf1 c5c6c7 3c4a6b 5a6a96 8f9bd6 b8c0ff 4a3b6b 7b5ea7'),
P('Estilos','Cyberpunk','0d0221 261447 540d6e ee4266 ff2a6d 05d9e8 01012b d1f7ff ffd319 ff6c11 7700a6 00ff9f'),
P('Estilos','Halloween','1a0f1f 2d1b3d 5a189a ff6d00 ff9e00 ffd60a 6a994e 386641 ffffff f2e9e4 9d0208 000000'),
P('Estilos','Natal','c1121f 780000 fdf0d5 ffffff 2d6a4f 1b4332 ffd166 e9c46a 669bbc 003049 b5838d 6d6875'),
P('Estilos','Café / caramelo','fff4e6 f3e0c8 e0c3a0 c9a27b b07d54 8d5b3a 6b4228 4a2c1a 2e1a0f 1a0f08 d4a373 faedcd'),
P('Estilos','Rosa / lilás','fff0f6 ffd6e8 ffadd2 ff85c0 f759ab eb2f96 c41d7f 9e1068 780650 520339 d3adf7 b37feb'),
P('Jogos','Game Boy','0f380f 306230 8bac0f 9bbc0f'),
P('Jogos','PICO-8','000000 1d2b53 7e2553 008751 ab5236 5f574f c2c3c7 fff1e8 ff004d ffa300 ffec27 00e436 29adff 83769c ff77a8 ffccaa'),
P('Jogos','Sweetie 16','1a1c2c 5d275d b13e53 ef7d57 ffcd75 a7f070 38b764 257179 29366f 3b5dc9 41a6f6 73eff7 f4f4f4 94b0c2 566c86 333c57'),
P('Jogos','NES','000000 fcfcfc f8f8f8 bcbcbc 7c7c7c a4e4fc 3cbcfc 0078f8 0000fc b8b8f8 6888fc 0058f8 d8b8f8 9878f8 6844fc 4428bc'),
P('Jogos','C64','000000 ffffff 880000 aaffee cc44cc 00cc55 0000aa eeee77 dd8855 664400 ff7777 333333 777777 aaff66 0088ff bbbbbb'),
P('Jogos','Transformice','6a7495 1a1a1a 324650 8a6c4a 6c77c1 e5b45b c2a878 a5c8d8 7a9a54 d96b4a f2e3b3 4b3a2a'),
P('Editor','Solarized','002b36 073642 586e75 657b83 839496 93a1a1 eee8d5 fdf6e3 b58900 cb4b16 dc322f d33682 6c71c4 268bd2 2aa198 859900'),
P('Editor','Nord','2e3440 3b4252 434c5e 4c566a d8dee9 e5e9f0 eceff4 8fbcbb 88c0d0 81a1c1 5e81ac bf616a d08770 ebcb8b a3be8c b48ead'),
P('Editor','Dracula','282a36 44475a f8f8f2 6272a4 8be9fd 50fa7b ffb86c ff79c6 bd93f9 ff5555 f1fa8c'),
P('Editor','Gruvbox','282828 3c3836 504945 665c54 a89984 ebdbb2 fb4934 b8bb26 fabd2f 83a598 d3869b 8ec07c fe8019 cc241d 98971a d79921'),
P('Editor','Catppuccin','1e1e2e 313244 45475a 585b70 a6adc8 cdd6f4 f5e0dc f2cdcd f5c2e7 cba6f7 f38ba8 eba0ac fab387 f9e2af a6e3a1 94e2d5 89dceb 89b4fa'),
P('Editor','Material','f44336 e91e63 9c27b0 673ab7 3f51b5 2196f3 03a9f4 00bcd4 009688 4caf50 8bc34a cddc39 ffeb3b ffc107 ff9800 ff5722 795548 607d8b'),
P('Monocromáticas','Azul','e3f2fd bbdefb 90caf9 64b5f6 42a5f5 2196f3 1e88e5 1976d2 1565c0 0d47a1'),
P('Monocromáticas','Verde','e8f5e9 c8e6c9 a5d6a7 81c784 66bb6a 4caf50 43a047 388e3c 2e7d32 1b5e20'),
P('Monocromáticas','Vermelho','ffebee ffcdd2 ef9a9a e57373 ef5350 f44336 e53935 d32f2f c62828 b71c1c'),
P('Monocromáticas','Roxo','f3e5f5 e1bee7 ce93d8 ba68c8 ab47bc 9c27b0 8e24aa 7b1fa2 6a1b9a 4a148c'),
P('Monocromáticas','Laranja','fff3e0 ffe0b2 ffcc80 ffb74d ffa726 ff9800 fb8c00 f57c00 ef6c00 e65100'),
P('Monocromáticas','Turquesa','e0f7fa b2ebf2 80deea 4dd0e1 26c6da 00bcd4 00acc1 0097a7 00838f 006064'),
P('Monocromáticas','Rosa','fce4ec f8bbd0 f48fb1 f06292 ec407a e91e63 d81b60 c2185b ad1457 880e4f'),
P('Monocromáticas','Marrom','efebe9 d7ccc8 bcaaa4 a1887f 8d6e63 795548 6d4c41 5d4037 4e342e 3e2723')
];
const CATS=['Todas','Básicas','Estações','Natureza','Estilos','Jogos','Editor','Monocromáticas','Personalizadas'];
const ld=(k,d)=>{try{return JSON.parse(localStorage[k]||d)}catch(e){return JSON.parse(d)}};
let custom=ld('athelis_palcustom','[]'),act=localStorage.athelis_palact||'Padrão',cat='Todas',q='',edit=null;
const all=()=>[...custom.map(p=>({...p,cat:'Personalizadas',cu:1})),...LIB];
const norm=s=>String(s).split(/[\s,;]+/).map(x=>x.replace('#','').trim().toLowerCase()).filter(x=>/^[0-9a-f]{6}$/.test(x)||/^[0-9a-f]{3}$/.test(x)).map(x=>x.length===3?x.split('').map(c=>c+c).join(''):x);
const save=()=>{localStorage.athelis_palcustom=JSON.stringify(custom)};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const toastS=m=>{try{toast(m)}catch(e){}};
function setColor(h){const c=$('col');c.value='#'+h;c.dispatchEvent(new Event('input'));c.dispatchEvent(new Event('change'))}
function actPal(){return all().find(p=>p.n===act)||LIB[0]}
function inline(){const el=$('pal');if(!el)return;const p=actPal();el.innerHTML=p.c.map(c=>`<i style="background:#${c}" data-c="#${c}" title="#${c}"></i>`).join('');const t=$('palname');if(t)t.textContent=p.n}
function build(){
 if($('palwin'))return;
 const d=document.createElement('div');d.id='palwin';d.hidden=true;
 d.innerHTML=`<div class="pw-h"><b><i data-ic="palette"></i>Paletas de cores</b><span class="pw-sp"></span><button id="pw-x" title="Fechar" data-ic="x"></button></div>
 <div class="pw-tb"><div class="pw-s"><i data-ic="search"></i><input id="pw-q" placeholder="Buscar paleta…"></div>
  <button id="pw-new" data-ic="plus" title="Criar paleta personalizada">Nova</button>
  <button id="pw-cur" data-ic="pipette" title="Nova paleta a partir de cores digitadas/coladas (ex.: 6d6875,b5838d,e5989b)">Colar</button>
  <button id="pw-imp" data-ic="folder-open" title="Carregar paletas de um arquivo (.json do editor, .gpl do GIMP/Inkscape, .hex/.txt com códigos)">Carregar</button>
  <button id="pw-exp" data-ic="download" title="Salvar todas as paletas personalizadas em um arquivo .json">Salvar</button>
  <input type="file" id="pw-file" accept=".json,.gpl,.hex,.txt,.pal" hidden></div>
 <div class="pw-b"><div class="pw-c" id="pw-c"></div><div class="pw-m"><div id="pw-ed" hidden></div><div id="pw-g"></div></div></div>
 <div class="pw-f"><i data-ic="info"></i><span>Clique numa cor para usá-la · "Usar" define a paleta mostrada em Estilo</span></div>`;
 document.body.appendChild(d);icons(d);
 $('pw-x').onclick=()=>d.hidden=true;
 const h=d.querySelector('.pw-h');let dr=null;
 h.onmousedown=e=>{if(e.target.closest('button'))return;const r=d.getBoundingClientRect();dr=[e.clientX-r.left,e.clientY-r.top];e.preventDefault()};
 addEventListener('mousemove',e=>{if(!dr)return;d.style.left=Math.max(0,Math.min(innerWidth-120,e.clientX-dr[0]))+'px';d.style.top=Math.max(0,Math.min(innerHeight-40,e.clientY-dr[1]))+'px';d.style.transform='none'});
 addEventListener('mouseup',()=>dr=null);
 $('pw-q').oninput=e=>{q=e.target.value.toLowerCase();grid()};
 $('pw-c').onclick=e=>{const b=e.target.closest('button');if(!b)return;cat=b.dataset.k;cats();grid()};
 $('pw-new').onclick=()=>openEd({n:'Minha paleta '+(custom.length+1),c:[$('col').value.slice(1)],isNew:1});
 $('pw-cur').onclick=()=>openEd({n:'Colada '+(custom.length+1),c:[],isNew:1,paste:1});
 $('pw-exp').onclick=()=>{if(!custom.length){toastS('Nenhuma paleta personalizada para salvar');return}const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify({athelis_palettes:1,palettes:custom.map(p=>({n:p.n,c:p.c}))},null,1)],{type:'application/json'}));a.download='athelis-palettes.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),2000)};
 $('pw-imp').onclick=()=>$('pw-file').click();
 $('pw-file').onchange=async e=>{const f=e.target.files[0];e.target.value='';if(!f)return;const t=await f.text();let n=0;
  const add=(nm,cs)=>{cs=cs.filter(Boolean);if(!cs.length)return;custom.push({n:uniq(nm),c:cs});n++};
  try{const j=JSON.parse(t);const arr=Array.isArray(j)?j:j.palettes||(j.c?[j]:[]);arr.forEach(p=>add(p.n||p.name||f.name.replace(/\.\w+$/,''),norm((p.c||p.colors||[]).join(' '))))}catch(_){
   if(/^GIMP Palette/i.test(t)){const nm=(t.match(/^Name:\s*(.+)$/m)||[])[1]||f.name.replace(/\.\w+$/,'');const cs=[];t.split('\n').forEach(l=>{const m=l.match(/^\s*(\d+)\s+(\d+)\s+(\d+)/);if(m)cs.push([m[1],m[2],m[3]].map(v=>(+v).toString(16).padStart(2,'0')).join(''))});add(nm,cs)}
   else add(f.name.replace(/\.\w+$/,''),norm(t))}
  save();cat='Personalizadas';cats();grid();toastS(n?n+' paleta(s) carregada(s)':'Nenhuma cor válida no arquivo')};
 cats();grid();
}
const uniq=n=>{let b=n,i=2;while(all().some(p=>p.n===n))n=b+' '+i++;return n};
function cats(){$('pw-c').innerHTML=CATS.map(k=>`<button data-k="${k}" class="${k===cat?'on':''}">${k}<small>${k==='Todas'?all().length:all().filter(p=>p.cat===k).length}</small></button>`).join('')}
function grid(){
 const L=all().filter(p=>(cat==='Todas'||p.cat===cat)&&(!q||p.n.toLowerCase().includes(q)||p.cat.toLowerCase().includes(q)));
 $('pw-g').innerHTML=L.length?L.map(p=>`<div class="pw-card${p.n===act?' act':''}" data-n="${esc(p.n)}"><div class="pw-ch"><b>${esc(p.n)}</b><small>${p.c.length}</small><span class="pw-sp"></span>${p.cu?'<button data-a="ed" title="Editar" data-ic="pencil"></button><button data-a="dup" title="Duplicar" data-ic="copy"></button><button data-a="del" title="Excluir" data-ic="trash-2"></button>':'<button data-a="dup" title="Duplicar para personalizar" data-ic="copy"></button>'}<button data-a="use" class="pw-use" title="Usar esta paleta em Estilo">${p.n===act?'Em uso':'Usar'}</button></div><div class="pw-sw">${p.c.map(c=>`<i style="background:#${c}" data-c="${c}" title="#${c}"></i>`).join('')}</div></div>`).join(''):'<div class="pw-empty">Nenhuma paleta encontrada.</div>';
 icons($('pw-g'));
}
document.addEventListener('click',e=>{
 const w=$('palwin');if(!w||!w.contains(e.target))return;
 const sw=e.target.closest('.pw-sw i,.pw-ed-sw i');if(sw&&sw.dataset.c&&!e.target.closest('#pw-ed')){setColor(sw.dataset.c);return}
 const card=e.target.closest('.pw-card'),b=e.target.closest('button[data-a]');if(!card||!b)return;
 const p=all().find(x=>x.n===card.dataset.n);if(!p)return;const a=b.dataset.a;
 if(a==='use'){act=p.n;localStorage.athelis_palact=act;inline();grid()}
 else if(a==='dup'){custom.push({n:uniq(p.n+' (cópia)'),c:p.c.slice()});save();cat='Personalizadas';cats();grid()}
 else if(a==='del'){custom=custom.filter(x=>x.n!==p.n);if(act===p.n){act='Padrão';localStorage.athelis_palact=act;inline()}save();cats();grid()}
 else if(a==='ed')openEd({...p,old:p.n});
});
function openEd(p){edit={n:p.n,c:p.c.slice(),old:p.old,isNew:p.isNew};const el=$('pw-ed');el.hidden=false;
 el.innerHTML=`<div class="pw-ech"><input id="pe-n" value="${esc(edit.n)}" placeholder="Nome da paleta"><button id="pe-add" data-ic="plus" title="Adicionar a cor atual de Estilo">Cor atual</button><button id="pe-ok" class="pw-use" data-ic="check">Salvar</button><button id="pe-no" data-ic="x" title="Cancelar"></button></div>
 <div class="pw-ed-sw" id="pe-sw"></div>
 <div class="pw-ech"><input id="pe-hex" placeholder="Cole códigos: 6d6875,b5838d,#e5989b…"><button id="pe-ap" data-ic="plus" title="Adicionar os códigos">Adicionar</button></div>`;
 icons(el);const draw=()=>{$('pe-sw').innerHTML=edit.c.map((c,i)=>`<label class="pe-c" style="background:#${c}" title="#${c} · clique para trocar · botão direito remove"><input type="color" value="#${c}" data-i="${i}"></label>`).join('')+'<label class="pe-c pe-plus" title="Adicionar cor"><input type="color" id="pe-new" value="#ffffff">+</label>'};
 draw();
 $('pe-sw').oninput=e=>{const i=e.target.dataset.i;if(i!==undefined){edit.c[+i]=e.target.value.slice(1);e.target.parentNode.style.background=e.target.value}};
 $('pe-sw').onchange=e=>{if(e.target.id==='pe-new'){edit.c.push(e.target.value.slice(1));draw()}};
 $('pe-sw').oncontextmenu=e=>{const l=e.target.closest('.pe-c');const i=l&&l.querySelector('input').dataset.i;if(i===undefined)return;e.preventDefault();edit.c.splice(+i,1);draw()};
 $('pe-add').onclick=()=>{edit.c.push($('col').value.slice(1));draw()};
 $('pe-ap').onclick=()=>{const n=norm($('pe-hex').value);if(!n.length){toastS('Nenhuma cor válida. Ex.: 6d6875,b5838d,e5989b');return}edit.c.push(...n);$('pe-hex').value='';draw()};
 $('pe-no').onclick=()=>{el.hidden=true;edit=null};
 $('pe-ok').onclick=()=>{const nm=$('pe-n').value.trim()||'Paleta';if(!edit.c.length){toastS('Adicione ao menos uma cor');return}
  if(edit.old){const i=custom.findIndex(x=>x.n===edit.old);if(i>=0){custom[i]={n:nm,c:edit.c};if(act===edit.old){act=nm;localStorage.athelis_palact=nm}}}
  else custom.push({n:uniq(nm),c:edit.c});
  save();el.hidden=true;edit=null;cat='Personalizadas';cats();grid();inline()};
 if(p.paste)$('pe-hex').focus();
}
function open(){build();const w=$('palwin');w.hidden=false;cats();grid()}
window.openPalettes=open;
const pal=$('pal');
if(pal){
 const bar=document.createElement('div');bar.className='palbar';
 bar.innerHTML='<button type="button" id="palopen" title="Abrir a janela de paletas (temas, personalizadas, salvar/carregar)" data-ic="palette">Paletas</button><span class="palname" id="palname"></span>';
 pal.parentNode.insertBefore(bar,pal);icons(bar);$('palopen').onclick=open;
 pal.onclick=e=>{const c=e.target.dataset&&e.target.dataset.c;if(c)setColor(c.replace('#',''))};
 inline();
}
})();
