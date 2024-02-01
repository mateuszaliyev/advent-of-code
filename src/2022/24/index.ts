import { getInput } from "@/utilities/get-input.ts";

type Direction = typeof directions[number];
type Point = { x: number; y: number };

const directions = ["<", ">", "^", "v"] as const;
const map = (await getInput(import.meta.url)).split("\n");

const adjacent = new Map<Direction, Point>([
  ["<", { x: -1, y: 0 }],
  [">", { x: 1, y: 0 }],
  ["^", { x: 0, y: -1 }],
  ["v", { x: 0, y: 1 }],
]);

const adjacentAndCurrent = new Map<Direction | "x", Point>([
  ...adjacent,
  ["x", { x: 0, y: 0 }],
]);

const blizzards = Object.fromEntries(
  directions.map((direction) => [direction, new Set<string>()])
) as Record<Direction, Set<string>>;

const height = map.length - 2;
const width = map[0].length - 2;
const goal = { x: width - 1, y: height };
const start = { x: -1, y: 0 };

const gcd = (a: number, b: number): number => (!b ? a : gcd(b, a % b));
const key = (x: number, y: number) => `${x},${y}`;
const lcm = (a: number, b: number) => (a * b) / gcd(a, b);

const is = (a: Point, b: Point) => a.x === b.x && a.y === b.y;
const inBounds = ({ x, y }: Point) =>
  x >= 0 && y >= 0 && x < width && y < height;
const isDirection = (tile: string): tile is Direction =>
  directions.includes(tile as Direction);

map.slice(1, -1).forEach((line, y) =>
  line
    .slice(1, -1)
    .split("")
    .forEach((tile, x) => isDirection(tile) && blizzards[tile].add(key(x, y)))
);

const cycle = lcm(height, width);

const shortestTime = (destinations: Point[]) => {
  const explored = new Set<string>();
  const queue = [{ destinationIndex: 0, time: 0, ...start }];

  while (queue.length) {
    let { destinationIndex, time, ...current } = queue.shift()!;

    time++;

    for (const [_, move] of adjacentAndCurrent) {
      const next = {
        destinationIndex,
        time,
        x: current.x + move.x,
        y: current.y + move.y,
      };

      let isDestination = is(next, destinations[destinationIndex]);

      if (isDestination) {
        if (destinationIndex === destinations.length - 1) return time;
        next.destinationIndex++;
      }

      const isStart = is(next, start);
      isDestination = destinations.some((destination) => is(next, destination));

      if (!inBounds(next) && !isDestination && !isStart) continue;

      let blizzardApproaching = false;

      if (!isDestination && !isStart) {
        for (const [direction, { x, y }] of adjacent) {
          if (
            blizzards[direction].has(
              key(
                (((next.x - x * time) % width) + width) % width,
                (((next.y - y * time) % height) + height) % height
              )
            )
          ) {
            blizzardApproaching = true;
            break;
          }
        }
      }

      if (!blizzardApproaching) {
        const exploredKey = `${time % cycle},${next.destinationIndex}${key(
          next.x,
          next.y
        )}`;
        if (explored.has(exploredKey)) continue;
        explored.add(exploredKey);
        queue.push(next);
      }
    }
  }
};

console.log("Part 1 -", shortestTime([goal]));
console.log("Part 2 -", shortestTime([goal, start, goal]));
