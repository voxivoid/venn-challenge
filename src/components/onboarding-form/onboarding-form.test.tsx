import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, it } from "vitest"
import { OnboardingForm } from "./onboarding-form"

const field = (name: string) => screen.getByRole("textbox", { name })

it("renders every field and the submit button", () => {
  render(<OnboardingForm />)

  expect(
    screen.getByRole("heading", { name: "Onboarding Form", level: 1 }),
  ).toBeInTheDocument()
  expect(field("First Name")).toBeInTheDocument()
  expect(field("Last Name")).toBeInTheDocument()
  expect(field("Phone Number")).toBeInTheDocument()
  expect(field("Corporation Number")).toBeInTheDocument()
  expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument()
})

it("limits names to 50 characters and corporation number to 9", async () => {
  const user = userEvent.setup()
  render(<OnboardingForm />)

  await user.type(field("First Name"), "a".repeat(60))
  await user.type(field("Last Name"), "b".repeat(60))
  await user.type(field("Corporation Number"), "1".repeat(12))

  expect(field("First Name")).toHaveValue("a".repeat(50))
  expect(field("Last Name")).toHaveValue("b".repeat(50))
  expect(field("Corporation Number")).toHaveValue("1".repeat(9))
})

it("lets the user tab through fields in order to submit", async () => {
  const user = userEvent.setup()
  render(<OnboardingForm />)

  await user.click(field("First Name"))
  await user.tab()
  expect(field("Last Name")).toHaveFocus()
  await user.tab()
  expect(field("Phone Number")).toHaveFocus()
  await user.tab()
  expect(field("Corporation Number")).toHaveFocus()
  await user.tab()
  expect(screen.getByRole("button", { name: "Submit" })).toHaveFocus()
})

it("disables the submit button while submitting", () => {
  render(<OnboardingForm isSubmitting />)

  const button = screen.getByRole("button", { name: "Submit" })
  expect(button).toBeDisabled()
  expect(button).toHaveAttribute("aria-busy", "true")
})

it("keeps the submit button enabled when idle", () => {
  render(<OnboardingForm />)

  const button = screen.getByRole("button", { name: "Submit" })
  expect(button).toBeEnabled()
  expect(button).not.toHaveAttribute("aria-busy")
})
