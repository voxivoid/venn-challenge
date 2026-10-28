import { render } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { RouterProvider, createMemoryRouter } from "react-router"
import { routes } from "@/router"

/** Renders the app's real routes at `path` with an in-memory history. */
export function renderRoute(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] })

  return {
    user: userEvent.setup(),
    router,
    ...render(<RouterProvider router={router} />),
  }
}
