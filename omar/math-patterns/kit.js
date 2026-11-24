/* Omar lesson kit: one source -> interactive lesson (browser) AND MP4 (render.py uses ?mode=video). Needs gsap.min.js, durations.js (window.DUR). */
(function(){
const K = window.K = {W:1280, H:720, mode:(new URLSearchParams(location.search).get('mode')==='video')?'video':'play'};
const NS='http://www.w3.org/2000/svg';
K.res=(p)=>(window.ASSETS&&window.ASSETS[p])||p;
K.sfxBase = window.SFX_BASE || 'sfx/'; K.aext = window.AUDIO_EXT || 'wav';
K.THEMES = {
  sky:    {bg1:'#FFF7E8',bg2:'#DDF1FF',accent:'#2F6FED',accent2:'#FF9F1C',blobs:['#BFE3FF','#FFE0A8','#D7C8FF','#BDF0DC']},
  mint:   {bg1:'#F1FFF6',bg2:'#D6F5E6',accent:'#12A06C',accent2:'#F2A31B',blobs:['#BDEBD2','#FFF1B8','#C9E6FF','#E6D7FF']},
  sunset: {bg1:'#FFF4E6',bg2:'#FFE3E3',accent:'#F0622F',accent2:'#7B5CFA',blobs:['#FFD3B3','#FFC2D4','#FFF0A8','#D9CCFF']},
  grape:  {bg1:'#F6F0FF',bg2:'#DCE8FF',accent:'#6B4EE6',accent2:'#FF9F1C',blobs:['#D9CCFF','#BFD6FF','#FFD6E6','#FFF0B8']},
  gold:   {bg1:'#FFFBEA',bg2:'#E4F6EC',accent:'#0F8F6A',accent2:'#E0A100',blobs:['#FFE9A6','#BFEBD6','#D6E8FF','#FFD9C2']}
};
const rng=(seed)=>()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
K.rng=rng;
K.el=function(parent,tag='div',cls='',css={},html=''){const e=document.createElement(tag);if(cls)e.className=cls;if(html!=='')e.innerHTML=html;Object.assign(e.style,css);(parent||document.body).appendChild(e);return e};
K.svg=function(parent,html,css={}){const d=K.el(parent,'div','abs',css);d.innerHTML=html;return d};
K.ICON={ // simple svg icons (NO emoji anywhere: the render machine has no emoji font)
 check:'<svg viewBox="0 0 48 48" width="100%" height="100%"><path d="M10 25l9 9 19-20" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
 cross:'<svg viewBox="0 0 48 48" width="100%" height="100%"><path d="M12 12l24 24M36 12L12 36" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round"/></svg>',
 bulb:'<svg viewBox="0 0 48 48" width="100%" height="100%"><path d="M24 5a13 13 0 0 0-7 24v5h14v-5A13 13 0 0 0 24 5z" fill="#FFC93C"/><rect x="17" y="36" width="14" height="4" rx="2" fill="#F5A524"/><rect x="19" y="42" width="10" height="3" rx="1.5" fill="#F5A524"/></svg>',
 star:'<svg viewBox="0 0 48 48" width="100%" height="100%"><path d="M24 4l6 13 14 2-10 10 3 14-13-7-13 7 3-14L4 19l14-2z" fill="#FFC93C" stroke="#F5A524" stroke-width="3" stroke-linejoin="round"/></svg>',
 play:'<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>',
 pause:'<svg viewBox="0 0 24 24"><path d="M7 5h4v14H7zM13 5h4v14h-4z"/></svg>',
 replay:'<svg viewBox="0 0 24 24"><path d="M12 5V2L7 6l5 4V7a5 5 0 1 1-5 5H5a7 7 0 1 0 7-7z"/></svg>',
 next:'<svg viewBox="0 0 24 24"><path d="M15.5 5l-7 7 7 7" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
 prev:'<svg viewBox="0 0 24 24"><path d="M8.5 5l7 7-7 7" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
 sound:'<svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 4V5L7 9zM16 8a5 5 0 0 1 0 8M18.5 5.5a9 9 0 0 1 0 13" stroke="#fff" stroke-width="2" fill="#fff" stroke-linecap="round"/></svg>',
 mute:'<svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 4V5L7 9z"/><path d="M16 9l5 6M21 9l-5 6" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>'
};

/* ---------- mascot "Nujaim" (little star) ---------- */
function starPath(cx,cy,R,r){let p=[];for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rad=i%2?r:R;p.push((cx+rad*Math.cos(a)).toFixed(1)+','+(cy+rad*Math.sin(a)).toFixed(1))}return 'M'+p.join('L')+'Z'}
const MASCOT=`<svg viewBox="0 0 200 200" width="200" height="200" style="overflow:visible">
<g class="mb">
 <g class="armsDown"><path d="M50 124L26 146M150 124L174 146" stroke="#F5A524" stroke-width="20" stroke-linecap="round"/><path d="M50 124L26 146M150 124L174 146" stroke="#FFC93C" stroke-width="13" stroke-linecap="round"/></g>
 <g class="armsUp" style="visibility:hidden"><path d="M48 118L18 70M152 118L182 70" stroke="#F5A524" stroke-width="20" stroke-linecap="round"/><path d="M48 118L18 70M152 118L182 70" stroke="#FFC93C" stroke-width="13" stroke-linecap="round"/></g>
 <path d="${starPath(100,108,86,46)}" fill="#FFC93C" stroke="#F5A524" stroke-width="18" stroke-linejoin="round"/>
 <path d="${starPath(100,108,86,46)}" fill="#FFD95E" stroke="#FFD95E" stroke-width="6" stroke-linejoin="round" transform="translate(100 108) scale(.94) translate(-100 -108)"/>
 <circle cx="62" cy="128" r="10" fill="#FF8FA8" opacity=".6"/><circle cx="138" cy="128" r="10" fill="#FF8FA8" opacity=".6"/>
 <g class="eyesN"><g class="eyeL"><ellipse cx="78" cy="104" rx="13" ry="15" fill="#fff"/><g class="pupil"><circle cx="78" cy="106" r="7.5" fill="#1B2A49"/><circle cx="75.5" cy="103" r="2.6" fill="#fff"/></g></g>
   <g class="eyeR"><ellipse cx="122" cy="104" rx="13" ry="15" fill="#fff"/><g class="pupil"><circle cx="122" cy="106" r="7.5" fill="#1B2A49"/><circle cx="119.5" cy="103" r="2.6" fill="#fff"/></g></g></g>
 <g class="eyesH" style="visibility:hidden"><path d="M64 108Q78 90 92 108M108 108Q122 90 136 108" stroke="#1B2A49" stroke-width="6" fill="none" stroke-linecap="round"/></g>
 <path class="mSmile" d="M84 128Q100 144 116 128" stroke="#1B2A49" stroke-width="6" fill="none" stroke-linecap="round"/>
 <g class="mBig" style="visibility:hidden"><path d="M78 122Q100 160 122 122Z" fill="#7A1F2B" stroke="#1B2A49" stroke-width="4" stroke-linejoin="round"/><path d="M90 142Q100 134 110 142Q100 150 90 142Z" fill="#FF7A8F"/></g>
 <ellipse class="mO" cx="100" cy="134" rx="7" ry="9" fill="#7A1F2B" style="visibility:hidden"/>
 <g class="talk" style="visibility:hidden"><circle cx="100" cy="132" r="22" fill="#FFD95E"/><g class="tm"><ellipse cx="100" cy="132" rx="14" ry="11" fill="#7A1F2B"/><path d="M90 138Q100 130 110 138Q100 146 90 138Z" fill="#FF7A8F"/></g></g>
 <g class="qm" style="visibility:hidden"><circle cx="160" cy="40" r="22" fill="#fff" stroke="#7B5CFA" stroke-width="5"/><text x="160" y="50" text-anchor="middle" font-family="Baloo" font-weight="800" font-size="30" fill="#7B5CFA">؟</text></g>
</g></svg>`;

/* ---------- init ---------- */
K.init=function(o={}){
  const theme=K.THEMES[o.theme||'sky']; K.theme=theme;
  document.documentElement.lang='ar'; document.documentElement.dir='rtl';
  const wrap=K.el(document.body,'div','',{}); wrap.id='wrap';
  const stage=K.el(wrap,'div',K.mode); stage.id='stage'; K.stage=stage;
  stage.style.setProperty('--bg1',theme.bg1);stage.style.setProperty('--bg2',theme.bg2);stage.style.setProperty('--accent',theme.accent);stage.style.setProperty('--accent2',theme.accent2);
  const bg=K.el(stage,'div'); bg.id='bg'; K.blobs=[]; const r=rng(5);
  for(let i=0;i<9;i++){const s=120+r()*200;const b=K.el(bg,'i','',{width:s+'px',height:s+'px',left:(r()*1280-60)+'px',top:(r()*720-60)+'px',background:theme.blobs[i%4]});K.blobs.push({b,bx:parseFloat(b.style.left),by:parseFloat(b.style.top),p:r()*6,sp:.15+r()*.25,a:20+r()*30})}
  K.scenesLayer=K.el(stage,'div'); K.scenesLayer.id='scenes';
  K.hud=K.el(stage,'div'); K.hud.id='hud';
  // mascot
  K.mw=K.el(K.hud,'div','abs',{left:'1040px',top:'440px',width:'200px',height:'200px',transform:'scale(.8)',transformOrigin:'0 0',visibility:'hidden'}); K.mw.innerHTML=MASCOT;
  const q=(c)=>K.mw.querySelector(c); K.m={mb:q('.mb'),armsDown:q('.armsDown'),armsUp:q('.armsUp'),eyesN:q('.eyesN'),eyesH:q('.eyesH'),mSmile:q('.mSmile'),mBig:q('.mBig'),mO:q('.mO'),talk:q('.talk'),tm:q('.tm'),qm:q('.qm'),pupils:K.mw.querySelectorAll('.pupil'),eyeL:q('.eyeL'),eyeR:q('.eyeR')};
  const tl=K.tl=gsap.timeline({paused:true,defaults:{ease:'power2.out'}});
  const S=K.S={t:0,events:[],talk:[],breaks:[],scenes:[],hooks:[],capLayer:null,sceneN:0};
  S.capLayer=K.el(K.hud,'div'); 
  if(o.music!==false) S.music={file:(o.music||'music_calm'),gain:o.musicGain||.13};
  tl.set(K.mw,{autoAlpha:1},0);
  return S;
};
K.mood=function(t,name,dur){
  const m=K.m,tl=K.tl,v=(e,on)=>tl.set(e,{autoAlpha:on?1:0},t);
  const cfg={happy:{eN:1,eH:0,sm:1,big:0,o:0,dn:1,up:0,qm:0,px:0,py:0},think:{eN:1,eH:0,sm:0,big:0,o:1,dn:1,up:0,qm:1,px:-3,py:-5},cheer:{eN:0,eH:1,sm:0,big:1,o:0,dn:0,up:1,qm:0,px:0,py:0},wow:{eN:1,eH:0,sm:0,big:0,o:1,dn:0,up:1,qm:0,px:0,py:-2}}[name||'happy'];
  v(m.eyesN,cfg.eN);v(m.eyesH,cfg.eH);v(m.mSmile,cfg.sm);v(m.mBig,cfg.big);v(m.mO,cfg.o);v(m.armsDown,cfg.dn);v(m.armsUp,cfg.up);v(m.qm,cfg.qm);
  tl.set(m.pupils,{x:cfg.px,y:cfg.py},t);
};
/* move/scale the mascot (x,y = top-left px of the 200x200 box, s = scale) */
K.mascotTo=function(t,x,y,s=.8,dur=.6){K.tl.to(K.mw,{left:x,top:y,scale:s,duration:dur,ease:'power3.inOut'},t)};
K.mascotHide=function(t){K.tl.to(K.mw,{autoAlpha:0,duration:.25},t)};
K.mascotShow=function(t){K.tl.to(K.mw,{autoAlpha:1,duration:.25},t)};

/* ---------- ambient motion (bob, blink, blobs, lipsync) ---------- */
function ambient(t,a){
  a=(a===undefined)?t:a; const S=K.S;
  K.blobs.forEach(o=>{o.b.style.transform=`translate(${Math.sin(a*o.sp+o.p)*o.a}px,${Math.cos(a*o.sp*1.3+o.p)*o.a}px)`});
  const m=K.m; m.mb.setAttribute('transform',`translate(0 ${Math.sin(a*2.4)*3.5}) rotate(${Math.sin(a*1.2)*1.6} 100 108)`);
  const ph=a%3.4, blink=ph>3.25?Math.max(.08,1-(1-Math.abs(ph-3.325)/.075)):1;
  m.eyeL.setAttribute('transform',`translate(0 104) scale(1 ${blink}) translate(0 -104)`);m.eyeR.setAttribute('transform',`translate(0 104) scale(1 ${blink}) translate(0 -104)`);
  let open=0,talking=false;
  for(const k of S.talk){ if(t>=k.t0&&t<=k.t1){const i=Math.min(k.env.length-1,Math.floor((t-k.t0)*24));open=Math.max(.15,(k.env[i]+ (k.env[i+1]||0))/2);talking=true;break}}
  m.talk.style.visibility=talking?'visible':'hidden';
  if(talking) m.tm.setAttribute('transform',`translate(100 132) scale(${.65+.45*open} ${.2+1.0*open}) translate(-100 -132)`);
}
K.ambient=ambient;

/* ---------- captions with word highlight ---------- */
function addCaption(S,t0,t1,text){
  const c=K.el(S.capLayer,'div','cap'); c.dir='rtl';
  const words=text.split(/\s+/).filter(Boolean); const spans=words.map(w=>K.el(c,'span','w','',w));
  const total=words.reduce((a,w)=>a+w.length+1,0); let acc=0;
  K.tl.set(c,{autoAlpha:1},t0).set(c,{autoAlpha:0},t1+.25);
  const hi=getComputedStyle(K.stage).getPropertyValue('--accent');
  spans.forEach((s,i)=>{K.tl.set(s,{color:hi.trim()||'#2F6FED'},t0+(t1-t0)*acc/total*0.96);acc+=words[i].length+1});
  return c;
}
/* ---------- sequencer ---------- */
K.say=function(id,o={}){
  const S=K.S,d=window.DUR&&window.DUR[id]; if(!d) throw new Error('no audio line: '+id);
  const t0=S.t,t1=t0+d.d;
  S.events.push({t:t0,src:'audio/'+id,gain:o.gain||1,narr:1});
  S.talk.push({t0,t1,env:d.env});
  if(o.cap!==false) addCaption(S,t0,t1,d.cap||d.text||'');
  if(o.mood) K.mood(t0,o.mood);
  S.t=t1+(o.gap??.25); return {t0,t1};
};
K.wait=function(sec){K.S.t+=sec};
K.sfx=function(name,offset=0,gain=1){K.S.events.push({t:K.S.t+offset,sfx:name,gain})};
K.onEnter=function(fn){K.S.hooks.push({t:K.S.t,fn})};

/* ---------- scene wrapper ---------- */
K.scene=function(id,build,o={}){
  const S=K.S,tl=K.tl; const el=K.el(K.scenesLayer,'div','scene'); el.dataset.id=id;
  const t0=S.t; S.scenes.push({id,t:t0}); tl.set(el,{autoAlpha:0},0).to(el,{autoAlpha:1,duration:.4},t0);
  K.sfx('whoosh',0,.35);
  build(el,S,t0);
  if(o.wait!==false) S.breaks.push({type:'next',t:S.t,scene:id});
  tl.to(el,{autoAlpha:0,duration:.35},S.t); S.t+=.35; return el;
};
/* standard lesson slide: coloured title pill on top, content area y 120..610 */
K.slide=function(id,title,build,o={}){
  return K.scene(id,(el,S,t0)=>{
    const col=o.color||getComputedStyle(K.stage).getPropertyValue('--accent').trim();
    const p=K.el(el,'div','pill h1',{left:'50%',top:'26px',transform:'translateX(-50%)',background:col,fontSize:(o.titleSize||44)+'px',minWidth:'420px',whiteSpace:'nowrap'},title);
    K.tl.from(p,{y:-80,autoAlpha:0,duration:.5,ease:'back.out(1.6)'},t0+.1);
    if(o.mascot!==false) K.mascotTo(t0,o.mascot?o.mascot[0]:1050,o.mascot?o.mascot[1]:440,o.mascot?o.mascot[2]:.8,.5);
    build(el,S,t0+.2);
  },o);
};
/* staggered pop-in; returns last time */
K.pops=function(els,t,o={}){const st=o.stagger??.35;els.forEach((e,i)=>{K.tl.from(e,{scale:.3,autoAlpha:0,duration:.45,ease:'back.out(1.8)',transformOrigin:'50% 50%'},t+i*st);if(o.sfx!==false)K.S.events.push({t:t+i*st,sfx:'pop',gain:.5})});return t+els.length*st};
K.pulse=function(el,t,dur=.9,sc=1.07){K.tl.to(el,{scale:sc,duration:dur/2,yoyo:true,repeat:1,ease:'sine.inOut',transformOrigin:'50% 50%'},t)};
K.glow=function(el,t,dur,color){K.tl.to(el,{boxShadow:`0 0 0 8px ${color||'#FFC93C'}, 0 0 34px 10px ${color||'#FFC93C'}`,duration:.25},t).to(el,{boxShadow:'0 8px 22px rgba(30,50,100,.16)',duration:.25},t+dur)};
K.card=function(parent,o={}){return K.el(parent,'div','card',{left:o.x+'px',top:o.y+'px',width:o.w+'px',height:o.h+'px',background:o.bg||'#fff',borderRadius:(o.r||28)+'px',overflow:o.overflow||'hidden',...(o.css||{})},o.html||'')};
K.text=function(parent,html,o={}){return K.el(parent,'div','txt',{left:(o.x||0)+'px',top:(o.y||0)+'px',width:(o.w||600)+'px',fontSize:(o.size||40)+'px',color:o.color||'var(--ink)',textAlign:o.align||'center',fontWeight:o.weight||700,fontFamily:o.font||'',...(o.css||{})},html)};
K.img=function(parent,src,o={}){return K.el(parent,'img','abs',{left:(o.x||0)+'px',top:(o.y||0)+'px',width:o.w?o.w+'px':'auto',height:o.h?o.h+'px':'auto',objectFit:o.fit||'contain',borderRadius:(o.r||0)+'px',boxShadow:o.shadow?'0 10px 26px rgba(30,50,100,.22)':'none',...(o.css||{})}).setAttribute('src',src)||parent.lastChild};
K.confetti=function(parent,t,o={}){const r=rng(o.seed||3),cols=['#FF5D8F','#FFC93C','#2F6FED','#19B37D','#7B5CFA','#FF9F1C'];const cx=o.x??640,cy=o.y??260,n=o.n||46;
  for(let i=0;i<n;i++){const e=K.el(parent,'div','abs',{left:cx+'px',top:cy+'px',width:(10+r()*10)+'px',height:(6+r()*10)+'px',background:cols[i%6],borderRadius:r()<.4?'50%':'3px',visibility:'hidden'});
   const ang=r()*Math.PI*2,sp=160+r()*380,dx=Math.cos(ang)*sp,dy=Math.sin(ang)*sp*.6-120,rot=(r()-.5)*900;
   K.tl.set(e,{autoAlpha:1,x:0,y:0,rotation:0},t).to(e,{x:dx,y:dy,rotation:rot,duration:.55,ease:'power2.out'},t).to(e,{y:dy+520+r()*200,x:dx*1.15,rotation:rot*1.6,autoAlpha:0,duration:1.5,ease:'power1.in'},t+.55)}};
K.shakeOnce=function(node){gsap.to(node,{keyframes:{x:[0,-16,16,-12,12,-6,0],easeEach:'none'},duration:.5})};

/* ---------- timer ring ---------- */
K.timer=function(parent,x,y,size,sec,t0,o={}){
  const S=K.S,tl=K.tl,R=size*.38,C=2*Math.PI*R,sw=size*.09;
  const box=K.el(parent,'div','abs',{left:x+'px',top:y+'px',width:size+'px',height:size+'px',visibility:'hidden'});
  box.innerHTML=`<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}"><circle cx="${size/2}" cy="${size/2}" r="${R+sw*.9}" fill="#fff" opacity=".95"/><circle cx="${size/2}" cy="${size/2}" r="${R}" fill="none" stroke="#E4ECFA" stroke-width="${sw}"/><circle class="ring" cx="${size/2}" cy="${size/2}" r="${R}" fill="none" stroke="var(--accent)" stroke-width="${sw}" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="0" transform="rotate(-90 ${size/2} ${size/2})"/></svg>`;
  const ring=box.querySelector('.ring'); const nums=[];
  for(let i=0;i<sec;i++){const n=K.el(box,'div','h1',{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:(size*.42)+'px',color:'var(--ink)',visibility:'hidden'},String(sec-i));nums.push(n)}
  tl.set(box,{autoAlpha:1},t0).from(box,{scale:.5,duration:.4,ease:'back.out(2)',transformOrigin:'50% 50%'},t0);
  tl.fromTo(ring,{strokeDashoffset:0},{strokeDashoffset:C,duration:sec,ease:'none'},t0);
  tl.to(ring,{stroke:'#FF9F1C',duration:.6},t0+Math.max(0,sec-3));
  nums.forEach((n,i)=>{tl.set(n,{autoAlpha:1},t0+i).set(n,{autoAlpha:0},t0+i+1);if(o.tick!==false)S.events.push({t:t0+i,sfx:i>=sec-3?'tock':'tick',gain:.45})});
  if(o.tick!==false)S.events.push({t:t0+sec,sfx:'timeup',gain:.5});
  return box;
};

/* ---------- quiz scene (the heart of the interaction) ----------
 K.quiz({id,n,total,q,qId,opts:[{t:'text',img:'x.png',id:'optAudioId'}],correct:[i,...],layout:'list'|'row'|'tf',timer:10,ansId,cheerId,askId,multi:false}) */
K.quiz=function(o){
  const S=K.S,tl=K.tl; const cheerIds=['cheer1','cheer2','cheer3','cheer4'];
  const cols=['#2F6FED','#FF9F1C','#7B5CFA','#FF5D8F'];
  let opts=o.opts; if(o.layout==='tf'||o.tf){opts=[{t:'صَحّ',tfIcon:'check',col:'#19B37D'},{t:'خَطَأ',tfIcon:'cross',col:'#FF5D8F'}]}
  const nOpt=opts.length; const letters=['أ','ب','ج','د'];
  const correct=o.correct; const handle={};
  K.scene(o.id,(el,_S,t0)=>{
    K.mascotTo(t0,50,445,.8,.5); K.mood(t0,'happy');
    // header
    const hp=K.el(el,'div','pill',{right:'40px',top:'22px',background:'var(--accent)',fontSize:'26px'},o.tf?'صَحّ أَمْ خَطَأ':(o.multi?'اخْتَرْ أَكْثَرَ مِنْ إِجَابَةٍ':'اخْتَرِ الْإِجَابَةَ الصَّحِيحَةَ'));
    if(o.n){const np=K.el(el,'div','pill',{left:'40px',top:'22px',background:'var(--accent2)',fontSize:'26px'},`سُؤَالٌ ${o.n} مِنْ ${o.total}`);tl.from(np,{x:-60,autoAlpha:0,duration:.4},t0+.1)}
    tl.from(hp,{x:60,autoAlpha:0,duration:.4},t0+.1);
    const qc=K.card(el,{x:40,y:76,w:1200,h:o.qh||140,r:30,css:{display:'flex',alignItems:'center',justifyContent:'center',padding:'10px 40px',overflow:'visible'}});
    const ql=(o.q||'').length; K.el(qc,'div','h1',{fontSize:(o.qsize||(ql>80?34:ql>50?40:46))+'px',textAlign:'center',color:'var(--ink)'},o.q);
    tl.from(qc,{y:-60,autoAlpha:0,scale:.9,duration:.55,ease:'back.out(1.5)'},t0+.25);
    // options
    const ox=330,oy=o.qh?76+o.qh+24:240,ow=910,oh=600-oy; const items=[]; const optsStart=S.t;
    opts.forEach((p,i)=>{
      const row=o.layout==='row'||(p.img&&o.layout!=='list');
      let x,y,w,h;
      if(o.layout==='tf'){w=(ow-40)/2;h=Math.min(330,oh);x=ox+(1-i)*(w+40);y=oy+(oh-h)/2}
      else if(row){w=(ow-(nOpt-1)*24)/nOpt;h=oh;x=ox+(nOpt-1-i)*(w+24);y=oy}
      else{h=Math.min(120,(oh-(nOpt-1)*16)/nOpt);w=ow;x=ox;y=oy+i*(h+16)}
      const d=K.el(el,'div','opt'+(row?' row':''),{left:x+'px',top:y+'px',width:w+'px',height:h+'px'}); const sh=K.el(d,'div','shake');
      const c=p.col||cols[i%4];
      if(o.layout==='tf'){sh.style.flexDirection='column';sh.style.justifyContent='center';sh.style.background=c;sh.style.borderColor=c;
        K.el(sh,'div','',{width:'110px',height:'110px'},K.ICON[p.tfIcon].replace('stroke="#fff"','stroke="#fff"'));K.el(sh,'div','h1',{color:'#fff',fontSize:'64px',marginTop:'8px'},p.t)}
      else if(row){ const ih=Math.round(h*.68);
        if(p.img){const im=K.el(sh,'div','',{width:'100%',height:ih+'px',background:`#F4F8FF url('${p.img}') center/contain no-repeat`,flex:'none'})}
        const lt=K.el(sh,'div','',{display:'flex',alignItems:'center',justifyContent:'center',gap:'12px',flex:1,width:'100%',padding:'0 10px'});
        K.el(lt,'div','lt',{width:'48px',height:'48px',fontSize:'28px',margin:0,background:c},letters[i]);K.el(lt,'div','ot',{fontSize:'34px',textAlign:'center',padding:0},p.t||'')}
      else{ K.el(sh,'div','lt',{background:c},letters[i]); K.el(sh,'div','ot',{fontSize:(o.osize||(h<100?34:38))+'px'},p.t);
        if(p.img){K.el(sh,'div','',{width:h-10+'px',height:h-10+'px',background:`url('${p.img}') center/contain no-repeat`,margin:'0 10px'})} }
      const badge=K.el(d,'div','badge',{},`<div style="width:40px;height:40px">${K.ICON.check}</div>`);
      items.push({d,sh,badge,c,optId:(o.optIds&&o.optIds[i])||null,row});
    });
    items.forEach((it,i)=>{tl.from(it.d,{x:-60,autoAlpha:0,duration:.45,ease:'back.out(1.4)'},optsStart+.2+i*.18);S.events.push({t:optsStart+.2+i*.18,sfx:'pop',gain:.45})});
    // narration: question, then each option
    K.mood(S.t,'happy');
    if(o.qId) K.say(o.qId,{cap:false});
    items.forEach((it,i)=>{ if(o.optIds&&o.optIds[i]){const t=S.t; const r=K.say(o.optIds[i],{cap:false,gap:.2});
        tl.to(it.d,{scale:1.05,duration:.2,transformOrigin:'50% 50%'},r.t0).to(it.d,{scale:1,duration:.25},r.t1);
        tl.to(it.sh,{borderColor:it.c,duration:.2},r.t0).to(it.sh,{borderColor:'#E4ECFA',duration:.25},r.t1)} });
    handle.optsShow=optsStart+.9;
    // think + timer
    K.mood(S.t,'think'); K.mascotTo(S.t,60,445,.8,.01);
    if(o.askId!==false){K.say(o.askId||'ask1',{cap:false})}
    const tsec=o.timer||10, ts=S.t;
    const tbox=K.timer(el,70,240,190,tsec,ts); handle.t0=ts; S.t=ts+tsec+.2; handle.t1=S.t;
    // reveal
    const tr=S.t; handle.reveal=tr;
    tl.to(tbox,{autoAlpha:0,scale:.6,duration:.3},tr);
    K.mood(tr,'cheer'); K.sfx('ding'); S.events.push({t:tr+.35,sfx:'tada',gain:.7});
    items.forEach((it,i)=>{ if(correct.includes(i)){
        tl.to(it.sh,{borderColor:'#19B37D',background:'#E8FBF2',duration:.3},tr).to(it.d,{scale:1.06,duration:.35,ease:'back.out(3)',transformOrigin:'50% 50%'},tr).set(it.badge,{autoAlpha:1},tr+.1).from(it.badge,{scale:0,duration:.4,ease:'back.out(3)'},tr+.1)
      } else tl.to(it.d,{opacity:.3,scale:.96,duration:.4,transformOrigin:'50% 50%'},tr) });
    K.confetti(el,tr+.05,{x:780,y:330,seed:o.n||2});
    K.mascotTo(tr,50,425,.85,.3);
    S.t=tr+.4;
    K.say(o.cheerId||cheerIds[(o.n||0)%4],{cap:false,gap:.15});
    if(o.ansId) K.say(o.ansId,{cap:true,gap:.5});
    K.mood(S.t,'happy');
    handle.items=items;
  },{wait:true});
  // register interaction (play mode)
  const id=o.id; S.breaks.push({type:'ask',t:handle.optsShow,t0:handle.t0,t1:handle.t1,reveal:handle.reveal,scene:id,correct,multi:!!o.multi,items:handle.items,quiz:true});
  return handle;
};

/* title / finale helpers */
K.titleScene=function(o){
  return K.scene(o.id||'title',(el,S,t0)=>{
    const big=K.el(el,'div','h1',{position:'absolute',left:'80px',right:'80px',top:'110px',textAlign:'center',fontSize:(o.size||86)+'px',color:'var(--accent)',textShadow:'0 6px 0 rgba(255,255,255,.9)'},o.title);
    const sub=K.el(el,'div','h1',{position:'absolute',left:'80px',right:'80px',top:(o.subTop||285)+'px',textAlign:'center',fontSize:'46px',color:'var(--ink)'},o.sub||'');
    K.tl.from(big,{scale:.4,autoAlpha:0,duration:.8,ease:'elastic.out(1,.6)',transformOrigin:'50% 50%'},t0+.2).from(sub,{y:40,autoAlpha:0,duration:.6},t0+.8);
    K.mascotTo(t0,540,400,1.0,.01); K.mood(t0,'cheer'); K.confetti(el,t0+.3,{x:640,y:300,n:60,seed:9}); K.sfx('tada',.2,.6);
    if(o.say) o.say.forEach(id=>K.say(id)); K.wait(.3);
    K.mood(S.t,'happy');
  });
};
K.finaleScene=function(o){
  return K.scene(o.id||'finale',(el,S,t0)=>{
    const big=K.el(el,'div','h1',{position:'absolute',left:'80px',right:'80px',top:'110px',textAlign:'center',fontSize:'84px',color:'var(--accent2)',textShadow:'0 6px 0 rgba(255,255,255,.9)'},o.title||'أَحْسَنْتَ يَا عُمَرْ!');
    K.tl.from(big,{scale:.3,autoAlpha:0,duration:.8,ease:'elastic.out(1,.55)',transformOrigin:'50% 50%'},t0+.2);
    const stars=[];for(let i=0;i<5;i++)stars.push(K.el(el,'div','abs',{left:(380+i*108)+'px',top:'240px',width:'96px',height:'96px'},K.ICON.star));
    stars.forEach((s,i)=>{K.tl.from(s,{scale:0,rotation:-120,duration:.5,ease:'back.out(2.2)'},t0+.8+i*.25);K.S.events.push({t:t0+.8+i*.25,sfx:'star',gain:.6})});
    const sc=K.el(el,'div','h1',{position:'absolute',left:'0',right:'0',top:'350px',textAlign:'center',fontSize:'42px',color:'var(--ink)'},o.sub||'');
    K.finaleScoreEl=sc; K.onEnter(()=>{ if(K.mode==='play'&&K.stats.asked){sc.textContent=`أَجَبْتَ صَحِيحًا مِنْ أَوَّلِ مَرَّةٍ عَلَى ${K.stats.first} مِنْ ${K.stats.asked} أَسْئِلَةٍ`}});
    K.mascotTo(t0,540,420,.9,.01); K.mood(t0,'cheer'); K.confetti(el,t0+.3,{x:640,y:300,n:70,seed:21}); K.confetti(el,t0+1.4,{x:300,y:380,n:40,seed:22});K.confetti(el,t0+1.4,{x:980,y:380,n:40,seed:23});
    K.sfx('tada',.1,.8);
    if(o.say) o.say.forEach(id=>K.say(id)); K.wait(1.2);
  },{wait:false});
};
K.stats={asked:0,first:0};

/* ---------- start: expose render(t) for the video renderer, or run the interactive player ---------- */
K.start=function(o={}){
  const S=K.S,tl=K.tl;
  window.TOTAL=S.t+.8; window.AUDIO_EVENTS=S.events.sort((a,b)=>a.t-b.t); window.MUSIC=S.music;
  window.render=function(t,a){tl.time(t,false);ambient(t,a)};
  S.events=window.AUDIO_EVENTS;
  document.fonts.ready.then(()=>{
    window.render(0); fit();
    if(K.mode==='video'){window.READY=true;return}
    K.player(o);
  });
  function fit(){if(K.mode==='video')return;const bar=84,s=Math.min(innerWidth/1280,(innerHeight-bar)/720);K.stage.style.transform=`scale(${s})`;K.stage.style.margin=`${(720*s-720)/2}px ${(1280*s-1280)/2}px`}
  addEventListener('resize',fit);
};

K.player=function(o={}){
  const S=K.S,tl=K.tl,events=S.events,TOTAL=window.TOTAL;
  let aclk=0,t=0,prev=-1,playing=false,wait=null,muted=false,last=performance.now(),started=false,wrong=0;
  const active=new Set(); let musicEl=null; const cache={};
  const doneBreaks=new Set();
  const mk=(src)=>{const a=new Audio(K.res(src));a.preload='auto';return a};
  const audioFor=(e)=>{const src=(e.src?e.src:K.sfxBase+e.sfx)+'.'+K.aext;return cache[src]||(cache[src]=mk(src))};
  // ---- Web Audio layer: every clip is decoded up front and played from buffers, so playback never depends on per-element autoplay rules (iOS/Safari dropped some clips otherwise)
  try{ if(navigator.audioSession) navigator.audioSession.type='playback' }catch(_){}
  const AC=window.AudioContext||window.webkitAudioContext; let ctx=null; try{ctx=AC?new AC():null}catch(_){ctx=null}
  const bufs={}, loading={}; const keyOf=(e)=>(e.src?e.src:K.sfxBase+e.sfx)+'.'+K.aext;
  const toAB=(url)=>{ if(url.indexOf('data:')===0){const b=atob(url.slice(url.indexOf(',')+1));const u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i);return Promise.resolve(u.buffer)} return fetch(url).then(r=>r.arrayBuffer()) };
  const decode=(ab)=>new Promise((res,rej)=>{const p=ctx.decodeAudioData(ab,res,rej); if(p&&p.catch)p.catch(rej)});
  const load=(key)=>{ if(!ctx)return Promise.resolve(); if(bufs[key])return Promise.resolve(); return loading[key]||(loading[key]=toAB(K.res(key)).then(decode).then(b=>{bufs[key]=b}).catch(()=>{})) };
  const preload=()=>{ const keys=new Set(); events.forEach(e=>keys.add(keyOf(e))); ['oops','pop'].forEach(n=>keys.add(K.sfxBase+n+'.'+K.aext)); ['retry1','retry2'].forEach(n=>{if(window.DUR&&window.DUR[n])keys.add('audio/'+n+'.'+K.aext)}); return Promise.all([...keys].map(load)) };
  function fire(e){ if(muted)return; const key=keyOf(e); const b=bufs[key];
    if(ctx&&b){ try{ if(ctx.state!=='running'&&playing)ctx.resume(); const s=ctx.createBufferSource(); s.buffer=b; const g=ctx.createGain(); g.gain.value=Math.min(1,(e.gain||1)*(e.src?1:.8)); s.connect(g); g.connect(ctx.destination); s.start(0);
        if(e.src){const h={stop(){try{s.stop()}catch(_){}}}; active.add(h); s.onended=()=>active.delete(h)} return }catch(_){} }
    const base=audioFor(e); const a=e.src?base:base.cloneNode(); a.volume=Math.min(1,(e.gain||1)*(e.src?1:.8)); if(e.src){active.add(a);a.onended=()=>active.delete(a)} try{a.currentTime=0}catch(_){} a.play().catch(()=>{}) }
  function stopAll(){active.forEach(a=>{try{if(a.stop){a.stop()}else{a.pause();a.currentTime=0}}catch(e){}});active.clear()}
  // ---- controls
  const wrap=document.getElementById('wrap'); const bar=K.el(wrap,'div'); bar.id='controls';
  const mkb=(id,icon,label)=>{const b=K.el(bar,'button','',{},K.ICON[icon]+(label?`<span>${label}</span>`:''));b.id=id;return b};
  const bPrev=mkb('bPrev','prev','السَّابِق'),bRe=mkb('bRe','replay','أَعِدْ'),bPlay=mkb('bPlay','pause',''),bSnd=mkb('bSnd','sound',''),bNext=mkb('bNext','next','التَّالِي');
  function setNext(on){bNext.classList.toggle('pulse',!!on)}
  function sceneIdx(tt){let k=0;S.scenes.forEach((s,i)=>{if(s.t<=tt+1e-6)k=i});return k}
  function jump(nt){for(const b of [...doneBreaks]){if(b.t>nt-.001)doneBreaks.delete(b)} stopAll();t=Math.max(0,Math.min(TOTAL-.01,nt));prev=t-1e-6;wait=null;setNext(false);window.render(t)}
  bRe.onclick=()=>{jump(S.scenes[sceneIdx(t)].t);playing=true;setPlay()};
  bPrev.onclick=()=>{const i=sceneIdx(t);const cur=S.scenes[i].t;jump(S.scenes[(t-cur>2||i===0)?i:i-1].t);playing=true;setPlay()};
  bNext.onclick=()=>{ if(wait&&wait.type==='next'){const b=wait;wait=null;setNext(false);stopAll();playing=true;setPlay();return}
     const i=sceneIdx(t);const n=S.scenes[i+1]; if(n){jump(n.t);playing=true;setPlay()} };
  bPlay.onclick=()=>{playing=!playing;if(!playing){active.forEach(a=>{if(a.pause)a.pause()});if(ctx)ctx.suspend().catch(()=>{})}else{if(ctx)ctx.resume().catch(()=>{});active.forEach(a=>{if(a.play)a.play().catch(()=>{})})}setPlay()};
  bSnd.onclick=()=>{muted=!muted;bSnd.innerHTML=K.ICON[muted?'mute':'sound'];if(muted){stopAll()} if(musicEl)musicEl.volume=muted?0:.13};
  function setPlay(){bPlay.innerHTML=K.ICON[playing?'pause':'play']}
  // ---- quiz clicks
  S.breaks.filter(b=>b.quiz).forEach(b=>{ let sel=new Set(); K.stats.asked++; let wrongHere=0;
    const conf=K.el(b.items[0].d.parentNode,'div','pill h1',{left:'330px',top:'560px',background:'#19B37D',fontSize:'30px',visibility:'hidden',pointerEvents:'auto',cursor:'pointer'},'تَأْكِيدُ الْإِجَابَةِ');
    b.confBtn=conf;
    const win=()=>{ if(!wrongHere)K.stats.first++; stopAll(); doneBreaks.add(b); conf.style.visibility='hidden'; wait=null; t=b.reveal; prev=t-1e-6; window.render(t); setNext(false) };
    const bad=(it)=>{ wrongHere++; K.shakeOnce(it.sh); fire({sfx:'oops',gain:.7}); const id=wrongHere%2?'retry1':'retry2'; if(window.DUR&&window.DUR[id]&&!muted){fire({src:'audio/'+id,gain:1})}
        if(wrongHere>=2){const ci=b.correct[0];gsap.fromTo(b.items[ci].d,{scale:1},{scale:1.08,duration:.35,yoyo:true,repeat:3,ease:'sine.inOut'})} };
    b.items.forEach((it)=>{ if(!it.optId||it.sh.querySelector('.spk'))return; const sp=K.el(it.sh,'div','spk',{position:'absolute',left:'10px',top:it.row?'8px':'50%',marginTop:it.row?'0':'-24px',width:'48px',height:'48px',borderRadius:'50%',background:'rgba(47,111,237,.14)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',pointerEvents:'auto',zIndex:5},'<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#2F6FED" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="#2F6FED"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/><path d="M19 6a8.5 8.5 0 0 1 0 12"/></svg>');
      sp.onclick=(ev)=>{ ev.stopPropagation(); if(muted)return; try{const a=new Audio(K.res('audio/'+it.optId+'.'+K.aext));a.play().catch(()=>{});active.add(a);a.onended=()=>active.delete(a)}catch(_){} } });
    b.items.forEach((it,i)=>{ it.sh.onclick=()=>{ if(!(t>=b.t&&t<b.reveal)||doneBreaks.has(b)) return; if(!playing)return;
        if(b.multi){ if(sel.has(i)){sel.delete(i);it.d.classList.remove('sel')}else{sel.add(i);it.d.classList.add('sel')} conf.style.visibility=sel.size?'visible':'hidden'; fire({sfx:'pop',gain:.5}); return }
        if(b.correct.includes(i)) win(); else bad(it) } });
    conf.onclick=()=>{ const ok=sel.size===b.correct.length&&b.correct.every(i=>sel.has(i)); if(ok) win(); else {sel.forEach(i=>{b.items[i].d.classList.remove('sel')});b.items.forEach(it=>K.shakeOnce(it.sh));sel.clear();conf.style.visibility='hidden';wrongHere++;fire({sfx:'oops',gain:.7})} };
  });
  // ---- main loop
  function frame(now){ requestAnimationFrame(frame); let dt=Math.min(.1,(now-last)/1000); last=now; aclk+=dt; if(!playing||wait){window.render(t,aclk);return}
    let nt=t+dt;
    // stop at breaks
    for(const b of S.breaks){ const stopAt=b.type==='ask'?b.reveal-.2:b.t; if(doneBreaks.has(b)) continue; if(t<stopAt&&nt>=stopAt&&!(b.type==='ask'&&nt>b.reveal)){ nt=stopAt; wait=b; if(b.type==='next')setNext(true); break } }
    // fire events crossed
    for(const e of events){ if(e.t>prev&&e.t<=nt) fire(e) }
    for(const h of S.hooks){ if(h.t>prev&&h.t<=nt) h.fn() }
    prev=nt; t=nt; window.render(t,aclk);
    if(t>=TOTAL-.01){playing=false;setPlay();wait={type:'end'}}
  }
  window.__p={jump:(x)=>jump(x),get t(){return t},get wait(){return wait},get playing(){return playing}};
  // ---- splash
  const sp=K.el(K.stage,'div'); sp.id='splash';
  K.el(sp,'div','h1',{fontSize:'72px',color:'var(--accent)'},o.title||'هَيَّا نَتَعَلَّمْ');
  K.el(sp,'div','h1',{fontSize:'40px',color:'var(--ink)'},o.sub||'');
  const sb=K.el(sp,'button','',{},'جَارٍ التَّحْمِيلُ...'); sb.disabled=true; sb.style.opacity='.6'; const enableStart=()=>{sb.disabled=false;sb.style.opacity='';sb.textContent='ابْدَأْ'}; let enabled=false; const go=()=>{if(!enabled){enabled=true;enableStart()}}; const st=K.el(sp,'div','',{fontSize:'18px',color:'#7A8AA8',direction:'ltr'},'v2 audio: loading'); const upd=()=>{const n=Object.keys(bufs).length; st.textContent='v2 audio: '+(ctx?n+' clips ready':'fallback')}; if(ctx){preload().then(()=>{upd();go()});setTimeout(go,25000)}else{go();upd()} 
  const sm=K.el(sp,'div','',{width:'180px',height:'180px',pointerEvents:'none'}); sm.innerHTML=MASCOT.replace('width="200" height="200"','width="180" height="180"');
  sb.onclick=()=>{ try{ if(ctx){ctx.resume();const e0=ctx.createBuffer(1,1,22050),s0=ctx.createBufferSource();s0.buffer=e0;s0.connect(ctx.destination);s0.start(0)} }catch(_){} sp.remove(); started=true; playing=true; setPlay(); last=performance.now();
    if(S.music&&!muted){musicEl=new Audio(K.res(K.sfxBase+S.music.file+'.'+K.aext));musicEl.loop=true;musicEl.volume=S.music.gain;musicEl.play().catch(()=>{})}
    t=0;prev=-1; requestAnimationFrame(frame) };
  setPlay(); requestAnimationFrame(frame);
};
})();
