import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, fireEvent, fn, waitFor } from "storybook/test"

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

const meta = {
  title: "Tasks/TaskList",
  component: TaskList,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "The rows of one section. A row the user has just added, changed or brought back is tinted for 1.6 s and then fades over 600 ms; with reduced motion the tint goes without a fade.",
      },
    },
  },
  decorators: [
    (Story) => (
      <Sheet>
        <Story />
      </Sheet>
    ),
  ],
  args: {
    tasks: todo,
    onToggle: fn(),
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

export const Default: Story = {}

export const Done: Story = {
  args: {
    tasks: todo.map((task) => completeTask(task, CREATED)),
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
