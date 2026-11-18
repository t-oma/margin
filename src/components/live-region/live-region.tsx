import * as stylex from "@stylexjs/stylex"
import { useSyncExternalStore } from "react"

import { visuallyHidden } from "@/styles/visually-hidden"

import { announcer } from "./announcer"

/**
 * The polite live region that reads out every `announce()` call. Render it
 * once, near the root, so it is in the page before the first message.
 */
export function LiveRegion() {
  const message = useSyncExternalStore(
    announcer.subscribe,
    announcer.getMessage
  )

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      {...stylex.props(visuallyHidden.base)}
    >
      {message}
    </div>
  )
}
