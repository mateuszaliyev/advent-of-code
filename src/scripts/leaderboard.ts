import { parse } from "https://deno.land/std/flags/mod.ts";
import { z } from "https://deno.land/x/zod/mod.ts";

import { log } from "@/utilities/log.ts";
import {
  daySchema,
  leaderboardSchema,
  sessionSchema,
  yearSchema,
} from "@/utilities/schema.ts";

const inputSchema = z
  .object({
    _: z.string().array().length(0).optional(),
    day: daySchema.optional(),
    leaderboard: leaderboardSchema.optional(),
    session: sessionSchema.optional(),
    year: yearSchema,
  })
  .strict()
  .transform(({ day, year, ...other }) => ({ ...other, day, year }))
  .refine(
    ({ day, year }) =>
      typeof day === "undefined"
        ? true
        : new Date() >=
          new Date(
            `${year}-12-${`${day}`.padStart(2, "0")}T00:00:00.000+14:00`,
          ),
    ({ day, year }) => ({
      message: `The puzzle for day ${day} of year ${year} is not available yet.`,
      path: ["_"],
    }),
  );

const responseSchema = z
  .object({
    event: z.string(),
    members: z.record(
      z.string(),
      z
        .object({
          completion_day_level: z.record(
            z.record(
              z.enum(["1", "2"]),
              z
                .object({
                  get_star_ts: z.number(),
                  star_index: z.number(),
                })
                .transform(({ get_star_ts, star_index }) => ({
                  starIndex: star_index,
                  starTimestamp: get_star_ts,
                })),
            ),
          ),
          global_score: z.number(),
          id: z.number(),
          local_score: z.number(),
          last_star_ts: z.number(),
          name: z.string(),
          stars: z.number(),
        })
        .transform(
          ({
            completion_day_level,
            global_score,
            last_star_ts,
            local_score,
            ...other
          }) => ({
            ...other,
            completionDayLevel: completion_day_level,
            globalScore: global_score,
            lastStarTimestamp: last_star_ts,
            localScore: local_score,
          }),
        ),
    ),
    owner_id: z.number(),
  })
  .transform(({ owner_id, ...other }) => ({
    ...other,
    ownerId: owner_id,
  }));

try {
  const input = inputSchema.safeParse(parse(Deno.args));

  if (!input.success) throw new Error(input.error.issues[0]?.message);

  let leaderboard = input.data.leaderboard;
  let session = input.data.session;

  if (!leaderboard || !session) {
    await import("https://deno.land/std/dotenv/load.ts");

    const leaderboardParseResult = leaderboardSchema.safeParse(
      Deno.env.get("LEADERBOARD"),
    );
    const sessionParseResult = sessionSchema.safeParse(Deno.env.get("SESSION"));

    if (!sessionParseResult.success) {
      throw new Error(
        "neither `--session` argument nor `SESSION` environment varirable were provided.",
      );
    }

    if (!leaderboardParseResult.success) {
      throw new Error(
        "neither `--leaderboard` argument nor `LEADERBOARD` environment varirable were provided.",
      );
    }

    leaderboard = leaderboardParseResult.data;
    session = sessionParseResult.data;

    log.info(
      "`--session` argument was not provided; using `SESSION` environment variable instead.",
    );

    log.info(
      "`--leaderboard` argument was not provided; using `LEADERBOARD` environment variable instead.",
    );
  }

  const response = await fetch(
    `https://adventofcode.com/2023/leaderboard/private/view/${leaderboard}.json`,
    {
      headers: new Headers([["cookie", `session=${session}`]]),
    },
  );

  if (!response.ok) {
    throw new Error(
      `response from ${response.url} finished with a status: ${response.status}.`,
    );
  }

  const output = responseSchema.safeParse(await response.json());

  if (!output.success) {
    throw new Error(`invalid response. ${output.error.issues[0]?.message}`);
  }

  if (typeof input.data.day !== "undefined") {
    const day = input.data.day;
    const members = Object.entries(output.data.members);

    for (const part of ["1", "2"] as const) {
      const result = members
        .filter(
          ([_, member]) =>
            member.completionDayLevel[day]?.[part]?.starTimestamp,
        )
        .sort(([_memberAId, memberA], [_memberBId, memberB]) => {
          const memberATimestamp =
            memberA.completionDayLevel[day]?.[part]?.starIndex;

          const memberBTimestamp =
            memberB.completionDayLevel[day]?.[part]?.starIndex;

          if (!memberATimestamp && !memberBTimestamp) {
            return 0;
          }

          return memberATimestamp! < memberBTimestamp! ? -1 : 1;
        })
        .reduce<
          Record<number, { name: string; points: number; timestamp: string }>
        >((result, [_memberId, member], index) => {
          result[index + 1] = {
            name: member.name,
            points: Math.min(members.length, 100) - index,
            timestamp: new Intl.DateTimeFormat(undefined, {
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              month: "2-digit",
              second: "2-digit",
              year: "numeric",
            }).format(
              new Date(
                member.completionDayLevel[day]![part]!.starTimestamp * 1000,
              ),
            ),
          };
          return result;
        }, {});

      console.table(result);
    }
    Deno.exit(0);
  }

  const members = Object.entries(output.data.members)
    .map(([_, member]) => member)
    .filter(({ localScore }) => localScore)
    .sort((a, z) => z.localScore - a.localScore);

  const latestStarDay = members.reduce(
    (max, { completionDayLevel }) =>
      Math.max(max, ...Object.keys(completionDayLevel).map(Number)),
    0,
  );

  const length = {
    name: Math.max(
      "Uczestnicy".length,
      members.reduce((max, { name }) => Math.max(max, name.length), 0),
    ),
    points: Math.max("Punkty".length, members[0]!.localScore.toString().length),
    position: members.length.toString().length,
  };

  let markdown = `\`\`\`\n${"".padEnd(
    length.position - 1,
    " ",
  )}. | Uczestnik${"".padEnd(length.name - 9, " ")} | ${"".padEnd(
    length.points - 6,
    " ",
  )}Punkty | Gwiazdki`;

  for (let index = 0; index < members.length; index++) {
    const member = members[index]!;
    const position = index + 1;

    let starString = "";

    for (let day = 1; day <= latestStarDay; day++) {
      const stars = Object.keys(member.completionDayLevel[day] ?? {}).length;
      starString += stars === 2 ? "★" : stars === 1 ? "☆" : "　";
    }

    starString = starString.trim();

    markdown += `\n${"".padEnd(
      length.position - position.toString().length,
      " ",
    )}${position} | ${member.name}${"".padEnd(
      length.name - member.name.length,
      " ",
    )} | ${"".padEnd(
      length.points - member.localScore.toString().length,
      " ",
    )}${member.localScore} | ${starString}`;
  }

  const puzzleTime = "05:00:00.000Z";
  const todaysPuzzle = new Date(
    `${new Date().toISOString().slice(0, 10)}T${puzzleTime}`,
  );
  const tomorrowsPuzzle = new Date(todaysPuzzle);
  tomorrowsPuzzle.setDate(tomorrowsPuzzle.getDate() + 1);
  const now = new Date();
  const nextPuzzle =
    now.getMonth() < 11
      ? new Date(`${now.getFullYear()}-12-01T${puzzleTime}`)
      : now.getDate() > 25 ||
        (now.getDate() === 25 && todaysPuzzle.getTime() < now.getTime())
      ? new Date(`${now.getFullYear() + 1}-12-01T${puzzleTime}`)
      : tomorrowsPuzzle;

  markdown += `\n\`\`\`\n**Ostatnia aktualizacja** <t:${Math.floor(
    now.getTime() / 1000,
  )}:R>\n**Kolejne wyzwanie** <t:${Math.floor(nextPuzzle.getTime() / 1000)}:R>`;
  console.log(markdown);
} catch (error) {
  log.error(error.message);
  Deno.exit(1);
}
