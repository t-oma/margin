import * as stylex from "@stylexjs/stylex"
import type { ReactNode } from "react"

import { colors } from "@/tokens.stylex"

import { sheetSectionMarker } from "./sheet.stylex"

const styles = stylex.create({
  root: {
    borderTopColor: colors.border,
    borderTopStyle: {
      default: "none",
      [stylex.when.siblingBefore(":is(*)", sheetSectionMarker)]: "solid",
    },
    borderTopWidth: "1px",
  },
})

type SheetSectionProps = {
  children: ReactNode
}

export function SheetSection({ children }: SheetSectionProps) {
  return (
    <div {...stylex.props(styles.root, sheetSectionMarker)}>{children}</div>
  )
}
