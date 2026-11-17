import * as stylex from "@stylexjs/stylex"
import { CheckIcon, DotIcon } from "lucide-react"

import { Header } from "@/components/header"
import { Sheet, SheetEmpty, SheetSection } from "@/components/sheet"
import { TaskComposer, TaskCount, TaskList, useTasks } from "@/tasks"
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
  const { tasks, todo, done, doneCollapsed, add, setDoneCollapsed, toggle } =
    useTasks()

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
          <TaskComposer onAdd={add} />

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
                  <TaskList tasks={todo} onToggle={toggle} />
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
                badge={<TaskCount count={done.length} />}
                collapsed={doneCollapsed}
                onCollapsedChange={setDoneCollapsed}
              >
                {done.length > 0 ? (
                  <TaskList tasks={done} onToggle={toggle} />
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
