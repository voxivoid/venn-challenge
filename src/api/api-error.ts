import { z } from "zod";

/** A failed API response. `message` is the server's own when its body has one. */
export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const errorBody = z.object({ message: z.string() });

/** Turns a non-2xx response into an `ApiError`, keeping the `{ message }` the API sends. */
export async function toApiError(response: Response): Promise<ApiError> {
  const body = errorBody.safeParse(await response.json().catch(() => null));
  return new ApiError(
    response.status,
    body.success ? body.data.message : `Request failed (${response.status})`,
  );
}
