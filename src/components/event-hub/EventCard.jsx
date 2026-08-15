/**
 * Event Hub: Event Card Component
 * Individual card in the event deck with preview and routing
 */

import { Link } from 'react-router-dom';
import { ROUTES, UI_TEXT, ACCESSIBILITY, CSS_VARIABLES } from '../../data/constants';

export default function EventCard({ event, index, isSelected, onPreview, onRoute, totalCards }) {
  const handlePreviewClick = () => {
    onPreview(event, index);
  };

  const handleRouteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onRoute(event, index);
  };

  return (
    <article
      role="listitem"
      className={`deck-card deck-card-image ${isSelected ? 'is-selected' : ''}`}
      style={{
        [CSS_VARIABLES.CARD_INDEX]: index,
        [CSS_VARIABLES.CARD_COUNT]: totalCards,
        [CSS_VARIABLES.EVENT_IMAGE]: `url(${event.image})`,
      }}
    >
      <button
        type="button"
        className="deck-card-open"
        onClick={handlePreviewClick}
        aria-label={ACCESSIBILITY.ARIA_LABEL_PREVIEW(event.title)}
      >
        <span className="deck-card-glow" />
        <span className="deck-title">{event.title}</span>
        {/*<span className="deck-description">{event.summary}</span>*/}
      </button>
      <Link
        className="deck-route"
        to={`${ROUTES.EVENTS}/${event.slug}`}
        aria-label={ACCESSIBILITY.ARIA_LABEL_FULL_EVENT(event.title)}
        onClick={handleRouteClick}
      >
        {UI_TEXT.CARD_DECK_VIEW_FULL}
      </Link>
    </article>
  );
}
