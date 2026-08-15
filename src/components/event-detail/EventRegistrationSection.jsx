import { useState } from 'react';

export default function EventRegistrationSection({ event }) {
  const [submitted, setSubmitted] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="detail-register">
      <div>
        <span>The Destination</span>
        <h2>
          Begin Your <b>Odyssey</b>
        </h2>
        <p>The tide turns once a year. Claim your place aboard.</p>
      </div>

      {submitted ? (
        <p className="register-success">Your place on the voyage is held. Watch your inbox.</p>
      ) : (
        <form className="event-registration-form" onSubmit={submit}>
          <div className="event-reg-row">
            <input required placeholder="First name" />
            <input required placeholder="Last name" />
          </div>
          <input required type="email" placeholder="Email address" />
          <input placeholder="Organisation / Institution" />
          <select required defaultValue="">
            <option value="" disabled>
              Choose your current
            </option>
            <option>{event.title}</option>
            <option>Another Odyssey event</option>
          </select>
          <button className="gold-button">Embark&nbsp;&nbsp;⟶</button>
        </form>
      )}
    </section>
  );
}
