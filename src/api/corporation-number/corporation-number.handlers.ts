import { createMockHandler, type MockReply } from "@/test/msw";
import { CORPORATION_NUMBER_PATH } from "./corporation-number";
import type { CorporationNumberResponse } from "./types";

/** The API's answer for a corporation number that does not exist. */
export const invalidCorporationNumberReply: MockReply<CorporationNumberResponse> =
  {
    status: 404,
    body: { valid: false, message: "Invalid corporation number" },
  };

/** GET /corporation-number/:number. By default every number exists. */
export const corporationNumberHandler =
  createMockHandler<CorporationNumberResponse>({
    method: "get",
    path: CORPORATION_NUMBER_PATH,
    defaultReply: ({ params }) => ({
      body: { corporationNumber: String(params.number), valid: true },
    }),
  });
