import { getInput } from "@/utilities/get-input.ts";

type Monkey = {
  job: (a?: number, b?: number) => number;
  monkeys: [Monkey, Monkey];
  operands: [string, string];
  operator?: Operator;
  yell: () => number;
};

type Operator = keyof typeof operations;

const operations = {
  "+": (a: number, b: number) => a + b,
  "-": (a: number, b: number) => a - b,
  "*": (a: number, b: number) => a * b,
  "/": (a: number, b: number) => a / b,
};

const oppositeOperator: Record<Operator, Operator> = {
  "+": "-",
  "-": "+",
  "*": "/",
  "/": "*",
};

const monkeys = new Map(
  (await getInput(import.meta.url, "input.txt")).split("\n").map((line) => {
    const [name, job] = line.split(": ");
    const words = job.split(" ");
    const operator = words.splice(1, 1)[0] as Operator | undefined;

    return [
      name,
      {
        job: operator ? operations[operator] : () => Number(words[0]),
        operands: words.length - 1 ? words : [],
        operator,
      },
    ] as [string, Monkey];
  })
);

for (const [_, monkey] of monkeys) {
  monkey.monkeys = monkey.operands.map((operand) => monkeys.get(operand)!) as [
    Monkey,
    Monkey
  ];
  monkey.yell = () =>
    monkey.job(...monkey.monkeys!.map((monkey) => monkey.yell!()));
}

const calculate = (initialMonkeys: Map<string, Monkey>) => {
  const monkeys = new Map(initialMonkeys);
  monkeys.get("humn")!.job = () => NaN;

  const sides = monkeys.get("root")!.monkeys;
  const values = sides.map((side) => side.yell()) as [number, number];
  const unknownSide = values.findIndex((value) => Number.isNaN(value));
  const knownSide = (unknownSide + 1) % 2;

  const stack: [Monkey, number][] = [[sides[unknownSide], values[knownSide]]];

  let i = -1;

  while (stack.length) {
    i++;
    const [monkey, result] = stack.pop()!;
    const sides = monkey.monkeys;
    const values = sides.map((side) => side.yell()) as [number, number];
    const unknownSide = values.findIndex((value) => Number.isNaN(value));
    const knownSide = (unknownSide + 1) % 2;

    if (!monkey.operator) break;

    const operation = operations[oppositeOperator[monkey.operator]];
    const operand = operation(result, values[knownSide]);

    if (monkey.operands.includes("humn")) return operand;

    stack.push([sides[unknownSide], operand]);

    i === 1 &&
      console.log({
        monkey,
        sides,
        values,
        unknownSide,
        knownSide,
        operand,
        result,
      });
  }
};

console.log("Part 1 -", monkeys.get("root")!.yell());
// TODO: Part 2
// console.log("Part 2 -", calculate(monkeys));
