// Personal site of Dario Loi. Static output for GitHub Pages at the root of dario-loi.github.io.
// The /polytope/ path on the same host belongs to the Polytope docs (a separate project site),
// so no page here may live under it.
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { satteri } from "@astrojs/markdown-satteri";
import { createRequire } from "node:module";
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { entryFiles, isDraft, lastmod } from "./src/lib/lastmod.mjs";
import { plyCodeFrame } from "./src/lib/shiki-ply-code.mjs";
import { plyTables } from "./src/lib/hast-ply-tables.mjs";
import { plyCiteLinks } from "./src/lib/hast-cite-links.mjs";

const requireJson = createRequire(import.meta.url);
const codeTheme = requireJson("@dario-loi/polytope/code-theme.json");

// While every post is a draft the blog index is an empty state, kept out of search and the sitemap.
const hasPosts = entryFiles("src/content/blog/").some((f) => !isDraft(f));
// Pages with nothing to index: the CV's share address only forwards to the PDF.
const unlisted = ["/cv/pdf/"];

// The pictures in each page's content (its <main>), added to the page's sitemap entry, so Google
// Images finds a paper's figures with the page they belong to. Runs after the sitemap integration
// has written the file; the IndexNow script reads only <loc> and <lastmod>, so it is unaffected.
const sitemapImages = () => ({
  name: "sitemap-images",
  hooks: {
    "astro:build:done": ({ dir }) => {
      const root = fileURLToPath(dir);
      for (const name of readdirSync(root).filter((f) => /^sitemap-\d+\.xml$/.test(f))) {
        const file = join(root, name);
        const xml = readFileSync(file, "utf8").replace(/<url><loc>([^<]+)<\/loc>([\s\S]*?)<\/url>/g, (all, loc, rest) => {
          const page = join(root, new URL(loc).pathname, "index.html");
          if (!existsSync(page)) return all;
          const html = readFileSync(page, "utf8");
          const main = html.slice(html.indexOf("<main"), html.indexOf("</main>"));
          const srcs = [...main.matchAll(/<img\b[^>]*?\ssrc="([^"]+)"/g)].map((m) => new URL(m[1], loc).href).filter((u) => !u.endsWith(".svg"));
          const images = [...new Set(srcs)].map((u) => `<image:image><image:loc>${u.replace(/&/g, "&amp;")}</image:loc></image:image>`).join("");
          return `<url><loc>${loc}</loc>${rest}${images}</url>`;
        });
        writeFileSync(file, xml);
      }
    },
  },
});

export default defineConfig({
  site: "https://dario-loi.github.io",
  build: { inlineStylesheets: "always" },
  trailingSlash: "ignore",
  devToolbar: { enabled: false },
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => (hasPosts || !page.endsWith("/blog/")) && !unlisted.some((p) => page.endsWith(p)),
      serialize: (item) => ({ ...item, lastmod: lastmod(item.url) }),
    }),
    sitemapImages(),
  ],
  markdown: {
    // No smart punctuation: "--" would become an em dash, which the writing rules forbid.
    processor: satteri({ features: { smartPunctuation: false }, hastPlugins: [plyTables, plyCiteLinks()] }),
    shikiConfig: { theme: codeTheme, transformers: [plyCodeFrame()] },
  },
  // Pages are small and static, so the next one loads while the pointer rests on its link.
  prefetch: { prefetchAll: true, defaultStrategy: "hover" },
  // Addresses from the Jekyll site that people may still have.
  redirects: {
    "/about": "/",
    "/2024/03/13/how-i-learned-to-finally-keep-it-simple": "/blog/",
    "/tag/coding": "/blog/",
    "/tag/python": "/blog/",
    "/tag/devops": "/blog/",
  },
  vite: {
    ssr: { noExternal: ["@dario-loi/polytope"] },
    plugins: [
      // KaTeX's faces use font-display: block, which hides math until its fonts arrive. swap shows
      // it at once in a fallback face and switches when the fonts load.
      {
        name: "katex-font-display",
        enforce: "pre",
        transform: (code, id) => (/katex(\.min)?\.css/.test(id) ? code.replaceAll("font-display:block", "font-display:swap") : undefined),
      },
    ],
  },
});
