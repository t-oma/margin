import * as stylex from "@stylexjs/stylex"
import { PlusIcon } from "lucide-react"
import {
  type Ref,
  type SubmitEvent,
  useImperativeHandle,
  useRef,
  useState,
} from "react"

import { Button } from "@/components/button"
import { TextField } from "@/components/field"
import { announce } from "@/components/live-region"
import { sheetLayout } from "@/components/sheet"
import { colors, sizes, spacing, typography } from "@/tokens.stylex"

import {
  TASK_MAX_TITLE_LENGTH,
  type TitleError,
  titleLength,
  validateTitle,
} from "../model"
import type { AddResult } from "../store"
import { highlightTask } from "./highlight"
import { titleErrorMessage } from "./title-messages"

const styles = stylex.create({
  root: {
    borderBottomColor: colors.border,
    borderBottomStyle: "solid",
    borderBottomWidth: "1px",
  },
  // Centers the plus icon on the field's first line.
  marker: {
    alignItems: "center",
    display: "flex",
    height: sizes.touchTarget,
    marginTop: `calc(${spacing.space3} + ${typography.lineHeightSm} + ${spacing.space1})`,
  },
  form: {
    gap: spacing.space2,
    alignItems: "flex-start",
    display: "flex",
    paddingBottom: spacing.space3,
    paddingTop: spacing.space3,
  },
  // Lines the button up with the field, which sits below the field label.
  action: {
    marginTop: `calc(${typography.lineHeightSm} + ${spacing.space1})`,
  },
})

const EMPTY: TitleError = { ok: false, error: "empty" }

// The counter shows from this length up, before the limit is reached.
const COUNTER_FROM = 180

export type TaskComposerHandle = { focus: () => void }

type TaskComposerProps = {
  ref?: Ref<TaskComposerHandle>
  onAdd: (title: string) => AddResult
}

export function TaskComposer({ ref, onAdd }: TaskComposerProps) {
  const [title, setTitle] = useState("")
  // An empty field is normal, so "empty" shows only after a submit.
  const [triedEmpty, setTriedEmpty] = useState(false)
  const fieldRef = useRef<HTMLTextAreaElement>(null)

  useImperativeHandle(
    ref,
    () => ({
      focus: () => fieldRef.current?.focus(),
    }),
    []
  )

  // "long" follows the text while it is typed.
  const live = validateTitle(title)
  const tooLong = !live.ok && live.error === "long" ? live : null
  const error = tooLong ?? (triedEmpty ? EMPTY : null)
  const length = titleLength(title)

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    fieldRef.current?.focus() // the Add task button must not keep focus

    if (tooLong) {
      // The error is already on screen: keep the text and say it again.
      announce(titleErrorMessage(tooLong))
      return
    }

    const result = onAdd(title)
    if (result.ok) {
      setTitle("")
      highlightTask(result.task.id)
      announce(`Task added: ${result.task.title}`)
    } else {
      setTriedEmpty(true)
      announce(titleErrorMessage(result))
    }
  }

  return (
    <div {...stylex.props(sheetLayout.row, styles.root)}>
      <div {...stylex.props(sheetLayout.margin)}>
        <span {...stylex.props(styles.marker)}>
          <PlusIcon size={20} aria-hidden="true" />
        </span>
      </div>

      <form
        onSubmit={handleSubmit}
        {...stylex.props(sheetLayout.body, styles.form)}
      >
        <TextField
          ref={fieldRef}
          label="New task"
          placeholder="What needs doing?"
          hint="Press Enter to add"
          counter={
            length >= COUNTER_FROM
              ? `${String(length)}/${String(TASK_MAX_TITLE_LENGTH)}`
              : undefined
          }
          autoComplete="off"
          spellCheck
          submitOnEnter
          fluid
          value={title}
          error={error ? titleErrorMessage(error) : undefined}
          onInput={(event) => {
            setTitle(event.currentTarget.value)
            setTriedEmpty(false)
          }}
        />

        <div {...stylex.props(styles.action)}>
          <Button type="submit" size="icon" aria-label="Add task">
            <PlusIcon size={20} aria-hidden="true" />
          </Button>
        </div>
      </form>
    </div>
  )
}
