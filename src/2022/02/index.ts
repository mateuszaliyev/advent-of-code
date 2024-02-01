import { getInput } from "@/utilities/get-input.ts";

const rounds = (await getInput(import.meta.url)).split("\n");

const getScore = (rounds: string[], strategy: string) =>
  rounds.reduce(
    (sum, round) => sum + Math.floor(strategy.indexOf(round[0] + round[2]) / 2),
    0
  );

console.log("Part 1 -", getScore(rounds, "  BXCYAZAXBYCZCXAYBZ"));
console.log("Part 2 -", getScore(rounds, "  BXCXAXAYBYCYCZAZBZ"));
