import * as stylex from "@stylexjs/stylex"
import { CheckIcon, DotIcon } from "lucide-react"
import { useRef, useState } from "react"
import { flushSync } from "react-dom"

import { Header } from "@/components/header"
import { announce, LiveRegion } from "@/components/live-region"
import { Sheet, SheetEmpty, SheetSection } from "@/components/sheet"
import {
  type DoneTask,
  doneToast,
  highlightTask,
  TaskComposer,
  type TaskComposerHandle,
  TaskCount,
  TaskList,
  type TaskListHandle,
  TaskToast,
  type TaskToastState,
  useTasks,
} from "@/tasks"
import { colors, sizes, spacing, typography } from "@/tokens.stylex"

const styles = stylex.create({
  root: {
    backgroundColor: colors.background,
    color: colors.textPrimary,
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSizeMd,
    lineHeight: typography.lineHeightMd,
    minHeight: "100vh",
  },
  main: {
    marginInline: "auto",
    paddingBlock: spacing.space6,
    paddingInline: spacing.space4,
    maxWidth: sizes.contentMaxWidth,
  },
  heading: {
    fontSize: typography.fontSizeXl,
    fontWeight: typography.fontWeightSemibold,
    marginBottom: spacing.space1,
  },
  meta: {
    alignItems: "center",
    color: colors.textMuted,
    display: "inline-flex",
    fontSize: typography.fontSizeSm,
    lineHeight: typography.lineHeightSm,
    marginBottom: spacing.space4,
  },
})

function App() {
  const composerRef = useRef<TaskComposerHandle>(null)
  const todoListRef = useRef<TaskListHandle>(null)
  const doneSectionToggleRef = useRef<HTMLButtonElement>(null)
  const { tasks, todo, done, doneCollapsed, add, setDoneCollapsed, toggle } =
    useTasks()

  const [toast, setToast] = useState<TaskToastState | null>(null)

  const dismissToast = (id: number) =>
    setToast((current) => (current?.id === id ? null : current))

  const dismissToastFor = (taskId: string) =>
    setToast((current) => (current?.taskId === taskId ? null : current))

  function handleDoneCollapse(collapsed: boolean) {
    setDoneCollapsed(collapsed)
    announce(collapsed ? "Done tasks hidden" : "Done tasks shown")
  }

  function handleUndo(task: DoneTask) {
    flushSync(() => {
      toggle(task.id)
      highlightTask(task.id)
    })
    todoListRef.current?.focusCheckbox(task.id)
    announce(`Undone. ${task.title} is back in To do`)
    setToast(null)
  }

  function handleComplete(id: string) {
    toggle(id)
    setToast(doneToast(id))
  }

  function handleReopen(id: string) {
    toggle(id)
    dismissToastFor(id)
  }

  return (
    <div {...stylex.props(styles.root)}>
      <Header />

      <main {...stylex.props(styles.main)}>
        <h1 {...stylex.props(styles.heading)}>My tasks</h1>
        <p {...stylex.props(styles.meta)}>
          {tasks.length === 0 ? (
            "No tasks yet"
          ) : (
            <>
              {todo.length} to do <DotIcon size={20} /> {done.length} done
            </>
          )}
        </p>

        <Sheet>
          <TaskComposer ref={composerRef} onAdd={add} />

          {tasks.length === 0 ? (
            <SheetEmpty
              size="lg"
              title="Start your list"
              description="Type the first thing you need to do in the field above and press Enter. Your tasks are saved in this browser, on this device."
            />
          ) : (
            <>
              <SheetSection
                title="To do"
                badge={<TaskCount count={todo.length} />}
              >
                {todo.length > 0 ? (
                  <TaskList
                    ref={todoListRef}
                    tasks={todo}
                    onToggle={handleComplete}
                    focusFallback={() => composerRef.current?.focus()}
                  />
                ) : (
                  <SheetEmpty
                    marker={<CheckIcon size={20} aria-hidden="true" />}
                    title="All done. Nothing left to do."
                    description="New tasks you add will appear here."
                  />
                )}
              </SheetSection>

              <SheetSection
                toggleRef={doneSectionToggleRef}
                title="Done"
                badge={<TaskCount count={done.length} />}
                collapsed={doneCollapsed}
                onCollapsedChange={handleDoneCollapse}
              >
                {done.length > 0 ? (
                  <TaskList
                    tasks={done}
                    onToggle={handleReopen}
                    focusFallback={() => doneSectionToggleRef.current?.focus()}
                  />
                ) : (
                  <SheetEmpty
                    title="Nothing finished yet"
                    description="Tick a task’s checkbox and it moves here."
                  />
                )}
              </SheetSection>
            </>
          )}
        </Sheet>

        {toast && (
          <TaskToast
            key={toast.id}
            toast={toast}
            tasks={tasks}
            onUndo={handleUndo}
            onDismiss={dismissToast}
          />
        )}
      </main>

      <LiveRegion />
    </div>
  )
}

export default App
