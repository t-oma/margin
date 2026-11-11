import type { Meta, StoryObj } from "@storybook/react-vite"
import * as stylex from "@stylexjs/stylex"
import { PlusIcon } from "lucide-react"
import type { ReactNode } from "react"

import { Button } from "@/components/button"
import { TextField } from "@/components/field"
import { colors, sizes, spacing } from "@/tokens.stylex"

import { Sheet } from "./sheet"
import { sheetLayout } from "./sheet.stylex"
import { SheetEmpty } from "./sheet-empty"
import { SheetMargin } from "./sheet-margin"
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
  body: {
    paddingBlock: spacing.space3,
  },
  form: {
    gap: spacing.space2,
    alignItems: "end",
    display: "flex",
    paddingBottom: spacing.space8,
    paddingTop: spacing.space3,
  },
  icon: {
    color: colors.accent,
  },
})

type RowProps = {
  margin?: ReactNode
  children: ReactNode
}

function Row({ margin, children }: RowProps) {
  return (
    <div {...stylex.props(sheetLayout.row)}>
      <SheetMargin>{margin}</SheetMargin>
      <div {...stylex.props(sheetLayout.body, styles.body)}>{children}</div>
    </div>
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
          "A bordered notebook surface with a continuous margin rule. Compose it with SheetSection children or SheetEmpty, which includes its own section. Every section that follows another one draws a divider above itself.",
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
      <SheetSection>
        <Row>Plan the next small improvement to Margin.</Row>
      </SheetSection>
    ),
  },
  argTypes: {
    children: {
      control: false,
      description: "Sheet sections and empty-state content.",
      table: {
        type: { summary: "ReactNode" },
      },
    },
  },
} satisfies Meta<typeof Sheet>

export default meta
type Story = StoryObj<typeof meta>

export const SingleSection: Story = {}

export const MultipleSections: Story = {
  args: {
    children: (
      <>
        <SheetSection>
          <Row margin={<span aria-hidden="true">1</span>}>
            Sections keep the notebook gutter aligned.
          </Row>
        </SheetSection>
        <SheetSection>
          <Row margin={<span aria-hidden="true">2</span>}>
            A divider spans the full width between adjacent sections.
          </Row>
        </SheetSection>
        <SheetSection>
          <Row margin={<span aria-hidden="true">3</span>}>
            The last section uses only the outer sheet border.
          </Row>
        </SheetSection>
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Check the continuous vertical rule, the dividers between sections, and the absence of an extra divider at the bottom.",
      },
    },
  },
}

export const WithComposer: Story = {
  args: {
    children: (
      <>
        <SheetSection>
          <div {...stylex.props(sheetLayout.row)}>
            <SheetMargin>
              <PlusIcon
                size={20}
                aria-hidden="true"
                {...stylex.props(styles.icon)}
              />
            </SheetMargin>

            <form
              {...stylex.props(sheetLayout.body, styles.form)}
              onSubmit={(event) => event.preventDefault()}
            >
              <TextField
                label="New Task"
                name="title"
                placeholder="What needs doing?"
                fluid
              />
              <Button type="submit" size="icon" aria-label="Add task">
                <PlusIcon size={20} aria-hidden="true" />
              </Button>
            </form>
          </div>
        </SheetSection>
        <SheetEmpty
          title="Start your list"
          description="Type the first thing you need to do in the field above and press Enter. Your tasks are saved in this browser, on this device."
        />
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          "The current homepage composition. Use Tab to check the field and button focus rings. Submission is prevented; this story demonstrates layout and does not create or save tasks.",
      },
    },
  },
}

export const NarrowContainer: Story = {
  ...WithComposer,
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
          "The composer and empty state inside a 288px container, matching the sheet width at a 320px viewport with page padding. Check that the field shrinks while the margin and add button keep their width.",
      },
    },
  },
}
