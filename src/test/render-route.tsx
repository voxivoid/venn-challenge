import { render } from '@testing-library/react'
import {
  RouterProvider,
  createMemoryHistory,
  createRouter,
} from '@tanstack/react-router'
import userEvent from '@testing-library/user-event'
import { routeTree } from '@/routeTree.gen'

/** Renders the real route tree at `path` with an in-memory history. */
export function renderRoute(path = '/') {
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: [path] }),
  })

  return {
    user: userEvent.setup(),
    router,
    ...render(<RouterProvider router={router} />),
  }
}
