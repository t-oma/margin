import * as stylex from "@stylexjs/stylex"
import { CircleAlertIcon } from "lucide-react"
import type { ComponentPropsWithRef } from "react"

import { colors, spacing, typography } from "@/tokens.stylex"

const styles = stylex.create({
  root: {
    gap: spacing.space1,
    paddingBlock: spacing.space1,
    color: colors.danger,
    display: "inline-flex",
  },
  icon: {
    flexShrink: 0,
    marginTop: "1px", // Small top margin for icon to look aligned with text
  },
  text: {
    fontSize: typography.fontSizeXs,
    fontWeight: typography.fontWeightMedium,
    lineHeight: typography.lineHeightXs,
  },
})

type FieldErrorProps = Pick<ComponentPropsWithRef<"p">, "ref" | "id"> & {
  error?: string
}

export function FieldError({ error, ...props }: FieldErrorProps) {
  if (!error) {
    return null
  }

  return (
    <p {...props} {...stylex.props(styles.root)}>
      <CircleAlertIcon size={16} {...stylex.props(styles.icon)} />
      <span {...stylex.props(styles.text)}>{error}</span>
    </p>
  )
}
