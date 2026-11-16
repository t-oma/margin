import type { Meta, StoryObj } from "@storybook/react-vite"
import * as stylex from "@stylexjs/stylex"
import { type ComponentProps, useState } from "react"

import { Badge } from "@/components/badge"
import { Checkbox } from "@/components/checkbox"
import { VisuallyHidden } from "@/components/visually-hidden"
import { colors, sizes, spacing } from "@/tokens.stylex"

import { Sheet } from "./sheet"
import { SheetEmpty } from "./sheet-empty"
import { sheetLayout } from "./sheet-layout"
import { SheetSection } from "./sheet-section"

type SheetSectionArgs = ComponentProps<typeof SheetSection>

const styles = stylex.create({
  frame: {
    maxWidth: sizes.contentMaxWidth,
    width: "100%",
  },
  list: {
    listStyle: "none",
  },
  row: {
    borderTopColor: colors.borderRow,
    borderTopStyle: {
      default: "solid",
      ":first-child": "none",
    },
    borderTopWidth: "1px",
  },
  marker: {
    paddingTop: "2px",
  },
  title: {
    paddingBlock: spacing.space3,
    overflowWrap: "anywhere",
  },
})

function ExampleRows({ titles }: { titles: string[] }) {
  return (
    <ul role="list" {...stylex.props(styles.list)}>
      {titles.map((title) => (
        <li key={title} {...stylex.props(sheetLayout.row, styles.row)}>
          <div {...stylex.props(sheetLayout.margin, styles.marker)}>
            <Checkbox aria-label={`Mark as done: ${title}`} />
          </div>
          <div {...stylex.props(sheetLayout.body, styles.title)}>{title}</div>
        </li>
      ))}
    </ul>
  )
}

function Count({ count }: { count: number }) {
  return (
    <Badge>
      {count}
      <VisuallyHidden> {count === 1 ? "task" : "tasks"}</VisuallyHidden>
    </Badge>
  )
}

const rows = (
  <ExampleRows
    titles={[
      "Pay the electricity bill",
      "Book train tickets to Lviv",
      "Send Olena the signed lease and scans of both IDs",
    ]}
  />
)

function CollapsibleExample({
  collapsed: _collapsed,
  onCollapsedChange,
  ...args
}: SheetSectionArgs) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <SheetSection
      {...args}
      collapsed={collapsed}
      onCollapsedChange={(value) => {
        setCollapsed(value)
        onCollapsedChange?.(value)
      }}
    />
  )
}

const meta = {
  title: "Components/Sheet/Section",
  component: SheetSection,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A titled group of rows: a header with an h2, an optional badge and, when onCollapsedChange is given, a Hide/Show toggle, followed by the content. The section is a landmark named by its heading, and the toggle is named by its text and the heading, e.g. “Hide Done”. A section that follows another section draws a full-width divider above itself, so render sections directly inside Sheet.",
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
    title: "To do",
    badge: <Count count={3} />,
    children: rows,
  },
  argTypes: {
    title: {
      control: "text",
      table: {
        type: { summary: "ReactNode" },
      },
    },
    badge: {
      control: false,
      description: "Rendered next to the title, e.g. a count badge.",
      table: {
        type: { summary: "ReactNode" },
      },
    },
    collapsed: {
      control: "boolean",
    },
    onCollapsedChange: {
      control: false,
      description:
        "Makes the section collapsible. Without it the header has no toggle and `collapsed` is ignored.",
    },
    children: {
      control: false,
      description: "Row components or SheetEmpty.",
      table: {
        type: { summary: "ReactNode" },
      },
    },
  },
} satisfies Meta<typeof SheetSection>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithoutBadge: Story = {
  args: {
    badge: undefined,
  },
}

export const Collapsible: Story = {
  render: (args) => <CollapsibleExample {...args} />,
  args: {
    title: "Done",
  },
  parameters: {
    docs: {
      description: {
        story:
          "The toggle sets aria-expanded and aria-controls, and the content is hidden with the hidden attribute, so the controlled element stays in the DOM. Use Tab and Enter to check the toggle.",
      },
    },
  },
}

export const Empty: Story = {
  args: {
    title: "Done",
    badge: <Count count={0} />,
    children: (
      <SheetEmpty
        title="Nothing finished yet"
        description="Tick a task’s checkbox and it moves here."
      />
    ),
  },
}

export const Adjacent: Story = {
  render: (args) => (
    <>
      <SheetSection {...args} />
      <SheetSection {...args} title="Done" badge={<Count count={0} />}>
        <SheetEmpty
          title="Nothing finished yet"
          description="Tick a task’s checkbox and it moves here."
        />
      </SheetSection>
    </>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Two sections in a row. The second draws a divider above its header; the first has none because only the sheet border is above it.",
      },
    },
  },
}
