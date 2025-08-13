import data from "@/figmaUtils/base.json";

// GLOBALS
const semantic_colors = data.token.semantic_colors;
const fonts = data.token.fonts;

const Theme = {
  fonts: {
    "paragraph-l-regular": {
      family: fonts['Paragraph_L-Regular'].family.value,
      size: fonts['Paragraph_L-Regular'].size.value,
      weight: fonts['Paragraph_L-Regular'].weight.value,
      lineheight: fonts['Paragraph_L-Regular'].lineheight.value,
      spacing: fonts['Paragraph_L-Regular'].spacing.value,
    },
    "paragraph-l-medium": {
      family: fonts['Paragraph_L-Medium'].family.value,
      size: fonts['Paragraph_L-Medium'].size.value,
      weight: fonts['Paragraph_L-Medium'].weight.value,
      lineheight: fonts['Paragraph_L-Medium'].lineheight.value,
      spacing: fonts['Paragraph_L-Medium'].spacing.value,
    },
    "paragraph-s-medium": {
      family: fonts['Paragraph_S-Medium'].family.value,
      size: fonts['Paragraph_S-Medium'].size.value,
      weight: fonts['Paragraph_S-Medium'].weight.value,
      lineheight: fonts['Paragraph_S-Medium'].lineheight.value,
      spacing: fonts['Paragraph_S-Medium'].spacing.value,
    },
    "paragraph-xl-regular": {
      family: fonts['Paragraph_XL-Regular'].family.value,
      size: fonts['Paragraph_XL-Regular'].size.value,
      weight: fonts['Paragraph_XL-Regular'].weight.value,
      lineheight: fonts['Paragraph_XL-Regular'].lineheight.value,
      spacing: fonts['Paragraph_XL-Regular'].spacing.value,
    },
    "paragraph-xs-medium": {
      family: fonts['Paragraph_XS-Medium'].family.value,
      size: fonts['Paragraph_XS-Medium'].size.value,
      weight: fonts['Paragraph_XS-Medium'].weight.value,
      lineheight: fonts['Paragraph_XS-Medium'].lineheight.value,
      spacing: fonts['Paragraph_XS-Medium'].spacing.value,
    },
    // "paragraph-l-light": {
    //   family: fonts['Paragraph_L-Regular'].family.value,
    //   size: fonts['Paragraph_L-Regular'].size.value,
    //   weight: fonts['Paragraph_L-Regular'].weight.value,
    //   lineheight: fonts['Paragraph_L-Regular'].lineheight.value,
    //   spacing: fonts['Paragraph_L-Regular'].spacing.value,
    // },
    // "paragraph-xxs-semibold": {
    //   family: fonts.Paragraph_XXS__Semibold.family.value,
    //   size: fonts.Paragraph_XXS__Semibold.size.value,
    //   weight: fonts.Paragraph_XXS__Semibold.weight.value,
    //   lineheight: fonts.Paragraph_XXS__Semibold.lineheight.value,
    //   spacing: fonts.Paragraph_XXS__Semibold.spacing.value,
    // },
    // "paragraph-xs-semibold": {
    //   family: fonts.Paragraph_XS__Regular_.family.value,
    //   size: fonts.Paragraph_XS__Regular_.size.value,
    //   weight: fonts.Paragraph_XS__Regular_.weight.value,
    //   lineheight: fonts.Paragraph_XS__Regular_.lineheight.value,
    //   spacing: fonts.Paragraph_XS__Regular_.spacing.value,
    // },
  },
  "semantic-colors": {
    typography: {
      "typo-primary": semantic_colors["Text-Primary"].value,
      "typo-secondary": semantic_colors["Text-Secondary"].value,
      "typo-tetriary": semantic_colors["Text-Tetriary"].value,
      "typo-inactive": semantic_colors["Text-Inactive"].value,
      "typo-white": semantic_colors["Text-White"].value,
    },
    base: {
      "b-dark-blue": semantic_colors.BaseDark_Blue.value,
      "b-light-blue": semantic_colors.BaseLight_Blue.value,
      "b-green": semantic_colors.BaseGreen.value,
      "b-red": semantic_colors.BaseRed.value,
      "b-orange": semantic_colors.BaseOrange.value,
      "b-yellow": semantic_colors.BaseYellow.value,
      "b-purple": semantic_colors.BasePurple.value,
      "b-pink": semantic_colors.BasePink.value,
      "b-teal": semantic_colors.BaseTeal.value,
      "b-grey": semantic_colors.BaseGrey.value,
    },
    greyscale: {
      "$G-0": semantic_colors["GG-0"].value,
      "$G-0-5": semantic_colors["GG-0_5"].value,
      "$G-1": semantic_colors["GG-1"].value,
      "$G-1-5": semantic_colors["GG-1_5"].value,
      "$G-2": semantic_colors["GG-2"].value,
      "$G-3": semantic_colors["GG-3"].value,
      "$G-4": semantic_colors["GG-4"].value,
      "$G-5": semantic_colors["GG-5"].value,
      "$G-6": semantic_colors["GG-6"].value,
      "$G-7": semantic_colors["GG-7"].value,
      "$G-8": semantic_colors["GG-8"].value,
    },
  },
  easing: {
    "easing-basic": "ease-in-out",
    "ease-out": "ease-out",
    "ease-in": "ease-in"
  },
  timing: {
    "timing-basic": "0.2s",
    "timing-out": "0.25s",
    "timing-in": "0.15s"
  }
};

// export const setTransitionStyle = (hoverEasing: string, hoverDuration: string, properties: string[]) => {
//   const transitionProperties = properties.map(property => `${property} ${hoverDuration}ms`).join(", ");
//   let transitionValue = '';

//   switch (hoverEasing) {
//     case 'EASE_IN_AND_OUT':
//       transitionValue = `${transitionProperties} ease-in-out`;
//       break;
//     case 'EASE_IN':
//       transitionValue = `${transitionProperties} ease-in`;
//       break;
//     default:
//       transitionValue = `${transitionProperties} ease`;
//       break;
//   }

//   return `transition: ${transitionValue};`;
// };

export default Theme;
