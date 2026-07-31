import {Routes,Route} from 'react-router-dom';
import HomePage from './pages/HomePage';
import EventDetailPage from './pages/EventDetailPage';
import EventsHubPage from './pages/EventsHubPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App(){return <Routes>
  <Route path="/" element={<HomePage/>}/>
  <Route path="/events" element={<EventsHubPage/>}/>
  {/* Any future event with a unique slug in data/events.js gets a dedicated page automatically. */}
  <Route path="/events/:slug" element={<EventDetailPage/>}/>
  <Route path="*" element={<NotFoundPage/>}/>
</Routes>}
