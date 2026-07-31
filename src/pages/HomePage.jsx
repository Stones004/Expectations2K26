import {useRef} from 'react';

/* Preserves the approved flagship build and directs its event showcase into React's shared deck hub. */
export default function HomePage(){
  const frame=useRef(null);
  const connectEventsHub=()=>{
    const doc=frame.current?.contentDocument;if(!doc)return;
    const openHub=()=>window.top.location.assign('/events');
    // Header/mobile navigation points to the single Card Deck events hub.
    doc.querySelectorAll('a[href="#events"]').forEach(link=>{link.href='/events';link.target='_top';});
    // Every main-page event card opens /events — never an individual /events/:slug route.
    doc.querySelectorAll('[data-event-card]').forEach(card=>{
      card.setAttribute('role','link');
      card.setAttribute('aria-label','Open the Events deck');
      card.addEventListener('click',event=>{event.preventDefault();event.stopImmediatePropagation();openHub()},{capture:true});
      card.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();openHub()}},{capture:true});
    });
  };
  return <iframe ref={frame} onLoad={connectEventsHub} className="legacy-home" title="Expectations 2K26 — Odyssey" src="/odyssey-enhanced.html"/>;
}
