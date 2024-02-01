import { getInput } from "@/utilities/get-input.ts";

const pairs = (await getInput(import.meta.url))
  .split("\n")
  .map((pair) =>
    pair.split(",").map((sections) => sections.split("-").map(Number))
  );

const countPairs = (predicate: Parameters<typeof pairs["filter"]>[0]) =>
  pairs.filter(predicate).length;

console.log(
  "Part 1 -",
  countPairs(([[a, b], [c, d]]) => (a <= c && b >= d) || (c <= a && d >= b))
);

console.log(
  "Part 2 -",
  countPairs(([[a, b], [c, d]]) => a <= d && b >= c)
);
