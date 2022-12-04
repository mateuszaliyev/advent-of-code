import { EOL } from "@/utilities/eol.ts";
import { getInput } from "@/utilities/get-input.ts";

const priorities = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split(
  ""
);

export const getPriority = (item: string) =>
  priorities.findIndex((priority) => priority === item) + 1;

const input = await getInput(import.meta.url);

export const getRucksacks = () => input.split(EOL);
