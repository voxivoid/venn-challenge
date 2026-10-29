import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { inputStatusArgType } from "@/test/storybook";
import { FormField } from "./form-field";

const meta = {
  title: "Components/FormField",
  component: FormField,
  args: {
    label: "Corporation Number",
    error: "",
    required: false,
    disabled: false,
    placeholder: "",
    onChange: fn(),
    onBlur: fn(),
  },
  argTypes: {
    label: { control: "text" },
    error: { control: "text", description: "Empty for no error." },
    required: { control: "boolean" },
    disabled: { control: "boolean" },
    placeholder: { control: "text" },
    status: inputStatusArgType,
  },
  decorators: [
    (Story) => (
      <div className="w-96 p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FormField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithError: Story = {
  args: { error: "Invalid Corporation Number" },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "123456789" },
};

export const LongValue: Story = {
  args: { defaultValue: "a".repeat(120), label: "First Name" },
};

export const Required: Story = { args: { required: true } };

export const Checking: Story = {
  args: { status: "loading", defaultValue: "826417395" },
};

export const Verified: Story = {
  args: { status: "valid", defaultValue: "826417395" },
};

export const Rejected: Story = {
  args: {
    status: "invalid",
    defaultValue: "111111111",
    error: "Invalid corporation number",
  },
};
