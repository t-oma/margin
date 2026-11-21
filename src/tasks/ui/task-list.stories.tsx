import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, fireEvent, fn, waitFor } from "storybook/test"

import { announce, LiveRegion } from "@/components/live-region"
import { Sheet } from "@/components/sheet"

import { completeTask, createTask } from "../model"
import { clearHighlight, highlighter, highlightTask } from "./highlight"
import { TaskList } from "./task-list"

const CREATED = "2026-11-17T10:00:00.000Z"

const todo = [
  createTask("pay", "Pay the electricity bill", CREATED),
  createTask(
    "lease",
    "Send Olena the signed lease and scans of both IDs before Friday so she can submit everything to the agency",
    CREATED
  ),
  createTask("tickets", "Book train tickets to Lviv", CREATED),
]

const done = todo.map((task) => completeTask(task, CREATED))

const meta = {
  title: "Tasks/TaskList",
  component: TaskList,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "The rows of one section. A row the user has just added, changed or brought back is tinted for 1.6 s and then fades over 600 ms; with reduced motion the tint goes without a fade. A ticked row leaves the list, so focus moves to the next row's checkbox, else the previous one, else to `focusFallback`, and the live region says where the task went. Screen readers hear Done titles as “Done: …”.",
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
    tasks: todo,
    onToggle: fn(),
    focusFallback: fn(),
  },
  // The announcer is shared by all stories: empty it, so a message from an
  // earlier story can't pass for this one's.
  beforeEach: () => {
    announce("")
  },
} satisfies Meta<typeof TaskList>

export default meta
type Story = StoryObj<typeof meta>

function rowOf(title: HTMLElement) {
  const row = title.closest("li")
  if (!row) throw new Error("The title is not inside a row")
  return row
}

const animationOf = (element: Element) =>
  getComputedStyle(element).animationName

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(
      rowOf(canvas.getByText("Pay the electricity bill"))
    ).not.toHaveTextContent("Done:")
  },
}

export const Done: Story = {
  args: {
    tasks: done,
  },
  play: async ({ canvas }) => {
    await expect(
      rowOf(canvas.getByText("Pay the electricity bill"))
    ).toHaveTextContent("Done: Pay the electricity bill")
  },
}

export const Highlighted: Story = {
  beforeEach: () => {
    highlightTask("pay")
    return () => {
      clearHighlight("pay")
    }
  },
  play: async ({ canvas, step }) => {
    const row = rowOf(canvas.getByText("Pay the electricity bill"))
    const other = rowOf(canvas.getByText("Book train tickets to Lviv"))

    await step("only the highlighted row plays the fade", async () => {
      await expect(animationOf(row)).not.toBe("none")
      await expect(animationOf(other)).toBe("none")
    })

    await step("an animation inside the row does not clear it", async () => {
      await fireEvent.animationEnd(
        canvas.getByRole("checkbox", {
          name: "Mark as done: Pay the electricity bill",
        })
      )
      await expect(highlighter.getHighlightedId()).toBe("pay")
    })

    await step("the highlight clears when the fade ends", async () => {
      await waitFor(
        async () => {
          await expect(animationOf(row)).toBe("none")
        },
        { timeout: 4000 }
      )
      await expect(highlighter.getHighlightedId()).toBeNull()
    })
  },
}

export const TickHighlighted: Story = {
  beforeEach: () => {
    highlightTask("pay")
    return () => {
      clearHighlight("pay")
    }
  },
  parameters: {
    docs: {
      description: {
        story:
          "Ticking a highlighted row clears its highlight, so it does not flash again in Done.",
      },
    },
  },
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(
      canvas.getByRole("checkbox", {
        name: "Mark as done: Pay the electricity bill",
      })
    )

    await expect(args.onToggle).toHaveBeenCalledWith("pay")
    await expect(highlighter.getHighlightedId()).toBeNull()
    await expect(
      animationOf(rowOf(canvas.getByText("Pay the electricity bill")))
    ).toBe("none")
  },
}

export const TickMovesFocusToNext: Story = {
  parameters: {
    docs: {
      description: {
        story: "Focus moves to the checkbox of the row below the ticked one.",
      },
    },
  },
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(
      canvas.getByRole("checkbox", { name: /^Mark as done: Send Olena/ })
    )

    await expect(args.onToggle).toHaveBeenCalledWith("lease")
    await expect(
      canvas.getByRole("checkbox", {
        name: "Mark as done: Book train tickets to Lviv",
      })
    ).toHaveFocus()
    await expect(args.focusFallback).not.toHaveBeenCalled()
  },
}

export const TickLastMovesFocusToPrevious: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The last row has no row below it, so focus moves to the row above.",
      },
    },
  },
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(
      canvas.getByRole("checkbox", {
        name: "Mark as done: Book train tickets to Lviv",
      })
    )

    await expect(args.onToggle).toHaveBeenCalledWith("tickets")
    await expect(
      canvas.getByRole("checkbox", { name: /^Mark as done: Send Olena/ })
    ).toHaveFocus()
    await expect(args.focusFallback).not.toHaveBeenCalled()
  },
}

export const TickOnlyRowUsesFallback: Story = {
  args: {
    tasks: todo.slice(0, 1),
  },
  parameters: {
    docs: {
      description: {
        story:
          "No row is left to take focus, so the list calls `focusFallback`. In the app that is New task for To do and the Hide/Show toggle for Done.",
      },
    },
  },
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(
      canvas.getByRole("checkbox", {
        name: "Mark as done: Pay the electricity bill",
      })
    )

    await expect(args.onToggle).toHaveBeenCalledWith("pay")
    await expect(args.focusFallback).toHaveBeenCalledOnce()
  },
}

export const TickAnnounces: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(
      canvas.getByRole("checkbox", {
        name: "Mark as done: Pay the electricity bill",
      })
    )

    await waitFor(() =>
      expect(
        canvas.getByText("Marked as done: Pay the electricity bill")
      ).toBeInTheDocument()
    )
  },
}

export const UntickAnnounces: Story = {
  args: {
    tasks: done,
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(
      canvas.getByRole("checkbox", {
        name: "Mark as not done: Pay the electricity bill",
      })
    )

    await waitFor(() =>
      expect(
        canvas.getByText("Pay the electricity bill moved back to To do")
      ).toBeInTheDocument()
    )
  },
}
