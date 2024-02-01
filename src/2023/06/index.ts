import { getInput } from "@/utilities/get-input.ts";

const [times, distances] = (await getInput(import.meta.url))
  .split("\n")
  .map((line) => [...line.match(/\d+/g)!])
  .map((numbers) => [Number(numbers.join("")), ...numbers.map(Number)]) as [
  number[],
  number[],
];

const [longerRaceWays, ...ways] = times.map((time, race) => {
  const discriminant = time ** 2 - 4 * -1 * -distances[race]!;
  return (
    Math.ceil((-time - Math.sqrt(discriminant)) / -2) -
    Math.ceil((-time + Math.sqrt(discriminant)) / -2)
  );
});

const product = ways.reduce((product, way) => product * way, 1);

console.log("Part 1 -", product);
console.log("Part 2 -", longerRaceWays);
