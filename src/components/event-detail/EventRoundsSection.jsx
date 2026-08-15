export default function EventRoundsSection({ event }) {
  if (!event.rounds?.length) return null;

  return (
    <section className="detail-wrap detail-rounds">
      <div className="detail-content">
        <h2>
          The <b>Rounds</b>
        </h2>

        <div className="round-list">
          {event.rounds.map(([title, description], index) => (
            <article key={title}>
              <span>{String(index + 1).padStart(2, '0')}</span>

              <div>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}