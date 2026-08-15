export default function EventEvaluationSection({ event }) {
  return (
    <section className="detail-wrap evaluation">
      <div className="detail-content">
        <h2>
          Evaluation <b>Criteria</b>
        </h2>
        <div className="criteria">
          {event.evaluation.map(([label, weight]) => (
            <div key={label}>
              <span>{weight}</span>
              <p>{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
