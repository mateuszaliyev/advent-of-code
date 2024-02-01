import { getInput } from "@/utilities/get-input.ts";

const space = (await getInput(import.meta.url))
  .split("\n")
  .map((row) => row.split(""));

const range = (length: number) => Array.from({ length }, (_, index) => index);

const emptyColumns = new Set(range(space[0]!.length));
const emptyRows = new Set(range(space.length));
const galaxies: [number, number][] = [];

for (let y = 0; y < space.length; y++) {
  for (let x = 0; x < space[0]!.length; x++) {
    if (space[y]![x] === ".") continue;
    emptyColumns.delete(x);
    emptyRows.delete(y);
    galaxies.push([x, y]);
  }
}

const sumGalaxyPairDistances = (multiplier: number) =>
  galaxies.reduce((sum, [ax, ay], index) => {
    galaxies.slice(index + 1).forEach(([bx, by]) => {
      for (let column = Math.min(ax, bx); column < Math.max(ax, bx); column++)
        sum += emptyColumns.has(column) ? multiplier : 1;
      for (let row = Math.min(ay, by); row < Math.max(ay, by); row++)
        sum += emptyRows.has(row) ? multiplier : 1;
    });
    return sum;
  }, 0);

console.log("Part 1 -", sumGalaxyPairDistances(2));
console.log("Part 2 -", sumGalaxyPairDistances(1e6));
