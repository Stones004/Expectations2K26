/**
 * Layout: Page Header Component
 * Main navigation header with logo and navigation links
 */

import { Link } from 'react-router-dom';
import { ROUTES } from '../../data/constants';

export default function Header() {
  return (
    <>
      {/* Embedded CSS for the logo layout and responsiveness */}
      <style>{`
        .nav-christ-logo { display: flex; align-items: center; justify-content: flex-end; flex: 0 0 auto; }
        .nav-christ-logo img { width: auto; height: 58px; max-width: 220px; object-fit: contain; }
        .nav.is-scrolled .nav-christ-logo img { height: 46px; }
        @media(max-width: 820px) {
          .nav .nav-christ-logo { display: flex; }
          .nav-christ-logo img { height: 42px; max-width: 130px; }
          .nav.is-scrolled .nav-christ-logo img { height: 36px; }
        }
      `}</style>

      <header className="nav">
        {/* Main Event Logo */}
        <Link className="nav-logo" to={ROUTES.HOME}>
          <img src="/assets/expectations-logo.png" alt="Expectations 2K26" />
        </Link>

        {/* Navigation Links */}
        <nav>
          <Link to={ROUTES.EVENTS}>Events</Link>
          <a href="/#itinerary">Itinerary</a>
          <a href="/#tracks">Tracks</a>
        </nav>

        {/* University Logo with External Website Link */}
        <div className="nav-christ-logo">
          <a href="https://christuniversity.in" target="_blank" rel="noopener noreferrer">
            <img src="/assets/christ-logo.png" alt="CHRIST (Deemed to be University)" />
          </a>
        </div>
      </header>
    </>
  );
}