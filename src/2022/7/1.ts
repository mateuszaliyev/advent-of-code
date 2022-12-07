import { getDirectories } from "./common.ts";

const directories = getDirectories();
const directoriesArray = [...directories];

const result = directoriesArray.reduce(
  (result, [_path, size]) => result + (size <= 100_000 ? size : 0),
  0
);

console.log(result);
