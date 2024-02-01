import { getInput } from "@/utilities/get-input.ts";

const input = (await getInput(import.meta.url)).split("\n\n");

const gcd = (a: number, b: number): number => (!b ? a : gcd(b, a % b));
const lcm = (a: number, b: number) => (a * b) / gcd(a, b);

const steps = input[0]!.split("") as ("L" | "R")[];

const nodes = new Map(
  input[1]!.split("\n").map((line) => {
    const [id, L, R] = line.match(/(\w{3}) = \((\w{3}), (\w{3})\)/)!.slice(1);
    return [id!, { L: L!, R: R! }];
  }),
);

const navigate = (start: string, targets: string[]) => {
  let step = 0;

  while (!targets.includes(start))
    start = nodes.get(start)![steps[step++ % steps.length]!];

  return step;
};

const nodesEndingWith = (text: string) =>
  [...nodes].filter(([id]) => id.endsWith(text)).map(([id]) => id);

console.log("Part 1 -", navigate("AAA", ["ZZZ"]));
console.log(
  "Part 2 -",
  nodesEndingWith("A")
    .map((id) => navigate(id, nodesEndingWith("Z")))
    .reduce(lcm),
);
