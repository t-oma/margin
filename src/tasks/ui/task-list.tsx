import * as stylex from "@stylexjs/stylex"
import { type Ref, type RefCallback, useImperativeHandle, useRef } from "react"

import { Checkbox } from "@/components/checkbox"
import { announce } from "@/components/live-region"
import { sheetLayout } from "@/components/sheet"
import { VisuallyHidden } from "@/components/visually-hidden"
import { colors, media, motion, spacing } from "@/tokens.stylex"

import { neighborTask, type Task } from "../model"
import { clearHighlight, useIsHighlighted } from "./highlight"

// A new or changed row is tinted, then fades back to the page colour.
const fadeOut = stylex.keyframes({
  from: { backgroundColor: colors.accentTint },
  to: { backgroundColor: "transparent" },
})

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
  // The tint holds for 1.6 s, then fades over 600 ms.
  highlighted: {
    animationDelay: motion.delayHighlight,
    animationDuration: motion.durationHighlight,
    // Shows the tint during the delay as well.
    animationFillMode: "backwards",
    animationName: fadeOut,
    // With reduced motion the tint stays to the end and goes without a fade.
    animationTimingFunction: {
      default: motion.easing,
      [media.reducedMotion]: "step-end",
    },
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

export type TaskListHandle = {
  focusCheckbox: (id: string) => void
}

type TaskListProps = {
  ref?: Ref<TaskListHandle>
  tasks: Task[]
  onToggle: (id: string) => void
  focusFallback: () => void
}

export function TaskList({
  ref,
  tasks,
  onToggle,
  focusFallback,
}: TaskListProps) {
  const checkboxes = useRef(new Map<string, HTMLInputElement>())

  useImperativeHandle(
    ref,
    () => ({
      focusCheckbox: (id) => {
        checkboxes.current.get(id)?.focus()
      },
    }),
    []
  )

  function checkboxRef(id: string): RefCallback<HTMLInputElement> {
    return (element) => {
      if (!element) return
      checkboxes.current.set(id, element)

      return () => {
        checkboxes.current.delete(id)
      }
    }
  }

  function handleToggle(id: string) {
    const neighbor = neighborTask(tasks, id)
    const checkbox = neighbor ? checkboxes.current.get(neighbor.id) : undefined
    if (checkbox) checkbox.focus()
    else focusFallback()
    onToggle(id)
  }

  return (
    <ul role="list" {...stylex.props(styles.root)}>
      {tasks.map((task) => (
        <TaskRow
          key={task.id}
          task={task}
          onToggle={handleToggle}
          checkboxRef={checkboxRef(task.id)}
        />
      ))}
    </ul>
  )
}

type TaskRowProps = {
  task: Task
  onToggle: (id: string) => void
  checkboxRef: RefCallback<HTMLInputElement>
}

function TaskRow({ task, onToggle, checkboxRef }: TaskRowProps) {
  const highlighted = useIsHighlighted(task.id)

  return (
    <li
      // The highlight plays once. Clearing it when it ends stops it from
      // playing again if the row is rendered anew.
      onAnimationEnd={(event) => {
        if (event.target === event.currentTarget) clearHighlight(task.id)
      }}
      {...stylex.props(
        sheetLayout.row,
        styles.task,
        highlighted && styles.highlighted
      )}
    >
      <div {...stylex.props(sheetLayout.margin, styles.taskMarker)}>
        <Checkbox
          ref={checkboxRef}
          checked={task.done}
          onChange={() => {
            // The task moves to the other list and must not flash there.
            clearHighlight(task.id)
            announce(
              task.done
                ? `${task.title} moved back to To do`
                : `Marked as done: ${task.title}`
            )
            onToggle(task.id)
          }}
          aria-label={`${task.done ? "Mark as not done" : "Mark as done"}: ${task.title}`}
        />
      </div>

      <div
        {...stylex.props(
          sheetLayout.body,
          styles.taskTitle,
          task.done && styles.taskDone
        )}
      >
        {task.done && <VisuallyHidden>Done: </VisuallyHidden>}
        {task.title}
      </div>
    </li>
  )
}
