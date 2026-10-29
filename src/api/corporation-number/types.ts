import type { z } from "zod";
import type { corporationNumberResponse } from "./corporation-number";

/** GET /corporation-number/:number body, as parsed at runtime. */
export type CorporationNumberResponse = z.infer<
  typeof corporationNumberResponse
>;

/** What a check needs from the API answer; `CorporationNumberResponse` satisfies it. */
export type CorporationNumberCheckResult =
  { valid: true } | { valid: false; message: string };

/** Asks the API whether a well-formed corporation number exists. */
export type CorporationNumberCheck = (
  value: string,
) => Promise<CorporationNumberCheckResult>;
