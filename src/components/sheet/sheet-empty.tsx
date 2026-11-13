import * as stylex from "@stylexjs/stylex"
import type { ReactNode } from "react"

import { colors, sizes, spacing, typography } from "@/tokens.stylex"

import { sheetLayout } from "./sheet.stylex"

const styles = stylex.create({
  // Centers the marker on the first line of the title.
  marker: {
    alignItems: "center",
    display: "flex",
    height: typography.lineHeightMd,
    marginTop: spacing.space4,
  },
  body: {
    paddingBlock: spacing.space4,
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.fontSizeMd,
    fontWeight: typography.fontWeightSemibold,
    lineHeight: typography.lineHeightMd,
    textWrap: "pretty",
  },
  description: {
    color: colors.textMuted,
    fontSize: typography.fontSizeSm,
    lineHeight: typography.lineHeightSm,
    textWrap: "pretty",
    marginTop: "2px",
  },
})

// The first-run state: larger type and two decorative ruled lines below.
const largeStyles = stylex.create({
  marker: {
    height: typography.lineHeightLg,
    marginTop: spacing.space6,
  },
  body: {
    paddingBottom: 0,
    paddingTop: spacing.space6,
  },
  title: {
    fontSize: typography.fontSizeLg,
    fontWeight: typography.fontWeightBold,
    lineHeight: typography.lineHeightLg,
  },
  description: {
    marginTop: spacing.space2,
  },
  ruled: {
    paddingTop: spacing.space12,
  },
  ruledLine: {
    borderTopColor: colors.borderRow,
    borderTopStyle: "solid",
    borderTopWidth: "1px",
    height: sizes.rowMinHeight,
  },
})

type SheetEmptyProps = {
  title: ReactNode
  description?: ReactNode
  /** Icon shown in the notebook margin, aligned with the title. */
  marker?: ReactNode
  /**
   * `lg` is the first-run state of an empty sheet. `md` fits inside a section.
   * @default 'md'
   */
  size?: "md" | "lg"
}

export function SheetEmpty({
  title,
  description,
  marker,
  size = "md",
}: SheetEmptyProps) {
  const large = size === "lg"

  return (
    <div {...stylex.props(sheetLayout.row)}>
      <div {...stylex.props(sheetLayout.margin)}>
        {marker && (
          <span {...stylex.props(styles.marker, large && largeStyles.marker)}>
            {marker}
          </span>
        )}
      </div>

      <div
        {...stylex.props(
          sheetLayout.body,
          styles.body,
          large && largeStyles.body
        )}
      >
        <p {...stylex.props(styles.title, large && largeStyles.title)}>
          {title}
        </p>
        {description && (
          <p
            {...stylex.props(
              styles.description,
              large && largeStyles.description
            )}
          >
            {description}
          </p>
        )}

        {large && (
          <div aria-hidden="true" {...stylex.props(largeStyles.ruled)}>
            <div {...stylex.props(largeStyles.ruledLine)}></div>
            <div {...stylex.props(largeStyles.ruledLine)}></div>
          </div>
        )}
      </div>
    </div>
  )
}
