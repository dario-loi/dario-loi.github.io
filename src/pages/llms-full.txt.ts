// llms.txt with every paper's abstract and BibTeX and every project's text (src/lib/llms.ts).
import type { APIRoute } from "astro";
import { llms } from "../lib/llms";

export const GET: APIRoute = async () =>
  new Response(await llms(true), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
