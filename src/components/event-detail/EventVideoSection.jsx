export default function EventVideoSection({ event }) {
  if (!event.video?.id) return null;

  return (
    <section className="detail-wrap detail-video">
      <div className="detail-content">
        <h2>
          Know the <b>Platform</b>
        </h2>
        <div className="video-brand">
          <img src="/assets/anthrena-logo.png" alt="Anthrena" />
        </div>
        <p className="video-caption">
          Watch this walkthrough of the Anthrena Desk platform before the clock starts —
          it covers everything you need to submit your entry as a .ASBX file.
        </p>
        <div className="video-embed">
          <iframe
            src={`https://www.youtube.com/embed/${event.video.id}`}
            title={event.video.title || 'Event tutorial video'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
