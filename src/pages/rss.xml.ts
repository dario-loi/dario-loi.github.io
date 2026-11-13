// The site-wide RSS feed: papers, projects, and posts together, newest first.
import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import { newestFirst, postItems, projectItems, publicationItems } from "../lib/feeds";
import { person } from "../site";

export const GET: APIRoute = async ({ site }) =>
  rss({
    title: person.name,
    description: `Papers, projects, and writing by ${person.name}, ${person.lede}`,
    site: site!,
    items: newestFirst([...(await publicationItems(site!)), ...(await projectItems()), ...(await postItems())]),
    customData: "<language>en-us</language>",
  });
