import { getInput } from "@/utilities/get-input.ts";

type MapRange = [destination: number, source: number, length: number];
type Range = [start: number, end: number];

const blocks = (await getInput(import.meta.url)).split("\n\n");

const maps = blocks.slice(1).map((map) =>
  map
    .split("\n")
    .slice(1)
    .map((line) => line.split(" ").map(Number) as MapRange),
);

const seeds = blocks[0]!.split(": ")[1]!.split(" ").map(Number);

const seedRanges = seeds.reduce<Range[]>((ranges, seed, index) => {
  if (index % 2 === 0) return ranges;
  ranges.push([seeds[index - 1]!, seeds[index - 1]! + seed]);
  return ranges;
}, []);

const getClosestLocation = (seeds: number[]) => {
  let result = [...seeds];

  for (const map of maps) {
    const mappedValues: number[] = [];

    for (const seed of result) {
      let isMapped = false;

      for (const [destination, source, length] of map) {
        if (source <= seed && seed < source + length) {
          mappedValues.push(seed - source + destination);
          isMapped = true;
          break;
        }
      }

      if (!isMapped) mappedValues.push(seed);
    }

    result = [...mappedValues];
  }

  return Math.min(...result);
};

const getClosestLocationFromRanges = (ranges: Range[]) => {
  let result: Range[] = ranges.map((range) => [...range]);

  for (const map of maps) {
    const mappedRanges: Range[] = [];

    while (result.length) {
      const [start, end] = result.pop()!;

      let isMapped = false;

      for (const [destination, source, length] of map) {
        const overlapStart = Math.max(start, source);
        const overlapEnd = Math.min(end, source + length);

        if (overlapStart < overlapEnd) {
          mappedRanges.push([
            overlapStart - source + destination,
            overlapEnd - source + destination,
          ]);

          if (overlapStart > start) result.push([start, overlapStart]);
          if (end > overlapEnd) result.push([overlapEnd, end]);

          isMapped = true;
          break;
        }
      }

      if (!isMapped) mappedRanges.push([start, end]);
    }

    result = mappedRanges.map((range) => [...range]);
  }

  return Math.min(...result.map(([start]) => start));
};

console.log("Part 1 -", getClosestLocation(seeds));
console.log("Part 2 -", getClosestLocationFromRanges(seedRanges));
