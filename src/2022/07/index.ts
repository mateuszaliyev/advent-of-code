import { getInput } from "@/utilities/get-input.ts";

const terminal = (await getInput(import.meta.url)).split("\n");

const currentPath: string[] = [];
const directories = new Map<string, number>();

const patterns = new Map<RegExp, (matches: RegExpMatchArray) => void>();
patterns.set(/\$ cd \.\./, () => currentPath.pop());
patterns.set(/\$ cd (.*)/, ([directory]) => currentPath.push(directory));
patterns.set(/(\d+) (.*)/, ([size]) => {
  const segments = [...currentPath];

  while (segments.length) {
    const path = `/${segments.slice(1).join("/")}`;
    directories.set(path, (directories.get(path) ?? 0) + Number(size));
    segments.pop();
  }
});

terminal.forEach((line) => {
  for (const [regularExpression, callback] of patterns) {
    const matches = line.match(regularExpression);

    if (matches) {
      callback(matches.slice(1));
      break;
    }
  }
});

const directoriesArray = [...directories];

console.log(
  "Part 1 -",
  directoriesArray.reduce(
    (sum, [_path, size]) => sum + (size <= 100_000 ? size : 0),
    0
  )
);

console.log(
  "Part 2 -",
  directoriesArray.reduce(
    (result, [_path, size]) =>
      size < result && directories.get("/")! - size + 30_000_000 <= 70_000_000
        ? size
        : result,
    Infinity
  )
);
