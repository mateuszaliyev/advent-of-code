import { getInput } from "@/utilities/get-input.ts";

type Position = { x: number; y: number };

const lines = (await getInput(import.meta.url)).split("\n");

const isAdjacent = (a: Position, b: Position) =>
  Math.abs(a.x - b.x) <= 1 && Math.abs(a.y - b.y) <= 1;

const numbers = lines.flatMap((line, y) =>
  [...line.matchAll(/(\d+)/g)].map((match) => ({
    positions: Array.from({ length: match[0].length }, (_, index) => ({
      x: match.index! + index,
      y,
    })),
    value: Number(match[0]),
  })),
);

const symbols = lines.flatMap((line, y) =>
  [...line.matchAll(/[^.\d]/g)].map((match) => ({
    value: match[0],
    x: match.index!,
    y,
  })),
);

const partNumberSum = numbers.reduce(
  (sum, number) =>
    symbols.some((symbol) =>
      number.positions.some((position) => isAdjacent(position, symbol)),
    )
      ? sum + number.value
      : sum,
  0,
);

const gearRatioSum = symbols
  .filter((symbol) => symbol.value === "*")
  .reduce((sum, symbol) => {
    const adjacentNumbers = numbers.filter((number) =>
      number.positions.some((position) => isAdjacent(position, symbol)),
    );

    if (adjacentNumbers.length !== 2) return sum;
    return sum + adjacentNumbers[0]!.value * adjacentNumbers[1]!.value;
  }, 0);

console.log("Part 1 -", partNumberSum);
console.log("Part 2 -", gearRatioSum);
