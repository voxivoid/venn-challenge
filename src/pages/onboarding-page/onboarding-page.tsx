import { useCreateProfileDetailsMutation } from "@/api/profile-details";
import { OnboardingForm } from "@/components/onboarding-form/onboarding-form";
import { useOnboardingForm } from "@/components/onboarding-form/use-onboarding-form";
import { StepIndicator } from "@/components/step-indicator/step-indicator";

export function OnboardingPage() {
  const { mutateAsync: createProfileDetails } =
    useCreateProfileDetailsMutation();
  const form = useOnboardingForm({ onSubmit: createProfileDetails });

  return (
    <>
      <StepIndicator step={1} totalSteps={5} />
      <OnboardingForm {...form} />
    </>
  );
}
