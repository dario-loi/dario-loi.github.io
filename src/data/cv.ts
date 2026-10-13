// The CV: one entry per role or degree, newest first. The Atlas orders its route by `from`.
// Dates are "YYYY-MM"; `to: "now"` marks a current entry. Entries with `draft: true` show only
// under `astro dev` until their facts are confirmed.
export interface CvEntry {
  title: string;
  org: string;
  /** Three kinds at most, so the filter above the list stays one short row. */
  kind: "Education" | "Experience" | "Conference";
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
const PISA = { place: "Pisa, Italy", lat: 43.72, lon: 10.4 };
const XIAN = { place: "Xi'an, China", lat: 34.25, lon: 108.98 };
const RIO = { place: "Rio de Janeiro, Brazil", lat: -22.91, lon: -43.17 };
const TRONDHEIM = { place: "Trondheim, Norway", lat: 63.43, lon: 10.4 };
const OXFORD = { place: "Oxford, United Kingdom", lat: 51.75, lon: -1.26 };
const ROCCELLA = { place: "Roccella Ionica, Italy", lat: 38.32, lon: 16.4 };

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
    title: "FUSION 2026",
    org: "International Conference on Information Fusion",
    kind: "Conference",
    ...TRONDHEIM,
    from: "2026-06",
  },
  {
    title: "ICLR 2026",
    org: "International Conference on Learning Representations",
    kind: "Conference",
    ...RIO,
    from: "2026-04",
    text: "Poster: Implicit Inversion turns CLIP into a Decoder.",
  },
  {
    title: "Research intern",
    org: "Evidence Srl",
    kind: "Experience",
    ...PISA,
    from: "2025-12",
    to: "2026-06",
  },
  {
    title: "ROCKIN' AI 2.0",
    org: "Roccella Conference on Inference and AI",
    kind: "Conference",
    ...ROCCELLA,
    from: "2025-09",
  },
  {
    title: "Summer school, Representation Learning and Generative AI",
    org: "Oxford Machine Learning Summer School (OxML)",
    kind: "Education",
    ...OXFORD,
    from: "2025-08",
  },
  {
    title: "Summer camp, Information Technology",
    org: "Xi'an Jiaotong University",
    kind: "Education",
    ...XIAN,
    from: "2025-07",
    to: "2025-08",
  },
  {
    title: "Honors Program, M.S.",
    org: "Sapienza University of Rome",
    kind: "Experience",
    ...ROME,
    from: "2025-01",
    to: "2025-10",
    text: "Honors Program research with Prof. Iacopo Masi.",
  },
  {
    title: "Teaching assistant, Computer Architecture and Operating Systems",
    org: "Sapienza University of Rome",
    kind: "Experience",
    ...ROME,
    from: "2024-05",
    to: "2024-09",
    text: "Weekly tutoring on RISC-V programming, pipelining, memory hierarchies, and operating system fundamentals, with help grading assignments.",
  },
  {
    title: "Computer vision software engineer",
    org: "Sapienza Flight Team",
    kind: "Experience",
    ...ROME,
    from: "2023-10",
    to: "2024-06",
    text: "Built computer vision models that detect payload drop sites in real time from a drone in flight, for the student team's entry in the SUAS 2024 unmanned aircraft competition in the United States.",
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
    title: "Honors Program, B.S.",
    org: "Sapienza University of Rome",
    kind: "Experience",
    ...ROME,
    from: "2022-03",
    to: "2023-07",
    text: "One of eight students selected for Sapienza's honors program (Percorso d'Eccellenza). Worked on AI methods for motion video enhancement, supervised by Prof. Danilo Avola.",
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
