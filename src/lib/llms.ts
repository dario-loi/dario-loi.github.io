// llms.txt and llms-full.txt (https://llmstxt.org): the site as Markdown for language models
// and agents, built from the collections so it never falls behind the pages. llms.txt is the
// index: who, then every paper, project, and post with a line about it. llms-full.txt adds each
// paper's abstract and BibTeX and each project's page text, so a model can answer from the
// file alone.
import type { CollectionEntry } from "astro:content";
import { entries, longDate, pubVenue } from "./content";
import { plain } from "./tex";
import { referencesOf, refText } from "./references";
import { topicOf, topicPath, topics } from "../data/topics";
import { cv, person, siteMeta } from "../site";

const site = import.meta.env.SITE;
const abs = (path: string) => new URL(path, site).href;
// Link text and notes are one line of Markdown each.
const line = (s: string) => s.replace(/\s+/g, " ").trim();
const label = (s: string) => line(s).replace(/([[\]])/g, "\\$1");
const link = (text: string, href: string) => `[${label(text)}](${abs(href)})`;
const own = (href: string) => !href.startsWith("#");
// An entry's text as plain Markdown: MDX imports dropped, a picture or plot given as its alt text
// (and a figure's caption as a line after it), a sidenote set in parentheses where it is anchored,
// component tags removed around what they hold (an interactive chart, which has no text of its own,
// disappears), site-relative links made absolute so a chunk read on its own still resolves, and
// headings moved `shift` levels down to sit under the entry's own heading. Code blocks are left
// as they are, and so is inline math ($...$ stays TeX).
const markdown = (body: string, shift: number) =>
  body
    .split(/(^```[\s\S]*?^```$)/m)
    .map((part, i) =>
      i % 2
        ? part
        : part
            .replace(/^import\s.+$/gm, "")
            .replace(/<Picture\b[^>]*?\balt="([^"]*)"[^>]*\/>/g, "[Figure: $1]")
            .replace(/<LabPlot\b[^>]*?\balt="([^"]*)"[^>]*>/g, "[Figure: $1]")
            .replace(/<Fragment\s+slot="caption">([\s\S]*?)<\/Fragment>/g, "Caption: $1")
            .replace(/^[ \t]+(?=\[Figure|Caption:)/gm, "")
            .replace(/<Sidenote\b[^>]*>([\s\S]*?)<\/Sidenote>/g, " ($1)")
            .replace(/<\/?[A-Z][\w.]*(\s[^>]*)?>/g, "")
            .replace(/\]\((\/[^)]*)\)/g, (_, href) => `](${abs(href)})`)
            .replace(/^(#{1,4}) /gm, (_, h) => `${"#".repeat(shift)}${h} `),
    )
    .join("")
    .replace(/[ \t]+$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

const profileNames: Record<keyof typeof person.profiles, string> = {
  scholar: "Google Scholar",
  openreview: "OpenReview",
  orcid: "ORCID",
  github: "GitHub",
  linkedin: "LinkedIn",
};

type Paper = CollectionEntry<"publications">;
const paperPage = (p: Paper) => `/publications/${p.id}/`;
/** The paper's Markdown version, one file per paper (src/pages/publications/[id]/index.md.ts). */
export const paperMarkdownPath = (p: Paper) => `${paperPage(p)}index.md`;

/** The identifiers the paper's data already holds: arXiv, DOI, OpenReview, the venue's own page. */
function identifiers(p: Paper) {
  const d = p.data;
  const ids: { label: string; href: string }[] = [];
  if (d.arxiv) ids.push({ label: "arXiv", href: `https://arxiv.org/abs/${d.arxiv}` });
  if (d.doi) ids.push({ label: "DOI", href: `https://doi.org/${d.doi}` });
  for (const l of d.links) {
    if (/^https?:\/\/openreview\.net\//.test(l.href) && !ids.some((i) => i.href === l.href)) ids.push({ label: "OpenReview", href: l.href });
    else if (l.icon === "paper" && /^https?:/.test(l.href) && !ids.some((i) => i.href === l.href)) ids.push({ label: l.label, href: l.href });
  }
  return ids;
}

/** The venue line. An award that went to the site owner's challenge entry, not to the paper, is
 *  left out of it and stated on its own (entryAward), so a reader does not credit it to the paper. */
const venueOf = (d: Paper["data"]) => pubVenue(d.awardScope === "entry" ? { ...d, award: undefined } : d, true);
const entryAward = (d: Paper["data"]) => (d.awardScope === "entry" && d.award ? `Award to ${person.name}'s challenge entry: ${d.award}` : undefined);

/** A plain-text reference for the paper: the final venue, the year, and the best address. A long
 *  author list is cut to three names, as citation styles do. */
function howToCite(p: Paper) {
  const d = p.data;
  const names = d.authors.map((a) => a.name);
  const who = names.length > 12 ? `${names.slice(0, 3).join(", ")}, et al.` : names.length > 1 ? `${names.slice(0, -1).join(", ")}, and ${names.at(-1)}` : names[0];
  // The venue as a reference gives it: no format or award, then the series, volume, and pages.
  const named = d.venueFull ? (d.venueFull.includes(d.venue) ? d.venueFull : `${d.venueFull} (${d.venue})`) : d.venue;
  const volume = d.volume === undefined ? "" : d.issue === undefined ? `vol. ${d.volume}` : `${d.volume}(${d.issue})`;
  const locator = [d.series, volume, d.pages && `pp. ${d.pages}`].filter(Boolean).join(", ");
  const venue = d.kind === "preprint" ? (d.arxiv ? `arXiv:${d.arxiv}` : "Preprint") : locator ? `${named}. ${locator}` : named;
  // The version of record first: the DOI, else the venue's own page (PMLR, OpenReview), else arXiv.
  const venuePage = d.links.find((l) => l.icon === "paper" && /^https?:/.test(l.href))?.href;
  const where = d.doi ? `https://doi.org/${d.doi}` : venuePage ?? (d.arxiv ? `https://arxiv.org/abs/${d.arxiv}` : abs(paperPage(p)));
  return `${who} (${d.date.getUTCFullYear()}). ${line(plain(d.title))}. ${venue}. ${where}`;
}

/** One paper as self-contained Markdown: its heading (at `level`), then the title, authors, venue,
 *  year, links, topics, and how to cite, then the summary, abstract, key figure, writeup, and
 *  BibTeX. Every section of llms-full.txt and every per-paper file starts from this, so a chunk
 *  that holds only part of the paper still says what paper it is. */
export function paperMarkdown(p: Paper, level: number) {
  const d = p.data;
  const names = d.authors.map((a) => a.name);
  const out: string[] = [];
  out.push(`${"#".repeat(level)} ${line(plain(d.title))}`, "");
  out.push(`- Authors: ${names.join(", ")}`, `- Venue: ${venueOf(d)}`, ...(entryAward(d) ? [`- ${entryAward(d)}`] : []), `- Published: ${longDate(d.date)}`, `- Page: ${abs(paperPage(p))}`, `- Markdown: ${abs(paperMarkdownPath(p))}`);
  if (d.pdf) out.push(`- PDF: ${abs(d.pdf)}`);
  const ids = identifiers(p);
  for (const i of ids) out.push(`- ${i.label}: ${i.href}`);
  const shown = new Set([d.pdf, ...ids.map((i) => i.href)]);
  const more = d.links.filter((l) => own(l.href) && !shown.has(l.href) && l.label !== "PDF");
  if (more.length > 0) out.push(`- Related: ${more.map((l) => `${label(l.label)} (${abs(l.href)})`).join(", ")}`);
  if (d.topics.length > 0) out.push(`- Topics: ${d.topics.map((t) => `${t} (${abs(topicPath(topicOf(t)))})`).join(", ")}`);
  if (d.keywords.length > 0) out.push(`- Keywords: ${d.keywords.join(", ")}`);
  out.push(`- How to cite: ${howToCite(p)}`, "");
  if (d.tldr) out.push(`Summary: ${line(plain(d.tldr))}`, "");
  out.push(`Abstract: ${line(plain(d.abstract))}`, "");
  if (d.figureAlt) out.push(`Key figure${d.figureNum ? ` (Figure ${d.figureNum})` : ""}: ${[d.figureCaption && line(plain(d.figureCaption).replace(/<[^>]+>/g, "")), line(d.figureAlt)].filter(Boolean).join(" ")}`, "");
  if (p.body?.trim()) out.push(markdown(p.body, level - 1), "");
  const refs = referencesOf(p.id);
  if (refs.length) out.push("References:", "", ...refs.map((r) => `- ${refText(r)}`), "");
  out.push("BibTeX:", "", "```bibtex", d.bibtex.trim(), "```", "");
  return out.join("\n");
}

/** The per-paper file: the paper's Markdown as a document of its own. */
export const paperDocument = (p: Paper) => `${paperMarkdown(p, 1)}\n---\n\nFrom ${person.name}'s site (${abs("/")}). Index of all papers: ${abs("/llms.txt")}.\n`;

export async function llms(full: boolean) {
  const [pubs, projects, posts] = await Promise.all([entries("publications"), entries("projects"), entries("blog")]);
  const out: string[] = [];
  const push = (...lines: string[]) => out.push(...lines);

  push(`# ${person.name}`, "", `> ${person.lede}`, "");
  push(
    line(`This is the personal site of ${person.name}. I work in the ${person.lab.name} at ${person.affiliation} in ${person.city}, and studied at ${person.alumniOf}. Research areas: ${person.topics.join(", ").toLowerCase()}.`),
    "",
    full
      ? line(`Every page below is static HTML that reads without JavaScript. The shorter index is ${link("llms.txt", "/llms.txt")}.`)
      : line(`Every page below is static HTML that reads without JavaScript. ${link("llms-full.txt", "/llms-full.txt")} adds each paper's abstract, writeup, and BibTeX and each project's description. Each paper also has a Markdown file of its own at its page address plus index.md.`),
    "",
  );

  push("## How to cite", "");
  push(
    line(`Cite a paper by its final venue, using the BibTeX on its page (also in ${link("llms-full.txt", "/llms-full.txt")} and each paper's Markdown file). Preprints list the arXiv identifier. Papers are co-authored; the author list on each entry is the full one. Cite the paper, not this site.`),
    "",
  );

  if (pubs.length > 0) {
    push("## Publications", "");
    for (const p of pubs) {
      const d = p.data;
      const names = d.authors.map((a) => a.name);
      if (!full) {
        // A long list folds as the paper pages fold theirs, keeping the site owner in view.
        const more = names.slice(3);
        const byline = names.length > 12 ? `${names.slice(0, 3).join(", ")}, and ${more.length} more${more.includes(person.name) ? `, including ${person.name}` : ""}` : names.join(", ");
        const ids = identifiers(p).map((i) => `${i.label}: ${i.href}`);
        const topicList = d.topics.length > 0 ? `Topics: ${d.topics.join(", ")}.` : "";
        push(
          `- ${link(plain(d.title), paperPage(p))}: ${line(
            [`${[venueOf(d), String(d.date.getUTCFullYear())].filter((v, i, all) => i === 0 || !all[0].includes(v)).join(", ")}.`, entryAward(d) && `${entryAward(d)}.`, `Authors: ${byline}.`, d.tldr && `${plain(d.tldr)}`, d.pdf && `PDF: ${abs(d.pdf)}.`, ...ids.map((i) => `${i}.`), `Markdown: ${abs(paperMarkdownPath(p))}.`, topicList]
              .filter(Boolean)
              .join(" "),
          )}`,
        );
        continue;
      }
      push(paperMarkdown(p, 3));
    }
    if (!full) push("");
  }

  if (!full && pubs.length > 0) {
    push("## Research topics", "");
    for (const t of topics) {
      const inTopic = pubs.filter((p) => p.data.topics.includes(t.name));
      if (inTopic.length > 0) push(`- ${link(t.name, topicPath(t))}: ${line(t.description)} Papers: ${inTopic.map((p) => line(plain(p.data.shortTitle ?? p.data.title))).join("; ")}.`);
    }
    push("");
  }

  if (projects.length > 0) {
    push("## Projects", "");
    for (const p of projects) {
      const d = p.data;
      const page = `/projects/${p.id}/`;
      if (!full) {
        push(`- ${link(d.title, page)}: ${line(d.description)}`);
        continue;
      }
      push(`### ${line(d.title)}`, "");
      push(`- Page: ${abs(page)}`, `- Started: ${d.date.getUTCFullYear()}`);
      if (d.context) push(`- Context: ${line(d.context)}`);
      if (d.tags.length > 0) push(`- Tags: ${d.tags.join(", ")}`);
      const links = d.links.filter((l) => own(l.href));
      if (links.length > 0) push(`- Links: ${links.map((l) => link(l.label, l.href)).join(", ")}`);
      push("", line(d.description), "");
      if (p.body?.trim()) push(markdown(p.body, 2), "");
    }
    if (!full) push("");
  }

  if (posts.length > 0) {
    push("## Writing", "");
    for (const p of posts) push(`- ${link(p.data.title, `/blog/${p.id}/`)}: ${longDate(p.data.date)}. ${line(p.data.description)}`);
    push("");
  }

  push("## CV", "");
  push(`- ${link("Curriculum vitae", cv.page)}: Education and research, with a map of where each happened.`);
  if (cv.pdf) push(`- ${link("CV as PDF", cv.pdf)}: The full CV.`);
  push("");

  push("## Profiles", "");
  for (const [key, href] of Object.entries(person.profiles)) push(`- [${profileNames[key as keyof typeof person.profiles]}](${href})`);
  push("");

  push("## Optional", "");
  push(`- ${link("Site RSS feed", "/rss.xml")}: Everything new, papers, projects, and posts together.`);
  if (pubs.length > 0) push(`- ${link("Publications RSS feed", "/publications/rss.xml")}: New papers, with their abstracts and PDFs.`);
  if (projects.length > 0) push(`- ${link("Projects RSS feed", "/projects/rss.xml")}: New projects.`);
  if (posts.length > 0) push(`- ${link("Blog RSS feed", "/blog/rss.xml")}: New posts.`);
  push(
    `- ${link("Sitemap", "/sitemap-index.xml")}: Every page, with the date it last changed.`,
    `- [Polytope](${siteMeta.polytope}): The design system this site is built with, and its documentation.`,
    `- [Site source](${siteMeta.repo}): The code and content of this site.`,
    `- ${link("Privacy", "/privacy/")}: What the site measures, and what it keeps in the browser.`,
    "",
  );
  return out.join("\n");
}
