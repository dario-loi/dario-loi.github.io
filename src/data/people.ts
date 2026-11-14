// Home pages of people the site names: co-authors and collaborators. Wherever a page prints one
// of these names (author lists, CV entries, structured data), it links here.
export const peopleLinks: Record<string, string> = {
  "Gabriele Onorato": "https://www.gabrieleonorato.com/",
};

export const personHref = (name: string): string | undefined => peopleLinks[name];

const escape = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Plain text as HTML, with each known name linked to that person's page. */
export function linkPeople(text: string): string {
  let html = escape(text);
  for (const [name, href] of Object.entries(peopleLinks)) html = html.split(escape(name)).join(`<a href="${href}">${escape(name)}</a>`);
  return html;
}
