import SiteStars from './SiteStars';
import { Header, Footer } from './layout';
import {
  EventHeroSection,
  EventInfoSection,
  EventAboutSection,
  EventRoundsSection,
  EventRulesSection,
  EventOrganizersSection,
  EventDetailsSection,
  EventEvaluationSection,
} from './event-detail';

/**
 * Event Page Layout
 * Orchestrates all event detail sections into a single page
 * Composes header, hero, and all event-specific sections
 */
export default function EventPageLayout({ event }) {
  return (
    <>
      <SiteStars />
      <Header />
      <main className="event-detail-page">
        <EventHeroSection event={event} />
        <EventInfoSection event={event} />
        <EventAboutSection event={event} />
        <EventRoundsSection event={event} />
        {event.details?.length > 0 && (
          <EventDetailsSection event={event} />
        )}

        {['sirens-stage', 'myths-in-motion'].includes(event.slug) && (
          <EventEvaluationSection event={event} />
        )}
        <EventRulesSection event={event} />
        <EventOrganizersSection event={event} />

      </main>
      <Footer />
    </>
  );
}
