import ILeaderboardUser from "@models/ILeaderboardUser";
import IUser from "@models/IUser";
import LanguageManager from "@utils/language-manager";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  CommandInteraction,
  ComponentType,
} from "discord.js";
import { Embed, FetchAndGetLang } from "./shortcuts";
import UserStreak from "./streak-checker";

type PointsArray = {
  guildId: string;
  score: number;
};
async function GetLeaderboard(
  usersData: IUser[],
  interaction: ButtonInteraction | CommandInteraction,
  messageId?: string,
  page?: number
) {
  const { guild } = interaction;
  const guildName = guild!.name;
  const config = require("src/config.ts");

  const { lang } = await FetchAndGetLang(guild!);
  const languageManager = new LanguageManager();
  const generateLeaderboard =
    languageManager.getUtilsTranslation(lang).generateLeaderboard;

  /* This code block is filtering and sorting an array of user data (`usersData`) to create a sorted
  array of users (`sortedUsers`) who have points in the current guild (`guild`) and then checking if
  the resulting array is empty. If the array is empty, it returns an error message. */
  const sortedUsers = usersData
    .filter((user: { points: PointsArray[] }) =>
      user.points.find(
        (point: PointsArray) => point.guildId === guild!.id && point.score > 0
      )
    )
    .sort(
      (a: { points: PointsArray[] }, b: { points: PointsArray[] }) =>
        b.points.find((point: PointsArray) => point.guildId === guild!.id)!
          .score -
        a.points.find((point: PointsArray) => point.guildId === guild!.id)!
          .score
    );
  if (sortedUsers.length === 0)
    return interaction.editReply({ content: generateLeaderboard.noUsersErr });

  const fetchUser = async (user: IUser) => {
    try {
      return await guild!.members.fetch(user.id);
    } catch (error) {
      return null;
    }
  };

  /* This code block is creating an array of leaderboard users by filtering and sorting the input
`usersData` array, and then using the `reduce()` method to transform each user object into a new
object with additional properties. */
  const users = await sortedUsers.reduce(
    async (acc: Promise<any[]>, user: IUser, index: number) => {
      const previousUser = sortedUsers[index - 1];
      const previousPosition = index > 0 ? (await acc)[index - 1].position : -1;
      const currentUser = user;

      const whosThatGuild = currentUser.whosThatResponded.filter(
        (whosThatResponded: { guildId: string }) =>
          whosThatResponded.guildId === guild!.id
      );

      const userObject = {
        index: index,
        position:
          previousUser &&
          previousUser.points.find(
            (point: PointsArray) => point.guildId === guild!.id
          )!.score ===
            currentUser.points.find(
              (point: PointsArray) => point.guildId === guild!.id
            )!.score
            ? previousPosition
            : previousPosition + 1,
        user: await fetchUser(user),
        points: user.points.find(
          (point: PointsArray) => point.guildId === guild!.id
        )!.score,
        streak: UserStreak(whosThatGuild),
        whosThatResponded: user.whosThatResponded.filter(
          (whosThatResponded: { messageId: string }) =>
            whosThatResponded.messageId === messageId
        ),
      };

      return [...(await acc), userObject];
    },
    Promise.resolve([])
  );

  const user: ILeaderboardUser = users.find(
    (user: ILeaderboardUser) => user.user?.id === interaction.user.id
  );

  if (!user)
    return interaction.editReply({
      content: eval(generateLeaderboard.fetchUserErr),
    });

  const userIndex = users.findIndex(
    (user: ILeaderboardUser) => user.user?.id === interaction.user.id
  );

  //User rank
  const userRank = user.position + 1;
  const userRankToString = userRank.toString();
  const rankEmoji = ["🥇", "🥈", "🥉"];
  const userRankLastDigit = userRankToString[userRankToString.length - 1];
  const userRankSuffix =
    userRankLastDigit === "1"
      ? generateLeaderboard.st
      : userRankLastDigit === "2"
      ? generateLeaderboard.nd
      : userRankLastDigit === "3"
      ? generateLeaderboard.rd
      : generateLeaderboard.th;
  const userRankText = `${
    userRank < 4 ? rankEmoji[userRank - 1] : "🏅"
  } ${userRank}${userRankSuffix}`;

  //User points
  const userPoints = user.points;
  const userPointsString = userPoints.toString();
  const userPointsLastDigit = userPointsString[userPointsString.length - 1];
  const userPointsSuffix =
    userPointsLastDigit === "1"
      ? generateLeaderboard.point
      : generateLeaderboard.points;

  // Split users into multiple pages with a page size of 10
  const pageSize = 10;
  const totalPages = Math.ceil(users.length / pageSize);
  const currentPage = page ? page : Math.floor(userIndex / pageSize) + 1;

  const userPointsText = `${userPoints} ${userPointsSuffix}`;
  await UpdateInteraction(users, interaction, currentPage);

  async function UpdateInteraction(
    users: ILeaderboardUser[],
    interaction: CommandInteraction | ButtonInteraction,
    currentPage: number
  ) {
    const { guild } = interaction;

    // Create pagination buttons
    const previousButton = new ButtonBuilder()
      .setCustomId("previous-leaderboard")
      .setEmoji("◀️")
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(currentPage === 1);

    const nextButton = new ButtonBuilder()
      .setCustomId("next-leaderboard")
      .setEmoji("▶️")
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(currentPage === totalPages);

    const buttonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
      previousButton,
      nextButton
    );

    const leaderboardDescription = users
      .slice((currentPage - 1) * pageSize, currentPage * pageSize)
      .filter((user: ILeaderboardUser) => user.user)
      .map(
        (user: ILeaderboardUser) =>
          `${
            user.position + 1 < 4
              ? rankEmoji[user.position]
              : `⠀${user.position + 1}.`
          } ${user.user?.user} — ${
            user.streak > 1 ? "🔥".repeat(user.streak) + " " : ""
          } \`${user.points}\` ${generateLeaderboard.points} ${
            user.whosThatResponded.length > 0
              ? user.whosThatResponded[0].correct
                ? "✅"
                : "❌"
              : ""
          }`
      )
      .join("\n");

    const embed = Embed()
      .setAuthor({
        name: eval(generateLeaderboard.author),
        iconURL: guild!.iconURL()!,
      })
      .setDescription(leaderboardDescription)
      .setFooter({
        text: eval(generateLeaderboard.footer),
        iconURL: interaction.user.displayAvatarURL(),
      });

    const reply = await interaction.editReply({
      embeds: [embed],
      components: [buttonRow],
    });

    // Create a collector to listen for button interactions
    const collector = reply.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 60000,
    });

    // Handle button interactions
    collector.on("collect", async (i: ButtonInteraction) => {
      if (i.customId === "previous-leaderboard") {
        // Go to the previous page
        try {
          await i.deferUpdate();
        } catch (error) {}
        collector.stop();
        if (currentPage > 1) {
          UpdateInteraction(users, interaction, currentPage - 1);
        }
      } else if (i.customId === "next-leaderboard") {
        // Go to the next page
        try {
          await i.deferUpdate();
        } catch (error) {}
        collector.stop();
        if (currentPage < totalPages) {
          UpdateInteraction(users, interaction, currentPage + 1);
        }
      }
    });
  }
}

export { GetLeaderboard };
