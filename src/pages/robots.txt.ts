// robots.txt for the whole host. The Polytope docs are a project site under /polytope/, and
// crawlers read robots.txt only at the host root, so their sitemap is listed here too.
// Search and AI crawlers are named and allowed, so a policy that blocks "unknown bots" elsewhere
// cannot be read as applying here: the papers are meant to be found, cited, and read by search
// engines and by the language-model tools that do literature review. Each group is its own
// record, since a crawler obeys the most specific record that names it.
import type { APIRoute } from "astro";

const crawlers = [
  // OpenAI: training, search, and on-demand fetches.
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  // Anthropic.
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "anthropic-ai",
  // Perplexity.
  "PerplexityBot",
  "Perplexity-User",
  // Google's AI training opt-in and Apple's, which are separate from their search crawlers.
  "Google-Extended",
  "Applebot-Extended",
  "Applebot",
  "Googlebot",
  "Bingbot",
  "DuckDuckBot",
  "DuckAssistBot",
  // Meta, Cohere, and the Common Crawl corpus many models read.
  "meta-externalagent",
  "cohere-ai",
  "CCBot",
];

export const GET: APIRoute = ({ site }) =>
  new Response(
    [
      ...crawlers.flatMap((agent) => [`User-agent: ${agent}`, "Allow: /", ""]),
      "User-agent: *",
      "Allow: /",
      "",
      `Sitemap: ${new URL("/sitemap-index.xml", site).href}`,
      `Sitemap: ${new URL("/polytope/sitemap-index.xml", site).href}`,
      "",
    ].join("\n"),
    { headers: { "Content-Type": "text/plain; charset=utf-8" } },
  );
