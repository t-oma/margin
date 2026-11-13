import * as stylex from "@stylexjs/stylex"
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react"
import type { ComponentPropsWithRef } from "react"

import { focusRing } from "@/styles/focus"
import { colors, radii, sizes, spacing, typography } from "@/tokens.stylex"

import type { WithoutStyleProps } from "../types"

const styles = stylex.create({
  root: {
    borderRadius: radii.md,
    gap: spacing.space1,
    paddingInline: "10px",
    alignItems: "center",
    backgroundColor: {
      default: "transparent",
      ":hover": colors.surfaceMuted,
    },
    color: {
      default: colors.textMuted,
      ":hover": colors.textPrimary,
    },
    display: "inline-flex",
    fontSize: typography.fontSizeSm,
    fontWeight: typography.fontWeightSemibold,
    lineHeight: typography.lineHeightSm,
    outlineOffset: "-2px",
    height: sizes.touchTarget,
  },
})

type SheetSectionToggleProps = Omit<
  WithoutStyleProps<ComponentPropsWithRef<"button">>,
  "children" | "type" | "aria-expanded"
> & {
  expanded: boolean
}

export function SheetSectionToggle({
  expanded,
  ...props
}: SheetSectionToggleProps) {
  return (
    <button
      type="button"
      aria-expanded={expanded}
      {...props}
      {...stylex.props(focusRing.base, styles.root)}
    >
      {expanded ? "Hide" : "Show"}

      {expanded ? (
        <ChevronUpIcon size={18} aria-hidden="true" />
      ) : (
        <ChevronDownIcon size={18} aria-hidden="true" />
      )}
    </button>
  )
}
