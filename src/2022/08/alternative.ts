/**
 * @see {@link https://paste.lol/thai/2022_day08_dry.rb}
 */
import { getMap } from "./common.ts";

type Tree = readonly [row: number, column: number];

const map = getMap();
const height = map.length;
const width = map[0].length;
const coordinates = map.flatMap((row, rowIndex) =>
  row.map((_, columnIndex) => [rowIndex, columnIndex] as const)
);

const down = ([row, column]: Tree) =>
  Array.from(
    { length: height - row - 1 },
    (_, index) => [row + index + 1, column] as const
  );

const left = ([row, column]: Tree) =>
  Array.from(
    { length: column },
    (_, index) => [row, column - index - 1] as const
  );

const right = ([row, column]: Tree) =>
  Array.from(
    { length: width - column - 1 },
    (_, index) => [row, column + index + 1] as const
  );

const up = ([row, column]: Tree) =>
  Array.from({ length: row }, (_, index) => [row - index - 1, column] as const);

const directions = [down, left, right, up];

const heightOf = ([row, column]: Tree) => map[row][column];

const rays = (tree: Tree) => directions.map((direction) => direction(tree));

const isVisible = (tree: Tree) => (ray: Tree[]) =>
  ray.map(heightOf).every((height) => height < heightOf(tree));

const score = (tree: Tree) => (ray: Tree[]) =>
  ray
    .map(heightOf)
    .findIndex((rayTreeHeight) => rayTreeHeight >= heightOf(tree)) + 1 ||
  ray.length;

const part1 = coordinates.reduce(
  (sum, tree) =>
    rays(tree)
      .map(isVisible(tree))
      .some((value) => value)
      ? sum + 1
      : sum,
  0
);

const part2 = Math.max(
  ...coordinates.map((tree) =>
    rays(tree)
      .map(score(tree))
      .reduce((product, score) => product * score, 1)
  )
);

console.log(part1);
console.log(part2);
