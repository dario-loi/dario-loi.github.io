// Facts about the person and the site, in one place. Pages read from here; nothing else
// hard-codes a name, an address, or a profile link.
import { existsSync } from "node:fs";
import { join } from "node:path";

export const person = {
  name: "Dario Loi",
  role: "Ph.D. student in Computer Engineering",
  affiliation: "Northeastern University",
  city: "Boston",
  lab: { name: "Mentis Laboratory", href: "https://mentis.info/" },
  /** Research areas, as the lab's team page lists them, for search engines. */
  topics: ["Machine learning", "Uncertainty quantification", "Geometric deep learning"],
  alumniOf: "Sapienza University of Rome",
  /** A square headshot in public/, for search engines; the pages do not show it. */
  photo: "/dario-loi.jpg",
  /** The one-line description under the name, in search results, and in link previews. */
  lede: "Ph.D. student in Computer Engineering at Northeastern University, working on machine learning.",
  /** The address is split so it never appears whole in the HTML; js builds the mailto on use. */
  email: { user: "loi.d", domain: "northeastern.edu" },
  profiles: {
    scholar: "https://scholar.google.com/citations?user=r0Ty-c8AAAAJ",
    github: "https://github.com/dario-loi",
    linkedin: "https://www.linkedin.com/in/dario-loi-5182531b1",
    openreview: "https://openreview.net/profile?id=~Dario_Loi1",
    orcid: "https://orcid.org/0009-0006-3753-5668",
  },
};

export const siteMeta = {
  title: "Dario Loi",
  description: `${person.name}, ${person.lede}`,
  repo: "https://github.com/dario-loi/dario-loi.github.io",
  polytope: "https://dario-loi.github.io/polytope/",
};

// The CV PDF lives at public/<file>. Until it exists, CV buttons open the CV page instead of a
// download, so no button on the site points at a missing file.
const cvFile = "dario-loi-cv.pdf";
export const cv = {
  page: "/cv/",
  pdf: existsSync(join(process.cwd(), "public", cvFile)) ? `/${cvFile}` : undefined,
};

// Umami Cloud, cookieless. The website id is public (it ships in every page); a build can
// override it with PUBLIC_UMAMI_WEBSITE_ID, and the script only ever runs on the domain below.
export const analytics = {
  websiteId: (import.meta.env.PUBLIC_UMAMI_WEBSITE_ID as string | undefined) || "1158556e-ddfc-4ca8-8640-44e08ebca4ad",
  src: "https://cloud.umami.is/script.js",
  domains: "dario-loi.github.io",
};
