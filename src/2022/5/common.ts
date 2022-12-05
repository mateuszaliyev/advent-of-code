import { getInput } from "@/utilities/get-input.ts";

const input = await getInput(import.meta.url);

const [stacks, procedures] = input
  .split("\n\n")
  .map((line) => line.split("\n"));

export const getStacks = () =>
  stacks
    .slice(0, stacks.length - 1)
    .map((line) => line.split("").filter((_, column) => column % 4 === 1))
    .reduce<string[][]>(
      (stacks, row) =>
        row.map((_, columnIndex) =>
          [row[columnIndex], ...(stacks[columnIndex] ?? [])].filter(
            (character) => character !== " "
          )
        ),
      []
    );

export const getProcedures = () =>
  procedures.map((procedure) =>
    procedure
      .match(/\d+/g)!
      .map((value, index) => Number(value) - Math.min(index, 1))
  );
