import * as stylex from "@stylexjs/stylex"
import { PlusIcon } from "lucide-react"

import { Button } from "@/components/button"
import { TextField } from "@/components/field"
import { Header } from "@/components/header"
import { Sheet, SheetEmpty, SheetSection } from "@/components/sheet"
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
  plusIcon: {
    color: colors.accent,
  },
  form: {
    gap: spacing.space2,
    alignItems: "end",
    display: "flex",
    flexGrow: 1,
    paddingBottom: spacing.space6,
    paddingTop: spacing.space1,
  },
})

function App() {
  return (
    <div {...stylex.props(styles.root)}>
      <Header />

      <main {...stylex.props(styles.main)}>
        <h1 {...stylex.props(styles.heading)}>My Tasks</h1>
        <p {...stylex.props(styles.meta)}>No tasks yet</p>

        <Sheet>
          <SheetSection
            margin={<PlusIcon size={20} {...stylex.props(styles.plusIcon)} />}
          >
            <form {...stylex.props(styles.form)}>
              <TextField
                label="New Task"
                placeholder="What needs doing?"
                fluid
              />
              <Button type="submit" size="icon" aria-label="Add task">
                <PlusIcon size={20} />
              </Button>
            </form>
          </SheetSection>

          <SheetEmpty
            title="Start your list"
            description="Type the first thing you need to do in the field above and press Enter. Your tasks are saved in this browser, on this device."
          />
        </Sheet>
      </main>
    </div>
  )
}

export default App
