import { parse } from "https://deno.land/std@0.167.0/flags/mod.ts";

import { log } from "@/utilities/log.ts";

export const getFileUrl = (baseUrl: string | URL, file?: string) =>
  new URL(file ?? parseInput() ?? "input.txt", baseUrl);

export const getInput = async (baseUrl: string | URL, file?: string) => {
  const fileUrl = getFileUrl(baseUrl, file);

  try {
    return (await Deno.readTextFile(fileUrl)).replaceAll("\r\n", "\n");
  } catch (_error) {
    log.error(`could not read \`${fileUrl.href}\` file.`);
  }

  return "";
};

export const parseInput = () => parse(Deno.args).input;
