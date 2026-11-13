// The topics that group publications. A paper lists a few by name in its front matter (`topics`);
// each topic has an index page at /publications/topics/<slug>/ that lists its papers, and the
// tags on a paper page link there. Keep them broad: a topic is a field or a problem a reader
// would search for. Describe the field itself, not the papers listed under it today, so the
// description still holds when a new paper joins. Keep the list short: together the topics
// should read as one line of research, with the main ones first (pages list them in this
// order), and a paper takes at most three.
export interface Topic { name: string; slug: string; description: string }

const topic = (name: string, description: string): Topic => ({
  name,
  slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
  description,
});

export const topics: Topic[] = [
  topic("Sheaf neural networks", "Graph networks that attach a vector space to every node and edge and learn the maps between them, to handle heterophily and oversmoothing."),
  topic("Topological deep learning", "Learning on higher-order domains: simplicial and cell complexes, hypergraphs, and sheaves."),
  topic("Computer vision", "Recognizing, generating, and inspecting images."),
  topic("Metacognition", "Models that monitor and regulate their own processing, as studied in cognitive psychology."),
  topic("Test-time adaptation", "Adapting a deployed model to the data it meets after training, without labels."),
  topic("Anomaly detection", "Finding the rare samples or regions that depart from a model of normal data."),
  topic("Benchmarks", "Datasets, tasks, and protocols for measuring and comparing models."),
];

const byName = new Map(topics.map((t) => [t.name, t]));
export const topicNames = topics.map((t) => t.name);
/** The topic with this name; a paper's front matter is checked against the list. */
export const topicOf = (name: string): Topic => byName.get(name)!;
export const topicPath = (t: Topic) => `/publications/topics/${t.slug}/`;
