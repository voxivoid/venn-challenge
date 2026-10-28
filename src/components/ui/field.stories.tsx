import type { Meta, StoryObj } from '@storybook/react-vite'
import { Input } from './input'
import { Field, FieldError, FieldGroup, FieldLabel } from './field'

const meta = {
  title: 'UI/Field',
  component: Field,
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Field>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Field {...args}>
      <FieldLabel htmlFor="name">Name</FieldLabel>
      <Input id="name" />
    </Field>
  ),
}

export const WithError: Story = {
  render: (args) => (
    <Field {...args} data-invalid>
      <FieldLabel htmlFor="corp">Corporation Number</FieldLabel>
      <Input id="corp" aria-invalid />
      <FieldError>Invalid Corporation Number</FieldError>
    </Field>
  ),
}

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
}
