import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { PageShell } from "./page-shell";

it("shows the current step and its children", () => {
  render(
    <PageShell step={2} totalSteps={5}>
      <p>content</p>
    </PageShell>,
  );

  expect(screen.getByText("Step 2 of 5")).toBeInTheDocument();
  expect(screen.getByRole("main")).toHaveTextContent("content");
});

it("matches the rendered markup", () => {
  const { asFragment } = render(
    <PageShell step={1} totalSteps={5}>
      <p>content</p>
    </PageShell>,
  );

  expect(asFragment()).toMatchSnapshot();
});
