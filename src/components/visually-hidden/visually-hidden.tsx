import * as stylex from "@stylexjs/stylex"
import type { ReactNode } from "react"

import { visuallyHidden } from "@/styles/visually-hidden"

type VisuallyHiddenProps = {
  children: ReactNode
}

export function VisuallyHidden({ children }: VisuallyHiddenProps) {
  return <span {...stylex.props(visuallyHidden.base)}>{children}</span>
}
