// Each paper as an RIS record, /publications/<id>/<id>.ris, for Zotero, EndNote, and Mendeley.
// Built from the paper's front matter by src/lib/cite.ts.
import type { APIRoute, GetStaticPaths } from "astro";
import { entries } from "../../../lib/content";
import { risFile } from "../../../lib/cite";

export const getStaticPaths = (async () => (await entries("publications")).map((pub) => ({ params: { id: pub.id }, props: { pub } }))) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props, site }) =>
  new Response(risFile(props.pub, (site ?? new URL("https://dario-loi.github.io")).origin), { headers: { "Content-Type": "application/x-research-info-systems; charset=utf-8" } });
