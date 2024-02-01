import { getInput } from "@/utilities/get-input.ts";

const lines = (await getInput(import.meta.url)).split("\n");
const copies = Array.from({ length: lines.length }, () => 1);

const points = lines.reduce((totalPoints, line, index) => {
  const [winningNumbers, numbers] = line
    .split(":")[1]!
    .split("|")
    .map((numbers) => numbers.match(/\d+/g)!.map(Number)) as [
    number[],
    number[],
  ];

  const count = numbers.filter((number) =>
    winningNumbers.includes(number),
  ).length;

  for (let currentIndex = index; currentIndex < index + count; currentIndex++) {
    copies[currentIndex + 1] += copies[index]!;
  }

  return totalPoints + (count ? 2 ** (count - 1) : 0);
}, 0);

const sum = (a: number, b: number) => a + b;

console.log("Part 1 -", points);
console.log("Part 2 -", copies.reduce(sum));
