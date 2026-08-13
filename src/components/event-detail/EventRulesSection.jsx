export default function EventRulesSection({ event }) {
  return (
    <section className="detail-wrap rules">
      <div className="detail-content">
        <h2>
          Rules &amp; <b>Guidelines</b>
        </h2>
        <ol>
          {event.rules.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ol>
      </div>
    </section>
  );
}
