import { expect, it } from "vitest";
import { createQueryClient } from "./query-client";

it("applies the app query defaults", () => {
  const queries = createQueryClient().getDefaultOptions().queries;

  expect(queries?.staleTime).toBe(60_000);
  expect(queries?.refetchOnWindowFocus).toBe(false);
});

it("lets callers override and extend the defaults", () => {
  const client = createQueryClient({
    defaultOptions: { queries: { staleTime: 0, retry: false } },
  });
  const queries = client.getDefaultOptions().queries;

  expect(queries?.staleTime).toBe(0);
  expect(queries?.retry).toBe(false);
  expect(queries?.refetchOnWindowFocus).toBe(false);
});
