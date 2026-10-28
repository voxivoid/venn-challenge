import { expect, it } from "vitest";
import { buildOnboardingFormValues } from "@/test/factories";
import { onboardingFormSchema } from "./onboarding-form.schema";

it("accepts valid values", () => {
  expect(
    onboardingFormSchema.safeParse(buildOnboardingFormValues()).success,
  ).toBe(true);
});

it("returns trimmed values", () => {
  const values = onboardingFormSchema.parse(
    buildOnboardingFormValues({ firstName: " Hello " }),
  );

  expect(values.firstName).toBe("Hello");
});

it("labels each field in its messages", () => {
  const result = onboardingFormSchema.safeParse({
    firstName: "",
    lastName: "",
    phone: "",
    corporationNumber: "",
  });

  expect(
    result.error?.issues.map((issue) => [issue.path[0], issue.message]),
  ).toEqual([
    ["firstName", "First name is required"],
    ["lastName", "Last name is required"],
    ["phone", "Phone number is required"],
    ["corporationNumber", "Corporation number is required"],
  ]);
});
