import Anthropic from '@anthropic-ai/sdk';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUTPUT = join(ROOT, 'updates.json');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ── Fetch Anthropic news page ──────────────────────────────────────────────
async function fetchNewsPage() {
  const res = await fetch('https://www.anthropic.com/news', {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ClaudeUpdatesBot/1.0; +https://github.com)' }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching news page`);
  return res.text();
}

// ── Extract article URLs from HTML ─────────────────────────────────────────
function parseArticleUrls(html) {
  const seen = new Set();
  const pattern = /href="(\/news\/[a-z0-9][a-z0-9-]+)"/g;
  let m;
  while ((m = pattern.exec(html)) !== null) {
    const url = 'https://www.anthropic.com' + m[1];
    seen.add(url);
  }
  return Array.from(seen).slice(0, 5);
}

// ── Fetch + parse a single article ────────────────────────────────────────
async function fetchArticle(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ClaudeUpdatesBot/1.0)' }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`);
  const html = await res.text();

  const title = (html.match(/<title>([^<]+)<\/title>/) || [])[1]
    ?.replace(/\s*[|\\–—]\s*Anthropic.*$/i, '').trim() || 'Claude Update';

  const desc = (html.match(/<meta[^>]+name="description"[^>]+content="([^"]+)"/i) || [])[1] || '';

  const dateMatch = html.match(/content="(\d{4}-\d{2}-\d{2})/);
  const date = dateMatch ? dateMatch[1] : new Date().toISOString().slice(0, 10);

  // Strip tags for body text
  const body = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 4000);

  return { title, desc, date, url, body };
}

// ── Generate beginner-friendly summary via Claude ─────────────────────────
async function summarise(article) {
  const msg = await client.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 200,
    messages: [{
      role: 'user',
      content: `You write update notifications for a website teaching beginners to use Claude AI.

Title: ${article.title}
Description: ${article.desc}
Content (excerpt): ${article.body.slice(0, 2000)}

Write exactly 2 sentences (max 100 words total):
• Sentence 1: what is new, in plain language
• Sentence 2: why it matters for someone learning Claude

No jargon. No "Anthropic announced...". Return ONLY the 2 sentences, nothing else.`
    }]
  });
  return msg.content[0].text.trim();
}

// ── Infer badge label from title ──────────────────────────────────────────
function inferBadge(title) {
  const t = title.toLowerCase();
  if (/claude\s*(3|4|sonnet|opus|haiku)/i.test(t)) return 'New Model';
  if (/api|sdk/i.test(t))   return 'API Update';
  if (/research|paper/i.test(t)) return 'Research';
  if (/safety|policy/i.test(t))  return 'Policy';
  if (/feature|update|launch/i.test(t)) return 'Feature';
  return 'News';
}

// ── Main ──────────────────────────────────────────────────────────────────
async function main() {
  console.log('🤖 Claude Updates Agent — starting');

  let store = { lastChecked: '', updates: [] };
  try {
    store = JSON.parse(readFileSync(OUTPUT, 'utf8'));
    console.log(`📂 Loaded ${store.updates.length} existing updates`);
  } catch {
    console.log('📂 No existing updates.json — creating fresh');
  }

  const existingUrls = new Set(store.updates.map(u => u.link));

  console.log('📡 Fetching anthropic.com/news …');
  const html = await fetchNewsPage();
  const urls = parseArticleUrls(html);
  console.log(`🔗 Found ${urls.length} article URLs`);

  const fresh = [];

  for (const url of urls) {
    if (existingUrls.has(url)) {
      console.log(`⏭  Already stored: ${url}`);
      continue;
    }

    console.log(`📄 Fetching: ${url}`);
    let article;
    try {
      article = await fetchArticle(url);
    } catch (err) {
      console.warn(`⚠️  Skipping ${url}: ${err.message}`);
      continue;
    }

    console.log(`✍️  Summarising: "${article.title}"`);
    let summary;
    try {
      summary = await summarise(article);
    } catch (err) {
      console.warn(`⚠️  Summary failed: ${err.message}`);
      summary = article.desc || 'New update from Anthropic — click to read more.';
    }

    fresh.push({
      id: url.split('/').pop(),
      date: article.date,
      title: article.title,
      summary,
      badge: inferBadge(article.title),
      link: url
    });

    await new Promise(r => setTimeout(r, 800)); // polite delay
  }

  if (fresh.length === 0) {
    console.log('✅ No new articles — updating lastChecked timestamp');
    store.lastChecked = new Date().toISOString();
    writeFileSync(OUTPUT, JSON.stringify(store, null, 2));
    return;
  }

  store.lastChecked = new Date().toISOString();
  store.updates = [...fresh, ...store.updates].slice(0, 10);

  writeFileSync(OUTPUT, JSON.stringify(store, null, 2));
  console.log(`✅ Wrote ${fresh.length} new update(s) to updates.json`);
  fresh.forEach(u => console.log(`   • ${u.date} — ${u.title}`));
}

main().catch(err => { console.error('❌ Agent error:', err); process.exit(1); });
