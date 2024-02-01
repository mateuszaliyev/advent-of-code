import { getInput } from "@/utilities/get-input.ts";

type Packet = number | Packet[];

const packets = (await getInput(import.meta.url, "input.txt"))
  .split("\n\n")
  .map((pair) =>
    pair.split("\n").map<[Packet, Packet]>((packet) => JSON.parse(packet))
  );

const compare = (a: Packet, b: Packet): number => {
  if (Array.isArray(a) && Array.isArray(b)) {
    for (let i = 0; i < Math.max(a.length, b.length); i++) {
      if (a[i] === undefined) return -1;
      if (b[i] === undefined) return 1;
      const order = compare(a[i], b[i]);
      if (order) return order;
    }
    return 0;
  }

  if (Array.isArray(a)) return compare(a, [b]);
  if (Array.isArray(b)) return compare([a], b);

  return Math.max(Math.min(a - b, 1), -1);
};

const indexSum = packets.reduce(
  (sum, [a, b], index) => sum + (compare(a, b) < 1 ? index + 1 : 0),
  0
);

const decoderKey = [...packets.flatMap((pair) => pair), [[2]], [[6]]]
  .toSorted(compare)
  .reduce<number>(
    (decoderKey, packet, index) =>
      decoderKey *
      (["[[2]]", "[[6]]"].includes(JSON.stringify(packet)) ? index + 1 : 1),
    1
  );

console.log("Part 1 -", indexSum);
console.log("Part 2 -", decoderKey);
