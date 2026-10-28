import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { IndexPage } from './index'

it('renders the onboarding form inside the step shell', () => {
  render(<IndexPage />)

  expect(screen.getByText('Step 1 of 5')).toBeInTheDocument()
  expect(
    screen.getByRole('heading', { name: 'Onboarding Form' }),
  ).toBeInTheDocument()
})
