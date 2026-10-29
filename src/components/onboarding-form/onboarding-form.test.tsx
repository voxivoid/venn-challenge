import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import { OnboardingForm, type OnboardingFormProps } from "./onboarding-form";
import { onboardingFormSchema } from "./onboarding-form.schema";

const field = (name: string) => screen.getByRole("textbox", { name });

const renderForm = (props: Partial<OnboardingFormProps> = {}) =>
  render(
    <OnboardingForm
      fields={{ firstName: {}, lastName: {}, phone: {}, corporationNumber: {} }}
      onSubmit={(event) => event.preventDefault()}
      {...props}
    />,
  );

it("renders every field as required and the submit button", () => {
  renderForm();

  expect(
    screen.getByRole("heading", { name: "Onboarding Form", level: 1 }),
  ).toBeInTheDocument();
  for (const name of [
    "First Name",
    "Last Name",
    "Phone Number",
    "Corporation Number",
  ]) {
    expect(field(name)).toBeRequired();
  }
  expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
});

it("lets the user tab through fields in order to submit", async () => {
  const user = userEvent.setup();
  renderForm();

  await user.click(field("First Name"));
  await user.tab();
  expect(field("Last Name")).toHaveFocus();
  await user.tab();
  expect(field("Phone Number")).toHaveFocus();
  await user.tab();
  expect(field("Corporation Number")).toHaveFocus();
  await user.tab();
  expect(screen.getByRole("button", { name: "Submit" })).toHaveFocus();
});

it("shows each field error under its field", () => {
  renderForm({
    fields: {
      firstName: { error: "First name is required" },
      lastName: {},
      phone: { error: "Phone number must be a valid Canadian number" },
      corporationNumber: {},
    },
  });

  expect(field("First Name")).toHaveAccessibleDescription(
    "First name is required",
  );
  expect(field("Phone Number")).toHaveAccessibleDescription(
    "Phone number must be a valid Canadian number",
  );
  expect(field("Last Name")).toBeValid();
});

it("submits with the keyboard", async () => {
  const user = userEvent.setup();
  const onSubmit = vi.fn((event: React.SubmitEvent) => event.preventDefault());
  renderForm({ onSubmit });

  await user.type(field("First Name"), "{Enter}");

  expect(onSubmit).toHaveBeenCalledOnce();
});

it("disables the submit button while submitting", () => {
  renderForm({ isSubmitting: true });

  const button = screen.getByRole("button", { name: "Submit" });
  expect(button).toBeDisabled();
  expect(button).toHaveAttribute("aria-busy", "true");
});

it("keeps the submit button enabled when idle", () => {
  renderForm();

  const button = screen.getByRole("button", { name: "Submit" });
  expect(button).toBeEnabled();
  expect(button).not.toHaveAttribute("aria-busy");
});

it("shows a submit error as an alert", () => {
  renderForm({ submitError: "Invalid corporation number" });

  expect(screen.getByRole("alert")).toHaveTextContent(
    "Invalid corporation number",
  );
});

it("announces a successful submit", () => {
  renderForm({ isSubmitSuccessful: true });

  expect(screen.getByRole("status")).toHaveTextContent(
    "Your profile details have been saved.",
  );
});

it("replaces the submit button with the saved message, which takes focus", () => {
  renderForm({ isSubmitSuccessful: true });

  expect(
    screen.queryByRole("button", { name: "Submit" }),
  ).not.toBeInTheDocument();
  expect(
    screen.getByText("Your profile details have been saved."),
  ).toHaveFocus();
});

it("shows no submit outcome before submitting", () => {
  renderForm();

  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  expect(screen.getByRole("status")).toBeEmptyDOMElement();
});

it("shows a placeholder example on every field", () => {
  renderForm();

  for (const name of [
    "First Name",
    "Last Name",
    "Phone Number",
    "Corporation Number",
  ]) {
    expect(field(name)).toHaveAttribute("placeholder");
  }
});

it("uses placeholder examples that pass validation", () => {
  renderForm();

  const examples = {
    firstName: field("First Name"),
    lastName: field("Last Name"),
    phone: field("Phone Number"),
    corporationNumber: field("Corporation Number"),
  };
  const values = Object.fromEntries(
    Object.entries(examples).map(([key, input]) => [
      key,
      input.getAttribute("placeholder"),
    ]),
  );

  expect(onboardingFormSchema.safeParse(values).success).toBe(true);
});
