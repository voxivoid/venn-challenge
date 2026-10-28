import { requiredText } from "./required-text";

const NAME_MAX_LENGTH = 50;

export const personName = (label: string, maxLength = NAME_MAX_LENGTH) =>
  requiredText(label).max(
    maxLength,
    `${label} must be ${maxLength} characters or fewer`,
  );
