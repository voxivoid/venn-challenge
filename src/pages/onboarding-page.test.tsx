import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderRoute } from "@/test/render-route";

const field = (name: string) => screen.getByRole("textbox", { name });

it("renders the onboarding form at / inside the step shell", () => {
  renderRoute("/");

  expect(screen.getByText("Step 1 of 5")).toBeInTheDocument();
  expect(
    screen.getByRole("heading", { name: "Onboarding Form" }),
  ).toBeInTheDocument();
});

it("shows no errors before the user interacts", () => {
  renderRoute("/");

  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
});

it("validates a field when it loses focus", async () => {
  const { user } = renderRoute("/");

  await user.click(field("First Name"));
  await user.tab();

  expect(field("First Name")).toBeInvalid();
  expect(field("First Name")).toHaveAccessibleDescription(
    "First name is required",
  );
  // Untouched fields stay quiet.
  expect(field("Last Name")).toBeValid();
});

it("does not validate while typing, only on blur", async () => {
  const { user } = renderRoute("/");

  await user.type(field("Phone Number"), "123");
  expect(field("Phone Number")).toBeValid();

  await user.tab();
  expect(field("Phone Number")).toHaveAccessibleDescription(
    "Phone number must start with +1 and contain only digits",
  );
});

it("clears an error once the field is fixed and blurred again", async () => {
  const { user } = renderRoute("/");

  await user.type(field("Corporation Number"), "1234");
  await user.tab();
  expect(field("Corporation Number")).toHaveAccessibleDescription(
    "Corporation number must be 9 digits",
  );

  await user.type(field("Corporation Number"), "56789");
  await user.tab();
  expect(field("Corporation Number")).toBeValid();
});

it("rejects a valid but non-Canadian phone number", async () => {
  const { user } = renderRoute("/");

  await user.type(field("Phone Number"), "+12125551234");
  await user.tab();

  expect(field("Phone Number")).toHaveAccessibleDescription(
    "Phone number must be a valid Canadian number",
  );
});

it("shows every missing field under its input on submit and focuses the first", async () => {
  const { user } = renderRoute("/");

  await user.click(screen.getByRole("button", { name: "Submit" }));

  expect(field("First Name")).toHaveAccessibleDescription(
    "First name is required",
  );
  expect(field("Last Name")).toHaveAccessibleDescription(
    "Last name is required",
  );
  expect(field("Phone Number")).toHaveAccessibleDescription(
    "Phone number is required",
  );
  expect(field("Corporation Number")).toHaveAccessibleDescription(
    "Corporation number is required",
  );
  expect(field("First Name")).toHaveFocus();
});

it("re-validates on blur after a failed submit, not while typing", async () => {
  const { user } = renderRoute("/");

  await user.click(screen.getByRole("button", { name: "Submit" }));
  expect(field("First Name")).toBeInvalid();

  await user.type(field("First Name"), "Hello");
  expect(field("First Name")).toBeInvalid();

  await user.tab();
  expect(field("First Name")).toBeValid();
});

describe("character limits", () => {
  it("keeps every typed character and shows an error once a name is over 50", async () => {
    const { user } = renderRoute("/");

    await user.type(field("First Name"), "a".repeat(51));
    expect(field("First Name")).toHaveValue("a".repeat(51));
    await user.tab();

    expect(field("First Name")).toHaveAccessibleDescription(
      "First name must be 50 characters or fewer",
    );
  });

  it("accepts a name of exactly 50 characters", async () => {
    const { user } = renderRoute("/");

    await user.type(field("Last Name"), "a".repeat(50));
    await user.tab();

    expect(field("Last Name")).toBeValid();
  });

  it("clears the error once the name is shortened", async () => {
    const { user } = renderRoute("/");

    await user.type(field("Last Name"), "a".repeat(51));
    await user.tab();
    expect(field("Last Name")).toBeInvalid();

    await user.type(field("Last Name"), "{Backspace}");
    await user.tab();
    expect(field("Last Name")).toBeValid();
  });

  it.each(["12345678", "1234567890"])(
    "shows an error for a corporation number of the wrong length (%s)",
    async (number) => {
      const { user } = renderRoute("/");

      await user.type(field("Corporation Number"), number);
      expect(field("Corporation Number")).toHaveValue(number);
      await user.tab();

      expect(field("Corporation Number")).toHaveAccessibleDescription(
        "Corporation number must be 9 digits",
      );
    },
  );
});
