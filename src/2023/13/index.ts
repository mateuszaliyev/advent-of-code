import { zip } from "std/collections/mod.ts";

import { getInput } from "@/utilities/get-input.ts";

const patterns = (await getInput(import.meta.url))
  .split("\n\n")
  .map((pattern) => pattern.split("\n").map((row) => row.split("")));

const findReflection = (pattern: string[][], smudges: number) => {
  for (let row = 1; row < pattern.length; row++) {
    let differences = 0;

    for (const rows of zip(pattern.slice(0, row).reverse(), pattern.slice(row)))
      for (const [a, b] of zip(...rows)) if (a !== b) differences++;

    if (differences === smudges) return row;
  }

  return 0;
};

const summarize = (smudges: number) =>
  patterns.reduce(
    (sum, pattern) =>
      sum +
      findReflection(pattern, smudges) * 100 +
      findReflection(zip(...pattern), smudges),
    0,
  );

console.log("Part 1 -", summarize(0));
console.log("Part 2 -", summarize(1));
