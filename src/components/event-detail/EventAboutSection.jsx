export default function EventAboutSection({ event }) {
  return (
    <section className="detail-wrap detail-about">
      <div className="detail-content">
        <h2>
          About the <b>Event</b>
        </h2>
        <p>{event.about}</p>
      </div>
    </section>
  );
}
