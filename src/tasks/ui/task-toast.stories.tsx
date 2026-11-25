import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, fn } from "storybook/test"

import { completeTask, createTask } from "../model"
import { TaskToast } from "./task-toast"
import { doneToast } from "./task-toast-state"

const CREATED = "2026-11-17T10:00:00.000Z"

const open = createTask("pay", "Pay the electricity bill", CREATED)
const done = completeTask(open, CREATED)

const meta = {
  title: "Tasks/TaskToast",
  component: TaskToast,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    // The toast is fixed to the bottom of the screen: give every story its own
    // frame in the docs, or they all stack in one place.
    docs: {
      story: { inline: false, height: "120px" },
      description: {
        component:
          "The toast for a change to a task. `toast` says what happened and to which task; the task itself is looked up in `tasks` on every render. If the change no longer stands, the toast renders nothing. The app keeps one toast at a time and removes it on `onDismiss`.",
      },
    },
  },
  args: {
    toast: doneToast("pay"),
    tasks: [done],
    onUndo: fn(),
    onDismiss: fn(),
  },
} satisfies Meta<typeof TaskToast>

export default meta
type Story = StoryObj<typeof meta>

export const Done: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "After a tick: the title and Undo. Undo hands the task to `onUndo`; putting it back is up to the app.",
      },
    },
  },
  play: async ({ args, canvas, userEvent }) => {
    await expect(
      canvas.getByText("Marked as done: Pay the electricity bill")
    ).toBeVisible()

    await userEvent.click(canvas.getByRole("button", { name: "Undo" }))

    await expect(args.onUndo).toHaveBeenCalledOnce()
    await expect(args.onUndo).toHaveBeenCalledWith(done)
    await expect(args.onDismiss).not.toHaveBeenCalled()
  },
}

export const Reopened: Story = {
  args: {
    tasks: [open],
  },
  parameters: {
    docs: {
      description: {
        story:
          "The task is back in To do, so there is nothing to undo and the toast renders nothing.",
      },
    },
  },
  play: async ({ canvas }) => {
    await expect(canvas.queryByText(/Marked as done/)).not.toBeInTheDocument()
    await expect(
      canvas.queryByRole("button", { name: "Undo" })
    ).not.toBeInTheDocument()
  },
}

export const Deleted: Story = {
  args: {
    tasks: [],
  },
  parameters: {
    docs: {
      description: {
        story: "The task is gone, so the toast renders nothing.",
      },
    },
  },
  play: async ({ canvas }) => {
    await expect(canvas.queryByText(/Marked as done/)).not.toBeInTheDocument()
    await expect(
      canvas.queryByRole("button", { name: "Undo" })
    ).not.toBeInTheDocument()
  },
}
