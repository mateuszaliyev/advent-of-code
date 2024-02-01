import { BinaryHeap } from "std/data_structures/mod.ts";

import { getInput } from "@/utilities/get-input.ts";

type Path = [heat: number, x: number, y: number, dx: number, dy: number];

const map = new Map(
  (await getInput(import.meta.url))
    .split("\n")
    .flatMap((row, y) => row.split("").map((heat, x) => [`${x},${y}`, +heat])),
);

const directions = eval("[[0,-1],[1,0],[0,1],[-1,0]]") as [number, number][];
const end = [...map].at(-1)![0].split(",").map(Number) as [number, number];

const minimalHeatLoss = (min: number, max: number) => {
  const queue = new BinaryHeap<Path>(([a], [b]) => (a < b ? -1 : 1));
  const visited = new Set<string>();
  queue.push([0, 0, 0, 0, 0]);

  while (!queue.isEmpty()) {
    const [heat, x, y, dx, dy] = queue.pop()!;
    if (x === end[0] && y === end[1]) return heat;
    const key = `${x},${y},${dx},${dy}`;
    if (visited.has(key)) continue;
    visited.add(key);

    for (const [ndx, ndy] of directions) {
      if ((dx === ndx && dy === ndy) || (dx === -ndx && dy === -ndy)) continue;
      let newHeat = heat;
      for (let i = 1; i < max + 1; i++) {
        if (map.has(`${x + i * ndx},${y + i * ndy}`)) {
          newHeat += map.get(`${x + i * ndx},${y + i * ndy}`)!;
          if (i >= min)
            queue.push([newHeat, x + i * ndx, y + i * ndy, ndx, ndy]);
        }
      }
    }
  }
};

console.log("Part 1 -", minimalHeatLoss(1, 3));
console.log("Part 2 -", minimalHeatLoss(4, 10));
