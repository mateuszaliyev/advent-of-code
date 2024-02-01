import { getFileUrl, getInput } from "@/utilities/get-input.ts";

type Report = [number, number, number, number];
type Point = [number, number];

const file =
  getFileUrl(import.meta.url)
    .href.split("/")
    .at(-1) === "example.txt"
    ? "example"
    : "input";

const reports = (await getInput(import.meta.url))
  .split("\n")
  .map((line) => (line.match(/-?\d+/g)?.map(Number) ?? []) as Report);

const frequencyMultiplier = 4_000_000;
const boundaries = { example: 20, input: frequencyMultiplier };

const findBeacon = (reports: Report[], boundary: number) => {
  for (let row = 0; row <= boundary; row++) {
    const intervals = getIntervals(reports, row);

    let x = 0;

    for (const [start, end] of intervals) {
      if (x > boundary) break;
      if (x < start) return [x, row] as Point;
      x = end + 1;
    }
  }
};

const frequency = ([x, y]: Point) => x * frequencyMultiplier + y;

const getIntervals = (reports: Report[], row: number) => {
  const sensorIntervals: Point[] = [];

  for (const [sensorX, sensorY, beaconX, beaconY] of reports) {
    const distanceDifference =
      Math.abs(beaconX - sensorX) +
      Math.abs(beaconY - sensorY) -
      Math.abs(sensorY - row);

    if (distanceDifference < 0) continue;

    sensorIntervals.push([
      sensorX - distanceDifference,
      sensorX + distanceDifference,
    ]);
  }

  sensorIntervals.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const intervals: [number, number][] = [sensorIntervals[0]];

  for (const interval of sensorIntervals.slice(1)) {
    const previousInterval = intervals.at(-1)!;
    if (interval[0] <= previousInterval[1] + 1) {
      previousInterval[1] = Math.max(interval[1], previousInterval[1]);
      continue;
    }
    intervals.push(interval);
  }

  return intervals;
};

const positionsWithoutBeacon = (reports: Report[], row: number) => {
  const rowBeacons = new Set<number>();
  reports.forEach(([_, __, x, y]) => y === row && rowBeacons.add(x));

  const intervals = getIntervals(reports, row);

  const checked = new Set<number>();

  for (const interval of intervals) {
    for (let x = interval[0]; x <= interval[1]; x++) {
      checked.add(x);
    }
  }

  return checked.size - rowBeacons.size;
};

console.log("Part 1 -", positionsWithoutBeacon(reports, boundaries[file] / 2));
console.log(
  "Part 2 -",
  frequency(findBeacon(reports, boundaries[file]) ?? [0, 0])
);
