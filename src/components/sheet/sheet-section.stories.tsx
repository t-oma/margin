import type { Meta, StoryObj } from "@storybook/react-vite"
import * as stylex from "@stylexjs/stylex"
import { PlusIcon } from "lucide-react"

import { colors, sizes } from "@/tokens.stylex"

import { Sheet } from "./sheet"
import { SheetSection } from "./sheet-section"

const styles = stylex.create({
  frame: {
    maxWidth: sizes.contentMaxWidth,
    width: "100%",
  },
  icon: {
    color: colors.accent,
  },
})

const meta = {
  title: "Components/Sheet/Section",
  component: SheetSection,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    controls: {
      include: ["children"],
    },
    docs: {
      description: {
        component:
          "A sheet row with a fixed notebook margin and a flexible content area. The margin remains visible when empty. Render sections directly inside Sheet so the last section can omit its bottom divider.",
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
    children: "Plan the next small improvement to Margin.",
  },
  argTypes: {
    children: {
      control: "text",
      description: "Content displayed to the right of the notebook margin.",
      table: {
        type: { summary: "ReactNode" },
      },
    },
    margin: {
      control: false,
      description: "Optional content in the margin, such as a decorative icon.",
      table: {
        type: { summary: "ReactNode" },
      },
    },
  },
} satisfies Meta<typeof SheetSection>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithMargin: Story = {
  args: {
    margin: (
      <PlusIcon size={20} aria-hidden="true" {...stylex.props(styles.icon)} />
    ),
  },
}

export const LongContent: Story = {
  args: {
    children:
      "Review the task list layout, check keyboard navigation, and write down any changes needed before starting the next feature. Resize the preview to check that the content wraps while the notebook margin keeps its width.",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Long text increases the section height. The notebook margin should stretch to the same height as the content.",
      },
    },
  },
}
