// Reading the collections: drafts are dropped in production, and every list is newest first.
import { getCollection, type CollectionEntry } from "astro:content";
import type { Pub } from "@dario-loi/polytope/astro/PubList.astro";

type Name = "blog" | "publications" | "projects";

export const visible = (entry: { data: { draft?: boolean } }) => import.meta.env.DEV || !entry.data.draft;

export async function entries<N extends Name>(name: N): Promise<CollectionEntry<N>[]> {
  const all = (await getCollection(name, visible)) as CollectionEntry<N>[];
  return all.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** Previous (newer) and next (older) neighbors of an entry in its list, for the pager. */
export function neighbors<T extends { id: string }>(list: T[], id: string) {
  const i = list.findIndex((e) => e.id === id);
  return { newer: i > 0 ? list[i - 1] : undefined, older: i >= 0 && i < list.length - 1 ? list[i + 1] : undefined };
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** "March 13, 2024": dates are written out, never numeric. */
export const longDate = (d: Date) => `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
export const monthYear = (d: Date) => `${MONTHS[d.getUTCMonth()].slice(0, 3)} ${d.getUTCFullYear()}`;
export const isoDay = (d: Date) => d.toISOString().slice(0, 10);

/** Minutes to read, at 230 words a minute, from the raw Markdown body. */
export function readingTime(body = "") {
  const words = body.replace(/```[\s\S]*?```/g, " ").replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 230));
}

/** A stable 32-bit seed from a string (FNV-1a), so each entry draws its own complex. */
export function seedOf(s: string) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 0x01000193);
  return h >>> 0 || 1;
}

/** Triangle count of the complex Polytope's <Complex> draws for these settings (same
 *  generator and layout as @dario-loi/polytope Complex.astro). */
function triangles(points: number, radius: number, seed: number) {
  let s = seed >>> 0 || 1;
  const rand = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  const cols = Math.ceil(Math.sqrt(points * 1.8)), rows = Math.ceil(points / cols);
  const pts = Array.from({ length: points }, (_, i) => {
    const c = i % cols, r = Math.floor(i / cols);
    return [6 + ((c + 0.15 + rand() * 0.7) / cols) * 88, 5 + ((r + 0.15 + rand() * 0.7) / rows) * 46];
  });
  const R = radius * 100;
  const adj = pts.map(() => new Set<number>());
  for (let i = 0; i < points; i++) for (let j = i + 1; j < points; j++) {
    if (Math.hypot(pts[i][0] - pts[j][0], pts[i][1] - pts[j][1]) <= R) { adj[i].add(j); adj[j].add(i); }
  }
  let t = 0;
  for (let i = 0; i < points; i++) for (const j of adj[i]) if (j > i) for (const k of adj[i]) if (k > j && adj[j].has(k)) t++;
  return t;
}

/** Settings for an entry's card complex: points vary with the seed, and the radius is the
 *  smallest that fills about 0.6 triangles per point, so every card
 *  reads as points, edges, and a few filled faces, never an empty field or a solid one. */
export function cardComplex(seed: number) {
  const points = 24 + (seed % 9);
  for (let r = 0.12; r <= 0.2; r += 0.005) {
    if (triangles(points, r, seed) >= Math.round(points * 0.6)) return { points, radius: Math.round(r * 1000) / 1000 };
  }
  return { points, radius: 0.16 };
}

/** "ICLR 2026, Poster" or "METACOG-26, Top 3 paper": the venue as lists show it. */
export const pubVenue = (d: CollectionEntry<"publications">["data"], full = false) =>
  [full ? (d.venueFull ?? d.venue) : d.venue, d.format, d.award].filter(Boolean).join(", ");

/** A publication as a row of Polytope's PubList, linking to its page. */
export const pubRow = (p: CollectionEntry<"publications">): Pub => ({
  year: p.data.date.getUTCFullYear(),
  title: p.data.title,
  href: `/publications/${p.id}/`,
  authors: p.data.authors,
  venue: pubVenue(p.data),
  // The PDF link is left out when OpenReview or arXiv already leads to the paper.
  links: p.data.links
    .filter((l) => l.label !== "PDF" || !p.data.links.some((o) => /openreview|arxiv/i.test(o.label)))
    .map(({ label, href }) => ({ label, href })),
});
