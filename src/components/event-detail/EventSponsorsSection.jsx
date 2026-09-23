import { Fragment } from 'react';

/**
 * Event Detail: Sponsors Section ("Voyage Partners")
 * A dedicated showcase for events backed by outside sponsors — currently
 * only Signal 26, whose prize money is split between Anthrena and Qworks.
 * Driven by event.prize.sponsors so any future co-sponsored event picks
 * this up automatically just by declaring sponsors in its prize data.
 */
export default function EventSponsorsSection({ event }) {
  const sponsors = event.prize?.sponsors;
  if (!sponsors?.length) return null;

  return (
    <section className="detail-wrap detail-sponsors">
      <div className="detail-content">
        <span className="sponsors-eyebrow">◆ In Partnership With ◆</span>
        <h2>
          Voyage <b>Partners</b>
        </h2>
        <p className="sponsors-lede">
          Signal 26 sails under two banners — together, {sponsors.map((s) => s.name).join(' and ')} back
          every prize on the podium.
        </p>

        <div className="sponsors-fleet">
          {sponsors.map((sponsor, i) => (
            <Fragment key={sponsor.name}>
              {i > 0 && (
                <div className="sponsors-divider" aria-hidden="true">
                  <div className="sponsors-divider-line">
                    <span className="sponsors-divider-node">⚓</span>
                  </div>
                </div>
              )}
              <article className="sponsor-crest">
                <span className="sponsor-crest-role">{sponsor.role}</span>
                <div className="sponsor-crest-plaque">
                  <img src={sponsor.logo} alt={sponsor.name} />
                </div>
                <p className="sponsor-crest-blurb">{sponsor.blurb}</p>
              </article>
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
