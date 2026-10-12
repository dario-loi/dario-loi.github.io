// The CV: one entry per role or degree, newest first. The Atlas orders its route by `from`.
// Dates are "YYYY-MM"; `to: "now"` marks a current entry. Entries with `draft: true` show only
// under `astro dev` until their facts are confirmed.
export interface CvEntry {
  title: string;
  org: string;
  kind: "Education" | "Research" | "Teaching" | "Work";
  place: string;
  lat: number;
  lon: number;
  from: string;
  to?: string;
  /** One or two plain sentences about what you did. */
  text?: string;
  draft?: boolean;
}

const BOSTON = { place: "Boston, United States", lat: 42.34, lon: -71.09 };
const ROME = { place: "Rome, Italy", lat: 41.9, lon: 12.51 };

const all: CvEntry[] = [
  {
    title: "Ph.D. in Computer Engineering",
    org: "Northeastern University",
    kind: "Education",
    ...BOSTON,
    from: "2026-09",
    to: "now",
  },
  {
    // TODO: confirm the employer, the place, and whether the role has ended.
    title: "Research assistant, Autobench",
    org: "Botscanner",
    kind: "Research",
    ...ROME,
    from: "2025-07",
    text: "Studied the LLM-as-a-judge benchmark Autobench and changed its ranking algorithm to make results more reliable. Modeled the score matrix as a fully connected graph so that graph metrics such as PageRank and RankCentrality could reduce exposure to manipulation.",
    draft: true,
  },
  {
    // TODO: confirm the employer and the place.
    title: "Research assistant, interpretable malware analysis",
    org: "Botscanner",
    kind: "Research",
    ...ROME,
    from: "2024-12",
    to: "2025-05",
    text: "Surveyed interpretable AI for malware detection, then designed and trained representation learning models, with graph neural networks and Transformers, that generate attack graphs and find critical vulnerability sequences in network topologies.",
    draft: true,
  },
  {
    // TODO: confirm the institution.
    title: "Tutor, Computer Architecture and Operating Systems",
    org: "Sapienza University of Rome",
    kind: "Teaching",
    ...ROME,
    from: "2024-05",
    to: "2024-09",
    text: "Weekly tutoring on RISC-V programming, pipelining, memory hierarchies, and operating system fundamentals, with help grading assignments.",
    draft: true,
  },
  {
    title: "M.S. in Computer Science",
    org: "Sapienza University of Rome",
    kind: "Education",
    ...ROME,
    from: "2023-09",
    to: "2025-10",
  },
  {
    title: "B.S. in Applied Computer Science and Artificial Intelligence",
    org: "Sapienza University of Rome",
    kind: "Education",
    ...ROME,
    from: "2020-09",
    to: "2023-07",
    text: "Graduated with full honors.",
  },
];

export const cvEntries = all.filter((e) => import.meta.env.DEV || !e.draft);
