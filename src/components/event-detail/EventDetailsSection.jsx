import { useState } from 'react';

export default function EventDetailsSection({ event }) {
    if (!event.details?.length) return null;

    const [openIndex, setOpenIndex] = useState(0);

    return (
        <section className="detail-wrap event-details">
            <div className="detail-content">

                <div className="event-details-heading">
                    <span>THE ODYSSEY</span>

                    <h2>
                        Event <b>Details</b>
                    </h2>

                    <p>
                        Everything you need to know before beginning the journey.
                    </p>
                </div>

                <div className="event-details-list">

                    {event.details.map((section, index) => {
                        const isOpen = openIndex === index;

                        return (
                            <article
                                key={section.title}
                                className={`event-detail-row ${isOpen ? 'is-open' : ''}`}
                            >

                                <button
                                    type="button"
                                    className="event-detail-trigger"
                                    onClick={() =>
                                        setOpenIndex(isOpen ? null : index)
                                    }
                                >
                                    <span className="event-detail-number">
                                        {String(index + 1).padStart(2, '0')}
                                    </span>

                                    <span className="event-detail-title">
                                        {section.title}
                                    </span>

                                    <span className="event-detail-icon">
                                        {isOpen ? '−' : '+'}
                                    </span>
                                </button>

                                <div className="event-detail-body">
                                    <div className="event-detail-items">

                                        {section.items.map(([label, value]) => (
                                            <div
                                                className="event-detail-item"
                                                key={label}
                                            >
                                                <dt>{label}</dt>
                                                <dd>{value}</dd>
                                            </div>
                                        ))}

                                    </div>
                                </div>

                            </article>
                        );
                    })}

                </div>

            </div>
        </section>
    );
}