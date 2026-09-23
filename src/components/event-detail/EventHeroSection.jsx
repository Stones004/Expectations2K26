/**
 * Event Detail: Hero Section
 * Displays event title, tagline and hero image
 */

import { useLayoutEffect, useRef } from 'react';
import { BRANDING, CSS_VARIABLES } from '../../data/constants';

// Most titles wrap fine between words at the hero's designed font size. A
// title with one long, unbreakable word (e.g. "Intercollegiate" in Signal
// 26) can be wider than the phone screen even on its own line — CSS alone
// can only let that word overflow the page or fall back to breaking it
// mid-letter, and neither reads like a real headline. This measures the
// rendered title after layout and, only if it doesn't actually fit,
// shrinks its font-size in small steps until it does. Every other event's
// title already fits at the CSS-designed size, so this is a no-op for them.
const MIN_FONT_PX = 22;
const STEP_PX = 2;

function useFitHeroTitle(ref, title) {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const fit = () => {
      el.style.fontSize = '';
      let size = parseFloat(getComputedStyle(el).fontSize);
      // scrollWidth outgrowing clientWidth is exactly what a word that
      // can't wrap and is forcing the box wider than its allotted space
      // looks like.
      while (el.scrollWidth > el.clientWidth + 1 && size > MIN_FONT_PX) {
        size -= STEP_PX;
        el.style.fontSize = `${size}px`;
      }
    };

    fit();
    // Re-measure once the display webfont has actually loaded — its
    // metrics differ from the fallback serif Chrome paints with first, so
    // an earlier fit could be based on the wrong width.
    document.fonts?.ready?.then(fit);

    let raf = null;
    const onResize = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        fit();
      });
    };
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      if (raf) cancelAnimationFrame(raf);
    };
    // title is a dependency (not just used inside) so navigating client-side
    // from one event's page to another's re-fits for the new title, even
    // though the <h1> DOM node itself is reused rather than remounted.
  }, [ref, title]);
}

export default function EventHeroSection({ event }) {
  const h1Ref = useRef(null);
  useFitHeroTitle(h1Ref, event.title);

  return (
    <section
      className="event-detail-hero"
      style={{
        [CSS_VARIABLES.EVENT_IMAGE]: `url(${event.image})`,
      }}
    >
      <div className="detail-hero-veil" />
      <div className="detail-hero-copy">
        <p>{BRANDING}</p>
        <h1 ref={h1Ref}>{event.title}</h1>
        <span>{event.tagline}</span>
      </div>
    </section>
  );
}
