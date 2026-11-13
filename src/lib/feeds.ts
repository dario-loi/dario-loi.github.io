// RSS items for each collection, shared by the per-list feeds and the site-wide /rss.xml.
import type { RSSFeedItem } from "@astrojs/rss";
import { statSync } from "node:fs";
import { join } from "node:path";
import { entries, pubVenue } from "./content";
import { emphasis, plain } from "./tex";

const html = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const local = (pdf?: string) => (pdf?.startsWith("/") ? join("public", pdf) : undefined);

/** Papers, with the venue, authors, and abstract, and the hosted PDF as the enclosure. */
export async function publicationItems(site: URL): Promise<RSSFeedItem[]> {
  const pubs = (await entries("publications")).filter((p) => !p.data.draft);
  return pubs.map((p) => {
    const d = p.data;
    const file = local(d.pdf);
    return {
      title: d.title,
      description: plain(d.tldr ?? d.description ?? d.abstract),
      content: `<p>${html(pubVenue(d, true))}. ${html(d.authors.map((a) => a.name).join(", "))}.</p><p>${emphasis(html(d.abstract))}</p>`,
      pubDate: d.date,
      link: `/publications/${p.id}/`,
      categories: d.keywords,
      enclosure: file ? { url: new URL(d.pdf!, site).href, length: statSync(file).size, type: "application/pdf" } : undefined,
    };
  });
}

export async function projectItems(): Promise<RSSFeedItem[]> {
  const projects = (await entries("projects")).filter((p) => !p.data.draft);
  return projects.map((p) => ({
    title: p.data.title,
    description: p.data.context ? `${p.data.description} ${p.data.context}.` : p.data.description,
    pubDate: p.data.date,
    link: `/projects/${p.id}/`,
    categories: p.data.tags,
  }));
}

export async function postItems(): Promise<RSSFeedItem[]> {
  const posts = (await entries("blog")).filter((p) => !p.data.draft);
  return posts.map((p) => ({
    title: p.data.title,
    description: p.data.description,
    pubDate: p.data.date,
    link: `/blog/${p.id}/`,
    categories: p.data.tags,
  }));
}

/** Newest first. */
export const newestFirst = (items: RSSFeedItem[]) =>
  [...items].sort((a, b) => (b.pubDate?.valueOf() ?? 0) - (a.pubDate?.valueOf() ?? 0));
