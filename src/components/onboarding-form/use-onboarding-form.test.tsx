import { screen } from "@testing-library/react";
import { beforeEach, expect, it, vi } from "vitest";
import { OnboardingForm } from "./onboarding-form";
import type { OnboardingFormValues } from "./onboarding-form.schema";
import { buildOnboardingFormValues } from "@/test/factories";
import {
  corporationNumberHandler,
  invalidCorporationNumberReply,
} from "@/api/corporation-number/corporation-number.handlers";
import { renderWithProviders } from "@/test/render";
import { server } from "@/test/server";
import { useOnboardingForm } from "./use-onboarding-form";

type OnSubmit = (values: OnboardingFormValues) => void | Promise<void>;

function Harness({ onSubmit }: { onSubmit?: OnSubmit }) {
  return <OnboardingForm {...useOnboardingForm({ onSubmit })} />;
}

const field = (name: string) => screen.getByRole("textbox", { name });
const submitButton = () => screen.getByRole("button", { name: "Submit" });

const INVALID_CORPORATION_NUMBER = "111111111";

beforeEach(() => {
  server.use(corporationNumberHandler());
});

async function setup(onSubmit?: OnSubmit) {
  const { user } = renderWithProviders(<Harness onSubmit={onSubmit} />);

  const fill = async (values: OnboardingFormValues) => {
    await user.type(field("First Name"), values.firstName);
    await user.type(field("Last Name"), values.lastName);
    await user.type(field("Phone Number"), values.phone);
    await user.type(field("Corporation Number"), values.corporationNumber);
  };

  return { user, fill };
}

it("calls onSubmit with the trimmed values when every field is valid", async () => {
  const onSubmit = vi.fn();
  const { user, fill } = await setup(onSubmit);

  await fill(buildOnboardingFormValues({ firstName: " Hello " }));
  await user.click(submitButton());

  expect(onSubmit).toHaveBeenCalledExactlyOnceWith(buildOnboardingFormValues());
});

it("does not call onSubmit while a field is invalid", async () => {
  const onSubmit = vi.fn();
  const { user, fill } = await setup(onSubmit);

  await fill(buildOnboardingFormValues({ phone: "+12125551234" }));
  await user.click(submitButton());

  expect(
    await screen.findByText("Phone number must be a valid Canadian number"),
  ).toBeInTheDocument();
  expect(onSubmit).not.toHaveBeenCalled();
});

it("does not call onSubmit when the API rejects the corporation number", async () => {
  server.use(
    corporationNumberHandler({ reply: invalidCorporationNumberReply }),
  );
  const onSubmit = vi.fn();
  const { user, fill } = await setup(onSubmit);

  await fill(
    buildOnboardingFormValues({
      corporationNumber: INVALID_CORPORATION_NUMBER,
    }),
  );
  await user.click(submitButton());

  expect(
    await screen.findByText("Invalid corporation number"),
  ).toBeInTheDocument();
  expect(onSubmit).not.toHaveBeenCalled();
});

it("shows the button as busy until onSubmit settles", async () => {
  let resolve = () => {};
  const promise = new Promise<void>((done) => (resolve = done));
  const { user, fill } = await setup(() => promise);

  await fill(buildOnboardingFormValues());
  await user.click(submitButton());

  expect(submitButton()).toHaveAttribute("aria-busy", "true");
  resolve();
  expect(
    await screen.findByText("Your profile details have been saved."),
  ).toBeInTheDocument();
});

it("submits without an onSubmit handler", async () => {
  const { user, fill } = await setup();

  await fill(buildOnboardingFormValues());
  await user.click(submitButton());

  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
});
