# CLAUDE.md — Project Memory for Claude Zero to Hero

This file is read by Claude at the start of every session. It contains all project context, conventions, and constraints needed to work on this site without re-explanation.

---

## Project Overview

**Name:** Claude: Zero to Hero — The Definitive Beginner's Guide  
**Type:** Static single-page website (pure HTML/CSS/vanilla JS)  
**Purpose:** A public learning hub for beginners learning to use Claude AI — covering prompt engineering, agents, CLAUDE.md, planning, orchestration, context management, and token optimisation.  
**Audience:** Absolute beginners through intermediate Claude users.

---

## File Structure

```
/
└── index.html       # Entire site — one self-contained file (THE ONLY FILE TO EDIT/COMMIT)
└── My website.html  # Legacy copy — DO NOT TOUCH, DO NOT COMMIT
└── README.md        # Project documentation
└── CLAUDE.md        # This file
```

The site is intentionally **one file**. Do not split it into separate CSS/JS files unless explicitly asked.

> **Git rule:** Only ever `git add index.html`. Never stage or commit `My website.html`.

---

## Tech Stack

- Pure HTML5 + CSS3 + vanilla JS (no frameworks, no build tools)
- Google Fonts: `Syne` (headings), `DM Serif Display` (body), `IBM Plex Mono` (mono/labels)
- No external CSS libraries or JS dependencies
- Responsive via CSS Grid + `clamp()` + one `@media (max-width: 640px)` breakpoint
- All JS lives in a single `<script>` block at the bottom of `<body>`

---

## CSS Architecture

All styles live in a single `<style>` block in `<head>`. Key design tokens are in `:root`:

```css
:root {
  --bg: #0a0a0f;
  --surface: #12121a;
  --surface2: #1c1c28;
  --border: #2a2a3a;
  --accent: #6c63ff;      /* purple — primary */
  --accent2: #ff6b9d;     /* pink */
  --accent3: #00d4aa;     /* teal/green */
  --text: #e8e8f0;
  --muted: #888899;
}
```

**Never hardcode colours** outside of `:root`. Always use CSS variables.

Topic card accent colours (`.c1` through `.c8`) are the only exception — they are intentionally hardcoded per card.

---

## Page Sections (in order)

1. `#videoModal` — in-page video modal (injected before `<nav>`, hidden by default)
2. `<nav>` — fixed top nav with logo, anchor links, and progress badge (`#progressBadge`)
3. `.hero` — full-viewport hero with 2 CTAs and meta stats
4. `.topics-section` (`#topics`) — 8 topic cards in a CSS Grid
5. `.deep-section` (`#deep`) — long-form written content for all topics
6. `.yt-section` (`#videos`) — filter bar + 17-card YouTube grid
7. `.roadmap` (`#roadmap`) — 5-week learning roadmap (click-to-complete)
8. `.faq-section` (`#faq`) — collapsible FAQ section
9. `<footer>` — logo, links, tagline

---

## Topic Cards — Current State

Each `.topic-card` either opens the in-page video modal (c1–c7) or links to external docs (c8). Cards have:
- `data-video-id` — YouTube video ID (c1–c7 only; triggers the modal on click)
- `data-start` — optional timestamp in seconds (e.g. c6 starts at 65s)
- A `.progress-check` label for the localStorage progress tracker
- An `.explored` class added by JS when the checkbox is ticked

| Class | Topic | Video ID / Link |
|-------|-------|------|
| `.c1` | Prompt Harness Engineering | `nWzXyjXCoCE` |
| `.c2` | AI Agents | `S_oN3vlzpMw` |
| `.c3` | CLAUDE.md Files | `h7QJL2_gEXA` |
| `.c4` | Planning & Task Management | `E6seSBly2Ok` |
| `.c5` | Agent Teams & Orchestration | `-zzbkh9B-5Q` |
| `.c6` | Context Window Management | `I1EGbrH5Xdk` (start=65) |
| `.c7` | Token Savings | `49V-5Ock8LU` |
| `.c8` | Claude API | `https://docs.claude.com/en/api/getting-started` (no modal) |

---

## YouTube Video Grid — Current State (17 cards)

Cards are grouped by topic inside `.yt-grid`. Each `.yt-card` has:
- `data-video-id` — triggers the in-page modal on click (16 YouTube cards; Udemy card has none)
- `data-start` — timestamp in seconds where applicable
- `data-category` — used by the filter bar JS (space-separated: e.g. `"agents claudemd"`)
- `<img src="https://img.youtube.com/vi/{ID}/hqdefault.jpg">` thumbnail inside `.yt-thumb`

Filter categories: `beginner` · `prompts` · `agents` · `claudemd` · `planning` · `context` · `tokens`

Order:

1. Start Here — `jw0pMr54Ztc` · `beginner`
2. Prompt Harness Engineering — `nWzXyjXCoCE` · `prompts`
3. AI Agents × 5 — `S_oN3vlzpMw`, `EH5jx5qPabU`, `XASPkhYLtnk` · `agents`; `gHB4JFG9i3k` (start=88) · `agents claudemd`; `tDGiWn0flK8` · `agents planning`
4. CLAUDE.md Files × 1 — `h7QJL2_gEXA` · `claudemd`
5. Planning & Task Management × 2 — `E6seSBly2Ok`, `UYzCXC2hh0I` · `planning`
6. Agent Teams & Orchestration × 2 — `-zzbkh9B-5Q`, `-BhfcPseWFQ` · `agents`
7. Context Window Management × 2 — `I1EGbrH5Xdk` (start=65), `lN5tLx2_7HQ` · `context`
8. Token Savings × 2 — `49V-5Ock8LU`, `boilaC1Qo2c` · `tokens`
9. Udemy Course — `https://www.udemy.com/course/ai-prompt-engineering-chatgpt-claude-claude-code/` · `prompts tokens` (no modal, no thumbnail)

---

## Conventions

- **Indentation:** 2 spaces throughout HTML and CSS
- **Class naming:** kebab-case (e.g. `yt-card`, `topic-card`, `card-cta`)
- **IDs:** used for anchor nav targets (`#topics`, `#deep`, `#videos`, `#roadmap`, `#faq`) and JS hooks (`#videoModal`, `#videoIframe`, `#closeModal`, `#modalYtLink`, `#progressBadge`, `#ytFilters`, `#check-0` through `#check-7`)
- **Links:** always include `target="_blank" rel="noopener"` on external links
- **Emoji:** used as decorative icons inside cards and headings — preserve them
- **Comments:** section breaks use `<!-- SECTION NAME -->` format

---

## Interactive Features — JS Functions

All functions are in the `<script>` block at the bottom of `<body>`:

| Function | Purpose |
|---|---|
| `openModal` / `closeModal` | Video modal — opened via event delegation on `a[data-video-id]` |
| `toggleProgress(idx)` | Checks/unchecks a topic card (0–7), saves to `localStorage` key `claudeos_progress` |
| `loadProgress()` | Restores checkbox + `.explored` state on page load |
| `updateBadge(count)` | Updates the `#progressBadge` text; adds `.complete` class at 8/8 |
| `filterVideos(btn, category)` | Shows/hides `.yt-card` elements by `data-category`; toggles `.active` on filter buttons |
| `copyCode(button)` | Copies `.code-block` text from a `.code-wrapper` |
| `copyCallout(button)` | Copies `.callout` text (clones element, removes button node, copies `.innerText`) |

Roadmap items use inline event listeners (added in script block) — clicking a `.roadmap-item` toggles `.completed` and saves to `localStorage` key `roadmap_{step}`.

---

## NEVER

- Do not add external JS libraries or CSS frameworks
- Do not split the file into multiple files unless explicitly asked
- Do not remove `rel="noopener"` from external links
- Do not change CSS variable names in `:root`
- Do not alter the roadmap section links — they are curated and intentional
- Do not add `<form>` elements — use button `onClick` handlers if interactivity is needed
- **Do not stage or commit `My website.html`** — only ever commit `index.html`

---

## Common Tasks

**Add a new YouTube card:**
Copy an existing `.yt-card` block. Set `href`, `data-video-id`, `data-category`, and optionally `data-start`. Replace the `<img src="https://img.youtube.com/vi/{ID}/hqdefault.jpg">` with the correct video ID. Update `yt-topic`, `yt-title`, `yt-desc`, and `yt-badge` text. Add inside `.yt-grid` in the correct topic group.

**Update a topic card link:**
Find `class="topic-card c[N]"` and update only the `href` attribute.

**Add a new topic card:**
Copy an existing `.topic-card`, increment the colour class (`.c9` etc.), add matching CSS rules for `.c9:hover` and `.c9::before`. Add `data-video-id` if it links to YouTube (triggers modal), or omit for external doc links. Add a `.progress-check` label with the next index and a matching `id="check-N"`. Update `toggleProgress(N)` in the label's onclick. Place inside `.topics-grid`.

**Change a colour:**
Update the relevant CSS variable in `:root` — never hardcode elsewhere.

**Add a new section:**
Follow the existing pattern: `section-label` → `section-title` → `section-desc` → content. Add a corresponding `<li><a>` in the `<nav>`.

---

## Deployment

Static file — no build step needed. Deploy via:
- **Netlify Drop** — drag file to [app.netlify.com/drop](https://app.netlify.com/drop)
- **GitHub Pages** — rename to `index.html`, push to repo, enable Pages in Settings
- **Vercel** — `vercel` CLI in project folder
