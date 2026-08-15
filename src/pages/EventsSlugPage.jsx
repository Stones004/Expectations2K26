import { useParams } from 'react-router-dom';
import { isEventCategory } from '../data/events';
import EventDetailPage from './EventDetailPage';
import EventsHubPage from './EventsHubPage';

export default function EventsSlugPage() {
  const { slug } = useParams();
  return isEventCategory(slug) ? <EventsHubPage category={slug} /> : <EventDetailPage />;
}
