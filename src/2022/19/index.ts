import { getInput } from "@/utilities/get-input.ts";

type Production = [geode: number, obsidian: number, clay: number, ore: number];
type Robot = [Production, Production];

const blueprints = (await getInput(import.meta.url, "input.txt"))
  .split("\n")
  .map((line) => {
    const matches = line.match(/\d+/g)!.map(Number);
    return [
      matches[0],
      [
        [
          [0, 0, 0, matches[1]],
          [0, 0, 0, 1],
        ],
        [
          [0, 0, 0, matches[2]],
          [0, 0, 1, 0],
        ],
        [
          [0, 0, matches[4], matches[3]],
          [0, 1, 0, 0],
        ],
        [
          [0, matches[6], 0, matches[5]],
          [1, 0, 0, 0],
        ],
        [
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ],
      ],
    ] as [number, Robot[]];
  });

const compare = (a: Robot, b: Robot) => {
  const keyA = key(a);
  const keyB = key(b);

  for (let i = 0; i < keyA.length; i++) {
    if (keyA[i] < keyB[i]) return -1;
    if (keyA[i] > keyB[i]) return 1;
  }

  return 0;
};

const key = ([resources, robots]: Robot) => [
  ...resources.map((value, index) => value + robots[index]),
  ...robots,
];

const geodes = (blueprint: Robot[], minutes: number): number => {
  let queue: Robot[] = [
    [
      [0, 0, 0, 0],
      [0, 0, 0, 1],
    ],
  ];

  for (let time = minutes; time > 0; time--) {
    const next: Robot[] = [];

    for (const [resources, robots] of queue) {
      for (const [cost, more] of blueprint) {
        if (resources.every((resource, index) => resource >= cost[index])) {
          next.push([
            resources.map(
              (resource, index) => resource + robots[index] - cost[index]
            ) as Production,
            robots.map((robot, index) => robot + more[index]) as Production,
          ]);
        }
      }
    }

    queue = [
      ...new Map(
        next.map((robot) => [key(robot).join(","), robot] as [string, Robot])
      ),
    ]
      .map(([_, robot]) => robot)
      .sort(compare)
      .slice(-1000);
  }

  return Math.max(...queue.map(([[geodes]]) => geodes));
};

console.log(
  "Part 1 -",
  blueprints.reduce(
    (qualityLevels, [id, blueprint]) =>
      qualityLevels + geodes(blueprint, 24) * id,
    0
  )
);
console.log(
  "Part 2 -",
  blueprints
    .slice(0, 3)
    .reduce((result, [_, blueprint]) => result * geodes(blueprint, 32), 1)
);
