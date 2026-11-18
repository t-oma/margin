import type { Meta, StoryObj } from "@storybook/react-vite"
import * as stylex from "@stylexjs/stylex"
import { useId } from "react"
import { expect, isInaccessible } from "storybook/test"

import { Textarea } from "@/components/textarea"
import { visuallyHidden } from "@/styles/visually-hidden"

import { VisuallyHidden } from "./visually-hidden"

async function expectVisuallyHidden(element: HTMLElement) {
  const { width, height } = element.getBoundingClientRect()

  await expect(isInaccessible(element)).toBe(false)
  await expect(width).toBe(1)
  await expect(height).toBe(1)
}

function HiddenLabelExample() {
  const id = useId()

  return (
    <div>
      <label htmlFor={id} {...stylex.props(visuallyHidden.base)}>
        Edit task title
      </label>
      <Textarea id={id} defaultValue="Pay rent" />
    </div>
  )
}

const meta = {
  title: "Components/VisuallyHidden",
  component: VisuallyHidden,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    controls: {
      disable: true,
    },
    docs: {
      description: {
        component:
          "Hides content visually but keeps it for screen readers. Use it for context that sighted users get from the layout, such as the word 'tasks' after a count or a 'Done:' prefix on a finished task. The content takes no space in the layout. For an element other than span, such as a label, apply visuallyHidden.base from @/styles/visually-hidden instead.",
      },
    },
  },
  args: {
    children: "Done: ",
  },
  argTypes: {
    children: {
      description: "Text for screen readers only.",
      table: {
        type: { summary: "ReactNode" },
      },
    },
  },
} satisfies Meta<typeof VisuallyHidden>

export default meta
type Story = StoryObj<typeof meta>

export const TaskTitlePrefix: Story = {
  render: () => (
    <p>
      <VisuallyHidden>Done: </VisuallyHidden>
      Pay rent
    </p>
  ),
  play: async ({ canvas }) => {
    await expectVisuallyHidden(canvas.getByText("Done:"))
  },
  parameters: {
    docs: {
      description: {
        story:
          "Only 'Pay rent' is visible. A screen reader reads 'Done: Pay rent'. The play function checks that the hidden text stays in the accessibility tree and occupies a 1×1 box.",
      },
    },
  },
}

export const HiddenLabel: Story = {
  render: () => <HiddenLabelExample />,
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("textbox", { name: "Edit task title" })
    ).toBeInTheDocument()
    await expectVisuallyHidden(canvas.getByText("Edit task title"))
  },
  parameters: {
    docs: {
      description: {
        story:
          "visuallyHidden.base applied to a native label. The input keeps its accessible name, 'Edit task title', while the label takes no space above the field.",
      },
    },
  },
}
