import { useSyncExternalStore } from "react"

import { doneTasks, todoTasks } from "./model"
import { STORAGE_KEY } from "./storage"
import { createTaskStore } from "./store"

// One store for the whole app, created when this module first loads.
const taskStore = createTaskStore({
  getStorage: () => window.localStorage,
  onOtherTabChange(listener) {
    function handleStorage(event: StorageEvent) {
      // The key is null when another tab clears all of its storage.
      if (event.key === STORAGE_KEY || event.key === null) {
        listener(event.newValue)
      }
    }

    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  },
})

// Vite re-runs this module on hot reload; drop the old store's listener.
import.meta.hot?.dispose(() => taskStore.destroy())

export function useTasks() {
  const snapshot = useSyncExternalStore(
    taskStore.subscribe,
    taskStore.getSnapshot
  )

  return {
    ...snapshot,
    todo: todoTasks(snapshot.tasks),
    done: doneTasks(snapshot.tasks),
    add: taskStore.add,
    rename: taskStore.rename,
    toggle: taskStore.toggle,
    remove: taskStore.remove,
    setDoneCollapsed: taskStore.setDoneCollapsed,
    retrySave: taskStore.retrySave,
  }
}
