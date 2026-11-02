import { colors } from "@/tokens.stylex"
import * as stylex from "@stylexjs/stylex"

const styles = stylex.create({
  base: {
    fill: "none",
    stroke: colors.accent,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: 1.8,
  },
})

export function Logo() {
  return (
    <svg
      {...stylex.props(styles.base)}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <rect x="3.5" y="3.5" width="17" height="17" rx="4"></rect>
      <path d="M9 3.5v17"></path>
      <path d="M12.5 12.2l1.8 1.8 3.2-3.6"></path>
    </svg>
  )
}
