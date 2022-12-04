import { sum } from "@/utilities/array.ts";

import { getSums } from "./common.ts";

const result = sum(
  getSums()
    .sort((a, z) => z - a)
    .slice(0, 3)
);

console.log(result);
