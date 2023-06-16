type WhosThatResponded = {
  guildId: string;
  messageId: string;
  correct: boolean;
};
type pointsArray = {
  guildId: string;
  score: number;
};
export default interface IUser {
  id: string;
  guilds: string[];
  points: pointsArray[];
  whosThatResponded: WhosThatResponded[];
}
