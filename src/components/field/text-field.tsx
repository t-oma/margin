import * as stylex from "@stylexjs/stylex"
import { type ReactNode, useId } from "react"

import { Textarea, type TextareaProps } from "@/components/textarea"
import { colors, spacing, typography } from "@/tokens.stylex"

import { FieldCounter } from "./field-counter"
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
  // The line under the field: the hint or the error, then the counter.
  help: {
    gap: spacing.space2,
    alignItems: "flex-start",
    display: "flex",
  },
  hint: {
    paddingBlock: spacing.space1,
    color: colors.textMuted,
    fontSize: typography.fontSizeXs,
    lineHeight: typography.lineHeightXs,
  },
})

type TextFieldProps = Omit<
  TextareaProps,
  "type" | "id" | "aria-required" | "aria-invalid"
> & {
  label: ReactNode
  error?: string
  /** Help under the field, such as "Press Enter to add". An error replaces it. */
  hint?: ReactNode
  /** Shown at the end of the help line, such as "192/200". */
  counter?: ReactNode
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
  hint,
  counter,
  fluid = false,
  required,
  "aria-describedby": describedBy,
  ...textareaProps
}: TextFieldProps) {
  const id = useId()

  const errorId = `${id}-error`
  const hintId = `${id}-hint`
  const counterId = `${id}-counter`

  const hasError = Boolean(error)
  const hasHint = Boolean(hint)
  const hasCounter = Boolean(counter)

  const descriptionIds =
    [
      describedBy,
      hasError ? errorId : hasHint ? hintId : undefined,
      hasCounter ? counterId : undefined,
    ]
      .filter(Boolean)
      .join(" ") || undefined

  return (
    <div {...stylex.props(styles.root, fluid && styles.fluid)}>
      <label htmlFor={id} {...stylex.props(styles.label)}>
        {required && <RequiredMark />} <span>{label}</span>
      </label>

      <Textarea
        id={id}
        required={required}
        aria-required={required ? "true" : undefined}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={descriptionIds}
        {...textareaProps}
      />

      {(hasError || hasHint || hasCounter) && (
        <div {...stylex.props(styles.help)}>
          {hasError ? (
            <FieldError id={errorId} error={error} />
          ) : (
            hasHint && (
              <span id={hintId} {...stylex.props(styles.hint)}>
                {hint}
              </span>
            )
          )}

          {hasCounter && (
            <FieldCounter id={counterId} invalid={hasError}>
              {counter}
            </FieldCounter>
          )}
        </div>
      )}
    </div>
  )
}
