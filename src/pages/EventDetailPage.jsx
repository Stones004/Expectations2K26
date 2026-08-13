import { useParams } from 'react-router-dom';
import { useEvent } from '../hooks/useEvent';
import EventPageLayout from '../components/EventPageLayout';
import NotFoundPage from './NotFoundPage';

/**
 * Event Detail Page
 * Displays complete event information with all sections
 * Automatically fetches event by URL slug using custom hook
 */
export default function EventDetailPage() {
  const { slug } = useParams();
  const event = useEvent(slug);

  return event ? <EventPageLayout event={event} /> : <NotFoundPage />;
}
