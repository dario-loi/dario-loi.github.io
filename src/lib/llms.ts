// llms.txt and llms-full.txt (https://llmstxt.org): the site as Markdown for language models
// and agents, built from the collections so it never falls behind the pages. llms.txt is the
// index: who, then every paper, project, and post with a line about it. llms-full.txt adds each
// paper's abstract and BibTeX and each project's page text, so a model can answer from the
// file alone.
import { entries, longDate, pubVenue } from "./content";
import { cv, person, siteMeta } from "../site";

const site = import.meta.env.SITE;
const abs = (path: string) => new URL(path, site).href;
// Link text and notes are one line of Markdown each.
const line = (s: string) => s.replace(/\s+/g, " ").trim();
const label = (s: string) => line(s).replace(/([[\]])/g, "\\$1");
const link = (text: string, href: string) => `[${label(text)}](${abs(href)})`;
const own = (href: string) => !href.startsWith("#");

const profileNames: Record<keyof typeof person.profiles, string> = {
  scholar: "Google Scholar",
  openreview: "OpenReview",
  orcid: "ORCID",
  github: "GitHub",
  linkedin: "LinkedIn",
};

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
      : line(`Every page below is static HTML that reads without JavaScript. ${link("llms-full.txt", "/llms-full.txt")} adds each paper's abstract and BibTeX and each project's description.`),
    "",
  );

  if (pubs.length > 0) {
    push("## Publications", "");
    for (const p of pubs) {
      const d = p.data;
      const page = `/publications/${p.id}/`;
      const names = d.authors.map((a) => a.name);
      const authors = names.join(", ");
      if (!full) {
        // A long list folds as the paper pages fold theirs, keeping the site owner in view.
        const more = names.slice(3);
        const byline = names.length > 12 ? `${names.slice(0, 3).join(", ")}, and ${more.length} more${more.includes(person.name) ? `, including ${person.name}` : ""}` : authors;
        push(`- ${link(d.title, page)}: ${line([`${pubVenue(d, true)}.`, `Authors: ${byline}.`, d.tldr, d.pdf && `PDF: ${abs(d.pdf)}`].filter(Boolean).join(" "))}`);
        continue;
      }
      push(`### ${line(d.title)}`, "");
      push(`- Page: ${abs(page)}`, `- Authors: ${authors}`, `- Venue: ${pubVenue(d, true)}`, `- Date: ${longDate(d.date)}`);
      if (d.pdf) push(`- PDF: ${abs(d.pdf)}`);
      const links = d.links.filter((l) => own(l.href) && l.href !== d.pdf);
      if (links.length > 0) push(`- Links: ${links.map((l) => link(l.label, l.href)).join(", ")}`);
      if (d.keywords.length > 0) push(`- Keywords: ${d.keywords.join(", ")}`);
      push("");
      if (d.tldr) push(`TL;DR: ${line(d.tldr)}`, "");
      push(`Abstract: ${line(d.abstract)}`, "");
      push("```bibtex", d.bibtex.trim(), "```", "");
      if (p.body?.trim()) push(p.body.trim(), "");
    }
    if (!full) push("");
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
      if (p.body?.trim()) push(p.body.trim(), "");
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
  if (pubs.length > 0) push(`- ${link("Publications RSS feed", "/publications/rss.xml")}: New papers, with their abstracts and PDFs.`);
  if (projects.length > 0) push(`- ${link("Projects RSS feed", "/projects/rss.xml")}: New projects.`);
  if (posts.length > 0) push(`- ${link("Blog RSS feed", "/rss.xml")}: New posts.`);
  push(
    `- ${link("Sitemap", "/sitemap-index.xml")}: Every page, with the date it last changed.`,
    `- [Polytope](${siteMeta.polytope}): The design system this site is built with, and its documentation.`,
    `- [Site source](${siteMeta.repo}): The code and content of this site.`,
    `- ${link("Privacy", "/privacy/")}: What the site measures, and what it keeps in the browser.`,
    "",
  );
  return out.join("\n");
}
