import { getMap, getTransposedMap } from "./common.ts";

const map = getMap();
const transposedMap = getTransposedMap(map);

const result = map.reduce(
  (visibleTrees, row, rowIndex) =>
    visibleTrees +
    (rowIndex === 0 || rowIndex === map.length - 1
      ? map.length
      : row.reduce(
          (visibleTreesInARow, tree, columnIndex) =>
            visibleTreesInARow +
            (columnIndex === 0 ||
            columnIndex === row.length - 1 ||
            tree > Math.max(...map[rowIndex].slice(0, columnIndex)) ||
            tree > Math.max(...map[rowIndex].slice(columnIndex + 1)) ||
            tree > Math.max(...transposedMap[columnIndex].slice(0, rowIndex)) ||
            tree > Math.max(...transposedMap[columnIndex].slice(rowIndex + 1))
              ? 1
              : 0),
          0
        )),
  0
);

console.log(result);
