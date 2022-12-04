import { chunk, sum } from "@/utilities/array.ts";

import { getPriority, getRucksacks } from "./common.ts";

const result = sum(
  chunk(getRucksacks(), 3).map((rucksacks) =>
    getPriority(
      rucksacks[0]
        .split("")
        .find((item) => rucksacks.every((rucksack) => rucksack.includes(item)))!
    )
  )
);

console.log(result);
