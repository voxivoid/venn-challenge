import { expect, it } from "vitest";
import { apiUrl } from "./api-url";
import { API_BASE_URL } from "./config";

it("prefixes the path with the API base URL", () => {
  expect(apiUrl("/profile-details")).toBe(`${API_BASE_URL}/profile-details`);
});

it("fills every param, encoding its value", () => {
  expect(apiUrl("/a/:id/b/:slug", { id: "1 2", slug: "x/y" })).toBe(
    `${API_BASE_URL}/a/1%202/b/x%2Fy`,
  );
});

it("keeps the placeholders without params, for MSW patterns", () => {
  expect(apiUrl("/corporation-number/:number")).toBe(
    `${API_BASE_URL}/corporation-number/:number`,
  );
});
