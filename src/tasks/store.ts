import {
  completeTask,
  createTask,
  renameTask,
  reopenTask,
  type Task,
  type TitleResult,
  validateTitle,
} from "./model"
import { parseStoredState, STORAGE_KEY, type StoredState } from "./storage"

export const BACKUP_KEY = `${STORAGE_KEY}.backup`

type TaskStoreOptions = {
  getStorage: () => Pick<Storage, "getItem" | "setItem">
  now?: () => string
  newId?: () => string
  onOtherTabChange?: (listener: (raw: string | null) => void) => () => void
}

export type TaskStoreSnapshot = {
  tasks: Task[]
  doneCollapsed: boolean
  saveStatus: "saved" | "failed"
  loadError: "unreadable" | null
}

export type TaskStore = {
  getSnapshot: () => TaskStoreSnapshot
  subscribe: (listener: () => void) => () => void
  add: (rawTitle: string) => TitleResult
  rename: (
    id: string,
    rawTitle: string
  ) => TitleResult | { ok: true; unchanged: true }
  toggle: (id: string) => void
  remove: (id: string) => void
  setDoneCollapsed: (collapsed: boolean) => void
  retrySave: () => boolean
  destroy: () => void
}

export function createTaskStore({
  getStorage,
  now = () => new Date().toISOString(),
  newId = () => crypto.randomUUID(),
  onOtherTabChange,
}: TaskStoreOptions): TaskStore {
  const listeners = new Set<() => void>()

  function write(key: string, value: string): "saved" | "failed" {
    try {
      getStorage().setItem(key, value)
      return "saved"
    } catch {
      return "failed"
    }
  }

  function save(tasks: Task[], doneCollapsed: boolean) {
    const stored: StoredState = { version: 1, tasks, ui: { doneCollapsed } }
    return write(STORAGE_KEY, JSON.stringify(stored))
  }

  function load(): TaskStoreSnapshot {
    const empty: TaskStoreSnapshot = {
      tasks: [],
      doneCollapsed: false,
      saveStatus: "saved",
      loadError: null,
    }

    let raw: string | null
    try {
      raw = getStorage().getItem(STORAGE_KEY)
    } catch {
      // Storage is blocked: work in memory and show the banner.
      return { ...empty, saveStatus: "failed" }
    }

    const result = parseStoredState(raw)
    if (result.ok) {
      return {
        ...empty,
        tasks: result.state.tasks,
        doneCollapsed: result.state.ui.doneCollapsed,
      }
    }

    // Unreadable data: keep a copy, start empty and say so.
    return {
      ...empty,
      loadError: "unreadable",
      saveStatus: write(BACKUP_KEY, result.raw),
    }
  }

  // The current state lives in this variable, outside React. A change
  // replaces the whole object, so React can tell that something changed.
  let snapshot = load()

  function notify() {
    listeners.forEach((listener) => listener())
  }

  // Every change goes through here: new state, save, tell the subscribers.
  function commit(tasks: Task[], doneCollapsed: boolean) {
    const saveStatus = save(tasks, doneCollapsed)
    snapshot = { ...snapshot, tasks, doneCollapsed, saveStatus }
    notify()
  }

  function updateTask(id: string, update: (task: Task) => Task) {
    const tasks = snapshot.tasks.map((task) =>
      task.id === id ? update(task) : task
    )
    commit(tasks, snapshot.doneCollapsed)
  }

  const stopListeningToOtherTabs = onOtherTabChange?.((raw) => {
    const result = parseStoredState(raw)
    // Data that can't be read is ignored, and this tab keeps its state.
    if (!result.ok) return

    snapshot = {
      ...snapshot,
      tasks: result.state.tasks,
      doneCollapsed: result.state.ui.doneCollapsed,
    }
    notify()
  })

  return {
    getSnapshot: () => snapshot,

    subscribe(listener) {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },

    add(rawTitle) {
      const result = validateTitle(rawTitle)
      if (result.ok) {
        const task = createTask(newId(), result.title, now())
        commit([task, ...snapshot.tasks], snapshot.doneCollapsed)
      }
      return result
    },

    rename(id, rawTitle) {
      const result = validateTitle(rawTitle)
      if (!result.ok) return result

      const current = snapshot.tasks.find((task) => task.id === id)
      if (!current || current.title === result.title) {
        return { ok: true, unchanged: true }
      }

      updateTask(id, (task) => renameTask(task, result.title, now()))
      return result
    },

    toggle(id) {
      updateTask(id, (task) =>
        task.done ? reopenTask(task) : completeTask(task, now())
      )
    },

    remove(id) {
      const tasks = snapshot.tasks.filter((task) => task.id !== id)
      commit(tasks, snapshot.doneCollapsed)
    },

    setDoneCollapsed(collapsed) {
      commit(snapshot.tasks, collapsed)
    },

    retrySave() {
      const saveStatus = save(snapshot.tasks, snapshot.doneCollapsed)
      snapshot = { ...snapshot, saveStatus }
      notify()
      return saveStatus === "saved"
    },

    destroy() {
      stopListeningToOtherTabs?.()
      listeners.clear()
    },
  }
}
