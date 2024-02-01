import { sum } from "@/utilities/array.ts";
import { getInput } from "@/utilities/get-input.ts";

const calibrationDocument = (await getInput(import.meta.url)).split("\n");

const digitsRegularExpression = "one|two|three|four|five|six|seven|eight|nine";

const digitsMap = Object.fromEntries(
  digitsRegularExpression.split("|").map((digit, index) => [digit, index + 1])
);

const getCalibrationValues = (
  calibrationDocument: string[],
  withSpelledOutDigits = false
) =>
  calibrationDocument.map((line) => {
    const matches = [
      ...line.matchAll(
        withSpelledOutDigits
          ? new RegExp(`(?=(\\d|${digitsRegularExpression}))`, "g")
          : /(?=(\d))/g
      ),
    ].map((matchArray) => matchArray[1]);

    const firstDigit = digitsMap[matches.at(0)!] ?? matches.at(0);
    const lastDigit = digitsMap[matches.at(-1)!] ?? matches.at(-1);

    return Number(`${firstDigit}${lastDigit}`);
  });

console.log("Part 1 -", sum(getCalibrationValues(calibrationDocument)));
console.log("Part 2 -", sum(getCalibrationValues(calibrationDocument, true)));
