import { expect, it } from "vitest";
import { corporationNumber } from "./corporation-number";

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
