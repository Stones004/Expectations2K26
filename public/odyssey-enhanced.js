/* ============================================================
   ODYSSEY — motion & atmosphere engine (zero dependencies)
   ============================================================ */
(function () {
  "use strict";
  const prefersReduced = true;
  const isCoarse = matchMedia('(pointer: coarse)').matches;
  /* Decorative canvases do not need full device-pixel resolution.  This cap avoids
     rendering several full-screen scenes at 2×/3× resolution on high-DPI displays. */
  const DPR = Math.min(window.devicePixelRatio || 1, 1.25);
  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  /* ----------------------------------------------------------------------
     Several decorative full-screen canvases (ocean, storm, starfield,
     ambient dust) were each independently chasing 60fps with genuinely
     heavy per-frame work (thousands of trig calls and dozens of gradient
     allocations). Together they were the real cause of the page feeling
     laggy — not just while the mouse moved, but even sitting idle. This
     wraps a self-recursive `requestAnimationFrame(draw)` loop so `draw`
     only actually runs `fps` times a second; the visual motion is slow
     and ambient enough that nothing above ~30fps is perceptible, and it
     roughly halves (or better) the combined main-thread cost. */
  function throttledLoop(draw, fps = 30) {
    const interval = 1000 / fps;
    /* Every canvas used to start counting from last=0, so each one drew for
       the first time on the very same startup frame and then stayed in
       lockstep — periodically stacking several canvases' redraws into one
       animation frame and spiking its total time (we measured frames up to
       ~80ms). A frame that long is exactly what makes a JS-positioned
       cursor visibly stutter, even when the average frame rate looks fine.
       Randomizing each loop's phase spreads redraws across different
       frames instead, trading a handful of synchronized heavy frames for
       many small, even ones. */
    let last = performance.now() - Math.random() * interval;
    (function tick(now) {
      if (now - last >= interval) {
        last = now;
        draw(now);
      }
      requestAnimationFrame(tick);
    })(performance.now());
  }

  /* ---------- loader ---------- */
  const loader = document.getElementById('loader');
  const loaderBar = document.getElementById('loaderBar');
  const loaderShip = document.getElementById('loaderShip');
  const loaderPercent = document.getElementById('loaderPercent');
  const loaderWord = document.getElementById('loaderWord');
  const loaderStars = document.getElementById('loaderStars');
  if (loaderStars) {
    const frag = document.createDocumentFragment();
    const starCount = 260;
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('i');
      star.className = 'loader-star';
      const size = (Math.random() < .15 ? 2 + Math.random() * 1.6 : 1 + Math.random() * 1.2).toFixed(2);
      star.style.setProperty('--x', (Math.random() * 100).toFixed(2) + '%');
      star.style.setProperty('--y', (Math.random() * 100).toFixed(2) + '%');
      star.style.setProperty('--size', size + 'px');
      star.style.setProperty('--glow', (parseFloat(size) * 2.4).toFixed(1) + 'px');
      star.style.setProperty('--base', (.15 + Math.random() * .25).toFixed(2));
      star.style.setProperty('--peak', (.55 + Math.random() * .45).toFixed(2));
      star.style.setProperty('--dur', (1.6 + Math.random() * 3.2).toFixed(2) + 's');
      star.style.setProperty('--delay', (Math.random() * 4).toFixed(2) + 's');
      frag.appendChild(star);
    }
    loaderStars.appendChild(frag);
  }
  loaderWord.innerHTML = loaderWord.textContent.split('').map((c, i) =>
    `<span style="animation-delay:${(i * 0.09).toFixed(2)}s">${c}</span>`).join('');
  /* A little narrative flavour: the caption changes as the voyage "progresses". */
  const loaderStages = [
    [0, 'Casting off'],
    [30, 'Charting the stars'],
    [65, 'Riding the current'],
    [92, 'Sighting the shore'],
  ];
  let lp = 0;
  const lt = setInterval(() => {
    lp = Math.min(100, lp + 6 + Math.random() * 12);
    loaderBar.style.width = lp + '%';
    if (loaderShip) loaderShip.style.left = lp + '%';
    if (loaderPercent) {
      const stage = loaderStages.filter(([at]) => lp >= at).pop();
      loaderPercent.textContent = `${stage[1]} — ${Math.round(lp)}%`;
    }
    if (lp >= 100) { clearInterval(lt); setTimeout(hideLoader, 450); }
  }, 130);
  function hideLoader() {
    loader.classList.add('is-done');
    document.body.dispatchEvent(new Event('odyssey:ready'));
  }

  /* ---------- storm countdown — the voyage departs ---------- */
  (function () {
    const el = document.getElementById('stormCountdown');
    if (!el) return;
    const days = document.getElementById('cdDays'), hours = document.getElementById('cdHours'),
      mins = document.getElementById('cdMins'), secs = document.getElementById('cdSecs');
    const label = el.querySelector('.storm-countdown-label');
    const target = new Date('2026-09-28T00:00:00+05:30').getTime();
    const pad = n => String(n).padStart(2, '0');
    let cdTimer = null;
    function tick() {
      const diff = target - Date.now();
      if (diff <= 0) {
        label.textContent = '✦ The Voyage Has Begun ✦';
        days.textContent = hours.textContent = mins.textContent = secs.textContent = '00';
        if (cdTimer) clearInterval(cdTimer);
        return;
      }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor(diff % 86400000 / 3600000);
      const m = Math.floor(diff % 3600000 / 60000);
      const s = Math.floor(diff % 60000 / 1000);
      days.textContent = pad(d); hours.textContent = pad(h); mins.textContent = pad(m); secs.textContent = pad(s);
    }
    tick();
    cdTimer = setInterval(tick, 1000);

    /* Homeric flavour: ancient sailors and poets told time by the sun's
       climb, the turning of dusk and dawn, and the wheeling of the night
       sky's constellations — not clocks. This mirrors that, tied to the
       fest's own time zone (IST) so it reads the same for every visitor. */
    const flavor = document.getElementById('stormFlavor');
    if (flavor) {
      const moments = [
        [0, 3, 'The Great Bear wheels slowly round the pole, and deep night holds the world.'],
        [3, 5, 'The last stars linger low, waiting for dawn’s return.'],
        [5, 7, 'Rosy-fingered Dawn spreads herself across the sky.'],
        [7, 11, 'The sun climbs toward its throne — morning holds the sky.'],
        [11, 13, 'The sun stands at highest noon, and casts no shadow.'],
        [13, 17, 'The sun begins its slow descent into afternoon.'],
        [17, 19, 'The plowman unyokes his oxen; dusk gathers at the world’s edge.'],
        [19, 21, 'Twilight fades, and the first stars kindle above.'],
        [21, 24, 'Orion strides the night, and the Pleiades keep their watch.'],
      ];
      function istDecimalHour(date) {
        const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(date);
        const h = parseInt(parts.find(p => p.type === 'hour').value, 10);
        const m = parseInt(parts.find(p => p.type === 'minute').value, 10);
        return h + m / 60;
      }
      function moonPhaseFraction(date) {
        const synodic = 29.530588853;
        const knownNewMoon = Date.UTC(2000, 0, 6, 18, 14, 0);
        let phase = ((date.getTime() - knownNewMoon) / 86400000 % synodic) / synodic;
        if (phase < 0) phase += 1;
        return phase;
      }
      function moonPhaseName(phase) {
        if (phase < .03 || phase > .97) return 'New Moon';
        if (phase < .22) return 'Waxing Crescent';
        if (phase < .28) return 'First Quarter';
        if (phase < .47) return 'Waxing Gibbous';
        if (phase < .53) return 'Full Moon';
        if (phase < .72) return 'Waning Gibbous';
        if (phase < .78) return 'Last Quarter';
        return 'Waning Crescent';
      }
      /* Sun rises/sets across the sky arc the storm canvas draws; outside
         that span the same arc carries the moon instead — both driven by
         the fest's local (IST) clock so the sky matches whatever moment
         a visitor happens to load the page. */
      const SUNRISE = 6, SUNSET = 18.25;
      function updateCelestial(now, hourDecimal) {
        let type, frac;
        if (hourDecimal >= SUNRISE && hourDecimal < SUNSET) {
          type = 'sun';
          frac = (hourDecimal - SUNRISE) / (SUNSET - SUNRISE);
        } else {
          type = 'moon';
          const nightLen = 24 - (SUNSET - SUNRISE);
          const nh = hourDecimal >= SUNSET ? hourDecimal - SUNSET : hourDecimal + (24 - SUNSET);
          frac = nh / nightLen;
        }
        window.__stormSky = {
          type,
          x: clamp(frac, 0, 1),
          peak: Math.sin(clamp(frac, 0, 1) * Math.PI),
          moonIllum: moonPhaseFraction(now),
        };
      }
      function updateFlavor() {
        const now = new Date();
        const hourDecimal = istDecimalHour(now);
        const h = Math.floor(hourDecimal);
        const line = (moments.find(([start, end]) => h >= start && h < end) || moments[moments.length - 1])[2];
        flavor.innerHTML = `${line} <span class="moon">☾ ${moonPhaseName(moonPhaseFraction(now))}</span>`;
        updateCelestial(now, hourDecimal);
      }
      updateFlavor();
      setInterval(updateFlavor, 60000);
    }
  })();

  /* ---------- custom cursor + magnetic ---------- */
  if (!isCoarse) {
    const dot = document.getElementById('cursorDot');
    /* The ring was already fully retired (display:none, see CSS) and had no
       .is-hover style left to trigger — so this used to run a perpetual
       rAF loop and a lerp every frame purely to animate an invisible
       element. Writing the dot's transform straight from the mousemove
       event removes that whole extra loop and its one-frame-later write:
       one fewer perpetual callback competing for a busy frame's time,
       which is what actually made the dot's paint arrive late. */
    addEventListener('mousemove', e => {
      dot.style.transform = `translate(${e.clientX}px,${e.clientY}px) translate(-50%,-50%)`;
    }, { passive: true });
    /* magnetic buttons */
    document.querySelectorAll('[data-magnetic]').forEach(btn => {
      let bx = 0, by = 0, tx = 0, ty = 0, raf = null;
      const loop = () => {
        bx = lerp(bx, tx, .18); by = lerp(by, ty, .18);
        btn.style.transform = `translate(${bx}px,${by}px)`;
        if (Math.abs(bx - tx) > .2 || Math.abs(by - ty) > .2) raf = requestAnimationFrame(loop); else raf = null;
      };
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        tx = (e.clientX - r.left - r.width / 2) * .28;
        ty = (e.clientY - r.top - r.height / 2) * .34;
        if (!raf) raf = requestAnimationFrame(loop);
      });
      btn.addEventListener('mouseleave', () => { tx = 0; ty = 0; if (!raf) raf = requestAnimationFrame(loop); });
    });
  }


  /* ============================================================
   ODYSSEY CHARACTER SPOTLIGHT
   ============================================================ */

  (function initHeroCharacterSpotlight() {

    const hero = document.getElementById('hero');

    if (!hero) return;

    const isCoarse =
      matchMedia('(pointer: coarse)').matches;

    if (isCoarse) return;

    let mouseX = -1000;
    let mouseY = -1000;

    let smoothX = -1000;
    let smoothY = -1000;

    let rafId = null;
    let activeCharacter = null; // null | 'odysseus' | 'athena' — avoids re-touching classList every frame

    /* Cache the hero's box instead of forcing a synchronous layout read on
       every mousemove and every animation frame — that reflow thrashing was
       the main source of the "laggy while moving the mouse" feel. */
    let heroRect = hero.getBoundingClientRect();
    const updateHeroRect = () => { heroRect = hero.getBoundingClientRect(); };
    addEventListener('resize', updateHeroRect, { passive: true });

    /* ----------------------------------------------------------
       Mouse position
       ---------------------------------------------------------- */

    const handleMouseMove = (e) => {
      mouseX = e.clientX - heroRect.left;
      mouseY = e.clientY - heroRect.top;
    };


    const handleMouseLeave = () => {

      mouseX = -1000;
      mouseY = -1000;

      if (activeCharacter) {
        hero.classList.remove(
          'is-hovering-odysseus',
          'is-hovering-athena'
        );
        activeCharacter = null;
      }

    };


    hero.addEventListener(
      'mousemove',
      handleMouseMove,
      { passive: true }
    );

    hero.addEventListener(
      'mouseleave',
      handleMouseLeave
    );


    /* ----------------------------------------------------------
       Smooth spotlight
       ---------------------------------------------------------- */

    function animate() {

      /* ----------------------------------------------------------
         SMOOTH CURSOR
         ---------------------------------------------------------- */

      smoothX +=
        (mouseX - smoothX) * 0.10;

      smoothY +=
        (mouseY - smoothY) * 0.10;


      /* ----------------------------------------------------------
         DETERMINE ACTIVE CHARACTER
         ---------------------------------------------------------- */

      const heroWidth = heroRect.width;

      const leftBoundary =
        heroWidth * 0.38;

      const rightBoundary =
        heroWidth * 0.62;

      let next = null;

      /* ODYSSEUS — left 38% of hero */
      if (
        smoothX >= 0 &&
        smoothX < leftBoundary
      ) {
        next = 'odysseus';
      }

      /* ATHENA — right 38% of hero */
      else if (
        smoothX > rightBoundary &&
        smoothX <= heroWidth
      ) {
        next = 'athena';
      }

      /* Only touch the DOM when the hovered character actually changes —
         mutating classList every frame forced a style recalc 60×/sec. */
      if (next !== activeCharacter) {
        hero.classList.remove(
          'is-hovering-odysseus',
          'is-hovering-athena'
        );
        if (next) hero.classList.add(`is-hovering-${next}`);
        activeCharacter = next;
      }


      /* ----------------------------------------------------------
         NEXT FRAME
         ---------------------------------------------------------- */

      rafId =
        requestAnimationFrame(animate);
    }


    animate();


    /* ----------------------------------------------------------
       Cleanup
       ---------------------------------------------------------- */

    window.addEventListener(
      'beforeunload',
      () => {

        cancelAnimationFrame(rafId);

        hero.removeEventListener(
          'mousemove',
          handleMouseMove
        );

        hero.removeEventListener(
          'mouseleave',
          handleMouseLeave
        );

        removeEventListener(
          'resize',
          updateHeroRect
        );

      },
      { once: true }
    );

  })();

  /* ---------- nav ---------- */
  const nav = document.getElementById('nav');
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');
  burger.addEventListener('click', () => {
    burger.classList.toggle('is-open');
    mobileMenu.classList.toggle('is-open');
  });
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    burger.classList.remove('is-open'); mobileMenu.classList.remove('is-open');
  }));

  /* ---------- reveal observer ---------- */
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        const d = parseInt(en.target.dataset.delay || 0, 10);
        setTimeout(() => en.target.classList.add('in'), d);
        io.unobserve(en.target);
      }
    });
  }, { threshold: .16, rootMargin: '0px 0px -6% 0px' });
  document.querySelectorAll('.rv,.rv-scale,.rv-left,.rv-right,.itin-day').forEach(el => io.observe(el));

  /* ---------- counters ---------- */
  const cio = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      cio.unobserve(en.target);
      const el = en.target, target = +el.dataset.count, t0 = performance.now(), dur = 2200;
      (function tick(t) {
        const p = clamp((t - t0) / dur, 0, 1);
        const e = 1 - Math.pow(1 - p, 4);
        el.textContent = Math.round(target * e).toLocaleString();
        if (p < 1) requestAnimationFrame(tick);
      })(t0);
    });
  }, { threshold: .6 });
  document.querySelectorAll('[data-count]').forEach(el => cio.observe(el));


  /* ---------- tilt cards + light follow ---------- */
  if (!isCoarse && !prefersReduced) {
    document.querySelectorAll('[data-tilt]').forEach(card => {
      let raf = null, cx = 0, cy = 0, tx = 0, ty = 0;
      const loop = () => {
        cx = lerp(cx, tx, .12); cy = lerp(cy, ty, .12);
        card.style.transform = `perspective(900px) rotateY(${cx}deg) rotateX(${cy}deg)`;
        if (Math.abs(cx - tx) > .05 || Math.abs(cy - ty) > .05) raf = requestAnimationFrame(loop); else raf = null;
      };
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        tx = (px - .5) * 7; ty = (0.5 - py) * 7;
        card.style.setProperty('--mx', (px * 100) + '%');
        card.style.setProperty('--my', (py * 100) + '%');
        if (!raf) raf = requestAnimationFrame(loop);
      });
      card.addEventListener('mouseleave', () => { tx = 0; ty = 0; if (!raf) raf = requestAnimationFrame(loop); });
    });
  }

  /* ---------- expanding programme cards — inspired by the supplied accordion interaction, built dependency-free ---------- */
  (function () {
    const wrap = document.getElementById('eventsExpanded'); if (!wrap) return; const cards = [...wrap.querySelectorAll('[data-event-card]')];
    function activate(card) { cards.forEach(item => { const active = item === card; item.classList.toggle('is-active', active); item.setAttribute('aria-expanded', active ? 'true' : 'false') }) }
    /* First interaction expands the card (preview); once expanded, the same
       interaction follows data-category-href into that category's events. */
    function open(card) {
      if (card.classList.contains('is-active') && card.dataset.categoryHref) {
        window.top.location.href = card.dataset.categoryHref;
      } else {
        activate(card);
      }
    }
    cards.forEach(card => { card.setAttribute('aria-expanded', card.classList.contains('is-active') ? 'true' : 'false'); card.addEventListener('click', () => open(card)); card.addEventListener('mouseenter', () => { if (!isCoarse) activate(card) }); card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(card) } }) });
  })();

  /* ---------- event carousel — content is deliberately centralized for the forthcoming programme ---------- */
  (function () {
    const carousel = document.getElementById('eventsCarousel'); if (!carousel) return;
    const slides = [...carousel.querySelectorAll('.event-slide')], dots = carousel.querySelector('.event-dots'); let current = 0, timer;
    slides.forEach((_, i) => { const b = document.createElement('button'); b.className = 'event-dot' + (i === 0 ? ' is-active' : ''); b.type = 'button'; b.setAttribute('aria-label', `Show event ${i + 1}`); b.addEventListener('click', () => show(i)); dots.appendChild(b) });
    const dotButtons = [...dots.children]; function show(next) { current = (next + slides.length) % slides.length; slides.forEach((slide, i) => { slide.classList.toggle('is-active', i === current); slide.setAttribute('aria-hidden', i === current ? 'false' : 'true') }); dotButtons.forEach((dot, i) => dot.classList.toggle('is-active', i === current)); }
    carousel.querySelector('[data-event-prev]').addEventListener('click', () => show(current - 1)); carousel.querySelector('[data-event-next]').addEventListener('click', () => show(current + 1));
    if (!prefersReduced) { const start = () => timer = setInterval(() => show(current + 1), 7000); start(); carousel.addEventListener('mouseenter', () => clearInterval(timer)); carousel.addEventListener('mouseleave', start) }
  })();

  /* ---------- tracks tabs ---------- */
  const tabs = document.querySelectorAll('.track-tab');
  const panels = document.querySelectorAll('.track-detail');
  tabs.forEach(tab => {
    const activate = () => {
      tabs.forEach(t => t.classList.toggle('is-active', t === tab));
      panels.forEach(p => p.classList.toggle('is-active', p.dataset.panel === tab.dataset.track));
    };
    tab.addEventListener('click', activate);
    tab.addEventListener('mouseenter', activate);
  });

  /* ---------- marquee duplicate ---------- */
  const mq = document.getElementById('marqueeTrack');
  mq.innerHTML += mq.innerHTML;

  /* ============================================================
     SCROLL ENGINE — one rAF loop, lerped values
     ============================================================ */
  const heroContent = document.getElementById('heroContent');
  const stormSection = document.getElementById('storm');
  window.__stormParallax = 0;   /* read by the storm renderer for sky drift */
  const itinWrap = document.getElementById('itinWrap');
  const itinFill = document.getElementById('itinFill');
  let scrollY = window.scrollY, smoothY = scrollY;

  /* Document-relative offsets, measured only on load/resize — never inside
     the per-frame loop. Reading getBoundingClientRect() every rAF tick right
     after writing heroContent's transform/opacity forced a synchronous
     layout (write → read → write → read, once a frame) that was a real
     source of the site-wide jank, cursor included since it shares the main
     thread. Caching these lets the loop do pure arithmetic instead. */
  let stormDocTop = 0, stormHeight = 0, itinDocTop = 0, itinHeight = 0;
  function measureScrollSections() {
    const sr = stormSection.getBoundingClientRect();
    stormDocTop = sr.top + window.scrollY; stormHeight = sr.height;
    const ir = itinWrap.getBoundingClientRect();
    itinDocTop = ir.top + window.scrollY; itinHeight = ir.height;
  }
  measureScrollSections();
  addEventListener('resize', measureScrollSections, { passive: true });

  addEventListener('scroll', () => { scrollY = window.scrollY; }, { passive: true });

  function scrollLoop() {
    smoothY = lerp(smoothY, scrollY, prefersReduced ? 1 : .085);

    /* nav state */
    nav.classList.toggle('is-scrolled', scrollY > 40);

    /* hero parallax + fade */
    const hh = innerHeight;
    const hp = clamp(smoothY / hh, 0, 1);
    heroContent.style.transform = `translateY(${smoothY * 0.34}px) scale(${1 - hp * 0.06})`;
    heroContent.style.opacity = String(1 - hp * 1.25);

    /* storm parallax — fed into the canvas scene for layered depth */
    const stormTop = stormDocTop - scrollY;
    if (stormTop + stormHeight > 0 && stormTop < hh) {
      const sp = clamp((hh - stormTop) / (hh + stormHeight), 0, 1);
      window.__stormParallax = sp - .5;
    }

    /* itinerary path fill */
    const itinTop = itinDocTop - scrollY;
    const ip = clamp((hh * 0.72 - itinTop) / itinHeight, 0, 1);
    itinFill.style.height = (ip * 100).toFixed(2) + '%';

    requestAnimationFrame(scrollLoop);
  }
  requestAnimationFrame(scrollLoop);

  /* ============================================================
     OCEAN — realistic layered water  (hero)
     ============================================================ */
  function makeOcean(canvas, opts) {
    const ctx = canvas.getContext('2d');
    let W = 0, H = 0, t = Math.random() * 100;
    const o = Object.assign({
      horizon: .56, layers: 7, moon: true, glitter: true, dim: 1, speed: 1, ship: false, roughness: 1
    }, opts || {});
    let glints = [];

    function resize() {
      const r = canvas.parentElement.getBoundingClientRect();
      W = Math.floor(r.width * DPR); H = Math.floor(r.height * DPR);
      canvas.width = W; canvas.height = H;
      glints = [];
      const n = Math.floor(W / 12);
      for (let i = 0; i < n; i++) {
        glints.push({
          x: Math.random(), y: Math.random(),
          w: 6 + Math.random() * 30, s: .4 + Math.random() * 1.4,
          ph: Math.random() * Math.PI * 2
        });
      }
    }
    resize();
    addEventListener('resize', resize);

    let visible = true;
    new IntersectionObserver(en => { visible = en[0].isIntersecting; }, { threshold: 0 })
      .observe(canvas);

    /* Ship and water use the identical wave equation, so its hull remains at the waterline. */
    function drawHeroShip(time) {
      if (!o.ship) return;
      const hor = H * o.horizon;
      const px = W * .68, p = .46, yBase = hor + Math.pow(p, 1.65) * (H - hor) * .96 + 6, amp = (2 + Math.pow(p, 1.8) * 26) * DPR, freq = .012 / DPR * (1 - p * .72), spd = time * (.5 + p * 1.05);
      const wave = x => yBase + Math.sin(x * freq + spd) * amp * .62 + Math.sin(x * freq * 2.13 - spd * 1.4) * amp * .27 + Math.sin(x * freq * .47 + spd * .6) * amp * .34;
      const waterY = wave(px), pitch = Math.atan2(wave(px + 38 * DPR) - wave(px - 38 * DPR), 76 * DPR) * .78, bob = Math.sin(time * .72) * 1.8 * DPR, S = clamp(W / (330 * DPR), 1.15, 3.05) * DPR;
      ctx.save(); ctx.translate(px, waterY - 5 * S + bob); ctx.rotate(pitch); ctx.scale(S, S);
      ctx.strokeStyle = 'rgba(215,225,226,.18)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(-28, 5); ctx.quadraticCurveTo(-60, 9, -89, 18); ctx.stroke();
      const hull = ctx.createLinearGradient(0, -8, 0, 8); hull.addColorStop(0, '#1b2027'); hull.addColorStop(1, '#05080d'); ctx.fillStyle = hull; ctx.beginPath();
      ctx.strokeStyle = '#10151d'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(0, -2); ctx.lineTo(0, -46); ctx.stroke(); const sail = ctx.createLinearGradient(-15, -39, 14, -12); sail.addColorStop(0, 'rgba(225,213,181,.8)'); sail.addColorStop(1, 'rgba(126,120,104,.68)'); ctx.fillStyle = sail; ctx.beginPath(); ctx.moveTo(-16, -39); ctx.lineTo(16, -39); ctx.quadraticCurveTo(20, -24, 13, -11); ctx.quadraticCurveTo(0, -8, -13, -12); ctx.quadraticCurveTo(-18, -24, -16, -39); ctx.fill(); ctx.strokeStyle = 'rgba(143,107,42,.6)'; ctx.lineWidth = .7; ctx.beginPath(); ctx.moveTo(-15, -27); ctx.quadraticCurveTo(0, -24, 15, -27); ctx.stroke();
      /* The ship’s lantern is the human counter-light to the Cyclops eye. */
      const lantern = ctx.createRadialGradient(-9, -5, 0, -9, -5, 12); lantern.addColorStop(0, 'rgba(255,244,202,1)'); lantern.addColorStop(.16, 'rgba(255,218,132,.92)'); lantern.addColorStop(.52, 'rgba(201,162,75,.28)'); lantern.addColorStop(1, 'rgba(201,162,75,0)'); ctx.fillStyle = lantern; ctx.beginPath(); ctx.arc(-9, -5, 12, 0, 7); ctx.fill(); ctx.fillStyle = 'rgba(255,242,190,.96)'; ctx.beginPath(); ctx.arc(-9, -5, 1.15, 0, 7); ctx.fill(); ctx.restore();
    }

    function draw() {
      if (!visible) return;
      t += 0.016 * o.speed;
      const hor = H * o.horizon;
      const moonX = W * 0.5, moonY = H * 0.30;

      /* sky */
      const sky = ctx.createLinearGradient(0, 0, 0, hor);
      sky.addColorStop(0, '#04070D');
      sky.addColorStop(.55, '#081120');
      sky.addColorStop(.92, '#16283F');
      sky.addColorStop(1, '#23364E');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, W, hor + 2);

      if (o.moon) {
        /* golden moon-sun above horizon */
        const glow = ctx.createRadialGradient(moonX, moonY, 0, moonX, moonY, H * 0.34);
        glow.addColorStop(0, 'rgba(235,208,143,0.30)');
        glow.addColorStop(.35, 'rgba(201,162,75,0.10)');
        glow.addColorStop(1, 'rgba(201,162,75,0)');
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, W, hor + 2);
        const disc = ctx.createRadialGradient(moonX, moonY, 0, moonX, moonY, H * 0.045);
        disc.addColorStop(0, 'rgba(251,243,220,.95)');
        disc.addColorStop(.7, 'rgba(235,208,143,.55)');
        disc.addColorStop(1, 'rgba(235,208,143,0)');
        ctx.fillStyle = disc;
        ctx.beginPath(); ctx.arc(moonX, moonY, H * 0.05, 0, 7); ctx.fill();
        /* stars */
        ctx.fillStyle = 'rgba(244,239,228,.5)';
        for (let i = 0; i < 26; i++) {
          const sx = (Math.sin(i * 78.233) * .5 + .5) * W;
          const sy = (Math.sin(i * 12.989) * .5 + .5) * hor * .7;
          const tw = .25 + .45 * Math.abs(Math.sin(t * .8 + i * 1.7));
          ctx.globalAlpha = tw;
          ctx.fillRect(sx, sy, 1.85 * DPR, 1.85 * DPR);
          /* Fine stellar diffraction makes each celestial point crisp rather than game-like. */
          if (i % 6 === 0 && Math.sin(t * 2.35 + i * 4.1) > .72) {
            const sparkle = 3.8 + 2.2 * Math.sin(t * 2.35 + i * 4.1);
            ctx.strokeStyle = 'rgba(255,247,220,.82)'; ctx.lineWidth = .5 * DPR;
            ctx.beginPath(); ctx.moveTo(sx - sparkle * DPR, sy); ctx.lineTo(sx + sparkle * DPR, sy); ctx.moveTo(sx, sy - sparkle * DPR); ctx.lineTo(sx, sy + sparkle * DPR); ctx.stroke();
          }
        }
        ctx.globalAlpha = 1;
      }

      /* sea base */
      const sea = ctx.createLinearGradient(0, hor, 0, H);
      sea.addColorStop(0, '#1E3450');
      sea.addColorStop(.18, '#13243B');
      sea.addColorStop(.6, '#0A1626');
      sea.addColorStop(1, '#04090F');
      ctx.fillStyle = sea;
      ctx.fillRect(0, hor, W, H - hor);

      /* horizon shimmer line */
      ctx.fillStyle = 'rgba(235,208,143,.22)';
      ctx.fillRect(0, hor - 1, W, 1.4 * DPR);

      /* wave layers — perspective: tighter & dimmer near horizon */
      for (let L = 0; L < o.layers; L++) {
        const p = L / (o.layers - 1);                      // 0 horizon → 1 shore
        const yBase = hor + Math.pow(p, 1.65) * (H - hor) * 0.96 + 6;
        const amp = (2 + Math.pow(p, 1.8) * 26) * DPR * o.roughness;
        const freq = 0.012 / DPR * (1 - p * 0.72);
        const spd = t * (.5 + p * 1.05);
        /* Wave height only needs computing once per x per layer — it used
           to run the same three sin() calls twice (once for the fill path,
           once for the crest stroke), doubling this loop's cost for no
           visual gain since both paths trace the identical curve. */
        const step = 11 * DPR;
        const xs = [], ys = [];
        for (let x = 0; x <= W; x += step) {
          xs.push(x);
          ys.push(yBase
            + Math.sin(x * freq + spd) * amp * .62
            + Math.sin(x * freq * 2.13 - spd * 1.4) * amp * .27
            + Math.sin(x * freq * .47 + spd * .6) * amp * .34);
        }
        ctx.beginPath();
        ctx.moveTo(0, H);
        for (let i = 0; i < xs.length; i++) ctx.lineTo(xs[i], ys[i]);
        ctx.lineTo(W, H);
        ctx.closePath();
        const a = .10 + p * .16;
        const g = ctx.createLinearGradient(0, yBase - amp, 0, yBase + amp * 3);
        g.addColorStop(0, `rgba(${30 + p * 26 | 0},${58 + p * 30 | 0},${92 + p * 26 | 0},${a})`);
        g.addColorStop(1, `rgba(${8 + p * 8 | 0},${16 + p * 12 | 0},${30 + p * 14 | 0},${a * 1.25})`);
        ctx.fillStyle = g;
        ctx.fill();
        /* crest light */
        ctx.beginPath();
        for (let i = 0; i < xs.length; i++) i === 0 ? ctx.moveTo(xs[i], ys[i]) : ctx.lineTo(xs[i], ys[i]);
        ctx.strokeStyle = `rgba(${170 + p * 60 | 0},${175 + p * 45 | 0},${165 + p * 20 | 0},${.045 + p * .075})`;
        ctx.lineWidth = (0.7 + p * 1.3) * DPR;
        ctx.stroke();
      }

      /* The ship is composed above distant swells and below foreground light. */
      drawHeroShip(t);

      /* moonlight glitter path */
      if (o.glitter) {
        const bandTop = hor + 4, bandH = H - hor - 8;
        for (const gl of glints) {
          const gy = bandTop + gl.y * bandH;
          const p = (gy - hor) / (H - hor);
          const bandW = W * (0.045 + p * 0.34);
          const gx = moonX + (gl.x - .5) * bandW;
          const flick = Math.max(0, Math.sin(t * gl.s * 2.2 + gl.ph));
          if (flick < .25) continue;
          const a = flick * (.07 + p * .30) * o.dim;
          ctx.fillStyle = `rgba(235,208,143,${a.toFixed(3)})`;
          const wgl = gl.w * (0.4 + p) * DPR * .7;
          ctx.fillRect(gx - wgl / 2, gy, wgl, Math.max(1, 1.1 * DPR * (0.5 + p)));
        }
      }

      /* atmospheric depth fog over far water */
      const fog = ctx.createLinearGradient(0, hor, 0, hor + (H - hor) * .4);
      fog.addColorStop(0, 'rgba(30,52,80,.35)');
      fog.addColorStop(1, 'rgba(30,52,80,0)');
      ctx.fillStyle = fog;
      ctx.fillRect(0, hor, W, (H - hor) * .4);
    }
    throttledLoop(draw, 30);
  }

  makeOcean(document.getElementById('oceanCanvas'), { horizon: .55, layers: 6, moon: false, ship: false, roughness: 1.38, speed: prefersReduced ? 0.001 : 1.16 });
  makeOcean(document.getElementById('regCanvas'), { horizon: .30, layers: 6, moon: false, dim: .6, speed: prefersReduced ? 0.001 : .7 });

  /* ============================================================
     STORM CROSSING — procedural storm sky, heavy seas, and a
     trireme that sails the waves edge to edge, forever
     ============================================================ */
  (function () {
    const canvas = document.getElementById('stormCanvas');
    const ctx = canvas.getContext('2d');
    let W = 0, H = 0, t = 0, visible = false;

    /* ---- countdown panel bounds, for the eclipse effect below ---- */
    const countdownEl = document.getElementById('stormCountdown');
    let countdownRect = null, wasEclipsed = false;
    function updateCountdownRect() {
      if (!countdownEl) return;
      countdownRect = {
        left: countdownEl.offsetLeft * DPR,
        top: countdownEl.offsetTop * DPR,
        width: countdownEl.offsetWidth * DPR,
        height: countdownEl.offsetHeight * DPR,
      };
    }
    /* Deliberately stricter than a simple circle/rect overlap: this asks
       whether the disc's CENTER sits inside the panel (plus a small pad),
       i.e. the sun/moon is genuinely behind it — not just close enough for
       its wide glow halo to be nearby, which read as a false "eclipse". */
    function pointInRect(px, py, rect, pad) {
      if (!rect) return false;
      return px >= rect.left - pad && px <= rect.left + rect.width + pad &&
        py >= rect.top - pad && py <= rect.top + rect.height + pad;
    }

    /* ---- day/night sky tint, cached against the sky object reference so
       the color-lerp math only runs when updateCelestial() actually
       changes it (once a minute), not on every one of the 30fps frames ---- */
    const SKY_NIGHT = [[5, 8, 15], [11, 19, 34], [26, 42, 64], [36, 55, 80]];
    const SKY_DAY = [[152, 195, 224], [178, 212, 232], [206, 227, 238], [230, 240, 245]];
    let cachedSkyRef = null, cachedSkyColors = null;
    function skyGradientColors(sky) {
      if (sky === cachedSkyRef) return cachedSkyColors;
      const dayness = sky && sky.type === 'sun' ? clamp(sky.peak * 1.3, 0, 1) : 0;
      cachedSkyColors = SKY_NIGHT.map((night, i) => {
        const day = SKY_DAY[i];
        const r = Math.round(lerp(night[0], day[0], dayness));
        const g = Math.round(lerp(night[1], day[1], dayness));
        const b = Math.round(lerp(night[2], day[2], dayness));
        return `rgb(${r},${g},${b})`;
      });
      cachedSkyRef = sky;
      return cachedSkyColors;
    }
    /* random threat windows; values are shared by waves, ship pitch and the Cyclops reveal */
    let cyclopsIntensity = 0, cyclopsStart = 0, cyclopsUntil = 0, nextCyclops = 3 + Math.random() * 3.5, cyclopsX = .20;
    function setCyclopsAtmosphere(value) {
      const active = value > .035;
      document.body.classList.toggle('cyclops-looming', active);
      document.body.style.setProperty('--cyclops-dim', (value * .82).toFixed(3));
      document.body.style.setProperty('--cyclops-x', (cyclopsX * 100).toFixed(1) + '%');
    }
    function updateCyclopsThreat() {
      if (!prefersReduced && t >= nextCyclops) {
        cyclopsStart = t;
        /* A different horizon position makes every sighting feel unplanned. */
        cyclopsX = .13 + Math.random() * .74;
        cyclopsUntil = t + 4.8 + Math.random() * 2.7;
        nextCyclops = cyclopsUntil + 12 + Math.random() * 13;
      }
      const raw = t < cyclopsUntil ? Math.sin(((t - cyclopsStart) / (cyclopsUntil - cyclopsStart)) * Math.PI) : 0;
      cyclopsIntensity = lerp(cyclopsIntensity, Math.max(0, raw), .045);
      setCyclopsAtmosphere(cyclopsIntensity);
      window.__cyclopsThreat = cyclopsIntensity;
    }

    /* ---- storm wave model (shared by sea + ship) ---- */
    const SHIP_LAYER_P = 0.42;          /* depth fraction of the ship's wave layer */
    function layerGeom(p) {
      const hor = H * 0.46;
      return {
        yBase: hor + Math.pow(p, 1.55) * (H - hor) * 0.92 + 6,
        amp: (4 + Math.pow(p, 1.6) * 46) * DPR * (1 + cyclopsIntensity * .62),
        freq: 0.011 / DPR * (1 - p * 0.7),
        spd: (.55 + p * 1.1) * (1 + cyclopsIntensity * .18)
      };
    }
    function waveY(x, p, time) {
      const g = layerGeom(p);
      const s = time * g.spd;
      return g.yBase
        + Math.sin(x * g.freq + s) * g.amp * .58
        + Math.sin(x * g.freq * 2.17 - s * 1.45) * g.amp * .26
        + Math.sin(x * g.freq * .43 + s * .62) * g.amp * .36;
    }

    /* Clouds used to drift here as pre-rendered soft blobs meant for a dark
       sky, and rain fell across the whole scene — against the newer bright
       daytime sky both read as blocky/pixelated and sat right where the
       sun/moon needed to be visible, so both were removed outright. */
    function resize() {
      const r = stormSection.getBoundingClientRect();
      W = Math.floor(r.width * DPR); H = Math.floor(r.height * DPR);
      canvas.width = W; canvas.height = H;
      updateCountdownRect();
    }
    resize(); addEventListener('resize', resize);

    new IntersectionObserver(en => { visible = en[0].isIntersecting; if (!visible) setCyclopsAtmosphere(0); }, { threshold: 0 })
      .observe(stormSection);

    /* ---- the trireme ---- */
    const ship = { x: -0.18, y: 0, rot: 0, vx: 0.00026 };  /* x in [−.2, 1.2] */

    function drawShip(time, advance = true) {
      const px = ship.x * W;
      /* Scale it down slightly; lift its reference point so the hull rides on — not inside — the wave. */
      const S = clamp(W / (305 * DPR), 1.15, 4.35), u = DPR * S;
      const targetY = waveY(px, SHIP_LAYER_P, time) - 7.8 * u;
      const ahead = waveY(px + 42 * DPR, SHIP_LAYER_P, time), behind = waveY(px - 42 * DPR, SHIP_LAYER_P, time);
      const targetR = Math.atan2(ahead - behind, 84 * DPR) * .76;
      ship.y = ship.y ? lerp(ship.y, targetY, .075) : targetY;
      ship.rot = lerp(ship.rot, targetR, .075);
      /* A broader longship silhouette: long black hull, lifted ends and a square crimson sail. */
      ctx.save(); ctx.translate(px, ship.y); ctx.rotate(ship.rot); ctx.scale(u, u);

      /* broken foam wake behind the stern */
      ctx.save(); ctx.scale(1 / u, 1 / u); const wake = ctx.createLinearGradient(-210 * DPR * S, 0, -45 * DPR * S, 0);
      wake.addColorStop(0, 'rgba(230,238,237,0)'); wake.addColorStop(.75, 'rgba(215,229,230,.10)'); wake.addColorStop(1, 'rgba(232,240,235,.28)'); ctx.fillStyle = wake;
      ctx.beginPath(); ctx.moveTo(-43 * DPR * S, 7 * DPR * S); ctx.quadraticCurveTo(-112 * DPR * S, 10 * DPR * S, -204 * DPR * S, 28 * DPR * S); ctx.lineTo(-205 * DPR * S, 42 * DPR * S); ctx.quadraticCurveTo(-112 * DPR * S, 24 * DPR * S, -43 * DPR * S, 16 * DPR * S); ctx.closePath(); ctx.fill(); ctx.restore();

      /* long oars below the gunwale */
      ctx.strokeStyle = 'rgba(10,15,20,.92)'; ctx.lineWidth = 1.05;
      for (let i = 0; i < 11; i++) { const ox = -27 + i * 5.5, sweep = Math.sin(time * 2.25 + i * .57) * .17; ctx.beginPath(); ctx.moveTo(ox, 3); ctx.lineTo(ox - 7 + sweep * 9, 16 + Math.cos(sweep) * 2); ctx.stroke() }

      /* curved longship hull and lifted dragon-like ends */
      const hull = ctx.createLinearGradient(0, -11, 0, 12); hull.addColorStop(0, '#28313a'); hull.addColorStop(.24, '#101821'); hull.addColorStop(1, '#02060b'); ctx.fillStyle = hull;
      ctx.beginPath(); ctx.moveTo(-42, -3); ctx.quadraticCurveTo(-48, -20, -39, -27); ctx.quadraticCurveTo(-42, -14, -35, -4); ctx.lineTo(40, -4); ctx.quadraticCurveTo(49, -10, 54, -22); ctx.quadraticCurveTo(56, -7, 48, 1); ctx.lineTo(55, 4); ctx.lineTo(46, 6); ctx.quadraticCurveTo(8, 15, -29, 10); ctx.quadraticCurveTo(-39, 8, -42, -3); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = 'rgba(205,177,111,.72)'; ctx.lineWidth = .78; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-37, -1); ctx.quadraticCurveTo(4, 3, 49, 0); ctx.strokeStyle = 'rgba(201,162,75,.62)'; ctx.lineWidth = .85; ctx.stroke();
      /* shields / crew rhythm along hull */
      for (let i = 0; i < 12; i++) { const cx = -28 + i * 5.4; ctx.fillStyle = i % 2 ? 'rgba(81,28,23,.84)' : 'rgba(116,79,42,.82)'; ctx.beginPath(); ctx.arc(cx, -2.8, 1.62, 0, 7); ctx.fill(); }
      ctx.fillStyle = 'rgba(9,13,18,.94)'; for (let i = 0; i < 9; i++) { ctx.beginPath(); ctx.arc(-21 + i * 5.2, -7.3, 1.12, 0, 7); ctx.fill() }
    /* prow eye */ctx.fillStyle = 'rgba(235,208,143,.96)'; ctx.beginPath(); ctx.arc(45.5, -10.4, 1.15, 0, 7); ctx.fill();

      /* mast, yard and taut rigging */
      ctx.strokeStyle = '#0b1119'; ctx.lineWidth = 1.55; ctx.beginPath(); ctx.moveTo(2, -3); ctx.lineTo(2, -57); ctx.stroke();
      ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-34, -50); ctx.lineTo(38, -50); ctx.stroke();
      ctx.strokeStyle = 'rgba(38,35,30,.86)'; ctx.lineWidth = .42; ctx.beginPath(); ctx.moveTo(-34, -50); ctx.lineTo(-37, -3); ctx.stroke(); ctx.beginPath(); ctx.moveTo(38, -50); ctx.lineTo(45, -3); ctx.stroke();

      /* Square red sail, fuller and stitched like a real ancient vessel */
      const billow = 7 + Math.sin(time * 1.7) * 1.5 + cyclopsIntensity * (6 + Math.sin(time * 4) * 2);
      const sail = ctx.createLinearGradient(-34, -50, 38, -9); sail.addColorStop(0, 'rgba(143,35,30,.98)'); sail.addColorStop(.38, 'rgba(114,25,24,.96)'); sail.addColorStop(.74, 'rgba(82,18,20,.94)'); sail.addColorStop(1, 'rgba(48,12,16,.92)');
      ctx.fillStyle = sail; ctx.beginPath(); ctx.moveTo(-33, -49); ctx.lineTo(37, -49); ctx.quadraticCurveTo(39 + billow * .45, -28, 34, -10); ctx.quadraticCurveTo(3, -5 + billow * .16, -30, -10); ctx.quadraticCurveTo(-37 - billow * .35, -28, -33, -49); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = 'rgba(228,163,130,.25)'; ctx.lineWidth = .55; ctx.stroke();
      /* seam lines, intentionally uneven under wind */
      ctx.strokeStyle = 'rgba(49,10,15,.55)'; ctx.lineWidth = .5; for (let i = 1; i < 5; i++) { const sy = -49 + i * 8; ctx.beginPath(); ctx.moveTo(-32, sy); ctx.quadraticCurveTo(2, sy + billow * .12, 36, sy); ctx.stroke() }
      ctx.strokeStyle = 'rgba(213,144,112,.15)'; ctx.lineWidth = .6; ctx.beginPath(); ctx.moveTo(1, -48); ctx.quadraticCurveTo(5 + billow * .3, -29, 2, -10); ctx.stroke();

      /* pennant */
      const flap = Math.sin(time * 5) * 1.7; ctx.fillStyle = 'rgba(201,162,75,.94)'; ctx.beginPath(); ctx.moveTo(2, -58); ctx.quadraticCurveTo(8, -60 + flap * .4, 13, -56 + flap); ctx.lineTo(7, -55 + flap * .5); ctx.quadraticCurveTo(4, -56, 2, -55); ctx.closePath(); ctx.fill();

      /* Human counter-light: lantern gets brighter during the Cyclops blackout. */
      const lanternPower = .30 + cyclopsIntensity * 1.35; const lantern = ctx.createRadialGradient(-10, -5, 0, -10, -5, 13 + cyclopsIntensity * 9);
      lantern.addColorStop(0, `rgba(255,244,194,${Math.min(1, lanternPower + .35).toFixed(2)})`); lantern.addColorStop(.18, `rgba(255,211,114,${Math.min(1, lanternPower).toFixed(2)})`); lantern.addColorStop(1, 'rgba(201,162,75,0)'); ctx.fillStyle = lantern; ctx.beginPath(); ctx.arc(-10, -5, 13 + cyclopsIntensity * 9, 0, 7); ctx.fill(); ctx.fillStyle = `rgba(255,241,185,${Math.min(1, lanternPower + .35).toFixed(2)})`; ctx.beginPath(); ctx.arc(-10, -5, 1.18, 0, 7); ctx.fill();
      ctx.restore();

      /* stronger bow spray when a glare-induced squall hits */
      if (ship.rot < -.022 || cyclopsIntensity > .25) { ctx.fillStyle = `rgba(228,239,240,${(.15 + cyclopsIntensity * .2).toFixed(3)})`; for (let i = 0; i < 6; i++) { const sx = px + (42 + Math.random() * 19) * u, sy = ship.y + (Math.random() * 7 - 10) * u; ctx.beginPath(); ctx.arc(sx, sy, (.9 + Math.random() * 2.4) * DPR, 0, 7); ctx.fill() } }
      if (advance) { ship.x += ship.vx * (prefersReduced ? 0 : 1); if (ship.x > 1.2) { ship.x = -.2; ship.y = 0 } }
    }

    /* The Cyclops arrives only in brief storm windows: a distant threat rather than a permanent character. */
    function drawCyclops(time, intensity) {
      if (intensity < .015) return;
      const x = W * cyclopsX, y = H * .46, a = Math.min(1, intensity * 1.35), eyeY = y - 76 * DPR;
      ctx.save(); ctx.globalAlpha = a;
      /* broad shoulders are visible only at the height of the squall */
      const body = ctx.createRadialGradient(x, y - 92 * DPR, 8 * DPR, x, y - 64 * DPR, 138 * DPR);
      body.addColorStop(0, 'rgba(5,11,18,.96)'); body.addColorStop(.6, 'rgba(4,9,15,.76)'); body.addColorStop(1, 'rgba(4,8,13,0)');
      ctx.fillStyle = body; ctx.beginPath(); ctx.ellipse(x, y - 53 * DPR, 102 * DPR, 112 * DPR, 0, Math.PI, Math.PI * 2); ctx.fill();
      /* one sharp eye: the storm makes it appear to lock onto the crossing */
      const flicker = .72 + .28 * Math.sin(time * 3.2) + .08 * Math.sin(time * 9.1);
      /* An almond-shaped eye removes the artificial halo/ring and feels embedded in the face. */
      const eye = ctx.createRadialGradient(x, eyeY, 0, x, eyeY, 17 * DPR);
      eye.addColorStop(0, `rgba(255,250,218,${(flicker * 1.15).toFixed(2)})`); eye.addColorStop(.22, `rgba(255,222,130,${(flicker * 1.02).toFixed(2)})`); eye.addColorStop(.7, `rgba(201,162,75,${(flicker * .36).toFixed(2)})`); eye.addColorStop(1, 'rgba(201,162,75,0)');
      ctx.save(); ctx.beginPath(); ctx.moveTo(x - 19 * DPR, eyeY); ctx.quadraticCurveTo(x, eyeY - 10 * DPR, x + 19 * DPR, eyeY); ctx.quadraticCurveTo(x, eyeY + 8 * DPR, x - 19 * DPR, eyeY); ctx.closePath(); ctx.clip(); ctx.fillStyle = eye; ctx.fillRect(x - 22 * DPR, eyeY - 14 * DPR, 44 * DPR, 28 * DPR); ctx.restore();
      /* a narrow pupil and heavy brow keep it unsettling but natural */
      ctx.fillStyle = `rgba(8,6,4,${(flicker * .96).toFixed(2)})`; ctx.beginPath(); ctx.ellipse(x, eyeY, 1.15 * DPR, 7.7 * DPR, 0, 0, 7); ctx.fill();
      ctx.strokeStyle = `rgba(2,6,10,${(.82 * a).toFixed(2)})`; ctx.lineWidth = 4.4 * DPR; ctx.beginPath(); ctx.moveTo(x - 25 * DPR, eyeY - 17 * DPR); ctx.quadraticCurveTo(x, eyeY - 27 * DPR, x + 26 * DPR, eyeY - 16 * DPR); ctx.stroke();
      ctx.fillStyle = `rgba(255,247,205,${(flicker * .9).toFixed(2)})`; ctx.beginPath(); ctx.arc(x - 5 * DPR, eyeY - 2 * DPR, .85 * DPR, 0, 7); ctx.fill();
      ctx.restore();
    }

    /* The eye narrows into a broken searchlight aimed at the ship: threat, not a literal laser. */
    function drawThreatGlare(intensity) {
      if (intensity < .03) return;
      const ex = W * cyclopsX, ey = H * .46 - 76 * DPR, sx = ship.x * W, sy = ship.y - 18 * DPR;
      ctx.save(); ctx.globalCompositeOperation = 'screen';
      const beam = ctx.createLinearGradient(ex, ey, sx, sy);
      beam.addColorStop(0, `rgba(255,226,137,${(.16 * intensity).toFixed(3)})`);
      beam.addColorStop(.64, `rgba(235,208,143,${(.055 * intensity).toFixed(3)})`);
      beam.addColorStop(1, 'rgba(235,208,143,0)');
      ctx.fillStyle = beam; ctx.beginPath(); ctx.moveTo(ex - 4 * DPR, ey + 2 * DPR); ctx.lineTo(ex + 4 * DPR, ey + 2 * DPR); ctx.lineTo(sx + 34 * DPR, sy + 15 * DPR); ctx.lineTo(sx - 34 * DPR, sy - 15 * DPR); ctx.closePath(); ctx.fill();
      const target = ctx.createRadialGradient(sx, sy, 0, sx, sy, 31 * DPR);
      target.addColorStop(0, `rgba(255,232,159,${(.42 * intensity).toFixed(3)})`); target.addColorStop(.38, `rgba(235,208,143,${(.12 * intensity).toFixed(3)})`); target.addColorStop(1, 'rgba(235,208,143,0)');
      ctx.fillStyle = target; ctx.beginPath(); ctx.arc(sx, sy, 31 * DPR, 0, 7); ctx.fill(); ctx.restore();
    }

    /* The sun (by day) or moon (by night) arcs across this same sky, its
       position driven by window.__stormSky — set every minute from the
       real IST clock, not recomputed here so render() stays cheap. */
    function drawCelestial(hor) {
      const sky = window.__stormSky;
      if (!sky) return;
      /* Kept well above the countdown panel's own vertical band so the disc
         arcs clearly over it, but not so high that its peak hides behind the
         fixed nav bar at the very top of the screen. */
      const topMargin = H * 0.14;
      const cx = W * (0.08 + sky.x * 0.84);
      const cy = hor - sky.peak * (hor - topMargin);
      const r = H * 0.042;
      if (sky.type === 'sun') {
        const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 5.5);
        halo.addColorStop(0, 'rgba(255,214,140,.32)');
        halo.addColorStop(.4, 'rgba(235,208,143,.12)');
        halo.addColorStop(1, 'rgba(235,208,143,0)');
        ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(cx, cy, r * 5.5, 0, 7); ctx.fill();
        const disc = ctx.createRadialGradient(cx - r * .25, cy - r * .25, 0, cx, cy, r);
        disc.addColorStop(0, '#fff8e4'); disc.addColorStop(.6, '#ffda8c'); disc.addColorStop(1, '#e3ab54');
        ctx.fillStyle = disc; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.fill();
      } else {
        const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 4.2);
        halo.addColorStop(0, 'rgba(226,232,255,.22)');
        halo.addColorStop(.5, 'rgba(201,162,75,.08)');
        halo.addColorStop(1, 'rgba(201,162,75,0)');
        ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(cx, cy, r * 4.2, 0, 7); ctx.fill();

        ctx.save();
        ctx.beginPath(); ctx.arc(cx, cy, r * .82, 0, 7); ctx.clip();
        const disc = ctx.createRadialGradient(cx - r * .2, cy - r * .2, 0, cx, cy, r * .82);
        disc.addColorStop(0, '#fbf6e6'); disc.addColorStop(1, '#d3c9a0');
        ctx.fillStyle = disc; ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
        /* phase shading — a dark disc slid across the clipped moon face;
           fully lit at full moon, fully hidden at new moon. */
        const litAmount = (1 - Math.cos(sky.moonIllum * Math.PI * 2)) / 2;
        const waxing = sky.moonIllum < .5;
        const shadowOffset = r * 1.8 * litAmount * (waxing ? 1 : -1);
        ctx.fillStyle = '#0d1524';
        ctx.beginPath(); ctx.arc(cx + shadowOffset, cy, r * .82, 0, 7); ctx.fill();
        ctx.restore();
      }

      /* Eclipse: when the disc passes behind the timer panel, flare a
         bright corona around it — the panel's own opaque background does
         the rest, hiding the disc's center and leaving just the rim glow
         peeking out at the panel's edges. */
      const eclipsed = pointInRect(cx, cy, countdownRect, r * .4);
      if (eclipsed) {
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        const corona = ctx.createRadialGradient(cx, cy, r * .85, cx, cy, r * 2.8);
        corona.addColorStop(0, 'rgba(255,247,220,.9)');
        corona.addColorStop(.4, 'rgba(255,225,160,.4)');
        corona.addColorStop(1, 'rgba(255,225,160,0)');
        ctx.fillStyle = corona;
        ctx.beginPath(); ctx.arc(cx, cy, r * 2.8, 0, 7); ctx.fill();
        ctx.strokeStyle = 'rgba(255,250,232,.95)';
        ctx.lineWidth = Math.max(1, r * .1);
        ctx.beginPath(); ctx.arc(cx, cy, r * 1.06, 0, 7); ctx.stroke();
        ctx.restore();
      }
      if (eclipsed !== wasEclipsed) {
        wasEclipsed = eclipsed;
        if (countdownEl) countdownEl.classList.toggle('is-eclipsed', eclipsed);
      }
    }

    /* ---- main render ---- */
    function render() {
      if (!visible) return;
      t += 0.016;
      updateCyclopsThreat();
      const hor = H * 0.46;

      /* sky — lighter by day (sun overhead), the usual dark palette by night */
      const stormSky = window.__stormSky;
      const skyColors = skyGradientColors(stormSky);
      const skyGrad = ctx.createLinearGradient(0, 0, 0, hor * 1.25);
      skyGrad.addColorStop(0, skyColors[0]);
      skyGrad.addColorStop(.45, skyColors[1]);
      skyGrad.addColorStop(.85, skyColors[2]);
      skyGrad.addColorStop(1, skyColors[3]);
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, W, hor + 2);

      /* buried storm-light behind the clouds */
      const glow = ctx.createRadialGradient(W * .5, hor * .78, 0, W * .5, hor * .78, W * .42);
      glow.addColorStop(0, 'rgba(201,162,75,.10)');
      glow.addColorStop(.5, 'rgba(120,130,160,.05)');
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, W, hor + 2);

      drawCelestial(hor);

      drawCyclops(t, cyclopsIntensity);

      /* sea base */
      const sea = ctx.createLinearGradient(0, hor, 0, H);
      sea.addColorStop(0, '#22384F');
      sea.addColorStop(.2, '#152840');
      sea.addColorStop(.65, '#0A1626');
      sea.addColorStop(1, '#04090F');
      ctx.fillStyle = sea;
      ctx.fillRect(0, hor, W, H - hor);

      /* horizon glow line */
      ctx.fillStyle = 'rgba(190,200,215,.14)';
      ctx.fillRect(0, hor - 1, W, 1.4 * DPR);

      /* wave layers, far → near; ship sails between mid layers */
      const LAYERS = 9;
      const WAVE_STEP = 8 * DPR;
      let shipDrawn = false;
      for (let L = 0; L < LAYERS; L++) {
        const p = L / (LAYERS - 1);
        if (!shipDrawn && p >= SHIP_LAYER_P) { drawShip(t); shipDrawn = true; }
        const g = layerGeom(p);
        /* waveY() only needs computing once per x per layer — the fill path
           and the crest stroke used to each call it separately, doubling
           the sin() cost of this loop for two paths tracing the same curve. */
        const xs = [], ys = [];
        for (let x = 0; x <= W; x += WAVE_STEP) { xs.push(x); ys.push(waveY(x, p, t)); }
        ctx.beginPath();
        ctx.moveTo(0, H);
        for (let i = 0; i < xs.length; i++) ctx.lineTo(xs[i], ys[i]);
        ctx.lineTo(W, H);
        ctx.closePath();
        const a = .12 + p * .17;
        const fg = ctx.createLinearGradient(0, g.yBase - g.amp, 0, g.yBase + g.amp * 3);
        fg.addColorStop(0, `rgba(${34 + p * 30 | 0},${60 + p * 34 | 0},${92 + p * 30 | 0},${a})`);
        fg.addColorStop(1, `rgba(${8 + p * 8 | 0},${15 + p * 12 | 0},${28 + p * 14 | 0},${a * 1.3})`);
        ctx.fillStyle = fg;
        ctx.fill();
        /* foam crest */
        ctx.beginPath();
        for (let i = 0; i < xs.length; i++) i === 0 ? ctx.moveTo(xs[i], ys[i]) : ctx.lineTo(xs[i], ys[i]);
        ctx.strokeStyle = `rgba(${188 + p * 50 | 0},${196 + p * 42 | 0},${200 + p * 30 | 0},${.05 + p * .10})`;
        ctx.lineWidth = (0.8 + p * 1.6) * DPR;
        ctx.stroke();
        /* whitecap flecks on stormy crests — batched into one path/fill per
           layer instead of a separate fillRect() draw call per fleck. */
        if (p > .3) {
          ctx.fillStyle = `rgba(225,232,238,${(.04 + p * .08).toFixed(3)})`;
          const fw = (14 + p * 26) * DPR, fh = 1.3 * DPR;
          ctx.beginPath();
          for (let x = ((t * 60) % 180) * DPR; x < W; x += 180 * DPR) {
            const y = waveY(x, p, t);
            const ph = Math.sin(x * g.freq + t * g.spd);
            if (ph > .55) ctx.rect(x, y - 1 * DPR, fw, fh);
          }
          ctx.fill();
        }
      }

      /* sea mist above the waterline */
      const mist = ctx.createLinearGradient(0, hor, 0, hor + (H - hor) * .36);
      mist.addColorStop(0, 'rgba(40,60,86,.38)');
      mist.addColorStop(1, 'rgba(40,60,86,0)');
      ctx.fillStyle = mist;
      ctx.fillRect(0, hor, W, (H - hor) * .36);

      /* At the peak of a sighting, the storm itself falls almost completely into shadow. */
      if (cyclopsIntensity > .035) {
        ctx.fillStyle = `rgba(0,0,0,${(.91 * cyclopsIntensity).toFixed(3)})`;
        ctx.fillRect(0, 0, W, H);
        drawThreatGlare(cyclopsIntensity);
        drawCyclops(t, Math.min(1, cyclopsIntensity * 1.22));
        /* redraw without advancing: vessel and lantern survive as the only human light */
        drawShip(t, false);
      }
    }
    throttledLoop(render, 30);
  })();

  /* ============================================================
     LIGHTNING — the storm's fury
     ============================================================ */
  (function () {
    const canvas = document.getElementById('lightningCanvas');
    const flash = document.getElementById('stormFlash');
    if (!canvas || !flash) return;
    const ctx = canvas.getContext('2d');
    let W = 0, H = 0, bolts = [], visible = false;

    function resize() {
      const r = stormSection.getBoundingClientRect();
      W = Math.floor(r.width * DPR); H = Math.floor(r.height * DPR);
      canvas.width = W; canvas.height = H;
    }
    resize(); addEventListener('resize', resize);

    new IntersectionObserver(en => { visible = en[0].isIntersecting; }, { threshold: 0 })
      .observe(stormSection);

    function genBolt(x0, y0, x1, y1, displace, detail) {
      if (displace < detail) { return [[x0, y0], [x1, y1]]; }
      const mx = (x0 + x1) / 2 + (Math.random() - .5) * displace;
      const my = (y0 + y1) / 2 + (Math.random() - .5) * displace * .55;
      return genBolt(x0, y0, mx, my, displace / 2, detail).slice(0, -1)
        .concat(genBolt(mx, my, x1, y1, displace / 2, detail));
    }

    function strike() {
      if (!visible || prefersReduced) { schedule(); return; }
      const x = W * (0.18 + Math.random() * 0.64);
      const main = genBolt(x, 0, x + (Math.random() - .5) * W * .22, H * (0.42 + Math.random() * 0.18), W * .13, 6 * DPR);
      const branches = [];
      for (let i = 0; i < 2 + Math.random() * 2 | 0; i++) {
        const seg = main[(Math.random() * main.length * .7) | 0];
        if (seg) branches.push(genBolt(seg[0], seg[1],
          seg[0] + (Math.random() - .5) * W * .18, seg[1] + H * (0.1 + Math.random() * 0.15), W * .06, 6 * DPR));
      }
      bolts.push({ main, branches, life: 1 });
      /* screen flash */
      flash.style.transition = 'none';
      flash.style.opacity = (0.5 + Math.random() * 0.4).toFixed(2);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          flash.style.transition = 'opacity 1.1s cubic-bezier(.2,.7,.3,1)';
          flash.style.opacity = '0';
        });
      });
      /* occasional double strike */
      if (Math.random() < .3) setTimeout(strike, 120 + Math.random() * 180);
      schedule();
    }
    let timer = null;
    function schedule() {
      clearTimeout(timer);
      timer = setTimeout(strike, 2400 + Math.random() * 4200);
    }
    schedule();

    function drawPath(path, width, color, blur) {
      ctx.beginPath();
      path.forEach((p, i) => i === 0 ? ctx.moveTo(p[0], p[1]) : ctx.lineTo(p[0], p[1]));
      ctx.strokeStyle = color; ctx.lineWidth = width;
      ctx.shadowColor = 'rgba(220,228,255,.9)'; ctx.shadowBlur = blur;
      ctx.lineJoin = 'round'; ctx.lineCap = 'round';
      ctx.stroke();
    }

    throttledLoop(function render() {
      if (!visible) return;
      ctx.clearRect(0, 0, W, H);
      bolts = bolts.filter(b => b.life > 0);
      for (const b of bolts) {
        const a = Math.pow(b.life, 1.6);
        ctx.globalAlpha = a;
        drawPath(b.main, 5 * DPR, 'rgba(190,205,255,.32)', 26 * DPR);
        drawPath(b.main, 1.7 * DPR, 'rgba(252,250,255,.96)', 10 * DPR);
        for (const br of b.branches) {
          ctx.globalAlpha = a * .7;
          drawPath(br, 1.1 * DPR, 'rgba(235,238,255,.8)', 7 * DPR);
        }
        b.life -= .045;
      }
      ctx.globalAlpha = 1; ctx.shadowBlur = 0;
    }, 30);
  })();

  /* ---------- interactive celestial field — proximity constellations inspired by the supplied dots interaction ---------- */
  (function () {
    const c = document.getElementById('siteStars'); if (!c) return; const ctx = c.getContext('2d'); let W = 0, H = 0, visible = true, scroll = 0;
    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999 }; const stars = Array.from({ length: 64 }, (_, i) => ({ x: Math.random(), y: Math.random(), r: .5 + Math.random() * 1.42, phase: Math.random() * Math.PI * 2, twinkle: i % 8 === 0 }));
    function resize() { W = c.width = Math.floor(innerWidth * DPR); H = c.height = Math.floor(innerHeight * DPR) } resize(); addEventListener('resize', resize);
    addEventListener('mousemove', e => { mouse.tx = e.clientX * DPR; mouse.ty = e.clientY * DPR }, { passive: true }); addEventListener('mouseleave', () => { mouse.tx = -9999; mouse.ty = -9999 }); addEventListener('scroll', () => scroll = window.scrollY, { passive: true }); document.addEventListener('visibilitychange', () => visible = !document.hidden); let t = 0;
    throttledLoop(function render() {
      if (!visible) return;
      t += prefersReduced ? 0 : .016; mouse.x = lerp(mouse.x, mouse.tx, .09); mouse.y = lerp(mouse.y, mouse.ty, .09); ctx.clearRect(0, 0, W, H); const field = []; const radius = Math.min(205 * DPR, W * .2);
      for (const star of stars) {
        const pulse = star.twinkle ? (.48 + .52 * Math.max(0, Math.sin(t * 1.9 + star.phase))) : .68; const x = star.x * W + Math.sin(scroll * .0015 + star.phase) * 7 * DPR, y = ((star.y * H - scroll * .018 * DPR + H) % H); const distance = Math.hypot(mouse.x - x, mouse.y - y), near = Math.max(0, 1 - distance / radius), size = star.r * (1 + near * 1.55) * DPR, alpha = .13 + pulse * .26 + near * .46; field.push({ x, y, near }); ctx.fillStyle = `rgba(235,225,196,${Math.min(alpha, .96).toFixed(3)})`; ctx.beginPath(); ctx.arc(x, y, size, 0, 7); ctx.fill();
        if ((star.twinkle && pulse > .88) || near > .78) { ctx.strokeStyle = `rgba(255,243,205,${Math.min(.22 + pulse * .32 + near * .32, .9).toFixed(3)})`; ctx.lineWidth = .45 * DPR; const ray = (3 + near * 5) * DPR; ctx.beginPath(); ctx.moveTo(x - ray, y); ctx.lineTo(x + ray, y); ctx.moveTo(x, y - ray); ctx.lineTo(x, y + ray); ctx.stroke() }
      }
      /* Only nearby stars connect: it reads as a responsive constellation, not a permanent grid. */
      for (let i = 0; i < field.length; i++) { const a = field[i]; if (a.near < .14) continue; for (let j = i + 1; j < field.length; j++) { const b = field[j]; if (b.near < .14) continue; const d = Math.hypot(a.x - b.x, a.y - b.y); if (d < 92 * DPR) { ctx.strokeStyle = `rgba(201,162,75,${(.18 * Math.min(a.near, b.near) * (1 - d / (92 * DPR))).toFixed(3)})`; ctx.lineWidth = .5 * DPR; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke() } } }
    }, 30);
  })();

  /* ---------- hero data constellations: a sparse analytical navigation field ---------- */
  (function () {
    const c = document.getElementById('heroDataCanvas'); if (!c) return; const ctx = c.getContext('2d'); let W = 0, H = 0, visible = true;
    const nodes = Array.from({ length: 18 }, () => ({ x: .12 + Math.random() * .76, y: .10 + Math.random() * .43, ph: Math.random() * 6.28 }));
    function resize() { W = c.width = Math.floor(innerWidth * DPR); H = c.height = Math.floor(innerHeight * DPR) } resize(); addEventListener('resize', resize); new IntersectionObserver(e => visible = e[0].isIntersecting, { threshold: 0 }).observe(c); let t = 0;
    throttledLoop(function frame() { if (!visible) return; t += prefersReduced ? 0 : .016; ctx.clearRect(0, 0, W, H); ctx.strokeStyle = 'rgba(201,162,75,.075)'; ctx.lineWidth = DPR; ctx.beginPath(); ctx.ellipse(W * .5, H * .40, W * .34, H * .14, 0, Math.PI * .12, Math.PI * .88); ctx.stroke(); for (let i = 0; i < nodes.length; i++) { const a = nodes[i], ax = (a.x + Math.sin(t * .35 + a.ph) * .008) * W, ay = (a.y + Math.cos(t * .29 + a.ph) * .006) * H; for (let j = i + 1; j < nodes.length; j++) { const b = nodes[j], bx = (b.x + Math.sin(t * .35 + b.ph) * .008) * W, by = (b.y + Math.cos(t * .29 + b.ph) * .006) * H, d = Math.hypot(ax - bx, ay - by); if (d < W * .16) { ctx.strokeStyle = `rgba(201,162,75,${(.1 * (1 - d / (W * .16))).toFixed(3)})`; ctx.lineWidth = .55 * DPR; ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke() } } const g = ctx.createRadialGradient(ax, ay, 0, ax, ay, 7 * DPR); g.addColorStop(0, 'rgba(235,208,143,.76)'); g.addColorStop(1, 'rgba(201,162,75,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(ax, ay, 7 * DPR, 0, 7); ctx.fill() } }, 30);
  })();

  /* ---------- ambient floating particles (foreground dust) ---------- */
  (function () {
    if (prefersReduced) return;
    const c = document.createElement('canvas');
    c.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:8980;';
    document.body.appendChild(c);
    const ctx = c.getContext('2d');
    let W, H, ps = [];
    function resize() {
      W = c.width = Math.floor(innerWidth * DPR);
      H = c.height = Math.floor(innerHeight * DPR);
    }
    resize(); addEventListener('resize', resize);
    const N = Math.min(46, Math.floor(innerWidth / 30));
    for (let i = 0; i < N; i++) ps.push({
      x: Math.random(), y: Math.random(),
      r: (0.6 + Math.random() * 1.5) * DPR,
      vx: (Math.random() - .5) * .00008, vy: -(.00003 + Math.random() * .00009),
      a: .06 + Math.random() * .2, ph: Math.random() * 7
    });
    let t = 0;
    throttledLoop(function loop() {
      t += 0.016;
      ctx.clearRect(0, 0, W, H);
      for (const p of ps) {
        p.x += p.vx + Math.sin(t * .4 + p.ph) * .00004;
        p.y += p.vy;
        if (p.y < -0.02) { p.y = 1.02; p.x = Math.random(); }
        if (p.x < -0.02) p.x = 1.02; if (p.x > 1.02) p.x = -0.02;
        const tw = .5 + .5 * Math.sin(t * 1.1 + p.ph);
        ctx.fillStyle = `rgba(235,208,143,${(p.a * tw).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(p.x * W, p.y * H, p.r, 0, 7);
        ctx.fill();
      }
    }, 30);
  })();

})();


/* ============================================================
   CONTACT COORDINATORS
   Add / remove people here.
   No HTML changes required.
   ============================================================ */

const coordinatorGroups = [

  {
    title: 'Fest Coordinators',

    members: [
      {
        name: 'Dr. Asha Unnikrishnan',
        role: 'Fest Coordinator',
        phone: '+91 94976 43079'
      },
      {
        name: 'Dr. Dibu A S',
        role: 'Fest Coordinator',
        phone: '+91 94963 46742'
      },
      {
        name: 'Dr. Jawahar S',
        role: 'Fest Coordinator',
        phone: '+91 97900 90512'
      },
      {
        name: 'Dr. Monisha Singh',
        role: 'Fest Coordinator',
        phone: '+91 97390 62897'
      },
      {
        name: 'Dr. UmmeSalma M',
        role: 'Fest Coordinator',
        phone: '+91 94963 46742'
      }

    ]
  },


  {
    title: 'Student Coordinators',

    members: [
      {
        name: 'Likhith G Muthyalu',
        role: 'Student Coordinator',
        phone: '+91 95350 74894'
      },
      {
        name: 'Krithika S',
        role: 'Student Coordinator',
        phone: '+91 91106 24844'
      },
      {
        name: 'Bevan Mathew Cyriac',
        role: 'Student Coordinator',
        phone: '+91 95131 16962'
      },
      {
        name: 'Nipuna Ashok',
        role: 'Student Coordinator',
        phone: '+91 90370 96229'
      },

    ]
  }

];

/* ============================================================
   RENDER COORDINATORS
   ============================================================ */

function renderCoordinatorGroups() {

  const container =
    document.getElementById('coordinators-container');

  if (!container) return;


  container.innerHTML = '';


  coordinatorGroups.forEach((group) => {

    const section =
      document.createElement('div');

    section.className =
      'coordinators-section';


    /* ==================================================
       HEADER
       ================================================== */

    const heading =
      document.createElement('div');

    heading.className =
      'coordinators-heading';


    heading.innerHTML = `

      <span class="coordinator-heading-line"></span>

      <h3>
        ${group.title}
      </h3>

      <span class="coordinator-count">
        ${String(group.members.length).padStart(2, '0')}
      </span>

    `;


    section.appendChild(heading);


    /* ==================================================
       MEMBER GRID
       ================================================== */

    const grid =
      document.createElement('div');

    grid.className =
      'coordinators-grid';


    group.members.forEach((member, index) => {

      const card =
        document.createElement('article');

      card.className =
        'coordinator-card';


      const number =
        String(index + 1).padStart(2, '0');


      /* ----------------------------------------------
         CONTACT LINKS
         ---------------------------------------------- */

      let contactHTML = '';


      if (member.phone) {

        const cleanPhone =
          member.phone.replace(/[^\d+]/g, '');

        contactHTML += `
          <a
            href="tel:${cleanPhone}"
            class="coordinator-contact"
          >
            <span class="coordinator-contact-icon">
              ☎
            </span>

            ${member.phone}
          </a>
        `;
      }


      if (member.email) {

        contactHTML += `
          <a
            href="mailto:${member.email}"
            class="coordinator-contact"
          >
            <span class="coordinator-contact-icon">
              ✉
            </span>

            Email
          </a>
        `;
      }


      /* ----------------------------------------------
         CARD
         ---------------------------------------------- */

      card.innerHTML = `

        <div class="coordinator-number">
          ${number}
        </div>

        <div class="coordinator-details">

          <h4>
            ${member.name}
          </h4>

          <p>
            ${member.role || ''}
          </p>

          ${contactHTML
          ? `
                <div class="coordinator-contacts">
                  ${contactHTML}
                </div>
              `
          : ''
        }

        </div>

      `;


      grid.appendChild(card);

    });


    section.appendChild(grid);

    container.appendChild(section);

  });

}

/* ============================================================
   INITIALIZE
   ============================================================ */

document.addEventListener(
  'DOMContentLoaded',
  renderCoordinatorGroups
);