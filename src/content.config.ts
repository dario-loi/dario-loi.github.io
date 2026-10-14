// Content collections. Each entry is one Markdown or MDX file; `draft: true` keeps an entry
// out of production builds (it still renders under `astro dev`).
import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { readdirSync, readFileSync } from "node:fs";

// The entries a collection loads. A production build leaves drafts out here, not only from the
// lists, so nothing built from one reaches the site: not its page, its code or styles, its
// pictures, or a file named after it. `astro dev` loads them all.
const isDraft = (file: string) => /^draft:\s*true\s*$/m.test(readFileSync(file, "utf8").split("---")[1] ?? "");
const entriesIn = (base: string) =>
  glob({
    pattern: [
      "**/[^_]*.{md,mdx}",
      ...(import.meta.env.PROD ? readdirSync(base).filter((f) => /\.mdx?$/.test(f) && isDraft(`${base}/${f}`)).map((f) => `!${f}`) : []),
    ],
    base,
  });

const icon = z.enum(["paper", "code", "data", "quote", "external", "download"]);
const link = z.object({ label: z.string(), href: z.string(), icon: icon.optional() });
// A paper's author: a name, or a name with the numbers of their affiliations (counting from 1
// in the paper's `affiliations`) and an asterisk that the paper's `starNote` explains. Both
// forms come out as the object, so pages read one shape.
const author = z
  .union([
    z.string(),
    z.object({ name: z.string(), affiliations: z.array(z.number().int().positive()).default([]), starred: z.boolean().default(false) }),
  ])
  .transform((a) => (typeof a === "string" ? { name: a, affiliations: [] as number[], starred: false } : a));

const blog = defineCollection({
  loader: entriesIn("./src/content/blog"),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      /** One or two sentences: the card summary and the search description. */
      description: z.string().max(160),
      date: z.coerce.date(),
      updated: z.coerce.date().optional(),
      tags: z.array(z.string()).default([]),
      /** A figure for the card and the top of the post. Without one, the card draws a complex. */
      cover: image().optional(),
      coverAlt: z.string().optional(),
      /** The cover as a dark page shows it, for a light screenshot that would glare there. */
      coverDark: image().optional(),
      draft: z.boolean().default(false),
    }),
});

const publications = defineCollection({
  loader: entriesIn("./src/content/publications"),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      authors: z.array(author).min(1),
      /** Affiliations as the paper lists them, in its order; authors point at them by number. */
      affiliations: z.array(z.string()).default([]),
      /** What an author's asterisk means, in the paper's words, such as "Corresponding author". */
      starNote: z.string().optional(),
      /** Short venue as it should be cited, such as "ICLR 2026". */
      venue: z.string(),
      /** Full venue name, for Google Scholar and the paper header. */
      venueFull: z.string().optional(),
      kind: z.enum(["conference", "journal", "workshop", "preprint", "thesis"]).default("conference"),
      /** Presentation format or status, such as "Poster" or "Oral". */
      format: z.string().optional(),
      /** A distinction, such as "Best paper award". Shown on the card and beside the venue. */
      award: z.string().optional(),
      date: z.coerce.date(),
      /** The tab, search-result, and pager title, for a paper title longer than 70 characters. */
      shortTitle: z.string().optional(),
      /** The search-result and link-preview summary, in plain text; defaults to the TL;DR. */
      description: z.string().max(160).optional(),
      /** TL;DR, abstract, and figure caption take inline TeX as $...$. Fields with TeX go in
       *  single quotes, since double-quoted YAML turns backslashes into escapes. */
      tldr: z.string().optional(),
      abstract: z.string(),
      keywords: z.array(z.string()).default([]),
      links: z.array(link).default([]),
      arxiv: z.string().optional(),
      doi: z.string().optional(),
      pdf: z.string().optional(),
      bibtex: z.string(),
      /** Shown on the home page. */
      selected: z.boolean().default(false),
      /** Card and header panel image. Without one, both draw a complex seeded from the id. */
      cover: image().optional(),
      coverAlt: z.string().optional(),
      /** The cover as a dark page shows it, for a light screenshot that would glare there. */
      coverDark: image().optional(),
      /** The paper's key figure, shown above the abstract. */
      figure: image().optional(),
      /** "wide" is a full-width paper figure; "column" keeps a single-column figure near the
       *  size it prints at, so its raster parts are not enlarged past their resolution. */
      figureSize: z.enum(["wide", "column"]).default("wide"),
      /** The figure's number in the paper, for its caption. */
      figureNum: z.number().int().positive().default(1),
      figureAlt: z.string().optional(),
      /** Figure caption; inline HTML such as <sup> and <em> is allowed. */
      figureCaption: z.string().optional(),
      draft: z.boolean().default(false),
    }).superRefine((d, ctx) => {
      // Every affiliation number points at a listed affiliation.
      for (const a of d.authors) for (const n of a.affiliations) {
        if (n > d.affiliations.length) ctx.addIssue({ code: "custom", message: `${a.name}: affiliation ${n} is not in the ${d.affiliations.length} listed`, path: ["authors"] });
      }
    }),
});

const projects = defineCollection({
  loader: entriesIn("./src/content/projects"),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().max(160),
      /** When the project started; orders the list. */
      date: z.coerce.date(),
      /** Where it came from, such as "Course project, Deep Learning, Sapienza University of Rome". */
      context: z.string().optional(),
      tags: z.array(z.string()).default([]),
      links: z.array(link).default([]),
      /** Shown on the home page. */
      featured: z.boolean().default(false),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      /** The cover as a dark page shows it, for a light screenshot that would glare there. */
      coverDark: image().optional(),
      draft: z.boolean().default(false),
    }),
});

export const collections = { blog, publications, projects };
