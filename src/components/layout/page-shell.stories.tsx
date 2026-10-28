import type { Meta, StoryObj } from "@storybook/react-vite"
import { PageShell } from "./page-shell"

const meta = {
  title: "Layout/PageShell",
  component: PageShell,
  args: { step: 1, totalSteps: 5, children: <p>Page content</p> },
} satisfies Meta<typeof PageShell>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const LastStep: Story = { args: { step: 5 } }
