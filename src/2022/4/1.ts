import { getAssignmentPairs } from "./common.ts";

const result = getAssignmentPairs().filter(
  (pair) =>
    pair[0].every((value) => pair[1].includes(value)) ||
    pair[1].every((value) => pair[0].includes(value))
).length;

console.log(result);
