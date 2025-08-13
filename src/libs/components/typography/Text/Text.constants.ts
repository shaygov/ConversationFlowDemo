export type TextSize =
  | 'xs'
  | 's'
  | 'm'
  | 'l';

export enum TextSizes {
  XS = 'xs',
  S = 's',
  M = 'm',
  L = 'l',
}

export enum TextTypeNames {
  XS = 'text-' + TextSizes.XS,
  S = 'text-' + TextSizes.S,
  M = 'text-' + TextSizes.M,
  L = 'text-' + TextSizes.L
}