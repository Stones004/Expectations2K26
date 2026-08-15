import { useState } from 'react';
import { Link } from 'react-router-dom';
import SiteStars from '../components/SiteStars';
import { Header, Footer } from '../components/Layout';
import CardDeck from '../components/CardDeck';
import EventCanvas from '../components/EventCanvas';
import { events, findEventCategory, getEventsByGroup } from '../data/events';

export default function EventsHubPage({ category = null }) {
  const [selected, setSelected] = useState(null);
  const categoryMeta = category ? findEventCategory(category) : null;
  const visibleEvents = category ? getEventsByGroup(category) : events;

  return (
    <>
      <SiteStars />
      <Header />
      <main className="events-hub events-hub--minimal" aria-label="Events and games">
        <section className="events-deck-only">
          {categoryMeta ? (
            <div className="events-category-head">
              <p className="events-category-kicker">Expectations 2K26</p>
              <h1>{categoryMeta.title}</h1>
            </div>
          ) : null}
          {visibleEvents.length > 0 ? (
            <>
              <CardDeck events={visibleEvents} onSelect={setSelected} />
              {categoryMeta ? (
                <div className="events-category-foot">
                  <Link className="events-category-back" to="/">
                    ← Back to home
                  </Link>
                </div>
              ) : null}
            </>
          ) : (
            <div className="events-empty">
              <h2>{categoryMeta?.title ?? 'Events'}</h2>
              <p>Events for this category will be announced soon. Check back closer to the fest.</p>
              <Link className="events-category-back" to="/">
                Return home
              </Link>
            </div>
          )}
        </section>
      </main>
      <Footer />
      <EventCanvas event={selected} onClose={() => setSelected(null)} />
    </>
  );
}
