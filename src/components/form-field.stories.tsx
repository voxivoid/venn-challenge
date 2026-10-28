import type { Meta, StoryObj } from '@storybook/react-vite'
import { FormField } from './form-field'

const meta = {
  title: 'Components/FormField',
  component: FormField,
  args: { label: 'Corporation Number' },
  decorators: [
    (Story) => (
      <div className="w-96 p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FormField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithError: Story = {
  args: { error: 'Invalid Corporation Number' },
}

export const Disabled: Story = {
  args: { disabled: true, defaultValue: '123456789' },
}

export const LongValue: Story = {
  args: { defaultValue: 'a'.repeat(120), label: 'First Name' },
}
