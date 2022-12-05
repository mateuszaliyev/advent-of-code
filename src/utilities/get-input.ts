export type InputFile = typeof INPUT_FILES[number];

export const INPUT_FILES = ["example", "input"] as const;

export const getInput = async (baseUrl: string, file?: InputFile) =>
  (
    await Deno.readTextFile(
      new URL(
        `./${
          file ??
          (INPUT_FILES.includes(Deno.args[0] as InputFile)
            ? Deno.args[0]
            : "input")
        }.txt`,
        baseUrl
      )
    )
  ).replaceAll("\r\n", "\n");
