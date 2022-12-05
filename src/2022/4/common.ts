import { getInput } from "@/utilities/get-input.ts";

const input = await getInput(import.meta.url);

export const getAssignmentPairs = () =>
  input.split("\n").map((pair) =>
    pair
      .split(",")
      .map((sections) => sections.split("-").map(Number))
      .map(([start, end]) =>
        Array.from({ length: end + 1 - start }, (_, index) => index + start)
      )
  );
