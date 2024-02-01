import { parse } from "std/flags/mod.ts";

import {
  DOMParser,
  type Element,
  type Node,
} from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";
import { z } from "https://deno.land/x/zod/mod.ts";

import { log } from "@/utilities/log.ts";
import { daySchema, sessionSchema, yearSchema } from "@/utilities/schema.ts";

const isElement = (node: Node): node is Element =>
  node.nodeType === node.ELEMENT_NODE;

const inputSchema = z
  .object({
    _: z.string().array().length(0).optional(),
    day: daySchema,
    session: sessionSchema.optional(),
    year: yearSchema,
  })
  .strict()
  .refine(
    ({ day, year }) =>
      new Date() >=
      new Date(`${year}-12-${`${day}`.padStart(2, "0")}T00:00:00.000+14:00`),
    ({ day, year }) => ({
      message: `The puzzle for day ${day} of year ${year} is not available yet.`,
      path: ["_"],
    }),
  );

try {
  const input = inputSchema.safeParse(parse(Deno.args));

  if (!input.success) throw new Error(input.error.issues[0]?.message);

  let session = input.data.session;

  if (!session) {
    await import("https://deno.land/std/dotenv/load.ts");

    const sessionParseResult = sessionSchema.safeParse(Deno.env.get("SESSION"));

    if (!sessionParseResult.success) {
      throw new Error(
        "neither `--session` argument nor `SESSION` environment varirable were provided.",
      );
    }

    session = sessionParseResult.data;

    log.info(
      "`--session` argument was not provided; using `SESSION` environment variable instead.",
    );
  }

  const response = await fetch(
    `https://adventofcode.com/${input.data.year}/day/${input.data.day}`,
    {
      headers: new Headers([["cookie", `session=${session}`]]),
    },
  );

  if (!response.ok) {
    throw new Error(
      `response from ${response.url} finished with a status: ${response.status}.`,
    );
  }

  const html = (await response.text())
    .replace(
      /<code><em>(.+?)<\/em><\/code>/gs,
      (_, code) => `<em><code>${code}</code></em>`,
    )
    .replace(
      /<pre><code>(.+?)<\/code><\/pre>/gs,
      (_, code) => `<pre>${code}</pre>`,
    );

  const document = new DOMParser().parseFromString(html, "text/html")!;

  let content = "";

  for (const article of document.querySelectorAll("article")) {
    if (!isElement(article)) continue;

    const nodes: (Node | string)[] = [...article.childNodes];

    while (nodes.length) {
      const node = nodes.shift()!;

      if (typeof node === "string") {
        content += node;
        continue;
      }

      if (!isElement(node)) {
        content += node.textContent.replace(/\*/gs, "\\*");
        continue;
      }

      if (node.tagName === "A") {
        content += "[";
        nodes.unshift(...node.childNodes, `](${node.getAttribute("href")})`);
        continue;
      }

      if (node.tagName === "CODE") {
        content += "`";
        nodes.unshift(...node.childNodes, "`");
        continue;
      }

      if (node.tagName === "EM") {
        content += "**";
        nodes.unshift(...node.childNodes, "**");
        continue;
      }

      if (node.tagName === "H2") {
        content += `\n\n${node.id === "part2" ? "##" : "#"} ${node.textContent
          .split("---")[1]!
          .trim()}`;
        continue;
      }

      if (node.tagName === "LI") {
        content += "- ";
        nodes.unshift(...node.childNodes);
        continue;
      }

      if (node.tagName === "P") {
        content += "\n\n";
        nodes.unshift(...node.childNodes);
        continue;
      }

      if (node.tagName === "PRE") {
        content += "\n\n```\n";
        nodes.unshift(...node.childNodes, "```");
        continue;
      }

      if (node.tagName === "UL") {
        content += "\n\n";
        nodes.unshift(...node.childNodes);
        continue;
      }

      nodes.unshift(...node.childNodes);
    }
  }

  content = content
    .trim()
    .replace(/\n{3,}/gs, "\n\n")
    .replace(/[^\n]```/gs, "\n```");

  const path = new URL(
    `..\/${input.data.year}/${`${input.data.day}`.padStart(2, "0")}/README.md`,
    import.meta.url,
  );

  await Deno.writeTextFile(path, content);
  log.info(`content successfully saved to a "${path.pathname}" file.`);
} catch (error) {
  log.error(error.message);
  Deno.exit();
}
