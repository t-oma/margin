type TaskBase = {
  id: string
  title: string
  createdAt: string
  updatedAt: string
}

export type Task = TaskBase &
  ({ done: false; completedAt: null } | { done: true; completedAt: string })

export type OpenTask = Extract<Task, { done: false }>
export type DoneTask = Extract<Task, { done: true }>

export const TASK_MAX_TITLE_LENGTH = 200

export function createTask(id: string, title: string, now: string): Task {
  return {
    id,
    title,
    done: false,
    createdAt: now,
    updatedAt: now,
    completedAt: null,
  }
}

export function completeTask(task: Task, now: string): Task {
  return { ...task, done: true, completedAt: now }
}

export function reopenTask(task: Task): Task {
  return { ...task, done: false, completedAt: null }
}

export function renameTask(task: Task, title: string, now: string): Task {
  return { ...task, title, updatedAt: now }
}

export type TitleResult =
  | { ok: true; title: string }
  | { ok: false; error: "empty" }
  | { ok: false; error: "long"; over: number }

export type TitleError = Extract<TitleResult, { ok: false }>

export function validateTitle(raw: string): TitleResult {
  const title = raw.replace(/\r\n|[\r\n]/g, " ").trim()
  // Counts code points, so an emoji such as 👍 is one character, not two.
  // eslint-disable-next-line @typescript-eslint/no-misused-spread -- the spec counts code points
  const length = [...title].length

  if (length === 0) return { ok: false, error: "empty" }
  if (length > TASK_MAX_TITLE_LENGTH) {
    return { ok: false, error: "long", over: length - TASK_MAX_TITLE_LENGTH }
  }

  return { ok: true, title }
}

// Timestamps all come from toISOString(), which has one fixed UTC format,
// so comparing them as strings compares them in time.
function newestFirst(a: string, b: string) {
  return a < b ? 1 : a > b ? -1 : 0
}

export function todoTasks(tasks: Task[]): OpenTask[] {
  return tasks
    .filter((task): task is OpenTask => !task.done)
    .sort((a, b) => newestFirst(a.createdAt, b.createdAt))
}

export function doneTasks(tasks: Task[]): DoneTask[] {
  return tasks
    .filter((task): task is DoneTask => task.done)
    .sort((a, b) => newestFirst(a.completedAt, b.completedAt))
}
