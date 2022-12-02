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
    const outcomeScore = RESPONSES.findIndex((r) => r === response) * 3;

    return outcomeScore + getShapeScore(
      SHAPES.find((s) => getOutcomeScore(shape, s) === outcomeScore)!,
    );
  }),
);

console.log(result);
