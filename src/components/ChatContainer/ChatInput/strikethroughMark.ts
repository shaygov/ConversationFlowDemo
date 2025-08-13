export const strikethroughMark = {
  parseDOM: [
    { tag: "s" },
    { tag: "del" },
    { style: "text-decoration=line-through" }
  ],
  toDOM() {
    return ["s", 0] as const;
  }
}; 