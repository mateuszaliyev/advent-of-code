import { getInput } from "@/utilities/get-input.ts";

type Node = Point & {
  distance: number;
};

type Point = {
  column: number;
  row: number;
};

const heightmap = (await getInput(import.meta.url, "example.txt"))
  .split("\n")
  .map((line) => line.split(""));

let end: Point = { column: -1, row: -1 };
let start: Point = { column: -1, row: -1 };

heightmap.forEach((rowArray, row) => {
  rowArray.forEach((square, column) => {
    if (square === "S") {
      start = { column, row };
      heightmap[row][column] = "a";
    }
    if (square === "E") {
      end = { column, row };
      heightmap[row][column] = "z";
    }
  });
});

const queue: Node[] = [{ ...start, distance: 0 }];
const visited = new Map<string, Node>();

while (queue.length) {
  const node = queue.shift()!;

  visited.set([node.row, node.column].join(","), node);
}

console.log(heightmap);
