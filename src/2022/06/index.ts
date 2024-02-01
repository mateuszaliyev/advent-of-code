import { getInput } from "@/utilities/get-input.ts";

const data = await getInput(import.meta.url);

const findFirstUniqueSequence = (length: number) => {
  for (let index = length; index <= data.length; index++) {
    if (new Set(data.slice(index - length, index)).size === length) {
      return index;
    }
  }
};

console.log("Part 1 -", findFirstUniqueSequence(4));
console.log("Part 2 -", findFirstUniqueSequence(14));
