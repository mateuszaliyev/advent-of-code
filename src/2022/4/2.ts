import { getAssignmentPairs } from "./common.ts";

const result = getAssignmentPairs().filter((
  pair,
) =>
  pair[0].some((value) => pair[1].includes(value)) ||
  pair[1].some((value) => pair[0].includes(value))
).length;

console.log(result);
