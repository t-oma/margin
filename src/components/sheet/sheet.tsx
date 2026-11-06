import * as stylex from "@stylexjs/stylex"
import type { ReactNode } from "react"

import { colors, radii } from "@/tokens.stylex"

const styles = stylex.create({
  root: {
    borderColor: colors.border,
    borderRadius: radii.xl,
    borderStyle: "solid",
    borderWidth: "1px",
    backgroundColor: colors.surface,
  },
})

type SheetProps = {
  children: ReactNode
}

export function Sheet({ children }: SheetProps) {
  return <div {...stylex.props(styles.root)}>{children}</div>
}
