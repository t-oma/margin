import * as stylex from "@stylexjs/stylex"
import type { ReactNode } from "react"

import { colors, radii, sizes } from "@/tokens.stylex"

const styles = stylex.create({
  root: {
    borderColor: colors.border,
    borderRadius: radii.xl,
    borderStyle: "solid",
    borderWidth: "1px",
    // Clips row backgrounds at the rounded corners. Unlike `hidden`, `clip`
    // creates no scroll container, so the sticky composer keeps working.
    overflow: "clip",
    backgroundColor: colors.surface,
    position: "relative",
  },
  marginRule: {
    pointerEvents: "none",
    position: "absolute",
    borderRightColor: colors.marginRule,
    borderRightStyle: "solid",
    borderRightWidth: sizes.marginRuleWidth,
    bottom: 0,
    left: 0,
    top: 0,
    width: sizes.marginWidth,
  },
})

type SheetProps = {
  children: ReactNode
}

export function Sheet({ children }: SheetProps) {
  return (
    <div {...stylex.props(styles.root)}>
      <span aria-hidden="true" {...stylex.props(styles.marginRule)}></span>

      {children}
    </div>
  )
}
