/**
 * Layout: Page Footer Component
 * Contains branding, navigation links, and contact information
 */

import { Link } from 'react-router-dom';
import { ROUTES } from '../../data/constants';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <div className="footer-brand">
            ODYSSE<em>Y</em>
          </div>
          <p className="footer-quote">
            "Tell me, O Muse, of that ingenious hero who travelled far and wide." A voyage through data,
            intelligence and discovery.
          </p>
        </div>
        <div>
          <h4>Navigate</h4>
          <Link to={ROUTES.HOME}>Home</Link>
          <Link to={ROUTES.EVENTS}>Events</Link>
          <a href="/#register">Register</a>
        </div>
        <div>
          <h4>Harbour</h4>
          <a href="mailto:odyssey@expectations.edu">odyssey@expectations.edu</a>
          <a href="/#">Press & Media</a>
          <a href="/#">Code of the Sea</a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© MMXXVI Expectations 2K26</span>
        <span>Charted in gold · Bound for Ithaca</span>
      </div>
    </footer>
  );
}
