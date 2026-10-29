import { createMockHandler, type MockReply } from "@/test/msw";
import { PROFILE_DETAILS_PATH } from "./profile-details";

/** The API's answer when it rejects a field, e.g. an unknown corporation number. */
export const rejectedProfileDetailsReply: MockReply<null> = {
  status: 400,
  body: { message: "Invalid corporation number" },
};

/**
 * POST /profile-details. By default every profile is saved. The real API answers
 * a plain-text "OK" that nothing reads, so the mock sends no body.
 */
export const profileDetailsHandler = createMockHandler<null>({
  method: "post",
  path: PROFILE_DETAILS_PATH,
  defaultReply: { body: null },
});
