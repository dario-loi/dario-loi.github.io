// Long author lists (a challenge report has dozens of names) fold the same way everywhere: past
// `over` names, the first `first`, mine, and the last author (usually the PI), with a gap mark
// where names are left out. Lists and cards show the fold as text; a paper page folds its
// header with a button for the whole list (its own script).
export const AUTHOR_FOLD = { over: 12, first: 6 };

/** Whether the name at index `i` of `count` stays in a folded list, with mine at index `me`. */
export const keptWhenFolded = (count: number, me: number) => (i: number) =>
  i < AUTHOR_FOLD.first || i === me || i === count - 1;

/** "A, B, C, D, E, F, ..., Dario Loi, ..., Nina Miolane" as list items; short lists come back
 *  whole. */
export function foldAuthors(authors: string[], me: string) {
  if (authors.length <= AUTHOR_FOLD.over) return authors;
  const kept = keptWhenFolded(authors.length, authors.indexOf(me));
  return authors.flatMap((a, i) => (kept(i) ? [a] : kept(i - 1) ? ["..."] : []));
}
