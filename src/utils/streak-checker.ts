import ILeaderboardUser from "@models/ILeaderboardUser";

export default function UserStreak(
  whosThatGuild: ILeaderboardUser["whosThatResponded"]
): number {
  const last3Whosthat = whosThatGuild.slice(-3);
  let streak = 0;
  for (const entry of last3Whosthat) {
    if (entry.correct) {
      streak++;
    } else {
      streak = 0;
    }
  }
  return streak;
}
