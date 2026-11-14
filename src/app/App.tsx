import * as stylex from "@stylexjs/stylex"
import { CheckIcon } from "lucide-react"
import { useState } from "react"

import { Header } from "@/components/header"
import { Sheet, SheetEmpty, SheetSection } from "@/components/sheet"
import {
  completeTask,
  createTask,
  type Task,
  TaskComposer,
  TaskCount,
  TaskList,
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
    color: colors.textMuted,
    fontSize: typography.fontSizeMd,
    marginBottom: spacing.space4,
  },
})

function App() {
  const [tasks] = useState<Task[]>([
    createTask(
      crypto.randomUUID(),
      "Book train tickets to Lviv",
      new Date().toISOString()
    ),
    completeTask(
      createTask(
        crypto.randomUUID(),
        "Pay the electricity bill",
        new Date().toISOString()
      ),
      new Date().toISOString()
    ),
  ])
  const todoTasks = tasks.filter((task) => !task.done)
  const doneTasks = tasks.filter((task) => task.done)
  const [doneCollapsed, setDoneCollapsed] = useState(false)

  return (
    <div {...stylex.props(styles.root)}>
      <Header />

      <main {...stylex.props(styles.main)}>
        <h1 {...stylex.props(styles.heading)}>My Tasks</h1>
        <p {...stylex.props(styles.meta)}>No tasks yet</p>

        <Sheet>
          <TaskComposer onSubmit={(event) => event.preventDefault()} />

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
                badge={<TaskCount count={todoTasks.length} />}
              >
                {todoTasks.length > 0 ? (
                  <TaskList tasks={todoTasks} />
                ) : (
                  <SheetEmpty
                    marker={<CheckIcon size={20} aria-hidden="true" />}
                    title="All done. Nothing left to do."
                    description="New tasks you add will appear here."
                  />
                )}
              </SheetSection>

              <SheetSection
                title="Done"
                badge={<TaskCount count={doneTasks.length} />}
                collapsed={doneCollapsed}
                onCollapsedChange={setDoneCollapsed}
              >
                {doneTasks.length > 0 ? (
                  <TaskList tasks={doneTasks} />
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
      </main>
    </div>
  )
}

export default App
