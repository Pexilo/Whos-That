type WhosThatResponded = {
  id: string;
  correct: boolean;
};
export default interface IUser {
  id: string;
  guilds: string[];
  points: number;
  whosThatResponded: WhosThatResponded[];
}
