// Personal site of Dario Loi. Static output for GitHub Pages at the root of dario-loi.github.io.
// The /polytope/ path on the same host belongs to the Polytope docs (a separate project site),
// so no page here may live under it.
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { satteri } from "@astrojs/markdown-satteri";
import { createRequire } from "node:module";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { plyCodeFrame } from "./src/lib/shiki-ply-code.mjs";
import { plyTables } from "./src/lib/hast-ply-tables.mjs";

const requireJson = createRequire(import.meta.url);
const codeTheme = requireJson("@dario-loi/polytope/code-theme.json");

// Entries of a collection, as paths from the project root, and whether one is a draft.
const entryFiles = (dir) => readdirSync(dir).filter((f) => /^[^_].*\.mdx?$/.test(f)).map((f) => dir + f);
const isDraft = (file) => /^draft:\s*true\s*$/m.test(readFileSync(file, "utf8").split("---")[1] ?? "");
const picturesOf = (file) => [...readFileSync(file, "utf8").matchAll(/\.\/([\w.-]+\.(?:webp|png|jpe?g|avif|svg))/g)].map((m) => file.replace(/[^/]+$/, m[1]));

// While every post is a draft the blog index is an empty state, kept out of search and the sitemap.
const hasPosts = entryFiles("src/content/blog/").some((f) => !isDraft(f));

// Each page's lastmod in the sitemap: the date of the last commit that touched what the page is
// made from. An entry page is its own file and the pictures it names; a list page is its page
// file and the entries it shows. A paper's date is not used, since it says when the paper came
// out, not when its page last changed. Drafts, and the pictures they name, never count: they are
// not on the site, so editing one changes no page. Without full history (a shallow clone) there
// is no lastmod.
const git = (...args) => {
  try { return execFileSync("git", args, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim(); } catch { return ""; }
};
const fullHistory = git("rev-parse", "--is-shallow-repository") === "false";
const notDrafts = ["blog", "publications", "projects"]
  .flatMap((c) => entryFiles(`src/content/${c}/`).filter(isDraft))
  .flatMap((f) => [f, ...picturesOf(f)])
  .map((f) => `:(exclude)${f}`);
const pageSources = {
  "/": ["src/pages/index.astro", "src/content"],
  "/cv/": ["src/pages/cv.astro", "src/data/cv.ts", "src/content/publications"],
  "/privacy/": ["src/pages/privacy.astro"],
  "/blog/": ["src/pages/blog/index.astro", "src/content/blog"],
  "/projects/": ["src/pages/projects/index.astro", "src/content/projects"],
  "/publications/": ["src/pages/publications/index.astro", "src/content/publications"],
};
function sourcesOf(path) {
  const entry = path.match(/^\/(blog|publications|projects)\/([^/]+)\/$/);
  if (!entry) return pageSources[path];
  const dir = `src/content/${entry[1]}/`;
  const file = [".md", ".mdx"].map((ext) => dir + entry[2] + ext).find((f) => existsSync(f));
  if (!file) return undefined;
  return [file, ...picturesOf(file)];
}
function lastmod(url) {
  const paths = fullHistory && sourcesOf(new URL(url).pathname);
  return (paths && git("log", "-1", "--format=%cI", "--", ...paths, ...notDrafts)) || undefined;
}

export default defineConfig({
  site: "https://dario-loi.github.io",
  trailingSlash: "ignore",
  devToolbar: { enabled: false },
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => hasPosts || !page.endsWith("/blog/"),
      serialize: (item) => ({ ...item, lastmod: lastmod(item.url) }),
    }),
  ],
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
