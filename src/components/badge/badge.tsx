import * as stylex from "@stylexjs/stylex"
import type { ReactNode } from "react"

import { colors, radii, spacing, typography } from "@/tokens.stylex"

const styles = stylex.create({
  root: {
    borderRadius: radii.full,
    paddingBlock: "1px",
    paddingInline: spacing.space2,
    alignItems: "center",
    backgroundColor: colors.badge,
    color: colors.textMuted,
    display: "inline-flex",
    fontSize: typography.fontSizeXs,
    fontVariantNumeric: "tabular-nums",
    fontWeight: typography.fontWeightSemibold,
    justifyContent: "center",
    lineHeight: typography.lineHeightXs,
    minWidth: "24px",
  },
})

type BadgeProps = {
  children: ReactNode
}

export function Badge({ children }: BadgeProps) {
  return <span {...stylex.props(styles.root)}>{children}</span>
}
