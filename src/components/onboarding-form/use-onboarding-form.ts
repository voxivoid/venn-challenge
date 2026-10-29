import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ApiError } from "@/api/api-error";
import { useCheckCorporationNumberQuery } from "@/api/corporation-number";
import type { FormFieldControl } from "@/components/form-field";
import type { OnboardingFormProps } from "./onboarding-form";
import {
  createOnboardingFormSchema,
  type OnboardingFormField,
  type OnboardingFormValues,
} from "./onboarding-form.schema";

const emptyValues: OnboardingFormValues = {
  firstName: "",
  lastName: "",
  phone: "",
  corporationNumber: "",
};

const GENERIC_SUBMIT_ERROR = "Something went wrong, please try again";

type UseOnboardingFormOptions = {
  /** Called with the parsed values once every field is valid. A throw shows as a form error. */
  onSubmit?: (values: OnboardingFormValues) => void | Promise<void>;
};

/**
 * Wires the onboarding form: validates on blur (including the remote corporation
 * number check), and on submit before calling `onSubmit`, whose outcome it
 * reports as `isSubmitSuccessful` or `submitError`.
 */
export function useOnboardingForm({
  onSubmit,
}: UseOnboardingFormOptions = {}): OnboardingFormProps {
  const checkCorporationNumber = useCheckCorporationNumberQuery();
  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(
      createOnboardingFormSchema({ checkCorporationNumber }),
    ),
    mode: "onBlur",
    reValidateMode: "onBlur",
    defaultValues: emptyValues,
  });
  const { errors, isSubmitting, isSubmitSuccessful } = form.formState;

  const field = (name: OnboardingFormField): FormFieldControl => ({
    ...form.register(name),
    error: errors[name]?.message,
  });

  return {
    fields: {
      firstName: field("firstName"),
      lastName: field("lastName"),
      phone: field("phone"),
      corporationNumber: field("corporationNumber"),
    },
    onSubmit: form.handleSubmit(async (values) => {
      try {
        await onSubmit?.(values);
      } catch (error) {
        form.setError("root.submit", { message: submitErrorMessage(error) });
      }
    }),
    isSubmitting,
    isSubmitSuccessful,
    submitError: errors.root?.submit?.message,
  };
}

/** The API's own message for a rejected submit (4xx); a generic retry hint otherwise. */
function submitErrorMessage(error: unknown) {
  return error instanceof ApiError && error.status < 500
    ? error.message
    : GENERIC_SUBMIT_ERROR;
}
