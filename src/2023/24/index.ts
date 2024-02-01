import { getInput } from "@/utilities/get-input.ts";

type Hailstone = Vector3 & { v: Vector3 };
type Vector3 = { x: number; y: number; z: number };

const hailstones = (await getInput(import.meta.url))
  .split("\n")
  .map<Hailstone>((row) => {
    const [x, y, z, vx, vy, vz] = row.split(/[@,]/g).map(Number);
    return { v: { x: vx!, y: vy!, z: vz! }, x: x!, y: y!, z: z! };
  });

const cross = (a: Vector3, b: Vector3) => ({
  x: a.y * b.z - a.z * b.y,
  y: a.z * b.x - a.x * b.z,
  z: a.x * b.y - a.y * b.x,
});

const dot = (a: Vector3, b: Vector3) => a.x * b.x + a.y * b.y + a.z * b.z;

const findRock = (h1: Hailstone, h2: Hailstone, h3: Hailstone) => {
  const [a, A] = plane(h1, h2);
  const [b, B] = plane(h1, h3);
  const [c, C] = plane(h2, h3);

  let w = lin([cross(b, c), cross(c, a), cross(a, b)], [A, B, C]);
  const t = dot(a, cross(b, c));
  w = {
    x: Math.round(w.x / t),
    y: Math.round(w.y / t),
    z: Math.round(w.z / t),
  };

  const w1 = sub(h1.v, w);
  const w2 = sub(h2.v, w);
  const ww = cross(w1, w2);

  const E = dot(ww, cross(h2, w2));
  const F = dot(ww, cross(h1, w1));
  const G = dot(h1, ww);
  const S = dot(ww, ww);

  const rock = lin([w1, w2, ww], [E, -F, G]);
  return [rock, S] as [Vector3, number];
};

const intersectionsWithinArea = (min: number, max: number) => {
  let intersections = 0;

  for (const [i, a] of hailstones.entries()) {
    for (const b of hailstones.slice(i + 1)) {
      const [a1, b1, c1] = [-a.v.y, a.v.x, a.y * a.v.x - a.x * a.v.y];
      const [a2, b2, c2] = [-b.v.y, b.v.x, b.y * b.v.x - b.x * b.v.y];

      if (a1 * b2 === b1 * a2) continue;

      const x = (c1 * b2 - c2 * b1) / (a1 * b2 - a2 * b1);
      const y = (a1 * c2 - a2 * c1) / (a1 * b2 - a2 * b1);

      if (Math.sign(x - a.x) !== Math.sign(a.v.x)) continue;
      if (Math.sign(y - a.y) !== Math.sign(a.v.y)) continue;
      if (Math.sign(x - b.x) !== Math.sign(b.v.x)) continue;
      if (Math.sign(y - b.y) !== Math.sign(b.v.y)) continue;
      if (Math.min(x, y) >= min && Math.max(x, y) <= max) intersections += 1;
    }
  }

  return intersections;
};

const lin = (
  vectors: [Vector3, Vector3, Vector3],
  scalars: [number, number, number],
) => {
  const [a, b, c] = vectors;
  const [r, s, t] = scalars;
  return {
    x: r * a.x + s * b.x + t * c.x,
    y: r * a.y + s * b.y + t * c.y,
    z: r * a.z + s * b.z + t * c.z,
  };
};

const linearlyIndependent = (a: Vector3, b: Vector3) => {
  const { x, y, z } = cross(a, b);
  return x !== 0 && y !== 0 && z !== 0;
};

const plane = (a: Hailstone, b: Hailstone): [Vector3, number] => {
  const p12 = sub(a, b);
  return [cross(p12, sub(a.v, b.v)), dot(p12, cross(a.v, b.v))];
};

const solve = () => {
  const candidates: Hailstone[] = [];

  for (const hailstone of hailstones) {
    if (candidates.length === 3) break;
    if (candidates.every(({ v }) => linearlyIndependent(v, hailstone.v)))
      candidates.push(hailstone);
  }

  const [h1, h2, h3] = candidates;
  const [rock, S] = findRock(h1!, h2!, h3!);
  return Math.floor((rock.x + rock.y + rock.z) / S);
};

const sub = (a: Vector3, b: Vector3) => {
  return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
};

console.log("Part 1 -", intersectionsWithinArea(2e14, 4e14));
console.log("Part 2 -", solve());
