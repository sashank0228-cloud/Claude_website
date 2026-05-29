# CLAUDE.md — Project Memory for Claude Zero to Hero

This file is read by Claude at the start of every session. It contains all project context, conventions, and constraints needed to work on this site without re-explanation.

---

## Project Overview

**Name:** Claude: Zero to Hero — The Definitive Beginner's Guide  
**Type:** Static single-page website (pure HTML/CSS)  
**Purpose:** A public learning hub for beginners learning to use Claude AI — covering prompt engineering, agents, CLAUDE.md, planning, orchestration, context management, and token optimisation.  
**Audience:** Absolute beginners through intermediate Claude users.

---

## File Structure

```
/
└── index.html     # Entire site — one self-contained file
└── README.md      # Project documentation
└── CLAUDE.md      # This file
```

The site is intentionally **one file**. Do not split it into separate CSS/JS files unless explicitly asked.

---

## Tech Stack

- Pure HTML5 + CSS3 + vanilla JS (no frameworks, no build tools)
- Google Fonts: `Syne` (headings), `DM Serif Display` (body), `IBM Plex Mono` (mono/labels)
- No external CSS libraries or JS dependencies
- Responsive via CSS Grid + `clamp()` + one `@media (max-width: 640px)` breakpoint

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

Topic card accent colours (`.c1` through `.c7`) are the only exception — they are intentionally hardcoded per card.

---

## Page Sections (in order)

1. `<nav>` — fixed top nav with logo and anchor links
2. `.hero` — full-viewport hero with headline, CTAs, and meta stats
3. `.topics-section` (`#topics`) — 8 topic cards in a CSS Grid
4. `.deep-section` (`#deep`) — long-form written content for all topics
5. `.yt-section` (`#videos`) — YouTube video card grid
6. `.roadmap` (`#roadmap`) — 5-week learning roadmap
7. `.faq-section` (`#faq`) — collapsible FAQ section
8. `<footer>` — logo, links, tagline

---

## Topic Cards — Current State

Each `.topic-card` links to a YouTube video. Current mapping:

| Class | Topic | Link |
|-------|-------|------|
| `.c1` | Prompt Harness Engineering | `https://www.youtube.com/watch?v=nWzXyjXCoCE` |
| `.c2` | AI Agents | `https://www.youtube.com/watch?v=S_oN3vlzpMw` |
| `.c3` | CLAUDE.md Files | `https://www.youtube.com/watch?v=h7QJL2_gEXA` |
| `.c4` | Planning & Task Management | `https://www.youtube.com/watch?v=E6seSBly2Ok` |
| `.c5` | Agent Teams & Orchestration | `https://www.youtube.com/watch?v=-zzbkh9B-5Q` |
| `.c6` | Context Window Management | `https://www.youtube.com/watch?v=I1EGbrH5Xdk&t=65s` |
| `.c7` | Token Savings | `https://www.youtube.com/watch?v=49V-5Ock8LU` |
| `.c8` | Claude API | `https://docs.claude.com/en/api/getting-started` |

---

## YouTube Video Grid — Current State (17 cards)

Cards are grouped by topic inside `.yt-grid`. Order:

1. Start Here (beginner overview) — `jw0pMr54Ztc`
2. Prompt Harness Engineering — `nWzXyjXCoCE`
3. AI Agents × 5 — `S_oN3vlzpMw`, `EH5jx5qPabU`, `gHB4JFG9i3k&t=88s`, `XASPkhYLtnk`, `tDGiWn0flK8`
4. CLAUDE.md Files × 1 — `h7QJL2_gEXA`
5. Planning & Task Management × 2 — `E6seSBly2Ok`, `UYzCXC2hh0I`
6. Agent Teams & Orchestration × 2 — `-zzbkh9B-5Q`, `-BhfcPseWFQ`
7. Context Window Management × 2 — `I1EGbrH5Xdk&t=65s`, `lN5tLx2_7HQ`
8. Token Savings × 2 — `49V-5Ock8LU`, `boilaC1Qo2c`
9. Udemy Course — `https://www.udemy.com/course/ai-prompt-engineering-chatgpt-claude-claude-code/`

---

## Conventions

- **Indentation:** 2 spaces throughout HTML and CSS
- **Class naming:** kebab-case (e.g. `yt-card`, `topic-card`, `card-cta`)
- **IDs:** used only for anchor nav targets (`#topics`, `#deep`, `#videos`, `#roadmap`)
- **Links:** always include `target="_blank" rel="noopener"` on external links
- **Emoji:** used as decorative icons inside cards and headings — preserve them
- **Comments:** section breaks use `<!-- SECTION NAME -->` format

---

## NEVER

- Do not add external JS libraries or CSS frameworks
- Do not split the file into multiple files unless explicitly asked
- Do not remove `rel="noopener"` from external links
- Do not change CSS variable names in `:root`
- Do not alter the roadmap section links — they are curated and intentional
- Do not add `<form>` elements — use button `onClick` handlers if interactivity is needed

---

## Common Tasks

**Add a new YouTube card:**
Copy an existing `.yt-card` block, update `href`, `yt-thumb` gradient colours, emoji, `yt-topic`, `yt-title`, `yt-desc`, and `yt-badge` text. Add it inside `.yt-grid` in the correct topic group.

**Update a topic card link:**
Find `class="topic-card c[N]"` and update only the `href` attribute.

**Add a new topic card:**
Copy an existing `.topic-card`, increment the colour class (`.c8` etc.), add a matching CSS rule for `.c8:hover` and `.c8::before` in the style block, and place it inside `.topics-grid`.

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
