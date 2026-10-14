// Inline math in front matter: $...$, with \$ for a literal dollar sign. Tex.astro renders it;
// a page asks hasMath() whether any text it shows has some, and loads the KaTeX stylesheet only
// then (Base's `math`), since the stylesheet blocks the first paint.
export const MATH = /(?<!\\)\$(.+?)(?<!\\)\$/g;

export const hasMath = (...texts: (string | undefined)[]) => texts.some((t) => t && new RegExp(MATH.source).test(t));
