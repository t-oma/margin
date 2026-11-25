import type { Meta, StoryObj } from "@storybook/react-vite"
import { CheckIcon } from "lucide-react"
import { type ComponentProps, useState } from "react"
import { expect, fn, waitFor } from "storybook/test"

import { Toast } from "./toast"

type ToastProps = ComponentProps<typeof Toast>

function TimeoutToast({ onTimeout, ...props }: ToastProps) {
  const [shown, setShown] = useState(true)

  if (!shown) return null

  return (
    <Toast
      onTimeout={() => {
        onTimeout()
        setShown(false)
      }}
      {...props}
    />
  )
}

function RemovableToast(props: ToastProps) {
  const [shown, setShown] = useState(true)

  return (
    <>
      <button type="button" onClick={() => setShown(false)}>
        Remove the toast
      </button>
      {shown && <Toast {...props} />}
    </>
  )
}

// Passes the toast a new onTimeout on every render, like a parent whose
// callback reads its state.
function RerenderingParent({ onTimeout, ...props }: ToastProps) {
  const [renders, setRenders] = useState(0)
  const [firedOn, setFiredOn] = useState<number | null>(null)

  return (
    <>
      <button type="button" onClick={() => setRenders(renders + 1)}>
        Re-render the parent
      </button>
      {firedOn !== null && (
        <p>Timed out with the callback from render {firedOn}</p>
      )}
      <Toast
        onTimeout={() => {
          onTimeout()
          setFiredOn(renders)
        }}
        {...props}
      />
    </>
  )
}

// The timer stories use a short duration to keep the tests fast. To show
// that the toast waits, a pause lasts twice as long.
const SHORT = 300

const wait = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms)
  })

const meta = {
  title: "Components/Toast",
  component: Toast,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    // The toast is fixed to the bottom of the screen: give every story its own
    // frame in the docs, or they all stack in one place.
    docs: {
      story: { inline: false, height: "120px" },
      description: {
        component:
          "A dark bar at the bottom of the screen with a one-line message and one action. A long message is cut with an ellipsis. On phones the toast spans the screen with 16px on each side. After `duration` (6 s by default) it calls `onTimeout`, and the parent removes it. While the pointer is over the toast or focus is inside it, the countdown stops, then goes on with the time that was left.",
      },
    },
    controls: {
      include: ["children"],
    },
  },
  args: {
    children: "Marked as done: Buy milk",
    onAction: fn(),
    actionLabel: "Undo",
    icon: <CheckIcon size={18} />,
    onTimeout: fn(),
  },
  argTypes: {
    children: {
      control: "text",
      description: "The message. It stays on one line.",
      table: {
        type: { summary: "ReactNode" },
      },
    },
  },
} satisfies Meta<typeof Toast>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const HideOnTimeout: Story = {
  args: {
    duration: 3000,
  },
  render: (args) => <TimeoutToast {...args} />,
}

export const TimesOut: Story = {
  args: {
    duration: SHORT,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Calls `onTimeout` once, `duration` after the toast appears. The toast does not hide itself.",
      },
    },
  },
  play: async ({ args }) => {
    await wait(SHORT / 2)
    await expect(args.onTimeout).not.toHaveBeenCalled()

    await waitFor(() => expect(args.onTimeout).toHaveBeenCalledOnce())

    await wait(SHORT * 2)
    await expect(args.onTimeout).toHaveBeenCalledOnce()
  },
}

export const HoverPauses: Story = {
  args: {
    duration: SHORT,
  },
  parameters: {
    docs: {
      description: {
        story:
          "The countdown stops while the pointer is over the toast and goes on when it leaves.",
      },
    },
  },
  play: async ({ args, canvas, userEvent }) => {
    const message = canvas.getByText("Marked as done: Buy milk")

    await userEvent.hover(message)
    await wait(SHORT * 2)
    await expect(args.onTimeout).not.toHaveBeenCalled()

    await userEvent.unhover(message)
    await waitFor(() => expect(args.onTimeout).toHaveBeenCalledOnce())
  },
}

export const FocusPauses: Story = {
  args: {
    duration: SHORT,
  },
  parameters: {
    docs: {
      description: {
        story:
          "The countdown stops while focus is on the action, so the toast can't disappear from under the keyboard.",
      },
    },
  },
  play: async ({ args, canvas, userEvent }) => {
    const action = canvas.getByRole("button", { name: "Undo" })

    await userEvent.tab()
    await expect(action).toHaveFocus()
    await wait(SHORT * 2)
    await expect(args.onTimeout).not.toHaveBeenCalled()

    await userEvent.tab()
    await expect(action).not.toHaveFocus()
    await waitFor(() => expect(args.onTimeout).toHaveBeenCalledOnce())
  },
}

export const FocusOutlastsPointer: Story = {
  args: {
    duration: SHORT,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Focus is on the action and the pointer passes over the toast. When the pointer leaves, the countdown stays stopped, because focus is still inside.",
      },
    },
  },
  play: async ({ args, canvas, userEvent }) => {
    const action = canvas.getByRole("button", { name: "Undo" })

    await userEvent.tab()
    await userEvent.hover(action)
    await userEvent.unhover(action)
    await wait(SHORT * 2)

    await expect(action).toHaveFocus()
    await expect(args.onTimeout).not.toHaveBeenCalled()
  },
}

export const PointerOutlastsFocus: Story = {
  args: {
    duration: SHORT,
  },
  parameters: {
    docs: {
      description: {
        story:
          "The pointer is over the toast and focus comes and goes. When focus leaves, the countdown stays stopped, because the pointer is still over it.",
      },
    },
  },
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.hover(canvas.getByText("Marked as done: Buy milk"))
    await userEvent.tab()
    await userEvent.tab()
    await wait(SHORT * 2)

    await expect(args.onTimeout).not.toHaveBeenCalled()
  },
}

export const RemovedBeforeTimeout: Story = {
  args: {
    duration: SHORT,
  },
  parameters: {
    docs: {
      description: {
        story: "A toast that is removed early never calls `onTimeout`.",
      },
    },
  },
  render: (args) => <RemovableToast {...args} />,
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(
      canvas.getByRole("button", { name: "Remove the toast" })
    )
    await wait(SHORT * 2)

    await expect(args.onTimeout).not.toHaveBeenCalled()
  },
}

export const ParentRerender: Story = {
  args: {
    duration: 600,
  },
  parameters: {
    docs: {
      description: {
        story:
          "The parent passes a new `onTimeout` on every render. The countdown does not start over, and the toast calls the latest callback once.",
      },
    },
  },
  render: (args) => <RerenderingParent {...args} />,
  play: async ({ args, canvas, userEvent }) => {
    // Re-render two thirds of the way in. Had the countdown started over,
    // the toast would not have timed out by the check below.
    await wait(400)
    await userEvent.click(
      canvas.getByRole("button", { name: "Re-render the parent" })
    )
    await wait(300)

    await expect(args.onTimeout).toHaveBeenCalledOnce()
    await expect(
      canvas.getByText("Timed out with the callback from render 1")
    ).toBeInTheDocument()
  },
}

export const LongMessage: Story = {
  args: {
    children:
      "Marked as done: Send Olena the signed lease and scans of both IDs before Friday so she can submit everything to the agency",
  },
}

export const Phone: Story = {
  args: LongMessage.args,
  globals: {
    viewport: { value: "mobile1", isRotated: false },
  },
}
