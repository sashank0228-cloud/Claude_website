# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project Overview

**Name:** Claude: Zero to Hero — The Definitive Beginner's Guide
**Type:** Static single-page website (pure HTML/CSS/vanilla JS — no build step, no framework)
**Purpose:** Public learning hub for Claude AI — prompt engineering, agents, CLAUDE.md, planning, orchestration, context management, token optimisation.
**Deployed file:** `index.html` only (~4171 lines).

---

## Critical Git Rule

**Only ever `git add index.html`.** Never stage or commit `My website.html` (legacy — do not touch).
`prototype-cinematic.html` and `new changes.md` are local scratch files — do not commit them either.

---

## File Structure

```
index.html              ← entire site (~4171 lines) — THE ONLY FILE TO EDIT/COMMIT
agent/
  fetch-updates.js      ← Node.js agent: scrapes anthropic.com/news → Claude API → updates.json
  package.json          ← ESM module, @anthropic-ai/sdk dependency
.github/workflows/
  claude-updates.yml    ← GitHub Actions: weekly cron (Mon 9am UTC) + workflow_dispatch
updates.json            ← seed data for toast notification (updated by agent)
My website.html         ← DO NOT TOUCH, DO NOT COMMIT
prototype-cinematic.html← local prototype, DO NOT COMMIT
new changes.md          ← scratch notes, DO NOT COMMIT
```

**Agent setup:** Add `ANTHROPIC_API_KEY` secret in GitHub repo Settings → Secrets → Actions.
**Run agent locally:** `cd agent && npm install && ANTHROPIC_API_KEY=sk-... node fetch-updates.js`

---

## index.html Architecture

The file has **two `<script>` blocks** and one `<style>` block:

1. **`<style>`** (lines ~19–2270) — all CSS
2. **`<body>` HTML** — all markup
3. **First `<script>`** (line ~3276) — main interactive JS (canvas, modal, progress, filter, cursor, etc.)
4. **Second `<script>`** (line ~3855) — AETHER generative JS (marks, emojis, neural network, roadmap rocket, Aero mascot, Aero chat)

### CSS Design Tokens (`:root`)

```css
:root {
  --bg:#0a0a0f; --surface:#12121a; --surface2:#1c1c28; --border:#2a2a3a;
  --accent:#6c63ff; --accent2:#ff6b9d; --accent3:#00d4aa;
  --text:#e8e8f0; --muted:#888899;
  /* Aero aliases → map to above */
  --bg-soft:#0f0f17; --ink:#e8e8f0; --ink-dim:#888899; --ink-faint:#4a4b62;
  --line:rgba(255,255,255,0.08);
}
```

Never hardcode colours outside `:root`. Exception: `.c1`–`.c8` card accents and the Aero gradient SVGs.

---

## HTML Body — Element Order

| Element | ID / Class | Notes |
|---|---|---|
| Global C-marks | `#marks` | Fixed layer, whole page; JS-generated SVG marks |
| Custom cursor | `#cursor-dot`, `#cursor-ring` | pointer:fine only |
| Scroll-to-top | `#scrollTopBtn` | Appears after 400px scroll |
| Loading screen | `#loader` | Counts 0→100, slides up |
| Reading progress | `#readingProgress` | Fixed top bar |
| Side nav | `.side-nav` | Fixed right, scroll-spy |
| Floating widget | `#liveStatusWidget` | Click toggles `#update-toast`; `.has-update` adds pink dot |
| Video modal | `#videoModal` | Triggered by `a[data-video-id]` |
| Top nav | `<nav>` | Fixed; `.scrolled` after 60px |
| Hero | `.hero` | Canvas particles + `#emojis` (JS) + gradient mesh + Claude marks |
| Marquee | `.marquee-container` | Infinite scroll strip |
| Social proof | `.social-proof` | Stats/logos |
| Topics | `#topics` | 8 cards + dot grid + spotlight + `#neuralSvgWrap` (JS) |
| Deep dives | `#deep` | Prose + callouts + code |
| Videos | `#videos` | Filter bar + 17 yt-cards + scan-lines + cinema bar |
| Roadmap | `#roadmap` | Aurora + stars + scroll rocket (`#rmRocket`) |
| FAQ | `#faq` | `<details>` + stars + nebula |
| Update toast | `#update-toast` | Toggled by `#liveStatusWidget` click |
| CTA footer | `.cta-footer` | Bottom call-to-action |
| Footer | `<footer>` | Links + tagline |
| Aero mascot | `#mascot` | Running/jumping CSS character, fixed bottom-left |
| Aero chat | `#aeroChat` | Chat panel, opened by clicking `#mascot` |

---

## First `<script>` — JS Sections Reference

| Section | What it does |
|---|---|
| `HERO CANVAS PARTICLES` | `initCanvas()` — 90 particles (purple/teal/pink), connecting lines, mouse repel |
| `SIDE NAVIGATION SCROLL SPY` | `IntersectionObserver` → `.active` on `.side-nav a` |
| `LOADING SCREEN` | IIFE — eased 0→100 counter, `#loader.done` slides up |
| `NAV SCROLL STATE` | `nav.classList.toggle('scrolled', scrollY > 60)` |
| `READING PROGRESS BAR` | `#readingProgress` width as % page scrolled |
| `TOP NAV ACTIVE LINK` | `updateTopNav()` — `.nav-active` on current section link |
| `SCROLL REVEAL` | `revealObserver` (threshold 0.08) → `.visible` on `.reveal` elements |
| `CARD STAGGER` | `cardObserver` — 70ms stagger on `.topic-card`/`.yt-card` |
| `HERO HEADLINE WORD REVEAL` | `.word-span` injected into h1, staggered `animation-delay` |
| `VIDEO MODAL` | Event delegation on `a[data-video-id]` → youtube-nocookie embed |
| `PROGRESS TRACKER` | `toggleProgress(idx)`, `loadProgress()`, `updateBadge()` — `localStorage` key `claudeos_progress` |
| `ROADMAP PROGRESS` | `.roadmap-item[data-step]` click → `localStorage` key `roadmap_{step}` |
| `VIDEO FILTER` | `filterVideos(btn, category)` — show/hide `.yt-card` by `data-category` |
| `COPY CODE` | `copyCode(button)` — `.code-block` innerText |
| `COPY CALLOUT` | `copyCallout(button)` — clones `.callout`, strips button, copies text |
| `CUSTOM CURSOR` | `(pointer:fine)` guard → dot tracks mouse, ring lerps, hover state |
| `MAGNETIC BUTTONS` | `.hero .btn` pull toward cursor (28% magnitude) |
| `CARD GLOW TRACKING` | `--glow-x`/`--glow-y` CSS props on `.topic-card`/`.yt-card` |
| `UPDATE TOAST` | `#liveStatusWidget` click toggles `#update-toast`; fetches `updates.json`; `sessionStorage` for auto-show-once |
| `FLYTHROUGH OBJECTS` | `triggerFlythrough()` via `IntersectionObserver` per section; fires once |
| `INIT` | `loadProgress()` |

## Second `<script>` — AETHER Generative JS

| Section | What it does |
|---|---|
| `MARKS GENERATION` | 14 JS-generated SVG C-mark divs injected into `#marks` |
| `EMOJIS GENERATION` | 22 JS-generated `.em` spans injected into `#emojis` inside hero |
| `NEURAL NETWORK` | JS builds full SVG with SMIL `animateMotion` pulses into `#neuralSvgWrap` |
| `ROADMAP SCROLL ROCKET` | IIFE: `#rmRocket` top%, `#rmFill` height, `.active` on milestones |
| `AERO MASCOT` | `jump(text)` — squash/stretch hop + speech bubble; fires on section scroll |
| `AERO CHAT` | `openChat`/`closeChat`, `askAero(q)`, `speak(text)` via Web Speech API; custom KB persona for this site; graceful fallback answers |

---

## Topic Cards (`#topics`)

Cards `.c1`–`.c7` open the video modal; `.c8` links to external docs.

Each card: `href`, `data-video-id` (YouTube only), optional `data-start` (seconds), `.progress-check` label with `onclick="toggleProgress(N)"` and `id="check-N"`.

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

## YouTube Grid (`#videos`)

17 cards. Each `.yt-card`: `href`, `data-video-id`, `data-category` (space-separated: `beginner prompts agents claudemd planning context tokens`), optional `data-start`, `<img src="https://img.youtube.com/vi/{ID}/hqdefault.jpg">`.

---

## Animations & Cinematic Backgrounds

| Section | Background |
|---|---|
| Hero | Gradient mesh (4 drifting blobs) + particle canvas + JS C-marks + rising emojis |
| Topics | Dot grid + auto-roaming spotlight + JS SMIL neural network |
| Videos | Near-black + CSS scan-lines + sweeping cinema top bar |
| Roadmap | Aurora (4 radial blobs, `auroraShift` 8s) + CSS grid overlay + star field + scroll rocket with flame |
| FAQ | Star field + bottom nebula orb |

**To opt a new element into scroll reveal:** add `class="reveal"` — handled by `revealObserver`.
**Card glow:** `.topic-card` and `.yt-card` already have `--glow-x`/`--glow-y` CSS props tracked by JS.
**Flythrough objects:** add a `.fly-obj` span with an `id` inside any section, then add an entry to `flyConfigs` in the JS.

---

## Aero Mascot & Chat

- **Mascot** (`#mascot`) — runs in from left 600ms after load; hops + shows bubble on each section scroll
- **Chat** (`#aeroChat`) — opens on mascot click; voice via ElevenLabs (Netlify) + speechSynthesis fallback; `KB` persona string describes this site; `fallbacks` object handles common questions without an API
- **Customise:** edit `KB`, `chips[]`, and `fallbacks{}` in second `<script>` block
- **Wire real AI:** replace the `window.claude.complete` stub with a `fetch('/api/chat', ...)` call to your backend

### Voice System

- **Primary (Netlify):** `/.netlify/functions/speak` → ElevenLabs TTS (requires `ELEVENLABS_API_KEY` and `ELEVENLABS_VOICE_ID` env vars)
- **Fallback (Local/GitHub Pages):** Browser `speechSynthesis` API with voice preference chain:
  1. Google US English Male, David, Mark, Daniel
  2. Any male voice (name contains "male", "man", "guy", "boy")
  3. Any English voice
  4. System default
- **Settings:** `pitch: 0.95` (0.95 = lower/masculine), `rate: 1.06`, `volume: 1`
- **Implementation:** `speak()` function (line ~4272) tries ElevenLabs first, falls back silently if unavailable
- **Netlify setup:** Add secrets in repo Settings → Secrets → Actions: `ELEVENLABS_API_KEY`, `ELEVENLABS_VOICE_ID`

---

## Update Toast & Agent

- `updates.json` — fetched on load; shows toast if latest entry is within 14 days (date checked with UTC offset: `date + 'T00:00:00Z'`)
- `#liveStatusWidget` — fixed bottom-right, appears after 0.9s animation; click toggles `#update-toast`
- `.widget-notif-dot` — pink dot appears when fresh update exists; indicates notification without auto-show
- `#update-toast` — slides up with content: badge, title, summary, link; fetches from `updates.json`; sessionStorage tracks if shown this session
- **Auto-show:** First load within session if update < 14 days old; subsequent visits require manual widget click
- **Mobile:** Toast width full-screen minus margins, positioned above widget
- Agent (`agent/fetch-updates.js`) runs weekly (Mon 9am UTC) via GitHub Actions; scrapes anthropic.com/news, calls Claude API, commits to `updates.json`
- **To test locally:** `ANTHROPIC_API_KEY=sk-... node agent/fetch-updates.js`

---

## Testing

Since there's no build step, test by opening `index.html` locally in a browser:

```bash
# Option 1: Python HTTP server
python3 -m http.server 8000
# Open http://localhost:8000 in browser

# Option 2: Live GitHub Pages
# https://sashank0228-cloud.github.io/Claude_website/
```

**Key things to manually verify:**
- Floating widget appears in bottom-right after ~1s
- Click widget → update toast slides up with Claude news
- Scroll → card reveal animations + flythrough objects (left-to-right per section)
- Hero → canvas particles respond to mouse
- Roadmap → scroll rocket animates and milestone badges update
- Click Aero mascot (bottom-left) → chat opens, voice responds with male voice
- Check browser console (F12) for toast loading logs: `[toast]` prefix

**Browser compatibility:** Modern browsers only (ES6, CSS Grid, fetch, Web Speech API). No IE support.

---

## Conventions

- **Indentation:** 2 spaces
- **Class naming:** kebab-case
- **External links:** always `target="_blank" rel="noopener"`
- **Section comments:** `<!-- NAME -->` HTML · `/* ── NAME ── */` CSS · `// --- NAME ---` JS (first script) · `// ── NAME ──` JS (second script)
- **No `<form>` elements** — use `<button onclick>` instead

---

## NEVER

- Add external JS libraries or CSS frameworks
- Split into multiple files
- Change CSS variable names in `:root`
- Alter roadmap resource links (curated)
- `git add "My website.html"` or `prototype-cinematic.html` or `new changes.md`
- Only ever commit `index.html` (plus `CLAUDE.md`, `updates.json`, `agent/`, `.github/` when explicitly asked)

---

## Common Tasks

**Add a YouTube video card:** Copy any `.yt-card`, set `href`, `data-video-id`, `data-category`, update `<img>` src, update text fields. Add to `.yt-grid`.

**Add a topic card:** Copy existing, use `.c9`+, add CSS for `.c9:hover`/`::before`, add `data-video-id` if YouTube, add `.progress-check` with `id="check-N"` and `toggleProgress(N)`. Update badge total if count changes from 8.

**Add a new section:** pattern → `section-label` → `section-title` → `section-desc` → content. Add `.reveal`. Add `<li><a>` to both `<nav>` and `.side-nav`. Add entry to `flyConfigs` for flythrough.

**Change a colour:** `:root` only.

**Customise Aero chat:** Edit `KB` string, `chips[]` array, and `fallbacks` object in second `<script>`.

---

## Deployment

No build step. Static file only. `index.html` is the entire application.

**GitHub Pages:**
- Push to `main` branch, enable Pages in repo Settings → Pages
- Serves from `https://sashank0228-cloud.github.io/Claude_website/`
- Fallback voice system (no ElevenLabs)

**Netlify:**
- Deploy `index.html` (drag-and-drop or git push)
- Set environment variables for voice:
  - `ELEVENLABS_API_KEY` (from elevenlabs.io)
  - `ELEVENLABS_VOICE_ID` (voice ID from ElevenLabs dashboard)
- Serverless function `netlify/functions/speak.js` handles TTS requests
- Serves from custom domain (e.g., `claude-zero-2-hero.netlify.app`)

**Vercel:**
- `vercel` CLI in project folder
- No serverless function support for voice (use GitHub Pages fallback behavior)

**Cache busting:** GitHub Pages may cache old versions. Force refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+F5` (Windows). Hard refresh clears CSS/JS cache.

---

## Debugging

**Widget/toast not showing?**
- Check browser console for `[toast]` logs (DevTools F12)
- Verify `updates.json` loads: Network tab → check response
- Check if sessionStorage cached the update: `sessionStorage.clear()` then reload
- Widget animates in after 0.9s — wait before concluding it's missing

**Voice not working?**
- Local dev: speechSynthesis fallback (uses system voices)
- Netlify: check env vars `ELEVENLABS_API_KEY` and `ELEVENLABS_VOICE_ID` are set
- Browser console may show `[toast] fetch failed` if ElevenLabs unavailable
- Test fallback: open DevTools, run `speechSynthesis.getVoices()` to see available voices

**Animations stuttering?**
- Check browser DevTools Performance tab
- Disable custom cursor if performance is critical: remove `#cursor-dot` / `#cursor-ring` CSS
- Marks layer (`#marks`) is hidden on mobile (`display: none`) to save render budget

**Updates.json not updating?**
- GitHub Actions workflow `claude-updates.yml` runs Mon 9am UTC
- Manually trigger: Actions tab → `Claude Updates` → `Run workflow`
- Check workflow logs for errors (API key, quota, scraper changes)

---

## Recent Improvements (Phase 1–4)

**Phase 1:** ElevenLabs custom voice (Shanky) + speechSynthesis fallback
- Netlify serverless function (`netlify/functions/speak.js`) proxies ElevenLabs API
- Local/GitHub Pages: browser speechSynthesis with male voice preference (pitch 0.95)

**Phase 2:** Netlify deployment config, canonical URL, SEO meta tags
- Redirects from Netlify to main site configured
- OpenGraph and Twitter Card metadata
- JSON-LD structured data for search engines

**Phase 4:** Full mobile & tablet responsiveness
- Tested on iPhone 13, Samsung S25, iPad
- Floating widget, update toast, animations all responsive
- Safe-area insets for notched devices

**AETHER System:** Generative JS for cinematic elements
- C-marks (14 SVG marks), rising emojis (22), neural network visualization
- Scroll rocket with flame animation and milestone tracking
- Aero mascot with context-aware chat and voice support

**Update Toast Fixes:**
- UTC date parsing (`date + 'T00:00:00Z'`) for consistent age calculation
- Widget animation reduced from 2s to 0.9s (appears faster)
- Console logging `[toast]` prefix for debugging
- Notification dot + manual widget click as fallback when sessionStorage cached

**No planned features** — scope complete. Future iterations: API integration, user accounts, advanced analytics.
