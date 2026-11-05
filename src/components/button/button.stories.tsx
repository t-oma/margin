import type { Meta, StoryObj } from "@storybook/react-vite"
import * as stylex from "@stylexjs/stylex"
import { PlusIcon } from "lucide-react"

import { spacing } from "@/tokens.stylex"

import { Button } from "./button"

const styles = stylex.create({
  wrapper: {
    gap: spacing.space4,
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap",
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
        "destructive",
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
          "A native button with primary, secondary, and ghost variants. Destructive primary and secondary share a borderless filled appearance. Destructive ghost highlights on hover and keyboard focus. Icon-only buttons need an accessible name through aria-label.",
      },
    },
  },
  args: {
    variant: "primary",
    destructive: false,
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
    destructive: {
      control: "boolean",
      description: "Applies destructive styling to the selected variant.",
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
          "All six combinations of variant and destructive styling. Content, size, and disabled state are shared.",
      },
    },
  },
  render: ({
    variant: _variant,
    destructive: _destructive,
    children,
    ...args
  }) => (
    <div {...stylex.props(styles.wrapper)}>
      <Button variant="primary" {...args}>
        {children}
      </Button>
      <Button variant="secondary" {...args}>
        {children}
      </Button>
      <Button variant="ghost" {...args}>
        {children}
      </Button>
      <Button variant="primary" destructive {...args}>
        {children}
      </Button>
      <Button variant="ghost" destructive {...args}>
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

export const Ghost: Story = {
  args: {
    variant: "ghost",
  },
}

export const Destructive: Story = {
  args: {
    destructive: true,
  },
}

export const DestructiveSecondary: Story = {
  args: {
    variant: "secondary",
    destructive: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Secondary with destructive enabled uses the same borderless filled appearance as primary.",
      },
    },
  },
}

export const DestructiveGhost: Story = {
  args: {
    variant: "ghost",
    destructive: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Hover and keyboard focus apply the same destructive text and background colors. Use Tab to inspect the focus ring.",
      },
    },
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

export const DestructiveDisabled: Story = {
  args: {
    destructive: true,
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Disabled styling overrides the destructive text and background colors.",
      },
    },
  },
}

export const DestructiveGhostDisabled: Story = {
  args: {
    variant: "ghost",
    destructive: true,
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Disabled destructive ghost keeps the shared disabled appearance and ignores hover.",
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
      include: [
        "variant",
        "destructive",
        "size",
        "disabled",
        "type",
        "aria-label",
      ],
    },
    docs: {
      description: {
        story:
          "An icon-only button with aria-label providing its accessible name. Use the variant and destructive controls to inspect combinations.",
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
      include: ["variant", "destructive", "size", "disabled", "type"],
    },
    docs: {
      description: {
        story: "An icon paired with a visible text label.",
      },
    },
  },
}
