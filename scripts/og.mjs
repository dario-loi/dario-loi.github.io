// Share cards (Open Graph and Twitter images), one 1200x630 file per indexable page.
//
//   npm run og            render every card into public/og/ and write src/data/og.json
//
// - Pages with no picture of their own (CV, lists, topics, privacy) get a title card: an Ultra
//   headline with the tomato full stop beside a Vietoris-Rips complex seeded from the page path,
//   the same drawing and generator as the home card (public/og.png, scripts/og-square.html).
// - Papers and projects keep their real cover. A cover at least 1200px wide is cropped to
//   1200x630 around a focal point; a smaller one is never stretched: it is composed at native
//   size beside the title instead.
// - An entry with no cover gets a title card too. Drafts get nothing (their files would ship).
//
// Cards render with headless Chromium (as scripts/og-square.html does) from HTML templates that
// load the site's real fonts from node_modules/@dario-loi/polytope. Base.astro reads
// src/data/og.json, so a page with a card points og:image and twitter:image at it.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import sharp from "sharp";
import YAML from "yaml";

const root = resolve(import.meta.dirname, "..");
const outDir = join(root, "public", "og");
const fonts = join(root, "node_modules/@dario-loi/polytope/dist/fonts");
const chromium = process.env.CHROMIUM || "chromium";
const W = 1200, H = 630;
const only = process.argv.slice(2); // optional filter: card keys to render

// ---- helpers -----------------------------------------------------------------------------

/** The page's card file name: its path with slashes made hyphens. */
const keyOf = (path) => path.replace(/^\/|\/$/g, "").replace(/\//g, "-");

/** The same FNV-1a seed src/lib/content.ts gives an entry, so a card and its page agree. */
function seedOf(s) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 0x01000193);
  return h >>> 0 || 1;
}

/** Polytope's Complex, as src/components/CoverComplex.astro draws it: jittered grid, radius. */
function complexSvg(seed, points = 28, radius = 0.17) {
  let s = seed >>> 0 || 1;
  const rand = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  const cols = Math.ceil(Math.sqrt(points * 1.8)), rows = Math.ceil(points / cols);
  const pts = Array.from({ length: points }, (_, i) => {
    const c = i % cols, r = Math.floor(i / cols);
    return [6 + ((c + 0.15 + rand() * 0.7) / cols) * 88, 5 + ((r + 0.15 + rand() * 0.7) / rows) * 46];
  });
  const R = radius * 100;
  const adj = pts.map(() => new Set());
  const edges = [];
  for (let i = 0; i < points; i++) for (let j = i + 1; j < points; j++) {
    if (Math.hypot(pts[i][0] - pts[j][0], pts[i][1] - pts[j][1]) <= R) { edges.push([i, j]); adj[i].add(j); adj[j].add(i); }
  }
  const tris = [];
  for (const [i, j] of edges) for (const k of adj[i]) if (k > j && adj[j].has(k)) tris.push([i, j, k]);
  return `<svg viewBox="0 0 100 56" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
<g class="tri">${tris.map(([a, b, c]) => `<polygon points="${pts[a]} ${pts[b]} ${pts[c]}"/>`).join("")}</g>
<g class="edge">${edges.map(([a, b]) => `<line x1="${pts[a][0]}" y1="${pts[a][1]}" x2="${pts[b][0]}" y2="${pts[b][1]}"/>`).join("")}</g>
<g class="pt">${pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="0.9"/>`).join("")}</g></svg>`;
}

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const plain = (s) => String(s).replace(/<[^>]+>/g, "");

/** Front matter of a content file. */
function matter(file) {
  const m = readFileSync(file, "utf8").match(/^---\n([\s\S]*?)\n---/);
  return YAML.parse(m[1]);
}

// ---- cards -------------------------------------------------------------------------------

const PAGES = [
  { path: "/cv/", also: ["/cv/pdf/"], title: "Curriculum vitae", sub: "Dario Loi, Ph.D. student in Computer Engineering at Northeastern University", tone: "paper", tri: "mustard" },
  { path: "/publications/", title: "Publications", sub: "Papers by Dario Loi on topological deep learning and sheaf neural networks", tone: "paper", tri: "tomato" },
  { path: "/projects/", title: "Projects", sub: "Software and research code by Dario Loi", tone: "paper", tri: "teal" },
  { path: "/blog/", title: "Blog", sub: "Writing by Dario Loi", tone: "paper", tri: "mustard" },
  { path: "/privacy/", title: "Privacy", sub: "How this site counts visits without cookies", tone: "paper", tri: "teal" },
  { path: "/publications/topics/", title: "Topics", sub: "Publications by Dario Loi, grouped by research topic", tone: "ink", tri: "mustard" },
];

const topicSrc = readFileSync(join(root, "src/data/topics.ts"), "utf8");
const topics = [...topicSrc.matchAll(/^\s*topic\("([^"]+)",/gm)].map((m) => m[1]);
const slug = (n) => n.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const TRI = ["mustard", "tomato", "teal"];
topics.forEach((name, i) => {
  const used = readdirSync(join(root, "src/content/publications")).some((f) => f.endsWith(".mdx") && matter(join(root, "src/content/publications", f)).topics?.includes(name));
  if (used) PAGES.push({ path: `/publications/topics/${slug(name)}/`, title: name, sub: "Publications by Dario Loi", tone: "ink", tri: TRI[i % 3] });
});

/** Crop focus for a cover wider than the card is tall: fraction of the spare height above the crop. */
const FOCUS = { default: 0.5, polytope: 0 };

/** Entries (papers and projects) with a cover or without. */
function entryCards() {
  const cards = [];
  for (const [kind, dir, ext] of [["publications", "publications", ".mdx"], ["projects", "projects", ".md"]]) {
    for (const f of readdirSync(join(root, "src/content", dir)).filter((n) => n.endsWith(ext))) {
      const d = matter(join(root, "src/content", dir, f));
      if (d.draft) continue;
      const id = f.slice(0, -ext.length);
      const path = `/${kind}/${id}/`;
      const title = plain(d.shortTitle ?? d.title);
      const sub = kind === "publications" ? d.venue : d.context?.split(",")[0];
      const cover = d.cover ? join(root, "src/content", dir, d.cover) : undefined;
      cards.push({ path, title, sub, cover, alt: d.coverAlt, tone: "paper", tri: TRI[seedOf(path) % 3], id });
    }
  }
  return cards;
}

// ---- HTML templates ----------------------------------------------------------------------

const url = (p) => pathToFileURL(p).href;
const CSS = `
@font-face { font-family: "Ultra"; src: url("${url(join(fonts, "ultra-latin-400.woff2"))}") format("woff2"); }
@font-face { font-family: "Libre Franklin"; font-weight: 100 900; src: url("${url(join(fonts, "libre-franklin-latin-wght.woff2"))}") format("woff2"); }
html, body { margin: 0; }
body { width: ${W}px; height: ${H}px; position: relative; overflow: hidden; background: var(--ground); color: var(--fg); font-family: "Libre Franklin", Arial, sans-serif; }
body.paper { --ground: #FFFFFF; --fg: #141414; --muted: #4A4A47; --panel: #141414; --rule: #141414; }
body.ink { --ground: #161615; --fg: #F2F2EE; --muted: #B9BAB4; --panel: #262624; --rule: #E9A81C; }
.stop { color: #D9412B; }
.rule { position: absolute; left: 0; right: 0; bottom: 0; height: 12px; background: var(--rule); }
.head { position: absolute; margin: 0; font: 400 120px/0.98 "Ultra", Georgia, serif; letter-spacing: -0.01em; overflow-wrap: normal; text-wrap: balance; }
.sub { position: absolute; margin: 0; font-weight: 400; font-size: 30px; line-height: 1.32; color: var(--fg); }
.dom { position: absolute; margin: 0; left: 64px; bottom: 56px; font-weight: 600; font-size: 24px; color: var(--muted); }
.panel { position: absolute; background: var(--panel); display: grid; place-items: center; }
.panel svg { width: 100%; height: 100%; }
.tri polygon { fill: var(--tri); fill-opacity: 0.55; }
.edge line { stroke: #F6F7F6; stroke-opacity: 0.7; stroke-width: 0.28; }
.pt circle { fill: #F6F7F6; }
body.mustard { --tri: #E9A81C; } body.tomato { --tri: #F0654F; } body.teal { --tri: #5CC2C7; }
`;

/** Shrinks .head until it fits its box without breaking a word, once the fonts are in. */
const FIT = `
const fit = (el, max, min) => { let s = max; el.style.fontSize = s + "px"; while (s > min && (el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1)) { s -= 2; el.style.fontSize = s + "px"; } };
Promise.all([document.fonts.load('400 100px "Ultra"'), document.fonts.load('400 30px "Libre Franklin"'), document.fonts.load('600 24px "Libre Franklin"')]).then(() => {
  document.querySelectorAll("[data-fit]").forEach((el) => fit(el, +el.dataset.fit, 24));
  document.title = "ready";
});`;

function titleCard(c) {
  // The headline runs the full width at the top, so even "Publications." sets large; the
  // complex panel (as in public/og.png) sits bottom right, the line of context bottom left.
  return `<!doctype html><meta charset="utf-8"><style>${CSS}
.head { left: 64px; top: 52px; width: 1072px; height: 250px; color: var(--fg); }
.sub { left: 64px; bottom: 104px; width: 540px; max-height: 130px; overflow: hidden; }
.panel { left: 700px; top: 336px; width: 436px; height: 244px; }
</style><body class="${c.tone} ${c.tri}">
<h1 class="head" data-fit="150">${esc(c.title)}<span class="stop">.</span></h1>
${c.sub ? `<p class="sub">${esc(c.sub)}</p>` : ""}
<p class="dom">dario-loi.github.io</p>
<div class="panel">${complexSvg(seedOf(c.path))}</div>
<div class="rule"></div>
<script>${FIT}</script></body>`;
}

function composedCard(c, meta) {
  // A cover narrower than the card: never stretched. The headline runs across the top, the
  // cover sits below at its own pixels (or fewer), framed, with the context beside it.
  const maxH = 380, top = 216;
  const ph = Math.min(maxH, meta.height);
  const pw = Math.round((ph * meta.width) / meta.height);
  const colX = 64 + pw + 40;
  return `<!doctype html><meta charset="utf-8"><style>${CSS}
.head { left: 64px; top: 44px; width: 1072px; height: 150px; color: var(--fg); }
.shot { position: absolute; left: 67px; top: ${top}px; width: ${pw - 6}px; height: ${ph - 6}px; outline: 3px solid #141414; background: #141414; }
.shot img { display: block; width: ${pw - 6}px; height: ${ph - 6}px; }
.sub { left: ${colX}px; width: ${1136 - colX}px; bottom: 104px; max-height: 130px; overflow: hidden; }
.dom { left: ${colX}px; bottom: 56px; font-size: 22px; }
</style><body class="paper ${c.tri}">
<h1 class="head" data-fit="110">${esc(c.title)}<span class="stop">.</span></h1>
<div class="shot"><img src="${url(c.cover)}" alt=""></div>
${c.sub ? `<p class="sub">${esc(c.sub)}</p>` : ""}
<p class="dom">dario-loi.github.io</p>
<div class="rule"></div>
<script>${FIT}</script></body>`;
}

// ---- render ------------------------------------------------------------------------------

function shoot(html, tmp, name) {
  const page = join(tmp, `${name}.html`), png = join(tmp, `${name}.png`);
  writeFileSync(page, html);
  execFileSync(chromium, ["--headless=new", "--hide-scrollbars", "--no-sandbox", "--disable-gpu", "--force-device-scale-factor=1", `--window-size=${W},${H}`, "--virtual-time-budget=5000", `--screenshot=${png}`, url(page)], { stdio: "ignore" });
  return png;
}

mkdirSync(outDir, { recursive: true });
const tmp = mkdtempSync(join(tmpdir(), "og-"));
const manifest = {};
const log = [];

async function save(card, buf, ext, alt, aliases = []) {
  let img = sharp(buf);
  const meta = await img.metadata();
  if (meta.width !== W || meta.height !== H) throw new Error(`${card.path}: rendered ${meta.width}x${meta.height}`);
  let out;
  if (ext === "png") out = await sharp(buf).png({ palette: true, quality: 92, effort: 10, colors: 128 }).toBuffer();
  else for (const q of [88, 82, 76, 70]) { out = await sharp(buf).jpeg({ quality: q, mozjpeg: true }).toBuffer(); if (out.length < 300_000) break; }
  const key = keyOf(card.path), file = `${key}.${ext}`;
  writeFileSync(join(outDir, file), out);
  for (const p of [card.path, ...aliases]) manifest[p] = { src: `/og/${file}`, type: ext === "png" ? "image/png" : "image/jpeg", alt };
  log.push(`${card.path.padEnd(48)} ${file.padEnd(52)} ${(out.length / 1024).toFixed(0)} KB`);
}

const wanted = (c) => only.length === 0 || only.includes(keyOf(c.path));

try {
  for (const c of PAGES.filter(wanted)) {
    const buf = readFileSync(shoot(titleCard(c), tmp, keyOf(c.path)));
    await save(c, buf, "png", `${c.title}. ${c.sub}. A card in the style of dario-loi.github.io: the title beside a drawing of a Vietoris-Rips complex.`, c.also);
  }
  for (const c of entryCards().filter(wanted)) {
    if (!c.cover) {
      const buf = readFileSync(shoot(titleCard({ ...c, sub: c.sub ?? "" }), tmp, keyOf(c.path)));
      await save(c, buf, "png", `${c.title}. A card in the style of dario-loi.github.io: the title beside a drawing of a Vietoris-Rips complex.`);
      continue;
    }
    const meta = await sharp(c.cover).metadata();
    if (meta.width >= W) {
      const h = Math.round((meta.height * W) / meta.width);
      const top = Math.round(Math.max(0, h - H) * (FOCUS[c.id] ?? FOCUS.default));
      const buf = await sharp(c.cover).resize({ width: W }).extract({ left: 0, top, width: W, height: H }).png().toBuffer();
      await save(c, buf, "jpg", c.alt ?? c.title);
    } else {
      const buf = readFileSync(shoot(composedCard(c, meta), tmp, keyOf(c.path)));
      await save(c, buf, "jpg", `${c.title}. ${c.alt ?? ""}`.trim());
    }
  }
} finally {
  rmSync(tmp, { recursive: true, force: true });
}

if (only.length === 0) {
  // A full run owns src/data/og.json; a filtered run merges into it.
  const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
  writeFileSync(join(root, "src/data/og.json"), JSON.stringify(sorted, null, 2) + "\n");
} else {
  const f = join(root, "src/data/og.json");
  const prev = existsSync(f) ? JSON.parse(readFileSync(f, "utf8")) : {};
  writeFileSync(f, JSON.stringify({ ...prev, ...manifest }, null, 2) + "\n");
}
console.log(log.join("\n"));
