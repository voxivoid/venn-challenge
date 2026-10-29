import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ApiError } from "@/api/api-error";
import { useCheckCorporationNumberQuery } from "@/api/corporation-number";
import { profileDetailsErrorField } from "@/api/profile-details";
import type { FormFieldControl } from "@/components/form-field/form-field";
import type { InputStatus } from "@/components/ui/input";
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
  /**
   * Called with the parsed values once every field is valid. A thrown `ApiError`
   * about one field shows under it; any other throw shows as a form error.
   */
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
  const {
    errors,
    isSubmitting,
    isSubmitSuccessful,
    isSubmitted,
    touchedFields,
    validatingFields,
  } = form.formState;

  const field = (name: OnboardingFormField): FormFieldControl => ({
    ...form.register(name),
    error: errors[name]?.message,
  });

  /** Checking while validating, then the outcome once the field was blurred or submitted. */
  const status = (name: OnboardingFormField): InputStatus | undefined => {
    if (validatingFields[name]) return "loading";
    if (errors[name]) return "invalid";
    return touchedFields[name] || isSubmitted ? "valid" : undefined;
  };

  return {
    fields: {
      firstName: field("firstName"),
      lastName: field("lastName"),
      phone: field("phone"),
      // Only the remote check is slow enough to need visible feedback.
      corporationNumber: {
        ...field("corporationNumber"),
        status: status("corporationNumber"),
      },
    },
    onSubmit: form.handleSubmit(async (values) => {
      try {
        await onSubmit?.(values);
      } catch (error) {
        const message = submitErrorMessage(error);
        // The generic message names no field, so server errors stay form-wide.
        const field = profileDetailsErrorField(message);
        if (field) form.setError(field, { message }, { shouldFocus: true });
        else form.setError("root.submit", { message });
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
