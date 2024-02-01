import { getInput } from "@/utilities/get-input.ts";

export type Point = [number, number];

const jets = (await getInput(import.meta.url))
  .split("")
  .map((jet) => (jet === "<" ? -1 : 1));

const rocks: Point[][] = JSON.parse(
  "[[[0,0],[1,0],[2,0],[3,0]],[[1,0],[0,1],[1,1],[2,1],[1,2]],[[0,0],[1,0],[2,0],[2,1],[2,2]],[[0,0],[0,1],[0,2],[0,3]],[[0,0],[0,1],[1,0],[1,1]]]"
);

const toKey = (x: number, y: number) => [x, y].join(",");

const rocksTowerHeight = (total: number) => {
  const cache: Record<string, Point> = { [toKey(-1, 0)]: [-1, 0] };
  const tower = new Set<string>();

  const available = (x: number, y: number) =>
    x >= 0 && x < 7 && y > 0 && !tower.has(toKey(x, y));

  const possible = (rock: Point[], x: number, y: number) =>
    rock.every(([rx, ry]) => available(x + rx, y + ry));

  let height = 0;
  let jetIndex = 0;
  let rockType = 0;

  for (let rockIndex = 0; rockIndex < total; rockIndex++) {
    const key = toKey(rockType, jetIndex);
    const cached = cache[key];
    let x = 2;
    let y = height + 4;

    if (cached) {
      const [cachedRockIndex, cachedHeight] = cached;
      const remainingRocks = total - rockIndex;
      const period = rockIndex - cachedRockIndex;
      const remainingCycles = Math.floor(remainingRocks / period);
      const remainingHeights = remainingRocks % period;
      if (!remainingHeights)
        return height + (height - cachedHeight) * remainingCycles;
    } else cache[key] = [rockIndex, height];

    const rock = rocks[rockType];
    rockType = (rockType + 1) % rocks.length;

    while (true) {
      const jet = jets[jetIndex];
      jetIndex = (jetIndex + 1) % jets.length;
      if (possible(rock, x + jet, y)) x += jet;
      if (possible(rock, x, y - 1)) y += -1;
      else break;
    }

    rock.forEach((r) => {
      tower.add(toKey(x + r[0], y + r[1]));
      height = Math.max(height, y + r[1]);
    });
  }

  return height;
};

console.log("Part 1 -", rocksTowerHeight(2022));
console.log("Part 2 -", rocksTowerHeight(1e12));
