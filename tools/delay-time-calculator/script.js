(function(){
const $=id=>document.getElementById(id);const notes=[['1/1 whole',4],['1/2 half',2],['1/4 quarter',1],['1/8 eighth',.5],['1/16 sixteenth',.25],['1/32',.125]];
const ms=v=>v>=1000?(v/1000).toFixed(2)+' s':v.toFixed(1)+' ms';
function run(){const b=+$('bpm').value;if(!(b>=20&&b<=320)){$('show').textContent='20–320';return}const q=60000/b;$('show').innerHTML=b+' <small>BPM</small>';
 $('tb').innerHTML=notes.map(([n,m])=>`<tr${m===.5?' class="hi"':''}><td>${n}</td><td>${ms(q*m)}</td><td>${m===.5?'★ ':''}${ms(q*m*1.5)}</td><td>${ms(q*m*2/3)}</td></tr>`).join('');
 $('rv').innerHTML=[['Pre-delay 1/64',q/16],['Pre-delay 1/32',q/8],['Short decay 1/4',q],['Medium decay 1/2',q*2],['Long decay 1 bar',q*4]].map(([n,v])=>`<span class="chip">${n}: <b>${v>=1000?(v/1000).toFixed(2)+' s':v.toFixed(0)+' ms'}</b></span>`).join('')}
let taps=[];function tap(){const t=performance.now();if(taps.length&&t-taps[taps.length-1]>2000)taps=[];taps.push(t);if(taps.length>8)taps.shift();
 if(taps.length>1){$('bpm').value=Math.round(60000/((taps[taps.length-1]-taps[0])/(taps.length-1)));run();$('tapinfo').textContent=taps.length+' taps averaged';}else $('tapinfo').textContent='Keep tapping…'}
$('tap').onclick=tap;document.addEventListener('keydown',e=>{if(e.key.toLowerCase()==='t'&&!/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))tap()});
$('bpm').addEventListener('input',run);run();

})();
(function(){document.querySelectorAll('[data-copy]').forEach(function(b){b.addEventListener('click',function(){var t=document.getElementById(b.dataset.copy);navigator.clipboard.writeText(t.value).then(function(){b.textContent='Copied!';setTimeout(function(){b.textContent='Copy code'},1500)},function(){t.select()})})});
if(matchMedia('(hover:none),(prefers-reduced-motion:reduce)').matches)return;
document.addEventListener('pointermove',function(e){var c=e.target.closest&&e.target.closest('.smlt .fx');if(!c)return;var r=c.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;c.style.setProperty('--mx',x+'px');c.style.setProperty('--my',y+'px');
if(c.classList.contains('tilt'))c.style.transform='rotateX('+((r.height/2-y)/r.height*7).toFixed(2)+'deg) rotateY('+((x-r.width/2)/r.width*7).toFixed(2)+'deg)'},{passive:true});
document.addEventListener('pointerout',function(e){var c=e.target.closest&&e.target.closest('.smlt .fx.tilt');if(c&&!c.contains(e.relatedTarget))c.style.transform=''},{passive:true})})();
