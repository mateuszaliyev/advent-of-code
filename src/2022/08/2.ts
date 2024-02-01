import { getMap, getTransposedMap } from "./common.ts";

const map = getMap();
const transposedMap = getTransposedMap(map);

const result = map.reduce(
  (highestScore, row, rowIndex) =>
    rowIndex === 0 || rowIndex === row.length - 1
      ? highestScore
      : Math.max(
          highestScore,
          row.reduce(
            (highestRowScore, tree, columnIndex) =>
              columnIndex === 0 || columnIndex === map.length - 1
                ? highestRowScore
                : Math.max(
                    highestRowScore,
                    [
                      map[rowIndex].slice(columnIndex + 1),
                      map[rowIndex].slice(0, columnIndex).toReversed(),
                      transposedMap[columnIndex].slice(rowIndex + 1),
                      transposedMap[columnIndex]
                        .slice(0, rowIndex)
                        .toReversed(),
                    ].reduce(
                      (score, trees) =>
                        score *
                        (trees.findIndex((visibleTree) => visibleTree >= tree) +
                          1 || trees.length),
                      1
                    )
                  ),
            0
          )
        ),
  0
);

console.log(result);
