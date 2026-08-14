import { Routes, Route } from 'react-router-dom';
import { ROUTES } from './data/constants';
import HomePage from './pages/HomePage';
import EventDetailPage from './pages/EventDetailPage';
import EventsHubPage from './pages/EventsHubPage';
import NotFoundPage from './pages/NotFoundPage';

/**
 * Main App Router
 * Defines all application routes and their corresponding page components
 * Event details are automatically generated from data/events.js
 */
export default function App() {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<HomePage />} />
      <Route path={ROUTES.EVENTS} element={<EventsHubPage />} />
      {/* Any future event with a unique slug in data/events.js gets a dedicated page automatically. */}
      <Route path={ROUTES.EVENT_DETAIL} element={<EventDetailPage />} />
      <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
    </Routes>
  );
}
