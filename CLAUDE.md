# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project Overview

**Name:** Claude: Zero to Hero — The Definitive Beginner's Guide  
**Type:** Static single-page website (pure HTML/CSS/vanilla JS — no build step, no framework)  
**Purpose:** Public learning hub for Claude AI — prompt engineering, agents, CLAUDE.md, planning, orchestration, context management, token optimisation.  
**Deployed file:** `index.html` only.

---

## Critical Git Rule

**Only ever `git add index.html`.** Never stage or commit `My website.html` (legacy copy — do not touch it).

---

## File Structure

```
index.html       ← entire site, one self-contained file (~2700 lines)
My website.html  ← DO NOT TOUCH, DO NOT COMMIT
README.md
CLAUDE.md
```

No build tools. No package.json. No dependencies. Edit `index.html` directly and open in a browser to preview.

---

## index.html Architecture

The file has three blocks in order:

1. **`<style>` block** (`<head>`) — all CSS, ~1700 lines
2. **`<body>` HTML** — all markup
3. **`<script>` block** (bottom of `<body>`) — all JS, ~350 lines

### CSS layout (`:root` tokens)

```css
:root {
  --bg: #0a0a0f;        --surface: #12121a;   --surface2: #1c1c28;
  --border: #2a2a3a;    --accent: #6c63ff;    --accent2: #ff6b9d;
  --accent3: #00d4aa;   --text: #e8e8f0;      --muted: #888899;
}
```

Never hardcode colours outside `:root`. The only exceptions are `.c1`–`.c8` topic card accent colours (intentionally hardcoded per card).

### HTML sections (body order)

| Element | ID / Class | Notes |
|---|---|---|
| Loading screen | `#loader` | Counts 0→100, slides up on complete |
| Reading progress bar | `#readingProgress` | Fixed top, fills on scroll |
| Scroll-to-top button | `#scrollTopBtn` | Appears after 400px scroll |
| Side navigation | `.side-nav` | Fixed right, scroll-spy via IntersectionObserver |
| Floating widget | `.floating-widget` | Fixed bottom-right "Live Status" badge |
| Video modal | `#videoModal` | Hidden overlay; triggered by `a[data-video-id]` clicks |
| Top nav | `<nav>` | Fixed, gains `.scrolled` class after 60px scroll |
| Hero | `.hero` | Canvas particles (`#hero-canvas`) + animated headline |
| Marquee | `.marquee-container` | Infinite scrolling topic labels |
| Social proof | `.social-proof` | Stats/brand logos strip |
| Topics grid | `#topics` | 8 `.topic-card` elements (`.c1`–`.c8`) |
| Deep dives | `#deep` | Long-form prose + callouts + code blocks |
| Video grid | `#videos` | Filter bar + 17 `.yt-card` elements |
| Roadmap | `#roadmap` | Aurora animated bg + 5 clickable week items |
| FAQ | `#faq` | Native `<details>` collapsibles |
| Footer | `<footer>` | Links + tagline |

---

## JS Functions Reference

All JS is in the single `<script>` block at the bottom of `<body>`. Sections in order:

| Section | Key functions |
|---|---|
| Hero canvas | `initCanvas()` — 90 multi-color particles, connecting lines (<130px), mouse repel |
| Side nav spy | `IntersectionObserver` on `section[id]` → toggles `.active` on `.side-nav a` |
| Loading screen | IIFE — eased counter 0→100 over 2.2s, then `loader.classList.add('done')` slides it up |
| Nav scroll state | `scroll` listener → `nav.classList.toggle('scrolled', scrollY > 60)` |
| Reading progress | `scroll` listener → `#readingProgress` width as % of page scrolled |
| Top nav active | `updateTopNav()` — highlights `.nav-links a` matching current section |
| Scroll reveal | `revealObserver` (IntersectionObserver, threshold 0.08) → adds `.visible` to `.reveal` elements |
| Card stagger | `cardObserver` — sets `opacity`/`transform` on `.topic-card` and `.yt-card` with 70ms stagger |
| Hero word reveal | IIFE — wraps each word in `.word-span`, sets staggered `animation-delay` |
| Video modal | Event delegation on `a[data-video-id]` → `youtube-nocookie.com/embed` iframe; `closeModal()` clears src |
| Progress tracker | `toggleProgress(idx)`, `loadProgress()`, `updateBadge(count)` — `localStorage` key `claudeos_progress` |
| Roadmap progress | Inline listeners on `.roadmap-item[data-step]` → `localStorage` key `roadmap_{step}` |
| Video filter | `filterVideos(btn, category)` — show/hide `.yt-card` by `data-category` |
| Copy code | `copyCode(button)` — copies `.code-block` innerText |
| Copy callout | `copyCallout(button)` — clones `.callout`, strips button, copies innerText |

---

## Topic Cards (`#topics`)

Cards `.c1`–`.c7` open the video modal; `.c8` links to external docs.

Each card requires: `href`, `data-video-id` (YouTube cards only), optionally `data-start` (seconds), a `.progress-check` label with `onclick="toggleProgress(N)"` and `id="check-N"`.

| Class | Topic | Video ID |
|---|---|---|
| `.c1` | Prompt Harness Engineering | `nWzXyjXCoCE` |
| `.c2` | AI Agents | `S_oN3vlzpMw` |
| `.c3` | CLAUDE.md Files | `h7QJL2_gEXA` |
| `.c4` | Planning & Task Management | `E6seSBly2Ok` |
| `.c5` | Agent Teams & Orchestration | `-zzbkh9B-5Q` |
| `.c6` | Context Window Management | `I1EGbrH5Xdk` (start=65) |
| `.c7` | Token Savings | `49V-5Ock8LU` |
| `.c8` | Claude API | docs.claude.com link (no modal) |

---

## YouTube Video Grid (`#videos`)

17 cards inside `.yt-grid`. Each `.yt-card` requires:
- `href` — full YouTube URL
- `data-video-id` — triggers modal (omit for the Udemy card)
- `data-category` — space-separated filter keys: `beginner` `prompts` `agents` `claudemd` `planning` `context` `tokens`
- `data-start` — seconds offset (optional)
- `<img src="https://img.youtube.com/vi/{ID}/hqdefault.jpg">` inside `.yt-thumb`

---

## Animations & Motion

- **`.reveal`** — add to any element to opt into scroll-triggered fade+slide-up (handled by `revealObserver`)
- **Roadmap aurora** — CSS `::before` radial gradients + `@keyframes auroraShift` (8s infinite); grid overlay via `::after`
- **Loading screen** — eased IIFE counter; overlay uses `transform: translateY(-100%)` to exit
- **Hero canvas** — `<canvas id="hero-canvas">` inside `.hero`; `initCanvas()` draws particles + connecting lines; responds to `mousemove`
- **Card stagger** — set by `cardObserver` inline via `style.opacity` / `style.transform` (not a CSS class)
- **Word reveal** — `.word-span` elements injected by JS into `h1`; animated via `@keyframes wordUp`

---

## NEVER

- Add external JS libraries or CSS frameworks
- Split into multiple files
- Remove `rel="noopener"` from external links
- Change CSS variable names in `:root`
- Alter the roadmap section resource links (curated)
- Use `<form>` elements — use `<button onclick>` instead
- `git add My website.html` — only ever commit `index.html`

---

## Common Tasks

**Add a YouTube video card:** Copy any `.yt-card`, set `href`, `data-video-id`, `data-category`, update the `<img>` src with the video ID, update `yt-topic`/`yt-title`/`yt-desc`/`yt-badge`. Place in `.yt-grid` in the right topic group.

**Add a topic card:** Copy an existing `.topic-card`, use next colour class (`.c9`+), add CSS for `.c9:hover` and `.c9::before`, add `data-video-id` if YouTube, add `.progress-check` label with `id="check-N"` and `toggleProgress(N)`. Update the badge count in `updateBadge` if total changes.

**Add a new section:** Follow `section-label` → `section-title` → `section-desc` → content pattern. Add `.reveal` to the `<section>`. Add `<li><a>` to both `<nav>` and `.side-nav`.

**Change a colour:** Update `:root` only — never hardcode.

---

## Deployment

No build step. Static file only.

- **GitHub Pages** — push `index.html` to repo, enable Pages in Settings
- **Netlify Drop** — drag `index.html` to app.netlify.com/drop
- **Vercel** — `vercel` CLI in project folder
