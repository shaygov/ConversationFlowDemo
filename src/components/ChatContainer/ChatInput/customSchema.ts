import { Schema } from "prosemirror-model";
import { schema as basicSchema } from "prosemirror-schema-basic";
import { underlineMark } from "./underlineMark";
import { strikethroughMark } from "./strikethroughMark";
import { addListNodes } from "prosemirror-schema-list";

let marks = basicSchema.spec.marks.addToEnd("underline", underlineMark);
marks = marks.addToEnd("strikethrough", strikethroughMark);

const nodes = addListNodes(basicSchema.spec.nodes, "paragraph block*", "block")
  .update("code_block", Object.assign({}, basicSchema.spec.nodes.get("code_block"), {
    attrs: { language: { default: "plaintext" } },
    toDOM(node: any) {
      return ["pre", ["code", { "data-language": node.attrs.language }, 0]];
    },
    parseDOM: [{
      tag: "pre",
      getAttrs(dom: any) {
        const code = dom.querySelector && dom.querySelector("code");
        return { language: code ? code.getAttribute("data-language") || "plaintext" : "plaintext" };
      }
    }]
  }));

export const customSchema = new Schema({
  nodes,
  marks
}); 