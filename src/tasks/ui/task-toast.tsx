import { CheckIcon } from "lucide-react"

import { Toast } from "@/components/toast"

import type { DoneTask, Task } from "../model"
import type { TaskToastState } from "./task-toast-state"

type TaskToastProps = {
  toast: TaskToastState
  tasks: Task[]
  onUndo: (task: DoneTask) => void
  onDismiss: (id: number) => void
}

/**
 * The toast for a change to a task. Render one at a time, keyed by
 * `toast.id`. It renders nothing once the change no longer stands, for
 * example when the task was reopened, deleted or changed in another tab.
 */
export function TaskToast({ toast, tasks, onUndo, onDismiss }: TaskToastProps) {
  switch (toast.kind) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- one kind for now; each new kind gets a case here
    case "done": {
      const task = tasks.find((task) => task.id === toast.taskId)
      if (!task?.done) return null

      return (
        <Toast
          icon={<CheckIcon size={18} />}
          actionLabel="Undo"
          onAction={() => onUndo(task)}
          onTimeout={() => onDismiss(toast.id)}
        >
          {`Marked as done: ${task.title}`}
        </Toast>
      )
    }
  }
}
