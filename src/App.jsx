import {Routes,Route} from 'react-router-dom';
import HomePage from './pages/HomePage';
import EventsHubPage from './pages/EventsHubPage';
import EventsSlugPage from './pages/EventsSlugPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App(){return <Routes>
  <Route path="/" element={<HomePage/>}/>
  <Route path="/events" element={<EventsHubPage/>}/>
  <Route path="/events/:slug" element={<EventsSlugPage/>}/>
  <Route path="*" element={<NotFoundPage/>}/>
</Routes>}
