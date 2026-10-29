import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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

type UseOnboardingFormOptions = {
  /** Called with the parsed values once every field is valid. */
  onSubmit?: (values: OnboardingFormValues) => void | Promise<void>;
};

/**
 * Wires the onboarding form: validates on blur (including the remote corporation
 * number check), and on submit before calling `onSubmit`.
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
  const { errors, isSubmitting } = form.formState;

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
    onSubmit: form.handleSubmit((values) => onSubmit?.(values)),
    isSubmitting,
  };
}
