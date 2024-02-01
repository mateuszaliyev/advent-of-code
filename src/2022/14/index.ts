import { getInput } from "@/utilities/get-input.ts";

type Point = [number, number];

let bottom = 0;

const sediments = new Map<string, Point>();
const source: Point = [500, 0];

(await getInput(import.meta.url)).split("\n").forEach((line) =>
  line
    .split(" -> ")
    .map((point) => point.split(",").map(Number) as Point)
    .forEach(([x1, y1], index, path) => {
      if (!index) return;

      const [x2, y2] = path[index - 1];

      for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
        for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
          bottom = Math.max(bottom, y + 1);
          sediments.set([x, y].join(","), [x, y]);
        }
      }
    })
);

const simulate = (sediments: Map<string, Point>, floor: boolean) => {
  let units = 0;

  simulation: while (!sediments.has(source.join(","))) {
    let [x, y]: Point = [source[0], source[1]];

    while (true) {
      if (!floor && y === bottom) break simulation;
      if (floor && y === bottom) break;

      if (!sediments.has([x, y + 1].join(","))) {
        y += 1;
        continue;
      }

      if (!sediments.has([x - 1, y + 1].join(","))) {
        x -= 1;
        y += 1;
        continue;
      }

      if (!sediments.has([x + 1, y + 1].join(","))) {
        x += 1;
        y += 1;
        continue;
      }

      break;
    }

    sediments.set([x, y].join(","), [x, y]);
    units += 1;
  }

  return units;
};

console.log("Part 1 -", simulate(new Map(sediments), false));
console.log("Part 2 -", simulate(new Map(sediments), true));
