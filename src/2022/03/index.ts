import { chunk } from "@/utilities/array.ts";
import { getInput } from "@/utilities/get-input.ts";

const rucksacks = (await getInput(import.meta.url))
  .split("\n")
  .map((items) => items.split(""));

const getPriorities = (groups: string[][][]) =>
  groups.reduce(
    (sum, [items, ...restOfGroup]) =>
      sum +
      "_abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(
        items.find((item) =>
          restOfGroup.every((group) => group.includes(item))
        )!
      ),
    0
  );

console.log(
  "Part 1 -",
  getPriorities(
    rucksacks.map((rucksack) => chunk(rucksack, rucksack.length / 2))
  )
);

console.log("Part 2 -", getPriorities(chunk(rucksacks, 3)));
