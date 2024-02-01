import { getInput } from "@/utilities/get-input.ts";

const elfCalories = (await getInput(import.meta.url))
  .split("\n\n")
  .map((elf) => elf.split("\n").reduce((sum, value) => sum + Number(value), 0))
  .sort((a, z) => z - a);

const topElfCalories = (limit: number) =>
  elfCalories.slice(0, limit).reduce((sum, value) => sum + value, 0);

console.log("Part 1 -", topElfCalories(1));
console.log("Part 2 -", topElfCalories(3));
