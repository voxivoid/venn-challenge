import { ArrowRight } from 'lucide-react'
import { FormField } from '@/components/form-field'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FieldGroup } from '@/components/ui/field'

type OnboardingFormProps = {
  isSubmitting?: boolean
}

export function OnboardingForm({ isSubmitting = false }: OnboardingFormProps) {
  return (
    <Card className="w-full max-w-lg rounded-3xl bg-background py-6">
      <CardHeader>
        <CardTitle
          role="heading"
          aria-level={1}
          className="text-center text-2xl font-normal"
        >
          Onboarding Form
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form noValidate className="flex flex-col gap-6">
          <FieldGroup className="gap-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                label="First Name"
                name="firstName"
                maxLength={50}
                autoComplete="given-name"
              />
              <FormField
                label="Last Name"
                name="lastName"
                maxLength={50}
                autoComplete="family-name"
              />
            </div>
            <FormField
              label="Phone Number"
              name="phone"
              type="tel"
              autoComplete="tel"
            />
            <FormField
              label="Corporation Number"
              name="corporationNumber"
              inputMode="numeric"
              maxLength={9}
            />
          </FieldGroup>
          <Button
            type="submit"
            size="lg"
            loading={isSubmitting}
            icon={<ArrowRight />}
            className="h-11 w-full rounded-xl text-sm"
          >
            Submit
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
