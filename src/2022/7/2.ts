import { getDirectories } from "./common.ts";

const directories = getDirectories();
const directoriesArray = [...directories];

const result = directoriesArray.reduce(
  (result, [_path, size]) =>
    size < result && directories.get("/")! - size + 30_000_000 <= 70_000_000
      ? size
      : result,
  Infinity
);

console.log(result);
