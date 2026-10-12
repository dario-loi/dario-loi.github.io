// Personal site of Dario Loi. Static output for GitHub Pages at the root of dario-loi.github.io.
// The /polytope/ path on the same host belongs to the Polytope docs (a separate project site),
// so no page here may live under it.
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { satteri } from "@astrojs/markdown-satteri";
import { createRequire } from "node:module";
import { readdirSync, readFileSync } from "node:fs";
import { plyCodeFrame } from "./src/lib/shiki-ply-code.mjs";
import { plyTables } from "./src/lib/hast-ply-tables.mjs";

const requireJson = createRequire(import.meta.url);
const codeTheme = requireJson("@dario-loi/polytope/code-theme.json");

// While every post is a draft the blog index is an empty state, kept out of search and the sitemap.
const blogDir = new URL("./src/content/blog/", import.meta.url);
const hasPosts = readdirSync(blogDir)
  .filter((f) => /^[^_].*\.mdx?$/.test(f))
  .some((f) => !/^draft:\s*true\s*$/m.test(readFileSync(new URL(f, blogDir), "utf8").split("---")[1] ?? ""));

export default defineConfig({
  site: "https://dario-loi.github.io",
  trailingSlash: "ignore",
  devToolbar: { enabled: false },
  integrations: [mdx(), sitemap({ filter: (page) => hasPosts || !page.endsWith("/blog/") })],
  markdown: {
    // No smart punctuation: "--" would become an em dash, which the writing rules forbid.
    processor: satteri({ features: { smartPunctuation: false }, hastPlugins: [plyTables] }),
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
  },
});
