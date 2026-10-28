import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, it, vi } from 'vitest'
import { FormField } from './form-field'

it('links the label to the input', () => {
  render(<FormField label="Phone Number" />)
  expect(screen.getByLabelText('Phone Number')).toBeValid()
})

it('exposes the error to assistive tech', () => {
  render(<FormField label="Phone Number" error="Invalid phone number" />)

  const input = screen.getByLabelText('Phone Number')
  expect(input).toBeInvalid()
  expect(input).toHaveAccessibleDescription('Invalid phone number')
  expect(screen.getByRole('alert')).toHaveTextContent('Invalid phone number')
})

it('renders no alert without an error', () => {
  render(<FormField label="Phone Number" />)

  expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  expect(screen.getByLabelText('Phone Number')).not.toHaveAttribute(
    'aria-describedby',
  )
})

it('forwards input props and events', async () => {
  const onBlur = vi.fn()
  render(<FormField label="Name" maxLength={3} onBlur={onBlur} />)

  const input = screen.getByLabelText('Name')
  await userEvent.type(input, 'abcdef')
  await userEvent.tab()

  expect(input).toHaveValue('abc')
  expect(onBlur).toHaveBeenCalledOnce()
})

it('gives each field a unique id', () => {
  render(
    <>
      <FormField label="A" />
      <FormField label="B" />
    </>,
  )

  expect(screen.getByLabelText('A').id).not.toBe(screen.getByLabelText('B').id)
})

it('marks the field invalid only when there is an error', () => {
  const { rerender } = render(<FormField label="Name" />)
  expect(screen.getByRole('group', { hidden: true })).toHaveAttribute(
    'data-invalid',
    'false',
  )

  rerender(<FormField label="Name" error="Required" />)
  expect(screen.getByRole('group', { hidden: true })).toHaveAttribute(
    'data-invalid',
    'true',
  )
})
