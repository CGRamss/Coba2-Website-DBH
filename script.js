(() => {
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
const accent=(c)=>document.documentElement.style.setProperty('--accent',c);

/* boot */
const boot=$('#boot'), pct=$('#bootPct'), log=$('#bootLog');
let p=0; const bootMsgs=['BIOS // CONNECTING...','NEURAL BUS // ONLINE','CYBERLIFE NETWORK // HANDSHAKE','ANDROID OS // LOADED','ARCHIVE // DECRYPTED'];
const bootTimer=setInterval(()=>{p=Math.min(100,p+Math.ceil(Math.random()*12));pct.textContent=p+'%';log.textContent=bootMsgs[Math.min(4,Math.floor(p/21))];if(p>=100){clearInterval(bootTimer);setTimeout(()=>boot.classList.add('done'),400)}},100);

/* cursor */
const cursor=$('#cursor');
addEventListener('pointermove',e=>{
  cursor.style.left=e.clientX+'px';
  cursor.style.top=e.clientY+'px';
  cursor.classList.add('on');
});
$$('a,button,.gallery-item').forEach(x=>{x.addEventListener('pointerenter',()=>cursor.classList.add('hot'));x.addEventListener('pointerleave',()=>cursor.classList.remove('hot'))});
addEventListener('pointerdown',()=>cursor.classList.add('clicking'));
addEventListener('pointerup',()=>cursor.classList.remove('clicking'));

/* particles */
const cv=$('#particles'),ctx=cv.getContext('2d');let W,H,dots=[];
function resize(){W=cv.width=innerWidth;H=cv.height=innerHeight;dots=Array.from({length:Math.min(75,Math.floor(W/18))},()=>({x:Math.random()*W,y:Math.random()*H,r:.3+Math.random()*1.4,v:.08+Math.random()*.35}))}
resize();addEventListener('resize',resize);
(function draw(){ctx.clearRect(0,0,W,H);ctx.fillStyle='#21c9f355';for(const d of dots){d.y-=d.v;if(d.y<0){d.y=H;d.x=Math.random()*W}ctx.beginPath();ctx.arc(d.x,d.y,d.r,0,7);ctx.fill()}requestAnimationFrame(draw)})();

/* nav + page code */
const topbar=$('.topbar'), sections=$$('.section[id]'), navLinks=$$('#mainNav a'), page=$('#pageCode');
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){navLinks.forEach(a=>a.classList.toggle('active',a.dataset.section===e.target.id));page.textContent='SYS.'+String([...sections].indexOf(e.target)+1).padStart(2,'0')}}),{threshold:.4});
sections.forEach(s=>io.observe(s));
addEventListener('scroll',()=>topbar.classList.toggle('scrolled',scrollY>30),{passive:true});
$('#menuBtn').addEventListener('click',()=>$('#mainNav').classList.toggle('open'));
navLinks.forEach(a=>a.addEventListener('click',()=>$('#mainNav').classList.remove('open')));

/* hero parallax */
const hero=$('.hero__city');
addEventListener('pointermove',e=>{if(!reduce)hero.style.transform=`translate(${(e.clientX/innerWidth-.5)*-12}px,${(e.clientY/innerHeight-.5)*-7}px) scale(1.04)`});

/* immersive reveal */
const revealObserver=new IntersectionObserver(entries=>entries.forEach(e=>{
  if(e.isIntersecting) e.target.classList.add('revealed');
}),{threshold:.14});
$$('.section-head,.synopsis-copy,.synopsis-map,.story-card,.case-console,.timeline-wrap article,.cyber-content,.gallery-item,.download-copy,.store-card,.network-card').forEach(el=>{el.classList.add('reveal');revealObserver.observe(el)});

/* character database */
const charData={
 connor:{color:'#21c9f3',name:'CONNOR',model:'RK800 // UNIT #313 248 317',body:'Prototype detective android assigned to Detroit Police. Equipped with advanced forensic analysis, reconstruction and social modules. Mission status is dynamically affected by player decisions.'},
 kara:{color:'#68d9ff',name:'KARA',model:'AX400 // DOMESTIC ASSISTANT',body:'Domestic assistant android whose story centers on protecting Alice and finding a path to freedom. Her archive tracks care, survival and the human relationships she forms.'},
 markus:{color:'#4169e1',name:'MARKUS',model:'RK200 // COMPANION MODEL',body:'Companion android and caretaker for painter Carl Manfred. His path expands into a movement for android freedom, shaped by choices about protest, sacrifice and conflict.'}
};
const panels=$$('.character-panel'), tabs=$$('.char-tab');
function selectChar(name){
 panels.forEach(p=>p.classList.toggle('active',p.dataset.panel===name));
 tabs.forEach(t=>t.classList.toggle('active',t.dataset.char===name));
 accent(charData[name].color);
}
tabs.forEach(t=>t.addEventListener('click',()=>selectChar(t.dataset.char)));

/* modal */
const modal=$('#profileModal'), modalName=$('#modalName'), modalModel=$('#modalModel'), modalBody=$('#modalBody');
$$('[data-profile]').forEach(b=>b.addEventListener('click',()=>{let d=charData[b.dataset.profile];modalName.textContent=d.name;modalModel.textContent=d.model;modalBody.textContent=d.body;modal.classList.add('open')}));
$$('[data-close]').forEach(b=>b.addEventListener('click',()=>b.closest('.overlay-panel,.modal,.lightbox').classList.remove('open')));
addEventListener('keydown',e=>{if(e.key==='Escape')$$('.overlay-panel.open,.modal.open,.lightbox.open').forEach(x=>x.classList.remove('open'))});

/* case files */
const cases={
 hostage:['THE HOSTAGE','A rooftop standoff. A deviant android. One child in danger. Reconstruct the scene, profile the suspect and decide how far the investigation should go.'],
 eden:['EDEN CLUB','Two TRACI units are missing. A crime scene full of contradictory evidence forces the investigator to separate programmed behavior from intent.'],
 nest:['THE NEST','A fugitive android disappears into an abandoned house. Evidence, environmental clues and a witness can reconstruct what happened.'],
 bridge:['RUSSIAN ROULETTE','A late-night apartment call reveals the personal cost of an investigation and the complicated bond between an android detective and his partner.']
};
const caseTitle=$('#caseTitle'),caseText=$('#caseText');
$$('.case').forEach(b=>b.addEventListener('click',()=>{ $$('.case').forEach(x=>x.classList.remove('active'));b.classList.add('active');let d=cases[b.dataset.case];caseTitle.textContent=d[0];caseText.textContent=d[1];toast('CASE '+b.dataset.case.toUpperCase()+' // FILE LOADED')}));
$('#scanCase').addEventListener('click',()=>toast('EVIDENCE ANALYSIS COMPLETE // 5 OBJECTS INDEXED'));

/* search */
const searchPanel=$('#searchPanel'), searchInput=$('#searchInput'), results=$('#searchResults');
const searchable=[
['CONNOR','RK800 // Detective','characters'],['KARA','AX400 // Caretaker','characters'],['MARKUS','RK200 // Revolution','characters'],['THE STORY','Detroit 2038 // Synopsis','synopsis'],
['DEVIANT BEHAVIOR','Narrative core','story'],['THE HOSTAGE','DPD case file 001','cases'],['EDEN CLUB','DPD case file 002','cases'],
['CYBERLIFE','Corporate archive','cyberlife'],['MEMORY FRAGMENTS','Visual archive','gallery'],['DOWNLOAD','Official stores','download']
];
function renderSearch(q=''){results.innerHTML='';searchable.filter(x=>x.join(' ').toLowerCase().includes(q.toLowerCase())).forEach(x=>{let b=document.createElement('button');b.innerHTML=`<b>${x[0]}</b><br><small>${x[1]}</small>`;b.onclick=()=>{searchPanel.classList.remove('open');document.getElementById(x[2]).scrollIntoView({behavior:'smooth'})};results.appendChild(b)})}
$('#searchBtn').addEventListener('click',()=>{searchPanel.classList.add('open');searchInput.focus();renderSearch()});
searchInput.addEventListener('input',e=>renderSearch(e.target.value));

/* gallery lightbox */
const lightbox=$('#lightbox'), lbImg=$('#lightboxImg');
$$('[data-lightbox]').forEach(b=>b.addEventListener('click',()=>{lbImg.src=b.dataset.lightbox;lightbox.classList.add('open')}));

/* diagnostic / toast */
function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>t.classList.remove('show'),2600)}
$('#diagnosticBtn').addEventListener('click',()=>{accent('#f5c542');toast('DIAGNOSTIC // ALL CORE SYSTEMS NOMINAL');setTimeout(()=>accent('#21c9f3'),1600)});
$$('[data-toast]').forEach(b=>b.addEventListener('click',()=>toast(b.dataset.toast)));

/* clock */
function clock(){const d=new Date();$('#clock').textContent=[d.getHours(),d.getMinutes(),d.getSeconds()].map(x=>String(x).padStart(2,'0')).join(':')}
setInterval(clock,1000);clock();

/* sound toggle: UI ambience state only, no external audio dependency */
let sound=false;$('#soundBtn').addEventListener('click',()=>{sound=!sound;$('#soundBtn').textContent=sound?'◉':'○';toast(sound?'AMBIENT CHANNEL ENABLED':'AMBIENT CHANNEL MUTED')});
})();