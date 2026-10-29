import type { SubmitEventHandler } from "react";
import { ArrowRight, CircleCheck } from "lucide-react";
import {
  FormField,
  type FormFieldControl,
} from "@/components/form-field/form-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldError, FieldGroup } from "@/components/ui/field";
import type { OnboardingFormField } from "./onboarding-form.schema";

export type OnboardingFormProps = {
  /** Input props and error per field, e.g. from `useOnboardingForm`. */
  fields: Record<OnboardingFormField, FormFieldControl>;
  onSubmit: SubmitEventHandler<HTMLFormElement>;
  isSubmitting?: boolean;
  /** The last submit went through. */
  isSubmitSuccessful?: boolean;
  /** Why the last submit failed, shown below the button. */
  submitError?: string;
};

const focus = (element: HTMLElement | null) => element?.focus();

export function OnboardingForm({
  fields,
  onSubmit,
  isSubmitting = false,
  isSubmitSuccessful = false,
  submitError,
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
          {/* Always mounted so screen readers announce the message when it appears. */}
          <div role="status" className="empty:hidden">
            {isSubmitSuccessful && (
              // Takes focus, since it replaces the button that had it.
              <p
                ref={focus}
                tabIndex={-1}
                className="flex h-11 items-center justify-center gap-2 text-sm font-medium text-green-600 outline-none dark:text-green-500"
              >
                <CircleCheck aria-hidden className="size-5" />
                Your profile details have been saved.
              </p>
            )}
          </div>
          {!isSubmitSuccessful && (
            <Button
              type="submit"
              size="lg"
              loading={isSubmitting}
              icon={<ArrowRight />}
              className="h-11 w-full rounded-xl text-sm"
            >
              Submit
            </Button>
          )}
          {submitError && (
            <FieldError className="text-center">{submitError}</FieldError>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
