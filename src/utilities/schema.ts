import { z } from "https://deno.land/x/zod/mod.ts";

export const daySchema = z
  .number({
    invalid_type_error: "day is not a number.",
    required_error: "day is required.",
  })
  .max(25, "This puzzle does not exist.")
  .min(1, "This puzzle does not exist.");

export const leaderboardSchema = z.coerce
  .number({
    invalid_type_error: "leaderboard is not a number.",
    required_error: "leaderboard is required.",
  })
  .min(1);

export const sessionSchema = z.string().regex(/^[0-9a-f]{128}$/);

export const yearSchema = z
  .number({
    invalid_type_error: "year is not a number.",
    required_error: "year is required.",
  })
  .max(2023, "This puzzle does not exist.")
  .min(2015, "This puzzle does not exist.");
