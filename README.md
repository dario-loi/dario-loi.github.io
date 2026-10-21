# dario-loi.github.io

Personal academic site of Dario Loi, built with [Astro](https://astro.build) and
[Polytope](https://dario-loi.github.io/polytope/), and deployed to GitHub Pages.

## Develop

```sh
npm install
npm run dev       # http://localhost:4321, drafts included
npm run build     # static site in dist/, drafts left out
npm run check     # type-check Astro and TypeScript
npm run design:check   # fails if DESIGN.md is older than the installed Polytope
```

Node 22.12 or newer.

A production build leaves drafts out and rewrites `.astro/` without them. A dev server left
running during `npm run build` then fails on draft pages until you save a draft or restart the
server.

## Add content

Everything a visitor reads is a file. Adding one needs no layout changes.

| What | Where | Notes |
|---|---|---|
| Blog post | `src/content/blog/<slug>.md` or `.mdx` | `title`, `description`, `date`, optional `tags`, `cover`. `writing-on-this-site.mdx` shows every component a post can use. |
| Publication | `src/content/publications/<slug>.mdx` | Authors, venue, abstract, links, and BibTeX in the front matter; `selected: true` puts it on the home page. Google Scholar meta tags are written from it. |
| Project | `src/content/projects/<slug>.md` | `featured: true` puts it on the home page. |
| CV entry | `src/data/cv.ts` | One object per role or degree, with coordinates for the Atlas globe. |
| CV PDF | `public/dario-loi-cv.pdf` | When the file exists, CV buttons download it; until then they open the CV page. |
| Name, links, email | `src/site.ts` | |

Any entry with `draft: true` renders under `npm run dev` with a Draft label and is left out of
the production build, the sitemap, and the RSS feed. Without a `cover` image, a card draws a
Vietoris-Rips complex seeded from the file name, so every entry gets its own figure.

## Paper PDFs

The site hosts a copy of each paper's PDF at `public/publications/<slug>/<slug>.pdf`, since
Google Scholar lists a page as a version of a paper only when the PDF is on the same site. Each
copy has a record, `src/content/publications/<slug>.pdf.json`, naming its source and which version
of it was copied.

```sh
npm run papers:check                        # which sources have a newer version
npm run papers:sync -- <slug>               # copy the newer version in, compressed
npm run papers:sync -- <slug> --from <file> # the same from a PDF downloaded by hand
npm run papers:sync -- <slug> --source <url>  # a new paper's first copy
```

A sync compresses with Ghostscript at full resolution and the highest JPEG quality, then
re-encodes large palette images with `scripts/pdf-palette.py`, which needs `pikepdf` and `Pillow`
(`python3 -m venv .venv && .venv/bin/pip install pikepdf pillow`). The Paper sources workflow
(`.github/workflows/papers.yml`) runs the check every Monday and opens an issue when a source
changes. It does not commit anything.

## Search engines and language models

Every page carries schema.org records built from the collections (`src/lib/schema.ts`): the
person, the site, each paper, project, and post, and each list page. They point at one another
by `@id`, so a paper's author is the person on the home page. `/llms.txt` and `/llms-full.txt`
(`src/lib/llms.ts`) give the same content as Markdown, and the full version adds every abstract
and BibTeX entry.

After each deploy, the workflow sends the pages that were added, changed, or dropped to
[IndexNow](https://www.indexnow.org), which passes them to Bing, Yandex, Seznam, Naver, and Yep
(`scripts/indexnow.mjs`; the key is `public/<key>.txt`). A manual run of the deploy workflow with
"all" checked sends every page. Google does not use IndexNow; Search Console covers it.

Each list has an RSS feed once it has an entry: `/publications/rss.xml` (with abstracts, and
the hosted PDF as each item's enclosure), `/projects/rss.xml`, and `/rss.xml` for the blog. Pages
advertise them in the head and the footer.

## Analytics

[Umami Cloud](https://umami.is), cookieless: no cookies, nothing stored on the visitor's device,
Do Not Track honored, so no consent banner. The website id lives in `src/site.ts` (it is public;
every page carries it). The repository variable `UMAMI_WEBSITE_ID` (Settings > Secrets and
variables > Actions > Variables) overrides it at build time. The script runs only on
`dario-loi.github.io`, never on localhost or previews.

Custom events, each with `page`, `source` (the referrer: `direct`, a host name, or
`internal:/path`), any `utm_*` parameters, and `placement` (where on the page the link sits):

| Event | Fired by |
|---|---|
| `cv-download` | A link to the CV PDF |
| `cv-view` | A link to the CV page (top bar, menu, home) |
| `email` | An email link (the address is assembled in the browser on use, never written in the HTML) |
| `profile-link` | Google Scholar, GitHub, LinkedIn, ORCID links (`label` names which) |
| `paper-link` | OpenReview, PDF, arXiv, Code on a paper page (`label`) |
| `bibtex-copy` | The Copy button on a paper's BibTeX (`label` is the paper) |
| `project-link` | Links on a project page (`label`) |
| `open-post`, `open-publication`, `open-project` | Following a card to its page (`label` is the entry) |

In Umami, open Events, pick an event, and break it down by any of these properties.

## Design system

The look comes entirely from `@dario-loi/polytope`. `DESIGN.md` and `.impeccable/design.json`
are copies of Polytope's; refresh them after upgrading with `npx @dario-loi/polytope`.
`PRODUCT.md` records who the site is for and what it must do.

## License

Code under the [MIT License](LICENSE.md). Polytope is Apache 2.0.
