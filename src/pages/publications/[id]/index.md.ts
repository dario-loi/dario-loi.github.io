// Each paper as a clean Markdown file, /publications/<id>/index.md: its title, authors, venue, links,
// abstract, writeup, and BibTeX, for language-model tools that read a paper's page. The paper's HTML
// page links to it (rel="alternate"), and llms.txt lists it. Built by src/lib/llms.ts.
import type { APIRoute, GetStaticPaths } from "astro";
import { entries } from "../../../lib/content";
import { paperDocument } from "../../../lib/llms";

export const getStaticPaths = (async () => (await entries("publications")).map((pub) => ({ params: { id: pub.id }, props: { pub } }))) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) =>
  new Response(paperDocument(props.pub), { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
