import * as stylex from "@stylexjs/stylex"
import { PlusIcon } from "lucide-react"
import { type SubmitEvent, useRef, useState } from "react"

import { Button } from "@/components/button"
import { TextField } from "@/components/field"
import { sheetLayout } from "@/components/sheet"
import { colors, sizes, spacing, typography } from "@/tokens.stylex"

import { type TitleError, type TitleResult, validateTitle } from "../model"
import { titleErrorMessage } from "./title-messages"

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

const EMPTY: TitleError = { ok: false, error: "empty" }

type TaskComposerProps = { onAdd: (title: string) => TitleResult }

export function TaskComposer({ onAdd }: TaskComposerProps) {
  const [title, setTitle] = useState("")
  // An empty field is normal, so "empty" shows only after a submit.
  const [triedEmpty, setTriedEmpty] = useState(false)
  const fieldRef = useRef<HTMLTextAreaElement>(null)

  // "long" follows the text while it is typed.
  const live = validateTitle(title)
  const tooLong = !live.ok && live.error === "long" ? live : null
  const error = tooLong ?? (triedEmpty ? EMPTY : null)

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    fieldRef.current?.focus()
    if (tooLong) return // the error is on screen; keep the text

    if (onAdd(title).ok) setTitle("")
    else setTriedEmpty(true)
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
          autoComplete="off"
          fluid
          value={title}
          error={error ? titleErrorMessage(error) : undefined}
          onInput={(event) => {
            setTitle(event.currentTarget.value)
            setTriedEmpty(false)
          }}
          submitOnEnter
        />

        <Button type="submit" size="icon" aria-label="Add task">
          <PlusIcon size={20} aria-hidden="true" />
        </Button>
      </form>
    </div>
  )
}
