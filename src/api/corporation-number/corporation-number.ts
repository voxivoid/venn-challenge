import { queryOptions, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import type { CorporationNumberCheck } from "@/utils/validation";
import { apiUrl } from "../api-url";

/** Shared by the request and its MSW handler, so they cannot drift apart. */
export const CORPORATION_NUMBER_PATH = "/corporation-number/:number";

const corporationNumberResponse = z.discriminatedUnion("valid", [
  z.object({ valid: z.literal(true), corporationNumber: z.string() }),
  z.object({ valid: z.literal(false), message: z.string() }),
]);

export type CorporationNumberResponse = z.infer<
  typeof corporationNumberResponse
>;

/** GET /corporation-number/:number. 404 means "does not exist", not a failure. */
export async function getCorporationNumber(
  number: string,
  signal?: AbortSignal,
): Promise<CorporationNumberResponse> {
  const response = await fetch(apiUrl(CORPORATION_NUMBER_PATH, { number }), {
    signal,
  });
  if (!response.ok && response.status !== 404) {
    throw new Error(`Corporation number check failed (${response.status})`);
  }
  return corporationNumberResponse.parse(await response.json());
}

export const corporationNumberQuery = (number: string) =>
  queryOptions({
    queryKey: ["corporation-number", number],
    queryFn: ({ signal }) => getCorporationNumber(number, signal),
  });

/**
 * Checks a corporation number through the query cache: repeated blurs and the
 * submit reuse the answer, and concurrent checks share one request.
 */
export function useCheckCorporationNumber(): CorporationNumberCheck {
  const queryClient = useQueryClient();
  return (number) => queryClient.query(corporationNumberQuery(number));
}
