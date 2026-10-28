import { afterEach, expect, it, vi } from "vitest";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

it("exposes the API base url from the environment", async () => {
  vi.stubEnv("VITE_API_BASE_URL", "https://api.example.com");

  const { API_BASE_URL } = await import("./config");

  expect(API_BASE_URL).toBe("https://api.example.com");
});

it("fails fast when the API base url is missing", async () => {
  vi.stubEnv("VITE_API_BASE_URL", "");

  await expect(import("./config")).rejects.toThrow(
    "Missing env var VITE_API_BASE_URL",
  );
});
