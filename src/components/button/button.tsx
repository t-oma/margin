import { focusStyles } from "@/styles/focus"
import {
  colors,
  media,
  radii,
  sizes,
  spacing,
  typography,
} from "@/tokens.stylex"
import * as stylex from "@stylexjs/stylex"
import type { ComponentProps, ReactNode } from "react"

const styles = stylex.create({
  root: {
    borderRadius: radii.md,
    transition: {
      default: "transform 100ms ease-out, background-color 150ms ease-out",

      [media.reducedMotion]: "none",
    },
    alignItems: "center",
    display: "inline-flex",
    fontWeight: typography.fontWeightMedium,
    justifyContent: "center",
    transform: {
      default: "scale(1)",

      ":enabled:active": "scale(0.95)",
      [media.reducedMotion]: "scale(1)",
    },
    userSelect: "none",
    verticalAlign: "middle",
    minHeight: sizes.touchTarget,
    minWidth: sizes.touchTarget,
  },
  disabled: {
    backgroundColor: colors.disabled,
    color: colors.foregroundMuted,
    cursor: "not-allowed",
  },
})

const colorVariants = stylex.create({
  primary: {
    backgroundColor: {
      default: colors.accent,
      ":enabled:hover": colors.accentHover,
    },
    color: colors.foregroundInverse,
  },
  secondary: {
    borderColor: colors.borderControl,
    borderStyle: "solid",
    borderWidth: "1px",
    backgroundColor: {
      default: colors.surface,
      ":enabled:hover": colors.surfaceHover,
    },
    color: colors.foreground,
  },
  danger: {
    backgroundColor: {
      default: colors.danger,
      ":enabled:hover": colors.dangerHover,
    },
    color: colors.foregroundInverse,
  },
})

const sizeVariants = stylex.create({
  md: {
    gap: spacing.space2,
    paddingBlock: spacing.space2,
    paddingInline: spacing.space4,
  },
  icon: {
    height: sizes.touchTarget,
    width: sizes.touchTarget,
  },
})

type ButtonProps = Omit<ComponentProps<"button">, "className" | "style"> & {
  /**
   * @default 'primary'
   */
  variant?: keyof typeof colorVariants
  /**
   * @default 'md'
   */
  size?: keyof typeof sizeVariants
  children: ReactNode
}

export function Button({
  variant = "primary",
  size = "md",
  type = "button",
  disabled = false,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      {...props}
      {...stylex.props(
        styles.root,
        focusStyles.ring,
        colorVariants[variant],
        sizeVariants[size],
        disabled && styles.disabled
      )}
    >
      {children}
    </button>
  )
}
