import { z } from "zod";

/** Trimmed text that must not be empty; every field validator builds on this. */
export const requiredText = (label: string) =>
  z
    .string()
    .trim()
    .min(1, { message: `${label} is required`, abort: true });
