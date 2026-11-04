import type { Meta, StoryObj } from "@storybook/react-vite"
import * as stylex from "@stylexjs/stylex"
import { PlusIcon } from "lucide-react"

import { Button } from "./button"

const styles = stylex.create({
  wrapper: {
    gap: "16px",
    alignItems: "center",
    display: "flex",
  },
})

const meta = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Variants: Story = {
  args: {
    children: "Click me!",
  },
  render: ({ variant: _variant, children, ...args }) => (
    <div {...stylex.props(styles.wrapper)}>
      <Button variant="primary" {...args}>
        {children}
      </Button>
      <Button variant="secondary" {...args}>
        {children}
      </Button>
      <Button variant="danger" {...args}>
        {children}
      </Button>
    </div>
  ),
}

export const Primary: Story = {
  args: {
    variant: "primary",
    size: "md",
    children: "Click me!",
  },
}

export const Secondary: Story = {
  args: {
    ...Primary.args,
    variant: "secondary",
  },
}

export const Danger: Story = {
  args: {
    ...Primary.args,
    variant: "danger",
  },
}

export const Disabled: Story = {
  args: {
    ...Primary.args,
    disabled: true,
  },
}

export const Icon: Story = {
  args: {
    ...Primary.args,
    size: "icon",
    "aria-label": "Add task",
    children: <PlusIcon size={20} />,
  },
}

export const IconWithText: Story = {
  args: {
    ...Primary.args,
    children: (
      <>
        <PlusIcon size={20} /> <span>Create</span>
      </>
    ),
  },
}
