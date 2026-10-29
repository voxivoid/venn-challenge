import { useCreateProfileDetailsMutation } from "@/api/profile-details";
import { OnboardingForm } from "@/components/onboarding-form/onboarding-form";
import { PageShell } from "@/components/layout/page-shell";
import { useOnboardingForm } from "@/components/onboarding-form/use-onboarding-form";

export function OnboardingPage() {
  const { mutateAsync: createProfileDetails } =
    useCreateProfileDetailsMutation();
  const form = useOnboardingForm({ onSubmit: createProfileDetails });

  return (
    <PageShell step={1} totalSteps={5}>
      <OnboardingForm {...form} />
    </PageShell>
  );
}
