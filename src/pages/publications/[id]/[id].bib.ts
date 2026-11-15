// Each paper's BibTeX entry as a download, /publications/<id>/<id>.bib, next to its PDF. It is the
// same entry the page shows in its Cite section.
import type { APIRoute, GetStaticPaths } from "astro";
import { entries } from "../../../lib/content";
import { bibtexFile } from "../../../lib/cite";

export const getStaticPaths = (async () => (await entries("publications")).map((pub) => ({ params: { id: pub.id }, props: { pub } }))) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) =>
  new Response(bibtexFile(props.pub), { headers: { "Content-Type": "application/x-bibtex; charset=utf-8" } });
