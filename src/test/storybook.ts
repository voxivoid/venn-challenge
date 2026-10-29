import type { Meta } from "@storybook/react-vite";

type ArgType = NonNullable<Meta["argTypes"]>[string];

/**
 * A select control for `Input`'s `status`. Storybook selects cannot hold
 * `undefined`, so "none" maps to it.
 */
export const inputStatusArgType = {
  control: "select",
  options: ["none", "loading", "valid", "invalid"],
  mapping: { none: undefined },
} satisfies ArgType;
