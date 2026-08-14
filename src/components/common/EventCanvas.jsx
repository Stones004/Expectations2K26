/**
 * Common: Event Canvas/Modal Component
 * Shows event preview in a modal dialog
 */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES, UI_TEXT, ACCESSIBILITY } from '../../data/constants';

export default function EventCanvas({ event, onClose }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  if (!event) return null;

  return (
    <div
      className="event-canvas-backdrop"
      role="presentation"
      onMouseDown={onClose}
    >
      <section
        className="event-canvas event-canvas-brief"
        role="dialog"
        aria-modal="true"
        aria-labelledby="eventCanvasTitle"
        onMouseDown={(e) => e.stopPropagation()}
        style={{
          '--event-image': `url(${event.image})`,
        }}
      >
        <div className="canvas-aurora" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
        <div className="canvas-shimmer" aria-hidden="true" />
        <button
          className="canvas-close"
          type="button"
          onClick={onClose}
          aria-label={ACCESSIBILITY.ARIA_LABEL_CLOSE_CANVAS}
        >
          ×
        </button>
        <div className="canvas-brief-content">
          <h2 id="eventCanvasTitle">{event.title}</h2>
          <p>{event.summary}</p>
          <Link className="canvas-route" to={`${ROUTES.EVENTS}/${event.slug}`}>
            {UI_TEXT.EVENT_CANVAS_VIEW_FULL}
          </Link>
        </div>
      </section>
    </div>
  );
}
