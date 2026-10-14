// Each paper's square picture, /publications/<id>/square.jpg: its preview picture (the cover, else
// the key figure) whole, on an exhibit panel, as the cards hang it. Search results show a page's
// picture as a square and crop a wide one; this one they show whole. The picture's own frame or
// margin is trimmed first, so it fills the panel as far as its shape allows. og:image stays the
// wide preview for link cards.
import type { APIRoute, GetStaticPaths } from "astro";
import sharp from "sharp";
import { entries, squareSource } from "../../../lib/content";

const SIDE = 1200;
const INSET = 72;
const PANEL = "#141414";

export const getStaticPaths = (async () =>
  (await entries("publications"))
    .map((p) => ({ params: { id: p.id }, props: { file: squareSource(p.data.cover ?? p.data.figure) } }))
    .filter((p) => p.props.file)) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const fig = await sharp(props.file as string)
    .flatten({ background: PANEL })
    .trim({ threshold: 12 })
    .resize(SIDE - 2 * INSET, SIDE - 2 * INSET, { fit: "inside", withoutEnlargement: true })
    .toBuffer();
  const jpeg = await sharp({ create: { width: SIDE, height: SIDE, channels: 3, background: PANEL } })
    .composite([{ input: fig, gravity: "centre" }])
    .jpeg({ quality: 86, mozjpeg: true })
    .toBuffer();
  return new Response(new Uint8Array(jpeg), { headers: { "Content-Type": "image/jpeg" } });
};
