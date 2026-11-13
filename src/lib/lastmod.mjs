// When each page last changed, from git, for the sitemap's lastmod (astro.config.mjs) and a paper
// page's dateModified (src/pages/publications/[...id].astro). Plain JavaScript, since the config
// imports it before any TypeScript is compiled. Paths are from the project root, where builds run.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

// Entries of a collection, as paths from the project root, and whether one is a draft.
export const entryFiles = (dir) => readdirSync(dir).filter((f) => /^[^_].*\.mdx?$/.test(f)).map((f) => dir + f);
export const isDraft = (file) => /^draft:\s*true\s*$/m.test(readFileSync(file, "utf8").split("---")[1] ?? "");
export const picturesOf = (file) => [...readFileSync(file, "utf8").matchAll(/\.\/([\w.-]+\.(?:webp|png|jpe?g|avif|svg))/g)].map((m) => file.replace(/[^/]+$/, m[1]));

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
  "/publications/topics/": ["src/pages/publications/topics", "src/data/topics.ts", "src/content/publications"],
};
function sourcesOf(path) {
  // A topic's page changes when any paper does, or the list of topics.
  if (path.startsWith("/publications/topics/")) return pageSources["/publications/topics/"];
  const entry = path.match(/^\/(blog|publications|projects)\/([^/]+)\/$/);
  if (!entry) return pageSources[path];
  const dir = `src/content/${entry[1]}/`;
  const file = [".md", ".mdx"].map((ext) => dir + entry[2] + ext).find((f) => existsSync(f));
  if (!file) return undefined;
  return [file, ...picturesOf(file)];
}
/** The ISO date of the last commit that changed the page at `url` (an address or a path), or
 *  undefined when git cannot tell. */
export function lastmod(url) {
  const paths = fullHistory && sourcesOf(new URL(url, "https://example.invalid").pathname);
  return (paths && git("log", "-1", "--format=%cI", "--", ...paths, ...notDrafts)) || undefined;
}
