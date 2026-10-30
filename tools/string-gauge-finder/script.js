(function(){
const $=id=>document.getElementById(id);
const NOTES=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const hz=(n,o)=>440*Math.pow(2,(NOTES.indexOf(n)+12*(o+1)-69)/12);
// tunings low → high, note+octave
const T={
 g6:{'E standard':'E2 A2 D3 G3 B3 E4','Eb standard':'D#2 G#2 C#3 F#3 A#3 D#4','Drop D':'D2 A2 D3 G3 B3 E4','D standard':'D2 G2 C3 F3 A3 D4','Drop C#':'C#2 G#2 C#3 F#3 A#3 D#4','C standard':'C2 F2 A#2 D#3 G3 C4','Drop C':'C2 G2 C3 F3 A3 D4','B standard':'B1 E2 A2 D3 F#3 B3','Drop B':'B1 F#2 B2 E3 G#3 C#4','Drop A':'A1 E2 A2 D3 F#3 B3','DADGAD':'D2 A2 D3 G3 A3 D4','Open G':'D2 G2 D3 G3 B3 D4'},
 g7:{'B standard (7)':'B1 E2 A2 D3 G3 B3 E4','Drop A (7)':'A1 E2 A2 D3 G3 B3 E4','A standard (7)':'A1 D2 G2 C3 F3 A3 D4','Drop G (7)':'G1 D2 G2 C3 F3 A3 D4'},
 g8:{'F# standard (8)':'F#1 B1 E2 A2 D3 G3 B3 E4','Drop E (8)':'E1 B1 E2 A2 D3 G3 B3 E4'},
 gb:{'B standard (baritone)':'B1 E2 A2 D3 F#3 B3','A standard (baritone)':'A1 D2 G2 C3 E3 A3','Drop A (baritone)':'A1 E2 A2 D3 F#3 B3'},
 b4:{'E standard (bass)':'E1 A1 D2 G2','Drop D (bass)':'D1 A1 D2 G2','D standard (bass)':'D1 G1 C2 F2','Drop C (bass)':'C1 G1 C2 F2'},
 b5:{'B standard (5-string bass)':'B0 E1 A1 D2 G2','A standard (5-string bass)':'A0 D1 G1 C2 F2'}};
const SCALE={g6:25.5,g7:26.5,g8:27,gb:27,b4:34,b5:35};
const SETS={g6:['9-42','10-46','10-52','11-49','11-56','12-56','12-60','13-62'],g7:['9-54','10-59','10-62','11-64','11-68'],g8:['9-80','10-74','10-80','11-85'],gb:['12-68','13-72','14-68','14-72'],b4:['40-95','45-100','45-105','50-110','55-110'],b5:['40-125','45-125','45-130','50-135']};
const TGT={g:{light:13,medium:16.5,heavy:19},b:{light:32,medium:40,heavy:48}};
// unit weight (lb/in): plain steel = pi/4*d^2*0.2836 ; nickel wound ≈ k(d)*d^2 (fitted to published nickel-wound tension charts, ±5-10%)
const uw=(d,w)=>w?Math.max(.165,.193-.26*d)*d*d:.2227*d*d;
const ten=(d,w,L,f)=>uw(d,w)*Math.pow(2*L*f,2)/386.4;
const PLAIN=[];for(let g=7;g<=26;g+=.5)PLAIN.push(g/1000);
const WOUND=[];for(let g=17;g<=90;g++)WOUND.push(g/1000);for(let g=95;g<=175;g+=5)WOUND.push(g/1000);
function pick(f,L,t,bass){const w=bass||f<185;let best=null;for(const d of (w?WOUND:PLAIN)){const x=ten(d,w,L,f);if(!best||Math.abs(x-t)<Math.abs(best.t-t))best={d,t:x,w}}return best}
const fmt=d=>'.'+String(Math.round(d*1000)).padStart(3,'0').replace(/^0(\d\d\d)$/,'$1')+(d*1000%1?'5':'');
function g3(d){return d.toFixed(4).replace(/^0\./,'').replace(/^(\d{3})0$/,'$1')}
function fill(){const i=$('inst').value;$('tun').innerHTML=Object.keys(T[i]).map(k=>`<option>${k}</option>`).join('');$('scale').value=SCALE[i];run()}
function run(){const i=$('inst').value,bass=i[0]==='b',L=+$('scale').value||SCALE[i],feel=$('feel').value,t=TGT[bass?'b':'g'][feel];
 const s=T[i][$('tun').value].split(' ').map(x=>{const m=x.match(/^([A-G]#?)(\d)$/);return{n:x,f:hz(m[1],+m[2])}}).reverse();
 let tot=0;const rows=s.map((x,k)=>{const p=pick(x.f,L,t,bass);tot+=p.t;return{...x,...p,k:k+1}});
 $('tb').innerHTML=rows.map(r=>`<tr><td>${r.k}</td><td>${r.n.replace(/(\d)$/,'<sub>$1</sub>')}</td><td>${r.f.toFixed(1)}</td><td><b>.${g3(r.d)}</b> ${r.w?'wound':'plain'}</td><td>${r.t.toFixed(1)} lb <span class="mut">(${(r.t*.4536).toFixed(1)} kg)</span></td></tr>`).join('');
 const hi=rows[0].d*1000,lo=rows[rows.length-1].d*1000;
 const near=SETS[i].map(x=>{const [a,b]=x.split('-').map(Number);return{x,s:Math.abs(a-hi)*3+Math.abs(b-lo)}}).sort((a,b)=>a.s-b.s).slice(0,2).map(o=>o.x);
 $('sum').innerHTML=`Custom set: <b>${Math.round(hi)}–${Math.round(lo)}</b> · total tension <b>${tot.toFixed(0)} lb</b> (${(tot*.4536).toFixed(0)} kg)`;
 $('sets').innerHTML=near.map(x=>`<span class="chip">Closest pack: <b>${x}</b></span>`).join('')+`<span class="chip">Scale ${L}"</span>`}
['inst'].forEach(k=>$(k).addEventListener('input',fill));['tun','scale','feel'].forEach(k=>$(k).addEventListener('input',run));
fill();

})();
(function(){document.querySelectorAll('[data-copy]').forEach(function(b){b.addEventListener('click',function(){var t=document.getElementById(b.dataset.copy);navigator.clipboard.writeText(t.value).then(function(){b.textContent='Copied!';setTimeout(function(){b.textContent='Copy code'},1500)},function(){t.select()})})});
if(matchMedia('(hover:none),(prefers-reduced-motion:reduce)').matches)return;
document.addEventListener('pointermove',function(e){var c=e.target.closest&&e.target.closest('.smlt .fx');if(!c)return;var r=c.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;c.style.setProperty('--mx',x+'px');c.style.setProperty('--my',y+'px');
if(c.classList.contains('tilt'))c.style.transform='rotateX('+((r.height/2-y)/r.height*7).toFixed(2)+'deg) rotateY('+((x-r.width/2)/r.width*7).toFixed(2)+'deg)'},{passive:true});
document.addEventListener('pointerout',function(e){var c=e.target.closest&&e.target.closest('.smlt .fx.tilt');if(c&&!c.contains(e.relatedTarget))c.style.transform=''},{passive:true})})();
