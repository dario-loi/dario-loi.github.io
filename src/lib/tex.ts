// Inline math in front matter: $...$, with \$ for a literal dollar sign. Tex.astro renders it;
// a page asks hasMath() whether any text it shows has some, and loads the KaTeX stylesheet only
// then (Base's `math`), since the stylesheet blocks the first paint.
export const MATH = /(?<!\\)\$(.+?)(?<!\\)\$/g;

// *italic*, **bold**, and ***both*** in front matter prose, as in Markdown. Tex.astro renders them
// as <em> and <strong>; text that leaves the page as plain text (search descriptions, schema.org
// records, RSS descriptions) drops the asterisks. A marker hugs its words, so a lone * stays put.
const BOTH = /\*\*\*(?=\S)(.+?)(?<=\S)\*\*\*/g;
const BOLD = /\*\*(?=\S)(.+?)(?<=\S)\*\*/g;
const ITALIC = /(?<![*\\\w])\*(?![\s*])(.+?)(?<![\s*\\])\*(?![*\w])/g;
export const emphasis = (s: string) =>
  s.replace(BOTH, "<em><strong>$1</strong></em>").replace(BOLD, "<strong>$1</strong>").replace(ITALIC, "<em>$1</em>");
export const plain = (s: string) => s.replace(BOTH, "$1").replace(BOLD, "$1").replace(ITALIC, "$1");

export const hasMath = (...texts: (string | undefined)[]) => texts.some((t) => t && new RegExp(MATH.source).test(t));
