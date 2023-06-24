import IUser from "@models/IUser";
import LanguageManager from "@utils/language-manager";
import {
  Defer,
  FetchAndGetLang,
  FetchUser,
  UpdateUser,
} from "@utils/shortcuts";
import UserStreak from "@utils/streak-checker";
import { Guild, StringSelectMenuInteraction, TextChannel } from "discord.js";
import type { ShewenyClient } from "sheweny";
import { SelectMenu } from "sheweny";

type WhosThatResponded = {
  guildId: string;
  messageId: string;
  correct: boolean;
};
type pointsArray = {
  guildId: string;
  score: number;
};
export class WhosThatSelect extends SelectMenu {
  constructor(client: ShewenyClient) {
    super(client, [/whosthat-select_.*/]);
  }

  async execute(selectMenu: StringSelectMenuInteraction) {
    const { values, guild, user } = selectMenu;
    await Defer(selectMenu);

    const authorId = selectMenu.customId.split("_")[1];
    const messageId = selectMenu.customId.split("_")[2];

    let userData: IUser = await FetchUser(selectMenu.user.id, guild!);
    const { guildData, lang } = await FetchAndGetLang(guild!);
    const languageManager = new LanguageManager();
    const whosThatSelect =
      languageManager.getInterractionTranslation(lang).whosThatSelect;

    const sourceChannel = (await guild!.channels.fetch(
      guildData!.sourceChannel
    )) as TextChannel;
    if (!sourceChannel)
      return selectMenu.editReply({
        content: whosThatSelect.fetchSourceErr,
      });

    const message = await sourceChannel.messages.fetch(messageId);
    if (!message)
      return selectMenu.editReply({
        content: whosThatSelect.fetchMsgErr,
      });

    if (
      messageId ===
      userData.whosThatResponded.find(
        (res: WhosThatResponded) => res.messageId === messageId
      )?.messageId
    )
      return selectMenu.editReply({
        content: eval(whosThatSelect.alreadyResponded),
      });

    const whosthatRes = [
      ...userData.whosThatResponded,
      { guildId: guild!.id, messageId, correct: authorId === values[0] },
    ];
    await UpdateUser(user.id, guild!, {
      whosThatResponded: whosthatRes,
    });
    let gameScore = 1; // 1 participation point
    const userStreak = UserStreak(whosthatRes);

    if (authorId === values[0]) {
      gameScore += 1 * userStreak; // 1 point per correct answer * streak bonus max 3
      const totalPoints = await UpdateScore(
        user.id,
        userData,
        gameScore,
        guild!
      );
      return selectMenu.editReply({
        content: eval(whosThatSelect.rightAnswerRes),
      });
    }

    const totalPoints = await UpdateScore(user.id, userData, gameScore, guild!);
    return selectMenu.editReply({
      content: eval(whosThatSelect.wrongAnswerRes),
    });
  }
}

async function UpdateScore(
  userId: string,
  userData: IUser,
  gameScore: number,
  guild: Guild
) {
  const pointsArray = userData!.points.find(
    (p: pointsArray) => p.guildId === guild!.id
  )!;
  let totalPoints = 0;
  if (pointsArray) {
    const index = userData!.points.indexOf(pointsArray);
    userData!.points.splice(index, 1);
    totalPoints = pointsArray.score + gameScore;
  } else {
    totalPoints = gameScore;
  }
  await UpdateUser(userId, guild!, {
    points: [...userData!.points, { guildId: guild!.id, score: totalPoints }],
  });

  return totalPoints;
}
