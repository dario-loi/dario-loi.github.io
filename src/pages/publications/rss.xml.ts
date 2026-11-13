// RSS feed of papers, newest first. Each item carries the venue, the authors, and the abstract,
// and the hosted PDF as its enclosure, so a feed reader can show the paper and fetch it.
import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import { newestFirst, publicationItems } from "../../lib/feeds";
import { person } from "../../site";

export const GET: APIRoute = async ({ site }) =>
  rss({
    title: `${person.name}: publications`,
    description: `Papers by ${person.name}, ${person.lede}`,
    site: site!,
    items: newestFirst(await publicationItems(site!)),
    customData: "<language>en-us</language>",
  });
