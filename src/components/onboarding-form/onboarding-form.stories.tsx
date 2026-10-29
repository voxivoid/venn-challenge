import type { Meta, StoryObj } from "@storybook/react-vite";
import { OnboardingForm } from "./onboarding-form";

const emptyFields = {
  firstName: {},
  lastName: {},
  phone: {},
  corporationNumber: {},
};

const meta = {
  title: "Components/OnboardingForm",
  component: OnboardingForm,
  args: {
    fields: emptyFields,
    onSubmit: (event) => event.preventDefault(),
  },
  decorators: [
    (Story) => (
      <div className="flex min-h-svh justify-center bg-muted/50 px-4 py-12">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof OnboardingForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithFieldErrors: Story = {
  args: {
    fields: {
      firstName: { error: "First name is required" },
      lastName: { error: "Last name is required" },
      phone: { error: "Phone number must be a valid Canadian number" },
      corporationNumber: { error: "Invalid corporation number" },
    },
  },
};

export const Submitting: Story = { args: { isSubmitting: true } };

export const SubmitError: Story = {
  args: { submitError: "Invalid corporation number" },
};

export const Submitted: Story = { args: { isSubmitSuccessful: true } };
