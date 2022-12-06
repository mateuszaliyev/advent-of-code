import { getInput } from "@/utilities/get-input.ts";

export const input = await getInput(import.meta.url);

export const findFirstUniqueSequence = (length: number) => {
  for (let index = 0; index < input.length - length; index++) {
    const characters = input.slice(index, index + length);

    if (characters.length === new Set(characters).size) {
      return index + length;
    }
  }
};
