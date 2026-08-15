import {useParams} from 'react-router-dom';
import {findEvent} from '../data/events';
import EventPageLayout from '../components/EventPageLayout';
import NotFoundPage from './NotFoundPage';

/* One scalable route: every event in src/data/events.js automatically receives a page. */
export default function EventDetailPage(){
  const event=findEvent(useParams().slug);
  return event ? <EventPageLayout event={event}/> : <NotFoundPage/>;
}
