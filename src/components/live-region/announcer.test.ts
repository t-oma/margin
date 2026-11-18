import { afterEach, beforeEach, expect, test, vi } from "vitest"

import { createAnnouncer } from "./announcer"

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

test("a message appears after the delay", () => {
  const announcer = createAnnouncer({ delay: 100 })

  announcer.announce("Task added: Pay the bill")
  expect(announcer.getMessage()).toBe("")

  vi.advanceTimersByTime(100)
  expect(announcer.getMessage()).toBe("Task added: Pay the bill")
})

test("the same message twice empties the region in between", () => {
  const announcer = createAnnouncer({ delay: 100 })
  const seen: string[] = []
  announcer.subscribe(() => seen.push(announcer.getMessage()))

  announcer.announce("Type a task title")
  vi.advanceTimersByTime(100)
  announcer.announce("Type a task title")
  vi.advanceTimersByTime(100)

  expect(seen).toEqual(["Type a task title", "", "Type a task title"])
})

test("a newer message replaces one that has not appeared yet", () => {
  const announcer = createAnnouncer({ delay: 100 })
  const seen: string[] = []
  announcer.subscribe(() => seen.push(announcer.getMessage()))

  announcer.announce("First")
  vi.advanceTimersByTime(50)
  announcer.announce("Second")
  vi.advanceTimersByTime(100)

  expect(announcer.getMessage()).toBe("Second")
  expect(seen).toEqual(["Second"])
})

test("stops notifying after unsubscribe", () => {
  const announcer = createAnnouncer({ delay: 100 })
  const listener = vi.fn()
  const unsubscribe = announcer.subscribe(listener)

  unsubscribe()
  announcer.announce("Task added")
  vi.advanceTimersByTime(100)

  expect(listener).not.toHaveBeenCalled()
})
