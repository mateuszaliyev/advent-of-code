import { EOL } from "@/utilities/eol.ts";
import { getInput } from "@/utilities/get-input.ts";

const input = await getInput(import.meta.url);

export const getRounds = () => input.split(EOL);
