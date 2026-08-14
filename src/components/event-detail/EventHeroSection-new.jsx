/**
 * Event Detail: Hero Section
 * Displays event title, tagline and hero image
 */

import { BRANDING, CSS_VARIABLES } from '../../data/constants';

export default function EventHeroSection({ event }) {
  return (
    <section
      className="event-detail-hero"
      style={{
        [CSS_VARIABLES.EVENT_IMAGE]: `url(${event.image})`,
      }}
    >
      <div className="detail-hero-veil" />
      <div className="detail-hero-copy">
        <p>{BRANDING}</p>
        <h1>{event.title}</h1>
        <span>{event.tagline}</span>
      </div>
    </section>
  );
}
