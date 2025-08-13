export const underlineMark = {
  parseDOM: [
    { tag: "u" },
    { style: "text-decoration=underline" }
  ],
  toDOM() {
    return ["u", 0] as const;
  }
}; 