import {
  HttpResponse,
  delay as wait,
  http,
  type HttpHandler,
  type JsonBodyType,
  type PathParams,
} from "msw";
import { apiUrl } from "@/api/api-url";

/** The error body our API sends on failures (e.g. 400, 500). */
export type ApiErrorBody = { message: string };

/** What a mocked endpoint answers: a typed body and an optional status (200 by default). */
export type MockReply<Body> = { status?: number; body: Body | ApiErrorBody };

type ReplyFor<Body> =
  | MockReply<Body>
  | ((request: { params: PathParams; request: Request }) => MockReply<Body>);

export type MockHandlerOptions<Body> = {
  /** Overrides the default reply for this test. */
  reply?: ReplyFor<Body>;
  /** Fails at the network level instead of replying. */
  networkError?: boolean;
  /** Holds the reply back (ms), to observe loading states. */
  delay?: number;
};

/**
 * A typed MSW handler factory for one endpoint: a default reply, overridable
 * per test, e.g. `handler({ reply: { status: 500, body: { message: "…" } } })`.
 */
export function createMockHandler<Body extends JsonBodyType>({
  method,
  path,
  defaultReply,
}: {
  method: "get" | "post" | "put" | "patch" | "delete";
  /** The API path, with `:param` placeholders (shared with the request function). */
  path: string;
  defaultReply: ReplyFor<Body>;
}) {
  return ({
    reply = defaultReply,
    networkError = false,
    delay,
  }: MockHandlerOptions<Body> = {}): HttpHandler =>
    http[method](apiUrl(path), async (info) => {
      if (delay) await wait(delay);
      if (networkError) return HttpResponse.error();

      const { status = 200, body } =
        typeof reply === "function" ? reply(info) : reply;
      return HttpResponse.json(body, { status });
    });
}
