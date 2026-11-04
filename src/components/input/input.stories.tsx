import type { Meta, StoryObj } from "@storybook/react-vite"
import * as stylex from "@stylexjs/stylex"

import { Input } from "./input"

const styles = stylex.create({
  frame: {
    maxWidth: "20rem",
    width: "100%",
  },
  narrow: {
    maxWidth: "100%",
    width: "12rem",
  },
})

const meta = {
  title: "Components/Input",
  component: Input,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    controls: {
      include: ["placeholder", "disabled", "readOnly", "aria-invalid"],
    },
    docs: {
      description: {
        component:
          "A base text input. Use Tab to check keyboard focus. Labels, hints, and error messages will be composed separately in TextField.",
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
    type: "text",
    name: "title",
    "aria-label": "Task title",
    "aria-invalid": false,
    placeholder: "",
    disabled: false,
    readOnly: false,
  },
  argTypes: {
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
    "aria-invalid": { control: "boolean" },
  },
} satisfies Meta<typeof Input>

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

export const Invalid: Story = {
  args: {
    defaultValue: "Review the pull request",
    "aria-invalid": true,
  },
}

export const LongValue: Story = {
  args: {
    defaultValue:
      "Review the pull request, check keyboard navigation, and document any issues before the next release",
  },
}

export const NarrowContainer: Story = {
  args: {
    placeholder: "What needs to be done?",
  },
  decorators: [
    (Story) => (
      <div {...stylex.props(styles.narrow)}>
        <Story />
      </div>
    ),
  ],
}
