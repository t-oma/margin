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
  parameters: {
    layout: "padded",
    controls: {
      include: [
        "variant",
        "size",
        "children",
        "disabled",
        "type",
        "aria-label",
      ],
    },
    docs: {
      description: {
        component:
          "A native button with primary, secondary, danger and ghost variants. Use Tab to check keyboard focus. Icon-only buttons need an accessible name through aria-label.",
      },
    },
  },
  args: {
    variant: "primary",
    size: "md",
    type: "button",
    disabled: false,
    children: "Click me!",
  },
  argTypes: {
    variant: {
      control: "inline-radio",
      description: "Visual emphasis of the action.",
    },
    size: {
      control: "inline-radio",
      description: "Use md for text and icon for an icon-only button.",
    },
    children: {
      control: "text",
      description: "Visible button content. Accepts text or JSX.",
      table: {
        type: { summary: "ReactNode" },
      },
    },
    disabled: {
      control: "boolean",
      description: "Disables pointer and keyboard activation.",
    },
    type: {
      control: "select",
      options: ["button", "submit", "reset"],
      description: "Native button type. Use submit for form submission.",
      table: {
        type: { summary: '"button" | "submit" | "reset"' },
        defaultValue: { summary: "button" },
      },
    },
    "aria-label": {
      control: "text",
      description: "Accessible name for an icon-only button.",
      table: {
        type: { summary: "string" },
      },
    },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Variants: Story = {
  parameters: {
    controls: {
      include: ["size", "children", "disabled", "type"],
    },
    docs: {
      description: {
        story:
          "All color variants with shared content, size, and disabled state.",
      },
    },
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
      <Button variant="ghost" {...args}>
        {children}
      </Button>
    </div>
  ),
}

export const Primary: Story = {}

export const Secondary: Story = {
  args: {
    variant: "secondary",
  },
}

export const Danger: Story = {
  args: {
    variant: "danger",
  },
}

export const Ghost: Story = {
  args: {
    variant: "ghost",
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story: "A disabled button cannot be activated or focused with Tab.",
      },
    },
  },
}

export const Icon: Story = {
  args: {
    size: "icon",
    "aria-label": "Add task",
    children: <PlusIcon size={20} />,
  },
  argTypes: {
    children: { control: false },
  },
  parameters: {
    controls: {
      include: ["variant", "size", "disabled", "type", "aria-label"],
    },
    docs: {
      description: {
        story:
          "An icon-only button with aria-label providing its accessible name.",
      },
    },
  },
}

export const IconWithText: Story = {
  args: {
    children: (
      <>
        <PlusIcon size={20} /> <span>Create</span>
      </>
    ),
  },
  argTypes: {
    children: { control: false },
  },
  parameters: {
    controls: {
      include: ["variant", "size", "disabled", "type"],
    },
    docs: {
      description: {
        story: "An icon paired with a visible text label.",
      },
    },
  },
}
