export type InputFile = typeof INPUT_FILES[number];

export const INPUT_FILES = ["example", "input"] as const;

export const getInput = (baseUrl: string, file?: InputFile) =>
  Deno.readTextFile(
    new URL(
      `./${
        file ??
          (INPUT_FILES.includes(Deno.args[0] as InputFile)
            ? Deno.args[0]
            : "input")
      }.txt`,
      baseUrl,
    ),
  );
