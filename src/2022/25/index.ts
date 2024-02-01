import { getInput } from "@/utilities/get-input.ts";

const numbers = (await getInput(import.meta.url, "input.txt")).split("\n");

const decimal = (snafu: string): number =>
  snafu
    ? decimal(snafu.slice(0, -1)) * 5 + "=-012".indexOf(snafu.at(-1)!) - 2
    : 0;

const snafu = (decimal: number): string =>
  decimal
    ? snafu(Math.floor((decimal + 2) / 5)) + "=-012"[(decimal + 2) % 5]
    : "";

console.log(
  "Part 1 -",
  snafu(numbers.map(decimal).reduce((sum, number) => sum + number, 0))
);
