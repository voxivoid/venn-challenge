import type { ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { inputStatusArgType } from "@/test/storybook";
import { Input, type InputStatus } from "./input";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "./field";

/** `Field` props plus its label, description, error and input, all editable from the controls. */
type FieldStoryArgs = ComponentProps<typeof Field> & {
  label: string;
  description: string;
  error: string;
  disabled: boolean;
  status?: InputStatus;
};

const meta = {
  title: "UI/Field",
  component: Field,
  args: {
    orientation: "vertical",
    label: "Corporation Number",
    description: "",
    error: "",
    disabled: false,
    status: undefined,
  },
  argTypes: {
    orientation: {
      control: "inline-radio",
      options: ["vertical", "horizontal", "responsive"],
    },
    label: { control: "text" },
    description: { control: "text" },
    error: { control: "text", description: "Empty for no error." },
    disabled: { control: "boolean" },
    status: inputStatusArgType,
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
  render: ({ label, description, error, disabled, status, ...args }) => (
    <Field {...args} data-invalid={!!error}>
      <FieldLabel htmlFor="field">{label}</FieldLabel>
      <Input
        id="field"
        disabled={disabled}
        status={status}
        aria-invalid={!!error}
      />
      {description && <FieldDescription>{description}</FieldDescription>}
      {error && <FieldError>{error}</FieldError>}
    </Field>
  ),
} satisfies Meta<FieldStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithDescription: Story = {
  args: { description: "9 digits, as on your registration." },
};

export const WithError: Story = {
  args: { error: "Invalid Corporation Number" },
};

export const Group: Story = {
  render: () => (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="first">First Name</FieldLabel>
        <Input id="first" />
      </Field>
      <Field>
        <FieldLabel htmlFor="last">Last Name</FieldLabel>
        <Input id="last" />
      </Field>
    </FieldGroup>
  ),
};
