import IUser from "@models/IUser";
import LanguageManager from "@utils/language-manager";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  CommandInteraction,
  ComponentType,
  GuildMember,
} from "discord.js";
import { Embed, FetchAndGetLang } from "./shortcuts";

type LeaderboardUser = {
  index: number;
  position: number;
  user: GuildMember | undefined;
  points: number;
  whosThatResponded: { guildId: string; messageId: string; correct: boolean }[];
};
type pointsArray = {
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

  const sortedUsers = usersData
    .filter(
      (user: { points: pointsArray[] }) =>
        user.points.length > 0 &&
        user.points.find((point: pointsArray) => point.guildId === guild!.id)
    )
    .sort(
      (a: { points: pointsArray[] }, b: { points: pointsArray[] }) =>
        b.points.find((point: pointsArray) => point.guildId === guild!.id)!
          .score -
        a.points.find((point: pointsArray) => point.guildId === guild!.id)!
          .score
    );
  if (sortedUsers.length === 0)
    return interaction.editReply({ content: generateLeaderboard.noUsersErr });

  const users = await sortedUsers.reduce(
    async (acc: Promise<any[]>, user: IUser, index: number) => {
      const previousUser = sortedUsers[index - 1];
      const previousPosition = index > 0 ? (await acc)[index - 1].position : -1;
      const currentUser = user;

      const userObject = {
        index: index,
        position:
          previousUser &&
          previousUser.points.find(
            (point: pointsArray) => point.guildId === guild!.id
          )!.score ===
            currentUser.points.find(
              (point: pointsArray) => point.guildId === guild!.id
            )!.score
            ? previousPosition
            : previousPosition + 1,

        user: await guild!.members.fetch(user.id),
        points: user.points.find(
          (point: pointsArray) => point.guildId === guild!.id
        )!.score,
        whosThatResponded: user.whosThatResponded.filter(
          (whosThatResponded: { messageId: string }) =>
            whosThatResponded.messageId === messageId
        ),
      };

      return [...(await acc), userObject];
    },
    Promise.resolve([])
  );

  const user: IUser = users.find(
    (user: LeaderboardUser) => user.user?.id === interaction.user.id
  );

  if (!user)
    return interaction.editReply({
      content: eval(generateLeaderboard.fetchUserErr),
    });

  const userIndex = users.indexOf(user);
  const userRank = userIndex + 1;

  const userRankString = userRank.toString();
  const userRankLastDigit = userRankString[userRankString.length - 1];
  const userRankSuffix =
    userRankLastDigit === "1"
      ? generateLeaderboard.st
      : userRankLastDigit === "2"
      ? generateLeaderboard.nd
      : userRankLastDigit === "3"
      ? generateLeaderboard.rd
      : generateLeaderboard.th;

  const rankEmoji = ["🥇", "🥈", "🥉"];

  const userRankText = `${
    userRank < 4 ? rankEmoji[userRank - 1] : "🏅"
  } ${userRank}${userRankSuffix}`;

  const userPoints = users[userIndex].points;
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
  const embed = Embed()
    .setAuthor({
      name: eval(generateLeaderboard.author),
      iconURL: guild!.iconURL()!,
    })
    .setDescription(
      users
        .slice((currentPage - 1) * pageSize, currentPage * pageSize)
        .map(
          (user: LeaderboardUser) =>
            `${
              user.position + 1 < 4
                ? rankEmoji[user.position]
                : `${user.position + 1}.`
            } ${user.user?.user} — \`${user.points}\` ${
              generateLeaderboard.points
            } ${
              user.whosThatResponded.length > 0
                ? user.whosThatResponded[0].correct
                  ? "✅"
                  : "❌"
                : ""
            }`
        )
        .join("\n")
    )
    .setFooter({
      text: eval(generateLeaderboard.footer),
      iconURL: interaction.user.displayAvatarURL(),
    });

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

  // Send the embed with buttons
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
        GetLeaderboard(usersData, interaction, messageId, currentPage - 1);
      }
    } else if (i.customId === "next-leaderboard") {
      // Go to the next page
      try {
        await i.deferUpdate();
      } catch (error) {}
      collector.stop();
      if (currentPage < totalPages) {
        GetLeaderboard(usersData, interaction, messageId, currentPage + 1);
      }
    }
  });
}

export { GetLeaderboard };
