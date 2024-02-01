import { zip } from "std/collections/mod.ts";

import { getInput } from "@/utilities/get-input.ts";

const platform = (await getInput(import.meta.url)).split("\n");

const cycles = (platform: string[], amount: number) => {
  const cycles = new Map<string, number>([[platform.join("\n"), 0]]);
  let rows = [...platform];
  let cycleLength = 0;
  let cycleOffset = 0;

  for (let cycle = 1; cycle <= amount; cycle++) {
    for (let i = 0; i < 4; i++) rows = rotate(tilt(rows));

    const key = rows.join("\n");

    if (cycles.has(key)) {
      cycleOffset = cycles.get(key)!;
      cycleLength = cycle - cycleOffset;
      break;
    }

    cycles.set(key, cycle);
  }

  if (!cycleLength) return rows;

  return [...cycles][
    cycleOffset + ((amount - cycleOffset) % cycleLength)
  ]![0].split("\n");
};

const load = (platform: string[]) =>
  platform.reduce(
    (sum, row, index) =>
      sum + (platform.length - index) * (row.match(/O/g)?.length ?? 0),
    0,
  );

const rotate = (platform: string[], clockwise = true) =>
  zip(
    ...platform.map((row) =>
      clockwise ? row.split("") : row.split("").reverse(),
    ),
  ).map((row) => (clockwise ? row.reverse() : row).join(""));

const tilt = (platform: string[]) =>
  rotate(
    rotate(platform, false).map((row) =>
      row
        .split("#")
        .map((group) =>
          group
            .split("")
            .sort((a, z) => (a < z ? 1 : -1))
            .join(""),
        )
        .join("#"),
    ),
  );

console.log("Part 1 -", load(tilt(platform)));
console.log("Part 2 -", load(cycles(platform, 1e9)));
