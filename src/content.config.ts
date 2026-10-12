// Content collections. Each entry is one Markdown or MDX file; `draft: true` keeps an entry
// out of production builds (it still renders under `astro dev`).
import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const icon = z.enum(["paper", "code", "data", "quote", "external", "download"]);
const link = z.object({ label: z.string(), href: z.string(), icon: icon.optional() });

const blog = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/blog" }),
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
      draft: z.boolean().default(false),
    }),
});

const publications = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/publications" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      authors: z.array(z.string()).min(1),
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
      /** The tab and search-result title, for a paper title too long to fit in 70 characters. */
      shortTitle: z.string().optional(),
      /** The search-result and link-preview summary; defaults to the TL;DR. */
      description: z.string().max(160).optional(),
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
    }),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/projects" }),
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
      draft: z.boolean().default(false),
    }),
});

export const collections = { blog, publications, projects };
