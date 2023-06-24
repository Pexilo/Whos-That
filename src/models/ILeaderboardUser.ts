import { GuildMember } from "discord.js";

export default interface ILeaderboardUser {
  index: number;
  position: number;
  user: GuildMember | undefined;
  points: number;
  streak: number;
  whosThatResponded: { guildId: string; messageId: string; correct: boolean }[];
}
