import { describe, expect, it, vi } from "vitest";
import {
  corporationNumber,
  type CorporationNumberCheck,
} from "./corporation-number";

const schema = corporationNumber("Corporation number");
const messages = (value: string) =>
  schema.safeParse(value).error?.issues.map((issue) => issue.message) ?? [];

it("accepts 9 digits", () => {
  expect(messages("826417395")).toEqual([]);
});

it.each(["", "   "])("is required (%j)", (value) => {
  expect(messages(value)).toEqual(["Corporation number is required"]);
});

it.each(["12345678", "1234567890", "12345678a", "1234 5678"])(
  "rejects %j",
  (value) => {
    expect(messages(value)).toEqual(["Corporation number must be 9 digits"]);
  },
);

describe("with a remote check", () => {
  const issues = async (value: string, check: CorporationNumberCheck) =>
    (
      await corporationNumber("Corporation number", check).safeParseAsync(value)
    ).error?.issues.map((issue) => issue.message) ?? [];

  it("accepts a number the check confirms", async () => {
    const check = vi.fn<CorporationNumberCheck>(async () => ({ valid: true }));

    expect(await issues(" 826417395 ", check)).toEqual([]);
    expect(check).toHaveBeenCalledExactlyOnceWith("826417395");
  });

  it("reports the check's message for an unknown number", async () => {
    const check: CorporationNumberCheck = async () => ({
      valid: false,
      message: "Invalid corporation number",
    });

    expect(await issues("826417395", check)).toEqual([
      "Invalid corporation number",
    ]);
  });

  it("asks to retry when the check fails", async () => {
    const check: CorporationNumberCheck = async () => {
      throw new Error("offline");
    };

    expect(await issues("826417395", check)).toEqual([
      "Corporation number could not be verified, please try again",
    ]);
  });

  it.each(["", "1234"])(
    "skips the check for a malformed number (%j)",
    async (value) => {
      const check = vi.fn<CorporationNumberCheck>();

      await issues(value, check);

      expect(check).not.toHaveBeenCalled();
    },
  );
});
