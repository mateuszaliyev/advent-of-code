import { getInput } from "@/utilities/get-input.ts";

const { image, strengths } = (await getInput(import.meta.url))
  .split("\n")
  .reduce<number[]>((registerValues, line) => {
    const value = Number(line.split(" ")[1]);
    registerValues.push(0);
    if (value) registerValues.push(value);
    return registerValues;
  }, [])
  .reduce<number[]>(
    (registerValues, value) => {
      registerValues.push(registerValues.at(-1)! + value);
      return registerValues;
    },
    [1]
  )
  .reduce(
    ({ image, strengths }, x, cycle) => ({
      image: `${image}${cycle % 40 ? "" : "\n"}${
        [x - 1, x, x + 1].includes(cycle % 40) ? "█" : " "
      }`,
      strengths:
        (cycle + 1) % 40 === 20 ? strengths + (cycle + 1) * x : strengths,
    }),
    { image: "", strengths: 0 }
  );

console.log("Part 1 -", strengths);
console.log("Part 2 -", image);
