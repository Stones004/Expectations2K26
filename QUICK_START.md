# 🚀 Quick Start Guide: Modular Odyssey

## **The New Structure (5 seconds)**

```
src/
├── components/         ← React components (UI building blocks)
│   ├── common/        ← Reusable components
│   ├── layout/        ← Header, Footer
│   ├── event-hub/     ← Events listing
│   └── event-detail/  ← Event detail sections
├── pages/             ← Full page components (routes)
├── data/              ← All static content (events, text, config)
├── utils/             ← Helper functions
├── hooks/             ← Custom React hooks
└── styles/            ← CSS files
```

---

## **Most Common Tasks**

### ✏️ **Change Event Content**
File: `src/data/events.js`
```javascript
const makeEvent = (data) => ({
  ...data,
  // Edit these fields:
  slug: 'my-event',
  title: 'Event Title Here',
  tagline: 'Short description',
  summary: 'Longer summary',
  image: 'https://image-url.com/image.jpg',
  about: 'Full event details...',
  // etc.
});
```

### 🎨 **Change Text Anywhere**
File: `src/data/constants.js`
```javascript
export const UI_TEXT = {
  EVENT_INFORMATION: 'Event Information', // ← Change this
  CARD_DECK_SELECT: 'Select a card to preview', // ← Or this
  // ... etc
};
```

### 🎭 **Change Styling**
File: `src/styles/variables.css` (colors, fonts, spacing)
File: `src/styles/global.css` (global styles)

### 📝 **Modify a Section**
Just edit the component file:
- `src/components/event-detail/EventHeroSection.jsx` — Title/tagline display
- `src/components/event-detail/EventAboutSection.jsx` — About text
- `src/components/event-detail/EventRoundsSection.jsx` — Rounds list
- etc.

### 🔗 **Change Navigation**
File: `src/components/layout/Header.jsx` or `Footer.jsx`

---

## **File Search Patterns**

| Task | Search For |
|------|-----------|
| Text that says "..." | `UI_TEXT` in `src/data/constants.js` |
| Event data | `src/data/events.js` |
| Hero section (title/image) | `EventHeroSection.jsx` |
| Organizers display | `EventOrganizersSection.jsx` |
| Evaluation criteria | `EventEvaluationSection.jsx` |
| Card appearance | `EventCard.jsx` in `event-hub/` |
| Colors | `src/styles/variables.css` |

---

## **Component Map**

```
HomePage
└── iframe (odyssey-enhanced.html) + Links to /events

EventsHubPage
├── Header
├── EventGrid (replaces CardDeck)
│   ├── EventCard (for each event)
│   └── EventCanvas (modal preview)
└── Footer

EventDetailPage
├── Header
├── EventPageLayout
│   ├── EventHeroSection
│   ├── EventInfoSection
│   ├── EventAboutSection
│   ├── EventRoundsSection
│   ├── EventRulesSection
│   ├── EventEvaluationSection
│   ├── EventOrganizersSection
│   └── EventRegistrationSection
└── Footer
```

---

## **Commands**

```bash
# Develop
npm run dev        # Start dev server (http://localhost:5173)

# Build
npm run build      # Create production build

# Deploy
python server.py   # Run production server (http://localhost:8000)
```

---

## **Before & After**

### Before (Monolithic)
❌ Large components with mixed concerns
❌ Hard to find specific text/styling
❌ Difficult to modify without breaking things
❌ ~5000 lines in few files

### After (Modular)
✅ Small, focused components (200-400 lines max)
✅ Text in `constants.js`, easily searchable
✅ Change one thing without affecting others
✅ Organized by feature/purpose
✅ **Looks & works 100% identical**

---

## **Key Files You'll Actually Use**

1. **`src/data/events.js`** — Add/edit events
2. **`src/data/constants.js`** — Change text labels
3. **`src/styles/variables.css`** — Change colors/fonts
4. **Component files in `src/components/event-detail/`** — Modify sections
5. **`src/App.jsx`** — Add new routes

---

## **Example: Change Event Title**

Find the event in `src/data/events.js`:
```javascript
makeEvent({
  slug: 'data-horizon',
  number: '01',
  category: 'Intelligence',
  title: 'The Data Horizon',  ← Change here
  // ...
})
```

**That's it!** Refresh browser, changes appear immediately.

---

## **Example: Change Hero Section Text**

Edit `src/components/event-detail/EventHeroSection.jsx`:
```javascript
<p>{BRANDING}</p>        ← Change this
<h1>{event.title}</h1>   ← Or this (from data)
<span>{event.tagline}</span>  ← Or this
```

---

## **Questions?**

See full documentation in `STRUCTURE.md` in the project root.
