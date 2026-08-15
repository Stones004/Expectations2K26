/**
 * Layout: Page Header Component
 * Main navigation header with logo and navigation links
 */

import { Link } from 'react-router-dom';
import { ROUTES } from '../../data/constants';

export default function Header() {
  return (
    <header className="nav">
      <Link className="nav-logo" to={ROUTES.HOME}>
        ODYSSE<em>Y</em>
      </Link>
      <nav>
        <Link to={ROUTES.EVENTS}>Events</Link>
        <a href="/#itinerary">Itinerary</a>
        <a href="/#tracks">Tracks</a>
      </nav>
      <a className="nav-cta" href="/#register">Register</a>
    </header>
  );
}
