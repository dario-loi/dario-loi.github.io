// RSS feed of projects, newest first.
import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import { newestFirst, projectItems } from "../../lib/feeds";
import { person } from "../../site";

export const GET: APIRoute = async ({ site }) =>
  rss({
    title: `${person.name}: projects`,
    description: `Software and research projects by ${person.name}.`,
    site: site!,
    items: newestFirst(await projectItems()),
    customData: "<language>en-us</language>",
  });
