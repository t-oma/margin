import type { Meta, StoryObj } from "@storybook/react-vite"
import * as stylex from "@stylexjs/stylex"
import { expect } from "storybook/test"

import { spacing, typography } from "@/tokens.stylex"

import { Badge } from "./badge"

const styles = stylex.create({
  row: {
    gap: spacing.space3,
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap",
  },
  stack: {
    gap: spacing.space4,
    alignItems: "flex-start",
    display: "flex",
    flexDirection: "column",
  },
  title: {
    gap: spacing.space2,
    alignItems: "center",
    display: "flex",
    fontSize: typography.fontSizeSm,
    fontWeight: typography.fontWeightSemibold,
    lineHeight: typography.lineHeightSm,
    textTransform: "uppercase",
  },
})

const meta = {
  title: "Components/Badge",
  component: Badge,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    controls: {
      include: ["children"],
    },
    docs: {
      description: {
        component:
          "A non-interactive pill for a short value, usually a count next to a section title. Numbers use tabular figures and the badge is at least 24px wide, so its size stays stable as the count changes. It renders a plain span: screen readers read only its text, so add visually hidden context such as 'tasks' where the number alone is unclear.",
      },
    },
  },
  args: {
    children: "8",
  },
  argTypes: {
    children: {
      control: "text",
      description: "Visible value, usually a count. Keep it short.",
      table: {
        type: { summary: "ReactNode" },
      },
    },
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Counts: Story = {
  render: () => (
    <div {...stylex.props(styles.row)}>
      <Badge>0</Badge>
      <Badge>1</Badge>
      <Badge>8</Badge>
      <Badge>12</Badge>
      <Badge>128</Badge>
    </div>
  ),
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          "Single digits fill the 24px minimum width. Tabular figures give 1 and 8 the same width, so the badge does not shift when the count changes. Longer values widen the badge.",
      },
    },
  },
}

export const InlineAndFlex: Story = {
  render: () => (
    <div {...stylex.props(styles.stack)}>
      <p>
        You have <Badge>8</Badge> tasks left.
      </p>
      <div {...stylex.props(styles.title)}>
        To do <Badge>8</Badge>
      </div>
    </div>
  ),
  play: async ({ canvas }) => {
    const [inline, flexItem] = canvas.getAllByText("8")

    await expect(inline.getBoundingClientRect().height).toBe(
      flexItem.getBoundingClientRect().height
    )
  },
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          "The badge has the same height inside running text and as a flex item. It sets display: inline-flex, so its height always comes from its own line height and padding, whatever the parent's display.",
      },
    },
  },
}
