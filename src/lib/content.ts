// Reading the collections: drafts are dropped in production, and every list is newest first.
import { getCollection, type CollectionEntry } from "astro:content";
import { getImage } from "astro:assets";
import type { ImageMetadata, ImageOutputFormat } from "astro";
import type { Pub } from "@dario-loi/polytope/astro/PubList.astro";

type Name = "blog" | "publications" | "projects";

export const visible = (entry: { data: { draft?: boolean } }) => import.meta.env.DEV || !entry.data.draft;

export async function entries<N extends Name>(name: N): Promise<CollectionEntry<N>[]> {
  const all = (await getCollection(name, visible)) as CollectionEntry<N>[];
  return all.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** Formats for every <Picture> on the site: AVIF where the browser takes it, else WebP. */
export const pictureFormats: { formats: ImageOutputFormat[]; fallbackFormat: ImageOutputFormat } = { formats: ["avif", "webp"], fallbackFormat: "webp" };

/** Settings for a <Cover> in a Polytope Card's "figure" slot. A lead card's panel takes about
 *  half the row, and it is the first thing on its list page, so its cover loads first. */
export const cardPicture = (lead = false) => ({
  widths: [480, 800, 1200],
  sizes: lead ? "(min-width: 64rem) 50vw, 100vw" : "(min-width: 64rem) 30vw, 100vw",
  ...(lead ? { loading: "eager" as const, fetchpriority: "high" as const } : {}),
});

/** An entry's own link-preview picture, as a JPEG at most 1200px wide (previews do not all
 *  read WebP). Without one the page keeps the site card. */
export async function preview(src?: ImageMetadata, alt?: string) {
  if (!src) return {};
  const img = await getImage({ src, format: "jpeg", width: Math.min(1200, src.width) });
  return { image: { src: img.src, width: Number(img.attributes.width), height: Number(img.attributes.height) }, imageAlt: alt };
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

/** "ICLR 2026, Poster" or "METACOG-26, Top 3 paper": the venue as lists show it. `full` is the
 *  paper page's line: the full name keeps the short one that lists and citations use, as in
 *  "The Fourteenth International Conference on Learning Representations (ICLR 2026), Poster",
 *  and a preprint gives its month, as in "Preprint, August 2026". */
export function pubVenue(d: CollectionEntry<"publications">["data"], full = false) {
  let venue = d.venue;
  if (full && d.venueFull) venue = d.venueFull.includes(d.venue) ? d.venueFull : `${d.venueFull} (${d.venue})`;
  else if (full && d.kind === "preprint") venue = `${d.venue}, ${MONTHS[d.date.getUTCMonth()]} ${d.date.getUTCFullYear()}`;
  return [venue, d.format, d.award].filter(Boolean).join(", ");
}

/** A publication as a row of Polytope's PubList, linking to its page. */
export const pubRow = (p: CollectionEntry<"publications">): Pub => ({
  year: p.data.date.getUTCFullYear(),
  title: p.data.title,
  href: `/publications/${p.id}/`,
  authors: p.data.authors.map((a) => a.name),
  venue: pubVenue(p.data),
  // The PDF link is left out when OpenReview or arXiv already leads to the paper.
  links: p.data.links
    .filter((l) => l.label !== "PDF" || !p.data.links.some((o) => /openreview|arxiv/i.test(o.label)))
    .map(({ label, href }) => ({ label, href })),
});
