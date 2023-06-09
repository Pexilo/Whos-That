import IUser from "@models/IUser";
import { ButtonInteraction, CommandInteraction, GuildMember } from "discord.js";
import { Embed } from "./shortcuts";

async function GetLeaderboard(
  usersData: IUser[],
  interaction: ButtonInteraction | CommandInteraction,
  messageId?: string
) {
  const users = usersData
    .filter((user: { points: number }) => user.points > 0)
    .sort((a: { points: number }, b: { points: number }) => b.points - a.points)
    .map((user: IUser, index: number) => {
      return {
        index: index + 1,
        user: interaction.guild!.members.cache.get(user.id),
        points: user.points,
        whosThatResponded: user.whosThatResponded.filter(
          (whosThatResponded: { id: string }) =>
            whosThatResponded.id === messageId
        ),
      };
    });

  const user = users.find(
    (user: { index: number; user: GuildMember | undefined; points: any }) =>
      user.user?.id === interaction.user.id
  );

  console.log(user?.whosThatResponded[0].correct);

  if (!user)
    return interaction.editReply({
      content: "An error occured. Could not fetch user.",
    });

  const userIndex = users.indexOf(user);
  const userRank = userIndex + 1;

  const userRankString = userRank.toString();
  const userRankLastDigit = userRankString[userRankString.length - 1];
  const userRankSuffix =
    userRankLastDigit === "1"
      ? "st"
      : userRankLastDigit === "2"
      ? "nd"
      : userRankLastDigit === "3"
      ? "rd"
      : "th";

  const rankEmoji = ["🥇", "🥈", "🥉"];

  const userRankText = `${
    userRank < 4 ? rankEmoji[userRank - 1] : "🏅"
  } ${userRank}${userRankSuffix}`;

  const userPoints = user.points;
  const userPointsString = userPoints.toString();
  const userPointsLastDigit = userPointsString[userPointsString.length - 1];
  const userPointsSuffix = userPointsLastDigit === "1" ? "point" : "points";

  const userPointsText = `${userPoints} ${userPointsSuffix}`;

  const embed = Embed()
    .setAuthor({
      name: `Leaderboard for ${interaction.guild!.name}`,
      iconURL: interaction.guild!.iconURL()!,
    })
    .setDescription(
      users
        .slice(0, 10)
        .map(
          (
            user: {
              index: number;
              user: GuildMember | undefined;
              points: number;
              whosThatResponded: { id: string; correct: boolean }[];
            },
            i: number
          ) =>
            `${i < 3 ? rankEmoji[i] : user.index + "."} **${
              user.user?.user.tag
            }** — \`${user.points}\` points ${
              user.whosThatResponded.length > 0 &&
              user.whosThatResponded[0].correct
                ? "✅"
                : "❌"
            }`
        )
        .join("\n")
    )
    .setFooter({
      text: `You are ${userRankText} with ${userPointsText}.`,
      iconURL: interaction.user.displayAvatarURL(),
    });

  return interaction.editReply({ embeds: [embed] });
}

export { GetLeaderboard };
