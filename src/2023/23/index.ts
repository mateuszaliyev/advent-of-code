import { getInput } from "@/utilities/get-input.ts";

type Tile = "." | "#" | "^" | "<" | ">" | "v";

const input = await getInput(import.meta.url);

const getMap = (input: string) =>
  input.split("\n").map((row) => row.split("") as Tile[]);

const map = getMap(input);
const noSlopeMap = getMap(input.replace(/[\^<>v]/g, "."));

const directions = {
  ".": eval("[[0,-1],[1,0],[0,1],[-1,0]]") as [number, number][],
  "^": [[0, -1]],
  "<": [[-1, 0]],
  ">": [[1, 0]],
  v: [[0, 1]],
} satisfies Record<Exclude<Tile, "#">, [number, number][]>;

const end = [map.at(-1)!.indexOf("."), map.length - 1];
const start = [map[0]!.indexOf("."), 0];

const createGraph = (map: Tile[][]) => {
  const graph = new Map(
    [start, end].map((point) => [point.join(), new Map<string, number>()]),
  );

  for (const [y, row] of map.entries()) {
    for (const [x, tile] of row.entries()) {
      if (tile === "#") continue;
      let adjacent = 0;
      for (const [dx, dy] of directions["."]) {
        if (x + dx < 0 || x + dx >= map[0]!.length) continue;
        if (y + dy < 0 || y + dy >= map.length) continue;
        if (map[y + dy]![x + dx] !== "#") adjacent++;
      }
      if (adjacent >= 3) graph.set(`${x},${y}`, new Map());
    }
  }

  for (const [point, adjacent] of graph) {
    const visited = new Set([point]);
    const stack = [
      [...point.split(",").map(Number), 0] as [number, number, number],
    ];

    while (stack.length) {
      const [x, y, distance] = stack.pop()!;

      if (distance !== 0 && graph.has(`${x},${y}`)) {
        adjacent.set(`${x},${y}`, distance);
        continue;
      }

      for (const [dx, dy] of directions[map[y]![x] as Exclude<Tile, "#">]) {
        if (x + dx < 0 || x + dx >= map[0]!.length) continue;
        if (y + dy < 0 || y + dy >= map.length) continue;
        if (map[y + dy]![x + dx] === "#" || visited.has(`${x + dx},${y + dy}`))
          continue;
        stack.push([x + dx, y + dy, distance + 1]);
        visited.add(`${x + dx},${y + dy}`);
      }
    }
  }

  return graph;
};

const findLongestPath = (
  point: string,
  graph: ReturnType<typeof createGraph>,
  visited = new Set<string>(),
) => {
  if (end.join() === point) return 0;
  let max = -Infinity;

  visited.add(point);

  for (const [adjacent, distance] of graph.get(point)!)
    if (!visited.has(adjacent))
      max = Math.max(max, findLongestPath(adjacent, graph, visited) + distance);

  visited.delete(point);

  return max;
};

console.log("Part 1 -", findLongestPath(start.join(), createGraph(map)));
console.log("Part 2 -", findLongestPath(start.join(), createGraph(noSlopeMap)));
