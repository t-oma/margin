import * as stylex from "@stylexjs/stylex"

import { colors, sizes } from "@/tokens.stylex"

export const focusRing = stylex.create({
  base: {
    outlineColor: colors.accent,
    outlineOffset: sizes.focusRingOffset,
    outlineStyle: {
      default: "none",
      ":focus-visible": "solid",
    },
    outlineWidth: sizes.focusRingWidth,
  },
  invalid: {
    outlineColor: colors.danger,
  },
})
