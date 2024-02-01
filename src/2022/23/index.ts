import { getInput } from "@/utilities/get-input.ts";

type Direction = typeof initialDirections[number];

const fromKey = (key: string) => key.split(",").map(Number) as [number, number];
const key = (x: number, y: number) => `${x},${y}`;

const elves = (await getInput(import.meta.url))
  .split("\n")
  .reduce((elves, line, y) => {
    line.split("").forEach((tile, x) => tile === "#" && elves.add(key(x, y)));
    return elves;
  }, new Set<string>());

const initialDirections = ["N", "S", "W", "E"] as const;

const step = (x: number, y: number, direction: Direction, offset = 0) =>
  ((
    {
      E: [x + 1, y + offset],
      N: [x + offset, y - 1],
      S: [x + offset, y + 1],
      W: [x - 1, y + offset],
    } as Record<Direction, [number, number]>
  )[direction]);

const adjacent = (x: number, y: number, direction: Direction) =>
  [-1, 0, 1].map((offset) => step(x, y, direction, offset));

const emptyGround = (elves: Set<string>) => {
  let maximal = { x: -Infinity, y: -Infinity };
  let minimal = { x: Infinity, y: Infinity };

  for (const elf of elves) {
    const [x, y] = fromKey(elf);
    maximal = { x: Math.max(maximal.x, x), y: Math.max(maximal.y, y) };
    minimal = { x: Math.min(minimal.x, x), y: Math.min(minimal.y, y) };
  }

  return (maximal.y - minimal.y + 1) * (maximal.x - minimal.x + 1) - elves.size;
};

const simulate = (initialElves: Set<string>, rounds = Infinity) => {
  const directions: Direction[] = [...initialDirections];
  const elves = new Set(initialElves);

  for (let round = 1; round <= rounds; round++) {
    const proposals = new Map<string, [number, number][]>();

    for (const elf of elves) {
      const [x, y] = fromKey(elf);

      let elfNearby = false;
      let proposedPosition: [number, number] | null = null;

      directions: for (const direction of directions) {
        for (const position of adjacent(x, y, direction)) {
          if (elves.has(key(...position))) {
            elfNearby = true;
            continue directions;
          }
        }

        proposedPosition ??= step(x, y, direction);
      }

      if (elfNearby && proposedPosition) {
        const proposedPositionKey = key(...proposedPosition);
        const elves = proposals.get(proposedPositionKey) ?? [];
        elves.push([x, y]);
        proposals.set(proposedPositionKey, elves);
      }
    }

    if (!proposals.size) return { elves, rounds: round };

    for (const [position, proposingElves] of proposals) {
      if (proposals.get(position)!.length > 1) continue;

      for (const elf of proposingElves) {
        elves.delete(key(...elf));
        elves.add(position);
      }
    }

    directions.push(directions.shift()!);
  }

  return { elves, rounds };
};

console.log("Part 1 -", emptyGround(simulate(elves, 10).elves));
console.log("Part 2 -", simulate(elves).rounds);
