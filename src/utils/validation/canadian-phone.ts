import { parsePhoneNumberFromString } from "libphonenumber-js";
import { requiredText } from "./required-text";

const parse = (value: string) => parsePhoneNumberFromString(value);

/** Already in E.164 form: `+`, country code and digits only, nothing else. */
const isE164 = (value: string) => parse(value)?.number === value;

const isCanadian = (value: string) => {
  const phone = parse(value);
  return phone?.country === "CA" && phone.isValid();
};

export const canadianPhone = (label: string) =>
  requiredText(label)
    .refine(isE164, {
      message: `${label} must start with +1 and contain only digits`,
      abort: true,
    })
    .refine(isCanadian, `${label} must be a valid Canadian number`);
