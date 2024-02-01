import { getInput } from "@/utilities/get-input.ts";

const F: Record<string, number> = {};
const G: Record<string, string[]> = {};

(await getInput(import.meta.url, "input.txt")).split("\n").forEach((line) => {
  const [_, valve, flowRate, tunnels] = line.match(
    /([A-Z]{2}).*=(\d+).*valves? (.*)/
  )!;

  if (Number(flowRate)) F[valve] = Number(flowRate);
  G[valve] = tunnels.split(", ").sort();
});

const I = Object.fromEntries(
  Object.keys(F).map((valve, index) => [valve, 1 << index])
);

const T: Record<string, Record<string, number>> = {};

for (const [valve, tunnels] of Object.entries(G)) {
  T[valve] = {};
  for (const tunnel of Object.keys(G)) {
    T[valve][tunnel] = tunnels.includes(tunnel) ? 1 : Infinity;
  }
}

for (const k of Object.keys(T))
  for (const i of Object.keys(T))
    for (const j of Object.keys(T))
      T[i][j] = Math.min(T[i][j], T[i][k] + T[k][j]);

const search = (time: number) => {
  const stack = [
    {
      answer: {} as Record<number, number>,
      flow: 0,
      state: 0,
      time,
      valve: "AA",
    },
  ];

  while (stack.length) {
    const { answer, flow, state, time, valve } = stack.pop()!;

    answer[state] = Math.max(answer[state] ?? 0, flow);

    for (const u of Object.keys(F)) {
      const newTime = time - T[valve][u] - 1;
      if (I[u] & state || newTime <= 0) continue;
      stack.push({
        answer,
        flow: flow + newTime * F[u],
        state: state | I[u],
        time: newTime,
        valve: u,
      });
    }

    if (!stack.length) return answer;
  }

  return {};
};

console.log("Part 1 -", Math.max(...Object.values(search(30))));
console.log(
  "Part 2 -",
  Object.entries(search(26)).reduce(
    (result, [k1, v1], _, entries) =>
      Math.max(
        result,
        ...entries
          .filter(([k2]) => !(Number(k1) & Number(k2)))
          .flatMap(([_, v2]) => v1 + v2)
      ),
    0
  )
);
