import { getSums } from "./common.ts";

const result = getSums()
  .sort((a, z) => z - a)
  .slice(0, 3)
  .reduce((sum, value) => sum + value, 0);

console.log(result);
