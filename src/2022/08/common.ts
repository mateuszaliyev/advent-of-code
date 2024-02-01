import { getInput } from "@/utilities/get-input.ts";

const input = await getInput(import.meta.url);

export const getMap = () =>
  input.split("\n").map((line) => line.split("").map(Number));

export const getTransposedMap = (map: number[][]) =>
  map.reduce<number[][]>(
    (map, row) =>
      row.map((_, columnIndex) => [
        ...(map[columnIndex] ?? []),
        row[columnIndex],
      ]),
    []
  );
