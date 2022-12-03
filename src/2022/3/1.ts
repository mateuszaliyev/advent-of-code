import { chunk } from "@/utilities/array.ts";

import { getPriority, getRucksacks } from "./common.ts";

const result = getRucksacks().reduce((priorities, rucksack) => {
  const compartments = chunk(rucksack.split(""), rucksack.length / 2);

  const commonItem = compartments[0].find((item) =>
    compartments[1].includes(item)
  )!;

  return priorities + getPriority(commonItem);
}, 0);

console.log(result);
