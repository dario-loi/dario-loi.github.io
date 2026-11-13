// Satteri hast plugin: in a paper's MDX body, each citation listed in the paper's
// src/content/publications/<id>.refs.json ("Bodnar et al., 2022", "Pei et al. (2020)") becomes a
// link to its entry in the page's References (#ref-<key>). Rendered at build time, so crawlers and
// readers without script see the links. Text already inside a link, code, or a heading is left alone.
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const SKIP = new Set(["a", "code", "pre", "h1", "h2", "h3", "h4", "h5", "h6"]);
const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export function plyCiteLinks() {
  return (ctx) => {
    if (ctx.sourceFormat !== "mdx" || !ctx.fileURL) return null;
    const path = fileURLToPath(ctx.fileURL);
    if (!/[\\/]content[\\/]publications[\\/][^\\/]+\.mdx$/.test(path)) return null;
    const refsPath = path.replace(/\.mdx$/, ".refs.json");
    if (!existsSync(refsPath)) return null;
    const keyOf = new Map();
    for (const r of JSON.parse(readFileSync(refsPath, "utf8"))) for (const c of r.cite ?? []) keyOf.set(c, r.key);
    if (keyOf.size === 0) return null;
    // Longest first, so "Barbero et al., 2022a" wins over a shorter string it contains.
    const pattern = new RegExp([...keyOf.keys()].sort((a, b) => b.length - a.length).map(escape).join("|"), "g");
    return {
      name: "ply-cite-links",
      text(node, v) {
        const value = node.value;
        pattern.lastIndex = 0;
        if (!pattern.test(value)) return;
        for (let p = v.parent(node); p && p.type === "element"; p = p.type === "element" ? v.parent(p) : null) {
          if (SKIP.has(p.tagName)) return;
        }
        // test() moved lastIndex past the first match, and matchAll would start from there.
        pattern.lastIndex = 0;
        const parts = [];
        let last = 0;
        for (const m of value.matchAll(pattern)) {
          if (m.index > last) parts.push({ type: "text", value: value.slice(last, m.index) });
          parts.push({ type: "element", tagName: "a", properties: { href: `#ref-${keyOf.get(m[0])}`, className: ["cite-ref"] }, children: [{ type: "text", value: m[0] }] });
          last = m.index + m[0].length;
        }
        if (last < value.length) parts.push({ type: "text", value: value.slice(last) });
        v.replaceNode(node, parts);
      },
    };
  };
}
