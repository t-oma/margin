import { describe, expect, it } from "vitest"

import { completeTask, createTask } from "./model"
import { parseStoredState, type StoredState } from "./storage"

const at = "2026-11-14T10:00:00.000Z"
const open = createTask("open", "Pay the electricity bill", at)
const done = completeTask(createTask("done", "Book train tickets", at), at)

const valid: StoredState = {
  version: 1,
  tasks: [open, done],
  ui: { doneCollapsed: true },
}

// Each rejected case below changes exactly one thing in a valid state.
const withTask = (task: object) => JSON.stringify({ ...valid, tasks: [task] })

describe("parseStoredState", () => {
  it("a missing key is the first run with an empty list", () => {
    expect(parseStoredState(null)).toEqual({
      ok: true,
      state: { version: 1, tasks: [], ui: { doneCollapsed: false } },
    })
  })

  it("reads back a saved state unchanged", () => {
    expect(parseStoredState(JSON.stringify(valid))).toEqual({
      ok: true,
      state: valid,
    })
  })

  it.each([
    ["text that is not JSON", "{not json"],
    ["the JSON value null", "null"],
    ["another version", JSON.stringify({ ...valid, version: 2 })],
    ["missing ui settings", JSON.stringify({ version: 1, tasks: [] })],
    ["a task without a title", withTask({ ...open, title: undefined })],
    [
      "an open task with a completion time",
      withTask({ ...open, completedAt: at }),
    ],
    [
      "a done task without a completion time",
      withTask({ ...done, completedAt: null }),
    ],
    [
      "a timestamp without milliseconds",
      withTask({ ...open, createdAt: "2026-11-14T10:00:00Z" }),
    ],
    [
      "a timestamp with a time zone offset",
      withTask({ ...open, createdAt: "2026-11-14T12:00:00.000+02:00" }),
    ],
  ])("rejects %s and keeps the raw text for the backup", (_, raw) => {
    expect(parseStoredState(raw)).toEqual({ ok: false, raw })
  })
})
