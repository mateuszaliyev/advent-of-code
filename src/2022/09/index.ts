import { getInput } from "@/utilities/get-input.ts";

const motions = (await getInput(import.meta.url)).split("\n").map((motion) => {
  const [direction, amount] = motion.split(" ");
  return [direction, Number(amount)] as ["D" | "L" | "R" | "U", number];
});

const getUniqueTailPositions = (length: number) => {
  const tailPositions = new Set<string>();
  const rope = Array.from({ length }, () => [0, 0] as [x: number, y: number]);

  for (const [direction, amount] of motions) {
    for (let _ = 0; _ < amount; _++) {
      rope[0] = [
        direction === "L"
          ? rope[0][0] - 1
          : direction === "R"
          ? rope[0][0] + 1
          : rope[0][0],
        direction === "D"
          ? rope[0][1] - 1
          : direction === "U"
          ? rope[0][1] + 1
          : rope[0][1],
      ];

      for (let knot = 1; knot < rope.length; knot++) {
        const horizontalDifference = rope[knot - 1][0] - rope[knot][0];
        const verticalDifference = rope[knot - 1][1] - rope[knot][1];

        if (
          Math.abs(horizontalDifference) > 1 ||
          Math.abs(verticalDifference) > 1
        ) {
          rope[knot][0] += Math.max(Math.min(horizontalDifference, 1), -1);
          rope[knot][1] += Math.max(Math.min(verticalDifference, 1), -1);
        }

        if (knot === rope.length - 1) {
          tailPositions.add(rope[knot].join(","));
        }
      }
    }
  }

  return tailPositions.size;
};

console.log("Part 1 -", getUniqueTailPositions(2));
console.log("Part 2 -", getUniqueTailPositions(10));
