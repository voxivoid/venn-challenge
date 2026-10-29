import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "./input";

const meta = {
  title: "UI/Input",
  component: Input,
  args: { "aria-label": "Example input" },
  argTypes: {
    status: {
      control: "select",
      options: [undefined, "loading", "valid", "invalid"],
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Invalid: Story = { args: { "aria-invalid": true } };

export const Loading: Story = {
  args: { status: "loading", defaultValue: "826417395" },
};

export const Valid: Story = {
  args: { status: "valid", defaultValue: "826417395" },
};

export const InvalidWithStatus: Story = {
  args: { status: "invalid", "aria-invalid": true, defaultValue: "111111111" },
};

export const LongValueWithStatus: Story = {
  args: { status: "valid", defaultValue: "a".repeat(120) },
};
