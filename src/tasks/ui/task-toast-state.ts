// What the toast is about, not how it acts: the task is looked up when the
// toast renders, so it never acts on a task that has changed since.
export type TaskToastState = { id: number; kind: "done"; taskId: string }

let lastId = 0

// Every toast gets a new id, so a new toast starts its own timer even when it
// is about the same task.
export function doneToast(taskId: string): TaskToastState {
  lastId += 1
  return { id: lastId, kind: "done", taskId }
}
