import * as stylex from "@stylexjs/stylex"
import { type ReactNode, useId } from "react"

import { colors, spacing, typography } from "@/tokens.stylex"

import { sheetSectionMarker } from "./sheet.stylex"
import { sheetLayout } from "./sheet-layout"
import { SheetSectionToggle } from "./sheet-section-toggle"

const styles = stylex.create({
  root: {
    borderTopColor: colors.border,
    borderTopStyle: {
      default: "none",
      [stylex.when.siblingBefore(":is(*)", sheetSectionMarker)]: "solid",
    },
    borderTopWidth: "1px",
  },
  header: {
    backgroundColor: colors.subtle,
    borderBottomColor: colors.borderRow,
    borderBottomStyle: "solid",
    borderBottomWidth: "1px",
  },
  headerBody: {
    gap: spacing.space2,
    alignItems: "center",
    display: "flex",
  },
  heading: {
    fontSize: typography.fontSizeSm,
    fontWeight: typography.fontWeightSemibold,
    letterSpacing: typography.letterSpacingWide,
    lineHeight: typography.lineHeightSm,
    textTransform: "uppercase",
  },
  // Pulls the toggle's hit area out so its label lines up with the body edge.
  toggle: {
    marginInlineEnd: `calc(-1 * ${spacing.space3})`,
    marginInlineStart: "auto",
  },
})

type SheetSectionProps = {
  title: ReactNode
  /** Rendered next to the title, e.g. a count badge. */
  badge?: ReactNode
  /**
   * @default false
   */
  collapsed?: boolean
  /**
   * Makes the section collapsible: adds a Hide/Show toggle to the header and
   * hides the content while `collapsed` is true.
   */
  onCollapsedChange?: (collapsed: boolean) => void
  children: ReactNode
}

export function SheetSection({
  title,
  badge,
  collapsed = false,
  onCollapsedChange,
  children,
}: SheetSectionProps) {
  const id = useId()
  const headingId = `${id}-heading`
  const toggleId = `${id}-toggle`
  const contentId = `${id}-content`
  const collapsible = onCollapsedChange !== undefined

  return (
    <section
      aria-labelledby={headingId}
      {...stylex.props(styles.root, sheetSectionMarker)}
    >
      <div {...stylex.props(sheetLayout.row, styles.header)}>
        <div {...stylex.props(sheetLayout.margin)}></div>

        <div {...stylex.props(sheetLayout.body, styles.headerBody)}>
          <h2 id={headingId} {...stylex.props(styles.heading)}>
            {title}
          </h2>

          {badge}

          {collapsible && (
            <div {...stylex.props(styles.toggle)}>
              {/* Named by its own text and the heading: "Hide Done". */}
              <SheetSectionToggle
                id={toggleId}
                expanded={!collapsed}
                aria-controls={contentId}
                aria-labelledby={`${toggleId} ${headingId}`}
                onClick={() => onCollapsedChange(!collapsed)}
              />
            </div>
          )}
        </div>
      </div>

      <div id={contentId} hidden={collapsible && collapsed}>
        {children}
      </div>
    </section>
  )
}
