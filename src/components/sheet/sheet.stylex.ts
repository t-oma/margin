import * as stylex from "@stylexjs/stylex"

import { spacing } from "@/tokens.stylex"

export const sheetSectionMarker = stylex.defineMarker()

export const sheetLayout = stylex.create({
  row: {
    display: "flex",
  },
  body: {
    paddingInline: spacing.space3,
    flexGrow: 1,
    minWidth: 0,
  },
})
