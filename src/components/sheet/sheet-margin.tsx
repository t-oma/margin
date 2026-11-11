import * as stylex from "@stylexjs/stylex"
import type { ReactNode } from "react"

import { sizes, spacing } from "@/tokens.stylex"

const styles = stylex.create({
  root: {
    padding: spacing.space1,
    alignItems: "center",
    display: "flex",
    flexShrink: 0,
    justifyContent: "center",
    width: sizes.marginWidth,
  },
  start: {
    alignItems: "flex-start",
  },
})

type SheetMarginProps = {
  align?: "center" | "start"
  children?: ReactNode
}

export function SheetMargin({ align = "center", children }: SheetMarginProps) {
  return (
    <div {...stylex.props(styles.root, align === "start" && styles.start)}>
      {children}
    </div>
  )
}
