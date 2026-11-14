// schema.org records for search engines, scrapers, and language models, built from the same
// collections as the pages. Seo (Polytope) writes each record in its own JSON-LD script and adds
// the @context. A record with the same @id as one Seo writes (a paper's #article, the home page's
// #website) is merged into it, and the fields given here win. Records refer to one another by
// @id, so the person, the site, and every paper, project, and post form one graph, and a paper's
// author resolves to the Person record on the home page.
import type { CollectionEntry } from "astro:content";
import { execFileSync } from "node:child_process";
import { isoDay } from "./content";
import { plain } from "./tex";
import { person, siteMeta } from "../site";
import { awards, cvEntries } from "../data/cv";
import { lastmod } from "./lastmod.mjs";
import { topicOf, topicPath } from "../data/topics";
import { refNode, referencesOf } from "./references";
import { personHref } from "../data/people";

type Node = Record<string, unknown>;

const site = import.meta.env.SITE;
const abs = (path: string) => new URL(path, site).href;
const home = abs("/");
export const personId = `${home}#person`;
export const websiteId = `${home}#website`;
// The site owner as the author of a page's records: enough to identify the same person elsewhere.
const me = { "@type": "Person", "@id": personId, name: person.name, url: home, sameAs: Object.values(person.profiles) };
const external = (href: string) => /^https?:\/\//.test(href);

export const portraitId = `${home}#portrait`;
/** The photo on the home page, with the metadata it carries itself (public/dario-loi.jpg). */
const portraitNode = (): Node => ({
  "@type": "ImageObject",
  "@id": portraitId,
  url: abs(person.photo),
  contentUrl: abs(person.photo),
  width: 600,
  height: 600,
  caption: person.name,
  creator: { "@id": personId },
  creditText: person.name,
});

const sapienza = { "@type": "CollegeOrUniversity", name: person.alumniOf, url: "https://www.uniroma1.it/" };
/** The degrees the CV lists as finished, as credentials from the university that gave them. */
const degrees = cvEntries
  .filter((e) => e.kind === "Education" && e.to && e.to !== "now" && e.org === person.alumniOf)
  .map((e) => ({ "@type": "EducationalOccupationalCredential", name: e.title, credentialCategory: "degree", recognizedBy: sapienza }));

const northeastern = { "@type": "CollegeOrUniversity", name: person.affiliation, url: "https://www.northeastern.edu/" };

/** The site owner, with the lab, the alma mater, and the profiles that identify the same person
 *  elsewhere. */
export const personNode = (): Node => ({
  ...me,
  url: home,
  image: portraitNode(),
  description: person.lede,
  jobTitle: person.role,
  affiliation: northeastern,
  memberOf: { "@type": "ResearchOrganization", name: person.lab.name, url: person.lab.href, parentOrganization: northeastern },
  alumniOf: sapienza,
  hasCredential: degrees.length ? degrees : undefined,
  award: awards.map((a) => `${a.text} (${a.year})`),
  knowsAbout: person.topics,
  sameAs: Object.values(person.profiles),
});

export const websiteNode = (): Node => ({
  "@type": "WebSite",
  "@id": websiteId,
  name: person.name,
  url: home,
  description: siteMeta.description,
  inLanguage: "en",
  author: me,
  publisher: me,
});

/** The ISO date of the commit that added `file`, or undefined without full git history. */
function firstCommit(file: string): string | undefined {
  try {
    const out = execFileSync("git", ["log", "--diff-filter=A", "--follow", "--format=%cI", "--", file], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
    return out.trim().split("\n").pop() || undefined;
  } catch {
    return undefined;
  }
}

/** The home page is the person's profile, and its picture is the portrait on the page. */
export const profilePageNode = (): Node => ({
  "@type": "ProfilePage",
  "@id": `${home}#profile`,
  url: home,
  name: `${person.name}, ${person.role}`,
  mainEntity: { "@id": personId },
  isPartOf: { "@id": websiteId },
  primaryImageOfPage: { "@id": portraitId },
  dateCreated: firstCommit("src/pages/index.astro"),
  dateModified: lastmod("/"),
});

const paperUrl = (p: CollectionEntry<"publications">) => abs(`/publications/${p.id}/`);
const projectUrl = (p: CollectionEntry<"projects">) => abs(`/projects/${p.id}/`);
const postUrl = (p: CollectionEntry<"blog">) => abs(`/blog/${p.id}/`);
const paperId = (p: CollectionEntry<"publications">) => `${paperUrl(p)}#article`;
const projectId = (p: CollectionEntry<"projects">) => `${projectUrl(p)}#work`;
const postId = (p: CollectionEntry<"blog">) => `${postUrl(p)}#post`;
const codeLink = (links: { href: string; icon?: string }[]) => links.find((l) => l.icon === "code" && external(l.href));

/** The publisher of the proceedings a paper appeared in, read from what the paper itself links:
 *  PMLR for a proceedings.mlr.press page, AAAI for a 10.1609 DOI. Others have none to name. */
function publisherOf(d: CollectionEntry<"publications">["data"]): Node | undefined {
  if (d.links.some((l) => l.href.startsWith("https://proceedings.mlr.press/"))) return { "@type": "Organization", name: "PMLR", url: "https://proceedings.mlr.press/" };
  if (d.doi?.startsWith("10.1609/")) return { "@type": "Organization", name: "Association for the Advancement of Artificial Intelligence", url: "https://aaai.org/" };
  return undefined;
}

/** Where a paper sits in the proceedings: the series, the volume, and the issue, as it gives them. */
function partOf(d: CollectionEntry<"publications">["data"]): Node | undefined {
  if (d.kind === "preprint") return undefined;
  const name = d.venueFull ?? d.venue;
  const series = d.series ?? (publisherOf(d)?.name === "PMLR" ? "Proceedings of Machine Learning Research" : undefined);
  const root: Node | undefined = series ? { "@type": "CreativeWorkSeries", name: series } : undefined;
  const volume: Node | undefined = d.volume != null ? { "@type": "PublicationVolume", volumeNumber: String(d.volume), name, isPartOf: root } : undefined;
  const issue: Node | undefined = d.issue != null ? { "@type": "PublicationIssue", issueNumber: String(d.issue), isPartOf: volume ?? root } : undefined;
  return issue ?? volume ?? { "@type": d.kind === "journal" ? "Periodical" : "CreativeWork", name, isPartOf: root };
}

const scholar = (href: string) => /^https:\/\/scholar\.google\.[a-z.]+\//.test(href);

/** A paper, with its abstract, venue, PDF, and the records of the same paper elsewhere.
 *  `images` are its pictures, the square one first: search results show that one whole.
 *  `modified` is when its page last changed, when that is after the paper came out. */
export function paperNode(p: CollectionEntry<"publications">, images: (string | undefined)[] = [], modified?: Date): Node {
  const pictures = images.filter((i): i is string => Boolean(i)).map(abs);
  const d = p.data;
  const url = paperUrl(p);
  const sameAs = [
    ...new Set([
      d.arxiv && `https://arxiv.org/abs/${d.arxiv}`,
      d.doi && `https://doi.org/${d.doi}`,
      ...d.links.filter((l) => external(l.href) && (l.icon === "paper" || scholar(l.href))).map((l) => l.href),
      ...d.sameAs,
    ]),
  ].filter(Boolean);
  // Co-authors carry the institutions the paper gives them. The site owner is the Person record
  // on the home page, whose affiliation is current; a paper's may be older.
  const topicTerm = (name: string) => ({ "@type": "DefinedTerm", name, url: abs(topicPath(topicOf(name))), inDefinedTermSet: abs("/publications/topics/") });
  const identifier = [
    d.doi && { "@type": "PropertyValue", propertyID: "DOI", value: d.doi, url: `https://doi.org/${d.doi}` },
    d.arxiv && { "@type": "PropertyValue", propertyID: "arXiv", value: d.arxiv, url: `https://arxiv.org/abs/${d.arxiv}` },
  ].filter(Boolean);
  const institutions = (indices: number[]) => indices.map((i) => d.affiliations[i - 1]).filter(Boolean).map((name) => ({ "@type": "Organization", name }));
  return {
    "@type": "ScholarlyArticle",
    "@id": paperId(p),
    url,
    mainEntityOfPage: url,
    headline: d.title,
    name: d.title,
    alternativeHeadline: d.shortTitle,
    description: plain(d.description ?? d.tldr ?? "") || undefined,
    abstract: plain(d.abstract),
    author: d.authors.map((a) =>
      a.name === person.name ? me : { "@type": "Person", name: a.name, url: personHref(a.name), affiliation: a.affiliations.length ? institutions(a.affiliations) : undefined },
    ),
    datePublished: isoDay(d.date),
    dateModified: modified ? modified.toISOString() : isoDay(d.date),
    inLanguage: "en",
    keywords: d.topics.length + d.keywords.length ? [...new Set([...d.topics, ...d.keywords])] : undefined,
    about: d.topics.length ? d.topics.map(topicTerm) : undefined,
    identifier: identifier.length ? identifier : undefined,
    thumbnailUrl: pictures[0],
    isPartOf: partOf(d),
    publisher: publisherOf(d),
    pagination: d.pages,
    pageStart: d.pages?.split("-")[0],
    pageEnd: d.pages?.split("-")[1],
    citation: referencesOf(p.id).length ? referencesOf(p.id).map(refNode) : undefined,
    creativeWorkStatus: d.kind === "preprint" ? "Preprint" : undefined,
    award: d.awardScope === "paper" ? d.award : undefined,
    image: pictures.length ? pictures : undefined,
    encoding: d.pdf && { "@type": "MediaObject", name: `${d.shortTitle ?? d.title} (PDF)`, contentUrl: abs(d.pdf), encodingFormat: "application/pdf" },
    isAccessibleForFree: true,
    sameAs: sameAs.length ? sameAs : undefined,
  };
}

/** A paper's code, when the paper links a repository: source code that cites the paper, so the
 *  repository and the paper are known to belong together. */
export function paperCodeNode(p: CollectionEntry<"publications">): Node | undefined {
  const code = codeLink(p.data.links);
  if (!code) return undefined;
  return {
    "@type": "SoftwareSourceCode",
    "@id": `${paperUrl(p)}#code`,
    name: `${p.data.shortTitle ?? p.data.title}: code`,
    description: `Source code released with the paper "${p.data.title}".`,
    url: code.href,
    codeRepository: code.href,
    citation: { "@id": paperId(p) },
    author: { "@id": personId },
    isAccessibleForFree: true,
  };
}

const known = ["C++", "C", "CUDA", "Python", "JavaScript", "TypeScript", "Rust", "Java", "SQL"];
/** The programming languages among a project's tags, if any. */
const languages = (tags: string[]) => {
  const found = tags.filter((t) => known.includes(t));
  return found.length ? found : undefined;
};

/** A project: source code when it links a repository, else a creative work. */
export function projectNode(p: CollectionEntry<"projects">, image?: string): Node {
  const d = p.data;
  const url = projectUrl(p);
  const code = codeLink(d.links);
  const sameAs = d.links.filter((l) => external(l.href) && l !== code).map((l) => l.href);
  return {
    "@type": code ? "SoftwareSourceCode" : "CreativeWork",
    "@id": projectId(p),
    url,
    mainEntityOfPage: url,
    name: d.title,
    description: d.description,
    dateCreated: isoDay(d.date),
    author: me,
    inLanguage: "en",
    keywords: d.tags.length ? d.tags : undefined,
    codeRepository: code?.href,
    programmingLanguage: code ? languages(d.tags) : undefined,
    image: image && abs(image),
    sameAs: sameAs.length ? sameAs : undefined,
    interactionStatistic: code && d.stars ? { "@type": "InteractionCounter", interactionType: "https://schema.org/LikeAction", userInteractionCount: d.stars } : undefined,
  };
}

export function postNode(p: CollectionEntry<"blog">, image?: string): Node {
  const d = p.data;
  const url = postUrl(p);
  return {
    "@type": "BlogPosting",
    "@id": postId(p),
    url,
    mainEntityOfPage: url,
    headline: d.title,
    description: d.description,
    datePublished: isoDay(d.date),
    dateModified: isoDay(d.updated ?? d.date),
    author: me,
    publisher: { "@id": personId },
    inLanguage: "en",
    keywords: d.tags.length ? d.tags : undefined,
    image: image && abs(image),
    isPartOf: { "@id": websiteId },
  };
}

type Item = { "@type": string; "@id": string; name: string; url: string };
const paperItem = (p: CollectionEntry<"publications">): Item => ({ "@type": "ScholarlyArticle", "@id": paperId(p), name: p.data.title, url: paperUrl(p) });
const projectItem = (p: CollectionEntry<"projects">): Item => ({ "@type": codeLink(p.data.links) ? "SoftwareSourceCode" : "CreativeWork", "@id": projectId(p), name: p.data.title, url: projectUrl(p) });
const postItem = (p: CollectionEntry<"blog">): Item => ({ "@type": "BlogPosting", "@id": postId(p), name: p.data.title, url: postUrl(p) });

/** A list page and the entries on it, in the order it shows them. */
function collectionPage(path: string, name: string, description: string, items: Item[]): Node {
  const url = abs(path);
  return {
    "@type": "CollectionPage",
    "@id": `${url}#page`,
    url,
    name,
    description,
    isPartOf: { "@id": websiteId },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: items.length,
      itemListElement: items.map((item, i) => ({ "@type": "ListItem", position: i + 1, url: item.url, item })),
    },
  };
}

export const papersPage = (pubs: CollectionEntry<"publications">[], description: string) =>
  collectionPage("/publications/", "Publications", description, pubs.map(paperItem));
/** A topic's list of papers, or the list of topics when `items` are topic pages. */
export const topicPage = (path: string, name: string, description: string, pubs: CollectionEntry<"publications">[]) =>
  collectionPage(path, name, description, pubs.map(paperItem));
export const projectsPage = (projects: CollectionEntry<"projects">[], description: string) =>
  collectionPage("/projects/", "Projects", description, projects.map(projectItem));
export const postsPage = (posts: CollectionEntry<"blog">[], description: string) =>
  collectionPage("/blog/", "Blog", description, posts.map(postItem));
