import { getProcedures, getStacks } from "./common.ts";

const procedures = getProcedures();
const stacks = getStacks();

procedures.forEach(([amount, from, to]) => {
  for (let i = 0; i < amount; i++) {
    stacks[to].push(stacks[from].pop()!);
  }
});

const result = stacks.reduce(
  (message, stack) => `${message}${stack[stack.length - 1]}`,
  ""
);

console.log(result);
