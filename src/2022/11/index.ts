import { getInput } from "@/utilities/get-input.ts";

const monkeys = (await getInput(import.meta.url))
  .split("\n\n")
  .map((chunk) => chunk.split("\n"))
  .map(([_, items, operation, test, ifTrue, ifFalse]) => ({
    divisor: Number(test.match(/\d+/)![0]),
    items: items.match(/\d+/g)!.map(Number),
    operate: (worry: number, divisor: number, relief?: number) => {
      const [_, a, operator, b] = operation.match(/= (.*) ([\+\*]) (.*)/)!;
      const left = a === "old" ? worry : Number(a);
      const right = b === "old" ? worry : Number(b);
      const result = operator === "+" ? left + right : left * right;
      return relief ? Math.floor(result / relief) : result % divisor;
    },
    throwTo: (worry: number) =>
      worry % Number(test.match(/\d+/)![0])
        ? Number(ifFalse.match(/\d+/)![0])
        : Number(ifTrue.match(/\d+/)![0]),
  }));

const divisor = monkeys.reduce((product, { divisor }) => product * divisor, 1);

const monkeyBusiness = (rounds: number, relief?: number) => {
  const monkeysCopy = [...monkeys].map(({ items, ...monkey }) => ({
    ...monkey,
    inspections: 0,
    items: [...items],
  }));

  for (let _ = 0; _ < rounds; _++) {
    monkeysCopy.reduce((monkeys, monkey) => {
      while (monkey.items.length) {
        const item = monkey.items.shift()!;
        const worry = monkey.operate(item, divisor, relief);
        const nextMonkey = monkey.throwTo(worry);
        monkeys[nextMonkey].items.push(worry);
        monkey.inspections++;
      }
      return monkeys;
    }, monkeysCopy);
  }

  return monkeysCopy
    .sort((a, z) => z.inspections - a.inspections)
    .slice(0, 2)
    .reduce((product, { inspections }) => product * inspections, 1);
};

console.log("Part 1 -", monkeyBusiness(20, 3));
console.log("Part 2 -", monkeyBusiness(10000));
