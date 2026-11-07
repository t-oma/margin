import * as stylex from "@stylexjs/stylex"
import type { ReactNode } from "react"

import { colors, sizes, spacing, typography } from "@/tokens.stylex"

import { SheetSection } from "./sheet-section"

const styles = stylex.create({
  root: {
    paddingBottom: spacing.space12,
    paddingRight: spacing.space2,
    paddingTop: spacing.space4,
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.fontSizeLg,
    fontWeight: typography.fontWeightBold,
    lineHeight: typography.lineHeightLg,
    textWrap: "pretty",
    marginBottom: spacing.space2,
  },
  description: {
    color: colors.textMuted,
    fontSize: typography.fontSizeSm,
    lineHeight: typography.lineHeightSm,
    textWrap: "pretty",
  },
  emptyRow: {
    borderTopColor: colors.borderRow,
    borderTopStyle: "solid",
    borderTopWidth: "1px",
    height: sizes.rowMinHeight,
    width: "100%",
  },
})

type SheetEmptyProps = {
  title: ReactNode
  description?: ReactNode
}

export function SheetEmpty({ title, description }: SheetEmptyProps) {
  return (
    <SheetSection>
      <div {...stylex.props(styles.root)}>
        <h2 {...stylex.props(styles.title)}>{title}</h2>
        {description && (
          <p {...stylex.props(styles.description)}>{description}</p>
        )}
      </div>

      <div {...stylex.props(styles.emptyRow)} aria-hidden="true"></div>
      <div {...stylex.props(styles.emptyRow)} aria-hidden="true"></div>
    </SheetSection>
  )
}
