import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { StepIndicator } from "./step-indicator";

it("shows the current step out of the total", () => {
  render(<StepIndicator step={2} totalSteps={5} />);

  expect(screen.getByText("Step 2 of 5")).toBeInTheDocument();
});
