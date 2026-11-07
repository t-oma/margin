import * as stylex from "@stylexjs/stylex"
import { type ReactNode, useId } from "react"

import { colors, spacing, typography } from "@/tokens.stylex"

import { Input, type InputProps } from "../input"
import { FieldError } from "./field-error"

const styles = stylex.create({
  root: {
    gap: spacing.space1,
    alignItems: "stretch",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  label: {
    gap: spacing.space1,
    color: colors.textPrimary,
    display: "inline-flex",
    flexGrow: 1,
    fontSize: typography.fontSizeSm,
    fontWeight: typography.fontWeightSemibold,
    lineHeight: typography.lineHeightSm,
  },
  fluid: {
    flexGrow: 1,
    minWidth: 0,
    width: "100%",
  },
  requiredMark: {
    color: colors.danger,
  },
})

type TextFieldProps = Omit<
  InputProps,
  "type" | "id" | "aria-required" | "aria-invalid"
> & {
  label: ReactNode
  error?: string
  fluid?: boolean
}

function RequiredMark() {
  return (
    <span aria-hidden="true" {...stylex.props(styles.requiredMark)}>
      *
    </span>
  )
}

export function TextField({
  label,
  error,
  fluid = false,
  required,
  "aria-describedby": describedBy,
  ...inputProps
}: TextFieldProps) {
  const id = useId()

  const errorId = `${id}-error`

  const descriptionIds =
    [describedBy, error ? errorId : undefined].filter(Boolean).join(" ") ||
    undefined

  return (
    <div {...stylex.props(styles.root, fluid && styles.fluid)}>
      <label htmlFor={id} {...stylex.props(styles.label)}>
        {required && <RequiredMark />} <span>{label}</span>
      </label>

      <Input
        id={id}
        type="text"
        required={required}
        aria-required={required ? "true" : undefined}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={descriptionIds}
        {...inputProps}
      />

      <FieldError id={errorId} error={error} />
    </div>
  )
}
