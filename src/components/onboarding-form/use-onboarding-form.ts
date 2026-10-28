import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { FormFieldControl } from "@/components/form-field";
import type { OnboardingFormProps } from "./onboarding-form";
import {
  onboardingFormSchema,
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

/** Wires the onboarding form: validates on blur, and on submit before calling `onSubmit`. */
export function useOnboardingForm({
  onSubmit,
}: UseOnboardingFormOptions = {}): OnboardingFormProps {
  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingFormSchema),
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
