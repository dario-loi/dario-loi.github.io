// schema.org records for search engines, scrapers, and language models, built from the same
// collections the pages are. Seo (Polytope) writes each one in its own JSON-LD script and adds
// the @context. Records point at one another by @id, so the person, the site, and every paper,
// project, and post are one graph: a paper's author is the person on the home page, not a name
// that happens to match.
import type { CollectionEntry } from "astro:content";
import { isoDay } from "./content";
import { person, siteMeta } from "../site";

type Node = Record<string, unknown>;

const site = import.meta.env.SITE;
const abs = (path: string) => new URL(path, site).href;
const home = abs("/");
export const personId = `${home}#person`;
export const websiteId = `${home}#website`;
const me = { "@type": "Person", "@id": personId, name: person.name };
const external = (href: string) => /^https?:\/\//.test(href);

const northeastern = { "@type": "CollegeOrUniversity", name: person.affiliation, url: "https://www.northeastern.edu/" };

/** The site owner, with the lab, the alma mater, and the profiles that identify the same person
 *  elsewhere. */
export const personNode = (): Node => ({
  ...me,
  url: home,
  image: abs(person.photo),
  description: person.lede,
  jobTitle: person.role,
  affiliation: northeastern,
  memberOf: { "@type": "ResearchOrganization", name: person.lab.name, url: person.lab.href, parentOrganization: northeastern },
  alumniOf: { "@type": "CollegeOrUniversity", name: person.alumniOf },
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
  author: { "@id": personId },
});

/** The home page is the person's profile. */
export const profilePageNode = (): Node => ({
  "@type": "ProfilePage",
  "@id": `${home}#profile`,
  url: home,
  name: `${person.name}, ${person.role}`,
  mainEntity: { "@id": personId },
  isPartOf: { "@id": websiteId },
});

const paperUrl = (p: CollectionEntry<"publications">) => abs(`/publications/${p.id}/`);
const projectUrl = (p: CollectionEntry<"projects">) => abs(`/projects/${p.id}/`);
const postUrl = (p: CollectionEntry<"blog">) => abs(`/blog/${p.id}/`);
const paperId = (p: CollectionEntry<"publications">) => `${paperUrl(p)}#article`;
const projectId = (p: CollectionEntry<"projects">) => `${projectUrl(p)}#work`;
const postId = (p: CollectionEntry<"blog">) => `${postUrl(p)}#post`;
const codeLink = (links: { href: string; icon?: string }[]) => links.find((l) => l.icon === "code" && external(l.href));

/** A paper, with its abstract, venue, PDF, and the records of the same paper elsewhere.
 *  `image` is the page's preview picture. */
export function paperNode(p: CollectionEntry<"publications">, image?: string): Node {
  const d = p.data;
  const url = paperUrl(p);
  const sameAs = [
    d.arxiv && `https://arxiv.org/abs/${d.arxiv}`,
    d.doi && `https://doi.org/${d.doi}`,
    ...d.links.filter((l) => l.icon === "paper" && external(l.href)).map((l) => l.href),
  ].filter(Boolean);
  return {
    "@type": "ScholarlyArticle",
    "@id": paperId(p),
    url,
    mainEntityOfPage: url,
    headline: d.title,
    name: d.title,
    alternativeHeadline: d.shortTitle,
    description: d.description ?? d.tldr,
    abstract: d.abstract,
    author: d.authors.map((a) => (a.name === person.name ? me : { "@type": "Person", name: a.name })),
    datePublished: isoDay(d.date),
    inLanguage: "en",
    keywords: d.keywords.length ? d.keywords : undefined,
    isPartOf: d.kind === "preprint" ? undefined : { "@type": d.kind === "journal" ? "Periodical" : "CreativeWork", name: d.venueFull ?? d.venue },
    creativeWorkStatus: d.kind === "preprint" ? "Preprint" : undefined,
    award: d.award,
    image: image && abs(image),
    encoding: d.pdf && { "@type": "MediaObject", contentUrl: abs(d.pdf), encodingFormat: "application/pdf" },
    isAccessibleForFree: true,
    sameAs: sameAs.length ? sameAs : undefined,
  };
}

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
    image: image && abs(image),
    sameAs: sameAs.length ? sameAs : undefined,
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
export const projectsPage = (projects: CollectionEntry<"projects">[], description: string) =>
  collectionPage("/projects/", "Projects", description, projects.map(projectItem));
export const postsPage = (posts: CollectionEntry<"blog">[], description: string) =>
  collectionPage("/blog/", "Blog", description, posts.map(postItem));
