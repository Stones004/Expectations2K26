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
    const cards = stage.querySelectorAll('.deck-card');
    if (cards.length < events.length * 2) return;
    const setWidth = cards[events.length].getBoundingClientRect().left - cards[0].getBoundingClientRect().left;
    if (setWidth > 0) stage.scrollLeft = setWidth * HOME_COPY;
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
    // fraction off the true grid) and, when looping, maps that card to its
    // equivalent in the home copy so the row can keep scrolling forever
    // without ever visibly resetting.
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
      const targetIndex = loop ? HOME_COPY * events.length + (closestIndex % events.length) : closestIndex;
      const target = cards[targetIndex];
      if (target && closestDist > 1) {
        target.scrollIntoView({ inline: 'center', block: 'nearest' });
      }
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

    const onScroll = () => {
      scheduleUpdate();
      // Fallback for browsers without the `scrollend` event: treat a
      // 140ms gap with no further scroll activity as "at rest".
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
