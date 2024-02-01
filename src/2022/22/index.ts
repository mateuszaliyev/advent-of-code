import { getInput } from "@/utilities/get-input.ts";

let board: string[] = [];
const description: [number, "L" | "R"][] = [];

let map = true;

(await getInput(import.meta.url, "input.txt")).split("\n").forEach((line) => {
  if (line === "") {
    map = false;
    return;
  }

  if (!map) {
    for (const [_, distance, rotation] of line.matchAll(/(\d+)([LR]?)/g)) {
      description.push([Number(distance), rotation as "L" | "R"]);
    }
    return;
  }

  board.push(line);
});

const width = Math.max(...board.map((line) => line.length));
board = board.map((line) => line.padEnd(width, " "));

let direction: [number, number] = [0, 1];
let position: [number, number] = [0, board[0].indexOf(".")];

for (const [distance, rotation] of description) {
  for (let step = 0; step < distance; step++) {
    let nextPosition: [number, number] = [...position];

    while (true) {
      nextPosition = [
        (((nextPosition[0] + direction[0]) % board.length) + board.length) %
          board.length,
        (((nextPosition[1] + direction[1]) % board[0].length) +
          board[0].length) %
          board[0].length,
      ];

      try {
        if (board[nextPosition[0]][nextPosition[1]] !== " ") break;
      } catch (_) {
        break;
      }
    }

    try {
      if (board[nextPosition[0]][nextPosition[1]] === "#") break;
    } catch (_) {
      break;
    }

    position = [...nextPosition];
  }

  if (!rotation) continue;

  direction =
    rotation === "L"
      ? [-direction[1], direction[0]]
      : [direction[1], -direction[0]];
}

const password = (position: [number, number], direction: [number, number]) => {
  let password = (position[0] + 1) * 1000 + (position[1] + 1) * 4;

  if (direction[0] === 1 && direction[1] === 0) password += 1;
  if (direction[0] === 0 && direction[1] === -1) password += 2;
  if (direction[0] === -1 && direction[1] === 0) password += 3;

  return password;
};

console.log(position, direction, password(position, direction));

// TODO: Part 2...

// import { getInput } from "@/utilities/get-input.ts";

// let board: string[] = [];
// const description: [number, "L" | "R"][] = [];

// let map = true;

// (await getInput(import.meta.url, "example.txt")).split("\n").forEach((line) => {
//   if (line === "") {
//     map = false;
//     return;
//   }

//   if (!map) {
//     for (const [_, distance, rotation] of line.matchAll(/(\d+)([LR]?)/g)) {
//       description.push([Number(distance), rotation as "L" | "R"]);
//     }
//     return;
//   }

//   board.push(line);
// });

// const width = Math.max(...board.map((line) => line.length));
// board = board.map((line) => line.padEnd(width, " "));

// let direction: [number, number] = [0, 1];
// let position: [number, number] = [0, board[0].indexOf(".")];

// for (const [distance, rotation] of description) {
//   for (let step = 0; step < distance; step++) {
//     let nextPosition: [number, number] = [...position];

//     const oldDirection: [number, number] = [...direction];

//     if (
//       nextPosition[0] < 0 &&
//       nextPosition[1] >= 50 &&
//       nextPosition[1] < 100 &&
//       direction[0] === -1
//     ) {
//       direction = [0, 1];
//       nextPosition = [nextPosition[1] + 100, 0];
//     } else if (
//       nextPosition[0] >= 150 &&
//       nextPosition[0] < 200 &&
//       nextPosition[1] < 0 &&
//       direction[1] === -1
//     ) {
//       direction = [1, 0];
//       nextPosition = [0, nextPosition[0] - 100];
//     } else if (
//       nextPosition[0] < 0 &&
//       nextPosition[1] >= 100 &&
//       nextPosition[1] < 150 &&
//       direction[0] === -1
//     ) {
//       nextPosition = [199, nextPosition[1] - 100];
//     } else if (
//       nextPosition[0] > 199 &&
//       nextPosition[1] >= 0 &&
//       nextPosition[1] < 50 &&
//       direction[0] === 1
//     ) {
//       nextPosition = [0, nextPosition[1] + 100];
//     } else if (
//       nextPosition[0] >= 0 &&
//       nextPosition[0] < 50 &&
//       nextPosition[1] > 149 &&
//       direction[1] === 1
//     ) {
//       direction = [0, -1];
//       nextPosition = [149 - nextPosition[0], 99];
//     } else if (
//       nextPosition[0] >= 100 &&
//       nextPosition[0] < 150 &&
//       nextPosition[1] > 99 &&
//       direction[1] === 1
//     ) {
//       direction = [0, -1];
//       nextPosition = [149 - nextPosition[0], 149];
//     } else if (
//       nextPosition[0] > 49 &&
//       nextPosition[1] >= 100 &&
//       nextPosition[1] < 150 &&
//       direction[0] === 1
//     ) {
//       direction = [0, -1];
//       nextPosition = [nextPosition[1] - 50, 99];
//     } else if (
//       nextPosition[0] >= 50 &&
//       nextPosition[0] < 100 &&
//       nextPosition[1] > 99 &&
//       direction[1] === 1
//     ) {
//       direction = [-1, 0];
//       nextPosition = [49, nextPosition[0] + 50];
//     } else if (
//       nextPosition[0] > 149 &&
//       nextPosition[1] >= 50 &&
//       nextPosition[1] < 100 &&
//       direction[0] === 1
//     ) {
//       direction = [0, -1];
//       nextPosition = [nextPosition[1] + 100, 49];
//     } else if (
//       nextPosition[0] >= 150 &&
//       nextPosition[0] < 200 &&
//       nextPosition[1] > 49 &&
//       direction[1] === 1
//     ) {
//       direction = [-1, 0];
//       nextPosition = [149, nextPosition[0] - 100];
//     } else if (
//       nextPosition[0] < 100 &&
//       nextPosition[1] >= 0 &&
//       nextPosition[1] < 50 &&
//       direction[0] === -1
//     ) {
//       direction = [0, 1];
//       nextPosition = [nextPosition[1] + 50, 50];
//     } else if (
//       nextPosition[0] >= 50 &&
//       nextPosition[0] < 100 &&
//       nextPosition[1] < 50 &&
//       direction[1] === -1
//     ) {
//       direction = [1, 0];
//       nextPosition = [100, nextPosition[0] - 50];
//     } else if (
//       nextPosition[0] >= 0 &&
//       nextPosition[0] < 50 &&
//       nextPosition[1] < 50 &&
//       direction[1] === -1
//     ) {
//       direction = [0, 1];
//       nextPosition = [149 - nextPosition[0], 0];
//     } else if (
//       nextPosition[0] >= 100 &&
//       nextPosition[0] < 150 &&
//       nextPosition[1] < 0 &&
//       direction[1] === -1
//     ) {
//       direction = [0, 1];
//       nextPosition = [149 - nextPosition[0], 50];
//     }

//     try {
//       if (board[nextPosition[0]][nextPosition[1]] === "#") {
//         direction = [...oldDirection];
//         break;
//       }
//     } catch (_) {
//       direction = [...oldDirection];
//       break;
//     }

//     position = [...nextPosition];
//   }

//   if (!rotation) continue;

//   direction =
//     rotation === "L"
//       ? [-direction[1], direction[0]]
//       : [direction[1], -direction[0]];
// }

// const password = (position: [number, number], direction: [number, number]) => {
//   let password = (position[0] + 1) * 1000 + (position[1] + 1) * 4;

//   if (direction[0] === 1 && direction[1] === 0) password += 1;
//   if (direction[0] === 0 && direction[1] === -1) password += 2;
//   if (direction[0] === -1 && direction[1] === 0) password += 3;

//   return password;
// };

// console.log(position, direction, password(position, direction));
