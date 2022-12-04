import { EOL } from "@/utilities/eol.ts";
import { getInput } from "@/utilities/get-input.ts";

const input = await getInput(import.meta.url);

export const getAssignmentPairs = () =>
  input.split(EOL).map((pair) =>
    pair.split(",").reduce<[number[], number[]]>(
      (ranges, sections, index) => {
        const [start, end] = sections.split("-").map(Number);

        for (let section = start; section <= end; section++) {
          ranges[index].push(section);
        }

        return ranges;
      },
      [[], []]
    )
  );
