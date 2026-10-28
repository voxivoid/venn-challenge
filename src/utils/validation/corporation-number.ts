import { requiredText } from "./required-text";

const CORPORATION_NUMBER_LENGTH = 9;

const CORPORATION_NUMBER_FORMAT = new RegExp(
  `^\\d{${CORPORATION_NUMBER_LENGTH}}$`,
);

export const corporationNumber = (label: string) =>
  requiredText(label).regex(CORPORATION_NUMBER_FORMAT, {
    message: `${label} must be ${CORPORATION_NUMBER_LENGTH} digits`,
    abort: true,
  });
