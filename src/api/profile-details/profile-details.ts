import { mutationOptions, useMutation } from "@tanstack/react-query";
import { apiUrl } from "../api-url";
import { toApiError } from "../api-error";
import type { ProfileDetails } from "./types";

export const PROFILE_DETAILS_PATH = "/profile-details";

/** Saves the profile. Throws an `ApiError` with the server's message when it is rejected. */
export async function createProfileDetails(
  details: ProfileDetails,
): Promise<void> {
  const response = await fetch(apiUrl(PROFILE_DETAILS_PATH), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(details),
  });
  // The success body is a plain-text "OK", so there is nothing to read.
  if (!response.ok) throw await toApiError(response);
}

/** The 400 messages that name one field, mapped to that field. */
const FIELD_BY_ERROR_MESSAGE = new Map<string, keyof ProfileDetails>([
  ["Invalid first name", "firstName"],
  ["Invalid last name", "lastName"],
  ["Invalid phone number", "phone"],
  ["Invalid corporation number", "corporationNumber"],
]);

/** The field a rejected submit's message is about; `undefined` for form-wide ones like "Missing required fields". */
export const profileDetailsErrorField = (message: string) =>
  FIELD_BY_ERROR_MESSAGE.get(message);

export const createProfileDetailsMutation = () =>
  mutationOptions({ mutationFn: createProfileDetails });

export function useCreateProfileDetailsMutation() {
  return useMutation(createProfileDetailsMutation());
}
