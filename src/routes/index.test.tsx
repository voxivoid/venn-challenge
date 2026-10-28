import { render, screen } from '@testing-library/react'
import {
  RouterProvider,
  createMemoryHistory,
  createRouter,
} from '@tanstack/react-router'
import { expect, it } from 'vitest'
import { routeTree } from '@/routeTree.gen'

it('renders the onboarding form at / inside the step shell', async () => {
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: ['/'] }),
  })
  render(<RouterProvider router={router} />)

  expect(await screen.findByText('Step 1 of 5')).toBeInTheDocument()
  expect(
    screen.getByRole('heading', { name: 'Onboarding Form' }),
  ).toBeInTheDocument()
})
