export default function EventInfoSection({ event }) {
  return (
    <section className="detail-wrap detail-info">
      <div className="detail-content">
        <h2>
          Event <b>Information</b>
        </h2>
        <dl>
          {event.info.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
