// RSS feed of papers, newest first. Each item carries the venue, the authors, and the abstract,
// and the hosted PDF as its enclosure, so a feed reader can show the paper and fetch it.
import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import { statSync } from "node:fs";
import { join } from "node:path";
import { entries, pubVenue } from "../../lib/content";
import { person } from "../../site";

const html = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const local = (pdf?: string) => (pdf?.startsWith("/") ? join("public", pdf) : undefined);

export const GET: APIRoute = async ({ site }) => {
  const pubs = (await entries("publications")).filter((p) => !p.data.draft);
  return rss({
    title: `${person.name}: publications`,
    description: `Papers by ${person.name}, ${person.lede}`,
    site: site!,
    items: pubs.map((p) => {
      const d = p.data;
      const file = local(d.pdf);
      return {
        title: d.title,
        description: d.tldr ?? d.description ?? d.abstract,
        content: `<p>${html(pubVenue(d, true))}. ${html(d.authors.map((a) => a.name).join(", "))}.</p><p>${html(d.abstract)}</p>`,
        pubDate: d.date,
        link: `/publications/${p.id}/`,
        categories: d.keywords,
        enclosure: file ? { url: new URL(d.pdf!, site).href, length: statSync(file).size, type: "application/pdf" } : undefined,
      };
    }),
    customData: "<language>en-us</language>",
  });
};
