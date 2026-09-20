export default function EventInfoSection({ event }) {
  const { prize } = event;

  return (
    <section className="detail-wrap detail-info">
      <div className="detail-content">
        <h2>
          Event <b>Information</b>
        </h2>

        {prize?.type === 'cash' && (
          <div className="prize-cash" aria-label={`${prize.amount} cash prize`}>
            <span className="prize-laurel" aria-hidden="true">❦</span>
            <div>
              <small>{prize.note}</small>
              <strong>{prize.amount} CASH PRIZE</strong>
            </div>
            <span className="prize-laurel flip" aria-hidden="true">❦</span>
          </div>
        )}

        {prize?.type === 'podium' && (
          <div className="prize-podium" role="list" aria-label="Prize money">
            {prize.places.map(([place, amount, emblem], i) => (
              <div key={place} role="listitem" className={`prize-place place-${i + 1}`}>
                <em>{emblem}</em>
                <span>{place}</span>
                <b>{amount}</b>
              </div>
            ))}
          </div>
        )}

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
