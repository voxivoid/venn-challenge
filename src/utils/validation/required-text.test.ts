import { expect, it } from "vitest";
import { requiredText } from "./required-text";

const schema = requiredText("Field");

it.each(["", "   "])("rejects empty input (%j)", (value) => {
  expect(schema.safeParse(value).error?.issues[0].message).toBe(
    "Field is required",
  );
});

it("trims the value", () => {
  expect(schema.parse("  hi ")).toBe("hi");
});
