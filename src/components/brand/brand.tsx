import * as stylex from "@stylexjs/stylex"

import { spacing, typography } from "@/tokens.stylex"

import { Logo } from "./logo"

const BRAND_NAME = "Margin"

const styles = stylex.create({
  root: {
    gap: spacing.space2,
    alignItems: "center",
    display: "flex",
  },
  label: {
    fontWeight: typography.fontWeightSemibold,
  },
})

export function Brand() {
  return (
    <div {...stylex.props(styles.root)}>
      <Logo />

      <span {...stylex.props(styles.label)}>{BRAND_NAME}</span>
    </div>
  )
}
