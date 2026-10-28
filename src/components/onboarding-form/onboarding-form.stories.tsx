import type { Meta, StoryObj } from "@storybook/react-vite"
import { OnboardingForm } from "./onboarding-form"

const meta = {
  title: "Components/OnboardingForm",
  component: OnboardingForm,
  decorators: [
    (Story) => (
      <div className="flex min-h-svh justify-center bg-muted/50 px-4 py-12">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof OnboardingForm>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Submitting: Story = { args: { isSubmitting: true } }
