// RSS feed of published posts.
import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import { entries } from "../lib/content";
import { person } from "../site";

export const GET: APIRoute = async ({ site }) => {
  const posts = (await entries("blog")).filter((p) => !p.data.draft);
  return rss({
    title: `${person.name}: blog`,
    description: `Writing by ${person.name}, ${person.lede}`,
    site: site!,
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.date,
      link: `/blog/${p.id}/`,
      categories: p.data.tags,
    })),
    customData: "<language>en-us</language>",
  });
};
