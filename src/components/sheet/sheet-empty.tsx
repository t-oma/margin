import * as stylex from "@stylexjs/stylex"
import type { ReactNode } from "react"

import { colors, sizes, spacing, typography } from "@/tokens.stylex"

import { sheetLayout } from "./sheet.stylex"
import { SheetMargin } from "./sheet-margin"
import { SheetSection } from "./sheet-section"

const styles = stylex.create({
  root: {
    paddingInlineEnd: spacing.space4,
    paddingTop: spacing.space6,
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
  emptyRows: {
    paddingTop: spacing.space12,
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
      <div {...stylex.props(sheetLayout.row)}>
        <SheetMargin />

        <div {...stylex.props(sheetLayout.body, styles.root)}>
          <h2 {...stylex.props(styles.title)}>{title}</h2>
          {description && (
            <p {...stylex.props(styles.description)}>{description}</p>
          )}

          <div aria-hidden="true" {...stylex.props(styles.emptyRows)}>
            <div {...stylex.props(styles.emptyRow)}></div>
            <div {...stylex.props(styles.emptyRow)}></div>
          </div>
        </div>
      </div>
    </SheetSection>
  )
}
