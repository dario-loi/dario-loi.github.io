// robots.txt for the whole host. The Polytope docs are a project site under /polytope/, and
// crawlers read robots.txt only at the host root, so their sitemap is listed here too.
import type { APIRoute } from "astro";

export const GET: APIRoute = ({ site }) =>
  new Response(
    [
      "User-agent: *",
      "Allow: /",
      "",
      `Sitemap: ${new URL("/sitemap-index.xml", site).href}`,
      `Sitemap: ${new URL("/polytope/sitemap-index.xml", site).href}`,
      "",
    ].join("\n"),
    { headers: { "Content-Type": "text/plain; charset=utf-8" } },
  );
