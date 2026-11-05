import * as stylex from "@stylexjs/stylex"
import type { ComponentPropsWithRef, ReactNode } from "react"

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
  ghost: {
    backgroundColor: {
      default: "transparent",
      ":enabled:hover": colors.iconButtonHover,
    },
    color: colors.foreground,
  },
})

const dangerVariants = stylex.create({
  filled: {
    borderColor: null,
    borderStyle: null,
    borderWidth: null,
    backgroundColor: {
      default: colors.danger,
      ":enabled:hover": colors.dangerHover,
    },
    color: colors.foregroundInverse,
  },
  ghost: {
    borderColor: null,
    borderStyle: null,
    borderWidth: null,
    backgroundColor: {
      default: "transparent",
      ":enabled:focus-visible": colors.dangerTint,
      ":enabled:hover": colors.dangerTint,
    },
    color: {
      default: colors.foreground,
      ":enabled:focus-visible": colors.dangerHover,
      ":enabled:hover": colors.dangerHover,
    },
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

type ButtonProps = WithoutStyleProps<ComponentPropsWithRef<"button">> & {
  /**
   * @default 'primary'
   */
  variant?: keyof typeof colorVariants
  /**
   * @default 'md'
   */
  size?: keyof typeof sizeVariants
  /**
   * @default false
   */
  destructive?: boolean

  children: ReactNode
}

export function Button({
  variant = "primary",
  size = "md",
  type = "button",
  destructive = false,
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
        focusRing.base,
        colorVariants[variant],
        destructive
          ? variant === "ghost"
            ? dangerVariants.ghost
            : dangerVariants.filled
          : undefined,
        sizeVariants[size],
        disabled && styles.disabled
      )}
    >
      {children}
    </button>
  )
}
