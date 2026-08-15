import {useState} from 'react';
import SiteStars from './SiteStars';
import {Header,Footer} from './Layout';

export default function EventPageLayout({event}){
  const [submitted,setSubmitted]=useState(false);
  const submit=e=>{e.preventDefault();setSubmitted(true)};
  return <><SiteStars/><Header/><main className="event-detail-page">
    <section className="event-detail-hero" style={{'--event-image':`url(${event.image})`}}>
      <div className="detail-hero-veil"/><div className="detail-hero-copy">
        <p>Expectations 2K26 <i>◆</i> Department of Data Science &amp; Statistics</p>
        <h1>{event.title}</h1><span>{event.tagline}</span>
      </div>
    </section>
    <section className="detail-wrap detail-info"><div className="detail-content"><h2>Event <b>Information</b></h2><dl>{event.info.map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></div></section>
    <section className="detail-wrap detail-about"><div className="detail-content"><h2>About the <b>Event</b></h2><p>{event.about}</p></div></section>
    <section className="detail-wrap detail-rounds"><div className="detail-content"><h2>The <b>Rounds</b></h2><div className="round-list">{event.rounds.map(([title,description],index)=><article key={title}><span>0{index+1}</span><div><h3>{title}</h3><p>{description}</p></div></article>)}</div></div></section>
    <section className="detail-wrap rules"><div className="detail-content"><h2>Rules &amp; <b>Guidelines</b></h2><ol>{event.rules.map(rule=><li key={rule}>{rule}</li>)}</ol></div></section>
    <section className="detail-wrap evaluation"><div className="detail-content"><h2>Evaluation <b>Criteria</b></h2><div className="criteria">{event.evaluation.map(([label,weight])=><div key={label}><span>{weight}</span><p>{label}</p></div>)}</div></div></section>
    <section className="detail-wrap organizers"><div className="detail-content"><h2>Meet the <b>Organizers</b></h2><div className="organizer-grid">{event.organizers.map(person=><article key={person.email}><img src={person.image} alt=""/><small>{person.role}</small><h3>{person.name}</h3><a href={`tel:${person.phone.replace(/\s/g,'')}`}>{person.phone}</a><a href={`mailto:${person.email}`}>{person.email}</a><a className="linkedin" href={person.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a></article>)}</div></div></section>
    <section className="detail-register"><div><span>The Destination</span><h2>Begin Your <b>Odyssey</b></h2><p>The tide turns once a year. Claim your place aboard.</p></div>{submitted?<p className="register-success">Your place on the voyage is held. Watch your inbox.</p>:<form className="event-registration-form" onSubmit={submit}><div className="event-reg-row"><input required placeholder="First name"/><input required placeholder="Last name"/></div><input required type="email" placeholder="Email address"/><input placeholder="Organisation / Institution"/><select required defaultValue=""><option value="" disabled>Choose your current</option><option>{event.title}</option><option>Another Odyssey event</option></select><button className="gold-button">Embark&nbsp;&nbsp;⟶</button></form>}</section>
  </main><Footer/></>;
}
