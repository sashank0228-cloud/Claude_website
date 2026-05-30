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


##### new agent changes for claude
# AETHER — Add-on Functionalities Reference

A drop-in guide to every animated feature and the **Aero talking help-agent** built into `index.html`.
Each section is self-contained: copy the **HTML**, **CSS**, and **JS** into your own project.

---

## 0. Shared dependencies (set these up first)

Everything below assumes these are present.

### Fonts (in `<head>`)
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
```

### CSS variables (put on `:root`)
Every feature reads these. Re-map them to your brand if you like.
```css
:root {
  --bg: #0a0a0f;
  --bg-soft: #0f0f17;
  --accent:  #6c63ff;   /* purple */
  --accent2: #ff6b9d;   /* pink   */
  --accent3: #00d4aa;   /* teal   */
  --ink: #ecedf6;
  --ink-dim: #9a9bb3;
  --ink-faint: #5a5b73;
  --line: rgba(255,255,255,0.08);
  --font-display: 'Space Grotesk', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;
}
```

### Reduced-motion (recommended)
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: .001ms !important; animation-iteration-count: 1 !important; }
}
```

---

## 1. Floating brand-mark layer (drift + rotate)

A fixed background of rounded-square "C-mark" logos slowly drifting and rotating at random sizes/opacities.

**HTML** — one empty layer:
```html
<div id="marks" aria-hidden="true"></div>
```

**CSS:**
```css
#marks { position: fixed; inset: 0; z-index: 0; pointer-events: none; overflow: hidden; }
.mark { position: absolute; will-change: transform; animation: drift var(--dur, 40s) ease-in-out infinite alternate; }
.mark svg { display: block; width: 100%; height: 100%; }
@keyframes drift {
  from { transform: translate(0,0) rotate(0deg); }
  to   { transform: translate(var(--dx,40px), var(--dy,-60px)) rotate(var(--rot,90deg)); }
}
```

**JS** — generates the marks (each gets a unique SVG mask id so the C-cutout renders):
```js
(function(){
  const layer = document.getElementById('marks');
  const colors = ['#6c63ff','#00d4aa','#6c63ff','#00d4aa','#7c75ff'];
  const N = 14; let html = '';
  for (let i=0;i<N;i++){
    const size = 26 + Math.random()*120;
    const x = Math.random()*100, y = Math.random()*100;
    const c = colors[i % colors.length];
    const op = 0.05 + Math.random()*0.16;
    const dur = 30 + Math.random()*40;
    const dx = (Math.random()*120-60).toFixed(0);
    const dy = (Math.random()*120-60).toFixed(0);
    const rot = (Math.random()*180-90).toFixed(0);
    const delay = -(Math.random()*40).toFixed(1);
    const mid = 'm'+i;
    html += `<div class="mark" style="width:${size}px;height:${size}px;left:${x}%;top:${y}%;color:${c};opacity:${op};--dur:${dur}s;--dx:${dx}px;--dy:${dy}px;--rot:${rot}deg;animation-delay:${delay}s">
      <svg viewBox="0 0 100 100"><defs><mask id="${mid}"><rect width="100" height="100" rx="28" fill="#fff"/><path d="M68 30 A24 24 0 1 0 68 70" fill="none" stroke="#000" stroke-width="13" stroke-linecap="round"/></mask></defs><rect width="100" height="100" rx="28" fill="currentColor" mask="url(#${mid})"/></svg>
    </div>`;
  }
  layer.innerHTML = html;
})();
```

---

## 2. Hero gradient mesh (4 drifting glow blobs)

Soft blurred color blobs that float like light through fog. Put inside a `position: relative` hero.

**HTML:**
```html
<div class="mesh">
  <div class="blob b1"></div>
  <div class="blob b2"></div>
  <div class="blob b3"></div>
  <div class="blob b4"></div>
</div>
```

**CSS:**
```css
.mesh { position: absolute; inset: -20% -10%; z-index: -2; filter: blur(70px); opacity: 0.9; }
.blob { position: absolute; border-radius: 50%; mix-blend-mode: screen; will-change: transform; }
.blob.b1 { width: 46vw; height: 46vw; background: radial-gradient(circle, rgba(108,99,255,0.85), transparent 65%); top: -6%; left: 4%; animation: float1 22s ease-in-out infinite; }
.blob.b2 { width: 40vw; height: 40vw; background: radial-gradient(circle, rgba(0,212,170,0.7), transparent 65%); top: 12%; right: 2%; animation: float2 26s ease-in-out infinite; }
.blob.b3 { width: 38vw; height: 38vw; background: radial-gradient(circle, rgba(255,107,157,0.7), transparent 65%); bottom: -8%; left: 22%; animation: float3 30s ease-in-out infinite; }
.blob.b4 { width: 30vw; height: 30vw; background: radial-gradient(circle, rgba(108,99,255,0.6), transparent 65%); bottom: 4%; right: 24%; animation: float1 28s ease-in-out infinite reverse; }
@keyframes float1 { 0%,100%{ transform: translate(0,0) scale(1);} 33%{ transform: translate(8vw,6vh) scale(1.12);} 66%{ transform: translate(-5vw,9vh) scale(.92);} }
@keyframes float2 { 0%,100%{ transform: translate(0,0) scale(1);} 50%{ transform: translate(-9vw,7vh) scale(1.15);} }
@keyframes float3 { 0%,100%{ transform: translate(0,0) scale(1);} 40%{ transform: translate(6vw,-7vh) scale(.9);} 75%{ transform: translate(-7vw,-3vh) scale(1.1);} }
```
> No JS. The hero needs `position: relative; overflow: hidden; isolation: isolate;`.

---

## 3. Rising emojis (low-opacity float-up)

**HTML:**
```html
<div id="emojis" aria-hidden="true"></div>
```

**CSS:**
```css
#emojis { position: absolute; inset: 0; z-index: -1; pointer-events: none; overflow: hidden; }
.em { position: absolute; bottom: -60px; font-size: 34px; opacity: 0; will-change: transform, opacity; animation: rise linear infinite; filter: saturate(0.85); }
@keyframes rise {
  0% { transform: translateY(0) rotate(0deg); opacity: 0; }
  12% { opacity: var(--peak, 0.22); }
  88% { opacity: var(--peak, 0.22); }
  100% { transform: translateY(-112vh) rotate(var(--spin,40deg)); opacity: 0; }
}
```

**JS:**
```js
(function(){
  const layer = document.getElementById('emojis');
  const set = ['🎯','🤖','📄','🗺️','🏗️','🧠','💰','🔌'];
  const N = 22; let html = '';
  for (let i=0;i<N;i++){
    const e = set[i % set.length];
    const x = Math.random()*100;
    const size = 22 + Math.random()*30;
    const dur = 14 + Math.random()*16;
    const delay = -(Math.random()*dur).toFixed(1);
    const peak = (0.12 + Math.random()*0.16).toFixed(2);
    const spin = (Math.random()*80-40).toFixed(0);
    html += `<span class="em" style="left:${x}%;font-size:${size}px;animation-duration:${dur}s;animation-delay:${delay}s;--peak:${peak};--spin:${spin}deg">${e}</span>`;
  }
  layer.innerHTML = html;
})();
```

---

## 4. Dot-grid + auto-roaming spotlight

A masked dot pattern with a soft colored spotlight that wanders on a loop. Place both inside a `position: relative; overflow: hidden;` section.

**HTML:**
```html
<div class="dotgrid"></div>
<div class="spotlight"></div>
```

**CSS:**
```css
.dotgrid {
  position: absolute; inset: 0; z-index: 0; pointer-events: none;
  background-image: radial-gradient(circle, rgba(255,255,255,0.10) 1.2px, transparent 1.2px);
  background-size: 30px 30px;
  -webkit-mask-image: radial-gradient(ellipse 80% 90% at 50% 40%, #000 30%, transparent 80%);
  mask-image: radial-gradient(ellipse 80% 90% at 50% 40%, #000 30%, transparent 80%);
}
.spotlight {
  position: absolute; width: 700px; height: 700px; z-index: 0; pointer-events: none;
  background: radial-gradient(circle, rgba(108,99,255,0.22), rgba(0,212,170,0.06) 40%, transparent 65%);
  border-radius: 50%; filter: blur(20px);
  transform: translate(-50%,-50%); left: 30%; top: 40%;
  animation: spotMove 26s ease-in-out infinite;
}
@keyframes spotMove {
  0%,100% { left: 18%; top: 30%; } 25% { left: 70%; top: 20%; }
  50% { left: 80%; top: 70%; } 75% { left: 30%; top: 75%; }
}
```
> Keep your real content at `z-index: 2` so it sits above these.

---

## 5. Neural-network SVG with traveling pulses

A multi-layer node graph; signal dots animate along the edges (SMIL `animateMotion`), node rings pulse.

**HTML:**
```html
<div class="neural-svg-wrap" id="neuralSvgWrap"></div>
```

**CSS:**
```css
.neural-svg-wrap { position: relative; border: 1px solid var(--line); border-radius: 20px; background: radial-gradient(ellipse at 60% 40%, rgba(108,99,255,0.07), transparent 70%); padding: 14px; overflow: hidden; }
.neural-svg-wrap svg { width: 100%; height: auto; display: block; }
.node-core { fill: var(--bg-soft); stroke-width: 2; }
.node-ring { fill: none; opacity: 0.5; }
.edge { stroke: rgba(255,255,255,0.10); stroke-width: 1; }
.pulse { fill: var(--accent3); }
```

**JS:**
```js
(function(){
  const W=560, H=420;
  const layers = [
    {x:90,  n:3, col:'var(--accent)'},
    {x:240, n:5, col:'var(--accent3)'},
    {x:390, n:5, col:'var(--accent3)'},
    {x:500, n:2, col:'var(--accent2)'},
  ];
  const nodes = [];
  layers.forEach((L)=>{ const gap = H/(L.n+1); L.pos = [];
    for(let i=0;i<L.n;i++){ const p = {x:L.x, y:gap*(i+1), col:L.col}; L.pos.push(p); nodes.push(p); } });
  const edges = [];
  for(let li=0; li<layers.length-1; li++){
    layers[li].pos.forEach(a=>{ layers[li+1].pos.forEach(b=>{ edges.push({a,b}); }); }); }
  let svg = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet"><g>`;
  edges.forEach((e,i)=>{ svg += `<path id="edge${i}" class="edge" d="M${e.a.x} ${e.a.y} L${e.b.x} ${e.b.y}"/>`; });
  svg += `</g>`;
  edges.filter((_,i)=> i % 3 === 0).forEach((e)=>{
    const dur = (1.4 + Math.random()*1.6).toFixed(2);
    const begin = (Math.random()*3).toFixed(2);
    svg += `<circle class="pulse" r="3"><animateMotion dur="${dur}s" begin="${begin}s" repeatCount="indefinite" path="M${e.a.x} ${e.a.y} L${e.b.x} ${e.b.y}"/><animate attributeName="opacity" values="0;1;1;0" dur="${dur}s" begin="${begin}s" repeatCount="indefinite"/></circle>`;
  });
  nodes.forEach((n)=>{ const r = 9; const dur = (2 + Math.random()*2).toFixed(2);
    svg += `<circle class="node-ring" cx="${n.x}" cy="${n.y}" r="${r+6}" stroke="${n.col}"><animate attributeName="r" values="${r+4};${r+12};${r+4}" dur="${dur}s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.5;0.05;0.5" dur="${dur}s" repeatCount="indefinite"/></circle>`;
    svg += `<circle class="node-core" cx="${n.x}" cy="${n.y}" r="${r}" stroke="${n.col}"/>`;
  });
  svg += `</svg>`;
  document.getElementById('neuralSvgWrap').innerHTML = svg;
})();
```

---

## 6. Scroll-linked rocket timeline

A 🚀 rides down a vertical spine as you scroll; the spine fills and each milestone lights up as it's passed.

**HTML:**
```html
<div class="tl" id="tl">
  <div class="tl-spine"><div class="fill" id="tlFill"></div></div>
  <div class="rocket" id="rocket">🚀<div class="flame"></div></div>
  <!-- milestones injected by JS, or write them by hand:
  <div class="milestone left"><div class="node"></div><div class="step mono">STAGE 01</div><h4>Title</h4><p>Body</p></div>
  <div class="milestone right">…</div> -->
</div>
```

**CSS:**
```css
#journey { position: relative; }
.tl { position: relative; max-width: 760px; margin: 70px auto 0; }
.tl-spine { position: absolute; left: 50%; top: 0; bottom: 0; width: 2px; transform: translateX(-50%); background: var(--line); }
.tl-spine .fill { position: absolute; left: 0; top: 0; width: 100%; height: 0; background: linear-gradient(var(--accent), var(--accent3)); box-shadow: 0 0 14px var(--accent); }
.rocket { position: absolute; left: 50%; top: 0; transform: translate(-50%, -50%); font-size: 34px; z-index: 5; filter: drop-shadow(0 0 14px rgba(255,107,157,0.6)); transition: top .12s linear; }
.rocket .flame { position: absolute; left: 50%; top: -18px; transform: translateX(-50%); width: 10px; height: 28px; border-radius: 50%; background: linear-gradient(var(--accent2), transparent); filter: blur(3px); opacity: 0; animation: flame .3s infinite; }
@keyframes flame { 0%,100%{ transform: translateX(-50%) scaleY(0.7); opacity:.5;} 50%{ transform: translateX(-50%) scaleY(1.2); opacity:.9;} }
.milestone { position: relative; width: 50%; padding: 26px 40px; box-sizing: border-box; }
.milestone.left { left: 0; text-align: right; }
.milestone.right { left: 50%; text-align: left; }
.milestone .node { position: absolute; top: 32px; width: 16px; height: 16px; border-radius: 50%; background: var(--bg); border: 2px solid var(--ink-faint); z-index: 3; transition: border-color .3s, box-shadow .3s, background .3s; }
.milestone.left .node { right: -9px; } .milestone.right .node { left: -9px; }
.milestone.active .node { border-color: var(--accent3); background: var(--accent3); box-shadow: 0 0 18px var(--accent3); }
.milestone .step { font-family: var(--font-mono); font-size: 12px; color: var(--accent2); letter-spacing: .1em; margin-bottom: 8px; }
.milestone h4 { font-size: 21px; font-weight: 600; margin-bottom: 8px; }
.milestone p { font-size: 14px; color: var(--ink-dim); line-height: 1.55; }
```

**JS** (the scroll math that moves the rocket + fills the spine + activates nodes):
```js
(function(){
  const rocket = document.getElementById('rocket');
  const tlFill = document.getElementById('tlFill');
  const tl = document.getElementById('tl');
  if(!tl) return;
  function onScroll(){
    const rect = tl.getBoundingClientRect();
    const vh = window.innerHeight, start = vh*0.7, end = vh*0.4;
    let prog = Math.max(0, Math.min(1, (start - rect.top) / Math.max(1, rect.height + start - end)));
    const y = prog * rect.height;
    rocket.style.top = y + 'px';
    tlFill.style.height = y + 'px';
    tl.querySelectorAll('.milestone').forEach(m=>{
      const node = m.querySelector('.node');
      const ny = node.getBoundingClientRect().top - rect.top + 8;
      m.classList.toggle('active', y >= ny - 4);
    });
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  window.addEventListener('resize', onScroll);
  onScroll();
})();
```

---

## 7. Scroll-reveal + sticky nav

**CSS:**
```css
.reveal { opacity: 0; transform: translateY(34px); transition: opacity .8s cubic-bezier(.2,.7,.2,1), transform .8s cubic-bezier(.2,.7,.2,1); }
.reveal.in { opacity: 1; transform: none; }
nav.scrolled { /* your "scrolled past top" styles */ }
```

**JS:**
```js
const io = new IntersectionObserver((es)=>{
  es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
}, {threshold: 0.18});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

const nav = document.getElementById('nav');
window.addEventListener('scroll', ()=> nav && nav.classList.toggle('scrolled', window.scrollY > 30), {passive:true});
```
> Add `class="reveal"` to any block you want to fade-up on entry.

---

# ★ 8. Aero — the running / jumping mascot

A character built from a rounded-square brand body with googly eyes. It runs in place, runs in from offscreen on load, and **hops with squash-and-stretch + a dust puff** whenever you scroll into a new section, popping a speech bubble.

### HTML
```html
<div id="mascot" aria-hidden="true" title="Chat with Aero 💬">
  <div class="m-bubble" id="mBubble">go!</div>
  <div class="m-speed"><span></span><span></span><span></span></div>
  <div class="m-stack">
    <div class="arm a1"></div>
    <div class="arm a2"></div>
    <div class="leg l1"></div>
    <div class="leg l2"></div>
    <div class="m-body">
      <svg viewBox="0 0 100 100"><defs>
        <linearGradient id="mascotg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7c75ff"/><stop offset="1" stop-color="#6c63ff"/></linearGradient>
      </defs><rect width="100" height="100" rx="30" fill="url(#mascotg)"/></svg>
      <span class="m-eye e1"></span>
      <span class="m-eye e2"></span>
      <span class="m-mouth"></span>
    </div>
  </div>
  <div class="m-dust"></div>
  <div class="m-shadow"></div>
</div>
```

### CSS
```css
#mascot { position: fixed; left: 30px; bottom: 26px; width: 64px; height: 92px; z-index: 90; cursor: pointer; opacity: 0; transform: translateX(-160px); }
#mascot.ready { animation: runIn 1.1s cubic-bezier(.2,.7,.25,1) forwards; }
@keyframes runIn { from { opacity:0; transform: translateX(-160px);} to { opacity:1; transform: translateX(0);} }

.m-shadow { position: absolute; left: 50%; bottom: 0; transform: translateX(-50%); width: 50px; height: 11px; border-radius: 50%; background: radial-gradient(circle, rgba(0,0,0,0.55), transparent 70%); filter: blur(1px); animation: shadowPulse .48s infinite; }
@keyframes shadowPulse { 0%,100%{ transform: translateX(-50%) scale(1);} 50%{ transform: translateX(-50%) scale(.82);} }

.m-stack { position: absolute; left: 0; bottom: 9px; width: 64px; height: 80px; transform-origin: bottom center; animation: runBob .48s infinite; }
@keyframes runBob { 0%,100%{ transform: translateY(0);} 50%{ transform: translateY(-5px);} }

.m-body { position: absolute; left: 6px; top: 0; width: 52px; height: 52px; z-index: 3; }
.m-body svg { width: 100%; height: 100%; display: block; filter: drop-shadow(0 6px 14px rgba(108,99,255,0.45)); }
.m-eye { position: absolute; top: 15px; width: 12px; height: 12px; background: #fff; border-radius: 50%; z-index: 4; overflow: hidden; animation: blink 4.2s infinite; }
.m-eye.e1 { left: 16px; } .m-eye.e2 { left: 31px; }
.m-eye::after { content:""; position: absolute; top: 3px; right: 2px; width: 6px; height: 6px; border-radius: 50%; background: #1a1830; }
@keyframes blink { 0%,92%,100%{ transform: scaleY(1);} 96%{ transform: scaleY(0.1);} }
.m-mouth { position: absolute; top: 33px; left: 21px; width: 14px; height: 8px; border: 2px solid #1a1830; border-top: none; border-radius: 0 0 14px 14px; z-index: 4; }

.leg, .arm { position: absolute; background: #4b44c9; border-radius: 5px; z-index: 1; }
.leg { width: 8px; height: 20px; top: 49px; transform-origin: top center; }
.leg.l1 { left: 19px; animation: legSwing .48s infinite; }
.leg.l2 { left: 33px; animation: legSwing .48s infinite; animation-delay: -.24s; }
@keyframes legSwing { 0%{ transform: rotate(34deg);} 50%{ transform: rotate(-34deg);} 100%{ transform: rotate(34deg);} }
.arm { width: 7px; height: 16px; top: 26px; background: #00d4aa; transform-origin: top center; z-index: 2; }
.arm.a1 { left: 8px; animation: armSwing .48s infinite; }
.arm.a2 { left: 47px; animation: armSwing .48s infinite; animation-delay: -.24s; }
@keyframes armSwing { 0%{ transform: rotate(-30deg);} 50%{ transform: rotate(30deg);} 100%{ transform: rotate(-30deg);} }

.m-speed { position: absolute; right: 56px; bottom: 16px; width: 40px; height: 36px; z-index: 0; opacity: .6; }
.m-speed span { position: absolute; right: 0; height: 2px; border-radius: 2px; background: linear-gradient(90deg, transparent, var(--accent3)); animation: zoom .5s linear infinite; }
.m-speed span:nth-child(1){ top: 4px; width: 26px; animation-delay: 0s; }
.m-speed span:nth-child(2){ top: 14px; width: 34px; animation-delay: -.18s; }
.m-speed span:nth-child(3){ top: 24px; width: 20px; animation-delay: -.34s; }
@keyframes zoom { 0%{ transform: translateX(0); opacity: .7;} 100%{ transform: translateX(-30px); opacity: 0;} }

.m-dust { position: absolute; left: 50%; bottom: 2px; transform: translateX(-50%) scale(0); width: 46px; height: 16px; border-radius: 50%; background: radial-gradient(circle, rgba(236,237,246,0.5), transparent 70%); opacity: 0; z-index: 0; }

.m-bubble { position: absolute; left: 50%; top: -16px; transform: translate(-50%, -100%) scale(.7); background: rgba(16,16,26,0.92); border: 1px solid var(--accent); color: var(--ink); font-family: var(--font-mono); font-size: 11px; letter-spacing: .04em; white-space: nowrap; padding: 6px 11px; border-radius: 10px; opacity: 0; pointer-events: none; box-shadow: 0 8px 24px rgba(108,99,255,0.3); transition: opacity .25s, transform .25s; }
.m-bubble::after { content:""; position: absolute; left: 50%; bottom: -5px; transform: translateX(-50%) rotate(45deg); width: 8px; height: 8px; background: rgba(16,16,26,0.92); border-right: 1px solid var(--accent); border-bottom: 1px solid var(--accent); }
#mascot.speak .m-bubble { opacity: 1; transform: translate(-50%, -100%) scale(1); }

/* JUMP */
#mascot.jumping .m-stack { animation: hop .72s cubic-bezier(.3,0,.25,1); }
@keyframes hop {
  0%   { transform: translateY(0) scaleY(1) scaleX(1); }
  12%  { transform: translateY(2px) scaleY(.78) scaleX(1.18); }
  40%  { transform: translateY(-72px) scaleY(1.14) scaleX(.9) rotate(-10deg); }
  62%  { transform: translateY(-74px) scaleY(1.06) scaleX(.96) rotate(8deg); }
  86%  { transform: translateY(2px) scaleY(.76) scaleX(1.2); }
  100% { transform: translateY(0) scaleY(1) scaleX(1); }
}
#mascot.jumping .leg { animation: none; transform: rotate(42deg); }
#mascot.jumping .arm { animation: none; transform: rotate(-46deg); }
#mascot.jumping .m-speed { opacity: 0; }
#mascot.jumping .m-shadow { animation: none; transform: translateX(-50%) scale(.5); opacity: .4; }
#mascot.jumping .m-dust { animation: puff .55s ease-out; }
@keyframes puff { 0%{ transform: translateX(-50%) scale(.2); opacity: .7;} 100%{ transform: translateX(-50%) scale(1.6); opacity: 0;} }

/* IDLE while chatting (used by §9) */
#mascot.chatting .m-stack { animation: idleBob 2.8s ease-in-out infinite; }
#mascot.chatting .leg, #mascot.chatting .arm { animation: none; }
#mascot.chatting .leg { transform: rotate(8deg); }
#mascot.chatting .leg.l2 { transform: rotate(-8deg); }
#mascot.chatting .arm { transform: rotate(2deg); }
#mascot.chatting .m-speed { opacity: 0; }
@keyframes idleBob { 0%,100%{ transform: translateY(0);} 50%{ transform: translateY(-3px);} }
```

> **Note:** the mascot's *click* opens the chat in §9. If you only want the running/jumping toy (no chat), see the standalone JS in this section's last block.

### JS (run-in + section hops). Click handling lives in §9.
```js
const mascot = document.getElementById('mascot');
const bubble = document.getElementById('mBubble');

// run in shortly after load
setTimeout(()=> mascot.classList.add('ready'), 500);

let jumpTimer, speakTimer;
function jump(text){
  mascot.classList.remove('jumping'); void mascot.offsetWidth; // reflow to retrigger
  mascot.classList.add('jumping');
  clearTimeout(jumpTimer);
  jumpTimer = setTimeout(()=> mascot.classList.remove('jumping'), 720);
  if(text){
    bubble.textContent = text;
    mascot.classList.add('speak');
    clearTimeout(speakTimer);
    speakTimer = setTimeout(()=> mascot.classList.remove('speak'), 1600);
  }
}

// hop each time scroll crosses into a new section
const map = [
  {el: document.querySelector('.hero'),    say: 'go! →'},
  {el: document.getElementById('topics'),  say: '8 powers!'},
  {el: document.getElementById('neural'),  say: 'big brain 🧠'},
  {el: document.getElementById('journey'), say: 'to the moon!'},
  {el: document.querySelector('footer'),   say: 'launch! 🚀'},
].filter(s=>s.el);
let current = 0;
window.addEventListener('scroll', ()=>{
  const mid = window.scrollY + window.innerHeight * 0.5;
  let idx = 0;
  map.forEach((s,i)=>{ if(s.el.offsetTop <= mid) idx = i; });
  if(idx !== current){ current = idx; if(mascot.classList.contains('ready')) jump(map[idx].say); }
}, {passive:true});

// OPTIONAL — if you DON'T add the chat (§9), make clicking it hop instead:
// mascot.addEventListener('click', ()=> jump('boing!'));
```

---

# ★ 9. Aero chat help-agent + speaks out loud

Clicking the mascot opens a chat panel. Aero answers questions and **reads every reply aloud** (Web Speech API), animating its mouth + nodding while talking. Includes suggested-question chips, a mute toggle, a typing indicator, and graceful offline fallbacks.

### ⚠️ Important integration notes
1. **The AI call.** This build uses `window.claude.complete(prompt)` — that helper **only exists inside the Claude artifact runtime**. In your own project it will not be defined, so the code automatically falls back to built-in canned answers. To get real AI in your project, replace the marked line with a call to **your own backend** (see "Wiring your own AI" below).
2. **Voice** uses the standard browser `window.speechSynthesis` — works in any modern browser, no key needed. It must be triggered by a user gesture (opening the chat by click counts).
3. **Persona** lives in the `KB` string — edit it to describe *your* product.

### HTML (place right after the `#mascot` element)
```html
<div class="chat" id="chat" aria-live="polite">
  <div class="chat-head">
    <div class="chat-ava">
      <svg viewBox="0 0 100 100"><defs><linearGradient id="avag" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7c75ff"/><stop offset="1" stop-color="#6c63ff"/></linearGradient></defs><rect width="100" height="100" rx="30" fill="url(#avag)"/><circle cx="38" cy="44" r="9" fill="#fff"/><circle cx="64" cy="44" r="9" fill="#fff"/><circle cx="40" cy="46" r="4" fill="#1a1830"/><circle cx="66" cy="46" r="4" fill="#1a1830"/><path d="M40 66 Q50 74 60 66" fill="none" stroke="#1a1830" stroke-width="4" stroke-linecap="round"/></svg>
      <span class="blip"></span>
    </div>
    <div class="chat-id"><div class="nm">Aero</div><div class="st mono">AETHER · help agent</div></div>
    <button class="chat-btn" id="muteBtn" title="Mute voice" aria-label="Mute voice">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" stroke="none"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/></svg>
    </button>
    <button class="chat-btn" id="chatClose" title="Close" aria-label="Close chat">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
    </button>
  </div>
  <div class="chat-body" id="chatBody"></div>
  <div class="chat-chips" id="chatChips"></div>
  <form class="chat-input" id="chatForm">
    <input id="chatInput" type="text" placeholder="Ask Aero anything…" autocomplete="off" />
    <button class="chat-send" type="submit" aria-label="Send">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
    </button>
  </form>
</div>
```

### CSS
```css
/* talking face (works with the mascot in §8) */
#mascot.chatting.talking .m-stack { animation: talkNod .42s ease-in-out infinite; }
@keyframes talkNod { 0%,100%{ transform: translateY(0) rotate(0);} 25%{ transform: translateY(-2px) rotate(-2deg);} 75%{ transform: translateY(-2px) rotate(2deg);} }
#mascot.talking .m-mouth { animation: talk .26s ease-in-out infinite; }
@keyframes talk {
  0%,100% { height: 5px; width: 14px; left: 21px; border-radius: 0 0 14px 14px; border: 2px solid #1a1830; border-top: none; }
  50% { height: 10px; width: 12px; left: 22px; border-radius: 50%; border: 2px solid #1a1830; }
}

.chat { position: fixed; left: 30px; bottom: 132px; z-index: 95; width: 330px; max-height: 460px; display: flex; flex-direction: column; background: rgba(13,13,22,0.92); backdrop-filter: blur(16px); border: 1px solid var(--line); border-radius: 18px; box-shadow: 0 24px 60px rgba(0,0,0,0.55), 0 0 0 1px rgba(108,99,255,0.12); overflow: hidden; transform-origin: bottom left; transform: scale(.7) translateY(20px); opacity: 0; pointer-events: none; transition: transform .32s cubic-bezier(.2,.8,.2,1), opacity .26s; }
.chat.open { transform: none; opacity: 1; pointer-events: auto; }
.chat-head { display: flex; align-items: center; gap: 11px; padding: 14px 14px 13px; border-bottom: 1px solid var(--line); }
.chat-ava { width: 34px; height: 34px; border-radius: 10px; flex: none; position: relative; }
.chat-ava svg { width: 100%; height: 100%; }
.chat-ava .blip { position: absolute; right: -2px; bottom: -2px; width: 10px; height: 10px; border-radius: 50%; background: var(--accent3); border: 2px solid #0d0d16; box-shadow: 0 0 8px var(--accent3); }
.chat-id { flex: 1; }
.chat-id .nm { font-size: 14.5px; font-weight: 600; }
.chat-id .st { font-family: var(--font-mono); font-size: 10.5px; color: var(--accent3); letter-spacing: .06em; }
.chat-btn { width: 30px; height: 30px; flex: none; display: grid; place-items: center; border-radius: 8px; border: 1px solid var(--line); background: transparent; color: var(--ink-dim); cursor: pointer; transition: color .2s, border-color .2s; }
.chat-btn:hover { color: var(--ink); border-color: var(--accent); }
.chat-btn.muted { color: var(--ink-faint); }
.chat-btn svg { width: 15px; height: 15px; display: block; }
.chat-body { flex: 1; overflow-y: auto; padding: 16px 14px; display: flex; flex-direction: column; gap: 11px; }
.msg { max-width: 84%; font-size: 13.5px; line-height: 1.5; padding: 10px 13px; border-radius: 14px; animation: msgIn .3s cubic-bezier(.2,.8,.2,1); }
@keyframes msgIn { from { opacity: 0; transform: translateY(8px) scale(.96);} to { opacity:1; transform:none;} }
.msg.bot { align-self: flex-start; background: rgba(255,255,255,0.05); border: 1px solid var(--line); border-bottom-left-radius: 5px; color: var(--ink); }
.msg.user { align-self: flex-end; background: linear-gradient(120deg, var(--accent), #8b7dff); color: #fff; border-bottom-right-radius: 5px; }
.msg.typing { display: flex; gap: 4px; align-items: center; }
.msg.typing i { width: 6px; height: 6px; border-radius: 50%; background: var(--ink-dim); animation: dotty 1s infinite; }
.msg.typing i:nth-child(2){ animation-delay: .15s; } .msg.typing i:nth-child(3){ animation-delay: .3s; }
@keyframes dotty { 0%,60%,100%{ transform: translateY(0); opacity:.4;} 30%{ transform: translateY(-4px); opacity:1;} }
.chat-chips { display: flex; flex-wrap: wrap; gap: 7px; padding: 0 14px 12px; }
.chip { font-family: var(--font-mono); font-size: 11px; color: var(--accent3); border: 1px solid rgba(0,212,170,0.3); background: rgba(0,212,170,0.06); padding: 6px 10px; border-radius: 20px; cursor: pointer; transition: background .2s, border-color .2s; }
.chip:hover { background: rgba(0,212,170,0.15); border-color: var(--accent3); }
.chat-input { display: flex; gap: 8px; padding: 12px 14px; border-top: 1px solid var(--line); }
.chat-input input { flex: 1; background: rgba(255,255,255,0.04); border: 1px solid var(--line); border-radius: 10px; padding: 10px 13px; color: var(--ink); font-family: var(--font-display); font-size: 13.5px; outline: none; }
.chat-input input:focus { border-color: var(--accent); }
.chat-send { flex: none; width: 40px; border: none; border-radius: 10px; background: linear-gradient(120deg, var(--accent), #8b7dff); color: #fff; cursor: pointer; display: grid; place-items: center; }
.chat-send svg { width: 16px; height: 16px; }
@media (max-width: 640px){ .chat { left: 12px; right: 12px; width: auto; bottom: 116px; max-height: 60vh; } }
```

### JS (assumes `mascot`, `bubble`, and `jump()` from §8 are in scope)
```js
const chat = document.getElementById('chat');
const chatBody = document.getElementById('chatBody');
const chatChips = document.getElementById('chatChips');
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');
const muteBtn = document.getElementById('muteBtn');
const closeBtn = document.getElementById('chatClose');
let chatOpen = false, muted = false, greeted = false;
const history = [];

// >>> EDIT THIS to describe YOUR product <<<
const KB = `You are Aero, the cheerful mascot and help agent for AETHER — a (fictional) autonomous-intelligence platform.
AETHER turns plain-language objectives into self-directed AI agents that plan, act, reason across thousands of steps, and ship to production with no human in the loop.
Its 8 capabilities: Goal Alignment, Autonomous Agents, Document Intelligence, Strategic Roadmaps, System Architecture, Reasoning Engines, Cost Optimization, and 200+ Integrations.
Style: warm, energetic, concise — 1 to 3 short sentences, plain spoken language, no markdown. An occasional emoji is fine. If asked something off-topic, gently steer back to the product.`;

// offline fallback answers (used when no AI backend is available)
const fallbacks = {
  price:'AETHER is a prototype, so there are no real prices yet — but it routes every token to the cheapest capable model to keep costs low!',
  agent:'Autonomous Agents are self-directed workers — they plan, act, watch what happens, and adapt, all on their own. 🤖',
  think:'I think in a loop: a perception layer feeds my reasoning core, which fires actions — hundreds of times a second! 🧠',
  start:'Easy! Define an objective, compose an agent, ground it in your data, simulate, then deploy. Six stages to the moon. 🚀',
  what:"AETHER turns your goals into self-directed AI agents that plan, reason, and ship to production on their own. ✨",
};
function localReply(q){
  const s = q.toLowerCase();
  for(const k in fallbacks){ if(s.includes(k)) return fallbacks[k]; }
  return "Great question! Ask me about AETHER's powers, how it thinks, or how to get started! 🚀";
}

function scrollChat(){ chatBody.scrollTop = chatBody.scrollHeight; }
function addMsg(role, text){ const d=document.createElement('div'); d.className='msg '+role; d.textContent=text; chatBody.appendChild(d); scrollChat(); return d; }
function showTyping(){ const d=document.createElement('div'); d.className='msg bot typing'; d.innerHTML='<i></i><i></i><i></i>'; chatBody.appendChild(d); scrollChat(); return d; }

/* ---- VOICE (Web Speech API) ---- */
function speak(text){
  if(muted || !('speechSynthesis' in window)) return;
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text.replace(/[🚀🤖🧠💰🔌✨→]/g,''));
    u.rate = 1.06; u.pitch = 1.25; u.volume = 1;
    const vs = speechSynthesis.getVoices();
    const pref = vs.find(v=>/Google US English|Samantha|Jenny|Aria|Zira/i.test(v.name)) || vs.find(v=>v.lang && v.lang.startsWith('en'));
    if(pref) u.voice = pref;
    u.onstart = ()=> mascot.classList.add('talking');
    u.onend   = ()=> mascot.classList.remove('talking');
    u.onerror = ()=> mascot.classList.remove('talking');
    speechSynthesis.speak(u);
  } catch(e){}
}
if('speechSynthesis' in window){ speechSynthesis.onvoiceschanged = ()=> speechSynthesis.getVoices(); }

/* ---- ASK ---- */
async function ask(q){
  addMsg('user', q); history.push('User: ' + q);
  chatChips.style.display = 'none';
  const typing = showTyping();
  let reply;
  try {
    const prompt = KB + '\n\nConversation:\n' + history.slice(-8).join('\n') + '\nAero:';
    // ===== AI CALL — replace this block to use YOUR backend (see notes) =====
    if(window.claude && window.claude.complete){
      reply = (await window.claude.complete(prompt)).trim();
    } else { throw new Error('no-api'); }
    // =======================================================================
    if(!reply) throw new Error('empty');
  } catch(e){
    reply = localReply(q);
  }
  typing.remove();
  addMsg('bot', reply); history.push('Aero: ' + reply);
  speak(reply);
}

const chips = ['What is AETHER?','How does it think?','How do I get started?','What about cost?'];
function renderChips(){
  chatChips.innerHTML = chips.map(c=>`<button class="chip" type="button">${c}</button>`).join('');
  chatChips.style.display = 'flex';
  chatChips.querySelectorAll('.chip').forEach(b=> b.addEventListener('click', ()=> ask(b.textContent)));
}

function openChat(){
  if(chatOpen) return;
  chatOpen = true;
  chat.classList.add('open');
  mascot.classList.add('chatting'); mascot.classList.remove('jumping');
  if(!greeted){
    greeted = true; renderChips();
    setTimeout(()=>{ const hi="Hi, I'm Aero — your AETHER guide! Ask me anything, and I'll say it out loud. 🚀"; addMsg('bot', hi); speak(hi); }, 350);
  }
  setTimeout(()=> chatInput.focus(), 380);
}
function closeChat(){
  chatOpen = false;
  chat.classList.remove('open');
  mascot.classList.remove('chatting','talking');
  if('speechSynthesis' in window) speechSynthesis.cancel();
}

mascot.addEventListener('click', ()=>{ chatOpen ? closeChat() : openChat(); });
closeBtn.addEventListener('click', closeChat);
muteBtn.addEventListener('click', ()=>{
  muted = !muted;
  muteBtn.classList.toggle('muted', muted);
  muteBtn.title = muted ? 'Unmute voice' : 'Mute voice';
  if(muted && 'speechSynthesis' in window){ speechSynthesis.cancel(); mascot.classList.remove('talking'); }
});
chatForm.addEventListener('submit', (e)=>{
  e.preventDefault();
  const q = chatInput.value.trim(); if(!q) return;
  chatInput.value = ''; ask(q);
});
```

### Wiring your own AI
Replace the marked AI-call block with a `fetch` to your server (which holds your API key):
```js
const res = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ prompt })   // or send { messages: [...] }
});
reply = (await res.json()).reply.trim();
```
Everything else (voice, mouth animation, chips, fallbacks) stays the same.

---

## Quick checklist to add Aero to your project
- [ ] Add the **fonts** + **CSS variables** from §0 (or remap the vars to your brand).
- [ ] Paste the **mascot HTML** (§8) and the **chat HTML** (§9) near the end of `<body>`.
- [ ] Paste the **mascot CSS** (§8) and **chat CSS** (§9).
- [ ] Paste the **§8 JS** then the **§9 JS** (one after the other — §9 uses `mascot`/`jump` from §8).
- [ ] Edit the `KB` persona string to describe your product, and the `chips`/`fallbacks`.
- [ ] (Optional) Point the AI call at your own backend.
- [ ] Update the `map` array in §8 with your real section element IDs so the hop bubbles fire.

> Browser support: voice uses `speechSynthesis` (Chrome, Edge, Safari). Pulses use SVG SMIL (all evergreen browsers). Everything degrades gracefully and honors `prefers-reduced-motion`.
