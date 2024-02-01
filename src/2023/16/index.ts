import { getInput } from "@/utilities/get-input.ts";

const contraption = (await getInput(import.meta.url)).split("\n");
const size = { x: contraption[0]!.length, y: contraption.length };

const energized = (x: number, y: number, dx: number, dy: number) => {
  const beams: Parameters<typeof energized>[] = [[x + dx, y + dy, dx, dy]];
  const visited = new Set<string>();

  const add = (...[x, y, dx, dy]: Parameters<typeof energized>) => {
    if (visited.has(`${x},${y};${dx},${dy}`)) return;
    beams.push([x + dx, y + dy, dx, dy]);
    visited.add(`${x},${y};${dx},${dy}`);
  };

  while (beams.length) {
    const [x, y, dx, dy] = beams.shift()!;

    if (!(x >= 0 && x < size.x && y >= 0 && y < size.y)) continue;

    const tile = contraption[y]![x]!;

    if (tile === "/") add(x, y, -dy, -dx);
    else if (tile === "\\") add(x, y, dy, dx);
    else if (tile === "|" && dx) [-1, 1].forEach((dy) => add(x, y, 0, dy));
    else if (tile === "-" && dy) [-1, 1].forEach((dx) => add(x, y, dx, 0));
    else add(x, y, dx, dy);
  }

  return new Set([...visited].map((key) => key.split(";")[0])).size;
};

const maximumEnergization = (
  [
    ...Array.from({ length: size.x }, (_, x) => [x, -1, 0, 1]),
    ...Array.from({ length: size.x }, (_, x) => [x, size.y, 0, -1]),
    ...Array.from({ length: size.y }, (_, y) => [-1, y, 1, 0]),
    ...Array.from({ length: size.y }, (_, y) => [size.x, y, -1, 0]),
  ] as [number, number, number, number][]
).reduce((maximum, beam) => Math.max(maximum, energized(...beam)), 0);

console.log("Part 1 -", energized(-1, 0, 1, 0));
console.log("Part 2 -", maximumEnergization);
