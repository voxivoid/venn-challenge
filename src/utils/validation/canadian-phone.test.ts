import { expect, it } from "vitest";
import { canadianPhone } from "./canadian-phone";

const schema = canadianPhone("Phone number");
const messages = (value: string) =>
  schema.safeParse(value).error?.issues.map((issue) => issue.message) ?? [];

it.each(["+13062776103", "+14165550123", "+16045550199"])(
  "accepts Canadian number %s",
  (phone) => {
    expect(messages(phone)).toEqual([]);
  },
);

it.each(["", "  "])("is required (%j)", (phone) => {
  expect(messages(phone)).toEqual(["Phone number is required"]);
});

it.each([
  ["missing +", "13062776103"],
  ["spaces", "+1 306 277 6103"],
  ["dashes", "+1-306-277-6103"],
  ["brackets", "+1(306)2776103"],
  ["+ not at the start", "1+3062776103"],
  ["letters", "+1306277ABCD"],
  ["only a country code", "+1"],
])("rejects special characters or a malformed number (%s)", (_, phone) => {
  expect(messages(phone)).toEqual([
    "Phone number must start with +1 and contain only digits",
  ]);
});

it.each([
  ["too short", "+1306277610"],
  ["too long", "+130627761034"],
  ["other country code", "+443062776103"],
  ["missing country code", "+3062776103"],
  ["US area code", "+12125551234"],
  ["unassigned area code", "+11234567890"],
])("rejects a number that is not Canadian (%s)", (_, phone) => {
  expect(messages(phone)).toEqual([
    "Phone number must be a valid Canadian number",
  ]);
});
