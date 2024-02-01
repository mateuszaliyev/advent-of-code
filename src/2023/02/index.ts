import { getInput } from "@/utilities/get-input.ts";

type Color = "blue" | "green" | "red";

const games = (await getInput(import.meta.url)).split("\n").map((line) => {
  const id = Number(line.split(":")[0]?.split("Game ")[1]);

  const subsets = line
    .split(": ")[1]!
    .split("; ")!
    .map((subset) => {
      const colors: Record<Color, number> = { blue: 0, green: 0, red: 0 };

      for (const cube of subset.split(", ")) {
        const [number, color] = cube.split(" ") as [string, Color];
        colors[color] = Math.max(colors[color], Number(number));
      }

      return colors;
    });

  return {
    id,
    subsets,
  };
});

const impossibleGamesIdSum = games.reduce((sum, game) => {
  if (
    !game.subsets.some(
      (subset) => subset.blue > 14 || subset.green > 13 || subset.red > 12,
    )
  ) {
    return sum + game.id;
  }

  return sum;
}, 0);

const setPowerSum = games.reduce((sum, game) => {
  const fewest: Record<Color, number> = { blue: 0, green: 0, red: 0 };

  for (const subset of game.subsets) {
    fewest.blue = Math.max(fewest.blue, subset.blue);
    fewest.green = Math.max(fewest.green, subset.green);
    fewest.red = Math.max(fewest.red, subset.red);
  }

  return sum + fewest.blue * fewest.green * fewest.red;
}, 0);

console.log("Part 1 -", impossibleGamesIdSum);
console.log("Part 2 -", setPowerSum);
