import { getInput } from "@/utilities/get-input.ts";

const conjunctions = new Map<string, Map<string, boolean>>();
const flipFlops = new Map<string, boolean>();
const modules = new Map<string, ["%" | "&" | "b", string[]]>();
let last = "";

for (const row of (await getInput(import.meta.url)).split("\n")) {
  const [id, _, ...destinations] = row.replaceAll(",", "").split(" ");
  const name = id === "broadcaster" ? id : id!.slice(1);
  modules.set(name, [id![0]! as "%" | "&" | "b", destinations]);

  for (const destination of destinations) {
    if (destination === "rx") last = name!;
    const map = conjunctions.get(destination) ?? new Map<string, boolean>();
    map.set(name!, false);
    conjunctions.set(destination, map);
  }
}

const cycles = new Map([...conjunctions.get(last)!].map(([name]) => [name, 0]));
const pulses = { false: 0, true: 0 };

for (let presses = 1; ; presses++) {
  if ([...cycles.values()].every(Boolean)) break;

  const queue: [string, string, boolean][] = [["button", "broadcaster", false]];

  while (queue.length) {
    const [source, current, pulseIn] = queue.shift()!;

    if (presses <= 1000) pulses[`${pulseIn}`]++;
    if (!modules.has(current)) continue;

    const [type, destinations] = modules.get(current)!;
    let pulseOut = false;

    if (type === "b") pulseOut = pulseIn;
    else if (type === "%" && !pulseIn) {
      pulseOut = !(flipFlops.get(current) ?? false);
      flipFlops.set(current, pulseOut);
    } else if (type === "&") {
      const states = conjunctions.get(current)!;
      states.set(source, pulseIn);
      pulseOut = ![...states.values()].every(Boolean);

      if (destinations.includes("rx"))
        for (const [name, value] of states)
          if (value) cycles.set(name, presses);
    } else continue;

    for (const name of destinations) queue.push([current, name, pulseOut]);
  }
}

const product = (a: number, b: number) => a * b;

console.log("Part 1 -", pulses.false * pulses.true);
console.log("Part 2 -", [...cycles.values()].reduce(product));
