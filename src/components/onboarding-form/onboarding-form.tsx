import type { FormEventHandler } from "react";
import { ArrowRight } from "lucide-react";
import { FormField, type FormFieldControl } from "@/components/form-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import type { OnboardingFormField } from "./onboarding-form.schema";

export type OnboardingFormProps = {
  /** Input props and error per field, e.g. from `useOnboardingForm`. */
  fields: Record<OnboardingFormField, FormFieldControl>;
  onSubmit: FormEventHandler<HTMLFormElement>;
  isSubmitting?: boolean;
};

export function OnboardingForm({
  fields,
  onSubmit,
  isSubmitting = false,
}: OnboardingFormProps) {
  return (
    <Card className="w-full max-w-lg rounded-3xl bg-background py-6">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-normal">
          <h1>Onboarding Form</h1>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form noValidate onSubmit={onSubmit} className="flex flex-col gap-6">
          <FieldGroup className="gap-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                label="First Name"
                placeholder="Jane"
                autoComplete="given-name"
                required
                {...fields.firstName}
              />
              <FormField
                label="Last Name"
                placeholder="Doe"
                autoComplete="family-name"
                required
                {...fields.lastName}
              />
            </div>
            <FormField
              label="Phone Number"
              type="tel"
              autoComplete="tel"
              placeholder="+14165550123"
              required
              {...fields.phone}
            />
            <FormField
              label="Corporation Number"
              placeholder="826417395"
              inputMode="numeric"
              required
              {...fields.corporationNumber}
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
  );
}
