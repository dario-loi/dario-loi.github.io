// The quick links of site search: the topics a paper lists, each of which has a page. The top
// bar's field and the results page both show them before a query and when nothing matches.
import { entries } from "./content";
import { topicPath, topics } from "../data/topics";

export async function topicLinks() {
  const pubs = await entries("publications");
  return topics.filter((t) => pubs.some((p) => p.data.topics.includes(t.name))).map((t) => ({ label: t.name, href: topicPath(t) }));
}
