import { createFileRoute } from '@tanstack/react-router'
import { OnboardingForm } from '@/components/onboarding-form/onboarding-form'
import { PageShell } from '@/components/layout/page-shell'

export const Route = createFileRoute('/')({
  component: OnboardingPage,
})

function OnboardingPage() {
  return (
    <PageShell step={1} totalSteps={5}>
      <OnboardingForm />
    </PageShell>
  )
}
