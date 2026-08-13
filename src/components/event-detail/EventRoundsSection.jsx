export default function EventRoundsSection({ event }) {
  return (
    <section className="detail-wrap detail-rounds">
      <div className="detail-content">
        <h2>
          The <b>Rounds</b>
        </h2>
        <div className="round-list">
          {event.rounds.map(([title, description], index) => (
            <article key={title}>
              <span>0{index + 1}</span>
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
