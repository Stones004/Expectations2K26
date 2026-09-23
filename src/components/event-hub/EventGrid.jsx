/**
 * Event Hub: Event Grid/Deck Component
 * Main card deck display showing all events
 */

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EventCard from './EventCard';
import { ANIMATION_TIMINGS, UI_TEXT, ROUTES, CSS_VARIABLES } from '../../data/constants';

const MOBILE_QUERY = '(max-width: 760px)';
const CURVE_MAX_ANGLE = 34;
const CURVE_MAX_DEPTH = 90;
// Two buffer copies on each side of the "home" copy (5 total), instead of
// one — a single very fast, hard flick on a real phone can carry enough
// momentum to outrun a one-copy buffer and hit the end of the rendered
// list, which is what made the deck appear to "get stuck" on one card.
const LOOP_COPIES = 5;
const HOME_COPY = Math.floor(LOOP_COPIES / 2);

export default function EventGrid({ events, onSelectEvent }) {
  const [ready, setReady] = useState(false);
  const [selected, setSelected] = useState(null);
  const [mode, setMode] = useState(null);
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(MOBILE_QUERY).matches
  );
  const timer = useRef(null);
  const stageRef = useRef(null);
  const rafRef = useRef(null);
  const navigate = useNavigate();

  // The row loops (mobile only, and only once there are enough cards for a
  // buffer copy on each side to make sense).
  const loop = isMobile && events.length > 2;
  const loopEvents = loop ? Array.from({ length: LOOP_COPIES }, () => events).flat() : events;

  useEffect(() => {
    const id = setTimeout(() => setReady(true), ANIMATION_TIMINGS.INITIAL_READY);
    return () => {
      clearTimeout(id);
      clearTimeout(timer.current);
    };
  }, []);

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    const onChange = () => setIsMobile(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Land on the middle copy before the first paint, so a looping deck looks
  // identical to a plain one on load — the buffer copies only become
  // apparent once the visitor actually scrolls toward an edge.
  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage || !loop) return;

    // useLayoutEffect guarantees this runs after React's own DOM mutations
    // are committed, but not after the mobile stylesheet rules have
    // actually taken effect — on first load those can still be a frame
    // behind, and until they land every card is still positioned by the
    // desktop (absolute, `left: calc(50% - width/2)`) rule, where every
    // card sits at the same x. Measuring "one set" then reads 0 for all of
    // them, the `setWidth > 0` guard skips the position write, and the
    // deck silently starts at the true first card (scrollLeft 0) instead
    // of the home copy — no buffer on the left at all from the very first
    // scroll. offsetLeft is the right property (pure layout geometry,
    // unaffected by transform) but it still needs the mobile layout to
    // have actually been applied first, so retry across a few animation
    // frames rather than assuming that's already true.
    let attempts = 0;
    let rafId = null;
    const tryPosition = () => {
      const cards = stage.querySelectorAll('.deck-card');
      if (cards.length >= events.length * 2) {
        const setWidth = cards[events.length].offsetLeft - cards[0].offsetLeft;
        if (setWidth > 0) {
          stage.scrollLeft = setWidth * HOME_COPY;
          return;
        }
      }
      attempts += 1;
      if (attempts < 8) rafId = requestAnimationFrame(tryPosition);
    };
    tryPosition();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [loop, events.length]);

  // Mobile deck: instead of the desktop fan, cards sit on a scrollable row
  // that curves away in 3D as it scrolls past center — like the inside of a
  // cylinder — so browsing the row feels continuous rather than a flat list.
  // When looping, a separate pass watches for the scroll position drifting
  // into a buffer copy and silently shifts it back by one full set so the
  // row can be scrolled past in either direction forever.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const mq = window.matchMedia(MOBILE_QUERY);
    let idleTimer = null;
    // Cards far from center are fully clamped and look identical frame to
    // frame — re-writing their style every frame is wasted work that adds
    // up fast across the deck's multiple copies (up to 80 cards) and was a
    // likely cause of dropped frames (and the resulting flicker/stutter) on
    // slower phones during a fast swipe. Skip a card's write once its
    // rounded values stop changing.
    const lastValues = new Map();

    const clearCurve = () => {
      lastValues.clear();
      stage.querySelectorAll('.deck-card').forEach((card) => {
        card.style.removeProperty('transform');
        card.style.removeProperty('opacity');
        card.style.removeProperty('filter');
      });
    };

    // CSS `scroll-snap-type` used to own this, but it's a second system
    // trying to control the same thing our own JS wrap-correction does —
    // the two kept disagreeing (the browser re-snapping a position our JS
    // had just corrected, which re-triggered our correction, and so on),
    // which is what caused the deck to seemingly get stuck and keep
    // reverting to one card on a fast swipe. CSS snapping is now off (see
    // global.css); this is the only thing that ever decides where the row
    // rests, on every scroll, so there's nothing left for it to fight.
    //
    // It always re-anchors to the real DOM card nearest the middle of the
    // row (never a computed pixel offset — that's what could land a
    // fraction off the true grid).
    const snapToNearest = () => {
      if (!mq.matches) return;
      const cards = stage.querySelectorAll('.deck-card');
      if (cards.length === 0) return;
      const stageRect = stage.getBoundingClientRect();
      const centerX = stageRect.left + stageRect.width / 2;
      let closestIndex = -1;
      let closestDist = Infinity;
      cards.forEach((card, i) => {
        const rect = card.getBoundingClientRect();
        const dist = Math.abs(rect.left + rect.width / 2 - centerX);
        if (dist < closestDist) {
          closestDist = dist;
          closestIndex = i;
        }
      });
      if (closestIndex === -1) return;

      // Once the nearest card is sitting in the outermost buffer copy on
      // either side, redirect the snap target to the pixel-identical card
      // one full set back toward the middle, before the visitor can scroll
      // far enough to run out of copies — this is what keeps the loop
      // endless. Every other rest just re-centers whichever card is
      // actually already nearest, in place.
      let targetIndex = closestIndex;
      if (loop) {
        const copyIndex = Math.floor(closestIndex / events.length);
        if (copyIndex === 0 || copyIndex === LOOP_COPIES - 1) {
          targetIndex = (HOME_COPY - copyIndex) * events.length + closestIndex;
        }
      }
      const target = cards[targetIndex];
      if (!target) return;

      if (targetIndex === closestIndex) {
        // Ordinary re-centering — scrollIntoView is fine here since the
        // movement is at most a fraction of one card width.
        if (closestDist > 1) target.scrollIntoView({ inline: 'center', block: 'nearest' });
        return;
      }

      // A full-set jump to a different copy of the identical content.
      // Earlier this used to nudge the *current* scrollLeft by one
      // measured "set width" — but that measurement came from
      // getBoundingClientRect(), which by this point reflects the curve
      // effect's already-applied per-card transforms (rotateY/translateZ/
      // scale), not plain layout position, so it over- or under-shot the
      // true distance and the nudge landed one card off from the card it
      // meant to match. Computing the target's own centered scrollLeft
      // directly from offsetLeft/offsetWidth (pure layout geometry, never
      // touched by `transform`) removes that guesswork, and also means any
      // small pre-existing misalignment in the current position can't
      // carry over into the jump. Recomputing the transforms synchronously
      // right after, instead of waiting for the scroll event → rAF
      // pipeline, closes the last gap: without it, cards would render for
      // a frame with transforms still computed for the position they'd
      // just been yanked away from — the visible "two cards clashing"
      // ghost, worst right at the ends of the list where this jump was
      // largest.
      const targetCenter = target.offsetLeft + target.offsetWidth / 2;
      stage.scrollLeft = targetCenter - stage.clientWidth / 2;
      applyUpdate();
    };

    const applyUpdate = () => {
      rafRef.current = null;
      if (!mq.matches || selected !== null) return;

      const stageRect = stage.getBoundingClientRect();
      const centerX = stageRect.left + stageRect.width / 2;

      // Read every card's position first, then write all the style updates
      // in a second pass. Interleaving getBoundingClientRect() (read) with
      // style.setProperty() (write) per card — as this used to do — forces
      // a synchronous layout recalculation on nearly every iteration, which
      // is exactly what made the curve stutter while actively scrolling.
      const cards = stage.querySelectorAll('.deck-card');
      const updates = [];
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const delta = (rect.left + rect.width / 2 - centerX) / (stageRect.width / 2);
        const clamped = Math.max(-1.6, Math.min(1.6, delta));
        const magnitude = Math.min(Math.abs(clamped), 1);
        const angle = Math.round(clamped * CURVE_MAX_ANGLE * 100) / 100;
        const depth = Math.round(Math.abs(clamped) * CURVE_MAX_DEPTH * 100) / 100;
        const scale = Math.round((1 - magnitude * 0.1) * 1000) / 1000;
        const opacity = Math.round(Math.max(1 - Math.min(Math.abs(clamped), 1.3) * 0.32, 0.35) * 1000) / 1000;
        // The further a card sits from center, the more it blurs and dims —
        // without this, two adjacent cards mid-transition could look
        // almost equally "in focus", with no clear centered card to read.
        const blur = Math.round(magnitude * 2.6 * 100) / 100;
        const brightness = Math.round((1 - magnitude * 0.42) * 1000) / 1000;
        const key = `${angle}|${depth}|${scale}|${opacity}|${blur}|${brightness}`;
        if (lastValues.get(card) === key) return;
        lastValues.set(card, key);
        updates.push({ card, angle, depth: -depth, scale, opacity, blur, brightness });
      });
      updates.forEach(({ card, angle, depth, scale, opacity, blur, brightness }) => {
        card.style.setProperty(
          'transform',
          `perspective(1000px) rotateY(${-angle}deg) translateZ(${depth}px) scale(${scale})`,
          'important'
        );
        card.style.setProperty('opacity', String(opacity), 'important');
        card.style.setProperty('filter', `blur(${blur}px) brightness(${brightness})`, 'important');
      });
    };

    const scheduleUpdate = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(applyUpdate);
    };

    const onRest = () => {
      clearTimeout(idleTimer);
      snapToNearest();
      scheduleUpdate();
    };

    // `scrollend` fires exactly once, at the true end of a gesture (touch
    // release + any momentum settling) — that's what the 140ms idle timer
    // below is meant to approximate on browsers that lack it. Running both
    // unconditionally, as this used to, meant that on a real phone a
    // deliberate (not-fast) swipe with a brief mid-gesture pause longer than
    // 140ms would fire the idle fallback while the finger was still down,
    // and snapToNearest() would yank scrollLeft to a "corrected" card out
    // from under the still-active touch. The rest of the gesture then fought
    // that correction, which is what made the deck feel like it froze or
    // jumped mid-swipe. Every current mobile browser supports `scrollend`,
    // so the idle timer now only runs as a genuine fallback where it's
    // missing, never alongside it.
    const supportsScrollEnd = typeof window !== 'undefined' && 'onscrollend' in window;

    const onScroll = () => {
      scheduleUpdate();
      if (supportsScrollEnd) return;
      clearTimeout(idleTimer);
      idleTimer = setTimeout(onRest, 140);
    };

    if (selected !== null || !mq.matches) {
      clearCurve();
    } else {
      scheduleUpdate();
    }

    stage.addEventListener('scroll', onScroll, { passive: true });
    stage.addEventListener('scrollend', onRest, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    mq.addEventListener('change', scheduleUpdate);
    return () => {
      stage.removeEventListener('scroll', onScroll);
      stage.removeEventListener('scrollend', onRest);
      window.removeEventListener('resize', scheduleUpdate);
      mq.removeEventListener('change', scheduleUpdate);
      clearTimeout(idleTimer);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [selected, events.length, loop]);

  const handlePreview = (event, index) => {
    if (selected !== null) return;
    setSelected(index);
    setMode('preview');
    timer.current = setTimeout(() => {
      onSelectEvent(event);
      setSelected(null);
      setMode(null);
    }, ANIMATION_TIMINGS.CARD_PREVIEW);
  };

  const handleRoute = (event, index) => {
    if (selected !== null) return;
    setSelected(index);
    setMode('route');
    timer.current = setTimeout(() => navigate(`${ROUTES.EVENTS}/${event.slug}`), ANIMATION_TIMINGS.CARD_ROUTE);
  };

  return (
    <div
      className={`card-deck ${ready ? 'is-ready' : ''} ${
        selected !== null ? 'is-selecting' : ''
      } ${mode === 'route' ? 'is-routing' : ''}`}
      role="list"
      aria-label="Event games"
    >
      <div
        className="card-deck-stage"
        ref={stageRef}
        style={{
          [CSS_VARIABLES.DECK_COUNT]: events.length,
        }}
      >
        {loopEvents.map((event, index) => (
          <EventCard
            key={loop ? `${event.slug}-${Math.floor(index / events.length)}` : event.slug}
            event={event}
            index={index}
            isSelected={selected === index}
            onPreview={handlePreview}
            onRoute={handleRoute}
            totalCards={events.length}
          />
        ))}
      </div>
      <p className="deck-instruction">
        {UI_TEXT.CARD_DECK_SELECT} · {UI_TEXT.CARD_DECK_VIEW}
      </p>
    </div>
  );
}
