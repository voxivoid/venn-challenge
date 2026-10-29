import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { inputStatusArgType } from "@/test/storybook";
import { Input } from "./input";

const meta = {
  title: "UI/Input",
  component: Input,
  args: {
    "aria-label": "Example input",
    "aria-invalid": false,
    disabled: false,
    placeholder: "",
    type: "text",
    onChange: fn(),
    onBlur: fn(),
  },
  argTypes: {
    status: inputStatusArgType,
    "aria-invalid": { control: "boolean" },
    disabled: { control: "boolean" },
    placeholder: { control: "text" },
    type: {
      control: "select",
      options: ["text", "tel", "email", "password", "number"],
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Invalid: Story = { args: { "aria-invalid": true } };
export const Disabled: Story = {
  args: { disabled: true, defaultValue: "826417395" },
};

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
