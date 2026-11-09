import * as stylex from "@stylexjs/stylex"
import { type ComponentPropsWithRef, type ReactNode, useId } from "react"

import { focusRing } from "@/styles/focus"
import {
  colors,
  media,
  radii,
  sizes,
  spacing,
  typography,
} from "@/tokens.stylex"

import type { WithoutStyleProps } from "../types"

const styles = stylex.create({
  root: {
    gap: spacing.space1,
    alignItems: "center",
    cursor: "pointer",
    display: "inline-flex",
    justifyContent: "center",
    position: "relative",
    minHeight: sizes.touchTarget,
    minWidth: sizes.touchTarget,
  },
  noText: {
    flexShrink: 0,
    height: sizes.touchTarget,
    width: sizes.touchTarget,
  },
  input: {
    borderColor: {
      default: colors.borderControl,
      ":enabled:hover": colors.accent,
      ":checked": colors.accent,
    },
    borderRadius: radii.sm,
    borderStyle: "solid",
    borderWidth: "2px",
    transition: {
      default: "border-color 100ms ease-out, background-color 100ms ease-out",

      [media.reducedMotion]: "none",
    },
    appearance: "none",
    backgroundColor: {
      default: colors.background,
      ":checked": colors.accent,
    },
    backgroundImage: {
      default: null,
      ":checked":
        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='none' stroke='white' stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='m6 12l4.243 4.243l8.484-8.486'/%3E%3C/svg%3E\")",
    },
    cursor: "pointer",
    flexShrink: 0,
    height: sizes.checkbox,
    width: sizes.checkbox,
  },
  labelText: {
    color: colors.textPrimary,
    fontSize: typography.fontSizeSm,
    lineHeight: typography.lineHeightSm,
  },
})

const disabledStyles = stylex.create({
  root: {
    cursor: "not-allowed",
  },
  input: {
    borderColor: colors.borderDisabled,
    backgroundColor: colors.surfaceMuted,
    backgroundImage: {
      default: null,
      ":checked":
        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='none' stroke='gray' stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='m6 12l4.243 4.243l8.484-8.486'/%3E%3C/svg%3E\")",
    },
    cursor: "not-allowed",
  },
  labelText: {
    color: colors.textDisabled,
  },
})

type CheckboxProps = Omit<
  WithoutStyleProps<ComponentPropsWithRef<"input">>,
  "type" | "id"
> & {
  children?: ReactNode
}

export function Checkbox({
  "aria-invalid": invalid,
  disabled,
  children,
  ...props
}: CheckboxProps) {
  const id = useId()

  const isInvalid = Boolean(invalid) && invalid !== "false"

  return (
    <label
      htmlFor={id}
      {...stylex.props(
        styles.root,
        !children && styles.noText,
        disabled && disabledStyles.root
      )}
    >
      <input
        id={id}
        type="checkbox"
        disabled={disabled}
        aria-invalid={invalid}
        {...props}
        {...stylex.props(
          styles.input,
          focusRing.base,
          isInvalid && focusRing.invalid,
          disabled && disabledStyles.input
        )}
      />

      {children && (
        <span
          {...stylex.props(
            styles.labelText,
            disabled && disabledStyles.labelText
          )}
        >
          {children}
        </span>
      )}
    </label>
  )
}
