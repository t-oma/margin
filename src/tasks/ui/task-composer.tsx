import * as stylex from "@stylexjs/stylex"
import { PlusIcon } from "lucide-react"
import type { SubmitEventHandler } from "react"

import { Button } from "@/components/button"
import { TextField } from "@/components/field"
import { sheetLayout } from "@/components/sheet"
import { colors, sizes, spacing, typography } from "@/tokens.stylex"

const styles = stylex.create({
  root: {
    borderBottomColor: colors.border,
    borderBottomStyle: "solid",
    borderBottomWidth: "1px",
  },
  // Centers the plus icon on the input, which sits below the field label.
  marker: {
    alignItems: "center",
    display: "flex",
    height: sizes.touchTarget,
    marginTop: `calc(${spacing.space3} + ${typography.lineHeightSm} + ${spacing.space1})`,
  },
  form: {
    gap: spacing.space2,
    alignItems: "end",
    display: "flex",
    paddingBottom: spacing.space8,
    paddingTop: spacing.space3,
  },
})

type TaskComposerProps = { onSubmit: SubmitEventHandler<HTMLFormElement> }

export function TaskComposer({ onSubmit }: TaskComposerProps) {
  return (
    <div {...stylex.props(sheetLayout.row, styles.root)}>
      <div {...stylex.props(sheetLayout.margin)}>
        <span {...stylex.props(styles.marker)}>
          <PlusIcon size={20} aria-hidden="true" />
        </span>
      </div>

      <form
        onSubmit={onSubmit}
        {...stylex.props(sheetLayout.body, styles.form)}
      >
        <TextField label="New Task" placeholder="What needs doing?" fluid />

        <Button type="submit" size="icon" aria-label="Add task">
          <PlusIcon size={20} aria-hidden="true" />
        </Button>
      </form>
    </div>
  )
}
