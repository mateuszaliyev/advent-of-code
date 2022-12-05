import { getInput } from "@/utilities/get-input.ts";

const input = await getInput(import.meta.url);

export const getSums = () =>
  input
    .split("\n\n")
    .map((block) =>
      block.split("\n").reduce((sum, value) => sum + Number(value), 0)
    );
