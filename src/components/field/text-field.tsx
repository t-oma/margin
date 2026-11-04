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
    color: colors.foregroundSecondary,
    display: "inline-flex",
    flexGrow: 1,
    fontWeight: typography.fontWeightSemibold,
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
    <div {...stylex.props(styles.root)}>
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
