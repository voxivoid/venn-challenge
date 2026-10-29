import type { Meta, StoryObj } from "@storybook/react-vite";
import { StepIndicator } from "./step-indicator";

const meta = {
  title: "Components/StepIndicator",
  component: StepIndicator,
  args: { step: 1, totalSteps: 5 },
  argTypes: {
    step: { control: { type: "number", min: 1, step: 1 } },
    totalSteps: { control: { type: "number", min: 1, step: 1 } },
  },
} satisfies Meta<typeof StepIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FirstStep: Story = {};

export const LastStep: Story = { args: { step: 5 } };
