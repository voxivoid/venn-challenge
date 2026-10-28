import { expect, it } from "vitest";
import { personName } from "./person-name";

const messages = (schema: ReturnType<typeof personName>, value: string) =>
  schema.safeParse(value).error?.issues.map((issue) => issue.message) ?? [];

it("is required", () => {
  expect(messages(personName("First name"), "  ")).toEqual([
    "First name is required",
  ]);
});

it("accepts up to 50 characters by default", () => {
  expect(messages(personName("First name"), "a".repeat(50))).toEqual([]);
});

it("rejects 51 characters by default", () => {
  expect(messages(personName("First name"), "a".repeat(51))).toEqual([
    "First name must be 50 characters or fewer",
  ]);
});

it("accepts a custom max length", () => {
  expect(messages(personName("Nickname", 5), "abcdef")).toEqual([
    "Nickname must be 5 characters or fewer",
  ]);
});

it("counts length after trimming", () => {
  expect(messages(personName("First name"), ` ${"a".repeat(50)} `)).toEqual([]);
});
