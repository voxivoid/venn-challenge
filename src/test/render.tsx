import type { ReactElement } from "react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createMemoryRouter } from "react-router";
import { routes } from "@/router";
import { createQueryClient } from "@/utils/query-client";

/** A fresh client per test: no retries, so failures surface immediately. */
function createTestQueryClient() {
  return createQueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
}

/** Renders `ui` inside the app providers (TanStack Query). */
export function renderWithProviders(ui: ReactElement) {
  const queryClient = createTestQueryClient();

  return {
    user: userEvent.setup(),
    queryClient,
    ...render(
      <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
    ),
  };
}

/** Renders the app's real routes at `path` with an in-memory history. */
export function renderRoute(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] });

  return { router, ...renderWithProviders(<RouterProvider router={router} />) };
}
