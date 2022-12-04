import { parse } from "https://deno.land/std@0.167.0/flags/mod.ts";

import { log } from "@/utilities/log.ts";

type CompletionDayLevel = {
  1: {
    get_star_ts: number;
    star_index: number;
  };
  2: {
    get_star_ts: number;
    star_index: number;
  };
};

type Leaderboard = {
  event: string;
  members: Record<string, Member>;
  owner_id: number;
};

type Member = {
  completion_day_level: Record<string, CompletionDayLevel>;
  global_score: number;
  id: number;
  last_star_ts: number;
  local_score: number;
  name: string;
  stars: number;
};

const main = async () => {
  const parsedArguments = parse(Deno.args);

  const day = Number(parsedArguments.day);

  if (!day || Number.isNaN(day) || day < 1 || day > 25) {
    log.error(`wrong day: \`${day}\`.`);
    return;
  }

  const leaderboardId = Number(parsedArguments.leaderboard);

  if (!leaderboardId || Number.isNaN(leaderboardId)) {
    log.error(`wrong leaderboard id: \`${leaderboardId}\`.`);
    return;
  }

  const part = Number(parsedArguments.part) as 1 | 2;

  if (!part || Number.isNaN(part) || ![1, 2].includes(part)) {
    log.error(`wrong part: \`${part}\`.`);
    return;
  }

  let session = parsedArguments.session;

  if (!session || typeof session !== "string") {
    log.info(
      "`--session` argument was not provided; using `SESSION` environment variable instead.",
    );
    await import("https://deno.land/std@0.167.0/dotenv/load.ts");
    session = Deno.env.get("SESSION");
  }

  if (!session || typeof session !== "string") {
    log.error("no session given.");
    return;
  }

  const response = await fetch(
    `https://adventofcode.com/2022/leaderboard/private/view/${leaderboardId}.json`,
    {
      headers: new Headers([["cookie", `session=${session}`]]),
    },
  );

  if (!response.ok) {
    log.error(
      `response from adventofcode.com finished with a status: ${response.status}.`,
    );
    return;
  }

  let data: Leaderboard;

  try {
    data = await response.json();
  } catch (_error) {
    log.error(
      `leaderboard \`${leaderboardId}\` can not be accessed with the provided session.`,
    );
    return;
  }

  const members = Object.entries(data.members);

  const result = members.filter(([_memberId, member]) =>
    member.completion_day_level[day]?.[part]?.get_star_ts
  ).sort(
    ([_memberAId, memberA], [_memberBId, memberB]) => {
      const memberATimestamp = memberA.completion_day_level[day]?.[part]
        ?.get_star_ts;

      const memberBTimestamp = memberB.completion_day_level[day]?.[part]
        ?.get_star_ts;

      if (!memberATimestamp && !memberBTimestamp) {
        return 0;
      }

      return memberATimestamp < memberBTimestamp ? -1 : 1;
    },
  )
    .reduce<
      Record<number, { name: string; points: number; timestamp: string }>
    >(
      (result, [_memberId, member], index) => {
        result[index + 1] = {
          name: member.name,
          points: Math.min(members.length, 100) - index,
          timestamp: new Intl.DateTimeFormat("pl-PL", {
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            month: "2-digit",
            second: "2-digit",
            year: "numeric",
          }).format(
            new Date(member.completion_day_level[day][part].get_star_ts * 1000),
          ),
        };
        return result;
      },
      {},
    );

  console.table(result);
};

try {
  await main();
} catch (error) {
  log.error(error);
}
