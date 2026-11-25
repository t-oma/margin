import * as stylex from "@stylexjs/stylex"
import { type ReactNode, useEffect, useEffectEvent, useRef } from "react"

import { focusRing } from "@/styles/focus"
import {
  colors,
  media,
  radii,
  shadows,
  sizes,
  spacing,
  typography,
  zIndices,
} from "@/tokens.stylex"

import { createPausableTimeout, type PausableTimeout } from "./timeout"

const styles = stylex.create({
  root: {
    borderRadius: radii.lg,
    gap: spacing.space2,
    alignItems: "center",
    backgroundColor: colors.toastBackground,
    boxShadow: shadows.toast,
    color: colors.textInverse,
    display: "flex",
    fontSize: typography.fontSizeSm,
    lineHeight: typography.lineHeightSm,
    position: "fixed",
    translate: { default: "-50%", [media.phone]: "none" },
    zIndex: zIndices.toast,
    bottom: { default: spacing.space6, [media.phone]: spacing.space4 },
    left: { default: "50%", [media.phone]: spacing.space4 },
    maxWidth: { default: sizes.toastMaxWidth, [media.phone]: "none" },
    paddingBottom: spacing.space1,
    paddingLeft: spacing.space4,
    paddingRight: spacing.space1,
    paddingTop: spacing.space1,
    right: { default: null, [media.phone]: spacing.space4 },
    width: { default: "fit-content", [media.phone]: "auto" },
  },
  message: {
    overflow: "hidden",
    flexBasis: 0,
    flexGrow: 1,
    flexShrink: 1,
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    minWidth: 0,
  },
  action: {
    borderRadius: radii.md,
    paddingInline: spacing.space3,
    transition: {
      default: "background-color 150ms ease-out",

      [media.reducedMotion]: "none",
    },
    alignItems: "center",
    backgroundColor: {
      default: "transparent",
      ":hover": colors.toastActionHover,
    },
    color: colors.textInverse,
    display: "inline-flex",
    flexShrink: 0,
    fontWeight: typography.fontWeightSemibold,
    justifyContent: "center",
    outlineColor: colors.textInverse,
    outlineOffset: "-2px",
    textDecorationLine: "underline",
    textUnderlineOffset: "3px",
    userSelect: "none",
    verticalAlign: "middle",
    minHeight: sizes.touchTarget,
    minWidth: sizes.touchTarget,
  },
})

type ToastProps = {
  onAction: () => void
  actionLabel: string
  icon: ReactNode
  duration?: number
  onTimeout: () => void
  children: ReactNode
}

export function Toast({
  onAction,
  actionLabel,
  icon,
  duration = 6000,
  onTimeout,
  children,
}: ToastProps) {
  const timeoutRef = useRef<PausableTimeout | null>(null)
  const hoveredRef = useRef(false)
  const focusedRef = useRef(false)

  const handleTimeout = useEffectEvent(() => onTimeout())

  useEffect(() => {
    const timeout = createPausableTimeout(handleTimeout, duration)
    timeoutRef.current = timeout

    return () => {
      timeout.cancel()
      timeoutRef.current = null
    }
  }, [duration])

  return (
    <div
      {...stylex.props(styles.root)}
      onPointerEnter={() => {
        hoveredRef.current = true
        timeoutRef.current?.pause()
      }}
      onPointerLeave={() => {
        hoveredRef.current = false
        if (!focusedRef.current) timeoutRef.current?.resume()
      }}
      onFocus={() => {
        focusedRef.current = true

        timeoutRef.current?.pause()
      }}
      onBlur={(e) => {
        if (e.currentTarget.contains(e.relatedTarget)) return

        focusedRef.current = false
        if (!hoveredRef.current) timeoutRef.current?.resume()
      }}
    >
      {icon}
      <span {...stylex.props(styles.message)}>{children}</span>
      <button
        type="button"
        onClick={onAction}
        {...stylex.props(focusRing.base, styles.action)}
      >
        {actionLabel}
      </button>
    </div>
  )
}
