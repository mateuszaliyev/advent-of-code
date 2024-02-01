import { getInput } from "@/utilities/get-input.ts";

const blocks = (await getInput(import.meta.url)).split("\n\n");

const operators: Record<"<" | ">", (a: number, b: number) => boolean> = {
  "<": (a, b) => a < b,
  ">": (a, b) => a > b,
};

const categoryRanges = Object.fromEntries(
  "amsx".split("").map((category) => [category, [1, 4000]]),
) as Record<keyof (typeof parts)[number], [number, number]>;

const parts = blocks[1]!.split("\n").map((row) => {
  const [x = 0, m = 0, a = 0, s = 0] = row.match(/\d+/g)!.map(Number);
  return { a, m, s, x };
});

const workflows = new Map(
  blocks[0]!.split("\n").map((row) => {
    const [name, rules] = row.slice(0, -1).split("{") as [string, string];
    const statements = rules.split(",");
    return [
      name,
      {
        fallback: statements.at(-1)!,
        rules: statements.slice(0, -1).map((statement) => {
          const [condition = "", workflow = ""] = statement.split(":");
          const category = condition[0] as keyof (typeof parts)[number];
          const operator = condition[1] as keyof typeof operators;
          const value = Number(condition.slice(2));
          return { category, operator, value, workflow };
        }),
      },
    ];
  }),
);

const accepted = (part: (typeof parts)[number], workflow = "in"): boolean => {
  if ("AR".includes(workflow)) return workflow === "A" ? true : false;
  const { fallback, rules } = workflows.get(workflow)!;

  for (const { category, operator, value, workflow } of rules)
    if (operators[operator](part[category], value))
      return accepted(part, workflow);

  return accepted(part, fallback);
};

const combinations = (ranges: typeof categoryRanges, workflow = "in") => {
  if (workflow === "R") return 0;
  if (workflow === "A") {
    let product = 1;
    for (const [a, b] of Object.values(ranges)) product *= b - a + 1;
    return product;
  }

  const { fallback, rules } = workflows.get(workflow)!;
  let result = 0;

  for (const { category, operator, value, workflow } of rules) {
    const [a, b] = ranges[category];
    const range = {
      false:
        operator === "<" ? [Math.max(a, value), b] : [a, Math.min(value, b)],
      true:
        operator === "<"
          ? [a, Math.min(value - 1, b)]
          : [Math.max(a, value + 1), b],
    } satisfies Record<string, [number, number]>;

    if (range.true[0] <= range.true[1]) {
      const copy = JSON.parse(JSON.stringify(ranges)) as typeof ranges;
      copy[category] = range.true;
      result += combinations(copy, workflow);
    }

    if (range.false[0] <= range.false[1]) {
      ranges = JSON.parse(JSON.stringify(ranges)) as typeof ranges;
      ranges[category] = range.false;
    }
  }

  result += combinations(ranges, fallback);
  return result;
};

const totalAcceptedRating = parts
  .filter((part) => accepted(part))
  .flatMap(Object.values)
  .reduce((a, b) => a + b);

console.log("Part 1 -", totalAcceptedRating);
console.log("Part 2 -", combinations(categoryRanges));
