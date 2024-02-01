import { getInput } from "@/utilities/get-input.ts";
import { Part, Result } from "@/utilities/result.ts";

type Vector3 = [number, number, number];

const key = ([x, y, z]: Vector3) => `${x},${y},${z}`;

const cubes = new Map(
  (await getInput(import.meta.url, "input.txt"))
    .split("\n")
    .map((line) => line.split(",").map(Number) as Vector3)
    .map((cube) => [key(cube), cube])
);

const dimensions: Vector3 = [0, 0, 0];

cubes.forEach(([x, y, z]) => {
  dimensions[0] = Math.max(dimensions[0], x);
  dimensions[1] = Math.max(dimensions[1], y);
  dimensions[2] = Math.max(dimensions[2], z);
});

const adjacent = ([x, y, z]: Vector3): Vector3[] => [
  [x - 1, y, z],
  [x + 1, y, z],
  [x, y - 1, z],
  [x, y + 1, z],
  [x, y, z - 1],
  [x, y, z + 1],
];

const surfaceArea = (surface: "exterior" | "total") => {
  if (surface === "total") {
    return [...cubes].reduce(
      (area, [_, cube]) =>
        area + adjacent(cube).filter((cube) => !cubes.has(key(cube))).length,
      0
    );
  }

  const visited = new Set<string>();
  const stack: Vector3[] = [[-1, -1, -1]];

  while (stack.length) {
    const position = stack.pop()!;
    const next = new Set<string>([
      ...adjacent(position)
        .map(key)
        .filter(
          (adjacentPosition) =>
            !cubes.has(adjacentPosition) && !visited.has(adjacentPosition)
        ),
    ]);
    const x = [...next]
      .map((value) => value.split(",").map(Number) as Vector3)
      .filter(
        ([x, y, z]) =>
          x >= -1 &&
          y >= -1 &&
          z >= -1 &&
          x <= dimensions[0] + 1 &&
          y <= dimensions[1] + 1 &&
          z <= dimensions[2] + 1
      );
    stack.push(...x);
    visited.add(key(position));
  }

  let area = 0;

  for (const [_, cube] of cubes) {
    for (const adjacentCube of adjacent(cube)) {
      if (visited.has(key(adjacentCube))) {
        area++;
      }
    }
  }

  return area;
};

new Result(
  new Part(() => surfaceArea("total")),
  new Part(() => surfaceArea("exterior"))
);
