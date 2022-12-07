import { getInput } from "@/utilities/get-input.ts";

const input = await getInput(import.meta.url);

const resolvePath = (path: string[]) => `/${path.slice(1).join("/")}`;

export const getDirectories = () =>
  input
    .split("\n")
    .slice(1)
    .reduce(
      (fileSystem, line) => {
        if (line.startsWith("$ cd ..")) {
          fileSystem.path.pop();
          return fileSystem;
        }

        if (line.startsWith("$ cd")) {
          const directory = line.split(" ")[2];

          fileSystem.path.push(directory);
          fileSystem.directories.set(resolvePath(fileSystem.path), 0);

          return fileSystem;
        }

        if (/\d/.test(line.split(" ")[0])) {
          const segments = [...fileSystem.path];

          while (segments.length) {
            fileSystem.directories.set(
              resolvePath(segments),
              fileSystem.directories.get(resolvePath(segments))! +
                Number(line.split(" ")[0])
            );

            segments.pop();
          }

          return fileSystem;
        }

        return fileSystem;
      },
      {
        directories: new Map<string, number>([["/", 0]]),
        path: ["/"],
      }
    ).directories;
