import Theme from "@vars/Theme";

const semantic_colors = Theme["semantic-colors"];

export enum GrayColors {
  "G-0" = parseInt(semantic_colors.greyscale["$G-0"]),
  "G-0-5" = parseInt(semantic_colors.greyscale["$G-0-5"]),
  "G-1" = parseInt(semantic_colors.greyscale["$G-1"]),
  "G-1-5" = parseInt(semantic_colors.greyscale["$G-1-5"]),
  "G-2" = parseInt(semantic_colors.greyscale["$G-2"]),
  "G-3" = parseInt(semantic_colors.greyscale["$G-3"]),
  "G-4" = parseInt(semantic_colors.greyscale["$G-4"]),
  "G-5" = parseInt(semantic_colors.greyscale["$G-5"]),
  "G-6" = parseInt(semantic_colors.greyscale["$G-6"]),
  "G-7" = parseInt(semantic_colors.greyscale["$G-7"]),
  "G-8" = parseInt(semantic_colors.greyscale["$G-8"]),
}

export enum Colors {
  // === Base === //
  "b-dark-blue" = parseInt(semantic_colors.base["b-dark-blue"]),
  "b-light-blue" = parseInt(semantic_colors.base["b-light-blue"]),
  "b-green" = parseInt(semantic_colors.base["b-green"]),
  "b-red" = parseInt(semantic_colors.base["b-red"]),
  "b-orange" = parseInt(semantic_colors.base["b-orange"]),
  "b-yellow" = parseInt(semantic_colors.base["b-yellow"]),
  "b-purple" = parseInt(semantic_colors.base["b-purple"]),
  "b-pink" = parseInt(semantic_colors.base["b-pink"]),
  "b-teal" = parseInt(semantic_colors.base["b-teal"]),
  "b-grey" = parseInt(semantic_colors.base["b-grey"]),
}

// export enum TestColors {
//   Red = 'red',
//   Green = 'green',
//   Blue = 'blue',
//   Yellow = 'yellow',
//   Purple = 'purple',
// }

// export type TestColorssss = "#ff0000" | "#993333";



export const baseColors = [
  semantic_colors.base["b-dark-blue"],
  semantic_colors.base["b-light-blue"],
  semantic_colors.base["b-green"],
  semantic_colors.base["b-red"],
  semantic_colors.base["b-orange"],
  semantic_colors.base["b-yellow"],
  semantic_colors.base["b-purple"],
  semantic_colors.base["b-pink"],
  semantic_colors.base["b-teal"],
  semantic_colors.base["b-grey"],
];