import { expect, it } from "vitest";
import { ApiError, toApiError } from "./api-error";

it("keeps the status and the message the API sends", async () => {
  const response = Response.json(
    { message: "Invalid first name" },
    { status: 400 },
  );

  const error = await toApiError(response);

  expect(error).toBeInstanceOf(ApiError);
  expect(error).toMatchObject({
    name: "ApiError",
    status: 400,
    message: "Invalid first name",
  });
});

it.each([
  ["a body without a message", Response.json({}, { status: 500 })],
  ["a body that is not JSON", new Response("Bad gateway", { status: 502 })],
])("falls back to the status for %s", async (_, response) => {
  const error = await toApiError(response);

  expect(error.message).toBe(`Request failed (${response.status})`);
});
