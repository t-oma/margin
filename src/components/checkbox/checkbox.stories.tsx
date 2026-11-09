import type { Meta, StoryObj } from "@storybook/react-vite"
import * as stylex from "@stylexjs/stylex"
import { type ComponentProps, useState } from "react"

import { Button } from "@/components/button"
import { colors, spacing } from "@/tokens.stylex"

import { Checkbox } from "./checkbox"

type CheckboxArgs = ComponentProps<typeof Checkbox>

const styles = stylex.create({
  frame: {
    maxWidth: "24rem",
    width: "100%",
  },
  narrow: {
    maxWidth: "100%",
    width: "14rem",
  },
  stack: {
    gap: spacing.space3,
    alignItems: "flex-start",
    display: "flex",
    flexDirection: "column",
  },
  status: {
    color: colors.textMuted,
  },
})

function ControlledExample({
  checked: _checked,
  defaultChecked: _defaultChecked,
  onChange,
  ...args
}: CheckboxArgs) {
  const [checked, setChecked] = useState(false)
  const checkboxArgs: CheckboxArgs = {
    ...args,
    checked,
    onChange: (event) => {
      setChecked(event.currentTarget.checked)
      onChange?.(event)
    },
  }

  return (
    <div {...stylex.props(styles.stack)}>
      <Checkbox {...checkboxArgs} />
      <p role="status" {...stylex.props(styles.status)}>
        {checked ? "Task completed" : "Task active"}
      </p>
      <Button variant="secondary" onClick={() => setChecked(false)}>
        Reset checked state
      </Button>
    </div>
  )
}

const meta = {
  title: "Components/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    controls: {
      include: ["defaultChecked", "disabled", "required", "aria-label"],
    },
    docs: {
      description: {
        component:
          "A native checkbox with custom styling and an optional visible label passed as children. Clicking the label toggles the checkbox. Use Tab to focus it and Space to toggle it. Provide an accessible name through aria-label or aria-labelledby when no label text is rendered.",
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
  render: (args) => <Checkbox key={String(args.defaultChecked)} {...args} />,
  args: {
    name: "completed",
    value: "yes",
    defaultChecked: false,
    disabled: false,
    required: false,
    "aria-label": "Complete task",
  },
  argTypes: {
    children: {
      control: "text",
      description:
        "Visible label content. The native label provides the accessible name and a larger click target.",
      table: {
        type: { summary: "ReactNode" },
      },
    },
    defaultChecked: {
      control: "boolean",
      description:
        "Initial checked state for uncontrolled usage. Changing this control remounts the checkbox so the new initial state is visible.",
      table: {
        type: { summary: "boolean" },
      },
    },
    checked: {
      control: false,
      description:
        "Current state for controlled usage. The Controlled story owns this value and updates it through onChange.",
      table: {
        type: { summary: "boolean" },
      },
    },
    disabled: {
      control: "boolean",
      description: "Disables interaction and removes the input from Tab order.",
      table: {
        type: { summary: "boolean" },
      },
    },
    required: {
      control: "boolean",
      description: "Requires a checked value for native form validation.",
      table: {
        type: { summary: "boolean" },
      },
    },
    "aria-label": {
      control: "text",
      description:
        "Accessible name when no visible label is associated with the input.",
      table: {
        type: { summary: "string" },
      },
    },
    onChange: {
      control: false,
      description:
        "Native change handler. Read the new state from event.currentTarget.checked.",
      table: {
        type: { summary: "ChangeEventHandler<HTMLInputElement>" },
      },
    },
    name: {
      control: "text",
      description: "Field name used by native form submission.",
    },
    value: {
      control: "text",
      description: "Submitted value when the checkbox is checked.",
    },
  },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Unchecked: Story = {}

export const Checked: Story = {
  args: {
    defaultChecked: true,
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
}

export const DisabledChecked: Story = {
  args: {
    defaultChecked: true,
    disabled: true,
  },
}

export const WithLabel: Story = {
  args: {
    children: "Agree with terms.",
    "aria-label": undefined,
  },
  parameters: {
    controls: {
      include: ["children", "defaultChecked", "disabled", "required"],
    },
    docs: {
      description: {
        story:
          "Pass label text as children. The native label supplies the accessible name and toggles the checkbox when clicked.",
      },
    },
  },
}

export const LongLabel: Story = {
  args: {
    children:
      "Review keyboard navigation and document the remaining tasks before the next release",
    "aria-label": undefined,
  },
  render: (args) => (
    <div {...stylex.props(styles.narrow)}>
      <Checkbox key={String(args.defaultChecked)} {...args} />
    </div>
  ),
  parameters: {
    controls: {
      include: ["children", "defaultChecked", "disabled", "required"],
    },
    docs: {
      description: {
        story:
          "Long children inside a 224px container. Check that the label wraps and the visible checkbox remains square without shrinking.",
      },
    },
  },
}

export const Controlled: Story = {
  args: {
    children: "Review the pull request",
    "aria-label": undefined,
  },
  render: (args) => <ControlledExample {...args} />,
  parameters: {
    controls: {
      include: ["children", "disabled"],
    },
    docs: {
      description: {
        story:
          "React state owns checked. Toggle with a click or Space and inspect the status text, then use Reset checked state to verify that a parent update reaches the input.",
      },
    },
  },
}

export const FormReset: Story = {
  args: {
    children: "Review the pull request",
    "aria-label": undefined,
    defaultChecked: true,
  },
  render: (args) => (
    <form
      key={String(args.defaultChecked)}
      {...stylex.props(styles.stack)}
      onSubmit={(event) => event.preventDefault()}
    >
      <Checkbox {...args} />
      <Button type="reset" variant="secondary">
        Reset form
      </Button>
    </form>
  ),
  parameters: {
    controls: {
      include: [
        "children",
        "defaultChecked",
        "disabled",
        "required",
        "name",
        "value",
      ],
    },
    docs: {
      description: {
        story:
          "Uncontrolled usage inside a native form. Change the checkbox, then press Reset form. The input should return to defaultChecked.",
      },
    },
  },
}
