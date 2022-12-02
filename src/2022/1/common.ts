import { EOL } from "@/utilities/eol.ts";
import { getInput } from "@/utilities/get-input.ts";

const input = await getInput(import.meta.url);

export const getSums = () =>
  input.split(`${EOL}${EOL}`).map((block) =>
    block.split(EOL).reduce((sum, value) => sum + Number(value), 0)
  );
