import { z } from "zod";
import {
  canadianPhone,
  corporationNumber,
  personName,
} from "@/utils/validation";

export const onboardingFormSchema = z.object({
  firstName: personName("First name"),
  lastName: personName("Last name"),
  phone: canadianPhone("Phone number"),
  corporationNumber: corporationNumber("Corporation number"),
});

export type OnboardingFormValues = z.infer<typeof onboardingFormSchema>;
export type OnboardingFormField = keyof OnboardingFormValues;
