import { getInput } from "@/utilities/get-input.ts";

const plan = (await getInput(import.meta.url))
  .split("\n")
  .map((row) => row.split(" ") as [string, string, string]);

const directions = { R: [1, 0], D: [0, 1], L: [-1, 0], U: [0, -1] } as const;

const parse = ([direction, length]: (typeof plan)[number]) =>
  [directions[direction as keyof typeof directions], Number(length)] as const;

const parseColor = ([_, __, color]: (typeof plan)[number]) =>
  [
    Object.values(directions)[Number(color.at(-2))]!,
    parseInt(color.slice(2, -2)!, 16),
  ] as const;

const volume = (plan: ReturnType<typeof parse>[]) =>
  plan.reduce(
    ({ area, x }, [[dx, dy], length]) => ({
      area: area + dy * length * x + 0.5 * length,
      x: x + dx * length,
    }),
    { area: 1, x: 0 },
  ).area;

console.log("Part 1 -", volume(plan.map(parse)));
console.log("Part 2 -", volume(plan.map(parseColor)));
