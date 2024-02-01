import { getInput } from "@/utilities/get-input.ts";

type Brick = {
  end: Point;
  id: number;
  orientation: "horizontal" | "vertical";
  start: Point;
};

type Point = { x: number; y: number; z: number };

const bricks = new Map(
  (await getInput(import.meta.url, "input.txt"))
    .split("\n")
    .map<[number, Brick]>((row, index) => {
      const [sx, sy, sz, ex, ey, ez] = row
        .split("~")
        .flatMap((point) => point.split(",").map(Number));

      return [
        index + 1,
        {
          end: { x: ex!, y: ey!, z: ez! },
          id: index + 1,
          orientation: ex !== sx || ey !== sy ? "horizontal" : "vertical",
          start: { x: sx!, y: sy!, z: sz! },
        },
      ];
    }),
);

class Simulation {
  #bricks: Map<number, Brick>;
  #fallen = new Set<number>();
  #initialBricks: Map<number, Brick>;
  #occupied: Map<string, number>;

  constructor(bricks: Map<number, Brick>) {
    this.#initialBricks = structuredClone(bricks);
    this.#bricks = structuredClone(bricks);
    this.#occupied = this.#getOccupiedCubes();
  }

  disintegrate(id: number) {
    const cubes = Simulation.#getCubes(this.#bricks.get(id)!);
    for (const { x, y, z } of cubes) this.#occupied.delete(`${x},${y},${z}`);
    this.#bricks.delete(id);
    return this;
  }

  get fallen() {
    return this.#fallen.size;
  }

  fromCurrent() {
    return new Simulation(this.#bricks);
  }

  #getAirUnitsBelow(id: number) {
    const { end, orientation, start } = this.#bricks.get(id)!;
    const z = orientation === "horizontal" ? end.z : Math.min(end.z, start.z);
    const cubes =
      orientation === "horizontal"
        ? Simulation.#getCubes({ end, start })
        : [{ x: end.x, y: end.y, z }];

    let units = 0;

    for (; z - units > 0; units++) {
      if (
        z - units === 1 ||
        cubes.some(({ x, y, z }) =>
          this.#occupied.has(`${x},${y},${z - units - 1}`),
        )
      ) {
        break;
      }
    }

    return units;
  }

  getDisintegratableBricks() {
    const brickIds = [...this.#bricks.keys()];
    const disintegratableBricks = new Set(brickIds);

    for (const supportingBricks of brickIds.map((id) =>
      this.#getSupportingBricks(id),
    ))
      if (supportingBricks.length === 1)
        disintegratableBricks.delete(supportingBricks[0]!);

    return [...disintegratableBricks];
  }

  static #getCubes({ end, start }: Pick<Brick, "end" | "start">) {
    const cubes: Point[] = [];
    const { max, min } = Math;

    for (let x = min(end.x, start.x); x <= max(end.x, start.x); x++)
      for (let y = min(end.y, start.y); y <= max(end.y, start.y); y++)
        for (let z = min(end.z, start.z); z <= max(end.z, start.z); z++)
          cubes.push({ x, y, z });

    return cubes;
  }

  #getOccupiedCubes() {
    const occupied = new Map<string, number>();

    for (const [id, brick] of this.#bricks)
      for (const { x, y, z } of Simulation.#getCubes(brick))
        occupied.set(`${x},${y},${z}`, id);

    return occupied;
  }

  #getSupportingBricks(id: number) {
    const cubes = Simulation.#getCubes(this.#bricks.get(id)!);
    const own = new Set(cubes.map(({ x, y, z }) => `${x},${y},${z}`));
    const supportingBricks = new Set<number>();

    for (const { x, y, z } of cubes) {
      const key = `${x},${y},${z - 1}`;
      if (own.has(key) || !this.#occupied.has(key)) continue;
      supportingBricks.add(this.#occupied.get(key)!);
    }

    return [...supportingBricks].sort((a, z) => a - z);
  }

  log() {
    console.log({
      bricks: this.#bricks,
      fallen: this.#fallen,
      occupied: this.#occupied,
    });

    return this;
  }

  #moveBrickDown(id: number, units: number) {
    if (units <= 0) return;
    const { end, start } = this.#bricks.get(id)!;

    let cubes = Simulation.#getCubes({ end, start });
    for (const { x, y, z } of cubes) this.#occupied.delete(`${x},${y},${z}`);
    cubes = cubes.map(({ x, y, z }) => ({ x, y, z: z - units }));
    for (const { x, y, z } of cubes) this.#occupied.set(`${x},${y},${z}`, id);

    end.z = end.z - units;
    start.z = start.z - units;
  }

  reset() {
    this.#bricks = structuredClone(this.#initialBricks);
    this.#fallen.clear();
    this.#occupied = this.#getOccupiedCubes();
    return this;
  }

  simulate() {
    while (true) {
      let moves = 0;
      for (const [id] of this.#bricks) {
        const unitsAvailable = this.#getAirUnitsBelow(id);
        if (unitsAvailable) {
          this.#moveBrickDown(id, unitsAvailable);
          this.#fallen.add(id);
          moves += unitsAvailable;
        }
      }
      if (!moves) break;
    }

    return this;
  }
}

const simulation = new Simulation(bricks).simulate();

console.log("Part 1 -", simulation.getDisintegratableBricks().length);
console.log(
  "Part 2 -",
  [...bricks.keys()]
    .map((id) => simulation.fromCurrent().disintegrate(id).simulate().fallen)
    .reduce((a, b) => a + b),
);
