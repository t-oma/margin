import type { Meta, StoryObj } from "@storybook/react-vite"
import * as stylex from "@stylexjs/stylex"

import { sizes } from "@/tokens.stylex"

import { Sheet } from "./sheet"
import { SheetEmpty } from "./sheet-empty"

const styles = stylex.create({
  frame: {
    maxWidth: sizes.contentMaxWidth,
    width: "100%",
  },
  narrow: {
    maxWidth: "100%",
    width: "18rem",
  },
})

const meta = {
  title: "Components/Sheet/Empty",
  component: SheetEmpty,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    controls: {
      include: ["title", "description"],
    },
    docs: {
      description: {
        component:
          "An empty-state section with a heading, an optional description, and two decorative ruled rows. Render it directly inside Sheet; it already includes SheetSection. The ruled rows are hidden from assistive technology.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div {...stylex.props(styles.frame)}>
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <Sheet>
      <SheetEmpty {...args} />
    </Sheet>
  ),
  args: {
    title: "Start your list",
    description:
      "Type the first thing you need to do in the field above and press Enter. Your tasks are saved in this browser, on this device.",
  },
  argTypes: {
    title: {
      control: "text",
      description: "The empty-state heading, rendered as an h2.",
      table: {
        type: { summary: "ReactNode" },
      },
    },
    description: {
      control: "text",
      description: "Optional text explaining how to get started.",
      table: {
        type: { summary: "ReactNode" },
      },
    },
  },
} satisfies Meta<typeof SheetEmpty>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithoutDescription: Story = {
  args: {
    description: undefined,
  },
}

export const LongContent: Story = {
  args: {
    title: "Give your next idea a place to start",
    description:
      "Break a larger goal into small tasks you can finish one at a time. Start with the next concrete action, then add the details you need to remember when you return to your list.",
  },
}

export const NarrowContainer: Story = {
  decorators: [
    (Story) => (
      <div {...stylex.props(styles.narrow)}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story:
          "A 288px container for checking heading and description wrapping at the minimum page width. The margin and decorative rows should remain inside the sheet.",
      },
    },
  },
}
