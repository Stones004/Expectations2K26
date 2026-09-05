/**
 * Layout: Page Header Component
 * Main navigation header with logo and navigation links
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../data/constants';

const NAV_LINKS = [
  { href: '/#storm', label: 'The Voyage' },
  { to: ROUTES.EVENTS, label: 'Events' },
  { href: '/#itinerary', label: 'Itinerary' },
  { href: '/#accommodation', label: 'Accommodation' },
  { href: '/#patrons', label: 'Patrons' },
  { href: '/#contact', label: 'Contact' },
  { to: ROUTES.REGISTER, label: 'Registrations' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* Embedded CSS for the logo layout, mobile menu and responsiveness */}
      <style>{`
        .nav-christ-logo { display: flex; align-items: center; justify-content: flex-end; flex: 0 0 auto; }
        .nav-christ-logo img { width: auto; height: 58px; max-width: 220px; object-fit: contain; }
        .nav.is-scrolled .nav-christ-logo img { height: 46px; }
        @media(max-width: 820px) {
          .nav .nav-christ-logo { display: flex; }
          .nav-christ-logo img { height: 42px; max-width: 130px; }
          .nav.is-scrolled .nav-christ-logo img { height: 36px; }
        }

        /* The shared stylesheet hides .nav nav below 750px with no
           replacement — this burger + full-screen menu fills that gap so
           phone visitors still have a way to navigate. */
        .header-burger {
          display: none;
          flex-direction: column;
          gap: 6px;
          background: none;
          border: none;
          cursor: pointer;
          padding: .4rem;
          z-index: 30;
        }
        .header-burger span {
          display: block;
          width: 24px;
          height: 1px;
          background: var(--ivory, #f4efe4);
          transition: transform .35s, opacity .25s;
        }
        .header-burger.is-open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .header-burger.is-open span:nth-child(2) { opacity: 0; }
        .header-burger.is-open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

        .header-mobile-menu {
          position: fixed;
          inset: 0;
          z-index: 20;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1.9rem;
          background: rgba(3, 7, 13, .97);
          opacity: 0;
          visibility: hidden;
          transition: opacity .4s ease, visibility .4s ease;
        }
        .header-mobile-menu.is-open { opacity: 1; visibility: visible; }
        .header-mobile-menu a {
          font: 500 1.35rem var(--display, serif);
          letter-spacing: .22em;
          text-transform: uppercase;
          color: var(--ivory-dim, #cfc6b0);
        }
        .header-mobile-menu a:hover { color: var(--gold, #c9a24b); }

        @media(max-width: 750px) {
          .header-burger { display: flex; }
        }
      `}</style>

      <header className="nav">
        {/* Main Event Logo */}
        <Link className="nav-logo" to={ROUTES.HOME}>
          <img src="/assets/expectations-logo.png" alt="Expectations 2K26" />
        </Link>

        {/* Navigation Links */}
        <nav>
          {NAV_LINKS.map((link) =>
            link.to ? (
              <Link key={link.label} to={link.to}>
                {link.label}
              </Link>
            ) : (
              <a key={link.label} href={link.href}>
                {link.label}
              </a>
            )
          )}
        </nav>

        {/* University Logo with External Website Link */}
        <div className="nav-christ-logo">
          <a href="https://christuniversity.in" target="_blank" rel="noopener noreferrer">
            <img src="/assets/christ-logo.png" alt="CHRIST (Deemed to be University)" />
          </a>
        </div>

        <button
          type="button"
          className={`header-burger${menuOpen ? ' is-open' : ''}`}
          aria-label="Menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
      </header>

      <div className={`header-mobile-menu${menuOpen ? ' is-open' : ''}`}>
        {NAV_LINKS.map((link) =>
          link.to ? (
            <Link key={link.label} to={link.to} onClick={() => setMenuOpen(false)}>
              {link.label}
            </Link>
          ) : (
            <a key={link.label} href={link.href} onClick={() => setMenuOpen(false)}>
              {link.label}
            </a>
          )
        )}
      </div>
    </>
  );
}
