import { getInput } from "@/utilities/get-input.ts";

const input = await getInput(import.meta.url);

const getTotalWinnings = (wildcard = false) =>
  ["AE", "KD", "QC", `J${wildcard ? "0" : "B"}`, "TA"]
    .reduce(
      (hands, pair) =>
        hands.replaceAll(...(pair.split("") as [string, string])),
      input,
    )
    .split("\n")
    .map((line) => {
      const [hand, bid] = line.split(" ") as [string, string];
      const amounts: Record<string, number> = {};
      for (const card of hand) amounts[card] = (amounts[card] ?? 0) + 1;
      const strength =
        Object.entries(amounts)
          .filter(([card]) => !wildcard || card !== "0")
          .sort((a, z) => (a[1] !== z[1] ? z[1] - a[1] : a[0] < z[0] ? 1 : -1))
          .map(([_, count], index) => count + (index ? 0 : amounts["0"] ?? 0))
          .join("") || "5";
      return { bid: Number(bid), hand, strength };
    })
    .sort((a, z) => {
      if (a.strength !== z.strength) return a.strength < z.strength ? -1 : 1;
      return a.hand < z.hand ? -1 : 1;
    })
    .reduce((sum, { bid }, index) => sum + bid * (index + 1), 0);

console.log("Part 1 -", getTotalWinnings());
console.log("Part 2 -", getTotalWinnings(true));
