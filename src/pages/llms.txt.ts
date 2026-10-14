// The site as a Markdown index for language models (src/lib/llms.ts).
import type { APIRoute } from "astro";
import { llms } from "../lib/llms";

export const GET: APIRoute = async () =>
  new Response(await llms(false), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
