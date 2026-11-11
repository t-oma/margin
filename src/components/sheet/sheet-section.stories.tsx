import type { Meta, StoryObj } from "@storybook/react-vite"
import * as stylex from "@stylexjs/stylex"
import { PlusIcon } from "lucide-react"
import type { ReactNode } from "react"

import { Checkbox } from "@/components/checkbox"
import { colors, sizes, spacing } from "@/tokens.stylex"

import { Sheet } from "./sheet"
import { sheetLayout } from "./sheet.stylex"
import { SheetMargin } from "./sheet-margin"
import { SheetSection } from "./sheet-section"

const styles = stylex.create({
  frame: {
    maxWidth: sizes.contentMaxWidth,
    width: "100%",
  },
  body: {
    paddingBlock: spacing.space3,
  },
  icon: {
    color: colors.accent,
  },
})

type RowProps = {
  margin?: ReactNode
  align?: "center" | "start"
  children: ReactNode
}

function Row({ margin, align, children }: RowProps) {
  return (
    <div {...stylex.props(sheetLayout.row)}>
      <SheetMargin align={align}>{margin}</SheetMargin>
      <div {...stylex.props(sheetLayout.body, styles.body)}>{children}</div>
    </div>
  )
}

const longText =
  "Review the task list layout, check keyboard navigation, and write down any changes needed before starting the next feature. Resize the preview to check that the content wraps while the notebook margin keeps its width."

const meta = {
  title: "Components/Sheet/Section",
  component: SheetSection,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Groups sheet rows and stacks them vertically. A section that follows another section draws a full-width divider above itself, so render sections directly inside Sheet. A row is a flex container with sheetLayout.row: SheetMargin first, then a content area with sheetLayout.body.",
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
    children: <Row>Plan the next small improvement to Margin.</Row>,
  },
  argTypes: {
    children: {
      control: false,
      description:
        "Rows built from sheetLayout.row, SheetMargin and sheetLayout.body.",
      table: {
        type: { summary: "ReactNode" },
      },
    },
  },
} satisfies Meta<typeof SheetSection>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithMarginContent: Story = {
  args: {
    children: (
      <Row
        margin={
          <PlusIcon
            size={20}
            aria-hidden="true"
            {...stylex.props(styles.icon)}
          />
        }
      >
        Plan the next small improvement to Margin.
      </Row>
    ),
  },
}

export const MultipleRows: Story = {
  args: {
    children: (
      <>
        <Row margin={<span aria-hidden="true">1</span>}>
          Rows inside a section stack vertically.
        </Row>
        <Row margin={<span aria-hidden="true">2</span>}>
          The section adds no dividers between its own rows.
        </Row>
        <Row margin={<span aria-hidden="true">3</span>}>
          Each row keeps the margin aligned with the rule.
        </Row>
      </>
    ),
  },
}

export const LongContent: Story = {
  args: {
    children: (
      <>
        <Row margin={<Checkbox aria-label="Centered margin content" />}>
          {longText}
        </Row>
        <Row
          align="start"
          margin={<Checkbox aria-label="Top-aligned margin content" />}
        >
          {longText}
        </Row>
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Long text wraps and increases the row height while SheetMargin keeps its width. The first row uses the default align, which centers the margin content. The second uses align='start', which keeps it next to the first line, as a task checkbox needs.",
      },
    },
  },
}
