export default function EventOrganizersSection({ event }) {
  return (
    <section className="detail-wrap organizers">
      <div className="detail-content">
        <h2>
          Meet the <b>Organizers</b>
        </h2>
        <div className="organizer-grid">
          {event.organizers.map((person, index) => (
            <article key={`${person.name}-${index}`}>
              <img src={person.image} alt="" />
              <small>{person.role}</small>
              <h3>{person.name}</h3>
              {person.phone && (
                <a href={`tel:${person.phone.replace(/\s/g, '')}`}>{person.phone}</a>
              )}
              {person.email && (
                <a href={`mailto:${person.email}`}>{person.email}</a>
              )}
              {person.linkedin && (
                <a className="linkedin" href={person.linkedin} target="_blank" rel="noreferrer">
                  LinkedIn ↗
                </a>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
