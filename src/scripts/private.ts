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

try {
  const parsedArguments = parse(Deno.args);

  const day = Number(parsedArguments.day);

  if (!day || Number.isNaN(day) || day < 1 || day > 25) {
    throw new Error(`wrong day: \`${day}\`.`);
  }

  const leaderboardId = Number(parsedArguments.leaderboard);

  if (!leaderboardId || Number.isNaN(leaderboardId)) {
    throw new Error(`wrong leaderboard id: \`${leaderboardId}\`.`);
  }

  const part = Number(parsedArguments.part) as 1 | 2;

  if (!part || Number.isNaN(part) || ![1, 2].includes(part)) {
    throw new Error(`wrong part: \`${part}\`.`);
  }

  let session = parsedArguments.session;

  if (!session || typeof session !== "string") {
    log.info(
      "`--session` argument was not provided; using `SESSION` environment variable instead."
    );
    await import("https://deno.land/std@0.167.0/dotenv/load.ts");
    session = Deno.env.get("SESSION");
  }

  if (!session || typeof session !== "string") {
    throw new Error("no session given.");
  }

  const response = await fetch(
    `https://adventofcode.com/2022/leaderboard/private/view/${leaderboardId}.json`,
    {
      headers: new Headers([["cookie", `session=${session}`]]),
    }
  );

  if (!response.ok) {
    throw new Error(
      `response from adventofcode.com finished with a status: ${response.status}.`
    );
  }

  let data: Leaderboard;

  try {
    data = await response.json();
  } catch (_error) {
    throw new Error(
      `leaderboard \`${leaderboardId}\` can not be accessed with the provided session.`
    );
  }

  const members = Object.entries(data.members);

  const result = members
    .filter(
      ([_memberId, member]) =>
        member.completion_day_level[day]?.[part]?.get_star_ts
    )
    .sort(([_memberAId, memberA], [_memberBId, memberB]) => {
      const memberATimestamp =
        memberA.completion_day_level[day]?.[part]?.get_star_ts;

      const memberBTimestamp =
        memberB.completion_day_level[day]?.[part]?.get_star_ts;

      if (!memberATimestamp && !memberBTimestamp) {
        return 0;
      }

      return memberATimestamp < memberBTimestamp ? -1 : 1;
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
          new Date(member.completion_day_level[day][part].get_star_ts * 1000)
        ),
      };
      return result;
    }, {});

  console.table(result);
} catch (error) {
  log.error(error.message);
}
