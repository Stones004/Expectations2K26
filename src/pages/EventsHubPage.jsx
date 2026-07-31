import {useState} from 'react';
import SiteStars from '../components/SiteStars';
import {Header,Footer} from '../components/Layout';
import CardDeck from '../components/CardDeck';
import EventCanvas from '../components/EventCanvas';
import {events} from '../data/events';

/* Intentionally minimal: shared Odyssey header/footer + living background + supplied card-deck interaction. */
export default function EventsHubPage(){
  const [selected,setSelected]=useState(null);
  return <><SiteStars/><Header/>
    <main className="events-hub events-hub--minimal" aria-label="Events and games">
      <section className="events-deck-only">
        <CardDeck events={events} onSelect={setSelected}/>
      </section>
    </main>
    <Footer/>
    <EventCanvas event={selected} onClose={()=>setSelected(null)}/>
  </>;
}
