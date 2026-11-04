import type { Meta, StoryObj } from "@storybook/react-vite"
import * as stylex from "@stylexjs/stylex"

import { spacing } from "@/tokens.stylex"

import { TextField } from "./text-field"

const styles = stylex.create({
  frame: {
    maxWidth: "20rem",
    width: "100%",
  },
  narrow: {
    maxWidth: "100%",
    width: "12rem",
  },
  stack: {
    gap: spacing.space4,
    display: "flex",
    flexDirection: "column",
  },
})

const meta = {
  title: "Components/TextField",
  component: TextField,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    controls: {
      include: [
        "label",
        "error",
        "placeholder",
        "disabled",
        "readOnly",
        "required",
      ],
    },
    docs: {
      description: {
        component:
          "A text field combining a label, a text input, and an optional error message. Use Tab to check keyboard focus and click the label to check its connection to the input.",
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
    label: "Task title",
    name: "title",
    error: "",
    placeholder: "",
    disabled: false,
    readOnly: false,
    required: false,
  },
  argTypes: {
    label: { control: "text" },
    error: { control: "text" },
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
    required: { control: "boolean" },
  },
} satisfies Meta<typeof TextField>

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = {}

export const Placeholder: Story = {
  args: {
    placeholder: "What needs to be done?",
  },
}

export const Filled: Story = {
  args: {
    defaultValue: "Review the pull request",
  },
}

export const Required: Story = {
  args: {
    required: true,
    placeholder: "What needs to be done?",
  },
}

export const Error: Story = {
  args: {
    error: "Enter a task title.",
  },
}

export const Disabled: Story = {
  args: {
    defaultValue: "Review the pull request",
    disabled: true,
  },
}

export const ReadOnly: Story = {
  args: {
    defaultValue: "Created automatically",
    readOnly: true,
  },
}

export const LongLabel: Story = {
  args: {
    label: "Describe the task you want to complete before the next release",
    placeholder: "What needs to be done?",
  },
}

export const LongError: Story = {
  args: {
    defaultValue: "   ",
    error:
      "The title cannot contain only spaces. Enter a short description of the task you want to add.",
  },
}

export const NarrowContainer: Story = {
  args: {
    error: "Enter a task title that describes what needs to be done.",
  },
  decorators: [
    (Story) => (
      <div {...stylex.props(styles.narrow)}>
        <Story />
      </div>
    ),
  ],
}

export const MultipleFields: Story = {
  render: (args) => (
    <div {...stylex.props(styles.stack)}>
      <TextField {...args} />
      <TextField
        {...args}
        label="Project"
        name="project"
        defaultValue="Margin"
      />
    </div>
  ),
}
