/**
 * Application Constants & Configuration
 * Centralized place for all static text, labels, and configuration
 */

export const APP_NAME = 'Expectations 2K26';
export const DEPARTMENT = 'Department of Data Science & Statistics';
export const BRANDING = `${APP_NAME} ◆ ${DEPARTMENT}`;

export const ROUTES = {
  HOME: '/',
  EVENTS: '/events',
  EVENT_DETAIL: '/events/:slug',
  REGISTER: '/register',
  NOT_FOUND: '*',
};

export const REGISTRATION_LINKS = {
  PAY_NOW: 'https://eacademia.southindianbank.bank.in/ChristFee/',
  FORM: 'https://docs.google.com/forms/d/e/1FAIpQLSdadBANkRQNV-2cSfkh2__YnaEK4COW_yFw7fiMnq8xnDbVsA/viewform?usp=dialog',
};

export const UI_TEXT = {
  // Event Info Section
  EVENT_INFORMATION: 'Event Information',
  
  // Card Deck
  CARD_DECK_SELECT: 'Select a card to preview',
  CARD_DECK_VIEW: 'Use "View full event" for its dedicated passage',
  CARD_DECK_VIEW_FULL: 'View full event ↗',
  
  // Event Canvas
  EVENT_CANVAS_VIEW_FULL: 'View full event ↗',
  
  // Sections
  ABOUT_TITLE: 'About',
  ROUNDS_TITLE: 'Event Rounds',
  RULES_TITLE: 'Rules & Guidelines',
  EVALUATION_TITLE: 'Evaluation Criteria',
  ORGANIZERS_TITLE: 'Meet the Organizers',
  REGISTRATION_TITLE: 'Register for this Event',
  
  // Defaults
  DEFAULT_ERROR_MESSAGE: 'Event not found',
};

export const ACCESSIBILITY = {
  ARIA_LABEL_PREVIEW: (eventTitle) => `Preview ${eventTitle}`,
  ARIA_LABEL_FULL_EVENT: (eventTitle) => `Open full ${eventTitle} event page`,
  ARIA_LABEL_CLOSE_CANVAS: 'Close event canvas',
};

export const ANIMATION_TIMINGS = {
  CARD_PREVIEW: 460,
  CARD_ROUTE: 560,
  INITIAL_READY: 120,
};

export const CSS_VARIABLES = {
  EVENT_IMAGE: '--event-image',
  DECK_COUNT: '--deck-count',
  CARD_INDEX: '--card-index',
  CARD_COUNT: '--card-count',
};
