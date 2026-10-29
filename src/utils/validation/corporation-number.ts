import type { CorporationNumberCheck } from "@/api/corporation-number";
import { requiredText } from "./required-text";

const CORPORATION_NUMBER_LENGTH = 9;

const CORPORATION_NUMBER_FORMAT = new RegExp(
  `^\\d{${CORPORATION_NUMBER_LENGTH}}$`,
);

/**
 * A 9-digit corporation number. With `check`, a well-formed number is also
 * verified remotely; the check is skipped while the format is wrong.
 */
export const corporationNumber = (
  label: string,
  check?: CorporationNumberCheck,
) => {
  const format = requiredText(label).regex(CORPORATION_NUMBER_FORMAT, {
    message: `${label} must be ${CORPORATION_NUMBER_LENGTH} digits`,
    abort: true,
  });
  if (!check) return format;

  return format.superRefine(async (value, ctx) => {
    try {
      const result = await check(value);
      if (!result.valid)
        ctx.addIssue({ code: "custom", message: result.message });
    } catch {
      ctx.addIssue({
        code: "custom",
        message: `${label} could not be verified, please try again`,
      });
    }
  });
};
