/**
 * Event Hub: Event Grid/Deck Component
 * Main card deck display showing all events
 */

import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EventCard from './EventCard';
import { ANIMATION_TIMINGS, UI_TEXT, ROUTES, CSS_VARIABLES } from '../../data/constants';

export default function EventGrid({ events, onSelectEvent }) {
  const [ready, setReady] = useState(false);
  const [selected, setSelected] = useState(null);
  const [mode, setMode] = useState(null);
  const timer = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const id = setTimeout(() => setReady(true), ANIMATION_TIMINGS.INITIAL_READY);
    return () => {
      clearTimeout(id);
      clearTimeout(timer.current);
    };
  }, []);

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
        style={{
          [CSS_VARIABLES.DECK_COUNT]: events.length,
        }}
      >
        {events.map((event, index) => (
          <EventCard
            key={event.slug}
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
