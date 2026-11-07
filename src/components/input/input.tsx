import * as stylex from "@stylexjs/stylex"
import type { ComponentPropsWithRef } from "react"

import { focusRing } from "@/styles/focus"
import { colors, media, radii, sizes, spacing } from "@/tokens.stylex"

import type { WithoutStyleProps } from "../types"

const styles = stylex.create({
  root: {
    borderColor: {
      default: colors.borderControl,
      ":focus-visible": colors.accent,
      ":not(:focus-visible):hover": colors.borderControlHover,
    },
    borderRadius: radii.md,
    borderStyle: "solid",
    borderWidth: "1px",
    paddingInline: spacing.space2,
    transition: {
      default: "border-color 150ms ease-out",

      [media.reducedMotion]: "none",
    },
    backgroundColor: colors.surface,
    maxWidth: "100%",
    minHeight: sizes.touchTarget,
    minWidth: sizes.touchTarget,
  },
  disabled: {
    borderColor: colors.borderDisabled,
    backgroundColor: colors.inputDisabled,
    color: colors.textDisabled,
    cursor: "not-allowed",
    userSelect: "none",
  },
  invalid: {
    borderColor: colors.danger,
  },
  readOnly: {
    borderColor: colors.borderControl,
    backgroundColor: colors.surfaceHover,
    color: colors.textPrimary,
    cursor: "text",
  },
})

export type InputProps = WithoutStyleProps<ComponentPropsWithRef<"input">>

export function Input({
  disabled,
  "aria-invalid": invalid,
  readOnly,
  ...props
}: InputProps) {
  const isInvalid = Boolean(invalid) && invalid !== "false"

  return (
    <input
      disabled={disabled}
      readOnly={readOnly}
      aria-invalid={invalid}
      {...props}
      {...stylex.props(
        styles.root,
        focusRing.base,
        isInvalid && focusRing.invalid,
        readOnly && styles.readOnly,
        disabled && styles.disabled,
        isInvalid && styles.invalid
      )}
    />
  )
}
