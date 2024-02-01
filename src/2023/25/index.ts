import { slidingWindows } from "std/collections/mod.ts";

import { getInput } from "@/utilities/get-input.ts";

const diagram = (await getInput(import.meta.url))
  .split("\n")
  .map((line) => line.replace(":", "").split(" ") as [string, ...string[]]);

const components = new Map<string, Set<string>>();

for (const [component, ...connections] of diagram) {
  if (!components.has(component)) components.set(component, new Set());
  for (const connection of connections) {
    if (!components.has(connection)) components.set(connection, new Set());
    components.get(component)!.add(connection);
    components.get(connection)!.add(component);
  }
}

const names = [...components.keys()];

const bridges = (iterations = 1000) => {
  const connections = new Map<string, number>();

  for (let i = 0; i < iterations; i++) {
    const [start, end] = randomTwoComponents();
    for (const connection of slidingWindows(path(start, end), 2)) {
      const key = connection.toSorted().join();
      connections.set(key, (connections.get(key) ?? 0) + 1);
    }
  }

  return [...connections].sort((a, b) => b[1] - a[1]).slice(0, 3);
};

const group = (component: string) => {
  const group = new Set<string>();
  const queue = [component];

  while (queue.length) {
    const component = queue.shift()!;
    if (group.has(component)) continue;
    group.add(component);
    queue.push(...components.get(component)!);
  }

  return [...group];
};

const groups = () => {
  const remainingComponents = new Set(names);
  const groups: string[][] = [];

  while (remainingComponents.size) {
    const component = [...remainingComponents][0]!;
    groups.push(group(component));
    for (const component of groups.at(-1)!)
      remainingComponents.delete(component);
  }

  return groups;
};

const path = (start: string, end: string) => {
  const queue = [[start]];
  const visited = new Set([start]);

  while (queue.length) {
    const path = queue.shift()!;

    for (const component of components.get(path.at(-1)!)!) {
      if (component === end) return [...path, component];
      if (visited.has(component)) continue;
      visited.add(component);
      queue.push([...path, component]);
    }
  }

  throw new Error("No path found");
};

const randomTwoComponents = (): [string, string] => {
  const start = names[Math.floor(Math.random() * names.length)]!;
  let end = "";
  do end = names[Math.floor(Math.random() * names.length)]!;
  while (end === start);
  return [start, end];
};

for (const [key] of bridges()) {
  const [a, b] = key.split(",") as [string, string];
  components.get(a)!.delete(b);
  components.get(b)!.delete(a);
}

const componentGroupsProduct = groups()
  .map((group) => group.length)
  .reduce((product, value) => product * value, 1);

console.log("Part 1 -", componentGroupsProduct);
