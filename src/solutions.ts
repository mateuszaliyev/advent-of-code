import { parse } from "https://deno.land/std@0.167.0/flags/mod.ts";

import { log } from "@/utilities/log.ts";

const getPuzzles = async () => {
  const puzzles = new Map<number, number[]>();

  for await (const yearEntry of Deno.readDir(
    new URL("../src", import.meta.url)
  )) {
    if (
      yearEntry.isDirectory &&
      isValidAdventOfCodeEvent(Number(yearEntry.name))
    ) {
      const days: number[] = [];

      const year = Number(yearEntry.name);

      for await (const dayEntry of Deno.readDir(
        new URL(`../src/${year}`, import.meta.url)
      )) {
        if (
          dayEntry.isDirectory &&
          /[0-1][1-9]|10|2[0-5]/.test(dayEntry.name)
        ) {
          days.push(Number(dayEntry.name));
        }
      }

      puzzles.set(Number(year), days);
    }
  }

  return puzzles;
};

const isValidAdventOfCodeEvent = (year: number) =>
  !Number.isNaN(year) && year >= 2015 && year <= 2023;

const isValidPuzzle = (
  puzzles: Map<number, number[]>,
  date: Record<string, unknown>
): date is { day: number; year: number } => {
  const day = Number(date.day);
  const year = Number(date.year);

  if (Number.isNaN(Number(`${date.day}`))) {
    throw new Error(`incorrect day \`${date.day}\`.`);
  }

  if (Number.isNaN(Number(`${date.year}`))) {
    throw new Error(`incorrect year \`${date.year}\`.`);
  }

  return (
    puzzles.has(year) &&
    (puzzles.get(year)?.some((puzzle) => day === puzzle) ?? false)
  );
};

try {
  const parsedArguments = parse(Deno.args);

  if (!parsedArguments.day) {
    throw new Error(`\`--day\` argument is required.`);
  }

  if (!parsedArguments.year) {
    throw new Error(`\`--year\` argument is required.`);
  }

  if (!isValidPuzzle(await getPuzzles(), parsedArguments)) {
    throw new Error(
      `solution for day ${parsedArguments.day} of year ${parsedArguments.year} does not exist in the codebase.`
    );
  }

  const { day, year } = parsedArguments;

  await import(`./${year}/${day.toString().padStart(2, "0")}/index.ts`);
} catch (error) {
  log.error(error.message);
}
