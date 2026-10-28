import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, it } from 'vitest'
import { OnboardingForm } from './onboarding-form'

it('renders every field and the submit button', () => {
  render(<OnboardingForm />)

  expect(
    screen.getByRole('heading', { name: 'Onboarding Form' }),
  ).toBeInTheDocument()
  expect(screen.getByLabelText('First Name')).toHaveAttribute('maxlength', '50')
  expect(screen.getByLabelText('Last Name')).toHaveAttribute('maxlength', '50')
  expect(screen.getByLabelText('Phone Number')).toBeInTheDocument()
  expect(screen.getByLabelText('Corporation Number')).toHaveAttribute(
    'maxlength',
    '9',
  )
  expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument()
})

it('limits names to 50 characters and corporation number to 9', async () => {
  render(<OnboardingForm />)

  await userEvent.type(screen.getByLabelText('First Name'), 'a'.repeat(60))
  await userEvent.type(
    screen.getByLabelText('Corporation Number'),
    '1'.repeat(12),
  )

  expect(screen.getByLabelText('First Name')).toHaveValue('a'.repeat(50))
  expect(screen.getByLabelText('Corporation Number')).toHaveValue('1'.repeat(9))
})

it('lets the user tab through fields in order to submit', async () => {
  render(<OnboardingForm />)

  await userEvent.click(screen.getByLabelText('First Name'))
  await userEvent.tab()
  expect(screen.getByLabelText('Last Name')).toHaveFocus()
  await userEvent.tab()
  expect(screen.getByLabelText('Phone Number')).toHaveFocus()
  await userEvent.tab()
  expect(screen.getByLabelText('Corporation Number')).toHaveFocus()
  await userEvent.tab()
  expect(screen.getByRole('button', { name: 'Submit' })).toHaveFocus()
})

it('disables the submit button while submitting', () => {
  render(<OnboardingForm isSubmitting />)

  const button = screen.getByRole('button', { name: 'Submit' })
  expect(button).toBeDisabled()
  expect(button).toHaveAttribute('aria-busy', 'true')
})

it('keeps the submit button enabled when idle', () => {
  render(<OnboardingForm />)

  const button = screen.getByRole('button', { name: 'Submit' })
  expect(button).toBeEnabled()
  expect(button).not.toHaveAttribute('aria-busy')
})
