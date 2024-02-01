import { getInput } from "@/utilities/get-input.ts";

const input = (await getInput(import.meta.url)).split("\n");

const tiles = new Map(
  input.flatMap((row, y) =>
    row.split("").map((tile, x) => [`${x},${y}`, tile]),
  ),
);

const fromKey = (key: string) => key.split(",").map(Number) as [number, number];

const E = [1, 0] as [number, number],
  N = [0, -1] as [number, number],
  S = [0, 1] as [number, number],
  W = [-1, 0] as [number, number];

const tileDirections = new Map([
  ["-", [W, E]],
  [".", []],
  ["|", [N, S]],
  ["7", [S, W]],
  ["F", [S, E]],
  ["J", [N, W]],
  ["L", [N, E]],
  ["S", [N, W, E, S]],
]);

const [sx, sy] = fromKey([...tiles].find(([_, tile]) => tile === "S")![0]);

const startDirections = tileDirections
  .get("S")!
  .reduce<[number, number][]>((directions, [dx, dy]) => {
    if (sx + dx < 0 || sx + dx >= input[0]!.length) return directions;
    if (sy + dy < 0 || sy + dy >= input.length) return directions;

    tileDirections
      .get(tiles.get(`${sx + dx},${sy + dy}`)!)!
      .filter(([nx, ny]) => dx === -nx && dy === -ny)
      .forEach(([nx, ny]) => directions.push([-nx, -ny]));

    return directions;
  }, []);

const startTile = [...tileDirections].find(
  ([_, directions]) =>
    directions.length &&
    directions.every(([dx, dy]) =>
      startDirections.some(([sx, sy]) => dx === sx && dy === sy),
    ),
)![0];

tiles.set(`${sx},${sy}`, startTile);

const connections = new Map<string, string[]>();

for (const [key, tile] of tiles) {
  if (tile === ".") continue;
  const [x, y] = fromKey(key);
  connections.set(key, []);

  for (const [dx, dy] of tileDirections.get(tile)!)
    connections.get(key)!.push(`${x + dx},${y + dy}`);
}

const path = new Set([`${sx},${sy}`]);
let next = connections.get(`${sx},${sy}`)![0];

while (next) {
  path.add(next);
  next = connections.get(next)!.filter((key) => !path.has(key))[0];
}

const area = [...path].map(fromKey).reduce((sum, [xi, yi], i, path) => {
  const [x, y] = path[(i + 1) % path.length]!;
  return sum + 0.5 * (xi * y - yi * x);
}, 0);

console.log("Part 1 -", path.size / 2);
console.log("Part 2 -", area - 0.5 * path.size + 1);
