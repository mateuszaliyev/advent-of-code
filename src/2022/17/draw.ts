import type { Point } from "./index.ts";

export const draw = (
  tower: Set<string>,
  towerHeight: number,
  rock?: Point[],
  width = 7
) => {
  const pad = 4;
  let result = "";

  for (let y = towerHeight + 7; y >= 0; y--) {
    result += `${y.toString().padStart(4, " ")} |`;

    for (let x = 0; x < width; x++) {
      if (tower.has([x, y].join(","))) {
        result += "#";
        continue;
      }

      if (rock && rock.some((point) => point[0] === x && point[1] === y)) {
        result += "@";
        continue;
      }

      result += ".";
    }

    result += "|\n";
  }

  result += `${"".padStart(pad + 1, " ")}+-------+\n${"".padStart(
    pad + 2,
    " "
  )}0123456`;

  console.log(result);
};
