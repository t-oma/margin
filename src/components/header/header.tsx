import * as stylex from "@stylexjs/stylex"

import { colors, sizes, spacing, zIndices } from "@/tokens.stylex"

import { Brand } from "../brand"

const styles = stylex.create({
  root: {
    paddingInline: spacing.space4,
    alignItems: "center",
    backgroundColor: colors.background,
    display: "flex",
    position: "sticky",
    zIndex: zIndices.header,
    borderBottomColor: colors.border,
    borderBottomStyle: "solid",
    borderBottomWidth: "1px",
    height: sizes.headerHeight,
    top: 0,
  },
})

export function Header() {
  return (
    <header {...stylex.props(styles.root)}>
      <Brand />
    </header>
  )
}
