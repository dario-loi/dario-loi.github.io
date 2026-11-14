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
  /** The program or event page, linked under the entry. */
  href?: string;
  draft?: boolean;
}

/** One line of the Honors and awards section. */
export interface Award { text: string; year: string }
/** One line of the Service section: a role with its organization and years, or the reviewed venues. */
export interface ServiceRole { role: string; org: string; years: string }
/** One group of the Skills section. */
export interface SkillGroup { name: string; items: string[] }

const BOSTON = { place: "Boston, United States", lat: 42.34, lon: -71.09 };
const ARLINGTON = { place: "Arlington, United States", lat: 38.88, lon: -77.1 };
const ROME = { place: "Rome, Italy", lat: 41.9, lon: 12.51 };
const PISA = { place: "Pisa, Italy", lat: 43.72, lon: 10.4 };
const XIAN = { place: "Xi'an, China", lat: 34.25, lon: 108.98 };
const RIO = { place: "Rio de Janeiro, Brazil", lat: -22.91, lon: -43.17 };
const TRONDHEIM = { place: "Trondheim, Norway", lat: 63.43, lon: 10.4 };
const OXFORD = { place: "Oxford, United Kingdom", lat: 51.75, lon: -1.26 };
const ROCCELLA = { place: "Roccella Ionica, Italy", lat: 38.32, lon: 16.4 };

const all: CvEntry[] = [
  {
    title: "METACOG-26",
    org: "AAAI Fall Symposium on Artificial Metacognition",
    kind: "Conference",
    ...ARLINGTON,
    from: "2026-11",
    text: "Presented and won Top 3 of 27 papers: A Metacognitive Framework for Test-Time Adaptation.",
  },
  {
    title: "Ph.D. in Computer Engineering",
    href: "https://ece.northeastern.edu/academics/graduate-studies/phd-cmpe/",
    org: "Northeastern University",
    kind: "Education",
    ...BOSTON,
    from: "2026-09",
    to: "now",
  },
  {
    title: "TDL Challenge 2026",
    org: "Topological Deep Learning Challenge at TAG-DS 2026",
    kind: "Conference",
    ...BOSTON,
    from: "2026-08",
    text: "1st of 37 in Track 1 (GNNs), and the Excellent portfolio honorable mention, with Gabriele Onorato.",
  },
  {
    title: "FUSION 2026",
    org: "International Conference on Information Fusion",
    kind: "Conference",
    ...TRONDHEIM,
    from: "2026-06",
    text: "Presented Decision-Driven Credal Information Fusion on behalf of its authors.",
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
    text: "Prototyped an agentic LLM for Simulink-style power plant control, scaling its reliable output from 5 to 100+ blocks. Used vLLM, LangChain, and LangGraph to orchestrate the agentic pipeline with structured outputs and a custom DSL that keeps outputs correct and valid.",
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
    href: "https://www.oxfordml.school/",
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
    text: "One of 10 students selected across Sapienza's Faculty of Information Engineering, Informatics, and Statistics.",
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
    title: "Teaching assistant, Computer Architecture I and II",
    org: "Sapienza University of Rome",
    kind: "Experience",
    ...ROME,
    from: "2024-05",
    to: "2024-09",
    text: "Taught both courses in the B.S. in Computer Science: logic gates and circuits, multiplexers and registers, counters, RISC-V programming, pipeline and cache behavior, and the design of custom instructions. Ran exams, homework, practice sessions, and one-on-one sessions with students.",
  },
  {
    title: "Computer vision software engineer",
    org: "Sapienza Flight Team",
    kind: "Experience",
    ...ROME,
    from: "2023-10",
    to: "2024-06",
    text: "Built real-time YOLOv8 computer vision models that detect payload drop sites from a drone in flight, for the student team's entry in the SUAS 2024 unmanned aircraft competition in the United States.",
  },
  {
    title: "M.S. in Computer Science",
    href: "https://corsidilaurea.uniroma1.it/en/course/33508",
    org: "Sapienza University of Rome",
    kind: "Education",
    ...ROME,
    from: "2023-09",
    to: "2025-10",
    text: "GPA 29.8/30 (3.98/4.0), 110/110 cum laude.",
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
    href: "https://corsidilaurea.uniroma1.it/en/course/33502",
    org: "Sapienza University of Rome",
    kind: "Education",
    ...ROME,
    from: "2020-09",
    to: "2023-07",
    text: "GPA 28.4/30 (3.79/4.0), 110/110 cum laude.",
  },
];

export const awards: Award[] = [
  { text: "1st of 37 in Track 1 and Excellent portfolio honorable mention, Topological Deep Learning Challenge", year: "2026" },
  { text: "Top 3 of 27 papers, AAAI Fall Symposium on Artificial Metacognition (METACOG-26)", year: "2026" },
  { text: "Honors Program, Sapienza University of Rome: B.S. (one of eight selected) and M.S.", year: "2022 to 2025" },
];

/** Venues he reviews for; no years are recorded. */
export const reviewing: string[] = ["ICLR", "TMLR", "KDD", "ECML-PKDD", "WWW", "INFOCOM", "MILCOM", "AAAI", "CIKM", "TKDD"];

export const service: { reviewer: string[]; roles: ServiceRole[] } = {
  reviewer: reviewing,
  roles: [
    { role: "Department student representative", org: "Computer Science Department, Sapienza University of Rome", years: "2020 to 2023" },
    { role: "Faculty student representative", org: "Sapienza University of Rome", years: "2022 to 2025" },
  ],
};

export const skills: SkillGroup[] = [
  { name: "Programming", items: ["Python", "C++", "C", "CUDA", "Java", "SQL", "Git", "Linux", "Docker", "SLURM", "Weights & Biases"] },
  { name: "Machine learning", items: ["PyTorch", "PyTorch Geometric", "TopoX", "Hugging Face", "LangGraph", "LangChain", "vLLM"] },
];

/** A stable anchor for an entry on the CV page: the slug of its title and its start date. */
export const cvAnchor = (e: Pick<CvEntry, "title" | "from">) =>
  `${e.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}-${e.from}`;

export const cvEntries = all.filter((e) => import.meta.env.DEV || !e.draft);
