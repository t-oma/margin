import { describe, expect, test, vi } from "vitest"

import { completeTask, createTask } from "./model"
import { parseStoredState, STORAGE_KEY, type StoredState } from "./storage"
import { BACKUP_KEY, createTaskStore } from "./store"

// A stand-in for localStorage whose failures can be switched on.
function memoryStorage(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial))
  return {
    data,
    failReads: false,
    failWrites: false,
    getItem(key: string) {
      if (this.failReads) throw new DOMException("Blocked", "SecurityError")
      return data.get(key) ?? null
    },
    setItem(key: string, value: string) {
      if (this.failWrites) throw new DOMException("Full", "QuotaExceededError")
      data.set(key, value)
    },
  }
}

function setup({
  initial,
  failReads = false,
}: { initial?: Record<string, string>; failReads?: boolean } = {}) {
  const storage = memoryStorage(initial)
  storage.failReads = failReads

  let second = 0
  let ids = 0
  let otherTab: ((raw: string | null) => void) | undefined

  const store = createTaskStore({
    getStorage: () => storage,
    now: () => `2026-11-14T10:00:${String(second++).padStart(2, "0")}.000Z`,
    newId: () => `task-${++ids}`,
    onOtherTabChange(listener) {
      otherTab = listener
      return () => {
        otherTab = undefined
      }
    },
  })

  const saved = () => parseStoredState(storage.data.get(STORAGE_KEY) ?? null)
  const fromOtherTab = (raw: string | null) => otherTab?.(raw)

  return { storage, store, saved, fromOtherTab }
}

const stored = (state: Omit<StoredState, "version">) =>
  JSON.stringify({ version: 1, ...state })

describe("loading", () => {
  test("the first run starts with an empty list", () => {
    const { store } = setup()

    expect(store.getSnapshot()).toEqual({
      tasks: [],
      doneCollapsed: false,
      saveStatus: "saved",
      loadError: null,
    })
  })

  test("reads saved tasks and settings", () => {
    const task = createTask("a", "Pay the bill", "2026-11-14T09:00:00.000Z")
    const { store } = setup({
      initial: {
        [STORAGE_KEY]: stored({ tasks: [task], ui: { doneCollapsed: true } }),
      },
    })

    expect(store.getSnapshot()).toMatchObject({
      tasks: [task],
      doneCollapsed: true,
    })
  })

  test("keeps a copy of unreadable data and starts empty", () => {
    const { store, storage } = setup({ initial: { [STORAGE_KEY]: "{broken" } })

    expect(storage.data.get(BACKUP_KEY)).toBe("{broken")
    expect(store.getSnapshot()).toMatchObject({
      tasks: [],
      loadError: "unreadable",
    })
  })

  test("works in memory when storage is blocked", () => {
    const { store } = setup({ failReads: true })

    expect(store.getSnapshot()).toMatchObject({
      tasks: [],
      saveStatus: "failed",
    })
  })
})

describe("changes", () => {
  test("adds a task with a normalised title and saves it", () => {
    const { store, saved } = setup()

    expect(store.add("  Pay the bill ")).toEqual({
      ok: true,
      title: "Pay the bill",
    })
    expect(store.getSnapshot().tasks).toEqual([
      createTask("task-1", "Pay the bill", "2026-11-14T10:00:00.000Z"),
    ])
    expect(saved()).toEqual({
      ok: true,
      state: {
        version: 1,
        tasks: store.getSnapshot().tasks,
        ui: { doneCollapsed: false },
      },
    })
  })

  test("an invalid title changes and saves nothing", () => {
    const { store, storage } = setup()
    const listener = vi.fn()
    store.subscribe(listener)

    expect(store.add("   ")).toEqual({ ok: false, error: "empty" })
    expect(store.getSnapshot().tasks).toEqual([])
    expect(storage.data.has(STORAGE_KEY)).toBe(false)
    expect(listener).not.toHaveBeenCalled()
  })

  test("toggle completes a task and reopens it", () => {
    const { store } = setup()
    store.add("Pay the bill")

    store.toggle("task-1")
    expect(store.getSnapshot().tasks[0]).toMatchObject({
      done: true,
      completedAt: "2026-11-14T10:00:01.000Z",
    })

    store.toggle("task-1")
    expect(store.getSnapshot().tasks[0]).toMatchObject({
      done: false,
      completedAt: null,
    })
  })

  test("rename skips a title that does not change", () => {
    const { store } = setup()
    store.add("Pay the bill")
    const before = store.getSnapshot()

    expect(store.rename("task-1", " Pay the bill ")).toEqual({
      ok: true,
      unchanged: true,
    })
    expect(store.getSnapshot()).toBe(before)

    store.rename("task-1", "Pay the rent")
    expect(store.getSnapshot().tasks[0]).toMatchObject({
      title: "Pay the rent",
      updatedAt: "2026-11-14T10:00:01.000Z",
    })
  })

  test("remove deletes a task", () => {
    const { store } = setup()
    store.add("Pay the bill")
    store.add("Book tickets")

    store.remove("task-1")
    expect(store.getSnapshot().tasks.map((task) => task.id)).toEqual(["task-2"])
  })

  test("the Done section state is saved", () => {
    const { store, saved } = setup()

    store.setDoneCollapsed(true)
    expect(saved()).toMatchObject({ state: { ui: { doneCollapsed: true } } })
  })
})

describe("saving", () => {
  test("a failed save keeps the change in memory, and the next change saves again", () => {
    const { store, storage, saved } = setup()
    storage.failWrites = true

    store.add("Pay the bill")
    expect(store.getSnapshot()).toMatchObject({ saveStatus: "failed" })
    expect(store.getSnapshot().tasks).toHaveLength(1)

    storage.failWrites = false
    store.toggle("task-1")
    expect(store.getSnapshot()).toMatchObject({ saveStatus: "saved" })
    expect(saved()).toMatchObject({ state: { tasks: [{ done: true }] } })
  })

  test("retrySave writes the current state", () => {
    const { store, storage, saved } = setup()
    storage.failWrites = true
    store.add("Pay the bill")

    storage.failWrites = false
    expect(store.retrySave()).toBe(true)
    expect(store.getSnapshot().saveStatus).toBe("saved")
    expect(saved()).toMatchObject({ state: { tasks: [{ id: "task-1" }] } })
  })
})

describe("subscriptions", () => {
  test("getSnapshot returns the same object until something changes", () => {
    const { store } = setup()
    const first = store.getSnapshot()

    expect(store.getSnapshot()).toBe(first)
    store.add("Pay the bill")
    expect(store.getSnapshot()).not.toBe(first)
  })

  test("notifies once per change and stops after unsubscribe", () => {
    const { store } = setup()
    const listener = vi.fn()
    const unsubscribe = store.subscribe(listener)

    store.add("Pay the bill")
    expect(listener).toHaveBeenCalledTimes(1)

    unsubscribe()
    store.add("Book tickets")
    expect(listener).toHaveBeenCalledTimes(1)
  })

  test("a change from another tab replaces the state and notifies", () => {
    const { store, fromOtherTab } = setup()
    const listener = vi.fn()
    store.subscribe(listener)
    const task = completeTask(
      createTask("b", "Book tickets", "2026-11-14T09:00:00.000Z"),
      "2026-11-14T09:30:00.000Z"
    )

    fromOtherTab(stored({ tasks: [task], ui: { doneCollapsed: true } }))
    expect(store.getSnapshot()).toMatchObject({
      tasks: [task],
      doneCollapsed: true,
    })
    expect(listener).toHaveBeenCalledTimes(1)
  })

  test("unreadable data from another tab is ignored", () => {
    const { store, fromOtherTab } = setup()
    store.add("Pay the bill")
    const before = store.getSnapshot()

    fromOtherTab("{broken")
    expect(store.getSnapshot()).toBe(before)
  })
})
