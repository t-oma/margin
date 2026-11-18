import * as stylex from "@stylexjs/stylex"
import type { ReactNode } from "react"

import { colors, spacing, typography } from "@/tokens.stylex"

const styles = stylex.create({
  root: {
    paddingBlock: spacing.space1,
    color: colors.textMuted,
    fontSize: typography.fontSizeXs,
    fontVariantNumeric: "tabular-nums",
    lineHeight: typography.lineHeightXs,
    marginInlineStart: "auto",
    whiteSpace: "nowrap",
  },
  invalid: {
    color: colors.danger,
    fontWeight: typography.fontWeightBold,
  },
})

type FieldCounterProps = {
  id?: string
  invalid: boolean
  children: ReactNode
}

export function FieldCounter({ id, invalid, children }: FieldCounterProps) {
  return (
    <span id={id} {...stylex.props(styles.root, invalid && styles.invalid)}>
      {children}
    </span>
  )
}
