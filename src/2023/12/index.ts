import { getInput } from "@/utilities/get-input.ts";

const input = (await getInput(import.meta.url)).split("\n");

const getRecords = (folds: number) =>
  input.map((row) => {
    const [springs, groups] = row.split(" ").map((block, index) =>
      Array(folds)
        .fill(block)
        .join(index ? "," : "?"),
    );
    return [springs!, groups!.split(",").map(Number)] as [string, number[]];
  });

const cache = new Map<string, number>();

const arrangements = (springs: string, groups: number[]): number => {
  if (!springs.length) return groups.length ? 0 : 1;
  if (!groups.length) return springs.indexOf("#") !== -1 ? 0 : 1;

  const key = `${springs}${groups}`;
  if (cache.has(key)) return cache.get(key)!;
  let count = 0;

  if (springs[0] !== "#") count += arrangements(springs.slice(1), groups);

  const groupFits = groups[0]! <= springs.length;
  const operationalNearby = springs.slice(0, groups[0]!).indexOf(".") === -1;
  const damagedNearby = springs[groups[0]!] !== "#";

  if (springs[0] !== "." && groupFits && operationalNearby && damagedNearby)
    count += arrangements(springs.slice(groups[0]! + 1), groups.slice(1));

  cache.set(key, count);
  return count;
};

const arrange = (record: [string, number[]]) => arrangements(...record);
const sum = (a: number, b: number) => a + b;

console.log("Part 1 -", getRecords(1).map(arrange).reduce(sum));
console.log("Part 2 -", getRecords(5).map(arrange).reduce(sum));
