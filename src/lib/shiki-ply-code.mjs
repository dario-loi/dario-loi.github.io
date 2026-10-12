// Shiki transformer that frames every fenced code block in Markdown and MDX the way
// Polytope's <Code> component does: a black .ply-code panel with a bar naming the language
// and a copy button (wired by @dario-loi/polytope/js/copy.js).
export function plyCodeFrame() {
  return {
    name: "ply-code-frame",
    root(root) {
      const lang = this.options.lang || "txt";
      const pre = root.children.find((n) => n.type === "element" && n.tagName === "pre");
      if (!pre) return;
      const first = (this.source ?? "").trim().split("\n")[0].trim();
      const label = `Copy ${lang} code: ${first.length > 48 ? `${first.slice(0, 45)}...` : first}`;
      const bar = {
        type: "element",
        tagName: "div",
        properties: { className: ["ply-code__bar"] },
        children: [
          { type: "element", tagName: "span", properties: { className: ["ply-code__lang"] }, children: [{ type: "text", value: lang }] },
          {
            type: "element",
            tagName: "button",
            properties: { className: ["ply-code__copy"], type: "button", dataPlyCopy: "", ariaLabel: label },
            children: [{ type: "text", value: "Copy" }],
          },
        ],
      };
      root.children = [{ type: "element", tagName: "div", properties: { className: ["ply-code"] }, children: [bar, pre] }];
    },
  };
}
