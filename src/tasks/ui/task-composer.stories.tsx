import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, fn, waitFor } from "storybook/test"

import { LiveRegion } from "@/components/live-region"
import { Sheet } from "@/components/sheet"

import { createTask, validateTitle } from "../model"
import type { AddResult } from "../store"
import { clearHighlight, highlighter } from "./highlight"
import { TaskComposer } from "./task-composer"

// Validates like the store does, without saving anything.
function add(title: string): AddResult {
  const result = validateTitle(title)
  if (!result.ok) return result
  return {
    ok: true,
    task: createTask("task-1", result.title, "2026-11-17T10:00:00.000Z"),
  }
}

const meta = {
  title: "Tasks/TaskComposer",
  component: TaskComposer,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "The New task row at the top of the sheet. Enter or Add task adds the task, clears the field and keeps focus in it. An empty title shows its error after a submit; a title over 200 characters shows its error while typing and is kept as typed. The counter appears from 180 characters.",
      },
    },
  },
  decorators: [
    (Story) => (
      <>
        <Sheet>
          <Story />
        </Sheet>
        <LiveRegion />
      </>
    ),
  ],
  args: {
    onAdd: fn(add),
  },
  // The add above always creates task-1; leave no highlight behind.
  beforeEach: () => () => {
    clearHighlight("task-1")
  },
} satisfies Meta<typeof TaskComposer>

export default meta
type Story = StoryObj<typeof meta>

const field = (canvas: { getByRole: (role: "textbox") => HTMLElement }) =>
  canvas.getByRole("textbox") as HTMLTextAreaElement

export const Default: Story = {}

export const AddWithEnter: Story = {
  play: async ({ args, canvas, userEvent }) => {
    const input = field(canvas)

    await userEvent.type(input, "  Pay the electricity bill {Enter}")
    await expect(args.onAdd).toHaveBeenCalledWith("  Pay the electricity bill ")
    await expect(input.value).toBe("")
    await expect(input).toHaveFocus()
    await expect(highlighter.getHighlightedId()).toBe("task-1")
    await waitFor(() =>
      expect(
        canvas.getByText("Task added: Pay the electricity bill")
      ).toBeInTheDocument()
    )
  },
}

export const AddWithButton: Story = {
  play: async ({ args, canvas, userEvent }) => {
    const input = field(canvas)

    await userEvent.type(input, "Book train tickets")
    await userEvent.click(canvas.getByRole("button", { name: "Add task" }))
    await expect(args.onAdd).toHaveBeenCalledWith("Book train tickets")
    // The button must not keep focus: the next task goes straight in.
    await expect(input).toHaveFocus()
  },
}

export const EmptyTitle: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "An empty field is not an error until a submit. Typing again clears the error.",
      },
    },
  },
  play: async ({ canvas, userEvent }) => {
    const input = field(canvas)
    await expect(input).not.toBeInvalid()

    await userEvent.type(input, "   {Enter}")
    await expect(input).toBeInvalid()
    await expect(highlighter.getHighlightedId()).toBeNull()
    await expect(input).toHaveAccessibleDescription(
      "Type a task title — it can’t be empty or only spaces."
    )

    await userEvent.type(input, "P")
    await expect(input).not.toBeInvalid()
  },
}

export const TitleTooLong: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Over 200 characters the error shows while typing, the submit is blocked and the text stays, so nothing typed is lost.",
      },
    },
  },
  play: async ({ args, canvas, userEvent }) => {
    const input = field(canvas)

    await userEvent.click(input)
    await userEvent.paste("a".repeat(201))
    await expect(input).toBeInvalid()
    await expect(
      canvas.getByText("Shorten the title by 1 character — the limit is 200.")
    ).toBeInTheDocument()
    await expect(canvas.getByText("201/200")).toBeInTheDocument()

    await userEvent.keyboard("{Enter}")
    await expect(args.onAdd).not.toHaveBeenCalled()
    await expect(input.value).toHaveLength(201)
  },
}

export const Counter: Story = {
  parameters: {
    docs: {
      description: {
        story: "The counter appears at 180 characters, 20 before the limit.",
      },
    },
  },
  play: async ({ canvas, userEvent }) => {
    const input = field(canvas)

    await userEvent.click(input)
    await userEvent.paste("a".repeat(179))
    await expect(canvas.queryByText("179/200")).toBeNull()

    await userEvent.type(input, "a")
    await expect(canvas.getByText("180/200")).toBeInTheDocument()
  },
}
