# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project Overview

**Name:** Claude: Zero to Hero — The Definitive Beginner's Guide
**Type:** Static single-page website (pure HTML/CSS/vanilla JS — no build step, no framework)
**Purpose:** Public learning hub for Claude AI — prompt engineering, agents, CLAUDE.md, planning, orchestration, context management, token optimisation.
**Deployed file:** `index.html` only (~2997 lines).

---

## Critical Git Rule

**Only ever `git add index.html`.** Never stage or commit `My website.html` (legacy copy — do not touch it).

---

## File Structure

```
index.html       ← entire site, one self-contained file (~3000 lines)
My website.html  ← DO NOT TOUCH, DO NOT COMMIT
README.md        ← minimal, not a source of truth
CLAUDE.md        ← this file
```

No build tools. No package.json. No dependencies. Edit `index.html` directly and open in a browser to preview.

---

## index.html Architecture

Three blocks in order:

1. **`<style>` block** (`<head>`) — all CSS, lines 19–1715 approx
2. **`<body>` HTML** — all markup
3. **`<script>` block** (bottom of `<body>`) — all JS, lines 2649–2996 approx

### CSS design tokens (`:root`)

```css
:root {
  --bg: #0a0a0f;        --surface: #12121a;   --surface2: #1c1c28;
  --border: #2a2a3a;    --accent: #6c63ff;    --accent2: #ff6b9d;
  --accent3: #00d4aa;   --text: #e8e8f0;      --muted: #888899;
}
```

Never hardcode colours outside `:root`. Exception: `.c1`–`.c8` topic card accent colours are intentionally hardcoded per card.

### CSS sections (in order)

`NAV` → `HERO` → `SHARED` → `TOPIC CARDS` → `DEEP DIVES` → `YOUTUBE SECTION` → `ROADMAP` → `FAQ` → `FOOTER` → `VIDEO MODAL` → `PROGRESS TRACKER` → `HERO SUB-LINK` → `VIDEO FILTER` → `CALLOUT COPY BUTTON` → `ROADMAP COMPLETED STATE` → `NEW ENHANCEMENTS` → `SCROLL MARQUEE` → `SIDE NAVIGATION` → `FLOATING WIDGET` → `SOCIAL PROOF` → `ENHANCED CTA FOOTER` → `LOADING SCREEN` → `NAV SCROLLED STATE` → `ROADMAP — AURORA BACKGROUND` → `READING PROGRESS BAR` → `SCROLL-TO-TOP BUTTON` → `SCROLL REVEAL` → `TOP NAV ACTIVE LINK` → `HERO WORD REVEAL`

### HTML body sections (in DOM order)

| Element | ID / Class | Notes |
|---|---|---|
| Loading screen | `#loader` | Counts 0→100, slides up on complete |
| Reading progress | `#readingProgress` | Fixed top 3px bar, fills on scroll |
| Scroll-to-top | `#scrollTopBtn` | Appears after 400px scroll, bottom-left |
| Side nav | `.side-nav` | Fixed right, scroll-spy via IntersectionObserver |
| Floating widget | `.floating-widget` | Fixed bottom-right "Live Status" badge |
| Video modal | `#videoModal` | Hidden overlay; triggered by `a[data-video-id]` clicks |
| Top nav | `<nav>` | Fixed top; gains `.scrolled` class after 60px scroll |
| Hero | `.hero` | Canvas particles (`#hero-canvas`) + animated headline |
| Marquee | `.marquee-container` | Infinite scrolling topic labels strip |
| Social proof | `.social-proof` | Stats/logos strip |
| Topics grid | `#topics` | 8 `.topic-card` (`.c1`–`.c8`) with progress checkboxes |
| Deep dives | `#deep` | Long-form prose, callouts, code blocks |
| Video grid | `#videos` | Filter bar + 17 `.yt-card` elements |
| Roadmap | `#roadmap` | Aurora animated bg + 5 clickable week items |
| FAQ | `#faq` | Native `<details>` collapsibles |
| Footer | `<footer>` | Links + tagline |

---

## JS Sections Reference

All JS lives in one `<script>` block. Sections in order:

| Section | What it does |
|---|---|
| `HERO CANVAS PARTICLES` | `initCanvas()` — 90 particles (purple/teal/pink), connecting lines <130px, mouse repel |
| `SIDE NAVIGATION SCROLL SPY` | `IntersectionObserver` on `section[id]` → `.active` on `.side-nav a` |
| `LOADING SCREEN` | IIFE — eased counter 0→100 over 2.2s, then `#loader` slides up via `.done` class |
| `NAV SCROLL STATE` | `scroll` → `nav.classList.toggle('scrolled', scrollY > 60)` |
| `READING PROGRESS BAR` | `scroll` → `#readingProgress` width as % of page scrolled |
| `TOP NAV ACTIVE LINK` | `updateTopNav()` — highlights `.nav-links a` for current section |
| `SCROLL REVEAL` | `revealObserver` (threshold 0.08) — adds `.visible` to `.reveal` elements |
| `CARD STAGGER` | `cardObserver` — staggers `.topic-card` / `.yt-card` opacity+transform at 70ms intervals |
| `HERO HEADLINE WORD REVEAL` | IIFE — wraps `h1` words in `.word-span`, sets staggered `animation-delay` |
| `VIDEO MODAL` | Event delegation on `a[data-video-id]` → `youtube-nocookie.com/embed` iframe |
| `PROGRESS TRACKER` | `toggleProgress(idx)`, `loadProgress()`, `updateBadge(count)` — `localStorage` key `claudeos_progress` |
| `ROADMAP PROGRESS` | Listeners on `.roadmap-item[data-step]` → `localStorage` key `roadmap_{step}` |
| `VIDEO FILTER` | `filterVideos(btn, category)` — show/hide `.yt-card` by `data-category` |
| `COPY CODE` | `copyCode(button)` — copies `.code-block` innerText |
| `COPY CALLOUT` | `copyCallout(button)` — clones `.callout`, strips button node, copies innerText |

---

## Topic Cards (`#topics`)

Cards `.c1`–`.c7` open the video modal; `.c8` links to external docs (no modal).

Each card requires: `href`, `data-video-id` (YouTube only), optional `data-start` (seconds), a `.progress-check` label with `onclick="toggleProgress(N)"` and `id="check-N"`.

| Class | Topic | Video ID |
|---|---|---|
| `.c1` | Prompt Harness Engineering | `nWzXyjXCoCE` |
| `.c2` | AI Agents | `S_oN3vlzpMw` |
| `.c3` | CLAUDE.md Files | `h7QJL2_gEXA` |
| `.c4` | Planning & Task Management | `E6seSBly2Ok` |
| `.c5` | Agent Teams & Orchestration | `-zzbkh9B-5Q` |
| `.c6` | Context Window Management | `I1EGbrH5Xdk` (start=65) |
| `.c7` | Token Savings | `49V-5Ock8LU` |
| `.c8` | Claude API | `https://docs.claude.com/en/api/getting-started` |

---

## YouTube Video Grid (`#videos`)

17 cards in `.yt-grid`. Each `.yt-card` requires:
- `href` — full YouTube/Udemy URL
- `data-video-id` — triggers modal (omit for Udemy card)
- `data-category` — space-separated: `beginner` `prompts` `agents` `claudemd` `planning` `context` `tokens`
- `data-start` — seconds offset (optional)
- `<img src="https://img.youtube.com/vi/{ID}/hqdefault.jpg">` inside `.yt-thumb`

---

## Animations & Motion

- **`.reveal`** — add to any element to opt into scroll-triggered fade+slide-up
- **Roadmap aurora** — `::before` radial gradients + `@keyframes auroraShift` (8s infinite alternate); `::after` CSS grid overlay
- **Loading screen** — eased IIFE counter; exits via `transform: translateY(-100%)`
- **Hero canvas** — `<canvas id="hero-canvas">`; `initCanvas()` draws particles + lines; responds to `mousemove`
- **Card stagger** — `cardObserver` sets inline `style.opacity`/`style.transform` (not a CSS class)
- **Word reveal** — `.word-span` injected by JS into `.hero h1`; animated via `@keyframes wordUp`

---

## Conventions

- **Indentation:** 2 spaces
- **Class naming:** kebab-case (`yt-card`, `topic-card`, `card-cta`)
- **External links:** always `target="_blank" rel="noopener"`
- **Section comments:** `<!-- SECTION NAME -->` in HTML, `/* SECTION NAME */` in CSS, `// --- SECTION ---` in JS
- **No `<form>` elements** — use `<button onclick>` instead

---

## Planned / In Progress

1. **Navigation updates** — top-right nav buttons linking to specific page sections (not yet implemented)
2. **Design inspiration from davidlangarica.dev** — most features now implemented (loading screen, aurora bg, scroll animations, canvas particles, word reveal, nav scroll state); further refinements possible

---

## NEVER

- Add external JS libraries or CSS frameworks
- Split into multiple files
- Remove `rel="noopener"` from external links
- Change CSS variable names in `:root`
- Alter the roadmap section resource links (curated)
- `git add "My website.html"` — only ever commit `index.html`

---

## Common Tasks

**Add a YouTube video card:** Copy any `.yt-card`, set `href`, `data-video-id`, `data-category`, update `<img>` src, update `yt-topic`/`yt-title`/`yt-desc`/`yt-badge`. Place in `.yt-grid` in the correct topic group.

**Add a topic card:** Copy existing `.topic-card`, use next colour class (`.c9`+), add CSS for `.c9:hover` and `.c9::before`, add `data-video-id` if YouTube, add `.progress-check` label with `id="check-N"` and `toggleProgress(N)`. Update total in `updateBadge` if count changes from 8.

**Add a new section:** Pattern is `section-label` → `section-title` → `section-desc` → content. Add `.reveal` to the `<section>`. Add `<li><a>` to both `<nav>` and `.side-nav`.

**Change a colour:** Update `:root` only — never hardcode.

---

## Deployment

No build step. Static file only.

- **GitHub Pages** — push `index.html`, enable Pages in repo Settings
- **Netlify Drop** — drag `index.html` to app.netlify.com/drop
- **Vercel** — `vercel` CLI in project folder

#### new_changes for claude
1. Custom Interactive Cursor

* The Idea: Replace the default mouse pointer with a sleek, minimalist geometric shape (`e.g`., a solid dot that trails slightly).
* The Interaction: When the user hovers over clickable elements (topic cards, buttons, video links), the cursor should smoothly expand or invert its colors to indicate interactivity.
2. Magnetic Buttons

* The Idea: High-end portfolios rarely have static buttons.
* The Interaction: We can add a subtle JavaScript effect to our hero CTAs (`.btn-primary`, `.btn-outline`) and the copy prompt button. When the mouse approaches the button, the button gently pulls towards the cursor within a small radius, creating a "magnetic" physical feel.
3. Scroll Reveal Animations (Staggered)

* The Idea: Currently, only our hero section animates on load. The rest of the site is static when scrolling.
* The Interaction: We should attach an `IntersectionObserver` to the `.topic-card`, `.yt-card`, and `.deep-section` elements. As the user scrolls down, these elements should smoothly fade in and slide up (staggered if in a grid), mimicking the dramatic entrances seen on David's site.
4. Dynamic Card Hover Effects (Glow Tracking)

* The Idea: Our topic cards currently just lift up and change border color.
* The Interaction: We can add a "mouse tracking glow" effect. As the user moves their cursor over a `.topic-card` or `.yt-card`, a soft, subtle radial gradient follows the cursor inside the card's border, giving it a glassy, 3D feel.
5. Cinematic Loading Screen

* The Idea: David's site uses a "Heading to my universe..." loader to mask the initial render and set the tone.
* **The Interaction:**`We can implement a pure CSS/JS minimalist loader`(`e.g`., a simple percentage counter or a "claudeOS initializing..." text) that takes `1-1.5` seconds, then splits open or fades out to reveal the hero section.
6. Refined Spacing (Breathing Room)

* The Idea: Premium sites use negative space aggressively.
* The Interaction: I suggest we increase the vertical padding of our main sections (`e.g`., from `100px` to `150px` or `200px`) and increase the font size of our section headings slightly. This forces the user to focus on one concept at a time.ß