# 🎯 Developer's Cheat Sheet: Finding Everything

## **Where Is Everything?**

```
SEARCH THIS          LOOK HERE                          FILE
─────────────────────────────────────────────────────────────────────────
Event data           src/data/events.js                 
  - Titles           > events array
  - Descriptions     > makeEvent() calls
  - Images           

Text on website      src/data/constants.js              
  - Labels           > UI_TEXT object
  - Buttons          > ACCESSIBILITY object
  - Instructions     

Colors/Fonts         src/styles/variables.css           
  - Theme colors     > :root { --primary-color, etc. }
  - Spacing          > --spacing-sm, --spacing-md
  - Transitions      

Hero section         src/components/event-detail/
  - Title display    > EventHeroSection.jsx
  - Background img   > style={{ '--event-image': ... }}

Info table           src/components/event-detail/
  - Format field     > EventInfoSection.jsx
  - Labels           > event.info.map()

About text           src/components/event-detail/
  - Long description > EventAboutSection.jsx

Rounds list          src/components/event-detail/
  - Round sequence   > EventRoundsSection.jsx
  - Step descriptions

Rules list           src/components/event-detail/
  - Guidelines       > EventRulesSection.jsx
  - Ordered list

Evaluation           src/components/event-detail/
  - Criteria         > EventEvaluationSection.jsx
  - Weights/percent

Organizers cards     src/components/event-detail/
  - Names, roles     > EventOrganizersSection.jsx
  - Contact info     

Registration form    src/components/event-detail/
  - Form fields      > EventRegistrationSection.jsx
  - Submit button    

Event cards          src/components/event-hub/
  - Card styling     > EventCard.jsx
  - Card titles      > event.title, event.summary

Card deck            src/components/event-hub/
  - Deck layout      > EventGrid.jsx
  - Animation timing > ANIMATION_TIMINGS in constants.js

Preview modal        src/components/common/
  - Modal styling    > EventCanvas.jsx
  - Close button     

Header nav           src/components/layout/
  - Logo             > Header.jsx
  - Navigation links 

Footer               src/components/layout/
  - Links            > Footer.jsx
  - Contact info     

Routes/URLs          src/data/constants.js
  - Route paths      > ROUTES object
  - Constants        

Animation timing     src/data/constants.js
  - Delays           > ANIMATION_TIMINGS object
  - Durations        

Global styling       src/styles/
  - Typography       > global.css
  - Layout           
  - Resets           
```

---

## **Common Changes & Where to Make Them**

### **"I need to change [X]"**

| Change | File | Location |
|--------|------|----------|
| Event title | `src/data/events.js` | `title: '...'` |
| Event summary | `src/data/events.js` | `summary: '...'` |
| Event image | `src/data/events.js` | `image: 'url'` |
| Event about text | `src/data/events.js` | `about: '...'` |
| Event round names | `src/data/events.js` | `rounds: [[name, desc], ...]` |
| Event rules | `src/data/events.js` | `rules: [...]` |
| Event evaluation criteria | `src/data/events.js` | `evaluation: [[criteria, weight], ...]` |
| Logo text | `src/components/layout/Header.jsx` | `ODYSSE<em>Y</em>` |
| Header links | `src/components/layout/Header.jsx` | `<Link to="...">` |
| Footer text | `src/components/layout/Footer.jsx` | Footer content |
| Primary color | `src/styles/variables.css` | `--primary-color` |
| Button text | `src/data/constants.js` | `UI_TEXT.CARD_DECK_VIEW_FULL` |
| "Event Information" label | `src/data/constants.js` | `UI_TEXT.EVENT_INFORMATION` |
| Card preview timing | `src/data/constants.js` | `ANIMATION_TIMINGS.CARD_PREVIEW` |
| Hero section layout | `src/components/event-detail/EventHeroSection.jsx` | JSX structure |
| Info table format | `src/components/event-detail/EventInfoSection.jsx` | `.map()` over info |
| Organizer card styling | `src/components/event-detail/EventOrganizersSection.jsx` | `organizer-grid` styles |
| Registration form fields | `src/components/event-detail/EventRegistrationSection.jsx` | `<input>` elements |
| Card animation | `src/components/event-hub/EventGrid.jsx` | `handlePreview()`, `handleRoute()` |

---

## **Quick Copy-Paste Guide**

### Change Event Data
```javascript
// File: src/data/events.js
// Find this:
makeEvent({
  slug: 'data-horizon',
  title: 'The Data Horizon',  ← CHANGE THIS
  tagline: 'Intelligence beyond the horizon.',  ← OR THIS
  summary: 'A flagship exploration...',  ← OR THIS
  // ... etc
})

// Edit it and save
// Website updates automatically!
```

### Change UI Text
```javascript
// File: src/data/constants.js
export const UI_TEXT = {
  EVENT_INFORMATION: 'Event Information',  ← CHANGE TO: 'Event Details'
  CARD_DECK_SELECT: 'Select a card...',    ← OR CHANGE TO: 'Pick an event...'
  // ... etc
}
```

### Change Colors
```css
/* File: src/styles/variables.css */
:root {
  --primary-color: #3b82f6;          /* ← CHANGE TO: #ff6b6b */
  --secondary-color: #10b981;        /* ← OR CHANGE TO: #ffd93d */
  --background-dark: #1a1a2e;        /* ← OR CHANGE TO: #000000 */
  /* ... etc */
}
```

### Change Hero Section
```jsx
// File: src/components/event-detail/EventHeroSection.jsx
export default function EventHeroSection({ event }) {
  return (
    <section className="event-detail-hero">
      {/* Add/remove/modify elements here */}
      <p>{BRANDING}</p>        ← CHANGE OR REMOVE THIS LINE
      <h1>{event.title}</h1>   ← THIS STAYS (comes from data)
      <span>{event.tagline}</span>  ← OR CHANGE THIS
    </section>
  );
}
```

---

## **File Size Quick Reference**

| Folder | Purpose | Files | Lines |
|--------|---------|-------|-------|
| `data/` | Content & config | 2 | ~100 |
| `hooks/` | Custom logic | 1 | ~20 |
| `utils/` | Helper functions | 1 | ~70 |
| `components/` | UI components | 15+ | ~50 each |
| `styles/` | Styling | 3-5 | ~100-200 each |
| **Total** | | ~20 | ~2000 |

**Before:** Few files, ~5000 lines each ❌
**After:** Many files, 50-200 lines each ✅

---

## **Pro Tips**

### Tip 1: Find Where Something Is Used
```bash
# Open VS Code Terminal
# Search for component name:
Ctrl+Shift+F → "EventHeroSection" → shows all files using it
```

### Tip 2: Global Find & Replace
```bash
Ctrl+H → Find: "Old text" → Replace: "New text"
# Updates all occurrences at once
```

### Tip 3: Jump to Definition
```bash
Ctrl+Click on component name → opens that file
```

### Tip 4: Auto-format Code
```bash
Ctrl+K Ctrl+F → formats current file
```

---

## **File Tree (Copy to VS Code)**

```
expectations-odyssey-2k26/
├── 📄 README.md
├── 📄 STRUCTURE.md               ← Read this first!
├── 📄 QUICK_START.md             ← Then this!
├── 📄 REFACTORING_SUMMARY.md     ← Then this!
├── 📄 package.json
├── 📄 requirements.txt
├── 📄 server.py
├── 📄 index.html
├── 🎨 public/
│   └── odyssey-enhanced.html
├── 🔧 src/
│   ├── ⚙️ data/
│   │   ├── events.js              ← Event data
│   │   └── constants.js           ← All text & config ✨
│   ├── 🪝 hooks/
│   │   └── useEvent.js            ← Custom hook ✨
│   ├── 🔨 utils/
│   │   └── eventHelpers.js        ← Helper functions ✨
│   ├── 🎨 components/
│   │   ├── common/                ← Shared components
│   │   │   └── EventCanvas.jsx
│   │   ├── layout/                ← Page layout
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── index.js
│   │   ├── event-hub/             ← Events listing
│   │   │   ├── EventCard.jsx
│   │   │   └── EventGrid.jsx
│   │   ├── event-detail/          ← Event detail sections
│   │   │   ├── EventHeroSection.jsx
│   │   │   ├── EventInfoSection.jsx
│   │   │   ├── EventAboutSection.jsx
│   │   │   ├── EventRoundsSection.jsx
│   │   │   ├── EventRulesSection.jsx
│   │   │   ├── EventEvaluationSection.jsx
│   │   │   ├── EventOrganizersSection.jsx
│   │   │   ├── EventRegistrationSection.jsx
│   │   │   └── index.js
│   │   └── (legacy files...)
│   ├── 📄 pages/
│   │   ├── HomePage.jsx
│   │   ├── EventDetailPage.jsx
│   │   ├── EventsHubPage.jsx
│   │   └── NotFoundPage.jsx
│   ├── 🎨 styles/
│   │   ├── global.css
│   │   ├── variables.css          ← Change colors here ✨
│   │   ├── components/
│   │   └── pages/
│   ├── App.jsx                    ← Routes here
│   └── main.jsx                   ← Entry point
└── 📦 dist/                       ← Built files (don't edit)
```

Legend: ⚙️ = data, 🪝 = hooks, 🔨 = utils, 🎨 = components, 📄 = docs, 🔧 = config

---

**Questions? Check STRUCTURE.md for full details!**
