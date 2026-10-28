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
  render(<FormField label="Name" maxLength={3} onBlur={onBlur} />);

  const input = screen.getByRole("textbox", { name: "Name" });
  await user.type(input, "abcdef");
  await user.tab();

  expect(input).toHaveValue("abc");
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
