import { getInput } from "@/utilities/get-input.ts";

const report = (await getInput(import.meta.url))
  .split("\n")
  .map((line) => line.split(" ").map(Number));

const reversedReport = report.map((history) => history.toReversed());

const extrapolate = (history: number[]): number => {
  if (!history.some(Boolean)) return 0;

  const differences: number[] = [];

  for (let index = 0; index < history.length - 1; index++)
    differences.push(history[index + 1]! - history[index]!);

  return history.at(-1)! + extrapolate(differences);
};

const sumExtrapolations = (report: number[][]) =>
  report.map(extrapolate).reduce((sum, value) => sum + value);

console.log("Part 1 -", sumExtrapolations(report));
console.log("Part 2 -", sumExtrapolations(reversedReport));
