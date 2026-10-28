import type { OnboardingFormValues } from "@/components/onboarding-form/onboarding-form.schema";

/** Valid onboarding values accepted by the API; override what a test cares about. */
export const buildOnboardingFormValues = (
  overrides: Partial<OnboardingFormValues> = {},
): OnboardingFormValues => ({
  firstName: "Hello",
  lastName: "World",
  phone: "+13062776103",
  corporationNumber: "826417395",
  ...overrides,
});
