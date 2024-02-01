import { getInput } from "@/utilities/get-input.ts";

type BreadthFirstSearchParameters = {
  comparison: (square: Square, neighbor: Square) => boolean;
  goal: (square: Square) => boolean;
  heightmap: Square[];
  root: Square;
};

type Square = {
  character: string;
  elevation: number;
  explored: boolean;
  parent?: Square;
  x: number;
  y: number;
};

const heightmap = (await getInput(import.meta.url, "input.txt"))
  .split("\n")
  .flatMap((line, y) =>
    line.split("").map((character, x) => ({
      character,
      elevation: "abcdefghijklmnopqrstuvwxyz".indexOf(
        character.replace("E", "z").replace("S", "a")
      ),
      explored: false,
      x,
      y,
    }))
  );

const adjacent = (heightmap: Square[], to: Square) =>
  heightmap.filter(
    (square) =>
      (square.x === to.x - 1 && square.y === to.y) ||
      (square.x === to.x + 1 && square.y === to.y) ||
      (square.x === to.x && square.y === to.y - 1) ||
      (square.x === to.x && square.y === to.y + 1)
  );

const pathLength = (square: Square) => {
  let currentSquare = square;
  let length = 0;

  while (currentSquare.parent) {
    currentSquare = currentSquare.parent;
    length++;
  }

  return length;
};

const breadthFirstSearch = (parameters: BreadthFirstSearchParameters) => {
  const queue: Square[] = [{ ...parameters.root, explored: true }];

  while (queue.length) {
    const square = queue.shift()!;

    if (parameters.goal(square)) return square;

    for (const neighbor of adjacent(parameters.heightmap, square)) {
      if (!neighbor.explored && parameters.comparison(square, neighbor)) {
        neighbor.explored = true;
        neighbor.parent = square;
        queue.push(neighbor);
      }
    }
  }
};

const fromSToE: BreadthFirstSearchParameters = {
  comparison: (square, neighbor) => neighbor.elevation <= square.elevation + 1,
  goal: (square) => square.character === "E",
  heightmap: [...heightmap].map((square) => ({ ...square })),
  root: heightmap.find((square) => square.character === "S")!,
};

const fromEToA: BreadthFirstSearchParameters = {
  comparison: (square, neighbor) => neighbor.elevation >= square.elevation - 1,
  goal: (square) => square.character === "a",
  heightmap: [...heightmap].map((square) => ({ ...square })),
  root: heightmap.find((square) => square.character === "E")!,
};

console.log("Part 1 -", pathLength(breadthFirstSearch(fromSToE)!));
console.log("Part 2 -", pathLength(breadthFirstSearch(fromEToA)!));
