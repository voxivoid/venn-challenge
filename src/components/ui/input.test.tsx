import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { Input } from "./input";

const input = () => screen.getByRole("textbox", { name: "Example" });

it("shows no status icon by default", () => {
  render(<Input aria-label="Example" />);

  expect(screen.queryByRole("img")).not.toBeInTheDocument();
  expect(input()).not.toHaveAttribute("aria-busy");
});

it.each([
  ["loading", "Checking"],
  ["valid", "Valid"],
  ["invalid", "Invalid"],
] as const)("shows the %s status as a labelled icon", (status, label) => {
  render(<Input aria-label="Example" status={status} />);

  expect(screen.getByRole("img", { name: label })).toMatchSnapshot(status);
});

it("marks the input busy while loading", () => {
  render(<Input aria-label="Example" status="loading" />);

  expect(input()).toHaveAttribute("aria-busy", "true");
});
