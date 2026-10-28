import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, it, vi } from "vitest"
import { Button } from "./button"

it("fires onClick when idle", async () => {
  const onClick = vi.fn()
  render(<Button onClick={onClick}>Save</Button>)

  await userEvent.click(screen.getByRole("button", { name: "Save" }))

  expect(onClick).toHaveBeenCalledOnce()
})

it("is busy and blocks clicks while loading", async () => {
  const onClick = vi.fn()
  render(
    <Button loading onClick={onClick}>
      Save
    </Button>,
  )

  const button = screen.getByRole("button", { name: "Save" })
  await userEvent.click(button)

  expect(button).toBeDisabled()
  expect(button).toHaveAttribute("aria-busy", "true")
  expect(onClick).not.toHaveBeenCalled()
})

it("stays disabled when disabled and not loading", () => {
  render(<Button disabled>Save</Button>)

  const button = screen.getByRole("button", { name: "Save" })
  expect(button).toBeDisabled()
  expect(button).not.toHaveAttribute("aria-busy")
})

it("renders the icon after the label by default", () => {
  render(<Button icon={<svg data-testid="icon" />}>Save</Button>)

  const button = screen.getByRole("button", { name: "Save" })
  expect(button.lastElementChild).toContainElement(screen.getByTestId("icon"))
})

it("renders the icon before the label when positioned left", () => {
  render(
    <Button icon={<svg data-testid="icon" />} iconPosition="left">
      Save
    </Button>,
  )

  const button = screen.getByRole("button", { name: "Save" })
  expect(button.firstElementChild).toContainElement(screen.getByTestId("icon"))
})

it("replaces the icon with a spinner on the same side while loading", () => {
  render(
    <Button loading icon={<svg data-testid="icon" />} iconPosition="left">
      Save
    </Button>,
  )

  const button = screen.getByRole("button", { name: "Save" })
  expect(screen.queryByTestId("icon")).not.toBeInTheDocument()
  expect(button.firstElementChild?.querySelector("svg")).toHaveClass(
    "animate-spin",
  )
})

it("shows the spinner on the right by default while loading", () => {
  render(<Button loading>Save</Button>)

  const button = screen.getByRole("button", { name: "Save" })
  expect(button.lastElementChild?.querySelector("svg")).toHaveClass(
    "animate-spin",
  )
})

it("renders no icon slot without an icon", () => {
  render(<Button>Save</Button>)

  expect(screen.getByRole("button").children).toHaveLength(0)
})
