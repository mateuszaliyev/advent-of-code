import { getInput } from "@/utilities/get-input.ts";

const steps = (await getInput(import.meta.url)).split(",");

const hash = (text: string) => text.split("").reduce(hashCharacter, 0);
const hashCharacter = (sum: number, character: string) =>
  (17 * (sum + character.charCodeAt(0))) % 256;

const focusingPower = (boxes: Map<string, number>[]) => {
  let sum = 0;
  for (const [box, lenses] of boxes.entries())
    for (const [index, [_, focalLength]] of [...lenses].entries())
      sum += (box + 1) * (index + 1) * focalLength;
  return sum;
};

const boxes = Array.from({ length: 256 }, () => new Map<string, number>());

for (const step of steps) {
  const [label, focalLength] = step.split(/[=-]/) as [string, string];
  if (!focalLength) boxes[hash(label)]!.delete(label);
  else boxes[hash(label)]!.set(label, Number(focalLength));
}

const hashSum = steps.map(hash).reduce((sum, value) => sum + value);

console.log("Part 1 -", hashSum);
console.log("Part 2 -", focusingPower(boxes));
