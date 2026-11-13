import * as stylex from "@stylexjs/stylex"

import { Checkbox } from "@/components/checkbox"
import { sheetLayout } from "@/components/sheet"
import { colors, spacing } from "@/tokens.stylex"

import type { Task } from "../model"

const styles = stylex.create({
  root: {},
  task: {
    borderTopColor: colors.borderRow,
    borderTopStyle: {
      default: "solid",
      ":first-child": "none",
    },
    borderTopWidth: "1px",
  },
  taskMarker: {
    paddingTop: "2px",
  },
  taskTitle: {
    paddingBlock: spacing.space3,
    overflowWrap: "anywhere",
  },
  taskDone: {
    color: colors.textMuted,
    textDecorationColor: colors.borderControl,
    textDecorationLine: "line-through",
    textDecorationThickness: "1.5px",
  },
})

type TaskListProps = { tasks: Task[] }

export function TaskList({ tasks }: TaskListProps) {
  return (
    <ul role="list" {...stylex.props(styles.root)}>
      {tasks.map((task) => (
        <li key={task.id} {...stylex.props(sheetLayout.row, styles.task)}>
          <div {...stylex.props(sheetLayout.margin, styles.taskMarker)}>
            <Checkbox
              defaultChecked={task.completed}
              aria-label={`${task.completed ? "Mark as not done" : "Mark as done"}: ${task.title}`}
            />
          </div>

          <div
            {...stylex.props(
              sheetLayout.body,
              styles.taskTitle,
              task.completed && styles.taskDone
            )}
          >
            {task.title}
          </div>
        </li>
      ))}
    </ul>
  )
}
