import { getInput } from "@/utilities/get-input.ts";

const map = (await getInput(import.meta.url)).split("\n");
const plots = new Map<string, ["." | "S", number, number]>();

const mod = (a: number, b: number) => ((a % b) + b) % b;
const interpolateQuadratic = (a: number, b: number, c: number) => (x: number) =>
  (0.5 * a - b + 0.5 * c) * x ** 2 + (-1.5 * a + 2 * b - 0.5 * c) * x + a;

const directions = eval("[[0,-1],[1,0],[0,1],[-1,0]]") as [number, number][];

for (const [y, row] of map.entries())
  for (const [x, tile] of row.split("").entries())
    if (tile === "." || tile === "S") plots.set(`${x},${y}`, [tile, x, y]);

const reachableGardenPlots = (steps: number) => {
  const [start, [_, x, y]] = [...plots].find(([_, [plot]]) => plot === "S")!;
  const queue = new Map([[start, [x, y] as [number, number]]]);
  const values: number[] = [];

  for (let step = 0; step < steps; step++) {
    if (step % map.length === Math.floor(map.length / 2)) {
      values.push(queue.size);
      if (values.length === 3) break;
    }

    const queueCopy = [...queue];
    queue.clear();

    for (const [_, [x, y]] of queueCopy)
      for (const [dx, dy] of directions)
        if (plots.has(`${mod(x + dx, map.length)},${mod(y + dy, map.length)}`))
          queue.set(`${x + dx},${y + dy}`, [x + dx, y + dy]);
  }

  const f = interpolateQuadratic(...(values as [number, number, number]));
  return values.length === 3 ? f(Math.floor(steps / map.length)) : queue.size;
};

console.log("Part 1 -", reachableGardenPlots(64));
console.log("Part 2 -", reachableGardenPlots(26501365));
