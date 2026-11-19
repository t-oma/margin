import { expect, test, vi } from "vitest"

import { createHighlighter } from "./highlight"

test("nothing is highlighted at first", () => {
  expect(createHighlighter().getHighlightedId()).toBeNull()
})

test("a newer highlight replaces the one before it", () => {
  const highlighter = createHighlighter()

  highlighter.highlight("a")
  highlighter.highlight("b")

  expect(highlighter.getHighlightedId()).toBe("b")
})

test("a row clears its own highlight", () => {
  const highlighter = createHighlighter()

  highlighter.highlight("a")
  highlighter.clear("a")

  expect(highlighter.getHighlightedId()).toBeNull()
})

test("a row can't clear another row's highlight", () => {
  const highlighter = createHighlighter()
  highlighter.highlight("a")
  highlighter.highlight("b")
  const listener = vi.fn()
  highlighter.subscribe(listener)

  // Row a's fade ends after b was highlighted.
  highlighter.clear("a")

  expect(highlighter.getHighlightedId()).toBe("b")
  expect(listener).not.toHaveBeenCalled()
})

test("subscribers hear only real changes", () => {
  const highlighter = createHighlighter()
  const listener = vi.fn()
  highlighter.subscribe(listener)

  highlighter.highlight("a")
  highlighter.highlight("a")
  highlighter.clear("a")
  highlighter.clear("a")

  expect(listener).toHaveBeenCalledTimes(2)
})

test("stops notifying after unsubscribe", () => {
  const highlighter = createHighlighter()
  const listener = vi.fn()
  const unsubscribe = highlighter.subscribe(listener)

  unsubscribe()
  highlighter.highlight("a")

  expect(listener).not.toHaveBeenCalled()
})
