import * as stylex from "@stylexjs/stylex"
import {
  type ComponentPropsWithRef,
  type KeyboardEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react"

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
    fieldSizing: "content",
    borderColor: {
      default: colors.borderControl,
      ":focus-visible": colors.accent,
      ":not(:focus-visible):hover": colors.borderControlHover,
    },
    borderRadius: radii.md,
    borderStyle: "solid",
    borderWidth: "1px",
    // The field grows with its text, so it never scrolls inside.
    overflow: "hidden",
    // One line fits the 44 px touch target exactly: 2 px is the border.
    paddingBlock: `calc((${sizes.touchTarget} - ${typography.lineHeightMd} - 2px) / 2)`,
    paddingInline: spacing.space2,
    transition: {
      default: "border-color 150ms ease-out",

      [media.reducedMotion]: "none",
    },
    backgroundColor: colors.surface,
    display: "block",
    fontSize: typography.fontSizeMd,
    lineHeight: typography.lineHeightMd,
    resize: "none",
    maxWidth: "100%",
    minHeight: sizes.touchTarget,
    minWidth: sizes.touchTarget,
  },
  disabled: {
    borderColor: colors.borderDisabled,
    backgroundColor: colors.surfaceMuted,
    color: colors.textDisabled,
    cursor: "not-allowed",
    userSelect: "none",
  },
  invalid: {
    borderColor: colors.danger,
  },
  readOnly: {
    borderColor: colors.borderControl,
    backgroundColor: colors.surfaceMuted,
    color: colors.textPrimary,
    cursor: "text",
  },
})

const supportsFieldSizing =
  typeof CSS !== "undefined" && CSS.supports("field-sizing", "content")

// Fallback for browsers without field-sizing: size the box to its text.
function fitToContent(textarea: HTMLTextAreaElement) {
  textarea.style.height = "auto"
  const borders = textarea.offsetHeight - textarea.clientHeight
  textarea.style.height = `${String(textarea.scrollHeight + borders)}px`
}

export type TextareaProps = WithoutStyleProps<
  ComponentPropsWithRef<"textarea">
> & {
  /**
   * Enter, with or without Shift, submits the form instead of adding a line
   * break. Enter that confirms an IME candidate is left alone.
   */
  submitOnEnter?: boolean
}

export function Textarea({
  ref,
  rows = 1,
  submitOnEnter = false,
  disabled,
  readOnly,
  "aria-invalid": invalid,
  value,
  onInput,
  onKeyDown,
  ...props
}: TextareaProps) {
  const ownRef = useRef<HTMLTextAreaElement | null>(null)
  const isInvalid = Boolean(invalid) && invalid !== "false"

  // Keeps a handle on the element and still passes it to the caller's ref.
  const setRefs = useCallback(
    (node: HTMLTextAreaElement | null) => {
      ownRef.current = node
      if (typeof ref === "function") ref(node)
      else if (ref) ref.current = node
    },
    [ref]
  )

  // A controlled value can change without typing, such as a clear on submit.
  useLayoutEffect(() => {
    if (ownRef.current && !supportsFieldSizing) fitToContent(ownRef.current)
  }, [value])

  // A new width rewraps the text, so the height changes too.
  useEffect(() => {
    const textarea = ownRef.current
    if (!textarea || supportsFieldSizing) return

    let width = textarea.clientWidth
    const observer = new ResizeObserver(() => {
      if (textarea.clientWidth === width) return
      width = textarea.clientWidth
      fitToContent(textarea)
    })
    observer.observe(textarea)
    return () => {
      observer.disconnect()
    }
  }, [])

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    onKeyDown?.(event)
    if (!submitOnEnter || event.defaultPrevented || event.key !== "Enter") {
      return
    }
    // Safari confirms an IME candidate with an Enter whose isComposing is
    // already false, but its keyCode is still 229.
    // eslint-disable-next-line @typescript-eslint/no-deprecated -- the only signal Safari gives
    if (event.nativeEvent.isComposing || event.keyCode === 229) return

    event.preventDefault()
    event.currentTarget.form?.requestSubmit()
  }

  return (
    <textarea
      ref={setRefs}
      rows={rows}
      disabled={disabled}
      readOnly={readOnly}
      aria-invalid={invalid}
      value={value}
      onInput={(event) => {
        onInput?.(event)
        if (!supportsFieldSizing) fitToContent(event.currentTarget)
      }}
      onKeyDown={handleKeyDown}
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
