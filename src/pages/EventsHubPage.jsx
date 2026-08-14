import { useState } from 'react';
import SiteStars from '../components/SiteStars';
import { Header, Footer } from '../components/layout';
import EventGrid from '../components/event-hub/EventGrid';
import EventCanvas from '../components/common/EventCanvas';
import { events } from '../data/events';

/**
 * Events Hub Page
 * Displays all events in an interactive card deck
 * Users can preview events via canvas modal or navigate to full event details
 */
export default function EventsHubPage() {
  const [selectedEvent, setSelectedEvent] = useState(null);

  return (
    <>
      <SiteStars />
      <Header />
      <main className="events-hub events-hub--minimal" aria-label="Events and games">
        <section className="events-deck-only">
          <EventGrid events={events} onSelectEvent={setSelectedEvent} />
        </section>
      </main>
      <Footer />
      <EventCanvas event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </>
  );
}
