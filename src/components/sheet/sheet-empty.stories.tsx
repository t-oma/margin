import type { Meta, StoryObj } from "@storybook/react-vite"
import * as stylex from "@stylexjs/stylex"
import { CheckIcon } from "lucide-react"

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
      include: ["title", "description", "size"],
    },
    docs: {
      description: {
        component:
          "An empty-state row with a title, an optional description and an optional marker in the notebook margin. The default size fits inside a section. The large size is the first-run state of an empty sheet and adds two decorative ruled lines, which are hidden from assistive technology.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div {...stylex.props(styles.frame)}>
        <Sheet>
          <Story />
        </Sheet>
      </div>
    ),
  ],
  args: {
    title: "Nothing finished yet",
    description: "Tick a task’s checkbox and it moves here.",
  },
  argTypes: {
    title: {
      control: "text",
      table: {
        type: { summary: "ReactNode" },
      },
    },
    description: {
      control: "text",
      description: "Optional text explaining what happens next.",
      table: {
        type: { summary: "ReactNode" },
      },
    },
    size: {
      control: "inline-radio",
      options: ["md", "lg"],
      table: {
        defaultValue: { summary: "md" },
      },
    },
  },
} satisfies Meta<typeof SheetEmpty>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithMarker: Story = {
  args: {
    marker: <CheckIcon size={20} aria-hidden="true" />,
    title: "All done. Nothing left to do.",
    description: "New tasks you add will appear here.",
  },
}

export const WithoutDescription: Story = {
  args: {
    description: undefined,
  },
}

export const FirstRun: Story = {
  args: {
    size: "lg",
    title: "Start your list",
    description:
      "Type the first thing you need to do in the field above and press Enter. Your tasks are saved in this browser, on this device.",
  },
}

export const NarrowContainer: Story = {
  ...FirstRun,
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
          "The first-run state in a 288px container for checking title and description wrapping at the minimum page width. The margin and ruled lines should remain inside the sheet.",
      },
    },
  },
}
