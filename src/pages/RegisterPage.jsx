import { useState } from 'react';
import SiteStars from '../components/SiteStars';
import { Header, Footer } from '../components/layout';
import { REGISTRATION_LINKS } from '../data/constants';

const TRACKS = {
  main: {
    key: 'main',
    glyph: '⚓',
    label: 'Main Expectations',
    dates: '28–29 September',
    blurb: 'The main fest deck — technical, non-technical and flagship events.',
    route: [
      { glyph: '✎', label: 'Read' },
      { glyph: '₹', label: 'Pay' },
      { glyph: '✓', label: 'Submit' },
    ],
    steps: [
      {
        label: 'Step 01',
        glyph: '✎',
        title: 'Read the form first',
        body: (
          <>
            Before paying, open the registration form below and read through it fully so
            you know which package covers the events you want — then come back and pay
            for the matching package.
          </>
        ),
        cta: { label: 'Open Form ↗', href: REGISTRATION_LINKS.FORM_MAIN },
      },
      {
        label: 'Step 02',
        glyph: '₹',
        title: 'Pay the registration fee',
        body: (
          <>
            Click <b>Pay Now</b> below, then on the payment site go to{' '}
            <b>Events → Fest → Choose your package</b> and complete the payment for the
            package that matches what you're registering for.
          </>
        ),
        cta: { label: 'Pay Now ↗', href: REGISTRATION_LINKS.PAY_NOW },
      },
      {
        label: 'Step 03',
        glyph: '✓',
        title: 'Submit with your receipt',
        body: (
          <>
            Attach a screenshot or PDF of your payment receipt to the form before you
            submit it. Registrations without a valid payment receipt will not be confirmed.
          </>
        ),
        cta: null,
      },
    ],
  },
  pre: {
    key: 'pre',
    glyph: '🌊',
    label: 'Pre-Expectations',
    dates: '21–26 September',
    blurb: 'Six warm-up events setting sail early, before the main fest.',
    route: [
      { glyph: '✎', label: 'Read' },
      { glyph: '✓', label: 'Submit' },
    ],
    events: [
      'Forge of Hephaestus',
      'Chronicles of the Voyage',
      "The Argonaut's Cup",
      "The Trickster's Bazaar",
      "Hermes' Gauntlet",
      'Forge of Prometheus (details TBA)',
    ],
    checklist: [
      {
        glyph: '✎',
        text: "Open the form and read through the event(s) you're entering.",
      },
      {
        glyph: '✓',
        text: "Fill in your (or your team's) details and submit — no payment step needed.",
      },
    ],
    formHref: REGISTRATION_LINKS.FORM_PRE_EXPECTATIONS,
  },
};

const READY_LIST = [
  {
    glyph: '🎓',
    title: 'College ID',
    body: 'Keep a valid college ID on hand — you may be asked to show it at on-spot registration or event check-in.',
  },
  {
    glyph: '🧾',
    title: 'Payment receipt',
    body: 'A clear screenshot or PDF of your payment confirmation. It gets attached to the form, so save it somewhere easy to find.',
  },
  {
    glyph: '🗺',
    title: 'Your event list',
    body: 'Decide which events you and your team are registering for before you open the form — it moves a lot faster that way.',
  },
];

const FAQS = [
  {
    q: "What's the difference between the two registration forms?",
    a: "Main Expectations covers the main fest on 28th–29th September and needs a payment receipt attached to the form. Pre-Expectations covers six warm-up events running 21st–26th September, uses its own form, and doesn't need a payment step.",
  },
  {
    q: 'Can I register for more than one event?',
    a: 'Yes. Register individually first, even for group or team events — you can team up with your teammates for the same event afterwards.',
  },
  {
    q: 'Is on-spot registration available?',
    a: 'Yes, on-spot registration is open on 28th and 29th September, subject to availability. Registering online in advance still guarantees your spot.',
  },
  {
    q: 'What exactly do I submit with the form?',
    a: 'A screenshot or PDF of your payment receipt, attached to the registration form. Registrations without a valid receipt will not be confirmed.',
  },
  {
    q: "I'm coming from outside Bangalore — is accommodation available?",
    a: 'Limited accommodation is offered for outstation students on 27th & 28th September (3 days, 2 nights), allocated first-come, first-served — so it helps to register early.',
  },
];

export default function RegisterPage() {
  const [trackKey, setTrackKey] = useState('main');
  const track = TRACKS[trackKey];

  const linksPending =
    REGISTRATION_LINKS.PAY_NOW === '#' ||
    REGISTRATION_LINKS.FORM_MAIN === '#' ||
    REGISTRATION_LINKS.FORM_PRE_EXPECTATIONS === '#';

  return (
    <>
      <SiteStars />
      <Header />
      <main className="event-page">
        <header className="event-hero register-hero" id="registerTop">
          <div className="register-hero-compass" aria-hidden="true">✦</div>
          <small><i aria-hidden="true">⚓</i> Expectations 2K26 ◆ The Odyssey</small>
          <h1>
            Registrations
          </h1>
          <p>
            Two voyages, two forms — pick your track below, then follow the steps to
            secure your place.
          </p>
          <ol className="register-hero-route" aria-label="Registration steps at a glance">
            {track.route.map((step) => (
              <li key={step.label}><span>{step.glyph}</span> {step.label}</li>
            ))}
          </ol>
        </header>

        {linksPending && (
          <div className="section" style={{ paddingTop: 0, paddingBottom: 0, maxWidth: 970 }}>
            <p className="register-pending-note">
              <i>✦</i>
              The payment and form links will be added here as soon as they're live —
              check back closer to the fest.
            </p>
          </div>
        )}

        <section className="section">
          <div className="section-head">
            <span>Choose Your Track</span>
            <h2>
              Two Voyages, <b>One Form Each</b>
            </h2>
            <p>Pick which registration you need — the steps below update to match.</p>
          </div>

          <div className="register-track-switcher" role="tablist" aria-label="Registration track">
            {Object.values(TRACKS).map((t) => (
              <button
                key={t.key}
                type="button"
                role="tab"
                aria-selected={t.key === trackKey}
                className={`register-track-pill${t.key === trackKey ? ' is-active' : ''}`}
                onClick={() => setTrackKey(t.key)}
              >
                <span className="register-track-pill-glyph" aria-hidden="true">{t.glyph}</span>
                <span className="register-track-pill-text">
                  <strong>{t.label}</strong>
                  <small>{t.dates}</small>
                </span>
              </button>
            ))}
          </div>
          <p className="register-track-blurb">{track.blurb}</p>

          {trackKey === 'main' ? (
            <div className="event-highlights-wrap">
              <div className="event-highlights register-steps">
                {track.steps.map((step) => (
                  <article key={step.label}>
                    <small>{step.label}</small>
                    <span>{step.glyph}</span>
                    <h3>{step.title}</h3>
                    <p>{step.body}</p>
                    {step.cta && (
                      <a
                        className="gold-button"
                        href={step.cta.href}
                        target={step.cta.href === '#' ? undefined : '_blank'}
                        rel={step.cta.href === '#' ? undefined : 'noopener noreferrer'}
                        style={{ marginTop: 22, display: 'inline-block' }}
                      >
                        {step.cta.label}
                      </a>
                    )}
                  </article>
                ))}
              </div>
            </div>
          ) : (
            <div className="event-highlights-wrap">
              <div className="register-ticket">
                <div className="register-ticket-main">
                  <small>One Form, Six Events</small>
                  <h3>{track.events.join(' · ')}</h3>
                  <p>
                    No packages, no payment page — one short form covers every
                    pre-expectations event you sign up for.
                  </p>
                  <ul className="register-ticket-checklist">
                    {track.checklist.map((item) => (
                      <li key={item.text}>
                        <span aria-hidden="true">{item.glyph}</span>
                        {item.text}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="register-ticket-stub">
                  <span className="register-ticket-stub-glyph" aria-hidden="true">🌊</span>
                  <strong>Early Boarding · No Payment Step</strong>
                  <a
                    className="gold-button"
                    href={track.formHref}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open Form ↗
                  </a>
                </div>
              </div>
            </div>
          )}
        </section>

        <section className="section">
          <div className="section-head">
            <span>Before You Set Sail</span>
            <h2>
              What to Keep <b>Ready</b>
            </h2>
            <p>A few things on hand now save you a scramble later.</p>
          </div>
          <div className="event-highlights-wrap">
            <div className="event-highlights">
              {READY_LIST.map((item) => (
                <article key={item.title}>
                  <span>{item.glyph}</span>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="detail-wrap rules">
          <div className="detail-content">
            <h2>
              Registration <b>Notes</b>
            </h2>
            <ol>
              <li>Register individually first, even for group/team events — you can team up with the same event afterwards.</li>
              <li>Main Expectations events (28th–29th September) need a payment receipt attached to that form.</li>
              <li>Pre-Expectations events (21st–26th September) use a separate form and don't need a payment receipt — just fill in your details and submit.</li>
              <li>On-spot registration is also available on 28th &amp; 29th September, subject to availability.</li>
              <li>
                For any registration issues, reach out to the coordinators listed on the{' '}
                <a href="/#contact">Contact section</a> of the home page.
              </li>
            </ol>
          </div>
        </section>

        <section className="section">
          <div className="section-head">
            <span>Before You Ask</span>
            <h2>
              Frequently <b>Asked</b>
            </h2>
          </div>
          <div className="faq" style={{ margin: '0 auto' }}>
            <p>
              Still unsure about something? Here are the questions we hear most —
              and if yours isn't here, the coordinators are one message away.
            </p>
            <div>
              {FAQS.map((item) => (
                <details key={item.q}>
                  <summary>
                    {item.q}
                    <b>+</b>
                  </summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="reserve-panel">
          <span className="reserve-eyebrow" style={{ fontSize: 10, letterSpacing: '.34em', color: 'var(--gold)', textTransform: 'uppercase' }}>
            <i aria-hidden="true">⚓</i> The Final Harbour
          </span>
          <h2>
            Still Have <b>Questions?</b>
          </h2>
          <p>Our coordinators are standing by to help you chart the rest of your voyage.</p>
          <div className="reserve-actions">
            <a className="gold-button" href="/#contact">
              Contact the Coordinators ↗
            </a>
            <a className="event-text-link" href="#registerTop">
              Back to the top ↑
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
