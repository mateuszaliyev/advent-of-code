import { sum } from "@/utilities/array.ts";

import {
  getOutcomeScore,
  getShapeScore,
  getStrategyGuide,
  RESPONSES,
  SHAPES,
} from "./common.ts";

const result = sum(
  getStrategyGuide().map(([shape, response]) => {
    const responseShape = SHAPES[RESPONSES.findIndex((r) => r === response)];

    return getOutcomeScore(
      shape,
      responseShape,
    ) + getShapeScore(responseShape);
  }),
);

console.log(result);
