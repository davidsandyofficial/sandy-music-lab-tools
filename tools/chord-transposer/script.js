(function(){
const S=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'],F=['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B'];
const FLATKEYS=new Set(['F','Bb','Eb','Ab','Db']);const N={Cb:11,'E#':5,Fb:4,'B#':0};S.forEach((n,i)=>N[n]=i);F.forEach((n,i)=>N[n]=i);
const keys=['C','Db','D','Eb','E','F','F#','G','Ab','A','Bb','B'];const $=id=>document.getElementById(id);
keys.forEach(k=>{$('from').add(new Option(k,k));$('to').add(new Option(k,k))});$('from').value='G';$('to').value='A';
const RE=/^([A-G](?:#|b)?)([^\s/]*)(?:\/([A-G](?:#|b)?))?$/,QUAL=/^(m|maj|min|dim|aug|sus|add|M|\+|°|ø|\d|\(|-)?[\w#b+()°ø-]*$/;
const nm=(i,f)=>(f?F:S)[((i%12)+12)%12];
const isC=x=>{const m=x.match(RE);return m&&QUAL.test(m[2]||'')};
function isChordLine(l){const t=l.trim().split(/\s+/).filter(Boolean);return t.length&&t.filter(isC).length/t.length>=.7}
function tr(t,n,f){const m=t.match(RE);if(!m||!QUAL.test(m[2]||''))return t;return nm(N[m[1]]+n,f)+m[2]+(m[3]?'/'+nm(N[m[3]]+n,f):'')}
// Keep every chord in its original column (fixes later chords drifting right when a chord name gets longer)
function line(l,n,f){let o='';l.replace(/\S+/g,(t,i)=>{const c=tr(t,n,f);if(o.length&&o.length>=i)o+=' ';else o+=' '.repeat(i-o.length);o+=c;return t});return o}
const esc=s=>s.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
let plain='';
function run(){const n=((N[$('to').value]-N[$('from').value])+12)%12,sp=$('sp').value,f=sp==='f'||(sp==='auto'&&FLATKEYS.has($('to').value));
 $('steps').textContent=n?`${n} half step${n>1?'s':''} up (or ${12-n} down)`:'Same key';
 const L=$('src').value.split('\n').map(l=>(/^\s*\[.*\]\s*$/.test(l)||!isChordLine(l))?[l,0]:[line(l,n,f),1]);
 plain=L.map(x=>x[0]).join('\n');$('out').innerHTML=L.map(([l,c])=>c?esc(l).replace(/\S+/g,'<b>$&</b>'):esc(l)).join('\n');
 const to=N[$('to').value];$('capo').innerHTML=['C','A','G','E','D'].map(k=>{const c=(to-N[k]+12)%12;return c<=7?`<span class="chip">${c?'Capo <b>'+c+'</b>':'<b>No capo</b>'} → play ${k} shapes</span>`:''}).join('')}
['src','from','to','sp'].forEach(i=>$(i).addEventListener('input',run));
$('up').onclick=()=>{$('to').selectedIndex=($('to').selectedIndex+1)%12;run()};$('dn').onclick=()=>{$('to').selectedIndex=($('to').selectedIndex+11)%12;run()};
$('cp').onclick=()=>navigator.clipboard.writeText(plain).then(()=>{$('cp').textContent='Copied!';setTimeout(()=>$('cp').textContent='Copy result',1500)});
run();

})();
(function(){document.querySelectorAll('[data-copy]').forEach(function(b){b.addEventListener('click',function(){var t=document.getElementById(b.dataset.copy);navigator.clipboard.writeText(t.value).then(function(){b.textContent='Copied!';setTimeout(function(){b.textContent='Copy code'},1500)},function(){t.select()})})});
if(matchMedia('(hover:none),(prefers-reduced-motion:reduce)').matches)return;
document.addEventListener('pointermove',function(e){var c=e.target.closest&&e.target.closest('.smlt .fx');if(!c)return;var r=c.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;c.style.setProperty('--mx',x+'px');c.style.setProperty('--my',y+'px');
if(c.classList.contains('tilt'))c.style.transform='rotateX('+((r.height/2-y)/r.height*7).toFixed(2)+'deg) rotateY('+((x-r.width/2)/r.width*7).toFixed(2)+'deg)'},{passive:true});
document.addEventListener('pointerout',function(e){var c=e.target.closest&&e.target.closest('.smlt .fx.tilt');if(c&&!c.contains(e.relatedTarget))c.style.transform=''},{passive:true})})();
