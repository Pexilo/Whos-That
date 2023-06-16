import IWTRes from "@models/IWTRes";
import LanguageManager from "@utils/language-manager";
import {
  Defer,
  FetchAndGetLang,
  FetchUser,
  UpdateUser,
} from "@utils/shortcuts";
import { StringSelectMenuInteraction, TextChannel } from "discord.js";
import type { ShewenyClient } from "sheweny";
import { SelectMenu } from "sheweny";

export class WhosThatSelect extends SelectMenu {
  constructor(client: ShewenyClient) {
    super(client, [/whosthat-select_.*/]);
  }

  async execute(selectMenu: StringSelectMenuInteraction) {
    const { values, guild, user } = selectMenu;
    await Defer(selectMenu);

    const authorId = selectMenu.customId.split("_")[1];
    const messageId = selectMenu.customId.split("_")[2];

    const userData = await FetchUser(selectMenu.user.id, guild!);
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

    const messageAlreadyResponded = userData.whosThatResponded.find(
      (r: IWTRes) => r.id === messageId
    );
    if (messageAlreadyResponded && messageAlreadyResponded.id === messageId)
      return selectMenu.editReply({
        content: eval(whosThatSelect.alreadyResponded),
      });

    const whosthatRes = [
      ...userData.whosThatResponded,
      { id: messageId, correct: authorId === values[0] },
    ];
    await UpdateUser(user.id, guild!, {
      whosThatResponded: whosthatRes,
    });

    if (authorId === values[0]) {
      await UpdateUser(user.id, guild!, {
        points: userData!.points + 2,
      });

      const totalPoints = userData!.points + 2;
      return selectMenu.editReply({
        content: eval(whosThatSelect.rightAnswerRes),
      });
    } else {
      await UpdateUser(user.id, guild!, {
        points: userData!.points + 1,
      });

      return selectMenu.editReply({
        content: eval(whosThatSelect.wrongAnswerRes),
      });
    }
  }
}
