import { screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, onTestFinished, vi } from "vitest";
import {
  corporationNumberHandler,
  invalidCorporationNumberReply,
} from "@/api/corporation-number/corporation-number.handlers";
import {
  profileDetailsHandler,
  rejectedProfileDetailsReply,
} from "@/api/profile-details/profile-details.handlers";
import type { OnboardingFormValues } from "@/components/onboarding-form/onboarding-form.schema";
import { buildOnboardingFormValues } from "@/test/factories";
import { renderRoute } from "@/test/render";
import { server } from "@/test/server";

const field = (name: string) => screen.getByRole("textbox", { name });

it("renders the onboarding form at / inside the step shell", () => {
  renderRoute("/");

  expect(screen.getByText("Step 1 of 5")).toBeInTheDocument();
  expect(
    screen.getByRole("heading", { name: "Onboarding Form" }),
  ).toBeInTheDocument();
});

it("shows no errors before the user interacts", () => {
  renderRoute("/");

  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
});

it("validates a field when it loses focus", async () => {
  const { user } = renderRoute("/");

  await user.click(field("First Name"));
  await user.tab();

  expect(field("First Name")).toBeInvalid();
  expect(field("First Name")).toHaveAccessibleDescription(
    "First name is required",
  );
  // Untouched fields stay quiet.
  expect(field("Last Name")).toBeValid();
});

it("does not validate while typing, only on blur", async () => {
  const { user } = renderRoute("/");

  await user.type(field("Phone Number"), "123");
  expect(field("Phone Number")).toBeValid();

  await user.tab();
  expect(field("Phone Number")).toHaveAccessibleDescription(
    "Phone number must start with +1 and contain only digits",
  );
});

it("clears an error once the field is fixed and blurred again", async () => {
  server.use(corporationNumberHandler());
  const { user } = renderRoute("/");

  await user.type(field("Corporation Number"), "1234");
  await user.tab();
  expect(field("Corporation Number")).toHaveAccessibleDescription(
    "Corporation number must be 9 digits",
  );

  await user.type(field("Corporation Number"), "56789");
  await user.tab();
  await waitFor(() => expect(field("Corporation Number")).toBeValid());
});

it("rejects a valid but non-Canadian phone number", async () => {
  const { user } = renderRoute("/");

  await user.type(field("Phone Number"), "+12125551234");
  await user.tab();

  expect(field("Phone Number")).toHaveAccessibleDescription(
    "Phone number must be a valid Canadian number",
  );
});

it("shows every missing field under its input on submit and focuses the first", async () => {
  const { user } = renderRoute("/");

  await user.click(screen.getByRole("button", { name: "Submit" }));

  expect(field("First Name")).toHaveAccessibleDescription(
    "First name is required",
  );
  expect(field("Last Name")).toHaveAccessibleDescription(
    "Last name is required",
  );
  expect(field("Phone Number")).toHaveAccessibleDescription(
    "Phone number is required",
  );
  expect(field("Corporation Number")).toHaveAccessibleDescription(
    "Corporation number is required",
  );
  expect(field("First Name")).toHaveFocus();
});

it("re-validates on blur after a failed submit, not while typing", async () => {
  const { user } = renderRoute("/");

  await user.click(screen.getByRole("button", { name: "Submit" }));
  expect(field("First Name")).toBeInvalid();

  await user.type(field("First Name"), "Hello");
  expect(field("First Name")).toBeInvalid();

  await user.tab();
  expect(field("First Name")).toBeValid();
});

describe("character limits", () => {
  it("keeps every typed character and shows an error once a name is over 50", async () => {
    const { user } = renderRoute("/");

    await user.type(field("First Name"), "a".repeat(51));
    expect(field("First Name")).toHaveValue("a".repeat(51));
    await user.tab();

    expect(field("First Name")).toHaveAccessibleDescription(
      "First name must be 50 characters or fewer",
    );
  });

  it("accepts a name of exactly 50 characters", async () => {
    const { user } = renderRoute("/");

    await user.type(field("Last Name"), "a".repeat(50));
    await user.tab();

    expect(field("Last Name")).toBeValid();
  });

  it("clears the error once the name is shortened", async () => {
    const { user } = renderRoute("/");

    await user.type(field("Last Name"), "a".repeat(51));
    await user.tab();
    expect(field("Last Name")).toBeInvalid();

    await user.type(field("Last Name"), "{Backspace}");
    await user.tab();
    expect(field("Last Name")).toBeValid();
  });

  it.each(["12345678", "1234567890"])(
    "shows an error for a corporation number of the wrong length (%s)",
    async (number) => {
      const { user } = renderRoute("/");

      await user.type(field("Corporation Number"), number);
      expect(field("Corporation Number")).toHaveValue(number);
      await user.tab();

      expect(field("Corporation Number")).toHaveAccessibleDescription(
        "Corporation number must be 9 digits",
      );
    },
  );
});

describe("corporation number check", () => {
  const corporationNumber = () => field("Corporation Number");

  /** Paths of every request the page sends from now on. */
  function recordRequests() {
    const paths: string[] = [];
    const record = ({ request }: { request: Request }) => {
      paths.push(new URL(request.url).pathname);
    };
    server.events.on("request:start", record);
    onTestFinished(() => server.events.removeListener("request:start", record));
    return paths;
  }

  async function blurWith(value: string) {
    const { user } = renderRoute("/");
    await user.type(corporationNumber(), value);
    await user.tab();
    return user;
  }

  it("accepts a number the API knows", async () => {
    server.use(corporationNumberHandler());
    const requested = recordRequests();

    await blurWith("826417395");

    await waitFor(() =>
      expect(requested).toEqual(["/corporation-number/826417395"]),
    );
    expect(corporationNumber()).toBeValid();
  });

  it("shows a spinner in the field while checking, then a check mark", async () => {
    server.use(corporationNumberHandler({ delay: 50 }));

    await blurWith("826417395");

    expect(
      await screen.findByRole("img", { name: "Checking" }),
    ).toBeInTheDocument();
    expect(corporationNumber()).toHaveAttribute("aria-busy", "true");
    expect(
      await screen.findByRole("img", { name: "Valid" }),
    ).toBeInTheDocument();
    expect(corporationNumber()).not.toHaveAttribute("aria-busy");
  });

  it("shows a cross in the field for an unknown number", async () => {
    server.use(
      corporationNumberHandler({ reply: invalidCorporationNumberReply }),
    );

    await blurWith("111111111");

    expect(
      await screen.findByRole("img", { name: "Invalid" }),
    ).toBeInTheDocument();
  });

  it("shows no status icon before the field is checked", () => {
    renderRoute("/");

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("shows the API message for an unknown number", async () => {
    server.use(
      corporationNumberHandler({ reply: invalidCorporationNumberReply }),
    );

    await blurWith("111111111");

    await waitFor(() =>
      expect(corporationNumber()).toHaveAccessibleDescription(
        "Invalid corporation number",
      ),
    );
  });

  it.each([
    [
      "a server error",
      { reply: { status: 500, body: { message: "Internal error" } } },
    ],
    ["a network failure", { networkError: true }],
  ] as const)("asks the user to retry after %s", async (_, options) => {
    server.use(corporationNumberHandler(options));

    await blurWith("826417395");

    await waitFor(() =>
      expect(corporationNumber()).toHaveAccessibleDescription(
        "Corporation number could not be verified, please try again",
      ),
    );
  });

  it("retries a failed check on the next blur", async () => {
    server.use(
      corporationNumberHandler({
        reply: { status: 500, body: { message: "Internal error" } },
      }),
    );
    const user = await blurWith("826417395");
    await waitFor(() => expect(corporationNumber()).toBeInvalid());

    server.use(corporationNumberHandler());
    await user.click(corporationNumber());
    await user.tab();

    await waitFor(() => expect(corporationNumber()).toBeValid());
  });

  it("asks the API once per number, however often the form validates", async () => {
    server.use(corporationNumberHandler());
    const requested = recordRequests();
    const user = await blurWith("826417395");
    await waitFor(() => expect(requested).toHaveLength(1));

    // Blurring again, or blurring another field, re-runs the whole schema.
    await user.click(corporationNumber());
    await user.tab();
    await user.click(field("First Name"));
    await user.tab();

    expect(requested).toEqual(["/corporation-number/826417395"]);
  });

  it("checks a changed number again instead of reusing the old answer", async () => {
    server.use(
      corporationNumberHandler({
        reply: ({ params }) =>
          params.number === "111111111"
            ? invalidCorporationNumberReply
            : { body: { corporationNumber: "826417395", valid: true } },
      }),
    );
    const user = await blurWith("826417395");
    await waitFor(() => expect(corporationNumber()).toBeValid());

    await user.clear(corporationNumber());
    await user.type(corporationNumber(), "111111111");
    await user.tab();

    await waitFor(() =>
      expect(corporationNumber()).toHaveAccessibleDescription(
        "Invalid corporation number",
      ),
    );
  });
});

describe("submit", () => {
  const submitButton = () => screen.getByRole("button", { name: "Submit" });
  const SAVED = "Your profile details have been saved.";
  const GENERIC_ERROR = "Something went wrong, please try again";

  async function fill(values = buildOnboardingFormValues()) {
    const { user } = renderRoute("/");
    await user.type(field("First Name"), values.firstName);
    await user.type(field("Last Name"), values.lastName);
    await user.type(field("Phone Number"), values.phone);
    await user.type(field("Corporation Number"), values.corporationNumber);
    return user;
  }

  async function fillAndSubmit(values?: OnboardingFormValues) {
    const user = await fill(values);
    await user.click(submitButton());
    return user;
  }

  beforeEach(() => {
    server.use(corporationNumberHandler());
  });

  it("sends the trimmed values as JSON and confirms the save", async () => {
    let sent: { contentType: string | null; body: unknown } | undefined;
    server.use(
      profileDetailsHandler({
        reply: async ({ request }) => {
          sent = {
            contentType: request.headers.get("Content-Type"),
            body: await request.json(),
          };
          return { body: null };
        },
      }),
    );

    await fillAndSubmit(buildOnboardingFormValues({ firstName: " Hello " }));

    expect(await screen.findByRole("status")).toHaveTextContent(SAVED);
    expect(sent).toEqual({
      contentType: "application/json",
      body: buildOnboardingFormValues(),
    });
  });

  it("does not send anything while a field is invalid", async () => {
    const requested = vi.fn(() => ({ body: null }));
    server.use(profileDetailsHandler({ reply: requested }));

    await fillAndSubmit(buildOnboardingFormValues({ phone: "123" }));

    expect(field("Phone Number")).toBeInvalid();
    expect(requested).not.toHaveBeenCalled();
  });

  it("shows the button as busy while the request is in flight", async () => {
    server.use(profileDetailsHandler({ delay: 50 }));

    await fillAndSubmit();

    await waitFor(() =>
      expect(submitButton()).toHaveAttribute("aria-busy", "true"),
    );
    expect(submitButton()).toBeDisabled();
    expect(await screen.findByText(SAVED)).toBeInTheDocument();
  });

  it("replaces the submit button with the saved message", async () => {
    server.use(profileDetailsHandler());

    await fillAndSubmit();

    expect(await screen.findByText(SAVED)).toHaveFocus();
    expect(
      screen.queryByRole("button", { name: "Submit" }),
    ).not.toBeInTheDocument();
  });

  it("shows the API message when it rejects the profile", async () => {
    server.use(profileDetailsHandler({ reply: rejectedProfileDetailsReply }));

    await fillAndSubmit();

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Invalid corporation number",
    );
    expect(screen.queryByText(SAVED)).not.toBeInTheDocument();
  });

  it.each([
    [
      "a server error",
      { reply: { status: 500, body: { message: "Internal error" } } },
    ],
    ["a network failure", { networkError: true }],
  ] as const)("asks the user to retry after %s", async (_, options) => {
    server.use(profileDetailsHandler(options));

    await fillAndSubmit();

    expect(await screen.findByRole("alert")).toHaveTextContent(GENERIC_ERROR);
  });

  it("clears the error and saves when a retry succeeds", async () => {
    server.use(profileDetailsHandler({ reply: rejectedProfileDetailsReply }));
    const user = await fillAndSubmit();
    await screen.findByRole("alert");

    server.use(profileDetailsHandler());
    await user.click(submitButton());

    expect(await screen.findByText(SAVED)).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("submits with Enter from a field", async () => {
    server.use(profileDetailsHandler());
    const user = await fill();

    await user.keyboard("{Enter}");

    expect(await screen.findByText(SAVED)).toBeInTheDocument();
  });
});
