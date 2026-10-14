// RSS feed of projects, newest first.
import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import { entries } from "../../lib/content";
import { person } from "../../site";

export const GET: APIRoute = async ({ site }) => {
  const projects = (await entries("projects")).filter((p) => !p.data.draft);
  return rss({
    title: `${person.name}: projects`,
    description: `Software and research projects by ${person.name}.`,
    site: site!,
    items: projects.map((p) => ({
      title: p.data.title,
      description: p.data.context ? `${p.data.description} ${p.data.context}.` : p.data.description,
      pubDate: p.data.date,
      link: `/projects/${p.id}/`,
      categories: p.data.tags,
    })),
    customData: "<language>en-us</language>",
  });
};
