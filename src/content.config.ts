// Content collections. Each entry is one Markdown or MDX file; `draft: true` keeps an entry
// out of production builds (it still renders under `astro dev`).
import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { readdirSync, readFileSync } from "node:fs";
import { topicNames } from "./data/topics";

// The entries a collection loads. A production build leaves drafts out of the collection itself,
// so nothing built from a draft (its page, styles, pictures, or a file named after it) reaches
// the site. `astro dev` loads them all.
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
      /** "entry" when the award went to my submission that the paper reports, such as a
       *  challenge entry, and not to the paper: the paper's schema.org record leaves it out. */
      awardScope: z.enum(["paper", "entry"]).default("paper"),
      /** The proceedings series the paper is published in when it is not the venue itself, such
       *  as "Proceedings of the AAAI Symposium Series"; Scholar reads it as the journal title. */
      series: z.string().optional(),
      /** Volume, issue, and page range ("147-162") in the proceedings, as the publisher gives them. */
      volume: z.union([z.string(), z.number()]).optional(),
      issue: z.union([z.string(), z.number()]).optional(),
      pages: z.string().regex(/^\d+(-\d+)?$/).optional(),
      date: z.coerce.date(),
      /** The tab, search-result, and pager title, for a paper title longer than 70 characters. */
      shortTitle: z.string().optional(),
      /** The search-result and link-preview summary, in plain text; defaults to the TL;DR. */
      description: z.string().max(160).optional(),
      /** TL;DR, abstract, and figure caption take inline TeX as $...$. Fields with TeX go in
       *  single quotes, since double-quoted YAML turns backslashes into escapes. */
      tldr: z.string().optional(),
      abstract: z.string(),
      /** Search keywords specific to the paper, for its metadata (schema.org, the PDF). */
      keywords: z.array(z.string()).default([]),
      /** The broad topics the paper belongs to, by name from src/data/topics.ts. They show as
       *  tags under the abstract, and each links to that topic's list of papers. */
      topics: z.array(z.enum(topicNames as [string, ...string[]])).default([]),
      links: z.array(link).default([]),
      arxiv: z.string().optional(),
      doi: z.string().optional(),
      /** Other pages for this same paper, such as the lab's page for it. With the DOI, arXiv, and
       *  Google Scholar links, they become the paper record's schema.org sameAs. */
      sameAs: z.array(z.url()).default([]),
      pdf: z.string().optional(),
      bibtex: z.string(),
      /** Shown on the home page. */
      selected: z.boolean().default(false),
      /** Card and header panel image. Without one, both draw a complex seeded from the id. */
      cover: image().optional(),
      coverAlt: z.string().optional(),
      /** A short caption for the cover on the paper page (inline HTML such as <i> allowed). With
       *  one, coverAlt becomes the picture's alt text there; without one, coverAlt is the caption. */
      coverCaption: z.string().optional(),
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
      /** A working model shown beside the paper's header (src/components/widgets). It is a draft
       *  until widgetLive is set: drafts render under `npm run dev` only. */
      widget: z.enum(["tta-gate", "ad-threshold", "autobench-loop", "iso-operator", "clip-frequency", "tdl-lifting"]).optional(),
      widgetLive: z.boolean().default(false),
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
