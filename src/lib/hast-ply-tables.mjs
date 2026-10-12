// Satteri hast plugin: Markdown tables become Polytope tables, wrapped so a wide table
// scrolls inside its frame (with polytope js/scroll.js cues) instead of widening the page.
export function plyTables() {
  return {
    name: "ply-tables",
    element: {
      filter: ["table"],
      visit(node, ctx) {
        ctx.setProperty(node, "className", ["ply-table"]);
        ctx.wrapNode(node, { raw: '<div class="ply-table-wrap"></div>' });
      },
    },
  };
}
