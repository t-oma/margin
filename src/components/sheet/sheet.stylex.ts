import * as stylex from "@stylexjs/stylex"

import { colors, sizes, spacing } from "@/tokens.stylex"

// A section draws a divider above itself when another section precedes it.
export const sheetSectionMarker = stylex.defineMarker()

/**
 * Layout of one sheet row: the notebook margin cell, then the body. For
 * components that render a row, such as a task row or the composer. A page
 * composes those components rather than rows.
 */
export const sheetLayout = stylex.create({
  row: {
    display: "flex",
    minHeight: sizes.rowMinHeight,
  },
  margin: {
    alignItems: "flex-start",
    color: colors.accent,
    display: "flex",
    flexShrink: 0,
    justifyContent: "center",
    width: sizes.marginWidth,
  },
  body: {
    flexGrow: 1,
    paddingInlineEnd: spacing.space4,
    paddingInlineStart: spacing.space3,
    minWidth: 0,
  },
})
