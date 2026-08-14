/* ============================================================
   ODYSSEY — motion & atmosphere engine (zero dependencies)
   ============================================================ */
(function(){
"use strict";
const prefersReduced = true;
const isCoarse = matchMedia('(pointer: coarse)').matches;
/* Decorative canvases do not need full device-pixel resolution.  This cap avoids
   rendering several full-screen scenes at 2×/3× resolution on high-DPI displays. */
const DPR = Math.min(window.devicePixelRatio || 1, 1.25);
const lerp = (a,b,t)=>a+(b-a)*t;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));

/* ---------- loader ---------- */
const loader = document.getElementById('loader');
const loaderBar = document.getElementById('loaderBar');
const loaderWord = document.getElementById('loaderWord');
loaderWord.innerHTML = loaderWord.textContent.split('').map((c,i)=>
  `<span style="animation-delay:${(i*0.09).toFixed(2)}s">${c}</span>`).join('');
let lp = 0;
const lt = setInterval(()=>{
  lp = Math.min(100, lp + 6 + Math.random()*12);
  loaderBar.style.width = lp + '%';
  if (lp >= 100){ clearInterval(lt); setTimeout(hideLoader, 450); }
}, 130);
function hideLoader(){
  loader.classList.add('is-done');
  document.body.dispatchEvent(new Event('odyssey:ready'));
}

/* ---------- hero title letters ---------- */
const heroTitle = document.getElementById('heroTitle');
heroTitle.innerHTML = heroTitle.textContent.split('').map((c,i)=>
  `<span style="animation-delay:${(2.1 + i*0.12).toFixed(2)}s">${c}</span>`).join('');

/* ---------- custom cursor + magnetic ---------- */
if (!isCoarse){
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  let mx=innerWidth/2,my=innerHeight/2,rx=mx,ry=my;
  addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;});
  (function cur(){
    rx=lerp(rx,mx,.16); ry=lerp(ry,my,.16);
    dot.style.transform=`translate(${mx}px,${my}px) translate(-50%,-50%)`;
    ring.style.transform=`translate(${rx}px,${ry}px) translate(-50%,-50%)`;
    requestAnimationFrame(cur);
  })();
  document.querySelectorAll('[data-hover]').forEach(el=>{
    el.addEventListener('mouseenter',()=>ring.classList.add('is-hover'));
    el.addEventListener('mouseleave',()=>ring.classList.remove('is-hover'));
  });
  /* magnetic buttons */
  document.querySelectorAll('[data-magnetic]').forEach(btn=>{
    let bx=0,by=0,tx=0,ty=0,raf=null;
    const loop=()=>{
      bx=lerp(bx,tx,.18); by=lerp(by,ty,.18);
      btn.style.transform=`translate(${bx}px,${by}px)`;
      if (Math.abs(bx-tx)>.2||Math.abs(by-ty)>.2) raf=requestAnimationFrame(loop); else raf=null;
    };
    btn.addEventListener('mousemove',e=>{
      const r=btn.getBoundingClientRect();
      tx=(e.clientX-r.left-r.width/2)*.28;
      ty=(e.clientY-r.top-r.height/2)*.34;
      if(!raf) raf=requestAnimationFrame(loop);
    });
    btn.addEventListener('mouseleave',()=>{tx=0;ty=0;if(!raf)raf=requestAnimationFrame(loop);});
  });
}

/* ---------- nav ---------- */
const nav = document.getElementById('nav');
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
burger.addEventListener('click',()=>{
  burger.classList.toggle('is-open');
  mobileMenu.classList.toggle('is-open');
});
mobileMenu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
  burger.classList.remove('is-open'); mobileMenu.classList.remove('is-open');
}));

/* ---------- reveal observer ---------- */
const io = new IntersectionObserver(entries=>{
  entries.forEach(en=>{
    if (en.isIntersecting){
      const d = parseInt(en.target.dataset.delay||0,10);
      setTimeout(()=>en.target.classList.add('in'), d);
      io.unobserve(en.target);
    }
  });
},{threshold:.16, rootMargin:'0px 0px -6% 0px'});
document.querySelectorAll('.rv,.rv-scale,.rv-left,.rv-right,.itin-day').forEach(el=>io.observe(el));

/* ---------- counters ---------- */
const cio = new IntersectionObserver(entries=>{
  entries.forEach(en=>{
    if (!en.isIntersecting) return;
    cio.unobserve(en.target);
    const el = en.target, target = +el.dataset.count, t0 = performance.now(), dur = 2200;
    (function tick(t){
      const p = clamp((t-t0)/dur,0,1);
      const e = 1-Math.pow(1-p,4);
      el.textContent = Math.round(target*e).toLocaleString();
      if (p<1) requestAnimationFrame(tick);
    })(t0);
  });
},{threshold:.6});
document.querySelectorAll('[data-count]').forEach(el=>cio.observe(el));

/* ---------- tilt cards + light follow ---------- */
if (!isCoarse && !prefersReduced){
  document.querySelectorAll('[data-tilt]').forEach(card=>{
    let raf=null, cx=0, cy=0, tx=0, ty=0;
    const loop=()=>{
      cx=lerp(cx,tx,.12); cy=lerp(cy,ty,.12);
      card.style.transform=`perspective(900px) rotateY(${cx}deg) rotateX(${cy}deg)`;
      if (Math.abs(cx-tx)>.05||Math.abs(cy-ty)>.05) raf=requestAnimationFrame(loop); else raf=null;
    };
    card.addEventListener('mousemove',e=>{
      const r=card.getBoundingClientRect();
      const px=(e.clientX-r.left)/r.width, py=(e.clientY-r.top)/r.height;
      tx=(px-.5)*7; ty=(0.5-py)*7;
      card.style.setProperty('--mx',(px*100)+'%');
      card.style.setProperty('--my',(py*100)+'%');
      if(!raf) raf=requestAnimationFrame(loop);
    });
    card.addEventListener('mouseleave',()=>{tx=0;ty=0;if(!raf)raf=requestAnimationFrame(loop);});
  });
}

/* ---------- expanding programme cards — inspired by the supplied accordion interaction, built dependency-free ---------- */
(function(){
  const wrap=document.getElementById('eventsExpanded');if(!wrap)return;const cards=[...wrap.querySelectorAll('[data-event-card]')];
  function activate(card){cards.forEach(item=>{const active=item===card;item.classList.toggle('is-active',active);item.setAttribute('aria-expanded',active?'true':'false')})}
  cards.forEach(card=>{card.setAttribute('aria-expanded',card.classList.contains('is-active')?'true':'false');card.addEventListener('click',()=>activate(card));card.addEventListener('mouseenter',()=>{if(!isCoarse)activate(card)});card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();activate(card)}})});
})();

/* ---------- event carousel — content is deliberately centralized for the forthcoming programme ---------- */
(function(){
  const carousel=document.getElementById('eventsCarousel');if(!carousel)return;
  const slides=[...carousel.querySelectorAll('.event-slide')],dots=carousel.querySelector('.event-dots');let current=0,timer;
  slides.forEach((_,i)=>{const b=document.createElement('button');b.className='event-dot'+(i===0?' is-active':'');b.type='button';b.setAttribute('aria-label',`Show event ${i+1}`);b.addEventListener('click',()=>show(i));dots.appendChild(b)});
  const dotButtons=[...dots.children];function show(next){current=(next+slides.length)%slides.length;slides.forEach((slide,i)=>{slide.classList.toggle('is-active',i===current);slide.setAttribute('aria-hidden',i===current?'false':'true')});dotButtons.forEach((dot,i)=>dot.classList.toggle('is-active',i===current));}
  carousel.querySelector('[data-event-prev]').addEventListener('click',()=>show(current-1));carousel.querySelector('[data-event-next]').addEventListener('click',()=>show(current+1));
  if(!prefersReduced){const start=()=>timer=setInterval(()=>show(current+1),7000);start();carousel.addEventListener('mouseenter',()=>clearInterval(timer));carousel.addEventListener('mouseleave',start)}
})();

/* ---------- tracks tabs ---------- */
const tabs = document.querySelectorAll('.track-tab');
const panels = document.querySelectorAll('.track-detail');
tabs.forEach(tab=>{
  const activate=()=>{
    tabs.forEach(t=>t.classList.toggle('is-active', t===tab));
    panels.forEach(p=>p.classList.toggle('is-active', p.dataset.panel===tab.dataset.track));
  };
  tab.addEventListener('click',activate);
  tab.addEventListener('mouseenter',activate);
});

/* ---------- marquee duplicate ---------- */
const mq = document.getElementById('marqueeTrack');
mq.innerHTML += mq.innerHTML;

/* ---------- registration ---------- */
document.getElementById('regForm').addEventListener('submit',e=>{
  e.preventDefault();
  const form = e.target;
  if (!form.checkValidity()){ form.reportValidity(); return; }
  form.style.transition='opacity .7s var(--ease-soft), transform .7s var(--ease-soft)';
  form.style.opacity='0'; form.style.transform='translateY(-18px)';
  setTimeout(()=>{
    form.style.display='none';
    document.getElementById('regSuccess').style.display='block';
  },700);
});

/* ============================================================
   SCROLL ENGINE — one rAF loop, lerped values
   ============================================================ */
const heroContent = document.getElementById('heroContent');
const stormSection = document.getElementById('storm');
window.__stormParallax = 0;   /* read by the storm renderer for sky drift */
const itinWrap = document.getElementById('itinWrap');
const itinFill = document.getElementById('itinFill');
let scrollY = window.scrollY, smoothY = scrollY;

addEventListener('scroll',()=>{ scrollY = window.scrollY; },{passive:true});

function scrollLoop(){
  smoothY = lerp(smoothY, scrollY, prefersReduced ? 1 : .085);

  /* nav state */
  nav.classList.toggle('is-scrolled', scrollY > 40);

  /* hero parallax + fade */
  const hh = innerHeight;
  const hp = clamp(smoothY/hh, 0, 1);
  heroContent.style.transform = `translateY(${smoothY*0.34}px) scale(${1-hp*0.06})`;
  heroContent.style.opacity = String(1 - hp*1.25);

  /* storm parallax — fed into the canvas scene for layered depth */
  const sr = stormSection.getBoundingClientRect();
  if (sr.bottom > 0 && sr.top < hh){
    const sp = clamp((hh - sr.top)/(hh + sr.height), 0, 1);
    window.__stormParallax = sp - .5;
  }

  /* itinerary path fill */
  const ir = itinWrap.getBoundingClientRect();
  const ip = clamp((hh*0.72 - ir.top)/ir.height, 0, 1);
  itinFill.style.height = (ip*100).toFixed(2) + '%';

  requestAnimationFrame(scrollLoop);
}
requestAnimationFrame(scrollLoop);

/* ============================================================
   OCEAN — realistic layered water  (hero)
   ============================================================ */
function makeOcean(canvas, opts){
  const ctx = canvas.getContext('2d');
  let W=0, H=0, t = Math.random()*100;
  const o = Object.assign({
    horizon:.56, layers:7, moon:true, glitter:true, dim:1, speed:1, ship:false, roughness:1
  }, opts||{});
  let glints = [];

  function resize(){
    const r = canvas.parentElement.getBoundingClientRect();
    W = Math.floor(r.width*DPR); H = Math.floor(r.height*DPR);
    canvas.width = W; canvas.height = H;
    glints = [];
    const n = Math.floor(W/12);
    for (let i=0;i<n;i++){
      glints.push({
        x: Math.random(), y: Math.random(),
        w: 6+Math.random()*30, s: .4+Math.random()*1.4,
        ph: Math.random()*Math.PI*2
      });
    }
  }
  resize();
  addEventListener('resize', resize);

  let visible = true;
  new IntersectionObserver(en=>{visible = en[0].isIntersecting;},{threshold:0})
    .observe(canvas);

  /* Ship and water use the identical wave equation, so its hull remains at the waterline. */
  function drawHeroShip(time){
    if (!o.ship) return;
    const hor=H*o.horizon;
    const px=W*.68,p=.46,yBase=hor+Math.pow(p,1.65)*(H-hor)*.96+6,amp=(2+Math.pow(p,1.8)*26)*DPR,freq=.012/DPR*(1-p*.72),spd=time*(.5+p*1.05);
    const wave=x=>yBase+Math.sin(x*freq+spd)*amp*.62+Math.sin(x*freq*2.13-spd*1.4)*amp*.27+Math.sin(x*freq*.47+spd*.6)*amp*.34;
    const waterY=wave(px),pitch=Math.atan2(wave(px+38*DPR)-wave(px-38*DPR),76*DPR)*.78,bob=Math.sin(time*.72)*1.8*DPR,S=clamp(W/(330*DPR),1.15,3.05)*DPR;
    ctx.save();ctx.translate(px,waterY-5*S+bob);ctx.rotate(pitch);ctx.scale(S,S);
    ctx.strokeStyle='rgba(215,225,226,.18)';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(-28,5);ctx.quadraticCurveTo(-60,9,-89,18);ctx.stroke();
    const hull=ctx.createLinearGradient(0,-8,0,8);hull.addColorStop(0,'#1b2027');hull.addColorStop(1,'#05080d');ctx.fillStyle=hull;ctx.beginPath();
    ctx.strokeStyle='#10151d';ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(0,-2);ctx.lineTo(0,-46);ctx.stroke();const sail=ctx.createLinearGradient(-15,-39,14,-12);sail.addColorStop(0,'rgba(225,213,181,.8)');sail.addColorStop(1,'rgba(126,120,104,.68)');ctx.fillStyle=sail;ctx.beginPath();ctx.moveTo(-16,-39);ctx.lineTo(16,-39);ctx.quadraticCurveTo(20,-24,13,-11);ctx.quadraticCurveTo(0,-8,-13,-12);ctx.quadraticCurveTo(-18,-24,-16,-39);ctx.fill();ctx.strokeStyle='rgba(143,107,42,.6)';ctx.lineWidth=.7;ctx.beginPath();ctx.moveTo(-15,-27);ctx.quadraticCurveTo(0,-24,15,-27);ctx.stroke();
    /* The ship’s lantern is the human counter-light to the Cyclops eye. */
    const lantern=ctx.createRadialGradient(-9,-5,0,-9,-5,12);lantern.addColorStop(0,'rgba(255,244,202,1)');lantern.addColorStop(.16,'rgba(255,218,132,.92)');lantern.addColorStop(.52,'rgba(201,162,75,.28)');lantern.addColorStop(1,'rgba(201,162,75,0)');ctx.fillStyle=lantern;ctx.beginPath();ctx.arc(-9,-5,12,0,7);ctx.fill();ctx.fillStyle='rgba(255,242,190,.96)';ctx.beginPath();ctx.arc(-9,-5,1.15,0,7);ctx.fill();ctx.restore();
  }

  function draw(){
    if (!visible){ requestAnimationFrame(draw); return; }
    t += 0.016 * o.speed;
    const hor = H*o.horizon;
    const moonX = W*0.5, moonY = H*0.30;

    /* sky */
    const sky = ctx.createLinearGradient(0,0,0,hor);
    sky.addColorStop(0,'#04070D');
    sky.addColorStop(.55,'#081120');
    sky.addColorStop(.92,'#16283F');
    sky.addColorStop(1,'#23364E');
    ctx.fillStyle = sky;
    ctx.fillRect(0,0,W,hor+2);

    if (o.moon){
      /* golden moon-sun above horizon */
      const glow = ctx.createRadialGradient(moonX,moonY,0,moonX,moonY,H*0.34);
      glow.addColorStop(0,'rgba(235,208,143,0.30)');
      glow.addColorStop(.35,'rgba(201,162,75,0.10)');
      glow.addColorStop(1,'rgba(201,162,75,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0,0,W,hor+2);
      const disc = ctx.createRadialGradient(moonX,moonY,0,moonX,moonY,H*0.045);
      disc.addColorStop(0,'rgba(251,243,220,.95)');
      disc.addColorStop(.7,'rgba(235,208,143,.55)');
      disc.addColorStop(1,'rgba(235,208,143,0)');
      ctx.fillStyle = disc;
      ctx.beginPath(); ctx.arc(moonX,moonY,H*0.05,0,7); ctx.fill();
      /* stars */
      ctx.fillStyle='rgba(244,239,228,.5)';
      for (let i=0;i<26;i++){
        const sx=(Math.sin(i*78.233)*.5+.5)*W;
        const sy=(Math.sin(i*12.989)*.5+.5)*hor*.7;
        const tw=.25+.45*Math.abs(Math.sin(t*.8+i*1.7));
        ctx.globalAlpha=tw;
        ctx.fillRect(sx,sy,1.85*DPR,1.85*DPR);
        /* Fine stellar diffraction makes each celestial point crisp rather than game-like. */
        if (i%6===0 && Math.sin(t*2.35+i*4.1)>.72){
          const sparkle=3.8+2.2*Math.sin(t*2.35+i*4.1);
          ctx.strokeStyle='rgba(255,247,220,.82)';ctx.lineWidth=.5*DPR;
          ctx.beginPath();ctx.moveTo(sx-sparkle*DPR,sy);ctx.lineTo(sx+sparkle*DPR,sy);ctx.moveTo(sx,sy-sparkle*DPR);ctx.lineTo(sx,sy+sparkle*DPR);ctx.stroke();
        }
      }
      ctx.globalAlpha=1;
    }

    /* sea base */
    const sea = ctx.createLinearGradient(0,hor,0,H);
    sea.addColorStop(0,'#1E3450');
    sea.addColorStop(.18,'#13243B');
    sea.addColorStop(.6,'#0A1626');
    sea.addColorStop(1,'#04090F');
    ctx.fillStyle = sea;
    ctx.fillRect(0,hor,W,H-hor);

    /* horizon shimmer line */
    ctx.fillStyle='rgba(235,208,143,.22)';
    ctx.fillRect(0,hor-1,W,1.4*DPR);

    /* wave layers — perspective: tighter & dimmer near horizon */
    for (let L=0; L<o.layers; L++){
      const p = L/(o.layers-1);                      // 0 horizon → 1 shore
      const yBase = hor + Math.pow(p,1.65)*(H-hor)*0.96 + 6;
      const amp  = (2 + Math.pow(p,1.8)*26) * DPR * o.roughness;
      const freq = 0.012/DPR * (1 - p*0.72);
      const spd  = t*(.5 + p*1.05);
      ctx.beginPath();
      ctx.moveTo(0,H);
      for (let x=0;x<=W;x+=6*DPR){
        const y = yBase
          + Math.sin(x*freq + spd)        * amp*.62
          + Math.sin(x*freq*2.13 - spd*1.4)* amp*.27
          + Math.sin(x*freq*.47 + spd*.6) * amp*.34;
        ctx.lineTo(x,y);
      }
      ctx.lineTo(W,H);
      ctx.closePath();
      const a = .10 + p*.16;
      const g = ctx.createLinearGradient(0,yBase-amp,0,yBase+amp*3);
      g.addColorStop(0,`rgba(${30+p*26|0},${58+p*30|0},${92+p*26|0},${a})`);
      g.addColorStop(1,`rgba(${8+p*8|0},${16+p*12|0},${30+p*14|0},${a*1.25})`);
      ctx.fillStyle = g;
      ctx.fill();
      /* crest light */
      ctx.beginPath();
      for (let x=0;x<=W;x+=6*DPR){
        const y = yBase
          + Math.sin(x*freq + spd)        * amp*.62
          + Math.sin(x*freq*2.13 - spd*1.4)* amp*.27
          + Math.sin(x*freq*.47 + spd*.6) * amp*.34;
        x===0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
      }
      ctx.strokeStyle = `rgba(${170+p*60|0},${175+p*45|0},${165+p*20|0},${.045+p*.075})`;
      ctx.lineWidth = (0.7+p*1.3)*DPR;
      ctx.stroke();
    }

    /* The ship is composed above distant swells and below foreground light. */
    drawHeroShip(t);

    /* moonlight glitter path */
    if (o.glitter){
      const bandTop = hor+4, bandH = H-hor-8;
      for (const gl of glints){
        const gy = bandTop + gl.y*bandH;
        const p = (gy-hor)/(H-hor);
        const bandW = W*(0.045 + p*0.34);
        const gx = moonX + (gl.x-.5)*bandW;
        const flick = Math.max(0, Math.sin(t*gl.s*2.2 + gl.ph));
        if (flick < .25) continue;
        const a = flick*(.07 + p*.30)*o.dim;
        ctx.fillStyle = `rgba(235,208,143,${a.toFixed(3)})`;
        const wgl = gl.w*(0.4+p)*DPR*.7;
        ctx.fillRect(gx-wgl/2, gy, wgl, Math.max(1,1.1*DPR*(0.5+p)));
      }
    }

    /* atmospheric depth fog over far water */
    const fog = ctx.createLinearGradient(0,hor,0,hor+(H-hor)*.4);
    fog.addColorStop(0,'rgba(30,52,80,.35)');
    fog.addColorStop(1,'rgba(30,52,80,0)');
    ctx.fillStyle = fog;
    ctx.fillRect(0,hor,W,(H-hor)*.4);

    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
}

makeOcean(document.getElementById('oceanCanvas'), {horizon:.55, layers:10, moon:false, ship:false, roughness:1.38, speed: prefersReduced?0.001:1.16});
makeOcean(document.getElementById('regCanvas'),  {horizon:.30, layers:6, moon:false, dim:.6, speed: prefersReduced?0.001:.7});

/* ============================================================
   STORM CROSSING — procedural storm sky, rain, heavy seas,
   and a trireme that sails the waves edge to edge, forever
   ============================================================ */
(function(){
  const canvas = document.getElementById('stormCanvas');
  const ctx = canvas.getContext('2d');
  let W=0, H=0, t = 0, visible = false;
  let clouds = [], rain = [];
  /* random threat windows; values are shared by waves, ship pitch and the Cyclops reveal */
  let cyclopsIntensity = 0, cyclopsStart = 0, cyclopsUntil = 0, nextCyclops = 3 + Math.random()*3.5, cyclopsX = .20;
  function setCyclopsAtmosphere(value){
    const active=value>.035;
    document.body.classList.toggle('cyclops-looming',active);
    document.body.style.setProperty('--cyclops-dim',(value*.82).toFixed(3));
    document.body.style.setProperty('--cyclops-x',(cyclopsX*100).toFixed(1)+'%');
  }
  function updateCyclopsThreat(){
    if (!prefersReduced && t >= nextCyclops){
      cyclopsStart = t;
      /* A different horizon position makes every sighting feel unplanned. */
      cyclopsX = .13 + Math.random()*.74;
      cyclopsUntil = t + 4.8 + Math.random()*2.7;
      nextCyclops = cyclopsUntil + 12 + Math.random()*13;
    }
    const raw = t < cyclopsUntil ? Math.sin(((t-cyclopsStart)/(cyclopsUntil-cyclopsStart))*Math.PI) : 0;
    cyclopsIntensity = lerp(cyclopsIntensity, Math.max(0,raw), .045);
    setCyclopsAtmosphere(cyclopsIntensity);
    window.__cyclopsThreat = cyclopsIntensity;
  }

  /* ---- storm wave model (shared by sea + ship) ---- */
  const SHIP_LAYER_P = 0.42;          /* depth fraction of the ship's wave layer */
  function layerGeom(p){
    const hor = H*0.46;
    return {
      yBase: hor + Math.pow(p,1.55)*(H-hor)*0.92 + 6,
      amp:  (4 + Math.pow(p,1.6)*46) * DPR * (1 + cyclopsIntensity*.62),
      freq: 0.011/DPR * (1 - p*0.7),
      spd:  (.55 + p*1.1) * (1 + cyclopsIntensity*.18)
    };
  }
  function waveY(x, p, time){
    const g = layerGeom(p);
    const s = time*g.spd;
    return g.yBase
      + Math.sin(x*g.freq        + s)      * g.amp*.58
      + Math.sin(x*g.freq*2.17  - s*1.45)  * g.amp*.26
      + Math.sin(x*g.freq*.43   + s*.62)   * g.amp*.36;
  }

  /* ---- clouds: pre-rendered soft blobs, drifting ---- */
  function makeCloud(){
    const cw = (260+Math.random()*420)*DPR, ch = cw*(.3+Math.random()*.18);
    const c = document.createElement('canvas');
    c.width = cw; c.height = ch;
    const cc = c.getContext('2d');
    const blobs = 7+Math.random()*7|0;
    for (let i=0;i<blobs;i++){
      const bx = cw*(.12+.76*Math.random());
      const by = ch*(.3+.45*Math.random());
      const br = ch*(.22+.3*Math.random());
      const g = cc.createRadialGradient(bx,by,0,bx,by,br);
      const shade = 22+Math.random()*20|0;
      g.addColorStop(0,`rgba(${shade+8},${shade+12},${shade+20},.5)`);
      g.addColorStop(1,'rgba(10,14,22,0)');
      cc.fillStyle=g;
      cc.beginPath(); cc.arc(bx,by,br,0,7); cc.fill();
    }
    return c;
  }
  function buildScene(){
    clouds = [];
    const n = Math.max(7, Math.floor(W/(340*DPR)) + 5);
    for (let i=0;i<n;i++){
      clouds.push({
        img: makeCloud(),
        x: Math.random()*1.3 - .15,
        y: Math.random()*0.26 - 0.04,
        v: (.004 + Math.random()*.011),       /* drift, fraction of W per sec */
        sc: .7 + Math.random()*.9,
        depth: .4 + Math.random()*.6
      });
    }
    rain = [];
    const rn = Math.floor(W/(7*DPR));
    for (let i=0;i<rn;i++){
      rain.push({
        x: Math.random(), y: Math.random(),
        l: (9+Math.random()*16)*DPR,
        v: .9 + Math.random()*.9,
        a: .05 + Math.random()*.12
      });
    }
  }

  function resize(){
    const r = stormSection.getBoundingClientRect();
    W = Math.floor(r.width*DPR); H = Math.floor(r.height*DPR);
    canvas.width = W; canvas.height = H;
    buildScene();
  }
  resize(); addEventListener('resize', resize);

  new IntersectionObserver(en=>{visible = en[0].isIntersecting;if(!visible)setCyclopsAtmosphere(0);},{threshold:0})
    .observe(stormSection);

  /* ---- the trireme ---- */
  const ship = { x: -0.18, y: 0, rot: 0, vx: 0.00026 };  /* x in [−.2, 1.2] */

  function drawShip(time, advance=true){
    const px=ship.x*W;
    /* Scale it down slightly; lift its reference point so the hull rides on — not inside — the wave. */
    const S=clamp(W/(305*DPR),1.15,4.35),u=DPR*S;
    const targetY=waveY(px,SHIP_LAYER_P,time)-7.8*u;
    const ahead=waveY(px+42*DPR,SHIP_LAYER_P,time),behind=waveY(px-42*DPR,SHIP_LAYER_P,time);
    const targetR=Math.atan2(ahead-behind,84*DPR)*.76;
    ship.y=ship.y?lerp(ship.y,targetY,.075):targetY;
    ship.rot=lerp(ship.rot,targetR,.075);
    /* A broader longship silhouette: long black hull, lifted ends and a square crimson sail. */
    ctx.save();ctx.translate(px,ship.y);ctx.rotate(ship.rot);ctx.scale(u,u);

    /* broken foam wake behind the stern */
    ctx.save();ctx.scale(1/u,1/u);const wake=ctx.createLinearGradient(-210*DPR*S,0,-45*DPR*S,0);
    wake.addColorStop(0,'rgba(230,238,237,0)');wake.addColorStop(.75,'rgba(215,229,230,.10)');wake.addColorStop(1,'rgba(232,240,235,.28)');ctx.fillStyle=wake;
    ctx.beginPath();ctx.moveTo(-43*DPR*S,7*DPR*S);ctx.quadraticCurveTo(-112*DPR*S,10*DPR*S,-204*DPR*S,28*DPR*S);ctx.lineTo(-205*DPR*S,42*DPR*S);ctx.quadraticCurveTo(-112*DPR*S,24*DPR*S,-43*DPR*S,16*DPR*S);ctx.closePath();ctx.fill();ctx.restore();

    /* long oars below the gunwale */
    ctx.strokeStyle='rgba(10,15,20,.92)';ctx.lineWidth=1.05;
    for(let i=0;i<11;i++){const ox=-27+i*5.5,sweep=Math.sin(time*2.25+i*.57)*.17;ctx.beginPath();ctx.moveTo(ox,3);ctx.lineTo(ox-7+sweep*9,16+Math.cos(sweep)*2);ctx.stroke()}

    /* curved longship hull and lifted dragon-like ends */
    const hull=ctx.createLinearGradient(0,-11,0,12);hull.addColorStop(0,'#28313a');hull.addColorStop(.24,'#101821');hull.addColorStop(1,'#02060b');ctx.fillStyle=hull;
    ctx.beginPath();ctx.moveTo(-42,-3);ctx.quadraticCurveTo(-48,-20,-39,-27);ctx.quadraticCurveTo(-42,-14,-35,-4);ctx.lineTo(40,-4);ctx.quadraticCurveTo(49,-10,54,-22);ctx.quadraticCurveTo(56,-7,48,1);ctx.lineTo(55,4);ctx.lineTo(46,6);ctx.quadraticCurveTo(8,15,-29,10);ctx.quadraticCurveTo(-39,8,-42,-3);ctx.closePath();ctx.fill();
    ctx.strokeStyle='rgba(205,177,111,.72)';ctx.lineWidth=.78;ctx.stroke();
    ctx.beginPath();ctx.moveTo(-37,-1);ctx.quadraticCurveTo(4,3,49,0);ctx.strokeStyle='rgba(201,162,75,.62)';ctx.lineWidth=.85;ctx.stroke();
    /* shields / crew rhythm along hull */
    for(let i=0;i<12;i++){const cx=-28+i*5.4;ctx.fillStyle=i%2?'rgba(81,28,23,.84)':'rgba(116,79,42,.82)';ctx.beginPath();ctx.arc(cx,-2.8,1.62,0,7);ctx.fill();}
    ctx.fillStyle='rgba(9,13,18,.94)';for(let i=0;i<9;i++){ctx.beginPath();ctx.arc(-21+i*5.2,-7.3,1.12,0,7);ctx.fill()}
    /* prow eye */ctx.fillStyle='rgba(235,208,143,.96)';ctx.beginPath();ctx.arc(45.5,-10.4,1.15,0,7);ctx.fill();

    /* mast, yard and taut rigging */
    ctx.strokeStyle='#0b1119';ctx.lineWidth=1.55;ctx.beginPath();ctx.moveTo(2,-3);ctx.lineTo(2,-57);ctx.stroke();
    ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-34,-50);ctx.lineTo(38,-50);ctx.stroke();
    ctx.strokeStyle='rgba(38,35,30,.86)';ctx.lineWidth=.42;ctx.beginPath();ctx.moveTo(-34,-50);ctx.lineTo(-37,-3);ctx.stroke();ctx.beginPath();ctx.moveTo(38,-50);ctx.lineTo(45,-3);ctx.stroke();

    /* Square red sail, fuller and stitched like a real ancient vessel */
    const billow=7+Math.sin(time*1.7)*1.5+cyclopsIntensity*(6+Math.sin(time*4)*2);
    const sail=ctx.createLinearGradient(-34,-50,38,-9);sail.addColorStop(0,'rgba(143,35,30,.98)');sail.addColorStop(.38,'rgba(114,25,24,.96)');sail.addColorStop(.74,'rgba(82,18,20,.94)');sail.addColorStop(1,'rgba(48,12,16,.92)');
    ctx.fillStyle=sail;ctx.beginPath();ctx.moveTo(-33,-49);ctx.lineTo(37,-49);ctx.quadraticCurveTo(39+billow*.45,-28,34,-10);ctx.quadraticCurveTo(3,-5+billow*.16,-30,-10);ctx.quadraticCurveTo(-37-billow*.35,-28,-33,-49);ctx.closePath();ctx.fill();
    ctx.strokeStyle='rgba(228,163,130,.25)';ctx.lineWidth=.55;ctx.stroke();
    /* seam lines, intentionally uneven under wind */
    ctx.strokeStyle='rgba(49,10,15,.55)';ctx.lineWidth=.5;for(let i=1;i<5;i++){const sy=-49+i*8;ctx.beginPath();ctx.moveTo(-32,sy);ctx.quadraticCurveTo(2,sy+billow*.12,36,sy);ctx.stroke()}
    ctx.strokeStyle='rgba(213,144,112,.15)';ctx.lineWidth=.6;ctx.beginPath();ctx.moveTo(1,-48);ctx.quadraticCurveTo(5+billow*.3,-29,2,-10);ctx.stroke();

    /* pennant */
    const flap=Math.sin(time*5)*1.7;ctx.fillStyle='rgba(201,162,75,.94)';ctx.beginPath();ctx.moveTo(2,-58);ctx.quadraticCurveTo(8,-60+flap*.4,13,-56+flap);ctx.lineTo(7,-55+flap*.5);ctx.quadraticCurveTo(4,-56,2,-55);ctx.closePath();ctx.fill();

    /* Human counter-light: lantern gets brighter during the Cyclops blackout. */
    const lanternPower=.30+cyclopsIntensity*1.35;const lantern=ctx.createRadialGradient(-10,-5,0,-10,-5,13+cyclopsIntensity*9);
    lantern.addColorStop(0,`rgba(255,244,194,${Math.min(1,lanternPower+.35).toFixed(2)})`);lantern.addColorStop(.18,`rgba(255,211,114,${Math.min(1,lanternPower).toFixed(2)})`);lantern.addColorStop(1,'rgba(201,162,75,0)');ctx.fillStyle=lantern;ctx.beginPath();ctx.arc(-10,-5,13+cyclopsIntensity*9,0,7);ctx.fill();ctx.fillStyle=`rgba(255,241,185,${Math.min(1,lanternPower+.35).toFixed(2)})`;ctx.beginPath();ctx.arc(-10,-5,1.18,0,7);ctx.fill();
    ctx.restore();

    /* stronger bow spray when a glare-induced squall hits */
    if(ship.rot<-.022||cyclopsIntensity>.25){ctx.fillStyle=`rgba(228,239,240,${(.15+cyclopsIntensity*.2).toFixed(3)})`;for(let i=0;i<6;i++){const sx=px+(42+Math.random()*19)*u,sy=ship.y+(Math.random()*7-10)*u;ctx.beginPath();ctx.arc(sx,sy,(.9+Math.random()*2.4)*DPR,0,7);ctx.fill()}}
    if(advance){ship.x+=ship.vx*(prefersReduced?0:1);if(ship.x>1.2){ship.x=-.2;ship.y=0}}
  }

  /* The Cyclops arrives only in brief storm windows: a distant threat rather than a permanent character. */
  function drawCyclops(time, intensity){
    if (intensity < .015) return;
    const x=W*cyclopsX,y=H*.46, a=Math.min(1,intensity*1.35), eyeY=y-76*DPR;
    ctx.save();ctx.globalAlpha=a;
    /* broad shoulders are visible only at the height of the squall */
    const body=ctx.createRadialGradient(x,y-92*DPR,8*DPR,x,y-64*DPR,138*DPR);
    body.addColorStop(0,'rgba(5,11,18,.96)');body.addColorStop(.6,'rgba(4,9,15,.76)');body.addColorStop(1,'rgba(4,8,13,0)');
    ctx.fillStyle=body;ctx.beginPath();ctx.ellipse(x,y-53*DPR,102*DPR,112*DPR,0,Math.PI,Math.PI*2);ctx.fill();
    /* one sharp eye: the storm makes it appear to lock onto the crossing */
    const flicker=.72+.28*Math.sin(time*3.2)+.08*Math.sin(time*9.1);
    /* An almond-shaped eye removes the artificial halo/ring and feels embedded in the face. */
    const eye=ctx.createRadialGradient(x,eyeY,0,x,eyeY,17*DPR);
    eye.addColorStop(0,`rgba(255,250,218,${(flicker*1.15).toFixed(2)})`);eye.addColorStop(.22,`rgba(255,222,130,${(flicker*1.02).toFixed(2)})`);eye.addColorStop(.7,`rgba(201,162,75,${(flicker*.36).toFixed(2)})`);eye.addColorStop(1,'rgba(201,162,75,0)');
    ctx.save();ctx.beginPath();ctx.moveTo(x-19*DPR,eyeY);ctx.quadraticCurveTo(x,eyeY-10*DPR,x+19*DPR,eyeY);ctx.quadraticCurveTo(x,eyeY+8*DPR,x-19*DPR,eyeY);ctx.closePath();ctx.clip();ctx.fillStyle=eye;ctx.fillRect(x-22*DPR,eyeY-14*DPR,44*DPR,28*DPR);ctx.restore();
    /* a narrow pupil and heavy brow keep it unsettling but natural */
    ctx.fillStyle=`rgba(8,6,4,${(flicker*.96).toFixed(2)})`;ctx.beginPath();ctx.ellipse(x,eyeY,1.15*DPR,7.7*DPR,0,0,7);ctx.fill();
    ctx.strokeStyle=`rgba(2,6,10,${(.82*a).toFixed(2)})`;ctx.lineWidth=4.4*DPR;ctx.beginPath();ctx.moveTo(x-25*DPR,eyeY-17*DPR);ctx.quadraticCurveTo(x,eyeY-27*DPR,x+26*DPR,eyeY-16*DPR);ctx.stroke();
    ctx.fillStyle=`rgba(255,247,205,${(flicker*.9).toFixed(2)})`;ctx.beginPath();ctx.arc(x-5*DPR,eyeY-2*DPR,.85*DPR,0,7);ctx.fill();
    ctx.restore();
  }

  /* The eye narrows into a broken searchlight aimed at the ship: threat, not a literal laser. */
  function drawThreatGlare(intensity){
    if (intensity < .03) return;
    const ex=W*cyclopsX, ey=H*.46-76*DPR, sx=ship.x*W, sy=ship.y-18*DPR;
    ctx.save();ctx.globalCompositeOperation='screen';
    const beam=ctx.createLinearGradient(ex,ey,sx,sy);
    beam.addColorStop(0,`rgba(255,226,137,${(.16*intensity).toFixed(3)})`);
    beam.addColorStop(.64,`rgba(235,208,143,${(.055*intensity).toFixed(3)})`);
    beam.addColorStop(1,'rgba(235,208,143,0)');
    ctx.fillStyle=beam;ctx.beginPath();ctx.moveTo(ex-4*DPR,ey+2*DPR);ctx.lineTo(ex+4*DPR,ey+2*DPR);ctx.lineTo(sx+34*DPR,sy+15*DPR);ctx.lineTo(sx-34*DPR,sy-15*DPR);ctx.closePath();ctx.fill();
    const target=ctx.createRadialGradient(sx,sy,0,sx,sy,31*DPR);
    target.addColorStop(0,`rgba(255,232,159,${(.42*intensity).toFixed(3)})`);target.addColorStop(.38,`rgba(235,208,143,${(.12*intensity).toFixed(3)})`);target.addColorStop(1,'rgba(235,208,143,0)');
    ctx.fillStyle=target;ctx.beginPath();ctx.arc(sx,sy,31*DPR,0,7);ctx.fill();ctx.restore();
  }

  /* ---- main render ---- */
  function render(){
    if (!visible){ requestAnimationFrame(render); return; }
    t += 0.016;
    updateCyclopsThreat();
    const hor = H*0.46;
    const par = (window.__stormParallax||0);

    /* sky */
    const sky = ctx.createLinearGradient(0,0,0,hor*1.25);
    sky.addColorStop(0,'#05080F');
    sky.addColorStop(.45,'#0B1322');
    sky.addColorStop(.85,'#1A2A40');
    sky.addColorStop(1,'#243750');
    ctx.fillStyle = sky;
    ctx.fillRect(0,0,W,hor+2);

    /* buried storm-light behind the clouds */
    const glow = ctx.createRadialGradient(W*.5,hor*.78,0,W*.5,hor*.78,W*.42);
    glow.addColorStop(0,'rgba(201,162,75,.10)');
    glow.addColorStop(.5,'rgba(120,130,160,.05)');
    glow.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0,0,W,hor+2);

    /* clouds (drift + scroll parallax) */
    for (const cl of clouds){
      cl.x += cl.v*0.016*(prefersReduced?0:1);
      if (cl.x > 1.25) cl.x = -0.35;
      const cw = cl.img.width*cl.sc, ch = cl.img.height*cl.sc;
      const cy = cl.y*H + par*-50*DPR*cl.depth;
      ctx.globalAlpha = .9;
      ctx.drawImage(cl.img, cl.x*W - cw/2, cy, cw, ch);
    }
    ctx.globalAlpha = 1;
    drawCyclops(t, cyclopsIntensity);

    /* sea base */
    const sea = ctx.createLinearGradient(0,hor,0,H);
    sea.addColorStop(0,'#22384F');
    sea.addColorStop(.2,'#152840');
    sea.addColorStop(.65,'#0A1626');
    sea.addColorStop(1,'#04090F');
    ctx.fillStyle = sea;
    ctx.fillRect(0,hor,W,H-hor);

    /* horizon glow line */
    ctx.fillStyle='rgba(190,200,215,.14)';
    ctx.fillRect(0,hor-1,W,1.4*DPR);

    /* wave layers, far → near; ship sails between mid layers */
    const LAYERS = 9;
    let shipDrawn = false;
    for (let L=0; L<LAYERS; L++){
      const p = L/(LAYERS-1);
      if (!shipDrawn && p >= SHIP_LAYER_P){ drawShip(t); shipDrawn = true; }
      const g = layerGeom(p);
      const s = t*g.spd;
      ctx.beginPath();
      ctx.moveTo(0,H);
      for (let x=0;x<=W;x+=6*DPR){
        ctx.lineTo(x, waveY(x,p,t));
      }
      ctx.lineTo(W,H);
      ctx.closePath();
      const a = .12 + p*.17;
      const fg = ctx.createLinearGradient(0,g.yBase-g.amp,0,g.yBase+g.amp*3);
      fg.addColorStop(0,`rgba(${34+p*30|0},${60+p*34|0},${92+p*30|0},${a})`);
      fg.addColorStop(1,`rgba(${8+p*8|0},${15+p*12|0},${28+p*14|0},${a*1.3})`);
      ctx.fillStyle = fg;
      ctx.fill();
      /* foam crest */
      ctx.beginPath();
      for (let x=0;x<=W;x+=6*DPR){
        const y = waveY(x,p,t);
        x===0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
      }
      ctx.strokeStyle = `rgba(${188+p*50|0},${196+p*42|0},${200+p*30|0},${.05+p*.10})`;
      ctx.lineWidth = (0.8+p*1.6)*DPR;
      ctx.stroke();
      /* whitecap flecks on stormy crests */
      if (p > .3){
        ctx.fillStyle = `rgba(225,232,238,${(.04+p*.08).toFixed(3)})`;
        for (let x=((t*60)%180)*DPR; x<W; x+=180*DPR){
          const y = waveY(x,p,t);
          const ph = Math.sin(x*g.freq + t*g.spd);
          if (ph > .55) ctx.fillRect(x, y-1*DPR, (14+p*26)*DPR, 1.3*DPR);
        }
      }
    }

    /* slanted rain */
    ctx.strokeStyle='rgba(190,205,225,1)';
    ctx.lineWidth = 1*DPR;
    const slant = .32 + Math.sin(t*.4)*.1;       /* gusting angle */
    for (const d of rain){
      d.y += d.v*0.026*(prefersReduced?0:1);
      d.x -= d.v*0.026*slant*.55;
      if (d.y > 1.04){ d.y = -0.05; d.x = Math.random()*1.25; }
      ctx.globalAlpha = d.a*(1+cyclopsIntensity*.85);
      const rx = d.x*W, ry = d.y*H;
      ctx.beginPath();
      ctx.moveTo(rx, ry);
      ctx.lineTo(rx - d.l*slant, ry + d.l);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    /* sea mist above the waterline */
    const mist = ctx.createLinearGradient(0,hor,0,hor+(H-hor)*.36);
    mist.addColorStop(0,'rgba(40,60,86,.38)');
    mist.addColorStop(1,'rgba(40,60,86,0)');
    ctx.fillStyle = mist;
    ctx.fillRect(0,hor,W,(H-hor)*.36);

    /* At the peak of a sighting, the storm itself falls almost completely into shadow. */
    if (cyclopsIntensity > .035){
      ctx.fillStyle=`rgba(0,0,0,${(.91*cyclopsIntensity).toFixed(3)})`;
      ctx.fillRect(0,0,W,H);
      drawThreatGlare(cyclopsIntensity);
      drawCyclops(t, Math.min(1,cyclopsIntensity*1.22));
      /* redraw without advancing: vessel and lantern survive as the only human light */
      drawShip(t,false);
    }

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
})();

/* ============================================================
   LIGHTNING — the storm's fury
   ============================================================ */
(function(){
  const canvas = document.getElementById('lightningCanvas');
  const flash = document.getElementById('stormFlash');
  if (!canvas || !flash) return;
  const ctx = canvas.getContext('2d');
  let W=0,H=0, bolts=[], visible=false;

  function resize(){
    const r = stormSection.getBoundingClientRect();
    W = Math.floor(r.width*DPR); H = Math.floor(r.height*DPR);
    canvas.width=W; canvas.height=H;
  }
  resize(); addEventListener('resize',resize);

  new IntersectionObserver(en=>{visible = en[0].isIntersecting;},{threshold:0})
    .observe(stormSection);

  function genBolt(x0,y0,x1,y1,displace,detail){
    if (displace < detail){ return [[x0,y0],[x1,y1]]; }
    const mx=(x0+x1)/2+(Math.random()-.5)*displace;
    const my=(y0+y1)/2+(Math.random()-.5)*displace*.55;
    return genBolt(x0,y0,mx,my,displace/2,detail).slice(0,-1)
      .concat(genBolt(mx,my,x1,y1,displace/2,detail));
  }

  function strike(){
    if (!visible || prefersReduced){ schedule(); return; }
    const x = W*(0.18+Math.random()*0.64);
    const main = genBolt(x, 0, x+(Math.random()-.5)*W*.22, H*(0.42+Math.random()*0.18), W*.13, 6*DPR);
    const branches=[];
    for (let i=0;i<2+Math.random()*2|0;i++){
      const seg = main[(Math.random()*main.length*.7)|0];
      if (seg) branches.push(genBolt(seg[0],seg[1],
        seg[0]+(Math.random()-.5)*W*.18, seg[1]+H*(0.1+Math.random()*0.15), W*.06, 6*DPR));
    }
    bolts.push({main,branches,life:1});
    /* screen flash */
    flash.style.transition='none';
    flash.style.opacity = (0.5+Math.random()*0.4).toFixed(2);
    requestAnimationFrame(()=>{requestAnimationFrame(()=>{
      flash.style.transition='opacity 1.1s cubic-bezier(.2,.7,.3,1)';
      flash.style.opacity='0';
    });});
    /* occasional double strike */
    if (Math.random()<.3) setTimeout(strike, 120+Math.random()*180);
    schedule();
  }
  let timer=null;
  function schedule(){
    clearTimeout(timer);
    timer = setTimeout(strike, 2400+Math.random()*4200);
  }
  schedule();

  function drawPath(path,width,color,blur){
    ctx.beginPath();
    path.forEach((p,i)=> i===0?ctx.moveTo(p[0],p[1]):ctx.lineTo(p[0],p[1]));
    ctx.strokeStyle=color; ctx.lineWidth=width;
    ctx.shadowColor='rgba(220,228,255,.9)'; ctx.shadowBlur=blur;
    ctx.lineJoin='round'; ctx.lineCap='round';
    ctx.stroke();
  }

  (function render(){
    ctx.clearRect(0,0,W,H);
    bolts = bolts.filter(b=>b.life>0);
    for (const b of bolts){
      const a = Math.pow(b.life,1.6);
      ctx.globalAlpha = a;
      drawPath(b.main, 5*DPR, 'rgba(190,205,255,.32)', 26*DPR);
      drawPath(b.main, 1.7*DPR, 'rgba(252,250,255,.96)', 10*DPR);
      for (const br of b.branches){
        ctx.globalAlpha = a*.7;
        drawPath(br, 1.1*DPR, 'rgba(235,238,255,.8)', 7*DPR);
      }
      b.life -= .045;
    }
    ctx.globalAlpha=1; ctx.shadowBlur=0;
    requestAnimationFrame(render);
  })();
})();

/* ---------- interactive celestial field — proximity constellations inspired by the supplied dots interaction ---------- */
(function(){
  const c=document.getElementById('siteStars');if(!c)return;const ctx=c.getContext('2d');let W=0,H=0,visible=true,scroll=0;
  const mouse={x:-9999,y:-9999,tx:-9999,ty:-9999};const stars=Array.from({length:96},(_,i)=>({x:Math.random(),y:Math.random(),r:.5+Math.random()*1.42,phase:Math.random()*Math.PI*2,twinkle:i%8===0}));
  function resize(){W=c.width=Math.floor(innerWidth*DPR);H=c.height=Math.floor(innerHeight*DPR)}resize();addEventListener('resize',resize);
  addEventListener('mousemove',e=>{mouse.tx=e.clientX*DPR;mouse.ty=e.clientY*DPR},{passive:true});addEventListener('mouseleave',()=>{mouse.tx=-9999;mouse.ty=-9999});addEventListener('scroll',()=>scroll=window.scrollY,{passive:true});document.addEventListener('visibilitychange',()=>visible=!document.hidden);let t=0;
  (function render(){if(visible){t+=prefersReduced?0:.016;mouse.x=lerp(mouse.x,mouse.tx,.09);mouse.y=lerp(mouse.y,mouse.ty,.09);ctx.clearRect(0,0,W,H);const field=[];const radius=Math.min(205*DPR,W*.2);
    for(const star of stars){const pulse=star.twinkle?(.48+.52*Math.max(0,Math.sin(t*1.9+star.phase))):.68;const x=star.x*W+Math.sin(scroll*.0015+star.phase)*7*DPR,y=((star.y*H-scroll*.018*DPR+H)%H);const distance=Math.hypot(mouse.x-x,mouse.y-y),near=Math.max(0,1-distance/radius),size=star.r*(1+near*1.55)*DPR,alpha=.13+pulse*.26+near*.46;field.push({x,y,near});ctx.fillStyle=`rgba(235,225,196,${Math.min(alpha,.96).toFixed(3)})`;ctx.beginPath();ctx.arc(x,y,size,0,7);ctx.fill();
      if((star.twinkle&&pulse>.88)||near>.78){ctx.strokeStyle=`rgba(255,243,205,${Math.min(.22+pulse*.32+near*.32,.9).toFixed(3)})`;ctx.lineWidth=.45*DPR;const ray=(3+near*5)*DPR;ctx.beginPath();ctx.moveTo(x-ray,y);ctx.lineTo(x+ray,y);ctx.moveTo(x,y-ray);ctx.lineTo(x,y+ray);ctx.stroke()}}
    /* Only nearby stars connect: it reads as a responsive constellation, not a permanent grid. */
    for(let i=0;i<field.length;i++){const a=field[i];if(a.near<.14)continue;for(let j=i+1;j<field.length;j++){const b=field[j];if(b.near<.14)continue;const d=Math.hypot(a.x-b.x,a.y-b.y);if(d<92*DPR){ctx.strokeStyle=`rgba(201,162,75,${(.18*Math.min(a.near,b.near)*(1-d/(92*DPR))).toFixed(3)})`;ctx.lineWidth=.5*DPR;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke()}}}}
    requestAnimationFrame(render)})();
})();

/* ---------- hero data constellations: a sparse analytical navigation field ---------- */
(function(){
  const c=document.getElementById('heroDataCanvas');if(!c)return;const ctx=c.getContext('2d');let W=0,H=0,visible=true;
  const nodes=Array.from({length:18},()=>({x:.12+Math.random()*.76,y:.10+Math.random()*.43,ph:Math.random()*6.28}));
  function resize(){W=c.width=Math.floor(innerWidth*DPR);H=c.height=Math.floor(innerHeight*DPR)}resize();addEventListener('resize',resize);new IntersectionObserver(e=>visible=e[0].isIntersecting,{threshold:0}).observe(c);let t=0;
  (function frame(){if(visible){t+=prefersReduced?0:.016;ctx.clearRect(0,0,W,H);ctx.strokeStyle='rgba(201,162,75,.075)';ctx.lineWidth=DPR;ctx.beginPath();ctx.ellipse(W*.5,H*.40,W*.34,H*.14,0,Math.PI*.12,Math.PI*.88);ctx.stroke();for(let i=0;i<nodes.length;i++){const a=nodes[i],ax=(a.x+Math.sin(t*.35+a.ph)*.008)*W,ay=(a.y+Math.cos(t*.29+a.ph)*.006)*H;for(let j=i+1;j<nodes.length;j++){const b=nodes[j],bx=(b.x+Math.sin(t*.35+b.ph)*.008)*W,by=(b.y+Math.cos(t*.29+b.ph)*.006)*H,d=Math.hypot(ax-bx,ay-by);if(d<W*.16){ctx.strokeStyle=`rgba(201,162,75,${(.1*(1-d/(W*.16))).toFixed(3)})`;ctx.lineWidth=.55*DPR;ctx.beginPath();ctx.moveTo(ax,ay);ctx.lineTo(bx,by);ctx.stroke()}}const g=ctx.createRadialGradient(ax,ay,0,ax,ay,7*DPR);g.addColorStop(0,'rgba(235,208,143,.76)');g.addColorStop(1,'rgba(201,162,75,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(ax,ay,7*DPR,0,7);ctx.fill()}}requestAnimationFrame(frame)})();
})();

/* ---------- ambient floating particles (foreground dust) ---------- */
(function(){
  if (prefersReduced) return;
  const c = document.createElement('canvas');
  c.style.cssText='position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:8980;';
  document.body.appendChild(c);
  const ctx=c.getContext('2d');
  let W,H,ps=[];
  function resize(){
    W=c.width=Math.floor(innerWidth*DPR);
    H=c.height=Math.floor(innerHeight*DPR);
  }
  resize(); addEventListener('resize',resize);
  const N = Math.min(46, Math.floor(innerWidth/30));
  for(let i=0;i<N;i++) ps.push({
    x:Math.random(), y:Math.random(),
    r:(0.6+Math.random()*1.5)*DPR,
    vx:(Math.random()-.5)*.00008, vy:-(.00003+Math.random()*.00009),
    a:.06+Math.random()*.2, ph:Math.random()*7
  });
  let t=0;
  (function loop(){
    t+=0.016;
    ctx.clearRect(0,0,W,H);
    for(const p of ps){
      p.x+=p.vx+Math.sin(t*.4+p.ph)*.00004;
      p.y+=p.vy;
      if(p.y<-0.02){p.y=1.02;p.x=Math.random();}
      if(p.x<-0.02)p.x=1.02; if(p.x>1.02)p.x=-0.02;
      const tw=.5+.5*Math.sin(t*1.1+p.ph);
      ctx.fillStyle=`rgba(235,208,143,${(p.a*tw).toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(p.x*W,p.y*H,p.r,0,7);
      ctx.fill();
    }
    requestAnimationFrame(loop);
  })();
})();

})();
