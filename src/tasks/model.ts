type TaskBase = {
  id: string
  title: string
  createdAt: string
  updatedAt: string
}

export type Task = TaskBase &
  ({ done: false; completedAt: null } | { done: true; completedAt: string })

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
