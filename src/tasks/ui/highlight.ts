import { useSyncExternalStore } from "react"

export type Highlighter = {
  getHighlightedId: () => string | null
  subscribe: (listener: () => void) => () => void
  highlight: (id: string) => void
  clear: (id: string) => void
}

export function createHighlighter() {
  const listeners = new Set<() => void>()
  let highlightedId: string | null = null

  function set(next: string | null) {
    if (next === highlightedId) return
    highlightedId = next
    listeners.forEach((listener) => listener())
  }

  const highlighter: Highlighter = {
    getHighlightedId: () => highlightedId,

    subscribe(listener) {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },

    // A newer highlight replaces the one before it.
    highlight(id) {
      set(id)
    },

    // Clears only this task's highlight, so a row whose fade ends late can't
    // clear a newer one.
    clear(id) {
      if (highlightedId === id) set(null)
    },
  }

  return highlighter
}

// One highlight for the whole app.
export const highlighter = createHighlighter()
export const highlightTask = highlighter.highlight
export const clearHighlight = highlighter.clear

/** Whether this task's row should play the highlight. */
export function useIsHighlighted(id: string) {
  return useSyncExternalStore(
    highlighter.subscribe,
    () => highlighter.getHighlightedId() === id
  )
}
