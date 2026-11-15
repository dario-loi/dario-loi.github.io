// Citation files for a paper: BibTeX is the entry from front matter, RIS takes authors, title, year, volume, issue,
// pages, and DOI from that same entry (front matter only as a fallback). Served at /publications/<id>/<id>.bib and /publications/<id>/<id>.ris.
import type { CollectionEntry } from "astro:content";
import { plain } from "./tex";

type Pub = CollectionEntry<"publications">;

const TYPES = { conference: "CONF", workshop: "CONF", journal: "JOUR", preprint: "GEN", thesis: "THES" } as const;

/** "Nathaniel D. Bastian" becomes "Bastian, Nathaniel D."; a single name stays as it is. */
const lastFirst = (name: string) => {
  const i = name.trim().lastIndexOf(" ");
  return i < 0 ? name.trim() : `${name.slice(i + 1)}, ${name.slice(0, i).trim()}`;
};

/** Front matter text as one plain line: emphasis markers and $ math delimiters dropped. */
const text = (s: string) => plain(s).replace(/(?<!\\)\$/g, "").replace(/\\\$/g, "$").replace(/\s+/g, " ").trim();

const ACCENTS: Record<string, string> = { "`": "\u0300", "'": "\u0301", "^": "\u0302", "~": "\u0303", '"': "\u0308", "=": "\u0304", ".": "\u0307", u: "\u0306", v: "\u030C", H: "\u030B", c: "\u0327", k: "\u0328", r: "\u030A" };
const LIGATURES: Record<string, string> = { ss: "\u00DF", ae: "\u00E6", AE: "\u00C6", oe: "\u0153", OE: "\u0152", o: "\u00F8", O: "\u00D8", l: "\u0142", L: "\u0141", i: "i", j: "j" };

/** BibTeX text as plain UTF-8: LaTeX accents such as {\'a} and \"{u} become characters, braces are dropped. */
const unTex = (s: string) =>
  s
    .replace(/\\([`'^~"=.uvHckr])\s*(?:\{\s*(\\[ij]|[A-Za-z])?\s*\}|(\\[ij]|[A-Za-z]))/g, (_, a: string, b?: string, c?: string) => {
      const ch = (b ?? c ?? "").replace(/^\\/, "");
      return ch ? (ch + ACCENTS[a]).normalize("NFC") : "";
    })
    .replace(/\\(ss|ae|AE|oe|OE|o|O|l|L)(?![A-Za-z])\s*/g, (_, k: string) => LIGATURES[k])
    .replace(/\\([&%$#_])/g, "$1")
    .replace(/[{}]/g, "")
    .replace(/\s+/g, " ")
    .trim();

/** The fields of the first entry in a BibTeX string, values with the outer braces or quotes removed. */
function bibFields(src: string): Record<string, string> {
  const out: Record<string, string> = {};
  const start = src.indexOf("{");
  if (start < 0) return out;
  const re = /([A-Za-z][\w-]*)\s*=\s*/g;
  re.lastIndex = src.indexOf(",", start) + 1;
  for (let m; (m = re.exec(src)); ) {
    let i = re.lastIndex;
    let value: string;
    if (src[i] === "{") {
      let depth = 0;
      const from = i;
      for (; i < src.length; i++) {
        if (src[i] === "{") depth++;
        else if (src[i] === "}" && --depth === 0) break;
      }
      value = src.slice(from + 1, i);
      i++;
    } else if (src[i] === '"') {
      const end = src.indexOf('"', i + 1);
      value = src.slice(i + 1, end);
      i = end + 1;
    } else {
      const end = src.slice(i).search(/[,}]/);
      value = src.slice(i, end < 0 ? undefined : i + end).trim();
      i += value.length;
    }
    out[m[1].toLowerCase()] = value;
    re.lastIndex = i;
  }
  return out;
}

/** Splits a BibTeX author field on top-level " and " and returns "Last, First" names. */
const bibAuthors = (field: string) => {
  const names: string[] = [];
  let depth = 0;
  let cur = "";
  for (let i = 0; i < field.length; i++) {
    const ch = field[i];
    if (ch === "{") depth++;
    if (ch === "}") depth--;
    if (depth === 0 && /^\s+and\s+/.test(field.slice(i))) {
      names.push(cur);
      cur = "";
      i += field.slice(i).match(/^\s+and\s+/)![0].length - 1;
    } else cur += ch;
  }
  names.push(cur);
  return names.map((n) => unTex(n)).filter(Boolean).map((n) => (n.includes(",") ? n.replace(/\s*,\s*/, ", ") : lastFirst(n)));
};

export const bibtexFile = (pub: Pub) => `${pub.data.bibtex.trim()}\n`;

export function risFile(pub: Pub, origin: string) {
  const d = pub.data;
  const bib = bibFields(d.bibtex ?? "");
  const pages = (bib.pages ?? d.pages)?.split(/\s*-+\s*/);
  const year = bib.year ? Number(bib.year) : d.date.getUTCFullYear();
  const authors = bib.author ? bibAuthors(bib.author) : d.authors.map((a) => lastFirst(a.name));
  const ymd = d.date.toISOString().slice(0, 10).replaceAll("-", "/");
  const [start, end] = pages ?? [];
  const rows: [string, string | number | undefined][] = [
    ["TY", TYPES[d.kind]],
    ...authors.map((a): [string, string] => ["AU", a]),
    ["TI", bib.title ? unTex(bib.title) : text(d.title)],
    ["T2", d.venueFull ?? d.venue],
    ["T3", d.series],
    ["PY", year],
    ["DA", `${ymd}/`],
    ["VL", bib.volume ?? d.volume],
    ["IS", bib.number ?? d.issue],
    ["SP", start],
    ["EP", end],
    ["DO", bib.doi ?? d.doi],
    ["UR", `${origin}/publications/${pub.id}/`],
    ["AB", text(d.abstract)],
    ...[...new Set([...d.topics, ...d.keywords])].map((k): [string, string] => ["KW", k]),
  ];
  const lines = rows.filter(([, v]) => v !== undefined && v !== "").map(([t, v]) => `${t}  - ${v}`);
  return [...lines, "ER  - ", ""].join("\r\n");
}
