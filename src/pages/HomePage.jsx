import { useRef } from 'react';

export default function HomePage() {
  const frame = useRef(null);

  const connectEventsHub = () => {
    const doc = frame.current?.contentDocument;
    if (!doc) return;

    doc.querySelectorAll('[data-event-card]').forEach((card) => {
      const href = card.dataset.categoryHref || '/events';
      const label = card.querySelector('.event-card-title')?.textContent?.trim() || 'Open events';
      const openCategory = () => window.top.location.assign(href);

      card.setAttribute('role', 'link');
      card.setAttribute('aria-label', `Open ${label}`);
      card.addEventListener(
        'click',
        (event) => {
          event.preventDefault();
          event.stopImmediatePropagation();
          openCategory();
        },
        { capture: true }
      );
      card.addEventListener(
        'keydown',
        (event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openCategory();
          }
        },
        { capture: true }
      );
    });
  };

  return (
    <iframe
      ref={frame}
      onLoad={connectEventsHub}
      className="legacy-home"
      title="Expectations 2K26 — Odyssey"
      src="/odyssey-enhanced.html"
    />
  );
}
