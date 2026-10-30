(function(){
const $=id=>document.getElementById(id);
// Typical draws by pedal type. Values are typical ranges seen on manufacturer labels/manuals, NOT for a specific model. Always check your pedal's label.
const PRE=[['Analog overdrive / distortion',10,9,'neg'],['Fuzz (silicon)',5,9,'neg'],['Fuzz (germanium, vintage-style)',2,9,'pos'],['Compressor (analog)',8,9,'neg'],['Wah (passive pot, active circuit)',5,9,'neg'],['Tuner pedal',60,9,'neg'],['Analog chorus / phaser / flanger',20,9,'neg'],['Analog delay (BBD)',40,9,'neg'],['Compact digital delay / reverb',100,9,'neg'],['Large digital delay / reverb (Strymon-style)',300,9,'neg'],['Looper (compact)',100,9,'neg'],['Pitch / octave (digital)',150,9,'neg'],['Clean boost / buffer',8,9,'neg'],['Volume / expression (active)',10,9,'neg'],['Small amp modeler / IR loader',500,9,'neg'],['Multi-effects (HX Stomp-class)',2000,9,'neg'],['Tube-in-a-box overdrive (12V)',200,12,'neg'],['High-headroom 18V drive',15,18,'neg']];
let board=[['Tuner pedal',60,9,'neg'],['Analog overdrive / distortion',10,9,'neg'],['Compact digital delay / reverb',100,9,'neg'],['Large digital delay / reverb (Strymon-style)',300,9,'neg']];
function addOpt(){ $('pre').innerHTML='<option value="">+ Add a typical pedal…</option>'+PRE.map((p,i)=>`<option value="${i}">${p[0]} (~${p[1]} mA)</option>`).join('') }
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function draw(){ $('list').innerHTML=board.map((p,i)=>`<div class="prow"><input aria-label="Pedal name" value="${esc(p[0])}" data-i="${i}" data-k="0"><input aria-label="mA" type="number" min="0" value="${p[1]}" data-i="${i}" data-k="1"><select aria-label="Voltage" data-i="${i}" data-k="2">${[9,12,18,24].map(v=>`<option${v==p[2]?' selected':''}>${v}</option>`).join('')}</select><select aria-label="Polarity" data-i="${i}" data-k="3"><option value="neg"${p[3]=='neg'?' selected':''}>Center −</option><option value="pos"${p[3]=='pos'?' selected':''}>Center +</option></select><button class="alt x" data-del="${i}" aria-label="Remove">×</button></div>`).join(''); run() }
function run(){ let tot=0,mx=0,v=new Set(),pos=0,dig=0;board.forEach(p=>{const m=+p[1]||0;tot+=m;mx=Math.max(mx,m);v.add(+p[2]);if(p[3]=='pos')pos++;if(m>=50)dig++});
 const need=Math.ceil(tot*1.25/50)*50,n=board.length;
 $('tot').innerHTML=`${tot} <small>mA</small>`;
 const iso=pos||v.size>1||mx>=500||dig>=2||n>5;
 const out=[`<span class="chip">Outputs needed: <b>${n}</b>${n?` (plan ${n+1}–${n+2} for growth)`:''}</span>`,`<span class="chip">Supply capacity: <b>≥ ${need} mA</b> (total + 25%)</span>`,`<span class="chip">Biggest outlet: <b>≥ ${mx} mA</b></span>`,`<span class="chip">Voltages: <b>${[...v].sort((a,b)=>a-b).join(' / ')||'–'} V</b></span>`];
 $('rec').innerHTML=out.join('');
 const tips=[];
 tips.push(iso?'<b>Get an isolated power supply.</b> '+[mx>=500?'One pedal needs '+mx+' mA, more than most daisy chains or shared outlets can give.':'',dig>=2?'You have '+dig+' digital-style pedals; isolated outputs stop them sharing noise.':'',v.size>1?'You mix voltages, which needs separate outlets.':'',pos?'Center-positive pedals must never share a daisy chain with center-negative ones.':''].filter(Boolean).join(' '):'<b>A daisy chain can work here.</b> All pedals are 9V center-negative and the total is low. Use an adapter rated at least '+need+' mA. If you hear hum or digital whine, move to an isolated supply.');
 if(pos)tips.push('<b>Center-positive pedals</b> (often vintage germanium fuzzes) need a polarity-reversing cable on an isolated outlet, or their own battery.');
 if([...v].some(x=>x>9))tips.push('<b>12V/18V pedals:</b> only plug them into outlets labeled for that voltage. Never feed a 9V-only pedal more than 9V.');
 $('tips').innerHTML=tips.map(t=>`<li>${t}</li>`).join('') }
$('list').addEventListener('input',e=>{const t=e.target;if(t.dataset.i==null)return;board[t.dataset.i][t.dataset.k]=t.dataset.k==1?+t.value:t.dataset.k==2?+t.value:t.value;run()});
$('list').addEventListener('click',e=>{const d=e.target.dataset.del;if(d!=null){board.splice(+d,1);draw()}});
$('pre').addEventListener('change',e=>{if(e.target.value==='')return;board.push(PRE[+e.target.value].slice());e.target.value='';draw()});
$('add').onclick=()=>{board.push(['My pedal',20,9,'neg']);draw()};
$('clr').onclick=()=>{board=[];draw()};
addOpt();draw();

})();
(function(){document.querySelectorAll('[data-copy]').forEach(function(b){b.addEventListener('click',function(){var t=document.getElementById(b.dataset.copy);navigator.clipboard.writeText(t.value).then(function(){b.textContent='Copied!';setTimeout(function(){b.textContent='Copy code'},1500)},function(){t.select()})})});
if(matchMedia('(hover:none),(prefers-reduced-motion:reduce)').matches)return;
document.addEventListener('pointermove',function(e){var c=e.target.closest&&e.target.closest('.smlt .fx');if(!c)return;var r=c.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;c.style.setProperty('--mx',x+'px');c.style.setProperty('--my',y+'px');
if(c.classList.contains('tilt'))c.style.transform='rotateX('+((r.height/2-y)/r.height*7).toFixed(2)+'deg) rotateY('+((x-r.width/2)/r.width*7).toFixed(2)+'deg)'},{passive:true});
document.addEventListener('pointerout',function(e){var c=e.target.closest&&e.target.closest('.smlt .fx.tilt');if(c&&!c.contains(e.relatedTarget))c.style.transform=''},{passive:true})})();
