import { EOL } from "@/utilities/eol.ts";
import { getInput } from "@/utilities/get-input.ts";

export type Response = typeof RESPONSES[number];
export type Shape = typeof SHAPES[number];

export const RESPONSES = ["X", "Y", "Z"] as const;
export const SHAPES = ["A", "B", "C"] as const;

export const getOutcomeScore = (opponentsShape: Shape, yourShape: Shape) => {
  const opponentsShapeScore = getShapeScore(opponentsShape);
  const yourShapeScore = getShapeScore(yourShape);

  const scoreDifference = yourShapeScore - opponentsShapeScore;

  return ((scoreDifference + (scoreDifference < 0 ? SHAPES.length : 0) + 1) %
    SHAPES.length) * 3;
};

export const getShapeScore = (shape: Shape) =>
  SHAPES.findIndex((s) => s === shape) + 1;

const input = await getInput(import.meta.url);

export const getStrategyGuide = () =>
  input
    .split(EOL)
    .map((round) => round.split(" ") as [Shape, Response]);
