import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import { Button } from "./button";

const icon = <svg data-testid="icon" />;
const label = <span>Save</span>;

const isBefore = (first: HTMLElement, second: HTMLElement) =>
  Boolean(
    first.compareDocumentPosition(second) & Node.DOCUMENT_POSITION_FOLLOWING,
  );

it("fires onClick when idle", async () => {
  const user = userEvent.setup();
  const onClick = vi.fn();
  render(<Button onClick={onClick}>Save</Button>);

  await user.click(screen.getByRole("button", { name: "Save" }));

  expect(onClick).toHaveBeenCalledOnce();
});

it("is busy and blocks clicks while loading", async () => {
  const user = userEvent.setup();
  const onClick = vi.fn();
  render(
    <Button loading onClick={onClick}>
      Save
    </Button>,
  );

  const button = screen.getByRole("button", { name: "Save" });
  await user.click(button);

  expect(button).toBeDisabled();
  expect(button).toHaveAttribute("aria-busy", "true");
  expect(onClick).not.toHaveBeenCalled();
});

it("stays disabled when disabled and not loading", () => {
  render(<Button disabled>Save</Button>);

  const button = screen.getByRole("button", { name: "Save" });
  expect(button).toBeDisabled();
  expect(button).not.toHaveAttribute("aria-busy");
});

it("keeps the accessible name free of the icon", () => {
  render(<Button icon={icon}>Save</Button>);

  expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
});

it("renders the icon after the label by default", () => {
  render(<Button icon={icon}>{label}</Button>);

  expect(isBefore(screen.getByText("Save"), screen.getByTestId("icon"))).toBe(
    true,
  );
});

it("renders the icon before the label when positioned left", () => {
  render(
    <Button icon={icon} iconPosition="left">
      {label}
    </Button>,
  );

  expect(isBefore(screen.getByTestId("icon"), screen.getByText("Save"))).toBe(
    true,
  );
});

it("hides the icon while loading", () => {
  render(
    <Button loading icon={icon}>
      Save
    </Button>,
  );

  expect(screen.queryByTestId("icon")).not.toBeInTheDocument();
});

// The spinner is decorative (aria-hidden), so its placement is checked by snapshot.
it("matches the rendered markup per state", () => {
  const { asFragment, rerender } = render(<Button>Save</Button>);
  expect(asFragment()).toMatchSnapshot("idle");

  rerender(<Button loading>Save</Button>);
  expect(asFragment()).toMatchSnapshot("loading, spinner on the right");

  rerender(
    <Button loading iconPosition="left">
      Save
    </Button>,
  );
  expect(asFragment()).toMatchSnapshot("loading, spinner on the left");
});
