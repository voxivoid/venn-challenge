import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterAll, afterEach, beforeAll, beforeEach, expect, vi } from "vitest";
import { server } from "./server";

let consoleProblems: unknown[][] = [];

beforeAll(() => server.listen({ onUnhandledFrame: "error" }));
beforeEach(() => {
  consoleProblems = [];
  for (const method of ["error", "warn"] as const) {
    vi.spyOn(console, method).mockImplementation((...args) => {
      consoleProblems.push(args);
    });
  }
});
afterEach(() => {
  cleanup();
  server.resetHandlers();
  vi.restoreAllMocks();
  // React act warnings, key warnings, etc. must not slip through unnoticed.
  expect(consoleProblems, "unexpected console.error/warn").toEqual([]);
});
afterAll(() => server.close());
