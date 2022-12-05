import { getProcedures, getStacks } from "./common.ts";

const procedures = getProcedures();
const stacks = getStacks();

procedures.forEach(([amount, from, to]) => {
  const stack: string[] = [];

  for (let i = 0; i < amount; i++) {
    stack.unshift(stacks[from].pop()!);
  }

  stacks[to].push(...stack);
});

const result = stacks.reduce(
  (message, stack) => `${message}${stack[stack.length - 1]}`,
  ""
);

console.log(result);
