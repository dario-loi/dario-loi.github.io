// Home pages of people the site names: co-authors and collaborators. Wherever a page prints one
// of these names (author lists, CV entries, structured data), it links here.
export const peopleLinks: Record<string, string> = {
  "Gabriele Onorato": "https://www.gabrieleonorato.com/",
  "Iacopo Masi": "https://omnai.di.uniroma1.it/author/iacopo-masi/",
  "Danilo Avola": "https://research.uniroma1.it/user/3362",
};

export const personHref = (name: string): string | undefined => peopleLinks[name];

const escape = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** A link's host name without "www.", the label every outbound event carries. */
export const hostOf = (href: string) => new URL(href).hostname.replace(/^www\./, "");

/** Plain text as HTML, with each known name linked to that person's page. Each link counts as an
    outbound click, labeled with the host and, when given, the placement on the page. */
export function linkPeople(text: string, placement?: string): string {
  let html = escape(text);
  const where = placement ? ` data-track-placement="${escape(placement)}"` : "";
  for (const [name, href] of Object.entries(peopleLinks)) html = html.split(escape(name)).join(`<a href="${href}" data-track="outbound" data-track-label="${hostOf(href)}"${where}>${escape(name)}</a>`);
  return html;
}
