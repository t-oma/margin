import * as stylex from "@stylexjs/stylex"
import type { ReactNode } from "react"

import { colors, sizes, spacing } from "@/tokens.stylex"

const styles = stylex.create({
  root: {
    display: "flex",
    borderBottomColor: colors.border,
    borderBottomStyle: {
      default: "solid",
      ":last-child": "none",
    },
    borderBottomWidth: "1px",
  },
  margin: {
    padding: spacing.space1,
    alignItems: "center",
    display: "flex",
    flexShrink: 0,
    justifyContent: "center",
    borderRightColor: colors.marginRule,
    borderRightStyle: "solid",
    borderRightWidth: sizes.marginRuleWidth,
    width: sizes.marginWidth,
  },
  body: {
    paddingBlock: spacing.space2,
    paddingInline: spacing.space3,
    flexGrow: 1,
    minWidth: 0,
  },
})

type SheetSectionProps = {
  margin?: ReactNode
  children: ReactNode
}

export function SheetSection({ margin, children }: SheetSectionProps) {
  return (
    <div {...stylex.props(styles.root)}>
      <div {...stylex.props(styles.margin)}>{margin}</div>
      <div {...stylex.props(styles.body)}>{children}</div>
    </div>
  )
}
