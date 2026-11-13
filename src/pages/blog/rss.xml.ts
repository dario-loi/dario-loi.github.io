// RSS feed of published posts.
import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import { newestFirst, postItems } from "../../lib/feeds";
import { person } from "../../site";

export const GET: APIRoute = async ({ site }) =>
  rss({
    title: `${person.name}: blog`,
    description: `Writing by ${person.name}, ${person.lede}`,
    site: site!,
    items: newestFirst(await postItems()),
    customData: "<language>en-us</language>",
  });
