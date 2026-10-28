import { OnboardingForm } from "@/components/onboarding-form/onboarding-form";
import { PageShell } from "@/components/layout/page-shell";
import { useOnboardingForm } from "@/components/onboarding-form/use-onboarding-form";

export function OnboardingPage() {
  const form = useOnboardingForm();

  return (
    <PageShell step={1} totalSteps={5}>
      <OnboardingForm {...form} />
    </PageShell>
  );
}
