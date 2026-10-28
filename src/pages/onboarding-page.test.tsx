import { screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { renderRoute } from "@/test/render-route";

it("renders the onboarding form at / inside the step shell", () => {
  renderRoute("/");

  expect(screen.getByText("Step 1 of 5")).toBeInTheDocument();
  expect(
    screen.getByRole("heading", { name: "Onboarding Form" }),
  ).toBeInTheDocument();
});
