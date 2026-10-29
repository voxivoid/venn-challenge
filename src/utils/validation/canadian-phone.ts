import { requiredText } from "./required-text";

/** A Canadian number in E.164 form. Async: parse with `safeParseAsync`. */
export const canadianPhone = (label: string) =>
  requiredText(label).superRefine(async (value, ctx) => {
    // libphonenumber-js is a third of the bundle and only needed once a phone
    // is checked, so it loads on first use into its own chunk.
    const { parsePhoneNumberFromString } = await import("libphonenumber-js");
    const phone = parsePhoneNumberFromString(value);

    // E.164: `+`, country code and digits only, nothing else.
    if (phone?.number !== value) {
      ctx.addIssue({
        code: "custom",
        message: `${label} must start with +1 and contain only digits`,
      });
    } else if (phone.country !== "CA" || !phone.isValid()) {
      ctx.addIssue({
        code: "custom",
        message: `${label} must be a valid Canadian number`,
      });
    }
  });
