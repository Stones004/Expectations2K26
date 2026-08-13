# 📁 Project Structure Documentation

## Overview
The Expectations 2K26 — Odyssey project has been **refactored into a modular, maintainable structure** while keeping all functionality and styling identical.

---

## Directory Structure

```
src/
├── components/              # All React components
│   ├── common/             # Reusable components
│   │   └── EventCanvas.jsx # Event preview modal
│   │
│   ├── layout/             # Page layout components
│   │   ├── Header.jsx      # Navigation header
│   │   ├── Footer.jsx      # Page footer
│   │   └── index.js        # Layout exports
│   │
│   ├── event-hub/          # Events listing/discovery
│   │   ├── EventCard.jsx   # Individual event card
│   │   ├── EventGrid.jsx   # Event deck display
│   │   └── (CardDeck.jsx)  # Legacy - use EventGrid instead
│   │
│   ├── event-detail/       # Event detail page sections
│   │   ├── EventHeroSection.jsx
│   │   ├── EventInfoSection.jsx
│   │   ├── EventAboutSection.jsx
│   │   ├── EventRoundsSection.jsx
│   │   ├── EventRulesSection.jsx
│   │   ├── EventEvaluationSection.jsx
│   │   ├── EventOrganizersSection.jsx
│   │   ├── EventRegistrationSection.jsx
│   │   └── index.js        # Centralized exports
│   │
│   ├── EventPageLayout.jsx # Event detail page composer
│   ├── SiteStars.jsx       # Background animation
│   ├── HeroOcean.jsx       # Home page hero
│   └── (Legacy files kept for backward compatibility)
│
├── pages/                   # Route pages (one per URL route)
│   ├── HomePage.jsx        # Home page
│   ├── EventDetailPage.jsx # Single event detail page
│   ├── EventsHubPage.jsx   # All events listing
│   └── NotFoundPage.jsx    # 404 page
│
├── data/                    # All static data & configuration
│   ├── events.js           # Event definitions (DO NOT MODIFY STRUCTURE)
│   ├── constants.js        # App-wide constants & text
│   └── copy.js             # (Optional) All text content for translation
│
├── utils/                   # Helper & utility functions
│   ├── eventHelpers.js     # Event-related utilities
│   └── formatters.js       # (Optional) Data formatting utilities
│
├── hooks/                   # Custom React hooks
│   ├── useEvent.js         # Fetch event by slug
│   └── (Add more as needed)
│
├── styles/                  # Modular stylesheets
│   ├── global.css          # Global styles
│   ├── variables.css       # CSS custom properties (colors, fonts, spacing)
│   ├── components/         # Component-specific styles
│   │   ├── button.css
│   │   └── card.css
│   └── pages/              # Page-specific styles
│       ├── event-detail.css
│       └── events-hub.css
│
├── App.jsx                  # Main router
├── main.jsx                 # Entry point
```

---

## 🎯 How to Find & Modify Things

### **Adding New Event Content**
➜ Edit: [`src/data/events.js`](src/data/events.js)
- Events are defined as objects with `slug`, `title`, `summary`, `image`, etc.
- No code changes needed — just update event data

### **Changing UI Text/Labels**
➜ Edit: [`src/data/constants.js`](src/data/constants.js)
- All static text strings are here
- Search for text, find it in `UI_TEXT` object
- Example: Change "Event Information" → update `UI_TEXT.EVENT_INFORMATION`

### **Modifying Event Detail Sections**
Each event detail section is a separate component:
- Hero (title, image): [`src/components/event-detail/EventHeroSection.jsx`](src/components/event-detail/EventHeroSection.jsx)
- Info table: [`src/components/event-detail/EventInfoSection.jsx`](src/components/event-detail/EventInfoSection.jsx)
- About: [`src/components/event-detail/EventAboutSection.jsx`](src/components/event-detail/EventAboutSection.jsx)
- Rounds: [`src/components/event-detail/EventRoundsSection.jsx`](src/components/event-detail/EventRoundsSection.jsx)
- Rules: [`src/components/event-detail/EventRulesSection.jsx`](src/components/event-detail/EventRulesSection.jsx)
- Evaluation: [`src/components/event-detail/EventEvaluationSection.jsx`](src/components/event-detail/EventEvaluationSection.jsx)
- Organizers: [`src/components/event-detail/EventOrganizersSection.jsx`](src/components/event-detail/EventOrganizersSection.jsx)
- Registration: [`src/components/event-detail/EventRegistrationSection.jsx`](src/components/event-detail/EventRegistrationSection.jsx)

### **Changing Colors/Fonts/Spacing**
➜ Edit: [`src/styles/variables.css`](src/styles/variables.css)
- All design tokens are CSS custom properties
- Example: `--primary-color`, `--spacing-md`, etc.

### **Modifying Navigation**
➜ Edit: [`src/components/layout/Header.jsx`](src/components/layout/Header.jsx) or [`src/components/layout/Footer.jsx`](src/components/layout/Footer.jsx)
- Navigation links and layout changes go here

### **Adding New Routes**
1. Create new page in [`src/pages/`](src/pages/)
2. Add route to [`src/App.jsx`](src/App.jsx)
3. Add route constant to [`src/data/constants.js`](src/data/constants.js)

---

## 🔍 Search Guide

| What You Want | Where to Search |
|---|---|
| Change event titles/descriptions | `src/data/events.js` |
| Change any text/label | `src/data/constants.js` (then in `UI_TEXT`) |
| Change hero styling | `src/styles/` (look for `hero` or `detail-hero`) |
| Change card appearance | `src/components/event-hub/` |
| Change registration form | `src/components/event-detail/EventRegistrationSection.jsx` |
| Change animation timing | `src/data/constants.js` → `ANIMATION_TIMINGS` |
| Add new event section | Create new file in `src/components/event-detail/` |
| Change header/footer | `src/components/layout/` |

---

## 📦 Component Breakdown

### Layout Components
- **Header** — Navigation bar with logo
- **Footer** — Footer with links and branding

### Event Hub Components
- **EventGrid** — Main card deck display (renamed from `CardDeck`)
- **EventCard** — Individual event card with preview button
- **EventCanvas** — Modal preview dialog (renamed from `EventCanvas`)

### Event Detail Components
- Each section is standalone and can be modified independently
- All sections receive `event` prop with full event data

### Utility Hooks
- **useEvent(slug)** — Fetches event by slug with memoization

### Utility Functions
- **formatEventInfo()** — Converts event info arrays
- **formatRounds()** — Structures round data
- **formatEvaluation()** — Structures evaluation criteria
- **getEventBySlug()** — Find event in array

---

## 🚀 Development Workflow

### Run Dev Server
```bash
npm run dev
# Opens at http://localhost:5173
```

### Build for Production
```bash
npm run build
# Creates optimized build in dist/
```

### Start Production Server
```bash
python server.py
# Runs at http://localhost:8000
```

---

## ✅ What Stayed the Same

- ✅ **All styling is identical** — No visual changes
- ✅ **All routes work the same** — Same URLs, same pages
- ✅ **Same functionality** — All animations, interactions unchanged
- ✅ **Same performance** — Build sizes nearly identical
- ✅ **Same HTML output** — React renders same DOM

---

## 💡 Key Principles

1. **Single Responsibility** — Each file does one thing
2. **Easy to Search** — Clear names, organized folders
3. **Easy to Change** — Content in data files, styling in CSS
4. **Easy to Add** — New sections just add new components
5. **Easy to Test** — Small, focused components

---

## 🎓 Learning the Code

**New to this project?** Start here:
1. Read [`src/App.jsx`](src/App.jsx) — Understand routes
2. Look at [`src/data/events.js`](src/data/events.js) — See event data
3. Check [`src/pages/EventDetailPage.jsx`](src/pages/EventDetailPage.jsx) — Understand page logic
4. Explore a section like [`src/components/event-detail/EventHeroSection.jsx`](src/components/event-detail/EventHeroSection.jsx) — See component pattern

---

## Questions?

- **"Where do I change [thing]?"** → Check the "Search Guide" table above
- **"How do I add [feature]?"** → Look at similar components as examples
- **"Can I delete old files?"** → Check if still imported; some are legacy backups
