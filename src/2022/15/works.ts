import { getInput } from "@/utilities/get-input.ts";

type Point = { x: number; y: number };
type Sensor = Point & {
  beacon: Point;
};

const beacons = new Map<string, Point>();
const sensors = new Map<string, Sensor>();
const visited = new Map<string, Point>();

(await getInput(import.meta.url, "example.txt")).split("\n").forEach((line) => {
  const [sensorX, sensorY, beaconX, beaconY] =
    line.match(/-?\d+/g)?.map(Number) ?? [];

  const beacon: Point = { x: beaconX, y: beaconY };
  const sensor: Sensor = { beacon, x: sensorX, y: sensorY };

  beacons.set(JSON.stringify([beacon.x, beacon.y]), beacon);
  sensors.set(JSON.stringify([sensor.x, sensor.y]), sensor);
});

const selectedRow = 10;
// const selectedRow = 2000000;

sensors.forEach((sensor) => {
  const rowDistance = Math.abs(selectedRow - sensor.y);
  const beaconDistance =
    Math.abs(sensor.beacon.x - sensor.x) + Math.abs(sensor.beacon.y - sensor.y);

  const rowLength = (beaconDistance - rowDistance) * 2 + 1;

  if (rowLength > 0) {
    for (
      let x = sensor.x - Math.floor(rowLength / 2);
      x <= sensor.x + Math.floor(rowLength / 2);
      x++
    ) {
      if (!beacons.has(JSON.stringify([x, selectedRow]))) {
        visited.set(JSON.stringify([x, selectedRow]), { x, y: selectedRow });
      }
    }
  }
});

console.log("Part 1 -", visited.size);
console.log("Part 2 -");

// import { getInput } from "@/utilities/get-input.ts";

// type Point = { x: number; y: number };
// type Sensor = Point & {
//   beacon: Point;
//   vertices: Point[];
// };

// const beacons = new Map<string, Point>();
// const sensors = new Map<string, Sensor>();
// const visited = new Map<string, Point>();

// // const boundary: Point = { x: 20, y: 20 };
// const boundary: Point = { x: 4_000_000, y: 4_000_000 };

// (await getInput(import.meta.url, "input.txt")).split("\n").map((line) =>
//   [...line.matchAll(/x=(-?\d+),\sy=(-?\d+).*?x=(-?\d+),\sy=(-?\d+)/g)]
//     .map((numbers) => numbers.slice(1).map(Number))
//     .forEach((coordinates) => {
//       const beacon: Point = { x: coordinates[2], y: coordinates[3] };

//       const beaconDistance =
//         Math.abs(coordinates[0] - coordinates[2]) +
//         Math.abs(coordinates[1] - coordinates[3]);

//       const vertices: Point[] = [
//         { x: coordinates[0], y: coordinates[1] - beaconDistance },
//         { x: coordinates[0] + beaconDistance, y: coordinates[1] },
//         { x: coordinates[0], y: coordinates[1] + beaconDistance },
//         { x: coordinates[0] - beaconDistance, y: coordinates[1] },
//       ];

//       const sensor: Sensor = {
//         beacon,
//         x: coordinates[0],
//         y: coordinates[1],
//         vertices,
//       };

//       beacons.set(JSON.stringify([beacon.x, beacon.y]), beacon);
//       sensors.set(JSON.stringify([sensor.x, sensor.y]), sensor);

//       console.log("sensor - ", sensor);

//       const expandedVertices: Point[] = [
//         { x: coordinates[0], y: coordinates[1] - beaconDistance - 1 },
//         { x: coordinates[0] + beaconDistance + 1, y: coordinates[1] },
//         { x: coordinates[0], y: coordinates[1] + beaconDistance + 1 },
//         { x: coordinates[0] - beaconDistance - 1, y: coordinates[1] },
//       ];

//       expandedVertices
//         .map(
//           (point, index) =>
//             [expandedVertices.at(index - 1), point] as [Point, Point]
//         )
//         .forEach(([a, b]) => {
//           for (
//             let x = a.x, y = a.y;
//             x <= b.x && y <= b.y;
//             x += Math.sign(b.x - a.x), y += Math.sign(b.y - a.y)
//           ) {
//             if (x < 0 || y < 0 || x > boundary.x || y > boundary.y) continue;
//             const key = JSON.stringify([x, y]);
//             visited.set(key, { x, y });
//           }
//         });
//     })
// );

// let progress = 0;
// const finish = visited.size;

// for (const [pointKey, point] of visited) {
//   progress % (visited.size / 10000) === 0 &&
//     console.log("visited - ", ((100 * progress) / finish).toFixed(2) + "%");

//   for (const [_sensorKey, sensor] of sensors) {
//     const beaconDistance =
//       Math.abs(sensor.x - sensor.beacon.x) +
//       Math.abs(sensor.y - sensor.beacon.y);
//     const distance =
//       Math.abs(sensor.x - point.x) + Math.abs(sensor.y - point.y);

//     if (distance <= beaconDistance) {
//       visited.delete(pointKey);
//     }
//   }

//   progress++;
// }

// console.log(visited);

// console.log("Part 1 -");
// console.log("Part 2 -");
