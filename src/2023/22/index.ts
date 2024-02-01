import { getInput } from "@/utilities/get-input.ts";

type Brick = [number, number, number, number, number, number];

const bricks = (await getInput(import.meta.url))
  .split("\n")
  .map((row) => row.split(/[~,]/g).map(Number) as Brick)
  .sort((a, b) => a[2] - b[2]);

const drop = (bricks: Brick[], disintegrateId?: number) => {
  const peaks = new Map<string, number>();
  let fallen = 0;

  for (const [id, [ax, ay, az, bx, by, bz]] of bricks.entries()) {
    if (disintegrateId === id) continue;
    const cubes: [number, number][] = [];

    for (let x = ax; x <= bx; x++)
      for (let y = ay; y <= by; y++) cubes.push([x, y]);

    const peak =
      Math.max(...cubes.map(([a, b]) => peaks.get(`${a},${b}`) ?? 0)) + 1;

    for (const [a, b] of cubes) peaks.set(`${a},${b}`, peak + bz - az);

    bricks[id] = [ax, ay, peak, bx, by, peak + bz - az];
    fallen += Number(peak < az);
  }

  return fallen;
};

drop(bricks);

const fallen = bricks.map((_, id) => drop(structuredClone(bricks), id));
const sum = (sum: number, value: number) => sum + value;

console.log("Part 1 -", fallen.filter((value) => !value).length);
console.log("Part 2 -", fallen.reduce(sum));
