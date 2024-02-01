import { getInput } from "@/utilities/get-input.ts";

type Direction = typeof directions[number];
type Position = [number, number];
type Rotation = "L" | "R";
type Tile = "#" | "." | null;

const input = (await getInput(import.meta.url, "input.txt")).split("\n");

const width = input
  .slice(0, -2)
  .reduce((width, line) => Math.max(width, line.length), 0);

const board: Tile[][] = [];
const description: (Rotation | number)[] = [];
const directions = ["R", "D", "L", "U"] as const;

let direction: Direction = "R";
let isMap = true;
let position: Position = [-1, -1];

const map = (board: Tile[][]) => {
  let map = "";
  board.forEach((row) => {
    row.forEach((tile) => (map += tile ?? " "));
    map += "\n";
  });
  console.log(map);
};

const next = ([row, column]: Position, direction: Direction): Position => {
  let nextPosition: Position = [row, column];

  if (direction === "D") nextPosition = [row + 1, column];
  if (direction === "L") nextPosition = [row, column - 1];
  if (direction === "R") nextPosition = [row, column + 1];
  if (direction === "U") nextPosition = [row - 1, column];

  if (!tile(nextPosition)) {
    const oppositeDirection: Position = [
      row - nextPosition[0],
      column - nextPosition[1],
    ];

    let oppositePosition: Position = [row, column];

    while (
      tile([
        oppositePosition[0] + oppositeDirection[0],
        oppositePosition[1] + oppositeDirection[1],
      ])
    ) {
      oppositePosition = [
        oppositePosition[0] + oppositeDirection[0],
        oppositePosition[1] + oppositeDirection[1],
      ];
    }

    nextPosition = oppositePosition;
  }

  return tile(nextPosition) === "#" ? [row, column] : nextPosition;
};

const rotate = (direction: Direction, rotation: Rotation) =>
  directions[
    (directions.indexOf(direction) + (rotation === "L" ? -1 : 1)) %
      directions.length
  ];

const tile = ([row, column]: Position): Tile => {
  if (column < 0 || column >= width || row < 0 || row >= board.length)
    return null;

  return board[row][column];
};

for (let row = 0; row < input.length; row++) {
  const line = input[row];

  if (line === "") {
    isMap = false;
    continue;
  }

  if (!isMap) {
    description.push(
      ...(line
        .match(/\d+|[LR]/g)!
        .map((match) =>
          Number.isNaN(Number(match)) ? match : Number(match)
        ) as typeof description)
    );
    continue;
  }

  for (let column = 0; column < width; column++) {
    const character = line[column];

    if (position[0] === -1 && position[1] === -1 && character === ".")
      position = [row, column];
    if (!board[row]) board[row] = [];

    board[row][column] = (character === " " ? null : character) as Tile;
  }
}

const queue = [...description];

while (queue.length) {
  const instruction = queue.shift()!;

  if (typeof instruction === "number") {
    for (let step = 0; step < instruction; step++) {
      position = next(position, direction);
    }

    continue;
  }

  direction = rotate(direction, instruction);
}

console.log(
  direction,
  position.map((p) => p + 1),
  (position[0] + 1) * 1000 +
    (position[1] + 1) * 4 +
    directions.indexOf(direction)
);

console.log("Part 1 -");
console.log("Part 2 -");

// 81390 - too high
