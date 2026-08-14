export default function EventHeroSection({ event }) {
  return (
    <section className="event-detail-hero" style={{ '--event-image': `url(${event.image})` }}>
      <div className="detail-hero-veil" />
      <div className="detail-hero-copy">
        <p>
          Expectations 2K26 <i>◆</i> Department of Data Science &amp; Statistics
        </p>
        <h1>{event.title}</h1>
        <span>{event.tagline}</span>
      </div>
    </section>
  );
}
