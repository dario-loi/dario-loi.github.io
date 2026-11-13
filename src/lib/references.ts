// The works a paper page's body cites or discusses, from src/content/publications/<id>.refs.json:
// one entry per work, each with its official BibTeX and the address it was copied from. The page
// lists them under "References", its body's citations link to them (src/lib/hast-cite-links.mjs),
// and its schema.org record names them as the works it cites.
import { z } from "astro/zod";

const ref = z.object({
  /** The entry's anchor on the page, #ref-<key>. */
  key: z.string().regex(/^[a-z0-9-]+$/),
  /** The body's citations of this work, character for character, such as "Bodnar et al., 2022";
   *  each occurrence links to the entry. Empty for a work the body discusses only by name. */
  cite: z.array(z.string()),
  title: z.string(),
  authors: z.array(z.string()).min(1),
  venue: z.string().optional(),
  year: z.number().int(),
  doi: z.string().optional(),
  arxiv: z.string().optional(),
  /** The version of record's page. */
  url: z.url().optional(),
  /** The official BibTeX entry. */
  bibtex: z.string(),
  /** Where the BibTeX came from. */
  source: z.string(),
});
export type Ref = z.infer<typeof ref>;

const files = import.meta.glob<unknown>("../content/publications/*.refs.json", { eager: true, import: "default" });

/** Author-year order: by the citation as the body writes it, else by first author and year. */
const sortKey = (r: Ref) => (r.cite[0] ?? `${r.authors[0].trim().split(/\s+/).at(-1)} ${r.year}`).toLowerCase();

const byId = new Map<string, Ref[]>();
for (const [path, data] of Object.entries(files)) {
  const id = path.split("/").pop()!.replace(/\.refs\.json$/, "");
  const parsed = z.array(ref).safeParse(data);
  if (!parsed.success) throw new Error(`${path}: ${parsed.error.message}`);
  const keys = new Set<string>();
  for (const r of parsed.data) {
    if (keys.has(r.key)) throw new Error(`${path}: duplicate key ${r.key}`);
    keys.add(r.key);
  }
  byId.set(id, [...parsed.data].sort((a, b) => sortKey(a).localeCompare(sortKey(b))));
}

export const referencesOf = (id: string): Ref[] => byId.get(id) ?? [];

/** Authors as a reference list prints them: all of up to six, else the first six and "et al." */
export const refAuthors = (a: string[]) =>
  a.length > 6 ? `${a.slice(0, 6).join(", ")}, et al.` : a.length > 2 ? `${a.slice(0, -1).join(", ")}, and ${a.at(-1)}` : a.join(" and ");

/** The address the entry's title links to: the DOI, else the version of record, else arXiv. */
export const refHref = (r: Ref) => (r.doi ? `https://doi.org/${r.doi}` : (r.url ?? (r.arxiv ? `https://arxiv.org/abs/${r.arxiv}` : undefined)));

/** A plain-text reference, for Markdown and llms-full.txt. */
export const refText = (r: Ref) => {
  const href = refHref(r);
  return `${refAuthors(r.authors)} (${r.year}). ${r.title}.${r.venue ? ` ${r.venue}.` : ""}${href ? ` ${href}` : ""}`;
};

/** schema.org type from the BibTeX entry type. */
const typeOf = (r: Ref) => {
  const t = /^@(\w+)/.exec(r.bibtex.trim())?.[1]?.toLowerCase() ?? "";
  return t === "book" || t === "inbook" || t === "incollection" ? (t === "book" ? "Book" : "Chapter") : t === "software" || t === "online" ? "CreativeWork" : "ScholarlyArticle";
};

/** The entry as a schema.org record, for the citing paper's `citation`. */
export const refNode = (r: Ref) => {
  const sameAs = [r.doi && `https://doi.org/${r.doi}`, r.arxiv && `https://arxiv.org/abs/${r.arxiv}`, r.url].filter((s): s is string => Boolean(s));
  return {
    "@type": typeOf(r),
    name: r.title,
    author: r.authors.map((name) => ({ "@type": "Person", name })),
    datePublished: String(r.year),
    isPartOf: r.venue ? { "@type": "CreativeWork", name: r.venue } : undefined,
    url: refHref(r),
    identifier: r.doi ? { "@type": "PropertyValue", propertyID: "DOI", value: r.doi } : undefined,
    sameAs: sameAs.length ? [...new Set(sameAs)] : undefined,
  };
};
