import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import { FormField } from "./form-field";

it("links the label to the input", () => {
  render(<FormField label="Phone Number" />);

  expect(screen.getByRole("textbox", { name: "Phone Number" })).toBeValid();
});

it("exposes the error to assistive tech", () => {
  render(<FormField label="Phone Number" error="Invalid phone number" />);

  const input = screen.getByRole("textbox", { name: "Phone Number" });
  expect(input).toBeInvalid();
  expect(input).toHaveAccessibleDescription("Invalid phone number");
  expect(screen.getByRole("alert")).toHaveTextContent("Invalid phone number");
});

it("renders no alert without an error", () => {
  render(<FormField label="Phone Number" />);

  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  expect(
    screen.getByRole("textbox", { name: "Phone Number" }),
  ).toHaveAccessibleDescription("");
});

it("forwards input props and events", async () => {
  const user = userEvent.setup();
  const onBlur = vi.fn();
  render(<FormField label="Name" placeholder="Jane" onBlur={onBlur} />);

  const input = screen.getByRole("textbox", { name: "Name" });
  await user.type(input, "abc");
  await user.tab();

  expect(input).toHaveValue("abc");
  expect(input).toHaveAttribute("placeholder", "Jane");
  expect(onBlur).toHaveBeenCalledOnce();
});

it("gives each field its own label association", () => {
  render(
    <>
      <FormField label="A" />
      <FormField label="B" />
    </>,
  );

  expect(screen.getByRole("textbox", { name: "A" })).not.toBe(
    screen.getByRole("textbox", { name: "B" }),
  );
});

it("flags the field invalid only when there is an error", () => {
  const { rerender } = render(<FormField label="Name" />);
  expect(screen.getByRole("textbox", { name: "Name" })).toBeValid();

  rerender(<FormField label="Name" error="Required" />);
  expect(screen.getByRole("textbox", { name: "Name" })).toBeInvalid();
});

it("matches the rendered markup per state", () => {
  const { asFragment, rerender } = render(<FormField label="Name" />);
  expect(asFragment()).toMatchSnapshot("default");

  rerender(<FormField label="Name" error="Required" />);
  expect(asFragment()).toMatchSnapshot("error");
});

it("announces required fields without native constraint validation", () => {
  render(<FormField label="Name" required />);

  const input = screen.getByRole("textbox", { name: "Name" });
  expect(input).toBeRequired();
  expect(input).not.toHaveAttribute("required");
  expect(input).toBeValid();
});

it("is not marked required by default", () => {
  render(<FormField label="Name" />);

  expect(screen.getByRole("textbox", { name: "Name" })).not.toBeRequired();
});

it("keeps a caller description alongside the error", () => {
  render(
    <>
      <p id="hint">Use your legal name</p>
      <FormField label="Name" aria-describedby="hint" error="Required" />
    </>,
  );

  expect(
    screen.getByRole("textbox", { name: "Name" }),
  ).toHaveAccessibleDescription("Use your legal name Required");
});

it("does not let input props override the error state", () => {
  render(<FormField label="Name" aria-invalid={false} error="Required" />);

  expect(screen.getByRole("textbox", { name: "Name" })).toBeInvalid();
});
