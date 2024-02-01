import { getInput } from "@/utilities/get-input.ts";

const chunks = (await getInput(import.meta.url))
  .split("\n\n")
  .map((line) => line.split("\n"));

const stacks = chunks[0]
  .slice(0, -1)
  .map((line) => line.split("").filter((_, index) => index % 4 === 1))
  .reduce<string[][]>(
    (stacks, row) =>
      row.map((_, columnIndex) =>
        [row[columnIndex], ...(stacks[columnIndex] ?? [])].filter(
          (character) => character !== " "
        )
      ),
    []
  );

const procedures = chunks[1].map((line) =>
  [...line.matchAll(/\d+/g)].flatMap(
    (value, index) => Number(value) - Math.min(index, 1)
  )
) as [number, number, number][];

const getTopCrates = (multiple: boolean) =>
  procedures
    .reduce(
      (stacks, [amount, from, to]) => {
        const crates: string[] = [];

        for (let i = 0; i < amount; i++) {
          crates[multiple ? "unshift" : "push"](stacks[from].pop()!);
        }

        stacks[to].push(...crates);

        return stacks;
      },
      [...stacks].map((stack) => [...stack])
    )
    .map((stack) => stack.at(-1)!)
    .join("");

console.log("Part 1 -", getTopCrates(false));
console.log("Part 2 -", getTopCrates(true));
