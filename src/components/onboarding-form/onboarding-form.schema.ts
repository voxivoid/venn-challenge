import { z } from "zod";
import {
  canadianPhone,
  corporationNumber,
  personName,
  type CorporationNumberCheck,
} from "@/utils/validation";

type OnboardingFormSchemaOptions = {
  /** Verifies a well-formed corporation number remotely; skipped when omitted. */
  checkCorporationNumber?: CorporationNumberCheck;
};

export const createOnboardingFormSchema = ({
  checkCorporationNumber,
}: OnboardingFormSchemaOptions = {}) =>
  z.object({
    firstName: personName("First name"),
    lastName: personName("Last name"),
    phone: canadianPhone("Phone number"),
    corporationNumber: corporationNumber(
      "Corporation number",
      checkCorporationNumber,
    ),
  });

/** Format-only schema: every rule except the remote corporation number check. */
export const onboardingFormSchema = createOnboardingFormSchema();

export type OnboardingFormValues = z.infer<typeof onboardingFormSchema>;
export type OnboardingFormField = keyof OnboardingFormValues;
