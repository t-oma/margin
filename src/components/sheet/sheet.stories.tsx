import type { Meta, StoryObj } from "@storybook/react-vite"
import * as stylex from "@stylexjs/stylex"
import { CheckIcon } from "lucide-react"
import { useState } from "react"

import { Badge } from "@/components/badge"
import { Checkbox } from "@/components/checkbox"
import { VisuallyHidden } from "@/components/visually-hidden"
import { colors, sizes, spacing } from "@/tokens.stylex"

import { Sheet } from "./sheet"
import { SheetEmpty } from "./sheet-empty"
import { sheetLayout } from "./sheet-layout"
import { SheetSection } from "./sheet-section"

const styles = stylex.create({
  frame: {
    maxWidth: sizes.contentMaxWidth,
    width: "100%",
  },
  narrow: {
    maxWidth: "100%",
    width: "18rem",
  },
  // An example row, built the way a task row would be: sheetLayout for the
  // margin and the body, local styles for the rest.
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

function SectionsExample() {
  const [doneCollapsed, setDoneCollapsed] = useState(false)

  return (
    <Sheet>
      <SheetSection title="To do" badge={<Count count={2} />}>
        <ExampleRows
          titles={[
            "Pay the electricity bill",
            "Send Olena the signed lease and scans of both IDs before Friday so she can submit everything to the agency",
          ]}
        />
      </SheetSection>

      <SheetSection
        title="Done"
        badge={<Count count={1} />}
        collapsed={doneCollapsed}
        onCollapsedChange={setDoneCollapsed}
      >
        <ExampleRows titles={["Book train tickets to Lviv"]} />
      </SheetSection>
    </Sheet>
  )
}

const meta = {
  title: "Components/Sheet/Sheet",
  component: Sheet,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A bordered notebook surface with a continuous margin rule. Compose it from SheetSection and SheetEmpty, plus row components built on sheetLayout, such as a task list or the composer. A section draws a divider above itself when it follows another section.",
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
  args: {
    children: (
      <ExampleRows titles={["Plan the next small improvement to Margin."]} />
    ),
  },
  argTypes: {
    children: {
      control: false,
      description: "Sections, empty states and row components.",
      table: {
        type: { summary: "ReactNode" },
      },
    },
  },
} satisfies Meta<typeof Sheet>

export default meta
type Story = StoryObj<typeof meta>

export const Rows: Story = {
  args: {
    children: (
      <ExampleRows
        titles={[
          "Rows keep the notebook gutter aligned.",
          "A row built on sheetLayout draws its own divider.",
          "The last row uses only the outer sheet border.",
        ]}
      />
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Rows directly inside the sheet, built on sheetLayout the way a task row would be. Check the continuous vertical rule and the light dividers between rows.",
      },
    },
  },
}

export const Sections: Story = {
  render: () => <SectionsExample />,
  parameters: {
    docs: {
      description: {
        story:
          "A To do section and a collapsible Done section. The second section draws a full-width divider above its header. The toggle hides the Done list without removing it from the DOM.",
      },
    },
  },
}

export const EmptySection: Story = {
  args: {
    children: (
      <>
        <SheetSection title="To do" badge={<Count count={0} />}>
          <SheetEmpty
            marker={<CheckIcon size={20} aria-hidden="true" />}
            title="All done. Nothing left to do."
            description="New tasks you add will appear here."
          />
        </SheetSection>
        <SheetSection title="Done" badge={<Count count={0} />}>
          <SheetEmpty
            title="Nothing finished yet"
            description="Tick a task’s checkbox and it moves here."
          />
        </SheetSection>
      </>
    ),
  },
}

export const FirstRun: Story = {
  args: {
    children: (
      <SheetEmpty
        size="lg"
        title="Start your list"
        description="Type the first thing you need to do in the field above and press Enter. Your tasks are saved in this browser, on this device."
      />
    ),
  },
  parameters: {
    docs: {
      description: {
        story: "The first-run empty state, which the composer sits above.",
      },
    },
  },
}

export const NarrowContainer: Story = {
  ...Sections,
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
          "The sections inside a 288px container, matching the sheet width at a 320px viewport with page padding. Check that task titles wrap while the margin and checkboxes keep their width.",
      },
    },
  },
}
