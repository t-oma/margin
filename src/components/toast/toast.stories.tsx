import type { Meta, StoryObj } from "@storybook/react-vite"
import { CheckIcon } from "lucide-react"
import { fn } from "storybook/test"

import { Toast } from "./toast"

const meta = {
  title: "Components/Toast",
  component: Toast,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    // The toast is fixed to the bottom of the screen: give every story its own
    // frame in the docs, or they all stack in one place.
    docs: {
      story: { inline: false, height: "120px" },
      description: {
        component:
          "A dark bar at the bottom of the screen with a one-line message and one action. A long message is cut with an ellipsis. On phones the toast spans the screen with 16px on each side.",
      },
    },
    controls: {
      include: ["children"],
    },
  },
  args: {
    children: "Marked as done: Buy milk",
    onAction: fn(),
    actionLabel: "Undo",
    icon: <CheckIcon size={18} />,
  },
  argTypes: {
    children: {
      control: "text",
      description: "The message. It stays on one line.",
      table: {
        type: { summary: "ReactNode" },
      },
    },
  },
} satisfies Meta<typeof Toast>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const LongMessage: Story = {
  args: {
    children:
      "Marked as done: Send Olena the signed lease and scans of both IDs before Friday so she can submit everything to the agency",
  },
}

export const Phone: Story = {
  args: LongMessage.args,
  globals: {
    viewport: { value: "mobile1", isRotated: false },
  },
}
